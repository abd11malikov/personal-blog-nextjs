"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface SocialLinks {
  [key: string]: string;
}

export default function SettingsPage() {
  const { token, username } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    username: "",
  });

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [showAddSocial, setShowAddSocial] = useState(false);

  // Image State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    async function fetchUserData() {
      try {
        const response = await fetch(
          `https://api.webnote.uz/api/users/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            bio: data.bio || "",
            username: data.username || "",
          });
          setSocialLinks(data.socialMediaLinks || {});
          setCurrentImageUrl(data.profileImageUrl || "");
          setPreviewUrl(data.profileImageUrl || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [token, username, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const addSocialLink = () => {
    if (newLinkName && newLinkUrl) {
      setSocialLinks((prev) => ({
        ...prev,
        [newLinkName.toLowerCase()]: newLinkUrl,
      }));
      setNewLinkName("");
      setNewLinkUrl("");
      setShowAddSocial(false);
    }
  };

  const removeSocialLink = (key: string) => {
    const updated = { ...socialLinks };
    delete updated[key];
    setSocialLinks(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Backend expects UserRequestDTO in "data" part and MultipartFile in "image" part
      const dataPayload = {
        ...formData,
        socialMediaLinks: socialLinks,
      };

      const formDataToSend = new FormData();
      formDataToSend.append(
        "data",
        new Blob([JSON.stringify(dataPayload)], { type: "application/json" }),
      );

      if (selectedFile) {
        formDataToSend.append("image", selectedFile);
      }

      const response = await fetch(
        `https://api.webnote.uz/api/users/${username}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        },
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => router.push(`/${username}`), 1500);
      } else {
        setMessage({
          type: "error",
          text: "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please check your connection.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
              Settings
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Manage your public profile and presence
            </p>
          </div>
          <Link
            href={`/${username}`}
            className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-all uppercase tracking-widest"
          >
            Cancel
          </Link>
        </div>

        {message && (
          <div
            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}
          >
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Profile Photo Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
              Profile Photo
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-300">
                      {formData.firstName?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 bg-gray-900 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-gray-900 font-bold">
                  Change profile picture
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  Upload a high-quality image. PNG or JPG preferred.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Choose File
                </button>
              </div>
            </div>
          </section>

          {/* Personal Info Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                  placeholder="Doe"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-gray-900 outline-none transition-all"
                  placeholder="Write a short bio about yourself..."
                />
              </div>
            </div>
          </section>

          {/* Social Links Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-gray-900">
                Social Connections
              </h2>
              <button
                type="button"
                onClick={() => setShowAddSocial(!showAddSocial)}
                className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {showAddSocial && (
              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Platform (e.g. GitHub)"
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="URL (https://...)"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddSocial(false)}
                    className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addSocialLink}
                    className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-bold shadow-md hover:bg-gray-800"
                  >
                    Add Link
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {Object.entries(socialLinks).length > 0 ? (
                Object.entries(socialLinks).map(([platform, url]) => (
                  <div
                    key={platform}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <span className="text-[10px] font-black uppercase text-gray-400">
                          {platform.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 capitalize">
                          {platform}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[200px] md:max-w-md">
                          {url}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSocialLink(platform)}
                      className="p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-400 text-sm italic">
                  No social links added yet.
                </p>
              )}
            </div>
          </section>

          {/* Footer Save Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={saving}
              className="px-12 py-4 bg-gray-900 text-white rounded-full font-bold text-sm uppercase tracking-widest shadow-2xl hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Saving Changes
                </>
              ) : (
                "Save Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
