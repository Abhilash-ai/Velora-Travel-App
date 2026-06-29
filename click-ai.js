import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle2' });
    
    // Find the "AI Planner" button and click it
    console.log("Clicking AI Planner button...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const aiBtn = btns.find(b => b.textContent && b.textContent.includes('AI Planner'));
      if (aiBtn) aiBtn.click();
    });
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Type into the input and hit enter
    console.log("Typing message...");
    await page.type('input[type="text"]', 'kashmir trip');
    await page.keyboard.press('Enter');
    
    console.log("Waiting for response...");
    await new Promise(r => setTimeout(r, 4000));
    
    const messages = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.prose')).map(p => p.textContent);
    });
    console.log("Messages rendered:", messages);

  } catch(e) {
    console.log("Error:", e);
  }
  
  await browser.close();
})();
