import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FixtureTab from "@/components/fixture-tab";
import TeamsTab from "@/components/teams-tab";
import ChampionsTab from "@/components/champions-tab";

export default function Tournament() {
  const [activeTab, setActiveTab] = useState<"fixture" | "teams" | "champions">("fixture");

  const tabButtons = [
    { id: "fixture" as const, label: "FIXTURE Y TABLAS" },
    { id: "teams" as const, label: "EQUIPOS Y ESTADÍSTICAS" },
    { id: "champions" as const, label: "CAMPEONES" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-4">
        <h2 className="text-xl font-bold mb-2" data-testid="tournament-title">COPA LIBERTADORES DE PLATO</h2>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-300 mb-4">
          {tabButtons.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 text-sm font-bold ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "fixture" && <FixtureTab />}
        {activeTab === "teams" && <TeamsTab />}
        {activeTab === "champions" && <ChampionsTab />}
      </div>
      
      <Footer />
    </div>
  );
}
