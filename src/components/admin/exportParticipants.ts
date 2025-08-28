
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Format tanggal lahir ke format Indonesia
function formatTanggalIndo(tgl: string): string {
  if (!tgl) return '';
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const [year, month, day] = tgl.split('-');
  if (!year || !month || !day) return tgl;
  return `${parseInt(day)} ${bulan[parseInt(month) - 1]} ${year}`;
}

type Participant = { [key: string]: string | number | undefined };

// Kolom yang digunakan untuk export
const EXPORT_COLUMNS = ['No', 'Nama', 'TTL', 'Kampus', 'Angkatan', 'Jurusan', 'No HP'];

// Mapping peserta ke format export (Excel/PDF)
function mapParticipantExport(p: Participant, idx: number) {
  return {
    'No': String(idx + 1),
    'Nama': String(p['Nama'] || p['name'] || ''),
    'TTL': `${p['Tempat Lahir'] || p['tempat_lahir'] || p['place'] || ''}, ${formatTanggalIndo(
      typeof (p['Tanggal Lahir'] || p['birth_date']) === 'string'
        ? (p['Tanggal Lahir'] || p['birth_date']) as string
        : (p['Tanggal Lahir'] || p['birth_date'])
          ? String(p['Tanggal Lahir'] || p['birth_date'])
          : ''
    )}`.replace(/^, /, ''),
    'Kampus': String(p['Kampus'] || p['kampus'] || p['campus'] || ''),
    'Angkatan': String(p['Angkatan'] || p['angkatan'] || p['batch'] || ''),
    'Jurusan': String(p['Jurusan'] || p['jurusan'] || p['major'] || ''),
    'No HP': String(p['No HP'] || p['no_hp'] || p['phone'] || '')
  };
}

/**
 * Catatan: SheetJS/xlsx versi community (open source) TIDAK mendukung styling (bold, border, warna, dsb) pada file hasil export.
 * Opsi cellStyles: true tidak berpengaruh pada hasil export di versi ini.
 * Jika ingin hasil Excel dengan header bold dan border tabel, gunakan library exceljs.
 *
 * Untuk kebutuhan styling lanjut, gunakan fungsi exportToExcelWithStyle dari src/lib/exportExcelWithStyle.ts
 */
export async function exportParticipantsToExcel(_participants?: Participant[], filename = 'Daftar Peserta Welcoming College 2025.xlsx') {
  // Ambil seluruh data peserta dari backend (fetch all pages)
  const baseUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || '' : '';
  let page = 1;
  const perPage = 100;
  let allParticipants: Participant[] = [];
  let totalPages = 1;
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  do {
    const res = await fetch(`${baseUrl}/api/participants?page=${page}&limit=${perPage}`, { headers });
    const result = await res.json();
    const participants = result.data?.participants || [];
    allParticipants = allParticipants.concat(participants);
    totalPages = result.data?.pagination?.total_pages || 1;
    page++;
  } while (page <= totalPages);

  // Urutkan berdasarkan created_at ascending
  allParticipants.sort((a: Participant, b: Participant) => {
    const tA = a.created_at ? new Date(a.created_at as string).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at as string).getTime() : 0;
    return tA - tB;
  });
  const data = allParticipants.map(mapParticipantExport);
  // Buat worksheet dan tambahkan header
  const ws = XLSX.utils.json_to_sheet(data, { header: EXPORT_COLUMNS });
  // Auto width kolom
  const colWidths = EXPORT_COLUMNS.map((col: string) => {
    const maxLen = Math.max(
      col.length,
      ...data.map((row: Record<string, string>) => (row[col] ? String(row[col]).length : 0))
    );
    return { wch: maxLen + 2 };
  });
  ws['!cols'] = colWidths;

  // Tidak ada styling bold/border di SheetJS community edition

  // Buat workbook dan simpan file
  const wb = XLSX.utils.book_new();
  wb.Sheets['Daftar Peserta'] = ws;
  wb.SheetNames.push('Daftar Peserta');
  XLSX.writeFile(wb, filename);
}


export async function exportParticipantsToPDF(
  _columns?: string[],
  filename = 'Daftar Peserta Welcoming College 2025.pdf'
) {
  const baseUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_BASE_URL || '' : '';
  let page = 1;
  const perPage = 100;
  let allParticipants: Participant[] = [];
  let totalPages = 1;
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch all pages
  do {
    const res = await fetch(`${baseUrl}/api/participants?page=${page}&limit=${perPage}`, { headers });
    const result = await res.json();
    const participants = result.data?.participants || [];
    allParticipants = allParticipants.concat(participants);
    totalPages = result.data?.pagination?.total_pages || 1;
    page++;
  } while (page <= totalPages);

  // Sort by created_at ascending
  allParticipants.sort((a: Participant, b: Participant) => {
    const tA = a.created_at ? new Date(a.created_at as string).getTime() : 0;
    const tB = b.created_at ? new Date(b.created_at as string).getTime() : 0;
    return tA - tB;
  });
  const data = allParticipants.map(mapParticipantExport);

  const doc = new jsPDF({ orientation: 'landscape' });
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(18);
  doc.text('Daftar Peserta Youth Welcoming College 2025', pageWidth / 2, 18, { align: 'center' });
  autoTable(doc, {
    startY: 36,
    head: [EXPORT_COLUMNS],
    body: data.map((row: Record<string, string>) => EXPORT_COLUMNS.map((col: string) => row[col] || '')),
    styles: {
      lineWidth: 0.5,
      lineColor: [44, 62, 80],
      cellPadding: 3,
      fontSize: 10,
      halign: 'center',
      valign: 'middle',
      cellWidth: 'auto',
      minCellHeight: 8,
      fillColor: [255, 255, 255],
      textColor: [44, 62, 80],
    },
    headStyles: {
      fillColor: [236, 240, 241],
      textColor: [44, 62, 80],
      fontStyle: 'bold',
      lineWidth: 0.5,
    },
    tableLineWidth: 0.5,
    tableLineColor: [44, 62, 80],
    theme: 'grid',
    didDrawPage: () => {
      if (doc.getCurrentPageInfo().pageNumber === 1) {
        doc.setFontSize(18);
        doc.text('Daftar Peserta Youth Welcoming College 2025', pageWidth / 2, 18, { align: 'center' });
      }
    },
    showHead: 'firstPage',
  });
  const pageCount = doc.getNumberOfPages();
  doc.setPage(pageCount);
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(11);
  doc.text('Presented by Youth Multiply', pageWidth / 2, pageHeight - 10, { align: 'center' });
  doc.save(filename);
}
