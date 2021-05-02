import * as alt from 'alt';
import * as game from 'natives';
import Ragdoll from './ragdoll';
import { hudBrowser } from './hud.js';

const ragdoll = new Ragdoll(alt.Player.local);

let blip = null;
let markers = [];
let playerTattoos = undefined;

var goldHeist3 = null;
var goldHeist2 = null;
var goldHeist1 = null;

var ServerPlacedObjects = new Map();
var totalServerPlacedObjects = 0;

export function clearTattoos(entity) {
    game.clearPedDecorations(entity);
}

export function setTattoo(entity, collection, hash) {
    game.addPedDecorationFromHashes(entity, game.getHashKey(collection), game.getHashKey(hash));
}

export function setClothes(entity, compId, draw, tex) {
    game.setPedComponentVariation(entity, compId, draw, tex, 0);
}

//var _0x34dc=['Player','shortRange','vehicle','type','\x20|\x20Modname:\x20','debu','getModTextLabel','scaleZ','setVehicleFixed','hash','local','Keine\x20Mods\x20gefunden:\x20','setTimeout','scriptID','sin','destroy','test','onServer','blue','scale','setClockTime','ModId:\x20','freezeEntityPosition','chain','Clientq8FqUh28kGTAELbX:Entity:setTime','Vehicle','stateObject','alpha','returnVehicleMods','scaleX','routeColor','cos','Clientq8FqUh28kGTAELbX:Ragdoll:SetPedToRagdoll','Clientq8FqUh28kGTAELbX:Utilities:setTattoos','\x5c+\x5c+\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','gger','action','Clientq8FqUh28kGTAELbX:Minijob:RemoveJobMarker','string','stop','getLabelText','setMsPerGameMinute','Clientq8FqUh28kGTAELbX:Minijob:RemoveJobMarkerWithFreeze','bobUpAndDown','color','sprite','Clientq8FqUh28kGTAELbX:Minijob:CreateJobMarker','collection','start','abs','setVehicleDeformationFixed','push','counter','apply','input','constructor','Vector3'];(function(_0x53c137,_0x1fdd7a){var _0x55bdce=function(_0xc008da){while(--_0xc008da){_0x53c137['push'](_0x53c137['shift']());}};_0x55bdce(++_0x1fdd7a);}(_0x34dc,0x265*0x3+-0x4*0x792+0x1801));var _0x4b0f=function(_0x53c137,_0x1fdd7a){_0x53c137=_0x53c137-(0x265*0x3+-0x4*0x792+0x181d);var _0x55bdce=_0x34dc[_0x53c137];return _0x55bdce;};var _0x4250fe=_0x4b0f,_0x10ef14=function(){var _0x3ab3b8=!![];return function(_0x26ffcd,_0x4048d4){var _0x7e84d5=_0x3ab3b8?function(){var _0x5beeda=_0x4b0f;if(_0x4048d4){var _0x55fb5d=_0x4048d4[_0x5beeda(0x135)](_0x26ffcd,arguments);return _0x4048d4=null,_0x55fb5d;}}:function(){};return _0x3ab3b8=![],_0x7e84d5;};}();(function(){_0x10ef14(this,function(){var _0x355612=_0x4b0f,_0x505abb=new RegExp('function\x20*\x5c(\x20*\x5c)'),_0x589e84=new RegExp(_0x355612(0x122),'i'),_0x4d930d=_0x2af3df('init');!_0x505abb[_0x355612(0x110)](_0x4d930d+_0x355612(0x117))||!_0x589e84['test'](_0x4d930d+_0x355612(0x136))?_0x4d930d('0'):_0x2af3df();})();}(),alt[_0x4250fe(0x111)](_0x4250fe(0x121),_0x4692f3=>{playerTattoos=JSON['parse'](_0x4692f3),setCorrectTattoos();}));export function setCorrectTattoos(){var _0x58349a=_0x4250fe;clearTattoos(alt[_0x58349a(0x139)][_0x58349a(0x10a)][_0x58349a(0x10d)]);for(var _0x308f93 in playerTattoos)setTattoo(alt[_0x58349a(0x139)][_0x58349a(0x10a)][_0x58349a(0x10d)],playerTattoos[_0x308f93][_0x58349a(0x12f)],playerTattoos[_0x308f93][_0x58349a(0x109)]);}alt['onServer'](_0x4250fe(0x11c),(_0x2fde5e,_0x3849b6)=>{var _0x550044=_0x4250fe;if(_0x2fde5e==null||_0x2fde5e==undefined)return;game['setVehicleModKit'](_0x2fde5e['scriptID'],-0x1bd*-0x11+-0xcf7+0x1096*-0x1);let _0x2c4fde=game['getNumVehicleMods'](_0x2fde5e[_0x550044(0x10d)],parseInt(_0x3849b6));if(_0x2c4fde===0x26e7+0x2025+-0x4*0x11c3)alt['log'](_0x550044(0x10b)+_0x2c4fde);else for(var _0x3899a2=0x16e*0x8+0x177d+-0x22ed;_0x3899a2<_0x2c4fde;_0x3899a2++){alt['log'](_0x550044(0x115)+_0x3899a2+_0x550044(0x104)+game[_0x550044(0x128)](game[_0x550044(0x106)](_0x2fde5e[_0x550044(0x10d)],_0x3849b6,_0x3899a2))),alt['emitServer']('Serverq8FqUh28kGTAELbX:Utilities:createNewMod',''+game[_0x550044(0x128)](game[_0x550044(0x106)](_0x2fde5e[_0x550044(0x10d)],_0x3849b6,_0x3899a2)),parseInt(_0x3849b6),parseInt(_0x3899a2+(-0x439+0x49c+0x2*-0x31)));}}),alt[_0x4250fe(0x111)](_0x4250fe(0x118),(_0x18bc46,_0x4c2cc3)=>{var _0x7e7974=_0x4250fe;game[_0x7e7974(0x114)](parseInt(_0x18bc46),parseInt(_0x4c2cc3),0x1*0x2455+0x6d*-0x11+-0x1d18),alt[_0x7e7974(0x129)](-0xeaa6+-0x142a*0xd+0x2db28);}),alt['onServer'](_0x4250fe(0x12e),(_0x534c68,_0x4936af,_0x2422a5,_0x50d9e0,_0x9939c4,_0x290492,_0x3918ab,_0xf87fcd)=>{var _0x48f5c0=_0x4250fe;blip=createBlip(_0x9939c4,_0x290492,_0x3918ab,_0x2422a5,0xd21+-0xe*-0x5d+-4662.2,_0x4936af,!![],_0x534c68);var _0x200e15={};_0x200e15[_0x48f5c0(0x13c)]=_0x50d9e0,_0x200e15['x']=_0x9939c4,_0x200e15['y']=_0x290492,_0x200e15['z']=_0x3918ab,_0x200e15[_0x48f5c0(0x11d)]=0x1,_0x200e15['scaleY']=0x1,_0x200e15[_0x48f5c0(0x107)]=0x1,_0x200e15['red']=0x2e,_0x200e15['green']=0x85,_0x200e15[_0x48f5c0(0x112)]=0xe8,_0x200e15[_0x48f5c0(0x11b)]=0x96,_0x200e15[_0x48f5c0(0x12b)]=_0xf87fcd,markers[_0x48f5c0(0x133)](_0x200e15);}),alt[_0x4250fe(0x111)](_0x4250fe(0x125),()=>{var _0x18de31=_0x4250fe;markers=[];if(blip!=null)blip[_0x18de31(0x10f)]();}),alt[_0x4250fe(0x111)](_0x4250fe(0x120),(_0x563ce1,_0x44750e)=>{var _0x249669=_0x4250fe;alt[_0x249669(0x10c)](()=>{var _0x521ce9=_0x249669;_0x563ce1?ragdoll[_0x521ce9(0x130)]():ragdoll[_0x521ce9(0x127)]();},_0x44750e);}),alt['onServer'](_0x4250fe(0x12a),_0x37be36=>{var _0x4a7210=_0x4250fe;markers=[];if(blip!=null)blip['destroy']();alt[_0x4a7210(0x10c)](()=>{var _0xfec94e=_0x4a7210;game[_0xfec94e(0x116)](alt[_0xfec94e(0x139)][_0xfec94e(0x10a)]['scriptID'],!![]),alt['Player'][_0xfec94e(0x10a)]['vehicle']!=null&&game[_0xfec94e(0x116)](alt[_0xfec94e(0x139)]['local'][_0xfec94e(0x13b)][_0xfec94e(0x10d)],!![]),alt['setTimeout'](()=>{var _0x250802=_0xfec94e;game[_0x250802(0x116)](alt[_0x250802(0x139)]['local']['scriptID'],![]),alt[_0x250802(0x139)]['local']['vehicle']!=null&&game['freezeEntityPosition'](alt[_0x250802(0x139)]['local']['vehicle'][_0x250802(0x10d)],![]);},_0x37be36);},0xb83+0xe*-0x139+0xb77*0x1);}),alt[_0x4250fe(0x111)]('Clientq8FqUh28kGTAELbX:Utilities:repairVehicle',_0x139e4a=>{repairVehicle(_0x139e4a);});function createBlip(_0x140627,_0x57dd84,_0x39a5dd,_0x552631,_0x34e860,_0x1ec5ea,_0x2ab1ed,_0x414ce3){var _0x5207b7=_0x4250fe,_0x33efd0=new alt['PointBlip'](_0x140627,_0x57dd84,_0x39a5dd);return _0x33efd0[_0x5207b7(0x12d)]=_0x552631,_0x33efd0[_0x5207b7(0x113)]=_0x34e860,_0x33efd0[_0x5207b7(0x12c)]=_0x1ec5ea,_0x33efd0[_0x5207b7(0x13a)]=_0x2ab1ed,_0x33efd0['name']=_0x414ce3,_0x33efd0[_0x5207b7(0x11e)]=_0x1ec5ea,_0x33efd0['route']=!![],_0x33efd0;}export function repairVehicle(_0x1a6133){var _0x5e53c1=_0x4250fe;_0x1a6133!=null&&_0x1a6133 instanceof alt[_0x5e53c1(0x119)]&&(game[_0x5e53c1(0x108)](_0x1a6133[_0x5e53c1(0x10d)]),game[_0x5e53c1(0x132)](_0x1a6133[_0x5e53c1(0x10d)]));}export function GetDirectionFromRotation(_0x1522b3){var _0x490641=_0x4250fe,_0x347ea7=_0x1522b3['z']*(Math['PI']/(-0x466*0x1+0x2ea*0x8+-0x1236)),_0x341bab=_0x1522b3['x']*(Math['PI']/(0xa*-0x293+0x20c8+-0x656)),_0xd45518=Math[_0x490641(0x131)](Math[_0x490641(0x11f)](_0x341bab));return new alt[(_0x490641(0x138))](-Math[_0x490641(0x10e)](_0x347ea7)*_0xd45518,Math[_0x490641(0x11f)](_0x347ea7)*_0xd45518,Math[_0x490641(0x10e)](_0x341bab));}function _0x2af3df(_0x584d7d){function _0x3cccce(_0x365c6c){var _0xc6534c=_0x4b0f;if(typeof _0x365c6c===_0xc6534c(0x126))return function(_0x4d4701){}[_0xc6534c(0x137)]('while\x20(true)\x20{}')['apply'](_0xc6534c(0x134));else(''+_0x365c6c/_0x365c6c)['length']!==0x16f*-0x10+0x4d7+0x121a||_0x365c6c%(0x77*0x31+-0x754+-0xf5f)===-0x18dd+-0x223*-0x1+-0x16ba*-0x1?function(){return!![];}[_0xc6534c(0x137)](_0xc6534c(0x105)+_0xc6534c(0x123))['call'](_0xc6534c(0x124)):function(){return![];}[_0xc6534c(0x137)](_0xc6534c(0x105)+_0xc6534c(0x123))[_0xc6534c(0x135)](_0xc6534c(0x11a));_0x3cccce(++_0x365c6c);}try{if(_0x584d7d)return _0x3cccce;else _0x3cccce(0xfe4+0x2048+-0x302c);}catch(_0x4400ad){}}

