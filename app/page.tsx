"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronLeft, ChevronRight, Zap, TrendingUp, Award, Instagram, Twitter, Facebook, Search } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  title: string
  description: string
  image: string
  nutritionLabel: string
  category: string
}

export default function GymSupplementsPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch("/data/products.json")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProducts(data.products)
      } catch (error) {
        console.error("Failed to load products:", error)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

const testimonials = [
  {
    name: "Sahil Pichad",
    text: " Meri recovery ka time better ho gaya hai aur har workout ke baad main zyada strong feel karta hoon.",
    rating: 5,
  },
  {
    name: "Mohit Patel",
    text: "Protein blend ka taste bahut acha hai aur ye achhi tarah mix ho jata hai. Definitely worth it!",
    rating: 5,
  },
  {
    name: "Rohit Bhangle",
    text: "Kuch hi hafton me dikhne wala muscle growth. Quality se completely satisfied hoon.",
    rating: 5,
  },
  {
    name: "Ketan Bhangle",
    text: "Provides clean energy without any crash. Perfect for my morning training sessions.",
    rating: 5,
  },
  {
    name: "Anjali Sharma",
    text: "Best supplements I’ve tried. Helped me stay consistent and see real progress.",
    rating: 5,
  },
  {
    name: "Arjun Deshmukh",
    text: "Stamina and endurance have gone up significantly. Great results within a month.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    text: "I feel more energized during workouts, and recovery has become much faster.",
    rating: 5,
  },
];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  const handleProductClick = (product: Product) => {
    window.location.href = `/product/${product.id}`
  }

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/dark-gym-interior-with-weights-and-equipment.png')`,
          }}
        />
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-accent font-[family-name:var(--font-space-grotesk)]">
              TITAN NUTRITION
            </h2>
          </div>
          <h1 className="font-bold text-6xl md:text-8xl mb-6 animate-pulse-neon font-[family-name:var(--font-space-grotesk)]">
            FUEL YOUR FITNESS
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground font-[family-name:var(--font-dm-sans)]">
            Premium Gainers, Proteins & Pre-Workouts
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg animate-glow font-bold"
            onClick={() => scrollToSection("products")}
          >
            SHOP NOW
          </Button>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="w-4 h-4 bg-accent rounded-full opacity-60" />
        </div>
        <div className="absolute bottom-32 right-16 animate-float" style={{ animationDelay: "1s" }}>
          <div className="w-6 h-6 bg-primary rounded-full opacity-40" />
        </div>
      </section>

      {/* Product Showcase */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-[family-name:var(--font-space-grotesk)]">
            PREMIUM SUPPLEMENTS
          </h2>

          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search supplements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 group cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="relative overflow-hidden rounded-lg mb-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-bold">
                            View Product Details
                          </div>
                        </div>
                      </div>
                      <CardTitle className="text-xl font-bold font-[family-name:var(--font-space-grotesk)]">
                        {product.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                        {product.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button className="w-full bg-primary hover:bg-primary/90 font-bold">ADD TO CART</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your search.</p>
                <Button variant="outline" onClick={() => setSearchTerm("")} className="mt-4">
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

     
      {/* Why Choose Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-[family-name:var(--font-space-grotesk)]">
            WHY CHOOSE US
          </h2>


    {/* MADE IN INDIA */}
    <div className="text-center group mb-16">  {/* <-- added spacing here */}
      <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all duration-300">
        <Zap className="w-10 h-10 text-accent-foreground" />
      </div>
      <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">MADE IN INDIA</h3>
      <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
        We are proud to be an Indian brand, supporting local manufacturing and communities.
      </p>
    </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all duration-300">
                <TrendingUp className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">MUSCLE GROWTH</h3>
              <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                Scientifically formulated to maximize muscle protein synthesis and accelerate growth.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all duration-300">
                <Zap className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">ENERGY BOOST</h3>
              <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                Clean, sustained energy that powers through the most intense training sessions.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:animate-glow transition-all duration-300">
                <Award className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-space-grotesk)]">100% QUALITY</h3>
              <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
                Third-party tested, premium ingredients with no fillers or artificial additives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-4 bg-card/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 font-[family-name:var(--font-space-grotesk)]">
            WHAT OUR CUSTOMERS SAY
          </h2>

          <div className="relative">
            <Card className="bg-card border-border min-h-[200px] flex items-center">
              <CardContent className="text-center p-8">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-accent text-2xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-lg mb-6 font-[family-name:var(--font-dm-sans)] italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="font-bold text-accent font-[family-name:var(--font-space-grotesk)]">
                  - {testimonials[currentTestimonial].name}
                </p>
              </CardContent>
            </Card>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-card border-border hover:bg-primary hover:border-primary"
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-card border-border hover:bg-primary hover:border-primary"
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? "bg-primary" : "bg-muted"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 font-[family-name:var(--font-space-grotesk)]">
            TRANSFORM YOUR BODY.
            <br />
            START TODAY.
          </h2>
          <p className="text-xl mb-8 text-muted-foreground font-[family-name:var(--font-dm-sans)]">
            Join thousands of athletes who trust our supplements for their fitness journey.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-xl animate-glow font-bold"
          >
            BUY NOW
          </Button>
        </div>
      </section>

{/* Footer */}
<footer className="py-12 px-4 bg-card/40 border-t border-border">
  <div className="max-w-6xl mx-auto">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Brand */}
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-space-grotesk)]">
          TITAN NUTRITION
        </h3>
        <p className="text-muted-foreground font-[family-name:var(--font-dm-sans)]">
          Premium supplements for serious athletes.
        </p>
      </div>

      {/* Socials */}
      <div className="flex space-x-6">
        <a
          href="https://www.instagram.com/titan_nutrition" // <-- your Instagram URL
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-accent transition-colors"
        >
          <Instagram className="w-6 h-6" />
        </a>
        <a
          href="https://wa.me/919876543210" // <-- replace with your WhatsApp number
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-accent transition-colors"
        >
          {/* you can use lucide-react WhatsApp if installed */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M20.52 3.48A11.77 11.77 0 0012 0a11.77 11.77 0 00-8.52 3.48A11.77 11.77 0 000 12c0 2.09.54 4.12 1.57 5.91L0 24l6.27-1.64A11.93 11.93 0 0012 24c3.2 0 6.2-1.25 8.48-3.52A11.77 11.77 0 0024 12c0-3.2-1.25-6.2-3.52-8.52zM12 22c-1.95 0-3.87-.52-5.54-1.52l-.4-.23-3.73.97.99-3.64-.24-.37A9.93 9.93 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.02-7.39c-.27-.14-1.59-.78-1.84-.87-.25-.09-.43-.14-.62.14-.18.27-.71.87-.87 1.05-.16.18-.32.2-.6.07-.27-.14-1.14-.42-2.18-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.05-.22-.53-.45-.46-.62-.47h-.53c-.18 0-.48.07-.73.34s-.96.94-.96 2.29.98 2.65 1.12 2.84c.14.18 1.93 2.95 4.68 4.14.65.28 1.15.45 1.55.57.65.21 1.23.18 1.69.11.52-.08 1.59-.65 1.81-1.28.23-.62.23-1.15.16-1.28-.07-.13-.25-.2-.52-.34z"/>
          </svg>
        </a>
      </div>
    </div>

    {/* Bottom */}
    <div className="border-t border-border mt-8 pt-6 text-center text-muted-foreground font-[family-name:var(--font-dm-sans)] text-sm">
      © {new Date().getFullYear()} Titan Nutrition. All rights reserved.
    </div>
  </div>
</footer>

    </div>
  )
}
