import PriceTag from "@/components/PriceTag";
import { prisma } from "@/lib/db/prisma"
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation"
import { cache } from "react";
import AddToCartButton from "./AddToCartButton";
import { incrementProductQuantity } from "./actions";

interface ProductPageProps {
  params: {
    id: string,
  }
}

// We can't normally share the database result between generateMetadata and the page component,
// so we use React's new "cache" function to cache the database result for the product
const getProduct = cache(async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) notFound(); // redirects to Not Found page (404)
  return product;
})

export async function generateMetadata(
  { params: { id } }: ProductPageProps
): Promise<Metadata> {
  const product = await getProduct(id);

  return {
    title: product.name + " - Flowmazon",
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }]
    }
  }
}

export default async function ProductPage(
  { params: { id } }: ProductPageProps
) {

  const product = await getProduct(id);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      />

      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4" />
        <p className="py-6">{product.description}</p>
        <AddToCartButton productId={product.id} incrementProductQuantity={incrementProductQuantity} />
      </div>
    </div>
  )
}