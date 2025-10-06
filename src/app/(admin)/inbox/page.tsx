import { getAllContactMessages } from "@/services/contact-message.service";
import { InboxContent } from "./components/inbox-content";

export default async function InboxPage() {
  const messages = await getAllContactMessages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Inbox</h1>
        <p className="text-slate-400 mt-2">
          Manage contact form submissions
        </p>
      </div>

      <InboxContent messages={messages} />
    </div>
  );
}
