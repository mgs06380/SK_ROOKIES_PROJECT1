import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/Register.module.css';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  useEffect(() => {
    validateForm();
  }, [email, username, password, confirmPassword]);

  const validateForm = () => {
    const filledFields = [email, username, password, confirmPassword].filter(Boolean).length;
    
    if (filledFields === 3) { // 한 개만 입력이 안 되었을 때
      if (!email) setErrorMessage("이메일을 입력해주세요.");
      else if (!validateEmail(email)) setErrorMessage("올바른 이메일 형식이 아닙니다.");
      else if (!username) setErrorMessage("사용자 이름을 입력해주세요.");
      else if (!password) setErrorMessage("비밀번호를 입력해주세요.");
      else if (!confirmPassword) setErrorMessage("비밀번호 확인을 입력해주세요.");
    } else if (password !== confirmPassword && password && confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } else if (email && !validateEmail(email)) {
      setErrorMessage("올바른 이메일 형식이 아닙니다.");
    } else {
      setErrorMessage("");
    }

    setIsFormValid(
      email !== '' &&
      validateEmail(email) &&
      username !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      password === confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const userDto = { email, username, password };
      console.log('Sending signup request with', userDto);
      const response = await axios.post('http://localhost:8080/api/users/signup', userDto, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response);
      if (response.data) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Signup failed', error.response.data);
      setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Register</h2>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button 
          className={styles.button} 
          type="submit" 
          disabled={!isFormValid}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;