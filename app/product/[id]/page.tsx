"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Phone, MessageCircle } from "lucide-react"
import { NutritionModal } from "@/components/nutrition-modal"
import Image from "next/image"

interface Product {
  id: string
  title: string
  flavour?: string
  description: string
  image: string
  nutritionLabel: string
  price?: string
  category: string
  detailedDescription?: string
  ingredients?: string[]
  benefits?: string[]
  usage?: string
  servings?: string
  weight?: string
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false)

  const whatsappNumber = "918380889935"
  const callNumber = "918380889935"

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch("/data/products.json")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        const foundProduct = data.products.find((p: Product) => p.id === params.id)
        setProduct(foundProduct || null)

        // Related products: same category, exclude current
        const related = data.products.filter((p: Product) => p.id !== params.id)
        setRelatedProducts(related)
      } catch (error) {
        console.error("Failed to load product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) loadProduct()
  }, [params.id])

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-lg font-medium text-muted-foreground">Loading...</div>
      </div>
    )

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    )

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi! I want to buy ${encodeURIComponent(
    product.title
  )}`
  const callLink = `tel:${callNumber}`

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <h1 className="text-xl font-bold tracking-wide">TITAN NUTRITION</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Product Hero Section */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Left - Image */}
          <div className="space-y-6">
            <div className="relative rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 bg-card">
              <Image
                src={product.image}
                alt={product.title}
                width={600}
                height={600}
                className="w-full h-96 lg:h-[500px] object-contain bg-gray-100"
              />
              <Badge className="absolute top-4 left-4 px-3 py-1 text-sm rounded-full bg-primary/90 text-white">
                {product.category.toUpperCase()}
              </Badge>
            </div>
            <Button
              onClick={() => setIsNutritionModalOpen(true)}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              View Nutrition Facts
            </Button>
          </div>

          {/* Right - Details */}
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold leading-snug">{product.title}</h1>
            {product.description && (
              <p className="text-foreground/90 text-base lg:text-lg">{product.description}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.servings && (
                <div className="p-4 bg-card rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-200">
                  <span className="text-muted-foreground text-xs">Servings</span>
                  <span className="font-bold text-lg">{product.servings}</span>
                </div>
              )}
              {product.weight && (
                <div className="p-4 bg-card rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-200">
                  <span className="text-muted-foreground text-xs">Net Weight</span>
                  <span className="font-bold text-lg">{product.weight}</span>
                </div>
              )}
            </div>

            {/* Benefits & Usage */}
            <div className="space-y-4">
              {product.benefits && (
                <div className="p-4 bg-background/50 rounded-xl shadow-sm border-l-4 border-yellow-400 mb-4">
                  <h3 className="text-lg font-semibold text-yellow-600 mb-2">Key Benefits</h3>
                  <ul className="space-y-1">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.usage && (
                <div className="p-4 bg-background/50 rounded-xl shadow-sm border-l-4 border-primary">
                  <h3 className="text-lg font-semibold text-primary mb-2">How to Use</h3>
                  <p className="text-sm leading-relaxed">{product.usage}</p>
                </div>
              )}
            </div>

            {/* Buy Buttons (Desktop) */}
            <div className="hidden lg:flex gap-4 mt-6">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white">
                  <MessageCircle className="w-5 h-5" /> Buy via WhatsApp
                </Button>
              </a>
              <a href={callLink}>
                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white">
                  <Phone className="w-5 h-5" /> Call Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="py-12 px-4 bg-background/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <a key={p.id} href={`/product/${p.id}`}>
                  <Card className="hover:shadow-lg transition-shadow rounded-xl p-2 cursor-pointer">
                    <div className="relative w-full h-40">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                    <div className="mt-2 font-semibold text-center text-sm">{p.title}</div>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t mt-12 p-6 text-center text-sm text-muted-foreground">
        © 2025 Titan Nutrition. All rights reserved.
      </footer>

      {/* Sticky Buy Bar for Mobile */}
      {product.price && (
        <div className="lg:hidden fixed bottom-0 left-0 w-full bg-card border-t shadow-md z-50 p-4 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">Price</span>
            <span className="font-bold text-lg">{product.price}</span>
          </div>
          <div className="flex gap-2">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </Button>
            </a>
            <a href={callLink}>
              <Button className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white">
                <Phone className="w-4 h-4" /> Call
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* Nutrition Modal */}
      {product && (
        <NutritionModal
          product={product}
          isOpen={isNutritionModalOpen}
          onClose={() => setIsNutritionModalOpen(false)}
        />
      )}
    </div>
  )
}
