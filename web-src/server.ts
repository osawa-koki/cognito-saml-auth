import * as express from 'express';
import * as dotenv from 'dotenv';

import code2token from './utils/code2token';
import checkIdToken from './utils/checkIdToken';
import refreshToken from './utils/refreshToken';
import getUserInfo from './utils/getUserInfo';

dotenv.config();
dotenv.config({ path: '.env.dynamic' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./web-public/', {
  extensions: ['html']
}));

app.get('/api/auth/saml', (req, res) => {
  res.redirect(process.env.START_URL!);
});

app.get('/api/auth/exchange-token', async (req, res) => {
  const token = await code2token({
    tokenEndpoint: process.env.TOKEN_ENDPOINT!,
    clientId: process.env.CLIENT_ID!,
    redirectUri: process.env.CALLBACK_URL!,
    code: req.query.code as string,
  });
  if (token == null) {
    res.status(403).json({ error: 'Failed to get token' });
    return;
  }
  res.json(token);
});

app.get('/api/auth/refresh-token', async (req, res) => {
  const token = req.query.token as string;
  const result = await refreshToken({
    refreshToken: token,
    tokenEndpoint: process.env.TOKEN_ENDPOINT!,
  });
  if (result == null) {
    res.status(403).json({ error: 'Failed to refresh token' });
    return;
  }
  res.json(result);
});

app.get('/api/auth/check-id-token', async (req, res) => {
  const idToken = req.query.token as string;
  const result = await checkIdToken({
    idToken: idToken,
    jwksUrl: process.env.COGNITO_JWKS_URL!,
  });
  res.json(result);
});

app.get('/api/auth/user-info', async (req, res) => {
  const accessToken = req.query.token as string;
  const result = await getUserInfo({
    accessToken: accessToken,
    userInfoEndpoint: process.env.USER_INFO_ENDPOINT!,
  });
  res.json(result);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
