import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMatchSchema } from "@shared/schema";
import type { MatchWithTeams, TeamWithCountry, Phase, InsertMatch } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

export default function MatchManagement() {
  const [editingMatch, setEditingMatch] = useState<MatchWithTeams | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: matches = [] } = useQuery<MatchWithTeams[]>({
    queryKey: ['/api/matches'],
  });

  const { data: teams = [] } = useQuery<TeamWithCountry[]>({
    queryKey: ['/api/teams'],
  });

  const { data: phases = [] } = useQuery<Phase[]>({
    queryKey: ['/api/phases'],
  });

  const form = useForm<InsertMatch & { homeScore?: number; awayScore?: number; isPlayed: boolean }>({
    resolver: zodResolver(insertMatchSchema.extend({
      homeScore: insertMatchSchema.shape.homeScore.optional(),
      awayScore: insertMatchSchema.shape.awayScore.optional(),
      isPlayed: insertMatchSchema.shape.isPlayed,
    })),
    defaultValues: {
      homeTeamId: "",
      awayTeamId: "",
      phaseId: "",
      groupId: "",
      homeScore: undefined,
      awayScore: undefined,
      isPlayed: false,
      matchDate: undefined,
      round: "",
    },
  });

  const createMatchMutation = useMutation({
    mutationFn: async (data: InsertMatch) => {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest('POST', '/api/matches', data, {
        Authorization: `Bearer ${token}`
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      form.reset();
      toast({ title: "Partido creado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al crear partido", variant: "destructive" });
    },
  });

  const updateMatchMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertMatch> }) => {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest('PUT', `/api/matches/${id}`, data, {
        Authorization: `Bearer ${token}`
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      setEditingMatch(null);
      form.reset();
      toast({ title: "Partido actualizado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al actualizar partido", variant: "destructive" });
    },
  });

  const deleteMatchMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('adminToken');
      await apiRequest('DELETE', `/api/matches/${id}`, undefined, {
        Authorization: `Bearer ${token}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/matches'] });
      toast({ title: "Partido eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar partido", variant: "destructive" });
    },
  });

  const onSubmit = (data: any) => {
    const matchData = {
      ...data,
      matchDate: data.matchDate || null, // usar directamente el valor del input
      homeScore: data.isPlayed ? data.homeScore : null,
      awayScore: data.isPlayed ? data.awayScore : null,
    };

    if (editingMatch) {
      updateMatchMutation.mutate({ id: editingMatch.id, data: matchData });
    } else {
      createMatchMutation.mutate(matchData);
    }
  };

  const startEdit = (match: MatchWithTeams) => {
    setEditingMatch(match);
    form.reset({
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      phaseId: match.phaseId,
      groupId: match.groupId || "",
      homeScore: match.homeScore || undefined,
      awayScore: match.awayScore || undefined,
      isPlayed: match.isPlayed,
      matchDate: match.matchDate ? new Date(match.matchDate) : undefined,
      round: match.round || "",
    });
  };

  function cancelEdit() {
    setEditingMatch(null);
    form.reset();
  }

  const isPlayed = form.watch("isPlayed");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle data-testid="match-form-title">
            {editingMatch ? "Editar Partido" : "Crear Nuevo Partido"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="homeTeamId">Equipo Local</Label>
                <Select onValueChange={(value) => form.setValue("homeTeamId", value)}>
                  <SelectTrigger data-testid="home-team-select">
                    <SelectValue placeholder="Seleccionar equipo local" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams?.map((team: TeamWithCountry) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.homeTeamId && (
                  <p className="text-sm text-red-600">{form.formState.errors.homeTeamId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="awayTeamId">Equipo Visitante</Label>
                <Select onValueChange={(value) => form.setValue("awayTeamId", value)}>
                  <SelectTrigger data-testid="away-team-select">
                    <SelectValue placeholder="Seleccionar equipo visitante" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams?.map((team: TeamWithCountry) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.awayTeamId && (
                  <p className="text-sm text-red-600">{form.formState.errors.awayTeamId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phaseId">Fase</Label>
                <Select onValueChange={(value) => form.setValue("phaseId", value)}>
                  <SelectTrigger data-testid="phase-select">
                    <SelectValue placeholder="Seleccionar fase" />
                  </SelectTrigger>
                  <SelectContent>
                    {phases?.map((phase: Phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        {phase.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.phaseId && (
                  <p className="text-sm text-red-600">{form.formState.errors.phaseId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="round">Ronda</Label>
                <Input
                  id="round"
                  {...form.register("round")}
                  placeholder="ej. Cuarto 1"
                  data-testid="match-round-input"
                />
              </div>

              <div>
                <Label htmlFor="matchDate">Fecha del Partido</Label>
                <Input
                  id="matchDate"
                  type="date"
                  {...form.register("matchDate")}
                  data-testid="match-date-input"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPlayed"
                  checked={isPlayed}
                  onCheckedChange={(checked) => form.setValue("isPlayed", !!checked)}
                  data-testid="match-played-checkbox"
                />
                <Label htmlFor="isPlayed">Partido Jugado</Label>
              </div>

              {isPlayed && (
                <>
                  <div>
                    <Label htmlFor="homeScore">Goles Equipo Local</Label>
                    <Input
                      id="homeScore"
                      type="number"
                      min="0"
                      {...form.register("homeScore", { valueAsNumber: true })}
                      data-testid="home-score-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="awayScore">Goles Equipo Visitante</Label>
                    <Input
                      id="awayScore"
                      type="number"
                      min="0"
                      {...form.register("awayScore", { valueAsNumber: true })}
                      data-testid="away-score-input"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={createMatchMutation.isPending || updateMatchMutation.isPending}
                data-testid="match-submit-button"
              >
                {editingMatch ? "Actualizar" : "Crear"} Partido
              </Button>
              {editingMatch && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelEdit}
                  data-testid="match-cancel-button"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle data-testid="matches-list-title">Partidos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">Equipos</th>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">Resultado</th>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">Fase</th>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">Fecha</th>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {matches?.map((match: MatchWithTeams) => (
                  <tr key={match.id} className="hover:bg-gray-50" data-testid={`match-row-${match.id}`}>
                    <td className="border border-gray-300 p-2">
                      {match.homeTeam.shortName} vs {match.awayTeam.shortName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {match.isPlayed ? `${match.homeScore} - ${match.awayScore}` : "Por jugar"}
                    </td>
                    <td className="border border-gray-300 p-2">{match.phase.name}</td>
                    <td className="border border-gray-300 p-2">
                      {match.matchDate ? new Date(match.matchDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(match)}
                        data-testid={`edit-match-${match.id}`}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMatchMutation.mutate(match.id)}
                        disabled={deleteMatchMutation.isPending}
                        data-testid={`delete-match-${match.id}`}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={5} className="border border-gray-300 p-4 text-center text-gray-500">
                      No hay partidos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
