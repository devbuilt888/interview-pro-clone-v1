"use strict";
(() => {
var exports = {};
exports.id = 261;
exports.ids = [261];
exports.modules = {

/***/ 2254:
/***/ ((module) => {

module.exports = require("node:buffer");

/***/ }),

/***/ 6005:
/***/ ((module) => {

module.exports = require("node:crypto");

/***/ }),

/***/ 7261:
/***/ ((module) => {

module.exports = require("node:util");

/***/ }),

/***/ 2037:
/***/ ((module) => {

module.exports = require("os");

/***/ }),

/***/ 1161:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  headerHooks: () => (/* binding */ headerHooks),
  originalPathname: () => (/* binding */ originalPathname),
  requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
  routeModule: () => (/* binding */ routeModule),
  serverHooks: () => (/* binding */ serverHooks),
  staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
  staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./app/api/livekit/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  POST: () => (POST)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(2394);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9692);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(9513);
// EXTERNAL MODULE: ./node_modules/livekit-server-sdk/dist/index.js + 62 modules
var dist = __webpack_require__(635);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(9335);
;// CONCATENATED MODULE: ./app/api/livekit/route.ts


async function POST(req) {
    try {
        const { roomName, participantName } = await req.json();
        console.log("Received request:", {
            roomName,
            participantName
        });
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const wsUrl = "wss://interview-bot-2cemvd1h.livekit.cloud";
        console.log("Environment variables:", {
            hasApiKey: !!apiKey,
            hasApiSecret: !!apiSecret,
            wsUrl
        });
        if (!apiKey || !apiSecret || !wsUrl) {
            console.error("Missing environment variables:", {
                apiKey: !!apiKey,
                apiSecret: !!apiSecret,
                wsUrl: !!wsUrl
            });
            return next_response/* default */.Z.json({
                error: "Server misconfigured - missing environment variables"
            }, {
                status: 500
            });
        }
        // Create room service client
        const roomService = new dist/* RoomServiceClient */.mu(wsUrl, apiKey, apiSecret);
        // Create the room if it doesn't exist
        try {
            await roomService.createRoom({
                name: roomName,
                emptyTimeout: 10 * 60
            });
            console.log("Room created or already exists:", roomName);
        } catch (roomError) {
            console.error("Error creating room:", roomError);
        // Continue anyway as the room might already exist
        }
        // Generate token with proper configuration
        const at = new dist/* AccessToken */.JO(apiKey, apiSecret, {
            identity: participantName,
            name: participantName
        });
        at.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
            canPublishData: true
        });
        const token = at.toJwt();
        console.log("Token generated successfully for:", {
            roomName,
            participantName
        });
        // Return the token and room name
        return next_response/* default */.Z.json({
            token,
            roomName,
            wsUrl
        });
    } catch (error) {
        console.error("Error in LiveKit token generation:", error);
        return next_response/* default */.Z.json({
            error: error instanceof Error ? error.message : "Failed to generate token"
        }, {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Flivekit%2Froute&name=app%2Fapi%2Flivekit%2Froute&pagePath=private-next-app-dir%2Fapi%2Flivekit%2Froute.ts&appDir=C%3A%5CUsers%5CJoseP%5CDocuments%5ClandingMarketingPages%5Cip-clone-best-daily-test%5Capp&appPaths=%2Fapi%2Flivekit%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

// @ts-ignore this need to be imported from next/dist to be external


// @ts-expect-error - replaced by webpack/turbopack loader

const AppRouteRouteModule = app_route_module.AppRouteRouteModule;
// We inject the nextConfigOutput here so that we can use them in the route
// module.
const nextConfigOutput = ""
const routeModule = new AppRouteRouteModule({
    definition: {
        kind: route_kind.RouteKind.APP_ROUTE,
        page: "/api/livekit/route",
        pathname: "/api/livekit",
        filename: "route",
        bundlePath: "app/api/livekit/route"
    },
    resolvedPagePath: "C:\\Users\\JoseP\\Documents\\landingMarketingPages\\ip-clone-best-daily-test\\app\\api\\livekit\\route.ts",
    nextConfigOutput,
    userland: route_namespaceObject
});
// Pull out the exports that we need to expose from the module. This should
// be eliminated when we've moved the other routes to the new format. These
// are used to hook into the route.
const { requestAsyncStorage , staticGenerationAsyncStorage , serverHooks , headerHooks , staticGenerationBailout  } = routeModule;
const originalPathname = "/api/livekit/route";


//# sourceMappingURL=app-route.js.map

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [587,501,335,635], () => (__webpack_exec__(1161)));
module.exports = __webpack_exports__;

})();