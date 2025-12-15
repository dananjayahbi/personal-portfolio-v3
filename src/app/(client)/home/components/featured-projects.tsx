import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Github, Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div className="max-w-xl">
            <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
              My Work
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-slate-400 text-lg">
              A selection of projects that showcase my expertise
            </p>
          </div>
          <Button
            asChild
            className="bg-transparent border border-slate-600 hover:border-cyan-400/50 hover:bg-cyan-400/5 text-slate-300 hover:text-cyan-400 px-6 py-5 rounded-full text-sm font-medium transition-all duration-300 w-fit"
          >
            <Link href="/projects" className="inline-flex items-center gap-2">
              View all projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      href={`/project-detail/${project.slug}`}
      className="group block"
    >
      <article className="h-full rounded-2xl overflow-hidden bg-slate-800/20 border border-slate-700/30 hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10">
        {/* Project Image */}
        {project.heroImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full bg-slate-800/50 flex items-center justify-center">
            <Folder className="w-12 h-12 text-slate-600" />
          </div>
        )}

        {/* Project Info */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1">
            {project.title}
          </h3>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge 
                key={tech} 
                className="text-xs bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 font-normal"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge 
                className="text-xs bg-slate-700/50 text-slate-400 hover:bg-slate-700 border border-slate-600/50 font-normal"
              >
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-slate-500 group-hover:text-cyan-400 transition-colors inline-flex items-center gap-2">
              View details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <ExternalLink className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              )}
              {project.sourceUrl && (
                <Github className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
