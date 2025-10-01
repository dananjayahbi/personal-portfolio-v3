'use client';

import { useActionState, useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { updateProject, type ProjectState } from "../actions";
import { RichTextEditor } from "@/components/common/rich-text-editor";

const HERO_FOLDER = "portfolio/projects/heroes";
const GALLERY_FOLDER = "portfolio/projects/gallery";

const initialUpdateState: ProjectState = { status: "idle" };

type HeroAsset = {
  preview?: string;
  file?: File;
  name?: string;
  fromFile?: boolean;
  existingUrl?: string;
};

type GalleryAsset = {
  id: string;
  preview?: string;
  file?: File;
  name?: string;
  caption?: string;
  fromFile?: boolean;
  existingUrl?: string;
};

type ProjectEditFormProps = {
  project: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    description: string;
    heroImage: string;
    gallery: Array<{ url: string; alt: string | null }>;
    technologies: string[];
    tags: string[];
    liveUrl: string;
    sourceUrl: string;
    status: string;
    isFeatured: boolean;
    featuredOrder: number | null;
    seo: { title: string; description: string };
  };
};

function FieldGroup({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
      <header>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function TextInput({
  label,
  name,
  placeholder,
  error,
  type = "text",
  rows,
  hint,
  defaultValue,
  disabled,
}: {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  type?: string;
  rows?: number;
  hint?: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  const baseClass = clsx(
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-60",
    error && "!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40",
  );

  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      {rows ? (
        <textarea name={name} placeholder={placeholder} className={baseClass} rows={rows} defaultValue={defaultValue} disabled={disabled} />
      ) : (
        <input name={name} placeholder={placeholder} className={baseClass} type={type} defaultValue={defaultValue} disabled={disabled} />
      )}
      {hint && <span className="text-xs text-white/40">{hint}</span>}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  defaultValue,
}: {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
  error?: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className={clsx(
          "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20",
          error && "!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-slate-900">
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SubmitBar({ success, pending }: { success?: string; pending: boolean }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 md:px-6">
      <div className="text-sm text-white/70">{pending ? "Syncing updates…" : success ?? "Your changes go live across the portfolio instantly."}</div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
      >
        {pending ? "Saving…" : "Save project"}
      </button>
    </div>
  );
}

function HeroImageField({
  label,
  hint,
  asset,
  error,
  onSelect,
  onRemove,
}: {
  label: string;
  hint?: string;
  asset?: HeroAsset;
  error?: string;
  onSelect: (file: File) => void;
  onRemove: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      onSelect(file);
      event.target.value = "";
    },
    [onSelect],
  );

  return (
    <div className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <div
        className={clsx(
          "flex flex-col gap-4 rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60 shadow-inner shadow-black/20",
          error && "!border-red-400/70 !bg-red-500/10",
        )}
      >
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        {asset?.preview ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/10 bg-black/30">
              <img src={asset.preview} alt={`${label} preview`} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="truncate text-white/80">{asset.name ?? "Hero image"}</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-white/30 hover:text-white"
                >
                  Replace image
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition hover:border-red-400/60"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-indigo-500/40"
            >
              Select hero image
            </button>
            <p className="text-xs text-white/50">Choose a new visual from your device. Uploads run after you save changes.</p>
          </div>
        )}
      </div>
      {hint && <span className="text-xs text-white/40">{hint}</span>}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}

function GalleryImageField({
  label,
  hint,
  items,
  error,
  onAdd,
  onCaptionChange,
  onRemove,
}: {
  label: string;
  hint?: string;
  items: GalleryAsset[];
  error?: string;
  onAdd: (files: FileList | null) => void;
  onCaptionChange: (id: string, caption: string) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onAdd(event.target.files);
      event.target.value = "";
    },
    [onAdd],
  );

  return (
    <div className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <div
        className={clsx(
          "flex flex-col gap-4 rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60 shadow-inner shadow-black/20",
          error && "!border-red-400/70 !bg-red-500/10",
        )}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="self-start rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-indigo-500/40"
          >
            Add gallery images
          </button>
          <p className="text-xs text-white/50">Select new visuals to queue them for upload when you save.</p>
        </div>

        {items.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="relative h-32 w-full overflow-hidden rounded-md border border-white/10 bg-black/30">
                  {item.preview ? (
                    <img src={item.preview} alt={`${item.name ?? "Gallery item"} preview`} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-white/40">Preview unavailable</div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full border border-white/10 bg-slate-900/60 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-white/50">
                    {item.fromFile ? "New" : "Existing"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="truncate text-xs text-white/60">{item.name ?? "Gallery image"}</span>
                  <label className="flex flex-col gap-2 text-xs text-white/70">
                    <span className="font-medium text-white/80">Caption (optional)</span>
                    <input
                      type="text"
                      value={item.caption ?? ""}
                      onChange={(event) => onCaptionChange(item.id, event.target.value)}
                      placeholder="Describe this shot"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="self-start rounded-full border border-red-400/30 bg-red-500/10 px-4 py-1.5 text-xs font-medium text-red-200 transition hover:border-red-400/60"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {hint && <span className="text-xs text-white/40">{hint}</span>}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}

export function ProjectEditForm({ project }: ProjectEditFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateProject, initialUpdateState);
  const [success, setSuccess] = useState<string | undefined>();
  const [heroAsset, setHeroAsset] = useState<HeroAsset | undefined>(() =>
    project.heroImage ? { preview: project.heroImage, name: "Current hero", existingUrl: project.heroImage } : undefined,
  );
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>(() =>
    project.gallery.map((item) => ({
      id: `${item.url}-${Math.random()}`,
      preview: item.url,
      name: item.url.split("/").pop() ?? "Gallery image",
      caption: item.alt ?? "",
      fromFile: false,
      existingUrl: item.url,
    })),
  );
  const [descriptionValue, setDescriptionValue] = useState(project.description ?? "");
  const [isFeaturedChecked, setIsFeaturedChecked] = useState(Boolean(project.isFeatured));
  const [isSubmitting, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const heroAssetRef = useRef<HeroAsset | undefined>(heroAsset);
  const galleryAssetsRef = useRef<GalleryAsset[]>(galleryAssets);

  useEffect(() => {
    if (state.status === "success") {
      setSuccess(state.message ?? "Project updated successfully.");
      const timeout = setTimeout(() => {
        setSuccess(undefined);
        router.push("/edit-project");
      }, 1500);
      router.refresh();
      return () => clearTimeout(timeout);
    }
    if (state.status === "error") {
      setSuccess(undefined);
    }
  }, [state, router]);

  useEffect(() => {
    heroAssetRef.current = heroAsset;
  }, [heroAsset]);

  useEffect(() => {
    galleryAssetsRef.current = galleryAssets;
  }, [galleryAssets]);

  useEffect(() => {
    return () => {
      const asset = heroAssetRef.current;
      if (asset?.fromFile && asset.preview) {
        URL.revokeObjectURL(asset.preview);
      }
      galleryAssetsRef.current.forEach((item) => {
        if (item.fromFile && item.preview) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  useEffect(() => {
    setHeroAsset(project.heroImage ? { preview: project.heroImage, name: "Current hero", existingUrl: project.heroImage } : undefined);
    setGalleryAssets(
      project.gallery.map((item) => ({
        id: `${item.url}-${Math.random()}`,
        preview: item.url,
        name: item.url.split("/").pop() ?? "Gallery image",
        caption: item.alt ?? "",
        fromFile: false,
        existingUrl: item.url,
      })),
    );
    setDescriptionValue(project.description ?? "");
    setIsFeaturedChecked(Boolean(project.isFeatured));
  }, [project]);

  const handleHeroSelect = useCallback((file: File) => {
    setHeroAsset((current) => {
      if (current?.fromFile && current.preview) {
        URL.revokeObjectURL(current.preview);
      }
      const preview = URL.createObjectURL(file);
      return {
        file,
        preview,
        name: file.name,
        fromFile: true,
      };
    });
  }, []);

  const handleHeroRemove = useCallback(() => {
    setHeroAsset((current) => {
      if (current?.fromFile && current.preview) {
        URL.revokeObjectURL(current.preview);
      }
      return undefined;
    });
  }, []);

  const handleAddGalleryFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const additions: GalleryAsset[] = Array.from(fileList).map((file) => ({
      id: (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      caption: "",
      fromFile: true,
    }));
    setGalleryAssets((current) => [...current, ...additions]);
  }, []);

  const handleGalleryCaptionChange = useCallback((id: string, caption: string) => {
    setGalleryAssets((current) => current.map((item) => (item.id === id ? { ...item, caption } : item)));
  }, []);

  const handleRemoveGalleryItem = useCallback((id: string) => {
    setGalleryAssets((current) => {
      const target = current.find((item) => item.id === id);
      if (target?.fromFile && target.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return current.filter((item) => item.id !== id);
    });
  }, []);

  const handleFeaturedToggle = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsFeaturedChecked(checked);
    if (!checked && formRef.current) {
      const featuredOrderField = formRef.current.elements.namedItem("featuredOrder");
      if (featuredOrderField instanceof HTMLInputElement) {
        featuredOrderField.value = "";
      }
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      formData.set("projectId", project.id);
      formData.set("description", descriptionValue);
      formData.set("heroImageFolder", HERO_FOLDER);
      formData.set("galleryFolder", GALLERY_FOLDER);

      if (heroAsset?.fromFile && heroAsset.file) {
        formData.append("heroImageFile", heroAsset.file, heroAsset.file.name);
        formData.set("heroImage", "");
        formData.delete("removeHeroImage");
      } else if (heroAsset?.existingUrl) {
        formData.set("heroImage", heroAsset.existingUrl);
        formData.delete("removeHeroImage");
      } else {
        formData.set("heroImage", "");
        if (project.heroImage) {
          formData.set("removeHeroImage", "true");
        }
      }

      const existingGalleryEntries = galleryAssets
        .filter((item) => !item.fromFile && item.existingUrl)
        .map((item) => {
          const caption = item.caption?.trim();
          return caption ? `${item.existingUrl} | ${caption}` : item.existingUrl ?? "";
        })
        .filter((entry) => entry);

      formData.delete("existingGalleryEntries");
      existingGalleryEntries.forEach((entry) => {
        formData.append("existingGalleryEntries", entry);
      });

      formData.set("gallery", existingGalleryEntries.join("\n"));

      const newGalleryItems = galleryAssets.filter((item) => item.fromFile && item.file);
      formData.delete("galleryImageFiles");
      formData.delete("galleryImageCaptions");
      newGalleryItems.forEach((item) => {
        if (item.file) {
          formData.append("galleryImageFiles", item.file, item.file.name);
          formData.append("galleryImageCaptions", item.caption ?? "");
        }
      });

      if (!isFeaturedChecked) {
        formData.delete("featuredOrder");
      }

      startTransition(() => {
        formAction(formData);
      });
    },
    [descriptionValue, galleryAssets, heroAsset, isFeaturedChecked, formAction, startTransition, project.id, project.heroImage],
  );

  const heroFieldError = state.fieldErrors?.heroImage;
  const galleryFieldError = state.fieldErrors?.gallery;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
      <input type="hidden" name="heroImageFolder" value={HERO_FOLDER} />
      <input type="hidden" name="galleryFolder" value={GALLERY_FOLDER} />
      <input type="hidden" name="projectId" value={project.id} />

      <FieldGroup title="Project identity" description="Foundational metadata that anchors this case study across the site.">
        <TextInput label="Title" name="title" defaultValue={project.title} error={state.fieldErrors?.title} />
        <TextInput
          label="Summary"
          name="summary"
          rows={3}
          defaultValue={project.summary}
          error={state.fieldErrors?.summary}
        />
        <TextInput
          label="Slug"
          name="slug"
          hint="This maps to the project URL slug, e.g., /projects/aurora"
          defaultValue={project.slug}
          error={state.fieldErrors?.slug}
        />
        <div className="md:col-span-2">
          <HeroImageField
            label="Hero image"
            hint="Replace or remove the hero visual. Uploads happen after you save."
            asset={heroAsset}
            error={heroFieldError}
            onSelect={handleHeroSelect}
            onRemove={handleHeroRemove}
          />
        </div>
        <SelectField
          label="Project status"
          name="status"
          options={[
            { label: "Draft", value: "DRAFT" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Archived", value: "ARCHIVED" },
          ]}
          defaultValue={project.status}
          error={state.fieldErrors?.status}
        />
        <label className="flex items-center gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            name="isFeatured"
            className="h-4 w-4 rounded border-white/20 bg-white/10"
            checked={isFeaturedChecked}
            onChange={handleFeaturedToggle}
          />
          Highlight this project on the homepage hero carousel
        </label>
        <TextInput
          label="Featured order"
          name="featuredOrder"
          defaultValue={project.featuredOrder !== null ? `${project.featuredOrder}` : ""}
          error={state.fieldErrors?.featuredOrder}
          hint="Lower numbers appear first in featured showcases. Enable highlighting to set this value."
          type="number"
          disabled={!isFeaturedChecked}
        />
      </FieldGroup>

      <FieldGroup title="Narrative & stack" description="Craft the story and note the core technologies used.">
        <div className="md:col-span-2">
          <RichTextEditor
            name="description"
            label="Long-form description"
            value={descriptionValue}
            onChange={setDescriptionValue}
            placeholder="Outline the brief, your approach, and the outcomes."
            error={state.fieldErrors?.description}
            hint="Use the toolbar to add emphasis, lists, and structure."
          />
        </div>
        <TextInput
          label="Technologies"
          name="technologies"
          rows={6}
          defaultValue={project.technologies.join("\n")}
          hint="Separate each technology with a new line or comma"
          error={state.fieldErrors?.technologies}
        />
        <TextInput
          label="Tags"
          name="tags"
          rows={4}
          defaultValue={project.tags.join("\n")}
          hint="Separate each tag with a new line or comma"
          error={state.fieldErrors?.tags}
        />
      </FieldGroup>

      <FieldGroup title="Links & gallery" description="Point to live experiences and supporting visuals.">
        <TextInput label="Live URL" name="liveUrl" defaultValue={project.liveUrl} error={state.fieldErrors?.liveUrl} type="url" />
        <TextInput
          label="Source or press URL"
          name="sourceUrl"
          defaultValue={project.sourceUrl}
          error={state.fieldErrors?.sourceUrl}
          type="url"
        />
        <div className="md:col-span-2">
          <GalleryImageField
            label="Gallery"
            hint="Manage supporting visuals. Remove outdated shots or upload fresh work."
            items={galleryAssets}
            error={galleryFieldError}
            onAdd={handleAddGalleryFiles}
            onCaptionChange={handleGalleryCaptionChange}
            onRemove={handleRemoveGalleryItem}
          />
        </div>
      </FieldGroup>

      <FieldGroup title="SEO accents" description="Tailor how this case study surfaces in search and social previews.">
        <TextInput
          label="SEO title"
          name="seoTitle"
          defaultValue={project.seo.title}
          error={state.fieldErrors?.seoTitle}
        />
        <TextInput
          label="SEO description"
          name="seoDescription"
          rows={4}
          defaultValue={project.seo.description}
          error={state.fieldErrors?.seoDescription}
        />
      </FieldGroup>

      {state.status === "error" && state.message && (
        !state.message.includes("highlighted fields") ||
        (state.fieldErrors && Object.keys(state.fieldErrors).length > 0)
      ) && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-6 py-4 text-sm text-red-200">{state.message}</div>
      )}

      <SubmitBar success={success} pending={isSubmitting} />
    </form>
  );
}
