import * as alt from 'alt';
import * as game from 'natives';
import {emitServer} from './server.js';

var canUseEKey = true;
var lastInteract = 0;

const coolDown = 2 // 5s cooldown
let lastClick = Date.now() - coolDown // to start fresh

function startCoolDown () {
  lastClick = Date.now() // maybe useless function
}
function checkCoolDown () {
  const notOver = Date.now() - lastClick < coolDown
  alt.log("Cooldown Aktiv")
  return !notOver
}

alt.on('keyup', (key) => {
	if (key == 'E'.charCodeAt(0) && !alt.Player.local.hasMeta("controls")) {
        emitServer("Serverq8FqUh28kGTAELbX:KeyHandler:PressE");
    } else if (key == 'U'.charCodeAt(0) && !alt.Player.local.hasMeta("controls")) {
        emitServer("Serverq8FqUh28kGTAELbX:KeyHandler:PressU");
    } else if (key == 122 && !alt.Player.local.hasMeta("controls")) {
        emitServer("Serverq8FqUh28kGTAELbX:KeyHandler:PressF11");
    }else if (key === 17 && !alt.Player.local.hasMeta("controls")) { //STRG
        emitServer("Serverq8FqUh28kGTAELbX:Crouch:toggleCrouch");
    }else if (key == 'G'.charCodeAt(0) && checkCoolDown() && !alt.Player.local.hasMeta("controls")) { //G
        startCoolDown()
        emitServer("Serverq8FqUh28kGTAELbX:KeyHandler:PressG");
	}
});

alt.onServer("Clientq8FqUh28kGTAELbX:DoorManager:ManageDoor", (hash, pos, isLocked) => {
    if (hash != undefined && pos != undefined && isLocked != undefined) {
        // game.doorControl(game.getHashKey(hash), pos.x, pos.y, pos.z, isLocked, 0.0, 50.0, 0.0); //isLocked (0) = Open | isLocked (1) = True
        game.setStateOfClosestDoorOfType(game.getHashKey(hash), pos.x, pos.y, pos.z, isLocked, 0, 0);
    }
});
