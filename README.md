# AFTERFORM Stock Dashboard — Vercel deploy

This is your original dashboard, unchanged in look and feel, with one addition:
data is now saved to real server-side storage (Vercel Blob) instead of only
the browser's localStorage. That means it won't disappear if you clear your
browser, and you can open the dashboard from your phone and your laptop and
see the same data.

## What changed
- `index.html` — same UI/logic, but every save now also POSTs to `/api/data`,
  and on load it fetches the saved state from the server. localStorage is
  kept as an instant local cache, so the page still feels fast and still
  works offline; the server copy is the durable one.
- `api/data.js` — a serverless function (runs on Vercel) that writes the
  whole dashboard state as one JSON file to Vercel Blob storage, and reads
  it back on load.
- `package.json` — declares the one dependency (`@vercel/blob`) the API
  route needs.

(Note: I originally used Vercel KV in an earlier draft, but Vercel
deprecated KV — it's now Vercel Blob, which is simpler to set up anyway:
no database provider to choose, just one click in the Storage tab.)

## Deploy steps

1. **Push this folder to a GitHub repo** (or drag-and-drop deploy via the
   Vercel dashboard if you'd rather skip GitHub).

2. **Create the project on Vercel**
   - Go to vercel.com → New Project → import the repo.
   - Framework preset: "Other" (no build step needed).
   - Deploy it once — you need the project to exist before attaching storage.

3. **Add a Blob store** (this is what makes data persist)
   - In your Vercel project → Storage tab → Create Database → Blob.
   - Choose Public or Private access — Public is simplest and is what this
     code uses.
   - Connect it to this project. Vercel automatically adds the
     `BLOB_READ_WRITE_TOKEN` environment variable — you don't need to copy
     anything manually.

4. **Redeploy** so the new environment variable is picked up (Vercel
   usually triggers this automatically right after you attach the store;
   if not, redeploy from the Deployments tab).

5. Open your `*.vercel.app` URL — the dashboard should load, and any
   changes you make will show a "Saving… / Saved" status in the header.

## Note on privacy
This dashboard has no login — anyone with the URL can view and edit the
data, and (since the Blob store is set to Public access) anyone who
guesses or finds the exact data file URL could read it directly too.
That's fine for personal/private use with an unguessable project URL, but
if you want it properly locked down, I can add a simple passcode gate to
the page, or switch the Blob store to Private access — just ask.
