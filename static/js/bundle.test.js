(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
                }var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];return o(n || r);
                }, p, p.exports, r, e, n, t);
            }return n[i].exports;
        }for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);return o;
    }return r;
})()({ 1: [function (require, module, exports) {
        // shim for using process in browser
        var process = module.exports = {};

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
            throw new Error('setTimeout has not been defined');
        }
        function defaultClearTimeout() {
            throw new Error('clearTimeout has not been defined');
        }
        (function () {
            try {
                if (typeof setTimeout === 'function') {
                    cachedSetTimeout = setTimeout;
                } else {
                    cachedSetTimeout = defaultSetTimout;
                }
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                if (typeof clearTimeout === 'function') {
                    cachedClearTimeout = clearTimeout;
                } else {
                    cachedClearTimeout = defaultClearTimeout;
                }
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        })();
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) {
                //normal enviroments in sane situations
                return setTimeout(fun, 0);
            }
            // if setTimeout wasn't available but was latter defined
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                cachedSetTimeout = setTimeout;
                return setTimeout(fun, 0);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) {
                //normal enviroments in sane situations
                return clearTimeout(marker);
            }
            // if clearTimeout wasn't available but was latter defined
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                cachedClearTimeout = clearTimeout;
                return clearTimeout(marker);
            }
            try {
                // when when somebody has screwed with setTimeout but no I.E. maddness
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                    // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
            if (!draining || !currentQueue) {
                return;
            }
            draining = false;
            if (currentQueue.length) {
                queue = currentQueue.concat(queue);
            } else {
                queueIndex = -1;
            }
            if (queue.length) {
                drainQueue();
            }
        }

        function drainQueue() {
            if (draining) {
                return;
            }
            var timeout = runTimeout(cleanUpNextTick);
            draining = true;

            var len = queue.length;
            while (len) {
                currentQueue = queue;
                queue = [];
                while (++queueIndex < len) {
                    if (currentQueue) {
                        currentQueue[queueIndex].run();
                    }
                }
                queueIndex = -1;
                len = queue.length;
            }
            currentQueue = null;
            draining = false;
            runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) {
                for (var i = 1; i < arguments.length; i++) {
                    args[i - 1] = arguments[i];
                }
            }
            queue.push(new Item(fun, args));
            if (queue.length === 1 && !draining) {
                runTimeout(drainQueue);
            }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
            this.fun = fun;
            this.array = array;
        }
        Item.prototype.run = function () {
            this.fun.apply(null, this.array);
        };
        process.title = 'browser';
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ''; // empty string to avoid regexp issues
        process.versions = {};

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) {
            return [];
        };

        process.binding = function (name) {
            throw new Error('process.binding is not supported');
        };

        process.cwd = function () {
            return '/';
        };
        process.chdir = function (dir) {
            throw new Error('process.chdir is not supported');
        };
        process.umask = function () {
            return 0;
        };
    }, {}], 2: [function (require, module, exports) {
        (function () {
            //require
            // let BayesClassifier = require('bayes-classifier')
            let bm25 = require('wink-bm25-text-search');
            let nlp = require('wink-nlp-utils');
            let tokenizer = require('string-tokenizer');
            let SentenceTokenizer = require('sentence-tokenizer');
            let stringSimilarity = require('string-similarity');
            let sentTokenizer = new SentenceTokenizer('webBot');
            let chatArray = [];
            let online = true;
            let tags = {};
            let currentButtonContext = {};
            let deviceInfo = {
                display: {
                    width: window.screen.width,
                    height: window.screen.height,
                    availWidth: window.screen.availWidth,
                    availHeight: window.screen.availHeight,
                    colorDepth: window.screen.colorDepth,
                    pixelDepth: window.screen.pixelDepth
                },
                inputType: "text",
                // location:{},
                connectionType: {},
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            function getTime() {
                let d = new Date();
                let hours = d.getHours();
                let ampm = hours >= 12 ? 'pm' : 'am';
                if (hours > 12) {
                    hours = hours - 12;
                }
                let minutes = d.getMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (hours < 10) {
                    hours = '0' + hours;
                }
                return { hours: hours, minutes: minutes, ampm: ampm };
            }

            function utmExtractor(sender) {
                if (sender && sender.includes("-") && !tags.utmExtraction) {
                    let keyValues = sender.split("-");
                    keyValues.map(element => {
                        if (element && element.includes(".") && element.split(".").length == 2) {
                            tags[element.split(".")[0]] = element.split(".")[1];
                        }
                        return "invalid";
                    });
                    tags.utmExtraction = true;
                }
            }
            // if ('geolocation' in navigator) {
            //     navigator.geolocation.getCurrentPosition(function (location) {
            //         appendLocation(location, 'fetched');
            //     });
            //     navigator.geolocation.watchPosition(appendLocation);
            //     function appendLocation(location, verb) {
            //         // //console.log("Location Fetched")
            //         deviceInfo.location=location
            //         deviceInfo.location.verbResponse = verb || 'updated';
            //     }
            // } 

            function getNavConnection() {
                return navigator.connection || navigator.mozConnection || navigator.webkitConnection || navigator.msConnection;
            }
            let info = getNavConnection();
            if (info) {
                info.addEventListener('change', updateNetworkInfo);
                updateNetworkInfo(info);
            }

            function updateNetworkInfo(info) {
                deviceInfo.connectionType = {
                    type: info.type,
                    effectiveType: info.effectiveType,
                    downlinkMax: info.downlinkMax
                };
            }

            let Crypt = function (passphrase) {
                let pass = passphrase;
                let CryptoJSAesJson = {
                    parse: function (jsonStr) {
                        let j = JSON.parse(jsonStr);
                        let cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(j.ct) });
                        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
                        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
                        return cipherParams;
                    },
                    stringify: function (cipherParams) {
                        let j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
                        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
                        if (cipherParams.salt) j.s = cipherParams.salt.toString();
                        return JSON.stringify(j);
                    }
                };

                return {
                    decrypt: function (data) {
                        return JSON.parse(CryptoJS.AES.decrypt(data, pass, { format: CryptoJSAesJson }).toString(CryptoJS.enc.Utf8));
                    },
                    encrypt: function (data) {
                        return CryptoJS.AES.encrypt(JSON.stringify(data), pass, { format: CryptoJSAesJson }).toString();
                    }
                };
            };
            //------start------
    //------CODE------
    let passphrase = 'b51211a9-8132-3d15-abbb-dba36a56d8bd';
    let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
    let intents={"ct":"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","iv":"415deb06c039a003ba5d77863864105e","s":"a2a5c83364303ac3"};
    let entities={"ct":"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","iv":"69325b729b2f19dfd67cee589b955fbb","s":"bc4a3ba3cd170718"};
    let flows={"ct":"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","iv":"3a5cc5072092d365197921443a3f3f6c","s":"c83210cb37ad0f50"};

    let checkUrl='https://parramato.com/check';
    let modal=window.jubiModal;

    let backendUrl='https://parramato.com'
    let backendPath='/socket'
    
    let middlewareUrl = 'https://development.jubi.ai/'
    let middlewarePath = '/usaidWeb/socket'
    let middlewareWebsocket = true
    let middlewareSecurity = false

    let uploadUrl = 'https://parramato.com'
    let uploadPath = '/upload/socket'

    let humanUrl = 'https://parramato.com'
    let humanPath = '/human/socket'

    let voiceUrl = 'https://parramato.com'
    let voicePath = '/voice/socket'

    let directMultiplier=0.8
    let fallbackMultiplier = 0.6

    let timeoutSeconds= 1200


    let strictlyFlow=false;
    let humanAssistSwitch=false;
    let voiceEnabled=true;
    let cookie=false;

    let speechGenderBackend='FEMALE'
    let speechLanguageCodeBackend='en-IN'

    let projectId='Alpha Version_586886576888'
    let attachmentUrl='https://parramato.com/bot-view/images/attachment.png'
    let integrityPassPhrase='hbu8b23478gbuy2bcfy2cbcihsdcgUGUYUuy2bcfy2cbcihsdcYBEBIW'
    let localSavePassPhrase='8rhfuahiuHFIJUHAFIWEHFOw98ehfu9HFjhE234jbhJHbjhbfjebkfewfewjhEUHFUIAlpha Version_586886576888'
    //------CODE------
    //------end------
            //Setup
            //global function and param changes

            if (strictlyFlow) {
                $("#jubi-textInput").hide();
            }
            let channel = "web";
            let crypter = Crypt(passphrase);
            let crypterTransit = Crypt(passphraseTransit);
            let crypterMiddleware = Crypt(window.passphraseMiddleware + integrityPassPhrase);
            let crypterLocal = Crypt(window.passphraseMiddleware + integrityPassPhrase + projectId);
            window.passphraseMiddleware = null;
            const intentDocs = JSON.parse(crypter.decrypt(JSON.stringify(intents)));
            const entityDocs = JSON.parse(crypter.decrypt(JSON.stringify(entities)));
            // const storedClassifier=JSON.parse(crypter.decrypt(JSON.stringify(classifierData)));
            const flowDocs = JSON.parse(crypter.decrypt(JSON.stringify(flows)));
            if (!cookie) {
                clearAllLocalStorageData();
            }
            let user = {};

            let webId = get("id");
            if (webId) {
                webId = webId + "-" + IDGenerator(8);
                utmExtractor(webId);
                clearAllLocalStorageData();
            }
            let readyState = false;
            let thresholdDirect = 0.5;
            let thresholdOptions = 0.2;
            let decorateBotResponse;
            let lastTimestamp;
            let updateWebId;
            function clearAllLocalStorageData() {
                if (window.localStorage) {
                    window.localStorage.setItem(localSavePassPhrase, undefined);
                    window.localStorage.setItem("t_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("user_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("tags_" + localSavePassPhrase, undefined);
                    window.localStorage.setItem("webId_" + localSavePassPhrase, undefined);
                }
            }
            function setLocalStorageData(key, value) {
                if (window.localStorage) {
                    window.localStorage.setItem(key, value);
                }
            }
            function getLocalStorageData(key) {
                return window.localStorage ? window.localStorage.getItem(key) : undefined;
            }
            window.subscriptionForWebId = {
                setCallback: function (callback) {
                    updateWebId = callback;
                },
                getWebId: function () {
                    return webId;
                },
                getState: function () {
                    return readyState;
                }
            };

            (function () {

                try {
                    // //console.log("tags")
                    let encryptedTags = getLocalStorageData("tags_" + localSavePassPhrase);
                    tags = JSON.parse(crypterLocal.decrypt(encryptedTags));
                    // //console.log(tags)
                } catch (e) {
                    // //console.log(e)
                }
                try {
                    // //console.log("tags")
                    let encryptedUser = getLocalStorageData("user_" + localSavePassPhrase);
                    user = JSON.parse(crypterLocal.decrypt(encryptedUser));
                    // //console.log(tags)
                } catch (e) {
                    // //console.log(e)
                }
                if (!webId) {
                    let webIdData = getLocalStorageData("webId_" + localSavePassPhrase);
                    if (webIdData) {
                        try {
                            webIdData = JSON.parse(crypterLocal.decrypt(webIdData));
                            if (webIdData && webIdData.id) {
                                webId = webIdData.id;
                            }
                        } catch (e) {}
                    }
                }
                if (!webId) {
                    webId = IDGenerator(20);
                }
                webId = webId.replace(/ +?/g, '');
                let depth = 0;
                let totalQueries = 0;
                let totalIntents = 0;
                for (let intent of Object.keys(intentDocs)) {
                    totalQueries += intentDocs[intent].length;
                    totalIntents += 1;
                }
                depth = totalQueries / totalIntents;
                thresholdDirect = (1 - Math.tanh(Math.log10(depth + 1) * 0.5)) * directMultiplier;
                thresholdDirect = thresholdDirect > 1 ? 1 : thresholdDirect;
                thresholdOptions = thresholdDirect * fallbackMultiplier;
                //console.log("confidence direct:"+thresholdDirect)
                //console.log("confidence fallback:"+thresholdOptions)
            })();

            let socketHuman;
            let socketUpload;
            let socketVoice;
            let socketBackend;
            let socketMiddleware;
            (() => {
                try {
                    socketHuman = io(humanUrl, {
                        transports: ['websocket'],
                        path: humanPath
                    });
                    socketHuman.on('disconnect', function () {
                        tags.blockBot = undefined;
                        //online=false;
                        // //console.log("Going Offline")
                        //disconnectVoice();
                        // offFunction();
                    });
                    socketHuman.on('connect', function () {
                        //online=true;
                        //onFunction();
                    });
                } catch (e) {
                    socketHuman = { on: () => {}, emit: () => {} };
                }

                try {
                    socketUpload = io(uploadUrl, {
                        transports: ['websocket'],
                        path: uploadPath
                    });
                } catch (e) {
                    socketUpload = { on: () => {}, emit: () => {} };
                }

                try {
                    socketVoice = io(voiceUrl, {
                        transports: ['websocket'],
                        path: voicePath
                    });
                } catch (e) {

                    socketVoice = { on: () => {}, emit: () => {} };
                }

                try {
                    socketBackend = io(backendUrl, {
                        transports: ['websocket'],
                        path: backendPath
                    });

                    if (middlewareWebsocket) {
                        socketMiddleware = io(middlewareUrl, {
                            transports: ['websocket'],
                            path: middlewarePath
                        });
                    } else {
                        socketMiddleware = io(middlewareUrl, {
                            path: middlewarePath
                        });
                    }
                    // //console.log("Separate Backend")
                    socketMiddleware.on('connect', function () {
                        window.socketId = socketMiddleware.id; //
                        online = true;
                        onFunction();
                    });
                } catch (e) {
                    socketBackend = { on: () => {}, emit: () => {} };
                    socketMiddleware = { on: () => {}, emit: () => {} };
                }
            })();

            String.prototype.replaceAll = function (search, replacement) {
                let target = this;
                return target.split(search).join(replacement);
            };
            Element.prototype.remove = function () {
                this.parentElement.removeChild(this);
            };
            NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
                for (let i = this.length - 1; i >= 0; i--) {
                    if (this[i] && this[i].parentElement) {
                        this[i].parentElement.removeChild(this[i]);
                    }
                }
            };
            //Internet On/Off Functions
            function onFunction() {
                $("#offlinebx").hide();
                //console.log("ON:::")
            }
            function offFunction() {
                if (document.getElementById("offlinebx")) {
                    $("#offlinebx").show();
                } else {
                    document.getElementById("pm-mainSec").innerHTML += '<div class="offlinebx" id="offlinebx">' + '<div class="innerofline">' + '<h3>No connection, please refresh or check internet</h3>' + '</div>' + '</div>';
                }
            }
            //Init
            function init() {
                $(document).ready(function () {
                    $("#jubi-chat-loader-app").html(window.mainpage);
                    $("#jubisecmain").html(window.leftpanel + window.rightpanel);
                    $("#jubichatbot").html(window.templateOpenView + window.loadPermissionView);
                    window.mainpage = window.leftpanel = window.rightpanel = window.templateOpenView = window.loadPermissionView = undefined;
                    middleware();
                    setTimeout(() => {
                        $("#jubisecmain").fadeIn(100);
                        $("#jubichatbot").fadeIn(100);
                    }, 500);
                });
            }

            window.jubiChatEventEmitter = data => {
                triggerEvent({
                    senderId: webId,
                    channel: channel,
                    webInformation: deviceInfo,
                    projectId: projectId,
                    data: data,
                    type: "external"
                });
            };

            let triggerCallCount = 0;
            setInterval(() => {
                triggerCallCount = 0;
            }, 1000);

            function rateLimiter(func) {
                if (triggerCallCount < 30) {
                    triggerCallCount++;
                    func();
                } else {
                    //console.log("Too Many requests");
                }
            }

            //Trigger Events
            function triggerEvent(event) {
                rateLimiter(() => {
                    if (online) {
                        let uid = IDGenerator(20);
                        if (window.jubiChatEventListener) {
                            window.jubiChatEventListener(event);
                        }
                        // //console.log("EVENT "+event.type)
                        // //console.log({data:event,webId:webId,requestId:uid})
                        socketBackend.emit("web-event-register", crypterTransit.encrypt(JSON.stringify({ data: event, webId: webId, requestId: uid })));
                        socketBackend.on("web-event-register-" + webId + "-" + uid, () => {});
                    }
                });
            }

            function triggerEventError(event) {
                rateLimiter(() => {
                    if (online) {
                        let uid = IDGenerator(20);
                        //console.log("EVENT ERROR "+event.type)
                        console.log("ERROR", { data: event, webId: webId, requestId: uid });
                        socketBackend.emit("web-event-register-error", crypterTransit.encrypt(JSON.stringify({ data: event, webId: webId, requestId: uid })));
                        socketBackend.on("web-event-register-error-" + webId + "-" + uid, () => {});
                    }
                });
            }

            //Invalidate
            async function invalidate(callbackOption, onlyInvalidateFlag) {
                try {
                    if (!onlyInvalidateFlag) {
                        if (user && user.stages && user.stages.length > 1 && user.tracker < user.stages.length - 1) {
                            let reply = await transform({
                                text: "It has been a while. Cancelled the previous conversation.",
                                type: "text"
                            });
                            decorateBotResponse(reply);
                        }
                    }
                    user.tracker = 0;
                    let cancelFlow = flowDocs["selectemergency"] || flowDocs["selectEmergency"];
                    if (!cancelFlow) {
                        cancelFlow = {
                            stages: [{
                                text: ["Cancelling your current conversation."],
                                stage: "selectfallback",
                                type: "text"
                            }]
                        };
                    }
                    user.stages = cancelFlow.stages;
                    user.stuckCount = 0;
                    user.conversationId = undefined;
                    if (callbackOption) {
                        callbackOption();
                    }
                } catch (e) {
                    // //console.log(e);
                    triggerEventError({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        type: "invalidate-1",
                        error: e
                    });
                }
            }

            function transform(response) {

                if (typeof response == "string") {
                    response = JSON.parse(response);
                }
                function replaceTags(text) {
                    let match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                    return text.replace(match, '');
                }
                function findMatch(str) {
                    let match = /\${(image|file|audio|video)::[^(${|})]+}/g.exec(str);
                    if (match && match.length > 0) {
                        return match;
                    } else {
                        return undefined;
                    }
                }
                function transformMediaOrText(text, i) {
                    if (findMatch(text)) {
                        let match = text.replace('${', '').replace('}', '').split('::');
                        return {
                            id: i,
                            type: match[0],
                            value: match[1]
                        };
                    } else {
                        return {
                            id: i,
                            type: 'text',
                            value: replaceTags(text)
                        };
                    }
                }

                return new Promise((resolve, reject) => {
                    try {
                        if (Array.isArray(response.text) && response.text.length == 1) {
                            response.text = response.text[0];
                        }
                        //extract media
                        let tempStr = response.text;
                        let match = findMatch(tempStr);
                        let mediaFlag = false;
                        let botMessage = [];
                        if (typeof response.text === 'string') {
                            while (match) {
                                response.text = response.text.replace(match[0], '\\n' + match[0] + '\\n');
                                tempStr = tempStr.replace(match[0], '');
                                match = findMatch(tempStr);
                                mediaFlag = true;
                            }
                            // new line
                            response.text = response.text.replaceAll('|break|', '\\n');
                            if (response.text && response.text.includes('\\n')) {
                                response.text = response.text.split('\\n');
                            } else if (response.text && response.text.length > 60 && !mediaFlag) {
                                sentTokenizer.setEntry(response.text);
                                response.text = sentTokenizer.getSentences();
                            }
                        }
                        if (typeof response.text === 'string') {
                            botMessage.push(transformMediaOrText(response.text, 0));
                        } else if (response.text instanceof Array) {
                            let textArray = response.text;
                            for (let i = 0; i < textArray.length; i++) {
                                botMessage.push(transformMediaOrText(textArray[i], i));
                            }
                        }
                        let options = [];
                        currentButtonContext = {};
                        switch (response.type) {
                            case 'button':
                                let sameButton = false;
                                for (let i = 0; i < response.next.data.length; i++) {
                                    options.push({ type: response.next.data[i].type, text: response.next.data[i].text, data: response.next.data[i].data });
                                    if (currentButtonContext[response.next.data[i].text.toLowerCase().trim()]) {
                                        sameButton = true;
                                        currentButtonContext = {};
                                    }
                                    if (!sameButton) {
                                        currentButtonContext[response.next.data[i].text.toLowerCase().trim()] = response.next.data[i].data.toLowerCase().trim();
                                    }
                                }
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'persist-option',
                                    options: options
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            case 'quickReply':
                                for (let i = 0; i < response.next.data.length; i++) {
                                    options.push({ type: response.next.data[i].type, text: response.next.data[i].text, data: response.next.data[i].data });
                                }
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'option',
                                    options: options
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            case 'generic':
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'generic',
                                    options: response.next.data
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").hide(200);
                                }
                                break;
                            default:
                                resolve({
                                    botMessage: botMessage,
                                    answerType: 'text'
                                });
                                if (strictlyFlow) {
                                    $("#jubi-textInput").show(200);
                                }
                                break;
                        }
                    } catch (e) {
                        triggerEventError({
                            senderId: webId,
                            channel: channel,
                            projectId: projectId,
                            type: "transform-1",
                            error: e
                        });
                        // //console.log(e);
                        return reject(e);
                    }
                });
            }

            //Chat Engine
            let ChatEngine = function (callbackOption) {

                let callback = function (data) {
                    // //console.log("no callback")
                    // //console.log(data)
                };

                if (callbackOption) {
                    callback = callbackOption;
                }

                async function runOnNotification(data) {
                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) {}
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    // //console.log(data)
                    // //console.log("Web-External")
                    let reply = await transform({
                        text: data.text,
                        type: data.type,
                        next: data.next
                    });
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: {
                            text: data.text,
                            type: data.type,
                            next: data.next
                        },
                        type: "notification"
                    });
                    socketHuman.emit("preHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        type: "pre",
                        reply: {
                            text: data.text,
                            type: data.type,
                            next: data.next
                        }
                    });
                    callback(reply);
                }

                function pre(requestedStage) {
                    return new Promise(function (resolve, reject) {
                        if (!online) {
                            return reject({ status: "offline" });
                        }
                        let uid = IDGenerator(20);
                        requestedStage.webId = webId;
                        requestedStage.requestId = uid;
                        if (tags.blockBot) {
                            requestedStage.tags.blockBot = true;
                        }
                        requestedStage.tags = tags;
                        if (middlewareSecurity) {
                            socketMiddleware.emit("web-pre", crypterMiddleware.encrypt(JSON.stringify(requestedStage)));
                        } else {
                            socketMiddleware.emit("web-pre", JSON.stringify(requestedStage));
                        }

                        socketMiddleware.on("web-pre-" + webId + "-" + uid, receivedModel => {
                            try {
                                if (middlewareSecurity) {
                                    receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                }
                            } catch (e) {}
                            if (typeof receivedModel == "string") {
                                receivedModel = JSON.parse(receivedModel);
                            }
                            resolve(receivedModel);
                            triggerEvent({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                input: requestedStage,
                                output: receivedModel,
                                type: "pre"
                            });
                            return;
                        });
                    });
                }

                async function runOnHumanNotification(data) {

                    // data = JSON.parse(crypterMiddleware.decrypt(data))
                    // //console.log("Web external")
                    // //console.log(data)
                    // //console.log("Web-External")

                    let currentStage = {
                        text: data.text,
                        type: data.type,
                        next: data.next
                    };
                    let flowName;

                    if (!tags.blockBot && typeof data.text == 'string' && data.text.trim().startsWith("#")) {
                        flowName = data.text.replace("#", "");
                        let flow = flowDocs[flowName];
                        if (flow) {
                            user.tracker = 0;
                            user.stages = flow.stages;
                            user.stuckCount = 0;
                            user.conversationId = flow.flowId;
                            currentStage = clone(user.stages[user.tracker]);
                            if (!currentStage.firstMessage) {
                                currentStage.firstMessage = "";
                            }
                            if (Array.isArray(currentStage.text)) {
                                for (let index in currentStage.text) {
                                    currentStage.text[index] = currentStage.firstMessage + "|break|" + currentStage.text[index];
                                }
                            } else {
                                currentStage.text = currentStage.firstMessage + "|break|" + currentStage.text;
                            }
                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                pre(currentStage).then(receivedStage => {
                                    resolve(receivedStage);
                                }).catch(e => {
                                    if (!online) {
                                        currentStage = {
                                            text: "Oh! I would require internet to help you here.",
                                            type: "text"
                                        };
                                    }
                                });
                            }
                        }
                    }

                    let reply = await transform(currentStage);
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        webInformation: deviceInfo,
                        projectId: projectId,
                        assistance: true,
                        input: {
                            user: user,
                            tags: tags
                        },
                        intentTrigger: flowName,
                        output: data,
                        blockBot: true,
                        flowDirection: "output",
                        type: "process"
                    });
                    socketHuman.emit("preHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        assistance: true,
                        type: "pre",
                        reply: currentStage
                    });
                    callback(reply);
                }

                socketMiddleware.on("web-external-" + webId.toString(), runOnNotification);
                socketMiddleware.on("web-timeout-" + webId.toString(), async function (data) {
                    invalidate(async () => {
                        callback((await transform(data)));
                    });
                });

                socketHuman.on("web-external-" + webId.toString(), runOnHumanNotification);
                socketHuman.on("start-bot-" + webId.toString(), function (data) {
                    tags.blockBot = false;
                    setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                    runOnHumanNotification(data);
                });
                socketHuman.on("pause-bot-" + webId.toString(), function () {
                    tags.blockBot = true;
                });

                this.processInput = async function (text) {
                    socketHuman.emit("postHandler", {
                        senderId: webId,
                        projectId: projectId,
                        tags: tags,
                        intent: "",
                        type: "post",
                        reply: {
                            projectId: projectId,
                            data: {
                                text: text
                            },
                            sender: webId,
                            recipient: "jubiAiWeb"
                        },
                        time: new Date().getTime()
                    });
                    if (tags && !tags.blockBot) {
                        // //console.log("PROCESS INPUT")
                        if (strictlyFlow) {
                            $("#jubi-textInput").hide(200);
                        }
                        try {
                            if (lastTimestamp === undefined) {
                                let encryptedLastTimestamp = getLocalStorageData("t_" + localSavePassPhrase);
                                if (encryptedLastTimestamp) {
                                    try {
                                        lastTimestamp = JSON.parse(crypterLocal.decrypt(encryptedLastTimestamp)).lastTimestamp;
                                    } catch (e) {}
                                }
                            }
                            if (lastTimestamp + parseInt(timeoutSeconds || 1200) * 1000 < new Date().getTime()) {
                                invalidate();
                            }
                            lastTimestamp = new Date().getTime();
                            setLocalStorageData("t_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify({ lastTimestamp: lastTimestamp })));

                            let timestampstart = new Date().getTime();
                            let engineOut = await runEngine(text);
                            let stage = engineOut.stage;
                            let timestampend = new Date().getTime();
                            setLocalStorageData("user_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(user)));

                            if (humanAssistSwitch) {
                                if (engineOut.status.final == "cancelStuck" || engineOut.status.final == "" || engineOut.status.final == "nextInvalid" || engineOut.status.final == "nextFallback") {
                                    //engineOut.status.final=undefined
                                    socketHuman.emit("assignAgentBackend", {
                                        data: {
                                            senderId: webId,
                                            bot: projectId
                                        },
                                        senderId: webId,
                                        projectId: projectId
                                    });
                                }
                            }

                            triggerEvent({
                                senderId: webId,
                                channel: channel,
                                webInformation: deviceInfo,
                                projectId: projectId,
                                input: {
                                    text: text,
                                    user: user,
                                    tags: tags
                                },
                                requestAssistance: tags.blockBot,
                                apiTime: timestampend - timestampstart,
                                output: stage,
                                nlu: engineOut.nlu,
                                status: engineOut.status,
                                type: "process"
                            });
                            if (!tags.blockBot) {
                                socketHuman.emit("preHandler", {
                                    senderId: webId,
                                    type: "pre",
                                    projectId: projectId,
                                    tags: tags,
                                    text: text,
                                    reply: stage
                                });
                                let reply = await transform(replaceTagsFromStage(stage));
                                callback(reply);
                            }
                        } catch (e) {
                            triggerEventError({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                type: "processinput-1",
                                error: e
                            });
                            // //console.log(e);
                        }
                    } else {
                        triggerEvent({
                            senderId: webId,
                            channel: channel,
                            webInformation: deviceInfo,
                            projectId: projectId,
                            input: {
                                text: text,
                                user: user,
                                tags: tags
                            },
                            blockBot: true,
                            flowDirection: "input",
                            type: "process"
                        });
                    }
                };
                function replaceTagsFromStage(stage) {
                    if (Array.isArray(stage.text)) {
                        for (let index in stage.text) {
                            stage.text[index] = replaceAllTags(stage.text[index]);
                        }
                    } else {
                        stage.text = replaceAllTags(stage.text);
                    }
                    if (stage.type == "button" || stage.type == "quickReply") {
                        for (let index in stage.next.data) {
                            stage.next.data[index].data = replaceAllTags(stage.next.data[index].data);
                            stage.next.data[index].text = replaceAllTags(stage.next.data[index].text);
                        }
                    }
                    return stage;
                }

                function replaceAllTags(text) {
                    let match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                    if (match) {
                        do {
                            // //console.log(match[0])
                            let matchedTag = match[0].replace("${", "").replace("}", "");
                            if (tags[matchedTag]) {
                                text = text.replace(match[0], tags[matchedTag]);
                            } else {
                                text = text.replace(match[0], "");
                            }
                            match = /\${[a-zA-Z0-9_]*}/g.exec(text);
                        } while (match);
                    }
                    return text;
                }

                function runEngine(text) {
                    return new Promise(async function (resolve, reject) {
                        try {
                            let timestamp1 = new Date().getTime();
                            tags["userSays"] = text;
                            let nluProcessedModel = await processNlu(cleanText(text));
                            // triggerEvent({
                            //     senderId:webId,
                            //     channel:channel,
                            //     projectId:projectId,
                            //     input:text,
                            //     output:nluProcessedModel,
                            //     type:"nlu"
                            // });
                            let timestamp2 = new Date().getTime();
                            let validatedModel = await processValidator(text, user, nluProcessedModel.entities);
                            let timestamp3 = new Date().getTime();
                            let prevStage = {};
                            if (user.stages) {
                                prevStage = user.stages[user.tracker];
                            }
                            if (user.previousOptions && user.previousQuery) {
                                let output = { intents: {}, entities: {}, top: []
                                    //entity extraction
                                };for (let option of user.previousOptions) {
                                    // let entityData=replaceAllEntities(option.query,output);
                                    // let textReplaced = entityData.text
                                    // //console.log("MATCH::::::::::::")
                                    // //console.log("TEXT REPLACED:::::::::::::"+textReplaced)
                                    // //console.log("TEXT:::::::::::::"+text)
                                    // //console.log("OQ:::::::::::::"+option.query)
                                    if (text == option.query) {
                                        // //console.log("MATCHED::::::::::::")
                                        triggerEvent({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            query: user.previousQuery,
                                            similar: option,
                                            type: "match"
                                        });
                                    }
                                }
                            }
                            user.previousOptions = undefined;
                            user.previousQuery = undefined;
                            let expectation;
                            if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.expectation) {
                                expectation = user.stages[user.tracker].next.expectation;
                            }
                            if (expectation) {
                                let saveResponse = await saveInformation("pre", validatedModel, prevStage, {}, nluProcessedModel, text);
                                if (saveResponse && saveResponse.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-1",
                                        error: saveResponse.error
                                    });
                                    // //console.log(saveResponse.error);
                                }
                                if (saveResponse.tags) {
                                    tags = saveResponse.tags;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(saveResponse.tags)));
                            } else {
                                saveInformation("pre", validatedModel, prevStage, {}, nluProcessedModel, text).then(response => {
                                    if (response && response.error) {
                                        triggerEventError({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            type: "runengine-2",
                                            error: response.error
                                        });
                                        // //console.log(reponse.error);
                                    }
                                    if (response.tags) {
                                        if (tags.blockBot) {
                                            response.tags.blockBot = true;
                                        }
                                        tags = response.tags;
                                    }
                                    if (validatedModel && validatedModel.tags) {
                                        tags = validatedModel.tags;
                                    }
                                    if (validatedModel && validatedModel.data && prevStage && prevStage.stage) {
                                        tags[prevStage.stage] = validatedModel.data;
                                    }
                                    setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                                }).catch(e => {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-3",
                                        error: e
                                    });
                                    // //console.log(e)
                                });
                                if (validatedModel && validatedModel.data) {
                                    tags[prevStage.stage] = validatedModel.data;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                            }
                            // //console.log(tags)
                            let timestamp4 = new Date().getTime();
                            let flowManagerData = await processFlowManager({ query: text, intents: nluProcessedModel.intents, topIntents: nluProcessedModel.top, validation: validatedModel });
                            let stageModel = flowManagerData.response;
                            let status = flowManagerData.status;
                            let timestamp5 = new Date().getTime();
                            // //console.log(timestamp2-timestamp1)
                            // //console.log(timestamp3-timestamp2)
                            // //console.log(timestamp4-timestamp3)
                            // //console.log(timestamp5-timestamp4)
                            saveInformation("post", validatedModel, prevStage, stageModel, nluProcessedModel, text).then(reponse => {
                                if (reponse && reponse.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-4",
                                        error: reponse.error
                                    });
                                    // //console.log(reponse.error);
                                }
                                if (reponse.tags) {
                                    if (tags.blockBot) {
                                        reponse.tags.blockBot = true;
                                    }
                                    tags = reponse.tags;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                            }).catch(e => {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "runengine-5",
                                    error: e
                                });
                                // //console.log(e)
                            });
                            return resolve({ stage: stageModel, nlu: nluProcessedModel, status: status });
                        } catch (e) {
                            if (!online) {
                                invalidate(async () => {
                                    callback((await transform({
                                        text: "Oh! I would require internet to help you here.",
                                        type: "text"
                                    })));
                                }, true);
                            }
                            triggerEventError({
                                senderId: webId,
                                channel: channel,
                                projectId: projectId,
                                type: "runengine-6",
                                error: e
                            });
                            // //console.log(e)
                            return reject(e);
                        }
                    });

                    function saveInformation(type, validatedModel, prevStage, stageModel, nluProcessedModel, text) {
                        return new Promise((resolve, reject) => {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            let uid = IDGenerator(20);
                            let input = { type: type, validation: validatedModel, prevStage: prevStage, webId: webId, nlu: nluProcessedModel, text: text, stage: stageModel, requestId: uid, projectId: projectId };
                            if (middlewareSecurity) {
                                socketMiddleware.emit("web-save", crypterMiddleware.encrypt(JSON.stringify(input)));
                            } else {
                                socketMiddleware.emit("web-save", JSON.stringify(input));
                            }
                            socketMiddleware.on("web-save-" + webId + "-" + uid, receivedModel => {
                                if (middlewareSecurity) {
                                    receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                }
                                resolve(receivedModel);
                                triggerEvent({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    input: input,
                                    output: receivedModel,
                                    type: "save"
                                });
                            });
                        });
                    }

                    // function getTokenizedData(text){
                    //     return tokenizer()
                    //     .input(text)
                    //     .token('data', /[a-zA-Z0-9]+/)
                    //     .resolve()
                    //     .data||[]
                    // }
                    function cleanText(text) {
                        //text tokenizing and cleaning
                        let tokenizedData = tokenizer().input(text).token('data', /[^!^@^-^_^=^\[^&^\/^\^^#^,^+^(^)^$^~^%^.^'^"^:^*^?^<^>^{^}^\]^0^1^2^3^4^5^6^7^8^9^\s]+/).resolve().data;
                        let resp = "";
                        if (tokenizedData) {
                            if (Array.isArray(tokenizedData)) {
                                resp = tokenizedData.reduce((text, value) => {
                                    return text.toLowerCase() + " " + value.toLowerCase();
                                });
                            } else {
                                resp = tokenizedData.toLowerCase().trim();
                            }
                        }
                        let stopWords = { "a": "", "an": "", "the": "", "are": "is" };
                        resp = resp.split(/\s+/).map(term => {
                            if (stopWords[term] || stopWords[term] == "") {
                                return stopWords[term];
                            }
                            return term;
                        }).filter(text => {
                            return text !== undefined || text != "";
                        }).join(" ");

                        return resp.split(/\s+/).join(" ");
                    }

                    function opinionFromLR(data) {
                        return new Promise(async function (resolve, reject) {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            let uid = IDGenerator(20);
                            let requestData = {
                                data: data,
                                webId: webId,
                                requestId: uid
                            };
                            socketBackend.emit("web-opinion-lr", crypterTransit.encrypt(JSON.stringify(requestData)));
                            socketBackend.on("web-opinion-lr-" + webId + "-" + uid, receivedModel => {
                                receivedModel = JSON.parse(crypterTransit.decrypt(receivedModel));
                                if (receivedModel.error) {
                                    // triggerEventError({
                                    //     senderId:webId,
                                    //     channel:channel,
                                    //     projectId:projectId,
                                    //     type:"opinionfromlr-1",
                                    //     error:receivedModel.error
                                    // })
                                    // //console.log(body.error)
                                    return reject(receivedModel.error);
                                }
                                // //console.log(receivedModel)
                                return resolve(receivedModel);
                            });
                        });
                    }
                    function replaceAllEntities(text, output) {
                        //entity extraction
                        let entitiesDetected = [];
                        let filteredEntities = [];
                        let entitiesToBeDeletedIndices = [];
                        for (let label in entityDocs) {
                            for (let value in entityDocs[label]) {
                                let flag = false;
                                let listOfTokens = entityDocs[label][value];
                                listOfTokens = listOfTokens.sort((a, b) => {
                                    return b.length - a.length;
                                });

                                for (let token of listOfTokens) {
                                    // for( let textToken of getTokenizedData(text)){
                                    // if(textToken==token&&token.trim()!=""&&textToken.trim()!=""){
                                    if ((text.startsWith(token + " ") || text.endsWith(" " + token) || text.trim() == token || text && text.includes(" " + token + " ")) && token.trim() != "") {
                                        if (entitiesDetected.length == 0) {
                                            entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                            flag = true;
                                        }
                                        for (let index in entitiesDetected) {
                                            if (entitiesDetected[index].token && entitiesDetected[index].token.includes(token)) {
                                                flag = true;
                                                break;
                                            } else if (token && token.includes(entitiesDetected[index].token)) {
                                                entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                                entitiesToBeDeletedIndices.push(index);
                                                flag = true;
                                                break;
                                            } else {
                                                entitiesDetected.push({ token: token, synonymGroup: value, entity: label });
                                                flag = true;
                                            }
                                        }
                                    }
                                    if (flag) {
                                        break;
                                    }
                                    // }
                                    // }
                                }
                            }
                        }
                        for (let index in entitiesDetected) {
                            if (!entitiesToBeDeletedIndices || !entitiesToBeDeletedIndices.includes(index)) {
                                filteredEntities.push(entitiesDetected[index]);
                            }
                        }
                        output.entities = filteredEntities;

                        for (let element of filteredEntities) {
                            text = text.replaceAll(element.token, element.entity);
                        }
                        return { output: output, text: text };
                    }
                    function processNlu(text) {
                        return new Promise(async function (resolve, reject) {
                            try {

                                //output variable
                                let output = { intents: {}, entities: {}, top: [] };

                                let entityData = replaceAllEntities(text, output);
                                text = entityData.text;
                                output = entityData.output;

                                //exact match
                                let matchFlag = false;
                                let max = 0;
                                // //console.log("QUERY")
                                // //console.log(text)
                                let outputIntents = [];
                                for (let label in intentDocs) {
                                    for (let utterance of intentDocs[label]) {
                                        let score = 0;
                                        if (utterance.toLowerCase() == text.toLowerCase()) {
                                            score = 1;
                                            // //console.log("MATCH MATCH")
                                        } else {
                                            score = stringSimilarity.compareTwoStrings(utterance, text);
                                        }

                                        // //console.log(text+":::"+score+":::"+utterance)
                                        if (score > 0.95) {
                                            if (score > max) {
                                                output.intents = {
                                                    intent: label,
                                                    probability: score,
                                                    query: intentDocs[label][0]
                                                };
                                                max = score;
                                                matchFlag = true;
                                            } else if (max == score) {
                                                matchFlag = false;
                                            }
                                        }
                                        if (utterance == text) {
                                            outputIntents.push({
                                                intent: label,
                                                probability: 1,
                                                query: intentDocs[label][0]
                                            });
                                        }
                                    }
                                }
                                // //console.log("OUTPUT INTENTS")
                                // //console.log(outputIntents)
                                if (outputIntents.length > 1 || output.intents.probability && output.intents.probability < 0.97) {
                                    matchFlag = false;
                                } else if (outputIntents.length == 1) {
                                    matchFlag = true;
                                }
                                // //console.log("INTENT DOCS")
                                // //console.log(intentDocs)
                                // //console.log("EXACT MATCH")
                                // //console.log(matchFlag)
                                //console.log("JUBI_REQUEST:"+text)

                                //ml based match
                                if (!matchFlag) {
                                    // //generate nb output
                                    // let classifier = new BayesClassifier()
                                    // for( let intent in intentDocs){
                                    //     classifier.addDocuments(intentDocs[intent], intent)
                                    // }

                                    // classifier.train();
                                    // let nbData=classifier.getClassifications(text).splice(0,5)
                                    // // let nbTotalScore=0
                                    // // for( let element of classifier.getClassifications(text)){
                                    // //     nbTotalScore+=element.value
                                    // // }
                                    // // let nbData=classifier.getClassifications(text).splice(0,5)
                                    // // let failoverData={
                                    // //     intents:{
                                    // //         intent:nbData[0].label,
                                    // //         probability:nbData[0].value/nbTotalScore,
                                    // //         query:intentDocs[nbData[0].label][0]
                                    // //     },
                                    // //     top:[]
                                    // // }
                                    // // for( let i in nbData){
                                    // //     failoverData.top.push({
                                    // //         intent:nbData[i].label,
                                    // //         probability:nbData[i].value/nbTotalScore,
                                    // //         query:intentDocs[nbData[i].label][0]
                                    // //     })
                                    // // }

                                    // // create shrinked data
                                    // // let shrinkedData=classifier.getClassifications(text)
                                    // //console.log("NB DATA")
                                    // //console.log(nbData)
                                    let shrinkedIndexedData = {};
                                    for (let element in intentDocs) {
                                        if (intentDocs[element].length > 0) {
                                            shrinkedIndexedData[element] = intentDocs[element];
                                        }
                                    }
                                    // //console.log("TOTAL DATA")
                                    // //console.log(shrinkedIndexedData)
                                    let results = [];
                                    try {
                                        //train bm25 on shrinked data
                                        let engine = bm25();
                                        engine.defineConfig({ fldWeights: { text: 1 } });
                                        engine.definePrepTasks([nlp.string.lowerCase, nlp.string.removeExtraSpaces, nlp.string.tokenize0, nlp.tokens.propagateNegations, nlp.tokens.stem]);
                                        for (let label in shrinkedIndexedData) {
                                            if (shrinkedIndexedData[label].length > 0) {
                                                let text = shrinkedIndexedData[label].reduce((text, value) => {
                                                    return text + " " + value;
                                                });
                                                engine.addDoc({ text: text }, label);
                                            }
                                        }
                                        engine.consolidate(4);
                                        //run query on shrinked data trained bm25
                                        results = engine.search(text, 5);
                                    } catch (e) {
                                        triggerEventError({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            type: "processnlu-1",
                                            error: e
                                        });
                                        // //console.log(e);
                                    }

                                    // //console.log("BM25")
                                    // //console.log(results)


                                    if (results.length > 1) {
                                        let bm25TotalScore = 0;
                                        for (let element of results) {
                                            bm25TotalScore += Math.exp(element[1]);
                                        }
                                        let requestData = {
                                            data: {},
                                            query: text
                                        };
                                        for (let result of results) {
                                            requestData.data[result[0]] = shrinkedIndexedData[result[0]];
                                            requestData.projectId = "projectBrowser";
                                        }
                                        try {
                                            let response = await opinionFromLR(requestData);
                                            triggerEvent({
                                                senderId: webId,
                                                channel: channel,
                                                projectId: projectId,
                                                input: requestData,
                                                output: response,
                                                type: "lr"
                                            });
                                            output.intents = {
                                                intent: response.intents[0].name,
                                                probability: parseFloat(response.intents[0].confidence),
                                                query: intentDocs[response.intents[0].name][0]
                                            };
                                        } catch (e) {
                                            // //console.log(e);
                                            output.intents = {
                                                intent: results[0][0],
                                                probability: Math.exp(results[0][1]) / bm25TotalScore,
                                                query: intentDocs[results[0][0]][0]
                                            };
                                        }

                                        output.top = [];
                                        for (let element of results) {
                                            if (intentDocs[element[0]].length > 0) {
                                                output.top.push({
                                                    intent: element[0],
                                                    probability: Math.exp(element[1]) / bm25TotalScore,
                                                    query: intentDocs[element[0]][0]
                                                });
                                            }
                                        }
                                    } else {
                                        output.intents = {
                                            intent: "",
                                            probability: 0,
                                            query: ""
                                        };
                                        output.top = [];
                                    }
                                    // //console.log("LR")
                                    // //console.log(output)
                                }
                                return resolve(output);
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processnlu-2",
                                    error: e
                                });
                                // //console.log(e);
                                return reject(e);
                            }
                        });
                    }
                    function processValidator(text, user, entities) {
                        let validator = {
                            wordList: wordList,
                            regex: regex,
                            post: post
                        };
                        return new Promise(async function (resolve, reject) {
                            try {
                                let expectation;
                                let post;
                                if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.expectation) {
                                    expectation = user.stages[user.tracker].next.expectation;
                                } else if (user && user.stages && user.stages.length > user.tracker && user.stages[user.tracker] && user.stages[user.tracker].next && user.stages[user.tracker].next.post && user.stages[user.tracker].next.post.length > 0) {
                                    post = user.stages[user.tracker].next.post[0];
                                }

                                if (expectation && expectation.type) {
                                    let runFunc = validator[expectation.type].bind({ entities: entities, expectation: expectation, user: user });
                                    resolve((await runFunc(text)));
                                } else if (post && post.url) {
                                    let runFunc = validator["post"].bind({ entities: entities, post: post });
                                    resolve((await runFunc(text)));
                                } else {
                                    resolve({
                                        data: text,
                                        validated: true
                                    });
                                }
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processvalidator-1",
                                    error: e
                                });
                                // //console.log(e)
                                return reject(e);
                            }
                        });

                        function post(input) {
                            return new Promise(function (resolve, reject) {
                                try {
                                    if (!online) {
                                        return reject({ status: "offline" });
                                    }
                                    let model = {};
                                    let uid = IDGenerator(20);
                                    model.data = input;
                                    model.validated = true;
                                    model.webId = webId;
                                    model.requestId = uid;
                                    model.stage = user.stages[user.tracker];
                                    if (middlewareSecurity) {
                                        socketMiddleware.emit("web-post", crypterMiddleware.encrypt(JSON.stringify(model)));
                                    } else {
                                        socketMiddleware.emit("web-post", JSON.stringify(model));
                                    }
                                    socketMiddleware.on("web-post-" + webId + "-" + uid, receivedModel => {
                                        try {
                                            if (middlewareSecurity) {
                                                receivedModel = JSON.parse(crypterMiddleware.decrypt(receivedModel));
                                            }
                                        } catch (e) {}
                                        if (typeof receivedModel == "string") {
                                            receivedModel = JSON.parse(receivedModel);
                                        }
                                        resolve(receivedModel);
                                        triggerEvent({
                                            senderId: webId,
                                            channel: channel,
                                            projectId: projectId,
                                            input: input,
                                            output: receivedModel,
                                            type: "post"
                                        });
                                        return;
                                    });
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "post-1",
                                        error: e
                                    });
                                    // //console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                        function wordList(input) {
                            let entities = this.entities;
                            let expectation = this.expectation;
                            let model = {};
                            return new Promise(function (resolve, reject) {
                                try {
                                    // //console.log(expectation)
                                    // //console.log(entities)
                                    // //console.log(input)
                                    if (expectation.val) {
                                        let entityValues = Object.keys(expectation.val);
                                        for (let entity of entities) {
                                            let flag = false;
                                            for (let value of entityValues) {
                                                if (entity.synonymGroup && typeof entity.synonymGroup == "string" && value && typeof value == "string" && entity.synonymGroup.trim() == value.trim()) {
                                                    flag = true;
                                                }
                                            }
                                            if (flag) {
                                                if (expectation.val[entity.synonymGroup]) {
                                                    model.stage = expectation.val[entity.synonymGroup];
                                                }
                                                // //console.log(model.stage)
                                                // //console.log(entities)
                                                // //console.log(expectation)
                                                // //console.log(":::::::::::STAGE::::::::::::")
                                                model.data = entity.synonymGroup;
                                                model.validated = true;
                                                return resolve(model);
                                            }
                                        }
                                    }
                                    model.data = input;
                                    model.validated = false;
                                    return resolve(model);
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "wordlist-1",
                                        error: e
                                    });
                                    // //console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                        function regex(inp) {
                            let entities = this.entities;
                            let expectation = this.expectation;
                            let model = {};
                            return new Promise(function (resolve, reject) {
                                try {
                                    if (expectation.val && expectation.val.trim()) {
                                        let reg = new RegExp(expectation.val.trim());
                                        if (expectation.val && inp.match(reg)) {
                                            model.data = inp.match(reg)[0];
                                            model.validated = true;
                                            return resolve(model);
                                        } else {
                                            model.validated = false;
                                            return resolve(model);
                                        }
                                    } else {
                                        model.validated = false;
                                        return resolve(model);
                                    }
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "regex-1",
                                        error: e
                                    });
                                    // //console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                    }
                    function processFlowManager(data) {
                        return new Promise(async function (resolve, reject) {
                            try {
                                let status = {
                                    level: "fallback",
                                    prevConversation: "qna",
                                    nextInitConversation: "invalid",
                                    validation: data.validation.validated,
                                    final: "",
                                    previousStage: ""
                                };
                                let topIntents = [];
                                if (data && data.topIntents) {
                                    for (let element of data.topIntents) {
                                        if (!element.intent.startsWith("st_")) {
                                            topIntents.push(element);
                                        }
                                    }
                                    data.topIntents = topIntents;
                                }
                                // //console.log(data.intents.probability)
                                let flow = flowDocs[data.intents.intent];
                                if (data.intents.probability >= thresholdDirect) {
                                    status.level = "direct";
                                } else if (data.intents.probability >= thresholdOptions) {
                                    status.level = "options";
                                }
                                if (user && user.stages && user.stages.length > 1 && user.tracker < user.stages.length - 1) {
                                    status.prevConversation = "flow";
                                }
                                if (flow) {
                                    if (flow.stages.length == 1) {
                                        status.nextInitConversation = "qna";
                                    } else if (flow.stages.length > 1) {
                                        status.nextInitConversation = "flow";
                                    }
                                }

                                if (user && user.stuckCount === undefined) {
                                    user.stuckCount = 0;
                                }
                                if (status.level === "direct" && flow && flow.flowId && flow.flowId.toLowerCase().trim() === "selectemergency") {
                                    status.final = "cancel";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "qna" && status.level == "direct" && data.intents.intent.toLowerCase().trim() === "selectprevious" && user.tracker > 0) {
                                    status.final = "inFlowPrevious";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "qna" && status.level == "direct" && data.intents.probability >= 0.98) {
                                    status.final = "inFlowNextGhost";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "flow" && status.level == "direct" && flow && user.conversationId != flow.flowId && data.intents.probability >= 0.98) {
                                    status.final = "nextStart";
                                } else if (status.prevConversation == "flow" && status.validation) {
                                    status.final = "inFlowNextValidated";
                                    status.previousStage = user.stages[user.tracker].stage;
                                } else if (status.prevConversation == "flow" && !status.validation) {
                                    if (user.stuckCount < 3) {
                                        status.final = "inFlowNextInvalidated";
                                        status.previousStage = user.stages[user.tracker].stage;
                                    } else {
                                        status.final = "cancelStuck";
                                        status.previousStage = "";
                                    }
                                } else if (status.prevConversation == "qna" && status.nextInitConversation == "invalid") {
                                    status.final = "nextInvalid";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "qna" && status.level == "direct") {
                                    status.final = "nextStart";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "qna" && status.level == "options") {
                                    if (topIntents.length > 0) {
                                        status.final = "nextOptions";
                                        status.previousStage = "";
                                    } else {
                                        status.final = "nextFallback";
                                        status.previousStage = "";
                                    }
                                } else if (status.prevConversation == "qna" && status.level == "fallback") {
                                    status.final = "nextFallback";
                                    status.previousStage = "";
                                }
                                return resolve({ response: await decideResponse(flow, data, status), status: status });
                            } catch (e) {
                                triggerEventError({
                                    senderId: webId,
                                    channel: channel,
                                    projectId: projectId,
                                    type: "processflowmanager-1",
                                    error: e
                                });
                                // //console.log(e);
                                return reject(e);
                            }
                        });

                        function decideResponse(flow, data, status) {
                            return new Promise((resolve, reject) => {
                                try {
                                    // //console.log(status) 
                                    let fallbackFlow = flowDocs["selectfallback"] || flowDocs["selectFallback"];
                                    let currentStage;
                                    switch (status.final) {
                                        case "cancel":
                                            user.tracker = 0;
                                            let cancelFlow = flowDocs["selectemergency"] || flowDocs["selectEmergency"];
                                            if (!cancelFlow) {
                                                cancelFlow = {
                                                    stages: [{
                                                        text: ["Cancelling your current conversation."],
                                                        stage: "selectfallback",
                                                        type: "text"
                                                    }]
                                                };
                                            }
                                            user.stages = cancelFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "cancelStuck":
                                            user.tracker = 0;
                                            user.stages = [{
                                                text: ["Cancelling, as it seems you are stuck somewhere."],
                                                stage: "selectfallback",
                                                type: "text"
                                            }];
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "inFlowPrevious":
                                            user.tracker = parseInt(user.tracker) - 1;
                                            user.stuckCount = 0;
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    resolve(receivedStage);
                                                }).catch(e => {

                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // //console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "inFlowNextGhost":
                                            let text = "";
                                            if (Array.isArray(flow.stages[0].text)) {
                                                text = flow.stages[0].text[getRandom(flow.stages[0].text.length)];
                                            } else {
                                                text = flow.stages[0].text;
                                            }
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = text + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = text + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // //console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = text + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = text + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "inFlowNextValidated":
                                            user.stuckCount = 0;
                                            currentStage = clone(user.stages[user.tracker]);
                                            let validText = "";
                                            if (currentStage && currentStage.next && currentStage.next.expectation && currentStage.next.expectation.validMessage) {
                                                validText = currentStage.next.expectation.validMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.post && currentStage.next.post[0].validMessage) {
                                                validText = currentStage.next.post[0].validMessage;
                                            }
                                            let stageFound = false;
                                            if (data.validation.stage) {
                                                for (let index in user.stages) {
                                                    let stage = user.stages[index];
                                                    // //console.log(":::::::::::::::::::::::")
                                                    // //console.log(stage.stage)
                                                    if (stage.stage == data.validation.stage) {
                                                        user.tracker = index;
                                                        stageFound = true;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (!stageFound) {
                                                user.tracker = parseInt(user.tracker) + 1;
                                            }
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = validText + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = validText + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // //console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = validText + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = validText + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }

                                            break;
                                        case "inFlowNextInvalidated":
                                            user.stuckCount = user.stuckCount + 1;
                                            currentStage = clone(user.stages[user.tracker]);
                                            // //console.log(currentStage)
                                            let invalidText = "";
                                            if (currentStage && currentStage.next && currentStage.next.expectation && currentStage.next.expectation.invalidMessage) {
                                                invalidText = currentStage.next.expectation.invalidMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.post && currentStage.next.post[0].invalidMessage) {
                                                invalidText = currentStage.next.post[0].invalidMessage;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(receivedStage => {
                                                    if (Array.isArray(receivedStage.text)) {
                                                        for (let index in receivedStage.text) {
                                                            receivedStage.text[index] = invalidText + "|break|" + receivedStage.text[index];
                                                        }
                                                    } else {
                                                        receivedStage.text = invalidText + "|break|" + receivedStage.text;
                                                    }
                                                    resolve(receivedStage);
                                                }).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // //console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                if (Array.isArray(currentStage.text)) {
                                                    for (let index in currentStage.text) {
                                                        currentStage.text[index] = invalidText + "|break|" + currentStage.text[index];
                                                    }
                                                } else {
                                                    currentStage.text = invalidText + "|break|" + currentStage.text;
                                                }
                                                resolve(currentStage);
                                            }

                                            break;
                                        case "nextStart":
                                            user.tracker = 0;
                                            user.stages = flow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = flow.flowId;
                                            currentStage = clone(user.stages[user.tracker]);
                                            if (!currentStage.firstMessage) {
                                                currentStage.firstMessage = "";
                                            }
                                            if (Array.isArray(currentStage.text)) {
                                                for (let index in currentStage.text) {
                                                    currentStage.text[index] = currentStage.firstMessage + "|break|" + currentStage.text[index];
                                                }
                                            } else {
                                                currentStage.text = currentStage.firstMessage + "|break|" + currentStage.text;
                                            }
                                            if (currentStage && currentStage.next && currentStage.next.pre && currentStage.next.pre.length > 0) {
                                                pre(currentStage).then(resolve).catch(e => {
                                                    if (!online) {
                                                        invalidate(async () => {
                                                            callback((await transform({
                                                                text: "Oh! I would require internet to help you here.",
                                                                type: "text"
                                                            })));
                                                        }, true);
                                                    } else {
                                                        // //console.log(e)
                                                        resolve(currentStage);
                                                    }
                                                });
                                            } else {
                                                resolve(currentStage);
                                            }
                                            break;
                                        case "nextFallback":
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text"
                                                    }]
                                                };
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "nextInvalid":
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text",
                                                        override: true
                                                    }]
                                                };
                                            } else {
                                                fallbackFlow.stages[0].override = true;
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        case "nextOptions":
                                            user.tracker = 0;
                                            user.stages = [{
                                                text: ["We have got following answers to help you."],
                                                stage: "optionsfallback",
                                                type: "generic",
                                                next: {
                                                    data: []
                                                }
                                            }];
                                            let index = 0;
                                            user.previousQuery = data.query;
                                            user.previousOptions = data.topIntents;
                                            for (let element of data.topIntents) {
                                                let reply;
                                                index++;
                                                if (flowDocs[element.intent] && flowDocs[element.intent].stages && flowDocs[element.intent].stages.length > 0) {
                                                    if (Array.isArray(flowDocs[element.intent].stages[0].text)) {
                                                        reply = flowDocs[element.intent].stages[0].text[0];
                                                    } else {
                                                        reply = flowDocs[element.intent].stages[0].text;
                                                    }
                                                }
                                                if (element.query && reply) {

                                                    user.stages[0].next.data.push({
                                                        title: capFirstLetter(element.query.trim()),
                                                        text: reply,
                                                        buttons: [{ data: element.query, text: "Read More" }]
                                                    });
                                                }
                                                function capFirstLetter(textSent) {
                                                    try {
                                                        return textSent.charAt(0).toUpperCase() + textSent.slice(1);
                                                    } catch (e) {
                                                        return textSent;
                                                    }
                                                }
                                            }
                                            if (user.stages[0].next.data.length == 0) {
                                                if (!fallbackFlow) {
                                                    fallbackFlow = {
                                                        stages: [{
                                                            text: ["Could not understand your query."],
                                                            stage: "selectfallback",
                                                            type: "text",
                                                            override: true
                                                        }]
                                                    };
                                                } else {
                                                    fallbackFlow.stages[0].override = true;
                                                }
                                                user.stages = fallbackFlow.stages;
                                                if (humanAssistSwitch) {
                                                    tags.blockBot = true;
                                                }
                                                status.final = "nextFallback";
                                            } else {
                                                user.stages[0].next.data.push({
                                                    title: "Not relevant",
                                                    text: "Did not match my query",
                                                    buttons: [{ data: "not relevant", text: "Select" }]
                                                });
                                            }
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;
                                            resolve(user.stages[user.tracker]);
                                            break;
                                        default:
                                            status.final = "nextFallback";
                                            user.tracker = 0;
                                            if (!fallbackFlow) {
                                                fallbackFlow = {
                                                    stages: [{
                                                        text: ["Could not understand your query."],
                                                        stage: "selectfallback",
                                                        type: "text",
                                                        override: true
                                                    }]
                                                };
                                            } else {
                                                fallbackFlow.stages[0].override = true;
                                            }
                                            user.stages = fallbackFlow.stages;
                                            user.stuckCount = 0;
                                            user.conversationId = undefined;

                                            if (humanAssistSwitch) {
                                                tags.blockBot = true;
                                            }
                                            resolve(user.stages[user.tracker]);
                                            break;
                                    }
                                } catch (e) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "decideresponse-1",
                                        error: e
                                    });
                                    // //console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                    }
                }
            };
            //Chat Middleware Js
            function middleware() {
                //hideVoice();
                let backendResponse;
                if (!backendResponse) {
                    backendResponse = false;
                }
                let booleanHideShow;
                let delayMaster = 1000;
                let msgIndex = 0;
                let gender = null;
                let profile = undefined;
                let semaphoreForFirstChatLoad = true;
                let lastConversationSemaphore = true;
                let inputQuery = get("query");
                // let inputDefault=false;
                if (!inputQuery) {
                    inputQuery = 'Get Started';
                    // inputDefault=true;
                }
                if (!voiceEnabled || !online) {
                    // //console.log("no speech")
                    hideVoice();
                }

                // setTimeout(async()=>{
                //     let currentState=await doesConnectionExist();
                //     if(currentState!=online){
                //         online=currentState;
                //         if(online){
                //             //console.log("Going Online")
                //         }
                //         else{
                //             //console.log("Going Offline")
                //             disconnectVoice();
                //         }
                //     } 
                // },1000);
                socketMiddleware.on('disconnect', function () {
                    online = false;
                    //console.log("Going Offline")
                    disconnectVoice();
                    offFunction();
                });

                let ce = new ChatEngine(postReply);
                decorateBotResponse = postReply;
                socketBackend.on("web-webview-" + webId.toString(), async function (data) {
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: data,
                        type: "webViewSubmit"
                    });
                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) {}
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    ce.processInput(data.text);

                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 200);
                });
                socketMiddleware.on("web-webview-" + webId.toString(), async function (data) {

                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) {}
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    triggerEvent({
                        senderId: webId,
                        channel: channel,
                        projectId: projectId,
                        data: data,
                        type: "webViewSubmit"
                    });
                    ce.processInput(data.text);
                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 200);
                });
                String.prototype.replaceAll = function (search, replacement) {
                    let target = this;
                    return target.split(search).join(replacement);
                };
                function htmlInjectionPrevent(msg) {
                    if (msg) {
                        return msg.toString().replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
                    } else {
                        return msg;
                    }
                }
                function boot() {
                    try {
                        if (inputQuery && cookie) {
                            let encryptedData = getLocalStorageData(localSavePassPhrase);
                            if (encryptedData) {
                                let decryptedArray = JSON.parse(crypterLocal.decrypt(encryptedData));
                                // //console.log("DECRYPTED ARRAY")
                                // //console.log(decryptedArray)
                                let flagCookie = false;
                                for (let dataElement of decryptedArray) {
                                    if (dataElement.trim().startsWith("<div class='pm-bxRightchat'")) {
                                        flagCookie = true;
                                        break;
                                    }
                                }
                                if (decryptedArray.length > 1 && flagCookie) {
                                    let htmlToBeAdded = "";
                                    for (let element of decryptedArray) {
                                        htmlToBeAdded += element;
                                    }
                                    chatArray = decryptedArray;
                                    if (modal.cookie == "always") {
                                        if (updateWebId) {
                                            readyState = true;
                                            updateWebId(webId);
                                        }
                                        try {
                                            document.getElementById('pm-permission-view').style.display = "none";
                                            document.getElementById('pm-secIframe').style.display = "block";
                                        } catch (e) {}
                                        pushToChatStart(htmlToBeAdded);
                                        $(".bxCheckOPtion").remove();
                                        setTimeout(() => {
                                            try {
                                                //console.log("called ")
                                                $("#pm-data").animate({ scrollTop: $("#pm-buttonlock").height() }, '1000000');
                                                scrollUp();
                                            } catch (e) {
                                                //console.log(e)
                                            }
                                        }, 2000);

                                        if (tags && tags.blockBot && humanAssistSwitch) {
                                            socketHuman.emit("assignAgentBackend", {
                                                data: {
                                                    senderId: webId,
                                                    bot: projectId
                                                },
                                                senderId: webId,
                                                projectId: projectId
                                            });
                                        }
                                        scrollUp();
                                    } else {
                                        $('body').on("click", "#jubi-continue-storage", function (e) {
                                            if (updateWebId) {
                                                readyState = true;
                                                updateWebId(webId);
                                            }
                                            try {
                                                document.getElementById('pm-permission-view').style.display = "none";
                                                document.getElementById('pm-secIframe').style.display = "block";
                                            } catch (e) {}
                                            pushToChatStart(htmlToBeAdded);
                                            $(".bxCheckOPtion").remove();
                                            setTimeout(() => {
                                                scrollUp();
                                            }, chatArray.length * 20);
                                            if (tags && tags.blockBot && humanAssistSwitch) {
                                                socketHuman.emit("assignAgentBackend", {
                                                    data: {
                                                        senderId: webId,
                                                        bot: projectId
                                                    },
                                                    senderId: webId,
                                                    projectId: projectId
                                                });
                                            }
                                        });
                                        $('body').on("click", "#jubi-start-fresh", function (e) {
                                            if (updateWebId) {
                                                readyState = true;
                                                updateWebId(webId);
                                            }
                                            invalidate(() => {}, true);
                                            clearAllLocalStorageData();
                                            chatArray = [];
                                            try {
                                                document.getElementById('pm-permission-view').style.display = "none";
                                                document.getElementById('pm-secIframe').style.display = "block";
                                            } catch (e) {}
                                            //console.log(inputQuery)
                                            //console.log(":::::::::::::::>>>>>>>>>>>")
                                            let ans = prepareJSONRequest(inputQuery);
                                            sendMessage(ans);
                                            scrollUp();
                                        });
                                        try {
                                            document.getElementById('pm-permission-view').style.display = "block";
                                            document.getElementById('pm-secIframe').style.display = "none";
                                        } catch (e) {}
                                    }

                                    return;
                                }
                            }
                        }
                        throw new Error("Default start");
                    } catch (e) {
                        let startTheBot = () => {
                            if (updateWebId) {
                                readyState = true;
                                updateWebId(webId);
                            }
                            clearAllLocalStorageData();
                            chatArray = [];
                            try {
                                document.getElementById('pm-permission-view').style.display = "none";
                                document.getElementById('pm-secIframe').style.display = "block";
                            } catch (e) {}
                            //console.log("Start Message")
                            //console.log(inputQuery)
                            user.stages = undefined;
                            user.tracker = 0;
                            user.conversationId = undefined;
                            let ans = prepareJSONRequest(inputQuery);
                            sendMessage(ans);
                            scrollUp();
                        };
                        if (!window.runOnJubiStartEvent) {
                            //console.log("Starting Bot now")
                            startTheBot();
                        } else {
                            //console.log("Starting Bot later")
                            window.jubiStartEvent = startTheBot;
                        }
                    }
                }

                let run = window.askBot = function (answer, type) {
                    lastConversationSemaphore = true;
                    let str;
                    if (answer.startsWith("upload_file>")) {
                        str = showFile(answer);
                    } else {
                        str = showAnswer(answer);
                    }
                    if (str) {
                        pushToChat(str);
                    }
                    let ans = prepareJSONRequest(answer);
                    sendMessage(ans, type);
                    scrollUp();
                };

                //--voice-work
                // Stream Audio
                let bufferSize = 2048,
                    AudioContext,
                    context,
                    processor,
                    input,
                    globalStream,
                    recognizer,
                    wholeString,
                    lastActiveTimestamp,
                    recordSemaphore = false,
                    flush,
                    mute = voiceEnabled ? false : true;
                try {
                    document.getElementById('jubi-muteVoice').style.display = "none";
                    if (voiceEnabled) {
                        document.getElementById('jubi-unmuteVoice').style.display = "block";
                    } else {
                        document.getElementById('jubi-unmuteVoice').style.display = "none";
                    }
                } catch (e) {}

                $("body").on('click', '#jubi-unmuteVoice', function (e) {
                    document.getElementById('jubi-unmuteVoice').style.display = "none";
                    document.getElementById('jubi-muteVoice').style.display = "block";
                    mute = true;
                    stopVoice();
                });
                $("body").on('click', '#jubi-muteVoice', function (e) {
                    document.getElementById('jubi-unmuteVoice').style.display = "block";
                    document.getElementById('jubi-muteVoice').style.display = "none";
                    mute = false;
                });

                let resultText = document.getElementById('jubi-result-text'),
                    removeLastSentence = true,
                    streamStreaming = false;

                const constraints = {
                    audio: true,
                    video: false
                };

                function clearSpeechText() {
                    wholeString = "";
                    while (resultText && resultText.firstChild) {
                        resultText.removeChild(resultText.firstChild);
                    }
                    document.getElementById('jubi-recording-text').style.display = "none";
                    document.getElementById("pm-buttonlock").style.paddingBottom = "0px";
                }
                //voice
                function hideVoice() {
                    try {
                        document.getElementById('pm-textInput').style.display = "block";
                        document.getElementById('jubi-recording-text').style.display = "none";
                        document.getElementById('button-play-ws').setAttribute('disabled', 'disabled');
                        document.getElementById('button-stop-ws').setAttribute('disabled', 'disabled');
                    } catch (e) {
                        // //console.log(e);
                    }
                }

                //voice ui -----------
                if (voiceEnabled) {
                    addVoiceListeners();
                }

                async function disconnectVoice() {
                    $("#jubi-bxinput").fadeIn(100);
                    $("#button-send").fadeIn(100);
                    $("#keyboard-icon").hide();
                    $("#voice-buttons").hide();
                    $("#jubi-answerBottom").focus();
                    $("#button-stop-ws").hide();
                    $("#button-play-ws").show();
                    recordSemaphore = false;
                    wholeString = "";
                    clearSpeechText();
                    await stopAllRecordings();
                }

                function showVoice() {

                    $("#jubi-bxinput").hide();
                    $("#button-send").hide();
                    $("jubi-recording-text").show();
                    $("#keyboard-icon").fadeIn(50);
                    $("#voice-buttons").fadeIn(50);
                }

                function addVoiceListeners() {
                    $("#keyboard-icon").click(disconnectVoice);
                    $("#jubi-graySend").click(function () {
                        if (voiceEnabled && online) {
                            showVoice();
                        }
                    });
                    $("#jubi-redSend").click(function () {
                        if (voiceEnabled && online) {
                            showVoice();
                        }
                    });
                    $("#button-play-ws").click(() => {
                        recordSemaphore = true;
                        speechToText();
                    });
                    $("#button-stop-ws").click(async () => {
                        recordSemaphore = false;
                        if (wholeString) {
                            run(wholeString, "speech");
                        }
                        clearSpeechText();
                        await stopAllRecordings();
                    });
                }

                function hideStop() {
                    $("#button-stop-ws").hide();
                    $("#button-play-ws").show();
                }

                function hidePlay() {
                    stopVoice();
                    $("#button-play-ws").hide();
                    $("#button-stop-ws").show();
                }

                //voice ui -----------

                //stop recording----

                function stopAllRecordings() {
                    return new Promise((resolve, reject) => {
                        try {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            if (recognizer) {
                                recognizer.stop();
                                hideStop();
                                return resolve();
                            } else if (globalStream) {
                                streamStreaming = false;
                                socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                                let track = globalStream.getTracks()[0];
                                track.stop();
                                if (input) {
                                    input.disconnect(processor);
                                    processor.disconnect(context.destination);
                                    context.close().then(function () {
                                        input = null;
                                        processor = null;
                                        context = null;
                                        AudioContext = null;
                                        hideStop();
                                        return resolve();
                                    });
                                } else {
                                    hideStop();
                                    return resolve();
                                }
                            } else {
                                socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                                hideStop();
                                return resolve();
                            }
                        } catch (e) {
                            hideStop();
                            return reject(e);
                        }
                    });
                }

                //stop recording----


                //voice record------------------


                async function speechToText() {
                    try {
                        lastActiveTimestamp = new Date().getTime();
                        let interval = setInterval(async () => {
                            if (new Date().getTime() - lastActiveTimestamp > 15000) {
                                await stopAllRecordings();
                                clearInterval(interval);
                            }
                        }, 1000);
                        try {
                            await startRecordingOnBrowser();
                        } catch (e) {
                            await startRecordingFromAPI();
                        }
                        hidePlay();
                    } catch (e) {
                        // //console.log(e);
                    }
                }

                function capitalize(s) {
                    if (s.length < 1) {
                        return s;
                    }
                    return s.charAt(0).toUpperCase() + s.slice(1);
                }

                function addTimeSettingsInterim(speechData) {
                    try {
                        wholeString = speechData.results[0].alternatives[0].transcript;
                    } catch (e) {
                        // //console.log(e)
                        wholeString = speechData.results[0][0].transcript;
                    }

                    let nlpObject = window.nlp(wholeString).out('terms');

                    let words_without_time = [];

                    for (let i = 0; i < nlpObject.length; i++) {
                        //data
                        let word = nlpObject[i].text;
                        let tags = [];

                        //generate span
                        let newSpan = document.createElement('span');
                        newSpan.innerHTML = word;

                        //push all tags
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            tags.push(nlpObject[i].tags[j]);
                        }

                        //add all classes
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            let cleanClassName = tags[j];
                            // //console.log(tags);
                            let className = `nl-${cleanClassName}`;
                            newSpan.classList.add(className);
                        }

                        words_without_time.push(newSpan);
                    }

                    finalWord = false;
                    // endButton.disabled = true;

                    return words_without_time;
                }

                function addTimeSettingsFinal(speechData) {
                    let words = [];
                    try {
                        wholeString = speechData.results[0].alternatives[0].transcript;
                        words = speechData.results[0].alternatives[0].words;
                    } catch (e) {
                        // //console.log(e)
                        wholeString = speechData.results[0][0].transcript;
                    }
                    let nlpObject = window.nlp(wholeString).out('terms');

                    let words_n_time = [];

                    for (let i = 0; i < words.length; i++) {
                        //data
                        let word = words[i].word;
                        let startTime = `${words[i].startTime.seconds}.${words[i].startTime.nanos}`;
                        let endTime = `${words[i].endTime.seconds}.${words[i].endTime.nanos}`;
                        let tags = [];

                        //generate span
                        let newSpan = document.createElement('span');
                        newSpan.innerHTML = word;
                        newSpan.dataset.startTime = startTime;

                        //push all tags
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            tags.push(nlpObject[i].tags[j]);
                        }

                        //add all classes
                        for (let j = 0; j < nlpObject[i].tags.length; j++) {
                            let cleanClassName = nlpObject[i].tags[j];
                            // //console.log(tags);
                            let className = `nl-${cleanClassName}`;
                            newSpan.classList.add(className);
                        }

                        words_n_time.push(newSpan);
                    }

                    return words_n_time;
                }

                function startRecordingOnBrowser() {
                    return new Promise(async (resolve, reject) => {
                        // return reject()
                        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
                        if (window.SpeechRecognition === null) {
                            return reject();
                        } else {
                            recognizer = new window.SpeechRecognition();
                            recognizer.continuous = false;
                            recognizer.interimResults = true;
                            recognizer.lang = "en-IN";
                            recognizer.onresult = getResults;
                            try {
                                recognizer.start();
                            } catch (ex) {
                                // //console.log(ex)
                                await stopAllRecordings();
                            }
                            recognizer.onerror = async function (event) {
                                // //console.log(event)
                                await stopAllRecordings();
                            };
                            return resolve();
                        }
                    });
                }

                socketVoice.on('speech-data', data => {
                    data = crypterTransit.decrypt(data);
                    getResults(data);
                });

                function startRecordingFromAPI() {
                    function microphoneProcess(e) {
                        let left = e.inputBuffer.getChannelData(0);
                        let left16 = downsampleBuffer(left, 44100, 16000);
                        if (online) {
                            socketVoice.emit('web-speech-to-text-binary-data', { c: left16 });
                        }
                        function downsampleBuffer(buffer, sampleRate, outSampleRate) {
                            if (outSampleRate == sampleRate) {
                                return buffer;
                            }
                            if (outSampleRate > sampleRate) {
                                throw "downsampling rate show be smaller than original sample rate";
                            }
                            let sampleRateRatio = sampleRate / outSampleRate;
                            let newLength = Math.round(buffer.length / sampleRateRatio);
                            let result = new Int16Array(newLength);
                            let offsetResult = 0;
                            let offsetBuffer = 0;
                            while (offsetResult < result.length) {
                                let nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
                                let accum = 0,
                                    count = 0;
                                for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                                    accum += buffer[i];
                                    count++;
                                }

                                result[offsetResult] = Math.min(1, accum / count) * 0x7FFF;
                                offsetResult++;
                                offsetBuffer = nextOffsetBuffer;
                            }
                            return result.buffer;
                        }
                    }
                    window.onbeforeunload = function () {
                        if (streamStreaming && online) {
                            socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({ webId: webId }));
                        }
                    };
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            socketVoice.emit('web-speech-to-text-start', crypterTransit.encrypt({ webId: webId })); //init socket Google Speech Connection
                            streamStreaming = true;
                            AudioContext = window.AudioContext || window.webkitAudioContext;
                            context = new AudioContext();
                            processor = context.createScriptProcessor(bufferSize, 1, 1);
                            processor.connect(context.destination);
                            context.resume();
                            let handleSuccess = function (stream) {
                                globalStream = stream;
                                input = context.createMediaStreamSource(stream);
                                if (input) {
                                    input.connect(processor);
                                    processor.onaudioprocess = function (e) {
                                        microphoneProcess(e);
                                        return resolve();
                                    };
                                }
                            };
                            navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(e => {
                                // //console.log(e);
                                return reject(e);
                            });
                        } catch (e) {
                            return reject(e);
                        }
                    });
                }

                async function getResults(data) {
                    // //console.log("RESPONSE")
                    // //console.log(data.results)
                    document.getElementById('jubi-recording-text').style.display = "block";
                    lastActiveTimestamp = new Date().getTime();
                    let dataFinal = undefined || data.results[0].isFinal;
                    if (dataFinal === false) {
                        if (removeLastSentence) {
                            resultText.lastElementChild.remove();
                        }
                        removeLastSentence = true;

                        //add empty span
                        let empty = document.createElement('span');
                        resultText.appendChild(empty);

                        //add children to empty span
                        let edit = addTimeSettingsInterim(data);

                        for (let i = 0; i < edit.length; i++) {
                            resultText.lastElementChild.appendChild(edit[i]);
                            resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                        }
                        let height = parseInt($("#jubi-recording-text").height()) + 10;
                        document.getElementById("pm-buttonlock").style.paddingBottom = height + "px";
                        scrollUp();
                    } else if (dataFinal === true) {
                        if (resultText.lastElementChild) {
                            resultText.lastElementChild.remove();
                        }
                        //add empty span
                        let empty = document.createElement('span');
                        resultText.appendChild(empty);

                        //add children to empty span
                        let edit = addTimeSettingsFinal(data);
                        for (let i = 0; i < edit.length; i++) {
                            if (i === 0) {
                                edit[i].innerText = capitalize(edit[i].innerText);
                            }
                            resultText.lastElementChild.appendChild(edit[i]);

                            if (i !== edit.length - 1) {
                                resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                            }
                        }
                        resultText.lastElementChild.appendChild(document.createTextNode('\u00A0'));
                        // //console.log(wholeString);
                        // //console.log("Google Speech sent 'final' Sentence.");

                        finalWord = true;
                        removeLastSentence = false;
                        run(wholeString, "speech");
                        clearSpeechText();
                        await stopAllRecordings();
                    }
                    // //console.log("HEIGHT")
                    // //console.log($("#jubi-recording-text").height())
                }

                //voice record------------------


                //speech out-------
                async function textToSpeech(text) {
                    try {
                        await stopAllRecordings();
                    } catch (e) {
                        // //console.log(e);
                    }
                    try {
                        let postSpeech;
                        // try{
                        //     postSpeech=await convertAndPlaySpeechOnBrowser(text);
                        // }
                        // catch(e){
                        postSpeech = await convertAndPlaySpeechFromAPI(text);
                        // }
                        // afterVoiceOut(postSpeech);
                    } catch (e) {
                        // //console.log(e);
                    }
                }

                function afterVoiceOut(e) {
                    if (recordSemaphore) {
                        speechToText();
                        hidePlay();
                    }
                }

                function stopVoice() {
                    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;
                    // if(window.SpeechRecognition != null&&responsiveVoice&&responsiveVoice.voiceSupport()){
                    //     responsiveVoice.cancel();
                    // }
                    if (flush && isPlaying(flush)) {
                        flush.pause();
                        flush.currentTime = 0;
                    }
                }
                $(document).on('click', 'body *', function () {
                    stopVoice();
                });
                $(document).on('keypress', "body *", function () {
                    stopVoice();
                });

                // function convertAndPlaySpeechOnBrowser(text){
                //     return new Promise(async(resolve,reject)=>{
                //         try{
                //             window.SpeechRecognition = window.SpeechRecognition||window.webkitSpeechRecognition || null;
                //             if (window.SpeechRecognition === null) {
                //                 return reject()
                //             }
                // if(responsiveVoice.voiceSupport()){
                //     responsiveVoice.speak(text, window.speechOnBrowser||"Hindi Female", {onstart: ()=>{}, onend: (data)=>{
                //         return resolve(data)
                //     }});
                // }
                // else{
                //     return reject("no web support");
                // }
                //         }
                //         catch(e){
                //             // //console.log(e);
                //             return reject(e);
                //         }
                //     });

                // }

                function isPlaying(audelem) {
                    return !audelem.paused;
                }

                function removeHTMLTags(text) {
                    var div = document.createElement("div");
                    div.innerHTML = text;
                    return div.innerText;
                }

                function removeEmojis(string) {
                    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

                    return string.replace(regex, '');
                }

                function convertAndPlaySpeechFromAPI(text) {

                    return new Promise((resolve, reject) => {
                        text = removeHTMLTags(text);
                        text = removeEmojis(text);

                        if (!online) {
                            return reject({ status: "offline" });
                        }

                        let uid = IDGenerator(20);
                        let requestData = {
                            data: { text: removeHTMLTags(text),
                                gender: speechGenderBackend || "FEMALE",
                                languageCode: speechLanguageCodeBackend || "en-US"
                            },
                            webId: webId,
                            requestId: uid
                        };
                        socketVoice.emit("web-text-to-speech", crypterTransit.encrypt(requestData));
                        socketVoice.on("web-text-to-speech-" + webId + "-" + uid, data => {
                            // //console.log(data)
                            data = crypterTransit.decrypt(data);
                            playVoiceFromAPI(data);
                        });
                        function playVoiceFromAPI(speech) {
                            // speech = JSON.parse(crypterTransit.decrypt(speech))
                            if (speech.error) {
                                return reject(speech.error);
                            }
                            if (speech.status == "success") {
                                if (!flush || !isPlaying(flush)) {
                                    flush = new Audio(speech.url);
                                    flush.play();
                                    flush.onended = () => {
                                        return resolve(speech);
                                    };
                                } else {
                                    setTimeout(playVoiceFromAPI, 500, speech);
                                }
                            } else {
                                return reject(speech);
                            }
                        }
                    });
                }

                //speech out-------


                function getAllText(message) {
                    let str = "";
                    for (let element of message) {
                        if (element.type == "text") {
                            str += element.value;
                        }
                    }
                    str = str.replace(/\|br\|/g, "");
                    str = str.replace(/\|break\|/g, "");
                    return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, ' ');
                }

                function scrollUp() {
                    $("#pm-data").animate({ scrollTop: $("#pm-buttonlock").height() }, '1000000');

                    if ($("#pm-buttonlock").height() > $("#pm-data").height() && $("#pm-buttonlock").height() > 0) {
                        $("#pm-data").css("display", "block");
                    }
                }

                function postReply(res) {
                    //ENABLE TEXT, HIDE RIGHT LOADER
                    // $('#pm-Rightbxloadgif').remove();
                    $('.pm-Rightbxloadgif').hide();
                    document.getElementById('jubi-answerBottom').removeAttribute('disabled');
                    $(".inputfile").css("display", "block");
                    if (voiceEnabled && online && !mute) {
                        textToSpeech(getAllText(res.botMessage));
                    }
                    ////console.log(JSON.stringify(res, null, 3))
                    $(".pm-bxCheckOPtion").remove();
                    $(".pm-bxCheckOPtionUrl").remove();
                    $(".answer").parent().parent().remove();
                    let answerType = res.answerType;
                    let count = res.botMessage.length;
                    gender = res.gender;
                    profile = res.profile;
                    let i = 0;
                    let incrementDelay = 0;
                    let totalDelay = 0;
                    let delayPop = delayMaster;
                    let sleepDelay = delayMaster * (3 / 4);
                    let delay = delayMaster * (1 / 10);
                    if (semaphoreForFirstChatLoad) {
                        semaphoreForFirstChatLoad = false;
                    } else {
                        if (!document.getElementById("pm-bxloadgif")) {
                            let loader = prepareChatBotLoader();
                            $(".pm-bxChat").append(loader);
                            scrollUp();
                        }
                    }
                    show_replies(true);
                    async function show_replies(firstFlag) {
                        if (!$("#pm-bxloadgif").is(":visible")) {
                            $("#pm-buttonlock").append(prepareChatBotLoader());
                        }
                        $("#pm-bxloadgif").fadeOut(100);
                        $("#pm-bxloadgif").fadeIn(500);
                        if (!firstFlag) {
                            await waitForAwhile(delayMaster);
                        }
                        let chatBotReponse = "";
                        if (res.botMessage[i].value == "CLOSE_IFRAME_ASAP") {
                            $(".showEditIframe").fadeOut(600);
                            setTimeout(() => {
                                $(".showEditIframe").remove();
                            }, 200);
                            res.botMessage.splice(i, 1);
                        } else if (res.botMessage[i].type == "text" && res.botMessage[i].value !== "") {
                            let url = res.botMessage[i].value.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/);
                            if (url) {
                                res.botMessage[i].value = res.botMessage[i].value.replaceAll(url[0], "<a target='_blank' href='" + url[0] + "'>" + url[0] + "</a>");
                            }
                            // if (i == 0 && lastConversationSemaphore) {
                            //     chatBotReponse = prepareChatBotReply(res.botMessage[i].value);
                            //     if (backendResponse && booleanHideShow != true) {
                            //         backendResponse = parseInt(backendResponse) + 1;
                            //     }
                            // }
                            // // else 
                            if (i == 0) {
                                chatBotReponse = prepareChatBotFirstReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareChatBotReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "image") {
                            if (i == 0) {
                                chatBotReponse = prepareChatBotFirstImageReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareChatBotImageReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "video") {
                            // //console.log(res.botMessage[i].type + res.botMessage[i].value + "****")
                            // //console.log(lastConversationSemaphore);
                            if (i == 0) {
                                chatBotReponse = prepareFirstVideoReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareVideoReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else if (res.botMessage[i].type == "file" || res.botMessage[i].type == "audio") {
                            if (i == 0) {
                                chatBotReponse = prepareFirstFileReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            } else {
                                chatBotReponse = prepareFileReply(res.botMessage[i].value);
                                if (backendResponse && booleanHideShow != true) {
                                    backendResponse = parseInt(backendResponse) + 1;
                                }
                            }
                            i++;
                        } else {
                            res.botMessage.splice(i, 1);
                        }
                        if (chatBotReponse) {
                            pushToChat(chatBotReponse);
                            $(".pm-bxloadgif").remove();
                        }

                        // if(i>0){
                        //     await waitForAwhile(700);

                        // }
                        scrollUp();
                        if (i == res.botMessage.length) {
                            lastConversationSemaphore = false;
                            if (res.options) {
                                pushToChat(prepareUserInput(res.answerType, res.options));
                            }
                            // else {
                            //     showTextInput();
                            // }
                        } else {
                            // //console.log("Show replies")
                            show_replies(false);
                        }
                    }
                    msgIndex++;
                }
                function waitForAwhile(time) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            return resolve();
                        }, time);
                    });
                }
                function prepareUserInput(questionType, options) {
                    if (questionType == 'option') {
                        let str = optionStart();
                        for (let i = 0; i < options.length; i++) {
                            str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                        }

                        str = str + optionEnd();
                        return str;
                    } else if (questionType == 'persist-option') {
                        let str = optionPersistStart();
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].type == "url") {
                                str = str + "<li><a href='" + htmlInjectionPrevent(options[i].data) + "' target='_blank' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].text) + "' class='question-options-persist-url'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            } else if (options[i].type == "webView") {
                                str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options-persist-webView'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            } else {
                                str = str + "<li><a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(options[i].text) + "'  inner-id='" + htmlInjectionPrevent(options[i].data) + "' class='question-options-persist'>" + htmlInjectionPrevent(options[i].text) + "</a></li>";
                            }
                        }

                        str = str + optionEnd();
                        return str;
                    } else if (questionType = "generic") {
                        let str = buildGeneric(options);
                        // //console.log(str)
                        setTimeout(function () {
                            slidebx();
                        }, 0);
                        return str;
                    }
                }
                function pushToChatStart(str) {
                    $(".pm-bxChat").append(str);
                    // $(".pm-bxLeftchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxRightchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    // $(".pm-bxCheckOPtionPersist:last-child").hide();
                    // $(".pm-bxCheckOPtionPersist:last-child").animate({ "opacity": "show", bottom: "40" }, 800);
                }
                function pushToChat(str) {
                    $("#pm-bxloadgif").remove();
                    $("#pm-bxloadgif").animate({ "opacity": "hide", bottom: "10" }, 300);
                    $(".pm-bxChat").append(str);
                    $(".pm-bxLeftchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    $(".pm-bxRightchat:last-child").animate({ "opacity": "show", bottom: "10" }, 800);
                    $(".pm-bxCheckOPtionPersist:last-child").hide();
                    $(".pm-bxCheckOPtionPersist:last-child").animate({ "opacity": "show", bottom: "40" }, 800);
                    chatArray.push(str);
                    // //console.log(chatArray);
                    setLocalStorageData(localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(chatArray)));
                    setLocalStorageData("webId_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify({ id: webId })));
                }
                function pushToView(str) {
                    $("#pm-mainSec").append(str);
                }

                function prepareJSONRequest(answer) {
                    return {
                        text: answer
                    };
                }
                function genericStart() {
                    return '<div class="pm-owlsliderbx"><div class="slider-inner pm-slider-inner"><div  class="owl-carousel owl-theme">';
                }
                function replaceAll(str, find, replace) {
                    if (typeof str == "string") {
                        return str.replace(new RegExp(find, 'g'), replace);
                    }
                    return str;
                }
                function buildGeneric(data) {
                    let html = '';
                    if (data && data.length > 0 && data[0].buttons && data[0].buttons.length > 0) {
                        html = genericStart();
                        for (let i = 0; i < data.length; i++) {
                            html += '<div class="item">';
                            if (data[i].image) {
                                html += '<div class="pm-slideImage"><img src="' + data[i].image + '"></div>';
                            }
                            html += '<div class="pm-sliderContent">';
                            if (data[i].title) {
                                html += '<h5> ' + data[i].title + '</h5>';
                            }
                            if (data[i].text) {
                                // //console.log(data[i].text)
                                html += '<p>' + data[i].text.replaceAll("|br|", "<br/>") + '</p>';
                            }
                            html += '</div><div class="pm-bxslidebtn">';
                            for (let j = 0; j < data[i].buttons.length; j++) {
                                let options = data[i].buttons[j];
                                options.text = replaceAll(options.text, "'", " ");
                                options.data = replaceAll(options.data, '"', " ");
                                if (options.type == "url") {
                                    html += "<a href='" + options.data + "' target='_blank' data-id='" + htmlInjectionPrevent(data[i].title) + "' inner-id='" + htmlInjectionPrevent(options.data) + "' class='question-options-url'>" + htmlInjectionPrevent(options.text) + "</a> ";
                                } else {
                                    html += "<a href='javascript:void(0);' data-id='" + htmlInjectionPrevent(data[i].title) + "' inner-id='" + htmlInjectionPrevent(options.data) + "' class='question-options'>" + htmlInjectionPrevent(options.text) + "</a> ";
                                }
                            }
                            html += '</div>';
                            html += '</div>';
                        }

                        html += genericEnd();
                    }
                    return html;
                }
                function genericEnd() {
                    return '</div></div></div>';
                }
                function prepareChatBotReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput' >" + "<p>" + msg.replaceAll("|br|", "<br/>") + "</p>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput' >" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<p>" + msg.replaceAll("|br|", "<br/>") + "</p>" + '<div class="jubi-msgReplyTime jubi-left_msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFirstFileReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFileReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstImageReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotImageReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFirstVideoReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + ' <iframe   src="' + msg + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareVideoReply(msg) {
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + ' <iframe   src="' + msg + '" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>' + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotLoader() {
                    let d = getTime();
                    return "<div id='pm-bxloadgif' class='pm-bxuser_question pm-bxloadgif ' style='visibility: visible;'><div class='pm-leftInputGif'><div class='pm-leftUserimg'><img src='" + modal.static.images.botIcon + "' class='img-responsive'></div><div class='pm-innerloadgif'>" + "<img src='" + modal.static.images.loaderBotChat + "' />" + "</div></div></div>";
                }
                function prepareChatBotUserLoader() {
                    return "<div class='pm-bxRightchat'>" + "<div id='pm-Rightbxloadgif' class='pm-bxuser_question pm-Rightbxloadgif'>" + "<div class='pm-leftInputGif'>" +
                    // // "<div class='pm-leftUserimg'>"+
                    // //     "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>"+
                    // // "</div>"+
                    // "<div class='pm-rightUserimg'><img src='./images/user.png'></div>"+
                    "<div class='pm-innerloadgif pm-Rightinnerloadgif'>" + "<img src='" + modal.static.images.loaderBotChat + "' />" + "</div>" + "</div>" + "</div>" + "</div>";
                }
                function showWebView(url) {
                    return '<div class="showEditIframe" id="iframeView">' + '<div class="closeIframeBtn"><img src="' + modal.static.images.closeWebView + '" class="img-responsive"></div>' + '<iframe src="' + url + '" frameborder="0" -webkit-overflow-scrolling:="" touch;="" allowfullscreen="" style="overflow:hidden;"></iframe>' + '</div>';
                }
                function showFile(answer) {

                    let arr = answer.split(">");
                    if (arr.length == 2) {
                        let isImage = checkForImage(arr[1]);
                        let imageUrl = htmlInjectionPrevent(arr[1]);
                        let d = getTime();
                        if (isImage) {
                            return "<div class='pm-bxRightchat'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<div class='pm-postImg'>" + "<a href='" + imageUrl + "' target='_blank'><img src='" + imageUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                        } else {
                            return "<div class='pm-bxRightchat'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<a href='" + imageUrl + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                        }
                    } else {
                        return;
                    }
                }
                function checkForImage(url) {
                    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
                }
                function showAnswer(answer) {
                    let d = getTime();
                    return "<div class='pm-bxRightchat' style='visibility: visible;'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function showMaleAnswer(answer) {
                    return "<div class='pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function showFemaleAnswer(answer) {

                    return "<div class='pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img src='" + modal.static.images.userFemaleIcon + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function optionStart() {
                    return "<div class='pm-bxCheckOPtion' style='visibility: visible; '>" + "<ul >";
                }
                function optionPersistStart() {
                    return "<div class='pm-bxCheckOPtionPersist' style='visibility: visible; '>" + "<ul >";
                }
                function optionEnd() {
                    return "</ul></div>";
                }
                function showProfileAnswer(answer) {
                    return "<div class='pm-bxRightchat' style='visibility: visible;'>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<p>" + htmlInjectionPrevent(answer) + "</p>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img style='border-radius: 100px;' src='" + profile + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function prepareTextInputProfileBox() {
                    return "<div class='pm-anwser-div pm-bxRightchat' style='visibility: visible; '>" + "<div class='pm-rightInput'>" + "<div class='pm-arrowRightchat pm-arrow-right'></div>" + "<input class='form-control input-lg answer' data-id='" + msgIndex.toString() + "' autofocus='autofocus' type='text' placeholder='Type and hit enter'>" + "<div class='pm-pointRightchat'>" + "</div>" + "<div class='clearfix'></div>" + "</div>" + "<div class='pm-rightUserimg'>" + "<img style='border-radius: 100px;' src='" + profile + "' class='img-responsive'>" + "</div>" + "<div class='clearfix'></div>" + "</div>";
                }
                function sendMessage(data, type) {
                    $(".pm-bxCheckOPtion").remove();
                    $(".pm-bxCheckOPtionUrl").remove();
                    $(".answer").parent().parent().remove();
                    $('.pm-Rightbxloadgif').hide();

                    document.getElementById('jubi-answerBottom').removeAttribute('disabled');
                    $(".inputfile").css("display", "block");
                    if (tags && !tags.blockBot) {
                        // //console.log(JSON.stringify(data, null, 3))
                        deviceInfo.inputType = type || "text";
                        if (!document.getElementById("pm-bxloadgif")) {
                            let loader = prepareChatBotLoader();
                            $(".pm-bxChat").append(loader);
                        }
                        scrollUp();
                        setTimeout(_ => {
                            $("#pm-bxloadgif").remove();
                            $("#pm-bxloadgif").animate({ "opacity": "hide", bottom: "10" }, 300);
                        }, 5000);
                    }

                    setTimeout(() => {
                        data.text = currentButtonContext[data.text.toLowerCase().trim()] || data.text;
                        ce.processInput(data.text);
                    }, 100);
                }
                function slidebx() {
                    let count = 0;
                    $('.owl-carousel').each(function () {
                        $(this).attr('id', 'owl-demo' + count);
                        $('#owl-demo' + count).owlCarousel({
                            items: 2,
                            // singleItem:true,
                            // itemsDesktop: [1000, 1], 
                            // itemsDesktopSmall: [900, 1], 
                            // itemsTablet: [700, 1], 
                            // itemsMobile: [479, 1], 
                            navigation: true,
                            navigation: !0,
                            navigationText: ["&#8249", "&#8250"],
                            nav: true,
                            responsiveClass: true,
                            responsive: {
                                0: {
                                    items: 1
                                },
                                700: {
                                    items: 1
                                },
                                900: {
                                    items: 2
                                },
                                1300: {
                                    items: 2
                                }
                            }

                        });
                        count++;
                    });
                }

                $('body').on("change", ".jubi-file-upload", function (e) {
                    //console.log("FILE UPLOAD")
                    $("#pm-buttonlock").append(prepareChatBotUserLoader());
                    scrollUp();
                    let timeoutVar = setTimeout(() => {
                        let str = showAnswer("Could not upload file. Please try a smaller file. Should be below 500kb ideally.");
                        scrollUp();
                        $('.pm-Rightbxloadgif').hide();
                        document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                        $(".inputfile").css("display", "none");
                        pushToChat(str);
                    }, 30000);
                    let input = e.target;
                    if (input.files && input.files[0]) {
                        let reader = new FileReader();
                        reader.readAsDataURL(input.files[0]);
                        reader.onloadend = function () {
                            let data = {
                                file: this.result,
                                webId: new Date().getTime()
                            };
                            if (online) {
                                socketUpload.emit('file', crypterTransit.encrypt(JSON.stringify(data)));
                                socketUpload.on('upload-complete-' + data.webId, function (data) {
                                    data = JSON.parse(crypterTransit.decrypt(data));
                                    // //console.log(JSON.stringify(data))
                                    if (data.url) {
                                        clearInterval(timeoutVar);
                                        run("upload_file>" + data.url, "file");
                                        //RIGHT LOADER
                                        // $('#jubi-answerBottom').prop('disabled', true);
                                        document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                                        $(".inputfile").css("display", "none");
                                    }
                                });
                            }
                        };
                    } else {
                        let files = !!this.files ? this.files : [];
                        if (!files.length || !window.FileReader) return;
                        if (/^image/.test(files[0].type)) {
                            let reader = new FileReader();
                            reader.readAsDataURL(files[0]);
                            reader.onloadend = function () {
                                let data = {
                                    file: this.result,
                                    webId: webId
                                };
                                if (online) {
                                    socketUpload.emit('file', crypterTransit.encrypt(JSON.stringify(data)));
                                    socketUpload.on('upload-complete-' + data.webId, function (data) {
                                        data = JSON.parse(crypterTransit.decrypt(data));
                                        if (data.url) {
                                            clearInterval(timeoutVar);
                                            // //console.log(JSON.stringify(data))
                                            run("upload_file>" + data.url, "file");
                                            //RIGHT LOADER
                                            // $('#jubi-answerBottom').prop('disabled', true);
                                            document.getElementById('jubi-answerBottom').setAttribute('disabled', 'disabled');
                                            $(".inputfile").css("display", "none");
                                        }
                                    });
                                }
                            };
                        }
                    }
                });

                $("body").on('click', '.question-options-persist-webView', function (e) {
                    let url = $(this).attr('inner-id');
                    let str = showWebView(url);
                    scrollUp();
                    pushToView(str);
                });
                $("body").on('click', ".closeIframeBtn", function (e) {
                    $(".showEditIframe").fadeOut(600);
                    setTimeout(() => {
                        $(".showEditIframe").remove();
                    }, 1000);
                });
                $(".pm-menu_val").click(function (e) {
                    let answer = $(this).text();
                    if (answer.trim() != "") {
                        lastConversationSemaphore = true;
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('click', '.bxgetthefull', function (e) {
                    lastConversationSemaphore = true;
                    let inner = $(this).attr('inner-id');
                    let answer = $(this).attr('data-id');
                    $(".pm-bxCheckOPtion").remove();
                    $(".answer").parent().parent().remove();

                    let str = null;
                    if (profile) {
                        str = showProfileAnswer(answer);
                    } else if (gender && gender == "male") {
                        str = showMaleAnswer(answer);
                    } else if (gender && gender == "female") {
                        str = showFemaleAnswer(answer);
                    } else {
                        str = showAnswer(answer);
                    }
                    scrollUp();
                    pushToChat(str);
                    let ans1 = prepareJSONRequest(inner);
                    sendMessage(ans1);
                });
                $("body").on('click', '.question-options', function (e) {
                    stopVoice();
                    if (e.originalEvent && e.originalEvent.isTrusted) {
                        lastConversationSemaphore = true;
                        let inner = $(this).attr('inner-id');
                        let answer = $(this).attr('data-id');
                        $(".bxCheckOPtion").remove();
                        $(".answer").parent().parent().remove();

                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(inner);
                        sendMessage(ans1);
                    }
                });
                $("body").on('click', '.question-options-persist', function (e) {
                    if (e.originalEvent && e.originalEvent.isTrusted) {
                        lastConversationSemaphore = true;
                        let inner = $(this).attr('inner-id');
                        let answer = $(this).attr('data-id');
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(inner);
                        sendMessage(ans1);
                    }
                });
                $('body').on('click', '#pm-bottomClick', function () {
                    let answer = $("#pm-answerBottom").val();

                    answer = answer.trim();
                    if (answer === "") {
                        $('#answerBottom').val('').empty();
                    }

                    if (answer != "") {
                        lastConversationSemaphore = true;
                        $("#pm-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        // $(".sec_slider").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('keypress', '#pm-answerBottom', function (e) {

                    let answer = $("#pm-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#pm-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $('body').on('click', '#jubi-bottomClick', function () {
                    let answer = $("#jubi-answerBottom").val();

                    answer = answer.trim();
                    if (answer === "") {
                        $('#answerBottom').val('').empty();
                    }

                    if (answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        // $(".sec_slider").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("body").on('keypress', '#jubi-answerBottom', function (e) {

                    let answer = $("#jubi-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });

                $("#jubi-answerBottom").keydown(function (e) {

                    let answer = $("#jubi-answerBottom").val();
                    answer = answer.trim();
                    if (e.which == 13 && answer != "") {
                        lastConversationSemaphore = true;
                        $("#jubi-answerBottom").val("");
                        $(".pm-bxCheckOPtion").remove();
                        $(".pm-bxCheckOPtionUrl").remove();
                        let str = null;
                        if (profile) {
                            str = showProfileAnswer(answer);
                        } else if (gender && gender == "male") {
                            str = showMaleAnswer(answer);
                        } else if (gender && gender == "female") {
                            str = showFemaleAnswer(answer);
                        } else {
                            str = showAnswer(answer);
                        }
                        scrollUp();
                        pushToChat(str);
                        let ans1 = prepareJSONRequest(answer);
                        sendMessage(ans1);
                    }
                });
                $("#pm-answerBottom").click(scrollUp);
                $("#jubi-answerBottom").click(scrollUp);
                $(".pm-showmenubx").css("display", "none");
                $(".pm-showMenu").click(function () {
                    $(".pm-showmenubx").toggle(400);
                });
                $("#pm-bottomClick").click(function () {
                    setTimeout(function () {
                        $('#pm-answerBottom').val('').empty();
                    }, 500);
                });
                $("#pm-answerBottom").on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        $('#pm-answerBottom').val('').empty();
                    }
                });
                $("#jubi-bottomClick").click(function () {
                    setTimeout(function () {
                        $('#jubi-answerBottom').val('').empty();
                    }, 500);
                });
                $("#jubi-answerBottom").on('keyup', function (e) {
                    if (e.keyCode == 13) {
                        $('#jubi-answerBottom').val('').empty();
                    }
                });
                $(".pm-btnClose").click(function () {
                    $(".pm-secCloseMsg").hide(200);
                });
                $(".pm-iconMenu").click(function () {
                    $("#pm-secMenucontent").toggle();
                });
                $("#pm-secMenucontent").click(function () {
                    $("#pm-secMenucontent").hide();
                });
                $('.pm-bxform').click(function () {
                    $("#pm-secMenucontent").hide();
                });
                $(".pm-bxChat").animate({ scrollTop: $(document).height() }, "slow");
                $(".pm-btnClose").click(function () {
                    $(".pm-secCloseMsg").hide();
                });
                $("#pm-secCloseview").click(function () {
                    $('#pm-chatOpenClose').toggleClass('doChatOpenClose');
                });

                $(".pm-sec_closeview").click(function () {
                    $(".pm-sec_closeview").hide();
                    $(".pm-sec_calliframe").fadeIn(500);
                    $(".pm-secHideChat").show(500);
                    $(".pm-secCloseMsg").hide();
                    booleanHideShow = true;
                    backendResponse = '0';
                });
                $(".pm-secHideChat").click(function () {
                    $(".pm-sec_calliframe").hide(500);
                    $(".pm-sec_closeview").show(800);
                    $(".pm-secHideChat").hide(500);
                    $('#pm-chatOpenClose').removeClass('doChatOpenClose');
                    booleanHideShow = false;
                });
                $("#pm-sec_closeviewMobile").click(function () {
                    $("#pm-sec_closeviewMobile").hide(500);
                    $(".pm-sec_calliframe").fadeIn(500);
                });
                $("#pm-secHideMobileChat").click(function () {
                    $(".pm-sec_calliframe").hide(500);
                    $("#pm-sec_closeviewMobile").show(500);
                });
                boot();
            }
            //Helper Functions
            // Clones an Object
            function clone(obj) {
                return JSON.parse(JSON.stringify(obj));
            }
            //Chooses random value
            function getRandom(max) {
                return Math.floor(Math.random() * Math.floor(max));
            }
            //Fetch Get Params
            function get(name) {
                if (name = new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)').exec(location.search)) {
                    return decodeURIComponent(name[1]);
                }
            }
            //Generates random id
            function IDGenerator(length) {
                let timestamp = +new Date();
                let _getRandomInt = function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };
                let ts = timestamp.toString();
                let parts = ts.split("").reverse();
                let id = "";

                for (let i = 0; i < length; ++i) {
                    let index = _getRandomInt(0, parts.length - 1);
                    id += parts[index];
                }
                return id;
            }
            // function doesConnectionExist() {
            //     return new Promise((resolve,reject)=>{
            //         let xhr = new XMLHttpRequest();
            //         let randomNum = Math.round(Math.random() * 10000);

            //         xhr.open('HEAD', window.location + "?rand=" + randomNum, true);
            //         xhr.send();

            //         xhr.addEventListener("readystatechange", processRequest, false);

            //         function processRequest(e) {
            //         if (xhr.readyState == 4) {
            //             if (xhr.status >= 200 && xhr.status < 304) {
            //                 return resolve(true);
            //             } else {
            //                 return resolve(false);
            //             }
            //         }
            //         }
            //     })
            // }
            //Invoking Chain of operations
            init();
        })();
    }, { "sentence-tokenizer": 8, "string-similarity": 12, "string-tokenizer": 14, "wink-bm25-text-search": 16, "wink-nlp-utils": 61 }], 3: [function (require, module, exports) {
        /*!
         * array-last <https://github.com/jonschlinkert/array-last>
         *
         * Copyright (c) 2014-2017, Jon Schlinkert.
         * Released under the MIT License.
         */

        var isNumber = require('is-number');

        module.exports = function last(arr, n) {
            if (!Array.isArray(arr)) {
                throw new Error('expected the first argument to be an array');
            }

            var len = arr.length;
            if (len === 0) {
                return null;
            }

            n = isNumber(n) ? +n : 1;
            if (n === 1) {
                return arr[len - 1];
            }

            var res = new Array(n);
            while (n--) {
                res[n] = arr[--len];
            }
            return res;
        };
    }, { "is-number": 4 }], 4: [function (require, module, exports) {
        /*!
         * is-number <https://github.com/jonschlinkert/is-number>
         *
         * Copyright (c) 2014-2017, Jon Schlinkert.
         * Released under the MIT License.
         */

        'use strict';

        module.exports = function isNumber(num) {
            var type = typeof num;

            if (type === 'string' || num instanceof String) {
                // an empty string would be coerced to true with the below logic
                if (!num.trim()) return false;
            } else if (type !== 'number' && !(num instanceof Number)) {
                return false;
            }

            return num - num + 1 >= 0;
        };
    }, {}], 5: [function (require, module, exports) {
        'use strict';

        // modified from https://github.com/es-shims/es5-shim

        var has = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;
        var slice = Array.prototype.slice;
        var isArgs = require('./isArguments');
        var isEnumerable = Object.prototype.propertyIsEnumerable;
        var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
        var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
        var dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
        var equalsConstructorPrototype = function (o) {
            var ctor = o.constructor;
            return ctor && ctor.prototype === o;
        };
        var excludedKeys = {
            $applicationCache: true,
            $console: true,
            $external: true,
            $frame: true,
            $frameElement: true,
            $frames: true,
            $innerHeight: true,
            $innerWidth: true,
            $outerHeight: true,
            $outerWidth: true,
            $pageXOffset: true,
            $pageYOffset: true,
            $parent: true,
            $scrollLeft: true,
            $scrollTop: true,
            $scrollX: true,
            $scrollY: true,
            $self: true,
            $webkitIndexedDB: true,
            $webkitStorageInfo: true,
            $window: true
        };
        var hasAutomationEqualityBug = function () {
            /* global window */
            if (typeof window === 'undefined') {
                return false;
            }
            for (var k in window) {
                try {
                    if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
                        try {
                            equalsConstructorPrototype(window[k]);
                        } catch (e) {
                            return true;
                        }
                    }
                } catch (e) {
                    return true;
                }
            }
            return false;
        }();
        var equalsConstructorPrototypeIfNotBuggy = function (o) {
            /* global window */
            if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
                return equalsConstructorPrototype(o);
            }
            try {
                return equalsConstructorPrototype(o);
            } catch (e) {
                return false;
            }
        };

        var keysShim = function keys(object) {
            var isObject = object !== null && typeof object === 'object';
            var isFunction = toStr.call(object) === '[object Function]';
            var isArguments = isArgs(object);
            var isString = isObject && toStr.call(object) === '[object String]';
            var theKeys = [];

            if (!isObject && !isFunction && !isArguments) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var skipProto = hasProtoEnumBug && isFunction;
            if (isString && object.length > 0 && !has.call(object, 0)) {
                for (var i = 0; i < object.length; ++i) {
                    theKeys.push(String(i));
                }
            }

            if (isArguments && object.length > 0) {
                for (var j = 0; j < object.length; ++j) {
                    theKeys.push(String(j));
                }
            } else {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && has.call(object, name)) {
                        theKeys.push(String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

                for (var k = 0; k < dontEnums.length; ++k) {
                    if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
                        theKeys.push(dontEnums[k]);
                    }
                }
            }
            return theKeys;
        };

        keysShim.shim = function shimObjectKeys() {
            if (Object.keys) {
                var keysWorksWithArguments = function () {
                    // Safari 5.0 bug
                    return (Object.keys(arguments) || '').length === 2;
                }(1, 2);
                if (!keysWorksWithArguments) {
                    var originalKeys = Object.keys;
                    Object.keys = function keys(object) {
                        // eslint-disable-line func-name-matching
                        if (isArgs(object)) {
                            return originalKeys(slice.call(object));
                        } else {
                            return originalKeys(object);
                        }
                    };
                }
            } else {
                Object.keys = keysShim;
            }
            return Object.keys || keysShim;
        };

        module.exports = keysShim;
    }, { "./isArguments": 6 }], 6: [function (require, module, exports) {
        'use strict';

        var toStr = Object.prototype.toString;

        module.exports = function isArguments(value) {
            var str = toStr.call(value);
            var isArgs = str === '[object Arguments]';
            if (!isArgs) {
                isArgs = str !== '[object Array]' && value !== null && typeof value === 'object' && typeof value.length === 'number' && value.length >= 0 && toStr.call(value.callee) === '[object Function]';
            }
            return isArgs;
        };
    }, {}], 7: [function (require, module, exports) {
        'use strict';

        module.exports = function (obj) {
            var keys = Object.keys(obj);
            var ret = [];

            for (var i = 0; i < keys.length; i++) {
                ret.push(obj[keys[i]]);
            }

            return ret;
        };
    }, {}], 8: [function (require, module, exports) {
        "use strict";

        // eslint-disable-next-line no-unused-vars

        var debug = require('debug')('tokenizer');

        function compact(str) {
            var res = str.trim();
            res = res.replace('  ', ' ');
            return res;
        }

        function Tokenizer(username, botname) {

            // // Maybe it is not useful
            // if (!(this instanceof Tokenizer)) {
            //   return new Tokenizer();
            // }

            this.username = username || 'Guy';
            this.entry = null;
            this.sentences = null;

            if (typeof botname == 'string') {
                this.botname = botname;
            } else {
                this.botname = 'ECTOR';
            }
        }

        Tokenizer.prototype = {
            setEntry: function (entry) {
                this.entry = compact(entry);
                this.sentences = null;
            },
            // Split the entry into sentences.
            getSentences: function () {
                // this.sentences = this.entry.split(/[\.!]\s/);
                if (!this.entry) return [];
                var words = this.entry.split(' ');
                var endingWords = words.filter(function (w) {
                    return w.endsWith('.') || w.endsWith('!') || w.endsWith('?');
                });

                var self = this;
                var botnameRegExp = new RegExp("\\W?" + self.botname.normalize() + "\\W?");
                var usernameRegExp = new RegExp("\\W?" + self.username.normalize() + "\\W?");
                var lastSentence = words[0];
                self.sentences = [];
                words.reduce(function (prev, cur) {
                    var curNormalized = cur.normalize();
                    var curReplaced = cur;
                    if (curNormalized.search(botnameRegExp) !== -1) {
                        curReplaced = cur.replace(self.botname, "{yourname}");
                    } else if (curNormalized.search(usernameRegExp) !== -1) {
                        curReplaced = cur.replace(self.username, "{myname}");
                    }

                    if (endingWords.indexOf(prev) != -1) {
                        self.sentences.push(compact(lastSentence));
                        lastSentence = "";
                    }
                    lastSentence = lastSentence + " " + curReplaced;
                    return cur;
                });
                self.sentences.push(compact(lastSentence));
                return this.sentences;
            },
            // Get the tokens of one sentence
            getTokens: function (sentenceIndex) {
                var s = 0;
                if (typeof sentenceIndex === 'number') s = sentenceIndex;
                return this.sentences[s].split(' ');
            }
        };

        module.exports = Tokenizer;
    }, { "debug": 9 }], 9: [function (require, module, exports) {
        (function (process) {
            /* eslint-env browser */

            /**
             * This is the web browser implementation of `debug()`.
             */

            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;
            exports.storage = localstorage();

            /**
             * Colors.
             */

            exports.colors = ['#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC', '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF', '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC', '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF', '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC', '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033', '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366', '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933', '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC', '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF', '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'];

            /**
             * Currently only WebKit-based Web Inspectors, Firefox >= v31,
             * and the Firebug extension (any Firefox version) are known
             * to support "%c" CSS customizations.
             *
             * TODO: add a `localStorage` variable to explicitly enable/disable colors
             */

            // eslint-disable-next-line complexity
            function useColors() {
                // NB: In an Electron preload script, document will be defined but not fully
                // initialized. Since we know we're in Chrome, we'll just detect this case
                // explicitly
                if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
                    return true;
                }

                // Internet Explorer and Edge do not support colors.
                if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
                    return false;
                }

                // Is webkit? http://stackoverflow.com/a/16459606/376773
                // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
                return typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance ||
                // Is firebug? http://stackoverflow.com/a/398120/376773
                typeof window !== 'undefined' && window.console && (window.console.firebug || window.console.exception && window.console.table) ||
                // Is firefox >= v31?
                // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
                typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 ||
                // Double check webkit in userAgent just in case we are in a worker
                typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
            }

            /**
             * Colorize log arguments if enabled.
             *
             * @api public
             */

            function formatArgs(args) {
                args[0] = (this.useColors ? '%c' : '') + this.namespace + (this.useColors ? ' %c' : ' ') + args[0] + (this.useColors ? '%c ' : ' ') + '+' + module.exports.humanize(this.diff);

                if (!this.useColors) {
                    return;
                }

                const c = 'color: ' + this.color;
                args.splice(1, 0, c, 'color: inherit');

                // The final "%c" is somewhat tricky, because there could be other
                // arguments passed either before or after the %c, so we need to
                // figure out the correct index to insert the CSS into
                let index = 0;
                let lastC = 0;
                args[0].replace(/%[a-zA-Z%]/g, match => {
                    if (match === '%%') {
                        return;
                    }
                    index++;
                    if (match === '%c') {
                        // We only are interested in the *last* %c
                        // (the user may have provided their own)
                        lastC = index;
                    }
                });

                args.splice(lastC, 0, c);
            }

            /**
             * Invokes `console.log()` when available.
             * No-op when `console.log` is not a "function".
             *
             * @api public
             */
            function log(...args) {
                // This hackery is required for IE8/9, where
                // the `console.log` function doesn't have 'apply'
                return typeof console === 'object' && console.log && console.log(...args);
            }

            /**
             * Save `namespaces`.
             *
             * @param {String} namespaces
             * @api private
             */
            function save(namespaces) {
                try {
                    if (namespaces) {
                        exports.storage.setItem('debug', namespaces);
                    } else {
                        exports.storage.removeItem('debug');
                    }
                } catch (error) {
                    // Swallow
                    // XXX (@Qix-) should we be logging these?
                }
            }

            /**
             * Load `namespaces`.
             *
             * @return {String} returns the previously persisted debug modes
             * @api private
             */
            function load() {
                let r;
                try {
                    r = exports.storage.getItem('debug');
                } catch (error) {}
                // Swallow
                // XXX (@Qix-) should we be logging these?


                // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
                if (!r && typeof process !== 'undefined' && 'env' in process) {
                    r = process.env.DEBUG;
                }

                return r;
            }

            /**
             * Localstorage attempts to return the localstorage.
             *
             * This is necessary because safari throws
             * when a user disables cookies/localstorage
             * and you attempt to access it.
             *
             * @return {LocalStorage}
             * @api private
             */

            function localstorage() {
                try {
                    // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
                    // The Browser also has localStorage in the global context.
                    return localStorage;
                } catch (error) {
                    // Swallow
                    // XXX (@Qix-) should we be logging these?
                }
            }

            module.exports = require('./common')(exports);

            const { formatters } = module.exports;

            /**
             * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
             */

            formatters.j = function (v) {
                try {
                    return JSON.stringify(v);
                } catch (error) {
                    return '[UnexpectedJSONParseError]: ' + error.message;
                }
            };
        }).call(this, require('_process'));
    }, { "./common": 10, "_process": 1 }], 10: [function (require, module, exports) {

        /**
         * This is the common logic for both the Node.js and web browser
         * implementations of `debug()`.
         */

        function setup(env) {
            createDebug.debug = createDebug;
            createDebug.default = createDebug;
            createDebug.coerce = coerce;
            createDebug.disable = disable;
            createDebug.enable = enable;
            createDebug.enabled = enabled;
            createDebug.humanize = require('ms');

            Object.keys(env).forEach(key => {
                createDebug[key] = env[key];
            });

            /**
            * Active `debug` instances.
            */
            createDebug.instances = [];

            /**
            * The currently active debug mode names, and names to skip.
            */

            createDebug.names = [];
            createDebug.skips = [];

            /**
            * Map of special "%n" handling functions, for the debug "format" argument.
            *
            * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
            */
            createDebug.formatters = {};

            /**
            * Selects a color for a debug namespace
            * @param {String} namespace The namespace string for the for the debug instance to be colored
            * @return {Number|String} An ANSI color code for the given namespace
            * @api private
            */
            function selectColor(namespace) {
                let hash = 0;

                for (let i = 0; i < namespace.length; i++) {
                    hash = (hash << 5) - hash + namespace.charCodeAt(i);
                    hash |= 0; // Convert to 32bit integer
                }

                return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
            }
            createDebug.selectColor = selectColor;

            /**
            * Create a debugger with the given `namespace`.
            *
            * @param {String} namespace
            * @return {Function}
            * @api public
            */
            function createDebug(namespace) {
                let prevTime;

                function debug(...args) {
                    // Disabled?
                    if (!debug.enabled) {
                        return;
                    }

                    const self = debug;

                    // Set `diff` timestamp
                    const curr = Number(new Date());
                    const ms = curr - (prevTime || curr);
                    self.diff = ms;
                    self.prev = prevTime;
                    self.curr = curr;
                    prevTime = curr;

                    args[0] = createDebug.coerce(args[0]);

                    if (typeof args[0] !== 'string') {
                        // Anything else let's inspect with %O
                        args.unshift('%O');
                    }

                    // Apply any `formatters` transformations
                    let index = 0;
                    args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
                        // If we encounter an escaped % then don't increase the array index
                        if (match === '%%') {
                            return match;
                        }
                        index++;
                        const formatter = createDebug.formatters[format];
                        if (typeof formatter === 'function') {
                            const val = args[index];
                            match = formatter.call(self, val);

                            // Now we need to remove `args[index]` since it's inlined in the `format`
                            args.splice(index, 1);
                            index--;
                        }
                        return match;
                    });

                    // Apply env-specific formatting (colors, etc.)
                    createDebug.formatArgs.call(self, args);

                    const logFn = self.log || createDebug.log;
                    logFn.apply(self, args);
                }

                debug.namespace = namespace;
                debug.enabled = createDebug.enabled(namespace);
                debug.useColors = createDebug.useColors();
                debug.color = selectColor(namespace);
                debug.destroy = destroy;
                debug.extend = extend;
                // Debug.formatArgs = formatArgs;
                // debug.rawLog = rawLog;

                // env-specific initialization logic for debug instances
                if (typeof createDebug.init === 'function') {
                    createDebug.init(debug);
                }

                createDebug.instances.push(debug);

                return debug;
            }

            function destroy() {
                const index = createDebug.instances.indexOf(this);
                if (index !== -1) {
                    createDebug.instances.splice(index, 1);
                    return true;
                }
                return false;
            }

            function extend(namespace, delimiter) {
                return createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
            }

            /**
            * Enables a debug mode by namespaces. This can include modes
            * separated by a colon and wildcards.
            *
            * @param {String} namespaces
            * @api public
            */
            function enable(namespaces) {
                createDebug.save(namespaces);

                createDebug.names = [];
                createDebug.skips = [];

                let i;
                const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
                const len = split.length;

                for (i = 0; i < len; i++) {
                    if (!split[i]) {
                        // ignore empty strings
                        continue;
                    }

                    namespaces = split[i].replace(/\*/g, '.*?');

                    if (namespaces[0] === '-') {
                        createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
                    } else {
                        createDebug.names.push(new RegExp('^' + namespaces + '$'));
                    }
                }

                for (i = 0; i < createDebug.instances.length; i++) {
                    const instance = createDebug.instances[i];
                    instance.enabled = createDebug.enabled(instance.namespace);
                }
            }

            /**
            * Disable debug output.
            *
            * @return {String} namespaces
            * @api public
            */
            function disable() {
                const namespaces = [...createDebug.names.map(toNamespace), ...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)].join(',');
                createDebug.enable('');
                return namespaces;
            }

            /**
            * Returns true if the given mode name is enabled, false otherwise.
            *
            * @param {String} name
            * @return {Boolean}
            * @api public
            */
            function enabled(name) {
                if (name[name.length - 1] === '*') {
                    return true;
                }

                let i;
                let len;

                for (i = 0, len = createDebug.skips.length; i < len; i++) {
                    if (createDebug.skips[i].test(name)) {
                        return false;
                    }
                }

                for (i = 0, len = createDebug.names.length; i < len; i++) {
                    if (createDebug.names[i].test(name)) {
                        return true;
                    }
                }

                return false;
            }

            /**
            * Convert regexp to namespace
            *
            * @param {RegExp} regxep
            * @return {String} namespace
            * @api private
            */
            function toNamespace(regexp) {
                return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, '*');
            }

            /**
            * Coerce `val`.
            *
            * @param {Mixed} val
            * @return {Mixed}
            * @api private
            */
            function coerce(val) {
                if (val instanceof Error) {
                    return val.stack || val.message;
                }
                return val;
            }

            createDebug.enable(createDebug.load());

            return createDebug;
        }

        module.exports = setup;
    }, { "ms": 11 }], 11: [function (require, module, exports) {
        /**
         * Helpers.
         */

        var s = 1000;
        var m = s * 60;
        var h = m * 60;
        var d = h * 24;
        var w = d * 7;
        var y = d * 365.25;

        /**
         * Parse or format the given `val`.
         *
         * Options:
         *
         *  - `long` verbose formatting [false]
         *
         * @param {String|Number} val
         * @param {Object} [options]
         * @throws {Error} throw an error if val is not a non-empty string or a number
         * @return {String|Number}
         * @api public
         */

        module.exports = function (val, options) {
            options = options || {};
            var type = typeof val;
            if (type === 'string' && val.length > 0) {
                return parse(val);
            } else if (type === 'number' && isNaN(val) === false) {
                return options.long ? fmtLong(val) : fmtShort(val);
            }
            throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(val));
        };

        /**
         * Parse the given `str` and return milliseconds.
         *
         * @param {String} str
         * @return {Number}
         * @api private
         */

        function parse(str) {
            str = String(str);
            if (str.length > 100) {
                return;
            }
            var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
            if (!match) {
                return;
            }
            var n = parseFloat(match[1]);
            var type = (match[2] || 'ms').toLowerCase();
            switch (type) {
                case 'years':
                case 'year':
                case 'yrs':
                case 'yr':
                case 'y':
                    return n * y;
                case 'weeks':
                case 'week':
                case 'w':
                    return n * w;
                case 'days':
                case 'day':
                case 'd':
                    return n * d;
                case 'hours':
                case 'hour':
                case 'hrs':
                case 'hr':
                case 'h':
                    return n * h;
                case 'minutes':
                case 'minute':
                case 'mins':
                case 'min':
                case 'm':
                    return n * m;
                case 'seconds':
                case 'second':
                case 'secs':
                case 'sec':
                case 's':
                    return n * s;
                case 'milliseconds':
                case 'millisecond':
                case 'msecs':
                case 'msec':
                case 'ms':
                    return n;
                default:
                    return undefined;
            }
        }

        /**
         * Short format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */

        function fmtShort(ms) {
            var msAbs = Math.abs(ms);
            if (msAbs >= d) {
                return Math.round(ms / d) + 'd';
            }
            if (msAbs >= h) {
                return Math.round(ms / h) + 'h';
            }
            if (msAbs >= m) {
                return Math.round(ms / m) + 'm';
            }
            if (msAbs >= s) {
                return Math.round(ms / s) + 's';
            }
            return ms + 'ms';
        }

        /**
         * Long format for `ms`.
         *
         * @param {Number} ms
         * @return {String}
         * @api private
         */

        function fmtLong(ms) {
            var msAbs = Math.abs(ms);
            if (msAbs >= d) {
                return plural(ms, msAbs, d, 'day');
            }
            if (msAbs >= h) {
                return plural(ms, msAbs, h, 'hour');
            }
            if (msAbs >= m) {
                return plural(ms, msAbs, m, 'minute');
            }
            if (msAbs >= s) {
                return plural(ms, msAbs, s, 'second');
            }
            return ms + ' ms';
        }

        /**
         * Pluralization helper.
         */

        function plural(ms, msAbs, n, name) {
            var isPlural = msAbs >= n * 1.5;
            return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
        }
    }, {}], 12: [function (require, module, exports) {
        module.exports = {
            compareTwoStrings,
            findBestMatch
        };

        function compareTwoStrings(str1, str2) {
            if (!str1.length && !str2.length) return 1; // if both are empty strings
            if (!str1.length || !str2.length) return 0; // if only one is empty string
            if (str1.toUpperCase() === str2.toUpperCase()) return 1; // identical
            if (str1.length === 1 && str2.length === 1) return 0; // both are 1-letter strings

            const pairs1 = wordLetterPairs(str1);
            const pairs2 = wordLetterPairs(str2);
            const union = pairs1.length + pairs2.length;
            let intersection = 0;
            pairs1.forEach(pair1 => {
                for (let i = 0, pair2; pair2 = pairs2[i]; i++) {
                    if (pair1 !== pair2) continue;
                    intersection++;
                    pairs2.splice(i, 1);
                    break;
                }
            });
            return intersection * 2 / union;
        }

        function findBestMatch(mainString, targetStrings) {
            if (!areArgsValid(mainString, targetStrings)) throw new Error('Bad arguments: First argument should be a string, second should be an array of strings');
            const ratings = targetStrings.map(target => ({ target, rating: compareTwoStrings(mainString, target) }));
            const bestMatch = Array.from(ratings).sort((a, b) => b.rating - a.rating)[0];
            return { ratings, bestMatch };
        }

        function flattenDeep(arr) {
            return Array.isArray(arr) ? arr.reduce((a, b) => a.concat(flattenDeep(b)), []) : [arr];
        }

        function areArgsValid(mainString, targetStrings) {
            if (typeof mainString !== 'string') return false;
            if (!Array.isArray(targetStrings)) return false;
            if (!targetStrings.length) return false;
            if (targetStrings.find(s => typeof s !== 'string')) return false;
            return true;
        }

        function letterPairs(str) {
            const pairs = [];
            for (let i = 0, max = str.length - 1; i < max; i++) pairs[i] = str.substring(i, i + 2);
            return pairs;
        }

        function wordLetterPairs(str) {
            const pairs = str.toUpperCase().split(' ').map(letterPairs);
            return flattenDeep(pairs);
        }
    }, {}], 13: [function (require, module, exports) {
        'use strict';

        function ToObject(val) {
            if (val == null) {
                throw new TypeError('Object.assign cannot be called with null or undefined');
            }

            return Object(val);
        }

        module.exports = Object.assign || function (target, source) {
            var from;
            var keys;
            var to = ToObject(target);

            for (var s = 1; s < arguments.length; s++) {
                from = arguments[s];
                keys = Object.keys(Object(from));

                for (var i = 0; i < keys.length; i++) {
                    to[keys[i]] = from[keys[i]];
                }
            }

            return to;
        };
    }, {}], 14: [function (require, module, exports) {
        var _ = {
            keys: require('object-keys'),
            values: require('object-values'),
            assign: require('object-assign'),
            uniq: require('uniq'),
            last: require('array-last'),
            compact: function (d) {
                return d.filter(function (d) {
                    return d;
                });
            }
        };

        module.exports = function (input) {
            var self = {},
                _tokens = {},
                _helpers = {},
                _input = input,
                _debug = false;

            self.input = function (input) {
                _input = input;
                return self;
            };

            self.token = function (token, pattern, helper) {
                var t = {};
                t[token] = pattern;
                addTokens(t);
                helper && self.helper(token, helper);
                return self;
            };

            self.helper = function (token, callback) {
                var m = {};
                m[token] = callback;
                addHelpers(m);
                return self;
            };

            self.debug = function () {
                return _debug = true, self;
            };

            self.tokens = addTokens;
            self.helpers = addHelpers;

            self.walk = walk;
            self.resolve = resolve;

            return self;

            function addTokens(token) {
                var names = _.keys(token),
                    expressions = _.values(token),
                    expression;

                expressions.forEach(function (d, i) {
                    expression = new RegExp('(' + getSource(d) + ')');
                    _tokens[expression.source] = names[i];
                });

                return self;

                function getSource(expression) {
                    if (is(expression, 'RegExp')) return expression.source;
                    return getSource(new RegExp(expression));
                }
            }

            function addHelpers(helpers) {
                for (var helper in helpers) _helpers[helper] = helpers[helper];
                return self;
            }

            function walk(onToken) {
                var cb = onToken || noop;

                var tokens = _.keys(_tokens) || [],
                    names = _.values(_tokens);

                if (tokens.length == 0) throw new Error('Define at least one token');

                runFrom(0);

                return self;

                //TODO: some house keeping needed ... ;)
                function runFrom(lastIndex, ignore) {

                    if (lastIndex > _input.length) return;

                    var expr,
                        _i = _input.substr(lastIndex),
                        idx = -1,
                        min = Infinity;

                    tokens.forEach(function (d, i) {
                        var _expr = new RegExp(d, 'g'),
                            _min;

                        _expr.lastIndex = lastIndex;
                        _min = ignore == i ? -1 : _i.search(_expr);

                        if (min > _min && _min > -1) {
                            expr = _expr;
                            min = _min;
                            idx = i;
                        }
                    });

                    if (idx == -1) return;

                    var part,
                        offset = (part = evalExpr()) && part.length > 0 ? part.lastIndex || part.index : -1,
                        match;

                    function evalExpr() {
                        var r = expr.exec(_input),
                            helper = _helpers[names[idx]];

                        if (helper && r) r.push(helper(r, _input, expr.source));
                        debug('tag %s, index %s, exec %s', names[idx], lastIndex, r);
                        return r;
                    }

                    match = part || [''];

                    offset += match[0].length;

                    var shouldSkip = cb(names[idx], topMatch(match), idx, lastIndex, _.uniq(_.compact(match)));
                    if (typeof shouldSkip != 'undefined' && !shouldSkip) return runFrom(offset - match[0].length, idx);

                    return runFrom(offset);
                }

                function topMatch(arr) {
                    return _.last(_.compact(arr));
                }
                function evaluateExpression(tokens) {
                    return new RegExp(tokens.join('|'), 'g');
                }
            }

            function resolve(postionInfo) {
                var r = {};

                walk(function (name, value, tokenIndex, position, rawExec) {
                    if (postionInfo) value = { value: value, position: position };

                    if (is(r[name], 'Array')) return r[name].push(value);
                    if (is(r[name], 'String')) return r[name] = [value].concat(r[name] || []).reverse();
                    if (is(r[name], 'Object')) return r[name] = _.assign(value, r[name]);

                    r[name] = r[name] || [];
                    r[name].push(value);
                });

                r._source = _input;

                return simplify(r);

                function simplify(r) {
                    for (var key in r) if (is(r[key], 'Array') && r[key].length == 1) r[key] = r[key][0];

                    return r;
                }
            }

            function noop() {}
            function is(expression, type) {
                return Object.prototype.toString.call(expression) == '[object ' + type + ']';
            }
            function debug() {
                if (_debug) console.log.apply(console, arguments);
            }
        };
    }, { "array-last": 3, "object-assign": 13, "object-keys": 5, "object-values": 7, "uniq": 15 }], 15: [function (require, module, exports) {
        "use strict";

        function unique_pred(list, compare) {
            var ptr = 1,
                len = list.length,
                a = list[0],
                b = list[0];
            for (var i = 1; i < len; ++i) {
                b = a;
                a = list[i];
                if (compare(a, b)) {
                    if (i === ptr) {
                        ptr++;
                        continue;
                    }
                    list[ptr++] = a;
                }
            }
            list.length = ptr;
            return list;
        }

        function unique_eq(list) {
            var ptr = 1,
                len = list.length,
                a = list[0],
                b = list[0];
            for (var i = 1; i < len; ++i, b = a) {
                b = a;
                a = list[i];
                if (a !== b) {
                    if (i === ptr) {
                        ptr++;
                        continue;
                    }
                    list[ptr++] = a;
                }
            }
            list.length = ptr;
            return list;
        }

        function unique(list, compare, sorted) {
            if (list.length === 0) {
                return list;
            }
            if (compare) {
                if (!sorted) {
                    list.sort(compare);
                }
                return unique_pred(list, compare);
            }
            if (!sorted) {
                list.sort();
            }
            return unique_eq(list);
        }

        module.exports = unique;
    }, {}], 16: [function (require, module, exports) {
        //     wink-bm25-text-search
        //     Fast Full Text Search based on BM25F
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-bm25-text-search”.
        //
        //     “wink-bm25-search” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-bm25-text-search” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-bm25-text-search”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = require('wink-helpers');

        /* eslint guard-for-in: 0 */
        /* eslint complexity: [ "error", 25 ] */

        // It is a BM25F In-memory Search engine for text and exposes following
        // methods:
        // 1. `definePrepTasks` allows to define field-wise (optional) pipeline of
        // functions that will be used to prepare each input prior to *search/predict*
        // and *addDoc/learn*.
        // 2. `defineConfig` sets up the configuration for *field-wise weights*,
        // *BM25F parameters*, and **field names whoes original value** needs to be retained.
        // 3. `addDoc/learn` adds a document using its unique id. The document is supplied
        // as an Javascript object, where each property is the field of the document
        // and its value is the text.
        // 4. `consolidate` learnings prior to search/predict.
        // 5. `search/predict` searches for the input text and returns the resultant
        // document ids, sorted by their relevance along with the score. The number of
        // results returned can be controlled via a limit argument that defaults to **10**.
        // The last optional argument is a filter function that must return a `boolean`
        // value, which is used to filter documents.
        // 6. `exportJSON` exports the learnings in JSON format.
        // 7. `importJSON` imports the learnings from JSON that may have been saved on disk.
        // 8. `reset` all the learnings except the preparatory tasks.
        var bm25fIMS = function () {
            // Preparatory tasks that are executed on the `addDoc` & `search` input.
            var pTasks = [];
            // And its count.
            var pTaskCount;
            // Field level prep tasks.
            var flds = Object.create(null);
            // Returned!
            var methods = Object.create(null);
            // Term Frequencies & length of each document.
            var documents = Object.create(null);
            // Inverted Index for faster search
            var invertedIdx = [];
            // IDF for each tokens, tokens are referenced via their numerical index.
            var idf = [];
            // Set true on first call to `addDoc/learn` to prevent changing config.
            var learned = false;
            // The `addDoc()predict()` function checks for this being true; set
            // in `consolidate()`.
            var consolidated = false;
            // Total documents added.
            var totalDocs = 0;
            // Total number of tokens across all documents added.
            var totalCorpusLength = 0;
            // Their average.
            var avgCorpusLength = 0;
            // BM25F Configuration; set up in `defineConfig()`.
            var config = null;
            // The `token: index` mapping; `index` is used everywhere instead
            // of the `token`
            var token2Index = Object.create(null);
            // Index's initial value, incremented with every new word.
            var currTokenIndex = 0;

            // ### Private functions

            // #### Perpare Input

            // Prepares the `input` by executing the pipeline of tasks defined in the
            // `field` specific `pTasks` set via `definePrepTasks()`.
            // If `field` is not specified then default `pTasks` are used.
            // If the `field` specific `pTasks` are not defined then it automatically
            // switches to default `pTasks`.
            var prepareInput = function (input, field) {
                var processedInput = input;
                var pt = flds[field] && flds[field].pTasks || pTasks;
                var ptc = flds[field] && flds[field].pTaskCount || pTaskCount;
                for (var i = 0; i < ptc; i += 1) {
                    processedInput = pt[i](processedInput);
                }
                return processedInput;
            }; // prepareInput()

            // #### Update Freq

            // Updates the `freq` of each term in the `text` after pre-processing it via
            // `prepareInput()`; while updating, it takes care of `field's` `weight`.
            var updateFreq = function (id, text, weight, freq, field) {
                // Tokenized `text`.
                var tkns = prepareInput(text, field);
                // Temp token holder.
                var t;
                for (var i = 0, imax = tkns.length; i < imax; i += 1) {
                    t = tkns[i];
                    // Build `token: index` mapping.
                    if (token2Index[t] === undefined) {
                        token2Index[t] = currTokenIndex;
                        currTokenIndex += 1;
                    }
                    t = token2Index[t];
                    if (freq[t] === undefined) {
                        freq[t] = weight;
                        invertedIdx[t] = invertedIdx[t] || [];
                        invertedIdx[t].push(id);
                    } else {
                        freq[t] += weight;
                    }
                }
                // Length can not be negative!
                return tkns.length * Math.abs(weight);
            }; // updateFreq()

            // ### Exposed Functions

            // #### Define Prep Tasks

            // Defines the `tasks` required to prepare the input for `addDoc` and `search()`
            // The `tasks` should be an array of functions; using these function a simple
            // pipeline is built to serially transform the input to the output.
            // It validates the `tasks` before updating the `pTasks`.
            // If validation fails it throws an appropriate error.
            // Tasks can be defined separately for each field. However if the field is not
            // specified (i.e. `null` or `undefined`), then the `tasks` become default.
            // Note, `field = 'search'` is reserved for prep tasks for search string; However
            // if the same is not specified, the default tasks are used for pre-processing.
            var definePrepTasks = function (tasks, field) {
                if (config === null) {
                    throw Error('winkBM25S: Config must be defined before defining prepTasks.');
                }
                if (!helpers.array.isArray(tasks)) {
                    throw Error('winkBM25S: Tasks should be an array, instead found: ' + JSON.stringify(tasks));
                }
                for (var i = 0, imax = tasks.length; i < imax; i += 1) {
                    if (typeof tasks[i] !== 'function') {
                        throw Error('winkBM25S: Tasks should contain function, instead found: ' + typeof tasks[i]);
                    }
                }
                var fldWeights = config.fldWeights;
                if (field === undefined || field === null) {
                    pTasks = tasks;
                    pTaskCount = tasks.length;
                } else {
                    if (!fldWeights[field] || typeof field !== 'string') {
                        throw Error('winkBM25S: Field name is missing or it is not a string: ' + JSON.stringify(field) + '/' + typeof field);
                    }
                    flds[field] = flds[field] || Object.create(null);
                    flds[field].pTasks = tasks;
                    flds[field].pTaskCount = tasks.length;
                }
                return tasks.length;
            }; // definePrepTasks()

            // #### Define Config

            // Defines the configuration for BM25F using `fldWeights` and `bm25Params`
            // properties of `cfg` object.</br>
            // The `fldWeights` defines the weight for each field of the document. This gives
            // a semantic nudge to search and are used as a mutiplier to the count
            // (frequency) of each token contained in that field of the document. It should
            // be a JS object containing `field-name/value` pairs. If a field's weight is
            // not defined, that field is **ignored**. The field weights must be defined before
            // attempting to add a document via `addDoc()`; they can only be defined once.
            // If any document's field is not defined here then that field is **ignored**.
            // </br>
            // The `k`, `b` and `k1` properties of `bm25Params` object define the smoothing
            // factor for IDF, degree of normalization for TF, and saturation control factor
            // respectively for the BM25F. Their default values are **1**, **0.75**, and
            // **1.2**.<br/>
            // The `ovFieldNames` is an array of field names whose original value needs to
            // be retained.
            var defineConfig = function (cfg) {
                if (learned) {
                    throw Error('winkBM25S: config must be defined before learning/addition starts!');
                }
                if (!helpers.object.isObject(cfg)) {
                    throw Error('winkBM25S: config must be a config object, instead found: ' + JSON.stringify(cfg));
                }
                // If `fldWeights` are absent throw error.
                if (!helpers.object.isObject(cfg.fldWeights)) {
                    throw Error('winkBM25S: fldWeights must be an object, instead found: ' + JSON.stringify(cfg.fldWeights));
                }
                // There should be at least one defined field!
                if (helpers.object.keys(cfg.fldWeights).length === 0) {
                    throw Error('winkBM25S: Field config has no field defined.');
                }
                // Setup configuration now.
                config = Object.create(null);
                // Field config for BM25**F**
                config.fldWeights = Object.create(null);
                config.bm25Params = Object.create(null);
                // **Controls TF part:**<br/>
                // `k1` controls saturation of token's frequency; higher value delays saturation
                // with increase in frequency.
                config.bm25Params.k1 = 1.2;
                // `b` controls the degree of normalization; **0** means no normalization and **1**
                // indicates complete normalization!
                config.bm25Params.b = 0.75;
                // **Controls IDF part:**<br/>
                // `k` controls impact of IDF; should be >= 0; a higher value means lower
                // the impact of IDF.
                config.bm25Params.k = 1;
                // Setup field weights.
                for (var field in cfg.fldWeights) {
                    // The `null` check is required as `isNaN( null )` returns `false`!!
                    // This first ensures non-`null/undefined/0` values before testing for NaN.
                    if (!cfg.fldWeights[field] || isNaN(cfg.fldWeights[field])) {
                        throw Error('winkBM25S: Field weight should be number >0, instead found: ' + JSON.stringify(cfg.fldWeights[field]));
                    }
                    // Update config parameters from `cfg`.
                    config.fldWeights[field] = +cfg.fldWeights[field];
                }
                // Setup BM25F params.
                // Create `bm25Params` if absent in `cfg`.
                if (!helpers.object.isObject(cfg.bm25Params)) cfg.bm25Params = Object.create(null);
                // Update config parameters from `cfg`.
                config.bm25Params.b = cfg.bm25Params.b === null || cfg.bm25Params.b === undefined || isNaN(cfg.bm25Params.b) || +cfg.bm25Params.b < 0 || +cfg.bm25Params.b > 1 ? 0.75 : +cfg.bm25Params.b;

                // Update config parameters from `cfg`.
                config.bm25Params.k1 = cfg.bm25Params.k1 === null || cfg.bm25Params.k1 === undefined || isNaN(cfg.bm25Params.k1) || +cfg.bm25Params.k1 < 0 ? 1.2 : +cfg.bm25Params.k1;

                // Update config parameters from `cfg`.
                config.bm25Params.k = cfg.bm25Params.k === null || cfg.bm25Params.k === undefined || isNaN(cfg.bm25Params.k) || +cfg.bm25Params.k < 0 ? 1 : +cfg.bm25Params.k;

                // Handle configuration for fields whose orginal values has to be retained
                // in the document.<br/>
                // Initialize the `ovFldNames` in the final `config` as an empty array
                config.ovFldNames = [];
                if (!cfg.ovFldNames) cfg.ovFldNames = [];
                if (!helpers.array.isArray(cfg.ovFldNames)) {
                    throw Error('winkBM25S: OV Field names should be an array, instead found: ' + JSON.stringify(typeof cfg.ovFldNames));
                }

                cfg.ovFldNames.forEach(function (f) {
                    if (typeof f !== 'string' || f.length === 0) {
                        throw Error('winkBM25S: OV Field name should be a non-empty string, instead found: ' + JSON.stringify(f));
                    }
                    config.ovFldNames.push(f);
                });
                return true;
            }; // defineConfig()


            // #### Add Doc

            // Adds a document to the model using `updateFreq()` function.
            var addDoc = function (doc, id) {
                if (config === null) {
                    throw Error('winkBM25S: Config must be defined before adding a document.');
                }
                var fldWeights = config.fldWeights;
                // No point in adding/learning further in absence of consolidated.
                if (consolidated) {
                    throw Error('winkBM25S: post consolidation adding/learning is not possible!');
                }
                // Set learning/addition started.
                learned = true;
                var length;
                if (documents[id] !== undefined) {
                    throw Error('winkBM25S: Duplicate document encountered: ' + JSON.stringify(id));
                }
                documents[id] = Object.create(null);
                documents[id].freq = Object.create(null);
                documents[id].fieldValues = Object.create(null);
                documents[id].length = 0;
                // Compute `freq` & `length` of the specified fields.
                for (var field in fldWeights) {
                    if (doc[field] === undefined) {
                        throw Error('winkBM25S: Missing field in the document: ' + JSON.stringify(field));
                    }
                    length = updateFreq(id, doc[field], fldWeights[field], documents[id].freq, field);
                    documents[id].length += length;
                    totalCorpusLength += length;
                }
                // Retain Original Field Values, if configured.
                config.ovFldNames.forEach(function (f) {
                    if (doc[f] === undefined) {
                        throw Error('winkBM25S: Missing field in the document: ' + JSON.stringify(f));
                    }
                    documents[id].fieldValues[f] = doc[f];
                });
                // Increment total documents indexed so far.
                totalDocs += 1;
                return totalDocs;
            }; // addDoc()

            // #### Consolidate

            // Consolidates the data structure of bm25 and computes the IDF. This must be
            // built before using the `search` function. The `fp` defines the precision at
            // which term frequency values are stored. The default value is **4**. In cause
            // of an invalid input, it default to 4. The maximum permitted value is 9; any
            // value larger than 9 is forced to 9.
            var consolidate = function (fp) {
                if (consolidated) {
                    throw Error('winkBM25S: consolidation can be carried out only once!');
                }
                if (totalDocs < 3) {
                    throw Error('winkBM25S: document collection is too small for consolidation; add more docs!');
                }
                var freqPrecision = parseInt(fp, 10);
                freqPrecision = isNaN(freqPrecision) ? 4 : freqPrecision < 4 ? 4 : freqPrecision > 9 ? 9 : freqPrecision;
                // Using the commonly used names but unfortunately they are very cryptic and
                // *short*. **Must not use these variable names elsewhere**.
                var b = config.bm25Params.b;
                var k1 = config.bm25Params.k1;
                var k = config.bm25Params.k;
                var freq, id, n, normalizationFactor, t;
                // Consolidate: compute idf; will multiply with freq to save multiplication
                // time during search. This happens in the next loop-block.
                for (var i = 0, imax = invertedIdx.length; i < imax; i += 1) {
                    n = invertedIdx[i].length;
                    idf[i] = Math.log((totalDocs - n + 0.5) / (n + 0.5) + k);
                    // To be uncommented to probe values!
                    // console.log( '%s, %d, %d, %d, %d', t, totalDocs, n, k, idf[ t ] );
                }
                avgCorpusLength = totalCorpusLength / totalDocs;
                // Consolidate: update document frequencies.
                for (id in documents) {
                    normalizationFactor = 1 - b + b * (documents[id].length / avgCorpusLength);
                    for (t in documents[id].freq) {
                        freq = documents[id].freq[t];
                        // Update frequency but ensure the sign is carefully preserved as the
                        // magnitude of `k1` can jeopardize the sign!
                        documents[id].freq[t] = Math.sign(freq) * (Math.abs(freq * (k1 + 1) / (k1 * normalizationFactor + freq)) * idf[t]).toFixed(freqPrecision);
                        // To be uncommented to probe values!
                        // console.log( '%s, %s, %d', id, t, documents[ id ].freq[ t ] );
                    }
                }
                // Set `consolidated` as `true`.
                consolidated = true;
                return true;
            }; // consolidate()

            // #### Search

            // Searches the `text` and return `limit` results. If `limit` is not sepcified
            // then it will return a maximum of **10** results. The `result` is an array of
            // containing `doc id` and `score` pairs array. If the `text` is not found, an
            // empty array is returned. The `text` must be a string. The argurment `filter`
            // is like `filter` of JS Array; it receive an object containing document's
            // retained field name/value pairs along with the `params` (which is passed as
            // the second argument). It is useful in limiting the search space or making the
            // search more focussed.
            var search = function (text, limit, filter, params) {
                // Predict/Search only if learnings have been consolidated!
                if (!consolidated) {
                    throw Error('winkBM25S: search is not possible unless learnings are consolidated!');
                }
                if (typeof text !== 'string') {
                    throw Error('winkBM25S: search text should be a string, instead found: ' + typeof text);
                }
                // Setup filter function
                var f = typeof filter === 'function' ? filter : function () {
                    return true;
                };
                // Tokenized `text`. Use search specific weights.
                var tkns = prepareInput(text, 'search')
                // Filter out tokens that do not exists in the vocabulary.
                .filter(function (t) {
                    return token2Index[t] !== undefined;
                })
                // Now map them to their respective indexes using `token2Index`.
                .map(function (t) {
                    return token2Index[t];
                });
                // Search results go here as doc id/score pairs.
                var results = Object.create(null);
                // Helper variables.
                var id, ids, t;
                var i, imax, j, jmax;
                // Iterate for every token in the preapred text.
                for (j = 0, jmax = tkns.length; j < jmax; j += 1) {
                    t = tkns[j];
                    // Use Inverted Idx to look up - accelerates search!<br/>
                    // Note, `ids` can never be `undefined` as **unknown** tokens have already
                    // been filtered.
                    ids = invertedIdx[t];
                    // Means the token exists in the vocabulary!
                    // Compute scores for every document.
                    for (i = 0, imax = ids.length; i < imax; i += 1) {
                        id = ids[i];
                        if (f(documents[id].fieldValues, params)) {
                            results[id] = documents[id].freq[t] + (results[id] || 0);
                        }
                        // To be uncommented to probe values!
                        /* console.log( '%s, %d, %d, %d', t, documents[ id ].freq[ t ], idf[ t ], results[ id ] ); */
                    }
                }
                // Convert to a table in `[ id, score ]` format; sort and slice required number
                // of resultant documents.
                return helpers.object.table(results).sort(helpers.array.descendingOnValue).slice(0, Math.max(limit || 10, 1));
            }; // search()

            // #### Reset

            // Resets the BM25F completely by re-initializing all the learning
            // related variables, except the preparatory tasks.
            var reset = function () {
                // Reset values of variables that are associated with learning; Therefore
                // `pTasks` & `pTaskCount` are not re-initialized.
                // Term Frequencies & length of each document.
                documents = Object.create(null);
                // Inverted Index for faster search
                invertedIdx = [];
                // IDF for each tokens
                idf = [];
                // Set true on first call to `addDoc/learn` to prevent changing config.
                learned = false;
                // The `addDoc()predict()` function checks for this being true; set
                // in `consolidate()`.
                consolidated = false;
                // Total documents added.
                totalDocs = 0;
                // Total number of tokens across all documents added.
                totalCorpusLength = 0;
                // Their average.
                avgCorpusLength = 0;
                // BM25F Configuration; set up in `defineConfig()`.
                config = null;
                // The `token: index` mapping; `index` is used everywhere instead
                // of the `token`
                token2Index = Object.create(null);
                // Index's initial value, incremented with every new word.
                currTokenIndex = 0;
                return true;
            }; // reset()

            // #### Export JSON

            // Returns the learnings, along with `consolidated` flag, in JSON format.
            var exportJSON = function () {
                var docStats = Object.create(null);
                docStats.totalCorpusLength = totalCorpusLength;
                docStats.totalDocs = totalDocs;
                docStats.consolidated = consolidated;
                return JSON.stringify([config, docStats, documents, invertedIdx, currTokenIndex, token2Index,
                // For future expansion but the import will have to have intelligence to
                // set the default values and still ensure nothing breaks! Hopefully!!
                {}, [], []]);
            }; // exportJSON()

            // #### Import JSON

            // Imports the `json` in to index after validating the format of input JSON.
            // If validation fails then throws error; otherwise on success import it
            // returns `true`. Note, importing leads to resetting the search engine.
            var importJSON = function (json) {
                if (!json) {
                    throw Error('winkBM25S: undefined or null JSON encountered, import failed!');
                }
                // Validate json format
                var isOK = [helpers.object.isObject, helpers.object.isObject, helpers.object.isObject, helpers.array.isArray, Number.isInteger, helpers.object.isObject, helpers.object.isObject, helpers.array.isArray, helpers.array.isArray];
                var parsedJSON = JSON.parse(json);
                if (!helpers.array.isArray(parsedJSON) || parsedJSON.length !== isOK.length) {
                    throw Error('winkBM25S: invalid JSON encountered, can not import.');
                }
                for (var i = 0; i < isOK.length; i += 1) {
                    if (!isOK[i](parsedJSON[i])) {
                        throw Error('winkBM25S: invalid JSON encountered, can not import.');
                    }
                }
                // All good, setup variable values.
                // First reset everything.
                reset();
                // To prevent config change.
                learned = true;
                // Load variable values.
                config = parsedJSON[0];
                totalCorpusLength = parsedJSON[1].totalCorpusLength;
                totalDocs = parsedJSON[1].totalDocs;
                consolidated = parsedJSON[1].consolidated;
                documents = parsedJSON[2];
                invertedIdx = parsedJSON[3];
                currTokenIndex = parsedJSON[4];
                token2Index = parsedJSON[5];
                // Return success.
                return true;
            }; // importJSON()

            methods.definePrepTasks = definePrepTasks;
            methods.defineConfig = defineConfig;
            methods.addDoc = addDoc;
            methods.consolidate = consolidate;
            methods.search = search;
            methods.exportJSON = exportJSON;
            methods.importJSON = importJSON;
            methods.reset = reset;
            // Aliases to keep APIs uniform across.
            methods.learn = addDoc;
            methods.predict = search;

            return methods;
        }; // bm25fIMS()

        module.exports = bm25fIMS;
    }, { "wink-helpers": 17 }], 17: [function (require, module, exports) {
        //     wink-helpers
        //     Low level helper functions for Javascript
        //     array, object, and string.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-helpers”.
        //
        //     “wink-helpers” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-helpers” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-helpers”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = Object.create(null);

        // ### Private Functions

        // #### Product Reducer (Callback)

        // Callback function used by `reduce` inside the `product()` function.
        // Follows the standard guidelines of `reduce()` callback function.
        var productReducer = function (prev, curr) {
            var c,
                cmax = curr.length;
            var p,
                pmax = prev.length;
            var result = [];

            for (p = 0; p < pmax; p += 1) {
                for (c = 0; c < cmax; c += 1) {
                    result.push(prev[p].concat(curr[c]));
                }
            }
            return result;
        }; // productReducer()

        // ### Public Function

        // ### Array Helpers

        helpers.array = Object.create(null);

        // #### is Array

        // Tests if argument `v` is a JS array; returns `true` if it is, otherwise returns `false`.
        helpers.array.isArray = function (v) {
            return v !== undefined && v !== null && Object.prototype.toString.call(v) === '[object Array]';
        }; // isArray()


        // #### sorting helpers

        // Set of helpers to sort either numbers or strings. For key/value pairs,
        // the format for each element must be `[ key, value ]`.
        // Sort helper to sort an array in ascending order.
        helpers.array.ascending = function (a, b) {
            return a > b ? 1 : a === b ? 0 : -1;
        }; // ascending()

        // Sort helper to sort an array in descending order.
        helpers.array.descending = function (a, b) {
            return b > a ? 1 : b === a ? 0 : -1;
        }; // descending()

        // Sort helper to sort an array of `[ key, value ]` in ascending order by **key**.
        helpers.array.ascendingOnKey = function (a, b) {
            return a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1;
        }; // ascendingOnKey()

        // Sort helper to sort an array of `[ key, value ]` in descending order by **key**.
        helpers.array.descendingOnKey = function (a, b) {
            return b[0] > a[0] ? 1 : b[0] === a[0] ? 0 : -1;
        }; // descendingOnKey()

        // Sort helper to sort an array of `[ key, value ]` in ascending order by **value**.
        helpers.array.ascendingOnValue = function (a, b) {
            return a[1] > b[1] ? 1 : a[1] === b[1] ? 0 : -1;
        }; // ascendingOnValue()

        // Sort helper to sort an array of `[ key, value ]` in descending order by **value**.
        helpers.array.descendingOnValue = function (a, b) {
            return b[1] > a[1] ? 1 : b[1] === a[1] ? 0 : -1;
        }; // descendingOnValue()

        // The following two functions generate a suitable function for sorting on a single
        // key or on a composite keys (max 2 only). Just a remider, the generated function
        // does not sort on two keys; instead it will sort on a key composed of the two
        // accessors.
        // Sorts in ascending order on `accessor1` & `accessor2` (optional).
        helpers.array.ascendingOn = function (accessor1, accessor2) {
            if (accessor2) {
                return function (a, b) {
                    return a[accessor1][accessor2] > b[accessor1][accessor2] ? 1 : a[accessor1][accessor2] === b[accessor1][accessor2] ? 0 : -1;
                };
            }
            return function (a, b) {
                return a[accessor1] > b[accessor1] ? 1 : a[accessor1] === b[accessor1] ? 0 : -1;
            };
        }; // ascendingOn()

        // Sorts in descending order on `accessor1` & `accessor2` (optional).
        helpers.array.descendingOn = function (accessor1, accessor2) {
            if (accessor2) {
                return function (a, b) {
                    return b[accessor1][accessor2] > a[accessor1][accessor2] ? 1 : b[accessor1][accessor2] === a[accessor1][accessor2] ? 0 : -1;
                };
            }
            return function (a, b) {
                return b[accessor1] > a[accessor1] ? 1 : b[accessor1] === a[accessor1] ? 0 : -1;
            };
        }; // descendingOn()

        // #### pluck

        // Plucks specified element from each element of an **array of array**, and
        // returns the resultant array. The element is specified by `i` (default `0`) and
        // number of elements to pluck are defined by `limit` (default `a.length`).
        helpers.array.pluck = function (a, key, limit) {
            var k, plucked;
            k = a.length;
            var i = key || 0;
            var lim = limit || k;
            if (lim > k) lim = k;
            plucked = new Array(lim);
            for (k = 0; k < lim; k += 1) plucked[k] = a[k][i];
            return plucked;
        }; // pluck()

        // #### product

        // Finds the Cartesian Product of arrays present inside the array `a`. Therefore
        // the array `a` must be an array of 1-dimensional arrays. For example,
        // `product( [ [ 9, 8 ], [ 1, 2 ] ] )`
        // will produce `[ [ 9, 1 ], [ 9, 2 ], [ 8, 1 ], [ 8, 2 ] ]`.
        helpers.array.product = function (a) {
            return a.reduce(productReducer, [[]]);
        };

        // #### shuffle

        // Randomly shuffles the elements of an array and returns the same.
        // Reference: Chapter on Random Numbers/Shuffling in Seminumerical algorithms.
        // The Art of Computer Programming Volume II by Donald E Kunth
        helpers.array.shuffle = function (array) {
            var a = array;
            var balance = a.length;
            var candidate;
            var temp;

            while (balance) {
                candidate = Math.floor(Math.random() * balance);
                balance -= 1;

                temp = a[balance];
                a[balance] = a[candidate];
                a[candidate] = temp;
            }

            return a;
        };

        // ### Object Helpers

        var objectKeys = Object.keys;
        var objectCreate = Object.create;

        helpers.object = Object.create(null);

        // #### is Object

        // Tests if argument `v` is a JS object; returns `true` if it is, otherwise returns `false`.
        helpers.object.isObject = function (v) {
            return v && Object.prototype.toString.call(v) === '[object Object]' ? true : false; // eslint-disable-line no-unneeded-ternary
        }; // isObject()

        // #### keys

        // Returns keys of the `obj` in an array.
        helpers.object.keys = function (obj) {
            return objectKeys(obj);
        }; // keys()

        // #### size

        // Returns the number of keys of the `obj`.
        helpers.object.size = function (obj) {
            return objectKeys(obj).length;
        }; // size()

        // #### values

        // Returns all values from each key/value pair of the `obj` in an array.
        helpers.object.values = function (obj) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var values = new Array(length);
            for (var i = 0; i < length; i += 1) {
                values[i] = obj[keys[i]];
            }
            return values;
        }; // values()

        // #### value Freq

        // Returns the frequency of each unique value present in the `obj`, where the
        // **key** is the *value* and **value** is the *frequency*.
        helpers.object.valueFreq = function (obj) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var val;
            var vf = objectCreate(null);
            for (var i = 0; i < length; i += 1) {
                val = obj[keys[i]];
                vf[val] = 1 + (vf[val] || 0);
            }
            return vf;
        }; // valueFreq()

        // #### table

        // Converts the `obj` in to an array of `[ key, value ]` pairs in form of a table.
        // Second argument - `f` is optional and it is a function, which is called with
        // each `value`.
        helpers.object.table = function (obj, f) {
            var keys = helpers.object.keys(obj);
            var length = keys.length;
            var pairs = new Array(length);
            var ak, av;
            for (var i = 0; i < length; i += 1) {
                ak = keys[i];
                av = obj[ak];
                if (typeof f === 'function') f(av);
                pairs[i] = [ak, av];
            }
            return pairs;
        }; // table()

        // ### Validation Helpers

        helpers.validate = Object.create(null);

        // Create aliases for isObject and isArray.
        helpers.validate.isObject = helpers.object.isObject;
        helpers.validate.isArray = helpers.array.isArray;

        // #### isFiniteInteger

        // Validates if `n` is a finite integer.
        helpers.validate.isFiniteInteger = function (n) {
            return typeof n === 'number' && !isNaN(n) && isFinite(n) && n === Math.round(n);
        }; // isFiniteInteger()

        // #### isFiniteNumber

        // Validates if `n` is a valid number.
        helpers.validate.isFiniteNumber = function (n) {
            return typeof n === 'number' && !isNaN(n) && isFinite(n);
        }; // isFiniteNumber()

        // ### cross validation
        /**
         *
         * Creates an instance of cross validator useful for machine learning tasks.
         *
         * @param {string[]} classLabels - array containing all the class labels.
         * @return {methods} object conatining set of API methods for tasks like evalutaion,
         * reset and metrics generation.
        */
        helpers.validate.cross = function (classLabels) {
            // wink's const for unknown predictions!
            const unknown = 'unknown';
            // To ensure that metrics is not computed prior to evaluation.
            var evaluated = false;
            // The confusion matrix.
            var cm;
            var precision;
            var recall;
            var fmeasure;

            // The class labels is assigned to this variable.
            var labels;
            // The length of `labels` array.
            var labelCount;
            var labelsObj = Object.create(null);

            // Returned!
            var methods = Object.create(null);

            /**
             *
             * Resets the current instance for another round of evaluation; the class
             * labels defined at instance creation time are not touched.
             *
             * @return {undefined} nothing!
            */
            var reset = function () {
                evaluated = false;
                cm = Object.create(null);
                precision = Object.create(null);
                recall = Object.create(null);
                fmeasure = Object.create(null);

                // Initialize confusion matrix and metrics.
                for (let i = 0; i < labelCount; i += 1) {
                    const row = labels[i];
                    labelsObj[row] = true;
                    cm[row] = Object.create(null);
                    precision[row] = 0;
                    recall[row] = 0;
                    fmeasure[row] = 0;
                    for (let j = 0; j < labelCount; j += 1) {
                        const col = labels[j];
                        cm[row][col] = 0;
                    }
                }
            }; // reset()

            /**
             *
             * Creates an instance of cross validator useful for machine learning tasks.
             *
             * @param {string} truth - the actual class label.
             * @param {string} guess - the predicted class label.
             * @return {boolean} returns true if the evaluation is successful. The evaluation
             * may fail if `truth` or `guess` is not in the array `classLabels` provided at
             * instance creation time; or if guess is equal to `unknown`.
            */
            var evaluate = function (truth, guess) {
                // If prediction failed then return false!
                if (guess === unknown || !labelsObj[truth] || !labelsObj[guess]) return false;
                // Update confusion matrix.
                if (guess === truth) {
                    cm[truth][guess] += 1;
                } else {
                    cm[guess][truth] += 1;
                }
                evaluated = true;
                return true;
            }; // evaluate()

            /**
             *
             * It computes a detailed metrics consisting of macro-averaged precision,
             * recall and f-measure along with their label-wise values and the confusion
             * matrix.
             *
             * @return {object} object containing macro-averaged `avgPrecision`, `avgRecall`,
             * `avgFMeasure` values along with other details such as label-wise values
             * and the confusion matrix. A value of `null` is returned if no evaluate()
             * has been called before.
            */
            var metrics = function () {
                if (!evaluated) return null;
                // Numerators for every label; they are same for precision & recall both.
                var n = Object.create(null);
                // Only denominators differs for precision & recall
                var pd = Object.create(null);
                var rd = Object.create(null);
                // `row` and `col` of confusion matrix.
                var col, row;
                var i, j;
                // Macro average values for metrics.
                var avgPrecision = 0;
                var avgRecall = 0;
                var avgFMeasure = 0;

                // Compute label-wise numerators & denominators!
                for (i = 0; i < labelCount; i += 1) {
                    row = labels[i];
                    for (j = 0; j < labelCount; j += 1) {
                        col = labels[j];
                        if (row === col) {
                            n[row] = cm[row][col];
                        }
                        pd[row] = cm[row][col] + (pd[row] || 0);
                        rd[row] = cm[col][row] + (rd[row] || 0);
                    }
                }
                // Ready to compute metrics.
                for (i = 0; i < labelCount; i += 1) {
                    row = labels[i];
                    precision[row] = +(n[row] / pd[row]).toFixed(4);
                    // NaN can occur if a label has not been encountered.
                    if (isNaN(precision[row])) precision[row] = 0;

                    recall[row] = +(n[row] / rd[row]).toFixed(4);
                    if (isNaN(recall[row])) recall[row] = 0;

                    fmeasure[row] = +(2 * precision[row] * recall[row] / (precision[row] + recall[row])).toFixed(4);
                    if (isNaN(fmeasure[row])) fmeasure[row] = 0;
                }
                // Compute thier averages, note they will be macro avegages.
                for (i = 0; i < labelCount; i += 1) {
                    avgPrecision += precision[labels[i]] / labelCount;
                    avgRecall += recall[labels[i]] / labelCount;
                    avgFMeasure += fmeasure[labels[i]] / labelCount;
                }
                // Return metrics.
                return {
                    // Macro-averaged metrics.
                    avgPrecision: +avgPrecision.toFixed(4),
                    avgRecall: +avgRecall.toFixed(4),
                    avgFMeasure: +avgFMeasure.toFixed(4),
                    details: {
                        // Confusion Matrix.
                        confusionMatrix: cm,
                        // Label wise metrics details, from those averages were computed.
                        precision: precision,
                        recall: recall,
                        fmeasure: fmeasure
                    }
                };
            }; // metrics()

            if (!helpers.validate.isArray(classLabels)) {
                throw Error('cross validate: class labels must be an array.');
            }
            if (classLabels.length < 2) {
                throw Error('cross validate: at least 2 class labels are required.');
            }
            labels = classLabels;
            labelCount = labels.length;

            reset();

            methods.reset = reset;
            methods.evaluate = evaluate;
            methods.metrics = metrics;

            return methods;
        }; // cross()

        // ### Object Helpers

        helpers.string = Object.create(null);

        // Regex for [diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) removal.
        var rgxDiacritical = /[\u0300-\u036f]/g;

        /**
         *
         * Normalizes the token's value by converting it to lower case and stripping
         * the diacritical marks (if any).
         *
         * @param {string} str — that needs to be normalized.
         * @return {string} the normalized value.
         * @example
         * normalize( 'Nestlé' );
         * // -> nestle
        */
        helpers.string.normalize = function (str) {
            return str.toLowerCase().normalize('NFD').replace(rgxDiacritical, '');
        }; // normalize()

        module.exports = helpers;
    }, {}], 18: [function (require, module, exports) {
        //     wink-tokenizer
        //     Multilingual tokenizer that automatically tags each token with its type.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-tokenizer”.
        //
        //     “wink-tokenizer” is free software: you can redistribute
        //     it and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-tokenizer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-tokenizer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        var contractions = Object.create(null);

        // Tag - word.
        var word = 'word';
        // Verbs.
        contractions['can\'t'] = [{ value: 'ca', tag: word }, { value: 'n\'t', tag: word }];
        contractions['CAN\'T'] = [{ value: 'CA', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Can\'t'] = [{ value: 'Ca', tag: word }, { value: 'n\'t', tag: word }];

        contractions['Couldn\'t'] = [{ value: 'could', tag: word }, { value: 'n\'t', tag: word }];
        contractions['COULDN\'T'] = [{ value: 'COULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Couldn\'t'] = [{ value: 'Could', tag: word }, { value: 'n\'t', tag: word }];

        contractions['don\'t'] = [{ value: 'do', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DON\'T'] = [{ value: 'DO', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Don\'t'] = [{ value: 'Do', tag: word }, { value: 'n\'t', tag: word }];

        contractions['doesn\'t'] = [{ value: 'does', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DOESN\'T'] = [{ value: 'DOES', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Doesn\'t'] = [{ value: 'Does', tag: word }, { value: 'n\'t', tag: word }];

        contractions['didn\'t'] = [{ value: 'did', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DIDN\'T'] = [{ value: 'DID', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Didn\'t'] = [{ value: 'Did', tag: word }, { value: 'n\'t', tag: word }];

        contractions['hadn\'t'] = [{ value: 'had', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HADN\'T'] = [{ value: 'HAD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Hadn\'t'] = [{ value: 'Had', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mayn\'t'] = [{ value: 'may', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MAYN\'T'] = [{ value: 'MAY', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mayn\'t'] = [{ value: 'May', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mightn\'t'] = [{ value: 'might', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MIGHTN\'T'] = [{ value: 'MIGHT', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mightn\'t'] = [{ value: 'Might', tag: word }, { value: 'n\'t', tag: word }];

        contractions['mustn\'t'] = [{ value: 'must', tag: word }, { value: 'n\'t', tag: word }];
        contractions['MUSTN\'T'] = [{ value: 'MUST', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Mustn\'t'] = [{ value: 'Must', tag: word }, { value: 'n\'t', tag: word }];

        contractions['needn\'t'] = [{ value: 'need', tag: word }, { value: 'n\'t', tag: word }];
        contractions['NEEDN\'T'] = [{ value: 'NEED', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Needn\'t'] = [{ value: 'Need', tag: word }, { value: 'n\'t', tag: word }];

        contractions['oughtn\'t'] = [{ value: 'ought', tag: word }, { value: 'n\'t', tag: word }];
        contractions['OUGHTN\'T'] = [{ value: 'OUGHT', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Oughtn\'t'] = [{ value: 'Ought', tag: word }, { value: 'n\'t', tag: word }];

        contractions['shan\'t'] = [{ value: 'sha', tag: word }, { value: 'n\'t', tag: word }];
        contractions['SHAN\'T'] = [{ value: 'SHA', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Shan\'t'] = [{ value: 'Sha', tag: word }, { value: 'n\'t', tag: word }];

        contractions['shouldn\'t'] = [{ value: 'should', tag: word }, { value: 'n\'t', tag: word }];
        contractions['SHOULDN\'T'] = [{ value: 'SHOULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Shouldn\'t'] = [{ value: 'Should', tag: word }, { value: 'n\'t', tag: word }];

        contractions['won\'t'] = [{ value: 'wo', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WON\'T'] = [{ value: 'WO', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Won\'t'] = [{ value: 'Wo', tag: word }, { value: 'n\'t', tag: word }];

        contractions['wouldn\'t'] = [{ value: 'would', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WOULDN\'T'] = [{ value: 'WOULD', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Wouldn\'t'] = [{ value: 'Would', tag: word }, { value: 'n\'t', tag: word }];

        contractions['ain\'t'] = [{ value: 'ai', tag: word }, { value: 'n\'t', tag: word }];
        contractions['AIN\'T'] = [{ value: 'AI', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Ain\'t'] = [{ value: 'Ai', tag: word }, { value: 'n\'t', tag: word }];

        contractions['aren\'t'] = [{ value: 'are', tag: word }, { value: 'n\'t', tag: word }];
        contractions['AREN\'T'] = [{ value: 'ARE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Aren\'t'] = [{ value: 'Are', tag: word }, { value: 'n\'t', tag: word }];

        contractions['isn\'t'] = [{ value: 'is', tag: word }, { value: 'n\'t', tag: word }];
        contractions['ISN\'T'] = [{ value: 'IS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Isn\'t'] = [{ value: 'Is', tag: word }, { value: 'n\'t', tag: word }];

        contractions['wasn\'t'] = [{ value: 'was', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WASN\'T'] = [{ value: 'WAS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Wasn\'t'] = [{ value: 'Was', tag: word }, { value: 'n\'t', tag: word }];

        contractions['weren\'t'] = [{ value: 'were', tag: word }, { value: 'n\'t', tag: word }];
        contractions['WEREN\'T'] = [{ value: 'WERE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Weren\'t'] = [{ value: 'Were', tag: word }, { value: 'n\'t', tag: word }];

        contractions['haven\'t'] = [{ value: 'have', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HAVEN\'T'] = [{ value: 'HAVE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Haven\'t'] = [{ value: 'Have', tag: word }, { value: 'n\'t', tag: word }];

        contractions['hasn\'t'] = [{ value: 'has', tag: word }, { value: 'n\'t', tag: word }];
        contractions['HASN\'T'] = [{ value: 'HAS', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Hasn\'t'] = [{ value: 'Has', tag: word }, { value: 'n\'t', tag: word }];

        contractions['daren\'t'] = [{ value: 'dare', tag: word }, { value: 'n\'t', tag: word }];
        contractions['DAREN\'T'] = [{ value: 'DARE', tag: word }, { value: 'N\'T', tag: word }];
        contractions['Daren\'t'] = [{ value: 'Dare', tag: word }, { value: 'n\'t', tag: word }];

        // Pronouns like I, you, they, we, she, and he.
        contractions['i\'m'] = [{ value: 'i', tag: word }, { value: '\'m', tag: word }];
        contractions['I\'M'] = [{ value: 'I', tag: word }, { value: '\'M', tag: word }];
        contractions['I\'m'] = [{ value: 'I', tag: word }, { value: '\'m', tag: word }];

        contractions['i\'ve'] = [{ value: 'i', tag: word }, { value: '\'ve', tag: word }];
        contractions['I\'VE'] = [{ value: 'I', tag: word }, { value: '\'VE', tag: word }];
        contractions['I\'ve'] = [{ value: 'I', tag: word }, { value: '\'ve', tag: word }];

        contractions['i\'d'] = [{ value: 'i', tag: word }, { value: '\'d', tag: word }];
        contractions['I\'D'] = [{ value: 'I', tag: word }, { value: '\'D', tag: word }];
        contractions['I\'d'] = [{ value: 'I', tag: word }, { value: '\'d', tag: word }];

        contractions['i\'ll'] = [{ value: 'i', tag: word }, { value: '\'ll', tag: word }];
        contractions['I\'LL'] = [{ value: 'I', tag: word }, { value: '\'LL', tag: word }];
        contractions['I\'ll'] = [{ value: 'I', tag: word }, { value: '\'ll', tag: word }];

        contractions['you\'ve'] = [{ value: 'you', tag: word }, { value: '\'ve', tag: word }];
        contractions['YOU\'VE'] = [{ value: 'YOU', tag: word }, { value: '\'VE', tag: word }];
        contractions['You\'ve'] = [{ value: 'You', tag: word }, { value: '\'ve', tag: word }];

        contractions['you\'d'] = [{ value: 'you', tag: word }, { value: '\'d', tag: word }];
        contractions['YOU\'D'] = [{ value: 'YOU', tag: word }, { value: '\'D', tag: word }];
        contractions['You\'d'] = [{ value: 'You', tag: word }, { value: '\'d', tag: word }];

        contractions['you\'ll'] = [{ value: 'you', tag: word }, { value: '\'ll', tag: word }];
        contractions['YOU\'LL'] = [{ value: 'YOU', tag: word }, { value: '\'LL', tag: word }];
        contractions['You\'ll'] = [{ value: 'You', tag: word }, { value: '\'ll', tag: word }];

        // they - 've, 'd, 'll, 're
        contractions['they\'ve'] = [{ value: 'they', tag: word }, { value: '\'ve', tag: word }];
        contractions['THEY\'VE'] = [{ value: 'THEY', tag: word }, { value: '\'VE', tag: word }];
        contractions['They\'ve'] = [{ value: 'They', tag: word }, { value: '\'ve', tag: word }];

        contractions['they\'d'] = [{ value: 'they', tag: word }, { value: '\'d', tag: word }];
        contractions['THEY\'D'] = [{ value: 'THEY', tag: word }, { value: '\'D', tag: word }];
        contractions['They\'d'] = [{ value: 'They', tag: word }, { value: '\'d', tag: word }];

        contractions['they\'ll'] = [{ value: 'they', tag: word }, { value: '\'ll', tag: word }];
        contractions['THEY\'LL'] = [{ value: 'THEY', tag: word }, { value: '\'LL', tag: word }];
        contractions['They\'ll'] = [{ value: 'They', tag: word }, { value: '\'ll', tag: word }];

        contractions['they\'re'] = [{ value: 'they', tag: word }, { value: '\'re', tag: word }];
        contractions['THEY\'RE'] = [{ value: 'THEY', tag: word }, { value: '\'RE', tag: word }];
        contractions['They\'re'] = [{ value: 'They', tag: word }, { value: '\'re', tag: word }];

        contractions['we\'ve'] = [{ value: 'we', tag: word }, { value: '\'ve', tag: word }];
        contractions['WE\'VE'] = [{ value: 'WE', tag: word }, { value: '\'VE', tag: word }];
        contractions['We\'ve'] = [{ value: 'We', tag: word }, { value: '\'ve', tag: word }];

        contractions['we\'d'] = [{ value: 'we', tag: word }, { value: '\'d', tag: word }];
        contractions['WE\'D'] = [{ value: 'WE', tag: word }, { value: '\'D', tag: word }];
        contractions['We\'d'] = [{ value: 'We', tag: word }, { value: '\'d', tag: word }];

        contractions['we\'ll'] = [{ value: 'we', tag: word }, { value: '\'ll', tag: word }];
        contractions['WE\'LL'] = [{ value: 'WE', tag: word }, { value: '\'LL', tag: word }];
        contractions['We\'ll'] = [{ value: 'We', tag: word }, { value: '\'ll', tag: word }];

        contractions['we\'re'] = [{ value: 'we', tag: word }, { value: '\'re', tag: word }];
        contractions['WE\'RE'] = [{ value: 'WE', tag: word }, { value: '\'RE', tag: word }];
        contractions['We\'re'] = [{ value: 'We', tag: word }, { value: '\'re', tag: word }];

        contractions['she\'d'] = [{ value: 'she', tag: word }, { value: '\'d', tag: word }];
        contractions['SHE\'D'] = [{ value: 'SHE', tag: word }, { value: '\'D', tag: word }];
        contractions['She\'d'] = [{ value: 'She', tag: word }, { value: '\'d', tag: word }];

        contractions['she\'ll'] = [{ value: 'she', tag: word }, { value: '\'ll', tag: word }];
        contractions['SHE\'LL'] = [{ value: 'SHE', tag: word }, { value: '\'LL', tag: word }];
        contractions['She\'ll'] = [{ value: 'She', tag: word }, { value: '\'ll', tag: word }];

        contractions['she\'s'] = [{ value: 'she', tag: word }, { value: '\'s', tag: word }];
        contractions['SHE\'S'] = [{ value: 'SHE', tag: word }, { value: '\'S', tag: word }];
        contractions['She\'s'] = [{ value: 'She', tag: word }, { value: '\'s', tag: word }];

        contractions['he\'d'] = [{ value: 'he', tag: word }, { value: '\'d', tag: word }];
        contractions['HE\'D'] = [{ value: 'HE', tag: word }, { value: '\'D', tag: word }];
        contractions['He\'d'] = [{ value: 'He', tag: word }, { value: '\'d', tag: word }];

        contractions['he\'ll'] = [{ value: 'he', tag: word }, { value: '\'ll', tag: word }];
        contractions['HE\'LL'] = [{ value: 'HE', tag: word }, { value: '\'LL', tag: word }];
        contractions['He\'ll'] = [{ value: 'He', tag: word }, { value: '\'ll', tag: word }];

        contractions['he\'s'] = [{ value: 'he', tag: word }, { value: '\'s', tag: word }];
        contractions['HE\'S'] = [{ value: 'HE', tag: word }, { value: '\'S', tag: word }];
        contractions['He\'s'] = [{ value: 'He', tag: word }, { value: '\'s', tag: word }];

        contractions['it\'d'] = [{ value: 'it', tag: word }, { value: '\'d', tag: word }];
        contractions['IT\'D'] = [{ value: 'IT', tag: word }, { value: '\'D', tag: word }];
        contractions['It\'d'] = [{ value: 'It', tag: word }, { value: '\'d', tag: word }];

        contractions['it\'ll'] = [{ value: 'it', tag: word }, { value: '\'ll', tag: word }];
        contractions['IT\'LL'] = [{ value: 'IT', tag: word }, { value: '\'LL', tag: word }];
        contractions['It\'ll'] = [{ value: 'It', tag: word }, { value: '\'ll', tag: word }];

        contractions['it\'s'] = [{ value: 'it', tag: word }, { value: '\'s', tag: word }];
        contractions['IT\'S'] = [{ value: 'IT', tag: word }, { value: '\'S', tag: word }];
        contractions['It\'s'] = [{ value: 'It', tag: word }, { value: '\'s', tag: word }];

        // Wh Pronouns - what, who, when, where, why, how, there, that
        contractions['what\'ve'] = [{ value: 'what', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHAT\'VE'] = [{ value: 'WHAT', tag: word }, { value: '\'VE', tag: word }];
        contractions['What\'ve'] = [{ value: 'What', tag: word }, { value: '\'ve', tag: word }];

        contractions['what\'d'] = [{ value: 'what', tag: word }, { value: '\'d', tag: word }];
        contractions['WHAT\'D'] = [{ value: 'WHAT', tag: word }, { value: '\'D', tag: word }];
        contractions['What\'d'] = [{ value: 'What', tag: word }, { value: '\'d', tag: word }];

        contractions['what\'ll'] = [{ value: 'what', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHAT\'LL'] = [{ value: 'WHAT', tag: word }, { value: '\'LL', tag: word }];
        contractions['What\'ll'] = [{ value: 'What', tag: word }, { value: '\'ll', tag: word }];

        contractions['what\'re'] = [{ value: 'what', tag: word }, { value: '\'re', tag: word }];
        contractions['WHAT\'RE'] = [{ value: 'WHAT', tag: word }, { value: '\'RE', tag: word }];
        contractions['What\'re'] = [{ value: 'What', tag: word }, { value: '\'re', tag: word }];

        contractions['who\'ve'] = [{ value: 'who', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHO\'VE'] = [{ value: 'WHO', tag: word }, { value: '\'VE', tag: word }];
        contractions['Who\'ve'] = [{ value: 'Who', tag: word }, { value: '\'ve', tag: word }];

        contractions['who\'d'] = [{ value: 'who', tag: word }, { value: '\'d', tag: word }];
        contractions['WHO\'D'] = [{ value: 'WHO', tag: word }, { value: '\'D', tag: word }];
        contractions['Who\'d'] = [{ value: 'Who', tag: word }, { value: '\'d', tag: word }];

        contractions['who\'ll'] = [{ value: 'who', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHO\'LL'] = [{ value: 'WHO', tag: word }, { value: '\'LL', tag: word }];
        contractions['Who\'ll'] = [{ value: 'Who', tag: word }, { value: '\'ll', tag: word }];

        contractions['who\'re'] = [{ value: 'who', tag: word }, { value: '\'re', tag: word }];
        contractions['WHO\'RE'] = [{ value: 'WHO', tag: word }, { value: '\'RE', tag: word }];
        contractions['Who\'re'] = [{ value: 'Who', tag: word }, { value: '\'re', tag: word }];

        contractions['when\'ve'] = [{ value: 'when', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHEN\'VE'] = [{ value: 'WHEN', tag: word }, { value: '\'VE', tag: word }];
        contractions['When\'ve'] = [{ value: 'When', tag: word }, { value: '\'ve', tag: word }];

        contractions['when\'d'] = [{ value: 'when', tag: word }, { value: '\'d', tag: word }];
        contractions['WHEN\'D'] = [{ value: 'WHEN', tag: word }, { value: '\'D', tag: word }];
        contractions['When\'d'] = [{ value: 'When', tag: word }, { value: '\'d', tag: word }];

        contractions['when\'ll'] = [{ value: 'when', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHEN\'LL'] = [{ value: 'WHEN', tag: word }, { value: '\'LL', tag: word }];
        contractions['When\'ll'] = [{ value: 'When', tag: word }, { value: '\'ll', tag: word }];

        contractions['when\'re'] = [{ value: 'when', tag: word }, { value: '\'re', tag: word }];
        contractions['WHEN\'RE'] = [{ value: 'WHEN', tag: word }, { value: '\'RE', tag: word }];
        contractions['When\'re'] = [{ value: 'When', tag: word }, { value: '\'re', tag: word }];

        contractions['where\'ve'] = [{ value: 'where', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHERE\'VE'] = [{ value: 'WHERE', tag: word }, { value: '\'VE', tag: word }];
        contractions['Where\'ve'] = [{ value: 'Where', tag: word }, { value: '\'ve', tag: word }];

        contractions['where\'d'] = [{ value: 'where', tag: word }, { value: '\'d', tag: word }];
        contractions['WHERE\'D'] = [{ value: 'WHERE', tag: word }, { value: '\'D', tag: word }];
        contractions['Where\'d'] = [{ value: 'Where', tag: word }, { value: '\'d', tag: word }];

        contractions['where\'ll'] = [{ value: 'where', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHERE\'LL'] = [{ value: 'WHERE', tag: word }, { value: '\'LL', tag: word }];
        contractions['Where\'ll'] = [{ value: 'Where', tag: word }, { value: '\'ll', tag: word }];

        contractions['where\'re'] = [{ value: 'where', tag: word }, { value: '\'re', tag: word }];
        contractions['WHERE\'RE'] = [{ value: 'WHERE', tag: word }, { value: '\'RE', tag: word }];
        contractions['Where\'re'] = [{ value: 'Where', tag: word }, { value: '\'re', tag: word }];

        contractions['why\'ve'] = [{ value: 'why', tag: word }, { value: '\'ve', tag: word }];
        contractions['WHY\'VE'] = [{ value: 'WHY', tag: word }, { value: '\'VE', tag: word }];
        contractions['Why\'ve'] = [{ value: 'Why', tag: word }, { value: '\'ve', tag: word }];

        contractions['why\'d'] = [{ value: 'why', tag: word }, { value: '\'d', tag: word }];
        contractions['WHY\'D'] = [{ value: 'WHY', tag: word }, { value: '\'D', tag: word }];
        contractions['Why\'d'] = [{ value: 'Why', tag: word }, { value: '\'d', tag: word }];

        contractions['why\'ll'] = [{ value: 'why', tag: word }, { value: '\'ll', tag: word }];
        contractions['WHY\'LL'] = [{ value: 'WHY', tag: word }, { value: '\'LL', tag: word }];
        contractions['Why\'ll'] = [{ value: 'Why', tag: word }, { value: '\'ll', tag: word }];

        contractions['why\'re'] = [{ value: 'why', tag: word }, { value: '\'re', tag: word }];
        contractions['WHY\'RE'] = [{ value: 'WHY', tag: word }, { value: '\'RE', tag: word }];
        contractions['Why\'re'] = [{ value: 'Why', tag: word }, { value: '\'re', tag: word }];

        contractions['how\'ve'] = [{ value: 'how', tag: word }, { value: '\'ve', tag: word }];
        contractions['HOW\'VE'] = [{ value: 'HOW', tag: word }, { value: '\'VE', tag: word }];
        contractions['How\'ve'] = [{ value: 'How', tag: word }, { value: '\'ve', tag: word }];

        contractions['how\'d'] = [{ value: 'how', tag: word }, { value: '\'d', tag: word }];
        contractions['HOW\'D'] = [{ value: 'HOW', tag: word }, { value: '\'D', tag: word }];
        contractions['How\'d'] = [{ value: 'How', tag: word }, { value: '\'d', tag: word }];

        contractions['how\'ll'] = [{ value: 'how', tag: word }, { value: '\'ll', tag: word }];
        contractions['HOW\'LL'] = [{ value: 'HOW', tag: word }, { value: '\'LL', tag: word }];
        contractions['How\'ll'] = [{ value: 'How', tag: word }, { value: '\'ll', tag: word }];

        contractions['how\'re'] = [{ value: 'how', tag: word }, { value: '\'re', tag: word }];
        contractions['HOW\'RE'] = [{ value: 'HOW', tag: word }, { value: '\'RE', tag: word }];
        contractions['How\'re'] = [{ value: 'How', tag: word }, { value: '\'re', tag: word }];

        contractions['there\'ve'] = [{ value: 'there', tag: word }, { value: '\'ve', tag: word }];
        contractions['THERE\'VE'] = [{ value: 'THERE', tag: word }, { value: '\'VE', tag: word }];
        contractions['There\'ve'] = [{ value: 'There', tag: word }, { value: '\'ve', tag: word }];

        contractions['there\'d'] = [{ value: 'there', tag: word }, { value: '\'d', tag: word }];
        contractions['THERE\'D'] = [{ value: 'THERE', tag: word }, { value: '\'D', tag: word }];
        contractions['There\'d'] = [{ value: 'There', tag: word }, { value: '\'d', tag: word }];

        contractions['there\'ll'] = [{ value: 'there', tag: word }, { value: '\'ll', tag: word }];
        contractions['THERE\'LL'] = [{ value: 'THERE', tag: word }, { value: '\'LL', tag: word }];
        contractions['There\'ll'] = [{ value: 'There', tag: word }, { value: '\'ll', tag: word }];

        contractions['there\'re'] = [{ value: 'there', tag: word }, { value: '\'re', tag: word }];
        contractions['THERE\'RE'] = [{ value: 'THERE', tag: word }, { value: '\'RE', tag: word }];
        contractions['There\'re'] = [{ value: 'There', tag: word }, { value: '\'re', tag: word }];

        contractions['that\'ve'] = [{ value: 'that', tag: word }, { value: '\'ve', tag: word }];
        contractions['THAT\'VE'] = [{ value: 'THAT', tag: word }, { value: '\'VE', tag: word }];
        contractions['That\'ve'] = [{ value: 'That', tag: word }, { value: '\'ve', tag: word }];

        contractions['that\'d'] = [{ value: 'that', tag: word }, { value: '\'d', tag: word }];
        contractions['THAT\'D'] = [{ value: 'THAT', tag: word }, { value: '\'D', tag: word }];
        contractions['That\'d'] = [{ value: 'That', tag: word }, { value: '\'d', tag: word }];

        contractions['that\'ll'] = [{ value: 'that', tag: word }, { value: '\'ll', tag: word }];
        contractions['THAT\'LL'] = [{ value: 'THAT', tag: word }, { value: '\'LL', tag: word }];
        contractions['That\'ll'] = [{ value: 'That', tag: word }, { value: '\'ll', tag: word }];

        contractions['that\'re'] = [{ value: 'that', tag: word }, { value: '\'re', tag: word }];
        contractions['THAT\'RE'] = [{ value: 'THAT', tag: word }, { value: '\'RE', tag: word }];
        contractions['That\'re'] = [{ value: 'That', tag: word }, { value: '\'re', tag: word }];

        // Let us!
        contractions['let\'s'] = [{ value: 'let', tag: word }, { value: '\'s', tag: word }];
        contractions['LET\'S'] = [{ value: 'THAT', tag: word }, { value: '\'S', tag: word }];
        contractions['Let\'s'] = [{ value: 'Let', tag: word }, { value: '\'s', lemma: 'us' }];

        module.exports = contractions;
    }, {}], 19: [function (require, module, exports) {
        //     wink-tokenizer
        //     Multilingual tokenizer that automatically tags each token with its type.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-tokenizer”.
        //
        //     “wink-tokenizer” is free software: you can redistribute
        //     it and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-tokenizer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-tokenizer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var contractions = require('./eng-contractions.js');
        var rgxSpaces = /\s+/g;
        // Ordinals only for Latin like 1st, 2nd or 12th or 33rd.
        var rgxOrdinalL1 = /1\dth|[04-9]th|1st|2nd|3rd|[02-9]1st|[02-9]2nd|[02-9]3rd|[02-9][04-9]th|\d+\d[04-9]th|\d+\d1st|\d+\d2nd|\d+\d3rd/g;
        // Apart from detecting pure integers or decimals, also detect numbers containing
        // `. - / ,` so that dates, ip address, fractions and things like codes or part
        // numbers are also detected as numbers only. These regex will therefore detected
        // 8.8.8.8 or 12-12-1924 or 1,1,1,1.00 or 1/4 or 1/4/66/777 as numbers.
        // Latin-1 Numbers.
        var rgxNumberL1 = /\d+\/\d+|\d(?:[\.\,\-\/]?\d)*(?:\.\d+)?/g;
        // Devanagari Numbers.
        var rgxNumberDV = /[\u0966-\u096F]+\/[\u0966-\u096F]+|[\u0966-\u096F](?:[\.\,\-\/]?[\u0966-\u096F])*(?:\.[\u0966-\u096F]+)?/g;
        var rgxMention = /\@\w+/g;
        // Latin-1 Hashtags.
        var rgxHashtagL1 = /\#[a-z][a-z0-9]*/gi;
        // Devanagari Hashtags; include Latin-1 as well.
        var rgxHashtagDV = /\#[\u0900-\u0963\u0970-\u097F][\u0900-\u0963\u0970-\u097F\u0966-\u096F0-9]*/gi;
        // EMail is EN character set.
        var rgxEmail = /[-!#$%&'*+\/=?^\w{|}~](?:\.?[-!#$%&'*+\/=?^\w`{|}~])*@[a-z0-9](?:-?\.?[a-z0-9])*(?:\.[a-z](?:-?[a-z0-9])*)+/gi;
        // Bitcoin, Ruble, Indian Rupee, Other Rupee, Dollar, Pound, Yen, Euro, Wong.
        var rgxCurrency = /[\₿\₽\₹\₨\$\£\¥\€\₩]/g;
        // These include both the punctuations: Latin-1 & Devanagari.
        var rgxPunctuation = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\,\.\!\;\?\/\-\:\u0964\u0965]/g;
        var rgxQuotedPhrase = /\"[^\"]*\"/g;
        // NOTE: URL will support only EN character set for now.
        var rgxURL = /(?:https?:\/\/)(?:[\da-z\.-]+)\.(?:[a-z\.]{2,6})(?:[\/\w\.\-\?#=]*)*\/?/gi;
        var rgxEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF]|[\u2700-\u27BF]/g;
        var rgxEmoticon = /:-?[dps\*\/\[\]\{\}\(\)]|;-?[/(/)d]|<3/gi;
        var rgxTime = /(?:\d|[01]\d|2[0-3]):?(?:[0-5][0-9])?\s?(?:[ap]\.?m\.?|hours|hrs)/gi;
        // Inlcude [Latin-1 Supplement Unicode Block](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block))
        var rgxWordL1 = /[a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF][a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF\']*/gi;
        // Define [Devanagari Unicode Block](https://unicode.org/charts/PDF/U0900.pdf)
        var rgxWordDV = /[\u0900-\u094F\u0951-\u0963\u0970-\u097F]+/gi;
        // Symbols go here; including Om.
        var rgxSymbol = /[\u0950\~\@\#\%\^\+\=\*\|<>&]/g;
        // For detecting if the word is a potential contraction.
        var rgxContraction = /\'/;
        // Singular & Plural possessive
        var rgxPosSingular = /([a-z]+)(\'s)$/i;
        var rgxPosPlural = /([a-z]+s)(\')$/i;
        // Regexes and their categories; used for tokenizing via match/split. The
        // sequence is *critical* for correct tokenization.
        var rgxsMaster = [{ regex: rgxQuotedPhrase, category: 'quoted_phrase' }, { regex: rgxURL, category: 'url' }, { regex: rgxEmail, category: 'email' }, { regex: rgxMention, category: 'mention' }, { regex: rgxHashtagL1, category: 'hashtag' }, { regex: rgxHashtagDV, category: 'hashtag' }, { regex: rgxEmoji, category: 'emoji' }, { regex: rgxEmoticon, category: 'emoticon' }, { regex: rgxTime, category: 'time' }, { regex: rgxOrdinalL1, category: 'ordinal' }, { regex: rgxNumberL1, category: 'number' }, { regex: rgxNumberDV, category: 'number' }, { regex: rgxCurrency, category: 'currency' }, { regex: rgxWordL1, category: 'word' }, { regex: rgxWordDV, category: 'word' }, { regex: rgxPunctuation, category: 'punctuation' }, { regex: rgxSymbol, category: 'symbol' }];

        // Used to generate finger print from the tokens.
        // NOTE: this variable is being reset in `defineConfig()`.
        var fingerPrintCodes = {
            emoticon: 'c',
            email: 'e',
            emoji: 'j',
            hashtag: 'h',
            mention: 'm',
            number: 'n',
            ordinal: 'o',
            quoted_phrase: 'q', // eslint-disable-line camelcase
            currency: 'r',
            // symbol: 's',
            time: 't',
            url: 'u',
            word: 'w',
            alien: 'z'
        };

        // ### tokenizer
        /**
         *
         * Creates an instance of **`wink-tokenizer`**.
         *
         * @return {methods} object conatining set of API methods for tokenizing a sentence
         * and defining configuration, plugin etc.
         * @example
         * // Load wink tokenizer.
         * var tokenizer = require( 'wink-tokenizer' );
         * // Create your instance of wink tokenizer.
         * var myTokenizer = tokenizer();
        */
        var tokenizer = function () {
            // Default configuration: most comprehensive tokenization. Make deep copy!
            var rgxs = rgxsMaster.slice(0);
            // The result of last call to `tokenize()` is retained here.
            var finalTokens = [];
            // Returned!
            var methods = Object.create(null);

            // ### manageContraction
            /**
             *
             * Splits a contractions into words by first trying a lookup in strandard
             * `contractions`; if the lookup fails, it checks for possessive in `'s` or
             * `s'` forms and separates the possesive part from the word. Otherwise the
             * contraction is treated as a normal word and no splitting occurs.
             *
             * @param {string} word — that could be a potential conraction.
             * @param {object[]} tokens — where the outcome is pushed.
             * @return {object[]} updated tokens according to the `word.`
             * @private
            */
            var manageContraction = function (word, tokens) {
                var ct = contractions[word];
                var matches;
                if (ct === undefined) {
                    // Try possesive of sigular & plural forms
                    matches = word.match(rgxPosSingular);
                    if (matches) {
                        tokens.push({ value: matches[1], tag: 'word' });
                        tokens.push({ value: matches[2], tag: 'word' });
                    } else {
                        matches = word.match(rgxPosPlural);
                        if (matches) {
                            tokens.push({ value: matches[1], tag: 'word' });
                            tokens.push({ value: matches[2], tag: 'word' });
                        } else tokens.push({ value: word, tag: 'word' });
                    }
                } else {
                    // Manage via lookup; ensure cloning!
                    tokens.push(Object.assign({}, ct[0]));
                    tokens.push(Object.assign({}, ct[1]));
                }
                return tokens;
            }; // manageContraction()

            // ### tokenizeTextUnit
            /**
             *
             * Attempts to tokenize the input `text` using the `rgxSplit`. The tokenization
             * is carried out by combining the regex matches and splits in the right sequence.
             * The matches are the *real tokens*, whereas splits are text units that are
             * tokenized in later rounds! The real tokens (i.e. matches) are pushed as
             * `object` and splits as `string`.
             *
             * @param {string} text — unit that is to be tokenized.
             * @param {object} rgxSplit — object containing the regex and it's category.
             * @return {array} of tokens.
             * @private
            */
            var tokenizeTextUnit = function (text, rgxSplit) {
                // Regex matches go here; note each match is a token and has the same tag
                // as of regex's category.
                var matches = text.match(rgxSplit.regex);
                // Balance is "what needs to be tokenized".
                var balance = text.split(rgxSplit.regex);
                // The result, in form of combination of tokens & matches, is captured here.
                var tokens = [];
                // The tag;
                var tag = rgxSplit.category;
                // Helper variables.
                var aword,
                    i,
                    imax,
                    k = 0,
                    t;

                // Combine tokens & matches in the following pattern [ b0 m0 b1 m1 ... ]
                matches = matches ? matches : [];
                for (i = 0, imax = balance.length; i < imax; i += 1) {
                    t = balance[i];
                    t = t.trim();
                    if (t) tokens.push(t);
                    if (k < matches.length) {
                        if (tag === 'word') {
                            // Tag type `word` token may have a contraction.
                            aword = matches[k];
                            if (rgxContraction.test(aword)) {
                                tokens = manageContraction(aword, tokens);
                            } else {
                                // Means there is no contraction.
                                tokens.push({ value: aword, tag: tag });
                            }
                        } else tokens.push({ value: matches[k], tag: tag });
                    }
                    k += 1;
                }

                return tokens;
            }; // tokenizeTextUnit()

            // ### tokenizeTextRecursively
            /**
             *
             * Tokenizes the input text recursively using the array of `regexes` and then
             * the `tokenizeTextUnit()` function. If (or whenever) the `regexes` becomes
             * empty, it simply splits the text on non-word characters instead of using
             * the `tokenizeTextUnit()` function.
             *
             * @param {string} text — unit that is to be tokenized.
             * @param {object} regexes — object containing the regex and it's category.
             * @return {undefined} nothing!
             * @private
            */
            var tokenizeTextRecursively = function (text, regexes) {
                var sentence = text.trim();
                var tokens = [];
                var i, imax;

                if (!regexes.length) {
                    // No regex left, split on `spaces` and tag every token as **alien**.
                    text.split(rgxSpaces).forEach(function (tkn) {
                        finalTokens.push({ value: tkn.trim(), tag: 'alien' });
                    });
                    return;
                }

                var rgx = regexes[0];
                tokens = tokenizeTextUnit(sentence, rgx);

                for (i = 0, imax = tokens.length; i < imax; i += 1) {
                    if (typeof tokens[i] === 'string') {
                        // Strings become candidates for further tokenization.
                        tokenizeTextRecursively(tokens[i], regexes.slice(1));
                    } else {
                        finalTokens.push(tokens[i]);
                    }
                }
            }; // tokenizeTextRecursively()

            // ### defineConfig
            /**
             *
             * Defines the configuration in terms of the types of token that will be
             * extracted by [`tokenize()`](#tokenize) method. Note by default, all types
             * of tokens will be detected and tagged automatically.
             *
             * @param {object} config — It defines 0 or more properties from the list of
             * **14** properties. A true value for a property ensures tokenization
             * for that type of text; whereas false value will mean that the tokenization of that
             * type of text will not be attempted. It also **resets** the effect of any previous
             * call(s) to the [`addRegex()`](#addregex) API.
             *
             * *An empty config object is equivalent to splitting on spaces. Whatever tokens
             * are created like this are tagged as **alien** and **`z`** is the
             * [finger print](#gettokensfp) code of this token type.*
             *
             * The table below gives the name of each property and it's description including
             * examples. The character with in paranthesis is the [finger print](#gettokensfp) code for the
             * token of that type.
             * @param {boolean} [config.currency=true] such as **$** or **£** symbols (**`r`**)
             * @param {boolean} [config.email=true] for example **john@acme.com** or **superman1@gmail.com** (**`e`**)
             * @param {boolean} [config.emoji=true] any standard unicode emojis e.g. 😊 or 😂 or 🎉 (**`j`**)
             * @param {boolean} [config.emoticon=true] common emoticons such as **`:-)`** or **`:D`** (**`c`**)
             * @param {boolean} [config.hashtag=true] hash tags such as **`#happy`** or **`#followme`** (**`h`**)
             * @param {boolean} [config.number=true] any integer, decimal number, fractions such as **19**, **2.718**
             * or **1/4** and numerals containing "**`, - / .`**", for example 12-12-1924 (**`n`**)
             * @param {boolean} [config.ordinal=true] ordinals like **1st**, **2nd**, **3rd**, **4th** or **12th** or **91st** (**`o`**)
             * @param {boolean} [config.punctuation=true] common punctuation such as **`?`** or **`,`**
             * ( token becomes fingerprint )
             * @param {boolean} [config.quoted_phrase=true] any **"quoted text"** in the sentence. (**`q`**)
             * @param {boolean} [config.symbol=true] for example **`~`** or **`+`** or **`&`** or **`%`** ( token becomes fingerprint )
             * @param {boolean} [config.time=true] common representation of time such as **4pm** or **16:00 hours** (**`t`**)
             * @param {boolean} [config.mention=true] **@mention**  as in github or twitter (**`m`**)
             * @param {boolean} [config.url=true] URL such as **https://github.com** (**`u`**)
             * @param {boolean} [config.word=true] word such as **faster** or **résumé** or **prévenir** (**`w`**)
             * @return {number} number of properties set to true from the list of above 13.
             * @example
             * // Do not tokenize & tag @mentions.
             * var myTokenizer.defineConfig( { mention: false } );
             * // -> 13
             * // Only tokenize words as defined above.
             * var myTokenizer.defineConfig( {} );
             * // -> 0
            */
            var defineConfig = function (config) {
                if (typeof config === 'object' && Object.keys(config).length) {
                    rgxs = rgxsMaster.filter(function (rgx) {
                        // Config for the Category of `rgx`.
                        var cc = config[rgx.category];
                        // Means `undefined` & `null` values are taken as true; otherwise
                        // standard **truthy** and **falsy** interpretation applies!!
                        return cc === undefined || cc === null || !!cc;
                    });
                } else rgxs = [];
                // Count normalized length i.e. ignore multi-script entries.
                const uniqueCats = Object.create(null);
                rgxs.forEach(function (rgx) {
                    uniqueCats[rgx.category] = true;
                });
                // Reset the `fingerPrintCodes` variable.
                fingerPrintCodes = {
                    emoticon: 'c',
                    email: 'e',
                    emoji: 'j',
                    hashtag: 'h',
                    mention: 'm',
                    number: 'n',
                    ordinal: 'o',
                    quoted_phrase: 'q', // eslint-disable-line camelcase
                    currency: 'r',
                    // symbol: 's',
                    time: 't',
                    url: 'u',
                    word: 'w',
                    alien: 'z'
                };
                return Object.keys(uniqueCats).length;
            }; // defineConfig()

            // ### tokenize
            /**
             *
             * Tokenizes the input `sentence` using the configuration specified via
             * [`defineConfig()`](#defineconfig).
             * Common contractions and possessive nouns are split into 2 separate tokens;
             * for example **I'll** splits as `'I'` and `'\'ll'` or **won't** splits as
             * `'wo'` and `'n\'t'`.
             *
             * @param {string} sentence — the input sentence.
             * @return {object[]} of tokens; each one of them is an object with 2-keys viz.
             * `value` and its `tag` identifying the type of the token.
             * @example
             * var s = 'For detailed API docs, check out http://winkjs.org/wink-regression-tree/ URL!';
             * myTokenizer.tokenize( s );
             * // -> [ { value: 'For', tag: 'word' },
             * //      { value: 'detailed', tag: 'word' },
             * //      { value: 'API', tag: 'word' },
             * //      { value: 'docs', tag: 'word' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'check', tag: 'word' },
             * //      { value: 'out', tag: 'word' },
             * //      { value: 'http://winkjs.org/wink-regression-tree/', tag: 'url' },
             * //      { value: 'URL', tag: 'word' },
             * //      { value: '!', tag: 'punctuation' } ]
            */
            var tokenize = function (sentence) {
                finalTokens = [];
                tokenizeTextRecursively(sentence, rgxs);
                return finalTokens;
            }; // tokenize()

            // ### getTokensFP
            /**
             *
             * Returns the finger print of the tokens generated by the last call to
             * [`tokenize()`](#tokenize). A finger print is a string created by sequentially
             * joining the unique code of each token's type. Refer to table given under
             * [`defineConfig()`](#defineconfig) for values of these codes.
             *
             * A finger print is extremely useful in spotting patterns present in the sentence
             * using `regexes`, which is otherwise a complex and time consuming task.
             *
             * @return {string} finger print of tokens generated by the last call to `tokenize()`.
             * @example
             * // Generate finger print of sentence given in the previous example
             * // under tokenize().
             * myTokenizer.getTokensFP();
             * // -> 'wwww,wwuw!'
            */
            var getTokensFP = function () {
                var fp = [];
                finalTokens.forEach(function (t) {
                    fp.push(fingerPrintCodes[t.tag] ? fingerPrintCodes[t.tag] : t.value);
                });
                return fp.join('');
            }; // getFingerprint()

            // ### addTag
            var addTag = function (name, fingerprintCode) {
                if (fingerPrintCodes[name]) {
                    throw new Error('Tag ' + name + ' already exists');
                }

                fingerPrintCodes[name] = fingerprintCode;
            }; // addTag()

            // ### addRegex
            /**
             * Adds a regex for parsing a new type of token. This regex can either be mapped
             * to an existing tag or it allows creation of a new tag along with its finger print.
             * The uniqueness of the [finger prints](#defineconfig) have to ensured by the user.
             *
             * *The added regex(s) will supersede the internal parsing.*
             *
             * @param {RegExp} regex — the new regular expression.
             * @param {string} tag — tokens matching the `regex` will be assigned this tag.
             * @param {string} [fingerprintCode=undefined] — required if adding a new
             * tag; ignored if using an existing tag.
             * @return {void} nothing!
             * @example
             * // Adding a regex for an existing tag
             * myTokenizer.addRegex( /\(oo\)/gi, 'emoticon' );
             * myTokenizer.tokenize( '(oo) Hi!' )
             * // -> [ { value: '(oo)', tag: 'emoticon' },
             * //      { value: 'Hi', tag: 'word' },
             * //      { value: '!', tag: 'punctuation' } ]
             *
             * // Adding a regex to parse a new token type
             * myTokenizer.addRegex( /hello/gi, 'greeting', 'g' );
             * myTokenizer.tokenize( 'hello, how are you?' );
             * // -> [ { value: 'hello', tag: 'greeting' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'how', tag: 'word' },
             * //      { value: 'are', tag: 'word' },
             * //      { value: 'you', tag: 'word' },
             * //      { value: '?', tag: 'punctuation' } ]
             * // Notice how "hello" is now tagged as "greeting" and not as "word".
             *
             * // Using definConfig will reset the above!
             * myTokenizer.defineConfig( { word: true } );
             * myTokenizer.tokenize( 'hello, how are you?' );
             * // -> [ { value: 'hello', tag: 'word' },
             * //      { value: ',', tag: 'punctuation' },
             * //      { value: 'how', tag: 'word' },
             * //      { value: 'are', tag: 'word' },
             * //      { value: 'you', tag: 'word' },
             * //      { value: '?', tag: 'punctuation' } ]
            */

            var addRegex = function (regex, tag, fingerprintCode) {
                if (!fingerPrintCodes[tag] && !fingerprintCode) {
                    throw new Error('Tag ' + tag + ' doesn\'t exist; Provide a \'fingerprintCode\' to add it as a tag.');
                } else if (!fingerPrintCodes[tag]) {
                    addTag(tag, fingerprintCode);
                }

                rgxs.unshift({ regex: regex, category: tag });
            }; // addRegex()

            methods.defineConfig = defineConfig;
            methods.tokenize = tokenize;
            methods.getTokensFP = getTokensFP;
            methods.addTag = addTag;
            methods.addRegex = addRegex;
            return methods;
        };

        module.exports = tokenizer;
    }, { "./eng-contractions.js": 18 }], 20: [function (require, module, exports) {
        module.exports = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "would", "should", "could", "ought", "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll", "we'll", "they'll", "let's", "that's", "who's", "what's", "here's", "there's", "when's", "where's", "why's", "how's", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "only", "own", "same", "so", "than", "too", "very"];
    }, {}], 21: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnIndexer

        /**
         *
         * Returns an Indexer object that contains two functions. The first function `build()`
         * incrementally builds an index for each `element` using `itsIndex` — both passed as
         * parameters to it. The second function — `result()` allows accessing the index anytime.
         *
         * It is typically used with [string.soc](#stringsoc), [string.bong](#stringbong),
         * [string.song](#stringsong), and [tokens.sow](#tokenssow).
         *
         * @name helper.returnIndexer
         * @return {indexer} used to build and access the index.
         * @example
         * var indexer = returnIndexer();
         * // -> { build: [function], result: [function] }
         */
        var returnIndexer = function () {
            var theIndex = Object.create(null);
            var methods = Object.create(null);

            // Builds index by adding the `element` and `itsIndex`. The `itsIndex` should
            // be a valid JS array index; no validation checks are performed while building
            // index.
            var build = function (element, itsIndex) {
                theIndex[element] = theIndex[element] || [];
                theIndex[element].push(itsIndex);
                return true;
            }; // build()

            // Returns the index built so far.
            var result = function () {
                return theIndex;
            }; // result()

            methods.build = build;
            methods.result = result;

            return methods;
        }; // index()

        module.exports = returnIndexer;
    }, {}], 22: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnQuotedTextExtractor

        /**
         *
         * Returns a function that extracts all occurrences of every quoted text
         * between the `lq` and the `rq` characters from its argument. This argument
         * must be of type string.
         *
         * @name helper.returnQuotedTextExtractor
         * @param {string} [lq='"'] — the left quote character.
         * @param {string} [rq='"'] — the right quote character.
         * @return {function} that will accept an input string argument and return an
         * array of all substrings that are quoted between `lq` and `rq`.
         * @example
         * var extractQuotedText = returnQuotedTextExtractor();
         * extractQuotedText( 'Raise 2 issues - "fix a bug" & "run tests"' );
         * // -> [ 'fix a bug', 'run tests' ]
         */
        var returnQuotedTextExtractor = function (lq, rq) {
            var // Index variable for *for-loop*
            i,

            // Set defaults for left quote, if required.
            lq1 = lq && typeof lq === 'string' ? lq : '"',

            // Extracts its length
            lqLen = lq1.length,

            // The regular expression is created here.
            regex = null,

            // The string containing the regular expression builds here.
            rgxStr = '',

            // Set defaults for right quote, if required.
            rq1 = rq && typeof rq === 'string' ? rq : lq1,

            // Extract its length.
            rqLen = rq1.length;

            // Build `rgxStr`
            for (i = 0; i < lqLen; i += 1) rgxStr += '\\' + lq1.charAt(i);
            rgxStr += '.*?';
            for (i = 0; i < rqLen; i += 1) rgxStr += '\\' + rq1.charAt(i);
            // Create regular expression.
            regex = new RegExp(rgxStr, 'g');
            // Return the extractor function.
            return function (s) {
                if (!s || typeof s !== 'string') return null;
                var // Extracted elements are captured here.
                elements = [],

                // Extract matches with quotes
                matches = s.match(regex);
                if (!matches || matches.length === 0) return null;
                // Collect elements after removing the quotes.
                for (var k = 0, kmax = matches.length; k < kmax; k += 1) {
                    elements.push(matches[k].substr(lqLen, matches[k].length - (rqLen + lqLen)));
                }
                return elements;
            };
        }; // returnQuotedTextExtractor()

        module.exports = returnQuotedTextExtractor;
    }, {}], 23: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### returnWordsFilter

        /**
         *
         * Returns an object containing the following functions: (a) `set()`, which returns
         * a set of mapped words given in the input array `words`. (b) `exclude()` that
         * is suitable for array filtering operations.
         *
         * If the second argument `mappers` is provided as an array of maping functions
         * then these are applied on the input array before converting into a set. A
         * mapper function must accept a string as argument and return a string as the result.
         * Examples of mapper functions are typically **string** functionss of **`wink-nlp-utils`**
         * such as `string.lowerCase()`, `string.stem()` and
         * `string.soundex()`.
         *
         * @name helper.returnWordsFilter
         * @param {string[]} words — that can be filtered using the returned wordsFilter.
         * @param {function[]} [mappers=undefined] — optionally used to map each word before creating
         * the wordsFilter.
         * @return {wordsFilter} object containg `set()` and `exclude()` functions for `words`.
         * @example
         * var stopWords = [ 'This', 'That', 'Are', 'Is', 'Was', 'Will', 'a' ];
         * var myFilter = returnWordsFilter( stopWords, [ string.lowerCase ] );
         * [ 'this', 'is', 'a', 'cat' ].filter( myFilter.exclude );
         * // -> [ 'cat' ]
         */
        var returnWordsFilter = function (words, mappers) {
            var mappedWords = words;
            var givenMappers = mappers || [];
            givenMappers.forEach(function (m) {
                mappedWords = mappedWords.map(m);
            });

            mappedWords = new Set(mappedWords);

            var exclude = function (t) {
                return !mappedWords.has(t);
            }; // exclude()

            var set = function () {
                return mappedWords;
            }; // set()

            return {
                set: set,
                exclude: exclude
            };
        }; // returnWordsFilter()

        module.exports = returnWordsFilter;
    }, {}], 24: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var degrees = [/\bm\.?\s*a\b/i, /\bb\.?\s*a\b/i, /\bb\.?\s*tech\b/i, /\bm\.?\s*tech\b/i, /\bb\.?\s*des\b/i, /\bm\.?\s*des\b/i, /\bm\.?\s*b\.?\s*a\b/i, /\bm\.?\s*c\.?\s*a\b/i, /\bb\.?\s*c\.?\s*a\b/i, /\bl\.?\s*l\.?\s*b\b/i, /\bl\.?\s*l\.?\s*m\b/i, /\bm\.?\s*b\.?\s*b\.?\s*s\b/i, /\bm\.?\s*d\b/i, /\bd\.?\s*m\b/i, /\bm\.?\s*s\b/i, /\bd\.?\s*n\.?\s*b\b/i, /\bd\.?\s*g\.?\s*o\b/i, /\bd\.?\s*l\.?\s*o\b/i, /\bb\.?\s*d\.?\s*s\b/i, /\bb\.?\s*h\.?\s*m\.?\s*s\b/i, /\bb\.?\s*a\.?\s*m\.?\s*s\b/i, /\bf\.?\s*i\.?\s*c\.?\s*s\b/i, /\bm\.?\s*n\.?\s*a\.?\s*m\.?\s*s\b/i, /\bb\.?\s*e\.?\s*m\.?\s*s\b/i, /\bd\.?\s*c\.?\s*h\b/i, /\bm\.?\s*c\.?\s*h\b/i, /\bf\.?\s*r\.?\s*c\.?\s*s\b/i, /\bm\.?\s*r\.?\s*c\.?\s*p\b/i, /\bf\.?\s*i\.?\s*a\.?\s*c\.?\s*m\b/i, /\bf\.?\s*i\.?\s*m\.?\s*s\.?\s*a\b/i, /\bp\.?\s*h\.?\s*d\b/i];

        var titleNames = ['mr', 'mrs', 'miss', 'ms', 'master', 'er', 'dr', 'shri', 'shrimati', 'sir'];

        var titles = new RegExp('^(?:' + titleNames.join('|') + ')$', 'i');

        module.exports = {
            degrees: degrees,
            titles: titles
        };
    }, {}], 25: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        /* eslint no-underscore-dangle: "off" */
        var rgx = Object.create(null);
        // Remove repeating characters.
        rgx.repeatingChars = /([^c])\1/g;
        // Drop first character from character pairs, if found in the beginning.
        rgx.kngnPairs = /^(kn|gn|pn|ae|wr)/;
        // Drop vowels that are not found in the beginning.
        rgx.__vowels = /(?!^)[aeiou]/g;
        // Replaces `ough` in the end by 'f'
        rgx.ough = /ough$/;
        // Replace following 3 instances of `dg` by `j`.
        rgx.dge = /dge/g;
        rgx.dgi = /dgi/g;
        rgx.dgy = /dgy/g;
        // Replace `sch` by `sk`.
        rgx.sch = /sch/g;
        // Drop `c` in `sci, sce, scy`.
        rgx.sci = /sci/g;
        rgx.sce = /sce/g;
        rgx.scy = /scy/g;
        // Make 'sh' out of `tio & tia`.
        rgx.tio = /tio/g;
        rgx.tia = /tia/g;
        // `t` is silent in `tch`.
        rgx.tch = /tch/g;
        // Drop `b` in the end if preceeded by `m`.
        rgx.mb_ = /mb$/;
        // These are pronounced as `k`.
        rgx.cq = /cq/g;
        rgx.ck = /ck/g;
        // Here `c` sounds like `s`
        rgx.ce = /ce/g;
        rgx.ci = /ci/g;
        rgx.cy = /cy/g;
        // And this `f`.
        rgx.ph = /ph/g;
        // The `sh` finally replaced by `x`.
        rgx.sh = /sh|sio|sia/g;
        // This is open rgx - TODO: need to finalize.
        rgx.vrnotvy = /([aeiou])(r)([^aeiouy])/g;
        // `th` sounds like theta - make it 0.
        rgx.th = /th/g;
        // `c` sounds like `k` except when it is followed by `h`.
        rgx.cnoth = /(c)([^h])/g;
        // Even `q` sounds like `k`.
        rgx.q = /q/g;
        // The first `x` sounds like `s`.
        rgx._x = /^x/;
        // Otherwise `x` is more like `ks`.
        rgx.x = /x/g;
        // Drop `y` if not followed by a vowel or appears in the end.
        rgx.ynotv = /(y)([^aeiou])/g;
        rgx.y_ = /y$/;
        // `z` is `s`.
        rgx.z = /z/g;

        // Export rgx.
        module.exports = rgx;
    }, {}], 26: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### amplifyNotElision
        /**
         *
         * Amplifies the not elision by converting it into not; for example `isn't`
         * becomes `is not`.
         *
         * @name string.amplifyNotElision
         * @param {string} str — the input string.
         * @return {string} input string after not elision amplification.
         * @example
         * amplifyNotElision( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is not it?"
         */
        var amplifyNotElision = function (str) {
            return str.replace(rgx.notElision, '$1 not');
        }; // amplifyNotElision()

        module.exports = amplifyNotElision;
    }, { "./util_regexes.js": 60 }], 27: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bong
        /**
         *
         * Generates the bag of ngrams of `size` from the input string. The
         * default size is 2, which means it will generate bag of bigrams by default. It
         * also has an alias **`bong()`**.
         *
         * @name string.bagOfNGrams
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram size.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of ngram** of `str`; and it receives the ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {object} bag of ngrams of `size` from `str`.
         * @example
         * bagOfNGrams( 'mama' );
         * // -> { ma: 2, am: 1 }
         * bong( 'mamma' );
         * // -> { ma: 2, am: 1, mm: 1 }
         */
        var bong = function (str, size, ifn, idx) {
            var ng = size || 2,
                ngBOW = Object.create(null),
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) {
                    // Call `ifn` iff its defined and `tg` is appearing for the first time;
                    // this avoids multiple calls to `ifn`. Strategy applies to `song()`,
                    // and `bow()`.
                    if (typeof ifn === 'function' && !ngBOW[tg]) {
                        ifn(tg, idx);
                    }
                    // Now define, if required and then update counts.
                    ngBOW[tg] = 1 + (ngBOW[tg] || 0);
                }
            }
            return ngBOW;
        }; // bong()

        module.exports = bong;
    }, {}], 28: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var helpers = require('wink-helpers');
        var returnQuotedTextExtractor = require('./helper-return-quoted-text-extractor.js');
        var extractQuotedText = returnQuotedTextExtractor('[', ']');
        // ## string

        // ### composeCorpus
        /**
         *
         * Generates all possible sentences from the input argument string.
         * The string s must follow a special syntax as illustrated in the
         * example below:<br/>
         * `'[I] [am having|have] [a] [problem|question]'`<br/>
         *
         * Each phrase must be quoted between `[ ]` and each possible option of phrases
         * (if any) must be separated by a `|` character. The corpus is composed by
         * computing the cartesian product of all the phrases.
         *
         * @name string.composeCorpus
         * @param {string} str — the input string.
         * @return {string[]} of all possible sentences.
         * @example
         * composeCorpus( '[I] [am having|have] [a] [problem|question]' );
         * // -> [ 'I am having a problem',
         * //      'I am having a question',
         * //      'I have a problem',
         * //      'I have a question' ]
         */
        var composeCorpus = function (str) {
            if (!str || typeof str !== 'string') return [];

            var quotedTextElems = extractQuotedText(str);
            var corpus = [];
            var finalCorpus = [];

            if (!quotedTextElems) return [];
            quotedTextElems.forEach(function (e) {
                corpus.push(e.split('|'));
            });

            helpers.array.product(corpus).forEach(function (e) {
                finalCorpus.push(e.join(' '));
            });
            return finalCorpus;
        }; // composeCorpus()

        module.exports = composeCorpus;
    }, { "./helper-return-quoted-text-extractor.js": 22, "wink-helpers": 17 }], 29: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### edgeNGrams
        /**
         *
         * Generates the edge ngrams from the input string.
         *
         * @name string.edgeNGrams
         * @param {string} str — the input string.
         * @param {number} [min=2] — size of ngram generated.
         * @param {number} [max=8] — size of ngram is generated.
         * @param {number} [delta=2] — edge ngrams are generated in increments of this value.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every edge ngram of `str`; and it receives the edge ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {string[]} of edge ngrams.
         * @example
         * edgeNGrams( 'decisively' );
         * // -> [ 'de', 'deci', 'decisi', 'decisive' ]
         * edgeNGrams( 'decisively', 8, 10, 1 );
         * // -> [ 'decisive', 'decisivel', 'decisively' ]
         */
        var edgeNGrams = function (str, min, max, delta, ifn, idx) {
            var dlta = delta || 2,
                eg,
                egs = [],
                imax = Math.min(max || 8, str.length) + 1,
                start = min || 2;

            // Generate edge ngrams
            for (var i = start; i < imax; i += dlta) {
                eg = str.slice(0, i);
                egs.push(eg);
                if (typeof ifn === 'function') {
                    ifn(eg, idx);
                }
            }
            return egs;
        }; // edgeNGrams()

        module.exports = edgeNGrams;
    }, {}], 30: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');
        var ncrgx = require('./name_cleaner_regexes.js');

        // ## string

        // ### extractPersonsName
        /**
         *
         * Attempts to extract person's name from input string.
         * It assmues the following name format:<br/>
         * `[<salutations>] <name part as FN [MN] [LN]> [<degrees>]`<br/>
         * Entities in square brackets are optional.
         *
         * @name string.extractPersonsName
         * @param {string} str — the input string.
         * @return {string} extracted name.
         * @example
         * extractPersonsName( 'Dr. Sarah Connor M. Tech., PhD. - AI' );
         * // -> 'Sarah Connor'
         */
        var extractPersonsName = function (str) {
            // Remove Degrees by making the list of indexes of each degree and subsequently
            // finding the minimum and slicing from there!
            var indexes = ncrgx.degrees.map(function (r) {
                var m = r.exec(str);
                return m ? m.index : 999999;
            });
            var sp = Math.min.apply(null, indexes);

            // Generate an Array of Every Elelemnt of Name (e.g. title, first name,
            // sir name, honours, etc)
            var aeen = str.slice(0, sp).replace(rgx.notAlpha, ' ').replace(rgx.spaces, ' ').trim().split(' ');
            // Remove titles from the beginning.
            while (aeen.length && ncrgx.titles.test(aeen[0])) aeen.shift();
            return aeen.join(' ');
        }; // extractPersonsName()

        module.exports = extractPersonsName;
    }, { "./name_cleaner_regexes.js": 24, "./util_regexes.js": 60 }], 31: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');
        var trim = require('./string-trim.js');
        // ## string

        // ### extractRunOfCapitalWords
        /**
         *
         * Extracts the array of text appearing as Title Case or in ALL CAPS from the
         * input string.
         *
         * @name string.extractRunOfCapitalWords
         * @param {string} str — the input string.
         * @return {string[]} of text appearing in Title Case or in ALL CAPS; if no such
         * text is found then `null` is returned.
         * @example
         * extractRunOfCapitalWords( 'In The Terminator, Sarah Connor is in Los Angeles' );
         * // -> [ 'In The Terminator', 'Sarah Connor', 'Los Angeles' ]
         */
        var extractRunOfCapitalWords = function (str) {
            var m = str.match(rgx.rocWords);
            return m ? m.map(trim) : m;
        }; // extractRunOfCapitalWords()

        module.exports = extractRunOfCapitalWords;
    }, { "./string-trim.js": 49, "./util_regexes.js": 60 }], 32: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### lowerCase
        /**
         *
         * Converts the input string to lower case.
         *
         * @name string.lowerCase
         * @param {string} str — the input string.
         * @return {string} input string in lower case.
         * @example
         * lowerCase( 'Lower Case' );
         * // -> 'lower case'
         */
        var lowerCase = function (str) {
            return str.toLowerCase();
        }; // lowerCase()

        module.exports = lowerCase;
    }, {}], 33: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### marker
        /**
         *
         * Generates `marker` of the input string; it is defined as 1-gram, sorted
         * and joined back as a string again. Marker is a quick and aggressive way
         * to detect similarity between short strings. Its aggression may lead to more
         * false positives such as `Meter` and `Metre` or `no melon` and `no lemon`.
         *
         * @name string.marker
         * @param {string} str — the input string.
         * @return {string} the marker.
         * @example
         * marker( 'the quick brown fox jumps over the lazy dog' );
         * // -> ' abcdefghijklmnopqrstuvwxyz'
         */
        var marker = function (str) {
            var uniqChars = Object.create(null);
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                uniqChars[str[i]] = true;
            }
            return Object.keys(uniqChars).sort().join('');
        }; // marker()

        module.exports = marker;
    }, {}], 34: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### ngram
        /**
         *
         * Generates an array of ngrams of a specified size from the input string. The
         * default size is 2, which means it will generate bigrams by default.
         *
         * @name string.ngram
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram's size.
         * @return {string[]} ngrams of `size` from `str`.
         * @example
         * ngram( 'FRANCE' );
         * // -> [ 'FR', 'RA', 'AN', 'NC', 'CE' ]
         * ngram( 'FRENCH' );
         * // -> [ 'FR', 'RE', 'EN', 'NC', 'CH' ]
         * ngram( 'FRANCE', 3 );
         * // -> [ 'FRA', 'RAN', 'ANC', 'NCE' ]
         */
        var ngram = function (str, size) {
            var ng = size || 2,
                ngramz = [],
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) ngramz.push(tg);
            }
            return ngramz;
        }; // ngram()

        module.exports = ngram;
    }, {}], 35: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var phnrgx = require('./phonetize_regexes.js');
        /* eslint no-underscore-dangle: "off" */

        // ## string

        // ### phonetize
        /**
         *
         * Phonetizes the input string using an algorithmic adaptation of Metaphone; It
         * is not an exact implementation of Metaphone.
         *
         * @name string.phonetize
         * @param {string} word — the input word.
         * @return {string} phonetic code of `word`.
         * @example
         * phonetize( 'perspective' );
         * // -> 'prspktv'
         * phonetize( 'phenomenon' );
         * // -> 'fnmnn'
         */
        var phonetize = function (word) {
            var p = word.toLowerCase();
            // Remove repeating letters.
            p = p.replace(phnrgx.repeatingChars, '$1');
            // Drop first character of `kgknPairs`.
            if (phnrgx.kngnPairs.test(p)) {
                p = p.substr(1, p.length - 1);
            }
            // Run Regex Express now!
            p = p
            // Change `ough` in the end as `f`,
            .replace(phnrgx.ough, 'f')
            // Change `dg` to `j`, in `dge, dgi, dgy`.
            .replace(phnrgx.dge, 'je').replace(phnrgx.dgi, 'ji').replace(phnrgx.dgy, 'jy')
            // Change `c` to `k` in `sch`
            .replace(phnrgx.sch, 'sk')
            // Drop `c` in `sci, sce, scy`.
            .replace(phnrgx.sci, 'si').replace(phnrgx.sce, 'se').replace(phnrgx.scy, 'sy')
            // Drop `t` if it appears as `tch`.
            .replace(phnrgx.tch, 'ch')
            // Replace `tio & tia` by `sh`.
            .replace(phnrgx.tio, 'sh').replace(phnrgx.tia, 'sh')
            // Drop `b` if it appears as `mb` in the end.
            .replace(phnrgx.mb_, 'm')
            // Drop `r` if it preceeds a vowel and not followed by a vowel or `y`
            // .replace( rgx.vrnotvy, '$1$3' )
            // Replace `c` by `s` in `ce, ci, cy`.
            .replace(phnrgx.ce, 'se').replace(phnrgx.ci, 'si').replace(phnrgx.cy, 'sy')
            // Replace `cq` by `q`.
            .replace(phnrgx.cq, 'q')
            // Replace `ck` by `k`.
            .replace(phnrgx.ck, 'k')
            // Replace `ph` by `f`.
            .replace(phnrgx.ph, 'f')
            // Replace `th` by `0` (theta look alike!).
            .replace(phnrgx.th, '0')
            // Replace `c` by `k` if it is not followed by `h`.
            .replace(phnrgx.cnoth, 'k$2')
            // Replace `q` by `k`.
            .replace(phnrgx.q, 'k')
            // Replace `x` by `s` if it appears in the beginning.
            .replace(phnrgx._x, 's')
            // Other wise replace `x` by `ks`.
            .replace(phnrgx.x, 'ks')
            // Replace `sh, sia, sio` by `x`. Needs to be done post `x` processing!
            .replace(phnrgx.sh, 'x')
            // Drop `y` if it is now followed by a **vowel**.
            .replace(phnrgx.ynotv, '$2').replace(phnrgx.y_, '')
            // Replace `z` by `s`.
            .replace(phnrgx.z, 's')
            // Drop all **vowels** excluding the first one.
            .replace(phnrgx.__vowels, '');

            return p;
        }; // phonetize()

        module.exports = phonetize;
    }, { "./phonetize_regexes.js": 25 }], 36: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeElisions
        /**
         *
         * Removes basic elisions found in the input string. Typical example of elisions
         * are `it's, let's, where's, I'd, I'm, I'll, I've, and Isn't` etc. Note it retains
         * apostrophe used to indicate possession.
         *
         * @name string.removeElisions
         * @param {string} str — the input string.
         * @return {string} input string after removal of elisions.
         * @example
         * removeElisions( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is it?"
         */
        var removeElisions = function (str) {
            return str.replace(rgx.elisionsSpl, '$2').replace(rgx.elisions1, '$1').replace(rgx.elisions2, '$1');
        }; // removeElisions()

        module.exports = removeElisions;
    }, { "./util_regexes.js": 60 }], 37: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeExtraSpaces
        /**
         *
         * Removes leading, trailing and any extra in-between whitespaces from the input
         * string.
         *
         * @name string.removeExtraSpaces
         * @param {string} str — the input string.
         * @return {string} input string after removal of leading, trailing and extra
         * whitespaces.
         * @example
         * removeExtraSpaces( '   Padded   Text    ' );
         * // -> 'Padded Text'
         */
        var removeExtraSpaces = function (str) {
            return str.trim().replace(rgx.spaces, ' ');
        }; // removeExtraSpaces()

        module.exports = removeExtraSpaces;
    }, { "./util_regexes.js": 60 }], 38: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeHTMLTags
        /**
         *
         * Removes each HTML tag by replacing it with a whitespace.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removeHTMLTags
         * @param {string} str — the input string.
         * @return {string} input string after removal of HTML tags.
         * @example
         * removeHTMLTags( '<p>Vive la France&nbsp;&#160;!</p>' );
         * // -> ' Vive la France  ! '
         */
        var removeHTMLTags = function (str) {
            return str.replace(rgx.htmlTags, ' ').replace(rgx.htmlEscSeq1, ' ').replace(rgx.htmlEscSeq2, ' ');
        }; // removeHTMLTags()

        module.exports = removeHTMLTags;
    }, { "./util_regexes.js": 60 }], 39: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removePunctuations
        /**
         *
         * Removes each punctuation mark by replacing it with a whitespace. It looks for
         * the following punctuations — `.,;!?:"!'... - () [] {}`.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removePunctuations
         * @param {string} str — the input string.
         * @return {string} input string after removal of punctuations.
         * @example
         * removePunctuations( 'Punctuations like "\'\',;!?:"!... are removed' );
         * // -> 'Punctuations like               are removed'
         */
        var removePunctuations = function (str) {
            return str.replace(rgx.punctuations, ' ');
        }; // removePunctuations()

        module.exports = removePunctuations;
    }, { "./util_regexes.js": 60 }], 40: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### removeSplChars
        /**
         *
         * Removes each special character by replacing it with a whitespace. It looks for
         * the following special characters — `~@#%^*+=`.
         *
         * Extra spaces, if required, may be removed using [string.removeExtraSpaces](#stringremoveextraspaces)
         * function.
         *
         * @name string.removeSplChars
         * @param {string} str — the input string.
         * @return {string} input string after removal of special characters.
         * @example
         * removeSplChars( '4 + 4*2 = 12' );
         * // -> '4   4 2   12'
         */
        var removeSplChars = function (str) {
            return str.replace(rgx.splChars, ' ');
        }; // removeSplChars()

        module.exports = removeSplChars;
    }, { "./util_regexes.js": 60 }], 41: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### retainAlphaNums
        /**
         *
         * Retains only apha, numerals, and removes all other characters from
         * the input string, including leading, trailing and extra in-between
         * whitespaces.
         *
         * @name string.retainAlphaNums
         * @param {string} str — the input string.
         * @return {string} input string after removal of non-alphanumeric characters,
         * leading, trailing and extra whitespaces.
         * @example
         * retainAlphaNums( ' This, text here, has  (other) chars_! ' );
         * // -> 'This text here has other chars'
         */
        var retainAlphaNums = function (str) {
            return str.replace(rgx.notAlphaNumeric, ' ').replace(rgx.spaces, ' ').trim();
        }; // retainAlphaNums()

        module.exports = retainAlphaNums;
    }, { "./util_regexes.js": 60 }], 42: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        // Abbreviations with `.` but are never are EOS.
        const abbrvNoEOS = Object.create(null);
        abbrvNoEOS['mr.'] = true;
        abbrvNoEOS['mrs.'] = true;
        abbrvNoEOS['ms.'] = true;
        abbrvNoEOS['er.'] = true;
        abbrvNoEOS['dr.'] = true;
        abbrvNoEOS['miss.'] = true;
        abbrvNoEOS['shri.'] = true;
        abbrvNoEOS['smt.'] = true;
        abbrvNoEOS['i.e.'] = true;
        abbrvNoEOS['ie.'] = true;
        abbrvNoEOS['e.g.'] = true;
        abbrvNoEOS['eg.'] = true;
        abbrvNoEOS['viz.'] = true;
        abbrvNoEOS['pvt.'] = true;
        // et al.
        abbrvNoEOS['et.'] = true;
        abbrvNoEOS['al.'] = true;
        // Mount Kailash!
        abbrvNoEOS['mt.'] = true;
        // Pages!
        abbrvNoEOS['pp.'] = true;

        const abbrvMayBeEOS = Object.create(null);
        abbrvMayBeEOS['inc.'] = true;
        abbrvMayBeEOS['ltd.'] = true;
        abbrvMayBeEOS['al.'] = true;
        // Regex to test potential End-Of-Sentence.
        const rgxPotentialEOS = /\.$|\!$|\?$/;
        // Regex to test special cases of "I" at eos.
        const rgxSplI = /i\?$|i\!$/;
        // Regex to test first char as alpha only
        const rgxAlphaAt0 = /^[^a-z]/i;

        // ## string

        // ### sentences
        /**
         *
         * Detects the sentence boundaries in the input `paragraph` and splits it into
         * an array of sentence(s).
         *
         * @name string.sentences
         * @param {string} paragraph — the input string.
         * @return {string[]} of sentences.
         * @example
         * sentences( 'AI Inc. is focussing on AI. I work for AI Inc. My mail is r2d2@yahoo.com' );
         * // -> [ 'AI Inc. is focussing on AI.',
         * //      'I work for AI Inc.',
         * //      'My mail is r2d2@yahoo.com' ]
         *
         * sentences( 'U.S.A is my birth place. I was born on 06.12.1924. I climbed Mt. Everest.' );
         * // -> [ 'U.S.A is my birth place.',
         * //      'I was born on 06.12.1924.',
         * //      'I climbed Mt. Everest.' ]
         */
        var punkt = function (paragraph) {
            // The basic idea is to split the paragraph on `spaces` and thereafter
            // examine each word ending with an EOS punctuation for a possible EOS.

            // Split on **space** to obtain all the `tokens` in the `para`.
            const paraTokens = paragraph.split(' ');
            var sentenceTokens = [];
            var sentences = [];

            for (let k = 0; k < paraTokens.length; k += 1) {
                // A para token.
                const pt = paraTokens[k];
                // A lower cased para token.
                const lcpt = pt.toLowerCase();
                if (rgxPotentialEOS.test(pt) && !abbrvNoEOS[lcpt] && (pt.length !== 2 || rgxAlphaAt0.test(pt) || rgxSplI.test(lcpt))) {
                    // Next para token that is non-blank.
                    let nextpt;
                    // Append this token to the current sentence tokens.
                    sentenceTokens.push(pt);
                    // If the current token is one of the abbreviations that may also mean EOS.
                    if (abbrvMayBeEOS[lcpt]) {
                        for (let j = k + 1; j < paraTokens.length && !nextpt; j += 1) {
                            nextpt = paraTokens[j];
                        }
                    }
                    // If no next para token or if present then starts from a Cap Letter then
                    // only complete sentence and start a new one!
                    if (nextpt === undefined || /^[A-Z]/.test(nextpt)) {
                        sentences.push(sentenceTokens.join(' '));
                        sentenceTokens = [];
                    }
                } else sentenceTokens.push(pt);
            }

            if (sentenceTokens.length > 0) sentences.push(sentenceTokens.join(' '));

            return sentences;
        }; // punkt()

        module.exports = punkt;
    }, {}], 43: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### soc
        /**
         *
         * Creates a set of chars from the input string `s`. This is useful
         * in even more aggressive string matching using Jaccard or Tversky compared to
         * `marker()`. It also has an alias **`soc()`**.
         *
         * @name string.setOfChars
         * @param {string} str — the input string.
         * @param {function} [ifn=undefined] — a function to build index; it receives the first
         * character of `str` and the `idx` as input arguments. The `build()` function of
         * [helper.returnIndexer](#helperreturnindexer) may be used as `ifn`. If `undefined`
         * then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {string} the soc.
         * @example
         * setOfChars( 'the quick brown fox jumps over the lazy dog' );
         * // -> ' abcdefghijklmnopqrstuvwxyz'
         */
        var soc = function (str, ifn, idx) {
            var cset = new Set(str);
            if (typeof ifn === 'function') {
                ifn(str[0], idx);
            }
            return cset;
        }; // soc()

        module.exports = soc;
    }, {}], 44: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### song
        /**
         *
         * Generates the set of ngrams of `size` from the input string. The
         * default size is 2, which means it will generate set of bigrams by default.
         * It also has an alias **`song()`**.
         *
         * @name string.setOfNGrams
         * @param {string} str — the input string.
         * @param {number} [size=2] — ngram size.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of ngram** of `str`; and it receives the ngram and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {set} of ngrams of `size` of `str`.
         * @example
         * setOfNGrams( 'mama' );
         * // -> Set { 'ma', 'am' }
         * song( 'mamma' );
         * // -> Set { 'ma', 'am', 'mm' }
         */
        var song = function (str, size, ifn, idx) {
            var ng = size || 2,
                ngSet = new Set(),
                tg;
            for (var i = 0, imax = str.length; i < imax; i += 1) {
                tg = str.slice(i, i + ng);
                if (tg.length === ng) {
                    if (typeof ifn === 'function' && !ngSet.has(tg)) {
                        ifn(tg, idx);
                    }
                    ngSet.add(tg);
                }
            }
            return ngSet;
        }; // song()

        module.exports = song;
    }, {}], 45: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        // Soundex Code for alphabets.
        /* eslint-disable object-property-newline */
        var soundexMap = {
            A: 0, E: 0, I: 0, O: 0, U: 0, Y: 0,
            B: 1, F: 1, P: 1, V: 1,
            C: 2, G: 2, J: 2, K: 2, Q: 2, S: 2, X: 2, Z: 2,
            D: 3, T: 3,
            L: 4,
            M: 5, N: 5,
            R: 6
        };

        // ## string

        // ### soundex
        /**
         *
         * Produces the soundex code from the input `word`.
         *
         * @name string.soundex
         * @param {string} word — the input word.
         * @param {number} [maxLength=4] — of soundex code to be returned.
         * @return {string} soundex code of `word`.
         * @example
         * soundex( 'Burroughs' );
         * // -> 'B620'
         * soundex( 'Burrows' );
         * // -> 'B620'
         */
        var soundex = function (word, maxLength) {
            // Upper case right in the begining.
            var s = word.length ? word.toUpperCase() : '?';
            var i,
                imax = s.length;
            // Soundex code builds here.
            var sound = [];
            // Helpers - `ch` is a char from `s` and `code/prevCode` are sondex codes
            // for consonants.
            var ch,
                code,
                prevCode = 9;
            // Use default of 4.
            var maxLen = maxLength || 4;
            // Iterate through every character.
            for (i = 0; i < imax; i += 1) {
                ch = s[i];
                code = soundexMap[ch];
                if (i) {
                    // Means i is > 0.
                    // `code` is either (a) `undefined` if an unknown character is
                    // encountered including `h & w`, or (b) `0` if it is vowel, or
                    // (c) the soundex code for a consonant.
                    if (code && code !== prevCode) {
                        // Consonant and not adjecant duplicates!
                        sound.push(code);
                    } else if (code !== 0) {
                        // Means `h or w` or an unknown character: ensure `prevCode` is
                        // remembered so that adjecant duplicates can be handled!
                        code = prevCode;
                    }
                } else {
                    // Retain the first letter
                    sound.push(ch);
                }
                prevCode = code;
            }
            s = sound.join('');
            // Always ensure minimum length of 4 characters for maxLength > 4.
            if (s.length < 4) s += '000';
            // Return the required length.
            return s.substr(0, maxLen);
        }; // soundex()

        module.exports = soundex;
    }, {}], 46: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### splitElisions
        /**
         *
         * Splits basic elisions found in the input string. Typical example of elisions
         * are `it's, let's, where's, I'd, I'm, I'll, I've, and Isn't` etc. Note it does
         * not touch apostrophe used to indicate possession.
         *
         * @name string.splitElisions
         * @param {string} str — the input string.
         * @return {string} input string after splitting of elisions.
         * @example
         * splitElisions( "someone's wallet, isn't it?" );
         * // -> "someone's wallet, is n't it?"
         */
        var splitElisions = function (str) {
            return str.replace(rgx.elisionsSpl, '$2 $3').replace(rgx.elisions1, '$1 $2').replace(rgx.elisions2, '$1 $2');
        }; // splitElisions()

        module.exports = splitElisions;
    }, { "./util_regexes.js": 60 }], 47: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var winkTokenize = require('wink-tokenizer')().tokenize;

        // ## string

        // ### tokenize
        /**
         *
         * Tokenizes the input `sentence` according to the value of `detailed` flag.
         * Any occurance of `...` in the `sentence` is
         * converted to ellipses. In `detailed = true` mode, it
         * tags every token with its type; the supported tags are currency, email,
         * emoji, emoticon, hashtag, number, ordinal, punctuation, quoted_phrase, symbol,
         * time, mention, url, and word.
         *
         * @name string.tokenize
         * @param {string} sentence — the input string.
         * @param {boolean} [detailed=false] — if true, each token is a object cotaining
         * `value` and `tag` of each token; otherwise each token is a string. It's default
         * value of **false** ensures compatibility with previous version.
         * @return {(string[]|object[])} an array of strings if `detailed` is false otherwise
         * an array of objects.
         * @example
         * tokenize( "someone's wallet, isn't it? I'll return!" );
         * // -> [ 'someone', '\'s', 'wallet', ',', 'is', 'n\'t', 'it', '?',
         * //      'I', '\'ll', 'return', '!' ]
         *
         * tokenize( 'For details on wink, check out http://winkjs.org/ URL!', true );
         * // -> [ { value: 'For', tag: 'word' },
         * //      { value: 'details', tag: 'word' },
         * //      { value: 'on', tag: 'word' },
         * //      { value: 'wink', tag: 'word' },
         * //      { value: ',', tag: 'punctuation' },
         * //      { value: 'check', tag: 'word' },
         * //      { value: 'out', tag: 'word' },
         * //      { value: 'http://winkjs.org/', tag: 'url' },
         * //      { value: 'URL', tag: 'word' },
         * //      { value: '!', tag: 'punctuation' } ]
         */
        var tokenize = function (sentence, detailed) {
            var tokens = winkTokenize(sentence.replace('...', '…'));
            var i;
            if (!detailed) {
                for (i = 0; i < tokens.length; i += 1) tokens[i] = tokens[i].value;
            }

            return tokens;
        }; // tokenize()

        module.exports = tokenize;
    }, { "wink-tokenizer": 19 }], 48: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var removeElisions = require('./string-remove-elisions.js');
        var amplifyNotElision = require('./string-amplify-not-elision.js');
        var rgx = require('./util_regexes.js');

        // ## string

        // ### tokenize0
        /**
         *
         * Tokenizes by splitting the input string on **non-words**. This means tokens would
         * consists of only alphas, numerals and underscores; all other characters will
         * be stripped as they are treated as separators. It also removes all elisions;
         * however negations are retained and amplified.
         *
         * @name string.tokenize0
         * @param {string} str — the input string.
         * @return {string[]} of tokens.
         * @example
         * tokenize0( "someone's wallet, isn't it?" );
         * // -> [ 'someone', 's', 'wallet', 'is', 'not', 'it' ]
         */
        var tokenize0 = function (str) {
            var tokens = removeElisions(amplifyNotElision(str)).replace(rgx.cannot, '$1 $2').split(rgx.nonWords);
            // Check the 0th and last element of array for empty string because if
            // fisrt/last characters are non-words then these will be empty stings!
            if (tokens[0] === '') tokens.shift();
            if (tokens[tokens.length - 1] === '') tokens.pop();
            return tokens;
        }; // tokenize0()

        module.exports = tokenize0;
    }, { "./string-amplify-not-elision.js": 26, "./string-remove-elisions.js": 36, "./util_regexes.js": 60 }], 49: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### trim
        /**
         *
         * Trims leading and trailing whitespaces from the input string.
         *
         * @name string.trim
         * @param {string} str — the input string.
         * @return {string} input string with leading & trailing whitespaces removed.
         * @example
         * trim( '  Padded   ' );
         * // -> 'Padded'
         */
        var trim = function (str) {
            return str.trim();
        }; // trim()

        module.exports = trim;
    }, {}], 50: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### upperCase
        /**
         *
         * Converts the input string to upper case.
         *
         * @name string.upperCase
         * @param {string} str — the input string.
         * @return {string} input string in upper case.
         * @example
         * upperCase( 'Upper Case' );
         * // -> 'UPPER CASE'
         */
        var upperCase = function (str) {
            return str.toUpperCase();
        }; // upperCase()

        module.exports = upperCase;
    }, {}], 51: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE SyappendBigramss Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## tokens

        // ### appendBigrams
        /**
         *
         * Generates bigrams from the input tokens and appends them to the input tokens.
         *
         * @name tokens.appendBigrams
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} the input tokens appended with their bigrams.
         * @example
         * appendBigrams( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'he',
         * //      'acted',
         * //      'decisively',
         * //      'today',
         * //      'he_acted',
         * //      'acted_decisively',
         * //      'decisively_today' ]
         */
        var appendBigrams = function (tokens) {
            var i, imax;
            for (i = 0, imax = tokens.length - 1; i < imax; i += 1) {
                tokens.push(tokens[i] + '_' + tokens[i + 1]);
            }
            return tokens;
        }; // appendBigrams()

        module.exports = appendBigrams;
    }, {}], 52: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Sybigramss Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## tokens

        // ### bigrams
        /**
         *
         * Generates bigrams from the input tokens.
         *
         * @name tokens.bigrams
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} the bigrams.
         * @example
         * bigrams( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ [ 'he', 'acted' ],
         * //      [ 'acted', 'decisively' ],
         * //      [ 'decisively', 'today' ] ]
         */
        var bigrams = function (tokens) {
            // Bigrams will be stored here.
            var bgs = [];
            // Helper variables.
            var i, imax;
            // Create bigrams.
            for (i = 0, imax = tokens.length - 1; i < imax; i += 1) {
                bgs.push([tokens[i], tokens[i + 1]]);
            }
            return bgs;
        }; // bigrams()

        module.exports = bigrams;
    }, {}], 53: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bow
        /**
         *
         * Generates the bag of words from the input string. By default it
         * uses `word count` as it's frequency; but if `logCounts` parameter is set to true then
         * it will use `log2( word counts + 1 )` as it's frequency. It also has an alias **`bow()`**.
         *
         * @name tokens.bagOfWords
         * @param {string[]} tokens — the input tokens.
         * @param {number} [logCounts=false] — a true value flags the use of `log2( word count + 1 )`
         * instead of just `word count` as frequency.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **unique occurrence of word** in `tokens`; and it receives the word and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {object} bag of words from tokens.
         * @example
         * bagOfWords( [ 'rain', 'rain', 'go', 'away' ] );
         * // -> { rain: 2, go: 1, away: 1 }
         * bow( [ 'rain', 'rain', 'go', 'away' ], true );
         * // -> { rain: 1.584962500721156, go: 1, away: 1 }
         */
        var bow = function (tokens, logCounts, ifn, idx) {
            var bow1 = Object.create(null),
                i,
                imax,
                token,
                words;
            for (i = 0, imax = tokens.length; i < imax; i += 1) {
                token = tokens[i];
                if (typeof ifn === 'function' && !bow1[token]) {
                    ifn(token, idx);
                }
                bow1[token] = 1 + (bow1[token] || 0);
            }
            if (!logCounts) return bow1;
            words = Object.keys(bow1);
            for (i = 0, imax = words.length; i < imax; i += 1) {
                // Add `1` to ensure non-zero count! (Note: log2(1) is 0)
                bow1[words[i]] = Math.log2(bow1[words[i]] + 1);
            }
            return bow1;
        }; // bow()

        module.exports = bow;
    }, {}], 54: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var stringPhonetize = require('./string-phonetize.js');

        // ## tokens

        // ### phonetize
        /**
         *
         * Phonetizes input tokens using using an algorithmic adaptation of Metaphone.
         *
         * @name tokens.phonetize
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} phonetized tokens.
         * @example
         * phonetize( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'h', 'aktd', 'dssvl', 'td' ]
         */
        var phonetize = function (tokens) {
            return tokens.map(stringPhonetize);
        }; // phonetize()

        module.exports = phonetize;
    }, { "./string-phonetize.js": 35 }], 55: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = require('./util_regexes.js');

        // ## string

        // ### propagateNegations
        /**
         *
         * It looks for negation tokens in the input array of tokens and propagates
         * negation to subsequent `upto` tokens by prefixing them by a `!`. It is useful
         * in handling text containing negations during tasks like similarity detection,
         * classification or search.
         *
         * @name tokens.propagateNegations
         * @param {string[]} tokens — the input tokens.
         * @param {number} [upto=2] — number of tokens to be negated after the negation
         * token. Note, tokens are only negated either `upto` tokens or up to the token
         * preceeding the **`, . ; : ! ?`** punctuations.
         * @return {string[]} tokens with negation propagated.
         * @example
         * propagateNegations( [ 'mary', 'is', 'not', 'feeling', 'good', 'today' ] );
         * // -> [ 'mary', 'is', 'not', '!feeling', '!good', 'today' ]
         */
        var propagateNegations = function (tokens, upto) {
            var i, imax, j, jmax;
            var tkns = tokens;
            var limit = upto || 2;
            for (i = 0, imax = tkns.length; i < imax; i += 1) {
                if (rgx.negations.test(tkns[i])) {
                    for (j = i + 1, jmax = Math.min(imax, i + limit + 1); j < jmax; j += 1) {
                        // Hit a punctuation mark, break out of the loop otherwise go *upto the limit*.
                        // > TODO: promote to utilities regex, after test cases have been added.
                        if (/[\,\.\;\:\!\?]/.test(tkns[j])) break;
                        // Propoage negation: invert the token by prefixing a `!` to it.
                        tkns[j] = '!' + tkns[j];
                    }
                    i = j;
                }
            }
            return tkns;
        }; // propagateNegations()

        module.exports = propagateNegations;
    }, { "./util_regexes.js": 60 }], 56: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        var defaultStopWords = require('./dictionaries/stop_words.json');
        var words = require('./helper-return-words-filter.js');
        defaultStopWords = words(defaultStopWords);

        // ## tokens

        // ### removeWords
        /**
         *
         * Removes the stop words from the input array of tokens.
         *
         * @name tokens.removeWords
         * @param {string[]} tokens — the input tokens.
         * @param {wordsFilter} [stopWords=defaultStopWords] — default stop words are
         * loaded from `stop_words.json` located under the `src/dictionaries/` directory.
         * Custom stop words can be created using [helper.returnWordsFilter ](#helperreturnwordsfilter).
         * @return {string[]} balance tokens.
         * @example
         * removeWords( [ 'this', 'is', 'a', 'cat' ] );
         * // -> [ 'cat' ]
         */
        var removeWords = function (tokens, stopWords) {
            var givenStopWords = stopWords || defaultStopWords;
            return tokens.filter(givenStopWords.exclude);
        }; // removeWords()

        module.exports = removeWords;
    }, { "./dictionaries/stop_words.json": 20, "./helper-return-words-filter.js": 23 }], 57: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Syphonetizes Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var stringSoundex = require('./string-soundex.js');

        // ## tokens

        // ### soundex
        /**
         *
         * Generates the soundex coded tokens from the input tokens.
         *
         * @name tokens.soundex
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} soundex coded tokens.
         * @example
         * soundex( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'H000', 'A233', 'D221', 'T300' ]
         */
        var soundex = function (tokens) {
            // Need to send `maxLength` as `undefined`.
            return tokens.map(t => stringSoundex(t));
        }; // soundex()

        module.exports = soundex;
    }, { "./string-soundex.js": 45 }], 58: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //

        // ## string

        // ### bow
        /**
         *
         * Generates the set of words from the input string. It also has an alias **`setOfWords()`**.
         *
         * @name tokens.setOfWords
         * @param {string[]} tokens — the input tokens.
         * @param {function} [ifn=undefined] — a function to build index; it is called for
         * every **member word of the set **; and it receives the word and the `idx`
         * as input arguments. The `build()` function of [helper.returnIndexer](#helperreturnindexer)
         * may be used as `ifn`. If `undefined` then index is not built.
         * @param {number} [idx=undefined] — the index; passed as the second argument to the `ifn`
         * function.
         * @return {set} of words from tokens.
         * @example
         * setOfWords( [ 'rain', 'rain', 'go', 'away' ] );
         * // -> Set { 'rain', 'go', 'away' }
         */
        var sow = function (tokens, ifn, idx) {
            var tset = new Set(tokens);
            if (typeof ifn === 'function') {
                tset.forEach(function (m) {
                    ifn(m, idx);
                });
            }
            return tset;
        }; // bow()

        module.exports = sow;
    }, {}], 59: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var porter2Stemmer = require('wink-porter2-stemmer');

        // ## tokens

        // ### stem
        /**
         *
         * Stems input tokens using Porter Stemming Algorithm Version 2.
         *
         * @name tokens.stem
         * @param {string[]} tokens — the input tokens.
         * @return {string[]} stemmed tokens.
         * @example
         * stem( [ 'he', 'acted', 'decisively', 'today' ] );
         * // -> [ 'he', 'act', 'decis', 'today' ]
         */
        var stem = function (tokens) {
            return tokens.map(porter2Stemmer);
        }; // stem()

        module.exports = stem;
    }, { "wink-porter2-stemmer": 62 }], 60: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var rgx = Object.create(null);

        // Matches standard english punctuations in a text.
        rgx.punctuations = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\,\.\!\;\?\/\-\:]/ig;
        // End Of Sentence Punctuations - useful for splitting text into sentences.
        rgx.eosPunctuations = /([\.\?\!])\s*(?=[a-z]|\s+\d)/gi;

        // Matches special characters: `* + % # @ ^ = ~ | \` in a text.
        rgx.splChars = /[\*\+\%\#\@\^\=\~\|\\]/ig;

        // Matches common english elisions including n't.
        // These are special ones as 's otherwise may be apostrophe!
        rgx.elisionsSpl = /(\b)(it|let|that|who|what|here|there|when|where|why|how)(\'s)\b/gi;
        // Single (1) character elisions.
        rgx.elisions1 = /([a-z])(\'d|\'m)\b/gi;
        // Two (2) character elisions.
        rgx.elisions2 = /([a-z])(\'ll|\'ve|\'re|n\'t)\b/gi;
        // Sperate not elision 'nt.
        rgx.notElision = /([a-z])(n\'t)\b/gi;
        // Specially handle cannot
        rgx.cannot = /\b(can)(not)\b/gi;

        // Matches space, tab, or new line characters in text.
        rgx.spaces = /\s+/ig;
        // Matches anything other than space, tab, or new line characters.
        rgx.notSpace = /\S/g;
        // Matches alpha and space characters in a text.
        rgx.alphaSpace = /[a-z\s]/ig;
        // Matches alphanumerals and space characters in a text.
        rgx.alphaNumericSpace = /[a-z0-9\s]/ig;
        // Matches non alpha characters in a text.
        rgx.notAlpha = /[^a-z]/ig;
        // Matches non alphanumerals in a text.
        rgx.notAlphaNumeric = /[^a-z0-9]/ig;
        // Matches one or more non-words characters.
        rgx.nonWords = /\W+/ig;
        // Matches complete negation token
        rgx.negations = /^(never|none|not|no)$/ig;

        // Matches run of capital words in a text.
        rgx.rocWords = /(?:\b[A-Z][A-Za-z]*\s*){2,}/g;

        // Matches integer, decimal, JS floating point numbers in a text.
        rgx.number = /[0-9]*\.[0-9]+e[\+\-]{1}[0-9]+|[0-9]*\.[0-9]+|[0-9]+/ig;

        // Matches time in 12 hour am/pm format in a text.
        rgx.timeIn12HrAMPM = /(?:[0-9]|0[0-9]|1[0-2])((:?:[0-5][0-9])){0,1}\s?(?:[aApP][mM])/ig;

        // Matches HTML tags - in fact any thing enclosed in angular brackets including
        // the brackets.
        rgx.htmlTags = /(?:<[^>]*>)/g;
        // Matches the HTML Esc Sequences
        // Esc Seq of type `&lt;` or `&nbsp;`
        rgx.htmlEscSeq1 = /(?:&[a-z]{2,6};)/gi;
        // Esc Seq of type `&#32;`
        rgx.htmlEscSeq2 = /(?:&#[0-9]{2,4};)/gi;

        // Tests if a given string is possibly in the Indian mobile telephone number format.
        rgx.mobileIndian = /^(0|\+91)?[789]\d{9}$/;
        // Tests if a given string is in the valid email format.
        rgx.email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // Extracts any number and text from a <number><text> format text.
        // Useful in extracting value and UoM from strings like `2.7 Kgs`.
        rgx.separateNumAndText = /([0-9]*\.[0-9]+e[\+\-]{1}[0-9]+|[0-9]*\.[0-9]+|[0-9]+)[\s]*(.*)/i;

        // Crude date parser for a string containg date in a valid format.
        // > TODO: Need to improve this one!
        rgx.date = /(\d+)/ig;

        // Following 3 regexes are specially coded for `tokenize()` in prepare_text.
        // Matches punctuations that are not a part of a number.
        rgx.nonNumPunctuations = /[\.\,\-](?=\D)/gi;
        rgx.otherPunctuations = /[\’\'\‘\’\`\“\”\"\[\]\(\)\{\}\…\!\;\?\/\:]/ig;
        // > TODO: Add more currency symbols here.
        rgx.currency = /[\$\£\¥\€]/ig;

        //
        module.exports = rgx;
    }, {}], 61: [function (require, module, exports) {
        //     wink-nlp-utils
        //     NLP Functions for amplifying negations, managing elisions,
        //     creating ngrams, stems, phonetic codes to tokens and more.
        //
        //     Copyright (C) 2017-18  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-nlp-utils”.
        //
        //     “wink-nlp-utils” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-nlp-utils” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-nlp-utils”.
        //     If not, see <http://www.gnu.org/licenses/>.

        //
        var porter2Stemmer = require('wink-porter2-stemmer');

        // ### Prepare Name Space

        // Create prepare name space.
        var prepare = Object.create(null);

        // ### Prepare.Helper name space

        // Create prepare.helper name space.
        prepare.helper = Object.create(null);

        // Words
        prepare.helper.words = require('./helper-return-words-filter.js');
        // Make better **alias** name for the `word()` function.
        prepare.helper.returnWordsFilter = prepare.helper.words;
        // Index
        prepare.helper.index = require('./helper-return-indexer.js');
        // Make better **alias** name for the `index()` function.
        prepare.helper.returnIndexer = prepare.helper.index;

        // Return Quoted Text Extractor
        prepare.helper.returnQuotedTextExtractor = require('./helper-return-quoted-text-extractor.js');

        // ### Prepare.String Name Space

        // Create prepare.string name space.
        prepare.string = Object.create(null);

        // Lower Case
        prepare.string.lowerCase = require('./string-lower-case.js');
        // Upper Case
        prepare.string.upperCase = require('./string-upper-case.js');
        // Trim
        prepare.string.trim = require('./string-trim.js');
        // Remove Extra Spaces
        prepare.string.removeExtraSpaces = require('./string-remove-extra-spaces.js');
        // Retain Alpha-numerics
        prepare.string.retainAlphaNums = require('./string-retain-alpha-nums.js');
        // Extract Person's Name
        prepare.string.extractPersonsName = require('./string-extract-persons-name.js');
        // Extract Run of Capital Words
        prepare.string.extractRunOfCapitalWords = require('./string-extract-run-of-capital-words.js');
        // Remove Punctuations
        prepare.string.removePunctuations = require('./string-remove-punctuations.js');
        // Remove Special Chars
        prepare.string.removeSplChars = require('./string-remove-spl-chars.js');
        // Remove HTML Tags
        prepare.string.removeHTMLTags = require('./string-remove-html-tags.js');
        // Remove Elisions
        prepare.string.removeElisions = require('./string-remove-elisions.js');
        // Split Elisions
        prepare.string.splitElisions = require('./string-split-elisions.js');
        // Amplify Not Elision
        prepare.string.amplifyNotElision = require('./string-amplify-not-elision');
        // Marker
        prepare.string.marker = require('./string-marker.js');
        // SOC
        prepare.string.soc = require('./string-soc.js');
        prepare.string.setOfChars = require('./string-soc.js');
        // NGrams
        prepare.string.ngrams = require('./string-ngram.js');
        // Edge NGrams
        prepare.string.edgeNGrams = require('./string-edge-ngrams.js');
        // BONG
        prepare.string.bong = require('./string-bong.js');
        prepare.string.bagOfNGrams = require('./string-bong.js');
        // SONG
        prepare.string.song = require('./string-song.js');
        prepare.string.setOfNGrams = require('./string-song.js');
        // Sentences
        prepare.string.sentences = require('./string-sentences.js');
        // Compose Corpus
        prepare.string.composeCorpus = require('./string-compose-corpus.js');
        // Tokenize0
        prepare.string.tokenize0 = require('./string-tokenize0.js');
        // Tokenize
        prepare.string.tokenize = require('./string-tokenize.js');
        // #### Stem
        prepare.string.stem = porter2Stemmer;
        // Phonetize
        prepare.string.phonetize = require('./string-phonetize.js');
        // Soundex
        prepare.string.soundex = require('./string-soundex.js');

        // ### Prepare.Tokens Name Space

        // Create prepare.tokens name space.
        prepare.tokens = Object.create(null);

        // Stem
        prepare.tokens.stem = require('./tokens-stem.js');
        // Phonetize
        prepare.tokens.phonetize = require('./tokens-phonetize.js');
        // Soundex
        prepare.tokens.soundex = require('./tokens-soundex.js');
        // Remove Words
        prepare.tokens.removeWords = require('./tokens-remove-words.js');
        // BOW
        prepare.tokens.bow = require('./tokens-bow.js');
        prepare.tokens.bagOfWords = require('./tokens-bow.js');
        // SOW
        prepare.tokens.sow = require('./tokens-sow.js');
        prepare.tokens.setOfWords = require('./tokens-sow.js');
        // Propagate Negations
        prepare.tokens.propagateNegations = require('./tokens-propagate-negations.js');
        // Bigrams
        prepare.tokens.bigrams = require('./tokens-bigrams.js');
        // Append Bigrams
        prepare.tokens.appendBigrams = require('./tokens-append-bigrams.js');

        // Export prepare.
        module.exports = prepare;
    }, { "./helper-return-indexer.js": 21, "./helper-return-quoted-text-extractor.js": 22, "./helper-return-words-filter.js": 23, "./string-amplify-not-elision": 26, "./string-bong.js": 27, "./string-compose-corpus.js": 28, "./string-edge-ngrams.js": 29, "./string-extract-persons-name.js": 30, "./string-extract-run-of-capital-words.js": 31, "./string-lower-case.js": 32, "./string-marker.js": 33, "./string-ngram.js": 34, "./string-phonetize.js": 35, "./string-remove-elisions.js": 36, "./string-remove-extra-spaces.js": 37, "./string-remove-html-tags.js": 38, "./string-remove-punctuations.js": 39, "./string-remove-spl-chars.js": 40, "./string-retain-alpha-nums.js": 41, "./string-sentences.js": 42, "./string-soc.js": 43, "./string-song.js": 44, "./string-soundex.js": 45, "./string-split-elisions.js": 46, "./string-tokenize.js": 47, "./string-tokenize0.js": 48, "./string-trim.js": 49, "./string-upper-case.js": 50, "./tokens-append-bigrams.js": 51, "./tokens-bigrams.js": 52, "./tokens-bow.js": 53, "./tokens-phonetize.js": 54, "./tokens-propagate-negations.js": 55, "./tokens-remove-words.js": 56, "./tokens-soundex.js": 57, "./tokens-sow.js": 58, "./tokens-stem.js": 59, "wink-porter2-stemmer": 62 }], 62: [function (require, module, exports) {
        //     wink-porter2-stemmer
        //     Implementation of Porter Stemmer Algorithm V2 by Dr Martin F Porter
        //
        //     Copyright (C) 2017  GRAYPE Systems Private Limited
        //
        //     This file is part of “wink-porter2-stemmer”.
        //
        //     “wink-porter2-stemmer” is free software: you can redistribute it
        //     and/or modify it under the terms of the GNU Affero
        //     General Public License as published by the Free
        //     Software Foundation, version 3 of the License.
        //
        //     “wink-porter2-stemmer” is distributed in the hope that it will
        //     be useful, but WITHOUT ANY WARRANTY; without even
        //     the implied warranty of MERCHANTABILITY or FITNESS
        //     FOR A PARTICULAR PURPOSE.  See the GNU Affero General
        //     Public License for more details.
        //
        //     You should have received a copy of the GNU Affero
        //     General Public License along with “wink-porter2-stemmer”.
        //     If not, see <http://www.gnu.org/licenses/>.

        // Implements the Porter Stemmer Algorithm V2 by Dr Martin F Porter.
        // Reference: https://snowballstem.org/algorithms/english/stemmer.html

        // ## Regex Definitions

        // Regex definition of `double`.
        var rgxDouble = /(bb|dd|ff|gg|mm|nn|pp|rr|tt)$/;
        // Definition for Step Ia suffixes.
        var rgxSFXsses = /(.+)(sses)$/;
        var rgxSFXiedORies2 = /(.{2,})(ied|ies)$/;
        var rgxSFXiedORies1 = /(.{1})(ied|ies)$/;
        var rgxSFXusORss = /(.+)(us|ss)$/;
        var rgxSFXs = /(.+)(s)$/;
        // Definition for Step Ib suffixes.
        var rgxSFXeedlyOReed = /(.*)(eedly|eed)$/;
        var rgxSFXedORedlyORinglyORing = /([aeiouy].*)(ed|edly|ingly|ing)$/;
        var rgxSFXatORblORiz = /(at|bl|iz)$/;
        // Definition for Step Ic suffixes.
        var rgxSFXyOR3 = /(.+[^aeiouy])([y3])$/;
        // Definition for Step II suffixes; note we have spot the longest suffix.
        var rgxSFXstep2 = /(ization|ational|fulness|ousness|iveness|tional|biliti|lessli|entli|ation|alism|aliti|ousli|iviti|fulli|enci|anci|abli|izer|ator|alli|bli|ogi|li)$/;
        var rgxSFXstep2WithReplacements = [
        // Length 7.
        { rgx: /ational$/, replacement: 'ate' }, { rgx: /ization$/, replacement: 'ize' }, { rgx: /fulness$/, replacement: 'ful' }, { rgx: /ousness$/, replacement: 'ous' }, { rgx: /iveness$/, replacement: 'ive' },
        // Length 6.
        { rgx: /tional$/, replacement: 'tion' }, { rgx: /biliti$/, replacement: 'ble' }, { rgx: /lessli$/, replacement: 'less' },
        // Length 5.
        { rgx: /iviti$/, replacement: 'ive' }, { rgx: /ousli$/, replacement: 'ous' }, { rgx: /ation$/, replacement: 'ate' }, { rgx: /entli$/, replacement: 'ent' }, { rgx: /(.*)(alism|aliti)$/, replacement: '$1al' }, { rgx: /fulli$/, replacement: 'ful' },
        // Length 4.
        { rgx: /alli$/, replacement: 'al' }, { rgx: /ator$/, replacement: 'ate' }, { rgx: /izer$/, replacement: 'ize' }, { rgx: /enci$/, replacement: 'ence' }, { rgx: /anci$/, replacement: 'ance' }, { rgx: /abli$/, replacement: 'able' },
        // Length 3.
        { rgx: /bli$/, replacement: 'ble' }, { rgx: /(.*)(l)(ogi)$/, replacement: '$1$2og' },
        // Length 2.
        { rgx: /(.*)([cdeghkmnrt])(li)$/, replacement: '$1$2' }];
        // Definition for Step III suffixes; once again spot the longest one first!
        var rgxSFXstep3 = /(ational|tional|alize|icate|iciti|ative|ical|ness|ful)$/;
        var rgxSFXstep3WithReplacements = [{ rgx: /ational$/, replacement: 'ate' }, { rgx: /tional$/, replacement: 'tion' }, { rgx: /alize$/, replacement: 'al' }, { rgx: /(.*)(icate|iciti|ical)$/, replacement: '$1ic' }, { rgx: /(ness|ful)$/, replacement: '' }];
        // Definition for Step IV suffixes.
        var rgxSFXstep4 = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|al|er|ic)$/;
        var rgxSFXstep4Full = /(ement|ance|ence|able|ible|ment|ant|ent|ism|ate|iti|ous|ive|ize|ion|al|er|ic)$/;
        var rgxSFXstep4ion = /(.*)(s|t)(ion)$/;
        // Exceptions Set I.
        var exceptions1 = {
            // Mapped!
            'skis': 'ski',
            'skies': 'sky',
            'dying': 'die',
            'lying': 'lie',
            'tying': 'tie',
            'idly': 'idl',
            'gently': 'gentl',
            'ugly': 'ugli',
            'early': 'earli',
            'only': 'onli',
            'singly': 'singl',
            // Invariants!
            'sky': 'sky',
            'news': 'news',
            'atlas': 'atlas',
            'cosmos': 'cosmos',
            'bias': 'bias',
            'andes': 'andes'
        };
        // Exceptions Set II.
        // Note, these are to be treated as full words.
        var rgxException2 = /^(inning|outing|canning|herring|proceed|exceed|succeed|earring)$/;

        // ## Private functions

        // ### prelude
        /**
         * Performs initial pre-processing by transforming the input string `s` as
         * per the replacements.
         *
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var prelude = function (s) {
            return s
            // Handle `y`'s.
            .replace(/^y/, '3').replace(/([aeiou])y/, '$13')
            // Handle apostrophe.
            .replace(/\’s$|\'s$/, '').replace(/s\’$|s\'$/, '').replace(/[\’\']$/, '');
        }; // prelude()

        // ### isShort
        /**
         * @param {String} s Input string
         * @return {Boolean} `true` if `s` is a short syllable, `false` otherwise
         * @private
         */
        var isShort = function (s) {
            // (a) a vowel followed by a non-vowel other than w, x or 3 and
            // preceded by a non-vowel, **or** (b) a vowel at the beginning of the word
            // followed by a non-vowel.
            return (/[^aeiouy][aeiouy][^aeiouywx3]$/.test(s) || /^[aeiouy][^aeiouy]{0,1}$/.test(s) // Removed this new changed??

            );
        }; // isShort()

        // ### markRegions
        /**
         * @param {String} s Input string
         * @return {Object} the `R1` and `R2` regions as an object from the input string `s`.
         * @private
         */
        var markRegions = function (s) {
            // Matches of `R1` and `R2`.
            var m1, m2;
            // To detect regions i.e. `R1` and `R2`.
            var rgxRegions = /[aeiouy]+([^aeiouy]{1}.+)/;
            m1 = rgxRegions.exec(s);
            if (!m1) return { r1: '', r2: '' };
            m1 = m1[1].slice(1);
            // Handle exceptions here to prevent over stemming.
            m1 = /^(gener|commun|arsen)/.test(s) ? s.replace(/^(gener|commun|arsen)(.*)/, '$2') : m1;
            m2 = rgxRegions.exec(m1);
            if (!m2) return { r1: m1, r2: '' };
            m2 = m2[1].slice(1);
            return { r1: m1, r2: m2 };
        }; // markRegions()

        // ### step1a
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1a = function (s) {
            var wordPart;
            if (rgxSFXsses.test(s)) return s.replace(rgxSFXsses, '$1ss');
            if (rgxSFXiedORies2.test(s)) return s.replace(rgxSFXiedORies2, '$1i');
            if (rgxSFXiedORies1.test(s)) return s.replace(rgxSFXiedORies1, '$1ie');
            if (rgxSFXusORss.test(s)) return s;
            wordPart = s.replace(rgxSFXs, '$1');
            if (/[aeiuouy](.+)$/.test(wordPart)) return s.replace(rgxSFXs, '$1');
            return s;
        }; // step1a()

        // ### step1b
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1b = function (s) {
            var rgn = markRegions(s),
                sd;
            // Search for the longest among the `eedly|eed` suffixes.
            if (rgxSFXeedlyOReed.test(s))
                // Replace by ee if in R1.
                return rgxSFXeedlyOReed.test(rgn.r1) ? s.replace(rgxSFXeedlyOReed, '$1ee') : s;
            // Delete `ed|edly|ingly|ing` if the preceding word part contains a vowel.
            if (rgxSFXedORedlyORinglyORing.test(s)) {
                sd = s.replace(rgxSFXedORedlyORinglyORing, '$1');
                rgn = markRegions(sd);
                // And after deletion, return either
                return rgxSFXatORblORiz.test(sd) ? sd + 'e' :
                // or
                rgxDouble.test(sd) ? sd.replace(/.$/, '') :
                // or
                isShort(sd) && rgn.r1 === '' ? sd + 'e' :
                // or
                sd;
            }
            return s;
        }; // step1b()

        // ### step1c
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step1c = function (s) {
            return s.replace(rgxSFXyOR3, '$1i');
        }; // step1c()

        // ### step2
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step2 = function (s) {
            var i,
                imax,
                rgn = markRegions(s),
                us; // updated s.
            var match = s.match(rgxSFXstep2);
            match = match === null ? '$$$$$' : match[1];
            if (rgn.r1.indexOf(match) !== -1) {
                for (i = 0, imax = rgxSFXstep2WithReplacements.length; i < imax; i += 1) {
                    us = s.replace(rgxSFXstep2WithReplacements[i].rgx, rgxSFXstep2WithReplacements[i].replacement);
                    if (s !== us) return us;
                }
            }
            return s;
        }; // step2()

        // ### step3
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step3 = function (s) {
            var i,
                imax,
                rgn = markRegions(s),
                us; // updated s.
            var match = s.match(rgxSFXstep3);
            match = match === null ? '$$$$$' : match[1];

            if (rgn.r1.indexOf(match) !== -1) {
                for (i = 0, imax = rgxSFXstep3WithReplacements.length; i < imax; i += 1) {
                    us = s.replace(rgxSFXstep3WithReplacements[i].rgx, rgxSFXstep3WithReplacements[i].replacement);
                    if (s !== us) return us;
                }
                if (/ative/.test(rgn.r2)) return s.replace(/ative$/, '');
            }
            return s;
        }; // step3()

        // ### step4
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step4 = function (s) {
            var rgn = markRegions(s);
            var match = s.match(rgxSFXstep4Full);
            match = match === null ? '$$$$$' : match[1];
            if (rgxSFXstep4Full.test(s) && rgn.r2.indexOf(match) !== -1) {
                return rgxSFXstep4.test(s) ? s.replace(rgxSFXstep4, '') : rgxSFXstep4ion.test(s) ? s.replace(rgxSFXstep4ion, '$1$2') : s;
            }
            return s;
        }; // step4()

        // ### step5
        /**
         * @param {String} s Input string
         * @return {String} Processed string
         * @private
         */
        var step5 = function (s) {
            var preceding, rgn;
            // Search for the `e` suffixes.
            rgn = markRegions(s);
            if (/e$/i.test(s)) {
                preceding = s.replace(/e$/, '');
                return (
                    // Found: delete if in R2, or in R1 and not preceded by a short syllable
                    /e/.test(rgn.r2) || /e/.test(rgn.r1) && !isShort(preceding) ? preceding : s
                );
            }
            // Search for the `l` suffixes.
            if (/l$/.test(s)) {
                rgn = markRegions(s);
                // Found: delete if in R2
                return rgn.r2 && /l$/.test(rgn.r2) ? s.replace(/ll$/, 'l') : s;
            }
            // If nothing happens, must return the string!
            return s;
        }; // step5()

        // ## Public functions
        // ### stem
        /**
         *
         * Stems an inflected `word` using Porter2 stemming algorithm.
         *
         * @param {string} word — word to be stemmed.
         * @return {string} — the stemmed word.
         *
         * @example
         * stem( 'consisting' );
         * // -> consist
         */
        var stem = function (word) {
            var str = word.toLowerCase();
            if (str.length < 3) return str;
            if (exceptions1[str]) return exceptions1[str];
            str = prelude(str);
            str = step1a(str);

            if (!rgxException2.test(str)) {
                str = step1b(str);
                str = step1c(str);
                str = step2(str);
                str = step3(str);
                str = step4(str);
                str = step5(str);
            }

            str = str.replace(/3/g, 'y');
            return str;
        }; // stem()

        // Export stem function.
        module.exports = stem;
    }, {}] }, {}, [2]);