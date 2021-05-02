import * as alt from 'alt';
import * as game from 'natives';
import {emitServer} from './server.js';

let tabletBrowser = null;
let lastInteract = 0;
let tabletReady = false;

alt.on('keyup', (key) => {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (key == 0x72 && !alt.Player.local.hasMeta("controls")) {
        if (tabletBrowser == null) {
            emitServer("Serverq8FqUh28kGTAELbX:Tablet:openCEFq8FqUh28kGTAELbX");
        } else {
            closeTabletCEF();
        }
    }
});

function canInteract() { return (lastInteract + 1000 < Date.now()) }

let tablet = null;

alt.onServer('Clientq8FqUh28kGTAELbX:Tablet:createCEFq8FqUh28kGTAELbX', () => {
    openTabletCEF();
    let coords = game.getEntityCoords(alt.Player.local.scriptID, true);
    let bone = game.getPedBoneIndex(alt.Player.local.scriptID, 28422);
    if (tablet) return;
    let tabletModel = game.getHashKey('prop_cs_tablet');
    game.requestAnimDict("cellphone@");
    alt.loadModel(tabletModel);
    let animInterval = alt.setInterval(() => {
        if (!game.hasAnimDictLoaded("cellphone@")) return;
        game.taskPlayAnim(alt.Player.local.scriptID, "cellphone@", "cellphone_cellphone_intro", 1.0, -1, -1, 50, 0, false, false, false);
        alt.clearInterval(animInterval);
    }, 0);
    let interval = alt.setInterval(() => {
        if (!game.hasModelLoaded(tabletModel)) return;
        tablet = game.createObject(tabletModel, coords.x, coords.y, coords.z, true, true, false);
        game.attachEntityToEntity(tablet, alt.Player.local.scriptID, bone, 0, 0, 0, 0, 0, 0, true, true, false, false, 2, true);
        alt.clearInterval(interval);
    }, 0);
});

alt.onServer('Clientq8FqUh28kGTAELbX:Tablet:finaly', () => {
    if (tabletBrowser != null) {
        let interval = alt.setInterval(() => {
            if (tabletReady) {
                alt.clearInterval(interval);
                tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:openCEFq8FqUh28kGTAELbX");
            }
        }, 0);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:setTabletHomeAppData", (array) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetInternetAppAppStoreContent", array);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetBankingAppContent", (bankArray, historyArray) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetBankingAppContent", bankArray, historyArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetEventsAppContent", (array) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetEventsAppEventEntrys", array);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:NotesAppAddNotesContent", (array) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:NotesAppAddNotesContent", array);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetVehiclesAppContent", (array) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetVehiclesAppContent", array);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetVehicleStoreAppContent", (array) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetVehicleStoreAppContent", array);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetCompanyAppContent", (companyId, infoArray, memberArray) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetCompanyAppContent", companyId, infoArray, memberArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetFactionManagerAppContent", (factionId, infoArray, memberArray, rankArray) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetFactionManagerAppContent", factionId, infoArray, memberArray, rankArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetFactionAppContent", (dutyMemberCount, vehicleArray) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetFactionAppContent", dutyMemberCount, vehicleArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetLSPDAppPersonSearchData", (charName, gender, birthdate, birthplace, address, job, mainBankAcc, firstJoinDate) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetLSPDAppPersonSearchData", charName, gender, birthdate, birthplace, address, job, mainBankAcc, firstJoinDate);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetLSPDAppSearchVehiclePlateData", (owner, name, manufactor, buydate, trunk, maxfuel, tax, fueltype) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetLSPDAppSearchVehiclePlateData", owner, name, manufactor, buydate, trunk, maxfuel, tax, fueltype);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetLSPDAppSearchPhoneNumData", (owner, numstatus) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetLSPDAppSearchPhoneNumData", owner, numstatus);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetLSPDAppLicenseSearchData", (charName, licArray) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetLSPDAppLicenseSearchData", charName, licArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetJusticeAppSearchedBankAccounts", (accountArray) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetJusticeAppSearchedBankAccounts", accountArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetJusticeAppBankTransactions", (array) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetJusticeAppBankTransactions", array);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:setPlayerOnlineData", (lspd_online, lsmd_online, lsts_online, agl_online, lsf_online) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:setPlayerOnlineData", lspd_online, lsmd_online, lsts_online, agl_online, lsf_online);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:setDispatches", (factionId, dispatchArray) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetDispatches", factionId, dispatchArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:setBoerse", (BoerseArray) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetBoerse", BoerseArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:SetTutorialAppContent", (array) => {
    if (tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:SetTutorialAppContent", array);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tablet:sendDispatchSound", (filePath) => {
    if(tabletBrowser != null) {
        tabletBrowser.emit("CEFq8FqUh28kGTAELbX:Tablet:playDispatchSound", filePath);
    }
})

