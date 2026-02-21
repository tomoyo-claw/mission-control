import { mutation } from "./_generated/server";

export const seedData = mutation({
  handler: async (ctx) => {
    // Check if data already exists
    const existingUsers = await ctx.db.query("users").collect();
    if (existingUsers.length > 0) {
      return "Data already exists";
    }

    const now = Date.now();

    // Create sample users
    const user1 = await ctx.db.insert("users", {
      name: "Alice Johnson",
      email: "alice@missioncontrol.dev",
      role: "Product Manager",
      status: "online",
      avatar: "🧑‍💼",
      bio: "Leading product development and strategy",
      lastActive: now,
      joinedAt: now - (30 * 24 * 60 * 60 * 1000), // 30 days ago
    });

    const user2 = await ctx.db.insert("users", {
      name: "Bob Smith",
      email: "bob@missioncontrol.dev",
      role: "Developer",
      status: "busy",
      avatar: "👨‍💻",
      bio: "Full-stack developer specializing in React and Node.js",
      lastActive: now,
      joinedAt: now - (45 * 24 * 60 * 60 * 1000), // 45 days ago
    });

    const user3 = await ctx.db.insert("users", {
      name: "Carol Davis",
      email: "carol@missioncontrol.dev",
      role: "Designer",
      status: "away",
      avatar: "🎨",
      bio: "UI/UX designer passionate about creating beautiful experiences",
      lastActive: now - (2 * 60 * 60 * 1000), // 2 hours ago
      joinedAt: now - (60 * 24 * 60 * 60 * 1000), // 60 days ago
    });

    const user4 = await ctx.db.insert("users", {
      name: "Dave Wilson",
      email: "dave@missioncontrol.dev",
      role: "Content Creator",
      status: "online",
      avatar: "📝",
      bio: "Creating engaging content across multiple platforms",
      lastActive: now,
      joinedAt: now - (20 * 24 * 60 * 60 * 1000), // 20 days ago
    });

    // Create user metrics
    await ctx.db.insert("userMetrics", {
      userId: user1,
      tasksCompleted: 15,
      contentCreated: 8,
      weeklyGoal: 10,
      lastUpdated: now,
    });

    await ctx.db.insert("userMetrics", {
      userId: user2,
      tasksCompleted: 12,
      contentCreated: 3,
      weeklyGoal: 8,
      lastUpdated: now,
    });

    await ctx.db.insert("userMetrics", {
      userId: user3,
      tasksCompleted: 18,
      contentCreated: 12,
      weeklyGoal: 12,
      lastUpdated: now,
    });

    await ctx.db.insert("userMetrics", {
      userId: user4,
      tasksCompleted: 22,
      contentCreated: 35,
      weeklyGoal: 15,
      lastUpdated: now,
    });

    // Create sample tasks
    await ctx.db.insert("tasks", {
      title: "Design new user dashboard",
      description: "Create wireframes and mockups for the new user dashboard",
      status: "inprogress",
      priority: "high",
      assigneeId: user3,
      order: 1,
      createdAt: now - (3 * 24 * 60 * 60 * 1000),
      updatedAt: now - (1 * 24 * 60 * 60 * 1000),
    });

    await ctx.db.insert("tasks", {
      title: "Implement authentication system",
      description: "Set up user authentication with JWT and refresh tokens",
      status: "review",
      priority: "high",
      assigneeId: user2,
      order: 1,
      createdAt: now - (5 * 24 * 60 * 60 * 1000),
      updatedAt: now - (1 * 24 * 60 * 60 * 1000),
    });

    await ctx.db.insert("tasks", {
      title: "Write API documentation",
      description: "Document all REST API endpoints with examples",
      status: "backlog",
      priority: "medium",
      assigneeId: user2,
      order: 1,
      createdAt: now - (2 * 24 * 60 * 60 * 1000),
      updatedAt: now - (2 * 24 * 60 * 60 * 1000),
    });

    await ctx.db.insert("tasks", {
      title: "Plan Q2 product roadmap",
      description: "Define priorities and timelines for Q2 deliverables",
      status: "done",
      priority: "high",
      assigneeId: user1,
      order: 1,
      createdAt: now - (7 * 24 * 60 * 60 * 1000),
      updatedAt: now - (1 * 24 * 60 * 60 * 1000),
    });

    // Create sample events
    await ctx.db.insert("events", {
      title: "Team Standup",
      description: "Daily team synchronization meeting",
      startDate: now + (1 * 60 * 60 * 1000), // 1 hour from now
      endDate: now + (1.5 * 60 * 60 * 1000), // 1.5 hours from now
      category: "meeting",
      color: "#3b82f6",
      createdBy: user1,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("events", {
      title: "Design Review",
      description: "Review mockups for the new dashboard",
      startDate: now + (3 * 60 * 60 * 1000), // 3 hours from now
      endDate: now + (4 * 60 * 60 * 1000), // 4 hours from now
      category: "review",
      color: "#10b981",
      createdBy: user3,
      createdAt: now,
      updatedAt: now,
    });

    // Create sample notes
    await ctx.db.insert("notes", {
      title: "Project Architecture Notes",
      content: `# Project Architecture

## Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling

## Backend
- Convex for database and real-time updates
- Serverless functions for API

## Key Decisions
- Using server components where possible
- Implementing drag-and-drop with react-beautiful-dnd
- Dark theme as default`,
      tags: ["architecture", "frontend", "backend"],
      createdBy: user2,
      createdAt: now - (1 * 24 * 60 * 60 * 1000),
      updatedAt: now - (1 * 24 * 60 * 60 * 1000),
    });

    await ctx.db.insert("notes", {
      title: "User Research Insights",
      content: `# User Research Findings

## Key Pain Points
1. Current task management is fragmented
2. Lack of visibility into team status
3. Content pipeline is manual and error-prone

## User Needs
- Unified workspace view
- Real-time collaboration
- Visual progress tracking

## Recommendations
- Implement office screen for team awareness
- Add drag-and-drop task management
- Include activity animations for engagement`,
      tags: ["research", "users", "insights"],
      createdBy: user1,
      createdAt: now - (2 * 24 * 60 * 60 * 1000),
      updatedAt: now - (2 * 24 * 60 * 60 * 1000),
    });

    // Create sample content
    await ctx.db.insert("content", {
      title: "Mission Control Product Launch Blog Post",
      type: "blog",
      stage: "draft",
      description: "Announcing our new digital workspace platform",
      assigneeId: user4,
      dueDate: now + (7 * 24 * 60 * 60 * 1000), // 7 days from now
      order: 1,
      createdAt: now - (2 * 24 * 60 * 60 * 1000),
      updatedAt: now,
    });

    await ctx.db.insert("content", {
      title: "Feature Demo Video",
      type: "video",
      stage: "idea",
      description: "Screen recording showcasing key features",
      assigneeId: user4,
      dueDate: now + (14 * 24 * 60 * 60 * 1000), // 14 days from now
      order: 1,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("content", {
      title: "Social Media Campaign",
      type: "tweet",
      stage: "review",
      description: "Series of tweets for product launch",
      assigneeId: user4,
      dueDate: now + (3 * 24 * 60 * 60 * 1000), // 3 days from now
      order: 1,
      createdAt: now - (1 * 24 * 60 * 60 * 1000),
      updatedAt: now - (4 * 60 * 60 * 1000),
    });

    // Create agent positions for office screen
    await ctx.db.insert("agentPositions", {
      userId: user1,
      deskNumber: 1,
      x: 150,
      y: 200,
      currentActivity: "typing",
      currentTask: "Reviewing product roadmap",
      lastActivityUpdate: now,
    });

    await ctx.db.insert("agentPositions", {
      userId: user2,
      deskNumber: 2,
      x: 350,
      y: 200,
      currentActivity: "coding",
      currentTask: "Working on authentication",
      lastActivityUpdate: now - (15 * 60 * 1000),
    });

    await ctx.db.insert("agentPositions", {
      userId: user3,
      deskNumber: 3,
      x: 150,
      y: 400,
      currentActivity: "away",
      currentTask: "Design meeting",
      lastActivityUpdate: now - (2 * 60 * 60 * 1000),
    });

    await ctx.db.insert("agentPositions", {
      userId: user4,
      deskNumber: 4,
      x: 350,
      y: 400,
      currentActivity: "writing",
      currentTask: "Creating blog content",
      lastActivityUpdate: now - (10 * 60 * 1000),
    });

    return "Seed data created successfully!";
  },
});