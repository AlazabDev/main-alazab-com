# Alazab Shop Frontend

React + TypeScript + Vite frontend for Alazab Shop Property Management System.

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Building for Frappe

The frontend is automatically built and deployed to Frappe when using:

```bash
cd ..
./build_for_frappe.sh
```

This will:
1. Install frontend dependencies
2. Build the React app
3. Copy built files to `alazab_shop/public/dist/`
4. Make them available via Frappe's asset system

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── integrations/   # External integrations (Supabase)
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── dist/               # Build output (generated)
```

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- React Router
- Supabase
- TanStack Query
