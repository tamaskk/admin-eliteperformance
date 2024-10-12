import { BlogPost } from "@/types/blogTypes";
import { toast } from "sonner";

export const createBlogItem = async (data: BlogPost) => {
    const response = await fetch("/api/blog/createBlog", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();
}

export const getBlogs = async () => {
    const response = await fetch("/api/blog/getBlogs");

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();
}

export const getABlog = async (id: string) => {
    const response = await fetch("/api/blog/getABlog", {
        method: "POST",
        body: JSON.stringify(id),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();
}

export const updateBlogItem = async (data: BlogPost) => {
    const response = await fetch("/api/blog/saveABlog", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();
}

export const deleteBlogItem = async (id: string) => {
    const response = await fetch(`/api/blog/deleteBlog?id=${id}`, {
        method: "DELETE",
    });
    
    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();
}