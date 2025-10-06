import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Calendar, Tag } from "lucide-react";
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
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-8 text-slate-400 hover:text-white">
            <Link href="/experiments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Experiments
            </Link>
          </Button>

          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              {experiment.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-slate-300 mb-8">
              {experiment.summary}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(experiment.createdAt)}
              </div>
              {experiment.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {experiment.tags.join(", ")}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              {experiment.liveUrl && (
                <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                  <a href={experiment.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Live Demo
                  </a>
                </Button>
              )}
              {experiment.sourceUrl && (
                <Button asChild size="lg" variant="outline" className="border-slate-700 hover:border-cyan-500">
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

      {/* Hero Image */}
      {experiment.heroImage && (
        <section className="py-12 bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={experiment.heroImage}
                  alt={experiment.title}
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
              {experiment.description && (
                <div className="prose prose-invert prose-lg max-w-none">
                  <h2 className="text-2xl font-bold text-white mb-4">About This Experiment</h2>
                  <div
                    className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: experiment.description }}
                  />
                </div>
              )}

              {/* Gallery */}
              {gallery && Array.isArray(gallery.images) && gallery.images.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Experiment Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gallery.images.map((image: string, index: number) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-slate-800">
                        <Image
                          src={image}
                          alt={`${experiment.title} screenshot ${index + 1}`}
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
                    {experiment.technologies.map((tech) => (
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
              {experiment.tags.length > 0 && (
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {experiment.tags.map((tag) => (
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

      {/* Related Experiments */}
      {relatedExperiments.length > 0 && (
        <section className="py-20 bg-slate-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Related Experiments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedExperiments.map((relatedExperiment) => (
                <Link key={relatedExperiment.id} href={`/experiment-detail/${relatedExperiment.slug}`}>
                  <Card className="group h-full bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all overflow-hidden">
                    {relatedExperiment.heroImage && (
                      <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                        <Image
                          src={relatedExperiment.heroImage}
                          alt={relatedExperiment.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
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
