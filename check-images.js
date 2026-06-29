import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle2' });
    console.log("Page loaded. Checking images...");
    
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.slice(0, 10).map(img => ({
        src: img.src,
        width: img.naturalWidth,
        height: img.naturalHeight,
        complete: img.complete
      }));
    });
    
    console.log("Sample Images Status:");
    console.log(JSON.stringify(images, null, 2));

  } catch(e) {
    console.log("Error:", e);
  }
  
  await browser.close();
})();
