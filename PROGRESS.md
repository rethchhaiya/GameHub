# GameHub — Build Progress

A living inventory of **everything built so far** in GameHub. Companion to `plan.md`
(which holds the original plan and decisions). Update this file as features are completed.

Last updated: 2026-10-21

Status legend: **Done** · **Partial** · **Stub** (placeholder exists) · **Not started**

---

## Tech Stack (in use)

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router 7 |
| Backend | Java 21, Spring Boot 4.1.1 |
| Database | PostgreSQL (Neon), Flyway migrations |
| External API | RAWG (called by Spring Boot, key server-side) |
| Auth | Registration + login (verified); React auth context + `useAuth`; JWT: register/login return `{ token, user }`, token stored in `localStorage`; **`JwtAuthenticationFilter` authenticates requests** and **`GET /api/users/me` returns the current user** (both verified); frontend validates the session on boot and attaches `Authorization` to profile calls. Protected routes (`/library`, `/profile`) done |

---

## Frontend Inventory

Root: `Frontend/`

### Layout & chrome

| File | What it does | Status |
| --- | --- | --- |
| `src/App.jsx` | Renders `BrowserRouter` + `AppRoute` | Done |
| `src/main.jsx` | Mounts the app; wraps `<App/>` in `<AuthProvider>` | Done |
| `src/routes/index.jsx` | Route table nested under a layout route; `/library` and `/profile` wrapped in `PrivateRoute` | Done |
| `src/components/layouts/MainLayout.jsx` | Navbar + `<Outlet/>` + Footer; flex column pins footer | Done |
| `src/components/layouts/Navbar.jsx` | Brand, nav links (active highlight), responsive hamburger menu, auth links, Profile link when logged in | Done |
| `src/components/layouts/Footer.jsx` | Copyright + RAWG attribution, responsive | Done |

### Pages

| File | Route | What it does | Status |
| --- | --- | --- | --- |
| `src/pages/HomePage.jsx` | `/home` | Hero, CTA to Explore, three feature cards | Done |
| `src/pages/ExplorePage.jsx` | `/explore` | Game grid, search by name, loading/error/empty states | Done |
| `src/pages/GameDetailsPage.jsx` | `/game/:id` | Redesigned hero + two-column layout; details, genres/devs/publishers/platforms; screenshot gallery + lightbox (arrows, Esc, click-out); "Your library" card (status select → `addToLibrary`, 409 + signed-out states) | Done |
| `src/pages/LoginPage.jsx` | `/login` | Login form → `loginUser` → destructure `{token, user}` → `login(user, token)` → `navigate('/home')`; error display | Done |
| `src/pages/RegisterPage.jsx` | `/register` | Register form + confirm-password check → `registerUser` → `login(user, token)` → `navigate('/home')` | Done |
| `src/pages/ProfilePage.jsx` | `/profile` | Protected; loads the current profile (404 → empty form), edits `bio`/`avatarUrl`, live avatar preview, saves via `updateProfile`, error/success banners | Done |
| `src/pages/MyLibraryPage.jsx` | `/library` | Protected; loads entries, loading/error/empty states, per-entry status `<select>` → PUT, inline delete confirmation, busy guard | Done |
| `src/pages/CommunityPage.jsx` | `/community` | Placeholder | Stub |

`/` redirects to `/home` with `replace`.

### Components & services

| File | What it does | Status |
| --- | --- | --- |
| `src/components/GameCard.jsx` | Redesigned reusable card: artwork overlay, rating/Metacritic badges, ratings count, year, up to two genres, hover CTA | Done |
| `src/services/gameService.js` | Fetch list, search by name, detail, screenshots from backend | Done |
| `src/services/libraryService.js` | `getLibrary`, `addToLibrary` (POST), `updateStatus` (PUT), `deleteFromLibrary` (DELETE; handles 204); attach `Authorization`; normalized errors with `status`/`fieldErrors` | Done |
| `src/constants/libraryStatuses.js` | Single source for the four status `{ value, label }` options (library page + details page) | Done |
| `src/services/authService.js` | `registerUser`, `loginUser` (POST + normalized error with `status`/`fieldErrors`), `getCurrentUser` (GET `/users/me` with stored token) | Done |
| `src/services/profileService.js` | `getProfile` (GET `/profile/me`, returns `null` on 404) and `updateProfile` (PUT `/profile/me`); both attach `Authorization: Bearer <token>` | Done |
| `src/contexts/authContext.js` | Raw `AuthContext` (`createContext`) | Done |
| `src/contexts/AuthContext.jsx` | `AuthProvider`: holds current user; `login(user, token)` stores `user_Data` + `token`; `try/catch` self-heal if stored JSON is corrupt; `login` throws if user missing; `logout` clears both keys; boot `useEffect` validates the session via `getCurrentUser` (refresh on 200, logout on 401 only); `loading` initialized from the stored token and set false when boot validation finishes | Done |
| `src/hooks/useAuth.js` | `useAuth()` — `useContext(AuthContext)` | Done |
| `src/routes/PrivateRoute.jsx` | Route guard: `loading` → placeholder; no `user` → `<Navigate to="/login" replace />`; otherwise `<Outlet />` | Done |
| `src/assets/register.jpg` | Background image for the login/register pages | Done |

