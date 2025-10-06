import { User, Briefcase, GraduationCap, Award } from "lucide-react";

interface AboutSectionProps {
  content?: {
    bio?: string;
    description?: string;
  };
  experiences?: Array<{
    company: string;
    role: string;
    period: string;
    description?: string;
  }>;
}

export function AboutSection({ content, experiences }: AboutSectionProps) {
  const bio = content?.bio || "Passionate software engineer with expertise in building scalable web applications and solving complex technical challenges.";
  const description = content?.description || "I specialize in full-stack development, creating intuitive user interfaces, and architecting robust backend systems. With a strong foundation in modern web technologies and best practices, I deliver high-quality solutions that drive business value.";

  return (
    <section id="about" className="py-20 bg-slate-900/50 scroll-mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            About Me
          </h2>
          <p className="text-lg text-slate-400">
            {bio}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Bio */}
          <div className="space-y-6">
            <div className="p-8 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Background</h3>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">5+</div>
                <div className="text-sm text-slate-400">Years Experience</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
                <div className="text-sm text-slate-400">Projects Completed</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">30+</div>
                <div className="text-sm text-slate-400">Happy Clients</div>
              </div>
              <div className="p-6 rounded-xl bg-slate-800/50 border border-slate-700 text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">100%</div>
                <div className="text-sm text-slate-400">Client Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Column - Experience */}
          <div className="space-y-6">
            <div className="p-8 rounded-xl bg-slate-800/50 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Experience</h3>
              </div>

              {experiences && experiences.length > 0 ? (
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-slate-700">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-500" />
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold text-white">{exp.role}</h4>
                        <p className="text-cyan-400 text-sm">{exp.company}</p>
                        <p className="text-slate-400 text-sm">{exp.period}</p>
                        {exp.description && (
                          <p className="text-slate-300 text-sm mt-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative pl-6 border-l-2 border-slate-700">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-cyan-500" />
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Senior Full Stack Developer</h4>
                      <p className="text-cyan-400 text-sm">Tech Company</p>
                      <p className="text-slate-400 text-sm">2021 - Present</p>
                      <p className="text-slate-300 text-sm mt-2">
                        Leading development of scalable web applications using modern technologies.
                      </p>
                    </div>
                  </div>
                  <div className="relative pl-6 border-l-2 border-slate-700">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-600" />
                    <div className="space-y-1">
                      <h4 className="text-lg font-semibold text-white">Full Stack Developer</h4>
                      <p className="text-cyan-400 text-sm">Software Agency</p>
                      <p className="text-slate-400 text-sm">2019 - 2021</p>
                      <p className="text-slate-300 text-sm mt-2">
                        Built responsive web applications and RESTful APIs.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
