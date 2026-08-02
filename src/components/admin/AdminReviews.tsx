import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { ReviewItem } from "../../types/cms";
import { Star, Plus, Trash2, Edit2, CheckCircle2, EyeOff, X } from "lucide-react";

export const AdminReviews: React.FC = () => {
  const { reviews, saveReview, deleteReview } = useCMS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const handleOpenAdd = () => {
    setEditingReview({
      id: `rev-${Date.now()}`,
      customerName: "",
      customerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
      rating: 5,
      reviewText: "",
      status: "approved",
      createdAt: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (r: ReviewItem) => {
    setEditingReview({ ...r });
    setIsModalOpen(true);
  };

  const handleToggleApprove = async (r: ReviewItem) => {
    const nextStatus = r.status === "approved" ? "hidden" : "approved";
    await saveReview({ ...r, status: nextStatus });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      await saveReview(editingReview);
      setIsModalOpen(false);
      setEditingReview(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Customer Reviews & Testimonials
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Approve, edit, hide, or create customer reviews displayed on the landing page showcase.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flow-btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`p-6 rounded-3xl bg-[#1E1418] border transition-all space-y-4 shadow-lg ${
              rev.status === "approved" ? "border-[#EE4374]/30" : "border-white/10 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={rev.customerImage}
                  alt={rev.customerName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#EE4374]"
                />
                <div>
                  <h3 className="text-sm font-bold text-white font-serif-display">
                    {rev.customerName}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  rev.status === "approved"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {rev.status}
              </span>
            </div>

            <p className="text-xs text-[#FCE7EC] leading-relaxed italic">
              "{rev.reviewText}"
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#A8949B] font-mono text-[10px]">{rev.createdAt}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleApprove(rev)}
                  className="p-2 rounded-xl bg-[#281B20] text-emerald-400 hover:bg-[#34232A] cursor-pointer"
                  title={rev.status === "approved" ? "Hide Review" : "Approve Review"}
                >
                  {rev.status === "approved" ? <EyeOff className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleOpenEdit(rev)}
                  className="p-2 rounded-xl bg-[#EE4374]/20 text-[#EE4374] hover:bg-[#EE4374]/30 cursor-pointer"
                  title="Edit Review"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteReview(rev.id)}
                  className="p-2 rounded-xl bg-rose-950/50 text-rose-300 hover:bg-rose-900 cursor-pointer"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E1418] border border-[#EE4374]/30 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-serif-display">
                Manage Customer Review
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
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={editingReview.customerName}
                  onChange={(e) => setEditingReview({ ...editingReview, customerName: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Customer Image URL
                </label>
                <input
                  type="text"
                  required
                  value={editingReview.customerImage}
                  onChange={(e) => setEditingReview({ ...editingReview, customerImage: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono text-[11px] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Star Rating (1-5)
                </label>
                <select
                  value={editingReview.rating}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                >
                  <option value={5}>5 Stars ★★★★★</option>
                  <option value={4}>4 Stars ★★★★☆</option>
                  <option value={3}>3 Stars ★★★☆☆</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Review Content
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingReview.reviewText}
                  onChange={(e) => setEditingReview({ ...editingReview, reviewText: e.target.value })}
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
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
