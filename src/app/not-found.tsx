'use client';

import { HomeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className={`${styles.glass} ${styles.hover_lift} transition-all duration-700 ease-out p-8 rounded-[2rem] hover:rounded-xl max-w-md w-full relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="relative z-10">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${styles.glass} flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-700`}>
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500">
              <HomeIcon className="w-10 h-10 text-white transform transition-all duration-500" />
              <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-center leading-relaxed mb-8">
            Oops! It seems like we can&apos;t find the page you&apos;re looking for. Let&apos;s get you back on track.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/"
              className="px-6 py-2 rounded-full border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
            >
              Go Back
            </Link>
            <Link 
              href="/dashboard"
              className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-500 ease-out hover:scale-105"
            >
              Dashboard
            </Link>
          </div>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] group-hover:rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-700 -z-10" />
      </div>
    </div>
  );
} 