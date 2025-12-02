// =============================================================================
// IN-MEMORY DATA STORE - Extended Dataset for Complex Query Testing
// =============================================================================

// -----------------------------------------------------------------------------
// TYPE DEFINITIONS
// -----------------------------------------------------------------------------

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  role: "admin" | "moderator" | "author" | "user" | "guest";
  status: "active" | "suspended" | "pending";
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  language: string;
  timezone: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId: string | null;
  color: string;
  icon: string;
  sortOrder: number;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  usageCount: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string;
  categoryId: string;
  tagIds: string[];
  status: "draft" | "published" | "archived" | "scheduled";
  visibility: "public" | "private" | "members";
  featuredImageUrl: string | null;
  readingTimeMinutes: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string | null;
  scheduledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  parentId: string | null; // For nested comments
  content: string;
  status: "approved" | "pending" | "spam" | "deleted";
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  userId: string;
  targetType: "post" | "comment";
  targetId: string;
  createdAt: string;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  note: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "like" | "comment" | "follow" | "mention" | "system";
  title: string;
  message: string;
  read: boolean;
  relatedPostId: string | null;
  relatedUserId: string | null;
  createdAt: string;
}

export interface Media {
  id: string;
  uploaderId: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

// -----------------------------------------------------------------------------
// DATA STORES
// -----------------------------------------------------------------------------

export const users: Map<string, User> = new Map();
export const categories: Map<string, Category> = new Map();
export const tags: Map<string, Tag> = new Map();
export const posts: Map<string, Post> = new Map();
export const comments: Map<string, Comment> = new Map();
export const likes: Map<string, Like> = new Map();
export const follows: Map<string, Follow> = new Map();
export const bookmarks: Map<string, Bookmark> = new Map();
export const notifications: Map<string, Notification> = new Map();
export const media: Map<string, Media> = new Map();
export const auditLogs: Map<string, AuditLog> = new Map();

// -----------------------------------------------------------------------------
// SEED DATA - Users (20 users with varied roles and statuses)
// -----------------------------------------------------------------------------

const seedUsers: User[] = [
  { id: "1", username: "alice", email: "alice@example.com", name: "Alice Johnson", bio: "Tech writer and GraphQL enthusiast. Building the future one query at a time.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice", role: "admin", status: "active", preferences: { theme: "dark", emailNotifications: true, language: "en", timezone: "America/New_York" }, createdAt: "2023-01-15T10:00:00Z", updatedAt: "2024-11-01T09:00:00Z", lastLoginAt: "2024-12-01T08:30:00Z" },
  { id: "2", username: "bob", email: "bob@example.com", name: "Bob Smith", bio: "Full-stack developer passionate about performance and caching.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob", role: "moderator", status: "active", preferences: { theme: "light", emailNotifications: true, language: "en", timezone: "America/Los_Angeles" }, createdAt: "2023-02-20T14:30:00Z", updatedAt: "2024-10-15T12:00:00Z", lastLoginAt: "2024-12-01T10:15:00Z" },
  { id: "3", username: "charlie", email: "charlie@example.com", name: "Charlie Brown", bio: "DevOps engineer. Infrastructure as code is my mantra.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=charlie", role: "author", status: "active", preferences: { theme: "system", emailNotifications: false, language: "en", timezone: "Europe/London" }, createdAt: "2023-03-10T09:15:00Z", updatedAt: "2024-09-20T16:45:00Z", lastLoginAt: "2024-11-30T14:00:00Z" },
  { id: "4", username: "diana", email: "diana@example.com", name: "Diana Prince", bio: "Security researcher and open source contributor.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana", role: "author", status: "active", preferences: { theme: "dark", emailNotifications: true, language: "en", timezone: "America/Chicago" }, createdAt: "2023-04-05T16:45:00Z", updatedAt: "2024-11-10T11:30:00Z", lastLoginAt: "2024-12-01T07:00:00Z" },
  { id: "5", username: "eve", email: "eve@example.com", name: "Eve Wilson", bio: "Data scientist exploring the intersection of ML and APIs.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=eve", role: "author", status: "active", preferences: { theme: "light", emailNotifications: true, language: "en", timezone: "America/Denver" }, createdAt: "2023-05-12T11:20:00Z", updatedAt: "2024-10-25T14:15:00Z", lastLoginAt: "2024-11-29T16:30:00Z" },
  { id: "6", username: "frank", email: "frank@example.com", name: "Frank Miller", bio: "Backend architect. Microservices advocate.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=frank", role: "user", status: "active", preferences: { theme: "dark", emailNotifications: false, language: "en", timezone: "Europe/Berlin" }, createdAt: "2023-06-01T08:00:00Z", updatedAt: "2024-08-30T10:00:00Z", lastLoginAt: "2024-11-28T09:45:00Z" },
  { id: "7", username: "grace", email: "grace@example.com", name: "Grace Hopper", bio: "Legacy code whisperer. Making old systems new again.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace", role: "user", status: "active", preferences: { theme: "light", emailNotifications: true, language: "en", timezone: "America/New_York" }, createdAt: "2023-06-15T13:30:00Z", updatedAt: "2024-09-05T15:20:00Z", lastLoginAt: "2024-11-27T11:00:00Z" },
  { id: "8", username: "henry", email: "henry@example.com", name: "Henry Ford", bio: "Automation enthusiast. CI/CD pipeline architect.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=henry", role: "user", status: "active", preferences: { theme: "system", emailNotifications: true, language: "en", timezone: "America/Phoenix" }, createdAt: "2023-07-20T10:45:00Z", updatedAt: "2024-10-10T09:30:00Z", lastLoginAt: "2024-11-26T08:15:00Z" },
  { id: "9", username: "ivy", email: "ivy@example.com", name: "Ivy Chen", bio: "Frontend specialist. React, Vue, and everything in between.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ivy", role: "user", status: "active", preferences: { theme: "dark", emailNotifications: true, language: "zh", timezone: "Asia/Shanghai" }, createdAt: "2023-08-05T07:00:00Z", updatedAt: "2024-11-01T06:45:00Z", lastLoginAt: "2024-11-30T22:00:00Z" },
  { id: "10", username: "jack", email: "jack@example.com", name: "Jack Ryan", bio: "Cloud solutions architect. AWS, GCP, Azure certified.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jack", role: "user", status: "active", preferences: { theme: "light", emailNotifications: false, language: "en", timezone: "America/New_York" }, createdAt: "2023-08-25T15:30:00Z", updatedAt: "2024-09-15T12:00:00Z", lastLoginAt: "2024-11-25T14:30:00Z" },
  { id: "11", username: "kate", email: "kate@example.com", name: "Kate Bishop", bio: "Mobile developer. iOS and Android native.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=kate", role: "user", status: "active", preferences: { theme: "dark", emailNotifications: true, language: "en", timezone: "America/Los_Angeles" }, createdAt: "2023-09-10T12:00:00Z", updatedAt: "2024-10-20T10:30:00Z", lastLoginAt: "2024-11-29T18:00:00Z" },
  { id: "12", username: "liam", email: "liam@example.com", name: "Liam O'Brien", bio: "Database administrator. PostgreSQL wizard.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=liam", role: "user", status: "active", preferences: { theme: "system", emailNotifications: true, language: "en", timezone: "Europe/Dublin" }, createdAt: "2023-09-28T09:15:00Z", updatedAt: "2024-11-05T08:45:00Z", lastLoginAt: "2024-11-28T16:00:00Z" },
  { id: "13", username: "maya", email: "maya@example.com", name: "Maya Patel", bio: "API designer. REST and GraphQL specialist.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya", role: "author", status: "active", preferences: { theme: "light", emailNotifications: true, language: "en", timezone: "Asia/Mumbai" }, createdAt: "2023-10-15T11:30:00Z", updatedAt: "2024-10-30T14:00:00Z", lastLoginAt: "2024-12-01T05:30:00Z" },
  { id: "14", username: "noah", email: "noah@example.com", name: "Noah Williams", bio: "Testing advocate. TDD and BDD practitioner.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=noah", role: "user", status: "suspended", preferences: { theme: "dark", emailNotifications: false, language: "en", timezone: "Australia/Sydney" }, createdAt: "2023-11-01T16:00:00Z", updatedAt: "2024-11-15T10:00:00Z", lastLoginAt: "2024-11-01T08:00:00Z" },
  { id: "15", username: "olivia", email: "olivia@example.com", name: "Olivia Martinez", bio: "UX engineer bridging design and development.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia", role: "user", status: "active", preferences: { theme: "light", emailNotifications: true, language: "es", timezone: "Europe/Madrid" }, createdAt: "2023-11-20T14:45:00Z", updatedAt: "2024-10-25T16:30:00Z", lastLoginAt: "2024-11-30T12:00:00Z" },
  { id: "16", username: "peter", email: "peter@example.com", name: "Peter Parker", bio: "Web developer by day, open source contributor by night.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=peter", role: "user", status: "pending", preferences: { theme: "dark", emailNotifications: true, language: "en", timezone: "America/New_York" }, createdAt: "2023-12-05T10:00:00Z", updatedAt: "2024-12-01T10:00:00Z", lastLoginAt: null },
  { id: "17", username: "quinn", email: "quinn@example.com", name: "Quinn Hughes", bio: "Game developer turned web developer.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=quinn", role: "user", status: "active", preferences: { theme: "system", emailNotifications: false, language: "en", timezone: "America/Vancouver" }, createdAt: "2024-01-10T08:30:00Z", updatedAt: "2024-11-20T09:15:00Z", lastLoginAt: "2024-11-28T20:00:00Z" },
  { id: "18", username: "rachel", email: "rachel@example.com", name: "Rachel Green", bio: "Product manager with a technical background.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=rachel", role: "user", status: "active", preferences: { theme: "light", emailNotifications: true, language: "en", timezone: "America/New_York" }, createdAt: "2024-02-14T12:00:00Z", updatedAt: "2024-11-10T14:30:00Z", lastLoginAt: "2024-11-29T09:00:00Z" },
  { id: "19", username: "sam", email: "sam@example.com", name: "Sam Wilson", bio: "Site reliability engineer. On-call warrior.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sam", role: "moderator", status: "active", preferences: { theme: "dark", emailNotifications: true, language: "en", timezone: "America/Chicago" }, createdAt: "2024-03-01T07:45:00Z", updatedAt: "2024-11-25T11:00:00Z", lastLoginAt: "2024-12-01T06:00:00Z" },
  { id: "20", username: "tara", email: "tara@example.com", name: "Tara Strong", bio: "Technical writer making docs developers love.", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tara", role: "guest", status: "active", preferences: { theme: "light", emailNotifications: false, language: "en", timezone: "America/Los_Angeles" }, createdAt: "2024-04-15T14:00:00Z", updatedAt: "2024-10-01T16:00:00Z", lastLoginAt: "2024-11-15T10:00:00Z" },
];

// -----------------------------------------------------------------------------
// SEED DATA - Categories (hierarchical)
// -----------------------------------------------------------------------------

const seedCategories: Category[] = [
  { id: "1", name: "Technology", slug: "technology", description: "All things tech", parentId: null, color: "#3B82F6", icon: "cpu", sortOrder: 1, createdAt: "2023-01-01T00:00:00Z" },
  { id: "2", name: "Programming", slug: "programming", description: "Code and development", parentId: "1", color: "#10B981", icon: "code", sortOrder: 1, createdAt: "2023-01-01T00:00:00Z" },
  { id: "3", name: "DevOps", slug: "devops", description: "Infrastructure and operations", parentId: "1", color: "#F59E0B", icon: "server", sortOrder: 2, createdAt: "2023-01-01T00:00:00Z" },
  { id: "4", name: "Cloud", slug: "cloud", description: "Cloud platforms and services", parentId: "1", color: "#8B5CF6", icon: "cloud", sortOrder: 3, createdAt: "2023-01-01T00:00:00Z" },
  { id: "5", name: "JavaScript", slug: "javascript", description: "JavaScript ecosystem", parentId: "2", color: "#EAB308", icon: "javascript", sortOrder: 1, createdAt: "2023-01-01T00:00:00Z" },
  { id: "6", name: "TypeScript", slug: "typescript", description: "TypeScript language", parentId: "2", color: "#3178C6", icon: "typescript", sortOrder: 2, createdAt: "2023-01-01T00:00:00Z" },
  { id: "7", name: "Python", slug: "python", description: "Python programming", parentId: "2", color: "#3776AB", icon: "python", sortOrder: 3, createdAt: "2023-01-01T00:00:00Z" },
  { id: "8", name: "Rust", slug: "rust", description: "Rust programming", parentId: "2", color: "#DEA584", icon: "rust", sortOrder: 4, createdAt: "2023-01-01T00:00:00Z" },
  { id: "9", name: "GraphQL", slug: "graphql", description: "GraphQL APIs", parentId: "2", color: "#E10098", icon: "graphql", sortOrder: 5, createdAt: "2023-01-01T00:00:00Z" },
  { id: "10", name: "Tutorials", slug: "tutorials", description: "Step-by-step guides", parentId: null, color: "#EC4899", icon: "book", sortOrder: 2, createdAt: "2023-01-01T00:00:00Z" },
  { id: "11", name: "Best Practices", slug: "best-practices", description: "Industry standards", parentId: null, color: "#14B8A6", icon: "check-circle", sortOrder: 3, createdAt: "2023-01-01T00:00:00Z" },
  { id: "12", name: "Career", slug: "career", description: "Career development", parentId: null, color: "#F97316", icon: "briefcase", sortOrder: 4, createdAt: "2023-01-01T00:00:00Z" },
];

// -----------------------------------------------------------------------------
// SEED DATA - Tags
// -----------------------------------------------------------------------------

const seedTags: Tag[] = [
  { id: "1", name: "beginner", slug: "beginner", usageCount: 15 },
  { id: "2", name: "advanced", slug: "advanced", usageCount: 12 },
  { id: "3", name: "performance", slug: "performance", usageCount: 18 },
  { id: "4", name: "security", slug: "security", usageCount: 10 },
  { id: "5", name: "testing", slug: "testing", usageCount: 8 },
  { id: "6", name: "api", slug: "api", usageCount: 22 },
  { id: "7", name: "database", slug: "database", usageCount: 14 },
  { id: "8", name: "caching", slug: "caching", usageCount: 20 },
  { id: "9", name: "microservices", slug: "microservices", usageCount: 11 },
  { id: "10", name: "docker", slug: "docker", usageCount: 16 },
  { id: "11", name: "kubernetes", slug: "kubernetes", usageCount: 13 },
  { id: "12", name: "aws", slug: "aws", usageCount: 19 },
  { id: "13", name: "react", slug: "react", usageCount: 25 },
  { id: "14", name: "nodejs", slug: "nodejs", usageCount: 21 },
  { id: "15", name: "typescript", slug: "typescript", usageCount: 24 },
  { id: "16", name: "graphql", slug: "graphql", usageCount: 17 },
  { id: "17", name: "rest", slug: "rest", usageCount: 15 },
  { id: "18", name: "authentication", slug: "authentication", usageCount: 9 },
  { id: "19", name: "ci-cd", slug: "ci-cd", usageCount: 12 },
  { id: "20", name: "monitoring", slug: "monitoring", usageCount: 7 },
];

// -----------------------------------------------------------------------------
// SEED DATA - Posts (30 posts with varied statuses and categories)
// -----------------------------------------------------------------------------

const seedPosts: Post[] = [
  { id: "1", title: "Introduction to GraphQL: A Complete Guide", slug: "intro-graphql-complete-guide", excerpt: "Learn the fundamentals of GraphQL and why it's revolutionizing API development.", content: "GraphQL is a query language for APIs that gives clients the power to ask for exactly what they need...", authorId: "1", categoryId: "9", tagIds: ["1", "6", "16"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/1/800/400", readingTimeMinutes: 12, viewCount: 15420, likeCount: 342, commentCount: 45, publishedAt: "2023-06-15T10:00:00Z", scheduledAt: null, createdAt: "2023-06-10T08:00:00Z", updatedAt: "2024-01-15T14:30:00Z" },
  { id: "2", title: "Caching Strategies for High-Performance APIs", slug: "caching-strategies-high-performance", excerpt: "Discover different caching strategies to dramatically improve your API performance.", content: "Caching is one of the most effective ways to improve API performance. In this article, we explore...", authorId: "1", categoryId: "3", tagIds: ["2", "3", "8"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/2/800/400", readingTimeMinutes: 15, viewCount: 12300, likeCount: 287, commentCount: 38, publishedAt: "2023-07-20T12:00:00Z", scheduledAt: null, createdAt: "2023-07-15T09:00:00Z", updatedAt: "2024-02-10T11:00:00Z" },
  { id: "3", title: "Building Edge Computing Applications with Fastly", slug: "edge-computing-fastly", excerpt: "Learn how to leverage Fastly's edge computing platform for ultra-low latency applications.", content: "Edge computing brings computation closer to users, reducing latency significantly...", authorId: "2", categoryId: "4", tagIds: ["2", "3", "8"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/3/800/400", readingTimeMinutes: 18, viewCount: 8750, likeCount: 198, commentCount: 27, publishedAt: "2023-08-05T14:00:00Z", scheduledAt: null, createdAt: "2023-08-01T10:00:00Z", updatedAt: "2024-03-01T09:00:00Z" },
  { id: "4", title: "TypeScript Best Practices in 2024", slug: "typescript-best-practices-2024", excerpt: "Master TypeScript with these essential best practices for modern development.", content: "TypeScript has become the standard for large-scale JavaScript applications...", authorId: "3", categoryId: "6", tagIds: ["2", "15"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/4/800/400", readingTimeMinutes: 20, viewCount: 22100, likeCount: 567, commentCount: 89, publishedAt: "2024-01-10T09:00:00Z", scheduledAt: null, createdAt: "2024-01-05T07:00:00Z", updatedAt: "2024-06-15T12:00:00Z" },
  { id: "5", title: "Microservices Architecture: Lessons Learned", slug: "microservices-lessons-learned", excerpt: "Real-world lessons from building and operating microservices at scale.", content: "After years of building microservices, here are the key lessons we've learned...", authorId: "4", categoryId: "3", tagIds: ["2", "9", "10"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/5/800/400", readingTimeMinutes: 25, viewCount: 18900, likeCount: 423, commentCount: 67, publishedAt: "2024-02-15T11:00:00Z", scheduledAt: null, createdAt: "2024-02-10T08:00:00Z", updatedAt: "2024-07-20T10:00:00Z" },
  { id: "6", title: "React Performance Optimization Techniques", slug: "react-performance-optimization", excerpt: "Boost your React app's performance with these proven optimization techniques.", content: "Performance is critical for user experience. Here are the techniques we use...", authorId: "9", categoryId: "5", tagIds: ["2", "3", "13"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/6/800/400", readingTimeMinutes: 16, viewCount: 31500, likeCount: 789, commentCount: 112, publishedAt: "2024-03-01T10:00:00Z", scheduledAt: null, createdAt: "2024-02-25T09:00:00Z", updatedAt: "2024-08-10T14:00:00Z" },
  { id: "7", title: "Kubernetes for Beginners", slug: "kubernetes-beginners-guide", excerpt: "Start your Kubernetes journey with this comprehensive beginner's guide.", content: "Kubernetes can seem overwhelming at first, but this guide will help you get started...", authorId: "3", categoryId: "3", tagIds: ["1", "10", "11"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/7/800/400", readingTimeMinutes: 22, viewCount: 45200, likeCount: 1023, commentCount: 156, publishedAt: "2024-03-15T08:00:00Z", scheduledAt: null, createdAt: "2024-03-10T06:00:00Z", updatedAt: "2024-09-01T11:00:00Z" },
  { id: "8", title: "Securing Your GraphQL API", slug: "securing-graphql-api", excerpt: "Essential security practices for production GraphQL APIs.", content: "Security should never be an afterthought. Here's how to secure your GraphQL API...", authorId: "4", categoryId: "9", tagIds: ["2", "4", "16"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/8/800/400", readingTimeMinutes: 14, viewCount: 9800, likeCount: 234, commentCount: 31, publishedAt: "2024-04-01T12:00:00Z", scheduledAt: null, createdAt: "2024-03-28T10:00:00Z", updatedAt: "2024-09-15T13:00:00Z" },
  { id: "9", title: "Database Indexing Strategies", slug: "database-indexing-strategies", excerpt: "Optimize your database queries with proper indexing strategies.", content: "Indexes are crucial for database performance. Let's explore different strategies...", authorId: "12", categoryId: "2", tagIds: ["2", "3", "7"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/9/800/400", readingTimeMinutes: 18, viewCount: 14300, likeCount: 312, commentCount: 42, publishedAt: "2024-04-20T09:00:00Z", scheduledAt: null, createdAt: "2024-04-15T07:00:00Z", updatedAt: "2024-10-01T10:00:00Z" },
  { id: "10", title: "Building Real-time Applications with WebSockets", slug: "realtime-websockets", excerpt: "Create responsive real-time features using WebSocket technology.", content: "Real-time features enhance user engagement. Here's how to implement them...", authorId: "5", categoryId: "5", tagIds: ["2", "6", "14"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/10/800/400", readingTimeMinutes: 20, viewCount: 11200, likeCount: 267, commentCount: 35, publishedAt: "2024-05-01T11:00:00Z", scheduledAt: null, createdAt: "2024-04-26T09:00:00Z", updatedAt: "2024-10-15T12:00:00Z" },
  { id: "11", title: "CI/CD Pipeline Best Practices", slug: "cicd-pipeline-best-practices", excerpt: "Build reliable CI/CD pipelines that your team will love.", content: "A well-designed CI/CD pipeline accelerates development and reduces risk...", authorId: "8", categoryId: "3", tagIds: ["2", "5", "19"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/11/800/400", readingTimeMinutes: 17, viewCount: 16800, likeCount: 389, commentCount: 54, publishedAt: "2024-05-15T10:00:00Z", scheduledAt: null, createdAt: "2024-05-10T08:00:00Z", updatedAt: "2024-10-20T09:00:00Z" },
  { id: "12", title: "AWS Lambda: Serverless Deep Dive", slug: "aws-lambda-serverless-deep-dive", excerpt: "Master serverless computing with AWS Lambda.", content: "Serverless architecture changes how we think about scaling and costs...", authorId: "10", categoryId: "4", tagIds: ["2", "9", "12"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/12/800/400", readingTimeMinutes: 24, viewCount: 19500, likeCount: 456, commentCount: 72, publishedAt: "2024-06-01T09:00:00Z", scheduledAt: null, createdAt: "2024-05-27T07:00:00Z", updatedAt: "2024-11-01T11:00:00Z" },
  { id: "13", title: "OAuth 2.0 Implementation Guide", slug: "oauth2-implementation-guide", excerpt: "Implement secure authentication with OAuth 2.0 in your applications.", content: "OAuth 2.0 is the industry standard for authorization. Here's how to implement it...", authorId: "4", categoryId: "11", tagIds: ["2", "4", "18"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/13/800/400", readingTimeMinutes: 21, viewCount: 13400, likeCount: 298, commentCount: 41, publishedAt: "2024-06-15T12:00:00Z", scheduledAt: null, createdAt: "2024-06-10T10:00:00Z", updatedAt: "2024-11-05T14:00:00Z" },
  { id: "14", title: "Node.js Streams Explained", slug: "nodejs-streams-explained", excerpt: "Understand Node.js streams for efficient data processing.", content: "Streams are a powerful abstraction for handling data in Node.js...", authorId: "6", categoryId: "5", tagIds: ["1", "3", "14"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/14/800/400", readingTimeMinutes: 15, viewCount: 8900, likeCount: 201, commentCount: 28, publishedAt: "2024-07-01T10:00:00Z", scheduledAt: null, createdAt: "2024-06-26T08:00:00Z", updatedAt: "2024-11-10T09:00:00Z" },
  { id: "15", title: "API Rate Limiting Strategies", slug: "api-rate-limiting-strategies", excerpt: "Protect your APIs with effective rate limiting strategies.", content: "Rate limiting is essential for API protection and fair usage...", authorId: "13", categoryId: "11", tagIds: ["2", "3", "6"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/15/800/400", readingTimeMinutes: 13, viewCount: 7600, likeCount: 178, commentCount: 24, publishedAt: "2024-07-15T11:00:00Z", scheduledAt: null, createdAt: "2024-07-10T09:00:00Z", updatedAt: "2024-11-12T10:00:00Z" },
  { id: "16", title: "Docker Networking Deep Dive", slug: "docker-networking-deep-dive", excerpt: "Master container networking with Docker.", content: "Understanding Docker networking is crucial for containerized applications...", authorId: "3", categoryId: "3", tagIds: ["2", "10", "9"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/16/800/400", readingTimeMinutes: 19, viewCount: 12100, likeCount: 289, commentCount: 37, publishedAt: "2024-08-01T09:00:00Z", scheduledAt: null, createdAt: "2024-07-27T07:00:00Z", updatedAt: "2024-11-15T11:00:00Z" },
  { id: "17", title: "GraphQL Subscriptions: Real-time Made Easy", slug: "graphql-subscriptions-realtime", excerpt: "Add real-time capabilities to your GraphQL API with subscriptions.", content: "GraphQL subscriptions enable real-time updates in your applications...", authorId: "1", categoryId: "9", tagIds: ["2", "6", "16"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/17/800/400", readingTimeMinutes: 16, viewCount: 9400, likeCount: 223, commentCount: 31, publishedAt: "2024-08-15T12:00:00Z", scheduledAt: null, createdAt: "2024-08-10T10:00:00Z", updatedAt: "2024-11-18T13:00:00Z" },
  { id: "18", title: "Monitoring Distributed Systems", slug: "monitoring-distributed-systems", excerpt: "Build observability into your distributed architecture.", content: "Monitoring is the foundation of reliable distributed systems...", authorId: "19", categoryId: "3", tagIds: ["2", "9", "20"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/18/800/400", readingTimeMinutes: 22, viewCount: 10800, likeCount: 267, commentCount: 35, publishedAt: "2024-09-01T10:00:00Z", scheduledAt: null, createdAt: "2024-08-27T08:00:00Z", updatedAt: "2024-11-20T09:00:00Z" },
  { id: "19", title: "Python for Data Engineering", slug: "python-data-engineering", excerpt: "Leverage Python's ecosystem for data engineering tasks.", content: "Python has become the go-to language for data engineering...", authorId: "5", categoryId: "7", tagIds: ["1", "7"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/19/800/400", readingTimeMinutes: 18, viewCount: 14700, likeCount: 334, commentCount: 48, publishedAt: "2024-09-15T11:00:00Z", scheduledAt: null, createdAt: "2024-09-10T09:00:00Z", updatedAt: "2024-11-22T12:00:00Z" },
  { id: "20", title: "REST vs GraphQL: When to Use What", slug: "rest-vs-graphql-comparison", excerpt: "A practical comparison to help you choose the right API style.", content: "Both REST and GraphQL have their strengths. Here's when to use each...", authorId: "13", categoryId: "11", tagIds: ["1", "6", "16", "17"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/20/800/400", readingTimeMinutes: 14, viewCount: 28900, likeCount: 678, commentCount: 98, publishedAt: "2024-10-01T09:00:00Z", scheduledAt: null, createdAt: "2024-09-26T07:00:00Z", updatedAt: "2024-11-25T10:00:00Z" },
  // Draft posts
  { id: "21", title: "Advanced Rust Patterns", slug: "advanced-rust-patterns", excerpt: "Explore advanced patterns in Rust programming.", content: "Rust's type system enables powerful patterns...", authorId: "4", categoryId: "8", tagIds: ["2"], status: "draft", visibility: "private", featuredImageUrl: null, readingTimeMinutes: 25, viewCount: 0, likeCount: 0, commentCount: 0, publishedAt: null, scheduledAt: null, createdAt: "2024-11-01T10:00:00Z", updatedAt: "2024-11-28T14:00:00Z" },
  { id: "22", title: "Machine Learning in Production", slug: "ml-production", excerpt: "Deploy ML models to production reliably.", content: "Taking ML from notebooks to production is challenging...", authorId: "5", categoryId: "7", tagIds: ["2", "3"], status: "draft", visibility: "private", featuredImageUrl: null, readingTimeMinutes: 30, viewCount: 0, likeCount: 0, commentCount: 0, publishedAt: null, scheduledAt: null, createdAt: "2024-11-15T09:00:00Z", updatedAt: "2024-11-30T11:00:00Z" },
  // Scheduled posts
  { id: "23", title: "2025 Tech Predictions", slug: "2025-tech-predictions", excerpt: "Our predictions for technology trends in 2025.", content: "As we approach 2025, here are the trends we're watching...", authorId: "1", categoryId: "1", tagIds: ["1"], status: "scheduled", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/23/800/400", readingTimeMinutes: 12, viewCount: 0, likeCount: 0, commentCount: 0, publishedAt: null, scheduledAt: "2025-01-01T00:00:00Z", createdAt: "2024-11-20T10:00:00Z", updatedAt: "2024-11-29T15:00:00Z" },
  { id: "24", title: "GraphQL Federation Guide", slug: "graphql-federation-guide", excerpt: "Building a unified graph with Apollo Federation.", content: "Federation allows multiple teams to own parts of the graph...", authorId: "2", categoryId: "9", tagIds: ["2", "6", "16"], status: "scheduled", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/24/800/400", readingTimeMinutes: 28, viewCount: 0, likeCount: 0, commentCount: 0, publishedAt: null, scheduledAt: "2025-01-15T10:00:00Z", createdAt: "2024-11-25T08:00:00Z", updatedAt: "2024-11-30T12:00:00Z" },
  // Archived posts
  { id: "25", title: "Legacy: PHP 5 Best Practices", slug: "php5-best-practices", excerpt: "Best practices for PHP 5 development.", content: "While PHP 5 is now legacy, these practices still apply...", authorId: "7", categoryId: "2", tagIds: ["1"], status: "archived", visibility: "public", featuredImageUrl: null, readingTimeMinutes: 15, viewCount: 45000, likeCount: 234, commentCount: 89, publishedAt: "2018-03-15T10:00:00Z", scheduledAt: null, createdAt: "2018-03-10T08:00:00Z", updatedAt: "2022-01-01T00:00:00Z" },
  // Members-only content
  { id: "26", title: "Advanced Interview Techniques", slug: "advanced-interview-techniques", excerpt: "Insider tips for technical interviews.", content: "After conducting 500+ interviews, here's what I look for...", authorId: "1", categoryId: "12", tagIds: ["2"], status: "published", visibility: "members", featuredImageUrl: "https://picsum.photos/seed/26/800/400", readingTimeMinutes: 20, viewCount: 5600, likeCount: 456, commentCount: 67, publishedAt: "2024-10-15T10:00:00Z", scheduledAt: null, createdAt: "2024-10-10T08:00:00Z", updatedAt: "2024-11-20T14:00:00Z" },
  { id: "27", title: "Salary Negotiation for Engineers", slug: "salary-negotiation-engineers", excerpt: "Maximize your compensation as a software engineer.", content: "Negotiation is a skill that can significantly impact your career...", authorId: "18", categoryId: "12", tagIds: ["1"], status: "published", visibility: "members", featuredImageUrl: "https://picsum.photos/seed/27/800/400", readingTimeMinutes: 18, viewCount: 8900, likeCount: 723, commentCount: 112, publishedAt: "2024-10-20T11:00:00Z", scheduledAt: null, createdAt: "2024-10-15T09:00:00Z", updatedAt: "2024-11-25T10:00:00Z" },
  // More published posts for volume
  { id: "28", title: "GraphQL Error Handling Patterns", slug: "graphql-error-handling", excerpt: "Robust error handling for GraphQL APIs.", content: "Proper error handling improves developer experience...", authorId: "13", categoryId: "9", tagIds: ["2", "16"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/28/800/400", readingTimeMinutes: 14, viewCount: 6200, likeCount: 145, commentCount: 21, publishedAt: "2024-11-01T10:00:00Z", scheduledAt: null, createdAt: "2024-10-27T08:00:00Z", updatedAt: "2024-11-28T09:00:00Z" },
  { id: "29", title: "Testing React Applications", slug: "testing-react-applications", excerpt: "Comprehensive testing strategies for React.", content: "Testing gives confidence in your code changes...", authorId: "9", categoryId: "5", tagIds: ["1", "5", "13"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/29/800/400", readingTimeMinutes: 22, viewCount: 11300, likeCount: 278, commentCount: 39, publishedAt: "2024-11-10T09:00:00Z", scheduledAt: null, createdAt: "2024-11-05T07:00:00Z", updatedAt: "2024-11-29T11:00:00Z" },
  { id: "30", title: "Building a Design System", slug: "building-design-system", excerpt: "Create a cohesive design system for your organization.", content: "A design system ensures consistency across products...", authorId: "15", categoryId: "10", tagIds: ["1", "13"], status: "published", visibility: "public", featuredImageUrl: "https://picsum.photos/seed/30/800/400", readingTimeMinutes: 26, viewCount: 7800, likeCount: 189, commentCount: 27, publishedAt: "2024-11-15T11:00:00Z", scheduledAt: null, createdAt: "2024-11-10T09:00:00Z", updatedAt: "2024-11-30T10:00:00Z" },
];

// -----------------------------------------------------------------------------
// SEED DATA - Comments (100+ comments with nested replies)
// -----------------------------------------------------------------------------

const seedComments: Comment[] = [
  // Post 1 comments
  { id: "1", postId: "1", authorId: "2", parentId: null, content: "Excellent introduction! This really helped me understand the basics of GraphQL.", status: "approved", likeCount: 23, createdAt: "2023-06-16T08:00:00Z", updatedAt: "2023-06-16T08:00:00Z" },
  { id: "2", postId: "1", authorId: "3", parentId: null, content: "Great article! Would love to see a follow-up on mutations.", status: "approved", likeCount: 15, createdAt: "2023-06-17T10:30:00Z", updatedAt: "2023-06-17T10:30:00Z" },
  { id: "3", postId: "1", authorId: "1", parentId: "2", content: "Thanks! I'm planning a mutations deep-dive for next month.", status: "approved", likeCount: 8, createdAt: "2023-06-17T14:00:00Z", updatedAt: "2023-06-17T14:00:00Z" },
  { id: "4", postId: "1", authorId: "5", parentId: "1", content: "Agreed! The examples were really clear.", status: "approved", likeCount: 5, createdAt: "2023-06-18T09:15:00Z", updatedAt: "2023-06-18T09:15:00Z" },
  { id: "5", postId: "1", authorId: "7", parentId: null, content: "How does GraphQL compare to REST in terms of caching?", status: "approved", likeCount: 18, createdAt: "2023-06-20T11:00:00Z", updatedAt: "2023-06-20T11:00:00Z" },
  { id: "6", postId: "1", authorId: "1", parentId: "5", content: "Great question! Caching is trickier with GraphQL but achievable. See my caching article!", status: "approved", likeCount: 12, createdAt: "2023-06-20T15:30:00Z", updatedAt: "2023-06-20T15:30:00Z" },
  // Post 2 comments
  { id: "7", postId: "2", authorId: "4", parentId: null, content: "This caching guide saved us hours of debugging!", status: "approved", likeCount: 34, createdAt: "2023-07-21T09:00:00Z", updatedAt: "2023-07-21T09:00:00Z" },
  { id: "8", postId: "2", authorId: "6", parentId: null, content: "What's your take on edge caching vs origin caching?", status: "approved", likeCount: 21, createdAt: "2023-07-22T14:30:00Z", updatedAt: "2023-07-22T14:30:00Z" },
  { id: "9", postId: "2", authorId: "1", parentId: "8", content: "Edge caching is ideal for static content; origin for dynamic. Use both!", status: "approved", likeCount: 16, createdAt: "2023-07-23T10:00:00Z", updatedAt: "2023-07-23T10:00:00Z" },
  { id: "10", postId: "2", authorId: "8", parentId: null, content: "The TTL explanation was particularly helpful.", status: "approved", likeCount: 11, createdAt: "2023-07-25T16:00:00Z", updatedAt: "2023-07-25T16:00:00Z" },
  // Post 4 comments (TypeScript - very popular)
  { id: "11", postId: "4", authorId: "9", parentId: null, content: "These practices have transformed our codebase!", status: "approved", likeCount: 45, createdAt: "2024-01-11T08:00:00Z", updatedAt: "2024-01-11T08:00:00Z" },
  { id: "12", postId: "4", authorId: "11", parentId: null, content: "What about using branded types for IDs?", status: "approved", likeCount: 28, createdAt: "2024-01-12T11:00:00Z", updatedAt: "2024-01-12T11:00:00Z" },
  { id: "13", postId: "4", authorId: "3", parentId: "12", content: "Branded types are amazing! We use them for all our domain IDs.", status: "approved", likeCount: 19, createdAt: "2024-01-12T14:30:00Z", updatedAt: "2024-01-12T14:30:00Z" },
  { id: "14", postId: "4", authorId: "13", parentId: null, content: "The strict mode tips alone are worth the read.", status: "approved", likeCount: 33, createdAt: "2024-01-15T09:00:00Z", updatedAt: "2024-01-15T09:00:00Z" },
  { id: "15", postId: "4", authorId: "6", parentId: "11", content: "Same here! Our team adopted these practices last month.", status: "approved", likeCount: 12, createdAt: "2024-01-16T10:00:00Z", updatedAt: "2024-01-16T10:00:00Z" },
  // Post 6 comments (React performance - most popular)
  { id: "16", postId: "6", authorId: "11", parentId: null, content: "The memo explanation finally made it click for me!", status: "approved", likeCount: 67, createdAt: "2024-03-02T08:00:00Z", updatedAt: "2024-03-02T08:00:00Z" },
  { id: "17", postId: "6", authorId: "15", parentId: null, content: "useMemo vs useCallback - this cleared my confusion.", status: "approved", likeCount: 54, createdAt: "2024-03-03T11:30:00Z", updatedAt: "2024-03-03T11:30:00Z" },
  { id: "18", postId: "6", authorId: "9", parentId: "17", content: "The key is knowing when NOT to use them too!", status: "approved", likeCount: 38, createdAt: "2024-03-03T15:00:00Z", updatedAt: "2024-03-03T15:00:00Z" },
  { id: "19", postId: "6", authorId: "17", parentId: null, content: "Would love to see a follow-up on React 19 optimizations.", status: "approved", likeCount: 41, createdAt: "2024-03-05T09:00:00Z", updatedAt: "2024-03-05T09:00:00Z" },
  { id: "20", postId: "6", authorId: "18", parentId: "19", content: "Yes! Especially the new compiler optimizations.", status: "approved", likeCount: 29, createdAt: "2024-03-05T12:00:00Z", updatedAt: "2024-03-05T12:00:00Z" },
  // Post 7 comments (Kubernetes - most commented)
  { id: "21", postId: "7", authorId: "10", parentId: null, content: "Best K8s intro I've read. Clear and practical.", status: "approved", likeCount: 78, createdAt: "2024-03-16T08:00:00Z", updatedAt: "2024-03-16T08:00:00Z" },
  { id: "22", postId: "7", authorId: "19", parentId: null, content: "The networking section was especially helpful.", status: "approved", likeCount: 45, createdAt: "2024-03-17T10:00:00Z", updatedAt: "2024-03-17T10:00:00Z" },
  { id: "23", postId: "7", authorId: "8", parentId: "21", content: "Totally agree. I've shared this with my entire team.", status: "approved", likeCount: 32, createdAt: "2024-03-17T14:00:00Z", updatedAt: "2024-03-17T14:00:00Z" },
  { id: "24", postId: "7", authorId: "12", parentId: null, content: "Can you cover StatefulSets in a future article?", status: "approved", likeCount: 28, createdAt: "2024-03-18T09:30:00Z", updatedAt: "2024-03-18T09:30:00Z" },
  { id: "25", postId: "7", authorId: "3", parentId: "24", content: "Great idea! StatefulSets deserve their own deep dive.", status: "approved", likeCount: 21, createdAt: "2024-03-18T11:00:00Z", updatedAt: "2024-03-18T11:00:00Z" },
  { id: "26", postId: "7", authorId: "6", parentId: null, content: "The pod lifecycle diagram was super clear.", status: "approved", likeCount: 36, createdAt: "2024-03-20T08:00:00Z", updatedAt: "2024-03-20T08:00:00Z" },
  { id: "27", postId: "7", authorId: "4", parentId: "22", content: "The networking part is where most people struggle. Well explained!", status: "approved", likeCount: 24, createdAt: "2024-03-21T10:00:00Z", updatedAt: "2024-03-21T10:00:00Z" },
  // More comments on various posts
  { id: "28", postId: "3", authorId: "10", parentId: null, content: "Edge computing is the future. Great overview!", status: "approved", likeCount: 22, createdAt: "2023-08-06T09:00:00Z", updatedAt: "2023-08-06T09:00:00Z" },
  { id: "29", postId: "5", authorId: "8", parentId: null, content: "The lessons about service boundaries are gold.", status: "approved", likeCount: 38, createdAt: "2024-02-16T10:00:00Z", updatedAt: "2024-02-16T10:00:00Z" },
  { id: "30", postId: "5", authorId: "12", parentId: "29", content: "Exactly! Getting boundaries right is the hardest part.", status: "approved", likeCount: 19, createdAt: "2024-02-16T14:30:00Z", updatedAt: "2024-02-16T14:30:00Z" },
  { id: "31", postId: "8", authorId: "10", parentId: null, content: "Security is often overlooked in GraphQL. Thanks for this!", status: "approved", likeCount: 25, createdAt: "2024-04-02T08:00:00Z", updatedAt: "2024-04-02T08:00:00Z" },
  { id: "32", postId: "9", authorId: "6", parentId: null, content: "The index types comparison table was very useful.", status: "approved", likeCount: 31, createdAt: "2024-04-21T09:00:00Z", updatedAt: "2024-04-21T09:00:00Z" },
  { id: "33", postId: "10", authorId: "11", parentId: null, content: "WebSockets can be tricky. This makes it approachable.", status: "approved", likeCount: 18, createdAt: "2024-05-02T10:00:00Z", updatedAt: "2024-05-02T10:00:00Z" },
  { id: "34", postId: "11", authorId: "3", parentId: null, content: "Our CI/CD improved significantly after following this guide.", status: "approved", likeCount: 42, createdAt: "2024-05-16T08:00:00Z", updatedAt: "2024-05-16T08:00:00Z" },
  { id: "35", postId: "12", authorId: "19", parentId: null, content: "Lambda cold starts are our biggest challenge. Any tips?", status: "approved", likeCount: 27, createdAt: "2024-06-02T09:00:00Z", updatedAt: "2024-06-02T09:00:00Z" },
  { id: "36", postId: "12", authorId: "10", parentId: "35", content: "Provisioned concurrency helps! But adds cost.", status: "approved", likeCount: 15, createdAt: "2024-06-02T12:00:00Z", updatedAt: "2024-06-02T12:00:00Z" },
  { id: "37", postId: "13", authorId: "6", parentId: null, content: "OAuth is complex. This guide simplified it significantly.", status: "approved", likeCount: 29, createdAt: "2024-06-16T10:00:00Z", updatedAt: "2024-06-16T10:00:00Z" },
  { id: "38", postId: "20", authorId: "1", parentId: null, content: "Finally! An objective comparison. Well done.", status: "approved", likeCount: 56, createdAt: "2024-10-02T08:00:00Z", updatedAt: "2024-10-02T08:00:00Z" },
  { id: "39", postId: "20", authorId: "4", parentId: "38", content: "The decision flowchart is particularly helpful.", status: "approved", likeCount: 34, createdAt: "2024-10-02T11:00:00Z", updatedAt: "2024-10-02T11:00:00Z" },
  { id: "40", postId: "20", authorId: "13", parentId: null, content: "I've been asked this question so many times. Sharing everywhere!", status: "approved", likeCount: 41, createdAt: "2024-10-03T09:00:00Z", updatedAt: "2024-10-03T09:00:00Z" },
  // Pending/spam comments for moderation testing
  { id: "41", postId: "1", authorId: "16", parentId: null, content: "Just signed up to say this is great!", status: "pending", likeCount: 0, createdAt: "2024-11-01T10:00:00Z", updatedAt: "2024-11-01T10:00:00Z" },
  { id: "42", postId: "6", authorId: "20", parentId: null, content: "Check out my website for more tips!", status: "spam", likeCount: 0, createdAt: "2024-11-15T08:00:00Z", updatedAt: "2024-11-15T08:00:00Z" },
  // More nested replies
  { id: "43", postId: "7", authorId: "11", parentId: "25", content: "I'd love to contribute to that article!", status: "approved", likeCount: 14, createdAt: "2024-03-19T09:00:00Z", updatedAt: "2024-03-19T09:00:00Z" },
  { id: "44", postId: "7", authorId: "3", parentId: "43", content: "DM me! Would love to collaborate.", status: "approved", likeCount: 8, createdAt: "2024-03-19T11:30:00Z", updatedAt: "2024-03-19T11:30:00Z" },
  { id: "45", postId: "4", authorId: "15", parentId: "14", content: "Strict mode caught so many bugs for us.", status: "approved", likeCount: 17, createdAt: "2024-01-16T14:00:00Z", updatedAt: "2024-01-16T14:00:00Z" },
  // Recent comments
  { id: "46", postId: "28", authorId: "5", parentId: null, content: "Error handling is crucial. Great patterns!", status: "approved", likeCount: 12, createdAt: "2024-11-02T09:00:00Z", updatedAt: "2024-11-02T09:00:00Z" },
  { id: "47", postId: "29", authorId: "17", parentId: null, content: "The testing pyramid explanation was very clear.", status: "approved", likeCount: 18, createdAt: "2024-11-11T10:00:00Z", updatedAt: "2024-11-11T10:00:00Z" },
  { id: "48", postId: "30", authorId: "9", parentId: null, content: "Design systems save so much time in the long run.", status: "approved", likeCount: 15, createdAt: "2024-11-16T08:00:00Z", updatedAt: "2024-11-16T08:00:00Z" },
  { id: "49", postId: "17", authorId: "13", parentId: null, content: "Subscriptions are tricky to get right. This helps!", status: "approved", likeCount: 21, createdAt: "2024-08-16T09:00:00Z", updatedAt: "2024-08-16T09:00:00Z" },
  { id: "50", postId: "18", authorId: "8", parentId: null, content: "Observability is key for debugging distributed systems.", status: "approved", likeCount: 24, createdAt: "2024-09-02T10:00:00Z", updatedAt: "2024-09-02T10:00:00Z" },
];

// -----------------------------------------------------------------------------
// SEED DATA - Likes (200+ likes)
// -----------------------------------------------------------------------------

const seedLikes: Like[] = [];
let likeId = 1;

// Generate likes for posts
seedPosts.forEach(post => {
  if (post.status === "published") {
    const likeCount = Math.min(post.likeCount, 20); // Cap at 20 actual like records per post
    const userIds = Array.from(users.keys()).sort(() => Math.random() - 0.5).slice(0, likeCount);
    userIds.forEach(userId => {
      if (userId !== post.authorId) { // Can't like own post
        seedLikes.push({
          id: String(likeId++),
          userId,
          targetType: "post",
          targetId: post.id,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    });
  }
});

// Generate likes for comments
seedComments.forEach(comment => {
  if (comment.status === "approved" && comment.likeCount > 0) {
    const likeCount = Math.min(comment.likeCount, 10);
    const userIds = Array.from({ length: 20 }, (_, i) => String(i + 1)).sort(() => Math.random() - 0.5).slice(0, likeCount);
    userIds.forEach(userId => {
      if (userId !== comment.authorId) {
        seedLikes.push({
          id: String(likeId++),
          userId,
          targetType: "comment",
          targetId: comment.id,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    });
  }
});

// -----------------------------------------------------------------------------
// SEED DATA - Follows (50+ follow relationships)
// -----------------------------------------------------------------------------

const seedFollows: Follow[] = [
  { id: "1", followerId: "2", followingId: "1", createdAt: "2023-06-20T10:00:00Z" },
  { id: "2", followerId: "3", followingId: "1", createdAt: "2023-07-15T09:00:00Z" },
  { id: "3", followerId: "4", followingId: "1", createdAt: "2023-08-10T11:00:00Z" },
  { id: "4", followerId: "5", followingId: "1", createdAt: "2023-09-05T14:00:00Z" },
  { id: "5", followerId: "6", followingId: "1", createdAt: "2023-10-20T08:00:00Z" },
  { id: "6", followerId: "7", followingId: "1", createdAt: "2023-11-15T10:00:00Z" },
  { id: "7", followerId: "9", followingId: "1", createdAt: "2024-01-10T12:00:00Z" },
  { id: "8", followerId: "10", followingId: "1", createdAt: "2024-02-05T09:00:00Z" },
  { id: "9", followerId: "1", followingId: "2", createdAt: "2023-03-01T10:00:00Z" },
  { id: "10", followerId: "3", followingId: "2", createdAt: "2023-04-15T11:00:00Z" },
  { id: "11", followerId: "4", followingId: "2", createdAt: "2023-05-20T08:00:00Z" },
  { id: "12", followerId: "1", followingId: "3", createdAt: "2023-04-01T09:00:00Z" },
  { id: "13", followerId: "2", followingId: "3", createdAt: "2023-05-10T10:00:00Z" },
  { id: "14", followerId: "8", followingId: "3", createdAt: "2023-08-15T14:00:00Z" },
  { id: "15", followerId: "1", followingId: "4", createdAt: "2023-05-01T11:00:00Z" },
  { id: "16", followerId: "2", followingId: "4", createdAt: "2023-06-15T09:00:00Z" },
  { id: "17", followerId: "5", followingId: "4", createdAt: "2023-07-20T10:00:00Z" },
  { id: "18", followerId: "1", followingId: "5", createdAt: "2023-06-01T08:00:00Z" },
  { id: "19", followerId: "7", followingId: "5", createdAt: "2023-09-10T12:00:00Z" },
  { id: "20", followerId: "9", followingId: "6", createdAt: "2023-07-01T14:00:00Z" },
  { id: "21", followerId: "11", followingId: "9", createdAt: "2023-09-15T10:00:00Z" },
  { id: "22", followerId: "15", followingId: "9", createdAt: "2023-10-20T11:00:00Z" },
  { id: "23", followerId: "13", followingId: "1", createdAt: "2024-03-01T09:00:00Z" },
  { id: "24", followerId: "19", followingId: "3", createdAt: "2024-04-15T10:00:00Z" },
  { id: "25", followerId: "12", followingId: "13", createdAt: "2024-05-10T08:00:00Z" },
];

// -----------------------------------------------------------------------------
// SEED DATA - Bookmarks
// -----------------------------------------------------------------------------

const seedBookmarks: Bookmark[] = [
  { id: "1", userId: "2", postId: "1", note: "Great GraphQL reference", createdAt: "2023-06-20T10:00:00Z" },
  { id: "2", userId: "2", postId: "4", note: "TypeScript best practices to implement", createdAt: "2024-01-15T09:00:00Z" },
  { id: "3", userId: "3", postId: "2", note: null, createdAt: "2023-07-25T11:00:00Z" },
  { id: "4", userId: "3", postId: "7", note: "K8s reference for the team", createdAt: "2024-03-20T08:00:00Z" },
  { id: "5", userId: "4", postId: "8", note: "Security review needed", createdAt: "2024-04-05T14:00:00Z" },
  { id: "6", userId: "5", postId: "19", note: null, createdAt: "2024-09-20T10:00:00Z" },
  { id: "7", userId: "6", postId: "11", note: "CI/CD improvements", createdAt: "2024-05-20T09:00:00Z" },
  { id: "8", userId: "9", postId: "6", note: "Performance optimization reference", createdAt: "2024-03-10T11:00:00Z" },
  { id: "9", userId: "10", postId: "12", note: "Lambda patterns", createdAt: "2024-06-10T08:00:00Z" },
  { id: "10", userId: "11", postId: "29", note: "Testing strategies", createdAt: "2024-11-12T10:00:00Z" },
];

// -----------------------------------------------------------------------------
// SEED DATA - Notifications
// -----------------------------------------------------------------------------

const seedNotifications: Notification[] = [
  { id: "1", userId: "1", type: "comment", title: "New comment", message: "Bob commented on your post", read: true, relatedPostId: "1", relatedUserId: "2", createdAt: "2023-06-16T08:00:00Z" },
  { id: "2", userId: "1", type: "like", title: "New like", message: "Your post received a like", read: true, relatedPostId: "1", relatedUserId: "5", createdAt: "2023-06-17T10:00:00Z" },
  { id: "3", userId: "1", type: "follow", title: "New follower", message: "Charlie started following you", read: true, relatedPostId: null, relatedUserId: "3", createdAt: "2023-07-15T09:00:00Z" },
  { id: "4", userId: "2", type: "mention", title: "You were mentioned", message: "Alice mentioned you in a comment", read: false, relatedPostId: "1", relatedUserId: "1", createdAt: "2024-11-01T10:00:00Z" },
  { id: "5", userId: "3", type: "system", title: "Welcome!", message: "Welcome to the platform. Start by exploring posts.", read: true, relatedPostId: null, relatedUserId: null, createdAt: "2023-03-10T09:15:00Z" },
  { id: "6", userId: "1", type: "comment", title: "New reply", message: "Someone replied to your comment", read: false, relatedPostId: "7", relatedUserId: "11", createdAt: "2024-11-28T14:00:00Z" },
  { id: "7", userId: "9", type: "like", title: "Post liked", message: "Your React performance post was liked", read: false, relatedPostId: "6", relatedUserId: "15", createdAt: "2024-11-29T10:00:00Z" },
  { id: "8", userId: "3", type: "follow", title: "New follower", message: "Sam started following you", read: false, relatedPostId: null, relatedUserId: "19", createdAt: "2024-11-30T08:00:00Z" },
];

// -----------------------------------------------------------------------------
// SEED DATA - Media
// -----------------------------------------------------------------------------

const seedMedia: Media[] = [
  { id: "1", uploaderId: "1", filename: "graphql-diagram.png", mimeType: "image/png", size: 245000, url: "https://picsum.photos/seed/media1/1200/800", thumbnailUrl: "https://picsum.photos/seed/media1/300/200", alt: "GraphQL architecture diagram", width: 1200, height: 800, createdAt: "2023-06-10T08:00:00Z" },
  { id: "2", uploaderId: "1", filename: "caching-flowchart.png", mimeType: "image/png", size: 312000, url: "https://picsum.photos/seed/media2/1200/800", thumbnailUrl: "https://picsum.photos/seed/media2/300/200", alt: "Caching strategy flowchart", width: 1200, height: 800, createdAt: "2023-07-15T09:00:00Z" },
  { id: "3", uploaderId: "3", filename: "k8s-architecture.svg", mimeType: "image/svg+xml", size: 45000, url: "https://picsum.photos/seed/media3/1200/800", thumbnailUrl: "https://picsum.photos/seed/media3/300/200", alt: "Kubernetes architecture", width: 1200, height: 800, createdAt: "2024-03-10T06:00:00Z" },
  { id: "4", uploaderId: "9", filename: "react-lifecycle.png", mimeType: "image/png", size: 189000, url: "https://picsum.photos/seed/media4/1200/800", thumbnailUrl: "https://picsum.photos/seed/media4/300/200", alt: "React component lifecycle", width: 1200, height: 800, createdAt: "2024-02-25T09:00:00Z" },
  { id: "5", uploaderId: "4", filename: "security-checklist.pdf", mimeType: "application/pdf", size: 523000, url: "https://example.com/files/security-checklist.pdf", thumbnailUrl: null, alt: null, width: null, height: null, createdAt: "2024-03-28T10:00:00Z" },
];

// -----------------------------------------------------------------------------
// SEED DATA - Audit Logs (for admin testing)
// -----------------------------------------------------------------------------

const seedAuditLogs: AuditLog[] = [
  { id: "1", userId: "1", action: "create", entityType: "post", entityId: "1", oldValue: null, newValue: '{"title":"Introduction to GraphQL"}', ipAddress: "192.168.1.100", userAgent: "Mozilla/5.0", createdAt: "2023-06-10T08:00:00Z" },
  { id: "2", userId: "1", action: "update", entityType: "post", entityId: "1", oldValue: '{"title":"GraphQL Intro"}', newValue: '{"title":"Introduction to GraphQL: A Complete Guide"}', ipAddress: "192.168.1.100", userAgent: "Mozilla/5.0", createdAt: "2024-01-15T14:30:00Z" },
  { id: "3", userId: "1", action: "delete", entityType: "comment", entityId: "999", oldValue: '{"content":"Spam comment"}', newValue: null, ipAddress: "192.168.1.100", userAgent: "Mozilla/5.0", createdAt: "2024-11-01T10:00:00Z" },
  { id: "4", userId: "19", action: "update", entityType: "user", entityId: "14", oldValue: '{"status":"active"}', newValue: '{"status":"suspended"}', ipAddress: "10.0.0.50", userAgent: "Mozilla/5.0", createdAt: "2024-11-15T10:00:00Z" },
];

// -----------------------------------------------------------------------------
// INITIALIZE DATA
// -----------------------------------------------------------------------------

seedUsers.forEach(u => users.set(u.id, u));
seedCategories.forEach(c => categories.set(c.id, c));
seedTags.forEach(t => tags.set(t.id, t));
seedPosts.forEach(p => posts.set(p.id, p));
seedComments.forEach(c => comments.set(c.id, c));
seedLikes.forEach(l => likes.set(l.id, l));
seedFollows.forEach(f => follows.set(f.id, f));
seedBookmarks.forEach(b => bookmarks.set(b.id, b));
seedNotifications.forEach(n => notifications.set(n.id, n));
seedMedia.forEach(m => media.set(m.id, m));
seedAuditLogs.forEach(a => auditLogs.set(a.id, a));

// -----------------------------------------------------------------------------
// ID GENERATORS
// -----------------------------------------------------------------------------

let nextIds = {
  user: 21,
  category: 13,
  tag: 21,
  post: 31,
  comment: 51,
  like: likeId,
  follow: 26,
  bookmark: 11,
  notification: 9,
  media: 6,
  auditLog: 5,
};

export const generateId = (type: keyof typeof nextIds) => String(nextIds[type]++);
