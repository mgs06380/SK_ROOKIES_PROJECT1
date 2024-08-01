// src/api/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // 실제 API 서버의 기본 URL로 설정합니다.
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // 이 줄을 추가합니다.
});

export default axiosInstance;