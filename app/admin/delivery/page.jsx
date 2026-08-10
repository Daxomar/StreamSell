// "use client"
 
// import { useState } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Badge } from "@/components/ui/badge"
// import { Plus, Edit2, Trash2, Search, ArrowUpDown, Loader2, Truck } from "lucide-react"
// import { fetchWithAuth } from "@/lib/utility/fetchWithAuth"
// import toast from "react-hot-toast"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Switch } from "@/components/ui/switch"
// import { Textarea } from "@/components/ui/textarea"
 
// export default function DeliveryMethodsPage() {
//   const queryClient = useQueryClient()
 
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [editingDelivery, setEditingDelivery] = useState(null)
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
//   const [deliveryToDelete, setDeliveryToDelete] = useState(null)
 
//   // Filter and sort state
//   const [searchQuery, setSearchQuery] = useState("")
//   const [sortBy, setSortBy] = useState("label")
//   const [sortOrder, setSortOrder] = useState("asc")
 
//   const [formData, setFormData] = useState({
//     location: "",
//     label: "",
//     description: "",
//     note: "",
//     price: "",
//   })
 
//   // ============================================
//   // FETCH DELIVERY METHODS
//   // ============================================
//   const { data: deliveryData, isLoading, error } = useQuery({
//     queryKey: ["deliveryMethods"],
//     queryFn: async () => {
//       const response = await fetchWithAuth("/delivery", {
//         method: "GET",
//       })
 
//       if (!response.ok) {
//         throw new Error("Failed to fetch delivery methods")
//       }
 
//       const result = await response.json()
//       return result
//     },
//     staleTime: 5 * 60 * 1000,
//   })
 
//   const deliveryMethods = deliveryData?.data || []
 
//   // ============================================
//   // CREATE DELIVERY METHOD
//   // ============================================
//   const createMutation = useMutation({
//     mutationFn: async (data) => {
//       const response = await fetchWithAuth("/delivery", {
//         method: "POST",
//         body: JSON.stringify({
//           location: data.location,
//           label: data.label,
//           description: data.description,
//           note: data.note,
//           price: parseFloat(data.price),
//         }),
//       })
 
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to create delivery method")
//       }
 
//       return await response.json()
//     },
//     onSuccess: () => {
//       toast.success("Delivery method created successfully")
//       queryClient.invalidateQueries({ queryKey: ["deliveryMethods"] })
//       setIsDialogOpen(false)
//       resetForm()
//     },
//     onError: (error) => {
//       toast.error(error.message)
//     },
//   })
 
//   // ============================================
//   // UPDATE DELIVERY METHOD
//   // ============================================
//   const updateMutation = useMutation({
//     mutationFn: async (data) => {
//       const deliveryId = data._id
//       const response = await fetchWithAuth(`/delivery/${deliveryId}`, {
//         method: "PUT",
//         body: JSON.stringify({
//           location: data.location,
//           label: data.label,
//           description: data.description,
//           note: data.note,
//           price: parseFloat(data.price),
//         }),
//       })
 
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to update delivery method")
//       }
 
//       return await response.json()
//     },
//     onSuccess: () => {
//       toast.success("Delivery method updated successfully")
//       queryClient.invalidateQueries({ queryKey: ["deliveryMethods"] })
//       setIsDialogOpen(false)
//       resetForm()
//     },
//     onError: (error) => {
//       toast.error(error.message)
//     },
//   })
 
//   // ============================================
//   // TOGGLE ACTIVE STATUS
//   // ============================================
//   const toggleActiveMutation = useMutation({
//     mutationFn: async ({ deliveryId, isActive }) => {
//       const response = await fetchWithAuth(`/delivery/${deliveryId}/toggle`, {
//         method: "PATCH",
//         body: JSON.stringify({ active: !isActive }),
//       })
 
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to update delivery method status")
//       }
 
//       return await response.json()
//     },
//     onSuccess: (data, variables) => {
//       toast.success(
//         variables.isActive ? "Delivery method disabled" : "Delivery method activated"
//       )
//       queryClient.invalidateQueries({ queryKey: ["deliveryMethods"] })
//     },
//     onError: (error) => {
//       toast.error(error.message)
//     },
//   })
 
//   // ============================================
//   // DELETE DELIVERY METHOD
//   // ============================================
//   const deleteMutation = useMutation({
//     mutationFn: async (deliveryId) => {
//       const response = await fetchWithAuth(`/delivery/${deliveryId}`, {
//         method: "DELETE",
//       })
 
//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.message || "Failed to delete delivery method")
//       }
 
