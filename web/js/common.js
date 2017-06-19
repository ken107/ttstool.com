languages = [
  {value:"en", desc:"English"},
  {value:"ja", desc:"Japanese"},
  {value:"tr", desc:"Turkish"},
  {value:"sv", desc:"Swedish"},
  {value:"ru", desc:"Russian"},
  {value:"ro", desc:"Romanian"},
  {value:"pt", desc:"Portuguese"},
  {value:"pl", desc:"Polish"},
  {value:"nl", desc:"Dutch"},
  {value:"nb", desc:"Norwegian"},
  {value:"it", desc:"Italian"},
  {value:"is", desc:"Icelandic"},
  {value:"fr", desc:"French"},
  {value:"es", desc:"Spanish"},
  {value:"de", desc:"German"},
  {value:"da", desc:"Danish"},
  {value:"cy", desc:"Welsh"}
]
allVoices = [];
voices = [];
volumes = [
  {value:"default", desc:"default"},
  {value:"silent", desc:"silent"},
  {value:"x-soft", desc:"x-soft"},
  {value:"soft", desc:"soft"},
  {value:"medium", desc:"medium"},
  {value:"loud", desc:"loud"},
  {value:"x-loud", desc:"x-loud"},
];
rates = [
  {value:"medium", desc:"default"},
  {value:"x-slow", desc:"x-slow"},
  {value:"slow", desc:"slow"},
  {value:"medium", desc:"medium"},
  {value:"fast", desc:"fast"},
  {value:"x-fast", desc:"x-fast"},
];
pitches = [
  {value:"default", desc:"default"},
  {value:"x-low", desc:"x-low"},
  {value:"low", desc:"low"},
  {value:"medium", desc:"medium"},
  {value:"high", desc:"high"},
  {value:"x-high", desc:"x-high"},
];

rows = [{}];
editIndex = 0;
tts = new RemoteTTS("https://support.lsdsoftware.com:30112");
tts.getVoices()
  .then(results => {
    results.sort(function(a, b) {
      return a.LanguageCode.localeCompare(b.LanguageCode) || a.Id.localeCompare(b.Id);
    })
    allVoices = results.map(function(voice) {
      return {
        lang: voice.LanguageCode.split("-")[0],
        name: voice.Name,
        value: voice.Id,
        desc: voice.Name + " (" + voice.LanguageName + ")"
      }
    })
  })


function playAll() {
  if (!rows.length) return;
  if (!rows[0].voice) {
    alert("Please select a voice for the first speech segment.");
    return;
  }
  var parts = [];
  rows.forEach(function(row) {
    var part;
    if (parts.length && (!row.voice || parts[parts.length-1].voiceId == row.voice.value)) part = parts[parts.length-1];
    else parts.push(part = {voiceId: row.voice.value, ssml: ""});
    if (row.pause) part.ssml += "<break time='" + row.pause.value + "s'/>";
    if (row.volume || row.rate || row.pitch) {
      part.ssml += "<prosody";
      if (row.volume) part.ssml += " volume='" + row.volume.value + "'";
      if (row.rate) part.ssml += " rate='" + row.rate.value + "'";
      if (row.pitch) part.ssml += " pitch='" + row.pitch.value + "'";
      part.ssml += ">";
    }
    if (row.text) part.ssml += row.text;
    if (row.volume || row.rate || row.pitch) part.ssml += "</prosody>";
    part.ssml += " ";
  })
  parts.forEach(function(part) {
    part.ssml = "<speak>" + part.ssml + "</speak>";
  })
  return tts.speak(parts);
}

function RemoteTTS(host) {
  var audio = document.createElement("AUDIO");

  this.speak = function(parts, onEnd) {
    return new Promise(function(fulfill, reject) {
      $.post({
        url: host + "/read-aloud/create",
        data: JSON.stringify(parts),
        contentType: "application/json",
        success: function(result) {
          audio.pause();
          audio.src = host + "/read-aloud/get?q=" + result.join(",");
          audio.onplay = fulfill;
          audio.onerror =
          audio.onended = onEnd;
          audio.play();
          fulfill();
        },
        error: function(xhr, status, error) {
          reject(status || error);
        }
      })
    })
  }

  this.isSpeaking = function(callback) {
    callback(audio.currentTime && !audio.paused && !audio.ended);
  }

  this.stop = function() {
    audio.pause();
  }

  this.getVoices = function() {
    return new Promise(function(fulfill, reject) {
      $.get({
        url: host + "/read-aloud/list-voices/amazon",
        success: fulfill,
        error: function(xhr, status, error) {
          reject(status || error);
        }
      })
    })
  }
}
