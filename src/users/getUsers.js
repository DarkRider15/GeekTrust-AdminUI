import axios from "axios";

export const ENDPOINT =
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
export const getUsers = async () => {
  try {
    const res = await axios.get(ENDPOINT);
    return res.data;
  } catch (error) {
    console.log(error.response);
  }
};