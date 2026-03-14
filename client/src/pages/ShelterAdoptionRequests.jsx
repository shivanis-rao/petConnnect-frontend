import { useState } from "react";
import Navbar from "../components/common/Navbar";
import {
  PawPrint,
  Heart,
  List,
  MessageSquare,
  BarChart2,
  LogOut,
  Plus,
} from "lucide-react";

const mockRequests = [
  {
    id: 1,
    petName: "Damy",
    petBreed: "Siberian Husky",
    petImage:
      "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=80&h=80&fit=crop",
    applicant: "John Miller",
    submitted: "March 8, 2026",
    status: "Pending",
  },
  {
    id: 2,
    petName: "Buddy",
    petBreed: "Golden Retriever",
    petImage:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=80&h=80&fit=crop",
    applicant: "Sarah Jenkins",
    submitted: "March 1, 2026",
    status: "Interview Scheduled",
  },
  {
    id: 3,
    petName: "Luna",
    petBreed: "Tabby Cat",
    petImage:
      "https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=80&h=80&fit=crop",
    applicant: "Michael Chen",
    submitted: "March 2, 2026",
    status: "Interview Scheduled",
  },
  {
    id: 4,
    petName: "Milo",
    petBreed: "Pug",
    petImage:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=80&h=80&fit=crop",
    applicant: "Emily Rodriguez",
    submitted: "Feb 27, 2026",
    status: "Home Visit",
  },
  {
    id: 5,
    petName: "Bella",
    petBreed: "Labrador",
    petImage:
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=80&h=80&fit=crop",
    applicant: "Tom Harris",
    submitted: "Feb 20, 2026",
    status: "Approved",
  },
];

const STATUS_CONFIG = {
  Pending: { badge: "bg-amber-50 text-amber-500", dot: "bg-amber-500" },
  "Interview Scheduled": {
    badge: "bg-green-50 text-green-600",
    dot: "bg-green-500",
  },
  "Home Visit": { badge: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  Approved: { badge: "bg-green-50 text-green-700", dot: "bg-green-600" },
  Rejected: { badge: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

const TABS = ["All", "Pending", "Approved", "Interview", "Home Visit"];

export default function AdoptionRequests() {
  const [activeTab, setActiveTab] = useState("All");
  const [sidebarActive, setSidebarActive] = useState("Adoption Requests");

  const filtered = mockRequests.filter((r) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return r.status === "Pending";
    if (activeTab === "Approved") return r.status === "Approved";
    if (activeTab === "Interview") return r.status === "Interview Scheduled";
    if (activeTab === "Home Visit") return r.status === "Home Visit";
    return true;
  });

  const pendingCount = mockRequests.filter(
    (r) => r.status === "Pending",
  ).length;

  const sidebarItems = [
    { label: "Adoption Requests", icon: <Heart size={16} /> },
    { label: "Your Pet Listings", icon: <List size={16} /> },
    { label: "Messages", icon: <MessageSquare size={16} /> },
    { label: "Analytics", icon: <BarChart2 size={16} /> },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f0f7f4 0%, #e8f4fd 50%, #f0f0fa 100%)",
      }}
    >
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex flex-col justify-between py-6">
          <div>
            <div className="px-4 mb-6">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
                <Plus size={16} /> Add Pet
              </button>
            </div>

            {sidebarItems.map(({ label, icon }) => {
              const isActive = sidebarActive === label;

              return (
                <button
                  key={label}
                  onClick={() => setSidebarActive(label)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium border-l-[3px] transition-all
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-blue-600"
                      : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <span
                    className={`p-1 rounded-md ${
                      isActive ? "bg-blue-100 text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {icon}
                  </span>

                  {label}

                  {label === "Adoption Requests" && pendingCount > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button className="flex items-center gap-2 px-5 py-3 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Manage your shelter with ease
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Welcome back, City Shelter! Here's what needs your attention
              today.
            </p>
          </div>

          {/* Requests Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-7">
            {/* Card Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <h2 className="text-lg font-bold text-gray-900">
                Adoption Requests
              </h2>

              {pendingCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-all
                    ${
                      activeTab === tab
                        ? "text-blue-600 border-blue-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div
              className="grid items-center gap-6 px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50 rounded-lg"
              style={{ gridTemplateColumns: "2fr 2fr 2fr 2fr auto" }}
            >
              <span>Pet Name</span>
              <span>Applicant</span>
              <span>Submitted</span>
              <span>Status</span>
              <span></span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                No adoption requests found.
              </div>
            ) : (
              filtered.map((req) => {
                const s = STATUS_CONFIG[req.status] || STATUS_CONFIG.Pending;

                return (
                  <div
                    key={req.id}
                    className="grid items-center gap-6 px-6 py-4 border-t border-gray-100 hover:bg-blue-50/40 transition-all"
                    style={{ gridTemplateColumns: "2.5fr 2fr 2fr 2fr auto" }}
                  >
                    {/* Pet */}
                    <div className="flex items-center gap-3">
                      <img
                        src={req.petImage}
                        alt={req.petName}
                        className="w-11 h-11 rounded-lg object-cover"
                      />

                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {req.petName}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {req.petBreed}
                        </div>
                      </div>
                    </div>

                    {/* Applicant */}
                    <div className="text-sm text-gray-700">{req.applicant}</div>

                    {/* Date */}
                    <div className="text-sm text-gray-500">{req.submitted}</div>

                    {/* Status */}
                    <div>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {req.status}
                      </span>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-12 py-8 mt-10">
        <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-base text-blue-600 mb-2">
              <PawPrint size={18} /> PetConnect
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">
              Connecting loving owners with their perfect companions. Making
              adoption easier since 2016.
            </p>
          </div>

          <div>
            <div className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
              Support
            </div>

            {["Contact Support", "Privacy Policy", "Terms of Use"].map((l) => (
              <a
                key={l}
                href="#"
                className="block text-gray-500 hover:text-gray-700 text-sm mb-1.5 transition-colors"
              >
                {l}
              </a>
            ))}
          </div>

          <div>
            <div className="font-semibold text-gray-700 text-xs uppercase tracking-wide mb-3">
              Connect
            </div>

            <div className="flex gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                f
              </div>

              <div className="w-9 h-9 rounded-full bg-sky-400 flex items-center justify-center text-white">
                𝕏
              </div>

              <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white">
                ▶
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400">
          PetConnect © 2024. All rights reserved. · Version 1.2.4
        </div>
      </footer>
    </div>
  );
}
