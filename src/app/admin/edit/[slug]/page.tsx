"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { CategoryDTO, PostResponseDTO } from "@/app/types";

const MAX_FILE_SIZE_MB = 5;
const MAX_TOTAL_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function EditPostPage() {
  
  const params = useParams();
  const slug = params.slug as string;
  const { token, username: loggedInUsername } = useAuth();
  const router = useRouter();

  const [postId, setPostId] = useState<number | null>(null);
  const [authorUsername, setAuthorUsername] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [categories, setCategories] = useState<CategoryDTO[]>([]);

  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/categories");
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

  // Fetch post data and verify authorship
  useEffect(() => {
    if (!localStorage.getItem("jwt_token")) {
      router.push("/login");
      return;
    }

    async function fetchPost() {
      if (!loggedInUsername) return;

      try {
        const response = await fetch(
          `http://localhost:8080/api/posts/slug/${slug}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch post");
        }
        const post: PostResponseDTO = await response.json();

        // Verification using authorUsername from the updated DTO
        if (post.authorUsername !== loggedInUsername) {
          alert("You are not authorized to edit this post.");
          router.push("/");
          return;
        }

        setPostId(post.id);
        setAuthorUsername(post.authorUsername);
        setTitle(post.title);
        setDescription(post.content);
        setTags(post.tags || []);
        setExistingImageUrls(post.imageUrls || []);
        setSelectedCategoryIds(
          post.categories?.map((c: CategoryDTO) => c.id) || [],
        );
      } catch (error) {
        console.error("Error loading post:", error);
        alert("Could not load the post.");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [slug, router, loggedInUsername]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const oversizedFiles: string[] = [];
    const validFiles: File[] = [];

    let currentTotalSize = newImages.reduce((sum, file) => sum + file.size, 0);

    for (const file of files) {
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
        `The following files exceed the ${MAX_FILE_SIZE_MB}MB limit: ${oversizedFiles.join(
          ", ",
        )}`,
      );
    }

    setNewImages((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeNewFile = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (urlToRemove: string) => {
    setExistingImageUrls(
      existingImageUrls.filter((url) => url !== urlToRemove),
    );
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
    if (!postId || !authorUsername) return;
    setIsUpdating(true);

    const formData = new FormData();

    // Append new images
    newImages.forEach((image) => {
      formData.append("images", image);
    });

    const postData = {
      title,
      content: description,
      authorUsername: authorUsername, // Using authorUsername in payload for edit
      categoryIds: selectedCategoryIds,
      tags: tags,
      existingImageUrls: existingImageUrls, // Tell backend which current images to keep
    };

    formData.append(
      "data",
      new Blob([JSON.stringify(postData)], { type: "application/json" }),
    );

    try {
      const response = await fetch(
        `http://localhost:8080/api/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update post");
      }


      const updatedPost = await response.json();
      const newSlug = updatedPost.slug || slug;

      alert("Post Updated Successfully!");
      router.push(`/post/${newSlug}`);


      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        "Error updating post: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Post 📝
          </h1>
          <p className="text-gray-500 mb-8">Refine your masterpiece.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            {/* Categories */}
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
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-md"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
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
                  placeholder="Add tags..."
                  className="flex-1 p-1 outline-none text-sm min-w-[120px]"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg h-64 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                required
              />
            </div>

            {/* Existing Images */}
            {existingImageUrls.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {existingImageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden border bg-gray-50"
                    >
                      <img
                        src={url}
                        alt="existing"
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload New Images
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                  fileError
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:bg-gray-50 hover:border-blue-400"
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
                <span className="text-blue-600 font-semibold">
                  Click to add more images
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  Max file size: {MAX_FILE_SIZE_MB}MB
                </p>
              </div>

              {fileError && (
                <div className="mt-2 text-sm text-red-600 bg-red-100 p-2 rounded border border-red-200">
                  {fileError}
                </div>
              )}

              {newImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  {newImages.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border text-xs"
                    >
                      <span className="truncate max-w-[200px]">
                        {file.name} ({formatBytes(file.size)})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewFile(index)}
                        className="text-red-500 font-bold hover:text-red-700"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-6 rounded-lg text-gray-700 font-semibold border border-gray-300 hover:bg-gray-50 transition shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || !!fileError}
                className="flex-[2] py-3 px-6 rounded-lg text-white font-semibold bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 transition shadow-md"
              >
                {isUpdating ? "Saving Changes..." : "Update Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
