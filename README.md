# Memory Tickets — legal & support site

A dependency-free static site (4 files, no build step, no framework) that hosts the
**publicly reachable URLs both app stores require** in their listing metadata:

| Store field | Page |
|---|---|
| Privacy Policy URL (App Store **and** Play — mandatory) | `privacy-policy.html` |
| Support URL (App Store — mandatory) | `index.html` |
| Terms of Use / EULA URL (App Store — optional but recommended for subscriptions) | `terms-of-use.html` |

The in-app legal screens are **not** a substitute for these: the stores need a URL
they can open in a browser, outside the app, before the app is even installed.

## Content source

`../privacy-policy.md` and `../terms-of-use.md` remain the canonical English source.
These HTML pages carry the same text plus a Polish translation, with a language
toggle. **If you edit one, edit the other** — the store-facing page and the in-app
screens (Android `res/values*/strings.xml`, iOS `Localizable.xcstrings`) should not
drift apart.

Note the in-app Android copy of the Terms deliberately omits the "Apple App Store
users" clause, since that binary is never distributed through Apple. This shared web
version keeps it, because it serves users of both platforms.

## Preview locally

```sh
cd legal/site
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

Free, permanent, no maintenance. The URL must keep working for as long as the app is
listed, so use a repo you won't delete.

**1. Create the repo on GitHub first** (this directory has no remote yet):
go to [github.com/new](https://github.com/new) → name it e.g. `memory-tickets-legal`
→ **Public** → do NOT add a README/gitignore/license (this folder already has
content) → Create repository.

**2. Push this folder to it:**

```sh
cd legal/site
git init
git add .
git commit -m "Memory Tickets legal and support pages"
git branch -M main
git remote add origin https://github.com/<your-username>/memory-tickets-legal.git
git push -u origin main
```

(If `git push` asks for a password: GitHub no longer accepts your account password
there — use a [Personal Access Token](https://github.com/settings/tokens) as the
password instead, or set up the GitHub CLI / SSH once and it'll remember you.)

**3. Turn on Pages:** repo → **Settings → Pages → Source: "Deploy from a branch"**
→ branch `main`, folder `/ (root)` → **Save**.

After a minute or two the pages are live at:

```
https://<your-username>.github.io/memory-tickets-legal/
https://<your-username>.github.io/memory-tickets-legal/privacy-policy.html
https://<your-username>.github.io/memory-tickets-legal/terms-of-use.html
```

Those are the URLs to paste into App Store Connect and Play Console.

### Before you paste them in

- Open each URL in a private browser window — if it 404s, Pages hasn't finished
  building, or the repo is private (it must be **public**).
- Both stores reject policy URLs behind a login, a paywall, or a redirect chain.
- `?lang=pl` deep-links straight to the Polish version (e.g. for a Polish store
  listing): `.../privacy-policy.html?lang=pl`

## Notes on the implementation

- **No JS required to read the content.** The stylesheet only hides a language block
  once `<html>` has the `js` class. If scripts are blocked, both languages render in
  full rather than the page appearing blank — a store reviewer must never hit an
  empty policy.
- **No external requests.** No fonts, no CDN, no analytics. The page loads instantly
  and works offline.
- Palette mirrors the app's design system
  (`ios/MemoryTickets/Sources/DesignSystem/Colors.swift`).
