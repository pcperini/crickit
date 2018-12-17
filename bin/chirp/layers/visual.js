"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rectangle_1 = require("../../geometry/rectangle");
var layer_1 = require("./layer");
var path = require("path");
var imageSize = require("image-size");
var moment = require("moment");
var VisualLayer = /** @class */ (function () {
    function VisualLayer(id, source, aspectRatio, duration, crop) {
        this.fps = 60;
        this.source = source;
        this.localSource = "/tmp/ffmpeg/" + id + path.extname(source);
        this.aspectRatio = aspectRatio;
        this.duration = duration;
        this.crop = crop;
    }
    Object.defineProperty(VisualLayer.prototype, "durationSeconds", {
        get: function () {
            return moment.duration("00:" + this.duration).asSeconds();
        },
        enumerable: true,
        configurable: true
    });
    VisualLayer.prototype.setup = function () {
        return __awaiter(this, void 0, void 0, function () {
            var rawSize, startSize, _a, paddedSize, endSize;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, layer_1.loadFromSource(this.source, this.localSource)];
                    case 1:
                        _b.sent();
                        rawSize = rectangle_1.size.fromObj(imageSize(this.localSource));
                        this.crop = (this.crop ||
                            new rectangle_1.rectangle(0, 0, rawSize.w, rawSize.h));
                        startSize = this.crop.size;
                        _a = startSize.sizesThatFit(this.aspectRatio), paddedSize = _a.paddedSize, endSize = _a.endSize;
                        this.paddedSize = paddedSize;
                        this.endSize = endSize;
                        this.scalingFactor = paddedSize.scalingFactor(15000);
                        this.scalingRatio = (Math.max(paddedSize.w, paddedSize.h) / Math.min(startSize.w, startSize.h));
                        this.panDuration = this.durationSeconds * this.fps;
                        this.panDelta = new rectangle_1.size(((startSize.w - endSize.w) / this.panDuration) * this.scalingFactor, ((startSize.h - endSize.h) / this.panDuration) * this.scalingFactor);
                        return [2 /*return*/];
                }
            });
        });
    };
    VisualLayer.prototype.addTo = function (project) {
        var filters = [
            { filter: 'crop', options: this.crop.box },
            { filter: 'pad', options: this.paddedSize.dim },
            { filter: 'scale', options: {
                    w: "iw*" + this.scalingFactor,
                    h: "ih*" + this.scalingFactor
                } },
            { filter: 'zoompan', options: {
                    z: this.scalingRatio,
                    x: "x+" + this.panDelta.w,
                    y: "y+" + this.panDelta.h,
                    s: (this.endSize.w * this.scalingFactor + "x" +
                        ("" + this.endSize.h * this.scalingFactor)),
                    fps: this.fps,
                    d: this.panDuration
                } }
        ];
        project = project.input(this.localSource)
            .loop(this.durationSeconds);
        return filters.reduce(function (p, filter) { return p.videoFilter(filter); }, project)
            .size(this.endSize.w + "x" + this.endSize.h);
    };
    return VisualLayer;
}());
exports.VisualLayer = VisualLayer;
