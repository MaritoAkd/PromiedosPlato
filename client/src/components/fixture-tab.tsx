import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Phase, MatchWithTeams, Group, GroupStandingWithTeam } from "@shared/schema";

export default function FixtureTab() {
  const [currentPhase, setCurrentPhase] = useState("groups");

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
        <div className="mb-4 flex items-center justify-center">
          <div className="flex">
            <button 
              className={`px-3 py-2 text-sm font-bold border-none ${currentPhase === 'groups' ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={() => showPhase('groups')}
              data-testid="phase-groups"
            >
              Fase de Grupos
            </button>
            <button 
              className={`px-3 py-2 text-sm font-bold border-none ml-1 ${currentPhase === 'brackets' ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={() => showPhase('brackets')}
              data-testid="phase-brackets"
            >
              Cuadro de Eliminatorias
            </button>
          </div>
        </div>

        {/* Bracket Display - Nuevo cuadro estilo Promiedos */}
        {currentPhase === "brackets" && (
          <div className="bracket-container" data-testid="tournament-bracket">
            <div className="bg-white border border-gray-300 p-4">
              <h4 className="font-bold mb-4 text-sm text-center bg-blue-600 text-white p-2">CUADRO DE ELIMINATORIAS</h4>
              
              {/* Cuadro completo estilo Promiedos */}
              <div className="w-full">
                <div className="grid grid-cols-7 gap-2 items-center text-xs">
                  
                  {/* CUARTOS IZQUIERDA */}
                  <div className="space-y-4">
                    <div className="text-center font-bold mb-2">CUARTOS</div>
                    
                    {/* Cuarto 1 */}
                    <div className="border border-gray-400 bg-gray-50 p-1">
                      <div className="text-xs text-center font-bold mb-1 bg-gray-200 p-1">GRUPO A-1° VS GRUPO D-2°</div>
                      <div className="flex justify-between border-b border-gray-300 p-1">
                        <span>TBD (A1)</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between p-1">
                        <span>TBD (D2)</span>
                        <span>-</span>
                      </div>
                    </div>
                    
                    {/* Cuarto 2 */}
                    <div className="border border-gray-400 bg-gray-50 p-1 mt-8">
                      <div className="text-xs text-center font-bold mb-1 bg-gray-200 p-1">GRUPO B-1° VS GRUPO C-2°</div>
                      <div className="flex justify-between border-b border-gray-300 p-1">
                        <span>TBD (B1)</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between p-1">
                        <span>TBD (C2)</span>
                        <span>-</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* CONECTORES IZQUIERDA */}
                  <div className="flex flex-col items-center h-full justify-center">
                    <div className="border-l-2 border-gray-400 h-6"></div>
                    <div className="border-b-2 border-gray-400 w-full"></div>
                    <div className="border-l-2 border-gray-400 h-12"></div>
                    <div className="border-b-2 border-gray-400 w-full"></div>
                    <div className="border-l-2 border-gray-400 h-6"></div>
                  </div>
                  
                  {/* SEMIFINAL IZQUIERDA */}
                  <div className="flex flex-col justify-center">
                    <div className="text-center font-bold mb-2">SEMIS</div>
                    <div className="border border-gray-400 bg-yellow-50 p-1">
                      <div className="text-xs text-center font-bold mb-1 bg-yellow-200 p-1">GANADOR C1 VS GANADOR C2</div>
                      <div className="flex justify-between border-b border-gray-300 p-1">
                        <span>TBD</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between p-1">
                        <span>TBD</span>
                        <span>-</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* CONECTOR CENTRAL */}
                  <div className="flex flex-col items-center h-full justify-center">
                    <div className="border-l-2 border-gray-400 h-8"></div>
                    <div className="border-b-2 border-gray-400 w-full"></div>
                    <div className="border-l-2 border-gray-400 h-8"></div>
                  </div>
                  
                  {/* FINAL */}
                  <div className="flex flex-col justify-center">
                    <div className="text-center font-bold mb-2">FINAL</div>
                    <div className="border border-gray-400 bg-green-50 p-2">
                      <div className="text-xs text-center font-bold mb-1 bg-green-200 p-1">GANADOR S1 VS GANADOR S2</div>
                      <div className="flex justify-between border-b border-gray-300 p-1">
                        <span>TBD</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between p-1">
                        <span>TBD</span>
                        <span>-</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* CONECTOR DERECHA */}
                  <div className="flex flex-col items-center h-full justify-center">
                    <div className="border-r-2 border-gray-400 h-8"></div>
                    <div className="border-b-2 border-gray-400 w-full"></div>
                    <div className="border-r-2 border-gray-400 h-8"></div>
                  </div>
                  
                  {/* SEMIFINAL DERECHA */}
                  <div className="flex flex-col justify-center">
                    <div className="border border-gray-400 bg-yellow-50 p-1">
                      <div className="text-xs text-center font-bold mb-1 bg-yellow-200 p-1">GANADOR C3 VS GANADOR C4</div>
                      <div className="flex justify-between border-b border-gray-300 p-1">
                        <span>TBD</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between p-1">
                        <span>TBD</span>
                        <span>-</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CUARTOS DERECHA */}
                <div className="grid grid-cols-7 gap-2 items-center text-xs mt-4">
                  <div></div><div></div><div></div><div></div><div></div>
                  
                  {/* CONECTORES DERECHA */}
                  <div className="flex flex-col items-center h-full justify-center">
                    <div className="border-r-2 border-gray-400 h-6"></div>
                    <div className="border-b-2 border-gray-400 w-full"></div>
                    <div className="border-r-2 border-gray-400 h-12"></div>
                    <div className="border-b-2 border-gray-400 w-full"></div>
                    <div className="border-r-2 border-gray-400 h-6"></div>
                  </div>
                  
                  {/* CUARTOS DERECHA */}
                  <div className="space-y-4">
                    {/* Cuarto 3 */}
                    <div className="border border-gray-400 bg-gray-50 p-1">
                      <div className="text-xs text-center font-bold mb-1 bg-gray-200 p-1">GRUPO A-2° VS GRUPO C-1°</div>
                      <div className="flex justify-between border-b border-gray-300 p-1">
                        <span>TBD (A2)</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between p-1">
                        <span>TBD (C1)</span>
                        <span>-</span>
                      </div>
                    </div>
                    
                    {/* Cuarto 4 */}
                    <div className="border border-gray-400 bg-gray-50 p-1 mt-8">
                      <div className="text-xs text-center font-bold mb-1 bg-gray-200 p-1">GRUPO B-2° VS GRUPO D-1°</div>
                      <div className="flex justify-between border-b border-gray-300 p-1">
                        <span>TBD (B2)</span>
                        <span>-</span>
                      </div>
                      <div className="flex justify-between p-1">
                        <span>TBD (D1)</span>
                        <span>-</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Group Tables - Solo mostrar en fase de grupos */}
        {currentPhase === "groups" && (
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
        )}
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
