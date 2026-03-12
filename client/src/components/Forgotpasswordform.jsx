import { useState } from 'react';

const ForgotPasswordForm = ({ onSubmit, isLoading, error, success, onBackToLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 flex flex-col">
      

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="bg-blue-100 rounded-2xl w-16 h-16 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <h1 className="text-center text-2xl font-bold text-gray-900 mb-1">Forgot Password?</h1>
          <p className="text-center text-gray-400 text-sm mb-7">
            Enter your email and we'll send you a reset link
          </p>

          {/* Success State */}
          {success ? (
            <div className="text-center">
              <div className="mb-4 px-4 py-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                ✅ Reset link sent! Check your email inbox.
              </div>
              <p className="text-gray-400 text-xs mb-4">Didn't receive it? Check your spam folder.</p>
              <button
                onClick={onBackToLogin}
                className="text-blue-500 font-semibold text-sm hover:text-blue-700"
              >
                ← Back to Login
              </button>
            </div>
          ) : (
            <>
              {/* Error */}
              {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-200 transition-all">
                    <span className="text-gray-400 mr-2">@</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. alex@example.com"
                      required
                      className="flex-1 text-sm text-gray-700 placeholder-gray-300 outline-none bg-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <p className="text-center mt-5">
                <button
                  onClick={onBackToLogin}
                  className="text-blue-500 text-sm font-medium hover:text-blue-700"
                >
                  ← Back to Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-10 py-5 border-t border-blue-100 bg-white/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-blue-700 font-bold text-base">🐾 PetConnect</span>
          <p className="text-gray-400 text-xs">© 2026 PetConnect Adoption Services. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="/privacy" className="text-gray-400 text-xs hover:text-gray-600">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 text-xs hover:text-gray-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordForm;