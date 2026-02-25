export interface UserResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  profileImageUrl: string;
  socialMediaLinks: Record<string, string>;
  posts: PostResponseDTO[];
}

export interface CategoryDTO {
  id: number;
  name: string;
  description: string;
}

export interface PostResponseDTO {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  authorUsername: string;
  categories: CategoryDTO[];
  tags: string[];
}
