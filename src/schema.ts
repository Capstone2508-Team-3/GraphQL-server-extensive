// =============================================================================
// GRAPHQL SCHEMA - Extended for Complex Query Testing
// =============================================================================

export const typeDefs = `#graphql
  # -----------------------------------------------------------------------------
  # ENUMS
  # -----------------------------------------------------------------------------
  enum Role {
    admin
    moderator
    author
    user
    guest
  }

  enum UserStatus {
    active
    suspended
    pending
  }

  enum Theme {
    light
    dark
    system
  }

  enum PostStatus {
    draft
    published
    archived
    scheduled
  }

  enum Visibility {
    public
    private
    members
  }

  enum CommentStatus {
    approved
    pending
    spam
    deleted
  }

  enum NotificationType {
    like
    comment
    follow
    mention
    system
  }

  enum SortDirection {
    ASC
    DESC
  }

  # -----------------------------------------------------------------------------
  # TYPES
  # -----------------------------------------------------------------------------
  type User {
    id: ID!
    username: String!
    email: String!
    name: String!
    bio: String
    avatarUrl: String
    role: Role!
    status: UserStatus!
    preferences: UserPreferences!
    createdAt: String!
    updatedAt: String!
    lastLoginAt: String

    # Relations
    posts(limit: Int, offset: Int, status: PostStatus): [Post!]!
    comments(limit: Int): [Comment!]!
    bookmarks: [Bookmark!]!
    notifications(unreadOnly: Boolean): [Notification!]!
    followers: [User!]!
    following: [User!]!
    
    # Computed
    postCount: Int!
    followerCount: Int!
    followingCount: Int!
    isFollowedBy(userId: ID!): Boolean!
  }

  type UserPreferences {
    theme: Theme!
    emailNotifications: Boolean!
    language: String!
    timezone: String!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String!
    color: String!
    icon: String!
    sortOrder: Int!
    createdAt: String!
    
    # Relations
    parent: Category
    children: [Category!]!
    posts(limit: Int, status: PostStatus): [Post!]!
    
    # Computed
    postCount: Int!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
    usageCount: Int!
    
    # Relations
    posts(limit: Int): [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    slug: String!
    excerpt: String!
    content: String!
    status: PostStatus!
    visibility: Visibility!
    featuredImageUrl: String
    readingTimeMinutes: Int!
    viewCount: Int!
    likeCount: Int!
    commentCount: Int!
    publishedAt: String
    scheduledAt: String
    createdAt: String!
    updatedAt: String!
    
    # Relations
    author: User!
    category: Category!
    tags: [Tag!]!
    comments(limit: Int, status: CommentStatus): [Comment!]!
    relatedPosts(limit: Int): [Post!]!
    
    # Computed
    isLikedBy(userId: ID!): Boolean!
    isBookmarkedBy(userId: ID!): Boolean!
  }

  type Comment {
    id: ID!
    content: String!
    status: CommentStatus!
    likeCount: Int!
    createdAt: String!
    updatedAt: String!
    
    # Relations
    post: Post!
    author: User!
    parent: Comment
    replies(limit: Int): [Comment!]!
    
    # Computed
    replyCount: Int!
    isLikedBy(userId: ID!): Boolean!
  }

  type Like {
    id: ID!
    targetType: String!
    targetId: ID!
    createdAt: String!
    
    user: User!
    post: Post
    comment: Comment
  }

  type Follow {
    id: ID!
    createdAt: String!
    
    follower: User!
    following: User!
  }

  type Bookmark {
    id: ID!
    note: String
    createdAt: String!
    
    user: User!
    post: Post!
  }

  type Notification {
    id: ID!
    type: NotificationType!
    title: String!
    message: String!
    read: Boolean!
    createdAt: String!
    
    user: User!
    relatedPost: Post
    relatedUser: User
  }

  type Media {
    id: ID!
    filename: String!
    mimeType: String!
    size: Int!
    url: String!
    thumbnailUrl: String
    alt: String
    width: Int
    height: Int
    createdAt: String!
    
    uploader: User!
  }

  type AuditLog {
    id: ID!
    action: String!
    entityType: String!
    entityId: ID!
    oldValue: String
    newValue: String
    ipAddress: String!
    userAgent: String!
    createdAt: String!
    
    user: User!
  }

  # -----------------------------------------------------------------------------
  # AGGREGATES & STATS
  # -----------------------------------------------------------------------------
  type Stats {
    userCount: Int!
    postCount: Int!
    publishedPostCount: Int!
    draftPostCount: Int!
    commentCount: Int!
    categoryCount: Int!
    tagCount: Int!
    totalViews: Int!
    totalLikes: Int!
  }

  type UserStats {
    totalPosts: Int!
    totalViews: Int!
    totalLikes: Int!
    totalComments: Int!
    totalFollowers: Int!
    totalFollowing: Int!
  }

  type PostAnalytics {
    post: Post!
    viewsOverTime: [TimeSeriesPoint!]!
    likesOverTime: [TimeSeriesPoint!]!
    topReferrers: [ReferrerCount!]!
  }

  type TimeSeriesPoint {
    date: String!
    count: Int!
  }

  type ReferrerCount {
    source: String!
    count: Int!
  }

  # -----------------------------------------------------------------------------
  # PAGINATION
  # -----------------------------------------------------------------------------
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
    totalCount: Int!
  }

  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }

  type PostEdge {
    node: Post!
    cursor: String!
  }

  type UserConnection {
    edges: [UserEdge!]!
    pageInfo: PageInfo!
  }

  type UserEdge {
    node: User!
    cursor: String!
  }

  type CommentConnection {
    edges: [CommentEdge!]!
    pageInfo: PageInfo!
  }

  type CommentEdge {
    node: Comment!
    cursor: String!
  }

  # -----------------------------------------------------------------------------
  # SEARCH & FILTERS
  # -----------------------------------------------------------------------------
  input PostFilter {
    status: PostStatus
    visibility: Visibility
    categoryId: ID
    tagIds: [ID!]
    authorId: ID
    search: String
    publishedAfter: String
    publishedBefore: String
    minViewCount: Int
    minLikeCount: Int
  }

  input UserFilter {
    role: Role
    status: UserStatus
    search: String
    createdAfter: String
    createdBefore: String
  }

  input CommentFilter {
    postId: ID
    authorId: ID
    status: CommentStatus
    parentId: ID
  }

  enum PostSortField {
    CREATED_AT
    UPDATED_AT
    PUBLISHED_AT
    VIEW_COUNT
    LIKE_COUNT
    COMMENT_COUNT
    TITLE
  }

  enum UserSortField {
    CREATED_AT
    NAME
    USERNAME
    POST_COUNT
    FOLLOWER_COUNT
  }

  input PostSort {
    field: PostSortField!
    direction: SortDirection!
  }

  input UserSort {
    field: UserSortField!
    direction: SortDirection!
  }

  # -----------------------------------------------------------------------------
  # QUERIES
  # -----------------------------------------------------------------------------
  type Query {
    # Single entity lookups
    user(id: ID, username: String): User
    post(id: ID, slug: String): Post
    category(id: ID, slug: String): Category
    tag(id: ID, slug: String): Tag
    comment(id: ID!): Comment
    notification(id: ID!): Notification
    media(id: ID!): Media

    # List queries with basic pagination
    users(limit: Int, offset: Int, filter: UserFilter, sort: UserSort): [User!]!
    posts(limit: Int, offset: Int, filter: PostFilter, sort: PostSort): [Post!]!
    categories(parentId: ID): [Category!]!
    tags(limit: Int, orderByUsage: Boolean): [Tag!]!
    comments(filter: CommentFilter, limit: Int, offset: Int): [Comment!]!
    notifications(userId: ID!, unreadOnly: Boolean, limit: Int): [Notification!]!
    mediaList(uploaderId: ID, limit: Int): [Media!]!
    auditLogs(entityType: String, entityId: ID, limit: Int): [AuditLog!]!

    # Cursor-based pagination
    postsConnection(first: Int, after: String, filter: PostFilter, sort: PostSort): PostConnection!
    usersConnection(first: Int, after: String, filter: UserFilter, sort: UserSort): UserConnection!
    commentsConnection(first: Int, after: String, filter: CommentFilter): CommentConnection!

    # Search
    search(query: String!, types: [String!]): SearchResults!

    # Aggregates
    stats: Stats!
    userStats(userId: ID!): UserStats
    postAnalytics(postId: ID!): PostAnalytics

    # Feed & recommendations
    feed(userId: ID!, limit: Int, offset: Int): [Post!]!
    trending(limit: Int, period: String): [Post!]!
    recommended(userId: ID, limit: Int): [Post!]!
  }

  type SearchResults {
    posts: [Post!]!
    users: [User!]!
    comments: [Comment!]!
    tags: [Tag!]!
    totalCount: Int!
  }

  # -----------------------------------------------------------------------------
  # MUTATIONS
  # -----------------------------------------------------------------------------
  type Mutation {
    # User mutations
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User
    updateUserPreferences(userId: ID!, input: UpdatePreferencesInput!): User
    deleteUser(id: ID!): DeleteResult!
    suspendUser(id: ID!, reason: String): User
    activateUser(id: ID!): User

    # Post mutations
    createPost(input: CreatePostInput!): Post!
    updatePost(id: ID!, input: UpdatePostInput!): Post
    deletePost(id: ID!): DeleteResult!
    publishPost(id: ID!): Post
    unpublishPost(id: ID!): Post
    schedulePost(id: ID!, publishAt: String!): Post
    archivePost(id: ID!): Post
    incrementViewCount(id: ID!): Post

    # Category mutations
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category
    deleteCategory(id: ID!): DeleteResult!

    # Tag mutations
    createTag(input: CreateTagInput!): Tag!
    updateTag(id: ID!, input: UpdateTagInput!): Tag
    deleteTag(id: ID!): DeleteResult!
    mergeTags(sourceId: ID!, targetId: ID!): Tag

    # Comment mutations
    createComment(input: CreateCommentInput!): Comment!
    updateComment(id: ID!, content: String!): Comment
    deleteComment(id: ID!): DeleteResult!
    approveComment(id: ID!): Comment
    markCommentAsSpam(id: ID!): Comment

    # Social mutations
    likePost(postId: ID!, userId: ID!): Like!
    unlikePost(postId: ID!, userId: ID!): DeleteResult!
    likeComment(commentId: ID!, userId: ID!): Like!
    unlikeComment(commentId: ID!, userId: ID!): DeleteResult!
    followUser(followerId: ID!, followingId: ID!): Follow!
    unfollowUser(followerId: ID!, followingId: ID!): DeleteResult!
    bookmarkPost(userId: ID!, postId: ID!, note: String): Bookmark!
    removeBookmark(userId: ID!, postId: ID!): DeleteResult!

    # Notification mutations
    markNotificationRead(id: ID!): Notification
    markAllNotificationsRead(userId: ID!): Int!
    deleteNotification(id: ID!): DeleteResult!

    # Media mutations
    createMedia(input: CreateMediaInput!): Media!
    updateMedia(id: ID!, input: UpdateMediaInput!): Media
    deleteMedia(id: ID!): DeleteResult!

    # Bulk operations
    bulkDeletePosts(ids: [ID!]!): BulkResult!
    bulkPublishPosts(ids: [ID!]!): BulkResult!
    bulkDeleteComments(ids: [ID!]!): BulkResult!
  }

  type DeleteResult {
    success: Boolean!
    id: ID!
  }

  type BulkResult {
    success: Boolean!
    count: Int!
    ids: [ID!]!
  }

  # -----------------------------------------------------------------------------
  # INPUT TYPES
  # -----------------------------------------------------------------------------
  input CreateUserInput {
    username: String!
    email: String!
    name: String!
    bio: String
    role: Role = user
  }

  input UpdateUserInput {
    username: String
    email: String
    name: String
    bio: String
    avatarUrl: String
    role: Role
    status: UserStatus
  }

  input UpdatePreferencesInput {
    theme: Theme
    emailNotifications: Boolean
    language: String
    timezone: String
  }

  input CreatePostInput {
    title: String!
    content: String!
    excerpt: String
    authorId: ID!
    categoryId: ID!
    tagIds: [ID!]
    status: PostStatus = draft
    visibility: Visibility = public
    featuredImageUrl: String
  }

  input UpdatePostInput {
    title: String
    content: String
    excerpt: String
    categoryId: ID
    tagIds: [ID!]
    status: PostStatus
    visibility: Visibility
    featuredImageUrl: String
  }

  input CreateCategoryInput {
    name: String!
    slug: String!
    description: String!
    parentId: ID
    color: String = "#3B82F6"
    icon: String = "folder"
  }

  input UpdateCategoryInput {
    name: String
    slug: String
    description: String
    parentId: ID
    color: String
    icon: String
    sortOrder: Int
  }

  input CreateTagInput {
    name: String!
    slug: String!
  }

  input UpdateTagInput {
    name: String
    slug: String
  }

  input CreateCommentInput {
    postId: ID!
    authorId: ID!
    content: String!
    parentId: ID
  }

  input CreateMediaInput {
    uploaderId: ID!
    filename: String!
    mimeType: String!
    size: Int!
    url: String!
    thumbnailUrl: String
    alt: String
    width: Int
    height: Int
  }

  input UpdateMediaInput {
    filename: String
    alt: String
  }
`;
