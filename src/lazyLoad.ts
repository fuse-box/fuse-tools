declare const FuseBox: any;
declare const global: any;

export function xmlhttp(path: string, cb: any) {
    var xmlhttp: XMLHttpRequest = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                let contentType = xmlhttp.getResponseHeader("Content-Type");
                cb(null, xmlhttp);
            } else {
                cb(`${path} was not found upon request'`)
            }
        }
    };
    xmlhttp.open("GET", path, true);
    xmlhttp.send();
}

export function lazyLoad(name: string): Promise<any> {

    return new Promise((resolve, reject) => {
        const cfg = FuseBox.global("__fsbx__bundles__");
        const info = cfg.bundles[name];
        let moduleFound = false;
        // resolve regular file if found
        if (!info) {
            // tring is async way
            return FuseBox.import(name, (module) => {
                return resolve(module)
            });
        }
        if (!info) {
            return reject({ message: `Name ${name} is not registered in FuseBox` })
        }
        const main = "~/" + info.main;
        if (FuseBox.exists(main)) {
            return resolve(FuseBox.import(main))
        } else {
            if (FuseBox.isBrowser) {
                if (!cfg.browser.match(/\/$/)) {
                    cfg.browser += "/";
                }
                let targetBrowserPath = cfg.browser + info.file;
                xmlhttp(targetBrowserPath, (e, res) => {
                    if (e) {
                        return reject(e);
                    }
                    new Function(res.responseText)();
                    resolve(FuseBox.import(main));
                });
            } else {
                // require using server
                const serverPathLib = "path";
                // making sure it's not bundled
                const path = require(serverPathLib);
                let target = path.resolve(cfg.server, info.file);
                console.log(`Load ${name}  -> ${target}`);
                require(target);
                resolve(FuseBox.import(main));
            }

        }
    });
}   