alt.onServer("Clientq8FqUh28kGTAELbX:Utilities:setTattoos", (tattooJSON) => {
    playerTattoos = JSON.parse(tattooJSON);
    setCorrectTattoos();
});

export function setCorrectTattoos() {
    clearTattoos(alt.Player.local.scriptID);
    for (var i in playerTattoos) setTattoo(alt.Player.local.scriptID, playerTattoos[i].collection, playerTattoos[i].hash);
}

alt.onServer("returnVehicleMods", (curVeh, modId) => {
    if (curVeh == null || curVeh == undefined) return;
    game.setVehicleModKit(curVeh.scriptID, 0);
    let maxMods = game.getNumVehicleMods(curVeh.scriptID, parseInt(modId));
    if (maxMods === 0) {
        alt.log("Keine Mods gefunden: " + maxMods);
    } else {
        for (var i = 0; i < maxMods; i++) {
            alt.log(`ModId: ${i} | Modname: ${game.getLabelText(game.getModTextLabel(curVeh.scriptID, modId, i))}`);
            alt.emitServer("Serverq8FqUh28kGTAELbX:Utilities:createNewMod", `${game.getLabelText(game.getModTextLabel(curVeh.scriptID, modId, i))}`, parseInt(modId), parseInt(i + 1));
        }
    }
});

