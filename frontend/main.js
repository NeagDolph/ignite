import css from "./main.scss"
import jquery from "jquery"
import NchanSubscriber from "nchan"

var audioObj

var sub = new NchanSubscriber('https://server.igniteonline.net/api/live/nowplaying/ignite');

var count
var countDownDate = new Date("May 5, 2020 12:00:00").getTime();
var playing = false;

window.$ = window.jQuery = jquery;

sub.on("message", function(message, message_metadata) {
    // Do something with the Now Playing data.
    let nowPlaying = JSON.parse(message);
    let {title, artist, art} = nowPlaying.now_playing.song
    $(".songName").text(title)
    $(".artistName").text(artist.includes(";") ? artist.split(";")[0] : (artist.includes(",") ? artist.split(",")[0] : artist))
    $(".art").attr("src", art)
});

sub.on('connect', function(evt) {
    //fired when first connected. 
});

sub.start();

var setCountdown = () => {
  let now = new Date().getTime();
  let distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  let composited = `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
  $(".countdown").text(composited)
  $("title").text("IGNITE " + composited)
}
count = setInterval(setCountdown, 1000)
setCountdown()

$(document).ready(function() {
  if (!playing) {
    if (!$("#audio")[0].paused) {
      $(".imageOverlay").css("opacity", "0")
      playing = true
    }
  }
});

$(".imageOverlay").click(() => {
  if (!playing) {
    $(".imageOverlay").css("opacity", "0")
    $("#audio")[0].volume = 0
    $("#audio")[0].play()
    $("#audio").animate({volume: 0.5}, 1000);
    playing = true
  } else {
    playing = false
    $(".imageOverlay").css("opacity", "1")
    $("#audio")[0].pause()
  }
})