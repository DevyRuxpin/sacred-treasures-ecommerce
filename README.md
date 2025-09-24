# 🏆 Sacred Treasures - Religious E-Commerce Platform

A full-stack e-commerce platform specializing in authentic religious artifacts and sacred items from Muslim, Hindu, Sikh, Christian, Buddhist, and Jewish traditions.

## 🖼️ Homepage Screenshot

![png (1)](https://github.com/user-attachments/assets/b46484bd-2020-44a3-b552-72cb3fba6359)

*Professional e-commerce design with clean layout, amber/gold theme, and comprehensive product showcase*

## 🚀 Live Demo

**Local Development:** http://localhost:3000  
**GitHub Repository:** https://github.com/DevyRuxpin/sacred-treasures-ecommerce

## ✨ Key Features

### 🛒 E-Commerce Functionality
- **Product Catalog** - Comprehensive religious artifacts from 6 faith traditions
- **Shopping Cart** - Full cart functionality with quantity management
- **Wishlist** - Save items for later with persistent storage
- **Product Reviews** - Star ratings and customer feedback system
- **Search & Filtering** - Advanced search with category filtering

### 🎨 Professional Design
- **Modern UI/UX** - Clean, professional e-commerce layout
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Amber/Gold Theme** - Consistent color scheme for religious artifacts
- **Interactive Elements** - Hover effects, transitions, and animations

### 🔧 Technical Stack
- **Frontend:** Next.js 15 with TypeScript
- **Styling:** Tailwind CSS v3.4.0
- **State Management:** Zustand for cart and wishlist
- **Database:** Prisma ORM with SQLite
- **Authentication:** NextAuth.js
- **Payments:** Stripe integration ready
- **Testing:** Jest with React Testing Library

### 📱 Pages & Components
- **Homepage** - Hero section, featured products, category grid
- **Product Pages** - Detailed product views with reviews
- **Category Pages** - Filtered product listings by religious tradition
- **Cart & Checkout** - Complete shopping flow
- **Blog System** - Content management for spiritual content
- **Support System** - FAQ, live chat, and ticket system

### 🏗️ Architecture
- **Server Components** - Optimized for performance
- **Client Components** - Interactive features with React hooks
- **API Routes** - RESTful endpoints for all functionality
- **Database Schema** - Comprehensive data modeling
- **SEO Optimized** - Meta tags, structured data, sitemaps

## 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/DevyRuxpin/sacred-treasures-ecommerce.git
cd sacred-treasures-ecommerce

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Set up database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
```

## 📊 Testing

```bash
# Run comprehensive test suite
npm run test:portfolio

# Run specific test categories
npm run test:api        # API endpoint tests
npm run test:components # Component tests
npm run test:workflow   # E-commerce workflow tests
```

## 🎯 Portfolio Highlights

This project demonstrates:
- **Full-Stack Development** - Complete e-commerce platform
- **Modern React Patterns** - Server/Client components, hooks, state management
- **Database Design** - Complex relationships and data modeling
- **UI/UX Design** - Professional e-commerce interface
- **Testing Strategy** - Comprehensive test coverage
- **Performance Optimization** - Lazy loading, caching, SEO
- **Error Handling** - Robust error boundaries and validation

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/         # Reusable React components
├── lib/               # Utility functions and configurations
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
└── __tests__/         # Test files
```

## 🔗 Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Prisma** - Database ORM and migrations
- **Zustand** - Lightweight state management
- **NextAuth.js** - Authentication system
- **Jest** - Testing framework
- **React Testing Library** - Component testing

## 📈 Performance Features

- **Lazy Loading** - Images and components loaded on demand
- **Caching** - Server-side and client-side caching strategies
- **SEO Optimization** - Meta tags, structured data, sitemaps
- **Bundle Optimization** - Code splitting and tree shaking
- **Image Optimization** - Next.js Image component with optimization

## 🌟 Religious Traditions Supported

- **Islamic** - Prayer beads, rugs, blessed artifacts
- **Hindu** - Mala beads, idols, sacred items
- **Christian** - Crosses, rosaries, prayer items
- **Buddhist** - Meditation bowls, Buddha statues
- **Sikh** - Kirpans, karas, Sikh artifacts
- **Judaic** - Mezuzahs, tallits, Jewish items

## 📝 License

This project is created for portfolio demonstration purposes.

---

**Built with devotion for the faithful community** 🙏
