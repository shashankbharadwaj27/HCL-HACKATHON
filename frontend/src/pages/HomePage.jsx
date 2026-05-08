import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";

function getRoleLabel(roles = []) {
  const names = roles.map((r) => (typeof r === "string" ? r : r?.name ?? "")).join(", ");
  return names.replace(/ROLE_/g, "");
}

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const isAdmin = user?.roles?.some((r) => r === "ROLE_ADMIN" || r?.name === "ROLE_ADMIN");

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const stats = [
    { label: "Sessions", value: "1", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { label: "Role", value: getRoleLabel(user?.roles) || "USER", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
    { label: "Status", value: "Active", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Top nav */}
      <header className="border-b border-stone-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-amber-400 rounded-sm flex items-center justify-center">
            <span className="text-stone-950 font-bold text-xs font-mono">A</span>
          </div>
          <span className="text-stone-300 font-semibold tracking-widest text-xs uppercase">AuthKit</span>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <span className="bg-amber-400 text-stone-950 text-xs font-semibold px-2.5 py-1 rounded-sm uppercase tracking-widest">
              Admin
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-stone-500 hover:text-stone-200 text-sm transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero greeting */}
        <div className="flex items-start gap-5 mb-12">
          <div className="w-14 h-14 rounded-full bg-amber-400 flex items-center justify-center text-stone-950 font-bold text-lg shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <p className="text-stone-500 text-xs uppercase tracking-widest mb-1">Signed in as</p>
            <h1 className="text-stone-100 text-3xl font-light" style={{ fontFamily: "'Georgia', serif" }}>
              {user?.name}
            </h1>
            <p className="text-stone-500 text-sm mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="bg-stone-900 border border-stone-800 rounded-lg px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-stone-500 text-xs uppercase tracking-widest">{s.label}</span>
                <div className="w-6 h-6 text-amber-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-stone-100 font-semibold text-lg">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Profile card */}
        <div className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
            <h2 className="text-stone-200 text-sm font-medium">Profile details</h2>
            <span className="text-stone-600 text-xs">ID: {user?.id}</span>
          </div>
          <div className="divide-y divide-stone-800">
            {[
              { label: "Name", value: user?.name },
              { label: "Email", value: user?.email },
              { label: "Roles", value: getRoleLabel(user?.roles) || "USER" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-6 py-4">
                <span className="text-stone-500 text-sm">{label}</span>
                <span className="text-stone-200 text-sm font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin-only section */}
        {isAdmin && (
          <div className="bg-amber-950/40 border border-amber-700/30 rounded-lg px-6 py-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-5 h-5 text-amber-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-amber-300 text-sm font-medium">Admin area</h3>
            </div>
            <p className="text-amber-400/60 text-xs">You have elevated access. Be careful with privileged operations.</p>
          </div>
        )}
      </main>
    </div>
  );
}