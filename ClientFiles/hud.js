import * as alt from 'alt';
import * as native from "natives";
import * as game from 'natives';
import { Player, Vector3, LocalStorage } from "alt";
import { closeInventoryCEF } from './inventory.js';
import { closeTabletCEF } from './tablet.js';
import { Raycast, GetDirectionFromRotation, setClothes, setTattoo, clearTattoos, setCorrectTattoos } from './utilities.js';
import {emitServer} from './server.js';

const storage = LocalStorage.get();
export let hudBrowser = null;
export let browserReady = false;
let deathScreen = null;
let identityCardApplyCEFopened = false;
let BankAccountManageFormOpened = false;
let ATMcefOpened = false;
let ShopCefOpened = false;
let BarberCefOpened = false;
let GarageCefOpened = false;
let VehicleShopCefOpened = false;
let JobcenterCefOpened = false;
let FuelStationCefOpened = false;
let FuelStationMenuCefOpened = false;
let FuelStationBuyCefOpened = false;
let ClothesShopCefOpened = false;
let bankFactionATMCefOpened = false;
let GivePlayerBillCefOpened = false;
let FactionStorageCefOpened = false;
let RecievePlayerBillCefOpened = false;
let VehicleTrunkCefOpened = false;
let VehicleLicensingCefOpened = false;
let PlayerSearchInventoryCefOpened = false;
let GivePlayerLicenseCefOpened = false;
let MinijobPilotCefOpened = false;
let MinijobBusdriverCefOpened = false;
let HotelRentCefOpened = false;
let HouseEntranceCefOpened = false;
let DeathscreenCefOpened = false;
let HouseManageCefOpened = false;
let TownhallHouseSelectorCefOpened = false;
let AnimationMenuCefOpened = false;
let ClothesRadialCefOpened = false;
let TuningMenuCefOpened = false;
let ClothesStorageCefOpened = false;
let curSpeed = 0;
let curKm = 0;
let curTuningVeh = null;
let isPhoneEquipped = false;
let isPlayerDead = false;
let currentRadioFrequence = null;
let isTattooShopOpened = false;



