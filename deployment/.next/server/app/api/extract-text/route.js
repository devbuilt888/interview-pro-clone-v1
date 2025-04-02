(() => {
var exports = {};
exports.id = 687;
exports.ids = [687];
exports.modules = {

/***/ 2751:
/***/ ((module) => {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(() => {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = () => ([]);
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 2751;
module.exports = webpackEmptyAsyncContext;

/***/ }),

/***/ 6718:
/***/ ((module) => {

"use strict";
module.exports = require("canvas");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3763:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   headerHooks: () => (/* binding */ headerHooks),
/* harmony export */   originalPathname: () => (/* binding */ originalPathname),
/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),
/* harmony export */   routeModule: () => (/* binding */ routeModule),
/* harmony export */   serverHooks: () => (/* binding */ serverHooks),
/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),
/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)
/* harmony export */ });
/* harmony import */ var next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2394);
/* harmony import */ var next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_node_polyfill_headers__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_dist_server_future_route_modules_app_route_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9692);
/* harmony import */ var next_dist_server_future_route_modules_app_route_module__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9513);
/* harmony import */ var C_Users_JoseP_Documents_landingMarketingPages_ip_clone_best_daily_test_app_api_extract_text_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4741);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([C_Users_JoseP_Documents_landingMarketingPages_ip_clone_best_daily_test_app_api_extract_text_route_ts__WEBPACK_IMPORTED_MODULE_3__]);
C_Users_JoseP_Documents_landingMarketingPages_ip_clone_best_daily_test_app_api_extract_text_route_ts__WEBPACK_IMPORTED_MODULE_3__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];

// @ts-ignore this need to be imported from next/dist to be external


// @ts-expect-error - replaced by webpack/turbopack loader

const AppRouteRouteModule = next_dist_server_future_route_modules_app_route_module__WEBPACK_IMPORTED_MODULE_1__.AppRouteRouteModule;
// We inject the nextConfigOutput here so that we can use them in the route
// module.
const nextConfigOutput = ""
const routeModule = new AppRouteRouteModule({
    definition: {
        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_2__.RouteKind.APP_ROUTE,
        page: "/api/extract-text/route",
        pathname: "/api/extract-text",
        filename: "route",
        bundlePath: "app/api/extract-text/route"
    },
    resolvedPagePath: "C:\\Users\\JoseP\\Documents\\landingMarketingPages\\ip-clone-best-daily-test\\app\\api\\extract-text\\route.ts",
    nextConfigOutput,
    userland: C_Users_JoseP_Documents_landingMarketingPages_ip_clone_best_daily_test_app_api_extract_text_route_ts__WEBPACK_IMPORTED_MODULE_3__
});
// Pull out the exports that we need to expose from the module. This should
// be eliminated when we've moved the other routes to the new format. These
// are used to hook into the route.
const { requestAsyncStorage , staticGenerationAsyncStorage , serverHooks , headerHooks , staticGenerationBailout  } = routeModule;
const originalPathname = "/api/extract-text/route";


//# sourceMappingURL=app-route.js.map
__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 4741:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   POST: () => (/* binding */ POST)
/* harmony export */ });
/* harmony import */ var pdfjs_dist_build_pdf_min_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4809);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([pdfjs_dist_build_pdf_min_mjs__WEBPACK_IMPORTED_MODULE_0__]);
pdfjs_dist_build_pdf_min_mjs__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// import formidable from "formidable";

function mergeTextContent(textContent) {
    return textContent.items.map((item)=>{
        const { str, hasEOL } = item;
        return str + (hasEOL ? "\n" : "");
    }).join("");
}
async function fetchOpenAIResponse(extractedText) {
    const response = await fetch("http://localhost:3000/api/openai-gpt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "user",
                    content: `Here is my resume:
------
${extractedText}`
                }
            ]
        })
    });
    if (!response.body) {
        throw new Error("No response body");
    }
    const reader = response.body.getReader();
    let chunks = [];
    // Read the stream
    while(true){
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        chunks.push(value);
    }
    // Convert the Uint8Array chunks to string
    const decoder = new TextDecoder("utf-8");
    const text = chunks.map((chunk)=>decoder.decode(chunk)).join("");
    return text;
}
async function POST(req, res) {
    if (req.method !== "POST") {
        return new Response("Method not allowed", {
            status: 405
        });
    }
    try {
        const formData = await req.formData();
        const [file] = formData.getAll("file");
        if (!file) {
            return new Response("No file uploaded", {
                status: 400
            });
        }
        const fileBuffer = await file.arrayBuffer();
        const fileData = new Uint8Array(fileBuffer);
        // Initialize pdf.js
        await __webpack_require__.e(/* import() */ 240).then(__webpack_require__.bind(__webpack_require__, 6240));
        // Load the PDF from the buffer
        const loadingTask = pdfjs_dist_build_pdf_min_mjs__WEBPACK_IMPORTED_MODULE_0__/* .getDocument */ .Me({
            data: fileData
        });
        const pdf = await loadingTask.promise;
        if (!pdf.numPages) {
            return new Response(JSON.stringify({
                status: "ok",
                text: null
            }), {
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const page = await pdf.getPage(1);
        const textContent = await page.getTextContent();
        const extractedText = mergeTextContent(textContent);
        // Send extracted resume text to openAI API to get the first question from the AI
        const openAIResponse = await fetchOpenAIResponse(extractedText);
        return new Response(JSON.stringify({
            status: "ok",
            text: openAIResponse
        }), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({
            status: "error",
            error: String(err)
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [587,501,809], () => (__webpack_exec__(3763)));
module.exports = __webpack_exports__;

})();