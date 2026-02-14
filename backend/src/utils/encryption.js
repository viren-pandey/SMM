const crypto = require('crypto');
const config = require('../config/env');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const ITERATIONS = 100000;

class Encryption {
    /**
     * Encrypt a string
     * @param {string} text 
     * @returns {string} Encrypted text in format iv:salt:authTag:encryptedText
     */
    static encrypt(text) {
        if (!text) return text;

        const iv = crypto.randomBytes(IV_LENGTH);
        const salt = crypto.randomBytes(SALT_LENGTH);

        const key = crypto.pbkdf2Sync(
            config.encryption.key,
            salt,
            ITERATIONS,
            KEY_LENGTH,
            'sha512'
        );

        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();

        return [
            iv.toString('hex'),
            salt.toString('hex'),
            tag.toString('hex'),
            encrypted.toString('hex')
        ].join(':');
    }

    /**
     * Decrypt a string
     * @param {string} encryptedText - Format iv:salt:authTag:encryptedText
     * @returns {string} Decrypted text
     */
    static decrypt(encryptedText) {
        if (!encryptedText || !encryptedText.includes(':')) return encryptedText;

        try {
            const [ivHex, saltHex, tagHex, encryptedHex] = encryptedText.split(':');

            const iv = Buffer.from(ivHex, 'hex');
            const salt = Buffer.from(saltHex, 'hex');
            const tag = Buffer.from(tagHex, 'hex');
            const encrypted = Buffer.from(encryptedHex, 'hex');

            const key = crypto.pbkdf2Sync(
                config.encryption.key,
                salt,
                ITERATIONS,
                KEY_LENGTH,
                'sha512'
            );

            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            decipher.setAuthTag(tag);

            return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
        } catch (error) {
            console.error('Decryption failed:', error.message);
            return null;
        }
    }
}

module.exports = Encryption;
