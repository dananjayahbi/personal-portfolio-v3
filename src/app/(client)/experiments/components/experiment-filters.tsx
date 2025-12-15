"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search experiments..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#0a192f]/80 backdrop-blur-xl border border-cyan-500/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all shadow-xl shadow-cyan-500/5"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="border-cyan-500/30 hover:border-cyan-400 bg-[#0a192f]/80 backdrop-blur-xl text-slate-200 hover:text-cyan-400 h-[50px] transition-all"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-6 rounded-xl bg-[#0a192f]/80 backdrop-blur-xl border border-cyan-500/20 space-y-6 shadow-xl shadow-cyan-500/5">
          {/* Technologies */}
          {technologies.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechnology(tech)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTechnologies.includes(tech)
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-[#0a192f] border border-cyan-500/30 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
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
              <h3 className="text-sm font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-[#0a192f] border border-cyan-500/30 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
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
            <div className="pt-4 border-t border-cyan-500/20">
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-400">Active filters:</span>
          {selectedTechnologies.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
            >
              {tech}
            </span>
          ))}
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
