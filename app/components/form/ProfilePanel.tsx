"use client";

import { useRef } from "react";
import type { Profile } from "@/app/lib/types";

interface Props {
  profile: Profile;
  onChange: (p: Profile) => void;
  onSave: () => void;
  onClear: () => void;
}

export default function ProfilePanel({ profile, onChange, onSave, onClear }: Props) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange({ ...profile, logoDataUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Profile Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#096651]/30 focus:border-[#096651]"
            value={profile.name}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            placeholder="e.g. University of St. La Salle"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Short Code
          </label>
          <input
            type="text"
            maxLength={6}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#096651]/30 focus:border-[#096651]"
            value={profile.shortCode}
            onChange={(e) =>
              onChange({
                ...profile,
                shortCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""),
              })
            }
            placeholder="USLS"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Organization Logo
        </label>
        <div className="flex items-center gap-3">
          {profile.logoDataUrl ? (
            <img
              src={profile.logoDataUrl}
              alt="Logo"
              className="h-10 w-auto max-w-[80px] object-contain rounded border border-gray-200 p-1"
            />
          ) : (
            <div className="h-10 w-10 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
              Logo
            </div>
          )}
          <button
            type="button"
            onClick={() => logoInputRef.current?.click()}
            className="text-xs px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {profile.logoDataUrl ? "Replace" : "Upload"}
          </button>
          {profile.logoDataUrl && (
            <button
              type="button"
              onClick={() => onChange({ ...profile, logoDataUrl: null })}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Default Issuer Name
        </label>
        <input
          type="text"
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#096651]/30 focus:border-[#096651]"
          value={profile.defaultIssuerName}
          onChange={(e) => onChange({ ...profile, defaultIssuerName: e.target.value })}
          placeholder="e.g. Ma. Teresa R. Santos"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Footer Note <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#096651]/30 focus:border-[#096651]"
          value={profile.footerNote}
          onChange={(e) => onChange({ ...profile, footerNote: e.target.value })}
          placeholder="FundMe.ph — The place for those who care."
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onSave}
          className="flex-1 bg-[#096651] text-white text-sm font-medium py-2 rounded-md hover:bg-[#074d3d] transition-colors"
        >
          Save Profile
        </button>
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
