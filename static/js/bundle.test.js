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
    let passphrase = 'f929bea7-6329-35b5-82c1-ba4e58b38bdd';
    let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
    let intents={"ct":"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","iv":"d777caea90a8766b506325204afb6eef","s":"abbfb0f9b84ee758"};
    let entities={"ct":"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","iv":"7a62c33e36cdbdcb09c5b735d6ae298a","s":"6a3beb55327dc628"};
    let flows={"ct":"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","iv":"5ec0e2a00d67a347db95b47f7469da65","s":"2e978d2aac4a1832"};

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
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "qna" && status.level == "direct" && !user.stages[user.tracker].skipGhost && data.intents.probability >= 0.98) {
                                    status.final = "inFlowNextGhost";
                                    status.previousStage = "";
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "flow" && status.level == "direct" && flow && user.conversationId != flow.flowId && !user.stages[user.tracker].skipGhost && data.intents.probability >= 0.98) {
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