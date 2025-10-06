import { Code2, Database, Cloud, Cpu, Palette, Zap } from "lucide-react";

interface SkillsSectionProps {
  skills?: string[];
}

const defaultSkillCategories = [
  {
    name: "Frontend",
    icon: Palette,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
  },
  {
    name: "Backend",
    icon: Database,
    skills: ["Node.js", "Express", "Python", "FastAPI", "REST APIs"],
  },
  {
    name: "Database",
    icon: Database,
    skills: ["MongoDB", "PostgreSQL", "Prisma", "Redis", "MySQL"],
  },
  {
    name: "DevOps & Cloud",
    icon: Cloud,
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Vercel"],
  },
  {
    name: "Tools & Others",
    icon: Zap,
    skills: ["Git", "VS Code", "Figma", "Postman", "Linux"],
  },
];

export function SkillsSection({ skills }: SkillsSectionProps) {
  // If custom skills are provided, use them; otherwise use default categories
  const displaySkills = skills && skills.length > 0 ? skills : null;

  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-slate-400">
            Tools and technologies I work with to bring ideas to life
          </p>
        </div>

        {/* Skills Grid */}
        {displaySkills ? (
          // Custom skills list
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3">
              {displaySkills.map((skill) => (
                <div
                  key={skill}
                  className="px-6 py-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
                >
                  <span className="text-slate-300 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Default categorized skills
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {defaultSkillCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.name}
                  className="group p-6 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm rounded-md bg-slate-700/50 text-slate-300 border border-slate-600 group-hover:border-cyan-500/30 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
