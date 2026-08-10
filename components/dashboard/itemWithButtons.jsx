"use client"
import { Plus, Settings, Trash2, Edit2, Save, Check, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import Link from "next/link"


export function ItemWithButtons({
  items = [],
  isSubmitting,
  onBack,
  submitLabel = "Add Subscription",   // ← prop with default
}) {
  if (!items || items.length === 0) {
    return (
      <div className="flex w-full justify-between px-4">
        <div>
          <Button onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
            <ItemTitle className="text-sm font-medium">Back</ItemTitle>
          </Button>
        </div>
        <div>
          <div className="flex gap-4 text-sm">
            <Button
              size="sm"
               type="submit"
              disabled={isSubmitting}
              className="rounded-3xl px-4 py-5 text-[12px] bg-[#262626] text-white hover:bg-gray-500/30 hover:text-black"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </div>
      </div>
    )
  }
    return (
        <div className="flex w-full max-w-3xl flex-col gap-3">
            {/* Add New Product CTA */}
            <Item
                variant="outline"
                className="border-[#C4A962]/30 bg-[#C4A962]/5 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
            >
                <ItemMedia>
                    <div className="w-10 h-10 rounded-full bg-[#C4A962] flex items-center justify-center">
                        <Plus className="w-5 h-5 text-white" />
                    </div>
                </ItemMedia>
                <ItemContent>
                    <ItemTitle className="text-sm font-semibold">Add New Product</ItemTitle>
                    <ItemDescription className="text-xs text-slate-600">
                        Create a new product to sell
                    </ItemDescription>
                </ItemContent>
                <ItemActions>
                    <Link href="/product/new">
                        <Button
                            size="sm"
                            className="bg-[#C4A962] hover:bg-[#b39652] text-white"
                        >
                            Create
                        </Button>
                    </Link>
                </ItemActions>
            </Item>

            {/* Products List */}
            {items.map((item) => (
                <Item
                    key={item.id}
                    variant="outline"
                    className="border-slate-200/50 bg-white/40 backdrop-blur-sm shadow-md hover:shadow-lg transition-all"
                >
                    <ItemMedia>
                        <div className="w-10 h-10 rounded-full bg-[#05563E]/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-[#05563E]">
                                {item.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </ItemMedia>

                    <ItemContent>
                        <ItemTitle className="text-sm font-semibold">
                            {item.name || "Untitled Product"}
                        </ItemTitle>
                        <ItemDescription className="text-xs text-slate-600">
                            {item.status || "draft"} • GH₵{item.price || "0.00"}
                        </ItemDescription>
                    </ItemContent>

                    <ItemActions className="flex gap-2">
                        <Link href={`/product/${item.id}`}>
                            <Button
                                size="icon-sm"
                                variant="outline"
                                className="rounded-full"
                                aria-label="View"
                            >
                                <Edit2 className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Button
                            size="icon-sm"
                            variant="outline"
                            className="rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                            aria-label="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </ItemActions>
                </Item>
            ))}
        </div>
    )
}