### Config

| File | Purpose |
| --- | --- |
| `src/index.css` | Tailwind import + dark base styles |
| `.env` | `VITE_API_BASE_URL=http://localhost:8080/api` |
| `eslint.config.js` | ESLint config |

### Frontend checks

```powershell
cd Frontend
npm run lint      # ESLint — passing
npm run build     # Vite production build — passing
npm run dev       # dev server
```

---

## Backend Inventory

Root: `Backend/`

| File / area | What it does | Status |
| --- | --- | --- |
| `.../entity/User.java` | Maps to `users` table | Done |
| `.../repository/UserRepository.java` | `findByEmail`, `existsByEmail` | Done |
| `.../dto/RegisterRequest.java` | Registration input + validation | Done |
| `.../dto/RegisterResponse.java` | Response without password hash; `getid()` renamed to `getId()` (2026-10-18) — Jackson 3 ignored the non-standard name and silently dropped `id` from JSON | Done |
| `.../controllers/UserController.java` | `GET /api/users/me` — reads principal from SecurityContext, returns `RegisterResponse` (`id`/`userName`/`email`) | Done |
| `.../dto/LoginRequest.java` | Login input + validation | Done |
| `.../dto/AuthResponse.java` | `{ token, user }` response body for register/login | Done |
| `.../services/UserService.java` | Register (hash + save) and login (verify) logic | Done |
| `.../controllers/AuthController.java` | `POST /api/auth/register`, `POST /api/auth/login` — both return `AuthResponse` (`{ token, user }`) via injected `JwtService` | Done |
| `.../controllers/GlobalExceptionHandler.java` | Maps errors to 400 (`MethodArgumentNotValidException`, `IllegalArgumentException`), 401, 404 (`ResourceNotFoundException`), 409 | Done |
| `.../exception/InvalidCredentialsException.java` | Invalid login credentials | Done |
| `.../exception/EmailAlreadyExistsException.java` | Duplicate email | Done |
| `.../PasswordConfig.java` | `BCryptPasswordEncoder` bean (root package, not a `config/` package) | Done |
| Game endpoints (`/api/games`, `/api/games-name`, `/api/games/{id}`, `/api/games/{id}/screenshots`) | Proxy RAWG through Spring Boot | Done |
| `resources/db/migration/V1__create_users_table.sql` | Creates `users` table | Done |
| `resources/application.properties` | DB config, `ddl-auto=none`, RAWG key from env, JWT config (`jwt.secret`, `jwt.expiration-ms`) | Done |
| `.../config/SecurityConfig.java` | `SecurityFilterChain`: public game/auth paths `permitAll`, rest `authenticated`, stateless, CSRF off; `CorsConfigurationSource` bean (origin 5173, `/api/**`) wired explicitly via `.cors(cors -> cors.configurationSource(...))`; 401 JSON entry point; JWT filter registered via `addFilterBefore` | Done |
| `.../services/JwtService.java` | Sign (`generateToken`) and verify (`parseToken`) HS256 tokens | Done |
| Pom dependencies | `spring-boot-starter-security` + jjwt 0.12.6 (`jjwt-api`/`jjwt-impl`/`jjwt-gson`) | Done |
| `.../security/JwtAuthenticationFilter.java` | Reads `Authorization: Bearer`, parses via `JwtService`, loads user via `UserService.findById`, sets `SecurityContextHolder`; fail-safe on invalid token; registered in `SecurityConfig` via `addFilterBefore` | Done |
| `.../services/UserService.java` (`findById`) | Delegates to `userRepository.findById`, returns `Optional<User>` | Done |
| JWT auth wiring (token issued, stored, verified server-side, and attached by the frontend) | Persistent authentication | Done |
| `.../entity/Profile.java` | Maps to `profiles` table; `@OneToOne` + `@JoinColumn(name = "user_id")` to `User`; `bio`, `avatarUrl`, `createdAt`; getters/setters/constructors | Done |
| `.../repository/ProfileRepository.java` | Extends `JpaRepository<Profile, Long>`; `findByUserId(Long)` → `Optional<Profile>` | Done |
| `resources/db/migration/V2__create_profiles_table.sql` | Creates `profiles` table: `id`, `user_id` (FK → `users.id`, `UNIQUE`, `ON DELETE CASCADE`), `bio`, `avatar_url`, `created_at` | Done |
| `.../dto/ProfileRequest.java` | Profile input DTO (`bio`, `avatarUrl`) + no-arg/all-arg constructors, getters/setters | Done |
| `.../dto/ProfileResponse.java` | Profile output DTO (`id`, `userId`, `bio`, `avatarUrl`, `createdAt`) + getters | Done |
| `.../services/ProfileService.java` | `getProfileUserById` (delegates to `findByUserId`); `saveProfile` create-or-update with `@Transactional` | Done |
| `.../controllers/ProfileController.java` | `GET /api/profile/me` (200 or 404) and `PUT /api/profile/me` (upsert, `@Valid` body since 2026-10-21); reads the principal from the SecurityContext | Done |
| `.../entity/LibraryEntry.java` | Maps to `library_entries`; `@ManyToOne`/`@JoinColumn` → `User`, `rawgId`, `gameName`, `gameImage`, `status`, `@CreationTimestamp` on `addedAt`; full getters/setters, no-id args ctor | Done |
| `.../repository/LibraryEntryRepository.java` | `findByUserId` → `List`, `existsByUserIdAndRawgId` (derived queries traverse `user.id`); unused `findByUserIdAndRawgId` removed 2026-10-21 | Done |
| `.../dto/LibraryRequest.java` | Input DTO (`rawgId`, `gameName`, `gameImage`, `status`) + validation; no `userId`/`addedAt` — identity is principal-only, timestamp is `@CreationTimestamp`-owned | Done |
| `.../dto/LibraryResponse.java` | Output DTO (`id`, flat `userId`, `rawgId`, `gameName`, `gameImage`, `status`, `addedAt`) — flat `Long userId` so the `User` entity (and `passwordHash`) never enters JSON | Done |
| `.../services/LibraryService.java` | `@Transactional` writes; `addToLibrary` (validates status against `ALLOWED_STATUSES` → `IllegalArgumentException`; duplicate pair → `GameAlreadyInLibraryException`), `getLibrary`, `updateStatus`/`deleteEntry` via shared `getOwnedEntry` (missing **or not-owned** → `ResourceNotFoundException` — 404, not 403, to avoid confirming a foreign id exists) | Done |
| `.../dto/StatusUpdateRequest.java` | Tiny body DTO for status updates (`@NotBlank status`) — validates exactly what PUT reads, unlike `LibraryRequest` which would force rawgId/gameName along; renamed from `StatustUpdateRequest` on 2026-10-21 (file + class + ctors + controller import) | Done |
| `.../controllers/LibraryController.java` | `GET /api/library` (SecurityContext principal; 200, `[]` when empty; `.stream().map(this::toResponse)`), `POST /api/library` (201 + `@Valid` body), `PUT /api/library/{id}` (path var + `@Valid` status body → 200), `DELETE /api/library/{id}` (204, no body); mutations use `@AuthenticationPrincipal User user`; shared `toResponse` mapper | Done |
| `.../exception/GameAlreadyInLibraryException.java` | Duplicate `(user_id, rawg_id)` pair → 409 | Done |
| `.../exception/ResourceNotFoundException.java` | Missing/unowned resource → 404 | Done |

