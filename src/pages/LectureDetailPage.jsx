import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const LectureDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [lectureData, setLectureData] = useState(null);
  const [hasAutoScanned, setHasAutoScanned] = useState(false);
  
  // Extract URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // In a real app, you might fetch data from an API using these parameters
    // For this demo, we'll use the URL parameters directly
    const lectureInfo = {
      id: parseInt(id),
      date: params.get('date') ? new Date(params.get('date')) : new Date(),
      subject: params.get('subject') || 'Subject Not Found',
      group: params.get('group') || 'Group Not Found',
      room: params.get('room') || 'Room Not Found',
      startTime: params.get('startTime') || '00:00',
      endTime: params.get('endTime') || '00:00',
      
      // Static additional data for the lecture
      totalStudents: 25,
      previousAttendance: 92,
      building: 'Main Campus',
      floor: '3rd Floor',
      topics: ['Key Concepts', 'Problem Solving', 'Practical Applications'],
      nextAssignment: 'Assignment due next week',
      description: 'This lecture covers fundamental concepts and practical applications.',
      objectives: [
        'Understand core principles',
        'Apply concepts to real-world problems',
        'Develop critical thinking skills',
        'Prepare for upcoming assessments'
      ],
    };
    
    // Check if auto attendance has been performed
    const autoScanned = localStorage.getItem(`lecture_${id}_${params.get('date')}_autoScanned`);
    setHasAutoScanned(autoScanned === 'true');
    
    // Generate student data
    generateStudentData(lectureInfo);
  }, [id, location.search]);
  
  // Generate mock student data
  const generateStudentData = (lectureInfo) => {
    // Mock student names
    const firstNames = ['James', 'Emily', 'Michael', 'Sarah', 'David', 'Jessica', 'John', 'Emma', 
                       'Daniel', 'Olivia', 'William', 'Sophia', 'Alex', 'Ava', 'Robert'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 
                      'Rodriguez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson'];
    
    // Generate random student list
    const students = [];
    for (let i = 0; i < 15; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const rollPrefix = lectureInfo.subject.substring(0, 2).toUpperCase();
      
      students.push({
        id: i + 1,
        name: `${firstName} ${lastName}`,
        rollNo: `${rollPrefix}${2000 + i}`,
        currentAttendance: Math.floor(Math.random() * 30) + 70, // 70-100% attendance
        present: Math.random() > 0.2, // 80% chance of being present
        image: null
      });
    }
    
    // Generate previous lectures data
    const previousLectures = [];
    const currentDate = new Date(lectureInfo.date);
    for (let i = 0; i < 4; i++) {
      const pastDate = new Date(currentDate);
      pastDate.setDate(pastDate.getDate() - ((i + 1) * 2));
      
      previousLectures.push({
        date: pastDate.toISOString().split('T')[0],
        attendance: Math.floor(Math.random() * 5) + 20, // 20-25 students
        percentage: Math.floor(Math.random() * 20) + 80, // 80-100% attendance
        topic: `${lectureInfo.subject} - Topic ${i + 1}`
      });
    }
    
    // Generate attendance requests
    const attendanceRequests = [];
    if (Math.random() > 0.3) { // 70% chance of having requests
      const numRequests = Math.floor(Math.random() * 3) + 1; // 1-3 requests
      
      for (let i = 0; i < numRequests; i++) {
        const studentId = 100 + i;
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const rollPrefix = lectureInfo.subject.substring(0, 2).toUpperCase();
        
        attendanceRequests.push({
          id: 100 + i,
          studentId: studentId,
          name: `${firstName} ${lastName}`,
          rollNo: `${rollPrefix}${3000 + i}`,
          reason: ['Bluetooth not working', 'Device not detected', 'Late arrival (5 min)'][i % 3],
          timestamp: `${Math.floor(Math.random() * 2) + 9}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM`
        });
      }
    }
    
    // Present students count
    const presentStudents = students.filter(s => s.present).length;
    
    // Update lecture data with generated info
    setLectureData({
      ...lectureInfo,
      students,
      previousLectures,
      attendanceRequests,
      presentStudents,
      absentStudents: students.length - presentStudents
    });
    
    setLoading(false);
  };
  
  // Handle attendance request acceptance
  const acceptRequest = (requestId) => {
    if (!lectureData) return;
    
    // Remove the request from the list
    const updatedRequests = lectureData.attendanceRequests.filter(
      request => request.id !== requestId
    );
    
    // Update the lecture data
    setLectureData({
      ...lectureData,
      attendanceRequests: updatedRequests,
      presentStudents: lectureData.presentStudents + 1,
      absentStudents: lectureData.absentStudents - 1
    });
    
    // Show confirmation message
    alert('Attendance request accepted. Student marked as present.');
  };
  
  // Handle attendance request rejection
  const rejectRequest = (requestId) => {
    if (!lectureData) return;
    
    // Remove the request from the list
    const updatedRequests = lectureData.attendanceRequests.filter(
      request => request.id !== requestId
    );
    
    // Update the lecture data
    setLectureData({
      ...lectureData,
      attendanceRequests: updatedRequests
    });
    
    // Show confirmation message
    alert('Attendance request rejected.');
  };
  
  // Handle auto attendance
  const handleAutoAttendance = () => {
    if (!lectureData) return;
    
    // When auto attendance is performed, set the flag
    localStorage.setItem(`lecture_${id}_${lectureData.date.toISOString().split('T')[0]}_autoScanned`, 'true');
    setHasAutoScanned(true);
    
    // Generate URL parameters for maintaining context
    const dateStr = lectureData.date.toISOString().split('T')[0];
    const params = new URLSearchParams();
    params.set('date', dateStr);
    params.set('subject', lectureData.subject);
    params.set('group', lectureData.group);
    params.set('room', lectureData.room);
    params.set('startTime', lectureData.startTime);
    params.set('endTime', lectureData.endTime);
    
    navigate(`/class/${id}/auto-attendance?${params.toString()}`);
  };
  
  // Handle manual attendance
  const handleManualAttendance = () => {
    if (!lectureData) return;
    
    // Generate URL parameters for maintaining contextddddd
    const dateStr = lectureData.date.toISOString().split('T')[0];
    const params = new URLSearchParams();
    params.set('date', dateStr);
    params.set('subject', lectureData.subject);
    params.set('group', lectureData.group);
    params.set('room', lectureData.room);
    params.set('startTime', lectureData.startTime);
    params.set('endTime', lectureData.endTime);
    
    navigate(`/class/${id}/manual-attendance?${params.toString()}`);
  };
  
  // Format the selected date for display
  const formatDate = (date) => {
    if (!date) return '';
    
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Layout currentPage={loading ? 'Loading...' : lectureData?.subject}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6 pb-16"
        >
          {/* Lecture header */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{lectureData.subject}</h1>
                <p className="text-gray-500">{lectureData.group} • Room {lectureData.room}</p>
                {/* Display the selected date */}
                <p className="text-sm font-medium text-blue-600 mt-1">
                  {formatDate(lectureData.date)}
                </p>
              </div>
              <button 
                onClick={() => navigate(-1)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="text-sm font-medium">{lectureData.startTime} - {lectureData.endTime}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium">{lectureData.building}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="text-sm font-medium">{lectureData.totalStudents} Enrolled</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-amber-100 p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Attendance</p>
                  <p className="text-sm font-medium">
                    {lectureData.presentStudents}/{lectureData.totalStudents} Present
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={handleAutoAttendance}
                className="flex-1 mr-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                {hasAutoScanned ? 'Rescan Attendance' : 'Auto Attendance'}
              </button>
              <button
                onClick={handleManualAttendance}
                className="flex-1 ml-2 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Manual Attendance
              </button>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="bg-white rounded-lg shadow-md p-1">
            <div className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  activeTab === 'info' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Lecture Info
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  activeTab === 'students' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${
                  activeTab === 'history' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md relative ${
                  activeTab === 'requests' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Requests
                {lectureData.attendanceRequests.length > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {lectureData.attendanceRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          {activeTab === 'info' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Lecture information */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Lecture</h3>
                <p className="text-gray-700 mb-4">{lectureData.description}</p>
                
                <h4 className="font-medium text-gray-900 mb-2">Learning Objectives</h4>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                  {lectureData.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              {/* Lecture topics */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Lecture Topics</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Topics Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {lectureData.topics.map((topic, index) => (
                        <span 
                          key={index}
                          className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Upcoming Assignment</h4>
                    <p className="text-gray-700">{lectureData.nextAssignment}</p>
                  </div>
                </div>
              </div>
              
              {/* Attendance Summary */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendance Summary</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-green-800">Present</p>
                    <p className="text-2xl font-bold text-green-700">{lectureData.presentStudents}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-red-800">Absent</p>
                    <p className="text-2xl font-bold text-red-700">{lectureData.absentStudents}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700">Attendance Rate</p>
                    <p className="text-sm font-medium text-gray-700">
                      {Math.round((lectureData.presentStudents / lectureData.totalStudents) * 100)}%
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(lectureData.presentStudents / lectureData.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'students' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Student list with attendance status */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Student Attendance</h3>
                  <p className="text-sm text-gray-500">
                    Attendance for {lectureData.subject} on {formatDate(lectureData.date)}
                  </p>
                </div>
                
                <div className="flex p-3 bg-gray-50">
                  <div className="flex-1 px-2 py-1 text-center">
                    <span className="text-sm font-medium text-green-700">
                      {lectureData.presentStudents} Present
                    </span>
                  </div>
                  <div className="flex-1 px-2 py-1 text-center">
                    <span className="text-sm font-medium text-red-700">
                      {lectureData.absentStudents} Absent
                    </span>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {lectureData.students.map(student => (
                    <div 
                      key={student.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-lg font-bold text-gray-700">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{student.name}</h4>
                            <p className="text-sm text-gray-500">{student.rollNo}</p>
                          </div>
                        </div>
                        <div>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.present 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.present ? 'Present' : 'Absent'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'history' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Attendance History</h3>
                
                <div className="mt-2 space-y-3">
                  {lectureData.previousLectures.map((lecture, index) => {
                    const lectureDate = new Date(lecture.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{lectureDate}</h4>
                            <p className="text-sm text-gray-500">{lecture.topic}</p>
                            </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lecture.percentage >= 90 ? 'bg-green-100 text-green-800' :
                            lecture.percentage >= 75 ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {lecture.attendance}/{lectureData.totalStudents} ({lecture.percentage}%)
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              lecture.percentage >= 90 ? 'bg-green-500' :
                              lecture.percentage >= 75 ? 'bg-blue-500' :
                              'bg-amber-500'
                            }`}
                            style={{ width: `${lecture.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'requests' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Requests</h3>
                  <p className="text-sm text-gray-500">
                    Students requesting manual attendance verification for {formatDate(lectureData.date)}
                  </p>
                </div>
                
                {lectureData.attendanceRequests.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {lectureData.attendanceRequests.map(request => (
                      <div key={request.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-blue-100 mr-3 flex items-center justify-center text-lg font-bold text-blue-700">
                              {request.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{request.name}</h4>
                              <p className="text-sm text-gray-500">{request.rollNo} • {request.timestamp}</p>
                            </div>
                          </div>
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Reason:</span> {request.reason}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => acceptRequest(request.id)}
                            className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                          >
                            Accept Request
                          </button>
                          <button
                            onClick={() => rejectRequest(request.id)}
                            className="flex-1 py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
                          >
                            Reject Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>No attendance requests at this time.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </Layout>
  );
};

export default LectureDetailPage;