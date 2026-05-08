import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/** Redirects to /home if already authenticated */
export function GuestRoute({ children }) {
  const { user, hydrated } = useSelector((s) => s.auth);
  if (!hydrated) return <Spinner />;
  return user ? <Navigate to="/home" replace /> : children;
}

/** Redirects to /login if not authenticated */
export function PrivateRoute({ children }) {
  const { user, hydrated } = useSelector((s) => s.auth);
  if (!hydrated) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
}

/** Redirects to /home if not ADMIN */
export function AdminRoute({ children }) {
  const { user, hydrated } = useSelector((s) => s.auth);
  if (!hydrated) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  const isAdmin = user.roles?.some((r) => r === "ROLE_ADMIN" || r?.name === "ROLE_ADMIN");
  return isAdmin ? children : <Navigate to="/home" replace />;
}

/** Redirects if not an owner */
export function OwnerRoute({ children }) {
  const { user, hydrated } = useSelector((s) => s.auth);
  if (!hydrated) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  const isOwner = user.role === "owner" || user.roles?.some((r) => r === "ROLE_OWNER" || r?.name === "ROLE_OWNER");
  return isOwner ? children : <Navigate to="/home" replace />;
}

/** Redirects if not a customer */
export function CustomerRoute({ children }) {
  const { user, hydrated } = useSelector((s) => s.auth);
  if (!hydrated) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  const isCustomer = user.role === "customer" || user.roles?.some((r) => r === "ROLE_CUSTOMER" || r?.name === "ROLE_CUSTOMER");
  return isCustomer ? children : <Navigate to="/home" replace />;
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}