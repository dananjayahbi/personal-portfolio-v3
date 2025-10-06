import { getAllTechnologies } from "@/services/technology.service";
import { TechnologyManager } from "./components/technology-manager";

export default async function ManageTechnologiesPage() {
  const technologies = await getAllTechnologies();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Technology Stack</p>
        <h1 className="text-3xl font-semibold text-white">Manage Technologies & Skills</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Add and organize your technology skills with icons. Categories: Frontend, Backend, Database, Version Control, Others.
        </p>
      </header>

      <TechnologyManager technologies={technologies} />
    </div>
  );
}
