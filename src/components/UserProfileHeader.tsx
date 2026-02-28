import { UserResponseDTO } from "@/app/types";

interface UserProfileHeaderProps {
  user: UserResponseDTO;
  postCount: number;
}

/**
 * Helper to map platform names or URLs to SVG icons
 */
const SocialIcon = ({ platform, url }: { platform: string; url: string }) => {
  const lowerUrl = url.toLowerCase();

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
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.805.249 2.227.412.56.216.96.474 1.38.894.42.42.678.82.894 1.38.163.422.358 1.057.412 2.227.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.249 1.805-.412 2.227-.216.56-.474.96-.894 1.38-.42.42-.82.678-1.38.894-.422.163-1.057.358-2.227.412-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.805-.249-2.227-.412-.56-.216-.96-.474-1.38-.894-.42-.42-.678-.82-.894-1.38-.163-.422-.358-1.057-.412-2.227C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.249-1.805.412-2.227.216-.56.474-.96.894-1.38.42-.42.82-.678 1.38-.894.422-.163 1.057-.358 2.227-.412 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.741 0 12s.014 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.014-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0-2.881.001 1.44 1.44 0 0 0 2.881-.001z" />
    ),
    telegram: (
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    ),
    tiktok: (
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.33-.85.51-1.44 1.43-1.58 2.41-.14 1.01.23 2.08.94 2.81.45.47 1.05.81 1.69.95 1.01.24 2.12-.02 2.93-.67.76-.58 1.21-1.46 1.28-2.43.02-4.56-.01-9.11.02-13.67z" />
    ),
    link: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
      />
    ),
  };

  // Determine key based on URL content
  let detectedKey = "link";
  if (lowerUrl.includes("github.com")) detectedKey = "github";
  else if (lowerUrl.includes("twitter.com") || lowerUrl.includes("x.com"))
    detectedKey = "twitter";
  else if (lowerUrl.includes("facebook.com")) detectedKey = "facebook";
  else if (lowerUrl.includes("linkedin.com")) detectedKey = "linkedin";
  else if (lowerUrl.includes("instagram.com")) detectedKey = "instagram";
  else if (lowerUrl.includes("t.me") || lowerUrl.includes("telegram.org"))
    detectedKey = "telegram";
  else if (lowerUrl.includes("tiktok.com")) detectedKey = "tiktok";

  const isUnknown = detectedKey === "link";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-center bg-gray-50 border border-gray-100 p-2.5 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
      aria-label={platform}
      title={platform}
    >
      <svg
        className="w-4 h-4"
        fill={isUnknown ? "none" : "currentColor"}
        stroke={isUnknown ? "currentColor" : "none"}
        strokeWidth={isUnknown ? 2 : 0}
        viewBox="0 0 24 24"
      >
        {icons[detectedKey]}
      </svg>
      {isUnknown && (
        <span className="ml-2 text-xs font-semibold text-gray-700 tracking-wide pr-1">
          {platform}
        </span>
      )}
    </a>
  );
};

export default function UserProfileHeader({
  user,
  postCount,
}: UserProfileHeaderProps) {
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const displayName = fullName || user.username;
  const initial = user.firstName?.charAt(0) || user.username?.charAt(0) || "?";

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden relative">
      {/* SHORTER TOP BANNER: Reduced from h-32 to h-16 (desktop h-20) */}
      <div className="h-16 md:h-20 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 w-full" />

      <div className="px-6 md:px-10 pb-8 md:pb-12 relative">
        {/* AVATAR PLACEMENT: Reduced negative margin (-mt-8 md:-mt-12) to match the shorter banner */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 -mt-9 md:-mt-12">
          {/* Profile Image Column */}
          <div className="flex-shrink-0 flex justify-center md:block">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={displayName}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover bg-white p-1 ring-1 ring-gray-200 shadow-md"
              />
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gray-50 flex items-center justify-center text-4xl md:text-5xl font-medium text-gray-400 bg-white p-1 ring-1 ring-gray-200 shadow-md">
                <div className="w-full h-full rounded-full bg-gray-50 flex items-center justify-center">
                  {initial.toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* User Content Column */}
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-2 md:pt-14">
            {/* Main Info */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                  {displayName}
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-1">
                  @{user.username}
                </p>
              </div>

              {/* Stats Block */}
              <div className="flex flex-col items-center md:items-end bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
                <span className="text-xl font-bold text-gray-900 leading-none">
                  {postCount}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mt-1">
                  Articles
                </span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-gray-600 mt-5 leading-relaxed max-w-2xl text-[15px] whitespace-pre-wrap">
                {user.bio}
              </p>
            )}

            {/* Social Links */}
            {user.socialMediaLinks &&
              Object.entries(user.socialMediaLinks).length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2.5 mt-6">
                  {Object.entries(user.socialMediaLinks).map(
                    ([platform, url]) => (
                      <SocialIcon
                        key={platform}
                        platform={platform}
                        url={url}
                      />
                    ),
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