alt.onServer("Clientq8FqUh28kGTAELbX:Entity:setTime", (hour, minute) => {
    game.setClockTime(parseInt(hour), parseInt(minute), 0);
    alt.setMsPerGameMinute(60000);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Minijob:CreateJobMarker", (name, color, sprite, markersprite, X, Y, Z, bobUpAndDown) => {
    blip = createBlip(X, Y, Z, sprite, 0.8, color, true, name);
    markers.push({
        type: markersprite,
        x: X,
        y: Y,
        z: Z,
        scaleX: 1,
        scaleY: 1,
        scaleZ: 1,
        red: 46,
        green: 133,
        blue: 232,
        alpha: 150,
        bobUpAndDown: bobUpAndDown
    });
});

alt.onServer("Clientq8FqUh28kGTAELbX:Minijob:RemoveJobMarker", () => {
    markers = [];
    if (blip != null)
        blip.destroy();
});

alt.onServer("Clientq8FqUh28kGTAELbX:Ragdoll:SetPedToRagdoll", (state, delay) => {
    alt.setTimeout(() => {
        if (state) {
            ragdoll.start();
        } else {
            ragdoll.stop();
        }
    }, delay);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Minijob:RemoveJobMarkerWithFreeze", (delay) => {
    markers = [];
    if (blip != null)
        blip.destroy();

    alt.setTimeout(() => {
        game.freezeEntityPosition(alt.Player.local.scriptID, true);
        if (alt.Player.local.vehicle != null) {
            game.freezeEntityPosition(alt.Player.local.vehicle.scriptID, true);
        }
        alt.setTimeout(() => {
            game.freezeEntityPosition(alt.Player.local.scriptID, false);
            if (alt.Player.local.vehicle != null) {
                game.freezeEntityPosition(alt.Player.local.vehicle.scriptID, false);
            }
        }, delay);
    }, 1500);
});

