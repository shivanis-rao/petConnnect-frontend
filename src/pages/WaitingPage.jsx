import { useNavigate } from "react-router-dom";

export default function WaitingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #f0f7f4 0%, #e8f4fd 50%, #f0f0fa 100%)",
      }}
    >
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-lg shadow-sm">
            🐾
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            PetConnect
          </span>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 text-sm">
          <span className="px-3 py-1 text-gray-500">Home</span>
          <span className="px-3 py-1 bg-white text-blue-600 font-semibold rounded-full shadow-sm">
            Shelter
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg border border-gray-100 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✅
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
            Registration Submitted!
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Your shelter registration has been successfully submitted for admin
            verification. You will be notified once your application is
            reviewed.
          </p>

          {/* Status Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 mb-8 text-left">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">
              What happens next?
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: "📋",
                  text: "Our admin team will review your submitted documents",
                },
                { icon: "📧", text: "You will receive an email once verified" },
                {
                  icon: "🐾",
                  text: "After approval, you account gets created and will be directed to dashbooard page",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm text-gray-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            ⏳ Status: Pending Admin Verification
          </div>

          {/* Button */}
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-8 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm text-gray-500">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">
                🐾
              </div>
              <p className="font-bold text-gray-800">PetConnect</p>
            </div>
            <p className="text-xs max-w-xs leading-relaxed">
              Connecting loving owners with their perfect companions. Making
              adoption easier since 2026.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wider">
              Support
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="hover:text-blue-600 cursor-pointer transition-colors">
                Contact Support
              </p>
              <p className="hover:text-blue-600 cursor-pointer transition-colors">
                Privacy Policy
              </p>
              <p className="hover:text-blue-600 cursor-pointer transition-colors">
                Terms of Use
              </p>
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700 mb-3 uppercase text-xs tracking-wider">
              Connect
            </p>
            <div className="flex gap-3">
              {["📘", "🐦", "📸"].map((icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gray-100 hover:bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
          PetConnect © 2026. All rights reserved. · Version 1.0.4
        </div>
      </footer>
    </div>
  );
}
