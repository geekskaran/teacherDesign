import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const ClassDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [hasAutoScanned, setHasAutoScanned] = useState(false);
  
  // Check if auto attendance has been performed
  useEffect(() => {
    // In a real app, this would check with the backend
    // For demo, we'll just check localStorage
    const autoScanned = localStorage.getItem(`class_${id}_autoScanned`);
    if (autoScanned === 'true') {
      setHasAutoScanned(true);
    }
  }, [id]);
  
  // Simulated data fetch
  useEffect(() => {
    // In a real app, you would fetch the class data using the ID
    setTimeout(() => {
      const mockClass = {
        id: parseInt(id),
        subject: 'Data Structures & Algorithms',
        code: 'CS201',
        group: 'CS-2A',
        startTime: '09:00 AM',
        endTime: '10:30 AM',
        room: 'LH-301',
        building: 'Computer Science Building',
        floor: '3rd Floor',
        totalStudents: 35,
        attendedPrevious: 32,
        previousAttendance: 91.4, // percentage
        topics: ['Tree Traversal', 'Binary Heaps', 'Priority Queues'],
        nextAssignment: 'Heap Implementation Due: Friday',
        description: 'This course covers fundamental data structures and algorithms, focusing on implementation, analysis, and application.',
        prerequisites: ['Introduction to Programming', 'Discrete Mathematics'],
        objectives: [
          'Understand time and space complexity analysis',
          'Implement and apply common data structures',
          'Analyze algorithm efficiency',
          'Apply problem-solving strategies using appropriate data structures'
        ],
        students: [
          { id: 1, name: 'Alex Johnson', rollNo: 'CS2001', currentAttendance: 95, image: null },
          { id: 2, name: 'Sarah Miller', rollNo: 'CS2002', currentAttendance: 100, image: null },
          { id: 3, name: 'David Wilson', rollNo: 'CS2003', currentAttendance: 87, image: null },
          { id: 4, name: 'Emily Brown', rollNo: 'CS2004', currentAttendance: 92, image: null },
          { id: 5, name: 'Michael Davis', rollNo: 'CS2005', currentAttendance: 78, image: null },
          { id: 6, name: 'Jessica Taylor', rollNo: 'CS2006', currentAttendance: 100, image: null },
          { id: 7, name: 'Robert Anderson', rollNo: 'CS2007', currentAttendance: 85, image: null },
          { id: 8, name: 'Jennifer Garcia', rollNo: 'CS2008', currentAttendance: 88, image: null },
          { id: 9, name: 'Thomas Rodriguez', rollNo: 'CS2009', currentAttendance: 90, image: null },
          { id: 10, name: 'Lisa Martinez', rollNo: 'CS2010', currentAttendance: 97, image: null },
        ],
        previousLectures: [
          { date: '2025-03-10', attendance: 33, percentage: 94.3, topic: 'Binary Tree Operations' },
          { date: '2025-03-08', attendance: 32, percentage: 91.4, topic: 'Tree Data Structures' },
          { date: '2025-03-05', attendance: 34, percentage: 97.1, topic: 'Hash Tables and Collision Resolution' },
          { date: '2025-03-03', attendance: 30, percentage: 85.7, topic: 'Graph Algorithms' },
        ],
        attendanceRequests: [
          { id: 101, studentId: 11, name: 'William Clark', rollNo: 'CS2011', reason: 'Bluetooth not working', timestamp: '10:05 AM' },
          { id: 102, studentId: 12, name: 'Elizabeth Scott', rollNo: 'CS2012', reason: 'Device not detected', timestamp: '10:08 AM' },
          { id: 103, studentId: 13, name: 'Daniel Lee', rollNo: 'CS2013', reason: 'Late arrival (5 min)', timestamp: '09:35 AM' },
        ]
      };
      
      setClassData(mockClass);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Handle attendance request acceptance
  const acceptRequest = (requestId) => {
    if (!classData) return;
    
    // Remove the request from the list
    const updatedRequests = classData.attendanceRequests.filter(
      request => request.id !== requestId
    );
    
    // Update the class data
    setClassData({
      ...classData,
      attendanceRequests: updatedRequests
    });
    
    // Show confirmation message
    alert('Attendance request accepted. Student marked as present.');
  };
  
  // Handle attendance request rejection
  const rejectRequest = (requestId) => {
    if (!classData) return;
    
    // Remove the request from the list
    const updatedRequests = classData.attendanceRequests.filter(
      request => request.id !== requestId
    );
    
    // Update the class data
    setClassData({
      ...classData,
      attendanceRequests: updatedRequests
    });
    
    // Show confirmation message
    alert('Attendance request rejected.');
  };
  
  // Handle auto attendance or rescan
  const handleAutoAttendance = () => {
    // When auto attendance is performed, set the flag
    localStorage.setItem(`class_${id}_autoScanned`, 'true');
    setHasAutoScanned(true);
    navigate(`/class/${id}/auto-attendance`);
  };

  return (
    <Layout currentPage={loading ? 'Loading...' : classData?.subject}>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Class header */}
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{classData.subject}</h1>
                <p className="text-gray-500">{classData.code} • {classData.group}</p>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 hover:text-gray-600"
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
                  <p className="text-sm font-medium">{classData.startTime} - {classData.endTime}</p>
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
                  <p className="text-sm font-medium">Room {classData.room}</p>
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
                  <p className="text-sm font-medium">{classData.totalStudents} Enrolled</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="rounded-full bg-amber-100 p-2 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Previous Attendance</p>
                  <p className="text-sm font-medium">{classData.previousAttendance}%</p>
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
                {hasAutoScanned ? 'Rescan' : 'Take Attendance'}
              </button>
              <button
                onClick={() => navigate(`/class/${id}/manual-attendance`)}
                className="flex-1 ml-2 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Manage Attendance
              </button>
            </div>
          </div>
          
          {/* Rest of the component remains the same */}
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
                Class Info
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
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md relative ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                Requests
                {classData.attendanceRequests.length > 0 && (
                  <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {classData.attendanceRequests.length}
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
              {/* Course information */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Course</h3>
                <p className="text-gray-700 mb-4">{classData.description}</p>
                
                <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                  {classData.prerequisites.map((prereq, index) => (
                    <li key={index}>{prereq}</li>
                  ))}
                </ul>
                
                <h4 className="font-medium text-gray-900 mb-2">Learning Objectives</h4>
                <ul className="list-disc list-inside text-gray-700 mb-4">
                  {classData.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              {/* Today's lecture */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Today's Lecture</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Topics to Cover</h4>
                    <div className="flex flex-wrap gap-2">
                      {classData.topics.map((topic, index) => (
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
                    <p className="text-gray-700">{classData.nextAssignment}</p>
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
              {/* Student list - no attendance marking functionality */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Student List</h3>
                  <p className="text-sm text-gray-500">Viewing {classData.students.length} students in this class</p>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {classData.students.map(student => (
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
                          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.currentAttendance >= 90 ? 'bg-green-100 text-green-800' :
                            student.currentAttendance >= 75 ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {student.currentAttendance}% Attendance
                          </div>
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
                  {classData.previousLectures.map((lecture, index) => {
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
                            {lecture.attendance}/{classData.totalStudents} ({lecture.percentage}%)
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
          
          {/* New Notifications/Requests Tab */}
          {activeTab === 'notifications' && (
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
                    Students requesting manual attendance verification
                  </p>
                </div>
                
                {classData.attendanceRequests.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {classData.attendanceRequests.map(request => (
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
          {/* ... */}
        </motion.div>
      )}
    </Layout>
  );
};

export default ClassDetailPage;