alt.onServer("Clientq8FqUh28kGTAELbX:HUD:CreateCEFq8FqUh28kGTAELbX", (hunger, thirst, health, armor) => {
    if (hudBrowser == null) {
        hudBrowser = new alt.WebView("http://resource/client/cef/hud/index.html");

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HUD:cefIsReady", () => {
            alt.setTimeout(function() {
                hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:updateDesireHUD", hunger, thirst, health, armor);
                browserReady = true;
            }, 1000);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Farming:StartProcessing", (neededItem, producedItem, neededItemAmount, producedItemAmount, duration, neededItemTWO, neededItemTHREE, neededItemTWOAmount, neededItemTHREEAmount) => {
            emitServer("Serverq8FqUh28kGTAELbX:Farming:StartProcessing", neededItem, producedItem, neededItemAmount, producedItemAmount, duration, neededItemTWO, neededItemTHREE, neededItemTWOAmount, neededItemTHREEAmount);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Farming:closeCEFq8FqUh28kGTAELbX", () => {
            closeFarmingCEF();
        });
        

        alt.onServer("Clientq8FqUh28kGTAELbX:Farming:createCEFq8FqUh28kGTAELbX", (neededItem, producedItem, neededItemAmount, producedItemAmount, duration, neededItemTWO, neededItemTHREE, neededItemTWOAmount, neededItemTHREEAmount) => {
            if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && ShopCefOpened == false) {
                if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
                hudBrowser.emit("CEFq8FqUh28kGTAELbX:Farming:createCEFq8FqUh28kGTAELbX", neededItem, producedItem, neededItemAmount, producedItemAmount, duration, neededItemTWO, neededItemTHREE, neededItemTWOAmount, neededItemTHREEAmount);
                emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
                alt.showCursor(true);
                alt.toggleGameControls(false);
                hudBrowser.focus();
            }
        });

        // Saltychat Blockscreen
        alt.onServer("Clientq8FqUh28kGTAELbX:SaltychatBlockscreen:action", (action, type) => {
            if (action == "block") {
                alt.setTimeout(function() {
                    hudBrowser.emit("CEFq8FqUh28kGTAELbX:SaltychatBlockscreen:action", "block", type);
                    alt.toggleGameControls(false);
                    //alt.showCursor(true);
                }, 500);
            } else {
                alt.setTimeout(function() {
                    alt.toggleGameControls(true);
                    hudBrowser.emit("CEFq8FqUh28kGTAELbX:SaltychatBlockscreen:action", "none", type);
                  //  alt.showCursor(false);
                }, 1000);   
            }
        });

        alt.onServer("Clientq8FqUh28kGTAELbX:SaltychatBlockscreen:RestartGame", () => {
            native.restartGame();
        });

        //Tattoo Shop
        hudBrowser.on("Clientq8FqUh28kGTAELbX:TattooShop:closeShop", () => {
            isTattooShopOpened = false;
            alt.showCursor(false);
            alt.toggleGameControls(true);
            hudBrowser.unfocus();
            emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
            emitServer("Serverq8FqUh28kGTAELbX:ClothesShop:RequestCurrentSkin");
            clearTattoos(alt.Player.local.scriptID);
            setCorrectTattoos();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:TattooShop:buyTattoo", (shopId, tattooId) => {
            alt.log("BUY TATTOO")
            emitServer("Serverq8FqUh28kGTAELbX:TattooShop:buyTattoo", parseInt(shopId), parseInt(tattooId));
            alt.log("BUY TATTOO2")
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:TattooShop:deleteTattoo", (id) => {
            emitServer("Serverq8FqUh28kGTAELbX:TattooShop:deleteTattoo", parseInt(id));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:TattooShop:previewTattoo", (hash, collection) => {
            alt.log("BUY PREVIEW")
            clearTattoos(alt.Player.local.scriptID);
            alt.log("BUY PREVIEW 2")
            setTattoo(alt.Player.local.scriptID, collection, hash);
            alt.log("BUY PREVIEW 3")
        });

        //Rotation HUD
        hudBrowser.on("Clientq8FqUh28kGTAELbX:Utilities:setRotation", (rotZ) => {
            game.setEntityRotation(alt.Player.local.scriptID, game.getEntityPitch(alt.Player.local.scriptID), game.getEntityRoll(alt.Player.local.scriptID), rotZ, 2, true);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HUD:sendIdentityCardApplyForm", (birthplace) => {
            emitServer("Serverq8FqUh28kGTAELbX:HUD:sendIdentityCardApplyForm", birthplace);
            emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
            game.freezeEntityPosition(game.playerPedId(), false);
            alt.showCursor(false);
            alt.toggleGameControls(true);
            hudBrowser.unfocus();
            identityCardApplyCEFopened = false;
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Bank:BankAccountdestroyCEFq8FqUh28kGTAELbX", () => {
            closeBankCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Bank:BankAccountCreateNewAccount", (selectedBank) => {
            emitServer("Serverq8FqUh28kGTAELbX:Bank:CreateNewBankAccount", selectedBank);
            closeBankCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Bank:BankAccountAction", (action, accountNumber) => {
            emitServer("Serverq8FqUh28kGTAELbX:Bank:BankAccountAction", action, accountNumber);
            closeBankCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ATM:requestBankData", (accountNr) => {
            emitServer("Serverq8FqUh28kGTAELbX:ATM:requestBankData", accountNr);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ATM:WithdrawMoney", (accountNr, amount, zoneName) => {
            emitServer("Serverq8FqUh28kGTAELbX:ATM:WithdrawMoney", accountNr, parseInt(amount), zoneName);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ATM:DepositMoney", (accountNr, amount, zoneName) => {
            emitServer("Serverq8FqUh28kGTAELbX:ATM:DepositMoney", accountNr, parseInt(amount), zoneName);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ATM:TransferMoney", (accountNr, targetNr, amount, zoneName) => {
            emitServer("Serverq8FqUh28kGTAELbX:ATM:TransferMoney", accountNr, parseInt(targetNr), parseInt(amount), zoneName);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ATM:TryPin", (action, curATMAccountNumber) => {
            emitServer("Serverq8FqUh28kGTAELbX:ATM:TryPin", action, curATMAccountNumber);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ATM:BankATMdestroyCEFq8FqUh28kGTAELbX", () => {
            closeATMCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Shop:buyItem", (shopId, amount, itemname) => {
            emitServer("Serverq8FqUh28kGTAELbX:Shop:buyItem", parseInt(shopId), parseInt(amount), itemname);
        });
		
        hudBrowser.on("Clientq8FqUh28kGTAELbX:GangWarArea:Attack", (gangID) => {
            emitServer("Serverq8FqUh28kGTAELbX:GangWar:StartWar", parseInt(gangID));
        });

	
		hudBrowser.on("Clientq8FqUh28kGTAELbX:Shop:buyItemLockSmith", (shopId, amount, itemname) => {
            emitServer("Serverq8FqUh28kGTAELbX:Shop:buyItemLockSmith", parseInt(shopId), parseInt(amount), itemname);
        });
		
		hudBrowser.on("Clientq8FqUh28kGTAELbX:Shop:TakeGoldbarren", () => {
            emitServer("Serverq8FqUh28kGTAELbX:Shop:TakeGoldbarren");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Shop:sellItem", (shopId, amount, itemname) => {
            emitServer("Serverq8FqUh28kGTAELbX:Shop:sellItem", parseInt(shopId), parseInt(amount), itemname);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Barber:UpdateHeadOverlays", (headoverlayarray) => {
            let headoverlays = JSON.parse(headoverlayarray);
            game.setPedHeadOverlayColor(alt.Player.local.scriptID, 1, 1, parseInt(headoverlays[2][1]), 1);
            game.setPedHeadOverlayColor(alt.Player.local.scriptID, 2, 1, parseInt(headoverlays[2][2]), 1);
            game.setPedHeadOverlayColor(alt.Player.local.scriptID, 5, 2, parseInt(headoverlays[2][5]), 1);
            game.setPedHeadOverlayColor(alt.Player.local.scriptID, 8, 2, parseInt(headoverlays[2][8]), 1);
            game.setPedHeadOverlayColor(alt.Player.local.scriptID, 10, 1, parseInt(headoverlays[2][10]), 1);
            game.setPedEyeColor(alt.Player.local.scriptID, parseInt(headoverlays[0][14]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 0, parseInt(headoverlays[0][0]), parseInt(headoverlays[1][0]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 1, parseInt(headoverlays[0][1]), parseFloat(headoverlays[1][1]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 2, parseInt(headoverlays[0][2]), parseFloat(headoverlays[1][2]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 3, parseInt(headoverlays[0][3]), parseInt(headoverlays[1][3]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 4, parseInt(headoverlays[0][4]), parseInt(headoverlays[1][4]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 5, parseInt(headoverlays[0][5]), parseInt(headoverlays[1][5]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 6, parseInt(headoverlays[0][6]), parseInt(headoverlays[1][6]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 7, parseInt(headoverlays[0][7]), parseInt(headoverlays[1][7]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 8, parseInt(headoverlays[0][8]), parseInt(headoverlays[1][8]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 9, parseInt(headoverlays[0][9]), parseInt(headoverlays[1][9]));
            game.setPedHeadOverlay(alt.Player.local.scriptID, 10, parseInt(headoverlays[0][10]), parseInt(headoverlays[1][10]));
            game.setPedComponentVariation(alt.Player.local.scriptID, 2, parseInt(headoverlays[0][13]), 0, 0);
            game.setPedHairColor(alt.Player.local.scriptID, parseInt(headoverlays[2][13]), parseInt(headoverlays[1][13]));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Barber:finishBarber", (headoverlayarray) => {
            emitServer("Serverq8FqUh28kGTAELbX:Barber:finishBarber", headoverlayarray);
            closeBarberCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Barber:RequestCurrentSkin", () => {
            emitServer("Serverq8FqUh28kGTAELbX:Barber:RequestCurrentSkin");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Barber:destroyBarberCEFq8FqUh28kGTAELbX", () => {
            closeBarberCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Shop:destroyShopCEFq8FqUh28kGTAELbX", () => {
            closeShopCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:KeyShop:destroyShopCEFq8FqUh28kGTAELbX", () => {
            closeKeyShopCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Garage:destroyGarageCEFq8FqUh28kGTAELbX", () => {
            closeGarageCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:joinRadioFrequence", (currentRadioFrequence) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:joinRadioFrequence", `${currentRadioFrequence}`);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:leaveRadioFrequence", () => {
            if (currentRadioFrequence == null) return;
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:leaveRadioFrequence");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:VehicleShop:destroyVehicleShopCEFq8FqUh28kGTAELbX", () => {
            closeVehicleShopCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:VehicleShop:BuyVehicle", (shopId, hash) => {
            emitServer("Serverq8FqUh28kGTAELbX:VehicleShop:BuyVehicle", parseInt(shopId), hash);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Garage:DoAction", (garageid, action, vehid) => {
            emitServer("Serverq8FqUh28kGTAELbX:Garage:DoAction", parseInt(garageid), action, parseInt(vehid));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Jobcenter:SelectJob", (jobName) => {
            emitServer("Serverq8FqUh28kGTAELbX:Jobcenter:SelectJob", jobName);
            closeJobcenterCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Jobcenter:destroyCEFq8FqUh28kGTAELbX", () => {
            closeJobcenterCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FuelStation:FuelVehicleAction", (vehID, fuelStationId, fueltype, selectedLiterAmount, selectedLiterPrice) => {
            emitServer("Serverq8FqUh28kGTAELbX:FuelStation:FuelVehicleAction", parseInt(vehID), parseInt(fuelStationId), fueltype, parseInt(selectedLiterAmount), parseInt(selectedLiterPrice));
            290	
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Fuelstation:destroyFuelStationMenuCEFq8FqUh28kGTAELbX", () => {	
            closeFuelstationMenuCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Fuelstation:destroyFuelStationBuyCEFq8FqUh28kGTAELbX", () => {
            closeFuelstationBuyCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FuelStation:buyFuelStation", (fuelStationId) => {
            emitServer("Serverq8FqUh28kGTAELbX:FuelStation:buyFuel", fuelStationId);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FuelStation:sellFuelStation", (fuelStationId) => {
            emitServer("Serverq8FqUh28kGTAELbX:FuelStation:sellFuel", fuelStationId);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FuelStation:setFuel", (fuelStationId, type, value) => {
            emitServer("Serverq8FqUh28kGTAELbX:FuelStation:setFuel", fuelStationId, type, value);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FuelStation:destroyCEFq8FqUh28kGTAELbX", () => {
            closeFuelstationCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ClothesShop:setClothes", (componentId, drawableId, textureId) => {
            game.setPedComponentVariation(alt.Player.local.scriptID, parseInt(componentId), parseInt(drawableId), parseInt(textureId), 0);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ClothesShop:setAccessory", (componentId, drawableId, textureId) => {
            game.setPedPropIndex(alt.Player.local.scriptID, componentId, drawableId, textureId, false);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ClothesShop:RequestCurrentSkin", () => {
            emitServer("Serverq8FqUh28kGTAELbX:ClothesShop:RequestCurrentSkin");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ClothesShop:destroyCEFq8FqUh28kGTAELbX", () => {
            closeClothesShopCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ClothesStorage:destroyCEFq8FqUh28kGTAELbX", () => {
            closeClothesStorageCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ClothesShop:buyItem", (shopId, itemName) => {
            emitServer("Serverq8FqUh28kGTAELbX:ClothesShop:buyItem", parseInt(shopId), parseInt(1), itemName);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:InteractionMenu:giveRequestedAction", (type, action) => {
            InterActionMenuDoAction(type, action);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:AnimationMenu:giveRequestedAction", (action) => {
            InterActionMenuDoActionAnimationMenu(action);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:AnimationMenuPage2:giveRequestedAction", (action) => {
            InterActionMenuDoActionAnimationMenuPage2(action);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:AnimationMenuPage3:giveRequestedAction", (action) => {
            InterActionMenuDoActionAnimationMenuPage3(action);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ClothesRadial:giveRequestedAction", (action) => {
            InterActionMenuDoActionClothesRadialMenu(action);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FactionBank:destroyCEFq8FqUh28kGTAELbX", () => {
            closeBankFactionATMCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FactionBank:DepositMoney", (type, factionId, amount) => {
            emitServer("Serverq8FqUh28kGTAELbX:FactionBank:DepositMoney", type, parseInt(factionId), parseInt(amount));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FactionBank:WithdrawMoney", (type, factionId, amount) => {
            emitServer("Serverq8FqUh28kGTAELbX:FactionBank:WithdrawMoney", type, parseInt(factionId), parseInt(amount));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:GivePlayerBill:giveBill", (type, targetCharId, reason, moneyamount) => {
            emitServer("Serverq8FqUh28kGTAELbX:PlayerBill:giveBill", type, reason, parseInt(targetCharId), parseInt(moneyamount));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:GivePlayerBill:destroyCEFq8FqUh28kGTAELbX", () => {
            closeGivePlayerBillCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:PlayerBill:BillAction", (action, billType, factionCompanyId, moneyAmount, reason, charId) => {
            emitServer("Serverq8FqUh28kGTAELbX:PlayerBill:BillAction", action, billType, parseInt(factionCompanyId), parseInt(moneyAmount), reason, parseInt(charId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:RecievePlayerBill:destroyCEFq8FqUh28kGTAELbX", () => {
            closeRecievePlayerBillCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FactionStorage:destroyCEFq8FqUh28kGTAELbX", () => {
            closeFactionStorageCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:FactionStorage:FactionStorageAction", (action, factionId, charId, type, itemName, amount, fromContainer) => {
            if (action == "storage") {
                if (type == "faction") {
                    emitServer("Serverq8FqUh28kGTAELbX:FactionStorage:StorageItem", parseInt(factionId), parseInt(charId), itemName, parseInt(amount), fromContainer);
                } else if (type == "hotel") {
                    emitServer("Serverq8FqUh28kGTAELbX:HotelStorage:StorageItem", parseInt(factionId), itemName, parseInt(amount), fromContainer);
                } else if (type == "house") {
                    emitServer("Serverq8FqUh28kGTAELbX:HouseStorage:StorageItem", parseInt(factionId), itemName, parseInt(amount), fromContainer);
                } else if (type == "factionweapon") {
                    emitServer("Serverq8FqUh28kGTAELbX:FactionStorage:StorageAllItem", parseInt(factionId), parseInt(charId), itemName, parseInt(amount), fromContainer);
                }
            } else if (action == "take") {
                if (type == "faction") {
                    emitServer("Serverq8FqUh28kGTAELbX:FactionStorage:TakeItem", parseInt(factionId), parseInt(charId), itemName, parseInt(amount));
                } else if (type == "hotel") {
                    emitServer("Serverq8FqUh28kGTAELbX:HotelStorage:TakeItem", parseInt(factionId), itemName, parseInt(amount));
                } else if (type == "house") {
                    emitServer("Serverq8FqUh28kGTAELbX:HouseStorage:TakeItem", parseInt(factionId), itemName, parseInt(amount));
                } else if (type == "factionweapon") {
                    emitServer("Serverq8FqUh28kGTAELbX:FactionStorage:TakeAllItem",  parseInt(factionId), parseInt(charId), itemName, parseInt(amount));
                }
            }
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:VehicleTrunk:destroyCEFq8FqUh28kGTAELbX", () => {
            closeVehicleTrunkCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:VehicleTrunk:VehicleTrunkAction", (action, vehId, charId, itemName, itemAmount, fromContainer, type) => {
            if (action == "storage") {
                emitServer("Serverq8FqUh28kGTAELbX:VehicleTrunk:StorageItem", parseInt(vehId), parseInt(charId), itemName, parseInt(itemAmount), fromContainer, type);
            } else if (action == "take") {
                emitServer("Serverq8FqUh28kGTAELbX:VehicleTrunk:TakeItem", parseInt(vehId), parseInt(charId), itemName, parseInt(itemAmount), type);
            }
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:VehicleLicensing:LicensingAction", (action, vehId, vehPlate, newPlate) => {
            emitServer("Serverq8FqUh28kGTAELbX:VehicleLicensing:LicensingAction", action, parseInt(vehId), vehPlate, newPlate);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:VehicleLicensing:destroyCEFq8FqUh28kGTAELbX", () => {
            closeVehicleLicensingCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:PlayerSearch:TakeItem", (targetCharId, itemName, itemLocation, itemAmount) => {
            emitServer("Serverq8FqUh28kGTAELbX:PlayerSearch:TakeItem", parseInt(targetCharId), itemName, itemLocation, parseInt(itemAmount));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:PlayerSearch:destroyCEFq8FqUh28kGTAELbX", () => {
            closePlayerSearchCEF();
        });
        hudBrowser.on("Clientq8FqUh28kGTAELbX:GivePlayerLicense:destroyCEFq8FqUh28kGTAELbX", () => {
            closeGivePlayerLicenseCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:GivePlayerLicense:GiveLicense", (targetCharId, licname) => {
            emitServer("Serverq8FqUh28kGTAELbX:GivePlayerLicense:GiveLicense", parseInt(targetCharId), licname);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:MinijobPilot:SelectJob", (level) => {
            emitServer("Serverq8FqUh28kGTAELbX:MinijobPilot:StartJob", parseInt(level));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:MinijobPilot:destroyCEFq8FqUh28kGTAELbX", () => {
            closeMinijobPilotCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:MinijobBusdriver:StartJob", (routeId) => {
            emitServer("Serverq8FqUh28kGTAELbX:MinijobBusdriver:StartJob", parseInt(routeId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:MinijobBusdriver:destroyCEFq8FqUh28kGTAELbX", () => {
            closeMinijobBusdriverCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Hotel:destroyCEFq8FqUh28kGTAELbX", () => {
            closeHotelRentCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Hotel:RentHotel", (hotelId, apartmentId) => {
            emitServer("Serverq8FqUh28kGTAELbX:Hotel:RentHotel", parseInt(hotelId), parseInt(apartmentId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Hotel:LockHotel", (hotelId, apartmentId) => {
            emitServer("Serverq8FqUh28kGTAELbX:Hotel:LockHotel", parseInt(hotelId), parseInt(apartmentId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Hotel:EnterHotel", (hotelId, apartmentId) => {
            emitServer("Serverq8FqUh28kGTAELbX:Hotel:EnterHotel", parseInt(hotelId), parseInt(apartmentId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseEntrance:destroyCEFq8FqUh28kGTAELbX", () => {
            closeHouseEntranceCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Shop:robShop", (shopId) => {
            emitServer("Serverq8FqUh28kGTAELbX:Shop:robShop", parseInt(shopId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseEntrance:BuyHouse", (houseId) => {
            emitServer("Serverq8FqUh28kGTAELbX:House:BuyHouse", parseInt(houseId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseEntrance:EnterHouse", (houseId) => {
            emitServer("Serverq8FqUh28kGTAELbX:House:EnterHouse", parseInt(houseId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseEntrance:RentHouse", (houseId) => {
            emitServer("Serverq8FqUh28kGTAELbX:House:RentHouse", parseInt(houseId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseEntrance:UnrentHouse", (houseId) => {
            emitServer("Serverq8FqUh28kGTAELbX:House:UnrentHouse", parseInt(houseId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:House:SellHouse", (houseId) => {
            emitServer("Serverq8FqUh28kGTAELbX:House:SellHouse", parseInt(houseId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:House:setMainHouse", (houseId) => {
            emitServer("Serverq8FqUh28kGTAELbX:House:setMainHouse", parseInt(houseId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseManage:destroyCEFq8FqUh28kGTAELbX", () => {
            closeHouseManageCEF();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseManage:setRentPrice", (houseId, rentPrice) => {
            emitServer("Serverq8FqUh28kGTAELbX:HouseManage:setRentPrice", parseInt(houseId), parseInt(rentPrice));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseManage:setRentState", (houseId, rentState) => {
            emitServer("Serverq8FqUh28kGTAELbX:HouseManage:setRentState", parseInt(houseId), `${rentState}`);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseManage:RemoveRenter", (houseId, renterId) => {
            emitServer("Serverq8FqUh28kGTAELbX:HouseManage:RemoveRenter", parseInt(houseId), parseInt(renterId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseManage:BuyUpgrade", (houseId, upgrade) => {
            emitServer("Serverq8FqUh28kGTAELbX:HouseManage:BuyUpgrade", parseInt(houseId), upgrade);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:HouseManage:TresorAction", (houseId, action, money) => {
            if (action == "withdraw") {
                emitServer("Serverq8FqUh28kGTAELbX:HouseManage:WithdrawMoney", parseInt(houseId), parseInt(money));
            } else if (action == "deposit") {
                emitServer("Serverq8FqUh28kGTAELbX:HouseManage:DepositMoney", parseInt(houseId), parseInt(money));
            }
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Townhall:destroyHouseSelector", () => {
            destroyTownHallHouseSelector();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Animation:SaveAnimationHotkey", (hotkey, animId, animName, animDict, animFlag, animDuration) => {
            if (hotkey == undefined || animId <= 0) return;
            if (hotkey != "Num1" && hotkey != "Num2" && hotkey != "Num3" && hotkey != "Num4" && hotkey != "Num5" && hotkey != "Num6" && hotkey != "Num7" && hotkey != "Num8" && hotkey != "Num9") {
                alt.emit("Clientq8FqUh28kGTAELbX:HUD:sendNotification", 4, 3500, "Der Inhalt des Hotkeys darf nur aus Num1 bis Num9 bestehen.");
                return;
            }
            storage.set(`${hotkey}Hotkey`, parseInt(animId));
            storage.set(`${hotkey}AnimName`, animName);
            storage.set(`${hotkey}AnimDict`, animDict);
            storage.set(`${hotkey}AnimFlag`, animFlag);
            storage.set(`${hotkey}AnimDuration`, animDuration);
            storage.save();
            alt.emit("Clientq8FqUh28kGTAELbX:HUD:sendNotification", 2, 2500, `Hotkey ${hotkey} erfolgreich belegt - AnimationsID: ${animId}.`);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Animation:DeleteAnimationHotkey", (hotkey) => {
            if (hotkey == undefined) return;
            if (hotkey != "Num1" && hotkey != "Num2" && hotkey != "Num3" && hotkey != "Num4" && hotkey != "Num5" && hotkey != "Num6" && hotkey != "Num7" && hotkey != "Num8" && hotkey != "Num9") {
                alt.emit("Clientq8FqUh28kGTAELbX:HUD:sendNotification", 4, 3500, "Der Inhalt des Hotkeys darf nur aus Num1 bis Num9 bestehen.");
                return;
            }
            storage.delete(`${hotkey}Hotkey`);
            storage.delete(`${hotkey}AnimName`);
            storage.delete(`${hotkey}AnimDict`);
            storage.delete(`${hotkey}AnimFlag`);
            storage.delete(`${hotkey}AnimDuration`);
            alt.emit("Clientq8FqUh28kGTAELbX:HUD:sendNotification", 2, 2500, `Hotkey ${hotkey} erfolgreich entfernt.`);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Animation:playAnimation", (animDict, animName, animFlag, animDuration) => {
            playAnimation(animDict, animName, animFlag, animDuration);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Animations:hideAnimationMenu", () => {
            destroyAnimationMenu();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Animations:hideClothesRadialMenu", () => {
            destroyClothesRadialMenu();
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Tuning:switchTuningColor", (type, action, r, g, b) => {
            if (curTuningVeh == null) return;
            emitServer("Serverq8FqUh28kGTAELbX:Tuning:switchTuningColor", curTuningVeh, type, action, parseInt(r), parseInt(g), parseInt(b));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Tuning:switchTuning", (type, id, action) => {
            if (curTuningVeh == null) return;
            emitServer("Serverq8FqUh28kGTAELbX:Tuning:switchTuning", curTuningVeh, type, parseInt(id), action);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Tuning:closeCEFq8FqUh28kGTAELbX", () => {
            closeTuningCEF();
        });

        /* Smartphone */
        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:tryCall", (number) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:tryCall", parseInt(number));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:denyCall", () => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:denyCall");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:acceptCall", () => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:acceptCall");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:requestChats", () => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:requestChats");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:requestChatMessages", (chatId) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:requestChatMessages", parseInt(chatId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:createNewChat", (targetNumber) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:createNewChat", parseInt(targetNumber));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:sendChatMessage", (selectedChatId, userPhoneNumber, targetMessageUser, unix, encodedText) => {
            if (selectedChatId <= 0 || userPhoneNumber <= 0 || targetMessageUser <= 0) return;
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:sendChatMessage", parseInt(selectedChatId), parseInt(userPhoneNumber), parseInt(targetMessageUser), parseInt(unix), encodedText);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:deleteChat", (chatId) => {
            if (chatId <= 0) return;
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:deleteChat", parseInt(chatId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:setFlyModeEnabled", (isEnabled) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:setFlyModeEnabled", isEnabled);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:requestPhoneContacts", () => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:requestPhoneContacts");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:deleteContact", (contactId) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:deleteContact", parseInt(contactId));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:addNewContact", (name, number) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:addNewContact", name, parseInt(number));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:editContact", (id, name, number) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:editContact", parseInt(id), name, parseInt(number));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:ClothesStorage:setCharacterClothes", (clothesName, clothesTyp) => {
            if (clothesName == undefined || clothesTyp == undefined) return;
            emitServer("Serverq8FqUh28kGTAELbX:ClothesStorage:setCharacterClothes", clothesTyp, clothesName);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:SearchLSPDIntranetPeople", (name) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:SearchLSPDIntranetPeople", name);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:GiveLSPDIntranetWanteds", (selectedCharId, wantedList) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:GiveLSPDIntranetWanteds", parseInt(selectedCharId), wantedList);
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:requestLSPDIntranetPersonWanteds", (charid) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:requestLSPDIntranetPersonWanteds", parseInt(charid));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:DeleteLSPDIntranetWanted", (id, charid) => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:DeleteLSPDIntranetWanted", parseInt(id), parseInt(charid));
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:requestPoliceAppMostWanteds", () => {
            emitServer("Serverq8FqUh28kGTAELbX:Smartphone:requestPoliceAppMostWanteds");
        });

        hudBrowser.on("Clientq8FqUh28kGTAELbX:Smartphone:locateMostWanted", (X, Y) => {
            game.setNewWaypoint(parseFloat(X), parseFloat(Y));
        });
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:setCurrentFunkFrequence", (funkfrequence) => {
    if (funkfrequence == null || funkfrequence == "null") {
        currentRadioFrequence = null;
        return;
    }
    currentRadioFrequence = funkfrequence;
});

alt.onServer("Clientq8FqUh28kGTAELbX:HUD:UpdateDesire", (hunger, thirst, health, armor) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:updateDesireHUD", hunger, thirst, health, armor);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:HUD:updateHUDPosInVeh", (state, fuel, km) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:updateHUDPosInVeh", state, fuel, km);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:HUD:sendNotification", (type, duration, msg, delay) => {
    alt.setTimeout(() => {
        if (hudBrowser != null) {
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:sendNotification", type, duration, msg);
        }
    }, delay);
});

alt.on("Clientq8FqUh28kGTAELbX:HUD:sendNotification", (type, duration, msg) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:sendNotification", type, duration, msg);
    }
});

alt.on("Clientq8FqUh28kGTAELbX:SaltyChat:MicStateChanged", (state, voiceRange) => {
    if (hudBrowser == null || !browserReady) return;
    if (state) hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:updateHUDVoice", 0);
    else hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:updateHUDVoice", voiceRange);
});

alt.on("client:SaltyChat_IsTalking", (status) => {
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:UpdateTalking", status);
});

alt.onServer("Clientq8FqUh28kGTAELbX::updateVoiceRange", (voiceRange) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:updateHUDVoice", voiceRange);
});

alt.onServer("Clientq8FqUh28kGTAELbX:HUD:createIdentityCardApplyForm", (charname, gender, adress, birthdate, curBirthpl) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && curBirthpl == "None" && identityCardApplyCEFopened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:createIdentityCardApplyForm", charname, gender, adress, birthdate);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        identityCardApplyCEFopened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:IdentityCard:showIdentityCard", (type, infoArray) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:IdentityCard:showIdentityCard", type, infoArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:IdentityCard:showLicenseCard", (type, infoArray) => {
    var infoArray1 = JSON.parse(infoArray);
    alt.log(infoArray1)
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:IdentityCard:showLicenseCard", type, infoArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Bank:createBankAccountManageForm", (bankArray, curBank) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && BankAccountManageFormOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Bank:createBankAccountManageForm", bankArray, curBank);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        BankAccountManageFormOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:ATM:BankATMcreateCEFq8FqUh28kGTAELbX", (pin, accNumber, zoneName) => {
    emitServer("Serverq8FqUh28kGTAELbX:Inventory:closeCEFq8FqUh28kGTAELbX");
    alt.setTimeout(function() {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ATM:BankATMcreateCEFq8FqUh28kGTAELbX", pin, accNumber, zoneName);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        ATMcefOpened = true;
    }, 500);
});

alt.onServer("Clientq8FqUh28kGTAELbX:ATM:BankATMSetRequestedData", (curBalance, paperArray) => {
    if (hudBrowser != null && ATMcefOpened == true) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ATM:BankATMSetRequestedData", curBalance, paperArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:ATM:BankATMdestroyCEFBrowser", () => {
    if (hudBrowser != null && ATMcefOpened == true) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ATM:BankATMdestroyCEFq8FqUh28kGTAELbX");
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Shop:shopCEFCreateCEFq8FqUh28kGTAELbX", (itemArray, shopId, isOnlySelling) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && ShopCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Shop:shopCEFBoxCreateCEFq8FqUh28kGTAELbX", itemArray, shopId, isOnlySelling);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        ShopCefOpened = true;
    }
});


alt.onServer("Clientq8FqUh28kGTAELbX:Fuelstation:fuelStationCEFCreateCEFq8FqUh28kGTAELbX", (infos) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && FuelStationMenuCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        var array = JSON.parse(infos);
        if(!array.buyed) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Fuelstation:fuelStationCEFCreateCEFq8FqUh28kGTAELbX", array);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        FuelStationMenuCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Fuelstation:fuelStationBuyCEFCreateCEFq8FqUh28kGTAELbX", (infos) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && FuelStationBuyCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        var array = JSON.parse(infos);
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Fuelstation:fuelStationBuyCEFCreateCEFq8FqUh28kGTAELbX", array);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        FuelStationBuyCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Shop:shopCEFCreateCEFq8FqUh28kGTAELbXLockSmith", (itemArray, shopId, isOnlySelling) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && ShopCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Shop:shopCEFBoxCreateCEFq8FqUh28kGTAELbXLockSmith", itemArray, shopId, isOnlySelling);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        ShopCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Shop:shopCEFCreateCEFq8FqUh28kGTAELbXGangWars", (itemArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && ShopCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Shop:shopCEFBoxCreateCEFq8FqUh28kGTAELbXGangWars", itemArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        ShopCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Shop:shopCEFCreateCEFq8FqUh28kGTAELbXPacificBankRob", (goldBarenAnz) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && ShopCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Shop:shopCEFBoxCreateCEFq8FqUh28kGTAELbXPacificBankRob", goldBarenAnz);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        ShopCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Barber:barberCreateCEFq8FqUh28kGTAELbX", (headoverlayarray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && BarberCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Barber:barberCEFBoxCreateCEFq8FqUh28kGTAELbX", headoverlayarray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        BarberCefOpened = true;

        let barberInterval = alt.setInterval(() => {
            game.invalidateIdleCam();
            if (BarberCefOpened === false) {
                alt.clearInterval(barberInterval);
            }
        }, 5000);
    }
});


alt.onServer("Clientq8FqUh28kGTAELbX:Garage:OpenGarage", (garageId, garagename, garageInArray, garageOutArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && GarageCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Garage:OpenGarage", garageId, garagename, garageInArray, garageOutArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        GarageCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:VehicleShop:OpenCEFq8FqUh28kGTAELbX", (shopId, shopname, itemArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && VehicleShopCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:VehicleShop:SetListContent", shopId, shopname, itemArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        VehicleShopCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Jobcenter:OpenCEFq8FqUh28kGTAELbX", (jobArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && JobcenterCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Jobcenter:OpenCEFq8FqUh28kGTAELbX", jobArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        JobcenterCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:FuelStation:OpenCEFq8FqUh28kGTAELbX", (fuelStationId, stationName, owner, maxFuel, availableLiter, fuelArray, vehID) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && FuelStationCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:FuelStation:OpenCEFq8FqUh28kGTAELbX", fuelStationId, stationName, owner, maxFuel, availableLiter, fuelArray, vehID);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        FuelStationCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:ClothesShop:createCEFq8FqUh28kGTAELbX", (shopId) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && ClothesShopCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ClothesShop:createCEFq8FqUh28kGTAELbX", shopId);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        ClothesShopCefOpened = true;
        let shopInterval = alt.setInterval(() => {
            game.invalidateIdleCam();
            if (ClothesShopCefOpened === false) {
                alt.clearInterval(shopInterval);
            }
        }, 5000);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:ClothesStorage:createCEFq8FqUh28kGTAELbX", () => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && ClothesStorageCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ClothesStorage:createCEFq8FqUh28kGTAELbX");
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        ClothesStorageCefOpened = true;
        let shopInterval = alt.setInterval(() => {
            game.invalidateIdleCam();
            if (ClothesStorageCefOpened === false) {
                alt.clearInterval(shopInterval);
            }
        }, 5000);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:ClothesShop:sendItemsToClient", (items) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ClothesShop:sendItemsToClient", items);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:ClothesStorage:sendItemsToClient", (items) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ClothesStorage:sendItemsToClient", items);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:FactionBank:createCEFq8FqUh28kGTAELbX", (type, factionId, factionBalance) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && bankFactionATMCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:FactionBank:createCEFq8FqUh28kGTAELbX", type, factionId, factionBalance);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        bankFactionATMCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:GivePlayerBill:openCEFq8FqUh28kGTAELbX", (type, targetCharId) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && GivePlayerBillCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:GivePlayerBill:openCEFq8FqUh28kGTAELbX", type, targetCharId);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        GivePlayerBillCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:RecievePlayerBill:openCEFq8FqUh28kGTAELbX", (type, factionCompanyId, moneyAmount, reason, factionCompanyName, charId) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && RecievePlayerBillCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:RecievePlayerBill:openCEFq8FqUh28kGTAELbX", type, factionCompanyId, moneyAmount, reason, factionCompanyName, charId);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        RecievePlayerBillCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:FactionStorage:openCEFq8FqUh28kGTAELbX", (charId, factionId, type, invArray, storageArray) => { //
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && FactionStorageCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        alt.log("storageOpenClientside");
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:FactionStorage:openCEFq8FqUh28kGTAELbX", charId, factionId, type, invArray, storageArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        FactionStorageCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:VehicleTrunk:openCEFq8FqUh28kGTAELbX", (charId, vehID, type, invArray, storageArray,  currentweight, maxweight) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && VehicleTrunkCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:VehicleTrunk:openCEFq8FqUh28kGTAELbX", charId, vehID, type, invArray, storageArray, currentweight, maxweight);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        VehicleTrunkCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:VehicleLicensing:openCEFq8FqUh28kGTAELbX", (vehArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && VehicleLicensingCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:VehicleLicensing:openCEFq8FqUh28kGTAELbX", vehArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        VehicleLicensingCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:PlayerSearch:openCEFq8FqUh28kGTAELbX", (targetCharId, invArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && PlayerSearchInventoryCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:PlayerSearch:openCEFq8FqUh28kGTAELbX", targetCharId, invArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        PlayerSearchInventoryCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:GivePlayerLicense:openCEFq8FqUh28kGTAELbX", (targetCharId, licArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && GivePlayerLicenseCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:GivePlayerLicense:SetGivePlayerLicenseCEFContent", targetCharId, licArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        GivePlayerLicenseCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:MinijobPilot:openCEFq8FqUh28kGTAELbX", () => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && MinijobPilotCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:MinijobPilot:openCEFq8FqUh28kGTAELbX");
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        MinijobPilotCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:MinijobBusdriver:openCEFq8FqUh28kGTAELbX", (routeArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && MinijobBusdriverCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:MinijobBusdriver:openCEFq8FqUh28kGTAELbX", routeArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        MinijobBusdriverCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:HouseManage:openCEFq8FqUh28kGTAELbX", (houseInfoArray, renterArray) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && HouseManageCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:HouseManage:openCEFq8FqUh28kGTAELbX", houseInfoArray, renterArray);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        HouseManageCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Hotel:setApartmentItems", (array) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Hotel:setApartmentItems", array);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Hotel:openCEFq8FqUh28kGTAELbX", (hotelname) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && HotelRentCefOpened == false) {
        HotelRentCefOpened = true;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Hotel:openCEFq8FqUh28kGTAELbX", hotelname);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:HouseEntrance:openCEFq8FqUh28kGTAELbX", (charId, houseArray, isRentedIn) => {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && HouseEntranceCefOpened == false) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:HouseEntrance:openCEFq8FqUh28kGTAELbX", charId, houseArray, isRentedIn);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        HouseEntranceCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Tuning:openTuningMenu", (veh, Items) => {
    if (hudBrowser != null && TuningMenuCefOpened == false) {
        curTuningVeh = veh;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Tuning:openTuningMenu", Items);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        alt.toggleGameControls(false);
        alt.showCursor(true);
        hudBrowser.focus();
        TuningMenuCefOpened = true;
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Deathscreen:openCEFq8FqUh28kGTAELbX", () => {
    if (hudBrowser != null && DeathscreenCefOpened == false) {
        closeAllCEFs();
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.setEntityInvincible(alt.Player.local.scriptID, true);
		alt.showCursor(true);
		alt.toggleGameControls(false);
        DeathscreenCefOpened = true;
        isPlayerDead = true;
        deathScreen = new alt.WebView("http://resource/client/cef/deathscreen/death.html");
        deathScreen.focus();
		

        deathScreen.on("test", (msg) => {
            alt.log("Test: "+msg);
        })
		//deathScreen.emit("CEFq8FqUh28kGTAELbX:Deathscreen:updateDeathTime", deathTimeSec);
		
        // alt.setTimeout(() => {
        //     hudBrowser.focus();
        //     hudBrowser.emit("CEFq8FqUh28kGTAELbX:Deathscreen:openCEFq8FqUh28kGTAELbX");
        // }, 3000);
    }
});


alt.onServer("Clientq8FqUh28kGTAELbX:Deathscreen:updateDeathTime", (deathTimeSec, stabilized) => {
    if (hudBrowser != null && DeathscreenCefOpened == true) {
		deathScreen.emit("CEFq8FqUh28kGTAELbX:Deathscreen:updateDeathTime", deathTimeSec, stabilized);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Deathscreen:closeCEFq8FqUh28kGTAELbX", () => {
    if (hudBrowser != null) {
        deathScreen.destroy();
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Deathscreen:closeCEFq8FqUh28kGTAELbX");
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
        game.freezeEntityPosition(alt.Player.local.scriptID, false);
        game.setEntityInvincible(alt.Player.local.scriptID, false);
        alt.showCursor(false);
        alt.toggleGameControls(true);
        hudBrowser.unfocus();
        DeathscreenCefOpened = false;
        isPlayerDead = false;
    }
});


alt.onServer("Clientq8FqUh28kGTAELbX:Townhall:openHouseSelector", (array) => {
    if (hudBrowser != null && !TownhallHouseSelectorCefOpened) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Townhall:openHouseSelector", array);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        TownhallHouseSelectorCefOpened = true;
    }
});
/*test*/
alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:equipPhone", (isEquipped, phoneNumber, isFlyModeEnabled) => {
    let interval = alt.setInterval(() => {
        if (hudBrowser != null && browserReady) {
            alt.clearInterval(interval);
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:equipPhone", isEquipped, phoneNumber, isFlyModeEnabled);
            isPhoneEquipped = isEquipped;
        }
    }, 0);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:showPhoneReceiveCall", (number) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:showPhoneReceiveCall", number);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:showPhoneCallActive", (number) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:showPhoneCallActive", number);
    playAnimation("cellphone@", "cellphone_call_listen_base", 49, -1);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:addChatJSON", (chats) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:addChatJSON", chats);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:addMessageJSON", (msg) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:addMessageJSON", msg);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:setAllMessages", () => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:setAllMessages");
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:setAllChats", () => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:setAllChats");
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:recieveNewMessage", (chatId, phoneNumber, message) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:recieveNewMessage", chatId, phoneNumber, message);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:ShowPhoneCallError", (errorId) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:ShowPhoneCallError", errorId);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:addContactJSON", (json) => {
    if (hudBrowser == null && !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:addContactJSON", json);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:setAllContacts", () => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:setAllContacts");
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:ShowLSPDIntranetApp", (shouldBeVisible, serverWanteds) => {
    let interval = alt.setInterval(() => {
        if (hudBrowser != null && browserReady) {
            alt.clearInterval(interval);
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:ShowLSPDIntranetApp", shouldBeVisible, serverWanteds);
        }
    }, 1000);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:SetLSPDIntranetSearchedPeople", (searchedPersonsJSON) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:SetLSPDIntranetSearchedPeople", searchedPersonsJSON);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:setLSPDIntranetPersonWanteds", (json) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:setLSPDIntranetPersonWanteds", json);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:setPoliceAppMostWanteds", (mostWanteds) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:setPoliceAppMostWanteds", mostWanteds);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Smartphone:showNotification", (message, app, fn, sound) => {
    if (hudBrowser == null || !browserReady) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:showNotification", message, app, fn, sound);
});

alt.onServer("Clientq8FqUh28kGTAELbX:HUD:SetPlayerHUDVehicleInfos", (fuel, km) => {
    if (hudBrowser != null && alt.Player.local.vehicle != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:SetPlayerHUDVehicleInfos", fuel, km);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Animations:setupItems", (array) => {
    let interval = alt.setInterval(() => {
        if (hudBrowser != null && browserReady) {
            alt.clearInterval(interval);
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:Animations:setupItems", array);
        }
    }, 10);
});

let OldVehKMPos,
    curVehKMid = 0,
    GetVehKMPos = false;

alt.onServer("Clientq8FqUh28kGTAELbX:HUD:GetDistanceForVehicleKM", () => {
    if (hudBrowser != null && alt.Player.local.vehicle != null) {
        if (curVehKMid == 0) { curVehKMid = alt.Player.local.vehicle.scriptID; }
        if (curVehKMid != alt.Player.local.vehicle.scriptID) { GetVehKMPos = false; }

        if (!GetVehKMPos) {
            OldVehKMPos = alt.Player.local.vehicle.pos;
            GetVehKMPos = true;
            return;
        }

        if (GetVehKMPos) {
            let curPos = alt.Player.local.vehicle.pos;
            let dist = game.getDistanceBetweenCoords(OldVehKMPos.x, OldVehKMPos.y, OldVehKMPos.z, curPos.x, curPos.y, curPos.z, false);
            emitServer("Serverq8FqUh28kGTAELbX:Vehicle:UpdateVehicleKM", dist);
            OldVehKMPos = alt.Player.local.vehicle.pos;
        }
    }
});

let vehicle = null;
let interactVehicle = null;
let interactPlayer = null;
let playerRC = null;
let selectedRaycastId = null;
let InteractMenuUsing = false;
let AnimationMenuUsing = false;
let AnimationMenuUsingPage2 = false;
let AnimationMenuUsingPage3 = false;
let ClothesRadialMenuUsing = false;
let ObjectMenuUsing = false;

alt.onServer("Clientq8FqUh28kGTAELbX:RaycastMenu:SetMenuItems", (type, itemArray) => { //Type: player, vehicleOut, vehicleIn
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:InteractionMenu:toggleInteractionMenu", true, type, itemArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:AnimationMenu:SetMenuItems", (itemArray) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenu:toggleInteractionMenu", true, itemArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:AnimationMenuPage2:SetMenuItems", (itemArray) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenu:toggleInteractionMenu", false);
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenuPage3:toggleInteractionMenu", false);
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenuPage2:toggleInteractionMenu", true, itemArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:AnimationMenuPage3:SetMenuItems", (itemArray) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenu:toggleInteractionMenu", false);
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenuPage2:toggleInteractionMenu", false);
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenuPage3:toggleInteractionMenu", true, itemArray);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:ClothesRadial:SetMenuItems", (itemArray) => {
    if (hudBrowser != null) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ClothesRadial:toggleInteractionMenu", true, itemArray);
    }
});

alt.on('keydown', (key) => {
    if(alt.Player.local.hasMeta("controls")) return;
    if (key == 'M'.charCodeAt(0)) {
        if (alt.Player.local.getSyncedMeta("IsCefOpen")) return;
        let result = Raycast.line(1.5, 2.5);
        if (result == undefined && !alt.Player.local.vehicle) return;
        if (!alt.Player.local.vehicle) {
            if (result.isHit && result.entityType != 0) {
                if (result.entityType == 1 && hudBrowser != null) {
                    selectedRaycastId = result.hitEntity;
                    interactPlayer = alt.Player.all.find(x => x.scriptID == selectedRaycastId);
                    if (!interactPlayer) return;
                    InteractMenuUsing = true;
                    hudBrowser.focus();
                    alt.showCursor(true);
                    alt.toggleGameControls(false);
                    emitServer("Serverq8FqUh28kGTAELbX:InteractionMenu:GetMenuPlayerItems", "player", interactPlayer);
                    interactPlayer = null;
                    return;
                } else if (result.entityType == 2 && hudBrowser != null) {
                    selectedRaycastId = result.hitEntity;
                    interactVehicle = alt.Vehicle.all.find(x => x.scriptID == selectedRaycastId);
                    if (!interactVehicle) return;
                    InteractMenuUsing = true;
                    hudBrowser.focus();
                    alt.showCursor(true);
                    alt.toggleGameControls(false);
                    emitServer("Serverq8FqUh28kGTAELbX:InteractionMenu:GetMenuVehicleItems", "vehicleOut", interactVehicle);
                    interactVehicle = null;
                    return;
                } else if (result.entityType == 3 && hudBrowser != null) {
                    selectedRaycastId = result.hitEntity;
                    InteractMenuUsing = true;
                    emitServer("Serverq8FqUh28kGTAELbX:InteractionMenu:GetMenuPlayerCarry", "carry");
                    interactPlayer = null;
                    return;
                }
            }
        }

        if (alt.Player.local.vehicle && hudBrowser != null) {
            selectedRaycastId = alt.Player.local.vehicle.scriptID;
            interactVehicle = alt.Vehicle.all.find(x => x.scriptID == selectedRaycastId);
            InteractMenuUsing = true;
            hudBrowser.focus();
            alt.showCursor(true);
            alt.toggleGameControls(false);
            if (!interactVehicle) return;
            emitServer("Serverq8FqUh28kGTAELbX:InteractionMenu:GetMenuVehicleItems", "vehicleIn", interactVehicle);
            interactVehicle = null;
            return;
        }
    } else if (key == 'X'.charCodeAt(0)) {
        if (alt.Player.local.getSyncedMeta("IsCefOpen")) return;
        AnimationMenuUsing = true;
        hudBrowser.focus();
        alt.showCursor(true);
        alt.toggleGameControls(false);
        emitServer("Serverq8FqUh28kGTAELbX:AnimationMenu:GetAnimationItems");
        return;
    } else if (key == 'I'.charCodeAt(0)) {
        if (alt.Player.local.getSyncedMeta("IsCefOpen")) return;
        ObjectMenuUsing = true;
        hudBrowser.focus();
        selectedRaycastId = 34653;
        alt.showCursor(true);
        alt.toggleGameControls(false);
        emitServer("Serverq8FqUh28kGTAELbX:InteractionMenu:GetMenuObjectHandler");
        return;
    }  
    
    else if (key === 39) { 
        if (AnimationMenuUsing == false && AnimationMenuUsingPage2 == false && AnimationMenuUsingPage3 == false) return;

        if (AnimationMenuUsing == false) { 
            if (AnimationMenuUsingPage2 == true) {
                AnimationMenuUsingPage3 = true;
                AnimationMenuUsing, AnimationMenuUsingPage2 = false;
                emitServer("Serverq8FqUh28kGTAELbX:AnimationMenuPage3:GetAnimationItems");
            }
        } else {
            AnimationMenuUsingPage2 = true;
            AnimationMenuUsing = false;
            emitServer("Serverq8FqUh28kGTAELbX:AnimationMenuPage2:GetAnimationItems");
        }
    }

    else if (key === 37) {
        if (AnimationMenuUsing == false && AnimationMenuUsingPage2 == false && AnimationMenuUsingPage3 == false) return;

        if (AnimationMenuUsing == false) {
            if (AnimationMenuUsingPage2 == true) {
                AnimationMenuUsing = true;
                AnimationMenuUsingPage2, AnimationMenuUsingPage3 = false;
                emitServer("Serverq8FqUh28kGTAELbX:AnimationMenu:GetAnimationItems");
            } else if (AnimationMenuUsingPage3 == true) {
                AnimationMenuUsingPage2 = true;
                AnimationMenuUsing, AnimationMenuUsingPage3 = false;
                emitServer("Serverq8FqUh28kGTAELbX:AnimationMenuPage2:GetAnimationItems");
            }
        }
    }
    
    else if (key == 'K'.charCodeAt(0)) {
        if (alt.Player.local.getSyncedMeta("IsCefOpen")) return;
        ClothesRadialMenuUsing = true;
        hudBrowser.focus();
        alt.showCursor(true);
        alt.toggleGameControls(false);
        emitServer("Serverq8FqUh28kGTAELbX:ClothesRadial:GetClothesRadialItems");
        return;
    } else 
        if (key == 'N'.charCodeAt(0)) { //N runter
            if (currentRadioFrequence == null || currentRadioFrequence == undefined) return;
            playAnimation("random@arrests", "generic_radio_enter", 49, -1);
            emitServer("SaltyChat_IsSending", currentRadioFrequence, true);
        }
    
});

let phone = null;

alt.on('keyup', (key) => {
    if(alt.Player.local.hasMeta("controls")) return;
    if (key == 'M'.charCodeAt(0)) {
        if (hudBrowser == null || InteractMenuUsing == false) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:InteractionMenu:requestAction");
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:InteractionMenu:toggleInteractionMenu", false);
        InteractMenuUsing = false;
        hudBrowser.unfocus();
        alt.showCursor(false);
        alt.toggleGameControls(true);
    } else if (key == 88) { // X
        if (hudBrowser == null) return;
        if (AnimationMenuUsing == true) {
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenu:requestAction");
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenu:toggleInteractionMenu", false);
            AnimationMenuUsing = false;
        } else if (AnimationMenuUsingPage2 == true) {
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenuPage2:requestAction");
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenuPage2:toggleInteractionMenu", false);
            AnimationMenuUsingPage2 = false;
        } else if (AnimationMenuUsingPage3 == true) {
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenuPage3:requestAction");
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:AnimationMenuPage3:toggleInteractionMenu", false);
            AnimationMenuUsingPage3 = false;
        } else return;

        hudBrowser.unfocus();
        alt.showCursor(false);
        alt.toggleGameControls(true);
   /* } else if (key == 116) { //F5
        if (hudBrowser == null) return;
        if (!AnimationMenuCefOpened) {
            initializeFavouriteAnims();
        } else {
            hudBrowser.emit("CEFq8FqUh28kGTAELbX:Animations:hideAnimationMenu");
        }
        AnimationMenuCefOpened != AnimationMenuCefOpened; */
    } else if (key == 'K'.charCodeAt(0)) {
        if (hudBrowser == null || ClothesRadialMenuUsing == false) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ClothesRadial:requestAction");
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:ClothesRadial:toggleInteractionMenu", false);
        ClothesRadialMenuUsing = false;
        hudBrowser.unfocus();
        alt.showCursor(false);
        alt.toggleGameControls(true);
		} else if (key == 'I'.charCodeAt(0)) {
        if (hudBrowser == null || ObjectMenuUsing == false) return;
		hudBrowser.emit("CEFq8FqUh28kGTAELbX:InteractionMenu:requestAction");
		hudBrowser.emit("CEFq8FqUh28kGTAELbX:InteractionMenu:toggleInteractionMenu", false);
        ObjectMenuUsing = false;
        selectedRaycastId = 0;
        hudBrowser.unfocus();
        alt.showCursor(false);
        alt.toggleGameControls(true);
    } else if (key == 33) {
        //Smartphone Bild hoch
        if (hudBrowser == null || !browserReady || isPlayerDead || !isPhoneEquipped || alt.Player.local.getSyncedMeta("IsCefOpen") == true || alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:togglePhone", true);
        playAnimation("amb@world_human_stand_mobile_fat@male@text@base", "base", 49, -1);
        alt.showCursor(true);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        alt.toggleGameControls(false);
        hudBrowser.focus();

        let coords = game.getEntityCoords(alt.Player.local.scriptID, true);
        let bone = game.getPedBoneIndex(alt.Player.local.scriptID, 28422);
        let phoneModel = game.getHashKey('p_cs_cam_phone');

        alt.loadModel(phoneModel);

        let interval = alt.setInterval(() => {
            if (!game.hasModelLoaded(phoneModel)) return;
            phone = game.createObject(phoneModel, coords.x, coords.y, coords.z, true, true, false);
            game.attachEntityToEntity(phone, alt.Player.local.scriptID, bone, 0, 0, 0, 0, 0, 0, true, true, false, false, 2, true);
            alt.clearInterval(interval);
        }, 0);



    } else if (key == 34) {
        //Smartphone Bild runter
        if (hudBrowser == null || !browserReady || !isPhoneEquipped) return;
        if (hudBrowser == null || !browserReady || isPlayerDead || !isPhoneEquipped || alt.Player.local.getSyncedMeta("IsCefOpen") == true || alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
		
		alt.setTimeout(() => {
			game.stopAnimTask(alt.Player.local.scriptID, "amb@world_human_stand_mobile_fat@male@text@base", "base");
			game.stopAnimTask(alt.Player.local.scriptID, "amb@world_human_stand_mobile_fat@male@text@exit", "exit");
			
			game.detachEntity(phone, true, false);
            game.deleteObject(phone);
        },2200);
	//	playAnimation("amb@world_human_stand_mobile_fat@male@text@exit", "exit", 49, -1);

        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Smartphone:togglePhone", false);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
        alt.showCursor(false);
        alt.toggleGameControls(true);
        hudBrowser.unfocus();

    } else 
        if (key == 'N'.charCodeAt(0)) { //N runter
            if (currentRadioFrequence == null || currentRadioFrequence == undefined)  return;
            game.clearPedTasks(alt.Player.local.scriptID);
            emitServer("SaltyChat_IsSending", currentRadioFrequence, false);
    }
});

function InterActionMenuDoAction(type, action) {
	
	if (type == "ObjectItemMenu") {
            if (action == "objectRemoveItem") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:objectRemoveItem");
            }
			 if (action == "objectRotatePlus10") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:objectRotatePlus10");
            }
			 if (action == "objectRotatePlus25") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:objectRotatePlus25");
            }
			 if (action == "objectRotateMinus10") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:objectRotateMinus10");
            }
			 if (action == "objectRotateMinus25") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:objectRotateMinus25");
            }
			 if (action == "objectMoveUP") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:objectMoveUP");
            }
			if (action == "objectMoveDOWN") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:objectMoveDOWN");
            }
        }

    if (selectedRaycastId != null && selectedRaycastId != 0 && type != "none") {
        if (type == "vehicleOut" || type == "vehicleIn") { type = "vehicle"; }
        if (type == "vehicle") {
            vehicle = alt.Vehicle.all.find(x => x.scriptID == selectedRaycastId);
            if (!vehicle) return;
            if (action == "vehtoggleLock") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:LockVehicle", vehicle);
            } else if (action == "vehSellVehicle") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:SellVehicleToNearPlayer", vehicle);
            } else if (action == "vehtoggleEngine") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:ToggleVehicleEngine", vehicle);
            } else if (action == "vehFuelVehicle") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:OpenVehicleFuelMenu", vehicle);
            } else if (action == "vehRepair") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:RepairVehicle", vehicle);
            } else if (action == "vehOpenCloseTrunk") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:OpenCloseVehicleTrunk", vehicle);
            } else if (action == "vehViewTrunkContent") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:ViewVehicleTrunk", vehicle);
            } else if (action == "vehViewGloveboxContent") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:ViewVehicleGlovebox", vehicle);
            } else if (action == "vehTow") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:towVehicle", vehicle);
            } else if (action == "vehTuning") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:tuneVehicle", vehicle);
            } else if (action == "putoutcar") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:putoutcar");
            } else if (action == "seatbelt") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:seatbelt");
            } else if (action =="vehtoggleLockpick") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:LockpickVehicle", vehicle);
            }
            vehicle = null;
        } else if (type == "player") {
            playerRC = alt.Player.all.find(x => x.scriptID == selectedRaycastId);
            if (!playerRC) return;
            if (action == "playersupportId") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:showPlayerSupportId", playerRC);
            } else if (action == "playergiveItem") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:givePlayerItemRequest", playerRC);
            } else if (action == "playergiveFactionBill") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:OpenGivePlayerBillCEFq8FqUh28kGTAELbX", playerRC, "faction");
            } else if (action == "playergiveCompanyBill") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:OpenGivePlayerBillCEFq8FqUh28kGTAELbX", playerRC, "company");
            } else if (action == "playerGiveTakeHandcuffs") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:GiveTakeHandcuffs", playerRC);
            } else if (action == "playerGiveTakeBigHandcuffs") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:GiveTakeBigHandcuffs", playerRC);
            } else if (action == "playerGiveTakeRopeCuffs") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:GiveTakeRopeCuffs", playerRC);
            } else if (action == "playerSearchInventory") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:SearchPlayerInventory", playerRC);
            } else if (action == "playerGiveLicense") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:openGivePlayerLicenseCEFq8FqUh28kGTAELbX", playerRC);
            } else if (action == "playerRevive") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:RevivePlayer", playerRC);
            } else if (action == "playerJail") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:jailPlayer", playerRC);
            } else if (action == "showIdCard") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:showIdcard", playerRC);
            } else if (action == "showLicenseCard") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:showLicenseCard", playerRC);
            } else if (action == "healPlayer") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:healPlayer", playerRC);
            } else if (action == "vehSellVehicle") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:SellVehicleToNearPlayer", playerRC);
            } else if (action == "Carry") {
               emitServer("Serverq8FqUh28kGTAELbX:Raycast:Carry", playerRC);
            } else if (action == "stabilse") {
				emitServer("Serverq8FqUh28kGTAELbX:Raycast:stabilse", playerRC);
			} else if (action == "playerGivestabilse") {
				emitServer("Serverq8FqUh28kGTAELbX:Raycast:playerGivestabilse", playerRC);
			} else if (action == "ArrestCarry") {
				emitServer("Serverq8FqUh28kGTAELbX:Raycast:ArrestCarry", playerRC);
			} else if (action == "putincar") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:putincar", playerRC);
            } else if (action =="playerGiveSWAT") {
                emitServer("Serverq8FqUh28kGTAELbX:Raycast:playerGiveSWAT", playerRC)
            }
            playerRC = null; 
        } 
        selectedRaycastId = null;
    }
}

