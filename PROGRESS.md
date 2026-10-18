# GameHub — Build Progress

A living inventory of **everything built so far** in GameHub. Companion to `plan.md`
(which holds the original plan and decisions). Update this file as features are completed.

Last updated: 2026-10-18

Status legend: **Done** · **Partial** · **Stub** (placeholder exists) · **Not started**

---

## Tech Stack (in use)

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router 7 |
| Backend | Java 21, Spring Boot 4.1.1 |
| Database | PostgreSQL (Neon), Flyway migrations |
| External API | RAWG (called by Spring Boot, key server-side) |
| Auth | Registration + login (verified); React auth context + `useAuth`; JWT: register/login return `{ token, user }`, token stored in `localStorage`. **In progress** — request filter + protected endpoints still pending |

---

## Frontend Inventory

Root: `Frontend/`

### Layout & chrome

| File | What it does | Status |
| --- | --- | --- |
| `src/App.jsx` | Renders `BrowserRouter` + `AppRoute` | Done |
| `src/main.jsx` | Mounts the app; wraps `<App/>` in `<AuthProvider>` | Done |
| `src/routes/index.jsx` | Route table nested under a layout route | Done |
| `src/components/layouts/MainLayout.jsx` | Navbar + `<Outlet/>` + Footer; flex column pins footer | Done |
| `src/components/layouts/Navbar.jsx` | Brand, nav links (active highlight), responsive hamburger menu, auth links | Done |
| `src/components/layouts/Footer.jsx` | Copyright + RAWG attribution, responsive | Done |

### Pages

| File | Route | What it does | Status |
| --- | --- | --- | --- |
| `src/pages/HomePage.jsx` | `/home` | Hero, CTA to Explore, three feature cards | Done |
| `src/pages/ExplorePage.jsx` | `/explore` | Game grid, search by name, loading/error/empty states | Done |
| `src/pages/GameDetailsPage.jsx` | `/game/:id` | Details, genres/devs/publishers/platforms, screenshot lightbox (Esc/close) | Done |
| `src/pages/LoginPage.jsx` | `/login` | Login form → `loginUser` → destructure `{token, user}` → `login(user, token)` → `navigate('/home')`; error display | Done |
| `src/pages/RegisterPage.jsx` | `/register` | Register form + confirm-password check → `registerUser` → `login(user, token)` → `navigate('/home')` | Done |
| `src/pages/MyLibraryPage.jsx` | `/library` | Placeholder | Stub |
| `src/pages/CommunityPage.jsx` | `/community` | Placeholder | Stub |

`/` redirects to `/home` with `replace`.

### Components & services

