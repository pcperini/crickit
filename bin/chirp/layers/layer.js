"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var fs = require("fs");
function loadFromSource(source, localSource) {
    return new Promise(function (resolve, reject) {
        if (source.startsWith('/')) {
            fs.copyFile(source, localSource, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }
        else {
            request(source)
                .on('error', reject)
                .pipe(fs.createWriteStream(localSource))
                .on('finish', resolve);
        }
    });
}
exports.loadFromSource = loadFromSource;
