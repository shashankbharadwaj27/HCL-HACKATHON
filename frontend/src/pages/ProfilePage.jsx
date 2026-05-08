import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  console.log("User data in ProfilePage:", user);

  const handle = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  console.l
  const submit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-200 mb-8 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-semibold mb-8">My Profile</h1>

        {/* Profile Header */}
        <div className="bg-stone-900 border border-stone-800 rounded-lg p-8 mb-8">
          <div className="flex items-start gap-8 mb-8">
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-amber-400 flex items-center justify-center text-stone-950 font-bold text-4xl shrink-0">
                {getInitials(user?.name)}
              </div>
              <button className="text-amber-400 hover:text-amber-300 text-sm transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload photo
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{user?.name}</h2>
              <p className="text-stone-400 mb-6">{user?.email}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-stone-500">Role</p>
                  <p className="text-stone-100 font-semibold capitalize">{user?.roles === "ROLE_CUSTOMER"?"CUSTOMER" : "OWNER"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stone-500">Phone</p>
                  <p className="text-stone-100 font-semibold">{user?.phone || "Not provided"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-stone-500">Member since</p>
                  <p className="text-stone-100 font-semibold">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mt-6 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-md px-6 py-2.5 transition-all duration-150 active:scale-[0.98]">
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-8 mb-8">
            <h3 className="text-lg font-semibold mb-6">Edit Profile Information</h3>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handle}
                  className="w-full bg-stone-800 border border-stone-700 text-stone-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handle}
                  disabled
                  className="w-full bg-stone-800 border border-stone-700 text-stone-300 rounded-md px-4 py-3 text-sm cursor-not-allowed"
                />
                <p className="text-stone-500 text-xs mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="text-stone-400 text-xs uppercase tracking-widest block mb-2">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handle}
                  className="w-full bg-stone-800 border border-stone-700 text-stone-100 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-md px-6 py-3 transition-all duration-150 active:scale-[0.98]">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-stone-700 hover:border-stone-600 text-stone-300 hover:text-stone-100 font-semibold text-sm rounded-md px-6 py-3 transition-all duration-150">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Additional Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Account Settings */}
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-3">
              <Link
                to="/change-password"
                className="block p-3 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 hover:text-stone-100 transition-colors">
                Change Password
              </Link>
              <button className="w-full p-3 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 hover:text-stone-100 transition-colors text-left">
                Two-Factor Authentication
              </button>
              <button className="w-full p-3 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-300 hover:text-stone-100 transition-colors text-left">
                Connected Devices
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-stone-300 text-sm">Email notifications</label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-stone-300 text-sm">Newsletter</label>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-stone-300 text-sm">Marketing emails</label>
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-red-300 mb-4">Danger Zone</h3>
          <p className="text-stone-400 text-sm mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
}