### Backend check

```powershell
cd Backend
.\mvnw.cmd clean compile
```

---

## API Endpoints

| Method | Path | Status |
| --- | --- | --- |
| GET | `/api/hello` | Done — protected: 401 without token; 200 with a greeting read from the SecurityContext principal (`Wellcome, <username>`) |
| GET | `/api/games` | Done |
| GET | `/api/games-name?name=` | Done |
| GET | `/api/games/{id}` | Done |
| GET | `/api/games/{id}/screenshots` | Done |
| POST | `/api/auth/register` | Done — returns `{ token, user }` (201) |
| POST | `/api/auth/login` | Done — returns `{ token, user }` |
| GET | `/api/users/me` | Done — requires valid token; returns `id`/`userName`/`email` |
| GET | `/api/profile/me` | Done — requires valid token; returns the current user's profile, 404 if none exists |
| PUT | `/api/profile/me` | Done — requires valid token; creates or updates the current user's profile |
| GET | `/api/library` | Done — implemented, 200 with mapped DTOs (`[]` when empty); runtime check pending |
| POST | `/api/library` | Done — implemented, `@Valid` body → 201 with the new entry; client-asserted identity forbidden, principal-only |
| PUT | `/api/library/{id}` | Done — implemented (`@PathVariable` id + `@Valid` status body → 200); runtime check pending |
| DELETE | `/api/library/{id}` | Done — implemented (→ 204 no body; missing/unowned entry → 404 via service); runtime check pending |

---

## Database

| Object | Details | Status |
| --- | --- | --- |
| `users` table (`V1__create_users_table.sql`) | `id`, `username` (unique), `email` (unique), `password_hash`, `created_at` | Done |
| `profiles` table (`V2__create_profiles_table.sql`) | `id`, `user_id` (FK → `users.id`, unique, cascade delete), `bio`, `avatar_url`, `created_at` | Done |
| `library_entries` table (`V3__create_library_entries_table.sql`) | `id` (IDENTITY), `user_id` (FK → `users.id`, cascade delete), `rawg_id` (INTEGER), `game_name`, `game_image` (TEXT), `status` (CHECK: PLAYING/COMPLETED/PLAN_TO_PLAY/DROPPED), `added_at`, composite `UNIQUE (user_id, rawg_id)` — file later fixed (duplicate name + `entiries` spelling) with the DB checksum re-synced via `flyway:repair` | Done |
| rename library constraint (`V4__rename_library_constraint.sql`) | `ALTER TABLE ... RENAME CONSTRAINT uq_library_entiries_user_game TO uq_library_entries_user_game` — the live constraint now has the correct name; DB is at Flyway version 4 | Done |

