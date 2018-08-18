
allVoices = getVoices();
voice = null;
tts = new RemoteTTS(serviceHost);
validator = new XMLValidator();


function getVoices() {
  var matcher = /^(Microsoft|Amazon) (.+) \((.+?)\)$/;
  return readAloudManifest.tts_engine.voices
    .filter(function(voice) {
      return matcher.test(voice.voice_name);
    })
}

function setPlaceholder(textArea, lang) {
  $(textArea).val('<speak version="1.0" xml:lang="' + lang + '">\n\n\n</speak>');
}


function playAll(isDownload) {
  var text = $(".editor > textarea").val();
  try {
    validator.validate(text);
    if (isDownload) tts.download(text, voice.lang, voice.voice_name);
    else tts.speak(text, voice.lang, voice.voice_name);
  }
  catch (err) {
    $(".error").stop().show().delay(3000).fadeOut();
  }
}


function RemoteTTS(host) {
  var audio;
  this.speak = function(text, lang, voiceName) {
    if (!audio) audio = document.createElement("AUDIO");
    audio.pause();
    audio.src = host + "/read-aloud/speak/" + lang + "/" + encodeURIComponent(voiceName) + "?ssml=" + encodeURIComponent(text);
    audio.play();
  }
  this.download = function(text, lang, voiceName) {
    window.open(host + "/read-aloud/speak/" + lang + "/" + encodeURIComponent(voiceName) + "?ssml=" + encodeURIComponent(text), "_blank");
  }
}


function XMLValidator() {
  var xt = "",
    h3OK = 1

  function checkErrorXML(x) {
    xt = ""
    h3OK = 1
    checkXML(x)
  }

  function checkXML(n) {
    var l, i, nam
    nam = n.nodeName
    if (nam == "h3") {
      if (h3OK == 0) {
        return;
      }
      h3OK = 0
    }
    if (nam == "#text") {
      xt = xt + n.nodeValue + "\n"
    }
    l = n.childNodes.length
    for (i = 0; i < l; i++) {
      checkXML(n.childNodes[i])
    }
  }

  this.validate = function(txt) {
    // code for IE
    if (window.ActiveXObject) {
      var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = "false";
      xmlDoc.loadXML(txt);

      if (xmlDoc.parseError.errorCode != 0) {
        txt = "Error Code: " + xmlDoc.parseError.errorCode + "\n";
        txt = txt + "Error Reason: " + xmlDoc.parseError.reason;
        txt = txt + "Error Line: " + xmlDoc.parseError.line;
        throw new Error(txt);
      }
    }
    // code for Mozilla, Firefox, Opera, etc.
    else if (document.implementation.createDocument) {
      var parser = new DOMParser();
      var text = txt;
      var xmlDoc = parser.parseFromString(text, "text/xml");

      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        checkErrorXML(xmlDoc.getElementsByTagName("parsererror")[0]);
        throw new Error(xt);
      }
    }
  }
}
