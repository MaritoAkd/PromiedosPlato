import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users for admin authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

// Countries for team flags
export const countries = pgTable("countries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // ISO country code
  flagUrl: text("flag_url"),
});

// Teams participating in the tournament
export const teams = pgTable("teams", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  countryId: varchar("country_id").references(() => countries.id).notNull(),
  logoUrl: text("logo_url"),
  nickname: text("nickname"),
  founded: text("founded"),
  stadium: text("stadium"),
  city: text("city"),
  golesLibcup: integer("goles_libcup").default(0).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Tournament phases (Groups, Quarters, Semis, Final)
export const phases = pgTable("phases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  isActive: boolean("is_active").default(false).notNull(),
  isUnlocked: boolean("is_unlocked").default(false).notNull(),
});

// Groups for group stage
export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Group A, B, C, etc.
  phaseId: varchar("phase_id").references(() => phases.id).notNull(),
});

// Group standings
export const groupStandings = pgTable("group_standings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupId: varchar("group_id").references(() => groups.id).notNull(),
  teamId: varchar("team_id").references(() => teams.id).notNull(),
  position: integer("position").notNull(),
  played: integer("played").default(0).notNull(),
  won: integer("won").default(0).notNull(),
  drawn: integer("drawn").default(0).notNull(),
  lost: integer("lost").default(0).notNull(),
  goalsFor: integer("goals_for").default(0).notNull(),
  goalsAgainst: integer("goals_against").default(0).notNull(),
  goalDifference: integer("goal_difference").default(0).notNull(),
  points: integer("points").default(0).notNull(),
});

// Matches
export const matches = pgTable("matches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  homeTeamId: varchar("home_team_id").references(() => teams.id).notNull(),
  awayTeamId: varchar("away_team_id").references(() => teams.id).notNull(),
  phaseId: varchar("phase_id").references(() => phases.id).notNull(),
  groupId: varchar("group_id").references(() => groups.id),
  homeScore: integer("home_score"),
  awayScore: integer("away_score"),
  isPlayed: boolean("is_played").default(false).notNull(),
  matchDate: timestamp("match_date"),
  round: text("round"), // e.g., "Quarter 1", "Semi 1", "Final"
  gameweek: integer("gameweek"), // Para fechas de grupos: 1, 2, 3
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Tournament champions history
export const champions = pgTable("champions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  year: integer("year").notNull(),
  championId: varchar("champion_id").references(() => teams.id).notNull(),
  runnerUpId: varchar("runner_up_id").references(() => teams.id),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Team statistics
export const teamStats = pgTable("team_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  teamId: varchar("team_id").references(() => teams.id).notNull(),
  allTimeGoals: integer("all_time_goals").default(0).notNull(),
  allTimeCleanSheets: integer("all_time_clean_sheets").default(0).notNull(),
  totalTitles: integer("total_titles").default(0).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Relations
export const countriesRelations = relations(countries, ({ many }) => ({
  teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  country: one(countries, {
    fields: [teams.countryId],
    references: [countries.id],
  }),
  homeMatches: many(matches, { relationName: "homeMatches" }),
  awayMatches: many(matches, { relationName: "awayMatches" }),
  groupStandings: many(groupStandings),
  championshipsWon: many(champions, { relationName: "championshipsWon" }),
  runnerUp: many(champions, { relationName: "runnerUp" }),
  stats: one(teamStats),
}));

export const phasesRelations = relations(phases, ({ many }) => ({
  matches: many(matches),
  groups: many(groups),
}));

export const groupsRelations = relations(groups, ({ one, many }) => ({
  phase: one(phases, {
    fields: [groups.phaseId],
    references: [phases.id],
  }),
  standings: many(groupStandings),
  matches: many(matches),
}));

export const groupStandingsRelations = relations(groupStandings, ({ one }) => ({
  group: one(groups, {
    fields: [groupStandings.groupId],
    references: [groups.id],
  }),
  team: one(teams, {
    fields: [groupStandings.teamId],
    references: [teams.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: "homeMatches",
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: "awayMatches",
  }),
  phase: one(phases, {
    fields: [matches.phaseId],
    references: [phases.id],
  }),
  group: one(groups, {
    fields: [matches.groupId],
    references: [groups.id],
  }),
}));

export const championsRelations = relations(champions, ({ one }) => ({
  champion: one(teams, {
    fields: [champions.championId],
    references: [teams.id],
    relationName: "championshipsWon",
  }),
  runnerUp: one(teams, {
    fields: [champions.runnerUpId],
    references: [teams.id],
    relationName: "runnerUp",
  }),
}));

export const teamStatsRelations = relations(teamStats, ({ one }) => ({
  team: one(teams, {
    fields: [teamStats.teamId],
    references: [teams.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
});

export const insertCountrySchema = createInsertSchema(countries).omit({
  id: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertPhaseSchema = createInsertSchema(phases).omit({
  id: true,
});

export const insertGroupSchema = createInsertSchema(groups).omit({
  id: true,
});

export const insertGroupStandingSchema = createInsertSchema(groupStandings).omit({
  id: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertChampionSchema = createInsertSchema(champions).omit({
  id: true,
  createdAt: true,
});

export const insertTeamStatsSchema = createInsertSchema(teamStats).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Country = typeof countries.$inferSelect;
export type InsertCountry = z.infer<typeof insertCountrySchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Phase = typeof phases.$inferSelect;
export type InsertPhase = z.infer<typeof insertPhaseSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;

export type GroupStanding = typeof groupStandings.$inferSelect;
export type InsertGroupStanding = z.infer<typeof insertGroupStandingSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type Champion = typeof champions.$inferSelect;
export type InsertChampion = z.infer<typeof insertChampionSchema>;

export type TeamStats = typeof teamStats.$inferSelect;
export type InsertTeamStats = z.infer<typeof insertTeamStatsSchema>;

// Extended types with relations
export type TeamWithCountry = Team & { country: Country };
export type MatchWithTeams = Match & { 
  homeTeam: TeamWithCountry;
  awayTeam: TeamWithCountry;
  phase: Phase;
  group?: Group;
};
export type GroupStandingWithTeam = GroupStanding & { team: TeamWithCountry };
export type ChampionWithTeams = Champion & {
  champion: TeamWithCountry;
  runnerUp?: TeamWithCountry;
};