function InterActionMenuDoActionAnimationMenu(action) {
    new Promise((resolve, reject) => {
        if (action == "crossarms3") {
            playAnimation("anim@heists@heist_corona@single_team", "single_team_loop_boss", 49, 300000)
        } else if (action == "handsup") {
            playAnimation("missminuteman_1ig_2", "handsup_base", 49, 300000)
        } else if (action == "finger2") {
            playAnimation("anim@mp_player_intupperfinger", "idle_a_fp", 49, 300000)
        } else if (action == "wait5") {
            playAnimation("timetable@amanda@ig_3", "ig_3_base_tracy", 49, 300000)
        } else if (action == "hug3") {
            playAnimation("mp_ped_interaction", "hugs_guy_a", 1, 3000)
        } else if (action == "inspect") {
            playAnimation("random@train_tracks", "idle_e", 1, 300000)
        } else if (action == "kneel2") {
            playAnimation("rcmextreme3", "idle", 1, 300000)
        } else if (action == "lean4") {
            playAnimation("amb@world_human_leaning@male@wall@back@foot_up@idle_a", "idle_a", 1, 300000)
        } else if (action == "mechanic") {
            playAnimation("mini@repair", "fixing_a_ped",  49, 300000)
        } else if (action == "pushup") {
            playAnimation("amb@world_human_push_ups@male@idle_a", "idle_d", 1, 300000)
        } else if (action == "guard") {
            playAnimation("missfbi_s4mop", "guard_idle_b", 1, 300000)
        } else if (action == "cop5") {
            playAnimation("anim@amb@nightclub@peds@", "rcmme_amanda1_stand_loop_cop", 1, 300000)
        } else if (action == "sitting") {
            playAnimation("anim@amb@business@bgen@bgen_no_work@", "sit_phone_phoneputdown_idle_nowork", 1, 300000)
        } else if (action == "sitchair") {
            playAnimation("timetable@ron@ig_5_p3", "ig_5_p3_base", 1, 300000)
        } else if (action == "clipboard") {
            playAnimation("mini@cpr@char_a@cpr_str", "cpr_pumpchest", 1, 300000)
        } else if (action == "superhero") {
            playAnimation("rcmbarry", "base", 1, 300000)
        } else if (action == "yoga") {
            playAnimation("missfam5_yoga", "a2_pose", 1, 300000)
        } else if (action == "facepalm") {
            playAnimation("random@car_thief@agitated@idle_a", "agitated_idle_a", 49, 300000)
        } else if (action == "gang1") {
            playAnimation("mp_player_int_uppergang_sign_a", "mp_player_int_gang_sign_a", 49, 300000)
        } else if (action == "salute") {
            playAnimation("anim@mp_player_intincarsalutestd@ds@", "idle_a", 49, 300000)
        } else if (action = 'close') {
            resolve(game.clearPedTasks(alt.Player.local.scriptID));
        }
    }).then(() => {
        console.log("Fehler aufgetreten...")
    });
}

