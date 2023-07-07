(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [405], {
        8312: function(e, t, n) {
            (window.__NEXT_P = window.__NEXT_P || []).push(["/", function() {
                return n(4146)
            }])
        },
        4146: function(e, t, n) {
            "use strict";
            n.r(t), n.d(t, {
                default: function() {
                    return ew
                }
            });
            var r, a, l = n(5893),
                o = n(1213),
                s = n(8804),
                i = n(7294),
                c = n(8722);
            let d = e => {
                let {
                    children: t,
                    isWorking: n,
                    workingComponent: r,
                    ...a
                } = e;
                return i.createElement("button", {
                    ...a
                }, n ? r || i.createElement("span", {
                    className: "block p-2"
                }, i.createElement(c.Z, {
                    width: 32
                })) : i.createElement(i.Fragment, null, t))
            };
            var u = n(2637);
            let p = e => {
                let {
                    hoverBackgroundColor: t,
                    hoverChildren: n,
                    children: r,
                    style: a,
                    ...l
                } = e, [o, s] = (0, i.useState)(!1), c = (0, i.useCallback)(() => {
                    s(!0)
                }, []), p = (0, i.useCallback)(() => {
                    s(!1)
                }, []);
                return i.createElement(d, {
                    onMouseEnter: c,
                    onMouseLeave: p,
                    style: {
                        ...a,
                        backgroundColor: o ? t || u.lr : void 0,
                        color: o ? "white" : "black"
                    },
                    ...l
                }, o ? n : r)
            };
            var g = n(7055);
            let C = e => {
                    let {
                        children: t,
                        onClick: n,
                        externalContext: r,
                        ...a
                    } = e, {
                        openModal: l
                    } = r?.modal || (0, g.Z)(), o = (0, i.useCallback)(e => {
                        l(), n && n(e)
                    }, [l, n]);
                    return i.createElement(i.Fragment, null, i.createElement(d, {
                        onClick: o,
                        ...a,
                        style: w(e.style)
                    }, t || i.createElement(i.Fragment, null, "")))
                },
                w = e => ({
                    lineHeight: "21px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "14px",
                    ...e || {}
                });
            var x = n(6046),
                m = n(1592);
            let h = (e, t = 6) => e ? `${e.slice(0,t)}...${e.slice(-1*t)}` : "",
                f = ({
                    width: e = 24,
                    color: t = "#6EBCEE"
                }) => i.createElement("svg", {
                    id: "SuiSvg",
                    xmlns: "http://www.w3.org/2000/svg",
                    width: e,
                    height: e * (40 / 28),
                    viewBox: "-1 0 28 40",
                    style: {
                        display: "block",
                        verticalAlign: "middle"
                    }
                }, i.createElement("path", {
                    d: "M1.8611,33.0541a13.6477,13.6477,0,0,0,23.7778,0,13.89,13.89,0,0,0,0-13.8909L15.1824.8368a1.6444,1.6444,0,0,0-2.8648,0L1.8611,19.1632A13.89,13.89,0,0,0,1.8611,33.0541ZM10.8044,9.5555,13.0338,5.648a.8222.8222,0,0,1,1.4324,0L23.043,20.68a10.8426,10.8426,0,0,1,.8873,8.8828,9.4254,9.4254,0,0,0-.4388-1.4586c-1.1847-3.0254-3.8634-5.36-7.9633-6.9393-2.8187-1.0819-4.618-2.6731-5.3491-4.73C9.2375,13.7848,10.221,10.8942,10.8044,9.5555ZM7.0028,16.2184,4.457,20.68a10.8569,10.8569,0,0,0,0,10.8582,10.6776,10.6776,0,0,0,16.1566,2.935,7.5061,7.5061,0,0,0,.0667-5.2913c-.87-2.1858-2.9646-3.9308-6.2252-5.1876-3.6857-1.4147-6.08-3.6233-7.1157-6.5625A9.297,9.297,0,0,1,7.0028,16.2184Z",
                    style: {
                        fill: t,
                        fillRule: "evenodd"
                    }
                })),
                k = e => i.createElement(p, {
                    ...e,
                    style: v()
                }),
                v = () => ({
                    width: "100%",
                    borderRadius: "12px",
                    textAlign: "left",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    border: "none",
                    fontFamily: "inherit",
                    cursor: "pointer"
                }),
                b = e => {
                    let {
                        externalContext: t,
                        ...n
                    } = e, {
                        wallet: r
                    } = t?.wallet || (0, x.Z)(), a = (0, i.useCallback)(e => i.createElement(i.Fragment, null, i.createElement("svg", {
                        width: "18",
                        height: "18",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg"
                    }, i.createElement("path", {
                        d: "M15.6657 3.88789C15.3991 2.94272 14.5305 2.25 13.5 2.25H10.5C9.46954 2.25 8.60087 2.94272 8.33426 3.88789M15.6657 3.88789C15.7206 4.0825 15.75 4.28782 15.75 4.5V4.5C15.75 4.91421 15.4142 5.25 15 5.25H9C8.58579 5.25 8.25 4.91421 8.25 4.5V4.5C8.25 4.28782 8.27937 4.0825 8.33426 3.88789M15.6657 3.88789C16.3119 3.93668 16.9545 3.99828 17.5933 4.07241C18.6939 4.20014 19.5 5.149 19.5 6.25699V19.5C19.5 20.7426 18.4926 21.75 17.25 21.75H6.75C5.50736 21.75 4.5 20.7426 4.5 19.5V6.25699C4.5 5.149 5.30608 4.20014 6.40668 4.07241C7.04547 3.99828 7.68808 3.93668 8.33426 3.88789",
                        stroke: e ? "white" : "black",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    })), "Copy Wallet Address"), []), l = (0, i.useCallback)(e => {
                        let t = e.target,
                            n = t.innerHTML;
                        t.innerHTML = "Copied!", navigator.clipboard.writeText(r?.address || ""), setTimeout(() => {
                            t.innerHTML = n
                        }, 1e3)
                    }, [r]);
                    return i.createElement(k, {
                        ...n,
                        onClick: l,
                        hoverChildren: a(!0)
                    }, a(!1))
                },
                M = e => {
                    let t = (0, i.useCallback)(e => i.createElement(i.Fragment, null, i.createElement("svg", {
                            width: "18",
                            height: "18",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            xmlns: "http://www.w3.org/2000/svg"
                        }, i.createElement("path", {
                            d: "M12 21C16.1926 21 19.7156 18.1332 20.7157 14.2529M12 21C7.80742 21 4.28442 18.1332 3.2843 14.2529M12 21C14.4853 21 16.5 16.9706 16.5 12C16.5 7.02944 14.4853 3 12 3M12 21C9.51472 21 7.5 16.9706 7.5 12C7.5 7.02944 9.51472 3 12 3M12 3C15.3652 3 18.299 4.84694 19.8431 7.58245M12 3C8.63481 3 5.70099 4.84694 4.15692 7.58245M19.8431 7.58245C17.7397 9.40039 14.9983 10.5 12 10.5C9.00172 10.5 6.26027 9.40039 4.15692 7.58245M19.8431 7.58245C20.5797 8.88743 21 10.3946 21 12C21 12.778 20.9013 13.5329 20.7157 14.2529M20.7157 14.2529C18.1334 15.6847 15.1619 16.5 12 16.5C8.8381 16.5 5.86662 15.6847 3.2843 14.2529M3.2843 14.2529C3.09871 13.5329 3 12.778 3 12C3 10.3946 3.42032 8.88743 4.15692 7.58245",
                            stroke: e ? "white" : "black",
                            strokeWidth: "1.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round"
                        })), "Wallet Explorer"), []),
                        n = (0, i.useCallback)(() => {
                            window.open("https://ethoswallet.xyz/dashboard", "_blank")
                        }, []);
                    return i.createElement(k, {
                        ...e,
                        onClick: n,
                        hoverChildren: t(!0)
                    }, t(!1))
                },
                y = e => {
                    let {
                        externalContext: t,
                        ...n
                    } = e, {
                        wallet: r
                    } = t?.wallet || (0, x.Z)(), a = (0, i.useCallback)(e => i.createElement(i.Fragment, null, i.createElement("svg", {
                        width: "18",
                        height: "18",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        xmlns: "http://www.w3.org/2000/svg"
                    }, i.createElement("path", {
                        d: "M13.5 21V20.25V21ZM7.5 21V21.75V21ZM5.25 18.75H6H5.25ZM5.25 5.25H4.5H5.25ZM7.5 3V2.25V3ZM13.5 3V3.75V3ZM15.75 5.25L15 5.25V5.25H15.75ZM15 9C15 9.41421 15.3358 9.75 15.75 9.75C16.1642 9.75 16.5 9.41421 16.5 9H15ZM16.5 15C16.5 14.5858 16.1642 14.25 15.75 14.25C15.3358 14.25 15 14.5858 15 15H16.5ZM15.75 18.75H16.5H15.75ZM18.2197 14.4697C17.9268 14.7626 17.9268 15.2374 18.2197 15.5303C18.5126 15.8232 18.9874 15.8232 19.2803 15.5303L18.2197 14.4697ZM21.75 12L22.2803 12.5303C22.5732 12.2374 22.5732 11.7626 22.2803 11.4697L21.75 12ZM19.2803 8.46967C18.9874 8.17678 18.5126 8.17678 18.2197 8.46967C17.9268 8.76256 17.9268 9.23744 18.2197 9.53033L19.2803 8.46967ZM9 11.25C8.58579 11.25 8.25 11.5858 8.25 12C8.25 12.4142 8.58579 12.75 9 12.75V11.25ZM13.5 20.25H7.5V21.75H13.5V20.25ZM6 18.75L6 5.25H4.5L4.5 18.75H6ZM7.5 3.75L13.5 3.75V2.25L7.5 2.25V3.75ZM15 5.25V9H16.5V5.25H15ZM15 15V18.75H16.5V15H15ZM6 5.25C6 4.42157 6.67157 3.75 7.5 3.75V2.25C5.84315 2.25 4.5 3.59315 4.5 5.25H6ZM7.5 20.25C6.67157 20.25 6 19.5784 6 18.75H4.5C4.5 20.4069 5.84315 21.75 7.5 21.75V20.25ZM13.5 21.75C15.1569 21.75 16.5 20.4069 16.5 18.75H15C15 19.5784 14.3284 20.25 13.5 20.25V21.75ZM13.5 3.75C14.3284 3.75 15 4.42157 15 5.25L16.5 5.25C16.5 3.59315 15.1569 2.25 13.5 2.25V3.75ZM19.2803 15.5303L22.2803 12.5303L21.2197 11.4697L18.2197 14.4697L19.2803 15.5303ZM22.2803 11.4697L19.2803 8.46967L18.2197 9.53033L21.2197 12.5303L22.2803 11.4697ZM21.75 11.25L9 11.25V12.75L21.75 12.75V11.25Z",
                        fill: e ? "white" : "black"
                    })), "Log Out"), []);
                    return i.createElement(k, {
                        ...n,
                        onClick: r?.disconnect,
                        hoverChildren: a(!0)
                    }, a(!1))
                };
            (r = a || (a = {})).CopyWalletAddress = "copy_wallet_address", r.WalletExplorer = "wallet_explorer", r.Logout = "logout";
            let E = ({
                    includeMenu: e = !0,
                    buttonColor: t = u.lr,
                    extraButtons: n = [],
                    excludeButtons: r = [],
                    externalContext: l
                }) => {
                    let {
                        wallet: o
                    } = l?.wallet || (0, x.Z)(), [s, c] = (0, i.useState)(!1);
                    (0, i.useEffect)(() => {
                        o || c(!1)
                    }, [o]);
                    let d = (0, i.useCallback)(() => {
                            o && c(!0)
                        }, [o]),
                        p = (0, i.useCallback)(() => {
                            o && c(!1)
                        }, [o]);
                    return i.createElement("div", {
                        style: Z(),
                        onMouseEnter: d,
                        onMouseLeave: p
                    }, i.createElement("div", {
                        style: L()
                    }, i.createElement("div", null, i.createElement(f, {
                        color: "#222532",
                        width: 12
                    })), o ? i.createElement(i.Fragment, null, i.createElement("div", {
                        style: S()
                    }, (0, m.az)(o.contents?.suiBalance), " ", "Sui"), i.createElement("div", {
                        style: B()
                    }, o.icon && i.createElement("img", {
                        style: T(),
                        src: o.icon
                    }), h(o.address))) : i.createElement(C, {
                        style: H(),
                        externalContext: l
                    })), e && s && i.createElement("div", {
                        style: V()
                    }, !r.includes(a.CopyWalletAddress) && i.createElement(b, {
                        externalContext: l,
                        hoverBackgroundColor: t
                    }), !r.includes(a.WalletExplorer) && i.createElement(M, {
                        hoverBackgroundColor: t
                    }), n, !r.includes(a.Logout) && i.createElement(y, {
                        externalContext: l,
                        hoverBackgroundColor: t
                    })))
                },
                Z = () => ({
                    position: "relative",
                    backgroundColor: "white",
                    padding: "6px 12px 6px 18px",
                    boxShadow: "1px 1px 3px 1px #dfdfe0",
                    borderRadius: "18px",
                    fontSize: "14px",
                    color: "black"
                }),
                L = () => ({
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "12px"
                }),
                S = () => ({
                    whiteSpace: "nowrap"
                }),
                B = () => ({
                    borderRadius: "30px",
                    backgroundColor: "#f2f1f0",
                    padding: "6px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                }),
                V = () => ({
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    padding: "12px 18px",
                    position: "absolute",
                    bottom: 0,
                    left: "12px",
                    right: "12px",
                    transform: "translateY(100%)",
                    boxShadow: "1px 1px 3px 1px #dfdfe0",
                    borderBottomLeftRadius: "18px",
                    borderBottomRightRadius: "18px",
                    backgroundColor: "white",
                    zIndex: "99"
                }),
                H = () => ({
                    padding: "0 12px 0 0",
                    background: "none",
                    whiteSpace: "nowrap"
                }),
                T = () => ({
                    width: "20px",
                    height: "20px"
                });
            var _ = n(4312),
                A = n(538),
                W = n(7752);
            let I = async (e, t = !1) => {
                (0, W.Z)("logout", `-- Wallet ${t} --`, `-- Is Extension: ${e?.type} --`, `-- Disconnect: ${!!e?.disconnect} --`, "signer", e), "extension" !== e.type && t ? await e.logout() : await e.disconnect()
            }, j = async ({
                signer: e,
                preapproval: t
            }) => e.requestPreapproval(t), F = async ({
                signer: e,
                message: t
            }) => e.sign({
                message: t
            }), $ = async ({
                signer: e,
                transactionInput: t
            }) => ((0, W.Z)("transact", "Starting transaction", e, t), e.signAndExecuteTransactionBlock(t)), N = async ({
                signer: e,
                transactionInput: t
            }) => ((0, W.Z)("transact", "Starting transaction", e, t), e.signTransactionBlock(t)), O = async ({
                signer: e,
                transactionInput: t
            }) => ((0, W.Z)("transact", "Starting transaction", e, t), e.executeTransactionBlock(t));
            var R = n(5418);
            let z = async ({
                signer: e,
                wallet: t,
                type: n,
                cursor: r,
                options: a,
                filter: l
            }) => {
                let o;
                if (t ? o = t.address : e && (o = e.currentAccount?.address), !o) return;
                let s = (e ?? t)?.provider;
                if (!s) return;
                let i = await s.getOwnedObjects({
                        owner: o,
                        filter: {
                            StructType: "0x95a441d389b07437d00dd07e0b6f05f513d7659b13fd7c5d3923c7d9d847199b::ob_kiosk::OwnerToken"
                        },
                        options: a ?? {
                            showContent: !0,
                            showType: !0
                        },
                        cursor: r
                    }),
                    c = [];
                for (let e of i.data)
                    if (e.data) {
                        let t = await (0, R._)(s, e.data);
                        for (let e of t) e.data && e.data?.type === n && c.push(e.data)
                    } return ((await s.getOwnedObjects({
                    owner: o,
                    filter: l ?? {
                        StructType: n ?? ""
                    },
                    options: a ?? {
                        showContent: !0,
                        showDisplay: !0
                    },
                    cursor: r
                })).data ?? []).map(e => e.data).concat(c)
            };
            var D = n(5950),
                P = n(2724);
            let K = e => {
                    e.type !== D.j.Extension && (0, P.Z)(!1)
                },
                q = e => {
                    e.type !== D.j.Extension && (0, P.Z)(!0)
                },
                X = async ({
                    address: e,
                    network: t,
                    faucet: n
                }) => {
                    let r = new o.ewe({
                        fullnode: t ?? u.Kc,
                        faucet: `${n??u.Zt}gas`
                    });
                    return new o.r6k(r).requestSuiFromFaucet(e)
                };
            var Y = n(2129);
            let G = "0xe7ed73e4c2c1b38729155bf5c44dc4496a9edd2f",
                J = "0xa378adb13792599e8eb8c7e4f2e938863921e4f4",
                Q = "0x0000000000000000000000000000000000000002",
                U = "results.Ok[0][1].returnValues[0][0]",
                ee = "results.Ok[0][1].returnValues[1][0]",
                et = e => e?.length > 0 ? Array.from(e, e => ("0" + (255 & e).toString(16)).slice(-2)).join("") : "",
                en = e => e?.length > 0 ? new TextDecoder().decode(e.slice(1).buffer) : "",
                er = e => String(e?.match(/0x0{0,}([\w\d]+)/)?.[1]),
                ea = e => e ? `0x${e.padStart(40,"0")}` : "",
                el = async (e, t, n = Q) => {
                    let r = new o.ewe({
                            fullnode: t || u.Kc
                        }),
                        a = new o.r6k(r);
                    try {
                        let t = new o.a6g;
                        t.add(o.a6g.Transactions.MoveCall({
                            target: `${G}::base_registry::get_record_by_key`,
                            arguments: [t.object(J), t.pure(`${er(e)}.addr.reverse`)]
                        }));
                        let r = (0, Y.Z)(await a.devInspectTransactionBlock({
                            transactionBlock: t,
                            sender: n
                        }), ee);
                        if (!r) return e;
                        let l = ea(et(r)),
                            s = new o.a6g;
                        s.add(o.a6g.Transactions.MoveCall({
                            target: `${G}::resolver::name`,
                            arguments: [t.object(l), t.pure(e)]
                        }));
                        let i = await a.devInspectTransactionBlock({
                                transactionBlock: s,
                                sender: n
                            }),
                            c = (0, Y.Z)(i, U);
                        return c ? en(c) : e
                    } catch (t) {
                        return console.log("Error retreiving SuiNS Name", t), e
                    }
                }, eo = async (e, t, n = Q) => {
                    let r = new o.ewe({
                            fullnode: t || u.Kc
                        }),
                        a = new o.r6k(r);
                    try {
                        let t = new o.a6g;
                        t.add(o.a6g.Transactions.MoveCall({
                            target: `${G}::base_registry::get_record_by_key`,
                            arguments: [t.object(J), t.pure(e)]
                        }));
                        let r = await a.devInspectTransactionBlock({
                                transactionBlock: t,
                                sender: n
                            }),
                            l = (0, Y.Z)(r, ee);
                        if (!l) return e;
                        let s = ea(et(l)),
                            i = new o.a6g;
                        i.add(o.a6g.Transactions.MoveCall({
                            target: `${G}::resolver::addr`,
                            arguments: [t.object(s), t.pure(e)]
                        }));
                        let c = await a.devInspectTransactionBlock({
                                transactionBlock: i,
                                sender: n
                            }),
                            d = (0, Y.Z)(c, U);
                        return d ? ea(et(d)) : e
                    } catch (t) {
                        return console.log("Error retrieving address from SuiNS name", t), e
                    }
                };
            var es = n(5091);
            let ei = () => {
                    let {
                        providerAndSigner: e
                    } = (0, i.useContext)(es.Z);
                    return e || {
                        provider: null,
                        signer: null
                    }
                },
                ec = () => {
                    let {
                        signer: e
                    } = ei();
                    return e?.currentAccount?.address
                },
                ed = () => i.useContext(es.Z).wallet?.wallet?.contents;
            var eu = n(6178);
            let ep = {
                    AddressWidgetButtons: a
                },
                eg = {
                    login: A.Z,
                    logout: I,
                    sign: F,
                    transact: $,
                    signTransactionBlock: N,
                    executeTransactionBlock: O,
                    preapprove: j,
                    showWallet: q,
                    hideWallet: K,
                    showSignInModal: s.Mb,
                    hideSignInModal: s.ap,
                    useProviderAndSigner: ei,
                    useAddress: ec,
                    useContents: ed,
                    useWallet: x.Z,
                    useContext: eu.Z,
                    getWalletContents: _.Z,
                    checkForAssetType: z,
                    dripSui: X,
                    getSuiName: el,
                    getSuiAddress: eo,
                    formatBalance: m.az,
                    truncateMiddle: h,
                    ipfsConversion: _.w,
                    components: {
                        AddressWidget: E,
                        MenuButton: k,
                        headless: {
                            HoverColorButton: p
                        }
                    },
                    enums: ep
                },
                eC = () => {
                    let {
                        status: e,
                        wallet: t
                    } = eg.useWallet();
                    return (0, l.jsx)(C, {
                        className: "display:none",
                        children: "",
						id: "ConnectButton"
                    })
                };
            var ew = eC
        }
    },
    function(e) {
        e.O(0, [774, 888, 179], function() {
            return e(e.s = 8312)
        }), _N_E = e.O()
    }
]);
