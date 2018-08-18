
allVoices = getVoices();
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

tts = new RemoteTTS(serviceHost);
rows = [{}];
editIndex = 0;


function getVoices() {
  var matcher = /^(Microsoft|Amazon) (.+) \((.+?)\)$/;
  return readAloudManifest.tts_engine.voices
    .filter(function(voice) {
      return matcher.test(voice.voice_name);
    })
    .map(function(voice) {
      var match = matcher.exec(voice.voice_name);
      return {
        provider: match[1],
        id: voice.voice_name,
        name: match[3],
        desc: match[3] + " (" + match[2] + ")",
        gender: voice.gender,
        langCode: voice.lang,
        langName: match[2]
      }
    })
}

function getLanguages(voices) {
  var groups = voices.groupBy(function(voice) {
    var tokens = voice.langName.split(/\s+/);
    return tokens[tokens.length-1];
  })
  return Object.keys(groups).sort();
}


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
    voiceId: vg.voice.id,
    ssml: "<speak version=\"1.0\" xml:lang=\"" + vg.voice.langCode + "\">" + groupByProsody(vg.rows).map(prosodyGroupToSSML).join(" ") + "</speak>"
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
  if (row.text) ssml += row.text;
  return ssml;
}


function RemoteTTS(host) {
  var audio;
  this.speak = function(ssmlParts, onEnd) {
    if (!audio) {
      audio = document.createElement("AUDIO");
      audio.src = "sound/silence.mp3";
      audio.play();
    }
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
