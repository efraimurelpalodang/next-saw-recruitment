import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const exportToPDF = (data: any, vacancyInfo: any) => {
  const doc = new jsPDF();
  const timestamp = format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id });

  // Header - Company Profile
  doc.setFontSize(18);
  doc.setTextColor(28, 36, 52); // Dark blue / gray
  doc.text('PT. SUMBER PANGAN SEJAHTERA', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('REKAPITULASI HASIL SELEKSI REKRUTMEN KARYAWAN', 105, 27, { align: 'center' });
  
  doc.setLineWidth(0.5);
  doc.line(20, 32, 190, 32);

  // Vacancy Info
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text(`Posisi: ${vacancyInfo.jenis_pekerjaan.nama_jenis}`, 20, 42);
  doc.text(`Lokasi: ${vacancyInfo.lokasi_kerja}`, 20, 48);
  doc.text(`Tanggal Cetak: ${timestamp}`, 20, 54);

  // Table
  const tableData = data.map((item: any, index: number) => [
    item.penilaian?.peringkat || index + 1,
    item.pengguna.nama_lengkap,
    item.penilaian?.nilai_c1_pendidikan,
    item.penilaian?.nilai_c2_pengalaman,
    item.penilaian?.nilai_c3_sertifikasi,
    item.penilaian?.nilai_c4_tes_keterampilan,
    item.penilaian?.nilai_c5_wawancara,
    (item.penilaian?.nilai_preferensi * 100).toFixed(1) + '%',
    item.keputusan_hrd.toUpperCase()
  ]);

  autoTable(doc, {
    startY: 62,
    head: [['Rank', 'Nama Pelamar', 'C1', 'C2', 'C3', 'C4', 'C5', 'Nilai SAW', 'Keputusan']],
    body: tableData,
    headStyles: { 
      fillColor: [60, 80, 224], // #3c50e0
      textColor: [255, 255, 255],
      fontStyle: 'bold' 
    },
    alternateRowStyles: { fillColor: [245, 247, 251] },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 45 },
      7: { cellWidth: 25, fontStyle: 'bold' },
      8: { cellWidth: 25, fontStyle: 'bold' }
    },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // Footer / Signature Placeholder
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(10);
  doc.text('Dicetak secara otomatis oleh Sistem SPK Rekrutmen PT. SPS', 20, finalY + 20);

  doc.save(`Laporan_Seleksi_${vacancyInfo.jenis_pekerjaan.nama_jenis.replace(/\s+/g, '_')}.pdf`);
};

export const exportToExcel = (data: any, vacancyInfo: any) => {
  const worksheetData = data.map((item: any, index: number) => ({
    'Peringkat': item.penilaian?.peringkat || index + 1,
    'Nama Pelamar': item.pengguna.nama_lengkap,
    'Institusi': item.pengguna.profil?.nama_institusi || '-',
    'C1 (Pendidikan)': item.penilaian?.nilai_c1_pendidikan,
    'C2 (Pengalaman)': item.penilaian?.nilai_c2_pengalaman,
    'C3 (Sertifikasi)': item.penilaian?.nilai_c3_sertifikasi,
    'C4 (Tes Skill)': item.penilaian?.nilai_c4_tes_keterampilan,
    'C5 (Wawancara)': item.penilaian?.nilai_c5_wawancara,
    'Nilai Preferensi': (item.penilaian?.nilai_preferensi * 100).toFixed(2) + '%',
    'Keputusan': item.keputusan_hrd
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Seleksi');

  // Set column widths
  const wscols = [
    { wch: 10 }, // Rank
    { wch: 30 }, // Name
    { wch: 25 }, // Institution
    { wch: 15 }, // C1
    { wch: 15 }, // C2
    { wch: 15 }, // C3
    { wch: 15 }, // C4
    { wch: 15 }, // C5
    { wch: 15 }, // Score
    { wch: 15 }, // Decision
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, `Laporan_Seleksi_${vacancyInfo.jenis_pekerjaan.nama_jenis.replace(/\s+/g, '_')}.xlsx`);
};
