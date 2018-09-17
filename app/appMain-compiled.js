/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./app/appMain.lsc");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/appMain.lsc":
/*!*************************!*\
  !*** ./app/appMain.lsc ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _isMatch2 = __webpack_require__(/*! @oigroup/lightscript-runtime/isMatch */ "@oigroup/lightscript-runtime/isMatch");

var _isMatch3 = _interopRequireDefault(_isMatch2);

var _util = __webpack_require__(/*! util */ "util");

var _util2 = _interopRequireDefault(_util);

var _fs = __webpack_require__(/*! fs */ "fs");

var _path = __webpack_require__(/*! path */ "path");

var _path2 = _interopRequireDefault(_path);

var _child_process = __webpack_require__(/*! child_process */ "child_process");

var _lowdb = __webpack_require__(/*! lowdb */ "lowdb");

var _lowdb2 = _interopRequireDefault(_lowdb);

var _FileSync = __webpack_require__(/*! lowdb/adapters/FileSync */ "lowdb/adapters/FileSync");

var _FileSync2 = _interopRequireDefault(_FileSync);

var _timeproxy = __webpack_require__(/*! timeproxy */ "timeproxy");

var _timeproxy2 = _interopRequireDefault(_timeproxy);

var _rssParser = __webpack_require__(/*! rss-parser */ "rss-parser");

var _rssParser2 = _interopRequireDefault(_rssParser);

var _rss = __webpack_require__(/*! rss */ "rss");

var _rss2 = _interopRequireDefault(_rss);

var _maybe = __webpack_require__(/*! folktale/maybe */ "folktale/maybe");

var _maybe2 = _interopRequireDefault(_maybe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pexecFile = _util2.default.promisify(_child_process.execFile);
var pwriteFile = _util2.default.promisify(_fs.writeFile);

var ytChannelFeed = 'https://www.youtube.com/feeds/videos.xml?channel_id=UC3s0BtrBJpwNDaflRSoiieQ';
var projectPath = _path2.default.resolve(__dirname, '..');
var youtubedlBinaryPath = _path2.default.join(projectPath, 'youtube-dl-binary', 'youtube-dl');
var dbPath = _path2.default.join(projectPath, 'db', 'db.json');
var feedFilePath = _path2.default.join(projectPath, 'feed', 'feed.xml');
var defaultFeedProperties = {
  title: 'ThreatWire',
  image_url: 'https://www.hak5.org/wp-content/uploads/2016/04/logo_black_small.png'
};


var db = (0, _lowdb2.default)(new _FileSync2.default(dbPath));
var feedParser = new _rssParser2.default();

db.defaults({ lastVideoPublishDate: 'Never' }).write();

function getNewTWvideos() {
  return feedParser.parseURL(ytChannelFeed).then(getTWvideosFromFeed).then(downloadNewVideo).then(updateRSSfeed).catch(function (e) {
    return console.error(e);
  });
}function getTWvideosFromFeed(_ref) {
  var videos = _ref.items;

  return videos.filter(function (video) {
    return video.title.toLowerCase().includes('threatwire');
  });
}function shouldDownloadVideo(twVideos) {
  if (true) return true;
  return twVideos.length && db.get('lastVideoPublishDate').value() !== twVideos[0].pubDate;
}function downloadNewVideo(twVideos) {
  // eslint-disable-line fp/no-nil
  if (!shouldDownloadVideo(twVideos)) {
    return _maybe2.default.Nothing();
  } else {
    var mostRecentVideo = twVideos[0];
    updateDBwithMostRecentDownload(mostRecentVideo);
    var saveFilePath = _path2.default.join('audioFiles', mostRecentVideo.id.slice(9) + '.webm');
    return pexecFile(youtubedlBinaryPath, [mostRecentVideo.link, '-o' + saveFilePath, '-f bestaudio']).then(function (result) {
      return console.log(result);
    }).then(function () {
      return _maybe2.default.Just(twVideos);
    });
  }
}function updateDBwithMostRecentDownload(mostRecentVideo) {
  return db.set('lastVideoPublishDate', mostRecentVideo.pubDate).write();
}function updateRSSfeed(twVideos) {
  // eslint-disable-line fp/no-nil
  if ((0, _isMatch3.default)(_maybe.Just, twVideos)) {
    var feed = new _rss2.default(defaultFeedProperties);
    twVideos.getOrElse([]).forEach(function (video) {
      return feed.item({
        title: video.title,
        guid: video.id,
        url: video.link, //TODO:need to change this to be the url+folderPath of the site
        date: video.pubDate
      });
    });
    pwriteFile(feedFilePath, feed.xml({ indent: true }));
    return console.log('RSS Feed xml file updated');
  }
}setInterval(getNewTWvideos, _timeproxy2.default.ONE_DAY);
getNewTWvideos();

/***/ }),

/***/ "@oigroup/lightscript-runtime/isMatch":
/*!*******************************************************!*\
  !*** external "@oigroup/lightscript-runtime/isMatch" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@oigroup/lightscript-runtime/isMatch");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "folktale/maybe":
/*!*********************************!*\
  !*** external "folktale/maybe" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("folktale/maybe");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "lowdb":
/*!************************!*\
  !*** external "lowdb" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lowdb");

/***/ }),

/***/ "lowdb/adapters/FileSync":
/*!******************************************!*\
  !*** external "lowdb/adapters/FileSync" ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lowdb/adapters/FileSync");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "rss":
/*!**********************!*\
  !*** external "rss" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rss");

/***/ }),

/***/ "rss-parser":
/*!*****************************!*\
  !*** external "rss-parser" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("rss-parser");

/***/ }),

/***/ "timeproxy":
/*!****************************!*\
  !*** external "timeproxy" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("timeproxy");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ })

/******/ });
//# sourceMappingURL=appMain-compiled.js.map