"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

interface ExperimentFiltersProps {
  technologies: string[];
  tags: string[];
  onFilterChange: (filters: { search: string; technologies: string[]; tags: string[] }) => void;
}

export function ExperimentFilters({ technologies, tags, onFilterChange }: ExperimentFiltersProps) {
  const [search, setSearch] = useState("");
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({
      search: value,
      technologies: selectedTechnologies,
      tags: selectedTags,
    });
  };

  const toggleTechnology = (tech: string) => {
    const updated = selectedTechnologies.includes(tech)
      ? selectedTechnologies.filter((t) => t !== tech)
      : [...selectedTechnologies, tech];
    setSelectedTechnologies(updated);
    onFilterChange({
      search,
      technologies: updated,
      tags: selectedTags,
    });
  };

  const toggleTag = (tag: string) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updated);
    onFilterChange({
      search,
      technologies: selectedTechnologies,
      tags: updated,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedTechnologies([]);
    setSelectedTags([]);
    onFilterChange({ search: "", technologies: [], tags: [] });
  };

  const hasActiveFilters = search || selectedTechnologies.length > 0 || selectedTags.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search experiments..."
            className="w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-amber-500/40 transition-colors font-light text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-5 border transition-all duration-300 flex items-center gap-2 text-sm font-light tracking-wide ${
            showFilters 
              ? "bg-white/10 border-white/20 text-white" 
              : "bg-transparent border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 bg-white/[0.02] border border-white/[0.06] space-y-6">
          {/* Technologies */}
          {technologies.length > 0 && (
            <div>
              <h3 className="text-xs font-light text-white/40 uppercase tracking-[0.2em] mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechnology(tech)}
                    className={`px-4 py-2 text-sm font-light transition-all duration-300 ${
                      selectedTechnologies.includes(tech)
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-transparent border border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div>
              <h3 className="text-xs font-light text-white/40 uppercase tracking-[0.2em] mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 text-sm font-light transition-all duration-300 ${
                      selectedTags.includes(tag)
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-transparent border border-white/[0.08] text-white/50 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="pt-4 border-t border-white/[0.06]">
              <button
                onClick={clearFilters}
                className="text-amber-400/70 hover:text-amber-400 text-sm font-light transition-colors flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && !showFilters && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-white/40 font-light uppercase tracking-wide">Active:</span>
          {selectedTechnologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs bg-amber-500/10 text-amber-400/80 border border-amber-500/20 font-light"
            >
              {tech}
            </span>
          ))}
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs bg-amber-500/10 text-amber-400/80 border border-amber-500/20 font-light"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
