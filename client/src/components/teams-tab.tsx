import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { TeamWithCountry, TeamStats } from "@shared/schema";

export default function TeamsTab() {
  const [selectedTeam, setSelectedTeam] = useState<TeamWithCountry | null>(null);

  const { data: teams = [], isLoading } = useQuery<TeamWithCountry[]>({
    queryKey: ['/api/teams'],
  });

  const { data: teamStats } = useQuery<TeamStats>({
    queryKey: ['/api/teams', selectedTeam?.id, 'stats'],
    enabled: !!selectedTeam,
  });

  if (isLoading) {
    return <div className="text-center py-4">Cargando equipos...</div>;
  }

  return (
    <div>
      <h3 className="font-bold mb-4 text-sm" data-testid="teams-title">EQUIPOS Y ESTADÍSTICAS</h3>
      
      {/* Teams Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {teams?.map((team: TeamWithCountry) => (
          <div 
            key={team.id}
            className="bg-white border border-gray-300 rounded p-3 hover:bg-gray-50 cursor-pointer text-center"
            onClick={() => setSelectedTeam(team)}
            data-testid={`team-card-${team.id}`}
          >
            <img 
              src={team.country.flagUrl || `https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=24`}
              alt={team.country.name} 
              className="w-8 h-6 mx-auto mb-2"
              data-testid={`team-flag-${team.id}`}
            />
            <div className="text-xs font-bold" data-testid={`team-name-${team.id}`}>{team.shortName}</div>
          </div>
        )) || (
          <div className="col-span-full text-center text-gray-500">
            No hay equipos disponibles
          </div>
        )}
      </div>

      {/* Team Details Panel */}
      {selectedTeam && (
        <div data-testid="team-details">
          <h4 className="font-bold mb-4 text-sm" data-testid="selected-team-name">
            {selectedTeam.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Próximos Partidos */}
            <div className="bg-white border border-gray-300 rounded p-4">
              <h4 className="font-bold text-sm mb-3" data-testid="upcoming-matches-title">Próximos Partidos</h4>
              <div className="space-y-2">
                <div className="text-xs text-gray-500 text-center">
                  No hay partidos próximos programados
                </div>
              </div>
            </div>

            {/* Últimos Resultados */}
            <div className="bg-white border border-gray-300 rounded p-4">
              <h4 className="font-bold text-sm mb-3" data-testid="recent-results-title">Últimos Resultados</h4>
              <div className="space-y-2">
                <div className="text-xs text-gray-500 text-center">
                  No hay resultados recientes disponibles
                </div>
              </div>
            </div>

            {/* Información del Club */}
            <div className="bg-white border border-gray-300 rounded p-4">
              <h4 className="font-bold text-sm mb-3" data-testid="club-info-title">Información del Club</h4>
              <div className="space-y-2 text-xs">
                {selectedTeam.nickname && (
                  <div data-testid="club-nickname">
                    <strong>Apodo:</strong> {selectedTeam.nickname}
                  </div>
                )}
                {selectedTeam.founded && (
                  <div data-testid="club-founded">
                    <strong>Fundación:</strong> {selectedTeam.founded}
                  </div>
                )}
                {selectedTeam.stadium && (
                  <div data-testid="club-stadium">
                    <strong>Estadio:</strong> {selectedTeam.stadium}
                  </div>
                )}
                {selectedTeam.city && (
                  <div data-testid="club-city">
                    <strong>Ciudad:</strong> {selectedTeam.city}, {selectedTeam.country.name}
                  </div>
                )}
                {!selectedTeam.nickname && !selectedTeam.founded && !selectedTeam.stadium && !selectedTeam.city && (
                  <div className="text-gray-500">No hay información adicional disponible</div>
                )}
              </div>
            </div>

            {/* Estadísticas Personales */}
            <div className="bg-white border border-gray-300 rounded p-4">
              <h4 className="font-bold text-sm mb-3" data-testid="team-stats-title">Estadísticas Históricas</h4>
              <div className="space-y-2 text-xs">
                {teamStats ? (
                  <>
                    <div data-testid="stats-goals">
                      <strong>Goles históricos:</strong> {teamStats.allTimeGoals}
                    </div>
                    <div data-testid="stats-cleansheets">
                      <strong>Vallas invictas:</strong> {teamStats.allTimeCleanSheets}
                    </div>
                    <div data-testid="stats-titles">
                      <strong>Títulos:</strong> {teamStats.totalTitles}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-500">No hay estadísticas disponibles</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
