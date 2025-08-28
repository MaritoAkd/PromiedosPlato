import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Phase, MatchWithTeams, Group, GroupStandingWithTeam } from "@shared/schema";

export default function FixtureTab() {
  const [currentPhase, setCurrentPhase] = useState("quarters");

  const { data: phases = [] } = useQuery<Phase[]>({
    queryKey: ['/api/phases'],
  });

  const { data: matches = [] } = useQuery<MatchWithTeams[]>({
    queryKey: ['/api/matches'],
  });

  const { data: topScorers = [] } = useQuery<any[]>({
    queryKey: ['/api/stats/top-scorers'],
  });

  const { data: topDefenders = [] } = useQuery<any[]>({
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

  const semisMatches = matches?.filter((match: MatchWithTeams) => 
    match.phase.name === "Semifinales"
  ) || [];

  const finalMatches = matches?.filter((match: MatchWithTeams) => 
    match.phase.name === "Final"
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
        {(currentPhase === "quarters" || currentPhase === "semis" || currentPhase === "final") && (
          <div className="bracket-container" data-testid="tournament-bracket">
            {/* Tournament Bracket - Promiedos Style */}
            <div className="bg-white border border-gray-300 p-4">
              <h4 className="font-bold mb-4 text-sm text-center bg-blue-600 text-white p-2">CUADRO DE ELIMINATORIAS</h4>
              
              <div className="bracket-grid" style={{display: 'grid', gridTemplateColumns: '1fr 80px 1fr 80px 1fr', gap: '10px', alignItems: 'center'}}>
                
                {/* CUARTOS - Columna izquierda */}
                <div className="quarters-left">
                  <div className="text-xs font-bold mb-2 text-center">CUARTOS DE FINAL</div>
                  {quartersMatches.slice(0, 2).map((match: MatchWithTeams, idx: number) => (
                    <div key={match.id} className="match-box border border-gray-400 mb-2 bg-gray-50" data-testid={`quarter-${match.id}`}>
                      <div className="match-team flex justify-between items-center p-1 text-xs border-b border-gray-300">
                        <div className="flex items-center">
                          <img src={match.homeTeam.country.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.homeTeam.country.code} className="w-4 h-3 mr-1" />
                          <span className={match.isPlayed && match.homeScore! > match.awayScore! ? 'font-bold' : ''}>{match.homeTeam.shortName}</span>
                        </div>
                        <span className="font-bold">{match.isPlayed ? match.homeScore : '-'}</span>
                      </div>
                      <div className="match-team flex justify-between items-center p-1 text-xs">
                        <div className="flex items-center">
                          <img src={match.awayTeam.country.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.awayTeam.country.code} className="w-4 h-3 mr-1" />
                          <span className={match.isPlayed && match.awayScore! > match.homeScore! ? 'font-bold' : ''}>{match.awayTeam.shortName}</span>
                        </div>
                        <span className="font-bold">{match.isPlayed ? match.awayScore : '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SEMIFINAL - Línea izquierda */}
                <div className="connector-left flex flex-col items-center">
                  <div className="border-l-2 border-gray-400 h-8"></div>
                  <div className="border-b-2 border-gray-400 w-full"></div>
                  <div className="border-l-2 border-gray-400 h-8"></div>
                </div>

                {/* SEMIFINALES */}
                <div className="semis-center">
                  <div className="text-xs font-bold mb-2 text-center">SEMIFINALES</div>
                  {semisMatches.slice(0, 1).map((match: MatchWithTeams) => (
                    <div key={match.id} className="match-box border border-gray-400 mb-8 bg-yellow-50" data-testid={`semi-${match.id}`}>
                      <div className="match-team flex justify-between items-center p-1 text-xs border-b border-gray-300">
                        <div className="flex items-center">
                          <img src={match.homeTeam?.country?.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.homeTeam?.country?.code} className="w-4 h-3 mr-1" />
                          <span className={match.isPlayed && match.homeScore! > match.awayScore! ? 'font-bold' : ''}>{match.homeTeam?.shortName || 'TBD'}</span>
                        </div>
                        <span className="font-bold">{match.isPlayed ? match.homeScore : '-'}</span>
                      </div>
                      <div className="match-team flex justify-between items-center p-1 text-xs">
                        <div className="flex items-center">
                          <img src={match.awayTeam?.country?.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.awayTeam?.country?.code} className="w-4 h-3 mr-1" />
                          <span className={match.isPlayed && match.awayScore! > match.homeScore! ? 'font-bold' : ''}>{match.awayTeam?.shortName || 'TBD'}</span>
                        </div>
                        <span className="font-bold">{match.isPlayed ? match.awayScore : '-'}</span>
                      </div>
                    </div>
                  ))}
                  
                  {semisMatches.slice(1, 2).map((match: MatchWithTeams) => (
                    <div key={match.id} className="match-box border border-gray-400 bg-yellow-50" data-testid={`semi-${match.id}`}>
                      <div className="match-team flex justify-between items-center p-1 text-xs border-b border-gray-300">
                        <div className="flex items-center">
                          <img src={match.homeTeam?.country?.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.homeTeam?.country?.code} className="w-4 h-3 mr-1" />
                          <span className={match.isPlayed && match.homeScore! > match.awayScore! ? 'font-bold' : ''}>{match.homeTeam?.shortName || 'TBD'}</span>
                        </div>
                        <span className="font-bold">{match.isPlayed ? match.homeScore : '-'}</span>
                      </div>
                      <div className="match-team flex justify-between items-center p-1 text-xs">
                        <div className="flex items-center">
                          <img src={match.awayTeam?.country?.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.awayTeam?.country?.code} className="w-4 h-3 mr-1" />
                          <span className={match.isPlayed && match.awayScore! > match.homeScore! ? 'font-bold' : ''}>{match.awayTeam?.shortName || 'TBD'}</span>
                        </div>
                        <span className="font-bold">{match.isPlayed ? match.awayScore : '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FINAL - Línea central */}
                <div className="connector-center flex flex-col items-center">
                  <div className="border-l-2 border-gray-400 h-8"></div>
                  <div className="border-b-2 border-gray-400 w-full"></div>
                  <div className="border-l-2 border-gray-400 h-8"></div>
                </div>

                {/* FINAL */}
                <div className="final-right">
                  <div className="text-xs font-bold mb-2 text-center">FINAL</div>
                  {finalMatches.map((match: MatchWithTeams) => (
                    <div key={match.id} className="match-box border border-gray-400 bg-green-50" data-testid={`final-${match.id}`} style={{marginTop: '40px'}}>
                      <div className="match-team flex justify-between items-center p-2 text-xs border-b border-gray-300">
                        <div className="flex items-center">
                          <img src={match.homeTeam?.country?.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.homeTeam?.country?.code} className="w-4 h-3 mr-1" />
                          <span className={match.isPlayed && match.homeScore! > match.awayScore! ? 'font-bold text-green-700' : ''}>{match.homeTeam?.shortName || 'TBD'}</span>
                        </div>
                        <span className="font-bold">{match.isPlayed ? match.homeScore : '-'}</span>
                      </div>
                      <div className="match-team flex justify-between items-center p-2 text-xs">
                        <div className="flex items-center">
                          <img src={match.awayTeam?.country?.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.awayTeam?.country?.code} className="w-4 h-3 mr-1" />
                          <span className={match.isPlayed && match.awayScore! > match.homeScore! ? 'font-bold text-green-700' : ''}>{match.awayTeam?.shortName || 'TBD'}</span>
                        </div>
                        <span className="font-bold">{match.isPlayed ? match.awayScore : '-'}</span>
                      </div>
                      {match.matchDate && (
                        <div className="text-center text-gray-600 p-1 text-xs bg-gray-100">
                          {new Date(match.matchDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Parte derecha - Cuartos restantes */}
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div></div> {/* Spacer */}
                  <div className="quarters-right">
                    <div className="text-xs font-bold mb-2 text-center">CUARTOS DE FINAL</div>
                    {quartersMatches.slice(2, 4).map((match: MatchWithTeams) => (
                      <div key={match.id} className="match-box border border-gray-400 mb-2 bg-gray-50" data-testid={`quarter-${match.id}`}>
                        <div className="match-team flex justify-between items-center p-1 text-xs border-b border-gray-300">
                          <div className="flex items-center">
                            <img src={match.homeTeam.country.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.homeTeam.country.code} className="w-4 h-3 mr-1" />
                            <span className={match.isPlayed && match.homeScore! > match.awayScore! ? 'font-bold' : ''}>{match.homeTeam.shortName}</span>
                          </div>
                          <span className="font-bold">{match.isPlayed ? match.homeScore : '-'}</span>
                        </div>
                        <div className="match-team flex justify-between items-center p-1 text-xs">
                          <div className="flex items-center">
                            <img src={match.awayTeam.country.flagUrl || 'https://via.placeholder.com/16x12'} alt={match.awayTeam.country.code} className="w-4 h-3 mr-1" />
                            <span className={match.isPlayed && match.awayScore! > match.homeScore! ? 'font-bold' : ''}>{match.awayTeam.shortName}</span>
                          </div>
                          <span className="font-bold">{match.isPlayed ? match.awayScore : '-'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Tables */}
        <div className="mt-6">
          <h4 className="font-bold mb-3 text-sm" data-testid="groups-title">Fase de Grupos</h4>
          <DynamicGroupTables />
          
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

function DynamicGroupTables() {
  const { data: phases = [] } = useQuery<Phase[]>({
    queryKey: ['/api/phases'],
  });

  const groupPhase = phases.find(p => p.name === "Fase de Grupos");

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: [`/api/phases/${groupPhase?.id}/groups`],
    enabled: !!groupPhase?.id,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {groups?.map((group: Group) => (
        <GroupTable key={group.id} group={group} />
      ))}
    </div>
  );
}

function GroupTable({ group }: { group: Group }) {
  const { data: standings = [] } = useQuery({
    queryKey: [`/api/groups/${group.id}/standings`],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/groups/${group.id}/standings`);
      return response.json();
    },
  });

  return (
    <div>
      <h5 className="font-bold text-sm mb-2" data-testid={`group-${group.name.toLowerCase().replace(' ', '-')}-title`}>{group.name}</h5>
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
          {standings.length > 0 ? (
            standings.map((standing: any, index: number) => (
              <tr key={standing.id} className={index < 2 ? "bg-green-50" : index < 4 ? "bg-yellow-50" : "even:bg-gray-50"}>
                <td className="border border-gray-300 p-1 text-center">{standing.position}</td>
                <td className="border border-gray-300 p-1 text-left pl-2 flex items-center">
                  <img 
                    src={standing.team.country.flagUrl || `https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=16&h=12`}
                    alt={standing.team.country.code} 
                    className="w-4 h-3 mr-1"
                  />
                  {standing.team.shortName}
                </td>
                <td className="border border-gray-300 p-1 text-center font-bold">{standing.points}</td>
                <td className="border border-gray-300 p-1 text-center">{standing.played}</td>
                <td className="border border-gray-300 p-1 text-center">{standing.won}</td>
                <td className="border border-gray-300 p-1 text-center">{standing.drawn}</td>
                <td className="border border-gray-300 p-1 text-center">{standing.lost}</td>
                <td className="border border-gray-300 p-1 text-center">{standing.goalsFor}</td>
                <td className="border border-gray-300 p-1 text-center">{standing.goalsAgainst}</td>
                <td className="border border-gray-300 p-1 text-center">{standing.goalDifference}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="border border-gray-300 p-2 text-center text-gray-500">
                Sin equipos asignados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
