# GameHub — Build Progress

A living inventory of **everything built so far** in GameHub. Companion to `plan.md`
(which holds the original plan and decisions). Update this file as features are completed.

Last updated: 2026-10-23 (closure of Phase 6: review edit fixed with `ReviewUpdateRequest`, browser walkthrough of create/edit/duplicate confirmed)

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
| `src/services/reviewService.js` | `getReviewByGame(rawgId)` (GET `/review?rawgId=`), `createReview` (POST), `updateReview` (PUT), `deleteReview` (DELETE with 204 guard → `null`); all attach `Authorization`; normalized errors (`status`/`fieldErrors`) — authored through 4 coaching rounds: headers nesting, correct query-param URL (path vs query lesson), no-swallow error deal (services throw → components catch; catch must rethrow), `JSON.stringify(userData)` single-arg (second arg is a replacer filter), `${reviewId}` template var, 204 no-body guard | Done |
| `src/components/reviews/ReviewSection.jsx` | Reviews on `/game/:id`: load-on-mount (loading/error/empty/list), signed-out prompt, form (star rating component + textarea) for create **and** edit (`editingId` — one form, two jobs), 409/400 error mapping, server-response list updates (add/replace/filter), author-only Edit/Delete with `busyId` guard; `StarRating` sub-component (hover preview, 1–5 buttons, unused `readOnly` prop parked as a free hook for list rendering) | Done — browser-verified: create/edit/duplicate-409/delete/signed-out prompt (2026-10-23) |
| `GameDetailsPage.jsx` | Renders `<ReviewSection rawgId={Number(id)} />` after the Screenshots section (main column) | Done |
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
| `.../entity/Review.java` | Maps to `reviews`; IDENTITY id, `@ManyToOne`+`@JoinColumn("user_id")` → `user` (renamed from `userId` per the derived-query lesson), `rawgId`, `rating`, `content`, `@CreationTimestamp` on `createdAt`; Lombok `@Data`/`@NoArgsConstructor` (generates `getCreatedAt()` — fixes the review-round getter debt); `@ToString.Exclude`+`@EqualsAndHashCode.Exclude` on `user` to keep Lombok equals/hashCode from traversing the association | Done |
| `.../repository/ReviewRepository.java` | `findByUserIdOrderByCreatedAtDesc`, `findByRawgIdOrderByCreatedAtDesc` (newest-first per design), `existsByUserIdAndRawgId` (duplicate guard) | Done |
| `.../dto/ReviewRequest.java` | Input DTO (`rawgId`, `rating`, `content`) with `@NotNull`/`@Min(1)`/`@Max(5)`/`@NotBlank` on the DTO boundary (not the entity); no `userId` — identity is principal-only | Done |
| `.../dto/ReviewUpdateRequest.java` | Tiny body DTO for the PUT (only `rating` + `content`, no `rawgId`): the edit endpoint identifies the row via `@PathVariable` + principal, so the update body validates exactly what it reads (the `StatusUpdateRequest` lesson applied); swaps in for `ReviewRequest` on `PUT /api/review/{id}` + `updateReview` signature — added 2026-10-23 after the real browser walkthrough surfaced "must not be null" on edit (the PUT was validating a `rawgId` the service never reads) | Done |
| `.../dto/ReviewResponse.java` | Output DTO (`id`, flat `userId`, `rawgId`, `rating`, `content`, `createdAt`) + Lombok no-arg/all-arg | Done |
| `.../services/ReviewService.java` | `createReview(User user, …)` — duplicate guard (`existsByUserIdAndRawgId` → 409) before save; `getReviewById`, `getAllReviews`, `getReviewByUser`, `getReviewByRawgId`; `updateReview`/`deleteReview` via shared `getOwnedReview` (missing **or not-owned** → 404) — library's house pattern; `toResponse` mapper; principal `User` passed in, no `userRepository` dependency | Done |
| `.../controllers/ReviewController.java` | `POST /api/review` (201 + `@Valid`), `GET /api/review/{id}`, `GET /api/review` (`?userId=`/`?rawgId=` optional filters), `PUT /api/review/{id}`, `DELETE /api/review/{id}` (204); `@AuthenticationPrincipal User user` on all mutations | Done |
| `.../exception/ReviewAlreadyExistsException.java` | Duplicate `(user_id, rawg_id)` review → 409 | Done |

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
| GET | `/api/library` | Done — implemented and runtime-verified, 200 with mapped DTOs (`[]` when empty) |
| POST | `/api/library` | Done — implemented and runtime-verified, `@Valid` body → 201 with the new entry; client-asserted identity forbidden, principal-only |
| PUT | `/api/library/{id}` | Done — implemented and runtime-verified (`@PathVariable` id + `@Valid` status body → 200) |
| DELETE | `/api/library/{id}` | Done — implemented and runtime-verified (→ 204 no body; missing/unowned entry → 404 via service) |
| POST | `/api/review` | Done — runtime-verified 2026-10-22: `@Valid` body → 201 with the review; duplicate `(user_id, rawg_id)` → 409 `{"message":"You already reviewed this game"}`; identity from the principal only |
| GET | `/api/review/{id}` | Done — 200 or 404 |
| GET | `/api/review?userId=` / `?rawgId=` / none | Done — filtered lists (newest-first), unfiltered `getAllReviews` |
| PUT | `/api/review/{id}` | Done — runtime-verified (`@PathVariable` + `@Valid` body → 200; missing/unowned → 404). Body is `ReviewUpdateRequest` (`rating` + `content` only) since 2026-10-23 — `rawgId` removed from the PUT contract because the service never read it and edit must never re-point a review at another game |
| DELETE | `/api/review/{id}` | Done — runtime-verified (→ 204; entry disappears from `?rawgId=` list) |

