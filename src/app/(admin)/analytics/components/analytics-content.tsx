"use client";

import { useState } from "react";
import { PageView, IgnoredIP } from "@prisma/client";
import {
  Eye,
  Users,
  Trash2,
  Plus,
  Shield,
  Calendar,
  Monitor,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AnalyticsContentProps {
  views: PageView[];
  stats: {
    totalViews: number;
    uniqueVisitors: number;
  };
  ignoredIPs: IgnoredIP[];
}

export function AnalyticsContent({
  views: initialViews,
  stats: initialStats,
  ignoredIPs: initialIgnoredIPs,
}: AnalyticsContentProps) {
  const [views, setViews] = useState(initialViews);
  const [stats, setStats] = useState(initialStats);
  const [ignoredIPs, setIgnoredIPs] = useState(initialIgnoredIPs);
  const [newIP, setNewIP] = useState("");
  const [newIPDescription, setNewIPDescription] = useState("");
  const [isAddingIP, setIsAddingIP] = useState(false);
  const [isAddingMyIP, setIsAddingMyIP] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch("/api/analytics");
      if (response.ok) {
        const data = await response.json();
        setViews(data.views);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      alert("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddMyIP = async () => {
    setIsAddingMyIP(true);
    try {
      // Fetch current IP
      const ipResponse = await fetch("/api/my-ip");
      const { ip } = await ipResponse.json();

      if (!ip || ip === "unknown") {
        alert("Could not determine your IP address");
        return;
      }

      // Find existing view for this IP to update stats before deletion
      const existingView = views.find((v) => v.ip === ip);

      // Add to ignored list
      const response = await fetch("/api/ignored-ips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip,
          description: "My IP (added automatically)",
        }),
      });

      if (response.ok) {
        const ignoredIP = await response.json();
        setIgnoredIPs((prev) => [ignoredIP, ...prev]);
        
        // Remove the view from the list if it exists
        if (existingView) {
          setViews((prev) => prev.filter((v) => v.ip !== ip));
          
          // Update stats
          setStats((prev) => ({
            totalViews: prev.totalViews - existingView.visits,
            uniqueVisitors: prev.uniqueVisitors - 1,
          }));
        }
        
        alert(`Successfully added your IP (${ip}) to the ignored list`);
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add IP");
      }
    } catch (error) {
      console.error("Error adding my IP:", error);
      alert("Failed to add your IP");
    } finally {
      setIsAddingMyIP(false);
    }
  };

  const handleDeleteView = async (id: string) => {
    if (!confirm("Are you sure you want to delete this view record?")) return;

    try {
      const response = await fetch(`/api/analytics?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const deletedView = views.find((v) => v.id === id);
        setViews((prev) => prev.filter((v) => v.id !== id));
        
        // Update stats
        if (deletedView) {
          setStats((prev) => ({
            totalViews: prev.totalViews - deletedView.visits,
            uniqueVisitors: prev.uniqueVisitors - 1,
          }));
        }
      }
    } catch (error) {
      console.error("Error deleting view:", error);
      alert("Failed to delete view");
    }
  };

  const handleAddIgnoredIP = async () => {
    if (!newIP.trim()) return;

    try {
      // Find existing view for this IP to update stats before deletion
      const existingView = views.find((v) => v.ip === newIP.trim());

      const response = await fetch("/api/ignored-ips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ip: newIP.trim(),
          description: newIPDescription.trim() || undefined,
        }),
      });

      if (response.ok) {
        const ignoredIP = await response.json();
        setIgnoredIPs((prev) => [ignoredIP, ...prev]);
        
        // Remove the view from the list if it exists
        if (existingView) {
          setViews((prev) => prev.filter((v) => v.ip !== newIP.trim()));
          
          // Update stats
          setStats((prev) => ({
            totalViews: prev.totalViews - existingView.visits,
            uniqueVisitors: prev.uniqueVisitors - 1,
          }));
        }
        
        setNewIP("");
        setNewIPDescription("");
        setIsAddingIP(false);
      }
    } catch (error) {
      console.error("Error adding ignored IP:", error);
      alert("Failed to add ignored IP");
    }
  };

  const handleRemoveIgnoredIP = async (id: string) => {
    if (!confirm("Are you sure you want to remove this IP from the ignored list?"))
      return;

    try {
      const response = await fetch(`/api/ignored-ips?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setIgnoredIPs((prev) => prev.filter((ip) => ip.id !== id));
      }
    } catch (error) {
      console.error("Error removing ignored IP:", error);
      alert("Failed to remove ignored IP");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <div className="flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={refreshData}
          disabled={isRefreshing}
          className="border-slate-700 text-black hover:border-cyan-500"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Views
            </CardTitle>
            <Eye className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalViews}</div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Unique Visitors
            </CardTitle>
            <Users className="h-5 w-5 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {stats.uniqueVisitors}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ignored IPs Section */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Ignored IP Addresses</CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                These IPs will not be tracked
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddMyIP}
                disabled={isAddingMyIP}
                className="border-slate-700 hover:border-cyan-500"
              >
                <Shield className="h-4 w-4 mr-2" />
                {isAddingMyIP ? "Adding..." : "Add My IP"}
              </Button>
              <Button
                size="sm"
                onClick={() => setIsAddingIP(!isAddingIP)}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add IP
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingIP && (
            <div className="flex gap-2 p-4 bg-slate-900/50 rounded-lg">
              <input
                type="text"
                placeholder="IP Address (e.g., 192.168.1.1)"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newIPDescription}
                onChange={(e) => setNewIPDescription(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <Button size="sm" onClick={handleAddIgnoredIP}>
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAddingIP(false);
                  setNewIP("");
                  setNewIPDescription("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {ignoredIPs.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">
              No ignored IPs
            </p>
          ) : (
            <div className="space-y-2">
              {ignoredIPs.map((ip) => (
                <div
                  key={ip.id}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-white font-mono text-sm">{ip.ip}</p>
                      {ip.description && (
                        <p className="text-slate-400 text-xs">{ip.description}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRemoveIgnoredIP(ip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Views Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">All Visitors</CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            Detailed view of all tracked visitors
          </p>
        </CardHeader>
        <CardContent>
          {views.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No views tracked yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                      IP Address
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                      Visits
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                      First Visit
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">
                      Last Visit
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {views.map((view) => {
                    // Format IP display - show "Localhost" for ::1 or 127.0.0.1
                    const ipDisplay = 
                      view.ip === "::1" || view.ip === "127.0.0.1" 
                        ? "Localhost (::1)" 
                        : view.ip === "unknown"
                        ? "Unknown IP"
                        : view.ip;

                    return (
                      <tr key={view.id} className="border-b border-slate-700/50">
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-white font-mono text-sm">
                                {ipDisplay}
                              </p>
                              {(view.ip === "::1" || view.ip === "127.0.0.1") && (
                                <Badge variant="secondary" className="text-xs">
                                  Local
                                </Badge>
                              )}
                            </div>
                            {view.userAgent && (
                              <div className="flex items-start gap-1 text-slate-400 text-xs">
                                <Monitor className="h-3 w-3 flex-shrink-0 mt-0.5" />
                                <p className="break-all">{view.userAgent}</p>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{view.visits}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {format(new Date(view.firstVisit), "MMM d, yyyy h:mm a")}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {format(new Date(view.lastVisit), "MMM d, yyyy h:mm a")}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteView(view.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
