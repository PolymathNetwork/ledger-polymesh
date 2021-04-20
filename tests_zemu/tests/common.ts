// @ts-ignore
import {blake2bFinal, blake2bInit, blake2bUpdate} from "blakejs";
// @ts-ignore
import ed25519 from "ed25519-supercop";
import {DeviceModel} from "@zondax/zemu";

const Resolve = require("path").resolve;

export const APP_SEED = "equip will roof matter pink blind book anxiety banner elbow sun young"

const APP_PATH_S = Resolve("../app/output/app_s.elf");
const APP_PATH_X = Resolve("../app/output/app_x.elf");

export const models: DeviceModel[] = [
    {name: 'nanos', prefix: 'S', path: APP_PATH_S},
    {name: 'nanox', prefix: 'X', path: APP_PATH_X}
]
