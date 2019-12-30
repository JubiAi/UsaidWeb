(function () {
    function r(e, n, t) {
        function o(i, f) {
            if (!n[i]) {
                if (!e[i]) {
                    var c = "function" == typeof require && require;
                    if (!f && c) return c(i, !0);
                    if (u) return u(i, !0);
                    var a = new Error("Cannot find module '" + i + "'");
                    throw a.code = "MODULE_NOT_FOUND", a;
                }
                var p = n[i] = {
                    exports: {}
                };
                e[i][0].call(p.exports, function (r) {
                    var n = e[i][1][r];
                    return o(n || r);
                }, p, p.exports, r, e, n, t);
            }
            return n[i].exports;
        }
        for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
        return o;
    }
    return r;
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
    }, {}],
    2: [function (require, module, exports) {
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
                return {
                    hours: hours,
                    minutes: minutes,
                    ampm: ampm
                };
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
                        let cipherParams = CryptoJS.lib.CipherParams.create({
                            ciphertext: CryptoJS.enc.Base64.parse(j.ct)
                        });
                        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
                        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
                        return cipherParams;
                    },
                    stringify: function (cipherParams) {
                        let j = {
                            ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
                        };
                        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
                        if (cipherParams.salt) j.s = cipherParams.salt.toString();
                        return JSON.stringify(j);
                    }
                };

                return {
                    decrypt: function (data) {
                        return JSON.parse(CryptoJS.AES.decrypt(data, pass, {
                            format: CryptoJSAesJson
                        }).toString(CryptoJS.enc.Utf8));
                    },
                    encrypt: function (data) {
                        return CryptoJS.AES.encrypt(JSON.stringify(data), pass, {
                            format: CryptoJSAesJson
                        }).toString();
                    }
                };
            };
            //------start------
            //------CODE------

            let passphrase = 'f0a49ba8-a0b6-3ae8-860d-530ab771c611';
            let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
            let intents = {
                "ct": "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",
                "iv": "799206082190c5b6b304bc5cce260e8b",
                "s": "542d672c4d081544"
            };
            let entities = {
                "ct": "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",
                "iv": "085aecc9b7e0b8cf208248d4c62d7563",
                "s": "c654cf62c99cb289"
            };
            let flows = {
                "ct": "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",
                "iv": "61b64f68ea38ded5b204b15ccff5304d",
                "s": "3bafa9aacdf65441"
            };

            let checkUrl = 'https://parramato.com/check';
            let modal = window.jubiModal;

            let backendUrl = 'https://parramato.com'
            let backendPath = '/socket'

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

            let directMultiplier = 0.8
            let fallbackMultiplier = 0.6

            let timeoutSeconds = 1200


            let strictlyFlow = false;
            let humanAssistSwitch = false;
            let voiceEnabled = true;
            let cookie = false;

            let speechGenderBackend = 'FEMALE'
            let speechLanguageCodeBackend = 'en-IN'

            let projectId = 'Alpha Version_586886576888'
            let attachmentUrl = 'https://parramato.com/bot-view/images/attachment.png'
            let integrityPassPhrase = 'hbu8b23478gbuy2bcfy2cbcihsdcgUGUYUuy2bcfy2cbcihsdcYBEBIW'
            let localSavePassPhrase = '8rhfuahiuHFIJUHAFIWEHFOw98ehfu9HFjhE234jbhJHbjhbfjebkfewfewjhEUHFUIAlpha Version_586886576888'
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
                    socketHuman = {
                        on: () => {},
                        emit: () => {}
                    };
                }

                try {
                    socketUpload = io(uploadUrl, {
                        transports: ['websocket'],
                        path: uploadPath
                    });
                } catch (e) {
                    socketUpload = {
                        on: () => {},
                        emit: () => {}
                    };
                }

                try {
                    socketVoice = io(voiceUrl, {
                        transports: ['websocket'],
                        path: voicePath
                    });
                } catch (e) {

                    socketVoice = {
                        on: () => {},
                        emit: () => {}
                    };
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
                    socketBackend = {
                        on: () => {},
                        emit: () => {}
                    };
                    socketMiddleware = {
                        on: () => {},
                        emit: () => {}
                    };
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
                        socketBackend.emit("web-event-register", crypterTransit.encrypt(JSON.stringify({
                            data: event,
                            webId: webId,
                            requestId: uid
                        })));
                        socketBackend.on("web-event-register-" + webId + "-" + uid, () => {});
                    }
                });
            }

            function triggerEventError(event) {
                rateLimiter(() => {
                    if (online) {
                        let uid = IDGenerator(20);
                        //console.log("EVENT ERROR "+event.type)
                        console.log("ERROR", {
                            data: event,
                            webId: webId,
                            requestId: uid
                        });
                        socketBackend.emit("web-event-register-error", crypterTransit.encrypt(JSON.stringify({
                            data: event,
                            webId: webId,
                            requestId: uid
                        })));
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
                                    options.push({
                                        type: response.next.data[i].type,
                                        text: response.next.data[i].text,
                                        data: response.next.data[i].data
                                    });
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
                                    options.push({
                                        type: response.next.data[i].type,
                                        text: response.next.data[i].text,
                                        data: response.next.data[i].data
                                    });
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
                            return reject({
                                status: "offline"
                            });
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
                            setLocalStorageData("t_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify({
                                lastTimestamp: lastTimestamp
                            })));

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
                                let output = {
                                    intents: {},
                                    entities: {},
                                    top: []
                                    //entity extraction
                                };
                                for (let option of user.previousOptions) {
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
                            let flowManagerData = await processFlowManager({
                                query: text,
                                intents: nluProcessedModel.intents,
                                topIntents: nluProcessedModel.top,
                                validation: validatedModel
                            });
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
                            return resolve({
                                stage: stageModel,
                                nlu: nluProcessedModel,
                                status: status
                            });
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
                                return reject({
                                    status: "offline"
                                });
                            }
                            let uid = IDGenerator(20);
                            let input = {
                                type: type,
                                validation: validatedModel,
                                prevStage: prevStage,
                                webId: webId,
                                nlu: nluProcessedModel,
                                text: text,
                                stage: stageModel,
                                requestId: uid,
                                projectId: projectId
                            };
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
                        let stopWords = {
                            "a": "",
                            "an": "",
                            "the": "",
                            "are": "is"
                        };
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
                                return reject({
                                    status: "offline"
                                });
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
                                            entitiesDetected.push({
                                                token: token,
                                                synonymGroup: value,
                                                entity: label
                                            });
                                            flag = true;
                                        }
                                        for (let index in entitiesDetected) {
                                            if (entitiesDetected[index].token && entitiesDetected[index].token.includes(token)) {
                                                flag = true;
                                                break;
                                            } else if (token && token.includes(entitiesDetected[index].token)) {
                                                entitiesDetected.push({
                                                    token: token,
                                                    synonymGroup: value,
                                                    entity: label
                                                });
                                                entitiesToBeDeletedIndices.push(index);
                                                flag = true;
                                                break;
                                            } else {
                                                entitiesDetected.push({
                                                    token: token,
                                                    synonymGroup: value,
                                                    entity: label
                                                });
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
                        return {
                            output: output,
                            text: text
                        };
                    }

                    function processNlu(text) {
                        return new Promise(async function (resolve, reject) {
                            try {

                                //output variable
                                let output = {
                                    intents: {},
                                    entities: {},
                                    top: []
                                };

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
                                        engine.defineConfig({
                                            fldWeights: {
                                                text: 1
                                            }
                                        });
                                        engine.definePrepTasks([nlp.string.lowerCase, nlp.string.removeExtraSpaces, nlp.string.tokenize0, nlp.tokens.propagateNegations, nlp.tokens.stem]);
                                        for (let label in shrinkedIndexedData) {
                                            if (shrinkedIndexedData[label].length > 0) {
                                                let text = shrinkedIndexedData[label].reduce((text, value) => {
                                                    return text + " " + value;
                                                });
                                                engine.addDoc({
                                                    text: text
                                                }, label);
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
                                    let runFunc = validator[expectation.type].bind({
                                        entities: entities,
                                        expectation: expectation,
                                        user: user
                                    });
                                    resolve((await runFunc(text)));
                                } else if (post && post.url) {
                                    let runFunc = validator["post"].bind({
                                        entities: entities,
                                        post: post
                                    });
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
                                        return reject({
                                            status: "offline"
                                        });
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
                                return resolve({
                                    response: await decideResponse(flow, data, status),
                                    status: status
                                });
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
                                                        buttons: [{
                                                            data: element.query,
                                                            text: "Read More"
                                                        }]
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
                                                    buttons: [{
                                                        data: "not relevant",
                                                        text: "Select"
                                                    }]
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
                                                $("#pm-data").animate({
                                                    scrollTop: $("#pm-buttonlock").height()
                                                }, '1000000');
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
                                return reject({
                                    status: "offline"
                                });
                            }
                            if (recognizer) {
                                recognizer.stop();
                                hideStop();
                                return resolve();
                            } else if (globalStream) {
                                streamStreaming = false;
                                socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({
                                    webId: webId
                                }));
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
                                socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({
                                    webId: webId
                                }));
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
                            socketVoice.emit('web-speech-to-text-binary-data', {
                                c: left16
                            });
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
                            socketVoice.emit('web-speech-to-text-stop', crypterTransit.encrypt({
                                webId: webId
                            }));
                        }
                    };
                    return new Promise(async (resolve, reject) => {
                        try {
                            if (!online) {
                                return reject({
                                    status: "offline"
                                });
                            }
                            socketVoice.emit('web-speech-to-text-start', crypterTransit.encrypt({
                                webId: webId
                            })); //init socket Google Speech Connection
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
                            return reject({
                                status: "offline"
                            });
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
                    $("#pm-data").animate({
                        scrollTop: $("#pm-buttonlock").height()
                    }, '1000000');

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
                    $("#pm-bxloadgif").animate({
                        "opacity": "hide",
                        bottom: "10"
                    }, 300);
                    $(".pm-bxChat").append(str);
                    $(".pm-bxLeftchat:last-child").animate({
                        "opacity": "show",
                        bottom: "10"
                    }, 800);
                    $(".pm-bxRightchat:last-child").animate({
                        "opacity": "show",
                        bottom: "10"
                    }, 800);
                    $(".pm-bxCheckOPtionPersist:last-child").hide();
                    $(".pm-bxCheckOPtionPersist:last-child").animate({
                        "opacity": "show",
                        bottom: "40"
                    }, 800);
                    chatArray.push(str);
                    // //console.log(chatArray);
                    setLocalStorageData(localSavePassPhrase, crypterLocal.encrypt(JSON.stringify(chatArray)));
                    setLocalStorageData("webId_" + localSavePassPhrase, crypterLocal.encrypt(JSON.stringify({
                        id: webId
                    })));
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
                            $("#pm-bxloadgif").animate({
                                "opacity": "hide",
                                bottom: "10"
                            }, 300);
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
                $(".pm-bxChat").animate({
                    scrollTop: $(document).height()
                }, "slow");
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
    }, {
        "sentence-tokenizer": 8,
        "string-similarity": 12,
        "string-tokenizer": 14,
        "wink-bm25-text-search": 16,
        "wink-nlp-utils": 61
    }],
    3: [function (require, module, exports) {
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
    }, {
        "is-number": 4
    }],
    4: [function (require, module, exports) {
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
    }, {}],
    5: [function (require, module, exports) {
        'use strict';

        // modified from https://github.com/es-shims/es5-shim

        var has = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;
        var slice = Array.prototype.slice;
        var isArgs = require('./isArguments');
        var isEnumerable = Object.prototype.propertyIsEnumerable;
        var hasDontEnumBug = !isEnumerable.call({
            toString: null
        }, 'toString');
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
    }, {
        "./isArguments": 6
    }],
    6: [function (require, module, exports) {
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
    }, {}],
    7: [function (require, module, exports) {
        'use strict';

        module.exports = function (obj) {
            var keys = Object.keys(obj);
            var ret = [];

            for (var i = 0; i < keys.length; i++) {
                ret.push(obj[keys[i]]);
            }

            return ret;
        };
    }, {}],
    8: [function (require, module, exports) {
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
    }, {
        "debug": 9
    }],
    9: [function (require, module, exports) {
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

            const {
                formatters
            } = module.exports;

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
    }, {
        "./common": 10,
        "_process": 1
    }],
    10: [function (require, module, exports) {

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
    }, {
        "ms": 11
    }],
    11: [function (require, module, exports) {
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
    }, {}],
    12: [function (require, module, exports) {
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
            const ratings = targetStrings.map(target => ({
                target,
                rating: compareTwoStrings(mainString, target)
            }));
            const bestMatch = Array.from(ratings).sort((a, b) => b.rating - a.rating)[0];
            return {
                ratings,
                bestMatch
            };
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
    }, {}],
    13: [function (require, module, exports) {
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
    }, {}],
    14: [function (require, module, exports) {
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
                    if (postionInfo) value = {
                        value: value,
                        position: position
                    };

                    if (is(r[name], 'Array')) return r[name].push(value);
                    if (is(r[name], 'String')) return r[name] = [value].concat(r[name] || []).reverse();
                    if (is(r[name], 'Object')) return r[name] = _.assign(value, r[name]);

                    r[name] = r[name] || [];
                    r[name].push(value);
                });

                r._source = _input;

                return simplify(r);

                function simplify(r) {
                    for (var key in r)
                        if (is(r[key], 'Array') && r[key].length == 1) r[key] = r[key][0];

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
    }, {
        "array-last": 3,
        "object-assign": 13,
        "object-keys": 5,
        "object-values": 7,
        "uniq": 15
    }],
    15: [function (require, module, exports) {
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
    }, {}],
    16: [function (require, module, exports) {
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
                    {},
                    [],
                    []
                ]);
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
    }, {
        "wink-helpers": 17
    }],
    17: [function (require, module, exports) {
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
            return a.reduce(productReducer, [
                []
            ]);
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
    }, {}],
    18: [function (require, module, exports) {
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
        contractions['can\'t'] = [{
            value: 'ca',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['CAN\'T'] = [{
            value: 'CA',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Can\'t'] = [{
            value: 'Ca',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['Couldn\'t'] = [{
            value: 'could',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['COULDN\'T'] = [{
            value: 'COULD',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Couldn\'t'] = [{
            value: 'Could',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['don\'t'] = [{
            value: 'do',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['DON\'T'] = [{
            value: 'DO',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Don\'t'] = [{
            value: 'Do',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['doesn\'t'] = [{
            value: 'does',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['DOESN\'T'] = [{
            value: 'DOES',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Doesn\'t'] = [{
            value: 'Does',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['didn\'t'] = [{
            value: 'did',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['DIDN\'T'] = [{
            value: 'DID',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Didn\'t'] = [{
            value: 'Did',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['hadn\'t'] = [{
            value: 'had',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['HADN\'T'] = [{
            value: 'HAD',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Hadn\'t'] = [{
            value: 'Had',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['mayn\'t'] = [{
            value: 'may',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['MAYN\'T'] = [{
            value: 'MAY',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Mayn\'t'] = [{
            value: 'May',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['mightn\'t'] = [{
            value: 'might',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['MIGHTN\'T'] = [{
            value: 'MIGHT',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Mightn\'t'] = [{
            value: 'Might',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['mustn\'t'] = [{
            value: 'must',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['MUSTN\'T'] = [{
            value: 'MUST',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Mustn\'t'] = [{
            value: 'Must',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['needn\'t'] = [{
            value: 'need',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['NEEDN\'T'] = [{
            value: 'NEED',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Needn\'t'] = [{
            value: 'Need',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['oughtn\'t'] = [{
            value: 'ought',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['OUGHTN\'T'] = [{
            value: 'OUGHT',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Oughtn\'t'] = [{
            value: 'Ought',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['shan\'t'] = [{
            value: 'sha',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['SHAN\'T'] = [{
            value: 'SHA',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Shan\'t'] = [{
            value: 'Sha',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['shouldn\'t'] = [{
            value: 'should',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['SHOULDN\'T'] = [{
            value: 'SHOULD',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Shouldn\'t'] = [{
            value: 'Should',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['won\'t'] = [{
            value: 'wo',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['WON\'T'] = [{
            value: 'WO',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Won\'t'] = [{
            value: 'Wo',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['wouldn\'t'] = [{
            value: 'would',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['WOULDN\'T'] = [{
            value: 'WOULD',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Wouldn\'t'] = [{
            value: 'Would',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['ain\'t'] = [{
            value: 'ai',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['AIN\'T'] = [{
            value: 'AI',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Ain\'t'] = [{
            value: 'Ai',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['aren\'t'] = [{
            value: 'are',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['AREN\'T'] = [{
            value: 'ARE',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Aren\'t'] = [{
            value: 'Are',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['isn\'t'] = [{
            value: 'is',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['ISN\'T'] = [{
            value: 'IS',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Isn\'t'] = [{
            value: 'Is',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['wasn\'t'] = [{
            value: 'was',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['WASN\'T'] = [{
            value: 'WAS',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Wasn\'t'] = [{
            value: 'Was',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['weren\'t'] = [{
            value: 'were',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['WEREN\'T'] = [{
            value: 'WERE',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Weren\'t'] = [{
            value: 'Were',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['haven\'t'] = [{
            value: 'have',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['HAVEN\'T'] = [{
            value: 'HAVE',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Haven\'t'] = [{
            value: 'Have',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['hasn\'t'] = [{
            value: 'has',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['HASN\'T'] = [{
            value: 'HAS',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Hasn\'t'] = [{
            value: 'Has',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        contractions['daren\'t'] = [{
            value: 'dare',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];
        contractions['DAREN\'T'] = [{
            value: 'DARE',
            tag: word
        }, {
            value: 'N\'T',
            tag: word
        }];
        contractions['Daren\'t'] = [{
            value: 'Dare',
            tag: word
        }, {
            value: 'n\'t',
            tag: word
        }];

        // Pronouns like I, you, they, we, she, and he.
        contractions['i\'m'] = [{
            value: 'i',
            tag: word
        }, {
            value: '\'m',
            tag: word
        }];
        contractions['I\'M'] = [{
            value: 'I',
            tag: word
        }, {
            value: '\'M',
            tag: word
        }];
        contractions['I\'m'] = [{
            value: 'I',
            tag: word
        }, {
            value: '\'m',
            tag: word
        }];

        contractions['i\'ve'] = [{
            value: 'i',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['I\'VE'] = [{
            value: 'I',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['I\'ve'] = [{
            value: 'I',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['i\'d'] = [{
            value: 'i',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['I\'D'] = [{
            value: 'I',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['I\'d'] = [{
            value: 'I',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['i\'ll'] = [{
            value: 'i',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['I\'LL'] = [{
            value: 'I',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['I\'ll'] = [{
            value: 'I',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['you\'ve'] = [{
            value: 'you',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['YOU\'VE'] = [{
            value: 'YOU',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['You\'ve'] = [{
            value: 'You',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['you\'d'] = [{
            value: 'you',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['YOU\'D'] = [{
            value: 'YOU',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['You\'d'] = [{
            value: 'You',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['you\'ll'] = [{
            value: 'you',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['YOU\'LL'] = [{
            value: 'YOU',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['You\'ll'] = [{
            value: 'You',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        // they - 've, 'd, 'll, 're
        contractions['they\'ve'] = [{
            value: 'they',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['THEY\'VE'] = [{
            value: 'THEY',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['They\'ve'] = [{
            value: 'They',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['they\'d'] = [{
            value: 'they',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['THEY\'D'] = [{
            value: 'THEY',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['They\'d'] = [{
            value: 'They',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['they\'ll'] = [{
            value: 'they',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['THEY\'LL'] = [{
            value: 'THEY',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['They\'ll'] = [{
            value: 'They',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['they\'re'] = [{
            value: 'they',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['THEY\'RE'] = [{
            value: 'THEY',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['They\'re'] = [{
            value: 'They',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['we\'ve'] = [{
            value: 'we',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['WE\'VE'] = [{
            value: 'WE',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['We\'ve'] = [{
            value: 'We',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['we\'d'] = [{
            value: 'we',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['WE\'D'] = [{
            value: 'WE',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['We\'d'] = [{
            value: 'We',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['we\'ll'] = [{
            value: 'we',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['WE\'LL'] = [{
            value: 'WE',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['We\'ll'] = [{
            value: 'We',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['we\'re'] = [{
            value: 'we',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['WE\'RE'] = [{
            value: 'WE',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['We\'re'] = [{
            value: 'We',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['she\'d'] = [{
            value: 'she',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['SHE\'D'] = [{
            value: 'SHE',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['She\'d'] = [{
            value: 'She',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['she\'ll'] = [{
            value: 'she',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['SHE\'LL'] = [{
            value: 'SHE',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['She\'ll'] = [{
            value: 'She',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['she\'s'] = [{
            value: 'she',
            tag: word
        }, {
            value: '\'s',
            tag: word
        }];
        contractions['SHE\'S'] = [{
            value: 'SHE',
            tag: word
        }, {
            value: '\'S',
            tag: word
        }];
        contractions['She\'s'] = [{
            value: 'She',
            tag: word
        }, {
            value: '\'s',
            tag: word
        }];

        contractions['he\'d'] = [{
            value: 'he',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['HE\'D'] = [{
            value: 'HE',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['He\'d'] = [{
            value: 'He',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['he\'ll'] = [{
            value: 'he',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['HE\'LL'] = [{
            value: 'HE',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['He\'ll'] = [{
            value: 'He',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['he\'s'] = [{
            value: 'he',
            tag: word
        }, {
            value: '\'s',
            tag: word
        }];
        contractions['HE\'S'] = [{
            value: 'HE',
            tag: word
        }, {
            value: '\'S',
            tag: word
        }];
        contractions['He\'s'] = [{
            value: 'He',
            tag: word
        }, {
            value: '\'s',
            tag: word
        }];

        contractions['it\'d'] = [{
            value: 'it',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['IT\'D'] = [{
            value: 'IT',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['It\'d'] = [{
            value: 'It',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['it\'ll'] = [{
            value: 'it',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['IT\'LL'] = [{
            value: 'IT',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['It\'ll'] = [{
            value: 'It',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['it\'s'] = [{
            value: 'it',
            tag: word
        }, {
            value: '\'s',
            tag: word
        }];
        contractions['IT\'S'] = [{
            value: 'IT',
            tag: word
        }, {
            value: '\'S',
            tag: word
        }];
        contractions['It\'s'] = [{
            value: 'It',
            tag: word
        }, {
            value: '\'s',
            tag: word
        }];

        // Wh Pronouns - what, who, when, where, why, how, there, that
        contractions['what\'ve'] = [{
            value: 'what',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['WHAT\'VE'] = [{
            value: 'WHAT',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['What\'ve'] = [{
            value: 'What',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['what\'d'] = [{
            value: 'what',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['WHAT\'D'] = [{
            value: 'WHAT',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['What\'d'] = [{
            value: 'What',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['what\'ll'] = [{
            value: 'what',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['WHAT\'LL'] = [{
            value: 'WHAT',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['What\'ll'] = [{
            value: 'What',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['what\'re'] = [{
            value: 'what',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['WHAT\'RE'] = [{
            value: 'WHAT',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['What\'re'] = [{
            value: 'What',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['who\'ve'] = [{
            value: 'who',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['WHO\'VE'] = [{
            value: 'WHO',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['Who\'ve'] = [{
            value: 'Who',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['who\'d'] = [{
            value: 'who',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['WHO\'D'] = [{
            value: 'WHO',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['Who\'d'] = [{
            value: 'Who',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['who\'ll'] = [{
            value: 'who',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['WHO\'LL'] = [{
            value: 'WHO',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['Who\'ll'] = [{
            value: 'Who',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['who\'re'] = [{
            value: 'who',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['WHO\'RE'] = [{
            value: 'WHO',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['Who\'re'] = [{
            value: 'Who',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['when\'ve'] = [{
            value: 'when',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['WHEN\'VE'] = [{
            value: 'WHEN',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['When\'ve'] = [{
            value: 'When',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['when\'d'] = [{
            value: 'when',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['WHEN\'D'] = [{
            value: 'WHEN',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['When\'d'] = [{
            value: 'When',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['when\'ll'] = [{
            value: 'when',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['WHEN\'LL'] = [{
            value: 'WHEN',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['When\'ll'] = [{
            value: 'When',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['when\'re'] = [{
            value: 'when',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['WHEN\'RE'] = [{
            value: 'WHEN',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['When\'re'] = [{
            value: 'When',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['where\'ve'] = [{
            value: 'where',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['WHERE\'VE'] = [{
            value: 'WHERE',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['Where\'ve'] = [{
            value: 'Where',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['where\'d'] = [{
            value: 'where',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['WHERE\'D'] = [{
            value: 'WHERE',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['Where\'d'] = [{
            value: 'Where',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['where\'ll'] = [{
            value: 'where',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['WHERE\'LL'] = [{
            value: 'WHERE',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['Where\'ll'] = [{
            value: 'Where',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['where\'re'] = [{
            value: 'where',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['WHERE\'RE'] = [{
            value: 'WHERE',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['Where\'re'] = [{
            value: 'Where',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['why\'ve'] = [{
            value: 'why',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['WHY\'VE'] = [{
            value: 'WHY',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['Why\'ve'] = [{
            value: 'Why',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['why\'d'] = [{
            value: 'why',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['WHY\'D'] = [{
            value: 'WHY',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['Why\'d'] = [{
            value: 'Why',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['why\'ll'] = [{
            value: 'why',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['WHY\'LL'] = [{
            value: 'WHY',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['Why\'ll'] = [{
            value: 'Why',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['why\'re'] = [{
            value: 'why',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['WHY\'RE'] = [{
            value: 'WHY',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['Why\'re'] = [{
            value: 'Why',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['how\'ve'] = [{
            value: 'how',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['HOW\'VE'] = [{
            value: 'HOW',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['How\'ve'] = [{
            value: 'How',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['how\'d'] = [{
            value: 'how',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['HOW\'D'] = [{
            value: 'HOW',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['How\'d'] = [{
            value: 'How',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['how\'ll'] = [{
            value: 'how',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['HOW\'LL'] = [{
            value: 'HOW',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['How\'ll'] = [{
            value: 'How',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['how\'re'] = [{
            value: 'how',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['HOW\'RE'] = [{
            value: 'HOW',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['How\'re'] = [{
            value: 'How',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['there\'ve'] = [{
            value: 'there',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['THERE\'VE'] = [{
            value: 'THERE',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['There\'ve'] = [{
            value: 'There',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['there\'d'] = [{
            value: 'there',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['THERE\'D'] = [{
            value: 'THERE',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['There\'d'] = [{
            value: 'There',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['there\'ll'] = [{
            value: 'there',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['THERE\'LL'] = [{
            value: 'THERE',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['There\'ll'] = [{
            value: 'There',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['there\'re'] = [{
            value: 'there',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['THERE\'RE'] = [{
            value: 'THERE',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['There\'re'] = [{
            value: 'There',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        contractions['that\'ve'] = [{
            value: 'that',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];
        contractions['THAT\'VE'] = [{
            value: 'THAT',
            tag: word
        }, {
            value: '\'VE',
            tag: word
        }];
        contractions['That\'ve'] = [{
            value: 'That',
            tag: word
        }, {
            value: '\'ve',
            tag: word
        }];

        contractions['that\'d'] = [{
            value: 'that',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];
        contractions['THAT\'D'] = [{
            value: 'THAT',
            tag: word
        }, {
            value: '\'D',
            tag: word
        }];
        contractions['That\'d'] = [{
            value: 'That',
            tag: word
        }, {
            value: '\'d',
            tag: word
        }];

        contractions['that\'ll'] = [{
            value: 'that',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];
        contractions['THAT\'LL'] = [{
            value: 'THAT',
            tag: word
        }, {
            value: '\'LL',
            tag: word
        }];
        contractions['That\'ll'] = [{
            value: 'That',
            tag: word
        }, {
            value: '\'ll',
            tag: word
        }];

        contractions['that\'re'] = [{
            value: 'that',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];
        contractions['THAT\'RE'] = [{
            value: 'THAT',
            tag: word
        }, {
            value: '\'RE',
            tag: word
        }];
        contractions['That\'re'] = [{
            value: 'That',
            tag: word
        }, {
            value: '\'re',
            tag: word
        }];

        // Let us!
        contractions['let\'s'] = [{
            value: 'let',
            tag: word
        }, {
            value: '\'s',
            tag: word
        }];
        contractions['LET\'S'] = [{
            value: 'THAT',
            tag: word
        }, {
            value: '\'S',
            tag: word
        }];
        contractions['Let\'s'] = [{
            value: 'Let',
            tag: word
        }, {
            value: '\'s',
            lemma: 'us'
        }];

        module.exports = contractions;
    }, {}],
    19: [function (require, module, exports) {
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
        var rgxsMaster = [{
            regex: rgxQuotedPhrase,
            category: 'quoted_phrase'
        }, {
            regex: rgxURL,
            category: 'url'
        }, {
            regex: rgxEmail,
            category: 'email'
        }, {
            regex: rgxMention,
            category: 'mention'
        }, {
            regex: rgxHashtagL1,
            category: 'hashtag'
        }, {
            regex: rgxHashtagDV,
            category: 'hashtag'
        }, {
            regex: rgxEmoji,
            category: 'emoji'
        }, {
            regex: rgxEmoticon,
            category: 'emoticon'
        }, {
            regex: rgxTime,
            category: 'time'
        }, {
            regex: rgxOrdinalL1,
            category: 'ordinal'
        }, {
            regex: rgxNumberL1,
            category: 'number'
        }, {
            regex: rgxNumberDV,
            category: 'number'
        }, {
            regex: rgxCurrency,
            category: 'currency'
        }, {
            regex: rgxWordL1,
            category: 'word'
        }, {
            regex: rgxWordDV,
            category: 'word'
        }, {
            regex: rgxPunctuation,
            category: 'punctuation'
        }, {
            regex: rgxSymbol,
            category: 'symbol'
        }];

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
                        tokens.push({
                            value: matches[1],
                            tag: 'word'
                        });
                        tokens.push({
                            value: matches[2],
                            tag: 'word'
                        });
                    } else {
                        matches = word.match(rgxPosPlural);
                        if (matches) {
                            tokens.push({
                                value: matches[1],
                                tag: 'word'
                            });
                            tokens.push({
                                value: matches[2],
                                tag: 'word'
                            });
                        } else tokens.push({
                            value: word,
                            tag: 'word'
                        });
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
                                tokens.push({
                                    value: aword,
                                    tag: tag
                                });
                            }
                        } else tokens.push({
                            value: matches[k],
                            tag: tag
                        });
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
                        finalTokens.push({
                            value: tkn.trim(),
                            tag: 'alien'
                        });
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

                rgxs.unshift({
                    regex: regex,
                    category: tag
                });
            }; // addRegex()

            methods.defineConfig = defineConfig;
            methods.tokenize = tokenize;
            methods.getTokensFP = getTokensFP;
            methods.addTag = addTag;
            methods.addRegex = addRegex;
            return methods;
        };

        module.exports = tokenizer;
    }, {
        "./eng-contractions.js": 18
    }],
    20: [function (require, module, exports) {
        module.exports = ["i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "would", "should", "could", "ought", "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've", "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll", "we'll", "they'll", "let's", "that's", "who's", "what's", "here's", "there's", "when's", "where's", "why's", "how's", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "only", "own", "same", "so", "than", "too", "very"];
    }, {}],
    21: [function (require, module, exports) {
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
    }, {}],
    22: [function (require, module, exports) {
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
    }, {}],
    23: [function (require, module, exports) {
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
    }, {}],
    24: [function (require, module, exports) {
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
    }, {}],
    25: [function (require, module, exports) {
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
    }, {}],
    26: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    27: [function (require, module, exports) {
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
    }, {}],
    28: [function (require, module, exports) {
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
    }, {
        "./helper-return-quoted-text-extractor.js": 22,
        "wink-helpers": 17
    }],
    29: [function (require, module, exports) {
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
    }, {}],
    30: [function (require, module, exports) {
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
    }, {
        "./name_cleaner_regexes.js": 24,
        "./util_regexes.js": 60
    }],
    31: [function (require, module, exports) {
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
    }, {
        "./string-trim.js": 49,
        "./util_regexes.js": 60
    }],
    32: [function (require, module, exports) {
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
    }, {}],
    33: [function (require, module, exports) {
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
    }, {}],
    34: [function (require, module, exports) {
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
    }, {}],
    35: [function (require, module, exports) {
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
    }, {
        "./phonetize_regexes.js": 25
    }],
    36: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    37: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    38: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    39: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    40: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    41: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    42: [function (require, module, exports) {
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
    }, {}],
    43: [function (require, module, exports) {
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
    }, {}],
    44: [function (require, module, exports) {
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
    }, {}],
    45: [function (require, module, exports) {
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
            A: 0,
            E: 0,
            I: 0,
            O: 0,
            U: 0,
            Y: 0,
            B: 1,
            F: 1,
            P: 1,
            V: 1,
            C: 2,
            G: 2,
            J: 2,
            K: 2,
            Q: 2,
            S: 2,
            X: 2,
            Z: 2,
            D: 3,
            T: 3,
            L: 4,
            M: 5,
            N: 5,
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
    }, {}],
    46: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    47: [function (require, module, exports) {
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
    }, {
        "wink-tokenizer": 19
    }],
    48: [function (require, module, exports) {
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
    }, {
        "./string-amplify-not-elision.js": 26,
        "./string-remove-elisions.js": 36,
        "./util_regexes.js": 60
    }],
    49: [function (require, module, exports) {
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
    }, {}],
    50: [function (require, module, exports) {
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
    }, {}],
    51: [function (require, module, exports) {
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
    }, {}],
    52: [function (require, module, exports) {
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
    }, {}],
    53: [function (require, module, exports) {
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
    }, {}],
    54: [function (require, module, exports) {
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
    }, {
        "./string-phonetize.js": 35
    }],
    55: [function (require, module, exports) {
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
    }, {
        "./util_regexes.js": 60
    }],
    56: [function (require, module, exports) {
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
    }, {
        "./dictionaries/stop_words.json": 20,
        "./helper-return-words-filter.js": 23
    }],
    57: [function (require, module, exports) {
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
    }, {
        "./string-soundex.js": 45
    }],
    58: [function (require, module, exports) {
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
    }, {}],
    59: [function (require, module, exports) {
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
    }, {
        "wink-porter2-stemmer": 62
    }],
    60: [function (require, module, exports) {
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
    }, {}],
    61: [function (require, module, exports) {
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
    }, {
        "./helper-return-indexer.js": 21,
        "./helper-return-quoted-text-extractor.js": 22,
        "./helper-return-words-filter.js": 23,
        "./string-amplify-not-elision": 26,
        "./string-bong.js": 27,
        "./string-compose-corpus.js": 28,
        "./string-edge-ngrams.js": 29,
        "./string-extract-persons-name.js": 30,
        "./string-extract-run-of-capital-words.js": 31,
        "./string-lower-case.js": 32,
        "./string-marker.js": 33,
        "./string-ngram.js": 34,
        "./string-phonetize.js": 35,
        "./string-remove-elisions.js": 36,
        "./string-remove-extra-spaces.js": 37,
        "./string-remove-html-tags.js": 38,
        "./string-remove-punctuations.js": 39,
        "./string-remove-spl-chars.js": 40,
        "./string-retain-alpha-nums.js": 41,
        "./string-sentences.js": 42,
        "./string-soc.js": 43,
        "./string-song.js": 44,
        "./string-soundex.js": 45,
        "./string-split-elisions.js": 46,
        "./string-tokenize.js": 47,
        "./string-tokenize0.js": 48,
        "./string-trim.js": 49,
        "./string-upper-case.js": 50,
        "./tokens-append-bigrams.js": 51,
        "./tokens-bigrams.js": 52,
        "./tokens-bow.js": 53,
        "./tokens-phonetize.js": 54,
        "./tokens-propagate-negations.js": 55,
        "./tokens-remove-words.js": 56,
        "./tokens-soundex.js": 57,
        "./tokens-sow.js": 58,
        "./tokens-stem.js": 59,
        "wink-porter2-stemmer": 62
    }],
    62: [function (require, module, exports) {
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
            {
                rgx: /ational$/,
                replacement: 'ate'
            }, {
                rgx: /ization$/,
                replacement: 'ize'
            }, {
                rgx: /fulness$/,
                replacement: 'ful'
            }, {
                rgx: /ousness$/,
                replacement: 'ous'
            }, {
                rgx: /iveness$/,
                replacement: 'ive'
            },
            // Length 6.
            {
                rgx: /tional$/,
                replacement: 'tion'
            }, {
                rgx: /biliti$/,
                replacement: 'ble'
            }, {
                rgx: /lessli$/,
                replacement: 'less'
            },
            // Length 5.
            {
                rgx: /iviti$/,
                replacement: 'ive'
            }, {
                rgx: /ousli$/,
                replacement: 'ous'
            }, {
                rgx: /ation$/,
                replacement: 'ate'
            }, {
                rgx: /entli$/,
                replacement: 'ent'
            }, {
                rgx: /(.*)(alism|aliti)$/,
                replacement: '$1al'
            }, {
                rgx: /fulli$/,
                replacement: 'ful'
            },
            // Length 4.
            {
                rgx: /alli$/,
                replacement: 'al'
            }, {
                rgx: /ator$/,
                replacement: 'ate'
            }, {
                rgx: /izer$/,
                replacement: 'ize'
            }, {
                rgx: /enci$/,
                replacement: 'ence'
            }, {
                rgx: /anci$/,
                replacement: 'ance'
            }, {
                rgx: /abli$/,
                replacement: 'able'
            },
            // Length 3.
            {
                rgx: /bli$/,
                replacement: 'ble'
            }, {
                rgx: /(.*)(l)(ogi)$/,
                replacement: '$1$2og'
            },
            // Length 2.
            {
                rgx: /(.*)([cdeghkmnrt])(li)$/,
                replacement: '$1$2'
            }
        ];
        // Definition for Step III suffixes; once again spot the longest one first!
        var rgxSFXstep3 = /(ational|tional|alize|icate|iciti|ative|ical|ness|ful)$/;
        var rgxSFXstep3WithReplacements = [{
            rgx: /ational$/,
            replacement: 'ate'
        }, {
            rgx: /tional$/,
            replacement: 'tion'
        }, {
            rgx: /alize$/,
            replacement: 'al'
        }, {
            rgx: /(.*)(icate|iciti|ical)$/,
            replacement: '$1ic'
        }, {
            rgx: /(ness|ful)$/,
            replacement: ''
        }];
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
            if (!m1) return {
                r1: '',
                r2: ''
            };
            m1 = m1[1].slice(1);
            // Handle exceptions here to prevent over stemming.
            m1 = /^(gener|commun|arsen)/.test(s) ? s.replace(/^(gener|commun|arsen)(.*)/, '$2') : m1;
            m2 = rgxRegions.exec(m1);
            if (!m2) return {
                r1: m1,
                r2: ''
            };
            m2 = m2[1].slice(1);
            return {
                r1: m1,
                r2: m2
            };
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