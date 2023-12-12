import axios from 'axios';

const BASE_API_URL = 'https://provinces.open-api.vn/api';

export const getProvinces = async () => await axios.get(`${BASE_API_URL}/p`);

export const getDistricts = async (provinceCode) =>
  await axios.get(`${BASE_API_URL}/p/${provinceCode}?depth=2`);

export const getWards = async (districtCode) =>
  await axios.get(`${BASE_API_URL}/d/${districtCode}?depth=2`);
