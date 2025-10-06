"use client";

import { useState } from "react";
import { ContactMessage } from "@prisma/client";
import { Mail, MailOpen, Trash2, Calendar, User, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface InboxContentProps {
  messages: ContactMessage[];
}

export function InboxContent({ messages: initialMessages }: InboxContentProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });

      if (response.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, read } : msg))
        );
        if (selectedMessage?.id === id) {
          setSelectedMessage({ ...selectedMessage, read });
        }
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch(`/api/contact-messages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.read;
    if (filter === "read") return msg.read;
    return true;
  });

  const unreadCount = messages.filter((msg) => !msg.read).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Messages List */}
      <div className="lg:col-span-1 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            All ({messages.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="flex-1"
          >
            Unread ({unreadCount})
          </Button>
          <Button
            variant={filter === "read" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("read")}
            className="flex-1"
          >
            Read
          </Button>
        </div>

        {/* Messages List */}
        <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6 text-center text-slate-400">
                No messages found
              </CardContent>
            </Card>
          ) : (
            filteredMessages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id
                    ? "bg-cyan-500/10 border-cyan-500"
                    : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                } ${!message.read ? "border-l-4 border-l-cyan-500" : ""}`}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) {
                    handleMarkAsRead(message.id, true);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {message.read ? (
                          <MailOpen className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        ) : (
                          <Mail className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                        )}
                        <p className="font-semibold text-white truncate">
                          {message.name}
                        </p>
                      </div>
                      <p className="text-sm text-slate-400 mt-1 truncate">
                        {message.subject || "No subject"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {format(new Date(message.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Message Detail */}
      <div className="lg:col-span-2">
        {selectedMessage ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white">
                      {selectedMessage.subject || "No subject"}
                    </CardTitle>
                    <Badge variant={selectedMessage.read ? "secondary" : "default"}>
                      {selectedMessage.read ? "Read" : "Unread"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-400">
                      <User className="h-4 w-4" />
                      <span>{selectedMessage.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <AtSign className="h-4 w-4" />
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="hover:text-cyan-400 transition-colors"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(
                          new Date(selectedMessage.createdAt),
                          "MMMM d, yyyy 'at' h:mm a"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleMarkAsRead(selectedMessage.id, !selectedMessage.read)
                    }
                  >
                    {selectedMessage.read ? (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Mark Unread
                      </>
                    ) : (
                      <>
                        <MailOpen className="h-4 w-4 mr-2" />
                        Mark Read
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(selectedMessage.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p className="text-slate-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center text-slate-400">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a message to view details</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
