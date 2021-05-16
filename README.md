what did i load?
---

Puppetter based resource tracker. Generates a report of image/script usage across different devices

# CLI 
`npx what-did-i-load http://mysite.com`

to only collect informatio about images, but ignore some "noisy" hosts
`npx what-did-i-load http://mysite.com -f image -w 1280 -pt false -dpr 2 --ignore-hosts www.facebook.com www.google-analytics.com www.google.com
`

```
npx what-did-i-load --help

Options:
  -w, --width <number>                 width (default: "1024")
  -h, --height <number>                height (default: "768")
  -dpr, --device-pixel-ratio <number>  device pixel ratio (default: "1")
  -ph, --per-host <flag>               list information per host (default: true)
  -pt, --per-type <flag>               list information per resource type (default: true)
  -f, --focus <type>                   focus on specific type
  --host <string>                      focus on specific host
  -lh, --ignore-hosts <hosts...>       ignore set of host
  --help                               display help for command
```


# API
`import {measure, createLocalBrowser} from 'what-did-i-load'`;

- `createLocalBrowser(width, height, dpr)` - creates a puppeteer instance with a given viewport
- `measure(browser, url)` - returns all resources requested by a given page

# AWS
In order to run in AWS/Vercel environment use createAWSBrowser command. 

# See also
- https://vercel.com/thekashey/flow-meter

# License
MIT
