import axios from 'axios';

interface Props {
  token: string;
  userInfoEndpoint: string;
}

export default async function getUserInfo(props: Props) {
  try {
    const { token, userInfoEndpoint } = props;
    const response = await axios.get(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
