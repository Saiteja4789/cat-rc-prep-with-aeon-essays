# CAT RC Prep with Aeon Essays

This is an interactive web app to help you prepare for the Reading Comprehension (RC) section of the CAT exam. It uses Aeon.co essays and leverages the Gemini API for vocabulary analysis and question generation.

## Core Features

-   **Dynamic Essay Content**: Select from a list of high-quality essays. The list shuffles on each visit to simulate a fresh feed.
-   **AI-Powered Vocabulary**: Automatically identifies and highlights difficult words. Hover to see definitions and usage examples.
-   **AI-Generated RC Questions**: Generates 4-5 exam-level RC questions based on the essay content.
-   **Multi-User System (Simulation)**: Features a full signup and login flow. User progress, including essays read and daily streak, is saved to a "database" in the browser's local storage.
-   **Dark Mode UI**: A clean, modern, and comfortable dark theme for focused reading sessions.

## Important Note on the User System

The user account system in this application is a **simulation** designed to demonstrate full application functionality in a self-contained manner. It uses the browser's `localStorage` to act as a simple database.

**This is NOT secure for a production environment.** For a real-world, multi-user application, you must replace the `services/userService.ts` logic with a proper backend service and database (e.g., Node.js + Express + PostgreSQL/MongoDB). This is crucial for securely hashing passwords and ensuring data is persisted across different devices and browsers for each user.

## Making it Fully Functional & Hosting

This project is a self-contained React application that doesn't use a traditional build tool like Vite or Webpack. To make it fully functional for hosting (especially to handle the Gemini API key securely), it's highly recommended to migrate it into a standard Vite project.

Here's a step-by-step guide to do that and deploy it to a static hosting service like **Vercel** or **Netlify**.

### Step 1: Create a New Vite Project

First, create a new React project with TypeScript using Vite.

```bash
# npm 7+, extra double-dash is needed:
npm create vite@latest my-cat-prep-app -- --template react-ts

# or with yarn/pnpm
# yarn create vite my-cat-prep-app --template react-ts
# pnpm create vite my-cat-prep-app --template react-ts

cd my-cat-prep-app
```

### Step 2: Copy Project Files

1.  Delete all files inside the `src` directory of your new Vite project.
2.  Copy all the folders and `.tsx` files from this project (`App.tsx`, `index.tsx`, `types.ts`, `components/`, `services/`) into the new `src` directory.
3.  Replace the `index.html` file in the root of your Vite project with the `index.html` from this project. You will need to make one small change to it:
    *   Remove the entire `<script type="importmap">...</script>` block.
    *   Remove the `<script>` block containing `tailwind.config`.
    *   Add `<script type="module" src="/src/index.tsx"></script>` inside the `<body>` tag, right after `<div id="root"></div>`.

### Step 3: Install Dependencies & Setup Tailwind CSS

Your new project needs the dependencies and Tailwind CSS configuration.

```bash
# Install main dependency for Gemini API
npm install @google/genai

# Install and configure Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Now, open the newly created `tailwind.config.js` and replace its content with this:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
}
```

Finally, create a file named `src/index.css` and add the Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

And import it at the top of `src/index.tsx`: `import './index.css';`

### Step 4: Update API Key Handling

Vite handles environment variables differently and more securely.

1.  Create a file named `.env` in the root of your Vite project. **This file should not be committed to Git.** Your `my-cat-prep-app/.gitignore` file should already contain `.env`.
2.  Add your Gemini API key to the `.env` file, prefixed with `VITE_`:
    ```
    VITE_GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
3.  Update `src/services/geminiService.ts`. Find this line:
    ```ts
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    ```
    And change it to this, which correctly and safely reads the variable in a Vite project:
    ```ts
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      // This will provide a clear error in the browser console if the key is missing.
      throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables.");
    }
    const ai = new GoogleGenAI({ apiKey });
    ```

### Step 5: Run and Deploy

1.  **Run Locally**: Start the development server to make sure everything works:
    ```bash
    npm run dev
    ```
2.  **Deploy**:
    *   Create a new repository on GitHub and push your Vite project code.
    *   Sign up for a free account on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
    *   Create a new project/site and connect it to your GitHub repository.
    *   The build settings should be automatically detected (Build Command: `npm run build`, Output Directory: `dist`).
    *   In the project settings on Vercel/Netlify, go to "Environment Variables" and add `VITE_GEMINI_API_KEY` with your key as the value.
    *   Deploy your site!

Your application is now live, fully functional, and your API key is kept secure on the hosting provider's servers.