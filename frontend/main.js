import css from "./main.scss"
import jquery from "jquery"
import NchanSubscriber from "nchan"
import axios from 'axios'
import MicroModal from 'micromodal';
import modalcss from './modal.css'

var backendURL = "https://igniteonline.net/api/";
var streamURL = "https://listen.igniteradio.pw/radio/8000/radio.mp3";
var apiURL = "https://listen.igniteradio.pw/api/live/nowplaying/ignite"

var audio;
var volume = 0.15;

var sub = new NchanSubscriber(apiURL);

var count
var countDownDate = new Date("June 25, 2020 12:00:00").getTime();
var playing = false;

window.$ = window.jQuery = jquery;

function setObject(type, data) {
  if (type == "art")
    $(".art").attr("src", data);
  else if (type == "listeners")
    $(".listeners").text(data + " Listener" + (data > 1 ? "s" : ""));
  else if (type == "dj")
    $(".dj").html(data);
}

sub.on("message", function(message) {
    // Do something with the Now Playing data.
    let nowPlaying = JSON.parse(message);

    setObject("listeners", nowPlaying.listeners.current)

    let {title, artist, art, album} = nowPlaying.now_playing.song

    if (nowPlaying.now_playing.streamer === "")
      setObject("dj", "AutoDJ");
    else
      setObject("dj", nowPlaying.now_playing.streamer);

    if (art.includes("imgur")) {
      if (title !== $(".songName").text()) {
        if (album === "") album = title
        axios.get(`${backendURL}art?albumName=${album}&artist=${artist}`)
          .then(({data}) => {
            setObject("art", data)
          })
          .catch((data) => {
            setObject("art", "https://imgur.com/KwLz0bC.png")
          })
      }
    } else setObject("art", art)

    $(".songName").text(title)
    $(".artistName").text(artist.includes(";") ? artist.split(";")[0] : (artist.includes(",") ? artist.split(",")[0] : artist))


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
  audio = new Audio(streamURL);
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
    url: backendURL + "request", 
    data: params,
    method: 'post'
  })
    .then(({data}) => {
      $("#songSubmit").text("Submited")
      $("#songSubmit").attr("disabled", "disabled")
      $("#song").val("")
      
      setTimeout(() => {$("#songSubmit").text("Submit"); 
      $("#songSubmit").attr("disabled", false)}, 2000)
    })
})

$(".toggleplay").click(() => {
  togglePause()
})

var overlayTimeout

var togglePause = () => {
  if (!playing) {
    audio.volume = volume;
    audio.play()
    $(".playbutton").hide()
    $(".pausebutton").show()
    playing = true
  } else {
    playing = false
    audio.pause()
    $(".pausebutton").hide()
    $(".playbutton").show()
  }
}

$(".slider").on("input", (data) => {
  volume = (data.target.value * 0.5) / 100;
  audio.volume = volume;
})

MicroModal.init();
