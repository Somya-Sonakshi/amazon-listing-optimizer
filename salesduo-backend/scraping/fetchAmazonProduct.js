import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";
import db from "../config/db.js";

puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getUserAgent = () => {
  const agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  ];
  return agents[Math.floor(Math.random() * agents.length)];
};

export async function fetchAmazonProduct(asin) {
  const url = `https://www.amazon.in/dp/${asin}`;
  let browser;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Scraping ${url}`);

      browser = await puppeteer.launch({
        headless: true,
        defaultViewport: { width: 1366, height: 768 },
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: executablePath(),
      });

      const page = await browser.newPage();
      await page.setUserAgent(getUserAgent());
      await page.setExtraHTTPHeaders({ "accept-language": "en-IN,en;q=0.9" });

      await page.goto("https://www.amazon.in", { waitUntil: "domcontentloaded" });
      await page.setCookie(
        { name: "lc-acbin", value: "en_IN", domain: ".amazon.in" },
        { name: "i18n-prefs", value: "INR", domain: ".amazon.in" }
      );

      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (req.isNavigationRequest() && req.redirectChain().length) {
          console.log("Blocked redirect to:", req.url());
          return req.abort();
        }
        req.continue();
      });

      await delay(2000);
      console.log("Opening product page...");
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      const html = await page.content();
      if (html.includes("Enter the characters you see below") || html.includes("Type the characters")) {
        throw new Error("Blocked by CAPTCHA");
      }
      if (html.includes("Page Not Found") || html.includes("Looking for something?")) {
        throw new Error("Product not found or ASIN invalid");
      }

      await page.evaluate(() => window.scrollBy(0, 500));
      await delay(2000);

      await page.waitForSelector("#productTitle", { timeout: 20000 });

      const title = await page.$eval("#productTitle", el => el.innerText.trim());
      const bullets = await page.$$eval(
        "#feature-bullets li, .a-unordered-list.a-vertical li",
        els => els.map(e => e.innerText.trim()).filter(Boolean)
      );

      const description =
        (await page.$eval("#productDescription", el => el.innerText.trim()).catch(() => "")) ||
        (await page.$eval("#aplus", el => el.innerText.trim()).catch(() => "")) ||
        "";

      await browser.close();

      if (!title && !bullets.length && !description) {
        throw new Error("No product data found on page.");
      }

      await db.query(
  `INSERT INTO products (asin, title, description) 
   VALUES (?, ?, ?, ?) 
   ON DUPLICATE KEY UPDATE 
   title = VALUES(title), 
   description = VALUES(description)`,
  [asin, title, description, JSON.stringify([])] 
);


      console.log("Successfully scraped:", title);
      return { asin, url, title, bullets, description };

    } catch (err) {
      console.error(`Attempt ${attempt} failed: ${err.message}`);
      if (browser) await browser.close();
      if (attempt === 3) throw err;
      await delay(3000);
    }
  }
}
