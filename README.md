# Soroban

Interactive soroban built with Vite, React, and TypeScript.

## Development

```bash
npm ci
npm run dev
```

The dev server listens on `0.0.0.0:8080`.

## Quality Checks

```bash
npm run format:check
npm run lint
npm test
npm run test:e2e
npm run build
```

## Production Build

```bash
npm ci
npm run build
```

The production build writes a static site to `dist/`. A successful build includes:

```text
dist/index.html
dist/assets/index-*.css
dist/assets/index-*.js
dist/favicon.svg
```

The generated `dist/index.html` references assets from `/assets/...`, so serve `dist`
as the web root. If hosting under a subpath, set Vite's `base` option before
building so asset URLs match that path.

## Local Production Preview

```bash
npm run build
npm run preview
```

The preview server also listens on `0.0.0.0:8080`.

## Self-Hosting `dist/`

Any static file server can host the build output. Build once, then point the
server document root at the `dist` directory:

```bash
npm run build
python3 -m http.server 8080 --bind 0.0.0.0 --directory dist
```

For Nginx, copy or sync the contents of `dist/` to the site root and serve
`index.html` for unknown paths:

```nginx
server {
  listen 80;
  server_name example.com;
  root /var/www/soroban/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

This app is a static browser app. It does not require a Node server or runtime
environment variables after `npm run build` completes.
