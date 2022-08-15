import { updateOutputToMongoDBv2 } from '../../src/shared/mongodb-common/updateOutputToMongoDB';
import { addFacebookCommentRequest } from '../../src/infrastructure/facebook/add-facebook-comment';
// ts-node test/puppeteer/puppeteer-scap.ts

const puppeteer = require("puppeteer");

const id = "2198218580347716";
const url = `https://m.facebook.com/${id}`;

async function StartScraping() {
  await puppeteer
		.launch({ headless: false, ignoreHTTPSErrors: true, defaultViewport: null,
			executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
			args:[
				'--start-maximized',
				'--user-data-dir=C:\\Users\\phamd\\AppData\\Local\\Google\\Chrome\\User Data2',
				'--profile-directory=Huong'
			]
		})
    .then(async (browser) => {
      const page = await browser.newPage();

      await page.setViewport({
        width: 1366,
        height: 768,
      });
			
			await page.goto(url, {
        waitUntil: "load",
        timeout: 0,
      });

      page.on("response", async (response) => {
        // console.log(await response);
        // console.log(await response._request._resourceType);
        // if (response._request._resourceType == "image") {
        //   console.log(await response._url);
        // }
        if (response.url().includes("comment")) {
          //console.log(await response.text());
        }
      });
			page.on("requestfinished", async (request) => {
        // console.log(await response);
        // console.log(await response._request._resourceType);
        // if (response._request._resourceType == "image") {
        //   console.log(await response._url);
        // }
        
        const pageCookies = await page.cookies();
        var cookie = pageCookies.map(item => `${item.name}=${item.value}`).join(";");

        var headers = request.headers();
        headers['Cookie'] = cookie;

        if (request.url().includes("comment")) {
					const config = {
            url: request.url(),
						method: request.method(),
            headers,
            data: request.postData()
					}

					console.log(request);
					updateOutputToMongoDBv2({}, "addFacebookCommentRequestConfig", config);
        }
      });
    });
}
function formatText(text: string) {
	return text.replace(id, "{id}");
}
StartScraping();