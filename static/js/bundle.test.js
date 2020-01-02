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

            
    let passphrase = '8fbac514-34a5-3dd5-a37a-9881e894abf9';
    let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
    let intents={"ct":"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","iv":"6816ff8cc607109620c2d121f43e83df","s":"9d82f4214fa36f9c"};
    let entities={"ct":"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","iv":"23d30228d6b6e84696f949347be62c10","s":"5ecfb409416bed1b"};
    let flows={"ct":"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","iv":"3734871a89771e9df288ee2d8448369a","s":"97e352dad036d0b3"};

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
    let fallbackMultiplier = 0.3

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
                                data[i].text = data[i].text.replaceAll("|break|", "<br/>");
                                data[i].text = data[i].text.replaceAll("|br|", "<br/>");
                                html += '<p>' + data[i].text + '</p>';

                                // html += '<p>' + data[i].text.replaceAll("|break|", "\\n") + '</p>';

                                // response.text = response.text.replaceAll('|break|', '\\n');
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