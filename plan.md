# GameHub Project Plan

This document preserves the original GameHub project plan and the decisions made during planning. It separates what was decided, what is planned, what exists in the repository today, and what is still open. It is meant to be read before continuing development so the project direction is not accidentally changed.

Status labels used throughout:

- Original decision — decided during planning, treated as the foundation.
- Planned — intended to be built, not yet built.
- Current — what the repository actually contains today.
- Completed — verified as working.
- Open — still needs a decision.

---

## 1. Project Overview

GameHub is a social gaming platform. It is intended to combine game discovery with social features, rather than being only a game catalog.

Users should be able to:

- Discover games.
- Maintain a personal game library.
- Share gaming experiences (reviews and posts).
- Interact with other gamers (likes and comments).

Preferred build approach: feature-by-feature full-stack development (Option C), with an MVP-first mindset.

Architecture in one line:

React frontend → Spring Boot REST API → PostgreSQL database, with the Spring Boot backend also calling an external game API when game data is needed.

Current repository status: early scaffold only. There are two placeholder React routes and a single backend hello endpoint. No database entities, no authentication, no external API integration, and no frontend-to-backend data calls exist yet. Details are in section 14.

---

## 2. Original Project Vision

GameHub is a social gaming platform where users can discover games, keep personal game libraries, share gaming experiences, and interact with other gamers.

The platform is meant to merge discovery and social features. A user should not just browse games; they should be able to log what they play, review games, and talk with a community.

The Spring Boot backend acts as the integration layer:

- It talks to the external game API for game data.
- It owns GameHub's own user and social data in PostgreSQL.
- It serves clean REST endpoints to the React frontend.

### Data ownership: external vs own

| Data | Source | Notes |
| --- | --- | --- |
| Game names, images, descriptions, genres, platforms, release dates, ratings | External game API (RAWG or selected API) | Fetched by Spring Boot and forwarded to React |
| Users, credentials | GameHub database (PostgreSQL) | Owned and managed by GameHub |
| User profiles | GameHub database | Own and manage profile data |
| Personal game library entries and statuses | GameHub database | Games referenced by external id or cached record |
| Reviews | GameHub database | Linked to a user and a game |
| Posts, comments, likes | GameHub database | Social data owned by GameHub |

Game discovery is expected to rely primarily on the external API through Spring Boot, so it may not need its own database table. Relationships such as libraries and reviews do need a stable way to reference a game, which is discussed in sections 8 and 9.

---

## 3. Technology Stack and Architecture

Planned stack (Original decision):

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS |
| Backend | Java 21, Spring Boot |
| Database | PostgreSQL (chosen because it is easier for the author to deploy) |
| Backend communication | REST APIs |
| Game information | RAWG API, or the external game API selected for the project |
| Auth and authorization | Spring Security and JWT (subject to verification against the existing implementation) |

Current versions found in the repository:

| Layer | Version found |
| --- | --- |
| React | 19.2.x |
| Vite | 8.x |
| Tailwind CSS | 4.3.x via @tailwindcss/vite |
| React Router | 7.18.x |
| Spring Boot | 4.1.1 |
| Java | 21 |
| PostgreSQL driver | runtime, managed by Spring Boot parent |
| dotenv-java | 3.2.0 |

Note: the planned stack listed only React, Vite, and Tailwind for the frontend. React Router and lucide-react are also present in the current project. Whether lucide-react is officially adopted is Open (section 15).

### Architecture

```mermaid
flowchart LR
  A[React Frontend] -->|REST / JSON| B[Spring Boot REST API]
  B -->|JPA / JDBC| C[(PostgreSQL)]
  B -->|HTTP| D[External Game API RAWG]
```

Three responsibilities:

- React — presentation, routing, form handling, calling the REST API, showing loading/error/empty states.
- Spring Boot — REST controllers, services, validation, entities/repositories, JPA, integration with the external game API, authentication.
- PostgreSQL — users, profiles, libraries, reviews, posts, comments, likes.

---

## 4. Development Options Considered

Three approaches were considered.

### Option A — Frontend first

Build the user interface and frontend pages first, then implement the backend and connect everything afterward.

### Option B — Backend first

Build the database, backend APIs, authentication, and business logic first, then develop the frontend and connect it to the backend.

### Option C — Feature-by-feature full-stack development

Build one complete feature at a time. For each feature, implement the necessary database structure, Spring Boot backend, and React frontend, then test the complete feature before moving to the next one.

---

## 5. Final Decision: Option C

