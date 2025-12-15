import { ProjectsGrid } from "./components/projects-grid";
import { getPublishedProjects, getAllTechnologies, getAllTags } from "@/services/project.service";

export const revalidate = 60;

export default async function ClientProjectsPage() {
  const [projects, technologies, tags] = await Promise.all([
    getPublishedProjects(),
    getAllTechnologies(),
    getAllTags(),
  ]);

  return (
    <div className="min-h-screen py-20 md:py-24 relative overflow-hidden">
      {/* Subtle background glow effects */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/3 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-cyan-400/80 text-xs font-medium tracking-wider uppercase mb-2">
              Portfolio
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Projects
            </h1>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Web applications, tools, and experiments showcasing various technologies.
          </p>
        </div>

        <ProjectsGrid
          initialProjects={projects}
          technologies={technologies}
          tags={tags}
        />
      </div>
    </div>
  );
}
