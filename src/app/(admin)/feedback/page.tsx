import { feedbackService } from "@/services/feedback.service";
import { FeedbackContent } from "./components/feedback-content";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const { data: feedbackList } = await feedbackService.getFeedback({
    limit: 100,
  });

  const stats = await feedbackService.getFeedbackStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">User Feedback</h1>
        <p className="text-slate-400 mt-2">
          View and manage user feedback and ratings
        </p>
      </div>

      <FeedbackContent initialFeedback={feedbackList} stats={stats} />
    </div>
  );
}
