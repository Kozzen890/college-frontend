"use client";
import React, { useState } from "react";
import { authFetch } from "@/lib/authFetch";
import Pagination from "../tables/Pagination";
import { BirthDateCell } from "./AdminParticipantsTableHelpers";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "@/lib/toast";
import { exportParticipantsToExcel, exportParticipantsToPDF } from './exportParticipants';
type ActionMenuProps = { participantId: string | number };
function ActionMenu({ participantId }: ActionMenuProps) {
  const router = useRouter();
  // Ambil setParticipants dari context props
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const [showModal, setShowModal] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await authFetch(`${baseUrl}/api/participants/${participantId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || data?.message || "Gagal menghapus peserta");
        setDeleting(false);
        setShowModal(false);
        return;
      }
      setShowSuccess(true);
      window.dispatchEvent(new CustomEvent("participant-deleted"));
      setDeleting(false);
      setTimeout(() => {
        setShowSuccess(false);
        setShowModal(false);
        toast.success('Peserta berhasil dihapus');
      }, 1500);
    } catch (err) {
      toast.error("Gagal menghapus peserta: " + err);
      setDeleting(false);
      setShowModal(false);
    }
  };
  return (
    <>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
          onClick={() => {
            const url = `/admin/participants/${String(participantId)}/edit`;
            try {
              router.push(url);
              setTimeout(() => {
                if (window.location.pathname !== url) {
                  window.location.href = url;
                }
              }, 500);
            } catch {
              window.location.href = url;
            }
          }}
        >
          Edit
        </button>
        <button
          className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
          onClick={() => setShowModal(true)}
        >
          Delete
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {showSuccess ? (
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm border border-gray-200 flex flex-col items-center justify-center">
              <div className="text-2xl font-bold mb-3 text-green-700">Berhasil Dihapus</div>
              <div className="text-base text-gray-700 mb-2">Peserta berhasil dihapus.</div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm border border-gray-200">
              <div className="mb-4 text-center">
                <div className="text-2xl font-bold mb-3 text-gray-800">Konfirmasi Hapus</div>
                <div className="text-base text-gray-700">Yakin ingin menghapus peserta ini?</div>
              </div>
              <div className="flex justify-center gap-3 mt-6">
                <button
                  className="px-4 py-1 rounded bg-gray-100 text-gray-800 font-semibold border border-gray-300 hover:bg-gray-200"
                  onClick={() => setShowModal(false)}
                  disabled={deleting}
                >Batal</button>
                <button
                  className="px-4 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 shadow"
                  onClick={handleDelete}
                  disabled={deleting}
                >{deleting ? 'Menghapus...' : 'Ya, Hapus'}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

interface Participant {
  id: number;
  name: string;
  place: string;
  birth_date: string;
  kampus: string;
  angkatan: string;
  jurusan: string;
  phone: string;
  created_at?: string;
}

// PAGE_SIZE akan mengikuti per_page dari backend

const AdminParticipantsTable = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Listener untuk reload tabel setelah delete/tambah
    const reload = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      setLoading(true);
      authFetch(`${baseUrl}/api/participants?page=${page}&limit=${perPage}&search=${encodeURIComponent(search)}`)
        .then(res => res.json())
        .then(data => {
          setParticipants(data.data?.participants || []);
          setPerPage(data.data?.pagination?.per_page || 10);
          setTotalPages(data.data?.pagination?.total_pages || 1);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    window.addEventListener("participant-deleted", reload);
    window.addEventListener("participant-added", reload);
    return () => {
      window.removeEventListener("participant-deleted", reload);
      window.removeEventListener("participant-added", reload);
    };
  }, [page, perPage, search]);

  React.useEffect(() => {
    if (!mounted) return;
    setLoading(true);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    authFetch(`${baseUrl}/api/participants?page=${page}&limit=${perPage}&search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => {
        setParticipants(data.data?.participants || []);
        setPerPage(data.data?.pagination?.per_page || 10);
        setTotalPages(data.data?.pagination?.total_pages || 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mounted, page, search, perPage]);

  // Kolom yang diekspor
  const exportColumns = [
    'No', 'Nama', 'Tempat Lahir', 'Tanggal Lahir', 'Kampus', 'Angkatan', 'Jurusan', 'No HP'
  ];
  // Data untuk export
  const exportData = participants.map((p, idx) => ({
    'No': (page - 1) * perPage + idx + 1,
    'Nama': p.name,
    'Tempat Lahir': p.place,
    'Tanggal Lahir': p.birth_date,
    'Kampus': p.kampus,
    'Angkatan': p.angkatan,
    'Jurusan': p.jurusan,
    'No HP': p.phone
  }));

  if (!mounted) return null;
  // Render tabel hanya setelah mounted (client-only)
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-8">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-lg font-bold">Daftar Peserta Youth Welcoming College 2025</h2>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            type="text"
            className="border rounded px-3 py-2 text-sm w-full md:w-64"
            placeholder="Cari nama"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg text-xs md:ml-2 mt-2 md:mt-0"
            onClick={() => exportParticipantsToExcel(exportData)}
          >Export Excel</button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-xs md:ml-2 mt-2 md:mt-0"
            onClick={() => exportParticipantsToPDF(exportColumns)}
          >Export PDF</button>
        </div>
      </div>
      {mounted && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">No</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">TTL</th>
                <th className="px-4 py-2 text-left">Kampus</th>
                <th className="px-4 py-2 text-left">Angkatan</th>
                <th className="px-4 py-2 text-left">Jurusan</th>
                <th className="px-4 py-2 text-left">No HP</th>
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
              ) : participants.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8">Tidak ada data</td></tr>
              ) : (
                [...participants]
                  .sort((a, b) => {
                    // Jika ada created_at, urutkan dari pendaftar pertama
                    if (a.created_at && b.created_at) {
                      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                    }
                    // Fallback: jika id string (UUID), urutkan by name ascending, jika number urutkan by id ascending
                    if (typeof a.id === 'string' || typeof b.id === 'string') {
                      return a.name.localeCompare(b.name);
                    }
                    return a.id - b.id;
                  })
                  .map((p, idx) => (
                    <tr key={p.id} className="border-b last:border-b-0">
                      <td className="px-4 py-2">{(page - 1) * perPage + idx + 1}</td>
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.place}, <BirthDateCell value={p.birth_date} /></td>
                      <td className="px-4 py-2">{p.kampus}</td>
                      <td className="px-4 py-2">{p.angkatan}</td>
                      <td className="px-4 py-2">{p.jurusan}</td>
                      <td className="px-4 py-2">{p.phone}</td>
                      <td className="px-4 py-2">
                        <ActionMenu participantId={p.id} />
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};


// Komponen kecil untuk format tanggal lahir

export default AdminParticipantsTable;
