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


function playAll(download) {
  if (!rows.length) return;
  if (!rows[0].voice) {
    alert("Please select a voice for the first speech segment.");
    return;
  }
  var ssmlParts = groupByVoice(rows).map(voiceGroupToSSML);
  return download ? tts.download(ssmlParts) : tts.speak(ssmlParts);
}

function groupByVoice(rows) {
  var groups = [];
  rows.forEach(function(row) {
    var group = groups.length ? groups[groups.length-1] : null;
    if (!group || row.voice && row.voice != group.voice) groups.push({voice: row.voice, rows: [row]});
    else group.rows.push(row);
  })
  return groups;
}

function voiceGroupToSSML(vg) {
  return {
    voiceId: vg.voice.value,
    ssml: "<speak>" + groupByProsody(vg.rows).map(prosodyGroupToSSML).join(" ") + "</speak>"
  }
}

function groupByProsody(rows) {
  var groups = [];
  rows.forEach(function(row) {
    var group = groups.length ? groups[groups.length-1] : null;
    if (!group || row.volume && row.volume != group.volume || row.rate && row.rate != group.rate || row.pitch && row.pitch != group.pitch) {
      groups.push({
        volume: row.volume || group && group.volume,
        rate: row.rate || group && group.rate,
        pitch: row.pitch || group && group.pitch,
        rows: [row]
      })
    }
    else {
      group.rows.push(row);
    }
  })
  return groups;
}

function prosodyGroupToSSML(pg) {
  var ssml = "";
  if (pg.volume || pg.rate || pg.pitch) {
    ssml += "<prosody";
    if (pg.volume) ssml += " volume='" + pg.volume.value + "'";
    if (pg.rate) ssml += " rate='" + pg.rate.value + "'";
    if (pg.pitch) ssml += " pitch='" + pg.pitch.value + "'";
    ssml += ">";
  }
  ssml += pg.rows.map(rowToSSML).join(" ");
  if (pg.volume || pg.rate || pg.pitch) ssml += "</prosody>";
  return ssml;
}

function rowToSSML(row) {
  var ssml = "";
  if (row.pause) ssml += "<break time='" + row.pause.value + "s'/>";
  ssml += row.text;
  return ssml;
}


function RemoteTTS(host) {
  var audio = document.createElement("AUDIO");

  this.speak = function(ssmlParts, onEnd) {
    return create(ssmlParts)
      .then(function(result) {
        return new Promise(function(fulfill) {
          audio.pause();
          audio.src = host + "/read-aloud/get?q=" + result.join(",");
          audio.onplay = fulfill;
          audio.onerror =
          audio.onended = onEnd;
          audio.play();
        })
      })
  }

  this.download = function(ssmlParts) {
    return create(ssmlParts)
      .then(function(result) {
        location.href = host + "/read-aloud/get?q=" + result.join(",") + "&saveAs=narration.mp3";
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

  function create(parts) {
    return new Promise(function(fulfill, reject) {
      $.post({
        url: host + "/read-aloud/create",
        data: JSON.stringify(parts),
        contentType: "application/json",
        success: fulfill,
        error: function(xhr, status, error) {
          reject(status || error);
        }
      })
    })
  }
}
