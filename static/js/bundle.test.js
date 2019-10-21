(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a;
                } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r]; return o(n || r);
                }, p, p.exports, r, e, n, t);
            } return n[i].exports;
        } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]); return o;
    } return r;
})()({
    1: [function (require, module, exports) {
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

        function noop() { }

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
            //         // // console.log("Location Fetched")
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

            let passphrase = '333762dd-e264-3eb7-9a08-7857322a06f0';
            let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
            let intents={"ct":"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","iv":"a4cc40b69fc32539738c7b9e39960dd6","s":"9310fe1f3b3cf92c"};
            let entities={"ct":"M4LbVmsSr97DfBjo1QIXnqvWXWRpvZWinqKLMroSQNLqGwpr7m3Kec2zVq/uG1N9gxPIVo1U+Y3qbrX4syyZeztKTN88EEigPQpkcsSqNiGN8E2vfYBFl+iV6zIKVay16F1+SA3/cXiFHsWBozJtznhxbCp412FUFvAtCiomQ2wqdfsjno+qds6MOJ8m9He1l5anMQ3is0Q/SNQ2aNw0QGaRBwA3TY3xZspsQ6Xa6mSh8Ed/zUbikCmd1Ms1wizRE/mVRQWst0PLjj7qytQF8HhYsyFu/SlJTYsYSN9Om2bSBvCN1qKZJjED704vi3Qt","iv":"4c03b12464950fb951283b45497204d0","s":"bee20687cd29aabb"};
            let flows={"ct":"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","iv":"f7bcd4c869c74898924e410c152b8730","s":"bd6e16703db1ee0d"};

            let checkUrl = 'https://parramato.com/check';
            let modal = window.jubiModal;
            window.jubiModal = null;

            let backendUrl = 'https://parramato.com'
            let backendPath = '/socket'

            // let middlewareUrl = 'https://development.jubi.ai/usaidWeb'
            let middlewareUrl = 'https://khushi.jubi.ai/'
            let middlewarePath = '/socket/socket.io'
            let middlewareWebsocket = true
            let middlewareSecurity = false

            let uploadUrl = 'https://parramato.com'
            let uploadPath = '/upload/socket'

            let humanUrl = 'https://parramato.com'
            let humanPath = '/human/socket'

            let voiceUrl = 'https://parramato.com'
            let voicePath = '/voice/socket'

            let directMultiplier = 1
            let fallbackMultiplier = 0.8

            let timeoutSeconds = 1200


            let strictlyFlow = true;
            let humanAssistSwitch = true;
            let voiceEnabled = false;
            let cookie = false;

            let speechGenderBackend = 'FEMALE'
            let speechLanguageCodeBackend = 'en-US'

            let projectId = 'usaidWeb_353553876735'
            let attachmentUrl = 'https://parramato.com/bot-view/images/attachment.png'
            let integrityPassPhrase = 'hbu8b23478gbuy2bcfy2cbcihsdcgUGUYUuy2bcfy2cbcihsdcYBEBIW'
            let localSavePassPhrase = '8rhfuahiuHFIJUHAFIWEHFOw98ehfu9HFjhE234jbhJHbjhbfjebkfewfewjhEUHFUIsrh_dev_184276895194'

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
                    // // console.log("tags")
                    let encryptedTags = getLocalStorageData("tags_" + localSavePassPhrase);
                    tags = JSON.parse(crypterLocal.decrypt(encryptedTags));
                    // // console.log(tags)
                } catch (e) {
                    // // console.log(e)
                }
                try {
                    // // console.log("tags")
                    let encryptedUser = getLocalStorageData("user_" + localSavePassPhrase);
                    user = JSON.parse(crypterLocal.decrypt(encryptedUser));
                    // // console.log(tags)
                } catch (e) {
                    // // console.log(e)
                }
                if (!webId) {
                    let webIdData = getLocalStorageData("webId_" + localSavePassPhrase);
                    if (webIdData) {
                        try {
                            webIdData = JSON.parse(crypterLocal.decrypt(webIdData));
                            if (webIdData && webIdData.id) {
                                webId = webIdData.id;
                            }
                        } catch (e) { }
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
                // console.log("confidence direct:"+thresholdDirect)
                // console.log("confidence fallback:"+thresholdOptions)
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
                        // // console.log("Going Offline")
                        //disconnectVoice();
                        // offFunction();
                    });
                    socketHuman.on('connect', function () {
                        //online=true;
                        //onFunction();
                    });
                } catch (e) {
                    socketHuman = { on: () => { }, emit: () => { } };
                }

                try {
                    socketUpload = io(uploadUrl, {
                        transports: ['websocket'],
                        path: uploadPath
                    });
                } catch (e) {
                    socketUpload = { on: () => { }, emit: () => { } };
                }

                try {
                    socketVoice = io(voiceUrl, {
                        transports: ['websocket'],
                        path: voicePath
                    });
                } catch (e) {

                    socketVoice = { on: () => { }, emit: () => { } };
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
                    // // console.log("Separate Backend")
                    socketMiddleware.on('connect', function () {
                        window.socketId = socketMiddleware.id; //
                        online = true;
                        onFunction();
                    });
                } catch (e) {
                    socketBackend = { on: () => { }, emit: () => { } };
                    socketMiddleware = { on: () => { }, emit: () => { } };
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
                // console.log("ON:::")
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
                    // console.log("Too Many requests");
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
                        // // console.log("EVENT "+event.type)
                        // // console.log({data:event,webId:webId,requestId:uid})
                        socketBackend.emit("web-event-register", crypterTransit.encrypt(JSON.stringify({ data: event, webId: webId, requestId: uid })));
                        socketBackend.on("web-event-register-" + webId + "-" + uid, () => { });
                    }
                });
            }

            function triggerEventError(event) {
                rateLimiter(() => {
                    if (online) {
                        let uid = IDGenerator(20);
                        // console.log("EVENT ERROR "+event.type)
                        // console.log({data:event,webId:webId,requestId:uid})
                        socketBackend.emit("web-event-register-error", crypterTransit.encrypt(JSON.stringify({ data: event, webId: webId, requestId: uid })));
                        socketBackend.on("web-event-register-error-" + webId + "-" + uid, () => { });
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
                    // // console.log(e);
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
                        // // console.log(e);
                        return reject(e);
                    }
                });
            }

            //Chat Engine
            let ChatEngine = function (callbackOption) {

                let callback = function (data) {
                    // // console.log("no callback")
                    // // console.log(data)
                };

                if (callbackOption) {
                    callback = callbackOption;
                }

                async function runOnNotification(data) {
                    try {
                        if (middlewareSecurity) {
                            data = JSON.parse(crypterMiddleware.decrypt(data));
                        }
                    } catch (e) { }
                    if (typeof data == "string") {
                        data = JSON.parse(data);
                    }
                    // // console.log(data)
                    // // console.log("Web-External")
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
                            } catch (e) { }
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
                    // // console.log("Web external")
                    // // console.log(data)
                    // // console.log("Web-External")

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
                                pre(currentStage).then(resolve).catch(e => {
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
                    tags.blockBot = undefined;
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
                        // // console.log("PROCESS INPUT")
                        if (strictlyFlow) {
                            $("#jubi-textInput").hide(200);
                        }
                        try {
                            if (lastTimestamp === undefined) {
                                let encryptedLastTimestamp = getLocalStorageData("t_" + localSavePassPhrase);
                                if (encryptedLastTimestamp) {
                                    try {
                                        lastTimestamp = JSON.parse(crypterLocal.decrypt(encryptedLastTimestamp)).lastTimestamp;
                                    } catch (e) { }
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
                            // // console.log(e);
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
                            // // console.log(match[0])
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
                                let output = {
                                    intents: {}, entities: {}, top: []
                                    //entity extraction
                                }; for (let option of user.previousOptions) {
                                    // let entityData=replaceAllEntities(option.query,output);
                                    // let textReplaced = entityData.text
                                    // // console.log("MATCH::::::::::::")
                                    // // console.log("TEXT REPLACED:::::::::::::"+textReplaced)
                                    // // console.log("TEXT:::::::::::::"+text)
                                    // // console.log("OQ:::::::::::::"+option.query)
                                    if (text == option.query) {
                                        // // console.log("MATCHED::::::::::::")
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
                                    // // console.log(saveResponse.error);
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
                                        // // console.log(reponse.error);
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
                                    // // console.log(e)
                                });
                                if (validatedModel && validatedModel.data) {
                                    tags[prevStage.stage] = validatedModel.data;
                                }
                                setLocalStorageData("tags_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(tags)));
                            }
                            // // console.log(tags)
                            let timestamp4 = new Date().getTime();
                            let flowManagerData = await processFlowManager({ query: text, intents: nluProcessedModel.intents, topIntents: nluProcessedModel.top, validation: validatedModel });
                            let stageModel = flowManagerData.response;
                            let status = flowManagerData.status;
                            let timestamp5 = new Date().getTime();
                            // // console.log(timestamp2-timestamp1)
                            // // console.log(timestamp3-timestamp2)
                            // // console.log(timestamp4-timestamp3)
                            // // console.log(timestamp5-timestamp4)
                            saveInformation("post", validatedModel, prevStage, stageModel, nluProcessedModel, text).then(reponse => {
                                if (reponse && reponse.error) {
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "runengine-4",
                                        error: reponse.error
                                    });
                                    // // console.log(reponse.error);
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
                                // // console.log(e)
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
                            // // console.log(e)
                            return reject(e);
                        }
                    });

                    function saveInformation(type, validatedModel, prevStage, stageModel, nluProcessedModel, text) {
                        return new Promise((resolve, reject) => {
                            if (!online) {
                                return reject({ status: "offline" });
                            }
                            let uid = IDGenerator(20);
                            let input = { type: type, validation: validatedModel, prevStage: prevStage, webId: webId, nlu: nluProcessedModel, text: text, stage: stageModel, requestId: uid };
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
                        // // console.log(":::::::::::")
                        // // console.log(resp)
                        return resp;
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
                                    triggerEventError({
                                        senderId: webId,
                                        channel: channel,
                                        projectId: projectId,
                                        type: "opinionfromlr-1",
                                        error: receivedModel.error
                                    });
                                    // // console.log(body.error)
                                    return reject(receivedModel.error);
                                }
                                // // console.log(receivedModel)
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
                                for (let token of entityDocs[label][value]) {
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
                                // // console.log("QUERY")
                                // // console.log(text)
                                let outputIntents = [];
                                for (let label in intentDocs) {
                                    for (let utterance of intentDocs[label]) {
                                        let score = 0;
                                        if (utterance.toLowerCase() == text.toLowerCase()) {
                                            score = 1;
                                            // // console.log("MATCH MATCH")
                                        } else {
                                            score = stringSimilarity.compareTwoStrings(utterance, text);
                                        }

                                        // // console.log(text+":::"+score+":::"+utterance)
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
                                // // console.log("OUTPUT INTENTS")
                                // // console.log(outputIntents)
                                if (outputIntents.length > 1 || output.intents.probability && output.intents.probability < 0.97) {
                                    matchFlag = false;
                                } else if (outputIntents.length == 1) {
                                    matchFlag = true;
                                }
                                // // console.log("INTENT DOCS")
                                // // console.log(intentDocs)
                                // // console.log("EXACT MATCH")
                                // // console.log(matchFlag)
                                // console.log("JUBI_REQUEST:"+text)

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
                                    // // console.log("NB DATA")
                                    // // console.log(nbData)
                                    let shrinkedIndexedData = {};
                                    for (let element in intentDocs) {
                                        if (intentDocs[element].length > 0) {
                                            shrinkedIndexedData[element] = intentDocs[element];
                                        }
                                    }
                                    // // console.log("TOTAL DATA")
                                    // // console.log(shrinkedIndexedData)
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
                                        // // console.log(e);
                                    }

                                    // // console.log("BM25")
                                    // // console.log(results)


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
                                            // // console.log(e);
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
                                    // // console.log("LR")
                                    // // console.log(output)
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
                                // // console.log(e);
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
                                // // console.log(e)
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
                                        } catch (e) { }
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
                                    // // console.log(e);
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
                                    // // console.log(expectation)
                                    // // console.log(entities)
                                    // // console.log(input)
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
                                                // // console.log(model.stage)
                                                // // console.log(entities)
                                                // // console.log(expectation)
                                                // // console.log(":::::::::::STAGE::::::::::::")
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
                                    // // console.log(e);
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
                                    // // console.log(e);
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
                                // // console.log(data.intents.probability)
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
                                } else if (status.prevConversation == "flow" && status.nextInitConversation == "qna" && status.level == "direct" && !user.stages[user.tracker].skipGhost) {
                                    status.final = "inFlowNextGhost";
                                    status.previousStage = "";
                                }
                                // else if (status.prevConversation=="flow"&&status.nextInitConversation=="flow"&&status.level=="direct"&&flow&&user.conversationId!=flow.flowId){
                                //     status.final="nextStart"
                                // }
                                else if (status.prevConversation == "flow" && status.validation) {
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
                                // // console.log(e);
                                return reject(e);
                            }
                        });

                        function decideResponse(flow, data, status) {
                            return new Promise((resolve, reject) => {
                                try {
                                    // // console.log(status) 
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
                                                        // // console.log(e)
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
                                                        // // console.log(e)
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
                                                    // // console.log(":::::::::::::::::::::::")
                                                    // // console.log(stage.stage)
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
                                                        // // console.log(e)
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
                                            // // console.log(currentStage)
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
                                                        // // console.log(e)
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
                                                        // // console.log(e)
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
                                    // // console.log(e);
                                    return reject(e);
                                }
                            });
                        }
                    }
                }
            };
            //Chat Middleware Js
            function middleware() {
                let backendResponse;
                if (!backendResponse) {
                    backendResponse = false;
                }
                let booleanHideShow;
                let delayMaster = 2000;
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
                    // // console.log("no speech")
                    hideVoice();
                }

                // setTimeout(async()=>{
                //     let currentState=await doesConnectionExist();
                //     if(currentState!=online){
                //         online=currentState;
                //         if(online){
                //             // console.log("Going Online")
                //         }
                //         else{
                //             // console.log("Going Offline")
                //             disconnectVoice();
                //         }
                //     } 
                // },1000);
                socketMiddleware.on('disconnect', function () {
                    online = false;
                    // console.log("Going Offline")
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
                    } catch (e) { }
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
                    } catch (e) { }
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
                                // console.log("DECRYPTED ARRAY")
                                // console.log(decryptedArray)
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
                                        document.getElementById('pm-permission-view').style.display = "none";
                                        document.getElementById('pm-secIframe').style.display = "block";
                                        pushToChatStart(htmlToBeAdded);
                                        $(".bxCheckOPtion").remove();
                                        setTimeout(() => {
                                            try {
                                                console.log("called ");
                                                $("#pm-data").animate({ scrollTop: $("#pm-buttonlock").height() }, '1000000');
                                                scrollUp();
                                            } catch (e) {
                                                console.log(e);
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
                                            document.getElementById('pm-permission-view').style.display = "none";
                                            document.getElementById('pm-secIframe').style.display = "block";
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
                                            invalidate(() => { }, true);
                                            clearAllLocalStorageData();
                                            chatArray = [];
                                            document.getElementById('pm-permission-view').style.display = "none";
                                            document.getElementById('pm-secIframe').style.display = "block";
                                            console.log(inputQuery);
                                            console.log(":::::::::::::::>>>>>>>>>>>");
                                            let ans = prepareJSONRequest(inputQuery);
                                            sendMessage(ans);
                                            scrollUp();
                                        });
                                        document.getElementById('pm-permission-view').style.display = "block";
                                        document.getElementById('pm-secIframe').style.display = "none";
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
                            document.getElementById('pm-permission-view').style.display = "none";
                            document.getElementById('pm-secIframe').style.display = "block";
                            console.log("Start Message");
                            console.log(inputQuery);
                            user.stages = undefined;
                            user.tracker = 0;
                            user.conversationId = undefined;
                            let ans = prepareJSONRequest(inputQuery);
                            sendMessage(ans);
                            scrollUp();
                        };
                        if (!window.runOnJubiStartEvent) {
                            console.log("Starting Bot now");
                            startTheBot();
                        } else {
                            console.log("Starting Bot later");
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
                    mute = false; //st

                try {
                    document.getElementById('jubi-muteVoice').style.display = "none"; //st
                    if (voiceEnabled) {
                        document.getElementById('jubi-unmuteVoice').style.display = "block"; //st
                    } else {
                        document.getElementById('jubi-muteVoice').style.display = "none";
                    }
                } catch (e) { }

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
                        document.getElementById('jubi-textInput').style.display = "none";
                        document.getElementById('button-play-ws').setAttribute('disabled', 'disabled');
                        document.getElementById('button-stop-ws').setAttribute('disabled', 'disabled');
                    } catch (e) {
                        // console.log(e);
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
                        // console.log(e);
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
                        // console.log(e)
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
                            // console.log(tags);
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
                        // console.log(e)
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
                            // console.log(tags);
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
                                // console.log(ex)
                                await stopAllRecordings();
                            }
                            recognizer.onerror = async function (event) {
                                // console.log(event)
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
                                // console.log(e);
                                return reject(e);
                            });
                        } catch (e) {
                            return reject(e);
                        }
                    });
                }

                async function getResults(data) {
                    // console.log("RESPONSE")
                    // console.log(data.results)
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
                        // console.log(wholeString);
                        // console.log("Google Speech sent 'final' Sentence.");

                        finalWord = true;
                        removeLastSentence = false;
                        run(wholeString, "speech");
                        clearSpeechText();
                        await stopAllRecordings();
                    }
                    // console.log("HEIGHT")
                    // console.log($("#jubi-recording-text").height())
                }

                //voice record------------------


                //speech out-------
                async function textToSpeech(text) {
                    try {
                        await stopAllRecordings();
                    } catch (e) {
                        // console.log(e);
                    }
                    try {
                        let postSpeech;
                        // try{
                        //     postSpeech=await convertAndPlaySpeechOnBrowser(text);
                        // }
                        // catch(e){
                        postSpeech = await convertAndPlaySpeechFromAPI(text);
                        // }
                        afterVoiceOut(postSpeech);
                    } catch (e) {
                        // console.log(e);
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
                //             // console.log(e);
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

                function convertAndPlaySpeechFromAPI(text) {

                    return new Promise((resolve, reject) => {
                        if (!online) {
                            return reject({ status: "offline" });
                        }
                        let uid = IDGenerator(20);
                        let requestData = {
                            data: {
                                text: removeHTMLTags(text),
                                gender: speechGenderBackend || "FEMALE",
                                languageCode: speechLanguageCodeBackend || "en-US"
                            },
                            webId: webId,
                            requestId: uid
                        };
                        socketVoice.emit("web-text-to-speech", crypterTransit.encrypt(requestData));
                        socketVoice.on("web-text-to-speech-" + webId + "-" + uid, data => {
                            // console.log(data)
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
                    //console.log(JSON.stringify(res, null, 3))
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
                    show_replies();
                    async function show_replies() {
                        if (!$("#pm-bxloadgif").is(":visible")) {
                            $("#pm-buttonlock").append(prepareChatBotLoader());
                        }
                        $("#pm-bxloadgif").fadeOut(100);
                        $("#pm-bxloadgif").fadeIn(500);
                        await waitForAwhile(delayMaster);

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
                            // console.log(res.botMessage[i].type + res.botMessage[i].value + "****")
                            // console.log(lastConversationSemaphore);
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
                            // console.log("Show replies")
                            show_replies();
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
                        // console.log(str)
                        setTimeout(function () {
                            slidebx();
                        }, 0);
                        return str;
                    }
                }
                function pushToChatStart(str) {
                    $(".pm-bxChat").append(str);
                }
                function pushToChat(str) {
                    $("#pm-bxloadgif").remove();
                    $(".pm-bxChat").append(str);
                    chatArray.push(str);
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
                                // console.log(data[i].text)
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
                    $("#pm-bxloadgif").remove();
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput' >" + "<p>" + msg.replaceAll("|br|", "<br/>") + "</p>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstReply(msg) {
                    $("#pm-bxloadgif").remove();
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput' >" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<p>" + msg.replaceAll("|br|", "<br/>") + "</p>" + '<div class="jubi-msgReplyTime jubi-left_msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFirstFileReply(msg) {
                    $("#pm-bxloadgif").remove();
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareFileReply(msg) {
                    $("#pm-bxloadgif").remove();
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible;'>" + "<div class='pm-leftInput'>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + attachmentUrl + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime ">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotFirstImageReply(msg) {
                    $("#pm-bxloadgif").remove();
                    let d = getTime();
                    return "<div class='pm-bxLeftchat ' style='visibility: visible; '>" + "<div class='pm-leftUserimg'>" + "<img src='" + modal.static.images.botIcon + "' class='img-responsive'>" + "</div>" + "<div class='pm-leftInput'>" + "<div class='pm-arrowLeftchat pm-arrow-left'></div>" + "<div class='pm-postImg'>" + "<a href='" + msg + "' target='_blank'><img src='" + msg + "'  class='img-responsive'/></a>" + "</div>" + '<div class="jubi-msgReplyTime">' + '<h5>' + d.hours + ':' + d.minutes + d.ampm + '</h5>' + '</div>' + "</div><div class='clearfix'></div>" + "</div>";
                }
                function prepareChatBotImageReply(msg) {
                    $("#pm-bxloadgif").remove();
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
                    $("#pm-bxloadgif").remove();
                    let d = getTime();
                    return "<div id='pm-bxloadgif' class='pm-bxuser_question pm-bxloadgif ' style='visibility: visible;'><div class='pm-leftInputGif'><div class='pm-leftUserimg'><img src='" + modal.static.images.botIcon + "' class='img-responsive'></div><div class='pm-innerloadgif'>" + "<img src='" + modal.static.images.loaderBotChat + "' />" + "</div></div></div>";
                }
                function prepareChatBotUserLoader() {
                    $("#pm-bxloadgif").remove();
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
                        // console.log(JSON.stringify(data, null, 3))
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
                    console.log("FILE UPLOAD");
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
                                    // console.log(JSON.stringify(data))
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
                                            // console.log(JSON.stringify(data))
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
        var hasProtoEnumBug = isEnumerable.call(function () { }, 'prototype');
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
                } catch (error) { }
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

            function noop() { }
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
    }, {}]
}, {}, [2]);

