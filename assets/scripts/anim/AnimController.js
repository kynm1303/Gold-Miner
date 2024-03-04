// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



import {AnimConfig} from "../config/AnimConfig";

cc.Class({
    extends: cc.Component,
    anims: null,

    properties: {
        explosion: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.anims = {};
        this.anims[AnimConfig.EXPLOSION] = this.explosion;
    },

    start () {
    },

    createAnim: function (name) {
        if (this.anims[name] == null) return;
        const anim = cc.instantiate(this.anims[name]);
        return anim;
    },
});