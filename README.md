# Orion GraphQL Server

A simple, self-contained GraphQL server for testing edge caching with Orion.

## Features

- **No external database** - uses in-memory data
- **Full CRUD operations** - Users, Posts, Comments
- **Nested resolvers** - test complex queries
- **Mutations** - test cache invalidation
- **GraphQL Playground** - for interactive testing

## Local Development

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# Or build and run production
npm run build
npm start
```

Server starts at http://localhost:4000/graphql

## Deploy to EC2

### 1. Launch EC2 Instance

- **AMI**: Amazon Linux 2023 or Ubuntu 22.04
- **Instance Type**: t3.micro (free tier) or larger
- **Security Group**: Allow inbound on port 4000 (or 80/443 with reverse proxy)

### 2. Install Node.js

```bash
# Amazon Linux 2023
sudo dnf install nodejs -y

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Deploy the Server

```bash
# Clone or copy files to EC2
git clone <your-repo> /home/ec2-user/graphql-server
cd /home/ec2-user/graphql-server

# Install and build
npm install
npm run build

# Run with PM2 (recommended for production)
npm install -g pm2
pm2 start dist/index.js --name graphql-server
pm2 startup
pm2 save
```

### 4. (Optional) Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Data Model

### Users
| Field | Type | Description |
|-------|------|-------------|
| id | ID | Unique identifier |
| name | String | Full name |
| email | String | Email address |
| role | Enum | admin, user, guest |
| createdAt | String | ISO timestamp |

### Posts
| Field | Type | Description |
|-------|------|-------------|
| id | ID | Unique identifier |
| title | String | Post title |
| content | String | Post content |
| authorId | ID | Reference to User |
| published | Boolean | Publication status |
| createdAt | String | ISO timestamp |
| updatedAt | String | ISO timestamp |

### Comments
| Field | Type | Description |
|-------|------|-------------|
| id | ID | Unique identifier |
| postId | ID | Reference to Post |
| authorId | ID | Reference to User |
| content | String | Comment text |
| createdAt | String | ISO timestamp |

## Example Queries

```graphql
# Get all users
query {
  users {
    id
    name
    email
    role
  }
}

# Get user with their posts
query {
  user(id: "1") {
    name
    posts {
      title
      published
    }
  }
}

# Get published posts with authors
query {
  posts(published: true) {
    id
    title
    author {
      name
    }
    comments {
      content
      author {
        name
      }
    }
  }
}

# Get stats
query {
  stats {
    userCount
    postCount
    commentCount
    publishedPostCount
  }
}
```

## Example Mutations

```graphql
# Create a user
mutation {
  createUser(input: {
    name: "New User"
    email: "new@example.com"
    role: user
  }) {
    id
    name
  }
}

# Create a post
mutation {
  createPost(input: {
    title: "My Post"
    content: "This is the content"
    authorId: "1"
    published: true
  }) {
    id
    title
  }
}

# Update a post (triggers cache invalidation)
mutation {
  updatePost(id: "1", input: {
    title: "Updated Title"
  }) {
    id
    title
    updatedAt
  }
}

# Add a comment
mutation {
  createComment(input: {
    postId: "1"
    authorId: "2"
    content: "Great post!"
  }) {
    id
    content
  }
}
```

## Update Orion to Use This Server

1. Update `orion.json`:
```json
{
  "origin": {
    "url": "http://your-ec2-ip:4000/graphql"
  }
}
```

2. Run `orion init` or `orion deploy` to update the configuration.

3. Since this server doesn't require authentication, you can skip `orion config` for auth headers.

