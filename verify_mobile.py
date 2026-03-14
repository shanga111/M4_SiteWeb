import asyncio
from playwright.async_api import async_playwright
import os

async def verify_mobile_videos():
    async with async_playwright() as p:
        # Use a mobile device profile
        iphone_13 = p.devices['iPhone 13']
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(**iphone_13)
        page = await context.new_page()

        # Start from about.html
        await page.goto("http://localhost:3000/about.html")

        # Click "Voir mes projets"
        # We need the server running.

        print("Clicking 'Voir mes projets' on mobile...")
        await page.click('text=Voir mes projets')

        # Wait for navigation and jump
        await page.wait_for_selector('#portfolio-container .portfolio-item')

        # Wait a bit for the scroll and observer to settle
        await asyncio.sleep(2)

        # Check how many videos are playing and not muted
        videos_info = await page.evaluate("""() => {
            const videos = Array.from(document.querySelectorAll('video'));
            return videos.map(v => ({
                id: v.id,
                src: v.currentSrc,
                paused: v.paused,
                muted: v.muted,
                visible: v.getBoundingClientRect().top < window.innerHeight && v.getBoundingClientRect().bottom > 0
            }));
        }""")

        print("Videos status:")
        for v in videos_info:
            print(f"- Video: {v['id'] or 'Background'}, Paused: {v['paused']}, Muted: {v['muted']}, Visible: {v['visible']}")

        playing_with_sound = [v for v in videos_info if not v['paused'] and not v['muted']]
        print(f"Videos playing with sound: {len(playing_with_sound)}")

        await page.screenshot(path="verification/mobile_jump.png")

        await browser.close()

if __name__ == "__main__":
    # Ensure verification directory exists
    os.makedirs("verification", exist_ok=True)
    asyncio.run(verify_mobile_videos())
