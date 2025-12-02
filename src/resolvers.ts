// =============================================================================
// GRAPHQL RESOLVERS - Extended for Complex Query Testing
// =============================================================================

import {
  users, posts, comments, categories, tags, likes, follows,
  bookmarks, notifications, media, auditLogs, generateId,
  type User, type Post, type Comment, type Category, type Tag,
  type Like, type Follow, type Bookmark, type Notification, type Media,
} from "./data.js";

// -----------------------------------------------------------------------------
// HELPER FUNCTIONS
// -----------------------------------------------------------------------------

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function applyPagination<T>(items: T[], limit?: number, offset?: number): T[] {
  const start = offset ?? 0;
  const end = limit ? start + limit : undefined;
  return items.slice(start, end);
}

function encodeCursor(id: string): string {
  return Buffer.from(id).toString("base64");
}

function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, "base64").toString("utf-8");
}

// -----------------------------------------------------------------------------
// RESOLVERS
// -----------------------------------------------------------------------------

export const resolvers = {
  // ===========================================================================
  // QUERY RESOLVERS
  // ===========================================================================
  Query: {
    // Single lookups
    user: (_: unknown, { id, username }: { id?: string; username?: string }) => {
      if (id) return users.get(id) ?? null;
      if (username) return Array.from(users.values()).find(u => u.username === username) ?? null;
      return null;
    },

    post: (_: unknown, { id, slug }: { id?: string; slug?: string }) => {
      if (id) return posts.get(id) ?? null;
      if (slug) return Array.from(posts.values()).find(p => p.slug === slug) ?? null;
      return null;
    },

    category: (_: unknown, { id, slug }: { id?: string; slug?: string }) => {
      if (id) return categories.get(id) ?? null;
      if (slug) return Array.from(categories.values()).find(c => c.slug === slug) ?? null;
      return null;
    },

    tag: (_: unknown, { id, slug }: { id?: string; slug?: string }) => {
      if (id) return tags.get(id) ?? null;
      if (slug) return Array.from(tags.values()).find(t => t.slug === slug) ?? null;
      return null;
    },

    comment: (_: unknown, { id }: { id: string }) => comments.get(id) ?? null,
    notification: (_: unknown, { id }: { id: string }) => notifications.get(id) ?? null,
    media: (_: unknown, { id }: { id: string }) => media.get(id) ?? null,

    // List queries
    users: (_: unknown, args: { limit?: number; offset?: number; filter?: any; sort?: any }) => {
      let result = Array.from(users.values());

      // Apply filters
      if (args.filter) {
        const f = args.filter;
        if (f.role) result = result.filter(u => u.role === f.role);
        if (f.status) result = result.filter(u => u.status === f.status);
        if (f.search) {
          const q = f.search.toLowerCase();
          result = result.filter(u => 
            u.name.toLowerCase().includes(q) || 
            u.username.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
          );
        }
        if (f.createdAfter) result = result.filter(u => u.createdAt >= f.createdAfter);
        if (f.createdBefore) result = result.filter(u => u.createdAt <= f.createdBefore);
      }

      // Apply sorting
      if (args.sort) {
        const dir = args.sort.direction === "DESC" ? -1 : 1;
        result.sort((a, b) => {
          switch (args.sort.field) {
            case "NAME": return dir * a.name.localeCompare(b.name);
            case "USERNAME": return dir * a.username.localeCompare(b.username);
            case "CREATED_AT": return dir * a.createdAt.localeCompare(b.createdAt);
            default: return 0;
          }
        });
      }

      return applyPagination(result, args.limit, args.offset);
    },

    posts: (_: unknown, args: { limit?: number; offset?: number; filter?: any; sort?: any }) => {
      let result = Array.from(posts.values());

      // Apply filters
      if (args.filter) {
        const f = args.filter;
        if (f.status) result = result.filter(p => p.status === f.status);
        if (f.visibility) result = result.filter(p => p.visibility === f.visibility);
        if (f.categoryId) result = result.filter(p => p.categoryId === f.categoryId);
        if (f.authorId) result = result.filter(p => p.authorId === f.authorId);
        if (f.tagIds?.length) result = result.filter(p => f.tagIds.some((t: string) => p.tagIds.includes(t)));
        if (f.search) {
          const q = f.search.toLowerCase();
          result = result.filter(p => 
            p.title.toLowerCase().includes(q) || 
            p.content.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q)
          );
        }
        if (f.publishedAfter) result = result.filter(p => p.publishedAt && p.publishedAt >= f.publishedAfter);
        if (f.publishedBefore) result = result.filter(p => p.publishedAt && p.publishedAt <= f.publishedBefore);
        if (f.minViewCount) result = result.filter(p => p.viewCount >= f.minViewCount);
        if (f.minLikeCount) result = result.filter(p => p.likeCount >= f.minLikeCount);
      }

      // Apply sorting
      if (args.sort) {
        const dir = args.sort.direction === "DESC" ? -1 : 1;
        result.sort((a, b) => {
          switch (args.sort.field) {
            case "TITLE": return dir * a.title.localeCompare(b.title);
            case "CREATED_AT": return dir * a.createdAt.localeCompare(b.createdAt);
            case "UPDATED_AT": return dir * a.updatedAt.localeCompare(b.updatedAt);
            case "PUBLISHED_AT": return dir * (a.publishedAt ?? "").localeCompare(b.publishedAt ?? "");
            case "VIEW_COUNT": return dir * (a.viewCount - b.viewCount);
            case "LIKE_COUNT": return dir * (a.likeCount - b.likeCount);
            case "COMMENT_COUNT": return dir * (a.commentCount - b.commentCount);
            default: return 0;
          }
        });
      } else {
        // Default: newest first
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      }

      return applyPagination(result, args.limit, args.offset);
    },

    categories: (_: unknown, { parentId }: { parentId?: string }) => {
      let result = Array.from(categories.values());
      if (parentId === null) result = result.filter(c => c.parentId === null);
      else if (parentId) result = result.filter(c => c.parentId === parentId);
      return result.sort((a, b) => a.sortOrder - b.sortOrder);
    },

    tags: (_: unknown, { limit, orderByUsage }: { limit?: number; orderByUsage?: boolean }) => {
      let result = Array.from(tags.values());
      if (orderByUsage) result.sort((a, b) => b.usageCount - a.usageCount);
      else result.sort((a, b) => a.name.localeCompare(b.name));
      return limit ? result.slice(0, limit) : result;
    },

    comments: (_: unknown, args: { filter?: any; limit?: number; offset?: number }) => {
      let result = Array.from(comments.values());
      
      if (args.filter) {
        const f = args.filter;
        if (f.postId) result = result.filter(c => c.postId === f.postId);
        if (f.authorId) result = result.filter(c => c.authorId === f.authorId);
        if (f.status) result = result.filter(c => c.status === f.status);
        if (f.parentId === null) result = result.filter(c => c.parentId === null);
        else if (f.parentId) result = result.filter(c => c.parentId === f.parentId);
      }

      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return applyPagination(result, args.limit, args.offset);
    },

    notifications: (_: unknown, { userId, unreadOnly, limit }: { userId: string; unreadOnly?: boolean; limit?: number }) => {
      let result = Array.from(notifications.values()).filter(n => n.userId === userId);
      if (unreadOnly) result = result.filter(n => !n.read);
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return limit ? result.slice(0, limit) : result;
    },

    mediaList: (_: unknown, { uploaderId, limit }: { uploaderId?: string; limit?: number }) => {
      let result = Array.from(media.values());
      if (uploaderId) result = result.filter(m => m.uploaderId === uploaderId);
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return limit ? result.slice(0, limit) : result;
    },

    auditLogs: (_: unknown, { entityType, entityId, limit }: { entityType?: string; entityId?: string; limit?: number }) => {
      let result = Array.from(auditLogs.values());
      if (entityType) result = result.filter(a => a.entityType === entityType);
      if (entityId) result = result.filter(a => a.entityId === entityId);
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return limit ? result.slice(0, limit) : result;
    },

    // Cursor pagination
    postsConnection: (_: unknown, args: { first?: number; after?: string; filter?: any; sort?: any }) => {
      let result = Array.from(posts.values());
      
      // Apply same filters as posts query
      if (args.filter) {
        const f = args.filter;
        if (f.status) result = result.filter(p => p.status === f.status);
        if (f.visibility) result = result.filter(p => p.visibility === f.visibility);
        if (f.categoryId) result = result.filter(p => p.categoryId === f.categoryId);
        if (f.authorId) result = result.filter(p => p.authorId === f.authorId);
      }

      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const totalCount = result.length;

      // Apply cursor
      if (args.after) {
        const afterId = decodeCursor(args.after);
        const afterIndex = result.findIndex(p => p.id === afterId);
        if (afterIndex >= 0) result = result.slice(afterIndex + 1);
      }

      const first = args.first ?? 10;
      const hasNextPage = result.length > first;
      const edges = result.slice(0, first).map(post => ({
        node: post,
        cursor: encodeCursor(post.id),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!args.after,
          startCursor: edges[0]?.cursor ?? null,
          endCursor: edges[edges.length - 1]?.cursor ?? null,
          totalCount,
        },
      };
    },

    usersConnection: (_: unknown, args: { first?: number; after?: string; filter?: any; sort?: any }) => {
      let result = Array.from(users.values());
      result.sort((a, b) => a.name.localeCompare(b.name));
      const totalCount = result.length;

      if (args.after) {
        const afterId = decodeCursor(args.after);
        const afterIndex = result.findIndex(u => u.id === afterId);
        if (afterIndex >= 0) result = result.slice(afterIndex + 1);
      }

      const first = args.first ?? 10;
      const hasNextPage = result.length > first;
      const edges = result.slice(0, first).map(user => ({
        node: user,
        cursor: encodeCursor(user.id),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!args.after,
          startCursor: edges[0]?.cursor ?? null,
          endCursor: edges[edges.length - 1]?.cursor ?? null,
          totalCount,
        },
      };
    },

    commentsConnection: (_: unknown, args: { first?: number; after?: string; filter?: any }) => {
      let result = Array.from(comments.values());
      
      if (args.filter?.postId) {
        result = result.filter(c => c.postId === args.filter.postId);
      }
      
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      const totalCount = result.length;

      if (args.after) {
        const afterId = decodeCursor(args.after);
        const afterIndex = result.findIndex(c => c.id === afterId);
        if (afterIndex >= 0) result = result.slice(afterIndex + 1);
      }

      const first = args.first ?? 10;
      const hasNextPage = result.length > first;
      const edges = result.slice(0, first).map(comment => ({
        node: comment,
        cursor: encodeCursor(comment.id),
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!args.after,
          startCursor: edges[0]?.cursor ?? null,
          endCursor: edges[edges.length - 1]?.cursor ?? null,
          totalCount,
        },
      };
    },

    // Search
    search: (_: unknown, { query, types }: { query: string; types?: string[] }) => {
      const q = query.toLowerCase();
      const searchTypes = types ?? ["posts", "users", "comments", "tags"];

      const foundPosts = searchTypes.includes("posts") 
        ? Array.from(posts.values()).filter(p => 
            p.status === "published" && (
              p.title.toLowerCase().includes(q) || 
              p.content.toLowerCase().includes(q)
            )
          ).slice(0, 10)
        : [];

      const foundUsers = searchTypes.includes("users")
        ? Array.from(users.values()).filter(u =>
            u.name.toLowerCase().includes(q) ||
            u.username.toLowerCase().includes(q)
          ).slice(0, 10)
        : [];

      const foundComments = searchTypes.includes("comments")
        ? Array.from(comments.values()).filter(c =>
            c.status === "approved" && c.content.toLowerCase().includes(q)
          ).slice(0, 10)
        : [];

      const foundTags = searchTypes.includes("tags")
        ? Array.from(tags.values()).filter(t =>
            t.name.toLowerCase().includes(q)
          ).slice(0, 10)
        : [];

      return {
        posts: foundPosts,
        users: foundUsers,
        comments: foundComments,
        tags: foundTags,
        totalCount: foundPosts.length + foundUsers.length + foundComments.length + foundTags.length,
      };
    },

    // Stats
    stats: () => {
      const allPosts = Array.from(posts.values());
      return {
        userCount: users.size,
        postCount: posts.size,
        publishedPostCount: allPosts.filter(p => p.status === "published").length,
        draftPostCount: allPosts.filter(p => p.status === "draft").length,
        commentCount: comments.size,
        categoryCount: categories.size,
        tagCount: tags.size,
        totalViews: allPosts.reduce((sum, p) => sum + p.viewCount, 0),
        totalLikes: allPosts.reduce((sum, p) => sum + p.likeCount, 0),
      };
    },

    userStats: (_: unknown, { userId }: { userId: string }) => {
      const userPosts = Array.from(posts.values()).filter(p => p.authorId === userId);
      const userComments = Array.from(comments.values()).filter(c => c.authorId === userId);
      const followers = Array.from(follows.values()).filter(f => f.followingId === userId);
      const following = Array.from(follows.values()).filter(f => f.followerId === userId);

      return {
        totalPosts: userPosts.length,
        totalViews: userPosts.reduce((sum, p) => sum + p.viewCount, 0),
        totalLikes: userPosts.reduce((sum, p) => sum + p.likeCount, 0),
        totalComments: userComments.length,
        totalFollowers: followers.length,
        totalFollowing: following.length,
      };
    },

    postAnalytics: (_: unknown, { postId }: { postId: string }) => {
      const post = posts.get(postId);
      if (!post) return null;

      // Generate mock time series data
      const viewsOverTime = [];
      const likesOverTime = [];
      for (let i = 30; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        viewsOverTime.push({ date, count: Math.floor(Math.random() * 500) });
        likesOverTime.push({ date, count: Math.floor(Math.random() * 20) });
      }

      return {
        post,
        viewsOverTime,
        likesOverTime,
        topReferrers: [
          { source: "google.com", count: 1234 },
          { source: "twitter.com", count: 567 },
          { source: "reddit.com", count: 234 },
          { source: "direct", count: 189 },
        ],
      };
    },

    // Feed & recommendations
    feed: (_: unknown, { userId, limit, offset }: { userId: string; limit?: number; offset?: number }) => {
      // Get posts from users that the current user follows
      const following = Array.from(follows.values())
        .filter(f => f.followerId === userId)
        .map(f => f.followingId);

      let result = Array.from(posts.values())
        .filter(p => p.status === "published" && following.includes(p.authorId))
        .sort((a, b) => (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt));

      return applyPagination(result, limit ?? 20, offset);
    },

    trending: (_: unknown, { limit, period }: { limit?: number; period?: string }) => {
      // Simple trending: sort by view count + like count
      return Array.from(posts.values())
        .filter(p => p.status === "published")
        .sort((a, b) => (b.viewCount + b.likeCount * 10) - (a.viewCount + a.likeCount * 10))
        .slice(0, limit ?? 10);
    },

    recommended: (_: unknown, { userId, limit }: { userId?: string; limit?: number }) => {
      // Simple recommendations: posts from same categories as user's bookmarks
      let recommendedPosts: Post[] = [];

      if (userId) {
        const userBookmarks = Array.from(bookmarks.values()).filter(b => b.userId === userId);
        const bookmarkedCategories = new Set(
          userBookmarks.map(b => posts.get(b.postId)?.categoryId).filter(Boolean)
        );

        recommendedPosts = Array.from(posts.values())
          .filter(p => 
            p.status === "published" && 
            bookmarkedCategories.has(p.categoryId) &&
            !userBookmarks.some(b => b.postId === p.id)
          );
      }

      if (recommendedPosts.length === 0) {
        // Fallback: return popular posts
        recommendedPosts = Array.from(posts.values())
          .filter(p => p.status === "published")
          .sort((a, b) => b.likeCount - a.likeCount);
      }

      return recommendedPosts.slice(0, limit ?? 10);
    },
  },

  // ===========================================================================
  // MUTATION RESOLVERS
  // ===========================================================================
  Mutation: {
    // User mutations
    createUser: (_: unknown, { input }: { input: any }) => {
      const now = new Date().toISOString();
      const user: User = {
        id: generateId("user"),
        username: input.username,
        email: input.email,
        name: input.name,
        bio: input.bio ?? null,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${input.username}`,
        role: input.role ?? "user",
        status: "pending",
        preferences: { theme: "system", emailNotifications: true, language: "en", timezone: "UTC" },
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      };
      users.set(user.id, user);
      return user;
    },

    updateUser: (_: unknown, { id, input }: { id: string; input: any }) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, ...input, updatedAt: new Date().toISOString() };
      users.set(id, updated);
      return updated;
    },

    updateUserPreferences: (_: unknown, { userId, input }: { userId: string; input: any }) => {
      const user = users.get(userId);
      if (!user) return null;
      const updated = {
        ...user,
        preferences: { ...user.preferences, ...input },
        updatedAt: new Date().toISOString(),
      };
      users.set(userId, updated);
      return updated;
    },

    deleteUser: (_: unknown, { id }: { id: string }) => {
      const success = users.delete(id);
      return { success, id };
    },

    suspendUser: (_: unknown, { id }: { id: string }) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, status: "suspended" as const, updatedAt: new Date().toISOString() };
      users.set(id, updated);
      return updated;
    },

    activateUser: (_: unknown, { id }: { id: string }) => {
      const user = users.get(id);
      if (!user) return null;
      const updated = { ...user, status: "active" as const, updatedAt: new Date().toISOString() };
      users.set(id, updated);
      return updated;
    },

    // Post mutations
    createPost: (_: unknown, { input }: { input: any }) => {
      const now = new Date().toISOString();
      const post: Post = {
        id: generateId("post"),
        title: input.title,
        slug: slugify(input.title),
        excerpt: input.excerpt ?? input.content.substring(0, 200) + "...",
        content: input.content,
        authorId: input.authorId,
        categoryId: input.categoryId,
        tagIds: input.tagIds ?? [],
        status: input.status ?? "draft",
        visibility: input.visibility ?? "public",
        featuredImageUrl: input.featuredImageUrl ?? null,
        readingTimeMinutes: calculateReadingTime(input.content),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        publishedAt: input.status === "published" ? now : null,
        scheduledAt: null,
        createdAt: now,
        updatedAt: now,
      };
      posts.set(post.id, post);
      
      // Update tag usage counts
      post.tagIds.forEach(tagId => {
        const tag = tags.get(tagId);
        if (tag) tags.set(tagId, { ...tag, usageCount: tag.usageCount + 1 });
      });

      return post;
    },

    updatePost: (_: unknown, { id, input }: { id: string; input: any }) => {
      const post = posts.get(id);
      if (!post) return null;
      const now = new Date().toISOString();
      const updated: Post = {
        ...post,
        ...input,
        slug: input.title ? slugify(input.title) : post.slug,
        readingTimeMinutes: input.content ? calculateReadingTime(input.content) : post.readingTimeMinutes,
        updatedAt: now,
      };
      posts.set(id, updated);
      return updated;
    },

    deletePost: (_: unknown, { id }: { id: string }) => {
      const success = posts.delete(id);
      // Also delete associated comments
      for (const [cid, comment] of comments) {
        if (comment.postId === id) comments.delete(cid);
      }
      return { success, id };
    },

    publishPost: (_: unknown, { id }: { id: string }) => {
      const post = posts.get(id);
      if (!post) return null;
      const now = new Date().toISOString();
      const updated = { ...post, status: "published" as const, publishedAt: now, updatedAt: now };
      posts.set(id, updated);
      return updated;
    },

    unpublishPost: (_: unknown, { id }: { id: string }) => {
      const post = posts.get(id);
      if (!post) return null;
      const updated = { ...post, status: "draft" as const, publishedAt: null, updatedAt: new Date().toISOString() };
      posts.set(id, updated);
      return updated;
    },

    schedulePost: (_: unknown, { id, publishAt }: { id: string; publishAt: string }) => {
      const post = posts.get(id);
      if (!post) return null;
      const updated = { ...post, status: "scheduled" as const, scheduledAt: publishAt, updatedAt: new Date().toISOString() };
      posts.set(id, updated);
      return updated;
    },

    archivePost: (_: unknown, { id }: { id: string }) => {
      const post = posts.get(id);
      if (!post) return null;
      const updated = { ...post, status: "archived" as const, updatedAt: new Date().toISOString() };
      posts.set(id, updated);
      return updated;
    },

    incrementViewCount: (_: unknown, { id }: { id: string }) => {
      const post = posts.get(id);
      if (!post) return null;
      const updated = { ...post, viewCount: post.viewCount + 1 };
      posts.set(id, updated);
      return updated;
    },

    // Category mutations
    createCategory: (_: unknown, { input }: { input: any }) => {
      const category: Category = {
        id: generateId("category"),
        name: input.name,
        slug: input.slug,
        description: input.description,
        parentId: input.parentId ?? null,
        color: input.color ?? "#3B82F6",
        icon: input.icon ?? "folder",
        sortOrder: categories.size + 1,
        createdAt: new Date().toISOString(),
      };
      categories.set(category.id, category);
      return category;
    },

    updateCategory: (_: unknown, { id, input }: { id: string; input: any }) => {
      const category = categories.get(id);
      if (!category) return null;
      const updated = { ...category, ...input };
      categories.set(id, updated);
      return updated;
    },

    deleteCategory: (_: unknown, { id }: { id: string }) => {
      const success = categories.delete(id);
      return { success, id };
    },

    // Tag mutations
    createTag: (_: unknown, { input }: { input: any }) => {
      const tag: Tag = {
        id: generateId("tag"),
        name: input.name,
        slug: input.slug,
        usageCount: 0,
      };
      tags.set(tag.id, tag);
      return tag;
    },

    updateTag: (_: unknown, { id, input }: { id: string; input: any }) => {
      const tag = tags.get(id);
      if (!tag) return null;
      const updated = { ...tag, ...input };
      tags.set(id, updated);
      return updated;
    },

    deleteTag: (_: unknown, { id }: { id: string }) => {
      const success = tags.delete(id);
      return { success, id };
    },

    mergeTags: (_: unknown, { sourceId, targetId }: { sourceId: string; targetId: string }) => {
      const source = tags.get(sourceId);
      const target = tags.get(targetId);
      if (!source || !target) return null;

      // Update all posts using source tag to use target tag
      for (const [pid, post] of posts) {
        if (post.tagIds.includes(sourceId)) {
          const newTagIds = post.tagIds.filter(t => t !== sourceId);
          if (!newTagIds.includes(targetId)) newTagIds.push(targetId);
          posts.set(pid, { ...post, tagIds: newTagIds });
        }
      }

      // Update target usage count and delete source
      const updated = { ...target, usageCount: target.usageCount + source.usageCount };
      tags.set(targetId, updated);
      tags.delete(sourceId);

      return updated;
    },

    // Comment mutations
    createComment: (_: unknown, { input }: { input: any }) => {
      const now = new Date().toISOString();
      const comment: Comment = {
        id: generateId("comment"),
        postId: input.postId,
        authorId: input.authorId,
        parentId: input.parentId ?? null,
        content: input.content,
        status: "pending",
        likeCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      comments.set(comment.id, comment);

      // Update post comment count
      const post = posts.get(input.postId);
      if (post) {
        posts.set(post.id, { ...post, commentCount: post.commentCount + 1 });
      }

      return comment;
    },

    updateComment: (_: unknown, { id, content }: { id: string; content: string }) => {
      const comment = comments.get(id);
      if (!comment) return null;
      const updated = { ...comment, content, updatedAt: new Date().toISOString() };
      comments.set(id, updated);
      return updated;
    },

    deleteComment: (_: unknown, { id }: { id: string }) => {
      const comment = comments.get(id);
      if (!comment) return { success: false, id };
      
      // Update post comment count
      const post = posts.get(comment.postId);
      if (post) {
        posts.set(post.id, { ...post, commentCount: Math.max(0, post.commentCount - 1) });
      }

      const success = comments.delete(id);
      return { success, id };
    },

    approveComment: (_: unknown, { id }: { id: string }) => {
      const comment = comments.get(id);
      if (!comment) return null;
      const updated = { ...comment, status: "approved" as const, updatedAt: new Date().toISOString() };
      comments.set(id, updated);
      return updated;
    },

    markCommentAsSpam: (_: unknown, { id }: { id: string }) => {
      const comment = comments.get(id);
      if (!comment) return null;
      const updated = { ...comment, status: "spam" as const, updatedAt: new Date().toISOString() };
      comments.set(id, updated);
      return updated;
    },

    // Social mutations
    likePost: (_: unknown, { postId, userId }: { postId: string; userId: string }) => {
      const like: Like = {
        id: generateId("like"),
        userId,
        targetType: "post",
        targetId: postId,
        createdAt: new Date().toISOString(),
      };
      likes.set(like.id, like);

      // Update post like count
      const post = posts.get(postId);
      if (post) {
        posts.set(postId, { ...post, likeCount: post.likeCount + 1 });
      }

      return like;
    },

    unlikePost: (_: unknown, { postId, userId }: { postId: string; userId: string }) => {
      const like = Array.from(likes.values()).find(
        l => l.targetType === "post" && l.targetId === postId && l.userId === userId
      );
      if (!like) return { success: false, id: "" };

      likes.delete(like.id);

      // Update post like count
      const post = posts.get(postId);
      if (post) {
        posts.set(postId, { ...post, likeCount: Math.max(0, post.likeCount - 1) });
      }

      return { success: true, id: like.id };
    },

    likeComment: (_: unknown, { commentId, userId }: { commentId: string; userId: string }) => {
      const like: Like = {
        id: generateId("like"),
        userId,
        targetType: "comment",
        targetId: commentId,
        createdAt: new Date().toISOString(),
      };
      likes.set(like.id, like);

      // Update comment like count
      const comment = comments.get(commentId);
      if (comment) {
        comments.set(commentId, { ...comment, likeCount: comment.likeCount + 1 });
      }

      return like;
    },

    unlikeComment: (_: unknown, { commentId, userId }: { commentId: string; userId: string }) => {
      const like = Array.from(likes.values()).find(
        l => l.targetType === "comment" && l.targetId === commentId && l.userId === userId
      );
      if (!like) return { success: false, id: "" };

      likes.delete(like.id);

      // Update comment like count
      const comment = comments.get(commentId);
      if (comment) {
        comments.set(commentId, { ...comment, likeCount: Math.max(0, comment.likeCount - 1) });
      }

      return { success: true, id: like.id };
    },

    followUser: (_: unknown, { followerId, followingId }: { followerId: string; followingId: string }) => {
      const follow: Follow = {
        id: generateId("follow"),
        followerId,
        followingId,
        createdAt: new Date().toISOString(),
      };
      follows.set(follow.id, follow);
      return follow;
    },

    unfollowUser: (_: unknown, { followerId, followingId }: { followerId: string; followingId: string }) => {
      const follow = Array.from(follows.values()).find(
        f => f.followerId === followerId && f.followingId === followingId
      );
      if (!follow) return { success: false, id: "" };
      follows.delete(follow.id);
      return { success: true, id: follow.id };
    },

    bookmarkPost: (_: unknown, { userId, postId, note }: { userId: string; postId: string; note?: string }) => {
      const bookmark: Bookmark = {
        id: generateId("bookmark"),
        userId,
        postId,
        note: note ?? null,
        createdAt: new Date().toISOString(),
      };
      bookmarks.set(bookmark.id, bookmark);
      return bookmark;
    },

    removeBookmark: (_: unknown, { userId, postId }: { userId: string; postId: string }) => {
      const bookmark = Array.from(bookmarks.values()).find(
        b => b.userId === userId && b.postId === postId
      );
      if (!bookmark) return { success: false, id: "" };
      bookmarks.delete(bookmark.id);
      return { success: true, id: bookmark.id };
    },

    // Notification mutations
    markNotificationRead: (_: unknown, { id }: { id: string }) => {
      const notification = notifications.get(id);
      if (!notification) return null;
      const updated = { ...notification, read: true };
      notifications.set(id, updated);
      return updated;
    },

    markAllNotificationsRead: (_: unknown, { userId }: { userId: string }) => {
      let count = 0;
      for (const [id, notification] of notifications) {
        if (notification.userId === userId && !notification.read) {
          notifications.set(id, { ...notification, read: true });
          count++;
        }
      }
      return count;
    },

    deleteNotification: (_: unknown, { id }: { id: string }) => {
      const success = notifications.delete(id);
      return { success, id };
    },

    // Media mutations
    createMedia: (_: unknown, { input }: { input: any }) => {
      const mediaItem: Media = {
        id: generateId("media"),
        ...input,
        createdAt: new Date().toISOString(),
      };
      media.set(mediaItem.id, mediaItem);
      return mediaItem;
    },

    updateMedia: (_: unknown, { id, input }: { id: string; input: any }) => {
      const mediaItem = media.get(id);
      if (!mediaItem) return null;
      const updated = { ...mediaItem, ...input };
      media.set(id, updated);
      return updated;
    },

    deleteMedia: (_: unknown, { id }: { id: string }) => {
      const success = media.delete(id);
      return { success, id };
    },

    // Bulk operations
    bulkDeletePosts: (_: unknown, { ids }: { ids: string[] }) => {
      const deleted: string[] = [];
      ids.forEach(id => {
        if (posts.delete(id)) deleted.push(id);
      });
      return { success: deleted.length > 0, count: deleted.length, ids: deleted };
    },

    bulkPublishPosts: (_: unknown, { ids }: { ids: string[] }) => {
      const published: string[] = [];
      const now = new Date().toISOString();
      ids.forEach(id => {
        const post = posts.get(id);
        if (post) {
          posts.set(id, { ...post, status: "published", publishedAt: now, updatedAt: now });
          published.push(id);
        }
      });
      return { success: published.length > 0, count: published.length, ids: published };
    },

    bulkDeleteComments: (_: unknown, { ids }: { ids: string[] }) => {
      const deleted: string[] = [];
      ids.forEach(id => {
        if (comments.delete(id)) deleted.push(id);
      });
      return { success: deleted.length > 0, count: deleted.length, ids: deleted };
    },
  },

  // ===========================================================================
  // TYPE RESOLVERS
  // ===========================================================================
  User: {
    posts: (parent: User, { limit, offset, status }: { limit?: number; offset?: number; status?: string }) => {
      let result = Array.from(posts.values()).filter(p => p.authorId === parent.id);
      if (status) result = result.filter(p => p.status === status);
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return applyPagination(result, limit, offset);
    },
    comments: (parent: User, { limit }: { limit?: number }) => {
      const result = Array.from(comments.values())
        .filter(c => c.authorId === parent.id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return limit ? result.slice(0, limit) : result;
    },
    bookmarks: (parent: User) => {
      return Array.from(bookmarks.values()).filter(b => b.userId === parent.id);
    },
    notifications: (parent: User, { unreadOnly }: { unreadOnly?: boolean }) => {
      let result = Array.from(notifications.values()).filter(n => n.userId === parent.id);
      if (unreadOnly) result = result.filter(n => !n.read);
      return result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    followers: (parent: User) => {
      const followerIds = Array.from(follows.values())
        .filter(f => f.followingId === parent.id)
        .map(f => f.followerId);
      return followerIds.map(id => users.get(id)).filter(Boolean);
    },
    following: (parent: User) => {
      const followingIds = Array.from(follows.values())
        .filter(f => f.followerId === parent.id)
        .map(f => f.followingId);
      return followingIds.map(id => users.get(id)).filter(Boolean);
    },
    postCount: (parent: User) => {
      return Array.from(posts.values()).filter(p => p.authorId === parent.id).length;
    },
    followerCount: (parent: User) => {
      return Array.from(follows.values()).filter(f => f.followingId === parent.id).length;
    },
    followingCount: (parent: User) => {
      return Array.from(follows.values()).filter(f => f.followerId === parent.id).length;
    },
    isFollowedBy: (parent: User, { userId }: { userId: string }) => {
      return Array.from(follows.values()).some(f => f.followerId === userId && f.followingId === parent.id);
    },
  },

  Category: {
    parent: (parent: Category) => parent.parentId ? categories.get(parent.parentId) : null,
    children: (parent: Category) => {
      return Array.from(categories.values())
        .filter(c => c.parentId === parent.id)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },
    posts: (parent: Category, { limit, status }: { limit?: number; status?: string }) => {
      let result = Array.from(posts.values()).filter(p => p.categoryId === parent.id);
      if (status) result = result.filter(p => p.status === status);
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return limit ? result.slice(0, limit) : result;
    },
    postCount: (parent: Category) => {
      return Array.from(posts.values()).filter(p => p.categoryId === parent.id && p.status === "published").length;
    },
  },

  Tag: {
    posts: (parent: Tag, { limit }: { limit?: number }) => {
      const result = Array.from(posts.values())
        .filter(p => p.tagIds.includes(parent.id) && p.status === "published")
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return limit ? result.slice(0, limit) : result;
    },
  },

  Post: {
    author: (parent: Post) => users.get(parent.authorId),
    category: (parent: Post) => categories.get(parent.categoryId),
    tags: (parent: Post) => parent.tagIds.map(id => tags.get(id)).filter(Boolean),
    comments: (parent: Post, { limit, status }: { limit?: number; status?: string }) => {
      let result = Array.from(comments.values()).filter(c => c.postId === parent.id && c.parentId === null);
      if (status) result = result.filter(c => c.status === status);
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      return limit ? result.slice(0, limit) : result;
    },
    relatedPosts: (parent: Post, { limit }: { limit?: number }) => {
      // Find posts in same category or with same tags
      const related = Array.from(posts.values())
        .filter(p => 
          p.id !== parent.id && 
          p.status === "published" &&
          (p.categoryId === parent.categoryId || p.tagIds.some(t => parent.tagIds.includes(t)))
        )
        .sort((a, b) => b.likeCount - a.likeCount);
      return (limit ? related.slice(0, limit) : related.slice(0, 5));
    },
    isLikedBy: (parent: Post, { userId }: { userId: string }) => {
      return Array.from(likes.values()).some(l => l.targetType === "post" && l.targetId === parent.id && l.userId === userId);
    },
    isBookmarkedBy: (parent: Post, { userId }: { userId: string }) => {
      return Array.from(bookmarks.values()).some(b => b.postId === parent.id && b.userId === userId);
    },
  },

  Comment: {
    post: (parent: Comment) => posts.get(parent.postId),
    author: (parent: Comment) => users.get(parent.authorId),
    parent: (parent: Comment) => parent.parentId ? comments.get(parent.parentId) : null,
    replies: (parent: Comment, { limit }: { limit?: number }) => {
      const result = Array.from(comments.values())
        .filter(c => c.parentId === parent.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      return limit ? result.slice(0, limit) : result;
    },
    replyCount: (parent: Comment) => {
      return Array.from(comments.values()).filter(c => c.parentId === parent.id).length;
    },
    isLikedBy: (parent: Comment, { userId }: { userId: string }) => {
      return Array.from(likes.values()).some(l => l.targetType === "comment" && l.targetId === parent.id && l.userId === userId);
    },
  },

  Like: {
    user: (parent: Like) => users.get(parent.userId),
    post: (parent: Like) => parent.targetType === "post" ? posts.get(parent.targetId) : null,
    comment: (parent: Like) => parent.targetType === "comment" ? comments.get(parent.targetId) : null,
  },

  Follow: {
    follower: (parent: Follow) => users.get(parent.followerId),
    following: (parent: Follow) => users.get(parent.followingId),
  },

  Bookmark: {
    user: (parent: Bookmark) => users.get(parent.userId),
    post: (parent: Bookmark) => posts.get(parent.postId),
  },

  Notification: {
    user: (parent: Notification) => users.get(parent.userId),
    relatedPost: (parent: Notification) => parent.relatedPostId ? posts.get(parent.relatedPostId) : null,
    relatedUser: (parent: Notification) => parent.relatedUserId ? users.get(parent.relatedUserId) : null,
  },

  Media: {
    uploader: (parent: Media) => users.get(parent.uploaderId),
  },

  AuditLog: {
    user: (parent: { userId: string }) => users.get(parent.userId),
  },
};
