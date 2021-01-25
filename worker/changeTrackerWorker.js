var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var ChangeTrackerWorkerCommand;
(function (ChangeTrackerWorkerCommand) {
    // OptimizeWasmWithBinaryen,
    // ValidateWasmWithBinaryen,
    // CreateWasmCallGraphWithBinaryen,
    // ConvertWasmToAsmWithBinaryen,
    // DisassembleWasmWithBinaryen,
    // AssembleWatWithBinaryen,
    // DisassembleWasmWithWabt,
    // AssembleWatWithWabt,
    // TwiggyWasm,
    // GetFolderFromPath,
    ChangeTrackerWorkerCommand[ChangeTrackerWorkerCommand["CheckForFolderChanges"] = 0] = "CheckForFolderChanges";
    ChangeTrackerWorkerCommand[ChangeTrackerWorkerCommand["Terminate"] = 1] = "Terminate";
})(ChangeTrackerWorkerCommand || (ChangeTrackerWorkerCommand = {}));
var StorageLibraryChangeType;
(function (StorageLibraryChangeType) {
    StorageLibraryChangeType[StorageLibraryChangeType["Created"] = 0] = "Created";
    StorageLibraryChangeType[StorageLibraryChangeType["Deleted"] = 1] = "Deleted";
    StorageLibraryChangeType[StorageLibraryChangeType["MovedOrRenamed"] = 2] = "MovedOrRenamed";
    StorageLibraryChangeType[StorageLibraryChangeType["ContentsChanged"] = 3] = "ContentsChanged";
    StorageLibraryChangeType[StorageLibraryChangeType["MovedOutOfLibrary"] = 4] = "MovedOutOfLibrary";
    StorageLibraryChangeType[StorageLibraryChangeType["MovedIntoLibrary"] = 5] = "MovedIntoLibrary";
    StorageLibraryChangeType[StorageLibraryChangeType["ContentsReplaced"] = 6] = "ContentsReplaced";
    StorageLibraryChangeType[StorageLibraryChangeType["IndexingStatusChanged"] = 7] = "IndexingStatusChanged";
    StorageLibraryChangeType[StorageLibraryChangeType["EncryptionChanged"] = 8] = "EncryptionChanged";
    StorageLibraryChangeType[StorageLibraryChangeType["ChangeTrackingLost"] = 9] = "ChangeTrackingLost";
})(StorageLibraryChangeType || (StorageLibraryChangeType = {}));
// if (self.Windows) {
//   self.Windows.Storage.DownloadsFolder.createFileAsync('file.txt').done(
//     (newFile) => {
//       // Process file
//     }
//   );
// }
// self.addEventListener(
//   'message',
//   (e) => {
//     // self.postMessage(e.data, '');
//     // Windows.Storage.StorageFile.getFileFromPathAsync(
//     //   'ms-appx:///file.txt'
//     // ).done((file) => {
//     //   // Process file
//     // });
//     Windows.Storage.StorageFolder.getFolderFromPathAsync(
//       'ms-appx:///file.txt'
//     ).done((folder) => {
//       // Process file
//     });
//     self.postMessage(JSON.parse(e.data), '*'); //JSONにパース
//   },
//   false
// );
// async function getFolderFromPathAsync(data: string): Promise<ArrayBuffer> {
//   Windows.Storage.StorageFolder.getFolderFromPathAsync(
//     'ms-appx:///file.txt'
//   ).done((folder) => {
//     // Process file
//   });
//   return Promise.resolve(
//     module.toBinary({ log: true, write_debug_names: true }).buffer
//   );
// }
let changeTracker;
let id;
let loopLock = false;
const loopAsync = (changeTracker) => __awaiter(this, void 0, void 0, function* () {
    if (loopLock) {
        return;
    }
    loopLock = true;
    const changeReader = changeTracker.getChangeReader();
    const changes = yield changeReader.readBatchAsync();
    yield changeReader.acceptChangesAsync();
    if (!changes.length) {
        loopLock = false;
        return;
    }
    for (const change of changes) {
        const { changeType } = change;
        switch (changeType) {
            case StorageLibraryChangeType.Created:
                {
                    const storageItem = yield change.getStorageItemAsync();
                    const fa = Windows.Storage.AccessCache.StorageApplicationPermissions
                        .futureAccessList;
                    // Add to FA without metadata
                    const token = fa.add(storageItem);
                    postMessage({
                        changeType,
                        path: change.path,
                        previousPath: change.previousPath,
                        token,
                    }, undefined);
                }
                break;
            case StorageLibraryChangeType.MovedOutOfLibrary:
            case StorageLibraryChangeType.Deleted:
                {
                    postMessage({
                        changeType,
                        path: change.path,
                        previousPath: change.previousPath,
                        token: '',
                    }, undefined);
                }
                break;
            case StorageLibraryChangeType.MovedIntoLibrary:
            case StorageLibraryChangeType.MovedOrRenamed:
                {
                    const storageItem = yield change.getStorageItemAsync();
                    // Add to FA without metadata
                    const fa = Windows.Storage.AccessCache.StorageApplicationPermissions
                        .futureAccessList;
                    const token = fa.add(storageItem);
                    postMessage({
                        changeType,
                        path: change.path,
                        previousPath: change.previousPath,
                        token,
                    }, undefined);
                }
                break;
            default:
                break;
        }
    }
    loopLock = false;
});
// async function getFolderFromPathAsync(path: string) {
//   try {
//     const folder = await Windows.Storage.StorageFolder.getFolderFromPathAsync(
//       path
//     );
//     storageItems[path] = folder;
//     return folder.name;
//   } catch (e) {
//     console.log(e);
//   }
//   return '';
// }
function getFolderFromTokenAsync(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const fa = Windows.Storage.AccessCache.StorageApplicationPermissions.futureAccessList;
        const folder = yield fa.getFolderAsync(token);
        fa.remove(token);
        return folder;
    });
}
function checkForFolderChanges(mruToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const folder = yield getFolderFromTokenAsync(mruToken);
        if (changeTracker) {
            changeTracker.reset();
        }
        changeTracker = folder.tryGetChangeTracker();
        changeTracker.enable();
        // loopAsync(changeTracker);
        if (id) {
            clearInterval(id);
        }
        id = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield loopAsync(changeTracker);
        }), 100);
    });
}
function processChangeTrackerWorkerMessage(request) {
    return __awaiter(this, void 0, void 0, function* () {
        postMessage(request, undefined);
    });
}
function terminate() {
    if (changeTracker) {
        changeTracker.reset();
    }
    if (id) {
        clearInterval(id);
    }
}
// async function processChangeTrackerWorkerMessage(
//   request: IChangeTrackerWorkerRequest,
//   fn: Function
// ) {
//   // const response: IWorkerResponse = {
//   //   id: request.id,
//   //   data: null,
//   //   success: true,
//   // };
//   // try {
//   //   response.data = await fn(request.data);
//   // } catch (e) {
//   //   response.data = {
//   //     message: e.message,
//   //   };
//   //   response.success = false;
//   // }
//   // postMessage(response, undefined);
// }
onmessage = (e) => {
    // const fn = {
    //   [WorkerCommand.OptimizeWasmWithBinaryen]: getFolderFromPathAsync,
    //   [WorkerCommand.GetFolderFromPath]: getFolderFromPathAsync,
    //   [WorkerCommand.ValidateWasmWithBinaryen]: getFolderFromPathAsync,
    //   [WorkerCommand.CreateWasmCallGraphWithBinaryen]: getFolderFromPathAsync,
    //   [WorkerCommand.ConvertWasmToAsmWithBinaryen]: getFolderFromPathAsync,
    //   [WorkerCommand.DisassembleWasmWithBinaryen]: getFolderFromPathAsync,
    //   [WorkerCommand.AssembleWatWithBinaryen]: getFolderFromPathAsync,
    //   [WorkerCommand.DisassembleWasmWithWabt]: getFolderFromPathAsync,
    //   [WorkerCommand.AssembleWatWithWabt]: getFolderFromPathAsync,
    //   [WorkerCommand.TwiggyWasm]: getFolderFromPathAsync,
    // }[e.data.command];
    switch (e.data.command) {
        case ChangeTrackerWorkerCommand.CheckForFolderChanges:
            checkForFolderChanges(e.data.token);
            break;
        case ChangeTrackerWorkerCommand.Terminate:
            terminate();
            break;
        default:
            break;
    }
    // assert(fn, `Command ${e.data.command} not found.`);
    // processMessage(e.data, fn);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlVHJhY2tlcldvcmtlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNoYW5nZVRyYWNrZXJXb3JrZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsSUFBSywwQkFhSjtBQWJELFdBQUssMEJBQTBCO0lBQzdCLDRCQUE0QjtJQUM1Qiw0QkFBNEI7SUFDNUIsbUNBQW1DO0lBQ25DLGdDQUFnQztJQUNoQywrQkFBK0I7SUFDL0IsMkJBQTJCO0lBQzNCLDJCQUEyQjtJQUMzQix1QkFBdUI7SUFDdkIsY0FBYztJQUNkLHFCQUFxQjtJQUNyQiw2R0FBcUIsQ0FBQTtJQUNyQixxRkFBUyxDQUFBO0FBQ1gsQ0FBQyxFQWJJLDBCQUEwQixLQUExQiwwQkFBMEIsUUFhOUI7QUFFRCxJQUFLLHdCQVdKO0FBWEQsV0FBSyx3QkFBd0I7SUFDM0IsNkVBQVcsQ0FBQTtJQUNYLDZFQUFXLENBQUE7SUFDWCwyRkFBa0IsQ0FBQTtJQUNsQiw2RkFBbUIsQ0FBQTtJQUNuQixpR0FBcUIsQ0FBQTtJQUNyQiwrRkFBb0IsQ0FBQTtJQUNwQiwrRkFBb0IsQ0FBQTtJQUNwQix5R0FBeUIsQ0FBQTtJQUN6QixpR0FBcUIsQ0FBQTtJQUNyQixtR0FBc0IsQ0FBQTtBQUN4QixDQUFDLEVBWEksd0JBQXdCLEtBQXhCLHdCQUF3QixRQVc1QjtBQWlERCxzQkFBc0I7QUFDdEIsMkVBQTJFO0FBQzNFLHFCQUFxQjtBQUNyQix3QkFBd0I7QUFDeEIsUUFBUTtBQUNSLE9BQU87QUFDUCxJQUFJO0FBRUoseUJBQXlCO0FBQ3pCLGVBQWU7QUFDZixhQUFhO0FBQ2IsdUNBQXVDO0FBRXZDLDJEQUEyRDtBQUMzRCxpQ0FBaUM7QUFDakMsNEJBQTRCO0FBQzVCLDJCQUEyQjtBQUMzQixhQUFhO0FBQ2IsNERBQTREO0FBQzVELDhCQUE4QjtBQUM5QiwyQkFBMkI7QUFDM0Isd0JBQXdCO0FBQ3hCLFVBQVU7QUFFViw0REFBNEQ7QUFDNUQsT0FBTztBQUNQLFVB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