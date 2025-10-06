import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <section className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-slate-400">
            A showcase of my recent work and technical expertise
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.slice(0, 6).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group border-slate-700 hover:border-cyan-500 text-black"
          >
            <Link href="/projects">
              View All Projects
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/project-detail/${project.slug}`}>
      <Card className="group h-full bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden">
        {/* Project Image */}
        {project.heroImage && (
          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
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
