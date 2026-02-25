"use client";
import { PostResponseDTO, UserResponseDTO } from "@/app/types";

interface PostCardProps {
  post: PostResponseDTO;
  author?: UserResponseDTO;
}

export default function PostCard({ post, author }: PostCardProps) {
  const excerpt = post.content
    ? post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
    : "";

  return (
    <article className="flex flex-col md:flex-row gap-6 md:gap-8 p-5 md:p-6 bg-white rounded-2xl border border-slate-200 min-w-0 w-full max-w-full">
      <div className="flex-1 flex flex-col justify-between order-2 md:order-1 min-w-0 w-full">
        <div className="min-w-0 w-full">
          {author && (
            <div className="flex items-center gap-3 mb-4 min-w-0">
              {author.profileImageUrl ? (
                <img
                  src={author.profileImageUrl}
                  alt={author.username}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100 shrink-0"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 uppercase ring-2 ring-transparent shrink-0">
                  {author.firstName?.[0] || author.username?.[0]}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm min-w-0 truncate">
                <span className="font-semibold text-slate-900 truncate">
                  {author.firstName} {author.lastName}
                </span>
                <span className="text-slate-300 px-1 shrink-0">•</span>
                <time
                  dateTime={post.createdAt}
                  className="text-slate-500 font-medium shrink-0"
                >
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </div>
          )}

          {!author && (
            <div className="flex items-center gap-2 text-sm mb-4 min-w-0">
              <time
                dateTime={post.createdAt}
                className="text-slate-500 font-medium shrink-0"
              >
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
          )}

          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug tracking-tight break-words [overflow-wrap:anywhere]">
            {post.title}
          </h2>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-6 break-words [overflow-wrap:anywhere] min-w-0 w-full">
            {excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {post.categories?.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-slate-400 hover:text-indigo-500 transition-colors p-2 hover:bg-indigo-50 rounded-full active:scale-95 shrink-0"
              aria-label="Save post"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {post.imageUrls && post.imageUrls.length > 0 && (
        <div className="w-full md:w-56 lg:w-64 order-1 md:order-2 shrink-0 rounded-xl overflow-hidden bg-slate-50 self-start">
          <img
            src={post.imageUrls[0]}
            alt={post.title}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>
      )}
    </article>
  );
}
