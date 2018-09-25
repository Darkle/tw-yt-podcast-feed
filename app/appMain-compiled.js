'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _isMatch = _interopDefault(require('@lightscript/runtime/isMatch'));
var util = _interopDefault(require('util'));
var fs = require('fs');
var path = _interopDefault(require('path'));
var child_process = require('child_process');
var low = _interopDefault(require('lowdb'));
var FileSync = _interopDefault(require('lowdb/adapters/FileSync'));
var tp = _interopDefault(require('timeproxy'));
var Parser = _interopDefault(require('rss-parser'));
var RSS = _interopDefault(require('rss'));
var Maybe = require('folktale/maybe');
var Maybe__default = _interopDefault(Maybe);

const pexecFile = util.promisify(child_process.execFile);
const pwriteFile = util.promisify(fs.writeFile);
const ytChannelFeed = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3s0BtrBJpwNDaflRSoiieQ';
const projectPath = path.resolve(__dirname, '..');
const youtubedlBinaryPath = path.join(projectPath, 'youtube-dl-binary', 'youtube-dl');
const dbPath = path.join(projectPath, 'db', 'db.json');
const feedFilePath = path.join(projectPath, 'feed', 'feed.xml');
const defaultFeedProperties = {
  title: 'ThreatWire',
  image_url: 'https://www.hak5.org/wp-content/uploads/2016/04/logo_black_small.png'
};
const db = low(new FileSync(dbPath));
const feedParser = new Parser();
db.defaults({
  lastVideoPublishDate: 'Never'
}).write();

function getNewTWvideos() {
  return feedParser.parseURL(ytChannelFeed).then(getTWvideosFromFeed).then(downloadNewVideo).then(updateRSSfeed).catch(function (e) {
    return console.error(e);
  });
}

function getTWvideosFromFeed({
  items: videos
}) {
  return videos.filter(function (video) {
    return video.title.toLowerCase().includes('threatwire');
  });
}

function downloadNewVideo(twVideos) {
  // eslint-disable-line fp/no-nil
  if (!shouldDownloadVideo(twVideos)) {
    return Maybe__default.Nothing();
  } else {
    const mostRecentVideo = twVideos[0];
    const saveFilePath = path.join('audioFiles', `${mostRecentVideo.id.slice(9)}.webm`);
    updateDBwithMostRecentDownload(mostRecentVideo);
    return pexecFile(youtubedlBinaryPath, [mostRecentVideo.link, `-o${saveFilePath}`, '-f bestaudio']).then(function (result) {
      return console.log(result);
    }).then(function () {
      return Maybe__default.Just(twVideos);
    });
  }
}

function shouldDownloadVideo(twVideos) {
  return twVideos.length && db.get('lastVideoPublishDate').value() !== twVideos[0].pubDate;
}

function updateDBwithMostRecentDownload(mostRecentVideo) {
  return db.set('lastVideoPublishDate', mostRecentVideo.pubDate).write();
}

function updateRSSfeed(twVideos) {
  // eslint-disable-line fp/no-nil
  if (_isMatch(Maybe.Just, twVideos)) {
    const feed = new RSS(defaultFeedProperties);
    twVideos.getOrElse([]).forEach(function (video) {
      // eslint-disable-line fp/no-nil
      return feed.item({
        title: video.title,
        guid: video.id,
        url: video.link,
        //TODO:need to change this to be the url+folderPath of the site
        date: video.pubDate
      });
    });
    pwriteFile(feedFilePath, feed.xml({
      indent: true
    }));
    return console.log('RSS Feed xml file updated');
  }
}

setInterval(getNewTWvideos, tp.ONE_DAY);
getNewTWvideos();
