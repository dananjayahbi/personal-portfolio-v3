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
    <div className="min-h-screen py-20 md:py-24 relative overflow-hidden">
      {/* Subtle background glow effects */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block text-cyan-400/80 text-xs font-medium tracking-wider uppercase mb-2">
              Lab & Research
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Experiments
            </h1>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
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
