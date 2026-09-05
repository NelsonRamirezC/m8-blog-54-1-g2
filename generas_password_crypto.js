import crypto from 'node:crypto';

// Genera una cadena aleatoria criptográficamente segura de 32 bytes (256 bits) en hexadecimal o base64
export function generateJwtSecret() {
  return crypto.randomBytes(32).toString('hex');
}

// Ejemplo de uso:
const secret = generateJwtSecret();
console.log('Tu JWT_SECRET para el archivo .env:');
console.log(secret);