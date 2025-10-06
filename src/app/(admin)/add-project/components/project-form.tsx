'use client';

import { useActionState, useCallback, useEffect, useRef, useState, useTransition } from "react";
import type { ChangeEvent } from "react";
import clsx from "clsx";
import { createProject } from "../actions";
import { initialProjectState } from "../project-state";
import { RichTextEditor } from "@/components/common/rich-text-editor";

type HeroAsset = {
  preview?: string;
  file?: File;
  name?: string;
  fromFile?: boolean;
};

type GalleryAsset = {
  id: string;
  preview?: string;
  file?: File;
  name?: string;
  caption?: string;
  fromFile?: boolean;
};

function FieldGroup({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
      <header>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function TextInput({
  label,
  name,
  placeholder,
  error,
  type = 'text',
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
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-60',
    error && '!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40'
  );

  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      {rows ? (
        <textarea
          name={name}
          placeholder={placeholder}
          className={baseClass}
          rows={rows}
          defaultValue={defaultValue}
          disabled={disabled}
        />
      ) : (
        <input
          name={name}
          placeholder={placeholder}
          className={baseClass}
          type={type}
          defaultValue={defaultValue}
          disabled={disabled}
        />
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
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
          error && '!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40'
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
      <div className="text-sm text-white/70">
        {pending ? 'Publishing your project…' : success ?? 'Your new project will shine on the portfolio once saved.'}
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
      >
        {pending ? 'Saving…' : 'Create project'}
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
      event.target.value = '';
    },
    [onSelect]
  );

  return (
    <div className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <div
        className={clsx(
          'flex flex-col gap-4 rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60 shadow-inner shadow-black/20',
          error && '!border-red-400/70 !bg-red-500/10'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {asset?.preview ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/10 bg-black/40">
              <img src={asset.preview} alt={`${label} preview`} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <span className="truncate text-white/80">{asset.name ?? 'Selected image'}</span>
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
            <p className="text-xs text-white/50">
              Choose an image from your device. It will upload to Cloudinary when you publish the project.
            </p>
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
      event.target.value = '';
    },
    [onAdd]
  );

  return (
    <div className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <div
        className={clsx(
          'flex flex-col gap-4 rounded-xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-white/60 shadow-inner shadow-black/20',
          error && '!border-red-400/70 !bg-red-500/10'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleChange}
        />

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="self-start rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-indigo-500/40"
          >
            Add gallery images
          </button>
          <p className="text-xs text-white/50">
            Pick one or more images. They upload after you submit the project, keeping Cloudinary tidy.
          </p>
        </div>

        {items.length > 0 && (
          <ul className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <li key={item.id} className="flex flex-col gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="relative h-32 w-full overflow-hidden rounded-md border border-white/10 bg-black/30">
                  {item.preview ? (
                    <img src={item.preview} alt={`${item.name ?? 'Gallery item'} preview`} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
                      Preview unavailable
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="truncate text-xs text-white/60">{item.name ?? 'Selected image'}</span>
                  <label className="flex flex-col gap-2 text-xs text-white/70">
                    <span className="font-medium text-white/80">Caption (optional)</span>
                    <input
                      type="text"
                      value={item.caption ?? ''}
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
                    Remove from gallery
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

export function ProjectForm() {
  const [state, formAction] = useActionState(createProject, initialProjectState);
  const [success, setSuccess] = useState<string | undefined>();
  const [heroAsset, setHeroAsset] = useState<HeroAsset | undefined>();
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([]);
  const [isFeaturedChecked, setIsFeaturedChecked] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [isSubmitting, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const heroAssetRef = useRef<HeroAsset | undefined>(undefined);
  const galleryAssetsRef = useRef<GalleryAsset[]>([]);

  const HERO_FOLDER = "portfolio/projects/heroes";
  const GALLERY_FOLDER = "portfolio/projects/gallery";

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      setSuccess(state.message);
      const timeout = setTimeout(() => setSuccess(undefined), 4000);
      formRef.current?.reset();
      setHeroAsset((current) => {
        if (current?.fromFile && current.preview) URL.revokeObjectURL(current.preview);
        return undefined;
      });
      setGalleryAssets((items) => {
        items.forEach((item) => {
          if (item.fromFile && item.preview) URL.revokeObjectURL(item.preview);
        });
        return [];
      });
      setIsFeaturedChecked(false);
      setDescriptionValue("");
      return () => clearTimeout(timeout);
    }
    if (state.status === 'error') {
      setSuccess(undefined);
    }
  }, [state]);

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
      id: (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      caption: '',
      fromFile: true,
    }));
    setGalleryAssets((current) => [...current, ...additions]);
  }, []);

  const handleGalleryCaptionChange = useCallback((id: string, caption: string) => {
    setGalleryAssets((current) =>
      current.map((item) => (item.id === id ? { ...item, caption } : item))
    );
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

  const handleFeaturedToggle = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setIsFeaturedChecked(checked);
      if (!checked && formRef.current) {
        const featuredOrderField = formRef.current.elements.namedItem('featuredOrder');
        if (featuredOrderField instanceof HTMLInputElement) {
          featuredOrderField.value = '';
        }
      }
    },
    [formRef]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

  formData.set('description', descriptionValue);
      formData.set('heroImageFolder', HERO_FOLDER);
      formData.set('galleryFolder', GALLERY_FOLDER);

      if (heroAsset?.file) {
        formData.append('heroImageFile', heroAsset.file, heroAsset.file.name);
      }

      galleryAssets.forEach((item) => {
        if (item.file) {
          formData.append('galleryImageFiles', item.file, item.file.name);
          formData.append('galleryImageCaptions', item.caption ?? '');
        }
      });

      if (!isFeaturedChecked) {
        formData.delete('featuredOrder');
      }

      startTransition(() => {
        formAction(formData);
      });
    },
    [formAction, heroAsset, galleryAssets, HERO_FOLDER, GALLERY_FOLDER, startTransition, isFeaturedChecked, descriptionValue]
  );

  const heroFieldError = state.fieldErrors?.heroImage;
  const galleryFieldError = state.fieldErrors?.gallery;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
      <input type="hidden" name="heroImageFolder" value={HERO_FOLDER} />
      <input type="hidden" name="galleryFolder" value={GALLERY_FOLDER} />
      <FieldGroup
        title="Project identity"
        description="Foundational metadata that anchors this case study across the site."
      >
        <TextInput label="Title" name="title" placeholder="Aurora – Immersive Banking" error={state.fieldErrors?.title} />
        <TextInput
          label="Summary"
          name="summary"
          rows={3}
          placeholder="Transforming a traditional bank into an immersive digital experience."
          error={state.fieldErrors?.summary}
        />
        <TextInput
          label="Slug"
          name="slug"
          hint="This maps to the project URL slug, e.g., /projects/aurora"
          placeholder="aurora-immersive-banking"
          error={state.fieldErrors?.slug}
        />
        <div className="md:col-span-2">
          <HeroImageField
            label="Hero image"
            hint="Upload a cover visual from your device. It will upload to Cloudinary once you save."
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
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Published', value: 'PUBLISHED' },
            { label: 'Archived', value: 'ARCHIVED' },
          ]}
          defaultValue="DRAFT"
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
          placeholder="1"
          error={state.fieldErrors?.featuredOrder}
          hint="Lower numbers appear first in featured showcases. Enable highlighting to set this value."
          type="number"
          disabled={!isFeaturedChecked}
        />
      </FieldGroup>

      <FieldGroup
        title="Narrative & stack"
        description="Craft the story and note the core technologies used."
      >
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
          placeholder="Figma\nFramer\nThree.js"
          hint="Separate each technology with a new line or comma"
          error={state.fieldErrors?.technologies}
        />
        <TextInput
          label="Tags"
          name="tags"
          rows={4}
          placeholder="Fintech, Experience Design, Accessibility"
          hint="Separate each tag with a new line or comma"
          error={state.fieldErrors?.tags}
        />
      </FieldGroup>

      <FieldGroup
        title="Links & gallery"
        description="Point to live experiences and supporting visuals."
      >
        <TextInput
          label="Live URL"
          name="liveUrl"
          placeholder="https://aurora.app"
          error={state.fieldErrors?.liveUrl}
          type="url"
        />
        <TextInput
          label="Source or press URL"
          name="sourceUrl"
          placeholder="https://behance.net/case-study"
          error={state.fieldErrors?.sourceUrl}
          type="url"
        />
        <div className="md:col-span-2">
          <GalleryImageField
            label="Gallery"
            hint="Upload supporting visuals. Add captions to guide the story."
            items={galleryAssets}
            error={galleryFieldError}
            onAdd={handleAddGalleryFiles}
            onCaptionChange={handleGalleryCaptionChange}
            onRemove={handleRemoveGalleryItem}
          />
        </div>
      </FieldGroup>

      <FieldGroup
        title="SEO accents"
        description="Tailor how this case study surfaces in search and social previews."
      >
        <TextInput
          label="SEO title"
          name="seoTitle"
          placeholder="Aurora – Immersive banking experience design"
          error={state.fieldErrors?.seoTitle}
        />
        <TextInput
          label="SEO description"
          name="seoDescription"
          rows={4}
          placeholder="Case study showcasing a next-gen banking platform crafted with storytelling and measurable impact."
          error={state.fieldErrors?.seoDescription}
        />
      </FieldGroup>

      {state.status === 'error' && state.message && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-6 py-4 text-sm text-red-200">
          {state.message}
        </div>
      )}

      <SubmitBar success={success} pending={isSubmitting} />
    </form>
  );
}
