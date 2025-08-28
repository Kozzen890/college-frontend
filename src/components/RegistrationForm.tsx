import React, { useState, useRef, useEffect } from 'react';
import Form from '@/components/form/Form';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import DatePicker from '@/components/form/date-picker';
import { useModal } from '@/hooks/useModal';
import { Modal } from '@/components/ui/modal';


export default function RegistrationForm() {
  const [form, setForm] = useState({
    name: '',
    place: '',
    birth_date: '',
    kampus: '',
    jurusan: '',
    angkatan: '',
    phone: '',
  });
  const [resetKey, setResetKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const { isOpen, openModal, closeModal } = useModal(false);
  const [modalMessage, setModalMessage] = useState('');
  const [eventInfo, setEventInfo] = useState<{ name?: string; date?: string; location?: string; note?: string } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(20);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handler for date picker (flatpickr returns date string in YYYY-MM-DD)
  const handleDateChange = (selectedDates: Date[], dateStr: string) => {
    setForm((prev) => ({ ...prev, birth_date: dateStr }));
  };

  // const handlePhoneChange = (val: string) => {
  //   setForm({ ...form, phone: val });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal mendaftar.');
      setModalMessage(result.message || 'Pendaftaran berhasil!');
      setEventInfo(result.event || null);
      openModal();
      // Dispatch event for admin dashboard/table refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('participant-added'));
      }
    } catch (err: unknown) {
      setEventInfo(null);
      if (err instanceof Error) setModalMessage(err.message);
      else setModalMessage('Terjadi kesalahan.');
      openModal();
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal is closed manually
  const handleModalClose = () => {
    closeModal();
    setForm({ name: '', place: '', birth_date: '', kampus: '', jurusan: '', angkatan: '', phone: '' });
    setResetKey(Date.now());
    setEventInfo(null);
    setModalMessage('');
  };

  useEffect(() => {
    if (isOpen && eventInfo) {
      setCountdown(20);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            handleModalClose();
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, eventInfo]);

  return (
    <div className="flex-1 p-8 flex flex-col justify-center">
      <h3 className="text-xl font-semibold mb-6 text-center">Pendaftaran</h3>
  <Form onSubmit={handleSubmit} className="flex flex-col gap-4 text-lg md:text-xl">
        <div>
          <Label htmlFor="name" className="text-lg md:text-xl font-semibold">
            Nama Lengkap
            <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span>
          </Label>
          <Input name="name" id="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="place" className="text-lg md:text-xl font-semibold">Tempat Lahir <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
            <Input name="place" id="place" placeholder="Tempat Lahir" value={form.place} onChange={handleChange} />
          </div>
          <div className="flex-1">
            <Label htmlFor="birth_date" className="text-lg md:text-xl font-semibold">Tanggal Lahir <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
            <DatePicker
              key={resetKey}
              id="birth_date"
              placeholder="YYYY-MM-DD"
              value={form.birth_date}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="kampus" className="text-lg md:text-xl font-semibold">Kampus <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
          <Input name="kampus" id="kampus" placeholder="Nama Kampus" value={form.kampus} onChange={handleChange} />
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="jurusan" className="text-lg md:text-xl font-semibold">Jurusan <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
            <Input name="jurusan" id="jurusan" placeholder="Jurusan" value={form.jurusan} onChange={handleChange} />
          </div>
          <div className="flex-1">
            <Label htmlFor="angkatan" className="text-lg md:text-xl font-semibold">Angkatan <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span></Label>
            <Input name="angkatan" id="angkatan" placeholder="Angkatan" value={form.angkatan} onChange={handleChange} />
          </div>
        </div>
        <div>
          <Label htmlFor="phone" className="text-lg md:text-xl font-semibold">
            Nomor HP
            <span className="text-red-500 ml-1 align-super" title="Wajib diisi">*</span>
          </Label>
          <Input name="phone" id="phone" type="text" placeholder="Nomor HP" value={form.phone} onChange={handleChange} />
        </div>
        <button type="submit" className="py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2 transition-colors" disabled={loading}>
          {loading ? 'Mengirim...' : 'Daftar Sekarang'}
        </button>
        <div className="text-sm md:text-base text-red-500 mt-2">* wajib diisi</div>
  <Modal isOpen={isOpen} onClose={handleModalClose} className="w-11/12 max-w-xl max-h-[80vh]">
    <div className="p-6 sm:p-8 flex flex-col items-center justify-center h-full w-full text-center bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-orange-300">
      {/* Animasi centang */}
      <div className="mb-6">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="mx-auto animate-bounceIn">
          <circle cx="36" cy="36" r="36" fill="#4ade80"/>
          <path d="M22 38L33 49L50 27" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="text-3xl font-extrabold mb-4 text-green-600 drop-shadow-sm tracking-tight">{modalMessage}</div>
      {eventInfo && (
        <>
          <div className="font-bold text-lg text-gray-900 mb-1">{eventInfo.name}</div>
          <div className="text-base text-gray-700 mb-1">{eventInfo.date} &bull; {eventInfo.location}</div>
          {eventInfo.note && <div className="text-sm text-gray-600 mt-2 italic border-t pt-2 w-full">{eventInfo.note}</div>}
          <div className="text-xs text-gray-400 mt-2">Youth Welcoming College 2025</div>
        </>
      )}
      <div className="flex flex-col gap-2 mt-6 w-full items-center justify-center">
        <div className="text-xs text-gray-500 mb-2">Modal akan tertutup otomatis dalam <span className="font-bold text-red-600">{countdown}</span> detik.</div>
        <button
          className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-base transition-colors shadow w-full sm:w-auto"
          onClick={handleModalClose}
        >
          Kembali
        </button>
      </div>
    </div>
  </Modal>
      </Form>
    </div>
  );
}
