// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {g_gameController} from "../GameController";
import {Utils} from "../Utils";
import {LevelConfig} from "../config/LevelConfig";

cc.Class({
    extends: cc.Component,

    properties: {
        LabelGoal: {
            default: null,
            type: cc.Node,
        },
        LabelLevel: {
            default: null,
            type: cc.Node,
        }
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    getGoal: function (currentLevelIndex) {
        if (currentLevelIndex >= LevelConfig.GOAL.length)
            return "1000";
        return (LevelConfig.GOAL[currentLevelIndex]).toString();
    },

    setInfo: function () {
        var currentLevelIndex = g_gameController._levelController.levelIndex;
        Utils.setNodeString(this.LabelLevel, "Level " + (currentLevelIndex + 1).toString());
        const goal = this.getGoal(currentLevelIndex);
        Utils.setNodeString(this.LabelGoal, "$" + goal);
    },

    // update (dt) {},
});
