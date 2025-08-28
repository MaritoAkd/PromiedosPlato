import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { Phase, MatchWithTeams, Group, GroupStandingWithTeam } from "@shared/schema";

export default function FixtureTab() {
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

  // Las fases se muestran todas juntas ahora

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cuadro de Eliminatoria */}
      <div className="lg:col-span-2">
        <h3 className="font-bold mb-3" data-testid="bracket-title">CUADRO</h3>
        

        {/* Cuadro Completo estilo Promiedos con scroll horizontal */}
        <div className="bg-white border border-gray-300 mb-6">
          <h4 className="font-bold text-sm text-center bg-blue-600 text-white p-2">CUADRO DE ELIMINATORIAS</h4>
          
          {/* Container con scroll horizontal */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px] p-4">
              <div className="flex items-center justify-between text-xs">
                
                {/* CUARTOS IZQUIERDA */}
                <div className="flex flex-col space-y-3">
                  <div className="text-center font-bold text-gray-600">CUARTOS</div>
                  
                  <div className="border border-gray-400 bg-gray-50 w-32">
                    <div className="text-xs text-center font-bold bg-gray-200 p-1">A1 VS D2</div>
                    <div className="flex justify-between border-b p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-400 bg-gray-50 w-32">
                    <div className="text-xs text-center font-bold bg-gray-200 p-1">B1 VS C2</div>
                    <div className="flex justify-between border-b p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                  </div>
                </div>
                
                {/* LINEAS CONECTORAS */}
                <div className="flex flex-col items-center mx-4">
                  <div className="border-l-2 border-gray-400 h-4"></div>
                  <div className="border-b-2 border-gray-400 w-8"></div>
                  <div className="border-l-2 border-gray-400 h-8"></div>
                  <div className="border-b-2 border-gray-400 w-8"></div>
                  <div className="border-l-2 border-gray-400 h-4"></div>
                </div>
                
                {/* SEMIFINALES */}
                <div className="flex flex-col space-y-3">
                  <div className="text-center font-bold text-gray-600">SEMIS</div>
                  
                  <div className="border border-gray-400 bg-yellow-50 w-32">
                    <div className="text-xs text-center font-bold bg-yellow-200 p-1">G. C1 VS G. C2</div>
                    <div className="flex justify-between border-b p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-400 bg-yellow-50 w-32">
                    <div className="text-xs text-center font-bold bg-yellow-200 p-1">G. C3 VS G. C4</div>
                    <div className="flex justify-between border-b p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                  </div>
                </div>
                
                {/* LINEA CENTRAL */}
                <div className="flex flex-col items-center mx-4">
                  <div className="border-l-2 border-gray-400 h-4"></div>
                  <div className="border-b-2 border-gray-400 w-8"></div>
                  <div className="border-l-2 border-gray-400 h-8"></div>
                  <div className="border-b-2 border-gray-400 w-8"></div>
                  <div className="border-l-2 border-gray-400 h-4"></div>
                </div>
                
                {/* FINAL */}
                <div className="flex flex-col justify-center">
                  <div className="text-center font-bold text-gray-600 mb-3">FINAL</div>
                  
                  <div className="border border-gray-400 bg-green-50 w-32">
                    <div className="text-xs text-center font-bold bg-green-200 p-1">G. S1 VS G. S2</div>
                    <div className="flex justify-between border-b p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                  </div>
                </div>
                
                {/* LINEA DERECHA */}
                <div className="flex flex-col items-center mx-4">
                  <div className="border-r-2 border-gray-400 h-4"></div>
                  <div className="border-b-2 border-gray-400 w-8"></div>
                  <div className="border-r-2 border-gray-400 h-8"></div>
                  <div className="border-b-2 border-gray-400 w-8"></div>
                  <div className="border-r-2 border-gray-400 h-4"></div>
                </div>
                
                {/* CUARTOS DERECHA */}
                <div className="flex flex-col space-y-3">
                  <div className="text-center font-bold text-gray-600">CUARTOS</div>
                  
                  <div className="border border-gray-400 bg-gray-50 w-32">
                    <div className="text-xs text-center font-bold bg-gray-200 p-1">A2 VS C1</div>
                    <div className="flex justify-between border-b p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                  </div>
                  
                  <div className="border border-gray-400 bg-gray-50 w-32">
                    <div className="text-xs text-center font-bold bg-gray-200 p-1">B2 VS D1</div>
                    <div className="flex justify-between border-b p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                    <div className="flex justify-between p-1">
                      <span className="truncate">TBD</span>
                      <span>-</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Group Tables - Siempre visible */}
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
