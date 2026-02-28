"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

const MAX_FILE_SIZE_MB = 5;
const MAX_TOTAL_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

interface Category {
  id: number;
  name: string;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function CreatePostPage() {
  const { token, username } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!localStorage.getItem("jwt_token")) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://api.webnote.uz/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const oversizedFiles: string[] = [];
    const validFiles: File[] = [];

    let currentTotalSize = images.reduce((sum, file) => sum + file.size, 0);

    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizedFiles.push(file.name);
        continue;
      }

      if (currentTotalSize + file.size > MAX_TOTAL_SIZE_BYTES) {
        setFileError(
          `Cannot add more files. Total upload size would exceed ${MAX_TOTAL_SIZE_MB}MB.`,
        );
        break;
      }

      validFiles.push(file);
      currentTotalSize += file.size;
    }

    if (oversizedFiles.length > 0) {
      setFileError(
        `The following files exceed the ${MAX_FILE_SIZE_MB}MB limit: ${oversizedFiles.join(", ")}`,
      );
    }

    setImages((prev) => [...prev, ...validFiles]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (fileError) setFileError(null);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      alert("You must be logged in to create a post.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    const postData = {
      title,
      content: description,
      authorUsername: username, // Using username directly from auth context
      categoryIds: selectedCategoryIds,
      tags: tags,
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(postData)], { type: "application/json" }),
    );

    try {
      const response = await fetch("https://api.webnote.uz/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || "Failed to create post.");
      }

      alert("Post Created Successfully!");
      router.push("/");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Post ✍️
          </h1>
          <p className="text-gray-500 mb-8">
            Share your thoughts with the world.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categories <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                      selectedCategoryIds.includes(cat.id)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {selectedCategoryIds.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Please select at least one category.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 bg-white">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-500 font-bold focus:outline-none"
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={
                    tags.length === 0 ? "Type tag and press Enter..." : ""
                  }
                  className="flex-1 p-1 outline-none text-sm min-w-30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write something amazing..."
                className="w-full p-3 border border-gray-300 rounded-lg h-48 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Images
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition cursor-pointer ${
                  fileError
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <div className="text-gray-500">
                  <span className="font-semibold text-blue-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Max file size: {MAX_FILE_SIZE_MB}MB. Total limit:{" "}
                  {MAX_TOTAL_SIZE_MB}MB.
                </p>
              </div>

              {fileError && (
                <div className="mt-2 text-sm text-red-600 bg-red-100 p-3 rounded-lg">
                  {fileError}
                </div>
              )}

              {images.length > 0 && (
                <div className="mt-4 space-y-2">
                  {images.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-10 h-10 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="text-xs">
                          <p className="font-medium text-gray-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-gray-500">
                            {formatBytes(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 font-bold text-lg p-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !!fileError}
                className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-all shadow-md ${
                  isLoading || !!fileError
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-900 hover:bg-gray-800 hover:shadow-lg"
                }`}
              >
                {isLoading ? "Publishing..." : "Publish Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
