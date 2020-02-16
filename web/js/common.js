polyfills();

serviceHost = "https://support.readaloud.app";
googleServiceUrl = "https://texttospeech.googleapis.com/v1beta1";

langMap = {
  "ar": "Arabic",
  "cmn": "Mandarin",
  "cs": "Czech",
  "da": "Danish",
  "de": "German",
  "el": "Greek",
  "en-IN": "English (Indian)",
  "en-AU": "English (Australian)",
  "en-GB": "English (British)",
  "en-US": "English (US)",
  "en": "English",
  "es": "Spanish",
  "fi": "Finnish",
  "fil": "Filipino",
  "fr-CA": "French (Canadian)",
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
  "pt-BR": "Portuguese (Brazilian)",
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

  if (!Promise.prototype.finally) {
    Object.defineProperty(Promise.prototype, 'finally', {
      value: function(callback) {
        var promise = this;
        function chain() {
          return Promise.resolve(callback()).then(function() {return promise});
        }
        return promise.then(chain, chain);
      },
      configurable: true,
      writable: true
    })
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

function clearCookie(name) {
  setCookie(name, "", -1);
}
