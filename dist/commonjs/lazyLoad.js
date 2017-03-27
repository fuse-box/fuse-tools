"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function xmlhttp(path, cb) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                var contentType = xmlhttp.getResponseHeader("Content-Type");
                cb(null, xmlhttp);
            }
            else {
                cb(path + " was not found upon request'");
            }
        }
    };
    xmlhttp.open("GET", path, true);
    xmlhttp.send();
}
exports.xmlhttp = xmlhttp;
function lazyLoad(name) {
    return new Promise(function (resolve, reject) {
        var cfg = FuseBox.global("__fsbx__bundles__");
        var info = cfg[name];
        var moduleFound = false;
        if (!info) {
            return FuseBox.import(name, function (module) {
                return resolve(module);
            });
        }
        if (!info) {
            return reject({ message: "Name " + name + " is not registered in FuseBox" });
        }
        var main = "~/" + info.main;
        if (FuseBox.exists(main)) {
            return resolve(FuseBox.import(main));
        }
        else {
            xmlhttp(info.file, function (e, res) {
                if (e) {
                    return reject(e);
                }
                new Function(res.responseText)();
                resolve(FuseBox.import(main));
            });
        }
    });
}
exports.lazyLoad = lazyLoad;
