import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as jwkToPem from 'jwk-to-pem';

interface JWK {
  kid: string;
  kty: string;
  n: string;
  e: string;
  [key: string]: unknown;
}

interface Props {
  idToken: string;
  jwksUrl: string;
}

export default async function checkIdToken(props: Props) {
  try {
    const { idToken, jwksUrl } = props;

    const header = jwt.decode(idToken, { complete: true })?.header;
    if (header == null || header.kid == null) {
      throw new Error('Invalid token header');
    }

    const response = await axios.get(jwksUrl);
    const jwks = response.data;

    const key = jwks.keys.find((k: JWK) => k.kid === header.kid);
    if (!key) {
      throw new Error('Matching key not found');
    }
    const publicKey = jwkToPem(key);

    const decodedToken = jwt.verify(idToken, publicKey, { algorithms: ['RS256'] });
    return decodedToken;
  } catch (error) {
    console.error(error);
    return null;
  }
}
