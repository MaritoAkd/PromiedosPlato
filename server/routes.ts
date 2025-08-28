import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTeamSchema, insertMatchSchema, insertChampionSchema, 
  insertCountrySchema, insertPhaseSchema, insertGroupSchema, 
  insertGroupStandingSchema, insertTeamStatsSchema
} from "@shared/schema";

// Mock implementations for missing dependencies
const bcrypt = {
  compare: async (password: string, hash: string) => password === hash,
  hash: async (password: string, rounds: number) => password
};

const jwt = {
  sign: (payload: any, secret: string) => JSON.stringify(payload),
  verify: (token: string, secret: string) => JSON.parse(token)
};

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify admin token
const verifyAdmin = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const token = jwt.sign({ 
        id: user.id, 
        username: user.username, 
        isAdmin: user.isAdmin 
      }, JWT_SECRET);
      
      res.json({ token, user: { id: user.id, username: user.username, isAdmin: user.isAdmin } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Countries routes
  app.get("/api/countries", async (req, res) => {
    try {
      const countries = await storage.getAllCountries();
      res.json(countries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });

  app.post("/api/countries", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertCountrySchema.parse(req.body);
      const country = await storage.createCountry(validatedData);
      res.json(country);
    } catch (error) {
      res.status(400).json({ message: "Invalid country data" });
    }
  });

  // Teams routes
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(req.params.id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.post("/api/teams", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(validatedData);
      res.json(team);
    } catch (error) {
      res.status(400).json({ message: "Invalid team data" });
    }
  });

  app.put("/api/teams/:id", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertTeamSchema.partial().parse(req.body);
      const team = await storage.updateTeam(req.params.id, validatedData);
      res.json(team);
    } catch (error) {
      res.status(400).json({ message: "Invalid team data" });
    }
  });

  app.delete("/api/teams/:id", verifyAdmin, async (req, res) => {
    try {
      await storage.deleteTeam(req.params.id);
      res.json({ message: "Team deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team" });
    }
  });

  // Phases routes
  app.get("/api/phases", async (req, res) => {
    try {
      const phases = await storage.getAllPhases();
      res.json(phases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch phases" });
    }
  });

  app.post("/api/phases", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertPhaseSchema.parse(req.body);
      const phase = await storage.createPhase(validatedData);
      res.json(phase);
    } catch (error) {
      res.status(400).json({ message: "Invalid phase data" });
    }
  });

  app.put("/api/phases/:id", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertPhaseSchema.partial().parse(req.body);
      const phase = await storage.updatePhase(req.params.id, validatedData);
      res.json(phase);
    } catch (error) {
      res.status(400).json({ message: "Invalid phase data" });
    }
  });

  // Groups routes
  app.get("/api/phases/:phaseId/groups", async (req, res) => {
    try {
      const groups = await storage.getGroupsByPhase(req.params.phaseId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch groups" });
    }
  });

  app.post("/api/groups", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertGroupSchema.parse(req.body);
      const group = await storage.createGroup(validatedData);
      res.json(group);
    } catch (error) {
      res.status(400).json({ message: "Invalid group data" });
    }
  });

  // Group standings routes
  app.get("/api/groups/:groupId/standings", async (req, res) => {
    try {
      const standings = await storage.getGroupStandings(req.params.groupId);
      res.json(standings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group standings" });
    }
  });

  app.post("/api/standings", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertGroupStandingSchema.parse(req.body);
      const standing = await storage.createGroupStanding(validatedData);
      res.json(standing);
    } catch (error) {
      res.status(400).json({ message: "Invalid standing data" });
    }
  });

  app.put("/api/standings/:id", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertGroupStandingSchema.partial().parse(req.body);
      const standing = await storage.updateGroupStanding(req.params.id, validatedData);
      res.json(standing);
    } catch (error) {
      res.status(400).json({ message: "Invalid standing data" });
    }
  });

  // Matches routes
  app.get("/api/matches", async (req, res) => {
    try {
      const matches = await storage.getAllMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.get("/api/phases/:phaseId/matches", async (req, res) => {
    try {
      const matches = await storage.getMatchesByPhase(req.params.phaseId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.get("/api/groups/:groupId/matches", async (req, res) => {
    try {
      const matches = await storage.getMatchesByGroup(req.params.groupId);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch group matches" });
    }
  });

  app.post("/api/matches", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(validatedData);
      res.json(match);
    } catch (error) {
      res.status(400).json({ message: "Invalid match data" });
    }
  });

  app.put("/api/matches/:id", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertMatchSchema.partial().parse(req.body);
      const match = await storage.updateMatch(req.params.id, validatedData);
      res.json(match);
    } catch (error) {
      res.status(400).json({ message: "Invalid match data" });
    }
  });

  app.delete("/api/matches/:id", verifyAdmin, async (req, res) => {
    try {
      await storage.deleteMatch(req.params.id);
      res.json({ message: "Match deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete match" });
    }
  });

  // Champions routes
  app.get("/api/champions", async (req, res) => {
    try {
      const champions = await storage.getAllChampions();
      res.json(champions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch champions" });
    }
  });

  app.post("/api/champions", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertChampionSchema.parse(req.body);
      const champion = await storage.createChampion(validatedData);
      res.json(champion);
    } catch (error) {
      res.status(400).json({ message: "Invalid champion data" });
    }
  });

  // Team Statistics routes
  app.get("/api/teams/:teamId/stats", async (req, res) => {
    try {
      const stats = await storage.getTeamStats(req.params.teamId);
      if (!stats) {
        return res.status(404).json({ message: "Team stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team stats" });
    }
  });

  app.get("/api/stats/top-scorers", async (req, res) => {
    try {
      const topScorers = await storage.getTopGoalScorers();
      res.json(topScorers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top scorers" });
    }
  });

  app.get("/api/stats/top-defenders", async (req, res) => {
    try {
      const topDefenders = await storage.getTopDefenders();
      res.json(topDefenders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top defenders" });
    }
  });

  app.post("/api/teams/:teamId/stats", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertTeamStatsSchema.parse({
        ...req.body,
        teamId: req.params.teamId
      });
      const stats = await storage.createTeamStats(validatedData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Invalid stats data" });
    }
  });

  app.put("/api/teams/:teamId/stats", verifyAdmin, async (req, res) => {
    try {
      const validatedData = insertTeamStatsSchema.partial().parse(req.body);
      const stats = await storage.updateTeamStats(req.params.teamId, validatedData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Invalid stats data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
