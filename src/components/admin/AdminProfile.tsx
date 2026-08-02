import React, { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { UserCheck, KeyRound, ShieldAlert, LogOut, CheckCircle2, Lock, Mail } from "lucide-react";

export const AdminProfile: React.FC = () => {
  const { user, changePassword, logout, sessionTimer } = useAdminAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }

    const res = await changePassword(newPassword);
    if (res.success) {
      setMsg("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setErr(res.error || "Failed to update password.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Admin Profile & Security
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Manage your owner credentials, change security passwords, and inspect active session status.
          </p>
        </div>

        <button
          onClick={() => logout()}
          className="px-4 py-2.5 rounded-2xl bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Info */}
      <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374] flex items-center gap-2">
          <UserCheck className="w-4 h-4" />
          <span>Owner Credentials</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#181114] border border-white/5 space-y-1">
            <span className="text-[#A8949B] font-bold">Admin Email:</span>
            <p className="text-sm font-bold text-white font-mono">
              {user?.email || "admin@celebrationcraft.com"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#181114] border border-white/5 space-y-1">
            <span className="text-[#A8949B] font-bold">Role Privilege:</span>
            <p className="text-sm font-bold text-emerald-400 font-serif-display">
              Master Website Owner (Superadmin)
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374] flex items-center gap-2">
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </h3>

        {msg && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{msg}</span>
          </div>
        )}

        {err && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs">
            {err}
          </div>
        )}

        <form onSubmit={handleChangePass} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#A8949B] mb-2">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#A8949B] mb-2">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
            />
          </div>

          <button
            type="submit"
            className="flow-btn-primary px-6 py-3 rounded-2xl font-bold text-xs text-white shadow-lg cursor-pointer"
          >
            Update Security Password
          </button>
        </form>
      </div>
    </div>
  );
};
