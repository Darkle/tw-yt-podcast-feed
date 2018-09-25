'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var _isMatch = _interopDefault(require('@lightscript/runtime/isMatch'));
var path = _interopDefault(require('path'));
var util = _interopDefault(require('util'));
var fs = require('fs');
var Maybe = require('folktale/maybe');
var Maybe__default = _interopDefault(Maybe);
var RSS = _interopDefault(require('rss'));
var low = _interopDefault(require('lowdb'));
var FileSync = _interopDefault(require('lowdb/adapters/FileSync'));
var child_process = require('child_process');
var Parser = _interopDefault(require('rss-parser'));
var tp = _interopDefault(require('timeproxy'));
var express = _interopDefault(require('express'));

const pwriteFile = util.promisify(fs.writeFile);
const feedFilePath = path.resolve(__dirname, '..', 'feed', 'feed.xml');
const defaultFeedProperties = {
  title: 'ThreatWire',
  image_url: 'https://www.hak5.org/wp-content/uploads/2016/04/logo_black_small.png'
};

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

const dbPath = path.resolve(__dirname, '..', 'db', 'db.json');
let db = null; // eslint-disable-line fp/no-let, fp/no-nil

function initDB() {
  db = low(new FileSync(dbPath)); // eslint-disable-line fp/no-mutation

  return db.defaults({
    lastVideoPublishDate: 'Never'
  }).write();
}

function getDB() {
  return db;
}

function updateDBwithMostRecentDownload(mostRecentVideo) {
  return db.set('lastVideoPublishDate', mostRecentVideo.pubDate).write();
}

const pexecFile = util.promisify(child_process.execFile);
const ytChannelFeed = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3s0BtrBJpwNDaflRSoiieQ';
const projectPath = path.resolve(__dirname, '..');
const youtubedlBinaryPath = path.join(projectPath, 'youtube-dl-binary', 'youtube-dl');
const feedParser = new Parser();

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
    const videoId = mostRecentVideo.id.slice(9);
    const saveFilePath = path.join('audioFiles', `${videoId}.webm`);
    updateDBwithMostRecentDownload(mostRecentVideo);
    return pexecFile(youtubedlBinaryPath, [mostRecentVideo.link, `-o${saveFilePath}`, '-f bestaudio']).then(function () {
      return console.log(`Download of video ${videoId} succeeded`);
    }).then(function () {
      return Maybe__default.Just(twVideos);
    });
  }
}

function shouldDownloadVideo(twVideos) {
  return twVideos.length && getDB().get('lastVideoPublishDate').value() !== twVideos[0].pubDate;
}

const app = express();
app.use(express.static('feed'));
app.listen(process.env.PORT);
initDB();
setInterval(getNewTWvideos, tp.ONE_DAY);
getNewTWvideos();
