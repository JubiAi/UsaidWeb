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

            let passphrase = 'ba76801c-44fe-3bb8-b384-76e03ce475d4';
            let passphraseTransit = 'dsajghdksa7fg8ow7eg32o874gf873gf8v7w8cyv387egf8ygsygyugjhgfdkuyuyuktfkuygwuyyugsdYGUYGgyjgblgUGIYGIGYE';
            let intents = {
                "ct": "uMmU9/48e20yZC+9h1j+/niJDWjeNGo2SG3p8nw0AZnbnistdq6lFct4udapBe46cXKn9ncSwDw/Gv9RuMEXWAwYgf8s9Z+FWo3T/XLoRxkXSdc4EFHqYL0wsd9EfuJ/2/eJIweg7Qc5r8vSdC+H9srxA0I9slJrkqTWuE87XYIZ+A4YmbHre+WwJHHw696/rb1xJuNG9GJN1A0WvID+6ean/TGJtcBAeBe8KVip68y/E1Qch51tS3GRAVhjqAzThZTrv4XGPE3F0ZU9NnylKmt2oGuf0a0e6YuuVs8fYpn/X8W7Q+rIvGja26+/vVVo1EeReBQ49m3kiY/QqqDNzXw+sBrXGn19kjlR6Q8LC+pn7SAwpmYMQRSeRfp86zaxXNTKGVsx+0oFZhDBUPp0L7mbDUG3LypZDpopslxeHY6swu04dxeEj1j3JMDOij7tcObuJAzLHtnDseokNC0W+q9FcidsnZ1DW/6Kqa0jhGBsPQ/MLq3V+oGsS9Uv9bEMuQ1njowCNCHm5OLflG4DepQ9O+zfOlGvrl/DxP89key1cF4K6hReE3zqj8ejLOjff7q8at003i7r65T6+aufKp0QPeUHeBNJXI48AmLk7XuIImh7CUpX03qELXHlYYbt2Kh35hX0Ob/cUJ6bCqpd4XSHmkyX9sbqLJGaKJQvT4vFAlM4B6MbSN03d9dWneUXZBViVwfdGRnDJc5EQOejSn8Fiuq6G9WJ0YnKeBxaXmEiTg6PvtxRbRyFeSkcfZsizItSlq/vjZmaKyjj4FJ9Fl5iGu//VDM6LmaJDKd2Cn7VMcx45V5xt9XRB3tjHot3DBdErqJzYh2LCe6HwGYWvcumvKyeTllE8l6K4T0ySR055NrnFugvA7N4/MNLn/TrVhnxxYMTS4CQitEDcPTAWS5TU03qZTODP7xrXC6ODNm58izqErlM/+x2dOWn+wMQ20byrLHj+Ao+hqupUUo9WwCT/wARkDRXY24H51gvxstjZEKXoeA7bg+yVXK7JU2Cc26YfVc8JmN0VM2lRmUxMYpaATnsuObO8i00gZSpjWQ4tq82VP7ySOhjh4Tt8YyNt9x1YYUOiI5kRY4JyKR2S+1Lhj6r0U2N1Lq+Ot465lUNTBLQz2HpQwTz1gLBBnWpCIiS8MJaFLSRDyksemCux3EMdHVTZDSfKDfVkf1UV/1G2dDQRoK0mpPvdhacTNmceoBOPiw2kRI4jZ7HV9/Kqd3p+hpRLvuyWT8jw1orJsy/RENf40lqj6JY+/G04HNlUvGBTjRap/A2D4DITF0oGDZ0pXN7tDVklsE/ry6GpwagruWJNtWRKGgxF4rxA2gu5nd0Liq3yykwSIY3aWYvaZ4qFRViCYEI5canCoaH8DojJRQYhAjjN8OkdCYsEnhs9zwNA8VI/28JUisNDEol7HBNipcLBiz4Ag6M65CfpjBrXNGWOu0+r8S5AB2OYp5+3g+/ha49EC1e8jG3jMdVAms+GBI8V5l7qwALpmEVKLtuBTk3aG7wJ8+Zp2MWOWY1tetYQLw6LHamKwd9UvQwpP7Wi9BLtu+hgKpx7hkhUapJxqdY4thGOGgqiIL32IKBV1i+ytEqLFKPloEo6YKUzRKxjm+NJSQ+u0je5vnV2j9VJkwq/0PI0Ea8N0aYvzlD0EPjiA8CwBH6+0ZouIFMXDO3r17T3PIa4E3TA7l1XJNK51YKafOJ+imKhmdbPKm43aqXdiPosg55CXKs64uKGFpq63UdbLJs4VxLSmqGsJInBA47Bd/H2xtdmyHqx7CXVbyYJc7uAyeTgV3T3Y2fhkCCF436fxsNYNzwVRWw4Ry4B92ULanuyzB4YnZ1+E3UWceDoSOwztzBYl1HXGyhQtKKjHVS5h0C83Lpd3epk8pwL8vXR5J7LqH2+dQH5vFgN9b+8nVXaFS6WKJu3hGEmGjcUtPGKpfMk+ftM0fWjwXf84X2LSQjy9giys1OdMvc+VrgmcRaz0n0qBlOkCafW6v2jR0QQoG0vX8PZ6lGz2uvZBJ45p81Al52yrKvRRdxsj3KWKCEqTZ1tpjKDKvuDvrAa1dpWMckgaKtQQ7UcEjzejqndFqgWKI/4XQi4fn5z7ASa/w5RqHpsRXeJGcuOGpIhEgaguFU66OtjsI1P9hBxk1vDsJIylOkA1N01Wu4Y6ue/fWHu2tHZo40XgC5F9X1eK5m2dnKCBGACEDIJ+ymX68XdWC9ddnDS+3aujdiYlT/01rD2JoOI2tB0G0tZxXFInuKRdQLf9PV/MgePjx3xpFJx+qEg+cg66ugjYmmxJpledCNKskQFxVwRGzSZXN7By8CYcowxkmreEqeZBVrAALpBP5lJ2LKEz/N0pomqGrDePS0v/JCs6GkI9uOzibc6xPEA4wTPSEuF1py92rqBN5krF5uojPbT3ehWdRQVU424sJLlR3Cr5RkiIk0kZMUmq5B+QalwDsLWeABi3UaMUmUQgJJdT/zfERllwR2865cDAshhomRGJ/kbaxzcXStjHtEFi9zZlKqJMs655HTZwVGi4JXXCCH0HZUtfrFucDEbNDg89xMLn5jzPMuGeaLAKXElm6mpjunFlXtAKA8nnWjkHeVbz/lBJHUWvxwW9B/zFYmBP07OFOpSmgHvA0DZ23BzcBCa8L0yPjDCKBxwYerqLJvfXATy3LxdjWym4FH5NZcQezL/orxdfWBL62cLNusmjQvjGnIqSmKNxB7kLqC+vrazwGOj+lhB1Al4rLMBb6al5jZ3bAi5YKQk7kt3DXvBAlWm4m7qsKf522NZ8m8He0Z89CKmR4SdXhx6wNIc5hkev4MhjYMyKR0DT9mSn7rVBGgseL2sraoLsEu3L4bahZ2kV6vpyPvVtvTbS2dLR4GSmC5zVWM607SExQP8R6pS8w2nHyUkbJWBbsjLOGuPeDTx3EoCmAbnwwW4k/Yfu19klh/ZLwenKB5GoGuOc8mSWadeiXbynL7B9hupZqlMCbAyVBhi1nVcfc6EgrcjG8b7m7ciXT5qQbMf925zlZ2l+Lnmu7xqqbeKXk7wREhioObiyIZ/9yUFh52mK4ZFVGC+qY6IgDHwQExTunrg9bptfdCW0Gb3+LJ+tsSGZ7PtgAdQRnCZnINBm7EFAVremUh9bjiEiJE/UK6eo02OuCJrcdDn+2vWHl9oovTRtGgvvJaNTKLrMerlAvOBvVfqWYDHvQW5/MFMwX/ZV8h2OyWf76KDG2Lhk+gvGRAQw3A6SoHZmiA/NVqUWviBugd+BTFJhZrRkeQN2GvM+x3uVm9Sd7Ar0Q0SLIfIwBXy6bDx6KAOF8A2qTAJ5vzqKsY3gn0A2Y8ReVNFLr/c/kspZ0pW/0DBXXR7wQynizxBvx1FhfjQtc/NrluFeP3Rn983X3zUeyH5iGMw0iz6SRMpB/k3S91B8ZNIu16EqKvlJjIgJwuSpcUnIifJaZhlc23f16rJUYYDYwkNLqUul0dfAepl06ZQKCzpdMX7Dv2rRN90YoK4mNJA584v9ExygtSOfX+Tkepaeg052antG/NJAyxo+m+3VQ2WYC2wuy6Pv7ZV5VMaFmHGVAnK/iI0+YOo5iTxZybhiG/5sIwfus1yFMk5BJvIr6vpwEh1jIUb8CF2ShWzS5/voNidhJkhGsgu7+cCDpl4MZ+wdjE+zAJE1J3boMz9YBahdkelTS/ujMdrzsmjIwM8aW9tN37YjM52cGrRdjpFWD/WKUGeWGav2C/woclP6Bw5WAoE5dPIhWCmVNJxbJZluHDAthTmrd7cDlVhXEKa5FBYiPio53/SSYN0+ntMFc9eYS86b+Yh/I6DoPLO4isJ1Qfmt6jQDRIb4ZCpoAlHawmPwAGabAM6Jz7jFQUuR0/1wC2O2RF7PH+dcV5U4miK7OYBan5QzCUOSLvllXvX0/SIHOhUK9v5/mHeghaksWJ6aeq4GlrZicLorJn1obPAgHkStCN7m+4WW2FldjkHHvbta0v5oxzyJ88pd2GwmkQAXVOJR6YhO5eQTs9TYeegrZcHegXi+6Kb7/D3ib6F++dMbPKukHtU9Ep5nGH3K4MAGrsKDtmgA+8Hxyc/Fv2U5IK45XnFNkATp17t9vozSaTTLkSZvGiQ50mJF6QNQfkTaaDOtXnSWasnddZZv5c1UqXB9RPiGMjFNlqvGbCEiBdR0Bz6eMM47sNFuECRdNbdF/EhJCP/qjWflu8wwmaeWPV992X8nPogKv+B98gLPKBt7buRT5J7FvXTVtr6dNscg1y2a4vK7iP3OuAZP0yB1px/Q3ArESpnodo0Umv1jcpG8axs6rAqm+bTjf7/+H6X7RO/fQmJ+4lMCZ7MVcLUGO8YOb2XJXlAOPUqIqpOTaxMB8hfMOsk3U1Dv33fFnD2LVYtyPCNqxdE9HV5FpiSd/G5W7SanvSr7D8utKNHqVyefATNP8ZfZWzh5RgQUWlctMpIY1vnUOr1giMYQdd6wZvDHmn5kwLrK4R+hh8/3xGKj2VJlj/qOXgLjkD2U1V/XwWvG2/yFOTV8gv3p1yczdOr2kaDvA8gMmfyhq2P4iB536cx0kDSyBEFzxrsj21j+qOKQMWKSdxyKvvU6K2WgCiiInoHWsR7Kg+XHMF0LvDAauyR8Q7jm7wnpbn3ClyZk09T1XCZk3h7s2Uv1s1IIpB0XLnTX96wW94Mu6rE3gvSpKpYTN0vSdTf6qnuQvccP1hu8kv1zXA9IK9g67a0LMRD46EsH4U+HAbaW0jR2KZ4tNuloLLD7cVN2M1/fsrOaXOXL0wCiEDiC/LlI8sSZJI44AroeXVP8tUOay3qDGTtGvO2JDjixCSr8wDs+lXF1sqyrtQhgyThqhBZ1IdRiW/KzF80u0ow7BGAQPYQ6rTHIdBBfrepVG4vgqfMyA5IPnLiYAI45z5RYpXBIcV/83Fyr2B7sXoOTKofqr5dPkM3Y+ZK59sd59tdvZoKI7VPa0bucNgL5Nnafqk1ubrmOzyyXH6GANDweWISVbJMn6gU0gR3YibAjINwTIH7LliZGreXTVCL8pmtujjFiv3nLil9LTBhfApk77YjlugczFGAHwVvttoCSCi57vpxeIUwXBWIigYjIMfCTjSFIeUp/EOkhPthCtwFftYeRvthOTU5f5KAlF+EVgBkJLr/KK+RvYEV6YAbz8rkjB74nstkFoCfUt0Kda3zf5sbMvuf8idXlT4Vh8gKNvZ0vXBZccJXlaF8fcHvpNfySlm8tHLwdLLkUHm8VM2vrVJz2PHv+cetoqoyN/86DVfBpscs7n/X19Pj75+4Vbz/y0ZmdjDgH/vaxLYgSNVpGk5YHS6zCqRDFCMQ5ERdeCRNXJ9/mxxB41br8QJbe+3VGy/2Ku40DlasXdBJAMiDJVdJzdsocCcozqolYVReOvFWNHuc6G8Eduwze97WKup3L81bFG2Hbd1GnAnGkuOppUuzcC536HC9KODuFgXPZQnhATxu1RRH5KpqwRkyc/ppaKy2JxMXhzM+uTPrTkyaSsErUKeUsBQ/93E4JemCMEGk7o5xrGGgDrBSo5KSFK1MQLZafQESZjpBO8xQpmO6oCDU5za+kN+xNt8aXVtrY3NSp+8/7bsNiCTAdsze8xoZCgeqxq4y4xyE9qz7TVDw64UQbEO6uG+VnTZnyzXRE5dxnSoYTRnv/Xts11HgdcZHEyd/JAIdL8Y0UiwP6Evz7ok1Jyc2LcioMf3MLKW0+NonTy8lZR0dT+8pDiKS6An25IY2i13X5PnyJkYj2WIRdaRNhiniKrc8MEPgK67cYOFQN1wk9fdLbfahx1h6IF3kaVnpj1HHLE1bRRbGAdHSkqEgoAQsLhFzIcNIrctFwK3O0V0bGG5Rz/YLQNfvkcvAEpHhAFxYvdsYhI6Y2Kd0JuHcJmv+fRBV6eX/utunxGEAGB3d2+k9PPOPwfn18DvQTn++nOK6HXY846VdxFAOASlSXZLZLHBtaw8t3x2QN1EyaHOWuccg5aD0W7lyoDW+oY8UnHqWGXhxgCxmex8ykTuq+MxqcR5fbXM3rPA5NaITbkmzAwi2ovmtEr5oWNjxxSdPnkjGUxZJOyKyti9kkOclw5bGhEwjiZRRxnfPzcS6WeHKz8BWJGwS/p+fgFZ1g++gMapuTisVfIxDAvZcN1d5CLWSoZh6QSq99mE4sZI7h2m89bGtFawW7ONNjx8IeICaWOHJRIvcmlzRdbeslfL0KeKp0abmbWZN4qtsmArMAI6c/U2tNcTC47g66bW1G0/d61jCVO8L5AtjzDOVEpnFLHn2/qey+p9kucCeFvJ7TQg5WA/SczZihppmNWJ0WsGBlBIqN4dVtgTxWsIU4OUTZxhm3tdTCTkEvEQ8+Zw6Y0gqmZ6fY2U4Pj9hdSGREwb0fVla6kRjOIbuy2AUGfZTGlhdGUY/U9kLs2bpO+t87NDFOnv18DptRRPK+wbAiAZSXjdczfv4pSe0lHUDkR4mntBX40H0U7YGluRrr0U7mSsCmpUq1aGacqVmuzd44zx/jylrTVMPKBqu8bYT6egeCzV7knCpGlibNHjQ8H2FdPliFgU5EE7VWNwB05E2S49IPnX7J6FegNHUG8dtycTQcAByD2tKlL42nWAKA7ooak2WD6WeCJTmcHJep80l0HWZ6NknYOWsl73fEEarcZIEoyLhIzmCedNW3t5mmaG9UFVrh+wcE5hA42LwvcHpVvuKJxEgW0SxyV0E6IsZcqHJH7ltMknMHvggSycl/TFK5uge+mhF6LqZV4A8FG5WM9TRy6OOvTgbzuC+8XRJqg1HifX2cgs25Fpvhwrs7RkNVqaDPBybKRykEVLVGRj5d2n0Ws+qXdMHPCPd06VYGIXt+kwwPhtjiS/KRF36QF89s9SVRkAw+c9pezWmT3L+YFpzsKIQ1aJUY8hoKklYZHcOYeNkqPiT3HFO6Z6JaZtlzsIEgTzn9bENBloUeUzHKFBD0nTqbz9ogzQyx4A+8zHlMZKHn3nRKpTBnHxwN9XPt4jFr9eA86mPGQ+Buw25xUqZT60Inxi9X1d/LrHZxemzomdKSszY+HTn/CAZWAAoBXoUMl3LGjzxtGkkmBrPJCIk3uOHnUK/mQqF42k9teO2IaEdW1jRWhkb88eki3RRILnJ+cWDTVjiT7Qgp/UB0A42lBFWF7jjGzBYHNlJaLXfkWjfcKs4JzZ08h4cAXxD4RcKs+5NoWn31N95QT8fkGJurQ/1fHPtbaLokJypkj1xBiryS//zEz7huVGDB2WjGwDIkuZOZW0FuLYfdnAPGAFn7rSb/LpGwoLRgYaSolmzgsoMPbJac7IJqGwTtW4r895cMdB2avrerhmf77B1MWmLF1PSwdlNOdL0LEBc7ugh8Ne4scw1y6WE+2f6wTwR3tKGVfwfim+up0HbPud+m0UaWUSFVDPkj8rX8fYNgRkrP+rBhFZbD32vOob42XaEyMMHccTDAipETETNO5yHXcLv4z99AGEkpyJinHwGU9yrIadLXAXw9bxE4vH40FnPkCIihd+M9iykkTdTxKJfnqDnM8LCD+bK0hSXmspZzgYUP3haLHnYUX8GdBEneFfC5z5U/D6hmRPgC7/xQNpf5tGoSdfbqGPV6xGgY7YE+gt05D+uX2gkW9l0Z3PfoR47RhxU+78KFsj1MvBhKZLyZMumsaHPpzWx8OiHxpmBHWXnKGWJ8M0pJklrdGIXV1fnN7QtQ3s7C6qkYqKNKXhy95fbp1yszwaIGXt3Vkn70iNPGxDGTuJg4K63uZa8hyQtG/ZrZqrPKNgK0iym8pCX7l0SsKW9OwQyB6mkDjHkZfYW3auRIsIPty6T8loBxVKlcpWOrKlhw7Wht0W65X5FGCu+/9GjRUcJoh1fJwPuNtzRHxOhN1w5XwSzJAr8rarGgEx5Q0mDR0CSMY4lTojiKI9t4ZUTQxFghYO//b8GtoMP/n7Wkx5GgAVwZ4JkMmiGP58XzZgA2xScUe5Z2YkTyRgJCUApC22/AQAPfmX2huM+OMvUAIyJWoSgr614IHfaCSit80Vn9cnrbsguGBAGpoQWMfwA0iRkmGNz5FsQoUKWGG4PzfVg5z5XbLTsALGFDWwwY0ydFm9OiX2k/cCLOPxuAr/SCuEPrIezacQ2NK2mF6Rmz9I1D5DkMyjMfhi+y61b5sJa9LrWEBcptfmg9QlPWwXML3TzS94K/igqF0GYs/Qcc8S4eqv1P3YvBlizZ5i4/f7Rojf48uK0unanIbO2Zsw3Bowlz1TP6GU4FWZAOwlAFOwQmC1PLyJI/ugrEoK/kiFvi7Hqt0f62jGRqLYq73xVxTbPnIO2qMEUMatlaSOyQnblZdazrbogSMsc9Q5O1pD4+BJfGMqOk8cYPGN1x3JHYanRDUkLWsPgr4PKjQh6SVvvEmHmv/dfpUj+X+GhP5kos5aleMWYw2qgdAXgelMOEqdlwqHbt0bYitd29y6u4N5tn9elUxJGJvUbP6jjCD7FeDIJ8VjKr0TLB57VsbLC3TlrCkwhZMP8NczGWEcIoQFhXF736ZwTtyypWJM4XwiSycKggzyGSJwAVtfMjYQXtmXAmgroFjCXcjiz7agrDcIrwqHd7qwfBDLm9WcnHa5D2Sh68Iphlv164BmRpgfWFnPUh+M+wOSn86/AXEJudlQ2rfTZ2eL8rBZSJHHZHXElAXuhr9gnRNOcaYEvMhPlzek8wiKbnASZDFQDraPLHD2xKc6LZP6+wCxgnKa4YlOIY90QqX9IdZjYaqGMKGBEnUay9BdbMfEeCLd6CqewkW6hfmUOw5y4xAcVPvdz8nzZvI+b2GC7MFvnCGAClLkfEtRQJodNP8d9Dilr7q1Q9quaozEMutc8kHW136aI60/J5UgQkhLMOQ8ytqt1igrv6PeT1ZT9ez2iv2WA4lgOqgfbCdHeBo6h6AnuESaLUN8114wpScFGbZKuwI+6gTKSehkf+R1wEP71ZTS6ddATmmNfwsXZNz+HtfEpjxErNLIa32GSYt/XiieSMvB2Avhol7vF2srLrMbPv1gcZV5X5tJAntNYnE/vQY9mVYet+h5jGWrAu6tuuJ+5TBxWxw4KGo6Dp7jUEaUF4+5PX3Cis5GREJdFPexn1egCYD91lKbVsZ2335ujxQ4QAa1Tr1bzY6E5y4vtkwWUKAlRmfMlqINLTQgjD9viqqVnFa70IvIy+sVXKh24msEhS6luIZNN5L3Bt48nrCZhjDpU/6haSo6JNTfrAZDJ1leKuRG/jir6jTTIVJi478bH8yobCA+WJZchG/CMRfXqpGP0Tjj1AD1hP/FYo1Xu/aNMnpWshusbHMt2gVh79g+9pFZWAAYRKMD1SCw5tyuzXX2wqgrUlnrnSqDW6OFRImxIDYvRLF2awTlsp/qLsc3HEU2H3+5g0xHEABPmiBIa0uzgatUKeexWSfq1qRJP/ckRSgqXuxYzYBj82JUrkdkf5pmnUt8LzB3j1f9dwwHVcEKVBzCBrwgBbvo+3bxtHydAeGFi+eXvOryakmItQr/mqPc0axRsee8QvG3sRM9jJpWa01JduvPE1OWUIeGGopewBuC9kpBZKClYc2cmNJt/AVrfJr39Dop960UBR6DEWQFX7R8mMPHk9BjSOKPf3DL87nW9yf0gAlpkv7l42rz2/IaqmI0WtNV5p5ImJ4Hf5w5gWFfDs7RI0LXbucMUwxhZf32RzydDD+cZ8HwXxusi5WtykpF+9RXFBeFq1rimrZtIBCCexdWAVInFqEOTgU+UKvj4af15a0SKl8WHZJ3wfB1TdI2jap/q7oIJclCh/qRpYZ+iyCBdLp942YRvS7gAr3ELADxXVMqCdBcuzC5XPUYhIsS46ra8Wj1NPxT5PramPYK+iS6VaxpB9cLUTAZcNc/CUPIWnM+AjjtV68Nl5TQqyz5YTaIZtLlJ1KcjlcGeRWrikZY0F8/QGCqSTSKO8Q/er0FXNtDIYOUdHgiQ6hiTR3/TSHfDVFyYSiyCfYxl5BS0J9i0za5RPRxmj23MTlpPKF+IDdGLBPfHJ9Rfu894raJHrPYicYHuuubzFLUaCKuhYrR36bi3qyrGlM+1gsjnN87a4vC9megW9VDNWNMSGBFAQxpWCmDNqA7DvjM427wsUW4OkLa0NJpZwzvE7wR+r/jlNqsuPmVI6RHR4zsYnbaVFYl4OHBmBJkd5VIC+jbMeAv8yMD3Pi83Et+1u0IucyvZ5vEBmFRTfaKMTZhsvOW4bal5+PIZg+Gx777YnxDAtpScE61sPxIMF6NvVjvUuA+Mjo0IBtXo/gG5tTw3CYITDOdmP8z5Aesb8sL1W9lurj3n5fPjkvCteqHd/29/gw1dmD0ORF9+ye+h/f11X2anrndMb/a0ykHJP+Sshaz2MSwa+R8epgjjadCUtBhBuo2hoKs6vB3mjpzMJHe+LjZSHxvjoFqhgwlrdCLe13Jg5fxuZMdHCzj/ZP0ZKrZaKPu4IEq5GHMCj6HR/23pphBWnvs+IEgcasDBe1XK5qV3ppD9RtoHL1BkB1ivjrffBFbnIeRJem7IaHaGtXgU1idaZTxVQiXWJ0Gx8ToQUUbNGQUxacFWQ+M8FJhyKtuJtuvejdns54qGixGdmgorfo8mYyROqdESXo4c2G+MPreGude4CmBQfEMf2PzOeyVllGT+qhHY5lVuJuEqFv0tFIgw+j4xfFC7TgOc6pYACt/Esp3IeA5GQhzstc2NzMYRwTV6QCLB8rMRwXM+WwPRwW7dNqMCCYUjXKCpQhuXYDD/v2wYHNSU8ew/IXygPG+lzBbDKLZ/YM6vAzXk01Oi6f+U2vKUAkvURHe7Ml01ZrtVGgOP9Aedd5W8GEitfXl43Qjys1Mio/kIW+LmKtTY+LG0nQ3TBtdlOxkyw2HOMssIO2UYsDIQ3UsQl5DXUcNpsHmzoXixOM5OAi4LQiQU9ZLSiFW6g0cR3nzhlusItzOYb4KMxFFJJBYaMV+wp7867f4m424xYL4Jf//Hkso3k/IEOx9WzBJTzQDQx9iZKamXE+S081CXIwaTr1ZvCCv1b86R7pvaMuSCUJGNXnaceOWT3I8HVVoXyIXnj8aDb/NrBUe4mqabqcmyc+ygl7mhNoqI0cK7EPEtH9yaYJZv9MgPZpLKuOSb2glSiODhPu00K04j+WFC9+XeqF7n/LjxH2q1ep7SGr/qH7BK9Q3yEZhZINauJJFora0eNtdHDrDH8ABw3HMMn9AAgqoPA61cReDY2/BikbOz/gkgq7nj7fAOuQ0V8Z9Bc3ikfWkZSVf9POGAzX00ueLaGcbm42/cpeR82E9vj8ZBCIwyFuf7WD8tHHiPfpHz/PfgT7a5cCjoxepIt0XN8v+JWJ0B1nDeKJSE6LbGVHQSW6p/vazx2YJogcjzJvDlNHQXwPq7SCLE4WOH5WRzBjSEHRcDTn7NW3tOAB+SHa3pIGEtwRscl9W+XL4arrk3K0DiHuBMIgAXH4ocuPaINgax/6Q/fhKTc810txHbla3IWcCdxRiDOHn+57WYknzprBDcu/PM47ZtdiPV97uh3DIP5+V6KkqfmkoDqee/DktjtQ8bd8JiWMHpEQzZYEMA7MqDBUH2TD55FTynMR7ZaRTBtpBkCuPlgY4bh8gJuIhvISIomYlO1cW9eL+LPzLlf1CyCAorggwpI5ZGEWP8+HF5UfnmDQkzbMLUNZsm1dMcylO3rEsGp8M/MOtRyLfeXzqn9KfTqA5+diG0fXYM8jbrE4nbYIj1e8me3iURRJMHVlzuPlixwd3BGq5b0UriEd9Hm1GJ+FifThvvWVZZoywsmPx9Tz0cSZGtR7/NmzJ0o9KH761NhmpNLByH7TnTlTR+wI1DNb5dnTplzfuck+tAERpY3nHTjr5k6JKNUmy1bZGG+s+K99AdRMktKzVrowY1LI0lWWESHg+LUWMenxYGNsW6BJ6fVa8K955HpKri+A3rfVHiwigdqIVse2H8wYlTgHR+594hKMWNsy7rYpMn90Smp96KnZLey+KakPHXf7sOp1/zlr4Ju9JOaX6+xPBqj1FHyBytdZLtauT++pIEgpNON5X6GJypU8BAsPXYh+QU4e6rUN/dPvjRKsrUWjfIChwp5HWRHHFtGTutsIr8ojAaT9X7IaLKbjMZ2uC+OC2LYSQzPuPs36cWxnpOJeFmPSKcnpRXyBLVrTPZk72Ly7zXZ5l6cEnCl5fyX9cQmBGhicHO8D8+dkXxC5uMeaFNSdW4X015MmK4V2DeoM91CyIWGprI3WNvQiaPGiJyM8qKMnSQsgtdXZK2Ra1LXq/rZN5n5VOXV543Hms0o9krFA2eZdQU8Vv0wVGg73nWKp0+7vqQI4KcItEO5U4AArvcRbO6eYjD7Ff6CiKPIp+9Rb8BhUujSJtOxtB4E1/Ss3kS7M6WjYTBVjA6cTjIK0M+UBFrUkrOox8LrwrHxQZ08p7ifUwdOXrIt/t3mhLNjqYwzCPkmte94Ww+nkQJSEkumV9tquy91lX8qOn+NIZsqLbSMSZ9pr5SEG5+UUFRTZCWpTdkpHFQFE5oQOxnfSWiDGuxS8tHpXv1iT8Tjac5BrzRAd3AQVuLO7AhtWt4FRKmCjdDlhxBp7+rFzHUsFNdiIZQdz4lprFvSb9A53xoO47EtTXoKBpIBdTe3i3ur/KKg8cxUcFjKrSs+v3OSS7MmgrbxMLt6+yV2B19IrycpVIWZ7lcK6CGeLXbSVkFya+ReQFqIqACHbbbAmyZxAGVd9p43JAdT7vweZYMqhXHf90x7nWyPklKiO0EE1DCQR+i+lLromMHyGZRNWKeEURusY/sCKJekbtcqG9yWPokMVjenpeAyEBSs4aFKbid4zlsnUdsZhhu3JI3gOLlKK5jPrbIuCm+UQLDqBVUL/SmH8nh29WplIOfW2y4keyrEFf05FfFxwsqOM9cxj1r9SywoqT0+G8j5ZqN/ksr0wQjq1mBsMTpjIZ5IBitIuZ1X0W3Ys1vtvr7ebUM9Y8Q0TUjjfSuJX3peIFcF65g15AvKjsQAAjf7g21DS3WcUMnqMTtBPY2i/PzvY5At3mT8mOpyrZYpwwgoZQd6Zajvqo1BDO0FwwjMZ1bKxzOXEU/LMbUblx59DuNgZ+vxvr3Zk0gTkcPBhS20o2u5Q6od9n9PIJFJ3tKE9PlN/ORxhKHHGB5wrFuNZ3KMWEEA/DY1qBkFZBe4ON8dmkNpGY5dtLxYvetVO/ovgCnPYoScZgN3YknO1bjwqWESuim8oiUyl8UKR+6QA0QwZgTwuOAQFjRwFwnDCnZAkGgrqRgPsVCqfZpiW+CJIU7kBegZOxLjm3tstCMsOzU8KCqE1S8jmARu8aCzl4jTJaWZxuGqdbXuRiLCktnmIk4u2OloFVgIumRaI0eo4CaObk1Q2d6HMypPk70YFfvdBgLYrdAUScYW0rriajjmf4cuH5hNZbbLtjmg/6ohSbedeGT8q0Z1Qrr9E+o6NTG9eqDptH5rioCcQN4eoCs0lLbWV5RAJ2uYAQOk43t6WTvPtaFRH6V4IOU87wVrmjy2oQSzvswyXaB35rOja/50WtsYX4qg/K4ErLvRZnLjaIaTSVuI1jF8KCoWUJya+JlRIyJp+FRXQXGvvxLAEfq/2tcr2Feyue555xzpS2QoMIy3owreBl/7jW224cBshfzUDMxB9oLHXT27vqS+tdZaqrjVZP8O30nt+M89u/S+y/XEpTrsx9T93bA/13ngidp/bV8crGGmZDxIInQ6j2ERol2ROuPZqZfCVcysPw4YcwWm0JydxU4QRX059qCc/0iOzrUypPGzp6LNfZbS3BHhLz6+f8mjDC+JrFkEPYwPxaeWgMxEJnFgSdynZFWXZ4QQ+sSoDAnDBgK1LRo77ke5bwwYJ+zOqGXlHLNnD48aNRVgyaMAyXSymAdJ/EF4YZNRq35gHcIYai2VVo4y1XTPGUzQnVxZJHXAE8nhy5YR2GLAN98BAyqQdAcVfAeb3KiwwFFFEqr3H36frKr1/9elB1ju2bjLrrb3jSuQm7JFhdkKUAPnrDF8l2uuc463/gdqIvQnLhELExvQZFxMC6iP3HxzAqltbjFJXuCeu6DLg2wSSdZIlnTWJSW6wz/+DyKPBLBbidJtJfSiL5LY8aaswprBChN8JHS5MCjSHmlQZqkLn9hxCjrKwSE2tlWv4r6Ce59O5Vqsh1lMrYRXKhtbK4Dns5a83LKNtm6/LwqAqV6JM1c9AnUm6pqr8OyysZjrv606MuPkKdWmS0VFCOdH+CgWU5dCDryCoGGs/lW3pcxMVVk6WJphlMw3bUgGWb7PorxvJ0GMuLsFd+9s6Vo12paKmtwziFaGMzobUfOhNCS7CwVPIg7r2rU4RfrTNRRlAm+FWvOSUSnrzWyEj8M0zMiUF1PEKg47lzv00hsHQlVrP52lMYjFzcOaasDx5MpDyql0OwWjNC2zQHRHdZTgXJeEQ9AI6/K3/uFJhYMIbLG/sSdh0ZgaxX4XVTJN4Ivgpkc0N0lZx/8VDJHHs1bhaAH5lxLk6Kk2hwLsqZ/mMsVSTtXb5bAj+Wj46B2ozO2zFzegTbBoN6nc0UnDIwTE6HJYV/lzKso0bz4eQNtXCvQeyg7haBPVXLs/FCdS/LdI6elyA5zhzvBkhF2btTED28dfu2j24v8eeNezp4ORv3Pa9TZFXbjB3T4pzGquq/wv2E/K6FnNSvoO6p0nUrjLGlmKr+edheeBZXFzSW6diosyKwTqes47JEm3RUeMQsg7UUKbioz5MPrpyaszriYkf3qYiYmZn/gkUU93rTEe/zVvcfRpVLdjdDc1rjuxa3IrOdUtTtE6p3IGAOyot19XxuB6TSso/zBdPIekdR3mZ6ojn2tZeWsb+VtTjflJ3WPrDdoK9e7IcRvbtv56sxmiK4NuS/yu4sYKsz8Lt+32Z4Ff2IiNP9bRXn+HbYPgP9PC8qSHT7BHrmxt2/Nurqd5129MiJ0nVbfFxKCN+WHZpmGcSKGYywXbMBSfRE+UuhNN/CtCPfJu5mb6yT0kiZkBytz6WiRWhOQe1o+qbtV93+MU5nv/KUO5kXK3I3KHxso+7yBEpXMKaNvN75qBBTOkCGX3Kf0qlagpHbQRc2+5VJzWFx1rQNhRLR7Qsoxmw68HX1kEf7UqhrSl0J0/mJ7MGxDwhtvITjIB4QMMdJ8/y/Jx0Bkl8JZMsZrACS97/6f+jNK1K/FWq2rHd9zNsNhKwB4394o6NCJkJs30CjHHL/42f7obNROhBhOtV5o0PQ6g0bSk11ma19bFrNKTXOKHbiHfsruxNpWywh5+bi4hpJvpDSV+a6YoAwkQ9/cbOGcOm4COS5/SCgdu76oXxOgKGLLy1HbIrBZwSFxRZ1G3+iotS2NpCuB+2dc03V6Ee5MtGISkwM7kT41tGp7e+Bn0sH5jWWbLsFZ045+zYaHsdB/n5qhKdy3bsdhrUaA9ohvjHSo/p5uoMReiOzPYUBVVdTrtsa6F4zNF/KQp3bpYEn2eAgOM4oo6IRVQ/k1LBhnEInctBpd+uTT0AMPubKkHSyQcOKRNAzyW/2TwGK4npMHL1+72EG5jfkBOKxACJHl5vjlmmkHQTJ9HDSDZ7km26ARst6hrZpcucxUSwFPGhMv+He2kyD4VCHs+0PJ6hXBp2EPwQDWWhzjJHlzw6gq29vhryWvAY/fRYKDoxQhfvdRcBwMq29CCGm5rRYdJPUdtl+l7HoejwLdM5SYSNNkROBQ/eZTHDCcJQGKn3P0Mh+BwzPmFW9Ri0WVablJ64B7qHg8VdMSF4DQZ9Vj+8sNoMpjdWfA3BwOHNVuSpDhBAsgicbwRg4eFNQ3kW/hRAq9MrX+3S79t/j0dDO4CQr7FSfH7oekx+IsEz52b8ScfPK+yOYAsjuoNPfn04HoMYGwCV3sxBsLg7XdAqUqdVrZz3CfvSiT/eyjMlIK9k1qFehoEbWnJePQlSr8cCBiwH+3j7UnfO0piYJPez8ngWRsPcwOxt9qGRRvv2r2fKYt1ZvrujWqoDa+rsqY1nMw2KoOL++/9gXfo+uq1TveND109bcy831Yc4UxKcMADjuvlnd60r/zv2yS88kaXCmHJVXtptGTWe/jflm5QChT534quaGQQIfXP3esV4uWLUZJqH7m3Iv9fTBiETBsovcItHHdNebmzXsn9E/ZFwQ+6YMb04D5nJe6CYAauHtz1C5DHzyigMcpJSnji2blkC02H7I/7Xavk/ylvWSrcU0sh28fIeOQsyL5Hw+JXR2aYbhM/xFFEnNJo5jrqcyfHxrIdizE+2D6ho2UiiNlP6OYPkvuJpj9xr8hCO9XJj13M+vZoDgl57P+e9PROzxV9WzIwbGjXe+PDAA2UdejBxCJkdyDv2unFfyLYe+G1YLwRSp8B+TmACw/CYtGCoAmeooc1LTM3avt9jt/CUqjeLkBYbVFyPepXkPU/JPsAK7gbIvRBdjhSumz99DJAFkzSt3C1e3FghByKdAazsdruzzbmEJ2/LO3G00SebqUVuSTrLAkpG/xRYmeDujXIf5WcuURTsuPTJPlYMkl0tVxn2J0FSmCMaslNza9lPrjgMevFwJNnrjzZhN4MjzA6tVDmLztUveEyvl4sYS1s4jtM5Jv6h61/GH0mcIIPQaBPB4rzdc5jXlVmp4vwdL1FTZtIPcfoTQ4h+sgWKXZL8QUiPbW064gDLYp/6g209uK/G8TjGrojWB+IoVsQcO4VW3DMA/3hbwwEFcfkd80qRhK74/qPWIIrIm9+yyGn3vhH/JcR9U9zxVu61m7Ll0bulcR30ey0rz+KGkCn1+Vtl+dvBOu2e7X+eok9C1l6pQ4NE527SgIPlMU5bDpmE50K3bW39WrhgWQ+gdipDTh6pkq6cul5JIrtHCEH8FF6MDHs3K1fOCS4QSYpoq93WtWyfrFQKEwzw+My0Ts+qP56DUpPu2oxz1/Gh3JTrphHKEmnnSaCJ5WfPraEmIi54fxGKY2XvPTnLry5bQsr0j3++gKyJd+znNlzdUzSEDldQh8hLVD/gIZWfDEAgVNt8kK8ANn6i7JYqfz/b/pyJfdBV3MvmsYlTCOorlueOYQebSiz01tzBcik4U+k+iR6hnhTzdQemOvVVEM8lRhHgoQoXmSjMgQ7lwHs6XM6Ic4VhdVw3YUZHqopB6opDwh8IjB6Fyg6tuSRjWDA5MuCwIW7WdWAJxHm9oGtx0msuD6qZPw9tnI888S3dqHVWm1d2StnVI3lcgwqe+5O6NOzjz2PNVSS/Y4IyOs/sMoRLFMQsH5aveHfQS/hs8Ny5BvhlkGDSQ7WTZ5t6w+v018WmlXvzUBRJ2LYhi08wTMP9nJy/VTjOgM0OrnDQwmrxlCGEea1K0MHJXJKdv4aryeuvv9xnMKFJnMhnJ6Fxuk43G4iGayKmBKzarYXGOea7RFHwPLi3oV+tRqrew8m4523CpZpLv5C0Epo/T/03HIYoPa01/RGNWz2nkhxZAqWB1Nk40GwoWrkLjkWTDoyfNAeaaI6mHb8SnZ5PwUUnBcwPAcsWH2QmKKD0OiecRwPuPK+tN06bSr2SwVd7v093MbOiU8ee5s3cX4SDQdkfch03xiXLbeMl3gSfqohutzxT8gwiFqu7wOHJ0CLeMnKGbTs+7Ipqsn4hVOvz+n1XwM/D/boyy9UystGOOPalTzMeKVuzlz1NHC+4LpaIKOLP/BlhWNBY61SM0mlYez5/8mA3n3zZiwXARvpDjGew+RN0/uN8tMP6ppauQfZ2hus/eJasBKcDR3qDY3Vp1F+OkOUUIIajZ2Mx1gGN6NDF8+cX+KkJyhQj4VRG9uzg+SAxe/+UF8M2CVq2afdFxK0lPPIT4wG5us3EAXGZJgQMMBiMdCtENGfYifCkomYzAkO8+FQ3CNcWNygXZEAXl6gm60g87JcVc7qmzlPbOoEGVEVZ4rcd6xQMVoxTKuYn421sGrhUpHLNqq/P8yO6Vf+grNEr3GUlUelvKk4WVBptCBu1nYGUhCLQtCEtHL+lwsJhTzSiiYsI7rAZCAvVEXPk8g5AGKl/yiL6MNT3MT/1fz8FnNmrLfu92LREA34dFhRtOU9bo0cQlw18sRYOubC/PkY7R1hQG9XxGMclex4C+abzGi6Qel+1lnpX2Po9rDf07cfad5+dMwlgvJF3rj1YCbT4ETsCo+mNPSfrPSF67piFjfRvEe52FsQoh2Ud5Di2BP2EX5b3qLRk7vJSKxPpdSDYNa2uhvnaCPJ2ZUyd2uNYP3tHacgruoFhou52uGdDx3PuZb3hci/9DV8PEza7xMPHuqARStvzaVcXTW8pPlNDqFyDhZYPkCxrCMgmUtAjawA1c2lv9+mkVhraIo142mLh4rySRAscgIQjHLJJnu6A7wf0UzbDZ63EQSA1t/9N6nJh2GVYHi2IDDhMHWdn+s+zO2FysDbppFcO2f3WnzczoncmoFXuMfMxPMrusjZ5nYTbabzzoQuR/mCocg0dpBnUCx7jbsF9xIG52KuQcBRiyuEjvcDI6CemcEn0NZdMDL8tthOzGCwVFY2EL7amV4ZyAG3yeLY4xa+ppA0ARPxsjXlds5oI9cVBx1MBTNJ98k+Xqee2+syzdeWwnoIgl5Yl4QcDa72d2svJypdmfti4iZr1pO2rFE7FtmY+um+XretfPue2Cw9u+oXkpXHHmHXL1OHmifYVWVnahnsTIxmzDB/wQJQUuDsEm+KRwbpgQgn0Z+JO6uRz6wB0GNFHXDOmxgVgpoqeF8bv0ISEd7g55igOMyRaMkTBu85aheRA9TTYg7+i8j7cXdllH/Qaz1N+kBCKAA2mkeld4XNfRu7Rghpzph/U8bzXt1mbT5DH+s5gB/3dwWArIHHybxHULJkES7Q83wWXKjUxQbEwttOU/T1TfeLRGTwuXXZ2Bvg669YY8Mb3Ne0ftnnFG8Loff1WHC1vwtfSDFSyRbgGHz67QZ6KNpP/RGoTl+5tJSNJQT77rbEPHkLtXy/Ecl5/tAx0FnvxfOlcwqhQndB5BsHFVyDXBEW7d/9oELkTinf1jNRnlVEvfoTPyXp8DieZ7zRjKWN7aKLbmxoEuR/uWhIUQ3HPYVyPzspGJMDERygqFMVSxcxIXY4BHUbaTVZ5HAe2VbpDXDz//8TC6lJePJGyUoL0rXSoG4ICvH0xfwW/65C6vbfyvPC0eC9CKL9o74k/M4iuRhnZKtJgpZYnTAMLfMg45U7ITWqABDZArUPgJuKkDXtIZa1QtGAhp0jdCcR1ONWiipwpRHvlLukAlB+FTMjtXRGkdwkyY5rsBHRiTIJqTz8C3BrLm2LZuO0nlW94/9LnexYx/A5mwe3bqxSdV6WHS9KZ8UbOnG44szEyvV6ToAodAFU2zKYIKxXyaUncH9D1MM1Pfn+SR3Fmk0Hk74Dc5vqNiqVrUy+9NL9Gajimo9egZ3ApiStD+nT3vlwB6qxBvnyTNEMXG/+wlScf264lK8Ov/2AsqC18/L0aqPlX2ZKkCA9bQq5VUyuNVACIoGlT0a2d6U/FGZqGAHtbe6Hc9JgF1J4lv1/KuxPAv4kxIDChRaPLW4/u+5mhZSXZkbGT44Hi0SPv61UP4ppVZAhwsxzR7fj8EsDtNMQyb6ckLzcUb98ujN6NW4R3ZRVecQtsv33rBgXSc8ziYRCsNSyM9zXGeMhB1Ek19Vpic7tKV42pmueNmfxwEHzCcNRpTIbKSqATq0DxonHDwLltaRQKz3BZxxGn9Q6ovR50Mpsjjez2dx95yBjOo3ZULhUg9CnKRE9p2BAYM+iQb30MnVW6j+Ocq3yxGvDheg5XKUBB5/brjGDWfEb4OhLo5QN8AenodSqpbF9RBCnQiEXOZaaOpIXnknRj4X2dMSSW+zlBTtIfsrt6/hBH57vYcpggO9ADisz0qlWkVriIiX0INSUzBGd0CFzyJz7sjre/aFYgxMMZtEvnfg+SaaXuunL/mp8++qwHx6C8ROMTiQK4GmUljV0vLRJok/k0gmgCW00l91W5UMeZobMESiD4iUONyvHZUNyHZ88ABfIHCWTVQaTdPTbfCY89qQlCqNhS0rhwUMKuRq4rU4uMZd2W0SmmcolCPtJNrjIro8W3VIfkO0wKXtgpDplCWV+uBZWVsubBGzYK16CiPv9y0c+aPvDYgPVNxPZQG7KJb/DGgwsnECFAXbU+bG+vtp32w8JRzbnjxflBSeazZJ2Nrn27tE0gwWklNINMQn1qfYfTSQXTxk+ie2sRMnJ+5BZUEWKojf9awaUvfDzVmuwdDLBpI5V2c5P2+wLBQHyxIf+jBvQ0DDnqN3Ytr+zVBEuMggdkxqJJB2EQuDVaq6yeKIZ5Wrn+gYp9ZrVrKdP/dpgpfOZ5cDADpCQRnUvCiXZV26hcjtq4SJu6eh+XPRXPuCjWBrOohQ73z0e0cNs5dZgK57KfZiZTrjCA9x7H/SMtV7Idd1mL7D8YHUNwEKey5IS9YRp04ceJPaV6ZbFpIk445EQizWmmbBhXX2d5p+P0R578DtoT4cFqdqoUsH0NrIBD+wU7jNh78SYn28enQgIsNAqiGDWtN5lvKlae1k2yxsy7t6AD9d13YianHDESJqjEYSkUnc+lhXie997Zh8I1cr9KcB1sJeWOMh9GK3JzZlTFc9YpIbkPnfUWC7cfLVEC1Ob1R5XB6Hv8qd4+pwxc9GDzQwkAHfKUYJNta+tQkAikAS3kH/8noUS7oqA2bODvVPZOv7vpAkXKcYbDwRxfE0r+Gs5io6dtRWi8ZtEVmdaNvsz4OsHFhoXpUqxVJHwKxgKXpH75LCJBWv2DMu+9Wd7xz6XRXy6DvfzLRg6ADCtT+vWATuosxtdaOfker2gym765riLV8TE10qnliidfXZZ440Y5MRgpA3wM50BdjYsFoFuPnwIbuZJdmJTVzSvniJd4aIHkekR04BImysE0TLhO5as0e/9nfRUJnw1YGTI/9ng5yZen/ZIHEnSVU9ThlTH6OSAeOun9ayoS7GqGL8cjCNEoNDbgrh4kFdU4abd4IAA3GV0TttZVL/N726aIsubkC0KXgYttgeYXjeg7s8ko/8iOsxEfv6nq0pMfqy7I1rDB1Cof7uCO7SnQFUzKGyvmuV8z0JnpfVT8nCtpHFWO9++Ro6XcKQOgoxIBqsjRP45hFT6LEsfgGWzi9BklHtCvVyFBGrXqKpyOSzyWdwLSEWTH/p6bevkOlLOfvwqAeaEAKkcFeMF13VSTkHlmIruOCqVNs5TJvS1N/VjA9Gzy/NztSqDQaIF7kE8vogN5DT9yNsB/go63sIXFjUpPpnsdA666veE23/cY83xiz3mw12guPLgGqgJqV6AASCJa8XENSSJJDnGxAVNDUIQJOBpfGVt1hCGwS0LReGNOC/FkZHprPfITcFFTihFeH3XaCh8o+Si0C6k7dwQCdABEAu62WLAj/Cm1xCWXQa2tNqMvGiqkYKLxi8V9BdVUQinkREQQlpFutHEO8eQCfy0k2JpdUBWES7HaWaLD/djDLoh3E4VR7qLpAnh/srlsj9IkUDIZa5G44NyWBiMah1EAl2uhq6PyGlDfj4S/eYBaJS5zCu3MuC/xqasNHrZTqUsC/7TVCOugThZ4OdmUpiGzxFUEFNEG5Kxf1uyKU9pz7Mm21MeJ7OOQIFVFhYR8+zrGE56IszAjb/R1V27nb+kwKMgSTI57SUU+a9NoTfUieb3U4AD8AzctWci6qsxlSOmLaL5j0gpE2o/kbOhML1rlc8NUBxPhwE7lPJk4/Luu5I7r1+csXfFeum6borVZGS0LerSV3V6GbLaHq7zVajDcEZk0hY5pIuhoxOa2GpY+bTJTsvCPhx7uVjhsEyE2WUz07y9Mj3avhu8IepHFU78oQZ1+6Mi6/FirzxQxFMi2UcokWWthVScgmdmE6sVr2C76ZKOW2bg65cFJP7k8e+7E3QN3mrEWWKVhZuFme3/0SJLQVmGsLa7w5gOpdu6dcR6KDSodFaIPYI5XQMfZSLAgBzIzpEmZkNWkvL/UCDODcLX/s63qNTL/Ra8nY8KjkDsX612KVlvOXGaoVgpELPUb6lqW+J54H3MFpZ0fOh1yAv4z4i6ZmLeXAbMbCZWu7MMKIB/GCyevVQTi6X/j0bVR8Qh9YTjM+N20AsWp61558pPKh8RQOQKZiEs3WEB8pG+JKJdp1q3JQXcgJ/BKLjQeWRsC5hQ/pYKfI5kaofkFv+bhF85idpuZqkIUtd59cYVBBRGBYUDXouCGJSEfVqWMuaNTahWiD1qGDuJjIQUrT3ndf+ElyVxcbbGLS2tUTp3CqgcXhfG9JN2rxhN3Fo3BsLRQti6X7CpB0JG/rKYh/1V+1myOYD7nPyFrOqQS8x8CES9DVaH40TPY9iFtqS61RCHmaG99fXmtRjT1XugXDRNFMXR/tJjzZmkDMS1QiNWw7/uJtyq6EhmFoGo0cMCroGyeq9vUtnNt0FtVI5mvZEGJawY2uZjuUbC2AAVtkQYe1q8L4FEBIYsLOHVBgA6jiD4KqcP3rs94noMp2t1/Jgtc0bxnK/0DDNfjEHnPXUvGnhKHoE9asDY0pU2MPxbFdfcoO1VvuYfFowtKcs5qx4bUmBpoNczmYZYEvJrda+YoYu21eSiKs2d9ZvWnrzGPkZruU4RPH8SMq4YESyh3HIeGFNfDyAnV7aHzv5BRZNPgQ2neaq+cEPYEfB3jHMfx5Zbnl/jtLVy5LDvW5MEXa28sv+TyLjzRdOIpuuOgWG6a2HSbZh+U0/+zv47izIUJL8hn77wb6Z8DUB21/upih5aMdfzyVfXOTT1lU8LlgfbznYYS6ZstRedX2XtuoQhyztcF3ExZRFTCr+8rYDHe5oyoa+l4JIqzQwVjmX51ff9Lh/4h9XehAe7sFdPL9KH4c3+8mnl1EkwA7Z23mUY761huaoxGVdq0rxFSuMXYlHIUc1U/Jm500ILjutND/Av02v9pCvLTo55j0oMe+nglRsbWKfe4uig6B0sJ97QqNwhmVIagK5QOn7XHzINJbzErLHVDyVYiqdt7f6chBRQDB44tAHqruGLMz2liJseNTOGsFZT872xDg68qEdwOahmihY6Nfq9gmC/gmXaNO2vX5dN95DLOmSgw8v5SgYXqN/IOvvlfMDHEsBW9pF11YpKuN5hjQBneJkatlsfB4+SzOx/xDZs/PrLH6NVfUf6x5Mqb4PVxBD5yeKHk+X/CpR02M6PK/UQ83so7BXmADDr1ygx2a5e0pL/ALvY65VKCz4q4l59Zsv7X5YWwhXjaTVQeJ2FXJFOJUDu8JcrGnyngETW7HpqGyP3LVDTaosMlFieyOCSc+3NLzOJIyYffZv5ucHFnGQWTEB0nOUJWdr+9cz4/byvU0na5OfL4jcS0pWv2fogtC0gHDCvFhiTNzS+ruPfIJHAIAnARMNnqfAVJpGT73djtwojxlsZbF89jn7n++TVk1O6rcyfEzAVmnXZEI/V1C3VcoyKvj6OnTgQtCM7n4QXvnmEEEyAXYCZVgl7tPxAHBSBO9NgVklWbf57VBC9+FfEGr9bQduEYvH7WxfrISKdfS+bCKf1VbTKGisRc+q65/aK56TGiay1hj4cIKi5kp27XCneYkFE0xRGCveuENEfclR4g+uU3UTvIMjeJP+XUTtdId9y0uWEeXoTF1Gz3+cyx5hk8iP4UGR2oOAie6AYEwzxi2ML4KynAJccwYZxxShGw2wUGmbpdvnjOtg2/EgLejk67p2m5jdUE+ivRCxH+yS88jRJOKc6NW1hFdHEcwM0avFdbVo2STHjQR/djEpig3ZUjb8Q06vcioJAeF/nlxgm30/Mtc0zA5LGOJr47ItULs1Di35+gPJGtlhJbFct9fdBLbEe10lmojfEEWFjCexiQvIywc4qfzZQH7FLP4OBk+92YHy4FsolkjHPJHmhNlJAxXMotaUczVHLg2MpJgNF64hbTuSucdQZ1sky15YGyskSDLYudXzjCcf7xUZyi1+Ier319odxBifQDbFqmsBgiMuunzT0rAfKKtGhKl/Fv4kM5m/64Q2BbE6RLCgQDmcdS32qwH1rfjKrMc2K45OqCa8Jix+6B6pHmxiUfTomKJ0F7eQtsSd2HB3HLi7NKvuaOHFa5myfThBWHv75sLrePkx4wByx6A9bUkaa242gsBhDFhG9rXDUFpV7GfFjFiF7/xH/A6o5STr8A5BZ++N1ZE/6iwpSeBZ1nPzxX6dRPejwhjyyou6K7yqhcbcR6DRQKXvNvQKzBcz4x0uRZY3sjrnLo2xXzWyx8nRzxb5q4YDDNzxPnGhUCGNC+FD/RkLAeUUkWEWLPjnAUSKBCijjJPL+ig+QRA77+FLd5a2Lx5do6dkfo5PXhD/8MnTsK2iaCcXyKlQNz7WvPLpiSCK8nXW1fAia80xFmCS/KTNBQpAip9Joo06vOO1+Vs/NCWDKnr1PcFQLeLoptuh8C1E+PL5Km9Oks9xNo7zKU5eJjNLjqhk4QzdJODQ0gL4fQ0xApj8snGG16Qw+71VtTrHV7k9xnVORccSm1HSM8Ep4iqT16dYacRJeFMylVXcT+J2FFlc+g0MPS4Skyf0JJP8yrWYv1sXnLDBUxJUskZyQy2tzTK07KNHGIAT1irEIA7haCmbTMt1G7yozw10aHK64BHsVbzUooT0vnD9ef72yZajtwAAF2GKahgy8ClUb7Rx0f+1Ace3sMvx2ri3VYGROBqPMLVICfHb5ozN++59W59oF7MspBvgCmYCNXEwjhW49lOb6H3Q3QruH3dfSuk3ZkXNyPuOdL2RV6VY/5FuCrdjO2do9VPk4O8WhWjC6t5yX7SmY3itRGnCfIZHSksoOa0m4Qu17/pwcw2tUA6iVhzqprgqMR5rWLcC4NmGBv+NBoZKm7/W6Je0EeTQ4uDF4DH5RJUaW8wAZc3Qb1u14TmqbHjWHHqFozmqXA3M1YPBEnKx5Us2SPBhI3MlYzrghirGojJyF8ej8JAB+0R5MEaOB6ANShsiLDEG863RMTIGTsymiArsU2mStZUFOSwD1mtjCLiEuOHI2Xfrc2+fviPBqsVhfTIZjbyT1/oYO5nmINvheLdiKFBTJc+pCx1pYMLrxRPESXULW0O6G61FPRBU7NJNSPEwGguSCjBQHoE9md9t69OaZeQNJptrhXMHJEa8Yop5HtXsL/LQBbQ9/35vuRfh0SoYWOAg7kzqWyKxtNlB0FZ/1xDT+TArYEKaHAS2BugzfJ0knaCf/hOLk7C9JHVSVOq61IOgaPoX+VMkEu8kklUkC7fZqIaWQ0hMr7TQvzvdjCSqj+deJdf+fboELe2q9inTiP0DSxmp+GWOXh/73PU6P2zQOI9JaNhhHc2ejGhiYm6PNDAIZP8irM1f4sF8vuHjUJ6pvPjKKVI7Sv6ts0pLZ2U1yq53ulEXkfukVLqpoEuZdpQMsrlOoKvAJaJP7neLynMLMKvDqDHKGSY4hnaLWJ/+HrzQZ9dR0ZQGSJUnxDc4WYgMn4E4h25hBLNvgHs86yRxBVLbLQky8/5M1yqLvdmoOrU4x6IzWiPChVlGguLyVi02aQz92WgzgtEYUPvypwzeQhGSYcIGvy1DY4HI2kyhIxpQp1MZejCf2fnRIjSeDNhp/ui/y/htQGR086eSGPFuYU+fgaV1IU5TSShoKzjkSydPVZyNWFnCKW8bBcQCaJ1ZrsmMTK6V3Tl5kXLdK+yB/qIghCFsriA+6tKnh24CpokyyfrzJuKUWqYUGX1AIKSJQIFWeCAA4mg77e8o26d4kUcJihRu016SiG08Lk6je+hOcDmShmfhlN2512SS5lC8PJ4cdD0VLumq41UiBOLUhDVP01Ipd4nNE3+raC/UHRUfM6qcc7OXnA07cn5TQDaXKOuNAR12tXVsrdd7hZoGYrzjhWRdOswk8LS+0CxVErMo9TqgxWhjtqwQ2EZEkAotLslgQEZd+TF8zO7s40lldvcDmLrdLnkjFh11Z1hxXkvB/icxIMg+GV6vv256gSbNCZlNJUQTECQ7LbQVaXlJ/Bggw/l4CT2EdC4lpZHFKX2VdbFrosrQSWWXiozgshnzD/tjlbDPa/1bAY5owWJrN7j162Mvrrhem2NbhIMcfTuEeEyh0uZc0AEagd2eku9XPVhpNZxGivqk4VdMnwDGKSopmJf9HVYFPuFjPureCmIr7WA1SqGIlOicejvzZrtrhEAeT9i9E36VHQ7yPv7YWMtYmogx/kcVMOP+GfDDrzscbS8tPYHeW19gR3g878nX2sEdql3+5Qx5qpZapxKP0zwQ2owuKJRCvMPEHky+4k1oEmHTg+D0/lf48oWaOz9BGznUXsosiA6ZUhVTPW1UQrhl+92FxOgb4R9Kj6i+Jq2JtSqzt9yjyKCgNxV3BI0t6o2eDSIalmbAR43tw+KjmTzYTeZ/Yb8Xto3urJA95VrQCH1cLLmtgVnluToxom3C+jbJr/JT6f5BpsehsATJpB6KjPS2GB4BU5bIJyShMjRFhwUHaRGuOFgwrZT6QngkyHoY+R72wWTf+m/x6cZ4zcgV25FPYi6D/cKsakoukQpeuuhI3OhL8zNDklQvQdyBsJdEmjzeB7upAQ+1OnVUcPD31tYRvR+ksUSM5xZhHlPg7n5sZ9y0j+z91vaHzCouwPv2nomeJnbnOC4Kh3D2HBJbcTEGsj8iHLC/IOaKyNkzHUL2nHFpqBX2TQ2w9Di5gqV6uYx9RLrasU8TMDTA9TwY+kqBLXn9AZuncKxRpTl2ggQFQzBUX0ef788z9Re6JsFVNJ+JZ7E+++1+yu1tD7P1l9J9HgeSv2GJTjjJMvrzdrkoHozaEKnnGIObM4efFgqZNZpt5obepMYexLosP2YcXfob3dDl8ElNH1trA+ebTEyQwmUxSBTJvrsUp7KyQ8Blf/SKsJtNsV0d/EUmP3fYoDstLcVYNoIC18T5uwnu+az/pP87+U0mUv8NSffNzdTyOc65zfFnw2f65GEodXOPJMsPp+xKlQ2zL1yUo0MsoOyWz1OlTxzNDKmtmAf6rLrySLFw2jq166jrF8WNW9wHLn16uCeR0ryRzcpa0kw+t6HUbpwm27YvoB5ZciEdwJqSsShL9kRw5nkJvC74LHl+gt5F97f6zmc2T5FW6TnK7XX9vZxXrsU4ywZWDCGS8PlYf7TzlECsO012iKXx1XRHzSVft5QzyvM67f9U+GY0wHPDiGDcb4toMUoT/FhZf6C4XookQxDhf9tNhjDgLEfXh5QEACto6nWVYiP0q6RAIZgxMpC18kVJdoBuJ2QR+JbGnJ5Zmr9ikzKOl52uYzaiJnHXwJmB5X+EAta4iE3A9VumsOHUvKWVMYTkb67mTqrG85N6ok+0BeZMeVc0SkOjEehepgm/PMLFaU4LELCnII4HNfKYrWsXo8DWbWXNZoRXJrYrLrBDP0JEHFRooon9wzaeSX7pkztIiGOyQ9EcJ8w2eaXszsFYAHM0LMpMfFpSFnWHl/y3wxRJj8W/2IMPtvhUiZY9NWB+FexvGNL9ahIgjWeRqGdOKqwwYyOkHOv/uKGxMrsoe0kLn2we32RksOS/5pOOrSmp5WWbRkvmQ1k+/TEpLaWwwxpHMhaWh/pF52H7VJCueqEb2YVpqHa8VrurF2OwswA9qF3gOSTQrfljqdbzjtvwx4PtNk1R3Etm6K7iJ/sTYeIvMeGDJlPlD18f2e8IFOHzi74dWk8WuhnNadT2SgwD2cHDzYCYfv5y2007IJ30MuRAVHHSFm25lgnwbJ3jCWcPJ8+fzfbyPSomBZtpo3FiIDDBaTyMDBBAjnJsquvl8ocd56wqlCDMPxbDHLbJGoLuyJaNI8j4cqS+joWR1ryTM6enqKLee2MOnAdzXsMB/KGhZYAick/e8uA1XHqnJvmoBwlj0J7PhnxkA9gYNXuO0XLHW0jwRTeFGmpN6T6NEvnTbdVL5C4/sBybnYXpuS1Kg3EgYv/tVLSBFyMYw74a0Qh9nvbYfoBo7buKYN1lAHew7s9Z/jcJbv1Rvit4wFi5O9XsWyAQGhnc/V9HnSr5Ze40N+44Y2qHI2mCWDVkSqX2lg4O1PSKJMv+JR7ilCQ6tWJMnuDrim21q2EUqmMiQwXzYAtAJEIRajZfUsE45+5ETrEfX/fvwiEEQnNufsOiNFH0HxIvftUDlxVo2JuVjG/2lAF8JoFvBYMY/Tdcgo1IygazYCLkXIdWYWnPnF7+5vzI1urzzZXDBvohambt6R8Z/SYdktl3VmQ5PMCXQ9jyQjiiYT857Zv+NFmpZFfQYb74iqoI3f22XIJF82KSvI2cEJ1l3LAI0jCtSF1yHDaSQjZOCD7RkrlFEsvWt3T8gC/9BSHbUFxvd4wNwNhl+dfByRfntye1D67xR/m8ifRXxu6W4VA/CoGtkDhowfH4UUXKYz2sqXlZmQxHf9FFKcmmx2lVi2qP6Hq1ngOs0PR7lEp5lvRYFoffepD5DydoDH979d7elak0QiuhKGx+ATTSXzMZHsR+II/WFh4xz9RgrMV0E6mH/27kTb5d90s9HwAPPc8LXO/0x74i/RKBswFfOUroL5kT1w9CGrCEyAaIluWyxUMNEtJHJIDk2wesgt38dN1LTId7Xg2ghD30rkT3feLt6QfvpKnRgW+8sDBAu88QKUBN1fx8fedodHPJbhbBWq+g45MzgGWrNxFxFoBq/QTD/4QEUTdoZKKcJCOhNMyMv0PItZtRJQSpQ/vgTmmIKwDpmbIytfanhsxZVGvE72ocBvPy/bz2nOKMcYAVuMPqhITDsFSpUlwKvcpPwmPc6vvVKI/P/BJbC610uNiQUT2S4irqItE4N12bhj/EP25miR5Y03G4bR2GyDCKs7R+KOnv2vLt8FynX5cxljNpWNi81PuckLQbrKEtLxoOVreAVr1aoYZG3AmkscYk9ybjaKuV+2znI/wWP7uMzsvpsLw+3+2vCO+1p6WhlDunyv1AO5+Uwk+SoLZQId9K4KP+wCPWl5eyPCyLQ0Lf2RjRoEDT+1V9R4ZsUhIQJ2INOWc25nzUpzSfZGKMus0Fa/7D4pooL7lePiuIA18qsEDogs/WYqNi0R53ZJeX6tK1llivol2ZJ+k5jMSnW3XagyAlUAiEGw2atEm/gOgSqmaLJDF5ICzxmLIT4XbfULUE23HVW04vLuG2ClOtu+Lq7J52tE7ax4pe+QvNwwQqmimC21BD+BA5t21kS4M42fNBbQqTC7CtJk9vIlSaj3tapT+3oyzFIsmJTe4ccNf4zFodF/AzdC3JHKXiAuelmJEWEo1aGo5K4ZzoGTJmepGKYeDRvN+8SLbm+xEwlEMidU0RvS6QljfKMRD88E80pwlnMV+3HuKxQ9Miw5gIGwy7l4MbXU/9fIgKMyWMJXm9euiFzCifF4Y0jW7GqRH7Jf/TnftfMFe14aPOYxCz79/f6RjB5V4qsFTUpdeiFEkyGfX+ss4Ixg/bKt74z8qnpKKVv23j52Xof+wOZkNgtBKdp9FIe+xJ5mZW2KE7sOKIOtUynVm9vonw1iVrw4yTu7MMVzYzNdrW/jFRZp//nzU5SXFtpopPwziJ5/KYnOr8nS3A3wxztena+nnJZwvCDmsoMQ0U2+uXSO+WccO/HhpB41y7Rp7achVt6jr9/fIb4cuk0fDnUHTyK2JN5LZz4G+70I0MFsgrRnedXuXDOOeoz04vzdsYekpayGumUxi3Jd7S/PjkFTCty8EMDK5Nu9UCG7HXiWrcyxMCo/e8GIqiTWw5HT2OROJAu06z0UstnI9bt8zp2JScBopqvoaIrqQB/HomZZfrjMMZ9g3XSnHdp9jsZ/9rBFNm0MlCk+fP08M5XwroU5s7Np9iVpC/SyXSTw8RSwSXVcfsQJJ5DYi1VO++avDPdZxiMc9TR9M94FybcdVBINkrOtmZqNqnCtWqWjEfyGU13Uaf72uNPcTMXPX16G7U8VqOYA+7k4JMblvTcwJaWMJyZ15euWZJf1WOSn/uN/cP+MPdw4mSF3ypjOfO4H1NQJb+fbHmbSJ8vURlJxktdkNBZU0U9sSuC1WzQ4eXBGNwCUrnXLYMKR7nACg+3enuiDWblypDTJxGfDkDxkb616jw9mQbe9ybtua12FyBjwdMNon5GyvTSvyV2+cRfAQvJty1NcH4teWaDjxTbPUhcogMPZ02EcLByz6h8kfVboK0eWKz0+NOj94nf7WFXu8a/rZb+SHg8IImef7QapIbppgvPDQtsV8d51gNTaU8/55mqIR7higavSdURWQOryIWGPCTI9Ajuc1aiK7ndPW+CBhi/GKaJ7ENokHPjTDG9/4P40Fm1wwRrrjQ8SUpS6nXWub4wQC9PoLyIXfiNfU3fVVBN3/ss3hRFBvlr4NTPSxC3tn2kG8oW7hdrTOwskYnXvcFOCEVPcZ15ng+1nlCFHh15yx+T5g5Jn0ylMtrSnGLHJsIO+VugLmrbJGZJcAWw0EYofBtHs/oKVlAW+WMVEiXxkfx1rMkKqO5/w/slzAXH6aJBxD3G/CNzdMVp7DxcA+cbKDmbikiWj7zbTZjqmwHzUFKZ4bFlxd4CWJSb/OqABv/T8goGQ1+TjQnLaXOi3eMhp58ehh/+XH1rEGSQJwffLtQRGd/+RqrKLuV/Uykmr0xfGVWKdBzZoVQU0JqO+5wuAphg/ytio1YX73KcSsrcoScH+P89FqtiS2imth9gGmAp19nNPBmwRW5QxMNKZt22s75PzhDSkIujk6OudDg0zxb6stzvJ1svaOGAlySevz4REnQmldPuMMXHBguFJSAATeeirRg2SrW1T2OHQU/1H0JjgaCbAmx/yinTT1eqPh8yoeYEREUrJgv7/H/2xP4s1nOZPV8SMP2AnNxsgNWjLexiyrkKkk+OYPtXpsfzS0biHwYzKi0Uy0CRJ4VLzK288EgsiM6TIyhWGBIbg6EIWlMKkE5KxsrHkLuYJcNOksaTPNNUi7bPDQUdABvx2xND4jug5ZrwGh95P6uR8Q4B7kF6krpYegMIHDRmxkI9ZfMQ1y+vFT6QzobGHHCHaCWtmv+DX0Axl5+Q9psLPWb7/T8KTUEMQ0KcIArrm2iUwzzr7Ph1ANRjQz/q5RzN2hIKvkQiFgB1ZAqbA40FC6e9xobBihBNF5Waaklphl0n8MFeuEM6MTT5kjFra9C11J5ABl/JFJECl/x/hGlzHNOocerorJl2YEOrYESN6q0xtqEIcafiR3uX9tTq0yPoqxdxcQDAUjT21hlG69akcJVf5qIiJNcP90qm/q3rWaWBcFlPCCQzR9U4VSn3BQti0J554zBNE7+7rwnDv7vmJMmFa4KJ/MLP6e8mgWxYxg/2+wvhgnCZXMEs1gMILtYpIFEw0N69e9m4IAmpdiX9yPH6etNT7hSHH+XnWzOnMvdt90oD6LCCh9uF4hxGFqP1p/DcIGQaC8yQETGLNDI5XrxeoJRa+cVugnbqfgLXN51CrAryuCEgSBLaUPP5MjinXQ2CYuaCOz3SekzQk/MV0XE+6v0vavppOyWfYKzaAD3MP1HpWrKTPz4mUkdMib+0RuKHpeSGhDvDmheLCuyMzBlYAGJsvHS7NmJyhCtzpb+1O2KlHjqFUykmns5Q/R450I8TaoZ32wkLTOJZaqYreBw2jX0bA9xU1aeITlZG4JVoJjcL0N39uyLN+EvgykLbIl/WfraMqPAE8NoJCxuB5LrACwsiX29NvMVpzRv4aq9TllnDF7f3uUMLKBJwMx3DpkwpNyWwooqsl1c7k61aptxx7Whyw2rfUl/hyE/OJasJ8vv2V6jpGZViK8qpBV78RGPFv31JtX0sZXyuGNuxkYF7QscSpaZVXN1WGVUAjNkVTkYfiG0z6kOCk2jDKz7tpZ82M+j7ZZMpSRkE13YvXPvkhJ0ZTbrZycjV+zBdotyO2b62RxtvNi8kGVv7JtL9BXAq6R65Uf4MMtZBgUWU+SYEjJzGHwC91vkbS3IzIVSCiGNME0VQ5tDQYuFZZe6NObDwVPgsnWivMbNnD4K2blD5YDNPoWcSIgT84KTKXoyOF6iYT565BpGMISdPRf2E2sSWqFN3/akmJyIZ2RndyjKiBPocJXJbNzlt1HR3Iyp8tc0N2iA6i3wmYAWnDWIgHukfLr9yIrUQivNJH9SGLpi1FfL3chMOF74Pix/Tj8FS/jk0AoyQY+AH8F2nOLmVjomuQjySXTVXhdbIO2RyKOiw7YbgcDSQwMS+L19Gus1aEOnEcvWa+4+70obq1YXNDYSfOCqTnz0cQWJIaLmIZUTiRgK+PZEDkWE8vUmQraUA8G3WDQlWK2quNaud3eWfiWVybZDHc4sC3mnylxN0k//QOeXJtaIGAOHDmYUgnbSm7Sj+AP0DLQnxy7IjFf/jIpXQZTuN4K0KDL5StUrfU1w3o0tOFSVdvE8cyF+z6gbstUNk8mFRjGOw78Wf8lS0JNY+UCRijdeh6erzuhCYCZbplFw3vgnYvACw+t/U+qcm1BYiNnZGd6AOVGF84tiz/4H26viYI4QeChulcuyRNictqh3HuOH2XZ7zMG8OEibNpYPVpftZ5gTiZWigFtrZdVXr2x/G34rg6G3j+B/ghme7tALMxSZOcUbaW2jXMcoxvvRlTSIX1OoigJVyk7tmylFsWVwv/bP9wZLoUBWWxwF+LEX1zuOYu3a02odOsg9UC40gib76d9VV2w/j70j6LUPr/eQB+6tXj2RFw3HiYb07RJndanSWSjBen4aguTjiXp4hZ6o9MegMiZ8IS5umnusTwRCuVuB7/6a5pcXEcivGqirXkJw0jSQfgeKYAc5X4GlQ8caCUJL75mwv8PiGu5mquvVZW1NJWGIPzd3hx9wR0pU75/TdgKs8UQJeT65+wMPQlNCeA5jARBQ8Dg5GLhLJBcUkNriBTyiRBFqlYznJjqZ1EZNjdLK2WRrSv6fHy7E3+KpMTuCnt7awoHJ+khGgUVP+CLvAult7dORLktOQYq8aHNg7M8nBOAkQhFifq5Mlasmk/dw1OoVK6hfhea6XRZ2DfKcHX2Iz0whvE3nghofT2qDt5l2RJjEPr5LcHjOhyFH2McHq+TT0RjF16VPmxJ2uFKbcnNptCVS3myJU/ZN62kkZgBMRxmD1oILGDHzb7jwu5PJnuHNd/M3nBf08cTf0gcXX7el+RjJ9cOi8jInxidtxINkD9NzXEy60ep3UvVkjFXu9xR2gaIJFyyz09n3a9PxJVr1B/J+vIUeUV8kgpTSYhhJsoSP4qpQYeD1EHdqZGIhnxLlrWPli3/lloaR7pnZ4ejss5CPQpW6DRF22JUipG73ATQVD1MY0+71QeOGIjCzvZIAv91jXs2EOcWBDp32tnC8xOH0Ft8iF5tdZzgdetMdqILy5ngXQ6do1uQY0a3qHeMpKMZgrwLOiJ93Xu0Nxkeqkb6Fl8OTxY2rQ5/4xrV3a+Nuep0/bKPABNMTIXmnfoOwRiKD3jV54No3KtTyBzs61VKIZF2OH0TcjGgXAFQmHjJQ4DwmYBT5V2B5GyB0ia/VaJXdwvjE/HaeT6w3V8/bDGlValo/out9GnpYgFi8/RYTYKFkAu7tYmaDcm6HvqxCgGDAenYBVAfOJhl3RZcRUItxgvQSeWzXnnNDpOqbUb8FnNBmGjjKXS3VXBbQo9ADKjav+ZnH6XGJJnEfZQ22dJzls8GJiLSPA/s4VAVhB6tZG+axgWM0la1xBGDqtcEwAPCr72yUQ3/2QzhTum5lW4T91rsj11a4GpEYZFbvSCtYPKrBHIEw+FIV3KRkfEgCT0Y+ZEayABJ/mnwhRyQjDgW0PLV0a34f/VTGsChCyQ1SOL3bfBd9Jps5ubATxFdDLERwYZZ7/9AHz9s96lzGmB68H+Yw1mlVLz1uKmUJCtaqKHXFkOmmJW5C7qgerOcYxA7Cnuinm021fly67VRDQhZ01faDZhLa5B6edju3fcvrPRpgJVektp02/5KVulAJORoGObXspD/4xlpffmZhf2z55vHVdyV1mOAp37NhOw7gi1Jn4hX2GZB9fJcEzv6SvRIvEXQD5ZY35Kv7Us0ZQU9hKwJ3SFaD8yt97+xIxfbHIuCz+lDv5Bqa55Jfbr+Ua6Y5+a2hNxhWWVfQbJd1WTRHnjRx9+hzafhV/gZ/tPnXX0YC7KfGu45s7ttPze+gSrg66ucBDYz9DlV7ktzhcG+3epJ6ybiluBwGOmMOVVJDIfKJPafAFJULW3KgHsm808ESGm17FcDn+VxPeaYc1hRoeGkADhX9SrBlRGQO5/kAfwkXrj9djkmogYx+BbLbEseeBB5Ug3wfYdq/GWztIDypVdSirlCy/kmHPddVRUbq1ya1rzoQAegZ8SlZZ8liERp7MIM3DyA6l63omLH6dpnjCAr/s98L6peBkdhXt8A0Lx0PFf/XGN8E0jFROqRdpFCuUwLlFwlnVb0cXojDzGrLHqThYTSKdKrRCJ18ArU+yllx+LE0ZwuizEbqhOaMYrI1pHMMHS29ZwPm/5IwQsD+aruFLMkqPGtcdHCtFKctbKsKOVvUEtncYRWOG0h9PypUcLrCdYsO39LvzQDjQxImW4kYTdGjnTHjB9gED/ytpKNFCyC0X2MFrs6IvqoxSZZkKP2jecnGQg1ELlqhJK+dbEUY0i5wVSV6rJobCJR8wk1N1scMmEHJZwTRhP58HoW9x/+qAaaSBSXXwem9lCmN+5p97LTjjhAcLqFuQEg9dxfekhwspx6C/GbzZyLTQgcP6nLsUSJ0suXEZGi79lMT1WhEx9jXOB9bAh/Vl9ultx0jeMwD1uuI+rcvD8MlxoUoeBwh5RiWih3H4ob4Uv2HlwcS77HLOC1mVrvsPo0SPJ2uJoHFGedESe9D3Qi2uU1noz/SaXSec6qC3fIwvP9IcvI0mb8SNIJ3G8T6YFQqEK5KKusPXlpAsq2iyyKeforKoRmiAm4TbRUatDtX+hdpEd7f48Ct/F+Tpi0El5iGoSHeqo9YEzvTbD00nGDG4vadgKftFev72y8jkbG6n56dYZ+E2FCfdk6YmhPuPWHCNzZlMzCkB4qfr6mj5VSse58eJyhUqXosUB575s7BS5t8NGpD71k29WNdQUIXxWqrdUnAhDcrufQVkEJ65kV0ZcLy5M3/28MbYYgqRczvayHbnxzx597DOkiXpTYpp6a6JE9iSWq5EURjsMekKswQ+MAmS5Uk9K28oqnSO0bQNBC0xDEBIXYF4hKyoVpFREs+c8XT4V0/e6WO4Hz7cqxtOCJ6Qn8DVOjgd35NDgGFX1H3DWzwMyeyPEfcx+6VeY+zwBVu3tmUI3TfgSu/7EdwS8uxsyyoKHFOWxKFAXqeGqxQLQge15poidTVLQKRG3/EuUd5b/usSrjuzuD5Zo1MeaqpN4mE/bPt2lkfHbsNkB5Vhif7b1HmmhHpkgumtfqk4oIJ08sgnGnCgvMQo/ObEiwqWOlkFRIs9QWPZntzlPh0S/i+06jt0YzYyBFbMAwjJ0SFIJz+PPMNDXGFfPeOtV2+zlVIuJnvuSg69PJYvsmbZ8shhNk/Zh/lmlCSh6FmWjXuwvwEaucYjqU5AUpCFl95Tu5Uz4DprlUk4PtrTg7D/d3jwAvlrOdrUVlw1JyU58pEodyBEWTtiySzsUiHjLeWucgtWojgWSviJuvMztqCwbJJxFMs+uOxA1NkOn0CnW1zuY8n/MSUL6jCuIuKeElwo663PJmLOJtbnFJKpsLDfVD/1RT4O+ycOP4QFrsJmcAk1zFRm9vGyzYvvsU4fWKm+7l+Lc1QaYktVlMCtz5J94XAmb/IX3GkxoqxPVnv9/oWQ+E9Q5DCnFduPNRs/qe4EP+YsX4xQIBvkUmLI0aubsLFrZ9DkPvw4XDQADqt5u/7Z011iVtRnfInZx7zOgvH4/g/E8bVbq+CeK6TWx0AwMOTCnetJpNxBtvGiPcO64zlq7CcDLXBdjRIw+/tYgd8/nbHLQBuN+d86U8kL/sr7fyKm9F1FjPtqh8wdeiEtIKk/9X8hp4zfAVC77ujP/wmnYy6gSDqyxZg7m2GDitUm3HyXeJg3AHa7MPl+ZIJvF3i4Y2Pqj3Uyb99+m5vEAxZzo8JfsKG6GQ3yUIA9ynG+JHM84YjXovYa/6jCwZlc7Y/JHUL4zsJhOkxlKnj+k4FL3sB+ztf3IgXHS7x77Z8qH5s13rIZvJQ9yaCOFECqFf45mNWTiQcp/WTTWRC6KvB1OOproG5p/4vIBogPyomP1kCSIEmAkXKRvbmQcBpaa9u6fdK/woA5PdV2g4g4ie/64vrxTO3/N4nKIO90HO16wB/T14kqgm7CB3f9QEo/C9Il9sAQE+qx12iIVUAvo8x+sz4BhjICt3QZ1YNokLy4kUcJOWlbRimc6BUP9ysRpLE1aPT8Be2iOm6NIGsyrzM9pZzI38SirwURezL7ZjZXL/9XM1iHUp0VehOBVDIdYGMFJvD28baLhXazJ9jh6S1UYllFBXDyR5ObuNVCE6uOaR2mrz3fOOQwwBUf0EIIOekdF5blnSHTIhKSW/RG6GDiH8qGyPzlG5WfHxcVs8h4uhEPJAUH78lrTBR5+ykdweCN4viqIVzfq5NS6AIAIT8VX4fcRSId7kInOs72P/lX8Xk8nyZAo0jcSL+C8WJ1A1iGwb5dKd0YiNar5z6SCdbFMUp4YYKEoXP8A3TfwmsUfpiUZIEwwKyAMqyaBKAHZLc9n6TAZCpHIiI7PZE3naxvpgG5Yh+BPm6+wOqEHAxOtjTUMiCl09+ByTt4QyStGOfF7oUgCPZyJdqtpZuxiLtNdpF5S4nlgFalNuWMJU835l0okZWHdsn8Lr1YY4qFLn27ZCLkajOjsympI0+JkkErS65TuwYnu3sNyniFOojFQ7YXBWo36xM9qycx5b+x2YCeEGal5gXnYbZrHc3O2O6O/7agjeTsoqTB6CeyjmtCMjMCQjHbf6jCMt7uQfNhYnDMMvGtsc/J+oDK77gQSGyIt1UBpaAawphvAa5xRqgggJhgSZ2FXGR4xYATCO5aXimYrheY1J9UxYwXj5Czj74mj2ZZS3FXx6igOtQMxLA+YI1DwNqzwavisZqIpsRvBd+MzQ2bebT1frr429PasuCdvEgxVeKRdA477aBqMBP+eGVMU1xDM8BQ4nOj1BY4IMkFB+vtq2UDpVtb8QXfwBj7rdimZAWRmSaaB2CW7ZoTrFiQK1Eg8lRUUMVU5bC7IzXFRV2megiwNpMi/gL2o0evLqTPCXusVEcYHhhh+gYVFny8Y4g9aYKpbm8qjxze+dgVZMYRdUgG0FcoQfz8uCliFortfudCJPlKu+xCSGnT9f478Esq3mPMKXp4CkfhyWRoGJ2Nw+NRAi8emw7RdNaerzu65aOWcO9HnxeJ+GYiY/lJSHZ8ZSydeoE1Jf+4bBtqr3Z9urx092kPA7ENuEylD3HjCpunCA8XE+d1Q/rDfKnqZfh386eWtgAkoE/++75znA0jPpAYCHMf3jr+qAlb89dsyJaEr3nz0IxSF1OEcHnKlNrWJw9c3lWZfL7FLYvm+d0XHevv3ZMRNfR9i7yOTh3djfVn/jg/X7B1C3U6ahNXgOgoKob3ujq2eUdLvmMldhegyHsre4ynALPHisGW39nrMXI7jwBI529BtuwmFPG/tCHoF5FDWdLK7JsKbcZvjuw9In+o+MZiVttiiZjs4tubRmHE2KCU6132gISj0dNMUfaIMJQw3/xj8SWGbVGmVJAcNKYsdUEsXhslVmpm3HztnhxI9iMRlnG5sxVsE6E6iHpoCQ3hEjCjOUdNtEn/ki0FKaPJuHSFpCgO6RCxscuCQrLYaqkv/jQkUNQyRa2gzfc7ySw9wGPsewcgU5p9RyPx42qSznwR+h8bkoWwTp1K3QDvtsFwpCyHO/XUcUHRH1kV48SeMbL3s5/v2+Y77pzZ7C6nDP1wOCcc23XTugfKgnVWJO+Yvs8Au6GVbUL8kbrAKC3pkDD+xII8mE2PT/IpLtrEQBmu8ZXL0FQcmVyC9bYsBcL48bGpkWC0MKjVr9gfOFVSN6m1gqHrxUggKi54/cEy1qgbM+h4NiyaWIoy4HNPuXYGBmRYd1uDuqvq1S9y6cWXObKN5dLQhsfWe3IzTVIRKkHtlXzOhJJMhSo/3NhjyseADfUzIpH7pKFfcBU+quMA7CRWXmv2WC+2o81wMZMshf2atcWqSHUe0bXJKONd2j0QkWyKWJvmMGPxW4qxgrJVKfuuGgEiKs03nP1LdHryjoG/JMA/6EDR1xSwxN4h20pDnCcrRSoiIzNFx4sY4Wr1d8GZUJCqBJsSo9xjMi4FPPO/k5s6oa6qlhTI7fxNKtTVJ2WrqQTs1iHKN/3ec56s7S1xJHrzf7KzQgUStYicHDTIxt3d0yW4ujhuzpNBGFRJ7dHTvstDmdreHtz9kxe38OimMEJSBBBQcaDusg+fmtpsP+tXLzrydezvBXgCrYeO+2t3FR2hs8ISY0QvuzlgFcFSGPCg2DPSNfh7ZhuAftmU8Y/vjpQNC2izheOh6C/33GwrQI/mXo4OqLvnoRfI5rzpQKHzGDmirrjcaj5btt813zB6i61ZsAnfondKh9LnSgfuvG5H42+JiXaRHpRgDtanCLy9RZ1zGsWpcBu/gFPASBSVBCxvPmlrKuLolYK0FLk2GrRJ/JJzoTgdk946lxWdF5UZBB2Y95gJVlXgLriJpIq6MyxOtTtjon2Wj6K+RRa1DczU7TOtd/OHcXiQkfcYGN6+USSyO57jWtpP6NUhZJ5ch7m01y4wZkcN3jqD/Zx5pIGS1+vK3kTL9raDtrf7l0GldKXcmnRp20B8e6U3VWGAqwu/f+1q3aVMSgin7X1ZgY1CFA+W4uePwYnJsBreikBkYxHYf7vgA3J9c0ofRCPZrbwbcIAmlpCIosF6sBkvouha9ChBFa1/kOOTnAOKcTZgCSlwpz3D+w36x0tjAz/vjezVYaXMYaljDEG3BHrTVjLdbDweXLYW4R5YYoNYQ9H7H00HSEJPV2e++2y67YWc6OvG7Y+5EipWmogPpCGKyxcH4vupxA54SkGZSuV+kyvs7LbgOkR2UbGRV0fmr48r5FTCl/TevlmkpUnlwlksvzmTGDrAsb7gfZY5w7U0W4bEcEhRPKUZq0A0agQ1xXhiSGicsYdDK6jd6chOJwK2lyTPGWDfqpozUvAnKcF7kBp+q2j1cia3Ww8yqTeAUOheuIdQodBuAKdiOcOTt32ZHFQWUF7DsG2A24aKwnFBCG7+RhIyIKZSGAx9WnTM2tqZn5LL0oOvEhrpw6H0h2LTemWmbdf5bvED/okLUiAaXKdF29ICJ/I1OPnNf32DWBx9WuJxA3n6BrzeljXw2n9EmKn3qFhelzJf8GsEEK0pSAucfeKqHZvpiuQ+mFSCcPTglD4MBFCBw/fjNhQDuwLP/VbM/fy9J8qDEcmV89P3ney8hp/zAK7DkfpmKI0u4eVxB4TnVTsZYVxYxwA2ncpI6Oog3N9APHLfIcN28lNIApZNoUhfVuGa/sYPF5iJ6xCuX8Vhql9buzMrIwf7PsFSDCAzHyYviTVS7P35cnaEQrp2BJEOFpJ8XVNmkKrXopb7PI+EykbV3sFoSKtjR1o5UOHdgP9Ysij9EfzPjkhkhw4xH76kpKiR+shAPDP1ImrJUnZWKFYxUrBKCjnsSeKnUjNDNJ8VcEqcwUssVKO130FSQExxDvHed5CsA6EpLfeaFxJiV8Hw/OU1OGpecv7UslnJxGIkY05OhQw24O2G8CbhzsnZnjMP11da+meqSHxJ6ry9vXhq7db3Q7a2Sih41mXVQYFtBn38vexzQo/C1ph2H0fkcadBLX+A6BiXr9/7WN249VuWsrIruG/UtFcFHSM4PRoESLB6C9kAYSGiSWAYzIllCSFLC7gaOyKY8Nm88VDGcy2AScSvjIihb+q4CwaUx02D0ByMG2VdhZdQDP0YPNe7ZwluXrBtxw0bQe+liPVFjJRr13+7YnxK6sXFJfjGRE7n1kp/OFrSUIyehnmtT2eJoIAKTnL8lMTUtweAiKSrLRn+288tn6c5/agmSLJ54mSAe3vV1b9SlQJ6XEO6QnAfCmYuC6ZE91IHZVogvoYGRL+bTpZGhC/hX0nVJ1bKmxHYt1xYYyPH8r1IQBxWHZZmRaLbB9FMm5Hy+UOCTZAAgeyTcxG+mtnrl4LUGLJvMHgLGfhFZZx5fQ0rv4SZwRiaxMKkmVF+RR/XHynwNQFpXTPJvHsqsPOOkxb1KFH6zRQnSYBKj62O/WVkjR2YbOW4+W/8MUbM9tLrlAp5ASRGzb36mGz+sw12q8QX9vCm9AQ1BoQEcprwo5ziHbqFG8Wz6Zcn3KvQ8p37LEScGJzLfgzJ0FhTRVNumlh1u5iFOVsr4Xo4tAp0SoWz8uWLUomFOGZ8yIB5tz4qK6FDSd4lgseZbxfqjXlQqfSLgQMfUuUPSn0r3gs1RhE5v0RJk278GJrx1iLUqNgc24K3zIrUUZE5ln6hYIKoAXVsMr56gBBIQa7Wm1al+XX7VI+6Sv32B7g3Trmy+Mwe36uiFvO009dd1/HeO0qoC3iEPzLbId5DYFrkHONNLSGVMxi2HtzNh2UzNtbx5BaKKd5lssp2bb4Pi3pFOhbTQnLu6IexVz590PVxo1xYda4p3qHaPfFiP6XrFS9CWumc7JGqd7Ig5QlTDD8m7rYOfxsZPpqxEc68GF1tdr/MOTytewZSr7sckK6rUX/6YzrfB/HRcWAw45FsK4TD6Gl2y2YZzbgklAo9BKZ/WH3U/dxJbOqQWyYs6lGCuKb5K7UMtklUt/PauXC0gxQp0is6CK3TgTWZR4+64IgoTv98qHMPdTPJjg0zSRqPyf4dJ3mA27O/MAi4fbI47Kho3nNPXR6vs1jzrYeRXRBEJPNi68fkDLAZQYzLYXYJUre+7E1N+iaaLYU/h1K6lx2Ts+bgp2zCKiRRs5RP33dYOScGAYGsPseEzUneQQwaL26Lv6JSmNZX9+BdfqIAs7qRAs/KO9JnRqirif8tR8majCD0DTHQ4MZxdiU+DH+RzyOvDfyvLNgmtvc5CInZWjz9J+6Ln8CMKuzN2geR5Yz9FJpWpJ8j/gm2nPvIatVRyavqXIEQ6aoDHmTdF8jRusCsZ29xqyuX6ggVEMlJlgheyVaguWP4a+wjL3UBQeTBhtRMyZ+FJHF35cUOV5DbtraNLA3b/gO1gqQV+L5WBy981WLn45FjcMwonR5rhFvDDKa5OTpe+xY8xDSW0X4lNqUYo9N99xfWpHllZL4Q4074EWq5zTiXlb2QojMNqO/LOc2yDw4Zb066FrGq2Ua+rgZDNXXRoEoxZV0mER6O3SqCciCmWHXQkn+hN3Yb5HxpfnI2a7PDCqIIyjN1/45zhjv7OVrKhmCr95gAPOB9nIbQa8RYtmFM97x1hr69HEw6eYyg3QZWcyG8O9qo7IAkndWgMMORA+fMHkN7dzQ0IXVBfAvSJbSQtS+nuHM1onvR2wU8I3MpE7nBGDpPOgNAdWm6RUblxq7DOQnPkJmG+ptMtMHPV51tWLnsV+vd2ZFhIG4sn149o/KQ+N28bhmkjCQplquyrAYk8KOKyZ7f5efoAAjeHOtL1EyUSFKtj1t5S3cpovAzDDXXAvLwtsgkMHeZl9mj1TtHmoBDzFsDQwsIlrMxETIeDg88ndEiE9sptPvCK6mVmDpqwtMKxM3AbB8StAhlRubdXtP3a5/a7i+3YYnJH2HUtVuLPwMagbNziw7p1xz+5HTIgpQPsYLUGO3l3NHgm67eI7gFxXqFs/IdB3O6/y6YLajOionHcCxIsE1X6jjY3VEzie/LhjjwdYCO5Mfek0T12Pl1yonFiyRpCoTFrxZusTgsTi+COXZuhC5NkWyYy+tQHF+rXJf7LIBzW21NnD6LEerqHl7PiweRVLPkMiuUOrfp7HkdGWjpba+Clt1AaoVRUoK7HmKP9HuW+OyTJlPjtxwJeR4XYKaLrqcQouCSXWfdgHKTqEmJbngc8VK0xqjCzMXtGqBEbQdfhB1X5kVu08yuxtk+CNglTygKIzF53QUsHrjGbyL0T5wc9ZcRK99+p2xPImuXSTow9HOrF9+7qzL3+nmJlKrIjdL3r84Ys35MMnTuev9UPDl/77CKX6eze9+irfHNIi1G7aAJglTe6QPKbjdciTGhu5YqwObaSqB73Zgm0t/a2vykNqbZ2cV6p/8n9m5Ily4hRE6ACqABS7PjhmsUyV+D+CJ1KrJAOgmU0YSvTckFzp11Lz6awApH4cse/0j6l33j2740JLC+LyiiIriQjqMB3M8ZuDhYSZ8A/BFRthxAyzu2++OabQfvJ8uSVt2QGtMo+D+WQvsCfk2fqV4t92SlDgmRQfZwu7AYQA74J4yIDUIWBBPPDVY7Zq0QFI4mVDwPSuIEMdvBq3u1Sh/jEahFp3UlNl0gO6PHYqZW+AofWePKqK9zDOBJ2l18UPetgQ+Y7K+XwHyyoFRNt/4LT3PQ1zH2Dm8Eaxr88qfBA0AUql2EPqvbynQ7cSWhh0FVYyYSsZmKuoptZHZOPE1ObkJXpSCi1mqfuxJ4KLBaCoYROcusLUCA0YFr+JNTn2TlARcjGzseVFRM0AEV8KFZ7Ol6cUYfgB/IWXZP3JiyaOTrtd8qZSi1ITDuIKYYXdxI1/Y+ECKZ2R/My398sxKC6tjjBbOJZLL/VFS27O2+XnQgIQWgcgd8ajvrmQ+7n7W9xBFD/tqr/ByperrHxD23Ptj3z5Jq9r7NfOqGselNjXDQtAzsTN0t4bsXrYExHORfq6FUscFzFIMdVY99e8Uh6Y0R6Bx/9R6AP5PYBa6P45fgBgdqThEptFauLWkxxKymm+qEjJqESvjQ94/KIgHZwjf01QYhSxpraKlBJQ3krkDIrIbjdJlYUCxDa+sg4q3rUBV3jPZmZQpUv87l+2xlYDYa53hMLw0tAkI5sq1vskbe0pPRrhFyziNPW8Ny6t/Zhv5xC67LyA2kTatsz+LwqWZlHxx8GW668ETGZXTUGnrA2u/xph0sSzERpW9P7LFxteEtXS4Ihgam2PICPFCzmc/6T+D2LpyndLzqjMZUV6gC1NqdxoOjlDEaIppN+TyCKTIBk1b8iRLCLBwFvf2KIXetROW4WHUvWsTbqDlbHFwiu7NxS6YZpEu3ZpHtNLBz7eql8+dMFmLp7rV2PmmBg4QyuPQIqOBh0mf0pemWKVaL3MeEuOS7hxh+mcgpr7eVWpqj0rxhOa4fAWbhLqVq675BY9OW4Ue65Q8EnOkCYbHPWqbSELJQr+2LzQNQBTu5f9QoiPNnItv4LpF3iaCBXUSTyZIXvXsoDYuMt8alNY4YJnlWR1Xqay/YM2Ty2q4pp36M5xEu/811v5C3nXQns++WyGjaxDKRqDgifdBNdw/fMoNmfFFGbyBZtvQeBS/+punWoWIld++Npd9qwl7i+6GBnv2zkmYKCmAuul8eBOxnIJkWZAlw8n1Y7IRLwZa9p9T5TWcAKQ3dWGsiALM1Y30quM2JmewpGy1IobV0V5c1VLzKkVd4lZkz3IMN5AsTxb6bKZ3oeX5SIYKYchxDqraNPBkKkFpYjafWQdJRsgLubxZ36KtB5OITnFQJaXgJ7G3b5DV6+l1ivE4caTT7vzk3kYKTyV4cDgy9Fg8sGHRotPoTMkb9spuUgQUa2x0ouwSUZw9vrM7SoVtMpqi/FcdluhrsTrCgVbgJwUvVa331Pfdxk/Ij52R9740eS+AAq1a7HhSNQasWqp0mx7SsxtM5FQYGs0r0FKM0RUrzTLwdviH8ACon3rg01qrCvHAJ0Tbtk13GoglTDyL5UqSqT2H8l1V1gWHlzPvA4FZQiermE1Z3pz+8BqXDrDdprYkv3dQHmt4/mhVLETwfJwUP27slm2Fkhp/ivgKUN/EHdgGsJ950xi4x/4zhAFZYbA/VmraYY1Md0apzpYlo7vlTwLh4U3oOnPXiFQEPE/ApcZjGtwx6GYoY+j1V5mY/wQLlMQUbmW0zbJetqTRoSAiuMEt+or71hiwmd/2nnZ5SMoEY7+TVsyVadeHfqsOXzJrLv3UR4Cdrz+GohVFy4CYFzSa05OqSDjoOBxao14FTMVV21WzRgARF5zNob+/A17BhLl5MLtDkxOzT6irAhPpBzwUU0txGolkA50RwzzSdGFP+a2eoUxInWmmvJWjWLIZ5AGGcTEGqEBNywr+MuEdF83RI8Xp7A23xu/KSBpoBSqe1IMToYjUA2Nm9plt7sQmCMyoavGPN5MLOHUtjqhcxjmPP8XA8ymedPd6jQZUlWiAgg8CvWEukZJJ8B5HKrLdliNM4dWiCtRSqbwT2rne3TgeyOpyBiCPtn5Oe8M+Zv7RSdYndflVnBYoGTEIoCvyV/rpRhvXFJ6iafaxfVkP/MVO88u/Ubz+koNjRsDT6lzNDKak3cgK8SJ40BnPa8FG8lDVTqRd05qU+vU1sArQmmiRYtdM4Fn2w4faNR04Yu8Rc6RbrnrF/fraemyZr4gPLGI5ZjGVQmXw9AKJDQl7maLeC3HlPqVNlxXdcJG4bXmL7Ut77Aw9Ipwcx/v2P2HRjk76/XWRvAfLuXfXZZ0r3Xc5c/e0V3zu4GK5WUQkY7apOP+2bVpgkqX4t2IlphTXj054t+O8/fVyrwZiv1OGX3n5jSWbRt/mVsC5mgwrVqk7xxcTbgawIsdDpl9yl6hhbd4yTpUvL5lQsBXYZHWMidhaH5NEc0ulOs2DY1pBT1H3LyXzM0u1VUTheRE+weaXwNSIr3wkQZVNFKQ42pc5OFwCKq+CuivPAwr828+IRpcQK10uNXBrnsdgmQ9yjJI0liY2vjSgmoNhHyJ+dbpgoGWqd9pIR91i5DKs55E3EzkiDg/W7/A6Mi7w9ULbwvH5bJ8SVim0knStVVD+IjHWmz3B0QzssurW5ikLDkons2gXfMpA760qesAG1j5t8nooyCsss+PTTq+8r/DklnaH8L9YvJW062pKVST2gmbsk5T2awcW2jUKEdiRWJx7uNTB6VxvLW+GztpJp/OGzNwcPWpK48hOy0pBgawPBtsUqhTiB9CGIqIufucok6ivL9m7HFhoVo8MAhFeiaDaVBJ6PRG1Qy8YG4st26OopHGYXWqzq/7iu8gJ+wz7C4036qPUKFj1jW4ZNKS2+xCTiqT6B8OHK0N6HeRMuen66dB9R9/lQm3Za2TwZuOeVozOqQWstPg39eXMcUA4EpN2Wwb6FmMNrzt2V+axkujpbQdwSbrBFpadz3KWItWDXGrDHoIBUmogJqSVfDmmd9oa7mxW0ZlJsw4zGfqzQQ2WXGve9EfqT+mQaZIhZfgJj4XC7It5VF2zfjwwU3B1dQ4b+3k2tzpTXeR7ToAjJV3drnW5B/Q8JVXJEHhRdX/fslkE0YDCBfX3OML5Is4lLZV+1G2G72f+sNFIzTSSDlu1RgvlykE8CCWxiFotcJfczg6VJFfCx8HAvjPDNA+5W3B3e/2JOMCISiLxixPWrtn5qrc5oKwUO0zq0/WcGorgtCE0CHaAZgO1LBTNNNppy1Ibs0HSHT2UE7cDOPXQXqKthpYSZJDjL3SZL0DbCGT50TQUw8eHY1UVuVhO5Ez7J21XKCsyBOnfJSGDZVfRwi9XRG2YUE463PXmSd//HxH0zJDWH93khIn9qctxN9l1ug4QjRTg21C+XqzXzBJAPf5rruTOAD501VQc+3dFF3BNTLLyS8vYj/Z+sFt2F1V4pj17ntbE9i+8E/dreQxP5nzM4+5jp0yZWbfiqNMK6G83kiimLsWA0u0UIHDUv9DjgN5in5z1qOQ/eFzF/5U1HAMUGQfemeBj/TvXJev6csTQJ+prmdL1SpFhyZNbCIkKJKM1W8Bggg4vLkQrki6/4AD2kzYEfygmU/CxiS5iJAGQ/797kHwM55vhuR59hWklOgQJ1UP0GuYW+BDyTHKI6w1EFa0qs6W+D4TYyHjhhECaQusLR6QIZSHpy5W3Xeun6+C7FF2eF84hP3a5fXiPFnd2057TuxIzJCLqV7Ml4xtB2RT/NSSoq+Ho2LQ/BxfGOA1JJ/WXjOi/idskn/fXGorf+1sREGzPkUNlXmZ6kIpv7YBnur2UwpdbIa6BYHZffVpzUNWKcJ/KkaHL1VvuE0CSS8BvLmBG85P8Hl6NHvzzHkgfoyM3URWldOBtIB+w9HyEYw7mOpevYxGQM7L/20eiPlC8SdFANRTM+ac/Jo+qYOU6LkxcqvEQ3ogHx32c+fOrd4l5uZmoi1INSXgsTzgO3jZe94n4cog2S/a298mOzx/Jwm7fgOS2/8mztrFhaQGXs4iL7Q/hA1DZ0hVy8Gf5uNcsLz7CIJ1ywJi+UUc71e1h3GfGfAThFRdlnLBDXBG9V0CloqFJF+fnULhRhx42Qw5tb+olRmMouMkp+rShs19tWS24E9vRNhAWk9NwmgVYzXGX09QMkiyrlvhZhkbkgVC3ct3pN739nXD0gmamDRru1u1A4iuPtjkiEk2ihs/YU80bAUWcKljWXVs57EUyPyq61QFYokJAVvE/ax1mUtniOOeMjVp99GTJwsYsQ8Wfvj37/GseFA/ylEcNbiQODQ+DCNO+BwzEp9/n/1wmyNjG/OVALDMvks/VtCt2tBmVNK9TYuu1geAZxmQhPjrlJ076rAdz7euzvHj1veoFv/ColxEtoXMZD+waw49hkjClHI3jZC6dNCI+7V/oTdfBuBaHWEs3rQvPGbpfwQLlSjV/2ZshyYyPswD1OdIbJfvNLYl2Kb0jKxjnOCC3lsNDj0NaV+yI3k1CW7vzV1ESg701ZJ2bKrMJfaiPFs14fxI9ZuuItW21NBz4/nzRfcMOeCWqCV94j58mzdPluf2jX6MCLrtRWH8PyWx6B6B31v46r3LzFW95LWy6MqEtwos1WtPdoh5Q7fP43zEFbXBiyCNk7zibtCuFZnk7c17L98Kwi5GLV0xck1wV5WYY4mTgj1sasszM2jX9rLjh2mSXDFQx02c64FrDxfNkiHGmwZ+JxT44SdD2yQKDlhQa+K2WXXHRk/AYWeXodOkiQxxfgUnCLG4Ab5jmWOhvetIDKmfJ/hiESEzbC+pMV1VqEve8MuQFZzmfq6z9Do22+/GInJwsI5dXYSmSCvoC3Y6B7lRN+M07/daPPFcbn7Wu61ox9Dlmn2FJksKDtyNz19RP978bCFVGm36qpuwG4sW2WQX03yDORYsW2gIR92LyzymTVLYC29sPsn507W9VjLV+lDlTmpmgQyHUxqVicd/D5pKBabinTLSgc5WOGpugyM28r7zoYSb0nzfDbGeigfSIJOYcB2Y9VV+joknIL3UGcrSsU2BlluL4OSAEhAgT5VrtvljpKbaHL98DlJlVC3BWTsRv8JjJbyqueyB4J+UJdIJpcDe5e2mVAVtHKYYS3zbweHE4BLC55XkyBkwUgqndW65QmKjxVZw1RnbWLsacsk7nKnOw/Ho5Dc7VomosqI+TM8fuRGYKyWmrx35FhDtyOdPGIfrAt+OP82uURQZV4N7mWKbNJ75ay9lMn3KIB+0NpC3FSFpdv8yyY/dfmKBP/2+VDWinvELYrBUjjg+C9VpqMbUSAV1weO+jSNHMWBQJnIyn9P5qSiQRdQ6ZnTJlFBp9ZXfAOZMxe4PZNjFIrRvD48C+CtuUhH4oVwH0s7bTeZ+XTN/3iEqanLm2Fe+GTIQzYtEJt0YiAjBsTDudf8O9CWQ9l5S/W0LJ8W2CaMmbvb1rLhGZJnTwXSzdpIEAt4LotUG2b+V3rDkfgnWn23gcY9MxeXeyURkUD7MFF/z/uHFG/XrK8VvJxP3ZrmWIrG8tJbQ8LSsfW0V7JlVTBuJL/g0vvRqdfYkkCBUcj0gFAwAGTWzauMUUvqRluc4CcAQA2RXCXsBl4EW8/H3Dxh3hz9ngfVSq6GIil/cHYRcjTpbR2kMVP7zLE2g4oOPzDzb+1vLNs3v/IwDqx503sFNAJp2T0BWq9y4MjQJYShF2PjV4yvbdUla/+dm5WbPgJPw40g3C1DN7gKnYYKnevQoqagr6hiakh0+ZLWUAEgW2NBI+TrFt/9z6yTVFWRhlEG51hoHcDFhzWAt5U9Depz73ib/A7NjPWs7XArZh7Sp9/pUjetUZTvOc/hc3UDfamMUzJokk8hoT+Xtj/YEun9jX9QTqau4UXV/6iRk6m2N6Im/TQMM+IGPuvHw8QUxz3dubK5WdIRPmkHL79V76OHYbKI7Q+UJtD5BXpUZbYBtBhCEcmVFrY2k61uHJK9+D3kqAYHdo3E29/181qcNGopM2KIcZ5hpHfSbczGJigtruUJxkd5kE9Llak0TsmuR8Dfu6dVI2nOt2k19dtj9yj55pYSiOueRadbA2sbW4UGfMFSnRv5fodo/NcNSiCfVyp1uaAqGPSqx11baQ8TDBJ5oELv86s7cAWSjs9wg+ajhTgCyC+nF14dcnN+4yl/joftmYpP7Tfe85YHUxApP7fbtAcbybCqbbhnkstAaP+9OoPI/GMJ0C5R711i76LXqUpgDTU5Ch7N82F8ksIfefZ5vvs3nCSvXd7RhFj6ejpBu/HQ4PBho+ZI6OBc81bHQ+kdvCfww51SnCDFrvNj9sCQ2+ud2Gr7933Sr7IgGZgg3beXa3K5kKLcC/ibWvSDouQFmUtEYovX6t0GE2vAdN8SH6jEL7UTd/Nr66r7lRLosn4oFw0MRMbMHNzER7vG/AxjONG53/UVkumM7m7kVme1KAnWC5ZXW/empTikVeTsaztELT0l5+YzP+BWZkLfeF2KW3sKQC9fLTN38lROpHcrNQj4cFV5kaR44ORHjXhbi/0/Jg77mq2BnrP/E9jDtEQUSdmbN0QnwPZ8ApX7+kE4cUcCpL+b9E+2aK1NkH/Sr1zX8gO6j9ncvMQqjQa0NmCboiRP0Jg5mK/mP7T7xdvKsE2z/ZzQJwqIXvOdV2+/qoGvXFv9hLfwTa8dEjQIm66ExzbRtgqlm+PeaZwXTOaY5ydEkaUXaajpaWqXyX7r2Pcx5sTVDGsSRrbAbtc2hbQsHHG8AaFIjiLwTMKovc2+dKYuo4DFVVNuoKNcCDz6646WS2g14PN8UkL9DiuSqaFLyEsQocQS1oNDU/yZKav0VxST9UZ/xXdaVDmL3zw1kH+hVx/F7hjdLx7eqzW1qwsdiKGJlSk/XqxG8bt1OQTVZpU+mJ6+/8bc3+61dVTb/ZKEnVE0fhR677zqNSL+mzebinZE3Qy5Tqqy2On5SAxNrxPDo8V8WvSKo2t6b4ZmKjRHyKKAgpcfholqWNh/ZsKsvPtME/euh43OWFeKav2uruF28/+pvZiJv9tDl9IE7zjxbNe/OzAySaVDmDYqtiYOSM51M/di55iOHZ4up+7a2USYx0wLsZk5PoqDAmsRYcH0y6IYl+C8hozZZyXSj8PliZnszGDLLOrXJfEnvQa2CGVVp05IdUtBnM4umou/5RklNArF5lNNWIXllWTZYN5lcmpkROZJTtIfjQAQ+6NaH1rImQ76AocgY4M+bVs23YLWfTWVGGegBGNLs3xncjDpqMHqnlmyseyu0wvvD+NxqSk+NsdI0Ir71Zutkv8Wci99zh7T9qE0vWkZ+zh0ltKZEtUvTItkHtn2yIkL3MCvlDVJ6mRL1ahhM2J90dFVa76J4uzh/YVZoSPhpbzP2QXmo4I2gI8tuY10bPuqU4cxNlVKV85R36GJespFR/2JGPMUa+ix/AlNxIRx4djU5mHqzQ+b7G1XftPj2XH3VgOZAFwic6Jm/dHZ7CjH62VIkKoeMiILacS5wRfpxWVixhYrWpSDffN4Vgqmnywcg4MI/gQ8zG9MVQwB3ay9FZ0Wj5noeTX4w7qCxHV2Ua8PDmT8SoRw/H+orz6cVIWEDB4JwYCzMFIsKPfOW4vcbjgFZt+heA66LXcxJ+WqTzTg7Ymrhs+toWKHk1YZT4asEEHchJSOadAuRc1R5+T2I+0zgOIW7mh7zWCcTJLXxz62I9kiwpWZftACgFjcZH539+dgOTPAaq+jnAOS0jFC+x6pvDWPfELmGzDJdlLMMH+2/Zijh4eVsmv/B/tDkcFPwVKzAOqlfJFvJTOc9kg/vYR9fFlnrhznv7RVp78tWCGH2XzvaZaYbyuI4br0wpVHa5aAzew6uOsmJxmx4742jtNctbAUFbZYYQgg/4ABEdmDoNcx0vXM5YmiffSizvxcNammR+uEpVKjZa8iYZkDqVQfXd+HAVhDnD2uD1pGiaVwXkgkN/9FVou52SNU5DfhL6VTy3XMTIFmjVGOvQroBnXj68eY7cGfujaXLIXVDBBwzU6S4lNSR3yo+Zhps9Yp8eZQlDnWrgmiyGRb6tcgG3VfNxlll1pqBaT/+EkDCTm3dzV+WVCcspZAiSQDzU4LVw9VL/bn/Y9tgrWea8kF4bJU7DFfAaDUGKgqjRce0fPTqjQ6vqveOoNBnmZ2m8oqSdaRwDLHzBR+VhnguIBOxDzmpYB5NCB8W8kYdAnq6yXN/C8ovLoExtc6KMCwTw632Mf0YdFZzrX9VkwcDObI+sIuORDCyzL5o7QvK3RtbB9RJT50CSJ/mFat1wZ/o4Ni/WpQE0JdipoltXSbhnDxobhJ3k21HDtUjo5E+kMOFHy30hOGcC+c1SEcL4TR/AwjYzx0kHCpP0Gc8GYVDyNBtpT3WIDwWJbhLOsrpnVsJqveiTP0o3shk35I77XXVK0nxpO9dNyfgJj589IyD5S+QE1+JflitW5Xgpbx/Q0/lBYK1/Tzx852Gqal1MUpfskvZNCtHbTnvqrkbPGV7M/ZB+2l4scflvsSQQS44758dvy/7iucdn/iJfzs26IOutdKmv2t+j4yaQwvpaSzV3EMdAITMTJBV+T4AUK+gX1QHmJGXlcrkhf/LnFQ481MDTvfO0zEqTEtnNoJnHeWLNBhcr7Mg/ucGFjJZe6a+tUxdNwPzhgpJYoT2WafbvmdiJ+/ILV6YRacVmiv9VlVeAafrdXAfhuk12+WO7EIn/oBXCScffntlCFTixxr/P1evCe4y+cXuuSavQgRkG1QhDus/cpO8sh0DHAS+Q8PfzHyqXq0cIdDhC3Vx5x1+Cm4gwNz+bXCNZT6s1AH3raXQdXuPm8OyYZ2hHVhuOVbLTn7lv+IWGMcoFfciTOSrwdIErFck/Cyor7a9KUgG+1jcZzPOzFM9CM3dgoOp8pnnu1yU3QHmWVoppfZNsViYFWiOfe7m6bq6Gr8JFfpwATwMom8M8Zz5K5X0D1f8kwLP9XTLxhsnWYI0llb7liaO+rg7qknvoeQRx1pJi0EvdDNF9pkjK6X44W/AtH3zpr23T7IsEYDuuwCo2kIenkhVb64Agiq7xU3qdTz1YGL9mEdY7H0YYxwLaw3pwMjc/TgqvPeXX+Xw6kRUJS6ocHX1iOpYk8M3bGBZ2hacGEyuRvkY7cWVNE3COr7/meTdaQx+7ztWvW75rhH+LbzGxNEWx+SwPeAfxL/m4o02Mu86/85N1XjwPmGwxlGWinknzQ4QZY/Zj7L5fT4XkxZQ/ps+5fdJRJFEFCTIxtP27ty3crIL5ad54wuDyEyXvqNayFnxPKnb0G87VxLKNNarfuKM2Ic63P/J6ru4oCkx+30Sdb/HiQ3x5JJPSDdwzLMvX2XcB2gP4ej3wKK0Dqn9zuLafOCbmorM0lH3pOzu7Pjkp1bvlT5tfw13rRSw1aXHqPAiMl8nVxyKkx9f+krCnWcN9zUQGmO6yGXAQh1p2Zm3liQNa6yucCKcDXU5cZA6WDo026fncDIlhn6e5QlCYTD5QIJ44YEXxRkn/+7bfeRp+tOQRcqxM4ugVtMlv6vEv2Y7Qq6hGFkKpOJPVBk3RcjMIHi6nmcl78bS/pqShVq4Gj9BHMWEvhy71ZeeP8AE5rHzyVnoASHxzjvkpcDLsG+5SlD7o0gHOrD5Kvs8xjuduHtW6FEvpMdO/8n5FPashJrqUQ19g9GrT5QT8R3htZwbcBNSNVJh/Ec0khr2eID8XfCUUXitIUR+6Tgijo+ozZYyK7H8owoiJGE/km5WNtJVQtNs3yKdsDaM5SW5w2QDO3dWsHhpLYG1zDC7mUunD44jpY0YhajNOVwxh3gwjHFOVdOHo4hdLt3Vb5hC3X6b7AL/yG6Ecg1+vbKSTTvlmq/hPIbPVl327Ms7+jWpwymJ77BfnIT7MsE52YWdnFWCkL0LCGwUDkQUJ+YoQNmgzijqzRPTOzOagVhp/xvjwF4Pd4boF5WvuOkJESaZxcH1yOEMEkKmz7XwUdKfVxdzOxThanxp3IzAWFvEKqC3ZNuXkxxEZDcP63tei/vSzLVoTNfz62SskkyOhQrij8AO5I6+lPL7qb4RvLElI3CDOeK3pSIu1ft+5Pol/AjJ/1ZCCS49DOxDLAhONmEcD8LXHAPEphOFY5CC9WHs+IezBHMJltngJc6cns4hCB4+39Jg1fJcEuiYwWfotsnaVeTqpGrI0eeriMtwSYGxU/tuCs7QNOSNa9nTczt6YDJKxaiXk29o2kUHBc/gwUT3QZarkFhlxIHky+e5qSuU0ZMuowEVh3LhkaD6tp9yjmHu+lAvTGnAlfXZC+6k7/lx0fqqFXDkXfZoCl+FFayZtMs0/Ouwz75p4L4PX9HMQG/sC1+9eMuGKBUIxB14DL4ZQxW0BwNi81OgY7NgTcIU7i8mSqOnoQYMuV9D1EwvE3GtyZKLVKNcrGzJ0zytq1vUnnnXOTgW1OchZxghDcqXnREumEslHLc1iPTIPNo3wBaV3Y6X7fXemCZp2t9KQy2apIrrRiURAIBCgQQaX8E1Cm5An555shQFpZ7psCKt1YbZRWidntruO3/Z/xbSyyM16I6BrucyNrLqVLjlLEdcamfTIHsw4PPyXvWrnhJP+To8tE4tBVhuX3pDtfUwhr5HSOBiokxcymJU8Srx+dG5x/E0/+CJ3T42MrnsjZM3dJ/pBvB5SXGpH19n6HExvE9JIQLcS5Arc2GLqh5iaQImTP9nazYy04m1jYSfjf5E+LoJnB0xz62O0GGE6ajUAcuoz51kB4mPgg6rhNkH+gUkNJMCZGXs+ncKbpaLqTQzvoLhbbdu6E1KjhJNej/yeAiaVf40V8lzLvCB2Ao43PLOTwM/hAKI0pFMMD9HZZ86hvYp58djPa+vkmV6MtjBzoN12c28OBG/sLVdm6kRX8OIMgrf6EwGMWWdLRSqPF3nfCPnetGE5HanXrIJ0gqzlylYXX+wZYbW4i9zrdGWv0XZ+U4YhVRhXQXCq6IWkB2H8GdtUWbi5OBypf/WpDwunIkGPBw/z5R2L0bwBRk2TS4C0O+d7/9sCp9hxNs1VzC79My704JVj+OISmp+pen1HDpIexILa6xB2kMhEFlaIrecBAuy8geSO/+BV6WnslsomajAELFm+paL8P3LsrVWvnZENKP3EDYt3AAKgTbgoWfka6f7qcGlzhEK4G14VIgM3Zo8LVTC8IZNtd2a8ImYxLV6utJjo08Xfsq0rnYeUZLzSPu4aksBHlwossY0H3Tl5b126RXMgSqsqQw4t5MZahReQ4QwhhlBYqHFVf4fszWiJrDlEh6HE1T+PNxsohokCRdpzuqgy2AyB3wwbKFIpKrRMp2hL8t2zu6pfcAsJPpZOwBPXLNLudzOLlC9s+IHRt8C7reHkuF4sObmo1h07ysego1qEVxWPALZpLYw45/cnuG5ylghnZX8T/Li3loufFKMpaqq+/cGQZxx6mjWUaV3g7svSFpdv0LlmmHUy/4CPIZq3fkYJX65BvElcSJas/z3OZmOLY4VuwRtVLSkkRD9SgHDpEJiOZ3LeLXtedL21E3iJ/VxZ+qHPIHiNd4Tc1dgKSG5lX8lx/ndWNbgUr9Fpskd1eV4NQq5s1oA4ciZgStLsuov073dE8+QbCMSVCWn5kqjFiCSHNMHuu10MnOM51Hi5My9PyXYEz7ZlQjZ4mrrab41mO43UoduTZra2xWMvdstpT8tLodW+vubL4q8p5XA9/3IctDOa3V3v34Fihr8OSbszKICdm1m8ec2Fhsg5CrQYAl5XtvMBNk/+lJqHEIDLCC4pptdV/JPZZZw3Z5PXyYrtSzOydOohn7VE0WyU/xxyqkQ8g9U0LUrapEh7xZWW+CoxJhKwmQWl6sK+hYCYn4LAjnFO1ir1nSjFn+iksnczvz252u2ZMnBKKy3wGrB5SAs2GJuVDId7kXJlJfY1872fdonCzfSkergX+PR96mCLGaLwoRlqP5lN6VHszDhiWTm3G3XvA1IFAcWOc87/0zSPSHbq2OdwH2vQwTXPjkSKdOUtTLGA++Oo8ymMVHrdqLCv7mNFCC9ghpmACs28b8E2S6dGGXirfccj2vLcuCiUaG25dEpQsmeYFZdOS844bjYpgzrpkHhtoFITu5pA7ohpvJwh1PccfOghUvOlkrVB7GrL23yOw5TCk21Wtvx9GNAiXeChihV02VpL5n67fOxHw/5Xjxc+rawEka84muzGj9IqLLejGNsJTMRIlqUkPHIqZr8VcMn9JqLuYtymuvXrpaBiINlCaEqn2WUzKsV8F5lUCoQNSHKVCPteGZ2by0oy/+u2RmpxgpYVzTts4R+JBUktAUCa7skb93Q8sIIrP9EhNxnnF8+sjR1RWHzAzd3u3uYOSWkFxvUGVWyH1TeqESipXsCDs/sWfgmlpWV/a1sAguVK8DXW3MuLIW7lcBD25tyyT/OS+rqLBFGS3x61A/u2gm3mSmwIhut/IfH2nKlcaUt6dmqFxPfTJOqpqeeMUQAGKvh3GjM3OpM67OQ5MVAweJEkg8Gt96/I1MncUe9vkZtul1Ya8fVHzCn/FozdYwD6z3KWZLCDmMmIlH8B9SaRVPPG8gUWnhz5Dy/FV3thXu5Hvyb3PyyTVxKPf5KO4Tiur20EnIRCJI3pSG6xxGYXY+GmtGrkT0QJluhwMDWt+Qa/VTp12CQ5bOHYWeysDxh+h/6FIYlfGZqD28HRQQv9vuhqqqzoBZEQQ/2yIb8s2kGmeZbqYIWLSqcOhqdhSY6L3jb/Y4USqKAQqCOH8iyHA8/EbLikX/UfMwtuxEtnddUP5jy3K9pYNPHiDqNKKylVJNOj45ZbzC10a8bo/9k9SAwudRnSlpGry1AWAeyZxG/HuEqRLdA6ZdSaJ+JMi6gP2JwECDXOFqzqrdfJNEroXcMsTYwYMQ2AL8d6DKlCK1QzgVeMteC4o72ty6nTrWbnfaS7ekYpNL6Ft4Oi2kFdnu/rvkOpE9MK7QL87Mlqo3HRYRvkqpI+u6c1vc0U9WFzUzoZ4LmCCTub719M/WU86NXLlr2bAwJwq+QK8YLDWwvydQSVPlEcJi+Z3UGhxgLqcPJvJ1k27lQxvDZRbNFtlipWDIcIY9I5+UVFK7zAucWIp/wTLGI3qzvrzscWa9pW7Iid5PnOI0i9j+fxFviMzphxQYJGxL0ZJKarntfcUaDl6ehFq2hn8XV0XCz3JtzRZMVShp8ysjdvK9P1OCiR3H2tr/FfqVZjhvMb/O4fkAxH66PqfO/tzV5lnry1+uf3o8kLpjtznzA7fjrh8zkMZ6HkLj4LKlusbXIT5dDVDr8o2S7uim/WVVVXdvhpcywo9yWBIIgiVNHjtI2XwqXW2d4tKQonxzYYwwWwXgAdsAmTciVjqqoltuFe/qSPcjVE5KVKvckUaodsVIXX71iW8y3nPj51GD+pYPVms7s57tYCfKu2D4NnqwNhsL+01TFOZzZIZDgebe1cAOFDqvhDgbwgRQ7gv76JJzdRnrZF0whVtFbkJtgVHiuBEgdXD3xErGiktQUo+8XQ8IvesUlMQqEbZOasGjYzLdHZncYeJ1unj2vGjkvyAGuBec+r2aH60J4hX0TFjSOL22m5t4hhmHSc8+AfDm0Za5BUiJYI/gk29DnjqD3+6cgb7nnexezrKTEKTMLRtuv01r8v01qHPkZTTXnlkLOT0jjCc7cD4lmv/JT8P0V2SuV4t1i0cS52gtpyyIgDuWA2B4iaKwsVr0CstVrMg6IEcWUcZGnhWJX45Y8wnASOHjQcBPCk/Cpn22tT6wvUHZAqBPP2YFi6aiRZc1NWb3MNXwtGfVmx6lCl+S3qUN1c/xJmAhqDm3rmQPnWlo8OQTlsnrBPj7LKk1HPcQatdQvs48qhimXltGgC4fHSMPZELLMKvZAHg0bD4Wee6AdLDf6hPbasH6FN7apVoe/e4P42nz6whf98kZypJqD4vVJL3vJJg6h7gXSPHxPdPShgKlz9eR/gkqls549Rp2PI0DqT0Dq+okDO/5E4AT3lafeUWIztQyG0e46NJWN/rR845kUPeUInpr+DLiUrPiU8cTeXWRnuRotdKd+YJ/zpoLgnBTh1CTU7HU1i66WX/Ju5fUFYUHj8s6IgvtXoFDbS7CndBnNUqe4Xt8GNwLbI6/NGLBJk4RCvhgxNLHbkA1G2PU1vJudCr3h2t4jZlOlMnYoR5arubsipA5HWyzm26lvR3F8i3Y3MdCiju6al5ZL1lDPOaXdS84g9g6IX1QoWbNoerVFuC38XqsugfSdzIo1q3c4FZwnDGKTyuvtRm190qZ1jI2Bm/ixDEFlcxMAcDZvl1jS2qteUfTuz6xR2ypG0BC4Sc5xfFGwMnzgL/zx1kZYedRNaKu2JYCAUyg5UsKaaMRroNWmbg0yTh/pnHWMH3KDwXnsaVmJdNPcb1ti+Ag8GpWkoBWEfIYqSBoopCw5Dcsut4I7PsMZ9Cbzd73a5O8GH3rRGwH9uBxsV6vY6yMK68f39AC2QWwrQw4AyGtEFeyQeadAVM4zBz87X5PzHM58hFvzga9uEHV1A1sCmhav29bjXvi5h+sEo3UNI83aSZ/b9eqNWKSeVO+MOYmYisByyZpfWB7LavYIFRBST0FGmrn6ecO48kOg30mYry/7kOvQzIEL/1Kejb5XOBSYF+ZudRuZFJrA1i2gYZ0HVOHUl2qE/ul0lmPEfNlydN9u3bLZ+zu4H5/DslkiIVRDXRKgwlvWh+sj6S34/umiXOVjvDQEO11S/oeendTRhrvYtmKZhTdzQ5AglYa5XxR0C6aQaLeST5m848jZvbtJkZ2CXNsxVlydheSXIjIkANlKkHjKTxvucm+DtCW0p0g82tt8TI3LMCjGqv8NsVi9ZmbVUbvXEPTQ3tghtvwvNmC3Jk9CFbAwkNORMrzjowqdLTy2yX6do00Cn4x/3zHCLPs2EITiMSUSIWZuxokx+a+EdHPe3VSREHwL5I9If2R/OzKkRtKrD82dV8CjK5fswuBLm+p+x3e/Wn/fWQbJdLhEiae2JaMUwRu+rSoB75B+qUJBQxnAHCNhtNJX6gHhaYalJuj5rhIjXjf0pvGkN8mJ+6Z7+mOUOAM914lZC5X8Et4njgKQsUmvkmrg4NEf1XTrtZhbjVMMC3UemcE4fh8JEUTEnVWBvdIP8iWBnKYEmZewHYimVdhavb9xOmxbVXhHfvauMjZVQCkd+RJgjj19q5Sg7ZSr3fwZLR8kKID5RD+fTwmMu5RfKl7noGPkBPtN2kG7Fu+SMH8oQ9SMuzaGCl1lrUgLhCVYIjLSLVYQqaZT7k3C1NtTZuP+MUfXrF5U4wKHXfhZMT3Ec+YU0ADWNFx69V4AAhDc8OoADOv5ZJ1gmJPDjM3My9OmSk53F4mzA4+nmb+9KEgcgeOyTX3Z+VidKKYwJwia6GNLKRL8awULvPrSCHTD2z0yJEdk2oT2bP1U4bFv+HFN4YWbOOU5BFUYNPDrEdm/R1Vt135nqDSS3GtdiYK3mCdSQAwyTNT4bD9ly3A3F0jTQrE0ZhnUrC+3ASvML+MEL9crTiAfpbCp+l8VOC2c7jsNxLLE72ORPA408HNLwXnIKhTYCBM9jTra3J03Ac6ha3zFGhj+vSyw0DsojmIk/IjWXq0imbPCkyyIlkMe+KC6JPBFhnk8YfJSkUi/3AftNnNp1xp41G5vYwlatnVaErsK0iEf3SaRWsNxgN+DoBGIB1LD03Lim3tNLrNT0zxiOK/fMH5tABItdX+vHOcfUE0zcKJ8siigxjmS50GMx3voniEPvrKnwEmMnh3efEG+0DRGjzYYxxXWm5qyYUmAZb5MwXiSF97xaEbDvr4G444j0juXv1mTyNtpsJeHLpIHVeX9lWNjauhvmLyE/ckIhSjyloJoursllA2pIM5yJYOlTzfG2YmT1YverKOVktsbOp8XP0DtFIvPJBBviL30pYdgmG2vQqEuv8nz5fG18VDF42dkEFLHmxPqOrjR5NFzIxtFqPl/kyYqIK6ye4fYCrTKZ7PZHJ9EkKKtBObj6OWAa2v6FX46S7GPmEoL9iQ9YVa+4D7ekqwmAv0hP0a+tfltRkx5FX1J2SF5TcX/4XMpX/GjzfMMqIw9ocWU7DIPJ57I2ZkgQ1P7GTetXt2pt0mM9UCcDts28a4oHFcMNdSRx7iptmhrM/le7x3xyUJLKfRae8AKrDL3gncv86E85jM0Y8sWFRTtXIzTKV6TGkpdsVoCYTdc4zdZncdrt7m9DguWwaV6n/JmUmqybK5X7BeUHd+Egbui/j/IYDjKjXEj8LQfqJzFSS5214nah1AshLzHgQXUbOZgCoJN8YKEm/u4HOBFjMBOBkPnEeyvisc6eAgCarBiQ+6Ndyu70HMGuEy7/kgGUioTpCdLsSQxSoE6w2oq7DSBIEp7If9IrLoSwNMXVR1I8aeRBoFHfEVZ5CwXX+/FvMQEZrIKaVELzMmVB9OJlLB8WnuaIdd9cvDk6ZjyssgSa6cqxSXNq3NV3vpGtEpWyVoMyF+dJvbugGIEf8tYvVlL8Nchs8vCZGBUl98LoHI9DskmWeoztnp2ZF5s6JvTMbL3SvJxw/lxrw19d8S8rw4Zs6kXBcFt7RCUAp3M8pSu7f6EWKNh0yKYsEi375jZrl/YwNE9tP9vreO5KUEFWEO5JUh6mH6RWBc4fo3T2fSOzBa/OPzafcpRvno5NTp3gDiQFyfCI4+3T4Tht9hAec7B/FUTZiLS6lD0w5T0+FkmUBicrKq3Wc3q8KXezUu4VneGRtSG8Ed1uQIYSKOHlRAsJQxlqmaCUfC4B5xl/r+tmGDSRrPirAbIfX2X8Vkk4wTV9c2pgl/LhIuna1/qSG3PvXSLi0aMyMhOsAlGYsn04AEy40Mey0iRQOrfd3YZphvD+6DeszRtDZb6l6tucvzYAf+Fd5aprH3tLphv1B+74oAQfic3KYP/MWlTZdwQ39Arr67t6wnnSM8rfo9gcNpO90adQKox608Aqs6QLYo+t/+WMUf8wfdoK0pVphIEYns5g+YEqrE5kYKtLZwykFygNq5y9orxd+B8IPeUaIoRJfKIWyP+lTYH5h958CPn1HnyV2g0w7KnRG4tSUI/7/SJ1G6Wbp+uEmS3Lhgkx8Q95O2hv5FWiT5LbXBSDuYuqEnRNLQS4VJylZ+GK5DsrNGsm0bXbk0D9RpuImTYABpNMfbwBLmtPqjGuxpg6Gc4ZViB+pXAZlplpdXWDMeK2FtiflaJHraTqcvvzmgnFdG5vZfYmBNVheW0zT52xRIo+rYSyedxo7SMACGZ2YJSBibf86mBbT+EViNF6CJvGZ5gUijhJAUk+TeHVJBZpclN/VBMvU8fZHKmRPTfrCd0gCuNoa/mDvA1JL6zoBvVXoEXBRs7UOfZs4oDHdq5jk/tGJX64fsL/ab/4IX9zIGAtKZf37ks99QHKDh7l9/LOUurbqn7uylW9LeStRPp23Uf511xwfqLA5Pa64Q/kKa8c6irg0qGX2+vKdbxLIA+nxKWBhmfPCqdSZjKTuJLhXsb0AH12C98Nu4k0fWfnRGL1WC9KnAo9vA8eEoZSRPFjQTi7EPtQnNd2Si7ltKs/qP166SWz+SRd3EWhz4/Lj95ibdo8fZKRss9vwE5Py5DGCM7o8sKFhs0REuRlt/Gj5m+SGQdeesuemyHB27hum05nqZV0a801CZsSnuTiteal3Qphl9K4PWuQ+JYFZx4Rui7UdgUygk55/uvk4jsHUH0TUqggX6a5+eGj2+rLM7OZ3S2yuvYddSghckH3d5i2+WKgkvbl/Nm+VopaBCARSIYNwq0oAsefzC3Cs5iAIM2mZxPdWp2LgxA2wWctHaWRX6oMbV+O06JYwMyIRrWXCv0/0b+qPtuCgFi9JtdsTpZ1m4cZcCsm7N0ghn2HdrgKDiUMyRS1bUfh6oyYTI9tdgtq7Q9fOJgQg8Y0D25GAq3mvzCt34daH7eryrNnuLeLEvtyCwS/R8+osIVOHZYogjpBxWEa58mXfus/jiJiikvywSGIkC/w1ksQaZGOlcXbdv+30t6Ag/1IkdUpuxxbh3JFT4JqzO8hEK8orJ2Oc+oDv8Bvss1mA97REi11CFCq9OmXDTcicORvtCT0C6stIX2QwlPvampSBcOG+Cp3JfaRRJf3RV5bqPrkOy8P0GaOFRJ9J6Lp+C4P6KzIHAiFgo5EJ0RzFDJW2imx5j/tR38veSr8bF0yzh2p6LNu+2bmN73tTjO/G+xhSxQIVwFLJvSXJj+aMOKOvPrwtaFosWlgFbObG+cKguEtqHmOgs7ol9/yk/xI6wYKC3BRzDQ/kypYExBhqAPcG9wTov1wa8c6fl88l/BoEZ+cvs+9yoIyR85rY5X6mjjqZcNjFaj7l6jwYHPp8Eu0IoJO1BI3GGt5mFJftxCVbggV4HxTdwrvVfomn1AlEXrJvW4JY+JzhP3718yPixJ8g07hdChnjCpvmhQCOrE8DGdTjwpVNDMmNGsSMMtrm8MkGSHe2yohXDinKV1xDMucsj5UJ3BQiSJ9VREAfVw/3U58PbnnKXXcsCntgTg5pc2J1LuXcwu21XsGxsYVEu5MsBhwUYqp4i4xY9P9cdc8+YG7wP2eLwqR3hi3pMq1RTZ1OUrrf6xN7t+3vT21Mj6ImXt5I/p6GqeLzgEIVpdd5Ey10evQ2fSg32Z4UxcOftrtta8qpAaLv0Swej0ZDPT1uAnXbxZTvgKn4Gj/73WmQ6xeAKL7EovRCUkHO0wYBv50gxaLREGoTpRWdemYlPU2sfXs4YO8myK1pQh6/Cc9nzLhCYCZRJnailhoMgNok88fc5HXaLHy2EP7BKMtMt2R/hUc5fIX/DR77xbi+s6b0oRQhBIn5MTDwlU2sottmeIFLjtG44Y4C+ZbA8cAUVyzDa3nJnCaYi6l8izy8WGUYyYKOLvjfNXCvwz8NYPHJi+H9110LLI+1q2NuDBHHkI7SzFxZswvNXCVzklL+Pjgmy+BExIOBhgaW16Gw8D6YEaQ5h+jOTJbA6mc1nGhY3zWcLqydPEybt7Wxw5v0buIuCJYAvDPoSrEKQUVlZ0LGmKP1nhJjUMGTqBT3peZPqxrrthfyrMFFclHqm/aJzK3xMcLA4OmBCl6Id64cL7X6ocW6hl6S/lDl9FszrDZjcEOr0X0wA3X5l2hJsbboTw1R4cROkbxB19NTjuoO0nD2R/lZN7hRZGDwYftoFetgatp72mdzn9oxw2s2LPLx9Mw960jQFQ0zNVxZVhcKKRCbSZjx2TY1Wg/O20Lx6W3lA+XUWvGL5soVx2PM9Z+h/AxlfM54/GNnZNCVb/5V2oPDtXi48UMc0vgDahS2tqUH1/YChTNDW3lZAkoXk5fTG/WsR2ybavD/b7jDQ6xxJxeyRLuOPSHHGCGVDt/QzpCx9Kb5rwzxh23B2KJYLVIU0sHP6gkfTma72YlYxgIhbzTObuGAAdZGyxR6T2xum61xQT2gZCRHKfzThq/LDw8qMnMWdM/QEsK21CYnos0NPPlfGmDutbPdy4oMPoo735POwujfF5BVu7mvEQQTQ4LM39wBTLDcqZ+JR8GyvaqU4Vm+kRldV139FoTGM2EMoNN+YSSgspgbTZgQzFESPQOt72j8k/0DJIbdPrKqWHBdkZSdytqF7OH3TGe6bcoy+bTDeZngYOSddjNLepGHdQ4dO8xC3DhbhPINyVK+cZBqbWQhwMeBjSuxkwjOhqtwqprENlafcPOXXDjuCFHZOKFQAFTwnUJfKHqVOJmX9oMY2LQ3xvQ3AO1dbzWu//ciyuFhR77A0znV1jMU84jnkNcBMFtS0hQ6rhgaYNhsxxWtvun0zAHYp61IQthA9yrK25Txh7vveTm8DDwf0GTFat0qujAU3qYMd2A5/iHqa1WeJt/ZFqaWAkTnwQ97c9kUrC7N782NLg0haQoCJ5Oen3ZHeAlu3rAFO3NQ0/FcEHLSFV9q0BoXMjxZHGYRsWHvIhfb0wyKOZbvlLJaH5D8f3WVREYPTFcHFKUfh3gKQPf/es40VS5vjXiuj5zXJZXEj+DaGzk9iAS1b5mGwL5dwLt2b8SmgT66Lf9o4D1tXHKM28OoXuEOY2M3Lc6d9gSO9ifEENkJfl75UZrk7gOpNYehY0j0J+65cRa0Go7FbW5Jc0BAjpw1CcXrBaE+TFJVAgAJciSEwBDDj5+eFTFlVQbTXxv3g9B/Ewk7H/c/NzVWSYyBVtRNZXcLU1hYV8YNW4a79ScxYYeKxHsKceRbsOLzo3GLzIf3vpLADJ7FnJ1CdIDH1dBn8F3eO1GQB8FBRqXomq/KF5bDAgF8GGzi7XwE3ZCIYuB9xqEYuRrkvst7uu475eQmiUUFqRbiJxUMU95uyme2qJ8ewMoGTt9uzBYewAyotP9xus4BibItlJk6Z80Qs0BeCccOarKSTinQ+IUXx2L0jkXIwtHuqEfhPXPTEErIgbZpN6EMXHraFutYSP0tbiJQiniz9BZTLCbiO0/ISQdFC1rNQ06vc5zROS4M/1y+PYI1qkbkAe9A/oLyxgP+ytH7q6NNRuLC9+bcEmv+mbBkogT9nutg4a84/bvBtN/xpopgTKro2GyKMqud82YKc5ZKmWNSpJPCT5GUlPm9TlQZunmSUWSOzIRUVES++MsLk79e8Ll5zipFumj8U3K1kstuTwOt9eEFth3zHO7TyRrm3f+1M0JpmgYTAffBY5/B2XTePyN0FRUCVs28wtvbl0PBEDy2akrE00N7nNCc2ZHCeEY4z/Vub8mrHWDFVg7H+42F4sfPwugp/C6153RPfu/8ZQndBP0kBTaKG/2FOHdciyuzMY5fGELxEi2NFXqeoF18+mCcHCgVoKLkJSQtIl5QyOeYt2i4odAodTmsAH6vxF75N2XoXBbtkl3z8EIh//On48JFUwcLr3YZknRVTT0SRRJvvbgjeKU470GXXT4Ftb0zYWrVmgmcsmcvvtp+SJhbh+BQ9xNhn+eSetoI2BVCGpQpdqRAjDJQuqdUtonw/hgJwlbbA8XDAvWFi+pihNsainYblkj5rWKioBgkAtpEG502lcUPbGKpIAZTzRa7oZWl2Nly/ii4ohLoHiORdgvWYWXDyYRCU7hqA3/U0QyvUc81Or5cw46lZUa/6YXSLGOeIGD4jKouDO0ssjAJz45sts7LtPLPHWdm7hFIjmOiPtlCPNlB7V58JCQg17gyHm1apwXX0iClpza/7ciwbS6yb0g8iGmp4sxppOm1jzMdHVL8jhKrU4511JVSh74Od6aiXUUn7uFt6lB9c+JAAnzzyDU6bxbHJEGzHl6u64M7sft6kusPnZjZg4vl0S+ck7gLb6GJS+7SQCSy3infSCaUjk4s8RJ0p3uppbHs7fq5qNJ0ezo+r87ZjCkYOrcyfZcmIHmwelzbR+NDPq8PXm+sGzCOSpda0M/t0VrGreUuSIyVnm8sMWD/fzeAFsNLfc+gcRAdD399+DwVeKQyP1lFscDlk9tKxC14jw6XPNKh7tlcQxhORVhKQ7DXT6C22+oGpCLeXWeWKDS5/ooIk2ha5PpDwXRRorqg3F5LsTH3U05B8M4ZYke5fgvoIxE6QjjCSNxnsKGOzlqWxGBZOIOgUpo546f72Nqa/7GkNIjwFxtfqvOMFSJXnk7DmfnyQta7Uw4bvN99gOm+kweraTS7wbdWs6YeLHevMaLK49j8vv6v5O0GkvhoKROive8iRwLAFNonMHfuWTZInzspPVXHVElHPq3SUfH5J3hY99WJLTm7IeyPjrB6oZ0eLmz5AOVHqjNaT42QffsvayCnU0uZVrrzLPLjVYNxa+UglXB4Wy60q96r3Y+y0zoJy96rKme3I2li9qoij52X23cMW41qz7zDOTGaMjgc60JLzGwqTGCXbxu6relbt5Q8pDvoaPEPqY18ncgvkEbXQbBWnj5StSszyu4K/4b062N5eASDv+Y9uBB1tL5O66yJr8Z6V/z6OaU16zUdEj/BocFqHjwvAE15V/inCdwRp0jj/Zbg4+ow8mbIxYQGX9T6rKctykwd0AF0gUOlfwFkYd7knPpH0jnGZ0Vq2LN4JD/DrIECRu4tL0c9pfN3QF76T/1+nfB/ZqKFtXFeCJEZfNaNH2ldZq5GvQS0sta2sq4KhQjfY0hShqJ7mlDvr8uOf8wP4a4CJNJ1bHgzraZGl895ujeWj4rtGIYqtNwYnouKKGLv+cFK3apIIs3+HGpu0V0crV8saiJRwujcn5rcYawa+yTHk8dFfdNcvl0i6XyDdqvEXw1f4n60LQzpv+VF4671OJU/GSGikXfiS5/v5Etzjkzdi3pZKAklnedZEmDyEUERlTYC74Eq82SZ14R8KctT6iErfXGxcxwAj7hk3F4hNCCcAgU5h5nZDcHclbJMXxskEtzzQj1KbUuJdJVyioeMOuz8fptKwCWd5vemi2izpRWjKnYJcN3+1+oTX/clpzhaymSJ9TR769M9/cYmixyj/ka1y9iifGRWCbdJ19nPHzDIPLIkgA00qZTSkxq3Yccmx/U84BVcwBFa4Uf2kyHyAcLmPH+C9+QFWrgSx8X5LJUV8Ee3BUDibPVS9I69PONOfSUsskrbSHH8ZsPiEbvvHl0gPtqt91jMGx6tt9H2iG5aMI4I4zOCwTDSr8rRyvsa6kg/F7XqHvBJlwWandjXZ6ry1xYqztuAmeZHd7qkZCnq8rMpXdAGTsAbgxvGRp05VJafUbqoRAEYstKsGW5h+SNO/VII1Yhz/mzeh4bo3BH8lsih1xXzcjBO5uN3gI4x06BcPWmLQE0nRKPFm03/ouRYAQeYDdA+lxRxcHdfUp30TANfEKI0fgrKuhp0/lXALqoxIJj3YIpt3g4pqxJsMHkol/qOblb2NXAy29B0iv/3EtEDzm2lu8rBK4nkLVKJ3P9ActwnQCE5+IK98UFoISv7R6hpOBjhg2xxoLOAQ9r2MZutHpaItidG/n6j8EBzpIzt+ycstBRwM2IwtQ6LJt0uPLeZQix6V8Has40MwO2eboWV3fgTZZ/elzcKxN26WHvooJm/1hftTvXNML8xR6EzOioNttxMQsHQh/AopZTi9HrZFRIyp74DOwX7xOLNeHjuxWikucQBUjruq6qL5EhLnLk6o+uU57MoXpjCRlcKGSfO7R5mSY9mXs3m+QLEdVQcAxivk78UjROAnUf0+Re77b8yMWsaJSWo0txz0royfu1J4Nbkq0WZAKcjMVQUJ4Ww/hut9TJH23AojBnSG9m7YsQznS9dpo0X+9d2et3WGsbhPRaIUgit7j4TD89D+oTea7ZjiLbdRYyKxVC3lQxVeMxzrb6MoVlVcCV2LZCEPhspxR4iBUrQN+od8Ee9MZnqWtXcDhBf/E+rYXaB2Ik/RLIbIKivKKsaCUsaJ6K4cPbFn45sE4orjTXeL0lHgkDjm9tWzgJe4aOK2IMTJJpsrV7uNw8DgoBScsfptOiUHl0+IF2WNLoFnaSZbn8W/2e9dF0MrkTdMfHhVjvdrz94/AhxagwSKse5MPgVOtEfL9Ft026k8NIoCkRWKpQOpJQVnoZ/FwGx22wbBCDsl8m5by1A0uODIYJM+UiNOYqAQEqod5keb1t6nSabcHM3jg79yhLMLC54g/29sDPWtGofdJbKCCrKsDFZmSCy0iGCrDkHzyni4V+gpK3s5BwCJQ9zukK/NIYfBbP33qN3l4e975FJc6yjvq4VsTjpbZx0UGEXK6Hn8VFan8h7VxuxZB3X3nVVQ1yqIBu/MArlDrKPwla/rTAKZ6JoeP52KBluhTV4FEWsDF1l4f2R1N0FvSUtHLKPLvro4I7CJ4Sje/R9WIAoYnxNJB/ondZe7RgfynG5dObC9eQexIxZujKKEvr1CD8d8NHl7pQWIXPsLCbuOIv1rOOswBPCjPRDoG9TXXlWasKstZs4M0ZeQcTWTFlJLCOfX0+Z+wUQQbobTbn5QBDaLWMC5EFZy7iZp2BqHLUZos3BT1GZxmikTh6bFvYGjocuj9VN652DY+V7J+Njq42lcRjbxkRJs1WjiBZtuR/+sVn8mLMjXsDY8yw+a/EU/rZpeachEJuwdD+iyW8BzDtBoN4sdVyHna7hkKOso19fl6dGpHmIWVUvTfGVotx8ADzwy1ANz+ZXdI93BVgsna/PBcicU/fOqXMEWxPvXwDwkDbhLixE8YL4Aypjd/6ei1UgG/c4MKN50GW7WrVwJjucTg5nE/QN3OnpiggHIYutLDpwyyx2K5yKYO8COlMLG2kdqqyaMRiz4WJcXRtt2dc66rCdoc+xzxORiUqzelSon3SKF1+wAawfJOvZy+b07YY0xrB0DzFEMYsTmkVqWGujTeKfc6tUugIprNQF5fi2m41wgoOovg8I7P8zgr7gNFD/IWq3GsqY9sBKVZwe3qQSi72B4epdDZRCh+wKJh0xJwfiI0CQY5uOqhZ20EQC0owlPe/6blvxm32p7zxQ43oFqYeNEGP1xsmx1pWOpgw4VC/uxFrhZHSuejX7PBYcY1yw++ut3pBinsL57H/kOz9ZGHAPdrPt1CPLlAvdLmfKJ/mNjUhCVvtKs0RMdbQLWPmIMzZ8kUpHE8e4Pf+oVGUAXlUGbLSDtPaRboX02e2ZKeLon2IFVCSqsTGEi+XkgG9dSr1jY84bAdqibuebw8MiIclshjjamGbGotcATQRriD5mlMFO4p9mpJxEbLgzfMfequeSKu5uVbfwR2FI+w3XRz1VnJMduD/3SQmZAolT47JAMKhtnVCOxt6skiiAKJYv4eczz1XgTJSGedI9RT1gWo8szEaA2dyLoDvodjoYBFnj0P/XfyndWa0CW/2pgCxo1nzobSntKlZviAPAYU3hcZu/84ocTZMRax7PogGNMOpUjrcwHAtHw6dPG3asYhe+/m6ULIUpPAcRzve+g/iQ+BSlcDlUQpmVYmPoYuN3aA9aDVYAs2UCDoxUClB6w74y35FfwtI9SxyNs+TPICRnCzfFVNZsFUKQf6412mWlDgjwDaw4e8iypVvSBbTkiUOGhCfUCYEAg00kyOAp2J1qiGwOq18+EeFFZtxZGKZqYa7nliIWcmXUT/ZUUtnweYI8qWO6SPJrk2BzuuG4Dspnt9OuWYukipuP5/yoB/MJ8e3pc5mhfCmHohHvS1pF4BYBxX6oWb9OOJsyz9BG6wYGsakbjc1KDHtBW8k88VwX2rsrQp3YqfEC4isX2jE6HkDC5PXNnUVIm8wQLsQIRe+sWxS0qqpX7ixm/KL0uhNwA2xXd23z0LmFIYZWQHfcvHZY6hBpE4ztVZo3h1SxwNjT2Zt9kfoLTTLKcOs3qererXpfQN3Ykj+Zn2YlcXskG+HMwdbn98J8azXosCxPvslFkUXUF/dpYXDpXaq+GFKuQFmEJEAUqlRYnVS7A7Eqg3ztFKH8MG5Kpis6+xOzUBs6XzwBOrDSf9WYCjZINcJzF223vW3bJQY0Wntjbpd2Xj/JtP0G3x3o4HksjBYOdHhONeXCOjx9kooQu6+MY9hVNgMsZqv7sIRqTr8Jmqi/QlevAOzrJblpZ4SKlGAvGWpH49RJD04FrOe+Twl22pEIMWcQw5giYnOdwcDhVJYJBqxHHYqca85c3bY4RQtwW+/oZb0AWcBtsVmtzAhuxPqiy2AuMs+b2PEN65icvPCHdl4JjDJGtXWHsbbmUkv6z6IwHsCYC1SPXV5LHGRAA2gOOrxMiHrLIRnDz2La+Lk15JXJSOkbZZm8Yy8qfezlmwCXq+6iFtyAVGnzrug6ovZYENVQZisnwHSEyBpP72So7AsmNzS53zDiLg1J3A3u/B9hs5hXwwy4B0blVU2p4vx/i2S7deIPVIPcItgM0ydIp/2v+mAX3CEg2Mf0Zfh5liunF9JO1rF7cM337sHNdgzwyQ0/9OhoUgCH8mZ0S5ZdFXcQ0KwnpPObgmaBBRbxHFP47GG4yHR+bf07vGapOMDBhql1nW3OfJNqNRTOR/H8GQah8X+A0mNX5DlhXPvllda7SRfWpoIcfiL3t2bjVCuWFuo75tE0Cis0S4jS2PusMGFhhiBa1ZKhncxsu984pPTxsiJk6dvaMQNBALsXGJzTCRXolzLrlpqcPQf+imwzKAM5sh/AGuKapRn4u0hlMfao256mCrhLUqgiYRLZU3XD8Ru4ZDN5p4Bbw+AbdBNo8K1lwRrfeRLd1xP53Wyl6W9huxGZciopwBRZy8UELdTrGphjAvQ4IPBLx3HYTUVWdnI0tUlc7lI0afsbqjsgBSXNr6kyD8hcP47VmiRtZILu/15FyB7oo33d4FAH7+s3hnb/iVfNxbmJBFvDm1TpCpK4htxZjDdxjG6HGBGzPb0GyZcbDEKZ420hk5JkOtKyc62m6g8H8LSjDxVCuRSEgqkMd3JVRcTtAHiZ3PDPMheZCdPBOUu7bujMDDwswoRshOaDLdQtsQL1nTEGlLaRLehsRWg6y2M+UQ8HVYg37esIrWt3ncnLYzJuqdxSAYLCcAXWTcyPMil4nAtaYoSVKzLRYCcZoAIKbKGch2v2dY1GeiqpQEIYVuK5Ob7lF9zs7do9eWWJsnNlmdkTygOT9Sl9fMGeMMjuKbz7MZ1zkgNaeO5DdTiEdonyMVXbJ4n39rhH5LVBV/LWPoClzc0gheolKPUAdg4OD2atuVB/xWi6J9uxyeHefxTVSlZR+v62sQw9NdBzl0egRIkgooaJHFyCWvQpMSd17DDPwPUTiu/aPsLQ3WqWUw47ZtocgStrxMyhKmpo0Cfgrb5styRIK72+Vl/V3OU7nUSJ9bHdjzQFUIB0a/cTaIxanPEVcprVd6U9BPz+jh5tFXx66eCCI/yAK/sdNDIl7tDz6bypUr5rzn8rsdKxdubEh42/PGedb6wbNR665JRZxpqLZnzYV7O4jJiVU6ZLF/oRUKgYbKNRnf0hd2NACBGfXOPLSFb3KQ9g1GkG2xQiGX83accYz3OSG4292QhavyNleZAWGnf9ZUWgpPYa44+VZIo1L5w3Z60KmfcFdIxzo3Nhizn0I+wreSgFjhOLbsTw+NmCcXBjKeLOn0TFdkw4zVMpKOlxD4nYTdArWZn0ckMzviHIDDkjsS2DukiGlsNfk51bc47HqfmbF1VTrCxmak00IugFHZyiSXYFAMCI4R5uEdBO+8Qlj6nBtHCsifUpjY/GlGaxw8102uHBPcNEqQ9M51qpg0n8WpePQUsO9GjgaPKLWPM4gHF7EQsqcFtWPHyqCwCsqYFc8ah1PIoiqK3+iY/Hu1enRy6qewOaWSb5RE5+a/+Cls99R1DUsTMB0WdYb3mdC9j+jyB1mSZjH4x+AiJQAcUUYh62iWF1Wo7WSrLSioQ0xLeACaSbRcwO72V5QtAh7suhJwYPAQWNYKv3R4CGDpmr/lS79ugJTmb1Xaxx518tJdCn9CeUNjlAagn08FH98yKUhfVW1Kt8ou26nIY54kryEY6rj1FSs+Z7IvvGhKcqKTrSS0jMGxZ54FXJmgLX932ksrApkdx8k21/bzNyPH9bNNiLBHmOvHwzVSgF6zcy19E+5Pf+l6vpUDQgg10lYkigRvfKHFTeHbYzy6rfpFBnLYPe03VmuP+vf7d9PQ8iu+9Kd3bDVuaT+5F1DcDRp+U3dgSipmNpRSVk4j8JcUYVHWfrhikMd79JxfrF5jbqGoToeVGWeh/Ng1crT+d/9dTiKfieomPWmveRX/Wl5E2ipl619kbZhqYR6vUcLI9txSvw/iDU7+OZ1xyjX+7ENsDyBlg9/z3Eyhj3tOYUQspGq5TrEc26LhPRnPMi5FeKMp8g+va/R6P5/oqZtYoH4Z79IcvE71eWurGaKISxIhDygTWm55k0BOWNM70BwjeOUn0pQUg4nQIYS9QUq3DcMWem1ie5zjWtqNskq06V7m5+Mx2Xa5CwdAb/kmLO2XCzuRhWnDKNi+Jgx+ZQHGS7KieO1VadRKnWIL9/1MfluNY/oanp9PPZHE5xufuR4glMBjqnkOVGzdJ2SQ+p16m22LxG3/Cccifvr6udOAuJcqEsDg+BxD9IhdKEjh/CZTEHTY1h0itZEv1jdY9hwQ71/DXzth/FqFyGTXRchbAbb3xsI6DDVERQHGjI9naKjqfHk1onJgfzOwnmiiAr2CQmfYkUjVJIDmA8ZUuADmKtQT/V1JLqkgKgGzxIaPj6+cOJGF/L3+ODK+j5BdrtnhzvFC0dL4Vl0Fc4Qw06cBRpJ5W4m7txk4rn8thlMAw0RPDl6ctJv1oxV5mwCzRG8fN3mNIASPZsxj5J+gslNyo0Sg5SSuF5Pgh86OUjw1eCOcY2Gs/nzY4fIth5RI+BJ35pd/lt0cx9ZJTFHrBzrO1cinuwMhtYkZFATewIWd33HvGabWFUN1db5uA5RgjfDB2ZkLjAitgfXDWiqia2CYQZqVq44rZnY4bqD++Jl5F23u9ExU80HjBNozvqz9+0Ky+eHi/+U6ojeV8ZLfuGr4sLIHu3ptOtAzClfJdiJJtElWO5xgKUHQQcJOtwIfAzSeRnvvqY572CYpoTGN2lbhSxrPmmSnUpA4dsZ2MEb4O1Y0VHDSWrDNvlWgM0JFUxYa+XUp+jghXqiVtC7/4obtx/0JvBrq7bImFzSnosg19C24ousSzyQ+Tc8D5ODTaeIohuYmyJvJ5CJLRw7Ai/FXA8LwHn7v9xOMVlACeimQKYVTUJ03+Nj0cKpd2gL7hO9G/bl/0hUz0Rxy/1smeJZTOhRxqm74B5GztGmEjbcTN55ukTccNlPFSbQQ096BzUJVGQCcR5ZoDziax/5pmtOIAUo1vdz7NqFglzVimxobzQRJJe20QvC1EmJF6dDipyBRHcZTeL1k8P6eicc5V1vN8hD6xqbaswVF0kHKEPcJJSyZjjtQ8iouBQfKAKXBF3zJTuNLb19yzRKO2exmtC9ZRZKUNM7rvDKSTC96gva7RrMMc7DHFPP+xcvjoiX5WkTETBRGp/rnDWAnnieYk3fi5slPJoW4EN93dLnPoCdo1/Mmem8kdvSjb4LM02muB24rQxzzYnpKGv4ysk3N7LfAfBsF/PlAXwfdm8vS2Bepwtz8gRmkqtaeQLbV9hlSiM8h0sel9Op839kGJ+wfZdos6YmYNdjM704TS4TbvJykhlFKDxDuwUQB6zySd8kaeHBtpuC/lXTrHb4UdImBi45Ms4W/uZoewGU0RfRQNwKLghawN36hUMUJGfczm8ShL97Q/bHasRp88rzmzvGUbE4jToixsuAvitt2m2n/RkqRjmiCYDaFeotoJuj2RsOr/b2wnqB3RgbBGW7dduHHlKFPnqJP2pBRPA/jv5sSsaKkNlC3ZIXQtMuD9IObEukTHqJOza4Ly+reOay0RzekKgO4AwSqlfZl6cQGhpdZ0C5mTjtcTjI1pGW3q1vqDqbALqMYwMh2ei9XpjiMcPDlSXaYhu0REuoobeV3IaodEv56glmJGVilwPbGEKrwZ0MbPmHPJ4vI4vGsaXMeEeLQLqdy4CQqNX0Ey6EtolMsqYwfnQJ3kNuwuLF9Vq0aept5Wexv1HNcH2qVUEUQEVwV6+9MAawKMKlVVxLs3XjOlvf6uksSvzzEn91iDgR3VnFof2ibpkt9W9crY1VeB14m9PG4KElditaKj5Bj5dJLHonorKks9Cr2T1n9sMfkM5VDEE+ee+icKUGxsT+RDTCXsJ+R/mW5iIiJLZhegGydaaBoqAEVjtDELr5pP93w0/n6ZG4D5Gg4gWwjnJH8hoEs9+NVkmqEpRZjZgVyxHnBOUafZeUrXZLqfdyGQBJVokeekifchEOitIFTqAYLOfzbJALv6L41t8GbUFPhexDdC44S8xs9RypBnHPptlH4oTOa0bqMERNYQ7+vVIn2f3XpY6+2r1ymqeQ3XdzDIOrnobxT6j48Ibu0InPMcYkaGSaiKiuFr2gPqAAP02tQtezRqrfYfhRNxFZqR/vOE9K05Mkcaz3dQp9IRQve+mZgJUvi9uK5NQFQOZfC15RUCO+K9GkMf0TTpJT9ynoA4F8ElLXD9qQJ0Lgg/zmk/iJbQ+i4/mNB95Vy4+f2QxFfNXxL9YOh+7iy3esH4dXg6JrhRmV3DyqlYIIBevlWKWp/+maN59Pp87RESM4xSRHuKKaYjBE9Or+JM1kbzvt0Xcs+rUYcw1jgjJxpg57z7EQOPqDDFM4f/8GYNIkyJxKhWmw73tD4eyrzi0jNjw/70oZ/divZa1eIi3NvCHa0dYIxnbrbvoIU7TG556ZvKiYpwAqVxoYwseX23/5u94TRGIGfjpd+UhvMcJUzRK1Py9SgKtnAGPP028UhTMnnCnBoDWplBXtfLMBLM9NaZhgbB+Bn3MiTjd2iw3ogOmETuItLdJJa0Gr1NQOmg2NvrbSxTcQOTufQZmI8JMw3Yf36itRZb989QSm1fUzstU5PLyC/KicCmFPm+T1/JBJw5NUFJLvj/qfpmE7Xqtkqtx4yMkZxlpQNzkzwASVH1qTKV8upPvlJIYJolmtME/vuLvIn5EzB8l5jm/2aD4+UOzbch/Mb9hgdE5Ka6KfzgHeODHNEWXQSBIcudjW7E3GELbXdV4UuE8uQucuhazjnhc4eKb8a8Khj7u3V7gjWmKrn5yxoWxmEWmH5kn2GfF9lfkQF4XpfKf62HBq8EqLwVaEaPxjd7gq+TLgbZXum2zlK8uEUKCHshO9GQXXKPf/vDOq3632P4w8YsN3pz1mJhK7AlbteUUWuOvRM/h6zLy0DVIH0k53dfql2QgzcSAOphSZ3nkoSK3TER2uRa7Ec1p6xqXKCCHELtHU5dI14DHs3FDEqMiO2WzG1KPpvLztP9bQMW+d4YEwLyDmkoaL7gVosszhbxPr8WJX8Ie9jlUzfhMsWMDd6tJJk1LFdJCeuY8TgH0SaGdhY9pbRr7LvNA9eshwo1jXRH4mANBkNbBEf4SJ+rDn9tBtaIX9cQZZQyxbfS6Dx2I5a1/Nf0fwq9BfiQH5qqAi+xtP9Xs28VvXNnWmF4kPiVMZhyQLHGRHEhVRGvP7iPcSKmid7py8Fgvyf+N9o+A8knBbCxkx/i2pJuJ1lFUn6jn3b3N1/0XeUeLnA8nRnqWpfIRnUS8CVBJr6VFyLTY/eizxK0zoB6soy0dfFCDAEO+LmrCGwIexAP3hamAMBQqpCy8EBNEpRqMdr24S2Rz3gTAwM4EVrBpf4jyPefx31be2Sb0JFkrVsIiex6ylpbvcMTUOAZv74DF2Nv33rxyG3MJER8Um5uFkAR0oE4yzNigeXn2JYE9JN5q9g/3JZ5+poVJYXMr9b/DU7KMuWEbFSfAHT+Cs1ZUG0jM8tW323zx8s/jZUEWiXKgdFb2ikTLJYDxRHCdzSWwgVhIzGzvb5hpQocs6thcaVuKWmzFX4mYHDZNPk82YguM/Nheu8+ZDE8wFsss4nePA6xly1QJfhBBeZb4eFMiuwQ+zkIRUXNxsK6qc2jEO10cn0kIGaoeeyoWGvuBzDd0lmk8vERanTr6mOk58zzE1ghq8Evn6NO90Zs/wmPsI+d8e2j777VjqO4vBeYopmkFvFO0V50Zf89eEmd2qGU7srAexXTZKT75NOf+1eftAbB8E3WG2c0svn7voAIKfZrBCKorT+b6ZEEM3e9Ds5uTBmV1X9zbtC0ntSnHC/pRlwVM5Flu8WF/8zpyMHSzxwc283JwZAfMgUpEt11/tgs6TRECUTHOfnG3cmx8vy3sITvAkOLMJF6j3eiJWwE3d1VfSnxJT1QKRopqaNyNZz5TkRnKktZfDMz6Qo3lgW+4LMdLFMnCXd7szU3xVWXFBNy3rgYX3ia/PdZ3D+BrfvbgbF044fCF++t1Ovu3Aqy4bWxqzzoI/heZH4TF1RCM7uu5allprDEQYnhgZ2dr8n1kI/NWPFd135oDg7NtdmGjslSEfNlzNJHqLf2HWojOBKulbk2MuV8R6RnsNrKiXiwOKGRWCy+ILda7AYn3Vc9NDhvQE1bCuo9aQxpD1cjocsKsJPNCSewPwDlgCwDylzeTh2XLdcOWoCX0o3CrWE6ksQzvlidZ3ghV9OhPGCESz8rTY+HyEN2yuTkO0+/LaqorzDL2X2M//pgLrYOUKF+aRPEXzvssL7vV3Tafmks6/n5SN0aHWpCjQ7Q4byDNq5BdTwIIeRldEiV0WWe36JoXaE6b76+kJdzP+k7de1UmWrSViNNumk2yy3SQ5gFfOefeVFH+/TdwFBgBsooXl4xLiMrLGH1hF5JIaJjpJeorSnnYVDkg1+AVWUSvVfeAQ/GQP72JbdU5Nq4ry3ml9mnxCZGFmQKbdZkx2Xq/0DozIA02brlGSl0oE41u5k/aoodp2wbupDPBUEP42VHtg2Pifi3ngLvv2/zFnIAHZIGxWlHOqdP6lzE855Qgw3GsJQKxex53cyIucsM4oDSyeZhgSBhYTG8+Hu3Z7z4Uy/XIxH8kpurLXBnjHeWnn7EuqK/dKGLtvOoHm30QBNkytabd5F4l55TZcDqbqzGVmGatixXPxn+tMWkd+7yoBcMZVNivv5Tarz2Rb75i5KEyR1Suih/V0vKNKK1Gvl/0RknVLgMQ+By5/0jQPLe1sZSa/KbTtZeo901lycHAPfj1ejoKRMPiwcf8mh+Js+GJoVluEk6KElOYZdAGF0w4WPW0BCsIYAiR5UfEbh0FBHjRrntreZRBppHIPq8LEhPB3Fmb7ZdB2YAFQhpDOw9vdVG+8wA32POTQtEjfouwR+sOBBbsMSze2nHwl1z2IZ2h6Ixc50hCdifui8trKe6s54MM8JBABy4myZ8TX5U6PEgsYZZPeszSsD+25caD3lTn6BgiYb6E+vgLGw7wnZ3GBBcl9z0vZuGHl30c/uhT5nJjCEDZapmfVAoikScwBU6D1iG+BygATrVlaSMSIna8KrAi2kNk+KlOd89H4y5VXFdKt1lcsGCAWKVg1i902cIusAy+R75FEKijuMpc4m6JvwBYgGd96JgmGAABL1aeTJavIbOrT+aKiao/3NxFJHhgpODx/lAsImE3/nAiOmUtXjvSNyKbMkCixk4xvce7aGH38ZVmGJ51+cQtkgAIYJI5+uny5L6kJFylDvpqG77KhdBwa2RF1zQlKkAfpdRqshp4sTryPa2NNMxlDDh8MsBXq/qgzoCcXx4Ut86IpEXjE/uksCGilIiZkcytE+jPQ8lezIiI1gBwydUZJaXyCBNvMCtLdeij7TmEC47xlRF29Zw2GlAgz/PbwKypypGJah7rhgki4Dt6kEvTqfDg9k72k6viKgClhKWZ+awjM3brNo0Oc4nhuJN+NGBL2TYevkGO0pUjXcp3nNgC3rf/8CbKdjbYoF2rg2YzsNT9G5XZWrIvo8qWXR11ocKojdoyD0ImHwKV5pnVDbVFgL/6okXc19qjVTbBB9Vs6jEI5OilnsO9AK2yg/RWPN8AF1S2cD1Z+UEZxFEG8QEzBipkiuJYVC4I5gy+O7Cj9vM1xZST46Ycc4W6Eq31Z4FtI3VUxw8Ek3uRZNQkBO9VSYyO1tl+ep1583y1KAFu3bTGmhm8rlOwVPtky1+p0bAUFonlk+ZWiGg32clBzOqMGpcdHr70AzqbmkdtUFyDFo8Z00B484DOpniaD5h1SPQ6IKWTV+BqlmyVDH+fH57WkXw79sb+sMZ9K0X/LY52DUFWV/1gB+ORpiradk4Lk4OyBadhWR+6RotYGmWuNGN0xL6CPtGIqIkyLTtQ74TH97eZai3XRB9XEXLHGuSvIeLgM1kjxWLnqGjn5vj/uvrHNh/y2ZkMs31wVsFHCGbwe1SXRrQXKcMgFMPrCow7HKCbioVIEmAQLf2l3SOrq5YSS2wNgsuFMYrfYFk9UGWGeFsTUgZGZ4FRJOFZi9/2U5bi9e+v3n/XAUxQVkpwEJR6oCcYgCvGx+OVb690db1ihzEfOWh7fJejbNKyhEMxOfrg1qP4L9W4Im013s5qG7vrHURLw55c9MBoBnV6C97KgXXJX4aAGsD3QVdUAQubE3v4DefB6NtsqXD3pKU83Tq20Cw00O5KybTyCVc71jAAjvSHoQID4JLFanhYJTJDY1nzT+bGLbDaLaNQ/dkZGToKN7gRtNc3ZIW7+sdxhLt12m+Oa/+qQsPJlTIj/auG2pa916Nxpqi1+JMekQIsNVcUybVB2nWBWTqJGmrmgb5nCGlBptPAyzestoqRIvyU7ZV6GC9ctlMcMg2KRgyB8hgBFDtgyQlfktijChnsDux7nW+ETeiqRzBY46nr6EaSapJM4vwoH4BCMcUXSKgmr5wJp7dXIksJbRIxh+9ATbCygUAlr+ZvGx4hhTXpryofLUaZMLFL5mVzVabiahGpVqlyJ77doA0UFEI2B6/oqHJpmGBFXiCG/PSiYxlpeJeXxEXAvswliGe31FYmnR6j2CSi4W1margXgVPtG8u3IFYPG29zpSlrW98SYqLRY9f0wiAmggMVmOsDbWRHiPD9rpg2MSgI4ZXE7VTb7XtvX0xKx320eBSahQNETsAfV85bZ/scycUbzdW0Czi7IvJaUD0erLSgyPfzbZjrT0GguZldS+q5XkBZuBbG+/3DOmJfnau/Js3wvI0UIFvGkHzsoRPT3YM652JY1SIv8hBUjd6KtZRO/rofdiIMZnZ+Ye0435HwkmZl703ZUsii8oqVPwOEwNk5VRxCfwKf7e7N4mcAYgN0yvoH/Ln/NxOe/lp/DWquyo0HBE7y5kF1/Ewgu8WpH1JsMcohANEsyGYfx7R+sIxEzErEJ9MTDARqVb+eZRj+iU5YvHlvoLoWDWDJgMxE5qtKFeUAPtpyc278dpmxuKwSt5WfEkC9uWA9+UUCp1h0Dvr6PPywV6IA/1oHUltEIGU1qG3j4BWn+Y5dF6ACgaa9nOMDwAvX5LkThnb8njhiM/npjuKOQ5lYMeoAGUD8LILSKZ0loz0a976c07reBwKlW8GAgTgXCmOajVBdkrCxgXUe45k9swnvHdubRu76k9Ar8DkpCNkzbsteQfXvMZP/Q5/laoqYot4x6R0spxA3vXNCfGNP3bysUEKJ41IJ2kPZ9nSQwz2T7mLDEU3mT/t/AO/o0uNxUDJqor9iluSlzAnYcLGtLkxcekbpPTyP0skV5mcPClfGHujATWBl3v1q2Y2bfJfgY7pEeWA0zbD6rtkyCMBaFGZhKQHb5MoFFCNSZRrO6uyhmg5c6W2QxeZcVhyIQytB7plUTRlteQe2q20xJ35XDVoY+f/irx+buEGFPTuOH9uPppfV7FrvQkf04G5y63rrjCXYFI/SZ9DTDszErzqac6KOzf/MQgTm84vf45BTSlbo3pnQyUFJod++DwI6KnkQW2nn7j3yvQxE6Oi2xMOze0g3bUmrxZUePQiRxFk+rRKliZK8PH0rEkJD41t1dDxXhpxnf62B0vTHrBJaG/tmPPmLDyZfqG5ERpDNoj1rROJ/WyIChSMn5JFps+f6IUZpOZ7VdclPVBMwe/RtRXRjIB5ikLdaGAfUYSZcZwNQ3ek+Fo1Al8PpIpj5Y1J5l51VkaDIjTa1kZ1B899kg8MgOiHQnMDWmsVkApMY2UcVQM5VOhTS+o+AwZmYNer4xFyjlG69C7B24X+hARkos8zrdnSIoawdv6tpfutYnne9vYRHiA5bMOZ2mNG/GMR8PKH0nRAoOF4epzniaJmnRRAlNMr2tf6F2MRiNL+1MiVn9kFSnH0unjCa2yuqohsoDPwfZ+d0/l6Cz+ZFfjlxrD/HnInjy2OvHGb4RjhiCFR0+zUITMy6ZTea5mB/ilGKRxefFbhn9lao0ajWHblwDWvAgmiqlGQfuURt0OVb1IR6Ira2G+4Eel7sKlhiUr3XfKV0zv67CQxShcvAIhMH9gEo0daEzNHkpQV3ibP/LEaInUvGug26j3APmUHFAF3AbGNnTbfqVmiPtUwvV8tC7SWisyMVJseFxvtR/hf2y36y41AaAjwZQ/OVip1VYDOqJ+NO2EkY/WsvhrgIcQOdaMTTgibTr9040AK7kt0HXir6CZzrcbKELYVdXknRlWtqOAvdMIKm2u9PgiR2+YZfAAiCqUMPtjWvm8siosFDL47K+aJrT2fjynsyUF1L9kOwD6Pxg7RHzj9A0tI/hKWI9jN0zvb3TNyMKWlRFLKyoh+NMdwd+MgeoWhJFBZJqwbOIBi7SLQnnMtdSPiB0Q9Gy06OCeR4zyxH6/BPnZpCKZcu3lHkvlek81aKxzolnoC0W5Ti7z0lA8rOpXsiPnnNYkgMhB+OsuREaiE6V7pmE23ahb+0G5/sjUx0OGE+Rvt0p60v/HgFcRAdP0PDIvaiMYB1gvL29nYbmQUHCE8IaW07Ov9yS2q54iAcWTud4RNWKoePHYgtScFYSuxsDRUdJYRR2kAN7tElkvzfh9iN8a9Jtakp9bh1MVP9o96gz7P2eHvvGIpE4UKhh7+PP0pwHMXXaiaES/pi1BaYbkwDOCTCSNrALjkhZ7fp5St/ExvvlJY009nnoQi2w56y7NiUhG5ZXquSdweZzMnvTbAGWY0cb8lxxxFgP/Kx95GZ/WL5IiMQPekWycQOfNxVzLc8Oe2axviQO3xEo122Y/3ezTH8mXv6o7Rj2kQxPoawJ/1A1T8j26CZfGGAQa2n0PV0ryNxkH342prPoka+pjofS8dqcYFGOAA3DroXPB3Xx9ZUEi400T/BV2uVQqj1QAIgdOed4eCOHhfsWvyxLLTEo71wNmqAQG2Fq0umDJpu6nLNRn+4vtH92R4EZB5J58SBgA2xCbV2ul31JU9BoTeJ0WwXnmk2vSdRr3na5T+Reh6gDSLLiKU9+eXyKuZ/mD+ehpxYpv22Q20oKBwEr+ZlW7EKAV18gQB8sPIT0/vttlqrPHwwhw3Bplb2QK+VzwAEW1B7d70VDQPnHVN/Hwy8SPwlJYxKoAmJpWAC+OI5G6HzIsrX8kwdHxcspyYvyehNsr7lZCugNHoeynjmueOUKFPo4fVzy99eWiQBUJwZEVQp+nGlNAXbv5/ubRUd88uvFaL0/T5a+61Tjl81mTm+aX1GmXYpg1yGMS/bQn1FQ/A8qKRPl0K3Ty8lzOJpcOuJdCzsCx88eSGP6sLWVgxNfMRpMokhuTydceONvC0zWABxs4PO4iRq8Rz98v6zNOGpwKiL+MXBv9aXVbFKnhVerbrsZgAjsmTCC0PG6CGyYDrY7N0LjYnvfGil93k3V/iUYA2PbQSNBjFesMBQT2kkE+RfcrEc+uuZ9S13c9faJ1ZDveodtYz9Bz7gQWlbhwM7uXrBNnEu4OIywT8OSPvD0pOuy5xtK+LkNarfmDOzK8zT/ReJSyUhPfmFOwmZx/unWbCo0kPMU84Tqn0kWPFdILStp+ArgGoVxagIfrpJdHCYVzoLJu29pZbHoovyGg0RLmI/+yyNsadNSjopn5GfOpvh+wKVHJYJeEOxtGdjecrbXO5Bc7iTOK0vkGfiCTYFJKRPOVxoiTnqFksMo4GhNq3Tbi+VnTaep9SI/agx80RuY2AgWS3RyhG4eNwuC4O0LTtZamKStutNwaAiAQWJ8DmlJKWfhn68luuMQuBTFjX2UQjyfjzW2puit1hl66Zm8oygWHxjSdAU82+beKI0pTJpycpshJkvrkTsL9CA7ER7GDkmYmUCe2cpedpA0DIiiu8bk7+TEhVWixwRdQJqWjqQq2hrzYuMVO8+xi3tJBWjYEOLsVy8qPj0iiPI2IIY53lmW0sxTlVJUqpTDjy+oZlOnTMtxR2YjpFYW+70zEtAWSoePoTYHm0vYZ10ucq6waZoQdP1WT+FI8zyzuyPD64VMYNHCDQ07QAqD04V/KxTVdFgRp9VW3F09bEhSNSEys5nAPTZffsfsCqr00tGHHeZsWtdOk4n8GwR3pGIzrHy0TosF7VB80bRz7LyvtlH6L5Hnd1BhYExAUivf7mLGlAvS1UMoPIZWGpLGiEUArVUH0gUaqY5yyqSaLoQaeN7akd45XR37MdJ2bRuu4ahCp8ROMbr836VRj53YXgVKSRilhU1dTEbYvvEUHsSSTN2aQj2caihZ5ZyemS5LRHDj77pzB6MxMCYbxvniFbdu32PQ8E7fXOvViZNP5K6E4ES2sBLqc8OMofLLqzhZJNM+S4J2YMpL4vYISuryysQ36QEjLzC7YVA6RsGTA4c9GPgXCRNKVHeb+/ETm3SZFxMO3ne+BW4eTFYY5Hyoa1iKhk7+BO6KQq0ofoCNaV7KgmktJ/i77A6Zli09rBpwbuewV3oIgMu9lpYaPlIjEhcGzbtKFNsCAEdvi4yN7s5Jp/3Z2bVBghEErZ5Dx/xHjlcSRV6qEuKiJrzaA8xBPWqSyxmYVg3yX/IpMq3dV3F7bkzGaFItGd+SiKpk4viqEEi6QgMkkxJYBbrqiHqJt6ib9FLjkgdtDhj1Yr4RwUE9KgR1UrcdQ9TfGmNZ7ihPVVg2mpU7WCspdwwFUMoBgdDf9XBI4DY6MxvEXjrzThhzsJl1BmKls8wzGc5mMIYabESUOS0w5NIhSOQxlxV72QMvmtqKXH1GNmDD0em+OtZOaRzJTauXpSSYPnUz6cWhRsqAFenfDKqVGT3ZmfpyvA4Mywzl3IqVRW9bzXgSjPj9TsBlwtpRMoGoz+1BY7gpaRRbdSPQVyFTwz2XE/hW18FzeH9dZklUxvgiPMtsh115Az54tJBzClj1vlCc3W6Td/TxjA06pIiTk4qaEVx0LkcDTdH59cU5+HkGDLKPL0mlH3oPYK/Hjg1U2DxQtVwMWNAxWLLWN91WDJ+3WwSFy607v/Zy5wkjG3KQNMJ2o5cFhXqipk1bHcOZIsntRG7cY4iUeYhgyTqWi3uHhVbP5IyO7liM29FV4I4s/r3BveqGIUTwOso1bx5wCiHnrR8grx5rxes1vP3T2WeuEjkCm1Z0WduPtnrBeCmyHro9yCHcePnSE3iaMUrZWx9SqE6lSSFjjUcjY5nALQovQnSkZZPrnYnGqVOaYGO9vzEDVL8IcP9zclTnxn0jvRz0YXSKOJAwnnx33bnPGAqDA/gJbPLFJtQJc7LNi890Rwt6BtqC5gkLTklq6HN0OnrRn2Dd4/a5s3yRfjGRbFtUvQPOBq4BJGS0/pE10xON7+00o66aMLOL0+VgFvxmOY8285cewOsVp6J73NlFHI7hVvvlFJ1Q/WcSPPWDicTaNETq8STHXoTPsSDruzF1DoLCOgb98S+t6vuGHw4qL5feA8d2oOd0/swez/MFSgctgQdLpsw9pWaMUlLgWRcJIQ4krgX+CO7PCdwOdyJSAM9yDEdnKzlBZJW3UjfoPNW3GbpIDXLbBRFGvo1UpevsfEYW9E0CKV+JeHzycBQ94urqDxYvf7BW81WWEfcdNvqzd/ZCgppXDKN2nLdbV7xcxVSaXxe2ErL8r3kGOwlmzAWqrjBkslsa5Hq4qGW6pE4PJBYRo3S+bdnz/BvCC9Bs+z9C5n6gvKZRUErlLbcrbDMBQ96LDhVbe42RYXxQjXO+AC+glq0W7bnHvsS6KFprz5z6K7+dlxMvdGwqbb/hzq88zrgyNlpTVr/8UZxvE407tdpkcbHYeiEXtp4lgAjVOhntMavQknjFEC632ztRN8rPhk3SnsKMdHGuzzbR9K0zw2X7s2NLosN+4coYce+okTy54VtVFghuJaed8IkRNLeGkEnjo31mK/+55cLFiCnrIKCc+TAxkmw3KjRjWRDkNU30OucBjXAEqFbC5HoAmWOZ4vErbOGn4kuS4Nt92HESyk/f6cmkQxmsEPmMwHpEkiNgSp47MwuVEt8TJhfB9inltYRPlsCNX8ICzQ+VKDr+AUmZLwW7hrmECtEeQyVJQL1II0u+yUKjLIPnookBo6APKjMxVJTrxgN5tTGczK4NnjehU+IU9PqTjTK1LFZyP+z0XEsPQ5rZ6Xfxso6vPGkrLo02GuuIHlv9uL19AVyNR1MQCU/PMI+iFpeukEkHIySjdgO9b+6d9Mr+jJgAAKMzyhAblrhthNnz8327zoUu+9tqTu4RmJunzUaT4tHDfgNCzYinyCkl/Z0Eq8gx+OxrJOYGOxC9z18S4ql40OOeLx27WT9q6awFlmh3WcNAhBQxag04V+nX9/Z9XzF+Sg3jrWZAfNE+jOQvgCTzAec/Ot/iOC/df1RclFsZRNReold44flX4LXlVbFoGJu3WW1B81KL/vHClqi6K9XqXTWC0XuSs73l3cL9qlBBcpN7tg7toaSXGThmiOrnzDzPamiz0ynYQ8S1GlVsDEVWQE8pMRYasEEsiPS/jFD2W0hRq/UTholR9R3C2ypMY0ywSvK6rwrU+tdFzPRPnQEv+UPU2tCIAPagvGsSGikTwgSxK8OMhr/pRCAZBbST8xUpqD7wtLvzTuokO4fW+8DhB8A5LXaKuDvmcfIvRcwB/WRN3/PoQIuB1V8/nwdokeg0eE0eG81QS64C4VugkEerQki4NQxqyS6VsZBstGfSDRlGCRaxROqxQLQcjDcThI7VJDeDi8Hl8BjTlti2IBFFa0En+TeIiMbsqlCdxJ+2CUJklnm/PgHRspqz14C18k31r6xFbJdWKV3kugxbOiAv1JqmGK7tQ5sSasBL5c7RjluH06LRSUphDT/I25xXfSXGxlmSoxwP4GoSvU+4cYSJLV3R+AJSGy8pzC2LbF5Bc+D5ugBbrXcqdQGRRkgpljUzkgUmKS1m+Wkhpaech2LY2MUdmELPFEhPawjIK7RNnAKoZyxpOijKZ6LE1frs3u+5PqhvifbQy4sh6wZ+35jjVNRfQCBhqKlG3qvl7k7QyNVRGEEK4r9dLrjD3q/LMwvgYvPwWRMisf24/9hjqWsxxCgSj6GFG4egjQTnSTmpajQ6eRDMiSTPISSTMeMyfX6vGQwyXRDhUddrYDP70AHY9yPPHGMg1/FFLb0u210IEUuOOdip2RoVSHJLN8O75jKL7NqtwHKyMdBLx2RX73cBc8O9epCxAvjkrh6MRxNAXnZohb/I6XdrOqpu5Xci4UGLtD7CizyBEbA/wuzUbssgcllJVee4NpFrMcHxZypvHabgjwm+WEg+4vtaX8CBFyt8ZIA8eIVEWnX2V9106/qBZGCEQTQ2uSN4+fIEDOwMLjhLLzSijl8LpqKN9Jj0KeC+0DCcPWwXfBIjx7tOCdkWS4hqr21zWjDJ1IeQgJmO+ZPZB9ukg2xObeWKuNCSkzQ7x7ENmSEioaoYjSGyCNuKGsnBeMGvRQeSQB8Y48g0F+scd40JfOfYS+589wl0RtHEMTEUO6fp2XerjyjeSpnRBXfMZLJlfRS7El8Nr5y3r3yBd8Nikf4Ng//fKCA4VZDROzsae3FJj969V6BMjmluONiLVFu5d5g+Dg+gh+czu48dHdq96RN67ShtANm31cWC8ir+mdPyvPoQ5camVTIaYBK9IJcfMb4ie49evJ7/pqH5mQYMVrZE/XT/I4jg668j3FMPkfYJrUO6GmV2FzJaABXjjsya/s6bow70UUF3cCk+Ju4ZEUp8NsR6ewd4FxGklVjA095YSafR6NTZXsTPruFWb/6VS8P/97L4ZOn/ukB5hrway+41Uxdf0NbD2UdZrSOp6ar+tZ6Bf9JgXq0v4M1U+KEDmbJRZe4sPQuP1/3tCKDitjMtL8zMw4EhrwjESmQrL9qrZul/K+SyYrz2Cbdx0YNfs4wtBxyZEVGa4FRh5YC9SYSNTylugqqEaozuujQHstSkIimBWPYTq5n9H5DA+53ediMQjpsdTpwfWRjt5OXgpPhlSfBmld9yK7st3KxSBcK5zrF0wwxO3LeZEJ5QoaWv+yXD35MMMmsEYYIaKfDYgtTHgvf0u83eXE05eBaYLLj96ej8ay16XJVxK4wcGbwXE++D7jsfj+/nM4EdvXE3gnl+Ti/WS/B9YRaf4LXPBbm/MRuh3GL1UAGWFLhlKMCn0v60g0lvKwtSK0yl5/j+zqZ3v+XqwWK48pW4AXMmlN2rBz/1hrNkD05A5SuRokRrnHD5HS+79VCAILoNOsrJhGX2nDQIB+aE78rEka9FJKRTeRCizSxO4ceeu6NYyMTQJfOzNvRKuzqZRPFzy+8Otw8v/gKkLQfCKfWGH3GpZpISIjVMC8+kNztPqbdB89+/2Pcyv4N6uPPZBaiXcKK/M5PMh5AxB8K1dc0PMf00v/CujjY4HZQZtuc5+jCVXvLe/d0Kstpa2irWdI0z5edQEhwleIeaYo+4rc2SIMeMminEZaZdfvA/huJliH3Q8V4tUd/p8QH2O/aytByPc51+uLeN64I0MdhfKxDhHQ2KIinRDSJnbalbhLA4vsxWaaJ3i262ss6xZdA8iCEL/m//U6AJ8YpBfueQtw4VVeYHG1nZFWOSp7UKkIP4Ft11VtDWYRb3lDoro4EGFcmu30xo87eqMB4L/jvYS1X1a26dmCaWFTHMpJ9u0bweIAoT5oID/IKyxEUs+7KL0/3N1ueBYgonUQuBQ3IKgbhpcprc8MKtePkEf63u7fjic2RxzDeQ7FNUdwnExSRVZwiOlxPaP+mm2fEfD8rrsb2k9ICAzupP6nHMDDqyH/SprGqraeCe+TqINalvcWubN3t7sPwRmFVPmTE3/jtcb+pf+rmheDWHq2QtDmGAkSr41OUPrRFnMVpDdttPhWkeRDF3Zeh9HI5OSVJWxyZbfe7A7We1YC3NbUiRYMXy3cVCyk+inKyB5dIXTU/ttEQ/AZn0VjWbWnGxy2y8uewM4YYAk/IpKyDnkxHfYV0SzMrlKu8kpxy59h4bNdDse+DNtGmz8FaKXKpwZzbwBQgoTDqVh76n/kavaMHUeG5I7VRbuBjX/vaAwXFW51+bpc9mqQTMYuEhLIejbIQ/VDHLstdx1UMxR6PnEa0UBOteMMTT6Qrt+tTTQt1xwj4Tw+U2MMR5prKjkBAg5ZcqLU5amdXyR4PceHO9aWL3JdjJuN+fQGTXAw++kfFGr2Q0yPJGQyNpkBZ3OmqY19kUAa+WDw9hWop5Ff5JuJ6GLhIlGrN4P0KPriWMCfKHXf8Hq+pQVurONtnjVxRVnKb6YyNivAAVyivoc3RCUgac8tfgh0gIalEbqPlcryVYM/ipQhlbikeghQNOUepXXbCqCSVLIURoFcyOJ2u83+7TxWBDnttREArsM9XGTcXbVmLYkYhvWSjBC6u3zYOETHQw4qRRbAHayb5kNpPOqIKmZtlsfo2embTebuNbS2WlAu5sZ3jCdH53lwF/Z3y91hi5vpLw87MPX1J//9r8jzKjdqZfouLuiZyK0EN5WICPwlt+kr8kIs9RZPmNmYkGVl6SDfLsHGPR0BEiNatcnUoQmfm5JWsVUbS1O27oiHXBAI8zqAnHONCwp3WCoj7lAEWH4xYNdJHN0RJFgdYl0Q+KAx37oLMzQNgFjbukOh0YSRI0DPwTUpU8aefRfeHrM3p2eE7WlW8lrX1472tjlt1q7TBYTRJL9CY+jgZx/HwPt975cHQZybIuhsMA0k89Hij2bNK4kkb181w2c8eorkilXGduVY0nJB4P1nKU5cAPYemwyYGbP4RV50QrB4AEIN+OkFhSo9HzAQE6httALf3avt81zFm90HCgtGayy0kwVZFncDAElRn5Ibk/YjJpEoxXncrv6d2MykXRdEs9FYULnigsexIDcYN1aKOJSMRhssJpVZJcGtHiLkp649apUKKx0akYAuw0uHVJSD4d/eQ3gwZXiffFItJ7RhqzD6foJmMy0hMoLkSlMXOfehp0Q7dGhClWAKxiA5lKQHpLa5ax59jdsaNE3dKx0qZY9My9RYFlWT6CoyUrXaxrzZOyBj5eWo6u2ghocMcRewEIXqRtzgFRXM7Wbj0z0QvknObGDdB5N8crS5oaiJvRPSuGZPMPpFhcIBzFca7S5S9sUVpAIShCE2HE2+ud5WL7xFdOpZWtRno04u4rcoN+wfQ6q6II8+F79mDwAvZzADr+2HjtIX9EGbCFEzOpc51HUq2b3J749dLbBPFN+QOXiGdpo7XqXpt5IV+ibK7wTa1MS3scB0ROTu42jY15OlQC3E30GNopT9qN6MnN8/4qnKrBZWW4oKRu/aLBTEvbpK5C9F+lCBSFRKS2nrHhngJfJ7JGbc91JpWL0Me/Whoc17stT3H99S0G4yq/4OVFg4XP0rZFKcOwhmAY7M8DTBf8bBvRjoTSLBShkmUPtoMUf4lZbWGWl7FLsGLQE0+mHErVD+wv7Q+IP5unkbFjju7MCuG9YPzgvBE6cqekvdmUbXjve63KMWKkLFvVkF/mHYd2KaCraWzo6LwwUADdVyT/VLS+iY4dP8feNc4jKZ+2mHJ+1Ley7OnW//C1bv02EGmDrhL4IriSsFv3sRJI+HYxKozVJR8CrQ8cUyPEXWs6mQRwYRtVwNHMaKQgtIZT5Vium2JH6zCteNz26+swQBnYQlvcsKNverIvQVHUDKJR4df7x79D+gtHqZXa7GWDeOxAhwSd3l3SZSuku2Avp4kSSR43OkpHXHi015Oev+JVv0cK016AjyzdSfKG5UXXqBto1vz+t70QD/Vt5ZhuB6mDsjkcdRv6ViwPoJ9JN53yCXwptkUtzhYEkphXEkYChnQLyn22ID7ctNueZnCxilRD6xHOxjxUR5nQJxd3mvZCr5144vocTFHWcu5nkEu/FkjiQadC8kRAGdrpLpAprj3Gn7YXdfqQ6Kycu3TccM2XP+W/qgegRP7wwP1kQVMmadQHpYn2NilEQkWWN/VqmN3r3do4wLGJJN6TggW8w2WTBnuuvWVw5R7FhqUlZ1E2VajM+gI0Cjjgj0BdRrB7Twe5k6UFgf2hygh7PgkX9x3uMWPvdSDZBfwPPrs1JtV1thK5XK2ATsO+It/ZwFLD4WMFFciyKzmJdx+fjzlM3dJ1F0i/nc9iTJn6nlZmkuFm+5BxohZ7EiomZ3+2bDbLxQ8ehX4+BdVjmZdDsIvwu6qpm1nhZTV081qtwtC19VkL+OIuGWdOyjRcuLkkzLlqDHKLvhHfma+UFjZcjPyfCqoWvu3/YV7HHX3mgZeI7I0INc+hiSsBiPz19kgqTaaUvTZejU/u3auSsknjtPvvHQHaNqB3iJjNm/H8N09GVUTyY2BD25JuBGe8r7sXDImpIpLUUnp/50RWaa4m0h/QG31jgdU5tZz/3xdBiDuY5XeMpeevF7RpU/W/huMB1rpxBjSRLy0ff+1LIZxeLexCZJoReCnbWFNdBIK5bIrrfAKt7t3wMOPz0fIqwhWL1LptAb8oORB/aCpTkVpSGoYx8tXGuzDAygZZjVFAi7XOS38O1Bopf0SsQOc0OIlCaxD13yjHYQjwcovd+TAcOB8NbqFJ9RyHwjygt8RqSkHFYTKdHZAbxksNnv/9jZXcrwUOQlTpQoMY0U6DCTDc1I9Mj64+3jz54HUSSKVpOyMNwvEXDztMpMhrwg1aifY73YaKM/YiGMFFiPf1+irCCuDcfnnzkHh0eGwzi4rBC5e5u4vadD/mCiLf9JFSyVcAO+u6nd246ve6EIZ6FZfXMChpzwBrgyhVY1HnAWXwtOEqfCkPN5gy3fVIklHZhl4n3olqiFmwxtAE9PwYLzdCVZum4t1ZWgw2CMNf5P5AChLCKwxrimfNvcf6kbSWq40RvghRWnAF/U2ofXsUDCR706IQ8S05Lxe1p3a66zcQXjOWPrDMd36a/2qn9wkhsIdOxw2rpdzx75JvAgL/w/Ic9/nSbjU6GTZK8HfZCwOYS0z27C3GnJdHpnHgywhRJqvzi11zswgYPfSI1A1MUegaG/h9SrDYpVRMrmJbKFjBVJhctoQ0G6C/+HqGFWUECj7IdQz9UUCnh1X3VA9e9pnnh02x8GXwu8biBHKnja+w7taMOIiqGdjzvfG83PmareK7+sd6HbxyxrJkfTN7xBSTT7UNWVS3XVVB4fxvplWDUqZmT/9ZcVhwyL8gvdrgcjZvMtlkQK2oVtkrq2BESCAyJHRZjAKG0y4Mj+t15xqd9zL63cbDYF8cVQrXNwthsgLqQLaFHo4ugnRki1rmi4BBfiveNOWjJShTGqzMhE/oklaKpZsbR/BikmC77AjfQ9On9Zf+GhMzYEABI/6YvcoYzGRD8NvdWDRHLKkY3C+C3Sc0AjfHgfK3429FDTstf2AHJaaWLb6aLh3ZDTaWoG5SMgfBdSmD6C+l/XRjX783XXrgjcoe0q5bWOYRZa+YO00q1+9Pvm+5gFaNBcPMOKhX//gBdeLafpuqOOyGD2DPqnFg5IeaTJXvvM11szJCIRMrmh2nQEGXzwtmC9cKuHhFY4w3dS7H6JswL/NVI37emqHPV7o/lwFv9BRrWiBnetgh1CTmjHKAtKNjJdE1SSLgrt1tGs9OxNW/3RQcJdTBlSjcLMy4VqIyeoyt+9nyi+gCdmySGiA/1bz8O2lpbx+furmXvQiUxMeZyBwkP/5hBGzs5q4e+rxu4fDPhTKN/eOKB0YMr5WlOGJrv27qGHfxLQy9kGI2o9l+4ONi0r14z4Foet6frYXZIyNGCup1JSx/K5S7o8ag1tYNXTKqWfZZcSSxftpMfkadYYE4TVneARrJaJuKRHvnyqbdtevsdmzeYU119bj5SiOSsSexRY4Oh/AMRrDWYd+Mkwdr6B/QR8k4m/e4snlQqE265Cr3lM0Eat0W7fyApwFSbIuwEEnOlP2jG7/zk/NfL0nK8Tb2YwwOlvkJSGn3YZtPdU75i9GbddvUSabLLGZeJH5TF4kVVSPgi7jewkic6mO1KWVsJOLRcdH9TyjcQC6pAKU8ywcnvyGkoN/Vgvo4fGJm56xWSbPO6g2EYCTZulPMgNfxDh5DPs07BEmwD5C+lUZojEbwhpBSx5UitFroJ+SenYV2pOxFZ6SzTTEdb4uFDkFW+smPCl2i98XYuniIS8u7OCLR42CDEIGcL1nLHQWJnrRGKYlDPQdNse0mdryWY5Hoj4jM6tO14e3N3vNFNIyBXW3AonO46Uel3seopdSwKMu6G4iQrFQdgpWkH84X6d7OufJY21WUDykxdip7uc7nxX5bUjK9oKFKOIEk4TEAIXPz1eeZsZ3nTa2YI0TPKT89SgZzKvU4AU/IS26cQgmkDIvqw4sbWc0wvy3iM+u4pkvWYs0aq1rJSjkYV8czuoYEYwkiVi8U8T6WWZyur+u8fllgCAZ2/gtMPd85CrTvVQTexHKuLvMEJ92/9CeY6c1H0W2PyG6KPUKh8UYrfsgmWpUSKawgBliWkGehtfuAwpDk+GeET66MSbjdqARKBwaTyUkW/jlkOCfCvhfUdreuZpcO7MyMJFnYuuSh2v4Yq7RMx85bwaJJy8dLiOpLbCp/Bm+YzjJfil6/q1Qg5uDf7CjAE/+fNhzgy8e6Vgpg6eAbGnA0KrzGauD2O/V/4VkbWS7vxkNB9lN/Do4kRoHZh0ums1EO34Pdg0GLPjRE2V6mcAMLjuEV1W4Tl+F0EKrvU5C5C25tMUQyjEAslJbCPKeugphc45ccnbgjVAIoYRYkMVFpcYwYBIKw4IxyocNrF9xAk8jU1Br8nAjsftwHRltdCzc5iHob9N+riAGeQ/0aDswdmqPd97jDGGhCQVSNGpYgHE6rD02S3WcQTzWV0rzUMhSOxdIEpT/b0ZzDgXjjx3MgR+/z7UDLwEUUP1zZ73+IWLPhH0vQ8dnptR07U9wCULKTiALNgLSS6M+ZBcwPYmrWAVcOys2Liltg3rZ4kglsA58NUOsXoHoS5sxAoBLdVv9ugihpmBvC/S4QLRVqcp9pcqp5cbwcKpChupE3IIWl7IA9fHFwumdKaEg3zAAywTqy7YjbLExZi84puo6ObvM0lx61tK9bLWA03EK95hJEXkVbMo54tKAWRKHwptyL4OmznerX5jbW6RaTtuFph4RMH1+4tzmN2zwE6HvGbHizTAhDLcn76thJ2+eiEDf+hfISDj7wQ7QCkwRzACCaRRwjpKS+pBmAKB/IViOo9XAoFeo5YN5mJbF59C/34Zbs0f2z63o8MLUt95+JP09nDUt/2fDUqLETvmywhTzvq9XxnWmM4D6MpOC2JC1BNT3xW36uDr+6cvsmGX1cbCA3QYUXRF1atJ5Mow5weiWnd8etfCA1JbPARXatNH7sVKgSdQhiB9/f8pUzm3p4oPb4dQ6mChjUj24/MUFQ3h09eK5wq85Tr+8WszOeVdb8slU95mzFn9boS1h10+Prdi9EiMus8oPev3MBQxvi9K2NCGLM2+0E21anWh9UgHlxyZyunGwnrfLBQvAoDLXeiQuW26oOkPCrngqU9kmvpTjfcReiLs130WKUj6PZc4spOZDBcRXzTW9X2HRPSWSWDMS9N1T3qe169rKY/9m0OzGsN0eY+qENOxmacAax/FUpSpebxT2JDET3L2RYJXZ1kmkgzMWNUz3aKpwcDIw2iw8ojLkRvgjjc11yEyeIjgXFPIhtste1FHIEAlP+5tEM6VJ0klRS5NvrMg/Zzxb9rLEsU3IZRvCpgdJfK6F4rfdTxCwDUW2W53ZwWJ+RJfPC1FH0FqmWbmy6gksLZgWBdvfwca4G1O3P7aZlv3RxQW/c8YRUaf1g1EK/V2YagsB2EWwMAn48nX0b/Lip5gV8pa174nF/mHkSqphBn04zKrl+Js3INslIV/wwVCxOdbmfggQtjo8A8Zl/PhXO6JshfrClJPrJW/ztjX95NqzZa1+VCkqkb39v/nJAQ1bCbBu8r2LC2NRsuXmMInDXgOzY11XRytbClbyHY6hE+uDnL6xt6uyaI1a1L4CwPpToaR5uddsAOOOIxLTT727mfpjUddAWp+YSqZhhtHBsGRP2rufu2g7PU8IZyDIifII2mRjJ/SlcpMDPtbvVyH6Mz9DNQWMI8aY0R9cO9n2KSSKYXqimHARbUlyun/FVsSsGE3iOTSz3xfhJFbsSDXCLHZxndR2TY8wCgYOJROW03EtLdFzYG5VsVoOCR5EnRTqqSWo5/kh2GMpdaN5eAghsf9dN8Zg6iewzmziyi7rfvn0VHuRRI6yJiDnJOmn2FxX6jjLdQNXqvy779PY+oQdKjgjVmy+woWL1F6Zh3yJ6XfUzCL8CksEfE0doo1XGSmLjQ6PdU6A9fbqNpfGGBMv0LfQTCCy9DZe7bG5c7F0zjgdzYRF6Jp2Yi4x2tNp8udm1Loe4oK6BTgJ+6oowY1MjM85ce2SLGmdyQ6/dlBCLCIoyjzJzXpyZEGpjPWpKp4KHN+dDTS6B4XrOtFzyuNlMRgq1pMgA9IsDKIoDCUx+dN98LksjFkBGGAkfJ6p9GtCtWfanB2q9qB27XVLZhVjcjBHkMu5ctD3LJlmmQGHrpXIRCBrLfhCx/xIGEtPNpxIs38HvV5tYAwuzEbLJ1CZiCU2QusKTyqMUFC/O8+4Abpj++t5L8yIuoLU2uNpJkDcbJcsFivPKz032eRDsPRaAmjlobKlC5SWd9JSZfe2+RBLp97pmbp+E81+8UE2gCG2VrVdaJ+hs/oBzdWcpDV0ZWF1l4T3SZqYlhBKfKX2SevCrFipwHoMQIa24/4zNzYorDW2GYNirvf07WZwAcJp6yD+9wK1Mam5SY2igSMTtJvy4+ePCXDO+kRfG8S5U9tCScU5UKAMZJgJNv3Jln+Y7Am/r5dLHvXUyEijlyF9ZprI6xE4+pVj8qKM9+IiLAbnNnvrW5MNbGCKLtvYePRGzbnYuv7x60IbDV+7P4wK0v9zZzjmIOfi1ZR/yYvYX/wahTzVrNLOZxiuFTN8oGLhCtqbCjmgmCRVMPkLAGlVLvDFx7FgBVV85t2ULgZQXDpZCI+lppawWlvOGVPrAGixNzJypi+L4PlFW5p+Ceu4jc8HIWTYoTE5dzMOIYXLLQijh3QykV8TMlqUmGopkPv2qSaY7CVhSoNlj4/hjLfLwBrEN5pkHS9ey2Zvphxm0/6cg2gTKi/ZlMegaeF1QaXtpjtlhCx29HOnnKKZ5E3sLDm+T9bH6YRzpZUNCaAprgNujlK7kvvdPn9jTfiHudUnuH4N+DJlrUtmR6oUsHKfOMBI1t8u8LP3qBqlpawzT3Gj2Y7iU8szA1GzRuR0F75ELd/lRw2unZ/Y59n9IzyvCsHX9dOz8yz9hTVUIy0yDbKjZagy5oRMTczTfrLSjZfMht0uFo46hXNeEiBVIaPec8BcbAYJNEp4JNyiZGY+Sw/bf1GKDeaHbKNcGzsQAHVEKc1SXDDiIH753CjqYQbbfqk4wg/esE29AEk/ce/NqSf/FjZxJUICF43BrF8dLJpcLsWlycDi5JiVriw4Z5X+7bQS88K48fw1T/skJjW2IN8JTliky9+2mzkDOLiVMWrgnWRx9JlYWFYQi+gVR/UxDXYjqXSIRJ67hCaoglycNA7DS6dIA0wvn0yc53dCmk4KBytlgKzG1DyIZqdl4XXcl/EUkjtzsa/sgjGDjGkwiEA26x0Xro6uchnHld4YeNvi21s9cWkkygJXFt/pQM+mw0CS8GV+6+lPjf3oerzbO8DZNrGkYxLL07xpsvfcK5F359tOialfcm4sbru3QcE6SlVLDxOysmWZzC+1wCLbATx93Ws4BHmGrSv9Iseq3T1iZbDKONzzriAp8s3lt9+slWg+mpCLBUWHS8rhkiNhRw7P2L7Q6cNYq2TePUIdioZmAPqo4+7diUYI5e/jUn0we+JDCNTuUJbGt51jL9aDZ7QCZX8j7RnxOj6zqG3UetysFbn2NqA+qroyp0vyu+GrkTOO+tyiMhdConAW2xa3Hrusabg8k2vw9i5FaVCpJuSQ7LyaHrmCkImoZPMWND9tqZuB1rNA711IID71NHb6g81YSwwlqbBdjD4qo1KGI6MOtiCi6BM5zdMJ8bMde9uM2nIg4qjmvZkD0vb3jldE0AlE8eCh7KI1EZZ60dBdHGDCvALVah6XjRLCyyM7RPpMsjqLpYnesg5VeFPTcgUtu/bBuSy5cpYx0crIqc59hZIcBFAKsP6NnB+00nwi6VpFvMZrv95oUWDJDdf68VaDJRY9RyFd98VoJokteeGE835S1CYPm7WiPD0u71nEy69LzbhP2DO3UwaU5WRCajGYIzE8YW+ldte2FO1KENkGLgSjiU5nSz1RO8F3GV2xdfN4yaAy4aOWNwUbMRNxW6g0RtzEy5TIEI9JIwEBximIx9jQA3XAIyRDhaQ/u/OtfBtjBJRBX6axk0Z4VKybphRgXM6K1KsqMHM5DVVfX5agYwBNBuDckpE76veb5QmEnnJLR38MPENQUTj0NdSAcN0wEkl2FDV5YvUFatDxWrOq2X7NqZZWdjfHWY1toJjSqmRJo18PVHNYK9hNgOoLRony2fxurm/a87aIDyBoj0OYL/RpR1uevzEq2iL44RYkF5ILWr1ND26VYoS3+FHBLVOGmvGWoeR/FxV7UTuao+j0pRP3QKQo3cfGfv2GaVvvBu+ZMJ6QZcPr+EaNp570d3AEqNgVGrc4ifp+1CkFtBac/8kz6kZljceuol73WKm4gxVEPrn8/QGVbAGRCMhD0UxHkiDYW5jOKrMXFfXRNG0lFAQF3w/Xg41XVUHE7rybBlCJaO/qIWm6GknYKqe6/BKtro2S8p53fFzKMWc1Lv06+xNhamHYqYb9PZAhJ21xCvZc3dvfK+EsqUCpJakengmwB8w0VMpRsF5LUguI6zN6UJViZC++JvR/ZPiJ3nCPmV/qlMMaBk1RMGACo0toM6RdpKu2f+LY9P59a17+xhxEUuCOWUIHu+5VQk1cPgrEy1AHQzM8TQGUpM37GSeR8MsBhiy6yC73lNVln/pFG02jLb6CHqKvLstloiX8rCJ+oFO0qgEh4yc8T0CiiCbCIlUxDVn3BOBH7sn+7lrM+vwpNGZUs4pRt0uljb+PTUUc8Vl7gpgY4n1mV7BYkATk/oPBmV99MicZNjjSaWLL7tBR7JE/6siIO4BnfPHpXfrDO1H56X0XmgYdNGbqsnlzSlJ/UJSm3EM/NC3/jFX8yBurV8OD3MwIkk0efZz6dgbFHdNFj0NHxHKumLKoIN+gg6xAmp4FLONCguzMGO+lnoeD3tRWotvZ1XbtUGAEZp3g+snJ4EFgiMJWUQ6PKFB7LBkYN9IjejvHc8yvoe5U9wUoRVO02MELEHTkqf6UJMtcg83+aWiEEUkqSfmpinA5W44dby/9GS2jXIwqp5HogomSqQKzbrulITJtb4rfRMHbKEjx0Fbuz+NOQ43NldpnZZMDyH0HaBD7Wv78MBlTZYAtQ+z1hK7Rr4jdA6glq1vc3y9I5tcMDYeNAWZ0XBIFsG0LWgAgG5KMsViO4HlS6d/WvAY0SwBVZbSX+1N75TAa3gzHn6cWycXGsfwLrUEYxyyjz5TCLRUMF+FgVdVAgadRZl2ZiA9FXjdlSrqo/B/DdIIKdw1vxV0fe2MEngYDJm2Gmkc3DHLRz0JBtLPhjz/VzoSeF+yyis+4mtgQ8KF6GVswCLrNYCWCrkFw5QWRhSy/roQ2uWGBstAKI7HRS/mZj3NsNwFTgZg5962a67kpxDw2porNgBxSkV7rST0+k7f01g9nHQ8DHLpYwPcpss40LAkE+o//wHOuS2PWq62zvBM0apHdrZVyXPP4KAuXRSdneEt4H3mQPvvsEdIfST1OC5hNki6bLMlCXaN4skv3vOvsJCxyMMs88QqCOYTnGigBAdKF3D2dMiCiEERBqG4v9NJIM1petb2ZSlzOnXWJQHnQ6hTM+3fN/5iBiHy/bSllx58Wiza9aZpV0Y19sdza+UMBCF9YwZ9uFDD29IXs6/3umM86VDbMaSN2Lwdf7ryNsQbvaGWvLFAorxQtKLY/uTLUZ1duq1uk+/YpthN7i4kkVMvStZ+xyvOwwugca+2tPSC30dWeZ9+MUXTcuo+GMXPIl6kTSk+us3SdOiA7XEGPvqa5ngjAntNiUd+xL9mZr4R7psKJUGi/2kHI5HoF2KgM31Gk/KF2ajOyM+ie9VMkfYIrcBC0ydI2oW+kUNO+k98LZQRYK4Mywsu7H0uuE9lFow/v/jULptP21jdkO/XxNNlt/RGVWt3N2wPtGPBACqeeNX5S+JJnpjCSqQ3DuqX6okHo+RZeJR1cPwSjGJPEAn6wEz/6UKU7wQ8iE/5pRYqsRKSnz5Q5fQP+j1wxVZUSml+iY6C5OfLLWOqSjT1c4Raq5DpuIWDXzLTuAjsIi+v4AXV4p23QaJFSBFubC+3IwXvB82SLQM3Jy+OrhXnSdrszVHsDq3nLPqLkh45Lh0cb1oi6FG/63NFMvJPOjT9y24JKhDozZ5qFzjE+5P8kG7mYq1vIgvS7tvUcLb6q7xSGOBPhlqrYl2FHrnKztdRZ/7oecpzKXaw7l59vJ9AdFE7L/dkt3YRl+gijrzWib9oU86EwIrEFJExudg8dmhm/ypA8pndAkul8BbqTwzA+ZjMEVuT4Ohpl5QF1FRry11ji4LPJGeo5FVMRYq+T3fVYR+ivlAzjwgGfVBHUCZBOJnvc/ybNzF1Hd+xurJSg7HfHJxvqzDcVfMEjmlerbJOe+7wrXaxsXw8lm07e2MQtM4PjGnbAChSi2c0Nr6oFzTE1GbZSHxC/b4voYNNbQ1ggymyQpPZI0hxIEMyofhLn+S7XO0bNXv38BY7DWjcvVKe5/0EOFjfQsf9haJYufzPqEqA0/s5hKWnCo8Mt+eWGzxZJn2l6ux88uWXuY9SNcs1MkklyzIHbocFRGv2BTlg2xChjEiUdk7YF/fUqXkAL3sY/Sh+oQtoCbyiEx6ZSWTeX5VImxbB26F1/7dNyDxJkrxRw9XOnINspXIV4yIT5BYVzxzCclYgpVU/yZfjjeaiafNzebxz2TXgI00m4/WRyrmZn4xPbATRM1N03yoLP+zhDazo+4kL+U+A8gtHApcZOgYKDPnzyL9mA0aHVqm9qvK/A23JcbfnTGVf59/NsIiiG+z1rB8+q9zfRQumAM8P7hApNcs42SObFfHyTeqbB7H03Losjhs7C9nFj4SQC+azlhA4cj5TepLTIiS10rM0ZrGlkiBxCRjs1PVZ7AR8VhmIGdaZhak0uY5n8LoQkal1PNNU9vxhc+vVKL9IFhklUedIYYKVnQQ6uF4M52Q4rDHO4NSu+Ddb2IdhNieBFSXX1WkIM2u6JGFq6XroSlWXtMBo9vRX78gRQ8ohIfoq6Ib2zrMD+B73MaXv2Ujz3o6pV1mCunBsl6diJYukKNCAPDhvOE6+ZdjSbyuJVDcCoA89ORe7FqUkWO9NySDsbomtL/OXEJyR46EGsF/qLgvaOi8rE0TgAOUkBAo7rh4IGloOBJdtyhxnWXvHRwREACXWiKdtmfXtCOXxRM94mgTWDeRfTEnAVG1gU6abZTHTfJRO7QVSm57wH2f2yAXEzTPaqt34LyFRSjsY+4Gm5x+RZs9BbATNkeot9y6/FsUDWphenjAwCLF40a/P458NixcXzmVL7lwP8W1BeFjqm/Ia2F7o/K8JOp6HatFD65hShxkWbyOnIbnPTF1eAC9B/PsKh0c16isxtlQbbGs1cQrKi49n81dhp412+BSdwfruYGTgAFCeSuMMP02mcNFCZB3SGsSj6afDu2q0JGllvADDUH4HP1t4+xqbsugKzUSx2Xl7YurUGrIaj2vJCpc08N7KPMwPqDja8aM6IZlHbV8ryVeKL9+MTNj6p6Ps586SXok0cd5mycU5s6x17HV1DHbN5IZSz9oYLxIm41ceo3OUUyqNeAospfu1ssuVIDCYZa+C12uXxuKKDwcKHgEGv6YsUa2kfL0Yob8C/JonXxOMUTQ3xpI4YevWbC+I4H2UylXz1Eif9mWd39eB+xKAUOYgD3XFuvWgRKZkxkH4lkghn+MBTHZySgOz+Ybg7JDPEewzuIRaNAI2zz7ppvuKDa1da46POzAnL8fYCGp6PtWlE22CnG6AfX9FBbSnHPqjmSEExa7ty4AoenMO10HXmVoSord1gpU6WYKjrymJBGaYIQEW61624cMDhki3q9fdoA4dlC2+NThYJTAROIzC5fukedb3u6JwdiHqWek5tEhGldKA1VA+B0jCYiRn8aNzLhntAVmHGHUjp7QrnBLgcfrj4/yBswlo0Pj94vjFJYfpYOXMYwNm1vllGr9rUZ58embDVkTpNukElms4flkbPElGi8ivCDnuW3Xh0lgkYg7eO3LK4bPAIqlSkdC6nuWjfwxmnHa42qJcPZKpvm7im0RdFtfLd5odTBO6339ls+7N0pYhK+ngCl0x8da13lPm+uTSI7tSkxBDgA0T7tArv5KS0HNC6SK1N8NArs0n7MFrbK1rOmrdLdgojXaqkleTAlm/64gY5LFdixU21GwgwAbQSIWob8RZK2HWwVgq7RdAO7T0JY9SLA31zWtL2CUTjzS9wWH/AHUY0CVnHrJSpSzMyV23dEbV5gD9CQX+/6sib2sKUH5N6hy5MSAdJ6QYBUWhq2egW8gLN02FrBo7w4b3dOsuHohlVlI43W4copfBLm3j/lDFhwBw0Dib/+zZXoQmZh7xZiydvWpnU39/ssLokCqRi0c6Tj2JPkZK+87zshuiTf5VvK5Oy7xpRmek2K1CNEUft2NNBioFGeuoCCv/gzYtNTcvPb+5okdKjJ6K70tESEjiRhy6ro1MQAOT47N9tNt+gXneh22TJ06KJgOfCVnG7fHE7m9kObS1QCQSIhyeTl8klPHPuSDNmauHot7K280VDby89CbCiZIG9fZKFBbwQxDUn3RQKcXyMrXonyITM/p7B5L9zxp2DWoON+wZ939M5mpWd3RuubbyjIu+z6WY5pOcQ+kblfjjVcflHAF6RKjZcVKLWpDoIBAe28pyiuDX4WiGy5F/X38PW31eC/o+P7Cj+t03mQzh85mABTJE6FGy4Of4xvVLDvSiuDfhbryYOPtvFxqHGhLMFA5nFhPMFIB5kCdyNvssRSDIlMS4k2O/Vs+dCHC5SkmHlZjfYtD7Z8hugk7i1AHWvnY8aXSNoTKz42Moy42dvgXSRS8+EkhCtEKR+SgGrMCUzTf6yUiWUkNJTCPdU1/EonRGeCxutsJHooi7nVueuNZ3h3jNK97zBnr8QcuK04vl2XhDL4YZoULYgk8TmOZvXkVlD1P0fZ5fsLadsWuCKrkomq6f3Pz2r+eHjX7RtMB1kOl2lapxhFZ+q4VornkxrC8D9I5TTy06gxfO9vWxIQ6GpaqTI1nscYyGJuzK0Lpd4uWX4isSfK19CZX1FoLDp+1YAc69tyW2CJ8v8lCbKYerQ3B5eq7M4NqaeJfh8yXzoK6M16SiyBLPAsbwa1ULvSlZewipm0X3KuljC5eBLHYdvyc0d2zqKfcfk1k+rRX1VqjkcslcsmGNkplxBuFC7r+xJMswAqVu7nuZTZ2jvp2IvMNu2B6gICaa1XzxsyZ/dTvZCCtdhIL3d1MyfqNicwFTOtDBDIkjb9j32PvZTmUEEfMmry8zkbHQep7MVbmfWIX56MJbtFRjXCsZ/LZhxpywEBAIA6nRaRy1JtC6IxcOIYRd69MquIoEY9VSqGVEYVdMVc9tnOhg63yabsW0HdkltnSrqQPiSkaPPCvTsslUt08G6rV4DwCjn6HSFTezLlNIDU8JCpu5axz5nNMaCrBbZ2gjqvmFGV0ZCepTBr9U880quNCq0pmhkY1Kkv9K21gnYmwZ+YJnIyYSzIel6CSNQfFYa8+JGkRP5cd7qo4RljTH7nHkLUI5oXDQcCvOa4IuHr2eiyi7dcNn6/wt2wCjWcOqDBwaNYO1bwSF/Vusc8NQc855WjI233Vpp4+T01ooquJVAbX5xKcPqwmKOGcjg1Eok0DtG8bc3Ei3yyED82NQD9VS+DiU4f/SwNL+U24p3CEB8TBrGtxFu/Fy1ktsJmLQTmrUl+jGE5aUFN7TVG332uu2j/8Sqqgc6OiKIJNGGQXeJg2IF2DFigpK2UWZqFXq8bDlDPf7aY3Y1rFKTuUaswbbzfz0/5QuFzL2jhsgKcSkurs23G6iCU94oIaa61KdWWiVJ0LWetC6X13SEv5xDThstVWHJPKM/g2e0nrrHGwYtnXO97Jh9CS4YJJEuQkz6fjQHK3shQncpZTR7dvAictC8vMEOdQPALgu4zZcnbxrFkBV1oz25Me/BLTl7JkZTZz/WLfbkwNpnq7+7OXYmN2CHW9eQD9urqq8pvZohpzR8ZhOo00LnRyS49BxAgi6S18zetKw5vpBkFUkgf3/y2qQpmZD+Czzdq6UkRBc4Iql6VTfo5v/geq6EQ0XaTR5YDxxD8K+AI8tqJqRyQqBZ1Sq/MeHzxY1cWxt3Q31BTZnS9aBJlTim4+b2rezWnmvK6TXwPi/keKadOhMvlVr5aZJFjp62Z3AbwclTZbY/82FxBBMptYpPhYo+6rI/Cq7xwWxf8J8AR6gl+U3NMXddRPVkQO9o8Zl+/eWlrg61HrfJii8++D/1yBDJcPBOmlvsVV1VKNik7bIfce2TTzijvnckBXUd/OUeXfkgb8w8dOK4HmhpbyNCalsHvAmaC8iIdGXHG6ePgLsc6MYp8VedELFXZrVPDSji200jC1gPCKqqFaxHzROreIhuTFqRu30/JhViMtqV7WH2LOX61pbI/3nZZP7KDgvzoPkERh61S2Gx/QUjPqa/VZKJGEWiDSsTVjMib2xGXTuXN+BkVgytBlMmmI/5fo4UVAAtDe7e/xCGo1M3omsI6ZJsQ6MT7NsGKePmy6SgFdAUVX1vXtpRS73I8lEuYsbgxyj8jHVtLZ0gIZ9NyFK15DKYmd7MVEmiicE4tEhmXF2mheHlP7qkRNqX9xuXfuivIXWybmruqiOp3V15BVbXYqgpf5MSGab7ux0bxpTsz/jwndD6y/m/Rj37XUxJm3f+UzhTHpXSYm9ghVLqM5VyCtOaUviK76VSOVMFDgK7V7fkIBfDc9gE7zXXlfwUGTJ6bcTZF0ZnuALbwaIS4NXbTo74rgDjkUXrGd1Er3SKWesP0P9fRY7xfNb7ni03MavBhEDVIqmBo0OwuQEkc9rL+goI/LcquCwIwOU4cgxps3eO9A1z6nkUkoPy4qmd+KPkYBQ94vbLnBK8S8UYQCCEYwaM2v8x3Odox1IyEZubwu8BfyDAQjTacbdYz5kWB2POj2+5jn9xhQrc7jOTi0DuHj2/wSHeqltKdJ2BVuCf2/8gF7/abc5OKwrhqlS95zYjM3/7iufPKJOq/GlvPmGKpSx+7MPzlUO3boiH+OcyzDLNyzSItL+YVjCPq9DI39zT+tRR2FEpMtU6JF0svh2pOd1vz9bFdMtotgUls6aU06LfYw290ijBTU8uBSGCFx76Dug/WIXEO5BluokbtPkEJM4O9xP6URUvln1YqxEDW3GtsfHmsX6wIoq4jtfBcIFP+OK58TBCcNXLDKP/+FV9bJYpO1RoNLUzhNj5RXGMh5tG9/DmFmvA8vjqpV/5WX/JaUiPSTni2HunaGLqp7ZEqA2DwpMQ8GV9k2JkCZHuQgvwg0bYCkP6yJ2FQxM56uOQ+YdtEUmlVzjB/GalsPkqaMW1iZJBvFIm0hq03hi7kyeXc3vsJZvVJ+srhsmkHop/3/kA9dmU/TrHitHzp03QgfK/QrD8z9GSAuTeMK7LDxTTIZ3ZX2CVxVojGGZ2bAcr4G7qSqb4Dmw8aVi1JKazl4XFrGHn/xoDCfj9Ds5r67oA1xDQche4gWtI5iWCrxWt69VLhFt32fjmS9a3yzA4aoMi30BbfAfhfLSPszZ5GdNoFExMMuOIafPHsHExYfRAjahWG2TZddbkml7ir1/vRhQhAfENyqSmOWuNGRpOMkHNHrtS7k8DcvWdVFK4/r0mFME6sKu8y7hhcIBh98R+pwQfYdOceFvNhjvr6JEND7SHnOXGbIvZwL+0jOf1zQqsEKoJnL5FgkYnTGXCXVZUr37ywSWsiCP7XfIUPBEx6kp25bBtnqEb0jq9D3u9inF8YiutkQCg08+G0wWAKoQpdlvfidIxQjA8WAYMjbOSXBznw9FsoYrIbG9xpnsPEtlixQ5DPpXNg1+rfhXyHEDsrke3ScvcROPfMdlw2suv/yEubY3scJiJ64Y0qgGHyeqXhKO7r7cjXjBWfB2MKbPh3LSczuD50JxRbK9VhoFWJegw95gVN4GDGKwNNCMKAsHWqWY0El0f0lT0DbtJBAYFBJYAZT3AUaoRcV2F/qV/9bN42mhrL7s6KHXe4k7Y8wNxXlPXXBuB8xzrtKyRN0GN7FmC+yDJ4ZcyXx1072czzBYdMFv6XxBfELkNlnoLOa40qkTkano0NwvFbgVgJc60Yx2IlyqbDyivKUDnpoM0phr9vnsJSwx2X1A4yjCktNvVys2vl5F/RoxeJPx8XvPpHJbaQFI4bg/+ASKuAUFEMxRV5Cn4am3v4cnc31D7S+4OWeSUuTInGviRc2gr3f4kY/59bAXb8/1A7fBfUzNvINFVaLTxsRZLsS9wx5kmG7h2/BB7F/I8dBQypW0UAWYDFOaT20a4EgIVU5ngAbzbwOWH9VqWUbE4xLthwp735LB4HJqaaZ/f7EuifbXseltsNaFC2rmL4caj911pDkP7o7gpsh2UR6k3VONK0o7Ur1VOknn9T980eky1vEblD9F7sNp2/rliK4nVMtpAK08K2pAwA9Iqxmtlpr1EpUZN1To9FTYVa7pdWj74Vwc1VH2O0IiQiXoqIYcT97ClGy1ES58scu/A7rMxBptMwxRb8IZK0BIPMlrYhp1HsZtwJFebaez9LJ/627oR77wLy5jFtAyzOB4Crrk3dG8rq02IOXFfEaTT4NWczPsjMEwvP8YxuRKXpPRfZG02sbdhM8vWNPKOKwYUC4hpzwceoq0MVdAl13x6EyUxdbFwRT5/SAbW7TmcNnmmOmhlZZgZrt4xysnjizLJ3rkNFFnNHizXPCFfYzlhdTBqzK5FDc02DLQwA8R3sYF4avqH/SopPLG5UXM3nukBH2GkHlEvXcPj4i8imN6WvixonrHcP0HLan8Jb2Ns/T4ZeQ/xefweXGknNjpw/ix/jpR+NJZUspj7EN/t9o/5WYC2Rydk2aWz8AhfkUxd6TNxOxoME4i6n2UYMzeWmec2QqN5M0kQWS1Fv3qK3kvhoUdYWtLka7WFyVfSEdOqai5Jl/5h80dbie56ApGJ06dhcWSimZ8wKfzXTxyOspRhtEtN0fiUq6F+hyH4k6OXmLfAXK6jiS/p6Nmt5PTSLu6aYpaJH6gzZwjdXE+7QNMROL2haLe6XmGvTSRiZLroK/LEBVRfjrpb9nI8QCUQ/Qxl2cVJLkAfKVieAfypseuVHGTdiC/q/WmMM+9UBdlskZLb1TZMMvted7GYbbqIj5yMRIhSPrYPV9Q9s7rxdlb9GhFZjlBBEqBlAnx/sp69kmBSsmeq42bJIojfTNMQwboclnUH0SlxFNNPa5NwXpzlcNL+dK7SPu+C/tp1fdPfOeNqtThivnnuaz62gryXaCF2RluUnBlOf/u4cFZBGGmr5ixV/rgfOAcNHeSXSW/opr73/S8bUum+FtWSMzJaSDPLpaqSvxnnorcaUXbZNjJLvSRMEc6YxR7Da286BGBjYM8WW1dusNofxJcHhyqsYBTsea9GHEFuEeXQ6RsAKbWc4tFh6sZIKzWTKWOdbqvBEd35TX5jaETPcaChUMXB04FN/6BUDUFXclmDRsNqDc0mxICos03ZekT0IQhF166eEguSB3WYmD9aLr7VHW5LAQiEc2eXzIuECxUu/zsnCkJ2TKzx381Xwk4lO5zctulO9kCd5qFS5TsA15jsvfagaVVVtpWaZb5YhWBLD2kmnIOOpCXYuwZfeohsdsDkWUlfC975B95HIe4rqorfjVeCL+xTYLYVOhjaTghprFSQ1nIasCaLa/y1BG6wsOuE8+lzXMQCdLEMZwdrHxKWOssUoQrKwQE6ualcCMTzz7j1caHiE2QxiSLDGxnxRHsQzpLKld3eTewgJuylxy2UguxlwKP1iIv2x9Y8tvxJCfJj+XGjV80SEt2QoLjdrquMm0x+layXWwBa1ACfUVnYSTpyoBE5rh6Cg74ZvHh4Zmwc/Xk0G6xvtn+wxv4BGRy5EbZb26/tc5sSSfptxYWsv3YsjKzLScMd/zGu7PhBELoBzI9HZtaG7WQt66SPNfAVwDe9AwH0AKrjpzCAYDGVt+Rr5sOZ2KlDSat7V6hjIVI8iMTZGwr7pHLE+LSiv+qy4RDRhKbfGxL2j7nsC2rXnHdrcGy+GVPfGIcCBycAG2Kxco/X43oRzMpQVYzUIAYnXTKMdrOw/gw8DNDCFBiwTgmNamvq/buh9gCr6o05SuaN5Ngeou6YzdPGtJveK014NSBzj9XHq+3Ca67a4jr5S9+ipPbsdwbeKhZDE1UQq/G98dxnLYvZ/eF9+PXeJQeTEoyy3VvDvAuIJvGOxU/1a4EJbeBv3nH+NKutFrz8u7lAR71Wlh7p+59OoMneBUF6kYf5JnUL6eLgVxIvWE8d8oFX8AAxvfL7QeQBlpgkaI1CPgt/+mnofoizQiBost2qFc7iyEWvWe0i82YsVkPWp+c13oUesEYEfN3S55PNGS45LJoyW5HK2UE5ObjogFd9TDcmfR0GZ6A3fudKEUfm9UVe99/lPfYh0gjgT73s/o++LHkXdnZ5jeDUcmRwDSXezJklENdLxyOQk1SNL5In5unAQ2E0xDzVf4xx8Q12S4u+ODE7PLQtdXRCxBNK+6ZWvbvwMuhu2WIO0U7MbWf7Xj208K6LcSVJVprjMfQxNYHrkj00UWUxZMRUAJlAeWCSUL4dCZWjwfCP96XXvje+D/c+xk85USn0JNk0mb7Ju5VBG36FOkmkw/3DJddjYjuUrI9g8kvlCt906RqYncdWGzqKk1PRvNPncIM+RQQdBeC4nFodFjpr9l5QrSaHYpX2czZnsYr5+n6VQ8XUKAE9ICXqhAUgbOCY/sYMw2SbtyJxvu+K3RllVb75PlFxbUM9B7J844FdwXqrLyKbRUlmht6iwPa21fXA2Zy5BrwGkyFR1WFS9wjC8TGA+gCxHgTLZQFtxvexfZMtg9NC5aRFbw6dBfw6+nSe+Ss4YxXEdEDGPbM5ZU+JNs0DzHyw4OiFyqETZ4H4PnmRsBblBfpDgQZoOrqG+GIeJJQ0BXhJtyFvpAdq8B4m96/+/OObyBBhRSeCRHAa00CYv4N+JxnnfI/0zx+7rLeAq4PYQZdb8svqeh/il5ZRfhB5aN/HNVp+AhXPT1zAmDMgg0fZFgWPyDk96c8wiWQ9nQDshfxYOgwqM661aBdSm6cXcip4gg/LpJYoqyVgw5tGfMShf2LcReCw3R1MEiAslpFP4Wp3yoVRBJsbnh2DNn+dWJqcWOQO44BusxoMNJIVkAviLw84O34BnS8cxtxdscujB1NHuNAdgHFZtigAUmV6IuF40xr0HzjHAQzZ/rUeFFCzxHtwKtd6GauloiJjJZRL3+ThHcHgfrcc3ywwD4rM8mbcHu1aixsjNT7WEtm4X16fY35FZkVzHk5iqWK4uMlmbVa9Vjss8fyoJyaAlgWEvBJzoWYXs75bbmNCv0BPg6ZVHvQSy8uolq174k4zCgD2/hZXlj7GpX67XnimsfxRWLWvPqfu7KmBHOoYYMXIGipIjtsf+GDL1jKDU0OJ4j8sR9x+Yoo0IxQPdiJ1vyT6GlZw6rKURQywTpSsTuV1w5j4t5WxkJXltCbSkzQrpHJJqhvZw6XbdUoFCBm+hNdrM5WrO8OHRo0c+f0eR9V9P+Dgm+LN44QETr4+bOOUKDGv07wATGdRWwbM6+uS/NcUIMxLGJvtlS8rf+J9x5bPE7F/E8FlGJCH+suyhwG2c3CEyrH2mW328VuoWeW5MNcHpyXExvTk2MKPM3nXUP8FY2RDr6rQJkGo/i2tOFsFuVCzEvms+9UeDMRYnkzFsAvkcIOz/eVFUZ16Z06oE697+FUAf6jaDBQuiWl8TUlxscX61aMnYePjFi7e1fmOh8viDg6VnSNqPJ8L0/0IeTnLiz+nAGLBMMKDiWYkIJJMzbje2zzvX009Yr0p2epTc6ojx7W7AsePvVXqK5x78Qy0R2utXdF2pOuQ3rsi58V8hpUb2u9dO4zAq157x/X66MRDNDMwZon6PQ3PmB2gF6dC1Z6wwkAirnGPmabKn1afUbbthf1Gy3Soe2o4EJLtEGpSjapsgdMYukGP1iC0vwKSQquwz7YOBbjMMuOH8U8qphxuSNmcjsT8iz5JPS+vciExS57ez1/CYsEqHymGqDtahBUj6sHbo74vURfd79ZqeBaNwRTTDYscvzenW19fBZBSONvVdGxmaXzmeiF3iP2k67RD0crPFWxdg6oQAAyimGCCX6ELKFBtqys2ulqMLpb2lW+MXK1IdTNr8/qrJbS7ZLlv3resxY2Vz/pTINPUYO/E8mDgiCULNPQZaKYr+3vUkXIP1FtAFozdQd8FSGHya5PtffwST4dmGD+gU29g9SAHfqFtutXRvhYXckZk7djfkgsKK28Ox3WW5axc9K0USzQGQW34WmurgGCFNYk1KKh7teibbv3wSd4wJC7wlTs4UDGbAGb4awxB8UjmMJ6taVXt6oWlc86HWBAv7LAMrxSkRAF6qjmxpwsepmFfB5xixrLWUbBNL/5NnhfedRGj1zcbuVSDrDkuijHyAmNK0ECsvcshYZ2cQLcDo09zrvrOuLa2plQ5wAZb3IrIT6v7wr5onhFpUskjjNXsxtIbHuJZlOaNMwgb/jVpJLek0vzU6Lf2AocxvppPb9Yt4fqPibtcWUiyRb3Q9V/oa3t/lUiTjjJvbpyrYaRkgS8h8RhVpYi/MdqcAVcCI0k3jxsDj4RRK5r709/iDkI95OuUWLTgyWqQ+y2xvkQFScXiO/3s+7EqxlKzlMjWFOuJAEobSXswFRbICkdPW61t8Xlstst/x30/6P/dcKlrstO/pRszG15/xL3wgdRrcfd7kEHlmzqTtSUhgKJRkx+V+X7sX3579m9in+rENezjI2NEWK1bJ+gxVBOl96ehgbd74dncc4kBTUvS8qHewwLkuyGNDT+EZhDeRD2EH2Jr3Wp/1M0DB3w3AALxoNkTxrUFlX8Yvn1MtbUuTMq/GC1cDpatqoQ+RnjMSwm7B4ZmdOT7pPR+7+7htKpTIlMglAIfrO3gTlFSY32JMsJ20GsUgCJBP934opKQZsum9/8B+Qzjm1AUwthjoNncAjF4jRMs4TrZAdHnnNlU2ApNi0iUFqeaVuzInQkrAJFb2Ejuc0yP9rN5Km25Z5GBnk27uaKRA2KHsCRjlGzR3bZJNLYj85Ym/v+AgLIeATZHm/iNUf8637SQAYQPaKOeDQQzmErN3airPpT0eHW7/WZtw3zAHomqndXhXAn9+ohj3czahxEISC9g5gsK12iBMEv1y+/r8Z+9g6iajFT/hlZASoI9f50BGz5fv5SCpe0OrNv9npIxuP56USb1YxYT9VIXHgz6warUM0uhC54qtsGLRSaXA+VTwtCN/GDKgtvwxA5n7SciAOAyhuY4FJ/ImRXSpdPUKK2Aznll1+MNc3Z43U/rdUziwgfe8W8y61UEJc93RgaHb7CWlWiLrW+5NeGVOIo6pLrTGCUA3nMAysz/DYCeNLYwEN3HBLEugoRdcUwKRNoCkHjmLfgITxwwa/aOWUrFzHEFPEOeFhe0yqfMHyXQaU80V4/x8VM3+h6lBixzY+n3czKf89nqefcen+2YlK4sNIyO337pcD7c1+Qjy/sYv0v5jlnKF5zjUX+0YnRPt6Mcw/oaIcZg/CYN6ZI/Iu+aQrUzRiIi9uUqZqU0itBEVjpDKhVIbNBDOksBPQcjz1SduOtbndmw4vSN/KPLI38nh3r4rdo9TgE2c/fV84DKlY4Kb6uvHBaUyfiof7I3Nti41v9wzCqiC4FBKmcmpLDot4UJEB4BuWe/RLddwQJ30P9X9N3h2MofZXhinw8h0vXBoqq+VhIi1H22tsjCbPjudiMZ4zSNG2HaTO8inLy2tb+z77CtXEWctoaapjnuSvhhhU2lhOKPhlimVkQGHUHCVIKVEOKZsrUjyoYHqGOVYZ8OSinQQfjDqfJwg+4dsrcGG1OgAN6BPfjmG0VjKsBXeamkFtpSbQCsGC9hLeTWzug+SMfQw9yvr6sOui37y2kHt0Vr/ErtRPoolt4aL+i85UBTdN1UMFM6rH0As84roaFAQhGps3pNo70w0vtzJDTA/YP3KM4EdytUX3AZ/af98VpKj6ScbRS4LI2wbQY8Fz6Fk4j+uQC3ZeYwfc7QQ2TlSjQJwSJbh8n5mZ4MazAXsQUN6+PImGUFEJrH/pbBMYzlzXUgJToOZ9eMD5ZEUSaurnbv5R7y7wxINigyl2veh5HfW33UqcdGC8gRmP5ZyKIYvHuSoTyAkFE23tCTjINmq8qzCEszeyX26soc3dLeXfe+S5jR9SktH1farOSlvx3sj5jwEhDYMhErRUA1OyvWzoDMLu+0GMkivQSgSe3Z4eKkYAe0xdM69fkkphuoeI3U0lbAlor8UYBq21JmrkuzIu+/ulPMX3Co39l9nruAOGjhlSVVXKq5cSVyOh/4QreGoU0k4hcHUIcPIh7wM85SuyqSPxWuMQNww/8lCsFuFM82jXuoOQhsXc0o1B0BEZHtz+D3YhX0wyWa+i0SItSWShLfSZimcE2KoBwYTAtWOOWOSZdTFw73PwSbN3+u2MaWU2YjX8RZV4Nv1bqD4ZWjdjj86hL+KNmOy+mDXx7oWqh8nUMLzLgBM5GAUiv7BUZcxpkbYuKiWzlwKCthWQ5hKY2bSic1uBula4eh0s3NFF4FFE9XpmahMnmND+GOywhuAlbQ+MH+0qWk7Izf2HBpUl3CnvZWrq4fojDxxkKS24rzG6VXCT1ss4VcNDgv2DhHNfyOCSf+/gu/WcnEB3URYBgFCMLyKzlMV306NDCncmvUstcvhF/2jZ18LBfZ9wQl9gHZka+GLQjPJtx5r3h0qoKYXAQWYfCAjoooHQqzd8+JR0i1xPLvn8rkBLygTfArTO0nopHTWunT+bho+okBwTbcLYRc1ibzrLkMJw03TbejiQHFHlKsz9CSQeWFYHZMItdf5aQDPJTTmjXXBagzKn2uilg/Pni+efFdYHIGISdUB8q6NkyIVrM7wGejROpLNdRiiXh6M6O/pQh7Fys4TJ3La6KumhbsAxkLs9Mk/uA9FmMIMRO9o4c76C+bTxCTBW7xeqSiO5F+pgAn+zLCUDmRDYM7BxUzUE4tzvOQlfSrGWe0ch+VrWlEmUTx/3Lk7u2+1ZV2nXK/avvium1HJ+RPYKIEZqEgk/R/VudrwP7ZKmq6sJqcx+anGgdBm0aKL5Qji6d9+/syUE0xiscZL2FaX/tHybOkq+4Ty2pRPtXqvTp0HwterHgCK0n48cjAsrpvmw3i6CZ2cruvgdJZyW+5a5DD5gEzb/ebgrhHtoEBLS/wbtYU53ed0JsZqP9dMR6SSc/IxyQo6KZuDRr220Yvvnq58z8abaltzyB+JfgAepSjucPw6kvUUeWYdxsoXuj55t6IDz7OGeFrtekvEsRjGQZhS/l0NTwtdXel4IextrD9JbJUDeaZXbXUYSLtdz6r06BClKyNDHfkwbbAObKeP889RPkW1qkdzYMrsecUkKXr3yZvKLv/GcSsgBPkMDUs1MOwHzaTAGtTDivmJrTR0mSsy0aKn2BtHC9r9E5uZqIk28Ut/lcfsKP2j2kW5VqWxjcKbovlB5BT51lTU55adY0LrEBjoaIr6NmqfWwqMJXeRwmHp+WH8E1nt5k6WKqRWt/0EQbr1Ffw/rrcgx/tohlluKVV5XwTq1XyKFuoqKuKcXNkiGqTvAL3GSNid69AaNZEpucHnkZwp48sPCSzi5KLTqJzLj1j1tJvUVuxxIqdFCKjDw5W0HvHZAe1yOO8PlLurgOpSPszPGwSz9yRGIt0dKSsUj3Kk0MKqt75Grpibycc8fIeIsaFPJk+Z8s3HbZRgIEfzGcxzYa0fXUTiFjLqHRp96+QTGAl1j43+VFcKkqQp/1otf4HJnZRqpPhCNuJys8yHWq5CDJbR2fBIMmatFwY6VIh9u33RNxnjaaqUieO/p/j7XP+mTQ6+gybsacM6qyuXjDvmhMKPbl+HTVvEpU6U+RSmtkySBfcFnYpA93KuApRWH05+7fBbEhxpv2Z27mygYLLTwesgHETPXWY47MACEdoM38QPKi+0xkjcraTe2GdQbyjnkBXoT67YHEgjxPRyLksfnmjwyf7swPiw28BtWptjrV0IATOqZUe22of3hjixk2r3+BYscZIpO7OZj6svY0Oa5eXDrivGikqWvGrblWsxIaUwFnGYgdbk659bi9tS22vMORpv3vBNtRLZXUG3lZee8Y1cPBll3Fp2Bx9PtBM/hKcybHqRSfdvltijvb03ZKv44JFyf8jbkSmPBWIotpGSld9/pADLy1wPHR+hFKNyreoR+d1/o1WDAVcbKQ+uaRXwulohA6YN+1CxN81fCOEFhKm7ZDx1l+NV8K0hSkGOJhSb8L1aGl5hokJnSGJN0n9f4ROiE/F+iDnzZ1ToOF0qOxR1jSLRYZjX3dM1K+EZxZuyKhU53qgSR1ARX/sHILstBi62Cu96iEitOvdcs04zWjugfOoTSt0WCG/71114fxXX3jwab5ouk97lsA1dKPnKb2fzmUDLqSB8KtIq7lvQDHHCisLLSADceo3XDcrfN+9TCmYrC/ym1CDgVsjnCVnJNgE3gnf7XY07VfBxHDTnalalkzPqCn9bXUZ/rwvqDPU7B8U3Om6YhKVgdWzEKxlqGcRaCvhxcGUrj4pGNJ+qr1T+Y/CYTCtpLuF90Zo8fuOAAPd191NioLXSVRkqKCFGCXmZfkmAEEZRlVSIU1XAzcTomWlqro+RF3jbrBJDM/qfk4QiFwxN3fVdQpRqCIy8LAoi03h6lMLrp4uM82lYKDM4exOePAvNn6PW7FENOGvoaf9iN5VnmS9MZwRpK//wpDl0YN3XO5MjIhbZL2+VakNN8o0pITur1Kr18tj9dmOYuEnF+FlPyUKDW5AxOOrl09/wp98LEnKo89ZWLYTL34m+10cO5b+v5shg5E+jKC+eGyJtjFnsKYKjB5FHlmkOEP2nsKg/N+VrWMvRiEkqkq1pZSF12hnMB0QkptVkabvergzmnQmmzo73W0T+gkNb9gUperHIAMu7v95VQh9eaM/n9mC6cQjt+hOdphM5PQ+ZV46VhbLQrQfR4v0l8nt1xsNAG2fa3q65DOawt+C1EFo7lWwdmlclI6JDTwrhM003EKAIG5mBwWcgVKlgYQ6CnKcjDLL0gfnKpAle9Gnc/IVDpculCDtoIgjvONm1TKGvC/hMM5PVAU8D3bgr0kro+FIZwh9D8IiFXKyhDyJUetV1PqATAGC/xLm3Afmmyzh4ZXe0rjdFD9+r+aj5IE+ORcRwfWJZihKqOXY07vu3K+uJNGCKax51KfjXQDYKXEpt+th92pIOcd5u82529FaWT10ABoOoDpdFEqHFvc4zRrDIjAPmU8/kMaf4pi9CbqTAWZ/viZphXzspSNdYv3OSkPmCQK+03oTEmbW5UL4HVbKJi5ECvSwBKYpu7xT5JZQJn+MBs8ZZL1LuT7hD9y0iw8byzmFOPrbyVWPntdTjr3TP+j4tfw5cBvAWTTkkgEYMPETzh1FFBXBeXRQpjkYRirAgK636lH1Slao3uw/j+h+34+WVRj5uddzsiTPephMGJ1ggAoQsdUQv6ZIEKdpf4AlUJarAlw19JVXRlIaOiJbMKx+ePEXFodaDvpwXo/MiiydXuDUvZQwKp0DbkkbJm97mUYUmNZUlqWWof04Pdycgqp0SlVeoOwzUNZZ48YDOQXVeZf7PPMtJLpL71pv7fSdarNdLmIC2d5/JlS4dHncm2V1nucmqMQlXFOy3zl9yT52HT0w1YuYWUXiU3bVBX1eJbrlH+rSh01n0h0ZZVdPoR9WjCO9YqWultm8mUlAh6b1wkz1Ai/BZQnOVOOooui94g1ZM8+21EEx/sCJ7iQuhupbfNTILtOnvijVFM+0KvZDEWCqQ5uv9PPj7TZpqq3tUtdgNgtKasz32zMXBYFvYHJb+JLs7MVuKee5HxcB5DXvVjZReCuEMDzJ5LEkhu82e4omEAjvaQrP3PrVl4NGb3qPQdoOAhFZqDscHNt/XmLpYJkDi5yb8jDESBpWzRlUOQhAl05XYIkfDbDlMigzPYwKmfGNxCKUHLgU/GC3q8oRVgecVeSs2LH4XLB3tO3e/hVqohNbtstVKXPplYgrdyMuwnWpyxws48LzT8TRX4eu9UYbKi8I8+Y3wkI2loiCuv5Ngj45a4YHPuzEvF79OQtwehmH48K//0FAWooL6qf/1YDmVFn9d1wbk7FZ8KNl9W28qoU/KEouIiWNk7SDaDM5MLJy7NaJU91iZ742453cbirCeYuI/N6r/+OtYhDS4d6v46qS9hwNIK2xcg+rbRAZYOhNJ2AfRmnDRnwEAV3bPFR640s52WlHNgRR1AA5sVXkPyO5CyW1t7TE5IVSLCh3ugmBRzq7CZarBpzla0wQYZiiFccjPyepmzYDy2A1TMR+3P7cs4+kA0Uwhhi4j/ZxB3uoJlbWrX/Mhd6GBzzFElnuqawG8zG80fYIocaIv5L1DERpg34r/2GfQBclYnG4SNE4B8ocgHZbzYRlKQalnxpsA+C42v4mduy1Fj5JU6c8BokeVF/7AuD+RAT+2Qz06UlRfTk97Yfe1tcp6j3kUOKEcnL1y+fHrg+2B71hKV/5KIsVopVV7UgoRa2b/9kwkT9rFJNKWg0tI+rHM2Nqyiq0y8jQ9/l/8Be68SnicmZ5MknOT5mJcY3r8gVX3S2inANyq6oQcvKmMGx1GvwmIp6NOd0FRa21ZDQ98OY81VMMLcvBV9yFBtt6iaqkAjjtblvNjy5w6LzUxPu0KmSosYhQRYa7esBpmDA1XgJLTUiq2MDWhGFga1hu1m5NjVSz1w7DP0s36n4H+9fxCzgzbHUnxSVOwD/2bYGqvwgBVQVg8WcxYczqhXUBLXv6iybr6in3gPrMv0B5PkhTQByr/3e3GBTkNtPyUS4MEZQNGvVnjP0q7mjw0BmJmlM1e7ePrhbCmSB7iNOJmTXKoSxyJLjfiB4oNmaugsHUXr76a/obtLKnDz1jkSYl0+SyTye1yiQQmyF0nbD9UFE03Hfy5/MJVKIpvcDUCQ9iblIup/H02rtjT2dbJTb4+EvdgOnduhVsfLkYeTY05mlyWm226V/hspW57FhpZaQJ9f7XFcx5lwM+yysjsfqH6i1NoMW4GmSgfra3Jos7wuTALQ7wuc5iLymIhaAbt7D54iQIOzGFOPJMh5cf+0M8K12zNnh2/1bsGi95J/HVOOHDJFG6pOz+tgBp0jk64/KjcUwXPTd2+2bQxWZYlK6LXt03qPHc8V+dHk08t8lnPtfOShbqaF+gs5cNNy5KeKzip6/KzxVHZ9dB5OSt/gOvwuQwb9448SczMI7KLybexvEh3gNAd9szFBvcfG+wNpo0R7X+ByggOJ3YZ2RPrNm/j0v+AZzKW8r978+A5a89RWpgMSm7EjjaP8wwDNgWV/phubNSydnnjP9TyI7uygJQUpCz+Wfd8lNivG9lxjALTexciVEjjsqkz3KGMV1OW7C9HwAxpaJF1gFJmamgcwJImV/tcPTxakcqwvRp/euJayC/DsuJGYIXhjwNrz4STM3si7gfkhdzWrq+g8xdKPMiJxoaRAOtc6xWLs6ABvvXMrfLeiEVKe8uMRyNncSRPDiP4OohAmJGPtKY7P3Jz6Xqd53OxeyXQ2Dp8omUGk0gsaTNxxiKO0I4vl2PwUoMwXMdol5hU5EbwHm4uJ99lNGvb3UyugOD3CDPTR2ukDDP7EIX4eGjXj87LCLeqVPaFjuzFBmMUtwtmkOoJcUk0h/nFmL9Ei37v60jkAOGbJniIMU801PuPKqWheHK3Ili55n9Yre4olrZgs20ZAak4Wwa10Tn45p4W8k4EsTm5+o/JubNOsOp0qZQMyuubSWmU0zByeEUVykEi3MaZqAc8n4ag+Fe8EA6PfeXSXZxfhiX/Jze5dxo1IL4QbgQ1ITk6N5HHIAQ5mV2cV6gWqem/a6NB2MiDm/JSKkH08Fi4TIv9yENAOLGJm9OPF0G7YQElAFloQRZw5+f3eNs857MUiqVGmR85MhtLGzSj2MmA9uV2IWDsSNm/tgx9bY9qCN9cS9YRXscBRwxinUCEyqT/2GhK8GDF9DFL85i17uzLZ4sAj2btdjHeY0swicltrkOFrcoX6qRK0KzWMVCVm8qg1A3xQiLbFVzG9QJCIOFEMg7cFNu8F0ib23gZlimeCYNczDZ8mR2FA9jYBUjHoli3tZW4zeeDUqIgF25EaChzKX4r+h8t2FByZTw/j4/BNdlSK9zB2Y6O+1aCcg6DZOKwmD3sbH3IFe1pnuweEm0LUxC1roHl/LxIl6oAPbJ25E4i7gsbo//9tIZiK+X4YmplEPxShowsS3I3A4X+1fz7OkkFrVT+EFAOQYc/2af7wVPjelZYI5Tmjez23Hu0wt+THgCXYazBH4bZKguxcS5eAYPRcLPWE/Sm7u0LcGtzOtW6ySTTyBFEgvA0GO81ckD56N0fsYOrc/FBP7m8ZJyD3C8tWHdtfYtvRLLyRfQZ4qj+JA0JwXu1z1rUH1VE7cmOruH5zVmPSo7K/K1Lg7zHzQyvHlmk0hd0zN3CLgGwGrp0UjL5IDY0qVS7FgCDVAbcHH2ywMPlSkB19jrxYnfEyfpriGwM2kyrxZk7JQ8qkx0sPkZfs3pNjblZe9adFf+3XpW/khbubWGIZZsFUmqfpI9BqboJXoUk+tZA43ynnwoinycOOF5apxxXaVYTYnwhB4nhiXgWfNsh8NNNjegTJBcmgGz0EA6PsMKtVkwhLoYuhFQqLsoBCu1Dxxo3cUeQj+GcmPwQRdZk6P1Mm716R72nfBB0GJWUIhAiD5MF2MPuSnh3+v5DgahyytcQwR2svxeqz09tiVYBoUo39FnOerr64Qa0+T+RXJ6PTbYlR83XhB96anZr1SJOrygZE9CzwT8b0NlQeT53L650/sIRH6ryE6lSqL9t9yFBEmXAnkTVRDwuNJ9mXVM3vVbtQobAcJWlIX5U/IeE3whEznGFHxx5gdBQVrCeMfws4aqECl5Y3+b90G9pH3at1KM+iNSBBgOkyT5B7720FxyimL50a2ry0D3IDDCCuc3oKR4wYpy82qgAIeSYTVipJUDuhjf2+fMAqxtsyMFZliclsTpmdnKnTUbSn1zeOe6r4LQB/4AkNVLiIfxAz2kfTzl8JaPBM/FXH+oaqrz3wIxAF5sPnc+NLg7Vfe48G/7fq5gLqmNvcBN8zgUoQInBE5G3XWxMNzUi6gjpfPb8h4zLroCJVFwvo4mUmb1eRsO5ROmLtZdWlsycGwqhmSwjLZ4La27sVG2qRsyXehgmH0jn/OU29fuE7hHRR6/F64NZwJvz12OyDeCXYXZc/T8dxeljiCvi74/w7ank0+odrvUvMlUo5VGFrBZY6NxNClxJl+Ue8JNLm8kE4NN8+zUHIR8Xbco4NkRv2E2SL6IjKioka+MChtPtT1Ap/vGuAf3N78GrNvY1lq1KnBIwn7EVC6f2DEGyf9b/elQYVGzVH8vWtTxhMkjZLYfTx4kq23s3Oq20XbjkV5s/yj0Hw/akHiDDV+C6WaRMaIW4MfTe92rSrKnhYqrks0ZkrZyX+l6nIDgZ+f2pxdXyyVGKMR+4wnD/tHb033bU7fY3o3KGh8KwOCEiN7BpLp+V9kFMLXSg6MJh1K3Mb9RiS2OT+9A6Imgw1mupYQTeLTYsyRnEFK1S0pjdAkiOiLlDMv7Jb+FwZiq3sN9okPrw35A5zmvvv5zyRS21z4vBfd1lpbehorbM6YRrYkMxuw+MGEa2teom/PO5kfxwruZ+e5x0/ennpDBIlqPVYDv+rSy0AEIOm+JFXPGrTo1fkl3SKvXK1DCjmAsnj4uUYpsfzJyRFRSaLpGrYLslktVpKAYIVT8CSgXyveJZa34ZHbw5z/1BAg+Mc0hD7aN+UBbTV7wS65OmY+XfE4jRofn1wS6ZynhGmvo0Gvyn+9bYm+uJxOZMxkeAr2/3YC0oR2lJOKl6CmOVYvf1Jfp7HvBminIImbQ4LrkOZJRlEYBTtw6A13UCoo/gDRktase4UIjtvaf9SlInRV8pBVLaioh1oArCe0eX9CGQuPqV5OSEDQFTiEbWlEXpFWvw0PzVAKQnOkKzLF5XnRa27MOBSiKYc4TJG792xZhCDNHNGlCUv8iIidf+xbTqVZV4V4l2tD6gr7F2HwK9JxQCkGlgWjeJeATMZGx1IpjxUbgKX1y+DSYtKfbCgRad8tG8VNsmC/50UFK/4jqWkv8WJGvaOxV5Tu7Pg4+arjdg8yBtz3iM7GHLxg8QO7BXgOg8kmrxfsbHUQkPdn5aenasxxJYEM0evEqjPFDQhyhMwMhURcpxtOJsTtKMdT5eF0JLg9g3Z8qDTod5h/ofM8oaXX2p2aRdyIPI4V/TEiiG3eZGP0sfAstYFDRuSLAjks0rmOkUMm6M8bkJ5+KQadJZtx6uyZ16qKSB4dSv4xcVs90Hn+LCjnevJPahNz4yFKFZfdwJ02o3VDAeNgLUJh/hOudtXoKeSd71K07LYi7+Edxin8rK/dZdzJaN3CIKwPzWaZttGLcBPeKOF3Jc2ztkOXp1QgdwWCUn/kRqb2JVg8ODSNfCHoBstbVcexB6nFeObCUPQRbvF8L6jxWLz7SBT8MtOBx9yK9NSwp2cktCMLlMurOSCOROhSgpqci9ZFY9rv9nZHKWIow6HNE6I7S5eGqkUnR7+UxZpMONLXczlWOFmAU87rbn7dAMAEysWix+0H8XODgoVuUCrovNsIb3VvTsaFKOjy27AyOohEhBsu3PDXijSWRbh85fle8ROxRqAHHp5dEaRaQThOy3hgcKdGWCrj/9sS/KXJUPp6bqU/ZWkhp5NGojpL79UL8VkBAY8sDswK1VzH3Alx7Pid2WW++0Sm3DhRY3vTjE4+17tSZASzFNEqpxTiXLReRMssLe8SJKmxtvDtKxa21izFXs2cfTo4PLb+J5pOVaUVehXvLiJjMk9k6Yx756V8Oop83K/sbSi2stHhX0C+S9607z727OXQ2FkpWJBAB1sO4sAG3IjKsix99+Dyxk3pFVbVtQ2yKXGCxio73sw+NFKqwQ1yCZBS6UEFwF+izfdxQ2PI6clQ8IfICL3XRy9cW5V9yFsaAOw1bp7ff8qILQKgM0hqKtugMC9Adup4Jw2zHmYf+YpveOe906Yo1oaAWkH/yL5Olc5hKrtXGJaWwGSklPeCHiSZQU31/7Bl+fjjZOJz/x/SpuLrUnVmu37080fVP3mjBaDn5Vb7Er8aHuu0IVamMTbzOi3yFjztHeQYR0rjF4qDwioyhzIVT1mecau+MQKgRaMpYs75YpEublMYbbUpc4ZDB2u35nK9nXc4VkzPEn3Xza5A0pzzfKE/GsOn3yAypCSZnc5nFZ9tpq5BSq/jHFyUJReSNaV/K/aLLhm1Yjb9vNCb23QuSs41TfuMouKMueH7Dg1EHKvtSaZbIB2m/3mMjMtTfmcFnK7jP9iH3vp2qC4G73CTVyitbdxHgpC2pyPytcM5y4sC3qYEUra4R8UnI6ECA3s38JXwSpb9I6hQz+XG8hQ9J6yQ4TCLevMmIkY97tYsBvJzZTD9UxT39ucCKXIUTbgogCayC6xhWWJFVPUR0cY8XOPsG804dMn9TsE3slSMQUF/kMRsM/YHDoVr3ps76k8Xwq1PtdOK6tYGBNA0O9O44mOBFHx2QW3nMDm4n+DvZivniIIBLUwezynRa2GFiuTeyAqiFPPZ2PMaEBivJFw6Preq7+O3uD69WCzYyXi6bPPhsY0O5bojrQRNBZ6W/wcbS8TZxlV0VwNO2OOm24DG2QxQKVh648j+YsPb9+81D3RJbv/DJzis7ydScW32kX/1t/pte0A0LM/lZ6grsWZW3BLxakoC+IIxjz9hO7HNgyTDQpHjGeUpwbvkp4hwXWjKhseH7evJcR2OYW6TRv4XBxF6MgO3aOlQSTEAcPyHBKxdE2h9boETFSOqLbkGv6acaYtWmkYO2sWV3h8FL8F/o55fvuYHKhX5fGYvZXXkUoJCwXcuWDhsENYMpCUJrfpJ6f4wFtd6o/5E3UYCDrh6YvM2+XnzMXv5xmrp0XhRYNpKZk2h2TavG0lbG7PdpDR8XNvbNke2eaMCM/T0F6aY/AS+y1zKLGrwNK0XY1+3lq9rORF61J+PgxCaFWbRRMOP9/+KZjBo8qGJ3wDC0FH6l71Ot5yBT+M9evz24TZ0cnJMlr3PTdGSSLCzcptuYLIN0XW0tzEYpq7viJIdvCEgG3GV76GzqRP3LA90+xr+IKXZdGgET32TtmOWx74MFtOrfxXJBSNATYKne+vVaWEaRcQ0/PdWhhYsMV9Dv+fDTeKkuZqtcGC+Up7uOZ9GtJD1FlqQWcnRSYVuIBD7MyaX4F7ysp4udQQSPii97tS1hhYoiFOXCu+MdkypSpMJAH26HIR6YeiWjIPRR16Gfrgla3DwLDOgy2+spWTAUObFF8++9FSoarEZ2778Fm5rbXZmKgNhKv9Ujn+LSIzDw3CGiCgwo92CnaGV1uvypxnG7r1chF0zIGSz/KFFkJhPNfYwHlTNFqZ0goCfF38EeyCWypjT7vD7p518xGIxA1ZnBEwI3Vpi6lL4rW13xzsZQhXCVUXgO5gn7gcWxthxGhjiiHIiNtdZWIjwwjzj6w+Cnw+SjhSUxILm9AcpZEGDprnaSFWUSj1QuzQlKuwDAiCHrwROamYtTNSRgUH8GI8WY6tBsVEcuBHaqMvhMYF3zXzXyQei1vtu6rnflq83qFhFHC22TQWWptxKW201MRhNNJu40QN6XmiXrurE0eDY49oq2id8Mump4PVYFoL9lklpxiqKI1EZwIOXvKm8/zZfX6as7tFXoM/RIPnrzCSw4XRsOHTSUWbWI8/X0vAyofbnAOWxQLi8otGUq2sMYceOzum2VvCHZIBBJq5CILprf8xlVFjVup8IaWSeEy3Eu+uctTSqpQFzbFhchNwtUsKvaVxsLSxiFpsMFEMjqdN4b3yNyZOeupt1ucAxDu1JUJYuLLGS2SbE2m8ruEeNp1kY6mdvbwef1UgpJqDdp6vYFh2a7TIUmhD5wrZ0+q4D6nWOR293wCrvuXB8rFuMXhaVeiKYFPB1SmY+At2f+nuQYI1tIJFyATzOtaU0ejLGBXSbd1Ci2DG26pdqSrUkdjBc2adMA+Msfwg1h3fN7rJImW6FW7IblxK7tJhn2wp2f8tU4QbCJ2V6Mdi1uTzBfKAZa03YmySR0Kpr/xJKTKU1GhsAuSji5OxxLEBorzmLCr1W/NaEayPe1xJfsurn1lAfF5alRXMA58g2RcsBq/tCnA3z+SifHvrFk1WNrY42EWLqHgYpcmDZfKCsy0eQU9PzwMtLKSf9MYF2+DznrwlvcXYYlrBOxzmXnrmiIaalLf+ihRd6kB1LMVrdyQ0XOYf1K+rn4OEQKVfWW1SpVSK+dC+xnvXxzUu7PV35G+2tzQT4dmXxqgCk46SzD/SK1Ko9xDag/KMQQyp7fvTbWXR1g/eAn0RphsGN7jz7Jkd8zofpl4ol2QJSLcmgf19BZX8BW73Zuph+QOzuy6aeDA7/RHQlJhpw8pBol8AGFMCOy/cSKcA/XWwt/54JNTbVP13U83OwW9ueRymPHsvU4Xctd4ixqrmq97Kwzi4bjfsM7GQAxcbK+OLg6fuR6c8YTA/ftsFRN4ws2SK1l/L0YLsC2F4agaH4kU3QKjbmPBjWAQxLmU7KPnPx6QaZOxu1zthWO3d2bAmgTUauTKpkmepFGXr/sgDruP0S+Ii+asRDgD794miQqlrt462sXMxYM6VlgQTDfmcZyuN4cKXeQWAZWvRSmWNbihW3TJuuiWWy7EaKV/tW6PXflTpSzMH/fdPC7YrQG7GmtqI9SKzWg1baNNxnPFn9KCMSzsSJeSOgcqr15WNPY5LJngBWwHs9a2Q2koP4ki5rlGJT6Bi5icv8BcQiDZQdbFnXGnKn2jS5BUho7jtCElPuNDb6GbnhSmm/wr/0ek17Vn4JLK058ds0uOGUDn+LzoGvspKwGY44Dm8syqbHGRmsCOGVgbNSM85sTpW/hIofbT3lN4TOLuDeRLEZJHm0NOqc2Uq0ivrQFB0NukTdQwA9IHI9O24lcLuu2YeLH2uaJhdO2bvPnduaq3qHD9ZyYSoAd3ejiTlIln5dkSAGBA/RJeiMljXkxLneSsjAVnzSzQsZF5L0QGvTAQkeygqo6QSvq6CTyMNBpTZiqY8BMmrK4CBAyRnBfFStQ0F5MAdzJUgUNYJy0oaFkVe1VStKlorgKhQNQBBkRqgLf08qJvPMcmDEwPUvP1kLp4KnL90vv/FyXWaLYwRYQu0rpH9BCzmxq2/3PofYyd7bC/hhdRhDK50829H22nMncsy/Q1Mtb63gWgdgeYR+eU4tiPVPX63+XcCSNEFd9VdEV9vn1/DCegNWf2HIEaZvMH1qSM1Mx+so8McQBfZIrJZ+edPto+J1f8zTCJqHaLbngey+GSga6+Kh6eduTnVwBhc3OdDjZNC58AVxDrg+bims5z62W8pETUiyXqHU7bC9lV2wgPExCgq1QirXZ37ABgpFlfvPYLaAHn6jnWqtqAKCIys+jrAg40FHXq3PzPw5cJpnjZhyytvVcwUuEbFoJxUzTMotQFIc+PzgKDj00sWYtXtzbJTn0OrWNyWieq591kbn2N6io+YMyNAehMj5BAgC92rmqwp6YXQ+bbwwUL1xRKdVP0BjM89xIabpmVIwRw8mLjVQsekzoIqkRHgq8mG3Z2nwOgVw3EyO+6f6FOhsj4CzkTa54shPkCjEP4Cqn4Dohk0a65wp3Ayv71f7j8Jk1MF7KfkRPgcDatl8mF0ANxuVklJoNnMYpd1GuAZFfb/cCsaH3B8I7Tcs4MB/KDOo58V55QVuLuFwfVnVwGUYCHCpyDfX6wrY7frBa9INnIx83ujP/uP3fx22rfPMoiT0NO4ja3WY1nBAdhIYQGPgW56Xd9hovj0rlFgF4G79rrZZ0HGBgpsRmCy/ePEHxCp7Ujaka1+zRWXXJ2FYmh4feowR4XKqLyKCmXpqmopjRVmKuAJNCxGnLsLq0D7cfz8XiYW97P1d2Cvio+Qm0g2qBX+e+mdN6RFWOj35MpdHx/lW7pP/0AIWPqyijGnFgWBRw50y0yxFMHZ+r0mtljc3Rk+SjzmHhxoDHTTQlJVqg0ZxXgrQ+56fKFzVX4FoREDiJMytwRk4HC9cdL7o4f2Xf5imgWuGxDo3ckjEnuZh5bw6VPEeIwzYl6PvCW4SEHwpuS1WdKxfJM0RhrUp9sEQy1u+Cutf/jxfcMlGhcLbjvSLnroBRzKQNjF39mC0+FLNnR/RXYqbvjiZpwdHJ7yetnayM8wOvyAgLn3hLu+2LY/7TLv4KcObCIpciQrJwzruz9xu9Ea189CgKnURYzlwc/SZw+Nb2phUAOu8V8TtBGp1ZlThCXYFsQlnHiABpxLJUeu3uGWe++dZFpz36EI4EES7mPdloX+uT8O6HHgIoGxRIrGHuDd/qRDOhE5U9+a49QJ82Cy4bIblmMXoCIGRhWW2aTt5dDVDzgcX9AD2tKV2Hf8l5vmITmdkJW9ofbabY/7NVeY9xYH1wYvsf8PeyIi+p5K9/Ih8Hxmi0ulO9YQGUE26OL/L77JLKdUYiPH8BIm4KasO9VGiD9/3RNserRM+1oKxgawQQCIQaoE++xxtm/cbI1twgw8p6HtwLWQ9NANFEq5by3BEsniWsayJhbRUne/hv5kUT+Uwgh7CLzM2Q3PkHbGheBLU8D559xNc02ulexTWnibVHqA3Z7CE/9rWtbV5jSaF9YYFhpoYmwqIRo9bl7UndcKPhSNVuyAXaikx3p7A4MhvmcTiW/8mlCqPcba/x9Xr0x/slMRF6jrFz9Rw3ee/LGtlrGnfWqaTA7eD336JbvRiHQ4FwiURZwY+zQFRwtuEZ0RoMgFkYT0NYUmo4Je7MZ0pGi311ud+3NNupkFBPv0RCq20BUEPTj80TSnM0XKX7H8fEEs7AO56ocMGCx8Vbgb4rPXdFLWKaCrhjZYm5mSNq90I0h4RSsfKYATCwHiQmOLVMytXsKAZAvejibRokR3xIfs9c5rpXt539mHXRB3XBWgoeh7Uipu4oQO1ZQRVMaGEjP+nkgj8ssiIJAWmVsrFZ3apqM2HL81Lb+ws8uG2DnWGZTVI4WVxP9rbasVjdPaBkpUOi6KVTaLs6ufltu9+GZGHI3di3QZ55euPxc+rzW6EVz/588VHl/RajbESXoR7Qf60gxyEPPob8IvsdBrKVWi45EMSwsGgSVHrB1NSJ/s4T9WeShQ6PEO+VQb8CEdJcs/sUhmFDiN6dhip8BD5PG1rLuwr/emWOeQD8ILO81PNDOMX8SqjEWnilp0XbYjb1JWlyZcjBMBbC0EpGAZSVa9dWcCujKqC9xhcAZoyOlmqVep/gZbhKzEixk8xdSWov5hqeekXmMNOBZzwJ6UjMyE2yi69EsXbv27qVYKHWsIipL8Ok5FXzUDrtO8SB+AeUtExyA7L4J0SjGgWfkcY6hSl1x6fptH+1j8x7ttcOHXqmlE2mCcNttp5rCe0lO1nD0bgD5pZhl+sL2CfMvQlVn0c/Fw6aAYutxi4Cdy2Bax5/GmipzoKk3GcN3HdEYBIDkVztnbYHk+mf99zu8Gp1Mc+/vV5P+DqJObMtKtsHW9YAzppeB9k5ZF2kKhDTc6gkziCcw6y0wMiElmTxkLw/wVdw4q1eExEqrOXhFxcIgCiVZlImyj7m56Z7uEGXPQ4W2S7RApZVRjaIhLYG5IM5LdZO3Gx9tn0EHfTCl0cWfsB7NzOP53d43E2RwJdUGtukcUL7yJaxo07umSel5FV7HcNP/sBw56BefLswwSH774H1ss87j4xTHFWLOzTdhzqCyqlg8fY6TVpTN3IKMRfzYx6T1gaRolUCqMRNMAZkTnRZ4vK5WcWFh5LkMGubGKGUJ9lNUdqHKlDELJbIkrZ0dfmF90AlRzvRJZSfbnv3ojteqnnS64f7PG2TL4oLZ+Ren2V+yga56RQyPdpujmyrWxBTjnrUH3a1VKUxIrBEUJgF2Obdcacup2GttX2BIaN7PGyjsHSoAvrmeWfWTyLA96lvULX04dTJ41QI1fquG2U4WVrDtrcuNYvq6zetwnyItDxmbcTF3NRhu2zViOe14xy9uI5mc5H+ksVnD50uRIAGSudTBPxgyi+a8bB9FQij34RYDKFZGMiFWLLHEPKz0GK8f1p9H78sBzZUJeNChwFgGeZeVVPQD/DAiDwHk3ZjV+753TeqdVNqvukjaPmHGNjB4BpabC9+c3J1S+gq+mdYqqJzFgicXs2Qn//sP8Ur1GLS7aI/9f1VvSydaqWHLZuau3g4MUs8/ohnqEUCNw7McENHMw67kSrra3G7ZIifR/SSLRnjPElke0FWV5nmWclvQAOMA2ecCHdJfBcPAgPFCQt5OVVlcmZqKg+9lntPVf/zbzDl0m/gnSX4ZAgA5kzoUuLQNlIFRmvHEjFUniCr1wAWJx6Ha+nz0rzpU37ccr8rM75CBzKbyWXnqEzvorIxW35seoaw16TujukRcPuQ1wUiIhptxPsQsDnq5LId+CD/uWW0I+UDLQ0cO2a0bD+dNeoYuUWNbN/A876ePR6r4domLUh55GEiFOrXTZE7VEly+6Reb5NuIqz8JjMG6uOCLIFHPEC1nqD0C4Hys8FTDQKgSRc1r/C/a0pfS7Ad30lqm2hwJaRQWhap7du5Ty834X/GdkBxmHJqYHiWQguQ+taT5AK911Bxax7hsYU9v+qT2RAmuyvSH3b8imUzMxRI0STcet+YAwlPyX2wp5H9b55ov097rgedmPRq5TEwaInWbOYSh4q1G2gsnj5kOb54lY/nSpFz1ZOfJC+uTyxIZBW1vBB7Ww4t4I3dTxThmBtJnsUDGHwEKBVvaNNiQMkxFMwB76wEZm6aLJOfPkDiyNorgX2pIr2flxF5aUBq28/tLic6dNq7DshYarw1ZGehdclTpi82HnbxzSCpogmBFzw8PFQcQLNBCwZS6PhfpQVxohLhqOwfcny/d1AZgF/SsPxt1LaylAwX4WHhowKmn6u3flB9otIOd/kxRISP5bqwGfs8gw7INWd4TA8ijUz5doQGpipx8bWT6esns/5HDE35IrcOl4IcnOSCFqFJhgDh8qF5JJZFRvrOzWlQx0OicoSWn846Ld9jRJXO7Dd34xqOFWqb8I1CL259qbDZ19i/xpFI03NfGxRPCsOZsLaJOjLjNBIjNFB2UODBiIY9fWkrdOsonsUHCvnPIX0Gt03N61W5941HLvLz11GLobB7lj778/HxfTqUZ9FN+X2aEbOMfKTBFMj9WQv1OQ8duBOahBL8Aq93QLBPxqrnWmeWWswB0xDBNMF2Q6kl9ff8hyqTSNmKQNMtgtlDTyTOi8jbr7mOQaNEkrbqrjmYnfOtP/XGXVC45X4v2q+XitqPHLkISgeZ802G7AiGxhTvV4S/lZFDuvOQwC0pxrL5R4jtbTTpGt+I9bg9ADxGaJYPGB2NVHbAdAs9XMBD7qmurRL7yZRYqZCmM213Hp5OZAVPu/w484o/AT5ls+wDrqvlwddrVxM0HkEKcwaTws/L7IrTt4xcdrEPP4jqREJ+CbzvQCp08thy0ltX+Vjp4EMSsDDeqHD4WRM+aRPmqD6OfAzWVYC8fooC+K6Hn7dlFpyQVRkJGqdQALMqy7yCXHtYn7wJCJC5OeI/UlbFOP89afDNJU3W6pLNAFu7WdCGvZkfhILKorlJ18iRf05nNfORolID6ua/3gGXOOdCXcwlM9+S3ug1Y7BGTje46nvTGyofj3eNLpo3RvjDXvREv2uhTRwDIeq9tvnEBU4MXTn9oposq2nCJYo3qiPTFJTAbdeSWH0dOkP885YNVaMbuR4Hestd6EEAUGd8ZAmjJr3ZI/rBoFMt866dqbQ4mdh7wt1oFPPhQoaUD8Pi/EVgjFMLDRm8QiIu2RrX6r4cfTaB9AxdgLzg6GvY7xvRex7Jl3h6p5h6xoeR8duNbVV3Wj0E7KXfwCtR3BxSK9xTsaML0sXK6eIJIaMCxgfKjQPoG1B8bb5TISX5b4zTtK+Assqa9FYbSDRlG5xYnAahFQvQf91A2NBUX0ybMWRTI7CFtCwdIVJoN51y/V3Mx86QuCdF8TnnKR/0LEadSVIMgLg+KJXNpQAngsD1RbbHzNy26GIflVxUjTc8ElhLm4AdscsVmrerLGdKXFhU9ZhA2MaLg5rTHBtJjXSUI9voyzvrfhoTiWBH2+eKgTPTS0WO0uWdDByeS2ppTEYpLSerI1s2n+z4ahWK1dpSlWRQGUT9e3SNHyU/nEb4nqfh2MQvtqMuyWPotJUHAwRoOE54piQ82TlGBy+vX25lm/9C8pPBpCRk5XxDHAYyQSZTuXKLKEGsbGmD7ahhy1qQdkmEFXFW8ae4/cf2BxXtn9PDbbgClELWZF4T4YptM0YlT5e/F379Vg1FLCWWfgB8m/Wh3Qcdlej1ze6M9CJMrug3sRA0EFMxkMhXlbYrSmg56QiYbZ9HGVE/CdaizUjI3wZfBB3SXpRrC/rJPsaiDztzw+JmyECiqdYWzooVnNPiFdZFsiEA9+An8d0DHFNzJP0tWbgWTVRTcKIFy2SjaUJUOW3DnGdXIgZZp8HiOkOzIrOb9VxISnTGNvvnQq2wrO5CByx6ReGtMywbsjvvub6Pv8S2fvJfCJHeZqBjG4wS4CkkC8ZRaxkgi7zEbgZepZ/ikLzazWyjo8D2+n6dtesrQuo8fNfsmxOe7POiBn+ruS5WRk7da3Ym5HLzXRJZMts5snBTF34ravE/FkZz8edhui0tEkjDKYXtH0gxfiGh/ZuwK9HvegLNQrOElVVMwe4tv4Dz2M+gPpy0VdqHTwCFpWxkzZZ8Lz/Wj5ajVWQF0Q1u8Du70VrHzps8JW1sAZRnOgDmNXmS4dUYkXXxZvLy631Zvjokkh9S5CGTxw09uQzX9C3AXoTfuGF7sfaJ3NIECD7pzWlWZy/6zCTB0BYvUUHkMSfIAF2kaEjVvVBKOE79h1LdpiznCN6CtVT03XRiNtdVOF4ze/hjtm+6HeV7I4MZbxUg1nhRYKYUwILtk/HIoUmH86BeMTYedDTH89d5b7l98NBzb7VYB5fUD7CatRfy0pNtl+hh+HQLpNNRprEZwDdY8QkmHWXZbLHuyH4XRHmfr2ii+DgForFSOGcaLTVjims7Vj6xmYc4z7A4WAIO7tL9OwLX4fKbzzaDkGpQ9TeYlOmtUPljkcZ5JqrkQNXb1HuuMCvKvguEF6MvL0EenmUw+deuCAcDu+Ic1IRFh3PG3pDNCBvxOGNaazMqUDrGsW4H6HBTjsBbTLZqRPYsKivMp5XJzm1mdbJQQ8du81UTcyimm6l1+kBCfGIWpnwd2uMS2cpor1KQo/avIwdh6ZIzNSFj/yxsIGgrfnjPbVd3PCYrlq8BFEerAXVQBZmjfX3JHn13ntBlL6e+A/IP0lPk7PpaP7gZoS63MwScpz16VkFsi4PAOCCii5r4Akq5Cr47Lb02Zr28Mm6FM7kYt5vJMWvP5XmyAB2oLx6YTKKdAdJeMzHpU6NR8y7Chz2zkffosh6B9LjjA91n2xWljhDOITvb4MKDiVGqWMjUmiAUpIQlsURT31W42Qx+gEUkN3mfiyyjlcZsHgfs10TI61jeMA/zMEZtJCJlCa9TWVx7fWhdWQhgYbk+vfEeTM/ETCDEtZsAQBt0mgdKTfpbJDVmEGyP+MSePZfVkGSGxOoK9th3SrPIr4coBAHRK6AMNeHVMAIctMavDeMCEScqgmJ43dZ2g+8/7/J4cQRtvSLJ8zWqoiXBENxmS2I3YFVFI6nf4BO1xUX3Wpr/iXnV0saYDqwSh2vlTIUNV8kS7Xrx+ap8Gtj8bQQiXsLwDI07PtBFKUFqufYWpGpSCjHpV5nqDK0ZvzzD7ELa4/krf7iqbNXBvLHKJZFWfRO70WeGtF+Mc9lzeCr5zWbGeDiRnLa+gAGBeoRgTlUJl9DXXzj0LUydccwFdapCevvZBSRd33P1MH/R/UNYVYdJPEn8l3UHhvvQ+C+0jfHpYUJ5Sz3PxqQ8XGPlD2wJUGx7KhwGgyteybTe7n5D+B6OPf8fj3g/4Xxg2o+3F6tj7HK6h1NQ56DLwRt7VKpMbWGn0iOF9NTeMr1p7oqpKNPMCUMfvrPy3N2u8ojHvExZhczR9YtIEcL+eA0RVGs+geJIBKbtyEQ4kDe08lyKaPHO7GnXBKK+gmqNaP2Z234f2ma++cuR+wymfI+0IkHpEOkgtKMuuk9DCk3IfFiS1p///1pQEFmEV1cpENfC8g/N4x06pu3Ym5jLTSxmmLn+czHpX4Z2Mr82jupkaSSzOTRp1Tr+1ir9NsOuPNqmUmdLWyRxsvXX5iMJ4M6xB0HRScvoMOg5FbETWJYq9HKIKnojoflTo4FekQ0Qk5NlTwU800djQVQE242NBogagejhaO91wm8QvXtOzMp3WSzFyrmKQjNvEM68QKewBZBxRcws0tpHzQw+Msinxy34P6yig8jw4C8rBtlbYdGxZEeUu7emFy0xkNFo7/ufmACHTilYN4KPVFWnBc8Rwb6HXx8kaDepwCm4WJClbMzIJpVvoMBG+QLdcoQ1xcBBQX5Aacf0ccqPv/TLbQ4LPbCun9G0BsWYzyykuCqijDkW5MV5wpcRxJSi5JB3ZVHZn20lDXfN1qVs9OdxorXh5pH2yjuFre7qrHFFX5d+qmhul7FE9PcR72WZ4gj6F12wpYi+9LcM1YA879U+y55YBSATceC06GymfSO/eqXyov+eyZXn1aD0Bgc48E8BenHWQTfw+8MRhFIDaxUYtGja4WanSW9P/+0LC8Ke/Il+nMKX8O5f7X4ThJlfiTyL/dumaHfKa6W4dCyUB9db9DqPgVQq0p6Lg/yq8pzWJAfpj88X0lpnPq7V9O1VebSo/GgEMICbnWebOSOo8kYchablst8zKcxOrc9BQmveCjpn/7jUFqKZ6Lp2o9oRr9Mukzx7d8I39K6a2+SPmbchBIyqDwINCMemglZ0bRuYOAKkoDWJQVLYLdtV8zgO2A9zzPUx2bQ/WAhUx1Ag82+yb4jVrmnHQFMuV1e2ijmMfo/nZxVgmvf/i6t5CoStH15bTUxChE1KJzUIiXA1r6qEPo1aC3NniBBv72nTUzv5H5oKlSoZ//FfrccPKFavHrJsmmrMLo8S8bhjqh2jzh5eYytwt3kFdh65upRN90VQ+KKm9xEQsRB4nJuia2geSl3D4oKlz4Xqx3IXBMg36ds3fYm9wL8MH/2Zzdq1iznnwDkWI/BANaaKuZuuRCXfm77u/E+SxK12uqcRelBUGAbs/UOAdd7W8dwuW3lG1CWa6ReHUH3YASkwB9Cu7rVev6SmK5zNHLJoYEfU39Z6P4NzE0O08sxaLgA8Y7zOHnQFca27Ov1VUPlY81ZFtSlgoyXkYsOTdgjc6RbkkKaii23IgSpVCkIYk1wTUzhtYy9RMxfVi2slTtNGoLqQiFpOfKslNMFnMDQrbyKezUPfVpVmssQXr682gInu3etrOuDQDmPzXvyZOVjAGVJ9Oq10T81x1WfPavg1N0QzyMjKkASqc5njLky9+GQrTXkU2Lk56tbE+GWE2x82SITR9B9d2zvS7/PVKEOB/XgSRVP4VMQszywZRyhylz0JtB+jpMB+TzyRvSQ99eUCE0fo8fzIs8Aa9I6xm04QdzA8/d8XmrCfNFywi/FhTiMNX5/x2lJaVvCfCNAYPIjjKZlB1LSSMNRaaFvSphWfx2fYZoFr7B20yXrLkFaTkgQ7s3yw1oDRKNGfSz2hhX8TBJR9uBrl06Of33uJchdIuBalRqIYlZpMYg/2biD8ljckvWXbYFQaDAapMvrneK792tV2AT4IaONloaPWKVL0L9lXpqsKJVFESRPRAp06sSe8OY2mK3K6vE46ZFoSN2DsDVdiuDsgG+BQcHGyMpJzdYksFAbyDpXCMZNEVyRz9VeHZs35S3OQqknGZSrjydYLTktttKOGk3dvouehX474SRXdpYQWwrLxGjDimScDVmxtKId3hYqr6XnWocTlTSitVpVk8cGrT5RADqp9yBs6hKmgJg97zZtkQwq8Q0jWYFQDXKM7dsBIQ88BoJ3qaKd7GPk/fEy5t+KmHf2MCgAujwe8xzq3L2gg3nrQY66Oo+JrieNm6owC7Bj8KTrYTzdjmGI6jB/C3pGzje8J8W7T7QX5zkiduWT7/n39w4nwdl1NnD0hEPbBykhgg8MuMRQlcFPrqihGBhCs3lXwduFLLNcpn8thvAwCW4tmZaWG11LPUG7g9ZcBtMP9YbGjVUdqej/L7+OHoDY7UvHZ+tRYpqr+tjC4+9ypKa79IBfVBqMvWKh3LPF6PEP2w9IY5YTKEhjsDC7qA6CeXCItPlhM2JQ+UJXI/yeKV/RMr0j+rFUugmlgorlPF1PvF0JbY3gs4YsW7oDU9Y4dUImG9UYD7Pg/BiDcF7u/a2KDAFC1VfK5tnvoEw9YVdrb+nFe9iTmweIS9H5/TeKz7gj8okET1/3WRM7186NtZvclgsX8v8pJ9ymBxDgfv9LMSor4VzvemTWO7YZCfZu07uOXBnlg/YT/OsLdsydFHyZiWyFXMPFSWTf5KCzv/J2NH3HmU3Z0GhPU+9Z1IGeckvnFH6zGrXswNpXYip4taktF94J4Cs+ZP907qhBAmngIuJ1Zrscx/0J7pcJljJ0H32hnWk3FaaSIuL+J4y6j/LjZuWiUQZv/zQvJlignBV8kNmb9B0XQ9rDMiFw/31myYJPEwzAXeY3iDzILWq37i+9pj2w3CXGdJ4hzWIkIX1FJZ4Dy23+0vMZ+SiVBZmUWfuur/vHrClsFnyiT5qDDGkuU20rsgyaC0UmyCRy+O9WdFUDy6q2gjvkLuvCZAjSmv1PfUjTpsWdzmcZMvDhbj547NuHGlN25cPONSGUnpHVEOICp2KkDS7+UQjEXKaL1KUwoKeV0lAdStc3nWabHK9/dtYrtMklIx80hn0vejfOGgpLeJlpbBRIgq/1H0ObfpvrZm2qWkXztVc2dGM+XMOZSC3SrJ0hrfRSqyIEKwxoEmEJXCmbHfqEjd/NH/KPgXF1YFszhTCgPT0x0uGgO1IiH3oAgSEwkafMMgVOpAxiOIQOpEGZXCPh4EW/KZm6tt9xJaXhHK93Ww8xFNEEA3OB37+kRsxbchQhZldV/20acW0gJaEd5ZA9mwH4Nqwm/vekUa1158wHvMzh02cfQCn8iHm3feY/pTHdsWAMWQ77q6Sqh1xnrQfm7ROLDk6hdNE1r/P3p1mEKA0PsPySDtSENOdUSXCoVHF9qyXKgpIPTDk8MqOHF/SzZ2HKZJWkN4KCFxF6N9UrjmfA+boykQIpu2c5cqyFX5je+F2kCvxwH/vV9X1Pq+cU9JZBrgbG4y4R3NCQj3YW0K+al2OTj9zXE5SVI9eRymBnOVULCURoM5LERwp/QiVC6/oprenPLHqzvIYsP2ROXfGjt0uZxy2M0o67TGR0+vnFp2v7OgTXtD3aX+R/txqEk80dhf7cX8Fa5RH6evNl0urJsz2svSL89N4s7dtMsaXUeDtg2BR3gfxnT8ffLPHEKB5P+Cq5BiHmY+3rfBwamIKKXoNA4nDYuu+fVK/7bEGJZtPJW4asYBfiPcJKPhbu4tD+DIM/lUeQEY9vJkSHO0CaWLrHBWiEmW6kJEHRVUaOay9io7TiabPSOOaq5mebJYqEz/RpeymB0lhjm+MkaQpvHOoBDAR+Sr4V9tLGZV5iCraC9LOKbV/ay4pKE0YpUplNc5gFHsuYiXW5ZoC8LR4pvqI4UpdxstqqHSPkvrPKSyoWQhxF5k58MR4/op5PZFIg/BlbbCPmAg37Zfa1ApOJQWRxbYVhZNRbHOiO2HR4IH5IPJZQvo7pz4U2CdBbNs0XM+vAssYvNflhvv/is77Z/G0T1GIGOZjw5jJ/cU8z4+n/iR2LGsAAA+jJvATqIg/D0IgAvt1T9p6urtzFnIToMYYOjHgWvMre/rpo7694B8pFPt4PPEyjnSkB499jt967aTSarMi6y+acnvIHtJ76eQVYg+1T+7nSf5I2AALx5AXSLz/2x8h15S3twy58tNtY71je8TOyaMA4pc5yiSF9JCk+NcYms0H9EcB77qFDfrihZadgje6pIzFrn+JUGMsRVjW8pI3nyVuunjAf9p7h6I32TEhipyO/piOFrV1krtTCc/Rw2P0KSCZf9DshzZgKpxuPzyuYjRERtK1Sxmdfb8AgIvNvJ/WjziohqR65oZP3znYRE0LBkFbC+O1Wqo+O6Cbg8LjuFVZJGNJejYSx8jNwr1xfqIfdyMHPksSR3QQXr0KF1eKB7bker4JRiJfZgghVlQf5kNuckcbmCgvmDVXbaUo63lbXZX9LMeGoXByOmyZ9Lwh+cNv2Oj0m9YMAzdWlJ8nRvrDoPqvCx3OdGKcQv33ScjWNSsHAQAoJEBoY8WxuJxwop0yDiUfb4jAzAoCVk0rUrovN8fcv+mf1kIoxpQWG1AcOjNb+TQ0xyERTQI/v6mCEkPFYPCrgFWQyIJl6WcLPIE3T3ucM7LlJeFt9MkEi5e56ZVn5RWS98hXSxyjqBHi0ijieuzM+hzG2IyPpcfYUrJ0jIJcmynoqyCLWQYGHuqLp/JstmXaVi0mYTSvhCM0M3XdgHqf3PCB8oc1hg/DRTOrawErlEdjoMRpHAO8M4yx3jP0QdbEdaiXB0+/+5cYcMuKRW8wVrud6je3y14jbapLleWLebo0z4BkGxc2zM5DFvt44pT4KdBnn8aApvQpz3PrJTi8TsCtOBDK6Ptt6/OnQsU6VoYd2ZWMmJUuiC0d33LjXSd7o4MCwbAht0nui7wuxvaeU7P2xyyNVU6XRNatYo+6FU3mbM0I9XMryHNP3A9LZFW6l10L09JdLex9T1lx/qhHqYDavlZpMMqGfp771WwBzSbqgQmbsXTspr3s1T95uXPLPJGZKwIp6zfaDMn8edv6x45VpPxLgwswmO8LnS6NrNp7cKTTuQLmihKOEmkP+vlZ7E3vdQWMJG7xUen5yBKUO4nIVz6AOogWry2q7t909YZtAAZlKA2M1fAr86vPZ/LKeu4BJDk66dRYj4a7gpwKB8twH/Ve2hasoPh5tuhZ0xgI8PhsHxZjqzskeuISsziYnGwGhb+2j1mqOnTWunNNcNjx5OMtO16yhT/YjJSERau3gjBZrx4Z8I2/hGWUkD/+9i2ncui0mwWjAAPq+FoTY6kgS/T7mxNGqbhEaGGzPgdtfLXXQ0Ygf8J51VwVPJF+5p/X1QaDFkzkCOBqOZuleXRvyoBxWv54bmeElSWesNCnKtaqhDZGsjd2TZ8fOHejzPOMN0lM6FFWQoDMd0auBok02PpuGTMbm5NjTls6iAJbq9S+JCOdpsYC4TziC6IaRE4MQnYhGexhVIOlvOBC+Y8ZVZ9mxYBL97/9kyNwj3bkiZcCFUXCyTaNHIi+OxuJywe1kAeXLkgYhJ5pHkcz01QobBJqAXzXhqsNz5OdAiT6psAnuuimuQ5jsgb3yfsvM2TP5QWKm7lmPeesGjMsG4wB8b7M3gFmq0esl/UqoVny6oHl9V/1HrjlS4pGoVmuv2mW1xjwtl9W5na5xNfWTdtsM8g88ttAjHhAaY116ocQPcR4vVjbblI9ti1Kgzk1jo+53VmtAds9386ZAK4PGkn9SqwPY2dTifmDsVnSHot9Abk8H7HsGN6jk/k/zc/ih+wyomSzprQz6A5gI9JSYBJJ+a25ZrshwICa3TtvLLq+3Ip9knGlcZcpH6gOBYtDsQKblhvccyOhHyaZVUcJliQSommSKgfhu7tRge7RbJjB2I95wYyX26B0zB2RQ3+M/LmEkg1WiPnyyvh4aOCaLSCgMq9UilT8BJnMKMsoCIU2P5iQvcGpK1LBCI4CYG+tW/u3HpaI27JuaVNDskYam78XwE9aZ5l+nCkoz58Xo+GNWGgdJXHN74syI/CSmCo2mWTbastLUj0aphWz26P+uheV4IPsJTxIavTgB9r3XzWN7iMnqHChpy5n+w/uQ0SNWx9E08ZOuZ3tpis+LosojnoqJwjXfWRoQzgi6jN+WzUimUR0oPB4lIstVZ5sz3g5+ymLrrdcMvw8wK2BoXUPDaJZMalaCWTHcNL/7M+ZrCLUcwVS9EtsKMU8DIoO8/FOYycr7+e66mqDKok9QGf8xTveXfER75PlYGLnCyqgMWbqy3navR6gK+cEnPFqtUw9N0upwoY/kw+Ka5+OkS4dYK2h1yGeYiNFKaX4/5tbf1PZvljb0I013pRK75HEWYZKUtBomUP5ZYbYo3UNWLDYrbK3YfRTjkwtjPoywpglczJyKZyiujH02wr/cWFhls775v+v+Ro1ezrqYMA75q4sQDoHD09wRFDQcPDrAskdlZyPwGdS0GPEw7tZlL+AlyRbVVCvJoZzhyeU+Ak7RmvxO9I/QTYAPp2N7ngzPLHVmqdJXVohutnqhjNC4OKWPcBNpJqi6zvJX5V3GU1XQd9sgtP19QRNeoV2VKFgSVOYEzGpzP4stKjWTUqaqjH2yMLnodb2+23niyk9cM03MKdYl130/YKBpJlPfO45dsf3CZ0r1/t0NGONge+8ZrVdZwS3hZmrJ4QkUrem3BH0nRqgACdydbIBiAAFq4mssVekBlBv2EqsD/Ml9Y+KFigYcr5cA1ArG549aRJs9jDQt3UNVqZ2/hF7cMH5YC2UDf9sNRZqaXFVP/e3WN2vQTnUFeh3oJwnSoz7CbF5CJ7Ig4uuMw6T9vGNi+UwqvolxJGxz2iT6jZwrX9C4xuZJjn72k5SPDGkuRMCFVRdXPSgfO12klW62eLpOLypv84vJRZHUsfjDM8LOKSDtULtLUI1m+DvUgErJho3opr46rCWS+8MKpHPlQOHiaqavM3YmOzISxlWrf9Y/zeMZE5lJ5KWG8h3ab8yYghYFgPyDCukDsIN0yUQIsrWqQ1w5/DrxQlLMYkb7PqU3iA11LsD7io9mk5RTchKLJVEN+znugRLD7l1JRU2xmeAjwUDiqF5wvrqajrzvQbHQzp0DBl2Anw2e+v6LAhcUxQGM6xU5xOXscEQVRVz4R14ej0rlVasP8MREI8kQt8KKHcIDsX2ztU9CNhI1zKMFTxN+u/GUNREca96ISANXomxWvVRiBXP+DH2tzDhZ5gfDnEfIpHH23HBLvcMmyAkQUYkIkAdGYKPQ4UhNdnxduR1AGu28KZhM0EKUhGqyaaeVVQ3/0Ak8Dz6Nu8f00nDF0wdNyD+GhdAl5dKuWdy+VGzvT/lzaJYzpa+Cq1gZRmb2nj/krCOfGLzG50c4IJ11MkJ5yIomwdtlv4T01PW0//NOLm9Oks4EKF/Y2eXTn+1xidMoVu7u/IN7wqwKLY4aCO3mPG+aZU4v9oSB4JVfR4aSX7BsaX7IyNzs9U7yX24LCg8KVnksvSvNlsJVSNOKjtMInZbMa/8ZG3aj6TdLb5q0xFIuCqqVLBeYs0Qwar4V16zmxXagaGA7fz8A/9+MGduLBLTLcJxmbPCRT4lLOSeo/vsmDT5b+2pARYGx1g61yZbOzE7ze39/S7D+jRIqoZ2nRJ9G1TTjfnGCYZtN6/X5UmnH7JwTfH60LYcreeVhsDtpd8RLw0cOesH8v6C7JQGGjQFjOTOyrlYWVkra6wGLnxs20n/LTqzCTLgZ1fEeg4XI96JpiE0DhAoIRl2XTYVpXsC+ZBH3Mg8ZvYHVaj/G0iA50NCQ2AOnsFOmINcP2zuO4Pl8NnfWCOyMry2Aj6mZhHUP3nMTYswGH4J6zy1Ft3sgtvvp4BSOvP4Fw4YSdt5ESBqUA7V20/WLgeU4Wb2kMPHsyqP8d+OVMYP2LQ353ql1XasO9wG7A2La/19PeWkOxOQ4+WYsqdLIoQWVTZhlgzVlDRR6ZM7RtSHLjtLdfZnSHBxMIKkLvaJp7LvrwokjdgEat3mimawzBVUnVoyVdR/mCSPjvJOClTtM1qI7cqUrKV6xItwex5mKHd5YdMLbQIZFn5nnBgJ++gsowiiG5MIDaehrfyVdKn5wlkN+vfCEOOuHYVDNR3nyn6Zvko7/3vA7YtT4LfjTLifE+YkUr3xMDwl772qdbfKH6TGNI/Ju8OTGcdbuAYJlLefy3nrWjicmvjnUOOWztjF6PPpRJQ5HJb/mC20nfCbVJNXDQZWrr54J2HODKi5qa/8TmcOYa7mg3JhbOUvuoJGEVOdng0ltfFtcvWGGvFiUcf3SDfeIXvjTydwka0McWmo8tBx8sGhOS4c0phbkZoXm/NSXPrOiIPeS7OCs7Zd/D0Ul62bPzv7MZcuQsms+pnBRc9lEzI3Iq3iDyzddJw8iYx1RZ3WSNnE3OYjbzq0+HmdB1FW0J8OmyvtHv12OS/JySzgZtwIZjvdJuGYiO1LKrUF2tBIGbxrNNayG3vymtLa15UKXvIbyFNgbdNj9nm/ou1TJ7495UKVqjjQE0PgKIjkFh6knmefMUOa50pz6Oqu+rsDwtq4DCsJ5tOi8kWDBmyGIGqmo2j4iXRXajs9NO9Vvrea3fwv+0c5/1vll/5GT1bxWqUUtmKjCe/ehK6SmXWd7yw4EJzZjscQa6qYCGucgi06QGof3oHv7U3O9j+z/yXK3t4fFezbtgOYrCALJtmIjwYCp0xbi7pTpnjvr1VDL1XbjtjZHla/sIiArYu7E/XnOLE1eYbFonOp3GjYRdVquAw3Aba8VxE4MR4+TXpQCaPH16lFeR/6a0MjdMLTWCbQV8ObCtCfDyyw4lVyn/QJ+xwjo0esueP72Uqdj5GLmG8NspZfOXVIDIkGEIkHS5QkXdbNVx0fkycEVqe+1fZBaWLw53AKIQfR4vzU38nllUm6rr01ht7yQWAugXKpxTTFGxKkOhCMc0xoUb+mWuuRWIqULH4RLnf9AWinm1ZVy9vYwQFM4nMesd79DTrbuXhU3rBDwKb+7gFtf4j+JeD8gv0K8jhnRW013dBEWYAgdDuQgKUMhRY4VuL5bRv+eCpur2Iq7QpLy19gYxN34f9wNrKq5nBUeu0EIovq+czcLln86IUK0eSJVzaJ7YBLg6b0npZn6dm21aV6pNO7ckZL6OHccx7Jcmceh+RR8CtGDbA3eGKtDjW5lMtvY/b1a+nfDlXAd/rFTfvntN55ClYbu9IYqLm5OJbLUkIulsGW/jUJ+HpaUsL1j5FO2Q5ZQrp9DB1fH4DBeH1vGsIhEOiXqiuJ0nkZy0icp5QGx+qU5fHE1ipvWumPjYGaNpePQu9uogB4U9kyPzDlW2kuoa9ySKG5vD1sAwqaLSM0k1W6nC6nu3zFCl9WzOY8bJTU82PynofouEuVVb8qPhOHlmPZbHjoHnuiNhaG9BbjZu8/y6kx9ajB9N2QoR1UnuwsNzxcPN8xpiTbTtac1kpRkf4TdUV3vwJ5OQwsAHRz9o9E0hbO8nPbVRm5KgVj/TmOBiGf7EMXjr56Z6CJUk2vhWccgtXjmNPzefPU7NZKYJQbvOlz35+zmOVsKUlYdXq0FpwboiMvKDEfGUuy7Q18TRbZv6NGbOCtQzK95GcyeKW7f2bOLWYSBZMnGB+EipmI1jTEaif+TP2yKrJBAAm4Ck4L9m8LcgKOfCHARuK8LOwYonOQlv0Y/fog/yiUiyRVl9l8V11NGakw+sLasaIq+yDqxtqFmVhDTk4SuDO167dQYl/2/zQlqZ96VMkslDKWhn82srEUS4LP7Bmwwns9Yaje7GGrb/E4ke5HZWESKuSzVIEu8V8WAji1EjqWhojkrvOkIQuteM2weosoiJvZJpvFDhnmMhCp4oDAGCJD0p6uSSoCU1IXQlnKTJbEeosGPFrUSvwNYDsOVkcdIDx17yrMJU3cyHpWof006Z1XcSdZfVkt40ffOzNYAxS55afy4B5hoi1mOL9npN90wgBNc0JGQY9Cs+oEPZtU+EqRkp3QRilSg0Uge7PGw/le6tNNMl9vLfXRwtLMm+/+J+h9lV4O2E59nufIxm6mTEtOm5McmN13KWsz62sz0bpH5bgazQLzgwKcjwZ5+14VPZMToCvZ0tjAk0kM6CQ/HGoFhDRYL+L5ammxzr5hj32DeN7GUMERKr6pBfEFlStJ7wz69ZPmXaZ2Ss/BsrzV6jiClKofG785CxfsUSl0YDJiVB+VMrUD7aipelSjgGFP0PxKpC66Ju9sKu8wreoFOyeMPKr6OubkXrtJ6hdje9ZN7ZVD7Il5JaZKP/pPRzoXTNVtVgc+ipoK7rhhxYx8k5nJ+u929Iz31MnzE9bDRRDlw7EgywEcdTXT4/iTQD+iPIra7aqTIiPxAm8VU4BEF4uZW65MvgbizWdEI71cRYjj/kKelOs2jzswefNZRYFQRnjJeBm2t42Zvt0Ype58y422ceCbAnFpVu2bniZXW/BgJGa5xczkR5Hbb6bs5WcyaVuAXg60502ZGepMGlnahzEkwtEvSnr/bA6c7JsnLPwg/mRWfXax5aD9dk86CJdaDU4EfYHzw98RrUk6Ze6eaCm6agBIoh2KnooEAp3mnGvaFcAybMZvtBcx1ZZTAtHAel5EktBYUhRcPox4Sk5bleSV1IuDHWcqxWv6WQLX9G4GSKqp+hce3U3B49jipVacdqDmw2irc4R3hGwLjH6eeDSwnA83JgxlnlAWZ5oxkbxtJixyBv5t/QjLlvUSJ8RKnUMA5PnRZxirQ8VeSpKkxaBftmnS+yXdtyA/0Fyc/8XpNVF55Xr55Ae1NUV/YZt2Cc7syyxG6D3BKeZhry0r49NZSXUMTtbjLZ6U71YPtUtpIlxLMYhh9quv5T+X1Wka+GWCxhRI1wB40+1a/1l/Ubnn738w0gUuWklQ3b9uP/Gt0dx6tS5kPntHorSi7apU3Ln8KztrYulDOo5Jhl+YrCQ7xav7C1FMsyebku1SzvMee3ePLU08D0GZoRuRk3UqrdNbe8fZPettvNqfohdNc6XykJrIexQSDNpPNFuOy9Wf+imkBoB/8vV+uJyJ7VSEgB2171RFtpee3NGpWiiXjxLZ85Yt71iYT1dwjrIVqof0yQRoPCRwCKsgswoBOfL8cRcXJ3uisp5GipbszDA/nHj8h6R9T3/yqyiCDAU5vHSYB6qzE9Sf1oCCBXUZzXhXACQwOPqRhtkYXGIWcuUq2pi/hnlovtZSIH30gg9ckNEuTmp9WIuEmQi5jhaVKeNYPQBRcBllVFhoaVDnyZSWtPfQ7ARABatYY5V2LZjQLGlYun/PIrphS3inI4sPI5xPwn43L/wINliHnaAUAEhXisBEoj1IGitjEYMzFcb5FqeYEWJytfAlC4It6Sp+XOJhAiBmtFD4ZINf7EO3sFt8otbcaGlf9vGvONaKbhma/nO3d2XKa8hi6P5mVJnPUrF1i5lcX4LeSPjbazfv3Z8Bz/Z4bBbytlOPXLzuli1XH6DjErTsl/KQct5g0ph4b03OoEi3vkstdHji2ogAaLO1bQ/RKLwSM16FqC7Vu4yMh89vJD8sygUE+dKnnJKI8GsUa9Qb7jz2B0jG/7eKhGF77jUt3U4cRKybXc/vwrcjVNsJ955oyQysWZ1yA3S8vBeSe5uj6KbTP9Qp9BN5vI1J7UrNA58x0jauZXoyilCVsHxAR0JlCC6sOcFlFwnyUW3H+M0q74QJ6/BPm+6iyu94lH4Hvvd/IObNVP0FnHqkBhkTqqMi6XjEZ2bA8JQ4+jrAa4/WwIuiRKzwbs0dVFIPDn2rlNPAhTYmojqQ64q3BeSzZQ6jUUBhSo3xK16QbzJPWW6kqCWRyLyz/SeQiFzRGdBTx96CRPVhdkA1api6NU6Iu81FgC6VhQCPjqdnTRpIRbzl1XaNf6DrTGcgXp9x6CI5HZZbXsZVLrq1onrVsdJmlqjLaXhgy6RLK/rhmubEa4vMsF/ka4tkchbDwFAT4tyQ6Hv0JN3vFf2hHxzJLGmdoxiPAsPMdxUPmrosZdYyJhhYdQJzPVnEXK+Q/0Y5IkJ+PhH2fmPZ5NnXFBYZ6aem1jU80dFOpExM9pWT14Blh1fHBDYy7aDfzfR8gPQQ/Fk9lLOzxLslQcwGoxjaI9MXRrQu+T303xg/LuTYNT1Ln4+2RAVZxgyf5SSGxQO1oo6TgbFlpzPhz54W2VhMv8uBOsy7vq2/OY+h5x1ZYqr1fJMeY7vzBppXILjQOZ5FAfBYsM/foOXkmChRtLsTev+vBrlTmbwm+NYZc6cB/ARWx/WFqd80fRF77k/1RaNRwGmgL29lnJWjsNerU8bSYOOiXjsP2owiPTkhZVybsAQiDhs8IWrWVPmgEd1AMvQeEpL/Ou9G0GRzoiN5SByAoOp2ZPMmInOt+wGrF/4kMDIaiTKzBisKefriJiG9Q+6QUBMPqD2HkDl4CwnllzfJ0MlJd3A/bq+pNBDR9jrx1ZzOU+XElmD7xsh6nompzgw05mWIsxDxOpnEppRVEt10V1qPcyIFiinBT2YGTEHjZixrU36R7xuFYvpiUAQCWETLbo/RC9erXmgCWWhzCZLwcCyBQgDpT9XIOxgvWKi0WeoKmQd6ySZ+lPFgPKggWWZBlkzBiItYg0vql1lWw7zDOyGwOvmBm0L/o1skQQ2gGMIin1wUeMC8F34CLZ2a9pYNV5AdcfIxusKjHLyXIDFWq02E5CClVzabyxYt9vLuoLKSs9mEyhoMw/VpaBQed8KD6k1a5wP0o69dGrQkvWwTs4N8kpQ1C00eYJkHVS/6XNUI7WEjOJemXN4XfzKPQ9RH5UqnTbvkUtfWfvv3ppf3LT5BKbzXA46hg3slHHloZ86oG1Swzwk+ynfuK/sm8Vj+wQnXcjVov00938U4L6vK/7rVUA8QxmCnCAFFA8okMYXrYU8JXiNXarMmSWu0XJDPj/9E5MDEiayyXpTg1SykSrhgRrvOCxkj7aLE8yPITz3xENphUE9zjfzNz2ktRAhsGsdDrS4E4fB/O5xKwWuw1ictXYqLJkfLLFutGB2qW336/XqTaCFx0PmKxcQVmpvDqwj1SQ04d5Jfqq2wuIOvQ0AmGaof26M35zccQv02/PyIXb5DkA9xlrFouuF3xT3mIDLHaSNWLVPkXEM7noAdWw0ZjpEuqnDg7Vb3EqqykrkfP27AoqWEcvDgls5iaJ+uKvDCpT+HwPMFYfy5YoG1LT0qk6f6y7Bxj8FuXgSDec7OaakRMJgQ8FXxuR0QkbbFXzI5fiBap3FJu6VvgAGYnnmAGTdxX/4XjAIpZ3/kOFNKe1xJU7vDmxLBG7leUo8Obn1B9B0WyoY43EPFxqr+mIzQgMdYtEi52nC2zqey8W++wWA7zdbDL2x+2cGoNksum748FmeK4cxXtH7vWAk8LSbiXqECAkNqZqWl4JQjrO0BLawD2o2Tx/d0CJjrR4cP1rQmvpuFjl72FGo55zD0U9D9L8eVuzu8Sv940bE8cb+CoATkIGyFh7y74c704VVgH6GfxDVh8atoBL2OeMnaMe+rSImobuJm1NiLiN2m2x5lZMK23g9JgeCeoYcU2SclQqixrH+94ywt+Vj//41sd8LGFU49BiGUR0JI+fF1dxp8Vwe0bcch2d6rY1WbMx4A8Ou1Yvea9XkhXw3F1eyszTSpnu8nGsToKTYU8O61uZuRpSJZKMshPoeWFNmoz3VFPPnM2ZNZkSiKXDc3y7v5a3LhcQ6ro0GN7VpOQk8I7lUkerem6UWWb23oCljYoTvvWcqgQgH/z0NPTEWvA3ZWYcD5T4BCsSFAjVPKa7QE0gY7XbV+KVrOAAUOVn9AcUhhgDzrqGMxBJ2qNuPp9J7De+Cs4ZRzPVXVHvlhYt/p+iw6Wrlm8MERt4AH8a2CBll6dnQLuDW1a9Mhm2rVBNOtAmm2bil6tVqFwppIJcAhJzkPkeiEbQZrEAbY57kAfpBRHYdpKJr+VMiwskXuGD8pNW7VBDWZpPyYKmaP5cnlCV+BN64Or9QWu/+NUF4jU8GN/LYx9t9yGbNNh6vFfNYq8BjHJFgtWHpuzlrS2allVPU1Ptj0k/Ik0h210o9uEcqKVzFOvFiocywwI8DlNTegXLl25tiFZsnVN/x2GHftjBU2Or/OxsoNTqKB+YRwIVA9ENV8Y+sEzbKOH5jkqaxXlWGeOlPNcjRwI5u6xiPXxgiFNUTqXJH1XKocUsHoAIIKpoHIaRpuAwwSR7zyaQ1lJUowX6GM2GmgXmLnnPck4+wq9k6Tik69cok9Zp9WGj4ZQH7/3XvEBOyZvHW1XsmxwZKQPvwoZhrOCaw7g7Frh8yCkxT8YXpAPwv9aWFnA6YCACIraWj3EmnSpufZmPrkrrxS8/HHleGCz9bgVjMXqhj6XYxdMpBtMTzQ22STPWm4BanWZc8Pu72LLPo63ejp0OL1Xb/Q9wxJzQdNnQ1RgkkAhROC1ovktCPfz/kWdTGbjtj3yfx7lVa96yde33vYpvfZfSf5V1UPDT1wO09awGTR9hTNR6Qy2ySGQIdtwRjFAyuTqDNtnYWmrEVnCC1leRGknaqFXjUuXkulA6p7rD+Z/UTM5DVnNbt/CFEnbhHX/y/yxe0A1TaPqErig0+eSQsuJVfXitehJ3tmXRaWzAQNnXTW7Rz/OCbIwJBrPZloKQQeCm8hPiE9wauBFfAGOlfHjgkFMvA1MXfiinBtio6OXgNrIm2+sj1QUyyNjB7adRwDWaUir+Ze9SrnHDJLs5beQqa3D8zGbN9CQ4Ph+vp//L6mhDfzuLMV2+ylZXzRiVQaPgNE6bYPem28TKJ5x6yylgQme9+nl3E9mkCUpYy1dKB8IJycI4eig3ZA6QEFf41NjBX1XOJ2QEeY4SeKmsQAD4qPrmFVj4RZTDzgTQgOBbbEUAE+a0vhfh7vOgp0iZYGxuoqQD8thlslIKDVEOZgayGhFp7VNmN8zWLMNoUnx5Vf40bxKmpRPNQFzbNfJERQLgm/i8W79vwoKpZSUB3M/OMalcfGV9+w9WrUfFkGFL2ZFcyzdS02YMAigjNUqqvMGcKshQ/iKhOCWE4BnDZACbmy9wW+6XRauxz4c3/49oEvmjQax8g+beUi0rJfSjaWz53s/FFuV+02wqnWwyzx2WmhZG6ss1Vyb6pW3msvc4mHj6HByUtZaDsUnv77K0DnsLih0+t9BLtYU8g/M7x74w+7+DhzcE5xQYXaqdo2Dhe6aboFwq5RN3f910klhxrthVMdzQNUF8emg7RNwVb5VoRoGbU1UDLVRsRy7BOhtUHLUwHSdxf+DsWws0wI2iPYizg3xLuW/lovY7ztwp9kJpsC+wbJGkGBqCq9lE+g1/Z4el2Uc/U7S9xKEWDeV88wz47WtWWkp/+W/OHd8enI6KvJi8zPn46dyDYMomtRdoUQ4rirR8UCet52Zgx08T4HZZWt9f/v4kUvj3V8x/HlhVfqWZZocdqK1mKOhp0p2zl8l0pgTDCTmssP4KHitGKcVlM+nZN7Ap5bDyjM79ystzTGpOKUAyj/2kIop2HszdtuVZ7ov/hXycCUNSTBar2dCowpS13I/sy9pngUFX1TT7Q+SABkI7/nPwCMu6dg3Vi2RaxwfhWqIUF/GGdcXlQoFGrvJZITqHmWiwFvmKDSpZ984xUaoZNnX4wPW9hHAcDCCmUYJbeYmnUoBwAtgbF821XemHxBWsxaqXEvQE2UOsBNgF8DbYWwiyJDsLjZW6RLiw9PvfjN6A2EbXz1BrTlNMVFOF6rSME6c3p5bi+RdkMqSBTwmCTUFXqwywf3cgl0igPiuQMGXpNSetj0ZASMSkWCoKIFCRiGWzx8NZlFAF1aBrgiK07nEuHUGxoJULo5r0iLzgQKEMcL1PkqBSQU6WxhCJ+Bqe2Y5dMHYETHdWfTickkGIz9aWW3Nn76oOawkNylh0aNKZNx6lJdnkvJ6XPk78bwa1yYgmrgHtQslBjDr2Hj3JiInPqULxzmR6DzCL9siH8uc/R5XCD5XCpZ+ceol8KDdMQbgvjF+M4fLXLecjC+18mhQ3Wr2bagfXn2YPcLjl559X3L48cdOzECUUsa0ANU65VyJ7cAIfDCkAbFaZ6opZOfLFTNAoYV41VJ0Vdscu1gWvA/MDtRQOQ7W1DwP17qT8XI9j/KWQFRGRHuhObEhZ6oKO8u69zLeO+AJoyym/dNPGYeq8jcrn1Gj/9AjqXsmIm51y0z5hynhlG7ubf2Uhyw4YEJZ0zKFD6rRduRYikr6K+tw5AP1wYTSZADkdO3QnpWyEh4UB16h7FI6tWMPr/CKvYn4aHcnHN7tJITyFVwYPyWoWghyZq+y4nJO/Nm2equD7SaVp2JJ3FVfd0+97+QQ4P4EW0QPmNO5NasR9f5fY1aRXdrPkB2HBwWjATRg9zOZLeC6KchvYNZU70WK9MkOsY0bxzE+W5t7OxgDI5ok9pmyFJ7U/OMbnq69HDivaGnitkqTK0g5O24jHa0XdbRCHxic4ZsGFQRqyJaO9Mm+GCjOOY38nS9FnyWirAFeqTsR7q4RZNBVAkHxjVBdBv9IadvzNstEzv7bQ/msofH3uwh0vtf2PIMExooqphJCIoDFXoLEQAK6EQWT2UPfmcPPBapaaJJD0vbdby+ubjnEsU4kLc5hPM0TikRaCwmalNApug18rh+PYwyY6yBuOm1s5wL0ZTZUpxkQGMnQq2GhFRNBXHI82LYlIpvMtNH/2/hQ6yfofKx7sMPZIh/dk/CwUvdAnrM9dQAWvjQDXHCF75GOEPUvRgszwkdQp1AWEAHB1bVw0rmkPGsQSS6vHyuILBLg34lr+hSLNDQbXfr1SzU22XFAGkWkZYjqld5NDO00boU4Y18wCFZkai6xJN0OF34AgO6eY+ot44Wa+CJ0ENZ98bCanbwpWnzXaz67KY+4txgfBi2XbYi1VRd0rVEJN0PJA4WdP7G9xT1SxRp27XT2n18THYckdV4TJKd3I25V514Z9Wy8hBAPf+X/UXCQtBs59bzKzkGSA2EbPsh/gCzRVOYWUSOE7gRjFu1KlR+c18m4ygkjD1sLoGupy2xtBIgXb4ys8JRXCSxWkI9LEBWxy6er6Z/x5k1LGrVOtCZki07QIGc9MtSxX4TJlKBwgLusWHdQEnVH9RaTvy9fNNjE6/pp4hFaEDFcJUbFJF3emrmE2Ua6rTwERPjKK5GwKysXsDFxsiVoWyDaeQhQBI5fTOHmvl9IRp+KGAxtjZINRRstbbWjPIhZ1fh32HSZYpeeo+GyatZvqkQmm46YcY/V473BukhNFE6Rq6IJy44dzojCHENi/myadkVkTrdyqiBCcGClVsADKDP24szqsGpLEC+rmHT1n5ayRwZTVwVS0R8EjmO26hyDhwskZwXuRklZOzn7++FuqSm16H9By+RMbr8Mv8GzmeafANGbEDhJ9aLjHH4rLLtVsJKDFJAjjHFMOR0c6fe8/ZPrNOLiKuKGkLvcPXcLyNUpD/J+zgdlwI98z5bURxMwAlswdx1yQ2rWR4wzNNUdzyAVFjJAP92P1Mq7PZ7lgZP+89H8tWcyw53FqrAGN/qcIbshWa6kCS/h12Gnyi2792T0YJeN5akuDs5DPcZ0PB6YuiLuuh6gYOJp2AYdBcSa+cJCRhdDMhdkeGjq5aG/li3MAR9TZLSrtW6ExIupglSK0Q/tUKTpdmzSjpcs6Z/6Ha5IzBBQwtKtQXBTKIbPpjPnRoZjsTDJ2S9kg44ww45m2Tg/mtpV3khStjMzZUrA0Bz1pbSi7+HYuRBSy8QQOjAhIBQYIAe/uvLBaHwKPTr62U4fY1Zp6EYOfy26eb1aKg3N84sQYAoPQ8naqnX4AscZXyt5kohe9slnJnNIARxowcOKFTPtEJ+D1zJfdlCZjHwtgLIZaDWIXN7mF8DHOfml0DHebw9vZcfqdvod/mjbcRUrdbDCkpIioElNeku1YWSASLlwPoEbuEbVie0gtAVN8F4L1tPAd43LnZQRMPyX5/veQnBBo4B3EIZ3RgXy3LS/zv3l2v6aosXwewRGeRH2lipEPuLz4TBAIV1fqzwSOeyDh9uBl3QOnqL0PAJHHAhiel7G4ZUKimQnbK1cwlfxWgC856r4ZHBBs+A3kugajpjWjr17F4iE/XC1HrZEFDbfR5HodMDykcAErbgVERVMuXArbHdfqkMHr+DwWTjq6W7yrWxEvvyc9oBTLVqpo5gU5494hxnrUum2jlZDu5nhx2KXY3LJjXNNaPHZJSS1epQnGGsEkZJH2TGAXPMiWMMEFXIxd+/ST4rASY3hZXnyxS1us2+z5N+QXXEwxHXFV6u7LwLkHLR+yvE0BpA0CGxunMPUu7MUynvqZHCsxjZFCKioJSZhKmKEYJSdN7qx2j/Su2P+IAZpOR+/In9nnnTXFftmA4yFgUegR0Dz1/VxiuZoeRe4z24E1RxyUxpnOUHyNjKZDoARknm+jgduoZP9jev8bRi0jG+zXmZGn75yothvNERbTQ4kuKdJdqiqfyy/XRU00FPOrZnTap2oJ9VMAv5WrEZlSjWeHstlXzi9bzM94Uz/VbU8kwJ/LUOuJn0Di88mhQApV2C5oBold3kxhMbfZ+T9aaP8rhhj/6gXmGg4fDxZJ2HAj4Tu4fKH+ZVi+di56kFDKBVyUedMGp+vjOVDAJ5TBTaGZTLPlUf3f4pAUKDyIFrE503cVapFEYA5MVd9BEUyKIM0uQ9dvlUNx9xd4ZA+F3Kt3BUfmTeMBHMvSFb8CyrpeODYIGk/rqktKIwS+RCDXaBrOLwKF2cgiO4b/2aVPRpcPffrSe0BFG/Spd7xsLKRVvFHfQKfw2mR4ufmPPndKW+0MXtjZedNFrsh0GmeZHYuRbbhxnVIgeP8tDTQfl8VyysZt+mTiOX0Squ5zSO3xhAVY2M+ZmOchdwlPq2QWTkeEzA0zwhY/tB+Rqk08I8kLCtIdcIr2YgofAGHBgGc97zmA0FiifA9PGpIk4iEa6r1s1MbC5zKwINIHiyfaNf+X+EwEGjQfDobsHl1VFbwXD7ldWwk4c8rS2SC4OcQDqW44gIa4epN+0uuKbjA58xT3tjYFWh2sa4Rj7BKAPonjt7tmhJI7my8IYkfSYqYxAr/CkMvDaBde6fQUOKTi+TJpNRc5kbAQJgtK6kSyjftDqZtTH3LpAuXES72V4sv+XwR8RUE159bUt7zRqxxuo2XkDhjh+tt/m02Ia4I5lh2OTp+dsuTOpUXtLm8fQ/hqO3P1oWW5vlpfkYNszb3qyz1/uJwCr+a13s05/vio8bOF+TWJZlBYpmCmLO6JML+L6s+O3l1dMB+vKWiyaPIWt2dxHpxfKWZoiJU4Czbkp0omq9m6FUPaHsWki392gxUkWsdVYNxTXHLM18Wr++DUwuV+ETzibJ3uL9m/dWpQz1wavXqRJqLAOZd6H8DZUUSp06RzlKao4FUNL+5DJvs/mWmR95GnfYMniZ0gyw1ZWth+8YL1IDLar+uTi7YMcy5QQkxgu4A1v+GPoOSZtyy4VcDELT8+ZhWW/ZZa1M+FMFnqAYmuraFmvGEHPpq3rssdrGZ/PC+RjLccjgUjvWghmBZN4tl253qXu+b6MEL/1SQQGzJt7VIU/+g0KYuBSRS6pWYl9lqwRGaMk8r9K3kK1+OIyT/LQiUZdSlDzx8horeAtbRiriEz13fHvUYB+JvvC6Q6RZ/zPoQPdwpdF461bPnNwSQ4fK4ZUoKBPqQMzqpvrxUW5trdwHOm6oN82TjGsvCDysqMh76aMSIbTu9nyUfx/CKTagt0fbczORobo6Dz5v27vb+hhi579XU6xEO2QTJJthQ+0HRxR6NqcFjHh0u/VCtiuu5F56k2dAbAIPo8v5Ky/0F9GLl5vOrHBwMA7LUcp0VNMg52waFvQp+hEtuvEl2swKPZlUeK8tB4nt+JL4HmVyvnN8huJObDPT810KOBzw8HaMnceV/geHVCgGa5A4GGSr1060dd+IkmOAs/nifxhng8y8uELJGQO9SKStijAqzDFYfxRzcJpL7YgmbCTiwrTOto/KRmmbefSb+UdUW69DsSAZn91WqTsYOOlYdimRDDBEoXAFNMWd0YYRkmZKldOVAqUMbL6zm5GFFh1PmfHUHErUjRsFRBfpGlkZjUsYdCekNR6IlJH+dMrN+G0CyNNqfKPRk5FxmPkUSq0GPUuEL9ffGF3jmxVYRM4mjt8ZOVYHdLDmaEHUXbHi3qHSRAGsgj2ED018cM1jknB36IasHDFoxyGwt8dn6MFaJFDuShftJgOTeHoT42LQmETZq9qJ3FeE4F1zWdlVmFM2AbEsYFIh0xGi5cjxOdLguIgfLi0PBQ7+umgwLFW2vR0zpsM9UD7+lvGgjoX3j1u4nRSses2/b/I48P5bjP8a27zKd11dSynURfXBfQun8kNsCPrMtAnMtp6UKspem1g74my4fDhXozpl1W5wNXvfLNfmCaKV++4hAa4lhPRTbA6nC3DoUQBz34Lj1gDNcj8ADur/Ng/vPBEblWcADxlVtyXpurzM2h2wvtHvd+kCCa8NMhJhmUZ5Hf5Al26MIim38C87mnJwMsU2o+57arakNn2UXjCEPEbS4+njXoeRyqe1q4X7LfvE3OOo2qjG+X8+O14SVHlTtMx0aaKxcxJLTOFHJ/rx9wWl/52JayThiacBa8q0MLOOxDGtazXv8ObKKWGsXD2G7p17OX9kqDdRFVDQoyqZzgI55CjzV91/KbH6QYUDdxBDDcd/i2n81oBwHjsuZISCWfty75a24Aa4TA3Rn5UYicOJocqdg7Fb7XQRydwVczkwwP5XfsdiowNYWgfq9nbbDEq0f8Q709ZJX++8q0uUUEpCbFYE+qPzQEUPTNjzGOFQorzgwep7B6XUAiGSBdeoEx5eOcKHDMQ8GZs00rLO1HodhNXJ7q9y+9ewSUH30Rptlpx1D9JfY8EOOqlLIr7T7m5o77Kmmm2460mnLI1tfosbmPn38wszHR1lWSPVkMMM0i1MrWa3obpgEcuwSaJPs/P/f9RIC4TXK8RCNA0eVoBXJQhyytkyZGbkFWhPTIjv/O3+IKbM+sj4ieE13fEQeuJ7DuhElMWfv5q9CUkDtNztC4O/bHfTa0yJgxXMr40GIKnHssKxJxK14nNUtGHkWPX8DIPZWY0nFqfsz9nyZS554GzjbFj3O2Xyn0FE5iJvSQd3tSl5eNIeLOhdtq9OOoZbF2u+gl+XHkgdM+6WhW+fEM8hG0UQTUERTFqAWKefnFxtGv85fE3thlP7Ou9FoF6cC8KBlYGOQZU8BF9PVIGomj1nLUVR8pG1BgsZIRi2YTaP9VJpJUO6yTrml7mXxsx0CyA+yV0Uq9U0ldp367KbIGF9+DR5Vwbu+C94DOK1Bx0GWHkadxqty5rgtxw57704Mwt5dRQSG1BbLZMWo6Bp9Ql9R3/fybEkVBvXg7X5qGBJHkE6dBR0JYdeiW0ir2G9ix/DfWIui2Tnll/MhfMy7b6XD7OpRvcHJYyEwwp5IW+aRHOTjPMAG5+g8KptbLZJrWAUUhPValeUw9MO7Ijw+MrICO77mDFslN0VP7S6Kpz7jmmjFCgdszLtJLlTaEn+4Lrmt14iy1XHNb/LL0Nf0aLyy3mHGlfl2hAeMfjrchxinLt7m5b1HPzYsfvM31/6vT2PEdOiTzO7jFPjtlxmcNISeC9174kAazv9sExRwAMokVlWfYH5cWRx06TrMRvvvv6f2djwaA+8mtbcGdBOmrZgj/8tgBKQOR/x6JHeWX6CIXn23ChuZN+TRDK85WBYvskHLiruMP9zDakw8UIoORnRY2/wSqDiglGbYZ48tWBPJ4LYIZkOsnBCoX8u+i5K65gQcO9hnfdMbkRZHGDFASa65m8Gt1Y9qkgFtfbPXxCgih/2axwZfzuvralPcf4GFdNetupvhJF2iQi3KsbUaMl5G/wavXJT4S2/gOqPB5SaHMd+dV8uYOkHLJaWIARgeslzgcs4KHWfJ8Cuynr3DkyM0eZAUnuCRUTQjhZgDtEjyL0IqlEjAEGCE1U4XiMf7kZkF8ERRbCyakfRSLAAAofOMU3TUbg6BJnPiCRs93N29HfQT5AQd7dtmNzePFqDz0MWrH5M9WqlDDTAykqlKRUx2Rl/az7moPOpoMq/oxwWknEZRE3uwWzkzt9G34F8XjV7iEfTnZ1ElPxXY50cTJ1ku4DPUPJDNm9nq25iK9hB0U7TAGxgG8EjvplvGIgD9t9bnEeFapSZyT3bZ44bfX1MPNA3Vtp8BWDAOSmC/6PTYEGKntIY25igsLVHgdFNegzxllz59QdUK78HLREe2UhVwEesgB5ebjR8hx9zMCIRb4LD9vUptnv3dy6+RB/XgPhEeoZdtb3FYkPNWKpvaOFj0Fe+1GlV0H4/uZg+Gy+XyNnxOMn+/Hlr6xi1p8svo+O455qS0S2ouriQfyG8m1WnSXPa45EcQ5Hs2NLfwga458CPWN9ZQsL9xsSktCeMslb6K8Y7SaZS2kQBcJ2YRBjmZjdz9h1uXqqtk4mh2Tpn3x0sLFuO5eb2stI0aEvcPBswyPHDiLeGQeLFDIEimmmG4DqJa8SZMozn+GVuWwB169IEahJvRimmezxwmbQGkT+jeECl/K+GFa5t054eCpMHYbRhwL4Krh2yG1d74Qc5UTmswTsWjBaEI4HcS1uWEWisOoVajLkRZeVhtlUqKjB4cr8byEcamTsp3WYK9LPuZ0fCUWKSaGKrAPQxXA1FYcSyTyZKGAq5e+JhgP3Oq/2HDulBNLRLmI5eIgSV2l5L4JCLqADDvv1BOg20ycHTSAcoj6O3Xoalnv18DfBcuPtg7tCjvWjW3lKZieiHS0/aSPJmbofg8hCv0OhNtYkNyQwvR1TC2Eax8RPSN54cZeOQceRFo+VL9Ij6uxw5GUGPBGt8rKhsXcYF8VEJXYcpDORqhZbu8e/3/oWX2rfTfCHS1+xRbK5bMWdc3uRC5BuoI0/br7sZqV0G7pAPhhpghxZg5YXq4BmtWmcRqMUeY1+cC5mWPfqdiMsSjIrr1Ph4LxwZ1xY0k27GirG3I+5b3Oocy/SoAj/yMXvs7Pem/k407KbjJHMSo/SJYWy3HQcq2DbxMe/j7fIp0S2fsxw8IhjT6XfY9aDVyMfukIPK5QMMs2vUnru8lPRj92Xjw/2/vqZ9efk6oAOjboI64iSr3c9QCGUjBMJ4R0Tz6XV5Uq/WL1EIyUofwz9HSLBsUJewzsoJrJpRzbiNRNgA2Z0uocj2+Jzq0G9nFNi9FKo08HxDyAv3gEh/6P7iUU9QimE1bZPzyfBqRWnuL4pOOhCg3XNeOJQrnYQb+VrosDeEE3SoPe1dlOj71uW7q78AS76qwwIbaKWzrK583aiODHrTo9KCCxiYQNg2r15mx+eIsiDix7qcD9nr9StAqV3UQT6rDJO4+PZJArzrQXlIWyFDCCZ4JB7/b9Htk/kTiYtxXn3Oc+jwv4WCkDrZjM3B6Ktm16IAd3qFK+FdrSGDwGLdE+Td/h93XyrQ+x3bpL06O5udS+hv800Wn5ZmPFrQcMdIvrVnIlAljSiAaLurrxUTG+gBx1phPdSKuuKa7zKtPxnEZWtw3wKpSPfAhFEONaHDPKpUQ6PKdERp0AyE0hEXpT9NfGbrC4vAdaDEmoshR5xvg77NTQN8ozl6H0+c3ufiiNlX191CzVOBge4HNF1+1+/69cDxCTbi8+zKW6yEl4zBlSEprBvcNSjvFw9QKJX4ypD2vfFdf7DfJhxMvj4bDcWhIDMd8kLAGV6xqraEgUXk4hhOaAFjd3cUXX+vunaKMAo4rgM44tvmck5YGdAOBuRKC9zkUsI8eZ8UOvVY1s6VMfLPxlKCw/svtpDnfmCkCV43yZJuD6wD4D7LhDO4cMs5QrlbESs70LX6YtcLdhe2V2WlmJQ1aquOVmuVcc36FxUzgNs0lS62bKVWqIusTGZ/Z8GoPWvtXdtg9J+n5OBZhONQbzuaI3itfC6+CJ5058PO6iU5SEaYP5OVQM41AR2KuFRyYFofiCJYJJGw1olRKImvn/ZGq50yr2BSxkzuUX4SMahYcf+4qQHVoXlOKF+Iy49bsgPLyq7HyfVIisAgvJW3RJqesknZXdNZffj/CBMWZTt/6/7L1qR4TRlfoX6qllFgaOSV2oJNr5QtYmJZKyBCCmh45wSF9LSnX8bw98GovrsZCyVTQSVN2oYS/owfVm1OWYAGmrCFiPr0gtcfE/+OGCX5X2lfPF4oWow5x+NwIOQSd5SrdImbQaCMFo0ZzUADaLxfsM9x0t9pqdkn+Himh1Jy1ULe+ig74skO58NjPLrN1VawrsuKgPqRBE+gTd44B+R0Wfzq2ifcktGHs9Nl4BA/FOALQMXw+MjoF+NfDmpQ1Rl4/Jy+BiIuobW8mK6/g6YKPVo6mnjy96lGwJwjwGlv/VlAiuiznxwOYpj1VLhO9rBlMC66Dc1Q6lzbLYmW0kbGtk8o2u4U53r8AvLBT71UJZmE29VGOwoVs+Iz2dqzDHLkgHOA/Wfmpp5EmK5DnqqzGKjl+BuoveJ/1skoDzbtbh0oHCHmVwBvM4xCiiHDefQ7lZ8d5P2KDKgyWPf7uZRLaGcvIXVz1O+L7JikKYASOZw9ih99Q/hEGMQy6kTAo8r5+sP1xqyC+h/w1fUgB8w/UMxyxz97VGvEvgpsJmNMsNm2dXLgLBvC4Iy/X30Y8OGuBzjqkT7pU4kAfRrXfZmhoxzwmrfL7QzAymKYcQa1cfuN4aDuj3K/+1izzAB5sMwhkaKKPx9YWopTL9yrPvKzhDogWUHq6YeJK3WT+5oz0yjHArvqt4Iir0T1+qy8pTLkuDmfS+I9INTDwMfvE52x5fXHq9uxPrSUpL98A6CbJUSEXo1Pn+AGH3PSmBF6P95i1bsfEevjsSJViBtKs/JHM5+0802sNMAthQXAl3My28wvMQwL3dTTIdanJliM0PrYiSzqUSlJWYjEmzvYjBsQp7ErnAk5+eKtIMbbS6aAMex8DMEGCmm4RaJvEQwePxpVv0O2vvAC49kzf20dLiuDfhyLH02yp2Nwa0gmJ8dsInFx2GlyM93Iq7M5FjeqzbzdwDURQQ3/rk3yaVh6KC1CrWYoOixpwG3Ogm5OmQmagNa+yz7wwoLsU6v/k/LoYfi5ph2KA7mEx6ORnJhgETjQ1E4OdYLDTnLypY2Sc4eh/2/O7dTWQ+nr6MLsheNe7Zcnlrs/OMJJ78/Vc2SIwI/8AvxLK9z4prOQ2++N6uw2A04Rs+6ZZzp+Q2lpG2GZLQnriN0TFkz3Gyxshp6h2YxHtpP59tvdQzP7rc8gIK6pCp3QBB0cnBS2KaSa0ZJSLzRm23cnvLVOhBHAEBIH4x+ymY0ihTx1pfkqeskF64UpNqBMSxHe6lLWFOqj7XDZdNpKiKSQSDJF4QJZj+PVVOEEqLAKoKG6tmb8dXdToLvqPDuLGs+XMduRShqPOnO3O/AuUj71lVqnCsex5310P+cLExwsXzvqrHnyD+YPhX4t6zofVDGuzO1km0iEJoaht4rHR1R1QSdez5fa98P4oP0RtMDqxjkTloe0r1pa4Pt4vd6VRTg+POx0twb4Q0dwMRDHSJcktDOYYjXwJNtt8jSg1CYmlGOo40zSKA4UAbdZhNpM7Jq/XqmhpFukyeXHya8RJfKehlPhTNAqdFTvBayTJI7NnHDj6IN/Mybisi31UOzNj7Y2h6YB0PdFlMFXKC4TbJArjba+jz3c+ZRQ0ZFoIPBJgOA5eseKL/V58UjUVOLTw17n4y83X+q0lb/fa3y8iPXQmmtzH0VPuLqZEcu6khJMHix30Smva29TJiZ1Fi6M3AIAK5mNbQtvDmm/7On+fuF8ds7xV3ky2LS75+5OcKoKGB/uF8D7dFi0S9MMdWfSVXDY7gGL/3MnSAGV/qc5XVZHKOAuLn3St4kiVLfbMEqrZgxf6wtUvZbS5DlP2+D2cjh1flkatMQoAf7xMxcswSDtdYr2xOZOUEEqzwZ6H1psA+OGK0t3vhi5nE0pTfxcSTNPUeE2iUBP4CWPzp3+MopstfqBB9daYXFLBnmCLWeGqdJJxWnb4xhGpb0ljQ0m5G8I5Ll6J8ZNL/1Xnd45ZK07v34sos2KCYywhjlMx7jDGkMWMbR9qcxBhxDxmLnRBZq0PGQAYvyUKLNKJ5rxgRuFliLnMEW48qwZNcNIfD/omh0bqclNY6cWNVrnK8SBkwBZZlwo+X4RJFinYL1BhH0KNYLBqlMMvoI9DCnjzB7J7HiJ+uOSRSYz/K676+IEq7OZ1N3ZGLTmJMOfS7gYZaETPwlxd7cOhmYKPyMJFlzxLs4jHxkVZ4YJgp3H/iLyfjIQdAMV/EZ8wiorSNUJwYRJFjIKArH3AvEd3jsV6WdWqy1bqOHk9Bse5xUtjQPbwi/WmtGE/d6bLWCKCQEJ/+sFEYL5zpuFOQF3xYD11mYdN9wEupiP7PGxp2URckMsh4dDoIsXDpnfw7IMlk3lBhE88rdJvXOx+5qW85BN390rQKxRyCDh9KO2SeQGMwBRAezhP3z5aPx4Dwb0AbVYWtmUiPMAJFRNLnH+ujr+c8VblcaaIgju/zo4fbBKGhVIZ+aBATaol1fhXqeEpBIZnE3q9SkG54jD3V6x8ml0LzYKn0bZCYkWRkxd/K8i40SpUpo9Pw94/9a6YYpxuTdSdA+4wC6Rakk1DT6zsHRkb7zsOmZviA7VuUtZCtZRu1vPqm7Rw/y5411But5aoGi4w3salrCRkYmngvCbXHIV4euuYdlCoDEgil3Rbse+LdEZ9xkPqpRws50detE0ni9hXYMQB6krpmBUCf6s4iV7mWos+wYAU3e9zDwBrbSPJ79DiwPFLVZAoptd0n6vob7N3gV0F30aonslPfz9oIAGu/zZkMh+fbIkbveErTGzvaXAdLrtPWDh5AMgV5Fn4AhV51CZKFPXAN81jFhPW0ckFMBjDlZbn+lMa46E/LWaDPpWgn0NQZ56dAm9oqP6Og8xCZ5Qaf9ns1MqizRG9MTgFEj95gIQgVeh5cNI6oq6a4f2B7fUvI3zwT2yUA5ii/eRFmWds4SCBhCCsH7s39GANfnZamCiZ5ML2DNShjKDCyvahXi2y36OGhaWl+0a0HD2YrUhn8SJMkzO1n1karMl/DXpueIT7YKiUu0uAYY6KLL3grNFg7fdhcNZfeYzLJ+U/0kJKgxyA2I8FugmK0UIxsHup4f5xxrUiXxJNVqFvcJaGlVpNeOL9XaSfRMMGQAL6pUU59wKqF+4xAu7dQE649N4/Bj0KCas1JiKj4KgMXyV13bAx1pAdUaXnoNi7lrG2Lr2kdnR2BTg1F0gWEGpCXX7jQWoq4oV7kgdeZkZyRo9Boq7Mwu/LPhdB/iODF9roqen1L08BKjk7qvtOwJU2o2I2C2AIti8ODpkaiAD/l0J6qkPEvRMtD8k3vzY4GAD8HMMjasCPWqdncYgPuxFSE3fABLtXP+OBWwnvpBi9YZNujGLZG2siJpIp45DO9CnZsoBP9BQk9QV59CTc2m12+3HPQVn5v6cijkKk4rTG5CbtadwK2eED821MzLPE7eifCFS33+94HhR6NT5zdldOt+hN2Ro3gHMbku+T2JAXyUa/c/llUS7CuvgRPB1/U8rz4R74VLH0obA0A2BCmfgt/QHZPUa6YvDIherM4E4TGIUZvp/1M7zIsipdDL6yu/q+2DlNg1bqlK2puZXNpEd48C3Kr+Rem/JQBuiHvSpACY8A0K7iLfdrLRUdx5Ilg0hcOnSnc97+rJzjmCZbZnb7/XFJJsZJpd5S5OqWVLpDQeXFMLAUBl0ytpsML5cM3+rdY2PVpJxmny9xqZ9FBJvZYmkmPfAd1XxvdY3AsCaWwdAG7JMct3zrZe4tt5IbGznYLepDo/oYbbTU3BSVdqK6CFD1wk2qiYDFCaYCBDh7AGXCoiUaQNaBsN+qk+Fv4CC+3jjY6eUv9LNo3RsSgESEhJF+3Z/RBfFG0QoPo6KOoHPi7ka8PfgCp1Y1jzlIHXubB8hp1zjnMzMwjTJj78ZO/ZiyubgTy/hFWN5laxjAbNSmh+0nitAA0qDu0GtSUXi9ei0I7GISgjWS7WI89OZpRonHcaIYMVCDgAN6RJOt5kVtvM4of60gn7PNbCugfv7Tb8LBMMqjezRdg2Cw+UEKdTBtvC07SOIFes7HZtEE9mtack8V5hZTonVINiBs91+YlSuZCBNpULPYcZJOtZScJCAnYeerLnITDCnPl/pMK/CbYjyjn2E1XEwC1x/VClS33wxN2n0EoPWXO1eEuTJwiITg8X+eML+XrWAtMClJF543C4SImnR0iqr4jORD0M+pUAf7QSjz7X8bDlbn95cWgEDlDdNa3Nd1kM9pGTLDGtRvpm+JuN5igqR+HfNn0NJdLOyye1r7fhH/0VTkvLpzI/QBGE1IYuIA2aNXtioXqJyy5LRAnaOqcNURkqRXnXWIiv2KlxCOoQv8loo6eeg3jv5voa9m+P8raT1ij8HFgaMS4MpnYxy9UrsVZXvW5OzMEIOYdcTWENOQeAihmru9Cuy6L4b559nVHh4/G+x02xbI1N44/x90BsEr6E86dxOgdh5Mq62r8Sk7dxJkGqfzf7xNvcHGdax48knG8ZYlHljxMxVAGk3YYUeZzxlxSWtXi9UT0c6gJel9zRKDoa3D2CsgNbtfFaV9ZfmsqM9acpaqkONC1gwcyTGqxWgjRdr8Wp9bxHpoSqrwTrKHHTmlDDux68gjZbuYIPJ5AGausLtfE43A5pVUuwACdLP07hNO9VmT2wGg3CAYi1YUE1qi1ZYxuVGQVHpnyetYRdXtVcgGyj2oV6MA95bVAFxScqCmIo7KVRkGNZ13HG9EpVflQAbMoVsitzfwJgIPRXmY5qdEy1EmBAXfxZ9bvXzrU+j4yg02k8tOUnbW0IdrAo0RNveG62cU4FeI32Xj/pvAW/a97CNoPrp2tqLdcLscRVSBKZBrZ1vHvCs3BJonf1b2IMDzAgFlW9WFWeevT+CfaL/7cdHAVUcxk6JSE8gan1TtMquJpvmzvlT3+LIgx8shXufIKaoo15SirfZD3dH5AXXKydfZGlnNkZax87GHf7+uQd2vqzbRC48sRRlliCpYZQHzssqk5JXybg6rbJCYbDh7ecaNM5bmlfQru5ZYjaaJh231K7NGXxS5MAlpnzmQU0M1bB5rQc/pCD8tXDYKtCjZW6ytVrqjOGhOfOqaEnwld7UpnhUZN5w5mPXKKEvAM9rTNiXbaxfU/1wsnplY7I9gAB+sVpjLS0yrAjX+ETW6H0aC9bseyEU8ye/kbfePZe184OpZqsqSFSCWH3q9ojrH0pdnHue2vqYnpS0JaB5iWmI1Ls1tUjSgxDAfS1w6dQnCNkDmLzDfJtfEeP/wqTVPl0Qj3JDhbo5/EyOGANu2FEEynoieBow/pbSnnWnkHRgpn8kJPjNZK3ZfE9efd3AX+rn6JtZBMR6/iFRBVMazn9hgGiJDvpKr6skRcEqhr8l+XVn6DoSu/io2OX4IixdoqlqrJPP5JnsseHCcNk2NPquEY/dXwNMhOXoa9ub8SSgPimxh93PyGvce2BLbKfEwIEYzWvELXZ061o0u86sdo4EJFbRPjTWpJvlovaLWyGaoyTz8ftAVlNrpblIEZrPXdcb4s9GAYwEuMGAebjJBm1StHWDegtgNnMT42VXWQoOyDoz7kSj5/FdhRrCGQybDeLVN9/gBTiR+hf4+Dzs/rYEumt2ucuT5D8lZ7TkkPLS46T/bLANGBIdTXyxzTIixeLPe3VBMsmrFjDeqGNIKfUK2oVDys+rRN18QHgFyrglohIDsbFuz0FN4fb0sQef5qQIdCgShk2iUVce3Vs2fo5K8LjKeNL4+sEhArWKkIIGlUzYQ8pSZS/YXShctlvAM95sElJ7GXKRtFsI3PnB0JF76CeUauvnQsgywJHBGWp0/m+wqUV/ebx0Z5ViCEEWPVYX+qgvj4W3ICiIkkPSUm1/RheEIVZNSf6WRG8Vt+h3D0iVA0SrjyKyXe7a3HNEOSWJcaUatBUupvrWlC6OEmml8yQPYG33Q3bO1STWcBTTJqHbqJQ830C/m1jhf9x+1+b5fecvcIFA/5rulNXccSwf0pAGgCh0Zgg4YobBxFuSoSAkUbq/S4hdbu+znMvUSE4vJIDRGxO10LGk0qwC9b2zMyTmwoTEHJemh2Isx7QgDz2ZW6bSTmw91IGvcx5FD1h9bIgcpSt65p943IjkATJZJoMXZFHmaZ6sN3i/2o8wh8ORggRnX3sqO48+9eFqvqDyJlspauERjG0zxDGvhpUQzJxajFtmh+AvHu6reI2In1NBER3jJvXTnR9dgmIJrZHXZvS7DmookG33BOTesf68b+gzhNDUr87xNDJX/8mI5qErP9CfQGuuc14KkAwe42laRQYTcJnZOEOY+6GMWGINxdhmkworsE095Sr/e3LB/SopfTpC5ZWIsvYZ0lA5PmYSUCsdYv1IhInpRZn/bsGHMMQFY672nUKtKMLtL+YpxPN6escfazR7br24glcK1F3Op3POsOJaTBSoZKEQVmAbBsZaIL2ViKMyMwzKhrMzu1V2QSm9tEgAjGGeX/WasWw64+5NgCOzYKraY1rk01FDVNWnuFhNvYvY6Yt4OG0zg3hRqXroHaMILKqLhhvZe3uCulWn7mW8lzFRdhfqBAjhI3kPjnhTswXyl8B0Sx+uKz38IIo42Z/5Qr7eabWsK3Q8asbO7CPfBqvPpCbqUJXCcv2oHS78wYFJwRWcharn9STsXiacMX172lLLKhNfHRXjJj5ZUqqD9A5wnBj6kYklmBjPsKoRId4aCJOGPfADparXq+wzifzO+b4sVAWS5BQ3MnlOhLCxDEtq6ALhUZGeQmAN2+loVVehHJ3QaLPPUBnrxipnxR2JHC20csxLNDBVj8dpax5PtkbiJ8RuEV+/pn3zJwySiFBQ0D5V2qPE+3+vig682N4BTGQAJjaGIi6fJ2GVJPZbjCInjaZ4xlwpe0vMtJ0KpA+xUEgACadZvbTvxgILKa8Po+cd4jpIbePah7jnbEfYfEjlOVxlCm+tk+bf1cEpUPx19FJupzxrVidFlm00Hio4eb41dN9k2FOfRvVMVIqo3Ri34exL9xLdQ1K9DYV4M2keq8JMUEaFYwJh5jvp/TdosGAffUnHxtVc3NWCEeUZ3UFtP0URrMubSRNNKIarXOw+0kNP7Fu6hVWt7McwxOPH/XQPB5Cl4l2SW97F4mIILi/x8dGoTuOGYiF3NpyDFuh9Qtvw6feyw2NKG+CPPJj6LDrXptrXbDx0XPWF9mVbSoVM9ShX8GzSzRChQVLbsDGGz7Oqz19O2hEf9tQoso/loq52S3F6LDgCJr3OvjctIoXrCvsJKnaqkM3m2ZvlipzTl3yLOlCvXRSRW6ZmJe27yMqMo8SvRO9CuQUVKzw+nFsXhpCqY7yFNUBu56KtU22nwqWeursT5mSu0F+tc/05EJqehWY1WqlKfl7/SGm3EnRoMU47PK04zvzW4nK7ETt26ypy5E4PelBsUq3Q8Taz9N86p9U5ScqGXYHbVqruxKKIe/4PpRasWkemLXAo/fAxlbbXfunw+7Q2JCxRUpGXqKSohFQG6UmKDdSdwsAjrUcHW7dptATdN/gOBLJrvrW3DEMkHIJqPnrGgIcA3SwYLDkICA+AEqWhATIuY2eHptw518hLSVVXO+KXPWGj9IwZZJ9w65l8xAuDPNA5TTEnDaOgWg6CPhgb+ppx0l1Pi8ncqAooX+xJqXVoeg7i84X5R7UoyjRMilD0I2kuZaAkQtluTaPZCw0tNVTHUlxzNoP8G7nh5edaWCXiDZaI5F1w3Z9e5G1ZpiOY7KMF0vIIfd5X3ySgr3aN67693mycIJu9BMLFswJll2w3hcpWE6VFfiul/7K0KyjezHu6rCXLFie2GgHf0Yxd74ByAldLYMMz5GkUVQTYj7ddU+FYEb0KLbR8cDO4ISnNrNtABWsufurDJPWCudqRI9XsfodMzf/GwCSloRqrJDuC/2hXfrQQHfApcK/TLDcvQjkw12yIINkQ5+3qNGoAv8c1ZDqkduV2dHPMc/HC3Pe2mEy1wZaWjIF/gjyGJg2iUQnE9zGfgbxjXLELkR2o81QhmqRIFgwFIc62C5/iFNDPnK3Ygi1X+RB1KPFF9NtdLKiICnTIylQud9MzTC5hnSal/ESAFgbmaEgey3Gz1iyw/cQC8IEc6NzVZIDsocNOTMiswkFKyhZJe6BU8L0By388RPUom0QyVxdH8h1bgpODxYjq5NivPU6Y6NGlykuuZXfLLTVLLtwoVYZBNzOHUM52NjGUQlmnogIPuN8YlckIFLGwaE3CwolDvG3rBxU17j1KTvXpWrQU8PsPz2ElDekThli79kv85J+MDW0UnwAtVPCOHVwaRnJMaGwCV569HBR6ArfR1yfa+5tykvifefq2obGTjSBnRTwVh4gbjiS/8kF/+wfzyUHM3D9ueY3CENFXR5nQ+V19z3PyoatMPorOVZAc7BHBvYjxl7wIErQTkRzhowXew8Reg//jDIyCgxTH1M7dOFLTiIWNvzBO4TMvhJ34yBFO1gDD3JHgchIe4gcDbA9tSNXzZBy+G5wxzFmiAnxy37xCBcn+ZgUmt08UULWSHgQ1346HFZw7UlaovevihuLaAr+qHzPPAR6uxSNl1EXj3pke8BXi1Ttho7/dmoHlSo3XZ8K1AEioePDSGX4OWiSCtx0oG0DO5xvcufy5JBHMhEluWr9UgIR2QdW1/yi7N44WGrQyAvPQ5gsE4dbqXJup2VwaTO8S/EXf23/+XcUYQnlqLiVDbhGWEgPv+bb9d7XDXRQYaMkWzwhkziusNdVo7N7mGqQPY51R35/UgzwTVqrhdP9/TdpNxaVpcWC2UUQpaNGX2CjQN/yAclyC/yepJN3gWDG/FoRlHyA7qM0qZSfXk+iifydEEgJKuvIOVfxO+4RGDvxWHdnuy8rkmWWOXs9Wb3DJBVVlzCvXGOQdCHEb8y5VFXGa9ORkxzl0nuj8Gmj3f2Rvw8tFJmhWZykhYTe3XUAh71yssIw1UkwQ57IJXRHQQyHHJCVCCvg4bmQptqctBna2NTYplu22cacEVfSUzegaVrhFz+FejVwnlLGWoeMRJ1UBIlrdXgX4TZIOTpRDIhGPT3HK1yVQoKTQkK8or2UiL3TXDKuzqy5wUbeqUhZCU0XUpRBvqOPliaPyXE2wuWFdHaH78wctlQqyHpZS1DB5VzAVUqaKP6hgvqiNggSN/wuQmuouX2arMh2hwi7O3bvucnO/uTWWPWCpXcqlFaUdi7R4X7+cguV4a5R+qg/ib4WwPzvmh6Jn1S1iF9qZ7nXoOIXICIKlwhtPqTfnnH1Mv2BXV8hsfvsSnf81I1ij6tHa8M7JaoL66iDv22rDoogpsRmol+ybuVNqehVfcdnUbFBGF1omEW0BuPe1Jc/jrB97ewvB0olxcDJjLhsFKvaPaNzCVUvytu9QoFK/OmyXQ4nxxCWf2rhVSY7MitN46nNO/7lLnSFYXUUHXkkjNdprnRRi9KSJgDPPkWZIqCDd4ZuX4HhCxFvQ4OyObJ2Uo9YRMKQusHlJwIFEBc0N4UTf1hw5RKGYSzs1ZX8PRkZcxOkFYPlorSvnCjUQpP7nwZAX7qy770GYCrJqmVO1P4BJZFGFsFGg3Wfzv3Q5SPbssl5tx3Le3AyvIhjti0A16MCet7++22XziHDm/wTIY6tUwoTVTdLt7LBrRl0w7MKLyi3bQ443ldhl51sEQscOXE3Xrwjx9bZowLTMz45xmsqK8IyoJdG4A2ZR5CCPnxurGIt8S/Nkl+7IkMKBK7/3XDtIZZJJxinpGF4f3bY1amtvw/z043bqZeLaxBaS/oCzKFkidk6KF/Jkwwgx6jac1+akpj/gLLCZzQr8OZ1UEF1P966YkIBeNxzv/oSIBNSc0RWRVEH/EZhsuJ6sBSQFBthZXRQuAg/6CqXDgBtOTSHCN9aMMcLV0PbeIj9kuIMwZDNMJX9uEy3JN8nurhOIZXjB2MtGnMefh0dxjLirGkLXXFzQ5ABxq6wzY6m6jo+ht7b9tRHgWq1XBHm/EX032KTgltBa/svfp+vbK39bxSbkNI9ogCvCldMrsQHZ0KJpdbQIWwZLMaeiPDot8N8Z+6fGriAyGvbPxDZFub+n+h0ifwwWCwnLGVpRX3vOg9qrjlF9ntps1cm9OjNscvJW2OHHNsmc6GCAe6PSm5g0R7E+PoQOHmo6oZypQ/MH5XPF+E+Hpb/IdBJiIdI7kn3Cu774tSLydYPiUrs6l4rCyaOR8GFayxGR6Rf1JxeG5+/NxaXFnqy9AR1GnT/lJ94rAsa68EgcrUY/GU0MpEMIfyQ5c63M/N1o61J43QhJ2oskb4IvWGIBD3s0tL+bSY+Dd4XIGu0SZQNyzuW2XR1kC+tD5roKxqmV16eLHQUzCkbfFya2drTQyx7zwZtXQ6zrn5OJMOe3eif7879e/MvarzGgkqCU2G1+gow3cv841bTMl5NFvteQqyGYaH14gyzk90aDObL9iLa7mmhun5qlmr3FsZiJUGve92Xoj1ZE0ZCknpPwSAOcIpwN7Glk4dDW1xy50LY9N7QlQQeBOJSLcA3RdvA+jilDj6Xk3tcnDhsngI5XsQgsuUmZFECsft692K49vagek/u5jkcss+vMwPQiNenUz++v7F/9+CBEUjvdyCSOLO44Wuhh8x8+o8glV3srCmZvOjK8v2Xci1fT0BGak6KTtkw/ume5sV7eQeXKE3vVSvpNjWq1NagoVNHJpg4H5yKjPHSSaer0qeaZ5+hpjsAnzAbfh7BX0CoCUtu4M3AMw7eTg7+VUuk1eW5Kw11tcf2XanS/xi6pMTyCwM/j4TbN2M7FRg53eXJ92QOGGeCK2dxwYV2YG1a2pBMlSg25USNtkJLWKkDI5VDWAWK5y3KnrISFRDVaUd8RzlR2Vpv+JXvbJdWkgjjgVJs0wrFs3nP4BrFqH1SR6s54cvMxvYZiYUA76+l9mgtXTEOacQuDQ59qZz6ZRo+BIt/q47meF4jwWgNjDkqfn2FLGPVtCewq5eiFJFrPSRRUloAwE2uDDFOeOUcRUhcWmwcyUKswZWCMmrxXgIeeWBYyyf5nRJ66ZYfdKdN40e/JjTyI4hlXMEyoPd/vfIo1TsFX57MW5YtMtldh04lcMjqLVWirjNtM48R9aNGG01BwdjsfWAGTnYZXyFSiWb63caNu6I21Vc9QV027nW8zTqE1ec3qGfu7eaQkTCDeqp1rrVmRdq/EnlwiQuIxJxfq1mMVvRDgDFaal//TMxdV/g3MsKmTq691KgA74LugQILcr2rBwgQ7o8/sHm2nuimbe7ScagCfGj3n2AvJ4yY5+giGNnNg4/yyl9HdWZVf4qiAgSsJU04Pd9cqqkqAsjboAuKGWBqTcXcI9C+/c+nWfWguC+mrWUPBWBegSE/IT8/egUAW1YtepK/AjVOvAb6esMM6Zf9+dkF39DI6SVKBuG4bD/w5ZCxk4D+r/O7WxrUZ6RRhR6QV95RrKNip2j0oQG9hy5iRhXd6oLbbd04kyuR5yDvp/kaNZ82/7pH852QRD2Z07ysOJEYOSbkab8VNCpaTsUJpZxh6c5MNfYUSnpPKcOOWaZ4JEY2GnEQJ2SFANob5vIon7Zw2QzTHVvWgszGPL/3OmEz0yVajh3+xTzannLC/rJ8S6F7EPqg52UiY9LlK/94b+A6wFQ3grSpIR7g7fNt8RLdSK6EX8snPiwNrTN3zJXunT5oayO31ZmAZ1WgRNOroeMET6j0RkbVx7Dw92AY8fVgr5FPKCaHtIKBcmzin3ZI120Dl+ec3c3Orp6irkpjJYJ83Tz8JMcK1lc0n33WQBfq2YzZBs0qInDDZF0YYILs79pMmHpj7OtI4aRLqQv3nZnoeUAcK+CRbgL5yfAeqBB7aczB7Bmeo5MQS/PWMGpe3mUpYmK3HozHNV5PX5Ntnnr6fjMP0/oqWVh+ExjZli9sRZA3Q4uscZCB2DKiG0ITIvQUBu4Dw5MEElHXEbboNjaeYbKq5QmCUoMbfpVgwEy4H7K+MrLmeMxpVetkAf8S7Rmg5rgh0sAwXPwFzvxZ5cT42abbrcrqUMXb0svrMOkDprX5PBFDQ9aDsJI97YPsSUKvbyQosH7yb3Vw3rbBK6bRfpqrDhFNJZYxyjcAOXQA6lhYgfR4DHhEdKGveLymJoypAs5XIe3jbrdz53++cBz9QkXbaqzZ6shgpOGJ5aWD7zGuE2+HrYtFy9t//vmbQZAtb+fHmVxPgzVDNfxqQAgL/9f0MpjBjTnVPYQ49Je+QIMXxJNxykIzSNzsnWQTDdmIAz2Yef/BW91x7ICBrPLuzmkYi1mL/SUX+egHO/7vd8XnSec+tlyPDizaJBJuunt9pYKDYaEo/0+q0Q+JHG2A8cPKu1fQL72W+lIVAIQrXVEEwFLl40YFyglNDt66jPp0VHjaF4Gk3Yv5MpQdh0kXHAY7R33nANJr7K3IWtGHHBPZa3B352IV5WsM/KiRw/InZ0kjDrROdo5u4eJUmqD7MCjQYylXWYRRFs901J5dw2gACMOyGiaQD9VopSoYJRnuAZKihh+aUauCXlsM9XbYAhbVPknMf2TQhegoPhp7H0wXOs5PE5lS2Uu2h7//Xr7M+R9VTrZLYEozTuEdToDMAv6BaH49TfsJ12rXpM4PqBoouaGig3FI+YVnmThdHZoGgiQGPNoaZBF0NeJ5ZO59nN1q9F4/eGyKpx5hYmZXbiyd6UycB7CLUtGtB6jVlLSa6crcVy+hY5m9JMsh2HLqCKbB3ljFWdNVa6dZObceEvsUgri35XTkK5jSbYxiaxJfG3KzgeddvQYarvkvoqGLljNy4TPMFH+L/p06BkzoWmF2TYAKyIKQqnfhkdixLIRD8oT4q7PonXsBqfdEE5EYlYxmaeLMVPW8wEFuHkR1jLsWtLVJE6uP8v8wOJyzUSbpc9MzKsalH85yy+MY/QgcIg0hZNrJh9AFKYnZGyvRFdgCDyu0T87zRqeF797nqHkh21grLb9m6jbh/IuowMZp+9r1cT/gBRzzAqgoF8ODYQhEYT6vB7/dei7fkRYflirfbqZgATzCfkD7cQJ/uRXO+UsFfpSGoiVryuTeRkzna2U6mm2ni6lFTih9yJsT/EqdQ4reCDP3o9VPK4NaODgVGPLyUdxvqoNmOykrIM6CaOimJqF+go3wWX19Lpz6wysLe6wLRnDppJyRaRlBng0DR0LUuBJ8AibhbiJg3z6ufEg/vwhUC3W9Mq3jFcpt9jPAfX+Cp4ztYZ1ZyM16AwPfkEpJ8/rGnVljGhPfG1m+vU10YI4XUuvXhC3l1hbHMadUFrng6dyAWaCU0Q1lMv3Ksi2+umnbCgLHn2zu3LTOv2E4e9eTe6gHE5uQn/kK6Tq7C43eblj91NaG3PnMO7CuzcKXdR9XLIPGGe4NDWgk+zwG6rLOBFJYgjK4OuoRobotbbmEauXxh3Y7mdq8oOnry8YYVv9Hv2hkv9AfOQByYksgDta+8ApupBOfTa5eO8E4CM12Gc7/o2JYcjuU+kReOc0J2smQANNm3n89P8r1P2N/rQzUMg/lu4yF9ozCSY7epnmKbEGww6ONrevi96S54dkYlziPqzTBDkzMd2iBsaln1XyDZa+4XCj5i++0NFjRD7SgJPEgNUWz7YLvho+iyn0Jfll4Hzhy/j83dPLW6+wIG5Xabcf3afTfMp7Dfg2nWtiEwajNXs7dTrZOoFzDgY4BCLLrpCfCGB7i0k6CMbR3+xFJhvm435vWa62hGUxCMlQ5K0I6vSc1aZrfzTI3dR8/AsC1dCwP+MDhDFhAuqMj6FNR7HJNtSK1kJwtmYXwFkpRLI14U3D6VPj2hrzFw4AkWCdR75GHbBWct+p2NLr9PORLhO0yacdYevc3mk2VDJ+nH0CDdNYplbZEXyP064Ms99wRw1MwaUt+3r9crh0o49aZ2wt95WCMoNvurXOJNGWHmQ1M9c/MnCi06e1lXSWMhB03mRCZ1NdOL3SjUATlu575evXKwhlGlLWk0lUN2dl7jUi9DVcW7wuziw7vzwQcns2hyHa0XOZT+dnVChFFdlYclyaK2nfpunQh4S/tPyN7RFktyUjYQ5PbtfCTOpFMajMzWzPhkg/eJIWDpGHYB8EpZCyIxUmAIbhKXjAgXLaowiBgC+U+sDvSBz79n2FLzy8POS6CmWAEfh5YwNSvaaISBCV1t7gvP2aaDRT/8V5N+gMzYSHMMPro98Y40PjHdvgfdffqNK+zgjou0XAe4u4OZDAsTlJtG2pjOkl8xTohWuJaOBp6zcBrPmKhT+C7C352QjRAH2iRiZsthhJyXEGhtnNWy1RMBJ+SKOLlnO6zJx2/khZkSguD4YFODYi8Ehc6H/PSr2Rlai2wndVyMKI1KaXpKIZs4NYugL1aeV6n27qqoC2UlBKdaYQQZn2zoF/WORmYzCaMT0kXIcwzeycF6PJFjHSErdaawKv2VQ5TjvwQ6znR5LFVe14GZV6kAW79/ITwwOyiLGYY3w+CP0w7UQiwrS8PJxXI7XgxWSmFDGaA6YtiOB0IAA7FHBrGAREN1nGe/icjskz0MS1BzpcLg+uXpdO3kU6J0JlmT89GF5e0jklpevq06rEvg72ubk08kkSgQye3Cv8NGYlsWxlZv76wB47ZyrrOt++FZ0MwUzdRzdylZ5ipugYAVb+u69r93/dpwMaEzvWB8B0Xa5X2IOoqhXgh2R6IKP2x8KHSsVoS6jZvEulgJr65jAdvj7A/hkY/oBx8CRg1EQ+33fyprp7zMjlr+Peh8l9ypjoay4MQqZ5wLNuEp5qCRqpWUtH8y8/1g13PCRrx7ibphM7WxN8fQC6cLftCS0VlCw81Ingv8lpPNqYcgj7hg+hH6ecEHVdJVtwjOPKmYBwrGjpIZkUVE1Z0JxkB72Kq4JscZLFbqxWIPO02r0Qr6jeWUj/n6Ox5qFRl1Xhp9JEbNtuyJ7NDqF0UJQuhhTlZupR3GpmdqqQ87Kc00QzfSwI42kPBl6PASOBKKE1B6bjzV8Dv1D7xgdUx3tK9vKG4v4+bfPStPYKs31ZF9NqE0ZGoHn1Dcdu1YgqO6yVWhZvR2jjQtkm3vu/O3aRrfRt8BF8UY2uatTAtvh1uyW1cGz1HSmwq3boWIcyCvmK8t/DTE/129zx5iOVkZUUwV22zMs7Vs3ZPOH25SAf9/Y2k/x2j0MZyQyPjt5/cOYFNg4AGJcDzD7SeSW5FspCkBgw+khzZed/qDEOKsDkF2MhOGBjS6bVpB8tm5SlOLFv+Jf5X/jATxtx52Jk9Ik0gyRcbZW/aIVZt8Oq3r8tSx7cEC9UKe5Cd9+9KTMSxVcVIl98PUFoSkVb1lDYtvelMogeDloBnaOVP8b+q0NNl3u4Ub3+QlM/mgxTG32PK5VD8WCiHrs0Zmc+hSA24aw2KqCmhJMNUS5xylBT8ztXeDCWwUtp86hyyEZRPvbkicrM0TwhgWcXrnKuWjUqEzgnFu3xl1syTOyFPdGlGmGI/5bRTFk92dNy/HyAAkv/jlpB3WIMue0HlgPET3T4xPzi9n5SQ6ig24W2urFK34mfBvw7KNL4EHVMB4qFV0UkwM/+fbLxhfv2xaShLNrJHGW9NBAEuyiihf2uBk0tIA+I9voyUcYoc/XfmhQvJ8AOTT0tfzEa1NA7Ak8ZgjOAu+Rkp1bZZCT2jTLNNrKqoUECRdbWEkdohiIJCR3g80t5IJXBDr03q6SFSndC2OB78X7dK7I/3LtPvpz1M5nAc00akJDT5lxtzF9LJ44Fc4Jk4r1p+Me96le6nZ2+f5TZmHCZzvQ6osFI98qjpDbP0ffqxzmmelEoonFP/njQcox3RBoJZfCzhMg/ECiPV+pTt5LBQJefVRyMsGbS/Kb0Oh4Wa+Uhmw0mlofVotto2DL2SqHRIKnvLQDnOrVJJHqrS2GSUtCG+yNAZSYfT/aoYsX9gM6j4ELa5pvyYw0d9Dt48Hf7Ponzk8rwXsTijVq0y58i24gi2wGJASK03FcrSqkF+FtkOuUfr0dA8t6u0VFbxQlGEQxp31r0kbRN1HtbXSemBrQWJtO9h3IUYLlLqCHqLlkwJ9fQkgQcZ+lhoS+1GW/+btKpqgIrQYmHr96TEJObEiUDwOHeStAIc47i9qFecUM45HjLA2dCYxNQcS1dqfYaX6aOcJfy1jgjIJZFPuieDsBJwRhfOJp45pEjEep9jBLxkXSw8c3Or4k5Civ7GpYFGXFYbcHr5aUsnN/tAJ82Sxdy2pPe706rFYwTmVqcEJ7uOFZwz4Z7Mr9gn9Wv69r4DLBs/5IVkpHzmeulc5t7N2HwGF6eyqoNF+2yTuVkfjh76aymTyfX9hid1SrXsbKsk8+SY8Z0Ufz7jCODm/csCsLn7PBeFA0l3VCp5bNQkS+PsnGXAx6z/soit4lrUA2O5HjRBOa+hcgBFGXdP8vXnSvxlRRIBCNiorpClk0Qxdr5tsm4A/E59eJurBX5zhTaxe9WB7r9D8BI0yTqGKkmGPZ3jERdtummB4QBhP9Xl6CZPeybe6sBG9SrVk4J+cuThrP06HJfMqtYISS3l3f3VR1dcb+RdxJlIp4iYTUumrqXVC1ttoxbBDZzsSFLkom1sfX4UFDWpraW6hNPQQzAUKF4y2o4k9NAjn39nDYEd+ssH9ifN/w/q9ZGFoZJR1bmc8dgADYpPB9tbb3yGCNqYK1qIP3q3QdCTiIXwuM46EmYyJaOIROgsQGbFCLQQqgzwONXubqt0wFJCbMFwg/U2qbhA6xp7i7AL4JACCB3DgCmI2G3QYUrCC/U+1Wixln6CaPLXc1790evZE1wVuRqezkrx7E9neH4fzzRnbvm1psyFOFS8caRCj2S3AFWRDVAZXkunxjS4wDhclrHI4kiRTN1pM0YHg/69eWXmbnTAvo5vdz0mac2ZbqcvWVILezT2IXYZaSsDYWrozd/bSW+1fIFki1JIkOmhdHKqEdcCzWhZB8Y28GTxemCFnMqZYGE14mlEqO9QUpdm91U47m/be15XfI66Y/GlUymSkV50QnkYpaiVmVC7JzUcMW6IgEXErEvDHeObKS8K42Hvc4QYIc2oUlwX45mk9oAQj0knzKXoaJszlXkGkpiZpNpIhXST/g3BJY6O6eeqrEpWW/Tb08JxvKoHpn5w0wTOVhqY3Ug5kby8xGgo2UF/WOjiqbvl/uu5ag9KZcSElE4/1gymJdgzGHy6CIdouqZvfGvWi7SmeL2XZF0q4DCO/Cgc/mRLKrt2/NQxulq0FhXwztODYsmqF0yVgaMPC+lAN2wuQaIBx/k0lrsTmU0Sx+xpcfl+SFxIxTgB38pGLDHQb5mI7eldiprDMcF+7LOr0P7wNVTMs3VkP1HLBeHEqYGf0nzUJ/4BDaoKwLFj4TxFWsf1up9WcS9IkzNOYNbZH5YK+T8/m6RgQdKyYvIszV+2ZJh/AW0P0tDrhbQzlWmSLi8dNcQQU/zYefxFD9Gb9RaTq8LBhGG9E5bV3GJyZJn2j/nKWX9MtwTOyLKXOCAnRmef93sM1pz5Usu3yvlATMJBjfjJFdm/3D3djYfNzRjHHRq5OpYfdnbPH01xoIvI004NK+KUjuzQm5+4m9504p0Zb+HvfTbdRLtP39fqoFkZvLKOJsHkFJw2JTmn/Tt3hdskXtDKY8pRiidMi1HqcW1JNzPIHinUjRSi0uehAO46YHcsuhSWn7rqfCIP1sTLSrxN77vOmtFRhVG/f3LatU5WuLVHl43KNXAqBCptOuyOVgTBaKAimcgh8Ee5h5DYWBm/ScWnqIA0O7LVzFxQe9zc7g0yP2X3646hAbYYM6lGg++BZsdxkDEBlZQ2XIsQLPXzvY73Ro8edzkuJ9yvGeBB5QRdizX5Er/xI+OSoYbh8oVPIKakDriUZ728YajJZPZe944E67j3v0UHLXXcb7tZ1v+VEa1pK7uptwd5NtHF+uv4p9pat6VsIzciDHzQmmgzQ1MGw+jVoDLKyKp7tqI3tLD3Xfw6rzw70kENxbrdfvB+r20pDrMjSnpNFx9Sn1sI/vS1awT0+AXxGIMTrBeRb7Ah+lmZMObxa/aYDsANtXe2/KaxWvZXK5RfrLAk2UsKeZw2XgnOnOLLJgFoxrnLI8pus/UGG/fnBy8nQkreVCkeW+0o4XUJgkORVtXm8bw8pskbltCAhsLe95b/QAg+QRZxCbGdt0MkQ0jsbys1dJo82Re3PhIhS7pCvUEC3LcccMfNaNNqmN1FKY4Tcfj/WzQ29OzEGOqvwwjfBGLavid6C3ttDVlZnY2Wz69OxTRZshR8vF5CRyWu/Nbc7RmJRrcgsMQDiHLPO0JgVgxg3HbwRqAnGUH/1NrTWKl+EJIXuX8EeOAHJa6Q10J3uWVEn6zNH5XOsK2eIu3qHikak25Pk7x3fKFFW2cRcxpm7P1m+qwMINv7Phb1QWWWS4egkkCUIxKwKXYS3aMEtPwKsI9dFKDQcFKXEf3E8uDJ5SPCELeTOfhSCGANdulKvQmeB+a4xwT60BLnTI0xhHnpfTuGyT48SMnhWiyVD/uWF/w+In6CB2vhf9iTu3Yn3L3X9Zzcs8KCOB9t+fyqljY6FbgOKYPejyqyp3RAAUmqSLQ5oeu79N/PsjsYTT7Vph9oO1vshCsoLPQ9WvlktY3rAqOOHdcm8UFei/Vw/wZ//5XM74ReQJR/7BPGjk3C8CeJ5+aIcodEfNtxpTBiwpl6+CYQbUKJE4xFteOlzccBYyNyfOikKHV1dwFrJdHJqKIP6dHF+b8OhNOKcE9OdOyXJRZL1aIyGPQIaXhGHk9az8lT3UrCon1X5Wzs9vWTP8Esa3vjVzzZBlGy0gp0/T2U+C3tgi5ymNQJ4imo9cS3KbBFBuzQL9w6PSQ+yn+tV8OnHqOK0lIpdhc12b2Inb0gEy0K1xf1iKIFRuRCxlvLF/NGNXD8fRCCdVXjLjA2Y9cSdYTUgsDCQWQJhMrzaqzCiL4Voac5r1VEwbqChTapCecpg9wXapkss59W4ZvMiJrx0RFwkKd10VP8+esKu23vozQGWAe+rC62u4F/u4GLWy40Zp7qAZ+aLEJqU5lLOXRScC7NpgJxeUjg0FWQITX2zc3Ij4j5o4MMdvuVnZ19ldt27HrAOfc1cXRqPLRHaf/d/KvUttk88C4kPLJqMzmDDjgw6GuCjDlTt8CU8iZ74jzog4nSl4ZbVy3u/Voone8nGfxs2MESPYzf/c0BsY/D2OaqUKQKhlu7IS8zR9bttJ+qrkNXdrbJn5zAbtTGvOXowFUN3rhrOIM4xW/yd8aDkEIfH67e1qi4RscRLczR9zcNxfu1S7V23k8mBA+Bx6pSs3TOH6HW5i37ZNW6eNDgU9vkpbE2kBHUs+o4bmbU5kbzQQ6jlAyeFWYFuwyrA5uIwPg2aqImkv+dQfqcxR1pk8uao5ZFDyjfGVr4bbxHW4gWVsjLwajE1KJ0HPLasWjXIqXApSiWrMeg4HYyQybY+ZaHF3lNFrr+PIc3HRFVsiNAXxeeHZLXHBHvccWiWwIqmRrBE4w2c9oQTOnT3aQj55Rr6D2CX1Nk8MceGOXmxYDtoCesq1opcg+ebehlKIvIkvB1oia70KxeDfnd0ZNk5+hWtQBXsFOK6AjjKjBMAinJagqDgO+TvRmIhr1ecWD11Bnzt6OvWv9z4a3eRw2j3xjs42HhN0+4eHoHqLeeLB899njREvqm8pCajtU/hvdpnetKTDvHOfGXZIFG52axu+f3i3vK7GaejbVetMDfOw/2LP2AELahrO0ygVoMKsU3m8kUKBuQzaKQxigXncryW/W+g5KxrbUAINn72XjgU4Ra9aNWZOauyD/z+TP9g3bb6G428SOz8jBQ6DtZpxL8rPpJyIMa+l4zOReAwp/o42F/BPlYVs1/qZf3cOTeweNDQT6BYHKEchQZOQBT8jZq7UcAEDuAN3irV1LcZGz/uOcqWm3tiJangWAK11pMih214J3xI9l/nhN0L8+mL9oAw+AA98qIP31+rlzLCqjmVXBoi0vxVzx6K6dwo6EfO7dhlzhxsvvIA2BsdYdK9EnJFjJllkjVlIjrjXkKbYsf0U1MWwl+gKTbj7L5Hpo03ZcrIUmufE9HWdnNaD1gJktxwzqK+5JjcM0nrZ7FLBNNkwU9WkOOFgubn/EHIVXHrgeDG/sn+GasUyDcic/lOHjenElGsaH28LpXEQju+iFKvFk8QVBlOeBE3NGVIJ3MjFWhX7bNU0KPy3WkzqBtDoh5vAYyoF8XodB0nOL+qAnyPmX252oh6pr2SwiIqt5cmhAg/ORzSlPe0z1uU2oRFwug5LtWg9yNE6Dlf+Jhl7unVbSGvGCBWsP+r+Nkfc9tO1X2S76hMSFswr2IZopu6fMwwMqCKP4EQmdRNVNIZG14m2IBSsr9QXWR41w/KVnVQkUn1nuOmZjF9BgBlRsLqE7MvuOIRKnLjrzWblzn4bPMTw9fIdgt9OZnRBQAV/x0TsuBM1C82rlHF6q4ki1D+GqB49M+tRSL0abYTI7uOLYpDZpFyA8E09RW9OuaV6jKEXxY+ZT4J4XDya6k5ytbZxxOBu2d3XEgbIkOkTsUDntiPE1+zHYLGUGYrFQ1m0j5+S1TUiMevos+C+LAGcj6KQyxDFyiWNjXv/1fjdWfNQtVawU0T8DrzUlC6J/xBWDvgqIvEKBqnAqKeYwEJK9JQhyDYWdC17b1rWh7s9jb+Z+GPxf9vrnDYxYfIKar2niv676nGa8pk7EqA97VJc1J/5saIvZl3esMj3CWREXdWnyA/LS7W6KY/I/H/B4b+x+IMQrsttEYuBo78RJXr+eCoe4IutO94/FIXCnXm16hL1vr2OSN6/3/mVMN1dfStxxV9ef9j+NCUpYgWiotZOfBQAniOUHR9FyRvsf/r3jrlu2zvxwgT1fyKk1KYMh1CYAglA/G8OV+iAv4Flsl8qDgLuUt3djA0BHUJVCihVAf6RdiltMzFwcWWYyRC9kbYLCK0moBFvYfsxKv5Fto5KRLFQpN39CZm/UQcXVOOOm6x63r01HcGBZ1Pn6nJmJpyplhsLUT099QOKbOWpttCSSyV7k5ucNdzBbiLIp7qvYgV/0XKH+jHWcMHWQDHZqJ267HpT3zHtZe4UPFOkhw5sxlWBRZLNubje+xxai9XboXZ0hoCSFoFm4KP06cqauLPdRJB/1zxMmnc8v1n80kT3yE87T8BRNI96ML97OFnljwdRaiLQHgssV4i611EOdfe4o+3f/NASyi+jdon68WtvIiunuGLfcN1Dv0bhUqn0uaA0+lV/lDvM+gn0xdOVi7WPXoKfnq+V26/j5M0hVz1fbI57BLvwL+RNsIv1JMUCQ+HZ8iutjxK+Yz2UDxrcvU1uL1F2fHVhWWx1wIyVmS3slnqiuzEJyhsGE0EuHSb05zlkkXMDIKOP5QQ+udnrWk9ATuAPxksaNoD7fcLbC0KZJpq/WUVNr5sK39+BlFcVQYSzlhTVwXmtmKDjbtgoDH1brXqZVkYpwG8ymflC80rhCW217ZfQq0dKqZPIWr6fLDmWPyhpukTkhaXSfhCX2/6x36pKoOXuF0YYZOIvCjoaInpSd8YdT3zWDHPIHJ7BJWc89p2vRVf9KT/33X6EdPzWEytBH4zHf+9suN31Kh51Lnta920yupigqzJXrdpKEE86R4AL8lfNb8jp314EiQTvrBNeFPq9Jpw+MkrfNNAOpFRyYYU9BvapovQbEnl6Kfl69Tmm46R5HDLeAmRWp0nFirGEusaSntJ32E+btsuNoxKx4yWhVXb2JMh/9flyksZ9/HwOasdpfgTT2U74/leZeOQaRanGvZ5yqJy7XxMvxAZSYCok3mOgZE7YZMmCQCrmdVgbo4l8GFbG6KMY/5hTieLjImd+M5qs0H+U8o7y/b5B0po4C5IvX9YZuA5dspDF5iYRtc1zVt//Aq8UhLQJP1J9bKoOQCyRGMuJrRL3nKhosMjaQNArfGK1cxJCaVWNL9HFTB8FNtUnNHDHO2QQCc0TR7HsKOxtIp8GDJE88n/nvzrZbbdaYY56DMLGBVw5T1rTt9dpnEER7/OtCxhqvFM0paIUEhVwB7D2ZpZA5RzUSq8rn2BMt5ulcYe/z6E34taw84LUDzjXs+c0XcoOA3jNXF0F1N5f10f/NzhpodJGhgV5y8A/aDETuDsqjYyT9hgfGRc5+imFndmu/4Mad40T1mSlOVdckOcy5ofodj55K0UKUoa/5DCil+Mp7hRZlHcZFa0t5YSWBIjGSDn0VJ1CQenKNmgVCRTdtH8DCoxS9cbqKl0FLV1/f2RsrOVRUu+GZZxRlOyxJ4uJxcR0DimMdrG2AlQ1/y6oRF/LzJ19xF954WkNgfYUKhCWN9Ko6i1a7EbdQaDnKP7FZiN7+jEoTWFRKcZ0bZYaaxlbgX4meixw9BFtl8KejO5LzYGGZMNkNLftLV6ZAluAY5HEfQgcWBSHLu8N0IR30VRXvfcE2FTUQCjj0OFvyM4Q2qaug8LHJe1Haae3Y1GrDRhSNa61COVp71CbHTsWRfl0ms+r8zmjK4O/4qV10rXEhq2lsKKrXP87GBmel01bQo0lTBS2WF2gg1DJ5NCyD02AC1cbmFKFHz0mdHsAshDldnBKrZ7erpOUp5tnjs3STWX/IerKsLjmsSFXQR0JrBQYyq1MGoyCbQ0WSma8ZJiaV+et6NusgbzW0UTyxyTuTPLGMGM46zlmc7iH7Sfo+qMxhtzsn7lvtGUzjQuXbo7XHkOysNnPG70ac5bidsnBnR6c0hzoqGIQhY9aeVhkZ7mK0dv4ifw2KUgrm3ENMriQ4F0pZukiDbiEKrXTC5swtWmpfhqFF6V0We/Z0tpo6VcYHBiSHxST37/JKrw6VDpLwLcP4ngkDxRjlFYj8sLIXH43kzJ/rxnf14no/qFRNGw3tSjKi6AZbnJsjK1vpzfiyRouZ38MZy0/iffsUOeUqzuwTFWnRJ6TQktbXfLTe7Za4yL1PZIBWupd1xAD5aWw077GFI9Gbrm4bv/Cl48Nlwt6EoT6/3lhK1ENcGSeMYroe/UObUivYxfJ3R5+YfZAM8i6GYCZFoQu2oJ6bjotYTKNxDwztfVC66SL3pAqXk0bw/Z+hCU40vFDShy+p1HvtiJ88tQMIZO7TAh4Yyeato38XGxZH+YAL/YriYtMadq/RIlP9cVtcYUIGKbMeSYyiTx1H0DezK4/9W3+BK4otx92kU0/pYnzybL/LfQf6u03ntckpi5svOYAFaIB+zzN64/NfcTGwXRMnOfSn20THJQ4SL6NziZIIkELVrX3SbkKdXBEX9EKwu3q3eaxZpAPmDKiO3Xbah8Ibe5Ck1CocDIJMURGxLZWrEorAyzHb0b+mF/tZ+ub47ouBuJnsCqd6Uf7UfXhWCZvIuE+pZa80FdUV+WVakOPTd+/fuKcgYM+DSgLQ4whhkgKLv8vPeoZ+Ee1ruLGBZjHI3tb/73+p4mUpTGo9YOCzqp4dnk7wU9vF3TJu9b3eGGJq/05GVqIDPHaqNLsGMB8Xlmt8x/4oMfVAqmOJUAAqCPVNKP0EbM4w9HpSjQq/GmeS7oyUUj0Ne+hxEHii9AxEQfpQ3NqttUALGKAcRIUhnFubkMaZO9+Xvsi20KHvk5bCH6zxiaC9M2OwnMktbtXzNY1mYtUi1gUlBl7maWD7n6K9DiWe/dR+81tm95ucbxxwfIgKhV7hTczZxy2GZKk1WXmYDLivRcSmms//S7un+mOq7G25j2na0IL2+wYdOBBI5PLa+egB6cM0jEIkEppaJ5UWYacoES+AJrgq+t0ZuCphlp05hQNADSlZbbEINF260wGisfB5KqAUvlz2s6/gWHxj3Po1qOb44NW74biklenIc4g01fwI1UTKGsyFTjNaoN6ynN1Iv4TlRr0I2Ywa7AYUHil0WMN6ShoLA2R/fQsERt+f4rULAqzUWA5g/Da6n45XFFbLySO9o63IFLGrx21RAspt+OgjWFJTt3VzMIxOPeQgWr6u+5Ss3puv1TMVcIrsbES+uh3pFdeyEY0TFq6yd3HmIkgQamw1TKkD8TOBvsd1Kdk1GCR2sFFcOGB9jch6JUp2p3qPVaOaDwDGICpdjG2gB31qJaxBtjb9SLK+/CPgKP4HL5UyjwdPqQlVjv6ieQYitYfMggEfKAGc2JC12/zQd70iTBXxyEwnz+c4Ov24XIKHO5TLu4rplEQfQmoZA2Y0WElmRc4CXrEdyVNFIgMIIUshHiK0g/AFr2meRiymMtMLB7SV46emqnM267/RipHezYJkvehRIXvE5ffDEkqDOclN/cEnHR2BapJH5OUAnh4hPVP53JFEVG0jo5s9OLCrwM7BzcJ/mIgMf3kG66mguLZ905824B5VX/bBaCtxwm1Xf75O4xpP8FpiqLACwq+u68Xg+PAnDdPYuCqgQm4hdgcss9Wn4hSowU4IWqP6tRVWnwCT/TqC2rwdfBlXtLw85tv4amyqD3Fegg8Ov0lF4VYK7Ycq9XTsILEDGdLaLmqwkaYxckGdQ2Q1NkjFkvAUHoZrs5yC70Chb7FN66zF9S3EeRp+XPa2LimB666V8Qssxkf6lwbZXICPgXHi/KTp5mQ+GJtZOuyY8oKBDSTs2OZMQDWJeGBZELKlg326Vp9WaSYd25pmzZaSoh3jd6ky9jOfAB9cIqhPp17dTig19ZoFEJl+Fwqx1l58HlCJzPW4bNhbkA6xuX/+9SWd+DHAGTdqLlHSFkfq2NVgUanqDOfmDI0SmDL9lvQ4CTsX4ZrfHAwQzlw1geTqGJ6jk1DPY0jWRjZMOv48ur/qCUxN7+d9FlgO2KoNwNgD3FUPjUJRJh4BVb9UeO1GBavjOoaktIf3NwMYROfKeWC6ENBoNnTPJOGQWlWeoO36fN3x1+NjvzzeYalU5i+tjyOmRp01B1QMZccQMhlFxQG6lxfEgCMIkirmPksI9a1qof3YHNyqlhKIV1SoTW1ltZeFxJ19XKoEtizNOxIN2LNdLMpsbXg38Fm4Gr5Qdo/BOJYBocE3V+VhHF8QkKF7YkkYdIXAr9g6MowZO1UwwUH7u9AINvLow4c2eASN5KrJITW/oZxeTp5Sb1H3eJNgxw86SfqVcQknUms/FgCubgJfsjOildTBGNyv8i9wNpWpvk2q278tvmRDfaX9FAJV9HDGi9VspalUiNGDiQWgGE8LogRD2/809wOJUqi3OkT2KSQZ1T/d4NPgSFYED6YicJBw/rH1EGBr1ZMq+h6J/uDdJVfwEQsr7GPcro5qSxiKeLYvYmnt5yooFmQtnqWJbooDPYV0/M1LyJNYvL5gJwIz8ehZzB3OAoUUtsnDpedXD9g10/qH7af2ycEAEENOKf25e+ibU3y2FR6ke+rb5NICb2zK9iYJnmffDp3MsLCmmOHlv4Wc3cbc3pzbqMKUS2wKRCbg1eKb5IbA6AtYUwp6r0WxzihF5tN2TPKVr5RnbHsXOir3H83q7psdWIszd0DulgVbAw9te/XQsuasdY0U39FUyAuQZdhouUItziSTtUgMOlPNzG7vZHGbLmEJUHS0iExGkyMdlb4M23rCy5c732dPsIA3KzFUqIqMmqHktGDNtC/OKQPRRBzGOnCLhyyVowxpilbO01lzuY44Yp9aKypnkeKKsI9Egkp/l+V9qFU8YwAaSTWg1kjBIsGeYSLKjL8SqiPHlgcF6uddoICQi5SZjD0EDrNtIFA9PcnNoKPgY+EnX4YDG9Ngoc8FfnRzhrAupnwRQA0PWxIagoTpFBuoEJ7Eooh/TbXp82S10q7gPqVgEETWnkMBv/Pv+dJmT49V+B5VO57iYrL6B8hj2Bewc8eUOQUvnMNYIR05goB+iFnRA2aZAis6UfqbBFZTZSQrwNe/wHIh0q6nINoKKnQVshWYkPgQU6MuarqonNk2IBHq/w1tfzoaKlZtLh99DgfWnx+7JLt2s4bRJBxGH56KM8ZvliYTCDJz9gjEc9dvyJB0LS0aU+7dq7t5IU3LhO8zo/k6orRddpBr1rQZeMyVF9gtWgdGLdUcDtzI7APKifQ7MTY09ib4668+YtHquc/CFcnJqe6yIDV6DSQ1jIq2rjgej+2l/YXdbuqd9N++72l4C7YY6mDNWlecVUuLR7UQKZZ4xduTHJNV1mMhXJRU3yfPltlrDZ3BzFK/ZbuPf0swl07zO0gUQpuk9XEhcJ7n8EA+NwDAW6Smv9lnYKIfhs8LsjFGPvtY3RE6mM/exPaxRr+eqDYFccysWyq2reIudMF7/goG5TLYi/Z1uvwz3TmahQKrAceoUyf5md1mwcfnx1muOzFoXLlXNfhGW9OfE4s5u+voD9Eh0gwwccdmXvKNhd5z3onPyeno+FTMQHYqnd+Wk1PSVti/Jb/wNxpQq4U5L+JcmOXzFLLjUu45uOGM7TMyDAOzNM81RigrSi9DANx2m1SI4vQvO8XIHuj9/8Nb2QKNo299P89s5Z0ugbe8U00sCsU6/mbEjAg9HfnZ+V4kVF5c2E08ccpC/nqlA3kUtoOXJww8tsZx83Z6CG+7OfbX3eQdY0iW8iYj210mYzEF30Ndb/bh1L9ERO7RnlUuNoaL+IcLger+suNjLMr3CbvE7LNDMa/rbS1dpWIXJr2BvBO74Pp0yxQ9Cnj9+fHU/7P6nHIZ1hsm7trUmgfIEOp+5GH3XZ4P+w9Lzf5AgvFHso09IYcuhpuNBfe0mAUnwJY6kU5nRyyoY6ChLtaEs5/FSqX2Z6tMhtgobLYgfdMzzMLnzBatG3fiAcIpsPgp1YLnpEt4g5e5TxnORJVmps7Wmd3ID3P1bi9cHTTW4zCG+N5YjiaWp24bMNXTEfBI4jCd7t5CXayhzEVOlsRHWqX/bAcowiAKbYQwAb1mhmUjHJS/yEJRrwnH59eA6qxDDg6YQMDHF+WHSijpKX4Nm0cBEFCyx0j9pQYlM4KB1dJEZ3NxxLToGCWJmCzYGva5g6F2PM/1e9BO7f7N8G2g1Gtc45ISJJ8GNryMtRP5SFrkI5YsgAYMU+SLor6QtIIA/VaitmKzkWeSF0SYZrUFfrStSOsRaHAAtaxCf66eZx5VfzLziX2qVIqwk1ijm15rIGuD5KBmFwKT0H/H4AMoXv+1RjZNk/eqfHEbXQA7Ji/1/7QAaNgC37l1G3b7MxO2O8synZ53ieAnn5B79VDK8odnVliZSv7/Fq9M1Cu8FEyirtF9IgyZ9sUaHC8uuN5xoFk6f896qrW81viSqw9eQenSTToajUyVcymjeTsAXWp/334bIw8LMunwZtvzmS4s/SgoCPAINuTCZvVsnT/lXWPkW8jPkfsUheVJtq+GwTpUEMsdId4NGD5SQ67PFYHm/s5IuzBvD7Y8IMzixEc+D3UAx1T8R5y4xB7N2FOAgeR0yv1mDqGm1yNQJNziYgV5fOIIE5jsF82hKz47dAG6rxxeRuEUON0gUCmNRJWFCjvUjeI/ibsYZW+G6nmtB62mFjPv452Ps9m1DGUt4FZOhff73fJvkO6+okohXd+NT1v4t0J7+kWFlJ7y6E9tqtMp6t0H53TxzVdlKbmWWioGq61hypMKcCRywUlPw/bbhV3RO8QyebfyEze8adzoECx/jf7jaRfcrPmHd2ZRMnrGvxDeWYRk0yUIKcEsuJJJacbTj49jJ4IqU6adhWEtRfObFVsT8TCaM+lgsjuH3ci/dAKv5y2UVxkB9TJZ9CC+T74bHpOffC8Xu8lHhPd1WHnbDkvIn5bh8Rea3/VuR3IjZSayMuP31LdfP1j+gjsc+lMSkn9VFpfxFdypVYLQMU2qTXplysmsHXAAr+PnnYU3Y0OEpapsszdx5Z+SQxl7KSLHkHdmePPJgMWFPAAsQuvoJtv9mTK91mCj8ma9CIXQc4hldyzrGDxV9851Tzpm2ufNCdSRGRVNPcbfcHV4dTE+S0k+YtvaOW438UyLXZqv9ZvqnDeUf4JcIPMmya1d3Rwv/Rwwl1f7gWMU6NHG1A7X/MiHMMC9GXg1mDrZFcucz72b/SGOiJWnieUxo7IyBcbO5D4TaooXjPnOr8Po3NJZlYj5pw4LhZ3roaVKEBJKH7ndsY0JYT3SNTAnBhtJFHCC4ukuRhwh00pQjUCnYoatlIChb8RRXGzAetx7sYPpY1CBeoVbNTYXsQPYvc1hfaZYAtcnJLD7WeRWjkBrWIQ24LHCTO9NLf+NRPfCzG/7npyFZnQ83jDRBDQTflXz21lX4ibvV/ka8rJAFYlqPxMkh0MMPBaT/cka4Fypx+6Sf4ySBxXdcrJP8M5VmsI9fSODAHW1KTrqwNfNi9Elgw3uKIxRH3bq86ESQMbXAeCu8JFFaGevgr09a8p2RYRfLv3FlpmnUlc8Mifgrl6g7mZ9yX5kTzNJFeQN0EPPyGdRLaDU+HcEM3LvKy+fGYQXGQFgwWYkCZ63dkDvOWtiK0UjYPCB2qocWrrXOub3vnuEmlhrxO9X0fuBWD4qeQgK4FxKu59RL610n2/kQu1RXvXFd8gHMJW8W/NZM5Sg5Znw+REw2geHw8bsczJWWuAyqp2m3esMG4f2Nlc06ZOXfXfs4cUqxiJtZqLMlakUFnm/nrt1Aa3gclh6Np+BBvkZAJ1SNdY8Y2qe1aRm8jkcnnTfmDo5U+hXsIHW89FaomGWviPqZ900nIcO+IsE38Gdh89KRd/We/kb9/L6BTSc5ZT9eaL0+t3UIBw07YEsZc1EytKPpKnKljk6TbKe98H1WE+2hrrDqGmrllI5+4P3gQQ9DItieZbM8cCRBAebN0y6BJiD8uoa9Anf3D5QxGNgs7wXTKnRZYqnh7qpjbyVNQDscC0UeU/M6Q9VNsFZXWCKJoWw9g1nxugRvb414U8Rd92wYmWbBG4bJS+H7ad17p8+vntmud0ntw2lzRYn53iTE/VnkgAUhIYGone13R7LVRE80zyFVuncze5OBJy0qL0KZImV/emBTUQ9ftvk4D2W/iRZZAfVGpVNuCW5z/MXPQtPky/stroZasOjR/Xzs5pfkCf2uXyhMhCE4xXfoLgIEhAbjX2MhjjwQku/LSicZy5e1KYvGje3My3l8MO2RiUCEj/2YzC7BgHDl+6nSHIoXZbe6GH2NsL3Gd7GIygXdjZni4D7LLfBzd4bIyR3jBSBlhyjl3zNm/qKC/+nmb8DsfBRTsZFtin3fKYc7kMrpD2EYoUN9B+SK4brsryl7TN6A/dRoxpVp6cXVMOCjzQ4Oy8R+hFpoIsHDbrEkvvbhaozDEaW6klW5Sd83bmKz18qF4KZd2S5diSAS0xibxv8UmOcgU1cqSLw6yEHx57oo+VvWFWeEkT0sAHzSI6yDbDAP07CC0dck2o5zEVq/RXiuIl2N2wYMICX7NaahtRZ0kVQryTu0UbiwSvbjZQ0h/20lOCFewuIxdbwFbBUJ5koiwJ2yI5MR4bZWgkAah+NCoQ7FEskVAz3oIS/bNE/56KlmY44q6SvGgH96x9+vJ9rMBVLj9bCa7JVahmLhXSQ4epkOSPnecYbh+qA/uzPgfL6Xai1D1uUqrrCHYN0sjDKW6dMq87MLzPXZrCmOfn6BvrWwqC6KQ3i8crNPsn8SkLbamK7JACXydsqqqH8SFA+HzcPBouPpcmMztLkGlZlaA14g6HJPQ9DqDc+0kKZ6IsZEc9u52a7UCy8Z/nbIHRuTYPQavioI5bLRmlVUEAW0S9M2yUlc4qRV9ypEzKGimYmvOZPECMf7RBrCU2outoAhoRbArGl5BDcBi9kz9lfxPwI7UtkMV7tsKmy8a9gGY/4ltFVM57snH0MzKZmjT8Wyud9d1K7Sf3JZJ0Bc146U/SH1MvzxWavS4RrIGScAilTVybfjqjk2WL0XhXeq1eXM1TczfeJiQkm4R8QwudnRMXmXgAWZPxbkG134WvP8p4IIxEqMzF6k9yj22A8Rgajd02bFbsUQ+dX2BsWqTgNpSeYV2vFzzZ0wnnkmyia+ASAEIc8g/secCUlZpCqEhZAKznLT01xSmMiPDNNDk9wT9xXzn1y8BM5A5UVDuUDfz7KEe/BTXBTBbJwUpmFXf6u4pC8Ohf0cD/mUaz5WzbX2b8UJrgkpz/yXLmrMVRmYBiHDhXLeTSTOW4nVxyfLSNmPwpjqEybit02XmD8+8guVC+zp+HANbiVIiLrbFHs7Xx2GX1GdiRHTQRiNv215Sd5ls9xMyvMTgMtp/rnLnfN/UUKXnus8uRVBU/QkrkKuDBrc/JsR7eiEb+pkkSz7CCsIqgyqyEBlZXLeHyuxgSneznYZIdAeihN+JNaE7wMppbPHZGSjDOcD6BIPrkBjDtR6jsX9E7a+J/Je2Ph11FtNod0ckdwYodSxTUGayG8Mx3Ko7Y/ess72+HxcdHJ2g9xuFCEtQsaVuZyxhFl2QNhXx2JvQTKLnk9OHA2TbNcqkJQlw9fvAF5SGFjrr4ORVlWNSQ5zk0a33Z1FmiXrhsgQb1oHqhqfjHGCrf2vfNb7wHKMV4foJqj/XFuVnaysKLZuT/9FJoE5KCWLzGZ1GsGx6O0KgLw640NmCOOaUtZ/QvntZi4Xq6XZtF6zvcynU2l2ZQ9sWwFHWZ8PT7jGLlz15nxOX0cyb3KTsoBcFqsHnmonYbs2OiDgOosnXrohzqv3I1jdtO+Udep15wIJVfD2uAG6U5QwR6UP7e43bgagmxUQzevgQrBEgWC1J4P7emYqDgapsahzE4ZX1uLqYhM+k0Ou2w2LGONjhgcHCgna/udSQNYkyttaQL802Gyzyy8qPX72ufERp+snHFwGyodPEDWZt849cwmKWQUM4PtbP77dVRZNDON9qT8iz2i2TzOPtqpTZ2ujQc1MquVIyJ8/IbeS0g+zL/K6asKuwyCNkQUMyrgGJLtzW8KYGD1cDqawjOvWKCpV/ND1dHhHOGFH0RHt6d1iNjq60SSCo4FGv52WdEnc0OSDHZSbV5WIGqVW1GGWDhWY0aQtfPI1+tsjSqOaAZh5D9Z/rRBnTcoDJmnPYOEMQJVcwlm4QgS479JFN+jL4wa9vBlfBPfv8yHXoCUFF72tAFuuaOj6Nl7NZjuJLneo4sdIqh650xgbsySvnT9HrIbxn+ro+6hwCSi5Ip+nm6HXOMWlXwI8jpaWZFimXAdjcOOsPm2IAnhEBVwCs9AXzgZF4AB3eS9DJDziCS2/7f75NXv2Q23QZxJDWYGeUsyb5yXBvT+f1Bmjxo/oksCAN8GKTIGLoH2uJR+dDLWHS6h114Hvm+W6krxuvgTFz30kXtgM4UmO16X2PnWsLW1eSkBX5kR2yHAK78B29NMk8KVSWZ17m7YjeM3pMHIe+SfQF5dtazcha+I3F/7ouga+pGWTLJPw52EsmH+zVz6R0sqNB12/Japo1MoDJ3c7wEOO/UGTf/pb2dc9FinZVlEaSRx+r0aqhwgKqU8iD8Iog/N1VLYXJqLbSVDf0YdyaR/gLddJnelRk/8yzGdZGC8VfWmdPLld+9v787ihyenFQvYMRPGL179mEyl9RO9C6o0QbUMJoS7yRkr79RonepcL5fpqHD36K2yE4v2UXJdtxjUdMhCgzhKE/fqlN1NbumNCLg3EHCVormHSufqIKOmK67F5ZSVUK1hDYJ5eyDdWGXQYAECrzYAdKI9IQvGuZE5ZRKeUprznj61vWo9J+YYJQ618NcV7OKA6WKwhZ9BGPOWYFZt5BV2cIIxK+eTaXDEWMX7lmY6+hJKM0ug6Rlhce1Z+WRn7pn2amwxShDZYGpYzUR7mdsnHjwMZ0FGMUVNKRyX2nIak9h5BucQRKgvFfu0mgodAgK/Z/OuXCw37+0QVbmI9QiEZ5Hdvp4YfxROHqLgR5Jbe39wJOuT3pKb2CpXzVjhJFZ16sYmT9+cyTdQGjLEvGon6JwMCVRqSXnygVj6enjeSlX3N3tbI+6obttRL09+pysoejU/3aBfYZnTw2W7A2DSoV+N4KMZVw4jVqOQ3ONheJHLgNKQ8dm0OfzfZNr4byKyRlSQy0pQ6u6jVyut/CvA6/OC2EZhudQ7RG8dk/qjgkfkOvzdLPqLmiOWJcJB7V+NpBQMd9PJ4AbDjg7VzfcEfeTDcju7reyFw2vA63eJUMAem05ubvSVN6OUTkB+yaZAOTZVuiSV+6NYLi7GBQQg6mJtQDiHQ6ebLmvmsO0gG1YRFZN6Vh+gH7/Mr4FtQacviQIDB+iJNVHSfTslAEYM9ALZ80fTBZpVdUBapLd8veriQbvKlUlBRA4p1EPnJlIWraOnR8GM/9eTLySki6ELZTaXNlPbseJAUrG6Uc3QL6+t7HtW0XFOG0d6tlJcX+H4YOpWVY6JV38Hyx76Y0G0TMA5FxWtBGkc2YTM/zXiipfqHXHju4/9XFfJfuyWWHdm0wEU0F543L8vlcQE6E7r2r6tS7z7EGc7eYTEGlJrZo76dQUI0ZcmqlX9PJneBlzCJIWmhZnXOP7oQFELJowsgyM8DLOqkuC711VOpHJj/Yj6Kuo2TqSvWOEHSChBKeHY0aloMgYE3mjLeYXR90Bgy2bUSobxI3GgAyZ4bwXF2BKIVwww6bxWZxt7qX+aHfm6dQny1EiZHws460OSN4wnyKSZEr9YqIygSJ9iIzxrNOEPpRVkN/mN7Ip1h/EzRM5vJu7oiaknjxKuKt5X9QjbUeKRHpgpOYpgnrhP4uqRdzSOxpvJHf8IrfHSg2yedXOj/YkP2QXoLlW6GQlwX7/01R/OnTCXMEWc2frrRtnYR1kkS9yqLJrxZOm1IhIFpXq4XBbs5neEmQ4XGVKH+mBTIPcowlmGfXRXC4dBfYhG8yLnyONruZYJGWBSEKIh9aqH9jkCQtRZZSLcDf1TvRgNKzelYIanwz/UpoICMjePvP6QcFQJcMF8hsqACM02VMP+zpQjssphlvOoPAtW49rxc9G7TTv4E6bf7JQcyOQ8gZppOcUBLtwN0YIr1kYqzYA0DvSlHupJ+N+w81rcn3A9dKIvFiHge2BX0nuh5cIqKEC0LCQqrUUH95ibZf3XDifgS1WldDReb9zxTd+r72ySUPgnXD+L3pjdo3FsLiP7BTyYPIB8Z8zsRvNiy1laRo3pOwR7V23nIqj84vwy1rvDffVJULO6YRCYFi4r3Hz27W/euzmfoLY2KPshBCbXRqcZaPkA6QEfEBGPVsu/12oHzbzqTirJSeGU91UvLTft/jROTgOFTdM/Cqzpqq8KPsx3EPIyCJ2NrvOgtQckhom34VMEKmzEarXWNvD8gI77HqNK+JcdyNPxU1ZoQS9R8dSZrr7Rs8bBTXuVuTRAbsYiXxN8jLHnc9yxZDynK40Pff6eAqSd+nC16Nw9mJdvJ+OE+K8pEVE7OUgX8zqXnVAnmo+zRy+AEdtL4T446XsliANcjfdT1f477BCJD6yCgExdPkuR4OOuwOlnqs0vbogCpYcwnQb33LEUv4hYLwbU7icG0qgWFJvYF1wyphg0qzu7CqLWdbdwWTw6R+GcDPNUdqbiQ05M9/gLXF0tm/PLiMOYQUb/qyOeqzfw0lm21YqZpWpmMFDHvRJieKnS7Sj4+Yygdvd31hP4bjfpINfg9pL7c8HRWbzbeWc30odxWWXmSBGkKuhBQiI0MKi7Lp9wdOncDQDu9V4W8GZQF/SlWykFbzzbC4mEThyK6kZpEQev8RcQedlmmJg3Ps9jDAtkdSViD6uZMT94UU+QCOev4fHJtL1S8J/Y3+qQ7v3merYB6766waLBO3j2xGSWlnHFJ1vYL5kF6W9FrK+sp9m45whJpmi2CQrkQQRjyEGeEXd01Vdv+JB1LrJ+jp3OGO3rEPxuxVP/qIbA1AI3MtjlNDwT9tW5B9M2eCRTAK4Oc5FD5PHhJkMSre7SwoGNAIAi8n3M5k4X17gd6B6oijqC9VLQWCorXSQ3uMOXzMuDaX8UnSWBSBxJkuK2RCzWckGCGctSAbHmiYGPkX/XjYJImH7HGmdKDSc1LUjarN6JFUeLuNaU0PhGy5ni1Jyow3AcrV0P7ffnVyPYlxgkJaLhV0X7DpHXy2RA99XSEtFt2QKX52uzcSO+PRHuZ2+fwcNzo6gKg/oylb4i5qM3QuRZZHPDPgjzgtF/XbJPuxmEEjel9SGX7cId8h18CyHdEGW9q+ub4/YXM0fOYPBJZ7IsCKVGcvaU0t3a7QVXGw3GaLkhj2yHRueu+yrE/oyUEPJKQOTMyhY45rbn2PBd2TdNZQr3Ot1uyLPJGe0IL9u5ys/XQhAEz+DgbWi8trc5d5AfUp4e1ZyVwUrDOBsN73921tKYn4lKKTdrvoY1JBKQsPKOIMXLAOs49EvHNI1fQcvQzd2+vlwSQmXX+MlMpB6EnQuFi/bMgUZG3qeQsL5jz41sxDRIwq7y1PaRRDf5dCmJ9wvzrW0PkTcRlA8OyiI39c5ZaEvi9d/A+glbpdTmQJXUlxx3LhgGYCaLe0t/HVzqSDB9EynOeBSxSy83sNZc0S6POvEWJE7JvUfeFV3klHtbJDkV1P9r5Jz0JBURpjQy7hSN/YODWB20KSceDVvjfHxM8aeSlqLf31NoW1kNmuew/hrPF1UXK7nlGIYKCGTQ1hJxIa6gmBhsVHx69TW96gRqYrJTs+1sFoxs3y2Lv2EU3z+0X29Gmyxj4M369gSOzCzj76deteqUrNPvYMq6/2SSHYOvbrWihVoXNV7E4nllpeqIWwNWHHAb1IIp3EhkxV1weWmmmtfN4G6wdGeIIFZbdeNtlTSe17DILmbyuL3SOH7LiVI1LQeoSsq3YlU1jRck/IYL3eqcrxK6A3+W3rD3XIyEemkrK144Lm9GAKbnIprbPex/3rOm1Ws5uGBZyeyRD+rzMZJPG9a1Bv/ij2hWOJT3IV7zFpH5gBjSxfjFP/wq1UQCeUKoBE2P1YI6tE94rJs15dPlE/OqVOFJE0wD+9qJv0rfEclYD5zqIyqMYLdfydlFhZNSyTiA0+XL87ow/Tlq6OOByOKn+h7ak4apKvWFlYJxeqBzmLIq9yUg9FW5maDLVmLFvrgf8maUbDO5UuVw8Xkj2U6EbVfW5f+nSROgE+TNwnEz7lGSiAgeRme9ql0cdm1YPiRrxvpSAgPVEv0bRNiBSoUE9sp6/Rwug9JSS3KIiAKKORFSttkWd2IpeieZ6KYjqMTwgdi8v4/69OAfpV/VeFDc5++J0bsObivbsId0iFiqd+Ip3t6V9KDBvOF5vQ0RlvbZkVkgClTp6nd7/ev0oFrvOrepcYsJdmDr8qmo65lS+5h4uavBmrMqx5XqrAZL24DPIRCYUlXvXu0R1IOV06jJTvJxaO49wXr7/gp1YiXO1yjZGbBKgQvIdgu8xDjrgBMfqg1Ay4DYS9f+eu/kHfKMSY1rSwVzoGIPoRkt1BLgh0YZeRY6qI21xG8J3ZXYI/lk0WtRZzpzkWY0Gknjle3Iu89PeegdnIkfaXNqLz31FGvyruZyi1V5TO5Te+diyMyoHV0lXQpQ/ljgNO1/lwlf6viWXfbfETKbkwRyDgNX6IwNo5sul1kIO9dIW3HTo9Jc4UnXJsiQDx0IL0p2aMz2e0/BkDmrarQGOtipkTN6phwOJMN+b27BVS1ab7xzvtcX7psLRDUX9fjM4IlhAhU9d50K0+YaWbdeyg74yeogWpuehnIeRtPDASMb9w/adX5zcwOSGSOv9dFttUCuNUXxeYqrc1tb+0fDPmP7ehF59M7Os+/30CQeL6ys8ZcmbjuRNhIe3K12skY0GDqdkSbTZ6eiWRJT2NnUkWVcXQHh6TTa5Ec6huCv0eWhE9lUv+CeCFakrvkHMv0A47L4az4UDuVXIO429ouD4ZFD4exFfQuyoxmYLUyUvHzsrUkEJgerDFyNrz3OITPgq3o4lWIBvoB9pIVrwvMOhPClM6YyMQ0RevSJ4wCGHGtX59U8qpGiF/j9xIuvvlRHhp7y5igHTu4fYn4xKf1rBS/P83w0oCMnmwhdfbLA9wAWcZ4/HsjhozkQxwZs56Fxmz4WMVcy0kexfW5mV8CvlA1VvbtKSDRg45wFRtMCJDQ2rDUEGlhcuyo1a41p+Rx80iCN6w8JpYiq7IWqNMRCigLSnB2s2neLlmulp9gWIkw6N1pou/8iDoq/G+A9KoUzDVG198CEIk2jUamnZjVYS6pppTz0fXyIn9GjI+QP3t3Mol2ugzb3BBvk8yNKLPLGsEkx5eH1XQlHcczE0nRlrbQwHW6YppAt/9BgXMdFxntkWSJ2Ta6CIzo659WLWBykBMOARSJzHwPXioIvNK3V1MJMWBOQQsZLSjttQ75iD5zV4RZTWHEnoPLO1Ut6hyEttWg6wPZ99aDUuvbHTkxLeCfSHsQ6PlXE7TVkaANU1+SsAfIEgWj45hKtXMyTD07C/VuszwA/RmDMg+8pXcXAbQZOzEmSKsLwL5sEwMUb9nYivLwn0CYSw54AOoSYX76isSy5CT0+7JPTti0JlFAbieyT1waBP4fX6XvOa6D4pBCePeG9i1wLDCENYDEBRIiSfNXDttjI3W6pvtuJaVthZXyPCwhHhrOYU3Utwe/n66dZqdqjH0nYgtOJlOq/l+qDIB+U/MGqnLQ0z7la4oPL6lq8Bctnk2uk3znN6wpJxUQH9MUO/D7owP36wpMr935OX+aAnwsG9EPEVg6j64lbXbnFeQIaK8PKp4MTyB/YcziXVClBkj0HjVL60uROCjm4uVS8qsWWj7Ut9/h+ZUfTH4eJlwOZLA00wkuIyGq32u0ZD1NHt+IbY+KD15IngGOa28gnuRnfnB1+sRZdJDxYRr/190I/jqhYYw5lHKKPdkULqOiQ4RAIfT3lG8JX/NRjzJwqbINh2X+j6pzlUq1G5wWrDXJoxms0SEdhJr5qIRZUKbZFMuNUF2dVXUdGKIgJYplKjgDmOezArpHhnfzfwDyBemVPPqKRMbTX4+1pnVCE8pfi8zhqFsofYF0Q8vUn0YfUAgnF9sYv3hvvO/3fdCz8IPef3voPY2slvofr62bi8b+Y+IC6mViukRD4cCEpDGHv0P/Y8on7wuj0A7T5Di/XXUGDPJdFaYB4/jG4j9k/ZRsB5neAdg2jIXY3PLC2lr3qI1QSxG7z8ZJW9bwp0eoL6ozoQPVnjaRcaWvvnYg+e5CoMM2ZukAtotvIzpKOW85kU5Tziy4vrxxU61PtRWdsdV7HQZFd4IVZBQINDfSlv1UGpmFhsZJvWJ47SBTpVZLse6v+Fr2Molnzax7uYtgD65yy/tXBx7KE1zQmbXr1NmATTyNU4J/lJqi9DTHnWjwztTiloXvsdEhhZvXZRDZwDiExrTbO2RU4NPRC1F1Y1g0eQNg8BauM8GmsSncIO+3MBVXHBl8GU6XTA8azdrsmbKE/PBPS2EmqF03BFEdForxpcanoYM40zad4EYW4Ke8VMStkgAYVjTFznfEA3PRBTx5mnN6Iv42geyVCPoK695qYnGfrPT9JZLydtqMUAL8bObn/Co4PR+t7Nvb4Cfy8SktkRJFq1w0rzMca/16bdZbcpIP3WzJhZPIQkO70xO5raX33LFrrXuFpIHGY9L19+aP1OkXDz6IcO5StGeIkq59yQdmLljstI8/YJWaTZyTp5oxFWh1y/YcOus0sjdoQnEyrYXdketwXEt6iE8rbk+5fB1Vu+yPy3YwkRNehnPm1cr3xHjf5Gql9dQCtw8SEisenG05/pKF6TLPMROQtyGS6W56t8kjKsJb94ZLlKcukfteDQkcOIKxnhQrlquxBQY2qEsaJCaf6RMmej0bcxYOAafgwfT/mt9Df4l3yx5Gg/TYl8ySVaN9LYXpd+h2EjHky9C8/wRl4Q87QGzb0OxEMBloanVsvpydMSNTrDvr+QKh3KLyKw7IeUe3PHjmQuiQsaLzD9SiMYJBIbwV2pzPqQLTy4JhbdUx5KylMBSNI2THqQ64qY5d8OfbUt+RYNV/Ahse+upAzjnrs73LvQkhnTy8wbgFEX19xnl6IhJnMTHCisL7dXicWWaD4ObW3p869lBGzEI1ZLfARybkVo4zDxGkW5LcEmfLoPmZzV6uknjuHOdXxbkRTrngduemsvRNpx8yCTh2PIS7UtXwdPHIEsnOzNCA1SP15Pu0tZHV6RxyWXFbsRSKhoKnVYj5mhkhXCL9aio96KN6bRVh1LQd6qOpMLBFN2fUWvzlmeQxmx+11Gg8CBChNAKjZF/yMr6gvE9EFC7jsWChUyT3yGQrZBnhzhPlxaafK8BkaDqCSptfpZLgzsEiXJhmCx98ktwOc45L5z4conZOPL1uE5B0V7cx+2BBK9yNBPW9SkuzzSq+aDWBmLt4IqK/fzeMnKAGM3V6T9IfyqruTRgCC5KySG0LdYStDMYNPL3I0/Z0UacE5kGwSTSuFe+bvlDrW/FQWeboAGQRxScgTfSODYEqxrR9GhjMexD6SR8BOVqHEuRq3yC9RvHcl8w4M5qlSIueZ7Q9vCcJvoFq7JN23BvxWBlqSQudImPGcIK1H8axrrhEuezjT6K22SfBd+7BaCqN4OL29G+83Vkh4JA5k1brXDB49mHLVfgNisN1+jltdz1qmKlnpmuJfQxYPof4l778khgQ9Tu0AmY8DWjb158eV3zKzug5fKwRVFFKhL9IcKn3QeVyLM5Jz/EajolQk5YZZAUCZCOfvXvk9VKJnnqtVrac8jQU614PFbPMK8hBC8czGhlaIMjIosE4Q6mNDgGxHqroFe0P7v5M0Z28sQIrifwfzGF3MUZ44Nyp8yl07RnjQ11Tqd6zmIW5I0QMsUkBLRujTnEoPdp44xC7GRTifv8VRSNbad2NbtqfIfIeFDQ3ua6DCYWUs2nA0PvjVGWxcSt0jFbvEt3IcVVj4UBXbpGRpFi6pD0JxFKRuIzN7DFAjo7RLVfheMXF2Yl2igw6JN/43/L0lB+qlDOQtvAzPswvOiEhhNhJUWsQyfyAtXnv2TRwwb/3W4M8GIX00AjUMLMNThg5DlEeHD9Z4KXEXo9wFpMUwxfgxIDHQXE5DLHedpNgNdoyW7QFIqTcgswZXYspQN4VyS9we944/MvtUfaB53Ih5mBoJpDPbQECjxUEdMD4ZWDloXzDgRbhm3+uw0HtJb7qLVWwLBLiEAPnFk6kNXlsWt44Ltm7ZnztINHzaKTvWSYbsAScyYYCoVIXaztn4dZ2PTx6zbvZcNKtDkvLmyzXeCSEBSSfaizsW48xnSn8MeXnDM8pIfg9y8vYuY1/sZXf+hhLFRbsNcnLUByP5j2bWVNYocgcOYSvkpD/RNtZxO+r3v5Rw9Ang7g4EsbuVFqtGk2nnvVCMvTTX88DjPu3lay8x28+ES2R0gSFmsJ+YExUh6hspM9RzYb/5XrmN3miqt4spYusEY9qy4P2bB8j0jZL4SuWnuuETP3oM1kRJgosLqGdJbi2WJKVYadL+ibJJO/dwIJWbUj8z3qxl348PVZizTN0GO2q7I6k1NWdjdzFoaLsLn2XTSvRn5LC4GgRcbHE1y1QLrkC69evsL8dP7R21F7iXdVkKV51YkFkShewMEg1O3LkxQHx+kPTpfIgcr0iDb3Iv3v1fF8EdAtSLY5bgj86yujA7U9etskGZY/GSw3A4yvtl9mbemAjPSB2N15A1k/d/8i1SSXdyKo1xVldZoibsvC9z30U0pMQtlZAULSLZSsotukVKa+bMklKNKIa9o4hBwT60i1cXtsW0HICisf7wqRPvkoISb/HsiRu6ML/CCwRxNzNRyHr48rCpKAC/Nm/gbXL9FR2yQuxzCe2UmpSNeWdJAU+kLWi6CcCuyQ+HaY2PHHrSfxeDhlZ1fN8nSX79+w2zS4+9eo0fC7IHEukr2cZ2iLrLrW0FfXTzRxyf7aocdZSXI/KHRil4qOV/VimN/NVMd+PmJzIy0BqSHNBO9mJ8FcZYHd75vDcDb0TDJVFyEZe+NqVywOPCB9lAPTVlEmuZ8nn88TgugF7jtAuDkDoArxgr+9u1YIpLQqX/63Qv/Fi+GBp7WyH8fQwVuzkvmFx9HRe3lMbhOEb29zXF2Nu+FDRCzTg2EFBZ0TsO8jxra28186NSXJ5wGFThN6af9BYX8XGNDnRnjBXJVaCfz8BkfRLdLRQMqHgH+0Nkm+NKpWqWXA0hqJIzjGSg2UpgD7ekeoifTVIUaA9XnFL7Qm1uGY4U/l/4m5FWTUwQsLp+Z9qIZ0tX7JmjBti/ZkGJ5rvwBKUHnCgpqDr4RqTNUymD+tHG9uTsCKO5hhQ45IpPFzbIoQVDO7SJm1o/eg7ih2pGBeONpykA2+hi2K4jquVfNhbPxjhF/WNHwBdlMiGvzW5rCnSmzMl1K6YpzW3DGVbiKquYP+6MIypBoouVGUwRH8/m2A2ALYnGCMrp8A1CSm6R6F9VjrXALZXaEzNj9f+eHlknxziD1L2yrbDJbZQA2WeWM+2IWiwWEcez3RU0EdpT6Z5ozUBznIG9Neqw8AuuTdSMqgiR0Td7oxokct3Fi3pT5g4OouvAQiSg3aVfpcVaJiZ7bWSlFY0b/TBFwFhIp8AKUyGLoznJfsMxkBe3LZr8GjptrE0CoGtDe5UGzAhU5QVNdA74e0ZEKP9M4lw9C0iWgVubm8VWHPKfrUSYZ7KO7G0469SmYnR68RQrShC1mprmKD+hSTWn35Mio3wFG+PVpimBJL/qqmaXVsXa3QSbrsqNwwGzP6bvzWgSbEb60Fq9RwzPfWuDE9zrVJzyTC10TpAPVMnwAs/AnuIZn3FQpPgChjn+kg9I5IByU7Yb+RhHcdO6DU4dBgqRCfNT4Jik/b1O9kl3fBVUh5n+XOGMmGpy3O/j2JwqVbxe6wOmj6UY7ZNgkH2gDid48IVZ98IFgNxezDGWfqlB/On8lrX0RaT7clqykXNxRymDxWBCyeeSmNWBhzXM4nP7s3y1v0IGiPqz8gPuOJLFUDbjq3+Wqjw/A7wjIv5YuW3hwHiCGMy9ubaHUo/JgEC/FO/YNPSApFjtsfwQeCobVemSythdDmSwExZvPYttyNhMyqAGKphIFs0nU+SrnfU9EAQe65sCwqQARRPzoEs1WZjjS+aACsTw8go8NFdOxgI8p7mSNmtq+BZaGYVoSEa4WaexyHnoXSZcLZmKHMwMaz2mK1ZEuhpghzJwiJYkfn2DdoxtdcIzBXFtpIM1XwBc8s5IASz9iNI4PBB2Wf7VZ2EnJUZN/DKeCyntdPRPARefL0aZ5JxrwLGPrn4Iercy2nQUtcILc7XXg5NDA41iiHabemeaAXd++dF8V1UwFOG4zmUniPkazBchuKCdgviVWMCV3/tFWzp9jTNkbp5fOOGx1+8zQ2sgSqLfN94MSCW4rHwEvlueFiap6CNFnDucnGvnK2zxTYAitKj4jY6J0UprMzTkZ8OCab0Rw7sJ+MO9ytoVRu9uOafWx2G19D3xai65QNPqmplG31D19qE6bKDML9qzHmZoxq4fo5OQzr5tWkw9yuacjGTQHoKYuwi4S/ay7OBwaf+sV/oSHyx+klMo4v149PsIA1chBLY4XGfselvs6UTRzC2W/6plzQnhWuM0zvx/J04gXU8Ad6yxXTVvBaRGnqC9ygKg6Onm51uUmBlA+7VRKXY0qSo/ZrRzyZlxFAb0/A4tTHmkdOQsWrBwTzLVXhbVzNtu1Tlnff4h2ecwGrdQ9CRBhkkbTwuNFlIqYIDnPl6H3g7gUrm9Z/SI+8lja78AgMG/L6upRFKESZxK/CjHpA5URDbAk+X8oSApgIAtiwmSkcAI6/zSMwpwarv+QeVgapxYRm+BT3QoslcCT7TGOLjUeFD2Na21bsK3b0PtEopD+jaz7HdwSnJx56rzxKBIcELLR5RwQSJp4wv2k7n9UtojUJPUTSSsFpBkBSKTO8tYsq1A5/37rS7j0h0442Pk3C4iS5e2G0d4jfhx1qLP7Vh0dCFfVqThh00m0vpDPOGcroP/+lrzjsaP289MUFmwcy5t/+posnh+v3agOTwarcGEIRvMsSCh30qRcRbO33BnoVtQO7z/z1Sut1mRhudoCzSCxiQs+jrbE5q3dRRX2sRRxW3Rlh4hbbEWjcZTIdJvSl8PlzzFP/ZVcvtPrnoqSZT7w+tMk/wwM0NOgfWM+VPRSYKRc1VMssh8dVyiaTNFOb8t9CsYb0lK8cGDHb20pUcpiz3TkiOWtux92iERkWAib8NO3GQgHTEm9cUy7SOkBXcCybBE4MtomCEbBERb5HQPcQKvO575qWFoX0Dg6URiXIK2uaSDXKv5fNp+WUqGp+7fVCA+wRR97CvFNZ4afBCa2FpZ/bmRmMe+gw9KBQ/FBCg9Nl2UzJhHVuJNEKw0fJ15WInHOR8+Ig6qK5WW/ybvfvOQcemD4UR39huqJlFuN/Yx5PEV57Tg9+WhEcKLLIbQX8FX8hfcwnTwpmjVdyuCdw6MLPs7lH2JOAhyyEPcRHzJZddhSnzr0c8CUskm7CkJrsdEwSe8CD5L/4v9wCLsCAQ0QpFyXw3aWupd9yRMLmNUJen/gswTHRY27skIRoujFafg7oMT0juxksOP4oN/m2b35DkHP4AcNZaVko3pGSOJ0XeO43ouhtgyBQpYNVG5eV3uT92yi/ZtwOVCtRtDNsp7gT5BSJMLnBBL6iCpEjOgOwSWCG3mBSpaaBzj6hclN17Go9V29OsvZjKMMRsgm6p4BAsyK934F2nJFV2klkwc1y87Phz2IKCc9NRqx5sPIASD7/j0Fv5S7BHy8Nk5uBk9Rxs9vLtTzldBw0r8HH55MOaBeJ0d9C8cH+vwdk08QFhwbcje+oOcxIraM/9ph/xLe2XlmOeQcbHEFpThrddMfzfDh+jLrF+15b9NerN/g4DkqRIVk3N0xVkeUs1O3Dyw/Wt3aAWvgTpls9fMpOlFI0XRIHCJ6yJzZGDj7m8graukn7jj3HWI5jl1KCEd9YJDXLdI+Uy+Zu88v6XsWlNKV+6k24/8FYAu05s5s8j7dch9xxCQDM5T+mYpt3ilq9/L1/7JfXh52I3tgOknNzKfLYmyJ2SkJdyXX1yrTIjpe7PlvlflcjcrOS60jn0/+CaJhB1Vvo82bBkIcs320v40V5InT0JnJf1FmWwYP0yyiSH/FPqiBuxyc3/bnAu5h0G6omdBaqWwQv0fWOx45qy8ej1edS1i4actzXcHlU7l8uasRd9Y5JY5dbi8FhESwfIAz9aOY8+lyg2ifY1u/1qiRabxrTDSNNqF9BLxhIlHErUXrhJJ0p0bHFEUP2K6XYdOfyB9rUZfJjqFxFZY7uQt1xPRV5KzdLaJvP+19l9HLbNVmScgGAJWKhP4lXsDkmwlNNty1pZ8nKPvsbGGnXICfiuzvUptQ1p1+/9vyw8XWRn44QnCdgZSmQkq+y3RVD9I/3MKbD9lOjnGWC57qzxOuDrxLovGPmn2A2gVqgWe/VR3MacSQa6T7rrKViOWt6MfOrvzsG5Dhact+9Z0jP92ZCWm+URkSlDpGC6pbG7tcuNAkv2DtnhUEfYapmhGn7/djm0fOQP0vm/4SX+/p832nE1/GSqBgHrug0lei13X6xateybpnXcj35Ej7IZtAY+NqhoCLNVu+X5+GXz3tHTVGAIJdbPoCW/Vivb7oa4OoYwuiMQ0CleFRbXgpbYT7YK1hJ11ZbkslIv9RhIjCzMu/mUr8EZDvHdIUb/nD36k6BlUVRvl517v4REpgSf+zmuJmGpNJYERsBfskpjd017l5enaeCMghqpOPpjMaRSOJjO0GTg9vF2QPIcJVsk+NiwejL8ckKzzp1y3qIjNEsgZ1MvlXgHFLyQ1biI221PIx/1ug85VGx105EyXQyLyLnJsF5TFFUErn33jLbEaDmyW4cZb9y9imViHAnmaxqxtMPvJ0bvW8CfASrg/CSJ94Joc3V1lqLaE7sZGWGFOadX4kbIPSuE5lx8vtwOMFRMHK4UWcElplRty6w9+MeEhKyilqEV7angJ26yDbj1hjpnM6yEZzGZXkJv+aK4Wbc//Dtztoxyyf1Lh8OHAHQYvBBCWCzo5v3nxnPhBdwiWoU9ymyAinnIGmPBnlU6ZX65RSwjra3uuq4Oo3QuipvTOQShASp+ct1Y984BwltQmax76rNuZbmJeVKGw1F52vp2S2y59nDGhzBbNzjdqXPtcXm/eosKKNaEc5oSNuZxQ5vKczglup64zx+GepZmzVUEhE/CHfr7WnQnN9TAvLyRJPFGa843e2pHW0J8Ki7ZXi8Zyubg5/zmaLzlD17PsE05RL5zytnSlMI56w9AOrjA4geI8EhqwNUnF2om6gq6FpITGY0uIHa0t8kkhgSpOPVTp9QE/9MeB8J9fOpa3bW0952lDv3d34YXUs+3n5zEZiwKfqMz3zpZmJIbaUp0mxPPUbJukw+Ytn4IARyEpFVRFHGGex5ZghODp1MNb7t1AnzwiMrFLhqzyHKm7lUNTaisehCtod6l6nLhQbzcU59N97Ia95ipExtI6WrCi8uvly7xGKE0/u1m4hYST59kP33vdFyDnVdMxpUjVV1UOuK0c9OvIevX7Dgj9rwI8H5yhWYbn/FxFKOf6fzNx793DWVVWllPHj+6NFgJTb4snOw7PR8FYr7s58xiv6mestZyumUhx0mgH05Fk2rRgnL1Q2xxPR6v6cJCDL4bh0XHkx842AMf8PsoqpRA0bll91EmeBpD8P3d7V66uK4BsS9FRveLZ5W8gQ0LLTM7P4ZfMTcGrL3eXSWCFfb19PDOtcFmc1IOm6s/a8ixf6m8ivh+rtVBrBn10kQgTbbea0wBjc88koh505gNvQfCqjITB+nYKa1CAzEUt4vSuvfRTIlxxilT9U9Ic7B4rZQMwX7nA1354FBrBxBOkTn1/wiHf86jrRnTGj8Lj+x4poCe7Gm/5h22Uu4eg7ITvQ+VoAa0MFk4A6vZ/U6Cful4ZnYrqS6rCnA1SWDb3ky32+cM9XVYhIwrutiA/aXPf7sVqLp5vA4KKSyzAmRduSDckjUjR10ElD/tQddDO17wKknONc6mogSOwNk1cTSNqk1fvXh+lWhdpiaFq0r8u9ofWiNYgQnpCg8KBwKKLGCtRMkMfcvIZxur7bi4d91lJTG649AXRaKv76LrpsVDeh3R+fI0lO9H/j/KXCEU7yz11Q0Y7XDC4nf3qDZmzWIDzsMYx0caflm1/s1wNgZC/TlELty28knsLBrw0G6q4QqRXafYKzlDgGEVRNCpT0oXa4SKZNf7OUKK+nVkw+bVBNyewURFhxPEIg1HXF0go7ECmM0R/pMbHXdQvoN7Vz/OWKoA3qYJhqnEViDEhChR/XrMxonNjyoQllN19e8iRhLGOccq9NH5rjKsDYXnWhsS9soqMuv6FMhE+UFMjaYK7SyYgg8URF+jTiFxIm44lvzigpsEDsR7FfKSqSsKEkzMFyFAxQJ1Al7S5evAsWzsQIBGg+3IsM16nm28v1bvd4NC2GgZBo13+eHZ4CHdlAz1ElQ1MUg2UpLPPfcv08qullaglmLH5UnFovSYK8PTeCk8g4HlqUfwddk3HUx8HjXfHEq4OVOici/iHxX+GTbYh8J/50CIUalyGmiFbR7yma212PMoTrNZP/e3YBlx4ap48aIWBJE0uWuOWDqXLBz2MDxenics/UYGLFzJWcOgfaJMb1lpPNaJp+bnGD9TpRZ2MMAVDJSjplRJEGXjttvrek9w8yn4ZxammFchRJdnowoqqL9DaBhTLvKK79K0kKf54GZQAQhcHJOpcw135fhNlN+0yTi/BwJZNxPHw19neJSFlxt/IG7qJn2OcrVV6wY8n5x1EAdJxMCw9znu2s9jh6YDyAnaZkpqIlzfOPFRD6NHPuTDwWjlER9wAes1oEHI9Q8hXsSs7xMKg0/Z8Qx8hWCPu1tirTUBH44xhRLso5jIHYARYUDB4A0ws6ogNyN6AE8QAvMUbgHOLjECOpCS5c6Y9I8NutKsryZ8m52bygV2xYhXajH/57a+y0LxE5al9Z5G0kyvYaXMOaEFxkcwKdgvbx+zl3WbZXVmntZQqZUewocpXRUWDkJ3akPw/4mVpKeiiBAyhbsphEIks1GqJEw0KvrSQ2b/W3xNfTWqZgBEf/RuMiIdG4q264HYEoHbZqiCDbvwFSTq9iB3atCmOqEe9CTyOe/4qj6lfaax0YKzBLbooyqkqBOJqHZb1MemAgEV0Ck3bZIFWq7Pi6tbJgKU/6jzU4vaCba4OqOfgKkYwW2PCLF+VdSy8RFK0cTTwauvaqGwdb6rwo5yLELm1iuFTLQHbkjDjcgUHF0Jv9YC1NUqEmlnAUuxm2ZZjganWM7z9vWPkKGNtay8R9F9nOibMj2kQurqG2YIE1ZyYpCOS3A2HlB0gpx4ZFRZrfYNBTzUr3zbB53lRVeFzL3sChHdTEB4REiMI92U73pZ11ibXCRbqZbjC5KERCke9VOIfW3tdlrZgvlZgnMyA1YMP0viYHiwmCydo2uk1hgiGVDjCVIWWLwueemh0/X2E9vhrPq5wDsGxOfnnxfupCz5UNb21plP4CWB13952Oc9uw0YRL2Hqzw7Oip5ZC/1TQYDcxlJXCl1KG+cHSSTjGJpBieU3x1XWIT6b+gx6BkfPpuXOKzaX5nLKKQa6MjBSo0ds2jG3jcxLkZ362r19uKC0cN+yRFXOk8Fkw61rxVSeKte3ogSyQ/NuHft6icoBCPbtAQrQOQVubBgt9ySMK2n6kCIFioqxSDcfQENRJzZWKxEGudateQHBm/ilBt+Pa6b7thIMS+XIisWz0i7mGJAn0LjO/oaPV5GAG63tL0C67txGk3XkIawgFkOiY4OVUnjI4MBCnug5P8pLyg5wYBrwzGUcWE9Y2UXfmJzQGdAZPudwfI8ArBgqtCVI3GESoqUb4JL/eLlOlDnZw0oafYWpiPaVFS3Ta+w+eSMMgLTwiB9m/kVdzuYZTe4PTwklMTsVNT5kdlFe1j3rvFt8DatRiSPKyojIHZIf8OsZOrJHgVQNpgaNWgBfM+GaSNxQo9Z4RU0fYBccnjsiNsYPlZ8u9tSzD2eoLf7D0wD7l9kV1soUAvWBQq9+ln7hEnfO0IlanLM9R0VMjInStZB7bxfvZGw55dqwNrLk5YullMb9hTOiX6MKK3M7Ao/J24DIN0rleh6FWeNVeXOSp9/tyNMRsDLYrX8MKDGAA3BltuGBsHnLp+BPB0thqRU42IHqeLnIIQTpZ/oDbPDyLBi90AZ/HzONWkX2V3I7zhU2CzwXPm/Pxx0g5i/Qnm0o6Z3PcCQgfhiHIWNv4OnpO14dh+WVcZnHQQTUQzBkSss5Z5tg6I3EOrrKG7BFGEe9Kpq+4Sl6YxwzTOMTy8Qudowh+xsG82/uZzJ3vaIw7NGRku21AJB73VNUmcTjED1uaVMyuTNssRi6kPFU8BTwgD+aX/Fj6obp4CPtwACP7b8NV96hJsoC1vy/ysjjE4BiEknlseGlvOZUv54q0T1YoJ06wiRQcazNRiyJs2l2Y6ohiVD2ZLJQlwAT1vIM8tG6Gs+guzAYgDWu6bJctLMlbK2JAueAJxuVM6Ji9C8bc139RF8uiZwLP6V4FhETF+SKMMdLHN3I+AXezNFXn2p4OyFq5rGlbipKBCoIEx8r3cS5JXYESGmm7LiKd1b/+Q1gF5GEGHQavXze1ZQvwQ1kUALuCN09X5HKbqBi1Pfge6YJkObZXN0AaZbm/D1Ko3u2tJ+WCW+4YPAgCvGtM6cIraH3LwPhoAtItzaOC/hyfy6WWkfRTfC7pB1GBruaDu5HFmtKapTsZqCm85l8GHFKCSm+rqCy0L45TTfWNsm7JSjMLEJHKl124jIs38V+649HVzjiueDYqPw9nl49JYTNIzgoPu98zSlZUeISIlyGjLv0aeiJvlU9ULU2DLIsRYkkWVAe34rOompDP4MyWmPopA4zlFgITMhzpUE5d3/mxJAB4Uzo25+GFV/3Z4iGrtt8qPrK7zuxvcDrl3uic9Bh0GpvZbLS+HnFbt2WnQrjUhTytrvmZN2/6A0p0N26qxnh2PtJBetQwbgeG2urZlpFwyCiLq9LQ5I0xE62FMA5oLPYXve5Any0fMlx9RkFEzfQ2TjqomMPSUPyY25IqGxrt0qdaovEe4598MPGb+i95/bWO2mpyT5he/z8xZ01ZqMAJVIbfr+2n5yqa/BNsaXhMCA+jwrqSV+swfqEEPpSCuidGrKZJRMaNvrBH9VXQZoIcWUebqkT9DXAJH4IuCNmfQA7MnOsXJ9rS0EMxAHbyoZdwJ6WQJ/nqvQyMvZ1gPa6t5g4osC1GiDeebdXRP70NcHaNyJ4RmuSjWA3QZTukN4soBjCynz4ULlCQENoGv1ctGdrHdVHN/dhGQLVlc91LZF0XK6Fg+R6Wxo7Vbzu2UMOVG7HCj4WjkUjK0LjFLLIYYyHeCPAZuUGF05LogeZR4HFWneT4Ukl+51x3Q7I12iAhf1dFBejXa9d4wK7x/+fTK+IVdJW+calMYIJUZOe/4Q4r0N4HGs27ND5+3dJrzQPVXgsJblGQFwpvibhI2sa9QeOA5MPKz8l1JB5FLGNMpb2BdtAIN9lPdNtTYPXJVZNNKOirWMg0mjAL+1PcvRLHQm7fDCh2ZzDEwPXDZTBplkTARWsNLN5QwOPNKke05ODx0wnq1WkN2EVtXfrnJZUiJuIr+LkLU3Rk2OPdovzqqARqAndl9aOrzlDZIwVDXJe6zhnvHz6C+XZh2ON9rXjlGsMOQS7wVHshAn8BwOvuTpHymCNNet6Im9qQbtUNm0QNFMSucv1+EvYhfXY3/CHMv4s6qR6tq9c5btzAqiUzMjaKbj9JCMbuHzVjh7VLMHu4Qa+s3nTdo4ux2XFIEt6rrKCnepXeh3YmejY1mRfTb3A24I/k3p4X3fAPCEE9ISGVhNTxdgEYQp9kc3Yt4YopK7d2tHYMg7ca1i5nDM/YtgCg3kONN2M6+x9+mKCXZw2JO8w2GP4hlOjqa/ZBtuoS/xhWJoybo65wVuFiB5tSBEWP67rgZN7+bsuL5hh8QtQ+VjJPVmfvfZVlCFhOkaj64i5ZEyAT4KJOmVRdi6FhOouH9BeVsJogtUUFgnMGa32pCR8kEd1+EtypXDIgSZS8Nj9mmf5Do9DWlfjnbhnnXkXf51loojInlBtI+1qm6p3vcLek9NhGbCCJyFrXt0oDsF/TH3BVjr8CYRWPkCrdJzYAfeJzzIYLAeZC/D01Wf7Wucx4JHd7PxupsKM498EZt2/ToMTF04Cwl+Cg5vwnxepBm4DkOCfYVOTybnY2g7+oIMxxUVZUGRCsq3WfvmBioiwJKhxGDR0QnnknpcjVEji8NIYTYtWmNufN74cO3RcFRKvmv7nxVK/XPpjrro3W9a9x/F5+sa2gZV1JiP1inpEkAnQ1iI7hPxTWq9J9M5zLLbbIjviEJikEB/sm4IplhyBmakS7cGjKpUXoF170pQK8kvmg5pKtnX09jrKGp6doYN/Q6GvYG6QZytyCDuR/CyJJllnI+6LuIBwPJvVU3Armc06SBYEY9y/myfzQo8heUJ3+2epLQLNXimGxiGjDlFfHvXa4C+XZcmWY5Fn8sYrhPv8z2ITsm6MPfUPGW7j9X5K/O9GlNgPN/JQE1zfOwxO1spgr72NvxMoI/Qg7L64RPwGq4d+29y8eMDKKGZjnKim/KZEwMV1DeTD7Nq6tjMi/hWXsBFrOtHlQI8nBDwnu1lzsTmoXzg3Qms/B6j7XFpFy9a10v2ePn6AwLH21CdjjXGorOhuO9GudISrB5wMWUgPAtLJ6R9b6ZykZ3tEupSbBC1/iKIqqHdzcQgtGJ7NJLHjKytmSTkVd9nsKvgihbWdHQdbZ2tiy3RtiL3lOQ96DYVbKPgaKOPRJDgKYk5KcI6BcDu873PQxFrEX2ffyTDoLtlPNvZefuc8yDJqgaN5rmXiCubFWacFV7cQHgZvZP+Yu4Fi/cA4ogme+11xHyBA8fVTacsxn8IxorAsEchKRMX/WA5FTS0rgmV+/ejERrZXvJqbeTzJ87W0Wio2no4Y6tyq6S5JenbORvyNGct90A/5At/qyZdWqi4Yaa9xlCQP8e/SjFMH8mRKuk/HKPlYvJFiZDKWItp5mTxQu/lK7LxmVZ5Dpr+iNp37w98G+7Umnoh/ea6t2I/lo/dsT6l82u5xSjQfna1E0Dreljmhtf6i4nEhDkTeFDoI1MI7x4EQ0LTpyluAgWn0ywRbA+HRM4HYs0ebLAnwAt18bXrONtn14waOOo5r9915Q+exyFJlBXuuXEWeTmOZnZI5h6w8VKSMrXSUCJ01GKnzn1F2n7Vri5/Qnd01O1bFiTcB3itXNFjMov72MLFQs9vjL446sHXxotYZkKioMDcGNzrKxV225qecDRz8se8oCh2m3bJz3UvFo+NCf16MMwyunQCxkMWh7epEVCOpn/pFqjsgp9SobEMLudvXn4T8m5EklRoo8VkzWEFSa2DQi2G2kyCsYPi+xTy9p5p5y3XX3HJNbYDBSiDRyiN+AYaHasrTJJixzRpRF1vnDeA8DuJiEHq4GlCaJhVy0TsREZTdakdJSZJDHkjin/kQyf4dhH+UpjsebkQerukZdFd28V5/Go6PWc9M7CaIu4Z/ZbVO/UDNsuqzoUE83AOPCY/F7qgWm3NKOkWyP/+58Dwqc+1r9SZHzeAV5G98wI61MSWF4W1AtdXytLrNce3tgQsj4lhZNQY5IrjtRC2qrnBMZ1GtM+/qoQxY/7KS/qW3t0QPMGcbGSxkZMZbe1J3LPbWGf0SnKCQ+0Rd6wtx3u7gzC0yYaAwe3V+SVf18v+LTF/kdYUfOA656sXGC2lW3+ViuZvs53WLPljPGbCBwHOrBAhh8/4T7pP9B0inEtRAQG4zcLDWusiGWsu9MYx9RyoZBY9e1yCqb1ov1G5J1ytANd3pGoqIJXQfwMFds13gNUckYGYZ384J1ve0FDjGTPMjrO5r3mmpU03zOEZmtWYl6Kovw2VElYKz/xIxQi/LiamKmqjEkPS4uD9a8EO0uY3KLHyCkqNBr9jkEee2tUwiUOO2rKIO8n7B6L4qkm4XdoySyMhLUCjA3KtA8ejWQyIRbQZ62s4mvPJNjvXFB1gWnI3A0u0aHV141/xzgNxbXVMu9BBRkSvRFXdG7R0/YuuhWwc7tqxfzOjx56j6di3ny8/ZCWFwJ+FV1WbFjPZ8aQ8h8sSSfIdbI6XlBZhUPb3areoj6KyxdbSFnDmzwNAGAsGtyzcqxbsMmxS672/QcVoWv8GBprpKFv2traPbqXIkfq8+S0yTqHKVa9gjCqZlwUfU+D+z8nu0xtdG4ePIOHJVDr+9UGsnDHVONgCwi+Vnc4cCS0GbRxbKPEn5y2eR3H8mhS3FiTQC/wKyRyWyxI4eqpKh6JJSVKugKlAEv2cAhkkOBj0XJICh+SkXp7QMIpELF1ZbPikv3krsZkP413+Anz7qXpOkwrgtwFxTyM0GpSL2ZOHyG/hZF6R1Ymn7w5j92udK8lqeys2/jX0VcVFw4Lra19bhyaVme2NdRAlAKBaM6ElDl4cSTuzOcbQ9GkCf+Bhppimr5IHYGjD6814Moct2IOoNFEdY+d6V24697v6BjNRKGsF5IoHSyqybmIiY/RQYnMzE7T0So24ExkDANN3L7tuvM7K8V558B5kIyTfpexfN45VK33lpgL5h9/8ncVdiwK2d2Aw2nl7jBuM16rSm10a4HYEZUs+IOP/vcDir/Vk1G1BjZtUzjQ4LE4UbZFS0Z/cx2u7+fEHFyWgKS6VTpTUygUeZXI4sQ6EH3n9TnyXgebhmxPylkdRM2CUAiuE54rbc37l9ghadidHen2NipbJ7Uwkd/KJC1aND9X/rFP+Q4r8EM2YV2vu6ckNAEUZXg38uuGUVleD+Wehlz+Sz5xzD++n+BWZASwRpiD3RrCssiTLv1qN662QuniKAXb1gg5o8C4vswIInrU45Du8RF9PsLxFsK4Di0A/irIcc3BWegChRX3bpBaVlNg1EM8W3kvRNpfD3P7Oszskhq+2qfSGk4sHqyibs5kdWah8IbU0gbwnbsXYnPThj6dJFZ3svQZY85xWYTsi/Y1gmYUo6x8ESrmXsq2Cqy20maVQ0K39UHmqMVykdKasEWvlWisVN48/ZqLJ61Il8WKLRuf23c+1UC0ecL8K2c3vCQBldN0WPRinwL81Px6OyTJ6A0FAV6CgClO66Ap5sLmPtG8Hv6Et/v5x7AXevX5S2MFNULinhTl8VDsq4/QGI7iy3y6iqqywkNKBhJML71S2SyB296VL+K7e7OZ3TfzsgcyACCLj9b1KxBNQzP9YoMqgA5qY0dpQOh9EiBlqHPbyjY39N4wF4fRYTUwQQLSNtydz2YFWGUsRlQprh4nmr5hpQv/dUMLBzQEg1AlT6JSxE/WjYcW84jt/XwiTLjjnodVjRREsSbK9xDTf6lMUl/TOnYHlrTEGSwZN/kI4qt3lloc8YTBrTNVToM2W4tFsluWdZNGveMpDQ96xtLGazLiXw3iOOMk49+efqn2LG59rQns5aqd+YAWDhIZLTlKP1C+Dbr4xwdldLRiGu6fF/1TvYf3wblFO8FwfWn9is2Nfe0uTTSgcreq2vgZyRjGmBHBYqVhhBelJ3n8xzyexVQiutg3pICNbuoOX13LDz6Iwuivq49YFn8UrqxiQccWsTMVyqzP+NLl+BFpMAU3YBvHufvwkX5rZwU3g8x+NXXsXRfVvGOkWLC525Oq2F74wFxtN1q3i899djqTS96KjcNOcpOGHDCrh9ApwlEdFbZChZ/cHV+7/P8IvKw9rLBOdxp/MGqWFFJ2oFJfocmL4B0cWgfdEf8cA05+K1+wDQdp5DJbWu+QqYYdcM8iK8T1JTCal6UcYbmad9ApWrdzFVHwhnZ6r1Dt3b2Qq1SqkLYoXINHNxI8iuU9dehF6CKy5BULnrbRyA2uMLpcnXXMoPV007BfPbA46gRJyt1kARqBDouTGDUv/WEhX2rGbmJkkeZtMd8hDDxwq3A78hAaCoApo/oy3Rzg6lO3lpxAh8KSr0sAGdG3/uk3fekrkR3a+9V03bKXdcsNNT+9sIGCzcTJ9ZmfLpUxqlPVUM5rA4FtZaAjLksyFJfsjZAqhnbVmCLR/brzMSh5pho+lLSFjrFfQ/7ukCjQp01EbPjnjqO5pcmtfSpe1AAGT6Pja7ngB9eWnO0EcEQqAjVZKefEk79CRzjMD0FLPj35WoVXtj36XKOKlAwxXy0SIGMnNSqyHTGDETZvOzpMBpibENqtznHAPLxmfI3yKEBHZUkvjB6j0MUW6q2tlpcsaLKHVwxzFLFG1xDEsvMpB6C/E5T0wUjeFvtW0VHYrGl53Gk1dv+Cgusj4Xqa5ey3OuJqlL48W7bCTbZFx1DzlixnVHOWcfIGSCRuO9DyXEk+yltvg09g1Di8mTSoXOy0gAXPL3ntPPmkUpBnfV3IFxeXDMYqaAfRK4QPChgRAN/jRZ5KhDB2nyPEjz0R4AxKaEUMfARxFTUOc4YgRmIEJPjhx5JXbg03PH3mnm4yp8O0V8pyCiBNgbsAuyJ2Uvc3Wk5t4cZDdobtrl0AtiMOA8gWc4yLSiCuHjGBIGwYBXy25dNP92Z9/GvPE23fAjAiGp3gD8brzYoCjqRMsQflvWFlXQeMvsNuFCW05mnpuw9TSDZlk6Xk0WtebqmGZMYKQDMg7d1d0ocAZUofKhrTfmVP4Wck+DYJ4aygYU1Sv152lITNPD0ZcOpmsh/zMTpwabrkdBUxet9sVZStvkqyUtz9lgknNx/F+ua1eTC4L+18yuH3Xxb6stxHxPlpolOGlR8aY5LM5VTKduprz2olELytA5KnWla77pRCVV3pzOaw/C/ucf6mdYvrbhKBu2A+cuZSMcpSvXFqZsNdE7ouD1ZpCWVTj99dZOOBu7SperI3WsCvKjYu74GrZ+A/uTaRijqgSpSb55l9mT4dhXjMRafCyn78P3xN6gZNo1RCG4kiZ3m597hzZuf9da5rAQRUURvbde62M2T8z4MTsCg6kMyvTQzwK+ZrRsDGDjtlg7ljRYhwLrjfu6FgZ0SAo7Y0oAbbqJesHpgghZoVWYgSENFMkm4wOL+HVUjTcoWVqsZyk9i2ikd6S24JqPdehMyqwXghnELnWQN0niO9duif6ljpKVi9gPMuB6piyYeCeVO16VAKUm9p/s0KtJYSsHBnAN0kDFTEynC6oE7agEw2BCU2fOf+GcOen+UPxfcs0MHVEUQXMFddDE6gaiHGbkma9cvo5wggWFmq/v3/OcaoADkAWlE/ceVgX91b+TExSAqD14yzXNo1ITBfGhKCbdK4W73lJ6cKPVRkMQ6HETSk69/rXLjfPAFbnXG0QDM6rBMQtvGpuypR63dU1iipcTyRHo8qwJeVP7JQHPwSs08a8LA9OlyZEtKKuGdmA63HyNjPGWcuMzVpcK2cK6j/S1u+ecDnV/DMpJNcvFYGEK0/mtOdlxWqpx0S6z+0r2tY5vzqiBDKEu0F4l1dPTh7lusnlX4c9lHpwF56/ezyd8Uo8KbWtOEaMRJ/4V0+BlSxErrwzIRiOJxtTFufD/V9yeFS5fAKAexv0d5Zb1ePwttxL2ItX8gg2tWw/+50m6q4QnFwgsxGGRb2oyIkQmRCUqweo0Y8Uch3NH2SUEeO1U9+nZfLOuvu/omHJcJAN/FS/RmouwPljM0JB4PBndDYxQlKb48H0TqJD1PX1Auty5bEwoi5203Kj/UisWQLSOn/bodnUMqfK0bgnnVqkmLs6VPOuSfGV9dRTIsK/SDrgyM7kaL/+uaBBg27MoYSWDaAuLcjr28fPTxf2btn10w14IjSYFbP0pAQyykcmWWPZRaMzLywdeiGL7bufZe8AOBur/emgsXO4N4QGcRGBmC8xrjEqF0AIrZdaBtD6Ix9zZZ94W4ucwyUf5TqG9I7nGj/MkMHJCX94Z0FwytYDxAvrM9/eZdsxgo9/54H5EgymJ7W6+LNVj20uKAk+QOTcp5/55RyRzEVaHHB4UoG3xxqlaGwIn6qm+cl4l+k8f9+XkjYbb5a6ejuzto2xrgBNN8Bd4a53P+GiagPkprslfTWLzIszrvUVdbsrKsNGmAmmuTgA1N+OmISlem4rd2mnCCJnkJprbrMSXfmDV5KpRjw/6nuWWeAQjbjfV12Ap4LaUD8VmIOsoFmdegEtExHJ+4/WbR70eYqp/Q0NQ4Uk3YvXghkBeKL/I7XB1p4Oz896OhEF3cWdWuNzABO92kvbrr9RP4m3DzfsntIPGxxSRDMg54LshIXIeU49g4OPThMpxI3YX1a147YsoYbQ4j8f14th1O+14jdsRiQq6tOw2MBXs+l00jjD7/KE7lpxgvDRRiB7Ua3O0SJiryskUCKEgy20mDnmYUV9nctNUevUsVxdxVJUQhVk8JW/prUFM7lovU7Vfovm7/B6Z/GZjezefJ6z48+O+NACmwuxi2ybmaG0W7165J6JJBENNWXLSOfBh4HkvdSmoEr/tNyLHbN9Pn3kX19ClEMUnKh1z/B3DJRAVEIm0Z7vEaB0Sn4Zkv9Z2hYwe7Ue3Fzng8qtbvyEu8ucMwaO6WyLGJoRWReryqIuMsvXn2T85AKgDxtzqlRBJi+IbS69piwgSnPqqkAI7sdMowakSoQx/wBHoYxK4Lh1Fl4S8WwdDdj45gDH5My9Bzjnw8fdLUCpI5JbdME6/HSRHsNRexlaxjlOtULTAtqa8gIROPwuyoVCHvpa8ti8cdslE1aVLVvPOK7+MZ/YX3nJhCudyIeE+kvFbw74CqsoC++k1mSH53rXZon0Bc/f6M8rvnrPAX8RuiamTeUJeD8Mbl0jf4TqgEKUMS2eQK7JqhwOlE6RLEb0TzCGMOQ6wPewEqkXgqQGf9BIMCF5OarJksGOl03LanyvM2a6k2rxDqgMGAmLC4OgZGP1W91mArQBKZEFkeQJAz5sNdVeRdqMFOP/hj8ARn4gHfmKrXgKEtYWvw1wyx0+Zm1Dh1emdF1ZrIPV8ujp3Y+fU8L/fsfFAOGd7taUa4IV3WrsYg+NNdudxeDV/kwK1RRW6QcHreZrtu/pz8/lMLRU2IVMJnjrlQTJ56T8MSTm4vS8VnoTmUAdrui/o/aEbgzQjnn+v8zpEpRxpQOH1EOBqV04La9KG+WLkqsXEympqoqxNtQ7xa/JfC5B6/40DZX5di9nIUsosOuI/ce3DLI+q0jnxdZlJJYjqY5cQhie8sE+ymHZ19CX8zychYUlT3qz2QFs3QFfge2w26ysXotux7ZqyFD6S3MTfxb1AusoarvgHsu1QZFml6MAacppXscLQriXI8aryLGBd9R6KxzsYLEjrXu531KkccWzEdpI318bDXAuLLmAqrAojyejMhcgqIZnxZ1NlUqk2JwnRlauhLgIs2uQdRc1icqWLJhSdt+EPilfSx6eTU1XsSkKE4idi6FxWRw9BEhC7eb67JZ6k4oxB/Nzb63ZyFvwdGJ/5D6BjM8+M4UVDVoM3ewAfo5NK+AKFvdy0yafih0z/+c8M4zoUTK+vXJCwVnqqEqN0ewlSJP7wsSoxuslx/gf65ug2o8+MvaTB/E8ovbdMOZIxrzy0VLU5co7QgukBxp0OOQfCVkqKyQF7+P38u8dcxN6w9mEbwUek28XnHmwVgD7rjdGEDHyNr/K0UZL9OBLuVZcUMKdwFoP2rGiTF3bgt+eC+J/l6UaANkQHUg5HrOeVi6WwHU9h2XdJDLKdB0/AW0jc2LCho2Ln3gaLW8izBGLyAsu7emxmgrot4DC0SQ3RKlRsbDiyHV+Ba3re0NAr5DLZxDZZYVPRbKXsiSzz+aJrRTIYXp7xlppHNMlWwtv5ch1Mz5UFU7dMmv7uRmjQqctmWwbK/aL0m2gUYwQxE0+bvj9K+qawpPNlVX2Xh/f7ki8SVzD60nAcA5jXOjS8ttI2I2jCw99DduCdcRbb1gtm5kNfMfc621FA3DvQ2qepP3UA/Z96YzKyAZkCtQCeH3cUfqtcGraUNgfYTduEpFkU3bLa3/qxKbi9S4t0KOoOpTm2+5PqcE0j9SpC6sUCqWWt2f0NZxb2zdnCVOYmVKqTZtZRcxLDyfdVUTSYuQY3rmoxu19ii9fXnuG16vtzcWMo64RdHC+gm7/02XBaHoGPXVufc5rm1Dpj5GGEoFcaiujWnDLDcnpGp7RVlTxEl1hUxulwCgk0K53NcB8jAWsbD2RTpyuoJuv95jD11smtyyOSPUjb6eKw8/quUzFS0NsaGnp8i0Q/k2iMRBEU8Tdbc4I9dDjaXGGqfVfoRv6XUZ6VcTty4lEtf141fqqGPmcPhmbD6xwiZlf0u5zzv6Esks/is2ILuYWtG/74sCdWZMWOFS7WK4V8vvoEdbTBUUhFQNyVpsCGmczzyZOLpAY07rxJ1BAiIzZ7aU/KlYpyBol6j4Q3IB33skszEHxF5C5ZdBfnwro1GVYXDF/7OnMJxM+H0JKJO75NZTjTsjOKJLRXnAk2Ruq95OQhoMHZKS5EEHeJeD5LKeDPOgvasfKl4pBLbJm18QIUVNlrs/JyAQGiXXq9Vni7sw9DPEF3CHnu7McmafZXeFWHF7poH2dMfU9V8kUE5/VsfABMuFUB/bkXHOe917m40lpCCxpqoXKB2Y7ifj84vbGyiHRhA3hFlwP7V9BlyxduO4VYJ6m942dIy12A9uZ1vi1COwS+mxNVOvJdO7v0mFsMNXYB6KSbMfyA7LJOO6wPc4JVFJ8L6AIPPjbojKlNIzT2341OkXkg2Wdct7x0G0vPyMRzcFhlrOkZDFbfAG1DD/XXIb5LDBvJzGO/n4k2hyIvtOCAhNrkPoHJG8k5RG3dbqwtB4w2hgvC+msjNgdoryRJiO0riJ5Oc9RMhEdrUQuWLUDA1PCoyPW6JIxDhvUvbWeBJ5eVHdDYk0eA1vRsbYJRQaky8inVBo0Bv23FI28LATPsAw+l/ul/9XQJTM1VKnHwxWCbq9+fSkGoZ7VjNUr7J3W1UmZLApgIIDvL8KEyiQLq8ZB0ykLu4RM1aX1klW4FsSIy3xWLGosDAQRatSaQbjJplV72FxQ24/RfDvErDpT1j9dsitTkg6xGI7Pnk11LlOGyu7xfB5pprGDlFHKOyGizPojuZkJRhbzLKaeYV9eaiG803rbfcELyvrM0UXducduDwBe94afC8m6+etkphF04GskYjWwYhmUPzKOfGgYboN+s/104sx+XHd96ChfjnOx0fN5SaIMvc22n1jrYx2/QN08coAU5ZG8JPKHRImZH7PK0q5y/AHkaju53LhF6G0VwBIORfR4962mHjvl1Mx8BCccOTQgyQMt1YhPwYPDBK8ogpKWAHypCzQdHqZN0D0S31TLpVcVpXIerHF5zLUY0u82mTfqBHjHiY1pgybrt7XoROa9AvXHctcZNTXqk/2GPUzJi5xzzN9kWnHDo7omm6V7+7cTvWUTsQhYvh+qiO94S1ILn1eXJApJFXC76BY0FFj5hb5v78MWAQpVD9XqJLaGsMj4ON9UOmQaJeehrhQI1kFzmhCURx5B6bVe0FeKOGKFIUjCkFhCAUVNgXvJ/7DdX3uNSM32xzZYc0BzAO5CH32jqloOiA9phfQbDQTe3EnQc/eeOK+yh9vjbIMRvci8DheF55RJEfBg6xLSWxwK2ql0kj+PJNye/SANPjnYhkTbtt+EkIYaSkwe1KmAIQGcFTqO5i9Zfwwdtoj+3MkklCW6hAdbYnwODC7YEZdOh4svM/48h3vvz44Dd7n+C2YZdYBuL4cEmASQDz4f2BNsVcuFm6Rm9ofi/v+Y4Yy0S0mohe1uoum1oaKADbqduiwbYbzoZM5fZOf5lwqjA9nD4CiuyxLihE7u84SthL0++FM39XYaHPfbWZOvTDeYMn2sQUvOm+4tKaGSM8kDZ2gbc/5QCrO59nagxW84dO+gdrUZMg3QUn/WgvUq+W9RJzf5pESe7ikUEYq21XcSYjoKpYyW+m9kwwzzRM5T7vjKNQ1dXoTdrl2Wq4pDgrQg9PBYHeXLqwszqhwIOszZEsUDrOhjvtLYNIE5K2kd+MFkaIAiWLpM50+/JLllu/LmMRMJ3TZDXrcbQfH/oiM2HfpKLPUNtwTn3oQgXSq6fAiFSKf5demYOfxXujBsdSzifUl/0jQtZowJfFk08QIIUeJtbzH21b0hFzJ4dvid7iXAzFdOOFzXSncVJcrxofEnX6wxhYUHa5CYstCzE+CjC1q44Dm3aSREdis4pO6aYK469WU0wAE8H4KXdSOHLYLAmTegP654fMtjkvASqzp1D/tLqBE6L7MFNhL+395hx0AtMJ6f1ZZsn9CDWE7/t5aEmNGtkzFa+p0Xoi7LRhu+vwBpMFa3C711ZIvX0522E+Uvfyotuiyth4uzLMvcX9aREiHbnkxtV5sySpOvK7qyHrmBokWJlK/7NWvfauexCE7Y2v7VbXT1hAhz3J+8rvXRBfYmszZ3FDk12HK83RjI2LYA3g6a8EECtoW+52nPmlvr/8BzL6z1f9hVZm4ImDER6DNQTaleHSv5b+LPG/7dw4i5UxsIk//AujQYzk6rclMXF1lv/c2PUpjVvANYglW2DI8eyatcIozlvy1zYPsMWnR4K8ug0rbfcd49Iacn2yYQ7cQ2wmmOjO2fj6kgwB2Z3sLHaayXjUlL6W/+YTJQpGf1IbbnXBYD/L+UsVSk+OglLXiiIGxKoFaRby+71PiOtIzVifDubDTAjdRACdlfcdxFl47cYKq0J9rdi8SsMTGc3xwOYi/SqvWQxD61E6ozewX9xcGTmSlRfksIPXsPC8uCk1J/bSQ0aqRCLweAzhkARS4811J5LTRKw9orn8cm2m/nVaxX68qoz+Nrh94CPnuYjIfzfZ2ZXb2nqNlogw4ipQF9Zd0cORWFrLQLlDKPesvdvJ3DDqyxcDq3xrr2YGZY0FHJu3bLzR9TFDDKkeoJp0631fVtCmEAMpwDO1rFK5iVPfa2l3nom4/PBiySiMoMFpUsV1gMRMjSjo9h7SBHgj1AWRjEhzsJEAx4TIXa5Idy4xMPW4pAZNLC4wNDZY49pEqTuHvkWDfBGEIAuSPZQqEedlYK9pvKVS1hbuwDHzd0urCNWxC9FvP49HmDI/nVwYyTnwjk3RCFjk31m/74yiZGCDvZSe7vD0yWVd26tVC11ls7Z0c80iQHbs+/MJLXVa9bBgyx37X9HS6vh8OkvqJp4DEnBH6Fd+7lGXw7+ELzmRj2YSLSK/+H+rr2HUWJZBJ1byKp9aQhxRLmj35GvGPCftf0xKBNpIF1S9v1Kh76rW8kOz3QI/ReXQ9Mz4FvlOEUw3efvk5XSPVJ+Si7uVsymoWh1J/6CKDQPbMxNeksIA5kvl/V//WB3X2JwAtHWb9P1Rn9B9qqnQZG273fN529PnyYGbVL/Z1kWBL8EVlSV/wLGz0QrLknH7Yq5F3d3lRwgLm7p3oN5Bj1hpIbLFprmZQ1f2syORE49ZdPQ+p+tGumxWNTG3EWbJAHqJO5f0aTROpstmajb2I//5ZX2Mj0RVVjWmCheY3R2dTDC+rqtK6IKaWr+r1oH/mP0evJgKZYVdV3X0cJ2QpOnZcRARnz92VT2uIvcQ9PCLl9OHnJoI5Yyw1tixYKVHWvTd6e44rFWYW2t+3iUiM38kDge9Xxkg1tmUntkGq6gkk9T+IoOZzymlc0wg2+YTj6/c2q0cjm1IHZalwqLq7HGVmBmtdV6VXgn1ONQfI77kVWu6XicbIibZwtzcrGk/tAeNOSGBhLWnocm0j5ZMl2rXCg9Xxvs7cBpmcou6Dz+pINzYtb/iyYxeDzKPT8u14vJ25eLMEq/LW0Mx+jp/0g/NPorAw2ZJ4yKES4/ZT5wleR8ZNPungSCnUQ6oaZYG2nEArSsGPe0kVsZ7tgaudpmAK8lY4d8dcW/Iix6BeOfB9eEv8nwLpCa4Ay3fDT8YZKOGduSK/Rw+8VTqJ0j53h7KSB6JPje/j0APX41scuhKFrOdr8oS8+XqwoxpkDCAi9TGhFE9S4LzJ7CPxN48RUYY4OZ8T3xduXMceRhxkagJgImF53ZTMzSqLuSZiTYjL9ntqt4tXZLq0eIyUAKXRGIV0WTJtowu6O8wItfEgeJtq0F6lPkywGg50ieNP4/fAomStvuu3cmNxNM8E7HEEx23c8nb6hSTjPl6FSP17Wa+kBs/q4A0TloFS10Cx+67fInDTsaW30+jYuwEK+2Eqfzj87q9rskoyuSrq37efDUZvmgxP4cGtcAa1NCMYGkfb6PoJesYqREPOd3q6UM9wJueYfO5y0BosVRWb8hRiM3zEg6apAzP0C94jQZVsTR1Bcw9THNuAnTpBiRil3JspLufy+UCsmEMzWCs2KddO6Uozfg4moCGaKtla8KQccuAapalsUthUIrG79k6qmNWXzbyXnC0SK27HzJIpRFy0+QxnsuHVKiM6QLukSB0ncnFY0MIQdRtdMpdZN+PYjve3EKUV0hwhctOujzrnedC59K5hD0LmV5YtS2L8OYR7IKgCXF5AjHZdttLBlsXLy6YHvfW47sSo1suj8ExBJIraovG7KS6xR2+IozMpw1VyVDOSKdcg4HLHKUo1MLfWO3on71vrOt9K2VEmP+OlZB4gWdLNuSAreKlta6qZyBBdLV92J2jzKjoXg6by2qKHOAkbjhpxj2D1MBzOU4XmFXYZEprP5XgDdSfXOxpK/zTuj3225V3OqOAAYfkVCBGSudiJEQgtBPfo5QBVB6+tW3w5RDNDbH9pfyi/SdY6Y8UW1L+k9qfWvOAmY3l42ShHxE78rW63uzlrUSgY9ulmKq9Gs4JT+3mCfs0iutgB7uHBqR2ODARk1WgAuexev+cui/uFUKhpZ/I+aVNwHXDpheqQu2b1WxrCZZRFVuMSCEG2V6cCXKhX3awG2ialRdiq8Q2yY9SxUQpF6D5EnRiHpGexa6Gd3ccfUrcTPQhXK7LHLU4QBcGqIl00OominwsTsDHvuVxOnVcr4R/UKEZuJ3Ro5yuqugKqIjnGnXLsJ6UEwVo9k5IXseAW/dXqeyEFACtubYX8UurOMzukPP2QlmQuMe1LhIm6pgDeeWxFi+5d2ApdtpIBKIjAuBTII3aFknWdhzU+XTlz+wQfZaOT2NyBmTnti3EiHB2Ccv98N9+lKyngHxci22LBVDhle1co91PlH3bl601uLMmIdTUWCUiQTzAi9bNSd/aH/DX6GpePlO+EKyr37VHOwOwvAq67JzDfi0EUkoNaY4qj6uc8nGxWk1oTH4otWEObqHnDIuvGGAIALgLchr8GMw7jHLlytEFOrhoI5gv03dilxIY75EdA2ICxEepdsy/0UR2QSOLdZUiB4EMMuDo4ajWQUMohflqm4zqbI30Sc+H1oEZie/NnzjLk5uKY2n81EV7Qvmx15ESyrV28iVRf5uuGxBbs7XnGWZmXOqx/gPEbrR07BE4fU/kFMqC0N5is1yuXcTQRLFsdQtAtu5QqkF+/9kwz7/GYdaDMmU9OD9iG+6R+GNBjgzJgdo/KjaU4tiXKDsFhMg/BkLJfs+x7q1pqwoYj6R8KbApuxbVxkwPE+3kNYtPi7paaaKBvaZwXnzdEkgaDtE8ntfMTUTLOniDBeGrnrfwmxU2x+m8ipvDlhTs+jCofb2lSKJ0z/rIoHRZ3C1q3csJ9tEBGk9AsJ255I2oBb7BGZQr3ZCUJ1h0xVMZJnKvadg0yJmv7e3fGPSPlxHCH3FM9BhTvwi7nFyXsb6r3rbOVupvT6eVorbsOMBbr8SAVLVYNW3eGKp25oIEvk3OtrKbnylatMY4i06mG78Tn6C9VgvBI8o2JV2l/fo9nnqJPqjB78aayGYxX3m64ItwHVwqL54biIO0M7wZRy8GUcMuQ6vBLlVVmqMA8j7Wkcv+iZMzWJKF6s+WmiAMpBBR5BQpOZOu316jA7jqSFkMZzHCTt/i1oGjIydwoZBEY88qYWpMXiNXq3BKexWl7FX6MDznj8wEPNdK8/fYuMYayMOMxVL/uJbsScA9Y9NBGH5eVbc31ut8YE1zBsw/9+D4h2dxxFUxbTiMf2+F/1gvLrCkDXUSijOqwxPp4LJ44xmMJE/7XW+W9HUdP2EMZf9RXnMNtOHRtMdWC/RffCuYDCh2VY5snUwSp1lqdLcm/Hzl7w0mDl3CkBzsuYknmQKPSTTQfu3vjThZ0aFnTrGodR2j68+bpDeW9iNIYIZD2nF3eBG1G5mcGxkNDcEy7qQdSpiPH7d+PxPBp5apyPjAg96+rxl8UJgNgQGcYC6txv5Lz1wpvP5QWMovQC2Tw7K8oWi050v1PqRDOylDJDRtkSGMT+2uSEIyEyinxYnroL5jC9CuWVuXaASB9aSdVu3A6wHy/9Yhvk9QWSlJDMx1N7ITgCUp/ZDhrHgW40dUTpe6Ejbki4Frc/fcR9thS6Uh7d44OToxEtqVJyhvVCbRjQ0tUev+SZsR7M3x0B/2EeafOpkcwTr9fKdLwY7uuSee0DrHqMhi0shWe9kJyGMwJjKMsaB0nF/xFpkrpTegEs6QoW4mVIf1PgGyio6oE8LfakMOAjDj2XZZGD6bhwiph5m4sSBcKjf7NVKPwxlM3FPEuLjKor9yvuimvVlhINTkmi4e8hW0LnLSXyc1cNk5jb3XlGfS01AQmjWLEqWFXX6ARLBZMg+ji0TobrQeyqmxDhqWcEQacB4by2X1I8HavjpZyTRAk24Lyc+vgJDjIO2Hyi/d0VNN+zFS89a3HCwVN+WbhKty662fh8G2urNjiJ2MtTwYG3RO38xcs9GNCZ06cbpaCpk7lUU234UjAa7QFxrm856mHFxop3kQ+uVAvvSebrMbRFCueBdTemDRsKJL6+qhPFEHrdJVPXF0qgO/NxKsllDccrMsFGE33cOI1koiRQ/4XqA96cNql2DqYJbR62+VuRBcff2N/VNZiOct5uIa607b0RyBEvdLYuqz3muVrWkUGoMeuBy/FLfWjEi4WUIJtYRNr8SeS4ERIihu9OuTUwHtpRqKH3T9WDh5fzxSy6AV+0e0kZwFiHEp4a6Q44RYJP/lpgqFYFIEvbi3CYZlULpBYzWBoFm5VqvZyrO1ptmU9Y50dMD7EyX54c2igNG0l/V9R7wdwtUFgyQbcPNPGee9vtBiFIy5tmvyDqQXr1CX83VzhLcTQJ3PrzoDxOeGjfEteuDcizLjCtkPhKiVhdhCoD2cQZqmW50Uysoyebh9o4LcTWeNeodsyazz/LJzvAfFhTcotlnG+c+ogGLcw2OG0K6dtGH23rVUQXKmv+bn27u3xI42Kax1Y0NaaLNCt5eBZebiWFe5OrXzYu97FdYctHG3R01vZXs3foveTiPiKbBXY3Wr35NYD7UUu9kV8sdCTlSUhV296xWqIAIO1Hu0CpsOzFrkiZVDC4iYtEPLx6x/3KZEjVgRnXL1hn3+RDbTPV7UfGO/nlSH7SGEgFgsHX7bEuKDb4W30fUminGxE9ABVqhltvzNB4F5UwyCl2SG3Es1jLS1YF4eb7jAouR64FWNNS0ZD+ezgKSAlyPfq7BtRkc2jwpoYXiM9RaWiftWdUY8gnKJRPMxOC04kaPukMMpPY3A/tJGT4WA3thGvoiTpkChozSoFqjx4lSLvqWvRWJF0ozZif1GWf7x9moNXjmFjHfl+EAifTVvyl13H+zKKSf40QsvdBqU2ntuLt+LmGec76Et6Y6tKa36kKyvueq9O29UaAkhFeb9vforjLKAYI5nUSUt/jGbsftlQUg5wMTVDYpvCIFMZljG4z8uTc4ok8bXrDEtpo2eqCOisZh0o3X0vaDUiLR7uOZSXVFvChD22wGh/aOE7fnUKS4heXGZRWPZx8ap9hwMYBvUbTSdL2J4yvZDfZglH3QXeAdIFXwB9r+DQNMqH5sEtaGEKYR4x5pg4gqgm4gy2gtGzuEEySfzvbLGaulPld5Vtp3q+nP324pvcfFlv0i6KV+ZnJbvd/5Eo4lBq/2ugAmYrK2hjVLe7YhFB21rprro2njMGXf7avj18ySFxQZ6PdtQ3nUpyd8BwZyvdNVe+6Wf/+5YZkBY1s00U1iIX/NLt0JeT+nvwr9yCqkSzucy3iuEdxzd8v3Uk+cwTj3BNABO3RyDduO2KHcUAd4AFQ1uzzF6KqrfDUnkGktS44Aymje3UhGdECWWIE54f6wjCl6pm942qO2H2IlS0sbvvDjYIOhG7fP0UrlVou8ic7bvbm6TbQIVLw57WgdPdY/AI/7Bjt0ctoBMmbvFOR4URnDJG9VycFHEQEnt6/YkXKKLVCEIlxCzzYngY0TRfpF0k+kJ2bJHaJOxuKyEpABQUwnuUAEBg6/dlpOKhtJCs2pWyFB8GvGlg0IUZNIS7wBVxB00mb9E9AawIJF+sFBrDW3g+UqETbXMJRbowD8uksnGciojLF5Dj4VIh05YfsxvoG72sqCyHDEXWc4ernPKwCJxt7bJxGMTzzUOVR3OsowkDKBhRuNpTYCGlCttvaPWko3g/6ooPqe46pr1ULolAguotBjYK3MVTPwbhWGGzSI5841o6dkITjp43TkInj8SnEDnvn1ERCw6JRsPJH2R5fnVut7InoR7sHCPofwnarPwjSmRmlEAEZTXbhsEuI//3aUVqqcxoaIZBfsmY1efNYfJfWz6UoKNDgHZVr12qZ879WXGjc3g4BPm+uCoXkUFa5RlVwp7b9JxRfRDLpeI4rWEaNsdSTvdCHYF50U8jq8BpA99szguxW9GaZoWmQwJHiEZPW95P2oK0sP9IK1HeHm02kSuuper0Vjr42XjUA0sJ/dPEJRzaIsARxsGWNGH7KnJuk2+9E9VSsu59VB7pVoizlHf7NcPSoEjaXmERBR4YsuXaDTXzHoEntwE5aAtRn9OMUahEfW+dzBPv4PrbS5v9ETzPEPyk8xLOZDErFyVn3CcJWt5P5XOQkMXwqXNBVpoxqWZyJvSEGo8dfCAL4cFVNPV/7YL8GymygKUTLk3RfbX6/A2sZYl1yaIJHm32mf56FM4AUaoyQZ4aZJVVUi37soXdPmwTz2I84Km2zcuBmr7X6YpqTHVXDbNEnr0QoFiC7uEcoJzAf1TFWvDaWSGivGsV+tcPHEKsvRdsrXK0fc/TDRgeftnKn0HFYXB4J3BVYQIQNW4PuyKPBkZ7WnI2O0DfT35ta3dXBCkRuAm8WxOd8MWNW6Vdx6wN+KKA7hzUhsta7g+pNaDYHNzB9S15OpfI8b6eIjnFeq7e5g5CTBWmYFQnzsp85gDifYuyrxAK5UmEQGI3Wrb0E5pj6ttsboANybnPlU5jFhpaBBJWGFOULDnmR8eB/SU4ZagHaCYM66ypwMJ0wm43U0KtH1xN7CnglxhZnfWOHV/nsEpbjK8oGbEqczuLJq4hRxPzaUKSl/hLLTEKPchJXeV3Soxpdhkf0yFjI3vL/KST+jy3aR9LuF7BXN+fgomtUZPBQpRyJFwbPN2GO3SYt/I1SRNRHyQMjPwfA45aQM2HhH07xJoEGgnAhhLTwiEhG7bhIHykBPhp7H7mowvC6ZRFvCtuwAOOF2kmJ4cYe4/zRpXYu7pKW2RMBod4DLzGGGfmAScP6+pCx75oPnDNOTGr//Aknvmi8mxddYzuHZYHBONO3T7LBvjTRNERnGHDohyE/7Y6PMIwL32EVYAiG7y3j6ziIhtAF83Zny2JDWqdz37JUAHAffJ0vTQeVqZSRbp+9MPcmxhhsZD3OWlnMkBCeh7ydvI0jqPdvO48AvjvJTPul9l1CZ2Oyc5BNTFIa522NGSnzbson6ZkxbK0iki5p3TVH+L8e1g6biNcK/qJwnp68A9VpazQWx5ldSJsBkbRkTVzTIhH6VXNwAXcychWDiOmZv7t7/8d3YDlW4rlGNowY39QQmFj9v9AakdPZjncosBQt3Jxw2wMGDBX9bFKybFbGlA99a4viffZRj+J26bRZKrT7DpClOAGKqu57n0FarOwX4fjWq77XmJB6knIIMzb/osVwzdDi/zZq0X3Wajp4ZNNOApqGHVPjLiWJDt7YfNlGOInjw8ePAfIE+CRxvjmZzXvfJgW2Xfkvlu5lu9CTGbLaWIeDq7Ch1NDgotCkRlvZRxRd+MFxgtUz02Sj6DXnNhUa9nF5TR65LyFV1ginvbgQm6L9jZYg7d+6qih584+kscbrHt/2av6cECCckIE8riUZUA/UHkzwje2vZBlW9YfNE8mdD3Kx5QaPXCNxnWlR3m1+8O7tHxkJvn0EbCb6BMP4wbnX0jlTrqKGGcpcCIhDMRzy/AjH48EiubniFtnCzrgCG0TWRsWLSLGHINASdcNF4TD+NE6XmS1ZodxpZHeJkiYjgK0ZCs9XhCYlGUo4lnRhUEgHWeI8CnGYGGpcp+0lGPCyKc3KlNU1nydy04bzLRWOe9HnN3hg+52yd5BKzXMT4UNYoocO1qovEnzD846MTi9UpzbNk5ShzVxLw4sYZvLaZ+yFE2xepiT+aPCvj44PzsYRUjtTt/grOtnHmC0ApJMPAFG5t1QA7/czz61wha5N4qo2L2JlnGnYHPVQpomKNDzJ2r2dHRPhqdCkRkr1/k0FWeY0VwjNUGH1L9mMWtygE/EQCdFK1u7oYw736np++Gve/eTvBFnkG8ciMF9InQZtjFOv/4C3WZKfDo+2m746Xio6oOhkmbgQlVyzZFrpr89EuCeBDnK39FGfTYuluvryFfAria6VyGSzMyD9KIn4GNAik+zL9NzYxfV8YS5uk6hOOgwEZ8R33Dz0vZM6dk+ZNpfC9oHTCeRFQFrQGAHfXXa2tnxp6DcPgyiXjQDvILShZCEp+3841Jdc2FLFRGiYntKtzBg/XUFPATvrKVrVNlyoWsgSwT6+cIr7AEUj/xNezrv5bTjgmknpKLR2DirH3vG2vePguunMNOlxZ0Xm8ja9/XiG6XB2MuG4PJmPYffLNyE2jD6VEpQhWjs+IXRGXR7fHj01WS7MyZjI6aafC8CXp04jcNv81UV0G6KmPeYDi/A5u5tDlm1dmtWyQRQs0baLnHUHXHQx4gwliuh3FQv6cRErRh3FKSny3T5tNh4brC9XF6GLfEoWnQYM5w642ysV14fQe/tAfpXywfJLn6nhKNbt+aqE96FyeL1+db9Twi190WmmmSRlSdhj5CZTm/zdWrCtnd8HVCzrnPGhL0c0VfI69neIX4zN7SDTc7XBAoJA+o9Y6fgQDwu4lNyncbBK6h/YbdZvr4d/8IOKA4IcPpM5tC2ZABW8HfpDueT5MPNa6RoF0Vvdpdf8mjj80RNYQz5dF3hz0xxR/VsMQ+rGhwjSTB3t114PdgoBgncGarmWOC+Dz+j3RQaxSOHpcPnHxe30An2Xzm1gG6UKJKNb5L2RnM2p5ePgiW3MlOheO/9yXxrHS5lwvZ6aL3rdSwth4rcX4R/T7MjUSvbiKuJD5LlIc6jg9moStvNwQxgHxsToSS+n3N4pTL3w3/KzGn1TTf61F4qNdHOfgFTiw1lsOl3kPoIOiz5xxMcQZKI4FtvsSyBcoy03eRm1e0GbORE4iNKzT4cjlpesDiPcF8VBsoSwVZ2nRb+U5n4woDGsNXYse1yi8TqB2odL8K5tXqUoC6qOC0e08haJ/ugYw4cjxxbTEMD2gT06AUbF9+YVILqASwzqd+jVgYYQbKtt0fhsG22ILgIgYQCNEUTQRoggD3CbMUMFXIkLfqKpquQdqkSucoQFBLm4ki5aa5Re8FMVXYpK0G1NlNYV7nqytqLFb/WqtriBtVlCUrqhNh9f1AliH2lvZ80lGOE8pWxNFvwUveHg/5mVjuo/RoqnWlNzfJ9/m+hzJfUqc00fOurQo8Q6vy+EwA/C7OqrM/kCIrXrVm5SWWGdmhg2p/pMJbh37G+4iCuhCGidM/7ZGkgfM7vBXN96xLLlQ4jkHNbakP5KSxbe6/qIkK2K+W4Dpf11UWxbVNWd5w9BQmLm+Ohu85oysl1zAvNb7VmEXp/6Vd1F71Tr2U1oppOI8oh7lSEVEVbSh55tP2wd/CZ93Caf1qmiYTwIQPsLpzjeVqHU8pS0WJfW7Dn0c9C7pf7FJ39KpXsuziQXDoHfs/eBG1c1IGmxBHJsMgk9h6/DdAH+Bwuhm7Flhn1Gu/Muz/MYAGcM72fwz+y2VYhT0hvSok0zDIusiFomgCOGc4Fh725APvaSVlImWmntkyD6OOtcjgpqsgS15wyGDqVqcc3rrW19NmhUftC2zUNGxNJIMNV160Z2fTkIo/u8WZh6molPOklggayejnKxuyGEhOBYeBNkZ57LO4gI+XVYEqp0GwpKiPNkcbGKdLNWmA5fm4QaiGRh7WHDUkeFhJ/tVfkn//ZtyqLDgae7lcrpySNvseDqjdYrBnAsR3wXC4AszOTtbnZJ0nbZxIo8T/oh865tYELUed2mVU9rjJau/PBWrNtQYv1Spbc3nXkbR2YdqzQBjfwa+pmeg1c5TTtErQ3JWaDgCIVesrETaNtA4oO6oTHXlPn6M5VQv1fh3jnXQY3OY38r1xPKJB6h4M/hew5k9MeaYRNCOZH0g==",
                "iv": "662a662a372a1f2ef5d67b1b38b34db8",
                "s": "5d7f26f8d4788dc8"
            };
            let entities = {
                "ct": "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",
                "iv": "753d829ac3bc94873b48fd72c929a8c8",
                "s": "b2a4b34a599d6cfe"
            };
            let flows = {
                "ct": "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",
                "iv": "ae6ab4ad05a7da15205437c2ed4ab722",
                "s": "a4d409a33ccd3019"
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