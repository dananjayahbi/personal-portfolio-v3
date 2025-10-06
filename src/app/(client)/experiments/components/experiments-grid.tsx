"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Experiment } from "@prisma/client";
import { ExperimentFilters } from "./experiment-filters";

interface ExperimentsGridProps {
  initialExperiments: Experiment[];
  technologies: string[];
  tags: string[];
}

export function ExperimentsGrid({ initialExperiments, technologies, tags }: ExperimentsGridProps) {
  const [filteredExperiments, setFilteredExperiments] = useState(initialExperiments);

  const handleFilterChange = (filters: { search: string; technologies: string[]; tags: string[] }) => {
    let filtered = initialExperiments;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (experiment) =>
          experiment.title.toLowerCase().includes(searchLower) ||
          experiment.summary.toLowerCase().includes(searchLower) ||
          (experiment.description && experiment.description.toLowerCase().includes(searchLower))
      );
    }

    // Technology filter
    if (filters.technologies.length > 0) {
      filtered = filtered.filter((experiment) =>
        filters.technologies.some((tech) => experiment.technologies.includes(tech))
      );
    }

    // Tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((experiment) =>
        filters.tags.some((tag) => experiment.tags.includes(tag))
      );
    }

    setFilteredExperiments(filtered);
  };

  return (
    <div className="space-y-8">
      <ExperimentFilters
        technologies={technologies}
        tags={tags}
        onFilterChange={handleFilterChange}
      />

      {filteredExperiments.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg">No experiments found matching your filters.</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-slate-400">
            Showing {filteredExperiments.length} of {initialExperiments.length} experiments
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiments.map((experiment) => (
              <ExperimentCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <Link href={`/experiment-detail/${experiment.slug}`}>
      <Card className="group h-full bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 overflow-hidden">
        {/* Experiment Image */}
        {experiment.heroImage ? (
          <div className="relative h-48 w-full overflow-hidden bg-slate-900">
            <Image
              src={experiment.heroImage}
              alt={experiment.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
            {experiment.isFeatured && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-cyan-500 text-white text-xs font-semibold">
                Featured
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 w-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-slate-600 text-4xl font-bold">{experiment.title.charAt(0)}</div>
          </div>
        )}

        <CardHeader>
          <CardTitle className="text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {experiment.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mt-[-10px]">
            {experiment.technologies.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                {tech}
              </Badge>
            ))}
            {experiment.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-slate-700/50 text-slate-300">
                +{experiment.technologies.length - 4}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <span className="text-sm text-cyan-400 group-hover:underline">
            View Details
          </span>
          <div className="flex gap-2">
            {experiment.liveUrl && (
              <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            )}
            {experiment.sourceUrl && (
              <Github className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
