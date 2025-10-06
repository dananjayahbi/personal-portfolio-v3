import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBySlug, getRelatedProjects } from "@/services/project.service";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const seo = project.seo as any;

  return {
    title: seo?.title || project.title,
    description: seo?.description || project.summary,
    openGraph: {
      title: seo?.title || project.title,
      description: seo?.description || project.summary,
      images: project.heroImage ? [project.heroImage] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(project.id, project.technologies, 3);
  const gallery = project.gallery as any;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 text-slate-400 hover:text-white">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              {project.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-slate-300 mb-8">
              {project.summary}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(project.createdAt)}
              </div>
              {project.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {project.tags.join(", ")}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              {project.liveUrl && (
                <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {project.sourceUrl && (
                <Button asChild size="lg" variant="outline" className="border-slate-700 hover:border-cyan-500">
                  <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View Source Code
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      {project.heroImage && (
        <section className="py-12 bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={project.heroImage}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              {project.description && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Project</h2>
                  <div
                    className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              )}

              {/* Gallery */}
              {gallery && Array.isArray(gallery.images) && gallery.images.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gallery.images.map((image: string, index: number) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-slate-800">
                        <Image
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Technologies */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Technologies Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {project.tags.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-slate-600 text-slate-400"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedProjects.map((relatedProject) => (
                <Link key={relatedProject.id} href={`/project-detail/${relatedProject.slug}`}>
                  <Card className="group h-full bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all overflow-hidden">
                    {relatedProject.heroImage && (
                      <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                        <Image
                          src={relatedProject.heroImage}
                          alt={relatedProject.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {relatedProject.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 line-clamp-2">
                        {relatedProject.summary}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
