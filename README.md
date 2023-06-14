# Algolia Analyzer
## What
Algolia Analyzer is a browser extension that adds a new panel in your devtools.
That panel will capture requests made to algolia servers (algolianet.com, algolia.net) and will allow you to analyze those request.
It also provides a small tool to check the acl of an Algolia API Key.

## Install
- Download the zip file attached to [the latest release](https://github.com/algolia/algolia-analyzer/releases)
- Unpack that zip file into a folder
- visit `chrome://extensions` in your browser
- toggle the top-right "Developer mode" toggle to active
- click on the newly appeared "Load unpacked" button, and select the folder in which you unziped the zip file
  - you should see "Algolia Analyzer" in the list of your extensions!
- you might need to restart your browser for the new `⏱️ Algolia Analyzer` tab to appear in your devtools

## Screens
![](./images/empty-list.png)

![](./images/list.png)

![](./images/panel.png)

## Dev & Run
```ts
yarn // first install dependencies
yarn build // then build the extension

```
Then, you can go into **chrome** and import it:
- visit `chrome://extensions` in your browser
- toggle the top-right "Developer mode" toggle to active
- click on the newly appeared "Load unpacked" button, and select the folder `./dist/webext-prod`
  - you should see "Algolia Analyzer" in the list of your extensions!
- you might need to restart your browser for the new `⏱️ Algolia Analyzer` tab to appear in your devtools

Alternatively for an dev experience with file watching, you can run `yarn start` (instead of `yarn build`) and load the folder `./dist/webext-dev`

## how to implement support for a new API
- in `utils/Requests.ts`, add a new value in `ApiType`
  - this is the internal name of the API
- this will require you to also update `components/Tags` > `apiString`
  - this is how the API will be displayed in the tags
- in `utils/constants.ts`, update either `urlPattern` of `urlPattern2`
  - these are the patterns used to catch requests
  - if you need to add a new pattern, don't forget to:
    - update this documentation
    - update the code that depends on those pattern to handle this new one
- finally, `pages/devtools/Page.tsx` > `getUrlData` is where the tags are extracted from the url
