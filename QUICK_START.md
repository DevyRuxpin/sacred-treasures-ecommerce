# Sacred Treasures - Quick Start Guide

## 🚀 **Get Started in 5 Minutes**

### **Prerequisites**
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### **1. Clone & Install**
```bash
git clone <repository-url>
cd religious-ecommerce
npm install
```

### **2. Start Development Server**
```bash
npm run dev
```

### **3. Open Application**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗄️ **Database Setup (Automatic)**

The application uses SQLite by default - no additional setup required!

```bash
# Database is automatically created and seeded
npm run db:seed
```

**What's included:**
- 23 authentic religious products
- 6 main categories with subcategories
- Admin user: `admin@sacredtreasures.com` / `admin123`
- Test customer: `customer@test.com` / `customer123`

---

## 🎯 **Key Features to Explore**

### **Shopping Experience**
- Browse products by category (Islamic, Hindu, Sikh, Christian, Buddhist, Judaic)
- Use advanced search with filters
- Add items to cart
- Proceed through checkout (Stripe integration)

### **Admin Features**
- Login to admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
- Manage products and categories
- View orders and customers
- Handle supplier relationships

### **Developer Features**
- TypeScript with strict configuration
- Clean, maintainable codebase
- Comprehensive API routes
- Real-time search and filtering

---

## 🛠️ **Development Commands**

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:seed      # Seed with sample data
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

---

## 📁 **Project Structure Overview**

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── products/          # Product pages
│   └── cart/              # Shopping cart
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── layout/            # Layout components
│   └── search/            # Search components
├── lib/                   # Utility functions
├── store/                 # State management (Zustand)
└── types/                 # TypeScript definitions
```

---

## 🎨 **Design System**

### **Colors**
- **Primary**: Gold/Saffron (#F59E0B)
- **Secondary**: Earth Brown (#D97706)
- **Accent**: Deep Green (#059669)
- **Muted**: Soft Cream (#FEF3C7)

### **Components**
- **Cards**: Soft shadows with hover effects
- **Buttons**: Gradient backgrounds
- **Forms**: Clean inputs with focus states
- **Icons**: Lucide React with hydration-safe wrapper

---

## 🔧 **Customization Guide**

### **Adding New Products**
1. Edit `prisma/seed.ts`
2. Add product to the products array
3. Run `npm run db:seed`

### **Modifying Categories**
1. Update categories in `prisma/seed.ts`
2. Run database migration
3. Update UI components if needed

### **Styling Changes**
1. Modify `tailwind.config.js` for theme changes
2. Update component styles in `src/components/`
3. Use Tailwind utility classes for quick styling

---

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**
- Unit tests for components
- Integration tests for API routes
- End-to-end tests for user flows

---

## 📊 **Database Schema**

### **Main Models**
- **Product**: Items with categories, pricing, inventory
- **Category**: Hierarchical categories with subcategories
- **User**: Admin and customer accounts
- **Order**: Customer orders with items
- **Supplier**: Dropshipping partners
- **Review**: Customer reviews and ratings

### **Key Relationships**
- Products belong to Categories
- Orders contain multiple OrderItems
- Users can have multiple Orders
- Products can have multiple Reviews

---

## 🚀 **Production Deployment**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **Environment Variables Needed**
```env
DATABASE_URL="your-database-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

---

## 🎯 **Next Steps**

### **Immediate Improvements**
1. **Add Image Optimization**: Use Next.js Image component
2. **Implement Wishlist**: Add heart icons and localStorage
3. **Add Social Proof**: Display review counts prominently
4. **Email Marketing**: Add newsletter signup

### **Advanced Features**
1. **Content Marketing**: Add blog section
2. **A/B Testing**: Test different layouts
3. **Analytics**: Google Analytics integration
4. **Performance**: Optimize loading speeds

---

## 📚 **Learning Resources**

### **Technologies Used**
- **Next.js**: https://nextjs.org/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Prisma**: https://www.prisma.io/docs
- **Stripe**: https://stripe.com/docs

### **Best Practices**
- **React**: https://react.dev/learn
- **Next.js**: https://nextjs.org/learn
- **TypeScript**: https://typescript-eslint.io/getting-started

---

## 🆘 **Getting Help**

### **Common Issues**
1. **Port already in use**: Kill process or use different port
2. **Database connection**: Check DATABASE_URL in .env
3. **Build errors**: Clear .next folder and reinstall dependencies

### **Support Resources**
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check README.md and PROJECT_STATUS.md
- **Community**: Join Next.js Discord or TypeScript community

---

## 🎉 **You're Ready!**

The Sacred Treasures e-commerce platform is now running locally. Explore the features, customize the design, and prepare for deployment to serve the global religious community with authentic artifacts.

**Happy coding! 🙏✨**

---

*Built with ❤️ for the global religious community*
