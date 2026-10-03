export default function handler(_req: any, res: any) {
  res.status(200).json({
    status: "HEALTHY",
    node: process.env.NEXT_PUBLIC_SITE_NODE || "KINGTAKER",
    service: "ignitus-shaer",
    region: "us-central1",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
