export interface Post {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: number;
}
export interface MockPost {
  id: number;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  user_id: number;
}
