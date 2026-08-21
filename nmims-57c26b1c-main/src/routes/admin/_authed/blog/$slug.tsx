import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getBlogPostFn } from "@/backend/blog/actions";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

export const Route = createFileRoute("/admin/_authed/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getBlogPostFn({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  component: EditBlogPost,
});

function EditBlogPost() {
  const post = Route.useLoaderData();
  return (
    <div>
      <Link to="/admin/blog" className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>
      <h1 className="mb-4 text-lg font-extrabold text-foreground">{post.title}</h1>
      <BlogPostForm post={post} />
    </div>
  );
}
