import * as crypto from 'crypto';

class EncryptionUtil {

    public static encrypt(secret) {
        const cet = process.env.CET || EncryptionUtil.defaultKey;
        const cipher = crypto.createCipher('aes256', cet);
        let encrypted = cipher.update(secret, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    public static decrypt(secret) {
        const cet = process.env.CET || EncryptionUtil.defaultKey;
        const decipher = crypto.createDecipher('aes256', cet);
        let decrypted = decipher.update(secret, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    private static defaultKey = 'oCB@qs?nDn@E=nsC?s?q@CsFDq=EsEDoD>rBBqEor=@Anop>rAoDBEop>s@s=qrE';
}

export default EncryptionUtil;
