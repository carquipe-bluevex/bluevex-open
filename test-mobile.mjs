import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 375, height: 812 },
});

try {
  console.log("📱 Testing header on mobile...");
  await page.goto("http://localhost:4321", { waitUntil: "networkidle" });

  await page.screenshot({ path: "/tmp/header-initial.png" });
  console.log("✓ Initial state screenshot saved");

  await page.evaluate(() => window.scrollBy(0, 100));
  await page.waitForTimeout(400);

  await page.screenshot({ path: "/tmp/header-scrolled.png" });
  console.log("✓ Scrolled state screenshot saved");

  // Check for logo elements
  const logos = await page.locator('[class*="logo"]').count();
  console.log(`🔍 Found ${logos} logo elements`);

  // Get header HTML
  const headerHTML = await page.locator("header").innerHTML();
  const logoMatches = headerHTML.match(/class="logo/g);
  console.log(`📝 Logo elements in header HTML: ${logoMatches?.length || 0}`);
} finally {
  await browser.close();
}
