import app from "./app";
import { env } from "./config/env";

let server: any;

if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  server = app.listen(env.PORT, () => {
    console.log(`🚀 Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
}

process.on("unhandledRejection", (err: any) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully...");
  if (server) {
    server.close(() => {
      console.log("💥 Process terminated!");
    });
  }
});

export default app;
