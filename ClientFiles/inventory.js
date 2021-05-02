import * as alt from 'alt';
import * as game from 'natives';
import {emitServer} from './server.js';

let inventoryBrowser = null;
let lastInteract = 0;

alt.on('keyup', (key) => {
    if (key == 0x71) {
        if(alt.Player.local.hasMeta("controls")) return;
        if (inventoryBrowser == null) { //Inv �ffnen
            alt.log(`CEFState: ${alt.Player.local.getSyncedMeta("IsCefOpen")}`);
            if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true || alt.Player.local.getSyncedMeta("IsCefOpen") == true) return;
            openInventoryCEF(true);
        } else { //Inv close
            closeInventoryCEF();
        }
    }
})

function canInteract() { return (lastInteract + 1000 < Date.now()) }

function UseItem(itemname, itemAmount, fromContainer) {
    if (!canInteract) return
    lastInteract = Date.now()
    emitServer("Serverq8FqUh28kGTAELbX:Inventory:UseItem", itemname, parseInt(itemAmount), fromContainer);
}

function DropItem(itemname, itemAmount, fromContainer) {
    if (!canInteract) return
    lastInteract = Date.now()
    emitServer("Serverq8FqUh28kGTAELbX:Inventory:DropItem", itemname, parseInt(itemAmount), fromContainer);
}

function switchItemToDifferentInv(itemname, itemAmount, fromContainer, toContainer) {
    if (!canInteract) return
    lastInteract = Date.now()
    emitServer("Serverq8FqUh28kGTAELbX:Inventory:switchItemToDifferentInv", itemname, parseInt(itemAmount), fromContainer, toContainer);
}

function GiveItem(itemname, itemAmount, fromContainer, targetPlayerID) {
    if (!canInteract) return;
    lastInteract = Date.now()
    emitServer("Serverq8FqUh28kGTAELbX:Inventory:GiveItem", itemname, parseInt(itemAmount), fromContainer, parseInt(targetPlayerID));
}

alt.onServer("Clientq8FqUh28kGTAELbX:Inventory:CreateInventory", (invArray, backpackSize, targetPlayerID) => {
    openInventoryCEF(false);
    alt.setTimeout(() => {
        if (inventoryBrowser != null) {
            inventoryBrowser.emit('CEFq8FqUh28kGTAELbX:Inventory:AddInventoryItems', invArray, backpackSize, targetPlayerID);
        }
    }, 800);
});

alt.onServer('Clientq8FqUh28kGTAELbX:Inventory:AddInventoryItems', (invArray, backpackSize, targetPlayerID) => {
    if (inventoryBrowser != null) {
        inventoryBrowser.emit('CEFq8FqUh28kGTAELbX:Inventory:AddInventoryItems', invArray, backpackSize, targetPlayerID);
    }
});

alt.onServer('Clientq8FqUh28kGTAELbX:Inventory:closeCEFq8FqUh28kGTAELbX', () => {
    closeInventoryCEF();
});

alt.onServer('Clientq8FqUh28kGTAELbX:Inventory:PlayAnimation', (animDict, animName, duration, flag, lockpos) => {
    if (animDict == undefined || animName == undefined || flag == undefined || duration == undefined) return;
    RequestModel(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8.0, 1, duration, flag, 1, false, false, false);
        }
    }, 0);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Inventory:StopAnimation", () => {
    game.clearPedTasks(alt.Player.local.scriptID);
});

alt.onServer('Clientq8FqUh28kGTAELbX:Inventory:drunk', () => {
    game.requestAnimSet('move_m@drunk@verydrunk');

    if (game.hasAnimSetLoaded('move_m@drunk@verydrunk')) {
        game.setPedMovementClipset(alt.Player.local.scriptID, 'move_m@drunk@verydrunk', 1.0);
        game.setPedConfigFlag(alt.Player.local.scriptID, 32, true);
    }

    game.animpostfxStopAll();
    game.animpostfxPlay('DrugsMichaelAliensFightIn', 0, false);
    alt.setTimeout(() => {
        game.animpostfxPlay('DrugsMichaelAliensFight', 0, true);
        alt.setTimeout(() => {
            game.animpostfxPlay('DrugsMichaelAliensFightOut', 0, false);
            alt.setTimeout(() => {
                game.animpostfxStopAll();
                game.resetPedMovementClipset(alt.Player.local.scriptID, 0.0);
            }, 10000);
        }, 60000);
    }, 5000);
});