| File | What it does | Status |
| --- | --- | --- |
| `src/components/GameCard.jsx` | Reusable game card (image, rating, year, link) | Done |
| `src/services/gameService.js` | Fetch list, search by name, detail, screenshots from backend | Done |
| `src/services/authService.js` | `registerUser`, `loginUser` (POST + normalized error with `status`/`fieldErrors`) | Done |
| `src/contexts/authContext.js` | Raw `AuthContext` (`createContext`) | Done |
| `src/contexts/AuthContext.jsx` | `AuthProvider`: holds current user; `login(user, token)` stores `user_Data` + `token`; `try/catch` self-heal if stored JSON is corrupt; `login` throws if user missing; `logout` clears both keys | Done |
| `src/hooks/useAuth.js` | `useAuth()` — `useContext(AuthContext)` | Done |
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
| `.../dto/RegisterResponse.java` | Response without password hash | Done |
| `.../dto/LoginRequest.java` | Login input + validation | Done |
| `.../dto/AuthResponse.java` | `{ token, user }` response body for register/login | Done |
| `.../services/UserService.java` | Register (hash + save) and login (verify) logic | Done |
| `.../controllers/AuthController.java` | `POST /api/auth/register`, `POST /api/auth/login` — both return `AuthResponse` (`{ token, user }`) via injected `JwtService` | Done |
| `.../controllers/GlobalExceptionHandler.java` | Maps errors to 400/401/409 | Done |
| `.../execption/InvalidCredentialsException.java` | Invalid login credentials (package folder is misspelled `execption`) | Done |
| `.../execption/EmailAlreadyExistsException.java` | Duplicate email | Done |
| `.../PasswordConfig.java` | `BCryptPasswordEncoder` bean (root package, not a `config/` package) | Done |
| Game endpoints (`/api/games`, `/api/games-name`, `/api/games/{id}`, `/api/games/{id}/screenshots`) | Proxy RAWG through Spring Boot | Done |
| `resources/db/migration/V1__create_users_table.sql` | Creates `users` table | Done |
| `resources/application.properties` | DB config, `ddl-auto=none`, RAWG key from env, JWT config (`jwt.secret`, `jwt.expiration-ms`) | Done |
| `.../config/SecurityConfig.java` | `SecurityFilterChain`: public game/auth paths `permitAll`, rest `authenticated`, stateless, CSRF off; `CorsConfigurationSource` bean (origin 5173, `/api/**`); 401 JSON entry point | Done |
| `.../services/JwtService.java` | Sign (`generateToken`) and verify (`parseToken`) HS256 tokens | Done |
| Pom dependencies | `spring-boot-starter-security` + jjwt 0.12.6 (`jjwt-api`/`jjwt-impl`/`jjwt-gson`) | Done |
| JWT auth wiring (token issued + stored; no request filter, no protected endpoint yet) | Persistent authentication | Partial |

### Backend check

```powershell
cd Backend
.\mvnw.cmd clean compile
```

---

## API Endpoints

| Method | Path | Status |
| --- | --- | --- |
| GET | `/api/hello` | Done — protected: 401 `{"message":"Unauthorized"}` without token |
| GET | `/api/games` | Done |
| GET | `/api/games-name?name=` | Done |
| GET | `/api/games/{id}` | Done |
| GET | `/api/games/{id}/screenshots` | Done |
| POST | `/api/auth/register` | Done — returns `{ token, user }` (201) |
| POST | `/api/auth/login` | Done — returns `{ token, user }` |

---

## Database

| Object | Details | Status |
| --- | --- | --- |
| `users` table (`V1__create_users_table.sql`) | `id`, `username` (unique), `email` (unique), `password_hash`, `created_at` | Done |

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
| Auth | Browser login after `SecurityConfig` (CORS preflight) | Fixed — global `CorsConfigurationSource` bean |
| Auth | Boot crash on corrupt `localStorage` (`"undefined"`) | Fixed — `try/catch` self-heal in `AuthProvider` |
| Frontend | `npm run lint` | Passing |
| Frontend | `npm run build` | Passing |
| Backend | `mvnw.cmd clean compile` | Passing |
| Backend | Compile after adding Spring Security + jjwt | Passing |

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
  extends `OncePerRequestFilter`, injects `JwtService`, passthrough `doFilterInternal`
  + Bearer header extraction with null/prefix guards). **Not started — no filter code
  in the repository yet.**
- Resume point: write the skeleton → compile → then populate the SecurityContext and
  register the filter in `SecurityConfig` via
  `addFilterBefore(..., UsernamePasswordAuthenticationFilter.class)`.

### Earlier

- Frontend game discovery UI (ExplorePage, GameDetailsPage, GameCard, gameService).
- Backend: PostgreSQL + Flyway, User entity/repo, registration, login verification,
  BCrypt, validation + exception handling, RAWG integration.

---

## Not Built Yet

- Persistent authentication: token is issued and stored, but there is **no request filter yet** — the backend never reads the `Authorization` header, so no endpoint accepts a token, and the frontend doesn't attach it.
- Protected routes/endpoints (`GET /api/users/me` planned).
- User profiles.
- Personal game library (add/remove, statuses).
- Reviews.
- Community posts, likes, comments.
- Automated feature tests (backend and frontend).
- Deployment configuration.
