// ts-node .\src\infrastructure\puppeteer\get_fb_dtsg_though_puppeteer.ts

import { browser, setupBrowser } from './puppeteer';


export async function get_fb_dtsg_ag_though_puppeteer() {
	return new Promise(async (resolve, reject) => {
		await setupBrowser().catch(error => {
			console.log(error)
		});
	
		const url = "https://m.facebook.com/nam0311";
		const page = await browser.newPage();

		page.on("requestfinished", async (request) => {
			const pageCookies = await page.cookies();
			const cookie = pageCookies.map(item => `${item.name}=${item.value}`).join(";");

			const headers = request.headers();
			const url = request.url();
			// headers['Cookie'] = cookie;

			if (url.includes("__user")) {
				const config = {
					url,
					method: request.method(),
					headers,
					data: request.postData(),
					fb_dtsg_ag: /fb_dtsg_ag=(.*?)&/g.exec(url)[1]
				}
				browser.close();

				resolve(config.fb_dtsg_ag);
			}
		});

		await page.goto(url, { waitUntil: "networkidle0" });
		const content = await page.content();
	})
}

// export async function get_fb_dtsg_ag() {
// 	const data = await get_fb_dtsg_ag_though_puppeteer();
// 	await MongoDbCache.getInstance().set("fb_dtsg_ag_puppeteer", data);

// 	console.log("SIGINT");
// 	process.send("SIGINT");
// }

//get_fb_dtsg_ag();