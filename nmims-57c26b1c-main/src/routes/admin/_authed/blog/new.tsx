import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const Route = createFileRoute("/admin/_authed/blog/new")({
  component: NewBlogPost,
});

function NewBlogPost() {
  return (
    <div>
      <Link to="/admin/blog" className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>
      <h1 className="mb-4 text-lg font-extrabold text-foreground">New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