Original decision and the foundation of this plan: Option C — feature-by-feature full-stack development.

Why this fits the project:

- Incremental progress: each feature produces a working, testable result.
- Layer understanding: building each feature across PostgreSQL, Spring Boot, and React makes the communication between layers explicit.
- Earlier integration problems: connecting frontend to backend per feature surfaces issues before they pile up.
- Always working: the application has working features throughout development instead of one long unfinished phase.

This decision must not be replaced with frontend-first or backend-first development.

---

## 6. MVP Scope

MVP-first means building a manageable first version before expanding into a larger social platform.

### Core feature 1: Game discovery

- Retrieve game information through RAWG or the selected external API.
- Display games on the Explore Games page.
- Support game search and browsing.
- Display detailed information about an individual game.
- Handle API loading, errors, and empty results.

### Core feature 2: User authentication

- User registration.
- User login and logout.
- Secure authentication using the selected authentication architecture.
- Protected pages and authenticated API requests.
- User-specific data associated with the authenticated account.

### Core feature 3: User profiles

- View a user's profile.
- Display relevant gaming information.
- Allow users to manage their own profile.
- Show appropriate public profile information.

### Core feature 4: Personal game library

- Add games to a user's personal library.
- Track statuses such as Playing, Completed, Plan to Play, and Dropped.
- View and manage the library.
- Ensure each user's library belongs to the correct account.

### Core feature 5: Reviews

- Allow users to review games.
- Display reviews on appropriate game pages.
- Associate each review with its author and game.
- Support editing or deleting a user's own review where planned.

### Core feature 6: Community posts and interactions

- Create gaming-related posts.
- Display community posts.
- Allow users to like posts.
- Allow users to comment on posts.
- Associate posts and comments with their authors.

### Essential vs enhancement within MVP features

| Feature | Essential for MVP | Enhancement later |
| --- | --- | --- |
| Game discovery | List, search, detail, loading/error/empty states | Advanced filters, sorting, recommendations |
| Authentication | Register, login, logout, protected routes | Password reset, email verification, remember me |
| Profiles | View profile, edit own profile, public view | Avatars upload, stats, activity timeline |
| Library | Add/remove, statuses, list | Custom lists, playtime, ratings-only entries |
| Reviews | Create, display, author/game link | Edit/delete (planned), rating breakdown, likes on reviews |
| Posts | Create, display, like, comment | Edit/delete, media attachments, reporting, moderation |

Edit and delete for reviews is listed in the plan as "where planned", so it is Planned rather than Essential.

---

## 7. Features Deferred Until Later

These are potential future enhancements, not current implementation requirements. Do not make them prerequisites for completing the first version.

- Real-time chat.
- Advanced friendship and following systems.
- Notifications.
- Tournaments and competitive events.
- AI-powered features.
- A separate mobile application.

---

## 8. Planned Data Model

Conceptual entities discussed for GameHub. Only the entities below were planned; none are assumed to exist in code until verified in section 14.

| Entity | Purpose | Status |
| --- | --- | --- |
| User | Account and credentials | Planned |
| User profile | Profile data and gaming info | Planned |
| Game reference or cached game info | Optional local reference to external games | Planned, conditional |
| Personal game library entry | Links a user to a game with a status | Planned |
| Review | A user review of a game | Planned |
| Community post | A user post | Planned |
| Comment | A comment on a post | Planned |
| Like or reaction | A user reaction to content | Planned, if implemented |

### Likely relationships

- A user has a profile.
- A user can maintain many library entries.
- A library entry references a game.
- A user can write multiple reviews.
- A game can have multiple reviews.
- A user can create multiple posts.
- A post can have multiple comments.
- A comment belongs to a post and an author (user).
- Likes are associated with users and the content they like (a post, or possibly other content).

### Game reference question

Reviews and library entries need to refer to a game. Because game data comes from the external API, there are two options:

- Store only the external game id (plus a few cached display fields) on the library/review record and re-fetch details from the external API when needed.
- Store a local game reference or cached row and link library/review records to it.

This is an Open decision (section 15). The plan is to avoid creating unnecessary database tables for game information that can simply be retrieved from the external API.

### Proposed vs confirmed schema

- Proposed schema decisions: all entities and relationships in this section are proposed based on the planning discussion.
- Confirmed schema decisions: none. No entity appears in the current code (verified in section 14).

---

## 9. Feature-by-Feature Implementation Roadmap

Follows Option C: each feature is implemented across the necessary layers before moving on. Dependencies are adjusted only when needed, with the reason given.