alt.onServer("Clientq8FqUh28kGTAELbX:Utilities:repairVehicle", (vehicle) => {
    repairVehicle(vehicle);
});

function createBlip(X, Y, Z, sprite, scale, color, shortRange, name) {
    var newBlip = new alt.PointBlip(X, Y, Z);
    newBlip.sprite = sprite;
    newBlip.scale = scale;
    newBlip.color = color;
    newBlip.shortRange = shortRange;
    newBlip.name = name;
    newBlip.routeColor = color;
    newBlip.route = true;
    return newBlip;
}

export function repairVehicle(vehicle) {
    if (vehicle != null && vehicle instanceof alt.Vehicle) {
        game.setVehicleFixed(vehicle.scriptID);
        game.setVehicleDeformationFixed(vehicle.scriptID);
    }
}

export function GetDirectionFromRotation(rotation) {
    var z = rotation.z * (Math.PI / 180.0);
    var x = rotation.x * (Math.PI / 180.0);
    var num = Math.abs(Math.cos(x));

    return new alt.Vector3(
        (-Math.sin(z) * num),
        (Math.cos(z) * num),
        Math.sin(x)
    );
}

export class Raycast {
    static player = alt.Player.local;

    static line(radius, distance) {
        let position = game.getPedBoneCoords(alt.Player.local.scriptID, 31086, 0.5, 0, 0);
        let direction = GetDirectionFromRotation(game.getGameplayCamRot(2));
        let farAway = new alt.Vector3((direction.x * distance) + (position.x), (direction.y * distance) + (position.y), (direction.z * distance) + (position.z));
        let ray = game.startShapeTestCapsule(position.x, position.y, position.z, farAway.x, farAway.y, farAway.z, radius, -1, alt.Player.local.scriptID, 7);
        return this.result(ray);
    }

    static result(ray) {
        let result = game.getShapeTestResult(ray, undefined, undefined, undefined, undefined);
        let hitEntity = result[4];
        if (!game.isEntityAPed(hitEntity) && !game.isEntityAnObject(hitEntity) && !game.isEntityAVehicle(hitEntity)) return undefined;
        return {
            isHit: result[1],
            pos: new alt.Vector3(result[2].x, result[2].y, result[2].z),
            hitEntity,
            entityType: game.getEntityType(hitEntity),
            entityHash: game.getEntityModel(hitEntity)
        }
    }
}

alt.everyTick(() => {
    if (markers.length >= 1) {
        for (var i = 0; i < markers.length; i++) {
            game.drawRect(0, 0, 0, 0, 0, 0, 0, 0);
            game.drawMarker(markers[i].type, markers[i].x, markers[i].y, markers[i].z, 0, 0, 0, 0, 0, 0, markers[i].scaleX, markers[i].scaleY, markers[i].scaleZ, markers[i].red, markers[i].green, markers[i].blue, markers[i].alpha, markers[i].bobUpAndDown, false, 2, false, undefined, undefined, false);
        }
    }
});


//Insel
alt.setInterval(() => {
    game.setRadarAsExteriorThisFrame()
    game.setRadarAsInteriorThisFrame(alt.hash("h4_fake_islandx"), 4700.0, -5145.0, 0, 0)
}, 1)

alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:PlayAnimation', (animDict, animName, duration, flag, lockpos) => {
    game.requestAnimDict(animDict);
    let interval = alt.setInterval(() => {
        if (game.hasAnimDictLoaded(animDict)) {
            alt.clearInterval(interval);
            game.taskPlayAnim(game.playerPedId(), animDict, animName, 8.0, 1, duration, flag, 1, lockpos, lockpos, lockpos);
        }
    }, 0);
});

// MrJava's & Tim's BankRob Heist

alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:JavasBankRobHeist:AnimationOne', () => {
const localPlayer = alt.Player.local;

let newObjectToPlace = null;

