"use client";

import React, { useState, useRef } from 'react';
import { FileUp, FileText, CheckCircle2, Pencil, X, Save, Download, Upload } from 'lucide-react';

interface UploadBerkasCardProps {
  profil: any;
}

interface FileSlot {
  title: string;
  fileKey: keyof NonNullable<UploadBerkasCardProps['profil']>;
  optional?: boolean;
}

const fileSlots: FileSlot[] = [
  { title: 'Ijazah', fileKey: 'berkas_ijazah' },
  { title: 'CV', fileKey: 'berkas_cv' },
  { title: 'Sertifikat', fileKey: 'berkas_sertifikat', optional: true },
];

export default function UploadBerkasCard({ profil }: UploadBerkasCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragOver, setDragOver] = useState<string | null>(null);

  const simulateUpload = (key: string) => {
    setUploadProgress((prev) => ({ ...prev, [key]: 0 }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress((prev) => ({ ...prev, [key]: Math.round(progress) }));
    }, 120);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Upload Berkas</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isEditing
              ? 'border-red-200 text-red-500 bg-red-50 hover:bg-red-100'
              : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
          }`}
        >
          {isEditing ? <X size={13} /> : <Pencil size={13} />}
          {isEditing ? 'Batal' : 'Edit'}
        </button>
      </div>

      <div className="border-t border-gray-100" />

      {/* File Slots */}
      <div className="px-5 py-4 grid grid-cols-1 gap-4">
        {fileSlots.map((slot) => {
          const fileName = profil?.[slot.fileKey] as string | undefined | null;
          const progressVal = uploadProgress[slot.fileKey as string];
          const isUploading = progressVal !== undefined && progressVal < 100;
          const isDone = progressVal === 100;

          return (
            <div key={slot.fileKey as string}>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                {slot.title}
                {slot.optional && <span className="ml-1 text-gray-300 normal-case font-normal">(opsional)</span>}
              </p>

              {isEditing ? (
                /* Upload Zone */
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(slot.fileKey as string); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(null); simulateUpload(slot.fileKey as string); }}
                  className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${
                    dragOver === slot.fileKey
                      ? 'border-[#fccf54] bg-[#fccf54]/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <FileUp size={18} className="text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">Import PDF File</p>
                    <p className="text-xs text-gray-400 mt-0.5">Drop file atau klik untuk memilih</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={() => simulateUpload(slot.fileKey as string)}
                  />
                </label>
              ) : (
                /* File Status Box */
                <div className={`rounded-xl border p-4 flex items-center gap-3 transition-all ${
                  fileName || isDone
                    ? 'border-emerald-100 bg-emerald-50/50'
                    : 'border-gray-100 bg-gray-50/50'
                }`}>
                  {/* PDF Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    fileName || isDone ? 'bg-emerald-100' : 'bg-gray-100'
                  }`}>
                    {fileName || isDone
                      ? <CheckCircle2 size={18} className="text-emerald-500" />
                      : <FileText size={18} className="text-gray-300" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    {isUploading ? (
                      <>
                        <p className="text-xs font-semibold text-gray-700 truncate mb-1">
                          {slot.title}.pdf · <span className="text-gray-400 font-normal">Sedang diunggah...</span>
                        </p>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-1.5 bg-blue-500 rounded-full transition-all duration-200"
                            style={{ width: `${progressVal}%` }}
                          />
                        </div>
                      </>
                    ) : fileName || isDone ? (
                      <>
                        <p className="text-xs font-semibold text-gray-700 truncate">
                          {typeof fileName === 'string' ? (fileName.split('/').pop() || `${slot.title}.pdf`) : `${slot.title}.pdf`}
                        </p>
                        <p className="text-[10px] text-emerald-500 font-medium mt-0.5">Berkas tersimpan</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-gray-400">Belum ada berkas</p>
                        <p className="text-[10px] text-gray-300 mt-0.5">PDF format disarankan</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Progress while uploading in edit mode */}
              {isEditing && isUploading && (
                <div className="mt-2 px-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] text-gray-500 font-medium">
                      {slot.title}.pdf · <span className="text-gray-400">Mengunggah...</span>
                    </p>
                    <span className="text-[10px] font-bold text-blue-500">{progressVal}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 bg-blue-500 rounded-full transition-all duration-200"
                      style={{ width: `${progressVal}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save / Action Footer */}
      {isEditing && (
        <>
          <div className="border-t border-gray-100" />
          <div className="px-5 py-3 flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-all"
            >
              <Download size={12} /> Template
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-sm"
            >
              <Upload size={12} /> Upload Berkas
            </button>
          </div>
        </>
      )}
    </div>
  );
}
