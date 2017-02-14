/**
 * This is a hypothetical implementation to understand
 * what implementations may look like as we define
 * a standard for video quality of experience metrics.
 */

// States
var NOT_PLAYING = 0;
var ATTEMPTING_TO_PLAY = 1;
var PLAYING = 2;


// Watch Time
var watchTime = 0;
var lastWatchTimeCheck;
var watchTimeInterval;

function updateWatchTime() {
  var now = Date.now();

  watchTime = watchTime + (now - lastWatchTimeCheck);
  lastWatchTimeCheck = now;
}

player.addEventListener('playrequest', function(){
  lastWatchTimeCheck = Date.now();
  watchTimeInterval = window.setInterval(updateWatchTime, 250);
});

function stopWatchTimeInterval() {
  window.clearInterval(watchTimeInterval);
  updateWatchTime();
}

player.addEventListener('pause', stopWatchTimeInterval);
player.addEventListener('end', stopWatchTimeInterval);

// Video Startup Time
var videoStartupTime = null;
var firstPlayRequestTime;

player.addEventListener('playrequest', function(){
  firstPlayRequestTime = Date.now();
});

player.addEventListener('playstart', function(){
  if (videoStartupTime === null) {
    videoStartupTime = Date.now() - firstPlayRequestTime;
  }
});


// Rebuffering
var rebufferCount = 0;
var rebufferDuration = 0;
var rebufferPercentage = 0;
var rebufferFrequency = 0;
var rebufferInterval;
var lastRebufferCheck;

function updateRebufferMetrics() {
  var now = Date.now();

  rebufferDuration = rebufferDuration + (now - lastRebufferCheck);
  lastRebufferCheck = now;
  rebufferPercentage = rebufferDuration / watchTime;
  rebufferFrequency = rebufferCount / watchTime;
}

player.addEventListener('rebuffer', function(){
  rebufferCount++;
  lastRebufferCheck = Date.now();
  rebufferInterval = window.setInterval(updateRebufferMetrics, 250);
});

function stopRebufferInterval() {
  window.clearInterval(rebufferInterval);
  updateRebufferMetrics();
}

player.addEventListener('pause', stopRebufferInterval);
player.addEventListener('playstart', stopRebufferInterval);


// Playback Failure
var playbackFailure = false;

player.addEventListener('error', function(event, data){
  if (data.playbackFailure == true) {
    playbackFailure = true;
  }
});


// Exit/Abort
var exit = false;

window.addEventListener('unload', function() {
  exit = true;
});


// Startup Time After Seek
// ...
