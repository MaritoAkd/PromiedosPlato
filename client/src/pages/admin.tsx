import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoginForm from "@/components/admin/login-form";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default function Admin() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('adminToken'));

  const { data: user } = useQuery({
    queryKey: ['admin', 'user'],
    queryFn: () => {
      if (!token) return null;
      // Decode JWT token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
      } catch {
        return null;
      }
    },
    enabled: !!token,
  });

  if (!token || !user?.isAdmin) {
    return <LoginForm onLogin={setToken} />;
  }

  return <AdminDashboard onLogout={() => {
    setToken(null);
    localStorage.removeItem('adminToken');
  }} />;
}
