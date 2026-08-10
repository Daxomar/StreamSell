"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(amount)

export default function ProductCard({ product }) {
  return (
    <Link href={`/store/shop/${product._id}`} className="group block bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-green-200 transition-all duration-200">
      <div className="relative h-44 bg-slate-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">
            📦
          </div>
        )}
        {product.Data && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.Data}
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-green-700 mb-0.5">
          {product.category}
        </p>
        <p className="text-sm font-bold text-slate-800 leading-snug mb-1 line-clamp-2 group-hover:text-green-700 transition-colors">
          {product.name}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-green-600 font-extrabold text-sm">
            {formatCurrency(product.price)}
          </p>
          <div className="w-8 h-8 rounded-full bg-green-50 group-hover:bg-green-600 flex items-center justify-center transition-colors">
            <ChevronRight size={16} className="text-green-600 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}