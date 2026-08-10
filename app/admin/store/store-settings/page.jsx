// "use client"

// import { useState, useEffect } from "react"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { fetchWithAuth } from "@/lib/utility/fetchWithAuth"
// import toast from "react-hot-toast"
// import { Loader2, Save, Store, Palette, Phone, Shield, ChevronDown, Navigation } from "lucide-react"
// import { Poppins } from "next/font/google"
// import VendlyLifeAvater from "@/components/vendly-loader"

// const poppins = Poppins({
//     weight: ["400", "500", "600", "700"],
//     subsets: ["latin"],
// })

// // ── Shared UI primitives ───────────────────────────────────────────────────

// const SectionCard = ({ title, description, children, defaultOpen = true }) => {
//     const [open, setOpen] = useState(defaultOpen)
//     return (
//         <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-fit">
//             <button
//                 onClick={() => setOpen((o) => !o)}
//                 className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-colors"
//             >
//                 <div className="text-left">
//                     <p className="text-base font-semibold  tracking-tight">{title}</p>
//                     <p className="text-xs  font-medium mt-0.5">{description}</p>
//                 </div>
//                 <ChevronDown
//                     size={16}
//                     className={` transition-transform duration-200 shrink-0 ml-4 ${open ? "rotate-180" : ""}`}
//                 />
//             </button>
//             {open ? (
//                 <div className="px-6 pb-6 border-t border-slate-100">
//                     {children}
//                 </div>
//             ) : (
//                 <div className="border-t border-slate-100 flex items-center justify-center py-10">
//                     <div className="flex flex-col items-center gap-2 opacity-100 select-none">
//                         {/* <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <rect width="40" height="40" rx="10" fill="#03563E"/>
//               <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Poppins, sans-serif">V</text>
//             </svg> */}
//                         <img
//                             src="/v.svg"
//                             alt="Vendly Logo"
//                             className="h-8 w-8 rounded-lg  object-cover"
//                         />
//                         <span className="text-xs font-semibold  tracking-widest uppercase">Vendly</span>
//                     </div>
//                 </div>
//             )}
//         </div>
//     )
// }

// const Field = ({ label, hint, children }) => (
//     <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-bold  uppercase tracking-widest">{label}</label>
//         {hint && <p className="text-xs  -mt-1">{hint}</p>}
//         {children}
//     </div>
// )

// const TextInput = ({ value, onChange, placeholder, ...props }) => (
//     <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm  placeholder: focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-slate-50"
//         {...props}
//     />
// )

// const TextArea = ({ value, onChange, placeholder, rows = 3 }) => (
//     <textarea
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         rows={rows}
//         className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm  placeholder:text-slate-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-slate-50 resize-none"
//     />
// )

// const ColorInput = ({ label, value, onChange }) => (
//     <div className="flex flex-col gap-1.5">
//         <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{label}</label>
//         <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
//             <input
//                 type="color"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0"
//             />
//             <input
//                 type="text"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="flex-1 bg-transparent text-sm text-slate-800 outline-none font-mono"
//             />
//         </div>
//     </div>
// )

// const Toggle = ({ checked, onChange, label }) => (
//     <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 border border-slate-200">
//         <span className="text-sm font-semibold text-slate-700">{label}</span>
//         <button
//             onClick={() => onChange(!checked)}
//             className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-green-500" : "bg-slate-300"}`}
//         >
//             <span
//                 className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
//             />
//         </button>
//     </div>
// )

// const SaveButton = ({ onSave, isPending, label = "Save Section" }) => (
//     <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
//         <button
//             onClick={onSave}
//             disabled={isPending}
//             className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition-colors"
//         >
//             {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
//             {isPending ? "Saving..." : label}
//         </button>
//     </div>
// )

// const FONT_OPTIONS = ["DM Sans", "Inter", "Playfair Display", "Lora", "Nunito", "Poppins"]

// const Select = ({ value, onChange, options }) => (
//     <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-slate-50 transition-all"
//     >
//         {options.map((opt) => (
//             <option key={opt} value={opt}>{opt}</option>
//         ))}
//     </select>
// )

// // ── Section: Branding ──────────────────────────────────────────────────────

// const BrandingSection = ({ initial, onSave, isPending }) => {
//     const [data, setData] = useState({
//         storeName: "",
//         tagline: "",
//         ownerName: "",
//         logoUrl: "",
//         primaryColor: "#03563E",
//         accentColor: "#34D399",
//         bottomColor: "#022C22",
//         headingFont: "DM Sans",
//         bodyFont: "DM Sans",
//         ...initial,
//     })

