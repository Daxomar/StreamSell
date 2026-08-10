// /admin/store/store-front-preview/page.jsx
"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

export default function StorePreviewPage() {
    const [device, setDevice] = useState("desktop");

    const storeUrl = "/store/shop?resellerCode=MINI-vAp5Jn";

    return (
        <div className="flex flex-col h-screen bg-slate-100">

            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shrink-0">
                <div>
                    <p className="text-sm font-black text-slate-800">Store Preview</p>
                    <p className="text-xs text-slate-400">This is your live storefront</p>
                </div>

                {/* Device toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setDevice("desktop")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${device === "desktop"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <Monitor size={14} />
                        Desktop
                    </button>
                    <button
                        onClick={() => setDevice("mobile")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${device === "mobile"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                    >
                        <Smartphone size={14} />
                        Mobile
                    </button>
                </div>
                <a

                    href={storeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-green-600 border border-green-200 bg-green-50 px-4 py-2 rounded-xl hover:bg-green-100 transition-colors"
                >
                    Open Live ↗
                </a>
            </div>

            {/* ── Preview frame ── */}
            <div className="flex-1 overflow-hidden flex items-start justify-center py-6 px-4">
                <div
                    className="transition-all duration-300 h-full"
                    style={{ width: device === "mobile" ? "390px" : "100%" }}
                >
                    <iframe
                        src={storeUrl}
                        className="w-full h-full rounded-2xl shadow-xl border-0 bg-white"
                        title="Store Preview"
                    />
                </div>
            </div>

        </div>
    );
}