function InterActionMenuDoActionAnimationMenuPage2(action) {
    new Promise((resolve, reject) => {
        if (action == "dancef6") {
            playAnimation("anim@amb@nightclub@mini@dance@dance_solo@female@var_a@", "high_center_up", 1, 300000)
        } else if (action == "danceslow2") {
            playAnimation("anim@amb@nightclub@mini@dance@dance_solo@female@var_a@", "low_center", 1, 300000)
        } else if (action == "dance3") {
            playAnimation("anim@amb@nightclub@mini@dance@dance_solo@male@var_a@", "high_center", 1, 300000)
        } else if (action == "danceupper") {
            playAnimation("anim@amb@nightclub@mini@dance@dance_solo@female@var_b@", "high_center", 1, 300000)
        } else if (action == "danceshy") {
            playAnimation("anim@amb@nightclub@mini@dance@dance_solo@male@var_a@", "low_center", 1, 300000)
        } else if (action == "dance6") {
            playAnimation("misschinese2_crystalmazemcs1_cs", "dance_loop_tao", 1, 300000)
        } else if (action == "dancesilly") {
            playAnimation("special_ped@mountain_dancer@monologue_3@monologue_3a", "mnt_dnc_buttwag", 1, 300000)
        } else if (action == "dancesilly4") {
            playAnimation("anim@amb@nightclub@lazlow@hi_podium@", "danceidle_hi_11_buttwiggle_b_laz", 1, 300000)
        } else if (action == "dancesilly5") {
            playAnimation("timetable@tracy@ig_5@idle_a", "idle_a", 1, 300000)
        } else if (action == "dance5") {
            playAnimation("anim@amb@casino@mini@dance@dance_solo@female@var_a@", "med_center", 1, 300000)
        } else if (action = 'close') {
            resolve(game.clearPedTasks(alt.Player.local.scriptID));
        }
    }).then(() => {
        console.log("Fehler aufgetreten...")
    });
}

