import "dotenv/config"
import express from "express"
import userRouter from './routes/userRoutes';
import connectDb from './utils/db';
import contentRouter from './routes/contentRoutes';
import cors from "cors";
import healthRouter from './routes/healthRoutes';
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      '*',
      'http://localhost:3000',
      'http://localhost:3001',
      `https://recalll.vercel.app`,
    ], // Allow requests from this origin
    credentials: true, // Allow cookies and credentials
  })
)

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/health", healthRouter);


connectDb(app);
