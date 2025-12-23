"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Github, Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "@prisma/client";
import { AnimateOnScroll } from "@/components/common/animate-on-scroll";

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Floating geometric decorations */}
      <div className="absolute left-1/4 top-32 w-20 h-20 border-2 border-amber-400/20 rotate-45 pointer-events-none animate-float" />
      <div className="absolute right-1/3 bottom-40 w-16 h-16 border-2 border-blue-400/15 rounded-full pointer-events-none animate-float-reverse" />
      <div className="absolute left-10 bottom-1/3 w-12 h-12 border border-white/10 rounded-full pointer-events-none animate-float-subtle" />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <AnimateOnScroll animation="fade-up" duration={800}>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 mb-20">
            <div className="max-w-xl">
              <span className="inline-block text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-6">
                My Work
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-6">
                Featured Projects
              </h2>
              <p className="text-white/50 text-lg font-light">
                A selection of projects that showcase my expertise
              </p>
            </div>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-full text-white/60 hover:text-white hover:border-white/40 transition-all duration-300 text-sm tracking-wide font-light w-fit"
            >
              View all projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.slice(0, 6).map((project, index) => (
            <AnimateOnScroll key={project.id} animation="fade-up" delay={index * 100} duration={700}>
              <ProjectCard project={project} />
            </AnimateOnScroll>
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
      <article className="h-full rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:scale-[1.02]">
        {/* Project Image */}
        {project.heroImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-transparent" />
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full bg-white/5 flex items-center justify-center">
            <Folder className="w-12 h-12 text-white/20" />
          </div>
        )}

        {/* Project Info */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-medium text-white group-hover:text-white/80 transition-colors duration-300 line-clamp-1 tracking-wide">
            {project.title}
          </h3>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge 
                key={tech} 
                className="text-xs bg-white/5 text-white/50 hover:bg-white/10 border border-white/10 font-light"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge 
                className="text-xs bg-white/5 text-white/40 hover:bg-white/10 border border-white/10 font-light"
              >
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          {/* Links */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors inline-flex items-center gap-2 font-light">
              View details
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="flex items-center gap-2">
              {project.liveUrl && (
                <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-white/50 transition-colors" />
              )}
              {project.sourceUrl && (
                <Github className="h-4 w-4 text-white/30 group-hover:text-white/50 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
