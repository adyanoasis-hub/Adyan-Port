# Adyan's Portfolio

This folder contains a personal publication website, an article reader and a private article editor. The public pages are plain HTML/CSS/JavaScript. Supabase provides sign-in and a persistent database for drafts and published writing. The editor does not save anything until you complete the one-time setup below.

## Preview the design

Open `index.html` in your browser. Before Supabase is configured, the homepage shows ten sample article ideas, each marked **PLACEHOLDER**. The sample text is not represented as Adyan's writing. The private editor shows setup instructions until it is connected.

## Set up private article publishing

Supabase's free plan currently includes a database and Auth, with usage limits; free projects may pause after one week of inactivity. If it pauses, resume it in the Supabase dashboard. Consider a paid plan if you need the database to remain continuously available. Check the current [Supabase pricing and limits](https://supabase.com/pricing) before choosing a plan.

1. Create an account at [Supabase](https://supabase.com/) and create a project. Save the database password somewhere private.
2. In Supabase, open **Authentication → Sign In / Providers**. Keep email/password sign-in enabled and turn off public sign-ups. This site has no public account-creation screen.
3. In **Authentication → Users**, add your own user with your email and a strong password. Confirm the account if the dashboard gives you that option. This is the only account that should be able to edit the portfolio.
4. Open that user and copy its **User UID**.
5. Open `supabase-schema.sql` in a text editor. Replace every instance of `00000000-0000-0000-0000-000000000000` with your User UID. Run the complete updated SQL in Supabase **SQL Editor**. The database policies then let the public read published articles and let only that exact user read drafts or create, edit, publish and delete articles.
6. In Supabase **Project Settings → API**, copy the **Project URL** and the **publishable key** (sometimes called the `anon` key). Put them into `supabase-config.js`:

   ```js
   window.PORTFOLIO_CONFIG = {
     supabaseUrl: "PASTE_PROJECT_URL_HERE",
     supabaseAnonKey: "PASTE_PUBLISHABLE_KEY_HERE"
   };
   ```

   The publishable key is designed to be visible in a browser; the database policies protect the content. **Never put a secret key or `service_role` key in this folder or a public repository.**
7. Save the file and upload the website to a host. Then add your live website address to Supabase **Authentication → URL Configuration → Redirect URLs**. You can also set the site URL to the same address.
8. Visit `your-site-address/admin.html`, sign in with your email and password, then choose **New Article**.

The editor supports titles, summaries, topics, optional dates and cover image URLs, rich text, pasting formatted text, preview, drafts, publishing, editing, unpublishing and deletion. Drafts stay private in the database. Published articles appear on the homepage and have their own readable page. The cover image field accepts a public image URL; image file uploads are not included.

### Hosting free with GitHub Pages

GitHub Pages can host these static files on GitHub Free when the repository is public. That means the HTML, styling and public database connection settings are visible to visitors. The database still keeps drafts and write actions protected by the owner-only Supabase policies. Never put passwords, private notes or secret keys in this folder. A custom domain is optional and usually costs money. Read [GitHub's Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

1. Create a GitHub account if needed, then create a **public repository** such as `adyans-portfolio`.
2. Upload the contents of this folder to the top level of the repository. `index.html` should be at the top level, not tucked inside an extra folder.
3. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After GitHub publishes the site, visit its address. Check the homepage, article page, `admin.html` login, and CV button.
5. Add the live address in Supabase Auth URL Configuration as described above.

GitHub's controls may move over time; if a screen differs, share a screenshot or describe what you see and I can guide you through that step.

## Update your About Me section

Edit the two paragraphs in the `#about` section of `index.html`. This is static profile text, so changing it means editing and uploading that file. You do not need to edit website code to write or manage articles after Supabase is configured.

## Add your CV

The CV button opens `cv.pdf`. The included PDF is only a clearly labelled placeholder and contains no invented qualifications or work history. Replace it with your own PDF using the exact same filename, `cv.pdf`, and upload the replacement file. The button will then open/download your document.

## Files at a glance

- `index.html` — home, article list, About Me and CV sections
- `read.html` — full article reader
- `admin.html` — private login and writing desk
- `script.js`, `read.js`, `admin.js` — site, reader and editor behaviour
- `styles.css` — responsive visual design
- `supabase-config.js` — public Supabase project settings
- `supabase-schema.sql` — persistent article table and access rules
- `cv.pdf` — replaceable CV placeholder
