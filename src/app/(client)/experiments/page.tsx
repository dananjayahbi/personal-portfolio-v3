import { ExperimentsGrid } from "./components/experiments-grid";
import { getPublishedExperiments, getAllTechnologies, getAllTags } from "@/services/experiment.service";

export const revalidate = 60;

export default async function ClientExperimentsPage() {
  const [experiments, technologies, tags] = await Promise.all([
    getPublishedExperiments(),
    getAllTechnologies(),
    getAllTags(),
  ]);

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[200px] -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-900/5 rounded-full blur-[180px] translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header - Premium Typography */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <div>
            <span className="inline-block text-white/40 text-xs font-light tracking-[0.3em] uppercase mb-4">
              Lab & Research
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-medium text-white mb-4">
              Experiments
            </h1>
          </div>
          <p className="text-white/50 text-base font-light max-w-md">
            Experimental projects, prototypes, and creative explorations.
          </p>
        </div>

        <ExperimentsGrid
          initialExperiments={experiments}
          technologies={technologies}
          tags={tags}
        />
      </div>
    </div>
  );
}
