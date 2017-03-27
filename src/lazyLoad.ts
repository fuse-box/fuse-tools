declare const FuseBox: any;

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
        const info = cfg[name];
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
            xmlhttp(info.file, (e, res) => {
                if (e) {
                    return reject(e);
                }
                new Function(res.responseText)();
                resolve(FuseBox.import(main));
            });
        }
    });
}   