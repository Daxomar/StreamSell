"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, DollarSign, Tag, Edit3, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function PriceSelector({ 
  bundleName = "5GB MTN Data Bundle",
  costPrice = 50.0,
  suggestedPrice1 = 55.0,
  suggestedPrice2 = 60.0,
  recommendedPrice = 58.0,
  currentPrice = null,
  onPriceChange 
}) {
  const [selectedOption, setSelectedOption] = useState(
    currentPrice === suggestedPrice1 ? "suggested1" :
    currentPrice === suggestedPrice2 ? "suggested2" :
    currentPrice ? "custom" : "suggested1"
  )
  const [customPrice, setCustomPrice] = useState(currentPrice || "")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const getSelectedPrice = () => {
    switch (selectedOption) {
      case "suggested1":
        return suggestedPrice1
      case "suggested2":
        return suggestedPrice2
      case "custom":
        return parseFloat(customPrice) || 0
      default:
        return suggestedPrice1
    }
  }

  const profit = getSelectedPrice() - costPrice
  const profitPercentage = ((profit / costPrice) * 100).toFixed(1)

  const handleSave = async () => {
    const price = getSelectedPrice()
    
    if (selectedOption === "custom" && (!customPrice || parseFloat(customPrice) < costPrice)) {
      toast({
        title: "Invalid Price",
        description: `Price must be at least GHS ${costPrice.toFixed(2)} (cost price)`,
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Price Updated",
        description: `${bundleName} price set to GHS ${price.toFixed(2)}`,
      })
      
      if (onPriceChange) {
        onPriceChange(price)
      }
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{bundleName}</CardTitle>
            <CardDescription>Set your selling price for this bundle</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Cost: GHS {costPrice.toFixed(2)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recommended Price Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-900">Recommended Price</p>
            <p className="text-sm text-blue-700">
              GHS {recommendedPrice.toFixed(2)} - Based on market analysis
            </p>
          </div>
        </div>

        {/* Price Options */}
        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
          {/* Suggested Price 1 */}
          <div 
            className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === "suggested1" 
                ? "border-green-500 bg-green-50" 
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedOption("suggested1")}
          >
            <RadioGroupItem value="suggested1" id="suggested1" className="sr-only" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-500" />
                <Label htmlFor="suggested1" className="font-medium cursor-pointer">
                  Suggested Price 1
                </Label>
                {selectedOption === "suggested1" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                GHS {suggestedPrice1.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">
                Profit: GHS {(suggestedPrice1 - costPrice).toFixed(2)} ({((suggestedPrice1 - costPrice) / costPrice * 100).toFixed(1)}%)
              </p>
            </div>
          </div>

          {/* Suggested Price 2 */}
          <div 
            className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === "suggested2" 
                ? "border-green-500 bg-green-50" 
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedOption("suggested2")}
          >
            <RadioGroupItem value="suggested2" id="suggested2" className="sr-only" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-500" />
                <Label htmlFor="suggested2" className="font-medium cursor-pointer">
                  Suggested Price 2
                </Label>
                <Badge className="bg-green-500 text-xs">Popular</Badge>
                {selectedOption === "suggested2" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                GHS {suggestedPrice2.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500">
                Profit: GHS {(suggestedPrice2 - costPrice).toFixed(2)} ({((suggestedPrice2 - costPrice) / costPrice * 100).toFixed(1)}%)
              </p>
            </div>
          </div>

          {/* Custom Price */}
          <div 
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === "custom" 
                ? "border-green-500 bg-green-50" 
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => setSelectedOption("custom")}
          >
            <RadioGroupItem value="custom" id="custom" className="sr-only" />
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className="h-4 w-4 text-slate-500" />
              <Label htmlFor="custom" className="font-medium cursor-pointer">
                Custom Price
              </Label>
              {selectedOption === "custom" && (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                GHS
              </span>
              <Input
                type="number"
                step="0.01"
                min={costPrice}
                placeholder="Enter your price"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="pl-14"
                disabled={selectedOption !== "custom"}
              />
            </div>
            {selectedOption === "custom" && customPrice && parseFloat(customPrice) >= costPrice && (
              <p className="text-xs text-slate-500 mt-2">
                Profit: GHS {(parseFloat(customPrice) - costPrice).toFixed(2)} ({((parseFloat(customPrice) - costPrice) / costPrice * 100).toFixed(1)}%)
              </p>
            )}
            {selectedOption === "custom" && customPrice && parseFloat(customPrice) < costPrice && (
              <p className="text-xs text-red-500 mt-2">
                Price must be at least GHS {costPrice.toFixed(2)}
              </p>
            )}
          </div>
        </RadioGroup>

        {/* Summary */}
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Your Selling Price</span>
            <span className="font-bold text-slate-900">GHS {getSelectedPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Your Profit</span>
            <span className={`font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              GHS {profit.toFixed(2)} ({profitPercentage}%)
            </span>
          </div>
        </div>

        {/* Save Button */}
        <Button 
          className="w-full bg-green-500 hover:bg-green-600" 
          onClick={handleSave}
          disabled={isSaving || (selectedOption === "custom" && (!customPrice || parseFloat(customPrice) < costPrice))}
        >
          {isSaving ? "Saving..." : "Save Price"}
        </Button>
      </CardContent>
    </Card>
  )
}