function InterActionMenuDoActionAnimationMenuPage3(action) {
    new Promise((resolve, reject) => {
        if (action == "injured") {
            playWalking("move_m@injured");
        } else if (action == "arrogant") {
            playWalking("move_f@arrogant@a");        
        } else if (action == "casual") {
            playWalking("move_m@casual@a"); 
        } else if (action == "casual4") {
            playWalking("move_m@casual@d");        
        } else if (action == "confident") {
            playWalking("move_m@confident"); 
        } else if (action == "drunk") {
            playWalking("move_m@drunk@a");
        } else if (action == "gangster") {
            playWalking("move_m@gangster@generic");
        } else if (action == "gangster2") {
            playWalking("move_m@gangster@ng");
        } else if (action == "cop") {
            playWalking("move_m@business@a");
        } else if (action == "cop2") {
            playWalking("move_m@business@b");
        } else if (action == "money") {
            playWalking("move_m@money");
        } else if (action == "jog") {
            playWalking("move_m@hipster@a");
        } else if (action == "guard") {
            playWalking("move_m@swagger");
        } else if (action == "sad") {
            playWalking("move_m@sad@a");
        } else if (action == "sexy") {
            playWalking("move_f@sexy@a");
        } else if (action == "slow") {
            playWalking("move_characters@jimmy@slow");

        } else if (action = 'close') {
            resolve(playWalking("normal"));
        }
    }).then(() => {
        console.log("Fehler aufgetreten...")
    });
}