alt.onServer('Clientq8FqUh28kGTAELbX:Inventory:mrjava', () => {
    game.animpostfxStopAll();
    game.animpostfxPlay('DeathFailOut', 0, false);
    game.shakeGameplayCam('DEATH_FAIL_IN_EFFECT_SHAKE', 0.5);
    alt.setTimeout(() => {
        game.stopCinematicCamShaking(true);
        game.animpostfxStopAll();
        game.resetPedMovementClipset(alt.Player.local.scriptID, 0.0);
    }, 10000);
});

alt.onServer('Clientq8FqUh28kGTAELbX:Inventory:joint', () => {
    game.animpostfxStopAll();
    game.animpostfxPlay('DrugsTrevorClownsFight', 0, false);
    game.shakeGameplayCam('JOLT_SHAKE', 0.5);
    alt.setTimeout(() => {
        game.stopCinematicCamShaking(true);
        game.animpostfxStopAll();
        game.resetPedMovementClipset(alt.Player.local.scriptID, 0.0);
    }, 300000);
});

let openInventoryCEF = function(requestItems) {
    if (inventoryBrowser == null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && alt.Player.local.getSyncedMeta("PLAYER_SPAWNED") == true) {
        alt.showCursor(true);
        alt.toggleGameControls(false);
        inventoryBrowser = new alt.WebView("http://resource/client/cef/inventory/index.html");
        inventoryBrowser.focus();
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        inventoryBrowser.on("Clientq8FqUh28kGTAELbX:Inventory:cefIsReady", () => {
            if (!requestItems) return;
            emitServer("Serverq8FqUh28kGTAELbX:Inventory:RequestInventoryItems");
        });
        inventoryBrowser.on("Clientq8FqUh28kGTAELbX:Inventory:UseInvItem", UseItem);
        inventoryBrowser.on("Clientq8FqUh28kGTAELbX:Inventory:DropInvItem", DropItem);
        inventoryBrowser.on("Clientq8FqUh28kGTAELbX:Inventory:switchItemToDifferentInv", switchItemToDifferentInv);
        inventoryBrowser.on("Clientq8FqUh28kGTAELbX:Inventory:giveItem", GiveItem);
    }
}

export function closeInventoryCEF() {
    if (inventoryBrowser != null) {
        inventoryBrowser.off("Clientq8FqUh28kGTAELbX:Inventory:UseInvItem", UseItem);
        inventoryBrowser.off("Clientq8FqUh28kGTAELbX:Inventory:DropInvItem", DropItem);
        inventoryBrowser.off("Clientq8FqUh28kGTAELbX:Inventory:switchItemToDifferentInv", switchItemToDifferentInv);
        inventoryBrowser.off("Clientq8FqUh28kGTAELbX:Inventory:giveItem", GiveItem);
        inventoryBrowser.unfocus();
        inventoryBrowser.destroy();
        inventoryBrowser = null;
        alt.showCursor(false);
        alt.toggleGameControls(true);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    }
}
export const RequestModel = async (modelHash, timeoutMs = 1000) => {
    return new Promise((resolve, reject) => {
        if (!game.doesAnimDictExist(modelHash)) {
            reject(new Error(`AnimDict does not exist: ${modelHash}`));
            return;
        }

        if (game.hasAnimDictLoaded(modelHash)) {
            resolve(true);
            return;
        }

        game.requestAnimDict(modelHash);

        const deadline = new Date().getTime() + timeoutMs;

        const inter = alt.setInterval(() => {
            if (game.hasAnimDictLoaded(modelHash)) {
                alt.clearInterval(inter);
                resolve(true);
            } else if (deadline < new Date().getTime()) {
                alt.clearInterval(inter);
                const error = `Error: Async loading failed for AnimDict: ${modelHash}`;
                alt.log(error);
                reject(new Error(error)); // probably better resolve(false)
            }
        }, 10);
    });
};