import { getAllTechnologies } from "@/services/technology.service";
import Image from "next/image";

const CATEGORY_COLORS = {
  Frontend: "from-cyan-500 to-blue-500",
  Backend: "from-purple-500 to-indigo-500",
  Database: "from-green-500 to-emerald-500",
  "Version Control": "from-orange-500 to-red-500",
  Others: "from-pink-500 to-rose-500",
};

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
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">⚡</span>
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Skills & Technologies
                </span>
              </h2>
            </div>
            <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full"></div>
          </div>
        </div>

        {/* Technologies Grid */}
        <div className="space-y-12">
          {Object.entries(groupedTechnologies).map(([category, techs]) => (
            <div key={category} className="space-y-6">
              {/* Category Title */}
              <div className="flex items-center gap-3">
                <div className={`h-1 w-12 bg-gradient-to-r ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || 'from-gray-500 to-gray-600'} rounded-full`}></div>
                <h3 className="text-2xl font-semibold text-white/90">
                  {category}
                </h3>
              </div>

              {/* Technology Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {techs.map((tech) => (
                  <div
                    key={tech.id}
                    className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all hover:border-white/20 hover:bg-white/10 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
                  >
                    {/* Technology Icon */}
                    {tech.icon && (
                      <div className="relative h-16 w-16 mx-auto mb-4 transition-transform group-hover:scale-110">
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Technology Name */}
                    <p className="text-center text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                      {tech.name}
                    </p>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || 'from-gray-500 to-gray-600'} opacity-0 group-hover:opacity-10 transition-opacity -z-10`}></div>
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
