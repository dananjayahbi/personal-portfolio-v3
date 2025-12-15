import { getAllTechnologies } from "@/services/technology.service";
import Image from "next/image";

export async function SkillsSection() {
  const technologies = await getAllTechnologies();

  if (!technologies || technologies.length === 0) return null;

  // Group technologies by category
  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, typeof technologies>);

  // Sort technologies within each category by order
  Object.keys(groupedTechnologies).forEach(category => {
    groupedTechnologies[category].sort((a, b) => a.order - b.order);
  });

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium tracking-wider uppercase mb-4">
            My Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Skills & Technologies
          </h2>
          <p className="text-slate-400 text-lg">
            Tools and technologies I use to bring ideas to life
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="space-y-16">
          {Object.entries(groupedTechnologies).map(([category, techs]) => (
            <div key={category}>
              {/* Category Title */}
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-lg font-semibold text-white">
                  {category}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/50 to-transparent" />
              </div>

              {/* Technology Items */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-6">
                {techs.map((tech) => (
                  <div
                    key={tech.id}
                    className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-800/20 border border-slate-700/30 hover:border-cyan-500/50 hover:bg-slate-800/40 transition-all duration-300"
                  >
                    {/* Technology Icon */}
                    {tech.icon && (
                      <div className="relative h-10 w-10 md:h-12 md:w-12 grayscale group-hover:grayscale-0 transition-all duration-300">
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Technology Name */}
                    <span className="text-xs text-slate-500 group-hover:text-cyan-400 text-center transition-colors duration-300">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