Each phase lists: purpose, implementation sequence, dependencies, expected result, acceptance criteria, and completion status.

### Phase 1 — Project foundation

Purpose: establish a working environment where frontend and backend run independently and can talk to each other.

Implementation sequence:

1. Inspect and organize the existing project.
2. Confirm the frontend and backend run independently.
3. Configure the PostgreSQL database.
4. Establish Spring Boot database connectivity.
5. Establish React-to-Spring Boot API communication.
6. Configure environment variables safely.
7. Verify the complete development environment.

Dependencies: none.

Expected result: a running React app, a running Spring Boot app, a reachable PostgreSQL database, and a request from React reaching a Spring Boot endpoint.

Acceptance criteria:

- Frontend dev server starts and serves a page.
- Backend starts and serves an endpoint.
- PostgreSQL connection succeeds.
- React can call a backend endpoint and receive a response.
- Secrets are kept out of version control.

Completion status: Partial.

- Frontend scaffold and routes: Current (placeholder only).
- Backend scaffold and hello endpoint: Current.
- PostgreSQL configuration: Current (properties only).
- Database connectivity: Current, unverified.
- React-to-Spring Boot call: Not started.
- Env handling: Partial (dotenv loads .env; .env untracked; keys present).

Note: the existing .env keys are DB_URL, DB_USERNAME, DB_PASSWORD. An external game API key will likely be needed and is currently absent.

### Phase 2 — Game discovery

First substantial feature to demonstrate the complete full-stack workflow.

Implementation sequence:

1. Identify the game data required by the Explore Games page.
2. Determine what can be obtained from RAWG and what needs to be stored locally.
3. Create any necessary backend integration and configuration.
4. Implement the Spring Boot service and API endpoint for retrieving games.
5. Connect the React Explore Games page to the backend.
6. Implement loading, error, and empty states.
7. Test the complete flow from the external API through Spring Boot to React.

Dependencies: Phase 1 (backend running, configuration in place).

Expected result: Explore Games page shows real games from the external API through Spring Boot, with search and a game detail view.

Acceptance criteria:

- Backend exposes endpoints for listing/searching games and fetching a single game detail.
- External API key is configured and not committed.
- React renders games, loading state, error state, and empty state.
- Searching updates the list.
- Selecting a game shows detail information.

Completion status: Not started.

Note: do not create unnecessary database tables for game information that can be retrieved from the external API. Whether local game records or external API identifiers are needed for library and review relationships is covered in section 8 and remains Open.

### Phase 3 — Authentication

Implementation sequence:

1. Design the user model and database structure.
2. Implement registration and login endpoints.
3. Configure authentication and authorization.
4. Connect React forms to the backend.
5. Implement protected routes and session/token handling.
6. Test successful and unsuccessful authentication.

Dependencies: Phase 1. Can be developed before or after Phase 2; the listed order keeps discovery first to satisfy the goal of demonstrating the full-stack flow early.

Expected result: users can register, log in, log out, and reach protected pages only when authenticated.

Acceptance criteria:

- Registration stores a user securely.
- Login returns a working token/session.
- Protected backend endpoints reject unauthenticated requests.
- React hides or blocks protected routes when unauthenticated.
- Logout clears the session/token.

Completion status: Not started.

Note: Spring Security and JWT is the planned approach, subject to verification. Neither is present in the current pom or code.

### Phase 4 — User profiles

Implementation sequence:

1. Define profile data and relationships.
2. Implement backend endpoints.
3. Build the React profile pages.
4. Connect the frontend to the backend.
5. Test profile ownership and data access.

Dependencies: Phase 3 (a profile belongs to an authenticated user).

Expected result: users can view and edit their own profile and view other users' public profiles.

Acceptance criteria:

- Owner can edit their profile and changes persist.
- Public profile shows only public information.
- Editing is restricted to the owner.

Completion status: Not started.

### Phase 5 — Personal game library

Implementation sequence:

1. Design the library relationships and status model.
2. Implement the necessary backend endpoints.
3. Build the React library interface.
4. Connect the frontend to PostgreSQL-backed functionality.
5. Test adding, updating, viewing, and removing library entries.

Dependencies: Phase 2 (game reference) and Phase 3 (owner account).

Expected result: each user maintains a library of games with a status.

Acceptance criteria:

- Add a game to the library.
- Set status: Playing, Completed, Plan to Play, Dropped.
- View and update the library.
- Remove an entry.
- Entries are scoped to the authenticated user.

Completion status: Not started.

### Phase 6 — Reviews

