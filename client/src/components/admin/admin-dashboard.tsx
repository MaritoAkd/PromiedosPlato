import { useState } from "react";
import TeamManagement from "./team-management.tsx";
import MatchManagement from "./match-management.tsx";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"teams" | "matches">("teams");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold text-gray-900"
              data-testid="admin-title"
            >
              Panel de Administración - Copa Libertadores de Plato
            </h1>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              data-testid="logout-button"
            >
              Cerrar Sesión
            </button>
          </div>

          <div className="flex space-x-6 mt-4">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "teams"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("teams")}
              data-testid="tab-teams"
            >
              Gestionar Equipos
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "matches"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("matches")}
              data-testid="tab-matches"
            >
              Gestionar Partidos
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "teams" && <TeamManagement />}
        {activeTab === "matches" && <MatchManagement />}
      </div>
    </div>
  );
}
