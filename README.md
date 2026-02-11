# Recall Backend

Backend API for the Recall application.

## Available Scripts

### `npm start`
Starts the server using the compiled JavaScript from the `dist` folder.

### `npm run build`
Compiles TypeScript files from `src` to `dist` folder.

### `npm run dev`
Builds and starts the server.

### `npm run seed`
Builds the project and runs the database seeding script.

### `npm run bundle`
Bundles all TypeScript files from the `src` folder into a single file (`bundled-code.txt`) with file names as separators. Useful for code reviews, documentation, or sharing the entire codebase structure.

**Output**: The bundled code is written to `bundled-code.txt` in the project root directory.

**Example output format**:
```
================================================================================
BUNDLED CODE - All TypeScript files from src folder
Generated at: 2026-02-11T10:12:25.702Z
Total files: 17
================================================================================

/==============================================================================\
| File 1/17: controllers/contentController.ts
\==============================================================================/

[File contents here]

/==============================================================================\
| File 2/17: controllers/userController.ts
\==============================================================================/

[File contents here]

...
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Start the server:
   ```bash
   npm start
   ```
