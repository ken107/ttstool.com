polyfills();

const queryString = parseQueryString();
const errors = {
  WRONG_PASS: "Wrong username or password",
  EXCEPTION: "Exception, check console",
  UNAUTHORIZED: "Session expired, please login again",
}

serviceHost = "https://support.readaloud.app";
googleServiceUrl = "https://texttospeech.googleapis.com/v1beta1";

const allLanguages = [
  ["bo", "Boro", "बड़"],
  ["aa", "Afar", "Afar"],
  ["ab", "Abkhazian", "Аҧсуа"],
  ["af", "Afrikaans", "Afrikaans"],
  ["ak", "Akan", "Akana"],
  ["als", "Alemannic", "Alemannisch"],
  ["am", "Amharic", "አማርኛ"],
  ["an", "Aragonese", "Aragonés"],
  ["ang", "Angal", "Angal Heneng"],
  ["ang", "Anglo-Saxon / Old English", "Englisc"],
  ["ar", "Arabic", "العربية"],
  ["arc", "Aramaic", "ܣܘܪܬ"],
  ["as", "Assamese", "অসমীয়া"],
  ["ast", "Asturian", "Asturianu"],
  ["av", "Avar", "Авар"],
  ["awa", "Awadhi", "Awadhi"],
  ["ay", "Aymara", "Aymar"],
  ["az", "Azerbaijani", "Azərbaycanca / آذربايجان"],
  ["ba", "Bashkir", "Башҡорт"],
  ["bar", "Bavarian", "Boarisch"],
  ["bat-smg", "Samogitian", "Žemaitėška"],
  ["bcl", "Bikol", "Bikol Central"],
  ["be", "Belarusian", "Беларуская"],
  ["be-x-old", "Belarusian (Taraškievica)", "Беларуская (тарашкевіца)"],
  ["bg", "Bulgarian", "Български"],
  ["bh", "Bihari", "भोजपुरी"],
  ["bi", "Bislama", "Bislama"],
  ["bm", "Bambara", "Bamanankan"],
  ["bn", "Bengali", "বাংলা"],
  ["bo", "Tibetan", "བོད་ཡིག / Bod skad"],
  ["bpy", "Bishnupriya Manipuri", "ইমার ঠার/বিষ্ণুপ্রিয়া মণিপুরী"],
  ["br", "Breton", "Brezhoneg"],
  ["bs", "Bosnian", "Bosanski"],
  ["bug", "Buginese", "ᨅᨔ ᨕᨘᨁᨗ / Basa Ugi"],
  ["bxr", "Buriat (Russia)", "Буряад хэлэн"],
  ["ca", "Catalan", "Català"],
  ["cdo", "Min Dong Chinese", "Mìng-dĕ̤ng-ngṳ̄ / 閩東語"],
  ["ce", "Chechen", "Нохчийн"],
  ["ceb", "Cebuano", "Sinugboanong Binisaya"],
  ["ch", "Chamorro", "Chamoru"],
  ["cho", "Choctaw", "Choctaw"],
  ["chr", "Cherokee", "ᏣᎳᎩ"],
  ["chy", "Cheyenne", "Tsetsêhestâhese"],
  ["ckb", "Kurdish (Sorani)", "کوردی"],
  ["co", "Corsican", "Corsu"],
  ["cr", "Cree", "Nehiyaw"],
  ["cs", "Czech", "Česky"],
  ["csb", "Kashubian", "Kaszëbsczi"],
  ["cu", "Old Church Slavonic / Old Bulgarian", "словѣньскъ / slověnĭskŭ"],
  ["cv", "Chuvash", "Чăваш"],
  ["cy", "Welsh", "Cymraeg"],
  ["da", "Danish", "Dansk"],
  ["de", "German", "Deutsch"],
  ["diq", "Dimli", "Zazaki"],
  ["dsb", "Lower Sorbian", "Dolnoserbski"],
  ["dv", "Divehi", "ދިވެހިބަސް"],
  ["dz", "Dzongkha", "ཇོང་ཁ"],
  ["ee", "Ewe", "Ɛʋɛ"],
  ["el", "Greek", "Ελληνικά"],
  ["en", "English", "English"],
  ["eo", "Esperanto", "Esperanto"],
  ["es", "Spanish", "Español"],
  ["et", "Estonian", "Eesti"],
  ["eu", "Basque", "Euskara"],
  ["ext", "Extremaduran", "Estremeñu"],
  ["fa", "Persian", "فارسی"],
  ["ff", "Peul", "Fulfulde"],
  ["fi", "Finnish", "Suomi"],
  ["fiu-vro", "Võro", "Võro"],
  ["fj", "Fijian", "Na Vosa Vakaviti"],
  ["fo", "Faroese", "Føroyskt"],
  ["fr", "French", "Français"],
  ["frp", "Arpitan / Franco-Provençal", "Arpitan / francoprovençal"],
  ["fur", "Friulian", "Furlan"],
  ["fy", "West Frisian", "Frysk"],
  ["ga", "Irish", "Gaeilge"],
  ["gan", "Gan Chinese", "贛語"],
  ["gbm", "Garhwali", "गढ़वळी"],
  ["gd", "Scottish Gaelic", "Gàidhlig"],
  ["gil", "Gilbertese", "Taetae ni kiribati"],
  ["gl", "Galician", "Galego"],
  ["gn", "Guarani", "Avañe'ẽ"],
  ["got", "Gothic", "gutisk"],
  ["gu", "Gujarati", "ગુજરાતી"],
  ["gv", "Manx", "Gaelg"],
  ["ha", "Hausa", "هَوُسَ"],
  ["hak", "Hakka Chinese", "客家語/Hak-kâ-ngî"],
  ["haw", "Hawaiian", "Hawai`i"],
  ["he", "Hebrew", "עברית"],
  ["hi", "Hindi", "हिन्दी"],
  ["ho", "Hiri Motu", "Hiri Motu"],
  ["hr", "Croatian", "Hrvatski"],
  ["ht", "Haitian", "Krèyol ayisyen"],
  ["hu", "Hungarian", "Magyar"],
  ["hy", "Armenian", "Հայերեն"],
  ["hz", "Herero", "Otsiherero"],
  ["ia", "Interlingua", "Interlingua"],
  ["id", "Indonesian", "Bahasa Indonesia"],
  ["ie", "Interlingue", "Interlingue"],
  ["ig", "Igbo", "Igbo"],
  ["ii", "Sichuan Yi", "ꆇꉙ / 四川彝语"],
  ["ik", "Inupiak", "Iñupiak"],
  ["ilo", "Ilokano", "Ilokano"],
  ["inh", "Ingush", "ГӀалгӀай"],
  ["io", "Ido", "Ido"],
  ["is", "Icelandic", "Íslenska"],
  ["it", "Italian", "Italiano"],
  ["iu", "Inuktitut", "ᐃᓄᒃᑎᑐᑦ"],
  ["ja", "Japanese", "日本語"],
  ["jbo", "Lojban", "Lojban"],
  ["jv", "Javanese", "Basa Jawa"],
  ["ka", "Georgian", "ქართული"],
  ["kg", "Kongo", "KiKongo"],
  ["ki", "Kikuyu", "Gĩkũyũ"],
  ["kj", "Kuanyama", "Kuanyama"],
  ["kk", "Kazakh", "Қазақша"],
  ["kl", "Greenlandic", "Kalaallisut"],
  ["km", "Cambodian", "ភាសាខ្មែរ"],
  ["kn", "Kannada", "ಕನ್ನಡ"],
  ["khw", "Khowar", "کھوار"],
  ["ko", "Korean", "한국어"],
  ["kr", "Kanuri", "Kanuri"],
  ["ks", "Kashmiri", "कश्मीरी / كشميري"],
  ["ksh", "Ripuarian", "Ripoarisch"],
  ["ku", "Kurdish (Kurmanji)", "Kurdî"],
  ["kv", "Komi", "Коми"],
  ["kw", "Cornish", "Kernewek"],
  ["ky", "Kirghiz", "Kırgızca / Кыргызча"],
  ["la", "Latin", "Latina"],
  ["lad", "Ladino / Judeo-Spanish", "Dzhudezmo / Djudeo-Espanyol"],
  ["lan", "Lango", "Leb Lango / Luo"],
  ["lb", "Luxembourgish", "Lëtzebuergesch"],
  ["lg", "Ganda", "Luganda"],
  ["li", "Limburgian", "Limburgs"],
  ["lij", "Ligurian", "Líguru"],
  ["lmo", "Lombard", "Lumbaart"],
  ["ln", "Lingala", "Lingála"],
  ["lo", "Laotian", "ລາວ / Pha xa lao"],
  ["lzz", "Laz", "Lazuri / ლაზური"],
  ["lt", "Lithuanian", "Lietuvių"],
  ["lv", "Latvian", "Latviešu"],
  ["map-bms", "Banyumasan", "Basa Banyumasan"],
  ["mg", "Malagasy", "Malagasy"],
  ["man", "Mandarin", "官話/官话"],
  ["mh", "Marshallese", "Kajin Majel / Ebon"],
  ["mi", "Maori", "Māori"],
  ["min", "Minangkabau", "Minangkabau"],
  ["mk", "Macedonian", "Македонски"],
  ["ml", "Malayalam", "മലയാളം"],
  ["mn", "Mongolian", "Монгол"],
  ["mo", "Moldovan", "Moldovenească"],
  ["mr", "Marathi", "मराठी"],
  ["mrh", "Mara", "Mara"],
  ["ms", "Malay", "Bahasa Melayu"],
  ["mt", "Maltese", "bil-Malti"],
  ["mus", "Creek / Muskogee", "Mvskoke"],
  ["mwl", "Mirandese", "Mirandés"],
  ["my", "Burmese", "Myanmasa"],
  ["na", "Nauruan", "Dorerin Naoero"],
  ["nah", "Nahuatl", "Nahuatl"],
  ["nap", "Neapolitan", "Nnapulitano"],
  ["nd", "North Ndebele", "Sindebele"],
  ["nds", "Low German / Low Saxon", "Plattdüütsch"],
  ["nds-nl", "Dutch Low Saxon", "Nedersaksisch"],
  ["ne", "Nepali", "नेपाली"],
  ["new", "Newar", "नेपालभाषा / Newah Bhaye"],
  ["ng", "Ndonga", "Oshiwambo"],
  ["nl", "Dutch", "Nederlands"],
  ["nn", "Norwegian Nynorsk", "Norsk (nynorsk)"],
  ["no", "Norwegian", "Norsk (bokmål / riksmål)"],
  ["nr", "South Ndebele", "isiNdebele"],
  ["nso", "Northern Sotho", "Sesotho sa Leboa / Sepedi"],
  ["nrm", "Norman", "Nouormand / Normaund"],
  ["nv", "Navajo", "Diné bizaad"],
  ["ny", "Chichewa", "Chi-Chewa"],
  ["oc", "Occitan", "Occitan"],
  ["oj", "Ojibwa", "ᐊᓂᔑᓈᐯᒧᐎᓐ / Anishinaabemowin"],
  ["om", "Oromo", "Oromoo"],
  ["or", "Oriya", "ଓଡ଼ିଆ"],
  ["os", "Ossetian / Ossetic", "Иронау"],
  ["pa", "Panjabi / Punjabi", "ਪੰਜਾਬੀ / पंजाबी / پنجابي"],
  ["pag", "Pangasinan", "Pangasinan"],
  ["pam", "Kapampangan", "Kapampangan"],
  ["pap", "Papiamentu", "Papiamentu"],
  ["pdc", "Pennsylvania German", "Deitsch"],
  ["pi", "Pali", "Pāli / पाऴि"],
  ["pih", "Norfolk", "Norfuk"],
  ["pl", "Polish", "Polski"],
  ["pms", "Piedmontese", "Piemontèis"],
  ["ps", "Pashto", "پښتو"],
  ["pt", "Portuguese", "Português"],
  ["qu", "Quechua", "Runa Simi"],
  ["rm", "Raeto Romance", "Rumantsch"],
  ["rmy", "Romani", "Romani / रोमानी"],
  ["rn", "Kirundi", "Kirundi"],
  ["ro", "Romanian", "Română"],
  ["roa-rup", "Aromanian", "Armâneashti"],
  ["ru", "Russian", "Русский"],
  ["rw", "Rwandi", "Kinyarwandi"],
  ["sa", "Sanskrit", "संस्कृतम्"],
  ["sc", "Sardinian", "Sardu"],
  ["scn", "Sicilian", "Sicilianu"],
  ["sco", "Scots", "Scots"],
  ["sd", "Sindhi", "सिनधि"],
  ["se", "Northern Sami", "Davvisámegiella"],
  ["sg", "Sango", "Sängö"],
  ["sh", "Serbo-Croatian", "Srpskohrvatski / Српскохрватски"],
  ["si", "Sinhalese", "සිංහල"],
  ["sk", "Slovak", "Slovenčina"],
  ["sl", "Slovenian", "Slovenščina"],
  ["sm", "Samoan", "Gagana Samoa"],
  ["sn", "Shona", "chiShona"],
  ["so", "Somalia", "Soomaaliga"],
  ["sq", "Albanian", "Shqip"],
  ["sr", "Serbian", "Српски"],
  ["ss", "Swati", "SiSwati"],
  ["st", "Southern Sotho", "Sesotho"],
  ["su", "Sundanese", "Basa Sunda"],
  ["sv", "Swedish", "Svenska"],
  ["sw", "Swahili", "Kiswahili"],
  ["ta", "Tamil", "தமிழ்"],
  ["te", "Telugu", "తెలుగు"],
  ["tet", "Tetum", "Tetun"],
  ["tg", "Tajik", "Тоҷикӣ"],
  ["th", "Thai", "ไทย / Phasa Thai"],
  ["ti", "Tigrinya", "ትግርኛ"],
  ["tk", "Turkmen", "Туркмен / تركمن"],
  ["tl", "Tagalog", "Tagalog"],
  ["tlh", "Klingon", "tlhIngan-Hol"],
  ["tn", "Tswana", "Setswana"],
  ["to", "Tonga", "Lea Faka-Tonga"],
  ["tpi", "Tok Pisin", "Tok Pisin"],
  ["tr", "Turkish", "Türkçe"],
  ["ts", "Tsonga", "Xitsonga"],
  ["tt", "Tatar", "Tatarça"],
  ["tum", "Tumbuka", "chiTumbuka"],
  ["tw", "Twi", "Twi"],
  ["ty", "Tahitian", "Reo Mā`ohi"],
  ["udm", "Udmurt", "Удмурт кыл"],
  ["ug", "Uyghur", "Uyƣurqə / ئۇيغۇرچە"],
  ["uk", "Ukrainian", "Українська"],
  ["ur", "Urdu", "اردو"],
  ["uz", "Uzbek", "Ўзбек"],
  ["uz_AF", "Uzbeki Afghanistan", "اوزبیکی"],
  ["ve", "Venda", "Tshivenḓa"],
  ["vi", "Vietnamese", "Việtnam"],
  ["vec", "Venetian", "Vèneto"],
  ["vls", "West Flemish", "West-Vlaoms"],
  ["vo", "Volapük", "Volapük"],
  ["wa", "Walloon", "Walon"],
  ["war", "Waray / Samar-Leyte Visayan", "Winaray / Binisaya Lineyte-Samarnon"],
  ["wo", "Wolof", "Wollof"],
  ["xal", "Kalmyk", "Хальмг"],
  ["xh", "Xhosa", "isiXhosa"],
  ["xmf", "Megrelian", "მარგალური"],
  ["yi", "Yiddish", "ייִדיש"],
  ["yo", "Yoruba", "Yorùbá"],
  ["za", "Zhuang", "Cuengh / Tôô / 壮语"],
  ["zh", "Chinese", "中文"],
  ["zh-classical", "Classical Chinese", "文言"],
  ["zh-min-nan", "Minnan", "Bân-lâm-gú"],
  ["zh-yue", "Cantonese", "粵語 / 粤语"],
  ["zu", "Zulu", "isiZulu"],
  ["nb", "Norwegian Bokmål", "Norsk (bokmål)"],
  ["zh-tw", "Traditional Chinese", "‪中文(台灣)‬"],
]

langMap = allLanguages.groupBy(x => x[0], x => x[2])


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

function parseQueryString() {
    const query = {};
    if (location.search) {
        const tuples = location.search.substr(1).split('&');
        for (let i=0; i<tuples.length; i++) {
                const pair = tuples[i].split('=', 2);
                if (pair.length == 2) query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1].replace(/\+/g, '%20'));
                else if (pair.length == 1) query[decodeURIComponent(pair[0])] = true;
        }
    }
    return query;
}

function loadComponents(url) {
    $("<div>").load(url, function() {
        $(this).children().each(function() {
            var className = $(this).data("class")
            dataBinder.views[className] = {template: this, controller: window[className]}
        })
    })
}

function toggleClass(el, isOn, onClass, offClass) {
  if (onClass) el.classList.toggle(onClass, isOn)
  if (offClass) el.classList.toggle(offClass, !isOn)
}


darkMode = localStorage.getItem('darkMode') === 'true';

function toggleDarkMode() {
  localStorage.setItem('darkMode', darkMode = !darkMode);
}
