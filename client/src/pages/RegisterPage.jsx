import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserService from "../services/UserService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // SEND OTP
  const handleSendOtp = async () => {
    if (!formData.email) return setError("Please enter your email first");
    setOtpLoading(true);
    setError("");
    try {
      await UserService.sendOtp(formData.email);
      setOtpSent(true);
      setSuccess("OTP sent to your email!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!formData.otp) return setError("Please enter the OTP");
    setVerifyLoading(true);
    setError("");
    try {
      await UserService.verifyOtp(formData.email, formData.otp);
      setOtpVerified(true);
      setSuccess("Email verified successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifyLoading(false);
    }
  };

  // REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otpVerified) return setError("Please verify your email first");
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match");
    if (formData.password.length < 8)
      return setError("Password must be at least 8 characters");

    setLoading(true);
    try {


      const res=await UserService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      const loginRes = await UserService.login({

      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      });
     

      console.log("Login response:", loginRes);
      console.log("Access token:", loginRes.data?.accessToken);

      UserService.saveSession(loginRes.data);
      localStorage.setItem("userId", loginRes.data.user.id);

      navigate("/complete-profile");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-10 flex gap-10 items-start">
        {/* Left Panel */}
        <div className="w-[480px] flex-shrink-0 rounded-2xl overflow-hidden relative h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 to-teal-600 opacity-80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop"
            alt="Pets"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
            <h2 className="text-3xl font-bold mb-3">
              Find your new best friend
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Join thousands of pet lovers who have found their perfect
              companions through PetConnect. Start your journey today.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <div className="flex -space-x-2">
                {["👤", "👥", "🧑"].map((e, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center text-xs border-2 border-white"
                  >
                    {e}
                  </div>
                ))}
              </div>
              <span className="text-sm text-white/90">
                Joined by 10k+ pet parents
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm p-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Create Your Account
          </h1>
          <p className="text-gray-500 text-sm mb-7">
            Start your journey with a new furry friend
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-lg mb-5">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="00000-00000"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>

            {/* Email + Send OTP */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="flex gap-2">
                <div className="flex-1 flex items-center border border-gray-200 rounded-lg px-4 py-2.5 gap-2 focus-within:ring-2 focus-within:ring-cyan-400">
                  <span className="text-gray-400 text-sm">✉️</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="flex-1 text-sm focus:outline-none"
                  />
                  {otpVerified && (
                    <span className="text-green-500 text-xs font-semibold">
                      ✓ Verified
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || otpVerified}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
                >
                  {otpLoading
                    ? "Sending..."
                    : otpVerified
                      ? "Verified"
                      : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP Field — shows after OTP sent */}
            {otpSent && !otpVerified && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Enter OTP
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="6-digit code"
                    maxLength={6}
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={verifyLoading}
                    className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition disabled:opacity-50"
                  >
                    {verifyLoading ? "Verifying..." : "Verify"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-cyan-500 hover:underline mt-1.5"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !otpVerified}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-500 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
