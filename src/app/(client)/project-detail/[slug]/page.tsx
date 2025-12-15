import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a192f]">
      {/* Compact Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        {/* Background Image with Heavy Overlay */}
        {project.heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0a192f]/98 to-[#0a192f]" />
          </div>
        )}
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button asChild variant="ghost" size="sm" className="mb-6 text-slate-400 hover:text-cyan-400 hover:bg-[#0a192f]/50 border border-transparent hover:border-cyan-500/30 transition-all">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>

          <div className="max-w-4xl">
            {/* Featured Badge - Subtle */}
            {project.isFeatured && (
              <Badge className="mb-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}

            {/* Compact Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
              {project.title}
            </h1>

            {/* Summary - Concise */}
            <p className="text-lg text-slate-400 mb-6 max-w-2xl leading-relaxed">
              {project.summary}
            </p>

            {/* Meta & Actions Row */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-cyan-500/70" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
                {project.tags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-4 w-4 text-cyan-500/70" />
                    <span>{project.tags.slice(0, 2).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Inline */}
            <div className="flex flex-wrap gap-3">
              {project.liveUrl && (
                <Button asChild size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white shadow-lg shadow-cyan-500/20">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.sourceUrl && (
                <Button asChild size="sm" variant="outline" className="border-cyan-500/30 hover:border-cyan-400 bg-[#0a192f]/50 backdrop-blur-sm text-slate-300 hover:text-cyan-400">
                  <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    Source Code
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
                <div className="bg-[#0a192f]/80 backdrop-blur-xl rounded-2xl p-8 sm:p-12 border border-cyan-500/20 shadow-xl shadow-cyan-500/5">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
                    About This Project
                  </h2>
                  <div
                    className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed [&_p]:mb-4 [&_h3]:text-white [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2 [&_a]:text-cyan-400 [&_a]:hover:text-cyan-300"
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
              <Card className="bg-[#0a192f]/80 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 shadow-xl shadow-cyan-500/5">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <div className="h-8 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                    Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        className="bg-[#0a192f] text-slate-200 hover:bg-cyan-500/20 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/50 transition-all cursor-default"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              {project.tags.length > 0 && (
                <Card className="bg-[#0a192f]/80 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 shadow-xl shadow-cyan-500/5">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-cyan-500/30 text-slate-400 hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-default"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Project Info */}
              <Card className="bg-[#0a192f]/80 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 shadow-xl shadow-cyan-500/5">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <div className="h-8 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                    Project Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-cyan-500/20">
                    <span className="text-slate-400">Status</span>
                    <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-cyan-500/20">
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
        <section className="py-20 bg-[#0a192f]/50 border-t border-cyan-500/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-12 text-center flex items-center justify-center gap-4">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-cyan-400 rounded-full"></div>
              Related Projects
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-cyan-400 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {relatedProjects.map((relatedProject) => (
                <Link key={relatedProject.id} href={`/project-detail/${relatedProject.slug}`}>
                  <Card className="group h-full bg-[#0a192f]/80 backdrop-blur-xl border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden shadow-xl shadow-cyan-500/5 hover:shadow-cyan-500/20 hover:scale-[1.02]">
                    {relatedProject.heroImage && (
                      <div className="relative h-48 w-full overflow-hidden bg-[#0a192f]">
                        <Image
                          src={relatedProject.heroImage}
                          alt={relatedProject.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
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
                          <Badge key={tech} variant="secondary" className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            {tech}
                          </Badge>
                        ))}
                        {relatedProject.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
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
