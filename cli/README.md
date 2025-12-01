# Orion CLI

A minimal CLI tool for setting up GraphQL edge caching with Fastly.

## Quick Start

```bash
# Install dependencies
npm install

# Build the CLI
npm run build

# Run commands
node dist/index.js init      # Configure your origin
node dist/index.js deploy    # Deploy infrastructure
node dist/index.js status    # Check status
```

## Commands

### `orion init`

Interactive wizard that asks for:
- Your GraphQL origin URL (e.g., `https://api.example.com/graphql`)
- Service name
- AWS region

Updates the Terraform configuration files with your settings.

### `orion deploy`

Provisions infrastructure by running:
1. `terraform init`
2. `terraform validate`
3. `terraform plan`
4. `terraform apply`
5. Builds the Compute@Edge service

**Options:**
- `--plan` - Dry run, shows what would be deployed
- `--auto-approve` - Skip Terraform confirmation prompts

### `orion status`

Shows current configuration and deployment status.

## Environment Variables

Before deploying, create a `.env` file in `terraform-fastly-prototype/`:

```bash
# terraform-fastly-prototype/.env
FASTLY_API_KEY=your-fastly-api-token
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

Or export them manually:

```bash
export FASTLY_API_KEY="your-fastly-api-token"
export AWS_ACCESS_KEY_ID="your-aws-key"
export AWS_SECRET_ACCESS_KEY="your-aws-secret"
```

## Development

```bash
# Run without building (uses tsx)
npm run dev -- init
npm run dev -- status
```

