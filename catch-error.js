import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => {
    if(request.failure()) console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
  });
  
  try {
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0', timeout: 10000 });
  } catch(e) {
    console.log("Nav error:", e);
  }
  
  await browser.close();
})();
