// ts-node .\src\infrastructure\puppeteer\puppeteer.ts

import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra'

import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
// import UserDataDirPlugin from 'puppeteer-extra-plugin-user-data-dir'


// Spin up a browser in the background
export let browser: Browser;

export const setupBrowser = async () => {
  puppeteer
    .use(AdblockerPlugin())
    .use(StealthPlugin())

  browser = await puppeteer
    .launch({ headless: true
      //, ignoreHTTPSErrors: true, defaultViewport: null
			,executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      ,userDataDir: 'C:\\Users\\phamd\\AppData\\Local\\Google\\Chrome\\User Data2\\Test'
      // args:[
			// 	'--start-maximized',
			// 	'--user-data-dir=C:\\Users\\phamd\\AppData\\Local\\Google\\Chrome\\User Data2',
      //   '--profile-directory=Huong'
			// ]
    })
    
  // browser.on('disconnected', setupBrowser);

  return browser;
}


process.on('SIGINT', () => {
  browser.close()
})
