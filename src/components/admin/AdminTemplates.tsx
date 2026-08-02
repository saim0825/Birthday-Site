import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { ThemeTemplateItem } from "../../types/cms";
import {
  Palette,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Sparkles,
  Check,
  X,
  Search,
  Tag,
} from "lucide-react";

export const AdminTemplates: React.FC = () => {
  const {
    templates,
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    reorderTemplates,
    images,
  } = useCMS();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingTemplate, setEditingTemplate] = useState<ThemeTemplateItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ["All", "Interactive", "Luxury", "Floral", "Cyberpunk", "Classic"];

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingTemplate({
      id: `template-${Date.now()}`,
      name: "",
      thumbnailUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
      category: "Interactive",
      description: "",
      priceType: "free",
      buttonText: "Use Template",
      buttonLink: "/creator",
      tags: ["Birthday", "Interactive"],
      status: "published",
      orderIndex: templates.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: ThemeTemplateItem) => {
    setEditingTemplate({ ...t });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTemplate) {
      await saveTemplate(editingTemplate);
      setIsModalOpen(false);
      setEditingTemplate(null);
    }
  };

  const handleToggleStatus = async (t: ThemeTemplateItem) => {
    const nextStatus = t.status === "published" ? "hidden" : "published";
    await saveTemplate({ ...t, status: nextStatus });
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newArr = [...templates];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    await reorderTemplates(newArr);
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Theme Templates CRUD
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Create, edit, duplicate, reorder, or publish/hide templates displayed on the website gallery.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flow-btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Template</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#EE4374] text-white shadow-md"
                  : "bg-[#1E1418] text-[#A8949B] hover:text-white border border-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A8949B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#635158] outline-none focus:border-[#EE4374]"
          />
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template, idx) => (
          <div
            key={template.id}
            className={`p-5 rounded-3xl bg-[#1E1418] border transition-all space-y-4 shadow-lg group relative ${
              template.status === "hidden"
                ? "border-white/10 opacity-60"
                : "border-[#EE4374]/30 hover:border-[#EE4374]"
            }`}
          >
            {/* Thumbnail */}
            <div className="relative h-48 rounded-2xl overflow-hidden bg-[#281B20]">
              <img
                src={template.thumbnailUrl}
                alt={template.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    template.priceType === "free"
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-500 text-slate-950"
                  }`}
                >
                  {template.priceType}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                  {template.category}
                </span>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleStatus(template)}
                  title={template.status === "published" ? "Hide Template" : "Publish Template"}
                  className="p-2 rounded-xl bg-black/70 hover:bg-black text-white transition-colors cursor-pointer"
                >
                  {template.status === "published" ? (
                    <Eye className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-rose-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white font-serif-display">
                  {template.name}
                </h3>
                <span className="text-[10px] font-mono text-[#A8949B]">
                  #{template.orderIndex}
                </span>
              </div>
              <p className="text-xs text-[#A8949B] mt-1 line-clamp-2 leading-relaxed">
                {template.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {template.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded-md bg-[#281B20] border border-white/5 text-[10px] text-[#EE4374] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Action Controls */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(idx, "up")}
                  disabled={idx === 0}
                  className="p-2 rounded-xl bg-[#281B20] text-[#A8949B] hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, "down")}
                  disabled={idx === templates.length - 1}
                  className="p-2 rounded-xl bg-[#281B20] text-[#A8949B] hover:text-white disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => duplicateTemplate(template)}
                  className="p-2 rounded-xl bg-[#281B20] hover:bg-[#34232A] text-xs font-bold text-white flex items-center gap-1 cursor-pointer"
                  title="Duplicate Template"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => handleOpenEdit(template)}
                  className="p-2 rounded-xl bg-[#EE4374]/20 hover:bg-[#EE4374]/30 text-xs font-bold text-[#EE4374] flex items-center gap-1 cursor-pointer"
                  title="Edit Template"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-xs font-bold text-rose-300 flex items-center gap-1 cursor-pointer"
                  title="Delete Template"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E1418] border border-[#EE4374]/30 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-5 custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white font-serif-display">
                {editingTemplate.id.startsWith("template-") ? "Add New Template" : "Edit Template"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#A8949B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  required
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#A8949B] mb-1">
                    Category
                  </label>
                  <select
                    value={editingTemplate.category}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value })}
                    className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="Interactive">Interactive</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Floral">Floral</option>
                    <option value="Cyberpunk">Cyberpunk</option>
                    <option value="Classic">Classic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8949B] mb-1">
                    Price Type
                  </label>
                  <select
                    value={editingTemplate.priceType}
                    onChange={(e) =>
                      setEditingTemplate({
                        ...editingTemplate,
                        priceType: e.target.value as "free" | "premium",
                      })
                    }
                    className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingTemplate.thumbnailUrl}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, thumbnailUrl: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={editingTemplate.tags.join(", ")}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#A8949B] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flow-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
