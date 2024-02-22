try {
  self["workbox:core:7.0.0"] && _();
} catch {
}
const G = (n, ...e) => {
  let t = n;
  return e.length > 0 && (t += ` :: ${JSON.stringify(e)}`), t;
}, z = G;
class l extends Error {
  constructor(e, t) {
    const s = z(e, t);
    super(s), this.name = e, this.details = t;
  }
}
const d = {
  googleAnalytics: "googleAnalytics",
  precache: "precache-v2",
  prefix: "workbox",
  runtime: "runtime",
  suffix: typeof registration < "u" ? registration.scope : ""
}, L = (n) => [d.prefix, n, d.suffix].filter((e) => e && e.length > 0).join("-"), Q = (n) => {
  for (const e of Object.keys(d))
    n(e);
}, x = {
  updateDetails: (n) => {
    Q((e) => {
      typeof n[e] == "string" && (d[e] = n[e]);
    });
  },
  getGoogleAnalyticsName: (n) => n || L(d.googleAnalytics),
  getPrecacheName: (n) => n || L(d.precache),
  getPrefix: () => d.prefix,
  getRuntimeName: (n) => n || L(d.runtime),
  getSuffix: () => d.suffix
};
function A(n, e) {
  const t = e();
  return n.waitUntil(t), t;
}
try {
  self["workbox:precaching:7.0.0"] && _();
} catch {
}
const J = "__WB_REVISION__";
function X(n) {
  if (!n)
    throw new l("add-to-cache-list-unexpected-type", { entry: n });
  if (typeof n == "string") {
    const r = new URL(n, location.href);
    return {
      cacheKey: r.href,
      url: r.href
    };
  }
  const { revision: e, url: t } = n;
  if (!t)
    throw new l("add-to-cache-list-unexpected-type", { entry: n });
  if (!e) {
    const r = new URL(t, location.href);
    return {
      cacheKey: r.href,
      url: r.href
    };
  }
  const s = new URL(t, location.href), a = new URL(t, location.href);
  return s.searchParams.set(J, e), {
    cacheKey: s.href,
    url: a.href
  };
}
class Y {
  constructor() {
    this.updatedURLs = [], this.notUpdatedURLs = [], this.handlerWillStart = async ({ request: e, state: t }) => {
      t && (t.originalRequest = e);
    }, this.cachedResponseWillBeUsed = async ({ event: e, state: t, cachedResponse: s }) => {
      if (e.type === "install" && t && t.originalRequest && t.originalRequest instanceof Request) {
        const a = t.originalRequest.url;
        s ? this.notUpdatedURLs.push(a) : this.updatedURLs.push(a);
      }
      return s;
    };
  }
}
class Z {
  constructor({ precacheController: e }) {
    this.cacheKeyWillBeUsed = async ({ request: t, params: s }) => {
      const a = (s == null ? void 0 : s.cacheKey) || this._precacheController.getCacheKeyForURL(t.url);
      return a ? new Request(a, { headers: t.headers }) : t;
    }, this._precacheController = e;
  }
}
let w;
function ee() {
  if (w === void 0) {
    const n = new Response("");
    if ("body" in n)
      try {
        new Response(n.body), w = !0;
      } catch {
        w = !1;
      }
    w = !1;
  }
  return w;
}
async function te(n, e) {
  let t = null;
  if (n.url && (t = new URL(n.url).origin), t !== self.location.origin)
    throw new l("cross-origin-copy-response", { origin: t });
  const s = n.clone(), a = {
    headers: new Headers(s.headers),
    status: s.status,
    statusText: s.statusText
  }, r = e ? e(a) : a, i = ee() ? s.body : await s.blob();
  return new Response(i, r);
}
const se = (n) => new URL(String(n), location.href).href.replace(new RegExp(`^${location.origin}`), "");
function v(n, e) {
  const t = new URL(n);
  for (const s of e)
    t.searchParams.delete(s);
  return t.href;
}
async function ne(n, e, t, s) {
  const a = v(e.url, t);
  if (e.url === a)
    return n.match(e, s);
  const r = Object.assign(Object.assign({}, s), { ignoreSearch: !0 }), i = await n.keys(e, r);
  for (const c of i) {
    const o = v(c.url, t);
    if (a === o)
      return n.match(c, s);
  }
}
class ae {
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
}
const F = /* @__PURE__ */ new Set();
async function re() {
  for (const n of F)
    await n();
}
function ie(n) {
  return new Promise((e) => setTimeout(e, n));
}
try {
  self["workbox:strategies:7.0.0"] && _();
} catch {
}
function b(n) {
  return typeof n == "string" ? new Request(n) : n;
}
class ce {
  constructor(e, t) {
    this._cacheKeys = {}, Object.assign(this, t), this.event = t.event, this._strategy = e, this._handlerDeferred = new ae(), this._extendLifetimePromises = [], this._plugins = [...e.plugins], this._pluginStateMap = /* @__PURE__ */ new Map();
    for (const s of this._plugins)
      this._pluginStateMap.set(s, {});
    this.event.waitUntil(this._handlerDeferred.promise);
  }
  async fetch(e) {
    const { event: t } = this;
    let s = b(e);
    if (s.mode === "navigate" && t instanceof FetchEvent && t.preloadResponse) {
      const i = await t.preloadResponse;
      if (i)
        return i;
    }
    const a = this.hasCallback("fetchDidFail") ? s.clone() : null;
    try {
      for (const i of this.iterateCallbacks("requestWillFetch"))
        s = await i({ request: s.clone(), event: t });
    } catch (i) {
      if (i instanceof Error)
        throw new l("plugin-error-request-will-fetch", {
          thrownErrorMessage: i.message
        });
    }
    const r = s.clone();
    try {
      let i;
      i = await fetch(s, s.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
      for (const c of this.iterateCallbacks("fetchDidSucceed"))
        i = await c({
          event: t,
          request: r,
          response: i
        });
      return i;
    } catch (i) {
      throw a && await this.runCallbacks("fetchDidFail", {
        error: i,
        event: t,
        originalRequest: a.clone(),
        request: r.clone()
      }), i;
    }
  }
  async fetchAndCachePut(e) {
    const t = await this.fetch(e), s = t.clone();
    return this.waitUntil(this.cachePut(e, s)), t;
  }
  async cacheMatch(e) {
    const t = b(e);
    let s;
    const { cacheName: a, matchOptions: r } = this._strategy, i = await this.getCacheKey(t, "read"), c = Object.assign(Object.assign({}, r), { cacheName: a });
    s = await caches.match(i, c);
    for (const o of this.iterateCallbacks("cachedResponseWillBeUsed"))
      s = await o({
        cacheName: a,
        matchOptions: r,
        cachedResponse: s,
        request: i,
        event: this.event
      }) || void 0;
    return s;
  }
  async cachePut(e, t) {
    const s = b(e);
    await ie(0);
    const a = await this.getCacheKey(s, "write");
    if (!t)
      throw new l("cache-put-with-no-response", {
        url: se(a.url)
      });
    const r = await this._ensureResponseSafeToCache(t);
    if (!r)
      return !1;
    const { cacheName: i, matchOptions: c } = this._strategy, o = await self.caches.open(i), h = this.hasCallback("cacheDidUpdate"), m = h ? await ne(
      o,
      a.clone(),
      ["__WB_REVISION__"],
      c
    ) : null;
    try {
      await o.put(a, h ? r.clone() : r);
    } catch (u) {
      if (u instanceof Error)
        throw u.name === "QuotaExceededError" && await re(), u;
    }
    for (const u of this.iterateCallbacks("cacheDidUpdate"))
      await u({
        cacheName: i,
        oldResponse: m,
        newResponse: r.clone(),
        request: a,
        event: this.event
      });
    return !0;
  }
  async getCacheKey(e, t) {
    const s = `${e.url} | ${t}`;
    if (!this._cacheKeys[s]) {
      let a = e;
      for (const r of this.iterateCallbacks("cacheKeyWillBeUsed"))
        a = b(await r({
          mode: t,
          request: a,
          event: this.event,
          params: this.params
        }));
      this._cacheKeys[s] = a;
    }
    return this._cacheKeys[s];
  }
  hasCallback(e) {
    for (const t of this._strategy.plugins)
      if (e in t)
        return !0;
    return !1;
  }
  async runCallbacks(e, t) {
    for (const s of this.iterateCallbacks(e))
      await s(t);
  }
  *iterateCallbacks(e) {
    for (const t of this._strategy.plugins)
      if (typeof t[e] == "function") {
        const s = this._pluginStateMap.get(t);
        yield (r) => {
          const i = Object.assign(Object.assign({}, r), { state: s });
          return t[e](i);
        };
      }
  }
  waitUntil(e) {
    return this._extendLifetimePromises.push(e), e;
  }
  async doneWaiting() {
    let e;
    for (; e = this._extendLifetimePromises.shift(); )
      await e;
  }
  destroy() {
    this._handlerDeferred.resolve(null);
  }
  async _ensureResponseSafeToCache(e) {
    let t = e, s = !1;
    for (const a of this.iterateCallbacks("cacheWillUpdate"))
      if (t = await a({
        request: this.request,
        response: t,
        event: this.event
      }) || void 0, s = !0, !t)
        break;
    return s || t && t.status !== 200 && (t = void 0), t;
  }
}
class N {
  constructor(e = {}) {
    this.cacheName = x.getRuntimeName(e.cacheName), this.plugins = e.plugins || [], this.fetchOptions = e.fetchOptions, this.matchOptions = e.matchOptions;
  }
  handle(e) {
    const [t] = this.handleAll(e);
    return t;
  }
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const t = e.event, s = typeof e.request == "string" ? new Request(e.request) : e.request, a = "params" in e ? e.params : void 0, r = new ce(this, { event: t, request: s, params: a }), i = this._getResponse(r, s, t), c = this._awaitComplete(i, r, s, t);
    return [i, c];
  }
  async _getResponse(e, t, s) {
    await e.runCallbacks("handlerWillStart", { event: s, request: t });
    let a;
    try {
      if (a = await this._handle(t, e), !a || a.type === "error")
        throw new l("no-response", { url: t.url });
    } catch (r) {
      if (r instanceof Error) {
        for (const i of e.iterateCallbacks("handlerDidError"))
          if (a = await i({ error: r, event: s, request: t }), a)
            break;
      }
      if (!a)
        throw r;
    }
    for (const r of e.iterateCallbacks("handlerWillRespond"))
      a = await r({ event: s, request: t, response: a });
    return a;
  }
  async _awaitComplete(e, t, s, a) {
    let r, i;
    try {
      r = await e;
    } catch {
    }
    try {
      await t.runCallbacks("handlerDidRespond", {
        event: a,
        request: s,
        response: r
      }), await t.doneWaiting();
    } catch (c) {
      c instanceof Error && (i = c);
    }
    if (await t.runCallbacks("handlerDidComplete", {
      event: a,
      request: s,
      response: r,
      error: i
    }), t.destroy(), i)
      throw i;
  }
}
class p extends N {
  constructor(e = {}) {
    e.cacheName = x.getPrecacheName(e.cacheName), super(e), this._fallbackToNetwork = e.fallbackToNetwork !== !1, this.plugins.push(p.copyRedirectedCacheableResponsesPlugin);
  }
  async _handle(e, t) {
    const s = await t.cacheMatch(e);
    return s || (t.event && t.event.type === "install" ? await this._handleInstall(e, t) : await this._handleFetch(e, t));
  }
  async _handleFetch(e, t) {
    let s;
    const a = t.params || {};
    if (this._fallbackToNetwork) {
      const r = a.integrity, i = e.integrity, c = !i || i === r;
      s = await t.fetch(new Request(e, {
        integrity: e.mode !== "no-cors" ? i || r : void 0
      })), r && c && e.mode !== "no-cors" && (this._useDefaultCacheabilityPluginIfNeeded(), await t.cachePut(e, s.clone()));
    } else
      throw new l("missing-precache-entry", {
        cacheName: this.cacheName,
        url: e.url
      });
    return s;
  }
  async _handleInstall(e, t) {
    this._useDefaultCacheabilityPluginIfNeeded();
    const s = await t.fetch(e);
    if (!await t.cachePut(e, s.clone()))
      throw new l("bad-precaching-response", {
        url: e.url,
        status: s.status
      });
    return s;
  }
  _useDefaultCacheabilityPluginIfNeeded() {
    let e = null, t = 0;
    for (const [s, a] of this.plugins.entries())
      a !== p.copyRedirectedCacheableResponsesPlugin && (a === p.defaultPrecacheCacheabilityPlugin && (e = s), a.cacheWillUpdate && t++);
    t === 0 ? this.plugins.push(p.defaultPrecacheCacheabilityPlugin) : t > 1 && e !== null && this.plugins.splice(e, 1);
  }
}
p.defaultPrecacheCacheabilityPlugin = {
  async cacheWillUpdate({ response: n }) {
    return !n || n.status >= 400 ? null : n;
  }
};
p.copyRedirectedCacheableResponsesPlugin = {
  async cacheWillUpdate({ response: n }) {
    return n.redirected ? await te(n) : n;
  }
};
class oe {
  constructor({ cacheName: e, plugins: t = [], fallbackToNetwork: s = !0 } = {}) {
    this._urlsToCacheKeys = /* @__PURE__ */ new Map(), this._urlsToCacheModes = /* @__PURE__ */ new Map(), this._cacheKeysToIntegrities = /* @__PURE__ */ new Map(), this._strategy = new p({
      cacheName: x.getPrecacheName(e),
      plugins: [
        ...t,
        new Z({ precacheController: this })
      ],
      fallbackToNetwork: s
    }), this.install = this.install.bind(this), this.activate = this.activate.bind(this);
  }
  get strategy() {
    return this._strategy;
  }
  precache(e) {
    this.addToCacheList(e), this._installAndActiveListenersAdded || (self.addEventListener("install", this.install), self.addEventListener("activate", this.activate), this._installAndActiveListenersAdded = !0);
  }
  addToCacheList(e) {
    const t = [];
    for (const s of e) {
      typeof s == "string" ? t.push(s) : s && s.revision === void 0 && t.push(s.url);
      const { cacheKey: a, url: r } = X(s), i = typeof s != "string" && s.revision ? "reload" : "default";
      if (this._urlsToCacheKeys.has(r) && this._urlsToCacheKeys.get(r) !== a)
        throw new l("add-to-cache-list-conflicting-entries", {
          firstEntry: this._urlsToCacheKeys.get(r),
          secondEntry: a
        });
      if (typeof s != "string" && s.integrity) {
        if (this._cacheKeysToIntegrities.has(a) && this._cacheKeysToIntegrities.get(a) !== s.integrity)
          throw new l("add-to-cache-list-conflicting-integrities", {
            url: r
          });
        this._cacheKeysToIntegrities.set(a, s.integrity);
      }
      if (this._urlsToCacheKeys.set(r, a), this._urlsToCacheModes.set(r, i), t.length > 0) {
        const c = `Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        console.warn(c);
      }
    }
  }
  install(e) {
    return A(e, async () => {
      const t = new Y();
      this.strategy.plugins.push(t);
      for (const [r, i] of this._urlsToCacheKeys) {
        const c = this._cacheKeysToIntegrities.get(i), o = this._urlsToCacheModes.get(r), h = new Request(r, {
          integrity: c,
          cache: o,
          credentials: "same-origin"
        });
        await Promise.all(this.strategy.handleAll({
          params: { cacheKey: i },
          request: h,
          event: e
        }));
      }
      const { updatedURLs: s, notUpdatedURLs: a } = t;
      return { updatedURLs: s, notUpdatedURLs: a };
    });
  }
  activate(e) {
    return A(e, async () => {
      const t = await self.caches.open(this.strategy.cacheName), s = await t.keys(), a = new Set(this._urlsToCacheKeys.values()), r = [];
      for (const i of s)
        a.has(i.url) || (await t.delete(i), r.push(i.url));
      return { deletedURLs: r };
    });
  }
  getURLsToCacheKeys() {
    return this._urlsToCacheKeys;
  }
  getCachedURLs() {
    return [...this._urlsToCacheKeys.keys()];
  }
  getCacheKeyForURL(e) {
    const t = new URL(e, location.href);
    return this._urlsToCacheKeys.get(t.href);
  }
  getIntegrityForCacheKey(e) {
    return this._cacheKeysToIntegrities.get(e);
  }
  async matchPrecache(e) {
    const t = e instanceof Request ? e.url : e, s = this.getCacheKeyForURL(t);
    if (s)
      return (await self.caches.open(this.strategy.cacheName)).match(s);
  }
  createHandlerBoundToURL(e) {
    const t = this.getCacheKeyForURL(e);
    if (!t)
      throw new l("non-precached-url", { url: e });
    return (s) => (s.request = new Request(e), s.params = Object.assign({ cacheKey: t }, s.params), this.strategy.handle(s));
  }
}
let T;
const M = () => (T || (T = new oe()), T);
try {
  self["workbox:routing:7.0.0"] && _();
} catch {
}
const H = "GET", C = (n) => n && typeof n == "object" ? n : { handle: n };
class g {
  constructor(e, t, s = H) {
    this.handler = C(t), this.match = e, this.method = s;
  }
  setCatchHandler(e) {
    this.catchHandler = C(e);
  }
}
class he extends g {
  constructor(e, t, s) {
    const a = ({ url: r }) => {
      const i = e.exec(r.href);
      if (!!i && !(r.origin !== location.origin && i.index !== 0))
        return i.slice(1);
    };
    super(a, t, s);
  }
}
class le {
  constructor() {
    this._routes = /* @__PURE__ */ new Map(), this._defaultHandlerMap = /* @__PURE__ */ new Map();
  }
  get routes() {
    return this._routes;
  }
  addFetchListener() {
    self.addEventListener("fetch", (e) => {
      const { request: t } = e, s = this.handleRequest({ request: t, event: e });
      s && e.respondWith(s);
    });
  }
  addCacheListener() {
    self.addEventListener("message", (e) => {
      if (e.data && e.data.type === "CACHE_URLS") {
        const { payload: t } = e.data, s = Promise.all(t.urlsToCache.map((a) => {
          typeof a == "string" && (a = [a]);
          const r = new Request(...a);
          return this.handleRequest({ request: r, event: e });
        }));
        e.waitUntil(s), e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
      }
    });
  }
  handleRequest({ request: e, event: t }) {
    const s = new URL(e.url, location.href);
    if (!s.protocol.startsWith("http"))
      return;
    const a = s.origin === location.origin, { params: r, route: i } = this.findMatchingRoute({
      event: t,
      request: e,
      sameOrigin: a,
      url: s
    });
    let c = i && i.handler;
    const o = e.method;
    if (!c && this._defaultHandlerMap.has(o) && (c = this._defaultHandlerMap.get(o)), !c)
      return;
    let h;
    try {
      h = c.handle({ url: s, request: e, event: t, params: r });
    } catch (u) {
      h = Promise.reject(u);
    }
    const m = i && i.catchHandler;
    return h instanceof Promise && (this._catchHandler || m) && (h = h.catch(async (u) => {
      if (m)
        try {
          return await m.handle({ url: s, request: e, event: t, params: r });
        } catch (S) {
          S instanceof Error && (u = S);
        }
      if (this._catchHandler)
        return this._catchHandler.handle({ url: s, request: e, event: t });
      throw u;
    })), h;
  }
  findMatchingRoute({ url: e, sameOrigin: t, request: s, event: a }) {
    const r = this._routes.get(s.method) || [];
    for (const i of r) {
      let c;
      const o = i.match({ url: e, sameOrigin: t, request: s, event: a });
      if (o)
        return c = o, (Array.isArray(c) && c.length === 0 || o.constructor === Object && Object.keys(o).length === 0 || typeof o == "boolean") && (c = void 0), { route: i, params: c };
    }
    return {};
  }
  setDefaultHandler(e, t = H) {
    this._defaultHandlerMap.set(t, C(e));
  }
  setCatchHandler(e) {
    this._catchHandler = C(e);
  }
  registerRoute(e) {
    this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
  }
  unregisterRoute(e) {
    if (!this._routes.has(e.method))
      throw new l("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const t = this._routes.get(e.method).indexOf(e);
    if (t > -1)
      this._routes.get(e.method).splice(t, 1);
    else
      throw new l("unregister-route-route-not-registered");
  }
}
let y;
const ue = () => (y || (y = new le(), y.addFetchListener(), y.addCacheListener()), y);
function E(n, e, t) {
  let s;
  if (typeof n == "string") {
    const r = new URL(n, location.href), i = ({ url: c }) => c.href === r.href;
    s = new g(i, e, t);
  } else if (n instanceof RegExp)
    s = new he(n, e, t);
  else if (typeof n == "function")
    s = new g(n, e, t);
  else if (n instanceof g)
    s = n;
  else
    throw new l("unsupported-route-type", {
      moduleName: "workbox-routing",
      funcName: "registerRoute",
      paramName: "capture"
    });
  return ue().registerRoute(s), s;
}
function de(n, e = []) {
  for (const t of [...n.searchParams.keys()])
    e.some((s) => s.test(t)) && n.searchParams.delete(t);
  return n;
}
function* fe(n, { ignoreURLParametersMatching: e = [/^utm_/, /^fbclid$/], directoryIndex: t = "index.html", cleanURLs: s = !0, urlManipulation: a } = {}) {
  const r = new URL(n, location.href);
  r.hash = "", yield r.href;
  const i = de(r, e);
  if (yield i.href, t && i.pathname.endsWith("/")) {
    const c = new URL(i.href);
    c.pathname += t, yield c.href;
  }
  if (s) {
    const c = new URL(i.href);
    c.pathname += ".html", yield c.href;
  }
  if (a) {
    const c = a({ url: r });
    for (const o of c)
      yield o.href;
  }
}
class pe extends g {
  constructor(e, t) {
    const s = ({ request: a }) => {
      const r = e.getURLsToCacheKeys();
      for (const i of fe(a.url, t)) {
        const c = r.get(i);
        if (c) {
          const o = e.getIntegrityForCacheKey(c);
          return { cacheKey: c, integrity: o };
        }
      }
    };
    super(s, e.strategy);
  }
}
function ge(n) {
  const e = M(), t = new pe(e, n);
  E(t);
}
function me(n) {
  return M().createHandlerBoundToURL(n);
}
function we(n) {
  M().precache(n);
}
function ye(n, e) {
  we(n), ge(e);
}
class _e extends g {
  constructor(e, { allowlist: t = [/./], denylist: s = [] } = {}) {
    super((a) => this._match(a), e), this._allowlist = t, this._denylist = s;
  }
  _match({ url: e, request: t }) {
    if (t && t.mode !== "navigate")
      return !1;
    const s = e.pathname + e.search;
    for (const a of this._denylist)
      if (a.test(s))
        return !1;
    return !!this._allowlist.some((a) => a.test(s));
  }
}
class Re extends N {
  async _handle(e, t) {
    let s = await t.cacheMatch(e), a;
    if (!s)
      try {
        s = await t.fetchAndCachePut(e);
      } catch (r) {
        r instanceof Error && (a = r);
      }
    if (!s)
      throw new l("no-response", { url: e.url, error: a });
    return s;
  }
}
const be = {
  cacheWillUpdate: async ({ response: n }) => n.status === 200 || n.status === 0 ? n : null
};
class Ce extends N {
  constructor(e = {}) {
    super(e), this.plugins.some((t) => "cacheWillUpdate" in t) || this.plugins.unshift(be), this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0;
  }
  async _handle(e, t) {
    const s = [], a = [];
    let r;
    if (this._networkTimeoutSeconds) {
      const { id: o, promise: h } = this._getTimeoutPromise({ request: e, logs: s, handler: t });
      r = o, a.push(h);
    }
    const i = this._getNetworkPromise({
      timeoutId: r,
      request: e,
      logs: s,
      handler: t
    });
    a.push(i);
    const c = await t.waitUntil((async () => await t.waitUntil(Promise.race(a)) || await i)());
    if (!c)
      throw new l("no-response", { url: e.url });
    return c;
  }
  _getTimeoutPromise({ request: e, logs: t, handler: s }) {
    let a;
    return {
      promise: new Promise((i) => {
        a = setTimeout(async () => {
          i(await s.cacheMatch(e));
        }, this._networkTimeoutSeconds * 1e3);
      }),
      id: a
    };
  }
  async _getNetworkPromise({ timeoutId: e, request: t, logs: s, handler: a }) {
    let r, i;
    try {
      i = await a.fetchAndCachePut(t);
    } catch (c) {
      c instanceof Error && (r = c);
    }
    return e && clearTimeout(e), (r || !i) && (i = await a.cacheMatch(t)), i;
  }
}
function q(n) {
  n.then(() => {
  });
}
const xe = (n, e) => e.some((t) => n instanceof t);
let O, W;
function Ee() {
  return O || (O = [
    IDBDatabase,
    IDBObjectStore,
    IDBIndex,
    IDBCursor,
    IDBTransaction
  ]);
}
function Le() {
  return W || (W = [
    IDBCursor.prototype.advance,
    IDBCursor.prototype.continue,
    IDBCursor.prototype.continuePrimaryKey
  ]);
}
const V = /* @__PURE__ */ new WeakMap(), P = /* @__PURE__ */ new WeakMap(), $ = /* @__PURE__ */ new WeakMap(), D = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap();
function Te(n) {
  const e = new Promise((t, s) => {
    const a = () => {
      n.removeEventListener("success", r), n.removeEventListener("error", i);
    }, r = () => {
      t(f(n.result)), a();
    }, i = () => {
      s(n.error), a();
    };
    n.addEventListener("success", r), n.addEventListener("error", i);
  });
  return e.then((t) => {
    t instanceof IDBCursor && V.set(t, n);
  }).catch(() => {
  }), K.set(e, n), e;
}
function De(n) {
  if (P.has(n))
    return;
  const e = new Promise((t, s) => {
    const a = () => {
      n.removeEventListener("complete", r), n.removeEventListener("error", i), n.removeEventListener("abort", i);
    }, r = () => {
      t(), a();
    }, i = () => {
      s(n.error || new DOMException("AbortError", "AbortError")), a();
    };
    n.addEventListener("complete", r), n.addEventListener("error", i), n.addEventListener("abort", i);
  });
  P.set(n, e);
}
let I = {
  get(n, e, t) {
    if (n instanceof IDBTransaction) {
      if (e === "done")
        return P.get(n);
      if (e === "objectStoreNames")
        return n.objectStoreNames || $.get(n);
      if (e === "store")
        return t.objectStoreNames[1] ? void 0 : t.objectStore(t.objectStoreNames[0]);
    }
    return f(n[e]);
  },
  set(n, e, t) {
    return n[e] = t, !0;
  },
  has(n, e) {
    return n instanceof IDBTransaction && (e === "done" || e === "store") ? !0 : e in n;
  }
};
function ke(n) {
  I = n(I);
}
function Ue(n) {
  return n === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(e, ...t) {
    const s = n.call(k(this), e, ...t);
    return $.set(s, e.sort ? e.sort() : [e]), f(s);
  } : Le().includes(n) ? function(...e) {
    return n.apply(k(this), e), f(V.get(this));
  } : function(...e) {
    return f(n.apply(k(this), e));
  };
}
function Pe(n) {
  return typeof n == "function" ? Ue(n) : (n instanceof IDBTransaction && De(n), xe(n, Ee()) ? new Proxy(n, I) : n);
}
function f(n) {
  if (n instanceof IDBRequest)
    return Te(n);
  if (D.has(n))
    return D.get(n);
  const e = Pe(n);
  return e !== n && (D.set(n, e), K.set(e, n)), e;
}
const k = (n) => K.get(n);
function Ie(n, e, { blocked: t, upgrade: s, blocking: a, terminated: r } = {}) {
  const i = indexedDB.open(n, e), c = f(i);
  return s && i.addEventListener("upgradeneeded", (o) => {
    s(f(i.result), o.oldVersion, o.newVersion, f(i.transaction), o);
  }), t && i.addEventListener("blocked", (o) => t(
    o.oldVersion,
    o.newVersion,
    o
  )), c.then((o) => {
    r && o.addEventListener("close", () => r()), a && o.addEventListener("versionchange", (h) => a(h.oldVersion, h.newVersion, h));
  }).catch(() => {
  }), c;
}
function Ne(n, { blocked: e } = {}) {
  const t = indexedDB.deleteDatabase(n);
  return e && t.addEventListener("blocked", (s) => e(
    s.oldVersion,
    s
  )), f(t).then(() => {
  });
}
const Me = ["get", "getKey", "getAll", "getAllKeys", "count"], Ke = ["put", "add", "delete", "clear"], U = /* @__PURE__ */ new Map();
function B(n, e) {
  if (!(n instanceof IDBDatabase && !(e in n) && typeof e == "string"))
    return;
  if (U.get(e))
    return U.get(e);
  const t = e.replace(/FromIndex$/, ""), s = e !== t, a = Ke.includes(t);
  if (!(t in (s ? IDBIndex : IDBObjectStore).prototype) || !(a || Me.includes(t)))
    return;
  const r = async function(i, ...c) {
    const o = this.transaction(i, a ? "readwrite" : "readonly");
    let h = o.store;
    return s && (h = h.index(c.shift())), (await Promise.all([
      h[t](...c),
      a && o.done
    ]))[0];
  };
  return U.set(e, r), r;
}
ke((n) => ({
  ...n,
  get: (e, t, s) => B(e, t) || n.get(e, t, s),
  has: (e, t) => !!B(e, t) || n.has(e, t)
}));
try {
  self["workbox:expiration:7.0.0"] && _();
} catch {
}
const Se = "workbox-expiration", R = "cache-entries", j = (n) => {
  const e = new URL(n, location.href);
  return e.hash = "", e.href;
};
class Ae {
  constructor(e) {
    this._db = null, this._cacheName = e;
  }
  _upgradeDb(e) {
    const t = e.createObjectStore(R, { keyPath: "id" });
    t.createIndex("cacheName", "cacheName", { unique: !1 }), t.createIndex("timestamp", "timestamp", { unique: !1 });
  }
  _upgradeDbAndDeleteOldDbs(e) {
    this._upgradeDb(e), this._cacheName && Ne(this._cacheName);
  }
  async setTimestamp(e, t) {
    e = j(e);
    const s = {
      url: e,
      timestamp: t,
      cacheName: this._cacheName,
      id: this._getId(e)
    }, r = (await this.getDb()).transaction(R, "readwrite", {
      durability: "relaxed"
    });
    await r.store.put(s), await r.done;
  }
  async getTimestamp(e) {
    const s = await (await this.getDb()).get(R, this._getId(e));
    return s == null ? void 0 : s.timestamp;
  }
  async expireEntries(e, t) {
    const s = await this.getDb();
    let a = await s.transaction(R).store.index("timestamp").openCursor(null, "prev");
    const r = [];
    let i = 0;
    for (; a; ) {
      const o = a.value;
      o.cacheName === this._cacheName && (e && o.timestamp < e || t && i >= t ? r.push(a.value) : i++), a = await a.continue();
    }
    const c = [];
    for (const o of r)
      await s.delete(R, o.id), c.push(o.url);
    return c;
  }
  _getId(e) {
    return this._cacheName + "|" + j(e);
  }
  async getDb() {
    return this._db || (this._db = await Ie(Se, 1, {
      upgrade: this._upgradeDbAndDeleteOldDbs.bind(this)
    })), this._db;
  }
}
class ve {
  constructor(e, t = {}) {
    this._isRunning = !1, this._rerunRequested = !1, this._maxEntries = t.maxEntries, this._maxAgeSeconds = t.maxAgeSeconds, this._matchOptions = t.matchOptions, this._cacheName = e, this._timestampModel = new Ae(e);
  }
  async expireEntries() {
    if (this._isRunning) {
      this._rerunRequested = !0;
      return;
    }
    this._isRunning = !0;
    const e = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0, t = await this._timestampModel.expireEntries(e, this._maxEntries), s = await self.caches.open(this._cacheName);
    for (const a of t)
      await s.delete(a, this._matchOptions);
    this._isRunning = !1, this._rerunRequested && (this._rerunRequested = !1, q(this.expireEntries()));
  }
  async updateTimestamp(e) {
    await this._timestampModel.setTimestamp(e, Date.now());
  }
  async isURLExpired(e) {
    if (this._maxAgeSeconds) {
      const t = await this._timestampModel.getTimestamp(e), s = Date.now() - this._maxAgeSeconds * 1e3;
      return t !== void 0 ? t < s : !0;
    } else
      return !1;
  }
  async delete() {
    this._rerunRequested = !1, await this._timestampModel.expireEntries(1 / 0);
  }
}
function Oe(n) {
  F.add(n);
}
class We {
  constructor(e = {}) {
    this.cachedResponseWillBeUsed = async ({ event: t, request: s, cacheName: a, cachedResponse: r }) => {
      if (!r)
        return null;
      const i = this._isResponseDateFresh(r), c = this._getCacheExpiration(a);
      q(c.expireEntries());
      const o = c.updateTimestamp(s.url);
      if (t)
        try {
          t.waitUntil(o);
        } catch {
        }
      return i ? r : null;
    }, this.cacheDidUpdate = async ({ cacheName: t, request: s }) => {
      const a = this._getCacheExpiration(t);
      await a.updateTimestamp(s.url), await a.expireEntries();
    }, this._config = e, this._maxAgeSeconds = e.maxAgeSeconds, this._cacheExpirations = /* @__PURE__ */ new Map(), e.purgeOnQuotaError && Oe(() => this.deleteCacheAndMetadata());
  }
  _getCacheExpiration(e) {
    if (e === x.getRuntimeName())
      throw new l("expire-custom-caches-only");
    let t = this._cacheExpirations.get(e);
    return t || (t = new ve(e, this._config), this._cacheExpirations.set(e, t)), t;
  }
  _isResponseDateFresh(e) {
    if (!this._maxAgeSeconds)
      return !0;
    const t = this._getDateHeaderTimestamp(e);
    if (t === null)
      return !0;
    const s = Date.now();
    return t >= s - this._maxAgeSeconds * 1e3;
  }
  _getDateHeaderTimestamp(e) {
    if (!e.headers.has("date"))
      return null;
    const t = e.headers.get("date"), a = new Date(t).getTime();
    return isNaN(a) ? null : a;
  }
  async deleteCacheAndMetadata() {
    for (const [e, t] of this._cacheExpirations)
      await self.caches.delete(e), await t.delete();
    this._cacheExpirations = /* @__PURE__ */ new Map();
  }
}
ye([{"revision":null,"url":"assets/AboutView.293c3b82.js"},{"revision":null,"url":"assets/index.0b07b866.css"},{"revision":null,"url":"assets/index.e731da9e.js"},{"revision":"1e7d111fb77af210d20943e71fd1e5e0","url":"index.html"},{"revision":"1872c500de691dce40960bb85481de07","url":"registerSW.js"},{"revision":"5dfe5dc233e6af9806e04e538bc3b7f1","url":"manifest.webmanifest"}]);
E(new _e(me("index.html")));
const Be = new g(
  ({ url: n }) => n.pathname === "/eintraege",
  new Ce({
    cacheName: "oeztuerk-Eintraege",
    cacheableResponse: {
      statuses: [0, 200]
    }
  })
), je = new g(
  () => /\*\/assets\/.*\.*$/,
  new Re({
    cacheName: "eintraege-images",
    plugins: [
      new We({
        maxAgeSeconds: 60 * 60 * 24 * 1
      })
    ],
    cacheableResponse: {
      statuses: [0, 200]
    }
  })
);
E(Be);
E(je);
self.addEventListener("message", (n) => {
  n.data.type === "SKIP_WAITING" && self.skipWaiting();
});
console.debug("SW loaded");
self.addEventListener("message", (n) => {
  var e;
  ((e = n.data) == null ? void 0 : e.type) === "SKIP_WAITING" && self.skipWaiting();
});
self.addEventListener("install", () => {
  console.debug("SW install event"), caches.delete("oeztuerk-Eintraege");
});
self.addEventListener("activate", () => (console.debug("SW activate event, claiming control"), self.clients.claim()));
