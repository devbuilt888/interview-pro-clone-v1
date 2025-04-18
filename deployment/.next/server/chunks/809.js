"use strict";
exports.id = 809;
exports.ids = [809];
exports.modules = {

/***/ 4809:
/***/ ((__webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Me: () => (/* binding */ z)
/* harmony export */ });
/* unused harmony exports AbortException, AnnotationEditorLayer, AnnotationEditorParamsType, AnnotationEditorType, AnnotationEditorUIManager, AnnotationLayer, AnnotationMode, CMapCompressionType, ColorPicker, DOMSVGFactory, DrawLayer, FeatureTest, GlobalWorkerOptions, ImageKind, InvalidPDFException, MissingPDFException, OPS, Outliner, PDFDataRangeTransport, PDFDateString, PDFWorker, PasswordResponses, PermissionFlag, PixelsPerInch, PromiseCapability, RenderingCancelledException, UnexpectedResponseException, Util, VerbosityLevel, XfaLayer, build, createValidAbsoluteUrl, fetchData, getFilenameFromUrl, getPdfFilenameFromUrl, getXfaPageViewport, isDataScheme, isPdfFile, noContextMenu, normalizeUnicode, renderTextLayer, setLayerDimensions, shadow, updateTextLayer, version */
/**
 * @licstart The following is the entire license notice for the
 * JavaScript code in this page
 *
 * Copyright 2023 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @licend The above is the entire license notice for the
 * JavaScript code in this page
 */ var t, e, i, s, n = {
    640: (t, e, i)=>{
        i.d(e, {
            AnnotationLayer: ()=>AnnotationLayer,
            FreeTextAnnotationElement: ()=>FreeTextAnnotationElement,
            InkAnnotationElement: ()=>InkAnnotationElement,
            StampAnnotationElement: ()=>StampAnnotationElement
        });
        var s = i(266), n = i(473), a = i(780);
        function makeColorComp(t) {
            return Math.floor(255 * Math.max(0, Math.min(1, t))).toString(16).padStart(2, "0");
        }
        function scaleAndClamp(t) {
            return Math.max(0, Math.min(255, 255 * t));
        }
        class ColorConverters {
            static CMYK_G([t, e, i, s]) {
                return [
                    "G",
                    1 - Math.min(1, .3 * t + .59 * i + .11 * e + s)
                ];
            }
            static G_CMYK([t]) {
                return [
                    "CMYK",
                    0,
                    0,
                    0,
                    1 - t
                ];
            }
            static G_RGB([t]) {
                return [
                    "RGB",
                    t,
                    t,
                    t
                ];
            }
            static G_rgb([t]) {
                return [
                    t = scaleAndClamp(t),
                    t,
                    t
                ];
            }
            static G_HTML([t]) {
                const e = makeColorComp(t);
                return `#${e}${e}${e}`;
            }
            static RGB_G([t, e, i]) {
                return [
                    "G",
                    .3 * t + .59 * e + .11 * i
                ];
            }
            static RGB_rgb(t) {
                return t.map(scaleAndClamp);
            }
            static RGB_HTML(t) {
                return `#${t.map(makeColorComp).join("")}`;
            }
            static T_HTML() {
                return "#00000000";
            }
            static T_rgb() {
                return [
                    null
                ];
            }
            static CMYK_RGB([t, e, i, s]) {
                return [
                    "RGB",
                    1 - Math.min(1, t + s),
                    1 - Math.min(1, i + s),
                    1 - Math.min(1, e + s)
                ];
            }
            static CMYK_rgb([t, e, i, s]) {
                return [
                    scaleAndClamp(1 - Math.min(1, t + s)),
                    scaleAndClamp(1 - Math.min(1, i + s)),
                    scaleAndClamp(1 - Math.min(1, e + s))
                ];
            }
            static CMYK_HTML(t) {
                const e = this.CMYK_RGB(t).slice(1);
                return this.RGB_HTML(e);
            }
            static RGB_CMYK([t, e, i]) {
                const s = 1 - t, n = 1 - e, a = 1 - i;
                return [
                    "CMYK",
                    s,
                    n,
                    a,
                    Math.min(s, n, a)
                ];
            }
        }
        var r = i(160);
        const o = 1e3, l = new WeakSet;
        function getRectDims(t) {
            return {
                width: t[2] - t[0],
                height: t[3] - t[1]
            };
        }
        class AnnotationElementFactory {
            static create(t) {
                switch(t.data.annotationType){
                    case s.AnnotationType.LINK:
                        return new LinkAnnotationElement(t);
                    case s.AnnotationType.TEXT:
                        return new TextAnnotationElement(t);
                    case s.AnnotationType.WIDGET:
                        switch(t.data.fieldType){
                            case "Tx":
                                return new TextWidgetAnnotationElement(t);
                            case "Btn":
                                return t.data.radioButton ? new RadioButtonWidgetAnnotationElement(t) : t.data.checkBox ? new CheckboxWidgetAnnotationElement(t) : new PushButtonWidgetAnnotationElement(t);
                            case "Ch":
                                return new ChoiceWidgetAnnotationElement(t);
                            case "Sig":
                                return new SignatureWidgetAnnotationElement(t);
                        }
                        return new WidgetAnnotationElement(t);
                    case s.AnnotationType.POPUP:
                        return new PopupAnnotationElement(t);
                    case s.AnnotationType.FREETEXT:
                        return new FreeTextAnnotationElement(t);
                    case s.AnnotationType.LINE:
                        return new LineAnnotationElement(t);
                    case s.AnnotationType.SQUARE:
                        return new SquareAnnotationElement(t);
                    case s.AnnotationType.CIRCLE:
                        return new CircleAnnotationElement(t);
                    case s.AnnotationType.POLYLINE:
                        return new PolylineAnnotationElement(t);
                    case s.AnnotationType.CARET:
                        return new CaretAnnotationElement(t);
                    case s.AnnotationType.INK:
                        return new InkAnnotationElement(t);
                    case s.AnnotationType.POLYGON:
                        return new PolygonAnnotationElement(t);
                    case s.AnnotationType.HIGHLIGHT:
                        return new HighlightAnnotationElement(t);
                    case s.AnnotationType.UNDERLINE:
                        return new UnderlineAnnotationElement(t);
                    case s.AnnotationType.SQUIGGLY:
                        return new SquigglyAnnotationElement(t);
                    case s.AnnotationType.STRIKEOUT:
                        return new StrikeOutAnnotationElement(t);
                    case s.AnnotationType.STAMP:
                        return new StampAnnotationElement(t);
                    case s.AnnotationType.FILEATTACHMENT:
                        return new FileAttachmentAnnotationElement(t);
                    default:
                        return new AnnotationElement(t);
                }
            }
        }
        class AnnotationElement {
            #t;
            constructor(t, { isRenderable: e = !1, ignoreBorder: i = !1, createQuadrilaterals: s = !1 } = {}){
                this.#t = !1;
                this.isRenderable = e;
                this.data = t.data;
                this.layer = t.layer;
                this.linkService = t.linkService;
                this.downloadManager = t.downloadManager;
                this.imageResourcesPath = t.imageResourcesPath;
                this.renderForms = t.renderForms;
                this.svgFactory = t.svgFactory;
                this.annotationStorage = t.annotationStorage;
                this.enableScripting = t.enableScripting;
                this.hasJSActions = t.hasJSActions;
                this._fieldObjects = t.fieldObjects;
                this.parent = t.parent;
                e && (this.container = this._createContainer(i));
                s && this._createQuadrilaterals();
            }
            static _hasPopupData({ titleObj: t, contentsObj: e, richText: i }) {
                return !!(t?.str || e?.str || i?.str);
            }
            get hasPopupData() {
                return AnnotationElement._hasPopupData(this.data);
            }
            _createContainer(t) {
                const { data: e, parent: { page: i, viewport: n } } = this, a = document.createElement("section");
                a.setAttribute("data-annotation-id", e.id);
                this instanceof WidgetAnnotationElement || (a.tabIndex = o);
                a.style.zIndex = this.parent.zIndex++;
                this.data.popupRef && a.setAttribute("aria-haspopup", "dialog");
                e.noRotate && a.classList.add("norotate");
                const { pageWidth: r, pageHeight: l, pageX: h, pageY: d } = n.rawDims;
                if (!e.rect || this instanceof PopupAnnotationElement) {
                    const { rotation: t } = e;
                    e.hasOwnCanvas || 0 === t || this.setRotation(t, a);
                    return a;
                }
                const { width: c, height: u } = getRectDims(e.rect), p = s.Util.normalizeRect([
                    e.rect[0],
                    i.view[3] - e.rect[1] + i.view[1],
                    e.rect[2],
                    i.view[3] - e.rect[3] + i.view[1]
                ]);
                if (!t && e.borderStyle.width > 0) {
                    a.style.borderWidth = `${e.borderStyle.width}px`;
                    const t = e.borderStyle.horizontalCornerRadius, i = e.borderStyle.verticalCornerRadius;
                    if (t > 0 || i > 0) {
                        const e = `calc(${t}px * var(--scale-factor)) / calc(${i}px * var(--scale-factor))`;
                        a.style.borderRadius = e;
                    } else if (this instanceof RadioButtonWidgetAnnotationElement) {
                        const t = `calc(${c}px * var(--scale-factor)) / calc(${u}px * var(--scale-factor))`;
                        a.style.borderRadius = t;
                    }
                    switch(e.borderStyle.style){
                        case s.AnnotationBorderStyleType.SOLID:
                            a.style.borderStyle = "solid";
                            break;
                        case s.AnnotationBorderStyleType.DASHED:
                            a.style.borderStyle = "dashed";
                            break;
                        case s.AnnotationBorderStyleType.BEVELED:
                            (0, s.warn)("Unimplemented border style: beveled");
                            break;
                        case s.AnnotationBorderStyleType.INSET:
                            (0, s.warn)("Unimplemented border style: inset");
                            break;
                        case s.AnnotationBorderStyleType.UNDERLINE:
                            a.style.borderBottomStyle = "solid";
                    }
                    const n = e.borderColor || null;
                    if (n) {
                        this.#t = !0;
                        a.style.borderColor = s.Util.makeHexColor(0 | n[0], 0 | n[1], 0 | n[2]);
                    } else a.style.borderWidth = 0;
                }
                a.style.left = 100 * (p[0] - h) / r + "%";
                a.style.top = 100 * (p[1] - d) / l + "%";
                const { rotation: g } = e;
                if (e.hasOwnCanvas || 0 === g) {
                    a.style.width = 100 * c / r + "%";
                    a.style.height = 100 * u / l + "%";
                } else this.setRotation(g, a);
                return a;
            }
            setRotation(t, e = this.container) {
                if (!this.data.rect) return;
                const { pageWidth: i, pageHeight: s } = this.parent.viewport.rawDims, { width: n, height: a } = getRectDims(this.data.rect);
                let r, o;
                if (t % 180 == 0) {
                    r = 100 * n / i;
                    o = 100 * a / s;
                } else {
                    r = 100 * a / i;
                    o = 100 * n / s;
                }
                e.style.width = `${r}%`;
                e.style.height = `${o}%`;
                e.setAttribute("data-main-rotation", (360 - t) % 360);
            }
            get _commonActions() {
                const setColor = (t, e, i)=>{
                    const s = i.detail[t], n = s[0], a = s.slice(1);
                    i.target.style[e] = ColorConverters[`${n}_HTML`](a);
                    this.annotationStorage.setValue(this.data.id, {
                        [e]: ColorConverters[`${n}_rgb`](a)
                    });
                };
                return (0, s.shadow)(this, "_commonActions", {
                    display: (t)=>{
                        const { display: e } = t.detail, i = e % 2 == 1;
                        this.container.style.visibility = i ? "hidden" : "visible";
                        this.annotationStorage.setValue(this.data.id, {
                            noView: i,
                            noPrint: 1 === e || 2 === e
                        });
                    },
                    print: (t)=>{
                        this.annotationStorage.setValue(this.data.id, {
                            noPrint: !t.detail.print
                        });
                    },
                    hidden: (t)=>{
                        const { hidden: e } = t.detail;
                        this.container.style.visibility = e ? "hidden" : "visible";
                        this.annotationStorage.setValue(this.data.id, {
                            noPrint: e,
                            noView: e
                        });
                    },
                    focus: (t)=>{
                        setTimeout(()=>t.target.focus({
                                preventScroll: !1
                            }), 0);
                    },
                    userName: (t)=>{
                        t.target.title = t.detail.userName;
                    },
                    readonly: (t)=>{
                        t.target.disabled = t.detail.readonly;
                    },
                    required: (t)=>{
                        this._setRequired(t.target, t.detail.required);
                    },
                    bgColor: (t)=>{
                        setColor("bgColor", "backgroundColor", t);
                    },
                    fillColor: (t)=>{
                        setColor("fillColor", "backgroundColor", t);
                    },
                    fgColor: (t)=>{
                        setColor("fgColor", "color", t);
                    },
                    textColor: (t)=>{
                        setColor("textColor", "color", t);
                    },
                    borderColor: (t)=>{
                        setColor("borderColor", "borderColor", t);
                    },
                    strokeColor: (t)=>{
                        setColor("strokeColor", "borderColor", t);
                    },
                    rotation: (t)=>{
                        const e = t.detail.rotation;
                        this.setRotation(e);
                        this.annotationStorage.setValue(this.data.id, {
                            rotation: e
                        });
                    }
                });
            }
            _dispatchEventFromSandbox(t, e) {
                const i = this._commonActions;
                for (const s of Object.keys(e.detail)){
                    const n = t[s] || i[s];
                    n?.(e);
                }
            }
            _setDefaultPropertiesFromJS(t) {
                if (!this.enableScripting) return;
                const e = this.annotationStorage.getRawValue(this.data.id);
                if (!e) return;
                const i = this._commonActions;
                for (const [s, n] of Object.entries(e)){
                    const a = i[s];
                    if (a) {
                        a({
                            detail: {
                                [s]: n
                            },
                            target: t
                        });
                        delete e[s];
                    }
                }
            }
            _createQuadrilaterals() {
                if (!this.container) return;
                const { quadPoints: t } = this.data;
                if (!t) return;
                const [e, i, s, n] = this.data.rect;
                if (1 === t.length) {
                    const [, { x: a, y: r }, { x: o, y: l }] = t[0];
                    if (s === a && n === r && e === o && i === l) return;
                }
                const { style: a } = this.container;
                let r;
                if (this.#t) {
                    const { borderColor: t, borderWidth: e } = a;
                    a.borderWidth = 0;
                    r = [
                        "url('data:image/svg+xml;utf8,",
                        '<svg xmlns="http://www.w3.org/2000/svg"',
                        ' preserveAspectRatio="none" viewBox="0 0 1 1">',
                        `<g fill="transparent" stroke="${t}" stroke-width="${e}">`
                    ];
                    this.container.classList.add("hasBorder");
                }
                const o = s - e, l = n - i, { svgFactory: h } = this, d = h.createElement("svg");
                d.classList.add("quadrilateralsContainer");
                d.setAttribute("width", 0);
                d.setAttribute("height", 0);
                const c = h.createElement("defs");
                d.append(c);
                const u = h.createElement("clipPath"), p = `clippath_${this.data.id}`;
                u.setAttribute("id", p);
                u.setAttribute("clipPathUnits", "objectBoundingBox");
                c.append(u);
                for (const [, { x: i, y: s }, { x: a, y: d }] of t){
                    const t = h.createElement("rect"), c = (a - e) / o, p = (n - s) / l, g = (i - a) / o, m = (s - d) / l;
                    t.setAttribute("x", c);
                    t.setAttribute("y", p);
                    t.setAttribute("width", g);
                    t.setAttribute("height", m);
                    u.append(t);
                    r?.push(`<rect vector-effect="non-scaling-stroke" x="${c}" y="${p}" width="${g}" height="${m}"/>`);
                }
                if (this.#t) {
                    r.push("</g></svg>')");
                    a.backgroundImage = r.join("");
                }
                this.container.append(d);
                this.container.style.clipPath = `url(#${p})`;
            }
            _createPopup() {
                const { container: t, data: e } = this;
                t.setAttribute("aria-haspopup", "dialog");
                const i = new PopupAnnotationElement({
                    data: {
                        color: e.color,
                        titleObj: e.titleObj,
                        modificationDate: e.modificationDate,
                        contentsObj: e.contentsObj,
                        richText: e.richText,
                        parentRect: e.rect,
                        borderStyle: 0,
                        id: `popup_${e.id}`,
                        rotation: e.rotation
                    },
                    parent: this.parent,
                    elements: [
                        this
                    ]
                });
                this.parent.div.append(i.render());
            }
            render() {
                (0, s.unreachable)("Abstract method `AnnotationElement.render` called");
            }
            _getElementsByName(t, e = null) {
                const i = [];
                if (this._fieldObjects) {
                    const n = this._fieldObjects[t];
                    if (n) for (const { page: t, id: a, exportValues: r } of n){
                        if (-1 === t) continue;
                        if (a === e) continue;
                        const n = "string" == typeof r ? r : null, o = document.querySelector(`[data-element-id="${a}"]`);
                        !o || l.has(o) ? i.push({
                            id: a,
                            exportValue: n,
                            domElement: o
                        }) : (0, s.warn)(`_getElementsByName - element not allowed: ${a}`);
                    }
                    return i;
                }
                for (const s of document.getElementsByName(t)){
                    const { exportValue: t } = s, n = s.getAttribute("data-element-id");
                    n !== e && l.has(s) && i.push({
                        id: n,
                        exportValue: t,
                        domElement: s
                    });
                }
                return i;
            }
            show() {
                this.container && (this.container.hidden = !1);
                this.popup?.maybeShow();
            }
            hide() {
                this.container && (this.container.hidden = !0);
                this.popup?.forceHide();
            }
            getElementsToTriggerPopup() {
                return this.container;
            }
            addHighlightArea() {
                const t = this.getElementsToTriggerPopup();
                if (Array.isArray(t)) for (const e of t)e.classList.add("highlightArea");
                else t.classList.add("highlightArea");
            }
            get _isEditable() {
                return !1;
            }
            _editOnDoubleClick() {
                if (!this._isEditable) return;
                const { annotationEditorType: t, data: { id: e } } = this;
                this.container.addEventListener("dblclick", ()=>{
                    this.linkService.eventBus?.dispatch("switchannotationeditormode", {
                        source: this,
                        mode: t,
                        editId: e
                    });
                });
            }
        }
        class LinkAnnotationElement extends AnnotationElement {
            constructor(t, e = null){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !!e?.ignoreBorder,
                    createQuadrilaterals: !0
                });
                this.isTooltipOnly = t.data.isTooltipOnly;
            }
            render() {
                const { data: t, linkService: e } = this, i = document.createElement("a");
                i.setAttribute("data-element-id", t.id);
                let s = !1;
                if (t.url) {
                    e.addLinkAttributes(i, t.url, t.newWindow);
                    s = !0;
                } else if (t.action) {
                    this._bindNamedAction(i, t.action);
                    s = !0;
                } else if (t.attachment) {
                    this.#e(i, t.attachment, t.attachmentDest);
                    s = !0;
                } else if (t.setOCGState) {
                    this.#i(i, t.setOCGState);
                    s = !0;
                } else if (t.dest) {
                    this._bindLink(i, t.dest);
                    s = !0;
                } else {
                    if (t.actions && (t.actions.Action || t.actions["Mouse Up"] || t.actions["Mouse Down"]) && this.enableScripting && this.hasJSActions) {
                        this._bindJSAction(i, t);
                        s = !0;
                    }
                    if (t.resetForm) {
                        this._bindResetFormAction(i, t.resetForm);
                        s = !0;
                    } else if (this.isTooltipOnly && !s) {
                        this._bindLink(i, "");
                        s = !0;
                    }
                }
                this.container.classList.add("linkAnnotation");
                s && this.container.append(i);
                return this.container;
            }
            #s() {
                this.container.setAttribute("data-internal-link", "");
            }
            _bindLink(t, e) {
                t.href = this.linkService.getDestinationHash(e);
                t.onclick = ()=>{
                    e && this.linkService.goToDestination(e);
                    return !1;
                };
                (e || "" === e) && this.#s();
            }
            _bindNamedAction(t, e) {
                t.href = this.linkService.getAnchorUrl("");
                t.onclick = ()=>{
                    this.linkService.executeNamedAction(e);
                    return !1;
                };
                this.#s();
            }
            #e(t, e, i = null) {
                t.href = this.linkService.getAnchorUrl("");
                t.onclick = ()=>{
                    this.downloadManager?.openOrDownloadData(e.content, e.filename, i);
                    return !1;
                };
                this.#s();
            }
            #i(t, e) {
                t.href = this.linkService.getAnchorUrl("");
                t.onclick = ()=>{
                    this.linkService.executeSetOCGState(e);
                    return !1;
                };
                this.#s();
            }
            _bindJSAction(t, e) {
                t.href = this.linkService.getAnchorUrl("");
                const i = new Map([
                    [
                        "Action",
                        "onclick"
                    ],
                    [
                        "Mouse Up",
                        "onmouseup"
                    ],
                    [
                        "Mouse Down",
                        "onmousedown"
                    ]
                ]);
                for (const s of Object.keys(e.actions)){
                    const n = i.get(s);
                    n && (t[n] = ()=>{
                        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                            source: this,
                            detail: {
                                id: e.id,
                                name: s
                            }
                        });
                        return !1;
                    });
                }
                t.onclick || (t.onclick = ()=>!1);
                this.#s();
            }
            _bindResetFormAction(t, e) {
                const i = t.onclick;
                i || (t.href = this.linkService.getAnchorUrl(""));
                this.#s();
                if (this._fieldObjects) t.onclick = ()=>{
                    i?.();
                    const { fields: t, refs: n, include: a } = e, r = [];
                    if (0 !== t.length || 0 !== n.length) {
                        const e = new Set(n);
                        for (const i of t){
                            const t = this._fieldObjects[i] || [];
                            for (const { id: i } of t)e.add(i);
                        }
                        for (const t of Object.values(this._fieldObjects))for (const i of t)e.has(i.id) === a && r.push(i);
                    } else for (const t of Object.values(this._fieldObjects))r.push(...t);
                    const o = this.annotationStorage, h = [];
                    for (const t of r){
                        const { id: e } = t;
                        h.push(e);
                        switch(t.type){
                            case "text":
                                {
                                    const i = t.defaultValue || "";
                                    o.setValue(e, {
                                        value: i
                                    });
                                    break;
                                }
                            case "checkbox":
                            case "radiobutton":
                                {
                                    const i = t.defaultValue === t.exportValues;
                                    o.setValue(e, {
                                        value: i
                                    });
                                    break;
                                }
                            case "combobox":
                            case "listbox":
                                {
                                    const i = t.defaultValue || "";
                                    o.setValue(e, {
                                        value: i
                                    });
                                    break;
                                }
                            default:
                                continue;
                        }
                        const i = document.querySelector(`[data-element-id="${e}"]`);
                        i && (l.has(i) ? i.dispatchEvent(new Event("resetform")) : (0, s.warn)(`_bindResetFormAction - element not allowed: ${e}`));
                    }
                    this.enableScripting && this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                        source: this,
                        detail: {
                            id: "app",
                            ids: h,
                            name: "ResetForm"
                        }
                    });
                    return !1;
                };
                else {
                    (0, s.warn)('_bindResetFormAction - "resetForm" action not supported, ensure that the `fieldObjects` parameter is provided.');
                    i || (t.onclick = ()=>!1);
                }
            }
        }
        class TextAnnotationElement extends AnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !0
                });
            }
            render() {
                this.container.classList.add("textAnnotation");
                const t = document.createElement("img");
                t.src = this.imageResourcesPath + "annotation-" + this.data.name.toLowerCase() + ".svg";
                t.setAttribute("data-l10n-id", "pdfjs-text-annotation-type");
                t.setAttribute("data-l10n-args", JSON.stringify({
                    type: this.data.name
                }));
                !this.data.popupRef && this.hasPopupData && this._createPopup();
                this.container.append(t);
                return this.container;
            }
        }
        class WidgetAnnotationElement extends AnnotationElement {
            render() {
                this.data.alternativeText && (this.container.title = this.data.alternativeText);
                return this.container;
            }
            showElementAndHideCanvas(t) {
                if (this.data.hasOwnCanvas) {
                    "CANVAS" === t.previousSibling?.nodeName && (t.previousSibling.hidden = !0);
                    t.hidden = !1;
                }
            }
            _getKeyModifier(t) {
                return s.FeatureTest.platform.isMac ? t.metaKey : t.ctrlKey;
            }
            _setEventListener(t, e, i, s, n) {
                i.includes("mouse") ? t.addEventListener(i, (t)=>{
                    this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                        source: this,
                        detail: {
                            id: this.data.id,
                            name: s,
                            value: n(t),
                            shift: t.shiftKey,
                            modifier: this._getKeyModifier(t)
                        }
                    });
                }) : t.addEventListener(i, (t)=>{
                    if ("blur" === i) {
                        if (!e.focused || !t.relatedTarget) return;
                        e.focused = !1;
                    } else if ("focus" === i) {
                        if (e.focused) return;
                        e.focused = !0;
                    }
                    n && this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                        source: this,
                        detail: {
                            id: this.data.id,
                            name: s,
                            value: n(t)
                        }
                    });
                });
            }
            _setEventListeners(t, e, i, s) {
                for (const [n, a] of i)if ("Action" === a || this.data.actions?.[a]) {
                    "Focus" !== a && "Blur" !== a || (e ||= {
                        focused: !1
                    });
                    this._setEventListener(t, e, n, a, s);
                    "Focus" !== a || this.data.actions?.Blur ? "Blur" !== a || this.data.actions?.Focus || this._setEventListener(t, e, "focus", "Focus", null) : this._setEventListener(t, e, "blur", "Blur", null);
                }
            }
            _setBackgroundColor(t) {
                const e = this.data.backgroundColor || null;
                t.style.backgroundColor = null === e ? "transparent" : s.Util.makeHexColor(e[0], e[1], e[2]);
            }
            _setTextStyle(t) {
                const e = [
                    "left",
                    "center",
                    "right"
                ], { fontColor: i } = this.data.defaultAppearanceData, n = this.data.defaultAppearanceData.fontSize || 9, a = t.style;
                let r;
                const roundToOneDecimal = (t)=>Math.round(10 * t) / 10;
                if (this.data.multiLine) {
                    const t = Math.abs(this.data.rect[3] - this.data.rect[1] - 2), e = t / (Math.round(t / (s.LINE_FACTOR * n)) || 1);
                    r = Math.min(n, roundToOneDecimal(e / s.LINE_FACTOR));
                } else {
                    const t = Math.abs(this.data.rect[3] - this.data.rect[1] - 2);
                    r = Math.min(n, roundToOneDecimal(t / s.LINE_FACTOR));
                }
                a.fontSize = `calc(${r}px * var(--scale-factor))`;
                a.color = s.Util.makeHexColor(i[0], i[1], i[2]);
                null !== this.data.textAlignment && (a.textAlign = e[this.data.textAlignment]);
            }
            _setRequired(t, e) {
                e ? t.setAttribute("required", !0) : t.removeAttribute("required");
                t.setAttribute("aria-required", e);
            }
        }
        class TextWidgetAnnotationElement extends WidgetAnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: t.renderForms || t.data.hasOwnCanvas || !t.data.hasAppearance && !!t.data.fieldValue
                });
            }
            setPropertyOnSiblings(t, e, i, s) {
                const n = this.annotationStorage;
                for (const a of this._getElementsByName(t.name, t.id)){
                    a.domElement && (a.domElement[e] = i);
                    n.setValue(a.id, {
                        [s]: i
                    });
                }
            }
            render() {
                const t = this.annotationStorage, e = this.data.id;
                this.container.classList.add("textWidgetAnnotation");
                let i = null;
                if (this.renderForms) {
                    const s = t.getValue(e, {
                        value: this.data.fieldValue
                    });
                    let n = s.value || "";
                    const a = t.getValue(e, {
                        charLimit: this.data.maxLen
                    }).charLimit;
                    a && n.length > a && (n = n.slice(0, a));
                    let r = s.formattedValue || this.data.textContent?.join("\n") || null;
                    r && this.data.comb && (r = r.replaceAll(/\s+/g, ""));
                    const h = {
                        userValue: n,
                        formattedValue: r,
                        lastCommittedValue: null,
                        commitKey: 1,
                        focused: !1
                    };
                    if (this.data.multiLine) {
                        i = document.createElement("textarea");
                        i.textContent = r ?? n;
                        this.data.doNotScroll && (i.style.overflowY = "hidden");
                    } else {
                        i = document.createElement("input");
                        i.type = "text";
                        i.setAttribute("value", r ?? n);
                        this.data.doNotScroll && (i.style.overflowX = "hidden");
                    }
                    this.data.hasOwnCanvas && (i.hidden = !0);
                    l.add(i);
                    i.setAttribute("data-element-id", e);
                    i.disabled = this.data.readOnly;
                    i.name = this.data.fieldName;
                    i.tabIndex = o;
                    this._setRequired(i, this.data.required);
                    a && (i.maxLength = a);
                    i.addEventListener("input", (s)=>{
                        t.setValue(e, {
                            value: s.target.value
                        });
                        this.setPropertyOnSiblings(i, "value", s.target.value, "value");
                        h.formattedValue = null;
                    });
                    i.addEventListener("resetform", (t)=>{
                        const e = this.data.defaultFieldValue ?? "";
                        i.value = h.userValue = e;
                        h.formattedValue = null;
                    });
                    let blurListener = (t)=>{
                        const { formattedValue: e } = h;
                        null != e && (t.target.value = e);
                        t.target.scrollLeft = 0;
                    };
                    if (this.enableScripting && this.hasJSActions) {
                        i.addEventListener("focus", (t)=>{
                            if (h.focused) return;
                            const { target: e } = t;
                            h.userValue && (e.value = h.userValue);
                            h.lastCommittedValue = e.value;
                            h.commitKey = 1;
                            this.data.actions?.Focus || (h.focused = !0);
                        });
                        i.addEventListener("updatefromsandbox", (i)=>{
                            this.showElementAndHideCanvas(i.target);
                            const s = {
                                value (i) {
                                    h.userValue = i.detail.value ?? "";
                                    t.setValue(e, {
                                        value: h.userValue.toString()
                                    });
                                    i.target.value = h.userValue;
                                },
                                formattedValue (i) {
                                    const { formattedValue: s } = i.detail;
                                    h.formattedValue = s;
                                    null != s && i.target !== document.activeElement && (i.target.value = s);
                                    t.setValue(e, {
                                        formattedValue: s
                                    });
                                },
                                selRange (t) {
                                    t.target.setSelectionRange(...t.detail.selRange);
                                },
                                charLimit: (i)=>{
                                    const { charLimit: s } = i.detail, { target: n } = i;
                                    if (0 === s) {
                                        n.removeAttribute("maxLength");
                                        return;
                                    }
                                    n.setAttribute("maxLength", s);
                                    let a = h.userValue;
                                    if (a && !(a.length <= s)) {
                                        a = a.slice(0, s);
                                        n.value = h.userValue = a;
                                        t.setValue(e, {
                                            value: a
                                        });
                                        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                            source: this,
                                            detail: {
                                                id: e,
                                                name: "Keystroke",
                                                value: a,
                                                willCommit: !0,
                                                commitKey: 1,
                                                selStart: n.selectionStart,
                                                selEnd: n.selectionEnd
                                            }
                                        });
                                    }
                                }
                            };
                            this._dispatchEventFromSandbox(s, i);
                        });
                        i.addEventListener("keydown", (t)=>{
                            h.commitKey = 1;
                            let i = -1;
                            "Escape" === t.key ? i = 0 : "Enter" !== t.key || this.data.multiLine ? "Tab" === t.key && (h.commitKey = 3) : i = 2;
                            if (-1 === i) return;
                            const { value: s } = t.target;
                            if (h.lastCommittedValue !== s) {
                                h.lastCommittedValue = s;
                                h.userValue = s;
                                this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                    source: this,
                                    detail: {
                                        id: e,
                                        name: "Keystroke",
                                        value: s,
                                        willCommit: !0,
                                        commitKey: i,
                                        selStart: t.target.selectionStart,
                                        selEnd: t.target.selectionEnd
                                    }
                                });
                            }
                        });
                        const s = blurListener;
                        blurListener = null;
                        i.addEventListener("blur", (t)=>{
                            if (!h.focused || !t.relatedTarget) return;
                            this.data.actions?.Blur || (h.focused = !1);
                            const { value: i } = t.target;
                            h.userValue = i;
                            h.lastCommittedValue !== i && this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                source: this,
                                detail: {
                                    id: e,
                                    name: "Keystroke",
                                    value: i,
                                    willCommit: !0,
                                    commitKey: h.commitKey,
                                    selStart: t.target.selectionStart,
                                    selEnd: t.target.selectionEnd
                                }
                            });
                            s(t);
                        });
                        this.data.actions?.Keystroke && i.addEventListener("beforeinput", (t)=>{
                            h.lastCommittedValue = null;
                            const { data: i, target: s } = t, { value: n, selectionStart: a, selectionEnd: r } = s;
                            let o = a, l = r;
                            switch(t.inputType){
                                case "deleteWordBackward":
                                    {
                                        const t = n.substring(0, a).match(/\w*[^\w]*$/);
                                        t && (o -= t[0].length);
                                        break;
                                    }
                                case "deleteWordForward":
                                    {
                                        const t = n.substring(a).match(/^[^\w]*\w*/);
                                        t && (l += t[0].length);
                                        break;
                                    }
                                case "deleteContentBackward":
                                    a === r && (o -= 1);
                                    break;
                                case "deleteContentForward":
                                    a === r && (l += 1);
                            }
                            t.preventDefault();
                            this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                                source: this,
                                detail: {
                                    id: e,
                                    name: "Keystroke",
                                    value: n,
                                    change: i || "",
                                    willCommit: !1,
                                    selStart: o,
                                    selEnd: l
                                }
                            });
                        });
                        this._setEventListeners(i, h, [
                            [
                                "focus",
                                "Focus"
                            ],
                            [
                                "blur",
                                "Blur"
                            ],
                            [
                                "mousedown",
                                "Mouse Down"
                            ],
                            [
                                "mouseenter",
                                "Mouse Enter"
                            ],
                            [
                                "mouseleave",
                                "Mouse Exit"
                            ],
                            [
                                "mouseup",
                                "Mouse Up"
                            ]
                        ], (t)=>t.target.value);
                    }
                    blurListener && i.addEventListener("blur", blurListener);
                    if (this.data.comb) {
                        const t = (this.data.rect[2] - this.data.rect[0]) / a;
                        i.classList.add("comb");
                        i.style.letterSpacing = `calc(${t}px * var(--scale-factor) - 1ch)`;
                    }
                } else {
                    i = document.createElement("div");
                    i.textContent = this.data.fieldValue;
                    i.style.verticalAlign = "middle";
                    i.style.display = "table-cell";
                    this.data.hasOwnCanvas && (i.hidden = !0);
                }
                this._setTextStyle(i);
                this._setBackgroundColor(i);
                this._setDefaultPropertiesFromJS(i);
                this.container.append(i);
                return this.container;
            }
        }
        class SignatureWidgetAnnotationElement extends WidgetAnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !!t.data.hasOwnCanvas
                });
            }
        }
        class CheckboxWidgetAnnotationElement extends WidgetAnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: t.renderForms
                });
            }
            render() {
                const t = this.annotationStorage, e = this.data, i = e.id;
                let s = t.getValue(i, {
                    value: e.exportValue === e.fieldValue
                }).value;
                if ("string" == typeof s) {
                    s = "Off" !== s;
                    t.setValue(i, {
                        value: s
                    });
                }
                this.container.classList.add("buttonWidgetAnnotation", "checkBox");
                const n = document.createElement("input");
                l.add(n);
                n.setAttribute("data-element-id", i);
                n.disabled = e.readOnly;
                this._setRequired(n, this.data.required);
                n.type = "checkbox";
                n.name = e.fieldName;
                s && n.setAttribute("checked", !0);
                n.setAttribute("exportValue", e.exportValue);
                n.tabIndex = o;
                n.addEventListener("change", (s)=>{
                    const { name: n, checked: a } = s.target;
                    for (const s of this._getElementsByName(n, i)){
                        const i = a && s.exportValue === e.exportValue;
                        s.domElement && (s.domElement.checked = i);
                        t.setValue(s.id, {
                            value: i
                        });
                    }
                    t.setValue(i, {
                        value: a
                    });
                });
                n.addEventListener("resetform", (t)=>{
                    const i = e.defaultFieldValue || "Off";
                    t.target.checked = i === e.exportValue;
                });
                if (this.enableScripting && this.hasJSActions) {
                    n.addEventListener("updatefromsandbox", (e)=>{
                        const s = {
                            value (e) {
                                e.target.checked = "Off" !== e.detail.value;
                                t.setValue(i, {
                                    value: e.target.checked
                                });
                            }
                        };
                        this._dispatchEventFromSandbox(s, e);
                    });
                    this._setEventListeners(n, null, [
                        [
                            "change",
                            "Validate"
                        ],
                        [
                            "change",
                            "Action"
                        ],
                        [
                            "focus",
                            "Focus"
                        ],
                        [
                            "blur",
                            "Blur"
                        ],
                        [
                            "mousedown",
                            "Mouse Down"
                        ],
                        [
                            "mouseenter",
                            "Mouse Enter"
                        ],
                        [
                            "mouseleave",
                            "Mouse Exit"
                        ],
                        [
                            "mouseup",
                            "Mouse Up"
                        ]
                    ], (t)=>t.target.checked);
                }
                this._setBackgroundColor(n);
                this._setDefaultPropertiesFromJS(n);
                this.container.append(n);
                return this.container;
            }
        }
        class RadioButtonWidgetAnnotationElement extends WidgetAnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: t.renderForms
                });
            }
            render() {
                this.container.classList.add("buttonWidgetAnnotation", "radioButton");
                const t = this.annotationStorage, e = this.data, i = e.id;
                let s = t.getValue(i, {
                    value: e.fieldValue === e.buttonValue
                }).value;
                if ("string" == typeof s) {
                    s = s !== e.buttonValue;
                    t.setValue(i, {
                        value: s
                    });
                }
                if (s) for (const s of this._getElementsByName(e.fieldName, i))t.setValue(s.id, {
                    value: !1
                });
                const n = document.createElement("input");
                l.add(n);
                n.setAttribute("data-element-id", i);
                n.disabled = e.readOnly;
                this._setRequired(n, this.data.required);
                n.type = "radio";
                n.name = e.fieldName;
                s && n.setAttribute("checked", !0);
                n.tabIndex = o;
                n.addEventListener("change", (e)=>{
                    const { name: s, checked: n } = e.target;
                    for (const e of this._getElementsByName(s, i))t.setValue(e.id, {
                        value: !1
                    });
                    t.setValue(i, {
                        value: n
                    });
                });
                n.addEventListener("resetform", (t)=>{
                    const i = e.defaultFieldValue;
                    t.target.checked = null != i && i === e.buttonValue;
                });
                if (this.enableScripting && this.hasJSActions) {
                    const s = e.buttonValue;
                    n.addEventListener("updatefromsandbox", (e)=>{
                        const n = {
                            value: (e)=>{
                                const n = s === e.detail.value;
                                for (const s of this._getElementsByName(e.target.name)){
                                    const e = n && s.id === i;
                                    s.domElement && (s.domElement.checked = e);
                                    t.setValue(s.id, {
                                        value: e
                                    });
                                }
                            }
                        };
                        this._dispatchEventFromSandbox(n, e);
                    });
                    this._setEventListeners(n, null, [
                        [
                            "change",
                            "Validate"
                        ],
                        [
                            "change",
                            "Action"
                        ],
                        [
                            "focus",
                            "Focus"
                        ],
                        [
                            "blur",
                            "Blur"
                        ],
                        [
                            "mousedown",
                            "Mouse Down"
                        ],
                        [
                            "mouseenter",
                            "Mouse Enter"
                        ],
                        [
                            "mouseleave",
                            "Mouse Exit"
                        ],
                        [
                            "mouseup",
                            "Mouse Up"
                        ]
                    ], (t)=>t.target.checked);
                }
                this._setBackgroundColor(n);
                this._setDefaultPropertiesFromJS(n);
                this.container.append(n);
                return this.container;
            }
        }
        class PushButtonWidgetAnnotationElement extends LinkAnnotationElement {
            constructor(t){
                super(t, {
                    ignoreBorder: t.data.hasAppearance
                });
            }
            render() {
                const t = super.render();
                t.classList.add("buttonWidgetAnnotation", "pushButton");
                this.data.alternativeText && (t.title = this.data.alternativeText);
                const e = t.lastChild;
                if (this.enableScripting && this.hasJSActions && e) {
                    this._setDefaultPropertiesFromJS(e);
                    e.addEventListener("updatefromsandbox", (t)=>{
                        this._dispatchEventFromSandbox({}, t);
                    });
                }
                return t;
            }
        }
        class ChoiceWidgetAnnotationElement extends WidgetAnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: t.renderForms
                });
            }
            render() {
                this.container.classList.add("choiceWidgetAnnotation");
                const t = this.annotationStorage, e = this.data.id, i = t.getValue(e, {
                    value: this.data.fieldValue
                }), s = document.createElement("select");
                l.add(s);
                s.setAttribute("data-element-id", e);
                s.disabled = this.data.readOnly;
                this._setRequired(s, this.data.required);
                s.name = this.data.fieldName;
                s.tabIndex = o;
                let n = this.data.combo && this.data.options.length > 0;
                if (!this.data.combo) {
                    s.size = this.data.options.length;
                    this.data.multiSelect && (s.multiple = !0);
                }
                s.addEventListener("resetform", (t)=>{
                    const e = this.data.defaultFieldValue;
                    for (const t of s.options)t.selected = t.value === e;
                });
                for (const t of this.data.options){
                    const e = document.createElement("option");
                    e.textContent = t.displayValue;
                    e.value = t.exportValue;
                    if (i.value.includes(t.exportValue)) {
                        e.setAttribute("selected", !0);
                        n = !1;
                    }
                    s.append(e);
                }
                let a = null;
                if (n) {
                    const t = document.createElement("option");
                    t.value = " ";
                    t.setAttribute("hidden", !0);
                    t.setAttribute("selected", !0);
                    s.prepend(t);
                    a = ()=>{
                        t.remove();
                        s.removeEventListener("input", a);
                        a = null;
                    };
                    s.addEventListener("input", a);
                }
                const getValue = (t)=>{
                    const e = t ? "value" : "textContent", { options: i, multiple: n } = s;
                    return n ? Array.prototype.filter.call(i, (t)=>t.selected).map((t)=>t[e]) : -1 === i.selectedIndex ? null : i[i.selectedIndex][e];
                };
                let r = getValue(!1);
                const getItems = (t)=>{
                    const e = t.target.options;
                    return Array.prototype.map.call(e, (t)=>({
                            displayValue: t.textContent,
                            exportValue: t.value
                        }));
                };
                if (this.enableScripting && this.hasJSActions) {
                    s.addEventListener("updatefromsandbox", (i)=>{
                        const n = {
                            value (i) {
                                a?.();
                                const n = i.detail.value, o = new Set(Array.isArray(n) ? n : [
                                    n
                                ]);
                                for (const t of s.options)t.selected = o.has(t.value);
                                t.setValue(e, {
                                    value: getValue(!0)
                                });
                                r = getValue(!1);
                            },
                            multipleSelection (t) {
                                s.multiple = !0;
                            },
                            remove (i) {
                                const n = s.options, a = i.detail.remove;
                                n[a].selected = !1;
                                s.remove(a);
                                if (n.length > 0) {
                                    -1 === Array.prototype.findIndex.call(n, (t)=>t.selected) && (n[0].selected = !0);
                                }
                                t.setValue(e, {
                                    value: getValue(!0),
                                    items: getItems(i)
                                });
                                r = getValue(!1);
                            },
                            clear (i) {
                                for(; 0 !== s.length;)s.remove(0);
                                t.setValue(e, {
                                    value: null,
                                    items: []
                                });
                                r = getValue(!1);
                            },
                            insert (i) {
                                const { index: n, displayValue: a, exportValue: o } = i.detail.insert, l = s.children[n], h = document.createElement("option");
                                h.textContent = a;
                                h.value = o;
                                l ? l.before(h) : s.append(h);
                                t.setValue(e, {
                                    value: getValue(!0),
                                    items: getItems(i)
                                });
                                r = getValue(!1);
                            },
                            items (i) {
                                const { items: n } = i.detail;
                                for(; 0 !== s.length;)s.remove(0);
                                for (const t of n){
                                    const { displayValue: e, exportValue: i } = t, n = document.createElement("option");
                                    n.textContent = e;
                                    n.value = i;
                                    s.append(n);
                                }
                                s.options.length > 0 && (s.options[0].selected = !0);
                                t.setValue(e, {
                                    value: getValue(!0),
                                    items: getItems(i)
                                });
                                r = getValue(!1);
                            },
                            indices (i) {
                                const s = new Set(i.detail.indices);
                                for (const t of i.target.options)t.selected = s.has(t.index);
                                t.setValue(e, {
                                    value: getValue(!0)
                                });
                                r = getValue(!1);
                            },
                            editable (t) {
                                t.target.disabled = !t.detail.editable;
                            }
                        };
                        this._dispatchEventFromSandbox(n, i);
                    });
                    s.addEventListener("input", (i)=>{
                        const s = getValue(!0);
                        t.setValue(e, {
                            value: s
                        });
                        i.preventDefault();
                        this.linkService.eventBus?.dispatch("dispatcheventinsandbox", {
                            source: this,
                            detail: {
                                id: e,
                                name: "Keystroke",
                                value: r,
                                changeEx: s,
                                willCommit: !1,
                                commitKey: 1,
                                keyDown: !1
                            }
                        });
                    });
                    this._setEventListeners(s, null, [
                        [
                            "focus",
                            "Focus"
                        ],
                        [
                            "blur",
                            "Blur"
                        ],
                        [
                            "mousedown",
                            "Mouse Down"
                        ],
                        [
                            "mouseenter",
                            "Mouse Enter"
                        ],
                        [
                            "mouseleave",
                            "Mouse Exit"
                        ],
                        [
                            "mouseup",
                            "Mouse Up"
                        ],
                        [
                            "input",
                            "Action"
                        ],
                        [
                            "input",
                            "Validate"
                        ]
                    ], (t)=>t.target.value);
                } else s.addEventListener("input", function(i) {
                    t.setValue(e, {
                        value: getValue(!0)
                    });
                });
                this.data.combo && this._setTextStyle(s);
                this._setBackgroundColor(s);
                this._setDefaultPropertiesFromJS(s);
                this.container.append(s);
                return this.container;
            }
        }
        class PopupAnnotationElement extends AnnotationElement {
            constructor(t){
                const { data: e, elements: i } = t;
                super(t, {
                    isRenderable: AnnotationElement._hasPopupData(e)
                });
                this.elements = i;
            }
            render() {
                this.container.classList.add("popupAnnotation");
                const t = new PopupElement({
                    container: this.container,
                    color: this.data.color,
                    titleObj: this.data.titleObj,
                    modificationDate: this.data.modificationDate,
                    contentsObj: this.data.contentsObj,
                    richText: this.data.richText,
                    rect: this.data.rect,
                    parentRect: this.data.parentRect || null,
                    parent: this.parent,
                    elements: this.elements,
                    open: this.data.open
                }), e = [];
                for (const i of this.elements){
                    i.popup = t;
                    e.push(i.data.id);
                    i.addHighlightArea();
                }
                this.container.setAttribute("aria-controls", e.map((t)=>`${s.AnnotationPrefix}${t}`).join(","));
                return this.container;
            }
        }
        class PopupElement {
            #n;
            #r;
            #l;
            #d;
            #u;
            #p;
            #g;
            #m;
            #f;
            #b;
            #A;
            #v;
            #y;
            #E;
            #_;
            #w;
            #x;
            constructor({ container: t, color: e, elements: i, titleObj: s, modificationDate: a, contentsObj: r, richText: o, parent: l, rect: h, parentRect: d, open: c }){
                this.#n = this.#a.bind(this);
                this.#r = this.#o.bind(this);
                this.#l = this.#h.bind(this);
                this.#d = this.#c.bind(this);
                this.#u = null;
                this.#p = null;
                this.#g = null;
                this.#m = null;
                this.#f = null;
                this.#b = null;
                this.#A = null;
                this.#v = !1;
                this.#y = null;
                this.#E = null;
                this.#_ = null;
                this.#w = null;
                this.#x = !1;
                this.#p = t;
                this.#w = s;
                this.#g = r;
                this.#_ = o;
                this.#b = l;
                this.#u = e;
                this.#E = h;
                this.#A = d;
                this.#f = i;
                this.#m = n.PDFDateString.toDateObject(a);
                this.trigger = i.flatMap((t)=>t.getElementsToTriggerPopup());
                for (const t of this.trigger){
                    t.addEventListener("click", this.#d);
                    t.addEventListener("mouseenter", this.#l);
                    t.addEventListener("mouseleave", this.#r);
                    t.classList.add("popupTriggerArea");
                }
                for (const t of i)t.container?.addEventListener("keydown", this.#n);
                this.#p.hidden = !0;
                c && this.#c();
            }
            render() {
                if (this.#y) return;
                const { page: { view: t }, viewport: { rawDims: { pageWidth: e, pageHeight: i, pageX: n, pageY: a } } } = this.#b, o = this.#y = document.createElement("div");
                o.className = "popup";
                if (this.#u) {
                    const t = o.style.outlineColor = s.Util.makeHexColor(...this.#u);
                    if (CSS.supports("background-color", "color-mix(in srgb, red 30%, white)")) o.style.backgroundColor = `color-mix(in srgb, ${t} 30%, white)`;
                    else {
                        const t = .7;
                        o.style.backgroundColor = s.Util.makeHexColor(...this.#u.map((e)=>Math.floor(t * (255 - e) + e)));
                    }
                }
                const l = document.createElement("span");
                l.className = "header";
                const h = document.createElement("h1");
                l.append(h);
                ({ dir: h.dir, str: h.textContent } = this.#w);
                o.append(l);
                if (this.#m) {
                    const t = document.createElement("span");
                    t.classList.add("popupDate");
                    t.setAttribute("data-l10n-id", "pdfjs-annotation-date-string");
                    t.setAttribute("data-l10n-args", JSON.stringify({
                        date: this.#m.toLocaleDateString(),
                        time: this.#m.toLocaleTimeString()
                    }));
                    l.append(t);
                }
                const d = this.#g, c = this.#_;
                if (!c?.str || d?.str && d.str !== c.str) {
                    const t = this._formatContents(d);
                    o.append(t);
                } else {
                    r.XfaLayer.render({
                        xfaHtml: c.html,
                        intent: "richText",
                        div: o
                    });
                    o.lastChild.classList.add("richText", "popupContent");
                }
                let u = !!this.#A, p = u ? this.#A : this.#E;
                for (const t of this.#f)if (!p || null !== s.Util.intersect(t.data.rect, p)) {
                    p = t.data.rect;
                    u = !0;
                    break;
                }
                const g = s.Util.normalizeRect([
                    p[0],
                    t[3] - p[1] + t[1],
                    p[2],
                    t[3] - p[3] + t[1]
                ]), m = u ? p[2] - p[0] + 5 : 0, f = g[0] + m, b = g[1], { style: A } = this.#p;
                A.left = 100 * (f - n) / e + "%";
                A.top = 100 * (b - a) / i + "%";
                this.#p.append(o);
            }
            _formatContents({ str: t, dir: e }) {
                const i = document.createElement("p");
                i.classList.add("popupContent");
                i.dir = e;
                const s = t.split(/(?:\r\n?|\n)/);
                for(let t = 0, e = s.length; t < e; ++t){
                    const n = s[t];
                    i.append(document.createTextNode(n));
                    t < e - 1 && i.append(document.createElement("br"));
                }
                return i;
            }
            #a(t) {
                t.altKey || t.shiftKey || t.ctrlKey || t.metaKey || ("Enter" === t.key || "Escape" === t.key && this.#v) && this.#c();
            }
            #c() {
                this.#v = !this.#v;
                if (this.#v) {
                    this.#h();
                    this.#p.addEventListener("click", this.#d);
                    this.#p.addEventListener("keydown", this.#n);
                } else {
                    this.#o();
                    this.#p.removeEventListener("click", this.#d);
                    this.#p.removeEventListener("keydown", this.#n);
                }
            }
            #h() {
                this.#y || this.render();
                if (this.isVisible) this.#v && this.#p.classList.add("focused");
                else {
                    this.#p.hidden = !1;
                    this.#p.style.zIndex = parseInt(this.#p.style.zIndex) + 1e3;
                }
            }
            #o() {
                this.#p.classList.remove("focused");
                if (!this.#v && this.isVisible) {
                    this.#p.hidden = !0;
                    this.#p.style.zIndex = parseInt(this.#p.style.zIndex) - 1e3;
                }
            }
            forceHide() {
                this.#x = this.isVisible;
                this.#x && (this.#p.hidden = !0);
            }
            maybeShow() {
                if (this.#x) {
                    this.#x = !1;
                    this.#p.hidden = !1;
                }
            }
            get isVisible() {
                return !1 === this.#p.hidden;
            }
        }
        class FreeTextAnnotationElement extends AnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0
                });
                this.textContent = t.data.textContent;
                this.textPosition = t.data.textPosition;
                this.annotationEditorType = s.AnnotationEditorType.FREETEXT;
            }
            render() {
                this.container.classList.add("freeTextAnnotation");
                if (this.textContent) {
                    const t = document.createElement("div");
                    t.classList.add("annotationTextContent");
                    t.setAttribute("role", "comment");
                    for (const e of this.textContent){
                        const i = document.createElement("span");
                        i.textContent = e;
                        t.append(i);
                    }
                    this.container.append(t);
                }
                !this.data.popupRef && this.hasPopupData && this._createPopup();
                this._editOnDoubleClick();
                return this.container;
            }
            get _isEditable() {
                return this.data.hasOwnCanvas;
            }
        }
        class LineAnnotationElement extends AnnotationElement {
            #C;
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0
                });
                this.#C = null;
            }
            render() {
                this.container.classList.add("lineAnnotation");
                const t = this.data, { width: e, height: i } = getRectDims(t.rect), s = this.svgFactory.create(e, i, !0), n = this.#C = this.svgFactory.createElement("svg:line");
                n.setAttribute("x1", t.rect[2] - t.lineCoordinates[0]);
                n.setAttribute("y1", t.rect[3] - t.lineCoordinates[1]);
                n.setAttribute("x2", t.rect[2] - t.lineCoordinates[2]);
                n.setAttribute("y2", t.rect[3] - t.lineCoordinates[3]);
                n.setAttribute("stroke-width", t.borderStyle.width || 1);
                n.setAttribute("stroke", "transparent");
                n.setAttribute("fill", "transparent");
                s.append(n);
                this.container.append(s);
                !t.popupRef && this.hasPopupData && this._createPopup();
                return this.container;
            }
            getElementsToTriggerPopup() {
                return this.#C;
            }
            addHighlightArea() {
                this.container.classList.add("highlightArea");
            }
        }
        class SquareAnnotationElement extends AnnotationElement {
            #S;
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0
                });
                this.#S = null;
            }
            render() {
                this.container.classList.add("squareAnnotation");
                const t = this.data, { width: e, height: i } = getRectDims(t.rect), s = this.svgFactory.create(e, i, !0), n = t.borderStyle.width, a = this.#S = this.svgFactory.createElement("svg:rect");
                a.setAttribute("x", n / 2);
                a.setAttribute("y", n / 2);
                a.setAttribute("width", e - n);
                a.setAttribute("height", i - n);
                a.setAttribute("stroke-width", n || 1);
                a.setAttribute("stroke", "transparent");
                a.setAttribute("fill", "transparent");
                s.append(a);
                this.container.append(s);
                !t.popupRef && this.hasPopupData && this._createPopup();
                return this.container;
            }
            getElementsToTriggerPopup() {
                return this.#S;
            }
            addHighlightArea() {
                this.container.classList.add("highlightArea");
            }
        }
        class CircleAnnotationElement extends AnnotationElement {
            #T;
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0
                });
                this.#T = null;
            }
            render() {
                this.container.classList.add("circleAnnotation");
                const t = this.data, { width: e, height: i } = getRectDims(t.rect), s = this.svgFactory.create(e, i, !0), n = t.borderStyle.width, a = this.#T = this.svgFactory.createElement("svg:ellipse");
                a.setAttribute("cx", e / 2);
                a.setAttribute("cy", i / 2);
                a.setAttribute("rx", e / 2 - n / 2);
                a.setAttribute("ry", i / 2 - n / 2);
                a.setAttribute("stroke-width", n || 1);
                a.setAttribute("stroke", "transparent");
                a.setAttribute("fill", "transparent");
                s.append(a);
                this.container.append(s);
                !t.popupRef && this.hasPopupData && this._createPopup();
                return this.container;
            }
            getElementsToTriggerPopup() {
                return this.#T;
            }
            addHighlightArea() {
                this.container.classList.add("highlightArea");
            }
        }
        class PolylineAnnotationElement extends AnnotationElement {
            #M;
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0
                });
                this.#M = null;
                this.containerClassName = "polylineAnnotation";
                this.svgElementName = "svg:polyline";
            }
            render() {
                this.container.classList.add(this.containerClassName);
                const t = this.data, { width: e, height: i } = getRectDims(t.rect), s = this.svgFactory.create(e, i, !0);
                let n = [];
                for (const e of t.vertices){
                    const i = e.x - t.rect[0], s = t.rect[3] - e.y;
                    n.push(i + "," + s);
                }
                n = n.join(" ");
                const a = this.#M = this.svgFactory.createElement(this.svgElementName);
                a.setAttribute("points", n);
                a.setAttribute("stroke-width", t.borderStyle.width || 1);
                a.setAttribute("stroke", "transparent");
                a.setAttribute("fill", "transparent");
                s.append(a);
                this.container.append(s);
                !t.popupRef && this.hasPopupData && this._createPopup();
                return this.container;
            }
            getElementsToTriggerPopup() {
                return this.#M;
            }
            addHighlightArea() {
                this.container.classList.add("highlightArea");
            }
        }
        class PolygonAnnotationElement extends PolylineAnnotationElement {
            constructor(t){
                super(t);
                this.containerClassName = "polygonAnnotation";
                this.svgElementName = "svg:polygon";
            }
        }
        class CaretAnnotationElement extends AnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0
                });
            }
            render() {
                this.container.classList.add("caretAnnotation");
                !this.data.popupRef && this.hasPopupData && this._createPopup();
                return this.container;
            }
        }
        class InkAnnotationElement extends AnnotationElement {
            #P;
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0
                });
                this.#P = [];
                this.containerClassName = "inkAnnotation";
                this.svgElementName = "svg:polyline";
                this.annotationEditorType = s.AnnotationEditorType.INK;
            }
            render() {
                this.container.classList.add(this.containerClassName);
                const t = this.data, { width: e, height: i } = getRectDims(t.rect), s = this.svgFactory.create(e, i, !0);
                for (const e of t.inkLists){
                    let i = [];
                    for (const s of e){
                        const e = s.x - t.rect[0], n = t.rect[3] - s.y;
                        i.push(`${e},${n}`);
                    }
                    i = i.join(" ");
                    const n = this.svgFactory.createElement(this.svgElementName);
                    this.#P.push(n);
                    n.setAttribute("points", i);
                    n.setAttribute("stroke-width", t.borderStyle.width || 1);
                    n.setAttribute("stroke", "transparent");
                    n.setAttribute("fill", "transparent");
                    !t.popupRef && this.hasPopupData && this._createPopup();
                    s.append(n);
                }
                this.container.append(s);
                return this.container;
            }
            getElementsToTriggerPopup() {
                return this.#P;
            }
            addHighlightArea() {
                this.container.classList.add("highlightArea");
            }
        }
        class HighlightAnnotationElement extends AnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0,
                    createQuadrilaterals: !0
                });
            }
            render() {
                !this.data.popupRef && this.hasPopupData && this._createPopup();
                this.container.classList.add("highlightAnnotation");
                return this.container;
            }
        }
        class UnderlineAnnotationElement extends AnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0,
                    createQuadrilaterals: !0
                });
            }
            render() {
                !this.data.popupRef && this.hasPopupData && this._createPopup();
                this.container.classList.add("underlineAnnotation");
                return this.container;
            }
        }
        class SquigglyAnnotationElement extends AnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0,
                    createQuadrilaterals: !0
                });
            }
            render() {
                !this.data.popupRef && this.hasPopupData && this._createPopup();
                this.container.classList.add("squigglyAnnotation");
                return this.container;
            }
        }
        class StrikeOutAnnotationElement extends AnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0,
                    createQuadrilaterals: !0
                });
            }
            render() {
                !this.data.popupRef && this.hasPopupData && this._createPopup();
                this.container.classList.add("strikeoutAnnotation");
                return this.container;
            }
        }
        class StampAnnotationElement extends AnnotationElement {
            constructor(t){
                super(t, {
                    isRenderable: !0,
                    ignoreBorder: !0
                });
            }
            render() {
                this.container.classList.add("stampAnnotation");
                !this.data.popupRef && this.hasPopupData && this._createPopup();
                return this.container;
            }
        }
        class FileAttachmentAnnotationElement extends AnnotationElement {
            #F;
            constructor(t){
                super(t, {
                    isRenderable: !0
                });
                this.#F = null;
                const { filename: e, content: i } = this.data.file;
                this.filename = (0, n.getFilenameFromUrl)(e, !0);
                this.content = i;
                this.linkService.eventBus?.dispatch("fileattachmentannotation", {
                    source: this,
                    filename: e,
                    content: i
                });
            }
            render() {
                this.container.classList.add("fileAttachmentAnnotation");
                const { container: t, data: e } = this;
                let i;
                if (e.hasAppearance || 0 === e.fillAlpha) i = document.createElement("div");
                else {
                    i = document.createElement("img");
                    i.src = `${this.imageResourcesPath}annotation-${/paperclip/i.test(e.name) ? "paperclip" : "pushpin"}.svg`;
                    e.fillAlpha && e.fillAlpha < 1 && (i.style = `filter: opacity(${Math.round(100 * e.fillAlpha)}%);`);
                }
                i.addEventListener("dblclick", this.#R.bind(this));
                this.#F = i;
                const { isMac: n } = s.FeatureTest.platform;
                t.addEventListener("keydown", (t)=>{
                    "Enter" === t.key && (n ? t.metaKey : t.ctrlKey) && this.#R();
                });
                !e.popupRef && this.hasPopupData ? this._createPopup() : i.classList.add("popupTriggerArea");
                t.append(i);
                return t;
            }
            getElementsToTriggerPopup() {
                return this.#F;
            }
            addHighlightArea() {
                this.container.classList.add("highlightArea");
            }
            #R() {
                this.downloadManager?.openOrDownloadData(this.content, this.filename);
            }
        }
        class AnnotationLayer {
            #k;
            #D;
            #I;
            constructor({ div: t, accessibilityManager: e, annotationCanvasMap: i, page: s, viewport: n }){
                this.#k = null;
                this.#D = null;
                this.#I = new Map;
                this.div = t;
                this.#k = e;
                this.#D = i;
                this.page = s;
                this.viewport = n;
                this.zIndex = 0;
            }
            #L(t, e) {
                const i = t.firstChild || t;
                i.id = `${s.AnnotationPrefix}${e}`;
                this.div.append(t);
                this.#k?.moveElementInDOM(this.div, t, i, !1);
            }
            async render(t) {
                const { annotations: e } = t, i = this.div;
                (0, n.setLayerDimensions)(i, this.viewport);
                const r = new Map, o = {
                    data: null,
                    layer: i,
                    linkService: t.linkService,
                    downloadManager: t.downloadManager,
                    imageResourcesPath: t.imageResourcesPath || "",
                    renderForms: !1 !== t.renderForms,
                    svgFactory: new n.DOMSVGFactory,
                    annotationStorage: t.annotationStorage || new a.AnnotationStorage,
                    enableScripting: !0 === t.enableScripting,
                    hasJSActions: t.hasJSActions,
                    fieldObjects: t.fieldObjects,
                    parent: this,
                    elements: null
                };
                for (const t of e){
                    if (t.noHTML) continue;
                    const e = t.annotationType === s.AnnotationType.POPUP;
                    if (e) {
                        const e = r.get(t.id);
                        if (!e) continue;
                        o.elements = e;
                    } else {
                        const { width: e, height: i } = getRectDims(t.rect);
                        if (e <= 0 || i <= 0) continue;
                    }
                    o.data = t;
                    const i = AnnotationElementFactory.create(o);
                    if (!i.isRenderable) continue;
                    if (!e && t.popupRef) {
                        const e = r.get(t.popupRef);
                        e ? e.push(i) : r.set(t.popupRef, [
                            i
                        ]);
                    }
                    i.annotationEditorType > 0 && this.#I.set(i.data.id, i);
                    const n = i.render();
                    t.hidden && (n.style.visibility = "hidden");
                    this.#L(n, t.id);
                }
                this.#O();
            }
            update({ viewport: t }) {
                const e = this.div;
                this.viewport = t;
                (0, n.setLayerDimensions)(e, {
                    rotation: t.rotation
                });
                this.#O();
                e.hidden = !1;
            }
            #O() {
                if (!this.#D) return;
                const t = this.div;
                for (const [e, i] of this.#D){
                    const s = t.querySelector(`[data-annotation-id="${e}"]`);
                    if (!s) continue;
                    const { firstChild: n } = s;
                    n ? "CANVAS" === n.nodeName ? n.replaceWith(i) : n.before(i) : s.append(i);
                }
                this.#D.clear();
            }
            getEditableAnnotations() {
                return Array.from(this.#I.values());
            }
            getEditableAnnotation(t) {
                return this.#I.get(t);
            }
        }
    },
    780: (t, e, i)=>{
        i.d(e, {
            AnnotationStorage: ()=>AnnotationStorage,
            PrintAnnotationStorage: ()=>PrintAnnotationStorage,
            SerializableEmpty: ()=>r
        });
        var s = i(266), n = i(115), a = i(825);
        const r = Object.freeze({
            map: null,
            hash: "",
            transfer: void 0
        });
        class AnnotationStorage {
            #B;
            #N;
            constructor(){
                this.#B = !1;
                this.#N = new Map;
                this.onSetModified = null;
                this.onResetModified = null;
                this.onAnnotationEditor = null;
            }
            getValue(t, e) {
                const i = this.#N.get(t);
                return void 0 === i ? e : Object.assign(e, i);
            }
            getRawValue(t) {
                return this.#N.get(t);
            }
            remove(t) {
                this.#N.delete(t);
                0 === this.#N.size && this.resetModified();
                if ("function" == typeof this.onAnnotationEditor) {
                    for (const t of this.#N.values())if (t instanceof n.AnnotationEditor) return;
                    this.onAnnotationEditor(null);
                }
            }
            setValue(t, e) {
                const i = this.#N.get(t);
                let s = !1;
                if (void 0 !== i) {
                    for (const [t, n] of Object.entries(e))if (i[t] !== n) {
                        s = !0;
                        i[t] = n;
                    }
                } else {
                    s = !0;
                    this.#N.set(t, e);
                }
                s && this.#U();
                e instanceof n.AnnotationEditor && "function" == typeof this.onAnnotationEditor && this.onAnnotationEditor(e.constructor._type);
            }
            has(t) {
                return this.#N.has(t);
            }
            getAll() {
                return this.#N.size > 0 ? (0, s.objectFromMap)(this.#N) : null;
            }
            setAll(t) {
                for (const [e, i] of Object.entries(t))this.setValue(e, i);
            }
            get size() {
                return this.#N.size;
            }
            #U() {
                if (!this.#B) {
                    this.#B = !0;
                    "function" == typeof this.onSetModified && this.onSetModified();
                }
            }
            resetModified() {
                if (this.#B) {
                    this.#B = !1;
                    "function" == typeof this.onResetModified && this.onResetModified();
                }
            }
            get print() {
                return new PrintAnnotationStorage(this);
            }
            get serializable() {
                if (0 === this.#N.size) return r;
                const t = new Map, e = new a.MurmurHash3_64, i = [], s = Object.create(null);
                let o = !1;
                for (const [i, a] of this.#N){
                    const r = a instanceof n.AnnotationEditor ? a.serialize(!1, s) : a;
                    if (r) {
                        t.set(i, r);
                        e.update(`${i}:${JSON.stringify(r)}`);
                        o ||= !!r.bitmap;
                    }
                }
                if (o) for (const e of t.values())e.bitmap && i.push(e.bitmap);
                return t.size > 0 ? {
                    map: t,
                    hash: e.hexdigest(),
                    transfer: i
                } : r;
            }
        }
        class PrintAnnotationStorage extends AnnotationStorage {
            #z;
            constructor(t){
                super();
                const { map: e, hash: i, transfer: s } = t.serializable, n = structuredClone(e, s ? {
                    transfer: s
                } : null);
                this.#z = {
                    map: n,
                    hash: i,
                    transfer: s
                };
            }
            get print() {
                (0, s.unreachable)("Should not call PrintAnnotationStorage.print");
            }
            get serializable() {
                return this.#z;
            }
        }
    },
    406: (t, e, i)=>{
        i.a(t, async (t, s)=>{
            try {
                i.d(e, {
                    PDFDataRangeTransport: ()=>PDFDataRangeTransport,
                    PDFWorker: ()=>PDFWorker,
                    build: ()=>P,
                    getDocument: ()=>getDocument,
                    version: ()=>M
                });
                var n = i(266), a = i(780), r = i(473), o = i(742), l = i(738), h = i(250), d = i(368), c = i(694), u = i(472), p = i(890), g = i(92), m = i(171), f = i(474), b = i(498), A = i(521), v = t([
                    l,
                    b
                ]);
                [l, b] = v.then ? (await v)() : v;
                const y = 65536, E = 100, _ = 5e3, w = n.isNodeJS ? l.NodeCanvasFactory : r.DOMCanvasFactory, x = n.isNodeJS ? l.NodeCMapReaderFactory : r.DOMCMapReaderFactory, C = n.isNodeJS ? l.NodeFilterFactory : r.DOMFilterFactory, S = n.isNodeJS ? l.NodeStandardFontDataFactory : r.DOMStandardFontDataFactory;
                function getDocument(t) {
                    "string" == typeof t || t instanceof URL ? t = {
                        url: t
                    } : (0, n.isArrayBuffer)(t) && (t = {
                        data: t
                    });
                    if ("object" != typeof t) throw new Error("Invalid parameter in getDocument, need parameter object.");
                    if (!t.url && !t.data && !t.range) throw new Error("Invalid parameter object: need either .data, .range or .url");
                    const e = new PDFDocumentLoadingTask, { docId: i } = e, s = t.url ? getUrlProp(t.url) : null, a = t.data ? getDataProp(t.data) : null, o = t.httpHeaders || null, l = !0 === t.withCredentials, h = t.password ?? null, u = t.range instanceof PDFDataRangeTransport ? t.range : null, p = Number.isInteger(t.rangeChunkSize) && t.rangeChunkSize > 0 ? t.rangeChunkSize : y;
                    let A = t.worker instanceof PDFWorker ? t.worker : null;
                    const v = t.verbosity, E = "string" != typeof t.docBaseUrl || (0, r.isDataScheme)(t.docBaseUrl) ? null : t.docBaseUrl, _ = "string" == typeof t.cMapUrl ? t.cMapUrl : null, T = !1 !== t.cMapPacked, M = t.CMapReaderFactory || x, P = "string" == typeof t.standardFontDataUrl ? t.standardFontDataUrl : null, F = t.StandardFontDataFactory || S, R = !0 !== t.stopAtErrors, k = Number.isInteger(t.maxImageSize) && t.maxImageSize > -1 ? t.maxImageSize : -1, D = !1 !== t.isEvalSupported, I = "boolean" == typeof t.isOffscreenCanvasSupported ? t.isOffscreenCanvasSupported : !n.isNodeJS, L = Number.isInteger(t.canvasMaxAreaInBytes) ? t.canvasMaxAreaInBytes : -1, O = "boolean" == typeof t.disableFontFace ? t.disableFontFace : n.isNodeJS, B = !0 === t.fontExtraProperties, N = !0 === t.enableXfa, U = t.ownerDocument || globalThis.document, z = !0 === t.disableRange, H = !0 === t.disableStream, j = !0 === t.disableAutoFetch, V = !0 === t.pdfBug, W = u ? u.length : t.length ?? NaN, q = "boolean" == typeof t.useSystemFonts ? t.useSystemFonts : !n.isNodeJS && !O, G = "boolean" == typeof t.useWorkerFetch ? t.useWorkerFetch : M === r.DOMCMapReaderFactory && F === r.DOMStandardFontDataFactory && _ && P && (0, r.isValidFetchUrl)(_, document.baseURI) && (0, r.isValidFetchUrl)(P, document.baseURI), $ = t.canvasFactory || new w({
                        ownerDocument: U
                    }), K = t.filterFactory || new C({
                        docId: i,
                        ownerDocument: U
                    });
                    (0, n.setVerbosityLevel)(v);
                    const X = {
                        canvasFactory: $,
                        filterFactory: K
                    };
                    if (!G) {
                        X.cMapReaderFactory = new M({
                            baseUrl: _,
                            isCompressed: T
                        });
                        X.standardFontDataFactory = new F({
                            baseUrl: P
                        });
                    }
                    if (!A) {
                        const t = {
                            verbosity: v,
                            port: d.GlobalWorkerOptions.workerPort
                        };
                        A = t.port ? PDFWorker.fromPort(t) : new PDFWorker(t);
                        e._worker = A;
                    }
                    const Y = {
                        docId: i,
                        apiVersion: "4.0.379",
                        data: a,
                        password: h,
                        disableAutoFetch: j,
                        rangeChunkSize: p,
                        length: W,
                        docBaseUrl: E,
                        enableXfa: N,
                        evaluatorOptions: {
                            maxImageSize: k,
                            disableFontFace: O,
                            ignoreErrors: R,
                            isEvalSupported: D,
                            isOffscreenCanvasSupported: I,
                            canvasMaxAreaInBytes: L,
                            fontExtraProperties: B,
                            useSystemFonts: q,
                            cMapUrl: G ? _ : null,
                            standardFontDataUrl: G ? P : null
                        }
                    }, J = {
                        ignoreErrors: R,
                        isEvalSupported: D,
                        disableFontFace: O,
                        fontExtraProperties: B,
                        enableXfa: N,
                        ownerDocument: U,
                        disableAutoFetch: j,
                        pdfBug: V,
                        styleElement: null
                    };
                    A.promise.then(function() {
                        if (e.destroyed) throw new Error("Loading aborted");
                        const t = _fetchDocument(A, Y), h = new Promise(function(t) {
                            let e;
                            if (u) e = new g.PDFDataTransportStream({
                                length: W,
                                initialData: u.initialData,
                                progressiveDone: u.progressiveDone,
                                contentDispositionFilename: u.contentDispositionFilename,
                                disableRange: z,
                                disableStream: H
                            }, u);
                            else if (!a) {
                                e = ((t)=>n.isNodeJS ? new b.PDFNodeStream(t) : (0, r.isValidFetchUrl)(t.url) ? new m.PDFFetchStream(t) : new f.PDFNetworkStream(t))({
                                    url: s,
                                    length: W,
                                    httpHeaders: o,
                                    withCredentials: l,
                                    rangeChunkSize: p,
                                    disableRange: z,
                                    disableStream: H
                                });
                            }
                            t(e);
                        });
                        return Promise.all([
                            t,
                            h
                        ]).then(function([t, s]) {
                            if (e.destroyed) throw new Error("Loading aborted");
                            const n = new c.MessageHandler(i, t, A.port), a = new WorkerTransport(n, e, s, J, X);
                            e._transport = a;
                            n.send("Ready", null);
                        });
                    }).catch(e._capability.reject);
                    return e;
                }
                async function _fetchDocument(t, e) {
                    if (t.destroyed) throw new Error("Worker was destroyed");
                    const i = await t.messageHandler.sendWithPromise("GetDocRequest", e, e.data ? [
                        e.data.buffer
                    ] : null);
                    if (t.destroyed) throw new Error("Worker was destroyed");
                    return i;
                }
                function getUrlProp(t) {
                    if (t instanceof URL) return t.href;
                    try {
                        return new URL(t, window.location).href;
                    } catch  {
                        if (n.isNodeJS && "string" == typeof t) return t;
                    }
                    throw new Error("Invalid PDF url data: either string or URL-object is expected in the url property.");
                }
                function getDataProp(t) {
                    if (n.isNodeJS && "undefined" != typeof Buffer && t instanceof Buffer) throw new Error("Please provide binary data as `Uint8Array`, rather than `Buffer`.");
                    if (t instanceof Uint8Array && t.byteLength === t.buffer.byteLength) return t;
                    if ("string" == typeof t) return (0, n.stringToBytes)(t);
                    if ("object" == typeof t && !isNaN(t?.length) || (0, n.isArrayBuffer)(t)) return new Uint8Array(t);
                    throw new Error("Invalid PDF binary data: either TypedArray, string, or array-like object is expected in the data property.");
                }
                class PDFDocumentLoadingTask {
                    static #H = 0;
                    constructor(){
                        this._capability = new n.PromiseCapability;
                        this._transport = null;
                        this._worker = null;
                        this.docId = "d" + PDFDocumentLoadingTask.#H++;
                        this.destroyed = !1;
                        this.onPassword = null;
                        this.onProgress = null;
                    }
                    get promise() {
                        return this._capability.promise;
                    }
                    async destroy() {
                        this.destroyed = !0;
                        try {
                            this._worker?.port && (this._worker._pendingDestroy = !0);
                            await (this._transport?.destroy());
                        } catch (t) {
                            this._worker?.port && delete this._worker._pendingDestroy;
                            throw t;
                        }
                        this._transport = null;
                        if (this._worker) {
                            this._worker.destroy();
                            this._worker = null;
                        }
                    }
                }
                class PDFDataRangeTransport {
                    constructor(t, e, i = !1, s = null){
                        this.length = t;
                        this.initialData = e;
                        this.progressiveDone = i;
                        this.contentDispositionFilename = s;
                        this._rangeListeners = [];
                        this._progressListeners = [];
                        this._progressiveReadListeners = [];
                        this._progressiveDoneListeners = [];
                        this._readyCapability = new n.PromiseCapability;
                    }
                    addRangeListener(t) {
                        this._rangeListeners.push(t);
                    }
                    addProgressListener(t) {
                        this._progressListeners.push(t);
                    }
                    addProgressiveReadListener(t) {
                        this._progressiveReadListeners.push(t);
                    }
                    addProgressiveDoneListener(t) {
                        this._progressiveDoneListeners.push(t);
                    }
                    onDataRange(t, e) {
                        for (const i of this._rangeListeners)i(t, e);
                    }
                    onDataProgress(t, e) {
                        this._readyCapability.promise.then(()=>{
                            for (const i of this._progressListeners)i(t, e);
                        });
                    }
                    onDataProgressiveRead(t) {
                        this._readyCapability.promise.then(()=>{
                            for (const e of this._progressiveReadListeners)e(t);
                        });
                    }
                    onDataProgressiveDone() {
                        this._readyCapability.promise.then(()=>{
                            for (const t of this._progressiveDoneListeners)t();
                        });
                    }
                    transportReady() {
                        this._readyCapability.resolve();
                    }
                    requestDataRange(t, e) {
                        (0, n.unreachable)("Abstract method PDFDataRangeTransport.requestDataRange");
                    }
                    abort() {}
                }
                class PDFDocumentProxy {
                    constructor(t, e){
                        this._pdfInfo = t;
                        this._transport = e;
                    }
                    get annotationStorage() {
                        return this._transport.annotationStorage;
                    }
                    get filterFactory() {
                        return this._transport.filterFactory;
                    }
                    get numPages() {
                        return this._pdfInfo.numPages;
                    }
                    get fingerprints() {
                        return this._pdfInfo.fingerprints;
                    }
                    get isPureXfa() {
                        return (0, n.shadow)(this, "isPureXfa", !!this._transport._htmlForXfa);
                    }
                    get allXfaHtml() {
                        return this._transport._htmlForXfa;
                    }
                    getPage(t) {
                        return this._transport.getPage(t);
                    }
                    getPageIndex(t) {
                        return this._transport.getPageIndex(t);
                    }
                    getDestinations() {
                        return this._transport.getDestinations();
                    }
                    getDestination(t) {
                        return this._transport.getDestination(t);
                    }
                    getPageLabels() {
                        return this._transport.getPageLabels();
                    }
                    getPageLayout() {
                        return this._transport.getPageLayout();
                    }
                    getPageMode() {
                        return this._transport.getPageMode();
                    }
                    getViewerPreferences() {
                        return this._transport.getViewerPreferences();
                    }
                    getOpenAction() {
                        return this._transport.getOpenAction();
                    }
                    getAttachments() {
                        return this._transport.getAttachments();
                    }
                    getJSActions() {
                        return this._transport.getDocJSActions();
                    }
                    getOutline() {
                        return this._transport.getOutline();
                    }
                    getOptionalContentConfig() {
                        return this._transport.getOptionalContentConfig();
                    }
                    getPermissions() {
                        return this._transport.getPermissions();
                    }
                    getMetadata() {
                        return this._transport.getMetadata();
                    }
                    getMarkInfo() {
                        return this._transport.getMarkInfo();
                    }
                    getData() {
                        return this._transport.getData();
                    }
                    saveDocument() {
                        return this._transport.saveDocument();
                    }
                    getDownloadInfo() {
                        return this._transport.downloadInfoCapability.promise;
                    }
                    cleanup(t = !1) {
                        return this._transport.startCleanup(t || this.isPureXfa);
                    }
                    destroy() {
                        return this.loadingTask.destroy();
                    }
                    get loadingParams() {
                        return this._transport.loadingParams;
                    }
                    get loadingTask() {
                        return this._transport.loadingTask;
                    }
                    getFieldObjects() {
                        return this._transport.getFieldObjects();
                    }
                    hasJSActions() {
                        return this._transport.hasJSActions();
                    }
                    getCalculationOrderIds() {
                        return this._transport.getCalculationOrderIds();
                    }
                }
                class PDFPageProxy {
                    #j;
                    #V;
                    constructor(t, e, i, s = !1){
                        this.#j = null;
                        this.#V = !1;
                        this._pageIndex = t;
                        this._pageInfo = e;
                        this._transport = i;
                        this._stats = s ? new r.StatTimer : null;
                        this._pdfBug = s;
                        this.commonObjs = i.commonObjs;
                        this.objs = new PDFObjects;
                        this._maybeCleanupAfterRender = !1;
                        this._intentStates = new Map;
                        this.destroyed = !1;
                    }
                    get pageNumber() {
                        return this._pageIndex + 1;
                    }
                    get rotate() {
                        return this._pageInfo.rotate;
                    }
                    get ref() {
                        return this._pageInfo.ref;
                    }
                    get userUnit() {
                        return this._pageInfo.userUnit;
                    }
                    get view() {
                        return this._pageInfo.view;
                    }
                    getViewport({ scale: t, rotation: e = this.rotate, offsetX: i = 0, offsetY: s = 0, dontFlip: n = !1 } = {}) {
                        return new r.PageViewport({
                            viewBox: this.view,
                            scale: t,
                            rotation: e,
                            offsetX: i,
                            offsetY: s,
                            dontFlip: n
                        });
                    }
                    getAnnotations({ intent: t = "display" } = {}) {
                        const e = this._transport.getRenderingIntent(t);
                        return this._transport.getAnnotations(this._pageIndex, e.renderingIntent);
                    }
                    getJSActions() {
                        return this._transport.getPageJSActions(this._pageIndex);
                    }
                    get filterFactory() {
                        return this._transport.filterFactory;
                    }
                    get isPureXfa() {
                        return (0, n.shadow)(this, "isPureXfa", !!this._transport._htmlForXfa);
                    }
                    async getXfa() {
                        return this._transport._htmlForXfa?.children[this._pageIndex] || null;
                    }
                    render({ canvasContext: t, viewport: e, intent: i = "display", annotationMode: s = n.AnnotationMode.ENABLE, transform: a = null, background: r = null, optionalContentConfigPromise: o = null, annotationCanvasMap: l = null, pageColors: h = null, printAnnotationStorage: d = null }) {
                        this._stats?.time("Overall");
                        const c = this._transport.getRenderingIntent(i, s, d);
                        this.#V = !1;
                        this.#W();
                        o || (o = this._transport.getOptionalContentConfig());
                        let u = this._intentStates.get(c.cacheKey);
                        if (!u) {
                            u = Object.create(null);
                            this._intentStates.set(c.cacheKey, u);
                        }
                        if (u.streamReaderCancelTimeout) {
                            clearTimeout(u.streamReaderCancelTimeout);
                            u.streamReaderCancelTimeout = null;
                        }
                        const p = !!(c.renderingIntent & n.RenderingIntentFlag.PRINT);
                        if (!u.displayReadyCapability) {
                            u.displayReadyCapability = new n.PromiseCapability;
                            u.operatorList = {
                                fnArray: [],
                                argsArray: [],
                                lastChunk: !1,
                                separateAnnots: null
                            };
                            this._stats?.time("Page Request");
                            this._pumpOperatorList(c);
                        }
                        const complete = (t)=>{
                            u.renderTasks.delete(g);
                            (this._maybeCleanupAfterRender || p) && (this.#V = !0);
                            this.#q(!p);
                            if (t) {
                                g.capability.reject(t);
                                this._abortOperatorList({
                                    intentState: u,
                                    reason: t instanceof Error ? t : new Error(t)
                                });
                            } else g.capability.resolve();
                            this._stats?.timeEnd("Rendering");
                            this._stats?.timeEnd("Overall");
                        }, g = new InternalRenderTask({
                            callback: complete,
                            params: {
                                canvasContext: t,
                                viewport: e,
                                transform: a,
                                background: r
                            },
                            objs: this.objs,
                            commonObjs: this.commonObjs,
                            annotationCanvasMap: l,
                            operatorList: u.operatorList,
                            pageIndex: this._pageIndex,
                            canvasFactory: this._transport.canvasFactory,
                            filterFactory: this._transport.filterFactory,
                            useRequestAnimationFrame: !p,
                            pdfBug: this._pdfBug,
                            pageColors: h
                        });
                        (u.renderTasks ||= new Set).add(g);
                        const m = g.task;
                        Promise.all([
                            u.displayReadyCapability.promise,
                            o
                        ]).then(([t, e])=>{
                            if (this.destroyed) complete();
                            else {
                                this._stats?.time("Rendering");
                                g.initializeGraphics({
                                    transparency: t,
                                    optionalContentConfig: e
                                });
                                g.operatorListChanged();
                            }
                        }).catch(complete);
                        return m;
                    }
                    getOperatorList({ intent: t = "display", annotationMode: e = n.AnnotationMode.ENABLE, printAnnotationStorage: i = null } = {}) {
                        const s = this._transport.getRenderingIntent(t, e, i, !0);
                        let a, r = this._intentStates.get(s.cacheKey);
                        if (!r) {
                            r = Object.create(null);
                            this._intentStates.set(s.cacheKey, r);
                        }
                        if (!r.opListReadCapability) {
                            a = Object.create(null);
                            a.operatorListChanged = function operatorListChanged() {
                                if (r.operatorList.lastChunk) {
                                    r.opListReadCapability.resolve(r.operatorList);
                                    r.renderTasks.delete(a);
                                }
                            };
                            r.opListReadCapability = new n.PromiseCapability;
                            (r.renderTasks ||= new Set).add(a);
                            r.operatorList = {
                                fnArray: [],
                                argsArray: [],
                                lastChunk: !1,
                                separateAnnots: null
                            };
                            this._stats?.time("Page Request");
                            this._pumpOperatorList(s);
                        }
                        return r.opListReadCapability.promise;
                    }
                    streamTextContent({ includeMarkedContent: t = !1, disableNormalization: e = !1 } = {}) {
                        return this._transport.messageHandler.sendWithStream("GetTextContent", {
                            pageIndex: this._pageIndex,
                            includeMarkedContent: !0 === t,
                            disableNormalization: !0 === e
                        }, {
                            highWaterMark: 100,
                            size: (t)=>t.items.length
                        });
                    }
                    getTextContent(t = {}) {
                        if (this._transport._htmlForXfa) return this.getXfa().then((t)=>A.XfaText.textContent(t));
                        const e = this.streamTextContent(t);
                        return new Promise(function(t, i) {
                            const s = e.getReader(), n = {
                                items: [],
                                styles: Object.create(null)
                            };
                            !function pump() {
                                s.read().then(function({ value: e, done: i }) {
                                    if (i) t(n);
                                    else {
                                        Object.assign(n.styles, e.styles);
                                        n.items.push(...e.items);
                                        pump();
                                    }
                                }, i);
                            }();
                        });
                    }
                    getStructTree() {
                        return this._transport.getStructTree(this._pageIndex);
                    }
                    _destroy() {
                        this.destroyed = !0;
                        const t = [];
                        for (const e of this._intentStates.values()){
                            this._abortOperatorList({
                                intentState: e,
                                reason: new Error("Page was destroyed."),
                                force: !0
                            });
                            if (!e.opListReadCapability) for (const i of e.renderTasks){
                                t.push(i.completed);
                                i.cancel();
                            }
                        }
                        this.objs.clear();
                        this.#V = !1;
                        this.#W();
                        return Promise.all(t);
                    }
                    cleanup(t = !1) {
                        this.#V = !0;
                        const e = this.#q(!1);
                        t && e && (this._stats &&= new r.StatTimer);
                        return e;
                    }
                    #q(t = !1) {
                        this.#W();
                        if (!this.#V || this.destroyed) return !1;
                        if (t) {
                            this.#j = setTimeout(()=>{
                                this.#j = null;
                                this.#q(!1);
                            }, _);
                            return !1;
                        }
                        for (const { renderTasks: t, operatorList: e } of this._intentStates.values())if (t.size > 0 || !e.lastChunk) return !1;
                        this._intentStates.clear();
                        this.objs.clear();
                        this.#V = !1;
                        return !0;
                    }
                    #W() {
                        if (this.#j) {
                            clearTimeout(this.#j);
                            this.#j = null;
                        }
                    }
                    _startRenderPage(t, e) {
                        const i = this._intentStates.get(e);
                        if (i) {
                            this._stats?.timeEnd("Page Request");
                            i.displayReadyCapability?.resolve(t);
                        }
                    }
                    _renderPageChunk(t, e) {
                        for(let i = 0, s = t.length; i < s; i++){
                            e.operatorList.fnArray.push(t.fnArray[i]);
                            e.operatorList.argsArray.push(t.argsArray[i]);
                        }
                        e.operatorList.lastChunk = t.lastChunk;
                        e.operatorList.separateAnnots = t.separateAnnots;
                        for (const t of e.renderTasks)t.operatorListChanged();
                        t.lastChunk && this.#q(!0);
                    }
                    _pumpOperatorList({ renderingIntent: t, cacheKey: e, annotationStorageSerializable: i }) {
                        const { map: s, transfer: n } = i, a = this._transport.messageHandler.sendWithStream("GetOperatorList", {
                            pageIndex: this._pageIndex,
                            intent: t,
                            cacheKey: e,
                            annotationStorage: s
                        }, n).getReader(), r = this._intentStates.get(e);
                        r.streamReader = a;
                        const pump = ()=>{
                            a.read().then(({ value: t, done: e })=>{
                                if (e) r.streamReader = null;
                                else if (!this._transport.destroyed) {
                                    this._renderPageChunk(t, r);
                                    pump();
                                }
                            }, (t)=>{
                                r.streamReader = null;
                                if (!this._transport.destroyed) {
                                    if (r.operatorList) {
                                        r.operatorList.lastChunk = !0;
                                        for (const t of r.renderTasks)t.operatorListChanged();
                                        this.#q(!0);
                                    }
                                    if (r.displayReadyCapability) r.displayReadyCapability.reject(t);
                                    else {
                                        if (!r.opListReadCapability) throw t;
                                        r.opListReadCapability.reject(t);
                                    }
                                }
                            });
                        };
                        pump();
                    }
                    _abortOperatorList({ intentState: t, reason: e, force: i = !1 }) {
                        if (t.streamReader) {
                            if (t.streamReaderCancelTimeout) {
                                clearTimeout(t.streamReaderCancelTimeout);
                                t.streamReaderCancelTimeout = null;
                            }
                            if (!i) {
                                if (t.renderTasks.size > 0) return;
                                if (e instanceof r.RenderingCancelledException) {
                                    let i = E;
                                    e.extraDelay > 0 && e.extraDelay < 1e3 && (i += e.extraDelay);
                                    t.streamReaderCancelTimeout = setTimeout(()=>{
                                        t.streamReaderCancelTimeout = null;
                                        this._abortOperatorList({
                                            intentState: t,
                                            reason: e,
                                            force: !0
                                        });
                                    }, i);
                                    return;
                                }
                            }
                            t.streamReader.cancel(new n.AbortException(e.message)).catch(()=>{});
                            t.streamReader = null;
                            if (!this._transport.destroyed) {
                                for (const [e, i] of this._intentStates)if (i === t) {
                                    this._intentStates.delete(e);
                                    break;
                                }
                                this.cleanup();
                            }
                        }
                    }
                    get stats() {
                        return this._stats;
                    }
                }
                class LoopbackPort {
                    #G;
                    #$;
                    postMessage(t, e) {
                        const i = {
                            data: structuredClone(t, e ? {
                                transfer: e
                            } : null)
                        };
                        this.#$.then(()=>{
                            for (const t of this.#G)t.call(this, i);
                        });
                    }
                    addEventListener(t, e) {
                        this.#G.add(e);
                    }
                    removeEventListener(t, e) {
                        this.#G.delete(e);
                    }
                    terminate() {
                        this.#G.clear();
                    }
                    constructor(){
                        this.#G = new Set;
                        this.#$ = Promise.resolve();
                    }
                }
                const T = {
                    isWorkerDisabled: !1,
                    fakeWorkerId: 0
                };
                if (n.isNodeJS) {
                    T.isWorkerDisabled = !0;
                    d.GlobalWorkerOptions.workerSrc ||= "./pdf.worker.mjs";
                }
                T.isSameOrigin = function(t, e) {
                    let i;
                    try {
                        i = new URL(t);
                        if (!i.origin || "null" === i.origin) return !1;
                    } catch  {
                        return !1;
                    }
                    const s = new URL(e, i);
                    return i.origin === s.origin;
                };
                T.createCDNWrapper = function(t) {
                    const e = `await import("${t}");`;
                    return URL.createObjectURL(new Blob([
                        e
                    ], {
                        type: "text/javascript"
                    }));
                };
                class PDFWorker {
                    static #K;
                    constructor({ name: t = null, port: e = null, verbosity: i = (0, n.getVerbosityLevel)() } = {}){
                        this.name = t;
                        this.destroyed = !1;
                        this.verbosity = i;
                        this._readyCapability = new n.PromiseCapability;
                        this._port = null;
                        this._webWorker = null;
                        this._messageHandler = null;
                        if (e) {
                            if (PDFWorker.#K?.has(e)) throw new Error("Cannot use more than one PDFWorker per port.");
                            (PDFWorker.#K ||= new WeakMap).set(e, this);
                            this._initializeFromPort(e);
                        } else this._initialize();
                    }
                    get promise() {
                        return this._readyCapability.promise;
                    }
                    get port() {
                        return this._port;
                    }
                    get messageHandler() {
                        return this._messageHandler;
                    }
                    _initializeFromPort(t) {
                        this._port = t;
                        this._messageHandler = new c.MessageHandler("main", "worker", t);
                        this._messageHandler.on("ready", function() {});
                        this._readyCapability.resolve();
                        this._messageHandler.send("configure", {
                            verbosity: this.verbosity
                        });
                    }
                    _initialize() {
                        if (!T.isWorkerDisabled && !PDFWorker.#X) {
                            let { workerSrc: t } = PDFWorker;
                            try {
                                T.isSameOrigin(window.location.href, t) || (t = T.createCDNWrapper(new URL(t, window.location).href));
                                const e = new Worker(t, {
                                    type: "module"
                                }), i = new c.MessageHandler("main", "worker", e), terminateEarly = ()=>{
                                    e.removeEventListener("error", onWorkerError);
                                    i.destroy();
                                    e.terminate();
                                    this.destroyed ? this._readyCapability.reject(new Error("Worker was destroyed")) : this._setupFakeWorker();
                                }, onWorkerError = ()=>{
                                    this._webWorker || terminateEarly();
                                };
                                e.addEventListener("error", onWorkerError);
                                i.on("test", (t)=>{
                                    e.removeEventListener("error", onWorkerError);
                                    if (this.destroyed) terminateEarly();
                                    else if (t) {
                                        this._messageHandler = i;
                                        this._port = e;
                                        this._webWorker = e;
                                        this._readyCapability.resolve();
                                        i.send("configure", {
                                            verbosity: this.verbosity
                                        });
                                    } else {
                                        this._setupFakeWorker();
                                        i.destroy();
                                        e.terminate();
                                    }
                                });
                                i.on("ready", (t)=>{
                                    e.removeEventListener("error", onWorkerError);
                                    if (this.destroyed) terminateEarly();
                                    else try {
                                        sendTest();
                                    } catch  {
                                        this._setupFakeWorker();
                                    }
                                });
                                const sendTest = ()=>{
                                    const t = new Uint8Array;
                                    i.send("test", t, [
                                        t.buffer
                                    ]);
                                };
                                sendTest();
                                return;
                            } catch  {
                                (0, n.info)("The worker has been disabled.");
                            }
                        }
                        this._setupFakeWorker();
                    }
                    _setupFakeWorker() {
                        if (!T.isWorkerDisabled) {
                            (0, n.warn)("Setting up fake worker.");
                            T.isWorkerDisabled = !0;
                        }
                        PDFWorker._setupFakeWorkerGlobal.then((t)=>{
                            if (this.destroyed) {
                                this._readyCapability.reject(new Error("Worker was destroyed"));
                                return;
                            }
                            const e = new LoopbackPort;
                            this._port = e;
                            const i = "fake" + T.fakeWorkerId++, s = new c.MessageHandler(i + "_worker", i, e);
                            t.setup(s, e);
                            const n = new c.MessageHandler(i, i + "_worker", e);
                            this._messageHandler = n;
                            this._readyCapability.resolve();
                            n.send("configure", {
                                verbosity: this.verbosity
                            });
                        }).catch((t)=>{
                            this._readyCapability.reject(new Error(`Setting up fake worker failed: "${t.message}".`));
                        });
                    }
                    destroy() {
                        this.destroyed = !0;
                        if (this._webWorker) {
                            this._webWorker.terminate();
                            this._webWorker = null;
                        }
                        PDFWorker.#K?.delete(this._port);
                        this._port = null;
                        if (this._messageHandler) {
                            this._messageHandler.destroy();
                            this._messageHandler = null;
                        }
                    }
                    static fromPort(t) {
                        if (!t?.port) throw new Error("PDFWorker.fromPort - invalid method signature.");
                        const e = this.#K?.get(t.port);
                        if (e) {
                            if (e._pendingDestroy) throw new Error("PDFWorker.fromPort - the worker is being destroyed.\nPlease remember to await `PDFDocumentLoadingTask.destroy()`-calls.");
                            return e;
                        }
                        return new PDFWorker(t);
                    }
                    static get workerSrc() {
                        if (d.GlobalWorkerOptions.workerSrc) return d.GlobalWorkerOptions.workerSrc;
                        throw new Error('No "GlobalWorkerOptions.workerSrc" specified.');
                    }
                    static get #X() {
                        try {
                            return globalThis.pdfjsWorker?.WorkerMessageHandler || null;
                        } catch  {
                            return null;
                        }
                    }
                    static get _setupFakeWorkerGlobal() {
                        return (0, n.shadow)(this, "_setupFakeWorkerGlobal", (async ()=>{
                            if (this.#X) return this.#X;
                            return (await __webpack_require__(2751)(this.workerSrc)).WorkerMessageHandler;
                        })());
                    }
                }
                class WorkerTransport {
                    #Y;
                    #J;
                    #Q;
                    #Z;
                    constructor(t, e, i, s, a){
                        this.#Y = new Map;
                        this.#J = new Map;
                        this.#Q = new Map;
                        this.#Z = null;
                        this.messageHandler = t;
                        this.loadingTask = e;
                        this.commonObjs = new PDFObjects;
                        this.fontLoader = new o.FontLoader({
                            ownerDocument: s.ownerDocument,
                            styleElement: s.styleElement
                        });
                        this._params = s;
                        this.canvasFactory = a.canvasFactory;
                        this.filterFactory = a.filterFactory;
                        this.cMapReaderFactory = a.cMapReaderFactory;
                        this.standardFontDataFactory = a.standardFontDataFactory;
                        this.destroyed = !1;
                        this.destroyCapability = null;
                        this._networkStream = i;
                        this._fullReader = null;
                        this._lastProgress = null;
                        this.downloadInfoCapability = new n.PromiseCapability;
                        this.setupMessageHandler();
                    }
                    #tt(t, e = null) {
                        const i = this.#Y.get(t);
                        if (i) return i;
                        const s = this.messageHandler.sendWithPromise(t, e);
                        this.#Y.set(t, s);
                        return s;
                    }
                    get annotationStorage() {
                        return (0, n.shadow)(this, "annotationStorage", new a.AnnotationStorage);
                    }
                    getRenderingIntent(t, e = n.AnnotationMode.ENABLE, i = null, s = !1) {
                        let r = n.RenderingIntentFlag.DISPLAY, o = a.SerializableEmpty;
                        switch(t){
                            case "any":
                                r = n.RenderingIntentFlag.ANY;
                                break;
                            case "display":
                                break;
                            case "print":
                                r = n.RenderingIntentFlag.PRINT;
                                break;
                            default:
                                (0, n.warn)(`getRenderingIntent - invalid intent: ${t}`);
                        }
                        switch(e){
                            case n.AnnotationMode.DISABLE:
                                r += n.RenderingIntentFlag.ANNOTATIONS_DISABLE;
                                break;
                            case n.AnnotationMode.ENABLE:
                                break;
                            case n.AnnotationMode.ENABLE_FORMS:
                                r += n.RenderingIntentFlag.ANNOTATIONS_FORMS;
                                break;
                            case n.AnnotationMode.ENABLE_STORAGE:
                                r += n.RenderingIntentFlag.ANNOTATIONS_STORAGE;
                                o = (r & n.RenderingIntentFlag.PRINT && i instanceof a.PrintAnnotationStorage ? i : this.annotationStorage).serializable;
                                break;
                            default:
                                (0, n.warn)(`getRenderingIntent - invalid annotationMode: ${e}`);
                        }
                        s && (r += n.RenderingIntentFlag.OPLIST);
                        return {
                            renderingIntent: r,
                            cacheKey: `${r}_${o.hash}`,
                            annotationStorageSerializable: o
                        };
                    }
                    destroy() {
                        if (this.destroyCapability) return this.destroyCapability.promise;
                        this.destroyed = !0;
                        this.destroyCapability = new n.PromiseCapability;
                        this.#Z?.reject(new Error("Worker was destroyed during onPassword callback"));
                        const t = [];
                        for (const e of this.#J.values())t.push(e._destroy());
                        this.#J.clear();
                        this.#Q.clear();
                        this.hasOwnProperty("annotationStorage") && this.annotationStorage.resetModified();
                        const e = this.messageHandler.sendWithPromise("Terminate", null);
                        t.push(e);
                        Promise.all(t).then(()=>{
                            this.commonObjs.clear();
                            this.fontLoader.clear();
                            this.#Y.clear();
                            this.filterFactory.destroy();
                            this._networkStream?.cancelAllRequests(new n.AbortException("Worker was terminated."));
                            if (this.messageHandler) {
                                this.messageHandler.destroy();
                                this.messageHandler = null;
                            }
                            this.destroyCapability.resolve();
                        }, this.destroyCapability.reject);
                        return this.destroyCapability.promise;
                    }
                    setupMessageHandler() {
                        const { messageHandler: t, loadingTask: e } = this;
                        t.on("GetReader", (t, e)=>{
                            (0, n.assert)(this._networkStream, "GetReader - no `IPDFStream` instance available.");
                            this._fullReader = this._networkStream.getFullReader();
                            this._fullReader.onProgress = (t)=>{
                                this._lastProgress = {
                                    loaded: t.loaded,
                                    total: t.total
                                };
                            };
                            e.onPull = ()=>{
                                this._fullReader.read().then(function({ value: t, done: i }) {
                                    if (i) e.close();
                                    else {
                                        (0, n.assert)(t instanceof ArrayBuffer, "GetReader - expected an ArrayBuffer.");
                                        e.enqueue(new Uint8Array(t), 1, [
                                            t
                                        ]);
                                    }
                                }).catch((t)=>{
                                    e.error(t);
                                });
                            };
                            e.onCancel = (t)=>{
                                this._fullReader.cancel(t);
                                e.ready.catch((t)=>{
                                    if (!this.destroyed) throw t;
                                });
                            };
                        });
                        t.on("ReaderHeadersReady", (t)=>{
                            const i = new n.PromiseCapability, s = this._fullReader;
                            s.headersReady.then(()=>{
                                if (!s.isStreamingSupported || !s.isRangeSupported) {
                                    this._lastProgress && e.onProgress?.(this._lastProgress);
                                    s.onProgress = (t)=>{
                                        e.onProgress?.({
                                            loaded: t.loaded,
                                            total: t.total
                                        });
                                    };
                                }
                                i.resolve({
                                    isStreamingSupported: s.isStreamingSupported,
                                    isRangeSupported: s.isRangeSupported,
                                    contentLength: s.contentLength
                                });
                            }, i.reject);
                            return i.promise;
                        });
                        t.on("GetRangeReader", (t, e)=>{
                            (0, n.assert)(this._networkStream, "GetRangeReader - no `IPDFStream` instance available.");
                            const i = this._networkStream.getRangeReader(t.begin, t.end);
                            if (i) {
                                e.onPull = ()=>{
                                    i.read().then(function({ value: t, done: i }) {
                                        if (i) e.close();
                                        else {
                                            (0, n.assert)(t instanceof ArrayBuffer, "GetRangeReader - expected an ArrayBuffer.");
                                            e.enqueue(new Uint8Array(t), 1, [
                                                t
                                            ]);
                                        }
                                    }).catch((t)=>{
                                        e.error(t);
                                    });
                                };
                                e.onCancel = (t)=>{
                                    i.cancel(t);
                                    e.ready.catch((t)=>{
                                        if (!this.destroyed) throw t;
                                    });
                                };
                            } else e.close();
                        });
                        t.on("GetDoc", ({ pdfInfo: t })=>{
                            this._numPages = t.numPages;
                            this._htmlForXfa = t.htmlForXfa;
                            delete t.htmlForXfa;
                            e._capability.resolve(new PDFDocumentProxy(t, this));
                        });
                        t.on("DocException", function(t) {
                            let i;
                            switch(t.name){
                                case "PasswordException":
                                    i = new n.PasswordException(t.message, t.code);
                                    break;
                                case "InvalidPDFException":
                                    i = new n.InvalidPDFException(t.message);
                                    break;
                                case "MissingPDFException":
                                    i = new n.MissingPDFException(t.message);
                                    break;
                                case "UnexpectedResponseException":
                                    i = new n.UnexpectedResponseException(t.message, t.status);
                                    break;
                                case "UnknownErrorException":
                                    i = new n.UnknownErrorException(t.message, t.details);
                                    break;
                                default:
                                    (0, n.unreachable)("DocException - expected a valid Error.");
                            }
                            e._capability.reject(i);
                        });
                        t.on("PasswordRequest", (t)=>{
                            this.#Z = new n.PromiseCapability;
                            if (e.onPassword) {
                                const updatePassword = (t)=>{
                                    t instanceof Error ? this.#Z.reject(t) : this.#Z.resolve({
                                        password: t
                                    });
                                };
                                try {
                                    e.onPassword(updatePassword, t.code);
                                } catch (t) {
                                    this.#Z.reject(t);
                                }
                            } else this.#Z.reject(new n.PasswordException(t.message, t.code));
                            return this.#Z.promise;
                        });
                        t.on("DataLoaded", (t)=>{
                            e.onProgress?.({
                                loaded: t.length,
                                total: t.length
                            });
                            this.downloadInfoCapability.resolve(t);
                        });
                        t.on("StartRenderPage", (t)=>{
                            if (this.destroyed) return;
                            this.#J.get(t.pageIndex)._startRenderPage(t.transparency, t.cacheKey);
                        });
                        t.on("commonobj", ([e, i, s])=>{
                            if (this.destroyed) return null;
                            if (this.commonObjs.has(e)) return null;
                            switch(i){
                                case "Font":
                                    const a = this._params;
                                    if ("error" in s) {
                                        const t = s.error;
                                        (0, n.warn)(`Error during font loading: ${t}`);
                                        this.commonObjs.resolve(e, t);
                                        break;
                                    }
                                    const r = a.pdfBug && globalThis.FontInspector?.enabled ? (t, e)=>globalThis.FontInspector.fontAdded(t, e) : null, l = new o.FontFaceObject(s, {
                                        isEvalSupported: a.isEvalSupported,
                                        disableFontFace: a.disableFontFace,
                                        ignoreErrors: a.ignoreErrors,
                                        inspectFont: r
                                    });
                                    this.fontLoader.bind(l).catch((i)=>t.sendWithPromise("FontFallback", {
                                            id: e
                                        })).finally(()=>{
                                        !a.fontExtraProperties && l.data && (l.data = null);
                                        this.commonObjs.resolve(e, l);
                                    });
                                    break;
                                case "CopyLocalImage":
                                    const { imageRef: h } = s;
                                    (0, n.assert)(h, "The imageRef must be defined.");
                                    for (const t of this.#J.values())for (const [, i] of t.objs)if (i.ref === h) {
                                        if (!i.dataLen) return null;
                                        this.commonObjs.resolve(e, structuredClone(i));
                                        return i.dataLen;
                                    }
                                    break;
                                case "FontPath":
                                case "Image":
                                case "Pattern":
                                    this.commonObjs.resolve(e, s);
                                    break;
                                default:
                                    throw new Error(`Got unknown common object type ${i}`);
                            }
                            return null;
                        });
                        t.on("obj", ([t, e, i, s])=>{
                            if (this.destroyed) return;
                            const a = this.#J.get(e);
                            if (!a.objs.has(t)) if (0 !== a._intentStates.size) switch(i){
                                case "Image":
                                    a.objs.resolve(t, s);
                                    s?.dataLen > n.MAX_IMAGE_SIZE_TO_CACHE && (a._maybeCleanupAfterRender = !0);
                                    break;
                                case "Pattern":
                                    a.objs.resolve(t, s);
                                    break;
                                default:
                                    throw new Error(`Got unknown object type ${i}`);
                            }
                            else s?.bitmap?.close();
                        });
                        t.on("DocProgress", (t)=>{
                            this.destroyed || e.onProgress?.({
                                loaded: t.loaded,
                                total: t.total
                            });
                        });
                        t.on("FetchBuiltInCMap", (t)=>this.destroyed ? Promise.reject(new Error("Worker was destroyed.")) : this.cMapReaderFactory ? this.cMapReaderFactory.fetch(t) : Promise.reject(new Error("CMapReaderFactory not initialized, see the `useWorkerFetch` parameter.")));
                        t.on("FetchStandardFontData", (t)=>this.destroyed ? Promise.reject(new Error("Worker was destroyed.")) : this.standardFontDataFactory ? this.standardFontDataFactory.fetch(t) : Promise.reject(new Error("StandardFontDataFactory not initialized, see the `useWorkerFetch` parameter.")));
                    }
                    getData() {
                        return this.messageHandler.sendWithPromise("GetData", null);
                    }
                    saveDocument() {
                        this.annotationStorage.size <= 0 && (0, n.warn)("saveDocument called while `annotationStorage` is empty, please use the getData-method instead.");
                        const { map: t, transfer: e } = this.annotationStorage.serializable;
                        return this.messageHandler.sendWithPromise("SaveDocument", {
                            isPureXfa: !!this._htmlForXfa,
                            numPages: this._numPages,
                            annotationStorage: t,
                            filename: this._fullReader?.filename ?? null
                        }, e).finally(()=>{
                            this.annotationStorage.resetModified();
                        });
                    }
                    getPage(t) {
                        if (!Number.isInteger(t) || t <= 0 || t > this._numPages) return Promise.reject(new Error("Invalid page request."));
                        const e = t - 1, i = this.#Q.get(e);
                        if (i) return i;
                        const s = this.messageHandler.sendWithPromise("GetPage", {
                            pageIndex: e
                        }).then((t)=>{
                            if (this.destroyed) throw new Error("Transport destroyed");
                            const i = new PDFPageProxy(e, t, this, this._params.pdfBug);
                            this.#J.set(e, i);
                            return i;
                        });
                        this.#Q.set(e, s);
                        return s;
                    }
                    getPageIndex(t) {
                        return "object" != typeof t || null === t || !Number.isInteger(t.num) || t.num < 0 || !Number.isInteger(t.gen) || t.gen < 0 ? Promise.reject(new Error("Invalid pageIndex request.")) : this.messageHandler.sendWithPromise("GetPageIndex", {
                            num: t.num,
                            gen: t.gen
                        });
                    }
                    getAnnotations(t, e) {
                        return this.messageHandler.sendWithPromise("GetAnnotations", {
                            pageIndex: t,
                            intent: e
                        });
                    }
                    getFieldObjects() {
                        return this.#tt("GetFieldObjects");
                    }
                    hasJSActions() {
                        return this.#tt("HasJSActions");
                    }
                    getCalculationOrderIds() {
                        return this.messageHandler.sendWithPromise("GetCalculationOrderIds", null);
                    }
                    getDestinations() {
                        return this.messageHandler.sendWithPromise("GetDestinations", null);
                    }
                    getDestination(t) {
                        return "string" != typeof t ? Promise.reject(new Error("Invalid destination request.")) : this.messageHandler.sendWithPromise("GetDestination", {
                            id: t
                        });
                    }
                    getPageLabels() {
                        return this.messageHandler.sendWithPromise("GetPageLabels", null);
                    }
                    getPageLayout() {
                        return this.messageHandler.sendWithPromise("GetPageLayout", null);
                    }
                    getPageMode() {
                        return this.messageHandler.sendWithPromise("GetPageMode", null);
                    }
                    getViewerPreferences() {
                        return this.messageHandler.sendWithPromise("GetViewerPreferences", null);
                    }
                    getOpenAction() {
                        return this.messageHandler.sendWithPromise("GetOpenAction", null);
                    }
                    getAttachments() {
                        return this.messageHandler.sendWithPromise("GetAttachments", null);
                    }
                    getDocJSActions() {
                        return this.#tt("GetDocJSActions");
                    }
                    getPageJSActions(t) {
                        return this.messageHandler.sendWithPromise("GetPageJSActions", {
                            pageIndex: t
                        });
                    }
                    getStructTree(t) {
                        return this.messageHandler.sendWithPromise("GetStructTree", {
                            pageIndex: t
                        });
                    }
                    getOutline() {
                        return this.messageHandler.sendWithPromise("GetOutline", null);
                    }
                    getOptionalContentConfig() {
                        return this.messageHandler.sendWithPromise("GetOptionalContentConfig", null).then((t)=>new p.OptionalContentConfig(t));
                    }
                    getPermissions() {
                        return this.messageHandler.sendWithPromise("GetPermissions", null);
                    }
                    getMetadata() {
                        const t = "GetMetadata", e = this.#Y.get(t);
                        if (e) return e;
                        const i = this.messageHandler.sendWithPromise(t, null).then((t)=>({
                                info: t[0],
                                metadata: t[1] ? new u.Metadata(t[1]) : null,
                                contentDispositionFilename: this._fullReader?.filename ?? null,
                                contentLength: this._fullReader?.contentLength ?? null
                            }));
                        this.#Y.set(t, i);
                        return i;
                    }
                    getMarkInfo() {
                        return this.messageHandler.sendWithPromise("GetMarkInfo", null);
                    }
                    async startCleanup(t = !1) {
                        if (!this.destroyed) {
                            await this.messageHandler.sendWithPromise("Cleanup", null);
                            for (const t of this.#J.values()){
                                if (!t.cleanup()) throw new Error(`startCleanup: Page ${t.pageNumber} is currently rendering.`);
                            }
                            this.commonObjs.clear();
                            t || this.fontLoader.clear();
                            this.#Y.clear();
                            this.filterFactory.destroy(!0);
                        }
                    }
                    get loadingParams() {
                        const { disableAutoFetch: t, enableXfa: e } = this._params;
                        return (0, n.shadow)(this, "loadingParams", {
                            disableAutoFetch: t,
                            enableXfa: e
                        });
                    }
                }
                class PDFObjects {
                    #et;
                    #it(t) {
                        return this.#et[t] ||= {
                            capability: new n.PromiseCapability,
                            data: null
                        };
                    }
                    get(t, e = null) {
                        if (e) {
                            const i = this.#it(t);
                            i.capability.promise.then(()=>e(i.data));
                            return null;
                        }
                        const i = this.#et[t];
                        if (!i?.capability.settled) throw new Error(`Requesting object that isn't resolved yet ${t}.`);
                        return i.data;
                    }
                    has(t) {
                        const e = this.#et[t];
                        return e?.capability.settled ?? !1;
                    }
                    resolve(t, e = null) {
                        const i = this.#it(t);
                        i.data = e;
                        i.capability.resolve();
                    }
                    clear() {
                        for(const t in this.#et){
                            const { data: e } = this.#et[t];
                            e?.bitmap?.close();
                        }
                        this.#et = Object.create(null);
                    }
                    *[Symbol.iterator]() {
                        for(const t in this.#et){
                            const { capability: e, data: i } = this.#et[t];
                            e.settled && (yield [
                                t,
                                i
                            ]);
                        }
                    }
                    constructor(){
                        this.#et = Object.create(null);
                    }
                }
                class RenderTask {
                    #st;
                    constructor(t){
                        this.#st = null;
                        this.#st = t;
                        this.onContinue = null;
                    }
                    get promise() {
                        return this.#st.capability.promise;
                    }
                    cancel(t = 0) {
                        this.#st.cancel(null, t);
                    }
                    get separateAnnots() {
                        const { separateAnnots: t } = this.#st.operatorList;
                        if (!t) return !1;
                        const { annotationCanvasMap: e } = this.#st;
                        return t.form || t.canvas && e?.size > 0;
                    }
                }
                class InternalRenderTask {
                    static #nt = new WeakSet;
                    constructor({ callback: t, params: e, objs: i, commonObjs: s, annotationCanvasMap: a, operatorList: r, pageIndex: o, canvasFactory: l, filterFactory: h, useRequestAnimationFrame: d = !1, pdfBug: c = !1, pageColors: u = null }){
                        this.callback = t;
                        this.params = e;
                        this.objs = i;
                        this.commonObjs = s;
                        this.annotationCanvasMap = a;
                        this.operatorListIdx = null;
                        this.operatorList = r;
                        this._pageIndex = o;
                        this.canvasFactory = l;
                        this.filterFactory = h;
                        this._pdfBug = c;
                        this.pageColors = u;
                        this.running = !1;
                        this.graphicsReadyCallback = null;
                        this.graphicsReady = !1;
                        this._useRequestAnimationFrame = !0 === d && "undefined" != "undefined";
                        this.cancelled = !1;
                        this.capability = new n.PromiseCapability;
                        this.task = new RenderTask(this);
                        this._cancelBound = this.cancel.bind(this);
                        this._continueBound = this._continue.bind(this);
                        this._scheduleNextBound = this._scheduleNext.bind(this);
                        this._nextBound = this._next.bind(this);
                        this._canvas = e.canvasContext.canvas;
                    }
                    get completed() {
                        return this.capability.promise.catch(function() {});
                    }
                    initializeGraphics({ transparency: t = !1, optionalContentConfig: e }) {
                        if (this.cancelled) return;
                        if (this._canvas) {
                            if (InternalRenderTask.#nt.has(this._canvas)) throw new Error("Cannot use the same canvas during multiple render() operations. Use different canvas or ensure previous operations were cancelled or completed.");
                            InternalRenderTask.#nt.add(this._canvas);
                        }
                        if (this._pdfBug && globalThis.StepperManager?.enabled) {
                            this.stepper = globalThis.StepperManager.create(this._pageIndex);
                            this.stepper.init(this.operatorList);
                            this.stepper.nextBreakPoint = this.stepper.getNextBreakPoint();
                        }
                        const { canvasContext: i, viewport: s, transform: n, background: a } = this.params;
                        this.gfx = new h.CanvasGraphics(i, this.commonObjs, this.objs, this.canvasFactory, this.filterFactory, {
                            optionalContentConfig: e
                        }, this.annotationCanvasMap, this.pageColors);
                        this.gfx.beginDrawing({
                            transform: n,
                            viewport: s,
                            transparency: t,
                            background: a
                        });
                        this.operatorListIdx = 0;
                        this.graphicsReady = !0;
                        this.graphicsReadyCallback?.();
                    }
                    cancel(t = null, e = 0) {
                        this.running = !1;
                        this.cancelled = !0;
                        this.gfx?.endDrawing();
                        InternalRenderTask.#nt.delete(this._canvas);
                        this.callback(t || new r.RenderingCancelledException(`Rendering cancelled, page ${this._pageIndex + 1}`, e));
                    }
                    operatorListChanged() {
                        if (this.graphicsReady) {
                            this.stepper?.updateOperatorList(this.operatorList);
                            this.running || this._continue();
                        } else this.graphicsReadyCallback ||= this._continueBound;
                    }
                    _continue() {
                        this.running = !0;
                        this.cancelled || (this.task.onContinue ? this.task.onContinue(this._scheduleNextBound) : this._scheduleNext());
                    }
                    _scheduleNext() {
                        this._useRequestAnimationFrame ? window.requestAnimationFrame(()=>{
                            this._nextBound().catch(this._cancelBound);
                        }) : Promise.resolve().then(this._nextBound).catch(this._cancelBound);
                    }
                    async _next() {
                        if (!this.cancelled) {
                            this.operatorListIdx = this.gfx.executeOperatorList(this.operatorList, this.operatorListIdx, this._continueBound, this.stepper);
                            if (this.operatorListIdx === this.operatorList.argsArray.length) {
                                this.running = !1;
                                if (this.operatorList.lastChunk) {
                                    this.gfx.endDrawing();
                                    InternalRenderTask.#nt.delete(this._canvas);
                                    this.callback();
                                }
                            }
                        }
                    }
                }
                const M = "4.0.379", P = "9e14d04fd";
                s();
            } catch (F) {
                s(F);
            }
        });
    },
    822: (t, e, i)=>{
        i.d(e, {
            BaseCMapReaderFactory: ()=>BaseCMapReaderFactory,
            BaseCanvasFactory: ()=>BaseCanvasFactory,
            BaseFilterFactory: ()=>BaseFilterFactory,
            BaseSVGFactory: ()=>BaseSVGFactory,
            BaseStandardFontDataFactory: ()=>BaseStandardFontDataFactory
        });
        var s = i(266);
        class BaseFilterFactory {
            constructor(){
                this.constructor === BaseFilterFactory && (0, s.unreachable)("Cannot initialize BaseFilterFactory.");
            }
            addFilter(t) {
                return "none";
            }
            addHCMFilter(t, e) {
                return "none";
            }
            addHighlightHCMFilter(t, e, i, s) {
                return "none";
            }
            destroy(t = !1) {}
        }
        class BaseCanvasFactory {
            constructor(){
                this.constructor === BaseCanvasFactory && (0, s.unreachable)("Cannot initialize BaseCanvasFactory.");
            }
            create(t, e) {
                if (t <= 0 || e <= 0) throw new Error("Invalid canvas size");
                const i = this._createCanvas(t, e);
                return {
                    canvas: i,
                    context: i.getContext("2d")
                };
            }
            reset(t, e, i) {
                if (!t.canvas) throw new Error("Canvas is not specified");
                if (e <= 0 || i <= 0) throw new Error("Invalid canvas size");
                t.canvas.width = e;
                t.canvas.height = i;
            }
            destroy(t) {
                if (!t.canvas) throw new Error("Canvas is not specified");
                t.canvas.width = 0;
                t.canvas.height = 0;
                t.canvas = null;
                t.context = null;
            }
            _createCanvas(t, e) {
                (0, s.unreachable)("Abstract method `_createCanvas` called.");
            }
        }
        class BaseCMapReaderFactory {
            constructor({ baseUrl: t = null, isCompressed: e = !0 }){
                this.constructor === BaseCMapReaderFactory && (0, s.unreachable)("Cannot initialize BaseCMapReaderFactory.");
                this.baseUrl = t;
                this.isCompressed = e;
            }
            async fetch({ name: t }) {
                if (!this.baseUrl) throw new Error('The CMap "baseUrl" parameter must be specified, ensure that the "cMapUrl" and "cMapPacked" API parameters are provided.');
                if (!t) throw new Error("CMap name must be specified.");
                const e = this.baseUrl + t + (this.isCompressed ? ".bcmap" : ""), i = this.isCompressed ? s.CMapCompressionType.BINARY : s.CMapCompressionType.NONE;
                return this._fetchData(e, i).catch((t)=>{
                    throw new Error(`Unable to load ${this.isCompressed ? "binary " : ""}CMap at: ${e}`);
                });
            }
            _fetchData(t, e) {
                (0, s.unreachable)("Abstract method `_fetchData` called.");
            }
        }
        class BaseStandardFontDataFactory {
            constructor({ baseUrl: t = null }){
                this.constructor === BaseStandardFontDataFactory && (0, s.unreachable)("Cannot initialize BaseStandardFontDataFactory.");
                this.baseUrl = t;
            }
            async fetch({ filename: t }) {
                if (!this.baseUrl) throw new Error('The standard font "baseUrl" parameter must be specified, ensure that the "standardFontDataUrl" API parameter is provided.');
                if (!t) throw new Error("Font filename must be specified.");
                const e = `${this.baseUrl}${t}`;
                return this._fetchData(e).catch((t)=>{
                    throw new Error(`Unable to load font data at: ${e}`);
                });
            }
            _fetchData(t) {
                (0, s.unreachable)("Abstract method `_fetchData` called.");
            }
        }
        class BaseSVGFactory {
            constructor(){
                this.constructor === BaseSVGFactory && (0, s.unreachable)("Cannot initialize BaseSVGFactory.");
            }
            create(t, e, i = !1) {
                if (t <= 0 || e <= 0) throw new Error("Invalid SVG dimensions");
                const s = this._createSVG("svg:svg");
                s.setAttribute("version", "1.1");
                if (!i) {
                    s.setAttribute("width", `${t}px`);
                    s.setAttribute("height", `${e}px`);
                }
                s.setAttribute("preserveAspectRatio", "none");
                s.setAttribute("viewBox", `0 0 ${t} ${e}`);
                return s;
            }
            createElement(t) {
                if ("string" != typeof t) throw new Error("Invalid SVG element type");
                return this._createSVG(t);
            }
            _createSVG(t) {
                (0, s.unreachable)("Abstract method `_createSVG` called.");
            }
        }
    },
    250: (t, e, i)=>{
        i.d(e, {
            CanvasGraphics: ()=>CanvasGraphics
        });
        var s = i(266), n = i(473);
        const a = "Fill", r = "Stroke", o = "Shading";
        function applyBoundingBox(t, e) {
            if (!e) return;
            const i = e[2] - e[0], s = e[3] - e[1], n = new Path2D;
            n.rect(e[0], e[1], i, s);
            t.clip(n);
        }
        class BaseShadingPattern {
            constructor(){
                this.constructor === BaseShadingPattern && (0, s.unreachable)("Cannot initialize BaseShadingPattern.");
            }
            getPattern() {
                (0, s.unreachable)("Abstract method `getPattern` called.");
            }
        }
        class RadialAxialShadingPattern extends BaseShadingPattern {
            constructor(t){
                super();
                this._type = t[1];
                this._bbox = t[2];
                this._colorStops = t[3];
                this._p0 = t[4];
                this._p1 = t[5];
                this._r0 = t[6];
                this._r1 = t[7];
                this.matrix = null;
            }
            _createGradient(t) {
                let e;
                "axial" === this._type ? e = t.createLinearGradient(this._p0[0], this._p0[1], this._p1[0], this._p1[1]) : "radial" === this._type && (e = t.createRadialGradient(this._p0[0], this._p0[1], this._r0, this._p1[0], this._p1[1], this._r1));
                for (const t of this._colorStops)e.addColorStop(t[0], t[1]);
                return e;
            }
            getPattern(t, e, i, o) {
                let l;
                if (o === r || o === a) {
                    const a = e.current.getClippedPathBoundingBox(o, (0, n.getCurrentTransform)(t)) || [
                        0,
                        0,
                        0,
                        0
                    ], r = Math.ceil(a[2] - a[0]) || 1, h = Math.ceil(a[3] - a[1]) || 1, d = e.cachedCanvases.getCanvas("pattern", r, h, !0), c = d.context;
                    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
                    c.beginPath();
                    c.rect(0, 0, c.canvas.width, c.canvas.height);
                    c.translate(-a[0], -a[1]);
                    i = s.Util.transform(i, [
                        1,
                        0,
                        0,
                        1,
                        a[0],
                        a[1]
                    ]);
                    c.transform(...e.baseTransform);
                    this.matrix && c.transform(...this.matrix);
                    applyBoundingBox(c, this._bbox);
                    c.fillStyle = this._createGradient(c);
                    c.fill();
                    l = t.createPattern(d.canvas, "no-repeat");
                    const u = new DOMMatrix(i);
                    l.setTransform(u);
                } else {
                    applyBoundingBox(t, this._bbox);
                    l = this._createGradient(t);
                }
                return l;
            }
        }
        function drawTriangle(t, e, i, s, n, a, r, o) {
            const l = e.coords, h = e.colors, d = t.data, c = 4 * t.width;
            let u;
            if (l[i + 1] > l[s + 1]) {
                u = i;
                i = s;
                s = u;
                u = a;
                a = r;
                r = u;
            }
            if (l[s + 1] > l[n + 1]) {
                u = s;
                s = n;
                n = u;
                u = r;
                r = o;
                o = u;
            }
            if (l[i + 1] > l[s + 1]) {
                u = i;
                i = s;
                s = u;
                u = a;
                a = r;
                r = u;
            }
            const p = (l[i] + e.offsetX) * e.scaleX, g = (l[i + 1] + e.offsetY) * e.scaleY, m = (l[s] + e.offsetX) * e.scaleX, f = (l[s + 1] + e.offsetY) * e.scaleY, b = (l[n] + e.offsetX) * e.scaleX, A = (l[n + 1] + e.offsetY) * e.scaleY;
            if (g >= A) return;
            const v = h[a], y = h[a + 1], E = h[a + 2], _ = h[r], w = h[r + 1], x = h[r + 2], C = h[o], S = h[o + 1], T = h[o + 2], M = Math.round(g), P = Math.round(A);
            let F, R, k, D, I, L, O, B;
            for(let t = M; t <= P; t++){
                if (t < f) {
                    const e = t < g ? 0 : (g - t) / (g - f);
                    F = p - (p - m) * e;
                    R = v - (v - _) * e;
                    k = y - (y - w) * e;
                    D = E - (E - x) * e;
                } else {
                    let e;
                    e = t > A ? 1 : f === A ? 0 : (f - t) / (f - A);
                    F = m - (m - b) * e;
                    R = _ - (_ - C) * e;
                    k = w - (w - S) * e;
                    D = x - (x - T) * e;
                }
                let e;
                e = t < g ? 0 : t > A ? 1 : (g - t) / (g - A);
                I = p - (p - b) * e;
                L = v - (v - C) * e;
                O = y - (y - S) * e;
                B = E - (E - T) * e;
                const i = Math.round(Math.min(F, I)), s = Math.round(Math.max(F, I));
                let n = c * t + 4 * i;
                for(let t = i; t <= s; t++){
                    e = (F - t) / (F - I);
                    e < 0 ? e = 0 : e > 1 && (e = 1);
                    d[n++] = R - (R - L) * e | 0;
                    d[n++] = k - (k - O) * e | 0;
                    d[n++] = D - (D - B) * e | 0;
                    d[n++] = 255;
                }
            }
        }
        function drawFigure(t, e, i) {
            const s = e.coords, n = e.colors;
            let a, r;
            switch(e.type){
                case "lattice":
                    const o = e.verticesPerRow, l = Math.floor(s.length / o) - 1, h = o - 1;
                    for(a = 0; a < l; a++){
                        let e = a * o;
                        for(let a = 0; a < h; a++, e++){
                            drawTriangle(t, i, s[e], s[e + 1], s[e + o], n[e], n[e + 1], n[e + o]);
                            drawTriangle(t, i, s[e + o + 1], s[e + 1], s[e + o], n[e + o + 1], n[e + 1], n[e + o]);
                        }
                    }
                    break;
                case "triangles":
                    for(a = 0, r = s.length; a < r; a += 3)drawTriangle(t, i, s[a], s[a + 1], s[a + 2], n[a], n[a + 1], n[a + 2]);
                    break;
                default:
                    throw new Error("illegal figure");
            }
        }
        class MeshShadingPattern extends BaseShadingPattern {
            constructor(t){
                super();
                this._coords = t[2];
                this._colors = t[3];
                this._figures = t[4];
                this._bounds = t[5];
                this._bbox = t[7];
                this._background = t[8];
                this.matrix = null;
            }
            _createMeshCanvas(t, e, i) {
                const s = Math.floor(this._bounds[0]), n = Math.floor(this._bounds[1]), a = Math.ceil(this._bounds[2]) - s, r = Math.ceil(this._bounds[3]) - n, o = Math.min(Math.ceil(Math.abs(a * t[0] * 1.1)), 3e3), l = Math.min(Math.ceil(Math.abs(r * t[1] * 1.1)), 3e3), h = a / o, d = r / l, c = {
                    coords: this._coords,
                    colors: this._colors,
                    offsetX: -s,
                    offsetY: -n,
                    scaleX: 1 / h,
                    scaleY: 1 / d
                }, u = o + 4, p = l + 4, g = i.getCanvas("mesh", u, p, !1), m = g.context, f = m.createImageData(o, l);
                if (e) {
                    const t = f.data;
                    for(let i = 0, s = t.length; i < s; i += 4){
                        t[i] = e[0];
                        t[i + 1] = e[1];
                        t[i + 2] = e[2];
                        t[i + 3] = 255;
                    }
                }
                for (const t of this._figures)drawFigure(f, t, c);
                m.putImageData(f, 2, 2);
                return {
                    canvas: g.canvas,
                    offsetX: s - 2 * h,
                    offsetY: n - 2 * d,
                    scaleX: h,
                    scaleY: d
                };
            }
            getPattern(t, e, i, a) {
                applyBoundingBox(t, this._bbox);
                let r;
                if (a === o) r = s.Util.singularValueDecompose2dScale((0, n.getCurrentTransform)(t));
                else {
                    r = s.Util.singularValueDecompose2dScale(e.baseTransform);
                    if (this.matrix) {
                        const t = s.Util.singularValueDecompose2dScale(this.matrix);
                        r = [
                            r[0] * t[0],
                            r[1] * t[1]
                        ];
                    }
                }
                const l = this._createMeshCanvas(r, a === o ? null : this._background, e.cachedCanvases);
                if (a !== o) {
                    t.setTransform(...e.baseTransform);
                    this.matrix && t.transform(...this.matrix);
                }
                t.translate(l.offsetX, l.offsetY);
                t.scale(l.scaleX, l.scaleY);
                return t.createPattern(l.canvas, "no-repeat");
            }
        }
        class DummyShadingPattern extends BaseShadingPattern {
            getPattern() {
                return "hotpink";
            }
        }
        const l = 1, h = 2;
        class TilingPattern {
            static{
                this.MAX_PATTERN_SIZE = 3e3;
            }
            constructor(t, e, i, s, n){
                this.operatorList = t[2];
                this.matrix = t[3] || [
                    1,
                    0,
                    0,
                    1,
                    0,
                    0
                ];
                this.bbox = t[4];
                this.xstep = t[5];
                this.ystep = t[6];
                this.paintType = t[7];
                this.tilingType = t[8];
                this.color = e;
                this.ctx = i;
                this.canvasGraphicsFactory = s;
                this.baseTransform = n;
            }
            createPatternCanvas(t) {
                const e = this.operatorList, i = this.bbox, a = this.xstep, r = this.ystep, o = this.paintType, l = this.tilingType, h = this.color, d = this.canvasGraphicsFactory;
                (0, s.info)("TilingType: " + l);
                const c = i[0], u = i[1], p = i[2], g = i[3], m = s.Util.singularValueDecompose2dScale(this.matrix), f = s.Util.singularValueDecompose2dScale(this.baseTransform), b = [
                    m[0] * f[0],
                    m[1] * f[1]
                ], A = this.getSizeAndScale(a, this.ctx.canvas.width, b[0]), v = this.getSizeAndScale(r, this.ctx.canvas.height, b[1]), y = t.cachedCanvases.getCanvas("pattern", A.size, v.size, !0), E = y.context, _ = d.createCanvasGraphics(E);
                _.groupLevel = t.groupLevel;
                this.setFillAndStrokeStyleToContext(_, o, h);
                let w = c, x = u, C = p, S = g;
                if (c < 0) {
                    w = 0;
                    C += Math.abs(c);
                }
                if (u < 0) {
                    x = 0;
                    S += Math.abs(u);
                }
                E.translate(-A.scale * w, -v.scale * x);
                _.transform(A.scale, 0, 0, v.scale, 0, 0);
                E.save();
                this.clipBbox(_, w, x, C, S);
                _.baseTransform = (0, n.getCurrentTransform)(_.ctx);
                _.executeOperatorList(e);
                _.endDrawing();
                return {
                    canvas: y.canvas,
                    scaleX: A.scale,
                    scaleY: v.scale,
                    offsetX: w,
                    offsetY: x
                };
            }
            getSizeAndScale(t, e, i) {
                t = Math.abs(t);
                const s = Math.max(TilingPattern.MAX_PATTERN_SIZE, e);
                let n = Math.ceil(t * i);
                n >= s ? n = s : i = n / t;
                return {
                    scale: i,
                    size: n
                };
            }
            clipBbox(t, e, i, s, a) {
                const r = s - e, o = a - i;
                t.ctx.rect(e, i, r, o);
                t.current.updateRectMinMax((0, n.getCurrentTransform)(t.ctx), [
                    e,
                    i,
                    s,
                    a
                ]);
                t.clip();
                t.endPath();
            }
            setFillAndStrokeStyleToContext(t, e, i) {
                const n = t.ctx, a = t.current;
                switch(e){
                    case l:
                        const t1 = this.ctx;
                        n.fillStyle = t1.fillStyle;
                        n.strokeStyle = t1.strokeStyle;
                        a.fillColor = t1.fillStyle;
                        a.strokeColor = t1.strokeStyle;
                        break;
                    case h:
                        const r = s.Util.makeHexColor(i[0], i[1], i[2]);
                        n.fillStyle = r;
                        n.strokeStyle = r;
                        a.fillColor = r;
                        a.strokeColor = r;
                        break;
                    default:
                        throw new s.FormatError(`Unsupported paint type: ${e}`);
                }
            }
            getPattern(t, e, i, n) {
                let a = i;
                if (n !== o) {
                    a = s.Util.transform(a, e.baseTransform);
                    this.matrix && (a = s.Util.transform(a, this.matrix));
                }
                const r = this.createPatternCanvas(e);
                let l = new DOMMatrix(a);
                l = l.translate(r.offsetX, r.offsetY);
                l = l.scale(1 / r.scaleX, 1 / r.scaleY);
                const h = t.createPattern(r.canvas, "repeat");
                h.setTransform(l);
                return h;
            }
        }
        function convertBlackAndWhiteToRGBA({ src: t, srcPos: e = 0, dest: i, width: n, height: a, nonBlackColor: r = 4294967295, inverseDecode: o = !1 }) {
            const l = s.FeatureTest.isLittleEndian ? 4278190080 : 255, [h, d] = o ? [
                r,
                l
            ] : [
                l,
                r
            ], c = n >> 3, u = 7 & n, p = t.length;
            i = new Uint32Array(i.buffer);
            let g = 0;
            for(let s = 0; s < a; s++){
                for(const s = e + c; e < s; e++){
                    const s = e < p ? t[e] : 255;
                    i[g++] = 128 & s ? d : h;
                    i[g++] = 64 & s ? d : h;
                    i[g++] = 32 & s ? d : h;
                    i[g++] = 16 & s ? d : h;
                    i[g++] = 8 & s ? d : h;
                    i[g++] = 4 & s ? d : h;
                    i[g++] = 2 & s ? d : h;
                    i[g++] = 1 & s ? d : h;
                }
                if (0 === u) continue;
                const s = e < p ? t[e++] : 255;
                for(let t = 0; t < u; t++)i[g++] = s & 1 << 7 - t ? d : h;
            }
            return {
                srcPos: e,
                destPos: g
            };
        }
        const d = 4096, c = 16;
        class CachedCanvases {
            constructor(t){
                this.canvasFactory = t;
                this.cache = Object.create(null);
            }
            getCanvas(t, e, i) {
                let s;
                if (void 0 !== this.cache[t]) {
                    s = this.cache[t];
                    this.canvasFactory.reset(s, e, i);
                } else {
                    s = this.canvasFactory.create(e, i);
                    this.cache[t] = s;
                }
                return s;
            }
            delete(t) {
                delete this.cache[t];
            }
            clear() {
                for(const t in this.cache){
                    const e = this.cache[t];
                    this.canvasFactory.destroy(e);
                    delete this.cache[t];
                }
            }
        }
        function drawImageAtIntegerCoords(t, e, i, s, a, r, o, l, h, d) {
            const [c, u, p, g, m, f] = (0, n.getCurrentTransform)(t);
            if (0 === u && 0 === p) {
                const n = o * c + m, b = Math.round(n), A = l * g + f, v = Math.round(A), y = (o + h) * c + m, E = Math.abs(Math.round(y) - b) || 1, _ = (l + d) * g + f, w = Math.abs(Math.round(_) - v) || 1;
                t.setTransform(Math.sign(c), 0, 0, Math.sign(g), b, v);
                t.drawImage(e, i, s, a, r, 0, 0, E, w);
                t.setTransform(c, u, p, g, m, f);
                return [
                    E,
                    w
                ];
            }
            if (0 === c && 0 === g) {
                const n = l * p + m, b = Math.round(n), A = o * u + f, v = Math.round(A), y = (l + d) * p + m, E = Math.abs(Math.round(y) - b) || 1, _ = (o + h) * u + f, w = Math.abs(Math.round(_) - v) || 1;
                t.setTransform(0, Math.sign(u), Math.sign(p), 0, b, v);
                t.drawImage(e, i, s, a, r, 0, 0, w, E);
                t.setTransform(c, u, p, g, m, f);
                return [
                    w,
                    E
                ];
            }
            t.drawImage(e, i, s, a, r, o, l, h, d);
            return [
                Math.hypot(c, u) * h,
                Math.hypot(p, g) * d
            ];
        }
        class CanvasExtraState {
            constructor(t, e){
                this.alphaIsShape = !1;
                this.fontSize = 0;
                this.fontSizeScale = 1;
                this.textMatrix = s.IDENTITY_MATRIX;
                this.textMatrixScale = 1;
                this.fontMatrix = s.FONT_IDENTITY_MATRIX;
                this.leading = 0;
                this.x = 0;
                this.y = 0;
                this.lineX = 0;
                this.lineY = 0;
                this.charSpacing = 0;
                this.wordSpacing = 0;
                this.textHScale = 1;
                this.textRenderingMode = s.TextRenderingMode.FILL;
                this.textRise = 0;
                this.fillColor = "#000000";
                this.strokeColor = "#000000";
                this.patternFill = !1;
                this.fillAlpha = 1;
                this.strokeAlpha = 1;
                this.lineWidth = 1;
                this.activeSMask = null;
                this.transferMaps = "none";
                this.startNewPathAndClipBox([
                    0,
                    0,
                    t,
                    e
                ]);
            }
            clone() {
                const t = Object.create(this);
                t.clipBox = this.clipBox.slice();
                return t;
            }
            setCurrentPoint(t, e) {
                this.x = t;
                this.y = e;
            }
            updatePathMinMax(t, e, i) {
                [e, i] = s.Util.applyTransform([
                    e,
                    i
                ], t);
                this.minX = Math.min(this.minX, e);
                this.minY = Math.min(this.minY, i);
                this.maxX = Math.max(this.maxX, e);
                this.maxY = Math.max(this.maxY, i);
            }
            updateRectMinMax(t, e) {
                const i = s.Util.applyTransform(e, t), n = s.Util.applyTransform(e.slice(2), t), a = s.Util.applyTransform([
                    e[0],
                    e[3]
                ], t), r = s.Util.applyTransform([
                    e[2],
                    e[1]
                ], t);
                this.minX = Math.min(this.minX, i[0], n[0], a[0], r[0]);
                this.minY = Math.min(this.minY, i[1], n[1], a[1], r[1]);
                this.maxX = Math.max(this.maxX, i[0], n[0], a[0], r[0]);
                this.maxY = Math.max(this.maxY, i[1], n[1], a[1], r[1]);
            }
            updateScalingPathMinMax(t, e) {
                s.Util.scaleMinMax(t, e);
                this.minX = Math.min(this.minX, e[0]);
                this.maxX = Math.max(this.maxX, e[1]);
                this.minY = Math.min(this.minY, e[2]);
                this.maxY = Math.max(this.maxY, e[3]);
            }
            updateCurvePathMinMax(t, e, i, n, a, r, o, l, h, d) {
                const c = s.Util.bezierBoundingBox(e, i, n, a, r, o, l, h);
                if (d) {
                    d[0] = Math.min(d[0], c[0], c[2]);
                    d[1] = Math.max(d[1], c[0], c[2]);
                    d[2] = Math.min(d[2], c[1], c[3]);
                    d[3] = Math.max(d[3], c[1], c[3]);
                } else this.updateRectMinMax(t, c);
            }
            getPathBoundingBox(t = a, e = null) {
                const i = [
                    this.minX,
                    this.minY,
                    this.maxX,
                    this.maxY
                ];
                if (t === r) {
                    e || (0, s.unreachable)("Stroke bounding box must include transform.");
                    const t = s.Util.singularValueDecompose2dScale(e), n = t[0] * this.lineWidth / 2, a = t[1] * this.lineWidth / 2;
                    i[0] -= n;
                    i[1] -= a;
                    i[2] += n;
                    i[3] += a;
                }
                return i;
            }
            updateClipFromPath() {
                const t = s.Util.intersect(this.clipBox, this.getPathBoundingBox());
                this.startNewPathAndClipBox(t || [
                    0,
                    0,
                    0,
                    0
                ]);
            }
            isEmptyClip() {
                return this.minX === 1 / 0;
            }
            startNewPathAndClipBox(t) {
                this.clipBox = t;
                this.minX = 1 / 0;
                this.minY = 1 / 0;
                this.maxX = 0;
                this.maxY = 0;
            }
            getClippedPathBoundingBox(t = a, e = null) {
                return s.Util.intersect(this.clipBox, this.getPathBoundingBox(t, e));
            }
        }
        function putBinaryImageData(t, e) {
            if ("undefined" != typeof ImageData && e instanceof ImageData) {
                t.putImageData(e, 0, 0);
                return;
            }
            const i = e.height, n = e.width, a = i % c, r = (i - a) / c, o = 0 === a ? r : r + 1, l = t.createImageData(n, c);
            let h, d = 0;
            const u = e.data, p = l.data;
            let g, m, f, b;
            if (e.kind === s.ImageKind.GRAYSCALE_1BPP) {
                const e = u.byteLength, i = new Uint32Array(p.buffer, 0, p.byteLength >> 2), b = i.length, A = n + 7 >> 3, v = 4294967295, y = s.FeatureTest.isLittleEndian ? 4278190080 : 255;
                for(g = 0; g < o; g++){
                    f = g < r ? c : a;
                    h = 0;
                    for(m = 0; m < f; m++){
                        const t = e - d;
                        let s = 0;
                        const a = t > A ? n : 8 * t - 7, r = -8 & a;
                        let o = 0, l = 0;
                        for(; s < r; s += 8){
                            l = u[d++];
                            i[h++] = 128 & l ? v : y;
                            i[h++] = 64 & l ? v : y;
                            i[h++] = 32 & l ? v : y;
                            i[h++] = 16 & l ? v : y;
                            i[h++] = 8 & l ? v : y;
                            i[h++] = 4 & l ? v : y;
                            i[h++] = 2 & l ? v : y;
                            i[h++] = 1 & l ? v : y;
                        }
                        for(; s < a; s++){
                            if (0 === o) {
                                l = u[d++];
                                o = 128;
                            }
                            i[h++] = l & o ? v : y;
                            o >>= 1;
                        }
                    }
                    for(; h < b;)i[h++] = 0;
                    t.putImageData(l, 0, g * c);
                }
            } else if (e.kind === s.ImageKind.RGBA_32BPP) {
                m = 0;
                b = n * c * 4;
                for(g = 0; g < r; g++){
                    p.set(u.subarray(d, d + b));
                    d += b;
                    t.putImageData(l, 0, m);
                    m += c;
                }
                if (g < o) {
                    b = n * a * 4;
                    p.set(u.subarray(d, d + b));
                    t.putImageData(l, 0, m);
                }
            } else {
                if (e.kind !== s.ImageKind.RGB_24BPP) throw new Error(`bad image kind: ${e.kind}`);
                f = c;
                b = n * f;
                for(g = 0; g < o; g++){
                    if (g >= r) {
                        f = a;
                        b = n * f;
                    }
                    h = 0;
                    for(m = b; m--;){
                        p[h++] = u[d++];
                        p[h++] = u[d++];
                        p[h++] = u[d++];
                        p[h++] = 255;
                    }
                    t.putImageData(l, 0, g * c);
                }
            }
        }
        function putBinaryImageMask(t, e) {
            if (e.bitmap) {
                t.drawImage(e.bitmap, 0, 0);
                return;
            }
            const i = e.height, s = e.width, n = i % c, a = (i - n) / c, r = 0 === n ? a : a + 1, o = t.createImageData(s, c);
            let l = 0;
            const h = e.data, d = o.data;
            for(let e = 0; e < r; e++){
                const i = e < a ? c : n;
                ({ srcPos: l } = convertBlackAndWhiteToRGBA({
                    src: h,
                    srcPos: l,
                    dest: d,
                    width: s,
                    height: i,
                    nonBlackColor: 0
                }));
                t.putImageData(o, 0, e * c);
            }
        }
        function copyCtxState(t, e) {
            const i = [
                "strokeStyle",
                "fillStyle",
                "fillRule",
                "globalAlpha",
                "lineWidth",
                "lineCap",
                "lineJoin",
                "miterLimit",
                "globalCompositeOperation",
                "font",
                "filter"
            ];
            for (const s of i)void 0 !== t[s] && (e[s] = t[s]);
            if (void 0 !== t.setLineDash) {
                e.setLineDash(t.getLineDash());
                e.lineDashOffset = t.lineDashOffset;
            }
        }
        function resetCtxToDefault(t) {
            t.strokeStyle = t.fillStyle = "#000000";
            t.fillRule = "nonzero";
            t.globalAlpha = 1;
            t.lineWidth = 1;
            t.lineCap = "butt";
            t.lineJoin = "miter";
            t.miterLimit = 10;
            t.globalCompositeOperation = "source-over";
            t.font = "10px sans-serif";
            if (void 0 !== t.setLineDash) {
                t.setLineDash([]);
                t.lineDashOffset = 0;
            }
            if (!s.isNodeJS) {
                const { filter: e } = t;
                "none" !== e && "" !== e && (t.filter = "none");
            }
        }
        function composeSMaskBackdrop(t, e, i, s) {
            const n = t.length;
            for(let a = 3; a < n; a += 4){
                const n = t[a];
                if (0 === n) {
                    t[a - 3] = e;
                    t[a - 2] = i;
                    t[a - 1] = s;
                } else if (n < 255) {
                    const r = 255 - n;
                    t[a - 3] = t[a - 3] * n + e * r >> 8;
                    t[a - 2] = t[a - 2] * n + i * r >> 8;
                    t[a - 1] = t[a - 1] * n + s * r >> 8;
                }
            }
        }
        function composeSMaskAlpha(t, e, i) {
            const s = t.length;
            for(let n = 3; n < s; n += 4){
                const s = i ? i[t[n]] : t[n];
                e[n] = e[n] * s * .00392156862745098 | 0;
            }
        }
        function composeSMaskLuminosity(t, e, i) {
            const s = t.length;
            for(let n = 3; n < s; n += 4){
                const s = 77 * t[n - 3] + 152 * t[n - 2] + 28 * t[n - 1];
                e[n] = i ? e[n] * i[s >> 8] >> 8 : e[n] * s >> 16;
            }
        }
        function composeSMask(t, e, i, s) {
            const n = s[0], a = s[1], r = s[2] - n, o = s[3] - a;
            if (0 !== r && 0 !== o) {
                !function genericComposeSMask(t, e, i, s, n, a, r, o, l, h, d) {
                    const c = !!a, u = c ? a[0] : 0, p = c ? a[1] : 0, g = c ? a[2] : 0, m = "Luminosity" === n ? composeSMaskLuminosity : composeSMaskAlpha, f = Math.min(s, Math.ceil(1048576 / i));
                    for(let n = 0; n < s; n += f){
                        const a = Math.min(f, s - n), b = t.getImageData(o - h, n + (l - d), i, a), A = e.getImageData(o, n + l, i, a);
                        c && composeSMaskBackdrop(b.data, u, p, g);
                        m(b.data, A.data, r);
                        e.putImageData(A, o, n + l);
                    }
                }(e.context, i, r, o, e.subtype, e.backdrop, e.transferMap, n, a, e.offsetX, e.offsetY);
                t.save();
                t.globalAlpha = 1;
                t.globalCompositeOperation = "source-over";
                t.setTransform(1, 0, 0, 1, 0, 0);
                t.drawImage(i.canvas, 0, 0);
                t.restore();
            }
        }
        function getImageSmoothingEnabled(t, e) {
            const i = s.Util.singularValueDecompose2dScale(t);
            i[0] = Math.fround(i[0]);
            i[1] = Math.fround(i[1]);
            const a = Math.fround((globalThis.devicePixelRatio || 1) * n.PixelsPerInch.PDF_TO_CSS_UNITS);
            return void 0 !== e ? e : i[0] <= a || i[1] <= a;
        }
        const u = [
            "butt",
            "round",
            "square"
        ], p = [
            "miter",
            "round",
            "bevel"
        ], g = {}, m = {};
        class CanvasGraphics {
            constructor(t, e, i, s, n, { optionalContentConfig: a, markedContentStack: r = null }, o, l){
                this.ctx = t;
                this.current = new CanvasExtraState(this.ctx.canvas.width, this.ctx.canvas.height);
                this.stateStack = [];
                this.pendingClip = null;
                this.pendingEOFill = !1;
                this.res = null;
                this.xobjs = null;
                this.commonObjs = e;
                this.objs = i;
                this.canvasFactory = s;
                this.filterFactory = n;
                this.groupStack = [];
                this.processingType3 = null;
                this.baseTransform = null;
                this.baseTransformStack = [];
                this.groupLevel = 0;
                this.smaskStack = [];
                this.smaskCounter = 0;
                this.tempSMask = null;
                this.suspendedCtx = null;
                this.contentVisible = !0;
                this.markedContentStack = r || [];
                this.optionalContentConfig = a;
                this.cachedCanvases = new CachedCanvases(this.canvasFactory);
                this.cachedPatterns = new Map;
                this.annotationCanvasMap = o;
                this.viewportScale = 1;
                this.outputScaleX = 1;
                this.outputScaleY = 1;
                this.pageColors = l;
                this._cachedScaleForStroking = [
                    -1,
                    0
                ];
                this._cachedGetSinglePixelWidth = null;
                this._cachedBitmapsMap = new Map;
            }
            getObject(t, e = null) {
                return "string" == typeof t ? t.startsWith("g_") ? this.commonObjs.get(t) : this.objs.get(t) : e;
            }
            beginDrawing({ transform: t, viewport: e, transparency: i = !1, background: s = null }) {
                const a = this.ctx.canvas.width, r = this.ctx.canvas.height, o = this.ctx.fillStyle;
                this.ctx.fillStyle = s || "#ffffff";
                this.ctx.fillRect(0, 0, a, r);
                this.ctx.fillStyle = o;
                if (i) {
                    const t = this.cachedCanvases.getCanvas("transparent", a, r);
                    this.compositeCtx = this.ctx;
                    this.transparentCanvas = t.canvas;
                    this.ctx = t.context;
                    this.ctx.save();
                    this.ctx.transform(...(0, n.getCurrentTransform)(this.compositeCtx));
                }
                this.ctx.save();
                resetCtxToDefault(this.ctx);
                if (t) {
                    this.ctx.transform(...t);
                    this.outputScaleX = t[0];
                    this.outputScaleY = t[0];
                }
                this.ctx.transform(...e.transform);
                this.viewportScale = e.scale;
                this.baseTransform = (0, n.getCurrentTransform)(this.ctx);
            }
            executeOperatorList(t, e, i, n) {
                const a = t.argsArray, r = t.fnArray;
                let o = e || 0;
                const l = a.length;
                if (l === o) return o;
                const h = l - o > 10 && "function" == typeof i, d = h ? Date.now() + 15 : 0;
                let c = 0;
                const u = this.commonObjs, p = this.objs;
                let g;
                for(;;){
                    if (void 0 !== n && o === n.nextBreakPoint) {
                        n.breakIt(o, i);
                        return o;
                    }
                    g = r[o];
                    if (g !== s.OPS.dependency) this[g].apply(this, a[o]);
                    else for (const t of a[o]){
                        const e = t.startsWith("g_") ? u : p;
                        if (!e.has(t)) {
                            e.get(t, i);
                            return o;
                        }
                    }
                    o++;
                    if (o === l) return o;
                    if (h && ++c > 10) {
                        if (Date.now() > d) {
                            i();
                            return o;
                        }
                        c = 0;
                    }
                }
            }
            #at() {
                for(; this.stateStack.length || this.inSMaskMode;)this.restore();
                this.ctx.restore();
                if (this.transparentCanvas) {
                    this.ctx = this.compositeCtx;
                    this.ctx.save();
                    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                    this.ctx.drawImage(this.transparentCanvas, 0, 0);
                    this.ctx.restore();
                    this.transparentCanvas = null;
                }
            }
            endDrawing() {
                this.#at();
                this.cachedCanvases.clear();
                this.cachedPatterns.clear();
                for (const t of this._cachedBitmapsMap.values()){
                    for (const e of t.values())"undefined" != typeof HTMLCanvasElement && e instanceof HTMLCanvasElement && (e.width = e.height = 0);
                    t.clear();
                }
                this._cachedBitmapsMap.clear();
                this.#rt();
            }
            #rt() {
                if (this.pageColors) {
                    const t = this.filterFactory.addHCMFilter(this.pageColors.foreground, this.pageColors.background);
                    if ("none" !== t) {
                        const e = this.ctx.filter;
                        this.ctx.filter = t;
                        this.ctx.drawImage(this.ctx.canvas, 0, 0);
                        this.ctx.filter = e;
                    }
                }
            }
            _scaleImage(t, e) {
                const i = t.width, s = t.height;
                let n, a, r = Math.max(Math.hypot(e[0], e[1]), 1), o = Math.max(Math.hypot(e[2], e[3]), 1), l = i, h = s, d = "prescale1";
                for(; r > 2 && l > 1 || o > 2 && h > 1;){
                    let e = l, i = h;
                    if (r > 2 && l > 1) {
                        e = l >= 16384 ? Math.floor(l / 2) - 1 || 1 : Math.ceil(l / 2);
                        r /= l / e;
                    }
                    if (o > 2 && h > 1) {
                        i = h >= 16384 ? Math.floor(h / 2) - 1 || 1 : Math.ceil(h) / 2;
                        o /= h / i;
                    }
                    n = this.cachedCanvases.getCanvas(d, e, i);
                    a = n.context;
                    a.clearRect(0, 0, e, i);
                    a.drawImage(t, 0, 0, l, h, 0, 0, e, i);
                    t = n.canvas;
                    l = e;
                    h = i;
                    d = "prescale1" === d ? "prescale2" : "prescale1";
                }
                return {
                    img: t,
                    paintWidth: l,
                    paintHeight: h
                };
            }
            _createMaskCanvas(t) {
                const e = this.ctx, { width: i, height: r } = t, o = this.current.fillColor, l = this.current.patternFill, h = (0, n.getCurrentTransform)(e);
                let d, c, u, p;
                if ((t.bitmap || t.data) && t.count > 1) {
                    const e = t.bitmap || t.data.buffer;
                    c = JSON.stringify(l ? h : [
                        h.slice(0, 4),
                        o
                    ]);
                    d = this._cachedBitmapsMap.get(e);
                    if (!d) {
                        d = new Map;
                        this._cachedBitmapsMap.set(e, d);
                    }
                    const i = d.get(c);
                    if (i && !l) {
                        return {
                            canvas: i,
                            offsetX: Math.round(Math.min(h[0], h[2]) + h[4]),
                            offsetY: Math.round(Math.min(h[1], h[3]) + h[5])
                        };
                    }
                    u = i;
                }
                if (!u) {
                    p = this.cachedCanvases.getCanvas("maskCanvas", i, r);
                    putBinaryImageMask(p.context, t);
                }
                let g = s.Util.transform(h, [
                    1 / i,
                    0,
                    0,
                    -1 / r,
                    0,
                    0
                ]);
                g = s.Util.transform(g, [
                    1,
                    0,
                    0,
                    1,
                    0,
                    -r
                ]);
                const [m, f, b, A] = s.Util.getAxialAlignedBoundingBox([
                    0,
                    0,
                    i,
                    r
                ], g), v = Math.round(b - m) || 1, y = Math.round(A - f) || 1, E = this.cachedCanvases.getCanvas("fillCanvas", v, y), _ = E.context, w = m, x = f;
                _.translate(-w, -x);
                _.transform(...g);
                if (!u) {
                    u = this._scaleImage(p.canvas, (0, n.getCurrentTransformInverse)(_));
                    u = u.img;
                    d && l && d.set(c, u);
                }
                _.imageSmoothingEnabled = getImageSmoothingEnabled((0, n.getCurrentTransform)(_), t.interpolate);
                drawImageAtIntegerCoords(_, u, 0, 0, u.width, u.height, 0, 0, i, r);
                _.globalCompositeOperation = "source-in";
                const C = s.Util.transform((0, n.getCurrentTransformInverse)(_), [
                    1,
                    0,
                    0,
                    1,
                    -w,
                    -x
                ]);
                _.fillStyle = l ? o.getPattern(e, this, C, a) : o;
                _.fillRect(0, 0, i, r);
                if (d && !l) {
                    this.cachedCanvases.delete("fillCanvas");
                    d.set(c, E.canvas);
                }
                return {
                    canvas: E.canvas,
                    offsetX: Math.round(w),
                    offsetY: Math.round(x)
                };
            }
            setLineWidth(t) {
                t !== this.current.lineWidth && (this._cachedScaleForStroking[0] = -1);
                this.current.lineWidth = t;
                this.ctx.lineWidth = t;
            }
            setLineCap(t) {
                this.ctx.lineCap = u[t];
            }
            setLineJoin(t) {
                this.ctx.lineJoin = p[t];
            }
            setMiterLimit(t) {
                this.ctx.miterLimit = t;
            }
            setDash(t, e) {
                const i = this.ctx;
                if (void 0 !== i.setLineDash) {
                    i.setLineDash(t);
                    i.lineDashOffset = e;
                }
            }
            setRenderingIntent(t) {}
            setFlatness(t) {}
            setGState(t) {
                for (const [e, i] of t)switch(e){
                    case "LW":
                        this.setLineWidth(i);
                        break;
                    case "LC":
                        this.setLineCap(i);
                        break;
                    case "LJ":
                        this.setLineJoin(i);
                        break;
                    case "ML":
                        this.setMiterLimit(i);
                        break;
                    case "D":
                        this.setDash(i[0], i[1]);
                        break;
                    case "RI":
                        this.setRenderingIntent(i);
                        break;
                    case "FL":
                        this.setFlatness(i);
                        break;
                    case "Font":
                        this.setFont(i[0], i[1]);
                        break;
                    case "CA":
                        this.current.strokeAlpha = i;
                        break;
                    case "ca":
                        this.current.fillAlpha = i;
                        this.ctx.globalAlpha = i;
                        break;
                    case "BM":
                        this.ctx.globalCompositeOperation = i;
                        break;
                    case "SMask":
                        this.current.activeSMask = i ? this.tempSMask : null;
                        this.tempSMask = null;
                        this.checkSMaskState();
                        break;
                    case "TR":
                        this.ctx.filter = this.current.transferMaps = this.filterFactory.addFilter(i);
                }
            }
            get inSMaskMode() {
                return !!this.suspendedCtx;
            }
            checkSMaskState() {
                const t = this.inSMaskMode;
                this.current.activeSMask && !t ? this.beginSMaskMode() : !this.current.activeSMask && t && this.endSMaskMode();
            }
            beginSMaskMode() {
                if (this.inSMaskMode) throw new Error("beginSMaskMode called while already in smask mode");
                const t = this.ctx.canvas.width, e = this.ctx.canvas.height, i = "smaskGroupAt" + this.groupLevel, s = this.cachedCanvases.getCanvas(i, t, e);
                this.suspendedCtx = this.ctx;
                this.ctx = s.context;
                const a = this.ctx;
                a.setTransform(...(0, n.getCurrentTransform)(this.suspendedCtx));
                copyCtxState(this.suspendedCtx, a);
                !function mirrorContextOperations(t, e) {
                    if (t._removeMirroring) throw new Error("Context is already forwarding operations.");
                    t.__originalSave = t.save;
                    t.__originalRestore = t.restore;
                    t.__originalRotate = t.rotate;
                    t.__originalScale = t.scale;
                    t.__originalTranslate = t.translate;
                    t.__originalTransform = t.transform;
                    t.__originalSetTransform = t.setTransform;
                    t.__originalResetTransform = t.resetTransform;
                    t.__originalClip = t.clip;
                    t.__originalMoveTo = t.moveTo;
                    t.__originalLineTo = t.lineTo;
                    t.__originalBezierCurveTo = t.bezierCurveTo;
                    t.__originalRect = t.rect;
                    t.__originalClosePath = t.closePath;
                    t.__originalBeginPath = t.beginPath;
                    t._removeMirroring = ()=>{
                        t.save = t.__originalSave;
                        t.restore = t.__originalRestore;
                        t.rotate = t.__originalRotate;
                        t.scale = t.__originalScale;
                        t.translate = t.__originalTranslate;
                        t.transform = t.__originalTransform;
                        t.setTransform = t.__originalSetTransform;
                        t.resetTransform = t.__originalResetTransform;
                        t.clip = t.__originalClip;
                        t.moveTo = t.__originalMoveTo;
                        t.lineTo = t.__originalLineTo;
                        t.bezierCurveTo = t.__originalBezierCurveTo;
                        t.rect = t.__originalRect;
                        t.closePath = t.__originalClosePath;
                        t.beginPath = t.__originalBeginPath;
                        delete t._removeMirroring;
                    };
                    t.save = function ctxSave() {
                        e.save();
                        this.__originalSave();
                    };
                    t.restore = function ctxRestore() {
                        e.restore();
                        this.__originalRestore();
                    };
                    t.translate = function ctxTranslate(t, i) {
                        e.translate(t, i);
                        this.__originalTranslate(t, i);
                    };
                    t.scale = function ctxScale(t, i) {
                        e.scale(t, i);
                        this.__originalScale(t, i);
                    };
                    t.transform = function ctxTransform(t, i, s, n, a, r) {
                        e.transform(t, i, s, n, a, r);
                        this.__originalTransform(t, i, s, n, a, r);
                    };
                    t.setTransform = function ctxSetTransform(t, i, s, n, a, r) {
                        e.setTransform(t, i, s, n, a, r);
                        this.__originalSetTransform(t, i, s, n, a, r);
                    };
                    t.resetTransform = function ctxResetTransform() {
                        e.resetTransform();
                        this.__originalResetTransform();
                    };
                    t.rotate = function ctxRotate(t) {
                        e.rotate(t);
                        this.__originalRotate(t);
                    };
                    t.clip = function ctxRotate(t) {
                        e.clip(t);
                        this.__originalClip(t);
                    };
                    t.moveTo = function(t, i) {
                        e.moveTo(t, i);
                        this.__originalMoveTo(t, i);
                    };
                    t.lineTo = function(t, i) {
                        e.lineTo(t, i);
                        this.__originalLineTo(t, i);
                    };
                    t.bezierCurveTo = function(t, i, s, n, a, r) {
                        e.bezierCurveTo(t, i, s, n, a, r);
                        this.__originalBezierCurveTo(t, i, s, n, a, r);
                    };
                    t.rect = function(t, i, s, n) {
                        e.rect(t, i, s, n);
                        this.__originalRect(t, i, s, n);
                    };
                    t.closePath = function() {
                        e.closePath();
                        this.__originalClosePath();
                    };
                    t.beginPath = function() {
                        e.beginPath();
                        this.__originalBeginPath();
                    };
                }(a, this.suspendedCtx);
                this.setGState([
                    [
                        "BM",
                        "source-over"
                    ],
                    [
                        "ca",
                        1
                    ],
                    [
                        "CA",
                        1
                    ]
                ]);
            }
            endSMaskMode() {
                if (!this.inSMaskMode) throw new Error("endSMaskMode called while not in smask mode");
                this.ctx._removeMirroring();
                copyCtxState(this.ctx, this.suspendedCtx);
                this.ctx = this.suspendedCtx;
                this.suspendedCtx = null;
            }
            compose(t) {
                if (!this.current.activeSMask) return;
                if (t) {
                    t[0] = Math.floor(t[0]);
                    t[1] = Math.floor(t[1]);
                    t[2] = Math.ceil(t[2]);
                    t[3] = Math.ceil(t[3]);
                } else t = [
                    0,
                    0,
                    this.ctx.canvas.width,
                    this.ctx.canvas.height
                ];
                const e = this.current.activeSMask;
                composeSMask(this.suspendedCtx, e, this.ctx, t);
                this.ctx.save();
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                this.ctx.restore();
            }
            save() {
                if (this.inSMaskMode) {
                    copyCtxState(this.ctx, this.suspendedCtx);
                    this.suspendedCtx.save();
                } else this.ctx.save();
                const t = this.current;
                this.stateStack.push(t);
                this.current = t.clone();
            }
            restore() {
                0 === this.stateStack.length && this.inSMaskMode && this.endSMaskMode();
                if (0 !== this.stateStack.length) {
                    this.current = this.stateStack.pop();
                    if (this.inSMaskMode) {
                        this.suspendedCtx.restore();
                        copyCtxState(this.suspendedCtx, this.ctx);
                    } else this.ctx.restore();
                    this.checkSMaskState();
                    this.pendingClip = null;
                    this._cachedScaleForStroking[0] = -1;
                    this._cachedGetSinglePixelWidth = null;
                }
            }
            transform(t, e, i, s, n, a) {
                this.ctx.transform(t, e, i, s, n, a);
                this._cachedScaleForStroking[0] = -1;
                this._cachedGetSinglePixelWidth = null;
            }
            constructPath(t, e, i) {
                const a = this.ctx, r = this.current;
                let o, l, h = r.x, d = r.y;
                const c = (0, n.getCurrentTransform)(a), u = 0 === c[0] && 0 === c[3] || 0 === c[1] && 0 === c[2], p = u ? i.slice(0) : null;
                for(let i = 0, n = 0, g = t.length; i < g; i++)switch(0 | t[i]){
                    case s.OPS.rectangle:
                        h = e[n++];
                        d = e[n++];
                        const t1 = e[n++], i1 = e[n++], g = h + t1, m = d + i1;
                        a.moveTo(h, d);
                        if (0 === t1 || 0 === i1) a.lineTo(g, m);
                        else {
                            a.lineTo(g, d);
                            a.lineTo(g, m);
                            a.lineTo(h, m);
                        }
                        u || r.updateRectMinMax(c, [
                            h,
                            d,
                            g,
                            m
                        ]);
                        a.closePath();
                        break;
                    case s.OPS.moveTo:
                        h = e[n++];
                        d = e[n++];
                        a.moveTo(h, d);
                        u || r.updatePathMinMax(c, h, d);
                        break;
                    case s.OPS.lineTo:
                        h = e[n++];
                        d = e[n++];
                        a.lineTo(h, d);
                        u || r.updatePathMinMax(c, h, d);
                        break;
                    case s.OPS.curveTo:
                        o = h;
                        l = d;
                        h = e[n + 4];
                        d = e[n + 5];
                        a.bezierCurveTo(e[n], e[n + 1], e[n + 2], e[n + 3], h, d);
                        r.updateCurvePathMinMax(c, o, l, e[n], e[n + 1], e[n + 2], e[n + 3], h, d, p);
                        n += 6;
                        break;
                    case s.OPS.curveTo2:
                        o = h;
                        l = d;
                        a.bezierCurveTo(h, d, e[n], e[n + 1], e[n + 2], e[n + 3]);
                        r.updateCurvePathMinMax(c, o, l, h, d, e[n], e[n + 1], e[n + 2], e[n + 3], p);
                        h = e[n + 2];
                        d = e[n + 3];
                        n += 4;
                        break;
                    case s.OPS.curveTo3:
                        o = h;
                        l = d;
                        h = e[n + 2];
                        d = e[n + 3];
                        a.bezierCurveTo(e[n], e[n + 1], h, d, h, d);
                        r.updateCurvePathMinMax(c, o, l, e[n], e[n + 1], h, d, h, d, p);
                        n += 4;
                        break;
                    case s.OPS.closePath:
                        a.closePath();
                }
                u && r.updateScalingPathMinMax(c, p);
                r.setCurrentPoint(h, d);
            }
            closePath() {
                this.ctx.closePath();
            }
            stroke(t = !0) {
                const e = this.ctx, i = this.current.strokeColor;
                e.globalAlpha = this.current.strokeAlpha;
                if (this.contentVisible) if ("object" == typeof i && i?.getPattern) {
                    e.save();
                    e.strokeStyle = i.getPattern(e, this, (0, n.getCurrentTransformInverse)(e), r);
                    this.rescaleAndStroke(!1);
                    e.restore();
                } else this.rescaleAndStroke(!0);
                t && this.consumePath(this.current.getClippedPathBoundingBox());
                e.globalAlpha = this.current.fillAlpha;
            }
            closeStroke() {
                this.closePath();
                this.stroke();
            }
            fill(t = !0) {
                const e = this.ctx, i = this.current.fillColor;
                let s = !1;
                if (this.current.patternFill) {
                    e.save();
                    e.fillStyle = i.getPattern(e, this, (0, n.getCurrentTransformInverse)(e), a);
                    s = !0;
                }
                const r = this.current.getClippedPathBoundingBox();
                if (this.contentVisible && null !== r) if (this.pendingEOFill) {
                    e.fill("evenodd");
                    this.pendingEOFill = !1;
                } else e.fill();
                s && e.restore();
                t && this.consumePath(r);
            }
            eoFill() {
                this.pendingEOFill = !0;
                this.fill();
            }
            fillStroke() {
                this.fill(!1);
                this.stroke(!1);
                this.consumePath();
            }
            eoFillStroke() {
                this.pendingEOFill = !0;
                this.fillStroke();
            }
            closeFillStroke() {
                this.closePath();
                this.fillStroke();
            }
            closeEOFillStroke() {
                this.pendingEOFill = !0;
                this.closePath();
                this.fillStroke();
            }
            endPath() {
                this.consumePath();
            }
            clip() {
                this.pendingClip = g;
            }
            eoClip() {
                this.pendingClip = m;
            }
            beginText() {
                this.current.textMatrix = s.IDENTITY_MATRIX;
                this.current.textMatrixScale = 1;
                this.current.x = this.current.lineX = 0;
                this.current.y = this.current.lineY = 0;
            }
            endText() {
                const t = this.pendingTextPaths, e = this.ctx;
                if (void 0 !== t) {
                    e.save();
                    e.beginPath();
                    for (const i of t){
                        e.setTransform(...i.transform);
                        e.translate(i.x, i.y);
                        i.addToPath(e, i.fontSize);
                    }
                    e.restore();
                    e.clip();
                    e.beginPath();
                    delete this.pendingTextPaths;
                } else e.beginPath();
            }
            setCharSpacing(t) {
                this.current.charSpacing = t;
            }
            setWordSpacing(t) {
                this.current.wordSpacing = t;
            }
            setHScale(t) {
                this.current.textHScale = t / 100;
            }
            setLeading(t) {
                this.current.leading = -t;
            }
            setFont(t, e) {
                const i = this.commonObjs.get(t), n = this.current;
                if (!i) throw new Error(`Can't find font for ${t}`);
                n.fontMatrix = i.fontMatrix || s.FONT_IDENTITY_MATRIX;
                0 !== n.fontMatrix[0] && 0 !== n.fontMatrix[3] || (0, s.warn)("Invalid font matrix for font " + t);
                if (e < 0) {
                    e = -e;
                    n.fontDirection = -1;
                } else n.fontDirection = 1;
                this.current.font = i;
                this.current.fontSize = e;
                if (i.isType3Font) return;
                const a = i.loadedName || "sans-serif", r = i.systemFontInfo?.css || `"${a}", ${i.fallbackName}`;
                let o = "normal";
                i.black ? o = "900" : i.bold && (o = "bold");
                const l = i.italic ? "italic" : "normal";
                let h = e;
                e < 16 ? h = 16 : e > 100 && (h = 100);
                this.current.fontSizeScale = e / h;
                this.ctx.font = `${l} ${o} ${h}px ${r}`;
            }
            setTextRenderingMode(t) {
                this.current.textRenderingMode = t;
            }
            setTextRise(t) {
                this.current.textRise = t;
            }
            moveText(t, e) {
                this.current.x = this.current.lineX += t;
                this.current.y = this.current.lineY += e;
            }
            setLeadingMoveText(t, e) {
                this.setLeading(-e);
                this.moveText(t, e);
            }
            setTextMatrix(t, e, i, s, n, a) {
                this.current.textMatrix = [
                    t,
                    e,
                    i,
                    s,
                    n,
                    a
                ];
                this.current.textMatrixScale = Math.hypot(t, e);
                this.current.x = this.current.lineX = 0;
                this.current.y = this.current.lineY = 0;
            }
            nextLine() {
                this.moveText(0, this.current.leading);
            }
            paintChar(t, e, i, a) {
                const r = this.ctx, o = this.current, l = o.font, h = o.textRenderingMode, d = o.fontSize / o.fontSizeScale, c = h & s.TextRenderingMode.FILL_STROKE_MASK, u = !!(h & s.TextRenderingMode.ADD_TO_PATH_FLAG), p = o.patternFill && !l.missingFile;
                let g;
                (l.disableFontFace || u || p) && (g = l.getPathGenerator(this.commonObjs, t));
                if (l.disableFontFace || p) {
                    r.save();
                    r.translate(e, i);
                    r.beginPath();
                    g(r, d);
                    a && r.setTransform(...a);
                    c !== s.TextRenderingMode.FILL && c !== s.TextRenderingMode.FILL_STROKE || r.fill();
                    c !== s.TextRenderingMode.STROKE && c !== s.TextRenderingMode.FILL_STROKE || r.stroke();
                    r.restore();
                } else {
                    c !== s.TextRenderingMode.FILL && c !== s.TextRenderingMode.FILL_STROKE || r.fillText(t, e, i);
                    c !== s.TextRenderingMode.STROKE && c !== s.TextRenderingMode.FILL_STROKE || r.strokeText(t, e, i);
                }
                if (u) {
                    (this.pendingTextPaths ||= []).push({
                        transform: (0, n.getCurrentTransform)(r),
                        x: e,
                        y: i,
                        fontSize: d,
                        addToPath: g
                    });
                }
            }
            get isFontSubpixelAAEnabled() {
                const { context: t } = this.cachedCanvases.getCanvas("isFontSubpixelAAEnabled", 10, 10);
                t.scale(1.5, 1);
                t.fillText("I", 0, 10);
                const e = t.getImageData(0, 0, 10, 10).data;
                let i = !1;
                for(let t = 3; t < e.length; t += 4)if (e[t] > 0 && e[t] < 255) {
                    i = !0;
                    break;
                }
                return (0, s.shadow)(this, "isFontSubpixelAAEnabled", i);
            }
            showText(t) {
                const e = this.current, i = e.font;
                if (i.isType3Font) return this.showType3Text(t);
                const r = e.fontSize;
                if (0 === r) return;
                const o = this.ctx, l = e.fontSizeScale, h = e.charSpacing, d = e.wordSpacing, c = e.fontDirection, u = e.textHScale * c, p = t.length, g = i.vertical, m = g ? 1 : -1, f = i.defaultVMetrics, b = r * e.fontMatrix[0], A = e.textRenderingMode === s.TextRenderingMode.FILL && !i.disableFontFace && !e.patternFill;
                o.save();
                o.transform(...e.textMatrix);
                o.translate(e.x, e.y + e.textRise);
                c > 0 ? o.scale(u, -1) : o.scale(u, 1);
                let v;
                if (e.patternFill) {
                    o.save();
                    const t = e.fillColor.getPattern(o, this, (0, n.getCurrentTransformInverse)(o), a);
                    v = (0, n.getCurrentTransform)(o);
                    o.restore();
                    o.fillStyle = t;
                }
                let y = e.lineWidth;
                const E = e.textMatrixScale;
                if (0 === E || 0 === y) {
                    const t = e.textRenderingMode & s.TextRenderingMode.FILL_STROKE_MASK;
                    t !== s.TextRenderingMode.STROKE && t !== s.TextRenderingMode.FILL_STROKE || (y = this.getSinglePixelWidth());
                } else y /= E;
                if (1 !== l) {
                    o.scale(l, l);
                    y /= l;
                }
                o.lineWidth = y;
                if (i.isInvalidPDFjsFont) {
                    const i = [];
                    let s = 0;
                    for (const e of t){
                        i.push(e.unicode);
                        s += e.width;
                    }
                    o.fillText(i.join(""), 0, 0);
                    e.x += s * b * u;
                    o.restore();
                    this.compose();
                    return;
                }
                let _, w = 0;
                for(_ = 0; _ < p; ++_){
                    const e = t[_];
                    if ("number" == typeof e) {
                        w += m * e * r / 1e3;
                        continue;
                    }
                    let s = !1;
                    const n = (e.isSpace ? d : 0) + h, a = e.fontChar, u = e.accent;
                    let p, y, E = e.width;
                    if (g) {
                        const t = e.vmetric || f, i = -(e.vmetric ? t[1] : .5 * E) * b, s = t[2] * b;
                        E = t ? -t[0] : E;
                        p = i / l;
                        y = (w + s) / l;
                    } else {
                        p = w / l;
                        y = 0;
                    }
                    if (i.remeasure && E > 0) {
                        const t = 1e3 * o.measureText(a).width / r * l;
                        if (E < t && this.isFontSubpixelAAEnabled) {
                            const e = E / t;
                            s = !0;
                            o.save();
                            o.scale(e, 1);
                            p /= e;
                        } else E !== t && (p += (E - t) / 2e3 * r / l);
                    }
                    if (this.contentVisible && (e.isInFont || i.missingFile)) if (A && !u) o.fillText(a, p, y);
                    else {
                        this.paintChar(a, p, y, v);
                        if (u) {
                            const t = p + r * u.offset.x / l, e = y - r * u.offset.y / l;
                            this.paintChar(u.fontChar, t, e, v);
                        }
                    }
                    w += g ? E * b - n * c : E * b + n * c;
                    s && o.restore();
                }
                g ? e.y -= w : e.x += w * u;
                o.restore();
                this.compose();
            }
            showType3Text(t) {
                const e = this.ctx, i = this.current, n = i.font, a = i.fontSize, r = i.fontDirection, o = n.vertical ? 1 : -1, l = i.charSpacing, h = i.wordSpacing, d = i.textHScale * r, c = i.fontMatrix || s.FONT_IDENTITY_MATRIX, u = t.length;
                let p, g, m, f;
                if (!(i.textRenderingMode === s.TextRenderingMode.INVISIBLE) && 0 !== a) {
                    this._cachedScaleForStroking[0] = -1;
                    this._cachedGetSinglePixelWidth = null;
                    e.save();
                    e.transform(...i.textMatrix);
                    e.translate(i.x, i.y);
                    e.scale(d, r);
                    for(p = 0; p < u; ++p){
                        g = t[p];
                        if ("number" == typeof g) {
                            f = o * g * a / 1e3;
                            this.ctx.translate(f, 0);
                            i.x += f * d;
                            continue;
                        }
                        const r = (g.isSpace ? h : 0) + l, u = n.charProcOperatorList[g.operatorListId];
                        if (!u) {
                            (0, s.warn)(`Type3 character "${g.operatorListId}" is not available.`);
                            continue;
                        }
                        if (this.contentVisible) {
                            this.processingType3 = g;
                            this.save();
                            e.scale(a, a);
                            e.transform(...c);
                            this.executeOperatorList(u);
                            this.restore();
                        }
                        m = s.Util.applyTransform([
                            g.width,
                            0
                        ], c)[0] * a + r;
                        e.translate(m, 0);
                        i.x += m * d;
                    }
                    e.restore();
                    this.processingType3 = null;
                }
            }
            setCharWidth(t, e) {}
            setCharWidthAndBounds(t, e, i, s, n, a) {
                this.ctx.rect(i, s, n - i, a - s);
                this.ctx.clip();
                this.endPath();
            }
            getColorN_Pattern(t) {
                let e;
                if ("TilingPattern" === t[0]) {
                    const i = t[1], s = this.baseTransform || (0, n.getCurrentTransform)(this.ctx), a = {
                        createCanvasGraphics: (t)=>new CanvasGraphics(t, this.commonObjs, this.objs, this.canvasFactory, this.filterFactory, {
                                optionalContentConfig: this.optionalContentConfig,
                                markedContentStack: this.markedContentStack
                            })
                    };
                    e = new TilingPattern(t, i, this.ctx, a, s);
                } else e = this._getPattern(t[1], t[2]);
                return e;
            }
            setStrokeColorN() {
                this.current.strokeColor = this.getColorN_Pattern(arguments);
            }
            setFillColorN() {
                this.current.fillColor = this.getColorN_Pattern(arguments);
                this.current.patternFill = !0;
            }
            setStrokeRGBColor(t, e, i) {
                const n = s.Util.makeHexColor(t, e, i);
                this.ctx.strokeStyle = n;
                this.current.strokeColor = n;
            }
            setFillRGBColor(t, e, i) {
                const n = s.Util.makeHexColor(t, e, i);
                this.ctx.fillStyle = n;
                this.current.fillColor = n;
                this.current.patternFill = !1;
            }
            _getPattern(t, e = null) {
                let i;
                if (this.cachedPatterns.has(t)) i = this.cachedPatterns.get(t);
                else {
                    i = function getShadingPattern(t) {
                        switch(t[0]){
                            case "RadialAxial":
                                return new RadialAxialShadingPattern(t);
                            case "Mesh":
                                return new MeshShadingPattern(t);
                            case "Dummy":
                                return new DummyShadingPattern;
                        }
                        throw new Error(`Unknown IR type: ${t[0]}`);
                    }(this.getObject(t));
                    this.cachedPatterns.set(t, i);
                }
                e && (i.matrix = e);
                return i;
            }
            shadingFill(t) {
                if (!this.contentVisible) return;
                const e = this.ctx;
                this.save();
                const i = this._getPattern(t);
                e.fillStyle = i.getPattern(e, this, (0, n.getCurrentTransformInverse)(e), o);
                const a = (0, n.getCurrentTransformInverse)(e);
                if (a) {
                    const { width: t, height: i } = e.canvas, [n, r, o, l] = s.Util.getAxialAlignedBoundingBox([
                        0,
                        0,
                        t,
                        i
                    ], a);
                    this.ctx.fillRect(n, r, o - n, l - r);
                } else this.ctx.fillRect(-1e10, -1e10, 2e10, 2e10);
                this.compose(this.current.getClippedPathBoundingBox());
                this.restore();
            }
            beginInlineImage() {
                (0, s.unreachable)("Should not call beginInlineImage");
            }
            beginImageData() {
                (0, s.unreachable)("Should not call beginImageData");
            }
            paintFormXObjectBegin(t, e) {
                if (this.contentVisible) {
                    this.save();
                    this.baseTransformStack.push(this.baseTransform);
                    Array.isArray(t) && 6 === t.length && this.transform(...t);
                    this.baseTransform = (0, n.getCurrentTransform)(this.ctx);
                    if (e) {
                        const t = e[2] - e[0], i = e[3] - e[1];
                        this.ctx.rect(e[0], e[1], t, i);
                        this.current.updateRectMinMax((0, n.getCurrentTransform)(this.ctx), e);
                        this.clip();
                        this.endPath();
                    }
                }
            }
            paintFormXObjectEnd() {
                if (this.contentVisible) {
                    this.restore();
                    this.baseTransform = this.baseTransformStack.pop();
                }
            }
            beginGroup(t) {
                if (!this.contentVisible) return;
                this.save();
                if (this.inSMaskMode) {
                    this.endSMaskMode();
                    this.current.activeSMask = null;
                }
                const e = this.ctx;
                t.isolated || (0, s.info)("TODO: Support non-isolated groups.");
                t.knockout && (0, s.warn)("Knockout groups not supported.");
                const i = (0, n.getCurrentTransform)(e);
                t.matrix && e.transform(...t.matrix);
                if (!t.bbox) throw new Error("Bounding box is required.");
                let a = s.Util.getAxialAlignedBoundingBox(t.bbox, (0, n.getCurrentTransform)(e));
                const r = [
                    0,
                    0,
                    e.canvas.width,
                    e.canvas.height
                ];
                a = s.Util.intersect(a, r) || [
                    0,
                    0,
                    0,
                    0
                ];
                const o = Math.floor(a[0]), l = Math.floor(a[1]);
                let h = Math.max(Math.ceil(a[2]) - o, 1), c = Math.max(Math.ceil(a[3]) - l, 1), u = 1, p = 1;
                if (h > d) {
                    u = h / d;
                    h = d;
                }
                if (c > d) {
                    p = c / d;
                    c = d;
                }
                this.current.startNewPathAndClipBox([
                    0,
                    0,
                    h,
                    c
                ]);
                let g = "groupAt" + this.groupLevel;
                t.smask && (g += "_smask_" + this.smaskCounter++ % 2);
                const m = this.cachedCanvases.getCanvas(g, h, c), f = m.context;
                f.scale(1 / u, 1 / p);
                f.translate(-o, -l);
                f.transform(...i);
                if (t.smask) this.smaskStack.push({
                    canvas: m.canvas,
                    context: f,
                    offsetX: o,
                    offsetY: l,
                    scaleX: u,
                    scaleY: p,
                    subtype: t.smask.subtype,
                    backdrop: t.smask.backdrop,
                    transferMap: t.smask.transferMap || null,
                    startTransformInverse: null
                });
                else {
                    e.setTransform(1, 0, 0, 1, 0, 0);
                    e.translate(o, l);
                    e.scale(u, p);
                    e.save();
                }
                copyCtxState(e, f);
                this.ctx = f;
                this.setGState([
                    [
                        "BM",
                        "source-over"
                    ],
                    [
                        "ca",
                        1
                    ],
                    [
                        "CA",
                        1
                    ]
                ]);
                this.groupStack.push(e);
                this.groupLevel++;
            }
            endGroup(t) {
                if (!this.contentVisible) return;
                this.groupLevel--;
                const e = this.ctx, i = this.groupStack.pop();
                this.ctx = i;
                this.ctx.imageSmoothingEnabled = !1;
                if (t.smask) {
                    this.tempSMask = this.smaskStack.pop();
                    this.restore();
                } else {
                    this.ctx.restore();
                    const t = (0, n.getCurrentTransform)(this.ctx);
                    this.restore();
                    this.ctx.save();
                    this.ctx.setTransform(...t);
                    const i = s.Util.getAxialAlignedBoundingBox([
                        0,
                        0,
                        e.canvas.width,
                        e.canvas.height
                    ], t);
                    this.ctx.drawImage(e.canvas, 0, 0);
                    this.ctx.restore();
                    this.compose(i);
                }
            }
            beginAnnotation(t, e, i, a, r) {
                this.#at();
                resetCtxToDefault(this.ctx);
                this.ctx.save();
                this.save();
                this.baseTransform && this.ctx.setTransform(...this.baseTransform);
                if (Array.isArray(e) && 4 === e.length) {
                    const a = e[2] - e[0], o = e[3] - e[1];
                    if (r && this.annotationCanvasMap) {
                        (i = i.slice())[4] -= e[0];
                        i[5] -= e[1];
                        (e = e.slice())[0] = e[1] = 0;
                        e[2] = a;
                        e[3] = o;
                        const [r, l] = s.Util.singularValueDecompose2dScale((0, n.getCurrentTransform)(this.ctx)), { viewportScale: h } = this, d = Math.ceil(a * this.outputScaleX * h), c = Math.ceil(o * this.outputScaleY * h);
                        this.annotationCanvas = this.canvasFactory.create(d, c);
                        const { canvas: u, context: p } = this.annotationCanvas;
                        this.annotationCanvasMap.set(t, u);
                        this.annotationCanvas.savedCtx = this.ctx;
                        this.ctx = p;
                        this.ctx.save();
                        this.ctx.setTransform(r, 0, 0, -l, 0, o * l);
                        resetCtxToDefault(this.ctx);
                    } else {
                        resetCtxToDefault(this.ctx);
                        this.ctx.rect(e[0], e[1], a, o);
                        this.ctx.clip();
                        this.endPath();
                    }
                }
                this.current = new CanvasExtraState(this.ctx.canvas.width, this.ctx.canvas.height);
                this.transform(...i);
                this.transform(...a);
            }
            endAnnotation() {
                if (this.annotationCanvas) {
                    this.ctx.restore();
                    this.#rt();
                    this.ctx = this.annotationCanvas.savedCtx;
                    delete this.annotationCanvas.savedCtx;
                    delete this.annotationCanvas;
                }
            }
            paintImageMaskXObject(t) {
                if (!this.contentVisible) return;
                const e = t.count;
                (t = this.getObject(t.data, t)).count = e;
                const i = this.ctx, s = this.processingType3;
                if (s) {
                    void 0 === s.compiled && (s.compiled = function compileType3Glyph(t) {
                        const { width: e, height: i } = t;
                        if (e > 1e3 || i > 1e3) return null;
                        const s = new Uint8Array([
                            0,
                            2,
                            4,
                            0,
                            1,
                            0,
                            5,
                            4,
                            8,
                            10,
                            0,
                            8,
                            0,
                            2,
                            1,
                            0
                        ]), n = e + 1;
                        let a, r, o, l = new Uint8Array(n * (i + 1));
                        const h = e + 7 & -8;
                        let d = new Uint8Array(h * i), c = 0;
                        for (const e of t.data){
                            let t = 128;
                            for(; t > 0;){
                                d[c++] = e & t ? 0 : 255;
                                t >>= 1;
                            }
                        }
                        let u = 0;
                        c = 0;
                        if (0 !== d[c]) {
                            l[0] = 1;
                            ++u;
                        }
                        for(r = 1; r < e; r++){
                            if (d[c] !== d[c + 1]) {
                                l[r] = d[c] ? 2 : 1;
                                ++u;
                            }
                            c++;
                        }
                        if (0 !== d[c]) {
                            l[r] = 2;
                            ++u;
                        }
                        for(a = 1; a < i; a++){
                            c = a * h;
                            o = a * n;
                            if (d[c - h] !== d[c]) {
                                l[o] = d[c] ? 1 : 8;
                                ++u;
                            }
                            let t = (d[c] ? 4 : 0) + (d[c - h] ? 8 : 0);
                            for(r = 1; r < e; r++){
                                t = (t >> 2) + (d[c + 1] ? 4 : 0) + (d[c - h + 1] ? 8 : 0);
                                if (s[t]) {
                                    l[o + r] = s[t];
                                    ++u;
                                }
                                c++;
                            }
                            if (d[c - h] !== d[c]) {
                                l[o + r] = d[c] ? 2 : 4;
                                ++u;
                            }
                            if (u > 1e3) return null;
                        }
                        c = h * (i - 1);
                        o = a * n;
                        if (0 !== d[c]) {
                            l[o] = 8;
                            ++u;
                        }
                        for(r = 1; r < e; r++){
                            if (d[c] !== d[c + 1]) {
                                l[o + r] = d[c] ? 4 : 8;
                                ++u;
                            }
                            c++;
                        }
                        if (0 !== d[c]) {
                            l[o + r] = 4;
                            ++u;
                        }
                        if (u > 1e3) return null;
                        const p = new Int32Array([
                            0,
                            n,
                            -1,
                            0,
                            -n,
                            0,
                            0,
                            0,
                            1
                        ]), g = new Path2D;
                        for(a = 0; u && a <= i; a++){
                            let t = a * n;
                            const i = t + e;
                            for(; t < i && !l[t];)t++;
                            if (t === i) continue;
                            g.moveTo(t % n, a);
                            const s = t;
                            let r = l[t];
                            do {
                                const e = p[r];
                                do {
                                    t += e;
                                }while (!l[t]);
                                const i = l[t];
                                if (5 !== i && 10 !== i) {
                                    r = i;
                                    l[t] = 0;
                                } else {
                                    r = i & 51 * r >> 4;
                                    l[t] &= r >> 2 | r << 2;
                                }
                                g.lineTo(t % n, t / n | 0);
                                l[t] || --u;
                            }while (s !== t);
                            --a;
                        }
                        d = null;
                        l = null;
                        return function(t) {
                            t.save();
                            t.scale(1 / e, -1 / i);
                            t.translate(0, -i);
                            t.fill(g);
                            t.beginPath();
                            t.restore();
                        };
                    }(t));
                    if (s.compiled) {
                        s.compiled(i);
                        return;
                    }
                }
                const n = this._createMaskCanvas(t), a = n.canvas;
                i.save();
                i.setTransform(1, 0, 0, 1, 0, 0);
                i.drawImage(a, n.offsetX, n.offsetY);
                i.restore();
                this.compose();
            }
            paintImageMaskXObjectRepeat(t, e, i = 0, a = 0, r, o) {
                if (!this.contentVisible) return;
                t = this.getObject(t.data, t);
                const l = this.ctx;
                l.save();
                const h = (0, n.getCurrentTransform)(l);
                l.transform(e, i, a, r, 0, 0);
                const d = this._createMaskCanvas(t);
                l.setTransform(1, 0, 0, 1, d.offsetX - h[4], d.offsetY - h[5]);
                for(let t = 0, n = o.length; t < n; t += 2){
                    const n = s.Util.transform(h, [
                        e,
                        i,
                        a,
                        r,
                        o[t],
                        o[t + 1]
                    ]), [c, u] = s.Util.applyTransform([
                        0,
                        0
                    ], n);
                    l.drawImage(d.canvas, c, u);
                }
                l.restore();
                this.compose();
            }
            paintImageMaskXObjectGroup(t) {
                if (!this.contentVisible) return;
                const e = this.ctx, i = this.current.fillColor, s = this.current.patternFill;
                for (const r of t){
                    const { data: t, width: o, height: l, transform: h } = r, d = this.cachedCanvases.getCanvas("maskCanvas", o, l), c = d.context;
                    c.save();
                    putBinaryImageMask(c, this.getObject(t, r));
                    c.globalCompositeOperation = "source-in";
                    c.fillStyle = s ? i.getPattern(c, this, (0, n.getCurrentTransformInverse)(e), a) : i;
                    c.fillRect(0, 0, o, l);
                    c.restore();
                    e.save();
                    e.transform(...h);
                    e.scale(1, -1);
                    drawImageAtIntegerCoords(e, d.canvas, 0, 0, o, l, 0, -1, 1, 1);
                    e.restore();
                }
                this.compose();
            }
            paintImageXObject(t) {
                if (!this.contentVisible) return;
                const e = this.getObject(t);
                e ? this.paintInlineImageXObject(e) : (0, s.warn)("Dependent image isn't ready yet");
            }
            paintImageXObjectRepeat(t, e, i, n) {
                if (!this.contentVisible) return;
                const a = this.getObject(t);
                if (!a) {
                    (0, s.warn)("Dependent image isn't ready yet");
                    return;
                }
                const r = a.width, o = a.height, l = [];
                for(let t = 0, s = n.length; t < s; t += 2)l.push({
                    transform: [
                        e,
                        0,
                        0,
                        i,
                        n[t],
                        n[t + 1]
                    ],
                    x: 0,
                    y: 0,
                    w: r,
                    h: o
                });
                this.paintInlineImageXObjectGroup(a, l);
            }
            applyTransferMapsToCanvas(t) {
                if ("none" !== this.current.transferMaps) {
                    t.filter = this.current.transferMaps;
                    t.drawImage(t.canvas, 0, 0);
                    t.filter = "none";
                }
                return t.canvas;
            }
            applyTransferMapsToBitmap(t) {
                if ("none" === this.current.transferMaps) return t.bitmap;
                const { bitmap: e, width: i, height: s } = t, n = this.cachedCanvases.getCanvas("inlineImage", i, s), a = n.context;
                a.filter = this.current.transferMaps;
                a.drawImage(e, 0, 0);
                a.filter = "none";
                return n.canvas;
            }
            paintInlineImageXObject(t) {
                if (!this.contentVisible) return;
                const e = t.width, i = t.height, a = this.ctx;
                this.save();
                if (!s.isNodeJS) {
                    const { filter: t } = a;
                    "none" !== t && "" !== t && (a.filter = "none");
                }
                a.scale(1 / e, -1 / i);
                let r;
                if (t.bitmap) r = this.applyTransferMapsToBitmap(t);
                else if ("function" == typeof HTMLElement && t instanceof HTMLElement || !t.data) r = t;
                else {
                    const s = this.cachedCanvases.getCanvas("inlineImage", e, i).context;
                    putBinaryImageData(s, t);
                    r = this.applyTransferMapsToCanvas(s);
                }
                const o = this._scaleImage(r, (0, n.getCurrentTransformInverse)(a));
                a.imageSmoothingEnabled = getImageSmoothingEnabled((0, n.getCurrentTransform)(a), t.interpolate);
                drawImageAtIntegerCoords(a, o.img, 0, 0, o.paintWidth, o.paintHeight, 0, -i, e, i);
                this.compose();
                this.restore();
            }
            paintInlineImageXObjectGroup(t, e) {
                if (!this.contentVisible) return;
                const i = this.ctx;
                let s;
                if (t.bitmap) s = t.bitmap;
                else {
                    const e = t.width, i = t.height, n = this.cachedCanvases.getCanvas("inlineImage", e, i).context;
                    putBinaryImageData(n, t);
                    s = this.applyTransferMapsToCanvas(n);
                }
                for (const t of e){
                    i.save();
                    i.transform(...t.transform);
                    i.scale(1, -1);
                    drawImageAtIntegerCoords(i, s, t.x, t.y, t.w, t.h, 0, -1, 1, 1);
                    i.restore();
                }
                this.compose();
            }
            paintSolidColorImageMask() {
                if (this.contentVisible) {
                    this.ctx.fillRect(0, 0, 1, 1);
                    this.compose();
                }
            }
            markPoint(t) {}
            markPointProps(t, e) {}
            beginMarkedContent(t) {
                this.markedContentStack.push({
                    visible: !0
                });
            }
            beginMarkedContentProps(t, e) {
                "OC" === t ? this.markedContentStack.push({
                    visible: this.optionalContentConfig.isVisible(e)
                }) : this.markedContentStack.push({
                    visible: !0
                });
                this.contentVisible = this.isContentVisible();
            }
            endMarkedContent() {
                this.markedContentStack.pop();
                this.contentVisible = this.isContentVisible();
            }
            beginCompat() {}
            endCompat() {}
            consumePath(t) {
                const e = this.current.isEmptyClip();
                this.pendingClip && this.current.updateClipFromPath();
                this.pendingClip || this.compose(t);
                const i = this.ctx;
                if (this.pendingClip) {
                    e || (this.pendingClip === m ? i.clip("evenodd") : i.clip());
                    this.pendingClip = null;
                }
                this.current.startNewPathAndClipBox(this.current.clipBox);
                i.beginPath();
            }
            getSinglePixelWidth() {
                if (!this._cachedGetSinglePixelWidth) {
                    const t = (0, n.getCurrentTransform)(this.ctx);
                    if (0 === t[1] && 0 === t[2]) this._cachedGetSinglePixelWidth = 1 / Math.min(Math.abs(t[0]), Math.abs(t[3]));
                    else {
                        const e = Math.abs(t[0] * t[3] - t[2] * t[1]), i = Math.hypot(t[0], t[2]), s = Math.hypot(t[1], t[3]);
                        this._cachedGetSinglePixelWidth = Math.max(i, s) / e;
                    }
                }
                return this._cachedGetSinglePixelWidth;
            }
            getScaleForStroking() {
                if (-1 === this._cachedScaleForStroking[0]) {
                    const { lineWidth: t } = this.current, { a: e, b: i, c: s, d: n } = this.ctx.getTransform();
                    let a, r;
                    if (0 === i && 0 === s) {
                        const i = Math.abs(e), s = Math.abs(n);
                        if (i === s) if (0 === t) a = r = 1 / i;
                        else {
                            const e = i * t;
                            a = r = e < 1 ? 1 / e : 1;
                        }
                        else if (0 === t) {
                            a = 1 / i;
                            r = 1 / s;
                        } else {
                            const e = i * t, n = s * t;
                            a = e < 1 ? 1 / e : 1;
                            r = n < 1 ? 1 / n : 1;
                        }
                    } else {
                        const o = Math.abs(e * n - i * s), l = Math.hypot(e, i), h = Math.hypot(s, n);
                        if (0 === t) {
                            a = h / o;
                            r = l / o;
                        } else {
                            const e = t * o;
                            a = h > e ? h / e : 1;
                            r = l > e ? l / e : 1;
                        }
                    }
                    this._cachedScaleForStroking[0] = a;
                    this._cachedScaleForStroking[1] = r;
                }
                return this._cachedScaleForStroking;
            }
            rescaleAndStroke(t) {
                const { ctx: e } = this, { lineWidth: i } = this.current, [s, n] = this.getScaleForStroking();
                e.lineWidth = i || 1;
                if (1 === s && 1 === n) {
                    e.stroke();
                    return;
                }
                const a = e.getLineDash();
                t && e.save();
                e.scale(s, n);
                if (a.length > 0) {
                    const t = Math.max(s, n);
                    e.setLineDash(a.map((e)=>e / t));
                    e.lineDashOffset /= t;
                }
                e.stroke();
                t && e.restore();
            }
            isContentVisible() {
                for(let t = this.markedContentStack.length - 1; t >= 0; t--)if (!this.markedContentStack[t].visible) return !1;
                return !0;
            }
        }
        for(const t in s.OPS)void 0 !== CanvasGraphics.prototype[t] && (CanvasGraphics.prototype[s.OPS[t]] = CanvasGraphics.prototype[t]);
    },
    473: (t, e, i)=>{
        i.d(e, {
            DOMCMapReaderFactory: ()=>DOMCMapReaderFactory,
            DOMCanvasFactory: ()=>DOMCanvasFactory,
            DOMFilterFactory: ()=>DOMFilterFactory,
            DOMSVGFactory: ()=>DOMSVGFactory,
            DOMStandardFontDataFactory: ()=>DOMStandardFontDataFactory,
            PDFDateString: ()=>PDFDateString,
            PageViewport: ()=>PageViewport,
            PixelsPerInch: ()=>PixelsPerInch,
            RenderingCancelledException: ()=>RenderingCancelledException,
            StatTimer: ()=>StatTimer,
            fetchData: ()=>fetchData,
            getColorValues: ()=>getColorValues,
            getCurrentTransform: ()=>getCurrentTransform,
            getCurrentTransformInverse: ()=>getCurrentTransformInverse,
            getFilenameFromUrl: ()=>getFilenameFromUrl,
            getPdfFilenameFromUrl: ()=>getPdfFilenameFromUrl,
            getRGB: ()=>getRGB,
            getXfaPageViewport: ()=>getXfaPageViewport,
            isDataScheme: ()=>isDataScheme,
            isPdfFile: ()=>isPdfFile,
            isValidFetchUrl: ()=>isValidFetchUrl,
            noContextMenu: ()=>noContextMenu,
            setLayerDimensions: ()=>setLayerDimensions
        });
        var s = i(822), n = i(266);
        const a = "http://www.w3.org/2000/svg";
        class PixelsPerInch {
            static{
                this.CSS = 96;
            }
            static{
                this.PDF = 72;
            }
            static{
                this.PDF_TO_CSS_UNITS = this.CSS / this.PDF;
            }
        }
        class DOMFilterFactory extends s.BaseFilterFactory {
            #ot;
            #lt;
            #H;
            #ht;
            #dt;
            #ct;
            #ut;
            #pt;
            #gt;
            #mt;
            #ft;
            constructor({ docId: t, ownerDocument: e = globalThis.document } = {}){
                super();
                this.#ft = 0;
                this.#H = t;
                this.#ht = e;
            }
            get #bt() {
                return this.#ot ||= new Map;
            }
            get #At() {
                if (!this.#lt) {
                    const t = this.#ht.createElement("div"), { style: e } = t;
                    e.visibility = "hidden";
                    e.contain = "strict";
                    e.width = e.height = 0;
                    e.position = "absolute";
                    e.top = e.left = 0;
                    e.zIndex = -1;
                    const i = this.#ht.createElementNS(a, "svg");
                    i.setAttribute("width", 0);
                    i.setAttribute("height", 0);
                    this.#lt = this.#ht.createElementNS(a, "defs");
                    t.append(i);
                    i.append(this.#lt);
                    this.#ht.body.append(t);
                }
                return this.#lt;
            }
            addFilter(t) {
                if (!t) return "none";
                let e, i, s, n, a = this.#bt.get(t);
                if (a) return a;
                if (1 === t.length) {
                    const a = t[0], r = new Array(256);
                    for(let t = 0; t < 256; t++)r[t] = a[t] / 255;
                    n = e = i = s = r.join(",");
                } else {
                    const [a, r, o] = t, l = new Array(256), h = new Array(256), d = new Array(256);
                    for(let t = 0; t < 256; t++){
                        l[t] = a[t] / 255;
                        h[t] = r[t] / 255;
                        d[t] = o[t] / 255;
                    }
                    e = l.join(",");
                    i = h.join(",");
                    s = d.join(",");
                    n = `${e}${i}${s}`;
                }
                a = this.#bt.get(n);
                if (a) {
                    this.#bt.set(t, a);
                    return a;
                }
                const r = `g_${this.#H}_transfer_map_${this.#ft++}`, o = `url(#${r})`;
                this.#bt.set(t, o);
                this.#bt.set(n, o);
                const l = this.#vt(r);
                this.#yt(e, i, s, l);
                return o;
            }
            addHCMFilter(t, e) {
                const i = `${t}-${e}`;
                if (this.#ct === i) return this.#ut;
                this.#ct = i;
                this.#ut = "none";
                this.#dt?.remove();
                if (!t || !e) return this.#ut;
                const s = this.#Et(t);
                t = n.Util.makeHexColor(...s);
                const a = this.#Et(e);
                e = n.Util.makeHexColor(...a);
                this.#At.style.color = "";
                if ("#000000" === t && "#ffffff" === e || t === e) return this.#ut;
                const r = new Array(256);
                for(let t = 0; t <= 255; t++){
                    const e = t / 255;
                    r[t] = e <= .03928 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4;
                }
                const o = r.join(","), l = `g_${this.#H}_hcm_filter`, h = this.#pt = this.#vt(l);
                this.#yt(o, o, o, h);
                this.#_t(h);
                const getSteps = (t, e)=>{
                    const i = s[t] / 255, n = a[t] / 255, r = new Array(e + 1);
                    for(let t = 0; t <= e; t++)r[t] = i + t / e * (n - i);
                    return r.join(",");
                };
                this.#yt(getSteps(0, 5), getSteps(1, 5), getSteps(2, 5), h);
                this.#ut = `url(#${l})`;
                return this.#ut;
            }
            addHighlightHCMFilter(t, e, i, s) {
                const n = `${t}-${e}-${i}-${s}`;
                if (this.#gt === n) return this.#mt;
                this.#gt = n;
                this.#mt = "none";
                this.#pt?.remove();
                if (!t || !e) return this.#mt;
                const [a, r] = [
                    t,
                    e
                ].map(this.#Et.bind(this));
                let o = Math.round(.2126 * a[0] + .7152 * a[1] + .0722 * a[2]), l = Math.round(.2126 * r[0] + .7152 * r[1] + .0722 * r[2]), [h, d] = [
                    i,
                    s
                ].map(this.#Et.bind(this));
                l < o && ([o, l, h, d] = [
                    l,
                    o,
                    d,
                    h
                ]);
                this.#At.style.color = "";
                const getSteps = (t, e, i)=>{
                    const s = new Array(256), n = (l - o) / i, a = t / 255, r = (e - t) / (255 * i);
                    let h = 0;
                    for(let t = 0; t <= i; t++){
                        const e = Math.round(o + t * n), i = a + t * r;
                        for(let t = h; t <= e; t++)s[t] = i;
                        h = e + 1;
                    }
                    for(let t = h; t < 256; t++)s[t] = s[h - 1];
                    return s.join(",");
                }, c = `g_${this.#H}_hcm_highlight_filter`, u = this.#pt = this.#vt(c);
                this.#_t(u);
                this.#yt(getSteps(h[0], d[0], 5), getSteps(h[1], d[1], 5), getSteps(h[2], d[2], 5), u);
                this.#mt = `url(#${c})`;
                return this.#mt;
            }
            destroy(t = !1) {
                if (!t || !this.#ut && !this.#mt) {
                    if (this.#lt) {
                        this.#lt.parentNode.parentNode.remove();
                        this.#lt = null;
                    }
                    if (this.#ot) {
                        this.#ot.clear();
                        this.#ot = null;
                    }
                    this.#ft = 0;
                }
            }
            #_t(t) {
                const e = this.#ht.createElementNS(a, "feColorMatrix");
                e.setAttribute("type", "matrix");
                e.setAttribute("values", "0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 1 0");
                t.append(e);
            }
            #vt(t) {
                const e = this.#ht.createElementNS(a, "filter");
                e.setAttribute("color-interpolation-filters", "sRGB");
                e.setAttribute("id", t);
                this.#At.append(e);
                return e;
            }
            #wt(t, e, i) {
                const s = this.#ht.createElementNS(a, e);
                s.setAttribute("type", "discrete");
                s.setAttribute("tableValues", i);
                t.append(s);
            }
            #yt(t, e, i, s) {
                const n = this.#ht.createElementNS(a, "feComponentTransfer");
                s.append(n);
                this.#wt(n, "feFuncR", t);
                this.#wt(n, "feFuncG", e);
                this.#wt(n, "feFuncB", i);
            }
            #Et(t) {
                this.#At.style.color = t;
                return getRGB(getComputedStyle(this.#At).getPropertyValue("color"));
            }
        }
        class DOMCanvasFactory extends s.BaseCanvasFactory {
            constructor({ ownerDocument: t = globalThis.document } = {}){
                super();
                this._document = t;
            }
            _createCanvas(t, e) {
                const i = this._document.createElement("canvas");
                i.width = t;
                i.height = e;
                return i;
            }
        }
        async function fetchData(t, e = "text") {
            if (isValidFetchUrl(t, document.baseURI)) {
                const i = await fetch(t);
                if (!i.ok) throw new Error(i.statusText);
                switch(e){
                    case "arraybuffer":
                        return i.arrayBuffer();
                    case "blob":
                        return i.blob();
                    case "json":
                        return i.json();
                }
                return i.text();
            }
            return new Promise((i, s)=>{
                const n = new XMLHttpRequest;
                n.open("GET", t, !0);
                n.responseType = e;
                n.onreadystatechange = ()=>{
                    if (n.readyState === XMLHttpRequest.DONE) {
                        if (200 === n.status || 0 === n.status) {
                            let t;
                            switch(e){
                                case "arraybuffer":
                                case "blob":
                                case "json":
                                    t = n.response;
                                    break;
                                default:
                                    t = n.responseText;
                            }
                            if (t) {
                                i(t);
                                return;
                            }
                        }
                        s(new Error(n.statusText));
                    }
                };
                n.send(null);
            });
        }
        class DOMCMapReaderFactory extends s.BaseCMapReaderFactory {
            _fetchData(t, e) {
                return fetchData(t, this.isCompressed ? "arraybuffer" : "text").then((t)=>({
                        cMapData: t instanceof ArrayBuffer ? new Uint8Array(t) : (0, n.stringToBytes)(t),
                        compressionType: e
                    }));
            }
        }
        class DOMStandardFontDataFactory extends s.BaseStandardFontDataFactory {
            _fetchData(t) {
                return fetchData(t, "arraybuffer").then((t)=>new Uint8Array(t));
            }
        }
        class DOMSVGFactory extends s.BaseSVGFactory {
            _createSVG(t) {
                return document.createElementNS(a, t);
            }
        }
        class PageViewport {
            constructor({ viewBox: t, scale: e, rotation: i, offsetX: s = 0, offsetY: n = 0, dontFlip: a = !1 }){
                this.viewBox = t;
                this.scale = e;
                this.rotation = i;
                this.offsetX = s;
                this.offsetY = n;
                const r = (t[2] + t[0]) / 2, o = (t[3] + t[1]) / 2;
                let l, h, d, c, u, p, g, m;
                (i %= 360) < 0 && (i += 360);
                switch(i){
                    case 180:
                        l = -1;
                        h = 0;
                        d = 0;
                        c = 1;
                        break;
                    case 90:
                        l = 0;
                        h = 1;
                        d = 1;
                        c = 0;
                        break;
                    case 270:
                        l = 0;
                        h = -1;
                        d = -1;
                        c = 0;
                        break;
                    case 0:
                        l = 1;
                        h = 0;
                        d = 0;
                        c = -1;
                        break;
                    default:
                        throw new Error("PageViewport: Invalid rotation, must be a multiple of 90 degrees.");
                }
                if (a) {
                    d = -d;
                    c = -c;
                }
                if (0 === l) {
                    u = Math.abs(o - t[1]) * e + s;
                    p = Math.abs(r - t[0]) * e + n;
                    g = (t[3] - t[1]) * e;
                    m = (t[2] - t[0]) * e;
                } else {
                    u = Math.abs(r - t[0]) * e + s;
                    p = Math.abs(o - t[1]) * e + n;
                    g = (t[2] - t[0]) * e;
                    m = (t[3] - t[1]) * e;
                }
                this.transform = [
                    l * e,
                    h * e,
                    d * e,
                    c * e,
                    u - l * e * r - d * e * o,
                    p - h * e * r - c * e * o
                ];
                this.width = g;
                this.height = m;
            }
            get rawDims() {
                const { viewBox: t } = this;
                return (0, n.shadow)(this, "rawDims", {
                    pageWidth: t[2] - t[0],
                    pageHeight: t[3] - t[1],
                    pageX: t[0],
                    pageY: t[1]
                });
            }
            clone({ scale: t = this.scale, rotation: e = this.rotation, offsetX: i = this.offsetX, offsetY: s = this.offsetY, dontFlip: n = !1 } = {}) {
                return new PageViewport({
                    viewBox: this.viewBox.slice(),
                    scale: t,
                    rotation: e,
                    offsetX: i,
                    offsetY: s,
                    dontFlip: n
                });
            }
            convertToViewportPoint(t, e) {
                return n.Util.applyTransform([
                    t,
                    e
                ], this.transform);
            }
            convertToViewportRectangle(t) {
                const e = n.Util.applyTransform([
                    t[0],
                    t[1]
                ], this.transform), i = n.Util.applyTransform([
                    t[2],
                    t[3]
                ], this.transform);
                return [
                    e[0],
                    e[1],
                    i[0],
                    i[1]
                ];
            }
            convertToPdfPoint(t, e) {
                return n.Util.applyInverseTransform([
                    t,
                    e
                ], this.transform);
            }
        }
        class RenderingCancelledException extends n.BaseException {
            constructor(t, e = 0){
                super(t, "RenderingCancelledException");
                this.extraDelay = e;
            }
        }
        function isDataScheme(t) {
            const e = t.length;
            let i = 0;
            for(; i < e && "" === t[i].trim();)i++;
            return "data:" === t.substring(i, i + 5).toLowerCase();
        }
        function isPdfFile(t) {
            return "string" == typeof t && /\.pdf$/i.test(t);
        }
        function getFilenameFromUrl(t, e = !1) {
            e || ([t] = t.split(/[#?]/, 1));
            return t.substring(t.lastIndexOf("/") + 1);
        }
        function getPdfFilenameFromUrl(t, e = "document.pdf") {
            if ("string" != typeof t) return e;
            if (isDataScheme(t)) {
                (0, n.warn)('getPdfFilenameFromUrl: ignore "data:"-URL for performance reasons.');
                return e;
            }
            const i = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i, s = /^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/.exec(t);
            let a = i.exec(s[1]) || i.exec(s[2]) || i.exec(s[3]);
            if (a) {
                a = a[0];
                if (a.includes("%")) try {
                    a = i.exec(decodeURIComponent(a))[0];
                } catch  {}
            }
            return a || e;
        }
        class StatTimer {
            time(t) {
                t in this.started && (0, n.warn)(`Timer is already running for ${t}`);
                this.started[t] = Date.now();
            }
            timeEnd(t) {
                t in this.started || (0, n.warn)(`Timer has not been started for ${t}`);
                this.times.push({
                    name: t,
                    start: this.started[t],
                    end: Date.now()
                });
                delete this.started[t];
            }
            toString() {
                const t = [];
                let e = 0;
                for (const { name: t } of this.times)e = Math.max(t.length, e);
                for (const { name: i, start: s, end: n } of this.times)t.push(`${i.padEnd(e)} ${n - s}ms\n`);
                return t.join("");
            }
            constructor(){
                this.started = Object.create(null);
                this.times = [];
            }
        }
        function isValidFetchUrl(t, e) {
            try {
                const { protocol: i } = e ? new URL(t, e) : new URL(t);
                return "http:" === i || "https:" === i;
            } catch  {
                return !1;
            }
        }
        function noContextMenu(t) {
            t.preventDefault();
        }
        let r;
        class PDFDateString {
            static toDateObject(t) {
                if (!t || "string" != typeof t) return null;
                r ||= new RegExp("^D:(\\d{4})(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?(\\d{2})?([Z|+|-])?(\\d{2})?'?(\\d{2})?'?");
                const e = r.exec(t);
                if (!e) return null;
                const i = parseInt(e[1], 10);
                let s = parseInt(e[2], 10);
                s = s >= 1 && s <= 12 ? s - 1 : 0;
                let n = parseInt(e[3], 10);
                n = n >= 1 && n <= 31 ? n : 1;
                let a = parseInt(e[4], 10);
                a = a >= 0 && a <= 23 ? a : 0;
                let o = parseInt(e[5], 10);
                o = o >= 0 && o <= 59 ? o : 0;
                let l = parseInt(e[6], 10);
                l = l >= 0 && l <= 59 ? l : 0;
                const h = e[7] || "Z";
                let d = parseInt(e[8], 10);
                d = d >= 0 && d <= 23 ? d : 0;
                let c = parseInt(e[9], 10) || 0;
                c = c >= 0 && c <= 59 ? c : 0;
                if ("-" === h) {
                    a += d;
                    o += c;
                } else if ("+" === h) {
                    a -= d;
                    o -= c;
                }
                return new Date(Date.UTC(i, s, n, a, o, l));
            }
        }
        function getXfaPageViewport(t, { scale: e = 1, rotation: i = 0 }) {
            const { width: s, height: n } = t.attributes.style, a = [
                0,
                0,
                parseInt(s),
                parseInt(n)
            ];
            return new PageViewport({
                viewBox: a,
                scale: e,
                rotation: i
            });
        }
        function getRGB(t) {
            if (t.startsWith("#")) {
                const e = parseInt(t.slice(1), 16);
                return [
                    (16711680 & e) >> 16,
                    (65280 & e) >> 8,
                    255 & e
                ];
            }
            if (t.startsWith("rgb(")) return t.slice(4, -1).split(",").map((t)=>parseInt(t));
            if (t.startsWith("rgba(")) return t.slice(5, -1).split(",").map((t)=>parseInt(t)).slice(0, 3);
            (0, n.warn)(`Not a valid color format: "${t}"`);
            return [
                0,
                0,
                0
            ];
        }
        function getColorValues(t) {
            const e = document.createElement("span");
            e.style.visibility = "hidden";
            document.body.append(e);
            for (const i of t.keys()){
                e.style.color = i;
                const s = window.getComputedStyle(e).color;
                t.set(i, getRGB(s));
            }
            e.remove();
        }
        function getCurrentTransform(t) {
            const { a: e, b: i, c: s, d: n, e: a, f: r } = t.getTransform();
            return [
                e,
                i,
                s,
                n,
                a,
                r
            ];
        }
        function getCurrentTransformInverse(t) {
            const { a: e, b: i, c: s, d: n, e: a, f: r } = t.getTransform().invertSelf();
            return [
                e,
                i,
                s,
                n,
                a,
                r
            ];
        }
        function setLayerDimensions(t, e, i = !1, s = !0) {
            if (e instanceof PageViewport) {
                const { pageWidth: s, pageHeight: a } = e.rawDims, { style: r } = t, o = n.FeatureTest.isCSSRoundSupported, l = `var(--scale-factor) * ${s}px`, h = `var(--scale-factor) * ${a}px`, d = o ? `round(${l}, 1px)` : `calc(${l})`, c = o ? `round(${h}, 1px)` : `calc(${h})`;
                if (i && e.rotation % 180 != 0) {
                    r.width = c;
                    r.height = d;
                } else {
                    r.width = d;
                    r.height = c;
                }
            }
            s && t.setAttribute("data-main-rotation", e.rotation);
        }
    },
    423: (t, e, i)=>{
        i.d(e, {
            DrawLayer: ()=>DrawLayer
        });
        var s = i(473), n = i(266);
        class DrawLayer {
            #b;
            #ft;
            #xt;
            constructor({ pageIndex: t }){
                this.#b = null;
                this.#ft = 0;
                this.#xt = new Map;
                this.pageIndex = t;
            }
            setParent(t) {
                if (this.#b) {
                    if (this.#b !== t) {
                        if (this.#xt.size > 0) for (const e of this.#xt.values()){
                            e.remove();
                            t.append(e);
                        }
                        this.#b = t;
                    }
                } else this.#b = t;
            }
            static get _svgFactory() {
                return (0, n.shadow)(this, "_svgFactory", new s.DOMSVGFactory);
            }
            static #Ct(t, { x: e, y: i, width: s, height: n }) {
                const { style: a } = t;
                a.top = 100 * i + "%";
                a.left = 100 * e + "%";
                a.width = 100 * s + "%";
                a.height = 100 * n + "%";
            }
            #St(t) {
                const e = DrawLayer._svgFactory.create(1, 1, !0);
                this.#b.append(e);
                DrawLayer.#Ct(e, t);
                return e;
            }
            highlight({ outlines: t, box: e }, i, s) {
                const n = this.#ft++, a = this.#St(e);
                a.classList.add("highlight");
                const r = DrawLayer._svgFactory.createElement("defs");
                a.append(r);
                const o = DrawLayer._svgFactory.createElement("path");
                r.append(o);
                const l = `path_p${this.pageIndex}_${n}`;
                o.setAttribute("id", l);
                o.setAttribute("d", DrawLayer.#Tt(t));
                const h = DrawLayer._svgFactory.createElement("clipPath");
                r.append(h);
                const d = `clip_${l}`;
                h.setAttribute("id", d);
                h.setAttribute("clipPathUnits", "objectBoundingBox");
                const c = DrawLayer._svgFactory.createElement("use");
                h.append(c);
                c.setAttribute("href", `#${l}`);
                c.classList.add("clip");
                const u = DrawLayer._svgFactory.createElement("use");
                a.append(u);
                a.setAttribute("fill", i);
                a.setAttribute("fill-opacity", s);
                u.setAttribute("href", `#${l}`);
                this.#xt.set(n, a);
                return {
                    id: n,
                    clipPathId: `url(#${d})`
                };
            }
            highlightOutline({ outlines: t, box: e }) {
                const i = this.#ft++, s = this.#St(e);
                s.classList.add("highlightOutline");
                const n = DrawLayer._svgFactory.createElement("defs");
                s.append(n);
                const a = DrawLayer._svgFactory.createElement("path");
                n.append(a);
                const r = `path_p${this.pageIndex}_${i}`;
                a.setAttribute("id", r);
                a.setAttribute("d", DrawLayer.#Tt(t));
                a.setAttribute("vector-effect", "non-scaling-stroke");
                const o = DrawLayer._svgFactory.createElement("use");
                s.append(o);
                o.setAttribute("href", `#${r}`);
                const l = o.cloneNode();
                s.append(l);
                o.classList.add("mainOutline");
                l.classList.add("secondaryOutline");
                this.#xt.set(i, s);
                return i;
            }
            static #Tt(t) {
                const e = [];
                for (const i of t){
                    let [t, s] = i;
                    e.push(`M${t} ${s}`);
                    for(let n = 2; n < i.length; n += 2){
                        const a = i[n], r = i[n + 1];
                        if (a === t) {
                            e.push(`V${r}`);
                            s = r;
                        } else if (r === s) {
                            e.push(`H${a}`);
                            t = a;
                        }
                    }
                    e.push("Z");
                }
                return e.join(" ");
            }
            updateBox(t, e) {
                DrawLayer.#Ct(this.#xt.get(t), e);
            }
            rotate(t, e) {
                this.#xt.get(t).setAttribute("data-main-rotation", e);
            }
            changeColor(t, e) {
                this.#xt.get(t).setAttribute("fill", e);
            }
            changeOpacity(t, e) {
                this.#xt.get(t).setAttribute("fill-opacity", e);
            }
            addClass(t, e) {
                this.#xt.get(t).classList.add(e);
            }
            removeClass(t, e) {
                this.#xt.get(t).classList.remove(e);
            }
            remove(t) {
                if (null !== this.#b) {
                    this.#xt.get(t).remove();
                    this.#xt.delete(t);
                }
            }
            destroy() {
                this.#b = null;
                for (const t of this.#xt.values())t.remove();
                this.#xt.clear();
            }
        }
    },
    629: (t, e, i)=>{
        i.d(e, {
            AnnotationEditorLayer: ()=>AnnotationEditorLayer
        });
        var s = i(266), n = i(115), a = i(812), r = i(640);
        class FreeTextEditor extends n.AnnotationEditor {
            #Mt;
            #Pt;
            #Ft;
            #Rt;
            #u;
            #kt;
            #Dt;
            #It;
            #Lt;
            static{
                this._freeTextDefaultContent = "";
            }
            static{
                this._internalPadding = 0;
            }
            static{
                this._defaultColor = null;
            }
            static{
                this._defaultFontSize = 10;
            }
            static get _keyboardManager() {
                const t = FreeTextEditor.prototype, arrowChecker = (t)=>t.isEmpty(), e = a.AnnotationEditorUIManager.TRANSLATE_SMALL, i = a.AnnotationEditorUIManager.TRANSLATE_BIG;
                return (0, s.shadow)(this, "_keyboardManager", new a.KeyboardManager([
                    [
                        [
                            "ctrl+s",
                            "mac+meta+s",
                            "ctrl+p",
                            "mac+meta+p"
                        ],
                        t.commitOrRemove,
                        {
                            bubbles: !0
                        }
                    ],
                    [
                        [
                            "ctrl+Enter",
                            "mac+meta+Enter",
                            "Escape",
                            "mac+Escape"
                        ],
                        t.commitOrRemove
                    ],
                    [
                        [
                            "ArrowLeft",
                            "mac+ArrowLeft"
                        ],
                        t._translateEmpty,
                        {
                            args: [
                                -e,
                                0
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowLeft",
                            "mac+shift+ArrowLeft"
                        ],
                        t._translateEmpty,
                        {
                            args: [
                                -i,
                                0
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ArrowRight",
                            "mac+ArrowRight"
                        ],
                        t._translateEmpty,
                        {
                            args: [
                                e,
                                0
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowRight",
                            "mac+shift+ArrowRight"
                        ],
                        t._translateEmpty,
                        {
                            args: [
                                i,
                                0
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ArrowUp",
                            "mac+ArrowUp"
                        ],
                        t._translateEmpty,
                        {
                            args: [
                                0,
                                -e
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowUp",
                            "mac+shift+ArrowUp"
                        ],
                        t._translateEmpty,
                        {
                            args: [
                                0,
                                -i
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ArrowDown",
                            "mac+ArrowDown"
                        ],
                        t._translateEmpty,
                        {
                            args: [
                                0,
                                e
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowDown",
                            "mac+shift+ArrowDown"
                        ],
                        t._translateEmpty,
                        {
                            args: [
                                0,
                                i
                            ],
                            checker: arrowChecker
                        }
                    ]
                ]));
            }
            static{
                this._type = "freetext";
            }
            static{
                this._editorType = s.AnnotationEditorType.FREETEXT;
            }
            constructor(t){
                super({
                    ...t,
                    name: "freeTextEditor"
                });
                this.#Mt = this.editorDivBlur.bind(this);
                this.#Pt = this.editorDivFocus.bind(this);
                this.#Ft = this.editorDivInput.bind(this);
                this.#Rt = this.editorDivKeydown.bind(this);
                this.#kt = "";
                this.#Dt = `${this.id}-editor`;
                this.#Lt = null;
                this.#u = t.color || FreeTextEditor._defaultColor || n.AnnotationEditor._defaultLineColor;
                this.#It = t.fontSize || FreeTextEditor._defaultFontSize;
            }
            static initialize(t) {
                n.AnnotationEditor.initialize(t, {
                    strings: [
                        "pdfjs-free-text-default-content"
                    ]
                });
                const e = getComputedStyle(document.documentElement);
                this._internalPadding = parseFloat(e.getPropertyValue("--freetext-padding"));
            }
            static updateDefaultParams(t, e) {
                switch(t){
                    case s.AnnotationEditorParamsType.FREETEXT_SIZE:
                        FreeTextEditor._defaultFontSize = e;
                        break;
                    case s.AnnotationEditorParamsType.FREETEXT_COLOR:
                        FreeTextEditor._defaultColor = e;
                }
            }
            updateParams(t, e) {
                switch(t){
                    case s.AnnotationEditorParamsType.FREETEXT_SIZE:
                        this.#Ot(e);
                        break;
                    case s.AnnotationEditorParamsType.FREETEXT_COLOR:
                        this.#Bt(e);
                }
            }
            static get defaultPropertiesToUpdate() {
                return [
                    [
                        s.AnnotationEditorParamsType.FREETEXT_SIZE,
                        FreeTextEditor._defaultFontSize
                    ],
                    [
                        s.AnnotationEditorParamsType.FREETEXT_COLOR,
                        FreeTextEditor._defaultColor || n.AnnotationEditor._defaultLineColor
                    ]
                ];
            }
            get propertiesToUpdate() {
                return [
                    [
                        s.AnnotationEditorParamsType.FREETEXT_SIZE,
                        this.#It
                    ],
                    [
                        s.AnnotationEditorParamsType.FREETEXT_COLOR,
                        this.#u
                    ]
                ];
            }
            #Ot(t) {
                const setFontsize = (t)=>{
                    this.editorDiv.style.fontSize = `calc(${t}px * var(--scale-factor))`;
                    this.translate(0, -(t - this.#It) * this.parentScale);
                    this.#It = t;
                    this.#Nt();
                }, e = this.#It;
                this.addCommands({
                    cmd: ()=>{
                        setFontsize(t);
                    },
                    undo: ()=>{
                        setFontsize(e);
                    },
                    mustExec: !0,
                    type: s.AnnotationEditorParamsType.FREETEXT_SIZE,
                    overwriteIfSameType: !0,
                    keepUndo: !0
                });
            }
            #Bt(t) {
                const e = this.#u;
                this.addCommands({
                    cmd: ()=>{
                        this.#u = this.editorDiv.style.color = t;
                    },
                    undo: ()=>{
                        this.#u = this.editorDiv.style.color = e;
                    },
                    mustExec: !0,
                    type: s.AnnotationEditorParamsType.FREETEXT_COLOR,
                    overwriteIfSameType: !0,
                    keepUndo: !0
                });
            }
            _translateEmpty(t, e) {
                this._uiManager.translateSelectedEditors(t, e, !0);
            }
            getInitialTranslation() {
                const t = this.parentScale;
                return [
                    -FreeTextEditor._internalPadding * t,
                    -(FreeTextEditor._internalPadding + this.#It) * t
                ];
            }
            rebuild() {
                if (this.parent) {
                    super.rebuild();
                    null !== this.div && (this.isAttachedToDOM || this.parent.add(this));
                }
            }
            enableEditMode() {
                if (!this.isInEditMode()) {
                    this.parent.setEditingState(!1);
                    this.parent.updateToolbar(s.AnnotationEditorType.FREETEXT);
                    super.enableEditMode();
                    this.overlayDiv.classList.remove("enabled");
                    this.editorDiv.contentEditable = !0;
                    this._isDraggable = !1;
                    this.div.removeAttribute("aria-activedescendant");
                    this.editorDiv.addEventListener("keydown", this.#Rt);
                    this.editorDiv.addEventListener("focus", this.#Pt);
                    this.editorDiv.addEventListener("blur", this.#Mt);
                    this.editorDiv.addEventListener("input", this.#Ft);
                }
            }
            disableEditMode() {
                if (this.isInEditMode()) {
                    this.parent.setEditingState(!0);
                    super.disableEditMode();
                    this.overlayDiv.classList.add("enabled");
                    this.editorDiv.contentEditable = !1;
                    this.div.setAttribute("aria-activedescendant", this.#Dt);
                    this._isDraggable = !0;
                    this.editorDiv.removeEventListener("keydown", this.#Rt);
                    this.editorDiv.removeEventListener("focus", this.#Pt);
                    this.editorDiv.removeEventListener("blur", this.#Mt);
                    this.editorDiv.removeEventListener("input", this.#Ft);
                    this.div.focus({
                        preventScroll: !0
                    });
                    this.isEditing = !1;
                    this.parent.div.classList.add("freetextEditing");
                }
            }
            focusin(t) {
                if (this._focusEventsAllowed) {
                    super.focusin(t);
                    t.target !== this.editorDiv && this.editorDiv.focus();
                }
            }
            onceAdded() {
                if (this.width) this.#Ut();
                else {
                    this.enableEditMode();
                    this.editorDiv.focus();
                    this._initialOptions?.isCentered && this.center();
                    this._initialOptions = null;
                }
            }
            isEmpty() {
                return !this.editorDiv || "" === this.editorDiv.innerText.trim();
            }
            remove() {
                this.isEditing = !1;
                if (this.parent) {
                    this.parent.setEditingState(!0);
                    this.parent.div.classList.add("freetextEditing");
                }
                super.remove();
            }
            #zt() {
                const t = this.editorDiv.getElementsByTagName("div");
                if (0 === t.length) return this.editorDiv.innerText;
                const e = [];
                for (const i of t)e.push(i.innerText.replace(/\r\n?|\n/, ""));
                return e.join("\n");
            }
            #Nt() {
                const [t, e] = this.parentDimensions;
                let i;
                if (this.isAttachedToDOM) i = this.div.getBoundingClientRect();
                else {
                    const { currentLayer: t, div: e } = this, s = e.style.display;
                    e.style.display = "hidden";
                    t.div.append(this.div);
                    i = e.getBoundingClientRect();
                    e.remove();
                    e.style.display = s;
                }
                if (this.rotation % 180 == this.parentRotation % 180) {
                    this.width = i.width / t;
                    this.height = i.height / e;
                } else {
                    this.width = i.height / t;
                    this.height = i.width / e;
                }
                this.fixAndSetPosition();
            }
            commit() {
                if (!this.isInEditMode()) return;
                super.commit();
                this.disableEditMode();
                const t = this.#kt, e = this.#kt = this.#zt().trimEnd();
                if (t === e) return;
                const setText = (t)=>{
                    this.#kt = t;
                    if (t) {
                        this.#Ht();
                        this._uiManager.rebuild(this);
                        this.#Nt();
                    } else this.remove();
                };
                this.addCommands({
                    cmd: ()=>{
                        setText(e);
                    },
                    undo: ()=>{
                        setText(t);
                    },
                    mustExec: !1
                });
                this.#Nt();
            }
            shouldGetKeyboardEvents() {
                return this.isInEditMode();
            }
            enterInEditMode() {
                this.enableEditMode();
                this.editorDiv.focus();
            }
            dblclick(t) {
                this.enterInEditMode();
            }
            keydown(t) {
                if (t.target === this.div && "Enter" === t.key) {
                    this.enterInEditMode();
                    t.preventDefault();
                }
            }
            editorDivKeydown(t) {
                FreeTextEditor._keyboardManager.exec(this, t);
            }
            editorDivFocus(t) {
                this.isEditing = !0;
            }
            editorDivBlur(t) {
                this.isEditing = !1;
            }
            editorDivInput(t) {
                this.parent.div.classList.toggle("freetextEditing", this.isEmpty());
            }
            disableEditing() {
                this.editorDiv.setAttribute("role", "comment");
                this.editorDiv.removeAttribute("aria-multiline");
            }
            enableEditing() {
                this.editorDiv.setAttribute("role", "textbox");
                this.editorDiv.setAttribute("aria-multiline", !0);
            }
            render() {
                if (this.div) return this.div;
                let t, e;
                if (this.width) {
                    t = this.x;
                    e = this.y;
                }
                super.render();
                this.editorDiv = document.createElement("div");
                this.editorDiv.className = "internal";
                this.editorDiv.setAttribute("id", this.#Dt);
                this.editorDiv.setAttribute("data-l10n-id", "pdfjs-free-text");
                this.enableEditing();
                n.AnnotationEditor._l10nPromise.get("pdfjs-free-text-default-content").then((t)=>this.editorDiv?.setAttribute("default-content", t));
                this.editorDiv.contentEditable = !0;
                const { style: i } = this.editorDiv;
                i.fontSize = `calc(${this.#It}px * var(--scale-factor))`;
                i.color = this.#u;
                this.div.append(this.editorDiv);
                this.overlayDiv = document.createElement("div");
                this.overlayDiv.classList.add("overlay", "enabled");
                this.div.append(this.overlayDiv);
                (0, a.bindEvents)(this, this.div, [
                    "dblclick",
                    "keydown"
                ]);
                if (this.width) {
                    const [i, s] = this.parentDimensions;
                    if (this.annotationElementId) {
                        const { position: n } = this.#Lt;
                        let [a, r] = this.getInitialTranslation();
                        [a, r] = this.pageTranslationToScreen(a, r);
                        const [o, l] = this.pageDimensions, [h, d] = this.pageTranslation;
                        let c, u;
                        switch(this.rotation){
                            case 0:
                                c = t + (n[0] - h) / o;
                                u = e + this.height - (n[1] - d) / l;
                                break;
                            case 90:
                                c = t + (n[0] - h) / o;
                                u = e - (n[1] - d) / l;
                                [a, r] = [
                                    r,
                                    -a
                                ];
                                break;
                            case 180:
                                c = t - this.width + (n[0] - h) / o;
                                u = e - (n[1] - d) / l;
                                [a, r] = [
                                    -a,
                                    -r
                                ];
                                break;
                            case 270:
                                c = t + (n[0] - h - this.height * l) / o;
                                u = e + (n[1] - d - this.width * o) / l;
                                [a, r] = [
                                    -r,
                                    a
                                ];
                        }
                        this.setAt(c * i, u * s, a, r);
                    } else this.setAt(t * i, e * s, this.width * i, this.height * s);
                    this.#Ht();
                    this._isDraggable = !0;
                    this.editorDiv.contentEditable = !1;
                } else {
                    this._isDraggable = !1;
                    this.editorDiv.contentEditable = !0;
                }
                return this.div;
            }
            #Ht() {
                this.editorDiv.replaceChildren();
                if (this.#kt) for (const t of this.#kt.split("\n")){
                    const e = document.createElement("div");
                    e.append(t ? document.createTextNode(t) : document.createElement("br"));
                    this.editorDiv.append(e);
                }
            }
            get contentDiv() {
                return this.editorDiv;
            }
            static deserialize(t, e, i) {
                let n = null;
                if (t instanceof r.FreeTextAnnotationElement) {
                    const { data: { defaultAppearanceData: { fontSize: e, fontColor: i }, rect: a, rotation: r, id: o }, textContent: l, textPosition: h, parent: { page: { pageNumber: d } } } = t;
                    if (!l || 0 === l.length) return null;
                    n = t = {
                        annotationType: s.AnnotationEditorType.FREETEXT,
                        color: Array.from(i),
                        fontSize: e,
                        value: l.join("\n"),
                        position: h,
                        pageIndex: d - 1,
                        rect: a,
                        rotation: r,
                        id: o,
                        deleted: !1
                    };
                }
                const a = super.deserialize(t, e, i);
                a.#It = t.fontSize;
                a.#u = s.Util.makeHexColor(...t.color);
                a.#kt = t.value;
                a.annotationElementId = t.id || null;
                a.#Lt = n;
                return a;
            }
            serialize(t = !1) {
                if (this.isEmpty()) return null;
                if (this.deleted) return {
                    pageIndex: this.pageIndex,
                    id: this.annotationElementId,
                    deleted: !0
                };
                const e = FreeTextEditor._internalPadding * this.parentScale, i = this.getRect(e, e), a = n.AnnotationEditor._colorManager.convert(this.isAttachedToDOM ? getComputedStyle(this.editorDiv).color : this.#u), r = {
                    annotationType: s.AnnotationEditorType.FREETEXT,
                    color: a,
                    fontSize: this.#It,
                    value: this.#kt,
                    pageIndex: this.pageIndex,
                    rect: i,
                    rotation: this.rotation,
                    structTreeParentId: this._structTreeParentId
                };
                if (t) return r;
                if (this.annotationElementId && !this.#jt(r)) return null;
                r.id = this.annotationElementId;
                return r;
            }
            #jt(t) {
                const { value: e, fontSize: i, color: s, rect: n, pageIndex: a } = this.#Lt;
                return t.value !== e || t.fontSize !== i || t.rect.some((t, e)=>Math.abs(t - n[e]) >= 1) || t.color.some((t, e)=>t !== s[e]) || t.pageIndex !== a;
            }
            #Ut(t = !1) {
                if (!this.annotationElementId) return;
                this.#Nt();
                if (!t && (0 === this.width || 0 === this.height)) {
                    setTimeout(()=>this.#Ut(!0), 0);
                    return;
                }
                const e = FreeTextEditor._internalPadding * this.parentScale;
                this.#Lt.rect = this.getRect(e, e);
            }
        }
        var o = i(97), l = i(405);
        class HighlightEditor extends n.AnnotationEditor {
            #Vt;
            #Wt;
            #qt;
            #Gt;
            #$t;
            #Kt;
            #ft;
            #Xt;
            #Yt;
            #Jt;
            static{
                this._defaultColor = null;
            }
            static{
                this._defaultOpacity = 1;
            }
            static{
                this._type = "highlight";
            }
            static{
                this._editorType = s.AnnotationEditorType.HIGHLIGHT;
            }
            constructor(t){
                super({
                    ...t,
                    name: "highlightEditor"
                });
                this.#Wt = null;
                this.#qt = null;
                this.#Gt = null;
                this.#$t = null;
                this.#Kt = null;
                this.#ft = null;
                this.#Xt = null;
                this.#Jt = null;
                HighlightEditor._defaultColor ||= this._uiManager.highlightColors?.values().next().value || "#fff066";
                this.color = t.color || HighlightEditor._defaultColor;
                this.#Yt = t.opacity || HighlightEditor._defaultOpacity;
                this.#Vt = t.boxes || null;
                this._isDraggable = !1;
                this.#Qt();
                this.#Zt();
                this.rotate(this.rotation);
            }
            #Qt() {
                const t = new l.Outliner(this.#Vt, .001);
                this.#Kt = t.getOutlines();
                ({ x: this.x, y: this.y, width: this.width, height: this.height } = this.#Kt.box);
                const e = new l.Outliner(this.#Vt, .0025, .001, "ltr" === this._uiManager.direction);
                this.#Gt = e.getOutlines();
                const { lastPoint: i } = this.#Gt.box;
                this.#Xt = [
                    (i[0] - this.x) / this.width,
                    (i[1] - this.y) / this.height
                ];
            }
            static initialize(t) {
                n.AnnotationEditor.initialize(t);
            }
            static updateDefaultParams(t, e) {
                if (t === s.AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR) HighlightEditor._defaultColor = e;
            }
            get toolbarPosition() {
                return this.#Xt;
            }
            updateParams(t, e) {
                if (t === s.AnnotationEditorParamsType.HIGHLIGHT_COLOR) this.#Bt(e);
            }
            static get defaultPropertiesToUpdate() {
                return [
                    [
                        s.AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR,
                        HighlightEditor._defaultColor
                    ]
                ];
            }
            get propertiesToUpdate() {
                return [
                    [
                        s.AnnotationEditorParamsType.HIGHLIGHT_COLOR,
                        this.color || HighlightEditor._defaultColor
                    ]
                ];
            }
            #Bt(t) {
                const e = this.color;
                this.addCommands({
                    cmd: ()=>{
                        this.color = t;
                        this.parent.drawLayer.changeColor(this.#ft, t);
                        this.#qt?.updateColor(t);
                    },
                    undo: ()=>{
                        this.color = e;
                        this.parent.drawLayer.changeColor(this.#ft, e);
                        this.#qt?.updateColor(e);
                    },
                    mustExec: !0,
                    type: s.AnnotationEditorParamsType.HIGHLIGHT_COLOR,
                    overwriteIfSameType: !0,
                    keepUndo: !0
                });
            }
            async addEditToolbar() {
                const t = await super.addEditToolbar();
                if (!t) return null;
                if (this._uiManager.highlightColors) {
                    this.#qt = new o.ColorPicker({
                        editor: this
                    });
                    t.addColorPicker(this.#qt);
                }
                return t;
            }
            disableEditing() {
                super.disableEditing();
                this.div.classList.toggle("disabled", !0);
            }
            enableEditing() {
                super.enableEditing();
                this.div.classList.toggle("disabled", !1);
            }
            fixAndSetPosition() {
                return super.fixAndSetPosition(0);
            }
            getRect(t, e) {
                return super.getRect(t, e, 0);
            }
            onceAdded() {
                this.parent.addUndoableEditor(this);
                this.div.focus();
            }
            remove() {
                super.remove();
                this.#te();
            }
            rebuild() {
                if (this.parent) {
                    super.rebuild();
                    if (null !== this.div) {
                        this.#Zt();
                        this.isAttachedToDOM || this.parent.add(this);
                    }
                }
            }
            setParent(t) {
                let e = !1;
                if (this.parent && !t) this.#te();
                else if (t) {
                    this.#Zt(t);
                    e = !this.parent && this.div?.classList.contains("selectedEditor");
                }
                super.setParent(t);
                e && this.select();
            }
            #te() {
                if (null !== this.#ft && this.parent) {
                    this.parent.drawLayer.remove(this.#ft);
                    this.#ft = null;
                    this.parent.drawLayer.remove(this.#Jt);
                    this.#Jt = null;
                }
            }
            #Zt(t = this.parent) {
                if (null === this.#ft) {
                    ({ id: this.#ft, clipPathId: this.#Wt } = t.drawLayer.highlight(this.#Kt, this.color, this.#Yt));
                    this.#$t && (this.#$t.style.clipPath = this.#Wt);
                    this.#Jt = t.drawLayer.highlightOutline(this.#Gt);
                }
            }
            static #ee({ x: t, y: e, width: i, height: s }, n) {
                switch(n){
                    case 90:
                        return {
                            x: 1 - e - s,
                            y: t,
                            width: s,
                            height: i
                        };
                    case 180:
                        return {
                            x: 1 - t - i,
                            y: 1 - e - s,
                            width: i,
                            height: s
                        };
                    case 270:
                        return {
                            x: e,
                            y: 1 - t - i,
                            width: s,
                            height: i
                        };
                }
                return {
                    x: t,
                    y: e,
                    width: i,
                    height: s
                };
            }
            rotate(t) {
                const { drawLayer: e } = this.parent;
                e.rotate(this.#ft, t);
                e.rotate(this.#Jt, t);
                e.updateBox(this.#ft, HighlightEditor.#ee(this, t));
                e.updateBox(this.#Jt, HighlightEditor.#ee(this.#Gt.box, t));
            }
            render() {
                if (this.div) return this.div;
                const t = super.render(), e = this.#$t = document.createElement("div");
                t.append(e);
                e.className = "internal";
                e.style.clipPath = this.#Wt;
                const [i, s] = this.parentDimensions;
                this.setDims(this.width * i, this.height * s);
                (0, a.bindEvents)(this, this.#$t, [
                    "pointerover",
                    "pointerleave"
                ]);
                this.enableEditing();
                return t;
            }
            pointerover() {
                this.parent.drawLayer.addClass(this.#Jt, "hovered");
            }
            pointerleave() {
                this.parent.drawLayer.removeClass(this.#Jt, "hovered");
            }
            select() {
                super.select();
                this.parent?.drawLayer.removeClass(this.#Jt, "hovered");
                this.parent?.drawLayer.addClass(this.#Jt, "selected");
            }
            unselect() {
                super.unselect();
                this.parent?.drawLayer.removeClass(this.#Jt, "selected");
            }
            #ie() {
                const [t, e] = this.pageDimensions, i = this.#Vt, s = new Array(8 * i.length);
                let n = 0;
                for (const { x: a, y: r, width: o, height: l } of i){
                    const i = a * t, h = (1 - r - l) * e;
                    s[n] = s[n + 4] = i;
                    s[n + 1] = s[n + 3] = h;
                    s[n + 2] = s[n + 6] = i + o * t;
                    s[n + 5] = s[n + 7] = h + l * e;
                    n += 8;
                }
                return s;
            }
            #se() {
                const [t, e] = this.pageDimensions, i = this.width * t, s = this.height * e, n = this.x * t, a = (1 - this.y - this.height) * e, r = [];
                for (const t of this.#Kt.outlines){
                    const e = new Array(t.length);
                    for(let r = 0; r < t.length; r += 2){
                        e[r] = n + t[r] * i;
                        e[r + 1] = a + (1 - t[r + 1]) * s;
                    }
                    r.push(e);
                }
                return r;
            }
            static deserialize(t, e, i) {
                const n = super.deserialize(t, e, i), { rect: a, color: r, quadPoints: o } = t;
                n.color = s.Util.makeHexColor(...r);
                n.#Yt = t.opacity;
                const [l, h] = n.pageDimensions;
                n.width = (a[2] - a[0]) / l;
                n.height = (a[3] - a[1]) / h;
                const d = n.#Vt = [];
                for(let t = 0; t < o.length; t += 8)d.push({
                    x: o[4] / l,
                    y: 1 - o[t + 5] / h,
                    width: (o[t + 2] - o[t]) / l,
                    height: (o[t + 5] - o[t + 1]) / h
                });
                n.#Qt();
                return n;
            }
            serialize(t = !1) {
                if (this.isEmpty() || t) return null;
                const e = this.getRect(0, 0), i = n.AnnotationEditor._colorManager.convert(this.color);
                return {
                    annotationType: s.AnnotationEditorType.HIGHLIGHT,
                    color: i,
                    opacity: this.#Yt,
                    quadPoints: this.#ie(),
                    outlines: this.#se(),
                    pageIndex: this.pageIndex,
                    rect: e,
                    rotation: 0,
                    structTreeParentId: this._structTreeParentId
                };
            }
            static canCreateNewEmptyEditor() {
                return !1;
            }
        }
        var h = i(473);
        class InkEditor extends n.AnnotationEditor {
            #ne;
            #ae;
            #re;
            #oe;
            #le;
            #he;
            #de;
            #ce;
            #ue;
            #pe;
            #ge;
            #me;
            #fe;
            #be;
            #Ae;
            static{
                this._defaultColor = null;
            }
            static{
                this._defaultOpacity = 1;
            }
            static{
                this._defaultThickness = 1;
            }
            static{
                this._type = "ink";
            }
            static{
                this._editorType = s.AnnotationEditorType.INK;
            }
            constructor(t){
                super({
                    ...t,
                    name: "inkEditor"
                });
                this.#ne = 0;
                this.#ae = 0;
                this.#re = this.canvasPointermove.bind(this);
                this.#oe = this.canvasPointerleave.bind(this);
                this.#le = this.canvasPointerup.bind(this);
                this.#he = this.canvasPointerdown.bind(this);
                this.#de = null;
                this.#ce = new Path2D;
                this.#ue = !1;
                this.#pe = !1;
                this.#ge = !1;
                this.#me = null;
                this.#fe = 0;
                this.#be = 0;
                this.#Ae = null;
                this.color = t.color || null;
                this.thickness = t.thickness || null;
                this.opacity = t.opacity || null;
                this.paths = [];
                this.bezierPath2D = [];
                this.allRawPaths = [];
                this.currentPath = [];
                this.scaleFactor = 1;
                this.translationX = this.translationY = 0;
                this.x = 0;
                this.y = 0;
                this._willKeepAspectRatio = !0;
            }
            static initialize(t) {
                n.AnnotationEditor.initialize(t);
            }
            static updateDefaultParams(t, e) {
                switch(t){
                    case s.AnnotationEditorParamsType.INK_THICKNESS:
                        InkEditor._defaultThickness = e;
                        break;
                    case s.AnnotationEditorParamsType.INK_COLOR:
                        InkEditor._defaultColor = e;
                        break;
                    case s.AnnotationEditorParamsType.INK_OPACITY:
                        InkEditor._defaultOpacity = e / 100;
                }
            }
            updateParams(t, e) {
                switch(t){
                    case s.AnnotationEditorParamsType.INK_THICKNESS:
                        this.#ve(e);
                        break;
                    case s.AnnotationEditorParamsType.INK_COLOR:
                        this.#Bt(e);
                        break;
                    case s.AnnotationEditorParamsType.INK_OPACITY:
                        this.#ye(e);
                }
            }
            static get defaultPropertiesToUpdate() {
                return [
                    [
                        s.AnnotationEditorParamsType.INK_THICKNESS,
                        InkEditor._defaultThickness
                    ],
                    [
                        s.AnnotationEditorParamsType.INK_COLOR,
                        InkEditor._defaultColor || n.AnnotationEditor._defaultLineColor
                    ],
                    [
                        s.AnnotationEditorParamsType.INK_OPACITY,
                        Math.round(100 * InkEditor._defaultOpacity)
                    ]
                ];
            }
            get propertiesToUpdate() {
                return [
                    [
                        s.AnnotationEditorParamsType.INK_THICKNESS,
                        this.thickness || InkEditor._defaultThickness
                    ],
                    [
                        s.AnnotationEditorParamsType.INK_COLOR,
                        this.color || InkEditor._defaultColor || n.AnnotationEditor._defaultLineColor
                    ],
                    [
                        s.AnnotationEditorParamsType.INK_OPACITY,
                        Math.round(100 * (this.opacity ?? InkEditor._defaultOpacity))
                    ]
                ];
            }
            #ve(t) {
                const e = this.thickness;
                this.addCommands({
                    cmd: ()=>{
                        this.thickness = t;
                        this.#Ee();
                    },
                    undo: ()=>{
                        this.thickness = e;
                        this.#Ee();
                    },
                    mustExec: !0,
                    type: s.AnnotationEditorParamsType.INK_THICKNESS,
                    overwriteIfSameType: !0,
                    keepUndo: !0
                });
            }
            #Bt(t) {
                const e = this.color;
                this.addCommands({
                    cmd: ()=>{
                        this.color = t;
                        this.#_e();
                    },
                    undo: ()=>{
                        this.color = e;
                        this.#_e();
                    },
                    mustExec: !0,
                    type: s.AnnotationEditorParamsType.INK_COLOR,
                    overwriteIfSameType: !0,
                    keepUndo: !0
                });
            }
            #ye(t) {
                t /= 100;
                const e = this.opacity;
                this.addCommands({
                    cmd: ()=>{
                        this.opacity = t;
                        this.#_e();
                    },
                    undo: ()=>{
                        this.opacity = e;
                        this.#_e();
                    },
                    mustExec: !0,
                    type: s.AnnotationEditorParamsType.INK_OPACITY,
                    overwriteIfSameType: !0,
                    keepUndo: !0
                });
            }
            rebuild() {
                if (this.parent) {
                    super.rebuild();
                    if (null !== this.div) {
                        if (!this.canvas) {
                            this.#we();
                            this.#xe();
                        }
                        if (!this.isAttachedToDOM) {
                            this.parent.add(this);
                            this.#Ce();
                        }
                        this.#Ee();
                    }
                }
            }
            remove() {
                if (null !== this.canvas) {
                    this.isEmpty() || this.commit();
                    this.canvas.width = this.canvas.height = 0;
                    this.canvas.remove();
                    this.canvas = null;
                    if (this.#de) {
                        clearTimeout(this.#de);
                        this.#de = null;
                    }
                    this.#me.disconnect();
                    this.#me = null;
                    super.remove();
                }
            }
            setParent(t) {
                !this.parent && t ? this._uiManager.removeShouldRescale(this) : this.parent && null === t && this._uiManager.addShouldRescale(this);
                super.setParent(t);
            }
            onScaleChanging() {
                const [t, e] = this.parentDimensions, i = this.width * t, s = this.height * e;
                this.setDimensions(i, s);
            }
            enableEditMode() {
                if (!this.#ue && null !== this.canvas) {
                    super.enableEditMode();
                    this._isDraggable = !1;
                    this.canvas.addEventListener("pointerdown", this.#he);
                }
            }
            disableEditMode() {
                if (this.isInEditMode() && null !== this.canvas) {
                    super.disableEditMode();
                    this._isDraggable = !this.isEmpty();
                    this.div.classList.remove("editing");
                    this.canvas.removeEventListener("pointerdown", this.#he);
                }
            }
            onceAdded() {
                this._isDraggable = !this.isEmpty();
            }
            isEmpty() {
                return 0 === this.paths.length || 1 === this.paths.length && 0 === this.paths[0].length;
            }
            #Se() {
                const { parentRotation: t, parentDimensions: [e, i] } = this;
                switch(t){
                    case 90:
                        return [
                            0,
                            i,
                            i,
                            e
                        ];
                    case 180:
                        return [
                            e,
                            i,
                            e,
                            i
                        ];
                    case 270:
                        return [
                            e,
                            0,
                            i,
                            e
                        ];
                    default:
                        return [
                            0,
                            0,
                            e,
                            i
                        ];
                }
            }
            #Te() {
                const { ctx: t, color: e, opacity: i, thickness: s, parentScale: n, scaleFactor: r } = this;
                t.lineWidth = s * n / r;
                t.lineCap = "round";
                t.lineJoin = "round";
                t.miterLimit = 10;
                t.strokeStyle = `${e}${(0, a.opacityToHex)(i)}`;
            }
            #Me(t, e) {
                this.canvas.addEventListener("contextmenu", h.noContextMenu);
                this.canvas.addEventListener("pointerleave", this.#oe);
                this.canvas.addEventListener("pointermove", this.#re);
                this.canvas.addEventListener("pointerup", this.#le);
                this.canvas.removeEventListener("pointerdown", this.#he);
                this.isEditing = !0;
                if (!this.#ge) {
                    this.#ge = !0;
                    this.#Ce();
                    this.thickness ||= InkEditor._defaultThickness;
                    this.color ||= InkEditor._defaultColor || n.AnnotationEditor._defaultLineColor;
                    this.opacity ??= InkEditor._defaultOpacity;
                }
                this.currentPath.push([
                    t,
                    e
                ]);
                this.#pe = !1;
                this.#Te();
                this.#Ae = ()=>{
                    this.#Pe();
                    this.#Ae && window.requestAnimationFrame(this.#Ae);
                };
                window.requestAnimationFrame(this.#Ae);
            }
            #Fe(t, e) {
                const [i, s] = this.currentPath.at(-1);
                if (this.currentPath.length > 1 && t === i && e === s) return;
                const n = this.currentPath;
                let a = this.#ce;
                n.push([
                    t,
                    e
                ]);
                this.#pe = !0;
                if (n.length <= 2) {
                    a.moveTo(...n[0]);
                    a.lineTo(t, e);
                } else {
                    if (3 === n.length) {
                        this.#ce = a = new Path2D;
                        a.moveTo(...n[0]);
                    }
                    this.#Re(a, ...n.at(-3), ...n.at(-2), t, e);
                }
            }
            #ke() {
                if (0 === this.currentPath.length) return;
                const t = this.currentPath.at(-1);
                this.#ce.lineTo(...t);
            }
            #De(t, e) {
                this.#Ae = null;
                t = Math.min(Math.max(t, 0), this.canvas.width);
                e = Math.min(Math.max(e, 0), this.canvas.height);
                this.#Fe(t, e);
                this.#ke();
                let i;
                if (1 !== this.currentPath.length) i = this.#Ie();
                else {
                    const s = [
                        t,
                        e
                    ];
                    i = [
                        [
                            s,
                            s.slice(),
                            s.slice(),
                            s
                        ]
                    ];
                }
                const s = this.#ce, n = this.currentPath;
                this.currentPath = [];
                this.#ce = new Path2D;
                this.addCommands({
                    cmd: ()=>{
                        this.allRawPaths.push(n);
                        this.paths.push(i);
                        this.bezierPath2D.push(s);
                        this.rebuild();
                    },
                    undo: ()=>{
                        this.allRawPaths.pop();
                        this.paths.pop();
                        this.bezierPath2D.pop();
                        if (0 === this.paths.length) this.remove();
                        else {
                            if (!this.canvas) {
                                this.#we();
                                this.#xe();
                            }
                            this.#Ee();
                        }
                    },
                    mustExec: !0
                });
            }
            #Pe() {
                if (!this.#pe) return;
                this.#pe = !1;
                const t = Math.ceil(this.thickness * this.parentScale), e = this.currentPath.slice(-3), i = e.map((t)=>t[0]), s = e.map((t)=>t[1]), { ctx: n } = (Math.min(...i), Math.max(...i), Math.min(...s), Math.max(...s), this);
                n.save();
                n.clearRect(0, 0, this.canvas.width, this.canvas.height);
                for (const t of this.bezierPath2D)n.stroke(t);
                n.stroke(this.#ce);
                n.restore();
            }
            #Re(t, e, i, s, n, a, r) {
                const o = (e + s) / 2, l = (i + n) / 2, h = (s + a) / 2, d = (n + r) / 2;
                t.bezierCurveTo(o + 2 * (s - o) / 3, l + 2 * (n - l) / 3, h + 2 * (s - h) / 3, d + 2 * (n - d) / 3, h, d);
            }
            #Ie() {
                const t = this.currentPath;
                if (t.length <= 2) return [
                    [
                        t[0],
                        t[0],
                        t.at(-1),
                        t.at(-1)
                    ]
                ];
                const e = [];
                let i, [s, n] = t[0];
                for(i = 1; i < t.length - 2; i++){
                    const [a, r] = t[i], [o, l] = t[i + 1], h = (a + o) / 2, d = (r + l) / 2, c = [
                        s + 2 * (a - s) / 3,
                        n + 2 * (r - n) / 3
                    ], u = [
                        h + 2 * (a - h) / 3,
                        d + 2 * (r - d) / 3
                    ];
                    e.push([
                        [
                            s,
                            n
                        ],
                        c,
                        u,
                        [
                            h,
                            d
                        ]
                    ]);
                    [s, n] = [
                        h,
                        d
                    ];
                }
                const [a, r] = t[i], [o, l] = t[i + 1], h = [
                    s + 2 * (a - s) / 3,
                    n + 2 * (r - n) / 3
                ], d = [
                    o + 2 * (a - o) / 3,
                    l + 2 * (r - l) / 3
                ];
                e.push([
                    [
                        s,
                        n
                    ],
                    h,
                    d,
                    [
                        o,
                        l
                    ]
                ]);
                return e;
            }
            #_e() {
                if (this.isEmpty()) {
                    this.#Le();
                    return;
                }
                this.#Te();
                const { canvas: t, ctx: e } = this;
                e.setTransform(1, 0, 0, 1, 0, 0);
                e.clearRect(0, 0, t.width, t.height);
                this.#Le();
                for (const t of this.bezierPath2D)e.stroke(t);
            }
            commit() {
                if (!this.#ue) {
                    super.commit();
                    this.isEditing = !1;
                    this.disableEditMode();
                    this.setInForeground();
                    this.#ue = !0;
                    this.div.classList.add("disabled");
                    this.#Ee(!0);
                    this.select();
                    this.parent.addInkEditorIfNeeded(!0);
                    this.moveInDOM();
                    this.div.focus({
                        preventScroll: !0
                    });
                }
            }
            focusin(t) {
                if (this._focusEventsAllowed) {
                    super.focusin(t);
                    this.enableEditMode();
                }
            }
            canvasPointerdown(t) {
                if (0 === t.button && this.isInEditMode() && !this.#ue) {
                    this.setInForeground();
                    t.preventDefault();
                    this.div.contains(document.activeElement) || this.div.focus({
                        preventScroll: !0
                    });
                    this.#Me(t.offsetX, t.offsetY);
                }
            }
            canvasPointermove(t) {
                t.preventDefault();
                this.#Fe(t.offsetX, t.offsetY);
            }
            canvasPointerup(t) {
                t.preventDefault();
                this.#Oe(t);
            }
            canvasPointerleave(t) {
                this.#Oe(t);
            }
            #Oe(t) {
                this.canvas.removeEventListener("pointerleave", this.#oe);
                this.canvas.removeEventListener("pointermove", this.#re);
                this.canvas.removeEventListener("pointerup", this.#le);
                this.canvas.addEventListener("pointerdown", this.#he);
                this.#de && clearTimeout(this.#de);
                this.#de = setTimeout(()=>{
                    this.#de = null;
                    this.canvas.removeEventListener("contextmenu", h.noContextMenu);
                }, 10);
                this.#De(t.offsetX, t.offsetY);
                this.addToAnnotationStorage();
                this.setInBackground();
            }
            #we() {
                this.canvas = document.createElement("canvas");
                this.canvas.width = this.canvas.height = 0;
                this.canvas.className = "inkEditorCanvas";
                this.canvas.setAttribute("data-l10n-id", "pdfjs-ink-canvas");
                this.div.append(this.canvas);
                this.ctx = this.canvas.getContext("2d");
            }
            #xe() {
                this.#me = new ResizeObserver((t)=>{
                    const e = t[0].contentRect;
                    e.width && e.height && this.setDimensions(e.width, e.height);
                });
                this.#me.observe(this.div);
            }
            get isResizable() {
                return !this.isEmpty() && this.#ue;
            }
            render() {
                if (this.div) return this.div;
                let t, e;
                if (this.width) {
                    t = this.x;
                    e = this.y;
                }
                super.render();
                this.div.setAttribute("data-l10n-id", "pdfjs-ink");
                const [i, s, n, a] = this.#Se();
                this.setAt(i, s, 0, 0);
                this.setDims(n, a);
                this.#we();
                if (this.width) {
                    const [i, s] = this.parentDimensions;
                    this.setAspectRatio(this.width * i, this.height * s);
                    this.setAt(t * i, e * s, this.width * i, this.height * s);
                    this.#ge = !0;
                    this.#Ce();
                    this.setDims(this.width * i, this.height * s);
                    this.#_e();
                    this.div.classList.add("disabled");
                } else {
                    this.div.classList.add("editing");
                    this.enableEditMode();
                }
                this.#xe();
                return this.div;
            }
            #Ce() {
                if (!this.#ge) return;
                const [t, e] = this.parentDimensions;
                this.canvas.width = Math.ceil(this.width * t);
                this.canvas.height = Math.ceil(this.height * e);
                this.#Le();
            }
            setDimensions(t, e) {
                const i = Math.round(t), s = Math.round(e);
                if (this.#fe === i && this.#be === s) return;
                this.#fe = i;
                this.#be = s;
                this.canvas.style.visibility = "hidden";
                const [n, a] = this.parentDimensions;
                this.width = t / n;
                this.height = e / a;
                this.fixAndSetPosition();
                this.#ue && this.#Be(t, e);
                this.#Ce();
                this.#_e();
                this.canvas.style.visibility = "visible";
                this.fixDims();
            }
            #Be(t, e) {
                const i = this.#Ne(), s = (t - i) / this.#ae, n = (e - i) / this.#ne;
                this.scaleFactor = Math.min(s, n);
            }
            #Le() {
                const t = this.#Ne() / 2;
                this.ctx.setTransform(this.scaleFactor, 0, 0, this.scaleFactor, this.translationX * this.scaleFactor + t, this.translationY * this.scaleFactor + t);
            }
            static #Ue(t) {
                const e = new Path2D;
                for(let i = 0, s = t.length; i < s; i++){
                    const [s, n, a, r] = t[i];
                    0 === i && e.moveTo(...s);
                    e.bezierCurveTo(n[0], n[1], a[0], a[1], r[0], r[1]);
                }
                return e;
            }
            static #ze(t, e, i) {
                const [s, n, a, r] = e;
                switch(i){
                    case 0:
                        for(let e = 0, i = t.length; e < i; e += 2){
                            t[e] += s;
                            t[e + 1] = r - t[e + 1];
                        }
                        break;
                    case 90:
                        for(let e = 0, i = t.length; e < i; e += 2){
                            const i = t[e];
                            t[e] = t[e + 1] + s;
                            t[e + 1] = i + n;
                        }
                        break;
                    case 180:
                        for(let e = 0, i = t.length; e < i; e += 2){
                            t[e] = a - t[e];
                            t[e + 1] += n;
                        }
                        break;
                    case 270:
                        for(let e = 0, i = t.length; e < i; e += 2){
                            const i = t[e];
                            t[e] = a - t[e + 1];
                            t[e + 1] = r - i;
                        }
                        break;
                    default:
                        throw new Error("Invalid rotation");
                }
                return t;
            }
            static #He(t, e, i) {
                const [s, n, a, r] = e;
                switch(i){
                    case 0:
                        for(let e = 0, i = t.length; e < i; e += 2){
                            t[e] -= s;
                            t[e + 1] = r - t[e + 1];
                        }
                        break;
                    case 90:
                        for(let e = 0, i = t.length; e < i; e += 2){
                            const i = t[e];
                            t[e] = t[e + 1] - n;
                            t[e + 1] = i - s;
                        }
                        break;
                    case 180:
                        for(let e = 0, i = t.length; e < i; e += 2){
                            t[e] = a - t[e];
                            t[e + 1] -= n;
                        }
                        break;
                    case 270:
                        for(let e = 0, i = t.length; e < i; e += 2){
                            const i = t[e];
                            t[e] = r - t[e + 1];
                            t[e + 1] = a - i;
                        }
                        break;
                    default:
                        throw new Error("Invalid rotation");
                }
                return t;
            }
            #je(t, e, i, s) {
                const n = [], a = this.thickness / 2, r = t * e + a, o = t * i + a;
                for (const e of this.paths){
                    const i = [], a = [];
                    for(let s = 0, n = e.length; s < n; s++){
                        const [l, h, d, c] = e[s], u = t * l[0] + r, p = t * l[1] + o, g = t * h[0] + r, m = t * h[1] + o, f = t * d[0] + r, b = t * d[1] + o, A = t * c[0] + r, v = t * c[1] + o;
                        if (0 === s) {
                            i.push(u, p);
                            a.push(u, p);
                        }
                        i.push(g, m, f, b, A, v);
                        a.push(g, m);
                        s === n - 1 && a.push(A, v);
                    }
                    n.push({
                        bezier: InkEditor.#ze(i, s, this.rotation),
                        points: InkEditor.#ze(a, s, this.rotation)
                    });
                }
                return n;
            }
            #Ve() {
                let t = 1 / 0, e = -1 / 0, i = 1 / 0, n = -1 / 0;
                for (const a of this.paths)for (const [r, o, l, h] of a){
                    const a = s.Util.bezierBoundingBox(...r, ...o, ...l, ...h);
                    t = Math.min(t, a[0]);
                    i = Math.min(i, a[1]);
                    e = Math.max(e, a[2]);
                    n = Math.max(n, a[3]);
                }
                return [
                    t,
                    i,
                    e,
                    n
                ];
            }
            #Ne() {
                return this.#ue ? Math.ceil(this.thickness * this.parentScale) : 0;
            }
            #Ee(t = !1) {
                if (this.isEmpty()) return;
                if (!this.#ue) {
                    this.#_e();
                    return;
                }
                const e = this.#Ve(), i = this.#Ne();
                this.#ae = Math.max(n.AnnotationEditor.MIN_SIZE, e[2] - e[0]);
                this.#ne = Math.max(n.AnnotationEditor.MIN_SIZE, e[3] - e[1]);
                const s = Math.ceil(i + this.#ae * this.scaleFactor), a = Math.ceil(i + this.#ne * this.scaleFactor), [r, o] = this.parentDimensions;
                this.width = s / r;
                this.height = a / o;
                this.setAspectRatio(s, a);
                const l = this.translationX, h = this.translationY;
                this.translationX = -e[0];
                this.translationY = -e[1];
                this.#Ce();
                this.#_e();
                this.#fe = s;
                this.#be = a;
                this.setDims(s, a);
                const d = t ? i / this.scaleFactor / 2 : 0;
                this.translate(l - this.translationX - d, h - this.translationY - d);
            }
            static deserialize(t, e, i) {
                if (t instanceof r.InkAnnotationElement) return null;
                const a = super.deserialize(t, e, i);
                a.thickness = t.thickness;
                a.color = s.Util.makeHexColor(...t.color);
                a.opacity = t.opacity;
                const [o, l] = a.pageDimensions, h = a.width * o, d = a.height * l, c = a.parentScale, u = t.thickness / 2;
                a.#ue = !0;
                a.#fe = Math.round(h);
                a.#be = Math.round(d);
                const { paths: p, rect: g, rotation: m } = t;
                for (let { bezier: t } of p){
                    t = InkEditor.#He(t, g, m);
                    const e = [];
                    a.paths.push(e);
                    let i = c * (t[0] - u), s = c * (t[1] - u);
                    for(let n = 2, a = t.length; n < a; n += 6){
                        const a = c * (t[n] - u), r = c * (t[n + 1] - u), o = c * (t[n + 2] - u), l = c * (t[n + 3] - u), h = c * (t[n + 4] - u), d = c * (t[n + 5] - u);
                        e.push([
                            [
                                i,
                                s
                            ],
                            [
                                a,
                                r
                            ],
                            [
                                o,
                                l
                            ],
                            [
                                h,
                                d
                            ]
                        ]);
                        i = h;
                        s = d;
                    }
                    const n = this.#Ue(e);
                    a.bezierPath2D.push(n);
                }
                const f = a.#Ve();
                a.#ae = Math.max(n.AnnotationEditor.MIN_SIZE, f[2] - f[0]);
                a.#ne = Math.max(n.AnnotationEditor.MIN_SIZE, f[3] - f[1]);
                a.#Be(h, d);
                return a;
            }
            serialize() {
                if (this.isEmpty()) return null;
                const t = this.getRect(0, 0), e = n.AnnotationEditor._colorManager.convert(this.ctx.strokeStyle);
                return {
                    annotationType: s.AnnotationEditorType.INK,
                    color: e,
                    thickness: this.thickness,
                    opacity: this.opacity,
                    paths: this.#je(this.scaleFactor / this.parentScale, this.translationX, this.translationY, t),
                    pageIndex: this.pageIndex,
                    rect: t,
                    rotation: this.rotation,
                    structTreeParentId: this._structTreeParentId
                };
            }
        }
        class StampEditor extends n.AnnotationEditor {
            #We;
            #qe;
            #Ge;
            #$e;
            #Ke;
            #Xe;
            #Ye;
            #me;
            #Je;
            #Qe;
            #Ze;
            static{
                this._type = "stamp";
            }
            static{
                this._editorType = s.AnnotationEditorType.STAMP;
            }
            constructor(t){
                super({
                    ...t,
                    name: "stampEditor"
                });
                this.#We = null;
                this.#qe = null;
                this.#Ge = null;
                this.#$e = null;
                this.#Ke = null;
                this.#Xe = "";
                this.#Ye = null;
                this.#me = null;
                this.#Je = null;
                this.#Qe = !1;
                this.#Ze = !1;
                this.#$e = t.bitmapUrl;
                this.#Ke = t.bitmapFile;
            }
            static initialize(t) {
                n.AnnotationEditor.initialize(t);
            }
            static get supportedTypes() {
                return (0, s.shadow)(this, "supportedTypes", [
                    "apng",
                    "avif",
                    "bmp",
                    "gif",
                    "jpeg",
                    "png",
                    "svg+xml",
                    "webp",
                    "x-icon"
                ].map((t)=>`image/${t}`));
            }
            static get supportedTypesStr() {
                return (0, s.shadow)(this, "supportedTypesStr", this.supportedTypes.join(","));
            }
            static isHandlingMimeForPasting(t) {
                return this.supportedTypes.includes(t);
            }
            static paste(t, e) {
                e.pasteEditor(s.AnnotationEditorType.STAMP, {
                    bitmapFile: t.getAsFile()
                });
            }
            #ti(t, e = !1) {
                if (t) {
                    this.#We = t.bitmap;
                    if (!e) {
                        this.#qe = t.id;
                        this.#Qe = t.isSvg;
                    }
                    t.file && (this.#Xe = t.file.name);
                    this.#we();
                } else this.remove();
            }
            #ei() {
                this.#Ge = null;
                this._uiManager.enableWaiting(!1);
                this.#Ye && this.div.focus();
            }
            #ii() {
                if (this.#qe) {
                    this._uiManager.enableWaiting(!0);
                    this._uiManager.imageManager.getFromId(this.#qe).then((t)=>this.#ti(t, !0)).finally(()=>this.#ei());
                    return;
                }
                if (this.#$e) {
                    const t = this.#$e;
                    this.#$e = null;
                    this._uiManager.enableWaiting(!0);
                    this.#Ge = this._uiManager.imageManager.getFromUrl(t).then((t)=>this.#ti(t)).finally(()=>this.#ei());
                    return;
                }
                if (this.#Ke) {
                    const t = this.#Ke;
                    this.#Ke = null;
                    this._uiManager.enableWaiting(!0);
                    this.#Ge = this._uiManager.imageManager.getFromFile(t).then((t)=>this.#ti(t)).finally(()=>this.#ei());
                    return;
                }
                const t = document.createElement("input");
                t.type = "file";
                t.accept = StampEditor.supportedTypesStr;
                this.#Ge = new Promise((e)=>{
                    t.addEventListener("change", async ()=>{
                        if (t.files && 0 !== t.files.length) {
                            this._uiManager.enableWaiting(!0);
                            const e = await this._uiManager.imageManager.getFromFile(t.files[0]);
                            this.#ti(e);
                        } else this.remove();
                        e();
                    });
                    t.addEventListener("cancel", ()=>{
                        this.remove();
                        e();
                    });
                }).finally(()=>this.#ei());
                t.click();
            }
            remove() {
                if (this.#qe) {
                    this.#We = null;
                    this._uiManager.imageManager.deleteId(this.#qe);
                    this.#Ye?.remove();
                    this.#Ye = null;
                    this.#me?.disconnect();
                    this.#me = null;
                    if (this.#Je) {
                        clearTimeout(this.#Je);
                        this.#Je = null;
                    }
                }
                super.remove();
            }
            rebuild() {
                if (this.parent) {
                    super.rebuild();
                    if (null !== this.div) {
                        this.#qe && this.#ii();
                        this.isAttachedToDOM || this.parent.add(this);
                    }
                } else this.#qe && this.#ii();
            }
            onceAdded() {
                this._isDraggable = !0;
                this.div.focus();
            }
            isEmpty() {
                return !(this.#Ge || this.#We || this.#$e || this.#Ke);
            }
            get isResizable() {
                return !0;
            }
            render() {
                if (this.div) return this.div;
                let t, e;
                if (this.width) {
                    t = this.x;
                    e = this.y;
                }
                super.render();
                this.div.hidden = !0;
                this.#We ? this.#we() : this.#ii();
                if (this.width) {
                    const [i, s] = this.parentDimensions;
                    this.setAt(t * i, e * s, this.width * i, this.height * s);
                }
                return this.div;
            }
            #we() {
                const { div: t } = this;
                let { width: e, height: i } = this.#We;
                const [s, n] = this.pageDimensions, a = .75;
                if (this.width) {
                    e = this.width * s;
                    i = this.height * n;
                } else if (e > a * s || i > a * n) {
                    const t = Math.min(a * s / e, a * n / i);
                    e *= t;
                    i *= t;
                }
                const [r, o] = this.parentDimensions;
                this.setDims(e * r / s, i * o / n);
                this._uiManager.enableWaiting(!1);
                const l = this.#Ye = document.createElement("canvas");
                t.append(l);
                t.hidden = !1;
                this.#si(e, i);
                this.#xe();
                if (!this.#Ze) {
                    this.parent.addUndoableEditor(this);
                    this.#Ze = !0;
                }
                this._uiManager._eventBus.dispatch("reporttelemetry", {
                    source: this,
                    details: {
                        type: "editing",
                        subtype: this.editorType,
                        data: {
                            action: "inserted_image"
                        }
                    }
                });
                this.addAltTextButton();
                this.#Xe && l.setAttribute("aria-label", this.#Xe);
            }
            #ni(t, e) {
                const [i, s] = this.parentDimensions;
                this.width = t / i;
                this.height = e / s;
                this.setDims(t, e);
                this._initialOptions?.isCentered ? this.center() : this.fixAndSetPosition();
                this._initialOptions = null;
                null !== this.#Je && clearTimeout(this.#Je);
                this.#Je = setTimeout(()=>{
                    this.#Je = null;
                    this.#si(t, e);
                }, 200);
            }
            #ai(t, e) {
                const { width: i, height: s } = this.#We;
                let n = i, a = s, r = this.#We;
                for(; n > 2 * t || a > 2 * e;){
                    const i = n, s = a;
                    n > 2 * t && (n = n >= 16384 ? Math.floor(n / 2) - 1 : Math.ceil(n / 2));
                    a > 2 * e && (a = a >= 16384 ? Math.floor(a / 2) - 1 : Math.ceil(a / 2));
                    const o = new OffscreenCanvas(n, a);
                    o.getContext("2d").drawImage(r, 0, 0, i, s, 0, 0, n, a);
                    r = o.transferToImageBitmap();
                }
                return r;
            }
            #si(t, e) {
                t = Math.ceil(t);
                e = Math.ceil(e);
                const i = this.#Ye;
                if (!i || i.width === t && i.height === e) return;
                i.width = t;
                i.height = e;
                const s = this.#Qe ? this.#We : this.#ai(t, e), n = i.getContext("2d");
                n.filter = this._uiManager.hcmFilter;
                n.drawImage(s, 0, 0, s.width, s.height, 0, 0, t, e);
            }
            getImageForAltText() {
                return this.#Ye;
            }
            #ri(t) {
                if (t) {
                    if (this.#Qe) {
                        const t = this._uiManager.imageManager.getSvgUrl(this.#qe);
                        if (t) return t;
                    }
                    const t = document.createElement("canvas");
                    ({ width: t.width, height: t.height } = this.#We);
                    t.getContext("2d").drawImage(this.#We, 0, 0);
                    return t.toDataURL();
                }
                if (this.#Qe) {
                    const [t, e] = this.pageDimensions, i = Math.round(this.width * t * h.PixelsPerInch.PDF_TO_CSS_UNITS), s = Math.round(this.height * e * h.PixelsPerInch.PDF_TO_CSS_UNITS), n = new OffscreenCanvas(i, s);
                    n.getContext("2d").drawImage(this.#We, 0, 0, this.#We.width, this.#We.height, 0, 0, i, s);
                    return n.transferToImageBitmap();
                }
                return structuredClone(this.#We);
            }
            #xe() {
                this.#me = new ResizeObserver((t)=>{
                    const e = t[0].contentRect;
                    e.width && e.height && this.#ni(e.width, e.height);
                });
                this.#me.observe(this.div);
            }
            static deserialize(t, e, i) {
                if (t instanceof r.StampAnnotationElement) return null;
                const s = super.deserialize(t, e, i), { rect: n, bitmapUrl: a, bitmapId: o, isSvg: l, accessibilityData: h } = t;
                o && i.imageManager.isValidId(o) ? s.#qe = o : s.#$e = a;
                s.#Qe = l;
                const [d, c] = s.pageDimensions;
                s.width = (n[2] - n[0]) / d;
                s.height = (n[3] - n[1]) / c;
                h && (s.altTextData = h);
                return s;
            }
            serialize(t = !1, e = null) {
                if (this.isEmpty()) return null;
                const i = {
                    annotationType: s.AnnotationEditorType.STAMP,
                    bitmapId: this.#qe,
                    pageIndex: this.pageIndex,
                    rect: this.getRect(0, 0),
                    rotation: this.rotation,
                    isSvg: this.#Qe,
                    structTreeParentId: this._structTreeParentId
                };
                if (t) {
                    i.bitmapUrl = this.#ri(!0);
                    i.accessibilityData = this.altTextData;
                    return i;
                }
                const { decorative: n, altText: a } = this.altTextData;
                !n && a && (i.accessibilityData = {
                    type: "Figure",
                    alt: a
                });
                if (null === e) return i;
                e.stamps ||= new Map;
                const r = this.#Qe ? (i.rect[2] - i.rect[0]) * (i.rect[3] - i.rect[1]) : null;
                if (e.stamps.has(this.#qe)) {
                    if (this.#Qe) {
                        const t = e.stamps.get(this.#qe);
                        if (r > t.area) {
                            t.area = r;
                            t.serialized.bitmap.close();
                            t.serialized.bitmap = this.#ri(!1);
                        }
                    }
                } else {
                    e.stamps.set(this.#qe, {
                        area: r,
                        serialized: i
                    });
                    i.bitmap = this.#ri(!1);
                }
                return i;
            }
        }
        class AnnotationEditorLayer {
            #k;
            #oi;
            #li;
            #hi;
            #di;
            #ci;
            #ui;
            #pi;
            #gi;
            #mi;
            #fi;
            #bi;
            #Ai;
            #vi;
            static{
                this._initialized = !1;
            }
            static #yi = new Map([
                FreeTextEditor,
                InkEditor,
                StampEditor,
                HighlightEditor
            ].map((t)=>[
                    t._editorType,
                    t
                ]));
            constructor({ uiManager: t, pageIndex: e, div: i, accessibilityManager: s, annotationLayer: n, drawLayer: a, textLayer: r, viewport: o, l10n: l }){
                this.#oi = !1;
                this.#li = null;
                this.#hi = this.pointerup.bind(this);
                this.#di = this.pointerUpAfterSelection.bind(this);
                this.#ci = this.pointerdown.bind(this);
                this.#ui = null;
                this.#pi = this.selectionStart.bind(this);
                this.#gi = new Map;
                this.#mi = !1;
                this.#fi = !1;
                this.#bi = !1;
                this.#Ai = null;
                const h = [
                    ...AnnotationEditorLayer.#yi.values()
                ];
                if (!AnnotationEditorLayer._initialized) {
                    AnnotationEditorLayer._initialized = !0;
                    for (const t of h)t.initialize(l);
                }
                t.registerEditorTypes(h);
                this.#vi = t;
                this.pageIndex = e;
                this.div = i;
                this.#k = s;
                this.#li = n;
                this.viewport = o;
                this.#Ai = r;
                this.drawLayer = a;
                this.#vi.addLayer(this);
            }
            get isEmpty() {
                return 0 === this.#gi.size;
            }
            updateToolbar(t) {
                this.#vi.updateToolbar(t);
            }
            updateMode(t = this.#vi.getMode()) {
                this.#Ei();
                switch(t){
                    case s.AnnotationEditorType.NONE:
                        this.disableTextSelection();
                        this.togglePointerEvents(!1);
                        this.disableClick();
                        break;
                    case s.AnnotationEditorType.INK:
                        this.addInkEditorIfNeeded(!1);
                        this.disableTextSelection();
                        this.togglePointerEvents(!0);
                        this.disableClick();
                        break;
                    case s.AnnotationEditorType.HIGHLIGHT:
                        this.enableTextSelection();
                        this.togglePointerEvents(!1);
                        this.disableClick();
                        break;
                    default:
                        this.disableTextSelection();
                        this.togglePointerEvents(!0);
                        this.enableClick();
                }
                if (t !== s.AnnotationEditorType.NONE) {
                    const { classList: e } = this.div;
                    for (const i of AnnotationEditorLayer.#yi.values())e.toggle(`${i._type}Editing`, t === i._editorType);
                    this.div.hidden = !1;
                }
            }
            addInkEditorIfNeeded(t) {
                if (this.#vi.getMode() !== s.AnnotationEditorType.INK) return;
                if (!t) {
                    for (const t of this.#gi.values())if (t.isEmpty()) {
                        t.setInBackground();
                        return;
                    }
                }
                this.#_i({
                    offsetX: 0,
                    offsetY: 0
                }, !1).setInBackground();
            }
            setEditingState(t) {
                this.#vi.setEditingState(t);
            }
            addCommands(t) {
                this.#vi.addCommands(t);
            }
            togglePointerEvents(t = !1) {
                this.div.classList.toggle("disabled", !t);
            }
            enable() {
                this.togglePointerEvents(!0);
                const t = new Set;
                for (const e of this.#gi.values()){
                    e.enableEditing();
                    e.annotationElementId && t.add(e.annotationElementId);
                }
                if (!this.#li) return;
                const e = this.#li.getEditableAnnotations();
                for (const i of e){
                    i.hide();
                    if (this.#vi.isDeletedAnnotationElement(i.data.id)) continue;
                    if (t.has(i.data.id)) continue;
                    const e = this.deserialize(i);
                    if (e) {
                        this.addOrRebuild(e);
                        e.enableEditing();
                    }
                }
            }
            disable() {
                this.#bi = !0;
                this.togglePointerEvents(!1);
                const t = new Set;
                for (const e of this.#gi.values()){
                    e.disableEditing();
                    if (e.annotationElementId && null === e.serialize()) {
                        this.getEditableAnnotation(e.annotationElementId)?.show();
                        e.remove();
                    } else t.add(e.annotationElementId);
                }
                if (this.#li) {
                    const e = this.#li.getEditableAnnotations();
                    for (const i of e){
                        const { id: e } = i.data;
                        t.has(e) || this.#vi.isDeletedAnnotationElement(e) || i.show();
                    }
                }
                this.#Ei();
                this.isEmpty && (this.div.hidden = !0);
                const { classList: e } = this.div;
                for (const t of AnnotationEditorLayer.#yi.values())e.remove(`${t._type}Editing`);
                this.disableTextSelection();
                this.#bi = !1;
            }
            getEditableAnnotation(t) {
                return this.#li?.getEditableAnnotation(t) || null;
            }
            setActiveEditor(t) {
                this.#vi.getActive() !== t && this.#vi.setActiveEditor(t);
            }
            enableTextSelection() {
                this.#Ai?.div && document.addEventListener("selectstart", this.#pi);
            }
            disableTextSelection() {
                this.#Ai?.div && document.removeEventListener("selectstart", this.#pi);
            }
            enableClick() {
                this.div.addEventListener("pointerdown", this.#ci);
                this.div.addEventListener("pointerup", this.#hi);
            }
            disableClick() {
                this.div.removeEventListener("pointerdown", this.#ci);
                this.div.removeEventListener("pointerup", this.#hi);
            }
            attach(t) {
                this.#gi.set(t.id, t);
                const { annotationElementId: e } = t;
                e && this.#vi.isDeletedAnnotationElement(e) && this.#vi.removeDeletedAnnotationElement(t);
            }
            detach(t) {
                this.#gi.delete(t.id);
                this.#k?.removePointerInTextLayer(t.contentDiv);
                !this.#bi && t.annotationElementId && this.#vi.addDeletedAnnotationElement(t);
            }
            remove(t) {
                this.detach(t);
                this.#vi.removeEditor(t);
                t.div.remove();
                t.isAttachedToDOM = !1;
                this.#fi || this.addInkEditorIfNeeded(!1);
            }
            changeParent(t) {
                if (t.parent !== this) {
                    if (t.annotationElementId) {
                        this.#vi.addDeletedAnnotationElement(t.annotationElementId);
                        n.AnnotationEditor.deleteAnnotationElement(t);
                        t.annotationElementId = null;
                    }
                    this.attach(t);
                    t.parent?.detach(t);
                    t.setParent(this);
                    if (t.div && t.isAttachedToDOM) {
                        t.div.remove();
                        this.div.append(t.div);
                    }
                }
            }
            add(t) {
                this.changeParent(t);
                this.#vi.addEditor(t);
                this.attach(t);
                if (!t.isAttachedToDOM) {
                    const e = t.render();
                    this.div.append(e);
                    t.isAttachedToDOM = !0;
                }
                t.fixAndSetPosition();
                t.onceAdded();
                this.#vi.addToAnnotationStorage(t);
            }
            moveEditorInDOM(t) {
                if (!t.isAttachedToDOM) return;
                const { activeElement: e } = document;
                if (t.div.contains(e) && !this.#ui) {
                    t._focusEventsAllowed = !1;
                    this.#ui = setTimeout(()=>{
                        this.#ui = null;
                        if (t.div.contains(document.activeElement)) t._focusEventsAllowed = !0;
                        else {
                            t.div.addEventListener("focusin", ()=>{
                                t._focusEventsAllowed = !0;
                            }, {
                                once: !0
                            });
                            e.focus();
                        }
                    }, 0);
                }
                t._structTreeParentId = this.#k?.moveElementInDOM(this.div, t.div, t.contentDiv, !0);
            }
            addOrRebuild(t) {
                if (t.needsToBeRebuilt()) {
                    t.parent ||= this;
                    t.rebuild();
                } else this.add(t);
            }
            addUndoableEditor(t) {
                this.addCommands({
                    cmd: ()=>t._uiManager.rebuild(t),
                    undo: ()=>{
                        t.remove();
                    },
                    mustExec: !1
                });
            }
            getNextId() {
                return this.#vi.getId();
            }
            get #wi() {
                return AnnotationEditorLayer.#yi.get(this.#vi.getMode());
            }
            #xi(t) {
                const e = this.#wi;
                return e ? new e.prototype.constructor(t) : null;
            }
            canCreateNewEmptyEditor() {
                return this.#wi?.canCreateNewEmptyEditor();
            }
            pasteEditor(t, e) {
                this.#vi.updateToolbar(t);
                this.#vi.updateMode(t);
                const { offsetX: i, offsetY: s } = this.#Ci(), n = this.getNextId(), a = this.#xi({
                    parent: this,
                    id: n,
                    x: i,
                    y: s,
                    uiManager: this.#vi,
                    isCentered: !0,
                    ...e
                });
                a && this.add(a);
            }
            deserialize(t) {
                return AnnotationEditorLayer.#yi.get(t.annotationType ?? t.annotationEditorType)?.deserialize(t, this, this.#vi) || null;
            }
            #_i(t, e, i = {}) {
                const s = this.getNextId(), n = this.#xi({
                    parent: this,
                    id: s,
                    x: t.offsetX,
                    y: t.offsetY,
                    uiManager: this.#vi,
                    isCentered: e,
                    ...i
                });
                n && this.add(n);
                return n;
            }
            #Ci() {
                const { x: t, y: e, width: i, height: s } = this.div.getBoundingClientRect(), n = Math.max(0, t), a = Math.max(0, e), r = (n + Math.min(window.innerWidth, t + i)) / 2 - t, o = (a + Math.min(window.innerHeight, e + s)) / 2 - e, [l, h] = this.viewport.rotation % 180 == 0 ? [
                    r,
                    o
                ] : [
                    o,
                    r
                ];
                return {
                    offsetX: l,
                    offsetY: h
                };
            }
            addNewEditor() {
                this.#_i(this.#Ci(), !0);
            }
            setSelected(t) {
                this.#vi.setSelected(t);
            }
            toggleSelected(t) {
                this.#vi.toggleSelected(t);
            }
            isSelected(t) {
                return this.#vi.isSelected(t);
            }
            unselect(t) {
                this.#vi.unselect(t);
            }
            selectionStart(t) {
                this.#Ai?.div.addEventListener("pointerup", this.#di, {
                    once: !0
                });
            }
            pointerUpAfterSelection(t) {
                const e = document.getSelection();
                if (0 === e.rangeCount) return;
                const i = e.getRangeAt(0);
                if (i.collapsed) return;
                if (!this.#Ai?.div.contains(i.commonAncestorContainer)) return;
                const { x: s, y: n, width: a, height: r } = this.#Ai.div.getBoundingClientRect(), o = i.getClientRects();
                let l;
                switch(this.viewport.rotation){
                    case 90:
                        l = (t, e, i, o)=>({
                                x: (e - n) / r,
                                y: 1 - (t + i - s) / a,
                                width: o / r,
                                height: i / a
                            });
                        break;
                    case 180:
                        l = (t, e, i, o)=>({
                                x: 1 - (t + i - s) / a,
                                y: 1 - (e + o - n) / r,
                                width: i / a,
                                height: o / r
                            });
                        break;
                    case 270:
                        l = (t, e, i, o)=>({
                                x: 1 - (e + o - n) / r,
                                y: (t - s) / a,
                                width: o / r,
                                height: i / a
                            });
                        break;
                    default:
                        l = (t, e, i, o)=>({
                                x: (t - s) / a,
                                y: (e - n) / r,
                                width: i / a,
                                height: o / r
                            });
                }
                const h = [];
                for (const { x: t, y: e, width: i, height: s } of o)0 !== i && 0 !== s && h.push(l(t, e, i, s));
                0 !== h.length && this.#_i(t, !1, {
                    boxes: h
                });
                e.empty();
            }
            pointerup(t) {
                const { isMac: e } = s.FeatureTest.platform;
                if (!(0 !== t.button || t.ctrlKey && e) && t.target === this.div && this.#mi) {
                    this.#mi = !1;
                    this.#oi ? this.#vi.getMode() !== s.AnnotationEditorType.STAMP ? this.#_i(t, !1) : this.#vi.unselectAll() : this.#oi = !0;
                }
            }
            pointerdown(t) {
                this.#vi.getMode() === s.AnnotationEditorType.HIGHLIGHT && this.enableTextSelection();
                if (this.#mi) {
                    this.#mi = !1;
                    return;
                }
                const { isMac: e } = s.FeatureTest.platform;
                if (0 !== t.button || t.ctrlKey && e) return;
                if (t.target !== this.div) return;
                this.#mi = !0;
                const i = this.#vi.getActive();
                this.#oi = !i || i.isEmpty();
            }
            findNewParent(t, e, i) {
                const s = this.#vi.findParent(e, i);
                if (null === s || s === this) return !1;
                s.changeParent(t);
                return !0;
            }
            destroy() {
                if (this.#vi.getActive()?.parent === this) {
                    this.#vi.commitOrRemove();
                    this.#vi.setActiveEditor(null);
                }
                if (this.#ui) {
                    clearTimeout(this.#ui);
                    this.#ui = null;
                }
                for (const t of this.#gi.values()){
                    this.#k?.removePointerInTextLayer(t.contentDiv);
                    t.setParent(null);
                    t.isAttachedToDOM = !1;
                    t.div.remove();
                }
                this.div = null;
                this.#gi.clear();
                this.#vi.removeLayer(this);
            }
            #Ei() {
                this.#fi = !0;
                for (const t of this.#gi.values())t.isEmpty() && t.remove();
                this.#fi = !1;
            }
            render({ viewport: t }) {
                this.viewport = t;
                (0, h.setLayerDimensions)(this.div, t);
                for (const t of this.#vi.getEditors(this.pageIndex))this.add(t);
                this.updateMode();
            }
            update({ viewport: t }) {
                this.#vi.commitOrRemove();
                const e = this.viewport.rotation, i = t.rotation;
                this.viewport = t;
                (0, h.setLayerDimensions)(this.div, {
                    rotation: i
                });
                if (e !== i) for (const t of this.#gi.values())t.rotate(i);
                this.updateMode();
            }
            get pageDimensions() {
                const { pageWidth: t, pageHeight: e } = this.viewport.rawDims;
                return [
                    t,
                    e
                ];
            }
        }
    },
    97: (t, e, i)=>{
        i.d(e, {
            ColorPicker: ()=>ColorPicker
        });
        var s = i(266), n = i(812), a = i(473);
        class ColorPicker {
            #n;
            #Si;
            #Ti;
            #Mi;
            #Pi;
            #Fi;
            #Ri;
            #ki;
            #vi;
            static get _keyboardManager() {
                return (0, s.shadow)(this, "_keyboardManager", new n.KeyboardManager([
                    [
                        [
                            "Escape",
                            "mac+Escape"
                        ],
                        ColorPicker.prototype._hideDropdownFromKeyboard
                    ],
                    [
                        [
                            " ",
                            "mac+ "
                        ],
                        ColorPicker.prototype._colorSelectFromKeyboard
                    ],
                    [
                        [
                            "ArrowDown",
                            "ArrowRight",
                            "mac+ArrowDown",
                            "mac+ArrowRight"
                        ],
                        ColorPicker.prototype._moveToNext
                    ],
                    [
                        [
                            "ArrowUp",
                            "ArrowLeft",
                            "mac+ArrowUp",
                            "mac+ArrowLeft"
                        ],
                        ColorPicker.prototype._moveToPrevious
                    ],
                    [
                        [
                            "Home",
                            "mac+Home"
                        ],
                        ColorPicker.prototype._moveToBeginning
                    ],
                    [
                        [
                            "End",
                            "mac+End"
                        ],
                        ColorPicker.prototype._moveToEnd
                    ]
                ]));
            }
            constructor({ editor: t = null, uiManager: e = null }){
                this.#n = this.#a.bind(this);
                this.#Si = null;
                this.#Ti = null;
                this.#Pi = null;
                this.#Fi = !1;
                this.#Ri = !1;
                this.#vi = null;
                this.#Ri = !t;
                this.#vi = t?._uiManager || e;
                this.#ki = this.#vi._eventBus;
                this.#Mi = t?.color || this.#vi?.highlightColors.values().next().value || "#FFFF98";
            }
            renderButton() {
                const t = this.#Si = document.createElement("button");
                t.className = "colorPicker";
                t.tabIndex = "0";
                t.setAttribute("data-l10n-id", "pdfjs-editor-colorpicker-button");
                t.setAttribute("aria-haspopup", !0);
                t.addEventListener("click", this.#Di.bind(this));
                const e = this.#Ti = document.createElement("span");
                e.className = "swatch";
                e.style.backgroundColor = this.#Mi;
                t.append(e);
                return t;
            }
            renderMainDropdown() {
                const t = this.#Pi = this.#Ii(s.AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR);
                t.setAttribute("aria-orientation", "horizontal");
                t.setAttribute("aria-labelledby", "highlightColorPickerLabel");
                return t;
            }
            #Ii(t) {
                const e = document.createElement("div");
                e.addEventListener("contextmenu", a.noContextMenu);
                e.className = "dropdown";
                e.role = "listbox";
                e.setAttribute("aria-multiselectable", !1);
                e.setAttribute("aria-orientation", "vertical");
                e.setAttribute("data-l10n-id", "pdfjs-editor-colorpicker-dropdown");
                for (const [i, s] of this.#vi.highlightColors){
                    const n = document.createElement("button");
                    n.tabIndex = "0";
                    n.role = "option";
                    n.setAttribute("data-color", s);
                    n.title = i;
                    n.setAttribute("data-l10n-id", `pdfjs-editor-colorpicker-${i}`);
                    const a = document.createElement("span");
                    n.append(a);
                    a.className = "swatch";
                    a.style.backgroundColor = s;
                    n.setAttribute("aria-selected", s === this.#Mi);
                    n.addEventListener("click", this.#Li.bind(this, t, s));
                    e.append(n);
                }
                e.addEventListener("keydown", this.#n);
                return e;
            }
            #Li(t, e, i) {
                i.stopPropagation();
                this.#ki.dispatch("switchannotationeditorparams", {
                    source: this,
                    type: t,
                    value: e
                });
            }
            _colorSelectFromKeyboard(t) {
                const e = t.target.getAttribute("data-color");
                e && this.#Li(e, t);
            }
            _moveToNext(t) {
                t.target !== this.#Si ? t.target.nextSibling?.focus() : this.#Pi.firstChild?.focus();
            }
            _moveToPrevious(t) {
                t.target.previousSibling?.focus();
            }
            _moveToBeginning() {
                this.#Pi.firstChild?.focus();
            }
            _moveToEnd() {
                this.#Pi.lastChild?.focus();
            }
            #a(t) {
                ColorPicker._keyboardManager.exec(this, t);
            }
            #Di(t) {
                if (this.#Pi && !this.#Pi.classList.contains("hidden")) {
                    this.hideDropdown();
                    return;
                }
                this.#Si.addEventListener("keydown", this.#n);
                this.#Fi = 0 === t.detail;
                if (this.#Pi) {
                    this.#Pi.classList.remove("hidden");
                    return;
                }
                const e = this.#Pi = this.#Ii(s.AnnotationEditorParamsType.HIGHLIGHT_COLOR);
                this.#Si.append(e);
            }
            hideDropdown() {
                this.#Pi?.classList.add("hidden");
            }
            _hideDropdownFromKeyboard() {
                if (!this.#Ri && this.#Pi && !this.#Pi.classList.contains("hidden")) {
                    this.hideDropdown();
                    this.#Si.removeEventListener("keydown", this.#n);
                    this.#Si.focus({
                        preventScroll: !0,
                        focusVisible: this.#Fi
                    });
                }
            }
            updateColor(t) {
                this.#Ti && (this.#Ti.style.backgroundColor = t);
                if (!this.#Pi) return;
                const e = this.#vi.highlightColors.values();
                for (const i of this.#Pi.children)i.setAttribute("aria-selected", e.next().value === t);
            }
            destroy() {
                this.#Si?.remove();
                this.#Si = null;
                this.#Ti = null;
                this.#Pi?.remove();
                this.#Pi = null;
            }
        }
    },
    115: (t, e, i)=>{
        i.d(e, {
            AnnotationEditor: ()=>AnnotationEditor
        });
        var s = i(812), n = i(266), a = i(473);
        class AltText {
            #Oi;
            #Bi;
            #Ni;
            #Ui;
            #zi;
            #Hi;
            #ji;
            static{
                this._l10nPromise = null;
            }
            constructor(t){
                this.#Oi = "";
                this.#Bi = !1;
                this.#Ni = null;
                this.#Ui = null;
                this.#zi = null;
                this.#Hi = !1;
                this.#ji = null;
                this.#ji = t;
            }
            static initialize(t) {
                AltText._l10nPromise ||= t;
            }
            async render() {
                const t = this.#Ni = document.createElement("button");
                t.className = "altText";
                const e = await AltText._l10nPromise.get("pdfjs-editor-alt-text-button-label");
                t.textContent = e;
                t.setAttribute("aria-label", e);
                t.tabIndex = "0";
                t.addEventListener("contextmenu", a.noContextMenu);
                t.addEventListener("pointerdown", (t)=>t.stopPropagation());
                const onClick = (t)=>{
                    t.preventDefault();
                    this.#ji._uiManager.editAltText(this.#ji);
                };
                t.addEventListener("click", onClick, {
                    capture: !0
                });
                t.addEventListener("keydown", (e)=>{
                    if (e.target === t && "Enter" === e.key) {
                        this.#Hi = !0;
                        onClick(e);
                    }
                });
                await this.#Vi();
                return t;
            }
            finish() {
                if (this.#Ni) {
                    this.#Ni.focus({
                        focusVisible: this.#Hi
                    });
                    this.#Hi = !1;
                }
            }
            get data() {
                return {
                    altText: this.#Oi,
                    decorative: this.#Bi
                };
            }
            set data({ altText: t, decorative: e }) {
                if (this.#Oi !== t || this.#Bi !== e) {
                    this.#Oi = t;
                    this.#Bi = e;
                    this.#Vi();
                }
            }
            toggle(t = !1) {
                if (this.#Ni) {
                    if (!t && this.#zi) {
                        clearTimeout(this.#zi);
                        this.#zi = null;
                    }
                    this.#Ni.disabled = !t;
                }
            }
            destroy() {
                this.#Ni?.remove();
                this.#Ni = null;
                this.#Ui = null;
            }
            async #Vi() {
                const t = this.#Ni;
                if (!t) return;
                if (!this.#Oi && !this.#Bi) {
                    t.classList.remove("done");
                    this.#Ui?.remove();
                    return;
                }
                t.classList.add("done");
                AltText._l10nPromise.get("pdfjs-editor-alt-text-edit-button-label").then((e)=>{
                    t.setAttribute("aria-label", e);
                });
                let e = this.#Ui;
                if (!e) {
                    this.#Ui = e = document.createElement("span");
                    e.className = "tooltip";
                    e.setAttribute("role", "tooltip");
                    const i = e.id = `alt-text-tooltip-${this.#ji.id}`;
                    t.setAttribute("aria-describedby", i);
                    const s = 100;
                    t.addEventListener("mouseenter", ()=>{
                        this.#zi = setTimeout(()=>{
                            this.#zi = null;
                            this.#Ui.classList.add("show");
                            this.#ji._uiManager._eventBus.dispatch("reporttelemetry", {
                                source: this,
                                details: {
                                    type: "editing",
                                    subtype: this.#ji.editorType,
                                    data: {
                                        action: "alt_text_tooltip"
                                    }
                                }
                            });
                        }, s);
                    });
                    t.addEventListener("mouseleave", ()=>{
                        if (this.#zi) {
                            clearTimeout(this.#zi);
                            this.#zi = null;
                        }
                        this.#Ui?.classList.remove("show");
                    });
                }
                e.innerText = this.#Bi ? await AltText._l10nPromise.get("pdfjs-editor-alt-text-decorative-tooltip") : this.#Oi;
                e.parentNode || t.append(e);
                const i = this.#ji.getImageForAltText();
                i?.setAttribute("aria-describedby", e.id);
            }
        }
        class EditorToolbar {
            #Wi;
            #qt;
            #ji;
            #qi;
            constructor(t){
                this.#Wi = null;
                this.#qt = null;
                this.#qi = null;
                this.#ji = t;
            }
            render() {
                const t = this.#Wi = document.createElement("div");
                t.className = "editToolbar";
                t.addEventListener("contextmenu", a.noContextMenu);
                t.addEventListener("pointerdown", EditorToolbar.#Gi);
                const e = this.#qi = document.createElement("div");
                e.className = "buttons";
                t.append(e);
                const i = this.#ji.toolbarPosition;
                if (i) {
                    const { style: e } = t, s = "ltr" === this.#ji._uiManager.direction ? 1 - i[0] : i[0];
                    e.insetInlineEnd = 100 * s + "%";
                    e.top = `calc(${100 * i[1]}% + var(--editor-toolbar-vert-offset))`;
                }
                this.#$i();
                return t;
            }
            static #Gi(t) {
                t.stopPropagation();
            }
            #Ki(t) {
                this.#ji._focusEventsAllowed = !1;
                t.preventDefault();
                t.stopPropagation();
            }
            #Xi(t) {
                this.#ji._focusEventsAllowed = !0;
                t.preventDefault();
                t.stopPropagation();
            }
            #Yi(t) {
                t.addEventListener("focusin", this.#Ki.bind(this), {
                    capture: !0
                });
                t.addEventListener("focusout", this.#Xi.bind(this), {
                    capture: !0
                });
                t.addEventListener("contextmenu", a.noContextMenu);
            }
            hide() {
                this.#Wi.classList.add("hidden");
                this.#qt?.hideDropdown();
            }
            show() {
                this.#Wi.classList.remove("hidden");
            }
            #$i() {
                const t = document.createElement("button");
                t.className = "delete";
                t.tabIndex = 0;
                t.setAttribute("data-l10n-id", `pdfjs-editor-remove-${this.#ji.editorType}-button`);
                this.#Yi(t);
                t.addEventListener("click", (t)=>{
                    this.#ji._uiManager.delete();
                });
                this.#qi.append(t);
            }
            get #Ji() {
                const t = document.createElement("div");
                t.className = "divider";
                return t;
            }
            addAltTextButton(t) {
                this.#Yi(t);
                this.#qi.prepend(t, this.#Ji);
            }
            addColorPicker(t) {
                this.#qt = t;
                const e = t.renderButton();
                this.#Yi(e);
                this.#qi.prepend(e, this.#Ji);
            }
            remove() {
                this.#Wi.remove();
                this.#qt?.destroy();
                this.#qt = null;
            }
        }
        class AnnotationEditor {
            #Qi;
            #Oi;
            #Zi;
            #ts;
            #es;
            #is;
            #ss;
            #ns;
            #as;
            #rs;
            #os;
            #ls;
            #hs;
            #ds;
            #cs;
            #us;
            static{
                this._borderLineWidth = -1;
            }
            static{
                this._colorManager = new s.ColorManager;
            }
            static{
                this._zIndex = 1;
            }
            static get _resizerKeyboardManager() {
                const t = AnnotationEditor.prototype._resizeWithKeyboard, e = s.AnnotationEditorUIManager.TRANSLATE_SMALL, i = s.AnnotationEditorUIManager.TRANSLATE_BIG;
                return (0, n.shadow)(this, "_resizerKeyboardManager", new s.KeyboardManager([
                    [
                        [
                            "ArrowLeft",
                            "mac+ArrowLeft"
                        ],
                        t,
                        {
                            args: [
                                -e,
                                0
                            ]
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowLeft",
                            "mac+shift+ArrowLeft"
                        ],
                        t,
                        {
                            args: [
                                -i,
                                0
                            ]
                        }
                    ],
                    [
                        [
                            "ArrowRight",
                            "mac+ArrowRight"
                        ],
                        t,
                        {
                            args: [
                                e,
                                0
                            ]
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowRight",
                            "mac+shift+ArrowRight"
                        ],
                        t,
                        {
                            args: [
                                i,
                                0
                            ]
                        }
                    ],
                    [
                        [
                            "ArrowUp",
                            "mac+ArrowUp"
                        ],
                        t,
                        {
                            args: [
                                0,
                                -e
                            ]
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowUp",
                            "mac+shift+ArrowUp"
                        ],
                        t,
                        {
                            args: [
                                0,
                                -i
                            ]
                        }
                    ],
                    [
                        [
                            "ArrowDown",
                            "mac+ArrowDown"
                        ],
                        t,
                        {
                            args: [
                                0,
                                e
                            ]
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowDown",
                            "mac+shift+ArrowDown"
                        ],
                        t,
                        {
                            args: [
                                0,
                                i
                            ]
                        }
                    ],
                    [
                        [
                            "Escape",
                            "mac+Escape"
                        ],
                        AnnotationEditor.prototype._stopResizingWithKeyboard
                    ]
                ]));
            }
            constructor(t){
                this.#Qi = null;
                this.#Oi = null;
                this.#Zi = !1;
                this.#ts = null;
                this.#es = null;
                this.#is = this.focusin.bind(this);
                this.#ss = this.focusout.bind(this);
                this.#ns = null;
                this.#as = "";
                this.#rs = !1;
                this.#os = !1;
                this.#ls = !1;
                this.#hs = !1;
                this.#ds = null;
                this._initialOptions = Object.create(null);
                this._uiManager = null;
                this._focusEventsAllowed = !0;
                this._l10nPromise = null;
                this.#cs = !1;
                this.#us = AnnotationEditor._zIndex++;
                this.constructor === AnnotationEditor && (0, n.unreachable)("Cannot initialize AnnotationEditor.");
                this.parent = t.parent;
                this.id = t.id;
                this.width = this.height = null;
                this.pageIndex = t.parent.pageIndex;
                this.name = t.name;
                this.div = null;
                this._uiManager = t.uiManager;
                this.annotationElementId = null;
                this._willKeepAspectRatio = !1;
                this._initialOptions.isCentered = t.isCentered;
                this._structTreeParentId = null;
                const { rotation: e, rawDims: { pageWidth: i, pageHeight: s, pageX: a, pageY: r } } = this.parent.viewport;
                this.rotation = e;
                this.pageRotation = (360 + e - this._uiManager.viewParameters.rotation) % 360;
                this.pageDimensions = [
                    i,
                    s
                ];
                this.pageTranslation = [
                    a,
                    r
                ];
                const [o, l] = this.parentDimensions;
                this.x = t.x / o;
                this.y = t.y / l;
                this.isAttachedToDOM = !1;
                this.deleted = !1;
            }
            get editorType() {
                return Object.getPrototypeOf(this).constructor._type;
            }
            static get _defaultLineColor() {
                return (0, n.shadow)(this, "_defaultLineColor", this._colorManager.getHexCode("CanvasText"));
            }
            static deleteAnnotationElement(t) {
                const e = new FakeEditor({
                    id: t.parent.getNextId(),
                    parent: t.parent,
                    uiManager: t._uiManager
                });
                e.annotationElementId = t.annotationElementId;
                e.deleted = !0;
                e._uiManager.addToAnnotationStorage(e);
            }
            static initialize(t, e = null) {
                AnnotationEditor._l10nPromise ||= new Map([
                    "pdfjs-editor-alt-text-button-label",
                    "pdfjs-editor-alt-text-edit-button-label",
                    "pdfjs-editor-alt-text-decorative-tooltip",
                    "pdfjs-editor-resizer-label-topLeft",
                    "pdfjs-editor-resizer-label-topMiddle",
                    "pdfjs-editor-resizer-label-topRight",
                    "pdfjs-editor-resizer-label-middleRight",
                    "pdfjs-editor-resizer-label-bottomRight",
                    "pdfjs-editor-resizer-label-bottomMiddle",
                    "pdfjs-editor-resizer-label-bottomLeft",
                    "pdfjs-editor-resizer-label-middleLeft"
                ].map((e)=>[
                        e,
                        t.get(e.replaceAll(/([A-Z])/g, (t)=>`-${t.toLowerCase()}`))
                    ]));
                if (e?.strings) for (const i of e.strings)AnnotationEditor._l10nPromise.set(i, t.get(i));
                if (-1 !== AnnotationEditor._borderLineWidth) return;
                const i = getComputedStyle(document.documentElement);
                AnnotationEditor._borderLineWidth = parseFloat(i.getPropertyValue("--outline-width")) || 0;
            }
            static updateDefaultParams(t, e) {}
            static get defaultPropertiesToUpdate() {
                return [];
            }
            static isHandlingMimeForPasting(t) {
                return !1;
            }
            static paste(t, e) {
                (0, n.unreachable)("Not implemented");
            }
            get propertiesToUpdate() {
                return [];
            }
            get _isDraggable() {
                return this.#cs;
            }
            set _isDraggable(t) {
                this.#cs = t;
                this.div?.classList.toggle("draggable", t);
            }
            get isEnterHandled() {
                return !0;
            }
            center() {
                const [t, e] = this.pageDimensions;
                switch(this.parentRotation){
                    case 90:
                        this.x -= this.height * e / (2 * t);
                        this.y += this.width * t / (2 * e);
                        break;
                    case 180:
                        this.x += this.width / 2;
                        this.y += this.height / 2;
                        break;
                    case 270:
                        this.x += this.height * e / (2 * t);
                        this.y -= this.width * t / (2 * e);
                        break;
                    default:
                        this.x -= this.width / 2;
                        this.y -= this.height / 2;
                }
                this.fixAndSetPosition();
            }
            addCommands(t) {
                this._uiManager.addCommands(t);
            }
            get currentLayer() {
                return this._uiManager.currentLayer;
            }
            setInBackground() {
                this.div.style.zIndex = 0;
            }
            setInForeground() {
                this.div.style.zIndex = this.#us;
            }
            setParent(t) {
                if (null !== t) {
                    this.pageIndex = t.pageIndex;
                    this.pageDimensions = t.pageDimensions;
                } else this.#ps();
                this.parent = t;
            }
            focusin(t) {
                this._focusEventsAllowed && (this.#rs ? this.#rs = !1 : this.parent.setSelected(this));
            }
            focusout(t) {
                if (!this._focusEventsAllowed) return;
                if (!this.isAttachedToDOM) return;
                const e = t.relatedTarget;
                if (!e?.closest(`#${this.id}`)) {
                    t.preventDefault();
                    this.parent?.isMultipleSelection || this.commitOrRemove();
                }
            }
            commitOrRemove() {
                this.isEmpty() ? this.remove() : this.commit();
            }
            commit() {
                this.addToAnnotationStorage();
            }
            addToAnnotationStorage() {
                this._uiManager.addToAnnotationStorage(this);
            }
            setAt(t, e, i, s) {
                const [n, a] = this.parentDimensions;
                [i, s] = this.screenToPageTranslation(i, s);
                this.x = (t + i) / n;
                this.y = (e + s) / a;
                this.fixAndSetPosition();
            }
            #gs([t, e], i, s) {
                [i, s] = this.screenToPageTranslation(i, s);
                this.x += i / t;
                this.y += s / e;
                this.fixAndSetPosition();
            }
            translate(t, e) {
                this.#gs(this.parentDimensions, t, e);
            }
            translateInPage(t, e) {
                this.#gs(this.pageDimensions, t, e);
                this.div.scrollIntoView({
                    block: "nearest"
                });
            }
            drag(t, e) {
                const [i, s] = this.parentDimensions;
                this.x += t / i;
                this.y += e / s;
                if (this.parent && (this.x < 0 || this.x > 1 || this.y < 0 || this.y > 1)) {
                    const { x: t, y: e } = this.div.getBoundingClientRect();
                    if (this.parent.findNewParent(this, t, e)) {
                        this.x -= Math.floor(this.x);
                        this.y -= Math.floor(this.y);
                    }
                }
                let { x: n, y: a } = this;
                const [r, o] = this.#ms();
                n += r;
                a += o;
                this.div.style.left = `${(100 * n).toFixed(2)}%`;
                this.div.style.top = `${(100 * a).toFixed(2)}%`;
                this.div.scrollIntoView({
                    block: "nearest"
                });
            }
            #ms() {
                const [t, e] = this.parentDimensions, { _borderLineWidth: i } = AnnotationEditor, s = i / t, n = i / e;
                switch(this.rotation){
                    case 90:
                        return [
                            -s,
                            n
                        ];
                    case 180:
                        return [
                            s,
                            n
                        ];
                    case 270:
                        return [
                            s,
                            -n
                        ];
                    default:
                        return [
                            -s,
                            -n
                        ];
                }
            }
            fixAndSetPosition(t = this.rotation) {
                const [e, i] = this.pageDimensions;
                let { x: s, y: n, width: a, height: r } = this;
                a *= e;
                r *= i;
                s *= e;
                n *= i;
                switch(t){
                    case 0:
                        s = Math.max(0, Math.min(e - a, s));
                        n = Math.max(0, Math.min(i - r, n));
                        break;
                    case 90:
                        s = Math.max(0, Math.min(e - r, s));
                        n = Math.min(i, Math.max(a, n));
                        break;
                    case 180:
                        s = Math.min(e, Math.max(a, s));
                        n = Math.min(i, Math.max(r, n));
                        break;
                    case 270:
                        s = Math.min(e, Math.max(r, s));
                        n = Math.max(0, Math.min(i - a, n));
                }
                this.x = s /= e;
                this.y = n /= i;
                const [o, l] = this.#ms();
                s += o;
                n += l;
                const { style: h } = this.div;
                h.left = `${(100 * s).toFixed(2)}%`;
                h.top = `${(100 * n).toFixed(2)}%`;
                this.moveInDOM();
            }
            static #fs(t, e, i) {
                switch(i){
                    case 90:
                        return [
                            e,
                            -t
                        ];
                    case 180:
                        return [
                            -t,
                            -e
                        ];
                    case 270:
                        return [
                            -e,
                            t
                        ];
                    default:
                        return [
                            t,
                            e
                        ];
                }
            }
            screenToPageTranslation(t, e) {
                return AnnotationEditor.#fs(t, e, this.parentRotation);
            }
            pageTranslationToScreen(t, e) {
                return AnnotationEditor.#fs(t, e, 360 - this.parentRotation);
            }
            #bs(t) {
                switch(t){
                    case 90:
                        {
                            const [t, e] = this.pageDimensions;
                            return [
                                0,
                                -t / e,
                                e / t,
                                0
                            ];
                        }
                    case 180:
                        return [
                            -1,
                            0,
                            0,
                            -1
                        ];
                    case 270:
                        {
                            const [t, e] = this.pageDimensions;
                            return [
                                0,
                                t / e,
                                -e / t,
                                0
                            ];
                        }
                    default:
                        return [
                            1,
                            0,
                            0,
                            1
                        ];
                }
            }
            get parentScale() {
                return this._uiManager.viewParameters.realScale;
            }
            get parentRotation() {
                return (this._uiManager.viewParameters.rotation + this.pageRotation) % 360;
            }
            get parentDimensions() {
                const { parentScale: t, pageDimensions: [e, i] } = this, s = e * t, a = i * t;
                return n.FeatureTest.isCSSRoundSupported ? [
                    Math.round(s),
                    Math.round(a)
                ] : [
                    s,
                    a
                ];
            }
            setDims(t, e) {
                const [i, s] = this.parentDimensions;
                this.div.style.width = `${(100 * t / i).toFixed(2)}%`;
                this.#Zi || (this.div.style.height = `${(100 * e / s).toFixed(2)}%`);
            }
            fixDims() {
                const { style: t } = this.div, { height: e, width: i } = t, s = i.endsWith("%"), n = !this.#Zi && e.endsWith("%");
                if (s && n) return;
                const [a, r] = this.parentDimensions;
                s || (t.width = `${(100 * parseFloat(i) / a).toFixed(2)}%`);
                this.#Zi || n || (t.height = `${(100 * parseFloat(e) / r).toFixed(2)}%`);
            }
            getInitialTranslation() {
                return [
                    0,
                    0
                ];
            }
            #As() {
                if (this.#ts) return;
                this.#ts = document.createElement("div");
                this.#ts.classList.add("resizers");
                const t = this._willKeepAspectRatio ? [
                    "topLeft",
                    "topRight",
                    "bottomRight",
                    "bottomLeft"
                ] : [
                    "topLeft",
                    "topMiddle",
                    "topRight",
                    "middleRight",
                    "bottomRight",
                    "bottomMiddle",
                    "bottomLeft",
                    "middleLeft"
                ];
                for (const e of t){
                    const t = document.createElement("div");
                    this.#ts.append(t);
                    t.classList.add("resizer", e);
                    t.setAttribute("data-resizer-name", e);
                    t.addEventListener("pointerdown", this.#vs.bind(this, e));
                    t.addEventListener("contextmenu", a.noContextMenu);
                    t.tabIndex = -1;
                }
                this.div.prepend(this.#ts);
            }
            #vs(t, e) {
                e.preventDefault();
                const { isMac: i } = n.FeatureTest.platform;
                if (0 !== e.button || e.ctrlKey && i) return;
                this.#Oi?.toggle(!1);
                const s = this.#ys.bind(this, t), a = this._isDraggable;
                this._isDraggable = !1;
                const r = {
                    passive: !0,
                    capture: !0
                };
                this.parent.togglePointerEvents(!1);
                window.addEventListener("pointermove", s, r);
                const o = this.x, l = this.y, h = this.width, d = this.height, c = this.parent.div.style.cursor, u = this.div.style.cursor;
                this.div.style.cursor = this.parent.div.style.cursor = window.getComputedStyle(e.target).cursor;
                const pointerUpCallback = ()=>{
                    this.parent.togglePointerEvents(!0);
                    this.#Oi?.toggle(!0);
                    this._isDraggable = a;
                    window.removeEventListener("pointerup", pointerUpCallback);
                    window.removeEventListener("blur", pointerUpCallback);
                    window.removeEventListener("pointermove", s, r);
                    this.parent.div.style.cursor = c;
                    this.div.style.cursor = u;
                    this.#Es(o, l, h, d);
                };
                window.addEventListener("pointerup", pointerUpCallback);
                window.addEventListener("blur", pointerUpCallback);
            }
            #Es(t, e, i, s) {
                const n = this.x, a = this.y, r = this.width, o = this.height;
                n === t && a === e && r === i && o === s || this.addCommands({
                    cmd: ()=>{
                        this.width = r;
                        this.height = o;
                        this.x = n;
                        this.y = a;
                        const [t, e] = this.parentDimensions;
                        this.setDims(t * r, e * o);
                        this.fixAndSetPosition();
                    },
                    undo: ()=>{
                        this.width = i;
                        this.height = s;
                        this.x = t;
                        this.y = e;
                        const [n, a] = this.parentDimensions;
                        this.setDims(n * i, a * s);
                        this.fixAndSetPosition();
                    },
                    mustExec: !0
                });
            }
            #ys(t, e) {
                const [i, s] = this.parentDimensions, n = this.x, a = this.y, r = this.width, o = this.height, l = AnnotationEditor.MIN_SIZE / i, h = AnnotationEditor.MIN_SIZE / s, round = (t)=>Math.round(1e4 * t) / 1e4, d = this.#bs(this.rotation), transf = (t, e)=>[
                        d[0] * t + d[2] * e,
                        d[1] * t + d[3] * e
                    ], c = this.#bs(360 - this.rotation);
                let u, p, g = !1, m = !1;
                switch(t){
                    case "topLeft":
                        g = !0;
                        u = (t, e)=>[
                                0,
                                0
                            ];
                        p = (t, e)=>[
                                t,
                                e
                            ];
                        break;
                    case "topMiddle":
                        u = (t, e)=>[
                                t / 2,
                                0
                            ];
                        p = (t, e)=>[
                                t / 2,
                                e
                            ];
                        break;
                    case "topRight":
                        g = !0;
                        u = (t, e)=>[
                                t,
                                0
                            ];
                        p = (t, e)=>[
                                0,
                                e
                            ];
                        break;
                    case "middleRight":
                        m = !0;
                        u = (t, e)=>[
                                t,
                                e / 2
                            ];
                        p = (t, e)=>[
                                0,
                                e / 2
                            ];
                        break;
                    case "bottomRight":
                        g = !0;
                        u = (t, e)=>[
                                t,
                                e
                            ];
                        p = (t, e)=>[
                                0,
                                0
                            ];
                        break;
                    case "bottomMiddle":
                        u = (t, e)=>[
                                t / 2,
                                e
                            ];
                        p = (t, e)=>[
                                t / 2,
                                0
                            ];
                        break;
                    case "bottomLeft":
                        g = !0;
                        u = (t, e)=>[
                                0,
                                e
                            ];
                        p = (t, e)=>[
                                t,
                                0
                            ];
                        break;
                    case "middleLeft":
                        m = !0;
                        u = (t, e)=>[
                                0,
                                e / 2
                            ];
                        p = (t, e)=>[
                                t,
                                e / 2
                            ];
                }
                const f = u(r, o), b = p(r, o);
                let A = transf(...b);
                const v = round(n + A[0]), y = round(a + A[1]);
                let E = 1, _ = 1, [w, x] = this.screenToPageTranslation(e.movementX, e.movementY);
                [w, x] = (C = w / i, S = x / s, [
                    c[0] * C + c[2] * S,
                    c[1] * C + c[3] * S
                ]);
                var C, S;
                if (g) {
                    const t = Math.hypot(r, o);
                    E = _ = Math.max(Math.min(Math.hypot(b[0] - f[0] - w, b[1] - f[1] - x) / t, 1 / r, 1 / o), l / r, h / o);
                } else m ? E = Math.max(l, Math.min(1, Math.abs(b[0] - f[0] - w))) / r : _ = Math.max(h, Math.min(1, Math.abs(b[1] - f[1] - x))) / o;
                const T = round(r * E), M = round(o * _);
                A = transf(...p(T, M));
                const P = v - A[0], F = y - A[1];
                this.width = T;
                this.height = M;
                this.x = P;
                this.y = F;
                this.setDims(i * T, s * M);
                this.fixAndSetPosition();
            }
            altTextFinish() {
                this.#Oi?.finish();
            }
            async addEditToolbar() {
                if (this.#ns || this.#ls) return this.#ns;
                this.#ns = new EditorToolbar(this);
                this.div.append(this.#ns.render());
                this.#Oi && this.#ns.addAltTextButton(await this.#Oi.render());
                return this.#ns;
            }
            removeEditToolbar() {
                if (this.#ns) {
                    this.#ns.remove();
                    this.#ns = null;
                    this.#Oi?.destroy();
                }
            }
            getClientDimensions() {
                return this.div.getBoundingClientRect();
            }
            async addAltTextButton() {
                if (!this.#Oi) {
                    AltText.initialize(AnnotationEditor._l10nPromise);
                    this.#Oi = new AltText(this);
                    await this.addEditToolbar();
                }
            }
            get altTextData() {
                return this.#Oi?.data;
            }
            set altTextData(t) {
                this.#Oi && (this.#Oi.data = t);
            }
            render() {
                this.div = document.createElement("div");
                this.div.setAttribute("data-editor-rotation", (360 - this.rotation) % 360);
                this.div.className = this.name;
                this.div.setAttribute("id", this.id);
                this.div.setAttribute("tabIndex", 0);
                this.setInForeground();
                this.div.addEventListener("focusin", this.#is);
                this.div.addEventListener("focusout", this.#ss);
                const [t, e] = this.parentDimensions;
                if (this.parentRotation % 180 != 0) {
                    this.div.style.maxWidth = `${(100 * e / t).toFixed(2)}%`;
                    this.div.style.maxHeight = `${(100 * t / e).toFixed(2)}%`;
                }
                const [i, n] = this.getInitialTranslation();
                this.translate(i, n);
                (0, s.bindEvents)(this, this.div, [
                    "pointerdown"
                ]);
                return this.div;
            }
            pointerdown(t) {
                const { isMac: e } = n.FeatureTest.platform;
                if (0 !== t.button || t.ctrlKey && e) t.preventDefault();
                else {
                    this.#rs = !0;
                    this._isDraggable ? this.#_s(t) : this.#ws(t);
                }
            }
            #ws(t) {
                const { isMac: e } = n.FeatureTest.platform;
                t.ctrlKey && !e || t.shiftKey || t.metaKey && e ? this.parent.toggleSelected(this) : this.parent.setSelected(this);
            }
            #_s(t) {
                const e = this._uiManager.isSelected(this);
                this._uiManager.setUpDragSession();
                let i, s;
                if (e) {
                    i = {
                        passive: !0,
                        capture: !0
                    };
                    s = (t)=>{
                        const [e, i] = this.screenToPageTranslation(t.movementX, t.movementY);
                        this._uiManager.dragSelectedEditors(e, i);
                    };
                    window.addEventListener("pointermove", s, i);
                }
                const pointerUpCallback = ()=>{
                    window.removeEventListener("pointerup", pointerUpCallback);
                    window.removeEventListener("blur", pointerUpCallback);
                    e && window.removeEventListener("pointermove", s, i);
                    this.#rs = !1;
                    this._uiManager.endDragSession() || this.#ws(t);
                };
                window.addEventListener("pointerup", pointerUpCallback);
                window.addEventListener("blur", pointerUpCallback);
            }
            moveInDOM() {
                this.#ds && clearTimeout(this.#ds);
                this.#ds = setTimeout(()=>{
                    this.#ds = null;
                    this.parent?.moveEditorInDOM(this);
                }, 0);
            }
            _setParentAndPosition(t, e, i) {
                t.changeParent(this);
                this.x = e;
                this.y = i;
                this.fixAndSetPosition();
            }
            getRect(t, e, i = this.rotation) {
                const s = this.parentScale, [n, a] = this.pageDimensions, [r, o] = this.pageTranslation, l = t / s, h = e / s, d = this.x * n, c = this.y * a, u = this.width * n, p = this.height * a;
                switch(i){
                    case 0:
                        return [
                            d + l + r,
                            a - c - h - p + o,
                            d + l + u + r,
                            a - c - h + o
                        ];
                    case 90:
                        return [
                            d + h + r,
                            a - c + l + o,
                            d + h + p + r,
                            a - c + l + u + o
                        ];
                    case 180:
                        return [
                            d - l - u + r,
                            a - c + h + o,
                            d - l + r,
                            a - c + h + p + o
                        ];
                    case 270:
                        return [
                            d - h - p + r,
                            a - c - l - u + o,
                            d - h + r,
                            a - c - l + o
                        ];
                    default:
                        throw new Error("Invalid rotation");
                }
            }
            getRectInCurrentCoords(t, e) {
                const [i, s, n, a] = t, r = n - i, o = a - s;
                switch(this.rotation){
                    case 0:
                        return [
                            i,
                            e - a,
                            r,
                            o
                        ];
                    case 90:
                        return [
                            i,
                            e - s,
                            o,
                            r
                        ];
                    case 180:
                        return [
                            n,
                            e - s,
                            r,
                            o
                        ];
                    case 270:
                        return [
                            n,
                            e - a,
                            o,
                            r
                        ];
                    default:
                        throw new Error("Invalid rotation");
                }
            }
            onceAdded() {}
            isEmpty() {
                return !1;
            }
            enableEditMode() {
                this.#ls = !0;
            }
            disableEditMode() {
                this.#ls = !1;
            }
            isInEditMode() {
                return this.#ls;
            }
            shouldGetKeyboardEvents() {
                return this.#hs;
            }
            needsToBeRebuilt() {
                return this.div && !this.isAttachedToDOM;
            }
            rebuild() {
                this.div?.addEventListener("focusin", this.#is);
                this.div?.addEventListener("focusout", this.#ss);
            }
            rotate(t) {}
            serialize(t = !1, e = null) {
                (0, n.unreachable)("An editor must be serializable");
            }
            static deserialize(t, e, i) {
                const s = new this.prototype.constructor({
                    parent: e,
                    id: e.getNextId(),
                    uiManager: i
                });
                s.rotation = t.rotation;
                const [n, a] = s.pageDimensions, [r, o, l, h] = s.getRectInCurrentCoords(t.rect, a);
                s.x = r / n;
                s.y = o / a;
                s.width = l / n;
                s.height = h / a;
                return s;
            }
            remove() {
                this.div.removeEventListener("focusin", this.#is);
                this.div.removeEventListener("focusout", this.#ss);
                this.isEmpty() || this.commit();
                this.parent ? this.parent.remove(this) : this._uiManager.removeEditor(this);
                if (this.#ds) {
                    clearTimeout(this.#ds);
                    this.#ds = null;
                }
                this.#ps();
                this.removeEditToolbar();
            }
            get isResizable() {
                return !1;
            }
            makeResizable() {
                if (this.isResizable) {
                    this.#As();
                    this.#ts.classList.remove("hidden");
                    (0, s.bindEvents)(this, this.div, [
                        "keydown"
                    ]);
                }
            }
            get toolbarPosition() {
                return null;
            }
            keydown(t) {
                if (!this.isResizable || t.target !== this.div || "Enter" !== t.key) return;
                this._uiManager.setSelected(this);
                this.#es = {
                    savedX: this.x,
                    savedY: this.y,
                    savedWidth: this.width,
                    savedHeight: this.height
                };
                const e = this.#ts.children;
                if (!this.#Qi) {
                    this.#Qi = Array.from(e);
                    const t = this.#xs.bind(this), i = this.#Cs.bind(this);
                    for (const e of this.#Qi){
                        const s = e.getAttribute("data-resizer-name");
                        e.setAttribute("role", "spinbutton");
                        e.addEventListener("keydown", t);
                        e.addEventListener("blur", i);
                        e.addEventListener("focus", this.#Ss.bind(this, s));
                        AnnotationEditor._l10nPromise.get(`pdfjs-editor-resizer-label-${s}`).then((t)=>e.setAttribute("aria-label", t));
                    }
                }
                const i = this.#Qi[0];
                let s = 0;
                for (const t of e){
                    if (t === i) break;
                    s++;
                }
                const n = (360 - this.rotation + this.parentRotation) % 360 / 90 * (this.#Qi.length / 4);
                if (n !== s) {
                    if (n < s) for(let t = 0; t < s - n; t++)this.#ts.append(this.#ts.firstChild);
                    else if (n > s) for(let t = 0; t < n - s; t++)this.#ts.firstChild.before(this.#ts.lastChild);
                    let t = 0;
                    for (const i of e){
                        const e = this.#Qi[t++].getAttribute("data-resizer-name");
                        AnnotationEditor._l10nPromise.get(`pdfjs-editor-resizer-label-${e}`).then((t)=>i.setAttribute("aria-label", t));
                    }
                }
                this.#Ts(0);
                this.#hs = !0;
                this.#ts.firstChild.focus({
                    focusVisible: !0
                });
                t.preventDefault();
                t.stopImmediatePropagation();
            }
            #xs(t) {
                AnnotationEditor._resizerKeyboardManager.exec(this, t);
            }
            #Cs(t) {
                this.#hs && t.relatedTarget?.parentNode !== this.#ts && this.#ps();
            }
            #Ss(t) {
                this.#as = this.#hs ? t : "";
            }
            #Ts(t) {
                if (this.#Qi) for (const e of this.#Qi)e.tabIndex = t;
            }
            _resizeWithKeyboard(t, e) {
                this.#hs && this.#ys(this.#as, {
                    movementX: t,
                    movementY: e
                });
            }
            #ps() {
                this.#hs = !1;
                this.#Ts(-1);
                if (this.#es) {
                    const { savedX: t, savedY: e, savedWidth: i, savedHeight: s } = this.#es;
                    this.#Es(t, e, i, s);
                    this.#es = null;
                }
            }
            _stopResizingWithKeyboard() {
                this.#ps();
                this.div.focus();
            }
            select() {
                this.makeResizable();
                this.div?.classList.add("selectedEditor");
                this.#ns ? this.#ns?.show() : this.addEditToolbar().then(()=>{
                    this.div?.classList.contains("selectedEditor") && this.#ns?.show();
                });
            }
            unselect() {
                this.#ts?.classList.add("hidden");
                this.div?.classList.remove("selectedEditor");
                this.div?.contains(document.activeElement) && this._uiManager.currentLayer.div.focus();
                this.#ns?.hide();
            }
            updateParams(t, e) {}
            disableEditing() {}
            enableEditing() {}
            enterInEditMode() {}
            getImageForAltText() {
                return null;
            }
            get contentDiv() {
                return this.div;
            }
            get isEditing() {
                return this.#os;
            }
            set isEditing(t) {
                this.#os = t;
                if (this.parent) if (t) {
                    this.parent.setSelected(this);
                    this.parent.setActiveEditor(this);
                } else this.parent.setActiveEditor(null);
            }
            setAspectRatio(t, e) {
                this.#Zi = !0;
                const i = t / e, { style: s } = this.div;
                s.aspectRatio = i;
                s.height = "auto";
            }
            static get MIN_SIZE() {
                return 16;
            }
            static canCreateNewEmptyEditor() {
                return !0;
            }
        }
        class FakeEditor extends AnnotationEditor {
            constructor(t){
                super(t);
                this.annotationElementId = t.annotationElementId;
                this.deleted = !0;
            }
            serialize() {
                return {
                    id: this.annotationElementId,
                    deleted: !0,
                    pageIndex: this.pageIndex
                };
            }
        }
    },
    405: (t, e, i)=>{
        i.d(e, {
            Outliner: ()=>Outliner
        });
        class Outliner {
            #Ms;
            #Ps;
            #Fs;
            constructor(t, e = 0, i = 0, s = !0){
                this.#Ps = [];
                this.#Fs = [];
                let n = 1 / 0, a = -1 / 0, r = 1 / 0, o = -1 / 0;
                const l = 10 ** -4;
                for (const { x: i, y: s, width: h, height: d } of t){
                    const t = Math.floor((i - e) / l) * l, c = Math.ceil((i + h + e) / l) * l, u = Math.floor((s - e) / l) * l, p = Math.ceil((s + d + e) / l) * l, g = [
                        t,
                        u,
                        p,
                        !0
                    ], m = [
                        c,
                        u,
                        p,
                        !1
                    ];
                    this.#Ps.push(g, m);
                    n = Math.min(n, t);
                    a = Math.max(a, c);
                    r = Math.min(r, u);
                    o = Math.max(o, p);
                }
                const h = a - n + 2 * i, d = o - r + 2 * i, c = n - i, u = r - i, p = this.#Ps.at(s ? -1 : -2), g = [
                    p[0],
                    p[2]
                ];
                for (const t of this.#Ps){
                    const [e, i, s] = t;
                    t[0] = (e - c) / h;
                    t[1] = (i - u) / d;
                    t[2] = (s - u) / d;
                }
                this.#Ms = {
                    x: c,
                    y: u,
                    width: h,
                    height: d,
                    lastPoint: g
                };
            }
            getOutlines() {
                this.#Ps.sort((t, e)=>t[0] - e[0] || t[1] - e[1] || t[2] - e[2]);
                const t = [];
                for (const e of this.#Ps)if (e[3]) {
                    t.push(...this.#Rs(e));
                    this.#ks(e);
                } else {
                    this.#Ds(e);
                    t.push(...this.#Rs(e));
                }
                return this.#Is(t);
            }
            #Is(t) {
                const e = [], i = new Set;
                for (const i of t){
                    const [t, s, n] = i;
                    e.push([
                        t,
                        s,
                        i
                    ], [
                        t,
                        n,
                        i
                    ]);
                }
                e.sort((t, e)=>t[1] - e[1] || t[0] - e[0]);
                for(let t = 0, s = e.length; t < s; t += 2){
                    const s = e[t][2], n = e[t + 1][2];
                    s.push(n);
                    n.push(s);
                    i.add(s);
                    i.add(n);
                }
                const s = [];
                let n;
                for(; i.size > 0;){
                    const t = i.values().next().value;
                    let [e, a, r, o, l] = t;
                    i.delete(t);
                    let h = e, d = a;
                    n = [
                        e,
                        r
                    ];
                    s.push(n);
                    for(;;){
                        let t;
                        if (i.has(o)) t = o;
                        else {
                            if (!i.has(l)) break;
                            t = l;
                        }
                        i.delete(t);
                        [e, a, r, o, l] = t;
                        if (h !== e) {
                            n.push(h, d, e, d === a ? a : r);
                            h = e;
                        }
                        d = d === a ? r : a;
                    }
                    n.push(h, d);
                }
                return {
                    outlines: s,
                    box: this.#Ms
                };
            }
            #Ls(t) {
                const e = this.#Fs;
                let i = 0, s = e.length - 1;
                for(; i <= s;){
                    const n = i + s >> 1, a = e[n][0];
                    if (a === t) return n;
                    a < t ? i = n + 1 : s = n - 1;
                }
                return s + 1;
            }
            #ks([, t, e]) {
                const i = this.#Ls(t);
                this.#Fs.splice(i, 0, [
                    t,
                    e
                ]);
            }
            #Ds([, t, e]) {
                const i = this.#Ls(t);
                for(let s = i; s < this.#Fs.length; s++){
                    const [i, n] = this.#Fs[s];
                    if (i !== t) break;
                    if (i === t && n === e) {
                        this.#Fs.splice(s, 1);
                        return;
                    }
                }
                for(let s = i - 1; s >= 0; s--){
                    const [i, n] = this.#Fs[s];
                    if (i !== t) break;
                    if (i === t && n === e) {
                        this.#Fs.splice(s, 1);
                        return;
                    }
                }
            }
            #Rs(t) {
                const [e, i, s] = t, n = [
                    [
                        e,
                        i,
                        s
                    ]
                ], a = this.#Ls(s);
                for(let t = 0; t < a; t++){
                    const [i, s] = this.#Fs[t];
                    for(let t = 0, a = n.length; t < a; t++){
                        const [, r, o] = n[t];
                        if (!(s <= r || o <= i)) if (r >= i) if (o > s) n[t][1] = s;
                        else {
                            if (1 === a) return [];
                            n.splice(t, 1);
                            t--;
                            a--;
                        }
                        else {
                            n[t][2] = i;
                            o > s && n.push([
                                e,
                                s,
                                o
                            ]);
                        }
                    }
                }
                return n;
            }
        }
    },
    812: (t, e, i)=>{
        i.d(e, {
            AnnotationEditorUIManager: ()=>AnnotationEditorUIManager,
            ColorManager: ()=>ColorManager,
            KeyboardManager: ()=>KeyboardManager,
            bindEvents: ()=>bindEvents,
            opacityToHex: ()=>opacityToHex
        });
        var s = i(266), n = i(473);
        function bindEvents(t, e, i) {
            for (const s of i)e.addEventListener(s, t[s].bind(t));
        }
        function opacityToHex(t) {
            return Math.round(Math.min(255, Math.max(1, 255 * t))).toString(16).padStart(2, "0");
        }
        class IdManager {
            #ft;
            getId() {
                return `${s.AnnotationEditorPrefix}${this.#ft++}`;
            }
            constructor(){
                this.#ft = 0;
            }
        }
        class ImageManager {
            #Os;
            #ft;
            #bt;
            static get _isSVGFittingCanvas() {
                const t = new OffscreenCanvas(1, 3).getContext("2d"), e = new Image;
                e.src = 'data:image/svg+xml;charset=UTF-8,<svg viewBox="0 0 1 1" width="1" height="1" xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1" style="fill:red;"/></svg>';
                const i = e.decode().then(()=>{
                    t.drawImage(e, 0, 0, 1, 1, 0, 0, 1, 3);
                    return 0 === new Uint32Array(t.getImageData(0, 0, 1, 1).data.buffer)[0];
                });
                return (0, s.shadow)(this, "_isSVGFittingCanvas", i);
            }
            async #Bs(t, e) {
                this.#bt ||= new Map;
                let i = this.#bt.get(t);
                if (null === i) return null;
                if (i?.bitmap) {
                    i.refCounter += 1;
                    return i;
                }
                try {
                    i ||= {
                        bitmap: null,
                        id: `image_${this.#Os}_${this.#ft++}`,
                        refCounter: 0,
                        isSvg: !1
                    };
                    let t;
                    if ("string" == typeof e) {
                        i.url = e;
                        t = await (0, n.fetchData)(e, "blob");
                    } else t = i.file = e;
                    if ("image/svg+xml" === t.type) {
                        const e = ImageManager._isSVGFittingCanvas, s = new FileReader, n = new Image, a = new Promise((t, a)=>{
                            n.onload = ()=>{
                                i.bitmap = n;
                                i.isSvg = !0;
                                t();
                            };
                            s.onload = async ()=>{
                                const t = i.svgUrl = s.result;
                                n.src = await e ? `${t}#svgView(preserveAspectRatio(none))` : t;
                            };
                            n.onerror = s.onerror = a;
                        });
                        s.readAsDataURL(t);
                        await a;
                    } else i.bitmap = await createImageBitmap(t);
                    i.refCounter = 1;
                } catch (t) {
                    console.error(t);
                    i = null;
                }
                this.#bt.set(t, i);
                i && this.#bt.set(i.id, i);
                return i;
            }
            async getFromFile(t) {
                const { lastModified: e, name: i, size: s, type: n } = t;
                return this.#Bs(`${e}_${i}_${s}_${n}`, t);
            }
            async getFromUrl(t) {
                return this.#Bs(t, t);
            }
            async getFromId(t) {
                this.#bt ||= new Map;
                const e = this.#bt.get(t);
                if (!e) return null;
                if (e.bitmap) {
                    e.refCounter += 1;
                    return e;
                }
                return e.file ? this.getFromFile(e.file) : this.getFromUrl(e.url);
            }
            getSvgUrl(t) {
                const e = this.#bt.get(t);
                return e?.isSvg ? e.svgUrl : null;
            }
            deleteId(t) {
                this.#bt ||= new Map;
                const e = this.#bt.get(t);
                if (e) {
                    e.refCounter -= 1;
                    0 === e.refCounter && (e.bitmap = null);
                }
            }
            isValidId(t) {
                return t.startsWith(`image_${this.#Os}_`);
            }
            constructor(){
                this.#Os = (0, s.getUuid)();
                this.#ft = 0;
                this.#bt = null;
            }
        }
        class CommandManager {
            #Ns;
            #Us;
            #zs;
            #Hs;
            constructor(t = 128){
                this.#Ns = [];
                this.#Us = !1;
                this.#Hs = -1;
                this.#zs = t;
            }
            add({ cmd: t, undo: e, mustExec: i, type: s = NaN, overwriteIfSameType: n = !1, keepUndo: a = !1 }) {
                i && t();
                if (this.#Us) return;
                const r = {
                    cmd: t,
                    undo: e,
                    type: s
                };
                if (-1 === this.#Hs) {
                    this.#Ns.length > 0 && (this.#Ns.length = 0);
                    this.#Hs = 0;
                    this.#Ns.push(r);
                    return;
                }
                if (n && this.#Ns[this.#Hs].type === s) {
                    a && (r.undo = this.#Ns[this.#Hs].undo);
                    this.#Ns[this.#Hs] = r;
                    return;
                }
                const o = this.#Hs + 1;
                if (o === this.#zs) this.#Ns.splice(0, 1);
                else {
                    this.#Hs = o;
                    o < this.#Ns.length && this.#Ns.splice(o);
                }
                this.#Ns.push(r);
            }
            undo() {
                if (-1 !== this.#Hs) {
                    this.#Us = !0;
                    this.#Ns[this.#Hs].undo();
                    this.#Us = !1;
                    this.#Hs -= 1;
                }
            }
            redo() {
                if (this.#Hs < this.#Ns.length - 1) {
                    this.#Hs += 1;
                    this.#Us = !0;
                    this.#Ns[this.#Hs].cmd();
                    this.#Us = !1;
                }
            }
            hasSomethingToUndo() {
                return -1 !== this.#Hs;
            }
            hasSomethingToRedo() {
                return this.#Hs < this.#Ns.length - 1;
            }
            destroy() {
                this.#Ns = null;
            }
        }
        class KeyboardManager {
            constructor(t){
                this.buffer = [];
                this.callbacks = new Map;
                this.allKeys = new Set;
                const { isMac: e } = s.FeatureTest.platform;
                for (const [i, s, n = {}] of t)for (const t of i){
                    const i = t.startsWith("mac+");
                    if (e && i) {
                        this.callbacks.set(t.slice(4), {
                            callback: s,
                            options: n
                        });
                        this.allKeys.add(t.split("+").at(-1));
                    } else if (!e && !i) {
                        this.callbacks.set(t, {
                            callback: s,
                            options: n
                        });
                        this.allKeys.add(t.split("+").at(-1));
                    }
                }
            }
            #js(t) {
                t.altKey && this.buffer.push("alt");
                t.ctrlKey && this.buffer.push("ctrl");
                t.metaKey && this.buffer.push("meta");
                t.shiftKey && this.buffer.push("shift");
                this.buffer.push(t.key);
                const e = this.buffer.join("+");
                this.buffer.length = 0;
                return e;
            }
            exec(t, e) {
                if (!this.allKeys.has(e.key)) return;
                const i = this.callbacks.get(this.#js(e));
                if (!i) return;
                const { callback: s, options: { bubbles: n = !1, args: a = [], checker: r = null } } = i;
                if (!r || r(t, e)) {
                    s.bind(t, ...a, e)();
                    if (!n) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            }
        }
        class ColorManager {
            static{
                this._colorsMapping = new Map([
                    [
                        "CanvasText",
                        [
                            0,
                            0,
                            0
                        ]
                    ],
                    [
                        "Canvas",
                        [
                            255,
                            255,
                            255
                        ]
                    ]
                ]);
            }
            get _colors() {
                const t = new Map([
                    [
                        "CanvasText",
                        null
                    ],
                    [
                        "Canvas",
                        null
                    ]
                ]);
                (0, n.getColorValues)(t);
                return (0, s.shadow)(this, "_colors", t);
            }
            convert(t) {
                const e = (0, n.getRGB)(t);
                if (!window.matchMedia("(forced-colors: active)").matches) return e;
                for (const [t, i] of this._colors)if (i.every((t, i)=>t === e[i])) return ColorManager._colorsMapping.get(t);
                return e;
            }
            getHexCode(t) {
                const e = this._colors.get(t);
                return e ? s.Util.makeHexColor(...e) : t;
            }
        }
        class AnnotationEditorUIManager {
            #Vs;
            #Ws;
            #qs;
            #Gs;
            #$s;
            #Ks;
            #Xs;
            #Ys;
            #Js;
            #yi;
            #Qs;
            #Zs;
            #tn;
            #en;
            #in;
            #sn;
            #nn;
            #an;
            #rn;
            #on;
            #ln;
            #hn;
            #dn;
            #cn;
            #un;
            #pn;
            #gn;
            #mn;
            #fn;
            #bn;
            #An;
            #vn;
            #yn;
            #En;
            #_n;
            #p;
            #wn;
            static{
                this.TRANSLATE_SMALL = 1;
            }
            static{
                this.TRANSLATE_BIG = 10;
            }
            static get _keyboardManager() {
                const t = AnnotationEditorUIManager.prototype, arrowChecker = (t)=>t.#p.contains(document.activeElement) && "BUTTON" !== document.activeElement.tagName && t.hasSomethingToControl(), textInputChecker = (t, { target: e })=>{
                    if (e instanceof HTMLInputElement) {
                        const { type: t } = e;
                        return "text" !== t && "number" !== t;
                    }
                    return !0;
                }, e = this.TRANSLATE_SMALL, i = this.TRANSLATE_BIG;
                return (0, s.shadow)(this, "_keyboardManager", new KeyboardManager([
                    [
                        [
                            "ctrl+a",
                            "mac+meta+a"
                        ],
                        t.selectAll,
                        {
                            checker: textInputChecker
                        }
                    ],
                    [
                        [
                            "ctrl+z",
                            "mac+meta+z"
                        ],
                        t.undo,
                        {
                            checker: textInputChecker
                        }
                    ],
                    [
                        [
                            "ctrl+y",
                            "ctrl+shift+z",
                            "mac+meta+shift+z",
                            "ctrl+shift+Z",
                            "mac+meta+shift+Z"
                        ],
                        t.redo,
                        {
                            checker: textInputChecker
                        }
                    ],
                    [
                        [
                            "Backspace",
                            "alt+Backspace",
                            "ctrl+Backspace",
                            "shift+Backspace",
                            "mac+Backspace",
                            "mac+alt+Backspace",
                            "mac+ctrl+Backspace",
                            "Delete",
                            "ctrl+Delete",
                            "shift+Delete",
                            "mac+Delete"
                        ],
                        t.delete,
                        {
                            checker: textInputChecker
                        }
                    ],
                    [
                        [
                            "Enter",
                            "mac+Enter"
                        ],
                        t.addNewEditorFromKeyboard,
                        {
                            checker: (t, { target: e })=>!(e instanceof HTMLButtonElement) && t.#p.contains(e) && !t.isEnterHandled
                        }
                    ],
                    [
                        [
                            " ",
                            "mac+ "
                        ],
                        t.addNewEditorFromKeyboard,
                        {
                            checker: (t)=>t.#p.contains(document.activeElement)
                        }
                    ],
                    [
                        [
                            "Escape",
                            "mac+Escape"
                        ],
                        t.unselectAll
                    ],
                    [
                        [
                            "ArrowLeft",
                            "mac+ArrowLeft"
                        ],
                        t.translateSelectedEditors,
                        {
                            args: [
                                -e,
                                0
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowLeft",
                            "mac+shift+ArrowLeft"
                        ],
                        t.translateSelectedEditors,
                        {
                            args: [
                                -i,
                                0
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ArrowRight",
                            "mac+ArrowRight"
                        ],
                        t.translateSelectedEditors,
                        {
                            args: [
                                e,
                                0
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowRight",
                            "mac+shift+ArrowRight"
                        ],
                        t.translateSelectedEditors,
                        {
                            args: [
                                i,
                                0
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ArrowUp",
                            "mac+ArrowUp"
                        ],
                        t.translateSelectedEditors,
                        {
                            args: [
                                0,
                                -e
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowUp",
                            "mac+shift+ArrowUp"
                        ],
                        t.translateSelectedEditors,
                        {
                            args: [
                                0,
                                -i
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ArrowDown",
                            "mac+ArrowDown"
                        ],
                        t.translateSelectedEditors,
                        {
                            args: [
                                0,
                                e
                            ],
                            checker: arrowChecker
                        }
                    ],
                    [
                        [
                            "ctrl+ArrowDown",
                            "mac+shift+ArrowDown"
                        ],
                        t.translateSelectedEditors,
                        {
                            args: [
                                0,
                                i
                            ],
                            checker: arrowChecker
                        }
                    ]
                ]));
            }
            constructor(t, e, i, s1, a, r, o){
                this.#Vs = null;
                this.#Ws = new Map;
                this.#qs = new Map;
                this.#Gs = null;
                this.#$s = null;
                this.#Ks = new CommandManager;
                this.#Xs = 0;
                this.#Ys = new Set;
                this.#Js = null;
                this.#yi = null;
                this.#Qs = new Set;
                this.#Zs = null;
                this.#tn = null;
                this.#en = null;
                this.#in = new IdManager;
                this.#sn = !1;
                this.#nn = !1;
                this.#an = null;
                this.#rn = null;
                this.#on = s.AnnotationEditorType.NONE;
                this.#ln = new Set;
                this.#hn = null;
                this.#dn = this.blur.bind(this);
                this.#cn = this.focus.bind(this);
                this.#un = this.copy.bind(this);
                this.#pn = this.cut.bind(this);
                this.#gn = this.paste.bind(this);
                this.#mn = this.keydown.bind(this);
                this.#fn = this.onEditingAction.bind(this);
                this.#bn = this.onPageChanging.bind(this);
                this.#An = this.onScaleChanging.bind(this);
                this.#vn = this.onRotationChanging.bind(this);
                this.#yn = {
                    isEditing: !1,
                    isEmpty: !0,
                    hasSomethingToUndo: !1,
                    hasSomethingToRedo: !1,
                    hasSelectedEditor: !1
                };
                this.#En = [
                    0,
                    0
                ];
                this.#_n = null;
                this.#p = null;
                this.#wn = null;
                this.#p = t;
                this.#wn = e;
                this.#Gs = i;
                this._eventBus = s1;
                this._eventBus._on("editingaction", this.#fn);
                this._eventBus._on("pagechanging", this.#bn);
                this._eventBus._on("scalechanging", this.#An);
                this._eventBus._on("rotationchanging", this.#vn);
                this.#$s = a.annotationStorage;
                this.#Zs = a.filterFactory;
                this.#hn = r;
                this.#en = o || null;
                this.viewParameters = {
                    realScale: n.PixelsPerInch.PDF_TO_CSS_UNITS,
                    rotation: 0
                };
            }
            destroy() {
                this.#xn();
                this.#Cn();
                this._eventBus._off("editingaction", this.#fn);
                this._eventBus._off("pagechanging", this.#bn);
                this._eventBus._off("scalechanging", this.#An);
                this._eventBus._off("rotationchanging", this.#vn);
                for (const t of this.#qs.values())t.destroy();
                this.#qs.clear();
                this.#Ws.clear();
                this.#Qs.clear();
                this.#Vs = null;
                this.#ln.clear();
                this.#Ks.destroy();
                this.#Gs?.destroy();
                if (this.#tn) {
                    clearTimeout(this.#tn);
                    this.#tn = null;
                }
                if (this.#_n) {
                    clearTimeout(this.#_n);
                    this.#_n = null;
                }
            }
            get hcmFilter() {
                return (0, s.shadow)(this, "hcmFilter", this.#hn ? this.#Zs.addHCMFilter(this.#hn.foreground, this.#hn.background) : "none");
            }
            get direction() {
                return (0, s.shadow)(this, "direction", getComputedStyle(this.#p).direction);
            }
            get highlightColors() {
                return (0, s.shadow)(this, "highlightColors", this.#en ? new Map(this.#en.split(",").map((t)=>t.split("=").map((t)=>t.trim()))) : null);
            }
            setMainHighlightColorPicker(t) {
                this.#rn = t;
            }
            editAltText(t) {
                this.#Gs?.editAltText(this, t);
            }
            onPageChanging({ pageNumber: t }) {
                this.#Xs = t - 1;
            }
            focusMainContainer() {
                this.#p.focus();
            }
            findParent(t, e) {
                for (const i of this.#qs.values()){
                    const { x: s, y: n, width: a, height: r } = i.div.getBoundingClientRect();
                    if (t >= s && t <= s + a && e >= n && e <= n + r) return i;
                }
                return null;
            }
            disableUserSelect(t = !1) {
                this.#wn.classList.toggle("noUserSelect", t);
            }
            addShouldRescale(t) {
                this.#Qs.add(t);
            }
            removeShouldRescale(t) {
                this.#Qs.delete(t);
            }
            onScaleChanging({ scale: t }) {
                this.commitOrRemove();
                this.viewParameters.realScale = t * n.PixelsPerInch.PDF_TO_CSS_UNITS;
                for (const t of this.#Qs)t.onScaleChanging();
            }
            onRotationChanging({ pagesRotation: t }) {
                this.commitOrRemove();
                this.viewParameters.rotation = t;
            }
            addToAnnotationStorage(t) {
                t.isEmpty() || !this.#$s || this.#$s.has(t.id) || this.#$s.setValue(t.id, t);
            }
            #Sn() {
                window.addEventListener("focus", this.#cn);
                window.addEventListener("blur", this.#dn);
            }
            #Cn() {
                window.removeEventListener("focus", this.#cn);
                window.removeEventListener("blur", this.#dn);
            }
            blur() {
                if (!this.hasSelection) return;
                const { activeElement: t } = document;
                for (const e of this.#ln)if (e.div.contains(t)) {
                    this.#an = [
                        e,
                        t
                    ];
                    e._focusEventsAllowed = !1;
                    break;
                }
            }
            focus() {
                if (!this.#an) return;
                const [t, e] = this.#an;
                this.#an = null;
                e.addEventListener("focusin", ()=>{
                    t._focusEventsAllowed = !0;
                }, {
                    once: !0
                });
                e.focus();
            }
            #Tn() {
                window.addEventListener("keydown", this.#mn);
            }
            #xn() {
                window.removeEventListener("keydown", this.#mn);
            }
            #Mn() {
                document.addEventListener("copy", this.#un);
                document.addEventListener("cut", this.#pn);
                document.addEventListener("paste", this.#gn);
            }
            #Pn() {
                document.removeEventListener("copy", this.#un);
                document.removeEventListener("cut", this.#pn);
                document.removeEventListener("paste", this.#gn);
            }
            addEditListeners() {
                this.#Tn();
                this.#Mn();
            }
            removeEditListeners() {
                this.#xn();
                this.#Pn();
            }
            copy(t) {
                t.preventDefault();
                this.#Vs?.commitOrRemove();
                if (!this.hasSelection) return;
                const e = [];
                for (const t of this.#ln){
                    const i = t.serialize(!0);
                    i && e.push(i);
                }
                0 !== e.length && t.clipboardData.setData("application/pdfjs", JSON.stringify(e));
            }
            cut(t) {
                this.copy(t);
                this.delete();
            }
            paste(t) {
                t.preventDefault();
                const { clipboardData: e } = t;
                for (const t of e.items)for (const e of this.#yi)if (e.isHandlingMimeForPasting(t.type)) {
                    e.paste(t, this.currentLayer);
                    return;
                }
                let i = e.getData("application/pdfjs");
                if (!i) return;
                try {
                    i = JSON.parse(i);
                } catch (t) {
                    (0, s.warn)(`paste: "${t.message}".`);
                    return;
                }
                if (!Array.isArray(i)) return;
                this.unselectAll();
                const n = this.currentLayer;
                try {
                    const t = [];
                    for (const e of i){
                        const i = n.deserialize(e);
                        if (!i) return;
                        t.push(i);
                    }
                    const cmd = ()=>{
                        for (const e of t)this.#Fn(e);
                        this.#Rn(t);
                    }, undo = ()=>{
                        for (const e of t)e.remove();
                    };
                    this.addCommands({
                        cmd: cmd,
                        undo: undo,
                        mustExec: !0
                    });
                } catch (t) {
                    (0, s.warn)(`paste: "${t.message}".`);
                }
            }
            keydown(t) {
                this.isEditorHandlingKeyboard || AnnotationEditorUIManager._keyboardManager.exec(this, t);
            }
            onEditingAction(t) {
                [
                    "undo",
                    "redo",
                    "delete",
                    "selectAll"
                ].includes(t.name) && this[t.name]();
            }
            #kn(t) {
                Object.entries(t).some(([t, e])=>this.#yn[t] !== e) && this._eventBus.dispatch("annotationeditorstateschanged", {
                    source: this,
                    details: Object.assign(this.#yn, t)
                });
            }
            #Dn(t) {
                this._eventBus.dispatch("annotationeditorparamschanged", {
                    source: this,
                    details: t
                });
            }
            setEditingState(t) {
                if (t) {
                    this.#Sn();
                    this.#Tn();
                    this.#Mn();
                    this.#kn({
                        isEditing: this.#on !== s.AnnotationEditorType.NONE,
                        isEmpty: this.#In(),
                        hasSomethingToUndo: this.#Ks.hasSomethingToUndo(),
                        hasSomethingToRedo: this.#Ks.hasSomethingToRedo(),
                        hasSelectedEditor: !1
                    });
                } else {
                    this.#Cn();
                    this.#xn();
                    this.#Pn();
                    this.#kn({
                        isEditing: !1
                    });
                    this.disableUserSelect(!1);
                }
            }
            registerEditorTypes(t) {
                if (!this.#yi) {
                    this.#yi = t;
                    for (const t of this.#yi)this.#Dn(t.defaultPropertiesToUpdate);
                }
            }
            getId() {
                return this.#in.getId();
            }
            get currentLayer() {
                return this.#qs.get(this.#Xs);
            }
            getLayer(t) {
                return this.#qs.get(t);
            }
            get currentPageIndex() {
                return this.#Xs;
            }
            addLayer(t) {
                this.#qs.set(t.pageIndex, t);
                this.#sn ? t.enable() : t.disable();
            }
            removeLayer(t) {
                this.#qs.delete(t.pageIndex);
            }
            updateMode(t, e = null, i = !1) {
                if (this.#on !== t) {
                    this.#on = t;
                    if (t !== s.AnnotationEditorType.NONE) {
                        this.setEditingState(!0);
                        this.#Ln();
                        this.unselectAll();
                        for (const e of this.#qs.values())e.updateMode(t);
                        if (e || !i) {
                            if (e) {
                                for (const t of this.#Ws.values())if (t.annotationElementId === e) {
                                    this.setSelected(t);
                                    t.enterInEditMode();
                                    break;
                                }
                            }
                        } else this.addNewEditorFromKeyboard();
                    } else {
                        this.setEditingState(!1);
                        this.#On();
                    }
                }
            }
            addNewEditorFromKeyboard() {
                this.currentLayer.canCreateNewEmptyEditor() && this.currentLayer.addNewEditor();
            }
            updateToolbar(t) {
                t !== this.#on && this._eventBus.dispatch("switchannotationeditormode", {
                    source: this,
                    mode: t
                });
            }
            updateParams(t, e) {
                if (this.#yi) {
                    switch(t){
                        case s.AnnotationEditorParamsType.CREATE:
                            this.currentLayer.addNewEditor();
                            return;
                        case s.AnnotationEditorParamsType.HIGHLIGHT_DEFAULT_COLOR:
                            this.#rn?.updateColor(e);
                    }
                    for (const i of this.#ln)i.updateParams(t, e);
                    for (const i of this.#yi)i.updateDefaultParams(t, e);
                }
            }
            enableWaiting(t = !1) {
                if (this.#nn !== t) {
                    this.#nn = t;
                    for (const e of this.#qs.values()){
                        t ? e.disableClick() : e.enableClick();
                        e.div.classList.toggle("waiting", t);
                    }
                }
            }
            #Ln() {
                if (!this.#sn) {
                    this.#sn = !0;
                    for (const t of this.#qs.values())t.enable();
                }
            }
            #On() {
                this.unselectAll();
                if (this.#sn) {
                    this.#sn = !1;
                    for (const t of this.#qs.values())t.disable();
                }
            }
            getEditors(t) {
                const e = [];
                for (const i of this.#Ws.values())i.pageIndex === t && e.push(i);
                return e;
            }
            getEditor(t) {
                return this.#Ws.get(t);
            }
            addEditor(t) {
                this.#Ws.set(t.id, t);
            }
            removeEditor(t) {
                if (t.div.contains(document.activeElement)) {
                    this.#tn && clearTimeout(this.#tn);
                    this.#tn = setTimeout(()=>{
                        this.focusMainContainer();
                        this.#tn = null;
                    }, 0);
                }
                this.#Ws.delete(t.id);
                this.unselect(t);
                t.annotationElementId && this.#Ys.has(t.annotationElementId) || this.#$s?.remove(t.id);
            }
            addDeletedAnnotationElement(t) {
                this.#Ys.add(t.annotationElementId);
                t.deleted = !0;
            }
            isDeletedAnnotationElement(t) {
                return this.#Ys.has(t);
            }
            removeDeletedAnnotationElement(t) {
                this.#Ys.delete(t.annotationElementId);
                t.deleted = !1;
            }
            #Fn(t) {
                const e = this.#qs.get(t.pageIndex);
                e ? e.addOrRebuild(t) : this.addEditor(t);
            }
            setActiveEditor(t) {
                if (this.#Vs !== t) {
                    this.#Vs = t;
                    t && this.#Dn(t.propertiesToUpdate);
                }
            }
            toggleSelected(t) {
                if (this.#ln.has(t)) {
                    this.#ln.delete(t);
                    t.unselect();
                    this.#kn({
                        hasSelectedEditor: this.hasSelection
                    });
                } else {
                    this.#ln.add(t);
                    t.select();
                    this.#Dn(t.propertiesToUpdate);
                    this.#kn({
                        hasSelectedEditor: !0
                    });
                }
            }
            setSelected(t) {
                for (const e of this.#ln)e !== t && e.unselect();
                this.#ln.clear();
                this.#ln.add(t);
                t.select();
                this.#Dn(t.propertiesToUpdate);
                this.#kn({
                    hasSelectedEditor: !0
                });
            }
            isSelected(t) {
                return this.#ln.has(t);
            }
            get firstSelectedEditor() {
                return this.#ln.values().next().value;
            }
            unselect(t) {
                t.unselect();
                this.#ln.delete(t);
                this.#kn({
                    hasSelectedEditor: this.hasSelection
                });
            }
            get hasSelection() {
                return 0 !== this.#ln.size;
            }
            get isEnterHandled() {
                return 1 === this.#ln.size && this.firstSelectedEditor.isEnterHandled;
            }
            undo() {
                this.#Ks.undo();
                this.#kn({
                    hasSomethingToUndo: this.#Ks.hasSomethingToUndo(),
                    hasSomethingToRedo: !0,
                    isEmpty: this.#In()
                });
            }
            redo() {
                this.#Ks.redo();
                this.#kn({
                    hasSomethingToUndo: !0,
                    hasSomethingToRedo: this.#Ks.hasSomethingToRedo(),
                    isEmpty: this.#In()
                });
            }
            addCommands(t) {
                this.#Ks.add(t);
                this.#kn({
                    hasSomethingToUndo: !0,
                    hasSomethingToRedo: !1,
                    isEmpty: this.#In()
                });
            }
            #In() {
                if (0 === this.#Ws.size) return !0;
                if (1 === this.#Ws.size) for (const t of this.#Ws.values())return t.isEmpty();
                return !1;
            }
            delete() {
                this.commitOrRemove();
                if (!this.hasSelection) return;
                const t = [
                    ...this.#ln
                ];
                this.addCommands({
                    cmd: ()=>{
                        for (const e of t)e.remove();
                    },
                    undo: ()=>{
                        for (const e of t)this.#Fn(e);
                    },
                    mustExec: !0
                });
            }
            commitOrRemove() {
                this.#Vs?.commitOrRemove();
            }
            hasSomethingToControl() {
                return this.#Vs || this.hasSelection;
            }
            #Rn(t) {
                this.#ln.clear();
                for (const e of t)if (!e.isEmpty()) {
                    this.#ln.add(e);
                    e.select();
                }
                this.#kn({
                    hasSelectedEditor: !0
                });
            }
            selectAll() {
                for (const t of this.#ln)t.commit();
                this.#Rn(this.#Ws.values());
            }
            unselectAll() {
                if (this.#Vs) {
                    this.#Vs.commitOrRemove();
                    if (this.#on !== s.AnnotationEditorType.NONE) return;
                }
                if (this.hasSelection) {
                    for (const t of this.#ln)t.unselect();
                    this.#ln.clear();
                    this.#kn({
                        hasSelectedEditor: !1
                    });
                }
            }
            translateSelectedEditors(t, e, i = !1) {
                i || this.commitOrRemove();
                if (!this.hasSelection) return;
                this.#En[0] += t;
                this.#En[1] += e;
                const [s, n] = this.#En, a = [
                    ...this.#ln
                ];
                this.#_n && clearTimeout(this.#_n);
                this.#_n = setTimeout(()=>{
                    this.#_n = null;
                    this.#En[0] = this.#En[1] = 0;
                    this.addCommands({
                        cmd: ()=>{
                            for (const t of a)this.#Ws.has(t.id) && t.translateInPage(s, n);
                        },
                        undo: ()=>{
                            for (const t of a)this.#Ws.has(t.id) && t.translateInPage(-s, -n);
                        },
                        mustExec: !1
                    });
                }, 1e3);
                for (const i of a)i.translateInPage(t, e);
            }
            setUpDragSession() {
                if (this.hasSelection) {
                    this.disableUserSelect(!0);
                    this.#Js = new Map;
                    for (const t of this.#ln)this.#Js.set(t, {
                        savedX: t.x,
                        savedY: t.y,
                        savedPageIndex: t.pageIndex,
                        newX: 0,
                        newY: 0,
                        newPageIndex: -1
                    });
                }
            }
            endDragSession() {
                if (!this.#Js) return !1;
                this.disableUserSelect(!1);
                const t = this.#Js;
                this.#Js = null;
                let e = !1;
                for (const [{ x: i, y: s, pageIndex: n }, a] of t){
                    a.newX = i;
                    a.newY = s;
                    a.newPageIndex = n;
                    e ||= i !== a.savedX || s !== a.savedY || n !== a.savedPageIndex;
                }
                if (!e) return !1;
                const move = (t, e, i, s)=>{
                    if (this.#Ws.has(t.id)) {
                        const n = this.#qs.get(s);
                        if (n) t._setParentAndPosition(n, e, i);
                        else {
                            t.pageIndex = s;
                            t.x = e;
                            t.y = i;
                        }
                    }
                };
                this.addCommands({
                    cmd: ()=>{
                        for (const [e, { newX: i, newY: s, newPageIndex: n }] of t)move(e, i, s, n);
                    },
                    undo: ()=>{
                        for (const [e, { savedX: i, savedY: s, savedPageIndex: n }] of t)move(e, i, s, n);
                    },
                    mustExec: !0
                });
                return !0;
            }
            dragSelectedEditors(t, e) {
                if (this.#Js) for (const i of this.#Js.keys())i.drag(t, e);
            }
            rebuild(t) {
                if (null === t.parent) {
                    const e = this.getLayer(t.pageIndex);
                    if (e) {
                        e.changeParent(t);
                        e.addOrRebuild(t);
                    } else {
                        this.addEditor(t);
                        this.addToAnnotationStorage(t);
                        t.rebuild();
                    }
                } else t.parent.addOrRebuild(t);
            }
            get isEditorHandlingKeyboard() {
                return this.getActive()?.shouldGetKeyboardEvents() || 1 === this.#ln.size && this.firstSelectedEditor.shouldGetKeyboardEvents();
            }
            isActive(t) {
                return this.#Vs === t;
            }
            getActive() {
                return this.#Vs;
            }
            getMode() {
                return this.#on;
            }
            get imageManager() {
                return (0, s.shadow)(this, "imageManager", new ImageManager);
            }
        }
    },
    171: (t, e, i)=>{
        i.d(e, {
            PDFFetchStream: ()=>PDFFetchStream
        });
        var s = i(266), n = i(253);
        function createFetchOptions(t, e, i) {
            return {
                method: "GET",
                headers: t,
                signal: i.signal,
                mode: "cors",
                credentials: e ? "include" : "same-origin",
                redirect: "follow"
            };
        }
        function createHeaders(t) {
            const e = new Headers;
            for(const i in t){
                const s = t[i];
                void 0 !== s && e.append(i, s);
            }
            return e;
        }
        function getArrayBuffer(t) {
            if (t instanceof Uint8Array) return t.buffer;
            if (t instanceof ArrayBuffer) return t;
            (0, s.warn)(`getArrayBuffer - unexpected data format: ${t}`);
            return new Uint8Array(t).buffer;
        }
        class PDFFetchStream {
            constructor(t){
                this.source = t;
                this.isHttp = /^https?:/i.test(t.url);
                this.httpHeaders = this.isHttp && t.httpHeaders || {};
                this._fullRequestReader = null;
                this._rangeRequestReaders = [];
            }
            get _progressiveDataLength() {
                return this._fullRequestReader?._loaded ?? 0;
            }
            getFullReader() {
                (0, s.assert)(!this._fullRequestReader, "PDFFetchStream.getFullReader can only be called once.");
                this._fullRequestReader = new PDFFetchStreamReader(this);
                return this._fullRequestReader;
            }
            getRangeReader(t, e) {
                if (e <= this._progressiveDataLength) return null;
                const i = new PDFFetchStreamRangeReader(this, t, e);
                this._rangeRequestReaders.push(i);
                return i;
            }
            cancelAllRequests(t) {
                this._fullRequestReader?.cancel(t);
                for (const e of this._rangeRequestReaders.slice(0))e.cancel(t);
            }
        }
        class PDFFetchStreamReader {
            constructor(t){
                this._stream = t;
                this._reader = null;
                this._loaded = 0;
                this._filename = null;
                const e = t.source;
                this._withCredentials = e.withCredentials || !1;
                this._contentLength = e.length;
                this._headersCapability = new s.PromiseCapability;
                this._disableRange = e.disableRange || !1;
                this._rangeChunkSize = e.rangeChunkSize;
                this._rangeChunkSize || this._disableRange || (this._disableRange = !0);
                this._abortController = new AbortController;
                this._isStreamingSupported = !e.disableStream;
                this._isRangeSupported = !e.disableRange;
                this._headers = createHeaders(this._stream.httpHeaders);
                const i = e.url;
                fetch(i, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then((t)=>{
                    if (!(0, n.validateResponseStatus)(t.status)) throw (0, n.createResponseStatusError)(t.status, i);
                    this._reader = t.body.getReader();
                    this._headersCapability.resolve();
                    const getResponseHeader = (e)=>t.headers.get(e), { allowRangeRequests: e, suggestedLength: a } = (0, n.validateRangeRequestCapabilities)({
                        getResponseHeader: getResponseHeader,
                        isHttp: this._stream.isHttp,
                        rangeChunkSize: this._rangeChunkSize,
                        disableRange: this._disableRange
                    });
                    this._isRangeSupported = e;
                    this._contentLength = a || this._contentLength;
                    this._filename = (0, n.extractFilenameFromHeader)(getResponseHeader);
                    !this._isStreamingSupported && this._isRangeSupported && this.cancel(new s.AbortException("Streaming is disabled."));
                }).catch(this._headersCapability.reject);
                this.onProgress = null;
            }
            get headersReady() {
                return this._headersCapability.promise;
            }
            get filename() {
                return this._filename;
            }
            get contentLength() {
                return this._contentLength;
            }
            get isRangeSupported() {
                return this._isRangeSupported;
            }
            get isStreamingSupported() {
                return this._isStreamingSupported;
            }
            async read() {
                await this._headersCapability.promise;
                const { value: t, done: e } = await this._reader.read();
                if (e) return {
                    value: t,
                    done: e
                };
                this._loaded += t.byteLength;
                this.onProgress?.({
                    loaded: this._loaded,
                    total: this._contentLength
                });
                return {
                    value: getArrayBuffer(t),
                    done: !1
                };
            }
            cancel(t) {
                this._reader?.cancel(t);
                this._abortController.abort();
            }
        }
        class PDFFetchStreamRangeReader {
            constructor(t, e, i){
                this._stream = t;
                this._reader = null;
                this._loaded = 0;
                const a = t.source;
                this._withCredentials = a.withCredentials || !1;
                this._readCapability = new s.PromiseCapability;
                this._isStreamingSupported = !a.disableStream;
                this._abortController = new AbortController;
                this._headers = createHeaders(this._stream.httpHeaders);
                this._headers.append("Range", `bytes=${e}-${i - 1}`);
                const r = a.url;
                fetch(r, createFetchOptions(this._headers, this._withCredentials, this._abortController)).then((t)=>{
                    if (!(0, n.validateResponseStatus)(t.status)) throw (0, n.createResponseStatusError)(t.status, r);
                    this._readCapability.resolve();
                    this._reader = t.body.getReader();
                }).catch(this._readCapability.reject);
                this.onProgress = null;
            }
            get isStreamingSupported() {
                return this._isStreamingSupported;
            }
            async read() {
                await this._readCapability.promise;
                const { value: t, done: e } = await this._reader.read();
                if (e) return {
                    value: t,
                    done: e
                };
                this._loaded += t.byteLength;
                this.onProgress?.({
                    loaded: this._loaded
                });
                return {
                    value: getArrayBuffer(t),
                    done: !1
                };
            }
            cancel(t) {
                this._reader?.cancel(t);
                this._abortController.abort();
            }
        }
    },
    742: (t, e, i)=>{
        i.d(e, {
            FontFaceObject: ()=>FontFaceObject,
            FontLoader: ()=>FontLoader
        });
        var s = i(266);
        class FontLoader {
            #Bn;
            constructor({ ownerDocument: t = globalThis.document, styleElement: e = null }){
                this.#Bn = new Set;
                this._document = t;
                this.nativeFontFaces = new Set;
                this.styleElement = null;
                this.loadingRequests = [];
                this.loadTestFontId = 0;
            }
            addNativeFontFace(t) {
                this.nativeFontFaces.add(t);
                this._document.fonts.add(t);
            }
            removeNativeFontFace(t) {
                this.nativeFontFaces.delete(t);
                this._document.fonts.delete(t);
            }
            insertRule(t) {
                if (!this.styleElement) {
                    this.styleElement = this._document.createElement("style");
                    this._document.documentElement.getElementsByTagName("head")[0].append(this.styleElement);
                }
                const e = this.styleElement.sheet;
                e.insertRule(t, e.cssRules.length);
            }
            clear() {
                for (const t of this.nativeFontFaces)this._document.fonts.delete(t);
                this.nativeFontFaces.clear();
                this.#Bn.clear();
                if (this.styleElement) {
                    this.styleElement.remove();
                    this.styleElement = null;
                }
            }
            async loadSystemFont({ systemFontInfo: t, _inspectFont: e }) {
                if (t && !this.#Bn.has(t.loadedName)) {
                    (0, s.assert)(!this.disableFontFace, "loadSystemFont shouldn't be called when `disableFontFace` is set.");
                    if (this.isFontLoadingAPISupported) {
                        const { loadedName: i, src: n, style: a } = t, r = new FontFace(i, n, a);
                        this.addNativeFontFace(r);
                        try {
                            await r.load();
                            this.#Bn.add(i);
                            e?.(t);
                        } catch  {
                            (0, s.warn)(`Cannot load system font: ${t.baseFontName}, installing it could help to improve PDF rendering.`);
                            this.removeNativeFontFace(r);
                        }
                    } else (0, s.unreachable)("Not implemented: loadSystemFont without the Font Loading API.");
                }
            }
            async bind(t) {
                if (t.attached || t.missingFile && !t.systemFontInfo) return;
                t.attached = !0;
                if (t.systemFontInfo) {
                    await this.loadSystemFont(t);
                    return;
                }
                if (this.isFontLoadingAPISupported) {
                    const e = t.createNativeFontFace();
                    if (e) {
                        this.addNativeFontFace(e);
                        try {
                            await e.loaded;
                        } catch (i) {
                            (0, s.warn)(`Failed to load font '${e.family}': '${i}'.`);
                            t.disableFontFace = !0;
                            throw i;
                        }
                    }
                    return;
                }
                const e = t.createFontFaceRule();
                if (e) {
                    this.insertRule(e);
                    if (this.isSyncFontLoadingSupported) return;
                    await new Promise((e)=>{
                        const i = this._queueLoadingCallback(e);
                        this._prepareFontLoadEvent(t, i);
                    });
                }
            }
            get isFontLoadingAPISupported() {
                const t = !!this._document?.fonts;
                return (0, s.shadow)(this, "isFontLoadingAPISupported", t);
            }
            get isSyncFontLoadingSupported() {
                let t = !1;
                (s.isNodeJS || "undefined" != typeof navigator && "string" == typeof navigator?.userAgent && /Mozilla\/5.0.*?rv:\d+.*? Gecko/.test(navigator.userAgent)) && (t = !0);
                return (0, s.shadow)(this, "isSyncFontLoadingSupported", t);
            }
            _queueLoadingCallback(t) {
                const { loadingRequests: e } = this, i = {
                    done: !1,
                    complete: function completeRequest() {
                        (0, s.assert)(!i.done, "completeRequest() cannot be called twice.");
                        i.done = !0;
                        for(; e.length > 0 && e[0].done;){
                            const t = e.shift();
                            setTimeout(t.callback, 0);
                        }
                    },
                    callback: t
                };
                e.push(i);
                return i;
            }
            get _loadTestFont() {
                const t = atob("T1RUTwALAIAAAwAwQ0ZGIDHtZg4AAAOYAAAAgUZGVE1lkzZwAAAEHAAAABxHREVGABQAFQAABDgAAAAeT1MvMlYNYwkAAAEgAAAAYGNtYXABDQLUAAACNAAAAUJoZWFk/xVFDQAAALwAAAA2aGhlYQdkA+oAAAD0AAAAJGhtdHgD6AAAAAAEWAAAAAZtYXhwAAJQAAAAARgAAAAGbmFtZVjmdH4AAAGAAAAAsXBvc3T/hgAzAAADeAAAACAAAQAAAAEAALZRFsRfDzz1AAsD6AAAAADOBOTLAAAAAM4KHDwAAAAAA+gDIQAAAAgAAgAAAAAAAAABAAADIQAAAFoD6AAAAAAD6AABAAAAAAAAAAAAAAAAAAAAAQAAUAAAAgAAAAQD6AH0AAUAAAKKArwAAACMAooCvAAAAeAAMQECAAACAAYJAAAAAAAAAAAAAQAAAAAAAAAAAAAAAFBmRWQAwAAuAC4DIP84AFoDIQAAAAAAAQAAAAAAAAAAACAAIAABAAAADgCuAAEAAAAAAAAAAQAAAAEAAAAAAAEAAQAAAAEAAAAAAAIAAQAAAAEAAAAAAAMAAQAAAAEAAAAAAAQAAQAAAAEAAAAAAAUAAQAAAAEAAAAAAAYAAQAAAAMAAQQJAAAAAgABAAMAAQQJAAEAAgABAAMAAQQJAAIAAgABAAMAAQQJAAMAAgABAAMAAQQJAAQAAgABAAMAAQQJAAUAAgABAAMAAQQJAAYAAgABWABYAAAAAAAAAwAAAAMAAAAcAAEAAAAAADwAAwABAAAAHAAEACAAAAAEAAQAAQAAAC7//wAAAC7////TAAEAAAAAAAABBgAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAD/gwAyAAAAAQAAAAAAAAAAAAAAAAAAAAABAAQEAAEBAQJYAAEBASH4DwD4GwHEAvgcA/gXBIwMAYuL+nz5tQXkD5j3CBLnEQACAQEBIVhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYAAABAQAADwACAQEEE/t3Dov6fAH6fAT+fPp8+nwHDosMCvm1Cvm1DAz6fBQAAAAAAAABAAAAAMmJbzEAAAAAzgTjFQAAAADOBOQpAAEAAAAAAAAADAAUAAQAAAABAAAAAgABAAAAAAAAAAAD6AAAAAAAAA==");
                return (0, s.shadow)(this, "_loadTestFont", t);
            }
            _prepareFontLoadEvent(t, e) {
                function int32(t, e) {
                    return t.charCodeAt(e) << 24 | t.charCodeAt(e + 1) << 16 | t.charCodeAt(e + 2) << 8 | 255 & t.charCodeAt(e + 3);
                }
                function spliceString(t, e, i, s) {
                    return t.substring(0, e) + s + t.substring(e + i);
                }
                let i, n;
                const a = this._document.createElement("canvas");
                a.width = 1;
                a.height = 1;
                const r = a.getContext("2d");
                let o = 0;
                const l = `lt${Date.now()}${this.loadTestFontId++}`;
                let h = this._loadTestFont;
                h = spliceString(h, 976, l.length, l);
                const d = 1482184792;
                let c = int32(h, 16);
                for(i = 0, n = l.length - 3; i < n; i += 4)c = c - d + int32(l, i) | 0;
                i < l.length && (c = c - d + int32(l + "XXX", i) | 0);
                h = spliceString(h, 16, 4, (0, s.string32)(c));
                const u = `@font-face {font-family:"${l}";src:${`url(data:font/opentype;base64,${btoa(h)});`}}`;
                this.insertRule(u);
                const p = this._document.createElement("div");
                p.style.visibility = "hidden";
                p.style.width = p.style.height = "10px";
                p.style.position = "absolute";
                p.style.top = p.style.left = "0px";
                for (const e of [
                    t.loadedName,
                    l
                ]){
                    const t = this._document.createElement("span");
                    t.textContent = "Hi";
                    t.style.fontFamily = e;
                    p.append(t);
                }
                this._document.body.append(p);
                !function isFontReady(t, e) {
                    if (++o > 30) {
                        (0, s.warn)("Load test font never loaded.");
                        e();
                        return;
                    }
                    r.font = "30px " + t;
                    r.fillText(".", 0, 20);
                    r.getImageData(0, 0, 1, 1).data[3] > 0 ? e() : setTimeout(isFontReady.bind(null, t, e));
                }(l, ()=>{
                    p.remove();
                    e.complete();
                });
            }
        }
        class FontFaceObject {
            constructor(t, { isEvalSupported: e = !0, disableFontFace: i = !1, ignoreErrors: s = !1, inspectFont: n = null }){
                this.compiledGlyphs = Object.create(null);
                for(const e in t)this[e] = t[e];
                this.isEvalSupported = !1 !== e;
                this.disableFontFace = !0 === i;
                this.ignoreErrors = !0 === s;
                this._inspectFont = n;
            }
            createNativeFontFace() {
                if (!this.data || this.disableFontFace) return null;
                let t;
                if (this.cssFontInfo) {
                    const e = {
                        weight: this.cssFontInfo.fontWeight
                    };
                    this.cssFontInfo.italicAngle && (e.style = `oblique ${this.cssFontInfo.italicAngle}deg`);
                    t = new FontFace(this.cssFontInfo.fontFamily, this.data, e);
                } else t = new FontFace(this.loadedName, this.data, {});
                this._inspectFont?.(this);
                return t;
            }
            createFontFaceRule() {
                if (!this.data || this.disableFontFace) return null;
                const t = (0, s.bytesToString)(this.data), e = `url(data:${this.mimetype};base64,${btoa(t)});`;
                let i;
                if (this.cssFontInfo) {
                    let t = `font-weight: ${this.cssFontInfo.fontWeight};`;
                    this.cssFontInfo.italicAngle && (t += `font-style: oblique ${this.cssFontInfo.italicAngle}deg;`);
                    i = `@font-face {font-family:"${this.cssFontInfo.fontFamily}";${t}src:${e}}`;
                } else i = `@font-face {font-family:"${this.loadedName}";src:${e}}`;
                this._inspectFont?.(this, e);
                return i;
            }
            getPathGenerator(t, e) {
                if (void 0 !== this.compiledGlyphs[e]) return this.compiledGlyphs[e];
                let i;
                try {
                    i = t.get(this.loadedName + "_path_" + e);
                } catch (t) {
                    if (!this.ignoreErrors) throw t;
                    (0, s.warn)(`getPathGenerator - ignoring character: "${t}".`);
                    return this.compiledGlyphs[e] = function(t, e) {};
                }
                if (this.isEvalSupported && s.FeatureTest.isEvalSupported) {
                    const t = [];
                    for (const e of i){
                        const i = void 0 !== e.args ? e.args.join(",") : "";
                        t.push("c.", e.cmd, "(", i, ");\n");
                    }
                    return this.compiledGlyphs[e] = new Function("c", "size", t.join(""));
                }
                return this.compiledGlyphs[e] = function(t, e) {
                    for (const s of i){
                        "scale" === s.cmd && (s.args = [
                            e,
                            -e
                        ]);
                        t[s.cmd].apply(t, s.args);
                    }
                };
            }
        }
    },
    472: (t, e, i)=>{
        i.d(e, {
            Metadata: ()=>Metadata
        });
        var s = i(266);
        class Metadata {
            #Nn;
            #Un;
            constructor({ parsedData: t, rawData: e }){
                this.#Nn = t;
                this.#Un = e;
            }
            getRaw() {
                return this.#Un;
            }
            get(t) {
                return this.#Nn.get(t) ?? null;
            }
            getAll() {
                return (0, s.objectFromMap)(this.#Nn);
            }
            has(t) {
                return this.#Nn.has(t);
            }
        }
    },
    474: (t, e, i)=>{
        i.d(e, {
            PDFNetworkStream: ()=>PDFNetworkStream
        });
        var s = i(266), n = i(253);
        class NetworkManager {
            constructor(t, e = {}){
                this.url = t;
                this.isHttp = /^https?:/i.test(t);
                this.httpHeaders = this.isHttp && e.httpHeaders || Object.create(null);
                this.withCredentials = e.withCredentials || !1;
                this.currXhrId = 0;
                this.pendingRequests = Object.create(null);
            }
            requestRange(t, e, i) {
                const s = {
                    begin: t,
                    end: e
                };
                for(const t in i)s[t] = i[t];
                return this.request(s);
            }
            requestFull(t) {
                return this.request(t);
            }
            request(t) {
                const e = new XMLHttpRequest, i = this.currXhrId++, s = this.pendingRequests[i] = {
                    xhr: e
                };
                e.open("GET", this.url);
                e.withCredentials = this.withCredentials;
                for(const t in this.httpHeaders){
                    const i = this.httpHeaders[t];
                    void 0 !== i && e.setRequestHeader(t, i);
                }
                if (this.isHttp && "begin" in t && "end" in t) {
                    e.setRequestHeader("Range", `bytes=${t.begin}-${t.end - 1}`);
                    s.expectedStatus = 206;
                } else s.expectedStatus = 200;
                e.responseType = "arraybuffer";
                t.onError && (e.onerror = function(i) {
                    t.onError(e.status);
                });
                e.onreadystatechange = this.onStateChange.bind(this, i);
                e.onprogress = this.onProgress.bind(this, i);
                s.onHeadersReceived = t.onHeadersReceived;
                s.onDone = t.onDone;
                s.onError = t.onError;
                s.onProgress = t.onProgress;
                e.send(null);
                return i;
            }
            onProgress(t, e) {
                const i = this.pendingRequests[t];
                i && i.onProgress?.(e);
            }
            onStateChange(t, e) {
                const i = this.pendingRequests[t];
                if (!i) return;
                const n = i.xhr;
                if (n.readyState >= 2 && i.onHeadersReceived) {
                    i.onHeadersReceived();
                    delete i.onHeadersReceived;
                }
                if (4 !== n.readyState) return;
                if (!(t in this.pendingRequests)) return;
                delete this.pendingRequests[t];
                if (0 === n.status && this.isHttp) {
                    i.onError?.(n.status);
                    return;
                }
                const a = n.status || 200;
                if (!(200 === a && 206 === i.expectedStatus) && a !== i.expectedStatus) {
                    i.onError?.(n.status);
                    return;
                }
                const r = function getArrayBuffer(t) {
                    const e = t.response;
                    return "string" != typeof e ? e : (0, s.stringToBytes)(e).buffer;
                }(n);
                if (206 === a) {
                    const t = n.getResponseHeader("Content-Range"), e = /bytes (\d+)-(\d+)\/(\d+)/.exec(t);
                    i.onDone({
                        begin: parseInt(e[1], 10),
                        chunk: r
                    });
                } else r ? i.onDone({
                    begin: 0,
                    chunk: r
                }) : i.onError?.(n.status);
            }
            getRequestXhr(t) {
                return this.pendingRequests[t].xhr;
            }
            isPendingRequest(t) {
                return t in this.pendingRequests;
            }
            abortRequest(t) {
                const e = this.pendingRequests[t].xhr;
                delete this.pendingRequests[t];
                e.abort();
            }
        }
        class PDFNetworkStream {
            constructor(t){
                this._source = t;
                this._manager = new NetworkManager(t.url, {
                    httpHeaders: t.httpHeaders,
                    withCredentials: t.withCredentials
                });
                this._rangeChunkSize = t.rangeChunkSize;
                this._fullRequestReader = null;
                this._rangeRequestReaders = [];
            }
            _onRangeRequestReaderClosed(t) {
                const e = this._rangeRequestReaders.indexOf(t);
                e >= 0 && this._rangeRequestReaders.splice(e, 1);
            }
            getFullReader() {
                (0, s.assert)(!this._fullRequestReader, "PDFNetworkStream.getFullReader can only be called once.");
                this._fullRequestReader = new PDFNetworkStreamFullRequestReader(this._manager, this._source);
                return this._fullRequestReader;
            }
            getRangeReader(t, e) {
                const i = new PDFNetworkStreamRangeRequestReader(this._manager, t, e);
                i.onClosed = this._onRangeRequestReaderClosed.bind(this);
                this._rangeRequestReaders.push(i);
                return i;
            }
            cancelAllRequests(t) {
                this._fullRequestReader?.cancel(t);
                for (const e of this._rangeRequestReaders.slice(0))e.cancel(t);
            }
        }
        class PDFNetworkStreamFullRequestReader {
            constructor(t, e){
                this._manager = t;
                const i = {
                    onHeadersReceived: this._onHeadersReceived.bind(this),
                    onDone: this._onDone.bind(this),
                    onError: this._onError.bind(this),
                    onProgress: this._onProgress.bind(this)
                };
                this._url = e.url;
                this._fullRequestId = t.requestFull(i);
                this._headersReceivedCapability = new s.PromiseCapability;
                this._disableRange = e.disableRange || !1;
                this._contentLength = e.length;
                this._rangeChunkSize = e.rangeChunkSize;
                this._rangeChunkSize || this._disableRange || (this._disableRange = !0);
                this._isStreamingSupported = !1;
                this._isRangeSupported = !1;
                this._cachedChunks = [];
                this._requests = [];
                this._done = !1;
                this._storedError = void 0;
                this._filename = null;
                this.onProgress = null;
            }
            _onHeadersReceived() {
                const t = this._fullRequestId, e = this._manager.getRequestXhr(t), getResponseHeader = (t)=>e.getResponseHeader(t), { allowRangeRequests: i, suggestedLength: s } = (0, n.validateRangeRequestCapabilities)({
                    getResponseHeader: getResponseHeader,
                    isHttp: this._manager.isHttp,
                    rangeChunkSize: this._rangeChunkSize,
                    disableRange: this._disableRange
                });
                i && (this._isRangeSupported = !0);
                this._contentLength = s || this._contentLength;
                this._filename = (0, n.extractFilenameFromHeader)(getResponseHeader);
                this._isRangeSupported && this._manager.abortRequest(t);
                this._headersReceivedCapability.resolve();
            }
            _onDone(t) {
                if (t) if (this._requests.length > 0) {
                    this._requests.shift().resolve({
                        value: t.chunk,
                        done: !1
                    });
                } else this._cachedChunks.push(t.chunk);
                this._done = !0;
                if (!(this._cachedChunks.length > 0)) {
                    for (const t of this._requests)t.resolve({
                        value: void 0,
                        done: !0
                    });
                    this._requests.length = 0;
                }
            }
            _onError(t) {
                this._storedError = (0, n.createResponseStatusError)(t, this._url);
                this._headersReceivedCapability.reject(this._storedError);
                for (const t of this._requests)t.reject(this._storedError);
                this._requests.length = 0;
                this._cachedChunks.length = 0;
            }
            _onProgress(t) {
                this.onProgress?.({
                    loaded: t.loaded,
                    total: t.lengthComputable ? t.total : this._contentLength
                });
            }
            get filename() {
                return this._filename;
            }
            get isRangeSupported() {
                return this._isRangeSupported;
            }
            get isStreamingSupported() {
                return this._isStreamingSupported;
            }
            get contentLength() {
                return this._contentLength;
            }
            get headersReady() {
                return this._headersReceivedCapability.promise;
            }
            async read() {
                if (this._storedError) throw this._storedError;
                if (this._cachedChunks.length > 0) {
                    return {
                        value: this._cachedChunks.shift(),
                        done: !1
                    };
                }
                if (this._done) return {
                    value: void 0,
                    done: !0
                };
                const t = new s.PromiseCapability;
                this._requests.push(t);
                return t.promise;
            }
            cancel(t) {
                this._done = !0;
                this._headersReceivedCapability.reject(t);
                for (const t of this._requests)t.resolve({
                    value: void 0,
                    done: !0
                });
                this._requests.length = 0;
                this._manager.isPendingRequest(this._fullRequestId) && this._manager.abortRequest(this._fullRequestId);
                this._fullRequestReader = null;
            }
        }
        class PDFNetworkStreamRangeRequestReader {
            constructor(t, e, i){
                this._manager = t;
                const s = {
                    onDone: this._onDone.bind(this),
                    onError: this._onError.bind(this),
                    onProgress: this._onProgress.bind(this)
                };
                this._url = t.url;
                this._requestId = t.requestRange(e, i, s);
                this._requests = [];
                this._queuedChunk = null;
                this._done = !1;
                this._storedError = void 0;
                this.onProgress = null;
                this.onClosed = null;
            }
            _close() {
                this.onClosed?.(this);
            }
            _onDone(t) {
                const e = t.chunk;
                if (this._requests.length > 0) {
                    this._requests.shift().resolve({
                        value: e,
                        done: !1
                    });
                } else this._queuedChunk = e;
                this._done = !0;
                for (const t of this._requests)t.resolve({
                    value: void 0,
                    done: !0
                });
                this._requests.length = 0;
                this._close();
            }
            _onError(t) {
                this._storedError = (0, n.createResponseStatusError)(t, this._url);
                for (const t of this._requests)t.reject(this._storedError);
                this._requests.length = 0;
                this._queuedChunk = null;
            }
            _onProgress(t) {
                this.isStreamingSupported || this.onProgress?.({
                    loaded: t.loaded
                });
            }
            get isStreamingSupported() {
                return !1;
            }
            async read() {
                if (this._storedError) throw this._storedError;
                if (null !== this._queuedChunk) {
                    const t = this._queuedChunk;
                    this._queuedChunk = null;
                    return {
                        value: t,
                        done: !1
                    };
                }
                if (this._done) return {
                    value: void 0,
                    done: !0
                };
                const t = new s.PromiseCapability;
                this._requests.push(t);
                return t.promise;
            }
            cancel(t) {
                this._done = !0;
                for (const t of this._requests)t.resolve({
                    value: void 0,
                    done: !0
                });
                this._requests.length = 0;
                this._manager.isPendingRequest(this._requestId) && this._manager.abortRequest(this._requestId);
                this._close();
            }
        }
    },
    253: (t, e, i)=>{
        i.d(e, {
            createResponseStatusError: ()=>createResponseStatusError,
            extractFilenameFromHeader: ()=>extractFilenameFromHeader,
            validateRangeRequestCapabilities: ()=>validateRangeRequestCapabilities,
            validateResponseStatus: ()=>validateResponseStatus
        });
        var s = i(266);
        var n = i(473);
        function validateRangeRequestCapabilities({ getResponseHeader: t, isHttp: e, rangeChunkSize: i, disableRange: s }) {
            const n = {
                allowRangeRequests: !1,
                suggestedLength: void 0
            }, a = parseInt(t("Content-Length"), 10);
            if (!Number.isInteger(a)) return n;
            n.suggestedLength = a;
            if (a <= 2 * i) return n;
            if (s || !e) return n;
            if ("bytes" !== t("Accept-Ranges")) return n;
            if ("identity" !== (t("Content-Encoding") || "identity")) return n;
            n.allowRangeRequests = !0;
            return n;
        }
        function extractFilenameFromHeader(t) {
            const e = t("Content-Disposition");
            if (e) {
                let t = function getFilenameFromContentDispositionHeader(t) {
                    let e = !0, i = toParamRegExp("filename\\*", "i").exec(t);
                    if (i) {
                        i = i[1];
                        let t = rfc2616unquote(i);
                        t = unescape(t);
                        t = rfc5987decode(t);
                        t = rfc2047decode(t);
                        return fixupEncoding(t);
                    }
                    i = function rfc2231getparam(t) {
                        const e = [];
                        let i;
                        const s = toParamRegExp("filename\\*((?!0\\d)\\d+)(\\*?)", "ig");
                        for(; null !== (i = s.exec(t));){
                            let [, t, s, n] = i;
                            t = parseInt(t, 10);
                            if (t in e) {
                                if (0 === t) break;
                            } else e[t] = [
                                s,
                                n
                            ];
                        }
                        const n = [];
                        for(let t = 0; t < e.length && (t in e); ++t){
                            let [i, s] = e[t];
                            s = rfc2616unquote(s);
                            if (i) {
                                s = unescape(s);
                                0 === t && (s = rfc5987decode(s));
                            }
                            n.push(s);
                        }
                        return n.join("");
                    }(t);
                    if (i) return fixupEncoding(rfc2047decode(i));
                    i = toParamRegExp("filename", "i").exec(t);
                    if (i) {
                        i = i[1];
                        let t = rfc2616unquote(i);
                        t = rfc2047decode(t);
                        return fixupEncoding(t);
                    }
                    function toParamRegExp(t, e) {
                        return new RegExp("(?:^|;)\\s*" + t + '\\s*=\\s*([^";\\s][^;\\s]*|"(?:[^"\\\\]|\\\\"?)+"?)', e);
                    }
                    function textdecode(t, i) {
                        if (t) {
                            if (!/^[\x00-\xFF]+$/.test(i)) return i;
                            try {
                                const n = new TextDecoder(t, {
                                    fatal: !0
                                }), a = (0, s.stringToBytes)(i);
                                i = n.decode(a);
                                e = !1;
                            } catch  {}
                        }
                        return i;
                    }
                    function fixupEncoding(t) {
                        if (e && /[\x80-\xff]/.test(t)) {
                            t = textdecode("utf-8", t);
                            e && (t = textdecode("iso-8859-1", t));
                        }
                        return t;
                    }
                    function rfc2616unquote(t) {
                        if (t.startsWith('"')) {
                            const e = t.slice(1).split('\\"');
                            for(let t = 0; t < e.length; ++t){
                                const i = e[t].indexOf('"');
                                if (-1 !== i) {
                                    e[t] = e[t].slice(0, i);
                                    e.length = t + 1;
                                }
                                e[t] = e[t].replaceAll(/\\(.)/g, "$1");
                            }
                            t = e.join('"');
                        }
                        return t;
                    }
                    function rfc5987decode(t) {
                        const e = t.indexOf("'");
                        return -1 === e ? t : textdecode(t.slice(0, e), t.slice(e + 1).replace(/^[^']*'/, ""));
                    }
                    function rfc2047decode(t) {
                        return !t.startsWith("=?") || /[\x00-\x19\x80-\xff]/.test(t) ? t : t.replaceAll(/=\?([\w-]*)\?([QqBb])\?((?:[^?]|\?(?!=))*)\?=/g, function(t, e, i, s) {
                            if ("q" === i || "Q" === i) return textdecode(e, s = (s = s.replaceAll("_", " ")).replaceAll(/=([0-9a-fA-F]{2})/g, function(t, e) {
                                return String.fromCharCode(parseInt(e, 16));
                            }));
                            try {
                                s = atob(s);
                            } catch  {}
                            return textdecode(e, s);
                        });
                    }
                    return "";
                }(e);
                if (t.includes("%")) try {
                    t = decodeURIComponent(t);
                } catch  {}
                if ((0, n.isPdfFile)(t)) return t;
            }
            return null;
        }
        function createResponseStatusError(t, e) {
            return 404 === t || 0 === t && e.startsWith("file:") ? new s.MissingPDFException('Missing PDF "' + e + '".') : new s.UnexpectedResponseException(`Unexpected server response (${t}) while retrieving PDF "${e}".`, t);
        }
        function validateResponseStatus(t) {
            return 200 === t || 206 === t;
        }
    },
    498: (t, e, i)=>{
        i.a(t, async (t, s)=>{
            try {
                i.d(e, {
                    PDFNodeStream: ()=>PDFNodeStream
                });
                var n = i(266), a = i(253);
                let r, o, l, h;
                if (n.isNodeJS) {
                    r = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 7147, 19));
                    o = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 3685, 19));
                    l = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 5687, 19));
                    h = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 7310, 19));
                }
                const d = /^file:\/\/\/[a-zA-Z]:\//;
                function parseUrl(t) {
                    const e = h.parse(t);
                    if ("file:" === e.protocol || e.host) return e;
                    if (/^[a-z]:[/\\]/i.test(t)) return h.parse(`file:///${t}`);
                    e.host || (e.protocol = "file:");
                    return e;
                }
                class PDFNodeStream {
                    constructor(t){
                        this.source = t;
                        this.url = parseUrl(t.url);
                        this.isHttp = "http:" === this.url.protocol || "https:" === this.url.protocol;
                        this.isFsUrl = "file:" === this.url.protocol;
                        this.httpHeaders = this.isHttp && t.httpHeaders || {};
                        this._fullRequestReader = null;
                        this._rangeRequestReaders = [];
                    }
                    get _progressiveDataLength() {
                        return this._fullRequestReader?._loaded ?? 0;
                    }
                    getFullReader() {
                        (0, n.assert)(!this._fullRequestReader, "PDFNodeStream.getFullReader can only be called once.");
                        this._fullRequestReader = this.isFsUrl ? new PDFNodeStreamFsFullReader(this) : new PDFNodeStreamFullReader(this);
                        return this._fullRequestReader;
                    }
                    getRangeReader(t, e) {
                        if (e <= this._progressiveDataLength) return null;
                        const i = this.isFsUrl ? new PDFNodeStreamFsRangeReader(this, t, e) : new PDFNodeStreamRangeReader(this, t, e);
                        this._rangeRequestReaders.push(i);
                        return i;
                    }
                    cancelAllRequests(t) {
                        this._fullRequestReader?.cancel(t);
                        for (const e of this._rangeRequestReaders.slice(0))e.cancel(t);
                    }
                }
                class BaseFullReader {
                    constructor(t){
                        this._url = t.url;
                        this._done = !1;
                        this._storedError = null;
                        this.onProgress = null;
                        const e = t.source;
                        this._contentLength = e.length;
                        this._loaded = 0;
                        this._filename = null;
                        this._disableRange = e.disableRange || !1;
                        this._rangeChunkSize = e.rangeChunkSize;
                        this._rangeChunkSize || this._disableRange || (this._disableRange = !0);
                        this._isStreamingSupported = !e.disableStream;
                        this._isRangeSupported = !e.disableRange;
                        this._readableStream = null;
                        this._readCapability = new n.PromiseCapability;
                        this._headersCapability = new n.PromiseCapability;
                    }
                    get headersReady() {
                        return this._headersCapability.promise;
                    }
                    get filename() {
                        return this._filename;
                    }
                    get contentLength() {
                        return this._contentLength;
                    }
                    get isRangeSupported() {
                        return this._isRangeSupported;
                    }
                    get isStreamingSupported() {
                        return this._isStreamingSupported;
                    }
                    async read() {
                        await this._readCapability.promise;
                        if (this._done) return {
                            value: void 0,
                            done: !0
                        };
                        if (this._storedError) throw this._storedError;
                        const t = this._readableStream.read();
                        if (null === t) {
                            this._readCapability = new n.PromiseCapability;
                            return this.read();
                        }
                        this._loaded += t.length;
                        this.onProgress?.({
                            loaded: this._loaded,
                            total: this._contentLength
                        });
                        return {
                            value: new Uint8Array(t).buffer,
                            done: !1
                        };
                    }
                    cancel(t) {
                        this._readableStream ? this._readableStream.destroy(t) : this._error(t);
                    }
                    _error(t) {
                        this._storedError = t;
                        this._readCapability.resolve();
                    }
                    _setReadableStream(t) {
                        this._readableStream = t;
                        t.on("readable", ()=>{
                            this._readCapability.resolve();
                        });
                        t.on("end", ()=>{
                            t.destroy();
                            this._done = !0;
                            this._readCapability.resolve();
                        });
                        t.on("error", (t)=>{
                            this._error(t);
                        });
                        !this._isStreamingSupported && this._isRangeSupported && this._error(new n.AbortException("streaming is disabled"));
                        this._storedError && this._readableStream.destroy(this._storedError);
                    }
                }
                class BaseRangeReader {
                    constructor(t){
                        this._url = t.url;
                        this._done = !1;
                        this._storedError = null;
                        this.onProgress = null;
                        this._loaded = 0;
                        this._readableStream = null;
                        this._readCapability = new n.PromiseCapability;
                        const e = t.source;
                        this._isStreamingSupported = !e.disableStream;
                    }
                    get isStreamingSupported() {
                        return this._isStreamingSupported;
                    }
                    async read() {
                        await this._readCapability.promise;
                        if (this._done) return {
                            value: void 0,
                            done: !0
                        };
                        if (this._storedError) throw this._storedError;
                        const t = this._readableStream.read();
                        if (null === t) {
                            this._readCapability = new n.PromiseCapability;
                            return this.read();
                        }
                        this._loaded += t.length;
                        this.onProgress?.({
                            loaded: this._loaded
                        });
                        return {
                            value: new Uint8Array(t).buffer,
                            done: !1
                        };
                    }
                    cancel(t) {
                        this._readableStream ? this._readableStream.destroy(t) : this._error(t);
                    }
                    _error(t) {
                        this._storedError = t;
                        this._readCapability.resolve();
                    }
                    _setReadableStream(t) {
                        this._readableStream = t;
                        t.on("readable", ()=>{
                            this._readCapability.resolve();
                        });
                        t.on("end", ()=>{
                            t.destroy();
                            this._done = !0;
                            this._readCapability.resolve();
                        });
                        t.on("error", (t)=>{
                            this._error(t);
                        });
                        this._storedError && this._readableStream.destroy(this._storedError);
                    }
                }
                function createRequestOptions(t, e) {
                    return {
                        protocol: t.protocol,
                        auth: t.auth,
                        host: t.hostname,
                        port: t.port,
                        path: t.path,
                        method: "GET",
                        headers: e
                    };
                }
                class PDFNodeStreamFullReader extends BaseFullReader {
                    constructor(t){
                        super(t);
                        const handleResponse = (e)=>{
                            if (404 === e.statusCode) {
                                const t = new n.MissingPDFException(`Missing PDF "${this._url}".`);
                                this._storedError = t;
                                this._headersCapability.reject(t);
                                return;
                            }
                            this._headersCapability.resolve();
                            this._setReadableStream(e);
                            const getResponseHeader = (t)=>this._readableStream.headers[t.toLowerCase()], { allowRangeRequests: i, suggestedLength: s } = (0, a.validateRangeRequestCapabilities)({
                                getResponseHeader: getResponseHeader,
                                isHttp: t.isHttp,
                                rangeChunkSize: this._rangeChunkSize,
                                disableRange: this._disableRange
                            });
                            this._isRangeSupported = i;
                            this._contentLength = s || this._contentLength;
                            this._filename = (0, a.extractFilenameFromHeader)(getResponseHeader);
                        };
                        this._request = null;
                        "http:" === this._url.protocol ? this._request = o.request(createRequestOptions(this._url, t.httpHeaders), handleResponse) : this._request = l.request(createRequestOptions(this._url, t.httpHeaders), handleResponse);
                        this._request.on("error", (t)=>{
                            this._storedError = t;
                            this._headersCapability.reject(t);
                        });
                        this._request.end();
                    }
                }
                class PDFNodeStreamRangeReader extends BaseRangeReader {
                    constructor(t, e, i){
                        super(t);
                        this._httpHeaders = {};
                        for(const e in t.httpHeaders){
                            const i = t.httpHeaders[e];
                            void 0 !== i && (this._httpHeaders[e] = i);
                        }
                        this._httpHeaders.Range = `bytes=${e}-${i - 1}`;
                        const handleResponse = (t)=>{
                            if (404 !== t.statusCode) this._setReadableStream(t);
                            else {
                                const t = new n.MissingPDFException(`Missing PDF "${this._url}".`);
                                this._storedError = t;
                            }
                        };
                        this._request = null;
                        "http:" === this._url.protocol ? this._request = o.request(createRequestOptions(this._url, this._httpHeaders), handleResponse) : this._request = l.request(createRequestOptions(this._url, this._httpHeaders), handleResponse);
                        this._request.on("error", (t)=>{
                            this._storedError = t;
                        });
                        this._request.end();
                    }
                }
                class PDFNodeStreamFsFullReader extends BaseFullReader {
                    constructor(t){
                        super(t);
                        let e = decodeURIComponent(this._url.path);
                        d.test(this._url.href) && (e = e.replace(/^\//, ""));
                        r.lstat(e, (t, i)=>{
                            if (t) {
                                "ENOENT" === t.code && (t = new n.MissingPDFException(`Missing PDF "${e}".`));
                                this._storedError = t;
                                this._headersCapability.reject(t);
                            } else {
                                this._contentLength = i.size;
                                this._setReadableStream(r.createReadStream(e));
                                this._headersCapability.resolve();
                            }
                        });
                    }
                }
                class PDFNodeStreamFsRangeReader extends BaseRangeReader {
                    constructor(t, e, i){
                        super(t);
                        let s = decodeURIComponent(this._url.path);
                        d.test(this._url.href) && (s = s.replace(/^\//, ""));
                        this._setReadableStream(r.createReadStream(s, {
                            start: e,
                            end: i - 1
                        }));
                    }
                }
                s();
            } catch (c) {
                s(c);
            }
        }, 1);
    },
    738: (t, e, i)=>{
        i.a(t, async (t, s)=>{
            try {
                i.d(e, {
                    NodeCMapReaderFactory: ()=>NodeCMapReaderFactory,
                    NodeCanvasFactory: ()=>NodeCanvasFactory,
                    NodeFilterFactory: ()=>NodeFilterFactory,
                    NodeStandardFontDataFactory: ()=>NodeStandardFontDataFactory
                });
                var n = i(822);
                let t, a, r;
                if (i(266).isNodeJS) {
                    t = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 7147, 19));
                    try {
                        a = await Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 6718, 19));
                    } catch  {}
                    try {
                        r = await __webpack_require__.e(/* import() */ 986).then(__webpack_require__.bind(__webpack_require__, 6986));
                    } catch  {}
                }
                const fetchData = function(e) {
                    return new Promise((i, s)=>{
                        t.readFile(e, (t, e)=>{
                            !t && e ? i(new Uint8Array(e)) : s(new Error(t));
                        });
                    });
                };
                class NodeFilterFactory extends n.BaseFilterFactory {
                }
                class NodeCanvasFactory extends n.BaseCanvasFactory {
                    _createCanvas(t, e) {
                        return a.createCanvas(t, e);
                    }
                }
                class NodeCMapReaderFactory extends n.BaseCMapReaderFactory {
                    _fetchData(t, e) {
                        return fetchData(t).then((t)=>({
                                cMapData: t,
                                compressionType: e
                            }));
                    }
                }
                class NodeStandardFontDataFactory extends n.BaseStandardFontDataFactory {
                    _fetchData(t) {
                        return fetchData(t);
                    }
                }
                s();
            } catch (t) {
                s(t);
            }
        }, 1);
    },
    890: (t, e, i)=>{
        i.d(e, {
            OptionalContentConfig: ()=>OptionalContentConfig
        });
        var s = i(266), n = i(825);
        const a = Symbol("INTERNAL");
        class OptionalContentGroup {
            #zn;
            constructor(t, e){
                this.#zn = !0;
                this.name = t;
                this.intent = e;
            }
            get visible() {
                return this.#zn;
            }
            _setVisible(t, e) {
                t !== a && (0, s.unreachable)("Internal method `_setVisible` called.");
                this.#zn = e;
            }
        }
        class OptionalContentConfig {
            #Hn;
            #jn;
            #Vn;
            #Wn;
            constructor(t){
                this.#Hn = null;
                this.#jn = new Map;
                this.#Vn = null;
                this.#Wn = null;
                this.name = null;
                this.creator = null;
                if (null !== t) {
                    this.name = t.name;
                    this.creator = t.creator;
                    this.#Wn = t.order;
                    for (const e of t.groups)this.#jn.set(e.id, new OptionalContentGroup(e.name, e.intent));
                    if ("OFF" === t.baseState) for (const t of this.#jn.values())t._setVisible(a, !1);
                    for (const e of t.on)this.#jn.get(e)._setVisible(a, !0);
                    for (const e of t.off)this.#jn.get(e)._setVisible(a, !1);
                    this.#Vn = this.getHash();
                }
            }
            #qn(t) {
                const e = t.length;
                if (e < 2) return !0;
                const i = t[0];
                for(let n = 1; n < e; n++){
                    const e = t[n];
                    let a;
                    if (Array.isArray(e)) a = this.#qn(e);
                    else {
                        if (!this.#jn.has(e)) {
                            (0, s.warn)(`Optional content group not found: ${e}`);
                            return !0;
                        }
                        a = this.#jn.get(e).visible;
                    }
                    switch(i){
                        case "And":
                            if (!a) return !1;
                            break;
                        case "Or":
                            if (a) return !0;
                            break;
                        case "Not":
                            return !a;
                        default:
                            return !0;
                    }
                }
                return "And" === i;
            }
            isVisible(t) {
                if (0 === this.#jn.size) return !0;
                if (!t) {
                    (0, s.warn)("Optional content group not defined.");
                    return !0;
                }
                if ("OCG" === t.type) {
                    if (!this.#jn.has(t.id)) {
                        (0, s.warn)(`Optional content group not found: ${t.id}`);
                        return !0;
                    }
                    return this.#jn.get(t.id).visible;
                }
                if ("OCMD" === t.type) {
                    if (t.expression) return this.#qn(t.expression);
                    if (!t.policy || "AnyOn" === t.policy) {
                        for (const e of t.ids){
                            if (!this.#jn.has(e)) {
                                (0, s.warn)(`Optional content group not found: ${e}`);
                                return !0;
                            }
                            if (this.#jn.get(e).visible) return !0;
                        }
                        return !1;
                    }
                    if ("AllOn" === t.policy) {
                        for (const e of t.ids){
                            if (!this.#jn.has(e)) {
                                (0, s.warn)(`Optional content group not found: ${e}`);
                                return !0;
                            }
                            if (!this.#jn.get(e).visible) return !1;
                        }
                        return !0;
                    }
                    if ("AnyOff" === t.policy) {
                        for (const e of t.ids){
                            if (!this.#jn.has(e)) {
                                (0, s.warn)(`Optional content group not found: ${e}`);
                                return !0;
                            }
                            if (!this.#jn.get(e).visible) return !0;
                        }
                        return !1;
                    }
                    if ("AllOff" === t.policy) {
                        for (const e of t.ids){
                            if (!this.#jn.has(e)) {
                                (0, s.warn)(`Optional content group not found: ${e}`);
                                return !0;
                            }
                            if (this.#jn.get(e).visible) return !1;
                        }
                        return !0;
                    }
                    (0, s.warn)(`Unknown optional content policy ${t.policy}.`);
                    return !0;
                }
                (0, s.warn)(`Unknown group type ${t.type}.`);
                return !0;
            }
            setVisibility(t, e = !0) {
                if (this.#jn.has(t)) {
                    this.#jn.get(t)._setVisible(a, !!e);
                    this.#Hn = null;
                } else (0, s.warn)(`Optional content group not found: ${t}`);
            }
            get hasInitialVisibility() {
                return null === this.#Vn || this.getHash() === this.#Vn;
            }
            getOrder() {
                return this.#jn.size ? this.#Wn ? this.#Wn.slice() : [
                    ...this.#jn.keys()
                ] : null;
            }
            getGroups() {
                return this.#jn.size > 0 ? (0, s.objectFromMap)(this.#jn) : null;
            }
            getGroup(t) {
                return this.#jn.get(t) || null;
            }
            getHash() {
                if (null !== this.#Hn) return this.#Hn;
                const t = new n.MurmurHash3_64;
                for (const [e, i] of this.#jn)t.update(`${e}:${i.visible}`);
                return this.#Hn = t.hexdigest();
            }
        }
    },
    739: (t, e, i)=>{
        i.d(e, {
            renderTextLayer: ()=>renderTextLayer,
            updateTextLayer: ()=>updateTextLayer
        });
        var s = i(266), n = i(473);
        const a = 30, r = .8, o = new Map;
        function getCtx(t, e) {
            let i;
            if (e && s.FeatureTest.isOffscreenCanvasSupported) i = new OffscreenCanvas(t, t).getContext("2d", {
                alpha: !1
            });
            else {
                const e = document.createElement("canvas");
                e.width = e.height = t;
                i = e.getContext("2d", {
                    alpha: !1
                });
            }
            return i;
        }
        function appendText(t, e, i) {
            const n = document.createElement("span"), l = {
                angle: 0,
                canvasWidth: 0,
                hasText: "" !== e.str,
                hasEOL: e.hasEOL,
                fontSize: 0
            };
            t._textDivs.push(n);
            const h = s.Util.transform(t._transform, e.transform);
            let d = Math.atan2(h[1], h[0]);
            const c = i[e.fontName];
            c.vertical && (d += Math.PI / 2);
            const u = t._fontInspectorEnabled && c.fontSubstitution || c.fontFamily, p = Math.hypot(h[2], h[3]), g = p * function getAscent(t, e) {
                const i = o.get(t);
                if (i) return i;
                const s = getCtx(a, e);
                s.font = `${a}px ${t}`;
                const n = s.measureText("");
                let l = n.fontBoundingBoxAscent, h = Math.abs(n.fontBoundingBoxDescent);
                if (l) {
                    const e = l / (l + h);
                    o.set(t, e);
                    s.canvas.width = s.canvas.height = 0;
                    return e;
                }
                s.strokeStyle = "red";
                s.clearRect(0, 0, a, a);
                s.strokeText("g", 0, 0);
                let d = s.getImageData(0, 0, a, a).data;
                h = 0;
                for(let t = d.length - 1 - 3; t >= 0; t -= 4)if (d[t] > 0) {
                    h = Math.ceil(t / 4 / a);
                    break;
                }
                s.clearRect(0, 0, a, a);
                s.strokeText("A", 0, a);
                d = s.getImageData(0, 0, a, a).data;
                l = 0;
                for(let t = 0, e = d.length; t < e; t += 4)if (d[t] > 0) {
                    l = a - Math.floor(t / 4 / a);
                    break;
                }
                s.canvas.width = s.canvas.height = 0;
                if (l) {
                    const e = l / (l + h);
                    o.set(t, e);
                    return e;
                }
                o.set(t, r);
                return r;
            }(u, t._isOffscreenCanvasSupported);
            let m, f;
            if (0 === d) {
                m = h[4];
                f = h[5] - g;
            } else {
                m = h[4] + g * Math.sin(d);
                f = h[5] - g * Math.cos(d);
            }
            const b = "calc(var(--scale-factor)*", A = n.style;
            if (t._container === t._rootContainer) {
                A.left = `${(100 * m / t._pageWidth).toFixed(2)}%`;
                A.top = `${(100 * f / t._pageHeight).toFixed(2)}%`;
            } else {
                A.left = `${b}${m.toFixed(2)}px)`;
                A.top = `${b}${f.toFixed(2)}px)`;
            }
            A.fontSize = `${b}${p.toFixed(2)}px)`;
            A.fontFamily = u;
            l.fontSize = p;
            n.setAttribute("role", "presentation");
            n.textContent = e.str;
            n.dir = e.dir;
            t._fontInspectorEnabled && (n.dataset.fontName = c.fontSubstitutionLoadedName || e.fontName);
            0 !== d && (l.angle = d * (180 / Math.PI));
            let v = !1;
            if (e.str.length > 1) v = !0;
            else if (" " !== e.str && e.transform[0] !== e.transform[3]) {
                const t = Math.abs(e.transform[0]), i = Math.abs(e.transform[3]);
                t !== i && Math.max(t, i) / Math.min(t, i) > 1.5 && (v = !0);
            }
            v && (l.canvasWidth = c.vertical ? e.height : e.width);
            t._textDivProperties.set(n, l);
            t._isReadableStream && t._layoutText(n);
        }
        function layout(t) {
            const { div: e, scale: i, properties: s, ctx: n, prevFontSize: a, prevFontFamily: r } = t, { style: o } = e;
            let l = "";
            if (0 !== s.canvasWidth && s.hasText) {
                const { fontFamily: h } = o, { canvasWidth: d, fontSize: c } = s;
                if (a !== c || r !== h) {
                    n.font = `${c * i}px ${h}`;
                    t.prevFontSize = c;
                    t.prevFontFamily = h;
                }
                const { width: u } = n.measureText(e.textContent);
                u > 0 && (l = `scaleX(${d * i / u})`);
            }
            0 !== s.angle && (l = `rotate(${s.angle}deg) ${l}`);
            l.length > 0 && (o.transform = l);
        }
        class TextLayerRenderTask {
            constructor({ textContentSource: t, container: e, viewport: i, textDivs: a, textDivProperties: r, textContentItemsStr: o, isOffscreenCanvasSupported: l }){
                this._textContentSource = t;
                this._isReadableStream = t instanceof ReadableStream;
                this._container = this._rootContainer = e;
                this._textDivs = a || [];
                this._textContentItemsStr = o || [];
                this._isOffscreenCanvasSupported = l;
                this._fontInspectorEnabled = !!globalThis.FontInspector?.enabled;
                this._reader = null;
                this._textDivProperties = r || new WeakMap;
                this._canceled = !1;
                this._capability = new s.PromiseCapability;
                this._layoutTextParams = {
                    prevFontSize: null,
                    prevFontFamily: null,
                    div: null,
                    scale: i.scale * (globalThis.devicePixelRatio || 1),
                    properties: null,
                    ctx: getCtx(0, l)
                };
                const { pageWidth: h, pageHeight: d, pageX: c, pageY: u } = i.rawDims;
                this._transform = [
                    1,
                    0,
                    0,
                    -1,
                    -c,
                    u + d
                ];
                this._pageWidth = h;
                this._pageHeight = d;
                (0, n.setLayerDimensions)(e, i);
                this._capability.promise.finally(()=>{
                    this._layoutTextParams = null;
                }).catch(()=>{});
            }
            get promise() {
                return this._capability.promise;
            }
            cancel() {
                this._canceled = !0;
                if (this._reader) {
                    this._reader.cancel(new s.AbortException("TextLayer task cancelled.")).catch(()=>{});
                    this._reader = null;
                }
                this._capability.reject(new s.AbortException("TextLayer task cancelled."));
            }
            _processItems(t, e) {
                for (const i of t)if (void 0 !== i.str) {
                    this._textContentItemsStr.push(i.str);
                    appendText(this, i, e);
                } else if ("beginMarkedContentProps" === i.type || "beginMarkedContent" === i.type) {
                    const t = this._container;
                    this._container = document.createElement("span");
                    this._container.classList.add("markedContent");
                    null !== i.id && this._container.setAttribute("id", `${i.id}`);
                    t.append(this._container);
                } else "endMarkedContent" === i.type && (this._container = this._container.parentNode);
            }
            _layoutText(t) {
                const e = this._layoutTextParams.properties = this._textDivProperties.get(t);
                this._layoutTextParams.div = t;
                layout(this._layoutTextParams);
                e.hasText && this._container.append(t);
                if (e.hasEOL) {
                    const t = document.createElement("br");
                    t.setAttribute("role", "presentation");
                    this._container.append(t);
                }
            }
            _render() {
                const t = new s.PromiseCapability;
                let e = Object.create(null);
                if (this._isReadableStream) {
                    const pump = ()=>{
                        this._reader.read().then(({ value: i, done: s })=>{
                            if (s) t.resolve();
                            else {
                                Object.assign(e, i.styles);
                                this._processItems(i.items, e);
                                pump();
                            }
                        }, t.reject);
                    };
                    this._reader = this._textContentSource.getReader();
                    pump();
                } else {
                    if (!this._textContentSource) throw new Error('No "textContentSource" parameter specified.');
                    {
                        const { items: e, styles: i } = this._textContentSource;
                        this._processItems(e, i);
                        t.resolve();
                    }
                }
                t.promise.then(()=>{
                    e = null;
                    !function render(t) {
                        if (t._canceled) return;
                        const e = t._textDivs, i = t._capability;
                        if (e.length > 1e5) i.resolve();
                        else {
                            if (!t._isReadableStream) for (const i of e)t._layoutText(i);
                            i.resolve();
                        }
                    }(this);
                }, this._capability.reject);
            }
        }
        function renderTextLayer(t) {
            const e = new TextLayerRenderTask(t);
            e._render();
            return e;
        }
        function updateTextLayer({ container: t, viewport: e, textDivs: i, textDivProperties: s, isOffscreenCanvasSupported: a, mustRotate: r = !0, mustRescale: o = !0 }) {
            r && (0, n.setLayerDimensions)(t, {
                rotation: e.rotation
            });
            if (o) {
                const t = getCtx(0, a), n = {
                    prevFontSize: null,
                    prevFontFamily: null,
                    div: null,
                    scale: e.scale * (globalThis.devicePixelRatio || 1),
                    properties: null,
                    ctx: t
                };
                for (const t of i){
                    n.properties = s.get(t);
                    n.div = t;
                    layout(n);
                }
            }
        }
    },
    92: (t, e, i)=>{
        i.d(e, {
            PDFDataTransportStream: ()=>PDFDataTransportStream
        });
        var s = i(266), n = i(473);
        class PDFDataTransportStream {
            constructor({ length: t, initialData: e, progressiveDone: i = !1, contentDispositionFilename: n = null, disableRange: a = !1, disableStream: r = !1 }, o){
                (0, s.assert)(o, 'PDFDataTransportStream - missing required "pdfDataRangeTransport" argument.');
                this._queuedChunks = [];
                this._progressiveDone = i;
                this._contentDispositionFilename = n;
                if (e?.length > 0) {
                    const t = e instanceof Uint8Array && e.byteLength === e.buffer.byteLength ? e.buffer : new Uint8Array(e).buffer;
                    this._queuedChunks.push(t);
                }
                this._pdfDataRangeTransport = o;
                this._isStreamingSupported = !r;
                this._isRangeSupported = !a;
                this._contentLength = t;
                this._fullRequestReader = null;
                this._rangeReaders = [];
                this._pdfDataRangeTransport.addRangeListener((t, e)=>{
                    this._onReceiveData({
                        begin: t,
                        chunk: e
                    });
                });
                this._pdfDataRangeTransport.addProgressListener((t, e)=>{
                    this._onProgress({
                        loaded: t,
                        total: e
                    });
                });
                this._pdfDataRangeTransport.addProgressiveReadListener((t)=>{
                    this._onReceiveData({
                        chunk: t
                    });
                });
                this._pdfDataRangeTransport.addProgressiveDoneListener(()=>{
                    this._onProgressiveDone();
                });
                this._pdfDataRangeTransport.transportReady();
            }
            _onReceiveData({ begin: t, chunk: e }) {
                const i = e instanceof Uint8Array && e.byteLength === e.buffer.byteLength ? e.buffer : new Uint8Array(e).buffer;
                if (void 0 === t) this._fullRequestReader ? this._fullRequestReader._enqueue(i) : this._queuedChunks.push(i);
                else {
                    const e = this._rangeReaders.some(function(e) {
                        if (e._begin !== t) return !1;
                        e._enqueue(i);
                        return !0;
                    });
                    (0, s.assert)(e, "_onReceiveData - no `PDFDataTransportStreamRangeReader` instance found.");
                }
            }
            get _progressiveDataLength() {
                return this._fullRequestReader?._loaded ?? 0;
            }
            _onProgress(t) {
                void 0 === t.total ? this._rangeReaders[0]?.onProgress?.({
                    loaded: t.loaded
                }) : this._fullRequestReader?.onProgress?.({
                    loaded: t.loaded,
                    total: t.total
                });
            }
            _onProgressiveDone() {
                this._fullRequestReader?.progressiveDone();
                this._progressiveDone = !0;
            }
            _removeRangeReader(t) {
                const e = this._rangeReaders.indexOf(t);
                e >= 0 && this._rangeReaders.splice(e, 1);
            }
            getFullReader() {
                (0, s.assert)(!this._fullRequestReader, "PDFDataTransportStream.getFullReader can only be called once.");
                const t = this._queuedChunks;
                this._queuedChunks = null;
                return new PDFDataTransportStreamReader(this, t, this._progressiveDone, this._contentDispositionFilename);
            }
            getRangeReader(t, e) {
                if (e <= this._progressiveDataLength) return null;
                const i = new PDFDataTransportStreamRangeReader(this, t, e);
                this._pdfDataRangeTransport.requestDataRange(t, e);
                this._rangeReaders.push(i);
                return i;
            }
            cancelAllRequests(t) {
                this._fullRequestReader?.cancel(t);
                for (const e of this._rangeReaders.slice(0))e.cancel(t);
                this._pdfDataRangeTransport.abort();
            }
        }
        class PDFDataTransportStreamReader {
            constructor(t, e, i = !1, s = null){
                this._stream = t;
                this._done = i || !1;
                this._filename = (0, n.isPdfFile)(s) ? s : null;
                this._queuedChunks = e || [];
                this._loaded = 0;
                for (const t of this._queuedChunks)this._loaded += t.byteLength;
                this._requests = [];
                this._headersReady = Promise.resolve();
                t._fullRequestReader = this;
                this.onProgress = null;
            }
            _enqueue(t) {
                if (!this._done) {
                    if (this._requests.length > 0) {
                        this._requests.shift().resolve({
                            value: t,
                            done: !1
                        });
                    } else this._queuedChunks.push(t);
                    this._loaded += t.byteLength;
                }
            }
            get headersReady() {
                return this._headersReady;
            }
            get filename() {
                return this._filename;
            }
            get isRangeSupported() {
                return this._stream._isRangeSupported;
            }
            get isStreamingSupported() {
                return this._stream._isStreamingSupported;
            }
            get contentLength() {
                return this._stream._contentLength;
            }
            async read() {
                if (this._queuedChunks.length > 0) {
                    return {
                        value: this._queuedChunks.shift(),
                        done: !1
                    };
                }
                if (this._done) return {
                    value: void 0,
                    done: !0
                };
                const t = new s.PromiseCapability;
                this._requests.push(t);
                return t.promise;
            }
            cancel(t) {
                this._done = !0;
                for (const t of this._requests)t.resolve({
                    value: void 0,
                    done: !0
                });
                this._requests.length = 0;
            }
            progressiveDone() {
                this._done || (this._done = !0);
            }
        }
        class PDFDataTransportStreamRangeReader {
            constructor(t, e, i){
                this._stream = t;
                this._begin = e;
                this._end = i;
                this._queuedChunk = null;
                this._requests = [];
                this._done = !1;
                this.onProgress = null;
            }
            _enqueue(t) {
                if (!this._done) {
                    if (0 === this._requests.length) this._queuedChunk = t;
                    else {
                        this._requests.shift().resolve({
                            value: t,
                            done: !1
                        });
                        for (const t of this._requests)t.resolve({
                            value: void 0,
                            done: !0
                        });
                        this._requests.length = 0;
                    }
                    this._done = !0;
                    this._stream._removeRangeReader(this);
                }
            }
            get isStreamingSupported() {
                return !1;
            }
            async read() {
                if (this._queuedChunk) {
                    const t = this._queuedChunk;
                    this._queuedChunk = null;
                    return {
                        value: t,
                        done: !1
                    };
                }
                if (this._done) return {
                    value: void 0,
                    done: !0
                };
                const t = new s.PromiseCapability;
                this._requests.push(t);
                return t.promise;
            }
            cancel(t) {
                this._done = !0;
                for (const t of this._requests)t.resolve({
                    value: void 0,
                    done: !0
                });
                this._requests.length = 0;
                this._stream._removeRangeReader(this);
            }
        }
    },
    368: (t, e, i)=>{
        i.d(e, {
            GlobalWorkerOptions: ()=>s
        });
        const s = Object.create(null);
        s.workerPort = null;
        s.workerSrc = "";
    },
    160: (t, e, i)=>{
        i.d(e, {
            XfaLayer: ()=>XfaLayer
        });
        var s = i(521);
        class XfaLayer {
            static setupStorage(t, e, i, s, n) {
                const a = s.getValue(e, {
                    value: null
                });
                switch(i.name){
                    case "textarea":
                        null !== a.value && (t.textContent = a.value);
                        if ("print" === n) break;
                        t.addEventListener("input", (t)=>{
                            s.setValue(e, {
                                value: t.target.value
                            });
                        });
                        break;
                    case "input":
                        if ("radio" === i.attributes.type || "checkbox" === i.attributes.type) {
                            a.value === i.attributes.xfaOn ? t.setAttribute("checked", !0) : a.value === i.attributes.xfaOff && t.removeAttribute("checked");
                            if ("print" === n) break;
                            t.addEventListener("change", (t)=>{
                                s.setValue(e, {
                                    value: t.target.checked ? t.target.getAttribute("xfaOn") : t.target.getAttribute("xfaOff")
                                });
                            });
                        } else {
                            null !== a.value && t.setAttribute("value", a.value);
                            if ("print" === n) break;
                            t.addEventListener("input", (t)=>{
                                s.setValue(e, {
                                    value: t.target.value
                                });
                            });
                        }
                        break;
                    case "select":
                        if (null !== a.value) {
                            t.setAttribute("value", a.value);
                            for (const t of i.children)t.attributes.value === a.value ? t.attributes.selected = !0 : t.attributes.hasOwnProperty("selected") && delete t.attributes.selected;
                        }
                        t.addEventListener("input", (t)=>{
                            const i = t.target.options, n = -1 === i.selectedIndex ? "" : i[i.selectedIndex].value;
                            s.setValue(e, {
                                value: n
                            });
                        });
                }
            }
            static setAttributes({ html: t, element: e, storage: i = null, intent: s, linkService: n }) {
                const { attributes: a } = e, r = t instanceof HTMLAnchorElement;
                "radio" === a.type && (a.name = `${a.name}-${s}`);
                for (const [e, i] of Object.entries(a))if (null != i) switch(e){
                    case "class":
                        i.length && t.setAttribute(e, i.join(" "));
                        break;
                    case "dataId":
                        break;
                    case "id":
                        t.setAttribute("data-element-id", i);
                        break;
                    case "style":
                        Object.assign(t.style, i);
                        break;
                    case "textContent":
                        t.textContent = i;
                        break;
                    default:
                        (!r || "href" !== e && "newWindow" !== e) && t.setAttribute(e, i);
                }
                r && n.addLinkAttributes(t, a.href, a.newWindow);
                i && a.dataId && this.setupStorage(t, a.dataId, e, i);
            }
            static render(t) {
                const e = t.annotationStorage, i = t.linkService, n = t.xfaHtml, a = t.intent || "display", r = document.createElement(n.name);
                n.attributes && this.setAttributes({
                    html: r,
                    element: n,
                    intent: a,
                    linkService: i
                });
                const o = "richText" !== a, l = t.div;
                l.append(r);
                if (t.viewport) {
                    const e = `matrix(${t.viewport.transform.join(",")})`;
                    l.style.transform = e;
                }
                o && l.setAttribute("class", "xfaLayer xfaFont");
                const h = [];
                if (0 === n.children.length) {
                    if (n.value) {
                        const t = document.createTextNode(n.value);
                        r.append(t);
                        o && s.XfaText.shouldBuildText(n.name) && h.push(t);
                    }
                    return {
                        textDivs: h
                    };
                }
                const d = [
                    [
                        n,
                        -1,
                        r
                    ]
                ];
                for(; d.length > 0;){
                    const [t, n, r] = d.at(-1);
                    if (n + 1 === t.children.length) {
                        d.pop();
                        continue;
                    }
                    const l = t.children[++d.at(-1)[1]];
                    if (null === l) continue;
                    const { name: c } = l;
                    if ("#text" === c) {
                        const t = document.createTextNode(l.value);
                        h.push(t);
                        r.append(t);
                        continue;
                    }
                    const u = l?.attributes?.xmlns ? document.createElementNS(l.attributes.xmlns, c) : document.createElement(c);
                    r.append(u);
                    l.attributes && this.setAttributes({
                        html: u,
                        element: l,
                        storage: e,
                        intent: a,
                        linkService: i
                    });
                    if (l.children?.length > 0) d.push([
                        l,
                        -1,
                        u
                    ]);
                    else if (l.value) {
                        const t = document.createTextNode(l.value);
                        o && s.XfaText.shouldBuildText(c) && h.push(t);
                        u.append(t);
                    }
                }
                for (const t of l.querySelectorAll(".xfaNonInteractive input, .xfaNonInteractive textarea"))t.setAttribute("readOnly", !0);
                return {
                    textDivs: h
                };
            }
            static update(t) {
                const e = `matrix(${t.viewport.transform.join(",")})`;
                t.div.style.transform = e;
                t.div.hidden = !1;
            }
        }
    },
    521: (t, e, i)=>{
        i.d(e, {
            XfaText: ()=>XfaText
        });
        class XfaText {
            static textContent(t) {
                const e = [], i = {
                    items: e,
                    styles: Object.create(null)
                };
                !function walk(t) {
                    if (!t) return;
                    let i = null;
                    const s = t.name;
                    if ("#text" === s) i = t.value;
                    else {
                        if (!XfaText.shouldBuildText(s)) return;
                        t?.attributes?.textContent ? i = t.attributes.textContent : t.value && (i = t.value);
                    }
                    null !== i && e.push({
                        str: i
                    });
                    if (t.children) for (const e of t.children)walk(e);
                }(t);
                return i;
            }
            static shouldBuildText(t) {
                return !("textarea" === t || "input" === t || "option" === t || "select" === t);
            }
        }
    },
    907: (t, e, i)=>{
        i.a(t, async (t, s)=>{
            try {
                i.d(e, {
                    AbortException: ()=>n.AbortException,
                    AnnotationEditorLayer: ()=>l.AnnotationEditorLayer,
                    AnnotationEditorParamsType: ()=>n.AnnotationEditorParamsType,
                    AnnotationEditorType: ()=>n.AnnotationEditorType,
                    AnnotationEditorUIManager: ()=>h.AnnotationEditorUIManager,
                    AnnotationLayer: ()=>d.AnnotationLayer,
                    AnnotationMode: ()=>n.AnnotationMode,
                    CMapCompressionType: ()=>n.CMapCompressionType,
                    ColorPicker: ()=>c.ColorPicker,
                    DOMSVGFactory: ()=>r.DOMSVGFactory,
                    DrawLayer: ()=>u.DrawLayer,
                    FeatureTest: ()=>n.FeatureTest,
                    GlobalWorkerOptions: ()=>p.GlobalWorkerOptions,
                    ImageKind: ()=>n.ImageKind,
                    InvalidPDFException: ()=>n.InvalidPDFException,
                    MissingPDFException: ()=>n.MissingPDFException,
                    OPS: ()=>n.OPS,
                    Outliner: ()=>g.Outliner,
                    PDFDataRangeTransport: ()=>a.PDFDataRangeTransport,
                    PDFDateString: ()=>r.PDFDateString,
                    PDFWorker: ()=>a.PDFWorker,
                    PasswordResponses: ()=>n.PasswordResponses,
                    PermissionFlag: ()=>n.PermissionFlag,
                    PixelsPerInch: ()=>r.PixelsPerInch,
                    PromiseCapability: ()=>n.PromiseCapability,
                    RenderingCancelledException: ()=>r.RenderingCancelledException,
                    UnexpectedResponseException: ()=>n.UnexpectedResponseException,
                    Util: ()=>n.Util,
                    VerbosityLevel: ()=>n.VerbosityLevel,
                    XfaLayer: ()=>m.XfaLayer,
                    build: ()=>a.build,
                    createValidAbsoluteUrl: ()=>n.createValidAbsoluteUrl,
                    fetchData: ()=>r.fetchData,
                    getDocument: ()=>a.getDocument,
                    getFilenameFromUrl: ()=>r.getFilenameFromUrl,
                    getPdfFilenameFromUrl: ()=>r.getPdfFilenameFromUrl,
                    getXfaPageViewport: ()=>r.getXfaPageViewport,
                    isDataScheme: ()=>r.isDataScheme,
                    isPdfFile: ()=>r.isPdfFile,
                    noContextMenu: ()=>r.noContextMenu,
                    normalizeUnicode: ()=>n.normalizeUnicode,
                    renderTextLayer: ()=>o.renderTextLayer,
                    setLayerDimensions: ()=>r.setLayerDimensions,
                    shadow: ()=>n.shadow,
                    updateTextLayer: ()=>o.updateTextLayer,
                    version: ()=>a.version
                });
                var n = i(266), a = i(406), r = i(473), o = i(739), l = i(629), h = i(812), d = i(640), c = i(97), u = i(423), p = i(368), g = i(405), m = i(160), f = t([
                    a
                ]);
                a = (f.then ? (await f)() : f)[0];
                s();
            } catch (t) {
                s(t);
            }
        });
    },
    694: (t, e, i)=>{
        i.d(e, {
            MessageHandler: ()=>MessageHandler
        });
        var s = i(266);
        const n = 1, a = 2, r = 1, o = 2, l = 3, h = 4, d = 5, c = 6, u = 7, p = 8;
        function wrapReason(t) {
            t instanceof Error || "object" == typeof t && null !== t || (0, s.unreachable)('wrapReason: Expected "reason" to be a (possibly cloned) Error.');
            switch(t.name){
                case "AbortException":
                    return new s.AbortException(t.message);
                case "MissingPDFException":
                    return new s.MissingPDFException(t.message);
                case "PasswordException":
                    return new s.PasswordException(t.message, t.code);
                case "UnexpectedResponseException":
                    return new s.UnexpectedResponseException(t.message, t.status);
                case "UnknownErrorException":
                    return new s.UnknownErrorException(t.message, t.details);
                default:
                    return new s.UnknownErrorException(t.message, t.toString());
            }
        }
        class MessageHandler {
            constructor(t, e, i){
                this.sourceName = t;
                this.targetName = e;
                this.comObj = i;
                this.callbackId = 1;
                this.streamId = 1;
                this.streamSinks = Object.create(null);
                this.streamControllers = Object.create(null);
                this.callbackCapabilities = Object.create(null);
                this.actionHandler = Object.create(null);
                this._onComObjOnMessage = (t)=>{
                    const e = t.data;
                    if (e.targetName !== this.sourceName) return;
                    if (e.stream) {
                        this.#Gn(e);
                        return;
                    }
                    if (e.callback) {
                        const t = e.callbackId, i = this.callbackCapabilities[t];
                        if (!i) throw new Error(`Cannot resolve callback ${t}`);
                        delete this.callbackCapabilities[t];
                        if (e.callback === n) i.resolve(e.data);
                        else {
                            if (e.callback !== a) throw new Error("Unexpected callback case");
                            i.reject(wrapReason(e.reason));
                        }
                        return;
                    }
                    const s = this.actionHandler[e.action];
                    if (!s) throw new Error(`Unknown action from worker: ${e.action}`);
                    if (e.callbackId) {
                        const t = this.sourceName, r = e.sourceName;
                        new Promise(function(t) {
                            t(s(e.data));
                        }).then(function(s) {
                            i.postMessage({
                                sourceName: t,
                                targetName: r,
                                callback: n,
                                callbackId: e.callbackId,
                                data: s
                            });
                        }, function(s) {
                            i.postMessage({
                                sourceName: t,
                                targetName: r,
                                callback: a,
                                callbackId: e.callbackId,
                                reason: wrapReason(s)
                            });
                        });
                    } else e.streamId ? this.#$n(e) : s(e.data);
                };
                i.addEventListener("message", this._onComObjOnMessage);
            }
            on(t, e) {
                const i = this.actionHandler;
                if (i[t]) throw new Error(`There is already an actionName called "${t}"`);
                i[t] = e;
            }
            send(t, e, i) {
                this.comObj.postMessage({
                    sourceName: this.sourceName,
                    targetName: this.targetName,
                    action: t,
                    data: e
                }, i);
            }
            sendWithPromise(t, e, i) {
                const n = this.callbackId++, a = new s.PromiseCapability;
                this.callbackCapabilities[n] = a;
                try {
                    this.comObj.postMessage({
                        sourceName: this.sourceName,
                        targetName: this.targetName,
                        action: t,
                        callbackId: n,
                        data: e
                    }, i);
                } catch (t) {
                    a.reject(t);
                }
                return a.promise;
            }
            sendWithStream(t, e, i, n) {
                const a = this.streamId++, o = this.sourceName, l = this.targetName, h = this.comObj;
                return new ReadableStream({
                    start: (i)=>{
                        const r = new s.PromiseCapability;
                        this.streamControllers[a] = {
                            controller: i,
                            startCall: r,
                            pullCall: null,
                            cancelCall: null,
                            isClosed: !1
                        };
                        h.postMessage({
                            sourceName: o,
                            targetName: l,
                            action: t,
                            streamId: a,
                            data: e,
                            desiredSize: i.desiredSize
                        }, n);
                        return r.promise;
                    },
                    pull: (t)=>{
                        const e = new s.PromiseCapability;
                        this.streamControllers[a].pullCall = e;
                        h.postMessage({
                            sourceName: o,
                            targetName: l,
                            stream: c,
                            streamId: a,
                            desiredSize: t.desiredSize
                        });
                        return e.promise;
                    },
                    cancel: (t)=>{
                        (0, s.assert)(t instanceof Error, "cancel must have a valid reason");
                        const e = new s.PromiseCapability;
                        this.streamControllers[a].cancelCall = e;
                        this.streamControllers[a].isClosed = !0;
                        h.postMessage({
                            sourceName: o,
                            targetName: l,
                            stream: r,
                            streamId: a,
                            reason: wrapReason(t)
                        });
                        return e.promise;
                    }
                }, i);
            }
            #$n(t) {
                const e = t.streamId, i = this.sourceName, n = t.sourceName, a = this.comObj, r = this, o = this.actionHandler[t.action], c = {
                    enqueue (t, r = 1, o) {
                        if (this.isCancelled) return;
                        const l = this.desiredSize;
                        this.desiredSize -= r;
                        if (l > 0 && this.desiredSize <= 0) {
                            this.sinkCapability = new s.PromiseCapability;
                            this.ready = this.sinkCapability.promise;
                        }
                        a.postMessage({
                            sourceName: i,
                            targetName: n,
                            stream: h,
                            streamId: e,
                            chunk: t
                        }, o);
                    },
                    close () {
                        if (!this.isCancelled) {
                            this.isCancelled = !0;
                            a.postMessage({
                                sourceName: i,
                                targetName: n,
                                stream: l,
                                streamId: e
                            });
                            delete r.streamSinks[e];
                        }
                    },
                    error (t) {
                        (0, s.assert)(t instanceof Error, "error must have a valid reason");
                        if (!this.isCancelled) {
                            this.isCancelled = !0;
                            a.postMessage({
                                sourceName: i,
                                targetName: n,
                                stream: d,
                                streamId: e,
                                reason: wrapReason(t)
                            });
                        }
                    },
                    sinkCapability: new s.PromiseCapability,
                    onPull: null,
                    onCancel: null,
                    isCancelled: !1,
                    desiredSize: t.desiredSize,
                    ready: null
                };
                c.sinkCapability.resolve();
                c.ready = c.sinkCapability.promise;
                this.streamSinks[e] = c;
                new Promise(function(e) {
                    e(o(t.data, c));
                }).then(function() {
                    a.postMessage({
                        sourceName: i,
                        targetName: n,
                        stream: p,
                        streamId: e,
                        success: !0
                    });
                }, function(t) {
                    a.postMessage({
                        sourceName: i,
                        targetName: n,
                        stream: p,
                        streamId: e,
                        reason: wrapReason(t)
                    });
                });
            }
            #Gn(t) {
                const e = t.streamId, i = this.sourceName, n = t.sourceName, a = this.comObj, g = this.streamControllers[e], m = this.streamSinks[e];
                switch(t.stream){
                    case p:
                        t.success ? g.startCall.resolve() : g.startCall.reject(wrapReason(t.reason));
                        break;
                    case u:
                        t.success ? g.pullCall.resolve() : g.pullCall.reject(wrapReason(t.reason));
                        break;
                    case c:
                        if (!m) {
                            a.postMessage({
                                sourceName: i,
                                targetName: n,
                                stream: u,
                                streamId: e,
                                success: !0
                            });
                            break;
                        }
                        m.desiredSize <= 0 && t.desiredSize > 0 && m.sinkCapability.resolve();
                        m.desiredSize = t.desiredSize;
                        new Promise(function(t) {
                            t(m.onPull?.());
                        }).then(function() {
                            a.postMessage({
                                sourceName: i,
                                targetName: n,
                                stream: u,
                                streamId: e,
                                success: !0
                            });
                        }, function(t) {
                            a.postMessage({
                                sourceName: i,
                                targetName: n,
                                stream: u,
                                streamId: e,
                                reason: wrapReason(t)
                            });
                        });
                        break;
                    case h:
                        (0, s.assert)(g, "enqueue should have stream controller");
                        if (g.isClosed) break;
                        g.controller.enqueue(t.chunk);
                        break;
                    case l:
                        (0, s.assert)(g, "close should have stream controller");
                        if (g.isClosed) break;
                        g.isClosed = !0;
                        g.controller.close();
                        this.#Kn(g, e);
                        break;
                    case d:
                        (0, s.assert)(g, "error should have stream controller");
                        g.controller.error(wrapReason(t.reason));
                        this.#Kn(g, e);
                        break;
                    case o:
                        t.success ? g.cancelCall.resolve() : g.cancelCall.reject(wrapReason(t.reason));
                        this.#Kn(g, e);
                        break;
                    case r:
                        if (!m) break;
                        new Promise(function(e) {
                            e(m.onCancel?.(wrapReason(t.reason)));
                        }).then(function() {
                            a.postMessage({
                                sourceName: i,
                                targetName: n,
                                stream: o,
                                streamId: e,
                                success: !0
                            });
                        }, function(t) {
                            a.postMessage({
                                sourceName: i,
                                targetName: n,
                                stream: o,
                                streamId: e,
                                reason: wrapReason(t)
                            });
                        });
                        m.sinkCapability.reject(wrapReason(t.reason));
                        m.isCancelled = !0;
                        delete this.streamSinks[e];
                        break;
                    default:
                        throw new Error("Unexpected stream case");
                }
            }
            async #Kn(t, e) {
                await Promise.allSettled([
                    t.startCall?.promise,
                    t.pullCall?.promise,
                    t.cancelCall?.promise
                ]);
                delete this.streamControllers[e];
            }
            destroy() {
                this.comObj.removeEventListener("message", this._onComObjOnMessage);
            }
        }
    },
    825: (t, e, i)=>{
        i.d(e, {
            MurmurHash3_64: ()=>MurmurHash3_64
        });
        var s = i(266);
        const n = 3285377520, a = 4294901760, r = 65535;
        class MurmurHash3_64 {
            constructor(t){
                this.h1 = t ? 4294967295 & t : n;
                this.h2 = t ? 4294967295 & t : n;
            }
            update(t) {
                let e, i;
                if ("string" == typeof t) {
                    e = new Uint8Array(2 * t.length);
                    i = 0;
                    for(let s = 0, n = t.length; s < n; s++){
                        const n = t.charCodeAt(s);
                        if (n <= 255) e[i++] = n;
                        else {
                            e[i++] = n >>> 8;
                            e[i++] = 255 & n;
                        }
                    }
                } else {
                    if (!(0, s.isArrayBuffer)(t)) throw new Error("Wrong data format in MurmurHash3_64_update. Input must be a string or array.");
                    e = t.slice();
                    i = e.byteLength;
                }
                const n = i >> 2, o = i - 4 * n, l = new Uint32Array(e.buffer, 0, n);
                let h = 0, d = 0, c = this.h1, u = this.h2;
                const p = 3432918353, g = 461845907, m = 11601, f = 13715;
                for(let t = 0; t < n; t++)if (1 & t) {
                    h = l[t];
                    h = h * p & a | h * m & r;
                    h = h << 15 | h >>> 17;
                    h = h * g & a | h * f & r;
                    c ^= h;
                    c = c << 13 | c >>> 19;
                    c = 5 * c + 3864292196;
                } else {
                    d = l[t];
                    d = d * p & a | d * m & r;
                    d = d << 15 | d >>> 17;
                    d = d * g & a | d * f & r;
                    u ^= d;
                    u = u << 13 | u >>> 19;
                    u = 5 * u + 3864292196;
                }
                h = 0;
                switch(o){
                    case 3:
                        h ^= e[4 * n + 2] << 16;
                    case 2:
                        h ^= e[4 * n + 1] << 8;
                    case 1:
                        h ^= e[4 * n];
                        h = h * p & a | h * m & r;
                        h = h << 15 | h >>> 17;
                        h = h * g & a | h * f & r;
                        1 & n ? c ^= h : u ^= h;
                }
                this.h1 = c;
                this.h2 = u;
            }
            hexdigest() {
                let t = this.h1, e = this.h2;
                t ^= e >>> 1;
                t = 3981806797 * t & a | 36045 * t & r;
                e = 4283543511 * e & a | (2950163797 * (e << 16 | t >>> 16) & a) >>> 16;
                t ^= e >>> 1;
                t = 444984403 * t & a | 60499 * t & r;
                e = 3301882366 * e & a | (3120437893 * (e << 16 | t >>> 16) & a) >>> 16;
                t ^= e >>> 1;
                return (t >>> 0).toString(16).padStart(8, "0") + (e >>> 0).toString(16).padStart(8, "0");
            }
        }
    },
    266: (t, e, i)=>{
        i.d(e, {
            AbortException: ()=>AbortException,
            AnnotationBorderStyleType: ()=>b,
            AnnotationEditorParamsType: ()=>u,
            AnnotationEditorPrefix: ()=>d,
            AnnotationEditorType: ()=>c,
            AnnotationMode: ()=>h,
            AnnotationPrefix: ()=>T,
            AnnotationType: ()=>f,
            BaseException: ()=>w,
            CMapCompressionType: ()=>v,
            FONT_IDENTITY_MATRIX: ()=>a,
            FeatureTest: ()=>FeatureTest,
            FormatError: ()=>FormatError,
            IDENTITY_MATRIX: ()=>n,
            ImageKind: ()=>m,
            InvalidPDFException: ()=>InvalidPDFException,
            LINE_FACTOR: ()=>o,
            MAX_IMAGE_SIZE_TO_CACHE: ()=>r,
            MissingPDFException: ()=>MissingPDFException,
            OPS: ()=>y,
            PasswordException: ()=>PasswordException,
            PasswordResponses: ()=>E,
            PermissionFlag: ()=>p,
            PromiseCapability: ()=>PromiseCapability,
            RenderingIntentFlag: ()=>l,
            TextRenderingMode: ()=>g,
            UnexpectedResponseException: ()=>UnexpectedResponseException,
            UnknownErrorException: ()=>UnknownErrorException,
            Util: ()=>Util,
            VerbosityLevel: ()=>A,
            assert: ()=>assert,
            bytesToString: ()=>bytesToString,
            createValidAbsoluteUrl: ()=>createValidAbsoluteUrl,
            getUuid: ()=>getUuid,
            getVerbosityLevel: ()=>getVerbosityLevel,
            info: ()=>info,
            isArrayBuffer: ()=>isArrayBuffer,
            isNodeJS: ()=>s,
            normalizeUnicode: ()=>normalizeUnicode,
            objectFromMap: ()=>objectFromMap,
            setVerbosityLevel: ()=>setVerbosityLevel,
            shadow: ()=>shadow,
            string32: ()=>string32,
            stringToBytes: ()=>stringToBytes,
            unreachable: ()=>unreachable,
            warn: ()=>warn
        });
        const s = !("object" != typeof process || process + "" != "[object process]" || process.versions.nw || process.versions.electron && process.type && "browser" !== process.type), n = [
            1,
            0,
            0,
            1,
            0,
            0
        ], a = [
            .001,
            0,
            0,
            .001,
            0,
            0
        ], r = 1e7, o = 1.35, l = {
            ANY: 1,
            DISPLAY: 2,
            PRINT: 4,
            SAVE: 8,
            ANNOTATIONS_FORMS: 16,
            ANNOTATIONS_STORAGE: 32,
            ANNOTATIONS_DISABLE: 64,
            OPLIST: 256
        }, h = {
            DISABLE: 0,
            ENABLE: 1,
            ENABLE_FORMS: 2,
            ENABLE_STORAGE: 3
        }, d = "pdfjs_internal_editor_", c = {
            DISABLE: -1,
            NONE: 0,
            FREETEXT: 3,
            HIGHLIGHT: 9,
            STAMP: 13,
            INK: 15
        }, u = {
            RESIZE: 1,
            CREATE: 2,
            FREETEXT_SIZE: 11,
            FREETEXT_COLOR: 12,
            FREETEXT_OPACITY: 13,
            INK_COLOR: 21,
            INK_THICKNESS: 22,
            INK_OPACITY: 23,
            HIGHLIGHT_COLOR: 31,
            HIGHLIGHT_DEFAULT_COLOR: 32
        }, p = {
            PRINT: 4,
            MODIFY_CONTENTS: 8,
            COPY: 16,
            MODIFY_ANNOTATIONS: 32,
            FILL_INTERACTIVE_FORMS: 256,
            COPY_FOR_ACCESSIBILITY: 512,
            ASSEMBLE: 1024,
            PRINT_HIGH_QUALITY: 2048
        }, g = {
            FILL: 0,
            STROKE: 1,
            FILL_STROKE: 2,
            INVISIBLE: 3,
            FILL_ADD_TO_PATH: 4,
            STROKE_ADD_TO_PATH: 5,
            FILL_STROKE_ADD_TO_PATH: 6,
            ADD_TO_PATH: 7,
            FILL_STROKE_MASK: 3,
            ADD_TO_PATH_FLAG: 4
        }, m = {
            GRAYSCALE_1BPP: 1,
            RGB_24BPP: 2,
            RGBA_32BPP: 3
        }, f = {
            TEXT: 1,
            LINK: 2,
            FREETEXT: 3,
            LINE: 4,
            SQUARE: 5,
            CIRCLE: 6,
            POLYGON: 7,
            POLYLINE: 8,
            HIGHLIGHT: 9,
            UNDERLINE: 10,
            SQUIGGLY: 11,
            STRIKEOUT: 12,
            STAMP: 13,
            CARET: 14,
            INK: 15,
            POPUP: 16,
            FILEATTACHMENT: 17,
            SOUND: 18,
            MOVIE: 19,
            WIDGET: 20,
            SCREEN: 21,
            PRINTERMARK: 22,
            TRAPNET: 23,
            WATERMARK: 24,
            THREED: 25,
            REDACT: 26
        }, b = {
            SOLID: 1,
            DASHED: 2,
            BEVELED: 3,
            INSET: 4,
            UNDERLINE: 5
        }, A = {
            ERRORS: 0,
            WARNINGS: 1,
            INFOS: 5
        }, v = {
            NONE: 0,
            BINARY: 1
        }, y = {
            dependency: 1,
            setLineWidth: 2,
            setLineCap: 3,
            setLineJoin: 4,
            setMiterLimit: 5,
            setDash: 6,
            setRenderingIntent: 7,
            setFlatness: 8,
            setGState: 9,
            save: 10,
            restore: 11,
            transform: 12,
            moveTo: 13,
            lineTo: 14,
            curveTo: 15,
            curveTo2: 16,
            curveTo3: 17,
            closePath: 18,
            rectangle: 19,
            stroke: 20,
            closeStroke: 21,
            fill: 22,
            eoFill: 23,
            fillStroke: 24,
            eoFillStroke: 25,
            closeFillStroke: 26,
            closeEOFillStroke: 27,
            endPath: 28,
            clip: 29,
            eoClip: 30,
            beginText: 31,
            endText: 32,
            setCharSpacing: 33,
            setWordSpacing: 34,
            setHScale: 35,
            setLeading: 36,
            setFont: 37,
            setTextRenderingMode: 38,
            setTextRise: 39,
            moveText: 40,
            setLeadingMoveText: 41,
            setTextMatrix: 42,
            nextLine: 43,
            showText: 44,
            showSpacedText: 45,
            nextLineShowText: 46,
            nextLineSetSpacingShowText: 47,
            setCharWidth: 48,
            setCharWidthAndBounds: 49,
            setStrokeColorSpace: 50,
            setFillColorSpace: 51,
            setStrokeColor: 52,
            setStrokeColorN: 53,
            setFillColor: 54,
            setFillColorN: 55,
            setStrokeGray: 56,
            setFillGray: 57,
            setStrokeRGBColor: 58,
            setFillRGBColor: 59,
            setStrokeCMYKColor: 60,
            setFillCMYKColor: 61,
            shadingFill: 62,
            beginInlineImage: 63,
            beginImageData: 64,
            endInlineImage: 65,
            paintXObject: 66,
            markPoint: 67,
            markPointProps: 68,
            beginMarkedContent: 69,
            beginMarkedContentProps: 70,
            endMarkedContent: 71,
            beginCompat: 72,
            endCompat: 73,
            paintFormXObjectBegin: 74,
            paintFormXObjectEnd: 75,
            beginGroup: 76,
            endGroup: 77,
            beginAnnotation: 80,
            endAnnotation: 81,
            paintImageMaskXObject: 83,
            paintImageMaskXObjectGroup: 84,
            paintImageXObject: 85,
            paintInlineImageXObject: 86,
            paintInlineImageXObjectGroup: 87,
            paintImageXObjectRepeat: 88,
            paintImageMaskXObjectRepeat: 89,
            paintSolidColorImageMask: 90,
            constructPath: 91
        }, E = {
            NEED_PASSWORD: 1,
            INCORRECT_PASSWORD: 2
        };
        let _ = A.WARNINGS;
        function setVerbosityLevel(t) {
            Number.isInteger(t) && (_ = t);
        }
        function getVerbosityLevel() {
            return _;
        }
        function info(t) {
            _ >= A.INFOS && console.log(`Info: ${t}`);
        }
        function warn(t) {
            _ >= A.WARNINGS && console.log(`Warning: ${t}`);
        }
        function unreachable(t) {
            throw new Error(t);
        }
        function assert(t, e) {
            t || unreachable(e);
        }
        function createValidAbsoluteUrl(t, e = null, i = null) {
            if (!t) return null;
            try {
                if (i && "string" == typeof t) {
                    if (i.addDefaultProtocol && t.startsWith("www.")) {
                        const e = t.match(/\./g);
                        e?.length >= 2 && (t = `http://${t}`);
                    }
                    if (i.tryConvertEncoding) try {
                        t = function stringToUTF8String(t) {
                            return decodeURIComponent(escape(t));
                        }(t);
                    } catch  {}
                }
                const s = e ? new URL(t, e) : new URL(t);
                if (function _isValidProtocol(t) {
                    switch(t?.protocol){
                        case "http:":
                        case "https:":
                        case "ftp:":
                        case "mailto:":
                        case "tel:":
                            return !0;
                        default:
                            return !1;
                    }
                }(s)) return s;
            } catch  {}
            return null;
        }
        function shadow(t, e, i, s = !1) {
            Object.defineProperty(t, e, {
                value: i,
                enumerable: !s,
                configurable: !0,
                writable: !1
            });
            return i;
        }
        const w = function BaseExceptionClosure() {
            function BaseException(t, e) {
                this.constructor === BaseException && unreachable("Cannot initialize BaseException.");
                this.message = t;
                this.name = e;
            }
            BaseException.prototype = new Error;
            BaseException.constructor = BaseException;
            return BaseException;
        }();
        class PasswordException extends w {
            constructor(t, e){
                super(t, "PasswordException");
                this.code = e;
            }
        }
        class UnknownErrorException extends w {
            constructor(t, e){
                super(t, "UnknownErrorException");
                this.details = e;
            }
        }
        class InvalidPDFException extends w {
            constructor(t){
                super(t, "InvalidPDFException");
            }
        }
        class MissingPDFException extends w {
            constructor(t){
                super(t, "MissingPDFException");
            }
        }
        class UnexpectedResponseException extends w {
            constructor(t, e){
                super(t, "UnexpectedResponseException");
                this.status = e;
            }
        }
        class FormatError extends w {
            constructor(t){
                super(t, "FormatError");
            }
        }
        class AbortException extends w {
            constructor(t){
                super(t, "AbortException");
            }
        }
        function bytesToString(t) {
            "object" == typeof t && void 0 !== t?.length || unreachable("Invalid argument for bytesToString");
            const e = t.length, i = 8192;
            if (e < i) return String.fromCharCode.apply(null, t);
            const s = [];
            for(let n = 0; n < e; n += i){
                const a = Math.min(n + i, e), r = t.subarray(n, a);
                s.push(String.fromCharCode.apply(null, r));
            }
            return s.join("");
        }
        function stringToBytes(t) {
            "string" != typeof t && unreachable("Invalid argument for stringToBytes");
            const e = t.length, i = new Uint8Array(e);
            for(let s = 0; s < e; ++s)i[s] = 255 & t.charCodeAt(s);
            return i;
        }
        function string32(t) {
            return String.fromCharCode(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, 255 & t);
        }
        function objectFromMap(t) {
            const e = Object.create(null);
            for (const [i, s] of t)e[i] = s;
            return e;
        }
        class FeatureTest {
            static get isLittleEndian() {
                return shadow(this, "isLittleEndian", function isLittleEndian() {
                    const t = new Uint8Array(4);
                    t[0] = 1;
                    return 1 === new Uint32Array(t.buffer, 0, 1)[0];
                }());
            }
            static get isEvalSupported() {
                return shadow(this, "isEvalSupported", function isEvalSupported() {
                    try {
                        new Function("");
                        return !0;
                    } catch  {
                        return !1;
                    }
                }());
            }
            static get isOffscreenCanvasSupported() {
                return shadow(this, "isOffscreenCanvasSupported", "undefined" != typeof OffscreenCanvas);
            }
            static get platform() {
                return "undefined" != typeof navigator && "string" == typeof navigator?.platform ? shadow(this, "platform", {
                    isMac: navigator.platform.includes("Mac")
                }) : shadow(this, "platform", {
                    isMac: !1
                });
            }
            static get isCSSRoundSupported() {
                return shadow(this, "isCSSRoundSupported", globalThis.CSS?.supports?.("width: round(1.5px, 1px)"));
            }
        }
        const x = [
            ...Array(256).keys()
        ].map((t)=>t.toString(16).padStart(2, "0"));
        class Util {
            static makeHexColor(t, e, i) {
                return `#${x[t]}${x[e]}${x[i]}`;
            }
            static scaleMinMax(t, e) {
                let i;
                if (t[0]) {
                    if (t[0] < 0) {
                        i = e[0];
                        e[0] = e[1];
                        e[1] = i;
                    }
                    e[0] *= t[0];
                    e[1] *= t[0];
                    if (t[3] < 0) {
                        i = e[2];
                        e[2] = e[3];
                        e[3] = i;
                    }
                    e[2] *= t[3];
                    e[3] *= t[3];
                } else {
                    i = e[0];
                    e[0] = e[2];
                    e[2] = i;
                    i = e[1];
                    e[1] = e[3];
                    e[3] = i;
                    if (t[1] < 0) {
                        i = e[2];
                        e[2] = e[3];
                        e[3] = i;
                    }
                    e[2] *= t[1];
                    e[3] *= t[1];
                    if (t[2] < 0) {
                        i = e[0];
                        e[0] = e[1];
                        e[1] = i;
                    }
                    e[0] *= t[2];
                    e[1] *= t[2];
                }
                e[0] += t[4];
                e[1] += t[4];
                e[2] += t[5];
                e[3] += t[5];
            }
            static transform(t, e) {
                return [
                    t[0] * e[0] + t[2] * e[1],
                    t[1] * e[0] + t[3] * e[1],
                    t[0] * e[2] + t[2] * e[3],
                    t[1] * e[2] + t[3] * e[3],
                    t[0] * e[4] + t[2] * e[5] + t[4],
                    t[1] * e[4] + t[3] * e[5] + t[5]
                ];
            }
            static applyTransform(t, e) {
                return [
                    t[0] * e[0] + t[1] * e[2] + e[4],
                    t[0] * e[1] + t[1] * e[3] + e[5]
                ];
            }
            static applyInverseTransform(t, e) {
                const i = e[0] * e[3] - e[1] * e[2];
                return [
                    (t[0] * e[3] - t[1] * e[2] + e[2] * e[5] - e[4] * e[3]) / i,
                    (-t[0] * e[1] + t[1] * e[0] + e[4] * e[1] - e[5] * e[0]) / i
                ];
            }
            static getAxialAlignedBoundingBox(t, e) {
                const i = this.applyTransform(t, e), s = this.applyTransform(t.slice(2, 4), e), n = this.applyTransform([
                    t[0],
                    t[3]
                ], e), a = this.applyTransform([
                    t[2],
                    t[1]
                ], e);
                return [
                    Math.min(i[0], s[0], n[0], a[0]),
                    Math.min(i[1], s[1], n[1], a[1]),
                    Math.max(i[0], s[0], n[0], a[0]),
                    Math.max(i[1], s[1], n[1], a[1])
                ];
            }
            static inverseTransform(t) {
                const e = t[0] * t[3] - t[1] * t[2];
                return [
                    t[3] / e,
                    -t[1] / e,
                    -t[2] / e,
                    t[0] / e,
                    (t[2] * t[5] - t[4] * t[3]) / e,
                    (t[4] * t[1] - t[5] * t[0]) / e
                ];
            }
            static singularValueDecompose2dScale(t) {
                const e = [
                    t[0],
                    t[2],
                    t[1],
                    t[3]
                ], i = t[0] * e[0] + t[1] * e[2], s = t[0] * e[1] + t[1] * e[3], n = t[2] * e[0] + t[3] * e[2], a = t[2] * e[1] + t[3] * e[3], r = (i + a) / 2, o = Math.sqrt((i + a) ** 2 - 4 * (i * a - n * s)) / 2, l = r + o || 1, h = r - o || 1;
                return [
                    Math.sqrt(l),
                    Math.sqrt(h)
                ];
            }
            static normalizeRect(t) {
                const e = t.slice(0);
                if (t[0] > t[2]) {
                    e[0] = t[2];
                    e[2] = t[0];
                }
                if (t[1] > t[3]) {
                    e[1] = t[3];
                    e[3] = t[1];
                }
                return e;
            }
            static intersect(t, e) {
                const i = Math.max(Math.min(t[0], t[2]), Math.min(e[0], e[2])), s = Math.min(Math.max(t[0], t[2]), Math.max(e[0], e[2]));
                if (i > s) return null;
                const n = Math.max(Math.min(t[1], t[3]), Math.min(e[1], e[3])), a = Math.min(Math.max(t[1], t[3]), Math.max(e[1], e[3]));
                return n > a ? null : [
                    i,
                    n,
                    s,
                    a
                ];
            }
            static bezierBoundingBox(t, e, i, s, n, a, r, o) {
                const l = [], h = [
                    [],
                    []
                ];
                let d, c, u, p, g, m, f, b;
                for(let h = 0; h < 2; ++h){
                    if (0 === h) {
                        c = 6 * t - 12 * i + 6 * n;
                        d = -3 * t + 9 * i - 9 * n + 3 * r;
                        u = 3 * i - 3 * t;
                    } else {
                        c = 6 * e - 12 * s + 6 * a;
                        d = -3 * e + 9 * s - 9 * a + 3 * o;
                        u = 3 * s - 3 * e;
                    }
                    if (Math.abs(d) < 1e-12) {
                        if (Math.abs(c) < 1e-12) continue;
                        p = -u / c;
                        0 < p && p < 1 && l.push(p);
                    } else {
                        f = c * c - 4 * u * d;
                        b = Math.sqrt(f);
                        if (!(f < 0)) {
                            g = (-c + b) / (2 * d);
                            0 < g && g < 1 && l.push(g);
                            m = (-c - b) / (2 * d);
                            0 < m && m < 1 && l.push(m);
                        }
                    }
                }
                let A, v = l.length;
                const y = v;
                for(; v--;){
                    p = l[v];
                    A = 1 - p;
                    h[0][v] = A * A * A * t + 3 * A * A * p * i + 3 * A * p * p * n + p * p * p * r;
                    h[1][v] = A * A * A * e + 3 * A * A * p * s + 3 * A * p * p * a + p * p * p * o;
                }
                h[0][y] = t;
                h[1][y] = e;
                h[0][y + 1] = r;
                h[1][y + 1] = o;
                h[0].length = h[1].length = y + 2;
                return [
                    Math.min(...h[0]),
                    Math.min(...h[1]),
                    Math.max(...h[0]),
                    Math.max(...h[1])
                ];
            }
        }
        function isArrayBuffer(t) {
            return "object" == typeof t && void 0 !== t?.byteLength;
        }
        class PromiseCapability {
            #Xn;
            constructor(){
                this.#Xn = !1;
                this.promise = new Promise((t, e)=>{
                    this.resolve = (e)=>{
                        this.#Xn = !0;
                        t(e);
                    };
                    this.reject = (t)=>{
                        this.#Xn = !0;
                        e(t);
                    };
                });
            }
            get settled() {
                return this.#Xn;
            }
        }
        let C = null, S = null;
        function normalizeUnicode(t) {
            if (!C) {
                C = /([\u00a0\u00b5\u037e\u0eb3\u2000-\u200a\u202f\u2126\ufb00-\ufb04\ufb06\ufb20-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufba1\ufba4-\ufba9\ufbae-\ufbb1\ufbd3-\ufbdc\ufbde-\ufbe7\ufbea-\ufbf8\ufbfc-\ufbfd\ufc00-\ufc5d\ufc64-\ufcf1\ufcf5-\ufd3d\ufd88\ufdf4\ufdfa-\ufdfb\ufe71\ufe77\ufe79\ufe7b\ufe7d]+)|(\ufb05+)/gu;
                S = new Map([
                    [
                        "ﬅ",
                        "ſt"
                    ]
                ]);
            }
            return t.replaceAll(C, (t, e, i)=>e ? e.normalize("NFKC") : S.get(i));
        }
        function getUuid() {
            if ("undefined" != typeof crypto && "function" == typeof crypto?.randomUUID) return crypto.randomUUID();
            const t = new Uint8Array(32);
            if ("undefined" != typeof crypto && "function" == typeof crypto?.getRandomValues) crypto.getRandomValues(t);
            else for(let e = 0; e < 32; e++)t[e] = Math.floor(255 * Math.random());
            return bytesToString(t);
        }
        const T = "pdfjs_internal_id_";
    }
}, a = {};
function __nested_webpack_require_640939__(t) {
    var e = a[t];
    if (void 0 !== e) return e.exports;
    var i = a[t] = {
        exports: {}
    };
    n[t](i, i.exports, __nested_webpack_require_640939__);
    return i.exports;
}
t = "function" == typeof Symbol ? Symbol("webpack queues") : "__webpack_queues__", e = "function" == typeof Symbol ? Symbol("webpack exports") : "__webpack_exports__", i = "function" == typeof Symbol ? Symbol("webpack error") : "__webpack_error__", s = (t)=>{
    if (t && t.d < 1) {
        t.d = 1;
        t.forEach((t)=>t.r--);
        t.forEach((t)=>t.r-- ? t.r++ : t());
    }
}, __nested_webpack_require_640939__.a = (n, a, r)=>{
    var o;
    r && ((o = []).d = -1);
    var l, h, d, c = new Set, u = n.exports, p = new Promise((t, e)=>{
        d = e;
        h = t;
    });
    p[e] = u;
    p[t] = (t)=>(o && t(o), c.forEach(t), p.catch((t)=>{}));
    n.exports = p;
    a((n)=>{
        l = ((n)=>n.map((n)=>{
                if (null !== n && "object" == typeof n) {
                    if (n[t]) return n;
                    if (n.then) {
                        var a = [];
                        a.d = 0;
                        n.then((t)=>{
                            r[e] = t;
                            s(a);
                        }, (t)=>{
                            r[i] = t;
                            s(a);
                        });
                        var r = {};
                        r[t] = (t)=>t(a);
                        return r;
                    }
                }
                var o = {};
                o[t] = (t)=>{};
                o[e] = n;
                return o;
            }))(n);
        var a, getResult = ()=>l.map((t)=>{
                if (t[i]) throw t[i];
                return t[e];
            }), r = new Promise((e)=>{
            (a = ()=>e(getResult)).r = 0;
            var fnQueue = (t)=>t !== o && !c.has(t) && (c.add(t), t && !t.d && (a.r++, t.push(a)));
            l.map((e)=>e[t](fnQueue));
        });
        return a.r ? r : getResult();
    }, (t)=>(t ? d(p[i] = t) : h(u), s(o)));
    o && o.d < 0 && (o.d = 0);
};
__nested_webpack_require_640939__.d = (t, e)=>{
    for(var i in e)__nested_webpack_require_640939__.o(e, i) && !__nested_webpack_require_640939__.o(t, i) && Object.defineProperty(t, i, {
        enumerable: !0,
        get: e[i]
    });
};
__nested_webpack_require_640939__.o = (t, e)=>Object.prototype.hasOwnProperty.call(t, e);
var r = __nested_webpack_require_640939__(907), o = (r = globalThis.pdfjsLib = await (globalThis.pdfjsLibPromise = r)).AbortException, l = r.AnnotationEditorLayer, h = r.AnnotationEditorParamsType, d = r.AnnotationEditorType, c = r.AnnotationEditorUIManager, u = r.AnnotationLayer, p = r.AnnotationMode, g = r.CMapCompressionType, m = r.ColorPicker, f = r.DOMSVGFactory, b = r.DrawLayer, A = r.FeatureTest, v = r.GlobalWorkerOptions, y = r.ImageKind, E = r.InvalidPDFException, _ = r.MissingPDFException, w = r.OPS, x = r.Outliner, C = r.PDFDataRangeTransport, S = r.PDFDateString, T = r.PDFWorker, M = r.PasswordResponses, P = r.PermissionFlag, F = r.PixelsPerInch, R = r.PromiseCapability, k = r.RenderingCancelledException, D = r.UnexpectedResponseException, I = r.Util, L = r.VerbosityLevel, O = r.XfaLayer, B = r.build, N = r.createValidAbsoluteUrl, U = r.fetchData, z = r.getDocument, H = r.getFilenameFromUrl, j = r.getPdfFilenameFromUrl, V = r.getXfaPageViewport, W = r.isDataScheme, q = r.isPdfFile, G = r.noContextMenu, $ = r.normalizeUnicode, K = r.renderTextLayer, X = r.setLayerDimensions, Y = r.shadow, J = r.updateTextLayer, Q = r.version;


__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } }, 1);

/***/ })

};
;