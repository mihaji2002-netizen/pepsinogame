import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const OUT = process.env.OUT_DIR ?? "/opt/cursor/artifacts/screenshots";
mkdirSync(OUT, { recursive: true });

const BASE = "http://localhost:3000";

const studentState = {
  user: { role: "student", studentId: "stu-1" },
};
const mentorState = {
  user: { role: "mentor", mentorId: "men-1" },
};

async function shoot(page, path, file, { fullPage = false, state = null } = {}) {
  if (state) {
    await page.goto(BASE);
    await page.evaluate((s) => {
      const key = "pepsino-lab-mvp-v1";
      const existing = JSON.parse(localStorage.getItem(key) ?? "{}");
      localStorage.setItem(key, JSON.stringify({ ...existing, ...s }));
    }, state);
  }
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });

  // fixed backgrounds only paint the first viewport in fullPage captures;
  // switch them to absolute positioning for the screenshot only
  await page.addStyleTag({
    content: `
      body { background-attachment: scroll !important; }
      body::before { position: absolute !important; height: 100%; }
    `,
  });

  if (fullPage) {
    // scroll through the page so whileInView animations fire
    await page.evaluate(async () => {
      const step = window.innerHeight / 2;
      for (let y = 0; y <= document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
    });
  }
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/${file}`, fullPage });
  console.log(`captured ${file}`);
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.5,
});

// Public pages
await shoot(page, "/", "01-landing-full.png", { fullPage: true });
await shoot(page, "/login", "02-login.png");
await shoot(page, "/register", "03-register.png");

// Student pages (seed auth into localStorage first)
await shoot(page, "/student/dashboard", "04-student-dashboard.png", {
  fullPage: true,
  state: studentState,
});
await shoot(page, "/student/missions", "05-missions.png", { fullPage: true });
await shoot(page, "/student/logbook", "06-logbook.png");
await shoot(page, "/student/planner", "07-planner.png");
await shoot(page, "/student/id-card", "08-id-card.png");
await shoot(page, "/student/leaderboard", "09-leaderboard.png");

// Mentor pages
await shoot(page, "/mentor/dashboard", "10-mentor-dashboard.png", {
  fullPage: true,
  state: mentorState,
});
await shoot(page, "/mentor/students/stu-1", "11-student-detail.png", {
  fullPage: true,
});
await shoot(page, "/mentor/reports", "12-reports.png", { fullPage: true });

await browser.close();
console.log("done");
