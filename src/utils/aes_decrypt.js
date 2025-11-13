import CryptoJS from "crypto-js";

function AESDecrypt(ciphertext, key) {
  ciphertext = ciphertext.slice(3).slice(0, -5);
  return CryptoJS.AES.decrypt(
    ciphertext,
    CryptoJS.enc.Utf8.parse(key.slice(0, 16)),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).toString(CryptoJS.enc.Utf8);
}

export default AESDecrypt;
