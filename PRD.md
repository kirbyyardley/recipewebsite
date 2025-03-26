## Project Overview
This is a mobile-first web application for AI-aggregated recipes, focused on optimizing the cooking experience. The platform emphasizes accessibility during active cooking sessions and SEO-friendly content.

## Tech Stack and Documentation
- Next.JS @https://nextjs.org/docs
- Shadcn @https://ui.shadcn.com/docs/installation
- Font Awesome Icons @https://docs.fontawesome.com/
- Tailwind CSS @https://tailwindcss.com/docs/installation/using-vite
- Silk @https://silkhq.notion.site/Silk-Components-fad7232e08a24cf6bf9008749cc09879
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
- A video for each recipe (LLM optimized)