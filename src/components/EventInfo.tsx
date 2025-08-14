import Image from 'next/image';
import React, { useState } from 'react';

import { Modal } from '@/components/ui/modal';

export default function EventInfo() {
  const eventImage = "/images/thumbnail/banner.jpg";
  const imageExists = true;
  const [isMapOpen, setIsMapOpen] = useState(false);
  const handleOpenMap = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMapOpen(true);
  };
  const handleCloseMap = () => setIsMapOpen(false);
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-4 md:px-8 py-4 min-h-0 h-full relative w-full max-w-2xl mx-auto lg:max-w-none lg:w-full">
      {/* No background */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="w-full flex items-center justify-center mb-4 sm:mb-6">
          <div className="aspect-[16/9] w-full max-w-[420px] sm:max-w-[520px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] flex items-center justify-center group">
            {imageExists ? (
              <Image src={eventImage} alt="Event" width={1920} height={1080} className="rounded-2xl object-cover w-full h-full shadow-2xl border-4 border-white/80 group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 rounded-2xl mb-6 text-lg font-semibold">No Image</div>
            )}
          </div>
        </div>
  <h2 className="text-lg xs:text-xl sm:text-2xl md:text-2xl font-extrabold mb-1 text-center text-blue-900 dark:text-blue-200 tracking-tight">Youth Welcoming College 2025</h2>
        <div className="text-sm sm:text-base text-center text-gray-500 dark:text-gray-300 font-normal mb-2">Diselenggarakan oleh Youth Multiply</div>
        <hr className="my-3 border-1 border-gray-500 dark:border-orange-300 w-2/3 mx-auto rounded-full" />
        <div className="mb-4" />
        <div className="w-full flex flex-col gap-2 mb-4">

          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:items-start md:justify-start">
            <div className="flex-1 md:self-start">
              <span className="block font-bold text-blue-900 dark:text-blue-200 mb-1 md:mb-2">Waktu</span>
              <span className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-300 font-semibold text-xs sm:text-sm md:text-base bg-white/80 px-3 py-1 rounded-lg shadow-sm w-full md:w-auto">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M6.5 2A2.5 2.5 0 0 0 4 4.5V5h12v-.5A2.5 2.5 0 0 0 13.5 2h-7ZM16 7H4v8.5A2.5 2.5 0 0 0 6.5 18h7a2.5 2.5 0 0 0 2.5-2.5V7Zm-8 3a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" fill="#f59e42"/></svg>
                Sabtu, 6 September 2025 || 16.00 WIB
              </span>
            </div>
            <div className="flex-1">
              <span className="block font-bold text-blue-900 dark:text-blue-200 mb-1 md:mb-2">Tempat</span>
              <button
                className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-200 font-semibold text-sm sm:text-base bg-white/80 px-3 py-1 rounded-lg shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors underline w-full md:w-auto"
                onClick={handleOpenMap}
                type="button"
                aria-label="Lihat lokasi di peta"
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7Zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5Z" fill="#2563eb"/></svg>
                GBT Firman Kudus, Semarang
              </button>
              <Modal isOpen={isMapOpen} onClose={handleCloseMap} className="w-full max-w-2xl">
                <div className="p-2 sm:p-4">
                  <div className="text-lg font-bold mb-2 text-center">Lokasi: GBT Firman Kudus, Semarang</div>
                  <iframe
                    src="https://www.google.com/maps?q=GBT+Firman+Kudus+Semarang&output=embed"
                    width="100%"
                    height="350"
                    style={{ border: 0, borderRadius: '12px', width: '100%' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi GBT Firman Kudus, Semarang"
                  />
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
