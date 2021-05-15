#!/usr/bin/env node

import {Command} from 'commander';
import {measure} from "./index";
import {createLocalBrowser} from "./createBrowser";

const program = new Command();

const getType = (mime: string = 'undefined'): string => {
  if (mime.startsWith('image/svg')) {
    return 'svg';
  }
  if (mime.startsWith('image/')) {
    return 'image';
  }
  if (mime.startsWith('application/javascript') || mime.startsWith('application/x-javascript') || mime.startsWith('text/javascript')) {
    return 'script';
  }
  if (mime.startsWith('text/css')) {
    return 'style';
  }
  return mime.split(';')[0];
}

const parseBool = (x: string): boolean => x !== 'false'

program
  .arguments('<url>')
  .option('-w, --width <number>', 'width', '1024')
  .option('-h, --height <number>', 'height', '768')
  .option('-dpr, --device-pixel-ratio <number>', 'device pixel ratio', '1')
  .option('-ph, --per-host <flag>', 'list information per host', parseBool, true)
  .option('-pt, --per-type <flag>', 'list information per resource type', parseBool, true)
  .option('-f, --focus <type>', 'focus on specific type')
  .option('--host <string>', 'focus on specific host')
  .option('-lh, --ignore-hosts <hosts...>', 'ignore set of host')
  .action(async (url, options) => {
    measure(
      await createLocalBrowser(+options.width, +options.height, +options.devicePixelRatio),
      url
    ).then((data) => {
      const types: Record<string, Record<string, number>> = {};
      const perType: Record<string, { count: number, bytes: number }> = {};
      data.forEach((resource) => {
        const type = getType(resource.type);
        if (options.focus && options.focus !== type) {
          return;
        }
        if (options.ignoreHosts && options.ignoreHosts.includes(resource.host)) {
          return;
        }
        if (options.host && options.host !== resource.host) {
          return;
        }
        if (!types[type]) {
          types[type] = {};
          perType[type] = {
            count: 0,
            bytes: 0,
          };
        }
        if (!types[type][resource.host]) {
          types[type][resource.host] = 0;
        }
        types[type][resource.host] += resource.size;
        perType[type].bytes += resource.size;
        perType[type].count += 1;
      });
      if (options.perType) {
        console.log(JSON.stringify(perType, undefined, 2))
      }
      if (options.perHost) {
        console.log(JSON.stringify(types, undefined, 2))
      }
    })
      .then(() => process.exit(0))
  });

program.addHelpText('after', `

Example call:
  $ what-did-i-load https://facebook.com`);

program.parse();