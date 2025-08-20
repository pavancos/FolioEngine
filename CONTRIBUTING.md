# Contributing to Xenfolio

This guide explains how to add a new folio (template), test it locally, and open a pull request.

## Quick checklist

- Fork the repository.
- Create a branch named `newFolio/<folio-name>`.
- Implement the folio function and a matching metadata JSON file.
- Test locally (generate `public/<folio>.html`).
- Open a PR with a short description and demo link/screenshots.

## Branch & folio naming

- Branch: `newFolio/<folio-name>` (e.g. `newFolio/stellar`).
- Folio name rules:
    - single word
    - lowercase
    - unique (don't duplicate existing folio names such as `classic` or `minimal`)

## Folio function contract

Each folio is a single function that accepts a `folioConfig` object and returns a string containing a complete HTML page. Keep these constraints in mind:

- Location: put the TypeScript file under `src/folios/`.
- Export: named export matching the folio file (e.g. `export function stellar(data:any) { ... }`).
- Output: full HTML string (include <!DOCTYPE html>, <head>, and <body>). Keep the page single-file (styles inline or via CDN) and produce a single `index.html`-like output.
- Deterministic: given the same `folioConfig` input the function should produce consistent output.

Example signature:

```ts
export function myfolio(folioConfig: any): string {
    // return full HTML as string
}
```

## Metadata JSON

Add a JSON file describing your folio (helps maintainers and the UI). Append it to the `folios.json`. Example minimal structure:

```json
{
    "folioName": "stellar",
    "folioAvatar": "https://example.com/avatar.png",
    "creator": {
        "developedBy": [
            {
                "name": "Your Name",
                "githubUserName": "your-github"
            },
            // You can Add more
        ]
    }
}
```

Notes:
- Use accessible image URLs for `folioAvatar`.
- Keep `folioName` consistent with the function/file name.

## Local testing

We provide a small test runner that writes the generated HTML into `public/<folioName>.html`.

Run the test for a folio (example for `classic`):

```bash
npm run testFolio classic
```

This will create `public/classic.html`. Serve the `public` directory with the app (the server serves `public/` as static files). If you want prettier URLs (no `.html`), the server also maps `/:folioName` to `public/<folioName>.html`.

## Submit a PR

When your folio is ready:

1. Push your branch: `git push origin newFolio/<folio-name>`.
2. Open a Pull Request against `new-be` branch.
3. In your PR description include:
     - Folio name and short description
     - Screenshot or link to a live demo (optional)
     - Any special notes or external assets required

## Need help?

Open an issue or ask in the PR comments. Include reproduction steps and the folio branch name.

Thank you for contributing!