# GameHub

Full-stack learning project: `Backend/` (Java 21, Spring Boot 4.1.1, Maven) and `Frontend/` (React 19, Vite 8, Tailwind v4, React Router 7 — JavaScript, no TypeScript). Two independent apps; no root package/manifest. `PROGRESS.md` is the living inventory of what exists and what's verified — read it before planning, and update it when a feature is completed. `plan.md` holds the original plan.

## Commands

```powershell
# Backend (all commands run from Backend/, Windows wrapper is .cmd)
cd Backend
.\mvnw.cmd clean compile   # verify backend (no tests exist yet)
.\mvnw.cmd spring-boot:run # run on :8080

# Frontend (from Frontend/)
npm run lint               # eslint — main check
npm run build              # vite build — verify too
npm run dev                # dev server on :5173
```

There are no automated front- or backend tests yet — verification = compile + lint + build + manual curl/browser checks. No test scripts exist in `Frontend/package.json`.

## Environment

- `Backend/.env` (untracked, loaded by dotenv-java into system properties at `BackendApplication` startup): `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `RAWG_API_KEY`, `JWT_SECRET`. Postgres is remote (Neon), so backend startup fails without it.
- `Frontend/.env`: `VITE_API_BASE_URL=http://localhost:8080/api`.
- Schema changes require a new Flyway migration `Vn__*.sql` in `src/main/resources/db/migration/` (currently V1–V2). Never edit an already-applied migration. `ddl-auto=none`.

## Gotchas learned the hard way

- **Spring component scanning** starts at `BackendApplication`'s package (`com.gamehub.backend`). Classes in sibling/parent packages are silently ignored — keep everything under it (`PasswordConfig` sits in the root package, that's intentional).
- **Jackson 3 requires JavaBean getters.** `getid()` was silently dropped from JSON — a nonstandard getter name looks fine but the field vanishes from responses. Public standard `getX()` only.
- **CORS**: a `@CrossOrigin` annotation on a controller masks a broken global CORS config. The real setup is the `CorsConfigurationSource` bean in `SecurityConfig`, wired explicitly via `.cors(cors -> cors.configurationSource(...))` (`.cors(withDefaults())` alone did NOT pick it up). Origin is `http://localhost:5173` for `/api/**`.
- **Auth flow pattern**: controllers read the authenticated principal from `SecurityContext` (populated by `security/JwtAuthenticationFilter`); JWT is HS256 (`jwt.secret` ← `JWT_SECRET`). New protected endpoints follow the `UserController`/`ProfileController` pattern.
- **localStorage keys are `user_Data` and `token`** — exact casing matters; a lowercase `user_data` typo caused a real bug.
- The exception package used to be misspelled `execption`; it was renamed to `com.gamehub.backend.exception` on 2026-10-20 (folder + package statements + imports together). Don't reintroduce the old spelling.
- **Neon `DB_URL` contains `&channel_binding=require`; passing any URL with `&` as a `-D` arg through `mvnw.cmd` gets split by cmd/s batch parsing** (symptoms: `user 'null'`, `'channel_binding' is not recognized as a command`). For Flyway plugin goals (`flyway:repair/migrate/validate/info`), pass credentials via `-Dflyway.configFiles=<temp .conf>` (lines `flyway.url=...`, `flyway.user=...`, `flyway.password=...`) generated from `Backend/.env` at runtime and deleted after; keep secrets out of `pom.xml` and out of the transcript.

## Conventions

- React Router: canonical home is `/home`; `/` redirects with `replace`. Protected pages (`/library`, `/profile`) are wrapped in `PrivateRoute`.
- Frontend service modules (`src/services/*.js`) attach `Authorization: Bearer` manually from localStorage; feature calls not yet built should follow `profileService.js`.
- React hooks lint (`react-hooks`) is strict here — e.g., don't call `setState` directly in effects (that broke lint before).

## Also apply

- Game data comes from the RAWG API, proxied through the backend (`/api/games*` endpoints) — the key must stay server-side.
