"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var point = /** @class */ (function () {
    function point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(point.prototype, "coord", {
        get: function () {
            return { x: this.x, y: this.y };
        },
        enumerable: true,
        configurable: true
    });
    point.fromString = function (pointString) {
        var pt = pointString.split(',').map(function (i) { return parseInt(i, 10); });
        return new point(pt[0], pt[1]);
    };
    return point;
}());
exports.point = point;
var size = /** @class */ (function () {
    function size(w, h) {
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        this.w = w;
        this.h = h;
    }
    Object.defineProperty(size.prototype, "dim", {
        get: function () {
            return { w: this.w, h: this.h };
        },
        enumerable: true,
        configurable: true
    });
    size.fromString = function (sizeString) {
        var sz = sizeString.split(/[,:]/).map(function (i) { return parseInt(i, 10); });
        return new size(sz[0], sz[1]);
    };
    size.fromObj = function (sizeObj) {
        var sz = new size();
        sz.w = sizeObj.w || sizeObj.width;
        sz.h = sizeObj.h || sizeObj.height;
        return sz;
    };
    size.prototype.sizesThatFit = function (aspectRatio) {
        var endSize;
        var paddedSize;
        var rnd = Math.ceil;
        if (aspectRatio.w > aspectRatio.h) {
            paddedSize = new size(rnd((this.h * aspectRatio.w) / aspectRatio.h), this.h);
            endSize = new size(this.w, rnd((this.w * aspectRatio.h)) / aspectRatio.w);
        }
        else if (aspectRatio.w < aspectRatio.h) {
            paddedSize = new size(this.w, rnd((this.w * aspectRatio.h) / aspectRatio.w));
            endSize = new size(rnd((this.h * aspectRatio.w) / aspectRatio.h), this.h);
        }
        else { // (aspectRatio.w === aspectRatio.h)
            paddedSize = new size(Math.max(this.w, this.h), Math.max(this.w, this.h));
            endSize = new size(Math.min(this.w, this.h), Math.min(this.w, this.h));
        }
        paddedSize.w += 1;
        paddedSize.h += 1;
        return { paddedSize: paddedSize, endSize: endSize };
    };
    size.prototype.scalingFactor = function (max, step) {
        if (step === void 0) { step = 1.0; }
        return Math.floor(Math.min(10, max / Math.max(this.w, this.h)));
    };
    return size;
}());
exports.size = size;
var rectangle = /** @class */ (function () {
    function rectangle(x, y, w, h) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        this.origin = new point(x, y);
        this.size = new size(w, h);
    }
    Object.defineProperty(rectangle.prototype, "x", {
        get: function () { return this.origin.x; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(rectangle.prototype, "y", {
        get: function () { return this.origin.y; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(rectangle.prototype, "w", {
        get: function () { return this.size.w; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(rectangle.prototype, "h", {
        get: function () { return this.size.h; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(rectangle.prototype, "box", {
        get: function () {
            return { x: this.x, y: this.y, w: this.w, h: this.h };
        },
        enumerable: true,
        configurable: true
    });
    rectangle.fromString = function (boxString) {
        var box = boxString.split(':');
        var r = new rectangle();
        r.origin = point.fromString(box[0]);
        r.size = size.fromString(box[1]);
        return r;
    };
    return rectangle;
}());
exports.rectangle = rectangle;
