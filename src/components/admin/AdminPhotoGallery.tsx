import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { GalleryPhoto } from "../../types/cms";
import { Camera, Plus, Trash2, Edit2, MoveUp, MoveDown, Eye, X } from "lucide-react";

export const AdminPhotoGallery: React.FC = () => {
  const { gallery, saveGalleryPhoto, deleteGalleryPhoto } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);

  const handleOpenAdd = () => {
    setEditingPhoto({
      id: `gal-${Date.now()}`,
      title: "",
      imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
      caption: "",
      orderIndex: gallery.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: GalleryPhoto) => {
    setEditingPhoto({ ...p });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPhoto) {
      await saveGalleryPhoto(editingPhoto);
      setIsModalOpen(false);
      setEditingPhoto(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Photo Gallery Manager
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Manage showcase gallery photos displayed on the landing page and interactive showcase modules.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flow-btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gallery Photo</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 hover:border-[#EE4374] transition-all space-y-4 shadow-lg group"
          >
            <div className="relative h-48 rounded-2xl overflow-hidden bg-[#281B20]">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                #{item.orderIndex}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white font-serif-display">
                {item.title}
              </h3>
              <p className="text-xs text-[#A8949B] mt-1">{item.caption}</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-xl bg-[#EE4374]/20 text-[#EE4374] hover:bg-[#EE4374]/30 cursor-pointer"
                  title="Edit Photo"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteGalleryPhoto(item.id)}
                  className="p-2 rounded-xl bg-rose-950/50 text-rose-300 hover:bg-rose-900 cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E1418] border border-[#EE4374]/30 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-serif-display">
                Manage Gallery Photo
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
                  Photo Title
                </label>
                <input
                  type="text"
                  required
                  value={editingPhoto.title}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Image Direct URL
                </label>
                <input
                  type="text"
                  required
                  value={editingPhoto.imageUrl}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, imageUrl: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Caption Description
                </label>
                <textarea
                  rows={2}
                  value={editingPhoto.caption}
                  onChange={(e) => setEditingPhoto({ ...editingPhoto, caption: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
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
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