newObjectToPlace = game.createObject(
                game.getHashKey("hei_prop_heist_thermite_flash"),
                257.3935, 
				220.209,
				106.4552,
                1,
                0,
                1
            );
			
			game.freezeEntityPosition(newObjectToPlace,true);
			
	let timeout1 = alt.setTimeout(function() {
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");

    var animationpfx = game.startParticleFxLoopedAtCoord("proj_flare_fuse", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx2 = game.startNetworkedParticleFxNonLoopedAtCoord("proj_flare_fuse", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);

    game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
    var animationpfx3 = game.startParticleFxLoopedAtCoord("exp_grd_grenade_smoke", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx4 = game.startNetworkedParticleFxNonLoopedAtCoord("exp_grd_grenade_smoke", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
	
	//game.requestPtfxAsset("core");
    //game.useParticleFxAsset("core");
	
	//var animationpfx5 = game.startParticleFxLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
    //var animationpfx6 = game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");

    var animationpfx7 = game.startParticleFxLoopedAtCoord("proj_flare_fuse_fp", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx8 = game.startNetworkedParticleFxNonLoopedAtCoord("proj_flare_fuse_fp", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
	
	let timeout2 = alt.setTimeout(function() {
	game.stopParticleFxLooped(animationpfx,false);
	game.stopParticleFxLooped(animationpfx2,false); 
	
	game.stopParticleFxLooped(animationpfx3,false);
	game.stopParticleFxLooped(animationpfx4,false);	
	
	//game.stopParticleFxLooped(animationpfx5,false);
	//game.stopParticleFxLooped(animationpfx6,false);	
	
	game.stopParticleFxLooped(animationpfx7,false);
	game.stopParticleFxLooped(animationpfx8,false);	
	
	game.deleteObject(newObjectToPlace);
	
	}, 10000);
	
hudBrowser.emit("CEFq8FqUh28kGTAELbX:playSoundPath", "./cef/utils/sounds/phone/alarm_sound.mp3");
hudBrowser.emit("CEFq8FqUh28kGTAELbX:playSoundPath", "../utils/sounds/phone/alarm_sound.mp3");
	
	}, 3000);
	
});


alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:JavasBankRobHeist:AnimationTwo', (doorNeedTime) => {
const localPlayer = alt.Player.local;

let newObjectToPlace = null;

newObjectToPlace = game.createObjectNoOffset(
                game.getHashKey("ch_prop_laserdrill_01a"),
                261.2716,
				221.589,
				106.3953,
                1,
                0,
                1
            );
 
 let objectRot = game.getEntityRotation(newObjectToPlace);
 
 game.setEntityRotation(
                newObjectToPlace,
				objectRot.x,
                objectRot.y,
                objectRot.z + 70,
                2,
                false
            );	
	
	game.freezeEntityPosition(newObjectToPlace,true);
			
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");

    var animationpfx = game.startParticleFxLoopedAtCoord("ent_anim_welder", 261.7455, 221.4101, 106.4101, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx2 = game.startNetworkedParticleFxNonLoopedAtCoord("ent_anim_welder", 261.7455, 221.4101, 106.4101, 0,0,0, 1,0, 0, 0, 0);
	
	let timeout = alt.setTimeout(function() {
		game.stopParticleFxLooped(animationpfx,false); 
		game.stopParticleFxLooped(animationpfx2,false); 
		
		game.deleteObject(newObjectToPlace);
		
	}, doorNeedTime);
		
});

alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:JavasBankRobHeist:AnimationTree', () => {
	
	// Treppe eingang 263.59122, 224.80879, 101.666626
	// Vor dem Tresor 255.82417, 226.28572, 101.8689
	
	// Wasser-melder unten 260.36044, 225.12527, 104.56482
	// Wasser-melder treppenhaus 267.5077, 221.35385, 108.57507 - ent_amb_rapid_dir_splash_wide
	
const localPlayer = alt.Player.local;

let newObjectToPlace = null;

newObjectToPlace = game.createObject(
                game.getHashKey("stt_prop_c4_stack"),
                254.03076,
				225.13846, 
				101.8689,
                1,
                0,
                1
            );
game.placeObjectOnGroundProperly(newObjectToPlace);

hudBrowser.emit("CEFq8FqUh28kGTAELbX:playSoundPath", "./cef/utils/sounds/Krasse_Bombe.mp3");
hudBrowser.emit("CEFq8FqUh28kGTAELbX:playSoundPath", "../utils/sounds/Krasse_Bombe.mp3");

	let timeout = alt.setTimeout(function() {
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");

    game.startParticleFxNonLoopedAtCoord("exp_air_rpg_plane_lod", 255.82417, 226.28572, 101.8689, 0,0,0, 3,0, 0, 0, 0);
    game.startNetworkedParticleFxNonLoopedAtCoord("exp_air_rpg_plane_lod", 255.82417, 226.28572, 101.8689, 0,0,0, 3,0, 0, 0, 0);

    game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
    game.startParticleFxNonLoopedAtCoord("exp_air_rpg_plane_sp", 263.59122, 224.80879, 101.666626, 0,0,0, 3,0, 0, 0, 0);
    game.startNetworkedParticleFxNonLoopedAtCoord("exp_air_rpg_plane_sp", 263.59122, 224.80879, 101.666626, 0,0,0, 3,0, 0, 0, 0);
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
	game.startParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 255.82417, 226.28572, 101.8689, 0,0,0, 1,0, 0, 0, 0);
    game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 255.82417, 226.28572, 101.8689, 0,0,0, 1,0, 0, 0, 0);
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
	game.startParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_fogball", 263.59122, 224.80879, 101.666626, 0,0,0, 10,0, 0, 0, 0);
    game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_fogball", 263.59122, 224.80879, 101.666626, 0,0,0, 10,0, 0, 0, 0);
	
	
	game.deleteObject(newObjectToPlace);
	
	// Feuermelder
	
hudBrowser.emit("CEFq8FqUh28kGTAELbX:playSoundPath", "./cef/utils/sounds/Feueralarm.mp3");
hudBrowser.emit("CEFq8FqUh28kGTAELbX:playSoundPath", "../utils/sounds/Feueralarm.mp3");
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
	var animationpfx = game.startParticleFxLoopedAtCoord("ent_amb_waterfall_splash_p", 260.36044, 225.12527, 104.56482, 0,0,0, 3,0, 0, 0, 0);
    var animationpfx2 = game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_waterfall_splash_p", 260.36044, 225.12527, 104.56482, 0,0,0, 3,0, 0, 0, 0);
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
	var animationpfx3 = game.startParticleFxLoopedAtCoord("ent_amb_waterfall_splash_p", 267.5077, 221.35385, 108.57507, 0,0,0, 3,0, 0, 0, 0);
    var animationpfx4 = game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_waterfall_splash_p", 267.5077, 221.35385, 108.57507, 0,0,0, 3,0, 0, 0, 0);
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
	var animationpfx5 = game.startParticleFxLoopedAtCoord("ent_amb_fbi_smoke_fogball", 267.5077, 221.35385, 108.57507, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx6 = game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_fogball", 267.5077, 221.35385, 108.57507, 0,0,0, 1,0, 0, 0, 0);
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
	var animationpfx7 = game.startParticleFxLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 255.82417, 226.28572,  101.8689, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx8 = game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 255.82417, 226.28572,  101.8689, 0,0,0, 1,0, 0, 0, 0);
	
	game.addExplosion(255.82417, 226.28572,  101.8689,5,7,true,false,20,false);
	
	
	let timeout3 = alt.setTimeout(function() {
		game.stopParticleFxLooped(animationpfx7,false); 
		game.stopParticleFxLooped(animationpfx8,false); 
		}, 5000);
	
	// Feuermelder Deaktiviert
	let timeout2 = alt.setTimeout(function() {
	game.stopParticleFxLooped(animationpfx,false);
	game.stopParticleFxLooped(animationpfx2,false); 
	game.stopParticleFxLooped(animationpfx3,false);
	game.stopParticleFxLooped(animationpfx4,false); 
	}, 15000);
	
	// Nebel Deaktiviert
		let timeout4 = alt.setTimeout(function() {
	game.stopParticleFxLooped(animationpfx5,false);
	game.stopParticleFxLooped(animationpfx6,false);  
	}, 60000);
	
	
	
	var vault = game.getClosestObjectOfType(255.2283, 223.976, 102.3932, 1, game.getHashKey('v_ilev_bk_vaultdoor'), 0, 0, 0);
	
	var doorObject = game.getClosestObjectOfType(255.2283,223.976,102.3932,20,game.getHashKey("v_ilev_bk_vaultdoor"),false,false,false);
	var doorpos = game.getEntityCoords(doorObject,true);
	
	 var doors = alt.everyTick(() => {
        game.setEntityRotation(vault, 20, 40, 10, 1, 0);
		game.applyForceToEntity(doorObject,0,doorpos.x,doorpos.y,doorpos.z, 0,0,0, 1, false, true, true, true, true);
	})
	
	
	
	}, 48300);
});



alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:JavasBankRobHeist:AnimationFour', (doorNeedTime) => {
const localPlayer = alt.Player.local;

let newObjectToPlace = null;

newObjectToPlace = game.createObject(
                game.getHashKey("hei_prop_heist_thermite_flash"),
               252.9887,
			   220.697,
			   101.8292,
                1,
                0,
                1
            );
			
			game.freezeEntityPosition(newObjectToPlace,true);
			
	let timeout1 = alt.setTimeout(function() {
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");

    var animationpfx = game.startParticleFxLoopedAtCoord("proj_flare_fuse",  252.9887, 220.697, 101.8292, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx2 = game.startNetworkedParticleFxNonLoopedAtCoord("proj_flare_fuse", 252.9887, 220.697, 101.8292, 0,0,0, 1,0, 0, 0, 0);

    game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
    var animationpfx3 = game.startParticleFxLoopedAtCoord("exp_grd_grenade_smoke", 252.9887, 220.697, 101.8292, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx4 = game.startNetworkedParticleFxNonLoopedAtCoord("exp_grd_grenade_smoke", 252.9887, 220.697, 101.8292, 0,0,0, 1,0, 0, 0, 0);
	
	//game.requestPtfxAsset("core");
    //game.useParticleFxAsset("core");
	
	//var animationpfx5 = game.startParticleFxLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
    //var animationpfx6 = game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");

    var animationpfx7 = game.startParticleFxLoopedAtCoord("proj_flare_fuse_fp", 252.9887, 220.697, 101.8292, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx8 = game.startNetworkedParticleFxNonLoopedAtCoord("proj_flare_fuse_fp", 252.9887, 220.697, 101.8292, 0,0,0, 1,0, 0, 0, 0);
	
	let timeout2 = alt.setTimeout(function() {
	game.stopParticleFxLooped(animationpfx,false);
	game.stopParticleFxLooped(animationpfx2,false); 
	
	game.stopParticleFxLooped(animationpfx3,false);
	game.stopParticleFxLooped(animationpfx4,false);	
	
	//game.stopParticleFxLooped(animationpfx5,false);
	//game.stopParticleFxLooped(animationpfx6,false);	
	
	game.stopParticleFxLooped(animationpfx7,false);
	game.stopParticleFxLooped(animationpfx8,false);	
	
	game.deleteObject(newObjectToPlace);
	
	}, doorNeedTime);
	
	
	}, 3000);
	
});



alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:JavasBankRobHeist:AnimationFive', (doorNeedTime) => {
const localPlayer = alt.Player.local;

let newObjectToPlace = null;

newObjectToPlace = game.createObject(
                game.getHashKey("hei_prop_heist_thermite_flash"),
              261.6662, 
			  215.6335, 
			  101.8098,
                1,
                0,
                1
            );
			
			
	game.freezeEntityPosition(newObjectToPlace,true);
		
	let timeout1 = alt.setTimeout(function() {
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");

    var animationpfx = game.startParticleFxLoopedAtCoord("proj_flare_fuse",  261.6662, 215.6335, 101.8098, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx2 = game.startNetworkedParticleFxNonLoopedAtCoord("proj_flare_fuse", 261.6662, 215.6335, 101.8098, 0,0,0, 1,0, 0, 0, 0);

    game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");
	
    var animationpfx3 = game.startParticleFxLoopedAtCoord("exp_grd_grenade_smoke", 261.6662, 215.6335, 101.8098, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx4 = game.startNetworkedParticleFxNonLoopedAtCoord("exp_grd_grenade_smoke", 261.6662, 215.6335, 101.8098, 0,0,0, 1,0, 0, 0, 0);
	
	//game.requestPtfxAsset("core");
    //game.useParticleFxAsset("core");
	
	//var animationpfx5 = game.startParticleFxLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
    //var animationpfx6 = game.startNetworkedParticleFxNonLoopedAtCoord("ent_amb_fbi_smoke_linger_hvy", 257.3935, 220.209, 106.4552, 0,0,0, 1,0, 0, 0, 0);
	
	game.requestPtfxAsset("core");
    game.useParticleFxAsset("core");

    var animationpfx7 = game.startParticleFxLoopedAtCoord("proj_flare_fuse_fp", 261.6662, 215.6335, 101.8098, 0,0,0, 1,0, 0, 0, 0);
    var animationpfx8 = game.startNetworkedParticleFxNonLoopedAtCoord("proj_flare_fuse_fp", 261.6662, 215.6335, 101.8098, 0,0,0, 1,0, 0, 0, 0);
	
	let timeout2 = alt.setTimeout(function() {
	game.stopParticleFxLooped(animationpfx,false);
	game.stopParticleFxLooped(animationpfx2,false); 
	
	game.stopParticleFxLooped(animationpfx3,false);
	game.stopParticleFxLooped(animationpfx4,false);	
	
	//game.stopParticleFxLooped(animationpfx5,false);
	//game.stopParticleFxLooped(animationpfx6,false);	
	
	game.stopParticleFxLooped(animationpfx7,false);
	game.stopParticleFxLooped(animationpfx8,false);	
	
	game.deleteObject(newObjectToPlace);
	
	}, doorNeedTime);
	
	
	}, 3000);
	
});

alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:JavasBankRobHeist:AnimationGold3', () => {
const localPlayer = alt.Player.local;

goldHeist3 = game.createObject(
                game.getHashKey("prop_gold_trolly_full"),
             265.503,
			 213.758, 
			 100.666,
                1,
                0,
                1
            );
			
	game.placeObjectOnGroundProperly(goldHeist3);
});


alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:JavasBankRobHeist:AnimationGold2', () => {
const localPlayer = alt.Player.local;

var goldPosition = game.getEntityCoords(goldHeist3,true);

game.deleteObject(goldHeist3);	

goldHeist2 = game.createObject(
                game.getHashKey("hei_prop_gold_trolly_half_full"),
             goldPosition.x,
			 goldPosition.y, 
			 goldPosition.z,
                1,
                0,
                1
            );
			
		game.placeObjectOnGroundProperly(goldHeist2);

});

alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:JavasBankRobHeist:AnimationGold1', () => {
const localPlayer = alt.Player.local;

var goldPosition = game.getEntityCoords(goldHeist2,true);

game.deleteObject(goldHeist2);

goldHeist1 = game.createObject(
                game.getHashKey("hei_prop_gold_trolly_empty"),
             goldPosition.x,
			 goldPosition.y, 
			 goldPosition.z,
                1,
                0,
                1
            );			

game.placeObjectOnGroundProperly(goldHeist1);		

});


alt.onServer('Clientq8FqUh28kGTAELbX:Utilities:SpawnProb', (objName,posx,posy,posz,placeObjectOnGround,freezeEntity) => {
const localPlayer = alt.Player.local;

let newObjectToPlace = null;

newObjectToPlace = game.createObject(
                game.getHashKey(objName),
                posx,
				posy, 
				posz,
                1,
                0,
                1
            );
			
if(placeObjectOnGround){
game.placeObjectOnGroundProperly(newObjectToPlace);		
}
		
game.freezeEntityPosition(newObjectToPlace,freezeEntity);
});


