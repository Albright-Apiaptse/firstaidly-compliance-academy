import React, { useState, useRef } from "react";
import { User, Mail, Key, Camera, Check, AlertCircle, Save } from "lucide-react";
import { User as UserType } from "../types";

interface UserProfileFormProps {
  currentUser: UserType;
  onUpdateUser: (updatedUser: UserType) => void;
  isMobileMockup?: boolean;
}

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80"
];

export default function UserProfileForm({ currentUser, onUpdateUser, isMobileMockup = false }: UserProfileFormProps) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState(currentUser.password || "");
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (base64String) {
        setProfilePic(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Full Name is required.");
      setLoading(false);
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          name: name.trim(),
          email: email.trim(),
          password: password.trim(),
          profilePic
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess("Profile updated successfully!");
        onUpdateUser(data.user);
        setTimeout(() => setSuccess(""), 4000);
      } else {
        setError(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${isMobileMockup ? "p-4 space-y-4" : "max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6"}`}>
      {!isMobileMockup && (
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Edit Personal Profile</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Update your login credentials, name, and profile picture instantly.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2 text-[11px] text-rose-700 font-bold leading-snug">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2 text-[11px] text-emerald-700 font-bold leading-snug">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Profile Pic Upload Section */}
        <div className="flex flex-col items-center gap-3 bg-slate-50/50 border border-slate-200/80 p-4 rounded-2xl">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none self-start">
            Profile Avatar
          </label>
          
          <div className="flex items-center gap-4 w-full">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group w-16 h-16 rounded-full bg-rose-50 border-2 border-rose-200 text-rose-600 font-sans font-black flex items-center justify-center text-xl overflow-hidden shrink-0 shadow-sm cursor-pointer hover:border-rose-400 transition"
              title="Click to Upload"
            >
              {profilePic ? (
                <img src={profilePic} alt={name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                name.charAt(0)
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-1.5 flex-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3.5 py-1.5 bg-white border border-slate-250 hover:bg-slate-50 text-[10px] font-black text-slate-650 rounded-lg shadow-sm transition inline-block cursor-pointer"
              >
                Upload Custom Photo
              </button>
              <p className="text-[9px] text-slate-400 font-semibold leading-normal">
                Supports JPG, PNG or WEBP formats. Max file size 2MB.
              </p>
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {/* Preset Avatar Chooser */}
          <div className="w-full pt-3 border-t border-slate-200/60">
            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-2 leading-none">
              Or pick an instant design:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setProfilePic(url)}
                  className={`w-9 h-9 rounded-full border-2 overflow-hidden transition shrink-0 cursor-pointer ${
                    profilePic === url ? "border-rose-600 scale-105 shadow-md" : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input fields */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
              Full Name / Responder Call Sign
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your first & last name"
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
              E-Mail Address (Sign-In Credential)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@firstaid.com"
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">
              Update Secure Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Key className="h-4 w-4 text-slate-400" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-slate-200 text-slate-800 text-xs rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-sm transition"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-rose-400 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/15 cursor-pointer hover:scale-[1.01]"
        >
          {loading ? (
            <span>Processing Save...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Personal Details</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
