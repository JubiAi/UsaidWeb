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

            
    let passphrase = '52ddaf02-be56-3134-b6c4-dd22d3530597';
    let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
    let intents={"ct":"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","iv":"28e45105330d65066fa6a8471290156f","s":"3370ff9791eaf788"};
    let entities={"ct":"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","iv":"474286c90b1a61a89ce91e6c57dea12c","s":"438aae0d60bcd47f"};
    let flows={"ct":"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","iv":"f958d4d7e33a399eb6f80cbe902afb75","s":"947a7cf84cc33dd2"};

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

                                // html += '<p>' + data[i].text.replaceAll("|br|", "<br/>") + '</p>';
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