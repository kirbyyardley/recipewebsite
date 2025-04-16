<<<<<<< HEAD

=======
>>>>>>> ac5e259d7df35b9dc5a1dc7cd1261907c9201441
## Project Overview
This is a mobile-first web application for AI-aggregated recipes, focused on optimizing the cooking experience. The platform emphasizes accessibility during active cooking sessions and SEO-friendly content.

## Tech Stack and Documentation
- Next.JS @https://nextjs.org/docs
- Font Awesome Icons @https://docs.fontawesome.com/
- Tailwind CSS @https://tailwindcss.com/docs/installation/using-vite
- Silk @https://github.com/silk-hq/
- Supabase (includes MCP Server) @https://supabase.com/docs

## Performance Metrics
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 2s
- Core Web Vitals compliance required
- Mobile-first responsive design (320px to 1440px)
- PWA capabilities for offline access

## SEO Requirements
- Server-side rendering for recipe pages
- Structured data (Recipe Schema.org)
- Dynamic meta tags and OpenGraph data
- XML sitemap generation
- Robots.txt configuration

## Features
- Account creation
- Bookmark/save recipes
- Recipe generator - Users enter what they want to eat, almost as a search input, and we build a recipe specifically for them. 
- Recipe directory - a list of recipes that are SEO optimized on the website
- Cook mode - the easiest, no nonesense cooking experience ever designed for web

## Cook Mode Functionality

- When a recipe page is open, a "Start cooking" floating action button will be displayed, which opens Cook Mode. 
- When cook mode is opened by clicking "Start cooking" the UI will utilize a Persistent Sheet from Silk to open. The Persistent sheet will open and be expanded to show the entire Cook Mode experience.
- Cook Mode can be minimized, meaning the persisntent sheet will remain visible at the bottom of the app in case users want to navigate elsewhere in the site/app. 