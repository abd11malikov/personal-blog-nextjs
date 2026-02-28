import Link from "next/link";
import { notFound } from "next/navigation";
import ClientEditButton from "@/components/ClientEditButton";
import ClientDeleteButton from "@/components/ClientDeleteButton";
import ShareButtons from "@/components/ShareButtons";
import { PostResponseDTO, UserResponseDTO } from "@/app/types";

async function getPost(slug: string): Promise<PostResponseDTO | null> {
  try {
    const res = await fetch(`https://api.webnote.uz/api/posts/slug/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Error fetching post: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to load post:", error);
    return null;
  }
}

async function getAuthor(username: string): Promise<UserResponseDTO | null> {
  try {
    const res = await fetch(`https://api.webnote.uz/api/users/${username}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn(`User ${username} not found`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to load author:", error);
    return null;
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Fetch author details separately using the authorUsername now available in PostResponseDTO
  const author = await getAuthor(post.authorUsername);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mainImage =
    post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : null;

  return (
    <article className="max-w-4xl mx-auto my-12 bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* --- BANNER SECTION (Only visible if there is a main image) --- */}
      {mainImage && (
        <div className="relative w-full h-[400px] bg-gray-900">
          <img
            src={mainImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-sm"
                >
                  {cat.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-md break-words [overflow-wrap:anywhere]">
              {post.title}
            </h1>
          </div>
        </div>
      )}

      <div className="p-8 md:p-12">
        {!mainImage && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide rounded-full shadow-sm"
                >
                  {cat.name}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight break-words [overflow-wrap:anywhere]">
              {post.title}
            </h1>
          </div>
        )}

        {/* --- AUTHOR & META --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 pb-6 border-b border-gray-100 gap-4">
          {/* --- Clickable Author Profile --- */}
          {author ? (
            <Link
              href={`/${author.username}`}
              className="flex items-center gap-4 group cursor-pointer min-w-0"
            >
              {author.profileImageUrl ? (
                <img
                  src={author.profileImageUrl}
                  alt={author.username}
                  className="h-12 w-12 rounded-full object-cover group-hover:ring-2 group-hover:ring-blue-500 transition-all shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600 shrink-0 group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                  {author.firstName?.[0]}
                  {author.lastName?.[0]}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {author.firstName} {author.lastName}
                </p>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-400 shrink-0">
                ?
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  Unknown Author
                </p>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 shrink-0">
            {/* --- Edit Button (Only visible if the logged-in user is the author) --- */}
            {author && (
              <>
                <ClientEditButton
                  authorUsername={author.username}
                  slug={slug}
                />
                <ClientDeleteButton
                  authorUsername={author.username}
                  postId={post.id}
                />
              </>
            )}

            {/* --- Share Buttons --- */}
            <ShareButtons title={post.title} />
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-xl min-w-0 w-full">
          <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {post.content}
          </p>
        </div>

        {/* --- GALLERY (Additional Images) --- */}
        {post.imageUrls && post.imageUrls.length > 1 && (
          <div className="mt-16">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📸</span> Gallery
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {post.imageUrls.slice(1).map((url, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition duration-300 bg-gray-50 border border-gray-100"
                >
                  <img
                    src={url}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-auto block hover:scale-105 transition duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAGS --- */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-500 mr-2">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-100 transition cursor-default border border-gray-200 break-all"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* --- FOOTER NAV --- */}
        <div className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-gray-50">
          <Link
            href="/"
            className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              &larr;
            </span>{" "}
            Back to Home
          </Link>
        </div>
      </div>
    </article>
  );
}
