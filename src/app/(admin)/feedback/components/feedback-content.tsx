"use client";

import { useState, useMemo } from "react";
import { Feedback } from "@prisma/client";
import { Star, Trash2, Search, RefreshCw, Ban, Check, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeedbackContentProps {
  initialFeedback: Feedback[];
  stats: {
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
    anonymousCount: number;
  };
}

export function FeedbackContent({ initialFeedback, stats }: FeedbackContentProps) {
  const [feedback, setFeedback] = useState(initialFeedback);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAnonymous, setFilterAnonymous] = useState<"all" | "anonymous" | "named">("all");
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "rating">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTogglingDisabled, setIsTogglingDisabled] = useState<string | null>(null);
  const [isTogglingFeatured, setIsTogglingFeatured] = useState<string | null>(null);

  // Filter and sort feedback
  const filteredFeedback = useMemo(() => {
    let result = [...feedback];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name?.toLowerCase().includes(query) ||
          f.feedback.toLowerCase().includes(query)
      );
    }

    // Anonymous filter
    if (filterAnonymous === "anonymous") {
      result = result.filter((f) => f.isAnonymous);
    } else if (filterAnonymous === "named") {
      result = result.filter((f) => !f.isAnonymous);
    }

    // Rating filter
    if (filterRating !== "all") {
      result = result.filter((f) => f.rating === filterRating);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
      }
    });

    return result;
  }, [feedback, searchQuery, filterAnonymous, filterRating, sortBy, sortOrder]);

  const handleDelete = async () => {
    if (!feedbackToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/feedback/${feedbackToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete feedback");
      }

      setFeedback((prev) => prev.filter((f) => f.id !== feedbackToDelete.id));
      setDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleDisabled = async (id: string) => {
    setIsTogglingDisabled(id);
    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle feedback state");
      }

      const updatedFeedback = await response.json();

      setFeedback((prev) =>
        prev.map((f) => (f.id === id ? updatedFeedback : f))
      );
    } catch (error) {
      console.error("Error toggling feedback state:", error);
      alert("Failed to toggle feedback state");
    } finally {
      setIsTogglingDisabled(null);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    setIsTogglingFeatured(id);
    try {
      const response = await fetch(`/api/feedback/${id}/featured`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle featured state");
      }

      const updatedFeedback = await response.json();

      setFeedback((prev) =>
        prev.map((f) => (f.id === id ? updatedFeedback : f))
      );
    } catch (error) {
      console.error("Error toggling featured state:", error);
      alert("Failed to toggle featured state");
    } finally {
      setIsTogglingFeatured(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/feedback?limit=100");

      if (!response.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const result = await response.json();
      setFeedback(result.data);
    } catch (error) {
      console.error("Error refreshing feedback:", error);
      alert("Failed to refresh feedback");
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFullStar = star <= rating;
          const isHalfStar = star - 0.5 === rating;
          
          return (
            <div key={star} className="relative">
              <Star
                className={`w-4 h-4 ${
                  isFullStar
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-600"
                }`}
              />
              {isHalfStar && (
                <Star
                  className="w-4 h-4 absolute top-0 left-0 fill-yellow-400 text-yellow-400"
                  style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-slate-400">
          💡 Tip: Mark at least 5 feedback as featured to display the carousel on the client site
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="border-slate-600 hover:bg-slate-700"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-sm text-slate-400">Total Feedback</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
        </Card>
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-sm text-slate-400">Average Rating</div>
          <div className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            {stats.averageRating.toFixed(1)}
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          </div>
        </Card>
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-sm text-slate-400">Anonymous</div>
          <div className="text-2xl font-bold text-white mt-1">
            {stats.anonymousCount}
          </div>
        </Card>
        <Card className="p-4 bg-slate-800 border-slate-700">
          <div className="text-sm text-slate-400">5-Star Reviews</div>
          <div className="text-2xl font-bold text-white mt-1">
            {stats.ratingDistribution[5] || 0}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-slate-800 border-slate-700">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Anonymous Filter */}
          <select
            value={filterAnonymous}
            onChange={(e) => setFilterAnonymous(e.target.value as "all" | "named" | "anonymous")}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Feedback</option>
            <option value="named">Named Only</option>
            <option value="anonymous">Anonymous Only</option>
          </select>

          {/* Rating Filter */}
          <select
            value={filterRating}
            onChange={(e) =>
              setFilterRating(e.target.value === "all" ? "all" : parseInt(e.target.value))
            }
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-");
              setSortBy(newSortBy as "createdAt" | "rating");
              setSortOrder(newSortOrder as "asc" | "desc");
            }}
            className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="rating-desc">Highest Rating</option>
            <option value="rating-asc">Lowest Rating</option>
          </select>
        </div>

        <div className="mt-3 text-sm text-slate-400">
          Showing {filteredFeedback.length} of {feedback.length} feedback
        </div>
      </Card>

      {/* Feedback Table */}
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-750">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Rating</TableHead>
                <TableHead className="text-slate-300">Feedback</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFeedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-8">
                    No feedback found
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedback.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`border-slate-700 hover:bg-slate-750 ${
                      item.isDisabled ? "opacity-50" : ""
                    }`}
                  >
                    <TableCell className="text-white">
                      {item.isAnonymous ? (
                        <span className="text-slate-500 italic">Anonymous</span>
                      ) : (
                        item.name || <span className="text-slate-500">No name</span>
                      )}
                    </TableCell>
                    <TableCell>{renderStars(item.rating)}</TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-slate-300 line-clamp-2">{item.feedback}</p>
                    </TableCell>
                    <TableCell>
                      {item.isDisabled ? (
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                          <Ban className="w-3 h-3 mr-1" />
                          Disabled
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-900/30 text-green-400">
                          <Check className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(item.id)}
                          disabled={isTogglingFeatured === item.id}
                          className={`${
                            item.isFeatured
                              ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-950"
                              : "text-slate-400 hover:text-yellow-400 hover:bg-yellow-950"
                          }`}
                          title={item.isFeatured ? "Remove from featured" : "Mark as featured"}
                        >
                          {isTogglingFeatured === item.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Award className={`w-4 h-4 ${item.isFeatured ? "fill-yellow-400" : ""}`} />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleDisabled(item.id)}
                          disabled={isTogglingDisabled === item.id}
                          className={`${
                            item.isDisabled
                              ? "text-green-400 hover:text-green-300 hover:bg-green-950"
                              : "text-orange-400 hover:text-orange-300 hover:bg-orange-950"
                          }`}
                          title={item.isDisabled ? "Enable feedback" : "Disable feedback"}
                        >
                          {isTogglingDisabled === item.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : item.isDisabled ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Ban className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFeedbackToDelete(item);
                            setDeleteDialogOpen(true);
                          }}
                          className="text-red-400 hover:text-red-300 hover:bg-red-950"
                          title="Delete feedback"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete this feedback? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {feedbackToDelete && (
            <div className="py-4">
              <div className="mb-2">
                <strong>From:</strong>{" "}
                {feedbackToDelete.isAnonymous
                  ? "Anonymous"
                  : feedbackToDelete.name || "No name"}
              </div>
              <div className="mb-2">
                <strong>Rating:</strong> {renderStars(feedbackToDelete.rating)}
              </div>
              <div className="text-slate-300 text-sm">
                {feedbackToDelete.feedback}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="border-slate-600 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
