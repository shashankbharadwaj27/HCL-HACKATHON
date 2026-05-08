import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../features/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const loading = status === "loading";

  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);

  useEffect(() => () => dispatch(clearError()), [dispatch]);

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) navigate("/home");
  };

  return (
    <div className="min-h-screen bg-stone-950 flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-stone-900 flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #f59e0b 0%, transparent 60%), radial-gradient(circle at 80% 20%, #d97706 0%, transparent 50%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-amber-400 rounded-sm flex items-center justify-center">
              <span className="text-stone-950 font-bold text-sm font-mono">BS</span>
            </div>
            <span className="text-stone-200 font-semibold tracking-widest text-xs uppercase">BookingSystem</span>
          </div>
        </div>
        <div className="relative z-10">
          <blockquote className="text-stone-300 text-3xl font-light leading-snug mb-6" style={{ fontFamily: "'Georgia', serif" }}>
            "Your getaway begins here — book your perfect stay today."
          </blockquote>
          <p className="text-stone-500 text-sm">Powered by GNI</p>
        </div>
        <div className="relative z-10 flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-1 rounded-full ${i === 0 ? "w-8 bg-amber-400" : "w-2 bg-stone-600"}`} />
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-amber-400 rounded-sm flex items-center justify-center">
              <span className="text-stone-950 font-bold text-sm font-mono">BS</span>
            </div>
            <span className="text-stone-200 font-semibold tracking-widest text-xs uppercase">BookingSystem</span>
          </div>

          <h1 className="text-stone-100 text-3xl font-light mb-1" style={{ fontFamily: "'Georgia', serif" }}>
            Welcome back
          </h1>
          <p className="text-stone-500 text-sm mb-8">Sign in to continue</p>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-md mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handle}
                autoComplete="email" required
                className="w-full bg-stone-900 border border-stone-700 text-stone-100 rounded-md px-4 py-3 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <input
                  name="password" type={show ? "text" : "password"} value={form.password} onChange={handle}
                  autoComplete="current-password" required
                  className="w-full bg-stone-900 border border-stone-700 text-stone-100 rounded-md px-4 py-3 text-sm placeholder-stone-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors pr-11"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors">
                  {show
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-semibold text-sm rounded-md py-3 transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-stone-700 border-t-transparent rounded-full animate-spin" /> Signing in…</>
                : "Sign in"
              }
            </button>
          </form>

          <p className="text-stone-500 text-sm text-center mt-8">
            No account?{" "}
            <Link to="/register" className="text-amber-400 hover:text-amber-300 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}