import * as crypto from 'node:crypto';
import * as jose from 'jose';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const createJWT = async <T extends {email: string, userId: string}>(algorithm: string, jwtSecret: string, payload: T): Promise<string> => new jose
  .SignJWT({...payload})
  .setProtectedHeader({alg: algorithm })
  .setIssuedAt()
  .setExpirationTime('3d')
  .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));
