// ts-node .\src\infrastructure\puppeteer\get_fb_dtsg_though_puppeteer.ts

import { browser, setupBrowser } from './puppeteer';
import { updateOutputToMongoDB } from '../../src/shared/mongodb-common/updateOutputToMongoDB';
import { MongoDbCache } from '../../src/shared/mongodb-common/mongodb-cache';
export async function get_fb_data_though_puppeteer() {
	await setupBrowser().catch(error => {
		console.log(error)
	});

	const url = "https://m.facebook.com/";

	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle0" });

	const content = await page.content();
	let fb_dtsg: string = null;

	try {
		fb_dtsg = await page.evaluate(() => document.querySelector('input[name="fb_dtsg"]')["value"]);
	} catch {}

	const pageCookies = await page.cookies();
	var cookie = pageCookies.map(item => `${item.name}=${item.value}`).join(";");
	// if(fb_dtsg.length > 5) {
	// 	await page.close();
	// 	(await browser).close();
	// }
	
	return {
		fb_dtsg,
		cookie
	};
}

export async function get_fb_data() {
	const data = await get_fb_data_though_puppeteer();
	await MongoDbCache.getInstance().set("fb_data_puppeteer", data);

	console.log("SIGINT");
	process.send("SIGINT");
}

get_fb_data();