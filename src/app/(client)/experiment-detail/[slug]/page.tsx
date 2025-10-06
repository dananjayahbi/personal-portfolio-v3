import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getExperimentBySlug, getRelatedExperiments } from "@/services/experiment.service";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experiment = await getExperimentBySlug(slug);
  
  if (!experiment) {
    return {
      title: "Experiment Not Found",
    };
  }

  const seo = experiment.seo as any;

  return {
    title: seo?.title || experiment.title,
    description: seo?.description || experiment.summary,
    openGraph: {
      title: seo?.title || experiment.title,
      description: seo?.description || experiment.summary,
      images: experiment.heroImage ? [experiment.heroImage] : [],
    },
  };
}

export default async function ExperimentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experiment = await getExperimentBySlug(slug);

  if (!experiment) {
    notFound();
  }

  const relatedExperiments = await getRelatedExperiments(experiment.id, experiment.technologies, 3);
  const gallery = experiment.gallery as any;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        {experiment.heroImage && (
          <div className="absolute inset-0 z-0">
            <Image
              src={experiment.heroImage}
              alt={experiment.title}
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/90 to-slate-950" />
          </div>
        )}

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 text-slate-400 hover:text-white hover:bg-slate-800/50">
            <Link href="/experiments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Experiments
            </Link>
          </Button>

          <div className="max-w-5xl mx-auto text-center">
            {/* Featured Badge */}
            {experiment.isFeatured && (
              <div className="mb-6 flex justify-center">
                <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1.5 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Featured Experiment
                </Badge>
              </div>
            )}

            {/* Title with Gradient */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent leading-tight">
              {experiment.title}
            </h1>

            {/* Summary */}
            <p className="text-xl sm:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              {experiment.summary}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 mb-10">
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <Calendar className="h-4 w-4 text-cyan-400" />
                <span>{formatDate(experiment.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                <Clock className="h-4 w-4 text-cyan-400" />
                <span>Updated {formatDate(experiment.updatedAt)}</span>
              </div>
              {experiment.tags.length > 0 && (
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full">
                  <Tag className="h-4 w-4 text-cyan-400" />
                  <span>{experiment.tags.slice(0, 3).join(" • ")}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              {experiment.liveUrl && (
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/20 px-8">
                  <a href={experiment.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {experiment.sourceUrl && (
                <Button asChild size="lg" variant="outline" className="border-slate-600 hover:border-cyan-400 hover:bg-slate-800/50 text-slate-200 px-8">
                  <a href={experiment.sourceUrl} target="_blank" rel="noopener noreferrer">
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
              {experiment.description && (
                <div className="bg-slate-800/30 rounded-2xl p-8 sm:p-12 border border-slate-700/50 backdrop-blur-sm">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                    About This Experiment
                  </h2>
                  <div
                    className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed [&_p]:mb-4 [&_h3]:text-white [&_h3]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-2"
                    dangerouslySetInnerHTML={{ __html: experiment.description }}
                  />
                </div>
              )}

              {/* Gallery */}
              {gallery && Array.isArray(gallery) && gallery.length > 0 && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
                    Gallery
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {gallery.map((item: any, index: number) => (
                      <div 
                        key={index} 
                        className="group relative aspect-video rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
                      >
                        <Image
                          src={item.url}
                          alt={item.alt || `${experiment.title} screenshot ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-4 left-4 text-white font-medium">
                            {item.alt || `Screenshot ${index + 1}`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    {experiment.technologies.map((tech) => (
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
              {experiment.tags.length > 0 && (
                <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                      Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {experiment.tags.map((tag) => (
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

              {/* Experiment Info */}
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/30 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <div className="h-8 w-1 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                    Experiment Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Status</span>
                    <Badge variant="outline" className="border-green-500/50 text-green-400">
                      {experiment.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                    <span className="text-slate-400">Created</span>
                    <span className="text-slate-200">{formatDate(experiment.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400">Last Updated</span>
                    <span className="text-slate-200">{formatDate(experiment.updatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Experiments */}
      {relatedExperiments.length > 0 && (
        <section className="py-20 bg-slate-900/50 border-t border-slate-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-12 text-center flex items-center justify-center gap-4">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-cyan-500 rounded-full"></div>
              Related Experiments
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-cyan-500 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {relatedExperiments.map((relatedExperiment) => (
                <Link key={relatedExperiment.id} href={`/experiment-detail/${relatedExperiment.slug}`}>
                  <Card className="group h-full bg-slate-800/30 border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all duration-300 overflow-hidden backdrop-blur-sm shadow-lg hover:shadow-cyan-500/20">
                    {relatedExperiment.heroImage && (
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                        <Image
                          src={relatedExperiment.heroImage}
                          alt={relatedExperiment.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {relatedExperiment.title}
                      </CardTitle>
                      <CardDescription className="text-slate-400 line-clamp-2">
                        {relatedExperiment.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {relatedExperiment.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                            {tech}
                          </Badge>
                        ))}
                        {relatedExperiment.technologies.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                            +{relatedExperiment.technologies.length - 3}
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