Implementation sequence:

1. Define review data and relationships.
2. Implement backend validation and endpoints.
3. Build review creation and display interfaces.
4. Connect reviews to users and games.
5. Test review ownership and persistence.

Dependencies: Phase 2 (game) and Phase 3 (author).

Expected result: users can review games and see reviews on game pages.

Acceptance criteria:

- Create a review tied to an author and game.
- Reviews appear on the relevant game page.
- A user can edit or delete their own review (where planned).
- Reviews cannot be attributed to another user.

Completion status: Not started.

### Phase 7 — Community posts

Implementation sequence:

1. Implement posts, likes, and comments.
2. Establish the required database relationships.
3. Implement Spring Boot endpoints and validation.
4. Build the React community interface.
5. Connect and test each interaction.

Dependencies: Phase 3 (authors). Independent of Phase 2 in data terms but narratively placed after reviews.

Expected result: a community feed where users post, like, and comment.

Acceptance criteria:

- Create and display posts.
- Like and unlike posts.
- Comment on posts.
- Posts and comments show their authors.

Completion status: Not started.

### Phase 8 — Testing and deployment

Implementation sequence:

1. Test each feature individually and in combination.
2. Verify authentication and authorization.
3. Verify database persistence.
4. Handle API failures and invalid input.
5. Configure production environment variables.
6. Deploy the frontend, backend, and PostgreSQL database.
7. Verify the deployed application end to end.

Dependencies: all feature phases.

Expected result: a deployed, working GameHub verified end to end.

Acceptance criteria:

- All MVP features work in the deployed environment.
- Auth and authorization hold under test.
- Data persists across restarts.
- Failures and invalid input are handled gracefully.
- No secrets are exposed.

Completion status: Not started.

---

## 10. API and Data Flow

The backend owns GameHub data and proxies external game data. Proposed endpoints below are Planned and do not exist yet except where noted.

| Area | Method | Path (proposed) | Source | Status |
| --- | --- | --- | --- | --- |
| Health/greeting | GET | /api/hello | Spring Boot | Current |
| Game list/search | GET | /api/games | External API via Spring Boot | Planned |
| Game detail | GET | /api/games/{id} | External API via Spring Boot | Planned |
| Register | POST | /api/auth/register | PostgreSQL | Planned |
| Login | POST | /api/auth/login | PostgreSQL + JWT | Planned |
| Current user/profile | GET | /api/users/me | PostgreSQL | Planned |
| Public profile | GET | /api/users/{id} | PostgreSQL | Planned |
| Library | GET/POST/PUT/DELETE | /api/library | PostgreSQL | Planned |
| Reviews | GET/POST/PUT/DELETE | /api/reviews | PostgreSQL | Planned |
| Posts | GET/POST | /api/posts | PostgreSQL | Planned |
| Comments | GET/POST | /api/posts/{id}/comments | PostgreSQL | Planned |
| Likes | POST/DELETE | /api/posts/{id}/like | PostgreSQL | Planned |

### Discovery flow (external data)

```mermaid
sequenceDiagram
  participant U as User
  participant R as React
  participant S as Spring Boot
  participant G as External Game API
  U->>R: Open Explore Games
  R->>S: GET /api/games?search=...
  S->>G: Request game data
  G-->>S: Game data
  S-->>R: Normalized JSON
  R-->>U: Render games, loading or error state
```

### Auth and social flow (own data)

```mermaid
sequenceDiagram
  participant U as User
  participant R as React
  participant S as Spring Boot
  participant P as PostgreSQL
  U->>R: Submit login
  R->>S: POST /api/auth/login
  S->>P: Verify user
  P-->>S: User record
  S-->>R: Token
  R->>S: Request with token
  S->>P: Read/write own data
  S-->>R: JSON response
```

### Layer roles

- PostgreSQL: schema, constraints, and relationships for features that need persistence.
- Spring Boot: entity, repository, service, validation, and REST controller as appropriate; external API integration for game data.
- React: pages and components, calling the API, handling UI states.
- Integration testing: confirm the complete feature works from the UI through the backend to the required data source.

A feature does not always need a database table. Game discovery primarily uses the external API through Spring Boot. A complete vertical feature is tested before the next feature starts because it proves the layers communicate correctly and keeps the project in a working state.

---

## 11. Testing Strategy

Planned approach:

- Test each feature individually as it is built.
- Test features in combination as dependencies grow.
- Verify authentication and authorization.
- Verify database persistence.
- Handle API failures and invalid input.
- For game discovery, verify the external API → Spring Boot → React flow, including loading, error, and empty states.

