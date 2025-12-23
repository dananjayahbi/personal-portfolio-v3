import Image from "next/image";

interface GitHubGraphProps {
  className?: string;
  graphUrl?: string | null;
}

/**
 * GitHubGraph component - displays the GitHub contribution graph.
 * 
 * This is now a client-friendly component that receives the graphUrl as a prop
 * from a server component, avoiding Prisma calls in the browser.
 */
export function GitHubGraph({ className, graphUrl }: GitHubGraphProps) {
  // If no graph URL, show a placeholder message
  if (!graphUrl) {
    return (
      <div className={className}>
        <div className="p-6 sm:p-8 rounded-xl bg-slate-800/50 border border-slate-700">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">
            GitHub Contributions
          </h3>
          <div className="relative w-full h-64 flex items-center justify-center">
            <p className="text-slate-400 text-sm text-center">
              No GitHub contribution graph uploaded yet.<br />
              Upload one from the admin dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <div className="p-6 sm:p-8 rounded-xl bg-slate-800/50 border border-slate-700">
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">
          GitHub Contributions
        </h3>
        <div className="relative w-full h-auto">
          <Image
            src={graphUrl}
            alt="GitHub Contribution Graph"
            className="w-full h-auto rounded-lg"
            priority={false}
            width={1200}
            height={400}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