alt.onServer('Clientq8FqUh28kGTAELbX:Tablet:closeCEFq8FqUh28kGTAELbX', () => {
    closeTabletCEF();
});

let openTabletCEF = function() {
    if (tabletBrowser == null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && alt.Player.local.getSyncedMeta("PLAYER_SPAWNED") == true) {
        alt.showCursor(true);
        alt.toggleGameControls(false);
        tabletBrowser = new alt.WebView("http://resource/client/cef/tablet/index.html");
        tabletBrowser.focus();
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:cefIsReady", () => {
            tabletReady = true;
            emitServer("Serverq8FqUh28kGTAELbX:Tablet:RequestTabletData");
        });

        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:AppStoreInstallUninstallApp", AppStoreInstallUninstallApp);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:BankingAppnewTransaction", BankingAppnewTransaction);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:EventsAppNewEntry", EventsAppNewEntry);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:NotesAppNewNote", NotesAppNewNote);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:NotesAppDeleteNote", NotesAppDeleteNote);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:LocateVehicle", LocateTabletVehicle);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:VehicleStoreBuyVehicle", VehicleStoreBuyVehicle);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:CompanyAppInviteNewMember", CompanyAppInviteNewMember);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:CompanyAppLeaveCompany", CompanyAppLeaveCompany);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:CompanyAppRankAction", CompanyAppRankAction);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:FactionManagerAppInviteNewMember", FactionManagerAppInviteNewMember);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:FactionManagerRankAction", FactionManagerRankAction);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:FactionManagerSetRankPaycheck", FactionManagerSetRankPaycheck);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppSearchPerson", LSPDAppSearchPerson);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppSearchVehiclePlate", LSPDAppSearchVehiclePlate);
		tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppSearchPhoneNum", LSPDAppSearchPhoneNum);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppSearchLicense", LSPDAppSearchLicense);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppTakeLicense", LSPDAppTakeLicense);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:JusticeAppGiveWeaponLicense", JusticeAppGiveWeaponLicense);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:JusticeAppSearchBankAccounts", JusticeAppSearchBankAccounts);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:JusticeAppViewBankTransactions", JusticeAppViewBankTransactions);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:sendDispatchToFaction", sendDispatchToFaction);
        tabletBrowser.on("Clientq8FqUh28kGTAELbX:Tablet:DeleteFactionDispatch", DeleteFactionDispatch);
    }
}

function DeleteFactionDispatch(factionId, senderId) {
    if (factionId <= 0 || senderId <= 0) return;
    if (!canInteract) return;
    lastInteract = Date.now();
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:DeleteFactionDispatch", parseInt(factionId), parseInt(senderId));
}

function AppStoreInstallUninstallApp(action, appname) {
    if (action != "install" && action != "uninstall") return;
    if (appname == "" || appname == "undefined") return;
    if (!canInteract) return;
    lastInteract = Date.now();
    let isInstalling = false;
    if (action == "install") { isInstalling = true; } else if (action == "uninstall") { isInstalling = false; }
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:AppStoreInstallUninstallApp", appname, isInstalling);
}

function BankingAppnewTransaction(targetBankNumber, transactiontext, moneyAmount) {
    if (!canInteract) return;
    lastInteract = Date.now();
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:BankingAppNewTransaction", parseInt(targetBankNumber), transactiontext, parseInt(moneyAmount));
}

function EventsAppNewEntry(title, callNumber, eventDate, Time, location, eventType, information) {
    if (!canInteract) return;
    lastInteract = Date.now();
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:EventsAppNewEntry", title, callNumber, eventDate, Time, location, eventType, information);
}

function NotesAppNewNote(title, text, color) {
    if (!canInteract) return;
    lastInteract = Date.now();
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:NotesAppNewNote", title, text, color);
}

function NotesAppDeleteNote(noteId) {
    if (!canInteract) return;
    lastInteract = Date.now();
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:NotesAppDeleteNote", parseInt(noteId));
}

function LocateTabletVehicle(x, y) {
    if (x == null || y == null || x == undefined || y == undefined) return;
    game.setNewWaypoint(x, y);
}

function VehicleStoreBuyVehicle(hash, shopId, color) {
    if (!canInteract) return;
    lastInteract = Date.now();
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:VehicleStoreBuyVehicle", hash, parseInt(shopId), color);
}

function CompanyAppInviteNewMember(charName, companyId) {
    if (!canInteract) return;
    lastInteract = Date.now();
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:CompanyAppInviteNewMember", charName, parseInt(companyId));
}

function CompanyAppLeaveCompany() {
    if (!canInteract) return;
    lastInteract = Date.now();
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:CompanyAppLeaveCompany");
}

