import alt from 'alt';
import * as native from 'natives';
import {emitServer} from './server.js';

var blips = new Map();
var totalBlips = 0;

alt.onServer("Clientq8FqUh28kGTAELbX:ServerBlips:LoadAllBlips", (blipArray) => {
    blipArray = JSON.parse(blipArray);

    for (var i in blipArray) {
        createBlip(blipArray[i].posX, blipArray[i].posY, blipArray[i].posZ, blipArray[i].sprite, blipArray[i].scale, blipArray[i].color, blipArray[i].shortRange, blipArray[i].name);
    }

});

alt.onServer("Clientq8FqUh28kGTAELbX:ServerBlips:LoadAllBlipsRadius", (blipArray) => {
    blipArray = JSON.parse(blipArray);

    for (var i in blipArray) {
        createBlipWithRadius(blipArray[i].posX, blipArray[i].posY, blipArray[i].posZ, blipArray[i].sprite, blipArray[i].scale, blipArray[i].color, blipArray[i].shortRange, blipArray[i].name, blipArray[i].uniqueID);
    }

});

alt.onServer("Clientq8FqUh28kGTAELbX:ServerBlips:AddBlip", (blipArray) => {
    blipArray = JSON.parse(blipArray);

    createBlip(blipArray[0].posX, blipArray[0].posY, blipArray[0].posZ, blipArray[0].sprite, blipArray[0].scale, blipArray[0].color, blipArray[0].shortRange, blipArray[0].name, blipArray[0].uniqueID);
});


alt.onServer("Clientq8FqUh28kGTAELbX:ServerBlips:DeleteBlips", () => {
	for (var [key, value] of Object.entries(blips)) {
        native.removeBlip(value);
        blips.delete(value);
        alt.log(`Blip ${key}: ${value}`);
	}
});

alt.onServer("Clientq8FqUh28kGTAELbX:ServerBlips:DeleteBlip", (uniqueID) => {
    if (blips[uniqueID] !== undefined) {
		native.removeBlip(blips[uniqueID]);
        blips.delete(uniqueID);
        alt.log(`Blip ${uniqueID}`);
	}
});

alt.on("consoleCommand", (name, args) => {
    if (name == "rot") {
        alt.log(`Rotation: ${JSON.stringify(native.getEntityRotation(alt.Player.local.scriptID, 2))}`);
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:ServerBlips:AddNewBlip", (name, color, scale, shortRange, sprite, X, Y, Z) => {
    createBlip(X, Y, Z, sprite, scale, color, shortRange, name);
});

alt.onServer("Clientq8FqUh28kGTAELbX:ServerBlips:TpToWayPoint", () => {
        var waypoint = native.getFirstBlipInfoId(8);

        if (native.doesBlipExist(waypoint)) {
            var coords = native.getBlipInfoIdCoord(waypoint);
            // alt.Player.local.pos = coords;
            var res = native.getGroundZFor3dCoord(coords.x, coords.y, coords.z + 100, undefined, undefined);
            var newZCoord = res + 1;
            emitServer("ServerBlipq8FqUh28kGTAELbX:TpWayPoint", coords.x, coords.y, newZCoord);
        } else {
            emitServer("ServerBlipq8FqUh28kGTAELbX:TpWayPointNotFound");
        }
});

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function createBlip(X, Y, Z, sprite, scale, color, shortRange, name, uniqueID) {
    let blip = native.addBlipForCoord(X, Y, Z);
	native.setBlipSprite(blip, sprite);
	native.setBlipColour(blip, color);
	native.setBlipScale(blip, scale);
	native.setBlipAsShortRange(blip, shortRange);
	native.beginTextCommandSetBlipName('STRING');
	native.addTextComponentSubstringPlayerName(name);
    native.endTextCommandSetBlipName(blip);
     
	if (uniqueID === undefined || uniqueID === null) {
		totalBlips += 1;
		uniqueID = `${totalBlips}`;
        alt.log(`Blip ${uniqueID}: ${name}, ${X}, ${Y}, ${Z}`);
	}

	if (blips[uniqueID] !== undefined) {
		native.removeBlip(blips[uniqueID]);
	}

    blips[uniqueID] = blip;
}

function createBlipWithRadius(X, Y, Z, sprite, scale, color, shortRange, name, uniqueID) {

	var uniqueID_radius = uniqueID + "_r";

	let blipradius = native.addBlipForRadius(X, Y, Z,100);
	
	native.setBlipHighDetail(blipradius, true);
	native.setBlipColour(blipradius, color);
	native.setBlipAlpha(blipradius, 128);
	
	if (uniqueID_radius === undefined || uniqueID_radius === null) {
		totalBlips += 1;
		uniqueID_radius = `${totalBlips}`;
        alt.log(`Blip ${uniqueID_radius}: ${name}, ${X}, ${Y}, ${Z}`);
	}

	if (blips[uniqueID_radius] !== undefined) {
		native.removeBlip(blips[uniqueID_radius]);
	}

    blips[uniqueID_radius] = blipradius;
	
	let blip = native.addBlipForCoord(X, Y, Z);
	
	native.setBlipSprite(blip, sprite);
	native.setBlipDisplay(blip,2);
	native.setBlipColour(blip, color);
	native.setBlipScale(blip, scale);
	native.setBlipAsShortRange(blip, shortRange);
	native.beginTextCommandSetBlipName('STRING');
	native.addTextComponentSubstringPlayerName(name);
    native.endTextCommandSetBlipName(blip);
     
	if (uniqueID === undefined || uniqueID === null) {
		totalBlips += 1;
		uniqueID = `${totalBlips}`;
        alt.log(`Blip ${uniqueID}: ${name}, ${X}, ${Y}, ${Z}`);
	}

	if (blips[uniqueID] !== undefined) {
		native.removeBlip(blips[uniqueID]);
	}

    blips[uniqueID] = blip;
}