//     useEffect(() => { if (initial) setData((p) => ({ ...p, ...initial })) }, [initial])

//     const set = (key) => (val) => setData((p) => ({ ...p, [key]: val }))

//     return (
//         <div className="space-y-5 pt-5">
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Field label="Store Name" hint="Displayed in the header and browser tab">
//                     <TextInput value={data.storeName} onChange={set("storeName")} placeholder="e.g. David Chuks Imports" />
//                 </Field>
//                 <Field label="Owner Name" hint="Used in newsletter copy — 'stories from ___'">
//                     <TextInput value={data.ownerName} onChange={set("ownerName")} placeholder="e.g. David" />
//                 </Field>
//             </div>

//             <Field label="Tagline" hint="Short line shown in the footer beneath the store name">
//                 <TextInput value={data.tagline} onChange={set("tagline")} placeholder="e.g. Premium imports. Delivered with care." />
//             </Field>

//             <Field label="Logo URL" hint="Paste a hosted image URL. Leave blank to use the store name as text.">
//                 <div className="flex gap-2">
//                     <TextInput value={data.logoUrl} onChange={set("logoUrl")} placeholder="https://..." />
//                     {data.logoUrl && (
//                         <img src={data.logoUrl} alt="logo preview" className="h-10 w-16 object-contain rounded-lg border border-slate-200 bg-slate-50 shrink-0" onError={(e) => e.target.style.display = "none"} />
//                     )}
//                 </div>
//             </Field>

//             <div>
//                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Brand Colors</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <ColorInput label="Primary" value={data.primaryColor} onChange={set("primaryColor")} />
//                     <ColorInput label="Accent" value={data.accentColor} onChange={set("accentColor")} />
//                     <ColorInput label="Footer Dark" value={data.bottomColor} onChange={set("bottomColor")} />
//                 </div>
//             </div>

//             <div>
//                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-3">Typography</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Field label="Heading Font">
//                         <Select value={data.headingFont} onChange={set("headingFont")} options={FONT_OPTIONS} />
//                     </Field>
//                     <Field label="Body Font">
//                         <Select value={data.bodyFont} onChange={set("bodyFont")} options={FONT_OPTIONS} />
//                     </Field>
//                 </div>
//             </div>

//             <SaveButton onSave={() => onSave(data)} isPending={isPending} />
//         </div>
//     )
// }

// // ── Section: Hero ──────────────────────────────────────────────────────────

// const HeroSection = ({ initial, onSave, isPending }) => {
//     const [data, setData] = useState({
//         slides: [
//             { image: "", tag: "", title: "", subtitle: "" },
//         ],
//         ...initial,
//     })

//     useEffect(() => { if (initial) setData((p) => ({ ...p, ...initial })) }, [initial])

//     const updateSlide = (i, key, val) => {
//         const slides = [...data.slides]
//         slides[i] = { ...slides[i], [key]: val }
//         setData((p) => ({ ...p, slides }))
//     }

//     const addSlide = () =>
//         setData((p) => ({ ...p, slides: [...p.slides, { image: "", tag: "", title: "", subtitle: "" }] }))

//     const removeSlide = (i) =>
//         setData((p) => ({ ...p, slides: p.slides.filter((_, idx) => idx !== i) }))

//     return (
//         <div className="space-y-5 pt-5">
//             <div className="flex items-center justify-between">
//                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Hero Slides</p>
//                 <button
//                     onClick={addSlide}
//                     className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
//                 >
//                     + Add Slide
//                 </button>
//             </div>

//             <div className="space-y-4">
//                 {data.slides.map((slide, i) => (
//                     <div key={i} className="rounded-xl border border-slate-200 p-4 space-y-3 bg-slate-50">
//                         <div className="flex items-center justify-between">
//                             <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Slide {i + 1}</p>
//                             {data.slides.length > 1 && (
//                                 <button
//                                     onClick={() => removeSlide(i)}
//                                     className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
//                                 >
//                                     Remove
//                                 </button>
//                             )}
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                             <Field label="Tag" hint="Small eyebrow label e.g. 'New Arrivals'">
//                                 <TextInput value={slide.tag} onChange={(v) => updateSlide(i, "tag", v)} placeholder="e.g. New Arrivals" />
//                             </Field>
//                             <Field label="Background Image URL">
//                                 <div className="flex gap-2">
//                                     <TextInput value={slide.image} onChange={(v) => updateSlide(i, "image", v)} placeholder="https://..." />
//                                     {slide.image && (
//                                         <img src={slide.image} alt="" className="h-10 w-14 object-cover rounded-lg border border-slate-200 shrink-0" onError={(e) => e.target.style.display = "none"} />
//                                     )}
//                                 </div>
//                             </Field>
//                         </div>