function InterActionMenuDoActionClothesRadialMenu(action) {
    new Promise((resolve, reject) => {
        emitServer("Serverq8FqUh28kGTAELbX:ClothesRadial:SetNormalSkin", action);
    }).then(() => {
        console.log("Fehler aufgetreten...")
    });
}

alt.everyTick(() => {
    if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) {
        game.disableControlAction(0, 24, true);
        game.disableControlAction(0, 25, true);
        game.disableControlAction(0, 12, true);
        game.disableControlAction(0, 13, true);
        game.disableControlAction(0, 14, true);
        game.disableControlAction(0, 15, true);
        game.disableControlAction(0, 16, true);
        game.disableControlAction(0, 17, true);
        game.disableControlAction(0, 37, true);
        game.disableControlAction(0, 44, true);
        game.disableControlAction(0, 45, true);
        game.disableControlAction(0, 263, true);
        game.disableControlAction(0, 264, true);
        game.disableControlAction(0, 140, true);
        game.disableControlAction(0, 141, true);
        game.disableControlAction(0, 257, true);
        game.disableControlAction(0, 345, true);
    } else {
        game.enableControlAction(0, 24, true);
        game.enableControlAction(0, 25, true);
        game.enableControlAction(0, 12, true);
        game.enableControlAction(0, 13, true);
        game.enableControlAction(0, 14, true);
        game.enableControlAction(0, 15, true);
        game.enableControlAction(0, 16, true);
        game.enableControlAction(0, 17, true);
        game.enableControlAction(0, 37, true);
        game.enableControlAction(0, 44, true);
        game.enableControlAction(0, 45, true);
        game.enableControlAction(0, 257, true);
        if(!game.isPedArmed(alt.Player.local.scriptID, 6)){
            game.enableControlAction(0, 263, true);
            game.enableControlAction(0, 264, true);
            game.enableControlAction(0, 140, true);
            game.enableControlAction(0, 141, true);
        }
        game.enableControlAction(0, 345, true);
    }
    if (hudBrowser == null) return;
    if (alt.Player.local.vehicle == null) return;
    const street = game.getStreetNameAtCoord(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z);
    const zoneName = game.getLabelText(game.getNameOfZone(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z));
    const streetName = game.getStreetNameFromHashKey(street[1]);
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:updateStreetLocation", streetName + ", " + zoneName);
    GetVehicleSpeed();
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:HUD:SetPlayerHUDVehicleSpeed", curSpeed);
    if (alt.Player.local.vehicle.model != 2621610858 && alt.Player.local.vehicle.model != 1341619767 && alt.Player.local.vehicle.model != 2999939664) {
        game.setPedConfigFlag(alt.Player.local.scriptID, 429, 1);
    } else {
        game.setPedConfigFlag(alt.Player.local.scriptID, 429, 0);
    }
    game.setPedConfigFlag(alt.Player.local.scriptID, 184, true);
    game.setAudioFlag("DisableFlightMusic", true);
});

let closeFarmingCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    alt.toggleGameControls(true);
    alt.showCursor(false);
    hudBrowser.unfocus();
}

let closeBankCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(game.playerPedId(), false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    BankAccountManageFormOpened = false;
}

let closeATMCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(game.playerPedId(), false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    ATMcefOpened = false;
}

let closeShopCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(game.playerPedId(), false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    ShopCefOpened = false;
}

let closeKeyShopCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(game.playerPedId(), false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    ShopCefOpened = false;
}

let closeBarberCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    BarberCefOpened = false;
}

let closeGarageCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    GarageCefOpened = false;
}

let closeVehicleShopCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    VehicleShopCefOpened = false;
}

let closeJobcenterCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    JobcenterCefOpened = false;
}

let closeFuelstationBuyCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    FuelStationBuyCefOpened = false;
}
let closeFuelstationMenuCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    FuelStationMenuCefOpened = false;
}

let closeFuelstationCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    FuelStationCefOpened = false;
}

let closeClothesShopCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    ClothesShopCefOpened = false;
}

let closeClothesStorageCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:ClothesShop:RequestCurrentSkin");
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    ClothesStorageCefOpened = false;
}

let closeBankFactionATMCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    bankFactionATMCefOpened = false;
}

let closeGivePlayerBillCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    GivePlayerBillCefOpened = false;
}

let closeRecievePlayerBillCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    RecievePlayerBillCefOpened = false;
}

let closeFactionStorageCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    FactionStorageCefOpened = false;
}

let closeVehicleTrunkCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    VehicleTrunkCefOpened = false;
}

let closeVehicleLicensingCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    VehicleLicensingCefOpened = false;
}

let closePlayerSearchCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    PlayerSearchInventoryCefOpened = false;
}

let closeGivePlayerLicenseCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    GivePlayerLicenseCefOpened = false;
}

let closeMinijobPilotCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    MinijobPilotCefOpened = false;
}

let closeMinijobBusdriverCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    MinijobBusdriverCefOpened = false;
}

let closeHotelRentCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    HotelRentCefOpened = false;
}

let closeHouseEntranceCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    HouseEntranceCefOpened = false;
}

let closeHouseManageCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    HouseManageCefOpened = false;
}

let destroyTownHallHouseSelector = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    game.freezeEntityPosition(alt.Player.local.scriptID, false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    TownhallHouseSelectorCefOpened = false;
}

let destroyAnimationMenu = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    AnimationMenuCefOpened = false;
}

let destroyClothesRadialMenu = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    alt.showCursor(false);
    alt.toggleGameControls(true);
    hudBrowser.unfocus();
    ClothesRadialCefOpened = false;
}


let closeTuningCEF = function() {
    emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
    alt.toggleGameControls(true);
    alt.showCursor(false);
    hudBrowser.unfocus();
    TuningMenuCefOpened = false;
    emitServer("Serverq8FqUh28kGTAELbX:Tuning:resetToNormal", curTuningVeh);
    curTuningVeh = null;
}

let closeAllCEFs = function() {
    if (hudBrowser == null) return;
    if (identityCardApplyCEFopened || TuningMenuCefOpened || BankAccountManageFormOpened || ATMcefOpened || ShopCefOpened || BarberCefOpened || GarageCefOpened || VehicleShopCefOpened || JobcenterCefOpened || FuelStationCefOpened || ClothesShopCefOpened || bankFactionATMCefOpened || GivePlayerBillCefOpened || FactionStorageCefOpened || RecievePlayerBillCefOpened || VehicleTrunkCefOpened || VehicleLicensingCefOpened || PlayerSearchInventoryCefOpened || GivePlayerLicenseCefOpened || MinijobPilotCefOpened || MinijobBusdriverCefOpened || HotelRentCefOpened || HouseEntranceCefOpened || HouseManageCefOpened || TownhallHouseSelectorCefOpened || AnimationMenuCefOpened) {
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:General:hideAllCEFs");
        identityCardApplyCEFopened = false,
            BankAccountManageFormOpened = false,
            ATMcefOpened = false,
            ShopCefOpened = false,
            BarberCefOpened = false,
            GarageCefOpened = false,
            VehicleShopCefOpened = false,
            JobcenterCefOpened = false,
            FuelStationCefOpened = false,
            ClothesShopCefOpened = false,
            bankFactionATMCefOpened = false,
            GivePlayerBillCefOpened = false,
            FactionStorageCefOpened = false,
            RecievePlayerBillCefOpened = false,
            VehicleTrunkCefOpened = false,
            VehicleLicensingCefOpened = false,
            PlayerSearchInventoryCefOpened = false,
            GivePlayerLicenseCefOpened = false,
            MinijobPilotCefOpened = false,
            MinijobBusdriverCefOpened = false,
            HotelRentCefOpened = false,
            HouseEntranceCefOpened = false,
            HouseManageCefOpened = false,
            TownhallHouseSelectorCefOpened = false,
            TuningMenuCefOpened = false,
            AnimationMenuCefOpened = false,
            ClothesStorageCefOpened = false;
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", false);
        alt.showCursor(false);
        alt.toggleGameControls(true);
        hudBrowser.unfocus();
    }
    closeInventoryCEF();
    closeTabletCEF();
}

function GetVehicleSpeed() {
    let vehicle = alt.Player.local.vehicle;
    let speed = game.getEntitySpeed(vehicle.scriptID);
    curSpeed = speed * 3.6;
}

/* */
function initializeFavouriteAnims() {
    if (hudBrowser != null && alt.Player.local.getSyncedMeta("IsCefOpen") == false && AnimationMenuCefOpened == false) {
        if (alt.Player.local.getSyncedMeta("HasHandcuffs") == true || alt.Player.local.getSyncedMeta("HasRopeCuffs") == true) return;
        var animStuff = {
            'Num1': storage.get('Num1Hotkey'),
            'Num2': storage.get('Num2Hotkey'),
            'Num3': storage.get('Num3Hotkey'),
            'Num4': storage.get('Num4Hotkey'),
            'Num5': storage.get('Num5Hotkey'),
            'Num6': storage.get('Num6Hotkey'),
            'Num7': storage.get('Num7Hotkey'),
            'Num8': storage.get('Num8Hotkey'),
            'Num9': storage.get('Num9Hotkey')
        };
        hudBrowser.emit("CEFq8FqUh28kGTAELbX:Animations:setupAnimationMenu", animStuff);
        emitServer("Serverq8FqUh28kGTAELbX:CEF:setCefStatus", true);
        alt.showCursor(true);
        alt.toggleGameControls(false);
        hudBrowser.focus();
        AnimationMenuCefOpened = true;
    }
}

function playAnimation(animDict, animName, animFlag, animDuration) {
    if (animDict == undefined || animName == undefined || animFlag == undefined || animDuration == undefined) return;
    RequestModel(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8.0, 1, animDuration, animFlag, 1, false, false, false);
        }
    }, 0);
}

function playWalking(anim) {
    if (anim == undefined) return;
    if (anim == "normal") {
        game.resetPedMovementClipset(alt.Player.local.scriptID);
        return;
    }
    game.requestAnimSet(anim);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(anim)) {
            alt.clearInterval(interval);
            game.setPedMovementClipset(alt.Player.local.scriptID, anim, 0.2);
        }
    }, 0);
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


//Tattoo Shop
alt.onServer("Clientq8FqUh28kGTAELbX:TattooShop:openShop", (gender, shopId, ownTattoosJSON) => {
    if (hudBrowser == null || isTattooShopOpened) return;
    isTattooShopOpened = true;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:TattooShop:openShop", shopId, ownTattoosJSON);
    alt.showCursor(true);
    alt.toggleGameControls(false);
    hudBrowser.focus();
    if (gender == 0) {
        setClothes(alt.Player.local.scriptID, 11, 15, 0);
        setClothes(alt.Player.local.scriptID, 8, 15, 0);
        setClothes(alt.Player.local.scriptID, 3, 15, 0);
        setClothes(alt.Player.local.scriptID, 4, 21, 0);
        setClothes(alt.Player.local.scriptID, 6, 34, 0);
    } else {
        //ToDo
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:TattooShop:sendItemsToClient", (items) => {
    if (hudBrowser == null) return;
    hudBrowser.emit("CEFq8FqUh28kGTAELbX:TattooShop:sendItemsToClient", items);
});