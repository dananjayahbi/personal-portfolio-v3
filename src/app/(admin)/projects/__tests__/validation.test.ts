import { describe, expect, it } from "vitest";
import {
  buildProjectData,
  parseGallery,
  parseList,
  parseMetrics,
  projectFormSchema,
} from "../validation";

describe("project validation helpers", () => {
  it("parses multiline lists into arrays", () => {
    expect(parseList("Design\nStrategy, Motion ")).toEqual(["Design", "Strategy", "Motion"]);
  });

  it("maps gallery entries to structured objects", () => {
    expect(parseGallery("https://cdn.com/hero.jpg | Hero\nhttps://cdn.com/detail.jpg")).toEqual([
      { url: "https://cdn.com/hero.jpg", alt: "Hero" },
      { url: "https://cdn.com/detail.jpg", alt: null },
    ]);
  });

  it("maps metrics entries into label/value pairs", () => {
    expect(parseMetrics("Conversion | +34%\nActivation | 2x")).toEqual([
      { label: "Conversion", metric: "+34%" },
      { label: "Activation", metric: "2x" },
    ]);
  });

  it("builds project payload for prisma", () => {
    const input = projectFormSchema.parse({
      title: "Aurora",
      slug: "aurora",
      summary: "Immersive banking redesign",
      description: "A full case study description that exceeds forty characters.",
      heroImage: "https://cdn.com/hero.jpg",
      gallery: "https://cdn.com/hero.jpg | Hero",
      technologies: "Figma\nReact",
      tags: "Fintech, UX",
      deliverables: "Strategy\nDesign",
      liveUrl: "https://aurora.app",
      sourceUrl: "https://behance.net/aurora",
      status: "PUBLISHED",
      isFeatured: "on",
      featuredOrder: "1",
      startDate: "2024-01-10",
      endDate: "2024-06-15",
      metrics: "Activation | 2x",
      seoTitle: "Aurora case study",
      seoDescription: "Immersive banking redesign",
    });

    const payload = buildProjectData(input);

    expect(payload.title).toBe("Aurora");
    expect(payload.technologies).toEqual(["Figma", "React"]);
    expect(payload.gallery).toHaveLength(1);
    expect(payload.isFeatured).toBe(true);
    expect(payload.featuredOrder).toBe(1);
    expect(payload.startDate).toBeInstanceOf(Date);
    expect(payload.seo).toEqual({
      title: "Aurora case study",
      description: "Immersive banking redesign",
    });
  });
});
