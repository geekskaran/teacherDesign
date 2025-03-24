import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ManualAttendancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get scanned student IDs either from location state or localStorage
  const locationScannedIds = location.state?.scannedStudentIds || [];
  const storedScannedIds = JSON.parse(localStorage.getItem(`class_${id}_scannedStudents`) || '[]');
  
  // Use whichever has data, prefer location state if both exist
  const scannedStudentIds = locationScannedIds.length > 0 ? locationScannedIds : storedScannedIds;
  
  // Check if we've done an auto scan
  const hasAutoScanned = localStorage.getItem(`class_${id}_autoScanned`) === 'true' || location.state?.fromAutoScan;
  
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceRequests, setAttendanceRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const [notification, setNotification] = useState(null);
  const [filterType, setFilterType] = useState('all'); // 'all', 'present', 'absent'
  
  // Fetch class data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const mockAttendanceRequests = [
        { id: 101, studentId: 11, name: 'William Clark', rollNo: 'CS2011', reason: 'Bluetooth not working', timestamp: '10:05 AM' },
        { id: 102, studentId: 12, name: 'Elizabeth Scott', rollNo: 'CS2012', reason: 'Device not detected', timestamp: '10:08 AM' },
        { id: 103, studentId: 13, name: 'Daniel Lee', rollNo: 'CS2013', reason: 'Late arrival (5 min)', timestamp: '09:35 AM' },
      ];
      
      setAttendanceRequests(mockAttendanceRequests);
      
      // Create mock data
      const mockStudents = [
        { id: 1, name: 'Alex Johnson', rollNo: 'CS2001', present: false, previousAttendance: 95 },
        { id: 2, name: 'Sarah Miller', rollNo: 'CS2002', present: false, previousAttendance: 100 },
        { id: 3, name: 'David Wilson', rollNo: 'CS2003', present: false, previousAttendance: 87 },
        { id: 4, name: 'Emily Brown', rollNo: 'CS2004', present: false, previousAttendance: 92 },
        { id: 5, name: 'Michael Davis', rollNo: 'CS2005', present: false, previousAttendance: 78 },
        { id: 6, name: 'Jessica Taylor', rollNo: 'CS2006', present: false, previousAttendance: 100 },
        { id: 7, name: 'Robert Anderson', rollNo: 'CS2007', present: false, previousAttendance: 85 },
        { id: 8, name: 'Jennifer Garcia', rollNo: 'CS2008', present: false, previousAttendance: 88 },
        { id: 9, name: 'Thomas Rodriguez', rollNo: 'CS2009', present: false, previousAttendance: 90 },
        { id: 10, name: 'Lisa Martinez', rollNo: 'CS2010', present: false, previousAttendance: 97 },
        { id: 11, name: 'William Clark', rollNo: 'CS2011', present: false, previousAttendance: 83 },
        { id: 12, name: 'Elizabeth Scott', rollNo: 'CS2012', present: false, previousAttendance: 91 },
        { id: 13, name: 'Daniel Lee', rollNo: 'CS2013', present: false, previousAttendance: 76 },
        { id: 14, name: 'Linda Anderson', rollNo: 'CS2014', present: false, previousAttendance: 94 },
        { id: 15, name: 'Charles Thomas', rollNo: 'CS2015', present: false, previousAttendance: 82 },
      ];
      
      // Check if we have saved attendance data
      const savedAttendance = localStorage.getItem(`class_${id}_attendance`);
      
      if (savedAttendance) {
        // If we have saved attendance, use that data
        const parsedAttendance = JSON.parse(savedAttendance);
        setClassData({
          id: parseInt(id),
          subject: 'Data Structures & Algorithms',
          code: 'CS201',
          group: 'CS-2A',
          students: parsedAttendance
        });
      } else {
        // Otherwise, mark students as present if they were scanned in auto attendance
        const studentsWithPresence = mockStudents.map(student => ({
          ...student,
          present: scannedStudentIds.includes(student.id),
          autoDetected: scannedStudentIds.includes(student.id)
        }));
        
        setClassData({
          id: parseInt(id),
          subject: 'Data Structures & Algorithms',
          code: 'CS201',
          group: 'CS-2A',
          students: studentsWithPresence
        });
      }
      
      setLoading(false);
    }, 800);
  }, [id, scannedStudentIds]);
  
  // Save attendance data whenever it changes
  useEffect(() => {
    if (classData && classData.students) {
      localStorage.setItem(`class_${id}_attendance`, JSON.stringify(classData.students));
    }
  }, [classData, id]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Handle mark all as present
  const markAllPresent = () => {
    if (!classData) return;
    
    const updatedStudents = classData.students.map(student => ({
      ...student,
      present: true
    }));
    
    setClassData({
      ...classData,
      students: updatedStudents
    });
    
    showNotification('All students marked as present');
  };
  
  // Handle mark all as absent
  const markAllAbsent = () => {
    if (!classData) return;
    
    const updatedStudents = classData.students.map(student => ({
      ...student,
      present: false,
      autoDetected: false
    }));
    
    setClassData({
      ...classData,
      students: updatedStudents
    });
    
    showNotification('All students marked as absent');
  };
  
  // Toggle individual student attendance
  const toggleStudentAttendance = (studentId) => {
    if (!classData) return;
    
    const updatedStudents = classData.students.map(student => {
      if (student.id === studentId) {
        // If marking absent, also remove the autoDetected flag
        const present = !student.present;
        return {
          ...student,
          present,
          autoDetected: present ? student.autoDetected : false
        };
      }
      return student;
    });
    
    setClassData({
      ...classData,
      students: updatedStudents
    });
    
    // Find student name for notification
    const student = classData.students.find(s => s.id === studentId);
    
    if (student) {
      const status = updatedStudents.find(s => s.id === studentId).present ? 'present' : 'absent';
      showNotification(`${student.name} marked as ${status}`);
    }
  };
  
  // Handle rescan - go back to auto attendance
  const handleRescan = () => {
    // Clear auto-detected flags but preserve manual attendance
    if (classData && classData.students) {
      const updatedStudents = classData.students.map(student => ({
        ...student,
        autoDetected: false
      }));
      
      setClassData({
        ...classData,
        students: updatedStudents
      });
      
      localStorage.setItem(`class_${id}_attendance`, JSON.stringify(updatedStudents));
    }
    
    navigate(`/class/${id}/auto-attendance`);
  };
  
  // Save attendance and navigate back
  const saveAttendance = () => {
    // Save attendance data to localStorage before navigating away
    if (classData && classData.students) {
      localStorage.setItem(`class_${id}_attendance`, JSON.stringify(classData.students));
      
      // You could also send the data to a server here in a real app
      showNotification('Attendance saved successfully!');
      
      // Give time for the notification to be seen
      setTimeout(() => {
        navigate(`/class/${id}`);
      }, 1000);
    } else {
      navigate(`/class/${id}`);
    }
  };
  
  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };
  
  // Accept attendance request
  const acceptRequest = (requestId) => {
    // Find the request
    const request = attendanceRequests.find(req => req.id === requestId);
    if (!request) return;
    
    // Mark student as present
    const updatedStudents = classData.students.map(student => 
      student.id === request.studentId ? 
        { ...student, present: true, manuallyApproved: true } : 
        student
    );
    
    setClassData({
      ...classData,
      students: updatedStudents
    });
    
    // Remove the request
    setAttendanceRequests(attendanceRequests.filter(req => req.id !== requestId));
    
    // Show confirmation
    showNotification(`Request from ${request.name} accepted`);
  };
  
  // Reject attendance request
  const rejectRequest = (requestId) => {
    // Find the request for notification
    const request = attendanceRequests.find(req => req.id === requestId);
    
    // Remove the request
    setAttendanceRequests(attendanceRequests.filter(req => req.id !== requestId));
    
    // Show confirmation
    if (request) {
      showNotification(`Request from ${request.name} rejected`, 'error');
    }
  };
  
  // Filter students based on search query and filter type
  const filteredStudents = classData?.students.filter(student => {
    const matchesSearch = searchQuery === '' || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' || 
      (filterType === 'present' && student.present) || 
      (filterType === 'absent' && !student.present);
    
    return matchesSearch && matchesFilter;
  });
  
  // Calculate attendance statistics
  const getAttendanceStats = () => {
    if (!classData) return { present: 0, total: 0, percentage: 0, autoDetected: 0, manuallyMarked: 0 };
    
    const presentCount = classData.students.filter(s => s.present).length;
    const autoDetectedCount = classData.students.filter(s => s.autoDetected).length;
    const manuallyMarkedCount = presentCount - autoDetectedCount;
    const total = classData.students.length;
    const percentage = Math.round((presentCount / total) * 100);
    
    return { 
      present: presentCount, 
      total, 
      percentage,
      autoDetected: autoDetectedCount,
      manuallyMarked: manuallyMarkedCount
    };
  };
  
  const stats = getAttendanceStats();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(`/class/${id}`)}
            className="mr-3 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Manual Attendance</h1>
        </div>
        {!loading && (
          <div className="text-sm text-gray-500">
            {classData.subject} ({classData.group})
          </div>
        )}
      </header>
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 left-0 right-0 mx-auto w-4/5 max-w-sm z-50 rounded-lg shadow-lg p-4 ${
              notification.type === 'error' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'
            }`}
          >
            <div className="flex items-center">
              {notification.type === 'error' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              <p className={notification.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <main className="flex-1 p-4">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading attendance data...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {/* Attendance summary */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Attendance Summary</h2>
                <div className="flex flex-col items-end">
                  <div className="text-sm">
                    <span className="font-medium text-blue-600">{stats.present}/{stats.total}</span>
                    <span className="text-gray-500 ml-1">students present</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stats.autoDetected} auto-detected • {stats.manuallyMarked} manually marked
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
              <p className="text-right text-sm text-gray-600">{stats.percentage}% attendance</p>
              
              {/* Show message about scanned students */}
              {hasAutoScanned && scannedStudentIds.length > 0 && (
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-md p-3">
                  <p className="text-sm text-blue-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{scannedStudentIds.length} students</span> were automatically marked present via Bluetooth scan.
                  </p>
                </div>
              )}
            </div>
            
            {/* Attendance requests toggle */}
            {attendanceRequests.length > 0 && (
              <button
                onClick={() => setShowRequests(!showRequests)}
                className="w-full bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-amber-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full mr-2">
                    {attendanceRequests.length}
                  </span>
                  <span className="font-medium text-amber-800">Pending Attendance Requests</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-amber-600 transition-transform ${showRequests ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            
            {/* Attendance requests panel */}
            <AnimatePresence>
              {showRequests && attendanceRequests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Attendance Requests</h3>
                    <p className="text-sm text-gray-500">Students requesting manual attendance verification</p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {attendanceRequests.map(request => (
                      <motion.div 
                        key={request.id} 
                        className="p-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-start">
                            <div className="h-10 w-10 rounded-full bg-amber-100 mr-3 flex items-center justify-center text-lg font-bold text-amber-800">
                              {request.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{request.name}</h4>
                              <p className="text-sm text-gray-500">{request.rollNo} • {request.timestamp}</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
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
                            className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Accept
                          </button>
                          <button
                            onClick={() => rejectRequest(request.id)}
                            className="flex-1 py-2 px-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Search and actions */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students by name or roll number"
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Filter tabs */}
              <div className="flex mb-4 border-b border-gray-200">
                <button
                  onClick={() => setFilterType('all')}
                  className={`py-2 px-4 text-sm font-medium border-b-2 -mb-px ${
                    filterType === 'all' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Students
                </button>
                <button
                  onClick={() => setFilterType('present')}
                  className={`py-2 px-4 text-sm font-medium border-b-2 -mb-px ${
                    filterType === 'present' 
                      ? 'border-green-500 text-green-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => setFilterType('absent')}
                  className={`py-2 px-4 text-sm font-medium border-b-2 -mb-px ${
                    filterType === 'absent' 
                      ? 'border-red-500 text-red-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Absent
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={markAllPresent}
                  className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Mark All Present
                </button>
                <button
                  onClick={markAllAbsent}
                  className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center justify-center"
                >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Mark All Absent
                </button>
                {hasAutoScanned && (
                  <button
                    onClick={handleRescan}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm font-medium flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Rescan
                  </button>
                )}
              </div>
            </div>
            
            {/* Student list */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Student List</h2>
                  <p className="text-sm text-gray-500">Tap on a student card to toggle attendance</p>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredStudents.length} of {classData.students.length} shown
                </div>
              </div>
              
              {filteredStudents.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => toggleStudentAttendance(student.id)}
                      className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                        student.present ? 'bg-green-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center text-lg font-bold ${
                          student.present 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 flex items-center">
                            {student.name}
                            {student.autoDetected && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Auto-detected
                              </span>
                            )}
                            {student.manuallyApproved && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Request Approved
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-500">{student.rollNo} • {student.previousAttendance}% history</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
                          student.present 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {student.present && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : searchQuery || filterType !== 'all' ? (
                <div className="p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 mb-1">No students found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('all');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No students in this class.
                </div>
              )}
            </div>
            
            {/* Footer with save button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
              <button
                onClick={saveAttendance}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-sm font-medium transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Save Attendance
              </button>
            </div>
            
            {/* Space to prevent content from being hidden behind the fixed footer */}
            <div className="h-20"></div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ManualAttendancePage;