'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function FinalCTA() {
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative isolate overflow-hidden bg-gradient-to-r from-blue-700 via-cyan-500 to-green-400 py-20 sm:py-24 text-white  rounded-3xl shadow-2xlmd:mx-20 px-10 max-w-6xl mx-auto text-center"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Ready to Join the Best Communities?
        </h2>
        <p className="mt-4 text-lg sm:text-xl opacity-90">
          Connect with like-minded students, explore events, and unlock your full potential.
        </p>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push('/sign-up')}
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-white px-6 py-3 text-lg font-semibold text-blue-700 shadow-md hover:bg-gray-100 transition-all duration-200"
          >
            Sign Up Now
          </button>
        </div>
      </div>

      {/* Subtle Blur Glow */}
      <div
        aria-hidden="true"
        className="absolute -z-10 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
          width: '150%',
          height: '150%',
          left: '-25%',
          top: '-25%',
        }}
      />
    </motion.section>
  );
}
