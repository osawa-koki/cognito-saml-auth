import * as express from 'express';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.dynamic' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('./web-public/'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/auth/saml', (req, res) => {
  res.redirect(process.env.START_URL!);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
