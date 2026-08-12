# RoomTag — setup guide

> **If you already deployed an earlier version:** replace your Firestore
> rules with the version in step 2 below — this update adds a rule for a
> new `assignments` subcollection, and results won't load at all against
> older rules. Any assignments generated before this update won't carry
> over; just click **Generate** again once the new rules and `app.js` are
> live. Rosters and login codes from the previous update are unaffected.

This is a static site (plain HTML/JS — no server, no build step needed to run it)
that talks to a free Firebase project for storage and login. Total cost at this
scale: **$0**, forever, on Firebase's free "Spark" plan and GitHub Pages' free tier.

Two accounts needed, both free: a **Google account** (for Firebase) and a
**GitHub account** (you already have this).

---

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com and click **Add project**.
2. Give it a name (e.g. "roomtag"), and you can skip Google Analytics — not needed.
3. Once created, you'll land on the project overview page.

## 2. Turn on Firestore (the database)

1. In the left sidebar, click **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode** (not test mode).
4. Pick a location close to you (any US region is fine) and click **Enable**.
5. Once it's created, click the **Rules** tab and replace everything with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /trips/{tripCode} {
         allow get: if true;
         allow list: if request.auth != null;
         allow create, update, delete: if request.auth != null;

         match /logins/{loginCode} {
           allow get: if true;
           allow list: if request.auth != null;
           allow create, update, delete: if request.auth != null;
         }

         match /requests/{loginCode} {
           allow get: if true;
           allow list: if request.auth != null;
           allow create, update: if true;
           allow delete: if request.auth != null;
         }

         match /assignments/{doc} {
           allow get: if (resource != null && resource.data.published == true) || request.auth != null;
           allow list: if request.auth != null;
           allow create, update, delete: if request.auth != null;
         }
       }
     }
   }
   ```

   Click **Publish**.

   **What this does:** the trip document itself (name, room list, locked
   status) is publicly readable so students can look up a trip by its trip
   code — but it never contains anyone's private login code, and it no
   longer contains room assignments either. Login codes live in their own
   `logins` subcollection, where a specific code is only readable if you
   already know its exact value; nobody can browse the
   full list of codes for a trip without being signed in as an
   administrator. The same pattern protects `requests`: a specific
   student's roommate picks are only readable or writable by whoever holds
   that student's private login code, and the full list of everyone's
   requests can only be listed by an administrator. Nothing lets one
   student read or edit another student's submission, and nothing lets
   anyone browse the full roster of login codes, without being signed in
   as an administrator. Room assignments live in their own document with a
   `published` flag: it's unreadable by anyone but an administrator until
   you explicitly click "Publish results" in the Assignments tab, and every
   time you regenerate, publishing resets so you always get a fresh look
   before results go live again.

## 3. Turn on administrator login

1. In the left sidebar, click **Build → Authentication**.
2. Click **Get started**.
3. Click **Email/Password** in the provider list, toggle it **on**, and **Save**.
4. Go to the **Users** tab and click **Add user**.
5. Enter your own email and choose a password. This is your administrator login.

   You can add more administrators later the same way (e.g. a co-organizer) —
   just repeat this step with their email.

   **There is no "sign up" screen in the app itself, on purpose.** The only
   way to become an administrator is for someone to add you here, in the
   Firebase console. That's what actually keeps the organizer side restricted
   to administrators only.

### Resetting a password

If you (or another admin) forget the password, click **"Forgot password?"**
on the app's administrator login screen and enter the account's email —
Firebase emails a reset link automatically. No code changes, no me involved.

If that email ever stops working, you can also just open **Authentication →
Users** in the Firebase console, click the account, and reset it directly,
or delete and re-add the user.

## 4. Get your web app config

1. Click the gear icon next to **Project Overview** → **Project settings**.
2. Scroll to **Your apps** and click the **`</>`** (web) icon to register a new web app.
3. Give it any nickname, skip Firebase Hosting (you're using GitHub Pages instead), click **Register app**.
4. You'll see a `firebaseConfig` object with `apiKey`, `authDomain`, etc. Copy those values.
5. Open **`firebase-config.js`** in this folder and paste your real values in place of the placeholders. Save.

   It's normal and safe for these values to be visible in your site's public
   source code — a Firebase `apiKey` isn't a secret the way a server API key
   is. The security rules from step 2 are what actually control access, not
   this file.

## 5. Push to GitHub and turn on Pages

1. Create a new **public** repository on GitHub (Pages is free for public repos).
2. Upload everything in this folder — `index.html`, `firebase-config.js` (with your real values), `app.js`, `.nojekyll` — to the repo root (or commit via git).
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch," pick your branch (usually `main`) and folder `/ (root)`, then **Save**.
5. GitHub will give you a URL like `https://yourusername.github.io/your-repo-name/`. That's the link for everyone — students and administrators alike.

That's it — no further build step. If you ever edit `App.jsx` yourself and
need a new `app.js`, that requires Node/esbuild; ask me and I can rebuild it
for you and hand you a new `app.js` to drop in.

---

## How it works day to day

- Share the GitHub Pages link with your class. Anyone can open it.
- Only someone signed in with an administrator account (created in step 3)
  ever sees the organizer side — there's a small "Administrator login" link
  at the bottom of the home screen.
- Everything else — creating trips, uploading a roster, defining rooms,
  locking requests, generating and adjusting assignments — works exactly as
  before. Multiple trips can run at once; each has its own roster, rooms,
  and requests, and there's a trip switcher inside the dashboard.

## Cost and limits

Firebase's free Spark plan includes 50,000 document reads, 20,000 writes,
and 1GB of storage per day, with unlimited email/password sign-ins. A trip
with 125 students doing a handful of reads/writes each doesn't come close —
you could run many simultaneous trips, every semester, indefinitely, and
stay on the free tier.