Current evidence:

- Backend has a single context-load test (BackendApplicationTests, contextLoads). No feature tests exist.
- Frontend has no test setup configured in package.json.

This is Open: a testing tool for the frontend still needs to be chosen.

---

## 12. Deployment Strategy

Planned approach:

- Deploy frontend, backend, and PostgreSQL.
- Configure production environment variables (not committed).
- Verify the deployed application end to end.

PostgreSQL is preferred because it is easier for the author to deploy. Specific hosting targets are Open (section 15).

Current status: Not started. No deployment configuration exists.

---

## 13. Development Preferences and Rules

These preferences must be preserved:

- Use Option C: feature-by-feature full-stack development.
- Follow an MVP-first approach.
- Prefer PostgreSQL because it is easier to deploy.
- Keep the architecture understandable and maintainable.
- Avoid implementing too many features at once.
- Avoid unnecessary dependencies and premature complexity.
- Use the existing project structure where appropriate.
- Make decisions based on actual requirements, not because a feature is common in other social platforms.
- Explain significant architectural decisions and their trade-offs.
- Keep secrets out of version control (.env is untracked and ignored).

---

## 14. Current Implementation Status

Verified by inspecting the repository. No feature beyond scaffolding is implemented.

| Item | Status | Evidence |
| --- | --- | --- |
| Frontend scaffold (React 19, Vite 8, Tailwind v4, React Router 7) | Current | Frontend/package.json, vite.config.js |
| Home route `/` placeholder | Current | App.jsx HomePage |
| Explore route `/explore` placeholder | Current | App.jsx ExplorePage |
| Empty scaffolding dirs (components, contexts, hooks, pages, routes, services) | Current, empty | no files inside |
| Backend scaffold (Spring Boot 4.1.1, Java 21) | Current | pom.xml |
| dotenv loading of .env | Current | BackendApplication.java |
| Hello endpoint GET /api/hello | Current | HelloController.java |
| PostgreSQL properties (ddl-auto=none) | Current | application.properties |
| .env keys DB_URL, DB_USERNAME, DB_PASSWORD | Current, untracked | .env, .gitignore |
| Database connectivity verified | Not verified | no run evidence |
| Frontend calls backend | Not started | no fetch/axios usage |
| JPA entities / repositories | Not started | none in source |
| Spring Security / JWT | Not started | not in pom or code |
| External game API integration (RAWG) | Not started | none in source |
| Tests beyond contextLoads | Not started | only contextLoads |

Observed differences from the plan:

- The frontend includes React Router and lucide-react, which were not in the originally stated stack. React Router is needed for the planned pages, so it is not a conflict; lucide-react is Open.
- The backend uses package `com.gamehub.backend` with a `controllers` subpackage, which fits the planned structure.
- application.properties sets ddl-auto=none, consistent with the plan to manage the schema deliberately rather than auto-generate it.
- The .env file was committed to git and then untracked (commit caea6b0). Secrets remain in history; rotating them may be advisable. This is Open.

No action was taken to change any of the above; this is documentation only.

---

## 15. Open Decisions and Dependencies

Open decisions:

- External game API: confirm RAWG or another API. Confirm how the API key is stored and used server-side.
- Auth architecture: confirm Spring Security + JWT, and refresh/session strategy.
- Game references: store only external ids with cached display fields, or store a local game record for libraries and reviews.
- Profile model: separate profile entity or fields on the user.
- Reviews: whether edit/delete is in the MVP or right after.
- Likes/reactions: which content types can be liked.
- Frontend testing tool: choose one.
- lucide-react: officially adopted or incidental.
- Deployment targets for frontend, backend, and PostgreSQL.
- CORS configuration between Vite dev server and Spring Boot.
- Secrets in git history from the earlier .env commit: whether to rotate.

Dependencies between features:

- Authentication depends on the user model.
- Library and reviews depend on authentication and on a game reference.
- Profiles depend on authentication.
- Community posts depend on authentication.
- Deployment depends on all MVP features.

---

## 16. Long-Term Ideas

Beyond the MVP and separable from it:

- Real-time chat.
- Advanced friendship and following systems.
- Notifications.
- Tournaments and competitive events.
- AI-powered features.
- A separate mobile application.

These are ideas only. They must not block MVP completion.

---

## 17. Immediate Next Steps

