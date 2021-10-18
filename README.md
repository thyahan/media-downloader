# Media downloader script

download media using HAR file as json.

## how to get har file

Open inspect
<br />
![step1](https://raw.githubusercontent.com/thyahan/media-downloader/master/howto/01.png)

Select tab `network` then `Images`'s filter
<br />
![step2](https://raw.githubusercontent.com/thyahan/media-downloader/master/howto/02.png)

Reload page again, so network tab will track every loaded image. Then `Save all as HAR`
<br />
![step3](https://raw.githubusercontent.com/thyahan/media-downloader/master/howto/03.png)

Named `network.har.json` to `./howto`
<br />
![step4](https://raw.githubusercontent.com/thyahan/media-downloader/master/howto/04.png)

## Run

`npm i && npm run start`
or
`npm i && node index.js`
