# 3dcp-web

This is a repository for [3D Cultural Properties Project](https://3dcp.geofirm.info/).

## Links

- [Project Page（Notion）](https://code4japan-community.notion.site/3D-1d8a6c65652e800fb3ded17109a5369a)

## Setup

```bash
# clone repository
git clone git@github.com:mopinfish/3dcp-web.git
cd 3dcp-web
npm install

# copy env file for development
cp .env.development.local.example .env.development.local
# The back-end host should be rewritten as follows if you need.
echo 'NEXT_PUBLIC_BACKEND_API_HOST="https://my-django.fly.dev"' > .env.development.local

# start dev server. Go here: http://localhost:3000
npm run dev
```

## Luma.ai Model Management

The project includes scripts for managing Luma.ai 3D models and generating thumbnails:

```bash
# Fetch movie data from the backend API
npm run generate-luma-list

# Generate thumbnails for 3D models (skips existing ones)
npm run thumbnails

# Force regenerate all thumbnails
npm run thumbnails:force

# Update both movie data and thumbnails
npm run update-luma
```

For detailed documentation, see [Luma.ai Model Management Guide](./docs/LUMA_MODEL_MANAGEMENT.md).
