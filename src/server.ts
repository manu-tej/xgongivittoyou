import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { TwitterClient } from './twitter-client';
import { ThreadManager } from './thread-manager';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.post('/api/preview', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const client = new TwitterClient();
    const threadManager = new ThreadManager(client.getCharLimit());
    const tweets = threadManager.splitIntoTweets(text);

    res.json({
      success: true,
      tweets,
      count: tweets.length,
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to preview thread',
    });
  }
});

app.post('/api/post', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const client = new TwitterClient();
    const threadManager = new ThreadManager(client.getCharLimit());

    // Verify credentials
    const verified = await client.verifyCredentials();
    if (!verified) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Split and post
    const tweets = threadManager.splitIntoTweets(text);
    const tweetIds = await client.postThread(tweets);

    res.json({
      success: true,
      tweetIds,
      count: tweetIds.length,
      url: `https://twitter.com/i/web/status/${tweetIds[0]}`,
    });
  } catch (error) {
    console.error('Post error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to post thread',
    });
  }
});

app.post('/api/verify', async (req: Request, res: Response) => {
  try {
    const client = new TwitterClient();
    const verified = await client.verifyCredentials();

    res.json({
      success: verified,
      message: verified ? 'Credentials verified' : 'Authentication failed',
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to verify credentials',
    });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Open on your iPhone to install as PWA`);
});
