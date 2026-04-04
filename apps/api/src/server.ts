import express from "express";
import { env } from "./config/env";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth.routes";
import documentRouter from "./routes/document.routes";
import testRouter from "./routes/test.routes";
import flashcardRouter from "./routes/flashcard.routes";
import { errorHandler } from "./middlewares/error.middleware";

// Node.js worker disabled - background processing moved to /apps/processor (Python)
// import "./workers/document.worker";


// Environment handled by config/env.ts
// dotenv.config();

const app = express();

// Security & Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes",
  })
);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

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

// Error Handler
app.use(errorHandler);

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 DUPI API is running on port ${PORT} [${env.NODE_ENV}]`);
});