---

## Database

| Object | Details | Status |
| --- | --- | --- |
| `users` table (`V1__create_users_table.sql`) | `id`, `username` (unique), `email` (unique), `password_hash`, `created_at` | Done |
| `profiles` table (`V2__create_profiles_table.sql`) | `id`, `user_id` (FK → `users.id`, unique, cascade delete), `bio`, `avatar_url`, `created_at` | Done |
| `library_entries` table (`V3__create_library_entries_table.sql`) | `id` (IDENTITY), `user_id` (FK → `users.id`, cascade delete), `rawg_id` (INTEGER), `game_name`, `game_image` (TEXT), `status` (CHECK: PLAYING/COMPLETED/PLAN_TO_PLAY/DROPPED), `added_at`, composite `UNIQUE (user_id, rawg_id)` — file later fixed (duplicate name + `entiries` spelling) with the DB checksum re-synced via `flyway:repair` | Done |
| rename library constraint (`V4__rename_library_constraint.sql`) | `ALTER TABLE ... RENAME CONSTRAINT uq_library_entiries_user_game TO uq_library_entries_user_game` — the live constraint now has the correct name; DB is at Flyway version 4 | Done |
| `reviews` table (`V5__create_reviews_table.sql`) | `id` (IDENTITY), `user_id` (FK → `users.id`, cascade delete), `rawg_id` (INTEGER), `rating` (CHECK 1–5), `content` (TEXT NOT NULL), `created_at`, `UNIQUE (user_id, rawg_id)` → duplicate review 409; lean design: no cached game fields (reviews render on `/game/:id`, which already has RAWG data) — and author-verified 2026-10-22 after three review rounds (round 1 junk: broken `DEFAULT` word, camelCase column, missing UNIQUE; round 2: rating column lost, `DEFAULTW`, constraint liIs about its name) | Partial — migration file Done (reviewed), **not yet applied to the live DB; first task when back: boot and watch for "Successfully applied 1 migration: V5"** |

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
| Frontend | `npm run lint` + `npm run build` after the review feature (reviewService + ReviewSection + GameDetailsPage wiring) | Passing — 49 modules (2026-10-22) |
| Reviews | Backend technique for author display: `userName` added to `ReviewResponse` (second entity field `username`, `toResponse` updated atomically — positional `@AllArgsConstructor` mismatch caught by compile) — verified in live JSON `"userName":"Reth Chhaiya"` | Done (2026-10-22) |
| Reviews | Frontend review section code-complete; **not yet exercised in the browser** — next session first task: manual test on `/game/:id` (load, post fresh 201, duplicate 409 inline, edit, delete, signed-out prompt, 400 messages), then `npm run lint` + build re-check | Partial |
| Library | Full runtime round-trip against Neon: add (201) → duplicate (409) → GET (200) → PUT status (200) → DELETE (204) | Success (manual, author-verified 2026-10-21 night) — Phase 5 closed |
| Database | V5 migration applied and live; boot validates 5 migrations ("Successfully validated 5 migrations… schema up to date") — V5 itself had been applied by an earlier boot the same day | Done (2026-10-22) |
| Backend | `mvnw.cmd clean compile` with the review slice complete (entity/repo/DTOs/service/controller + exception) | Passing — 43 sources (2026-10-22) |
| Reviews | Runtime round-trip against Neon: POST → 201, duplicate → 409, GET `?rawgId=` → 200 (newest-first), PUT → 200, DELETE → 204, GET after delete → `[]`; validation `{"rating":9}`/blank content → 400; no-token → 401 | Success (manual, 2026-10-22) — Phase 6 backend closed |
| Reviews | Duplicate review returned **401** instead of 409 — root cause: `@ExceptionHandler(ReviewAlreadyExistsException.class)` annotation was missing from the handler method (body was correct; an unannotated method is dead code, exception escaped and the security entry point answered 401) | Fixed and re-verified (2026-10-22) |
| Reviews | Edit review → 400 "must not be null" — the PUT validated the full `ReviewRequest` (whose `rawgId` is `@NotNull`) while the UI sensibly sent only `{rating, content}`, and the service never read `rawgId` on update anyway. Fix: `ReviewUpdateRequest` DTO on PUT + service signature; front unchanged (it already sent exactly what the new contract reads) | Fixed — compile verified; edit browser-tested 200 (2026-10-23) |
| Reviews | Browser walkthrough (author, 2026-10-23): create → appears at top of list; edit → inline form pre-fills, save → 200, list row replaced; duplicate POST → 409 "already reviewed this game" confirmed in UI (a first scare — user thought a double post went through — resolved as false alarm, the guard held); delete → 204, row disappears; signed-out → "Log in to leave a review" prompt replaces the form | Success — walkthrough complete, **Phase 6 closed** (2026-10-23) |
| Frontend | `npm run lint` + `npm run build` after the edit fix and the `StarRating` change (dropdown → star buttons; hover preview) | Passing — 49 modules (2026-10-23) |
| Testing | `curl.exe` with JSON body through PowerShell 5.1 produced phantom 401s — broken `Authorization` header from PS's arg-quote mangling (body without embedded quotes worked; `Invoke-RestMethod` unaffected). Backend was fine both times | Diagnosis note (2026-10-22) |

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

