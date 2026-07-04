import React, { useState } from "react";
import { ShieldCheck, Upload, User, Check, Lock, Camera, AlertCircle, RefreshCw } from "lucide-react";

interface StudentVerificationPageProps {
  currentUser: { id: string; name: string; email: string; role: string; profilePic?: string; isVerified?: boolean };
  setCurrentUser: (user: any) => void;
  onVerifyComplete: () => void;
}

export default function StudentVerificationPage({ currentUser, setCurrentUser, onVerifyComplete }: StudentVerificationPageProps) {
  const [otpCode, setOtpCode] = useState("");
  const [profilePic, setProfilePic] = useState(currentUser.profilePic || "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const presets = [
    { name: "Emma", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma" },
    { name: "James", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=James" },
    { name: "Sophia", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia" },
    { name: "Lucas", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lucas" },
    { name: "Aria", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aria" },
    { name: "Oliver", url: "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver" }
  ];

  // Drag and drop profile pic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image size should not exceed 5MB.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");

    // Simulate uploading
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        setIsUploading(false);
        setSuccessMsg("Profile picture uploaded successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      };
      reader.readAsDataURL(file);
    }, 1200);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setErrorMsg("Please enter the verification security code.");
      return;
    }

    setIsVerifying(true);
    setErrorMsg("");

    try {
      // First save profile picture
      await fetch("/api/students/update-profile-pic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, profilePic })
      });

      // Then verify
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, code: otpCode })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Incorrect code. Please try again.");
      } else {
        // Success
        setCurrentUser(data.user);
        onVerifyComplete();
      }
    } catch (err) {
      setErrorMsg("Connection error during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden grid grid-cols-1 md:grid-cols-1 divide-y divide-slate-100">
        
        {/* Verification banner header */}
        <div className="p-6 sm:p-8 bg-slate-50 text-center space-y-2">
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mx-auto border border-rose-100 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Compliance Account Activation</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            In compliance with emergency medical training audits, new student accounts require registration verification. Configure your profile avatar and enter your security PIN.
          </p>
        </div>

        <form onSubmit={handleVerifySubmit} className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-150 text-rose-800 text-xs flex gap-2.5 font-medium animate-pulse">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-800 text-xs flex gap-2.5 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Section 1: Custom Profile Picture upload / selector */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Camera className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">1. Setup Profile Picture</h3>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {/* Profile Pic preview box */}
              <div className="relative w-24 h-24 rounded-full border-4 border-slate-100 shadow-inner shrink-0 overflow-hidden bg-slate-50 group">
                <img src={profilePic} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                {isUploading && (
                  <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-rose-600 animate-spin" />
                  </div>
                )}
              </div>

              {/* Drag and Drop area */}
              <div className="flex-1 w-full space-y-3">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition ${
                    dragOver ? "border-rose-500 bg-rose-50/30" : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                  }`}
                >
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="profile-upload" className="cursor-pointer space-y-1.5 block">
                    <Upload className="w-5 h-5 text-slate-400 mx-auto" />
                    <span className="text-[11px] font-bold text-rose-600 hover:text-rose-700 block">
                      Upload Custom Picture
                    </span>
                    <span className="text-[9px] text-slate-400 block font-mono">
                      Drag & Drop or Click to browse (Max 5MB)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Quick avatar presets selection */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-slate-450 block font-bold">Or select a standard responder avatar:</span>
              <div className="flex gap-2.5 items-center py-1 overflow-x-auto">
                {presets.map((preset) => {
                  const isSelected = profilePic === preset.url;
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setProfilePic(preset.url)}
                      className={`w-11 h-11 rounded-full overflow-hidden border-2 shrink-0 transition ${
                        isSelected ? "border-rose-600 scale-105 shadow-md" : "border-transparent hover:scale-105 hover:border-slate-200"
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 2: OTP Entry code */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Lock className="w-4 h-4 text-rose-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">2. Enter Security Verification PIN</h3>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label className="text-[10px] uppercase font-mono text-slate-450 font-bold">6-Digit Verification PIN</label>
                <span className="text-[9px] text-slate-400 font-mono font-semibold">Demo PIN code: <strong className="text-rose-600">123456</strong></span>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 123456"
                className="w-full bg-slate-50 border border-slate-200 text-center text-lg font-black tracking-widest rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white placeholder-slate-300 shadow-sm transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-slate-300 text-white font-extrabold text-xs py-4 rounded-xl transition shadow-lg shadow-rose-600/15 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Completing Audit Verification...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Verify & Activate Academy Access
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
