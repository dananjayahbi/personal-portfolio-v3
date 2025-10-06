import { ProjectForm } from "./components/project-form";

export default function AddProjectPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">New case study</p>
        <h1 className="text-3xl font-semibold text-white">Launch a flagship project</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Document the vision, craft, and measurable outcomes. Rich storytelling helps clients understand your value at a glance.
        </p>
      </header>

      <ProjectForm />
    </div>
  );
}