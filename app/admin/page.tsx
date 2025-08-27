"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, Plus, Eye, EyeOff } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  image: string
  nutritionLabel: string
  price: string
  category: string
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [securityCode, setSecurityCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [message, setMessage] = useState("")

  // Load products from JSON
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/data/products.json")
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error("Failed to load products:", error)
      }
    }

    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: securityCode }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setMessage("Access granted!")
      } else {
        setMessage("Invalid security code")
      }
    } catch (error) {
      setMessage("Authentication failed")
    }
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      const response = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })

      if (response.ok) {
        const updatedProducts = await response.json()
        setProducts(updatedProducts.products)
        setEditingProduct(null)
        setIsAddingNew(false)
        setMessage("Product saved successfully!")
      } else {
        setMessage("Failed to save product")
      }
    } catch (error) {
      setMessage("Error saving product")
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const updatedProducts = await response.json()
        setProducts(updatedProducts.products)
        setMessage("Product deleted successfully!")
      } else {
        setMessage("Failed to delete product")
      }
    } catch (error) {
      setMessage("Error deleting product")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">TITAN NUTRITION</CardTitle>
            <CardDescription>Admin Access Required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="security-code">Security Code</Label>
              <div className="relative">
                <Input
                  id="security-code"
                  type={showPassword ? "text" : "password"}
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  placeholder="Enter security code"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={handleLogin} className="w-full">
              Access Admin Panel
            </Button>
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">TITAN NUTRITION - Admin Panel</h1>
          <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Product
          </Button>
        </div>

        {message && (
          <Alert className="mb-6">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{product.title}</h3>
                      <p className="text-muted-foreground">{product.description}</p>
                      <p className="text-lg font-bold text-primary">{product.price}</p>
                      <p className="text-sm text-muted-foreground">Category: {product.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(editingProduct || isAddingNew) && (
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setEditingProduct(null)
              setIsAddingNew(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product | null
  onSave: (product: Product) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState<Product>(
    product || {
      id: "",
      title: "",
      description: "",
      image: "",
      nutritionLabel: "",
      price: "",
      category: "protein",
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.id) {
      formData.id = formData.title.toLowerCase().replace(/\s+/g, "-")
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="$39.99"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Product Image Path</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/product.png"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nutritionLabel">Nutrition Label Image Path</Label>
              <Input
                id="nutritionLabel"
                value={formData.nutritionLabel}
                onChange={(e) => setFormData({ ...formData, nutritionLabel: e.target.value })}
                placeholder="/nutrition-labels/product-nutrition.png"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded"
                required
              >
                <option value="protein">Protein</option>
                <option value="gainer">Mass Gainer</option>
                <option value="preworkout">Pre-Workout</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {product ? "Update Product" : "Add Product"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
