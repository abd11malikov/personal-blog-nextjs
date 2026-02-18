"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
  const { token } = useAuth(); 
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');


  useEffect(() => {

    if (!localStorage.getItem('jwt_token')) {
        router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
  

    const postData = {
      title,
      content: description,
      authorId: 1,
      categoryIds: [1],
      tags: ["Travel"]
    };
  
    formData.append(
      "data",
      new Blob([JSON.stringify(postData)], { type: "application/json" })
    );
  
    try {
      const response = await fetch('http://localhost:8080/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`

        },
        body: formData,
      });
  
      if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Failed to create post');
      }
  
      alert('Post Created Successfully!');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    }
  };  

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Create New Post ✍️</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Title</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-1">Content</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-green-700">
          Publish Post
        </button>
      </form>
    </div>
  );
}