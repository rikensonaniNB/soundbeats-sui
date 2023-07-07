(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [888], {
        7320: function(e, t) {
            "use strict";

            function r(e) {
                if (!Number.isSafeInteger(e) || e < 0) throw Error(`Wrong positive integer: ${e}`)
            }

            function n(e) {
                if ("boolean" != typeof e) throw Error(`Expected boolean, not ${e}`)
            }

            function i(e, ...t) {
                if (!(e instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
                if (t.length > 0 && !t.includes(e.length)) throw TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`)
            }

            function o(e) {
                if ("function" != typeof e || "function" != typeof e.create) throw Error("Hash should be wrapped by utils.wrapConstructor");
                r(e.outputLen), r(e.blockLen)
            }

            function s(e, t = !0) {
                if (e.destroyed) throw Error("Hash instance has been destroyed");
                if (t && e.finished) throw Error("Hash#digest() has already been called")
            }

            function a(e, t) {
                i(e);
                let r = t.outputLen;
                if (e.length < r) throw Error(`digestInto() expects output buffer of length at least ${r}`)
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.output = t.exists = t.hash = t.bytes = t.bool = t.number = void 0, t.number = r, t.bool = n, t.bytes = i, t.hash = o, t.exists = s, t.output = a, t.default = {
                number: r,
                bool: n,
                bytes: i,
                hash: o,
                exists: s,
                output: a
            }
        },
        7505: function(e, t, r) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.SHA2 = void 0;
            let n = r(7320),
                i = r(8089);
            class o extends i.Hash {
                constructor(e, t, r, n) {
                    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = n, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = (0, i.createView)(this.buffer)
                }
                update(e) {
                    n.default.exists(this);
                    let {
                        view: t,
                        buffer: r,
                        blockLen: o
                    } = this;
                    e = (0, i.toBytes)(e);
                    let s = e.length;
                    for (let n = 0; n < s;) {
                        let a = Math.min(o - this.pos, s - n);
                        if (a === o) {
                            let t = (0, i.createView)(e);
                            for (; o <= s - n; n += o) this.process(t, n);
                            continue
                        }
                        r.set(e.subarray(n, n + a), this.pos), this.pos += a, n += a, this.pos === o && (this.process(t, 0), this.pos = 0)
                    }
                    return this.length += e.length, this.roundClean(), this
                }
                digestInto(e) {
                    n.default.exists(this), n.default.output(e, this), this.finished = !0;
                    let {
                        buffer: t,
                        view: r,
                        blockLen: o,
                        isLE: s
                    } = this, {
                        pos: a
                    } = this;
                    t[a++] = 128, this.buffer.subarray(a).fill(0), this.padOffset > o - a && (this.process(r, 0), a = 0);
                    for (let e = a; e < o; e++) t[e] = 0;
                    ! function(e, t, r, n) {
                        if ("function" == typeof e.setBigUint64) return e.setBigUint64(t, r, n);
                        let i = BigInt(32),
                            o = BigInt(4294967295),
                            s = Number(r >> i & o),
                            a = Number(r & o);
                        e.setUint32(t + (n ? 4 : 0), s, n), e.setUint32(t + (n ? 0 : 4), a, n)
                    }(r, o - 8, BigInt(8 * this.length), s), this.process(r, 0);
                    let c = (0, i.createView)(e),
                        l = this.outputLen;
                    if (l % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
                    let u = l / 4,
                        f = this.get();
                    if (u > f.length) throw Error("_sha2: outputLen bigger than state");
                    for (let e = 0; e < u; e++) c.setUint32(4 * e, f[e], s)
                }
                digest() {
                    let {
                        buffer: e,
                        outputLen: t
                    } = this;
                    this.digestInto(e);
                    let r = e.slice(0, t);
                    return this.destroy(), r
                }
                _cloneInto(e) {
                    e || (e = new this.constructor), e.set(...this.get());
                    let {
                        blockLen: t,
                        buffer: r,
                        length: n,
                        finished: i,
                        destroyed: o,
                        pos: s
                    } = this;
                    return e.length = n, e.pos = s, e.finished = i, e.destroyed = o, n % t && e.buffer.set(r), e
                }
            }
            t.SHA2 = o
        },
        6873: function(e, t) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.add = t.toBig = t.split = t.fromBig = void 0;
            let r = BigInt(4294967296 - 1),
                n = BigInt(32);

            function i(e, t = !1) {
                return t ? {
                    h: Number(e & r),
                    l: Number(e >> n & r)
                } : {
                    h: 0 | Number(e >> n & r),
                    l: 0 | Number(e & r)
                }
            }

            function o(e, t = !1) {
                let r = new Uint32Array(e.length),
                    n = new Uint32Array(e.length);
                for (let o = 0; o < e.length; o++) {
                    let {
                        h: s,
                        l: a
                    } = i(e[o], t);
                    [r[o], n[o]] = [s, a]
                }
                return [r, n]
            }
            t.fromBig = i, t.split = o;
            let s = (e, t) => BigInt(e >>> 0) << n | BigInt(t >>> 0);

            function a(e, t, r, n) {
                let i = (t >>> 0) + (n >>> 0);
                return {
                    h: e + r + (i / 4294967296 | 0) | 0,
                    l: 0 | i
                }
            }
            t.toBig = s, t.add = a;
            let c = {
                fromBig: i,
                split: o,
                toBig: t.toBig,
                shrSH: (e, t, r) => e >>> r,
                shrSL: (e, t, r) => e << 32 - r | t >>> r,
                rotrSH: (e, t, r) => e >>> r | t << 32 - r,
                rotrSL: (e, t, r) => e << 32 - r | t >>> r,
                rotrBH: (e, t, r) => e << 64 - r | t >>> r - 32,
                rotrBL: (e, t, r) => e >>> r - 32 | t << 64 - r,
                rotr32H: (e, t) => t,
                rotr32L: (e, t) => e,
                rotlSH: (e, t, r) => e << r | t >>> 32 - r,
                rotlSL: (e, t, r) => t << r | e >>> 32 - r,
                rotlBH: (e, t, r) => t << r - 32 | e >>> 64 - r,
                rotlBL: (e, t, r) => e << r - 32 | t >>> 64 - r,
                add: a,
                add3L: (e, t, r) => (e >>> 0) + (t >>> 0) + (r >>> 0),
                add3H: (e, t, r, n) => t + r + n + (e / 4294967296 | 0) | 0,
                add4L: (e, t, r, n) => (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0),
                add4H: (e, t, r, n, i) => t + r + n + i + (e / 4294967296 | 0) | 0,
                add5H: (e, t, r, n, i, o) => t + r + n + i + o + (e / 4294967296 | 0) | 0,
                add5L: (e, t, r, n, i) => (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0)
            };
            t.default = c
        },
        1945: function(e, t) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.crypto = void 0, t.crypto = "object" == typeof globalThis && "crypto" in globalThis ? globalThis.crypto : void 0
        },
        9569: function(e, t, r) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.hmac = void 0;
            let n = r(7320),
                i = r(8089);
            class o extends i.Hash {
                constructor(e, t) {
                    super(), this.finished = !1, this.destroyed = !1, n.default.hash(e);
                    let r = (0, i.toBytes)(t);
                    if (this.iHash = e.create(), "function" != typeof this.iHash.update) throw TypeError("Expected instance of class which extends utils.Hash");
                    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
                    let o = this.blockLen,
                        s = new Uint8Array(o);
                    s.set(r.length > o ? e.create().update(r).digest() : r);
                    for (let e = 0; e < s.length; e++) s[e] ^= 54;
                    this.iHash.update(s), this.oHash = e.create();
                    for (let e = 0; e < s.length; e++) s[e] ^= 106;
                    this.oHash.update(s), s.fill(0)
                }
                update(e) {
                    return n.default.exists(this), this.iHash.update(e), this
                }
                digestInto(e) {
                    n.default.exists(this), n.default.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy()
                }
                digest() {
                    let e = new Uint8Array(this.oHash.outputLen);
                    return this.digestInto(e), e
                }
                _cloneInto(e) {
                    e || (e = Object.create(Object.getPrototypeOf(this), {}));
                    let {
                        oHash: t,
                        iHash: r,
                        finished: n,
                        destroyed: i,
                        blockLen: o,
                        outputLen: s
                    } = this;
                    return e.finished = n, e.destroyed = i, e.blockLen = o, e.outputLen = s, e.oHash = t._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e
                }
                destroy() {
                    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy()
                }
            }
            let s = (e, t, r) => new o(e, t).update(r).digest();
            t.hmac = s, t.hmac.create = (e, t) => new o(e, t)
        },
        9023: function(e, t, r) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.pbkdf2Async = t.pbkdf2 = void 0;
            let n = r(7320),
                i = r(9569),
                o = r(8089);

            function s(e, t, r, s) {
                n.default.hash(e);
                let a = (0, o.checkOpts)({
                        dkLen: 32,
                        asyncTick: 10
                    }, s),
                    {
                        c,
                        dkLen: l,
                        asyncTick: u
                    } = a;
                if (n.default.number(c), n.default.number(l), n.default.number(u), c < 1) throw Error("PBKDF2: iterations (c) should be >= 1");
                let f = (0, o.toBytes)(t),
                    h = (0, o.toBytes)(r),
                    d = new Uint8Array(l),
                    p = i.hmac.create(e, f),
                    g = p._cloneInto().update(h);
                return {
                    c,
                    dkLen: l,
                    asyncTick: u,
                    DK: d,
                    PRF: p,
                    PRFSalt: g
                }
            }

            function a(e, t, r, n, i) {
                return e.destroy(), t.destroy(), n && n.destroy(), i.fill(0), r
            }
            async function c(e, t, r, n) {
                let i;
                let {
                    c,
                    dkLen: l,
                    asyncTick: u,
                    DK: f,
                    PRF: h,
                    PRFSalt: d
                } = s(e, t, r, n), p = new Uint8Array(4), g = (0, o.createView)(p), y = new Uint8Array(h.outputLen);
                for (let e = 1, t = 0; t < l; e++, t += h.outputLen) {
                    let r = f.subarray(t, t + h.outputLen);
                    g.setInt32(0, e, !1), (i = d._cloneInto(i)).update(p).digestInto(y), r.set(y.subarray(0, r.length)), await (0, o.asyncLoop)(c - 1, u, e => {
                        h._cloneInto(i).update(y).digestInto(y);
                        for (let e = 0; e < r.length; e++) r[e] ^= y[e]
                    })
                }
                return a(h, d, f, i, y)
            }
            t.pbkdf2 = function(e, t, r, n) {
                let i;
                let {
                    c,
                    dkLen: l,
                    DK: u,
                    PRF: f,
                    PRFSalt: h
                } = s(e, t, r, n), d = new Uint8Array(4), p = (0, o.createView)(d), g = new Uint8Array(f.outputLen);
                for (let e = 1, t = 0; t < l; e++, t += f.outputLen) {
                    let r = u.subarray(t, t + f.outputLen);
                    p.setInt32(0, e, !1), (i = h._cloneInto(i)).update(d).digestInto(g), r.set(g.subarray(0, r.length));
                    for (let e = 1; e < c; e++) {
                        f._cloneInto(i).update(g).digestInto(g);
                        for (let e = 0; e < r.length; e++) r[e] ^= g[e]
                    }
                }
                return a(f, h, u, i, g)
            }, t.pbkdf2Async = c
        },
        3061: function(e, t, r) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.sha224 = t.sha256 = void 0;
            let n = r(7505),
                i = r(8089),
                o = (e, t, r) => e & t ^ ~e & r,
                s = (e, t, r) => e & t ^ e & r ^ t & r,
                a = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]),
                c = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
                l = new Uint32Array(64);
            class u extends n.SHA2 {
                constructor() {
                    super(64, 32, 8, !1), this.A = 0 | c[0], this.B = 0 | c[1], this.C = 0 | c[2], this.D = 0 | c[3], this.E = 0 | c[4], this.F = 0 | c[5], this.G = 0 | c[6], this.H = 0 | c[7]
                }
                get() {
                    let {
                        A: e,
                        B: t,
                        C: r,
                        D: n,
                        E: i,
                        F: o,
                        G: s,
                        H: a
                    } = this;
                    return [e, t, r, n, i, o, s, a]
                }
                set(e, t, r, n, i, o, s, a) {
                    this.A = 0 | e, this.B = 0 | t, this.C = 0 | r, this.D = 0 | n, this.E = 0 | i, this.F = 0 | o, this.G = 0 | s, this.H = 0 | a
                }
                process(e, t) {
                    for (let r = 0; r < 16; r++, t += 4) l[r] = e.getUint32(t, !1);
                    for (let e = 16; e < 64; e++) {
                        let t = l[e - 15],
                            r = l[e - 2],
                            n = (0, i.rotr)(t, 7) ^ (0, i.rotr)(t, 18) ^ t >>> 3,
                            o = (0, i.rotr)(r, 17) ^ (0, i.rotr)(r, 19) ^ r >>> 10;
                        l[e] = o + l[e - 7] + n + l[e - 16] | 0
                    }
                    let {
                        A: r,
                        B: n,
                        C: c,
                        D: u,
                        E: f,
                        F: h,
                        G: d,
                        H: p
                    } = this;
                    for (let e = 0; e < 64; e++) {
                        let t = (0, i.rotr)(f, 6) ^ (0, i.rotr)(f, 11) ^ (0, i.rotr)(f, 25),
                            g = p + t + o(f, h, d) + a[e] + l[e] | 0,
                            y = (0, i.rotr)(r, 2) ^ (0, i.rotr)(r, 13) ^ (0, i.rotr)(r, 22),
                            m = y + s(r, n, c) | 0;
                        p = d, d = h, h = f, f = u + g | 0, u = c, c = n, n = r, r = g + m | 0
                    }
                    r = r + this.A | 0, n = n + this.B | 0, c = c + this.C | 0, u = u + this.D | 0, f = f + this.E | 0, h = h + this.F | 0, d = d + this.G | 0, p = p + this.H | 0, this.set(r, n, c, u, f, h, d, p)
                }
                roundClean() {
                    l.fill(0)
                }
                destroy() {
                    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0)
                }
            }
            class f extends u {
                constructor() {
                    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28
                }
            }
            t.sha256 = (0, i.wrapConstructor)(() => new u), t.sha224 = (0, i.wrapConstructor)(() => new f)
        },
        6262: function(e, t, r) {
            "use strict";
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.sha384 = t.sha512_256 = t.sha512_224 = t.sha512 = t.SHA512 = void 0;
            let n = r(7505),
                i = r(6873),
                o = r(8089),
                [s, a] = i.default.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map(e => BigInt(e))),
                c = new Uint32Array(80),
                l = new Uint32Array(80);
            class u extends n.SHA2 {
                constructor() {
                    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209
                }
                get() {
                    let {
                        Ah: e,
                        Al: t,
                        Bh: r,
                        Bl: n,
                        Ch: i,
                        Cl: o,
                        Dh: s,
                        Dl: a,
                        Eh: c,
                        El: l,
                        Fh: u,
                        Fl: f,
                        Gh: h,
                        Gl: d,
                        Hh: p,
                        Hl: g
                    } = this;
                    return [e, t, r, n, i, o, s, a, c, l, u, f, h, d, p, g]
                }
                set(e, t, r, n, i, o, s, a, c, l, u, f, h, d, p, g) {
                    this.Ah = 0 | e, this.Al = 0 | t, this.Bh = 0 | r, this.Bl = 0 | n, this.Ch = 0 | i, this.Cl = 0 | o, this.Dh = 0 | s, this.Dl = 0 | a, this.Eh = 0 | c, this.El = 0 | l, this.Fh = 0 | u, this.Fl = 0 | f, this.Gh = 0 | h, this.Gl = 0 | d, this.Hh = 0 | p, this.Hl = 0 | g
                }
                process(e, t) {
                    for (let r = 0; r < 16; r++, t += 4) c[r] = e.getUint32(t), l[r] = e.getUint32(t += 4);
                    for (let e = 16; e < 80; e++) {
                        let t = 0 | c[e - 15],
                            r = 0 | l[e - 15],
                            n = i.default.rotrSH(t, r, 1) ^ i.default.rotrSH(t, r, 8) ^ i.default.shrSH(t, r, 7),
                            o = i.default.rotrSL(t, r, 1) ^ i.default.rotrSL(t, r, 8) ^ i.default.shrSL(t, r, 7),
                            s = 0 | c[e - 2],
                            a = 0 | l[e - 2],
                            u = i.default.rotrSH(s, a, 19) ^ i.default.rotrBH(s, a, 61) ^ i.default.shrSH(s, a, 6),
                            f = i.default.rotrSL(s, a, 19) ^ i.default.rotrBL(s, a, 61) ^ i.default.shrSL(s, a, 6),
                            h = i.default.add4L(o, f, l[e - 7], l[e - 16]),
                            d = i.default.add4H(h, n, u, c[e - 7], c[e - 16]);
                        c[e] = 0 | d, l[e] = 0 | h
                    }
                    let {
                        Ah: r,
                        Al: n,
                        Bh: o,
                        Bl: u,
                        Ch: f,
                        Cl: h,
                        Dh: d,
                        Dl: p,
                        Eh: g,
                        El: y,
                        Fh: m,
                        Fl: b,
                        Gh: w,
                        Gl: v,
                        Hh: E,
                        Hl: x
                    } = this;
                    for (let e = 0; e < 80; e++) {
                        let t = i.default.rotrSH(g, y, 14) ^ i.default.rotrSH(g, y, 18) ^ i.default.rotrBH(g, y, 41),
                            A = i.default.rotrSL(g, y, 14) ^ i.default.rotrSL(g, y, 18) ^ i.default.rotrBL(g, y, 41),
                            S = g & m ^ ~g & w,
                            T = y & b ^ ~y & v,
                            k = i.default.add5L(x, A, T, a[e], l[e]),
                            I = i.default.add5H(k, E, t, S, s[e], c[e]),
                            C = 0 | k,
                            B = i.default.rotrSH(r, n, 28) ^ i.default.rotrBH(r, n, 34) ^ i.default.rotrBH(r, n, 39),
                            O = i.default.rotrSL(r, n, 28) ^ i.default.rotrBL(r, n, 34) ^ i.default.rotrBL(r, n, 39),
                            j = r & o ^ r & f ^ o & f,
                            M = n & u ^ n & h ^ u & h;
                        E = 0 | w, x = 0 | v, w = 0 | m, v = 0 | b, m = 0 | g, b = 0 | y, ({
                            h: g,
                            l: y
                        } = i.default.add(0 | d, 0 | p, 0 | I, 0 | C)), d = 0 | f, p = 0 | h, f = 0 | o, h = 0 | u, o = 0 | r, u = 0 | n;
                        let _ = i.default.add3L(C, O, M);
                        r = i.default.add3H(_, I, B, j), n = 0 | _
                    }({
                        h: r,
                        l: n
                    } = i.default.add(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)), ({
                        h: o,
                        l: u
                    } = i.default.add(0 | this.Bh, 0 | this.Bl, 0 | o, 0 | u)), ({
                        h: f,
                        l: h
                    } = i.default.add(0 | this.Ch, 0 | this.Cl, 0 | f, 0 | h)), ({
                        h: d,
                        l: p
                    } = i.default.add(0 | this.Dh, 0 | this.Dl, 0 | d, 0 | p)), ({
                        h: g,
                        l: y
                    } = i.default.add(0 | this.Eh, 0 | this.El, 0 | g, 0 | y)), ({
                        h: m,
                        l: b
                    } = i.default.add(0 | this.Fh, 0 | this.Fl, 0 | m, 0 | b)), ({
                        h: w,
                        l: v
                    } = i.default.add(0 | this.Gh, 0 | this.Gl, 0 | w, 0 | v)), ({
                        h: E,
                        l: x
                    } = i.default.add(0 | this.Hh, 0 | this.Hl, 0 | E, 0 | x)), this.set(r, n, o, u, f, h, d, p, g, y, m, b, w, v, E, x)
                }
                roundClean() {
                    c.fill(0), l.fill(0)
                }
                destroy() {
                    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                }
            }
            t.SHA512 = u;
            class f extends u {
                constructor() {
                    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28
                }
            }
            class h extends u {
                constructor() {
                    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32
                }
            }
            class d extends u {
                constructor() {
                    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48
                }
            }
            t.sha512 = (0, o.wrapConstructor)(() => new u), t.sha512_224 = (0, o.wrapConstructor)(() => new f), t.sha512_256 = (0, o.wrapConstructor)(() => new h), t.sha384 = (0, o.wrapConstructor)(() => new d)
        },
        8089: function(e, t, r) {
            "use strict"; /*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.randomBytes = t.wrapConstructorWithOpts = t.wrapConstructor = t.checkOpts = t.Hash = t.concatBytes = t.toBytes = t.utf8ToBytes = t.asyncLoop = t.nextTick = t.hexToBytes = t.bytesToHex = t.isLE = t.rotr = t.createView = t.u32 = t.u8 = void 0;
            let n = r(1945),
                i = e => new Uint8Array(e.buffer, e.byteOffset, e.byteLength);
            t.u8 = i;
            let o = e => new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4));
            t.u32 = o;
            let s = e => new DataView(e.buffer, e.byteOffset, e.byteLength);
            if (t.createView = s, t.rotr = (e, t) => e << 32 - t | e >>> t, t.isLE = 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0], !t.isLE) throw Error("Non little-endian hardware is not supported");
            let a = Array.from({
                length: 256
            }, (e, t) => t.toString(16).padStart(2, "0"));
            t.bytesToHex = function(e) {
                if (!(e instanceof Uint8Array)) throw Error("Uint8Array expected");
                let t = "";
                for (let r = 0; r < e.length; r++) t += a[e[r]];
                return t
            }, t.hexToBytes = function(e) {
                if ("string" != typeof e) throw TypeError("hexToBytes: expected string, got " + typeof e);
                if (e.length % 2) throw Error("hexToBytes: received invalid unpadded hex");
                let t = new Uint8Array(e.length / 2);
                for (let r = 0; r < t.length; r++) {
                    let n = 2 * r,
                        i = e.slice(n, n + 2),
                        o = Number.parseInt(i, 16);
                    if (Number.isNaN(o) || o < 0) throw Error("Invalid byte sequence");
                    t[r] = o
                }
                return t
            };
            let c = async () => {};
            async function l(e, r, n) {
                let i = Date.now();
                for (let o = 0; o < e; o++) {
                    n(o);
                    let e = Date.now() - i;
                    e >= 0 && e < r || (await (0, t.nextTick)(), i += e)
                }
            }

            function u(e) {
                if ("string" != typeof e) throw TypeError(`utf8ToBytes expected string, got ${typeof e}`);
                return new TextEncoder().encode(e)
            }

            function f(e) {
                if ("string" == typeof e && (e = u(e)), !(e instanceof Uint8Array)) throw TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
                return e
            }
            t.nextTick = c, t.asyncLoop = l, t.utf8ToBytes = u, t.toBytes = f, t.concatBytes = function(...e) {
                if (!e.every(e => e instanceof Uint8Array)) throw Error("Uint8Array list expected");
                if (1 === e.length) return e[0];
                let t = e.reduce((e, t) => e + t.length, 0),
                    r = new Uint8Array(t);
                for (let t = 0, n = 0; t < e.length; t++) {
                    let i = e[t];
                    r.set(i, n), n += i.length
                }
                return r
            }, t.Hash = class {
                clone() {
                    return this._cloneInto()
                }
            };
            let h = e => "[object Object]" === Object.prototype.toString.call(e) && e.constructor === Object;
            t.checkOpts = function(e, t) {
                if (void 0 !== t && ("object" != typeof t || !h(t))) throw TypeError("Options should be object or undefined");
                let r = Object.assign(e, t);
                return r
            }, t.wrapConstructor = function(e) {
                let t = t => e().update(f(t)).digest(),
                    r = e();
                return t.outputLen = r.outputLen, t.blockLen = r.blockLen, t.create = () => e(), t
            }, t.wrapConstructorWithOpts = function(e) {
                let t = (t, r) => e(r).update(f(t)).digest(),
                    r = e({});
                return t.outputLen = r.outputLen, t.blockLen = r.blockLen, t.create = t => e(t), t
            }, t.randomBytes = function(e = 32) {
                if (n.crypto && "function" == typeof n.crypto.getRandomValues) return n.crypto.getRandomValues(new Uint8Array(e));
                throw Error("crypto.getRandomValues must be defined")
            }
        },
        9187: function(e, t) {
            "use strict";

            function r(e) {
                if (!Number.isSafeInteger(e)) throw Error(`Wrong integer: ${e}`)
            }

            function n(...e) {
                let t = (e, t) => r => e(t(r)),
                    r = Array.from(e).reverse().reduce((e, r) => e ? t(e, r.encode) : r.encode, void 0),
                    i = e.reduce((e, r) => e ? t(e, r.decode) : r.decode, void 0);
                return {
                    encode: r,
                    decode: i
                }
            }

            function i(e) {
                return {
                    encode: t => {
                        if (!Array.isArray(t) || t.length && "number" != typeof t[0]) throw Error("alphabet.encode input should be an array of numbers");
                        return t.map(t => {
                            if (r(t), t < 0 || t >= e.length) throw Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);
                            return e[t]
                        })
                    },
                    decode: t => {
                        if (!Array.isArray(t) || t.length && "string" != typeof t[0]) throw Error("alphabet.decode input should be array of strings");
                        return t.map(t => {
                            if ("string" != typeof t) throw Error(`alphabet.decode: not string element=${t}`);
                            let r = e.indexOf(t);
                            if (-1 === r) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
                            return r
                        })
                    }
                }
            }

            function o(e = "") {
                if ("string" != typeof e) throw Error("join separator should be string");
                return {
                    encode: t => {
                        if (!Array.isArray(t) || t.length && "string" != typeof t[0]) throw Error("join.encode input should be array of strings");
                        for (let e of t)
                            if ("string" != typeof e) throw Error(`join.encode: non-string input=${e}`);
                        return t.join(e)
                    },
                    decode: t => {
                        if ("string" != typeof t) throw Error("join.decode input should be string");
                        return t.split(e)
                    }
                }
            }

            function s(e, t = "=") {
                if (r(e), "string" != typeof t) throw Error("padding chr should be string");
                return {
                    encode(r) {
                        if (!Array.isArray(r) || r.length && "string" != typeof r[0]) throw Error("padding.encode input should be array of strings");
                        for (let e of r)
                            if ("string" != typeof e) throw Error(`padding.encode: non-string input=${e}`);
                        for (; r.length * e % 8;) r.push(t);
                        return r
                    },
                    decode(r) {
                        if (!Array.isArray(r) || r.length && "string" != typeof r[0]) throw Error("padding.encode input should be array of strings");
                        for (let e of r)
                            if ("string" != typeof e) throw Error(`padding.decode: non-string input=${e}`);
                        let n = r.length;
                        if (n * e % 8) throw Error("Invalid padding: string should have whole number of bytes");
                        for (; n > 0 && r[n - 1] === t; n--)
                            if (!((n - 1) * e % 8)) throw Error("Invalid padding: string has too much padding");
                        return r.slice(0, n)
                    }
                }
            }

            function a(e) {
                if ("function" != typeof e) throw Error("normalize fn should be function");
                return {
                    encode: e => e,
                    decode: t => e(t)
                }
            }

            function c(e, t, n) {
                if (t < 2) throw Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);
                if (n < 2) throw Error(`convertRadix: wrong to=${n}, base cannot be less than 2`);
                if (!Array.isArray(e)) throw Error("convertRadix: data should be array");
                if (!e.length) return [];
                let i = 0,
                    o = [],
                    s = Array.from(e);
                for (s.forEach(e => {
                        if (r(e), e < 0 || e >= t) throw Error(`Wrong integer: ${e}`)
                    });;) {
                    let e = 0,
                        r = !0;
                    for (let o = i; o < s.length; o++) {
                        let a = s[o],
                            c = t * e + a;
                        if (!Number.isSafeInteger(c) || t * e / t !== e || c - a != t * e || (e = c % n, s[o] = Math.floor(c / n), !Number.isSafeInteger(s[o]) || s[o] * n + e !== c)) throw Error("convertRadix: carry overflow");
                        r && (s[o] ? r = !1 : i = o)
                    }
                    if (o.push(e), r) break
                }
                for (let t = 0; t < e.length - 1 && 0 === e[t]; t++) o.push(0);
                return o.reverse()
            } /*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.bytes = t.stringToBytes = t.str = t.bytesToString = t.hex = t.utf8 = t.bech32m = t.bech32 = t.base58check = t.base58xmr = t.base58xrp = t.base58flickr = t.base58 = t.base64url = t.base64 = t.base32crockford = t.base32hex = t.base32 = t.base16 = t.utils = t.assertNumber = void 0, t.assertNumber = r;
            let l = (e, t) => t ? l(t, e % t) : e,
                u = (e, t) => e + (t - l(e, t));

            function f(e, t, n, i) {
                if (!Array.isArray(e)) throw Error("convertRadix2: data should be array");
                if (t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
                if (n <= 0 || n > 32) throw Error(`convertRadix2: wrong to=${n}`);
                if (u(t, n) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${n} carryBits=${u(t,n)}`);
                let o = 0,
                    s = 0,
                    a = 2 ** n - 1,
                    c = [];
                for (let i of e) {
                    if (r(i), i >= 2 ** t) throw Error(`convertRadix2: invalid data word=${i} from=${t}`);
                    if (o = o << t | i, s + t > 32) throw Error(`convertRadix2: carry overflow pos=${s} from=${t}`);
                    for (s += t; s >= n; s -= n) c.push((o >> s - n & a) >>> 0);
                    o &= 2 ** s - 1
                }
                if (o = o << n - s & a, !i && s >= t) throw Error("Excess padding");
                if (!i && o) throw Error(`Non-zero padding: ${o}`);
                return i && s > 0 && c.push(o >>> 0), c
            }

            function h(e) {
                return r(e), {
                    encode: t => {
                        if (!(t instanceof Uint8Array)) throw Error("radix.encode input should be Uint8Array");
                        return c(Array.from(t), 256, e)
                    },
                    decode: t => {
                        if (!Array.isArray(t) || t.length && "number" != typeof t[0]) throw Error("radix.decode input should be array of strings");
                        return Uint8Array.from(c(t, e, 256))
                    }
                }
            }

            function d(e, t = !1) {
                if (r(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
                if (u(8, e) > 32 || u(e, 8) > 32) throw Error("radix2: carry overflow");
                return {
                    encode: r => {
                        if (!(r instanceof Uint8Array)) throw Error("radix2.encode input should be Uint8Array");
                        return f(Array.from(r), 8, e, !t)
                    },
                    decode: r => {
                        if (!Array.isArray(r) || r.length && "number" != typeof r[0]) throw Error("radix2.decode input should be array of strings");
                        return Uint8Array.from(f(r, e, 8, t))
                    }
                }
            }

            function p(e) {
                if ("function" != typeof e) throw Error("unsafeWrapper fn should be function");
                return function(...t) {
                    try {
                        return e.apply(null, t)
                    } catch (e) {}
                }
            }

            function g(e, t) {
                if (r(e), "function" != typeof t) throw Error("checksum fn should be function");
                return {
                    encode(r) {
                        if (!(r instanceof Uint8Array)) throw Error("checksum.encode: input should be Uint8Array");
                        let n = t(r).slice(0, e),
                            i = new Uint8Array(r.length + e);
                        return i.set(r), i.set(n, r.length), i
                    },
                    decode(r) {
                        if (!(r instanceof Uint8Array)) throw Error("checksum.decode: input should be Uint8Array");
                        let n = r.slice(0, -e),
                            i = t(n).slice(0, e),
                            o = r.slice(-e);
                        for (let t = 0; t < e; t++)
                            if (i[t] !== o[t]) throw Error("Invalid checksum");
                        return n
                    }
                }
            }
            t.utils = {
                alphabet: i,
                chain: n,
                checksum: g,
                radix: h,
                radix2: d,
                join: o,
                padding: s
            }, t.base16 = n(d(4), i("0123456789ABCDEF"), o("")), t.base32 = n(d(5), i("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), s(5), o("")), t.base32hex = n(d(5), i("0123456789ABCDEFGHIJKLMNOPQRSTUV"), s(5), o("")), t.base32crockford = n(d(5), i("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), o(""), a(e => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1"))), t.base64 = n(d(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), s(6), o("")), t.base64url = n(d(6), i("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), s(6), o(""));
            let y = e => n(h(58), i(e), o(""));
            t.base58 = y("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"), t.base58flickr = y("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), t.base58xrp = y("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
            let m = [0, 2, 3, 5, 6, 7, 9, 10, 11];
            t.base58xmr = {
                encode(e) {
                    let r = "";
                    for (let n = 0; n < e.length; n += 8) {
                        let i = e.subarray(n, n + 8);
                        r += t.base58.encode(i).padStart(m[i.length], "1")
                    }
                    return r
                },
                decode(e) {
                    let r = [];
                    for (let n = 0; n < e.length; n += 11) {
                        let i = e.slice(n, n + 11),
                            o = m.indexOf(i.length),
                            s = t.base58.decode(i);
                        for (let e = 0; e < s.length - o; e++)
                            if (0 !== s[e]) throw Error("base58xmr: wrong padding");
                        r = r.concat(Array.from(s.slice(s.length - o)))
                    }
                    return Uint8Array.from(r)
                }
            };
            let b = e => n(g(4, t => e(e(t))), t.base58);
            t.base58check = b;
            let w = n(i("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), o("")),
                v = [996825010, 642813549, 513874426, 1027748829, 705979059];

            function E(e) {
                let t = e >> 25,
                    r = (33554431 & e) << 5;
                for (let e = 0; e < v.length; e++)(t >> e & 1) == 1 && (r ^= v[e]);
                return r
            }

            function x(e, t, r = 1) {
                let n = e.length,
                    i = 1;
                for (let t = 0; t < n; t++) {
                    let r = e.charCodeAt(t);
                    if (r < 33 || r > 126) throw Error(`Invalid prefix (${e})`);
                    i = E(i) ^ r >> 5
                }
                i = E(i);
                for (let t = 0; t < n; t++) i = E(i) ^ 31 & e.charCodeAt(t);
                for (let e of t) i = E(i) ^ e;
                for (let e = 0; e < 6; e++) i = E(i);
                return i ^= r, w.encode(f([i % 1073741824], 30, 5, !1))
            }

            function A(e) {
                let t = "bech32" === e ? 1 : 734539939,
                    r = d(5),
                    n = r.decode,
                    i = r.encode,
                    o = p(n);

                function s(e, r = 90) {
                    if ("string" != typeof e) throw Error(`bech32.decode input should be string, not ${typeof e}`);
                    if (e.length < 8 || !1 !== r && e.length > r) throw TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${r})`);
                    let n = e.toLowerCase();
                    if (e !== n && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
                    e = n;
                    let i = e.lastIndexOf("1");
                    if (0 === i || -1 === i) throw Error('Letter "1" must be present between prefix and data only');
                    let o = e.slice(0, i),
                        s = e.slice(i + 1);
                    if (s.length < 6) throw Error("Data must be at least 6 characters long");
                    let a = w.decode(s).slice(0, -6),
                        c = x(o, a, t);
                    if (!s.endsWith(c)) throw Error(`Invalid checksum in ${e}: expected "${c}"`);
                    return {
                        prefix: o,
                        words: a
                    }
                }
                let a = p(s);
                return {
                    encode: function(e, r, n = 90) {
                        if ("string" != typeof e) throw Error(`bech32.encode prefix should be string, not ${typeof e}`);
                        if (!Array.isArray(r) || r.length && "number" != typeof r[0]) throw Error(`bech32.encode words should be array of numbers, not ${typeof r}`);
                        let i = e.length + 7 + r.length;
                        if (!1 !== n && i > n) throw TypeError(`Length ${i} exceeds limit ${n}`);
                        return e = e.toLowerCase(), `${e}1${w.encode(r)}${x(e,r,t)}`
                    },
                    decode: s,
                    decodeToBytes: function(e) {
                        let {
                            prefix: t,
                            words: r
                        } = s(e, !1);
                        return {
                            prefix: t,
                            words: r,
                            bytes: n(r)
                        }
                    },
                    decodeUnsafe: a,
                    fromWords: n,
                    fromWordsUnsafe: o,
                    toWords: i
                }
            }
            t.bech32 = A("bech32"), t.bech32m = A("bech32m"), t.utf8 = {
                encode: e => new TextDecoder().decode(e),
                decode: e => new TextEncoder().encode(e)
            }, t.hex = n(d(4), i("0123456789abcdef"), o(""), a(e => {
                if ("string" != typeof e || e.length % 2) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
                return e.toLowerCase()
            }));
            let S = {
                    utf8: t.utf8,
                    hex: t.hex,
                    base16: t.base16,
                    base32: t.base32,
                    base64: t.base64,
                    base64url: t.base64url,
                    base58: t.base58,
                    base58xmr: t.base58xmr
                },
                T = `Invalid encoding type. Available types: ${Object.keys(S).join(", ")}`,
                k = (e, t) => {
                    if ("string" != typeof e || !S.hasOwnProperty(e)) throw TypeError(T);
                    if (!(t instanceof Uint8Array)) throw TypeError("bytesToString() expects Uint8Array");
                    return S[e].encode(t)
                };
            t.bytesToString = k, t.str = t.bytesToString;
            let I = (e, t) => {
                if (!S.hasOwnProperty(e)) throw TypeError(T);
                if ("string" != typeof t) throw TypeError("stringToBytes() expects string");
                return S[e].decode(t)
            };
            t.stringToBytes = I, t.bytes = t.stringToBytes
        },
        7286: function(e, t, r) {
            "use strict";
            t.Z1 = void 0; /*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
            let n = r(7320),
                i = r(9023),
                o = r(3061),
                s = r(6262),
                a = (r(8089), r(9187));

            function c(e) {
                if ("string" != typeof e) throw TypeError(`Invalid mnemonic type: ${typeof e}`);
                return e.normalize("NFKD")
            }
            let l = e => {
                    let t = 8 - e.length / 4;
                    return new Uint8Array([(0, o.sha256)(e)[0] >> t << t])
                },
                u = e => c(`mnemonic${e}`);
            t.Z1 = function(e, t = "") {
                return (0, i.pbkdf2)(s.sha512, function(e) {
                    let t = c(e),
                        r = t.split(" ");
                    if (![12, 15, 18, 21, 24].includes(r.length)) throw Error("Invalid mnemonic");
                    return {
                        nfkd: t,
                        words: r
                    }
                }(e).nfkd, u(t), {
                    c: 2048,
                    dkLen: 64
                })
            }
        },
        1990: function(e) {
            function t(e) {
                return /^\d+\.\d+\.\d+$/.test(e)
            }

            function r(e) {
                if (!t(e)) throw Error("Invalid semver version: " + e);
                let [r, n, i] = e.split(".").map(e => parseInt(e, 10));
                return {
                    major: r,
                    minor: n,
                    patch: i
                }
            }
            e.exports = {
                isValid: t,
                parse: r,
                lt: function(e, t) {
                    let n = r(e),
                        i = r(t);
                    return n.major !== i.major ? n.major < i.major : n.minor !== i.minor ? n.minor < i.minor : n.patch !== i.patch && n.patch < i.patch
                },
                lte: function(e, t) {
                    let n = r(e),
                        i = r(t);
                    return n.major !== i.major ? n.major <= i.major : n.minor !== i.minor ? n.minor <= i.minor : n.patch === i.patch || n.patch <= i.patch
                },
                gt: function(e, t) {
                    let n = r(e),
                        i = r(t);
                    return n.major !== i.major ? n.major > i.major : n.minor !== i.minor ? n.minor > i.minor : n.patch !== i.patch && n.patch > i.patch
                },
                gte: function(e, t) {
                    let n = r(e),
                        i = r(t);
                    return n.major !== i.major ? n.major >= i.major : n.minor !== i.minor ? n.minor >= i.minor : n.patch === i.patch || n.patch >= i.patch
                },
                eq: function(e, t) {
                    return r(e), r(t), e === t
                }
            }
        },
        8162: function(e) {
            "use strict";
            e.exports = function(e) {
                if (e.length >= 255) throw TypeError("Alphabet too long");
                for (var t = new Uint8Array(256), r = 0; r < t.length; r++) t[r] = 255;
                for (var n = 0; n < e.length; n++) {
                    var i = e.charAt(n),
                        o = i.charCodeAt(0);
                    if (255 !== t[o]) throw TypeError(i + " is ambiguous");
                    t[o] = n
                }
                var s = e.length,
                    a = e.charAt(0),
                    c = Math.log(s) / Math.log(256),
                    l = Math.log(256) / Math.log(s);

                function u(e) {
                    if ("string" != typeof e) throw TypeError("Expected String");
                    if (0 === e.length) return new Uint8Array;
                    for (var r = 0, n = 0, i = 0; e[r] === a;) n++, r++;
                    for (var o = (e.length - r) * c + 1 >>> 0, l = new Uint8Array(o); e[r];) {
                        var u = t[e.charCodeAt(r)];
                        if (255 === u) return;
                        for (var f = 0, h = o - 1;
                            (0 !== u || f < i) && -1 !== h; h--, f++) u += s * l[h] >>> 0, l[h] = u % 256 >>> 0, u = u / 256 >>> 0;
                        if (0 !== u) throw Error("Non-zero carry");
                        i = f, r++
                    }
                    for (var d = o - i; d !== o && 0 === l[d];) d++;
                    for (var p = new Uint8Array(n + (o - d)), g = n; d !== o;) p[g++] = l[d++];
                    return p
                }
                return {
                    encode: function(t) {
                        if (t instanceof Uint8Array || (ArrayBuffer.isView(t) ? t = new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : Array.isArray(t) && (t = Uint8Array.from(t))), !(t instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
                        if (0 === t.length) return "";
                        for (var r = 0, n = 0, i = 0, o = t.length; i !== o && 0 === t[i];) i++, r++;
                        for (var c = (o - i) * l + 1 >>> 0, u = new Uint8Array(c); i !== o;) {
                            for (var f = t[i], h = 0, d = c - 1;
                                (0 !== f || h < n) && -1 !== d; d--, h++) f += 256 * u[d] >>> 0, u[d] = f % s >>> 0, f = f / s >>> 0;
                            if (0 !== f) throw Error("Non-zero carry");
                            n = h, i++
                        }
                        for (var p = c - n; p !== c && 0 === u[p];) p++;
                        for (var g = a.repeat(r); p < c; ++p) g += e.charAt(u[p]);
                        return g
                    },
                    decodeUnsafe: u,
                    decode: function(e) {
                        var t = u(e);
                        if (t) return t;
                        throw Error("Non-base" + s + " character")
                    }
                }
            }
        },
        7191: function(e, t, r) {
            let n = r(8162);
            e.exports = n("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
        },
        6729: function(e) {
            "use strict";
            var t = Object.prototype.hasOwnProperty,
                r = "~";

            function n() {}

            function i(e, t, r) {
                this.fn = e, this.context = t, this.once = r || !1
            }

            function o(e, t, n, o, s) {
                if ("function" != typeof n) throw TypeError("The listener must be a function");
                var a = new i(n, o || e, s),
                    c = r ? r + t : t;
                return e._events[c] ? e._events[c].fn ? e._events[c] = [e._events[c], a] : e._events[c].push(a) : (e._events[c] = a, e._eventsCount++), e
            }

            function s(e, t) {
                0 == --e._eventsCount ? e._events = new n : delete e._events[t]
            }

            function a() {
                this._events = new n, this._eventsCount = 0
            }
            Object.create && (n.prototype = Object.create(null), new n().__proto__ || (r = !1)), a.prototype.eventNames = function() {
                var e, n, i = [];
                if (0 === this._eventsCount) return i;
                for (n in e = this._events) t.call(e, n) && i.push(r ? n.slice(1) : n);
                return Object.getOwnPropertySymbols ? i.concat(Object.getOwnPropertySymbols(e)) : i
            }, a.prototype.listeners = function(e) {
                var t = r ? r + e : e,
                    n = this._events[t];
                if (!n) return [];
                if (n.fn) return [n.fn];
                for (var i = 0, o = n.length, s = Array(o); i < o; i++) s[i] = n[i].fn;
                return s
            }, a.prototype.listenerCount = function(e) {
                var t = r ? r + e : e,
                    n = this._events[t];
                return n ? n.fn ? 1 : n.length : 0
            }, a.prototype.emit = function(e, t, n, i, o, s) {
                var a = r ? r + e : e;
                if (!this._events[a]) return !1;
                var c, l, u = this._events[a],
                    f = arguments.length;
                if (u.fn) {
                    switch (u.once && this.removeListener(e, u.fn, void 0, !0), f) {
                        case 1:
                            return u.fn.call(u.context), !0;
                        case 2:
                            return u.fn.call(u.context, t), !0;
                        case 3:
                            return u.fn.call(u.context, t, n), !0;
                        case 4:
                            return u.fn.call(u.context, t, n, i), !0;
                        case 5:
                            return u.fn.call(u.context, t, n, i, o), !0;
                        case 6:
                            return u.fn.call(u.context, t, n, i, o, s), !0
                    }
                    for (l = 1, c = Array(f - 1); l < f; l++) c[l - 1] = arguments[l];
                    u.fn.apply(u.context, c)
                } else {
                    var h, d = u.length;
                    for (l = 0; l < d; l++) switch (u[l].once && this.removeListener(e, u[l].fn, void 0, !0), f) {
                        case 1:
                            u[l].fn.call(u[l].context);
                            break;
                        case 2:
                            u[l].fn.call(u[l].context, t);
                            break;
                        case 3:
                            u[l].fn.call(u[l].context, t, n);
                            break;
                        case 4:
                            u[l].fn.call(u[l].context, t, n, i);
                            break;
                        default:
                            if (!c)
                                for (h = 1, c = Array(f - 1); h < f; h++) c[h - 1] = arguments[h];
                            u[l].fn.apply(u[l].context, c)
                    }
                }
                return !0
            }, a.prototype.on = function(e, t, r) {
                return o(this, e, t, r, !1)
            }, a.prototype.once = function(e, t, r) {
                return o(this, e, t, r, !0)
            }, a.prototype.removeListener = function(e, t, n, i) {
                var o = r ? r + e : e;
                if (!this._events[o]) return this;
                if (!t) return s(this, o), this;
                var a = this._events[o];
                if (a.fn) a.fn !== t || i && !a.once || n && a.context !== n || s(this, o);
                else {
                    for (var c = 0, l = [], u = a.length; c < u; c++)(a[c].fn !== t || i && !a[c].once || n && a[c].context !== n) && l.push(a[c]);
                    l.length ? this._events[o] = 1 === l.length ? l[0] : l : s(this, o)
                }
                return this
            }, a.prototype.removeAllListeners = function(e) {
                var t;
                return e ? (t = r ? r + e : e, this._events[t] && s(this, t)) : (this._events = new n, this._eventsCount = 0), this
            }, a.prototype.off = a.prototype.removeListener, a.prototype.addListener = a.prototype.on, a.prefixed = r, a.EventEmitter = a, e.exports = a
        },
        1198: function(e, t, r) {
            "use strict";
            let n = r(4880).v4,
                i = r(7741),
                o = function(e, t) {
                    if (!(this instanceof o)) return new o(e, t);
                    t || (t = {}), this.options = {
                        reviver: void 0 !== t.reviver ? t.reviver : null,
                        replacer: void 0 !== t.replacer ? t.replacer : null,
                        generator: void 0 !== t.generator ? t.generator : function() {
                            return n()
                        },
                        version: void 0 !== t.version ? t.version : 2,
                        notificationIdNull: "boolean" == typeof t.notificationIdNull && t.notificationIdNull
                    }, this.callServer = e
                };
            e.exports = o, o.prototype.request = function(e, t, r, n) {
                let o;
                let s = this,
                    a = null,
                    c = Array.isArray(e) && "function" == typeof t;
                if (1 === this.options.version && c) throw TypeError("JSON-RPC 1.0 does not support batching");
                if (c || !c && e && "object" == typeof e && "function" == typeof t) n = t, a = e;
                else {
                    "function" == typeof r && (n = r, r = void 0);
                    let o = "function" == typeof n;
                    try {
                        a = i(e, t, r, {
                            generator: this.options.generator,
                            version: this.options.version,
                            notificationIdNull: this.options.notificationIdNull
                        })
                    } catch (e) {
                        if (o) return n(e);
                        throw e
                    }
                    if (!o) return a
                }
                try {
                    o = JSON.stringify(a, this.options.replacer)
                } catch (e) {
                    return n(e)
                }
                return this.callServer(o, function(e, t) {
                    s._parseResponse(e, t, n)
                }), a
            }, o.prototype._parseResponse = function(e, t, r) {
                let n;
                if (e) {
                    r(e);
                    return
                }
                if (!t) return r();
                try {
                    n = JSON.parse(t, this.options.reviver)
                } catch (e) {
                    return r(e)
                }
                if (3 === r.length) {
                    if (!Array.isArray(n)) return r(null, n.error, n.result);
                    {
                        let e = function(e) {
                            return void 0 !== e.error
                        };
                        return r(null, n.filter(e), n.filter(function(t) {
                            return !e(t)
                        }))
                    }
                }
                r(null, n)
            }
        },
        7741: function(e, t, r) {
            "use strict";
            let n = r(4880).v4;
            e.exports = function(e, t, r, i) {
                if ("string" != typeof e) throw TypeError(e + " must be a string");
                i = i || {};
                let o = "number" == typeof i.version ? i.version : 2;
                if (1 !== o && 2 !== o) throw TypeError(o + " must be 1 or 2");
                let s = {
                    method: e
                };
                if (2 === o && (s.jsonrpc = "2.0"), t) {
                    if ("object" != typeof t && !Array.isArray(t)) throw TypeError(t + " must be an object, array or omitted");
                    s.params = t
                }
                if (void 0 === r) {
                    let e = "function" == typeof i.generator ? i.generator : function() {
                        return n()
                    };
                    s.id = e(s, i)
                } else 2 === o && null === r ? i.notificationIdNull && (s.id = null) : s.id = r;
                return s
            }
        },
        3454: function(e, t, r) {
            "use strict";
            var n, i;
            e.exports = (null == (n = r.g.process) ? void 0 : n.env) && "object" == typeof(null == (i = r.g.process) ? void 0 : i.env) ? r.g.process : r(7663)
        },
        6840: function(e, t, r) {
            (window.__NEXT_P = window.__NEXT_P || []).push(["/_app", function() {
                return r(8372)
            }])
        },
        8372: function(e, t, r) {
            "use strict";
            r.r(t), r.d(t, {
                default: function() {
                    return y
                }
            });
            var n = r(5893),
                i = r(5967),
                o = r(7294),
                s = r(8804),
                a = r(5091),
                c = r(6178);
            let l = ({
                    ethosConfiguration: e,
                    onWalletConnected: t,
                    connectMessage: r,
                    dappName: n,
                    dappIcon: i,
                    children: l
                }) => {
                    let u = (0, c.Z)({
                        configuration: e || {},
                        onWalletConnected: t
                    });
                    return o.createElement(a.Z.Provider, {
                        value: u
                    }, l, o.createElement(s.ZP, {
                        isOpen: u.modal?.isModalOpen || !1,
                        hideEmailSignIn: u.ethosConfiguration?.hideEmailSignIn || !1,
                        hideWalletSignIn: u.ethosConfiguration?.hideWalletSignIn || !1,
                        connectMessage: r,
                        dappName: n,
                        dappIcon: i,
                        preferredWallets: e?.preferredWallets
                    }))
                },
                u = () => (0, n.jsx)("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    height: 56,
                    width: 56,
                    viewBox: "0 0 24 24",
                    strokeWidth: 1.5,
                    stroke: "currentColor",
                    children: (0, n.jsx)("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        d: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                    })
                });
            r(3814);
            var f = r(3454);
            let h = f.env.NETWORK || f.env.NEXT_PUBLIC_NETWORK;
            f.env.FAUCET || f.env.NEXT_PUBLIC_FAUCET;
            var d = r(9008),
                p = r.n(d),
                g = r(3454),
                y = function(e) {
                    let {
                        Component: t,
                        pageProps: r
                    } = e, o = {
                        apiKey: g.env.NEXT_PUBLIC_ETHOS_API_KEY,
                        preferredWallets: ["Ethos Wallet"],
                        network: h,
                        chain: i.q.SUI_TESTNET
                    };
                    return (0, n.jsxs)(l, {
                        ethosConfiguration: o,
                        dappName: "Soundbeats",
                        dappIcon: (0, n.jsx)(u, {}),
                        connectMessage: "Welcome to Soundbeats",
                        children: [(0, n.jsx)(p(), {
                            children: (0, n.jsx)("title", {
                                children: "Soundbeats on Sui"
                            })
                        }), (0, n.jsx)(t, {
                            ...r
                        })]
                    })
                }
        },
        1876: function(e) {
            ! function() {
                var t = {
                        675: function(e, t) {
                            "use strict";
                            t.byteLength = function(e) {
                                var t = c(e),
                                    r = t[0],
                                    n = t[1];
                                return (r + n) * 3 / 4 - n
                            }, t.toByteArray = function(e) {
                                var t, r, o = c(e),
                                    s = o[0],
                                    a = o[1],
                                    l = new i((s + a) * 3 / 4 - a),
                                    u = 0,
                                    f = a > 0 ? s - 4 : s;
                                for (r = 0; r < f; r += 4) t = n[e.charCodeAt(r)] << 18 | n[e.charCodeAt(r + 1)] << 12 | n[e.charCodeAt(r + 2)] << 6 | n[e.charCodeAt(r + 3)], l[u++] = t >> 16 & 255, l[u++] = t >> 8 & 255, l[u++] = 255 & t;
                                return 2 === a && (t = n[e.charCodeAt(r)] << 2 | n[e.charCodeAt(r + 1)] >> 4, l[u++] = 255 & t), 1 === a && (t = n[e.charCodeAt(r)] << 10 | n[e.charCodeAt(r + 1)] << 4 | n[e.charCodeAt(r + 2)] >> 2, l[u++] = t >> 8 & 255, l[u++] = 255 & t), l
                            }, t.fromByteArray = function(e) {
                                for (var t, n = e.length, i = n % 3, o = [], s = 0, a = n - i; s < a; s += 16383) o.push(function(e, t, n) {
                                    for (var i, o = [], s = t; s < n; s += 3) o.push(r[(i = (e[s] << 16 & 16711680) + (e[s + 1] << 8 & 65280) + (255 & e[s + 2])) >> 18 & 63] + r[i >> 12 & 63] + r[i >> 6 & 63] + r[63 & i]);
                                    return o.join("")
                                }(e, s, s + 16383 > a ? a : s + 16383));
                                return 1 === i ? o.push(r[(t = e[n - 1]) >> 2] + r[t << 4 & 63] + "==") : 2 === i && o.push(r[(t = (e[n - 2] << 8) + e[n - 1]) >> 10] + r[t >> 4 & 63] + r[t << 2 & 63] + "="), o.join("")
                            };
                            for (var r = [], n = [], i = "undefined" != typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = 0, a = o.length; s < a; ++s) r[s] = o[s], n[o.charCodeAt(s)] = s;

                            function c(e) {
                                var t = e.length;
                                if (t % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
                                var r = e.indexOf("="); - 1 === r && (r = t);
                                var n = r === t ? 0 : 4 - r % 4;
                                return [r, n]
                            }
                            n["-".charCodeAt(0)] = 62, n["_".charCodeAt(0)] = 63
                        },
                        72: function(e, t, r) {
                            "use strict";
                            /*!
                             * The buffer module from node.js, for the browser.
                             *
                             * @author   Feross Aboukhadijeh <https://feross.org>
                             * @license  MIT
                             */
                            var n = r(675),
                                i = r(783),
                                o = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;

                            function s(e) {
                                if (e > 2147483647) throw RangeError('The value "' + e + '" is invalid for option "size"');
                                var t = new Uint8Array(e);
                                return Object.setPrototypeOf(t, a.prototype), t
                            }

                            function a(e, t, r) {
                                if ("number" == typeof e) {
                                    if ("string" == typeof t) throw TypeError('The "string" argument must be of type string. Received type number');
                                    return u(e)
                                }
                                return c(e, t, r)
                            }

                            function c(e, t, r) {
                                if ("string" == typeof e) return function(e, t) {
                                    if (("string" != typeof t || "" === t) && (t = "utf8"), !a.isEncoding(t)) throw TypeError("Unknown encoding: " + t);
                                    var r = 0 | d(e, t),
                                        n = s(r),
                                        i = n.write(e, t);
                                    return i !== r && (n = n.slice(0, i)), n
                                }(e, t);
                                if (ArrayBuffer.isView(e)) return f(e);
                                if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
                                if (B(e, ArrayBuffer) || e && B(e.buffer, ArrayBuffer) || "undefined" != typeof SharedArrayBuffer && (B(e, SharedArrayBuffer) || e && B(e.buffer, SharedArrayBuffer))) return function(e, t, r) {
                                    var n;
                                    if (t < 0 || e.byteLength < t) throw RangeError('"offset" is outside of buffer bounds');
                                    if (e.byteLength < t + (r || 0)) throw RangeError('"length" is outside of buffer bounds');
                                    return Object.setPrototypeOf(n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r), a.prototype), n
                                }(e, t, r);
                                if ("number" == typeof e) throw TypeError('The "value" argument must not be of type number. Received type number');
                                var n = e.valueOf && e.valueOf();
                                if (null != n && n !== e) return a.from(n, t, r);
                                var i = function(e) {
                                    if (a.isBuffer(e)) {
                                        var t, r = 0 | h(e.length),
                                            n = s(r);
                                        return 0 === n.length || e.copy(n, 0, 0, r), n
                                    }
                                    return void 0 !== e.length ? "number" != typeof e.length || (t = e.length) != t ? s(0) : f(e) : "Buffer" === e.type && Array.isArray(e.data) ? f(e.data) : void 0
                                }(e);
                                if (i) return i;
                                if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return a.from(e[Symbol.toPrimitive]("string"), t, r);
                                throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
                            }

                            function l(e) {
                                if ("number" != typeof e) throw TypeError('"size" argument must be of type number');
                                if (e < 0) throw RangeError('The value "' + e + '" is invalid for option "size"')
                            }

                            function u(e) {
                                return l(e), s(e < 0 ? 0 : 0 | h(e))
                            }

                            function f(e) {
                                for (var t = e.length < 0 ? 0 : 0 | h(e.length), r = s(t), n = 0; n < t; n += 1) r[n] = 255 & e[n];
                                return r
                            }

                            function h(e) {
                                if (e >= 2147483647) throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");
                                return 0 | e
                            }

                            function d(e, t) {
                                if (a.isBuffer(e)) return e.length;
                                if (ArrayBuffer.isView(e) || B(e, ArrayBuffer)) return e.byteLength;
                                if ("string" != typeof e) throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
                                var r = e.length,
                                    n = arguments.length > 2 && !0 === arguments[2];
                                if (!n && 0 === r) return 0;
                                for (var i = !1;;) switch (t) {
                                    case "ascii":
                                    case "latin1":
                                    case "binary":
                                        return r;
                                    case "utf8":
                                    case "utf-8":
                                        return T(e).length;
                                    case "ucs2":
                                    case "ucs-2":
                                    case "utf16le":
                                    case "utf-16le":
                                        return 2 * r;
                                    case "hex":
                                        return r >>> 1;
                                    case "base64":
                                        return I(e).length;
                                    default:
                                        if (i) return n ? -1 : T(e).length;
                                        t = ("" + t).toLowerCase(), i = !0
                                }
                            }

                            function p(e, t, r) {
                                var i, o, s = !1;
                                if ((void 0 === t || t < 0) && (t = 0), t > this.length || ((void 0 === r || r > this.length) && (r = this.length), r <= 0 || (r >>>= 0) <= (t >>>= 0))) return "";
                                for (e || (e = "utf8");;) switch (e) {
                                    case "hex":
                                        return function(e, t, r) {
                                            var n = e.length;
                                            (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
                                            for (var i = "", o = t; o < r; ++o) i += O[e[o]];
                                            return i
                                        }(this, t, r);
                                    case "utf8":
                                    case "utf-8":
                                        return b(this, t, r);
                                    case "ascii":
                                        return function(e, t, r) {
                                            var n = "";
                                            r = Math.min(e.length, r);
                                            for (var i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
                                            return n
                                        }(this, t, r);
                                    case "latin1":
                                    case "binary":
                                        return function(e, t, r) {
                                            var n = "";
                                            r = Math.min(e.length, r);
                                            for (var i = t; i < r; ++i) n += String.fromCharCode(e[i]);
                                            return n
                                        }(this, t, r);
                                    case "base64":
                                        return i = t, o = r, 0 === i && o === this.length ? n.fromByteArray(this) : n.fromByteArray(this.slice(i, o));
                                    case "ucs2":
                                    case "ucs-2":
                                    case "utf16le":
                                    case "utf-16le":
                                        return function(e, t, r) {
                                            for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                                            return i
                                        }(this, t, r);
                                    default:
                                        if (s) throw TypeError("Unknown encoding: " + e);
                                        e = (e + "").toLowerCase(), s = !0
                                }
                            }

                            function g(e, t, r) {
                                var n = e[t];
                                e[t] = e[r], e[r] = n
                            }

                            function y(e, t, r, n, i) {
                                var o;
                                if (0 === e.length) return -1;
                                if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), (o = r = +r) != o && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                                    if (i) return -1;
                                    r = e.length - 1
                                } else if (r < 0) {
                                    if (!i) return -1;
                                    r = 0
                                }
                                if ("string" == typeof t && (t = a.from(t, n)), a.isBuffer(t)) return 0 === t.length ? -1 : m(e, t, r, n, i);
                                if ("number" == typeof t) return (t &= 255, "function" == typeof Uint8Array.prototype.indexOf) ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : m(e, [t], r, n, i);
                                throw TypeError("val must be string, number or Buffer")
                            }

                            function m(e, t, r, n, i) {
                                var o, s = 1,
                                    a = e.length,
                                    c = t.length;
                                if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                                    if (e.length < 2 || t.length < 2) return -1;
                                    s = 2, a /= 2, c /= 2, r /= 2
                                }

                                function l(e, t) {
                                    return 1 === s ? e[t] : e.readUInt16BE(t * s)
                                }
                                if (i) {
                                    var u = -1;
                                    for (o = r; o < a; o++)
                                        if (l(e, o) === l(t, -1 === u ? 0 : o - u)) {
                                            if (-1 === u && (u = o), o - u + 1 === c) return u * s
                                        } else - 1 !== u && (o -= o - u), u = -1
                                } else
                                    for (r + c > a && (r = a - c), o = r; o >= 0; o--) {
                                        for (var f = !0, h = 0; h < c; h++)
                                            if (l(e, o + h) !== l(t, h)) {
                                                f = !1;
                                                break
                                            } if (f) return o
                                    }
                                return -1
                            }

                            function b(e, t, r) {
                                r = Math.min(e.length, r);
                                for (var n = [], i = t; i < r;) {
                                    var o, s, a, c, l = e[i],
                                        u = null,
                                        f = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
                                    if (i + f <= r) switch (f) {
                                        case 1:
                                            l < 128 && (u = l);
                                            break;
                                        case 2:
                                            (192 & (o = e[i + 1])) == 128 && (c = (31 & l) << 6 | 63 & o) > 127 && (u = c);
                                            break;
                                        case 3:
                                            o = e[i + 1], s = e[i + 2], (192 & o) == 128 && (192 & s) == 128 && (c = (15 & l) << 12 | (63 & o) << 6 | 63 & s) > 2047 && (c < 55296 || c > 57343) && (u = c);
                                            break;
                                        case 4:
                                            o = e[i + 1], s = e[i + 2], a = e[i + 3], (192 & o) == 128 && (192 & s) == 128 && (192 & a) == 128 && (c = (15 & l) << 18 | (63 & o) << 12 | (63 & s) << 6 | 63 & a) > 65535 && c < 1114112 && (u = c)
                                    }
                                    null === u ? (u = 65533, f = 1) : u > 65535 && (u -= 65536, n.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), n.push(u), i += f
                                }
                                return function(e) {
                                    var t = e.length;
                                    if (t <= 4096) return String.fromCharCode.apply(String, e);
                                    for (var r = "", n = 0; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += 4096));
                                    return r
                                }(n)
                            }

                            function w(e, t, r) {
                                if (e % 1 != 0 || e < 0) throw RangeError("offset is not uint");
                                if (e + t > r) throw RangeError("Trying to access beyond buffer length")
                            }

                            function v(e, t, r, n, i, o) {
                                if (!a.isBuffer(e)) throw TypeError('"buffer" argument must be a Buffer instance');
                                if (t > i || t < o) throw RangeError('"value" argument is out of bounds');
                                if (r + n > e.length) throw RangeError("Index out of range")
                            }

                            function E(e, t, r, n, i, o) {
                                if (r + n > e.length || r < 0) throw RangeError("Index out of range")
                            }

                            function x(e, t, r, n, o) {
                                return t = +t, r >>>= 0, o || E(e, t, r, 4, 34028234663852886e22, -34028234663852886e22), i.write(e, t, r, n, 23, 4), r + 4
                            }

                            function A(e, t, r, n, o) {
                                return t = +t, r >>>= 0, o || E(e, t, r, 8, 17976931348623157e292, -17976931348623157e292), i.write(e, t, r, n, 52, 8), r + 8
                            }
                            t.Buffer = a, t.SlowBuffer = function(e) {
                                return +e != e && (e = 0), a.alloc(+e)
                            }, t.INSPECT_MAX_BYTES = 50, t.kMaxLength = 2147483647, a.TYPED_ARRAY_SUPPORT = function() {
                                try {
                                    var e = new Uint8Array(1),
                                        t = {
                                            foo: function() {
                                                return 42
                                            }
                                        };
                                    return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), 42 === e.foo()
                                } catch (e) {
                                    return !1
                                }
                            }(), a.TYPED_ARRAY_SUPPORT || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(a.prototype, "parent", {
                                enumerable: !0,
                                get: function() {
                                    if (a.isBuffer(this)) return this.buffer
                                }
                            }), Object.defineProperty(a.prototype, "offset", {
                                enumerable: !0,
                                get: function() {
                                    if (a.isBuffer(this)) return this.byteOffset
                                }
                            }), a.poolSize = 8192, a.from = function(e, t, r) {
                                return c(e, t, r)
                            }, Object.setPrototypeOf(a.prototype, Uint8Array.prototype), Object.setPrototypeOf(a, Uint8Array), a.alloc = function(e, t, r) {
                                return (l(e), e <= 0) ? s(e) : void 0 !== t ? "string" == typeof r ? s(e).fill(t, r) : s(e).fill(t) : s(e)
                            }, a.allocUnsafe = function(e) {
                                return u(e)
                            }, a.allocUnsafeSlow = function(e) {
                                return u(e)
                            }, a.isBuffer = function(e) {
                                return null != e && !0 === e._isBuffer && e !== a.prototype
                            }, a.compare = function(e, t) {
                                if (B(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)), B(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)), !a.isBuffer(e) || !a.isBuffer(t)) throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
                                if (e === t) return 0;
                                for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i)
                                    if (e[i] !== t[i]) {
                                        r = e[i], n = t[i];
                                        break
                                    } return r < n ? -1 : n < r ? 1 : 0
                            }, a.isEncoding = function(e) {
                                switch (String(e).toLowerCase()) {
                                    case "hex":
                                    case "utf8":
                                    case "utf-8":
                                    case "ascii":
                                    case "latin1":
                                    case "binary":
                                    case "base64":
                                    case "ucs2":
                                    case "ucs-2":
                                    case "utf16le":
                                    case "utf-16le":
                                        return !0;
                                    default:
                                        return !1
                                }
                            }, a.concat = function(e, t) {
                                if (!Array.isArray(e)) throw TypeError('"list" argument must be an Array of Buffers');
                                if (0 === e.length) return a.alloc(0);
                                if (void 0 === t)
                                    for (r = 0, t = 0; r < e.length; ++r) t += e[r].length;
                                var r, n = a.allocUnsafe(t),
                                    i = 0;
                                for (r = 0; r < e.length; ++r) {
                                    var o = e[r];
                                    if (B(o, Uint8Array) && (o = a.from(o)), !a.isBuffer(o)) throw TypeError('"list" argument must be an Array of Buffers');
                                    o.copy(n, i), i += o.length
                                }
                                return n
                            }, a.byteLength = d, a.prototype._isBuffer = !0, a.prototype.swap16 = function() {
                                var e = this.length;
                                if (e % 2 != 0) throw RangeError("Buffer size must be a multiple of 16-bits");
                                for (var t = 0; t < e; t += 2) g(this, t, t + 1);
                                return this
                            }, a.prototype.swap32 = function() {
                                var e = this.length;
                                if (e % 4 != 0) throw RangeError("Buffer size must be a multiple of 32-bits");
                                for (var t = 0; t < e; t += 4) g(this, t, t + 3), g(this, t + 1, t + 2);
                                return this
                            }, a.prototype.swap64 = function() {
                                var e = this.length;
                                if (e % 8 != 0) throw RangeError("Buffer size must be a multiple of 64-bits");
                                for (var t = 0; t < e; t += 8) g(this, t, t + 7), g(this, t + 1, t + 6), g(this, t + 2, t + 5), g(this, t + 3, t + 4);
                                return this
                            }, a.prototype.toString = function() {
                                var e = this.length;
                                return 0 === e ? "" : 0 == arguments.length ? b(this, 0, e) : p.apply(this, arguments)
                            }, a.prototype.toLocaleString = a.prototype.toString, a.prototype.equals = function(e) {
                                if (!a.isBuffer(e)) throw TypeError("Argument must be a Buffer");
                                return this === e || 0 === a.compare(this, e)
                            }, a.prototype.inspect = function() {
                                var e = "",
                                    r = t.INSPECT_MAX_BYTES;
                                return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">"
                            }, o && (a.prototype[o] = a.prototype.inspect), a.prototype.compare = function(e, t, r, n, i) {
                                if (B(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)), !a.isBuffer(e)) throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
                                if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw RangeError("out of range index");
                                if (n >= i && t >= r) return 0;
                                if (n >= i) return -1;
                                if (t >= r) return 1;
                                if (t >>>= 0, r >>>= 0, n >>>= 0, i >>>= 0, this === e) return 0;
                                for (var o = i - n, s = r - t, c = Math.min(o, s), l = this.slice(n, i), u = e.slice(t, r), f = 0; f < c; ++f)
                                    if (l[f] !== u[f]) {
                                        o = l[f], s = u[f];
                                        break
                                    } return o < s ? -1 : s < o ? 1 : 0
                            }, a.prototype.includes = function(e, t, r) {
                                return -1 !== this.indexOf(e, t, r)
                            }, a.prototype.indexOf = function(e, t, r) {
                                return y(this, e, t, r, !0)
                            }, a.prototype.lastIndexOf = function(e, t, r) {
                                return y(this, e, t, r, !1)
                            }, a.prototype.write = function(e, t, r, n) {
                                if (void 0 === t) n = "utf8", r = this.length, t = 0;
                                else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
                                else if (isFinite(t)) t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
                                else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                                var i, o, s, a, c, l, u, f, h, d, p, g, y = this.length - t;
                                if ((void 0 === r || r > y) && (r = y), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw RangeError("Attempt to write outside buffer bounds");
                                n || (n = "utf8");
                                for (var m = !1;;) switch (n) {
                                    case "hex":
                                        return function(e, t, r, n) {
                                            r = Number(r) || 0;
                                            var i = e.length - r;
                                            n ? (n = Number(n)) > i && (n = i) : n = i;
                                            var o = t.length;
                                            n > o / 2 && (n = o / 2);
                                            for (var s = 0; s < n; ++s) {
                                                var a = parseInt(t.substr(2 * s, 2), 16);
                                                if (a != a) break;
                                                e[r + s] = a
                                            }
                                            return s
                                        }(this, e, t, r);
                                    case "utf8":
                                    case "utf-8":
                                        return c = t, l = r, C(T(e, this.length - c), this, c, l);
                                    case "ascii":
                                        return u = t, f = r, C(k(e), this, u, f);
                                    case "latin1":
                                    case "binary":
                                        return i = this, o = e, s = t, a = r, C(k(o), i, s, a);
                                    case "base64":
                                        return h = t, d = r, C(I(e), this, h, d);
                                    case "ucs2":
                                    case "ucs-2":
                                    case "utf16le":
                                    case "utf-16le":
                                        return p = t, g = r, C(function(e, t) {
                                            for (var r, n, i = [], o = 0; o < e.length && !((t -= 2) < 0); ++o) n = (r = e.charCodeAt(o)) >> 8, i.push(r % 256), i.push(n);
                                            return i
                                        }(e, this.length - p), this, p, g);
                                    default:
                                        if (m) throw TypeError("Unknown encoding: " + n);
                                        n = ("" + n).toLowerCase(), m = !0
                                }
                            }, a.prototype.toJSON = function() {
                                return {
                                    type: "Buffer",
                                    data: Array.prototype.slice.call(this._arr || this, 0)
                                }
                            }, a.prototype.slice = function(e, t) {
                                var r = this.length;
                                e = ~~e, t = void 0 === t ? r : ~~t, e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e);
                                var n = this.subarray(e, t);
                                return Object.setPrototypeOf(n, a.prototype), n
                            }, a.prototype.readUIntLE = function(e, t, r) {
                                e >>>= 0, t >>>= 0, r || w(e, t, this.length);
                                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
                                return n
                            }, a.prototype.readUIntBE = function(e, t, r) {
                                e >>>= 0, t >>>= 0, r || w(e, t, this.length);
                                for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) n += this[e + --t] * i;
                                return n
                            }, a.prototype.readUInt8 = function(e, t) {
                                return e >>>= 0, t || w(e, 1, this.length), this[e]
                            }, a.prototype.readUInt16LE = function(e, t) {
                                return e >>>= 0, t || w(e, 2, this.length), this[e] | this[e + 1] << 8
                            }, a.prototype.readUInt16BE = function(e, t) {
                                return e >>>= 0, t || w(e, 2, this.length), this[e] << 8 | this[e + 1]
                            }, a.prototype.readUInt32LE = function(e, t) {
                                return e >>>= 0, t || w(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
                            }, a.prototype.readUInt32BE = function(e, t) {
                                return e >>>= 0, t || w(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
                            }, a.prototype.readIntLE = function(e, t, r) {
                                e >>>= 0, t >>>= 0, r || w(e, t, this.length);
                                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
                                return n >= (i *= 128) && (n -= Math.pow(2, 8 * t)), n
                            }, a.prototype.readIntBE = function(e, t, r) {
                                e >>>= 0, t >>>= 0, r || w(e, t, this.length);
                                for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256);) o += this[e + --n] * i;
                                return o >= (i *= 128) && (o -= Math.pow(2, 8 * t)), o
                            }, a.prototype.readInt8 = function(e, t) {
                                return (e >>>= 0, t || w(e, 1, this.length), 128 & this[e]) ? -((255 - this[e] + 1) * 1) : this[e]
                            }, a.prototype.readInt16LE = function(e, t) {
                                e >>>= 0, t || w(e, 2, this.length);
                                var r = this[e] | this[e + 1] << 8;
                                return 32768 & r ? 4294901760 | r : r
                            }, a.prototype.readInt16BE = function(e, t) {
                                e >>>= 0, t || w(e, 2, this.length);
                                var r = this[e + 1] | this[e] << 8;
                                return 32768 & r ? 4294901760 | r : r
                            }, a.prototype.readInt32LE = function(e, t) {
                                return e >>>= 0, t || w(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
                            }, a.prototype.readInt32BE = function(e, t) {
                                return e >>>= 0, t || w(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
                            }, a.prototype.readFloatLE = function(e, t) {
                                return e >>>= 0, t || w(e, 4, this.length), i.read(this, e, !0, 23, 4)
                            }, a.prototype.readFloatBE = function(e, t) {
                                return e >>>= 0, t || w(e, 4, this.length), i.read(this, e, !1, 23, 4)
                            }, a.prototype.readDoubleLE = function(e, t) {
                                return e >>>= 0, t || w(e, 8, this.length), i.read(this, e, !0, 52, 8)
                            }, a.prototype.readDoubleBE = function(e, t) {
                                return e >>>= 0, t || w(e, 8, this.length), i.read(this, e, !1, 52, 8)
                            }, a.prototype.writeUIntLE = function(e, t, r, n) {
                                if (e = +e, t >>>= 0, r >>>= 0, !n) {
                                    var i = Math.pow(2, 8 * r) - 1;
                                    v(this, e, t, r, i, 0)
                                }
                                var o = 1,
                                    s = 0;
                                for (this[t] = 255 & e; ++s < r && (o *= 256);) this[t + s] = e / o & 255;
                                return t + r
                            }, a.prototype.writeUIntBE = function(e, t, r, n) {
                                if (e = +e, t >>>= 0, r >>>= 0, !n) {
                                    var i = Math.pow(2, 8 * r) - 1;
                                    v(this, e, t, r, i, 0)
                                }
                                var o = r - 1,
                                    s = 1;
                                for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) this[t + o] = e / s & 255;
                                return t + r
                            }, a.prototype.writeUInt8 = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1
                            }, a.prototype.writeUInt16LE = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
                            }, a.prototype.writeUInt16BE = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
                            }, a.prototype.writeUInt32LE = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4
                            }, a.prototype.writeUInt32BE = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
                            }, a.prototype.writeIntLE = function(e, t, r, n) {
                                if (e = +e, t >>>= 0, !n) {
                                    var i = Math.pow(2, 8 * r - 1);
                                    v(this, e, t, r, i - 1, -i)
                                }
                                var o = 0,
                                    s = 1,
                                    a = 0;
                                for (this[t] = 255 & e; ++o < r && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
                                return t + r
                            }, a.prototype.writeIntBE = function(e, t, r, n) {
                                if (e = +e, t >>>= 0, !n) {
                                    var i = Math.pow(2, 8 * r - 1);
                                    v(this, e, t, r, i - 1, -i)
                                }
                                var o = r - 1,
                                    s = 1,
                                    a = 0;
                                for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
                                return t + r
                            }, a.prototype.writeInt8 = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
                            }, a.prototype.writeInt16LE = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
                            }, a.prototype.writeInt16BE = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
                            }, a.prototype.writeInt32LE = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4
                            }, a.prototype.writeInt32BE = function(e, t, r) {
                                return e = +e, t >>>= 0, r || v(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
                            }, a.prototype.writeFloatLE = function(e, t, r) {
                                return x(this, e, t, !0, r)
                            }, a.prototype.writeFloatBE = function(e, t, r) {
                                return x(this, e, t, !1, r)
                            }, a.prototype.writeDoubleLE = function(e, t, r) {
                                return A(this, e, t, !0, r)
                            }, a.prototype.writeDoubleBE = function(e, t, r) {
                                return A(this, e, t, !1, r)
                            }, a.prototype.copy = function(e, t, r, n) {
                                if (!a.isBuffer(e)) throw TypeError("argument should be a Buffer");
                                if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r || 0 === e.length || 0 === this.length) return 0;
                                if (t < 0) throw RangeError("targetStart out of bounds");
                                if (r < 0 || r >= this.length) throw RangeError("Index out of range");
                                if (n < 0) throw RangeError("sourceEnd out of bounds");
                                n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
                                var i = n - r;
                                if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, r, n);
                                else if (this === e && r < t && t < n)
                                    for (var o = i - 1; o >= 0; --o) e[o + t] = this[o + r];
                                else Uint8Array.prototype.set.call(e, this.subarray(r, n), t);
                                return i
                            }, a.prototype.fill = function(e, t, r, n) {
                                if ("string" == typeof e) {
                                    if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw TypeError("encoding must be a string");
                                    if ("string" == typeof n && !a.isEncoding(n)) throw TypeError("Unknown encoding: " + n);
                                    if (1 === e.length) {
                                        var i, o = e.charCodeAt(0);
                                        ("utf8" === n && o < 128 || "latin1" === n) && (e = o)
                                    }
                                } else "number" == typeof e ? e &= 255 : "boolean" == typeof e && (e = Number(e));
                                if (t < 0 || this.length < t || this.length < r) throw RangeError("Out of range index");
                                if (r <= t) return this;
                                if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e)
                                    for (i = t; i < r; ++i) this[i] = e;
                                else {
                                    var s = a.isBuffer(e) ? e : a.from(e, n),
                                        c = s.length;
                                    if (0 === c) throw TypeError('The value "' + e + '" is invalid for argument "value"');
                                    for (i = 0; i < r - t; ++i) this[i + t] = s[i % c]
                                }
                                return this
                            };
                            var S = /[^+/0-9A-Za-z-_]/g;

                            function T(e, t) {
                                t = t || 1 / 0;
                                for (var r, n = e.length, i = null, o = [], s = 0; s < n; ++s) {
                                    if ((r = e.charCodeAt(s)) > 55295 && r < 57344) {
                                        if (!i) {
                                            if (r > 56319 || s + 1 === n) {
                                                (t -= 3) > -1 && o.push(239, 191, 189);
                                                continue
                                            }
                                            i = r;
                                            continue
                                        }
                                        if (r < 56320) {
                                            (t -= 3) > -1 && o.push(239, 191, 189), i = r;
                                            continue
                                        }
                                        r = (i - 55296 << 10 | r - 56320) + 65536
                                    } else i && (t -= 3) > -1 && o.push(239, 191, 189);
                                    if (i = null, r < 128) {
                                        if ((t -= 1) < 0) break;
                                        o.push(r)
                                    } else if (r < 2048) {
                                        if ((t -= 2) < 0) break;
                                        o.push(r >> 6 | 192, 63 & r | 128)
                                    } else if (r < 65536) {
                                        if ((t -= 3) < 0) break;
                                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                                    } else if (r < 1114112) {
                                        if ((t -= 4) < 0) break;
                                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                                    } else throw Error("Invalid code point")
                                }
                                return o
                            }

                            function k(e) {
                                for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                                return t
                            }

                            function I(e) {
                                return n.toByteArray(function(e) {
                                    if ((e = (e = e.split("=")[0]).trim().replace(S, "")).length < 2) return "";
                                    for (; e.length % 4 != 0;) e += "=";
                                    return e
                                }(e))
                            }

                            function C(e, t, r, n) {
                                for (var i = 0; i < n && !(i + r >= t.length) && !(i >= e.length); ++i) t[i + r] = e[i];
                                return i
                            }

                            function B(e, t) {
                                return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
                            }
                            var O = function() {
                                for (var e = "0123456789abcdef", t = Array(256), r = 0; r < 16; ++r)
                                    for (var n = 16 * r, i = 0; i < 16; ++i) t[n + i] = e[r] + e[i];
                                return t
                            }()
                        },
                        783: function(e, t) {
                            /*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
                            t.read = function(e, t, r, n, i) {
                                var o, s, a = 8 * i - n - 1,
                                    c = (1 << a) - 1,
                                    l = c >> 1,
                                    u = -7,
                                    f = r ? i - 1 : 0,
                                    h = r ? -1 : 1,
                                    d = e[t + f];
                                for (f += h, o = d & (1 << -u) - 1, d >>= -u, u += a; u > 0; o = 256 * o + e[t + f], f += h, u -= 8);
                                for (s = o & (1 << -u) - 1, o >>= -u, u += n; u > 0; s = 256 * s + e[t + f], f += h, u -= 8);
                                if (0 === o) o = 1 - l;
                                else {
                                    if (o === c) return s ? NaN : (d ? -1 : 1) * (1 / 0);
                                    s += Math.pow(2, n), o -= l
                                }
                                return (d ? -1 : 1) * s * Math.pow(2, o - n)
                            }, t.write = function(e, t, r, n, i, o) {
                                var s, a, c, l = 8 * o - i - 1,
                                    u = (1 << l) - 1,
                                    f = u >> 1,
                                    h = 23 === i ? 5960464477539062e-23 : 0,
                                    d = n ? 0 : o - 1,
                                    p = n ? 1 : -1,
                                    g = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
                                for (isNaN(t = Math.abs(t)) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = u) : (s = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -s)) < 1 && (s--, c *= 2), s + f >= 1 ? t += h / c : t += h * Math.pow(2, 1 - f), t * c >= 2 && (s++, c /= 2), s + f >= u ? (a = 0, s = u) : s + f >= 1 ? (a = (t * c - 1) * Math.pow(2, i), s += f) : (a = t * Math.pow(2, f - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + d] = 255 & a, d += p, a /= 256, i -= 8);
                                for (s = s << i | a, l += i; l > 0; e[r + d] = 255 & s, d += p, s /= 256, l -= 8);
                                e[r + d - p] |= 128 * g
                            }
                        }
                    },
                    r = {};

                function n(e) {
                    var i = r[e];
                    if (void 0 !== i) return i.exports;
                    var o = r[e] = {
                            exports: {}
                        },
                        s = !0;
                    try {
                        t[e](o, o.exports, n), s = !1
                    } finally {
                        s && delete r[e]
                    }
                    return o.exports
                }
                n.ab = "//";
                var i = n(72);
                e.exports = i
            }()
        },
        3814: function() {},
        7663: function(e) {
            ! function() {
                var t = {
                        229: function(e) {
                            var t, r, n, i = e.exports = {};

                            function o() {
                                throw Error("setTimeout has not been defined")
                            }

                            function s() {
                                throw Error("clearTimeout has not been defined")
                            }

                            function a(e) {
                                if (t === setTimeout) return setTimeout(e, 0);
                                if ((t === o || !t) && setTimeout) return t = setTimeout, setTimeout(e, 0);
                                try {
                                    return t(e, 0)
                                } catch (r) {
                                    try {
                                        return t.call(null, e, 0)
                                    } catch (r) {
                                        return t.call(this, e, 0)
                                    }
                                }
                            }! function() {
                                try {
                                    t = "function" == typeof setTimeout ? setTimeout : o
                                } catch (e) {
                                    t = o
                                }
                                try {
                                    r = "function" == typeof clearTimeout ? clearTimeout : s
                                } catch (e) {
                                    r = s
                                }
                            }();
                            var c = [],
                                l = !1,
                                u = -1;

                            function f() {
                                l && n && (l = !1, n.length ? c = n.concat(c) : u = -1, c.length && h())
                            }

                            function h() {
                                if (!l) {
                                    var e = a(f);
                                    l = !0;
                                    for (var t = c.length; t;) {
                                        for (n = c, c = []; ++u < t;) n && n[u].run();
                                        u = -1, t = c.length
                                    }
                                    n = null, l = !1,
                                        function(e) {
                                            if (r === clearTimeout) return clearTimeout(e);
                                            if ((r === s || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e);
                                            try {
                                                r(e)
                                            } catch (t) {
                                                try {
                                                    return r.call(null, e)
                                                } catch (t) {
                                                    return r.call(this, e)
                                                }
                                            }
                                        }(e)
                                }
                            }

                            function d(e, t) {
                                this.fun = e, this.array = t
                            }

                            function p() {}
                            i.nextTick = function(e) {
                                var t = Array(arguments.length - 1);
                                if (arguments.length > 1)
                                    for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
                                c.push(new d(e, t)), 1 !== c.length || l || a(h)
                            }, d.prototype.run = function() {
                                this.fun.apply(null, this.array)
                            }, i.title = "browser", i.browser = !0, i.env = {}, i.argv = [], i.version = "", i.versions = {}, i.on = p, i.addListener = p, i.once = p, i.off = p, i.removeListener = p, i.removeAllListeners = p, i.emit = p, i.prependListener = p, i.prependOnceListener = p, i.listeners = function(e) {
                                return []
                            }, i.binding = function(e) {
                                throw Error("process.binding is not supported")
                            }, i.cwd = function() {
                                return "/"
                            }, i.chdir = function(e) {
                                throw Error("process.chdir is not supported")
                            }, i.umask = function() {
                                return 0
                            }
                        }
                    },
                    r = {};

                function n(e) {
                    var i = r[e];
                    if (void 0 !== i) return i.exports;
                    var o = r[e] = {
                            exports: {}
                        },
                        s = !0;
                    try {
                        t[e](o, o.exports, n), s = !1
                    } finally {
                        s && delete r[e]
                    }
                    return o.exports
                }
                n.ab = "//";
                var i = n(229);
                e.exports = i
            }()
        },
        9008: function(e, t, r) {
            e.exports = r(2636)
        },
        3937: function(e, t, r) {
            "use strict";
            var n = r(208);
            t.K = void 0;
            var i = n(r(6114)),
                o = n(r(7432)),
                s = n(r(4182)),
                a = n(r(3497)),
                c = n(r(3441)),
                l = n(r(9062)),
                u = function(e) {
                    (0, s.default)(n, e);
                    var t, r = (t = function() {
                        if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                        } catch (e) {
                            return !1
                        }
                    }(), function() {
                        var e, r = (0, c.default)(n);
                        if (t) {
                            var i = (0, c.default)(this).constructor;
                            e = Reflect.construct(r, arguments, i)
                        } else e = r.apply(this, arguments);
                        return (0, a.default)(this, e)
                    });

                    function n() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "ws://localhost:8080",
                            t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
                            i = t.autoconnect,
                            s = t.reconnect,
                            a = t.reconnect_interval,
                            c = t.max_reconnects,
                            u = arguments.length > 2 ? arguments[2] : void 0;
                        return (0, o.default)(this, n), r.call(this, l.default, e, {
                            autoconnect: void 0 === i || i,
                            reconnect: void 0 === s || s,
                            reconnect_interval: void 0 === a ? 1e3 : a,
                            max_reconnects: void 0 === c ? 5 : c
                        }, u)
                    }
                    return (0, i.default)(n)
                }(n(r(6855)).default);
            t.K = u
        },
        6855: function(e, t, r) {
            "use strict";
            var n = r(1876).Buffer,
                i = r(208);
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = void 0;
            var o = i(r(4638)),
                s = i(r(429)),
                a = i(r(2449)),
                c = i(r(7432)),
                l = i(r(6114)),
                u = i(r(4182)),
                f = i(r(3497)),
                h = i(r(3441)),
                d = r(6729),
                p = function(e, t) {
                    var r = {};
                    for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && 0 > t.indexOf(n) && (r[n] = e[n]);
                    if (null != e && "function" == typeof Object.getOwnPropertySymbols)
                        for (var i = 0, n = Object.getOwnPropertySymbols(e); i < n.length; i++) 0 > t.indexOf(n[i]) && Object.prototype.propertyIsEnumerable.call(e, n[i]) && (r[n[i]] = e[n[i]]);
                    return r
                },
                g = function(e) {
                    (0, u.default)(m, e);
                    var t, r, i, d, g, y = (t = function() {
                        if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                        } catch (e) {
                            return !1
                        }
                    }(), function() {
                        var e, r = (0, h.default)(m);
                        if (t) {
                            var n = (0, h.default)(this).constructor;
                            e = Reflect.construct(r, arguments, n)
                        } else e = r.apply(this, arguments);
                        return (0, f.default)(this, e)
                    });

                    function m(e) {
                        var t, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "ws://localhost:8080",
                            n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
                            i = arguments.length > 3 ? arguments[3] : void 0;
                        (0, c.default)(this, m);
                        var o = n.autoconnect,
                            s = n.reconnect,
                            a = n.reconnect_interval,
                            l = n.max_reconnects,
                            u = p(n, ["autoconnect", "reconnect", "reconnect_interval", "max_reconnects"]);
                        return (t = y.call(this)).webSocketFactory = e, t.queue = {}, t.rpc_id = 0, t.address = r, t.autoconnect = void 0 === o || o, t.ready = !1, t.reconnect = void 0 === s || s, t.reconnect_timer_id = void 0, t.reconnect_interval = void 0 === a ? 1e3 : a, t.max_reconnects = void 0 === l ? 5 : l, t.rest_options = u, t.current_reconnects = 0, t.generate_request_id = i || function() {
                            return ++t.rpc_id
                        }, t.autoconnect && t._connect(t.address, Object.assign({
                            autoconnect: t.autoconnect,
                            reconnect: t.reconnect,
                            reconnect_interval: t.reconnect_interval,
                            max_reconnects: t.max_reconnects
                        }, t.rest_options)), t
                    }
                    return (0, l.default)(m, [{
                        key: "connect",
                        value: function() {
                            this.socket || this._connect(this.address, Object.assign({
                                autoconnect: this.autoconnect,
                                reconnect: this.reconnect,
                                reconnect_interval: this.reconnect_interval,
                                max_reconnects: this.max_reconnects
                            }, this.rest_options))
                        }
                    }, {
                        key: "call",
                        value: function(e, t, r, n) {
                            var i = this;
                            return n || "object" !== (0, a.default)(r) || (n = r, r = null), new Promise(function(o, s) {
                                if (!i.ready) return s(Error("socket not ready"));
                                var a = i.generate_request_id(e, t);
                                i.socket.send(JSON.stringify({
                                    jsonrpc: "2.0",
                                    method: e,
                                    params: t || null,
                                    id: a
                                }), n, function(e) {
                                    if (e) return s(e);
                                    i.queue[a] = {
                                        promise: [o, s]
                                    }, r && (i.queue[a].timeout = setTimeout(function() {
                                        delete i.queue[a], s(Error("reply timeout"))
                                    }, r))
                                })
                            })
                        }
                    }, {
                        key: "login",
                        value: (r = (0, s.default)(o.default.mark(function e(t) {
                            var r;
                            return o.default.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, this.call("rpc.login", t);
                                    case 2:
                                        if (r = e.sent) {
                                            e.next = 5;
                                            break
                                        }
                                        throw Error("authentication failed");
                                    case 5:
                                        return e.abrupt("return", r);
                                    case 6:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        })), function(e) {
                            return r.apply(this, arguments)
                        })
                    }, {
                        key: "listMethods",
                        value: (i = (0, s.default)(o.default.mark(function e() {
                            return o.default.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return e.next = 2, this.call("__listMethods");
                                    case 2:
                                        return e.abrupt("return", e.sent);
                                    case 3:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        })), function() {
                            return i.apply(this, arguments)
                        })
                    }, {
                        key: "notify",
                        value: function(e, t) {
                            var r = this;
                            return new Promise(function(n, i) {
                                if (!r.ready) return i(Error("socket not ready"));
                                r.socket.send(JSON.stringify({
                                    jsonrpc: "2.0",
                                    method: e,
                                    params: t || null
                                }), function(e) {
                                    if (e) return i(e);
                                    n()
                                })
                            })
                        }
                    }, {
                        key: "subscribe",
                        value: (d = (0, s.default)(o.default.mark(function e(t) {
                            var r;
                            return o.default.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return "string" == typeof t && (t = [t]), e.next = 3, this.call("rpc.on", t);
                                    case 3:
                                        if (r = e.sent, !("string" == typeof t && "ok" !== r[t])) {
                                            e.next = 6;
                                            break
                                        }
                                        throw Error("Failed subscribing to an event '" + t + "' with: " + r[t]);
                                    case 6:
                                        return e.abrupt("return", r);
                                    case 7:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        })), function(e) {
                            return d.apply(this, arguments)
                        })
                    }, {
                        key: "unsubscribe",
                        value: (g = (0, s.default)(o.default.mark(function e(t) {
                            var r;
                            return o.default.wrap(function(e) {
                                for (;;) switch (e.prev = e.next) {
                                    case 0:
                                        return "string" == typeof t && (t = [t]), e.next = 3, this.call("rpc.off", t);
                                    case 3:
                                        if (r = e.sent, !("string" == typeof t && "ok" !== r[t])) {
                                            e.next = 6;
                                            break
                                        }
                                        throw Error("Failed unsubscribing from an event with: " + r);
                                    case 6:
                                        return e.abrupt("return", r);
                                    case 7:
                                    case "end":
                                        return e.stop()
                                }
                            }, e, this)
                        })), function(e) {
                            return g.apply(this, arguments)
                        })
                    }, {
                        key: "close",
                        value: function(e, t) {
                            this.socket.close(e || 1e3, t)
                        }
                    }, {
                        key: "_connect",
                        value: function(e, t) {
                            var r = this;
                            clearTimeout(this.reconnect_timer_id), this.socket = this.webSocketFactory(e, t), this.socket.addEventListener("open", function() {
                                r.ready = !0, r.emit("open"), r.current_reconnects = 0
                            }), this.socket.addEventListener("message", function(e) {
                                var t = e.data;
                                t instanceof ArrayBuffer && (t = n.from(t).toString());
                                try {
                                    t = JSON.parse(t)
                                } catch (e) {
                                    return
                                }
                                if (t.notification && r.listeners(t.notification).length) {
                                    if (!Object.keys(t.params).length) return r.emit(t.notification);
                                    var i = [t.notification];
                                    if (t.params.constructor === Object) i.push(t.params);
                                    else
                                        for (var o = 0; o < t.params.length; o++) i.push(t.params[o]);
                                    return Promise.resolve().then(function() {
                                        r.emit.apply(r, i)
                                    })
                                }
                                if (!r.queue[t.id]) return t.method && t.params ? Promise.resolve().then(function() {
                                    r.emit(t.method, t.params)
                                }) : void 0;
                                "error" in t == "result" in t && r.queue[t.id].promise[1](Error('Server response malformed. Response must include either "result" or "error", but not both.')), r.queue[t.id].timeout && clearTimeout(r.queue[t.id].timeout), t.error ? r.queue[t.id].promise[1](t.error) : r.queue[t.id].promise[0](t.result), delete r.queue[t.id]
                            }), this.socket.addEventListener("error", function(e) {
                                return r.emit("error", e)
                            }), this.socket.addEventListener("close", function(n) {
                                var i = n.code,
                                    o = n.reason;
                                r.ready && setTimeout(function() {
                                    return r.emit("close", i, o)
                                }, 0), r.ready = !1, r.socket = void 0, 1e3 !== i && (r.current_reconnects++, r.reconnect && (r.max_reconnects > r.current_reconnects || 0 === r.max_reconnects) && (r.reconnect_timer_id = setTimeout(function() {
                                    return r._connect(e, t)
                                }, r.reconnect_interval)))
                            })
                        }
                    }]), m
                }(d.EventEmitter);
            t.default = g
        },
        9062: function(e, t, r) {
            "use strict";
            var n = r(208);
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), t.default = function(e, t) {
                return new l(e, t)
            };
            var i = n(r(7432)),
                o = n(r(6114)),
                s = n(r(4182)),
                a = n(r(3497)),
                c = n(r(3441)),
                l = function(e) {
                    (0, s.default)(n, e);
                    var t, r = (t = function() {
                        if ("undefined" == typeof Reflect || !Reflect.construct || Reflect.construct.sham) return !1;
                        if ("function" == typeof Proxy) return !0;
                        try {
                            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0
                        } catch (e) {
                            return !1
                        }
                    }(), function() {
                        var e, r = (0, c.default)(n);
                        if (t) {
                            var i = (0, c.default)(this).constructor;
                            e = Reflect.construct(r, arguments, i)
                        } else e = r.apply(this, arguments);
                        return (0, a.default)(this, e)
                    });

                    function n(e, t, o) {
                        var s;
                        return (0, i.default)(this, n), (s = r.call(this)).socket = new window.WebSocket(e, o), s.socket.onopen = function() {
                            return s.emit("open")
                        }, s.socket.onmessage = function(e) {
                            return s.emit("message", e.data)
                        }, s.socket.onerror = function(e) {
                            return s.emit("error", e)
                        }, s.socket.onclose = function(e) {
                            s.emit("close", e.code, e.reason)
                        }, s
                    }
                    return (0, o.default)(n, [{
                        key: "send",
                        value: function(e, t, r) {
                            var n = r || t;
                            try {
                                this.socket.send(e), n()
                            } catch (e) {
                                n(e)
                            }
                        }
                    }, {
                        key: "close",
                        value: function(e, t) {
                            this.socket.close(e, t)
                        }
                    }, {
                        key: "addEventListener",
                        value: function(e, t, r) {
                            this.socket.addEventListener(e, t, r)
                        }
                    }]), n
                }(r(6729).EventEmitter)
        },
        1860: function(e) {
            var t, r, n, i;
            t = this, r = this && this.define, (i = (n = {
                version: "2.14.2",
                areas: {},
                apis: {},
                nsdelim: ".",
                inherit: function(e, t) {
                    for (var r in e) t.hasOwnProperty(r) || Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
                    return t
                },
                stringify: function(e, t) {
                    return void 0 === e || "function" == typeof e ? e + "" : JSON.stringify(e, t || n.replace)
                },
                parse: function(e, t) {
                    try {
                        return JSON.parse(e, t || n.revive)
                    } catch (t) {
                        return e
                    }
                },
                fn: function(e, t) {
                    for (var r in n.storeAPI[e] = t, n.apis) n.apis[r][e] = t
                },
                get: function(e, t) {
                    return e.getItem(t)
                },
                set: function(e, t, r) {
                    e.setItem(t, r)
                },
                remove: function(e, t) {
                    e.removeItem(t)
                },
                key: function(e, t) {
                    return e.key(t)
                },
                length: function(e) {
                    return e.length
                },
                clear: function(e) {
                    e.clear()
                },
                Store: function(e, t, r) {
                    var i = n.inherit(n.storeAPI, function(e, t, r) {
                        return 0 == arguments.length ? i.getAll() : "function" == typeof t ? i.transact(e, t, r) : void 0 !== t ? i.set(e, t, r) : "string" == typeof e || "number" == typeof e ? i.get(e) : "function" == typeof e ? i.each(e) : e ? i.setAll(e, t) : i.clear()
                    });
                    i._id = e;
                    try {
                        var o = "__store2_test";
                        t.setItem(o, "ok"), i._area = t, t.removeItem(o)
                    } catch (e) {
                        i._area = n.storage("fake")
                    }
                    return i._ns = r || "", n.areas[e] || (n.areas[e] = i._area), n.apis[i._ns + i._id] || (n.apis[i._ns + i._id] = i), i
                },
                storeAPI: {
                    area: function(e, t) {
                        var r = this[e];
                        return r && r.area || (r = n.Store(e, t, this._ns), this[e] || (this[e] = r)), r
                    },
                    namespace: function(e, t, r) {
                        if (r = r || this._delim || n.nsdelim, !e) return this._ns ? this._ns.substring(0, this._ns.length - r.length) : "";
                        var i = this[e];
                        if ((!i || !i.namespace) && ((i = n.Store(this._id, this._area, this._ns + e + r))._delim = r, this[e] || (this[e] = i), !t))
                            for (var o in n.areas) i.area(o, n.areas[o]);
                        return i
                    },
                    isFake: function(e) {
                        return e ? (this._real = this._area, this._area = n.storage("fake")) : !1 === e && (this._area = this._real || this._area), "fake" === this._area.name
                    },
                    toString: function() {
                        return "store" + (this._ns ? "." + this.namespace() : "") + "[" + this._id + "]"
                    },
                    has: function(e) {
                        return this._area.has ? this._area.has(this._in(e)) : this._in(e) in this._area
                    },
                    size: function() {
                        return this.keys().length
                    },
                    each: function(e, t) {
                        for (var r = 0, i = n.length(this._area); r < i; r++) {
                            var o = this._out(n.key(this._area, r));
                            if (void 0 !== o && !1 === e.call(this, o, this.get(o), t)) break;
                            i > n.length(this._area) && (i--, r--)
                        }
                        return t || this
                    },
                    keys: function(e) {
                        return this.each(function(e, t, r) {
                            r.push(e)
                        }, e || [])
                    },
                    get: function(e, t) {
                        var r, i = n.get(this._area, this._in(e));
                        return "function" == typeof t && (r = t, t = null), null !== i ? n.parse(i, r) : null != t ? t : i
                    },
                    getAll: function(e) {
                        return this.each(function(e, t, r) {
                            r[e] = t
                        }, e || {})
                    },
                    transact: function(e, t, r) {
                        var n = this.get(e, r),
                            i = t(n);
                        return this.set(e, void 0 === i ? n : i), this
                    },
                    set: function(e, t, r) {
                        var i, o = this.get(e);
                        return null != o && !1 === r ? t : ("function" == typeof r && (i = r, r = void 0), n.set(this._area, this._in(e), n.stringify(t, i), r) || o)
                    },
                    setAll: function(e, t) {
                        var r, n;
                        for (var i in e) n = e[i], this.set(i, n, t) !== n && (r = !0);
                        return r
                    },
                    add: function(e, t, r) {
                        var i = this.get(e);
                        if (i instanceof Array) t = i.concat(t);
                        else if (null !== i) {
                            var o = typeof i;
                            if (o === typeof t && "object" === o) {
                                for (var s in t) i[s] = t[s];
                                t = i
                            } else t = i + t
                        }
                        return n.set(this._area, this._in(e), n.stringify(t, r)), t
                    },
                    remove: function(e, t) {
                        var r = this.get(e, t);
                        return n.remove(this._area, this._in(e)), r
                    },
                    clear: function() {
                        return this._ns ? this.each(function(e) {
                            n.remove(this._area, this._in(e))
                        }, 1) : n.clear(this._area), this
                    },
                    clearAll: function() {
                        var e = this._area;
                        for (var t in n.areas) n.areas.hasOwnProperty(t) && (this._area = n.areas[t], this.clear());
                        return this._area = e, this
                    },
                    _in: function(e) {
                        return "string" != typeof e && (e = n.stringify(e)), this._ns ? this._ns + e : e
                    },
                    _out: function(e) {
                        return this._ns ? e && 0 === e.indexOf(this._ns) ? e.substring(this._ns.length) : void 0 : e
                    }
                },
                storage: function(e) {
                    return n.inherit(n.storageAPI, {
                        items: {},
                        name: e
                    })
                },
                storageAPI: {
                    length: 0,
                    has: function(e) {
                        return this.items.hasOwnProperty(e)
                    },
                    key: function(e) {
                        var t = 0;
                        for (var r in this.items)
                            if (this.has(r) && e === t++) return r
                    },
                    setItem: function(e, t) {
                        !this.has(e) && this.length++, this.items[e] = t
                    },
                    removeItem: function(e) {
                        this.has(e) && (delete this.items[e], this.length--)
                    },
                    getItem: function(e) {
                        return this.has(e) ? this.items[e] : null
                    },
                    clear: function() {
                        for (var e in this.items) this.removeItem(e)
                    }
                }
            }).Store("local", function() {
                try {
                    return localStorage
                } catch (e) {}
            }())).local = i, i._ = n, i.area("session", function() {
                try {
                    return sessionStorage
                } catch (e) {}
            }()), i.area("page", n.storage("page")), "function" == typeof r && void 0 !== r.amd ? r("store2", [], function() {
                return i
            }) : e.exports ? e.exports = i : (t.store && (n.conflict = t.store), t.store = i)
        },
        780: function(e, t, r) {
            ! function(e) {
                "use strict";
                var t, n = function(e) {
                        var t, r = new Float64Array(16);
                        if (e)
                            for (t = 0; t < e.length; t++) r[t] = e[t];
                        return r
                    },
                    i = function() {
                        throw Error("no PRNG")
                    },
                    o = new Uint8Array(16),
                    s = new Uint8Array(32);
                s[0] = 9;
                var a = n(),
                    c = n([1]),
                    l = n([56129, 1]),
                    u = n([30883, 4953, 19914, 30187, 55467, 16705, 2637, 112, 59544, 30585, 16505, 36039, 65139, 11119, 27886, 20995]),
                    f = n([61785, 9906, 39828, 60374, 45398, 33411, 5274, 224, 53552, 61171, 33010, 6542, 64743, 22239, 55772, 9222]),
                    h = n([54554, 36645, 11616, 51542, 42930, 38181, 51040, 26924, 56412, 64982, 57905, 49316, 21502, 52590, 14035, 8553]),
                    d = n([26200, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214, 26214]),
                    p = n([41136, 18958, 6951, 50414, 58488, 44335, 6150, 12099, 55207, 15867, 153, 11085, 57099, 20417, 9344, 11139]);

                function g(e, t, r, n) {
                    e[t] = r >> 24 & 255, e[t + 1] = r >> 16 & 255, e[t + 2] = r >> 8 & 255, e[t + 3] = 255 & r, e[t + 4] = n >> 24 & 255, e[t + 5] = n >> 16 & 255, e[t + 6] = n >> 8 & 255, e[t + 7] = 255 & n
                }

                function y(e, t, r, n, i) {
                    var o, s = 0;
                    for (o = 0; o < i; o++) s |= e[t + o] ^ r[n + o];
                    return (1 & s - 1 >>> 8) - 1
                }

                function m(e, t, r, n) {
                    return y(e, t, r, n, 16)
                }

                function b(e, t, r, n) {
                    return y(e, t, r, n, 32)
                }

                function w(e, t, r, n) {
                    ! function(e, t, r, n) {
                        for (var i, o = 255 & n[0] | (255 & n[1]) << 8 | (255 & n[2]) << 16 | (255 & n[3]) << 24, s = 255 & r[0] | (255 & r[1]) << 8 | (255 & r[2]) << 16 | (255 & r[3]) << 24, a = 255 & r[4] | (255 & r[5]) << 8 | (255 & r[6]) << 16 | (255 & r[7]) << 24, c = 255 & r[8] | (255 & r[9]) << 8 | (255 & r[10]) << 16 | (255 & r[11]) << 24, l = 255 & r[12] | (255 & r[13]) << 8 | (255 & r[14]) << 16 | (255 & r[15]) << 24, u = 255 & n[4] | (255 & n[5]) << 8 | (255 & n[6]) << 16 | (255 & n[7]) << 24, f = 255 & t[0] | (255 & t[1]) << 8 | (255 & t[2]) << 16 | (255 & t[3]) << 24, h = 255 & t[4] | (255 & t[5]) << 8 | (255 & t[6]) << 16 | (255 & t[7]) << 24, d = 255 & t[8] | (255 & t[9]) << 8 | (255 & t[10]) << 16 | (255 & t[11]) << 24, p = 255 & t[12] | (255 & t[13]) << 8 | (255 & t[14]) << 16 | (255 & t[15]) << 24, g = 255 & n[8] | (255 & n[9]) << 8 | (255 & n[10]) << 16 | (255 & n[11]) << 24, y = 255 & r[16] | (255 & r[17]) << 8 | (255 & r[18]) << 16 | (255 & r[19]) << 24, m = 255 & r[20] | (255 & r[21]) << 8 | (255 & r[22]) << 16 | (255 & r[23]) << 24, b = 255 & r[24] | (255 & r[25]) << 8 | (255 & r[26]) << 16 | (255 & r[27]) << 24, w = 255 & r[28] | (255 & r[29]) << 8 | (255 & r[30]) << 16 | (255 & r[31]) << 24, v = 255 & n[12] | (255 & n[13]) << 8 | (255 & n[14]) << 16 | (255 & n[15]) << 24, E = o, x = s, A = a, S = c, T = l, k = u, I = f, C = h, B = d, O = p, j = g, M = y, _ = m, U = b, N = w, L = v, R = 0; R < 20; R += 2) T ^= (i = E + _ | 0) << 7 | i >>> 25, B ^= (i = T + E | 0) << 9 | i >>> 23, _ ^= (i = B + T | 0) << 13 | i >>> 19, E ^= (i = _ + B | 0) << 18 | i >>> 14, O ^= (i = k + x | 0) << 7 | i >>> 25, U ^= (i = O + k | 0) << 9 | i >>> 23, x ^= (i = U + O | 0) << 13 | i >>> 19, k ^= (i = x + U | 0) << 18 | i >>> 14, N ^= (i = j + I | 0) << 7 | i >>> 25, A ^= (i = N + j | 0) << 9 | i >>> 23, I ^= (i = A + N | 0) << 13 | i >>> 19, j ^= (i = I + A | 0) << 18 | i >>> 14, S ^= (i = L + M | 0) << 7 | i >>> 25, C ^= (i = S + L | 0) << 9 | i >>> 23, M ^= (i = C + S | 0) << 13 | i >>> 19, L ^= (i = M + C | 0) << 18 | i >>> 14, x ^= (i = E + S | 0) << 7 | i >>> 25, A ^= (i = x + E | 0) << 9 | i >>> 23, S ^= (i = A + x | 0) << 13 | i >>> 19, E ^= (i = S + A | 0) << 18 | i >>> 14, I ^= (i = k + T | 0) << 7 | i >>> 25, C ^= (i = I + k | 0) << 9 | i >>> 23, T ^= (i = C + I | 0) << 13 | i >>> 19, k ^= (i = T + C | 0) << 18 | i >>> 14, M ^= (i = j + O | 0) << 7 | i >>> 25, B ^= (i = M + j | 0) << 9 | i >>> 23, O ^= (i = B + M | 0) << 13 | i >>> 19, j ^= (i = O + B | 0) << 18 | i >>> 14, _ ^= (i = L + N | 0) << 7 | i >>> 25, U ^= (i = _ + L | 0) << 9 | i >>> 23, N ^= (i = U + _ | 0) << 13 | i >>> 19, L ^= (i = N + U | 0) << 18 | i >>> 14;
                        E = E + o | 0, x = x + s | 0, A = A + a | 0, S = S + c | 0, T = T + l | 0, k = k + u | 0, I = I + f | 0, C = C + h | 0, B = B + d | 0, O = O + p | 0, j = j + g | 0, M = M + y | 0, _ = _ + m | 0, U = U + b | 0, N = N + w | 0, L = L + v | 0, e[0] = E >>> 0 & 255, e[1] = E >>> 8 & 255, e[2] = E >>> 16 & 255, e[3] = E >>> 24 & 255, e[4] = x >>> 0 & 255, e[5] = x >>> 8 & 255, e[6] = x >>> 16 & 255, e[7] = x >>> 24 & 255, e[8] = A >>> 0 & 255, e[9] = A >>> 8 & 255, e[10] = A >>> 16 & 255, e[11] = A >>> 24 & 255, e[12] = S >>> 0 & 255, e[13] = S >>> 8 & 255, e[14] = S >>> 16 & 255, e[15] = S >>> 24 & 255, e[16] = T >>> 0 & 255, e[17] = T >>> 8 & 255, e[18] = T >>> 16 & 255, e[19] = T >>> 24 & 255, e[20] = k >>> 0 & 255, e[21] = k >>> 8 & 255, e[22] = k >>> 16 & 255, e[23] = k >>> 24 & 255, e[24] = I >>> 0 & 255, e[25] = I >>> 8 & 255, e[26] = I >>> 16 & 255, e[27] = I >>> 24 & 255, e[28] = C >>> 0 & 255, e[29] = C >>> 8 & 255, e[30] = C >>> 16 & 255, e[31] = C >>> 24 & 255, e[32] = B >>> 0 & 255, e[33] = B >>> 8 & 255, e[34] = B >>> 16 & 255, e[35] = B >>> 24 & 255, e[36] = O >>> 0 & 255, e[37] = O >>> 8 & 255, e[38] = O >>> 16 & 255, e[39] = O >>> 24 & 255, e[40] = j >>> 0 & 255, e[41] = j >>> 8 & 255, e[42] = j >>> 16 & 255, e[43] = j >>> 24 & 255, e[44] = M >>> 0 & 255, e[45] = M >>> 8 & 255, e[46] = M >>> 16 & 255, e[47] = M >>> 24 & 255, e[48] = _ >>> 0 & 255, e[49] = _ >>> 8 & 255, e[50] = _ >>> 16 & 255, e[51] = _ >>> 24 & 255, e[52] = U >>> 0 & 255, e[53] = U >>> 8 & 255, e[54] = U >>> 16 & 255, e[55] = U >>> 24 & 255, e[56] = N >>> 0 & 255, e[57] = N >>> 8 & 255, e[58] = N >>> 16 & 255, e[59] = N >>> 24 & 255, e[60] = L >>> 0 & 255, e[61] = L >>> 8 & 255, e[62] = L >>> 16 & 255, e[63] = L >>> 24 & 255
                    }(e, t, r, n)
                }

                function v(e, t, r, n) {
                    ! function(e, t, r, n) {
                        for (var i, o = 255 & n[0] | (255 & n[1]) << 8 | (255 & n[2]) << 16 | (255 & n[3]) << 24, s = 255 & r[0] | (255 & r[1]) << 8 | (255 & r[2]) << 16 | (255 & r[3]) << 24, a = 255 & r[4] | (255 & r[5]) << 8 | (255 & r[6]) << 16 | (255 & r[7]) << 24, c = 255 & r[8] | (255 & r[9]) << 8 | (255 & r[10]) << 16 | (255 & r[11]) << 24, l = 255 & r[12] | (255 & r[13]) << 8 | (255 & r[14]) << 16 | (255 & r[15]) << 24, u = 255 & n[4] | (255 & n[5]) << 8 | (255 & n[6]) << 16 | (255 & n[7]) << 24, f = 255 & t[0] | (255 & t[1]) << 8 | (255 & t[2]) << 16 | (255 & t[3]) << 24, h = 255 & t[4] | (255 & t[5]) << 8 | (255 & t[6]) << 16 | (255 & t[7]) << 24, d = 255 & t[8] | (255 & t[9]) << 8 | (255 & t[10]) << 16 | (255 & t[11]) << 24, p = 255 & t[12] | (255 & t[13]) << 8 | (255 & t[14]) << 16 | (255 & t[15]) << 24, g = 255 & n[8] | (255 & n[9]) << 8 | (255 & n[10]) << 16 | (255 & n[11]) << 24, y = 255 & r[16] | (255 & r[17]) << 8 | (255 & r[18]) << 16 | (255 & r[19]) << 24, m = 255 & r[20] | (255 & r[21]) << 8 | (255 & r[22]) << 16 | (255 & r[23]) << 24, b = 255 & r[24] | (255 & r[25]) << 8 | (255 & r[26]) << 16 | (255 & r[27]) << 24, w = 255 & r[28] | (255 & r[29]) << 8 | (255 & r[30]) << 16 | (255 & r[31]) << 24, v = 255 & n[12] | (255 & n[13]) << 8 | (255 & n[14]) << 16 | (255 & n[15]) << 24, E = o, x = s, A = a, S = c, T = l, k = u, I = f, C = h, B = d, O = p, j = g, M = y, _ = m, U = b, N = w, L = v, R = 0; R < 20; R += 2) T ^= (i = E + _ | 0) << 7 | i >>> 25, B ^= (i = T + E | 0) << 9 | i >>> 23, _ ^= (i = B + T | 0) << 13 | i >>> 19, E ^= (i = _ + B | 0) << 18 | i >>> 14, O ^= (i = k + x | 0) << 7 | i >>> 25, U ^= (i = O + k | 0) << 9 | i >>> 23, x ^= (i = U + O | 0) << 13 | i >>> 19, k ^= (i = x + U | 0) << 18 | i >>> 14, N ^= (i = j + I | 0) << 7 | i >>> 25, A ^= (i = N + j | 0) << 9 | i >>> 23, I ^= (i = A + N | 0) << 13 | i >>> 19, j ^= (i = I + A | 0) << 18 | i >>> 14, S ^= (i = L + M | 0) << 7 | i >>> 25, C ^= (i = S + L | 0) << 9 | i >>> 23, M ^= (i = C + S | 0) << 13 | i >>> 19, L ^= (i = M + C | 0) << 18 | i >>> 14, x ^= (i = E + S | 0) << 7 | i >>> 25, A ^= (i = x + E | 0) << 9 | i >>> 23, S ^= (i = A + x | 0) << 13 | i >>> 19, E ^= (i = S + A | 0) << 18 | i >>> 14, I ^= (i = k + T | 0) << 7 | i >>> 25, C ^= (i = I + k | 0) << 9 | i >>> 23, T ^= (i = C + I | 0) << 13 | i >>> 19, k ^= (i = T + C | 0) << 18 | i >>> 14, M ^= (i = j + O | 0) << 7 | i >>> 25, B ^= (i = M + j | 0) << 9 | i >>> 23, O ^= (i = B + M | 0) << 13 | i >>> 19, j ^= (i = O + B | 0) << 18 | i >>> 14, _ ^= (i = L + N | 0) << 7 | i >>> 25, U ^= (i = _ + L | 0) << 9 | i >>> 23, N ^= (i = U + _ | 0) << 13 | i >>> 19, L ^= (i = N + U | 0) << 18 | i >>> 14;
                        e[0] = E >>> 0 & 255, e[1] = E >>> 8 & 255, e[2] = E >>> 16 & 255, e[3] = E >>> 24 & 255, e[4] = k >>> 0 & 255, e[5] = k >>> 8 & 255, e[6] = k >>> 16 & 255, e[7] = k >>> 24 & 255, e[8] = j >>> 0 & 255, e[9] = j >>> 8 & 255, e[10] = j >>> 16 & 255, e[11] = j >>> 24 & 255, e[12] = L >>> 0 & 255, e[13] = L >>> 8 & 255, e[14] = L >>> 16 & 255, e[15] = L >>> 24 & 255, e[16] = I >>> 0 & 255, e[17] = I >>> 8 & 255, e[18] = I >>> 16 & 255, e[19] = I >>> 24 & 255, e[20] = C >>> 0 & 255, e[21] = C >>> 8 & 255, e[22] = C >>> 16 & 255, e[23] = C >>> 24 & 255, e[24] = B >>> 0 & 255, e[25] = B >>> 8 & 255, e[26] = B >>> 16 & 255, e[27] = B >>> 24 & 255, e[28] = O >>> 0 & 255, e[29] = O >>> 8 & 255, e[30] = O >>> 16 & 255, e[31] = O >>> 24 & 255
                    }(e, t, r, n)
                }
                var E = new Uint8Array([101, 120, 112, 97, 110, 100, 32, 51, 50, 45, 98, 121, 116, 101, 32, 107]);

                function x(e, t, r, n, i, o, s) {
                    var a, c, l = new Uint8Array(16),
                        u = new Uint8Array(64);
                    for (c = 0; c < 16; c++) l[c] = 0;
                    for (c = 0; c < 8; c++) l[c] = o[c];
                    for (; i >= 64;) {
                        for (w(u, l, s, E), c = 0; c < 64; c++) e[t + c] = r[n + c] ^ u[c];
                        for (c = 8, a = 1; c < 16; c++) a = a + (255 & l[c]) | 0, l[c] = 255 & a, a >>>= 8;
                        i -= 64, t += 64, n += 64
                    }
                    if (i > 0)
                        for (w(u, l, s, E), c = 0; c < i; c++) e[t + c] = r[n + c] ^ u[c];
                    return 0
                }

                function A(e, t, r, n, i) {
                    var o, s, a = new Uint8Array(16),
                        c = new Uint8Array(64);
                    for (s = 0; s < 16; s++) a[s] = 0;
                    for (s = 0; s < 8; s++) a[s] = n[s];
                    for (; r >= 64;) {
                        for (w(c, a, i, E), s = 0; s < 64; s++) e[t + s] = c[s];
                        for (s = 8, o = 1; s < 16; s++) o = o + (255 & a[s]) | 0, a[s] = 255 & o, o >>>= 8;
                        r -= 64, t += 64
                    }
                    if (r > 0)
                        for (w(c, a, i, E), s = 0; s < r; s++) e[t + s] = c[s];
                    return 0
                }

                function S(e, t, r, n, i) {
                    var o = new Uint8Array(32);
                    v(o, n, i, E);
                    for (var s = new Uint8Array(8), a = 0; a < 8; a++) s[a] = n[a + 16];
                    return A(e, t, r, s, o)
                }

                function T(e, t, r, n, i, o, s) {
                    var a = new Uint8Array(32);
                    v(a, o, s, E);
                    for (var c = new Uint8Array(8), l = 0; l < 8; l++) c[l] = o[l + 16];
                    return x(e, t, r, n, i, c, a)
                }
                var k = function(e) {
                    var t, r, n, i, o, s, a, c;
                    this.buffer = new Uint8Array(16), this.r = new Uint16Array(10), this.h = new Uint16Array(10), this.pad = new Uint16Array(8), this.leftover = 0, this.fin = 0, t = 255 & e[0] | (255 & e[1]) << 8, this.r[0] = 8191 & t, r = 255 & e[2] | (255 & e[3]) << 8, this.r[1] = (t >>> 13 | r << 3) & 8191, n = 255 & e[4] | (255 & e[5]) << 8, this.r[2] = (r >>> 10 | n << 6) & 7939, i = 255 & e[6] | (255 & e[7]) << 8, this.r[3] = (n >>> 7 | i << 9) & 8191, o = 255 & e[8] | (255 & e[9]) << 8, this.r[4] = (i >>> 4 | o << 12) & 255, this.r[5] = o >>> 1 & 8190, s = 255 & e[10] | (255 & e[11]) << 8, this.r[6] = (o >>> 14 | s << 2) & 8191, a = 255 & e[12] | (255 & e[13]) << 8, this.r[7] = (s >>> 11 | a << 5) & 8065, c = 255 & e[14] | (255 & e[15]) << 8, this.r[8] = (a >>> 8 | c << 8) & 8191, this.r[9] = c >>> 5 & 127, this.pad[0] = 255 & e[16] | (255 & e[17]) << 8, this.pad[1] = 255 & e[18] | (255 & e[19]) << 8, this.pad[2] = 255 & e[20] | (255 & e[21]) << 8, this.pad[3] = 255 & e[22] | (255 & e[23]) << 8, this.pad[4] = 255 & e[24] | (255 & e[25]) << 8, this.pad[5] = 255 & e[26] | (255 & e[27]) << 8, this.pad[6] = 255 & e[28] | (255 & e[29]) << 8, this.pad[7] = 255 & e[30] | (255 & e[31]) << 8
                };

                function I(e, t, r, n, i, o) {
                    var s = new k(o);
                    return s.update(r, n, i), s.finish(e, t), 0
                }

                function C(e, t, r, n, i, o) {
                    var s = new Uint8Array(16);
                    return I(s, 0, r, n, i, o), m(e, t, s, 0)
                }

                function B(e, t, r, n, i) {
                    var o;
                    if (r < 32) return -1;
                    for (T(e, 0, t, 0, r, n, i), I(e, 16, e, 32, r - 32, e), o = 0; o < 16; o++) e[o] = 0;
                    return 0
                }

                function O(e, t, r, n, i) {
                    var o, s = new Uint8Array(32);
                    if (r < 32 || (S(s, 0, 32, n, i), 0 !== C(t, 16, t, 32, r - 32, s))) return -1;
                    for (T(e, 0, t, 0, r, n, i), o = 0; o < 32; o++) e[o] = 0;
                    return 0
                }

                function j(e, t) {
                    var r;
                    for (r = 0; r < 16; r++) e[r] = 0 | t[r]
                }

                function M(e) {
                    var t, r, n = 1;
                    for (t = 0; t < 16; t++) n = Math.floor((r = e[t] + n + 65535) / 65536), e[t] = r - 65536 * n;
                    e[0] += n - 1 + 37 * (n - 1)
                }

                function _(e, t, r) {
                    for (var n, i = ~(r - 1), o = 0; o < 16; o++) n = i & (e[o] ^ t[o]), e[o] ^= n, t[o] ^= n
                }

                function U(e, t) {
                    var r, i, o, s = n(),
                        a = n();
                    for (r = 0; r < 16; r++) a[r] = t[r];
                    for (M(a), M(a), M(a), i = 0; i < 2; i++) {
                        for (r = 1, s[0] = a[0] - 65517; r < 15; r++) s[r] = a[r] - 65535 - (s[r - 1] >> 16 & 1), s[r - 1] &= 65535;
                        s[15] = a[15] - 32767 - (s[14] >> 16 & 1), o = s[15] >> 16 & 1, s[14] &= 65535, _(a, s, 1 - o)
                    }
                    for (r = 0; r < 16; r++) e[2 * r] = 255 & a[r], e[2 * r + 1] = a[r] >> 8
                }

                function N(e, t) {
                    var r = new Uint8Array(32),
                        n = new Uint8Array(32);
                    return U(r, e), U(n, t), b(r, 0, n, 0)
                }

                function L(e) {
                    var t = new Uint8Array(32);
                    return U(t, e), 1 & t[0]
                }

                function R(e, t) {
                    var r;
                    for (r = 0; r < 16; r++) e[r] = t[2 * r] + (t[2 * r + 1] << 8);
                    e[15] &= 32767
                }

                function D(e, t, r) {
                    for (var n = 0; n < 16; n++) e[n] = t[n] + r[n]
                }

                function P(e, t, r) {
                    for (var n = 0; n < 16; n++) e[n] = t[n] - r[n]
                }

                function W(e, t, r) {
                    var n, i, o = 0,
                        s = 0,
                        a = 0,
                        c = 0,
                        l = 0,
                        u = 0,
                        f = 0,
                        h = 0,
                        d = 0,
                        p = 0,
                        g = 0,
                        y = 0,
                        m = 0,
                        b = 0,
                        w = 0,
                        v = 0,
                        E = 0,
                        x = 0,
                        A = 0,
                        S = 0,
                        T = 0,
                        k = 0,
                        I = 0,
                        C = 0,
                        B = 0,
                        O = 0,
                        j = 0,
                        M = 0,
                        _ = 0,
                        U = 0,
                        N = 0,
                        L = r[0],
                        R = r[1],
                        D = r[2],
                        P = r[3],
                        W = r[4],
                        z = r[5],
                        Z = r[6],
                        H = r[7],
                        V = r[8],
                        F = r[9],
                        $ = r[10],
                        G = r[11],
                        q = r[12],
                        K = r[13],
                        Y = r[14],
                        J = r[15];
                    o += (n = t[0]) * L, s += n * R, a += n * D, c += n * P, l += n * W, u += n * z, f += n * Z, h += n * H, d += n * V, p += n * F, g += n * $, y += n * G, m += n * q, b += n * K, w += n * Y, v += n * J, s += (n = t[1]) * L, a += n * R, c += n * D, l += n * P, u += n * W, f += n * z, h += n * Z, d += n * H, p += n * V, g += n * F, y += n * $, m += n * G, b += n * q, w += n * K, v += n * Y, E += n * J, a += (n = t[2]) * L, c += n * R, l += n * D, u += n * P, f += n * W, h += n * z, d += n * Z, p += n * H, g += n * V, y += n * F, m += n * $, b += n * G, w += n * q, v += n * K, E += n * Y, x += n * J, c += (n = t[3]) * L, l += n * R, u += n * D, f += n * P, h += n * W, d += n * z, p += n * Z, g += n * H, y += n * V, m += n * F, b += n * $, w += n * G, v += n * q, E += n * K, x += n * Y, A += n * J, l += (n = t[4]) * L, u += n * R, f += n * D, h += n * P, d += n * W, p += n * z, g += n * Z, y += n * H, m += n * V, b += n * F, w += n * $, v += n * G, E += n * q, x += n * K, A += n * Y, S += n * J, u += (n = t[5]) * L, f += n * R, h += n * D, d += n * P, p += n * W, g += n * z, y += n * Z, m += n * H, b += n * V, w += n * F, v += n * $, E += n * G, x += n * q, A += n * K, S += n * Y, T += n * J, f += (n = t[6]) * L, h += n * R, d += n * D, p += n * P, g += n * W, y += n * z, m += n * Z, b += n * H, w += n * V, v += n * F, E += n * $, x += n * G, A += n * q, S += n * K, T += n * Y, k += n * J, h += (n = t[7]) * L, d += n * R, p += n * D, g += n * P, y += n * W, m += n * z, b += n * Z, w += n * H, v += n * V, E += n * F, x += n * $, A += n * G, S += n * q, T += n * K, k += n * Y, I += n * J, d += (n = t[8]) * L, p += n * R, g += n * D, y += n * P, m += n * W, b += n * z, w += n * Z, v += n * H, E += n * V, x += n * F, A += n * $, S += n * G, T += n * q, k += n * K, I += n * Y, C += n * J, p += (n = t[9]) * L, g += n * R, y += n * D, m += n * P, b += n * W, w += n * z, v += n * Z, E += n * H, x += n * V, A += n * F, S += n * $, T += n * G, k += n * q, I += n * K, C += n * Y, B += n * J, g += (n = t[10]) * L, y += n * R, m += n * D, b += n * P, w += n * W, v += n * z, E += n * Z, x += n * H, A += n * V, S += n * F, T += n * $, k += n * G, I += n * q, C += n * K, B += n * Y, O += n * J, y += (n = t[11]) * L, m += n * R, b += n * D, w += n * P, v += n * W, E += n * z, x += n * Z, A += n * H, S += n * V, T += n * F, k += n * $, I += n * G, C += n * q, B += n * K, O += n * Y, j += n * J, m += (n = t[12]) * L, b += n * R, w += n * D, v += n * P, E += n * W, x += n * z, A += n * Z, S += n * H, T += n * V, k += n * F, I += n * $, C += n * G, B += n * q, O += n * K, j += n * Y, M += n * J, b += (n = t[13]) * L, w += n * R, v += n * D, E += n * P, x += n * W, A += n * z, S += n * Z, T += n * H, k += n * V, I += n * F, C += n * $, B += n * G, O += n * q, j += n * K, M += n * Y, _ += n * J, w += (n = t[14]) * L, v += n * R, E += n * D, x += n * P, A += n * W, S += n * z, T += n * Z, k += n * H, I += n * V, C += n * F, B += n * $, O += n * G, j += n * q, M += n * K, _ += n * Y, U += n * J, v += (n = t[15]) * L, E += n * R, x += n * D, A += n * P, S += n * W, T += n * z, k += n * Z, I += n * H, C += n * V, B += n * F, O += n * $, j += n * G, M += n * q, _ += n * K, U += n * Y, N += n * J, o += 38 * E, s += 38 * x, a += 38 * A, c += 38 * S, l += 38 * T, u += 38 * k, f += 38 * I, h += 38 * C, d += 38 * B, p += 38 * O, g += 38 * j, y += 38 * M, m += 38 * _, b += 38 * U, w += 38 * N, i = Math.floor((n = o + (i = 1) + 65535) / 65536), o = n - 65536 * i, i = Math.floor((n = s + i + 65535) / 65536), s = n - 65536 * i, i = Math.floor((n = a + i + 65535) / 65536), a = n - 65536 * i, i = Math.floor((n = c + i + 65535) / 65536), c = n - 65536 * i, i = Math.floor((n = l + i + 65535) / 65536), l = n - 65536 * i, i = Math.floor((n = u + i + 65535) / 65536), u = n - 65536 * i, i = Math.floor((n = f + i + 65535) / 65536), f = n - 65536 * i, i = Math.floor((n = h + i + 65535) / 65536), h = n - 65536 * i, i = Math.floor((n = d + i + 65535) / 65536), d = n - 65536 * i, i = Math.floor((n = p + i + 65535) / 65536), p = n - 65536 * i, i = Math.floor((n = g + i + 65535) / 65536), g = n - 65536 * i, i = Math.floor((n = y + i + 65535) / 65536), y = n - 65536 * i, i = Math.floor((n = m + i + 65535) / 65536), m = n - 65536 * i, i = Math.floor((n = b + i + 65535) / 65536), b = n - 65536 * i, i = Math.floor((n = w + i + 65535) / 65536), w = n - 65536 * i, i = Math.floor((n = v + i + 65535) / 65536), v = n - 65536 * i, o += i - 1 + 37 * (i - 1), i = Math.floor((n = o + (i = 1) + 65535) / 65536), o = n - 65536 * i, i = Math.floor((n = s + i + 65535) / 65536), s = n - 65536 * i, i = Math.floor((n = a + i + 65535) / 65536), a = n - 65536 * i, i = Math.floor((n = c + i + 65535) / 65536), c = n - 65536 * i, i = Math.floor((n = l + i + 65535) / 65536), l = n - 65536 * i, i = Math.floor((n = u + i + 65535) / 65536), u = n - 65536 * i, i = Math.floor((n = f + i + 65535) / 65536), f = n - 65536 * i, i = Math.floor((n = h + i + 65535) / 65536), h = n - 65536 * i, i = Math.floor((n = d + i + 65535) / 65536), d = n - 65536 * i, i = Math.floor((n = p + i + 65535) / 65536), p = n - 65536 * i, i = Math.floor((n = g + i + 65535) / 65536), g = n - 65536 * i, i = Math.floor((n = y + i + 65535) / 65536), y = n - 65536 * i, i = Math.floor((n = m + i + 65535) / 65536), m = n - 65536 * i, i = Math.floor((n = b + i + 65535) / 65536), b = n - 65536 * i, i = Math.floor((n = w + i + 65535) / 65536), w = n - 65536 * i, i = Math.floor((n = v + i + 65535) / 65536), v = n - 65536 * i, o += i - 1 + 37 * (i - 1), e[0] = o, e[1] = s, e[2] = a, e[3] = c, e[4] = l, e[5] = u, e[6] = f, e[7] = h, e[8] = d, e[9] = p, e[10] = g, e[11] = y, e[12] = m, e[13] = b, e[14] = w, e[15] = v
                }

                function z(e, t) {
                    W(e, t, t)
                }

                function Z(e, t) {
                    var r, i = n();
                    for (r = 0; r < 16; r++) i[r] = t[r];
                    for (r = 253; r >= 0; r--) z(i, i), 2 !== r && 4 !== r && W(i, i, t);
                    for (r = 0; r < 16; r++) e[r] = i[r]
                }

                function H(e, t) {
                    var r, i = n();
                    for (r = 0; r < 16; r++) i[r] = t[r];
                    for (r = 250; r >= 0; r--) z(i, i), 1 !== r && W(i, i, t);
                    for (r = 0; r < 16; r++) e[r] = i[r]
                }

                function V(e, t, r) {
                    var i, o, s = new Uint8Array(32),
                        a = new Float64Array(80),
                        c = n(),
                        u = n(),
                        f = n(),
                        h = n(),
                        d = n(),
                        p = n();
                    for (o = 0; o < 31; o++) s[o] = t[o];
                    for (s[31] = 127 & t[31] | 64, s[0] &= 248, R(a, r), o = 0; o < 16; o++) u[o] = a[o], h[o] = c[o] = f[o] = 0;
                    for (o = 254, c[0] = h[0] = 1; o >= 0; --o) _(c, u, i = s[o >>> 3] >>> (7 & o) & 1), _(f, h, i), D(d, c, f), P(c, c, f), D(f, u, h), P(u, u, h), z(h, d), z(p, c), W(c, f, c), W(f, u, d), D(d, c, f), P(c, c, f), z(u, c), P(f, h, p), W(c, f, l), D(c, c, h), W(f, f, c), W(c, h, p), W(h, u, a), z(u, d), _(c, u, i), _(f, h, i);
                    for (o = 0; o < 16; o++) a[o + 16] = c[o], a[o + 32] = f[o], a[o + 48] = u[o], a[o + 64] = h[o];
                    var g = a.subarray(32),
                        y = a.subarray(16);
                    return Z(g, g), W(y, y, g), U(e, y), 0
                }

                function F(e, t) {
                    return V(e, t, s)
                }

                function $(e, t) {
                    return i(t, 32), F(e, t)
                }

                function G(e, t, r) {
                    var n = new Uint8Array(32);
                    return V(n, r, t), v(e, o, n, E)
                }
                k.prototype.blocks = function(e, t, r) {
                    for (var n, i, o, s, a, c, l, u, f, h, d, p, g, y, m, b, w, v, E, x = this.fin ? 0 : 2048, A = this.h[0], S = this.h[1], T = this.h[2], k = this.h[3], I = this.h[4], C = this.h[5], B = this.h[6], O = this.h[7], j = this.h[8], M = this.h[9], _ = this.r[0], U = this.r[1], N = this.r[2], L = this.r[3], R = this.r[4], D = this.r[5], P = this.r[6], W = this.r[7], z = this.r[8], Z = this.r[9]; r >= 16;) A += 8191 & (n = 255 & e[t + 0] | (255 & e[t + 1]) << 8), S += (n >>> 13 | (i = 255 & e[t + 2] | (255 & e[t + 3]) << 8) << 3) & 8191, T += (i >>> 10 | (o = 255 & e[t + 4] | (255 & e[t + 5]) << 8) << 6) & 8191, k += (o >>> 7 | (s = 255 & e[t + 6] | (255 & e[t + 7]) << 8) << 9) & 8191, I += (s >>> 4 | (a = 255 & e[t + 8] | (255 & e[t + 9]) << 8) << 12) & 8191, C += a >>> 1 & 8191, B += (a >>> 14 | (c = 255 & e[t + 10] | (255 & e[t + 11]) << 8) << 2) & 8191, O += (c >>> 11 | (l = 255 & e[t + 12] | (255 & e[t + 13]) << 8) << 5) & 8191, j += (l >>> 8 | (u = 255 & e[t + 14] | (255 & e[t + 15]) << 8) << 8) & 8191, M += u >>> 5 | x, f = (h = (f = 0) + A * _ + S * (5 * Z) + T * (5 * z) + k * (5 * W) + I * (5 * P)) >>> 13, h &= 8191, h += C * (5 * D) + B * (5 * R) + O * (5 * L) + j * (5 * N) + M * (5 * U), f += h >>> 13, h &= 8191, f = (d = f + A * U + S * _ + T * (5 * Z) + k * (5 * z) + I * (5 * W)) >>> 13, d &= 8191, d += C * (5 * P) + B * (5 * D) + O * (5 * R) + j * (5 * L) + M * (5 * N), f += d >>> 13, d &= 8191, f = (p = f + A * N + S * U + T * _ + k * (5 * Z) + I * (5 * z)) >>> 13, p &= 8191, p += C * (5 * W) + B * (5 * P) + O * (5 * D) + j * (5 * R) + M * (5 * L), f += p >>> 13, p &= 8191, f = (g = f + A * L + S * N + T * U + k * _ + I * (5 * Z)) >>> 13, g &= 8191, g += C * (5 * z) + B * (5 * W) + O * (5 * P) + j * (5 * D) + M * (5 * R), f += g >>> 13, g &= 8191, f = (y = f + A * R + S * L + T * N + k * U + I * _) >>> 13, y &= 8191, y += C * (5 * Z) + B * (5 * z) + O * (5 * W) + j * (5 * P) + M * (5 * D), f += y >>> 13, y &= 8191, f = (m = f + A * D + S * R + T * L + k * N + I * U) >>> 13, m &= 8191, m += C * _ + B * (5 * Z) + O * (5 * z) + j * (5 * W) + M * (5 * P), f += m >>> 13, m &= 8191, f = (b = f + A * P + S * D + T * R + k * L + I * N) >>> 13, b &= 8191, b += C * U + B * _ + O * (5 * Z) + j * (5 * z) + M * (5 * W), f += b >>> 13, b &= 8191, f = (w = f + A * W + S * P + T * D + k * R + I * L) >>> 13, w &= 8191, w += C * N + B * U + O * _ + j * (5 * Z) + M * (5 * z), f += w >>> 13, w &= 8191, f = (v = f + A * z + S * W + T * P + k * D + I * R) >>> 13, v &= 8191, v += C * L + B * N + O * U + j * _ + M * (5 * Z), f += v >>> 13, v &= 8191, f = (E = f + A * Z + S * z + T * W + k * P + I * D) >>> 13, E &= 8191, E += C * R + B * L + O * N + j * U + M * _, f += E >>> 13, E &= 8191, h = 8191 & (f = (f = (f << 2) + f | 0) + h | 0), f >>>= 13, d += f, A = h, S = d, T = p, k = g, I = y, C = m, B = b, O = w, j = v, M = E, t += 16, r -= 16;
                    this.h[0] = A, this.h[1] = S, this.h[2] = T, this.h[3] = k, this.h[4] = I, this.h[5] = C, this.h[6] = B, this.h[7] = O, this.h[8] = j, this.h[9] = M
                }, k.prototype.finish = function(e, t) {
                    var r, n, i, o, s = new Uint16Array(10);
                    if (this.leftover) {
                        for (o = this.leftover, this.buffer[o++] = 1; o < 16; o++) this.buffer[o] = 0;
                        this.fin = 1, this.blocks(this.buffer, 0, 16)
                    }
                    for (r = this.h[1] >>> 13, this.h[1] &= 8191, o = 2; o < 10; o++) this.h[o] += r, r = this.h[o] >>> 13, this.h[o] &= 8191;
                    for (this.h[0] += 5 * r, r = this.h[0] >>> 13, this.h[0] &= 8191, this.h[1] += r, r = this.h[1] >>> 13, this.h[1] &= 8191, this.h[2] += r, s[0] = this.h[0] + 5, r = s[0] >>> 13, s[0] &= 8191, o = 1; o < 10; o++) s[o] = this.h[o] + r, r = s[o] >>> 13, s[o] &= 8191;
                    for (s[9] -= 8192, n = (1 ^ r) - 1, o = 0; o < 10; o++) s[o] &= n;
                    for (o = 0, n = ~n; o < 10; o++) this.h[o] = this.h[o] & n | s[o];
                    for (o = 1, this.h[0] = (this.h[0] | this.h[1] << 13) & 65535, this.h[1] = (this.h[1] >>> 3 | this.h[2] << 10) & 65535, this.h[2] = (this.h[2] >>> 6 | this.h[3] << 7) & 65535, this.h[3] = (this.h[3] >>> 9 | this.h[4] << 4) & 65535, this.h[4] = (this.h[4] >>> 12 | this.h[5] << 1 | this.h[6] << 14) & 65535, this.h[5] = (this.h[6] >>> 2 | this.h[7] << 11) & 65535, this.h[6] = (this.h[7] >>> 5 | this.h[8] << 8) & 65535, this.h[7] = (this.h[8] >>> 8 | this.h[9] << 5) & 65535, i = this.h[0] + this.pad[0], this.h[0] = 65535 & i; o < 8; o++) i = (this.h[o] + this.pad[o] | 0) + (i >>> 16) | 0, this.h[o] = 65535 & i;
                    e[t + 0] = this.h[0] >>> 0 & 255, e[t + 1] = this.h[0] >>> 8 & 255, e[t + 2] = this.h[1] >>> 0 & 255, e[t + 3] = this.h[1] >>> 8 & 255, e[t + 4] = this.h[2] >>> 0 & 255, e[t + 5] = this.h[2] >>> 8 & 255, e[t + 6] = this.h[3] >>> 0 & 255, e[t + 7] = this.h[3] >>> 8 & 255, e[t + 8] = this.h[4] >>> 0 & 255, e[t + 9] = this.h[4] >>> 8 & 255, e[t + 10] = this.h[5] >>> 0 & 255, e[t + 11] = this.h[5] >>> 8 & 255, e[t + 12] = this.h[6] >>> 0 & 255, e[t + 13] = this.h[6] >>> 8 & 255, e[t + 14] = this.h[7] >>> 0 & 255, e[t + 15] = this.h[7] >>> 8 & 255
                }, k.prototype.update = function(e, t, r) {
                    var n, i;
                    if (this.leftover) {
                        for ((i = 16 - this.leftover) > r && (i = r), n = 0; n < i; n++) this.buffer[this.leftover + n] = e[t + n];
                        if (r -= i, t += i, this.leftover += i, this.leftover < 16) return;
                        this.blocks(this.buffer, 0, 16), this.leftover = 0
                    }
                    if (r >= 16 && (i = r - r % 16, this.blocks(e, t, i), t += i, r -= i), r) {
                        for (n = 0; n < r; n++) this.buffer[this.leftover + n] = e[t + n];
                        this.leftover += r
                    }
                };
                var q = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];

                function K(e, t, r, n) {
                    for (var i, o, s, a, c, l, u, f, h, d, p, g, y, m, b, w, v, E, x, A, S, T, k, I, C, B, O = new Int32Array(16), j = new Int32Array(16), M = e[0], _ = e[1], U = e[2], N = e[3], L = e[4], R = e[5], D = e[6], P = e[7], W = t[0], z = t[1], Z = t[2], H = t[3], V = t[4], F = t[5], $ = t[6], G = t[7], K = 0; n >= 128;) {
                        for (x = 0; x < 16; x++) A = 8 * x + K, O[x] = r[A + 0] << 24 | r[A + 1] << 16 | r[A + 2] << 8 | r[A + 3], j[x] = r[A + 4] << 24 | r[A + 5] << 16 | r[A + 6] << 8 | r[A + 7];
                        for (x = 0; x < 80; x++)
                            if (i = M, o = _, s = U, a = N, c = L, l = R, u = D, f = P, h = W, d = z, p = Z, g = H, y = V, m = F, b = $, w = G, S = P, k = 65535 & (T = G), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = (L >>> 14 | V << 18) ^ (L >>> 18 | V << 14) ^ (V >>> 9 | L << 23), k += 65535 & (T = (V >>> 14 | L << 18) ^ (V >>> 18 | L << 14) ^ (L >>> 9 | V << 23)), I += T >>> 16, C += 65535 & S, B += S >>> 16, S = L & R ^ ~L & D, k += 65535 & (T = V & F ^ ~V & $), I += T >>> 16, C += 65535 & S, B += S >>> 16, S = q[2 * x], k += 65535 & (T = q[2 * x + 1]), I += T >>> 16, C += 65535 & S, B += S >>> 16, S = O[x % 16], k += 65535 & (T = j[x % 16]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, v = 65535 & C | B << 16, E = 65535 & k | I << 16, S = v, k = 65535 & (T = E), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = (M >>> 28 | W << 4) ^ (W >>> 2 | M << 30) ^ (W >>> 7 | M << 25), k += 65535 & (T = (W >>> 28 | M << 4) ^ (M >>> 2 | W << 30) ^ (M >>> 7 | W << 25)), I += T >>> 16, C += 65535 & S, B += S >>> 16, S = M & _ ^ M & U ^ _ & U, k += 65535 & (T = W & z ^ W & Z ^ z & Z), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, f = 65535 & C | B << 16, w = 65535 & k | I << 16, S = a, k = 65535 & (T = g), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = v, k += 65535 & (T = E), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, a = 65535 & C | B << 16, g = 65535 & k | I << 16, _ = i, U = o, N = s, L = a, R = c, D = l, P = u, M = f, z = h, Z = d, H = p, V = g, F = y, $ = m, G = b, W = w, x % 16 == 15)
                                for (A = 0; A < 16; A++) S = O[A], k = 65535 & (T = j[A]), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = O[(A + 9) % 16], k += 65535 & (T = j[(A + 9) % 16]), I += T >>> 16, C += 65535 & S, B += S >>> 16, S = ((v = O[(A + 1) % 16]) >>> 1 | (E = j[(A + 1) % 16]) << 31) ^ (v >>> 8 | E << 24) ^ v >>> 7, k += 65535 & (T = (E >>> 1 | v << 31) ^ (E >>> 8 | v << 24) ^ (E >>> 7 | v << 25)), I += T >>> 16, C += 65535 & S, B += S >>> 16, S = ((v = O[(A + 14) % 16]) >>> 19 | (E = j[(A + 14) % 16]) << 13) ^ (E >>> 29 | v << 3) ^ v >>> 6, k += 65535 & (T = (E >>> 19 | v << 13) ^ (v >>> 29 | E << 3) ^ (E >>> 6 | v << 26)), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, O[A] = 65535 & C | B << 16, j[A] = 65535 & k | I << 16;
                        S = M, k = 65535 & (T = W), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = e[0], k += 65535 & (T = t[0]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, e[0] = M = 65535 & C | B << 16, t[0] = W = 65535 & k | I << 16, S = _, k = 65535 & (T = z), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = e[1], k += 65535 & (T = t[1]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, e[1] = _ = 65535 & C | B << 16, t[1] = z = 65535 & k | I << 16, S = U, k = 65535 & (T = Z), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = e[2], k += 65535 & (T = t[2]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, e[2] = U = 65535 & C | B << 16, t[2] = Z = 65535 & k | I << 16, S = N, k = 65535 & (T = H), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = e[3], k += 65535 & (T = t[3]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, e[3] = N = 65535 & C | B << 16, t[3] = H = 65535 & k | I << 16, S = L, k = 65535 & (T = V), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = e[4], k += 65535 & (T = t[4]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, e[4] = L = 65535 & C | B << 16, t[4] = V = 65535 & k | I << 16, S = R, k = 65535 & (T = F), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = e[5], k += 65535 & (T = t[5]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, e[5] = R = 65535 & C | B << 16, t[5] = F = 65535 & k | I << 16, S = D, k = 65535 & (T = $), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = e[6], k += 65535 & (T = t[6]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, e[6] = D = 65535 & C | B << 16, t[6] = $ = 65535 & k | I << 16, S = P, k = 65535 & (T = G), I = T >>> 16, C = 65535 & S, B = S >>> 16, S = e[7], k += 65535 & (T = t[7]), I += T >>> 16, C += 65535 & S, B += S >>> 16, I += k >>> 16, C += I >>> 16, B += C >>> 16, e[7] = P = 65535 & C | B << 16, t[7] = G = 65535 & k | I << 16, K += 128, n -= 128
                    }
                    return n
                }

                function Y(e, t, r) {
                    var n, i = new Int32Array(8),
                        o = new Int32Array(8),
                        s = new Uint8Array(256),
                        a = r;
                    for (i[0] = 1779033703, i[1] = 3144134277, i[2] = 1013904242, i[3] = 2773480762, i[4] = 1359893119, i[5] = 2600822924, i[6] = 528734635, i[7] = 1541459225, o[0] = 4089235720, o[1] = 2227873595, o[2] = 4271175723, o[3] = 1595750129, o[4] = 2917565137, o[5] = 725511199, o[6] = 4215389547, o[7] = 327033209, K(i, o, t, r), r %= 128, n = 0; n < r; n++) s[n] = t[a - r + n];
                    for (s[r] = 128, s[(r = 256 - 128 * (r < 112 ? 1 : 0)) - 9] = 0, g(s, r - 8, a / 536870912 | 0, a << 3), K(i, o, s, r), n = 0; n < 8; n++) g(e, 8 * n, i[n], o[n]);
                    return 0
                }

                function J(e, t) {
                    var r = n(),
                        i = n(),
                        o = n(),
                        s = n(),
                        a = n(),
                        c = n(),
                        l = n(),
                        u = n(),
                        h = n();
                    P(r, e[1], e[0]), P(h, t[1], t[0]), W(r, r, h), D(i, e[0], e[1]), D(h, t[0], t[1]), W(i, i, h), W(o, e[3], t[3]), W(o, o, f), W(s, e[2], t[2]), D(s, s, s), P(a, i, r), P(c, s, o), D(l, s, o), D(u, i, r), W(e[0], a, c), W(e[1], u, l), W(e[2], l, c), W(e[3], a, u)
                }

                function X(e, t, r) {
                    var n;
                    for (n = 0; n < 4; n++) _(e[n], t[n], r)
                }

                function Q(e, t) {
                    var r = n(),
                        i = n(),
                        o = n();
                    Z(o, t[2]), W(r, t[0], o), W(i, t[1], o), U(e, i), e[31] ^= L(r) << 7
                }

                function ee(e, t, r) {
                    var n, i;
                    for (j(e[0], a), j(e[1], c), j(e[2], c), j(e[3], a), i = 255; i >= 0; --i) X(e, t, n = r[i / 8 | 0] >> (7 & i) & 1), J(t, e), J(e, e), X(e, t, n)
                }

                function et(e, t) {
                    var r = [n(), n(), n(), n()];
                    j(r[0], h), j(r[1], d), j(r[2], c), W(r[3], h, d), ee(e, r, t)
                }

                function er(e, t, r) {
                    var o, s = new Uint8Array(64),
                        a = [n(), n(), n(), n()];
                    for (r || i(t, 32), Y(s, t, 32), s[0] &= 248, s[31] &= 127, s[31] |= 64, et(a, s), Q(e, a), o = 0; o < 32; o++) t[o + 32] = e[o];
                    return 0
                }
                var en = new Float64Array([237, 211, 245, 92, 26, 99, 18, 88, 214, 156, 247, 162, 222, 249, 222, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16]);

                function ei(e, t) {
                    var r, n, i, o;
                    for (n = 63; n >= 32; --n) {
                        for (r = 0, i = n - 32, o = n - 12; i < o; ++i) t[i] += r - 16 * t[n] * en[i - (n - 32)], r = Math.floor((t[i] + 128) / 256), t[i] -= 256 * r;
                        t[i] += r, t[n] = 0
                    }
                    for (i = 0, r = 0; i < 32; i++) t[i] += r - (t[31] >> 4) * en[i], r = t[i] >> 8, t[i] &= 255;
                    for (i = 0; i < 32; i++) t[i] -= r * en[i];
                    for (n = 0; n < 32; n++) t[n + 1] += t[n] >> 8, e[n] = 255 & t[n]
                }

                function eo(e) {
                    var t, r = new Float64Array(64);
                    for (t = 0; t < 64; t++) r[t] = e[t];
                    for (t = 0; t < 64; t++) e[t] = 0;
                    ei(e, r)
                }

                function es(e, t, r, i) {
                    var o, s, a = new Uint8Array(64),
                        c = new Uint8Array(64),
                        l = new Uint8Array(64),
                        u = new Float64Array(64),
                        f = [n(), n(), n(), n()];
                    for (Y(a, i, 32), a[0] &= 248, a[31] &= 127, a[31] |= 64, o = 0; o < r; o++) e[64 + o] = t[o];
                    for (o = 0; o < 32; o++) e[32 + o] = a[32 + o];
                    for (Y(l, e.subarray(32), r + 32), eo(l), et(f, l), Q(e, f), o = 32; o < 64; o++) e[o] = i[o];
                    for (Y(c, e, r + 64), eo(c), o = 0; o < 64; o++) u[o] = 0;
                    for (o = 0; o < 32; o++) u[o] = l[o];
                    for (o = 0; o < 32; o++)
                        for (s = 0; s < 32; s++) u[o + s] += c[o] * a[s];
                    return ei(e.subarray(32), u), r + 64
                }

                function ea(e, t, r, i) {
                    var o, s, l, f, h, d, g, y, m = new Uint8Array(32),
                        w = new Uint8Array(64),
                        v = [n(), n(), n(), n()],
                        E = [n(), n(), n(), n()];
                    if (r < 64 || (o = n(), s = n(), l = n(), f = n(), h = n(), d = n(), g = n(), (j(E[2], c), R(E[1], i), z(l, E[1]), W(f, l, u), P(l, l, E[2]), D(f, E[2], f), z(h, f), z(d, h), W(g, d, h), W(o, g, l), W(o, o, f), H(o, o), W(o, o, l), W(o, o, f), W(o, o, f), W(E[0], o, f), z(s, E[0]), W(s, s, f), N(s, l) && W(E[0], E[0], p), z(s, E[0]), W(s, s, f), N(s, l)) ? -1 : (L(E[0]) === i[31] >> 7 && P(E[0], a, E[0]), W(E[3], E[0], E[1]), 0))) return -1;
                    for (y = 0; y < r; y++) e[y] = t[y];
                    for (y = 0; y < 32; y++) e[y + 32] = i[y];
                    if (Y(w, e, r), eo(w), ee(v, E, w), et(E, t.subarray(32)), J(v, E), Q(m, v), r -= 64, b(t, 0, m, 0)) {
                        for (y = 0; y < r; y++) e[y] = 0;
                        return -1
                    }
                    for (y = 0; y < r; y++) e[y] = t[y + 64];
                    return r
                }

                function ec(e, t) {
                    if (32 !== e.length) throw Error("bad key size");
                    if (24 !== t.length) throw Error("bad nonce size")
                }

                function el() {
                    for (var e = 0; e < arguments.length; e++)
                        if (!(arguments[e] instanceof Uint8Array)) throw TypeError("unexpected type, use Uint8Array")
                }

                function eu(e) {
                    for (var t = 0; t < e.length; t++) e[t] = 0
                }
                e.lowlevel = {
                    crypto_core_hsalsa20: v,
                    crypto_stream_xor: T,
                    crypto_stream: S,
                    crypto_stream_salsa20_xor: x,
                    crypto_stream_salsa20: A,
                    crypto_onetimeauth: I,
                    crypto_onetimeauth_verify: C,
                    crypto_verify_16: m,
                    crypto_verify_32: b,
                    crypto_secretbox: B,
                    crypto_secretbox_open: O,
                    crypto_scalarmult: V,
                    crypto_scalarmult_base: F,
                    crypto_box_beforenm: G,
                    crypto_box_afternm: B,
                    crypto_box: function(e, t, r, n, i, o) {
                        var s = new Uint8Array(32);
                        return G(s, i, o), B(e, t, r, n, s)
                    },
                    crypto_box_open: function(e, t, r, n, i, o) {
                        var s = new Uint8Array(32);
                        return G(s, i, o), O(e, t, r, n, s)
                    },
                    crypto_box_keypair: $,
                    crypto_hash: Y,
                    crypto_sign: es,
                    crypto_sign_keypair: er,
                    crypto_sign_open: ea,
                    crypto_secretbox_KEYBYTES: 32,
                    crypto_secretbox_NONCEBYTES: 24,
                    crypto_secretbox_ZEROBYTES: 32,
                    crypto_secretbox_BOXZEROBYTES: 16,
                    crypto_scalarmult_BYTES: 32,
                    crypto_scalarmult_SCALARBYTES: 32,
                    crypto_box_PUBLICKEYBYTES: 32,
                    crypto_box_SECRETKEYBYTES: 32,
                    crypto_box_BEFORENMBYTES: 32,
                    crypto_box_NONCEBYTES: 24,
                    crypto_box_ZEROBYTES: 32,
                    crypto_box_BOXZEROBYTES: 16,
                    crypto_sign_BYTES: 64,
                    crypto_sign_PUBLICKEYBYTES: 32,
                    crypto_sign_SECRETKEYBYTES: 64,
                    crypto_sign_SEEDBYTES: 32,
                    crypto_hash_BYTES: 64,
                    gf: n,
                    D: u,
                    L: en,
                    pack25519: U,
                    unpack25519: R,
                    M: W,
                    A: D,
                    S: z,
                    Z: P,
                    pow2523: H,
                    add: J,
                    set25519: j,
                    modL: ei,
                    scalarmult: ee,
                    scalarbase: et
                }, e.randomBytes = function(e) {
                    var t = new Uint8Array(e);
                    return i(t, e), t
                }, e.secretbox = function(e, t, r) {
                    el(e, t, r), ec(r, t);
                    for (var n = new Uint8Array(32 + e.length), i = new Uint8Array(n.length), o = 0; o < e.length; o++) n[o + 32] = e[o];
                    return B(i, n, n.length, t, r), i.subarray(16)
                }, e.secretbox.open = function(e, t, r) {
                    el(e, t, r), ec(r, t);
                    for (var n = new Uint8Array(16 + e.length), i = new Uint8Array(n.length), o = 0; o < e.length; o++) n[o + 16] = e[o];
                    return n.length < 32 || 0 !== O(i, n, n.length, t, r) ? null : i.subarray(32)
                }, e.secretbox.keyLength = 32, e.secretbox.nonceLength = 24, e.secretbox.overheadLength = 16, e.scalarMult = function(e, t) {
                    if (el(e, t), 32 !== e.length) throw Error("bad n size");
                    if (32 !== t.length) throw Error("bad p size");
                    var r = new Uint8Array(32);
                    return V(r, e, t), r
                }, e.scalarMult.base = function(e) {
                    if (el(e), 32 !== e.length) throw Error("bad n size");
                    var t = new Uint8Array(32);
                    return F(t, e), t
                }, e.scalarMult.scalarLength = 32, e.scalarMult.groupElementLength = 32, e.box = function(t, r, n, i) {
                    var o = e.box.before(n, i);
                    return e.secretbox(t, r, o)
                }, e.box.before = function(e, t) {
                    el(e, t),
                        function(e, t) {
                            if (32 !== e.length) throw Error("bad public key size");
                            if (32 !== t.length) throw Error("bad secret key size")
                        }(e, t);
                    var r = new Uint8Array(32);
                    return G(r, e, t), r
                }, e.box.after = e.secretbox, e.box.open = function(t, r, n, i) {
                    var o = e.box.before(n, i);
                    return e.secretbox.open(t, r, o)
                }, e.box.open.after = e.secretbox.open, e.box.keyPair = function() {
                    var e = new Uint8Array(32),
                        t = new Uint8Array(32);
                    return $(e, t), {
                        publicKey: e,
                        secretKey: t
                    }
                }, e.box.keyPair.fromSecretKey = function(e) {
                    if (el(e), 32 !== e.length) throw Error("bad secret key size");
                    var t = new Uint8Array(32);
                    return F(t, e), {
                        publicKey: t,
                        secretKey: new Uint8Array(e)
                    }
                }, e.box.publicKeyLength = 32, e.box.secretKeyLength = 32, e.box.sharedKeyLength = 32, e.box.nonceLength = 24, e.box.overheadLength = e.secretbox.overheadLength, e.sign = function(e, t) {
                    if (el(e, t), 64 !== t.length) throw Error("bad secret key size");
                    var r = new Uint8Array(64 + e.length);
                    return es(r, e, e.length, t), r
                }, e.sign.open = function(e, t) {
                    if (el(e, t), 32 !== t.length) throw Error("bad public key size");
                    var r = new Uint8Array(e.length),
                        n = ea(r, e, e.length, t);
                    if (n < 0) return null;
                    for (var i = new Uint8Array(n), o = 0; o < i.length; o++) i[o] = r[o];
                    return i
                }, e.sign.detached = function(t, r) {
                    for (var n = e.sign(t, r), i = new Uint8Array(64), o = 0; o < i.length; o++) i[o] = n[o];
                    return i
                }, e.sign.detached.verify = function(e, t, r) {
                    if (el(e, t, r), 64 !== t.length) throw Error("bad signature size");
                    if (32 !== r.length) throw Error("bad public key size");
                    var n, i = new Uint8Array(64 + e.length),
                        o = new Uint8Array(64 + e.length);
                    for (n = 0; n < 64; n++) i[n] = t[n];
                    for (n = 0; n < e.length; n++) i[n + 64] = e[n];
                    return ea(o, i, i.length, r) >= 0
                }, e.sign.keyPair = function() {
                    var e = new Uint8Array(32),
                        t = new Uint8Array(64);
                    return er(e, t), {
                        publicKey: e,
                        secretKey: t
                    }
                }, e.sign.keyPair.fromSecretKey = function(e) {
                    if (el(e), 64 !== e.length) throw Error("bad secret key size");
                    for (var t = new Uint8Array(32), r = 0; r < t.length; r++) t[r] = e[32 + r];
                    return {
                        publicKey: t,
                        secretKey: new Uint8Array(e)
                    }
                }, e.sign.keyPair.fromSeed = function(e) {
                    if (el(e), 32 !== e.length) throw Error("bad seed size");
                    for (var t = new Uint8Array(32), r = new Uint8Array(64), n = 0; n < 32; n++) r[n] = e[n];
                    return er(t, r, !0), {
                        publicKey: t,
                        secretKey: r
                    }
                }, e.sign.publicKeyLength = 32, e.sign.secretKeyLength = 64, e.sign.seedLength = 32, e.sign.signatureLength = 64, e.hash = function(e) {
                    el(e);
                    var t = new Uint8Array(64);
                    return Y(t, e, e.length), t
                }, e.hash.hashLength = 64, e.verify = function(e, t) {
                    return el(e, t), 0 !== e.length && 0 !== t.length && e.length === t.length && 0 === y(e, 0, t, 0, e.length)
                }, e.setPRNG = function(e) {
                    i = e
                }, (t = "undefined" != typeof self ? self.crypto || self.msCrypto : null) && t.getRandomValues ? e.setPRNG(function(e, r) {
                    var n, i = new Uint8Array(r);
                    for (n = 0; n < r; n += 65536) t.getRandomValues(i.subarray(n, n + Math.min(r - n, 65536)));
                    for (n = 0; n < r; n++) e[n] = i[n];
                    eu(i)
                }) : (t = r(5024)) && t.randomBytes && e.setPRNG(function(e, r) {
                    var n, i = t.randomBytes(r);
                    for (n = 0; n < r; n++) e[n] = i[n];
                    eu(i)
                })
            }(e.exports ? e.exports : self.nacl = self.nacl || {})
        },
        4880: function(e, t, r) {
            "use strict";
            r.d(t, {
                v4: function() {
                    return u
                }
            });
            var n, i = new Uint8Array(16);

            function o() {
                if (!n && !(n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
                return n(i)
            }
            for (var s = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i, a = [], c = 0; c < 256; ++c) a.push((c + 256).toString(16).substr(1));
            var l = function(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
                        r = (a[e[t + 0]] + a[e[t + 1]] + a[e[t + 2]] + a[e[t + 3]] + "-" + a[e[t + 4]] + a[e[t + 5]] + "-" + a[e[t + 6]] + a[e[t + 7]] + "-" + a[e[t + 8]] + a[e[t + 9]] + "-" + a[e[t + 10]] + a[e[t + 11]] + a[e[t + 12]] + a[e[t + 13]] + a[e[t + 14]] + a[e[t + 15]]).toLowerCase();
                    if (!("string" == typeof r && s.test(r))) throw TypeError("Stringified UUID is invalid");
                    return r
                },
                u = function(e, t, r) {
                    var n = (e = e || {}).random || (e.rng || o)();
                    if (n[6] = 15 & n[6] | 64, n[8] = 63 & n[8] | 128, t) {
                        r = r || 0;
                        for (var i = 0; i < 16; ++i) t[r + i] = n[i];
                        return t
                    }
                    return l(n)
                }
        },
        5024: function() {},
        7697: function(e) {
            e.exports = function(e) {
                if (void 0 === e) throw ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        429: function(e) {
            function t(e, t, r, n, i, o, s) {
                try {
                    var a = e[o](s),
                        c = a.value
                } catch (e) {
                    r(e);
                    return
                }
                a.done ? t(c) : Promise.resolve(c).then(n, i)
            }
            e.exports = function(e) {
                return function() {
                    var r = this,
                        n = arguments;
                    return new Promise(function(i, o) {
                        var s = e.apply(r, n);

                        function a(e) {
                            t(s, i, o, a, c, "next", e)
                        }

                        function c(e) {
                            t(s, i, o, a, c, "throw", e)
                        }
                        a(void 0)
                    })
                }
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        7432: function(e) {
            e.exports = function(e, t) {
                if (!(e instanceof t)) throw TypeError("Cannot call a class as a function")
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        6114: function(e, t, r) {
            var n = r(6527);

            function i(e, t) {
                for (var r = 0; r < t.length; r++) {
                    var i = t[r];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, n(i.key), i)
                }
            }
            e.exports = function(e, t, r) {
                return t && i(e.prototype, t), r && i(e, r), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), e
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        3441: function(e) {
            function t(r) {
                return e.exports = t = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e) {
                    return e.__proto__ || Object.getPrototypeOf(e)
                }, e.exports.__esModule = !0, e.exports.default = e.exports, t(r)
            }
            e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        4182: function(e, t, r) {
            var n = r(395);
            e.exports = function(e, t) {
                if ("function" != typeof t && null !== t) throw TypeError("Super expression must either be null or a function");
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        writable: !0,
                        configurable: !0
                    }
                }), Object.defineProperty(e, "prototype", {
                    writable: !1
                }), t && n(e, t)
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        208: function(e) {
            e.exports = function(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        3497: function(e, t, r) {
            var n = r(2449).default,
                i = r(7697);
            e.exports = function(e, t) {
                if (t && ("object" === n(t) || "function" == typeof t)) return t;
                if (void 0 !== t) throw TypeError("Derived constructors may only return object or undefined");
                return i(e)
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        9470: function(e, t, r) {
            var n = r(2449).default;

            function i() {
                "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
                e.exports = i = function() {
                    return t
                }, e.exports.__esModule = !0, e.exports.default = e.exports;
                var t = {},
                    r = Object.prototype,
                    o = r.hasOwnProperty,
                    s = Object.defineProperty || function(e, t, r) {
                        e[t] = r.value
                    },
                    a = "function" == typeof Symbol ? Symbol : {},
                    c = a.iterator || "@@iterator",
                    l = a.asyncIterator || "@@asyncIterator",
                    u = a.toStringTag || "@@toStringTag";

                function f(e, t, r) {
                    return Object.defineProperty(e, t, {
                        value: r,
                        enumerable: !0,
                        configurable: !0,
                        writable: !0
                    }), e[t]
                }
                try {
                    f({}, "")
                } catch (e) {
                    f = function(e, t, r) {
                        return e[t] = r
                    }
                }

                function h(e, t, r, n) {
                    var i, o, a = Object.create((t && t.prototype instanceof g ? t : g).prototype);
                    return s(a, "_invoke", {
                        value: (i = new k(n || []), o = "suspendedStart", function(t, n) {
                            if ("executing" === o) throw Error("Generator is already running");
                            if ("completed" === o) {
                                if ("throw" === t) throw n;
                                return C()
                            }
                            for (i.method = t, i.arg = n;;) {
                                var s = i.delegate;
                                if (s) {
                                    var a = function e(t, r) {
                                        var n = r.method,
                                            i = t.iterator[n];
                                        if (void 0 === i) return r.delegate = null, "throw" === n && t.iterator.return && (r.method = "return", r.arg = void 0, e(t, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = TypeError("The iterator does not provide a '" + n + "' method")), p;
                                        var o = d(i, t.iterator, r.arg);
                                        if ("throw" === o.type) return r.method = "throw", r.arg = o.arg, r.delegate = null, p;
                                        var s = o.arg;
                                        return s ? s.done ? (r[t.resultName] = s.value, r.next = t.nextLoc, "return" !== r.method && (r.method = "next", r.arg = void 0), r.delegate = null, p) : s : (r.method = "throw", r.arg = TypeError("iterator result is not an object"), r.delegate = null, p)
                                    }(s, i);
                                    if (a) {
                                        if (a === p) continue;
                                        return a
                                    }
                                }
                                if ("next" === i.method) i.sent = i._sent = i.arg;
                                else if ("throw" === i.method) {
                                    if ("suspendedStart" === o) throw o = "completed", i.arg;
                                    i.dispatchException(i.arg)
                                } else "return" === i.method && i.abrupt("return", i.arg);
                                o = "executing";
                                var c = d(e, r, i);
                                if ("normal" === c.type) {
                                    if (o = i.done ? "completed" : "suspendedYield", c.arg === p) continue;
                                    return {
                                        value: c.arg,
                                        done: i.done
                                    }
                                }
                                "throw" === c.type && (o = "completed", i.method = "throw", i.arg = c.arg)
                            }
                        })
                    }), a
                }

                function d(e, t, r) {
                    try {
                        return {
                            type: "normal",
                            arg: e.call(t, r)
                        }
                    } catch (e) {
                        return {
                            type: "throw",
                            arg: e
                        }
                    }
                }
                t.wrap = h;
                var p = {};

                function g() {}

                function y() {}

                function m() {}
                var b = {};
                f(b, c, function() {
                    return this
                });
                var w = Object.getPrototypeOf,
                    v = w && w(w(I([])));
                v && v !== r && o.call(v, c) && (b = v);
                var E = m.prototype = g.prototype = Object.create(b);

                function x(e) {
                    ["next", "throw", "return"].forEach(function(t) {
                        f(e, t, function(e) {
                            return this._invoke(t, e)
                        })
                    })
                }

                function A(e, t) {
                    var r;
                    s(this, "_invoke", {
                        value: function(i, s) {
                            function a() {
                                return new t(function(r, a) {
                                    ! function r(i, s, a, c) {
                                        var l = d(e[i], e, s);
                                        if ("throw" !== l.type) {
                                            var u = l.arg,
                                                f = u.value;
                                            return f && "object" == n(f) && o.call(f, "__await") ? t.resolve(f.__await).then(function(e) {
                                                r("next", e, a, c)
                                            }, function(e) {
                                                r("throw", e, a, c)
                                            }) : t.resolve(f).then(function(e) {
                                                u.value = e, a(u)
                                            }, function(e) {
                                                return r("throw", e, a, c)
                                            })
                                        }
                                        c(l.arg)
                                    }(i, s, r, a)
                                })
                            }
                            return r = r ? r.then(a, a) : a()
                        }
                    })
                }

                function S(e) {
                    var t = {
                        tryLoc: e[0]
                    };
                    1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
                }

                function T(e) {
                    var t = e.completion || {};
                    t.type = "normal", delete t.arg, e.completion = t
                }

                function k(e) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }], e.forEach(S, this), this.reset(!0)
                }

                function I(e) {
                    if (e) {
                        var t = e[c];
                        if (t) return t.call(e);
                        if ("function" == typeof e.next) return e;
                        if (!isNaN(e.length)) {
                            var r = -1,
                                n = function t() {
                                    for (; ++r < e.length;)
                                        if (o.call(e, r)) return t.value = e[r], t.done = !1, t;
                                    return t.value = void 0, t.done = !0, t
                                };
                            return n.next = n
                        }
                    }
                    return {
                        next: C
                    }
                }

                function C() {
                    return {
                        value: void 0,
                        done: !0
                    }
                }
                return y.prototype = m, s(E, "constructor", {
                    value: m,
                    configurable: !0
                }), s(m, "constructor", {
                    value: y,
                    configurable: !0
                }), y.displayName = f(m, u, "GeneratorFunction"), t.isGeneratorFunction = function(e) {
                    var t = "function" == typeof e && e.constructor;
                    return !!t && (t === y || "GeneratorFunction" === (t.displayName || t.name))
                }, t.mark = function(e) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(e, m) : (e.__proto__ = m, f(e, u, "GeneratorFunction")), e.prototype = Object.create(E), e
                }, t.awrap = function(e) {
                    return {
                        __await: e
                    }
                }, x(A.prototype), f(A.prototype, l, function() {
                    return this
                }), t.AsyncIterator = A, t.async = function(e, r, n, i, o) {
                    void 0 === o && (o = Promise);
                    var s = new A(h(e, r, n, i), o);
                    return t.isGeneratorFunction(r) ? s : s.next().then(function(e) {
                        return e.done ? e.value : s.next()
                    })
                }, x(E), f(E, u, "Generator"), f(E, c, function() {
                    return this
                }), f(E, "toString", function() {
                    return "[object Generator]"
                }), t.keys = function(e) {
                    var t = Object(e),
                        r = [];
                    for (var n in t) r.push(n);
                    return r.reverse(),
                        function e() {
                            for (; r.length;) {
                                var n = r.pop();
                                if (n in t) return e.value = n, e.done = !1, e
                            }
                            return e.done = !0, e
                        }
                }, t.values = I, k.prototype = {
                    constructor: k,
                    reset: function(e) {
                        if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(T), !e)
                            for (var t in this) "t" === t.charAt(0) && o.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = void 0)
                    },
                    stop: function() {
                        this.done = !0;
                        var e = this.tryEntries[0].completion;
                        if ("throw" === e.type) throw e.arg;
                        return this.rval
                    },
                    dispatchException: function(e) {
                        if (this.done) throw e;
                        var t = this;

                        function r(r, n) {
                            return s.type = "throw", s.arg = e, t.next = r, n && (t.method = "next", t.arg = void 0), !!n
                        }
                        for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                            var i = this.tryEntries[n],
                                s = i.completion;
                            if ("root" === i.tryLoc) return r("end");
                            if (i.tryLoc <= this.prev) {
                                var a = o.call(i, "catchLoc"),
                                    c = o.call(i, "finallyLoc");
                                if (a && c) {
                                    if (this.prev < i.catchLoc) return r(i.catchLoc, !0);
                                    if (this.prev < i.finallyLoc) return r(i.finallyLoc)
                                } else if (a) {
                                    if (this.prev < i.catchLoc) return r(i.catchLoc, !0)
                                } else {
                                    if (!c) throw Error("try statement without catch or finally");
                                    if (this.prev < i.finallyLoc) return r(i.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(e, t) {
                        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                            var n = this.tryEntries[r];
                            if (n.tryLoc <= this.prev && o.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
                                var i = n;
                                break
                            }
                        }
                        i && ("break" === e || "continue" === e) && i.tryLoc <= t && t <= i.finallyLoc && (i = null);
                        var s = i ? i.completion : {};
                        return s.type = e, s.arg = t, i ? (this.method = "next", this.next = i.finallyLoc, p) : this.complete(s)
                    },
                    complete: function(e, t) {
                        if ("throw" === e.type) throw e.arg;
                        return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), p
                    },
                    finish: function(e) {
                        for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                            var r = this.tryEntries[t];
                            if (r.finallyLoc === e) return this.complete(r.completion, r.afterLoc), T(r), p
                        }
                    },
                    catch: function(e) {
                        for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                            var r = this.tryEntries[t];
                            if (r.tryLoc === e) {
                                var n = r.completion;
                                if ("throw" === n.type) {
                                    var i = n.arg;
                                    T(r)
                                }
                                return i
                            }
                        }
                        throw Error("illegal catch attempt")
                    },
                    delegateYield: function(e, t, r) {
                        return this.delegate = {
                            iterator: I(e),
                            resultName: t,
                            nextLoc: r
                        }, "next" === this.method && (this.arg = void 0), p
                    }
                }, t
            }
            e.exports = i, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        395: function(e) {
            function t(r, n) {
                return e.exports = t = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e, t) {
                    return e.__proto__ = t, e
                }, e.exports.__esModule = !0, e.exports.default = e.exports, t(r, n)
            }
            e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        4111: function(e, t, r) {
            var n = r(2449).default;
            e.exports = function(e, t) {
                if ("object" !== n(e) || null === e) return e;
                var r = e[Symbol.toPrimitive];
                if (void 0 !== r) {
                    var i = r.call(e, t || "default");
                    if ("object" !== n(i)) return i;
                    throw TypeError("@@toPrimitive must return a primitive value.")
                }
                return ("string" === t ? String : Number)(e)
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        6527: function(e, t, r) {
            var n = r(2449).default,
                i = r(4111);
            e.exports = function(e) {
                var t = i(e, "string");
                return "symbol" === n(t) ? t : String(t)
            }, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        2449: function(e) {
            function t(r) {
                return e.exports = t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }, e.exports.__esModule = !0, e.exports.default = e.exports, t(r)
            }
            e.exports = t, e.exports.__esModule = !0, e.exports.default = e.exports
        },
        4638: function(e, t, r) {
            var n = r(9470)();
            e.exports = n;
            try {
                regeneratorRuntime = n
            } catch (e) {
                "object" == typeof globalThis ? globalThis.regeneratorRuntime = n : Function("r", "regeneratorRuntime = r")(n)
            }
        },
        1213: function(e, t, r) {
            "use strict";
            r.d(t, {
                ewe: function() {
                    return i6
                },
                rEx: function() {
                    return iZ
                },
                r6k: function() {
                    return oQ
                },
                AH4: function() {
                    return o6
                },
                uq1: function() {
                    return nW
                },
                _lL: function() {
                    return r9
                },
                a6g: function() {
                    return oY
                },
                dC3: function() {
                    return nt
                },
                is: function() {
                    return eI
                },
                eGW: function() {
                    return i4
                }
            });
            var n, i, o, s, a, c, l, u, f, h, d, p, g, y, m, b, w, v = {};
            r.r(v), r.d(v, {
                bitGet: function() {
                    return te
                },
                bitLen: function() {
                    return e7
                },
                bitMask: function() {
                    return tr
                },
                bitSet: function() {
                    return tt
                },
                bytesToHex: function() {
                    return eY
                },
                bytesToNumberBE: function() {
                    return e0
                },
                bytesToNumberLE: function() {
                    return e1
                },
                concatBytes: function() {
                    return e4
                },
                createHmacDrbg: function() {
                    return to
                },
                ensureBytes: function() {
                    return e6
                },
                equalBytes: function() {
                    return e8
                },
                hexToBytes: function() {
                    return eQ
                },
                hexToNumber: function() {
                    return eX
                },
                numberToBytesBE: function() {
                    return e2
                },
                numberToBytesLE: function() {
                    return e5
                },
                numberToHexUnpadded: function() {
                    return eJ
                },
                numberToVarBytesBE: function() {
                    return e3
                },
                utf8ToBytes: function() {
                    return e9
                },
                validateObject: function() {
                    return ta
                }
            });
            var E = r(780),
                x = r(7191);

            function A(e, t) {
                for (var r, n, i, o = e.replace(/[^A-Za-z0-9+/]/g, ""), s = o.length, a = t ? Math.ceil((3 * s + 1 >> 2) / t) * t : 3 * s + 1 >> 2, c = new Uint8Array(a), l = 0, u = 0, f = 0; f < s; f++)
                    if (i = 3 & f, l |= ((r = o.charCodeAt(f)) > 64 && r < 91 ? r - 65 : r > 96 && r < 123 ? r - 71 : r > 47 && r < 58 ? r + 4 : 43 === r ? 62 : 47 === r ? 63 : 0) << 6 * (3 - i), 3 === i || s - f == 1) {
                        for (n = 0; n < 3 && u < a; n++, u++) c[u] = l >>> (16 >>> n & 24) & 255;
                        l = 0
                    } return c
            }

            function S(e) {
                return e < 26 ? e + 65 : e < 52 ? e + 71 : e < 62 ? e - 4 : 62 === e ? 43 : 63 === e ? 47 : 65
            }

            function T(e) {
                for (var t = 2, r = "", n = e.length, i = 0, o = 0; o < n; o++) t = o % 3, o > 0 && 4 * o / 3 % 76 == 0 && (r += ""), i |= e[o] << (16 >>> t & 24), (2 === t || e.length - o == 1) && (r += String.fromCodePoint(S(i >>> 18 & 63), S(i >>> 12 & 63), S(i >>> 6 & 63), S(63 & i)), i = 0);
                return r.slice(0, r.length - 2 + t) + (2 === t ? "" : 1 === t ? "=" : "==")
            }

            function k(e) {
                let t = e.replace("0x", "").match(/.{1,2}/g).map(e => parseInt(e, 16));
                if (null === t) throw Error(`Unable to parse HEX: ${e}`);
                return Uint8Array.from(t)
            }

            function I(e) {
                return e.reduce((e, t) => e + t.toString(16).padStart(2, "0"), "")
            }

            function C(e, t) {
                let r = new Uint8Array(t),
                    n = 0;
                for (; e > 0;) r[n] = Number(e % BigInt(256)), e /= BigInt(256), n += 1;
                return r
            }
            var B = e => x.encode(e),
                O = e => x.decode(e),
                j = class {
                    constructor(e) {
                        this.bytePosition = 0, this.dataView = new DataView(e.buffer)
                    }
                    shift(e) {
                        return this.bytePosition += e, this
                    }
                    read8() {
                        let e = this.dataView.getUint8(this.bytePosition);
                        return this.shift(1), e
                    }
                    read16() {
                        let e = this.dataView.getUint16(this.bytePosition, !0);
                        return this.shift(2), e
                    }
                    read32() {
                        let e = this.dataView.getUint32(this.bytePosition, !0);
                        return this.shift(4), e
                    }
                    read64() {
                        let e = this.read32();
                        return BigInt("0x" + (this.read32().toString(16) + e.toString(16).padStart(8, "0"))).toString(10)
                    }
                    read128() {
                        let e = BigInt(this.read64()),
                            t = BigInt(this.read64()).toString(16) + e.toString(16).padStart(8, "0");
                        return BigInt("0x" + t).toString(10)
                    }
                    read256() {
                        let e = BigInt(this.read128()),
                            t = BigInt(this.read128()).toString(16) + e.toString(16).padStart(16, "0");
                        return BigInt("0x" + t).toString(10)
                    }
                    readBytes(e) {
                        let t = this.bytePosition + this.dataView.byteOffset,
                            r = new Uint8Array(this.dataView.buffer, t, e);
                        return this.shift(e), r
                    }
                    readULEB() {
                        let e = this.bytePosition + this.dataView.byteOffset,
                            {
                                value: t,
                                length: r
                            } = function(e) {
                                let t = 0,
                                    r = 0,
                                    n = 0;
                                for (;;) {
                                    let i = e[n];
                                    if (n += 1, t |= (127 & i) << r, (128 & i) == 0) break;
                                    r += 7
                                }
                                return {
                                    value: t,
                                    length: n
                                }
                            }(new Uint8Array(this.dataView.buffer, e));
                        return this.shift(r), t
                    }
                    readVec(e) {
                        let t = this.readULEB(),
                            r = [];
                        for (let n = 0; n < t; n++) r.push(e(this, n, t));
                        return r
                    }
                },
                M = class {
                    constructor({
                        size: e = 1024,
                        maxSize: t,
                        allocateSize: r = 1024
                    } = {}) {
                        this.bytePosition = 0, this.size = e, this.maxSize = t || e, this.allocateSize = r, this.dataView = new DataView(new ArrayBuffer(e))
                    }
                    ensureSizeOrGrow(e) {
                        let t = this.bytePosition + e;
                        if (t > this.size) {
                            let e = Math.min(this.maxSize, this.size + this.allocateSize);
                            if (t > e) throw Error(`Attempting to serialize to BCS, but buffer does not have enough size. Allocated size: ${this.size}, Max size: ${this.maxSize}, Required size: ${t}`);
                            this.size = e;
                            let r = new ArrayBuffer(this.size);
                            new Uint8Array(r).set(new Uint8Array(this.dataView.buffer)), this.dataView = new DataView(r)
                        }
                    }
                    shift(e) {
                        return this.bytePosition += e, this
                    }
                    write8(e) {
                        return this.ensureSizeOrGrow(1), this.dataView.setUint8(this.bytePosition, Number(e)), this.shift(1)
                    }
                    write16(e) {
                        return this.ensureSizeOrGrow(2), this.dataView.setUint16(this.bytePosition, Number(e), !0), this.shift(2)
                    }
                    write32(e) {
                        return this.ensureSizeOrGrow(4), this.dataView.setUint32(this.bytePosition, Number(e), !0), this.shift(4)
                    }
                    write64(e) {
                        return C(BigInt(e), 8).forEach(e => this.write8(e)), this
                    }
                    write128(e) {
                        return C(BigInt(e), 16).forEach(e => this.write8(e)), this
                    }
                    write256(e) {
                        return C(BigInt(e), 32).forEach(e => this.write8(e)), this
                    }
                    writeULEB(e) {
                        return (function(e) {
                            let t = [],
                                r = 0;
                            if (0 === e) return [0];
                            for (; e > 0;) t[r] = 127 & e, (e >>= 7) && (t[r] |= 128), r += 1;
                            return t
                        })(e).forEach(e => this.write8(e)), this
                    }
                    writeVec(e, t) {
                        return this.writeULEB(e.length), Array.from(e).forEach((r, n) => t(this, r, n, e.length)), this
                    }*[Symbol.iterator]() {
                        for (let e = 0; e < this.bytePosition; e++) yield this.dataView.getUint8(e);
                        return this.toBytes()
                    }
                    toBytes() {
                        return new Uint8Array(this.dataView.buffer.slice(0, this.bytePosition))
                    }
                    toString(e) {
                        return function(e, t) {
                            switch (t) {
                                case "base58":
                                    return B(e);
                                case "base64":
                                    return T(e);
                                case "hex":
                                    return I(e);
                                default:
                                    throw Error("Unsupported encoding, supported values are: base64, hex")
                            }
                        }(this.toBytes(), e)
                    }
                },
                _ = class {
                    constructor(e) {
                        if (this.types = new Map, this.counter = 0, e instanceof _) {
                            this.schema = e.schema, this.types = new Map(e.types);
                            return
                        }
                        if (this.schema = e, this.registerAddressType(_.ADDRESS, e.addressLength, e.addressEncoding), this.registerVectorType(e.vectorType), e.types && e.types.structs)
                            for (let t of Object.keys(e.types.structs)) this.registerStructType(t, e.types.structs[t]);
                        if (e.types && e.types.enums)
                            for (let t of Object.keys(e.types.enums)) this.registerEnumType(t, e.types.enums[t]);
                        if (e.types && e.types.aliases)
                            for (let t of Object.keys(e.types.aliases)) this.registerAlias(t, e.types.aliases[t]);
                        !1 !== e.withPrimitives && (this.registerType(U.U8, function(e, t) {
                            return e.write8(t)
                        }, function(e) {
                            return e.read8()
                        }, e => e < 256), this.registerType(U.U16, function(e, t) {
                            return e.write16(t)
                        }, function(e) {
                            return e.read16()
                        }, e => e < 65536), this.registerType(U.U32, function(e, t) {
                            return e.write32(t)
                        }, function(e) {
                            return e.read32()
                        }, e => e <= 4294967296n), this.registerType(U.U64, function(e, t) {
                            return e.write64(t)
                        }, function(e) {
                            return e.read64()
                        }), this.registerType(U.U128, function(e, t) {
                            return e.write128(t)
                        }, function(e) {
                            return e.read128()
                        }), this.registerType(U.U256, function(e, t) {
                            return e.write256(t)
                        }, function(e) {
                            return e.read256()
                        }), this.registerType(U.BOOL, function(e, t) {
                            return e.write8(t)
                        }, function(e) {
                            return "1" === e.read8().toString(10)
                        }), this.registerType(U.STRING, function(e, t) {
                            return e.writeVec(Array.from(t), (e, t) => e.write8(t.charCodeAt(0)))
                        }, function(e) {
                            return e.readVec(e => e.read8()).map(e => String.fromCharCode(Number(e))).join("")
                        }, e => !0), this.registerType(U.HEX, function(e, t) {
                            return e.writeVec(Array.from(k(t)), (e, t) => e.write8(t))
                        }, function(e) {
                            let t = e.readVec(e => e.read8());
                            return I(new Uint8Array(t))
                        }), this.registerType(U.BASE58, function(e, t) {
                            return e.writeVec(Array.from(O(t)), (e, t) => e.write8(t))
                        }, function(e) {
                            let t = e.readVec(e => e.read8());
                            return B(new Uint8Array(t))
                        }), this.registerType(U.BASE64, function(e, t) {
                            return e.writeVec(Array.from(A(t)), (e, t) => e.write8(t))
                        }, function(e) {
                            let t = e.readVec(e => e.read8());
                            return T(new Uint8Array(t))
                        }))
                    }
                    tempKey() {
                        return `bcs-struct-${++this.counter}`
                    }
                    ser(e, t, r) {
                        if ("string" == typeof e || Array.isArray(e)) {
                            let {
                                name: n,
                                params: i
                            } = this.parseTypeName(e);
                            return this.getTypeInterface(n).encode(this, t, r, i)
                        }
                        if ("object" == typeof e) {
                            let n = this.tempKey(),
                                i = new _(this);
                            return i.registerStructType(n, e).ser(n, t, r)
                        }
                        throw Error(`Incorrect type passed into the '.ser()' function. 
${JSON.stringify(e)}`)
                    }
                    de(e, t, r) {
                        if ("string" == typeof t) {
                            if (r) t = function(e, t) {
                                switch (t) {
                                    case "base58":
                                        return O(e);
                                    case "base64":
                                        return A(e);
                                    case "hex":
                                        return k(e);
                                    default:
                                        throw Error("Unsupported encoding, supported values are: base64, hex")
                                }
                            }(t, r);
                            else throw Error("To pass a string to `bcs.de`, specify encoding")
                        }
                        if ("string" == typeof e || Array.isArray(e)) {
                            let {
                                name: r,
                                params: n
                            } = this.parseTypeName(e);
                            return this.getTypeInterface(r).decode(this, t, n)
                        }
                        if ("object" == typeof e) {
                            let n = new _(this),
                                i = this.tempKey();
                            return n.registerStructType(i, e).de(i, t, r)
                        }
                        throw Error(`Incorrect type passed into the '.de()' function. 
${JSON.stringify(e)}`)
                    }
                    hasType(e) {
                        return this.types.has(e)
                    }
                    registerAlias(e, t) {
                        return this.types.set(e, t), this
                    }
                    registerType(e, t, r, n = () => !0) {
                        let {
                            name: i,
                            params: o
                        } = this.parseTypeName(e);
                        return this.types.set(i, {
                            encode(e, t, r, n) {
                                let i = o.reduce((e, t, r) => Object.assign(e, {
                                    [t]: n[r]
                                }), {});
                                return this._encodeRaw.call(e, new M(r), t, n, i)
                            },
                            decode(e, t, r) {
                                let n = o.reduce((e, t, n) => Object.assign(e, {
                                    [t]: r[n]
                                }), {});
                                return this._decodeRaw.call(e, new j(t), r, n)
                            },
                            _encodeRaw(e, r, o, s) {
                                if (n(r)) return t.call(this, e, r, o, s);
                                throw Error(`Validation failed for type ${i}, data: ${r}`)
                            },
                            _decodeRaw(e, t, n) {
                                return r.call(this, e, t, n)
                            }
                        }), this
                    }
                    registerAddressType(e, t, r = "hex") {
                        switch (r) {
                            case "base64":
                                return this.registerType(e, function(e, t) {
                                    return A(t).reduce((e, t) => e.write8(t), e)
                                }, function(e) {
                                    return T(e.readBytes(t))
                                });
                            case "hex":
                                return this.registerType(e, function(e, t) {
                                    return k(t).reduce((e, t) => e.write8(t), e)
                                }, function(e) {
                                    return I(e.readBytes(t))
                                });
                            default:
                                throw Error("Unsupported encoding! Use either hex or base64")
                        }
                    }
                    registerVectorType(e) {
                        let {
                            name: t,
                            params: r
                        } = this.parseTypeName(e);
                        if (r.length > 1) throw Error("Vector can have only one type parameter; got " + t);
                        return this.registerType(e, function(t, r, n, i) {
                            return t.writeVec(r, (t, r) => {
                                let o = n[0];
                                if (!o) throw Error(`Incorrect number of type parameters passed a to vector '${e}'`);
                                let {
                                    name: s,
                                    params: a
                                } = this.parseTypeName(o);
                                if (this.hasType(s)) return this.getTypeInterface(s)._encodeRaw.call(this, t, r, a, i);
                                if (!(s in i)) throw Error(`Unable to find a matching type definition for ${s} in vector; make sure you passed a generic`);
                                let {
                                    name: c,
                                    params: l
                                } = this.parseTypeName(i[s]);
                                return this.getTypeInterface(c)._encodeRaw.call(this, t, r, l, i)
                            })
                        }, function(t, r, n) {
                            return t.readVec(t => {
                                let i = r[0];
                                if (!i) throw Error(`Incorrect number of type parameters passed to a vector '${e}'`);
                                let {
                                    name: o,
                                    params: s
                                } = this.parseTypeName(i);
                                if (this.hasType(o)) return this.getTypeInterface(o)._decodeRaw.call(this, t, s, n);
                                if (!(o in n)) throw Error(`Unable to find a matching type definition for ${o} in vector; make sure you passed a generic`);
                                let {
                                    name: a,
                                    params: c
                                } = this.parseTypeName(n[o]);
                                this.getTypeInterface(a)._decodeRaw.call(this, t, c, n)
                            })
                        })
                    }
                    registerStructType(e, t) {
                        for (let e in t) {
                            let r = this.tempKey(),
                                n = t[e];
                            Array.isArray(n) || "string" == typeof n || (t[e] = r, this.registerStructType(r, n))
                        }
                        let r = Object.freeze(t),
                            n = Object.keys(r),
                            {
                                name: i,
                                params: o
                            } = this.parseTypeName(e);
                        return this.registerType(e, function(e, t, s, a) {
                            if (!t || t.constructor !== Object) throw Error(`Expected ${i} to be an Object, got: ${t}`);
                            if (s.length !== o.length) throw Error(`Incorrect number of generic parameters passed; expected: ${o.length}, got: ${s.length}`);
                            for (let c of n) {
                                if (!(c in t)) throw Error(`Struct ${i} requires field ${c}:${r[c]}`);
                                let {
                                    name: n,
                                    params: l
                                } = this.parseTypeName(r[c]);
                                if (o.includes(n)) {
                                    let r = o.indexOf(n),
                                        {
                                            name: l,
                                            params: u
                                        } = this.parseTypeName(s[r]);
                                    if (this.hasType(l)) {
                                        this.getTypeInterface(l)._encodeRaw.call(this, e, t[c], u, a);
                                        continue
                                    }
                                    if (!(l in a)) throw Error(`Unable to find a matching type definition for ${l} in ${i}; make sure you passed a generic`);
                                    let {
                                        name: f,
                                        params: h
                                    } = this.parseTypeName(a[l]);
                                    this.getTypeInterface(f)._encodeRaw.call(this, e, t[c], h, a)
                                } else this.getTypeInterface(n)._encodeRaw.call(this, e, t[c], l, a)
                            }
                            return e
                        }, function(e, t, s) {
                            if (t.length !== o.length) throw Error(`Incorrect number of generic parameters passed; expected: ${o.length}, got: ${t.length}`);
                            let a = {};
                            for (let c of n) {
                                let {
                                    name: n,
                                    params: l
                                } = this.parseTypeName(r[c]);
                                if (o.includes(n)) {
                                    let r = o.indexOf(n),
                                        {
                                            name: l,
                                            params: u
                                        } = this.parseTypeName(t[r]);
                                    if (this.hasType(l)) {
                                        a[c] = this.getTypeInterface(l)._decodeRaw.call(this, e, u, s);
                                        continue
                                    }
                                    if (!(l in s)) throw Error(`Unable to find a matching type definition for ${l} in ${i}; make sure you passed a generic`);
                                    let {
                                        name: f,
                                        params: h
                                    } = this.parseTypeName(s[l]);
                                    a[c] = this.getTypeInterface(f)._decodeRaw.call(this, e, h, s)
                                } else a[c] = this.getTypeInterface(n)._decodeRaw.call(this, e, l, s)
                            }
                            return a
                        })
                    }
                    registerEnumType(e, t) {
                        for (let e in t) {
                            let r = this.tempKey(),
                                n = t[e];
                            null === n || Array.isArray(n) || "string" == typeof n || (t[e] = r, this.registerStructType(r, n))
                        }
                        let r = Object.freeze(t),
                            n = Object.keys(r),
                            {
                                name: i,
                                params: o
                            } = this.parseTypeName(e);
                        return this.registerType(e, function(e, t, s, a) {
                            if (!t) throw Error(`Unable to write enum "${i}", missing data.
Received: "${t}"`);
                            if ("object" != typeof t) throw Error(`Incorrect data passed into enum "${i}", expected object with properties: "${n.join(" | ")}".
Received: "${JSON.stringify(t)}"`);
                            let c = Object.keys(t)[0];
                            if (void 0 === c) throw Error(`Empty object passed as invariant of the enum "${i}"`);
                            let l = n.indexOf(c);
                            if (-1 === l) throw Error(`Unknown invariant of the enum "${i}", allowed values: "${n.join(" | ")}"; received "${c}"`);
                            let u = r[n[l]];
                            if (e.write8(l), null === u) return e;
                            let f = o.indexOf(u),
                                h = -1 === f ? u : s[f];
                            {
                                let {
                                    name: r,
                                    params: n
                                } = this.parseTypeName(h);
                                return this.getTypeInterface(r)._encodeRaw.call(this, e, t[c], n, a)
                            }
                        }, function(e, t, s) {
                            let a = e.readULEB(),
                                c = n[a],
                                l = r[c];
                            if (-1 === a) throw Error(`Decoding type mismatch, expected enum "${i}" invariant index, received "${a}"`);
                            if (null === l) return {
                                [c]: !0
                            };
                            let u = o.indexOf(l),
                                f = -1 === u ? l : t[u];
                            {
                                let {
                                    name: t,
                                    params: r
                                } = this.parseTypeName(f);
                                return {
                                    [c]: this.getTypeInterface(t)._decodeRaw.call(this, e, r, s)
                                }
                            }
                        })
                    }
                    getTypeInterface(e) {
                        let t = this.types.get(e);
                        if ("string" == typeof t) {
                            let e = [];
                            for (;
                                "string" == typeof t;) {
                                if (e.includes(t)) throw Error(`Recursive definition found: ${e.join(" -> ")} -> ${t}`);
                                e.push(t), t = this.types.get(t)
                            }
                        }
                        if (void 0 === t) throw Error(`Type ${e} is not registered`);
                        return t
                    }
                    parseTypeName(e) {
                        if (Array.isArray(e)) {
                            let [t, ...r] = e;
                            return {
                                name: t,
                                params: r
                            }
                        }
                        if ("string" != typeof e) throw Error(`Illegal type passed as a name of the type: ${e}`);
                        let [t, r] = this.schema.genericSeparators || ["<", ">"], n = e.indexOf(t), i = Array.from(e).reverse().indexOf(r);
                        if (-1 === n && -1 === i) return {
                            name: e,
                            params: []
                        };
                        if (-1 === n || -1 === i) throw Error(`Unclosed generic in name '${e}'`);
                        return {
                            name: e.slice(0, n),
                            params: e.slice(n + 1, e.length - i - 1).split(",").map(e => e.trim())
                        }
                    }
                },
                U = _;

            function N(e) {
                if (!Number.isSafeInteger(e) || e < 0) throw Error(`Wrong positive integer: ${e}`)
            }

            function L(e, ...t) {
                if (!(e instanceof Uint8Array)) throw TypeError("Expected Uint8Array");
                if (t.length > 0 && !t.includes(e.length)) throw TypeError(`Expected Uint8Array of length ${t}, not of length=${e.length}`)
            }
            U.U8 = "u8", U.U16 = "u16", U.U32 = "u32", U.U64 = "u64", U.U128 = "u128", U.U256 = "u256", U.BOOL = "bool", U.VECTOR = "vector", U.ADDRESS = "address", U.STRING = "string", U.HEX = "hex-string", U.BASE58 = "base58-string", U.BASE64 = "base64-string";
            var R = {
                number: N,
                bool: function(e) {
                    if ("boolean" != typeof e) throw Error(`Expected boolean, not ${e}`)
                },
                bytes: L,
                hash: function(e) {
                    if ("function" != typeof e || "function" != typeof e.create) throw Error("Hash should be wrapped by utils.wrapConstructor");
                    N(e.outputLen), N(e.blockLen)
                },
                exists: function(e, t = !0) {
                    if (e.destroyed) throw Error("Hash instance has been destroyed");
                    if (t && e.finished) throw Error("Hash#digest() has already been called")
                },
                output: function(e, t) {
                    L(e);
                    let r = t.outputLen;
                    if (e.length < r) throw Error(`digestInto() expects output buffer of length at least ${r}`)
                }
            };
            let D = "object" == typeof globalThis && "crypto" in globalThis ? globalThis.crypto : void 0,
                P = e => new Uint32Array(e.buffer, e.byteOffset, Math.floor(e.byteLength / 4)),
                W = e => new DataView(e.buffer, e.byteOffset, e.byteLength),
                z = (e, t) => e << 32 - t | e >>> t,
                Z = 68 === new Uint8Array(new Uint32Array([287454020]).buffer)[0];
            if (!Z) throw Error("Non little-endian hardware is not supported");
            let H = Array.from({
                length: 256
            }, (e, t) => t.toString(16).padStart(2, "0"));

            function V(e) {
                if (!(e instanceof Uint8Array)) throw Error("Uint8Array expected");
                let t = "";
                for (let r = 0; r < e.length; r++) t += H[e[r]];
                return t
            }

            function F(e) {
                if ("string" != typeof e) throw TypeError(`utf8ToBytes expected string, got ${typeof e}`);
                return new TextEncoder().encode(e)
            }

            function $(e) {
                if ("string" == typeof e && (e = F(e)), !(e instanceof Uint8Array)) throw TypeError(`Expected input type is Uint8Array (got ${typeof e})`);
                return e
            }
            class G {
                clone() {
                    return this._cloneInto()
                }
            }

            function q(e) {
                let t = t => e().update($(t)).digest(),
                    r = e();
                return t.outputLen = r.outputLen, t.blockLen = r.blockLen, t.create = () => e(), t
            }

            function K(e = 32) {
                if (D && "function" == typeof D.getRandomValues) return D.getRandomValues(new Uint8Array(e));
                throw Error("crypto.getRandomValues must be defined")
            }
            class Y extends G {
                constructor(e, t, r, n) {
                    super(), this.blockLen = e, this.outputLen = t, this.padOffset = r, this.isLE = n, this.finished = !1, this.length = 0, this.pos = 0, this.destroyed = !1, this.buffer = new Uint8Array(e), this.view = W(this.buffer)
                }
                update(e) {
                    R.exists(this);
                    let {
                        view: t,
                        buffer: r,
                        blockLen: n
                    } = this;
                    e = $(e);
                    let i = e.length;
                    for (let o = 0; o < i;) {
                        let s = Math.min(n - this.pos, i - o);
                        if (s === n) {
                            let t = W(e);
                            for (; n <= i - o; o += n) this.process(t, o);
                            continue
                        }
                        r.set(e.subarray(o, o + s), this.pos), this.pos += s, o += s, this.pos === n && (this.process(t, 0), this.pos = 0)
                    }
                    return this.length += e.length, this.roundClean(), this
                }
                digestInto(e) {
                    R.exists(this), R.output(e, this), this.finished = !0;
                    let {
                        buffer: t,
                        view: r,
                        blockLen: n,
                        isLE: i
                    } = this, {
                        pos: o
                    } = this;
                    t[o++] = 128, this.buffer.subarray(o).fill(0), this.padOffset > n - o && (this.process(r, 0), o = 0);
                    for (let e = o; e < n; e++) t[e] = 0;
                    ! function(e, t, r, n) {
                        if ("function" == typeof e.setBigUint64) return e.setBigUint64(t, r, n);
                        let i = BigInt(32),
                            o = BigInt(4294967295),
                            s = Number(r >> i & o),
                            a = Number(r & o);
                        e.setUint32(t + (n ? 4 : 0), s, n), e.setUint32(t + (n ? 0 : 4), a, n)
                    }(r, n - 8, BigInt(8 * this.length), i), this.process(r, 0);
                    let s = W(e),
                        a = this.outputLen;
                    if (a % 4) throw Error("_sha2: outputLen should be aligned to 32bit");
                    let c = a / 4,
                        l = this.get();
                    if (c > l.length) throw Error("_sha2: outputLen bigger than state");
                    for (let e = 0; e < c; e++) s.setUint32(4 * e, l[e], i)
                }
                digest() {
                    let {
                        buffer: e,
                        outputLen: t
                    } = this;
                    this.digestInto(e);
                    let r = e.slice(0, t);
                    return this.destroy(), r
                }
                _cloneInto(e) {
                    e || (e = new this.constructor), e.set(...this.get());
                    let {
                        blockLen: t,
                        buffer: r,
                        length: n,
                        finished: i,
                        destroyed: o,
                        pos: s
                    } = this;
                    return e.length = n, e.pos = s, e.finished = i, e.destroyed = o, n % t && e.buffer.set(r), e
                }
            }
            let J = (e, t, r) => e & t ^ ~e & r,
                X = (e, t, r) => e & t ^ e & r ^ t & r,
                Q = new Uint32Array([1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]),
                ee = new Uint32Array([1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225]),
                et = new Uint32Array(64);
            class er extends Y {
                constructor() {
                    super(64, 32, 8, !1), this.A = 0 | ee[0], this.B = 0 | ee[1], this.C = 0 | ee[2], this.D = 0 | ee[3], this.E = 0 | ee[4], this.F = 0 | ee[5], this.G = 0 | ee[6], this.H = 0 | ee[7]
                }
                get() {
                    let {
                        A: e,
                        B: t,
                        C: r,
                        D: n,
                        E: i,
                        F: o,
                        G: s,
                        H: a
                    } = this;
                    return [e, t, r, n, i, o, s, a]
                }
                set(e, t, r, n, i, o, s, a) {
                    this.A = 0 | e, this.B = 0 | t, this.C = 0 | r, this.D = 0 | n, this.E = 0 | i, this.F = 0 | o, this.G = 0 | s, this.H = 0 | a
                }
                process(e, t) {
                    for (let r = 0; r < 16; r++, t += 4) et[r] = e.getUint32(t, !1);
                    for (let e = 16; e < 64; e++) {
                        let t = et[e - 15],
                            r = et[e - 2],
                            n = z(t, 7) ^ z(t, 18) ^ t >>> 3,
                            i = z(r, 17) ^ z(r, 19) ^ r >>> 10;
                        et[e] = i + et[e - 7] + n + et[e - 16] | 0
                    }
                    let {
                        A: r,
                        B: n,
                        C: i,
                        D: o,
                        E: s,
                        F: a,
                        G: c,
                        H: l
                    } = this;
                    for (let e = 0; e < 64; e++) {
                        let t = z(s, 6) ^ z(s, 11) ^ z(s, 25),
                            u = l + t + J(s, a, c) + Q[e] + et[e] | 0,
                            f = z(r, 2) ^ z(r, 13) ^ z(r, 22),
                            h = f + X(r, n, i) | 0;
                        l = c, c = a, a = s, s = o + u | 0, o = i, i = n, n = r, r = u + h | 0
                    }
                    r = r + this.A | 0, n = n + this.B | 0, i = i + this.C | 0, o = o + this.D | 0, s = s + this.E | 0, a = a + this.F | 0, c = c + this.G | 0, l = l + this.H | 0, this.set(r, n, i, o, s, a, c, l)
                }
                roundClean() {
                    et.fill(0)
                }
                destroy() {
                    this.set(0, 0, 0, 0, 0, 0, 0, 0), this.buffer.fill(0)
                }
            }
            class en extends er {
                constructor() {
                    super(), this.A = -1056596264, this.B = 914150663, this.C = 812702999, this.D = -150054599, this.E = -4191439, this.F = 1750603025, this.G = 1694076839, this.H = -1090891868, this.outputLen = 28
                }
            }
            let ei = q(() => new er);
            q(() => new en);
            let eo = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3, 11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4, 7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8, 9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13, 2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9, 12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11, 13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10, 6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5, 10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3]);
            class es extends G {
                constructor(e, t, r = {}, n, i, o) {
                    if (super(), this.blockLen = e, this.outputLen = t, this.length = 0, this.pos = 0, this.finished = !1, this.destroyed = !1, R.number(e), R.number(t), R.number(n), t < 0 || t > n) throw Error("outputLen bigger than keyLen");
                    if (void 0 !== r.key && (r.key.length < 1 || r.key.length > n)) throw Error(`key must be up 1..${n} byte long or undefined`);
                    if (void 0 !== r.salt && r.salt.length !== i) throw Error(`salt must be ${i} byte long or undefined`);
                    if (void 0 !== r.personalization && r.personalization.length !== o) throw Error(`personalization must be ${o} byte long or undefined`);
                    this.buffer32 = P(this.buffer = new Uint8Array(e))
                }
                update(e) {
                    R.exists(this);
                    let {
                        blockLen: t,
                        buffer: r,
                        buffer32: n
                    } = this;
                    e = $(e);
                    let i = e.length;
                    for (let o = 0; o < i;) {
                        this.pos === t && (this.compress(n, 0, !1), this.pos = 0);
                        let s = Math.min(t - this.pos, i - o),
                            a = e.byteOffset + o;
                        if (s === t && !(a % 4) && o + s < i) {
                            let r = new Uint32Array(e.buffer, a, Math.floor((i - o) / 4));
                            for (let e = 0; o + t < i; e += n.length, o += t) this.length += t, this.compress(r, e, !1);
                            continue
                        }
                        r.set(e.subarray(o, o + s), this.pos), this.pos += s, this.length += s, o += s
                    }
                    return this
                }
                digestInto(e) {
                    R.exists(this), R.output(e, this);
                    let {
                        pos: t,
                        buffer32: r
                    } = this;
                    this.finished = !0, this.buffer.subarray(t).fill(0), this.compress(r, 0, !0);
                    let n = P(e);
                    this.get().forEach((e, t) => n[t] = e)
                }
                digest() {
                    let {
                        buffer: e,
                        outputLen: t
                    } = this;
                    this.digestInto(e);
                    let r = e.slice(0, t);
                    return this.destroy(), r
                }
                _cloneInto(e) {
                    let {
                        buffer: t,
                        length: r,
                        finished: n,
                        destroyed: i,
                        outputLen: o,
                        pos: s
                    } = this;
                    return e || (e = new this.constructor({
                        dkLen: o
                    })), e.set(...this.get()), e.length = r, e.finished = n, e.destroyed = i, e.outputLen = o, e.buffer.set(t), e.pos = s, e
                }
            }
            let ea = BigInt(4294967296 - 1),
                ec = BigInt(32);

            function el(e, t = !1) {
                return t ? {
                    h: Number(e & ea),
                    l: Number(e >> ec & ea)
                } : {
                    h: 0 | Number(e >> ec & ea),
                    l: 0 | Number(e & ea)
                }
            }
            let eu = (e, t) => BigInt(e >>> 0) << ec | BigInt(t >>> 0);
            var ef = {
                fromBig: el,
                split: function(e, t = !1) {
                    let r = new Uint32Array(e.length),
                        n = new Uint32Array(e.length);
                    for (let i = 0; i < e.length; i++) {
                        let {
                            h: o,
                            l: s
                        } = el(e[i], t);
                        [r[i], n[i]] = [o, s]
                    }
                    return [r, n]
                },
                toBig: eu,
                shrSH: (e, t, r) => e >>> r,
                shrSL: (e, t, r) => e << 32 - r | t >>> r,
                rotrSH: (e, t, r) => e >>> r | t << 32 - r,
                rotrSL: (e, t, r) => e << 32 - r | t >>> r,
                rotrBH: (e, t, r) => e << 64 - r | t >>> r - 32,
                rotrBL: (e, t, r) => e >>> r - 32 | t << 64 - r,
                rotr32H: (e, t) => t,
                rotr32L: (e, t) => e,
                rotlSH: (e, t, r) => e << r | t >>> 32 - r,
                rotlSL: (e, t, r) => t << r | e >>> 32 - r,
                rotlBH: (e, t, r) => t << r - 32 | e >>> 64 - r,
                rotlBL: (e, t, r) => e << r - 32 | t >>> 64 - r,
                add: function(e, t, r, n) {
                    let i = (t >>> 0) + (n >>> 0);
                    return {
                        h: e + r + (i / 4294967296 | 0) | 0,
                        l: 0 | i
                    }
                },
                add3L: (e, t, r) => (e >>> 0) + (t >>> 0) + (r >>> 0),
                add3H: (e, t, r, n) => t + r + n + (e / 4294967296 | 0) | 0,
                add4L: (e, t, r, n) => (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0),
                add4H: (e, t, r, n, i) => t + r + n + i + (e / 4294967296 | 0) | 0,
                add5H: (e, t, r, n, i, o) => t + r + n + i + o + (e / 4294967296 | 0) | 0,
                add5L: (e, t, r, n, i) => (e >>> 0) + (t >>> 0) + (r >>> 0) + (n >>> 0) + (i >>> 0)
            };
            let eh = new Uint32Array([4089235720, 1779033703, 2227873595, 3144134277, 4271175723, 1013904242, 1595750129, 2773480762, 2917565137, 1359893119, 725511199, 2600822924, 4215389547, 528734635, 327033209, 1541459225]),
                ed = new Uint32Array(32);

            function ep(e, t, r, n, i, o) {
                let s = i[o],
                    a = i[o + 1],
                    c = ed[2 * e],
                    l = ed[2 * e + 1],
                    u = ed[2 * t],
                    f = ed[2 * t + 1],
                    h = ed[2 * r],
                    d = ed[2 * r + 1],
                    p = ed[2 * n],
                    g = ed[2 * n + 1],
                    y = ef.add3L(c, u, s);
                l = ef.add3H(y, l, f, a), c = 0 | y, ({
                    Dh: g,
                    Dl: p
                } = {
                    Dh: g ^ l,
                    Dl: p ^ c
                }), ({
                    Dh: g,
                    Dl: p
                } = {
                    Dh: ef.rotr32H(g, p),
                    Dl: ef.rotr32L(g, p)
                }), ({
                    h: d,
                    l: h
                } = ef.add(d, h, g, p)), ({
                    Bh: f,
                    Bl: u
                } = {
                    Bh: f ^ d,
                    Bl: u ^ h
                }), ({
                    Bh: f,
                    Bl: u
                } = {
                    Bh: ef.rotrSH(f, u, 24),
                    Bl: ef.rotrSL(f, u, 24)
                }), ed[2 * e] = c, ed[2 * e + 1] = l, ed[2 * t] = u, ed[2 * t + 1] = f, ed[2 * r] = h, ed[2 * r + 1] = d, ed[2 * n] = p, ed[2 * n + 1] = g
            }

            function eg(e, t, r, n, i, o) {
                let s = i[o],
                    a = i[o + 1],
                    c = ed[2 * e],
                    l = ed[2 * e + 1],
                    u = ed[2 * t],
                    f = ed[2 * t + 1],
                    h = ed[2 * r],
                    d = ed[2 * r + 1],
                    p = ed[2 * n],
                    g = ed[2 * n + 1],
                    y = ef.add3L(c, u, s);
                l = ef.add3H(y, l, f, a), c = 0 | y, ({
                    Dh: g,
                    Dl: p
                } = {
                    Dh: g ^ l,
                    Dl: p ^ c
                }), ({
                    Dh: g,
                    Dl: p
                } = {
                    Dh: ef.rotrSH(g, p, 16),
                    Dl: ef.rotrSL(g, p, 16)
                }), ({
                    h: d,
                    l: h
                } = ef.add(d, h, g, p)), ({
                    Bh: f,
                    Bl: u
                } = {
                    Bh: f ^ d,
                    Bl: u ^ h
                }), ({
                    Bh: f,
                    Bl: u
                } = {
                    Bh: ef.rotrBH(f, u, 63),
                    Bl: ef.rotrBL(f, u, 63)
                }), ed[2 * e] = c, ed[2 * e + 1] = l, ed[2 * t] = u, ed[2 * t + 1] = f, ed[2 * r] = h, ed[2 * r + 1] = d, ed[2 * n] = p, ed[2 * n + 1] = g
            }
            class ey extends es {
                constructor(e = {}) {
                    super(128, void 0 === e.dkLen ? 64 : e.dkLen, e, 64, 16, 16), this.v0l = 0 | eh[0], this.v0h = 0 | eh[1], this.v1l = 0 | eh[2], this.v1h = 0 | eh[3], this.v2l = 0 | eh[4], this.v2h = 0 | eh[5], this.v3l = 0 | eh[6], this.v3h = 0 | eh[7], this.v4l = 0 | eh[8], this.v4h = 0 | eh[9], this.v5l = 0 | eh[10], this.v5h = 0 | eh[11], this.v6l = 0 | eh[12], this.v6h = 0 | eh[13], this.v7l = 0 | eh[14], this.v7h = 0 | eh[15];
                    let t = e.key ? e.key.length : 0;
                    if (this.v0l ^= this.outputLen | t << 8 | 16842752, e.salt) {
                        let t = P($(e.salt));
                        this.v4l ^= t[0], this.v4h ^= t[1], this.v5l ^= t[2], this.v5h ^= t[3]
                    }
                    if (e.personalization) {
                        let t = P($(e.personalization));
                        this.v6l ^= t[0], this.v6h ^= t[1], this.v7l ^= t[2], this.v7h ^= t[3]
                    }
                    if (e.key) {
                        let t = new Uint8Array(this.blockLen);
                        t.set($(e.key)), this.update(t)
                    }
                }
                get() {
                    let {
                        v0l: e,
                        v0h: t,
                        v1l: r,
                        v1h: n,
                        v2l: i,
                        v2h: o,
                        v3l: s,
                        v3h: a,
                        v4l: c,
                        v4h: l,
                        v5l: u,
                        v5h: f,
                        v6l: h,
                        v6h: d,
                        v7l: p,
                        v7h: g
                    } = this;
                    return [e, t, r, n, i, o, s, a, c, l, u, f, h, d, p, g]
                }
                set(e, t, r, n, i, o, s, a, c, l, u, f, h, d, p, g) {
                    this.v0l = 0 | e, this.v0h = 0 | t, this.v1l = 0 | r, this.v1h = 0 | n, this.v2l = 0 | i, this.v2h = 0 | o, this.v3l = 0 | s, this.v3h = 0 | a, this.v4l = 0 | c, this.v4h = 0 | l, this.v5l = 0 | u, this.v5h = 0 | f, this.v6l = 0 | h, this.v6h = 0 | d, this.v7l = 0 | p, this.v7h = 0 | g
                }
                compress(e, t, r) {
                    this.get().forEach((e, t) => ed[t] = e), ed.set(eh, 16);
                    let {
                        h: n,
                        l: i
                    } = ef.fromBig(BigInt(this.length));
                    ed[24] = eh[8] ^ i, ed[25] = eh[9] ^ n, r && (ed[28] = ~ed[28], ed[29] = ~ed[29]);
                    let o = 0;
                    for (let r = 0; r < 12; r++) ep(0, 4, 8, 12, e, t + 2 * eo[o++]), eg(0, 4, 8, 12, e, t + 2 * eo[o++]), ep(1, 5, 9, 13, e, t + 2 * eo[o++]), eg(1, 5, 9, 13, e, t + 2 * eo[o++]), ep(2, 6, 10, 14, e, t + 2 * eo[o++]), eg(2, 6, 10, 14, e, t + 2 * eo[o++]), ep(3, 7, 11, 15, e, t + 2 * eo[o++]), eg(3, 7, 11, 15, e, t + 2 * eo[o++]), ep(0, 5, 10, 15, e, t + 2 * eo[o++]), eg(0, 5, 10, 15, e, t + 2 * eo[o++]), ep(1, 6, 11, 12, e, t + 2 * eo[o++]), eg(1, 6, 11, 12, e, t + 2 * eo[o++]), ep(2, 7, 8, 13, e, t + 2 * eo[o++]), eg(2, 7, 8, 13, e, t + 2 * eo[o++]), ep(3, 4, 9, 14, e, t + 2 * eo[o++]), eg(3, 4, 9, 14, e, t + 2 * eo[o++]);
                    this.v0l ^= ed[0] ^ ed[16], this.v0h ^= ed[1] ^ ed[17], this.v1l ^= ed[2] ^ ed[18], this.v1h ^= ed[3] ^ ed[19], this.v2l ^= ed[4] ^ ed[20], this.v2h ^= ed[5] ^ ed[21], this.v3l ^= ed[6] ^ ed[22], this.v3h ^= ed[7] ^ ed[23], this.v4l ^= ed[8] ^ ed[24], this.v4h ^= ed[9] ^ ed[25], this.v5l ^= ed[10] ^ ed[26], this.v5h ^= ed[11] ^ ed[27], this.v6l ^= ed[12] ^ ed[28], this.v6h ^= ed[13] ^ ed[29], this.v7l ^= ed[14] ^ ed[30], this.v7h ^= ed[15] ^ ed[31], ed.fill(0)
                }
                destroy() {
                    this.destroyed = !0, this.buffer32.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                }
            }
            let em = function(e) {
                let t = (t, r) => e(r).update($(t)).digest(),
                    r = e({});
                return t.outputLen = r.outputLen, t.blockLen = r.blockLen, t.create = t => e(t), t
            }(e => new ey(e));
            class eb extends TypeError {
                constructor(e, t) {
                    let r;
                    let {
                        message: n,
                        explanation: i,
                        ...o
                    } = e, {
                        path: s
                    } = e, a = 0 === s.length ? n : `At path: ${s.join(".")} -- ${n}`;
                    super(i ?? a), null != i && (this.cause = a), Object.assign(this, o), this.name = this.constructor.name, this.failures = () => r ?? (r = [e, ...t()])
                }
            }

            function ew(e) {
                return "object" == typeof e && null != e
            }

            function ev(e) {
                return "symbol" == typeof e ? e.toString() : "string" == typeof e ? JSON.stringify(e) : `${e}`
            }

            function* eE(e, t, r, n) {
                var i;
                for (let o of (ew(i = e) && "function" == typeof i[Symbol.iterator] || (e = [e]), e)) {
                    let e = function(e, t, r, n) {
                        if (!0 === e) return;
                        !1 === e ? e = {} : "string" == typeof e && (e = {
                            message: e
                        });
                        let {
                            path: i,
                            branch: o
                        } = t, {
                            type: s
                        } = r, {
                            refinement: a,
                            message: c = `Expected a value of type \`${s}\`${a?` with refinement \`${a}\``:""}, but received: \`${ev(n)}\``
                        } = e;
                        return {
                            value: n,
                            type: s,
                            refinement: a,
                            key: i[i.length - 1],
                            path: i,
                            branch: o,
                            ...e,
                            message: c
                        }
                    }(o, t, r, n);
                    e && (yield e)
                }
            }

            function* ex(e, t, r = {}) {
                let {
                    path: n = [],
                    branch: i = [e],
                    coerce: o = !1,
                    mask: s = !1
                } = r, a = {
                    path: n,
                    branch: i
                };
                if (o && (e = t.coercer(e, a), s && "type" !== t.type && ew(t.schema) && ew(e) && !Array.isArray(e)))
                    for (let r in e) void 0 === t.schema[r] && delete e[r];
                let c = "valid";
                for (let n of t.validator(e, a)) n.explanation = r.message, c = "not_valid", yield [n, void 0];
                for (let [l, u, f] of t.entries(e, a)) {
                    let t = ex(u, f, {
                        path: void 0 === l ? n : [...n, l],
                        branch: void 0 === l ? i : [...i, u],
                        coerce: o,
                        mask: s,
                        message: r.message
                    });
                    for (let r of t) r[0] ? (c = null != r[0].refinement ? "not_refined" : "not_valid", yield [r[0], void 0]) : o && (u = r[1], void 0 === l ? e = u : e instanceof Map ? e.set(l, u) : e instanceof Set ? e.add(u) : ew(e) && (void 0 !== u || l in e) && (e[l] = u))
                }
                if ("not_valid" !== c)
                    for (let n of t.refiner(e, a)) n.explanation = r.message, c = "not_refined", yield [n, void 0];
                "valid" === c && (yield [void 0, e])
            }
            class eA {
                constructor(e) {
                    let {
                        type: t,
                        schema: r,
                        validator: n,
                        refiner: i,
                        coercer: o = e => e,
                        entries: s = function*() {}
                    } = e;
                    this.type = t, this.schema = r, this.entries = s, this.coercer = o, n ? this.validator = (e, t) => {
                        let r = n(e, t);
                        return eE(r, t, this, e)
                    } : this.validator = () => [], i ? this.refiner = (e, t) => {
                        let r = i(e, t);
                        return eE(r, t, this, e)
                    } : this.refiner = () => []
                }
                assert(e, t) {
                    return eS(e, this, t)
                }
                create(e, t) {
                    return eT(e, this, t)
                }
                is(e) {
                    return eI(e, this)
                }
                mask(e, t) {
                    return ek(e, this, t)
                }
                validate(e, t = {}) {
                    return eC(e, this, t)
                }
            }

            function eS(e, t, r) {
                let n = eC(e, t, {
                    message: r
                });
                if (n[0]) throw n[0]
            }

            function eT(e, t, r) {
                let n = eC(e, t, {
                    coerce: !0,
                    message: r
                });
                if (!n[0]) return n[1];
                throw n[0]
            }

            function ek(e, t, r) {
                let n = eC(e, t, {
                    coerce: !0,
                    mask: !0,
                    message: r
                });
                if (!n[0]) return n[1];
                throw n[0]
            }

            function eI(e, t) {
                let r = eC(e, t);
                return !r[0]
            }

            function eC(e, t, r = {}) {
                let n = ex(e, t, r),
                    i = function(e) {
                        let {
                            done: t,
                            value: r
                        } = e.next();
                        return t ? void 0 : r
                    }(n);
                if (i[0]) {
                    let e = new eb(i[0], function*() {
                        for (let e of n) e[0] && (yield e[0])
                    });
                    return [e, void 0]
                } {
                    let e = i[1];
                    return [void 0, e]
                }
            }

            function eB(...e) {
                let t = "type" === e[0].type,
                    r = e.map(e => e.schema),
                    n = Object.assign({}, ...r);
                return t ? function(e) {
                    let t = Object.keys(e);
                    return new eA({
                        type: "type",
                        schema: e,
                        * entries(r) {
                            if (ew(r))
                                for (let n of t) yield [n, r[n], e[n]]
                        },
                        validator: e => ew(e) || `Expected an object, but received: ${ev(e)}`,
                        coercer: e => ew(e) ? {
                            ...e
                        } : e
                    })
                }(n) : eP(n)
            }

            function eO(e, t) {
                return new eA({
                    type: e,
                    schema: null,
                    validator: t
                })
            }

            function ej() {
                return eO("any", () => !0)
            }

            function eM(e) {
                return new eA({
                    type: "array",
                    schema: e,
                    * entries(t) {
                        if (e && Array.isArray(t))
                            for (let [r, n] of t.entries()) yield [r, n, e]
                    },
                    coercer: e => Array.isArray(e) ? e.slice() : e,
                    validator: e => Array.isArray(e) || `Expected an array value, but received: ${ev(e)}`
                })
            }

            function e_() {
                return eO("boolean", e => "boolean" == typeof e)
            }

            function eU() {
                return eO("integer", e => "number" == typeof e && !isNaN(e) && Number.isInteger(e) || `Expected an integer, but received: ${ev(e)}`)
            }

            function eN(e) {
                let t = ev(e),
                    r = typeof e;
                return new eA({
                    type: "literal",
                    schema: "string" === r || "number" === r || "boolean" === r ? e : null,
                    validator: r => r === e || `Expected the literal \`${t}\`, but received: ${ev(r)}`
                })
            }

            function eL() {
                return eO("never", () => !1)
            }

            function eR(e) {
                return new eA({
                    ...e,
                    validator: (t, r) => null === t || e.validator(t, r),
                    refiner: (t, r) => null === t || e.refiner(t, r)
                })
            }

            function eD() {
                return eO("number", e => "number" == typeof e && !isNaN(e) || `Expected a number, but received: ${ev(e)}`)
            }

            function eP(e) {
                let t = e ? Object.keys(e) : [],
                    r = eL();
                return new eA({
                    type: "object",
                    schema: e || null,
                    * entries(n) {
                        if (e && ew(n)) {
                            let i = new Set(Object.keys(n));
                            for (let r of t) i.delete(r), yield [r, n[r], e[r]];
                            for (let e of i) yield [e, n[e], r]
                        }
                    },
                    validator: e => ew(e) || `Expected an object, but received: ${ev(e)}`,
                    coercer: e => ew(e) ? {
                        ...e
                    } : e
                })
            }

            function eW(e) {
                return new eA({
                    ...e,
                    validator: (t, r) => void 0 === t || e.validator(t, r),
                    refiner: (t, r) => void 0 === t || e.refiner(t, r)
                })
            }

            function ez(e, t) {
                return new eA({
                    type: "record",
                    schema: null,
                    * entries(r) {
                        if (ew(r))
                            for (let n in r) {
                                let i = r[n];
                                yield [n, n, e], yield [n, i, t]
                            }
                    },
                    validator: e => ew(e) || `Expected an object, but received: ${ev(e)}`
                })
            }

            function eZ() {
                return eO("string", e => "string" == typeof e || `Expected a string, but received: ${ev(e)}`)
            }

            function eH(e) {
                let t = eL();
                return new eA({
                    type: "tuple",
                    schema: null,
                    * entries(r) {
                        if (Array.isArray(r)) {
                            let n = Math.max(e.length, r.length);
                            for (let i = 0; i < n; i++) yield [i, r[i], e[i] || t]
                        }
                    },
                    validator: e => Array.isArray(e) || `Expected an array, but received: ${ev(e)}`
                })
            }

            function eV(e) {
                let t = e.map(e => e.type).join(" | ");
                return new eA({
                    type: "union",
                    schema: null,
                    coercer(t) {
                        for (let r of e) {
                            let [e, n] = r.validate(t, {
                                coerce: !0
                            });
                            if (!e) return n
                        }
                        return t
                    },
                    validator(r, n) {
                        let i = [];
                        for (let t of e) {
                            let [...e] = ex(r, t, n), [o] = e;
                            if (!o[0]) return [];
                            for (let [t] of e) t && i.push(t)
                        }
                        return [`Expected the value to satisfy a union of \`${t}\`, but received: ${ev(r)}`, ...i]
                    }
                })
            } /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            let eF = BigInt(0),
                e$ = BigInt(1),
                eG = BigInt(2),
                eq = e => e instanceof Uint8Array,
                eK = Array.from({
                    length: 256
                }, (e, t) => t.toString(16).padStart(2, "0"));

            function eY(e) {
                if (!eq(e)) throw Error("Uint8Array expected");
                let t = "";
                for (let r = 0; r < e.length; r++) t += eK[e[r]];
                return t
            }

            function eJ(e) {
                let t = e.toString(16);
                return 1 & t.length ? `0${t}` : t
            }

            function eX(e) {
                if ("string" != typeof e) throw Error("hex string expected, got " + typeof e);
                return BigInt("" === e ? "0" : `0x${e}`)
            }

            function eQ(e) {
                if ("string" != typeof e) throw Error("hex string expected, got " + typeof e);
                if (e.length % 2) throw Error("hex string is invalid: unpadded " + e.length);
                let t = new Uint8Array(e.length / 2);
                for (let r = 0; r < t.length; r++) {
                    let n = 2 * r,
                        i = e.slice(n, n + 2),
                        o = Number.parseInt(i, 16);
                    if (Number.isNaN(o) || o < 0) throw Error("invalid byte sequence");
                    t[r] = o
                }
                return t
            }

            function e0(e) {
                return eX(eY(e))
            }

            function e1(e) {
                if (!eq(e)) throw Error("Uint8Array expected");
                return eX(eY(Uint8Array.from(e).reverse()))
            }
            let e2 = (e, t) => eQ(e.toString(16).padStart(2 * t, "0")),
                e5 = (e, t) => e2(e, t).reverse(),
                e3 = e => eQ(eJ(e));

            function e6(e, t, r) {
                let n;
                if ("string" == typeof t) try {
                        n = eQ(t)
                    } catch (r) {
                        throw Error(`${e} must be valid hex string, got "${t}". Cause: ${r}`)
                    } else if (eq(t)) n = Uint8Array.from(t);
                    else throw Error(`${e} must be hex string or Uint8Array`);
                let i = n.length;
                if ("number" == typeof r && i !== r) throw Error(`${e} expected ${r} bytes, got ${i}`);
                return n
            }

            function e4(...e) {
                let t = new Uint8Array(e.reduce((e, t) => e + t.length, 0)),
                    r = 0;
                return e.forEach(e => {
                    if (!eq(e)) throw Error("Uint8Array expected");
                    t.set(e, r), r += e.length
                }), t
            }

            function e8(e, t) {
                if (e.length !== t.length) return !1;
                for (let r = 0; r < e.length; r++)
                    if (e[r] !== t[r]) return !1;
                return !0
            }

            function e9(e) {
                if ("string" != typeof e) throw Error(`utf8ToBytes expected string, got ${typeof e}`);
                return new TextEncoder().encode(e)
            }

            function e7(e) {
                let t;
                for (t = 0; e > eF; e >>= e$, t += 1);
                return t
            }
            let te = (e, t) => e >> BigInt(t) & e$,
                tt = (e, t, r) => e | (r ? e$ : eF) << BigInt(t),
                tr = e => (eG << BigInt(e - 1)) - e$,
                tn = e => new Uint8Array(e),
                ti = e => Uint8Array.from(e);

            function to(e, t, r) {
                if ("number" != typeof e || e < 2) throw Error("hashLen must be a number");
                if ("number" != typeof t || t < 2) throw Error("qByteLen must be a number");
                if ("function" != typeof r) throw Error("hmacFn must be a function");
                let n = tn(e),
                    i = tn(e),
                    o = 0,
                    s = () => {
                        n.fill(1), i.fill(0), o = 0
                    },
                    a = (...e) => r(i, n, ...e),
                    c = (e = tn()) => {
                        i = a(ti([0]), e), n = a(), 0 !== e.length && (i = a(ti([1]), e), n = a())
                    },
                    l = () => {
                        if (o++ >= 1e3) throw Error("drbg: tried 1000 values");
                        let e = 0,
                            r = [];
                        for (; e < t;) {
                            n = a();
                            let t = n.slice();
                            r.push(t), e += n.length
                        }
                        return e4(...r)
                    },
                    u = (e, t) => {
                        let r;
                        for (s(), c(e); !(r = t(l()));) c();
                        return s(), r
                    };
                return u
            }
            let ts = {
                bigint: e => "bigint" == typeof e,
                function: e => "function" == typeof e,
                boolean: e => "boolean" == typeof e,
                string: e => "string" == typeof e,
                isSafeInteger: e => Number.isSafeInteger(e),
                array: e => Array.isArray(e),
                field: (e, t) => t.Fp.isValid(e),
                hash: e => "function" == typeof e && Number.isSafeInteger(e.outputLen)
            };

            function ta(e, t, r = {}) {
                let n = (t, r, n) => {
                    let i = ts[r];
                    if ("function" != typeof i) throw Error(`Invalid validator "${r}", expected function`);
                    let o = e[t];
                    if ((!n || void 0 !== o) && !i(o, e)) throw Error(`Invalid param ${String(t)}=${o} (${typeof o}), expected ${r}`)
                };
                for (let [e, r] of Object.entries(t)) n(e, r, !1);
                for (let [e, t] of Object.entries(r)) n(e, t, !0);
                return e
            } /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            let tc = BigInt(0),
                tl = BigInt(1),
                tu = BigInt(2),
                tf = BigInt(3),
                th = BigInt(4),
                td = BigInt(5),
                tp = BigInt(8);

            function tg(e, t) {
                let r = e % t;
                return r >= tc ? r : t + r
            }

            function ty(e, t, r) {
                let n = e;
                for (; t-- > tc;) n *= n, n %= r;
                return n
            }

            function tm(e, t) {
                if (e === tc || t <= tc) throw Error(`invert: expected positive integers, got n=${e} mod=${t}`);
                let r = tg(e, t),
                    n = t,
                    i = tc,
                    o = tl,
                    s = tl,
                    a = tc;
                for (; r !== tc;) {
                    let e = n / r,
                        t = n % r,
                        c = i - s * e,
                        l = o - a * e;
                    n = r, r = t, i = s, o = a, s = c, a = l
                }
                let c = n;
                if (c !== tl) throw Error("invert: does not exist");
                return tg(i, t)
            }
            BigInt(9), BigInt(16);
            let tb = ["create", "isValid", "is0", "neg", "inv", "sqrt", "sqr", "eql", "add", "sub", "mul", "pow", "div", "addN", "subN", "mulN", "sqrN"];

            function tw(e) {
                let t = tb.reduce((e, t) => (e[t] = "function", e), {
                    ORDER: "bigint",
                    MASK: "bigint",
                    BYTES: "isSafeInteger",
                    BITS: "isSafeInteger"
                });
                return ta(e, t)
            }

            function tv(e, t) {
                let r = void 0 !== t ? t : e.toString(2).length;
                return {
                    nBitLength: r,
                    nByteLength: Math.ceil(r / 8)
                }
            } /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            let tE = BigInt(0),
                tx = BigInt(1);

            function tA(e) {
                return tw(e.Fp), ta(e, {
                    n: "bigint",
                    h: "bigint",
                    Gx: "field",
                    Gy: "field"
                }, {
                    nBitLength: "isSafeInteger",
                    nByteLength: "isSafeInteger"
                }), Object.freeze({
                    ...tv(e.n, e.nBitLength),
                    ...e,
                    p: e.Fp.ORDER
                })
            }
            let {
                bytesToNumberBE: tS,
                hexToBytes: tT
            } = v, tk = {
                Err: class extends Error {
                    constructor(e = "") {
                        super(e)
                    }
                },
                _parseInt(e) {
                    let {
                        Err: t
                    } = tk;
                    if (e.length < 2 || 2 !== e[0]) throw new t("Invalid signature integer tag");
                    let r = e[1],
                        n = e.subarray(2, r + 2);
                    if (!r || n.length !== r) throw new t("Invalid signature integer: wrong length");
                    if (128 & n[0]) throw new t("Invalid signature integer: negative");
                    if (0 === n[0] && !(128 & n[1])) throw new t("Invalid signature integer: unnecessary leading zero");
                    return {
                        d: tS(n),
                        l: e.subarray(r + 2)
                    }
                },
                toSig(e) {
                    let {
                        Err: t
                    } = tk, r = "string" == typeof e ? tT(e) : e;
                    if (!(r instanceof Uint8Array)) throw Error("ui8a expected");
                    let n = r.length;
                    if (n < 2 || 48 != r[0]) throw new t("Invalid signature tag");
                    if (r[1] !== n - 2) throw new t("Invalid signature: incorrect length");
                    let {
                        d: i,
                        l: o
                    } = tk._parseInt(r.subarray(2)), {
                        d: s,
                        l: a
                    } = tk._parseInt(o);
                    if (a.length) throw new t("Invalid signature: left bytes after parsing");
                    return {
                        r: i,
                        s
                    }
                },
                hexFromSig(e) {
                    let t = e => 8 & Number.parseInt(e[0], 16) ? "00" + e : e,
                        r = e => {
                            let t = e.toString(16);
                            return 1 & t.length ? `0${t}` : t
                        },
                        n = t(r(e.s)),
                        i = t(r(e.r)),
                        o = n.length / 2,
                        s = i.length / 2,
                        a = r(o),
                        c = r(s);
                    return `30${r(s+o+4)}02${c}${i}02${a}${n}`
                }
            }, tI = BigInt(0), tC = BigInt(1), tB = BigInt(2), tO = BigInt(3), tj = BigInt(4), tM = e0;

            function t_(e, t) {
                if (e < 0 || e >= 1 << 8 * t) throw Error(`bad I2OSP call: value=${e} length=${t}`);
                let r = Array.from({
                    length: t
                }).fill(0);
                for (let n = t - 1; n >= 0; n--) r[n] = 255 & e, e >>>= 8;
                return new Uint8Array(r)
            }

            function tU(e) {
                if (!(e instanceof Uint8Array)) throw Error("Uint8Array expected")
            }

            function tN(e) {
                if (!Number.isSafeInteger(e)) throw Error("number expected")
            }

            function tL(e, t, r) {
                let n;
                ta(r, {
                    DST: "string",
                    p: "bigint",
                    m: "isSafeInteger",
                    k: "isSafeInteger",
                    hash: "hash"
                });
                let {
                    p: i,
                    k: o,
                    m: s,
                    hash: a,
                    expand: c,
                    DST: l
                } = r;
                tU(e), tN(t);
                let u = function(e) {
                        if (e instanceof Uint8Array) return e;
                        if ("string" == typeof e) return e9(e);
                        throw Error("DST must be Uint8Array or string")
                    }(l),
                    f = i.toString(2).length,
                    h = Math.ceil((f + o) / 8),
                    d = t * s * h;
                if ("xmd" === c) n = function(e, t, r, n) {
                    tU(e), tU(t), tN(r), t.length > 255 && (t = n(e4(e9("H2C-OVERSIZE-DST-"), t)));
                    let {
                        outputLen: i,
                        blockLen: o
                    } = n, s = Math.ceil(r / i);
                    if (s > 255) throw Error("Invalid xmd length");
                    let a = e4(t, t_(t.length, 1)),
                        c = t_(0, o),
                        l = t_(r, 2),
                        u = Array(s),
                        f = n(e4(c, e, l, t_(0, 1), a));
                    u[0] = n(e4(f, t_(1, 1), a));
                    for (let e = 1; e <= s; e++) {
                        let t = [function(e, t) {
                            let r = new Uint8Array(e.length);
                            for (let n = 0; n < e.length; n++) r[n] = e[n] ^ t[n];
                            return r
                        }(f, u[e - 1]), t_(e + 1, 1), a];
                        u[e] = n(e4(...t))
                    }
                    let h = e4(...u);
                    return h.slice(0, r)
                }(e, u, d, a);
                else if ("xof" === c) n = function(e, t, r, n, i) {
                    if (tU(e), tU(t), tN(r), t.length > 255 && (t = i.create({
                            dkLen: Math.ceil(2 * n / 8)
                        }).update(e9("H2C-OVERSIZE-DST-")).update(t).digest()), r > 65535 || t.length > 255) throw Error("expand_message_xof: invalid lenInBytes");
                    return i.create({
                        dkLen: r
                    }).update(e).update(t_(r, 2)).update(t).update(t_(t.length, 1)).digest()
                }(e, u, d, o, a);
                else if ("_internal_pass" === c) n = e;
                else throw Error('expand must be "xmd" or "xof"');
                let p = Array(t);
                for (let e = 0; e < t; e++) {
                    let t = Array(s);
                    for (let r = 0; r < s; r++) {
                        let o = h * (r + e * s),
                            a = n.subarray(o, o + h);
                        t[r] = tg(tM(a), i)
                    }
                    p[e] = t
                }
                return p
            }
            class tR extends G {
                constructor(e, t) {
                    super(), this.finished = !1, this.destroyed = !1, R.hash(e);
                    let r = $(t);
                    if (this.iHash = e.create(), "function" != typeof this.iHash.update) throw TypeError("Expected instance of class which extends utils.Hash");
                    this.blockLen = this.iHash.blockLen, this.outputLen = this.iHash.outputLen;
                    let n = this.blockLen,
                        i = new Uint8Array(n);
                    i.set(r.length > n ? e.create().update(r).digest() : r);
                    for (let e = 0; e < i.length; e++) i[e] ^= 54;
                    this.iHash.update(i), this.oHash = e.create();
                    for (let e = 0; e < i.length; e++) i[e] ^= 106;
                    this.oHash.update(i), i.fill(0)
                }
                update(e) {
                    return R.exists(this), this.iHash.update(e), this
                }
                digestInto(e) {
                    R.exists(this), R.bytes(e, this.outputLen), this.finished = !0, this.iHash.digestInto(e), this.oHash.update(e), this.oHash.digestInto(e), this.destroy()
                }
                digest() {
                    let e = new Uint8Array(this.oHash.outputLen);
                    return this.digestInto(e), e
                }
                _cloneInto(e) {
                    e || (e = Object.create(Object.getPrototypeOf(this), {}));
                    let {
                        oHash: t,
                        iHash: r,
                        finished: n,
                        destroyed: i,
                        blockLen: o,
                        outputLen: s
                    } = this;
                    return e.finished = n, e.destroyed = i, e.blockLen = o, e.outputLen = s, e.oHash = t._cloneInto(e.oHash), e.iHash = r._cloneInto(e.iHash), e
                }
                destroy() {
                    this.destroyed = !0, this.oHash.destroy(), this.iHash.destroy()
                }
            }
            let tD = (e, t, r) => new tR(e, t).update(r).digest();
            tD.create = (e, t) => new tR(e, t); /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            let tP = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f"),
                tW = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141"),
                tz = BigInt(1),
                tZ = BigInt(2),
                tH = (e, t) => (e + t / tZ) / t,
                tV = function(e, t, r = !1, n = {}) {
                    if (e <= tc) throw Error(`Expected Fp ORDER > 0, got ${e}`);
                    let {
                        nBitLength: i,
                        nByteLength: o
                    } = tv(e, t);
                    if (o > 2048) throw Error("Field lengths over 2048 bytes are not supported");
                    let s = function(e) {
                            if (e % th === tf) {
                                let t = (e + tl) / th;
                                return function(e, r) {
                                    let n = e.pow(r, t);
                                    if (!e.eql(e.sqr(n), r)) throw Error("Cannot find square root");
                                    return n
                                }
                            }
                            if (e % tp === td) {
                                let t = (e - td) / tp;
                                return function(e, r) {
                                    let n = e.mul(r, tu),
                                        i = e.pow(n, t),
                                        o = e.mul(r, i),
                                        s = e.mul(e.mul(o, tu), i),
                                        a = e.mul(o, e.sub(s, e.ONE));
                                    if (!e.eql(e.sqr(a), r)) throw Error("Cannot find square root");
                                    return a
                                }
                            }
                            return function(e) {
                                let t, r, n;
                                let i = (e - tl) / tu;
                                for (t = e - tl, r = 0; t % tu === tc; t /= tu, r++);
                                for (n = tu; n < e && function(e, t, r) {
                                        if (r <= tc || t < tc) throw Error("Expected power/modulo > 0");
                                        if (r === tl) return tc;
                                        let n = tl;
                                        for (; t > tc;) t & tl && (n = n * e % r), e = e * e % r, t >>= tl;
                                        return n
                                    }(n, i, e) !== e - tl; n++);
                                if (1 === r) {
                                    let t = (e + tl) / th;
                                    return function(e, r) {
                                        let n = e.pow(r, t);
                                        if (!e.eql(e.sqr(n), r)) throw Error("Cannot find square root");
                                        return n
                                    }
                                }
                                let o = (t + tl) / tu;
                                return function(e, s) {
                                    if (e.pow(s, i) === e.neg(e.ONE)) throw Error("Cannot find square root");
                                    let a = r,
                                        c = e.pow(e.mul(e.ONE, n), t),
                                        l = e.pow(s, o),
                                        u = e.pow(s, t);
                                    for (; !e.eql(u, e.ONE);) {
                                        if (e.eql(u, e.ZERO)) return e.ZERO;
                                        let t = 1;
                                        for (let r = e.sqr(u); t < a && !e.eql(r, e.ONE); t++) r = e.sqr(r);
                                        let r = e.pow(c, tl << BigInt(a - t - 1));
                                        c = e.sqr(r), l = e.mul(l, r), u = e.mul(u, c), a = t
                                    }
                                    return l
                                }
                            }(e)
                        }(e),
                        a = Object.freeze({
                            ORDER: e,
                            BITS: i,
                            BYTES: o,
                            MASK: tr(i),
                            ZERO: tc,
                            ONE: tl,
                            create: t => tg(t, e),
                            isValid: t => {
                                if ("bigint" != typeof t) throw Error(`Invalid field element: expected bigint, got ${typeof t}`);
                                return tc <= t && t < e
                            },
                            is0: e => e === tc,
                            isOdd: e => (e & tl) === tl,
                            neg: t => tg(-t, e),
                            eql: (e, t) => e === t,
                            sqr: t => tg(t * t, e),
                            add: (t, r) => tg(t + r, e),
                            sub: (t, r) => tg(t - r, e),
                            mul: (t, r) => tg(t * r, e),
                            pow: (e, t) => (function(e, t, r) {
                                if (r < tc) throw Error("Expected power > 0");
                                if (r === tc) return e.ONE;
                                if (r === tl) return t;
                                let n = e.ONE,
                                    i = t;
                                for (; r > tc;) r & tl && (n = e.mul(n, i)), i = e.sqr(i), r >>= tl;
                                return n
                            })(a, e, t),
                            div: (t, r) => tg(t * tm(r, e), e),
                            sqrN: e => e * e,
                            addN: (e, t) => e + t,
                            subN: (e, t) => e - t,
                            mulN: (e, t) => e * t,
                            inv: t => tm(t, e),
                            sqrt: n.sqrt || (e => s(a, e)),
                            invertBatch: e => (function(e, t) {
                                let r = Array(t.length),
                                    n = t.reduce((t, n, i) => e.is0(n) ? t : (r[i] = t, e.mul(t, n)), e.ONE),
                                    i = e.inv(n);
                                return t.reduceRight((t, n, i) => e.is0(n) ? t : (r[i] = e.mul(t, r[i]), e.mul(t, n)), i), r
                            })(a, e),
                            cmov: (e, t, r) => r ? t : e,
                            toBytes: e => r ? e5(e, o) : e2(e, o),
                            fromBytes: e => {
                                if (e.length !== o) throw Error(`Fp.fromBytes: expected ${o}, got ${e.length}`);
                                return r ? e1(e) : e0(e)
                            }
                        });
                    return Object.freeze(a)
                }(tP, void 0, void 0, {
                    sqrt: function(e) {
                        let t = BigInt(3),
                            r = BigInt(6),
                            n = BigInt(11),
                            i = BigInt(22),
                            o = BigInt(23),
                            s = BigInt(44),
                            a = BigInt(88),
                            c = e * e * e % tP,
                            l = c * c * e % tP,
                            u = ty(l, t, tP) * l % tP,
                            f = ty(u, t, tP) * l % tP,
                            h = ty(f, tZ, tP) * c % tP,
                            d = ty(h, n, tP) * h % tP,
                            p = ty(d, i, tP) * d % tP,
                            g = ty(p, s, tP) * p % tP,
                            y = ty(g, a, tP) * g % tP,
                            m = ty(y, s, tP) * p % tP,
                            b = ty(m, t, tP) * l % tP,
                            w = ty(b, o, tP) * d % tP,
                            v = ty(w, r, tP) * c % tP,
                            E = ty(v, tZ, tP);
                        if (!tV.eql(tV.sqr(E), e)) throw Error("Cannot find square root");
                        return E
                    }
                }),
                tF = function(e, t) {
                    let r = t => (function(e) {
                        let t = function(e) {
                                let t = tA(e);
                                return ta(t, {
                                    hash: "hash",
                                    hmac: "function",
                                    randomBytes: "function"
                                }, {
                                    bits2int: "function",
                                    bits2int_modN: "function",
                                    lowS: "boolean"
                                }), Object.freeze({
                                    lowS: !0,
                                    ...t
                                })
                            }(e),
                            {
                                Fp: r,
                                n: n
                            } = t,
                            i = r.BYTES + 1,
                            o = 2 * r.BYTES + 1;

                        function s(e) {
                            return tg(e, n)
                        }
                        let {
                            ProjectivePoint: a,
                            normPrivateKeyToScalar: c,
                            weierstrassEquation: l,
                            isWithinCurveOrder: u
                        } = function(e) {
                            let t = /*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */ function(e) {
                                    let t = tA(e);
                                    ta(t, {
                                        a: "field",
                                        b: "field"
                                    }, {
                                        allowedPrivateKeyLengths: "array",
                                        wrapPrivateKey: "boolean",
                                        isTorsionFree: "function",
                                        clearCofactor: "function",
                                        allowInfinityPoint: "boolean",
                                        fromBytes: "function",
                                        toBytes: "function"
                                    });
                                    let {
                                        endo: r,
                                        Fp: n,
                                        a: i
                                    } = t;
                                    if (r) {
                                        if (!n.eql(i, n.ZERO)) throw Error("Endomorphism can only be defined for Koblitz curves that have a=0");
                                        if ("object" != typeof r || "bigint" != typeof r.beta || "function" != typeof r.splitScalar) throw Error("Expected endomorphism with beta: bigint and splitScalar: function")
                                    }
                                    return Object.freeze({
                                        ...t
                                    })
                                }(e),
                                {
                                    Fp: r
                                } = t,
                                n = t.toBytes || ((e, t, n) => {
                                    let i = t.toAffine();
                                    return e4(Uint8Array.from([4]), r.toBytes(i.x), r.toBytes(i.y))
                                }),
                                i = t.fromBytes || (e => {
                                    let t = e.subarray(1),
                                        n = r.fromBytes(t.subarray(0, r.BYTES)),
                                        i = r.fromBytes(t.subarray(r.BYTES, 2 * r.BYTES));
                                    return {
                                        x: n,
                                        y: i
                                    }
                                });

                            function o(e) {
                                let {
                                    a: n,
                                    b: i
                                } = t, o = r.sqr(e), s = r.mul(o, e);
                                return r.add(r.add(s, r.mul(e, n)), i)
                            }
                            if (!r.eql(r.sqr(t.Gy), o(t.Gx))) throw Error("bad generator point: equation left != right");

                            function s(e) {
                                return "bigint" == typeof e && tI < e && e < t.n
                            }

                            function a(e) {
                                if (!s(e)) throw Error("Expected valid bigint: 0 < bigint < curve.n")
                            }

                            function c(e) {
                                let r;
                                let {
                                    allowedPrivateKeyLengths: n,
                                    nByteLength: i,
                                    wrapPrivateKey: o,
                                    n: s
                                } = t;
                                if (n && "bigint" != typeof e) {
                                    if (e instanceof Uint8Array && (e = eY(e)), "string" != typeof e || !n.includes(e.length)) throw Error("Invalid key");
                                    e = e.padStart(2 * i, "0")
                                }
                                try {
                                    r = "bigint" == typeof e ? e : e0(e6("private key", e, i))
                                } catch (t) {
                                    throw Error(`private key must be ${i} bytes, hex or bigint, not ${typeof e}`)
                                }
                                return o && (r = tg(r, s)), a(r), r
                            }
                            let l = new Map;

                            function u(e) {
                                if (!(e instanceof f)) throw Error("ProjectivePoint expected")
                            }
                            class f {
                                constructor(e, t, n) {
                                    if (this.px = e, this.py = t, this.pz = n, null == e || !r.isValid(e)) throw Error("x required");
                                    if (null == t || !r.isValid(t)) throw Error("y required");
                                    if (null == n || !r.isValid(n)) throw Error("z required")
                                }
                                static fromAffine(e) {
                                    let {
                                        x: t,
                                        y: n
                                    } = e || {};
                                    if (!e || !r.isValid(t) || !r.isValid(n)) throw Error("invalid affine point");
                                    if (e instanceof f) throw Error("projective point not allowed");
                                    let i = e => r.eql(e, r.ZERO);
                                    return i(t) && i(n) ? f.ZERO : new f(t, n, r.ONE)
                                }
                                get x() {
                                    return this.toAffine().x
                                }
                                get y() {
                                    return this.toAffine().y
                                }
                                static normalizeZ(e) {
                                    let t = r.invertBatch(e.map(e => e.pz));
                                    return e.map((e, r) => e.toAffine(t[r])).map(f.fromAffine)
                                }
                                static fromHex(e) {
                                    let t = f.fromAffine(i(e6("pointHex", e)));
                                    return t.assertValidity(), t
                                }
                                static fromPrivateKey(e) {
                                    return f.BASE.multiply(c(e))
                                }
                                _setWindowSize(e) {
                                    this._WINDOW_SIZE = e, l.delete(this)
                                }
                                assertValidity() {
                                    if (this.is0()) {
                                        if (t.allowInfinityPoint) return;
                                        throw Error("bad point: ZERO")
                                    }
                                    let {
                                        x: e,
                                        y: n
                                    } = this.toAffine();
                                    if (!r.isValid(e) || !r.isValid(n)) throw Error("bad point: x or y not FE");
                                    let i = r.sqr(n),
                                        s = o(e);
                                    if (!r.eql(i, s)) throw Error("bad point: equation left != right");
                                    if (!this.isTorsionFree()) throw Error("bad point: not in prime-order subgroup")
                                }
                                hasEvenY() {
                                    let {
                                        y: e
                                    } = this.toAffine();
                                    if (r.isOdd) return !r.isOdd(e);
                                    throw Error("Field doesn't support isOdd")
                                }
                                equals(e) {
                                    u(e);
                                    let {
                                        px: t,
                                        py: n,
                                        pz: i
                                    } = this, {
                                        px: o,
                                        py: s,
                                        pz: a
                                    } = e, c = r.eql(r.mul(t, a), r.mul(o, i)), l = r.eql(r.mul(n, a), r.mul(s, i));
                                    return c && l
                                }
                                negate() {
                                    return new f(this.px, r.neg(this.py), this.pz)
                                }
                                double() {
                                    let {
                                        a: e,
                                        b: n
                                    } = t, i = r.mul(n, tO), {
                                        px: o,
                                        py: s,
                                        pz: a
                                    } = this, c = r.ZERO, l = r.ZERO, u = r.ZERO, h = r.mul(o, o), d = r.mul(s, s), p = r.mul(a, a), g = r.mul(o, s);
                                    return g = r.add(g, g), u = r.mul(o, a), u = r.add(u, u), c = r.mul(e, u), l = r.mul(i, p), l = r.add(c, l), c = r.sub(d, l), l = r.add(d, l), l = r.mul(c, l), c = r.mul(g, c), u = r.mul(i, u), p = r.mul(e, p), g = r.sub(h, p), g = r.mul(e, g), g = r.add(g, u), u = r.add(h, h), h = r.add(u, h), h = r.add(h, p), h = r.mul(h, g), l = r.add(l, h), p = r.mul(s, a), p = r.add(p, p), h = r.mul(p, g), c = r.sub(c, h), u = r.mul(p, d), u = r.add(u, u), u = r.add(u, u), new f(c, l, u)
                                }
                                add(e) {
                                    u(e);
                                    let {
                                        px: n,
                                        py: i,
                                        pz: o
                                    } = this, {
                                        px: s,
                                        py: a,
                                        pz: c
                                    } = e, l = r.ZERO, h = r.ZERO, d = r.ZERO, p = t.a, g = r.mul(t.b, tO), y = r.mul(n, s), m = r.mul(i, a), b = r.mul(o, c), w = r.add(n, i), v = r.add(s, a);
                                    w = r.mul(w, v), v = r.add(y, m), w = r.sub(w, v), v = r.add(n, o);
                                    let E = r.add(s, c);
                                    return v = r.mul(v, E), E = r.add(y, b), v = r.sub(v, E), E = r.add(i, o), l = r.add(a, c), E = r.mul(E, l), l = r.add(m, b), E = r.sub(E, l), d = r.mul(p, v), l = r.mul(g, b), d = r.add(l, d), l = r.sub(m, d), d = r.add(m, d), h = r.mul(l, d), m = r.add(y, y), m = r.add(m, y), b = r.mul(p, b), v = r.mul(g, v), m = r.add(m, b), b = r.sub(y, b), b = r.mul(p, b), v = r.add(v, b), y = r.mul(m, v), h = r.add(h, y), y = r.mul(E, v), l = r.mul(w, l), l = r.sub(l, y), y = r.mul(w, m), d = r.mul(E, d), d = r.add(d, y), new f(l, h, d)
                                }
                                subtract(e) {
                                    return this.add(e.negate())
                                }
                                is0() {
                                    return this.equals(f.ZERO)
                                }
                                wNAF(e) {
                                    return d.wNAFCached(this, l, e, e => {
                                        let t = r.invertBatch(e.map(e => e.pz));
                                        return e.map((e, r) => e.toAffine(t[r])).map(f.fromAffine)
                                    })
                                }
                                multiplyUnsafe(e) {
                                    let n = f.ZERO;
                                    if (e === tI) return n;
                                    if (a(e), e === tC) return this;
                                    let {
                                        endo: i
                                    } = t;
                                    if (!i) return d.unsafeLadder(this, e);
                                    let {
                                        k1neg: o,
                                        k1: s,
                                        k2neg: c,
                                        k2: l
                                    } = i.splitScalar(e), u = n, h = n, p = this;
                                    for (; s > tI || l > tI;) s & tC && (u = u.add(p)), l & tC && (h = h.add(p)), p = p.double(), s >>= tC, l >>= tC;
                                    return o && (u = u.negate()), c && (h = h.negate()), h = new f(r.mul(h.px, i.beta), h.py, h.pz), u.add(h)
                                }
                                multiply(e) {
                                    let n, i;
                                    a(e);
                                    let {
                                        endo: o
                                    } = t;
                                    if (o) {
                                        let {
                                            k1neg: t,
                                            k1: s,
                                            k2neg: a,
                                            k2: c
                                        } = o.splitScalar(e), {
                                            p: l,
                                            f: u
                                        } = this.wNAF(s), {
                                            p: h,
                                            f: p
                                        } = this.wNAF(c);
                                        l = d.constTimeNegate(t, l), h = d.constTimeNegate(a, h), h = new f(r.mul(h.px, o.beta), h.py, h.pz), n = l.add(h), i = u.add(p)
                                    } else {
                                        let {
                                            p: t,
                                            f: r
                                        } = this.wNAF(e);
                                        n = t, i = r
                                    }
                                    return f.normalizeZ([n, i])[0]
                                }
                                multiplyAndAddUnsafe(e, t, r) {
                                    let n = f.BASE,
                                        i = (e, t) => t !== tI && t !== tC && e.equals(n) ? e.multiply(t) : e.multiplyUnsafe(t),
                                        o = i(this, t).add(i(e, r));
                                    return o.is0() ? void 0 : o
                                }
                                toAffine(e) {
                                    let {
                                        px: t,
                                        py: n,
                                        pz: i
                                    } = this, o = this.is0();
                                    null == e && (e = o ? r.ONE : r.inv(i));
                                    let s = r.mul(t, e),
                                        a = r.mul(n, e),
                                        c = r.mul(i, e);
                                    if (o) return {
                                        x: r.ZERO,
                                        y: r.ZERO
                                    };
                                    if (!r.eql(c, r.ONE)) throw Error("invZ was invalid");
                                    return {
                                        x: s,
                                        y: a
                                    }
                                }
                                isTorsionFree() {
                                    let {
                                        h: e,
                                        isTorsionFree: r
                                    } = t;
                                    if (e === tC) return !0;
                                    if (r) return r(f, this);
                                    throw Error("isTorsionFree() has not been declared for the elliptic curve")
                                }
                                clearCofactor() {
                                    let {
                                        h: e,
                                        clearCofactor: r
                                    } = t;
                                    return e === tC ? this : r ? r(f, this) : this.multiplyUnsafe(t.h)
                                }
                                toRawBytes(e = !0) {
                                    return this.assertValidity(), n(f, this, e)
                                }
                                toHex(e = !0) {
                                    return eY(this.toRawBytes(e))
                                }
                            }
                            f.BASE = new f(t.Gx, t.Gy, r.ONE), f.ZERO = new f(r.ZERO, r.ONE, r.ZERO);
                            let h = t.nBitLength,
                                d = function(e, t) {
                                    let r = (e, t) => {
                                            let r = t.negate();
                                            return e ? r : t
                                        },
                                        n = e => ({
                                            windows: Math.ceil(t / e) + 1,
                                            windowSize: 2 ** (e - 1)
                                        });
                                    return {
                                        constTimeNegate: r,
                                        unsafeLadder(t, r) {
                                            let n = e.ZERO,
                                                i = t;
                                            for (; r > tE;) r & tx && (n = n.add(i)), i = i.double(), r >>= tx;
                                            return n
                                        },
                                        precomputeWindow(e, t) {
                                            let {
                                                windows: r,
                                                windowSize: i
                                            } = n(t), o = [], s = e, a = s;
                                            for (let e = 0; e < r; e++) {
                                                a = s, o.push(a);
                                                for (let e = 1; e < i; e++) a = a.add(s), o.push(a);
                                                s = a.double()
                                            }
                                            return o
                                        },
                                        wNAF(t, i, o) {
                                            let {
                                                windows: s,
                                                windowSize: a
                                            } = n(t), c = e.ZERO, l = e.BASE, u = BigInt(2 ** t - 1), f = 2 ** t, h = BigInt(t);
                                            for (let e = 0; e < s; e++) {
                                                let t = e * a,
                                                    n = Number(o & u);
                                                o >>= h, n > a && (n -= f, o += tx);
                                                let s = t + Math.abs(n) - 1,
                                                    d = e % 2 != 0,
                                                    p = n < 0;
                                                0 === n ? l = l.add(r(d, i[t])) : c = c.add(r(p, i[s]))
                                            }
                                            return {
                                                p: c,
                                                f: l
                                            }
                                        },
                                        wNAFCached(e, t, r, n) {
                                            let i = e._WINDOW_SIZE || 1,
                                                o = t.get(e);
                                            return o || (o = this.precomputeWindow(e, i), 1 !== i && t.set(e, n(o))), this.wNAF(i, o, r)
                                        }
                                    }
                                }(f, t.endo ? Math.ceil(h / 2) : h);
                            return {
                                CURVE: t,
                                ProjectivePoint: f,
                                normPrivateKeyToScalar: c,
                                weierstrassEquation: o,
                                isWithinCurveOrder: s
                            }
                        }({
                            ...t,
                            toBytes(e, t, n) {
                                let i = t.toAffine(),
                                    o = r.toBytes(i.x),
                                    s = e4;
                                return n ? s(Uint8Array.from([t.hasEvenY() ? 2 : 3]), o) : s(Uint8Array.from([4]), o, r.toBytes(i.y))
                            },
                            fromBytes(e) {
                                let t = e.length,
                                    n = e[0],
                                    s = e.subarray(1);
                                if (t === i && (2 === n || 3 === n)) {
                                    let e = e0(s);
                                    if (!(tI < e && e < r.ORDER)) throw Error("Point is not on curve");
                                    let t = l(e),
                                        i = r.sqrt(t),
                                        o = (i & tC) === tC;
                                    return (1 & n) == 1 !== o && (i = r.neg(i)), {
                                        x: e,
                                        y: i
                                    }
                                }
                                if (t === o && 4 === n) {
                                    let e = r.fromBytes(s.subarray(0, r.BYTES)),
                                        t = r.fromBytes(s.subarray(r.BYTES, 2 * r.BYTES));
                                    return {
                                        x: e,
                                        y: t
                                    }
                                }
                                throw Error(`Point of length ${t} was invalid. Expected ${i} compressed bytes or ${o} uncompressed bytes`)
                            }
                        }), f = e => eY(e2(e, t.nByteLength)), h = (e, t, r) => e0(e.slice(t, r));
                        class d {
                            constructor(e, t, r) {
                                this.r = e, this.s = t, this.recovery = r, this.assertValidity()
                            }
                            static fromCompact(e) {
                                let r = t.nByteLength;
                                return e = e6("compactSignature", e, 2 * r), new d(h(e, 0, r), h(e, r, 2 * r))
                            }
                            static fromDER(e) {
                                let {
                                    r: t,
                                    s: r
                                } = tk.toSig(e6("DER", e));
                                return new d(t, r)
                            }
                            assertValidity() {
                                if (!u(this.r)) throw Error("r must be 0 < r < CURVE.n");
                                if (!u(this.s)) throw Error("s must be 0 < s < CURVE.n")
                            }
                            addRecoveryBit(e) {
                                return new d(this.r, this.s, e)
                            }
                            recoverPublicKey(e) {
                                let {
                                    r: i,
                                    s: o,
                                    recovery: c
                                } = this, l = y(e6("msgHash", e));
                                if (null == c || ![0, 1, 2, 3].includes(c)) throw Error("recovery id invalid");
                                let u = 2 === c || 3 === c ? i + t.n : i;
                                if (u >= r.ORDER) throw Error("recovery id 2 or 3 invalid");
                                let h = a.fromHex(((1 & c) == 0 ? "02" : "03") + f(u)),
                                    d = tm(u, n),
                                    p = s(-l * d),
                                    g = s(o * d),
                                    m = a.BASE.multiplyAndAddUnsafe(h, p, g);
                                if (!m) throw Error("point at infinify");
                                return m.assertValidity(), m
                            }
                            hasHighS() {
                                return this.s > n >> tC
                            }
                            normalizeS() {
                                return this.hasHighS() ? new d(this.r, s(-this.s), this.recovery) : this
                            }
                            toDERRawBytes() {
                                return eQ(this.toDERHex())
                            }
                            toDERHex() {
                                return tk.hexFromSig({
                                    r: this.r,
                                    s: this.s
                                })
                            }
                            toCompactRawBytes() {
                                return eQ(this.toCompactHex())
                            }
                            toCompactHex() {
                                return f(this.r) + f(this.s)
                            }
                        }

                        function p(e) {
                            let t = e instanceof Uint8Array,
                                r = "string" == typeof e,
                                n = (t || r) && e.length;
                            return t ? n === i || n === o : r ? n === 2 * i || n === 2 * o : e instanceof a
                        }
                        let g = t.bits2int || function(e) {
                                let r = e0(e),
                                    n = 8 * e.length - t.nBitLength;
                                return n > 0 ? r >> BigInt(n) : r
                            },
                            y = t.bits2int_modN || function(e) {
                                return s(g(e))
                            },
                            m = tr(t.nBitLength);

                        function b(e) {
                            if ("bigint" != typeof e) throw Error("bigint expected");
                            if (!(tI <= e && e < m)) throw Error(`bigint expected < 2^${t.nBitLength}`);
                            return e2(e, t.nByteLength)
                        }
                        let w = {
                                lowS: t.lowS,
                                prehash: !1
                            },
                            v = {
                                lowS: t.lowS,
                                prehash: !1
                            };
                        return a.BASE._setWindowSize(8), {
                            CURVE: t,
                            getPublicKey: function(e, t = !0) {
                                return a.fromPrivateKey(e).toRawBytes(t)
                            },
                            getSharedSecret: function(e, t, r = !0) {
                                if (p(e)) throw Error("first arg must be private key");
                                if (!p(t)) throw Error("second arg must be public key");
                                let n = a.fromHex(t);
                                return n.multiply(c(e)).toRawBytes(r)
                            },
                            sign: function(e, i, o = w) {
                                let {
                                    seed: l,
                                    k2sig: f
                                } = function(e, i, o = w) {
                                    if (["recovered", "canonical"].some(e => e in o)) throw Error("sign() legacy options not supported");
                                    let {
                                        hash: l,
                                        randomBytes: f
                                    } = t, {
                                        lowS: h,
                                        prehash: p,
                                        extraEntropy: m
                                    } = o;
                                    null == h && (h = !0), e = e6("msgHash", e), p && (e = e6("prehashed msgHash", l(e)));
                                    let v = y(e),
                                        E = c(i),
                                        x = [b(E), b(v)];
                                    if (null != m) {
                                        let e = !0 === m ? f(r.BYTES) : m;
                                        x.push(e6("extraEntropy", e, r.BYTES))
                                    }
                                    let A = e4(...x);
                                    return {
                                        seed: A,
                                        k2sig: function(e) {
                                            let t = g(e);
                                            if (!u(t)) return;
                                            let r = tm(t, n),
                                                i = a.BASE.multiply(t).toAffine(),
                                                o = s(i.x);
                                            if (o === tI) return;
                                            let c = s(r * s(v + o * E));
                                            if (c === tI) return;
                                            let l = (i.x === o ? 0 : 2) | Number(i.y & tC),
                                                f = c;
                                            if (h && c > n >> tC) f = c > n >> tC ? s(-c) : c, l ^= 1;
                                            return new d(o, f, l)
                                        }
                                    }
                                }(e, i, o), h = to(t.hash.outputLen, t.nByteLength, t.hmac);
                                return h(l, f)
                            },
                            verify: function(e, r, i, o = v) {
                                let c, l;
                                if (r = e6("msgHash", r), i = e6("publicKey", i), "strict" in o) throw Error("options.strict was renamed to lowS");
                                let {
                                    lowS: u,
                                    prehash: f
                                } = o;
                                try {
                                    if ("string" == typeof e || e instanceof Uint8Array) try {
                                        l = d.fromDER(e)
                                    } catch (t) {
                                        if (!(t instanceof tk.Err)) throw t;
                                        l = d.fromCompact(e)
                                    } else if ("object" == typeof e && "bigint" == typeof e.r && "bigint" == typeof e.s) {
                                        let {
                                            r: t,
                                            s: r
                                        } = e;
                                        l = new d(t, r)
                                    } else throw Error("PARSE");
                                    c = a.fromHex(i)
                                } catch (e) {
                                    if ("PARSE" === e.message) throw Error("signature must be Signature instance, Uint8Array or hex string");
                                    return !1
                                }
                                if (u && l.hasHighS()) return !1;
                                f && (r = t.hash(r));
                                let {
                                    r: h,
                                    s: p
                                } = l, g = y(r), m = tm(p, n), b = s(g * m), w = s(h * m), E = a.BASE.multiplyAndAddUnsafe(c, b, w)?.toAffine();
                                if (!E) return !1;
                                let x = s(E.x);
                                return x === h
                            },
                            ProjectivePoint: a,
                            Signature: d,
                            utils: {
                                isValidPrivateKey(e) {
                                    try {
                                        return c(e), !0
                                    } catch (e) {
                                        return !1
                                    }
                                },
                                normPrivateKeyToScalar: c,
                                randomPrivateKey: () => {
                                    let e = t.randomBytes(r.BYTES + 8),
                                        i = function(e, t, r = !1) {
                                            e = e6("privateHash", e);
                                            let n = e.length,
                                                i = tv(t).nByteLength + 8;
                                            if (i < 24 || n < i || n > 1024) throw Error(`hashToPrivateScalar: expected ${i}-1024 bytes of input, got ${n}`);
                                            let o = r ? e1(e) : e0(e);
                                            return tg(o, t - tl) + tl
                                        }(e, n);
                                    return e2(i, t.nByteLength)
                                },
                                precompute: (e = 8, t = a.BASE) => (t._setWindowSize(e), t.multiply(BigInt(3)), t)
                            }
                        }
                    })({
                        ...e,
                        hash: t,
                        hmac: (e, ...r) => tD(t, e, function(...e) {
                            if (!e.every(e => e instanceof Uint8Array)) throw Error("Uint8Array list expected");
                            if (1 === e.length) return e[0];
                            let t = e.reduce((e, t) => e + t.length, 0),
                                r = new Uint8Array(t);
                            for (let t = 0, n = 0; t < e.length; t++) {
                                let i = e[t];
                                r.set(i, n), n += i.length
                            }
                            return r
                        }(...r)),
                        randomBytes: K
                    });
                    return Object.freeze({
                        ...r(t),
                        create: r
                    })
                }({
                    a: BigInt(0),
                    b: BigInt(7),
                    Fp: tV,
                    n: tW,
                    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
                    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
                    h: BigInt(1),
                    lowS: !0,
                    endo: {
                        beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
                        splitScalar: e => {
                            let t = BigInt("0x3086d221a7d46bcde86c90e49284eb15"),
                                r = -tz * BigInt("0xe4437ed6010e88286f547fa90abfe4c3"),
                                n = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8"),
                                i = BigInt("0x100000000000000000000000000000000"),
                                o = tH(t * e, tW),
                                s = tH(-r * e, tW),
                                a = tg(e - o * t - s * n, tW),
                                c = tg(-o * r - s * t, tW),
                                l = a > i,
                                u = c > i;
                            if (l && (a = tW - a), u && (c = tW - c), a > i || c > i) throw Error("splitScalar: Endomorphism failed, k=" + e);
                            return {
                                k1neg: l,
                                k1: a,
                                k2neg: u,
                                k2: c
                            }
                        }
                    }
                }, ei);
            BigInt(0), tF.ProjectivePoint, tF.utils.randomPrivateKey;
            let t$ = function(e, t) {
                    let r = t.map(e => Array.from(e).reverse());
                    return (t, n) => {
                        let [i, o, s, a] = r.map(r => r.reduce((r, n) => e.add(e.mul(r, t), n)));
                        return {
                            x: t = e.div(i, o),
                            y: n = e.mul(n, e.div(s, a))
                        }
                    }
                }(tV, [
                    ["0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa8c7", "0x7d3d4c80bc321d5b9f315cea7fd44c5d595d2fc0bf63b92dfff1044f17c6581", "0x534c328d23f234e6e2a413deca25caece4506144037c40314ecbd0b53d9dd262", "0x8e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38e38daaaaa88c"],
                    ["0xd35771193d94918a9ca34ccbb7b640dd86cd409542f8487d9fe6b745781eb49b", "0xedadc6f64383dc1df7c4b2d51b54225406d36b641f5e41bbc52a56612a8c6d14", "0x0000000000000000000000000000000000000000000000000000000000000001"],
                    ["0x4bda12f684bda12f684bda12f684bda12f684bda12f684bda12f684b8e38e23c", "0xc75e0c32d5cb7c0fa9d0a54b12a0a6d5647ab046d686da6fdffc90fc201d71a3", "0x29a6194691f91a73715209ef6512e576722830a201be2018a765e85a9ecee931", "0x2f684bda12f684bda12f684bda12f684bda12f684bda12f684bda12f38e38d84"],
                    ["0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffff93b", "0x7a06534bb8bdb49fd5e9e6632722c2989467c1bfc8e8d978dfb425d2685c2573", "0x6484aa716545ca2cf3a70c3fa8fe337e0a3d21162f0d6299a7bf8192bfd2a76f", "0x0000000000000000000000000000000000000000000000000000000000000001"]
                ].map(e => e.map(e => BigInt(e)))),
                tG = function(e, t) {
                    if (tw(e), !e.isValid(t.A) || !e.isValid(t.B) || !e.isValid(t.Z)) throw Error("mapToCurveSimpleSWU: invalid opts");
                    let r = function(e, t) {
                        let r = e.ORDER,
                            n = tI;
                        for (let e = r - tC; e % tB === tI; e /= tB) n += tC;
                        let i = n,
                            o = (r - tC) / tB ** i,
                            s = (o - tC) / tB,
                            a = tB ** i - tC,
                            c = tB ** (i - tC),
                            l = e.pow(t, o),
                            u = e.pow(t, (o + tC) / tB),
                            f = (t, r) => {
                                let n = l,
                                    o = e.pow(r, a),
                                    f = e.sqr(o);
                                f = e.mul(f, r);
                                let h = e.mul(t, f);
                                h = e.pow(h, s), h = e.mul(h, o), o = e.mul(h, r), f = e.mul(h, t);
                                let d = e.mul(f, o);
                                h = e.pow(d, c);
                                let p = e.eql(h, e.ONE);
                                o = e.mul(f, u), h = e.mul(d, n), f = e.cmov(o, f, p), d = e.cmov(h, d, p);
                                for (let t = i; t > tC; t--) {
                                    let r = tB ** (t - tB),
                                        i = e.pow(d, r),
                                        s = e.eql(i, e.ONE);
                                    o = e.mul(f, n), n = e.mul(n, n), i = e.mul(d, n), f = e.cmov(o, f, s), d = e.cmov(i, d, s)
                                }
                                return {
                                    isValid: p,
                                    value: f
                                }
                            };
                        if (e.ORDER % tj === tO) {
                            let r = (e.ORDER - tO) / tj,
                                n = e.sqrt(e.neg(t));
                            f = (t, i) => {
                                let o = e.sqr(i),
                                    s = e.mul(t, i);
                                o = e.mul(o, s);
                                let a = e.pow(o, r);
                                a = e.mul(a, s);
                                let c = e.mul(a, n),
                                    l = e.mul(e.sqr(a), i),
                                    u = e.eql(l, t),
                                    f = e.cmov(c, a, u);
                                return {
                                    isValid: u,
                                    value: f
                                }
                            }
                        }
                        return f
                    }(e, t.Z);
                    if (!e.isOdd) throw Error("Fp.isOdd is not implemented!");
                    return n => {
                        let i, o, s, a, c, l, u, f;
                        i = e.sqr(n), i = e.mul(i, t.Z), o = e.sqr(i), o = e.add(o, i), s = e.add(o, e.ONE), s = e.mul(s, t.B), a = e.cmov(t.Z, e.neg(o), !e.eql(o, e.ZERO)), a = e.mul(a, t.A), o = e.sqr(s), l = e.sqr(a), c = e.mul(l, t.A), o = e.add(o, c), o = e.mul(o, s), l = e.mul(l, a), c = e.mul(l, t.B), o = e.add(o, c), u = e.mul(i, s);
                        let {
                            isValid: h,
                            value: d
                        } = r(o, l);
                        f = e.mul(i, n), f = e.mul(f, d), u = e.cmov(u, s, h), f = e.cmov(f, d, h);
                        let p = e.isOdd(n) === e.isOdd(f);
                        return f = e.cmov(e.neg(f), f, p), {
                            x: u = e.div(u, a),
                            y: f
                        }
                    }
                }(tV, {
                    A: BigInt("0x3f8731abdd661adca08a5558f0f5d272e953d363cb6f0e5d405447c01a444533"),
                    B: BigInt("1771"),
                    Z: tV.create(BigInt("-11"))
                }),
                {
                    hashToCurve: tq,
                    encodeToCurve: tK
                } = function(e, t, r) {
                    if ("function" != typeof t) throw Error("mapToCurve() must be defined");
                    return {
                        hashToCurve(n, i) {
                            let o = tL(n, 2, {
                                    ...r,
                                    DST: r.DST,
                                    ...i
                                }),
                                s = e.fromAffine(t(o[0])),
                                a = e.fromAffine(t(o[1])),
                                c = s.add(a).clearCofactor();
                            return c.assertValidity(), c
                        },
                        encodeToCurve(n, i) {
                            let o = tL(n, 1, {
                                    ...r,
                                    DST: r.encodeDST,
                                    ...i
                                }),
                                s = e.fromAffine(t(o[0])).clearCofactor();
                            return s.assertValidity(), s
                        }
                    }
                }(tF.ProjectivePoint, e => {
                    let {
                        x: t,
                        y: r
                    } = tG(tV.create(e[0]));
                    return t$(t, r)
                }, {
                    DST: "secp256k1_XMD:SHA-256_SSWU_RO_",
                    encodeDST: "secp256k1_XMD:SHA-256_SSWU_NU_",
                    p: tV.ORDER,
                    m: 1,
                    k: 128,
                    expand: "xmd",
                    hash: ei
                });
            var tY = r(7286);
            let tJ = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]),
                tX = Uint8Array.from({
                    length: 16
                }, (e, t) => t),
                tQ = tX.map(e => (9 * e + 5) % 16),
                t0 = [tX],
                t1 = [tQ];
            for (let e = 0; e < 4; e++)
                for (let t of [t0, t1]) t.push(t[e].map(e => tJ[e]));
            let t2 = [
                    [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
                    [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
                    [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
                    [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
                    [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]
                ].map(e => new Uint8Array(e)),
                t5 = t0.map((e, t) => e.map(e => t2[t][e])),
                t3 = t1.map((e, t) => e.map(e => t2[t][e])),
                t6 = new Uint32Array([0, 1518500249, 1859775393, 2400959708, 2840853838]),
                t4 = new Uint32Array([1352829926, 1548603684, 1836072691, 2053994217, 0]),
                t8 = (e, t) => e << t | e >>> 32 - t;

            function t9(e, t, r, n) {
                return 0 === e ? t ^ r ^ n : 1 === e ? t & r | ~t & n : 2 === e ? (t | ~r) ^ n : 3 === e ? t & n | r & ~n : t ^ (r | ~n)
            }
            let t7 = new Uint32Array(16);
            class re extends Y {
                constructor() {
                    super(64, 20, 8, !0), this.h0 = 1732584193, this.h1 = -271733879, this.h2 = -1732584194, this.h3 = 271733878, this.h4 = -1009589776
                }
                get() {
                    let {
                        h0: e,
                        h1: t,
                        h2: r,
                        h3: n,
                        h4: i
                    } = this;
                    return [e, t, r, n, i]
                }
                set(e, t, r, n, i) {
                    this.h0 = 0 | e, this.h1 = 0 | t, this.h2 = 0 | r, this.h3 = 0 | n, this.h4 = 0 | i
                }
                process(e, t) {
                    for (let r = 0; r < 16; r++, t += 4) t7[r] = e.getUint32(t, !0);
                    let r = 0 | this.h0,
                        n = r,
                        i = 0 | this.h1,
                        o = i,
                        s = 0 | this.h2,
                        a = s,
                        c = 0 | this.h3,
                        l = c,
                        u = 0 | this.h4,
                        f = u;
                    for (let e = 0; e < 5; e++) {
                        let t = 4 - e,
                            h = t6[e],
                            d = t4[e],
                            p = t0[e],
                            g = t1[e],
                            y = t5[e],
                            m = t3[e];
                        for (let t = 0; t < 16; t++) {
                            let n = t8(r + t9(e, i, s, c) + t7[p[t]] + h, y[t]) + u | 0;
                            r = u, u = c, c = 0 | t8(s, 10), s = i, i = n
                        }
                        for (let e = 0; e < 16; e++) {
                            let r = t8(n + t9(t, o, a, l) + t7[g[e]] + d, m[e]) + f | 0;
                            n = f, f = l, l = 0 | t8(a, 10), a = o, o = r
                        }
                    }
                    this.set(this.h1 + s + l | 0, this.h2 + c + f | 0, this.h3 + u + n | 0, this.h4 + r + o | 0, this.h0 + i + a | 0)
                }
                roundClean() {
                    t7.fill(0)
                }
                destroy() {
                    this.destroyed = !0, this.buffer.fill(0), this.set(0, 0, 0, 0, 0)
                }
            }
            q(() => new re);
            let [rt, rr] = ef.split(["0x428a2f98d728ae22", "0x7137449123ef65cd", "0xb5c0fbcfec4d3b2f", "0xe9b5dba58189dbbc", "0x3956c25bf348b538", "0x59f111f1b605d019", "0x923f82a4af194f9b", "0xab1c5ed5da6d8118", "0xd807aa98a3030242", "0x12835b0145706fbe", "0x243185be4ee4b28c", "0x550c7dc3d5ffb4e2", "0x72be5d74f27b896f", "0x80deb1fe3b1696b1", "0x9bdc06a725c71235", "0xc19bf174cf692694", "0xe49b69c19ef14ad2", "0xefbe4786384f25e3", "0x0fc19dc68b8cd5b5", "0x240ca1cc77ac9c65", "0x2de92c6f592b0275", "0x4a7484aa6ea6e483", "0x5cb0a9dcbd41fbd4", "0x76f988da831153b5", "0x983e5152ee66dfab", "0xa831c66d2db43210", "0xb00327c898fb213f", "0xbf597fc7beef0ee4", "0xc6e00bf33da88fc2", "0xd5a79147930aa725", "0x06ca6351e003826f", "0x142929670a0e6e70", "0x27b70a8546d22ffc", "0x2e1b21385c26c926", "0x4d2c6dfc5ac42aed", "0x53380d139d95b3df", "0x650a73548baf63de", "0x766a0abb3c77b2a8", "0x81c2c92e47edaee6", "0x92722c851482353b", "0xa2bfe8a14cf10364", "0xa81a664bbc423001", "0xc24b8b70d0f89791", "0xc76c51a30654be30", "0xd192e819d6ef5218", "0xd69906245565a910", "0xf40e35855771202a", "0x106aa07032bbd1b8", "0x19a4c116b8d2d0c8", "0x1e376c085141ab53", "0x2748774cdf8eeb99", "0x34b0bcb5e19b48a8", "0x391c0cb3c5c95a63", "0x4ed8aa4ae3418acb", "0x5b9cca4f7763e373", "0x682e6ff3d6b2b8a3", "0x748f82ee5defb2fc", "0x78a5636f43172f60", "0x84c87814a1f0ab72", "0x8cc702081a6439ec", "0x90befffa23631e28", "0xa4506cebde82bde9", "0xbef9a3f7b2c67915", "0xc67178f2e372532b", "0xca273eceea26619c", "0xd186b8c721c0c207", "0xeada7dd6cde0eb1e", "0xf57d4f7fee6ed178", "0x06f067aa72176fba", "0x0a637dc5a2c898a6", "0x113f9804bef90dae", "0x1b710b35131c471b", "0x28db77f523047d84", "0x32caab7b40c72493", "0x3c9ebe0a15c9bebc", "0x431d67c49c100d4c", "0x4cc5d4becb3e42b6", "0x597f299cfc657e2a", "0x5fcb6fab3ad6faec", "0x6c44198c4a475817"].map(e => BigInt(e))), rn = new Uint32Array(80), ri = new Uint32Array(80);
            class ro extends Y {
                constructor() {
                    super(128, 64, 16, !1), this.Ah = 1779033703, this.Al = -205731576, this.Bh = -1150833019, this.Bl = -2067093701, this.Ch = 1013904242, this.Cl = -23791573, this.Dh = -1521486534, this.Dl = 1595750129, this.Eh = 1359893119, this.El = -1377402159, this.Fh = -1694144372, this.Fl = 725511199, this.Gh = 528734635, this.Gl = -79577749, this.Hh = 1541459225, this.Hl = 327033209
                }
                get() {
                    let {
                        Ah: e,
                        Al: t,
                        Bh: r,
                        Bl: n,
                        Ch: i,
                        Cl: o,
                        Dh: s,
                        Dl: a,
                        Eh: c,
                        El: l,
                        Fh: u,
                        Fl: f,
                        Gh: h,
                        Gl: d,
                        Hh: p,
                        Hl: g
                    } = this;
                    return [e, t, r, n, i, o, s, a, c, l, u, f, h, d, p, g]
                }
                set(e, t, r, n, i, o, s, a, c, l, u, f, h, d, p, g) {
                    this.Ah = 0 | e, this.Al = 0 | t, this.Bh = 0 | r, this.Bl = 0 | n, this.Ch = 0 | i, this.Cl = 0 | o, this.Dh = 0 | s, this.Dl = 0 | a, this.Eh = 0 | c, this.El = 0 | l, this.Fh = 0 | u, this.Fl = 0 | f, this.Gh = 0 | h, this.Gl = 0 | d, this.Hh = 0 | p, this.Hl = 0 | g
                }
                process(e, t) {
                    for (let r = 0; r < 16; r++, t += 4) rn[r] = e.getUint32(t), ri[r] = e.getUint32(t += 4);
                    for (let e = 16; e < 80; e++) {
                        let t = 0 | rn[e - 15],
                            r = 0 | ri[e - 15],
                            n = ef.rotrSH(t, r, 1) ^ ef.rotrSH(t, r, 8) ^ ef.shrSH(t, r, 7),
                            i = ef.rotrSL(t, r, 1) ^ ef.rotrSL(t, r, 8) ^ ef.shrSL(t, r, 7),
                            o = 0 | rn[e - 2],
                            s = 0 | ri[e - 2],
                            a = ef.rotrSH(o, s, 19) ^ ef.rotrBH(o, s, 61) ^ ef.shrSH(o, s, 6),
                            c = ef.rotrSL(o, s, 19) ^ ef.rotrBL(o, s, 61) ^ ef.shrSL(o, s, 6),
                            l = ef.add4L(i, c, ri[e - 7], ri[e - 16]),
                            u = ef.add4H(l, n, a, rn[e - 7], rn[e - 16]);
                        rn[e] = 0 | u, ri[e] = 0 | l
                    }
                    let {
                        Ah: r,
                        Al: n,
                        Bh: i,
                        Bl: o,
                        Ch: s,
                        Cl: a,
                        Dh: c,
                        Dl: l,
                        Eh: u,
                        El: f,
                        Fh: h,
                        Fl: d,
                        Gh: p,
                        Gl: g,
                        Hh: y,
                        Hl: m
                    } = this;
                    for (let e = 0; e < 80; e++) {
                        let t = ef.rotrSH(u, f, 14) ^ ef.rotrSH(u, f, 18) ^ ef.rotrBH(u, f, 41),
                            b = ef.rotrSL(u, f, 14) ^ ef.rotrSL(u, f, 18) ^ ef.rotrBL(u, f, 41),
                            w = u & h ^ ~u & p,
                            v = f & d ^ ~f & g,
                            E = ef.add5L(m, b, v, rr[e], ri[e]),
                            x = ef.add5H(E, y, t, w, rt[e], rn[e]),
                            A = 0 | E,
                            S = ef.rotrSH(r, n, 28) ^ ef.rotrBH(r, n, 34) ^ ef.rotrBH(r, n, 39),
                            T = ef.rotrSL(r, n, 28) ^ ef.rotrBL(r, n, 34) ^ ef.rotrBL(r, n, 39),
                            k = r & i ^ r & s ^ i & s,
                            I = n & o ^ n & a ^ o & a;
                        y = 0 | p, m = 0 | g, p = 0 | h, g = 0 | d, h = 0 | u, d = 0 | f, ({
                            h: u,
                            l: f
                        } = ef.add(0 | c, 0 | l, 0 | x, 0 | A)), c = 0 | s, l = 0 | a, s = 0 | i, a = 0 | o, i = 0 | r, o = 0 | n;
                        let C = ef.add3L(A, T, I);
                        r = ef.add3H(C, x, S, k), n = 0 | C
                    }({
                        h: r,
                        l: n
                    } = ef.add(0 | this.Ah, 0 | this.Al, 0 | r, 0 | n)), ({
                        h: i,
                        l: o
                    } = ef.add(0 | this.Bh, 0 | this.Bl, 0 | i, 0 | o)), ({
                        h: s,
                        l: a
                    } = ef.add(0 | this.Ch, 0 | this.Cl, 0 | s, 0 | a)), ({
                        h: c,
                        l: l
                    } = ef.add(0 | this.Dh, 0 | this.Dl, 0 | c, 0 | l)), ({
                        h: u,
                        l: f
                    } = ef.add(0 | this.Eh, 0 | this.El, 0 | u, 0 | f)), ({
                        h: h,
                        l: d
                    } = ef.add(0 | this.Fh, 0 | this.Fl, 0 | h, 0 | d)), ({
                        h: p,
                        l: g
                    } = ef.add(0 | this.Gh, 0 | this.Gl, 0 | p, 0 | g)), ({
                        h: y,
                        l: m
                    } = ef.add(0 | this.Hh, 0 | this.Hl, 0 | y, 0 | m)), this.set(r, n, i, o, s, a, c, l, u, f, h, d, p, g, y, m)
                }
                roundClean() {
                    rn.fill(0), ri.fill(0)
                }
                destroy() {
                    this.buffer.fill(0), this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
                }
            }
            class rs extends ro {
                constructor() {
                    super(), this.Ah = -1942145080, this.Al = 424955298, this.Bh = 1944164710, this.Bl = -1982016298, this.Ch = 502970286, this.Cl = 855612546, this.Dh = 1738396948, this.Dl = 1479516111, this.Eh = 258812777, this.El = 2077511080, this.Fh = 2011393907, this.Fl = 79989058, this.Gh = 1067287976, this.Gl = 1780299464, this.Hh = 286451373, this.Hl = -1848208735, this.outputLen = 28
                }
            }
            class ra extends ro {
                constructor() {
                    super(), this.Ah = 573645204, this.Al = -64227540, this.Bh = -1621794909, this.Bl = -934517566, this.Ch = 596883563, this.Cl = 1867755857, this.Dh = -1774684391, this.Dl = 1497426621, this.Eh = -1775747358, this.El = -1467023389, this.Fh = -1101128155, this.Fl = 1401305490, this.Gh = 721525244, this.Gl = 746961066, this.Hh = 246885852, this.Hl = -2117784414, this.outputLen = 32
                }
            }
            class rc extends ro {
                constructor() {
                    super(), this.Ah = -876896931, this.Al = -1056596264, this.Bh = 1654270250, this.Bl = 914150663, this.Ch = -1856437926, this.Cl = 812702999, this.Dh = 355462360, this.Dl = -150054599, this.Eh = 1731405415, this.El = -4191439, this.Fh = -1900787065, this.Fl = 1750603025, this.Gh = -619958771, this.Gl = 1694076839, this.Hh = 1203062813, this.Hl = -1090891868, this.outputLen = 48
                }
            }
            let rl = q(() => new ro); /*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
            function ru(e) {
                if (!Number.isSafeInteger(e)) throw Error(`Wrong integer: ${e}`)
            }

            function rf(...e) {
                let t = (e, t) => r => e(t(r)),
                    r = Array.from(e).reverse().reduce((e, r) => e ? t(e, r.encode) : r.encode, void 0),
                    n = e.reduce((e, r) => e ? t(e, r.decode) : r.decode, void 0);
                return {
                    encode: r,
                    decode: n
                }
            }

            function rh(e) {
                return {
                    encode: t => {
                        if (!Array.isArray(t) || t.length && "number" != typeof t[0]) throw Error("alphabet.encode input should be an array of numbers");
                        return t.map(t => {
                            if (ru(t), t < 0 || t >= e.length) throw Error(`Digit index outside alphabet: ${t} (alphabet: ${e.length})`);
                            return e[t]
                        })
                    },
                    decode: t => {
                        if (!Array.isArray(t) || t.length && "string" != typeof t[0]) throw Error("alphabet.decode input should be array of strings");
                        return t.map(t => {
                            if ("string" != typeof t) throw Error(`alphabet.decode: not string element=${t}`);
                            let r = e.indexOf(t);
                            if (-1 === r) throw Error(`Unknown letter: "${t}". Allowed: ${e}`);
                            return r
                        })
                    }
                }
            }

            function rd(e = "") {
                if ("string" != typeof e) throw Error("join separator should be string");
                return {
                    encode: t => {
                        if (!Array.isArray(t) || t.length && "string" != typeof t[0]) throw Error("join.encode input should be array of strings");
                        for (let e of t)
                            if ("string" != typeof e) throw Error(`join.encode: non-string input=${e}`);
                        return t.join(e)
                    },
                    decode: t => {
                        if ("string" != typeof t) throw Error("join.decode input should be string");
                        return t.split(e)
                    }
                }
            }

            function rp(e, t = "=") {
                if (ru(e), "string" != typeof t) throw Error("padding chr should be string");
                return {
                    encode(r) {
                        if (!Array.isArray(r) || r.length && "string" != typeof r[0]) throw Error("padding.encode input should be array of strings");
                        for (let e of r)
                            if ("string" != typeof e) throw Error(`padding.encode: non-string input=${e}`);
                        for (; r.length * e % 8;) r.push(t);
                        return r
                    },
                    decode(r) {
                        if (!Array.isArray(r) || r.length && "string" != typeof r[0]) throw Error("padding.encode input should be array of strings");
                        for (let e of r)
                            if ("string" != typeof e) throw Error(`padding.decode: non-string input=${e}`);
                        let n = r.length;
                        if (n * e % 8) throw Error("Invalid padding: string should have whole number of bytes");
                        for (; n > 0 && r[n - 1] === t; n--)
                            if (!((n - 1) * e % 8)) throw Error("Invalid padding: string has too much padding");
                        return r.slice(0, n)
                    }
                }
            }

            function rg(e) {
                if ("function" != typeof e) throw Error("normalize fn should be function");
                return {
                    encode: e => e,
                    decode: t => e(t)
                }
            }

            function ry(e, t, r) {
                if (t < 2) throw Error(`convertRadix: wrong from=${t}, base cannot be less than 2`);
                if (r < 2) throw Error(`convertRadix: wrong to=${r}, base cannot be less than 2`);
                if (!Array.isArray(e)) throw Error("convertRadix: data should be array");
                if (!e.length) return [];
                let n = 0,
                    i = [],
                    o = Array.from(e);
                for (o.forEach(e => {
                        if (ru(e), e < 0 || e >= t) throw Error(`Wrong integer: ${e}`)
                    });;) {
                    let e = 0,
                        s = !0;
                    for (let i = n; i < o.length; i++) {
                        let a = o[i],
                            c = t * e + a;
                        if (!Number.isSafeInteger(c) || t * e / t !== e || c - a != t * e || (e = c % r, o[i] = Math.floor(c / r), !Number.isSafeInteger(o[i]) || o[i] * r + e !== c)) throw Error("convertRadix: carry overflow");
                        s && (o[i] ? s = !1 : n = i)
                    }
                    if (i.push(e), s) break
                }
                for (let t = 0; t < e.length - 1 && 0 === e[t]; t++) i.push(0);
                return i.reverse()
            }
            q(() => new rs), q(() => new ra), q(() => new rc);
            let rm = (e, t) => t ? rm(t, e % t) : e,
                rb = (e, t) => e + (t - rm(e, t));

            function rw(e, t, r, n) {
                if (!Array.isArray(e)) throw Error("convertRadix2: data should be array");
                if (t <= 0 || t > 32) throw Error(`convertRadix2: wrong from=${t}`);
                if (r <= 0 || r > 32) throw Error(`convertRadix2: wrong to=${r}`);
                if (rb(t, r) > 32) throw Error(`convertRadix2: carry overflow from=${t} to=${r} carryBits=${rb(t,r)}`);
                let i = 0,
                    o = 0,
                    s = 2 ** r - 1,
                    a = [];
                for (let n of e) {
                    if (ru(n), n >= 2 ** t) throw Error(`convertRadix2: invalid data word=${n} from=${t}`);
                    if (i = i << t | n, o + t > 32) throw Error(`convertRadix2: carry overflow pos=${o} from=${t}`);
                    for (o += t; o >= r; o -= r) a.push((i >> o - r & s) >>> 0);
                    i &= 2 ** o - 1
                }
                if (i = i << r - o & s, !n && o >= t) throw Error("Excess padding");
                if (!n && i) throw Error(`Non-zero padding: ${i}`);
                return n && o > 0 && a.push(i >>> 0), a
            }

            function rv(e, t = !1) {
                if (ru(e), e <= 0 || e > 32) throw Error("radix2: bits should be in (0..32]");
                if (rb(8, e) > 32 || rb(e, 8) > 32) throw Error("radix2: carry overflow");
                return {
                    encode: r => {
                        if (!(r instanceof Uint8Array)) throw Error("radix2.encode input should be Uint8Array");
                        return rw(Array.from(r), 8, e, !t)
                    },
                    decode: r => {
                        if (!Array.isArray(r) || r.length && "number" != typeof r[0]) throw Error("radix2.decode input should be array of strings");
                        return Uint8Array.from(rw(r, e, 8, t))
                    }
                }
            }

            function rE(e) {
                if ("function" != typeof e) throw Error("unsafeWrapper fn should be function");
                return function(...t) {
                    try {
                        return e.apply(null, t)
                    } catch (e) {}
                }
            }
            rf(rv(4), rh("0123456789ABCDEF"), rd("")), rf(rv(5), rh("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"), rp(5), rd("")), rf(rv(5), rh("0123456789ABCDEFGHIJKLMNOPQRSTUV"), rp(5), rd("")), rf(rv(5), rh("0123456789ABCDEFGHJKMNPQRSTVWXYZ"), rd(""), rg(e => e.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1"))), rf(rv(6), rh("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), rp(6), rd("")), rf(rv(6), rh("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"), rp(6), rd(""));
            let rx = e => rf((ru(58), {
                    encode: e => {
                        if (!(e instanceof Uint8Array)) throw Error("radix.encode input should be Uint8Array");
                        return ry(Array.from(e), 256, 58)
                    },
                    decode: e => {
                        if (!Array.isArray(e) || e.length && "number" != typeof e[0]) throw Error("radix.decode input should be array of strings");
                        return Uint8Array.from(ry(e, 58, 256))
                    }
                }), rh(e), rd("")),
                rA = rx("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");
            rx("123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"), rx("rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz");
            let rS = rf(rh("qpzry9x8gf2tvdw0s3jn54khce6mua7l"), rd("")),
                rT = [996825010, 642813549, 513874426, 1027748829, 705979059];

            function rk(e) {
                let t = e >> 25,
                    r = (33554431 & e) << 5;
                for (let e = 0; e < rT.length; e++)(t >> e & 1) == 1 && (r ^= rT[e]);
                return r
            }

            function rI(e, t, r = 1) {
                let n = e.length,
                    i = 1;
                for (let t = 0; t < n; t++) {
                    let r = e.charCodeAt(t);
                    if (r < 33 || r > 126) throw Error(`Invalid prefix (${e})`);
                    i = rk(i) ^ r >> 5
                }
                i = rk(i);
                for (let t = 0; t < n; t++) i = rk(i) ^ 31 & e.charCodeAt(t);
                for (let e of t) i = rk(i) ^ e;
                for (let e = 0; e < 6; e++) i = rk(i);
                return i ^= r, rS.encode(rw([i % 1073741824], 30, 5, !1))
            }

            function rC(e) {
                let t = "bech32" === e ? 1 : 734539939,
                    r = rv(5),
                    n = r.decode,
                    i = r.encode,
                    o = rE(n);

                function s(e, r = 90) {
                    if ("string" != typeof e) throw Error(`bech32.decode input should be string, not ${typeof e}`);
                    if (e.length < 8 || !1 !== r && e.length > r) throw TypeError(`Wrong string length: ${e.length} (${e}). Expected (8..${r})`);
                    let n = e.toLowerCase();
                    if (e !== n && e !== e.toUpperCase()) throw Error("String must be lowercase or uppercase");
                    e = n;
                    let i = e.lastIndexOf("1");
                    if (0 === i || -1 === i) throw Error('Letter "1" must be present between prefix and data only');
                    let o = e.slice(0, i),
                        s = e.slice(i + 1);
                    if (s.length < 6) throw Error("Data must be at least 6 characters long");
                    let a = rS.decode(s).slice(0, -6),
                        c = rI(o, a, t);
                    if (!s.endsWith(c)) throw Error(`Invalid checksum in ${e}: expected "${c}"`);
                    return {
                        prefix: o,
                        words: a
                    }
                }
                let a = rE(s);
                return {
                    encode: function(e, r, n = 90) {
                        if ("string" != typeof e) throw Error(`bech32.encode prefix should be string, not ${typeof e}`);
                        if (!Array.isArray(r) || r.length && "number" != typeof r[0]) throw Error(`bech32.encode words should be array of numbers, not ${typeof r}`);
                        let i = e.length + 7 + r.length;
                        if (!1 !== n && i > n) throw TypeError(`Length ${i} exceeds limit ${n}`);
                        return e = e.toLowerCase(), `${e}1${rS.encode(r)}${rI(e,r,t)}`
                    },
                    decode: s,
                    decodeToBytes: function(e) {
                        let {
                            prefix: t,
                            words: r
                        } = s(e, !1);
                        return {
                            prefix: t,
                            words: r,
                            bytes: n(r)
                        }
                    },
                    decodeUnsafe: a,
                    fromWords: n,
                    fromWordsUnsafe: o,
                    toWords: i
                }
            }
            rC("bech32"), rC("bech32m"), rf(rv(4), rh("0123456789abcdef"), rd(""), rg(e => {
                if ("string" != typeof e || e.length % 2) throw TypeError(`hex.decode: expected string, got ${typeof e} with length ${e.length}`);
                return e.toLowerCase()
            })), tF.ProjectivePoint, rf(function(e, t) {
                if (ru(e), "function" != typeof t) throw Error("checksum fn should be function");
                return {
                    encode(r) {
                        if (!(r instanceof Uint8Array)) throw Error("checksum.encode: input should be Uint8Array");
                        let n = t(r).slice(0, e),
                            i = new Uint8Array(r.length + e);
                        return i.set(r), i.set(n, r.length), i
                    },
                    decode(r) {
                        if (!(r instanceof Uint8Array)) throw Error("checksum.decode: input should be Uint8Array");
                        let n = r.slice(0, -e),
                            i = t(n).slice(0, e),
                            o = r.slice(-e);
                        for (let t = 0; t < e; t++)
                            if (i[t] !== o[t]) throw Error("Invalid checksum");
                        return n
                    }
                }
            }(4, e => ei(ei(e))), rA), F("Bitcoin seed");
            var rB = r(1198),
                rO = r(3937),
                rj = r(1990),
                rM = (e, t, r) => {
                    if (!t.has(e)) throw TypeError("Cannot " + r)
                },
                r_ = (e, t, r) => (rM(e, t, "read from private field"), r ? r.call(e) : t.get(e)),
                rU = (e, t, r) => {
                    if (t.has(e)) throw TypeError("Cannot add the same private member more than once");
                    t instanceof WeakSet ? t.add(e) : t.set(e, r)
                },
                rN = (e, t, r, n) => (rM(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r),
                rL = (e, t, r) => (rM(e, t, "access private method"), r),
                rR = eZ(),
                rD = eZ(),
                rP = eZ(),
                rW = eZ(),
                rz = eZ(),
                rZ = eZ(),
                rH = eV([eP({
                    AddressOwner: rz
                }), eP({
                    ObjectOwner: rz
                }), eP({
                    Shared: eP({
                        initial_shared_version: eD()
                    })
                }), eN("Immutable")]),
                rV = eO("SuiJsonValue", () => !0);

            function rF(e) {
                try {
                    let t = O(e);
                    return 32 === t.length
                } catch (e) {
                    return !1
                }
            }

            function r$(e) {
                return /^(0x|0X)?[a-fA-F0-9]+$/.test(e) && e.length % 2 == 0 && 32 == (/^(0x|0X)/.test(e) ? (e.length - 2) / 2 : e.length / 2)
            }

            function rG(e, t = !1) {
                let r = e.toLowerCase();
                return !t && r.startsWith("0x") && (r = r.slice(2)), `0x${r.padStart(64,"0")}`
            }

            function rq(e, t = !1) {
                return rG(e, t)
            }
            eV([eZ(), eN("package")]);
            var rK = eP({
                    digest: rR,
                    objectId: eZ(),
                    version: eV([eD(), eZ()])
                }),
                rY = eP({
                    payment: eM(rK),
                    owner: eZ(),
                    price: eZ(),
                    budget: eZ()
                }),
                rJ = eB(rK, eP({
                    type: eZ(),
                    owner: rH,
                    previousTransaction: rR
                })),
                rX = ez(eZ(), ej()),
                rQ = ez(eZ(), eZ()),
                r0 = eP({
                    type: eZ(),
                    fields: rX,
                    hasPublicTransfer: e_()
                }),
                r1 = eP({
                    disassembled: rQ
                }),
                r2 = eV([eB(r0, eP({
                    dataType: eN("moveObject")
                })), eB(r1, eP({
                    dataType: eN("package")
                }))]);
            eP({
                type: eZ(),
                hasPublicTransfer: e_(),
                version: rZ,
                bcsBytes: eM(eD())
            });
            var r5 = eP({
                    id: rW,
                    moduleMap: ez(eZ(), eZ())
                }),
                r3 = eV([eB(r0, eP({
                    dataType: eN("moveObject")
                })), eB(r5, eP({
                    dataType: eN("package")
                }))]);
            BigInt(1e9);
            var r6 = eZ(),
                r4 = eP({
                    code: eZ(),
                    error: eW(eZ()),
                    object_id: eW(rW),
                    version: eW(rZ),
                    digest: eW(r6)
                }),
                r8 = eV([eP({
                    data: eR(ez(eZ(), eZ())),
                    error: eR(r4)
                }), eW(ez(eZ(), eZ()))]),
                r9 = eP({
                    objectId: rW,
                    version: rZ,
                    digest: r6,
                    type: eW(eZ()),
                    content: eW(r2),
                    bcs: eW(r3),
                    owner: eW(rH),
                    previousTransaction: eW(rR),
                    storageRebate: eW(eZ()),
                    display: eW(r8)
                });
            eP({
                showType: eW(e_()),
                showContent: eW(e_()),
                showBcs: eW(e_()),
                showOwner: eW(e_()),
                showPreviousTransaction: eW(e_()),
                showStorageRebate: eW(e_()),
                showDisplay: eW(e_())
            }), eV([eN("Exists"), eN("notExists"), eN("Deleted")]), eM(rJ);
            var r7 = eP({
                data: eW(r9),
                error: eW(r4)
            });

            function ne(e) {
                if ("reference" in e) return e.reference;
                let t = e.data;
                return t ? {
                    objectId: t.objectId,
                    version: t.version,
                    digest: t.digest
                } : function(e) {
                    if (e.error && "object_id" in e.error && "version" in e.error && "digest" in e.error) {
                        let t = e.error;
                        return {
                            objectId: t.object_id,
                            version: t.version,
                            digest: t.digest
                        }
                    }
                }(e)
            }

            function nt(e) {
                return "fields" in e ? e.fields : nr(e)?.fields
            }

            function nr(e) {
                let t = "data" in e ? e.data : e;
                if (t && void 0 !== t.content && "moveObject" === t.content.dataType) return t.content
            }
            var nn = eP({
                    objectId: rW,
                    atCheckpoint: eW(eD())
                }),
                ni = eP({
                    data: eM(r7),
                    nextCursor: eV([eR(rW), eR(nn)]),
                    hasNextPage: e_()
                }),
                no = eV([eP({
                    details: r9,
                    status: eN("VersionFound")
                }), eP({
                    details: rW,
                    status: eN("ObjectNotExists")
                }), eP({
                    details: rK,
                    status: eN("ObjectDeleted")
                }), eP({
                    details: eH([rW, eD()]),
                    status: eN("VersionNotFound")
                }), eP({
                    details: eP({
                        asked_version: eD(),
                        latest_version: eD(),
                        object_id: rW
                    }),
                    status: eN("VersionTooHigh")
                })]),
                ns = eP({
                    txDigest: rR,
                    eventSeq: rZ
                }),
                na = eP({
                    id: ns,
                    packageId: rW,
                    transactionModule: eZ(),
                    sender: rz,
                    type: eZ(),
                    parsedJson: eW(ez(eZ(), ej())),
                    bcs: eW(eZ()),
                    timestampMs: eW(eZ())
                }),
                nc = eP({
                    data: eM(na),
                    nextCursor: eR(ns),
                    hasNextPage: e_()
                }),
                nl = eP({
                    subscription: eD(),
                    result: na
                }),
                nu = eZ(),
                nf = eP({
                    epoch: nu,
                    storage_charge: eZ(),
                    computation_charge: eZ(),
                    storage_rebate: eZ(),
                    epoch_start_timestamp_ms: eW(eZ())
                }),
                nh = eP({
                    epoch: nu,
                    round: eZ(),
                    commit_timestamp_ms: eZ()
                }),
                nd = eP({
                    objects: eM(rW)
                }),
                np = eV([eN("GasCoin"), eP({
                    Input: eD()
                }), eP({
                    Result: eD()
                }), eP({
                    NestedResult: eH([eD(), eD()])
                })]),
                ng = eP({
                    arguments: eW(eM(np)),
                    type_arguments: eW(eM(eZ())),
                    package: rW,
                    module: eZ(),
                    function: eZ()
                }),
                ny = eV([eP({
                    MoveCall: ng
                }), eP({
                    TransferObjects: eH([eM(np), np])
                }), eP({
                    SplitCoins: eH([np, eM(np)])
                }), eP({
                    MergeCoins: eH([np, eM(np)])
                }), eP({
                    Publish: eV([eH([r1, eM(rW)]), eM(rW)])
                }), eP({
                    Upgrade: eV([eH([r1, eM(rW), rW, np]), eH([eM(rW), rW, np])])
                }), eP({
                    MakeMoveVec: eH([eR(eZ()), eM(np)])
                })]),
                nm = eV([eP({
                    type: eN("pure"),
                    valueType: eW(eZ()),
                    value: rV
                }), eP({
                    type: eN("object"),
                    objectType: eN("immOrOwnedObject"),
                    objectId: rW,
                    version: rZ,
                    digest: r6
                }), eP({
                    type: eN("object"),
                    objectType: eN("sharedObject"),
                    objectId: rW,
                    initialSharedVersion: rZ,
                    mutable: e_()
                })]),
                nb = eP({
                    transactions: eM(ny),
                    inputs: eM(nm)
                }),
                nw = eV([eB(nf, eP({
                    kind: eN("ChangeEpoch")
                })), eB(nh, eP({
                    kind: eN("ConsensusCommitPrologue")
                })), eB(nd, eP({
                    kind: eN("Genesis")
                })), eB(nb, eP({
                    kind: eN("ProgrammableTransaction")
                }))]),
                nv = eP({
                    messageVersion: eN("v1"),
                    transaction: nw,
                    sender: rz,
                    gasData: rY
                }),
                nE = eZ();
            eP({
                epoch: nu,
                signature: eV([nE, eM(nE)]),
                signers_map: eM(eD())
            });
            var nx = eP({
                    computationCost: eZ(),
                    storageCost: eZ(),
                    storageRebate: eZ(),
                    nonRefundableStorageFee: eZ()
                }),
                nA = eP({
                    status: eV([eN("success"), eN("failure")]),
                    error: eW(eZ())
                }),
                nS = eP({
                    owner: rH,
                    reference: rK
                }),
                nT = eP({
                    objectId: rW,
                    sequenceNumber: rZ
                }),
                nk = eP({
                    messageVersion: eN("v1"),
                    status: nA,
                    executedEpoch: nu,
                    modifiedAtVersions: eW(eM(nT)),
                    gasUsed: nx,
                    sharedObjects: eW(eM(rK)),
                    transactionDigest: rR,
                    created: eW(eM(nS)),
                    mutated: eW(eM(nS)),
                    unwrapped: eW(eM(nS)),
                    deleted: eW(eM(rK)),
                    unwrapped_then_deleted: eW(eM(rK)),
                    wrapped: eW(eM(rK)),
                    gasObject: nS,
                    eventsDigest: eW(rP),
                    dependencies: eW(eM(rR))
                }),
                nI = eM(na),
                nC = eH([eM(eD()), eZ()]),
                nB = eH([np, eM(eD()), eZ()]),
                nO = eP({
                    mutableReferenceOutputs: eW(eM(nB)),
                    returnValues: eW(eM(nC))
                }),
                nj = eP({
                    effects: nk,
                    events: nI,
                    results: eW(eM(nO)),
                    error: eW(eZ())
                }),
                nM = eZ(),
                n_ = eP({
                    data: nv,
                    txSignatures: eM(eZ())
                }),
                nU = eV([eP({
                    type: eN("published"),
                    packageId: rW,
                    version: rZ,
                    digest: r6,
                    modules: eM(eZ())
                }), eP({
                    type: eN("transferred"),
                    sender: rz,
                    recipient: rH,
                    objectType: eZ(),
                    objectId: rW,
                    version: rZ,
                    digest: r6
                }), eP({
                    type: eN("mutated"),
                    sender: rz,
                    owner: rH,
                    objectType: eZ(),
                    objectId: rW,
                    version: rZ,
                    previousVersion: rZ,
                    digest: r6
                }), eP({
                    type: eN("deleted"),
                    sender: rz,
                    objectType: eZ(),
                    objectId: rW,
                    version: rZ
                }), eP({
                    type: eN("wrapped"),
                    sender: rz,
                    objectType: eZ(),
                    objectId: rW,
                    version: rZ
                }), eP({
                    type: eN("created"),
                    sender: rz,
                    owner: rH,
                    objectType: eZ(),
                    objectId: rW,
                    version: rZ,
                    digest: r6
                })]),
                nN = eP({
                    owner: rH,
                    coinType: eZ(),
                    amount: eZ()
                }),
                nL = eP({
                    digest: rR,
                    transaction: eW(n_),
                    effects: eW(nk),
                    events: eW(nI),
                    timestampMs: eW(eZ()),
                    checkpoint: eW(eZ()),
                    confirmedLocalExecution: eW(e_()),
                    objectChanges: eW(eM(nU)),
                    balanceChanges: eW(eM(nN)),
                    errors: eW(eM(eZ()))
                });
            eP({
                showInput: eW(e_()),
                showEffects: eW(e_()),
                showEvents: eW(e_()),
                showObjectChanges: eW(e_()),
                showBalanceChanges: eW(e_())
            });
            var nR = eP({
                    data: eM(nL),
                    nextCursor: eR(rR),
                    hasNextPage: e_()
                }),
                nD = eP({
                    effects: nk,
                    events: nI,
                    objectChanges: eM(nU),
                    balanceChanges: eM(nN),
                    input: eW(nv)
                });

            function nP(e) {
                if (!("object" == typeof e && null !== e && "type" in e && e.type.startsWith("0x1::option::Option<"))) return e
            }
            var nW = "0x2::sui::SUI";
            rq("0x6");
            var nz = /^0x2::coin::Coin<(.+)>$/,
                nZ = eP({
                    decimals: eD(),
                    name: eZ(),
                    symbol: eZ(),
                    description: eZ(),
                    iconUrl: eR(eZ()),
                    id: eR(rW)
                }),
                nH = class {
                    static isCoin(e) {
                        return null != nH.getType(e)?.match(nz)
                    }
                    static getCoinType(e) {
                        let [, t] = e.match(nz) ?? [];
                        return t || null
                    }
                    static getCoinTypeArg(e) {
                        let t = nH.getType(e);
                        return t ? nH.getCoinType(t) : null
                    }
                    static isSUI(e) {
                        let t = nH.getCoinTypeArg(e);
                        return !!t && "SUI" === nH.getCoinSymbol(t)
                    }
                    static getCoinSymbol(e) {
                        return e.substring(e.lastIndexOf(":") + 1)
                    }
                    static getCoinStructTag(e) {
                        return {
                            address: rq(e.split("::")[0]),
                            module: e.split("::")[1],
                            name: e.split("::")[2],
                            typeParams: []
                        }
                    }
                    static getID(e) {
                        return "fields" in e ? e.fields.id.id : "objectId" in e ? e.objectId : ne(e)?.objectId ?? function(e) {
                            if (e.error && "object_id" in e.error && !("version" in e.error) && !("digest" in e.error)) return e.error.object_id
                        }(e)
                    }
                    static totalBalance(e) {
                        return e.reduce((e, t) => e + nH.getBalanceFromCoinStruct(t), BigInt(0))
                    }
                    static sortByBalance(e) {
                        return [...e].sort((e, t) => nH.getBalanceFromCoinStruct(e) < nH.getBalanceFromCoinStruct(t) ? -1 : nH.getBalanceFromCoinStruct(e) > nH.getBalanceFromCoinStruct(t) ? 1 : 0)
                    }
                    static getBalanceFromCoinStruct(e) {
                        return BigInt(e.balance)
                    }
                    static getBalance(e) {
                        if (!nH.isCoin(e)) return;
                        let t = nt(e)?.balance;
                        return BigInt(t)
                    }
                    static getType(e) {
                        return e.data || e.type ? function(e) {
                            let t = void 0 !== e.data ? e.data : e;
                            if (!t?.type && "data" in e) return t?.content?.dataType === "package" ? "package" : nr(e)?.type;
                            return t?.type
                        }(e) : e.type
                    }
                },
                nV = class {
                    static isDelegationSuiObject(e) {
                        return "type" in e && e.type === nV.SUI_OBJECT_TYPE
                    }
                    constructor(e) {
                        this.suiObject = e
                    }
                    nextRewardUnclaimedEpoch() {
                        return this.suiObject.data.fields.next_reward_unclaimed_epoch
                    }
                    activeDelegation() {
                        return BigInt(nP(this.suiObject.data.fields.active_delegation) || 0)
                    }
                    delegateAmount() {
                        return this.suiObject.data.fields.delegate_amount
                    }
                    endingEpoch() {
                        return nP(this.suiObject.data.fields.ending_epoch)
                    }
                    validatorAddress() {
                        return this.suiObject.data.fields.validator_address
                    }
                    isActive() {
                        return this.activeDelegation() > 0 && !this.endingEpoch()
                    }
                    hasUnclaimedRewards(e) {
                        return this.nextRewardUnclaimedEpoch() <= e && (this.isActive() || (this.endingEpoch() || 0) > e)
                    }
                };
            nV.SUI_OBJECT_TYPE = "0x2::delegation::Delegation";
            var nF = "vector",
                n$ = {
                    kind: "TransactionKind",
                    sender: U.ADDRESS,
                    gasData: "GasData",
                    expiration: "TransactionExpiration"
                },
                nG = {
                    enums: {
                        "Option<T>": {
                            None: null,
                            Some: "T"
                        },
                        ObjectArg: {
                            ImmOrOwned: "SuiObjectRef",
                            Shared: "SharedObjectRef"
                        },
                        CallArg: {
                            Pure: [nF, U.U8],
                            Object: "ObjectArg",
                            ObjVec: [nF, "ObjectArg"]
                        },
                        TypeTag: {
                            bool: null,
                            u8: null,
                            u64: null,
                            u128: null,
                            address: null,
                            signer: null,
                            vector: "TypeTag",
                            struct: "StructTag",
                            u16: null,
                            u32: null,
                            u256: null
                        },
                        TransactionKind: {
                            ProgrammableTransaction: "ProgrammableTransaction",
                            ChangeEpoch: null,
                            Genesis: null,
                            ConsensusCommitPrologue: null
                        },
                        TransactionExpiration: {
                            None: null,
                            Epoch: U.U64
                        },
                        TransactionData: {
                            V1: "TransactionDataV1"
                        }
                    },
                    structs: {
                        SuiObjectRef: {
                            objectId: U.ADDRESS,
                            version: U.U64,
                            digest: "ObjectDigest"
                        },
                        SharedObjectRef: {
                            objectId: U.ADDRESS,
                            initialSharedVersion: U.U64,
                            mutable: U.BOOL
                        },
                        StructTag: {
                            address: U.ADDRESS,
                            module: U.STRING,
                            name: U.STRING,
                            typeParams: [nF, "TypeTag"]
                        },
                        GasData: {
                            payment: [nF, "SuiObjectRef"],
                            owner: U.ADDRESS,
                            price: U.U64,
                            budget: U.U64
                        },
                        SenderSignedData: {
                            data: "TransactionData",
                            txSignatures: [nF, [nF, U.U8]]
                        },
                        TransactionDataV1: n$
                    },
                    aliases: {
                        ObjectDigest: U.BASE58
                    }
                },
                nq = new U({
                    genericSeparators: ["<", ">"],
                    vectorType: "vector",
                    addressLength: 32,
                    addressEncoding: "hex",
                    types: nG
                });
            nq.registerType("utf8string", (e, t) => {
                let r = Array.from(new TextEncoder().encode(t));
                return e.writeVec(r, (e, t) => e.write8(t))
            }, e => {
                let t = e.readVec(e => e.read8());
                return new TextDecoder().decode(new Uint8Array(t))
            });
            var nK = eP({
                amount: eD(),
                id: rW,
                transferTxDigest: rR
            });
            eP({
                transferredGasObjects: eM(nK),
                error: eR(eZ())
            });
            var nY = eM(eV([eZ(), eP({
                    Object: eZ()
                })])),
                nJ = eP({
                    address: eZ(),
                    name: eZ()
                }),
                nX = eV([eN("Private"), eN("Public"), eN("Friend")]),
                nQ = eP({
                    abilities: eM(eZ())
                }),
                n0 = eP({
                    constraints: nQ,
                    isPhantom: e_()
                }),
                n1 = eP({
                    TypeParameter: eD()
                }),
                n2 = eH([eP({
                    module: eZ(),
                    package: eZ(),
                    function: eZ()
                }), eZ()]),
                n5 = eP({
                    rank3Days: eM(n2),
                    rank7Days: eM(n2),
                    rank30Days: eM(n2)
                });

            function n3(e) {
                return !!e && (!!("string" == typeof e || eI(e, n1) || n4(e)) || "object" == typeof e && !!(eI(e.Reference, n6) || eI(e.MutableReference, n6) || eI(e.Vector, n6)))
            }
            var n6 = eO("SuiMoveNormalizedType", n3);

            function n4(e) {
                if (!e || "object" != typeof e || !e.Struct || "object" != typeof e.Struct) return !1;
                let t = e.Struct;
                return !!("string" == typeof t.address && "string" == typeof t.module && "string" == typeof t.name && Array.isArray(t.typeArguments) && t.typeArguments.every(e => n3(e)))
            }
            eO("SuiMoveNormalizedStructType", n4);
            var n8 = eP({
                    visibility: nX,
                    isEntry: e_(),
                    typeParameters: eM(nQ),
                    parameters: eM(n6),
                    return: eM(n6)
                }),
                n9 = eP({
                    name: eZ(),
                    type: n6
                }),
                n7 = eP({
                    abilities: nQ,
                    typeParameters: eM(n0),
                    fields: eM(n9)
                }),
                ie = eP({
                    fileFormatVersion: eD(),
                    address: eZ(),
                    name: eZ(),
                    friends: eM(nJ),
                    structs: ez(eZ(), n7),
                    exposedFunctions: ez(eZ(), n8)
                }),
                it = ez(eZ(), ie);

            function ir(e) {
                return "object" == typeof e && "MutableReference" in e ? e.MutableReference : void 0
            }

            function ii(e) {
                if ("object" == typeof e && "Struct" in e) return e;
                let t = "object" == typeof e && "Reference" in e ? e.Reference : void 0,
                    r = ir(e);
                return "object" == typeof t && "Struct" in t ? t : "object" == typeof r && "Struct" in r ? r : void 0
            }
            var io = eP({
                    apy: eD(),
                    address: rz
                }),
                is = eP({
                    epoch: eZ(),
                    apys: eM(io)
                });
            eP({
                value: eD()
            });
            var ia = eP({
                    stakedSuiId: rW,
                    stakeRequestEpoch: nu,
                    stakeActiveEpoch: nu,
                    principal: eZ(),
                    status: eV([eN("Active"), eN("Pending"), eN("Unstaked")]),
                    estimatedReward: eW(eZ())
                }),
                ic = eP({
                    validatorAddress: rz,
                    stakingPool: rW,
                    stakes: eM(ia)
                }),
                il = eP({
                    balance: eP({
                        value: eD()
                    }),
                    distribution_counter: eD(),
                    current_distribution_amount: eD(),
                    stake_subsidy_period_length: eD(),
                    stake_subsidy_decrease_rate: eD()
                });
            eP({
                type: eZ(),
                fields: il
            }), eP({
                value: eD()
            });
            var iu = eP({
                id: eZ(),
                size: eD(),
                head: eP({
                    vec: eM()
                }),
                tail: eP({
                    vec: eM()
                })
            });
            eP({
                id: eZ(),
                size: eD()
            }), eP({
                type: eZ(),
                fields: iu
            });
            var ih = eP({
                exchangeRates: eP({
                    id: eZ(),
                    size: eD()
                }),
                id: eZ(),
                pendingStake: eD(),
                pendingPoolTokenWithdraw: eD(),
                pendingTotalSuiWithdraw: eD(),
                poolTokenBalance: eD(),
                rewardsPool: eP({
                    value: eD()
                }),
                activationEpoch: eP({
                    vec: eM()
                }),
                deactivationEpoch: eP({
                    vec: eM()
                }),
                suiBalance: eD()
            });
            eP({
                type: eZ(),
                fields: ih
            });
            var id = eP({
                    epoch: nu,
                    validators: eM(eH([nM, eZ()]))
                }),
                ip = eP({
                    suiAddress: rz,
                    protocolPubkeyBytes: eZ(),
                    networkPubkeyBytes: eZ(),
                    workerPubkeyBytes: eZ(),
                    proofOfPossessionBytes: eZ(),
                    operationCapId: eZ(),
                    name: eZ(),
                    description: eZ(),
                    imageUrl: eZ(),
                    projectUrl: eZ(),
                    p2pAddress: eZ(),
                    netAddress: eZ(),
                    primaryAddress: eZ(),
                    workerAddress: eZ(),
                    nextEpochProtocolPubkeyBytes: eR(eZ()),
                    nextEpochProofOfPossession: eR(eZ()),
                    nextEpochNetworkPubkeyBytes: eR(eZ()),
                    nextEpochWorkerPubkeyBytes: eR(eZ()),
                    nextEpochNetAddress: eR(eZ()),
                    nextEpochP2pAddress: eR(eZ()),
                    nextEpochPrimaryAddress: eR(eZ()),
                    nextEpochWorkerAddress: eR(eZ()),
                    votingPower: eZ(),
                    gasPrice: eZ(),
                    commissionRate: eZ(),
                    nextEpochStake: eZ(),
                    nextEpochGasPrice: eZ(),
                    nextEpochCommissionRate: eZ(),
                    stakingPoolId: eZ(),
                    stakingPoolActivationEpoch: eR(eZ()),
                    stakingPoolDeactivationEpoch: eR(eZ()),
                    stakingPoolSuiBalance: eZ(),
                    rewardsPool: eZ(),
                    poolTokenBalance: eZ(),
                    pendingStake: eZ(),
                    pendingPoolTokenWithdraw: eZ(),
                    pendingTotalSuiWithdraw: eZ(),
                    exchangeRatesId: eZ(),
                    exchangeRatesSize: eZ()
                }),
                ig = eP({
                    epoch: eZ(),
                    protocolVersion: eZ(),
                    systemStateVersion: eZ(),
                    storageFundTotalObjectStorageRebates: eZ(),
                    storageFundNonRefundableBalance: eZ(),
                    referenceGasPrice: eZ(),
                    safeMode: e_(),
                    safeModeStorageRewards: eZ(),
                    safeModeComputationRewards: eZ(),
                    safeModeStorageRebates: eZ(),
                    safeModeNonRefundableStorageFee: eZ(),
                    epochStartTimestampMs: eZ(),
                    epochDurationMs: eZ(),
                    stakeSubsidyStartEpoch: eZ(),
                    maxValidatorCount: eZ(),
                    minValidatorJoiningStake: eZ(),
                    validatorLowStakeThreshold: eZ(),
                    validatorVeryLowStakeThreshold: eZ(),
                    validatorLowStakeGracePeriod: eZ(),
                    stakeSubsidyBalance: eZ(),
                    stakeSubsidyDistributionCounter: eZ(),
                    stakeSubsidyCurrentDistributionAmount: eZ(),
                    stakeSubsidyPeriodLength: eZ(),
                    stakeSubsidyDecreaseRate: eD(),
                    totalStake: eZ(),
                    activeValidators: eM(ip),
                    pendingActiveValidatorsId: eZ(),
                    pendingActiveValidatorsSize: eZ(),
                    pendingRemovals: eM(eZ()),
                    stakingPoolMappingsId: eZ(),
                    stakingPoolMappingsSize: eZ(),
                    inactivePoolsId: eZ(),
                    inactivePoolsSize: eZ(),
                    validatorCandidatesId: eZ(),
                    validatorCandidatesSize: eZ(),
                    atRiskValidators: eM(eH([rz, eZ()])),
                    validatorReportRecords: eM(eH([rz, eM(rz)]))
                }),
                iy = eP({
                    coinType: eZ(),
                    coinObjectId: rW,
                    version: eZ(),
                    digest: rR,
                    balance: eZ(),
                    lockedUntilEpoch: eW(eR(eD())),
                    previousTransaction: rR
                }),
                im = eP({
                    data: eM(iy),
                    nextCursor: eR(rW),
                    hasNextPage: e_()
                }),
                ib = eP({
                    coinType: eZ(),
                    coinObjectCount: eD(),
                    totalBalance: eZ(),
                    lockedBalance: eP({
                        epochId: eW(eD()),
                        number: eW(eD())
                    })
                }),
                iw = eP({
                    value: eZ()
                }),
                iv = eP({
                    lastCheckpointId: eZ(),
                    epochEndTimestamp: eZ(),
                    protocolVersion: eZ(),
                    referenceGasPrice: eZ(),
                    totalStake: eZ(),
                    storageFundReinvestment: eZ(),
                    storageCharge: eZ(),
                    storageRebate: eZ(),
                    storageFundBalance: eZ(),
                    stakeSubsidyAmount: eZ(),
                    totalGasFees: eZ(),
                    totalStakeRewardsDistributed: eZ(),
                    leftoverStorageFundInflow: eZ()
                }),
                iE = eP({
                    epoch: eZ(),
                    validators: eM(ip),
                    epochTotalTransactions: eZ(),
                    firstCheckpointId: eZ(),
                    epochStartTimestamp: eZ(),
                    endOfEpochInfo: eR(iv)
                }),
                ix = eP({
                    data: eM(iE),
                    nextCursor: eR(eZ()),
                    hasNextPage: e_()
                }),
                iA = eP({
                    computationCost: eZ(),
                    storageCost: eZ(),
                    storageRebate: eZ(),
                    nonRefundableStorageFee: eZ()
                });
            eZ();
            var iS = eZ();
            eP({
                digest: eM(eD())
            });
            var iT = ej(),
                ik = eZ(),
                iI = eP({
                    nextEpochCommittee: eM(eH([eZ(), eZ()])),
                    nextEpochProtocolVersion: eZ(),
                    epochCommitments: eM(iT)
                });
            eP({
                transaction: rR,
                effects: rD
            });
            var iC = eP({
                    epoch: eZ(),
                    sequenceNumber: eZ(),
                    digest: iS,
                    networkTotalTransactions: eZ(),
                    previousDigest: eW(iS),
                    epochRollingGasCostSummary: iA,
                    timestampMs: eZ(),
                    endOfEpochData: eW(iI),
                    validatorSignature: eW(ik),
                    transactions: eM(rR),
                    checkpointCommitments: eM(iT)
                }),
                iB = eP({
                    data: eM(iC),
                    nextCursor: eR(eZ()),
                    hasNextPage: e_()
                }),
                iO = {
                    ED25519: 0,
                    Secp256k1: 1
                },
                ij = class {
                    constructor(e) {
                        if ("string" == typeof e ? this.data = A(e) : e instanceof Uint8Array ? this.data = e : this.data = Uint8Array.from(e), 32 !== this.data.length) throw Error(`Invalid public key input. Expected 32 bytes, got ${this.data.length}`)
                    }
                    equals(e) {
                        return iM(this.toBytes(), e.toBytes())
                    }
                    toBase64() {
                        return T(this.toBytes())
                    }
                    toBytes() {
                        return this.data
                    }
                    toString() {
                        return this.toBase64()
                    }
                    toSuiAddress() {
                        let e = new Uint8Array(33);
                        return e.set([iO.ED25519]), e.set(this.toBytes(), 1), rG(V(em(e, {
                            dkLen: 32
                        })).slice(0, 64))
                    }
                };

            function iM(e, t) {
                if (e === t) return !0;
                if (e.length !== t.length) return !1;
                for (let r = 0; r < e.length; r++)
                    if (e[r] !== t[r]) return !1;
                return !0
            }
            ij.SIZE = 32;
            var i_ = class {
                constructor(e) {
                    if ("string" == typeof e ? this.data = A(e) : e instanceof Uint8Array ? this.data = e : this.data = Uint8Array.from(e), 33 !== this.data.length) throw Error(`Invalid public key input. Expected 33 bytes, got ${this.data.length}`)
                }
                equals(e) {
                    return iM(this.toBytes(), e.toBytes())
                }
                toBase64() {
                    return T(this.toBytes())
                }
                toBytes() {
                    return this.data
                }
                toString() {
                    return this.toBase64()
                }
                toSuiAddress() {
                    let e = new Uint8Array(34);
                    return e.set([iO.Secp256k1]), e.set(this.toBytes(), 1), rG(V(em(e, {
                        dkLen: 32
                    })).slice(0, 64))
                }
            };

            function iU(e) {
                return (0, tY.Z1)(e, "")
            }
            i_.SIZE = 33;
            var iN = class {
                    constructor(e) {
                        if (e) this.keypair = e;
                        else {
                            let e = secp256k1.utils.randomPrivateKey(),
                                t = secp256k1.getPublicKey(e, !0);
                            this.keypair = {
                                publicKey: t,
                                secretKey: e
                            }
                        }
                    }
                    getKeyScheme() {
                        return "Secp256k1"
                    }
                    static generate() {
                        return new iN
                    }
                    static fromSecretKey(e, t) {
                        let r = secp256k1.getPublicKey(e, !0);
                        if (!t || !t.skipValidation) {
                            let t = new TextEncoder,
                                n = t.encode("sui validation"),
                                i = bytesToHex3(blake2b3(n, {
                                    dkLen: 32
                                })),
                                o = secp256k1.sign(i, e);
                            if (!secp256k1.verify(o, i, r, {
                                    lowS: !0
                                })) throw Error("Provided secretKey is invalid")
                        }
                        return new iN({
                            publicKey: r,
                            secretKey: e
                        })
                    }
                    static fromSeed(e) {
                        let t = secp256k1.getPublicKey(e, !0);
                        return new iN({
                            publicKey: t,
                            secretKey: e
                        })
                    }
                    getPublicKey() {
                        return new i_(this.keypair.publicKey)
                    }
                    signData(e) {
                        let t = sha256(e),
                            r = secp256k1.sign(t, this.keypair.secretKey, {
                                lowS: !0
                            });
                        return r.toCompactRawBytes()
                    }
                    static deriveKeypair(e, t) {
                        var r;
                        if (null == t && (t = "m/54'/784'/0'/0/0"), r = t, !RegExp("^m\\/54'\\/784'\\/[0-9]+'\\/[0-9]+\\/[0-9]+$").test(r)) throw Error("Invalid derivation path");
                        let n = HDKey.fromMasterSeed(iU(e)).derive(t);
                        if (null == n.publicKey || null == n.privateKey) throw Error("Invalid key");
                        return new iN({
                            publicKey: n.publicKey,
                            secretKey: n.privateKey
                        })
                    }
                    export () {
                        return {
                            schema: "Secp256k1",
                            privateKey: toB644(this.keypair.secretKey)
                        }
                    }
                },
                iL = RegExp("^m(\\/[0-9]+')+$"),
                iR = e => e.replace("'", ""),
                iD = e => {
                    let t = tD.create(rl, "ed25519 seed"),
                        r = t.update(k(e)).digest(),
                        n = r.slice(0, 32),
                        i = r.slice(32);
                    return {
                        key: n,
                        chainCode: i
                    }
                },
                iP = ({
                    key: e,
                    chainCode: t
                }, r) => {
                    let n = new ArrayBuffer(4),
                        i = new DataView(n);
                    i.setUint32(0, r);
                    let o = new Uint8Array(1 + e.length + n.byteLength);
                    o.set(new Uint8Array(1).fill(0)), o.set(e, 1), o.set(new Uint8Array(n, 0, n.byteLength), e.length + 1);
                    let s = tD.create(rl, t).update(o).digest(),
                        a = s.slice(0, 32),
                        c = s.slice(32);
                    return {
                        key: a,
                        chainCode: c
                    }
                },
                iW = e => !!iL.test(e) && !e.split("/").slice(1).map(iR).some(isNaN),
                iz = (e, t, r = 2147483648) => {
                    if (!iW(e)) throw Error("Invalid derivation path");
                    let {
                        key: n,
                        chainCode: i
                    } = iD(t), o = e.split("/").slice(1).map(iR).map(e => parseInt(e, 10));
                    return o.reduce((e, t) => iP(e, t + r), {
                        key: n,
                        chainCode: i
                    })
                },
                iZ = class {
                    constructor(e) {
                        e ? this.keypair = e : this.keypair = E.sign.keyPair()
                    }
                    getKeyScheme() {
                        return "ED25519"
                    }
                    static generate() {
                        return new iZ(E.sign.keyPair())
                    }
                    static fromSecretKey(e, t) {
                        let r = e.length;
                        if (32 !== r) throw Error(`Wrong secretKey size. Expected 32 bytes, got ${r}.`);
                        let n = E.sign.keyPair.fromSeed(e);
                        if (!t || !t.skipValidation) {
                            let e = new TextEncoder,
                                t = e.encode("sui validation"),
                                r = E.sign.detached(t, n.secretKey);
                            if (!E.sign.detached.verify(t, r, n.publicKey)) throw Error("provided secretKey is invalid")
                        }
                        return new iZ(n)
                    }
                    getPublicKey() {
                        return new ij(this.keypair.publicKey)
                    }
                    signData(e) {
                        return E.sign.detached(e, this.keypair.secretKey)
                    }
                    static deriveKeypair(e, t) {
                        var r;
                        if (null == t && (t = "m/44'/784'/0'/0'/0'"), r = t, !RegExp("^m\\/44'\\/784'\\/[0-9]+'\\/[0-9]+'\\/[0-9]+'+$").test(r)) throw Error("Invalid derivation path");
                        let {
                            key: n
                        } = iz(t, I(iU(e)));
                        return iZ.fromSecretKey(n)
                    }
                    export () {
                        return {
                            schema: "ED25519",
                            privateKey: T(this.keypair.secretKey.slice(0, 32))
                        }
                    }
                },
                iH = class extends Error {
                    constructor(e) {
                        super(e.cause ? `RPC Error: ${e.cause.message}` : "Unknown RPC Error", {
                            cause: e.cause
                        }), this.req = e.req, this.code = e.code, this.data = e.data
                    }
                },
                iV = class extends Error {
                    constructor(e) {
                        super("RPC Validation Error: The response returned from RPC server does not match the TypeScript definition. This is likely because the SDK version is not compatible with the RPC server.", {
                            cause: e.cause
                        }), this.req = e.req, this.result = e.result, this.message = this.toString()
                    }
                    toString() {
                        let e = super.toString();
                        return this.cause && (e += `
Cause: ${this.cause}`), this.result && (e += `
Reponse Received: ${JSON.stringify(this.result,null,2)}`), e
                    }
                },
                iF = class extends Error {},
                i$ = eP({
                    jsonrpc: eN("2.0"),
                    id: eZ(),
                    result: ej()
                }),
                iG = eP({
                    jsonrpc: eN("2.0"),
                    id: eZ(),
                    error: eP({
                        code: ej(),
                        message: eZ(),
                        data: eW(ej())
                    })
                }),
                iq = class {
                    constructor(e, t) {
                        this.rpcClient = new rB(async (r, n) => {
                            let i = {
                                method: "POST",
                                body: r,
                                headers: {
                                    "Content-Type": "application/json",
                                    "Client-Sdk-Type": "typescript",
                                    "Client-Sdk-Version": "0.34.1",
                                    "Client-Target-Api-Version": "1.2.0",
                                    ...t
                                }
                            };
                            try {
                                let t = await fetch(e, i),
                                    r = await t.text();
                                if (t.ok) n(null, r);
                                else {
                                    let e = "text/html" === t.headers.get("content-type");
                                    n(Error(`${t.status} ${t.statusText}${e?"":`: ${r}`}`))
                                }
                            } catch (e) {
                                n(e)
                            }
                        }, {})
                    }
                    async requestWithType(e, t, r) {
                        let n = {
                                method: e,
                                args: t
                            },
                            i = await this.request(e, t);
                        if (eI(i, iG)) throw new iH({
                            req: n,
                            code: i.error.code,
                            data: i.error.data,
                            cause: Error(i.error.message)
                        });
                        if (eI(i, i$)) {
                            let [e] = eC(i.result, r);
                            return e && console.warn(new iV({
                                req: n,
                                result: i.result,
                                cause: e
                            })), i.result
                        }
                        throw new iH({
                            req: n,
                            data: i
                        })
                    }
                    async request(e, t) {
                        return new Promise((r, n) => {
                            this.rpcClient.request(e, t, (e, t) => {
                                if (e) {
                                    n(e);
                                    return
                                }
                                r(t)
                            })
                        })
                    }
                },
                iK = eV([eN("DynamicField"), eN("DynamicObject")]),
                iY = eP({
                    type: eZ(),
                    value: ej()
                }),
                iJ = eP({
                    name: iY,
                    bcsName: eZ(),
                    type: iK,
                    objectType: eZ(),
                    objectId: rW,
                    version: eD(),
                    digest: eZ()
                }),
                iX = eP({
                    data: eM(iJ),
                    nextCursor: eR(rW),
                    hasNextPage: e_()
                }),
                iQ = (e, t) => {
                    let r = new URL(e);
                    return r.protocol = r.protocol.replace("http", "ws"), t && (r.port = t.toString()), r.toString()
                },
                i0 = e => e && "subscription" in e && "number" == typeof e.subscription && "result" in e && "object" == typeof e.result,
                i1 = {
                    connectTimeout: 15e3,
                    callTimeout: 3e4,
                    reconnectInterval: 3e3,
                    maxReconnects: 5
                },
                i2 = "suix_subscribeEvent",
                i5 = class {
                    constructor(e, t = i1) {
                        this.endpoint = e, this.options = t, this.connectionState = 0, this.connectionTimeout = null, this.isSetup = !1, this.connectionPromise = null, this.eventSubscriptions = new Map, this.endpoint.startsWith("http") && (this.endpoint = iQ(this.endpoint)), this.rpcClient = new rO.K(this.endpoint, {
                            reconnect_interval: this.options.reconnectInterval,
                            max_reconnects: this.options.maxReconnects,
                            autoconnect: !1
                        })
                    }
                    setupSocket() {
                        this.isSetup || (this.rpcClient.on("open", () => {
                            this.connectionTimeout && (clearTimeout(this.connectionTimeout), this.connectionTimeout = null), this.connectionState = 2, this.rpcClient.socket.on("message", this.onSocketMessage.bind(this))
                        }), this.rpcClient.on("close", () => {
                            this.connectionState = 0
                        }), this.rpcClient.on("error", console.error), this.isSetup = !0)
                    }
                    onSocketMessage(e) {
                        let t = JSON.parse(e),
                            r = t.params;
                        if (t.method === i2) {
                            if (i0(r)) {
                                let e = this.eventSubscriptions.get(r.subscription);
                                e && e.onMessage(r.result)
                            } else if (eI(r, nl)) {
                                let e = this.eventSubscriptions.get(r.subscription);
                                e && e.onMessage(r.result)
                            }
                        }
                    }
                    async connect() {
                        return this.connectionPromise ? this.connectionPromise : 2 === this.connectionState ? Promise.resolve() : (this.setupSocket(), this.rpcClient.connect(), this.connectionState = 1, this.connectionPromise = new Promise((e, t) => {
                            this.connectionTimeout = setTimeout(() => t(Error("timeout")), this.options.connectTimeout), this.rpcClient.once("open", () => {
                                this.refreshSubscriptions(), this.connectionPromise = null, e()
                            }), this.rpcClient.once("error", e => {
                                this.connectionPromise = null, t(e)
                            })
                        }), this.connectionPromise)
                    }
                    async refreshSubscriptions() {
                        if (0 !== this.eventSubscriptions.size) try {
                            let e = new Map;
                            (await Promise.all(Array.from(this.eventSubscriptions.values()).map(async e => {
                                let t = e.onMessage,
                                    r = e.filter;
                                if (!r || !t) return Promise.resolve(null);
                                let n = await this.subscribeEvent(r, t);
                                return {
                                    id: n,
                                    onMessage: t,
                                    filter: r
                                }
                            }))).forEach(t => {
                                if (null === t) return;
                                let r = t.filter,
                                    n = t.onMessage;
                                e.set(t.id, {
                                    filter: r,
                                    onMessage: n
                                })
                            }), this.eventSubscriptions = e
                        } catch (e) {
                            throw Error(`error refreshing event subscriptions: ${e}`)
                        }
                    }
                    async subscribeEvent(e, t) {
                        try {
                            2 !== this.connectionState && await this.connect();
                            let r = await this.rpcClient.call(i2, [e], this.options.callTimeout);
                            return this.eventSubscriptions.set(r, {
                                filter: e,
                                onMessage: t
                            }), r
                        } catch (t) {
                            throw Error(`Error subscribing to event: ${JSON.stringify(t,null,2)}, filter: ${JSON.stringify(e)}`)
                        }
                    }
                    async unsubscribeEvent(e) {
                        try {
                            2 !== this.connectionState && await this.connect();
                            let t = await this.rpcClient.call("suix_unsubscribeEvent", [e], this.options.callTimeout);
                            return this.eventSubscriptions.delete(e) || t
                        } catch (t) {
                            throw Error(`Error unsubscribing from event: ${t}, subscription: ${e}`)
                        }
                    }
                };
            async function i3(e, t, r) {
                let n;
                let i = await fetch(e, {
                    method: "POST",
                    body: JSON.stringify({
                        FixedAmountRequest: {
                            recipient: t
                        }
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        ...r || {}
                    }
                });
                if (429 === i.status) throw new iF("Too many requests from this client have been sent to the faucet. Please retry later");
                try {
                    n = await i.json()
                } catch (e) {
                    throw Error(`Encountered error when parsing response from faucet, error: ${e}, status ${i.status}, response ${i}`)
                }
                if (n.error) throw Error(`Faucet returns error: ${n.error}`);
                return n
            }
            var i6 = class {
                constructor(e) {
                    rU(this, c, void 0), rN(this, c, e)
                }
                get fullnode() {
                    return r_(this, c).fullnode
                }
                get websocket() {
                    return r_(this, c).websocket || r_(this, c).fullnode
                }
                get faucet() {
                    return r_(this, c).faucet
                }
            };
            c = new WeakMap;
            var i4 = new i6({
                    fullnode: "http://127.0.0.1:9000",
                    faucet: "http://127.0.0.1:9123/gas"
                }),
                i8 = new i6({
                    fullnode: "https://fullnode.devnet.sui.io:443/",
                    faucet: "https://faucet.devnet.sui.io/gas"
                });
            new i6({
                fullnode: "https://fullnode.testnet.sui.io:443/",
                faucet: "https://faucet.testnet.sui.io/gas"
            }), new i6({
                fullnode: "https://fullnode.mainnet.sui.io:443/"
            });
            var i9 = Symbol("transaction-argument-type"),
                i7 = /^vector<(.+)>$/,
                oe = /^([^:]+)::([^:]+)::([^<]+)(<(.+)>)?/,
                ot = class {
                    static parseFromStr(e, t = !1) {
                        if ("address" === e) return {
                            address: null
                        };
                        if ("bool" === e) return {
                            bool: null
                        };
                        if ("u8" === e) return {
                            u8: null
                        };
                        if ("u16" === e) return {
                            u16: null
                        };
                        if ("u32" === e) return {
                            u32: null
                        };
                        if ("u64" === e) return {
                            u64: null
                        };
                        if ("u128" === e) return {
                            u128: null
                        };
                        else if ("u256" === e) return {
                            u256: null
                        };
                        else if ("signer" === e) return {
                            signer: null
                        };
                        let r = e.match(i7);
                        if (r) return {
                            vector: ot.parseFromStr(r[1], t)
                        };
                        let n = e.match(oe);
                        if (n) {
                            let e = t ? rG(n[1]) : n[1];
                            return {
                                struct: {
                                    address: e,
                                    module: n[2],
                                    name: n[3],
                                    typeParams: void 0 === n[5] ? [] : ot.parseStructTypeArgs(n[5], t)
                                }
                            }
                        }
                        throw Error(`Encountered unexpected token when parsing type args for ${e}`)
                    }
                    static parseStructTypeArgs(e, t = !1) {
                        let r = [],
                            n = "",
                            i = 0;
                        for (let t = 0; t < e.length; t++) {
                            let o = e[t];
                            if ("<" === o && i++, ">" === o && i--, 0 === i && "," === o) {
                                r.push(n.trim()), n = "";
                                continue
                            }
                            n += o
                        }
                        return r.push(n.trim()), r.map(e => ot.parseFromStr(e, t))
                    }
                    static tagToString(e) {
                        if ("bool" in e) return "bool";
                        if ("u8" in e) return "u8";
                        if ("u16" in e) return "u16";
                        if ("u32" in e) return "u32";
                        if ("u64" in e) return "u64";
                        if ("u128" in e) return "u128";
                        if ("u256" in e) return "u256";
                        if ("address" in e) return "address";
                        if ("signer" in e) return "signer";
                        if ("vector" in e) return `vector<${ot.tagToString(e.vector)}>`;
                        if ("struct" in e) {
                            let t = e.struct,
                                r = t.typeParams.map(ot.tagToString).join(", ");
                            return `${t.address}::${t.module}::${t.name}${r?`<${r}>`:""}`
                        }
                        throw Error("Invalid TypeTag")
                    }
                },
                or = eP({
                    kind: eN("Input"),
                    index: eU(),
                    value: eW(ej()),
                    type: eW(eV([eN("pure"), eN("object")]))
                }),
                on = [or, eP({
                    kind: eN("GasCoin")
                }), eP({
                    kind: eN("Result"),
                    index: eU()
                }), eP({
                    kind: eN("NestedResult"),
                    index: eU(),
                    resultIndex: eU()
                })],
                oi = eV([...on]),
                oo = eV([...on]);
            oo[i9] = {
                kind: "object"
            };
            var os = e => {
                    let t = eV([...on]);
                    return t[i9] = {
                        kind: "pure",
                        type: e
                    }, t
                },
                oa = eP({
                    kind: eN("MoveCall"),
                    target: eO("target", eZ().validator),
                    typeArguments: eM(eZ()),
                    arguments: eM(oi)
                }),
                oc = eP({
                    kind: eN("TransferObjects"),
                    objects: eM(oo),
                    address: os(U.ADDRESS)
                }),
                ol = eP({
                    kind: eN("SplitCoins"),
                    coin: oo,
                    amounts: eM(os("u64"))
                }),
                ou = eP({
                    kind: eN("MergeCoins"),
                    destination: oo,
                    sources: eM(oo)
                }),
                of = eP({
                    kind: eN("MakeMoveVec"),
                    type: eW((n = ez(eZ(), eO("unknown", () => !0)), eV([eP({
                        None: eV([eN(!0), eN(null)])
                    }), eP({
                        Some: n
                    })]))),
                    objects: eM(oo)
                }),
                oh = eP({
                    kind: eN("Publish"),
                    modules: eM(eM(eU())),
                    dependencies: eM(rW)
                }),
                od = ((i = od || {})[i.COMPATIBLE = 0] = "COMPATIBLE", i[i.ADDITIVE = 128] = "ADDITIVE", i[i.DEP_ONLY = 192] = "DEP_ONLY", i),
                op = eP({
                    kind: eN("Upgrade"),
                    modules: eM(eM(eU())),
                    dependencies: eM(rW),
                    packageId: rW,
                    ticket: oo
                }),
                og = [oa, oc, ol, ou, oh, op, of],
                oy = eV([...og]),
                om = {
                    MoveCall: e => eT({
                        kind: "MoveCall",
                        target: e.target,
                        arguments: e.arguments ?? [],
                        typeArguments: e.typeArguments ?? []
                    }, oa),
                    TransferObjects: (e, t) => eT({
                        kind: "TransferObjects",
                        objects: e,
                        address: t
                    }, oc),
                    SplitCoins: (e, t) => eT({
                        kind: "SplitCoins",
                        coin: e,
                        amounts: t
                    }, ol),
                    MergeCoins: (e, t) => eT({
                        kind: "MergeCoins",
                        destination: e,
                        sources: t
                    }, ou),
                    Publish: ({
                        modules: e,
                        dependencies: t
                    }) => eT({
                        kind: "Publish",
                        modules: e.map(e => "string" == typeof e ? Array.from(A(e)) : e),
                        dependencies: t.map(e => rq(e))
                    }, oh),
                    Upgrade: ({
                        modules: e,
                        dependencies: t,
                        packageId: r,
                        ticket: n
                    }) => eT({
                        kind: "Upgrade",
                        modules: e.map(e => "string" == typeof e ? Array.from(A(e)) : e),
                        dependencies: t.map(e => rq(e)),
                        packageId: r,
                        ticket: n
                    }, op),
                    MakeMoveVec: ({
                        type: e,
                        objects: t
                    }) => eT({
                        kind: "MakeMoveVec",
                        type: e ? {
                            Some: ot.parseFromStr(e)
                        } : {
                            None: null
                        },
                        objects: t
                    }, of)
                },
                ob = "Argument",
                ow = "vector",
                ov = "TypeTag",
                oE = "ProgrammableMoveCall",
                ox = "Transaction",
                oA = "EnumKind",
                oS = [oA, ob],
                oT = "SimpleProgrammableMoveCall",
                ok = new U(nq).registerStructType("ProgrammableTransaction", {
                    inputs: [ow, "CallArg"],
                    transactions: [ow, [oA, ox]]
                }).registerEnumType(ob, {
                    GasCoin: null,
                    Input: {
                        index: U.U16
                    },
                    Result: {
                        index: U.U16
                    },
                    NestedResult: {
                        index: U.U16,
                        resultIndex: U.U16
                    }
                }).registerStructType(oE, {
                    package: U.ADDRESS,
                    module: U.STRING,
                    function: U.STRING,
                    type_arguments: [ow, ov],
                    arguments: [ow, oS]
                }).registerEnumType(ox, {
                    MoveCall: oT,
                    TransferObjects: {
                        objects: [ow, oS],
                        address: oS
                    },
                    SplitCoins: {
                        coin: oS,
                        amounts: [ow, oS]
                    },
                    MergeCoins: {
                        destination: oS,
                        sources: [ow, oS]
                    },
                    Publish: {
                        modules: [ow, [ow, U.U8]],
                        dependencies: [ow, U.ADDRESS]
                    },
                    MakeMoveVec: {
                        type: ["Option", ov],
                        objects: [ow, oS]
                    },
                    Upgrade: {
                        modules: [ow, [ow, U.U8]],
                        dependencies: [ow, U.ADDRESS],
                        packageId: U.ADDRESS,
                        ticket: oS
                    }
                });
            ok.registerType([oA, "T"], function(e, t, r, n) {
                let i = t.kind,
                    [o] = r;
                return this.getTypeInterface(o)._encodeRaw.call(this, e, {
                    [i]: t
                }, r, n)
            }, function(e, t, r) {
                let [n] = t, i = this.getTypeInterface(n)._decodeRaw.call(this, e, t, r), o = Object.keys(i)[0];
                return {
                    kind: o,
                    ...i[o]
                }
            }, e => {
                if ("object" != typeof e && !("kind" in e)) throw Error(`EnumKind: Missing property "kind" in the input ${JSON.stringify(e)}`);
                return !0
            }), ok.registerType(oT, function(e, t, r, n) {
                let [i, o, s] = t.target.split("::"), a = t.typeArguments.map(e => ot.parseFromStr(e, !0));
                return this.getTypeInterface(oE)._encodeRaw.call(this, e, {
                    package: rG(i),
                    module: o,
                    function: s,
                    type_arguments: a,
                    arguments: t.arguments
                }, r, n)
            }, function(e, t, r) {
                let n = ok.getTypeInterface(oE)._decodeRaw.call(this, e, t, r);
                return {
                    target: [n.package, n.module, n.function].join("::"),
                    arguments: n.arguments,
                    typeArguments: n.type_arguments.map(ot.tagToString)
                }
            }, e => 3 === e.target.split("::").length);
            var oI = eV([eP({
                    ImmOrOwned: rK
                }), eP({
                    Shared: eP({
                        objectId: eZ(),
                        initialSharedVersion: eV([eU(), eZ()]),
                        mutable: e_()
                    })
                })]),
                oC = eP({
                    Pure: eM(eU())
                }),
                oB = eV([oC, eP({
                    Object: oI
                })]),
                oO = {
                    Pure: (e, t) => ({
                        Pure: Array.from(e instanceof Uint8Array ? e : ok.ser(t, e, {
                            maxSize: 16384
                        }).toBytes())
                    }),
                    ObjectRef: ({
                        objectId: e,
                        digest: t,
                        version: r
                    }) => ({
                        Object: {
                            ImmOrOwned: {
                                digest: t,
                                version: r,
                                objectId: rG(e)
                            }
                        }
                    }),
                    SharedObjectRef: ({
                        objectId: e,
                        mutable: t,
                        initialSharedVersion: r
                    }) => ({
                        Object: {
                            Shared: {
                                mutable: t,
                                initialSharedVersion: r,
                                objectId: rG(e)
                            }
                        }
                    })
                };

            function oj(e) {
                return "string" == typeof e ? rG(e) : "ImmOrOwned" in e.Object ? rG(e.Object.ImmOrOwned.objectId) : rG(e.Object.Shared.objectId)
            }
            var oM = {
                    address: "0x2",
                    module: "object",
                    name: "ID"
                },
                o_ = {
                    address: "0x1",
                    module: "ascii",
                    name: "String"
                },
                oU = {
                    address: "0x1",
                    module: "string",
                    name: "String"
                },
                oN = {
                    address: "0x1",
                    module: "option",
                    name: "Option"
                },
                oL = (e, t) => e.address === t.address && e.module === t.module && e.name === t.name;

            function oR(e, t) {
                if (void 0 !== t && typeof t !== e) throw Error(`Expect ${t} to be ${e}, received ${typeof t}`)
            }
            var oD = ["Address", "Bool", "U8", "U16", "U32", "U64", "U128", "U256"],
                oP = eW(eR(eV([eP({
                    Epoch: eU()
                }), eP({
                    None: eV([eN(!0), eN(null)])
                })]))),
                oW = eZ(),
                oz = eO("StringEncodedBigint", e => {
                    if (!["string", "number", "bigint"].includes(typeof e)) return !1;
                    try {
                        return BigInt(e), !0
                    } catch {
                        return !1
                    }
                }),
                oZ = eP({
                    budget: eW(oz),
                    price: eW(oz),
                    payment: eW(eM(rK)),
                    owner: eW(oW)
                }),
                oH = eP({
                    version: eN(1),
                    sender: eW(oW),
                    expiration: oP,
                    gasConfig: oZ,
                    inputs: eM(or),
                    transactions: eM(oy)
                });

            function oV(e) {
                return rG(e).replace("0x", "")
            }
            var oF = class {
                constructor(e) {
                    this.version = 1, this.sender = e?.sender, this.expiration = e?.expiration, this.gasConfig = e?.gasConfig ?? {}, this.inputs = e?.inputs ?? [], this.transactions = e?.transactions ?? []
                }
                static fromKindBytes(e) {
                    var t;
                    let r = ok.de("TransactionKind", e),
                        n = r?.ProgrammableTransaction;
                    if (!n) throw Error("Unable to deserialize from bytes.");
                    let i = (t = {
                        version: 1,
                        gasConfig: {},
                        inputs: n.inputs.map((e, t) => eT({
                            kind: "Input",
                            value: e,
                            index: t,
                            type: eI(e, oC) ? "pure" : "object"
                        }, or)),
                        transactions: n.transactions
                    }, eT(t, oH));
                    return oF.restore(i)
                }
                static fromBytes(e) {
                    var t;
                    let r = ok.de("TransactionData", e),
                        n = r?.V1,
                        i = n?.kind?.ProgrammableTransaction;
                    if (!n || !i) throw Error("Unable to deserialize from bytes.");
                    let o = (t = {
                        version: 1,
                        sender: n.sender,
                        expiration: n.expiration,
                        gasConfig: n.gasData,
                        inputs: i.inputs.map((e, t) => eT({
                            kind: "Input",
                            value: e,
                            index: t,
                            type: eI(e, oC) ? "pure" : "object"
                        }, or)),
                        transactions: i.transactions
                    }, eT(t, oH));
                    return oF.restore(o)
                }
                static restore(e) {
                    eS(e, oH);
                    let t = new oF;
                    return Object.assign(t, e), t
                }
                static getDigestFromBytes(e) {
                    let t = function(e, t) {
                        let r = Array.from(`${e}::`).map(e => e.charCodeAt(0)),
                            n = new Uint8Array(r.length + t.length);
                        return n.set(r), n.set(t, r.length), em(n, {
                            dkLen: 32
                        })
                    }("TransactionData", e);
                    return B(t)
                }
                build({
                    overrides: e,
                    onlyTransactionKind: t
                } = {}) {
                    let r = this.inputs.map(e => (eS(e.value, oB), e.value)),
                        n = {
                            ProgrammableTransaction: {
                                inputs: r,
                                transactions: this.transactions
                            }
                        };
                    if (t) return ok.ser("TransactionKind", n, {
                        maxSize: 131072
                    }).toBytes();
                    let i = e?.expiration ?? this.expiration,
                        o = e?.sender ?? this.sender,
                        s = {
                            ...this.gasConfig,
                            ...e?.gasConfig
                        };
                    if (!o) throw Error("Missing transaction sender");
                    if (!s.budget) throw Error("Missing gas budget");
                    if (!s.payment) throw Error("Missing gas payment");
                    if (!s.price) throw Error("Missing gas price");
                    let a = {
                        sender: oV(o),
                        expiration: i || {
                            None: !0
                        },
                        gasData: {
                            payment: s.payment,
                            owner: oV(this.gasConfig.owner ?? o),
                            price: BigInt(s.price),
                            budget: BigInt(s.budget)
                        },
                        kind: {
                            ProgrammableTransaction: {
                                inputs: r,
                                transactions: this.transactions
                            }
                        }
                    };
                    return ok.ser("TransactionData", {
                        V1: a
                    }, {
                        maxSize: 131072
                    }).toBytes()
                }
                getDigest() {
                    let e = this.build({
                        onlyTransactionKind: !1
                    });
                    return oF.getDigestFromBytes(e)
                }
                snapshot() {
                    return eT(this, oH)
                }
            };

            function o$(e) {
                if (!e) throw Error("No provider passed to Transaction#build, but transaction data was not sufficient to build offline.");
                return e
            }
            var oG = Symbol.for("@mysten/transaction"),
                oq = (e, t) => Array.from({
                    length: Math.ceil(e.length / t)
                }, (r, n) => e.slice(n * t, n * t + t)),
                oK = class {
                    constructor(e) {
                        rU(this, u), rU(this, h), rU(this, p), rU(this, y), rU(this, b), rU(this, l, void 0), rN(this, l, new oF(e ? e.blockData : void 0))
                    }
                    static is(e) {
                        return !!e && "object" == typeof e && !0 === e[oG]
                    }
                    static fromKind(e) {
                        let t = new oK;
                        return rN(t, l, oF.fromKindBytes("string" == typeof e ? A(e) : e)), t
                    }
                    static from(e) {
                        let t = new oK;
                        return "string" == typeof e && e.startsWith("{") ? rN(t, l, oF.restore(JSON.parse(e))) : rN(t, l, oF.fromBytes("string" == typeof e ? A(e) : e)), t
                    }
                    static get Transactions() {
                        return om
                    }
                    static get Inputs() {
                        return oO
                    }
                    setSender(e) {
                        r_(this, l).sender = e
                    }
                    setSenderIfNotSet(e) {
                        r_(this, l).sender || (r_(this, l).sender = e)
                    }
                    setExpiration(e) {
                        r_(this, l).expiration = e
                    }
                    setGasPrice(e) {
                        r_(this, l).gasConfig.price = String(e)
                    }
                    setGasBudget(e) {
                        r_(this, l).gasConfig.budget = String(e)
                    }
                    setGasOwner(e) {
                        r_(this, l).gasConfig.owner = e
                    }
                    setGasPayment(e) {
                        if (e.length >= 256) throw Error("Payment objects exceed maximum amount 256");
                        r_(this, l).gasConfig.payment = e.map(e => ek(e, rK))
                    }
                    get blockData() {
                        return r_(this, l).snapshot()
                    }
                    get[oG]() {
                        return !0
                    }
                    get gas() {
                        return {
                            kind: "GasCoin"
                        }
                    }
                    object(e) {
                        let t = oj(e),
                            r = r_(this, l).inputs.find(e => "object" === e.type && t === oj(e.value));
                        return r ?? rL(this, u, f).call(this, "object", e)
                    }
                    objectRef(...e) {
                        return this.object(oO.ObjectRef(...e))
                    }
                    sharedObjectRef(...e) {
                        return this.object(oO.SharedObjectRef(...e))
                    }
                    pure(e, t) {
                        return rL(this, u, f).call(this, "pure", e instanceof Uint8Array ? oO.Pure(e) : t ? oO.Pure(e, t) : e)
                    }
                    add(e) {
                        let t = r_(this, l).transactions.push(e);
                        return function(e) {
                            let t = [],
                                r = r => t[r] ?? (t[r] = {
                                    kind: "NestedResult",
                                    index: e,
                                    resultIndex: r
                                });
                            return new Proxy({
                                kind: "Result",
                                index: e
                            }, {
                                set() {
                                    throw Error("The transaction result is a proxy, and does not support setting properties directly")
                                },
                                get(e, t) {
                                    if (t in e) return Reflect.get(e, t);
                                    if (t === Symbol.iterator) return function*() {
                                        let e = 0;
                                        for (;;) yield r(e), e++
                                    };
                                    if ("symbol" == typeof t) return;
                                    let n = parseInt(t, 10);
                                    if (!Number.isNaN(n) && !(n < 0)) return r(n)
                                }
                            })
                        }(t - 1)
                    }
                    splitCoins(...e) {
                        return this.add(om.SplitCoins(...e))
                    }
                    mergeCoins(...e) {
                        return this.add(om.MergeCoins(...e))
                    }
                    publish(...e) {
                        return this.add(om.Publish(...e))
                    }
                    upgrade(...e) {
                        return this.add(om.Upgrade(...e))
                    }
                    moveCall(...e) {
                        return this.add(om.MoveCall(...e))
                    }
                    transferObjects(...e) {
                        return this.add(om.TransferObjects(...e))
                    }
                    makeMoveVec(...e) {
                        return this.add(om.MakeMoveVec(...e))
                    }
                    serialize() {
                        return JSON.stringify(r_(this, l).snapshot())
                    }
                    async build({
                        provider: e,
                        onlyTransactionKind: t
                    } = {}) {
                        return await rL(this, b, w).call(this, {
                            provider: e,
                            onlyTransactionKind: t
                        }), r_(this, l).build({
                            onlyTransactionKind: t
                        })
                    }
                    async getDigest({
                        provider: e
                    } = {}) {
                        return await rL(this, b, w).call(this, {
                            provider: e
                        }), r_(this, l).getDigest()
                    }
                },
                oY = oK;
            l = new WeakMap, u = new WeakSet, f = function(e, t) {
                let r = r_(this, l).inputs.length,
                    n = eT({
                        kind: "Input",
                        value: "bigint" == typeof t ? String(t) : t,
                        index: r,
                        type: e
                    }, or);
                return r_(this, l).inputs.push(n), n
            }, h = new WeakSet, d = async function({
                provider: e,
                onlyTransactionKind: t
            }) {
                if (t || r_(this, l).gasConfig.payment) return;
                let r = r_(this, l).gasConfig.owner ?? r_(this, l).sender,
                    n = await o$(e).getCoins({
                        owner: r,
                        coinType: nW
                    }),
                    i = n.data.filter(e => {
                        let t = r_(this, l).inputs.find(t => !!eI(t.value, oB) && "Object" in t.value && "ImmOrOwned" in t.value.Object && e.coinObjectId === t.value.Object.ImmOrOwned.objectId);
                        return !t
                    }).slice(0, 255).map(e => ({
                        objectId: e.coinObjectId,
                        digest: e.digest,
                        version: e.version
                    }));
                if (!i.length) throw Error("No valid gas coins found for the transaction.");
                this.setGasPayment(i)
            }, p = new WeakSet, g = async function({
                provider: e,
                onlyTransactionKind: t
            }) {
                t || r_(this, l).gasConfig.price || this.setGasPrice(await o$(e).getReferenceGasPrice())
            }, y = new WeakSet, m = async function(e) {
                let {
                    inputs: t,
                    transactions: r
                } = r_(this, l), n = [], i = [];
                if (r.forEach(e => {
                        if ("MoveCall" === e.kind) {
                            let r = e.arguments.some(e => "Input" === e.kind && !eI(t[e.index].value, oB));
                            r && n.push(e);
                            return
                        }
                        let r = (eS(e, oy), og.find(t => eI(e, t)));
                        r.schema && Object.entries(e).forEach(([e, n]) => {
                            if ("kind" === e) return;
                            let o = r.schema[e],
                                s = "array" === o.type,
                                a = s ? o.schema[i9] : o[i9];
                            if (!a) return;
                            let c = e => {
                                let r = t[e];
                                if (!r) throw Error(`Missing input ${n.index}`);
                                if (!eI(r.value, oB)) {
                                    if ("object" === a.kind && "string" == typeof r.value) i.push({
                                        id: r.value,
                                        input: r
                                    });
                                    else if ("pure" === a.kind) r.value = oO.Pure(r.value, a.type);
                                    else throw Error("Unexpected input format.")
                                }
                            };
                            if (s) n.forEach(e => {
                                "Input" === e.kind && c(e.index)
                            });
                            else {
                                if ("Input" !== n.kind) return;
                                c(n.index)
                            }
                        })
                    }), n.length && await Promise.all(n.map(async r => {
                        let [n, o, s] = r.target.split("::"), a = await o$(e).getNormalizedMoveFunction({
                            package: rq(n),
                            module: o,
                            function: s
                        }), c = a.parameters.length > 0 && function(e) {
                            let t = ii(e)?.Struct;
                            return t?.address === "0x2" && t?.module === "tx_context" && t?.name === "TxContext"
                        }(a.parameters.at(-1)), l = c ? a.parameters.slice(0, a.parameters.length - 1) : a.parameters;
                        if (l.length !== r.arguments.length) throw Error("Incorrect number of arguments.");
                        l.forEach((e, n) => {
                            let o = r.arguments[n];
                            if ("Input" !== o.kind) return;
                            let s = t[o.index];
                            if (eI(s.value, oB)) return;
                            let a = s.value,
                                c = function e(t, r) {
                                    if ("string" == typeof t && oD.includes(t)) {
                                        if (t in ["U8", "U16", "U32", "U64", "U128", "U256"]) oR("number", r);
                                        else if ("Bool" === t) oR("boolean", r);
                                        else if ("Address" === t && (oR("string", r), r && !r$(r))) throw Error("Invalid Sui Address");
                                        return t.toLowerCase()
                                    }
                                    if ("string" == typeof t) throw Error(`Unknown pure normalized type ${JSON.stringify(t,null,2)}`);
                                    if ("Vector" in t) {
                                        if ((void 0 === r || "string" == typeof r) && "U8" === t.Vector) return "string";
                                        if (void 0 !== r && !Array.isArray(r)) throw Error(`Expect ${r} to be a array, received ${typeof r}`);
                                        let n = e(t.Vector, r ? r[0] : void 0);
                                        if (void 0 === n) return;
                                        return `vector<${n}>`
                                    }
                                    if ("Struct" in t) {
                                        if (oL(t.Struct, o_)) return "string";
                                        if (oL(t.Struct, oU)) return "utf8string";
                                        if (oL(t.Struct, oM)) return "address";
                                        if (oL(t.Struct, oN)) {
                                            let n = {
                                                Vector: t.Struct.typeArguments[0]
                                            };
                                            return e(n, r)
                                        }
                                    }
                                }(e, a);
                            if (c) {
                                s.value = oO.Pure(a, c);
                                return
                            }
                            let l = ii(e);
                            if (null != l || "object" == typeof e && "TypeParameter" in e) {
                                if ("string" != typeof a) throw Error(`Expect the argument to be an object id string, got ${JSON.stringify(a,null,2)}`);
                                i.push({
                                    id: a,
                                    input: s,
                                    normalizedType: e
                                });
                                return
                            }
                            throw Error(`Unknown call arg type ${JSON.stringify(e,null,2)} for value ${JSON.stringify(a,null,2)}`)
                        })
                    })), i.length) {
                    let t = [...new Set(i.map(({
                            id: e
                        }) => e))],
                        r = oq(t, 50),
                        n = (await Promise.all(r.map(t => o$(e).multiGetObjects({
                            ids: t,
                            options: {
                                showOwner: !0
                            }
                        })))).flat(),
                        o = new Map(t.map((e, t) => [e, n[t]])),
                        s = Array.from(o).filter(([e, t]) => t.error).map(([e, t]) => e);
                    if (s.length) throw Error(`The following input objects are not invalid: ${s.join(", ")}`);
                    i.forEach(({
                        id: e,
                        input: t,
                        normalizedType: r
                    }) => {
                        let n = o.get(e),
                            i = function(e) {
                                let t = eI(e, rH) ? e : e.data?.owner;
                                return "object" == typeof t && "Shared" in t ? t.Shared.initial_shared_version : void 0
                            }(n);
                        if (i) {
                            var s;
                            let n = (s = t.value, (("object" == typeof s && "Object" in s && "Shared" in s.Object ? s.Object.Shared : void 0)?.mutable ?? !1) || null != r && null != ir(r));
                            t.value = oO.SharedObjectRef({
                                objectId: e,
                                initialSharedVersion: i,
                                mutable: n
                            })
                        } else t.value = oO.ObjectRef(ne(n))
                    })
                }
            }, b = new WeakSet, w = async function({
                provider: e,
                onlyTransactionKind: t
            }) {
                if (!t && !r_(this, l).sender) throw Error("Missing transaction sender");
                if (await Promise.all([rL(this, p, g).call(this, {
                        provider: e,
                        onlyTransactionKind: t
                    }), rL(this, y, m).call(this, e)]), !t && (await rL(this, h, d).call(this, {
                        provider: e,
                        onlyTransactionKind: t
                    }), !r_(this, l).gasConfig.budget)) {
                    let t = await o$(e).dryRunTransactionBlock({
                        transactionBlock: r_(this, l).build({
                            overrides: {
                                gasConfig: {
                                    budget: String(5e10),
                                    payment: []
                                }
                            }
                        })
                    });
                    if ("success" !== t.effects.status.status) throw Error(`Dry run failed, could not automatically determine a budget: ${t.effects.status.error}`, {
                        cause: t
                    });
                    let r = 1000n * BigInt(this.blockData.gasConfig.price || 1n),
                        n = BigInt(t.effects.gasUsed.computationCost) + r,
                        i = n + BigInt(t.effects.gasUsed.storageCost) - BigInt(t.effects.gasUsed.storageRebate);
                    this.setGasBudget(i > n ? i : n)
                }
            };
            var oJ = eP({
                    currentTps: eD(),
                    tps30Days: eD(),
                    currentCheckpoint: eZ(),
                    currentEpoch: eZ(),
                    totalAddresses: eZ(),
                    totalObjects: eZ(),
                    totalPackages: eZ()
                }),
                oX = {
                    socketOptions: i1,
                    versionCacheTimeoutInSeconds: 600
                },
                oQ = class {
                    constructor(e = i8, t = oX) {
                        this.options = t, this.connection = e;
                        let r = {
                            ...oX,
                            ...t
                        };
                        this.options = r, this.client = r.rpcClient ?? new iq(this.connection.fullnode), this.wsClient = r.websocketClient ?? new i5(this.connection.websocket, r.socketOptions)
                    }
                    async getRpcApiVersion() {
                        if (this.rpcApiVersion && this.cacheExpiry && this.cacheExpiry <= Date.now()) return this.rpcApiVersion;
                        try {
                            let e = await this.client.requestWithType("rpc.discover", [], ej());
                            return this.rpcApiVersion = e.info.version, this.cacheExpiry = Date.now() + (this.options.versionCacheTimeoutInSeconds ?? 0) * 1e3, this.rpcApiVersion
                        } catch (e) {
                            console.warn("Error fetching version number of the RPC API", e)
                        }
                    }
                    async requestSuiFromFaucet(e, t) {
                        if (!this.connection.faucet) throw Error("Faucet URL is not specified");
                        return i3(this.connection.faucet, e, t)
                    }
                    async getCoins(e) {
                        if (!e.owner || !r$(rG(e.owner))) throw Error("Invalid Sui address");
                        return await this.client.requestWithType("suix_getCoins", [e.owner, e.coinType, e.cursor, e.limit], im)
                    }
                    async getAllCoins(e) {
                        if (!e.owner || !r$(rG(e.owner))) throw Error("Invalid Sui address");
                        return await this.client.requestWithType("suix_getAllCoins", [e.owner, e.cursor, e.limit], im)
                    }
                    async getBalance(e) {
                        if (!e.owner || !r$(rG(e.owner))) throw Error("Invalid Sui address");
                        return await this.client.requestWithType("suix_getBalance", [e.owner, e.coinType], ib)
                    }
                    async getAllBalances(e) {
                        if (!e.owner || !r$(rG(e.owner))) throw Error("Invalid Sui address");
                        return await this.client.requestWithType("suix_getAllBalances", [e.owner], eM(ib))
                    }
                    async getCoinMetadata(e) {
                        return await this.client.requestWithType("suix_getCoinMetadata", [e.coinType], nZ)
                    }
                    async getTotalSupply(e) {
                        return await this.client.requestWithType("suix_getTotalSupply", [e.coinType], iw)
                    }
                    async call(e, t) {
                        let r = await this.client.request(e, t);
                        if (eI(r, iG)) throw new iH({
                            req: {
                                method: e,
                                args: t
                            },
                            code: r.error.code,
                            data: r.error.data,
                            cause: Error(r.error.message)
                        });
                        return r.result
                    }
                    async getMoveFunctionArgTypes(e) {
                        return await this.client.requestWithType("sui_getMoveFunctionArgTypes", [e.package, e.module, e.function], nY)
                    }
                    async getNormalizedMoveModulesByPackage(e) {
                        return await this.client.requestWithType("sui_getNormalizedMoveModulesByPackage", [e.package], it)
                    }
                    async getNormalizedMoveModule(e) {
                        return await this.client.requestWithType("sui_getNormalizedMoveModule", [e.package, e.module], ie)
                    }
                    async getNormalizedMoveFunction(e) {
                        return await this.client.requestWithType("sui_getNormalizedMoveFunction", [e.package, e.module, e.function], n8)
                    }
                    async getNormalizedMoveStruct(e) {
                        return await this.client.requestWithType("sui_getNormalizedMoveStruct", [e.package, e.module, e.struct], n7)
                    }
                    async getOwnedObjects(e) {
                        if (!e.owner || !r$(rG(e.owner))) throw Error("Invalid Sui address");
                        return await this.client.requestWithType("suix_getOwnedObjects", [e.owner, {
                            filter: e.filter,
                            options: e.options
                        }, e.cursor, e.limit], ni)
                    }
                    async getObject(e) {
                        if (!e.id || !r$(rq(e.id))) throw Error("Invalid Sui Object id");
                        return await this.client.requestWithType("sui_getObject", [e.id, e.options], r7)
                    }
                    async tryGetPastObject(e) {
                        return await this.client.requestWithType("sui_tryGetPastObject", [e.id, e.version, e.options], no)
                    }
                    async multiGetObjects(e) {
                        e.ids.forEach(e => {
                            if (!e || !r$(rq(e))) throw Error(`Invalid Sui Object id ${e}`)
                        });
                        let t = e.ids.length !== new Set(e.ids).size;
                        if (t) throw Error(`Duplicate object ids in batch call ${e.ids}`);
                        return await this.client.requestWithType("sui_multiGetObjects", [e.ids, e.options], eM(r7))
                    }
                    async queryTransactionBlocks(e) {
                        return await this.client.requestWithType("suix_queryTransactionBlocks", [{
                            filter: e.filter,
                            options: e.options
                        }, e.cursor, e.limit, "descending" === (e.order || "descending")], nR)
                    }
                    async getTransactionBlock(e) {
                        if (!rF(e.digest)) throw Error("Invalid Transaction digest");
                        return await this.client.requestWithType("sui_getTransactionBlock", [e.digest, e.options], nL)
                    }
                    async multiGetTransactionBlocks(e) {
                        e.digests.forEach(e => {
                            if (!rF(e)) throw Error(`Invalid Transaction digest ${e}`)
                        });
                        let t = e.digests.length !== new Set(e.digests).size;
                        if (t) throw Error(`Duplicate digests in batch call ${e.digests}`);
                        return await this.client.requestWithType("sui_multiGetTransactionBlocks", [e.digests, e.options], eM(nL))
                    }
                    async executeTransactionBlock(e) {
                        return await this.client.requestWithType("sui_executeTransactionBlock", ["string" == typeof e.transactionBlock ? e.transactionBlock : T(e.transactionBlock), Array.isArray(e.signature) ? e.signature : [e.signature], e.options, e.requestType], nL)
                    }
                    async getTotalTransactionBlocks() {
                        let e = await this.client.requestWithType("sui_getTotalTransactionBlocks", [], eZ());
                        return BigInt(e)
                    }
                    async getReferenceGasPrice() {
                        let e = await this.client.requestWithType("suix_getReferenceGasPrice", [], eZ());
                        return BigInt(e)
                    }
                    async getStakes(e) {
                        if (!e.owner || !r$(rG(e.owner))) throw Error("Invalid Sui address");
                        return await this.client.requestWithType("suix_getStakes", [e.owner], eM(ic))
                    }
                    async getStakesByIds(e) {
                        return e.stakedSuiIds.forEach(e => {
                            if (!e || !r$(rq(e))) throw Error(`Invalid Sui Stake id ${e}`)
                        }), await this.client.requestWithType("suix_getStakesByIds", [e.stakedSuiIds], eM(ic))
                    }
                    async getLatestSuiSystemState() {
                        return await this.client.requestWithType("suix_getLatestSuiSystemState", [], ig)
                    }
                    async queryEvents(e) {
                        return await this.client.requestWithType("suix_queryEvents", [e.query, e.cursor, e.limit, "descending" === (e.order || "descending")], nc)
                    }
                    async subscribeEvent(e) {
                        return this.wsClient.subscribeEvent(e.filter, e.onMessage)
                    }
                    async unsubscribeEvent(e) {
                        return this.wsClient.unsubscribeEvent(e.id)
                    }
                    async devInspectTransactionBlock(e) {
                        let t;
                        if (oY.is(e.transactionBlock)) e.transactionBlock.setSenderIfNotSet(e.sender), t = T(await e.transactionBlock.build({
                            provider: this,
                            onlyTransactionKind: !0
                        }));
                        else if ("string" == typeof e.transactionBlock) t = e.transactionBlock;
                        else if (e.transactionBlock instanceof Uint8Array) t = T(e.transactionBlock);
                        else throw Error("Unknown transaction block format.");
                        return await this.client.requestWithType("sui_devInspectTransactionBlock", [e.sender, t, e.gasPrice, e.epoch], nj)
                    }
                    async dryRunTransactionBlock(e) {
                        return await this.client.requestWithType("sui_dryRunTransactionBlock", ["string" == typeof e.transactionBlock ? e.transactionBlock : T(e.transactionBlock)], nD)
                    }
                    async getDynamicFields(e) {
                        if (!e.parentId || !r$(rq(e.parentId))) throw Error("Invalid Sui Object id");
                        return await this.client.requestWithType("suix_getDynamicFields", [e.parentId, e.cursor, e.limit], iX)
                    }
                    async getDynamicFieldObject(e) {
                        return await this.client.requestWithType("suix_getDynamicFieldObject", [e.parentId, e.name], r7)
                    }
                    async getLatestCheckpointSequenceNumber() {
                        let e = await this.client.requestWithType("sui_getLatestCheckpointSequenceNumber", [], eZ());
                        return String(e)
                    }
                    async getCheckpoint(e) {
                        return await this.client.requestWithType("sui_getCheckpoint", [e.id], iC)
                    }
                    async getCheckpoints(e) {
                        let t = await this.getRpcApiVersion(),
                            r = await this.client.requestWithType("sui_getCheckpoints", [e.cursor, t && (0, rj.lt)(t, "0.32.0") ? String(e?.limit) : e?.limit, e.descendingOrder], iB);
                        return r
                    }
                    async getCommitteeInfo(e) {
                        return await this.client.requestWithType("suix_getCommitteeInfo", [e?.epoch], id)
                    }
                    async getNetworkMetrics() {
                        return await this.client.requestWithType("suix_getNetworkMetrics", [], oJ)
                    }
                    async getEpochs(e) {
                        let t = await this.getRpcApiVersion();
                        return await this.client.requestWithType("suix_getEpochs", [e?.cursor, t && (0, rj.lt)(t, "0.32.0") ? String(e?.limit) : e?.limit, e?.descendingOrder], ix)
                    }
                    async getMoveCallMetrics() {
                        return await this.client.requestWithType("suix_getMoveCallMetrics", [], n5)
                    }
                    async getCurrentEpoch() {
                        return await this.client.requestWithType("suix_getCurrentEpoch", [], iE)
                    }
                    async getValidatorsApy() {
                        return await this.client.requestWithType("suix_getValidatorsApy", [], is)
                    }
                    async waitForTransactionBlock({
                        signal: e,
                        timeout: t = 6e4,
                        pollInterval: r = 2e3,
                        ...n
                    }) {
                        let i = AbortSignal.timeout(t),
                            o = new Promise((e, t) => {
                                i.addEventListener("abort", () => t(i.reason))
                            });
                        for (; !i.aborted;) {
                            e?.throwIfAborted();
                            try {
                                return await this.getTransactionBlock(n)
                            } catch (e) {
                                await Promise.race([new Promise(e => setTimeout(e, r)), o])
                            }
                        }
                        throw i.throwIfAborted(), Error("Unexpected error while waiting for transaction block.")
                    }
                },
                o0 = ((o = o0 || {})[o.Sui = 0] = "Sui", o),
                o1 = ((s = o1 || {})[s.V0 = 0] = "V0", s),
                o2 = ((a = o2 || {})[a.TransactionData = 0] = "TransactionData", a[a.TransactionEffects = 1] = "TransactionEffects", a[a.CheckpointSummary = 2] = "CheckpointSummary", a[a.PersonalMessage = 3] = "PersonalMessage", a);

            function o5(e, t) {
                let r = [e, 0, 0],
                    n = new Uint8Array(r.length + t.length);
                return n.set(r), n.set(t, r.length), n
            }
            var o3 = class {
                    async requestSuiFromFaucet(e) {
                        return this.provider.requestSuiFromFaucet(await this.getAddress(), e)
                    }
                    constructor(e) {
                        this.provider = e
                    }
                    async signMessage(e) {
                        let t = await this.signData(o5(3, e.message));
                        return {
                            messageBytes: T(e.message),
                            signature: t
                        }
                    }
                    async signTransactionBlock(e) {
                        let t;
                        if (oY.is(e.transactionBlock)) e.transactionBlock.setSenderIfNotSet(await this.getAddress()), t = await e.transactionBlock.build({
                            provider: this.provider
                        });
                        else if (e.transactionBlock instanceof Uint8Array) t = e.transactionBlock;
                        else throw Error("Unknown transaction format");
                        let r = o5(0, t),
                            n = await this.signData(r);
                        return {
                            transactionBlockBytes: T(t),
                            signature: n
                        }
                    }
                    async signAndExecuteTransactionBlock(e) {
                        let {
                            transactionBlockBytes: t,
                            signature: r
                        } = await this.signTransactionBlock({
                            transactionBlock: e.transactionBlock
                        });
                        return await this.provider.executeTransactionBlock({
                            transactionBlock: t,
                            signature: r,
                            options: e.options,
                            requestType: e.requestType
                        })
                    }
                    async getTransactionBlockDigest(e) {
                        if (oY.is(e)) return e.setSenderIfNotSet(await this.getAddress()), e.getDigest({
                            provider: this.provider
                        });
                        if (e instanceof Uint8Array) return oF.getDigestFromBytes(e);
                        throw Error("Unknown transaction format.")
                    }
                    async devInspectTransactionBlock(e) {
                        let t = await this.getAddress();
                        return this.provider.devInspectTransactionBlock({
                            sender: t,
                            ...e
                        })
                    }
                    async dryRunTransactionBlock(e) {
                        let t;
                        if (oY.is(e.transactionBlock)) e.transactionBlock.setSenderIfNotSet(await this.getAddress()), t = await e.transactionBlock.build({
                            provider: this.provider
                        });
                        else if ("string" == typeof e.transactionBlock) t = A(e.transactionBlock);
                        else if (e.transactionBlock instanceof Uint8Array) t = e.transactionBlock;
                        else throw Error("Unknown transaction format");
                        return this.provider.dryRunTransactionBlock({
                            transactionBlock: t
                        })
                    }
                    async getGasCostEstimation(...e) {
                        let t = await this.dryRunTransactionBlock(...e),
                            r = function(e) {
                                let t = eI(e, nk) ? e.gasUsed : e.effects?.gasUsed;
                                return t ? BigInt(t.computationCost) + BigInt(t.storageCost) : void 0
                            }(t.effects);
                        if (void 0 === r) throw Error("Failed to estimate the gas cost from transaction");
                        return r
                    }
                },
                o6 = class extends o3 {
                    constructor(e, t) {
                        super(t), this.keypair = e
                    }
                    async getAddress() {
                        return this.keypair.getPublicKey().toSuiAddress()
                    }
                    async signData(e) {
                        let t = this.keypair.getPublicKey(),
                            r = em(e, {
                                dkLen: 32
                            }),
                            n = this.keypair.signData(r),
                            i = this.keypair.getKeyScheme();
                        return function({
                            signature: e,
                            signatureScheme: t,
                            pubKey: r
                        }) {
                            let n = new Uint8Array(1 + e.length + r.toBytes().length);
                            return n.set([iO[t]]), n.set(e, 1), n.set(r.toBytes(), 1 + e.length), T(n)
                        }({
                            signatureScheme: i,
                            signature: n,
                            pubKey: t
                        })
                    }
                    connect(e) {
                        return new o6(this.keypair, e)
                    }
                };
            rq("0x5")
        },
        5091: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return o
                }
            });
            var n = r(7294);
            let i = (0, n.createContext)({
                init: () => {}
            });
            var o = i
        },
        8804: function(e, t, r) {
            "use strict";
            r.d(t, {
                ZP: function() {
                    return ec
                },
                ap: function() {
                    return es
                },
                Mb: function() {
                    return eo
                }
            });
            var n, i, o = r(7294),
                s = r(8722);
            let a = ({
                    width: e = 32
                }) => o.createElement("img", {
                    src: c,
                    width: e,
                    height: e
                }),
                c = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAAqACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAAAQdIdCAAAACXBIWXMAAAsTAAALEwEAmpwYAAACZmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjU2PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjU2PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiB3yYcAAAgwSURBVFgJrZddiJ1HGcefmXfe9z3n7G42yTYamy9sklZT0XilAeuFdwXxQrD4gVKwF6IXohdS8CYXJWJFwQvprXhTaOhVFakFjbGWioqItKYXprVda0OaNNnd8/F+jr//nN1k16RCwLM778w8M2f+//k/zzzzHme3+Zw+/Zuw+94TK7mvDucxHCws3h2ie19u9p68d3vy3kaFuYG3diH4We/9dJaF2SzLKG58xWfTyz4b/zvPJqsun6zW9eS1j2785ap76Gz333Buu+H0M2+OwrQ5Wzj/YBbNhWiWR2eAG+CxiJ6+WeijK5KNMWssy6YGCdWR4pwbWwgTbGNsam9QxtH5jSfqS6vfuv+hs/UW7g0C33l69WARu38GMx/Mxaw3l5uAXQypPScjQihgxSY51cE3mwQmAApY9Rx8Xs8JZNm6y/z6uCjHRw5+7GdXRMLr8bmnYtZZe6Hx0TdQalUYaVy02qKTjfpGUb/xLjbeotpdn1uMZey60vp+sFlKm/dxYJRddR77mC+0bfZyjKcTNhs221e89khjbhTZTc+DDbrAwmgWIx0sUMGgj6MbkQE3yOY8hTnWFy74HlB1OnOuTaXvW8BZ3eUOEtE5EQn73njxwleY+FMRcJ23M1BL6wQWjJDQ4n3sXX+TiAMSQoBDTNj84SAm43XYQqSkyZS+x9IB1lJvEaghUtOvWB8Sff6DRODrT720UFm717uMfTrWnxPp5VuBg8KSLnrUoEMcYmQO+8eDPMRHIokWoduVLkge1yXwmwTkkgqCBTVh7sPKhec/sxTqpeye2MKSBWPEsS5jB2wGcJFgYzBXu8MGCW1Wam0S2VJLdqbyBUK4G9CUC+SKDkAFacPUGn2IpjgDo3QL+cL7Q9O3xwnF6NmlAc6IdgtgFg/sLu3LJ1fcgeVCS+uTMObN2z53jM/GtV144YJV641IMFZBpKZdooACM9wXWl8fz5JgWfSA9z7AFAlQ5Esn73YXrkztr29xtFAjFThkYCM2tUs29jzvy0ZRX8d3tOjcoRNH7JUX1llPKtSclArwASoUwJTHyTHN0R4JCDnAgQDcm1c02PdffD1WtUAUIT7mSB9UEwvzXOBSPiixFXBWTijx2QAxKW5A0AyH5Jx+gd12gDeAb5EYupDNjobeNUcURYouoOZuYEGcZSujwj1y6qAd2lVK7y15t+rtPridzaYbnf3t3FWbrin4dCIatK6oZxAiX8TyMATa/TEpAAGCjJ0TTiLU2Vc/csxevrJmf740D3+FmcY0C0QiZu4WuUJp+0ZNWxlz12Kwwx9espfP1wQmIU1K0zH0viJTzmLXTvZLgZUEmBbPmCAAojLL4mN//LubNQJnaSnU4wg8zHFjVsAluAIg+bsg4AesgQtSe8isAbbdRWBmsEG3IAWso2RZzcGb4o7RXaHz7aLETwBKe0CwbgJZGZX2tQ/da0eWRtvltrcnjT3661f5SmYd5Fpi49EHD9reUUqsW+5wG+PWfnv+HZtWMCFdu3YXB4yk39aAJwUW2G49FKuOC2WzxN63Ue1vn/zALeBictcot6JouTMq7oTaFtnCJvgOoosLwT5+atnGxPaEUsXSte0ujuEuFFgiNS+XvnUtV3zDGaAA2rua01CTnmvbNxzsWHB75wv3v9f2LMRE5NP3LW8f2tFe2V0kAmOO9QTPVt3QmmY5EWm7xSKwW6U7PImL0pNZ8rfy/c3I37GoOg8cWEnlloHbGDa0lBJLRzzpr1s03yovVBbKjszEaJ/h+5TUcS2HheeWL2+z5J2Z1nRLEictSyrLKF35djdx0MQwaGrdXSRBT4Q6FXI+9wH1ncG8++w13VESgA2S7ri5kKHjZNV72jDqmoqoJxB1oyYCUoIY+N8ueHe4W0fGWU3A5rzgoIRncyDo7vTdoAnDtpr20Q+VfuZF11Jq/98UaMIYF5Sx4RqucUUdUJvXUw79LAyb9hqS7NXZl9vlfmKCE+Hj6vXL7uDyvlu3dAeWy7OpVdm6Zb7idJXWdgOrRQYNeO275kdVdWnU1kaJo7oylYWmjov1zD39p1/atcnaHcDtnHpx4x0789IfrM7XrQprbPe6zYprcZJfd1fyqb0Z2kth2NcX0fyUAkMxoIPCoZASce3tVffjZ35CctTdKGWQDWWSSvhQth7VFFyKGQq+9lw7ngSVWRMCL668H2WB3Sqd58R/4ZqsjDnvBE278I8wqGbnvPdf1GKQSGBC2GzLTyI1J5cIklXlrnRSAYXuZuyk+gYZEfEqEMnmZQaZJuSxznJXe37a+Py5EKb1s2WZ6fbV4dAjPclJMuEphkDTmKaIkKZIKeWt+Ty1PQTS24RebrFLFdRhXg8JyEglq7MM8GD8lLK1xp8XsHvyiW+us+ZIgHMeetObExGHBK7BTRLCTqQSmTkx2cQwqYUdYonknKyIY9h0JW7D6378jYfP7ArazJM/XPvgMC9f1wJbsFpbfX2SCKigQyLkZEqDEkZC6V/jtJMkvGGk9uZyvNUq/2HizYpET32tqk5gSotRm/388YcfKDN/PnW0fxoq+iCiFhbXTTt1wo2WycjZVl9trjjJqJd8ARF0OANb1ne8pDCgV+wufvKe7/3id/O1E8T88exjnz+0lGWvADwUqAIg1VKG72q3XFWprcX17qzzke4aEjpgAqSvObKnLwlUDX1/YzKLJ4796FdvbMFubXKrr9r9/rufPTwo4icG0T5F/yjy7WeHe1iIG94VLM7VlX6qCEgy8g9i1M9FXvzMJkhyFa5vMXiRS/D5qqueO/b4uX9p4naw/wDv1ZplvOGRpgAAAABJRU5ErkJggg==";
            (n = i || (i = {}))[n.sm = 640] = "sm", n[n.md = 768] = "md", n[n.lg = 1024] = "lg", n[n.xl = 1280] = "xl", n[n["2xl"] = 1536] = "2xl";
            let l = "#74777C",
                u = () => ({
                    fontSize: "18px",
                    lineHeight: "24px",
                    fontWeight: "600",
                    marginLeft: "10px"
                }),
                f = () => ({
                    color: "#6B7280",
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }),
                h = e => ({
                    visibility: e ? "" : "hidden",
                    position: "relative",
                    zIndex: "100"
                }),
                d = e => ({
                    position: "fixed",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                    backgroundColor: "rgb(107 114 128)",
                    opacity: e ? ".75" : "0",
                    transition: "all 300ms ease-in-out"
                }),
                p = () => ({
                    color: "#6D28D9"
                }),
                g = e => ({
                    position: "fixed",
                    zIndex: "99",
                    top: "0px",
                    right: "0px",
                    bottom: "0px",
                    left: "0px",
                    overflowY: "auto",
                    opacity: e ? "1" : "0",
                    scale: e ? "1" : ".95",
                    transition: "all 300ms ease-in-out"
                }),
                y = e => {
                    let t = {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100%",
                        padding: "1rem",
                        textAlign: "center"
                    };
                    return e < i.sm ? t : {
                        ...t,
                        padding: "0",
                        alignItems: "center"
                    }
                },
                m = e => {
                    let t = {
                        overflow: "hidden",
                        position: "relative",
                        backgroundColor: "#ffffff",
                        transitionProperty: "all",
                        borderRadius: "0.5rem",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    };
                    return e < i.sm ? t : {
                        ...t,
                        width: "360px"
                    }
                },
                b = () => ({
                    padding: "24px 24px 0px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center"
                }),
                w = () => ({
                    width: "24px",
                    height: "24px",
                    color: "#A0AEBA",
                    cursor: "pointer"
                }),
                v = () => ({
                    color: l,
                    cursor: "pointer",
                    display: "flex",
                    gap: "6px",
                    alignItems: "center"
                }),
                E = () => ({
                    fontSize: "16px",
                    lineHeight: "24px"
                }),
                x = (e = !1) => ({
                    padding: e ? "24px 24px 32px" : "0 24px 32px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "12px"
                }),
                A = () => ({
                    display: "flex",
                    justifyContent: "center",
                    gap: "-6px"
                }),
                S = () => ({
                    fontSize: "24px",
                    fontWeight: "600",
                    lineHeight: "32px",
                    margin: "0"
                }),
                T = () => ({
                    fontSize: "16px",
                    fontWeight: "400",
                    lineHeight: "24px",
                    margin: "0",
                    color: l
                }),
                k = () => ({
                    padding: "0px 24px 24px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "12px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: l
                }),
                I = () => ({
                    height: "1px",
                    width: "100%",
                    background: "rgba(0, 0, 0, 0.12)",
                    borderRadius: "16px"
                }),
                C = () => ({
                    boxSizing: "border-box",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                    borderRadius: "16px",
                    background: "#F2F2F2",
                    padding: "20px",
                    width: "100%"
                }),
                B = e => {
                    let t = {
                        padding: "0px 24px 24px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "12px"
                    };
                    return e < i.sm ? t : {
                        ...t
                    }
                },
                O = (e, t = !1, r = !1, n = !1) => {
                    let o = {
                        textDecoration: "none",
                        fontWeight: r ? "500" : "400",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "row",
                        gap: "12px",
                        justifyContent: n ? "center" : "space-between",
                        alignItems: "center",
                        padding: r ? "20px 20px" : "16px 16px 16px 20px",
                        width: "100%",
                        background: r ? "#6D28D9" : "#F2F2F2",
                        color: r ? "white" : "black",
                        opacity: t ? .5 : 1,
                        cursor: t ? "not-allowed" : "pointer",
                        borderRadius: "16px",
                        flex: "none",
                        order: "0",
                        flexGrow: "0",
                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
                        border: "none",
                        fontSize: "inherit"
                    };
                    return e < i.sm ? o : {
                        ...o
                    }
                },
                j = () => ({
                    padding: "0px 24px 24px"
                }),
                M = () => ({
                    display: "flex",
                    justifyContent: "center",
                    padding: "45px 0"
                }),
                _ = () => ({
                    padding: "6px 0",
                    color: "#666",
                    width: "100%",
                    fontSize: "smaller",
                    marginBottom: "12px"
                }),
                U = ({
                    width: e = 24,
                    color: t = "#6D28D9"
                }) => o.createElement("svg", {
                    width: e,
                    height: e,
                    viewBox: "0 0 56 56",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                }, o.createElement("rect", {
                    width: "56",
                    height: "56",
                    rx: "16",
                    fill: t
                }), o.createElement("path", {
                    opacity: "0.8",
                    d: "M17.9631 13H36.9268C37.7997 13 38.5073 13.7076 38.5073 14.5805V35.9802C38.5073 36.8531 37.7997 37.5607 36.9268 37.5607H17.9631C17.0902 37.5607 16.3826 36.8531 16.3826 35.9802V14.5805C16.3826 13.7076 17.0902 13 17.9631 13Z",
                    stroke: "url(#paint0_linear_514_2169)",
                    strokeOpacity: "0.9",
                    strokeWidth: "0.790251"
                }), o.createElement("path", {
                    d: "M17.2471 14.0457L30.1651 20.0566C30.7225 20.316 31.0789 20.8749 31.0789 21.4896V42.6676C31.0789 43.8113 29.9018 44.5763 28.8566 44.112L15.9386 38.3725C15.3677 38.1189 14.9998 37.5528 14.9998 36.9281V15.4787C14.9998 14.3231 16.1994 13.5582 17.2471 14.0457Z",
                    fill: "white",
                    fillOpacity: "0.9"
                }), o.createElement("path", {
                    d: "M42.9117 27.9093C43.0029 27.4813 43.219 27.0901 43.5329 26.7851C43.8467 26.4801 44.2441 26.2753 44.6746 26.1965L45.8205 25.9872L44.6745 25.7779H44.6746C44.2441 25.6991 43.8467 25.4943 43.5329 25.1893C43.219 24.8843 43.0029 24.4931 42.9117 24.0651L42.6596 22.8774L42.4074 24.0651C42.3162 24.4931 42.1001 24.8843 41.7862 25.1893C41.4724 25.4943 41.075 25.6992 40.6445 25.7779L39.4985 25.9872L40.6446 26.1965H40.6445C41.075 26.2753 41.4724 26.4801 41.7861 26.7851C42.1 27.0901 42.3162 27.4813 42.4073 27.9093L42.6595 29.097L42.9117 27.9093Z",
                    fill: "white",
                    fillOpacity: "0.9"
                }), o.createElement("defs", null, o.createElement("linearGradient", {
                    id: "paint0_linear_514_2169",
                    x1: "38.5073",
                    y1: "19.5371",
                    x2: "27.4445",
                    y2: "25.0685",
                    gradientUnits: "userSpaceOnUse"
                }, o.createElement("stop", {
                    stopColor: "white"
                }), o.createElement("stop", {
                    offset: "1",
                    stopColor: "white",
                    stopOpacity: "0"
                })))),
                N = ({
                    width: e = 24,
                    color: t = "#1e293b"
                }) => o.createElement("svg", {
                    width: e,
                    height: 65 * e / 47,
                    viewBox: "0 0 47 65",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                }, o.createElement("path", {
                    d: "M6.00471 1H40.0029C42.7644 1 45.0029 3.23858 45.0029 6V44.8425C45.0029 47.604 42.7643 49.8425 40.0029 49.8425H6.0047C3.24328 49.8425 1.0047 47.604 1.0047 44.8425V6C1.0047 3.23858 3.24329 1 6.00471 1Z",
                    stroke: t,
                    strokeWidth: "2"
                }), o.createElement("path", {
                    d: "M6.68764 3.64648L30.6631 14.8026C32.0736 15.4589 32.9756 16.8735 32.9756 18.4292V58.6799C32.9756 61.5743 29.9966 63.5105 27.3515 62.3353L3.37601 51.683C1.93126 51.0411 1.00013 49.6085 1.00013 48.0276V7.27309C1.00013 4.34854 4.03609 2.41268 6.68764 3.64648Z",
                    fill: t
                })),
                L = ({
                    title: e,
                    subTitle: t,
                    dappIcon: r,
                    showEthos: n = !1,
                    children: i
                }) => o.createElement("div", null, o.createElement("div", {
                    style: x(!!r)
                }, o.createElement("div", {
                    style: A()
                }, r && ("string" == typeof r ? o.createElement("img", {
                    src: r
                }) : r), n && o.createElement(N, null)), e && o.createElement("div", {
                    style: S()
                }, e), t && o.createElement("div", {
                    style: T()
                }, t)), i),
                R = () => o.createElement(L, {
                    title: "Ethos sent you an email",
                    dappIcon: o.createElement(U, {
                        width: 60
                    })
                }, o.createElement("div", {
                    style: f()
                }, o.createElement("p", null, "An email has been sent to you with a link to login."), o.createElement("p", null, "If you don't receive it, please check your spam folder or contact us at:"), o.createElement("p", null, "support@ethoswallet.xyz"))),
                D = e => {
                    let {
                        text: t,
                        icon: r,
                        width: n,
                        disabled: i,
                        primary: s,
                        type: a,
                        ...c
                    } = e;
                    return o.createElement("button", {
                        style: O(n, i, s, !r),
                        ...c,
                        type: a
                    }, o.createElement("div", null, t), r)
                },
                P = ({
                    wallets: e,
                    selectWallet: t,
                    width: r
                }) => {
                    //exclude unwanted wallets 
                    if (e) {
                        for (let n=e.length-1; n>0; n--) {
                            if (e[n].name != "Ethos Wallet" && e[n].name != "Suiet") {
                                e.splice(n, 1);
                            }
                        }
                    }
                    
                    let n = (0, o.useCallback)(e => {
                            if (!t) return;
                            let r = e.target,
                                n;
                            for (; !n && r.parentNode;) n = r.dataset.name, r = r.parentNode;
                            t(n)
                        }, []),
                        i = (0, o.useCallback)(e => o.createElement("img", {
                            src: e.icon,
                            height: 32,
                            width: 32
                        }), []);
                    return o.createElement("div", {
                        role: "wallet-sign-in"
                    }, o.createElement("div", {
                        style: B(r)
                    }, e?.map((e, t) => o.createElement(D, {
                        key: `select-wallet-${t}`,
                        icon: i(e),
                        "data-name": e.name,
                        text: e.name,
                        onClick: n,
                        width: r
                    }))))
                };
            var W = r(5860),
                z = r(1111);
            let Z = async e => {
                (0, z.Z)({
                    action: "event",
                    data: e
                })
            };
            var H = r(538);
            let V = ({
                    setSigningIn: e,
                    setEmailSent: t,
                    width: r
                }) => {
                    let {
                        apiKey: n
                    } = (0, W.Z)(), [i, s] = (0, o.useState)(""), a = (0, o.useMemo)(() => !!i && 0 !== i.length && !!i.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/), [i]), c = (0, o.useCallback)(async () => {
                        a && (await (0, H.Z)({
                            email: i,
                            apiKey: n
                        }), s(""), e(!1), t(!0), Z({
                            action: "send_email",
                            category: "sign_in",
                            label: i,
                            value: 1
                        }))
                    }, [a, H.Z, i, n]), l = (0, o.useCallback)(e => {
                        s(e.target.value)
                    }, []), u = (0, o.useCallback)(async t => {
                        if (!a) {
                            t.preventDefault();
                            return
                        }
                        e(!0), c()
                    }, [c]);
                    return o.createElement("div", {
                        role: "email-sign-ins"
                    })
                },
                F = ({
                    children: e
                }) => o.createElement(o.Fragment, null, o.createElement("link", {
                    href: "https://rsms.me/inter/inter.css",
                    rel: "stylesheet"
                }), o.createElement("div", {
                    style: {
                        fontFamily: "'Inter', sans-serif",
                        color: "black",
                        lineHeight: "1.5",
                        fontSize: "16px"
                    }
                }, e)),
                $ = ({
                    isOpenAll: e,
                    children: t
                }) => o.createElement(F, null, o.createElement("div", {
                    style: h(e),
                    role: "dialog"
                }, o.createElement("div", {
                    style: d(e)
                }), t)),
                G = ({
                    closeOnClickId: e,
                    onClose: t,
                    isOpenAll: r,
                    width: n,
                    back: i,
                    children: s
                }) => o.createElement("div", {
                    style: g(r)
                }, o.createElement("div", {
                    id: e,
                    style: y(n)
                }, o.createElement("div", {
                    style: m(n)
                }, o.createElement("div", {
                    style: b()
                }, o.createElement("span", null, i && o.createElement("span", {
                    style: v(),
                    onClick: i
                }, "←", o.createElement("span", {
                    style: E()
                }, "Back"))), o.createElement("span", {
                    style: w(),
                    onClick: t
                }, o.createElement("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    strokeWidth: 1.5,
                    stroke: "currentColor"
                }, o.createElement("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M6 18L18 6M6 6l12 12"
                })))), s))),
                q = ({
                    width: e = 60
                }) => o.createElement("svg", {
                    width: e,
                    height: e,
                    viewBox: "0 0 60 60",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                }, o.createElement("rect", {
                    x: "1",
                    y: "1",
                    width: "58",
                    height: "58",
                    rx: "17",
                    fill: "#1A1C26"
                }), o.createElement("path", {
                    d: "M17.0307 21.5C18.1258 20.5314 19.538 19.9977 21 20H39C40.5213 20 41.9107 20.5667 42.9693 21.5C42.8475 20.5332 42.377 19.6442 41.6462 18.9998C40.9153 18.3553 39.9744 17.9998 39 18H21C20.0256 17.9998 19.0847 18.3553 18.3538 18.9998C17.623 19.6442 17.1525 20.5332 17.0307 21.5ZM17.0307 25.5C18.1258 24.5314 19.538 23.9977 21 24H39C40.5213 24 41.9107 24.5667 42.9693 25.5C42.8475 24.5332 42.377 23.6442 41.6462 22.9998C40.9153 22.3553 39.9744 21.9998 39 22H21C20.0256 21.9998 19.0847 22.3553 18.3538 22.9998C17.623 23.6442 17.1525 24.5332 17.0307 25.5ZM21 26C19.9391 26 18.9217 26.4214 18.1716 27.1716C17.4214 27.9217 17 28.9391 17 30V38C17 39.0609 17.4214 40.0783 18.1716 40.8284C18.9217 41.5786 19.9391 42 21 42H39C40.0609 42 41.0783 41.5786 41.8284 40.8284C42.5786 40.0783 43 39.0609 43 38V30C43 28.9391 42.5786 27.9217 41.8284 27.1716C41.0783 26.4214 40.0609 26 39 26H34C33.7348 26 33.4804 26.1054 33.2929 26.2929C33.1054 26.4804 33 26.7348 33 27C33 27.7956 32.6839 28.5587 32.1213 29.1213C31.5587 29.6839 30.7956 30 30 30C29.2044 30 28.4413 29.6839 27.8787 29.1213C27.3161 28.5587 27 27.7956 27 27C27 26.7348 26.8946 26.4804 26.7071 26.2929C26.5196 26.1054 26.2652 26 26 26H21Z",
                    fill: "white"
                }), o.createElement("rect", {
                    x: "1",
                    y: "1",
                    width: "58",
                    height: "58",
                    rx: "17",
                    stroke: "#060914",
                    strokeWidth: "2"
                })),
                K = ({
                    width: e = 32
                }) => o.createElement("svg", {
                    width: e,
                    height: e,
                    viewBox: "0 0 32 32",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                }, o.createElement("rect", {
                    width: "32",
                    height: "32",
                    rx: "8",
                    fill: "#81BAEB"
                }), o.createElement("g", {
                    clipPath: "url(#clip0_315_6756)"
                }, o.createElement("path", {
                    fillRule: "evenodd",
                    clipRule: "evenodd",
                    d: "M10.4932 22.2659C11.0635 23.2776 11.8925 24.1195 12.8953 24.7053C13.898 25.2912 15.0385 25.5999 16.1999 25.5999C17.3613 25.5999 18.5017 25.2912 19.5045 24.7053C20.5073 24.1195 21.3363 23.2776 21.9066 22.2659C22.4918 21.2523 22.7999 20.1025 22.7999 18.932C22.7999 17.7616 22.4918 16.6118 21.9066 15.5982L16.8874 6.80155C16.8187 6.67967 16.7188 6.57825 16.598 6.50767C16.4772 6.4371 16.3398 6.3999 16.1999 6.3999C16.06 6.3999 15.9226 6.4371 15.8018 6.50767C15.6809 6.57825 15.5811 6.67967 15.5123 6.80155L10.4932 15.5982C9.90796 16.6118 9.59985 17.7616 9.59985 18.932C9.59985 20.1025 9.90796 21.2523 10.4932 22.2659ZM14.786 10.9865L15.8561 9.11092C15.8905 9.04998 15.9404 8.99927 16.0008 8.96399C16.0612 8.9287 16.1299 8.9101 16.1999 8.9101C16.2698 8.9101 16.3385 8.9287 16.399 8.96399C16.4594 8.99927 16.5093 9.04998 16.5437 9.11092L20.6605 16.3263C21.0301 16.966 21.2592 17.6771 21.3326 18.4123C21.4061 19.1475 21.3221 19.8898 21.0864 20.59C21.0352 20.3514 20.9648 20.1172 20.8758 19.8899C20.3072 18.4377 19.0214 17.3171 17.0534 16.559C15.7004 16.0397 14.8368 15.276 14.4859 14.2886C14.0339 13.0166 14.506 11.6291 14.786 10.9865ZM12.9612 14.1847L11.7392 16.3263C11.2817 17.1186 11.0409 18.0174 11.0409 18.9323C11.0409 19.8472 11.2817 20.7459 11.7392 21.5382C12.1091 22.1934 12.6186 22.7591 13.2316 23.1952C13.8447 23.6312 14.5462 23.927 15.2864 24.0615C16.0266 24.1959 16.7874 24.1658 17.5146 23.9732C18.2419 23.7806 18.9178 23.4302 19.4944 22.947C19.8131 22.1324 19.8244 21.2296 19.5264 20.4072C19.1088 19.358 18.1034 18.5204 16.5383 17.9172C14.7692 17.2381 13.6199 16.178 13.1228 14.7672C13.0558 14.5769 13.0019 14.3823 12.9612 14.1847Z",
                    fill: "white"
                })), o.createElement("defs", null, o.createElement("clipPath", {
                    id: "clip0_315_6756"
                }, o.createElement("rect", {
                    width: "19.2",
                    height: "19.2",
                    fill: "white",
                    transform: "translate(6.3999 6.3999)"
                })))),
                Y = () => o.createElement("svg", {
                    width: "32",
                    height: "32",
                    viewBox: "0 0 32 32",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg"
                }, o.createElement("rect", {
                    width: "32",
                    height: "32",
                    rx: "8",
                    fill: "#6D28D9"
                }), o.createElement("path", {
                    opacity: "0.8",
                    d: "M9.12187 6.85706H19.9583C20.4571 6.85706 20.8614 7.26141 20.8614 7.7602V19.9886C20.8614 20.4874 20.4571 20.8918 19.9583 20.8918H9.12187C8.62308 20.8918 8.21872 20.4874 8.21872 19.9886V7.7602C8.21872 7.26141 8.62308 6.85706 9.12187 6.85706Z",
                    stroke: "url(#paint0_linear_699_2698)",
                    strokeWidth: "0.451572"
                }), o.createElement("path", {
                    d: "M8.71274 7.45459L16.0945 10.8894C16.4129 11.0376 16.6166 11.357 16.6166 11.7083V23.81C16.6166 24.4635 15.944 24.9007 15.3468 24.6353L7.96502 21.3556C7.63882 21.2107 7.42858 20.8872 7.42858 20.5303V8.27343C7.42858 7.61311 8.11406 7.17602 8.71274 7.45459Z",
                    fill: "white"
                }), o.createElement("path", {
                    d: "M23.3782 15.3767C23.4303 15.1321 23.5538 14.9086 23.7332 14.7343C23.9125 14.56 24.1396 14.443 24.3856 14.3979L25.0404 14.2784L24.3855 14.1588H24.3856C24.1396 14.1137 23.9125 13.9967 23.7332 13.8224C23.5538 13.6481 23.4303 13.4246 23.3782 13.18L23.2341 12.5013L23.09 13.18C23.0379 13.4246 22.9144 13.6481 22.7351 13.8224C22.5558 13.9967 22.3287 14.1138 22.0827 14.1588L21.4278 14.2784L22.0827 14.3979H22.0827C22.3287 14.443 22.5557 14.56 22.735 14.7343C22.9144 14.9086 23.0379 15.1321 23.09 15.3767L23.2341 16.0554L23.3782 15.3767Z",
                    fill: "white"
                }), o.createElement("defs", null, o.createElement("linearGradient", {
                    id: "paint0_linear_699_2698",
                    x1: "20.8614",
                    y1: "10.5926",
                    x2: "14.5398",
                    y2: "13.7534",
                    gradientUnits: "userSpaceOnUse"
                }, o.createElement("stop", {
                    stopColor: "white"
                }), o.createElement("stop", {
                    offset: "1",
                    stopColor: "white",
                    stopOpacity: "0"
                })))),
                J = ({
                    walletInfos: e,
                    width: t
                }) => {
                    let r = e => e ? "string" == typeof e ? o.createElement("img", {
                            src: e,
                            height: 32,
                            width: 32
                        }) : e : o.createElement(o.Fragment, null),
                        n = [{
                            name: "Ethos Wallet",
                            icon: o.createElement(Y, null),
                            link: "https://chrome.google.com/webstore/detail/ethos-wallet/mcbigmjiafegjnnogedioegffbooigli"
                        }, {
                            name: "Sui Wallet",
                            icon: o.createElement(K, null),
                            link: "https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
                        }, ...e || []];
                    return o.createElement(L, {
                        dappIcon: o.createElement(q, null),
                        title: "Install A Wallet",
                        subTitle: "Wallets allow you to interact with, store, send, and receive digital assets."
                    }, o.createElement("div", {
                        role: "wallet-sign-in"
                    }, o.createElement("div", {
                        style: B(t)
                    }, n?.map((e, n) => o.createElement("a", {
                        key: `install-wallet-${n}`,
                        style: O(t),
                        href: e.link,
                        target: "_blank"
                    }, e.name, o.createElement("div", null, r(e.icon)))))))
                };
            var X = r(7055),
                Q = r(6046);

            function ee() {
                if ("undefined" == typeof window) return {
                    width: 0,
                    height: 0
                };
                let {
                    innerWidth: e,
                    innerHeight: t
                } = window;
                return {
                    width: e,
                    height: t
                }
            }
            let et = {
                    useModal: X.Z,
                    useWallet: Q.Z,
                    useWindowDimensions: function() {
                        let [e, t] = (0, o.useState)({
                            width: 0,
                            height: 0
                        });
                        return (0, o.useEffect)(() => {
                            function e() {
                                t(ee())
                            }
                            return t(ee()), window.addEventListener("resize", e), () => window.removeEventListener("resize", e)
                        }, []), e
                    }
                },
                er = () => o.createElement("div", {
                    role: "wallet-sign-in"
                }, o.createElement("span", {
                    style: u()
                }, "Connect A Mobile Wallet"), o.createElement("div", {
                    style: _()
                }, o.createElement("p", null, "There are no mobile wallets yet on Sui."))),
                en = () => o.createElement("div", {
                    style: k()
                });
            var ei = r(7752);

            function eo() {
                window.ethosInternal.showSignInModal()
            }

            function es() {
                window.ethosInternal.hideSignInModal()
            }
            let ea = ({
                connectMessage: e,
                dappName: t,
                dappIcon: r,
                hideEmailSignIn: n,
                hideWalletSignIn: i,
                externalContext: c,
                preferredWallets: l
            }) => {
                n = true;
                let {
                    wallets: u,
                    selectWallet: f
                } = c?.wallet || et.useWallet(), {
                    isModalOpen: h,
                    openModal: d,
                    closeModal: g
                } = c?.modal || et.useModal(), [y, m] = (0, o.useState)(h), [b, w] = (0, o.useState)(!1), [v, E] = (0, o.useState)(!1), {
                    width: x
                } = et.useWindowDimensions(), A = "ethos-close-on-click", [S, T] = (0, o.useState)(!1), [k, I] = (0, o.useState)(!1), [C, B] = (0, o.useState)(!1), [O, _] = (0, o.useState)(t), [U, N] = (0, o.useState)();
                (0, o.useEffect)(() => {
                    function e(e) {
                        e.target.id === A && g()
                    }
                    return document.addEventListener("mousedown", e), () => {
                        document.removeEventListener("mousedown", e)
                    }
                }, []), (0, o.useEffect)(() => {
                    window.ethosInternal || (window.ethosInternal = {}), window.ethosInternal.showSignInModal = () => {
                        d()
                    }, window.ethosInternal.hideSignInModal = () => {
                        g()
                    }, m(h)
                }, [h, m, d, g]), (0, o.useEffect)(() => {
                    if (n && i) throw Error("hideEmailSignIn and hideWalletSignIn cannot both be true")
                }, [n, i]), (0, o.useEffect)(() => {
                    O || _(document.title)
                }, [O]), (0, o.useEffect)(() => {
                    let e = u || [];
                    l && l.length > 0 && (e = e.sort((t, r) => {
                        let n = l.indexOf(t.name); - 1 === n && (n = e.length);
                        let i = l.indexOf(r.name);
                        return -1 === i && (i = e.length), n - i
                    })), (0, ei.Z)("preferredWallets", l, e), N(e)
                }, [u, l, ei.Z]);
                let W = (0, o.useCallback)(() => {
                        B(e => !e)
                    }, []),
                    z = (0, o.useCallback)(() => {
                        T(e => !e)
                    }, []),
                    Z = (0, o.useCallback)(() => {
                        B(!1), I(!1), T(!1)
                    }, []),
                    H = (0, o.useMemo)(() => e || (O ? o.createElement(o.Fragment, null, "Connect to ", o.createElement("span", {
                        style: p()
                    }, O)) : o.createElement(o.Fragment, null)), [O, e]),
                    F = (0, o.useMemo)(() => U ? k ? o.createElement(er, null) : C || n && 0 === U.length ? o.createElement(J, {
                        width: x
                    }) : i ? o.createElement(V, {
                        setSigningIn: w,
                        setEmailSent: E,
                        width: x
                    }) : !S && U.length > 0 ? o.createElement(L, {
                        title: H,
                        dappIcon: r,
                        subTitle: "Choose from your installed wallets"
                    }, o.createElement(P, {
                        wallets: U,
                        selectWallet: f,
                        width: x
                    }), !n && o.createElement(o.Fragment, null, o.createElement(en, null), o.createElement("div", {
                        style: j()
                    }))) : o.createElement(L, {
                        title: H,
                        dappIcon: r,
                        subTitle: `Log in to ${O}`
                    }, o.createElement(V, {
                        setSigningIn: w,
                        setEmailSent: E,
                        width: x
                    }), !i && o.createElement(o.Fragment, null, o.createElement(en, null), o.createElement("div", {
                        style: j()
                    }, U.length > 0 ? o.createElement(D, {
                        icon: o.createElement(a, null),
                        text: "Select One Of Your Wallets",
                        onClick: z,
                        width: x
                    }) : o.createElement(D, {
                        icon: o.createElement(a, null),
                        text: "Install A Wallet",
                        onClick: W,
                        width: x
                    })))) : o.createElement(o.Fragment, null), [H, O, n, i, U, S, k, C]),
                    q = (0, o.useMemo)(() => k || C, [k, C]),
                    K = (0, o.useMemo)(() => o.createElement("div", {
                        style: M()
                    }, o.createElement(s.Z, {
                        width: 50
                    })), []);
                return o.createElement($, {
                    isOpenAll: y
                }, o.createElement(G, {
                    closeOnClickId: A,
                    onClose: g,
                    isOpenAll: y,
                    width: x,
                    back: q ? Z : null
                }, v ? o.createElement(R, null) : b ? K : F))
            };
            var ec = ea
        },
        8722: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return o
                }
            });
            var n = r(7294);
            let i = ({
                width: e = 100,
                color: t = "#333"
            }) => n.createElement("svg", {
                version: "1.1",
                id: "L4",
                xmlns: "http://www.w3.org/2000/svg",
                x: "0px",
                y: "0px",
                viewBox: "0 0 54 20",
                width: e,
                height: e * (20 / 54),
                enableBackground: "new 0 0 0 0"
            }, n.createElement("circle", {
                fill: t,
                stroke: "none",
                cx: "6",
                cy: "10",
                r: "6"
            }, n.createElement("animate", {
                attributeName: "opacity",
                dur: "1.5s",
                values: "0;1;0",
                repeatCount: "indefinite",
                begin: "0.1"
            })), n.createElement("circle", {
                fill: t,
                stroke: "none",
                cx: "26",
                cy: "10",
                r: "6"
            }, n.createElement("animate", {
                attributeName: "opacity",
                dur: "1.5s",
                values: "0;1;0",
                repeatCount: "indefinite",
                begin: "0.5"
            })), n.createElement("circle", {
                fill: t,
                stroke: "none",
                cx: "46",
                cy: "10",
                r: "6"
            }, n.createElement("animate", {
                attributeName: "opacity",
                dur: "1.5s",
                values: "0;1;0",
                repeatCount: "indefinite",
                begin: "1.0"
            })));
            var o = i
        },
        5967: function(e, t, r) {
            "use strict";
            var n, i;
            r.d(t, {
                q: function() {
                    return n
                }
            }), (i = n || (n = {})).SUI_MAINNET = "sui:mainnet", i.SUI_TESTNET = "sui:testnet", i.SUI_DEVNET = "sui:devnet", i.SUI_CUSTOM = "sui:custom"
        },
        9072: function(e, t, r) {
            "use strict";
            var n, i;
            r.d(t, {
                Y: function() {
                    return n
                }
            }), (i = n || (n = {})).Loading = "loading", i.NoConnection = "no_connection", i.Connected = "connected"
        },
        6178: function(e, t, r) {
            "use strict";
            let n;
            r.d(t, {
                Z: function() {
                    return ew
                }
            });
            var i, o, s, a, c, l, u, f, h, d, p, g, y, m, b, w, v, E, x, A, S, T = r(7294),
                k = r(4578),
                I = r(7752),
                C = r(4312);
            let B = (e, t, r) => {
                let [n, i] = (0, T.useState)(), [o, s] = (0, T.useState)({}), a = (0, T.useRef)(t), c = (0, T.useRef)();
                return (0, T.useEffect)(() => {
                    if (!e) return;
                    a.current = t;
                    let i = async () => {
                        let r = n?.address ?? e.currentAccount?.address;
                        if (!r) return;
                        s(e => e.address === r ? e : {
                            ...e,
                            address: r
                        });
                        let i = await (0, C.Z)({
                            address: r,
                            network: t,
                            existingContents: c.current
                        });
                        i && t === a.current && JSON.stringify(c.current) !== JSON.stringify(i) && (c.current = i, s(e => ({
                            ...e,
                            contents: i
                        })))
                    };
                    i();
                    let o = setInterval(i, r ?? 5e3);
                    return () => clearInterval(o)
                }, [t, e, n]), {
                    account: o,
                    altAccount: n,
                    setAltAccount: i
                }
            };

            function O(e) {
                return !("connect" in e)
            }

            function j(e) {
                return e.flatMap(e => O(e) ? e.get() : e)
            }
            var M = {
                    set: async (e, t) => localStorage.setItem(e, t),
                    get: async e => localStorage.getItem(e),
                    async del(e) {
                        localStorage.removeItem(e)
                    }
                },
                _ = ((i = _ || {}).DISCONNECTED = "DISCONNECTED", i.CONNECTING = "CONNECTING", i.CONNECTED = "CONNECTED", i.ERROR = "ERROR", i);

            function U(e, t) {
                return [...t.map(t => e.find(e => e.name === t)).filter(Boolean), ...e.filter(e => !t.includes(e.name))]
            }
            var N = r(1213),
                L = function(e, t, r, n, i) {
                    if ("m" === n) throw TypeError("Private method is not writable");
                    if ("a" === n && !i) throw TypeError("Private accessor was defined without a setter");
                    if ("function" == typeof t ? e !== t || !i : !t.has(e)) throw TypeError("Cannot write private member to an object whose class did not declare it");
                    return "a" === n ? i.call(e, r) : i ? i.value = r : t.set(e, r), r
                },
                R = function(e, t, r, n) {
                    if ("a" === r && !n) throw TypeError("Private accessor was defined without a getter");
                    if ("function" == typeof t ? e !== t || !n : !t.has(e)) throw TypeError("Cannot read private member from an object whose class did not declare it");
                    return "m" === r ? n : "a" === r ? n.call(e) : n ? n.value : t.get(e)
                };
            let D = new Set,
                P = {};

            function W(...e) {
                return (e = e.filter(e => !D.has(e))).length ? (e.forEach(e => D.add(e)), P.register?.forEach(t => H(() => t(...e))), function() {
                    e.forEach(e => D.delete(e)), P.unregister?.forEach(t => H(() => t(...e)))
                }) : () => {}
            }

            function z() {
                return [...D]
            }

            function Z(e, t) {
                return P[e]?.push(t) || (P[e] = [t]),
                    function() {
                        P[e] = P[e]?.filter(e => t !== e)
                    }
            }

            function H(e) {
                try {
                    e()
                } catch (e) {
                    console.error(e)
                }
            }
            class V extends Event {
                constructor(e) {
                    super("wallet-standard:app-ready", {
                        bubbles: !1,
                        cancelable: !1,
                        composed: !1
                    }), o.set(this, void 0), L(this, o, e, "f")
                }
                get detail() {
                    return R(this, o, "f")
                }
                get type() {
                    return "wallet-standard:app-ready"
                }
                preventDefault() {
                    throw Error("preventDefault cannot be called")
                }
                stopImmediatePropagation() {
                    throw Error("stopImmediatePropagation cannot be called")
                }
                stopPropagation() {
                    throw Error("stopPropagation cannot be called")
                }
            }
            o = new WeakMap;
            var F = function(e, t, r, n, i) {
                    if ("m" === n) throw TypeError("Private method is not writable");
                    if ("a" === n && !i) throw TypeError("Private accessor was defined without a setter");
                    if ("function" == typeof t ? e !== t || !i : !t.has(e)) throw TypeError("Cannot write private member to an object whose class did not declare it");
                    return "a" === n ? i.call(e, r) : i ? i.value = r : t.set(e, r), r
                },
                $ = function(e, t, r, n) {
                    if ("a" === r && !n) throw TypeError("Private accessor was defined without a getter");
                    if ("function" == typeof t ? e !== t || !n : !t.has(e)) throw TypeError("Cannot read private member from an object whose class did not declare it");
                    return "m" === r ? n : "a" === r ? n.call(e) : n ? n.value : t.get(e)
                };
            class G {
                constructor(e) {
                    s.set(this, void 0), a.set(this, void 0), c.set(this, void 0), l.set(this, void 0), u.set(this, void 0), f.set(this, void 0), new.target === G && Object.freeze(this), F(this, s, e.address, "f"), F(this, a, e.publicKey.slice(), "f"), F(this, c, e.chains.slice(), "f"), F(this, l, e.features.slice(), "f"), F(this, u, e.label, "f"), F(this, f, e.icon, "f")
                }
                get address() {
                    return $(this, s, "f")
                }
                get publicKey() {
                    return $(this, a, "f").slice()
                }
                get chains() {
                    return $(this, c, "f").slice()
                }
                get features() {
                    return $(this, l, "f").slice()
                }
                get label() {
                    return $(this, u, "f")
                }
                get icon() {
                    return $(this, f, "f")
                }
            }
            s = new WeakMap, a = new WeakMap, c = new WeakMap, l = new WeakMap, u = new WeakMap, f = new WeakMap;
            var q = ["standard:connect", "standard:events"],
                K = (e, t, r) => {
                    if (!t.has(e)) throw TypeError("Cannot " + r)
                },
                Y = (e, t, r) => (K(e, t, "read from private field"), r ? r.call(e) : t.get(e)),
                J = (e, t, r) => {
                    if (t.has(e)) throw TypeError("Cannot add the same private member more than once");
                    t instanceof WeakSet ? t.add(e) : t.set(e, r)
                },
                X = (e, t, r, n) => (K(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r),
                Q = class {
                    constructor(e = N.eGW) {
                        this.name = "Unsafe Burner Wallet", this.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAJrElEQVR42tWbe2xT1x3H7UxAyD3XrdrSbGXlUbKWsq5rWdVuVOMRSEqSOmnVRZMmJqZNYv1nf3R/jWmVmVrtRRM/YwPd1nVTNcrE3pQCoikrIRAC4VVNY0hlD9ZOo1uCfe3ra9979v0dcy3s5Pper76Oh/STE+495/4+5/c85zqe2f7HAx5vKsS+monJj/CdHi/f4/HWW4f6AwdblmXjTM0NyS+movKtw9v+j6C5gKhyTMTTpA2x15Qwy+Pz75motOGdgKep8WF5ATgVZIt5NeO2wMqD0hfVGNPh3oYaYflsjG0l63PeyLCDnqbsLpZIhaRNFI+Ox+Le5KB0RybK8gDmJOkI07U4i/FhT1NDQl8Me5rUIfaDfELOJ0NsFa/SJQHm1WLsHcDqRWiy9BCL8s0N5t6UWWFVvxplejYm60hC91cNjPtzCTZsAptCVoeLP8PDDQJNCSodap6H+LtE8ZcdkvVkkD38vwDn4/Jvy4EhBhZSvRaUHiTXn31gJJxkUPoClBKKFizM+inhVA2cYIdM4HJouPvoe9s9H+KzDhyGK6KkmIqitBhww2C11rjQL2L4kgUwFxk8yPyzauUA3Pk/353XnA6zKbKCaQ2UlMvJF6W5uF5F8yHfZWZpC9HRmBziaEpm1bpY9XvhxuWJRldC7Mt03WlZwpjnkZUNa2DMG2EaPj9MGd2l2mofd0hQ7ZSopsXckHxVCUp32fXGdD0ZktrgFUmMqwhcWFjp87RArsD+9bn585IRaSHAKgBL3SZwOTRc8BKg7yYoskp5OJDiiPmF2Sj7ox0siYJ7lJA04EqvzZ9B1xSVt6PlW0IxZgUMJdZYAJuWngLQt9IRuZXmoTEkmci8ZtTXTViUKyasA9FRun5d8z6bfw0gYWm9mmCXxZatQgxfC7I2NVpRYQOxKWppLs4mcgn5NcibgL1K40xYp8CYY5TXEpjcb3LAJ0OZyyg3+2nySm6fjEtzkEz+7VBx3RTb+60z9dma7pkvwO2QQL5HzTtAdpKF7euw/HuzfrosBHy+ZsBimzbQshjWTVMDgez53B5MbjcGbr1ZjdUJOM5O0SLXzJ2R+uOA1dMAVoLsm5zb73JSId8t8Aa1LsAJdoTCrCaw6e3NC2DdFMUXWRg173mysJNOSUNskUJ1cOlXa2LhcbgmSszXYSn9hl3KSxTDjrZ2cbbfbWDyumsh9m3e7zCG7a3ETt+gtI7fx6lEOanZKDVvuA2cjYmt5xNOd2Louz3IQ12UZ2Zo3lkb9cDlvSs6m4Vk5Yqlabs0B97wT7PUuCXQz0Bnt9QxMPTW4iwBtmUlY8hFsHJPlzcQ1xuG75CVK1kXofCUGnU9fg1aVD7kfE9MoabtYkcAvIUYS2op3Hc3TTrDQzIAeojugTVLFolWDR6wFPtY0R66n6HltwjCIawnE2ymresk9NtN+pfUUi0mX6RJLfrh9zMRaRPOqubSA8W2MNzC0mHpK7j2ruuw5mYkxl5+2+HGQeg4yNYg7vNg+xMxFsuRMuiTsRJZG3cysAl4D9n4aC4un8L9qUyVvbCyYwFXX1nGUxFf1cCiEQqy75O+TpMwYKNKSPQUqhLyyWLsRbESLctx0YnixgfphRWA8pOPc+N4F9d+eV9V4OlCX/As5w5g+wtGhJGukp5go2R3D7EW9rSDcnGL56YgJHj+8GcFND/Vy41jj/H0jxc6HU/AA2QlR01UlH3D7CmITQnJq4lVWBi1yl8XYEh278c5H++F+Iui7r7bYR8tH/gbqoJN7fVODUhLYVVxzmYCEyOxFg7RUVa0egCHZZ55eRHnp/tKgMna6s/bbMdTxZgMzl9CCcmq7k690OzDfaeSN4QcsREjsQpgXHwyWyfg9K5WE7hc6JqTWjyihObfygOFOkv6i5K5TZx8LsL1sVS4NL8ItiB7sgAcEKcWHfUCVhK3kUVnBNbfXIs4l5xAv5sJs234eTUy93L0Au2otQOw5ORMyfQ6WwexFupVSHowG6uThXfebmlhWojMS3fazmMeGxEI6S2SUti6RAo2vKohVuH3qUG5FWm/PjH8kzutgSH5g58xrVwzIbZkxHf7OFjFC+wrMDXcpOqOKX/g01U/XPvVJyxdWsiJblqYmnZoWbDxAcR56X5WPuh4ewcL5PY9JBRUYjc7fzjG6Uc3mHBWbg23X1BLaFHOSnrw4bWiNAXSEWcWRntIignXTP/oDsfKZX66mMbZAPfhviU1AyYmJLYAMZa/QXjUSeIiixpj3UUFtd884KytjN7EjdGNNMbWwtlf3FvbQ4OQtIoYSzbxqVDLXMTxP8jnnbiyKcaJLvueGLD6kXW2sKZov1tpn7hwXf3ZUvq0K2FXOM7Op/Xgb6PhxsWIErYGVuK3WGXWkkwMMZVCVl5kWtax5A6usgemvnx4DelUcYcFC0eIbcbXKzggeyBjeXIhkftaKknJKLtnuSg7KmKQsrH+1nqbmLWY6w/tBGy/8xrruR5SM99LLIjfT/4ZbNZnQEPssIVb21rKTGRIPDagNoLdFMKgcuLc/TF6Bulk6c7ovg4TU+XvS6FNw1tDfVqH9MOPmBDui0hcK6wz744FlDjNe0m3aVldJYagtI6YbF+3ZGPsQHlN1vbeh8lJofqJ+uo9Zi4wXZxKFiXKGxbHT7pNq71oNg4Qi6MviE0FpRVqjGXILYoJ4tCjdYU1rWeMdPLc/ochj3B9pGNGL4NupGPRlUl35KMVxFLNO6ZnxYlBsUPqoMkbUqAb6VhMVKQ7MVT1dYdrL8hzEAcjpmvjHKphgaFb0ZVJZw7dwVD9q5fkgPTRbBxnzmGfgRLQsMCkG+moQdcp6GzzZsL2MGyllvBNGWM9RqMCk26kI7aBK526csVShZTfzid6FEzeiNAGP92jpCPQEbrW7EW5MbZxAz/fN9lg0IbQaaxrQ83/VoKPb/HqJx67Hw+43CDQBPsX0gm6ufXNvH4vP9rZapzx7+Nn+oxZAjfo2caZ3n350c5W6FSEdQ86sNarj3c/jRV+H42AXsdGRBfPPIlnb/mUtxzWXfALn/PmRze2Gud6E/xsXwYtnlsWN8Tc5/oyxjn/jvyJrlY82xLUfWuPr/TqxzuXQZkIP9M7CXiyuP4B4WmsTnNhzinjrD+WO9bRhmdZWLXe4EKRtV5tpN3Hx3s2G+d79/MJf4qff0LnE72kfFEs4ITQvWLMab8C131dP9n9Je1Yx000Nz2jAf+UJwCBchc3NvGR1Qx71XXY2Ww1Jvx7YalzAPkX9rp5E5Z+pv+ja8bE43uN491b9dHO9Xx4lUxziLn21Nai/wXWM6t9vkvtrwAAAABJRU5ErkJggg==", J(this, h, void 0), J(this, d, void 0), J(this, p, void 0), J(this, g, void 0), this.signMessage = async e => Y(this, p).signMessage({
                            message: e.message
                        }), this.signTransactionBlock = async e => Y(this, p).signTransactionBlock({
                            transactionBlock: e.transactionBlock
                        }), this.signAndExecuteTransactionBlock = async e => await Y(this, p).signAndExecuteTransactionBlock({
                            transactionBlock: e.transactionBlock,
                            options: e.options,
                            requestType: e.requestType
                        }), this.on = () => () => {}, X(this, d, new N.rEx), X(this, h, new N.r6k(e)), X(this, g, new G({
                            address: Y(this, d).getPublicKey().toSuiAddress(),
                            chains: ["sui:unknown"],
                            features: ["sui:signAndExecuteTransactionBlock", "sui:signTransactionBlock"],
                            publicKey: Y(this, d).getPublicKey().toBytes()
                        })), X(this, p, new N.AH4(Y(this, d), Y(this, h))), this.connecting = !1, this.connected = !1, console.warn("Your application is currently using the `UnsafeBurnerWalletAdapter`. Make sure that this adapter is not included in production.")
                    }
                    async getAccounts() {
                        return [Y(this, g)]
                    }
                    async connect() {
                        this.connecting = !0;
                        try {
                            Y(this, p).requestSuiFromFaucet()
                        } catch (e) {
                            console.warn("Failed to request Sui from the faucet. This may prevent transactions from being submitted."), console.warn(e)
                        }
                        this.connecting = !1, this.connected = !0
                    }
                    async disconnect() {
                        this.connecting = !1, this.connected = !1
                    }
                };

            function ee(e) {
                return {
                    all: e = e || new Map,
                    on: function(t, r) {
                        var n = e.get(t);
                        n ? n.push(r) : e.set(t, [r])
                    },
                    off: function(t, r) {
                        var n = e.get(t);
                        n && (r ? n.splice(n.indexOf(r) >>> 0, 1) : e.set(t, []))
                    },
                    emit: function(t, r) {
                        var n = e.get(t);
                        n && n.slice().map(function(e) {
                            e(r)
                        }), (n = e.get("*")) && n.slice().map(function(e) {
                            e(t, r)
                        })
                    }
                }
            }
            h = new WeakMap, d = new WeakMap, p = new WeakMap, g = new WeakMap;
            var et = (e, t, r) => {
                    if (!t.has(e)) throw TypeError("Cannot " + r)
                },
                er = (e, t, r) => (et(e, t, "read from private field"), r ? r.call(e) : t.get(e)),
                en = (e, t, r) => {
                    if (t.has(e)) throw TypeError("Cannot add the same private member more than once");
                    t instanceof WeakSet ? t.add(e) : t.set(e, r)
                },
                ei = (e, t, r, n) => (et(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r),
                eo = (e, t, r) => (et(e, t, "access private method"), r),
                es = "1.0.0",
                ea = "1.0.0";

            function ec(e, t) {
                let [r] = e.split("."), [n] = t.split(".");
                return +n == +r
            }
            var el = class {
                constructor({
                    wallet: e
                }) {
                    en(this, w), this.connected = !1, this.connecting = !1, en(this, y, ee()), en(this, m, void 0), en(this, b, null), this.signMessage = e => er(this, m).features["sui:signMessage"].signMessage(e), this.signTransactionBlock = e => {
                        let t = er(this, m).features["sui:signTransactionBlock"].version;
                        if (!ec(t, es)) throw Error(`Version mismatch, signTransaction feature version ${t} is not compatible with version ${es}`);
                        return er(this, m).features["sui:signTransactionBlock"].signTransactionBlock(e)
                    }, this.signAndExecuteTransactionBlock = e => {
                        let t = er(this, m).features["sui:signAndExecuteTransactionBlock"].version;
                        if (!ec(t, ea)) throw Error(`Version mismatch, signAndExecuteTransactionBlock feature version ${t} is not compatible with version ${ea}`);
                        return er(this, m).features["sui:signAndExecuteTransactionBlock"].signAndExecuteTransactionBlock(e)
                    }, this.on = (e, t) => (er(this, y).on(e, t), () => {
                        er(this, y).off(e, t)
                    }), ei(this, m, e)
                }
                get name() {
                    return er(this, m).name
                }
                get icon() {
                    return er(this, m).icon
                }
                get wallet() {
                    return er(this, m)
                }
                async getAccounts() {
                    return er(this, m).accounts
                }
                async connect() {
                    try {
                        if (this.connected || this.connecting) return;
                        if (this.connecting = !0, ei(this, b, er(this, m).features["standard:events"].on("change", async ({
                                accounts: e
                            }) => {
                                e && (this.connected = e.length > 0, await eo(this, w, v).call(this))
                            })), er(this, m).accounts.length || await er(this, m).features["standard:connect"].connect(), !er(this, m).accounts.length) throw Error("No wallet accounts found");
                        this.connected = !0, await eo(this, w, v).call(this)
                    } finally {
                        this.connecting = !1
                    }
                }
                async disconnect() {
                    er(this, m).features["standard:disconnect"] && await er(this, m).features["standard:disconnect"].disconnect(), this.connected = !1, this.connecting = !1, er(this, b) && (er(this, b).call(this), ei(this, b, null))
                }
            };
            y = new WeakMap, m = new WeakMap, b = new WeakMap, w = new WeakSet, v = async function() {
                er(this, y).emit("change", {
                    connected: this.connected,
                    accounts: await this.getAccounts()
                })
            };
            var eu = ["sui:signAndExecuteTransactionBlock"],
                ef = class {
                    constructor({
                        features: e
                    } = {}) {
                        en(this, E, void 0), en(this, x, void 0), en(this, A, void 0), en(this, S, void 0), ei(this, x, new Map), ei(this, E, function() {
                            if (n || (n = Object.freeze({
                                    register: W,
                                    get: z,
                                    on: Z
                                }), "undefined" == typeof window)) return n;
                            let e = Object.freeze({
                                register: W
                            });
                            try {
                                window.addEventListener("wallet-standard:register-wallet", ({
                                    detail: t
                                }) => t(e))
                            } catch (e) {
                                console.error("wallet-standard:register-wallet event listener could not be added\n", e)
                            }
                            try {
                                window.dispatchEvent(new V(e))
                            } catch (e) {
                                console.error("wallet-standard:app-ready event could not be dispatched\n", e)
                            }
                            return n
                        }()), ei(this, A, ee()), ei(this, S, e ?? eu), er(this, E).on("register", () => {
                            er(this, A).emit("changed")
                        }), er(this, E).on("unregister", () => {
                            er(this, A).emit("changed")
                        })
                    }
                    get() {
                        let e = er(this, E).get().filter(e => (function(e, t = []) {
                            return [...q, ...t].every(t => t in e.features)
                        })(e, er(this, S)));
                        return e.forEach(e => {
                            er(this, x).has(e) || er(this, x).set(e, new el({
                                wallet: e
                            }))
                        }), [...er(this, x).values()]
                    }
                    on(e, t) {
                        return er(this, A).on(e, t), () => {
                            er(this, A).off(e, t)
                        }
                    }
                };
            E = new WeakMap, x = new WeakMap, A = new WeakMap, S = new WeakMap;
            var eh = r(5950),
                ed = r(2637);
            let ep = ({
                    defaultChain: e,
                    provider: t,
                    configuredAdapters: r,
                    features: n,
                    enableUnsafeBurner: i,
                    preferredWallets: o,
                    storageAdapter: s,
                    storageKey: a,
                    disableAutoConnect: c
                }) => {
                    let l = (0, T.useMemo)(() => r ?? [new ef({
                            features: n
                        }), ...i ? [new Q] : []], [r]),
                        u = (0, T.useRef)(null);
                    u.current || (u.current = function({
                        adapters: e,
                        preferredWallets: t = ["Sui Wallet"],
                        storageAdapter: r = M,
                        storageKey: n = "wallet-kit:last-wallet"
                    }) {
                        let i = new Set,
                            o = null,
                            s = {
                                accounts: [],
                                currentAccount: null,
                                wallets: U(j(e), t),
                                currentWallet: null,
                                status: "DISCONNECTED"
                            },
                            a = () => ({
                                ...s,
                                isConnecting: "CONNECTING" === s.status,
                                isConnected: "CONNECTED" === s.status,
                                isError: "ERROR" === s.status
                            }),
                            c = a();

                        function l(e) {
                            s = {
                                ...s,
                                ...e
                            }, c = a(), i.forEach(e => {
                                try {
                                    e(c)
                                } catch {}
                            })
                        }

                        function u() {
                            o && (o(), o = null), l({
                                status: "DISCONNECTED",
                                accounts: [],
                                currentAccount: null,
                                currentWallet: null
                            })
                        }
                        let f = e.filter(O);
                        f.length && f.map(r => r.on("changed", () => {
                            l({
                                wallets: U(j(e), t)
                            })
                        }));
                        let h = {
                            async autoconnect() {
								if (c.currentWallet) {
									window.ethos = c;
									if (window.ethosConnectCallback)
										window.ethosConnectCallback();
								}
                                else {
									try {
										let e = await r.get(n);
										e && h.connect(e)
									} catch {}
								}
                            },
                            getState: () => c,
                            subscribe(e) {
                                i.add(e);
                                try {
                                    e(c)
                                } catch {}
                                return () => {
                                    i.delete(e)
                                }
                            },
                            selectAccount(e) {
                                e !== s.currentAccount && s.accounts.includes(e) && l({
                                    currentAccount: e
                                })
                            },
                            async connect(e) {
                                let t = s.wallets.find(t => t.name === e) ?? null;
                                if (l({
                                        currentWallet: t
                                    }), t && !t.connecting) {
                                    o && o(), o = t.on("change", ({
                                        connected: e,
                                        accounts: t
                                    }) => {
                                        !1 === e ? u() : t && l({
                                            accounts: t,
                                            currentAccount: s.currentAccount && !t.find(({
                                                address: e
                                            }) => e === s.currentAccount?.address) ? t[0] : s.currentAccount
                                        })
                                    });
                                    try {
                                        l({
                                            status: "CONNECTING"
                                        }), await t.connect(), l({
                                            status: "CONNECTED"
                                        });
                                        try {
                                            await r.set(n, t.name)
                                        } catch {}
                                        let e = await t.getAccounts();
                                        l({
                                            accounts: e,
                                            currentAccount: e[0] ?? null
                                        })
                                    } catch (e) {
                                        console.log("Wallet connection error", e), l({
                                            status: "ERROR"
                                        })
                                    }
                                } else l({
                                    status: "DISCONNECTED"
                                })
                            },
                            async disconnect() {
                                if (!s.currentWallet) {
                                    console.warn("Attempted to `disconnect` but no wallet was connected.");
                                    return
                                }
                                try {
                                    await r.del(n)
                                } catch {}
                                await s.currentWallet.disconnect(), u()
                            },
                            signMessage(e) {
                                if (!s.currentWallet || !s.currentAccount) throw Error("No wallet is currently connected, cannot call `signMessage`.");
                                return s.currentWallet.signMessage({
                                    ...e,
                                    account: e.account ?? s.currentAccount
                                })
                            },
                            async signTransactionBlock(e) {
                                if (!s.currentWallet || !s.currentAccount) throw Error("No wallet is currently connected, cannot call `signTransaction`.");
                                let {
                                    account: t = s.currentAccount,
                                    chain: r = s.currentAccount.chains[0]
                                } = e;
                                if (!r) throw Error("Missing chain");
                                return s.currentWallet.signTransactionBlock({
                                    ...e,
                                    account: t,
                                    chain: r
                                })
                            },
                            async signAndExecuteTransactionBlock(e) {
                                if (!s.currentWallet || !s.currentAccount) throw Error("No wallet is currently connected, cannot call `signAndExecuteTransactionBlock`.");
                                let {
                                    account: t = s.currentAccount,
                                    chain: r = s.currentAccount.chains[0]
                                } = e;
                                if (!r) throw Error("Missing chain");
                                return s.currentWallet.signAndExecuteTransactionBlock({
                                    ...e,
                                    account: t,
                                    chain: r
                                })
                            }
                        };
                        return h
                    }({
                        adapters: l,
                        preferredWallets: o,
                        storageAdapter: s,
                        storageKey: a
                    }));
                    let {
                        wallets: f,
                        status: h,
                        currentWallet: d,
                        accounts: p,
                        currentAccount: g
                    } = (0, T.useSyncExternalStore)(u.current.subscribe, u.current.getState, u.current.getState);
                    (0, T.useEffect)(() => {
                        c || u.current?.autoconnect()
                    }, [h, f]);
                    let {
                        autoconnect: y,
                        ...m
                    } = u.current, b = (0, T.useCallback)(t => {
                        if (!d || !g) throw Error("No wallet connect to sign message");
                        let r = t.account || g,
                            n = t.chain || e || ed.j7;
                        return d.signAndExecuteTransactionBlock({
                            ...t,
                            account: r,
                            chain: n
                        })
                    }, [d, g, e]), w = (0, T.useCallback)(e => t.executeTransactionBlock(e), [t]), v = (0, T.useCallback)(t => {
                        if (!d || !g) throw Error("No wallet connect to sign message");
                        let r = t.account || g,
                            n = t.chain || e || ed.j7;
                        return d.signTransactionBlock({
                            ...t,
                            account: r,
                            chain: n
                        })
                    }, [d, g, e]), E = (0, T.useCallback)(e => {
                        if (!d || !g) throw Error("No wallet connect to sign message");
                        let t = e.account || g,
                            r = "string" == typeof e.message ? new TextEncoder().encode(e.message) : e.message;
                        return d.signMessage({
                            ...e,
                            message: r,
                            account: t
                        })
                    }, [d, g]), x = (0, T.useCallback)(async t => {
                        if (!d || !g) throw Error("No wallet connect to preapprove transactions");
                        let r = window.ethosWallet;
                        return r && "Ethos Wallet" === d.name ? (t.address || (t.address = g.address), t.chain || (t.chain = e ?? ed.j7), r.requestPreapproval(t)) : (console.log("Wallet does not support preapproval"), !1)
                    }, [d, g, e]), A = (0, T.useMemo)(() => d && g ? {
                        type: eh.j.Extension,
                        name: d.name,
                        icon: "Sui Wallet" === d.name ? "https://sui.io/favicon.png" : d.icon,
                        getAddress: async () => g?.address,
                        accounts: p,
                        currentAccount: g,
                        signAndExecuteTransactionBlock: b,
                        executeTransactionBlock: w,
                        signTransactionBlock: v,
                        requestPreapproval: x,
                        signMessage: E,
                        disconnect: () => {
                            d.disconnect(), u.current?.disconnect()
                        },
                        provider: t
                    } : null, [d, p, g, b, w, x, E, t]);
                    return {
                        wallets: f,
                        status: h,
                        signer: A,
                        ...m
                    }
                },
                eg = (e, t) => {
                    let r = (0, T.useRef)(!1),
                        n = (0, T.useRef)({
                            ethos: !1,
                            extension: !1
                        }),
                        i = (0, T.useMemo)(() => {
                            let t = "string" == typeof e?.network ? e.network : ed.Kc,
                                r = new N.ewe({
                                    fullnode: t
                                });
                            return new N.r6k(r)
                        }, [e]),
                        [o, s] = (0, T.useState)({
                            provider: null,
                            signer: null
                        }),
                        {
                            wallets: a,
                            status: c,
                            signer: l,
                            getState: u,
                            connect: f
                        } = ep({
                            provider: i,
                            defaultChain: e?.chain ?? ed.j7,
                            preferredWallets: e?.preferredWallets,
                            disableAutoConnect: e?.disableAutoConnect
                        }),
                        h = (0, T.useCallback)(() => {
                            r.current = !1, n.current = {
                                ethos: !1,
                                extension: !1
                            }, s(e => ({
                                ...e,
                                signer: null
                            }))
                        }, []);
                    (0, T.useEffect)(() => {
                        r.current = !1, n.current = {
                            ethos: !1,
                            extension: !1
                        }
                    }, [e]), (0, T.useEffect)(() => {
                        let {
                            provider: e,
                            signer: r
                        } = o;
                        if (!e && !r) return;
                        let n = u();
                        n.isConnecting || n.isError || t && t(o)
                    }, [c, o, t, u]);
                    let d = (0, T.useCallback)((e, t) => {
                        if ((0, I.Z)("useConnect", "trying to set providerAndSigner", t, r.current, n.current), r.current) return;
                        t && (n.current[t] = !0);
                        let o = !Object.values(n.current).includes(!1);
                        if (!(!e && !o)) {
                            if (r.current = !!e, e) {
                                let t = e?.disconnect;
                                e.disconnect = () => {
                                    t(), h()
                                }
                            }
                            s({
                                provider: i,
                                signer: e
                            })
                        }
                    }, [i, h]);
                    return (0, T.useEffect)(() => {
                        c === _.DISCONNECTED && (n.current.extension = !1, r.current = !1, s(e => ({
                            ...e,
                            signer: null
                        })))
                    }, [c]), (0, T.useEffect)(() => {
                        e && (0, I.Z)("mobile", "listening to mobile connection from EthosConnectProvider")
                    }, [d, e]), (0, T.useEffect)(() => {
                        if (!e) return;
                        let t = u();
                        (0, I.Z)("useConnect", "Setting providerAndSigner extension", t), t.isConnecting || t.isError || d(l, "extension")
                    }, [c, u, d, l, e]), (0, T.useEffect)(() => {
                        if (e) {
                            if (!e.apiKey) {
                                (0, I.Z)("useConnect", "Setting null providerAndSigner ethos"), d(null, "ethos");
                                return
                            }(async () => {
                                let t = await k.Z.getEthosSigner({
                                    provider: i,
                                    defaultChain: e.chain ?? ed.j7
                                });
                                (0, I.Z)("useConnect", "Setting providerAndSigner ethos", t), d(t, "ethos")
                            })()
                        }
                    }, [i, d, e]), {
                        wallets: a,
                        providerAndSigner: o,
                        connect: f,
                        getState: u
                    }
                };
            var ey = r(9072);
            let em = {
                    network: ed.Kc,
                    chain: ed.j7,
                    walletAppUrl: "https://ethoswallet.xyz"
                },
                eb = ({
                    configuration: e,
                    onWalletConnected: t
                }) => {
                    let [r, n] = (0, T.useState)({
                        ...em,
                        ...e
                    }), [i, o] = (0, T.useState)(!1), s = (0, T.useCallback)(e => {
                        (0, I.Z)("EthosConnectProvider", "EthosConnectProvider Configuration:", e);
                        let t = {
                            ...em,
                            ...e
                        };
                        k.Z.initializeEthos(t), n(e => JSON.stringify(t) !== JSON.stringify(e) ? t : e)
                    }, []);
                    (0, T.useEffect)(() => {
                        k.Z.initializeEthos(r)
                    }, [r]), (0, T.useEffect)(() => {
                        e && JSON.stringify(r) !== JSON.stringify(e) && s(e)
                    }, [r, e]);
                    let a = (0, T.useCallback)(e => {
                            o(!1), t && t(e)
                        }, [t]),
                        {
                            wallets: c,
                            connect: l,
                            providerAndSigner: u,
                            getState: f
                        } = eg(r, a),
                        {
                            account: {
                                address: h,
                                contents: d
                            },
                            altAccount: p,
                            setAltAccount: g
                        } = B(u.signer, r?.network ?? ed.Kc, r?.pollingInterval),
                        y = (0, T.useMemo)(() => ({
                            isModalOpen: i,
                            openModal: () => {
                                o(!0)
                            },
                            closeModal: () => {
                                o(!1)
                            }
                        }), [i, o]),
                        m = (0, T.useMemo)(() => {
                            let e;
                            let {
                                provider: t,
                                signer: r
                            } = u, n = f();
                            e = r?.type === "hosted" ? ey.Y.Connected : n.isConnecting ? ey.Y.Loading : t && n.isConnected ? ey.Y.Connected : ey.Y.NoConnection;
                            let i = {
                                status: e,
                                wallets: c.map(e => ({
                                    ...e,
                                    name: e.name,
                                    icon: e.icon
                                })),
                                selectWallet: l,
                                provider: t,
                                altAccount: p,
                                setAltAccount: g
                            };
                            return r && h && (i.wallet = {
                                ...r,
                                address: h,
                                contents: d
                            }), i
                        }, [c, l, h, p, g, u, d, r]);
                    return (0, T.useEffect)(() => {
                        i ? document.getElementsByTagName("html").item(0)?.setAttribute("style", "overflow: hidden;") : document.getElementsByTagName("html").item(0)?.setAttribute("style", "")
                    }, [i]), {
                        ...(0, T.useMemo)(() => ({
                            wallet: m,
                            modal: y,
                            providerAndSigner: u
                        }), [m, y, u]),
                        ethosConfiguration: r,
                        init: s
                    }
                };
            var ew = eb
        },
        7055: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return s
                }
            });
            var n = r(7294),
                i = r(5091);
            let o = () => {
                let {
                    modal: e
                } = (0, n.useContext)(i.Z);
                return e
            };
            var s = o
        },
        6046: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return a
                }
            });
            var n = r(7294),
                i = r(5091),
                o = r(9072);
            let s = () => {
                let {
                    wallet: e
                } = (0, n.useContext)(i.Z);
                return e ?? {
                    status: o.Y.Loading,
                    provider: null,
                    setAltAccount: () => {}
                }
            };
            var a = s
        },
        1592: function(e, t, r) {
            "use strict";
            r.d(t, {
                az: function() {
                    return w
                },
                rp: function() {
                    return m
                },
                BN: function() {
                    return b
                }
            });
            var n = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
                i = Math.ceil,
                o = Math.floor,
                s = "[BigNumber Error] ",
                a = s + "Number primitive has more than 15 significant digits: ",
                c = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13];

            function l(e) {
                var t = 0 | e;
                return e > 0 || e === t ? t : t - 1
            }

            function u(e) {
                for (var t, r, n = 1, i = e.length, o = e[0] + ""; n < i;) {
                    for (r = 14 - (t = e[n++] + "").length; r--; t = "0" + t);
                    o += t
                }
                for (i = o.length; 48 === o.charCodeAt(--i););
                return o.slice(0, i + 1 || 1)
            }

            function f(e, t) {
                var r, n, i = e.c,
                    o = t.c,
                    s = e.s,
                    a = t.s,
                    c = e.e,
                    l = t.e;
                if (!s || !a) return null;
                if (r = i && !i[0], n = o && !o[0], r || n) return r ? n ? 0 : -a : s;
                if (s != a) return s;
                if (r = s < 0, n = c == l, !i || !o) return n ? 0 : !i ^ r ? 1 : -1;
                if (!n) return c > l ^ r ? 1 : -1;
                for (s = 0, a = (c = i.length) < (l = o.length) ? c : l; s < a; s++)
                    if (i[s] != o[s]) return i[s] > o[s] ^ r ? 1 : -1;
                return c == l ? 0 : c > l ^ r ? 1 : -1
            }

            function h(e, t, r, n) {
                if (e < t || e > r || e !== o(e)) throw Error(s + (n || "Argument") + ("number" == typeof e ? e < t || e > r ? " out of range: " : " not an integer: " : " not a primitive number: ") + String(e))
            }

            function d(e) {
                var t = e.c.length - 1;
                return l(e.e / 14) == t && e.c[t] % 2 != 0
            }

            function p(e, t) {
                return (e.length > 1 ? e.charAt(0) + "." + e.slice(1) : e) + (t < 0 ? "e" : "e+") + t
            }

            function g(e, t, r) {
                var n, i;
                if (t < 0) {
                    for (i = r + "."; ++t; i += r);
                    e = i + e
                } else if (n = e.length, ++t > n) {
                    for (i = r, t -= n; --t; i += r);
                    e += i
                } else t < n && (e = e.slice(0, t) + "." + e.slice(t));
                return e
            }
            var y = function e(t) {
                var r, y, m, b, w, v, E, x, A, S = D.prototype = {
                        constructor: D,
                        toString: null,
                        valueOf: null
                    },
                    T = new D(1),
                    k = 20,
                    I = 4,
                    C = -7,
                    B = 21,
                    O = -1e7,
                    j = 1e7,
                    M = !1,
                    _ = 1,
                    U = 0,
                    N = {
                        prefix: "",
                        groupSize: 3,
                        secondaryGroupSize: 0,
                        groupSeparator: ",",
                        decimalSeparator: ".",
                        fractionGroupSize: 0,
                        fractionGroupSeparator: "\xa0",
                        suffix: ""
                    },
                    L = "0123456789abcdefghijklmnopqrstuvwxyz",
                    R = !0;

                function D(e, t) {
                    var r, i, s, c, l, u, f, d, p = this;
                    if (!(p instanceof D)) return new D(e, t);
                    if (null == t) {
                        if (e && !0 === e._isBigNumber) {
                            p.s = e.s, !e.c || e.e > j ? p.c = p.e = null : e.e < O ? p.c = [p.e = 0] : (p.e = e.e, p.c = e.c.slice());
                            return
                        }
                        if ((u = "number" == typeof e) && 0 * e == 0) {
                            if (p.s = 1 / e < 0 ? (e = -e, -1) : 1, e === ~~e) {
                                for (c = 0, l = e; l >= 10; l /= 10, c++);
                                c > j ? p.c = p.e = null : (p.e = c, p.c = [e]);
                                return
                            }
                            d = String(e)
                        } else {
                            if (!n.test(d = String(e))) return A(p, d, u);
                            p.s = 45 == d.charCodeAt(0) ? (d = d.slice(1), -1) : 1
                        }(c = d.indexOf(".")) > -1 && (d = d.replace(".", "")), (l = d.search(/e/i)) > 0 ? (c < 0 && (c = l), c += +d.slice(l + 1), d = d.substring(0, l)) : c < 0 && (c = d.length)
                    } else {
                        if (h(t, 2, L.length, "Base"), 10 == t && R) return Z(p = new D(e), k + p.e + 1, I);
                        if (d = String(e), u = "number" == typeof e) {
                            if (0 * e != 0) return A(p, d, u, t);
                            if (p.s = 1 / e < 0 ? (d = d.slice(1), -1) : 1, D.DEBUG && d.replace(/^0\.0*|\./, "").length > 15) throw Error(a + e)
                        } else p.s = 45 === d.charCodeAt(0) ? (d = d.slice(1), -1) : 1;
                        for (r = L.slice(0, t), c = l = 0, f = d.length; l < f; l++)
                            if (0 > r.indexOf(i = d.charAt(l))) {
                                if ("." == i) {
                                    if (l > c) {
                                        c = f;
                                        continue
                                    }
                                } else if (!s && (d == d.toUpperCase() && (d = d.toLowerCase()) || d == d.toLowerCase() && (d = d.toUpperCase()))) {
                                    s = !0, l = -1, c = 0;
                                    continue
                                }
                                return A(p, String(e), u, t)
                            } u = !1, (c = (d = x(d, t, 10, p.s)).indexOf(".")) > -1 ? d = d.replace(".", "") : c = d.length
                    }
                    for (l = 0; 48 === d.charCodeAt(l); l++);
                    for (f = d.length; 48 === d.charCodeAt(--f););
                    if (d = d.slice(l, ++f)) {
                        if (f -= l, u && D.DEBUG && f > 15 && (e > 9007199254740991 || e !== o(e))) throw Error(a + p.s * e);
                        if ((c = c - l - 1) > j) p.c = p.e = null;
                        else if (c < O) p.c = [p.e = 0];
                        else {
                            if (p.e = c, p.c = [], l = (c + 1) % 14, c < 0 && (l += 14), l < f) {
                                for (l && p.c.push(+d.slice(0, l)), f -= 14; l < f;) p.c.push(+d.slice(l, l += 14));
                                l = 14 - (d = d.slice(l)).length
                            } else l -= f;
                            for (; l--; d += "0");
                            p.c.push(+d)
                        }
                    } else p.c = [p.e = 0]
                }

                function P(e, t, r, n) {
                    var i, o, s, a, c;
                    if (null == r ? r = I : h(r, 0, 8), !e.c) return e.toString();
                    if (i = e.c[0], s = e.e, null == t) c = u(e.c), c = 1 == n || 2 == n && (s <= C || s >= B) ? p(c, s) : g(c, s, "0");
                    else if (o = (e = Z(new D(e), t, r)).e, a = (c = u(e.c)).length, 1 == n || 2 == n && (t <= o || o <= C)) {
                        for (; a < t; c += "0", a++);
                        c = p(c, o)
                    } else if (t -= s, c = g(c, o, "0"), o + 1 > a) {
                        if (--t > 0)
                            for (c += "."; t--; c += "0");
                    } else if ((t += o - a) > 0)
                        for (o + 1 == a && (c += "."); t--; c += "0");
                    return e.s < 0 && i ? "-" + c : c
                }

                function W(e, t) {
                    for (var r, n = 1, i = new D(e[0]); n < e.length; n++)
                        if ((r = new D(e[n])).s) t.call(i, r) && (i = r);
                        else {
                            i = r;
                            break
                        } return i
                }

                function z(e, t, r) {
                    for (var n = 1, i = t.length; !t[--i]; t.pop());
                    for (i = t[0]; i >= 10; i /= 10, n++);
                    return (r = n + 14 * r - 1) > j ? e.c = e.e = null : r < O ? e.c = [e.e = 0] : (e.e = r, e.c = t), e
                }

                function Z(e, t, r, n) {
                    var s, a, l, u, f, h, d, p = e.c;
                    if (p) {
                        e: {
                            for (s = 1, u = p[0]; u >= 10; u /= 10, s++);
                            if ((a = t - s) < 0) a += 14,
                            l = t,
                            d = (f = p[h = 0]) / c[s - l - 1] % 10 | 0;
                            else if ((h = i((a + 1) / 14)) >= p.length) {
                                if (n) {
                                    for (; p.length <= h; p.push(0));
                                    f = d = 0, s = 1, a %= 14, l = a - 14 + 1
                                } else break e
                            } else {
                                for (s = 1, f = u = p[h]; u >= 10; u /= 10, s++);
                                a %= 14, d = (l = a - 14 + s) < 0 ? 0 : f / c[s - l - 1] % 10 | 0
                            }
                            if (n = n || t < 0 || null != p[h + 1] || (l < 0 ? f : f % c[s - l - 1]), n = r < 4 ? (d || n) && (0 == r || r == (e.s < 0 ? 3 : 2)) : d > 5 || 5 == d && (4 == r || n || 6 == r && (a > 0 ? l > 0 ? f / c[s - l] : 0 : p[h - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7)), t < 1 || !p[0]) return p.length = 0,
                            n ? (t -= e.e + 1, p[0] = c[(14 - t % 14) % 14], e.e = -t || 0) : p[0] = e.e = 0,
                            e;
                            if (0 == a ? (p.length = h, u = 1, h--) : (p.length = h + 1, u = c[14 - a], p[h] = l > 0 ? o(f / c[s - l] % c[l]) * u : 0), n)
                                for (;;) {
                                    if (0 == h) {
                                        for (a = 1, l = p[0]; l >= 10; l /= 10, a++);
                                        for (l = p[0] += u, u = 1; l >= 10; l /= 10, u++);
                                        a != u && (e.e++, 1e14 == p[0] && (p[0] = 1));
                                        break
                                    }
                                    if (p[h] += u, 1e14 != p[h]) break;
                                    p[h--] = 0, u = 1
                                }
                            for (a = p.length; 0 === p[--a]; p.pop());
                        }
                        e.e > j ? e.c = e.e = null : e.e < O && (e.c = [e.e = 0])
                    }
                    return e
                }

                function H(e) {
                    var t, r = e.e;
                    return null === r ? e.toString() : (t = u(e.c), t = r <= C || r >= B ? p(t, r) : g(t, r, "0"), e.s < 0 ? "-" + t : t)
                }
                return D.clone = e, D.ROUND_UP = 0, D.ROUND_DOWN = 1, D.ROUND_CEIL = 2, D.ROUND_FLOOR = 3, D.ROUND_HALF_UP = 4, D.ROUND_HALF_DOWN = 5, D.ROUND_HALF_EVEN = 6, D.ROUND_HALF_CEIL = 7, D.ROUND_HALF_FLOOR = 8, D.EUCLID = 9, D.config = D.set = function(e) {
                    var t, r;
                    if (null != e) {
                        if ("object" == typeof e) {
                            if (e.hasOwnProperty(t = "DECIMAL_PLACES") && (h(r = e[t], 0, 1e9, t), k = r), e.hasOwnProperty(t = "ROUNDING_MODE") && (h(r = e[t], 0, 8, t), I = r), e.hasOwnProperty(t = "EXPONENTIAL_AT") && ((r = e[t]) && r.pop ? (h(r[0], -1e9, 0, t), h(r[1], 0, 1e9, t), C = r[0], B = r[1]) : (h(r, -1e9, 1e9, t), C = -(B = r < 0 ? -r : r))), e.hasOwnProperty(t = "RANGE")) {
                                if ((r = e[t]) && r.pop) h(r[0], -1e9, -1, t), h(r[1], 1, 1e9, t), O = r[0], j = r[1];
                                else if (h(r, -1e9, 1e9, t), r) O = -(j = r < 0 ? -r : r);
                                else throw Error(s + t + " cannot be zero: " + r)
                            }
                            if (e.hasOwnProperty(t = "CRYPTO")) {
                                if (!!(r = e[t]) === r) {
                                    if (r) {
                                        if ("undefined" != typeof crypto && crypto && (crypto.getRandomValues || crypto.randomBytes)) M = r;
                                        else throw M = !r, Error(s + "crypto unavailable")
                                    } else M = r
                                } else throw Error(s + t + " not true or false: " + r)
                            }
                            if (e.hasOwnProperty(t = "MODULO_MODE") && (h(r = e[t], 0, 9, t), _ = r), e.hasOwnProperty(t = "POW_PRECISION") && (h(r = e[t], 0, 1e9, t), U = r), e.hasOwnProperty(t = "FORMAT")) {
                                if ("object" == typeof(r = e[t])) N = r;
                                else throw Error(s + t + " not an object: " + r)
                            }
                            if (e.hasOwnProperty(t = "ALPHABET")) {
                                if ("string" != typeof(r = e[t]) || /^.?$|[+\-.\s]|(.).*\1/.test(r)) throw Error(s + t + " invalid: " + r);
                                R = "0123456789" == r.slice(0, 10), L = r
                            }
                        } else throw Error(s + "Object expected: " + e)
                    }
                    return {
                        DECIMAL_PLACES: k,
                        ROUNDING_MODE: I,
                        EXPONENTIAL_AT: [C, B],
                        RANGE: [O, j],
                        CRYPTO: M,
                        MODULO_MODE: _,
                        POW_PRECISION: U,
                        FORMAT: N,
                        ALPHABET: L
                    }
                }, D.isBigNumber = function(e) {
                    if (!e || !0 !== e._isBigNumber) return !1;
                    if (!D.DEBUG) return !0;
                    var t, r, n = e.c,
                        i = e.e,
                        a = e.s;
                    e: if ("[object Array]" == ({}).toString.call(n)) {
                        if ((1 === a || -1 === a) && i >= -1e9 && i <= 1e9 && i === o(i)) {
                            if (0 === n[0]) {
                                if (0 === i && 1 === n.length) return !0;
                                break e
                            }
                            if ((t = (i + 1) % 14) < 1 && (t += 14), String(n[0]).length == t) {
                                for (t = 0; t < n.length; t++)
                                    if ((r = n[t]) < 0 || r >= 1e14 || r !== o(r)) break e;
                                if (0 !== r) return !0
                            }
                        }
                    } else if (null === n && null === i && (null === a || 1 === a || -1 === a)) return !0;
                    throw Error(s + "Invalid BigNumber: " + e)
                }, D.maximum = D.max = function() {
                    return W(arguments, S.lt)
                }, D.minimum = D.min = function() {
                    return W(arguments, S.gt)
                }, D.random = (r = 9007199254740992 * Math.random() & 2097151 ? function() {
                    return o(9007199254740992 * Math.random())
                } : function() {
                    return (1073741824 * Math.random() | 0) * 8388608 + (8388608 * Math.random() | 0)
                }, function(e) {
                    var t, n, a, l, u, f = 0,
                        d = [],
                        p = new D(T);
                    if (null == e ? e = k : h(e, 0, 1e9), l = i(e / 14), M) {
                        if (crypto.getRandomValues) {
                            for (t = crypto.getRandomValues(new Uint32Array(l *= 2)); f < l;)(u = 131072 * t[f] + (t[f + 1] >>> 11)) >= 9e15 ? (n = crypto.getRandomValues(new Uint32Array(2)), t[f] = n[0], t[f + 1] = n[1]) : (d.push(u % 1e14), f += 2);
                            f = l / 2
                        } else if (crypto.randomBytes) {
                            for (t = crypto.randomBytes(l *= 7); f < l;)(u = (31 & t[f]) * 281474976710656 + 1099511627776 * t[f + 1] + 4294967296 * t[f + 2] + 16777216 * t[f + 3] + (t[f + 4] << 16) + (t[f + 5] << 8) + t[f + 6]) >= 9e15 ? crypto.randomBytes(7).copy(t, f) : (d.push(u % 1e14), f += 7);
                            f = l / 7
                        } else throw M = !1, Error(s + "crypto unavailable")
                    }
                    if (!M)
                        for (; f < l;)(u = r()) < 9e15 && (d[f++] = u % 1e14);
                    for (l = d[--f], e %= 14, l && e && (u = c[14 - e], d[f] = o(l / u) * u); 0 === d[f]; d.pop(), f--);
                    if (f < 0) d = [a = 0];
                    else {
                        for (a = -1; 0 === d[0]; d.splice(0, 1), a -= 14);
                        for (f = 1, u = d[0]; u >= 10; u /= 10, f++);
                        f < 14 && (a -= 14 - f)
                    }
                    return p.e = a, p.c = d, p
                }), D.sum = function() {
                    for (var e = 1, t = arguments, r = new D(t[0]); e < t.length;) r = r.plus(t[e++]);
                    return r
                }, x = function() {
                    var e = "0123456789";

                    function t(e, t, r, n) {
                        for (var i, o, s = [0], a = 0, c = e.length; a < c;) {
                            for (o = s.length; o--; s[o] *= t);
                            for (s[0] += n.indexOf(e.charAt(a++)), i = 0; i < s.length; i++) s[i] > r - 1 && (null == s[i + 1] && (s[i + 1] = 0), s[i + 1] += s[i] / r | 0, s[i] %= r)
                        }
                        return s.reverse()
                    }
                    return function(r, n, i, o, s) {
                        var a, c, l, f, h, d, p, y, m = r.indexOf("."),
                            b = k,
                            w = I;
                        for (m >= 0 && (f = U, U = 0, r = r.replace(".", ""), d = (y = new D(n)).pow(r.length - m), U = f, y.c = t(g(u(d.c), d.e, "0"), 10, i, e), y.e = y.c.length), l = f = (p = t(r, n, i, s ? (a = L, e) : (a = e, L))).length; 0 == p[--f]; p.pop());
                        if (!p[0]) return a.charAt(0);
                        if (m < 0 ? --l : (d.c = p, d.e = l, d.s = o, p = (d = E(d, y, b, w, i)).c, h = d.r, l = d.e), m = p[c = l + b + 1], f = i / 2, h = h || c < 0 || null != p[c + 1], h = w < 4 ? (null != m || h) && (0 == w || w == (d.s < 0 ? 3 : 2)) : m > f || m == f && (4 == w || h || 6 == w && 1 & p[c - 1] || w == (d.s < 0 ? 8 : 7)), c < 1 || !p[0]) r = h ? g(a.charAt(1), -b, a.charAt(0)) : a.charAt(0);
                        else {
                            if (p.length = c, h)
                                for (--i; ++p[--c] > i;) p[c] = 0, c || (++l, p = [1].concat(p));
                            for (f = p.length; !p[--f];);
                            for (m = 0, r = ""; m <= f; r += a.charAt(p[m++]));
                            r = g(r, l, a.charAt(0))
                        }
                        return r
                    }
                }(), E = function() {
                    function e(e, t, r) {
                        var n, i, o, s, a = 0,
                            c = e.length,
                            l = t % 1e7,
                            u = t / 1e7 | 0;
                        for (e = e.slice(); c--;) n = u * (o = e[c] % 1e7) + (s = e[c] / 1e7 | 0) * l, a = ((i = l * o + n % 1e7 * 1e7 + a) / r | 0) + (n / 1e7 | 0) + u * s, e[c] = i % r;
                        return a && (e = [a].concat(e)), e
                    }

                    function t(e, t, r, n) {
                        var i, o;
                        if (r != n) o = r > n ? 1 : -1;
                        else
                            for (i = o = 0; i < r; i++)
                                if (e[i] != t[i]) {
                                    o = e[i] > t[i] ? 1 : -1;
                                    break
                                } return o
                    }

                    function r(e, t, r, n) {
                        for (var i = 0; r--;) e[r] -= i, i = e[r] < t[r] ? 1 : 0, e[r] = i * n + e[r] - t[r];
                        for (; !e[0] && e.length > 1; e.splice(0, 1));
                    }
                    return function(n, i, s, a, c) {
                        var u, f, h, d, p, g, y, m, b, w, v, E, x, A, S, T, k, I = n.s == i.s ? 1 : -1,
                            C = n.c,
                            B = i.c;
                        if (!C || !C[0] || !B || !B[0]) return new D(n.s && i.s && (C ? !B || C[0] != B[0] : B) ? C && 0 == C[0] || !B ? 0 * I : I / 0 : NaN);
                        for (b = (m = new D(I)).c = [], I = s + (f = n.e - i.e) + 1, c || (c = 1e14, f = l(n.e / 14) - l(i.e / 14), I = I / 14 | 0), h = 0; B[h] == (C[h] || 0); h++);
                        if (B[h] > (C[h] || 0) && f--, I < 0) b.push(1), d = !0;
                        else {
                            for (A = C.length, T = B.length, h = 0, I += 2, (p = o(c / (B[0] + 1))) > 1 && (B = e(B, p, c), C = e(C, p, c), T = B.length, A = C.length), x = T, v = (w = C.slice(0, T)).length; v < T; w[v++] = 0);
                            k = [0].concat(k = B.slice()), S = B[0], B[1] >= c / 2 && S++;
                            do {
                                if (p = 0, (u = t(B, w, T, v)) < 0) {
                                    if (E = w[0], T != v && (E = E * c + (w[1] || 0)), (p = o(E / S)) > 1)
                                        for (p >= c && (p = c - 1), y = (g = e(B, p, c)).length, v = w.length; 1 == t(g, w, y, v);) p--, r(g, T < y ? k : B, y, c), y = g.length, u = 1;
                                    else 0 == p && (u = p = 1), y = (g = B.slice()).length;
                                    if (y < v && (g = [0].concat(g)), r(w, g, v, c), v = w.length, -1 == u)
                                        for (; 1 > t(B, w, T, v);) p++, r(w, T < v ? k : B, v, c), v = w.length
                                } else 0 === u && (p++, w = [0]);
                                b[h++] = p, w[0] ? w[v++] = C[x] || 0 : (w = [C[x]], v = 1)
                            } while ((x++ < A || null != w[0]) && I--);
                            d = null != w[0], b[0] || b.splice(0, 1)
                        }
                        if (1e14 == c) {
                            for (h = 1, I = b[0]; I >= 10; I /= 10, h++);
                            Z(m, s + (m.e = h + 14 * f - 1) + 1, a, d)
                        } else m.e = f, m.r = +d;
                        return m
                    }
                }(), y = /^(-?)0([xbo])(?=\w[\w.]*$)/i, m = /^([^.]+)\.$/, b = /^\.([^.]+)$/, w = /^-?(Infinity|NaN)$/, v = /^\s*\+(?=[\w.])|^\s+|\s+$/g, A = function(e, t, r, n) {
                    var i, o = r ? t : t.replace(v, "");
                    if (w.test(o)) e.s = isNaN(o) ? null : o < 0 ? -1 : 1;
                    else {
                        if (!r && (o = o.replace(y, function(e, t, r) {
                                return i = "x" == (r = r.toLowerCase()) ? 16 : "b" == r ? 2 : 8, n && n != i ? e : t
                            }), n && (i = n, o = o.replace(m, "$1").replace(b, "0.$1")), t != o)) return new D(o, i);
                        if (D.DEBUG) throw Error(s + "Not a" + (n ? " base " + n : "") + " number: " + t);
                        e.s = null
                    }
                    e.c = e.e = null
                }, S.absoluteValue = S.abs = function() {
                    var e = new D(this);
                    return e.s < 0 && (e.s = 1), e
                }, S.comparedTo = function(e, t) {
                    return f(this, new D(e, t))
                }, S.decimalPlaces = S.dp = function(e, t) {
                    var r, n, i;
                    if (null != e) return h(e, 0, 1e9), null == t ? t = I : h(t, 0, 8), Z(new D(this), e + this.e + 1, t);
                    if (!(r = this.c)) return null;
                    if (n = ((i = r.length - 1) - l(this.e / 14)) * 14, i = r[i])
                        for (; i % 10 == 0; i /= 10, n--);
                    return n < 0 && (n = 0), n
                }, S.dividedBy = S.div = function(e, t) {
                    return E(this, new D(e, t), k, I)
                }, S.dividedToIntegerBy = S.idiv = function(e, t) {
                    return E(this, new D(e, t), 0, 1)
                }, S.exponentiatedBy = S.pow = function(e, t) {
                    var r, n, a, c, l, u, f, h, p, g = this;
                    if ((e = new D(e)).c && !e.isInteger()) throw Error(s + "Exponent not an integer: " + H(e));
                    if (null != t && (t = new D(t)), u = e.e > 14, !g.c || !g.c[0] || 1 == g.c[0] && !g.e && 1 == g.c.length || !e.c || !e.c[0]) return p = new D(Math.pow(+H(g), u ? e.s * (2 - d(e)) : +H(e))), t ? p.mod(t) : p;
                    if (f = e.s < 0, t) {
                        if (t.c ? !t.c[0] : !t.s) return new D(NaN);
                        (n = !f && g.isInteger() && t.isInteger()) && (g = g.mod(t))
                    } else {
                        if (e.e > 9 && (g.e > 0 || g.e < -1 || (0 == g.e ? g.c[0] > 1 || u && g.c[1] >= 24e7 : g.c[0] < 8e13 || u && g.c[0] <= 9999975e7))) return g.s < 0 && d(e), c = -0, g.e > -1 && (c = 1 / c), new D(f ? 1 / c : c);
                        U && (c = i(U / 14 + 2))
                    }
                    for (u ? (r = new D(.5), f && (e.s = 1), h = d(e)) : h = (a = Math.abs(+H(e))) % 2, p = new D(T);;) {
                        if (h) {
                            if (!(p = p.times(g)).c) break;
                            c ? p.c.length > c && (p.c.length = c) : n && (p = p.mod(t))
                        }
                        if (a) {
                            if (0 === (a = o(a / 2))) break;
                            h = a % 2
                        } else if (Z(e = e.times(r), e.e + 1, 1), e.e > 14) h = d(e);
                        else {
                            if (0 == (a = +H(e))) break;
                            h = a % 2
                        }
                        g = g.times(g), c ? g.c && g.c.length > c && (g.c.length = c) : n && (g = g.mod(t))
                    }
                    return n ? p : (f && (p = T.div(p)), t ? p.mod(t) : c ? Z(p, U, I, l) : p)
                }, S.integerValue = function(e) {
                    var t = new D(this);
                    return null == e ? e = I : h(e, 0, 8), Z(t, t.e + 1, e)
                }, S.isEqualTo = S.eq = function(e, t) {
                    return 0 === f(this, new D(e, t))
                }, S.isFinite = function() {
                    return !!this.c
                }, S.isGreaterThan = S.gt = function(e, t) {
                    return f(this, new D(e, t)) > 0
                }, S.isGreaterThanOrEqualTo = S.gte = function(e, t) {
                    return 1 === (t = f(this, new D(e, t))) || 0 === t
                }, S.isInteger = function() {
                    return !!this.c && l(this.e / 14) > this.c.length - 2
                }, S.isLessThan = S.lt = function(e, t) {
                    return 0 > f(this, new D(e, t))
                }, S.isLessThanOrEqualTo = S.lte = function(e, t) {
                    return -1 === (t = f(this, new D(e, t))) || 0 === t
                }, S.isNaN = function() {
                    return !this.s
                }, S.isNegative = function() {
                    return this.s < 0
                }, S.isPositive = function() {
                    return this.s > 0
                }, S.isZero = function() {
                    return !!this.c && 0 == this.c[0]
                }, S.minus = function(e, t) {
                    var r, n, i, o, s = this.s;
                    if (t = (e = new D(e, t)).s, !s || !t) return new D(NaN);
                    if (s != t) return e.s = -t, this.plus(e);
                    var a = this.e / 14,
                        c = e.e / 14,
                        u = this.c,
                        f = e.c;
                    if (!a || !c) {
                        if (!u || !f) return u ? (e.s = -t, e) : new D(f ? this : NaN);
                        if (!u[0] || !f[0]) return f[0] ? (e.s = -t, e) : new D(u[0] ? this : -0)
                    }
                    if (a = l(a), c = l(c), u = u.slice(), s = a - c) {
                        for ((o = s < 0) ? (s = -s, i = u) : (c = a, i = f), i.reverse(), t = s; t--; i.push(0));
                        i.reverse()
                    } else
                        for (n = (o = (s = u.length) < (t = f.length)) ? s : t, s = t = 0; t < n; t++)
                            if (u[t] != f[t]) {
                                o = u[t] < f[t];
                                break
                            } if (o && (i = u, u = f, f = i, e.s = -e.s), (t = (n = f.length) - (r = u.length)) > 0)
                        for (; t--; u[r++] = 0);
                    for (t = 1e14 - 1; n > s;) {
                        if (u[--n] < f[n]) {
                            for (r = n; r && !u[--r]; u[r] = t);
                            --u[r], u[n] += 1e14
                        }
                        u[n] -= f[n]
                    }
                    for (; 0 == u[0]; u.splice(0, 1), --c);
                    return u[0] ? z(e, u, c) : (e.s = 3 == I ? -1 : 1, e.c = [e.e = 0], e)
                }, S.modulo = S.mod = function(e, t) {
                    var r, n;
                    return (e = new D(e, t), this.c && e.s && (!e.c || e.c[0])) ? e.c && (!this.c || this.c[0]) ? (9 == _ ? (n = e.s, e.s = 1, r = E(this, e, 0, 3), e.s = n, r.s *= n) : r = E(this, e, 0, _), (e = this.minus(r.times(e))).c[0] || 1 != _ || (e.s = this.s), e) : new D(this) : new D(NaN)
                }, S.multipliedBy = S.times = function(e, t) {
                    var r, n, i, o, s, a, c, u, f, h, d, p, g, y = this.c,
                        m = (e = new D(e, t)).c;
                    if (!y || !m || !y[0] || !m[0]) return this.s && e.s && (!y || y[0] || m) && (!m || m[0] || y) ? (e.s *= this.s, y && m ? (e.c = [0], e.e = 0) : e.c = e.e = null) : e.c = e.e = e.s = null, e;
                    for (n = l(this.e / 14) + l(e.e / 14), e.s *= this.s, (c = y.length) < (h = m.length) && (g = y, y = m, m = g, i = c, c = h, h = i), i = c + h, g = []; i--; g.push(0));
                    for (i = h; --i >= 0;) {
                        for (r = 0, d = m[i] % 1e7, p = m[i] / 1e7 | 0, s = c, o = i + s; o > i;) a = p * (u = y[--s] % 1e7) + (f = y[s] / 1e7 | 0) * d, r = ((u = d * u + a % 1e7 * 1e7 + g[o] + r) / 1e14 | 0) + (a / 1e7 | 0) + p * f, g[o--] = u % 1e14;
                        g[o] = r
                    }
                    return r ? ++n : g.splice(0, 1), z(e, g, n)
                }, S.negated = function() {
                    var e = new D(this);
                    return e.s = -e.s || null, e
                }, S.plus = function(e, t) {
                    var r, n = this.s;
                    if (t = (e = new D(e, t)).s, !n || !t) return new D(NaN);
                    if (n != t) return e.s = -t, this.minus(e);
                    var i = this.e / 14,
                        o = e.e / 14,
                        s = this.c,
                        a = e.c;
                    if (!i || !o) {
                        if (!s || !a) return new D(n / 0);
                        if (!s[0] || !a[0]) return a[0] ? e : new D(s[0] ? this : 0 * n)
                    }
                    if (i = l(i), o = l(o), s = s.slice(), n = i - o) {
                        for (n > 0 ? (o = i, r = a) : (n = -n, r = s), r.reverse(); n--; r.push(0));
                        r.reverse()
                    }
                    for ((n = s.length) - (t = a.length) < 0 && (r = a, a = s, s = r, t = n), n = 0; t;) n = (s[--t] = s[t] + a[t] + n) / 1e14 | 0, s[t] = 1e14 === s[t] ? 0 : s[t] % 1e14;
                    return n && (s = [n].concat(s), ++o), z(e, s, o)
                }, S.precision = S.sd = function(e, t) {
                    var r, n, i;
                    if (null != e && !!e !== e) return h(e, 1, 1e9), null == t ? t = I : h(t, 0, 8), Z(new D(this), e, t);
                    if (!(r = this.c)) return null;
                    if (n = 14 * (i = r.length - 1) + 1, i = r[i]) {
                        for (; i % 10 == 0; i /= 10, n--);
                        for (i = r[0]; i >= 10; i /= 10, n++);
                    }
                    return e && this.e + 1 > n && (n = this.e + 1), n
                }, S.shiftedBy = function(e) {
                    return h(e, -9007199254740991, 9007199254740991), this.times("1e" + e)
                }, S.squareRoot = S.sqrt = function() {
                    var e, t, r, n, i, o = this.c,
                        s = this.s,
                        a = this.e,
                        c = k + 4,
                        f = new D("0.5");
                    if (1 !== s || !o || !o[0]) return new D(!s || s < 0 && (!o || o[0]) ? NaN : o ? this : 1 / 0);
                    if (0 == (s = Math.sqrt(+H(this))) || s == 1 / 0 ? (((t = u(o)).length + a) % 2 == 0 && (t += "0"), s = Math.sqrt(+t), a = l((a + 1) / 2) - (a < 0 || a % 2), t = s == 1 / 0 ? "5e" + a : (t = s.toExponential()).slice(0, t.indexOf("e") + 1) + a, r = new D(t)) : r = new D(s + ""), r.c[0]) {
                        for ((s = (a = r.e) + c) < 3 && (s = 0);;)
                            if (i = r, r = f.times(i.plus(E(this, i, c, 1))), u(i.c).slice(0, s) === (t = u(r.c)).slice(0, s)) {
                                if (r.e < a && --s, "9999" != (t = t.slice(s - 3, s + 1)) && (n || "4999" != t)) {
                                    +t && (+t.slice(1) || "5" != t.charAt(0)) || (Z(r, r.e + k + 2, 1), e = !r.times(r).eq(this));
                                    break
                                }
                                if (!n && (Z(i, i.e + k + 2, 0), i.times(i).eq(this))) {
                                    r = i;
                                    break
                                }
                                c += 4, s += 4, n = 1
                            }
                    }
                    return Z(r, r.e + k + 1, I, e)
                }, S.toExponential = function(e, t) {
                    return null != e && (h(e, 0, 1e9), e++), P(this, e, t, 1)
                }, S.toFixed = function(e, t) {
                    return null != e && (h(e, 0, 1e9), e = e + this.e + 1), P(this, e, t)
                }, S.toFormat = function(e, t, r) {
                    var n;
                    if (null == r) null != e && t && "object" == typeof t ? (r = t, t = null) : e && "object" == typeof e ? (r = e, e = t = null) : r = N;
                    else if ("object" != typeof r) throw Error(s + "Argument not an object: " + r);
                    if (n = this.toFixed(e, t), this.c) {
                        var i, o = n.split("."),
                            a = +r.groupSize,
                            c = +r.secondaryGroupSize,
                            l = r.groupSeparator || "",
                            u = o[0],
                            f = o[1],
                            h = this.s < 0,
                            d = h ? u.slice(1) : u,
                            p = d.length;
                        if (c && (i = a, a = c, c = i, p -= i), a > 0 && p > 0) {
                            for (i = p % a || a, u = d.substr(0, i); i < p; i += a) u += l + d.substr(i, a);
                            c > 0 && (u += l + d.slice(i)), h && (u = "-" + u)
                        }
                        n = f ? u + (r.decimalSeparator || "") + ((c = +r.fractionGroupSize) ? f.replace(RegExp("\\d{" + c + "}\\B", "g"), "$&" + (r.fractionGroupSeparator || "")) : f) : u
                    }
                    return (r.prefix || "") + n + (r.suffix || "")
                }, S.toFraction = function(e) {
                    var t, r, n, i, o, a, l, f, h, d, p, g, y = this.c;
                    if (null != e && (!(l = new D(e)).isInteger() && (l.c || 1 !== l.s) || l.lt(T))) throw Error(s + "Argument " + (l.isInteger() ? "out of range: " : "not an integer: ") + H(l));
                    if (!y) return new D(this);
                    for (t = new D(T), h = r = new D(T), n = f = new D(T), g = u(y), o = t.e = g.length - this.e - 1, t.c[0] = c[(a = o % 14) < 0 ? 14 + a : a], e = !e || l.comparedTo(t) > 0 ? o > 0 ? t : h : l, a = j, j = 1 / 0, l = new D(g), f.c[0] = 0; d = E(l, t, 0, 1), 1 != (i = r.plus(d.times(n))).comparedTo(e);) r = n, n = i, h = f.plus(d.times(i = h)), f = i, t = l.minus(d.times(i = t)), l = i;
                    return i = E(e.minus(r), n, 0, 1), f = f.plus(i.times(h)), r = r.plus(i.times(n)), f.s = h.s = this.s, o *= 2, p = 1 > E(h, n, o, I).minus(this).abs().comparedTo(E(f, r, o, I).minus(this).abs()) ? [h, n] : [f, r], j = a, p
                }, S.toNumber = function() {
                    return +H(this)
                }, S.toPrecision = function(e, t) {
                    return null != e && h(e, 1, 1e9), P(this, e, t, 2)
                }, S.toString = function(e) {
                    var t, r = this,
                        n = r.s,
                        i = r.e;
                    return null === i ? n ? (t = "Infinity", n < 0 && (t = "-" + t)) : t = "NaN" : (null == e ? t = i <= C || i >= B ? p(u(r.c), i) : g(u(r.c), i, "0") : 10 === e && R ? t = g(u((r = Z(new D(r), k + i + 1, I)).c), r.e, "0") : (h(e, 2, L.length, "Base"), t = x(g(u(r.c), i, "0"), 10, e, n, !0)), n < 0 && r.c[0] && (t = "-" + t)), t
                }, S.valueOf = S.toJSON = function() {
                    return H(this)
                }, S._isBigNumber = !0, S[Symbol.toStringTag] = "BigNumber", S[Symbol.for("nodejs.util.inspect.custom")] = S.valueOf, null != t && D.set(t), D
            }();
            let m = e => new y(e),
                b = (e, t) => {
                    let r = new y(e.toString()),
                        n = new y(t.toString());
                    return r.plus(n)
                },
                w = (e, t = 9) => {
                    if (void 0 === e) return "---";
                    let r = "",
                        n = new y(e.toString()).shiftedBy(-1 * t);
                    return n.gte(1e9) ? (n = n.shiftedBy(-9), r = " B") : n.gte(1e6) ? (n = n.shiftedBy(-6), r = " M") : n.gte(1e4) && (n = n.shiftedBy(-3), r = " K"), (n = n.gte(1) ? n.decimalPlaces(3, y.ROUND_DOWN) : n.decimalPlaces(6, y.ROUND_DOWN)).toFormat() + r
                }
        },
        2637: function(e, t, r) {
            "use strict";
            r.d(t, {
                Kc: function() {
                    return o
                },
                Zt: function() {
                    return s
                },
                j7: function() {
                    return a
                },
                lr: function() {
                    return i
                }
            });
            var n = r(5967);
            let i = "#6f53e4",
                o = ("undefined" != typeof window && window.location.origin.indexOf("http://localhost"), "https://fullnode.testnet.sui.io/"),
                s = "https://faucet.testnet.sui.io/",
                a = n.q.SUI_TESTNET
        },
        5860: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return o
                }
            });
            var n = r(1860);
            let i = () => n.namespace("ethos")("configuration") || {};
            var o = i
        },
        2724: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return c
                }
            });
            var n = r(1860),
                i = r(5860),
                o = r(7752),
                s = r(1111);
            let a = e => {
                let {
                    apiKey: t,
                    walletAppUrl: r,
                    network: a
                } = (0, i.Z)();
                if ((0, o.Z)("getIframe", "getIframe", t, r), !t || !r) return;
                let c = "ethos-wallet-iframe",
                    l = 0,
                    u = document.getElementById(c),
                    f = () => {
                        u && (u.style.width = "1px", u.style.height = "1px")
                    },
                    h = new URLSearchParams(window.location.search),
                    d = h.get("access_token"),
                    p = h.get("refresh_token"),
                    g = r + `/wallet?apiKey=${t}&network=${a}`;
                if (d && p) {
                    g += `&access_token=${d}&refresh_token=${p}`, h.delete("access_token"), h.delete("refresh_token");
                    let e = location.protocol + "//" + location.host + location.pathname;
                    h.toString().length > 0 && (e += "?" + h.toString()), n.namespace("auth")("access_token", d), n.namespace("auth")("refresh_token", p), window.history.pushState({}, "", e)
                } else {
                    let e = n.namespace("auth")("access_token"),
                        t = n.namespace("auth")("refresh_token");
                    e && t && (g += `&access_token=${e}&refresh_token=${t}`)
                }
                return u ? u.src !== g && (u.src = g) : ((0, o.Z)("getIframe", "Load Iframe", g), (u = document.createElement("IFRAME")).src = g, u.id = c, u.style.border = "none", u.style.position = "absolute", u.style.top = l - 1 + "px", u.style.right = "60px", u.style.width = "1px", u.style.height = "1px", u.style.zIndex = "99", u.style.backgroundColor = "transparent", u.setAttribute("allow", "payment; clipboard-read; clipboard-write"), document.body.appendChild(u), window.addEventListener("message", e => {
                    if (e.origin === r) {
                        let {
                            action: t
                        } = e.data;
                        switch (t) {
                            case "close":
                                f();
                                break;
                            case "ready":
                                u.setAttribute("readyToReceiveMessages", "true");
                                let r = n.namespace("iframeMessages"),
                                    i = r("messages") || [];
                                for (let e of i)(0, s.Z)(e);
                                r("messages", null)
                        }
                    }
                }), window.addEventListener("scroll", () => {
                    l = window.scrollY, u.style.top = l + "px"
                })), e ? (u.style.width = "360px", u.style.height = "600px") : void 0 !== e && f(), u
            };
            var c = a
        },
        5418: function(e, t, r) {
            "use strict";
            r.d(t, {
                D: function() {
                    return i
                },
                _: function() {
                    return o
                }
            });
            var n = r(2129);
            let i = e => !!e.type && e.type.includes("kiosk") && !!e.content && "fields" in e.content && "kiosk" in e.content.fields,
                o = async (e, t) => {
                    if (!i(t)) return [];
                    let r = (0, n.Z)(t, "content.fields.kiosk");
                    if (!r) return [];
                    let o = [],
                        s;
                    for (; null !== s;) {
                        let t = await e.getDynamicFields({
                            parentId: r,
                            cursor: s
                        });
                        if (!t.data) return [];
                        o = [...o || [], ...t.data], s = t.hasNextPage && t.nextCursor !== s ? t.nextCursor : null
                    }
                    let a = o.filter(e => "0x0000000000000000000000000000000000000000000000000000000000000002::kiosk::Item" === e.name.type).map(e => e.objectId),
                        c = [];
                    for (let t = 0; t < a.length; t += 30) {
                        let r = a.slice(t, t + 30),
                            n = await e.multiGetObjects({
                                ids: r,
                                options: {
                                    showContent: !0,
                                    showType: !0,
                                    showDisplay: !0,
                                    showOwner: !0
                                }
                            });
                        c = [...c, ...n]
                    }
                    return c
                }
        },
        4312: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return D
                },
                w: function() {
                    return N
                }
            });
            var n = r(1213),
                i = r(1592),
                o = Object.prototype.hasOwnProperty,
                s = function(e, t) {
                    return null != e && o.call(e, t)
                },
                a = r(2240),
                c = r(3589),
                l = r(8533),
                u = function(e) {
                    return (0, l.Z)(e) && "[object Arguments]" == (0, c.Z)(e)
                },
                f = Object.prototype,
                h = f.hasOwnProperty,
                d = f.propertyIsEnumerable,
                p = u(function() {
                    return arguments
                }()) ? u : function(e) {
                    return (0, l.Z)(e) && h.call(e, "callee") && !d.call(e, "callee")
                },
                g = r(7771),
                y = /^(?:0|[1-9]\d*)$/,
                m = function(e, t) {
                    var r = typeof e;
                    return !!(t = null == t ? 9007199254740991 : t) && ("number" == r || "symbol" != r && y.test(e)) && e > -1 && e % 1 == 0 && e < t
                },
                b = r(2281),
                w = function(e, t, r) {
                    t = (0, a.Z)(t, e);
                    for (var n, i = -1, o = t.length, s = !1; ++i < o;) {
                        var c = (0, b.Z)(t[i]);
                        if (!(s = null != e && r(e, c))) break;
                        e = e[c]
                    }
                    return s || ++i != o ? s : !!(o = null == e ? 0 : e.length) && "number" == typeof(n = o) && n > -1 && n % 1 == 0 && n <= 9007199254740991 && m(c, o) && ((0, g.Z)(e) || p(e))
                },
                v = function(e, t) {
                    return null != e && w(e, t, s)
                },
                E = r(2129);
            let x = /0x0000000000000000000000000000000000000000000000000000000000000002::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::UrlDomain>, (0x[a-f0-9]{39,40})::display::UrlDomain>/,
                A = /0x0000000000000000000000000000000000000000000000000000000000000002::dynamic_field::Field<(0x[a-f0-9]{39,40})::utils::Marker<(0x[a-f0-9]{39,40})::display::DisplayDomain>, (0x[a-f0-9]{39,40})::display::DisplayDomain>/,
                S = "reference.objectId",
                T = "data.fields.bag.fields.id.id",
                k = "data.fields.logical_owner",
                I = (e, t) => {
                    let {
                        data: r
                    } = e;
                    if ((0, n.is)(r, n._lL)) {
                        let {
                            content: e
                        } = r;
                        if (e && "type" in e) return e.type.match(t)
                    }
                    return !1
                },
                C = e => {
                    let t = {},
                        r = e.find(e => I(e, x)),
                        i = e.find(e => I(e, A));
                    if (r && (0, n.dC3)(r)) {
                        let e = (0, n.dC3)(r).value.fields.url;
                        t.url = N(e)
                    }
                    return i && (0, n.dC3)(i) && (t.description = (0, n.dC3)(i).value.fields.description, t.name = (0, n.dC3)(i).value.fields.name), t
                },
                B = e => !!e.content && "fields" in e.content && "logical_owner" in e.content.fields && "bag" in e.content.fields,
                O = async (e, t) => {
                    if (!B(t) || !v(t, S) || !v(t, T) || !v(t, k)) return t;
                    let r = (0, E.Z)(t, S),
                        n = (0, E.Z)(t, T),
                        i = (0, E.Z)(t, k),
                        o = (await e.getDynamicFields({
                            parentId: n || ""
                        })).data.map(e => e.objectId),
                        s = await e.multiGetObjects({
                            ids: o,
                            options: {
                                showContent: !0,
                                showDisplay: !0,
                                showOwner: !0,
                                showType: !0
                            }
                        });
                    return {
                        id: r,
                        owner: i,
                        ...C(s)
                    }
                };
            var j = r(2637);
            let M = e => {
                if (e) {
                    if (e?.data && "object" == typeof e?.data) return e.data;
                    if (!("error" in e)) return e
                }
            };
            var _ = r(5418),
                U = r(1860);
            let N = e => e ? 0 === e.indexOf("ipfs") ? e.replace(/^ipfs:\/\//, "https://ipfs.io/ipfs/") : e : "",
                L = {
                    suiBalance: (0, i.rp)(0),
                    balances: {},
                    nfts: [],
                    tokens: {},
                    objects: []
                },
                R = async ({
                    address: e,
                    network: t,
                    existingContents: r
                }) => {
                    try {
                        let o = new n.ewe({
                                fullnode: t || j.Kc
                            }),
                            s = new n.r6k(o);
                        if (!e) return L;
                        let a = [];
                        try {
                            a = U.get("invalidTokens") ?? [], a = await (await fetch("https://raw.githubusercontent.com/EthosWallet/valid_packages/main/public/invalid_tokens.json")).json(), U.set("invalidTokens", a)
                        } catch (e) {
                            console.error(e)
                        }
                        let c = (await s.getAllBalances({
                                owner: e
                            })).filter(e => !a.includes(e.coinType.split("::")[0])),
                            l = [],
                            u, f, h = 0,
                            d = !1;
                        for (; null !== f;) {
                            h += 1;
                            let t = await s.getOwnedObjects({
                                owner: e,
                                options: {
                                    showType: !0,
                                    showOwner: !0,
                                    showContent: !0,
                                    showDisplay: !0
                                },
                                cursor: f
                            });
                            l = [...l, ...t.data], d = t.hasNextPage, f = h > 20 ? null : d && u !== t.nextCursor ? t.nextCursor ?? null : null
                        }
                        if (0 === l.length) return r === L ? null : L;
                        let p = [],
                            g = [];
                        if (r?.objects && r.objects.length > 0)
                            for (let e of l) {
                                if (!e.data || e.error) continue;
                                let t = r?.objects.find(t => "object" == typeof e.data && t.objectId === e.data.objectId && t.version.toString() === e.data.version.toString());
                                t ? p.push(t) : g.push(e.data)
                            } else g = l.filter(e => !!e.data && !e.error).map(e => e.data);
                        if (0 === g.length) return null;
                        let y = g,
                            m = p.concat(y),
                            b = (0, i.rp)(0),
                            w = c.reduce((e, t) => (e[t.coinType] = t, t.coinType === n.uq1 && (b = (0, i.rp)(t.totalBalance)), e), {});
                        for (let e of m)
                            if ((0, _.D)(e)) {
                                let t = await (0, _._)(s, e);
                                for (let r of t) r.data && m.push({
                                    ...r.data,
                                    kiosk: e
                                })
                            } let v = [],
                            E = {},
                            x = [];
                        for (let e of m) {
                            let {
                                display: t,
                                content: r
                            } = e, {
                                fields: n
                            } = r?.dataType === "moveObject" ? r : {
                                fields: {}
                            }, o = M(t);
                            try {
                                let t = (e.type || "").split("<"),
                                    r = (t[1] || "").replace(/>/, ""),
                                    a = t[0].split("::"),
                                    c = a[0],
                                    l = a[1],
                                    u = a[a.length - 1],
                                    f = N(o?.image_url ?? o?.img_url ?? o?.url ?? n?.url ?? n?.image_url ?? n?.img_url);
                                if (x.push({
                                        ...e,
                                        packageObjectId: c,
                                        moduleName: l,
                                        structName: u,
                                        name: o?.name ?? n?.name,
                                        description: o?.description ?? n?.description,
                                        imageUrl: f,
                                        display: o,
                                        fields: n,
                                        isCoin: "Coin" === u
                                    }), "Coin" === u) E[r] || (E[r] = {
                                    balance: 0,
                                    coins: []
                                }), E[r].balance = (0, i.BN)(E[r].balance, n.balance), E[r].coins.push({
                                    objectId: e?.objectId,
                                    type: e?.type,
                                    balance: (0, i.rp)(n.balance),
                                    digest: e?.digest,
                                    version: e?.version,
                                    display: o
                                });
                                else if (B(e)) {
                                    let t = await O(s, e);
                                    "name" in t && v.push({
                                        type: e.type ?? "unknown",
                                        packageObjectId: c,
                                        moduleName: l,
                                        structName: u,
                                        chain: "Sui",
                                        address: e?.objectId,
                                        objectId: e?.objectId,
                                        name: o?.name ?? t.name,
                                        description: o?.description ?? t.description,
                                        imageUrl: f,
                                        link: o?.link,
                                        creator: o?.creator,
                                        projectUrl: o?.project_url,
                                        display: o,
                                        links: {
                                            Explorer: `https://explorer.sui.io/objects/${e.objectId}`
                                        },
                                        kiosk: e.kiosk
                                    })
                                } else f && v.push({
                                    type: e.type ?? "Unknown",
                                    packageObjectId: c,
                                    moduleName: l,
                                    structName: u,
                                    chain: "Sui",
                                    address: e?.objectId,
                                    objectId: e?.objectId,
                                    name: o?.name ?? n?.name,
                                    description: o?.description ?? n?.description,
                                    imageUrl: f,
                                    link: o?.link,
                                    creator: o?.creator,
                                    projectUrl: o?.project_url,
                                    display: o,
                                    fields: n,
                                    links: {
                                        Explorer: `https://explorer.sui.io/objects/${e.objectId}`
                                    },
                                    kiosk: e.kiosk
                                })
                            } catch (t) {
                                console.log("Error retrieving object", e, t)
                            }
                        }
                        return {
                            suiBalance: b,
                            balances: w,
                            tokens: E,
                            nfts: v,
                            objects: x,
                            hasNextPage: d,
                            nextCursor: u ?? void 0
                        }
                    } catch (e) {
                        return console.log("Error retrieving wallet contents", e), null
                    }
                };
            var D = R
        },
        4578: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return b
                }
            });
            var n = r(4312),
                i = r(5860),
                o = r(1860),
                s = r(5950),
                a = r(2724),
                c = r(7752),
                l = r(1111);
            let u = () => {
                    (0, c.Z)("activeUser", "Calling Active User");
                    let {
                        walletAppUrl: e,
                        apiKey: t
                    } = (0, i.Z)();
                    (0, c.Z)("activeUser", "Configuration", e, t);
                    let r = r => {
                        let n = i => {
                            if ((0, c.Z)("activeUser", "Message Origin: ", i.origin, e, i), i.origin === e) {
                                let {
                                    action: e,
                                    data: o
                                } = i.data;
                                (0, c.Z)("activeUser", "Message From Wallet", e, o), "user" === e && o.apiKey === t && (window.removeEventListener("message", n), r(o?.user))
                            }
                        };
                        window.addEventListener("message", n);
                        let i = {
                            action: "activeUser"
                        };
                        (0, c.Z)("activeUser", "getIframe"), (0, a.Z)(), (0, c.Z)('activeUser", "Post message to the iframe', i), (0, l.Z)(i)
                    };
                    return new Promise(r)
                },
                f = ({
                    id: e,
                    action: t,
                    data: r,
                    onResponse: n,
                    showWallet: s = !1
                }) => {
                    let {
                        walletAppUrl: u
                    } = (0, i.Z)(), f = e => {
                        if ((0, c.Z)("hostedInteraction", "response: ", e), e.origin === u) {
                            let {
                                approved: r,
                                action: i,
                                data: o
                            } = e.data;
                            i === t && (n({
                                approved: r,
                                data: o
                            }), window.removeEventListener("message", f), (0, a.Z)(!1))
                        }
                    };
                    window.addEventListener("message", f);
                    let h = o.namespace("ethos")("configuration"),
                        {
                            network: d
                        } = h;
                    (0, c.Z)("hostedInteraction", "Posting interaction", e, t, r), (0, l.Z)({
                        id: e,
                        network: d,
                        action: t,
                        data: r
                    }), (0, a.Z)(s)
                };
            var h = r(2637);
            let d = async ({
                provider: e,
                defaultChain: t
            }) => {
                let r = await u(),
                    n = (r?.accounts || []).filter(e => "sui" === e.chain),
                    i = n[0],
                    a = e => new Promise((r, n) => {
                        let o = ({
                                approved: e,
                                data: t
                            }) => {
                                e ? r(t.response) : n({
                                    error: t?.response?.error || "User rejected transaction."
                                })
                            },
                            s = e.transactionBlock.serialize(),
                            a = e.account ?? i.address,
                            c = e.chain ?? t ?? h.j7;
                        f({
                            action: "transaction",
                            data: {
                                input: e,
                                serializedTransaction: s,
                                account: a,
                                chain: c
                            },
                            onResponse: o,
                            showWallet: !0
                        })
                    }),
                    c = t => e.executeTransactionBlock(t),
                    l = e => new Promise((r, n) => {
                        let o = ({
                                approved: e,
                                data: t
                            }) => {
                                e ? r(t.response) : n({
                                    error: t?.response?.error || "User rejected transaction."
                                })
                            },
                            s = e.transactionBlock.serialize(),
                            a = e.account ?? i.address,
                            c = e.chain ?? t ?? h.j7;
                        f({
                            action: "transaction",
                            data: {
                                input: e,
                                serializedTransaction: s,
                                account: a,
                                chain: c
                            },
                            onResponse: o,
                            showWallet: !0
                        })
                    }),
                    d = () => Promise.resolve(!0),
                    g = e => new Promise((t, r) => {
                        let n = ({
                            approved: e,
                            data: n
                        }) => {
                            e ? t(n.response) : r({
                                error: n?.response?.error || "User rejected signing."
                            })
                        };
                        f({
                            action: "sign",
                            data: {
                                ...e,
                                signData: e.message
                            },
                            onResponse: n,
                            showWallet: !0
                        })
                    }),
                    y = (e = !1) => new Promise(t => {
                        let r = () => {
                            t(!0)
                        };
                        f({
                            action: "logout",
                            data: {
                                fromWallet: "boolean" == typeof e && e
                            },
                            onResponse: r
                        }), o.namespace("auth")("access_token", null)
                    }),
                    m = () => y(!0);
                return r ? {
                    type: s.j.Hosted,
                    name: "Ethos",
                    icon: p,
                    email: r.email,
                    getAddress: async () => i?.address,
                    accounts: n,
                    currentAccount: i,
                    signAndExecuteTransactionBlock: a,
                    executeTransactionBlock: c,
                    signTransactionBlock: l,
                    requestPreapproval: d,
                    signMessage: g,
                    disconnect: y,
                    logout: m,
                    provider: e
                } : null
            }, p = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzZEMjhEOSIvPgo8cGF0aCBvcGFjaXR5PSIwLjgiIGQ9Ik05LjEyMTg3IDYuODU3MDZIMTkuOTU4M0MyMC40NTcxIDYuODU3MDYgMjAuODYxNCA3LjI2MTQxIDIwLjg2MTQgNy43NjAyVjE5Ljk4ODZDMjAuODYxNCAyMC40ODc0IDIwLjQ1NzEgMjAuODkxOCAxOS45NTgzIDIwLjg5MThIOS4xMjE4N0M4LjYyMzA4IDIwLjg5MTggOC4yMTg3MiAyMC40ODc0IDguMjE4NzIgMTkuOTg4NlY3Ljc2MDJDOC4yMTg3MiA3LjI2MTQxIDguNjIzMDggNi44NTcwNiA5LjEyMTg3IDYuODU3MDZaIiBzdHJva2U9InVybCgjcGFpbnQwX2xpbmVhcl82OTlfMjY5OCkiIHN0cm9rZS13aWR0aD0iMC40NTE1NzIiLz4KPHBhdGggZD0iTTguNzEyNzQgNy40NTQ1OUwxNi4wOTQ1IDEwLjg4OTRDMTYuNDEyOSAxMS4wMzc2IDE2LjYxNjYgMTEuMzU3IDE2LjYxNjYgMTEuNzA4M1YyMy44MUMxNi42MTY2IDI0LjQ2MzUgMTUuOTQ0IDI0LjkwMDcgMTUuMzQ2OCAyNC42MzUzTDcuOTY1MDIgMjEuMzU1NkM3LjYzODgyIDIxLjIxMDcgNy40Mjg1OCAyMC44ODcyIDcuNDI4NTggMjAuNTMwM1Y4LjI3MzQzQzcuNDI4NTggNy42MTMxMSA4LjExNDA2IDcuMTc2MDIgOC43MTI3NCA3LjQ1NDU5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIzLjM3ODIgMTUuMzc2N0MyMy40MzAzIDE1LjEzMjEgMjMuNTUzOCAxNC45MDg2IDIzLjczMzIgMTQuNzM0M0MyMy45MTI1IDE0LjU2IDI0LjEzOTYgMTQuNDQzIDI0LjM4NTYgMTQuMzk3OUwyNS4wNDA0IDE0LjI3ODRMMjQuMzg1NSAxNC4xNTg4SDI0LjM4NTZDMjQuMTM5NiAxNC4xMTM3IDIzLjkxMjUgMTMuOTk2NyAyMy43MzMyIDEzLjgyMjRDMjMuNTUzOCAxMy42NDgxIDIzLjQzMDMgMTMuNDI0NiAyMy4zNzgyIDEzLjE4TDIzLjIzNDEgMTIuNTAxM0wyMy4wOSAxMy4xOEMyMy4wMzc5IDEzLjQyNDYgMjIuOTE0NCAxMy42NDgxIDIyLjczNTEgMTMuODIyNEMyMi41NTU4IDEzLjk5NjcgMjIuMzI4NyAxNC4xMTM4IDIyLjA4MjcgMTQuMTU4OEwyMS40Mjc4IDE0LjI3ODRMMjIuMDgyNyAxNC4zOTc5SDIyLjA4MjdDMjIuMzI4NyAxNC40NDMgMjIuNTU1NyAxNC41NiAyMi43MzUgMTQuNzM0M0MyMi45MTQ0IDE0LjkwODYgMjMuMDM3OSAxNS4xMzIxIDIzLjA5IDE1LjM3NjdMMjMuMjM0MSAxNi4wNTU0TDIzLjM3ODIgMTUuMzc2N1oiIGZpbGw9IndoaXRlIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNjk5XzI2OTgiIHgxPSIyMC44NjE0IiB5MT0iMTAuNTkyNiIgeDI9IjE0LjUzOTgiIHkyPSIxMy43NTM0IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IndoaXRlIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0id2hpdGUiIHN0b3Atb3BhY2l0eT0iMCIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=", g = e => {
                let t = o.namespace("ethos");
                (0, c.Z)("initialize", "Ethos Configuration", e), t("configuration", e)
            }, y = async () => {
                let {
                    walletAppUrl: e
                } = (0, i.Z)(), t = r => {
                    if (r.origin === e) {
                        let {
                            action: e,
                            data: n
                        } = r.data;
                        if ("connect" !== e || !n.address) return;
                        window.removeEventListener("message", t);
                        let i = {
                            currentAccount: {
                                address: n.address
                            }
                        };
                        (0, c.Z)("mobile", "Mobile connection established", {
                            getSigner: i
                        }, i)
                    }
                };
                window.removeEventListener("message", t), window.addEventListener("message", t)
            }, m = {
                getWalletContents: n.Z,
                postIFrameMessage: l.Z,
                getEthosSigner: d,
                getConfiguration: i.Z,
                initializeEthos: g,
                listenForMobileConnection: y
            };
            var b = m
        },
        7752: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return a
                }
            });
            var n = r(1860);
            let i = e => {
                    let t = n.namespace("log"),
                        r = t("allowed") || [];
                    if (!r.includes(e)) return t("allowed", [...r, e]), `Logging enabled for ${e}. Call ethos.clearAllowLog() to turn off this logging.`
                },
                o = () => {
                    n.namespace("log")("allowed", [])
                },
                s = (e, ...t) => {
                    let r = n.namespace("log")("allowed");
                    r && (r.includes(e) || r.includes("all")) && console.log(e, ...t)
                };
            "undefined" != typeof window && (window.ethos = {
                allowLog: i,
                clearAllowLog: o
            });
            var a = s
        },
        538: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return s
                }
            });
            var n = r(1860),
                i = r(4578);
            let o = async ({
                email: e,
                provider: t,
                apiKey: r
            }) => {
                let {
                    walletAppUrl: o,
                    redirectTo: s
                } = i.Z.getConfiguration(), a = n.namespace("users");
                if (t) {
                    let e = s ?? location.href,
                        n = `${o}/auth?apiKey=${r}&returnTo=${encodeURIComponent(e)}`;
                    location.href = `${o}/socialauth?provider=${t}&redirectTo=${encodeURIComponent(n)}`;
                    return
                }
                return new Promise((n, c) => {
                    let l = e => {
                        if (e.origin === o) {
                            let {
                                action: t,
                                data: r
                            } = e.data;
                            "login" === t && (window.removeEventListener("message", l), a("current", r), n(r))
                        }
                    };
                    window.addEventListener("message", l), i.Z.postIFrameMessage({
                        action: "login",
                        data: {
                            email: e,
                            provider: t,
                            returnTo: s ?? window.location.href,
                            apiKey: r
                        }
                    })
                })
            };
            var s = o
        },
        1111: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return a
                }
            });
            var n = r(1860),
                i = r(2724),
                o = r(7752);
            let s = e => {
                let t = (0, i.Z)();
                if (!t?.getAttribute("readyToReceiveMessages")) {
                    let t = n.namespace("iframeMessages"),
                        r = t("messages") || [],
                        i = t("messages", [...r, e]);
                    (0, o.Z)("iframe", "Storing iframe message", i);
                    return
                }
                t?.contentWindow?.postMessage(e, "*")
            };
            var a = s
        },
        5950: function(e, t, r) {
            "use strict";
            var n, i;
            r.d(t, {
                j: function() {
                    return n
                }
            }), (i = n || (n = {})).Extension = "extension", i.Hosted = "hosted"
        },
        7685: function(e, t, r) {
            "use strict";
            var n = r(9499).Z.Symbol;
            t.Z = n
        },
        3589: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return f
                }
            });
            var n = r(7685),
                i = Object.prototype,
                o = i.hasOwnProperty,
                s = i.toString,
                a = n.Z ? n.Z.toStringTag : void 0,
                c = function(e) {
                    var t = o.call(e, a),
                        r = e[a];
                    try {
                        e[a] = void 0;
                        var n = !0
                    } catch (e) {}
                    var i = s.call(e);
                    return n && (t ? e[a] = r : delete e[a]), i
                },
                l = Object.prototype.toString,
                u = n.Z ? n.Z.toStringTag : void 0,
                f = function(e) {
                    return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : u && u in Object(e) ? c(e) : l.call(e)
                }
        },
        2240: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return $
                }
            });
            var n, i, o, s = r(7771),
                a = r(2714),
                c = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                l = /^\w*$/,
                u = function(e, t) {
                    if ((0, s.Z)(e)) return !1;
                    var r = typeof e;
                    return !!("number" == r || "symbol" == r || "boolean" == r || null == e || (0, a.Z)(e)) || l.test(e) || !c.test(e) || null != t && e in Object(t)
                },
                f = r(3589),
                h = function(e) {
                    var t = typeof e;
                    return null != e && ("object" == t || "function" == t)
                },
                d = function(e) {
                    if (!h(e)) return !1;
                    var t = (0, f.Z)(e);
                    return "[object Function]" == t || "[object GeneratorFunction]" == t || "[object AsyncFunction]" == t || "[object Proxy]" == t
                },
                p = r(9499),
                g = p.Z["__core-js_shared__"],
                y = (n = /[^.]+$/.exec(g && g.keys && g.keys.IE_PROTO || "")) ? "Symbol(src)_1." + n : "",
                m = Function.prototype.toString,
                b = function(e) {
                    if (null != e) {
                        try {
                            return m.call(e)
                        } catch (e) {}
                        try {
                            return e + ""
                        } catch (e) {}
                    }
                    return ""
                },
                w = /^\[object .+?Constructor\]$/,
                v = Object.prototype,
                E = Function.prototype.toString,
                x = v.hasOwnProperty,
                A = RegExp("^" + E.call(x).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                S = function(e, t) {
                    var r, n = null == e ? void 0 : e[t];
                    return h(r = n) && (!y || !(y in r)) && (d(r) ? A : w).test(b(r)) ? n : void 0
                },
                T = S(Object, "create"),
                k = Object.prototype.hasOwnProperty,
                I = Object.prototype.hasOwnProperty;

            function C(e) {
                var t = -1,
                    r = null == e ? 0 : e.length;
                for (this.clear(); ++t < r;) {
                    var n = e[t];
                    this.set(n[0], n[1])
                }
            }
            C.prototype.clear = function() {
                this.__data__ = T ? T(null) : {}, this.size = 0
            }, C.prototype.delete = function(e) {
                var t = this.has(e) && delete this.__data__[e];
                return this.size -= t ? 1 : 0, t
            }, C.prototype.get = function(e) {
                var t = this.__data__;
                if (T) {
                    var r = t[e];
                    return "__lodash_hash_undefined__" === r ? void 0 : r
                }
                return k.call(t, e) ? t[e] : void 0
            }, C.prototype.has = function(e) {
                var t = this.__data__;
                return T ? void 0 !== t[e] : I.call(t, e)
            }, C.prototype.set = function(e, t) {
                var r = this.__data__;
                return this.size += this.has(e) ? 0 : 1, r[e] = T && void 0 === t ? "__lodash_hash_undefined__" : t, this
            };
            var B = function(e, t) {
                    for (var r, n = e.length; n--;)
                        if ((r = e[n][0]) === t || r != r && t != t) return n;
                    return -1
                },
                O = Array.prototype.splice;

            function j(e) {
                var t = -1,
                    r = null == e ? 0 : e.length;
                for (this.clear(); ++t < r;) {
                    var n = e[t];
                    this.set(n[0], n[1])
                }
            }
            j.prototype.clear = function() {
                this.__data__ = [], this.size = 0
            }, j.prototype.delete = function(e) {
                var t = this.__data__,
                    r = B(t, e);
                return !(r < 0) && (r == t.length - 1 ? t.pop() : O.call(t, r, 1), --this.size, !0)
            }, j.prototype.get = function(e) {
                var t = this.__data__,
                    r = B(t, e);
                return r < 0 ? void 0 : t[r][1]
            }, j.prototype.has = function(e) {
                return B(this.__data__, e) > -1
            }, j.prototype.set = function(e, t) {
                var r = this.__data__,
                    n = B(r, e);
                return n < 0 ? (++this.size, r.push([e, t])) : r[n][1] = t, this
            };
            var M = S(p.Z, "Map"),
                _ = function(e) {
                    var t = typeof e;
                    return "string" == t || "number" == t || "symbol" == t || "boolean" == t ? "__proto__" !== e : null === e
                },
                U = function(e, t) {
                    var r = e.__data__;
                    return _(t) ? r["string" == typeof t ? "string" : "hash"] : r.map
                };

            function N(e) {
                var t = -1,
                    r = null == e ? 0 : e.length;
                for (this.clear(); ++t < r;) {
                    var n = e[t];
                    this.set(n[0], n[1])
                }
            }

            function L(e, t) {
                if ("function" != typeof e || null != t && "function" != typeof t) throw TypeError("Expected a function");
                var r = function() {
                    var n = arguments,
                        i = t ? t.apply(this, n) : n[0],
                        o = r.cache;
                    if (o.has(i)) return o.get(i);
                    var s = e.apply(this, n);
                    return r.cache = o.set(i, s) || o, s
                };
                return r.cache = new(L.Cache || N), r
            }
            N.prototype.clear = function() {
                this.size = 0, this.__data__ = {
                    hash: new C,
                    map: new(M || j),
                    string: new C
                }
            }, N.prototype.delete = function(e) {
                var t = U(this, e).delete(e);
                return this.size -= t ? 1 : 0, t
            }, N.prototype.get = function(e) {
                return U(this, e).get(e)
            }, N.prototype.has = function(e) {
                return U(this, e).has(e)
            }, N.prototype.set = function(e, t) {
                var r = U(this, e),
                    n = r.size;
                return r.set(e, t), this.size += r.size == n ? 0 : 1, this
            }, L.Cache = N;
            var R = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
                D = /\\(\\)?/g,
                P = (o = (i = L(function(e) {
                    var t = [];
                    return 46 === e.charCodeAt(0) && t.push(""), e.replace(R, function(e, r, n, i) {
                        t.push(n ? i.replace(D, "$1") : r || e)
                    }), t
                }, function(e) {
                    return 500 === o.size && o.clear(), e
                })).cache, i),
                W = r(7685),
                z = function(e, t) {
                    for (var r = -1, n = null == e ? 0 : e.length, i = Array(n); ++r < n;) i[r] = t(e[r], r, e);
                    return i
                },
                Z = 1 / 0,
                H = W.Z ? W.Z.prototype : void 0,
                V = H ? H.toString : void 0,
                F = function e(t) {
                    if ("string" == typeof t) return t;
                    if ((0, s.Z)(t)) return z(t, e) + "";
                    if ((0, a.Z)(t)) return V ? V.call(t) : "";
                    var r = t + "";
                    return "0" == r && 1 / t == -Z ? "-0" : r
                },
                $ = function(e, t) {
                    return (0, s.Z)(e) ? e : u(e, t) ? [e] : P(null == e ? "" : F(e))
                }
        },
        9499: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return o
                }
            });
            var n = "object" == typeof global && global && global.Object === Object && global,
                i = "object" == typeof self && self && self.Object === Object && self,
                o = n || i || Function("return this")()
        },
        2281: function(e, t, r) {
            "use strict";
            var n = r(2714),
                i = 1 / 0;
            t.Z = function(e) {
                if ("string" == typeof e || (0, n.Z)(e)) return e;
                var t = e + "";
                return "0" == t && 1 / e == -i ? "-0" : t
            }
        },
        2129: function(e, t, r) {
            "use strict";
            r.d(t, {
                Z: function() {
                    return s
                }
            });
            var n = r(2240),
                i = r(2281),
                o = function(e, t) {
                    t = (0, n.Z)(t, e);
                    for (var r = 0, o = t.length; null != e && r < o;) e = e[(0, i.Z)(t[r++])];
                    return r && r == o ? e : void 0
                },
                s = function(e, t, r) {
                    var n = null == e ? void 0 : o(e, t);
                    return void 0 === n ? r : n
                }
        },
        7771: function(e, t) {
            "use strict";
            var r = Array.isArray;
            t.Z = r
        },
        8533: function(e, t) {
            "use strict";
            t.Z = function(e) {
                return null != e && "object" == typeof e
            }
        },
        2714: function(e, t, r) {
            "use strict";
            var n = r(3589),
                i = r(8533);
            t.Z = function(e) {
                return "symbol" == typeof e || (0, i.Z)(e) && "[object Symbol]" == (0, n.Z)(e)
            }
        }
    },
    function(e) {
        var t = function(t) {
            return e(e.s = t)
        };
        e.O(0, [774, 179], function() {
            return t(6840), t(6885)
        }), _N_E = e.O()
    }
]);
