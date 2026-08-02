import React, { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { PartyPopper, Lock, Mail, KeyRound, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess?: () => void;
  onSuccess?: () => void;
  onGoToWebsite?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onSuccess, onGoToWebsite }) => {
  const { login, resetPassword } = useAdminAuth();
  const [email, setEmail] = useState("admin@celebrationcraft.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("admin@celebrationcraft.com");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (onLoginSuccess) onLoginSuccess();
      else if (onSuccess) onSuccess();
    } else {
      setErrorMsg(result.error || "Login failed. Please check credentials.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    setIsLoading(true);
    const result = await resetPassword(resetEmail);
    setIsLoading(false);
    if (result.success) {
      setSuccessMsg(`Password reset instructions sent to ${resetEmail}`);
      setIsForgotModalOpen(false);
    } else {
      setErrorMsg(result.error || "Failed to send reset email.");
    }
  };

  return (
    <div className="min-h-screen bg-[#181114] text-[#FCE7EC] flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#EE4374]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#23171B]/90 backdrop-blur-xl border border-[#EE4374]/30 rounded-3xl p-8 shadow-[0_25px_70px_rgba(0,0,0,0.6)] relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#EE4374] to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#EE4374]/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white font-serif-display tracking-tight">
            Admin CMS Panel
          </h1>
          <p className="text-xs text-[#A8949B] mt-1 font-medium">
            CelebrationCraft Studio Control Center
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-rose-300">Access Denied</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#D82C5D] mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-[#A8949B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@celebrationcraft.com"
                className="w-full bg-[#181114] border border-[#EE4374]/25 focus:border-[#EE4374] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-[#635158] outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D82C5D]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-xs text-[#EE4374] hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-[#A8949B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181114] border border-[#EE4374]/25 focus:border-[#EE4374] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-[#635158] outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flow-btn-primary py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all active:scale-95 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Verifying Admin Rights...</span>
            ) : (
              <>
                <span>Sign In To Admin CMS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Master Credentials Quick Hint */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-[11px] text-[#A8949B] font-medium">
            Owner Setup Credentials: <code className="text-[#EE4374] bg-[#181114] px-2 py-0.5 rounded-md font-mono">admin@celebrationcraft.com</code> / <code className="text-[#EE4374] bg-[#181114] px-2 py-0.5 rounded-md font-mono">admin123</code>
          </p>
          <button
            onClick={() => onGoToWebsite?.()}
            className="mt-4 text-xs text-[#A8949B] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold"
          >
            ← Return To Public Website
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#23171B] border border-[#EE4374]/30 rounded-3xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#EE4374]/20 text-[#EE4374]">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Reset Password</h3>
            </div>
            <p className="text-xs text-[#A8949B]">
              Enter your registered admin email address and we will send you a password reset link.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="admin@celebrationcraft.com"
                className="w-full bg-[#181114] border border-[#EE4374]/30 rounded-xl px-4 py-3 text-sm text-white outline-none"
              />
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A8949B] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#EE4374] text-white hover:bg-pink-600 transition-colors"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
