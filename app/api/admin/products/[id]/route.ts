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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = readProducts()
    data.products = data.products.filter((p: any) => p.id !== params.id)
    writeProducts(data)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