//       return await response.json()
//     },
//     onSuccess: () => {
//       toast.success("Delivery method deleted successfully")
//       queryClient.invalidateQueries({ queryKey: ["deliveryMethods"] })
//       setDeleteDialogOpen(false)
//       setDeliveryToDelete(null)
//     },
//     onError: (error) => {
//       toast.error(error.message)
//     },
//   })
 
//   // ============================================
//   // HANDLERS
//   // ============================================
//   const resetForm = () => {
//     setEditingDelivery(null)
//     setFormData({
//       location: "",
//       label: "",
//       description: "",
//       note: "",
//       price: "",
//     })
//   }
 
//   const handleAddNew = () => {
//     resetForm()
//     setIsDialogOpen(true)
//   }
 
//   const handleEdit = (delivery) => {
//     setEditingDelivery(delivery)
//     setFormData({
//       location: delivery.location,
//       label: delivery.label,
//       description: delivery.description || "",
//       note: delivery.note || "",
//       price: delivery.price?.toString() || "",
//     })
//     setIsDialogOpen(true)
//   }
 
//   const handleSave = () => {
//     if (!formData.location || !formData.label || !formData.description || !formData.price) {
//       toast.error("Please fill in all required fields")
//       return
//     }
 
//     if (editingDelivery) {
//       updateMutation.mutate({ ...formData, _id: editingDelivery._id })
//     } else {
//       createMutation.mutate(formData)
//     }
//   }
 
//   const handleToggleActive = (delivery) => {
//     toggleActiveMutation.mutate({
//       deliveryId: delivery._id,
//       isActive: delivery.active,
//     })
//   }
 
//   const handleDeleteClick = (delivery) => {
//     setDeliveryToDelete(delivery)
//     setDeleteDialogOpen(true)
//   }
 
//   const confirmDelete = () => {
//     if (deliveryToDelete) {
//       deleteMutation.mutate(deliveryToDelete._id)
//     }
//   }
 
//   // ============================================
//   // FILTER & SORT
//   // ============================================
//   const filteredDeliveryMethods = deliveryMethods
//     .filter((delivery) => {
//       if (
//         searchQuery &&
//         !delivery.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         !delivery.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         !delivery.description?.toLowerCase().includes(searchQuery.toLowerCase())
//       ) {
//         return false
//       }
//       return true
//     })
//     .sort((a, b) => {
//       let comparison = 0
//       switch (sortBy) {
//         case "label":
//           comparison = a.label.localeCompare(b.label)
//           break
//         case "location":
//           comparison = a.location.localeCompare(b.location)
//           break
//         case "price":
//           comparison = a.price - b.price
//           break
//         default:
//           comparison = 0
//       }
//       return sortOrder === "desc" ? -comparison : comparison
//     })
 
//   if (error) {
//     return (
//       <div className="rounded-lg border border-red-200 bg-red-50 p-4">
//         <p className="text-red-800">Failed to load delivery methods: {error.message}</p>
//       </div>
//     )
//   }
 
//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold tracking-tight">Delivery Methods</h2>
//         <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
//           <Plus className="mr-2 h-4 w-4" />
//           Add Delivery Method
//         </Button>
//       </div>
 
//       <Card>
//         <CardHeader className="pb-4">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//             <div>
//               <CardTitle>Delivery Options</CardTitle>
//               <CardDescription>Manage delivery locations and their pricing.</CardDescription>
//             </div>
//             <div className="flex flex-wrap items-center gap-2">
//               {/* Search */}
//               <div className="relative w-full sm:w-48">
//                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search methods..."
//                   className="pl-8"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
 
//               {/* Sort */}
//               <select
//                 className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2"
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//               >
//                 <option value="label">Label</option>
//                 <option value="location">Location</option>
//                 <option value="price">Price</option>
//               </select>
 
