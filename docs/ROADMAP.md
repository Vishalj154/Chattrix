# Chattrix – Updated Roadmap (Post-Audit)
> Codebase analyzed: `c:\projects\Chattrix` · Audit date: 2026-06-26

---

## Audit Summary

| Area | Status |
|---|---|
| Project scaffold (Vite + React) | ✅ Complete |
| Firebase SDK configured | ✅ Complete |
| Routing skeleton | ⚠️ Partial |
| Auth – Email/Password | ✅ Complete |
| Auth – Google OAuth | ✅ Complete |
| Auth – Forgot Password | ❌ Missing |
| Auth – AuthContext / AuthGuard | ❌ Missing |
| Profile page (basic view) | ⚠️ Partial |
| Profile Setup (first-login flow) | ❌ Missing |
| Avatar upload to Firebase Storage | ❌ Missing |
| Firestore user document | ❌ Missing (MySQL used instead) |
| Backend (Express + MySQL) | ✅ Present (deviates from plan) |
| Real-time Chat | ❌ Not started |
| Image Messages | ❌ Not started |
| User Search | ❌ Not started |
| Security Rules | ❌ Not started |
| Settings / Dark Mode | ❌ Not started |
| Deployment | ❌ Not started |

---

## What's Built

### ✅ Completed

- **Vite + React scaffold** — `frontend/react/` with Vite config, `package.json`, `index.html`
- **Firebase SDK init** — `src/firebase.jsx` initializes Auth, exports `auth` and `provider` (GoogleAuthProvider). Env-var validation present. Uses `.env.local`.
- **Email/Password Signup** — `signup.jsx` — `createUserWithEmailAndPassword`, validation (email, phone ≥10, password ≥6, confirm match), loading spinner, form UI.
- **Google OAuth (Signup)** — `signup.jsx` — `signInWithPopup` with GoogleAuthProvider.
- **Email/Password Login** — `login.jsx` — `signInWithEmailAndPassword`, loading state, navigate to `/profile`.
- **Google OAuth (Login)** — `login.jsx` — `signInWithPopup`, navigate to `/profile`.
- **Basic Profile page** — `components/Profile.jsx` + `ProfileHeader.jsx` — shows Firebase Auth user's name, email, photo, fetches phone from MySQL backend, logout button via `signOut`.
- **Express + MySQL backend** — `backend/server.js` — `/api/users/register` (POST), `/api/users/:uid` (GET), `/api/users/update-phone` (PUT). Runs on port 5000.
- **React Router** — `App.jsx` defines routes for `/`, `/signup`, `/login`, `/profile`.
- **Global CSS foundation** — `index.css` has auth-card, input-field, btn-primary, btn-google, spinner, divider, password-wrapper styles.
- **`components/Settings.jsx`** — exists but is a stub (empty placeholder).

---

### ⚠️ Partially Complete

| Feature | What exists | What's missing |
|---|---|---|
| **Routing** | `/`, `/signup`, `/login`, `/profile` | `/forgot-password`, `/setup-profile`, `/app/*` routes, 404 route |
| **Profile Page** | Displays Firebase Auth data + phone from MySQL | No avatar upload, no Firestore, no edit form, no default avatar fallback |
| **Auth error handling** | Raw Firebase error messages via `alert()` | Friendly mapped messages, no inline errors |
| **Backend** | Express + MySQL registers users | Deviates from plan (plan = Firestore only). Needs a decision: keep MySQL hybrid or migrate fully to Firestore |

---

### ❌ Not Started

- AuthContext (`onAuthStateChanged` listener, session persistence)
- AuthGuard (protected route wrapper)
- Forgot Password page (`sendPasswordResetEmail`)
- Profile Setup page (first-login flow, avatar upload to Storage)
- Firestore integration (user docs, chat schema, messages)
- All `/app/*` routes: Chat List, Chat Room, User Search, Settings
- Chat components: `ChatBubble`, `ChatInput`, `ChatHeader`, `MessageList`
- Real-time messaging (`onSnapshot`)
- Unread counts, read receipts
- Online presence
- Image messages
- User search (Firestore query)
- Firestore Security Rules
- Firebase Storage rules
- Dark/Light mode (`ThemeContext`)
- 404 page
- Loading skeletons + empty states
- React.lazy + Suspense (lazy loading)
- Firebase Hosting + deployment
- README + documentation

---

## Architecture Deviation: MySQL Backend

> ⚠️ **Warning:** The current implementation uses a custom Express + MySQL backend (`backend/server.js`) to store user data — this is a significant deviation from the blueprint which specified 100% Firebase (Firestore only).

**Decision required before continuing:**

