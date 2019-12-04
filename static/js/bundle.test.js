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

    let passphrase = 'b0477b8a-6471-3e5d-909c-8cd5c7bf9faf';
    let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
    let intents={"ct":"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","iv":"013a4b37e3856ef1551107b054ced9a1","s":"3facf5aac45c0e82"};
    let entities={"ct":"y64/MB/EN7KrxwE86xyVkFWnajUauPjfsris2ogX7hpDh8t+PTLnqFT1r+lDW7JWlIyFLXWaDY6yIObAzxSNuiUinqaJdr/x8ZAGp5rE/i4/Q0knJMDlgJIcSmxLegSz0dG0rLwdfjXBULGFPKp7l1xmXF10NGylKFWeBKgBDBp23g2VdjvdYS7IeAQlxMNtUumougdYzQ9emkERiSQWmihYoobtP+tRuK+Bt8a86InuNIAeRIy3QIdskjCRgqesAFutM3HLm0c+X6omz6PJjpuP6h0BVASITTpOiiBjuoTP6UgNmPteLWBb0dVzjUEy","iv":"80d2d28916526b7a96d9a92d94dbd3a5","s":"aab08c5acd297878"};
    let flows={"ct":"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","iv":"53d1ae18d585d6986eec4d813b70f7b3","s":"5fb7066ea97a0fdc"};

    let checkUrl='https://parramato.com/check';
    let modal=window.jubiModal;

    let backendUrl='https://parramato.com'
    let backendPath='/socket'
    
    let middlewareUrl = 'https://development.jubi.ai/usaid'
    let middlewarePath = '/socket'
    let middlewareWebsocket = true
    let middlewareSecurity = false

    let uploadUrl = 'https://parramato.com'
    let uploadPath = '/upload/socket'

    let humanUrl = 'https://parramato.com'
    let humanPath = '/human/socket'

    let voiceUrl = 'https://parramato.com'
    let voicePath = '/voice/socket'

    let directMultiplier=1
    let fallbackMultiplier = 0.8

    let timeoutSeconds= 1200


    let strictlyFlow=true;
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

