// src/server.js
// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const { errorHandler } = require('./middlewares/errorHandlerMiddleware');
const languageRoutes = require('./routes/languageRoutes');

const app = express();

// SECURITY & MIDDLEWARE
app.use(helmet());

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL, "https://talent-hub-ui.vercel.app/api/v1",
      "http://localhost:5173"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
// DYNAMIC ROUTES
const routesDir = path.join(__dirname, 'routes');
fs.readdirSync(routesDir).forEach((file) => {
  if (file.endsWith('Routes.js')) {
    const route = require(`./routes/${file}`);
    const baseName = file.replace("Routes.js", "").toLowerCase();
    app.use(`/api/v1/${baseName}`, route);
    console.log(`Mounted: /api/v1/${baseName}`);
  }
});
let isConnected = false;
async function connectDB() {
  if (isConnected) return;

  const mongoURI =
    process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("❌ Mongo URI missing");
    return;
  }

  await mongoose.connect(mongoURI);
  isConnected = true;

  console.log("✅ MongoDB connected");
}
connectDB().catch(err => console.log(err));
// ROUTES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/languages', languageRoutes);
app.get('/', async (req, res) => {
  try {
    //const opportunities = await Opportunity.find({}).limit(5);
    res.json({ 
      api:"Zavala LMT",
      motDuJour: "Just learn to code every day",
      last:"Welcome to talent hub api",
      status:"WORKING AS EXPECTED 😂😂😂😂 !!"

     });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    message: 'TalentHub backend is running!',
  });
});
app.use(errorHandler);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

if (process.env.vercel) {
  console.log("Running on Vercel → exporting app (no listen)");
  module.exports = app;
} else {
  // Local development: Start normal server
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });

  module.exports = app;
}
