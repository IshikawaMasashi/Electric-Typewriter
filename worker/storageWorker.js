var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var StorageWorkerCommand;
(function (StorageWorkerCommand) {
    StorageWorkerCommand[StorageWorkerCommand["OptimizeWasmWithBinaryen"] = 0] = "OptimizeWasmWithBinaryen";
    StorageWorkerCommand[StorageWorkerCommand["ValidateWasmWithBinaryen"] = 1] = "ValidateWasmWithBinaryen";
    StorageWorkerCommand[StorageWorkerCommand["CreateWasmCallGraphWithBinaryen"] = 2] = "CreateWasmCallGraphWithBinaryen";
    StorageWorkerCommand[StorageWorkerCommand["ConvertWasmToAsmWithBinaryen"] = 3] = "ConvertWasmToAsmWithBinaryen";
    StorageWorkerCommand[StorageWorkerCommand["DisassembleWasmWithBinaryen"] = 4] = "DisassembleWasmWithBinaryen";
    StorageWorkerCommand[StorageWorkerCommand["AssembleWatWithBinaryen"] = 5] = "AssembleWatWithBinaryen";
    StorageWorkerCommand[StorageWorkerCommand["DisassembleWasmWithWabt"] = 6] = "DisassembleWasmWithWabt";
    StorageWorkerCommand[StorageWorkerCommand["AssembleWatWithWabt"] = 7] = "AssembleWatWithWabt";
    StorageWorkerCommand[StorageWorkerCommand["TwiggyWasm"] = 8] = "TwiggyWasm";
    StorageWorkerCommand[StorageWorkerCommand["GetFolderFromPath"] = 9] = "GetFolderFromPath";
    StorageWorkerCommand[StorageWorkerCommand["PickSingleFolder"] = 10] = "PickSingleFolder";
    StorageWorkerCommand[StorageWorkerCommand["SetStorageItem"] = 11] = "SetStorageItem";
})(StorageWorkerCommand || (StorageWorkerCommand = {}));
const storageItems = {};
function assert(c, message) {
    if (!c) {
        throw new Error(message);
    }
}
function loadBinaryen() {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof Binaryen === 'undefined') {
            importScripts('https://cdn.rawgit.com/AssemblyScript/binaryen.js/v48.0.0-nightly.20180624/index.js');
        }
    });
}
function loadWabt() {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof wabt === 'undefined') {
            self.global = self; // Wabt installs itself on the global object.
            importScripts('https://cdn.rawgit.com/AssemblyScript/wabt.js/v1.0.0-nightly.20180421/index.js');
        }
    });
}
let Twiggy = null;
function loadTwiggy() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!Twiggy) {
            importScripts('../lib/twiggy_wasm_api.js');
            yield wasm_bindgen('../lib/twiggy_wasm_api_bg.wasm');
            Twiggy = {
                Items: wasm_bindgen.Items,
                Top: wasm_bindgen.Top,
                Paths: wasm_bindgen.Paths,
                Monos: wasm_bindgen.Monos,
                Dominators: wasm_bindgen.Dominators,
            };
        }
    });
}
function getFolderFromPathAsync(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const folder = yield Windows.Storage.StorageFolder.getFolderFromPathAsync(path);
            const fa = Windows.Storage.AccessCache.StorageApplicationPermissions
                .futureAccessList;
            const mruToken = fa.add(folder);
            return mruToken;
        }
        catch (e) {
            console.log(e);
        }
        return '';
    });
}
function getFolderAsync(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const futureAccessList = Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList;
        const folder = yield futureAccessList.getItemAsync(token);
        return folder;
    });
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function pickSingleFolderAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create the picker object and set options
        const folderPicker = new Windows.Storage.Pickers.FolderPicker();
        folderPicker.suggestedStartLocation =
            Windows.Storage.Pickers.PickerLocationId.computerFolder; //.desktop;
        // Users expect to have a filtered view of their folders depending on the scenario.
        // For example, when choosing a documents folder, restrict the filetypes to documents for your application.
        // folderPicker.fileTypeFilter.replaceAll(['*'] as any);
        folderPicker.fileTypeFilter.push('*');
        // return await folderPicker.pickSingleFolderAsync();
        const folder = yield folderPicker.pickSingleFolderAsync();
        const fa = Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList;
        const token = fa.add(folder);
        return token;
    });
}
function setStorageItem(request) {
    return __awaiter(this, void 0, void 0, function* () {
        const { token, path } = request;
        if (!token) {
            storageItems[path] = undefined;
            console.log(`Set undefined:${path}`);
            return;
        }
        const fa = Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList;
        const item = yield fa.getItemAsync(token);
        // console.log(`Set StorageItem:${item.path}`);
        storageItems[item.path] = item;
        fa.remove(token);
        return token;
    });
}
function getFoldersFromPathAsync(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const fa = Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList;
        const item = storageItems[path];
        if (!item) {
            return;
        }
        if (item.isOfType(Windows.Storage.StorageItemTypes.folder)) {
            const folder = item;
            const folders = yield folder.getFoldersAsync();
            for (const folder of folders) {
                storageItems[folder.path] = folder;
                const token = fa.add(folder);
                postMessage({ token }, undefined);
            }
        }
    });
}
onmessage = (e) => {
    const fn = {
        [StorageWorkerCommand.OptimizeWasmWithBinaryen]: optimizeWasmWithBinaryen,
        [StorageWorkerCommand.ValidateWasmWithBinaryen]: validateWasmWithBinaryen,
        [StorageWorkerCommand.CreateWasmCallGraphWithBinaryen]: createWasmCallGraphWithBinaryen,
        [StorageWorkerCommand.ConvertWasmToAsmWithBinaryen]: convertWasmToAsmWithBinaryen,
        [StorageWorkerCommand.DisassembleWasmWithBinaryen]: disassembleWasmWithBinaryen,
        [StorageWorkerCommand.AssembleWatWithBinaryen]: assembleWatWithBinaryen,
        [StorageWorkerCommand.DisassembleWasmWithWabt]: disassembleWasmWithWabt,
        [StorageWorkerCommand.AssembleWatWithWabt]: assembleWatWithWabt,
        [StorageWorkerCommand.TwiggyWasm]: twiggyWasm,
        [StorageWorkerCommand.GetFolderFromPath]: getFolderFromPathAsync,
        [StorageWorkerCommand.PickSingleFolder]: pickSingleFolderAsync,
        [StorageWorkerCommand.SetStorageItem]: setStorageItem,
    }[e.data.command];
    assert(fn, `Command ${e.data.command} not found.`);
    processStorageWorkerMessage(e.data, fn);
};
// async function processMessage(request: IWorkerRequest, fn: Function) {
function processStorageWorkerMessage(request, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = {
            id: request.id,
            data: null,
            success: true,
        };
        try {
            response.data = yield fn(request);
        }
        catch (e) {
            response.data = {
                message: e.message,
            };
            response.success = false;
        }
        postMessage(response, undefined);
    });
}
function optimizeWasmWithBinaryen(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadBinaryen();
        const module = Binaryen.readBinary(new Uint8Array(data));
        module.optimize();
        return Promise.resolve(module.emitBinary());
    });
}
function validateWasmWithBinaryen(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadBinaryen();
        const module = Binaryen.readBinary(new Uint8Array(data));
        return Promise.resolve(module.validate());
    });
}
function createWasmCallGraphWithBinaryen(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadBinaryen();
        const module = Binaryen.readBinary(new Uint8Array(data));
        const old = Binaryen.print;
        let ret = '';
        Binaryen.print = (x) => {
            ret += x + '\n';
        };
        module.runPasses(['print-call-graph']);
        Binaryen.print = old;
        return Promise.resolve(ret);
    });
}
function convertWasmToAsmWithBinaryen(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadBinaryen();
        const module = Binaryen.readBinary(new Uint8Array(data));
        module.optimize();
        return Promise.resolve(module.emitAsmjs());
    });
}
function disassembleWasmWithBinaryen(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadBinaryen();
        const module = Binaryen.readBinary(new Uint8Array(data));
        return Promise.resolve(module.emitText());
    });
}
function assembleWatWithBinaryen(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadBinaryen();
        const module = Binaryen.parseText(data);
        return Promise.resolve(module.emitBinary());
    });
}
function disassembleWasmWithWabt(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadWabt();
        const module = wabt.readWasm(data, { readDebugNames: true });
        module.generateNames();
        module.applyNames();
        return Promise.resolve(module.toText({ foldExprs: false, inlineExport: true }));
    });
}
function assembleWatWithWabt(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadWabt();
        const module = wabt.parseWat('test.wat', data);
        module.resolveNames();
        module.validate();
        return Promise.resolve(module.toBinary({ log: true, write_debug_names: true }).buffer);
    });
}
function twiggyWasm(data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadTwiggy();
        let opts;
        const items = Twiggy.Items.parse(new Uint8Array(data));
        let md = '# Twiggy Analysis\n\nTwiggy is a code size profiler, learn more about it [here](https://github.com/rustwasm/twiggy).\n\n';
        // Top
        opts = Twiggy.Top.new();
        const top = JSON.parse(items.top(opts));
        md += '## Top\n\n';
        md += '| Shallow Bytes | Shallow % | Item |\n';
        md += '| ------------: | --------: | :--- |\n';
        let ignoreCount = 0;
        const shallowSizePercentIgnoreThreshold = 0.1;
        top.forEach((entry) => {
            if (entry.shallow_size_percent >= shallowSizePercentIgnoreThreshold) {
                md += `| ${entry.shallow_size} | ${entry.shallow_size_percent.toFixed(2)} | \`${entry.name}\` |\n`;
            }
            else {
                ignoreCount++;
            }
        });
        if (ignoreCount) {
            md += `\n### Note:\n${ignoreCount} items had a shallow size percent less than ${shallowSizePercentIgnoreThreshold} and were not listed above.\n`;
        }
        // Paths
        // md += "\n\n# Paths\n\n";
        // opts = Twiggy.Paths.new();
        // const paths = JSON.parse(items.paths(opts));
        // Monos
        // md += "\n\n# Monos\n\n";
        // opts = Twiggy.Monos.new();
        // opts.set_max_generics(10);
        // opts.set_max_monos(10);
        // const monos = JSON.parse(items.monos(opts));
        md += '\n\n## Dominators\n\n';
        md += '| Retained Bytes | Retained % | Dominator Tree |\n';
        md += '| ------------: | --------: | :--- |\n';
        // Dominators
        const retainedSizePercentIgnoreThreshold = 0.1;
        ignoreCount = 0;
        opts = Twiggy.Dominators.new();
        const dominator = JSON.parse(items.dominators(opts));
        function printDominator(dominator, depth) {
            let prefix = '';
            for (let i = 0; i < depth - 1; i++) {
                prefix += '   ';
            }
            if (depth) {
                prefix += '⤷ ';
            }
            md += `| ${dominator.retained_size} | ${dominator.retained_size_percent.toFixed(2)} | \`${prefix + dominator.name}\` |\n`;
            if (dominator.children) {
                dominator.children.forEach((child) => {
                    if (child.retained_size_percent >= retainedSizePercentIgnoreThreshold) {
                        printDominator(child, depth + 1);
                    }
                    else {
                        ignoreCount++;
                    }
                });
            }
        }
        printDominator(dominator, 0);
        if (ignoreCount) {
            md += `\n### Note:\n${ignoreCount} items had a retained size percent less than ${retainedSizePercentIgnoreThreshold} and were not listed above.\n`;
        }
        return Promise.resolve(md);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZVdvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0b3JhZ2VXb3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBWUEsSUFBSyxvQkFhSjtBQWJELFdBQUssb0JBQW9CO0lBQ3ZCLHVHQUF3QixDQUFBO0lBQ3hCLHVHQUF3QixDQUFBO0lBQ3hCLHFIQUErQixDQUFBO0lBQy9CLCtHQUE0QixDQUFBO0lBQzVCLDZHQUEyQixDQUFBO0lBQzNCLHFHQUF1QixDQUFBO0lBQ3ZCLHFHQUF1QixDQUFBO0lBQ3ZCLDZGQUFtQixDQUFBO0lBQ25CLDJFQUFVLENBQUE7SUFDVix5RkFBaUIsQ0FBQTtJQUNqQix3RkFBZ0IsQ0FBQTtJQUNoQixvRkFBYyxDQUFBO0FBQ2hCLENBQUMsRUFiSSxvQkFBb0IsS0FBcEIsb0JBQW9CLFFBYXhCO0FBYUQsTUFBTSxZQUFZLEdBQWlELEVBQUUsQ0FBQztBQUV0RSxTQUFTLE1BQU0sQ0FBQyxDQUFNLEVBQUUsT0FBZ0I7SUFDdEMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNOLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDMUI7QUFDSCxDQUFDO0FBd0JELFNBQWUsWUFBWTs7UUFDekIsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXLEVBQUU7WUFDbkMsYUFBYSxDQUNYLHFGQUFxRixDQUN0RixDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQUE7QUFFRCxTQUFlLFFBQVE7O1FBQ3JCLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQzlCLElBQVksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsNkNBQTZDO1lBQzFFLGFBQWEsQ0FDWCxnRkFBZ0YsQ0FDakYsQ0FBQztTQUNIO0lBQ0gsQ0FBQztDQUFBO0FBRUQsSUFBSSxNQUFNLEdBQVEsSUFBSSxDQUFDO0FBR3ZCLFNBQWUsVUFBVTs7UUFDdkIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLGFBQWEs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