import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamSchema } from "@shared/schema";
import type { TeamWithCountry, Country, InsertTeam } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";

export default function TeamManagement() {
  const [editingTeam, setEditingTeam] = useState<TeamWithCountry | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teams } = useQuery({
    queryKey: ['/api/teams'],
  });

  const { data: countries } = useQuery({
    queryKey: ['/api/countries'],
  });

  const form = useForm<InsertTeam>({
    resolver: zodResolver(insertTeamSchema),
    defaultValues: {
      name: "",
      shortName: "",
      countryId: "",
      logoUrl: "",
      nickname: "",
      founded: "",
      stadium: "",
      city: "",
    },
  });

  const createTeamMutation = useMutation({
    mutationFn: async (data: InsertTeam) => {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest('POST', '/api/teams', data, {
        Authorization: `Bearer ${token}`
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      form.reset();
      toast({ title: "Equipo creado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al crear equipo", variant: "destructive" });
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTeam> }) => {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest('PUT', `/api/teams/${id}`, data, {
        Authorization: `Bearer ${token}`
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      setEditingTeam(null);
      form.reset();
      toast({ title: "Equipo actualizado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al actualizar equipo", variant: "destructive" });
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem('adminToken');
      await apiRequest('DELETE', `/api/teams/${id}`, undefined, {
        Authorization: `Bearer ${token}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({ title: "Equipo eliminado exitosamente" });
    },
    onError: () => {
      toast({ title: "Error al eliminar equipo", variant: "destructive" });
    },
  });

  const onSubmit = (data: InsertTeam) => {
    if (editingTeam) {
      updateTeamMutation.mutate({ id: editingTeam.id, data });
    } else {
      createTeamMutation.mutate(data);
    }
  };

  const startEdit = (team: TeamWithCountry) => {
    setEditingTeam(team);
    form.reset({
      name: team.name,
      shortName: team.shortName,
      countryId: team.countryId,
      logoUrl: team.logoUrl || "",
      nickname: team.nickname || "",
      founded: team.founded || "",
      stadium: team.stadium || "",
      city: team.city || "",
    });
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle data-testid="team-form-title">
            {editingTeam ? "Editar Equipo" : "Crear Nuevo Equipo"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  data-testid="team-name-input"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="shortName">Nombre Corto</Label>
                <Input
                  id="shortName"
                  {...form.register("shortName")}
                  data-testid="team-short-name-input"
                />
                {form.formState.errors.shortName && (
                  <p className="text-sm text-red-600">{form.formState.errors.shortName.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="countryId">País</Label>
                <Select onValueChange={(value) => form.setValue("countryId", value)}>
                  <SelectTrigger data-testid="team-country-select">
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries?.map((country: Country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.countryId && (
                  <p className="text-sm text-red-600">{form.formState.errors.countryId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="logoUrl">URL del Logo</Label>
                <Input
                  id="logoUrl"
                  {...form.register("logoUrl")}
                  data-testid="team-logo-input"
                />
              </div>

              <div>
                <Label htmlFor="nickname">Apodo</Label>
                <Input
                  id="nickname"
                  {...form.register("nickname")}
                  data-testid="team-nickname-input"
                />
              </div>

              <div>
                <Label htmlFor="founded">Fundación</Label>
                <Input
                  id="founded"
                  {...form.register("founded")}
                  data-testid="team-founded-input"
                />
              </div>

              <div>
                <Label htmlFor="stadium">Estadio</Label>
                <Input
                  id="stadium"
                  {...form.register("stadium")}
                  data-testid="team-stadium-input"
                />
              </div>

              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  data-testid="team-city-input"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                type="submit" 
                disabled={createTeamMutation.isPending || updateTeamMutation.isPending}
                data-testid="team-submit-button"
              >
                {editingTeam ? "Actualizar" : "Crear"} Equipo
              </Button>
              {editingTeam && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={cancelEdit}
                  data-testid="team-cancel-button"
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
          <CardTitle data-testid="teams-list-title">Equipos Existentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">Nombre</th>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">Nombre Corto</th>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">País</th>
                  <th className="bg-gray-100 border border-gray-300 p-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {teams?.map((team: TeamWithCountry) => (
                  <tr key={team.id} className="hover:bg-gray-50" data-testid={`team-row-${team.id}`}>
                    <td className="border border-gray-300 p-2">{team.name}</td>
                    <td className="border border-gray-300 p-2">{team.shortName}</td>
                    <td className="border border-gray-300 p-2">{team.country.name}</td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(team)}
                        data-testid={`edit-team-${team.id}`}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteTeamMutation.mutate(team.id)}
                        disabled={deleteTeamMutation.isPending}
                        data-testid={`delete-team-${team.id}`}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={4} className="border border-gray-300 p-4 text-center text-gray-500">
                      No hay equipos registrados
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
