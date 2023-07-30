# add-sub

Add local subtitles file onto current page. Well, for watching an English movie online (not on OTT) with Korean subtitles.

## usage
1. Copy all of [`app.js`](https://anemochore.github.io/add-sub/app.js). [Bookmarklet (minified) use](https://en.wikipedia.org/wiki/Bookmarklet) is may not possible on iframe pages.
2. Start video on what-so-ever page. I've tested on a page with [jwplayer](https://jwplayer.com/). (Yes, it's working.)
3. [Open developer console](https://elfsight.com/blog/how-to-work-with-developer-console/) and paste the script and press enter to excute.
4. If video is in iframe, [first select the iframe in Console](https://devtoolstips.org/tips/en/inspect-debug-iframes/) and then excute the script there.
5. 'Choose File' button will appear at (mostly) the top. Now select your local subtitles. Supported formats are [here](https://github.com/papnkukn/subsrt#supported-subtitle-formats).

## 3rd party license

Converts various subtitles formats to WebVTT via modified [papnkukn/subsrt](https://github.com/papnkukn/subsrt), MIT license.
