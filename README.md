# FolioEngine

## Usage Guide

### Crafting Your Portfolio

1. **Login/Register**: Access the editor via the home page.
2. **Navigate to My Space**: Create a craft Bench.
3. **Edit Sections**:
   - **Personal Information**: Add your name, bio, and contact details.
   - **Projects**: Showcase your best work with descriptions and links.
   - **Skills**: Select from a curated list or add your own.
   - **Work Experience**: Detail your professional journey.
4. **Preview**: See how your folio looks before sharing.
5. **Publish**: Save and publish your folio for the world to see.

### Managing Folios

- **My Space**: View, edit, or delete your published folios.
- **Preview**: See how your folio looks before sharing.
- **Unpublish**: Remove a folio from public view at any time.

---

## Project Structure

The repository is primarily a server-side TypeScript project that generates and serves folio HTML. Key folders:

- `src/`
   - `src/index.ts` — Express server entrypoint
   - `src/folios/` — Folio template functions (e.g. `classic.ts`, `minimal.ts`)
   - `src/middlewares/` — Express middlewares (auth, preflight, etc.)
   - `src/models/` — Mongoose models (User, Folio, CraftBench)
   - `src/routes/` — Express route handlers (`auth.ts`, `folio.ts`, `craftBench.ts`)
   - `src/tests/` — Test scripts and utilities (e.g. `testFolio.ts`, `dbTest.ts`)
   - `src/types/` — TypeScript type definitions
   - `src/utils/` — Utility helpers (validation, config, external integrations)


## Frontend
If you are working on frontend UI, the project keeps the frontend in a separate repository.
The frontend is maintained in a separate repository:
https://github.com/vigneshvaranasi/XenFolio