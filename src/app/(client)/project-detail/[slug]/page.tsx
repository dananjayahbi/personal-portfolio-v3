import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectBySlug, getRelatedProjects } from "@/services/project.service";
import { formatDate } from "@/lib/utils";
import { GallerySection } from "../components/gallery-section";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  
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

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(project.id, project.technologies, 3);
  const gallery = project.gallery as any;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        {project.heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover opacity-80"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
          </div>
        )}

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 mt-[-120px]">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 text-slate-400 hover:text-white hover:bg-slate-800/50">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <div className="max-w-5xl mx-auto text-center">
            {/* Featured Badge */}
            {project.isFeatured && (
              <div className="mb-6 flex justify-center">
                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1.5 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Featured Project
                </Badge>
              </div>
            )}

            {/* Title with Gradient */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent leading-tight">
              {project.title}
            </h1>

            {/* Summary */}
            <p className="text-xl sm:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              {project.summary}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 mb-10">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>Updated {formatDate(project.updatedAt)}</span>
              </div>
              {project.tags.length > 0 && (
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                  <Tag className="h-4 w-4 text-cyan-400" />
                  <span>{project.tags.slice(0, 3).join(" • ")}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-[-100px]">
              {project.liveUrl && (
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20 px-8">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {project.sourceUrl && (
                <Button asChild size="lg" variant="outline" className="border-slate-600 hover:border-cyan-400 hover:bg-slate-800/50 text-slate-800 hover:text-slate-200 px-8">
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

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content - Left */}
            <div className="lg:col-span-3 space-y-16">
              {/* Description */}
              {project.description && (
                <div className="bg-slate-800/30 rounded-2xl p-8 sm:p-12 border border-slate-700/50 backdrop-blur-sm">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                    About This Project
                  </h2>
                  <div
                    className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed [&_p]:mb-4 [&_h3]:text-white [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              )}

              {/* Gallery */}
              <GallerySection images={gallery || []} title={project.title} type="project" />
            </div>

            {/* Sidebar - Right */}
            <div className="space-y-6">
              {/* Technologies */}
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                    Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        className="bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-cyan-300 border border-slate-600 hover:border-cyan-500/50 transition-all cursor-default"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {project.tags.length > 0 && (
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-slate-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-default"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Info */}
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                    Project Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Status</span>
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Created</span>
                    <span className="text-slate-200">{formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Last Updated</span>
                    <span className="text-slate-200">{formatDate(project.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-slate-900/50 border-t border-slate-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-12 text-center flex items-center justify-center gap-4">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-cyan-500 rounded-full"></div>
              Related Projects
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-cyan-500 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {relatedProjects.map((relatedProject) => (
                <Link key={relatedProject.id} href={`/project-detail/${relatedProject.slug}`}>
                  <Card className="group h-full bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20">
                    {relatedProject.heroImage && (
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                        <Image
                          src={relatedProject.heroImage}
                          alt={relatedProject.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
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
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {relatedProject.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                            {tech}
                          </Badge>
                        ))}
                        {relatedProject.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                            +{relatedProject.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
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
