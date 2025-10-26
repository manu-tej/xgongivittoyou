#!/usr/bin/env node

import { Command } from 'commander';
import { TwitterClient } from './twitter-client';
import { ThreadManager } from './thread-manager';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const program = new Command();

program
  .name('x-post')
  .description('Post long-form content to X/Twitter by automatically creating threads')
  .version('1.0.0');

program
  .command('post')
  .description('Post a long text as a Twitter thread')
  .option('-t, --text <text>', 'Text to post')
  .option('-f, --file <file>', 'Read text from a file')
  .option('-p, --preview', 'Preview the thread without posting')
  .action(async (options) => {
    try {
      let text: string;

      if (options.file) {
        const filePath = path.resolve(process.cwd(), options.file);
        if (!fs.existsSync(filePath)) {
          console.error(chalk.red(`Error: File not found: ${filePath}`));
          process.exit(1);
        }
        text = fs.readFileSync(filePath, 'utf-8');
      } else if (options.text) {
        text = options.text;
      } else {
        console.error(chalk.red('Error: Please provide text using -t or -f option'));
        console.log('\nExamples:');
        console.log('  x-post post -t "Your long text here"');
        console.log('  x-post post -f mypost.txt');
        process.exit(1);
      }

      const client = new TwitterClient();
      const threadManager = new ThreadManager(client.getCharLimit());

      // Preview mode
      if (options.preview) {
        threadManager.previewThread(text);
        return;
      }

      // Verify credentials first
      console.log(chalk.blue('Verifying credentials...'));
      const verified = await client.verifyCredentials();

      if (!verified) {
        console.error(chalk.red('Authentication failed. Please check your credentials.'));
        process.exit(1);
      }

      // Split text into tweets
      const tweets = threadManager.splitIntoTweets(text);

      console.log(chalk.blue(`\nPrepared ${tweets.length} tweet${tweets.length > 1 ? 's' : ''}`));

      // Preview before posting
      console.log(chalk.yellow('\nPreview:'));
      threadManager.previewThread(text);

      // Post the thread
      console.log(chalk.blue('\nPosting thread...'));
      const tweetIds = await client.postThread(tweets);

      console.log(chalk.green(`\n✓ Successfully posted ${tweetIds.length} tweet${tweetIds.length > 1 ? 's' : ''}!`));
      console.log(chalk.blue(`\nFirst tweet URL: https://twitter.com/i/web/status/${tweetIds[0]}`));

    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      } else {
        console.error(chalk.red('An unknown error occurred'));
      }
      process.exit(1);
    }
  });

program
  .command('verify')
  .description('Verify Twitter API credentials')
  .action(async () => {
    try {
      const client = new TwitterClient();
      await client.verifyCredentials();
      console.log(chalk.green('✓ Credentials verified successfully!'));
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      } else {
        console.error(chalk.red('An unknown error occurred'));
      }
      process.exit(1);
    }
  });

program
  .command('preview')
  .description('Preview how your text will be split into tweets')
  .option('-t, --text <text>', 'Text to preview')
  .option('-f, --file <file>', 'Read text from a file')
  .action(async (options) => {
    try {
      let text: string;

      if (options.file) {
        const filePath = path.resolve(process.cwd(), options.file);
        if (!fs.existsSync(filePath)) {
          console.error(chalk.red(`Error: File not found: ${filePath}`));
          process.exit(1);
        }
        text = fs.readFileSync(filePath, 'utf-8');
      } else if (options.text) {
        text = options.text;
      } else {
        console.error(chalk.red('Error: Please provide text using -t or -f option'));
        process.exit(1);
      }

      const client = new TwitterClient();
      const threadManager = new ThreadManager(client.getCharLimit());
      threadManager.previewThread(text);

    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red(`Error: ${error.message}`));
      } else {
        console.error(chalk.red('An unknown error occurred'));
      }
      process.exit(1);
    }
  });

program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
