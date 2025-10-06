import Image from "next/image";
import githubGraphImage from "@/assets/github-status/graph.png";

export function GitHubGraph({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="p-6 sm:p-8 rounded-xl bg-slate-800/50 border border-slate-700">
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-center">
          GitHub Contributions
        </h3>
        <div className="relative w-full h-auto">
          <Image
            src={githubGraphImage}
            alt="GitHub Contribution Graph"
            className="w-full h-auto rounded-lg"
            priority={false}
          />
        </div>
      </div>
    </div>
  );
}
