# X Long Post - Twitter Thread Creator

A Node.js CLI application that allows you to post long-form content to X/Twitter by automatically splitting your text into threaded tweets.

## Features

- Post long text that automatically splits into Twitter threads
- Smart text splitting that preserves word boundaries and paragraphs
- Preview threads before posting
- Support for both standard (280 chars) and Twitter Blue long tweets (4000 chars)
- Thread numbering (e.g., "1/5", "2/5")
- CLI interface for easy use

## Prerequisites

- Node.js 18+ and npm
- X/Twitter Developer Account with API access
- API credentials (API Key, API Secret, Access Token, Access Secret)

## Getting Your X/Twitter API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app (or use an existing one)
3. Navigate to your app's "Keys and Tokens" section
4. Generate/copy the following:
   - API Key (Consumer Key)
   - API Secret (Consumer Secret)
   - Access Token
   - Access Token Secret

Note: Make sure your app has **Read and Write** permissions to post tweets.

## Installation

1. Clone this repository:
```bash
git clone https://github.com/manu-tej/xgongivittoyou.git
cd xgongivittoyou
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Twitter API credentials:
```env
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
TWEET_CHAR_LIMIT=280
```

5. Build the project:
```bash
npm run build
```

## Usage

### Verify Credentials

Test your API credentials:
```bash
npm start verify
```

### Post a Tweet Thread

Post text directly:
```bash
npm start post -t "Your very long text goes here. It will be automatically split into a thread..."
```

Post from a file:
```bash
npm start post -f mypost.txt
```

### Preview Without Posting

Preview how your text will be split:
```bash
npm start preview -t "Your long text here..."
```

Or preview from a file:
```bash
npm start preview -f mypost.txt
```

## Examples

### Example 1: Post from command line
```bash
npm start post -t "This is a long post about Node.js. It contains multiple sentences and will be automatically split into a thread. Each tweet will be numbered and posted in sequence, creating a cohesive thread on Twitter."
```

### Example 2: Post from a file

Create a file `my-thoughts.txt`:
```
Today I want to share my thoughts on modern web development.

The ecosystem has evolved tremendously over the past few years. We now have amazing tools and frameworks that make development faster and more enjoyable.

However, with great power comes great complexity. It's important to choose the right tools for your specific use case.

What are your thoughts?
```

Then post it:
```bash
npm start post -f my-thoughts.txt
```

### Example 3: Preview before posting
```bash
npm start preview -f my-thoughts.txt
```

This shows you exactly how your text will be split before you commit to posting.

## How It Works

1. **Text Splitting**: The app intelligently splits your long text into chunks that fit within Twitter's character limit (280 or 4000 chars)
2. **Word Boundaries**: Text is split at word boundaries, never in the middle of a word
3. **Paragraph Preservation**: Double line breaks (paragraphs) are preserved when possible
4. **Thread Indicators**: Each tweet gets a number indicator (e.g., "1/5", "2/5") at the end
5. **Threading**: Tweets are posted in sequence, with each tweet replying to the previous one

## Configuration

Edit `.env` to customize:

- `TWEET_CHAR_LIMIT`: Set to `280` for standard tweets or `4000` if you have Twitter Blue/Premium

## Project Structure

```
.
├── src/
│   ├── cli.ts              # CLI interface
│   ├── config.ts           # Configuration loader
│   ├── twitter-client.ts   # Twitter API client
│   └── thread-manager.ts   # Text splitting logic
├── dist/                   # Compiled JavaScript (generated)
├── .env                    # Your credentials (not in git)
├── .env.example            # Template for credentials
├── package.json
└── tsconfig.json
```

## Development

Run in development mode:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

## Troubleshooting

### "Missing required environment variables"
- Make sure you've created a `.env` file with all required credentials
- Check that your `.env` file is in the project root directory

### "Authentication failed"
- Verify your API credentials are correct
- Ensure your Twitter app has Read and Write permissions
- Try regenerating your Access Token and Access Secret

### Rate Limiting
- Twitter has rate limits on posting tweets
- The app includes a 1-second delay between tweets in a thread
- If you hit rate limits, wait a few minutes before trying again

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Manu Tej Sharma

## Acknowledgments

- Built with [twitter-api-v2](https://github.com/PLhery/node-twitter-api-v2)
- CLI powered by [Commander.js](https://github.com/tj/commander.js)
