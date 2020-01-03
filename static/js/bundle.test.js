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

            
    let passphrase = 'a54973c5-34d7-3c3e-8ff6-08007d966449';
    let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
    let intents={"ct":"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","iv":"9ba25f3255e0b2489cc7fef49b21a838","s":"c2dbc0506250ad6a"};
    let entities={"ct":"+rQr1UWJZNgpdRlb4ZZHiquErQFVvHpB8ik76Cu17JBiQLWj3Cu3BfqQlF1VEhg5UXuMNBRIpVFFbLlZlL18Lt4pdxkwt22pNPQ907TZWvJF3KDDB+O0QyzkDoOD114tZZlJ3PFIMCjdxj5OswF3iqAE+hn2vjoH9gWa3NNpFnMZMPiyXBTRVaTJfqSL9QY0s4bbFEvibt6vMklL2HYVrn/u4aJgC6gqGRmkfGjHCJLWWTpRnTQ6lLUu876zIS/vhha7vcwj9i5F1Nhrwv+CyRLY2qGGcMm5IC6sSDs8K1AsArY7IS0URF2UJi51moI1LK8+BolBA3owxUC5e4pQYXfG3e/YFr7NMhYtAkYC+fYgUKu5xQSOK/6XFxP7E/3pBEXQ3gT+joLHFNJ4iue/6VL2TU/J6sg83TpurxhC5HMc54oVQ9XP0/mGqjoqxYPGmML3v4lKU6VTsfLh+NzR0FXfSOaqDcsAwUOyM1xI/VCzT61ReVUq9YxhHlZF0ZN2+vRiiVV4F3bTBzz+x8A95qhgd9oBKcKK52S222rNwUTI1MttTecVByM6jFGGFr4lmGQR66PnyNEwbW2plt0DmCGuUwgwvnZdGjOxFByS++wuLsS+EI9sPNam5CCxwQUunQGmCUsAx6L3CqTWZS5HPjwN23IqcIbL+1IjMPQ8xBY3iUgEnRBbvm8Z4EjzwyNS+Fs0rq21DKH6YFOhQtz5LFW2MeaMWbNHI2hekkl0nLsZePwDhlUaTsjrtQVfA2udUCos9wpA4x+3RMvtwIiQRdt6ttqY+xUrpbQonjQZ9Phoa5RuJMzmnd4mVbH0VFmrigCcijOZg5uBUCaVEBkN8cQ7xH79HPW293C/utDdPH7Zl+YWDC092IS/lVEsktwYtl2dRvRp4a14GmL5eJvxpto5WoMz7w4/ujYgDOoVBUs+7tvK2yWdWoC525W0vVtDpnIDVBA/vMKBQmZh3ZGb9nW6muSfXhrpa7mcnROGakbTr90asi+qJ5t26D2OblYMgvm/DVun5g4EfvAZUWrSyah5hhj1L4ddGAF/S1TGVcBMl0nikr5XAJpGCFSMCpxsjdSG2vfsGhLAn8VmBxJsNLjLPKMUuuz9/pa3ACJ8pHMHKUmJZGGMB2JxHeuYrrxiyfGh9QcnoVS9vB50kgPP8hTWkdNIJUrWoMIUH1w2WyiOnpo3UjJc+F/S5ERtp9c94LQpG9sWnXATA0SHiGCetR+SYpCjleR2m4/D6GRHLyyb4omPpY4Kg0HVtXJxU8WFsVbMfMQE7kyZgNJAWAMUEfU6xiUWB9WUo/2HmNb9JQ6Aa/0Erf90f+pdVVLxgghFIJi5TVXfqxgB8ZahLdUphGth5URkakFpBQptMsFJeIAgalreN3nnrLQtq46eW9dWkXG73TTmCa812E7GQgzQf+8mkXJkUSYeK18Vjwy9vjOZLxd3tKPonZ8NRvc16KDEajxTyMe+aJ1croJoPcEXk0S1VOqOMDDgeWMSD6tcIUeeXVkyq1dOg6Kcij8fYZYl1hp9y8ZcOuwTS9HbR0R51+/0xGoD/IItsq6N9sStWFCRXD1RGnD6ilM9InQ4hfoLnU5azxHnTj5AZSiZBZQ6IeaHjVEWrKraNjzMfpvg2hXqBDGZx/vLoRFPbfbxPa+mJgx9K4tY5jp9Le9Zkcm6jxt5vffCb9ulIaob/hMlHaWNdQWNlt9mNpqocvJrPulFw490bs8YM0lZSpAotCHxBGCCgdiEnizyWWiwjs7BQybPeJX0CdTSezOtHCLyThi6+jPGorvm5AVj4q/0P7uq3rzOE7TnwObfo6I/6D8C75SfzKeLDhcJH0LX6alX/nYX/y6Mb0TzWACX8iSsfjnUzIYbrmF43OXxg0axYgMbucVO1Tu5FaCFopLdu4/tgstNDp4deixm3gtQfeKkLqRbwryhYQOhNrKG8BBaykjxrn1hRuVToORC0iaf7iyooJcndPIgGB77DQqrGVepnVUcj7B4NEQaGgzJNbYtJZ+qDpmGJORnv1pZQozJWzUgPprory3t2oqqQKde4XQ0tt4wCp7G5R/zkLbSosVk3ygSdL2mfLixsIOBuskM7XNe5/5JN7Mi3X0ZlY0nrDrp5Dw5D1LihPsilEeLax3tMMALAiXrwiemGR9O6lsZIcQl4ik73HC/6/fqsQRG8WqKC4zmMkujVuqQp4ADDYgrQCxxecFnOF6OxNEXjxh6iUEPhsOmfe37Jf/DNVsJSxicc4N2Op1lTa6950tnxdjbZI1tRpKqEKpin784Wc54BD/u154pnzOMH5Dw4deW4aAktec5PbyF7B0X2QpFnLFXAK0kn+etXbUUvrfnbvmNtouxMNznUIzoNOM1JZDQeGlqARcyK5DjeIhib++ejP2UxCLkW+l9wWBcL2xV1I9w+yPKuIh8vpFODaN4G6xoTpFo17qtbcdoFxqSf7KqMfRPAX/Uv1THOeE7zzh3CdbBqiL9dJw6ilfRcamM6DihY3heUl89TbZJfW2ohuSOZyhTIalw1SOqUpp21k2rbB4XLyq0KaOCgF87+ERg4VeU7jZ/G6cQ8QyHlH4T7XUp+8+kyZexYG4hy9M5amPH/RQk2y7bPyzpwInwnmcZK1kHoE5OSsJR5TkZ4A1y+x3az5Bj3h/OkerCsE6XzSWxuHqoXJuANiWgBg2W6Z/33YPUfyKh1ny6zVL75yzn7LrSNf566xbNjCNZWYGE0/6juvkYCd2vCv6brpEkiNr9qzNcQ6nUHNjc2mA4+XYmD8I9e2zi95U3MLyNYwqYG5XYuLIp2pmaR/4d8WoMw2opyQrQOxLhelYlmrs4VgBhAe2snKdQJf7uvkfaIxFeNAtcXewzEjmHzFI/","iv":"9c8744286b14ddf595a9f178e6cbc7ce","s":"8f9a9fdfd2d39fc2"};
    let flows={"ct":"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","iv":"05764f5ee91d37eeb7e072f76c75cccf","s":"3488e511ae063437"};

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