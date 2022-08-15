// ts-node .\src\infrastructure\puppeteer\get_fb_dtsg_though_puppeteer.ts

import { browser, setupBrowser } from './puppeteer';
import { MongoDbCache } from '../../src/shared/mongodb-common/mongodb-cache';
export async function get_tiktok_data_though_puppeteer() {
	return new Promise(async (resolve, reject) => {
		await setupBrowser().catch(error => {
			console.log(error)
		});
	
		const url = "https://www.tiktok.com/";
		const page = await browser.newPage();

		page.on("requestfinished", async (request) => {
			const pageCookies = await page.cookies();
			var cookie = pageCookies.map(item => `${item.name}=${item.value}`).join(";");

			var headers = request.headers();
			// headers['Cookie'] = cookie;

			if (request.url().includes("check")) {
				const config = {
					url: request.url(),
					method: request.method(),
					headers,
					data: request.postData()
				}

				resolve(config);
			}
		});

		await page.goto(url, { waitUntil: "networkidle0" });
		const content = await page.content();
	})
}

export async function get_tiktok_data() {
	const data = await get_tiktok_data_though_puppeteer();
	await MongoDbCache.getInstance().set("tiktok_data_puppeteer", data);

	console.log("SIGINT");
	process.send("SIGINT");
}

get_tiktok_data();