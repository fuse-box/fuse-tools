const { Sparky, FuseBox } = require("fuse-box");

Spark.task("default", () => {
    const fuse = FuseBox.init({
        homeDir: "src",
        output: "dist",
        package: {
            name: "fuse-tools",
            main: "index.js"
        }
    });
    fuse.bundle("fuse-tools").instructions(" > index.ts")
});