# Educatronic Web Project

Full-stack web project for **Educatronic**, with:
- a **C backend** using the **Mongoose embedded web server** (REST + static web hosting), and
- a **Preact** frontend (Webpack + Tailwind).

Repository: https://github.com/almanzamarfrancisco/educatronic_web_project

---

## Project structure

- `backend_mongoose/`  
  C backend + embedded web server (mongoose), database utilities, program logic, and web root.
  Notable files:
  - `server.c`, `server.h` – HTTP server setup / routes
  - `database_management.c`, `database_management.h` – DB access helpers
  - `program_logic.c`, `program_logic.h` – core application logic
  - `mongoose.c`, `mongoose.h` – Mongoose library source
  - `web_root/` – static files served by the backend (if used)
  - `Makefile` – build/run targets
  - `migration.sql`, `migrate.c`, `seeder.c` – DB migration/seed tooling (if used)
  - `educatronic.db` – local SQLite database file (dev)

- `front-end_preact/`  
  Preact UI app.
  Notable files:
  - `package.json` – scripts and dependencies
  - `src/` – application source code
  - `public/` – static assets
  - `webpack.config.js` – bundler configuration
  - `tailwind.config.js` – Tailwind configuration
  - `tests/` – frontend tests (Jest)

- `reverseDeploy.sh`, `watch-and-sync.sh`  
  Utility scripts to help deploy/sync during development (project-specific).

---

## Requirements

### Backend
- `gcc` / `make`
- (Likely) Linux/macOS recommended

### Frontend
- Node.js + Yarn (or npm)
- Recommended: Yarn (because `yarn.lock` is present)

---

## Getting started

### 1) Clone
```bash
git clone https://github.com/almanzamarfrancisco/educatronic_web_project.git
cd educatronic_web_project
```

### 2) Run the backend (C + Mongoose)
```bash
cd backend_mongoose
make
# If the Makefile provides a run target, it may be:
# make run
```

If there is no `make run` target, check the `Makefile` for the correct command/target names.

### 3) Run the frontend (Preact)
```bash
cd ../front-end_preact
yarn install
yarn start
# or (depending on package.json scripts)
# yarn dev
```

---

## Configuration

This project may require environment- or machine-specific configuration (ports, DB path, device/UART settings).

Suggested places to check:
- `backend_mongoose/server.c`
- `backend_mongoose/program_logic.c`
- `backend_mongoose/database_management.c`
- `front-end_preact/src/` (API base URL)

---

## Database

The backend folder includes:
- `educatronic.db` (local DB file)
- `migration.sql` and helper programs (`migrate.c`, `seeder.c`) for setting up / seeding

Typical workflow (names may vary; check the `Makefile`):
```bash
cd backend_mongoose
# make migrate
# make seed
```

---

## Testing

### Frontend tests
```bash
cd front-end_preact
yarn test
```

### Backend tests
There is a `backend_mongoose/unit_tests/` directory. Check inside for how to build/run the tests.

---

## Scripts

- `watch-and-sync.sh` – development helper (watch + sync)
- `reverseDeploy.sh` – deployment helper

Open the scripts to understand expected paths/hosts and customize them to your environment.

---

## Contributing

PRs and issues are welcome. If you plan to make bigger changes:
1. Open an issue describing the change.
2. Create a feature branch.
3. Add tests
