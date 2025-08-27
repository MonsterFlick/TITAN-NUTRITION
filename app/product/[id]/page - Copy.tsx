"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Heart, Share2, Star } from "lucide-react"
import { NutritionModal } from "@/components/nutrition-modal"
import Head from "next/head";



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
  const [loading, setLoading] = useState(true)
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetch("/data/products.json")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        const foundProduct = data.products.find((p: Product) => p.id === params.id)
        setProduct(foundProduct || null)
      } catch (error) {
        console.error("Failed to load product:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) loadProduct()
  }, [params.id])

  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
          <h1 className="text-xl font-bold">TITAN NUTRITION</h1>
          <div className="w-24" />
        </div>
      </header>

      {/* Product Details */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-lg bg-card">
              <img src={product.image} alt={product.title} className="w-full h-96 lg:h-[500px] object-cover" />
              <Badge className="absolute top-4 left-4">{product.category.toUpperCase()}</Badge>
            </div>
            <Button
              onClick={() => setIsNutritionModalOpen(true)}
              variant="outline"
              className="w-full border-primary text-primary"
            >
              View Nutrition Facts
            </Button>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold">{product.title}</h1>
            </div>  

            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.servings && (
                <div className="bg-card p-3 rounded-lg">
                  <span className="text-muted-foreground">Servings:</span>
                  <div className="font-bold">{product.servings}</div>
                </div>
              )}
              {product.weight && (
                <div className="bg-card p-3 rounded-lg">
                  <span className="text-muted-foreground">Net Weight:</span>
                  <div className="font-bold">{product.weight}</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
{/* here */}

                    {/* Benefits */}
          {product.benefits && (
  <Card className="border-l-4 border-primary">
    <CardHeader>
      <CardTitle className="text-lg lg:text-xl font-semibold text-primary">Key Benefits</CardTitle>
    </CardHeader>
    <CardContent >
      <ul className="space-y-1">
        {product.benefits.map((b, i) => (
          <li key={i} className="flex items-center gap-2 text-sm lg:text-base text-foreground">
            <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" /> {b}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
)}

          {/* Usage & Ingredients */}
<Card className="border-l-4 border-secondary">
  <CardHeader>
    <CardTitle className="text-lg lg:text-xl font-semibold text-secondary">How to Use</CardTitle>
  </CardHeader>
  <CardContent>
    {product.usage && (
      <p className="text-sm lg:text-base text-foreground/90">{product.usage}</p>
    )}
  </CardContent>
</Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}

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
