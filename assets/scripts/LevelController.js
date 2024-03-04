// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {MINING_CONFIG} from "./config/MiningObjectConfig";
import {Utils} from "./Utils";

cc.Class({
    extends: cc.Component,

    levelIndex: 0,
    currentLevel: null,
    properties: {
        LevelList: {
            default: [],
            type: cc.Prefab,
        },
        LevelNode: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    initLevel: function () {
        this.levelIndex = -1;
        cc.log("LevelController", "initLevel");
    },

    nextLevel: function () {
        this.levelIndex++;
    },

    loadLevel: function () {
        this.clearLevel();
        var levelPrefab ;
        if (this.levelIndex > this.LevelList.length)
            levelPrefab = this.LevelList[this.LevelList.length - 1];
        else
            levelPrefab = this.LevelList[this.levelIndex]
        this.currentLevel = cc.instantiate(levelPrefab);
        if (this.LevelNode) {
            this.LevelNode.addChild(this.currentLevel);
        }
    },

    clearLevel: function () {
        if (this.currentLevel != null && this.currentLevel.getParent() != null)
            this.currentLevel.removeFromParent();
        this.currentLevel = null;
        cc.log("LevelController", "clearLevel");
    },

    // clearAllMiningObjects: function () {
    //     for (let miningObject of this._miningObjects) {
    //         if (miningObject.getParent()) {
    //             miningObject.removeFromParent(true);
    //         }
    //     }
    //     this._miningObjects = [];
    // },

    // checkObjectCollide: function (configs, objectType) {
    //     let newPos = this.randomPos();
    //     while (true) {
    //         let pass = true;
    //         newPos = this.randomPos();
    //         let newRect = MINING_CONFIG.rectFromCfg(newPos, objectType);
    //         for (let cfg of configs) {
    //             let oldRect = MINING_CONFIG.rectFromCfg(cfg.pos, cfg.type);
    //             if (newRect.intersects(oldRect)) {
    //                 pass = false;
    //                 break;
    //             }
    //         }
    //         if (pass) break;
    //     }
    //     // this.debugMiningObject(newPos, objectType);
    //     return newPos;
    // },
    //
    // generateMap: function () {
    //     this.clearAllMiningObjects();
    //     const miningConfigs = MINING_CONFIG.generateConfig();
    //     const cfgs = [];
    //     // cc.log("generateMap", miningConfigs);
    //     for (let miningConfig of miningConfigs) {
    //         for (let count = miningConfig.count; count >= 0; count--) {
    //             const pos = this.checkObjectCollide(cfgs, miningConfig.type);
    //             const config = {pos, type: miningConfig.type};
    //             cfgs.push(config);
    //             this.createMiningObjects(config)
    //         }
    //     }
    //     return cfgs;
    // },
    //
    // createMiningObjects: function ({pos, type}) {
    //     // const newNode = cc.instantiate(this.miningObjectPrefab);
    //     // this._miningObjects.push(newNode);
    //     // this.node.addChild(newNode);
    //     // const miningObjectController = newNode.getComponent("MiningObjectController");
    //     // miningObjectController.setConfig({pos, type});
    // },
    //
    // randomPos: function () {
    //     return Utils.randomPos(this._maxX, this._minX, this._maxY, this._minY);
    // },
    //
    // debugMiningObject: function (newPos, objectType) {
    //     const rect = MINING_CONFIG.rectFromCfg(newPos, objectType);
    //     const ctx = this.node.getComponent(cc.Graphics);
    //     ctx.lineWidth = 6;
    //     ctx.strokeColor = cc.Color.RED;
    //     ctx.rect(rect.x, rect.y, rect.width, rect.height);
    //     ctx.stroke();
    // },

    // update (dt) {},
});
