const ecc = require("tiny-secp256k1");
const { generateMnemonic, mnemonicToSeedSync } = require("bip39");
const { BIP32Factory } = require("bip32");
const { payments } = require("bitcoinjs-lib");

const bip32 = BIP32Factory(ecc);

// Generate a 12-word seed
const generateSeed = () => {
  const mnemonic = generateMnemonic(); // Generate random mnemonic
  return mnemonic;
};

// Convert seed to root key
const getRootKey = (mnemonic) => {
  const seed = mnemonicToSeedSync(mnemonic); // Convert mnemonic to seed
  const root = bip32.fromSeed(seed); // Generate the root key from seed
  return root;
};

// Generate private and public key pair
const generateKeyPair = (root) => {
  const path = "m/44'/0'/0'/0/0"; // Standard path for Bitcoin
  const account = root.derivePath(path); // Derive key pair from the path
  const privateKey = account.privateKey.toString(); // Private key in hex format
  const publicKey = account.publicKey.toString(); // Public key in hex format
  return { privateKey, publicKey, account };
};

// Generate Bitcoin SegWit address
const generateAddress = (account) => {
  const pubkeyBuffer = Buffer.from(account.publicKey); // Convert public key hex string to buffer
  const { address } = payments.p2wpkh({ pubkey: pubkeyBuffer });
  return address;
};

const main = () => {
  // Generate Seed
  const mnemonic = generateSeed();
  // Get Root Key
  const root = getRootKey(mnemonic);
  // Generate Key Pair
  const { privateKey, publicKey, account } = generateKeyPair(root);
  // Convert to xpub
  const xpub = account.neutered().toBase58();
  // Generate Address
  const address = generateAddress(account);
  return { mnemonic, privateKey, publicKey, address, xpub };
};

const wallet = main();
console.log(wallet);
