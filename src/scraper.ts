import puppeteer from 'puppeteer';
import  fs from 'fs';


(async () => {
  const browser = await puppeteer.launch({ headless: false });
  try {

    const page = await browser.newPage();
    // enter url in page
    await page.goto(`https://news.ycombinator.com/`);
    await page.waitForSelector("a.storylink");
    
    //do the work
    var news = await page.evaluate(() => {
      var title = document.querySelectorAll(`a.storylink`);
      var age = document.querySelectorAll(`span.age`);
      var score = document.querySelectorAll(`span.score`);
      var data = []
      
     
      for (let i = 0; i < title.length; i++) {
        data[i] = {
          title : title[i].innerHTML.trim(),
          link : title[i].getAttribute("href"),
          period: age[i].querySelector("a")?.innerHTML,
          score: score[i]?.innerHTML,

        }
        
      }
      return data;
    })
    //close browser
    await browser.close();
    //write to file
    fs.writeFile("data.json", JSON.stringify(news), (err) => {
      if (err) throw err;
      console.log("Successfully done,now Closing browser...")

    })

  } catch (err) {
    console.log(err);
    //close browser
    await browser.close();
    console.log("OOps Closing browser...")
  }
})();
