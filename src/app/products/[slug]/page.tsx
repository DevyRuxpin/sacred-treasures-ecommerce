import { generateProductMetadata } from "@/lib/seo"
import ProductClient from "./product-client"

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products/${params.slug}`)
    const data = await response.json()
    
    if (data.success && data.data) {
      return generateProductMetadata(data.data)
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
  }
  
  return {
    title: 'Product Not Found',
    description: 'The requested product could not be found.'
  }
}

export default function ProductPage() {
  return <ProductClient />
}