function CompanyAppRankAction(rankId, charId) {
    if (charId <= 0 || charId == undefined || charId == null) return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:CompanyAppRankAction", parseInt(rankId), parseInt(charId));
}

function FactionManagerAppInviteNewMember(charName, dienstnummer, factionId) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (charName == "" || dienstnummer <= 0 || factionId <= 0 || dienstnummer == null || dienstnummer == undefined || factionId == undefined || factionId == null) return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:FactionManagerAppInviteNewMember", charName, parseInt(dienstnummer), parseInt(factionId));
}

function FactionManagerRankAction(action, charId) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (action != "rankup" && action != "rankdown" && action != "remove") return;
    if (charId <= 0 || charId == undefined) return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:FactionManagerRankAction", action, parseInt(charId));
}

function FactionManagerSetRankPaycheck(rankId, paycheck) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (rankId <= 0 || paycheck <= 0) return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:FactionManagerSetRankPaycheck", parseInt(rankId), parseInt(paycheck));
}

function LSPDAppSearchPerson(charName) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (charName.length <= 0 || charName == "") return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:LSPDAppSearchPerson", charName);
}

function LSPDAppSearchVehiclePlate(plate) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (plate.length <= 0 || plate == "") return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:LSPDAppSearchVehiclePlate", plate);
}

function LSPDAppSearchPhoneNum(num) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (num.length <= 0 || num == "") return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:LSPDAppSearchPhoneNum", num);
}

function LSPDAppSearchLicense(charName) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (charName.length <= 0 || charName == "") return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:LSPDAppSearchLicense", charName);
}

function LSPDAppTakeLicense(charName, lic) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (charName.length <= 0 || charName == "" || lic == "" || lic.length <= 0) return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:LSPDAppTakeLicense", charName, lic);
}

function JusticeAppGiveWeaponLicense(charName) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (charName.length <= 0) return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:JusticeAppGiveWeaponLicense", charName);
}

function JusticeAppSearchBankAccounts(charName) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (charName.length <= 0) return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:JusticeAppSearchBankAccounts", charName);
}

function JusticeAppViewBankTransactions(accNumber) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (accNumber.length <= 0) return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:JusticeAppViewBankTransactions", parseInt(accNumber));
}

function sendDispatchToFaction(factionId, msg) {
    if (!canInteract) return;
    lastInteract = Date.now();
    if (factionId <= 0 || msg == undefined || msg == "") return;
    emitServer("Serverq8FqUh28kGTAELbX:Tablet:sendDispatchToFaction", parseInt(factionId), msg);
}

export function closeTabletCEF() {
    if (tabletBrowser != null) {
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:AppStoreInstallUninstallApp", AppStoreInstallUninstallApp);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:BankingAppnewTransaction", BankingAppnewTransaction);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:EventsAppNewEntry", EventsAppNewEntry);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:NotesAppNewNote", NotesAppNewNote);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:NotesAppDeleteNote", NotesAppDeleteNote);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:LocateVehicle", LocateTabletVehicle);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:VehicleStoreBuyVehicle", VehicleStoreBuyVehicle);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:CompanyAppInviteNewMember", CompanyAppInviteNewMember);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:CompanyAppLeaveCompany", CompanyAppLeaveCompany);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:CompanyAppRankAction", CompanyAppRankAction);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:FactionManagerAppInviteNewMember", FactionManagerAppInviteNewMember);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:FactionManagerRankAction", FactionManagerRankAction);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:FactionManagerSetRankPaycheck", FactionManagerSetRankPaycheck);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppSearchPerson", LSPDAppSearchPerson);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppSearchVehiclePlate", LSPDAppSearchVehiclePlate);
		tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppSearchPhoneNum", LSPDAppSearchPhoneNum);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppSearchLicense", LSPDAppSearchLicense);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:LSPDAppTakeLicense", LSPDAppTakeLicense);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:JusticeAppGiveWeaponLicense", JusticeAppGiveWeaponLicense);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:JusticeAppSearchBankAccounts", JusticeAppSearchBankAccounts);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:JusticeAppViewBankTransactions", JusticeAppViewBankTransactions);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:sendDispatchToFaction", sendDispatchToFaction);
        tabletBrowser.off("Clientq8FqUh28kGTAELbX:Tablet:DeleteFactionDispatch", DeleteFactionDispatch);
        tabletBrowser.unfocus();
        tabletBrowser.destroy();
        tabletBrowser = null;
        alt.showCursor(false);
        alt.toggleGameControls(true);
    }

    tabletReady = false;
    game.clearPedTasks(alt.Player.local.scriptID);
    if (!tablet || tablet == null) return;
    alt.setTimeout(() => {
        game.detachEntity(tablet, true, false);
        game.deleteObject(tablet);
        tablet = null;
    }, 800);
}