import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import MyCalendar from './Calendar';  // Calendar 컴포넌트 임포트
import Schedule from './Schedule';  // Schedule 컴포넌트 임포트
import styles from '../styles/Main.module.css';
import defaultProfileIcon from '../assets/default-profile-icon.png';
import calendarIcon from '../assets/calendar-icon.png';
import timeTableIcon from '../assets/time-table-icon.png';
import leftArrowIcon from '../assets/free-icon-left-arrow-271220.png';
import rightArrowIcon from '../assets/free-icon-right-arrow-271228.png';
import defaultCoverImage from '../assets/flat_panorama.jpg';
import deleteIcon from '../assets/dele-icon.png';
import travelPlannerIcon from '../assets/travel-planner-icon.png';
import arrowRightIcon from '../assets/free-icon-arrow-right-8663380.png';
import arrowDownIcon from '../assets/free-icon-arrow-down-8663376.png';
import deleteSidebarIcon from '../assets/free-icon-cross-mark-8369334.png';
import editWhiteIcon from '../assets/edit-white.png';

function Main() {
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showTripModal, setShowTripModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [coverImage, setCoverImage] = useState(defaultCoverImage);
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripDetails, setTripDetails] = useState([]);
  const [currentModalStep, setCurrentModalStep] = useState(1);
  const [tripFormData, setTripFormData] = useState({
    title: '',
    start_date: '',
    end_date: ''
  });
  const [warningMessage, setWarningMessage] = useState('');
  const [tripDetailFormData, setTripDetailFormData] = useState({
    description: '',
    start_time: '',
    end_time: '',
    all_day: false
  });
  const [tripDetailWarningMessage, setTripDetailWarningMessage] = useState('');
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTripDetailId, setEditingTripDetailId] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [refresh, setRefresh] = useState(false);  // Refresh 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        navigate('/login');
      }
    };

    const fetchTrips = async () => {
      try {
        const response = await axiosInstance.get('/trips');
        setTrips(response.data);
        if (response.data.length > 0) {
          setSelectedTrip(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch trips', error);
      }
    };

    fetchUserData();
    fetchTrips();
  }, [navigate]);

  useEffect(() => {
    if (selectedTrip) {
      fetchTripDetails(selectedTrip.id);
    }
  }, [selectedTrip]);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);  // Refresh 상태 초기화
    }
  }, [refresh]);

  const validateForm = useCallback(() => {
    const { title, start_date, end_date } = tripFormData;

    if (!title && start_date && end_date) {
      setWarningMessage('여행 제목을 입력하세요');
    } else if (title && !start_date && end_date) {
      setWarningMessage('시작 날짜를 입력하세요');
    } else if (title && start_date && !end_date) {
      setWarningMessage('종료 날짜를 입력하세요');
    } else if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      setWarningMessage('시작 날짜는 종료 날짜보다 이후일 수 없습니다');
    } else {
      setWarningMessage('');
    }
  }, [tripFormData]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const validateTripDetailForm = useCallback(() => {
    const { description, start_time, end_time, all_day } = tripDetailFormData;

    if (description && !all_day) {
      if (!start_time && end_time) {
        setTripDetailWarningMessage('시작 시간을 입력하세요');
      } else if (start_time && !end_time) {
        setTripDetailWarningMessage('종료 시간을 입력하세요');
      } else if (start_time && end_time && start_time > end_time) {
        setTripDetailWarningMessage('시작 시간은 종료 시간보다 이후일 수 없습니다');
      } else {
        setTripDetailWarningMessage('');
      }
    } else {
      setTripDetailWarningMessage('');
    }
  }, [tripDetailFormData]);

  useEffect(() => {
    validateTripDetailForm();
  }, [validateTripDetailForm]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/users/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleLogoutModal = (event) => {
    if (event.target.tagName !== 'IMG' && event.target.tagName !== 'BUTTON') {
      setShowLogoutModal(!showLogoutModal);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleTripModal = () => {
    setShowTripModal(!showTripModal);
    setCurrentModalStep(1);
    setTripFormData({ title: '', start_date: '', end_date: '' });
    setWarningMessage('');
  };

  const closeTripModal = (event) => {
    if (event.target.className.includes(styles.modalBackground) || event.target.className.includes(styles.closeButton)) {
      setShowTripModal(false);
      setIsEditMode(false);
      setEditingTripDetailId(null);
      setTripDetailFormData({
        description: '',
        start_time: '',
        end_time: '',
        all_day: false
      });
    }
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setCoverImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTripInputChange = (event) => {
    const { name, value } = event.target;
    setTripFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTripDetailInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setTripDetailFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const isFormValid = () => {
    const { title, start_date, end_date } = tripFormData;
    return title && start_date && end_date && new Date(start_date) <= new Date(end_date);
  };

  const isTripDetailFormValid = () => {
    const { description, start_time, end_time, all_day } = tripDetailFormData;
    return description && (all_day || (start_time && end_time && start_time <= end_time));
  };

  const handleTripSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      return;
    }

    try {
      const response = await axiosInstance.post('/trips', tripFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTrips(prevTrips => [...prevTrips, response.data]);
      setSelectedTrip(response.data);
      setShowTripModal(false);
      setRefresh(true);  // 리프레시 상태 설정
    } catch (error) {
      console.error('Failed to create trip', error);
    }
  };

  const fetchTripDetails = async (tripId) => {
    try {
      const response = await axiosInstance.get(`/tripDetails?tripId=${tripId}`);
      const sortedDetails = response.data.sort((a, b) => {
        return new Date('1970/01/01 ' + a.start_time) - new Date('1970/01/01 ' + b.start_time);
      });
      setTripDetails(sortedDetails);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setTripDetails([]); // No trip details found
      } else {
        console.error('Failed to fetch trip details', error);
      }
    }
  };

  const handleTripDetailsSubmit = async (event) => {
    event.preventDefault();

    if (!isTripDetailFormValid()) {
      return;
    }

    const tripDetailData = {
      trip_id: selectedTrip.id,
      ...tripDetailFormData,
      start_time: tripDetailFormData.start_time ? tripDetailFormData.start_time.substring(0, 5) : null,
      end_time: tripDetailFormData.end_time ? tripDetailFormData.end_time.substring(0, 5) : null
    };

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/tripDetails/${editingTripDetailId}`, tripDetailData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Trip detail updated:', response.data);
      } else {
        response = await axiosInstance.post('/tripDetails', tripDetailData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('Trip detail created:', response.data);
      }
      fetchTripDetails(selectedTrip.id);
      setShowTripModal(false);
      setTripDetailFormData({
        description: '',
        start_time: '',
        end_time: '',
        all_day: false
      });
      setIsEditMode(false);
      setEditingTripDetailId(null);
      setRefresh(true);  // 리프레시 상태 설정
    } catch (error) {
      console.error('Failed to create/update trip detail:', error.response?.data || error.message);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      let tripDetails = [];
      try {
        const response = await axiosInstance.get(`/tripDetails?tripId=${tripId}`);
        tripDetails = response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log('No trip details found');
        } else {
          throw error;
        }
      }

      if (tripDetails.length > 0) {
        for (let detail of tripDetails) {
          await axiosInstance.delete(`/tripDetails/${detail.id}`);
        }
      }

      await axiosInstance.delete(`/trips/${tripId}`);

      const updatedTrips = trips.filter(trip => trip.id !== tripId);
      setTrips(updatedTrips);
      if (updatedTrips.length > 0) {
        setSelectedTrip(updatedTrips[0]);
      } else {
        setSelectedTrip(null);
        setTripDetails([]);
      }
      setRefresh(true);  // 리프레시 상태 설정
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  const handleDeleteTripDetail = async (detailId) => {
    try {
      await axiosInstance.delete(`/tripDetails/${detailId}`);
      fetchTripDetails(selectedTrip.id);
      setRefresh(true);  // 리프레시 상태 설정
    } catch (error) {
      console.error('Failed to delete trip detail', error);
    }
  };

  const handleEditTripDetail = (detailId) => {
    const tripDetailToEdit = tripDetails.find(detail => detail.id === detailId);
    setTripDetailFormData({
      description: tripDetailToEdit.description,
      start_time: tripDetailToEdit.start_time || '',
      end_time: tripDetailToEdit.end_time || '',
      all_day: tripDetailToEdit.all_day
    });
    setEditingTripDetailId(detailId);
    setIsEditMode(true);
    setShowTripModal(true);
    setCurrentModalStep(3);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.profile} onClick={toggleLogoutModal}>
          <img src={defaultProfileIcon} alt="Profile" className={styles.profileImage} />
          <span className={styles.profileName}>{user?.username} ⟀</span>
          <button className={styles.toggleButton} onClick={toggleSidebar}>
            <img src={leftArrowIcon} alt="Collapse Sidebar" className={styles.arrowIcon} />
          </button>
        </div>
        {showLogoutModal && (
          <div className={styles.modal}>
            <button className={styles.logoutButton} onClick={handleLogout}>로그아웃</button>
          </div>
        )}
        <button className={styles.addButton} onClick={toggleTripModal}>여행 일정 추가</button>
        <nav className={styles.nav}>
          <ul>
            <li onClick={() => setShowTripPlanner(!showTripPlanner)} className={styles.travelPlannerItem}>
              <div className={styles.navItemContent}>
                <img src={travelPlannerIcon} alt="Travel Planner" className={styles.icon} />
                <span>여행 플래너</span>
              </div>
              <img 
                src={showTripPlanner ? arrowDownIcon : arrowRightIcon} 
                alt={showTripPlanner ? "Collapse" : "Expand"} 
                className={styles.arrowIcon} 
              />
            </li>
            {showTripPlanner && trips.map((trip) => (
              <li key={trip.id} className={styles.subItem} onClick={() => { setSelectedTrip(trip); setShowCalendar(false); setShowSchedule(false); }}>
                <div>
                  ✈️ {trip.title}
                </div>
                <img 
                  src={deleteSidebarIcon} 
                  alt="Delete Trip" 
                  className={styles.deleteIcon}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTrip(trip.id);
                  }} 
                />
              </li>
            ))}
            <li onClick={() => { setShowCalendar(!showCalendar); setShowSchedule(false); }}>
              <div className={styles.navItemContent}>
                <img src={calendarIcon} alt="Calendar" className={styles.icon} />
                <span>캘린더</span>
              </div>
            </li>
            <li onClick={() => { setShowSchedule(!showSchedule); setShowCalendar(false); }}>
              <div className={styles.navItemContent}>
                <img src={timeTableIcon} alt="Time Table" className={styles.icon} />
                <span>시간표</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.main}>
        <div className={styles.coverImageContainer}>
          <img src={coverImage} alt="Cover" className={styles.coverImage} />
          <button className={styles.changeCoverButton} onClick={() => document.getElementById('coverImageInput').click()}>
            커버 변경
          </button>
          <input
            id="coverImageInput"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className={styles.mainContent}>
          <h1 className={styles.title}>{showCalendar ? '캘린더' : showSchedule ? '시간표' : '오늘의 일정'}</h1>
          {showCalendar ? (
            <div className={styles.scheduleSection}>
              <MyCalendar userId={user?.id} refresh={refresh} />
            </div>
          ) : showSchedule ? (
            <div className={styles.scheduleSection}>
              <Schedule userId={user?.id} refresh={refresh} />
            </div>
          ) : (
            <div className={styles.scheduleSection}>
              <h2>✈️ {selectedTrip ? selectedTrip.title : '여행 일정'}</h2>
              {tripDetails.length === 0 ? (
                <p className={styles.noTripDetailsMessage}>이런... 얼른 계획을 세워보세요😓</p>
              ) : (
                <table className={styles.scheduleTable}>
                  <thead>
                    <tr>
                      <th>체크</th>
                      <th>일정</th>
                      <th>시간</th>
                      <th>작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripDetails.map((detail, index) => (
                      <tr key={detail.id}>
                        <td>
                          <input type="checkbox" id={`schedule${index}`} />
                        </td>
                        <td>
                          <label htmlFor={`schedule${index}`}>{detail.description}</label>
                        </td>
                        <td>
                          {detail.all_day ? '종일' : `${detail.start_time} - ${detail.end_time}`}
                        </td>
                        <td>
                          <button onClick={() => handleEditTripDetail(detail.id)} className={styles.editButton}>
                            <img src={editWhiteIcon} alt="Edit" className={styles.editIcon} />
                          </button>
                          <button onClick={() => handleDeleteTripDetail(detail.id)} className={styles.deleteButton}>
                            <img src={deleteIcon} alt="Delete" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button className={styles.addScheduleButton} onClick={() => {
                setShowTripModal(true);
                setCurrentModalStep(3);
                setIsEditMode(false);
                setTripDetailFormData({
                  description: '',
                  start_time: '',
                  end_time: '',
                  all_day: false
                });
              }}>+ 일정 추가</button>
            </div>
          )}
        </div>
      </div>
      {showTripModal && (
        <div className={styles.modalBackground} onClick={closeTripModal}>
          <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeTripModal}>X</button>
            <div className={styles.modalContent}>
              {currentModalStep === 1 && (
                <>
                  <h2>여행 일정 추가</h2>
                  {warningMessage && <p className={styles.warningMessage}>{warningMessage}</p>}
                  <form onSubmit={handleTripSubmit}>
                    <div className={styles.formGroup}>
                      <label>여행 제목</label>
                      <input 
                        type="text" 
                        name="title" 
                        className={styles.formControl} 
                        required 
                        value={tripFormData.title}
                        onChange={handleTripInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>시작 날짜</label>
                      <input 
                        type="date" 
                        name="start_date" 
                        className={styles.formControl} 
                        required 
                        value={tripFormData.start_date}
                        onChange={handleTripInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>종료 날짜</label>
                      <input 
                        type="date" 
                        name="end_date" 
                        className={styles.formControl} 
                        required 
                        value={tripFormData.end_date}
                        onChange={handleTripInputChange}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className={styles.addButton}
                      disabled={!isFormValid()}
                    >
                      일정 추가
                    </button>
                  </form>
                </>
              )}
              {currentModalStep === 3 && (
                <>
                  <h2>{isEditMode ? '상세 일정 수정' : '상세 일정 추가'}</h2>
                  {tripDetailWarningMessage && <p className={styles.warningMessage}>{tripDetailWarningMessage}</p>}
                  <form onSubmit={handleTripDetailsSubmit}>
                    <div className={styles.formGroup}>
                      <label>일정 설명</label>
                      <input
                        type="text"
                        name="description"
                        className={styles.formControl}
                        required
                        value={tripDetailFormData.description}
                        onChange={handleTripDetailInputChange}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>시작 시간</label>
                      <input
                        type="time"
                        name="start_time"
                        className={styles.formControl}
                        required={!tripDetailFormData.all_day}
                        value={tripDetailFormData.start_time}
                        onChange={handleTripDetailInputChange}
                        disabled={tripDetailFormData.all_day}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>종료 시간</label>
                      <input
                        type="time"
                        name="end_time"
                        className={styles.formControl}
                        required={!tripDetailFormData.all_day}
                        value={tripDetailFormData.end_time}
                        onChange={handleTripDetailInputChange}
                        disabled={tripDetailFormData.all_day}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        <input
                          type="checkbox"
                          name="all_day"
                          checked={tripDetailFormData.all_day}
                          onChange={handleTripDetailInputChange}
                        /> 종일
                      </label>
                    </div>
                    <button
                      type="submit"
                      className={styles.addButton}
                      disabled={!isTripDetailFormValid()}
                    >
                      {isEditMode ? '수정하기' : '추가하기'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {isSidebarCollapsed && (
        <button className={styles.showToggleButton} onClick={toggleSidebar}>
          <img src={rightArrowIcon} alt="Expand Sidebar" className={styles.arrowIcon} />
        </button>
      )}
    </div>
  );
}

export default Main;
