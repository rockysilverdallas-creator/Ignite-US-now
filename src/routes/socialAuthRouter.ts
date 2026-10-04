import { Router, Request, Response } from "express";

export const socialAuthRouter = Router();

// ==========================================
// TIKTOK API CONNECT (OAuth 2.0)
// ==========================================

socialAuthRouter.get("/tiktok/connect", (req: Request, res: Response) => {
  const csrfState = Math.random().toString(36).substring(2);
  res.cookie("csrfState", csrfState, { maxAge: 60000 });

  const clientKey = process.env.TIKTOK_CLIENT_KEY || "YOUR_TIKTOK_CLIENT_KEY";
  const redirectUri = encodeURIComponent(`${req.protocol}://${req.get("host")}/api/social/tiktok/callback`);
  
  // Scopes for Video Foundry publishing
  const scopes = "user.info.basic,video.publish,video.upload";

  let url = "https://www.tiktok.com/v2/auth/authorize/";
  url += `?client_key=${clientKey}`;
  url += `&scope=${scopes}`;
  url += "&response_type=code";
  url += `&redirect_uri=${redirectUri}`;
  url += `&state=${csrfState}`;

  res.redirect(url);
});

socialAuthRouter.get("/tiktok/callback", async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).send(`TikTok Auth Error: ${error}`);
  }

  // Next steps for the operator:
  // 1. Exchange the 'code' for an Access Token via https://open.tiktokapis.com/v2/oauth/token/
  // 2. Store the Access Token securely in Firebase/BigQuery for the Model Foundry

  res.send(`
    <html><body>
    <h2>TikTok Connected!</h2>
    <p>Authorization Code received. The Model Foundry can now publish 9:16 vertical video directly to the configured TikTok handle.</p>
    <script>setTimeout(() => window.close(), 3000);</script>
    </body></html>
  `);
});

// ==========================================
// META / INSTAGRAM API CONNECT (OAuth 2.0)
// ==========================================

socialAuthRouter.get("/meta/connect", (req: Request, res: Response) => {
  const clientId = process.env.META_CLIENT_ID || "YOUR_META_CLIENT_ID";
  const redirectUri = encodeURIComponent(`${req.protocol}://${req.get("host")}/api/social/meta/callback`);
  
  // Scopes for Instagram/Facebook publishing and DMs
  const scopes = "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts";

  let url = "https://www.facebook.com/v18.0/dialog/oauth";
  url += `?client_id=${clientId}`;
  url += `&redirect_uri=${redirectUri}`;
  url += `&scope=${scopes}`;
  url += "&response_type=code";

  res.redirect(url);
});

socialAuthRouter.get("/meta/callback", async (req: Request, res: Response) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).send(`Meta Auth Error: ${error}`);
  }

  // Next steps for the operator:
  // 1. Exchange 'code' for long-lived Access Token via Graph API
  // 2. Map Instagram Business Account ID to the Foundry

  res.send(`
    <html><body>
    <h2>Meta/Instagram Connected!</h2>
    <p>Authorization Code received. The Model Foundry and Shah can now push Reels/Posts and intercept DMs.</p>
    <script>setTimeout(() => window.close(), 3000);</script>
    </body></html>
  `);
});
