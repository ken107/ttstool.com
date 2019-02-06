polyfills();

serviceHost = "https://support.lsdsoftware.com";
googleServiceUrl = "https://texttospeech.googleapis.com/v1beta1";

langMap = {
  "da": "Danish",
  "de": "German",
  "en-AU": "Australian English",
  "en-GB": "British English",
  "en-US": "US English",
  "en": "English",
  "fr-CA": "Canadian French",
  "fr": "French",
  "it": "Italian",
  "ja": "Japanese",
  "ko": "Korean",
  "nl": "Dutch",
  "pl": "Polish",
  "pt-BR": "Brazilian Portuguese",
  "pt": "Portuguese",
  "ru": "Russian",
  "sk": "Slovak",
  "sv": "Swedish",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "es": "Spanish",
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
