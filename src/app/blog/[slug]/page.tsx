import { generateMetadata as generateBlogMetadata } from "@/lib/seo"
import BlogPostClient from "./blog-post-client"

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/blog/${params.slug}`)
    const data = await response.json()
    
    if (data.success && data.data) {
      return generateBlogMetadata({
        title: data.data.title,
        description: data.data.excerpt || data.data.content.slice(0, 155),
        keywords: data.data.tags,
        image: data.data.featuredImage,
        type: "article",
        publishedTime: data.data.publishedAt,
        author: data.data.author.name,
      })
    }
  } catch (error) {
    console.error('Error generating blog metadata:', error)
  }
  
  return {
    title: 'Blog Post Not Found',
    description: 'The requested blog post could not be found.'
  }
}

export default function BlogPostPage() {
  return <BlogPostClient />
}
