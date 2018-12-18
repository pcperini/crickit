#!/usr/bin/env node
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var app = require("commander");
var fs = require("fs");
var uuid = require("uuid/v4");
var chirp_1 = require("./chirp/chirp");
var theme_1 = require("./chirp/theme");
function validate(value, error, test) {
    if (test === void 0) { test = function () { return (!!value); }; }
    if (test(value)) {
        return value;
    }
    console.error(error);
    process.exit(1);
}
var main = function () { return __awaiter(_this, void 0, void 0, function () {
    var duration, audioSource, pictureSource, outputPath, captions, captionsContents, theme, chirp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                app.version('1.0.4')
                    .option('-a, --audioSource <path>', 'Path to audio')
                    .option('-s, --audioStart <hh:mm:ss.ss>', 'Timestamp to start audio', '00:00:00.00')
                    .option('-p, --pictureSource <path>', 'Path to picture')
                    .option('-d, --duration <mm:ss.ss>', 'Output duration')
                    .option('-o, --output <path>', 'Output destination')
                    .option('-c, --captionSource <path>', 'Path to captions JSON file')
                    .option('--aspectRatio <ratio>', 'Output aspect ratio', '1:1')
                    .option('--theme <name>', "Theme name. One of: " + Object.keys(theme_1.Theme.sampleThemes))
                    .option('-t', 'Use a custom theme. Requires --theme[Property] options')
                    .option('--themeFontName <name>', 'Name of font family')
                    .option('--themeFont <path>', 'Path to font file')
                    .option('--themeFontSize <size>', 'Font size', parseInt)
                    .option('--themeAlignment <alignment>', "Alignment. One of: " + Object.keys(theme_1.TextAlignment), function (a) { return theme_1.TextAlignment.fromString; })
                    .option('--themePrimaryColor <#RRGGBB>', 'Text color', function (c) { return (new theme_1.Color(c)); })
                    .option('--themeOutlineColor <#RRGGBB>', 'Outline color', function (c) { return (new theme_1.Color(c)); })
                    .parse(process.argv);
                duration = validate(app.duration, 'Duration must not be null');
                audioSource = validate(app.audioSource, 'Audio Source must not be null');
                pictureSource = validate(app.pictureSource, 'Picture Source must not be null');
                outputPath = validate(app.output, 'Output Path must not be null');
                captions = [];
                if (app.captionSource) {
                    captionsContents = fs.readFileSync(app.captionSource, 'utf8');
                    captions = JSON.parse(captionsContents);
                }
                if (app.theme && !app.t) {
                    theme = theme_1.Theme.sampleThemes[app.theme];
                }
                else if (app.t && !app.theme) {
                    theme = new theme_1.Theme();
                    theme.fontName = validate(app.themeFontName, 'Font name must not be null');
                    theme.fontPath = validate(app.themeFont, 'Font path must not be null');
                    theme.alignment = app.themeAlignment;
                    theme.primaryColor = app.themePrimaryColor;
                    theme.outlineColor = app.themeOutlineColor;
                    theme.fontSize = app.themeFontSize;
                }
                else {
                    console.error('Cannot use custom theme (-t) with default theme (--theme)');
                    process.exit(1);
                }
                chirp = new chirp_1.Chirp(uuid(), app.duration, app.aspectRatio, theme, { source: pictureSource, duration: app.duration }, { source: audioSource, start: app.audioStart, duration: app.duration }, captions);
                return [4 /*yield*/, chirp.save()];
            case 1:
                _a.sent();
                fs.copyFileSync(chirp.localSource, app.output);
                return [2 /*return*/];
        }
    });
}); };
main();
// brew install ffmpeg --with-fontconfig --with-libass --with-srt
