#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const ImageZen = require('./index');

const program = new Command();

// Setup CLI
program
  .name('image-zen')
  .description('Local-first image optimizer with AI-powered processing')
  .version(require('../package.json').version);

// Background removal command
program
  .command('remove-bg <input>')
  .description('Remove background from image(s)')
  .option('-o, --output <path>', 'Output path or directory')
  .option('-f, --format <format>', 'Output format (png, webp)', 'png')
  .action(async (input, options) => {
    const spinner = ora('Removing background...').start();
    
    try {
      const zen = new ImageZen({ verbose: true });
      const files = await getInputFiles(input);
      
      for (const file of files) {
        const outputPath = getOutputPath(file, options.output, options.format);
        const result = await zen.removeBackground(file);
        await fs.writeFile(outputPath, result);
        spinner.text = `Processed: ${path.basename(file)} → ${path.basename(outputPath)}`;
      }
      
      spinner.succeed(chalk.green(`✅ Processed ${files.length} image(s)`));
    } catch (error) {
      spinner.fail(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Upscale command
program
  .command('upscale <input>')
  .description('Upscale image(s) using AI super-resolution')
  .option('-s, --scale <number>', 'Scale factor (2, 4)', '2')
  .option('-o, --output <path>', 'Output path or directory')
  .option('-f, --format <format>', 'Output format (jpg, png, webp)', 'png')
  .action(async (input, options) => {
    const spinner = ora('Upscaling image...').start();
    
    try {
      const zen = new ImageZen({ verbose: true });
      const files = await getInputFiles(input);
      const scale = parseInt(options.scale);
      
      for (const file of files) {
        const outputPath = getOutputPath(file, options.output, options.format, `_${scale}x`);
        const result = await zen.upscale(file, scale);
        await fs.writeFile(outputPath, result);
        spinner.text = `Processed: ${path.basename(file)} → ${path.basename(outputPath)}`;
      }
      
      spinner.succeed(chalk.green(`✅ Upscaled ${files.length} image(s) by ${scale}x`));
    } catch (error) {
      spinner.fail(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Compress command
program
  .command('compress <input>')
  .description('Compress image(s) with smart optimization')
  .option('-q, --quality <number>', 'Compression quality (1-100)', '80')
  .option('-f, --format <format>', 'Output format (jpg, png, webp)', 'webp')
  .option('-o, --output <path>', 'Output path or directory')
  .action(async (input, options) => {
    const spinner = ora('Compressing image...').start();
    
    try {
      const zen = new ImageZen({ verbose: true });
      const files = await getInputFiles(input);
      const quality = parseInt(options.quality);
      
      for (const file of files) {
        const outputPath = getOutputPath(file, options.output, options.format, '_compressed');
        const result = await zen.compress(file, { quality, format: options.format });
        await fs.writeFile(outputPath, result);
        spinner.text = `Processed: ${path.basename(file)} → ${path.basename(outputPath)}`;
      }
      
      spinner.succeed(chalk.green(`✅ Compressed ${files.length} image(s) at ${quality}% quality`));
    } catch (error) {
      spinner.fail(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Enhanced processing command
program
  .command('enhance <input>')
  .description('Apply multiple AI enhancements to image(s)')
  .option('-t, --tasks <tasks>', 'Comma-separated tasks: remove-bg,upscale,compress', 'compress')
  .option('-s, --scale <number>', 'Scale factor for upscaling', '2')
  .option('-q, --quality <number>', 'Compression quality', '80')
  .option('-f, --format <format>', 'Output format', 'webp')
  .option('-o, --output <path>', 'Output path or directory')
  .action(async (input, options) => {
    const spinner = ora('Enhancing image...').start();
    
    try {
      const zen = new ImageZen({ verbose: true });
      const files = await getInputFiles(input);
      const tasks = options.tasks.split(',').map(t => t.trim());
      
      for (const file of files) {
        const outputPath = getOutputPath(file, options.output, options.format, '_enhanced');
        const result = await zen.enhance(file, {
          tasks,
          scale: parseInt(options.scale),
          compression: { quality: parseInt(options.quality), format: options.format }
        });
        await fs.writeFile(outputPath, result);
        spinner.text = `Processed: ${path.basename(file)} → ${path.basename(outputPath)}`;
      }
      
      spinner.succeed(chalk.green(`✅ Enhanced ${files.length} image(s) with tasks: ${tasks.join(', ')}`));
    } catch (error) {
      spinner.fail(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Info command
program
  .command('info')
  .description('Show package information and supported formats')
  .action(() => {
    const info = ImageZen.getInfo();
    console.log(chalk.cyan.bold(`\n${info.name} v${info.version}`));
    console.log(chalk.gray('Local-first image optimizer with AI-powered processing\n'));
    
    console.log(chalk.yellow('Features:'));
    info.features.forEach(feature => {
      console.log(chalk.gray(`  • ${feature}`));
    });
    
    console.log(chalk.yellow('\nSupported Formats:'));
    console.log(chalk.gray(`  Input: ${info.supportedFormats.input.join(', ')}`));
    console.log(chalk.gray(`  Output: ${info.supportedFormats.output.join(', ')}`));
    
    console.log(chalk.yellow('\nExample Usage:'));
    console.log(chalk.gray('  image-zen compress ./images --format=webp'));
    console.log(chalk.gray('  image-zen remove-bg photo.jpg -o clean.png'));
    console.log(chalk.gray('  image-zen enhance *.jpg -t remove-bg,upscale,compress\n'));
  });

// Helper functions
async function getInputFiles(input) {
  if (input.includes('*')) {
    return glob.sync(input);
  }
  
  const stat = await fs.stat(input);
  if (stat.isDirectory()) {
    return glob.sync(path.join(input, '*.{jpg,jpeg,png,webp}'));
  }
  
  return [input];
}

function getOutputPath(inputPath, outputOption, format, suffix = '') {
  const ext = `.${format}`;
  const basename = path.basename(inputPath, path.extname(inputPath));
  
  if (outputOption) {
    if (path.extname(outputOption)) {
      return outputOption; // Full path provided
    } else {
      return path.join(outputOption, `${basename}${suffix}${ext}`); // Directory provided
    }
  } else {
    const dir = path.dirname(inputPath);
    return path.join(dir, `${basename}${suffix}${ext}`);
  }
}

// Parse command line arguments
program.parse();