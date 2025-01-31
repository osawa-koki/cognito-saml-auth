import axios from "axios";

interface Props {
  refreshToken: string;
  tokenEndpoint: string;
}

export default async function refreshToken(props: Props) {
  try {
    const { refreshToken, tokenEndpoint } = props;
    const response = await axios.post(tokenEndpoint, {
      grant_type: 'refresh_token',
      client_id: process.env.CLIENT_ID!,
      refresh_token: refreshToken,
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
