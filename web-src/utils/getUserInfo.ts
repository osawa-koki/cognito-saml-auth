import axios from 'axios';

interface Props {
  accessToken: string;
  userInfoEndpoint: string;
}

export default async function getUserInfo(props: Props) {
  try {
    const { accessToken, userInfoEndpoint } = props;
    const response = await axios.get(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
