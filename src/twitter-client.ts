import { TwitterApi } from 'twitter-api-v2';
import { getConfig } from './config';

export class TwitterClient {
  private client: TwitterApi;
  private config;

  constructor() {
    this.config = getConfig();

    this.client = new TwitterApi({
      appKey: this.config.apiKey,
      appSecret: this.config.apiSecret,
      accessToken: this.config.accessToken,
      accessSecret: this.config.accessSecret,
    });
  }

  async verifyCredentials(): Promise<boolean> {
    try {
      const user = await this.client.v2.me();
      console.log(`Authenticated as: @${user.data.username}`);
      return true;
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  async postTweet(text: string): Promise<string> {
    const tweet = await this.client.v2.tweet(text);
    return tweet.data.id;
  }

  async postThread(tweets: string[]): Promise<string[]> {
    const tweetIds: string[] = [];
    let previousTweetId: string | undefined;

    for (let i = 0; i < tweets.length; i++) {
      const tweetText = tweets[i];

      try {
        const tweet = await this.client.v2.tweet({
          text: tweetText,
          reply: previousTweetId ? { in_reply_to_tweet_id: previousTweetId } : undefined,
        });

        tweetIds.push(tweet.data.id);
        previousTweetId = tweet.data.id;

        console.log(`Posted tweet ${i + 1}/${tweets.length}`);

        // Add a small delay between tweets to avoid rate limiting
        if (i < tweets.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Error posting tweet ${i + 1}:`, error);
        throw error;
      }
    }

    return tweetIds;
  }

  getCharLimit(): number {
    return this.config.tweetCharLimit;
  }
}