//               <Button
//                 variant="outline"
//                 size="icon"
//                 onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//               >
//                 <ArrowUpDown className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {isLoading ? (
//             <div className="flex justify-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-green-600" />
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead className="whitespace-nowrap">Location</TableHead>
//                     <TableHead className="whitespace-nowrap">Label</TableHead>
//                     <TableHead className="whitespace-nowrap">Description</TableHead>
//                     <TableHead className="whitespace-nowrap">Price (GHS)</TableHead>
//                     <TableHead className="whitespace-nowrap">Status</TableHead>
//                     <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredDeliveryMethods.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan="6" className="text-center py-8 text-slate-500">
//                         No delivery methods found
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     filteredDeliveryMethods.map((delivery) => (
//                       <TableRow key={delivery._id}>
//                         <TableCell className="font-medium whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <Truck className="h-4 w-4 text-slate-500" />
//                             {delivery.location}
//                           </div>
//                         </TableCell>
//                         <TableCell className="whitespace-nowrap font-medium">
//                           {delivery.label}
//                         </TableCell>
//                         <TableCell className="max-w-xs truncate">
//                           {delivery.description || "—"}
//                         </TableCell>
//                         <TableCell className="whitespace-nowrap">
//                           GHS {delivery.price?.toFixed(2)}
//                         </TableCell>
//                         <TableCell className="whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <Switch
//                               className="border-2 border-[#949596]"
//                               checked={delivery.active}
//                               onCheckedChange={() => handleToggleActive(delivery)}
//                               disabled={toggleActiveMutation.isPending}
//                             />
//                             <Badge
//                               variant={delivery.active ? "default" : "secondary"}
//                               className={
//                                 delivery.active
//                                   ? "bg-green-500 hover:bg-green-600 text-white font-semibold"
//                                   : "bg-slate-200 text-slate-600"
//                               }
//                             >
//                               {delivery.active ? "Active" : "Inactive"}
//                             </Badge>
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-right whitespace-nowrap">
//                           <div className="flex justify-end gap-2">
//                             <Button
//                               size="icon"
//                               variant="ghost"
//                               className="h-8 w-8 hover:bg-slate-100"
//                               onClick={() => handleEdit(delivery)}
//                             >
//                               <Edit2 className="h-4 w-4 text-slate-600" />
//                             </Button>
//                             <Button
//                               size="icon"
//                               variant="ghost"
//                               className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
//                               onClick={() => handleDeleteClick(delivery)}
//                               disabled={deleteMutation.isPending}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
 
//       {/* Create/Edit Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[425px] bg-white/95 shadow-2xl border border-slate-200">
//           <DialogHeader>
//             <DialogTitle>
//               {editingDelivery ? "Edit Delivery Method" : "Create Delivery Method"}
//             </DialogTitle>
//             <DialogDescription>
//               Configure the delivery location, label, and pricing.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             {/* LOCATION */}
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="location" className="text-right">
//                 Location 
//               </Label>
//               <Input
//                 id="location"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                 className="col-span-3"
//                 placeholder="e.g. Accra"
//               />
//             </div>
 
//             {/* LABEL */}
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="label" className="text-right">
//                 Label 
//               </Label>
//               <Input
//                 id="label"
//                 value={formData.label}
//                 onChange={(e) => setFormData({ ...formData, label: e.target.value })}
//                 className="col-span-3"
//                 placeholder="e.g. Standard Delivery"
//               />
//             </div>
 
//             {/* DESCRIPTION */}
//             <div className="grid grid-cols-4 items-start gap-4">
//               <Label htmlFor="description" className="text-right pt-2">
//                 Description 
//               </Label>
//               <Textarea
//                 id="description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 className="col-span-3"
//                 placeholder="Describe this delivery method..."
//                 rows={3}
//               />
//             </div>
 
//             {/* NOTE */}
//             <div className="grid grid-cols-4 items-start gap-4">
//               <Label htmlFor="note" className="text-right pt-2">
//                 Note
//               </Label>
//               <Textarea
//                 id="note"
//                 value={formData.note}
//                 onChange={(e) => setFormData({ ...formData, note: e.target.value })}
//                 className="col-span-3"
//                 placeholder="Optional note..."
//                 rows={2}
//               />
//             </div>
 
//             {/* PRICE */}
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="price" className="text-right">
//                 Price (GHS) 
//               </Label>
//               <Input
//                 id="price"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 value={formData.price}
//                 onChange={(e) => setFormData({ ...formData, price: e.target.value })}
//                 className="col-span-3"
//                 placeholder="0.00"
//               />
//             </div>
//           </div>
//           <DialogFooter className="mt-2 flex flex-row justify-end gap-3">
//             <Button
//               variant="outline"
//               onClick={() => setIsDialogOpen(false)}
//               className="min-w-[90px] justify-center"
//               disabled={createMutation.isPending || updateMutation.isPending}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSave}
//               className="min-w-[120px] justify-center bg-green-600 hover:bg-green-700 text-white font-semibold"
//               disabled={createMutation.isPending || updateMutation.isPending}
//             >
//               {createMutation.isPending || updateMutation.isPending ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save Changes"
//               )}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
 
//       {/* Delete Confirmation Dialog */}
//       <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <AlertDialogContent className="bg-white">
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete the <strong>{deliveryToDelete?.label}</strong> delivery
//               method. This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel className="hover:bg-slate-300" disabled={deleteMutation.isPending}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDelete}
//               className="bg-red-600 hover:bg-red-700 text-white font-semibold"
//               disabled={deleteMutation.isPending}
//             >
//               {deleteMutation.isPending ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Deleting...
//                 </>
//               ) : (
//                 "Delete Method"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }