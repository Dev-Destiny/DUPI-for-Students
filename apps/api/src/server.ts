import express from "express";
import { env } from "./config/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth.routes.js";
import documentRouter from "./routes/document.routes.js";
import testRouter from "./routes/test.routes.js";
import flashcardRouter from "./routes/flashcard.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// Node.js worker disabled - background processing moved to /apps/processor (Python)
// import "./workers/document.worker";


// Environment handled by config/env.ts
// dotenv.config();

const app = express();

// Trust the first proxy (Railway load balancer)
app.set("trust proxy", 1);

// Security & Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
  })
);



app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.FRONTEND_URL.split(",").includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true, // keep this if you're using cookies/sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.options('/{*path}', cors())

// Health Check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV
  });
});


app.use(express.json());
app.use(cookieParser());



// Routes
app.use("/api/auth", authRouter);
app.use("/api/documents", documentRouter);
app.use("/api/tests", testRouter);
app.use("/api/flashcards", flashcardRouter);
app.use("/api/analytics", analyticsRouter);

// Error Handler
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, '::', () => {
  console.log(`🚀 Studify API is running on port ${PORT} [${env.NODE_ENV}]`);
});


