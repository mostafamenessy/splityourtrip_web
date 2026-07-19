/*! ScrollMagic v2.0.7 | (c) 2019 Jan Paepke (@janpaepke) | license & info: http://scrollmagic.io */
!function(e, t) {
    "function" == typeof define && define.amd ? define(t) : "object" == typeof exports ? module.exports = t() : e.ScrollMagic = t()
  }(this, function() {
    "use strict";
    var _ = function() {};
    _.version = "2.0.7",
    window.addEventListener("mousewheel", function() {});
    var P = "data-scrollmagic-pin-spacer";
    _.Controller = function(e) {
        var n, r, i = "REVERSE", t = "PAUSED", o = z.defaults, s = this, a = R.extend({}, o, e), l = [], c = !1, f = 0, u = t, d = !0, h = 0, p = !0, g = function() {
            0 < a.refreshInterval && (r = window.setTimeout(E, a.refreshInterval))
        }, v = function() {
            return a.vertical ? R.get.scrollTop(a.container) : R.get.scrollLeft(a.container)
        }, m = function() {
            return a.vertical ? R.get.height(a.container) : R.get.width(a.container)
        }, w = this._setScrollPos = function(e) {
            a.vertical ? d ? window.scrollTo(R.get.scrollLeft(), e) : a.container.scrollTop = e : d ? window.scrollTo(e, R.get.scrollTop()) : a.container.scrollLeft = e
        }
        , y = function() {
            if (p && c) {
                var e = R.type.Array(c) ? c : l.slice(0);
                c = !1;
                var t = f
                  , n = (f = s.scrollPos()) - t;
                0 !== n && (u = 0 < n ? "FORWARD" : i),
                u === i && e.reverse(),
                e.forEach(function(e, t) {
                    e.update(!0)
                })
            }
        }, S = function() {
            n = R.rAF(y)
        }, b = function(e) {
            "resize" == e.type && (h = m(),
            u = t),
            !0 !== c && (c = !0,
            S())
        }, E = function() {
            if (!d && h != m()) {
                var t;
                try {
                    t = new Event("resize",{
                        bubbles: !1,
                        cancelable: !1
                    })
                } catch (e) {
                    (t = document.createEvent("Event")).initEvent("resize", !1, !1)
                }
                a.container.dispatchEvent(t)
            }
            l.forEach(function(e, t) {
                e.refresh()
            }),
            g()
        };
        this._options = a;
        var x = function(e) {
            if (e.length <= 1)
                return e;
            var t = e.slice(0);
            return t.sort(function(e, t) {
                return e.scrollOffset() > t.scrollOffset() ? 1 : -1
            }),
            t
        };
        return this.addScene = function(e) {
            if (R.type.Array(e))
                e.forEach(function(e, t) {
                    s.addScene(e)
                });
            else if (e instanceof _.Scene)
                if (e.controller() !== s)
                    e.addTo(s);
                else if (l.indexOf(e) < 0)
                    for (var t in l.push(e),
                    l = x(l),
                    e.on("shift.controller_sort", function() {
                        l = x(l)
                    }),
                    a.globalSceneOptions)
                        e[t] && e[t].call(e, a.globalSceneOptions[t]);
            return s
        }
        ,
        this.removeScene = function(e) {
            if (R.type.Array(e))
                e.forEach(function(e, t) {
                    s.removeScene(e)
                });
            else {
                var t = l.indexOf(e);
                -1 < t && (e.off("shift.controller_sort"),
                l.splice(t, 1),
                e.remove())
            }
            return s
        }
        ,
        this.updateScene = function(e, n) {
            return R.type.Array(e) ? e.forEach(function(e, t) {
                s.updateScene(e, n)
            }) : n ? e.update(!0) : !0 !== c && e instanceof _.Scene && (-1 == (c = c || []).indexOf(e) && c.push(e),
            c = x(c),
            S()),
            s
        }
        ,
        this.update = function(e) {
            return b({
                type: "resize"
            }),
            e && y(),
            s
        }
        ,
        this.scrollTo = function(e, t) {
            if (R.type.Number(e))
                w.call(a.container, e, t);
            else if (e instanceof _.Scene)
                e.controller() === s && s.scrollTo(e.scrollOffset(), t);
            else if (R.type.Function(e))
                w = e;
            else {
                var n = R.get.elements(e)[0];
                if (n) {
                    for (; n.parentNode.hasAttribute(P); )
                        n = n.parentNode;
                    var r = a.vertical ? "top" : "left"
                      , i = R.get.offset(a.container)
                      , o = R.get.offset(n);
                    d || (i[r] -= s.scrollPos()),
                    s.scrollTo(o[r] - i[r], t)
                }
            }
            return s
        }
        ,
        this.scrollPos = function(e) {
            return arguments.length ? (R.type.Function(e) && (v = e),
            s) : v.call(s)
        }
        ,
        this.info = function(e) {
            var t = {
                size: h,
                vertical: a.vertical,
                scrollPos: f,
                scrollDirection: u,
                container: a.container,
                isDocument: d
            };
            return arguments.length ? void 0 !== t[e] ? t[e] : void 0 : t
        }
        ,
        this.loglevel = function(e) {
            return s
        }
        ,
        this.enabled = function(e) {
            return arguments.length ? (p != e && (p = !!e,
            s.updateScene(l, !0)),
            s) : p
        }
        ,
        this.destroy = function(e) {
            window.clearTimeout(r);
            for (var t = l.length; t--; )
                l[t].destroy(e);
            return a.container.removeEventListener("resize", b),
            a.container.removeEventListener("scroll", b),
            R.cAF(n),
            null
        }
        ,
        function() {
            for (var e in a)
                o.hasOwnProperty(e) || delete a[e];
            if (a.container = R.get.elements(a.container)[0],
            !a.container)
                throw "ScrollMagic.Controller init failed.";
            (d = a.container === window || a.container === document.body || !document.body.contains(a.container)) && (a.container = window),
            h = m(),
            a.container.addEventListener("resize", b),
            a.container.addEventListener("scroll", b);
            var t = parseInt(a.refreshInterval, 10);
            a.refreshInterval = R.type.Number(t) ? t : o.refreshInterval,
            g()
        }(),
        s
    }
    ;
    var z = {
        defaults: {
            container: window,
            vertical: !0,
            globalSceneOptions: {},
            loglevel: 2,
            refreshInterval: 100
        }
    };
    _.Controller.addOption = function(e, t) {
        z.defaults[e] = t
    }
    ,
    _.Controller.extend = function(e) {
        var t = this;
        _.Controller = function() {
            return t.apply(this, arguments),
            this.$super = R.extend({}, this),
            e.apply(this, arguments) || this
        }
        ,
        R.extend(_.Controller, t),
        _.Controller.prototype = t.prototype,
        _.Controller.prototype.constructor = _.Controller
    }
    ,
    _.Scene = function(e) {
        var n, l, c = "BEFORE", f = "DURING", u = "AFTER", r = D.defaults, d = this, h = R.extend({}, r, e), p = c, g = 0, a = {
            start: 0,
            end: 0
        }, v = 0, i = !0, s = {};
        this.on = function(e, i) {
            return R.type.Function(i) && (e = e.trim().split(" ")).forEach(function(e) {
                var t = e.split(".")
                  , n = t[0]
                  , r = t[1];
                "*" != n && (s[n] || (s[n] = []),
                s[n].push({
                    namespace: r || "",
                    callback: i
                }))
            }),
            d
        }
        ,
        this.off = function(e, o) {
            return e && (e = e.trim().split(" ")).forEach(function(e, t) {
                var n = e.split(".")
                  , r = n[0]
                  , i = n[1] || "";
                ("*" === r ? Object.keys(s) : [r]).forEach(function(e) {
                    for (var t = s[e] || [], n = t.length; n--; ) {
                        var r = t[n];
                        !r || i !== r.namespace && "*" !== i || o && o != r.callback || t.splice(n, 1)
                    }
                    t.length || delete s[e]
                })
            }),
            d
        }
        ,
        this.trigger = function(e, n) {
            if (e) {
                var t = e.trim().split(".")
                  , r = t[0]
                  , i = t[1]
                  , o = s[r];
                o && o.forEach(function(e, t) {
                    i && i !== e.namespace || e.callback.call(d, new _.Event(r,e.namespace,d,n))
                })
            }
            return d
        }
        ,
        d.on("change.internal", function(e) {
            "loglevel" !== e.what && "tweenChanges" !== e.what && ("triggerElement" === e.what ? y() : "reverse" === e.what && d.update())
        }).on("shift.internal", function(e) {
            t(),
            d.update()
        }),
        this.addTo = function(e) {
            return e instanceof _.Controller && l != e && (l && l.removeScene(d),
            l = e,
            E(),
            o(!0),
            y(!0),
            t(),
            l.info("container").addEventListener("resize", S),
            e.addScene(d),
            d.trigger("add", {
                controller: l
            }),
            d.update()),
            d
        }
        ,
        this.enabled = function(e) {
            return arguments.length ? (i != e && (i = !!e,
            d.update(!0)),
            d) : i
        }
        ,
        this.remove = function() {
            if (l) {
                l.info("container").removeEventListener("resize", S);
                var e = l;
                l = void 0,
                e.removeScene(d),
                d.trigger("remove")
            }
            return d
        }
        ,
        this.destroy = function(e) {
            return d.trigger("destroy", {
                reset: e
            }),
            d.remove(),
            d.off("*.*"),
            null
        }
        ,
        this.update = function(e) {
            if (l)
                if (e)
                    if (l.enabled() && i) {
                        var t, n = l.info("scrollPos");
                        t = 0 < h.duration ? (n - a.start) / (a.end - a.start) : n >= a.start ? 1 : 0,
                        d.trigger("update", {
                            startPos: a.start,
                            endPos: a.end,
                            scrollPos: n
                        }),
                        d.progress(t)
                    } else
                        m && p === f && C(!0);
                else
                    l.updateScene(d, !1);
            return d
        }
        ,
        this.refresh = function() {
            return o(),
            y(),
            d
        }
        ,
        this.progress = function(e) {
            if (arguments.length) {
                var t = !1
                  , n = p
                  , r = l ? l.info("scrollDirection") : "PAUSED"
                  , i = h.reverse || g <= e;
                if (0 === h.duration ? (t = g != e,
                p = 0 === (g = e < 1 && i ? 0 : 1) ? c : f) : e < 0 && p !== c && i ? (p = c,
                t = !(g = 0)) : 0 <= e && e < 1 && i ? (g = e,
                p = f,
                t = !0) : 1 <= e && p !== u ? (g = 1,
                p = u,
                t = !0) : p !== f || i || C(),
                t) {
                    var o = {
                        progress: g,
                        state: p,
                        scrollDirection: r
                    }
                      , s = p != n
                      , a = function(e) {
                        d.trigger(e, o)
                    };
                    s && n !== f && (a("enter"),
                    a(n === c ? "start" : "end")),
                    a("progress"),
                    s && p !== f && (a(p === c ? "start" : "end"),
                    a("leave"))
                }
                return d
            }
            return g
        }
        ;
        var m, w, t = function() {
            a = {
                start: v + h.offset
            },
            l && h.triggerElement && (a.start -= l.info("size") * h.triggerHook),
            a.end = a.start + h.duration
        }, o = function(e) {
            if (n) {
                var t = "duration";
                x(t, n.call(d)) && !e && (d.trigger("change", {
                    what: t,
                    newval: h[t]
                }),
                d.trigger("shift", {
                    reason: t
                }))
            }
        }, y = function(e) {
            var t = 0
              , n = h.triggerElement;
            if (l && (n || 0 < v)) {
                if (n)
                    if (n.parentNode) {
                        for (var r = l.info(), i = R.get.offset(r.container), o = r.vertical ? "top" : "left"; n.parentNode.hasAttribute(P); )
                            n = n.parentNode;
                        var s = R.get.offset(n);
                        r.isDocument || (i[o] -= l.scrollPos()),
                        t = s[o] - i[o]
                    } else
                        d.triggerElement(void 0);
                var a = t != v;
                v = t,
                a && !e && d.trigger("shift", {
                    reason: "triggerElementPosition"
                })
            }
        }, S = function(e) {
            0 < h.triggerHook && d.trigger("shift", {
                reason: "containerResize"
            })
        }, b = R.extend(D.validate, {
            duration: function(t) {
                if (R.type.String(t) && t.match(/^(\.|\d)*\d+%$/)) {
                    var e = parseFloat(t) / 100;
                    t = function() {
                        return l ? l.info("size") * e : 0
                    }
                }
                if (R.type.Function(t)) {
                    n = t;
                    try {
                        t = parseFloat(n.call(d))
                    } catch (e) {
                        t = -1
                    }
                }
                if (t = parseFloat(t),
                !R.type.Number(t) || t < 0)
                    throw n && (n = void 0),
                    0;
                return t
            }
        }), E = function(e) {
            (e = arguments.length ? [e] : Object.keys(b)).forEach(function(t, e) {
                var n;
                if (b[t])
                    try {
                        n = b[t](h[t])
                    } catch (e) {
                        n = r[t]
                    } finally {
                        h[t] = n
                    }
            })
        }, x = function(e, t) {
            var n = !1
              , r = h[e];
            return h[e] != t && (h[e] = t,
            E(e),
            n = r != h[e]),
            n
        }, z = function(t) {
            d[t] || (d[t] = function(e) {
                return arguments.length ? ("duration" === t && (n = void 0),
                x(t, e) && (d.trigger("change", {
                    what: t,
                    newval: h[t]
                }),
                -1 < D.shifts.indexOf(t) && d.trigger("shift", {
                    reason: t
                })),
                d) : h[t]
            }
            )
        };
        this.controller = function() {
            return l
        }
        ,
        this.state = function() {
            return p
        }
        ,
        this.scrollOffset = function() {
            return a.start
        }
        ,
        this.triggerPosition = function() {
            var e = h.offset;
            return l && (h.triggerElement ? e += v : e += l.info("size") * d.triggerHook()),
            e
        }
        ,
        d.on("shift.internal", function(e) {
            var t = "duration" === e.reason;
            (p === u && t || p === f && 0 === h.duration) && C(),
            t && F()
        }).on("progress.internal", function(e) {
            C()
        }).on("add.internal", function(e) {
            F()
        }).on("destroy.internal", function(e) {
            d.removePin(e.reset)
        });
        var C = function(e) {
            if (m && l) {
                var t = l.info()
                  , n = w.spacer.firstChild;
                if (e || p !== f) {
                    var r = {
                        position: w.inFlow ? "relative" : "absolute",
                        top: 0,
                        left: 0
                    }
                      , i = R.css(n, "position") != r.position;
                    w.pushFollowers ? 0 < h.duration && (p === u && 0 === parseFloat(R.css(w.spacer, "padding-top")) ? i = !0 : p === c && 0 === parseFloat(R.css(w.spacer, "padding-bottom")) && (i = !0)) : r[t.vertical ? "top" : "left"] = h.duration * g,
                    R.css(n, r),
                    i && F()
                } else {
                    "fixed" != R.css(n, "position") && (R.css(n, {
                        position: "fixed"
                    }),
                    F());
                    var o = R.get.offset(w.spacer, !0)
                      , s = h.reverse || 0 === h.duration ? t.scrollPos - a.start : Math.round(g * h.duration * 10) / 10;
                    o[t.vertical ? "top" : "left"] += s,
                    R.css(w.spacer.firstChild, {
                        top: o.top,
                        left: o.left
                    })
                }
            }
        }
          , F = function() {
            if (m && l && w.inFlow) {
                var e = p === f
                  , t = l.info("vertical")
                  , n = w.spacer.firstChild
                  , r = R.isMarginCollapseType(R.css(w.spacer, "display"))
                  , i = {};
                w.relSize.width || w.relSize.autoFullWidth ? e ? R.css(m, {
                    width: R.get.width(w.spacer)
                }) : R.css(m, {
                    width: "100%"
                }) : (i["min-width"] = R.get.width(t ? m : n, !0, !0),
                i.width = e ? i["min-width"] : "auto"),
                w.relSize.height ? e ? R.css(m, {
                    height: R.get.height(w.spacer) - (w.pushFollowers ? h.duration : 0)
                }) : R.css(m, {
                    height: "100%"
                }) : (i["min-height"] = R.get.height(t ? n : m, !0, !r),
                i.height = e ? i["min-height"] : "auto"),
                w.pushFollowers && (i["padding" + (t ? "Top" : "Left")] = h.duration * g,
                i["padding" + (t ? "Bottom" : "Right")] = h.duration * (1 - g)),
                R.css(w.spacer, i)
            }
        }
          , L = function() {
            l && m && p === f && !l.info("isDocument") && C()
        }
          , T = function() {
            l && m && p === f && ((w.relSize.width || w.relSize.autoFullWidth) && R.get.width(window) != R.get.width(w.spacer.parentNode) || w.relSize.height && R.get.height(window) != R.get.height(w.spacer.parentNode)) && F()
        }
          , A = function(e) {
            l && m && p === f && !l.info("isDocument") && (e.preventDefault(),
            l._setScrollPos(l.info("scrollPos") - ((e.wheelDelta || e[l.info("vertical") ? "wheelDeltaY" : "wheelDeltaX"]) / 3 || 30 * -e.detail)))
        };
        this.setPin = function(e, t) {
            if (t = R.extend({}, {
                pushFollowers: !0,
                spacerClass: "scrollmagic-pin-spacer"
            }, t),
            !(e = R.get.elements(e)[0]))
                return d;
            if ("fixed" === R.css(e, "position"))
                return d;
            if (m) {
                if (m === e)
                    return d;
                d.removePin()
            }
            var n = (m = e).parentNode.style.display
              , r = ["top", "left", "bottom", "right", "margin", "marginLeft", "marginRight", "marginTop", "marginBottom"];
            m.parentNode.style.display = "none";
            var i = "absolute" != R.css(m, "position")
              , o = R.css(m, r.concat(["display"]))
              , s = R.css(m, ["width", "height"]);
            m.parentNode.style.display = n,
            !i && t.pushFollowers && (t.pushFollowers = !1);
            var a = m.parentNode.insertBefore(document.createElement("div"), m)
              , l = R.extend(o, {
                position: i ? "relative" : "absolute",
                boxSizing: "content-box",
                mozBoxSizing: "content-box",
                webkitBoxSizing: "content-box"
            });
            if (i || R.extend(l, R.css(m, ["width", "height"])),
            R.css(a, l),
            a.setAttribute(P, ""),
            R.addClass(a, t.spacerClass),
            w = {
                spacer: a,
                relSize: {
                    width: "%" === s.width.slice(-1),
                    height: "%" === s.height.slice(-1),
                    autoFullWidth: "auto" === s.width && i && R.isMarginCollapseType(o.display)
                },
                pushFollowers: t.pushFollowers,
                inFlow: i
            },
            !m.___origStyle) {
                m.___origStyle = {};
                var c = m.style;
                r.concat(["width", "height", "position", "boxSizing", "mozBoxSizing", "webkitBoxSizing"]).forEach(function(e) {
                    m.___origStyle[e] = c[e] || ""
                })
            }
            return w.relSize.width && R.css(a, {
                width: s.width
            }),
            w.relSize.height && R.css(a, {
                height: s.height
            }),
            a.appendChild(m),
            R.css(m, {
                position: i ? "relative" : "absolute",
                margin: "auto",
                top: "auto",
                left: "auto",
                bottom: "auto",
                right: "auto"
            }),
            (w.relSize.width || w.relSize.autoFullWidth) && R.css(m, {
                boxSizing: "border-box",
                mozBoxSizing: "border-box",
                webkitBoxSizing: "border-box"
            }),
            window.addEventListener("scroll", L),
            window.addEventListener("resize", L),
            window.addEventListener("resize", T),
            m.addEventListener("mousewheel", A),
            m.addEventListener("DOMMouseScroll", A),
            C(),
            d
        }
        ,
        this.removePin = function(e) {
            if (m) {
                if (p === f && C(!0),
                e || !l) {
                    var t = w.spacer.firstChild;
                    if (t.hasAttribute(P)) {
                        var n = w.spacer.style
                          , r = {};
                        ["margin", "marginLeft", "marginRight", "marginTop", "marginBottom"].forEach(function(e) {
                            r[e] = n[e] || ""
                        }),
                        R.css(t, r)
                    }
                    w.spacer.parentNode.insertBefore(t, w.spacer),
                    w.spacer.parentNode.removeChild(w.spacer),
                    m.parentNode.hasAttribute(P) || (R.css(m, m.___origStyle),
                    delete m.___origStyle)
                }
                window.removeEventListener("scroll", L),
                window.removeEventListener("resize", L),
                window.removeEventListener("resize", T),
                m.removeEventListener("mousewheel", A),
                m.removeEventListener("DOMMouseScroll", A),
                m = void 0
            }
            return d
        }
        ;
        var N, O = [];
        return d.on("destroy.internal", function(e) {
            d.removeClassToggle(e.reset)
        }),
        this.setClassToggle = function(e, t) {
            var n = R.get.elements(e);
            return 0 !== n.length && R.type.String(t) && (0 < O.length && d.removeClassToggle(),
            N = t,
            O = n,
            d.on("enter.internal_class leave.internal_class", function(e) {
                var n = "enter" === e.type ? R.addClass : R.removeClass;
                O.forEach(function(e, t) {
                    n(e, N)
                })
            })),
            d
        }
        ,
        this.removeClassToggle = function(e) {
            return e && O.forEach(function(e, t) {
                R.removeClass(e, N)
            }),
            d.off("start.internal_class end.internal_class"),
            N = void 0,
            O = [],
            d
        }
        ,
        function() {
            for (var e in h)
                r.hasOwnProperty(e) || delete h[e];
            for (var t in r)
                z(t);
            E()
        }(),
        d
    }
    ;
    var D = {
        defaults: {
            duration: 0,
            offset: 0,
            triggerElement: void 0,
            triggerHook: .5,
            reverse: !0,
            loglevel: 2
        },
        validate: {
            offset: function(e) {
                if (e = parseFloat(e),
                !R.type.Number(e))
                    throw 0;
                return e
            },
            triggerElement: function(e) {
                if (e = e || void 0) {
                    var t = R.get.elements(e)[0];
                    if (!t || !t.parentNode)
                        throw 0;
                    e = t
                }
                return e
            },
            triggerHook: function(e) {
                var t = {
                    onCenter: .5,
                    onEnter: 1,
                    onLeave: 0
                };
                if (R.type.Number(e))
                    e = Math.max(0, Math.min(parseFloat(e), 1));
                else {
                    if (!(e in t))
                        throw 0;
                    e = t[e]
                }
                return e
            },
            reverse: function(e) {
                return !!e
            }
        },
        shifts: ["duration", "offset", "triggerHook"]
    };
    _.Scene.addOption = function(e, t, n, r) {
        e in D.defaults || (D.defaults[e] = t,
        D.validate[e] = n,
        r && D.shifts.push(e))
    }
    ,
    _.Scene.extend = function(e) {
        var t = this;
        _.Scene = function() {
            return t.apply(this, arguments),
            this.$super = R.extend({}, this),
            e.apply(this, arguments) || this
        }
        ,
        R.extend(_.Scene, t),
        _.Scene.prototype = t.prototype,
        _.Scene.prototype.constructor = _.Scene
    }
    ,
    _.Event = function(e, t, n, r) {
        for (var i in r = r || {})
            this[i] = r[i];
        return this.type = e,
        this.target = this.currentTarget = n,
        this.namespace = t || "",
        this.timeStamp = this.timestamp = Date.now(),
        this
    }
    ;
    var R = _._util = function(s) {
        var n, e = {}, a = function(e) {
            return parseFloat(e) || 0
        }, l = function(e) {
            return e.currentStyle ? e.currentStyle : s.getComputedStyle(e)
        }, r = function(e, t, n, r) {
            if ((t = t === document ? s : t) === s)
                r = !1;
            else if (!u.DomElement(t))
                return 0;
            e = e.charAt(0).toUpperCase() + e.substr(1).toLowerCase();
            var i = (n ? t["offset" + e] || t["outer" + e] : t["client" + e] || t["inner" + e]) || 0;
            if (n && r) {
                var o = l(t);
                i += "Height" === e ? a(o.marginTop) + a(o.marginBottom) : a(o.marginLeft) + a(o.marginRight)
            }
            return i
        }, c = function(e) {
            return e.replace(/^[^a-z]+([a-z])/g, "$1").replace(/-([a-z])/g, function(e) {
                return e[1].toUpperCase()
            })
        };
        e.extend = function(e) {
            for (e = e || {},
            n = 1; n < arguments.length; n++)
                if (arguments[n])
                    for (var t in arguments[n])
                        arguments[n].hasOwnProperty(t) && (e[t] = arguments[n][t]);
            return e
        }
        ,
        e.isMarginCollapseType = function(e) {
            return -1 < ["block", "flex", "list-item", "table", "-webkit-box"].indexOf(e)
        }
        ;
        var i = 0
          , t = ["ms", "moz", "webkit", "o"]
          , o = s.requestAnimationFrame
          , f = s.cancelAnimationFrame;
        for (n = 0; !o && n < 4; ++n)
            o = s[t[n] + "RequestAnimationFrame"],
            f = s[t[n] + "CancelAnimationFrame"] || s[t[n] + "CancelRequestAnimationFrame"];
        o || (o = function(e) {
            var t = (new Date).getTime()
              , n = Math.max(0, 16 - (t - i))
              , r = s.setTimeout(function() {
                e(t + n)
            }, n);
            return i = t + n,
            r
        }
        ),
        f || (f = function(e) {
            s.clearTimeout(e)
        }
        ),
        e.rAF = o.bind(s),
        e.cAF = f.bind(s);
        var u = e.type = function(e) {
            return Object.prototype.toString.call(e).replace(/^\[object (.+)\]$/, "$1").toLowerCase()
        }
        ;
        u.String = function(e) {
            return "string" === u(e)
        }
        ,
        u.Function = function(e) {
            return "function" === u(e)
        }
        ,
        u.Array = function(e) {
            return Array.isArray(e)
        }
        ,
        u.Number = function(e) {
            return !u.Array(e) && 0 <= e - parseFloat(e) + 1
        }
        ,
        u.DomElement = function(e) {
            return "object" == typeof HTMLElement || "function" == typeof HTMLElement ? e instanceof HTMLElement || e instanceof SVGElement : e && "object" == typeof e && null !== e && 1 === e.nodeType && "string" == typeof e.nodeName
        }
        ;
        var d = e.get = {};
        return d.elements = function(e) {
            var t = [];
            if (u.String(e))
                try {
                    e = document.querySelectorAll(e)
                } catch (e) {
                    return t
                }
            if ("nodelist" === u(e) || u.Array(e) || e instanceof NodeList)
                for (var n = 0, r = t.length = e.length; n < r; n++) {
                    var i = e[n];
                    t[n] = u.DomElement(i) ? i : d.elements(i)
                }
            else
                (u.DomElement(e) || e === document || e === s) && (t = [e]);
            return t
        }
        ,
        d.scrollTop = function(e) {
            return e && "number" == typeof e.scrollTop ? e.scrollTop : s.pageYOffset || 0
        }
        ,
        d.scrollLeft = function(e) {
            return e && "number" == typeof e.scrollLeft ? e.scrollLeft : s.pageXOffset || 0
        }
        ,
        d.width = function(e, t, n) {
            return r("width", e, t, n)
        }
        ,
        d.height = function(e, t, n) {
            return r("height", e, t, n)
        }
        ,
        d.offset = function(e, t) {
            var n = {
                top: 0,
                left: 0
            };
            if (e && e.getBoundingClientRect) {
                var r = e.getBoundingClientRect();
                n.top = r.top,
                n.left = r.left,
                t || (n.top += d.scrollTop(),
                n.left += d.scrollLeft())
            }
            return n
        }
        ,
        e.addClass = function(e, t) {
            t && (e.classList ? e.classList.add(t) : e.className += " " + t)
        }
        ,
        e.removeClass = function(e, t) {
            t && (e.classList ? e.classList.remove(t) : e.className = e.className.replace(RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " "))
        }
        ,
        e.css = function(e, t) {
            if (u.String(t))
                return l(e)[c(t)];
            if (u.Array(t)) {
                var n = {}
                  , r = l(e);
                return t.forEach(function(e, t) {
                    n[e] = r[c(e)]
                }),
                n
            }
            for (var i in t) {
                var o = t[i];
                o == parseFloat(o) && (o += "px"),
                e.style[c(i)] = o
            }
        }
        ,
        e
    }(window || {});
    return _
  });
  !function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e((t = "undefined" != typeof globalThis ? globalThis : t || self).noUiSlider = {})
  }(this, function(ot) {
    "use strict";
    function n(t) {
        return "object" == typeof t && "function" == typeof t.to
    }
    function st(t) {
        t.parentElement.removeChild(t)
    }
    function at(t) {
        return null != t
    }
    function lt(t) {
        t.preventDefault()
    }
    function i(t) {
        return "number" == typeof t && !isNaN(t) && isFinite(t)
    }
    function ut(t, e, r) {
        0 < r && (ft(t, e),
        setTimeout(function() {
            dt(t, e)
        }, r))
    }
    function ct(t) {
        return Math.max(Math.min(t, 100), 0)
    }
    function pt(t) {
        return Array.isArray(t) ? t : [t]
    }
    function e(t) {
        t = (t = String(t)).split(".");
        return 1 < t.length ? t[1].length : 0
    }
    function ft(t, e) {
        t.classList && !/\s/.test(e) ? t.classList.add(e) : t.className += " " + e
    }
    function dt(t, e) {
        t.classList && !/\s/.test(e) ? t.classList.remove(e) : t.className = t.className.replace(new RegExp("(^|\\b)" + e.split(" ").join("|") + "(\\b|$)","gi"), " ")
    }
    function ht(t) {
        var e = void 0 !== window.pageXOffset
          , r = "CSS1Compat" === (t.compatMode || "");
        return {
            x: e ? window.pageXOffset : (r ? t.documentElement : t.body).scrollLeft,
            y: e ? window.pageYOffset : (r ? t.documentElement : t.body).scrollTop
        }
    }
    function s(t, e) {
        return 100 / (e - t)
    }
    function a(t, e, r) {
        return 100 * e / (t[r + 1] - t[r])
    }
    function l(t, e) {
        for (var r = 1; t >= e[r]; )
            r += 1;
        return r
    }
    function r(t, e, r) {
        if (r >= t.slice(-1)[0])
            return 100;
        var n = l(r, t)
          , i = t[n - 1]
          , o = t[n]
          , t = e[n - 1]
          , n = e[n];
        return t + (r = r,
        a(o = [i, o], o[0] < 0 ? r + Math.abs(o[0]) : r - o[0], 0) / s(t, n))
    }
    function o(t, e, r, n) {
        if (100 === n)
            return n;
        var i = l(n, t)
          , o = t[i - 1]
          , s = t[i];
        return r ? (s - o) / 2 < n - o ? s : o : e[i - 1] ? t[i - 1] + (t = n - t[i - 1],
        i = e[i - 1],
        Math.round(t / i) * i) : n
    }
    ot.PipsMode = void 0,
    (H = ot.PipsMode || (ot.PipsMode = {})).Range = "range",
    H.Steps = "steps",
    H.Positions = "positions",
    H.Count = "count",
    H.Values = "values",
    ot.PipsType = void 0,
    (H = ot.PipsType || (ot.PipsType = {}))[H.None = -1] = "None",
    H[H.NoValue = 0] = "NoValue",
    H[H.LargeValue = 1] = "LargeValue",
    H[H.SmallValue = 2] = "SmallValue";
    var u = (t.prototype.getDistance = function(t) {
        for (var e = [], r = 0; r < this.xNumSteps.length - 1; r++)
            e[r] = a(this.xVal, t, r);
        return e
    }
    ,
    t.prototype.getAbsoluteDistance = function(t, e, r) {
        var n = 0;
        if (t < this.xPct[this.xPct.length - 1])
            for (; t > this.xPct[n + 1]; )
                n++;
        else
            t === this.xPct[this.xPct.length - 1] && (n = this.xPct.length - 2);
        r || t !== this.xPct[n + 1] || n++;
        for (var i, o = 1, s = (e = null === e ? [] : e)[n], a = 0, l = 0, u = 0, c = r ? (t - this.xPct[n]) / (this.xPct[n + 1] - this.xPct[n]) : (this.xPct[n + 1] - t) / (this.xPct[n + 1] - this.xPct[n]); 0 < s; )
            i = this.xPct[n + 1 + u] - this.xPct[n + u],
            100 < e[n + u] * o + 100 - 100 * c ? (a = i * c,
            o = (s - 100 * c) / e[n + u],
            c = 1) : (a = e[n + u] * i / 100 * o,
            o = 0),
            r ? (l -= a,
            1 <= this.xPct.length + u && u--) : (l += a,
            1 <= this.xPct.length - u && u++),
            s = e[n + u] * o;
        return t + l
    }
    ,
    t.prototype.toStepping = function(t) {
        return t = r(this.xVal, this.xPct, t)
    }
    ,
    t.prototype.fromStepping = function(t) {
        return function(t, e, r) {
            if (100 <= r)
                return t.slice(-1)[0];
            var n = l(r, e)
              , i = t[n - 1]
              , o = t[n]
              , t = e[n - 1]
              , n = e[n];
            return (r - t) * s(t, n) * ((o = [i, o])[1] - o[0]) / 100 + o[0]
        }(this.xVal, this.xPct, t)
    }
    ,
    t.prototype.getStep = function(t) {
        return t = o(this.xPct, this.xSteps, this.snap, t)
    }
    ,
    t.prototype.getDefaultStep = function(t, e, r) {
        var n = l(t, this.xPct);
        return (100 === t || e && t === this.xPct[n - 1]) && (n = Math.max(n - 1, 1)),
        (this.xVal[n] - this.xVal[n - 1]) / r
    }
    ,
    t.prototype.getNearbySteps = function(t) {
        t = l(t, this.xPct);
        return {
            stepBefore: {
                startValue: this.xVal[t - 2],
                step: this.xNumSteps[t - 2],
                highestStep: this.xHighestCompleteStep[t - 2]
            },
            thisStep: {
                startValue: this.xVal[t - 1],
                step: this.xNumSteps[t - 1],
                highestStep: this.xHighestCompleteStep[t - 1]
            },
            stepAfter: {
                startValue: this.xVal[t],
                step: this.xNumSteps[t],
                highestStep: this.xHighestCompleteStep[t]
            }
        }
    }
    ,
    t.prototype.countStepDecimals = function() {
        var t = this.xNumSteps.map(e);
        return Math.max.apply(null, t)
    }
    ,
    t.prototype.hasNoSize = function() {
        return this.xVal[0] === this.xVal[this.xVal.length - 1]
    }
    ,
    t.prototype.convert = function(t) {
        return this.getStep(this.toStepping(t))
    }
    ,
    t.prototype.handleEntryPoint = function(t, e) {
        t = "min" === t ? 0 : "max" === t ? 100 : parseFloat(t);
        if (!i(t) || !i(e[0]))
            throw new Error("noUiSlider: 'range' value isn't numeric.");
        this.xPct.push(t),
        this.xVal.push(e[0]);
        e = Number(e[1]);
        t ? this.xSteps.push(!isNaN(e) && e) : isNaN(e) || (this.xSteps[0] = e),
        this.xHighestCompleteStep.push(0)
    }
    ,
    t.prototype.handleStepPoint = function(t, e) {
        e && (this.xVal[t] !== this.xVal[t + 1] ? (this.xSteps[t] = a([this.xVal[t], this.xVal[t + 1]], e, 0) / s(this.xPct[t], this.xPct[t + 1]),
        e = (this.xVal[t + 1] - this.xVal[t]) / this.xNumSteps[t],
        e = Math.ceil(Number(e.toFixed(3)) - 1),
        e = this.xVal[t] + this.xNumSteps[t] * e,
        this.xHighestCompleteStep[t] = e) : this.xSteps[t] = this.xHighestCompleteStep[t] = this.xVal[t])
    }
    ,
    t);
    function t(e, t, r) {
        var n;
        this.xPct = [],
        this.xVal = [],
        this.xSteps = [],
        this.xNumSteps = [],
        this.xHighestCompleteStep = [],
        this.xSteps = [r || !1],
        this.xNumSteps = [!1],
        this.snap = t;
        var i = [];
        for (Object.keys(e).forEach(function(t) {
            i.push([pt(e[t]), t])
        }),
        i.sort(function(t, e) {
            return t[0][0] - e[0][0]
        }),
        n = 0; n < i.length; n++)
            this.handleEntryPoint(i[n][1], i[n][0]);
        for (this.xNumSteps = this.xSteps.slice(0),
        n = 0; n < this.xNumSteps.length; n++)
            this.handleStepPoint(n, this.xNumSteps[n])
    }
    var c = {
        to: function(t) {
            return void 0 === t ? "" : t.toFixed(2)
        },
        from: Number
    }
      , p = {
        target: "target",
        base: "base",
        origin: "origin",
        handle: "handle",
        handleLower: "handle-lower",
        handleUpper: "handle-upper",
        touchArea: "touch-area",
        horizontal: "horizontal",
        vertical: "vertical",
        background: "background",
        connect: "connect",
        connects: "connects",
        ltr: "ltr",
        rtl: "rtl",
        textDirectionLtr: "txt-dir-ltr",
        textDirectionRtl: "txt-dir-rtl",
        draggable: "draggable",
        drag: "state-drag",
        tap: "state-tap",
        active: "active",
        tooltip: "tooltip",
        pips: "pips",
        pipsHorizontal: "pips-horizontal",
        pipsVertical: "pips-vertical",
        marker: "marker",
        markerHorizontal: "marker-horizontal",
        markerVertical: "marker-vertical",
        markerNormal: "marker-normal",
        markerLarge: "marker-large",
        markerSub: "marker-sub",
        value: "value",
        valueHorizontal: "value-horizontal",
        valueVertical: "value-vertical",
        valueNormal: "value-normal",
        valueLarge: "value-large",
        valueSub: "value-sub"
    }
      , mt = {
        tooltips: ".__tooltips",
        aria: ".__aria"
    };
    function f(t, e) {
        if (!i(e))
            throw new Error("noUiSlider: 'step' is not numeric.");
        t.singleStep = e
    }
    function d(t, e) {
        if (!i(e))
            throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
        t.keyboardPageMultiplier = e
    }
    function h(t, e) {
        if (!i(e))
            throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
        t.keyboardMultiplier = e
    }
    function m(t, e) {
        if (!i(e))
            throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
        t.keyboardDefaultStep = e
    }
    function g(t, e) {
        if ("object" != typeof e || Array.isArray(e))
            throw new Error("noUiSlider: 'range' is not an object.");
        if (void 0 === e.min || void 0 === e.max)
            throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
        t.spectrum = new u(e,t.snap || !1,t.singleStep)
    }
    function v(t, e) {
        if (e = pt(e),
        !Array.isArray(e) || !e.length)
            throw new Error("noUiSlider: 'start' option is incorrect.");
        t.handles = e.length,
        t.start = e
    }
    function b(t, e) {
        if ("boolean" != typeof e)
            throw new Error("noUiSlider: 'snap' option must be a boolean.");
        t.snap = e
    }
    function S(t, e) {
        if ("boolean" != typeof e)
            throw new Error("noUiSlider: 'animate' option must be a boolean.");
        t.animate = e
    }
    function x(t, e) {
        if ("number" != typeof e)
            throw new Error("noUiSlider: 'animationDuration' option must be a number.");
        t.animationDuration = e
    }
    function y(t, e) {
        var r, n = [!1];
        if ("lower" === e ? e = [!0, !1] : "upper" === e && (e = [!1, !0]),
        !0 === e || !1 === e) {
            for (r = 1; r < t.handles; r++)
                n.push(e);
            n.push(!1)
        } else {
            if (!Array.isArray(e) || !e.length || e.length !== t.handles + 1)
                throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
            n = e
        }
        t.connect = n
    }
    function w(t, e) {
        switch (e) {
        case "horizontal":
            t.ort = 0;
            break;
        case "vertical":
            t.ort = 1;
            break;
        default:
            throw new Error("noUiSlider: 'orientation' option is invalid.")
        }
    }
    function E(t, e) {
        if (!i(e))
            throw new Error("noUiSlider: 'margin' option must be numeric.");
        0 !== e && (t.margin = t.spectrum.getDistance(e))
    }
    function P(t, e) {
        if (!i(e))
            throw new Error("noUiSlider: 'limit' option must be numeric.");
        if (t.limit = t.spectrum.getDistance(e),
        !t.limit || t.handles < 2)
            throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.")
    }
    function C(t, e) {
        var r;
        if (!i(e) && !Array.isArray(e))
            throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        if (Array.isArray(e) && 2 !== e.length && !i(e[0]) && !i(e[1]))
            throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
        if (0 !== e) {
            for (Array.isArray(e) || (e = [e, e]),
            t.padding = [t.spectrum.getDistance(e[0]), t.spectrum.getDistance(e[1])],
            r = 0; r < t.spectrum.xNumSteps.length - 1; r++)
                if (t.padding[0][r] < 0 || t.padding[1][r] < 0)
                    throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
            var n = e[0] + e[1]
              , e = t.spectrum.xVal[0];
            if (1 < n / (t.spectrum.xVal[t.spectrum.xVal.length - 1] - e))
                throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.")
        }
    }
    function N(t, e) {
        switch (e) {
        case "ltr":
            t.dir = 0;
            break;
        case "rtl":
            t.dir = 1;
            break;
        default:
            throw new Error("noUiSlider: 'direction' option was not recognized.")
        }
    }
    function V(t, e) {
        if ("string" != typeof e)
            throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
        var r = 0 <= e.indexOf("tap")
          , n = 0 <= e.indexOf("drag")
          , i = 0 <= e.indexOf("fixed")
          , o = 0 <= e.indexOf("snap")
          , s = 0 <= e.indexOf("hover")
          , a = 0 <= e.indexOf("unconstrained")
          , l = 0 <= e.indexOf("drag-all")
          , e = 0 <= e.indexOf("smooth-steps");
        if (i) {
            if (2 !== t.handles)
                throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
            E(t, t.start[1] - t.start[0])
        }
        if (a && (t.margin || t.limit))
            throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
        t.events = {
            tap: r || o,
            drag: n,
            dragAll: l,
            smoothSteps: e,
            fixed: i,
            snap: o,
            hover: s,
            unconstrained: a
        }
    }
    function k(t, e) {
        if (!1 !== e)
            if (!0 === e || n(e)) {
                t.tooltips = [];
                for (var r = 0; r < t.handles; r++)
                    t.tooltips.push(e)
            } else {
                if ((e = pt(e)).length !== t.handles)
                    throw new Error("noUiSlider: must pass a formatter for all handles.");
                e.forEach(function(t) {
                    if ("boolean" != typeof t && !n(t))
                        throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.")
                }),
                t.tooltips = e
            }
    }
    function M(t, e) {
        if (e.length !== t.handles)
            throw new Error("noUiSlider: must pass a attributes for all handles.");
        t.handleAttributes = e
    }
    function A(t, e) {
        if (!n(e))
            throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
        t.ariaFormat = e
    }
    function U(t, e) {
        if (!n(r = e) || "function" != typeof r.from)
            throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
        var r;
        t.format = e
    }
    function D(t, e) {
        if ("boolean" != typeof e)
            throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
        t.keyboardSupport = e
    }
    function O(t, e) {
        t.documentElement = e
    }
    function L(t, e) {
        if ("string" != typeof e && !1 !== e)
            throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
        t.cssPrefix = e
    }
    function T(e, r) {
        if ("object" != typeof r)
            throw new Error("noUiSlider: 'cssClasses' must be an object.");
        "string" == typeof e.cssPrefix ? (e.cssClasses = {},
        Object.keys(r).forEach(function(t) {
            e.cssClasses[t] = e.cssPrefix + r[t]
        })) : e.cssClasses = r
    }
    function gt(e) {
        var r = {
            margin: null,
            limit: null,
            padding: null,
            animate: !0,
            animationDuration: 300,
            ariaFormat: c,
            format: c
        }
          , n = {
            step: {
                r: !1,
                t: f
            },
            keyboardPageMultiplier: {
                r: !1,
                t: d
            },
            keyboardMultiplier: {
                r: !1,
                t: h
            },
            keyboardDefaultStep: {
                r: !1,
                t: m
            },
            start: {
                r: !0,
                t: v
            },
            connect: {
                r: !0,
                t: y
            },
            direction: {
                r: !0,
                t: N
            },
            snap: {
                r: !1,
                t: b
            },
            animate: {
                r: !1,
                t: S
            },
            animationDuration: {
                r: !1,
                t: x
            },
            range: {
                r: !0,
                t: g
            },
            orientation: {
                r: !1,
                t: w
            },
            margin: {
                r: !1,
                t: E
            },
            limit: {
                r: !1,
                t: P
            },
            padding: {
                r: !1,
                t: C
            },
            behaviour: {
                r: !0,
                t: V
            },
            ariaFormat: {
                r: !1,
                t: A
            },
            format: {
                r: !1,
                t: U
            },
            tooltips: {
                r: !1,
                t: k
            },
            keyboardSupport: {
                r: !0,
                t: D
            },
            documentElement: {
                r: !1,
                t: O
            },
            cssPrefix: {
                r: !0,
                t: L
            },
            cssClasses: {
                r: !0,
                t: T
            },
            handleAttributes: {
                r: !1,
                t: M
            }
        }
          , i = {
            connect: !1,
            direction: "ltr",
            behaviour: "tap",
            orientation: "horizontal",
            keyboardSupport: !0,
            cssPrefix: "noUi-",
            cssClasses: p,
            keyboardPageMultiplier: 5,
            keyboardMultiplier: 1,
            keyboardDefaultStep: 10
        };
        e.format && !e.ariaFormat && (e.ariaFormat = e.format),
        Object.keys(n).forEach(function(t) {
            if (at(e[t]) || void 0 !== i[t])
                n[t].t(r, (at(e[t]) ? e : i)[t]);
            else if (n[t].r)
                throw new Error("noUiSlider: '" + t + "' is required.")
        }),
        r.pips = e.pips;
        var t = document.createElement("div")
          , o = void 0 !== t.style.msTransform
          , t = void 0 !== t.style.transform;
        r.transformRule = t ? "transform" : o ? "msTransform" : "webkitTransform";
        return r.style = [["left", "top"], ["right", "bottom"]][r.dir][r.ort],
        r
    }
    function j(t, f, o) {
        var i, l, a, n, s, u, c = window.navigator.pointerEnabled ? {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup"
        } : window.navigator.msPointerEnabled ? {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp"
        } : {
            start: "mousedown touchstart",
            move: "mousemove touchmove",
            end: "mouseup touchend"
        }, p = window.CSS && CSS.supports && CSS.supports("touch-action", "none") && function() {
            var t = !1;
            try {
                var e = Object.defineProperty({}, "passive", {
                    get: function() {
                        t = !0
                    }
                });
                window.addEventListener("test", null, e)
            } catch (t) {}
            return t
        }(), d = t, S = f.spectrum, h = [], m = [], g = [], v = 0, b = {}, x = t.ownerDocument, y = f.documentElement || x.documentElement, w = x.body, E = "rtl" === x.dir || 1 === f.ort ? 0 : 100;
        function P(t, e) {
            var r = x.createElement("div");
            return e && ft(r, e),
            t.appendChild(r),
            r
        }
        function C(t, e) {
            var r, t = P(t, f.cssClasses.origin), n = P(t, f.cssClasses.handle);
            return P(n, f.cssClasses.touchArea),
            n.setAttribute("data-handle", String(e)),
            f.keyboardSupport && (n.setAttribute("tabindex", "0"),
            n.addEventListener("keydown", function(t) {
                return function(t, e) {
                    if (V() || k(e))
                        return !1;
                    var r = ["Left", "Right"]
                      , n = ["Down", "Up"]
                      , i = ["PageDown", "PageUp"]
                      , o = ["Home", "End"];
                    f.dir && !f.ort ? r.reverse() : f.ort && !f.dir && (n.reverse(),
                    i.reverse());
                    var s = t.key.replace("Arrow", "")
                      , a = s === i[0]
                      , l = s === i[1]
                      , i = s === n[0] || s === r[0] || a
                      , n = s === n[1] || s === r[1] || l
                      , r = s === o[0]
                      , o = s === o[1];
                    if (!(i || n || r || o))
                        return !0;
                    if (t.preventDefault(),
                    n || i) {
                        var u = i ? 0 : 1
                          , u = nt(e)[u];
                        if (null === u)
                            return !1;
                        !1 === u && (u = S.getDefaultStep(m[e], i, f.keyboardDefaultStep)),
                        u *= l || a ? f.keyboardPageMultiplier : f.keyboardMultiplier,
                        u = Math.max(u, 1e-7),
                        u *= i ? -1 : 1,
                        u = h[e] + u
                    } else
                        u = o ? f.spectrum.xVal[f.spectrum.xVal.length - 1] : f.spectrum.xVal[0];
                    return Q(e, S.toStepping(u), !0, !0),
                    I("slide", e),
                    I("update", e),
                    I("change", e),
                    I("set", e),
                    !1
                }(t, e)
            })),
            void 0 !== f.handleAttributes && (r = f.handleAttributes[e],
            Object.keys(r).forEach(function(t) {
                n.setAttribute(t, r[t])
            })),
            n.setAttribute("role", "slider"),
            n.setAttribute("aria-orientation", f.ort ? "vertical" : "horizontal"),
            0 === e ? ft(n, f.cssClasses.handleLower) : e === f.handles - 1 && ft(n, f.cssClasses.handleUpper),
            t
        }
        function N(t, e) {
            return !!e && P(t, f.cssClasses.connect)
        }
        function e(t, e) {
            return !(!f.tooltips || !f.tooltips[e]) && P(t.firstChild, f.cssClasses.tooltip)
        }
        function V() {
            return d.hasAttribute("disabled")
        }
        function k(t) {
            return l[t].hasAttribute("disabled")
        }
        function M() {
            s && (Y("update" + mt.tooltips),
            s.forEach(function(t) {
                t && st(t)
            }),
            s = null)
        }
        function A() {
            M(),
            s = l.map(e),
            X("update" + mt.tooltips, function(t, e, r) {
                s && f.tooltips && !1 !== s[e] && (t = t[e],
                !0 !== f.tooltips[e] && (t = f.tooltips[e].to(r[e])),
                s[e].innerHTML = t)
            })
        }
        function U(t, e) {
            return t.map(function(t) {
                return S.fromStepping(e ? S.getStep(t) : t)
            })
        }
        function D(d) {
            var h = function(t) {
                if (t.mode === ot.PipsMode.Range || t.mode === ot.PipsMode.Steps)
                    return S.xVal;
                if (t.mode !== ot.PipsMode.Count)
                    return t.mode === ot.PipsMode.Positions ? U(t.values, t.stepped) : t.mode === ot.PipsMode.Values ? t.stepped ? t.values.map(function(t) {
                        return S.fromStepping(S.getStep(S.toStepping(t)))
                    }) : t.values : [];
                if (t.values < 2)
                    throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
                for (var e = t.values - 1, r = 100 / e, n = []; e--; )
                    n[e] = e * r;
                return n.push(100),
                U(n, t.stepped)
            }(d)
              , m = {}
              , t = S.xVal[0]
              , e = S.xVal[S.xVal.length - 1]
              , g = !1
              , v = !1
              , b = 0;
            return (h = h.slice().sort(function(t, e) {
                return t - e
            }).filter(function(t) {
                return !this[t] && (this[t] = !0)
            }, {}))[0] !== t && (h.unshift(t),
            g = !0),
            h[h.length - 1] !== e && (h.push(e),
            v = !0),
            h.forEach(function(t, e) {
                var r, n, i, o, s, a, l, u, t = t, c = h[e + 1], p = d.mode === ot.PipsMode.Steps, f = (f = p ? S.xNumSteps[e] : f) || c - t;
                for (void 0 === c && (c = t),
                f = Math.max(f, 1e-7),
                r = t; r <= c; r = Number((r + f).toFixed(7))) {
                    for (a = (o = (i = S.toStepping(r)) - b) / (d.density || 1),
                    u = o / (l = Math.round(a)),
                    n = 1; n <= l; n += 1)
                        m[(s = b + n * u).toFixed(5)] = [S.fromStepping(s), 0];
                    a = -1 < h.indexOf(r) ? ot.PipsType.LargeValue : p ? ot.PipsType.SmallValue : ot.PipsType.NoValue,
                    !e && g && r !== c && (a = 0),
                    r === c && v || (m[i.toFixed(5)] = [r, a]),
                    b = i
                }
            }),
            m
        }
        function O(i, o, s) {
            var t, a = x.createElement("div"), n = ((t = {})[ot.PipsType.None] = "",
            t[ot.PipsType.NoValue] = f.cssClasses.valueNormal,
            t[ot.PipsType.LargeValue] = f.cssClasses.valueLarge,
            t[ot.PipsType.SmallValue] = f.cssClasses.valueSub,
            t), l = ((t = {})[ot.PipsType.None] = "",
            t[ot.PipsType.NoValue] = f.cssClasses.markerNormal,
            t[ot.PipsType.LargeValue] = f.cssClasses.markerLarge,
            t[ot.PipsType.SmallValue] = f.cssClasses.markerSub,
            t), u = [f.cssClasses.valueHorizontal, f.cssClasses.valueVertical], c = [f.cssClasses.markerHorizontal, f.cssClasses.markerVertical];
            function p(t, e) {
                var r = e === f.cssClasses.value;
                return e + " " + (r ? u : c)[f.ort] + " " + (r ? n : l)[t]
            }
            return ft(a, f.cssClasses.pips),
            ft(a, 0 === f.ort ? f.cssClasses.pipsHorizontal : f.cssClasses.pipsVertical),
            Object.keys(i).forEach(function(t) {
                var e, r, n;
                r = i[e = t][0],
                n = i[t][1],
                (n = o ? o(r, n) : n) !== ot.PipsType.None && ((t = P(a, !1)).className = p(n, f.cssClasses.marker),
                t.style[f.style] = e + "%",
                n > ot.PipsType.NoValue && ((t = P(a, !1)).className = p(n, f.cssClasses.value),
                t.setAttribute("data-value", String(r)),
                t.style[f.style] = e + "%",
                t.innerHTML = String(s.to(r))))
            }),
            a
        }
        function L() {
            n && (st(n),
            n = null)
        }
        function T(t) {
            L();
            var e = D(t)
              , r = t.filter
              , t = t.format || {
                to: function(t) {
                    return String(Math.round(t))
                }
            };
            return n = d.appendChild(O(e, r, t))
        }
        function j() {
            var t = i.getBoundingClientRect()
              , e = "offset" + ["Width", "Height"][f.ort];
            return 0 === f.ort ? t.width || i[e] : t.height || i[e]
        }
        function z(n, i, o, s) {
            function e(t) {
                var e, r = function(e, t, r) {
                    var n = 0 === e.type.indexOf("touch")
                      , i = 0 === e.type.indexOf("mouse")
                      , o = 0 === e.type.indexOf("pointer")
                      , s = 0
                      , a = 0;
                    0 === e.type.indexOf("MSPointer") && (o = !0);
                    if ("mousedown" === e.type && !e.buttons && !e.touches)
                        return !1;
                    if (n) {
                        var l = function(t) {
                            t = t.target;
                            return t === r || r.contains(t) || e.composed && e.composedPath().shift() === r
                        };
                        if ("touchstart" === e.type) {
                            n = Array.prototype.filter.call(e.touches, l);
                            if (1 < n.length)
                                return !1;
                            s = n[0].pageX,
                            a = n[0].pageY
                        } else {
                            l = Array.prototype.find.call(e.changedTouches, l);
                            if (!l)
                                return !1;
                            s = l.pageX,
                            a = l.pageY
                        }
                    }
                    t = t || ht(x),
                    (i || o) && (s = e.clientX + t.x,
                    a = e.clientY + t.y);
                    return e.pageOffset = t,
                    e.points = [s, a],
                    e.cursor = i || o,
                    e
                }(t, s.pageOffset, s.target || i);
                return !!r && (!(V() && !s.doNotReject) && (e = d,
                t = f.cssClasses.tap,
                !((e.classList ? e.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(e.className)) && !s.doNotReject) && (!(n === c.start && void 0 !== r.buttons && 1 < r.buttons) && ((!s.hover || !r.buttons) && (p || r.preventDefault(),
                r.calcPoint = r.points[f.ort],
                void o(r, s))))))
            }
            var r = [];
            return n.split(" ").forEach(function(t) {
                i.addEventListener(t, e, !!p && {
                    passive: !0
                }),
                r.push([t, e])
            }),
            r
        }
        function H(t) {
            var e, r, n = ct(n = 100 * (t - (n = i,
            e = f.ort,
            r = n.getBoundingClientRect(),
            n = (t = n.ownerDocument).documentElement,
            t = ht(t),
            /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (t.x = 0),
            e ? r.top + t.y - n.clientTop : r.left + t.x - n.clientLeft)) / j());
            return f.dir ? 100 - n : n
        }
        function F(t, e) {
            "mouseout" === t.type && "HTML" === t.target.nodeName && null === t.relatedTarget && _(t, e)
        }
        function R(t, e) {
            if (-1 === navigator.appVersion.indexOf("MSIE 9") && 0 === t.buttons && 0 !== e.buttonsProperty)
                return _(t, e);
            t = (f.dir ? -1 : 1) * (t.calcPoint - e.startCalcPoint);
            G(0 < t, 100 * t / e.baseSize, e.locations, e.handleNumbers, e.connect)
        }
        function _(t, e) {
            e.handle && (dt(e.handle, f.cssClasses.active),
            --v),
            e.listeners.forEach(function(t) {
                y.removeEventListener(t[0], t[1])
            }),
            0 === v && (dt(d, f.cssClasses.drag),
            K(),
            t.cursor && (w.style.cursor = "",
            w.removeEventListener("selectstart", lt))),
            f.events.smoothSteps && (e.handleNumbers.forEach(function(t) {
                Q(t, m[t], !0, !0, !1, !1)
            }),
            e.handleNumbers.forEach(function(t) {
                I("update", t)
            })),
            e.handleNumbers.forEach(function(t) {
                I("change", t),
                I("set", t),
                I("end", t)
            })
        }
        function B(t, e) {
            var r, n, i, o;
            e.handleNumbers.some(k) || (1 === e.handleNumbers.length && (o = l[e.handleNumbers[0]].children[0],
            v += 1,
            ft(o, f.cssClasses.active)),
            t.stopPropagation(),
            n = z(c.move, y, R, {
                target: t.target,
                handle: o,
                connect: e.connect,
                listeners: r = [],
                startCalcPoint: t.calcPoint,
                baseSize: j(),
                pageOffset: t.pageOffset,
                handleNumbers: e.handleNumbers,
                buttonsProperty: t.buttons,
                locations: m.slice()
            }),
            i = z(c.end, y, _, {
                target: t.target,
                handle: o,
                listeners: r,
                doNotReject: !0,
                handleNumbers: e.handleNumbers
            }),
            o = z("mouseout", y, F, {
                target: t.target,
                handle: o,
                listeners: r,
                doNotReject: !0,
                handleNumbers: e.handleNumbers
            }),
            r.push.apply(r, n.concat(i, o)),
            t.cursor && (w.style.cursor = getComputedStyle(t.target).cursor,
            1 < l.length && ft(d, f.cssClasses.drag),
            w.addEventListener("selectstart", lt, !1)),
            e.handleNumbers.forEach(function(t) {
                I("start", t)
            }))
        }
        function r(t) {
            t.stopPropagation();
            var i, o, s, e = H(t.calcPoint), r = (i = e,
            s = !(o = 100),
            l.forEach(function(t, e) {
                var r, n;
                k(e) || (r = m[e],
                ((n = Math.abs(r - i)) < o || n <= o && r < i || 100 === n && 100 === o) && (s = e,
                o = n))
            }),
            s);
            !1 !== r && (f.events.snap || ut(d, f.cssClasses.tap, f.animationDuration),
            Q(r, e, !0, !0),
            K(),
            I("slide", r, !0),
            I("update", r, !0),
            f.events.snap ? B(t, {
                handleNumbers: [r]
            }) : (I("change", r, !0),
            I("set", r, !0)))
        }
        function q(t) {
            var t = H(t.calcPoint)
              , t = S.getStep(t)
              , e = S.fromStepping(t);
            Object.keys(b).forEach(function(t) {
                "hover" === t.split(".")[0] && b[t].forEach(function(t) {
                    t.call(it, e)
                })
            })
        }
        function X(t, e) {
            b[t] = b[t] || [],
            b[t].push(e),
            "update" === t.split(".")[0] && l.forEach(function(t, e) {
                I("update", e)
            })
        }
        function Y(t) {
            var n = t && t.split(".")[0]
              , i = n ? t.substring(n.length) : t;
            Object.keys(b).forEach(function(t) {
                var e = t.split(".")[0]
                  , r = t.substring(e.length);
                n && n !== e || i && i !== r || ((e = r) !== mt.aria && e !== mt.tooltips || i === r) && delete b[t]
            })
        }
        function I(r, n, i) {
            Object.keys(b).forEach(function(t) {
                var e = t.split(".")[0];
                r === e && b[t].forEach(function(t) {
                    t.call(it, h.map(f.format.to), n, h.slice(), i || !1, m.slice(), it)
                })
            })
        }
        function W(t, e, r, n, i, o, s) {
            var a;
            return 1 < l.length && !f.events.unconstrained && (n && 0 < e && (a = S.getAbsoluteDistance(t[e - 1], f.margin, !1),
            r = Math.max(r, a)),
            i && e < l.length - 1 && (a = S.getAbsoluteDistance(t[e + 1], f.margin, !0),
            r = Math.min(r, a))),
            1 < l.length && f.limit && (n && 0 < e && (a = S.getAbsoluteDistance(t[e - 1], f.limit, !1),
            r = Math.min(r, a)),
            i && e < l.length - 1 && (a = S.getAbsoluteDistance(t[e + 1], f.limit, !0),
            r = Math.max(r, a))),
            f.padding && (0 === e && (a = S.getAbsoluteDistance(0, f.padding[0], !1),
            r = Math.max(r, a)),
            e === l.length - 1 && (a = S.getAbsoluteDistance(100, f.padding[1], !0),
            r = Math.min(r, a))),
            !((r = ct(r = !s ? S.getStep(r) : r)) === t[e] && !o) && r
        }
        function $(t, e) {
            var r = f.ort;
            return (r ? e : t) + ", " + (r ? t : e)
        }
        function G(t, r, n, e, i) {
            var o = n.slice()
              , s = e[0]
              , a = f.events.smoothSteps
              , l = [!t, t]
              , u = [t, !t];
            e = e.slice(),
            t && e.reverse(),
            1 < e.length ? e.forEach(function(t, e) {
                e = W(o, t, o[t] + r, l[e], u[e], !1, a);
                !1 === e ? r = 0 : (r = e - o[t],
                o[t] = e)
            }) : l = u = [!0];
            var c = !1;
            e.forEach(function(t, e) {
                c = Q(t, n[t] + r, l[e], u[e], !1, a) || c
            }),
            c && (e.forEach(function(t) {
                I("update", t),
                I("slide", t)
            }),
            null != i && I("drag", s))
        }
        function J(t, e) {
            return f.dir ? 100 - t - e : t
        }
        function K() {
            g.forEach(function(t) {
                var e = 50 < m[t] ? -1 : 1
                  , e = 3 + (l.length + e * t);
                l[t].style.zIndex = String(e)
            })
        }
        function Q(t, e, r, n, i, o) {
            return !1 !== (e = i ? e : W(m, t, e, r, n, !1, o)) && (e = e,
            m[t = t] = e,
            h[t] = S.fromStepping(e),
            e = "translate(" + $(J(e, 0) - E + "%", "0") + ")",
            l[t].style[f.transformRule] = e,
            Z(t),
            Z(t + 1),
            !0)
        }
        function Z(t) {
            var e, r;
            a[t] && (r = 100,
            e = "translate(" + $(J(e = (e = 0) !== t ? m[t - 1] : e, r = (r = t !== a.length - 1 ? m[t] : r) - e) + "%", "0") + ")",
            r = "scale(" + $(r / 100, "1") + ")",
            a[t].style[f.transformRule] = e + " " + r)
        }
        function tt(t, e) {
            return null === t || !1 === t || void 0 === t ? m[e] : ("number" == typeof t && (t = String(t)),
            !1 === (t = !1 !== (t = f.format.from(t)) ? S.toStepping(t) : t) || isNaN(t) ? m[e] : t)
        }
        function et(t, e, r) {
            var n = pt(t)
              , t = void 0 === m[0];
            e = void 0 === e || e,
            f.animate && !t && ut(d, f.cssClasses.tap, f.animationDuration),
            g.forEach(function(t) {
                Q(t, tt(n[t], t), !0, !1, r)
            });
            var i, o = 1 === g.length ? 0 : 1;
            for (t && S.hasNoSize() && (r = !0,
            m[0] = 0,
            1 < g.length && (i = 100 / (g.length - 1),
            g.forEach(function(t) {
                m[t] = t * i
            }))); o < g.length; ++o)
                g.forEach(function(t) {
                    Q(t, m[t], !0, !0, r)
                });
            K(),
            g.forEach(function(t) {
                I("update", t),
                null !== n[t] && e && I("set", t)
            })
        }
        function rt(t) {
            if (t = void 0 === t ? !1 : t)
                return 1 === h.length ? h[0] : h.slice(0);
            t = h.map(f.format.to);
            return 1 === t.length ? t[0] : t
        }
        function nt(t) {
            var e = m[t]
              , r = S.getNearbySteps(e)
              , n = h[t]
              , i = r.thisStep.step
              , t = null;
            if (f.snap)
                return [n - r.stepBefore.startValue || null, r.stepAfter.startValue - n || null];
            !1 !== i && n + i > r.stepAfter.startValue && (i = r.stepAfter.startValue - n),
            t = n > r.thisStep.startValue ? r.thisStep.step : !1 !== r.stepBefore.step && n - r.stepBefore.highestStep,
            100 === e ? i = null : 0 === e && (t = null);
            e = S.countStepDecimals();
            return null !== i && !1 !== i && (i = Number(i.toFixed(e))),
            [t = null !== t && !1 !== t ? Number(t.toFixed(e)) : t, i]
        }
        ft(t = d, f.cssClasses.target),
        0 === f.dir ? ft(t, f.cssClasses.ltr) : ft(t, f.cssClasses.rtl),
        0 === f.ort ? ft(t, f.cssClasses.horizontal) : ft(t, f.cssClasses.vertical),
        ft(t, "rtl" === getComputedStyle(t).direction ? f.cssClasses.textDirectionRtl : f.cssClasses.textDirectionLtr),
        i = P(t, f.cssClasses.base),
        function(t, e) {
            var r = P(e, f.cssClasses.connects);
            l = [],
            (a = []).push(N(r, t[0]));
            for (var n = 0; n < f.handles; n++)
                l.push(C(e, n)),
                g[n] = n,
                a.push(N(r, t[n + 1]))
        }(f.connect, i),
        (u = f.events).fixed || l.forEach(function(t, e) {
            z(c.start, t.children[0], B, {
                handleNumbers: [e]
            })
        }),
        u.tap && z(c.start, i, r, {}),
        u.hover && z(c.move, i, q, {
            hover: !0
        }),
        u.drag && a.forEach(function(e, t) {
            var r, n, i, o, s;
            !1 !== e && 0 !== t && t !== a.length - 1 && (r = l[t - 1],
            n = l[t],
            i = [e],
            o = [r, n],
            s = [t - 1, t],
            ft(e, f.cssClasses.draggable),
            u.fixed && (i.push(r.children[0]),
            i.push(n.children[0])),
            u.dragAll && (o = l,
            s = g),
            i.forEach(function(t) {
                z(c.start, t, B, {
                    handles: o,
                    handleNumbers: s,
                    connect: e
                })
            }))
        }),
        et(f.start),
        f.pips && T(f.pips),
        f.tooltips && A(),
        Y("update" + mt.aria),
        X("update" + mt.aria, function(t, e, o, r, s) {
            g.forEach(function(t) {
                var e = l[t]
                  , r = W(m, t, 0, !0, !0, !0)
                  , n = W(m, t, 100, !0, !0, !0)
                  , i = s[t]
                  , t = String(f.ariaFormat.to(o[t]))
                  , r = S.fromStepping(r).toFixed(1)
                  , n = S.fromStepping(n).toFixed(1)
                  , i = S.fromStepping(i).toFixed(1);
                e.children[0].setAttribute("aria-valuemin", r),
                e.children[0].setAttribute("aria-valuemax", n),
                e.children[0].setAttribute("aria-valuenow", i),
                e.children[0].setAttribute("aria-valuetext", t)
            })
        });
        var it = {
            destroy: function() {
                for (Y(mt.aria),
                Y(mt.tooltips),
                Object.keys(f.cssClasses).forEach(function(t) {
                    dt(d, f.cssClasses[t])
                }); d.firstChild; )
                    d.removeChild(d.firstChild);
                delete d.noUiSlider
            },
            steps: function() {
                return g.map(nt)
            },
            on: X,
            off: Y,
            get: rt,
            set: et,
            setHandle: function(t, e, r, n) {
                if (!(0 <= (t = Number(t)) && t < g.length))
                    throw new Error("noUiSlider: invalid handle number, got: " + t);
                Q(t, tt(e, t), !0, !0, n),
                I("update", t),
                r && I("set", t)
            },
            reset: function(t) {
                et(f.start, t)
            },
            __moveHandles: function(t, e, r) {
                G(t, e, m, r)
            },
            options: o,
            updateOptions: function(e, t) {
                var r = rt()
                  , n = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips"];
                n.forEach(function(t) {
                    void 0 !== e[t] && (o[t] = e[t])
                });
                var i = gt(o);
                n.forEach(function(t) {
                    void 0 !== e[t] && (f[t] = i[t])
                }),
                S = i.spectrum,
                f.margin = i.margin,
                f.limit = i.limit,
                f.padding = i.padding,
                f.pips ? T(f.pips) : L(),
                (f.tooltips ? A : M)(),
                m = [],
                et(at(e.start) ? e.start : r, t)
            },
            target: d,
            removePips: L,
            removeTooltips: M,
            getPositions: function() {
                return m.slice()
            },
            getTooltips: function() {
                return s
            },
            getOrigins: function() {
                return l
            },
            pips: T
        };
        return it
    }
    function z(t, e) {
        if (!t || !t.nodeName)
            throw new Error("noUiSlider: create requires a single element, got: " + t);
        if (t.noUiSlider)
            throw new Error("noUiSlider: Slider was already initialized.");
        e = j(t, gt(e), e);
        return t.noUiSlider = e
    }
    var H = {
        __spectrum: u,
        cssClasses: p,
        create: z
    };
    ot.create = z,
    ot.cssClasses = p,
    ot.default = H,
    Object.defineProperty(ot, "__esModule", {
        value: !0
    })
});

