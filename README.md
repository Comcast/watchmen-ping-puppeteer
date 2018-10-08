[![Build Status](https://travis-ci.com/Comcast/watchmen-ping-puppeteer.svg?branch=master)](https://travis-ci.com/Comcast/watchmen-ping-puppeteer)
Feed a [Puppeteer](puppeteer) script to [Watchmen](watchmen) to run synthetic monitoring.

In your Watchmen directory:
`npm install watchmen-ping-puppeteer --save`

### How To Use:
- *Important* This runs on Node v7.4 or higher to use async/await otherwise, you'll have to compile down.
- Create a Puppeteer script with a `.js` extension

```javascript
const puppeteer = require('puppeteer');

async function getImageAltText() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://my.xfinity.com');

  let selector = '.xfinity-logo';
  let imageSelector = await page.$('img');
  let getImage = await page.evaluate(image => image.alt, imageSelector);
  try {
    await page.waitForSelector(selector).then(getImage);
  } catch (err) {
    const browserClose = await browser.close();
    return `Failed to retrieve selector ${err}`;
  }
  browser.close();

  if (getImage === 'comcast official logo, xfinity official logo') {
    return 'Title Found';
  } else {
    throw 'Failure: title does not match';
  }
}

getImageAltText().then(success => {
  console.log(success);
  return success;
}).catch(err => {
  process.exitCode = 1;
  console.log(err);
  return err;
});
```

- Copy your `.js` file to a directory on your Watchmen instance
- After uploaded - click add new service and select ping service `puppeteer`
- In Ping options `scriptPath` put full file path and file name
- Click `Save` and you'll be on your way!

Please read `CONTRIBUTING.md` for how to contribute to the project.

Any issues/comments/questions, please file an issue and we'll respond.

---

Copyright 2018 Comcast Cable Communications Management, LLC
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

[puppeteer]: https://github.com/GoogleChrome/puppeteer
[watchmen]: https://github.com/iloire/watchmen
