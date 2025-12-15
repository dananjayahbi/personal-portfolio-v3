"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, ArrowRight, Folder } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@prisma/client";
import { ProjectFilters } from "./project-filters";

interface ProjectsGridProps {
  initialProjects: Project[];
  technologies: string[];
  tags: string[];
}

export function ProjectsGrid({ initialProjects, technologies, tags }: ProjectsGridProps) {
  const [filteredProjects, setFilteredProjects] = useState(initialProjects);

  const handleFilterChange = (filters: { search: string; technologies: string[]; tags: string[] }) => {
    let filtered = initialProjects;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchLower) ||
          project.summary.toLowerCase().includes(searchLower) ||
          (project.description && project.description.toLowerCase().includes(searchLower))
      );
    }

    // Technology filter
    if (filters.technologies.length > 0) {
      filtered = filtered.filter((project) =>
        filters.technologies.some((tech) => project.technologies.includes(tech))
      );
    }

    // Tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((project) =>
        filters.tags.some((tag) => project.tags.includes(tag))
      );
    }

    setFilteredProjects(filtered);
  };

  return (
    <div className="space-y-8">
      <ProjectFilters
        technologies={technologies}
        tags={tags}
        onFilterChange={handleFilterChange}
      />

      {filteredProjects.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-4">
            <Folder className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 text-lg">No projects found matching your filters.</p>
          <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-slate-400 bg-slate-800/30 inline-block px-4 py-2 rounded-full border border-slate-700/50">
            Showing <span className="text-cyan-400 font-medium">{filteredProjects.length}</span> of {initialProjects.length} projects
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/project-detail/${project.slug}`}>
      <Card className="group h-full bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/10 overflow-hidden rounded-2xl hover:transform hover:scale-[1.02]">
        {/* Project Image */}
        {project.heroImage ? (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent opacity-80" />
            {project.isFeatured && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25">
                ✨ Featured
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-cyan-400">{project.title.charAt(0)}</span>
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          <CardTitle className="text-white group-hover:text-cyan-400 transition-colors duration-300 line-clamp-1 text-lg">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-normal">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge className="text-xs bg-slate-700/50 text-slate-400 border border-slate-600/30 font-normal">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4 border-t border-slate-700/30">
          <span className="text-sm text-slate-500 group-hover:text-cyan-400 transition-colors inline-flex items-center gap-2">
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="flex gap-2">
            {project.liveUrl && (
              <div className="w-8 h-8 rounded-lg bg-slate-700/30 group-hover:bg-cyan-400/10 flex items-center justify-center transition-colors">
                <ExternalLink className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            )}
            {project.sourceUrl && (
              <div className="w-8 h-8 rounded-lg bg-slate-700/30 group-hover:bg-cyan-400/10 flex items-center justify-center transition-colors">
                <Github className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
