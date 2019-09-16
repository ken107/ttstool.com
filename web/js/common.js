polyfills();

serviceHost = "https://support.lsdsoftware.com";
googleServiceUrl = "https://texttospeech.googleapis.com/v1beta1";

langMap = {
  "ar": "Arabic",
  "cmn": "Mandarin",
  "cs": "Czech",
  "da": "Danish",
  "de": "German",
  "el": "Greek",
  "en-AU": "Australian English",
  "en-GB": "British English",
  "en-US": "US English",
  "en": "English",
  "es": "Spanish",
  "fi": "Finnish",
  "fil": "Filipino",
  "fr-CA": "Canadian French",
  "fr": "French",
  "hi": "Hindi",
  "hu": "Hungarian",
  "id": "Indonesian",
  "it": "Italian",
  "ja": "Japanese",
  "ko": "Korean",
  "nb": "Norwegian",
  "nl": "Dutch",
  "pl": "Polish",
  "pt-BR": "Brazilian Portuguese",
  "pt": "Portuguese",
  "ru": "Russian",
  "sk": "Slovak",
  "sv": "Swedish",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "vi": "Vietnamese",
}


function polyfills() {
  Array.prototype.groupBy = function(keySelector, valueSelector) {
    var result = {};
    for (var i=0; i<this.length; i++) result[keySelector(this[i])] = (valueSelector ? valueSelector(this[i]) : this[i]);
    return result;
  }
}

function $ajax(opts) {
  return new Promise(function(fulfill, reject) {
    $.ajax($.extend({
      success: fulfill,
      error: function(xhr, textStatus, errorThrown) {
        reject(new Error(xhr.responseText || errorThrown || textStatus));
      }
    }, opts))
  })
}

function getCookie(name) {
	if (document.cookie.length > 0) {
		var start = document.cookie.indexOf(name + "=");
		if (start != -1) {
			start += name.length + 1;
			var end = document.cookie.indexOf(";", start);
			if (end == -1) {
				end = document.cookie.length;
			}
			return unescape(document.cookie.substring(start, end));
		}
	}
	return "";
}

function setCookie(name, value, expiredays) {
	if (expiredays == null) {
		document.cookie = name + "=" + escape(value) + "; path=/";
	}
	else {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + expiredays);
		document.cookie = name + "=" + escape(value) + "; path=/" + "; expires=" + exdate.toGMTString();
	}
}
