import {Utils} from "../Utils";

export const MINING_CONFIG = {}

MINING_CONFIG.MASS = {
    BIG_GOLD: 300,
    MED_GOLD: 200,
    SMALL_GOLD: 100,
    SMALL_STONE: 300,
    MED_STONE: 500,
    DIAMOND: 100,
    MONEY_PACK: 100
}

MINING_CONFIG.COUNT = {
    BIG_GOLD: {min: 1, max: 2},
    MED_GOLD: {min: 3, max: 4},
    SMALL_GOLD: {min: 4, max: 5},
    MED_STONE: {min: 3, max: 5},
    SMALL_STONE: {min: 3, max: 5},
    DIAMOND: {min: 0, max: 1},
    MONEY_PACK: {min: 1, max: 2},
}

MINING_CONFIG.OBJECT_SIZE = {
    BIG_GOLD: {"width": 101,"height": 100},
    MED_GOLD: {"width":79,"height":66},
    SMALL_GOLD: {"width":45,"height":42},
    MED_STONE: {"width":100,"height":100},
    SMALL_STONE: {"width":70,"height":65},
    DIAMOND: {"width":50,"height":40},
    MONEY_PACK: {"width":50,"height":63}
}

MINING_CONFIG.PRICE = {
    BIG_GOLD: 200,
    MED_GOLD: 100,
    SMALL_GOLD: 50,
    MED_STONE: 20,
    SMALL_STONE: 10,
    DIAMOND: 500,
    MONEY_PACK: 300,
}

MINING_CONFIG.randomCountByType = function (type) {
    const countRange = MINING_CONFIG.COUNT[type];
    return Utils.randomRange(countRange.min, countRange.max);
}

MINING_CONFIG.generateConfig = function () {
    const miningCfgs = [
        {type: "BIG_GOLD"},
        {type: "MED_GOLD"},
        {type: "SMALL_GOLD"},
        {type: "SMALL_STONE"},
        {type: "MED_STONE"},
        {type: "DIAMOND"},
        {type: "MONEY_PACK"},
    ]
    let configs = [];
    for (let miningCfg of miningCfgs) {
        miningCfg.count = MINING_CONFIG.randomCountByType(miningCfg.type);
        configs.push(miningCfg);
    }
    return configs;
}

MINING_CONFIG.getObjectRes = function (type) {
    return {
        BIG_GOLD: "mo_big_gold",
        MED_GOLD: "mo_med_gold",
        SMALL_GOLD: "mo_small_gold",
        MED_STONE: "mo_big_stone",
        SMALL_STONE: "mo_med_stone",
        DIAMOND: "mo_diamond",
        MONEY_PACK: "mo_money"
    }[type]
}

MINING_CONFIG.rectFromCfg = function (pos, type) {
    const size = MINING_CONFIG.OBJECT_SIZE[type];
    return cc.rect(pos.x - size.width/2, pos.y - size.height/2, size.width, size.height);
}
