import * as alt from 'alt';
import * as game from 'natives';
import {emitServer} from './server.js';

alt.onServer("Clientq8FqUh28kGTAELbX:Vehicles:ToggleDoorState", (veh, doorid, state) => {
    toggleDoor(veh, parseInt(doorid), state);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Vehicles:DoorLightsFalse", (veh) => {
    DoorLightsFalse(veh);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Vehicles:DoorLights", (veh) => {
    DoorLights(veh);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Vehicle:VehicleClean", (veh)=> {
    WashVehicle(veh);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Vehicle:Call22", () => {
    emitServer("Serverq8FqUh28kGTAELbX:Raycast:WashVehicle");
});

alt.onServer("Clientq8FqUh28kGTAELbX:Vehicles:AlarmSiren", (veh) => {
    alarmsiren(veh);
});

alt.on("gameEntityCreate", (entity) => {
    if (entity instanceof alt.Vehicle) {
        if (!entity.hasStreamSyncedMeta("IsVehicleCardealer")) return;
        if (entity.getStreamSyncedMeta("IsVehicleCardealer") == true) {
            game.freezeEntityPosition(entity.scriptID, true);
            game.setEntityInvincible(entity.scriptID, true);
        }
    }
});

alt.on('keydown', (key) => {
    if(key === 98) {
        if(alt.Player.local.vehicle !== null){
            let vehicle = alt.Player.local.vehicle;
            if(game.isVehicleSirenOn(vehicle.scriptID)){
                game.setVehicleSiren(vehicle.scriptID, false);
            } else {
                game.setVehicleSiren(vehicle.scriptID, true);
            }
        }
    }
    if(key === 97) {
        if(alt.Player.local.vehicle !== null) {
            let vehicle = alt.Player.local.vehicle;
            if(game.isVehicleSirenAudioOn(vehicle.scriptID)){
                game.setVehicleHasMutedSirens(vehicle.scriptID,true);

                game.useSirenAsHorn(vehicle.scriptID,false);
            } else {
                game.setVehicleHasMutedSirens(vehicle.scriptID,false);
                game.useSirenAsHorn(vehicle.scriptID,true);
            }
        }
    }
});

function DoorLights (vehicle) {
    playAnimation("anim@mp_player_intmenu@key_fob@", "fob_click_fp", 49, 1000);
    game.startVehicleHorn(vehicle.scriptID, 1000, 0);
}

function DoorLightsFalse (vehicle) {
    playAnimation("anim@mp_player_intmenu@key_fob@", "fob_click_fp", 49, 1000);
    game.startVehicleHorn(vehicle.scriptID, 1000, 0);
}

function alarmsiren (vehicle) {
        game.startVehicleAlarm(vehicle.scriptID, true);
};

function toggleDoor(vehicle, doorid, state) {
    if (state) {
        game.setVehicleDoorOpen(vehicle.scriptID, doorid, false, false);

    } else {
        game.setVehicleDoorShut(vehicle.scriptID, doorid, false);
    }
}

export function WashVehicle(vehicle) {
    if (vehicle != null && vehicle instanceof alt.Vehicle) {
        game.setVehicleDirtLevel(vehicle.scriptID, 0);
    }
}




function playAnimation(animDict, animName, animFlag, animDuration) {
    if (animDict == undefined || animName == undefined || animFlag == undefined || animDuration == undefined) return;
    game.requestAnimDict(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(alt.Player.local.scriptID, animDict, animName, 8.0, 1, animDuration, animFlag, 1, false, false, false);
        }
    }, 0);
}