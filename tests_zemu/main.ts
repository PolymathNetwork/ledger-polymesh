import Zemu, { DeviceModel, DEFAULT_START_OPTIONS } from '@zondax/zemu'
import { newPolymeshApp } from '@zondax/ledger-substrate'

// @ts-ignore
import ed25519 from 'ed25519-supercop'
// @ts-ignore
import { blake2bFinal, blake2bInit, blake2bUpdate } from 'blakejs'

const Resolve = require('path').resolve

const APP_SEED = 'equip will roof matter pink blind book anxiety banner elbow sun young'

const APP_PATH_S = Resolve('../app/output/app_s.elf')
const APP_PATH_X = Resolve('../app/output/app_x.elf')

const models: DeviceModel[] = [
  //{ name: 'nanos', prefix: 'S', path: APP_PATH_S },
  { name: 'nanox', prefix: 'X', path: APP_PATH_X },
]

//const signExtra = 'd503ae1103008ed73e0db80b0000010000006fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f40636fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f4063'
const txData =
  '050000ca1ef1d326bd379143d6e743f6c3b51b7058d07e02e4614dc027e05bdb226c6503d2029649d503ae1103008ed73e0db80b0000010000006fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f40636fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f4063'
  //'0707b25410b3811e1e3cb01eba65b59541c7999ef04c508475b96ab5fce891d36e180627014c454400000000000000000000d503ae1103008ed73e0db80b0000010000006fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f40636fbd74e5e1d0a61d52ccfe9d4adaed16dd3a7caa37c6bc4d0c2fa12e8b2f4063'

const defaultOptions = {
  ...DEFAULT_START_OPTIONS,
  startDelay: 3500,
  logging: true,
  custom: `-s "${APP_SEED}"`,
  X11: true,
}

const run_test = async (m: DeviceModel) => {
  await Zemu.checkAndPullImage()

  console.log("Create Sim");
  const sim = new Zemu(m.path)
  try {
    console.log("Start Sim");
    await sim.start({ ...defaultOptions, model: m.name })
    const app = newPolymeshApp(sim.getTransport())
    const pathAccount = 0x80000000
    const pathChange = 0x80000000
    const pathIndex = 0x80000000

    const txBlob = Buffer.from(txData, 'hex')

    /*
    const responseAddr = await app.getAddress(pathAccount, pathChange, pathIndex)
    const pubKey = Buffer.from(responseAddr.pubKey, 'hex')
    */

    console.log("Start sign request");
    const signatureRequest = app.sign(pathAccount, pathChange, pathIndex, txBlob)

    const signatureResponse = await signatureRequest
    console.log("Got sign response:");
    console.log(signatureResponse)

    expect(signatureResponse.return_code).toEqual(0x9000)
    expect(signatureResponse.error_message).toEqual('No errors')

    // Now verify the signature
    /*
    let prehash = txBlob
    if (txBlob.length > 256) {
      const context = blake2bInit(32)
      blake2bUpdate(context, txBlob)
      prehash = Buffer.from(blake2bFinal(context))
    }
    const valid = ed25519.verify(signatureResponse.signature.slice(1), prehash, pubKey)
    expect(valid).toEqual(true)
    */
  } finally {
    console.log("Close Sim");
    await sim.close()
  }
  console.log("Finished");
};

models.forEach((m) => {
  run_test(m).catch((err) => {
    console.log(`err: ${err}`);
  })
});

