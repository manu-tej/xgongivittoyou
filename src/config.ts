import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export interface TwitterConfig {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
  tweetCharLimit: number;
}

export function getConfig(): TwitterConfig {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;
  const tweetCharLimit = parseInt(process.env.TWEET_CHAR_LIMIT || '280', 10);

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error(
      'Missing required environment variables. Please check your .env file.\n' +
      'Required: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET'
    );
  }

  return {
    apiKey,
    apiSecret,
    accessToken,
    accessSecret,
    tweetCharLimit,
  };
}
