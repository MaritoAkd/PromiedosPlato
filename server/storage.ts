import { 
  users, teams, countries, phases, groups, groupStandings, matches, champions, teamStats,
  type User, type InsertUser,
  type Team, type InsertTeam, type TeamWithCountry,
  type Country, type InsertCountry,
  type Phase, type InsertPhase,
  type Group, type InsertGroup,
  type GroupStanding, type InsertGroupStanding, type GroupStandingWithTeam,
  type Match, type InsertMatch, type MatchWithTeams,
  type Champion, type InsertChampion, type ChampionWithTeams,
  type TeamStats, type InsertTeamStats
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Countries
  getAllCountries(): Promise<Country[]>;
  createCountry(country: InsertCountry): Promise<Country>;

  // Teams
  getAllTeams(): Promise<TeamWithCountry[]>;
  getTeam(id: string): Promise<TeamWithCountry | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team>;
  deleteTeam(id: string): Promise<void>;

  // Phases
  getAllPhases(): Promise<Phase[]>;
  createPhase(phase: InsertPhase): Promise<Phase>;
  updatePhase(id: string, phase: Partial<InsertPhase>): Promise<Phase>;

  // Groups
  getGroupsByPhase(phaseId: string): Promise<Group[]>;
  createGroup(group: InsertGroup): Promise<Group>;

  // Group Standings
  getGroupStandings(groupId: string): Promise<GroupStandingWithTeam[]>;
  updateGroupStanding(id: string, standing: Partial<InsertGroupStanding>): Promise<GroupStanding>;
  createGroupStanding(standing: InsertGroupStanding): Promise<GroupStanding>;
  deleteGroupStanding(id: string): Promise<void>;

  // Matches
  getAllMatches(): Promise<MatchWithTeams[]>;
  getMatchesByPhase(phaseId: string): Promise<MatchWithTeams[]>;
  getMatchesByGroup(groupId: string): Promise<MatchWithTeams[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match>;
  deleteMatch(id: string): Promise<void>;

  // Champions
  getAllChampions(): Promise<ChampionWithTeams[]>;
  createChampion(champion: InsertChampion): Promise<Champion>;

  // Team Statistics
  getTeamStats(teamId: string): Promise<TeamStats | undefined>;
  updateTeamStats(teamId: string, stats: Partial<InsertTeamStats>): Promise<TeamStats>;
  createTeamStats(stats: InsertTeamStats): Promise<TeamStats>;
  getTopGoalScorers(): Promise<(TeamStats & { team: TeamWithCountry })[]>;
  getTopDefenders(): Promise<(TeamStats & { team: TeamWithCountry })[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Countries
  async getAllCountries(): Promise<Country[]> {
    return await db.select().from(countries).orderBy(asc(countries.name));
  }

  async createCountry(country: InsertCountry): Promise<Country> {
    const [newCountry] = await db.insert(countries).values(country).returning();
    return newCountry;
  }

  // Teams
  async getAllTeams(): Promise<TeamWithCountry[]> {
    return await db.select()
      .from(teams)
      .leftJoin(countries, eq(teams.countryId, countries.id))
      .orderBy(asc(teams.name))
      .then(rows => rows.map(row => ({
        ...row.teams,
        country: row.countries!
      })));
  }

  async getTeam(id: string): Promise<TeamWithCountry | undefined> {
    const [result] = await db.select()
      .from(teams)
      .leftJoin(countries, eq(teams.countryId, countries.id))
      .where(eq(teams.id, id));
    
    if (!result) return undefined;
    
    return {
      ...result.teams,
      country: result.countries!
    };
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async updateTeam(id: string, team: Partial<InsertTeam>): Promise<Team> {
    const [updatedTeam] = await db.update(teams)
      .set(team)
      .where(eq(teams.id, id))
      .returning();
    return updatedTeam;
  }

  async deleteTeam(id: string): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  // Phases
  async getAllPhases(): Promise<Phase[]> {
    return await db.select().from(phases).orderBy(asc(phases.order));
  }

  async createPhase(phase: InsertPhase): Promise<Phase> {
    const [newPhase] = await db.insert(phases).values(phase).returning();
    return newPhase;
  }

  async updatePhase(id: string, phase: Partial<InsertPhase>): Promise<Phase> {
    const [updatedPhase] = await db.update(phases)
      .set(phase)
      .where(eq(phases.id, id))
      .returning();
    return updatedPhase;
  }

  // Groups
  async getGroupsByPhase(phaseId: string): Promise<Group[]> {
    return await db.select().from(groups)
      .where(eq(groups.phaseId, phaseId))
      .orderBy(asc(groups.name));
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const [newGroup] = await db.insert(groups).values(group).returning();
    return newGroup;
  }

  // Group Standings
  async getGroupStandings(groupId: string): Promise<GroupStandingWithTeam[]> {
    return await db.select()
      .from(groupStandings)
      .leftJoin(teams, eq(groupStandings.teamId, teams.id))
      .leftJoin(countries, eq(teams.countryId, countries.id))
      .where(eq(groupStandings.groupId, groupId))
      .orderBy(asc(groupStandings.position))
      .then(rows => rows.map(row => ({
        ...row.group_standings,
        team: {
          ...row.teams!,
          country: row.countries!
        }
      })));
  }

  async updateGroupStanding(id: string, standing: Partial<InsertGroupStanding>): Promise<GroupStanding> {
    const [updated] = await db.update(groupStandings)
      .set(standing)
      .where(eq(groupStandings.id, id))
      .returning();
    return updated;
  }

  async createGroupStanding(standing: InsertGroupStanding): Promise<GroupStanding> {
    const [newStanding] = await db.insert(groupStandings).values(standing).returning();
    return newStanding;
  }

  async deleteGroupStanding(id: string): Promise<void> {
    await db.delete(groupStandings).where(eq(groupStandings.id, id));
  }

  // Matches
  async getAllMatches(): Promise<MatchWithTeams[]> {
    return await db.select()
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .leftJoin(countries, eq(teams.countryId, countries.id))
      .leftJoin(phases, eq(matches.phaseId, phases.id))
      .leftJoin(groups, eq(matches.groupId, groups.id))
      .orderBy(desc(matches.matchDate))
      .then(async (rows) => {
        const result: MatchWithTeams[] = [];
        
        for (const row of rows) {
          // Get away team data separately
          const [awayTeamData] = await db.select()
            .from(teams)
            .leftJoin(countries, eq(teams.countryId, countries.id))
            .where(eq(teams.id, row.matches.awayTeamId));
          
          result.push({
            ...row.matches,
            homeTeam: {
              ...row.teams!,
              country: row.countries!
            },
            awayTeam: {
              ...awayTeamData.teams,
              country: awayTeamData.countries!
            },
            phase: row.phases!,
            group: row.groups || undefined
          });
        }
        
        return result;
      });
  }

  async getMatchesByPhase(phaseId: string): Promise<MatchWithTeams[]> {
    return await db.select()
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .leftJoin(countries, eq(teams.countryId, countries.id))
      .leftJoin(phases, eq(matches.phaseId, phases.id))
      .leftJoin(groups, eq(matches.groupId, groups.id))
      .where(eq(matches.phaseId, phaseId))
      .orderBy(desc(matches.matchDate))
      .then(async (rows) => {
        const result: MatchWithTeams[] = [];
        
        for (const row of rows) {
          // Get away team data separately
          const [awayTeamData] = await db.select()
            .from(teams)
            .leftJoin(countries, eq(teams.countryId, countries.id))
            .where(eq(teams.id, row.matches.awayTeamId));
          
          result.push({
            ...row.matches,
            homeTeam: {
              ...row.teams!,
              country: row.countries!
            },
            awayTeam: {
              ...awayTeamData.teams,
              country: awayTeamData.countries!
            },
            phase: row.phases!,
            group: row.groups || undefined
          });
        }
        
        return result;
      });
  }

  async getMatchesByGroup(groupId: string): Promise<MatchWithTeams[]> {
    return await db.select()
      .from(matches)
      .leftJoin(teams, eq(matches.homeTeamId, teams.id))
      .leftJoin(countries, eq(teams.countryId, countries.id))
      .leftJoin(phases, eq(matches.phaseId, phases.id))
      .leftJoin(groups, eq(matches.groupId, groups.id))
      .where(eq(matches.groupId, groupId))
      .orderBy(desc(matches.matchDate))
      .then(async (rows) => {
        const result: MatchWithTeams[] = [];
        
        for (const row of rows) {
          // Get away team data separately
          const [awayTeamData] = await db.select()
            .from(teams)
            .leftJoin(countries, eq(teams.countryId, countries.id))
            .where(eq(teams.id, row.matches.awayTeamId));
          
          result.push({
            ...row.matches,
            homeTeam: {
              ...row.teams!,
              country: row.countries!
            },
            awayTeam: {
              ...awayTeamData.teams,
              country: awayTeamData.countries!
            },
            phase: row.phases!,
            group: row.groups || undefined
          });
        }
        
        return result;
      });
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async updateMatch(id: string, match: Partial<InsertMatch>): Promise<Match> {
    const [updatedMatch] = await db.update(matches)
      .set(match)
      .where(eq(matches.id, id))
      .returning();
    return updatedMatch;
  }

  async deleteMatch(id: string): Promise<void> {
    await db.delete(matches).where(eq(matches.id, id));
  }

  // Champions
  async getAllChampions(): Promise<ChampionWithTeams[]> {
    return await db.select()
      .from(champions)
      .leftJoin(teams, eq(champions.championId, teams.id))
      .leftJoin(countries, eq(teams.countryId, countries.id))
      .orderBy(desc(champions.year))
      .then(async (rows) => {
        const result: ChampionWithTeams[] = [];
        
        for (const row of rows) {
          let runnerUp = undefined;
          if (row.champions.runnerUpId) {
            const [runnerUpData] = await db.select()
              .from(teams)
              .leftJoin(countries, eq(teams.countryId, countries.id))
              .where(eq(teams.id, row.champions.runnerUpId));
            
            runnerUp = {
              ...runnerUpData.teams,
              country: runnerUpData.countries!
            };
          }
          
          result.push({
            ...row.champions,
            champion: {
              ...row.teams!,
              country: row.countries!
            },
            runnerUp
          });
        }
        
        return result;
      });
  }

  async createChampion(champion: InsertChampion): Promise<Champion> {
    const [newChampion] = await db.insert(champions).values(champion).returning();
    return newChampion;
  }

  // Team Statistics
  async getTeamStats(teamId: string): Promise<TeamStats | undefined> {
    const [stats] = await db.select().from(teamStats).where(eq(teamStats.teamId, teamId));
    return stats || undefined;
  }

  async updateTeamStats(teamId: string, stats: Partial<InsertTeamStats>): Promise<TeamStats> {
    const [updated] = await db.update(teamStats)
      .set(stats)
      .where(eq(teamStats.teamId, teamId))
      .returning();
    return updated;
  }

  async createTeamStats(stats: InsertTeamStats): Promise<TeamStats> {
    const [newStats] = await db.insert(teamStats).values(stats).returning();
    return newStats;
  }

  async getTopGoalScorers(): Promise<any[]> {
    const results = await db.select({
      team: teams,
      country: countries,
      totalGoals: sql<number>`
        COALESCE(
          (SELECT SUM(CASE WHEN home_team_id = ${teams.id} THEN home_score ELSE 0 END) +
                  SUM(CASE WHEN away_team_id = ${teams.id} THEN away_score ELSE 0 END)
           FROM matches
           WHERE (home_team_id = ${teams.id} OR away_team_id = ${teams.id}) 
             AND is_played = true), 0
        )
      `
    })
    .from(teams)
    .leftJoin(countries, eq(teams.countryId, countries.id))
    .orderBy(sql`
      COALESCE(
        (SELECT SUM(CASE WHEN home_team_id = ${teams.id} THEN home_score ELSE 0 END) +
                SUM(CASE WHEN away_team_id = ${teams.id} THEN away_score ELSE 0 END)
         FROM matches
         WHERE (home_team_id = ${teams.id} OR away_team_id = ${teams.id}) 
           AND is_played = true), 0
      ) DESC
    `)
    .limit(8);
    
    return results.map(row => ({
      allTimeGoals: row.totalGoals,
      team: {
        ...row.team,
        country: row.country
      }
    }));
  }

  async getTopDefenders(): Promise<any[]> {
    const results = await db.select({
      team: teams,
      country: countries,
      cleanSheets: sql<number>`
        COALESCE(
          (SELECT COUNT(*)
           FROM matches
           WHERE ((home_team_id = ${teams.id} AND COALESCE(away_score, 0) = 0) OR 
                  (away_team_id = ${teams.id} AND COALESCE(home_score, 0) = 0))
             AND is_played = true), 0
        )
      `
    })
    .from(teams)
    .leftJoin(countries, eq(teams.countryId, countries.id))
    .orderBy(sql`
      COALESCE(
        (SELECT COUNT(*)
         FROM matches
         WHERE ((home_team_id = ${teams.id} AND COALESCE(away_score, 0) = 0) OR 
                (away_team_id = ${teams.id} AND COALESCE(home_score, 0) = 0))
           AND is_played = true), 0
      ) DESC
    `)
    .limit(8);
    
    return results.map(row => ({
      allTimeCleanSheets: row.cleanSheets,
      team: {
        ...row.team,
        country: row.country
      }
    }));
  }
}

export const storage = new DatabaseStorage();
