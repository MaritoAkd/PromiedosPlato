import { useQuery } from "@tanstack/react-query";
import type { ChampionWithTeams } from "@shared/schema";

export default function ChampionsTab() {
  const { data: champions = [], isLoading } = useQuery<ChampionWithTeams[]>({
    queryKey: ['/api/champions'],
  });

  const { data: topScorers = [] } = useQuery<any[]>({
    queryKey: ['/api/stats/top-scorers'],
  });

  if (isLoading) {
    return <div className="text-center py-4">Cargando campeones...</div>;
  }

  return (
    <div>
      <h3 className="font-bold mb-4 text-sm" data-testid="champions-title">CAMPEONES</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Campeones */}
        <div>
          <h4 className="font-bold text-sm mb-3" data-testid="recent-champions-title">Últimos Campeones</h4>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Año</th>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Campeón</th>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Finalista</th>
              </tr>
            </thead>
            <tbody>
              {champions && champions.length > 0 ? (
                champions.map((champion: ChampionWithTeams) => (
                  <tr key={champion.id} className="even:bg-gray-50 hover:bg-gray-100" data-testid={`champion-${champion.id}`}>
                    <td className="border border-gray-300 p-1 text-center" data-testid={`champion-year-${champion.id}`}>
                      {champion.year}
                    </td>
                    <td className="border border-gray-300 p-1 text-left pl-2" data-testid={`champion-winner-${champion.id}`}>
                      {champion.champion.name}
                    </td>
                    <td className="border border-gray-300 p-1 text-left pl-2" data-testid={`champion-runner-${champion.id}`}>
                      {champion.runnerUp?.name || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="border border-gray-300 p-2 text-center text-gray-500">
                    No hay campeones registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Ranking de Copas */}
        <div>
          <h4 className="font-bold text-sm mb-3" data-testid="titles-ranking-title">Ranking de Copas</h4>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Pos</th>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Equipo</th>
                <th className="bg-gray-100 border border-gray-300 p-1 text-center font-bold">Títulos</th>
              </tr>
            </thead>
            <tbody>
              {topScorers && topScorers.length > 0 ? (
                topScorers
                  .filter((team: any) => team.totalTitles > 0)
                  .sort((a: any, b: any) => b.totalTitles - a.totalTitles)
                  .map((team: any, index: number) => (
                    <tr key={team.team.id} className="even:bg-gray-50 hover:bg-gray-100" data-testid={`ranking-${team.team.id}`}>
                      <td className="border border-gray-300 p-1 text-center" data-testid={`ranking-pos-${team.team.id}`}>
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 p-1 text-left pl-2" data-testid={`ranking-team-${team.team.id}`}>
                        {team.team.name}
                      </td>
                      <td className="border border-gray-300 p-1 text-center" data-testid={`ranking-titles-${team.team.id}`}>
                        {team.totalTitles}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={3} className="border border-gray-300 p-2 text-center text-gray-500">
                    No hay títulos registrados
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
