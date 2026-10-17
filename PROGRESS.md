# GameHub — Build Progress

A living inventory of **everything built so far** in GameHub. Companion to `plan.md`
(which holds the original plan and decisions). Update this file as features are completed.

Last updated: 2026-10-17

Status legend: **Done** · **Partial** · **Stub** (placeholder exists) · **Not started**

---

## Tech Stack (in use)

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router 7 |
| Backend | Java 21, Spring Boot 4.1.1 |
| Database | PostgreSQL (Neon), Flyway migrations |
| External API | RAWG (called by Spring Boot, key server-side) |
| Auth | Registration + login (verified); React auth context + `useAuth`; `localStorage` session (no JWT/session yet) |

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
| `src/pages/LoginPage.jsx` | `/login` | Login form → `loginUser` → context `login` → `navigate('/home')`; error display | Done |
| `src/pages/RegisterPage.jsx` | `/register` | Register form + confirm-password check + error display; does NOT sign in/redirect yet | Partial |
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
| `src/contexts/AuthContext.jsx` | `AuthProvider`: holds current user, `login`/`logout`, `localStorage` persistence | Done |
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
| `.../services/UserService.java` | Register (hash + save) and login (verify) logic | Done |
| `.../controllers/AuthController.java` | `POST /api/auth/register`, `POST /api/auth/login` + `@CrossOrigin("http://localhost:5173")` | Done |
| `.../controllers/GlobalExceptionHandler.java` | Maps errors to 400/401/409 | Done |
| `.../execption/InvalidCredentialsException.java` | Invalid login credentials (package folder is misspelled `execption`) | Done |
| `.../execption/EmailAlreadyExistsException.java` | Duplicate email | Done |
| `.../PasswordConfig.java` | `BCryptPasswordEncoder` bean (root package, not a `config/` package) | Done |
| Game endpoints (`/api/games`, `/api/games-name`, `/api/games/{id}`, `/api/games/{id}/screenshots`) | Proxy RAWG through Spring Boot | Done |
| `resources/db/migration/V1__create_users_table.sql` | Creates `users` table | Done |
| `resources/application.properties` | DB config, `ddl-auto=none`, RAWG key from env | Done |
| JWT / session auth | Persistent authentication | Not started |

### Backend check

```powershell
cd Backend
.\mvnw.cmd clean compile
```

---

## API Endpoints

| Method | Path | Status |
| --- | --- | --- |
| GET | `/api/hello` | Done |
| GET | `/api/games` | Done |
| GET | `/api/games-name?name=` | Done |
| GET | `/api/games/{id}` | Done |
| GET | `/api/games/{id}/screenshots` | Done |
| POST | `/api/auth/register` | Done |
| POST | `/api/auth/login` | Done (returns user info, no token) |

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
| Auth | Frontend register valid data | Partial — account created, but no auto sign-in/redirect yet |
| Auth | Frontend register duplicate email | Shows "Email is already registered" |
| Games | Explore list / search / detail / screenshots | Working (manual) |
| Frontend | `npm run lint` | Failing — unused `useReducer` import in `AuthContext.jsx` |
| Frontend | `npm run build` | Passing |
| Backend | `mvnw.cmd clean compile` | Passing |

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
- Wired RegisterPage to the backend with a client-side confirm-password check and error display (auto sign-in/redirect still pending).
- Navbar reflects auth state (shows the user's name + Logout); logout clears context and `localStorage`.
- Persisted the logged-in user in `localStorage` (`user_Data`) so login survives a hard refresh.
- Fixed a state-vs-parameter bug (`login` saved `user` instead of the passed user).
- Added `@CrossOrigin("http://localhost:5173")` to `AuthController`.
- Note: `npm run lint` currently fails on an unused `useReducer` import in `AuthContext.jsx` (to be removed).

### Earlier

- Frontend game discovery UI (ExplorePage, GameDetailsPage, GameCard, gameService).
- Backend: PostgreSQL + Flyway, User entity/repo, registration, login verification,
  BCrypt, validation + exception handling, RAWG integration.

---

## Not Built Yet

- Persistent authentication (JWT/session) and protected routes/endpoints.
- Register page auto sign-in and redirect (login page is done).
- User profiles.
- Personal game library (add/remove, statuses).
- Reviews.
- Community posts, likes, comments.
- Automated feature tests (backend and frontend).
- Deployment configuration.
