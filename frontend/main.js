import css from "./main.scss"
import jquery from "jquery"
import NchanSubscriber from "nchan"
import axios from 'axios'
import MicroModal from 'micromodal';
import modalcss from './modal.css'

var audioObj

var backendURL = "http://s823529950.websitehome.co.uk/"

var sub = new NchanSubscriber('https://server.igniteonline.net/api/live/nowplaying/ignite');

var count
var countDownDate = new Date("May 5, 2020 12:00:00").getTime();
var playing = false;
var storedsearch

window.$ = window.jQuery = jquery;

sub.on("message", function(message, message_metadata) {
    // Do something with the Now Playing data.
    let nowPlaying = JSON.parse(message);
    let {title, artist, art} = nowPlaying.now_playing.song
    $(".songName").text(title)
    $(".artistName").text(artist.includes(";") ? artist.split(";")[0] : (artist.includes(",") ? artist.split(",")[0] : artist))

    if (nowPlaying.now_playing.streamer !== "") {
      $(".dj").text(nowPlaying.now_playing.streamer)
      if ([nowPlaying.now_playing.song.album, artist] !== storedsearch) {
        storedsearch = [nowPlaying.now_playing.song.album, artist]
        axios.get(`${backendURL}album?albumname=${storedsearch[0]}&artistname=${storedsearch[1]}`)
          .then(({data}) => {
            $(".art").attr("src", data)
          })
          .catch((data) => {
            $(".art").attr("src", "https://imgur.com/9OlmHbc.png")
          })
      }
    } else {
      $(".art").attr("src", art)
      $(".dj").text("AutoDJ")
      $(".listeners").text(nowPlaying.listeners.current + " Listeners")
      console.log(nowPlaying)
    }

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
  // $("title").text("IGNITE " + composited)
}
count = setInterval(setCountdown, 1000)
setCountdown()

$(document).ready(function() {
  if ($("#audio")[0].paused) {
    $(".imageOverlay").show()
    playing = false
  }
});

$(".imageOverlay").click(() => {
  if (!playing) {
    togglePause()
  }
})

$("#songSubmit").click(() => {
  let params = new URLSearchParams();
  params.append('name', $("#name")[0].value);
  params.append('song', $("#song")[0].value);

  axios({
    url: backendURL + "songRequest", 
    data: params,
    method: 'post'
  })
    .then(({data}) => {
      if (data == "success") {
        $("#songSubmit").text("Success")
        setTimeout(() => {$("#songSubmit").text("Submit")}, 2000)
      }
    })
})

$(".toggleplay").click(() => {
  togglePause()
})

var overlayTimeout

var togglePause = () => {
  if (!playing) {
    $("#audio")[0].volume = 0
    $("#audio")[0].play()
    $("#audio").animate({volume: 0.5}, 1000);
    $(".playbutton").hide()
    $(".pausebutton").show()
    playing = true
  } else {
    playing = false
    $("#audio")[0].pause()
    $(".pausebutton").hide()
    $(".playbutton").show()
  }
}

$(".slider").on("input", (data) => {
  $("#audio")[0].volume = data.target.value / 100
})

MicroModal.init();