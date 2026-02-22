import { UserResponseDTO } from "@/app/types";

interface UserProfileHeaderProps {
  user: UserResponseDTO;
  postCount: number;
}

export default function UserProfileHeader({
  user,
  postCount,
}: UserProfileHeaderProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-8 mb-12 text-center shadow-sm">
      <div className="relative inline-block mb-4">
        {user.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt={user.username}
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-sm"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-4xl font-bold text-gray-400 uppercase border-4 border-white shadow-sm">
            {user.firstName?.[0] || "U"}
            {user.lastName?.[0] || ""}
          </div>
        )}
      </div>

      <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">
        {user.firstName} {user.lastName}
      </h1>

      <p className="text-gray-500 font-medium mb-4">@{user.username}</p>

      {user.bio && (
        <p className="text-gray-600 max-w-lg mx-auto mb-6 leading-relaxed">
          {user.bio}
        </p>
      )}

      <div className="flex justify-center items-center space-x-8 border-t border-gray-100 pt-6 mt-6">
        <div className="text-center">
          <span className="block text-xl font-bold text-gray-900">
            {postCount}
          </span>
          <span className="text-sm text-gray-500 uppercase tracking-wide">
            Posts
          </span>
        </div>
        {/* Add more stats here if available, e.g., Followers, Following */}
      </div>
    </div>
  );
}
