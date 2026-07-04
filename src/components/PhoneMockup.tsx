import React from "react";

interface PhoneMockupProps {
  children: React.ReactNode;
}

export default function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex-1 bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      {children}
    </div>
  );
}
