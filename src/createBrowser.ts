import chrome from 'chrome-aws-lambda';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer';

export type FactoredBrowser= puppeteer.Browser;
export type BrowserFactory = (viewportWidth: number, viewportHeight: number, drp: number) => Promise<FactoredBrowser>;


export const createLocalBrowser: BrowserFactory = async (viewportWidth, viewportHeight, drp) => (
  puppeteer.launch({
    headless: true,
    defaultViewport: {
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: drp
    }
  })
)

export const createAWSBrowser: BrowserFactory = async (viewportWidth, viewportHeight, dpr) => (
  puppeteerCore.launch({
    args: chrome.args,
    executablePath: await chrome.executablePath,
    headless: true,
    defaultViewport: {
      width: viewportWidth,
      height: viewportHeight,
      deviceScaleFactor: dpr
    }
  }) as any
)