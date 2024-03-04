// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:


import {GameConfig} from "./config/GameConfig";
import {MINING_CONFIG} from "./config/MiningObjectConfig";

var ObjectType = cc.Enum({
    BIG_GOLD: 0,
    MED_GOLD: 1,
    SMALL_GOLD: 2,
    MED_STONE: 3,
    SMALL_STONE: 4,
    DIAMOND: 5,
    MONEY_PACK: 6,
})

cc.Class({
    extends: cc.Component,
    Mass: 0,
    Price: 0,

    properties: {
        LabelName: {
            default: null,
            type: cc.Label,
        },
        Type: {
            default: ObjectType.SMALL_GOLD,
            type: ObjectType,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // cc.log("MiningObject", "onLoad");
        this._collider = this.getComponent(cc.BoxCollider);
        this._sprite = this.getComponent(cc.Sprite);
        this.loadConfig();
        // cc.log("MiningObject", "onLoad", "sprite", this._sprite);
    },

    loadConfig() {
        this._type = ObjectType[this.Type];
        this.loadTexture();
        this.LabelName.string = this._type;
        this.Mass = MINING_CONFIG.MASS[this._type];
        this.Price = MINING_CONFIG.PRICE[this._type];
        cc.log("MiningObject", "loadConfig", this.Mass, this.Price);
    },

    /**
     * @param {cc.Vec2} pos
     * @param {string} type
    * */
    setConfig: function ({pos, type}) {
        this._type = type;
        this._moveable = false;
        this.node.setPosition(pos);
        // this.node.setContentSize(MINING_CONFIG.OBJECT_SIZE[type]);
        // cc.log(this._sprite);
        // cc.log("MiningObject", "setConfig");
    },

    loadTexture: function () {
        const res = MINING_CONFIG.getObjectRes(this._type);
        cc.loader.loadRes(res, cc.SpriteFrame, function (err, spriteFrame) {
            this._sprite.spriteFrame = spriteFrame;
            this._collider.size = spriteFrame.getOriginalSize();
            cc.log("Mining Object", "loadTexture", JSON.stringify(this._collider.size));
        }.bind(this));
    },

    setColliderSize (size) {
        this._collider.width = size.width;
        this._collider.height = size.height;
    },

    start () {
        this.node.setScale(0);
        this.node.runAction(
            cc.scaleTo(0.3, 1)
        );
        // cc.log("Mining Object", "_colliderSize", this._collider.size);
        // cc.log("Mining Object", "children", this._labelNode);
        // cc.log("Mining Object", "getChildByName", this.node.getChildByName("LabelName"));
        // cc.log("MiningObject", "start");
        // this.LabelName.string = "type";
        // cc.log("MiningObject", "start", "collider", this._collider);
    },
    // update (dt) {},
});
