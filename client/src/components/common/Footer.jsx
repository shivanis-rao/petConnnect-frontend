import { PawPrint } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 px-10 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🐾</span>
            <span className="font-bold text-[#3182CE] text-sm">PetConnect</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            Connecting loving owners with their perfect companions.<br />
            Making adoption easier since 2016.
          </p>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Support</h3>
          <ul className="space-y-2.5">
            {['Contact Support', 'Privacy Policy', 'Terms of Use'].map(item => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-600 hover:text-[#3182CE] transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Connect</h3>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-sky-400 flex items-center justify-center hover:bg-sky-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-orange-400 flex items-center justify-center hover:bg-orange-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6 text-center">
        <p className="text-xs text-gray-400">PetConnect © 2024. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-1">Version 1.2.4</p>
      </div>
    </footer>
  )
}