| Option | Pros | Cons |
|---|---|---|
| **A) Keep MySQL hybrid** | You get to practice both stacks | Adds complexity, two servers to run, complicates deployment, breaks Firebase-only portfolio pitch |
| **B) Migrate to Firestore** | Pure Firebase as planned, simpler deployment, free hosting, cleaner portfolio | Need to drop MySQL backend, rewrite profile fetch/update |

**Recommendation: Option B — migrate to Firestore.** The MySQL backend is very thin (3 routes) and easy to replace. All three endpoints map cleanly to Firestore operations.

---

## Updated Milestone Roadmap

### ✅ Milestone 1 – Foundation
*Status: **Complete***

All done: Vite scaffold, Firebase SDK, React Router (skeleton), env config, CSS base.

---

### ⚠️ Milestone 2 – Authentication
*Status: **~60% Complete** — resuming here*

**Already done:**
- [x] Email/Password signup
- [x] Google OAuth (signup + login)
- [x] Email/Password login
- [x] Loading states on auth buttons
- [x] Basic form validation

**Remaining tasks:**
- [ ] Build `AuthContext` — wrap app with `onAuthStateChanged`, expose `currentUser`, `loading` state
- [ ] Build `AuthGuard` — redirect unauthenticated users away from `/profile`, `/app/*`
- [ ] Forgot Password page — `sendPasswordResetEmail`, success/error states
- [ ] Replace `alert()` with inline error messages — map Firebase error codes to friendly strings
- [ ] Post-login redirect logic — after login, check if Firestore profile doc exists → `/setup-profile` or `/app/chats`
- [ ] Auth state persistence — confirm `browserLocalPersistence` is set

**Estimated time:** 4–5 hours

---

### 🔲 Milestone 2.5 – Firestore Migration (New — resolves architecture deviation)
*Status: **Not started***

> Only needed if you choose Option B (recommended).

**Tasks:**
- [ ] Add `getFirestore` to `firebase.jsx` (export `db`)
- [ ] On signup success — write user doc to `users/{uid}` (displayName, email, createdAt, photoURL: null, isOnline: false)
- [ ] On Google sign-in — `setDoc` with `merge: true` to `users/{uid}`
- [ ] Replace `ProfileHeader.jsx` MySQL calls with `getDoc('users/{uid}')`
- [ ] Replace phone update MySQL call with `updateDoc`
- [ ] Decommission `backend/` (or keep for reference only)

**Estimated time:** 2–3 hours

---

### 🔲 Milestone 3 – User Profile
*Status: **Not started** (depends on M2 + M2.5)*

**Tasks:**
- [ ] Profile Setup page (`/setup-profile`) — display name input, avatar upload (Firebase Storage), "Save & Continue" → `/app/chats`
- [ ] First-login detection — check Firestore `users/{uid}` after auth, redirect if missing
- [ ] Avatar upload with progress bar (`uploadBytesResumable`)
- [ ] `getDownloadURL` → save to Firestore `photoURL` field
- [ ] Default avatar fallback when `photoURL` is null
- [ ] Upgrade existing `Profile.jsx` + `ProfileHeader.jsx` — use Firestore instead of MySQL, add edit mode

**Estimated time:** 5–7 hours

---

### 🔲 Milestone 4 – App Shell + Routing
*Status: **Not started** (depends on M2)*

**Tasks:**
- [ ] Create `AppShell.jsx` — sidebar (desktop) + bottom tabs (mobile)
- [ ] Create `Sidebar.jsx` — own avatar, chat list area, nav icons
- [ ] Define all `/app/*` routes in `App.jsx` (Chat List, Chat Room, Search, Profile, Settings)
- [ ] Wrap all `/app/*` routes in `AuthGuard`
- [ ] Add `404` route + `NotFoundPage.jsx`
- [ ] Add Forgot Password route + page

**Estimated time:** 4–6 hours

---

### 🔲 Milestone 5 – Real-time Chat (Core)
*Status: **Not started** (depends on M3 + M4)*

**Tasks:**
- [ ] Firestore schema: `chats/{chatId}` + `chats/{chatId}/messages/{msgId}`
- [ ] `chat.service.js` — `createChat`, `sendMessage`, `listenToMessages`, `listenToChats`
- [ ] `ChatRoom` page — `ChatHeader`, `MessageList`, `ChatInput`
- [ ] `ChatBubble.jsx` — own (right) vs other (left), timestamp, status icon
- [ ] `ChatInput.jsx` — auto-grow textarea, send button, disable on empty
- [ ] `onSnapshot` real-time messages listener
- [ ] `onSnapshot` chat list listener
- [ ] Auto-scroll to bottom on new message
- [ ] Optimistic UI (message shows immediately before Firestore confirms)
- [ ] Unread count increment + reset on open
- [ ] Read receipts (`status: 'sent' → 'read'`)

