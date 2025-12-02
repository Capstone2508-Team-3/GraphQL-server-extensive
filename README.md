# GraphQL Server

GraphQL server with in-memory data for testing edge caching.

## Setup

```bash
npm install
npm run dev
```

Server runs at http://localhost:4000/graphql

## Deployment

### EC2 Setup

1. Launch instance (Amazon Linux 2023 or Ubuntu 22.04)
2. Install Node.js:
   ```bash
   # Amazon Linux 2023
   sudo dnf install nodejs -y
   
   # Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Deploy:
   ```bash
   git clone <repo> /home/ec2-user/graphql-server
   cd /home/ec2-user/graphql-server
   npm install
   npm run build
   npm install -g pm2
   pm2 start dist/index.js --name graphql-server
   pm2 startup
   pm2 save
   ```

### Nginx (Optional)

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

## Schema

**Users**: id, name, email, role (admin/user/guest), createdAt

**Posts**: id, title, content, authorId, published, createdAt, updatedAt

**Comments**: id, postId, authorId, content, createdAt

## Queries

```graphql
query {
  users {
    id
    name
    email
    role
  }
}

query {
  user(id: "1") {
    name
    posts {
      title
      published
    }
  }
}

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

query {
  stats {
    userCount
    postCount
    commentCount
    publishedPostCount
  }
}
```

## Mutations

```graphql
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

mutation {
  updatePost(id: "1", input: {
    title: "Updated Title"
  }) {
    id
    title
    updatedAt
  }
}

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

## Orion Configuration

Update `orion.json`:

```json
{
  "origin": {
    "url": "http://your-ec2-ip:4000/graphql"
  }
}
```

Run `orion init` or `orion deploy` to apply changes. No authentication required.