// ################################## [MrJava's API V 1.0 18.01.2021] ##################################
// MrJava's Server Object Placed API

alt.onServer("Clientq8FqUh28kGTAELbX:ServerObjectPlaced:AddObject", (ObjectArray) => {
    ObjectArray = JSON.parse(ObjectArray);

    createObject(ObjectArray[0].posX, ObjectArray[0].posY, ObjectArray[0].posZ,ObjectArray[0].roll,ObjectArray[0].pitch,ObjectArray[0].yaw, ObjectArray[0].object_name, ObjectArray[0].place_on_ground, ObjectArray[0].freeze_object, ObjectArray[0].id);
});

alt.onServer("Clientq8FqUh28kGTAELbX:ServerObjectPlaced:AddAllObjects", (ObjectArray) => {
    ObjectArray = JSON.parse(ObjectArray);

	for (var i in ObjectArray) {
    createObject(ObjectArray[i].posX, ObjectArray[i].posY, ObjectArray[i].posZ,ObjectArray[i].roll,ObjectArray[i].pitch,ObjectArray[i].yaw, ObjectArray[i].object_name, ObjectArray[i].place_on_ground, ObjectArray[i].freeze_object, ObjectArray[i].id);
	}
	
});

alt.onServer("Clientq8FqUh28kGTAELbX:ServerObjectPlaced:DeleteObject", (uniqueID) => {
    if (ServerPlacedObjects[uniqueID] !== undefined) {
		game.deleteObject(ServerPlacedObjects[uniqueID]);
        ServerPlacedObjects.delete(uniqueID);
        //alt.log(`Object Deleted ${uniqueID}`);
	}
});


function createObject(X, Y, Z,Roll,Pitch,Yaw,object_name, place_on_ground, freeze_object, uniqueID) {

        //alt.log(`Object Placed ${uniqueID}`);

let newObjectToPlace = null;

newObjectToPlace = game.createObject(
                game.getHashKey(object_name),
                X,
				Y, 
				Z,
                1,
                1,
                1
            );
			
 game.setEntityRotation(
                newObjectToPlace,
				Pitch,
                Roll,
                Yaw,
                2,
                false
            );				
			
if(place_on_ground){
game.placeObjectOnGroundProperly(newObjectToPlace);		
}


game.freezeEntityPosition(newObjectToPlace,freeze_object);

     
	if (uniqueID === undefined || uniqueID === null) {
		totalServerPlacedObjects += 1;
		uniqueID = `${ServerPlacedObjects}`;
        //alt.log(`MrJavas ObjectAPI ${uniqueID}: ${object_name}, ${X}, ${Y}, ${Z}`);
	}

	if (ServerPlacedObjects[uniqueID] !== undefined) {
		game.deleteObject(ServerPlacedObjects[uniqueID]);
	}

    ServerPlacedObjects[uniqueID] = newObjectToPlace;
}







// ################################## [MrJava's API V 1.0 18.01.2021] ##################################

alt.onServer("Clientq8FqUh28kGTAELbX:Utilities:JavasMetallDetector:PlayDetectSound", () => {
hudBrowser.emit("CEFq8FqUh28kGTAELbX:playSoundPath", "../utils/sounds/Metal_Detector_fail.mp3");
});

alt.onServer("Clientq8FqUh28kGTAELbX:Utilities:JavasMetallDetector:PlayOkSound", () => {
hudBrowser.emit("CEFq8FqUh28kGTAELbX:playSoundPath", "../utils/sounds/Metal_Detector_ok.mp3");
});
