# Vercel Deployment Guide

## Quick Deploy

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd "/Users/darshanr/Documents/New project"
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No** (first time)
   - Project name? Press Enter or type a name
   - Directory? `.` (current directory)
   - Override settings? **No**

5. **Set Environment Variable**:
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```
   Paste your API key: `AIzaSyDRU-jcX4bLzUKRKTBlT5o5hvcfR2rUAcE`
   
   Select environments: **Production**, **Preview**, **Development**

6. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Go to** [vercel.com](https://vercel.com)

2. **Import Git Repository**:
   - Click "Add New" → "Project"
   - Import your GitHub/GitLab repository
   - Or use "Import Third-Party Git Repository"

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variable**:
   - Go to project settings → Environment Variables
   - Add: `VITE_GEMINI_API_KEY` = `AIzaSyDRU-jcX4bLzUKRKTBlT5o5hvcfR2rUAcE`
   - Make available for: Production, Preview, Development

5. **Deploy**: Click "Deploy"

## Post-Deployment

### Your app will be available at:
- Production: `https://your-project-name.vercel.app`
- You'll get automatic HTTPS, global CDN, and instant rollbacks

### Automatic Deployments
- **Production**: Every push to main/master branch
- **Preview**: Every pull request and branch push
- **Instant Rollbacks**: Click any previous deployment to rollback

### Custom Domain (Optional)
1. Go to project settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Automatic SSL certificate provisioning

## Environment Variables

Required environment variable:
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key

**⚠️ Security Note**: Never commit `.env.local` to Git. The `.gitignore` is already configured to exclude it.

## Build Information

- **Framework**: Vite 5.2 + React 18.2
- **Build Output**: Static files in `dist/` directory
- **Build Time**: ~30-60 seconds
- **Deploy Time**: ~10-20 seconds

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally: `npm run build`

### Environment Variables Not Working
- Ensure they're prefixed with `VITE_`
- Redeploy after adding env vars
- Check they're enabled for correct environment

### 404 Errors on Refresh
- Vercel.json already configured with SPA rewrites
- All routes redirect to index.html

## Monitoring

- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Deployments → View Logs
- **Performance**: Built-in Web Vitals tracking

## Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Remove deployment
vercel rm [deployment-name]
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
