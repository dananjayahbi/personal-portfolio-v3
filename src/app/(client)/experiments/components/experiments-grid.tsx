"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Github, ArrowRight, Beaker } from "lucide-react";
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
    <div className="space-y-10">
      <ExperimentFilters
        technologies={technologies}
        tags={tags}
        onFilterChange={handleFilterChange}
      />

      {filteredExperiments.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-6">
            <Beaker className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/60 text-lg font-serif">No experiments found matching your filters.</p>
          <p className="text-white/40 text-sm mt-2 font-light">Try adjusting your search criteria</p>
        </div>
      ) : (
        <>
          <div className="text-sm text-white/50 font-light">
            Showing <span className="text-amber-400/80">{filteredExperiments.length}</span> of {initialExperiments.length} experiments
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
    <Link href={`/experiment-detail/${experiment.slug}`} className="group block">
      <article className="h-full bg-white/[0.02] border border-white/[0.06] rounded-sm overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]">
        {/* Experiment Image */}
        {experiment.heroImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={experiment.heroImage}
              alt={experiment.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419] via-transparent to-transparent opacity-60" />
            {experiment.isFeatured && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-amber-500/90 text-[#0f1419] text-xs font-medium tracking-wide">
                Featured
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[16/10] w-full bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
            <span className="text-4xl font-serif text-white/20">{experiment.title.charAt(0)}</span>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-serif text-white group-hover:text-amber-400/90 transition-colors duration-300 line-clamp-1">
            {experiment.title}
          </h3>

          {/* Summary */}
          <p className="text-white/50 text-sm font-light line-clamp-2 leading-relaxed">
            {experiment.summary}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 pt-2">
            {experiment.technologies.slice(0, 3).map((tech) => (
              <span 
                key={tech} 
                className="text-xs text-white/40 font-light tracking-wide border-b border-white/10"
              >
                {tech}
              </span>
            ))}
            {experiment.technologies.length > 3 && (
              <span className="text-xs text-white/30 font-light">
                +{experiment.technologies.length - 3} more
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t border-white/[0.06]">
            <span className="text-xs text-white/40 group-hover:text-amber-400/70 transition-colors inline-flex items-center gap-2 tracking-wide uppercase">
              View Experiment
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="flex gap-3">
              {experiment.liveUrl && (
                <ExternalLink className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
              )}
              {experiment.sourceUrl && (
                <Github className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
