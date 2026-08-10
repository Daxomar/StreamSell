"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Mail, ArrowLeft, Check, CheckCheck, Clock, User, Phone, Package } from "lucide-react"

// Mock ticket data
const mockTickets = [
  {
    id: "TKT-12345",
    customer: {
      name: "Kwame Osei",
      phone: "024 123 4567",
    },
    order: {
      id: "ORD-001",
      bundle: "5GB MTN Data Bundle",
      amount: 60.0,
    },
    status: "open",
    priority: "high",
    createdAt: "2024-10-22T10:00:00Z",
    updatedAt: "2024-10-22T10:10:00Z",
    messages: [
      {
        id: 1,
        sender: "customer",
        content: "Hello, I purchased a 5GB MTN bundle but it hasn't been delivered yet. It's been over 3 hours.",
        timestamp: "2024-10-22T10:00:00Z",
        read: true,
      },
      {
        id: 2,
        sender: "admin",
        content: "I'm sorry to hear that. Let me check your order status right away.",
        timestamp: "2024-10-22T10:05:00Z",
        read: true,
      },
      {
        id: 3,
        sender: "customer",
        content: "Thank you. Please let me know as soon as possible.",
        timestamp: "2024-10-22T10:10:00Z",
        read: false,
      },
    ],
  },
  {
    id: "TKT-12346",
    customer: {
      name: "Ama Serwaa",
      phone: "050 987 6543",
    },
    order: {
      id: "ORD-002",
      bundle: "10GB Telecel Data Bundle",
      amount: 100.0,
    },
    status: "open",
    priority: "medium",
    createdAt: "2024-10-22T09:30:00Z",
    updatedAt: "2024-10-22T09:45:00Z",
    messages: [
      {
        id: 1,
        sender: "customer",
        content: "I received the wrong data bundle. I ordered 10GB but got 5GB instead.",
        timestamp: "2024-10-22T09:30:00Z",
        read: true,
      },
    ],
  },
  {
    id: "TKT-12347",
    customer: {
      name: "Kofi Mensah",
      phone: "027 555 1234",
    },
    order: {
      id: "ORD-003",
      bundle: "2GB AT Data Bundle",
      amount: 25.0,
    },
    status: "resolved",
    priority: "low",
    createdAt: "2024-10-21T14:00:00Z",
    updatedAt: "2024-10-21T16:30:00Z",
    messages: [
      {
        id: 1,
        sender: "customer",
        content: "My data bundle expired before I could use it.",
        timestamp: "2024-10-21T14:00:00Z",
        read: true,
      },
      {
        id: 2,
        sender: "admin",
        content: "I've issued a replacement bundle to your number. Please check and confirm.",
        timestamp: "2024-10-21T16:00:00Z",
        read: true,
      },
      {
        id: 3,
        sender: "customer",
        content: "Received! Thank you so much for the quick resolution.",
        timestamp: "2024-10-21T16:30:00Z",
        read: true,
      },
    ],
  },
]

export default function AdminMessagesPage() {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [tickets, setTickets] = useState(mockTickets)

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.phone.includes(searchQuery) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = activeTab === "all" || ticket.status === activeTab
    
    return matchesSearch && matchesStatus
  })

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() || !selectedTicket) return
    
    const newMessage = {
      id: Date.now(),
      sender: "admin",
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    }

    setTickets(tickets.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, messages: [...t.messages, newMessage], updatedAt: new Date().toISOString() }
        : t
    ))

    setSelectedTicket({
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMessage]
    })

    setMessage("")
  }

  const handleResolveTicket = () => {
    if (!selectedTicket) return

    setTickets(tickets.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, status: "resolved" }
        : t
    ))

    setSelectedTicket({ ...selectedTicket, status: "resolved" })
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diff = Math.floor((now - date) / 1000 / 60)
    
    if (diff < 60) return `${diff} min ago`
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`
    return formatDate(timestamp)
  }

  // Ticket Detail View
  if (selectedTicket) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-lg border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedTicket(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-green-100 text-green-700">
                {selectedTicket.customer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedTicket.customer.name}</h3>
              <p className="text-xs text-slate-500">{selectedTicket.customer.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={selectedTicket.status === "open" ? "default" : "secondary"}>
              {selectedTicket.status === "open" ? "Open" : "Resolved"}
            </Badge>
            {selectedTicket.status === "open" && (
              <Button size="sm" variant="outline" onClick={handleResolveTicket}>
                Mark Resolved
              </Button>
            )}
          </div>
        </div>

        {/* Order Info */}
        <div className="p-4 bg-slate-50 border-b">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">{selectedTicket.order.bundle}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Order:</span>
              <span className="font-mono text-slate-900">{selectedTicket.order.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Amount:</span>
              <span className="font-medium text-slate-900">GHS {selectedTicket.order.amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {selectedTicket.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    msg.sender === "admin"
                      ? "bg-green-500 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className={`text-xs ${msg.sender === "admin" ? "text-green-100" : "text-slate-400"}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                    {msg.sender === "admin" && (
                      <span className="text-green-100">
                        {msg.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Reply Input */}
        {selectedTicket.status === "open" && (
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type your reply..."
                className="flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    )
  }

  // Ticket List View
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customer Messages</h2>
          <p className="text-slate-500">Manage support tickets and customer inquiries</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search tickets..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <CardHeader className="pb-0">
            <TabsList>
              <TabsTrigger value="all">
                All Tickets
                <Badge variant="secondary" className="ml-2">{tickets.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="open">
                Open
                <Badge variant="secondary" className="ml-2">
                  {tickets.filter(t => t.status === "open").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved
                <Badge variant="secondary" className="ml-2">
                  {tickets.filter(t => t.status === "resolved").length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="divide-y rounded-lg border">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-100 text-green-700">
                          {ticket.customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-slate-900">{ticket.customer.name}</h4>
                            <span className="text-xs text-slate-500">{ticket.id}</span>
                          </div>
                          <span className="text-xs text-slate-500">{getTimeAgo(ticket.updatedAt)}</span>
                        </div>
                        <p className="text-sm text-slate-600 truncate mb-2">
                          {ticket.messages[ticket.messages.length - 1]?.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant={ticket.status === "open" ? "default" : "secondary"} className="text-xs">
                            {ticket.status === "open" ? "Open" : "Resolved"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {ticket.order.bundle}
                          </Badge>
                          {ticket.messages.some(m => m.sender === "customer" && !m.read) && (
                            <Badge className="bg-red-500 text-xs">New</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Mail className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No tickets found</h3>
                  <p className="text-slate-500 mt-1">
                    {searchQuery
                      ? "No tickets match your search criteria."
                      : "When customers submit tickets, they will appear here."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
