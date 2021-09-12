// const curve = require('curve25519-js')
// const ed2curve = require('ed2curve')
// const nacl = require('tweetnacl')
// nacl.util = require('tweetnacl-util')

// const SEED =  '724b092810ec86d7e35c9d067702b31ef90bc43a7b5'

// const aPrivate = '+BdrYBg9QHQk0IiGmlxNUv1wNWhHsqathY9br5zvSmw='
// const aPublic = 'KBEwODiGuqAZoE5s+CIB/Y8tm20ORH+BcC2+5uiBj0w='

// const {private, public} = curve.generateKeyPair(Uint8Array.from(Buffer.from(SEED, 'base64')))
// const privateKey = Buffer.from(private).toString('base64')
// const publicKey = Buffer.from(public).toString('base64')

// let aDHPPublicKey = ed2curve.convertPublicKey(aPublic)
// let aDHSecretKey = ed2curve.convertSecretKey(aPrivate)

// let DHSecretKey = ed2curve.convertSecretKey(privateKey)
// let DHPublic = ed2curve.convertPublicKey(publicKey)

// let msg = nacl.util.decodeUTF8('Pigeon')
// let nonce = nacl.randomBytes(nacl.box.nonceLength)
// let encryptedMessage = nacl.box(msg, nonce, DHPublic, aDHSecretKey)
// console.log(Buffer.from(encryptedMessage).toString('base64'))

// // let secret = 'UyNk0Ml2LWgHMK2pmIWYoXJYFCD+o909BUbSlDd/kWbZPA=='
// // let secret = 'ZU7+uv1hUE9bweLPqhOUkIlZHZFiqdvEaL3ASqqsLPoHLg=='
// let secret = 'KlykglVwEs2ikcADBuU77pOlDMfxzQKA8bHqjkypwafQ+A=='
// let secretMsg = Uint8Array.from(Buffer.from(secret, 'base64'))
// console.log(secretMsg)
// console.log('----')
// let decryptedMessage = nacl.box.open(secretMsg, nonce, aDHPPublicKey, DHSecretKey)
// console.log(decryptedMessage)
// console.log('====')
// // let message = new TextDecoder().decode(decryptedMessage)
// // console.log(message)

// // let S = Uint8Array.from(Buffer.from('BdrYBg9QHQk0IiGmlxNUv1wNWhHsqathY9br5zvSmw2', 'base64'))
// // let userKey = curve.generateKeyPair(S)
// // let userPrivate = userKey.private
// // let userPublic = userKey.public

// // let serverKey = curve.generateKeyPair(Uint8Array.from(Buffer.from(SEED, 'base64')))
// // let serverPublic = serverKey.public
// // let serverPrivate = serverKey.private

// // const secret = curve.sharedKey(userPrivate, serverPublic);
// // console.log('Secret:', Buffer.from(secret).toString('base64'))
// // const msg = Uint8Array.from(Buffer.from("Pigeon", 'base64'))
// // let signed = curve.signMessage(secret, msg)
// // let signature = curve.sign(userPrivate, msg)
// // let verified = curve.verify(serverPublic, msg, signature)
// // console.log(verified)
// // console.log(signed)
// // let opened = curve.openMessage(serverPublic, signed)
// // console.log(opened)

