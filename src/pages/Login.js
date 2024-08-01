import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import qs from 'qs';
import styles from '../styles/Login.module.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    if (!username && !password) {
      setErrorMessage('');
    } else if (!username) {
      setErrorMessage('사용자 이름을 입력해주세요.');
    } else if (!password) {
      setErrorMessage('비밀번호를 입력해주세요.');
    } else {
      setErrorMessage('');
    }

    setIsFormValid(username !== '' && password !== '');
  }, [username, password]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      console.log('Sending login request with', { username, password });
      const response = await axiosInstance.post('/users/login', 
        qs.stringify({ username, password }), 
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('Response:', response.data);
      if (response.data.success) {
        navigate('/main');
      } else {
        setErrorMessage(response.data.message || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Login failed', error.response?.data);
      setErrorMessage('로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Login</h2>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          className={styles.button} 
          type="submit"
          disabled={!isFormValid}
        >
          로그인
        </button>
        <p className={styles.text}>
          Don't have an account? <Link className={styles.link} to="/register">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;