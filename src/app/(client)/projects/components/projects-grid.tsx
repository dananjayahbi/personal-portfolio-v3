"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
          <p className="text-slate-400 text-lg">No projects found matching your filters.</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-slate-400">
            Showing {filteredProjects.length} of {initialProjects.length} projects
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
      <Card className="group h-full bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden">
        {/* Project Image */}
        {project.heroImage ? (
          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
            {project.isFeatured && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan-500 text-white text-xs font-semibold">
                Featured
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-slate-600 text-4xl font-bold">{project.title.charAt(0)}</div>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mt-[-10px]">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <span className="text-sm text-cyan-400 group-hover:underline">
            View Details
          </span>
          <div className="flex gap-2">
            {project.liveUrl && (
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            )}
            {project.sourceUrl && (
              <Github className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
