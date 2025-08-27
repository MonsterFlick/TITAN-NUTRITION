import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const PRODUCTS_FILE = path.join(process.cwd(), "data/products.json")

function readProducts() {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    return { products: [] }
  }
}

function writeProducts(data: any) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2))
}

export async function GET() {
  const data = readProducts()
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  try {
    const newProduct = await request.json()
    const data = readProducts()

    data.products.push(newProduct)
    writeProducts(data)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updatedProduct = await request.json()
    const data = readProducts()

    const index = data.products.findIndex((p: any) => p.id === updatedProduct.id)
    if (index !== -1) {
      data.products[index] = updatedProduct
      writeProducts(data)
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}
