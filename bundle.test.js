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
            // let passphrase = 'e801e756-a3c3-3543-bc13-7781d10a8e8a';
            // let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
            // let intents={"ct":"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","iv":"de5631cb91a7ad431975b99f2b91a1fc","s":"bf8586493eee9233"};
            // let entities={"ct":"UUY+81IO6gRTUqE7qf+lRzDcJVbDwUNhNNhvyrFsFBAYJ9CfwmlZy9YGs83L1TyALQXQejcn6sz/jiO3EW/BGOX/HGG6Xph8qmyeHqItGG0VQy3SsNHvwaFG5jH56F4IM0caYDQr+I0SSRZHb9LlVAwILcBAg9kCTUeRHygcnkqt7SaP0w2yorx0I5mbVXYRP32P8XJB8D86dqkJeDeqaKPGzW6eGR4tdGygCGnyOauVcH+KmR3s2PwkswN1CetHvEWyiwiCWvrEYEGhQjsDjUkvliCHoxF55KDS++ozlAJAE1nZnJmBrJARx9DFfscNzVGwFOsvcslXbWI/QSmnvSPPRNejJvNk7cfcFlxL9SHa46aUkmLb0QJ0/XtUJLqoYm2YAmozWWfEghzWk7CKzZxn3SdUPhKhm8AmqNTYn9yBOLEcbQulkDVaaD4H2NDAoMUF3jydcb43nWK5gZE41cFD2f6iioWfNh+Z2P4u2pyT/sPl4M8RBIgVHvUOG9RCmLY5DUpypmWy8h49vWlmbNTijjVz6+aosw2wyv3X04jHKIGpDlNJY9N4fq2FKRtlwllVToHk0XYTJoGNGLANY433qUSKPN10uT3ykyQMZ67rNDdXrdfTtZqixLZht5ZIUJoI0fX1mEQ/4Bz+lJcfqW+FsGADSOH9v1cTBUhsOoIPo8dwwHFQiYbZWM5rjRcvr8NRFmJpyRrcFLxMmWkgE6F+gIujnmxzL0oz/OPugv68nClowMsJAvcpmN2TgoKl741scFS7ISMR1LkndQRrG5tydLILjRR71DWwLmGD4SiRP5aJbZ/wnFhZW/G264aN/dYqEiicUUaCuF4nsC+UGPHrRF/u89S+ewwM+91bmgBpRK/H35FGR9pp59SBtznKBSYjkV4tRqlat4SUeCCKzkHeLvlBc38xrgGIoPGxSxmtaonGB1M9+4oTUiVq0xTlxbt1tqOyCBrCYjw9GZ1OxpleOi9nqqGnjSIPgBH4IHYQuATaFxKj7a4vWOMrXwZH6Wfb22a0IWl1NZeZ/b/mL/yiZJx8coYdITmZ8kVHSnqaeNwJ782s/Svhk5fdgfcYZi9MkeIeLI9d3lCv6CwwbnHa1ANLmnYHUfnW9GL64d+f9jZHeQILzsQZDwyj+wcfOVRsh2+xgBWevwCIBAP7sk3qqkG5npiuJOEEAPGhskNdYtsWH8akTbJfH3GOCBL4PetbB6yZZpgl4lu+zxCf8hux1YICt6DRiXP0orshxrdpnpRT+H4yPbykUdzcWt564v9RcVdj9xAx60aoHpJvNx9sH2Ywh6ucFJ1FPrABZNbO/4apS6MuA16KEwMkO9fUMAI8groK4ojjX5oxMZJtG7fMy/QQV7Yn7WOpfnvI7B5F0iriebgDV/uctjVQWowWsdH4TSkrmSCY85/nTuo/u6BTGXtIhKbfGMS0QPoo3zRA7cVpdEMdGpY93hCm4fIzjI/r/cCdHsr7oNu4EKsPlVxsorXFDE1CNisOijPOriRZxCfMmUroLGxe9xKeuozhIDhkrNv1G/3yF7FOiO01U4JL0jJW1dyRXBO8jvJpBmTi2Bzd9yOfRIktDpQWfXmsZxYP+NkI4qPQWKq2A2iZzT7+S/Aa6qca02Q/4AC71EkqGCUQryiBNM+U1s9MWmFusml4va6Vi8YG16AGC4yRJ+WdZFk4Uu7FZJcVfya230GGou7Ua7tNmi4HP66couMutdldEpdRO8oHopXg2IjnX9OVARS94cWwj8B94WrEyHzXKtU7VX3hS0F1QgrWAThGgqrjlBqNCHW0nXWoKaFrMPscXbdkuOA7fam3nFpf8b92AAo2P1J2IHvsBOdOlM3uZgqj3gr8JfDIHMI7LchKhlw1l/hUdMRaUToaNaWMT9fyIy6s+n65fpQw+FRWA4sKchSO19wyOJfNLmv+nDa4UzSZG+Y+7aSaVne+Zoe2I7T+IjERhTvtlHAcKfmlfTY7tjn3NqYQ4fEiMU/yClz4ruU1WHqA9HXUUkI0CV/nEIhw36f7eEVcg1e+500phV0jZ3Gb43dOng57o5v1dxlS6QufXyKRYHG5JH9Tw9xWaj5dYE6rfYuK2ilS3AkaPnhOzGBxdomGbStcgUU43MAe0ol0J929GSiOSuhgg6dGFyqMP5kLaBAr7byXrfX9zeX2/ykBwb4VZCnP0FQvt+i1OQXKEf1JziJFZ4dzgJxM6OAqQSZJNcddN/Fj3ziKhm5uP7jHiTm+YAeyRl69P8sHZnhr9gzMZC39uTu0LjwfkZnQJnbWJA19ADB6yn6Fd9qqAPX7jLP26JKXCJpdBD34Qo51buMhOAdEDshvu8RMv3WU5fXQexqm8yfy9cbVmo3naA2SGaAaOvAJQtMplbd7DKQld8kBXUlzTS7k/+gLZ6/PELylaG+/fkK7RHuQ0mzUpEDxTRSDIOcW6LuhCspNfhD+B4re9j6smfPO6zpROU9q84P/GmbWBLas+cxZyvFd8xv95kFKZvav3AYZGa25zeaFBapb4ONNBDPMmNqHhxGjV0fyhyg797aRHxp2skhdQohxO+O/negvjGRpE/s5XKLluZkLPLIVyEFJExsDWpMYlSlr5cJTkwp5XFPKBhG740yA/TSDKpfZAgLmr+ExMtQvmzPwPC6ZGskrEbfdeDIpB29TvbjL755vfnXl3YW/XfHUKL7Xl9YGdG55+LkH08Iv9tx/NoIC8VF5lf+CV8+Xu98HJvTxTiIvpAhlW6pbq4FU+o7y7FLsiTNl5I7UdJvQjudAMDqeHqfkXCz6yQmel92Y7LAyO57icw/n1aZ2DQcIZWUEv7BwzSvwdopVJmLsI8UZ/Vd7OZEfPW/vxrsyWNdd0WJt4gtb0VI9oqEi","iv":"f9f9471eb530ba6889551e01c216d8b4","s":"4fea7b6fbcd9c65e"};
            // let flows={"ct":"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","iv":"95896d3aa804dc570a3a5ee77e8706df","s":"53478c32590c1060"};

            // let checkUrl='https://parramato.com/check';
            // let modal=window.jubiModal;

            // let backendUrl='https://parramato.com'
            // let backendPath='/socket'

            // let middlewareUrl = 'https://development.jubi.ai/'
            // let middlewarePath = '/usaidWeb/socket'
            // let middlewareWebsocket = true
            // let middlewareSecurity = false

            // let uploadUrl = 'https://parramato.com'
            // let uploadPath = '/upload/socket'

            // let humanUrl = 'https://parramato.com'
            // let humanPath = '/human/socket'

            // let voiceUrl = 'https://parramato.com'
            // let voicePath = '/voice/socket'

            // let directMultiplier=0.8
            // let fallbackMultiplier = 0.6

            // let timeoutSeconds= 1200


            // let strictlyFlow=false;
            // let humanAssistSwitch=false;
            // let voiceEnabled=true;
            // let cookie=false;

            // let speechGenderBackend='FEMALE'
            // let speechLanguageCodeBackend='en-IN'

            // let projectId='Alpha Version_586886576888'
            // let attachmentUrl='https://parramato.com/bot-view/images/attachment.png'
            // let integrityPassPhrase='hbu8b23478gbuy2bcfy2cbcihsdcgUGUYUuy2bcfy2cbcihsdcYBEBIW'
            // let localSavePassPhrase='8rhfuahiuHFIJUHAFIWEHFOw98ehfu9HFjhE234jbhJHbjhbfjebkfewfewjhEUHFUIAlpha Version_586886576888'
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