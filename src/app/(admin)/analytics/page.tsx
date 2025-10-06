import {
  getAllPageViews,
  getTotalViews,
  getUniqueVisitorsCount,
  getAllIgnoredIPs,
} from "@/services/analytics.service";
import { AnalyticsContent } from "./components/analytics-content";

export default async function AnalyticsPage() {
  const [views, totalViews, uniqueVisitors, ignoredIPs] = await Promise.all([
    getAllPageViews(),
    getTotalViews(),
    getUniqueVisitorsCount(),
    getAllIgnoredIPs(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-2">
          Track portfolio views and manage ignored IPs
        </p>
      </div>

      <AnalyticsContent
        views={views}
        stats={{ totalViews, uniqueVisitors }}
        ignoredIPs={ignoredIPs}
      />
    </div>
  );
}
