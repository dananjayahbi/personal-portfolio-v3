'use client';

import { useState, useRef } from "react";
import { Technology } from "@prisma/client";
import { Plus, Edit, Trash2, Save, X, Upload } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["Frontend", "Backend", "Database", "Version Control", "Others"];

interface TechnologyManagerProps {
  technologies: Technology[];
}

export function TechnologyManager({ technologies: initialTechnologies }: TechnologyManagerProps) {
  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    category: "Frontend",
    order: 0,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, id?: string) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const form = e.currentTarget;
      const formDataToSend = new FormData(form);
      
      let iconUrl = formDataToSend.get('icon') as string || "";

      // Upload file if selected
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        uploadFormData.append('folder', 'portfolio/technologies');

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadResult = await uploadResponse.json();
        iconUrl = uploadResult.url;

        // Delete old image if updating
        if (id && formData.icon && formData.icon !== iconUrl) {
          const publicIdMatch = formData.icon.match(/\/portfolio\/technologies\/([^/.]+)/);
          if (publicIdMatch) {
            const publicId = `portfolio/technologies/${publicIdMatch[1]}`;
            await fetch('/api/cloudinary-destroy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ publicId, invalidate: true }),
            }).catch(err => console.warn('Failed to delete old image:', err));
          }
        }
      }
      
      const data = {
        name: formDataToSend.get('name') as string,
        icon: iconUrl,
        category: formDataToSend.get('category') as string,
        order: parseInt(formDataToSend.get('order') as string) || 0,
      };

      const url = id ? `/api/technologies/${id}` : '/api/technologies';
      const method = id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        const result = await response.json();
        if (id) {
          setTechnologies(technologies.map(t => t.id === id ? result : t));
          setEditingId(null);
        } else {
          setTechnologies([...technologies, result]);
          setIsAdding(false);
        }
        setFormData({ name: "", icon: "", category: "Frontend", order: 0 });
        setSelectedFile(null);
        setPreviewUrl(null);
      }
    } catch (error) {
      console.error('Failed to save technology:', error);
      alert('Failed to save technology. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this technology?')) return;
    
    try {
      // Find the technology to get its icon URL
      const tech = technologies.find(t => t.id === id);
      
      // Delete the technology from database
      const response = await fetch(`/api/technologies/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Delete image from Cloudinary if it exists
        if (tech?.icon) {
          const publicIdMatch = tech.icon.match(/\/portfolio\/technologies\/([^/.]+)/);
          if (publicIdMatch) {
            const publicId = `portfolio/technologies/${publicIdMatch[1]}`;
            await fetch('/api/cloudinary-destroy', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ publicId, invalidate: true }),
            }).catch(err => console.warn('Failed to delete image from Cloudinary:', err));
          }
        }
        
        setTechnologies(technologies.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete technology:', error);
    }
  };

  const startEdit = (tech: Technology) => {
    setEditingId(tech.id);
    setFormData({
      name: tech.name,
      icon: tech.icon || "",
      category: tech.category,
      order: tech.order,
    });
    setSelectedFile(null);
    setPreviewUrl(tech.icon || null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ name: "", icon: "", category: "Frontend", order: 0 });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const groupedTechnologies = technologies.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<string, Technology[]>);

  return (
    <div className="space-y-8">
      {/* Add New Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-cyan-500/50 transition"
        >
          <Plus className="h-5 w-5" />
          Add Technology
        </button>
      )}

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={(e) => handleSubmit(e)} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Add New Technology</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Technology Name"
              defaultValue={formData.name}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
            <select
              name="category"
              defaultValue={formData.category}
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
            <input
              type="number"
              name="order"
              placeholder="Display Order"
              defaultValue={formData.order}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Icon/Image
              </label>
              <input
                type="hidden"
                name="icon"
                value={formData.icon}
              />
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                {(previewUrl || formData.icon) && (
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative h-16 w-16 rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                      <Image
                        src={previewUrl || formData.icon}
                        alt="Preview"
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    {selectedFile && (
                      <span className="text-xs text-white/60">{selectedFile.name}</span>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-white/60
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-cyan-500 file:text-white
                    hover:file:bg-cyan-600
                    file:cursor-pointer cursor-pointer"
                />
                <p className="mt-2 text-xs text-white/40">
                  Image will upload when you click Save
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm text-white hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isUploading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={isUploading}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Technologies by Category */}
      {CATEGORIES.map(category => {
        const techs = groupedTechnologies[category] || [];
        if (techs.length === 0 && !isAdding) return null;

        return (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-cyan-400">⚡</span>
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {techs.map(tech => (
                <div key={tech.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  {editingId === tech.id ? (
                    <form onSubmit={(e) => handleSubmit(e, tech.id)} className="space-y-3">
                      <input
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        required
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      />
                      <select
                        name="category"
                        defaultValue={formData.category}
                        required
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="order"
                        placeholder="Display Order"
                        defaultValue={formData.order}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                      />
                      <div>
                        <input
                          type="hidden"
                          name="icon"
                          value={formData.icon}
                        />
                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                          {(previewUrl || formData.icon) && (
                            <div className="mb-2 flex items-center gap-2">
                              <div className="relative h-12 w-12 rounded border border-white/10 bg-white/5">
                                <Image
                                  src={previewUrl || formData.icon}
                                  alt="Preview"
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                              {selectedFile && (
                                <span className="text-xs text-white/60">{selectedFile.name}</span>
                              )}
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                            className="block w-full text-xs text-white/60
                              file:mr-2 file:py-1 file:px-3
                              file:rounded file:border-0
                              file:text-xs file:font-semibold
                              file:bg-cyan-500 file:text-white
                              hover:file:bg-cyan-600
                              file:cursor-pointer cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isUploading}
                          className="flex-1 rounded-lg bg-cyan-500 px-3 py-2 text-xs text-white disabled:opacity-50"
                        >
                          {isUploading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={isUploading}
                          className="flex-1 rounded-lg bg-slate-700 px-3 py-2 text-xs text-white disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {tech.icon && (
                          <div className="relative h-10 w-10">
                            <Image
                              src={tech.icon}
                              alt={tech.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div>
                          <span className="text-white font-medium block">{tech.name}</span>
                          <span className="text-xs text-white/50">Order: {tech.order}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(tech)}
                          className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tech.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
