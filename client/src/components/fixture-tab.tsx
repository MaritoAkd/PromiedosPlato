import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Phase, MatchWithTeams, Group, GroupStandingWithTeam } from "@shared/schema";

export default function FixtureTab() {
  const [currentPhase, setCurrentPhase] = useState("quarters");

  const { data: phases } = useQuery({
    queryKey: ['/api/phases'],
  });

  const { data: matches } = useQuery({
    queryKey: ['/api/matches'],
  });

  const { data: topScorers } = useQuery({
    queryKey: ['/api/stats/top-scorers'],
  });

  const { data: topDefenders } = useQuery({
    queryKey: ['/api/stats/top-defenders'],
  });

  const phaseNames: Record<string, string> = {
    groups: "Fase de Grupos",
    quarters: "Cuartos de Final",
    semis: "Semifinales",
    final: "Final"
  };

  const quartersMatches = matches?.filter((match: MatchWithTeams) => 
    match.phase.name === "Cuartos de Final"
  ) || [];

  const nextPhase = () => {
    const phases = ["groups", "quarters", "semis", "final"];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      // Only allow if phase is unlocked (has played matches)
      if (nextPhase === "quarters" || nextPhase === "groups") {
        setCurrentPhase(nextPhase);
      }
    }
  };

  const prevPhase = () => {
    const phases = ["groups", "quarters", "semis", "final"];
    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex > 0) {
      setCurrentPhase(phases[currentIndex - 1]);
    }
  };

  const showPhase = (phase: string) => {
    setCurrentPhase(phase);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cuadro de Eliminatoria */}
      <div className="lg:col-span-2">
        <h3 className="font-bold mb-3" data-testid="bracket-title">CUADRO</h3>
        
        {/* Phase Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <span 
              className="bg-gray-100 border border-gray-300 px-2 py-1 cursor-pointer hover:bg-gray-200 text-xs"
              onClick={prevPhase}
              data-testid="phase-prev"
            >
              ←
            </span>
            <span className="mx-4 font-bold text-sm" data-testid="current-phase">
              {phaseNames[currentPhase]}
            </span>
            <span 
              className="bg-gray-100 border border-gray-300 px-2 py-1 cursor-pointer hover:bg-gray-200 text-xs"
              onClick={nextPhase}
              data-testid="phase-next"
            >
              →
            </span>
          </div>
          <div className="flex">
            <button 
              className={`px-2 py-1 text-xs border-none ${currentPhase === 'groups' ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={() => showPhase('groups')}
              data-testid="phase-groups"
            >
              Grupos
            </button>
            <button 
              className={`px-2 py-1 text-xs border-none ml-1 ${currentPhase === 'quarters' ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={() => showPhase('quarters')}
              data-testid="phase-quarters"
            >
              Cuartos
            </button>
            <button 
              className="px-2 py-1 text-xs border-none ml-1 bg-gray-400 text-white cursor-not-allowed"
              disabled
              data-testid="phase-semis"
            >
              Semis
            </button>
            <button 
              className="px-2 py-1 text-xs border-none ml-1 bg-gray-400 text-white cursor-not-allowed"
              disabled
              data-testid="phase-final"
            >
              Final
            </button>
          </div>
        </div>

        {/* Bracket Display */}
        {currentPhase === "quarters" && (
          <div data-testid="quarters-bracket">
            <h4 className="font-bold mb-2 text-sm">Cuartos de Final</h4>
            <div className="grid grid-cols-2 gap-4">
              {quartersMatches.map((match: MatchWithTeams) => (
                <div key={match.id} className="border border-gray-300 p-2 bg-white text-xs" data-testid={`match-${match.id}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <img 
                        src={match.homeTeam.country.flagUrl || `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=16&h=12`}
                        alt={match.homeTeam.country.code} 
                        className="w-4 h-3 mr-1"
                        data-testid={`home-flag-${match.id}`}
                      />
                      <span data-testid={`home-team-${match.id}`}>{match.homeTeam.shortName}</span>
                    </div>
                    <span className="font-bold" data-testid={`home-score-${match.id}`}>
                      {match.isPlayed ? match.homeScore : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={match.awayTeam.country.flagUrl || `https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=16&h=12`}
                        alt={match.awayTeam.country.code} 
                        className="w-4 h-3 mr-1"
                        data-testid={`away-flag-${match.id}`}
                      />
                      <span data-testid={`away-team-${match.id}`}>{match.awayTeam.shortName}</span>
                    </div>
                    <span className="font-bold" data-testid={`away-score-${match.id}`}>
                      {match.isPlayed ? match.awayScore : "-"}
                    </span>
                  </div>
                  {match.matchDate && (
                    <div className="text-gray-600 mt-1" data-testid={`match-date-${match.id}`}>
                      {new Date(match.matchDate).toLocaleDateString()} - {new Date(match.matchDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Group Tables */}
        <div className="mt-6">
          <h4 className="font-bold mb-3 text-sm" data-testid="groups-title">Fase de Grupos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GroupTable groupName="Grupo A" />
            <GroupTable groupName="Grupo B" />
          </div>
          
          {/* Legend */}
          <div className="mt-4 text-xs">
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-green-100 border mr-2"></div>
              <span data-testid="legend-qualified">Cuartos de Final</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-100 border mr-2"></div>
              <span data-testid="legend-sudamericana">Copa Sudamericana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Sidebar */}
      <div>
        <h4 className="font-bold mb-3 text-sm" data-testid="stats-title">ESTADÍSTICAS</h4>
        
        <div className="mb-4">
          <h5 className="font-bold text-sm mb-2" data-testid="top-scorers-title">Goles Anotados</h5>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Equipo</th>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">GF</th>
              </tr>
            </thead>
            <tbody>
              {topScorers?.slice(0, 4).map((scorer: any) => (
                <tr key={scorer.team.id} className="even:bg-gray-50 hover:bg-gray-100" data-testid={`scorer-${scorer.team.id}`}>
                  <td className="border border-gray-300 p-1 text-left pl-2">{scorer.team.shortName}</td>
                  <td className="border border-gray-300 p-1 text-center">{scorer.allTimeGoals}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={2} className="border border-gray-300 p-2 text-center text-gray-500">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div>
          <h5 className="font-bold text-sm mb-2" data-testid="top-defenders-title">Menor Goles Recibidos</h5>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Equipo</th>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Vallas</th>
              </tr>
            </thead>
            <tbody>
              {topDefenders?.slice(0, 4).map((defender: any) => (
                <tr key={defender.team.id} className="even:bg-gray-50 hover:bg-gray-100" data-testid={`defender-${defender.team.id}`}>
                  <td className="border border-gray-300 p-1 text-left pl-2">{defender.team.shortName}</td>
                  <td className="border border-gray-300 p-1 text-center">{defender.allTimeCleanSheets}</td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={2} className="border border-gray-300 p-2 text-center text-gray-500">
                    No hay datos disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GroupTable({ groupName }: { groupName: string }) {
  return (
    <div>
      <h5 className="font-bold text-sm mb-2" data-testid={`group-${groupName.toLowerCase().replace(' ', '-')}-title`}>{groupName}</h5>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">#</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Equipos</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">PTS</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">J</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">G</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">E</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">P</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">GF</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">GC</th>
            <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">DIF</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={10} className="border border-gray-300 p-2 text-center text-gray-500">
              No hay datos de grupos disponibles
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
