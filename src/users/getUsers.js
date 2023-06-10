import axios from 'axios';

export const getUsers = async () => {
  try {
    const endpoint =
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

    const { data } = await axios.get(endpoint);
    return data;
  } catch (error) {
    throw error;
  }
};