Migrations are managed by Flyway. Create a new migration for any schema change — do not
edit applied migrations.

---

## Verified Test Results

| Area | Test | Result |
| --- | --- | --- |
| Auth | Register with valid data | Success |
| Auth | Duplicate email | HTTP 409 |
| Auth | Validation errors | HTTP 400 |
| Auth | Login correct email + password | Success |
| Auth | Login correct email + wrong password | HTTP 401 |
| Auth | Login unknown email | HTTP 401 |
| Auth | Frontend login → Navbar shows user name, survives hard refresh | Working (manual) |
| Auth | Frontend logout → clears `localStorage`, returns to logged-out Navbar | Working (manual) |
| Auth | Frontend register valid data | Working (manual) — account created, signed in, redirected |
| Auth | Frontend register duplicate email | Shows "Email is already registered" |
| Games | Explore list / search / detail / screenshots | Working (manual) |
| Auth | Login/register response includes `token` + nested `user` | Working (manual) — 2026-10-18 |
| Auth | `GET /api/hello` without token | HTTP 401 `{"message":"Unauthorized"}` (curl) |
| Auth | `GET /api/hello` with valid Bearer token | Success — HTTP 200; filter console printed user id + loaded username (manual, 2026-10-18) |
| Auth | `GET /api/hello` with garbage token | HTTP 401, no crash (fail-safe catch, manual, 2026-10-18) |
| Auth | `GET /api/users/me` with valid token | Success — `{"id":2,"userName":"Reth Chhaiya","email":...}` after the `getId()` fix (curl, 2026-10-18) |
| Auth | `GET /api/users/me` without token | HTTP 401 (curl, 2026-10-18) |
| Auth | `/me` JSON missing `id` | Bug found — `getid()` ignored by Jackson 3; fixed by renaming to `getId()` (2026-10-18) |
| Auth | Boot validation wrote `user_data` (lowercase d) | Bug found in review — wrong localStorage key; fixed to `user_Data` (2026-10-18) |
| Auth | Browser login after `SecurityConfig` (CORS preflight) | Fixed — global `CorsConfigurationSource` bean |
| Auth | Boot crash on corrupt `localStorage` (`"undefined"`) | Fixed — `try/catch` self-heal in `AuthProvider` |
| Profile | `PUT /api/profile/me` (create) | Success — 200, returns `id`/`userId`/`bio`/`avatarUrl`/`createdAt` (PowerShell, 2026-10-19) |
| Profile | `GET /api/profile/me` after save | Success — returns the saved profile (PowerShell, 2026-10-19) |
| Profile | `GET /api/profile/me` without token | HTTP 401 (design) |
| CORS | Preflight `OPTIONS /api/users/me` with `Origin: http://localhost:5173` | Fixed — `Access-Control-Allow-Origin` present after explicit `configurationSource` wiring (2026-10-19) |
| Frontend | `npm run lint` | Passing (0 errors, 2026-10-19) |
| Frontend | `npm run build` | Passing — 45 modules |
| Backend | `mvnw.cmd clean compile` | Passing |
| Database | V3 migration applied at backend startup ("Successfully applied 1 migration: V3"); `library_entries` visible in the database | Done (manual, 2026-10-20) |
| Database | edited V3 → app startup fails "Migration checksum mismatch for migration version 3" (expected burn); `flyway:repair` re-synced the checksum, `flyway:migrate` applied V4, `flyway:validate` → 4/4 pass | Done (flyway-maven-plugin, 2026-10-20) |
| Backend | app boots clean after V4 — validates 4 migrations, Tomcat on :8080 | Done (manual, 2026-10-20) |
| Backend | `mvnw.cmd clean compile` after renaming the exception package folder `execption` → `exception` (git mv, matching package statements + imports) | Passing (2026-10-20) |
| Backend | `mvnw.cmd clean compile` with the library slice complete (all four `/api/library` endpoints, status DTO, exceptions, handlers) | Passing — 36 sources (2026-10-20) |
| Backend | `mvnw.cmd clean compile` after the parked debt fixes (`StatusUpdateRequest` rename, `@Valid` on the PUT body, `toResponse` GET mapping, `@Transactional` on `updateStatus`, dead repo method removed, `ProfileController` `@Valid`) | Passing (2026-10-21) |
| Frontend | `npm run lint` + `npm run build` after the library page, add-to-library card, GameCard/GameDetailsPage redesigns, and inline delete confirmation | Passing — 47 modules (2026-10-21) |

---

## Work Log

### 2026-10-16 — Shared layout phase

- Built responsive Navbar (mobile hamburger, active-link highlighting, auth links).
- Built responsive Footer.
- Created HomePage (hero + CTA + feature cards).
- Introduced `MainLayout` layout route with `<Outlet/>`; simplified `App.jsx`.
- Canonical home became `/home` with `/` redirecting via `<Navigate replace />`.
- Added stub pages + routes for Login, Register, Library, Community.
- Verified `npm run lint` (0 errors) and `npm run build`.