### 2026-10-22 — Phase 6 kickoff: reviews schema + entity/repository slice

- **Schema (`V5__create_reviews_table.sql`)** — authored by the user, three review rounds before passing:
  - Round 1: two hard bugs (`TIMESTAMP DELETE CURRENT_TIMESTAMP` verb-typo; `createdAt` unquoted camelCase → folds to `createdat` and mismatches Hibernate's `created_at`) + missing the agreed `UNIQUE (user_id, rawg_id)`.
  - Round 2: fixed those, then broke new things — `rating` column deleted entirely during rewrite (the "diff against previous version before calling it done" lesson), `DEFAULTW` typo, constraint named `review_rating_check` while guarding uniqueness.
  - Round 3: all six targets hit (rating + named-style check, `DEFAULT`, `created_at`, `uq_reviews_user_game`, lean, one-column-per-line). One soft call left to the author: the rating CHECK is unnamed (auto-generates `reviews_rating_check`) — naming convention consistency decision.
- **Design decisions taught/made this phase:**
  - Lean vs cached: reviews render on `/game/:id` (RAWG data already loaded) → `rawg_id` only now; `game_name`/`game_image` arrive via a *forward* migration if a "reviews by user" page ever needs them (lean→cached = one migration; cached→lean never un-caches cleanly).
  - Validation placement (the library statuses analogy): validate a field *by what it is, at the boundary where it enters* — DTO annotations (`@Min/@Max`) for numeric ranges, service whitelist for arbitrary sets (statuses), DB CHECK as backstop only (bad value reaching the DB surfaces as a 500, not a clean 400).
  - `@Table(name="reviews")` is *required* here — Hibernate would map entity `Review` to table `review` otherwise, and V5 would never be found.
- **Entity/repository slice reviewed (author-written), 4 fixes outstanding for next session:**
  1. `Review.getCreatedAt()` missing — Jackson will drop `createdAt` from any JSON (same family: `getid()` 2026-10-18, library response arity 2026-10-20).
  2. Bean-validation annotations (`@Min/@Max/@NotBlank`) pasted onto the entity — belong on the future `ReviewRequest` DTO; on the entity `@Valid` never sees them.
  3. Association field named `userId` but typed `User` — rename to `user` (like `LibraryEntry`); consequence: `findByUserId(Long)` would be a trap because Spring Data resolves `userId` as an exact field match of type `User`, then fails on the `Long` parameter. Renaming to `user` makes `findByUserId` parse correctly as the `user.id` path.
  4. `ReviewRepository` empty — the two agreed derived queries (`findByUserId`, reviews by `rawgId` newest-first) not written yet.
- **Next session, in order:** (1) boot backend and confirm Flyway applies V5 (receipt line `Successfully applied 1 migration: V5`, validate → 5/5) — nothing reviewed touches the DB yet; (2) apply the 4 entity/repo fixes; (3) proceed to the DTO slice (`ReviewRequest` with `@Min/@Max/@NotBlank` + `ReviewResponse`) then service; (4) same as always — author writes, coach reviews.

### 2026-10-22 — Phase 6 frontend: review service + review section

- `reviewService.js` (author-authored, 4 coaching rounds): four functions against the
  backend contract. Lessons landed along the way:
  - `headers: { Authorization }` must be nested — a top-level fetch-options key is
    silently ignored (phantom 401s).
  - Path vs query: filters ride the query string (`/review?rawgId=`), row ids ride the
    path (`/review/{id}`) — must match the controller's `@RequestParam` vs `@PathVariable`.
  - Error-deal lesson: **services throw, components catch; a catch that doesn't rethrow
    swallows** (proven twice in one file). `libraryService`'s catch-log-rethrow is the
    house shape.
  - `JSON.stringify(reviewId, userData)` — second arg of stringify is a **replacer
    filter**, not more data (silent body truncation → server 400).
  - DELETE → 204 No Content: `if (response.status === 204) return null;` before any
    parse, else success throws `SyntaxError` (success reported as failure).
  - Filename typo `reivewService.js` → `reviewService.js` renamed before first import.
- Backend micro-slice for author display: `userName` added to `ReviewResponse`
  (positional Lombok all-args + `toResponse` edited together, compile caught the arity),
  `getUsername()` from the existing `user` join — no DB change. Live-verified.
- `ReviewSection.jsx` built (this once authored by the coach per request): props-only
  `rawgId`; load-on-mount; loading/error/empty states; signed-out "log in to leave a
  review"; one form serving create **and** edit (`editingId` branch in submit); 409 →
  "You already reviewed this game", 400 → joined `fieldErrors`; list mutated from server
  responses (prepend created / map replace updated / filter out deleted); author-only
  Edit/Delete with `busyId`. Styled to the page's card/badge vocabulary.
- Wired into `GameDetailsPage` after Screenshots (`<ReviewSection rawgId={Number(id)} />`).
- Draft draft-file confusion: first attempt saved to `src/pages/ReviewSection.jsx`
  (component ≠ page) — removed, correct home is `src/components/reviews/`.
- Verified: `npm run lint` (0 errors), `npm run build` (49 modules).
- **Not yet done:** browser walkthrough of the review section (post/edit/delete,
  409 and 400 paths, signed-out prompt) — first task next session.

### 2026-10-22 — Phase 6 backend complete: reviews runtime-verified

- Coach-review fixes applied by the author across four review rounds:
  - Identity switched to the principal: `createReview(User user, …)`, controller
    `@AuthenticationPrincipal`; `ReviewRequest.userId` deleted; service no longer touches
    `userRepository`.
  - `jakarta.persistence.EntityNotFoundException` → house `ResourceNotFoundException` (404s).
  - Shared `getOwnedReview` (missing **or** not-owned → 404) for PUT/DELETE.
  - Duplicate guard via `existsByUserIdAndRawgId` + `ReviewAlreadyExistsException` → 409.
  - Ordering: `…OrderByCreatedAtDesc` on both derived queries (rename + both call sites, one edit).
- Bug hunting during the round-trip (three layers, in order of discovery):
  1. **Red herring**: `curl.exe` + JSON via PowerShell 5.1 mangles embedded double quotes →
     broken `Authorization` header → phantom 401s. Proven by the POST with `{}` body reaching
     `@Valid` (400) while the same header 200'd on GET. Any JSON client other than PS 5.1 is
     fine.
  2. **Environment scare**: the backend process serving the failing requests was the author's
     own 19:22 terminal boot (found via `Win32_Process` parent chain), not the coach's 19:05
     background boot — which had died earlier with `PSQLException: connection attempt failed`
     (Neon wire flapping; a boot-time lesson: the JWT filter does a DB call on every
     authenticated request, so DB outages masquerade as auth failures).
  3. **The real bug**: duplicate review → 401, not 409. Discriminating probes (PUT/DELETE
     nonexistent → 404 ✓, so the advice category worked) isolated it to the
     original `@ExceptionHandler` annotation was missing (method body correct, but an
     unannotated method is invisible; the
     exception escaped into the security chain's error dispatch → custom entry point → 401).
     One-line fix + fresh boot + full round-trip green.
- Round-trip receipts (2026-10-22, user 2): POST 201 → duplicate 409 → GET 200 (newest-first)
  → PUT 200 → DELETE 204 → GET `[]` → validation 400 (rating 9 / blank content) → no-token 401.
- Remaining for Phase 6: frontend review UI (form + list on `/game/:id`, `reviewService.js`,
  `Authorization` wiring per `profileService`), then the usual lint/build.

### 2026-10-22 — Phase 5 closed: library runtime-verified

- The library round-trip was executed by the author on the night of 2026-10-21: add → 201, duplicate → 409, GET → 200, PUT status → 200, DELETE → 204. Phase 5 complete; `/library` is now a fully verified feature next to profiles.
- Next: Phase 6 (reviews), reusing the RAWG-id + cached-display-fields game-reference pattern.

### 2026-10-23 — Phase 6 closure: review edit contract fixed + browser walkthrough

- The pending browser walkthrough found its first real bug: **editing your own review returned
  400 "must not be null"**. Evidence chain: ReviewSection's edit path sends `{rating, content}`
  (no `rawgId` — the UI had it right), but `PUT /review/{id}` validated the full `ReviewRequest`,
  whose `rawgId` is `@NotNull` — while `ReviewService.updateReview` only ever called
  `setRating`/`setContent`, never reading `rawgId` on update. The server demanded a field it
  then threw away.
- Fix (Option A, the `StatusUpdateRequest` house pattern): new `ReviewUpdateRequest` DTO
  (`rating` `@NotNull @Min(1) @Max(5)` + `@NotBlank content` — no `rawgId`), used by the PUT
  mapping and the `updateReview` signature. Three atomic touch points: DTO file, controller
  param type, service method signature. Frontend unchanged — it already sent exactly what the
  new contract reads. `mvnw.cmd clean compile` passing.
- Teaching point recorded: **create vs update DTOs** — create includes the identity you're
  establishing (`rawgId`: which game); update includes only what's changing, because the URL
  (`{id}`) + principal identify the row, and PUT accepting `rawgId` would let an edit re-point
  a review at another game (bypassing the duplicate guard's `UNIQUE (user_id, rawg_id)` scope).
- Author then swapped the rating dropdown for a self-built `StarRating` sub-component
  (1–5 buttons, local `hovered` state providing hover preview,
  `filled = hovered ? star <= hovered : star <= rating`, `type="button"` since it renders inside
  the form — a bare button would submit). Coach review: correct component extraction; two
  cosmetic suggestions left open (delete the commented-out `<select>` dead code; the orphan
  `htmlFor="review-rating"` label now points at nothing). Optional idea parked: use the
  component's unused `readOnly` prop to render stars in review list items for free.
- Author false alarm en route: believed a duplicate review went through; re-checked, the 409
  guard held. Duplicate/edit walk-through confirmed in the browser; lint + build passing
  (49 modules).
- **Still to confirm to fully close Phase 6:** delete in the browser (row disappears) and
  the signed-out prompt on `/game/:id`.
- Confirmed shortly after by the author (2026-10-23): delete → 204 and the row disappears;
  signed-out on `/game/:id` shows the "Log in to leave a review" prompt instead of the form.
  **Phase 6 (reviews) is now closed end to end** — schema, backend, frontend, and browser
  walkthrough all verified.

### Earlier

- Frontend game discovery UI (ExplorePage, GameDetailsPage, GameCard, gameService).
- Backend: PostgreSQL + Flyway, User entity/repo, registration, login verification,
  BCrypt, validation + exception handling, RAWG integration.

---

## Not Built Yet

- `Authorization` header on future feature calls (reviews) — `getCurrentUser` and `profileService` show the pattern.
- Personal game library — **Done end to end, runtime-verified** (backend endpoints, `libraryService.js`, `/library` page, add-to-library card on the details page; round-trip 201 → duplicate 409 → GET 200 → PUT 200 → DELETE 204 executed 2026-10-21 night).
- Reviews — **Done end to end (Phase 6 closed 2026-10-23)**: backend runtime-verified
  (2026-10-22), front browser-verified for create/edit/duplicate-409/delete/signed-out
  prompt (2026-10-23). Optional polish ideas parked: delete the commented-out `<select>`
  + orphan `htmlFor` label in `ReviewSection.jsx`; read-only `StarRating` in review list
  items.
- Community posts, likes, comments.
- Automated feature tests (backend and frontend).
- Deployment configuration.