**Estimated time:** 14–18 hours (largest milestone)

---

### 🔲 Milestone 6 – Presence + Search + Images
*Status: **Not started** (depends on M5)*

**Tasks:**
- [ ] Online presence — `isOnline` / `lastSeen` in Firestore, update on auth state change
- [ ] `SearchPage.jsx` — search input (debounced 300ms), Firestore `displayName` query
- [ ] `UserCard.jsx` — avatar, name, "Message" button
- [ ] Open/create chat on UserCard click
- [ ] Image message — file picker in `ChatInput`, validate type + size (≤5MB)
- [ ] Upload to `chat-images/{chatId}/{messageId}` in Storage
- [ ] Display image bubbles in `MessageList`

**Estimated time:** 7–9 hours

---

### 🔲 Milestone 7 – Security Rules
*Status: **Not started** (depends on M5)*

**Tasks:**
- [ ] Firestore rules — `users` (read: auth, write: own), `chats` (participants only), `messages` (participants, sender only for create)
- [ ] Storage rules — `avatars/{uid}/*` (write: own, read: auth), `chat-images` (write: auth ≤5MB image/*)
- [ ] Test with Firebase Emulator Rules Playground

**Estimated time:** 3–4 hours

---

### 🔲 Milestone 8 – Polish + Settings
*Status: **Not started***

**Tasks:**
- [ ] `Settings.jsx` — upgrade stub to real page (dark/light toggle, logout with confirmation)
- [ ] `ThemeContext.jsx` — CSS variable switching, `localStorage` persistence
- [ ] Loading skeletons for Chat List + Chat Room
- [ ] Empty states (Chat List, Search, Chat Room)
- [ ] Error states with retry
- [ ] Replace all remaining `alert()` calls with `react-hot-toast`
- [ ] `NotFoundPage.jsx`

**Estimated time:** 5–6 hours

---

### 🔲 Milestone 9 – Performance + Deploy
*Status: **Not started***

**Tasks:**
- [ ] Wrap page components in `React.lazy` + `Suspense`
- [ ] Message pagination (`limit(30)`, paginate up on scroll)
- [ ] Client-side image compression before upload
- [ ] `React.memo` on `ChatBubble`, `UserCard`
- [ ] Lighthouse audit — target ≥85 performance, ≥90 accessibility
- [ ] Firebase Hosting setup (`firebase.json` SPA rewrites)
- [ ] Production Firebase project + `.env` for prod
- [ ] `firebase deploy`
- [ ] README.md
- [ ] `.env.example` — already present ✅
- [ ] Tag `v1.0.0` on GitHub

**Estimated time:** 6–8 hours

---

## Recommended Next Steps (in order)

1. **Decide: MySQL vs Firestore** — strongly recommend Firestore-only
2. **Complete Milestone 2** — build `AuthContext` + `AuthGuard` + Forgot Password
3. **Do Milestone 2.5** — migrate to Firestore (if chosen)
4. **Build Milestone 3** — Profile Setup with avatar upload
5. **Build Milestone 4** — App Shell + full routing
6. Then proceed sequentially through M5 → M9

---

## File Structure Gap Analysis

### Files that exist but need upgrades

| File | Issue |
|---|---|
| `src/signup.jsx` | Uses `alert()`, no AuthContext, no Firestore write |
| `src/login.jsx` | Uses `alert()`, no AuthContext, navigates to `/profile` (not `/app/chats`) |
| `src/firebase.jsx` | Missing `getFirestore`, `getStorage` exports |
| `components/ProfileHeader.jsx` | Uses MySQL via axios; needs Firestore; no default avatar |
| `components/Settings.jsx` | Empty stub |
| `src/App.jsx` | Missing all `/app/*` routes, `/forgot-password`, `/setup-profile`, `404` |

### Files that need to be created (from blueprint)

```
src/
  contexts/
    AuthContext.jsx        ← HIGH PRIORITY
    ThemeContext.jsx
  components/
    auth/
      AuthGuard.jsx        ← HIGH PRIORITY
    chat/
      ChatBubble.jsx
      ChatInput.jsx
      ChatHeader.jsx
      MessageList.jsx
    layout/
      AppShell.jsx
      Sidebar.jsx
    user/
      UserCard.jsx
  pages/
    ForgotPasswordPage.jsx ← HIGH PRIORITY
    SetupProfilePage.jsx
    ChatsPage.jsx
    ChatRoomPage.jsx
    SearchPage.jsx
    NotFoundPage.jsx
  services/
    auth.service.js
    chat.service.js
    user.service.js
    storage.service.js
    presence.service.js
firestore.rules
storage.rules
```