1. Confirm the Open decisions in section 15, starting with the external game API and the auth approach.
2. Finish Phase 1: verify PostgreSQL connectivity and stand up a React-to-Spring-Boot request.
3. Begin Phase 2 (game discovery) as the first full-stack feature.
4. Keep .env untracked and consider rotating any secrets already committed.

---

## 18. Project Decision History

| # | Decision | Reasoning | Status |
| --- | --- | --- | --- |
| 1 | Build GameHub as a social gaming platform, not just a catalog | Combine discovery with social features | Original decision |
| 2 | Use React + Vite + Tailwind on the frontend | Modern, familiar tooling | Original decision |
| 3 | Use Java 21 + Spring Boot on the backend | Requested stack, strong REST/JPA support | Original decision |
| 4 | Use PostgreSQL | Easier for the author to deploy | Original decision |
| 5 | Communicate over REST APIs | Simple, clear frontend/backend boundary | Original decision |
| 6 | Use RAWG or the selected external API for game data; backend is the integration layer | Keep the frontend away from the API key and normalize data | Original decision |
| 7 | Use Spring Security + JWT for auth | Secure, stateless-friendly | Original decision, to verify |
| 8 | Choose Option C (feature-by-feature full-stack) over A and B | Incremental, tests layers early, keeps app working | Original decision |
| 9 | Adopt an MVP-first strategy with six core features | Manageable first version | Original decision |
| 10 | Defer chat, friendships, notifications, tournaments, AI, mobile app | Avoid premature complexity | Original decision |
| 11 | Keep PostgreSQL schema management deliberate (ddl-auto=none) | Avoid uncontrolled schema changes | Reflected in current config |
| 12 | Untrack .env and ignore it | Keep secrets out of version control | Completed |
| 13 | Adopt a learn-by-building workflow with AI assistance | The goal is skill growth, not only working code | Original decision |
| 14 | Treat the RAWG API key and other secrets as server-side only | Never expose secrets in frontend, Git, logs, or docs | Original decision |

This table is the reference for future sessions. Do not change decision 8 (Option C) or the MVP-first strategy without an explicit new decision.

---

## 19. Development and Learning Rules

GameHub is built to improve software development skills, not only to finish a project. The stack is React, JavaScript, Spring Boot, PostgreSQL, and the RAWG API. Frontend, backend, and database are already running, and a RAWG API key is available.

Learning priorities (in order):

1. JavaScript — the main priority, especially objects, arrays, functions, asynchronous code, promises, modules, and error handling.
2. React — understand components, props, state, hooks, and rendering, and how they connect to JavaScript.
3. Spring Boot — understand controllers, services, repositories, DTOs, dependency injection, and database access.

Rules for AI assistance:

1. Read plan.md and inspect the relevant source files before suggesting changes.
2. Before implementing a feature, explain the concepts needed to understand it.
3. Break work into small, understandable steps instead of generating an entire feature at once.
4. Explain what the code does, why it is needed, and when this approach is appropriate.
5. Pay particular attention to JavaScript fundamentals: objects, arrays, functions, asynchronous code, promises, modules, and error handling.
6. When working with React, explain how JavaScript concepts connect to components, props, state, hooks, and rendering.
7. When working with Spring Boot, explain the responsibilities of controllers, services, repositories, DTOs, dependency injection, and database access as relevant.
8. Encourage the author to attempt manageable parts before revealing a complete solution. Give hints first during learning exercises.
9. Do not overwhelm with unrelated concepts or advanced abstractions unnecessary for the current feature.
10. Do not change working code or refactor unrelated parts of the project.
11. Do not expose the RAWG API key or other secrets in frontend code, Git, logs, or documentation.
12. After each feature, give a short knowledge check and a small independent coding exercise.
13. Help debug by explaining the evidence and reasoning instead of immediately replacing code.
14. Keep plan.md updated with verified progress, important decisions, and concepts learned.

Required workflow for each feature:

| Step | Action |
| --- | --- |
| 1 | Explain the feature and its data flow. |
| 2 | Identify the relevant learning concepts. |
| 3 | Give a small exercise or ask the author to explain their understanding. |
| 4 | Implement the feature incrementally with the author's participation. |
| 5 | Test the feature and explain any errors. |
| 6 | Ask the author to explain how the implementation works. |
| 7 | Give one small task to complete independently. |
| 8 | Record the verified result in plan.md. |

Objective: become capable of designing, implementing, debugging, and explaining a full-stack application independently, not just producing working code.

### Concepts learned log

| Date | Feature / Phase | Concept | Notes |
| --- | --- | --- | --- |
| (pending) | — | — | To be filled as features are completed. |
