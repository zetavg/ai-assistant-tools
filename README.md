# AI Assistant Tools

Tools that can be used by AI assistants.

## Development

1. `npm install`
2. `cp .env.example .env`
3. `npm run dev`

## Deploy

There are various ways to deploy this project.

### Google Cloud Run

Create a `.gcloud-run-env-vars.yaml` to store the environment variables you want to use in Google Cloud Run, then run:

```bash
gcloud run deploy --source . --env-vars-file .gcloud-run-env-vars.yaml
```

You can also specify the service name and region while running the command, like this:

```bash
gcloud run deploy my-service-name --source . --env-vars-file .gcloud-run-env-vars.yaml --region asia-northeast1
```

Example YAML content:

```yaml
API_KEY: "..."
ANOTHER_ENV_VAR: "..."
```

## Usage

### Dify

Click "Create Custom Tool" and enter the following:

```yaml
openapi: 3.0.0
info:
  title: AI Assistant Tools
  version: 1.0.0
servers:
  - url: https://<your-deployment-url>
paths:
  # Fill in the endpoints here
```

Then, go to `https://<your-deployment-url>/openapi.yaml` and copy-paste the paths you want to use.

If you have set `API_KEY`, choose "API Key" as the authentication method and enter the value of `API_KEY`.
