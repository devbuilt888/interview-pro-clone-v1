"use strict";
(() => {
var exports = {};
exports.id = 398;
exports.ids = [398];
exports.modules = {

/***/ 2081:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

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

/***/ 1017:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 764:
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

// NAMESPACE OBJECT: ./app/api/agent/route.ts
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
// EXTERNAL MODULE: external "child_process"
var external_child_process_ = __webpack_require__(2081);
// EXTERNAL MODULE: external "path"
var external_path_ = __webpack_require__(1017);
var external_path_default = /*#__PURE__*/__webpack_require__.n(external_path_);
;// CONCATENATED MODULE: ./app/api/agent/route.ts




async function POST(req) {
    try {
        const { roomName, participantName } = await req.json();
        if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET || !process.env.LIVEKIT_WS_URL) {
            throw new Error("Missing required environment variables");
        }
        const at = new dist/* AccessToken */.JO(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
            identity: participantName
        });
        at.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true
        });
        const token = await at.toJwt();
        // Create agent token
        const agentAt = new dist/* AccessToken */.JO(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
            identity: "agent"
        });
        agentAt.addGrant({
            roomJoin: true,
            room: roomName,
            canPublish: true,
            canSubscribe: true
        });
        const agentToken = await agentAt.toJwt();
        // Set environment variables for the agent process
        process.env.AGENT_TOKEN = agentToken;
        process.env.ROOM_NAME = roomName;
        // Start the agent process
        const agentPath = external_path_default().resolve(process.cwd(), "app", "agents", "interview-agent.ts");
        console.log("Starting agent with:", {
            agentPath
        });
        // Function to start the agent with text
        const startAgentWithText = async (text)=>{
            return new Promise((resolve, reject)=>{
                // Construct the full command
                const command = `yarn ts-node --project "${external_path_default().resolve(process.cwd(), "tsconfig.json")}" --transpile-only "${agentPath}" "${text}"`;
                console.log("Executing command:", command);
                const agentProcess = (0,external_child_process_.spawn)(command, {
                    shell: true,
                    env: {
                        ...process.env,
                        NODE_ENV: "production" || 0,
                        TS_NODE_COMPILER_OPTIONS: '{"module":"commonjs"}'
                    },
                    cwd: process.cwd()
                });
                let stdout = "";
                let stderr = "";
                agentProcess.stdout.on("data", (data)=>{
                    stdout += data;
                    console.log(`Agent stdout: ${data}`);
                });
                agentProcess.stderr.on("data", (data)=>{
                    stderr += data;
                    console.error(`Agent stderr: ${data}`);
                });
                agentProcess.on("error", (error)=>{
                    console.error("Failed to start agent process:", error);
                    reject(error);
                });
                agentProcess.on("close", (code)=>{
                    if (code === 0) {
                        resolve({
                            stdout,
                            stderr
                        });
                    } else {
                        reject(new Error(`Process exited with code ${code}`));
                    }
                });
            });
        };
        // Start the agent with initial message
        const initialMessage = "Hello! I'm your interviewer today. I'll be reviewing your resume and asking you some questions.";
        await startAgentWithText(initialMessage);
        return next_response/* default */.Z.json({
            token,
            roomName,
            wsUrl: process.env.LIVEKIT_WS_URL
        });
    } catch (error) {
        console.error("Error in /api/agent:", error);
        return next_response/* default */.Z.json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fagent%2Froute&name=app%2Fapi%2Fagent%2Froute&pagePath=private-next-app-dir%2Fapi%2Fagent%2Froute.ts&appDir=C%3A%5CUsers%5CJoseP%5CDocuments%5ClandingMarketingPages%5Cip-clone-best-daily-test%5Capp&appPaths=%2Fapi%2Fagent%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!

// @ts-ignore this need to be imported from next/dist to be external


// @ts-expect-error - replaced by webpack/turbopack loader

const AppRouteRouteModule = app_route_module.AppRouteRouteModule;
// We inject the nextConfigOutput here so that we can use them in the route
// module.
const nextConfigOutput = ""
const routeModule = new AppRouteRouteModule({
    definition: {
        kind: route_kind.RouteKind.APP_ROUTE,
        page: "/api/agent/route",
        pathname: "/api/agent",
        filename: "route",
        bundlePath: "app/api/agent/route"
    },
    resolvedPagePath: "C:\\Users\\JoseP\\Documents\\landingMarketingPages\\ip-clone-best-daily-test\\app\\api\\agent\\route.ts",
    nextConfigOutput,
    userland: route_namespaceObject
});
// Pull out the exports that we need to expose from the module. This should
// be eliminated when we've moved the other routes to the new format. These
// are used to hook into the route.
const { requestAsyncStorage , staticGenerationAsyncStorage , serverHooks , headerHooks , staticGenerationBailout  } = routeModule;
const originalPathname = "/api/agent/route";


//# sourceMappingURL=app-route.js.map

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [587,501,335,635], () => (__webpack_exec__(764)));
module.exports = __webpack_exports__;

})();