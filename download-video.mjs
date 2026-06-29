import puppeteer from 'puppeteer';
import fs from 'fs';
import https from 'https';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Go to a known public domain video repository
  await page.goto('https://coverr.co/video/a-beautiful-aerial-view-of-a-tropical-beach-9828');
  
  // Try to find the video tag source
  const videoUrl = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video ? video.src : null;
  });

  if (videoUrl) {
    console.log('Found video URL:', videoUrl);
    // Download the video
    const file = fs.createWriteStream('public/hero.mp4');
    https.get(videoUrl, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Video downloaded!');
      });
    });
  } else {
    console.log('No video tag found');
  }
  
  await browser.close();
})();
