'use client';

import { Instagram, Twitter, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6 mt-16 rounded-t-3xl shadow-2xl">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold">CampusClubs</h2>
          <p className="mt-3 text-sm text-gray-300">
            Discover, join, and participate in exciting student clubs and events.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-pink-500" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-blue-400" />
            </a>
            <a href="#" aria-label="GitHub">
              <Github className="w-5 h-5 hover:text-gray-400" />
            </a>
            <a href="mailto:contact@campusclubs.edu" aria-label="Mail">
              <Mail className="w-5 h-5 hover:text-red-400" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/clubs">Clubs</Link></li>
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/help">Help Center</Link></li>
            <li><Link href="/careers">Careers</Link></li>
            <li><Link href="/partners">Partners</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><Link href="/cookies">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} CampusClubs. All rights reserved.
      </div>
    </footer>
  );
}
