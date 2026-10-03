// Vercel serverless handler — imports the compiled Express app from esbuild output
import app from "../dist/server.cjs";

export default app;
