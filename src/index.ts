// =============================================================================
// ORION GRAPHQL SERVER - Extended Edition
// =============================================================================

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { users, posts, comments, categories, tags, follows, bookmarks, likes, notifications, media, auditLogs } from "./data.js";

const PORT = parseInt(process.env.PORT || "4000", 10);

async function main() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: PORT, host: "0.0.0.0" },
  });

  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                        ORION GRAPHQL SERVER                                  ║
║                          Extended Edition                                    ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  Endpoint: ${url.padEnd(65)}║
╠══════════════════════════════════════════════════════════════════════════════╣
║  DATA SUMMARY                                                                ║
║  ────────────────────────────────────────────────────────────────────────    ║
║  Users:         ${String(users.size).padEnd(8)} Categories:    ${String(categories.size).padEnd(8)} Tags:      ${String(tags.size).padEnd(8)}  ║
║  Posts:         ${String(posts.size).padEnd(8)} Comments:      ${String(comments.size).padEnd(8)} Likes:     ${String(likes.size).padEnd(8)}  ║
║  Follows:       ${String(follows.size).padEnd(8)} Bookmarks:     ${String(bookmarks.size).padEnd(8)} Media:     ${String(media.size).padEnd(8)}  ║
║  Notifications: ${String(notifications.size).padEnd(8)} Audit Logs:    ${String(auditLogs.size).padEnd(8)}                   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  FEATURES                                                                    ║
║  ────────────────────────────────────────────────────────────────────────    ║
║  ✓ 20 Users with roles (admin, moderator, author, user, guest)               ║
║  ✓ 30 Posts with statuses (published, draft, scheduled, archived)            ║
║  ✓ 50 Comments with nested replies                                           ║
║  ✓ 12 Categories with hierarchy                                              ║
║  ✓ 20 Tags with usage counts                                                 ║
║  ✓ Social features (likes, follows, bookmarks)                               ║
║  ✓ Cursor & offset pagination                                                ║
║  ✓ Search & filtering                                                        ║
║  ✓ Feed & recommendations                                                    ║
║  ✓ Analytics & stats                                                         ║
║  ✓ Bulk operations                                                           ║
║  ✓ Audit logging                                                             ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  EXAMPLE QUERIES                                                             ║
║  ────────────────────────────────────────────────────────────────────────    ║
║  # Complex nested query                                                      ║
║  {                                                                           ║
║    posts(filter: { status: published }, limit: 5, sort: { field: LIKE_COUNT, direction: DESC }) {
║      title                                                                   ║
║      author { name followers { name } }                                      ║
║      category { name parent { name } }                                       ║
║      tags { name usageCount }                                                ║
║      comments(limit: 3) { content replies { content } }                      ║
║    }                                                                         ║
║  }                                                                           ║
║                                                                              ║
║  # Search                                                                    ║
║  { search(query: "graphql") { posts { title } users { name } totalCount } }  ║
║                                                                              ║
║  # Cursor pagination                                                         ║
║  { postsConnection(first: 10) { edges { node { title } cursor } pageInfo { hasNextPage } } }
║                                                                              ║
║  # User with computed fields                                                 ║
║  { user(id: "1") { name postCount followerCount isFollowedBy(userId: "2") } }║
╠══════════════════════════════════════════════════════════════════════════════╣
║  EXAMPLE MUTATIONS                                                           ║
║  ────────────────────────────────────────────────────────────────────────    ║
║  mutation { createPost(input: { title: "Test", content: "...", authorId: "1", categoryId: "1" }) { id } }
║  mutation { likePost(postId: "1", userId: "2") { id } }                      ║
║  mutation { followUser(followerId: "3", followingId: "1") { id } }           ║
║  mutation { bulkPublishPosts(ids: ["21", "22"]) { count } }                  ║
╚══════════════════════════════════════════════════════════════════════════════╝
  `);
}

main().catch(console.error);
