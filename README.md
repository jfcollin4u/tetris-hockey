# Tetris Hockey Monorepo

A Tetris game built as a monorepo with Next.js frontend and shared packages.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Project Structure

```
.
├── apps/
│   └── web/          # Next.js frontend application
├── packages/
│   └── shared/       # Shared types and game logic
└── package.json      # Root workspace configuration
```

## Controls

- **Arrow Left/Right**: Move piece horizontally
- **Arrow Down**: Soft drop
- **Arrow Up**: Rotate piece
- **Space**: Hard drop
- **P**: Pause/Resume

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
