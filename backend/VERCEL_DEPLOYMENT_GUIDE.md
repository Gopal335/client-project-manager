# Client Project Manager - Vercel Deployment Guide

## Project Overview
This is a full-stack MERN (MongoDB, Express, React, Node.js) application with:
- **Frontend**: React app built with Vite
- **Backend**: Express.js API server
- **Database**: MongoDB Atlas

## Files Already Created/Modified for Deployment

1. ✅ **vercel.json** - Root configuration for Vercel deployment
2. ✅ **.env.example** - Template for environment variables
3. ✅ **VERCEL_DEPLOYMENT_GUIDE.md** - This guide

## Critical Code Changes Required

### 1. Backend: Modify server.js

The current `server.js` file needs modifications to work with Vercel's serverless functions. Replace the file with this updated version:

```javascript
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import projectRoutes from './src/routes/projectRoutes.js';
import clientRoutes from './src/routes/clientRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';
import subscriptionRoutes from './src/routes/subscriptionRoutes.js';

dotenv.config();

const app = express();
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27';

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Flipr API running' });
});

app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// For Vercel serverless
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // Local development
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
```

### 2. Backend: Update backend/package.json

Ensure your `backend/package.json` has these key settings:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build needed for Node.js'"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.2.1",
    "mongoose": "^9.0.1"
  }
}
```

### 3. Frontend: Update Frontend Environment Configuration

Create `frontend/.env.production` with:

```
VITE_API_BASE_URL=https://your-project-name.vercel.app
```

Update your API calls in frontend components to use:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Example API call
const response = await fetch(`${API_BASE_URL}/api/projects`);
```

### 4. Frontend: Update frontend/package.json

Ensure it has:

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

## Step-by-Step Deployment Instructions

### Step 1: Prepare GitHub Repository

1. Push all changes to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
4. Keep this string safe for Step 4

### Step 3: Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Vercel will detect the monorepo structure

### Step 4: Configure Environment Variables

In Vercel project settings, add:

- **MONGO_URI**: Your MongoDB Atlas connection string
- **PORT**: 3000
- **NODE_ENV**: production

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `https://your-project-name.vercel.app`

## Verification Checklist

- [ ] Repository pushed to GitHub
- [ ] MongoDB Atlas cluster created and connection string copied
- [ ] Project connected to Vercel
- [ ] Environment variables set in Vercel
- [ ] Deployment completed successfully
- [ ] API endpoint responding: `https://your-project-name.vercel.app/api/`
- [ ] Frontend loads at root URL
- [ ] API calls work from frontend

## Troubleshooting

### Build Fails
- Check `npm install --legacy-peer-deps` runs successfully
- Ensure all dependencies are in package.json
- Check for syntax errors in code

### API Not Responding
- Verify MONGO_URI in Vercel environment variables
- Check MongoDB Atlas IP whitelist includes Vercel
- Review Vercel function logs

### Frontend Shows 404
- Verify frontend build output in frontend/dist
- Check vercel.json routes configuration
- Ensure index.html exists in frontend/public

## Local Testing Before Deployment

```bash
# Install dependencies
cd backend && npm install --legacy-peer-deps
cd ../frontend && npm install --legacy-peer-deps

# Start backend
cd ../backend && npm start

# In another terminal, start frontend
cd frontend && npm run dev
```

## Important Notes

1. **Monorepo Structure**: This project uses a monorepo with separate frontend and backend folders
2. **Serverless Functions**: Backend runs as Vercel serverless functions on `/api/*` routes
3. **Static Hosting**: Frontend is served as static files
4. **CORS**: Already configured in Express app
5. **MongoDB Connection**: Ensure serverSelectionTimeoutMS is set for Vercel's environment

## Next Steps After Deployment

1. Test all API endpoints
2. Monitor Vercel function logs
3. Set up automatic GitHub deploys for future updates
4. Configure custom domain if needed
5. Enable auto-scaling if expecting high traffic

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React + Vite Guide](https://vitejs.dev/guide/ssr.html)
