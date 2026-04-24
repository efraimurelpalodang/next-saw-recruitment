"use client";

import React, { useState } from 'react';
import { FileUp, FileText, CheckCircle2 } from 'lucide-react';

interface UploadBerkasCardProps {
  profil: any;
}

export default function UploadBerkasCard({ profil }: UploadBerkasCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const FileBox = ({ title, fileName, optional = false }: { title: string, fileName?: string | null, optional?: boolean }) => {
    return (
      <div className="flex flex-col">
        <p className="text-base font-semibold text-gray-800 mb-2">
          {title} {optional && <span className="text-gray-400 font-normal text-sm">( ops )</span>}
        </p>
        
        {isEditing ? (
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group">
            <FileUp className="w-8 h-8 text-gray-400 group-hover:text-gray-600 mb-3" />
            <span className="text-sm font-semibold text-gray-600">Import PDF File</span>
            <input type="file" accept=".pdf" className="hidden" />
          </label>
        ) : (
          <div className={`border rounded-lg p-8 flex flex-col items-center justify-center ${fileName ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            {fileName ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />
                <span className="text-sm font-semibold text-green-700 text-center px-4 truncate w-full">{fileName.split('/').pop() || 'Berkas Terunggah'}</span>
              </>
            ) : (
              <>
                <FileText className="w-8 h-8 text-gray-300 mb-3" />
                <span className="text-sm font-medium text-gray-400">Belum ada berkas</span>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold text-gray-800">Upload Berkas</h2>
        <button
          onClick={toggleEdit}
          className="px-4 py-1.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          {isEditing ? 'Batal' : 'Edit'}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileBox title="Ijazah" fileName={profil?.berkas_ijazah} />
          <FileBox title="CV" fileName={profil?.berkas_cv} />
          <div className="md:col-span-2 md:w-1/2 md:pr-3">
            <FileBox title="Sertifikat" fileName={profil?.berkas_sertifikat} optional />
          </div>
        </div>

        {isEditing && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 bg-gray-900 text-white text-sm font-semibold rounded-md shadow-md hover:bg-gray-800 transition-colors"
            >
              Simpan Berkas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
