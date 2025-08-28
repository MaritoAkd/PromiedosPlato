import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { Group, TeamWithCountry, Phase } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

interface AddTeamToGroupForm {
  groupId: string;
  teamId: string;
}

export default function GroupManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: phases = [] } = useQuery<Phase[]>({
    queryKey: ['/api/phases'],
  });

  const groupPhase = phases.find(p => p.name === "Fase de Grupos");

  const { data: groups = [] } = useQuery<Group[]>({
    queryKey: [`/api/phases/${groupPhase?.id}/groups`],
    enabled: !!groupPhase?.id,
  });

  const { data: teams = [] } = useQuery<TeamWithCountry[]>({
    queryKey: ['/api/teams'],
  });

  const form = useForm<AddTeamToGroupForm>({
    defaultValues: {
      groupId: "",
      teamId: "",
    },
  });

  const addTeamToGroupMutation = useMutation({
    mutationFn: async (data: AddTeamToGroupForm) => {
      const token = localStorage.getItem('adminToken');
      
      // Obtener el número de equipos ya en este grupo para asignar la posición
      const standingsResponse = await apiRequest('GET', `/api/groups/${data.groupId}/standings`);
      const currentStandings = await standingsResponse.json();
      const position = currentStandings.length + 1;

      const response = await apiRequest('POST', '/api/standings', {
        groupId: data.groupId,
        teamId: data.teamId,
        position: position
      }, {
        Authorization: `Bearer ${token}`
      });
      return response.json();
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
      toast({ title: "Equipo añadido al grupo exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al añadir equipo al grupo", variant: "destructive" });
    },
  });

  const onSubmit = (data: AddTeamToGroupForm) => {
    if (!data.groupId || !data.teamId) {
      toast({ title: "Debes seleccionar grupo y equipo", variant: "destructive" });
      return;
    }
    addTeamToGroupMutation.mutate(data);
  };

  // Obtener equipos que ya están asignados a grupos
  const { data: allGroupStandings = [] } = useQuery({
    queryKey: ['/api/all-group-standings'],
    queryFn: async () => {
      const promises = groups.map(async (group) => {
        const response = await apiRequest('GET', `/api/groups/${group.id}/standings`);
        return response.json();
      });
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: groups.length > 0,
  });

  const assignedTeamIds = allGroupStandings.map((standing: any) => standing.teamId);
  const availableTeams = teams.filter(team => !assignedTeamIds.includes(team.id));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Añadir Equipos a Grupos</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="groupId">Seleccionar Grupo</Label>
                <Select onValueChange={(value) => form.setValue("groupId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups?.map((group: Group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="teamId">Seleccionar Equipo</Label>
                <Select onValueChange={(value) => form.setValue("teamId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeams?.map((team: TeamWithCountry) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name} ({team.country.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={addTeamToGroupMutation.isPending}
            >
              Añadir Equipo al Grupo
            </Button>
          </form>

          {availableTeams.length === 0 && teams.length > 0 && (
            <div className="mt-4 text-green-600 bg-green-50 p-4 rounded-md">
              <p className="font-medium">✅ Todos los equipos han sido asignados a grupos</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vista de grupos actuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups?.map((group: Group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  );
}

interface GroupCardProps {
  group: Group;
}

function GroupCard({ group }: GroupCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: standings = [] } = useQuery({
    queryKey: [`/api/groups/${group.id}/standings`],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/groups/${group.id}/standings`);
      return response.json();
    },
  });

  const removeTeamMutation = useMutation({
    mutationFn: async (standingId: string) => {
      const token = localStorage.getItem('adminToken');
      await apiRequest('DELETE', `/api/standings/${standingId}`, undefined, {
        Authorization: `Bearer ${token}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/groups/${group.id}/standings`] });
      queryClient.invalidateQueries({ queryKey: ['/api/all-group-standings'] });
      toast({ title: "Equipo eliminado del grupo exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar equipo del grupo", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{group.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {standings.length > 0 ? (
          <ul className="space-y-2">
            {standings.map((standing: any) => (
              <li key={standing.id} className="flex items-center justify-between text-sm group hover:bg-gray-50 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span>{standing.team.shortName}</span>
                  <span className="text-gray-500">({standing.team.country.code})</span>
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeTeamMutation.mutate(standing.id)}
                  disabled={removeTeamMutation.isPending}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Sin equipos asignados</p>
        )}
      </CardContent>
    </Card>
  );
}
