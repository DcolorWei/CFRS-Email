import crypto from 'crypto';

const secretKey = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function aesEncrypt(originalData: string) {
    const dataToEncrypt = originalData;
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encryptedData = cipher.update(dataToEncrypt, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    return encryptedData;
}

export function aesDecrypt(encryptedData: string) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, iv);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}

export function hashGenerate(originalData: string) {
    return crypto.createHash('sha256').update(originalData).digest('hex');
}