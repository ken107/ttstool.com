
page = 0;
accessKeyId = getCookie("accessKeyId");
secretAccessKey = getCookie("secretAccessKey");
region = "us-east-1";
rememberMe = !!accessKeyId;
polly = null;
voiceList = null;
languageList = null;
filteredVoiceList = null;
selectedEngine = null;
selectedLanguage = null;
selectedVoice = null;
selectedText = null;
selectedFormat = null;
last = {};
progress = 0;
error = null;
audioUrl = null;
filename = null;
totalChars = 0;

loadComponents("components.html")


function onSubmit0($accessKeyId, $secretAccessKey, $rememberMe) {
  if (rememberMe && !$rememberMe) {
    clearCookie("accessKeyId");
    clearCookie("secretAccessKey");
    alert("INFO: Keys have been removed from storage");
  }
  if (!$accessKeyId || !$secretAccessKey) return error = {message: "Please enter access keys"};
  error = null;
  progress++;
  testKeys($accessKeyId, $secretAccessKey)
    .then(() => {
      accessKeyId = $accessKeyId;
      secretAccessKey = $secretAccessKey;
      if ($rememberMe) {
        setCookie("accessKeyId", accessKeyId, 7);
        setCookie("secretAccessKey", secretAccessKey, 7);
      }
      polly = new AWS.Polly({accessKeyId, secretAccessKey, region})
      page = 1;
    })
    .catch(err => error = err)
    .finally(() => progress--)
}

function testKeys($accessKeyId, $secretAccessKey) {
  var polly = new AWS.Polly({
      accessKeyId: $accessKeyId,
      secretAccessKey: $secretAccessKey,
      region
    })
  return polly.describeVoices({
      Engine: "standard",
      LanguageCode: "en-US"
    })
    .promise()
}

function loadVoiceList() {
  if (!selectedEngine) return voiceList = null;
  error = null;
  progress++;
  polly.describeVoices({
      Engine: selectedEngine
    })
    .promise()
    .then(data => {
      voiceList = data.Voices.map(item => {
        return {
          id: item.Id,
          name: item.Name + " (" + item.Gender.charAt(0) + ")",
          language: {code: item.LanguageCode, name: item.LanguageName},
        }
      })
    })
    .catch(err => error = err)
    .finally(() => progress--)
}

function loadLanguageList() {
  if (!voiceList) return languageList = null;
  var dedupe = {};
  languageList = voiceList.map(voice => voice.language)
    .filter(language => {
      if (dedupe[language.code]) return false;
      return dedupe[language.code] = true;
    })
}

function filterVoiceList() {
  if (!voiceList || !selectedLanguage) return filteredVoiceList = null;
  filteredVoiceList = voiceList.filter(voice => voice.language.code == selectedLanguage);
}

function onSubmit1() {
  var text = selectedText.trim();
  if (selectedVoice == last.selectedVoice && text == last.selectedText && selectedFormat == last.selectedFormat) return;
  audioUrl = null;
  filename = null;
  error = null;
  progress++;
  polly.synthesizeSpeech({
      OutputFormat: selectedFormat,
      TextType: text.startsWith("<") ? "ssml" : "text",
      Text: text,
      VoiceId: selectedVoice,
      Engine: selectedEngine,
    })
    .promise()
    .then(data => {
      audioUrl = URL.createObjectURL(new Blob([data.AudioStream], {type: data.ContentType}));
      filename = getFilename(selectedFormat);
      totalChars += removeTags(text).length;
      last.selectedVoice = selectedVoice;
      last.selectedText = text;
      last.selectedFormat = selectedFormat;
    })
    .catch(err => error = err)
    .finally(() => progress--)
}

function getFilename(format) {
  var d = new Date();
  var name = d.getFullYear() + "-" + twoD(d.getMonth()+1) + "-" + twoD(d.getDate()) + " " + twoD(d.getHours()) + "-" + twoD(d.getMinutes()) + "-" + twoD(d.getSeconds());
  switch (format) {
    case "ogg_vorbis": return name + ".ogg";
    case "mp3": return name + ".mp3";
    default: return name;
  }
}

function twoD(n) {
  return n < 10 ? '0' + n : n;
}

function removeTags(text) {
  return text.replace(/<.*?>/g, '');
}
