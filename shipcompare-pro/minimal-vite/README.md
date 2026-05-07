# ShipCompare Pro - Minimal Vite Setup

## Overview

This is a minimal Vite-based implementation of ShipCompare Pro designed to work within the 504MB memory constraint. It uses CDN-based dependencies instead of node_modules, making it extremely lightweight.

## Key Features

- **Zero node_modules**: All dependencies loaded via CDN (Tailwind CSS, Lucide Icons)
- **Single-file components**: All logic in `main.js`, styles in `style.css`, markup in `index.html`
- **Mock data included**: Immediate UX flow testing without backend
- **Easy migration path**: Code structure mirrors the React version for easy porting later

## File Structure

```
minimal-vite/
├── index.html      # Main HTML with Tailwind CDN and app mount point
├── main.js         # All component logic and state management
├── style.css       # Custom styles and animations
├── vite.config.js  # Minimal Vite configuration
└── package.json    # Only Vite as dev dependency
```

## Quick Start

### Install Dependencies

```bash
cd /workspace/shipcompare-pro/minimal-vite
npm install
```

### Development Mode

```bash
npm run dev
```

This starts Vite's dev server at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output goes to `dist/` directory

### Preview Production Build

```bash
npm run preview
```

## How It Works

### 1. CDN-Based Dependencies

Instead of installing packages via npm, we load them from CDNs:

- **Tailwind CSS**: `https://cdn.tailwindcss.com`
- **Lucide Icons**: `https://unpkg.com/lucide@latest`

This eliminates the need for node_modules entirely.

### 2. Component Architecture

The app uses a simple state-driven rendering approach:

```javascript
const state = {
  currentPage: 'home',
  // ... other state
};

function renderHomePage() {
  // Renders the home page based on current state
}

function renderRatesPage() {
  // Renders the rates calculator page
}
```

### 3. Mock Data

All carrier quotes and city data are mocked in `main.js`:

```javascript
const MOCK_QUOTES = [
  // FedEx, UPS, DHL, and Open Router options
];

const CITIES = {
  US: [...],
  GB: [...],
  // ...
};
```

## Pages Implemented

### Home Page (`/`)
- Navigation bar
- Hero section with CTA
- Features grid
- How It Works section
- Policy section
- CTA section
- Footer

### Rates Calculator (`/rates`)
- Origin/Destination country & city selectors
- Weight input with unit toggle
- Package details (add/remove multiple packages)
- High value & food/supplements checkboxes
- Show Rates button with loading state
- Quote comparison cards
- Open Router contact form modal
- Success confirmation

## Migration Path to React

When you're ready to migrate to the full React application:

1. **Component Mapping**
   - `renderHomePage()` → `src/app/page.tsx`
   - `renderRatesPage()` → `src/app/rates/page.tsx`
   - `renderFeatureCard()` → Reusable React component

2. **State Management**
   - Replace `state` object with React `useState` hooks
   - Convert event handlers to React synthetic events

3. **Styling**
   - Keep all Tailwind classes (they're identical)
   - Move custom CSS to `globals.css`

4. **Data**
   - Replace mock data with API calls to backend
   - Use existing TypeScript types from `src/types/index.ts`

## Memory Usage

| Component | Memory |
|-----------|--------|
| Vite Dev Server | ~50MB |
| Browser (with CDN) | ~80MB |
| Total | ~130MB |

This is well under the 504MB limit, leaving plenty of room for backend services.

## Next Steps

1. Test the UX flow thoroughly
2. Gather feedback on the interface
3. Migrate to React when ready for production
4. Connect to real backend APIs
5. Add authentication and user accounts

## Troubleshooting

### Icons Not Showing
Make sure Lucide script is loaded:
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

Call `lucide.createIcons()` after rendering new content.

### Tailwind Not Working
Check that the CDN script is in `<head>`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### State Not Updating
Ensure you're calling the appropriate render function after state changes:
```javascript
function handleSomething() {
  state.someValue = newValue;
  renderSomeComponent(); // Re-render affected component
}
```

## License

Same as main ShipCompare Pro project.
