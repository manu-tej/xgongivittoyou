export class ThreadManager {
  private charLimit: number;
  private threadIndicatorLength: number;

  constructor(charLimit: number = 280) {
    this.charLimit = charLimit;
    // Reserve space for thread indicators like "1/5", "2/5", etc.
    // Format: " (X/Y)" where X and Y can be up to 3 digits
    this.threadIndicatorLength = 8; // " (999/999)" = 10 chars, but let's be conservative
  }

  /**
   * Splits a long text into multiple tweets, preserving word boundaries
   */
  splitIntoTweets(text: string): string[] {
    // Clean up the input text
    const cleanText = text.trim();

    // If it fits in a single tweet, return as-is
    if (cleanText.length <= this.charLimit) {
      return [cleanText];
    }

    const tweets: string[] = [];
    const paragraphs = cleanText.split(/\n\n+/);
    let currentTweet = '';

    for (const paragraph of paragraphs) {
      const lines = paragraph.split('\n');

      for (const line of lines) {
        const words = line.split(' ');

        for (const word of words) {
          const testTweet = currentTweet ? `${currentTweet} ${word}` : word;
          const availableSpace = this.charLimit - this.threadIndicatorLength;

          if (testTweet.length <= availableSpace) {
            currentTweet = testTweet;
          } else {
            // Current tweet is full, save it and start a new one
            if (currentTweet) {
              tweets.push(currentTweet);
              currentTweet = word;
            } else {
              // Single word is too long, we need to split it
              tweets.push(word.substring(0, availableSpace));
              currentTweet = word.substring(availableSpace);
            }
          }
        }

        // Add line break if not the last line
        if (line !== lines[lines.length - 1]) {
          currentTweet += '\n';
        }
      }

      // Add paragraph break if not the last paragraph
      if (paragraph !== paragraphs[paragraphs.length - 1]) {
        currentTweet += '\n\n';
      }
    }

    // Add the last tweet if there's content
    if (currentTweet.trim()) {
      tweets.push(currentTweet.trim());
    }

    // Add thread indicators
    return this.addThreadIndicators(tweets);
  }

  /**
   * Adds thread indicators (1/N, 2/N, etc.) to tweets
   */
  private addThreadIndicators(tweets: string[]): string[] {
    if (tweets.length === 1) {
      return tweets;
    }

    const total = tweets.length;
    return tweets.map((tweet, index) => {
      const indicator = `(${index + 1}/${total})`;
      return `${tweet}\n\n${indicator}`;
    });
  }

  /**
   * Preview how the text will be split without posting
   */
  previewThread(text: string): void {
    const tweets = this.splitIntoTweets(text);

    console.log(`\nThread Preview (${tweets.length} tweet${tweets.length > 1 ? 's' : ''}):`);
    console.log('='.repeat(60));

    tweets.forEach((tweet, index) => {
      console.log(`\nTweet ${index + 1}/${tweets.length} (${tweet.length} chars):`);
      console.log('-'.repeat(60));
      console.log(tweet);
      console.log('-'.repeat(60));
    });
  }
}
