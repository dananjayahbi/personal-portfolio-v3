import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Sparkles } from "lucide-react";
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
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-900/5 rounded-full blur-[180px] translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 sm:px-8 lg:px-12">
        {/* Back Button */}
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-white/40 hover:text-amber-400/80 transition-colors text-sm font-light tracking-wide mb-12"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        {/* Hero Section */}
        <div className="max-w-4xl mb-16">
          {/* Featured Badge */}
          {project.isFeatured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400/80 text-xs font-light tracking-wide mb-6">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-6 leading-tight">
            {project.title}
          </h1>

          {/* Summary */}
          <p className="text-lg text-white/50 mb-8 max-w-2xl leading-relaxed font-light">
            {project.summary}
          </p>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-white/40 font-light">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400/50" />
              <span>{formatDate(project.createdAt)}</span>
            </div>
            {project.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-400/50" />
                <span>{project.tags.slice(0, 2).join(", ")}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300 text-sm font-light tracking-wide"
              >
                <ExternalLink className="h-4 w-4" />
                Live Demo
              </a>
            )}
            {project.sourceUrl && (
              <a 
                href={project.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 transition-all duration-300 text-sm font-light tracking-wide"
              >
                <Github className="h-4 w-4" />
                Source Code
              </a>
            )}
          </div>
        </div>

        {/* Hero Image */}
        {project.heroImage && (
          <div className="relative aspect-[21/9] w-full overflow-hidden mb-16">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-transparent opacity-40" />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content - Left */}
          <div className="lg:col-span-3 space-y-16">
            {/* Description */}
            {project.description && (
              <div className="p-8 md:p-12 bg-white/[0.02] border border-white/[0.06]">
                <h2 className="text-2xl md:text-3xl font-serif text-white mb-8 flex items-center gap-4">
                  <div className="h-px w-12 bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                  About This Project
                </h2>
                <div
                  className="prose prose-invert prose-lg max-w-none text-white/60 leading-relaxed font-light [&_p]:mb-4 [&_h3]:text-white [&_h3]:font-serif [&_h3]:mb-3 [&_h3]:mt-8 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2 [&_a]:text-amber-400/80 [&_a]:hover:text-amber-400"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>
            )}

            {/* Gallery */}
            <GallerySection images={gallery || []} title={project.title} type="project" />
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-8">
            {/* Technologies */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-light text-white/40 uppercase tracking-[0.2em] mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs text-white/60 bg-white/[0.03] border border-white/[0.08] font-light"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <div className="p-6 bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-sm font-light text-white/40 uppercase tracking-[0.2em] mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-white/40 font-light"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Project Info */}
            <div className="p-6 bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-sm font-light text-white/40 uppercase tracking-[0.2em] mb-4">Project Info</h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-3 border-b border-white/[0.06]">
                  <span className="text-white/40 font-light">Status</span>
                  <span className="text-emerald-400/80 text-xs font-light">{project.status}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/[0.06]">
                  <span className="text-white/40 font-light">Created</span>
                  <span className="text-white/60 font-light">{formatDate(project.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white/40 font-light">Updated</span>
                  <span className="text-white/60 font-light">{formatDate(project.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="mt-24 pt-16 border-t border-white/[0.06]">
          <div className="container mx-auto px-6 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-serif text-white mb-12 text-center">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedProjects.map((relatedProject) => (
                <Link key={relatedProject.id} href={`/project-detail/${relatedProject.slug}`} className="group block">
                  <article className="h-full bg-white/[0.02] border border-white/[0.06] overflow-hidden transition-all duration-500 hover:border-white/20">
                    {relatedProject.heroImage && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={relatedProject.heroImage}
                          alt={relatedProject.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-transparent opacity-60" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-lg font-serif text-white group-hover:text-amber-400/90 transition-colors line-clamp-1 mb-2">
                        {relatedProject.title}
                      </h3>
                      <p className="text-white/40 text-sm font-light line-clamp-2 mb-4">
                        {relatedProject.summary}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {relatedProject.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className="text-xs text-white/30 font-light border-b border-white/10">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