### 2026-10-17 — Authentication UI

- Added `authService.js` (`registerUser`, `loginUser`) with normalized errors (`status`, `fieldErrors`).
- Added auth state: `contexts/authContext.js`, `contexts/AuthContext.jsx` (`AuthProvider`), `hooks/useAuth.js`; wrapped the app in `<AuthProvider>` (`main.jsx`).
- Wired LoginPage to the backend: `loginUser` → context `login` → `navigate('/home')`.
- Wired RegisterPage to the backend with a client-side confirm-password check, error display, and auto sign-in/redirect on success.
- Navbar reflects auth state (shows the user's name + Logout); logout clears context and `localStorage`.
- Persisted the logged-in user in `localStorage` (`user_Data`) so login survives a hard refresh.
- Fixed a state-vs-parameter bug (`login` saved `user` instead of the passed user).
- Added `@CrossOrigin("http://localhost:5173")` to `AuthController`.
- Verified `npm run lint` (0 errors) and `npm run build`.

### 2026-10-17 — JWT persistence (in progress)

- Added dependencies: `spring-boot-starter-security` and jjwt `0.12.6` (`jjwt-api`, `jjwt-impl`, `jjwt-gson` — gson avoids the Boot 4 Jackson 2/3 clash).
- Added `JwtService` (`generateToken`, `parseToken`) and JWT config (`jwt.secret` from `JWT_SECRET` in `.env`, `jwt.expiration-ms=86400000`).
- Added `SecurityConfig` (`SecurityFilterChain`): public game/auth paths `permitAll`, everything else `authenticated`, stateless, CSRF disabled.
- Decision: HS256 symmetric key; `JWT_SECRET` is a 384-bit base64 value kept only in `.env` (untracked).
- Learned: Spring component scanning starts at the main class package — a config in a sibling package (`com.gamehub.config`) is silently ignored.
- Remaining: `AuthResponse` (`{ token, user }`) from register/login, `JwtAuthenticationFilter`, a protected `GET /api/users/me`, and frontend token storage/handling.
- Backend compiles.

### 2026-10-18 — JWT issuance + CORS/401 fix

- Added `dto/AuthResponse.java` (`{ token, user }`); first attempt was package-private — learned that Java default access stops at the package boundary and that Jackson only sees `public` getters (empty JSON otherwise).
- `AuthController` now injects `JwtService` and returns `AuthResponse` from both register and login; old `RegisterResponse` is nested (keeps the `userName` JSON key the Navbar reads).
- Added `CorsConfigurationSource` bean in `SecurityConfig` (origin `http://localhost:5173`, methods incl. `OPTIONS`, headers incl. `Authorization`, registered for `/api/**`) — `http.cors(withDefaults())` discovers it. Without it the preflight OPTIONS hit `anyRequest().authenticated()` and browser login was broken.
- Added `.exceptionHandling(...)` entry point → 401 JSON (Spring's default was 403).
- Frontend: `login(user, token)` signature; pages destructure `{ token, user }` from responses; `token` + `user_Data` stored in `localStorage`.
- Debugging story: a stale backend response (old flat shape) written by `login(undefined, ...)` poisoned `localStorage.user_Data` with the string `"undefined"` (`JSON.stringify(undefined)` → `undefined` → `setItem` coerces) → every boot died in `JSON.parse`. Fixed by clearing storage + `try/catch` self-heal in the `AuthProvider` initializer (removes junk, returns `null`). Also caught swapped `login(token, user)` call arguments mid-debug.
- Added a guard in `login()`: throws if user data is missing (fails loudly instead of storing junk).
- Cleaned unused `JwtService` injection from `UserService`.
- Verified: `mvnw.cmd clean compile`, `npm run lint` (0 errors), `npm run build` (42 modules), curl `/api/hello` → 401 JSON, browser login → token stored + Navbar + hard refresh.

### 2026-10-18 — Increment 3 kickoff (paused for a break)

- Increment 2 closed: build re-verified (42 modules), docs updated (this file + plan.md).
- Increment 3 scope agreed: `JwtAuthenticationFilter` (read `Authorization: Bearer`,
  fill `SecurityContextHolder`) → protected `GET /api/users/me` → frontend: attach
  header, validate session on boot, protect `/library`.
- Concepts delivered: filter chain vs middleware, `OncePerRequestFilter`,
  `SecurityContextHolder`, `UsernamePasswordAuthenticationToken(principal, credentials,
  authorities)`, `chain.doFilter` as pass-the-ball.
- Exercise 1 assigned: create `security/JwtAuthenticationFilter.java` (`@Component`,
  extends `OncePerRequestFilter`, injects `JwtService`, passthrough
  `doFilterInternal` + Bearer header extraction with null/prefix guards).
- Completed the same day — see the next entry.

### 2026-10-18 — JWT filter: authenticated identity (Increment 3, backend)

- Built `security/JwtAuthenticationFilter.java` incrementally: header guard → extract
  `Bearer ` token → `jwtService.parseToken` → `UserService.findById` →
  `SecurityContextHolder.setAuthentication(...)`; invalid token fails safe (catch
  `JwtException`, continue unauthenticated).
- Added `UserService.findById` (delegates to `userRepository.findById`, returns
  `Optional<User>` — first `existsById` was written by mistake: boolean yes/no vs the
  actual entity).
- Registered the filter in `SecurityConfig` with
  `.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)`
  so it runs inside the security chain, before the authorization check.
- Bugs fixed along the way: `doFilterInteral` typo (`@Override` caught it at compile
  time), missing `chain.doFilter` on the happy path (request died silently), bare
  `catch{` (Java requires a typed parameter).
- Verified (manual): valid token → `GET /api/hello` 200 + console prints user id and
  loaded username; no token → 401; garbage token → 401 with no crash.
- Remaining for Phase 3: `GET /api/users/me`, frontend attaches `Authorization`,
  protected React routes.

### 2026-10-18 — `/api/users/me` + frontend session validation

- Backend: `UserController` with `GET /api/users/me` — reads the principal from the
  SecurityContext (same pattern as the `/hello` exercise) and returns `RegisterResponse`.
- `/api/hello` upgraded to greet the authenticated user (`Wellcome, <username>`) —
  used as the independent exercise for reading the SecurityContext.
- Debugging: `/me` JSON was missing `id` — `RegisterResponse.getid()` doesn't follow
  the JavaBean getter convention, so Jackson 3 silently ignored it. Renamed to
  `getId()`; register/login responses now include `id` too.
- Frontend: `authService.getCurrentUser()` (GET `/users/me` with `Bearer` token from
  localStorage); `AuthProvider` boot `useEffect` validates the session — refreshes the
  stored user on 200, logs out only on 401 (network errors do not sign the user out).
- Bug found in review: the effect wrote the fresh user to `user_data` (lowercase d)
  while everything else reads `user_Data` — fixed; silent two-slots bug, same family
  as the earlier `login(token, user)` argument-order bug.
- Pending verification when work resumes: browser re-test of boot validation after the
  key fix (login → hard refresh → `GET /api/users/me` 200 + current Navbar name;
  garbage token → logged out); `npm run lint` + `npm run build` re-check.
- Remaining for Phase 3: protected-route guard for `/library`; attach `Authorization`
  on future feature calls (library, reviews).

### 2026-10-19 — Phase 3 complete + Phase 4 kickoff

- Phase 3 finished: `loading` state added to `AuthProvider` (true until boot validation resolves via `finally`); `PrivateRoute.jsx` created (loading → placeholder, no user → redirect `/login` with `replace`, otherwise `<Outlet/>`); `/library` wrapped in `PrivateRoute` inside `MainLayout`.
- Knowledge check passed: loading-before-user reasoning; frontend guard = UX, backend = security.
- Phase 4 decision: **separate `profiles` table** (Option B) over adding columns to `users` — cleaner separation of auth data vs display data.
- Flyway `V2__create_profiles_table.sql`: one-to-one FK (`UNIQUE` + `ON DELETE CASCADE`). Debugging during build: trailing comma, `REFERENCES user(id)` → `users(id)` (table name confusion).
- `Profile.java` entity: fixed column name typos (`boi` → `bio`, `avartar_url` → `avatar_url`), `LocalTime` → `LocalDateTime`, added missing `@OneToOne`, added getters/setters/constructors + `getCreatedAt()`.
- `ProfileRepository.java`: fixed `JpaRepository<User, Long>` → `JpaRepository<Profile, Long>` (wrong entity type would hit the wrong table).
- Verified: `mvnw.cmd clean compile` passing; `profiles` table visible in database after migration.
- Remaining for Phase 4: DTOs, service, controller (`GET/PUT /api/profile/me`), frontend profile page.

### 2026-10-19 — Phase 4 complete: user profiles (backend + frontend)

- Backend: `ProfileRequest` / `ProfileResponse` DTOs; `ProfileService` (`getProfileUserById`, `saveProfile` create-or-update with `@Transactional`); `ProfileController` (`GET /api/profile/me` → 200 or 404, `PUT /api/profile/me` → upsert). Reads the authenticated principal from the SecurityContext (same pattern as `UserController`).
- Verified with PowerShell: `PUT` created the profile (`id=1`, `userId=2`) and `GET` returned it.
- CORS debugging: `OPTIONS /api/users/me` from the Vite origin was blocked while `/api/games` worked — the `@CrossOrigin` annotations on the game/auth/hello controllers masked the issue. The global bean was not applied by `.cors(Customizer.withDefaults())`; fixed by injecting `CorsConfigurationSource` and wiring explicitly: `.cors(cors -> cors.configurationSource(corsConfigurationSource))`. Preflight now returns `Access-Control-Allow-Origin: http://localhost:5173`.
- Removed the temporary profile `permitAll` matchers — profile endpoints stay behind authentication.
- Frontend: `profileService.js` (`getProfile` → `null` on 404; `updateProfile`; both attach `Authorization`), `ProfilePage.jsx` (load/edit, live avatar preview, save, error/success banners, "Member since"), `/profile` route inside `PrivateRoute`, Profile link in the Navbar.
- Bugs fixed: the form used `handleSubmit={...}` instead of `onSubmit={...}` → native submit reloaded the page and reset the avatar preview; the mobile Navbar Profile link was in the logged-out branch; `response === 404` → `response.status === 404`; wrong/unused imports.
- Lint: fixed `react-hooks/set-state-in-effect` in `AuthProvider` by initializing `loading` from the stored token and returning early when there is no token.
- Verified: `mvnw.cmd clean compile`, `npm run lint` (0 errors), `npm run build` (45 modules); profile PUT/GET tested against the running backend.

### 2026-10-20 — Phase 5 kickoff: library schema

- Decided the open game-reference question: **Option A — RAWG id + cached display fields** on each library entry (`rawg_id` + `game_name` + `game_image`); no `games` table. Details re-fetched from RAWG when needed; reviews can reuse the same pattern.
- `V3__create_library_entries_table.sql` written by the author (first migration authored without a template), reviewed twice, then applied at startup — `library_entries` table live.
- Bugs caught in review (teaching points): unquoted status values (identifiers vs strings), missing values in the CHECK, stray `finish` word, missing `CONSTRAINT` keyword, `"DROPED"` spelling, double-vs-single quotes in Postgres (double = identifier, single = string), `VARCHAR(255)` on `game_image` → `TEXT` (RAWG URLs overflow 255; Postgres has no perf difference between TEXT and VARCHAR).
- Concepts learned: composite UNIQUE (the **pair** `(user_id, rawg_id)` is the key — many users × many games, no duplicates); named constraints surface error 23505; `GENERATED BY DEFAULT AS IDENTITY` as the modern alternative to `BIGSERIAL`.
- Remaining Phase 5: `LibraryEntry` entity → repository → DTOs → service → controller (`GET/POST/PUT/DELETE /api/library`, principal-based) → React `/library` page.
- Known cosmetic debt: ~~constraint name typo `uq_library_entiries_user_game`~~ — resolved same day via `flyway:repair` + `V4__rename_library_constraint.sql` (below).

### 2026-10-20 — Flyway repair + V4 rename + exception package cleanup

- Fixed V3's on-disk syntax bug (duplicated constraint name — would crash any fresh database) and corrected the `entiries` → `entries` spelling; since V3 was already applied, the next run trips the exact checksum-mismatch guard the rule was designed to enforce, then reconciles honestly: `flyway:repair` (bookkeeping only — rewrites the recorded checksum), `flyway:migrate` applies `V4__rename_library_constraint.sql` (`RENAME CONSTRAINT` for the live typo'd name), `flyway:validate` → 4/4. DB at version 4.
- Added `flyway-maven-plugin` (no `<version>`; Boot parent manages it). Credentials passed via `-Dflyway.configFiles=<temp conf>` — the Reject: Neon `DB_URL` contains `&channel_binding=require`, and batch-parse rules in `mvnw.cmd` split args at `&` (symptoms: `user 'null'`, `'channel_binding' is not recognized as a command`).
- Finished the exception-package rename started earlier: folder `execption` → `exception` via `git mv` (package statements + imports had already been edited; the folder lagging was why `UserService` blew up at boot with ECJ's signature `Unresolved compilation problems`). `mvnw clean compile` deletes the stale IDE-compiled classes from `target/`; re-verified passing.
- Docs updated (PROGRESS.md, plan.md, AGENTS.md).

### 2026-10-20 — Phase 5: library backend, entity → controller (in progress)

- Whole vertical slice authored by the user, built through two coaching rounds (review propone
  → fix → re-review): `LibraryEntry` entity → `LibraryEntryRepository` → `LibraryRequest`/
  `LibraryResponse` DTOs → `LibraryService` → two new exceptions + handlers → `LibraryController`
  (GET + POST implemented; PUT/DELETE pending).
- Teaching decisions made along the way:
  - **One user → many entries** — first draft named the row entity `Library` and had
    `Optional<Library> findByUserId`; renamed to `LibraryEntry` and the repository got `List`
    semantics (the composite `UNIQUE (user_id, rawg_id)` says the collection is the point).
  - **Identity is never client-asserted** — the draft's `LibraryRequest` contained `userId`
    (and `addedAt`); both dropped: principal from SecurityContext only, `@CreationTimestamp`
    owns `added_at`.
  - `LibraryResponse` flat `Long userId` — serializing the `User` entity would leak
    `passwordHash` (Jackson 3 getter rule).
  - Status whitelist lives in the service (`Set` of the 4 CHECK values → `IllegalArgumentException`/
    400) so a bad value fails clean before hitting the DB CHECK.
  - Controller: GET maps via stream + `toResponse` helper (200 even when empty — an empty
    library is not 404); POST is `@Valid` → 201 CREATED; identity via
    `@AuthenticationPrincipal User user`.
- Bugs caught in review: `PLAN TO PLAY` (space) vs the CHECK's `PLAN_TO_PLAY` — whitelist
  rejected the only correct value; derived-query camelCase (`exsitByUserIdandRawdId`-style
  typos) — Spring Data needs exact `UserIdAndRawgId` paths; DTO Jackson contract (no-arg ctor
  + getters/setters); `@ManyToOne` + `@Column` (relationships take `@JoinColumn`); missing
  `@Entity` in the first entity draft; IDE ghost imports (`java.net.Authenticator`,
  `ajcDeclareAnnotation`) from autocomplete; GET first written with `Optional`-style `.map/.orElseThrow`
  on a `List` (compile error, then the empty-list ≠ 404 design call); response arity missing
  `status`.
- Latent bug found in survey: `ProfileController.updateProfile` takes `@RequestBody
  ProfileRequest` **without `@Valid`** — profile validation never runs; one-word fix, still open
  (also flagged: use the same `@Valid` habit on every new endpoint).
- `GlobalExceptionHandler` gained 409/404/400-`IllegalArgumentException` mappings.
- Statuses: entity/repo/DTOs/service Done; controller Partial (PUT/DELETE `/api/library/{id}`
  next); nothing runtime-verified yet — next stop is `spring-boot:run` + curl round-trip
  (201 → duplicate 409 → GET 200) into the live Neon DB.
- PUT arrived after three teaching rounds on the same theme — one annotation = one data source:
  `@PathVariable` (URL segment) vs `@RequestBody` (JSON body) vs `@Valid` (not a source — a trigger);
  first draft had all three stacked on `Long id` and none on the body DTO (bare, unannotated params
  silently fall back to form/query binding → `null` body at runtime, the nastiest bug class of the
  session). Plus the recurring `user.getId()/user` call-site déjà vu, then the tiny status-only DTO
  (reusing `LibraryRequest` would force rawgId/gameName along for a status tweak).
- DELETE was pure recall by then: `204 noContent`, no body, identity from the principal.
- Session close state: all four endpoints compile (36 sources). Runtime round-trip (201 →
  duplicate 409 → GET 200 → PUT 200 → DELETE 204) not yet executed — **that's the next session's
  first task**.
- Small debts parked for next session (do before runtime testing):
  - Atomic rename `StatustUpdateRequest` → `StatusUpdateRequest` (file + class + both ctors +
    controller import, in one edit — the `execption` lesson).
  - GET still inlines the element mapping; swap to `.stream().map(this::toResponse).toList()`.
  - Stray `@Valid` on the PUT's `@PathVariable Long id` (no-op on a bare Long) — delete.
  - `ProfileController.updateProfile` still missing `@Valid` (latent, one word).
- Verified: `mvnw.cmd clean compile`

### 2026-10-21 — Library frontend + detail/card redesign

- Closed the parked backend debts: `StatustUpdateRequest` → `StatusUpdateRequest` (file, class, both ctors, controller import, in one commit-ready change); GET mapping swapped to `.stream().map(this::toResponse)`; stray `@Valid` removed from the PUT `@PathVariable` and placed on the `@RequestBody`; `@Transactional` added to `updateStatus`; unused `findByUserIdAndRawgId` removed; `ALLOWED_STATIC` → `ALLOWED_STATUSES`; `ProfileController.updateProfile` now uses `@Valid`.
- `libraryService.js` added: `getLibrary`, `addToLibrary` (POST), `updateStatus` (PUT `/library/{id}`), `deleteFromLibrary` (DELETE, handles `204`); all attach `Authorization` and normalize errors with `status`/`fieldErrors`.
- `libraryStatuses.js` shared constant for the four status values; the import casing was corrected to lowercase `libraryService` (Windows resolves either case, Linux does not).
- `MyLibraryPage` built: load on mount, loading/error/empty states, per-entry status `<select>` (state replaced with the server response), remove with inline confirmation, `busyId` guard preventing overlapping mutations.
- `GameDetailsPage` redesigned: hero with backdrop/gradient + meta chips, two-column body, accessible screenshot gallery and lightbox (arrows, counter, Esc/click-out), skeleton loading state. Added the "Your library" card: signed-out prompt, status select + add button, 409 → "already in your library", success → link to `/library`.
- `GameCard` redesigned: artwork overlay, rating/Metacritic badges, ratings count, year, up to two genre chips, hover "View details" CTA.
- Verified: `npm run lint`, `npm run build` (47 modules), `mvnw.cmd clean compile`. Library runtime round-trip (add → duplicate 409 → GET → PUT → DELETE) still pending.

### Earlier

- Frontend game discovery UI (ExplorePage, GameDetailsPage, GameCard, gameService).
- Backend: PostgreSQL + Flyway, User entity/repo, registration, login verification,
  BCrypt, validation + exception handling, RAWG integration.

---

## Not Built Yet

- `Authorization` header on future feature calls (reviews) — `getCurrentUser` and `profileService` show the pattern.
- Personal game library — **code Done end to end** (backend endpoints, `libraryService.js`, `/library` page, add-to-library card on the details page); **runtime verification pending** (curl/browser round-trip against Neon: 201 → duplicate 409 → GET 200 → PUT 200 → DELETE 204).
- Reviews.
- Community posts, likes, comments.
- Automated feature tests (backend and frontend).
- Deployment configuration.