//                         <Field label="Title">
//                             <TextInput value={slide.title} onChange={(v) => updateSlide(i, "title", v)} placeholder="e.g. Premium Products, Delivered." />
//                         </Field>

//                         <Field label="Subtitle">
//                             <TextArea value={slide.subtitle} onChange={(v) => updateSlide(i, "subtitle", v)} placeholder="e.g. Verified quality products at unbeatable prices." rows={2} />
//                         </Field>
//                     </div>
//                 ))}
//             </div>

//             <SaveButton onSave={() => onSave(data)} isPending={isPending} />
//         </div>
//     )
// }

// // ── Section: Navigation ────────────────────────────────────────────────────

// const LinkListEditor = ({ label, links, onChange }) => {
//     const update = (i, key, val) => {
//         const next = [...links]
//         next[i] = { ...next[i], [key]: val }
//         onChange(next)
//     }
//     const add = () => onChange([...links, { label: "", url: "" }])
//     const remove = (i) => onChange(links.filter((_, idx) => idx !== i))

//     return (
//         <div className="space-y-2">
//             <div className="flex items-center justify-between">
//                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">{label}</p>
//                 <button onClick={add} className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors">
//                     + Add
//                 </button>
//             </div>
//             {links.length === 0 && (
//                 <p className="text-xs text-slate-400 italic py-2">No links yet. Click + Add to create one.</p>
//             )}
//             {links.map((link, i) => (
//                 <div key={i} className="flex items-center gap-2">
//                     <input
//                         value={link.label}
//                         onChange={(e) => update(i, "label", e.target.value)}
//                         placeholder="Label"
//                         className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-green-500 transition-all"
//                     />
//                     <input
//                         value={link.url}
//                         onChange={(e) => update(i, "url", e.target.value)}
//                         placeholder="/path"
//                         className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-green-500 transition-all font-mono"
//                     />
//                     <button onClick={() => remove(i)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0 text-lg leading-none">×</button>
//                 </div>
//             ))}
//         </div>
//     )
// }

// const NavigationSection = ({ initial, onSave, isPending }) => {
//     const [data, setData] = useState({
//         announcementBar: "Free Store Pickup Available | Order Online, Pick Up Today",
//         navLinks: [],
//         shopLinks: [],
//         customerCareLinks: [],
//         companyLinks: [],
//         ...initial,
//     })

//     useEffect(() => { if (initial) setData((p) => ({ ...p, ...initial })) }, [initial])

//     const set = (key) => (val) => setData((p) => ({ ...p, [key]: val }))

//     return (
//         <div className="space-y-6 pt-5">
//             <Field label="Announcement Bar" hint="The green strip at the very top of your store">
//                 <TextInput value={data.announcementBar} onChange={set("announcementBar")} placeholder="Free Store Pickup Available | Order Online, Pick Up Today" />
//             </Field>

//             <div className="h-px bg-slate-100" />
//             <LinkListEditor label="Header Nav Links" links={data.navLinks} onChange={set("navLinks")} />

//             <div className="h-px bg-slate-100" />
//             <LinkListEditor label="Footer — Shop Links" links={data.shopLinks} onChange={set("shopLinks")} />

//             <div className="h-px bg-slate-100" />
//             <LinkListEditor label="Footer — Customer Care Links" links={data.customerCareLinks} onChange={set("customerCareLinks")} />

//             <div className="h-px bg-slate-100" />
//             <LinkListEditor label="Footer — Company Links" links={data.companyLinks} onChange={set("companyLinks")} />

//             <SaveButton onSave={() => onSave(data)} isPending={isPending} />
//         </div>
//     )
// }

// // ── Section: Contact & Social ──────────────────────────────────────────────

// const ContactSection = ({ initial, onSave, isPending }) => {
//     const [data, setData] = useState({
//         info: { phone: "", email: "", address: "", pickupAvailable: false },
//         socials: { instagram: "", facebook: "", whatsapp: "", twitter: "" },
//         ...initial,
//     })

//     useEffect(() => { if (initial) setData((p) => ({ ...p, ...initial })) }, [initial])

//     const setInfo = (key) => (val) => setData((p) => ({ ...p, info: { ...p.info, [key]: val } }))
//     const setSocial = (key) => (val) => setData((p) => ({ ...p, socials: { ...p.socials, [key]: val } }))

