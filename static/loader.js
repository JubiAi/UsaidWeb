"use strict";
(function() {
  function load(x, s) {
    return new Promise(function(resolve, reject) {
      console.log("file-loading");

      s.onload = s.onreadystatechange = function() {
        var r = false;

        if (!r && (!this.readyState || this.readyState == "complete")) {
          r = true;
          console.log("file-loading success");
          return resolve();
        }
      };

      s.onerror = function(e) {
        console.log("file-loading failed");
        return reject(e);
      };
      // console.log(s)
      x.appendChild(s);
    });
  }

  async function loadJs(jsUrls) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    var x = document.getElementsByTagName("head")[0];
    try {
      for (
        var _iterator = Object.keys(jsUrls)[Symbol.iterator](), _step;
        !(_iteratorNormalCompletion = (_step = _iterator.next()).done);
        _iteratorNormalCompletion = true
      ) {
        var key = _step.value;

        var _url = jsUrls[key];
        if (!isMyScriptLoaded(_url)) {
          //document.writeln("<script type='text/javascript' src='" + _url + "'></script>");
          var s = document.createElement("script");
          s.type = "text/javascript";
          s.src = _url;
          s.async = true;
          s.defer = true;
          await load(x, s);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }
  function isMyScriptLoaded(url) {
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length; i--; ) {
      if (scripts[i].src == url) return true;
    }
    return false;
  }

  function isMyCssLoaded(url) {
    var scripts = document.getElementsByTagName("link");
    for (var i = scripts.length; i--; ) {
      if (scripts[i].src == url) return true;
    }
    return false;
  }
  async function loadCss(cssUrls) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (
        var _iterator2 = Object.keys(cssUrls)[Symbol.iterator](), _step2;
        !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
        _iteratorNormalCompletion2 = true
      ) {
        var key = _step2.value;

        var _url2 = cssUrls[key];
        if (!isMyCssLoaded(_url2)) {
          var head = document.getElementsByTagName("head")[0];
          var link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = "text/css";
          link.href = _url2;
          link.media = "all";
          link.async = true;
          link.defer = true;
          //head.appendChild(link);
          await load(head, link);
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }
  }
  loadCss({
    bootstrapFont:
      "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css",
    muliFont:
      "https://fonts.googleapis.com/css?family=Muli:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i",
    owl:
      "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.css",
    bootstrap:
      "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    owlTheme:
      "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css",
    // pmTheme: "https://development.jubi.ai/usaidWeb/theme.css"
    pmTheme: "https://development.jubi.ai/usaid/theme.css"
  });
  loadJs({
    crypt:
      "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js",
    jQuery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",
    bootstrap:
      "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js",
    carousel:
      "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js",
    socket:
      "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js",
    responsiveVoice: "https://code.responsivevoice.org/responsivevoice.js",
    nluComponent:
      "https://unpkg.com/compromise@latest/builds/compromise.min.js",
    bundle:
      "https://parramato.com/bot-view/usaidWeb_353553876735/dev/js/bundle.js",
    // bundle: "https://development.jubi.ai/usaid/js/bundle.test.js",
    // jubiEvents: "https://development.jubi.ai/usaidWeb/js/jubievents.js"
    jubiEvents: "https://development.jubi.ai/usaid/js/jubievents.js"
  });
  window.directMultiplier = 1;
  window.fallbackMultiplier = 0.8;
  window.speechOnBrowser = "Hindi Female";
  window.speechGenderBackend = "FEMALE";
  window.speechLanguageCodeBackend = "en-US";
  window.jubiUrl = "https://parramato.com/bot-view/usaidWeb_353553876735/dev/";
  window.jubiModal = {
    // url: "wss://development.jubi.ai/usaidWeb",
    url: 'wss://development.jubi.ai/usaid',
    path: "/socket",
    static: {
      url: window.jubiUrl,
      scripts: {},
      css: {},
      images: {
        logo: "https://parramato.com/bot-view/images/logo.png",
        sendIcon: "https://parramato.com/bot-view/images/icon_send.png",
        sendIconActive:
          "https://parramato.com/bot-view/images/iconRed_send.png",
        loaderBotChat:
          "https://parramato.com/bot-view/images/response-loading.gif",
        // userIcon: "https://development.jubi.ai/usaidWeb/images/rightuser.png",
        "userIcon": "https://development.jubi.ai/usaid/images/rightuser.png",
        // botIcon: "https://development.jubi.ai/usaidWeb/images/botIcon.png",
        "botIcon": "https://development.jubi.ai/usaid/images/botIcon.png",
        logoIcon: "https://parramato.com/bot-view/images/logo-icon.png",
        voiceIcon: "https://parramato.com/bot-view/images/voice.png",
        closeWebView: "https://parramato.com/bot-view/images/closeWebView.png",
        attachment: "https://parramato.com/bot-view/images/attachment.png",
        permissionIcon:
          "https://parramato.com/bot-view/images/parrot_loader.gif"
      },
      text: {
        closeMessage: "",
        headMessage: "Ask me anything."
      }
    }
  };
  window.passphraseMiddleware =
    "YGUYGgyjgblgUGIYGIGkwhbiuashbo98u9283hr9h24rqIYGI932kbidbiadsYE";
  window.voiceEnable = true;
  window.chatPersistence = true;
  window.runOnJubiStartEvent = true;
  window.mainpage =
    '<section class="sec_main" id="jubisecmain" style="display: none;">' +
    "</section>";
  window.leftpanel =
    '<div class="leftPage" id="leftpanel">' +
    '<div class="leftpanelBg">' +
    '<div class="leftpage_opacity">&nbsp;</div>' +
    "</div>" +
    '<div class="leftContent">' +
    "<h2>I am <span>KHUSHI,</span></h2>" +
    "<p>Your trusted friend for all things sexual health.</p>" +
    '<div class="iraImage">' +
    // '<img src="https://development.jubi.ai/usaidWeb/images/khusi.png" class="img-responsive">' +
    '<img src="https://development.jubi.ai/usaid/images/khusi.png" class="img-responsive">' +
    "</div>" +
    "</div>" +
    "</div>";
  window.rightpanel =
    '<div class="rightPage" id="rightpanel">' +
    '<section class="jubi-sec_closeview sonar" id="jubi-secCloseview">' +
    // '<img src="https://development.jubi.ai/usaidWeb/images/khusi.png" id="jubi-closeImage" class="img-responsive">' +
    '<img src="https://development.jubi.ai/usaid/images/khusi.png" id="jubi-closeImage" class="img-responsive">'+
    "</section>" +
    '<div id="jubiAsideFullopenview">' +
    '<section class="jubichatbot" id="jubichatbot" style="display: none;"></section>' +
    "</div>" +
    "</div>";
  window.templateOpenView =
    '<section class="pm-sec_calliframe" id="pm-secIframe"  style="display:none">' +
    '<section class="pm-sec_scroll2 pm-sec_openview" id="pm-mainSec">' +
    '<section id="pm-heading" class="pm-sec_newHeader">' +
    '<div class="headerLeftContent">' +
    '<div class="pm-titleheader" >' +
    '<div class="headerlogoImg">' +
    '<h3>I\'m Khushi</h3><span class="pm-headOnline" >&nbsp;</span>' +
    "</div>" +
    "</div>" +
    "<p>Your trusted guide for all things sexual health!</p>" +
    "</div>" +
    '<div class="headerRightContent">' +
    '<div class="closeBotImg" id="closeBotImg">' +
    // '<img src="https://development.jubi.ai/usaidWeb/images/close.png" class="img-responsive">' +
    '<img src="https://development.jubi.ai/usaid/images/close.png" class="img-responsive">'+
    "</div>" +
    '<aside class="jubi-muteUnmuteVoice">' +
    '<div id="jubi-unmuteVoice">' +
    '<img src="https://development.jubi.ai/usaid/images/unmute.png">' +
    "</div>" +
    '<div id="jubi-muteVoice">' +
    '<img src="https://development.jubi.ai/usaid/images/mute.png">' +
    "</div>" +
    "</aside>" +
    "</div>" +
    "</section>" +
    '<section class="pm-sec_chatbody" id="pm-data" >' +
    '<div class="pm-bxChatbox pm-bxChat chatWindow" id="pm-buttonlock">' +
    "</div>" +
    "</section>" +
    '<div id="jubi-recording-text">' +
    '<p id="jubi-result-text">' +
    '<span class="jubi-grey-text"><span>' +
    "</p>" +
    "</div>" +
    // '<section id="pm-textInput" class="pm-sec_newFooter footer-one" style="float:left;display:none;">' +
    // '<div class="inputArea">' +
    // '<div class="pm-bxform">' +
    // '<div class="pm-bxinput" style="block !important;">' +
    // '<textarea id="pm-answerBottom" placeholder="Type a message here..." style="resize:none;overflow:hidden;" autofocus></textarea>' +
    // '</div>' +
    // '<button id="pm-bottomClick" type="submit" onclick="return false;">' +
    // '<img src="./images/send.png" id="graySend" class="img-responsive" style="display: block;">' +
    // '</button>' +
    // '<div class="uploadbox" style="display:none !important">' +
    // '<label>' +
    // '<div class="inputfile" style="display:none !important;">' +
    // '<img src="https://parramato.com/bot-view/images/attachment.png" class="img-responsive">' +
    // '<input class="jubi-file-upload" type="file" name="fileName" >' +
    // '</div>' +
    // '<div class="button-section" style="display:none">' +
    // '<button type="submit">Submit</button>' +
    // '</div>' +
    // '</label>' +
    // '</div>' +
    // '</div>' +
    // '</div>' +

    // '<div class="jubi-new_copyright" id="jubi-new_copyright">' +
    // 'Powered by <a href="https://www.jubi.ai/" target="_blank">jubi.ai</a>' +
    // ' </div>' +
    // '</section> ' +

    '<section id="jubi-textInput" class="jubi-sec_newFooter footer-two" style="float:left;">' +
    '<section class="artMenu">' +
    '<section class="secMenucontent-widget" id="secMenucontent-widget" >' +
    '<section class="sec_dropdown">' +
    // '<div class="closeBtn"><img src="https://development.jubi.ai/usaidWeb/images/close_icon.png"></i></div>' +
    '<div class="closeBtn"><img src="https://development.jubi.ai/usaid/images/close_icon.png"></i></div>' +
    "<h3>Menu</h3>" +
    "<ul>" +
    '<li class="jubi-menu-val" onclick="window.askBot(\'Start Over\')"><p>Start Over</p></li>' +
    '<li class="jubi-menu-val" onclick="window.askBot(\'Main menu\')"><p>Main menu</p></li>' +
    // '<li class="jubi-menu-val" onclick="window.askBot(\'Buy Condom\')"><p>Buy Condom</p></li>'+
    '<li class="jubi-menu-val"><p><a href="http://www.buymecondom.com/" target="_blank">Buy Condom</a></p></li>' +
    '<li class="jubi-menu-val" onclick="window.askBot(\'Speak to a counsellor\')"><p>Speak to a counsellor</p></li>' +
    '<li class="jubi-menu-val" onclick="window.askBot(\'Cancel Conversation\')"><p>Cancel Conversation</p></li>' +
    "</ul>" +
    "</section>" +
    // '<div class="trianglearrow"><img src="https://development.jubi.ai/usaidWeb/images/triangledown.png" class="img-responsive"></div>' +
    '<div class="trianglearrow"><img src="https://development.jubi.ai/usaid/images/triangledown.png" class="img-responsive"></div>' +
    "</section>" +
    // '<div class="iconMenu"><img src="https://development.jubi.ai/usaidWeb/images/menu.png"></div>' +
    '<div class="iconMenu"><img src="https://development.jubi.ai/usaid/images/menu.png"></div>' +
    "</section>" +
    '<div class="voice-buttons" id="voice-buttons">' +
    '<div class="voicePulse" id="button-stop-ws">' +
    '<div class="sk-three-bounce">' +
    '<div class="sk-child sk-bounce1"></div>' +
    '<div class="sk-child sk-bounce2"></div>' +
    '<div class="sk-child sk-bounce3"></div>' +
    "</div>" +
    '<div class="stop-recording">Listening...</div>' +
    "</div>" +
    "</div>" +
    '<div class="jubi-bxinput" id="jubi-bxinput">' +
    '<textarea id="jubi-answerBottom" placeholder="Type a message here..." style="resize:none;overflow:hidden;" autofocus></textarea> ' +
    "</div>" +
    '<div class="datasendButtons">' +
    '<div class="sendIcon" id="button-send">' +
    '<button id="jubi-bottomClick" type="submit" onclick="return false;">' +
    // '<img src="https://development.jubi.ai/usaidWeb/images/send.png" id="jubi-graySend" class="img-responsive" style="display: block;">' +
    '<img src="https://development.jubi.ai/usaid/images/send.png" id="jubi-graySend" class="img-responsive" style="display: block;">' +
    '<img src="https://parramato.com/bot-view/images/iconRed_send.png" id="jubi-redSend" class="img-responsive" style="display: none;">' +
    "</button>" +
    "</div>" +
    '<div class="voiceIcon" id="button-play-ws">' +
    '<img src="https://parramato.com/bot-view/images/voice.png" class="img-fluid">' +
    "</div>" +
    '<div class="uploadbox" style="display:none !important">' +
    "<label>" +
    '<div class="inputfile" style="display:none !important;">' +
    '<img src="https://parramato.com/bot-view/images/attachment.png" class="img-responsive">' +
    '<input class="jubi-file-upload" type="file" name="fileName" >' +
    "</div>" +
    '<div class="button-section" style="display:none">' +
    '<button type="submit">Submit</button>' +
    "</div>" +
    "</label>" +
    "</div>" +
    '<div class="keyboard-icon" id="keyboard-icon">' +
    '<i class="fa fa-keyboard-o" aria-hidden="true"></i>' +
    "</div>" +
    "</div>" +
    "</section>" +
    '<div class="jubi-new_copyright" id="jubi-new_copyright">' +
    'Powered by <a href="https://www.jubi.ai/" target="_blank">jubi.ai</a>' +
    " </div>" +
    "</section>" +
    "</section>";
  window.loadPermissionView =
    '<section id="pm-permission-view" style="display:none" >' +
    '<section id="pm-heading" class="pm-sec_newHeader">' +
    '<div class="pm-titleheader" >' +
    "<h3>" +
    '<img src="https://parramato.com/bot-view/images/logo-icon.png" class="img-responsive"><span class="pm-headOnline" >&nbsp;</span>' +
    "</h3>" +
    "</div>" +
    "<p>Ask me anything.</p>" +
    "</section>" +
    '<section class="pm-sec_show_option_on_start" id="pm-sec_show_option_on_start" style="display:block">' +
    '<div class="chatProceed" id="chatProceed">' +
    '<div class="chatProceed-botimg">' +
    // '<img src="https://development.jubi.ai/usaidWeb/images/khusi.png" class="img-responsive">' +
    '<img src="https://development.jubi.ai/usaid/images/khusi.png" class="img-responsive">' +
    "</div>" +
    "<p>Welcome back! Let us begin...</p>" +
    "<ul>" +
    "<li>" +
    '<a href="javascript:void(0)" id="jubi-continue-storage" >Continue from where we left</a>' +
    "</li>" +
    "<li>" +
    '<a href="javascript:void(0)" id="jubi-start-fresh">Start fresh</a>' +
    "</li>" +
    "</ul>" +
    "</div>" +
    "</section>" +
    "</section>";
})();
