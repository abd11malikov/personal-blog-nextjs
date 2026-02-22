import { UserResponseDTO } from "@/app/types";

interface UserProfileHeaderProps {
  user: UserResponseDTO;
  postCount: number;
}

/**
 * Helper to map platform names to SVG icons
 */
const SocialIcon = ({ platform, url }: { platform: string; url: string }) => {
  const lowerPlatform = platform.toLowerCase();

  // Base styles for icons
  const iconProps = {
    className: "w-5 h-5",
    fill: "currentColor",
    viewBox: "0 0 24 24",
  };

  // Map of platforms to their respective SVG paths
  const icons: Record<string, React.ReactNode> = {
    github: (
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    ),
    twitter: (
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    ),
    facebook: (
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    ),
    linkedin: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    ),
    instagram: (
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z" />
    ),
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-gray-900 transition-colors duration-200"
      aria-label={platform}
    >
      <svg {...iconProps}>
        {icons[lowerPlatform] || (
          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" />
        )}
      </svg>
    </a>
  );
};

export default function UserProfileHeader({
  user,
  postCount,
}: UserProfileHeaderProps) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Image Column */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex-shrink-0">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={fullName || user.username}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-50 flex items-center justify-center text-4xl md:text-5xl font-serif font-bold text-gray-400 border-4 border-white shadow-xl">
                {user.firstName?.charAt(0) || user.username?.charAt(0) || "?"}
              </div>
            )}
          </div>
        </div>

        {/* User Content Column */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <h2 className="text-4xl font-serif font-bold text-gray-900 tracking-tight">
              {fullName || user.username}
            </h2>
            <span className="text-gray-400 font-medium text-lg mb-1">
              @{user.username}
            </span>
          </div>

          {user.bio ? (
            <p className="text-gray-600 mt-4 leading-relaxed max-w-xl text-lg font-light">
              {user.bio}
            </p>
          ) : (
            <p className="text-gray-400 italic mt-4">No bio provided.</p>
          )}

          {/* Social Links Row */}
          {user.socialMediaLinks &&
            Object.entries(user.socialMediaLinks).length > 0 && (
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                {Object.entries(user.socialMediaLinks).map(
                  ([platform, url]) => (
                    <SocialIcon key={platform} platform={platform} url={url} />
                  ),
                )}
              </div>
            )}

          {/* Stats Section */}
          <div className="flex flex-wrap justify-center md:justify-start gap-10 mt-8 pt-8 border-t border-gray-50 w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                {postCount}
              </span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Articles
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">0</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Followers
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">0</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                Following
              </span>
            </div>
          </div>
        </div>

        {/* Contact/Action Column */}
        <div className="hidden lg:flex flex-col items-end gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-gray-600 text-sm font-medium">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{user.email}</span>
          </div>
          <button className="w-full px-6 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-all shadow-sm">
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