//     return (
//         <div className="space-y-5 pt-5">
//             <div>
//                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Contact Info</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Field label="Phone">
//                         <TextInput value={data.info.phone} onChange={setInfo("phone")} placeholder="+233 XX XXX XXXX" />
//                     </Field>
//                     <Field label="Email">
//                         <TextInput value={data.info.email} onChange={setInfo("email")} placeholder="hello@yourstore.com" type="email" />
//                     </Field>
//                 </div>
//                 <div className="mt-4">
//                     <Field label="Address">
//                         <TextInput value={data.info.address} onChange={setInfo("address")} placeholder="Accra, Ghana" />
//                     </Field>
//                 </div>
//                 <div className="mt-4">
//                     <Toggle
//                         checked={data.info.pickupAvailable}
//                         onChange={setInfo("pickupAvailable")}
//                         label="Free Store Pickup Available"
//                     />
//                 </div>
//             </div>

//             <div className="h-px bg-slate-100" />

//             <div>
//                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Social Links</p>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <Field label="Instagram">
//                         <TextInput value={data.socials.instagram} onChange={setSocial("instagram")} placeholder="https://instagram.com/..." />
//                     </Field>
//                     <Field label="Facebook">
//                         <TextInput value={data.socials.facebook} onChange={setSocial("facebook")} placeholder="https://facebook.com/..." />
//                     </Field>
//                     <Field label="WhatsApp Number" hint="Just the number, no https">
//                         <TextInput value={data.socials.whatsapp} onChange={setSocial("whatsapp")} placeholder="233XXXXXXXXX" />
//                     </Field>
//                     <Field label="Twitter / X">
//                         <TextInput value={data.socials.twitter} onChange={setSocial("twitter")} placeholder="https://twitter.com/..." />
//                     </Field>
//                 </div>
//             </div>

//             <SaveButton onSave={() => onSave(data)} isPending={isPending} />
//         </div>
//     )
// }

// // ── Section: Trust & Footer ────────────────────────────────────────────────

// const TrustSection = ({ initial, onSave, isPending }) => {
//     const [data, setData] = useState({
//         badges: [
//             { icon: "", label: "Verified Quality" },
//             { icon: "→", label: "Nationwide Delivery" },
//             { icon: "→", label: "Free Store Pickup" },
//         ],
//         newsletterHeading: "Join Our Community",
//         newsletterSubtext: "",
//         footerText: "",
//         ...initial,
//     })

//     useEffect(() => { if (initial) setData((p) => ({ ...p, ...initial })) }, [initial])

//     const set = (key) => (val) => setData((p) => ({ ...p, [key]: val }))

//     const updateBadge = (i, key, val) => {
//         const badges = [...data.badges]
//         badges[i] = { ...badges[i], [key]: val }
//         setData((p) => ({ ...p, badges }))
//     }

//     const addBadge = () => setData((p) => ({ ...p, badges: [...p.badges, { icon: "", label: "" }] }))
//     const removeBadge = (i) => setData((p) => ({ ...p, badges: p.badges.filter((_, idx) => idx !== i) }))

//     return (
//         <div className="space-y-6 pt-5">
//             <div>
//                 <div className="flex items-center justify-between mb-3">
//                     <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Trust Badges</p>
//                     <button onClick={addBadge} className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100 transition-colors">
//                         + Add Badge
//                     </button>
//                 </div>
//                 <div className="space-y-2">
//                     {data.badges.map((badge, i) => (
//                         <div key={i} className="flex items-center gap-2">
//                             <input
//                                 value={badge.icon}
//                                 onChange={(e) => updateBadge(i, "icon", e.target.value)}
//                                 placeholder="✓"
//                                 className="w-14 h-9 px-2 text-center rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-green-500 transition-all"
//                             />
//                             <input
//                                 value={badge.label}
//                                 onChange={(e) => updateBadge(i, "label", e.target.value)}
//                                 placeholder="e.g. Verified Quality"
//                                 className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:border-green-500 transition-all"
//                             />
//                             <button onClick={() => removeBadge(i)} className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none shrink-0">×</button>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="h-px bg-slate-100" />

//             <div>
//                 <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4">Newsletter</p>
//                 <div className="space-y-4">
//                     <Field label="Heading">
//                         <TextInput value={data.newsletterHeading} onChange={set("newsletterHeading")} placeholder="Join Our Community" />
//                     </Field>
//                     <Field label="Subtext" hint="Leave blank to auto-generate from owner name">
//                         <TextArea value={data.newsletterSubtext} onChange={set("newsletterSubtext")} placeholder="Get exclusive access to new arrivals, secret sales..." />
//                     </Field>
//                 </div>
//             </div>

