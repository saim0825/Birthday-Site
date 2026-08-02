import React, { useState, useRef } from "react";
import { useCMS } from "../../context/CMSContext";
import { MusicTrack } from "../../types/cms";
import {
  Music,
  Play,
  Pause,
  Plus,
  Trash2,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  Upload,
} from "lucide-react";

export const AdminMusicLibrary: React.FC = () => {
  const { musicTracks, saveMusicTrack, deleteMusicTrack } = useCMS();

  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<MusicTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayToggle = (track: MusicTrack) => {
    if (activePlayingId === track.id) {
      audioRef.current?.pause();
      setActivePlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.volume = track.defaultVolume;
        audioRef.current.play();
        setActivePlayingId(track.id);
      }
    }
  };

  const handleOpenAdd = () => {
    setEditingTrack({
      id: `track-${Date.now()}`,
      title: "",
      artist: "CelebrationCraft Studio",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3",
      isDefault: false,
      autoplay: true,
      defaultVolume: 0.8,
    });
    setIsModalOpen(true);
  };

  const handleSetDefault = async (track: MusicTrack) => {
    await saveMusicTrack({ ...track, isDefault: true });
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrack) {
      await saveMusicTrack(editingTrack);
      setIsModalOpen(false);
      setEditingTrack(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden Audio Player Element */}
      <audio
        ref={audioRef}
        onEnded={() => setActivePlayingId(null)}
        onError={() => setActivePlayingId(null)}
      />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Music & Soundtrack Library
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Manage celebration soundtrack audio tracks, select default website background audio, enable autoplay & volume.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flow-btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Audio Track</span>
        </button>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {musicTracks.map((track) => {
          const isPlaying = activePlayingId === track.id;
          return (
            <div
              key={track.id}
              className={`p-6 rounded-3xl bg-[#1E1418] border transition-all space-y-5 shadow-lg relative ${
                track.isDefault
                  ? "border-[#EE4374] bg-gradient-to-b from-[#281B20] to-[#1E1418]"
                  : "border-white/10 hover:border-[#EE4374]/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handlePlayToggle(track)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      isPlaying
                        ? "bg-[#EE4374] text-white animate-pulse"
                        : "bg-[#281B20] text-[#EE4374] hover:bg-[#EE4374] hover:text-white"
                    }`}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 pl-0.5" />}
                  </button>

                  <div>
                    <h3 className="text-sm font-bold text-white font-serif-display leading-tight">
                      {track.title}
                    </h3>
                    <p className="text-xs text-[#A8949B] mt-0.5">{track.artist}</p>
                  </div>
                </div>

                {track.isDefault && (
                  <span className="px-3 py-1 rounded-full bg-[#EE4374]/20 border border-[#EE4374]/40 text-[#EE4374] text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                    Default Track
                  </span>
                )}
              </div>

              {/* Volume & Autoplay Stats */}
              <div className="p-3.5 rounded-2xl bg-[#181114] border border-white/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#A8949B]">
                  <span>Autoplay Enabled:</span>
                  <span className={track.autoplay ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {track.autoplay ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[#A8949B]">
                  <span>Default Volume:</span>
                  <span className="font-mono text-white font-bold">
                    {Math.round(track.defaultVolume * 100)}%
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="pt-2 flex items-center justify-between gap-2 border-t border-white/10">
                {!track.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(track)}
                    className="px-3 py-2 rounded-xl bg-[#281B20] hover:bg-[#34232A] text-xs font-bold text-[#FCE7EC] flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Set as Default</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Site Soundtrack
                  </span>
                )}

                <button
                  onClick={() => deleteMusicTrack(track.id)}
                  className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                  title="Delete Audio Track"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Track Modal */}
      {isModalOpen && editingTrack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E1418] border border-[#EE4374]/30 rounded-3xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-serif-display">
                Add Audio Soundtrack
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
                  Track Title
                </label>
                <input
                  type="text"
                  required
                  value={editingTrack.title}
                  onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Artist Name
                </label>
                <input
                  type="text"
                  value={editingTrack.artist}
                  onChange={(e) => setEditingTrack({ ...editingTrack, artist: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Audio Direct MP3 URL
                </label>
                <input
                  type="text"
                  required
                  value={editingTrack.audioUrl}
                  onChange={(e) => setEditingTrack({ ...editingTrack, audioUrl: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono text-[11px] outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white">Autoplay on page load</label>
                <input
                  type="checkbox"
                  checked={editingTrack.autoplay}
                  onChange={(e) => setEditingTrack({ ...editingTrack, autoplay: e.target.checked })}
                  className="w-4 h-4 accent-[#EE4374]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-1">
                  Default Volume ({Math.round(editingTrack.defaultVolume * 100)}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={editingTrack.defaultVolume}
                  onChange={(e) =>
                    setEditingTrack({ ...editingTrack, defaultVolume: parseFloat(e.target.value) })
                  }
                  className="w-full accent-[#EE4374]"
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
                  Save Audio Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
