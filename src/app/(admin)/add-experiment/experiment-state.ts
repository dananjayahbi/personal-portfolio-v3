import type { ExperimentFieldErrors } from "@/app/(admin)/experiments/validation";

export type ExperimentState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: ExperimentFieldErrors;
};

export const initialExperimentState: ExperimentState = { status: "idle" };
