export interface UserResponseDTO {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio: string;
  profileImageUrl: string;
  socialMediaLinks: Record<string, string>;
}

export interface CategoryDTO {
  id: number;
  name: string;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  author: UserResponseDTO;
  categories: CategoryDTO[];
  tags: string[];
}
