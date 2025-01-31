import axios from 'axios';

interface Props {
  tokenEndpoint: string;
  clientId: string;
  redirectUri: string;
  code: string;
}

export default async function code2token(props: Props) {
  try {
    const { tokenEndpoint, clientId, redirectUri, code } = props;

    const response = await axios.post(tokenEndpoint, {
        grant_type: 'authorization_code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code: code,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
