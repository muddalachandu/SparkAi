import fs from 'fs';
import path from 'path';

const src = '.vercel/output';
const dest = 'output';

console.log(`Checking build output...`);

if (fs.existsSync(src)) {
  console.log(`Copying build output from ${src} to ${dest}...`);
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.cpSync(src, dest, { recursive: true });
  console.log(`Successfully copied ${src} to ${dest}.`);
} else if (fs.existsSync(dest) && fs.existsSync(path.join(dest, 'config.json'))) {
  console.log(`Build output already exists in ${dest} (generated directly by Nitro). Skipping copy.`);
} else {
  console.error(`Error: Neither ${src} nor a valid ${dest} directory was found!`);
  process.exit(1);
}
