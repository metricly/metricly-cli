import * as crypto from 'crypto';

class EncryptionUtil {

    public static encrypt(secret) {
        const cet = process.env.CET || EncryptionUtil.defaultKey;
        const cipher = crypto.createCipher('aes256', cet.startsWith('oCB') ? EncryptionUtil.defs(cet, 13) : cet);
        let encrypted = cipher.update(secret, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    public static decrypt(secret) {
        const cet = process.env.CET || EncryptionUtil.defaultKey;
        const decipher = crypto.createDecipher('aes256', cet.startsWith('oCB') ? EncryptionUtil.defs(cet, 13) : cet);
        let decrypted = decipher.update(secret, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    private static defaultKey = 'oCB@qs?nDn@E=nsC?s?q@CsFDq=EsEDoD>rBBqEor=@Anop>rAoDBEop>s@s=qrE';
    // ref: https://gist.github.com/olastor/54c78a3d29c69806c57a32eff32f191a
    private static obfs(str, key) {
        const n = 126;
        const k = key || 13;
        const chars = str.toString().split('');
        for (let i = 0; i < chars.length; i++) {
            const c = chars[i].charCodeAt(0);
            if (c <= n) {
                chars[i] = String.fromCharCode((chars[i].charCodeAt(0) + key) % n);
            }
        }
        return chars.join('');
    }
    private static defs(str, key) {
        const n = 126;
        const k = key || 13;
        return EncryptionUtil.obfs(str, n - k);
    }
}

export default EncryptionUtil;
