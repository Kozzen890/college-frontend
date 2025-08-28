"use client";
import React from 'react';

import RegistrationForm from '@/components/RegistrationForm';
import Footer from '@/components/Footer';
import EventInfo from '@/components/EventInfo';
import { Toaster } from '@/lib/toast';

export default function Home() {
  // ...existing code...
  return (
    <>
      <Toaster position="top-right" />
      <main className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
        <div className="flex flex-col xl:flex-row flex-1 w-full xl:w-3/4 mx-auto items-stretch justify-center min-h-[60vh] px-2 sm:px-4 md:px-8 py-4 gap-2 xl:gap-4 overflow-x-hidden">
          {/* Info Event (left on PC) */}
          <div className="flex-1 flex flex-col justify-center items-center w-full min-w-0 lg:max-w-none">
            <EventInfo />
          </div>
          {/* Formulir Pendaftaran (right on PC) */}
          <div className="flex-1 flex flex-col justify-center items-center w-full min-w-0 lg:max-w-none">
            <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-none bg-white/95 dark:bg-[#0a2342]/90 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12 border border-orange-200 dark:border-orange-400 mx-auto lg:mx-0">
              <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#0a2342] dark:text-[#f18f01] mb-6 sm:mb-8 tracking-tight">Youth Welcoming College 2025</h3>
              <div className="text-base md:text-lg">
                <RegistrationForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
