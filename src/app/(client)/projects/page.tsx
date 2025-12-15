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
    <div className="min-h-screen py-24 md:py-32 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
            My Portfolio
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-200 bg-clip-text text-transparent">
              My Projects
            </span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Explore my portfolio of web applications, tools, and experiments showcasing various technologies and approaches.
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