//             <div className="h-px bg-slate-100" />

//             <Field label="Footer Copyright Text" hint="Leave blank to auto-generate: © 2025 Store Name. All rights reserved.">
//                 <TextInput value={data.footerText} onChange={set("footerText")} placeholder="© 2025 Sarah Lawson Imports. All rights reserved." />
//             </Field>

//             <SaveButton onSave={() => onSave(data)} isPending={isPending} />
//         </div>
//     )
// }

// // ── Main Page ──────────────────────────────────────────────────────────────

// export default function StoreSettingsPage() {
//     const queryClient = useQueryClient()

//     // ── Fetch current config ──
//     const { data: configData, isLoading } = useQuery({
//         queryKey: ["storeConfig"],
//         queryFn: async () => {
//             const res = await fetchWithAuth("/store-config", { method: "GET" })
//             if (!res.ok) throw new Error("Failed to load store config")
//             const json = await res.json()
//             return json.data
//         },
//         staleTime: 60 * 1000,
//     })

//     // ── Per-section mutation factory ──
//     const makeMutation = (section) =>
//         useMutation({
//             mutationFn: async (payload) => {
//                 const res = await fetchWithAuth(`/store-config/${section}`, {
//                     method: "PUT",
//                     body: JSON.stringify(payload),
//                 })
//                 if (!res.ok) {
//                     const err = await res.json().catch(() => ({}))
//                     throw new Error(err.message || `Failed to save ${section}`)
//                 }
//                 return res.json()
//             },
//             onSuccess: () => {
//                 toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} saved`)
//                 queryClient.invalidateQueries({ queryKey: ["storeConfig"] })
//             },
//             onError: (err) => toast.error(err.message),
//         })

//     const brandingMutation = makeMutation("branding")
//     const heroMutation = makeMutation("hero")
//     const navigationMutation = makeMutation("navigation")
//     const contactMutation = makeMutation("contact")
//     const trustMutation = makeMutation("trust")

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center py-24 h-screen">
//                       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                         <div className="text-center">
//                           <VendlyLifeAvater loading={isLoading} />
//                         </div>
//                       </div>
//             </div>
//         )
//     }

//     return (
//         <div className={`${poppins.className} max-w-7xl px-2 py-4`}>

//             {/* Page header */}
//             <div className="mb-8">
//                 <h1 className="text-2xl font-bold  tracking-tight">Store Settings</h1>
//                 <p className="text-sm  font-medium mt-1">
//                     Customise how your storefront looks and feels. Each section saves independently.
//                 </p>
//             </div>

//             {/* 2-2-1 grid on desktop, single column on mobile */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 {/* Row 1 */}
//                 <SectionCard
//                     title="Branding"
//                     description="Store name, logo, colors, and typography"
//                 >
//                     <BrandingSection
//                         initial={configData?.branding}
//                         onSave={brandingMutation.mutate}
//                         isPending={brandingMutation.isPending}
//                     />
//                 </SectionCard>

//                 <SectionCard
//                     title="Hero Slides"
//                     description="The rotating banner at the top of your store"
//                     defaultOpen={false}
//                 >
//                     <HeroSection
//                         initial={configData?.hero}
//                         onSave={heroMutation.mutate}
//                         isPending={heroMutation.isPending}
//                     />
//                 </SectionCard>

//                 {/* Row 2 */}
//                 <SectionCard
//                     title="Navigation"
//                     description="Header links, announcement bar, and footer link groups"
//                     defaultOpen={false}
//                 >
//                     <NavigationSection
//                         initial={configData?.navigation}
//                         onSave={navigationMutation.mutate}
//                         isPending={navigationMutation.isPending}
//                     />
//                 </SectionCard>

//                 <SectionCard
//                     title="Contact & Social"
//                     description="Phone, email, address, pickup toggle, and social links"
//                     defaultOpen={false}
//                 >
//                     <ContactSection
//                         initial={configData?.contact}
//                         onSave={contactMutation.mutate}
//                         isPending={contactMutation.isPending}
//                     />
//                 </SectionCard>

//                 {/* Row 3 — centered across both columns */}
//                 <div className="md:col-span-2 md:w-1/2 md:mx-auto w-full">
//                     <SectionCard
//                         title="Trust & Footer"
//                         description="Trust badges, newsletter copy, and footer text"
//                         defaultOpen={false}
//                     >
//                         <TrustSection
//                             initial={configData?.trust}
//                             onSave={trustMutation.mutate}
//                             isPending={trustMutation.isPending}
//                         />
//                     </SectionCard>
//                 </div>

//             </div>
//         </div>
//     )
// }