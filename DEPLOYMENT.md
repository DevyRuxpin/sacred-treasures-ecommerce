# Sacred Treasures - Deployment Guide

## 🚀 **Quick Deployment Options**

### **Option 1: Vercel (Recommended - 5 minutes)**

1. **Connect to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy from project directory
   vercel
   ```

2. **Configure Environment Variables**
   ```env
   DATABASE_URL="your-production-database-url"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### **Option 2: Docker Deployment**

1. **Build Docker Image**
   ```bash
   docker build -t sacred-treasures .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-database-url" \
     -e NEXTAUTH_SECRET="your-secret" \
     sacred-treasures
   ```

### **Option 3: Traditional Hosting**

1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

---

## 🗄️ **Database Setup**

### **SQLite (Development)**
```bash
# Already configured - no setup needed
npx prisma db push
npm run db:seed
```

### **PostgreSQL (Production)**
```bash
# Update .env
DATABASE_URL="postgresql://username:password@localhost:5432/sacred_treasures"

# Run migrations
npx prisma migrate deploy

# Seed database
npm run db:seed
```

### **Database Providers**
- **Supabase** (Recommended): Free tier available
- **Railway**: Simple PostgreSQL hosting
- **PlanetScale**: MySQL-compatible
- **Neon**: Serverless PostgreSQL

---

## 🔧 **Environment Configuration**

### **Required Environment Variables**
```env
# Database
DATABASE_URL="your-database-connection-string"

# Authentication
NEXTAUTH_SECRET="your-secret-key-min-32-characters"
NEXTAUTH_URL="https://your-domain.com"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe Payments
STRIPE_SECRET_KEY="sk_live_your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

### **Optional Environment Variables**
```env
# Email (if using Resend)
RESEND_API_KEY="your-resend-api-key"

# Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"

# CDN (if using Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
```

---

## 🏗️ **Build Process**

### **Local Build**
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Start production server
npm start
```

### **Docker Build**
```bash
# Build image
docker build -t sacred-treasures .

# Run container
docker run -p 3000:3000 sacred-treasures
```

---

## 📊 **Production Checklist**

### **Before Deployment**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Stripe webhooks configured
- [ ] Google OAuth configured
- [ ] Domain name configured
- [ ] SSL certificate installed

### **After Deployment**
- [ ] Test all functionality
- [ ] Verify payments work
- [ ] Check admin panel access
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Check analytics tracking

---

## 🔍 **Monitoring & Maintenance**

### **Health Checks**
```bash
# Check application health
curl https://your-domain.com/api/health

# Check database connection
curl https://your-domain.com/api/test
```

### **Logs & Monitoring**
- **Vercel**: Built-in logging and monitoring
- **Docker**: `docker logs container-name`
- **Traditional**: Application logs in `/var/log`

### **Performance Monitoring**
- **Google Analytics**: User behavior tracking
- **Vercel Analytics**: Performance metrics
- **Stripe Dashboard**: Payment monitoring

---

## 🛡️ **Security Considerations**

### **Production Security**
- [ ] Use HTTPS (SSL/TLS)
- [ ] Secure environment variables
- [ ] Enable CORS properly
- [ ] Set security headers
- [ ] Regular dependency updates
- [ ] Database backups

### **Security Headers**
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

---

## 📈 **Scaling Considerations**

### **Database Scaling**
- **SQLite**: Good for small-medium traffic
- **PostgreSQL**: Recommended for production
- **Connection Pooling**: Use PgBouncer for high traffic

### **Application Scaling**
- **Vercel**: Automatic scaling
- **Docker**: Use orchestration (Kubernetes, Docker Swarm)
- **Load Balancing**: Use nginx or cloud load balancers

### **CDN & Assets**
- **Vercel**: Built-in CDN
- **Cloudinary**: Image optimization and CDN
- **AWS CloudFront**: Global CDN

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Database Connection Errors**
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
npx prisma db push
```

#### **Build Failures**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

#### **Environment Variable Issues**
```bash
# Check variables
vercel env ls

# Update variables
vercel env add VARIABLE_NAME
```

### **Support Resources**
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Stripe Docs**: https://stripe.com/docs

---

## 📞 **Post-Deployment Support**

### **Monitoring Setup**
1. **Google Analytics**: Track user behavior
2. **Stripe Dashboard**: Monitor payments
3. **Vercel Analytics**: Performance metrics
4. **Error Tracking**: Set up Sentry or similar

### **Maintenance Tasks**
- **Weekly**: Check error logs and performance
- **Monthly**: Update dependencies
- **Quarterly**: Security audit and backup verification

---

## 🎉 **Deployment Complete!**

Once deployed, your Sacred Treasures e-commerce platform will be live and ready to serve customers worldwide with authentic religious artifacts.

**Live URL**: https://your-domain.com  
**Admin Panel**: https://your-domain.com/admin  
**API Health**: https://your-domain.com/api/health

**Congratulations on launching your religious e-commerce platform! 🙏✨**
