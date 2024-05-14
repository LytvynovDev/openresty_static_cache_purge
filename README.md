# Openresty static server with cache purge

## Description

- Implements an Openresty setup for serving static images
- Caches an image for after 2nd request
- Allow purging cache for a specific image

## Commands

- Start: `docker compose up -d`
- Stop: `docker compose down`

## Tests

### Description

Tests are located in `__tests__` folder and show how caching and purging works.
`X-Cache-Status` header indicates if the image was obtained from cache.

### Usage

1. Go to tests folder: `cd __tests__`
2. Install dependencies: `npm install`
3. Run tests: `npm test`