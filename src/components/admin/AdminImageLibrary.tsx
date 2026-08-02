import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { ImageItem } from "../../types/cms";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Edit2,
  Search,
  Folder,
  Copy,
  Check,
  Eye,
  Plus,
  X,
  Sparkles,
} from "lucide-react";

export const AdminImageLibrary: React.FC = () => {
  const { images, addImage, deleteImage } = useCMS();

  const [selectedFolder, setSelectedFolder] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageName, setNewImageName] = useState("");
  const [newImageFolder, setNewImageFolder] = useState<
    "Hero" | "Gallery" | "Templates" | "Avatars" | "General"
  >("Hero");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const folders = ["All", "Hero", "Gallery", "Templates", "Avatars", "General"];

  const filteredImages = images.filter((img) => {
    const matchesSearch = img.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === "All" || img.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const newImg: ImageItem = {
            id: `img-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: reader.result,
            folder: newImageFolder,
            fileSize: `${(file.size / 1024).toFixed(0)} KB`,
            fileType: file.type.split("/")[1]?.toUpperCase() || "JPG",
            uploadedAt: new Date().toISOString().split("T")[0],
          };
          addImage(newImg);
          setIsAddModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    const newImg: ImageItem = {
      id: `img-${Date.now()}`,
      name: newImageName || "Uploaded Media Asset",
      url: newImageUrl,
      folder: newImageFolder,
      fileSize: "800 KB",
      fileType: "JPG",
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    addImage(newImg);
    setNewImageUrl("");
    setNewImageName("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Image Asset Manager
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Upload, preview, organize by folder, copy image URLs, or replace assets across the platform.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flow-btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image Asset</span>
        </button>
      </div>

      {/* Filter & Folders */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFolder === f
                  ? "bg-[#EE4374] text-white shadow-md"
                  : "bg-[#1E1418] text-[#A8949B] hover:text-white border border-white/5"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{f}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A8949B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search image assets..."
            className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#635158] outline-none focus:border-[#EE4374]"
          />
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="p-4 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 hover:border-[#EE4374] transition-all space-y-3 group relative shadow-md"
          >
            {/* Image Preview Box */}
            <div className="relative h-44 rounded-2xl overflow-hidden bg-[#281B20] flex items-center justify-center">
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-bold">
                {img.folder}
              </span>

              {/* Hover Quick Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => setPreviewImage(img)}
                  className="p-2.5 rounded-full bg-white text-[#181114] hover:scale-110 transition-transform cursor-pointer"
                  title="Full Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCopyUrl(img.url, img.id)}
                  className="p-2.5 rounded-full bg-[#EE4374] text-white hover:scale-110 transition-transform cursor-pointer"
                  title="Copy URL"
                >
                  {copiedId === img.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteImage(img.id)}
                  className="p-2.5 rounded-full bg-rose-600 text-white hover:scale-110 transition-transform cursor-pointer"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Asset Meta Info */}
            <div>
              <h4 className="text-xs font-bold text-white truncate">{img.name}</h4>
              <div className="flex items-center justify-between text-[10px] text-[#A8949B] mt-1 font-mono">
                <span>{img.fileSize}</span>
                <span>{img.fileType}</span>
                <span>{img.uploadedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E1418] border border-[#EE4374]/30 rounded-3xl p-6 w-full max-w-md space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-serif-display">
                Upload New Image Asset
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#A8949B] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddByUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Folder Category
                </label>
                <select
                  value={newImageFolder}
                  onChange={(e) => setNewImageFolder(e.target.value as any)}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                >
                  <option value="Hero">Hero</option>
                  <option value="Gallery">Gallery</option>
                  <option value="Templates">Templates</option>
                  <option value="Avatars">Avatars</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Upload File From Computer
                </label>
                <label className="w-full p-6 border-2 border-dashed border-[#EE4374]/30 hover:border-[#EE4374] rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-[#181114] transition-colors">
                  <Upload className="w-6 h-6 text-[#EE4374] mb-2 animate-bounce" />
                  <span className="text-xs font-bold text-white">Click or Drag & Drop File</span>
                  <span className="text-[10px] text-[#A8949B] mt-1">
                    Supports PNG, JPG, JPEG, WEBP, SVG
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-center text-xs text-[#A8949B] font-bold">— OR PASTE URL —</div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Asset Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Birthday Banner 2026"
                  value={newImageName}
                  onChange={(e) => setNewImageName(e.target.value)}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Image Direct URL
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#A8949B] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flow-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-[#1E1418] border border-[#EE4374]/30 rounded-3xl p-6 space-y-4">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white font-serif-display">
              {previewImage.name}
            </h3>
            <div className="max-h-[70vh] overflow-hidden rounded-2xl border border-white/10 bg-black flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.name}
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#A8949B]">
              <span className="font-mono">{previewImage.url}</span>
              <button
                onClick={() => handleCopyUrl(previewImage.url, previewImage.id)}
                className="px-4 py-2 rounded-xl bg-[#EE4374] text-white font-bold flex items-center gap-1.5"
              >
                {copiedId === previewImage.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>Copy URL</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
