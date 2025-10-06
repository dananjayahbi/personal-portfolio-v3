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
    <div className="min-h-screen bg-slate-950 py-15">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            My Experiments
          </h1>
          <p className="text-lg text-slate-400">
            Explore my portfolio of web applications, tools, and experiments showcasing various technologies and approaches.
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
