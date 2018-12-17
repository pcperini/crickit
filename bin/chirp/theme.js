"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TextAlignment;
(function (TextAlignment) {
    TextAlignment[TextAlignment["BottomLeft"] = 1] = "BottomLeft";
    TextAlignment[TextAlignment["BottomCenter"] = 2] = "BottomCenter";
    TextAlignment[TextAlignment["BottomRight"] = 3] = "BottomRight";
    TextAlignment[TextAlignment["TopLeft"] = 4] = "TopLeft";
    TextAlignment[TextAlignment["TopCenter"] = 5] = "TopCenter";
    TextAlignment[TextAlignment["TopRight"] = 6] = "TopRight";
    TextAlignment[TextAlignment["CenterLeft"] = 7] = "CenterLeft";
    TextAlignment[TextAlignment["Center"] = 8] = "Center";
    TextAlignment[TextAlignment["CenterRight"] = 9] = "CenterRight";
})(TextAlignment || (TextAlignment = {}));
exports.TextAlignment = TextAlignment;
function textAlignmentFromString(value) {
    return TextAlignment[value];
}
function toCamelCase(value) {
    return value
        .replace(/\s(.)/g, function (i) { return i.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function (i) { return i.toUpperCase(); });
}
exports.toCamelCase = toCamelCase;
var BorderStyle;
(function (BorderStyle) {
    BorderStyle[BorderStyle["Outline"] = 1] = "Outline";
    BorderStyle[BorderStyle["Box"] = 3] = "Box";
})(BorderStyle || (BorderStyle = {}));
exports.BorderStyle = BorderStyle;
var Color = /** @class */ (function () {
    function Color(value) {
        this.value = '#000000';
        if (value.startsWith('#')) {
            this.value = value;
        }
    }
    Object.defineProperty(Color.prototype, "styleValue", {
        get: function () {
            var styleValue = this.value;
            if (styleValue.length == 7) {
                styleValue = "&H00" + styleValue.substr(1, 6);
            }
            else if (styleValue.length == 9) {
                var alpha = 255 - parseInt("0x" + styleValue.substr(7, 2));
                styleValue = ("&H" + alpha.toString(16).toUpperCase() +
                    ("" + styleValue.substr(1, 6)));
            }
            return styleValue;
        },
        enumerable: true,
        configurable: true
    });
    return Color;
}());
exports.Color = Color;
var Theme = /** @class */ (function () {
    function Theme() {
    }
    Object.defineProperty(Theme.prototype, "styles", {
        get: function () {
            var _this = this;
            var skipStyles = ['VideoFilters'];
            var validStyles = [
                'Name', 'Encoding',
                'FontName', 'FontSize',
                'PrimaryColour', 'SecondaryColour', 'OutlineColour',
                'BackColour',
                'Bold', 'Italic', 'Underline', 'StrikeOut',
                'ScaleX', 'ScaleY', 'Spacing', 'Angle',
                'BorderStyle', 'Outline', 'Shadow',
                'Alignment', 'MarginL', 'MarginR', 'MarginV'
            ];
            return Object.getOwnPropertyNames(this).reduce(function (all, style) {
                var _a;
                var styleName = toCamelCase(style)
                    .replace(/([cC]olor)/g, 'Colour');
                if (validStyles.indexOf(styleName) === -1) {
                    if (skipStyles.indexOf(styleName) === -1) {
                        console.warn("Invalid style name: " + style);
                    }
                    return all;
                }
                var rawStyleValue = _this[style];
                var styleValue;
                if (rawStyleValue['styleValue'] !== undefined) {
                    styleValue = rawStyleValue.styleValue;
                }
                else {
                    styleValue = rawStyleValue;
                }
                return __assign((_a = {}, _a[styleName] = styleValue, _a), all);
            }, {});
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Theme.prototype, "ssaStyleString", {
        get: function () {
            var styles = this.styles;
            return Object.keys(styles)
                .reduce(function (all, style) { return [style + "=" + styles[style]].concat(all); }, [])
                .join(',');
        },
        enumerable: true,
        configurable: true
    });
    Theme.fromObj = function (obj) {
        var theme = new Theme();
        theme.fontName = obj.fontName || 'Open Sans Bold';
        theme.alignment = textAlignmentFromString(obj.alignment || 'BottomCenter');
        theme.primaryColor = new Color(obj.primaryColor || '#FFFFFF');
        theme.outlineColor = new Color(obj.outlineColor || '#000000');
        theme.fontSize = obj.fontSize || 24;
        theme.videoFilters = obj.videoFilters || [];
        return theme;
    };
    Theme.sampleThemesSource = require('../../assets/themes.json');
    Theme.sampleThemes = Object.keys(Theme.sampleThemesSource)
        .reduce(function (all, next) {
        var _a;
        return (__assign((_a = {}, _a[next] = Theme.fromObj(Theme.sampleThemesSource[next]), _a), all));
    }, {});
    return Theme;
}());
exports.Theme = Theme;
