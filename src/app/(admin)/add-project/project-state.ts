import type { ProjectFieldErrors } from "@/app/(admin)/projects/validation";

export type ProjectState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ProjectFieldErrors;
};

export const initialProjectState: ProjectState = { status: "idle" };
