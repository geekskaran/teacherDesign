import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AutoAttendancePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState('code'); // 'code' or 'scanning'
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedStudents, setDetectedStudents] = useState([]);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  
  // Mock class data
  const [classData, setClassData] = useState({
    id: parseInt(id),
    subject: 'Data Structures & Algorithms',
    code: 'CS201',
    group: 'CS-2A',
    totalStudents: 35,
    students: [
      { id: 1, name: 'Alex Johnson', rollNo: 'CS2001', deviceId: 'BT-001', detected: false },
      { id: 2, name: 'Sarah Miller', rollNo: 'CS2002', deviceId: 'BT-002', detected: false },
      { id: 3, name: 'David Wilson', rollNo: 'CS2003', deviceId: 'BT-003', detected: false },
      { id: 4, name: 'Emily Brown', rollNo: 'CS2004', deviceId: 'BT-004', detected: false },
      { id: 5, name: 'Michael Davis', rollNo: 'CS2005', deviceId: 'BT-005', detected: false },
      { id: 6, name: 'Jessica Taylor', rollNo: 'CS2006', deviceId: 'BT-006', detected: false },
      { id: 7, name: 'Robert Anderson', rollNo: 'CS2007', deviceId: 'BT-007', detected: false },
      { id: 8, name: 'Jennifer Garcia', rollNo: 'CS2008', deviceId: 'BT-008', detected: false },
      { id: 9, name: 'Thomas Rodriguez', rollNo: 'CS2009', deviceId: 'BT-009', detected: false },
      { id: 10, name: 'Lisa Martinez', rollNo: 'CS2010', deviceId: 'BT-010', detected: false },
    ]
  });
  
  // Handle code verification
  const verifyCode = () => {
    // For demo purposes, code is "123456"
    if (code === '123456') {
      setStep('scanning');
      startScan();
    } else {
      setError('Invalid code. Please try again.');
    }
  };
  
  // Simulate Bluetooth scanning
  const startScan = () => {
    setIsScanning(true);
    setProgress(0);
    setDetectedStudents([]);
    
    // Reset detection status
    const resetStudents = classData.students.map(student => ({
      ...student,
      detected: false
    }));
    
    setClassData({
      ...classData,
      students: resetStudents
    });
    
    const totalTime = 15000; // 15 seconds for the scan
    const updateInterval = 500; // Update every 0.5 seconds
    const totalUpdates = totalTime / updateInterval;
    let currentUpdate = 0;
    
    const progressTimer = setInterval(() => {
      currentUpdate++;
      const newProgress = Math.min((currentUpdate / totalUpdates) * 100, 100);
      setProgress(newProgress);
      
      // Randomly detect a student
      if (currentUpdate % 2 === 0) {
        const undetectedStudents = classData.students.filter(s => !s.detected);
        if (undetectedStudents.length > 0) {
          const randomIndex = Math.floor(Math.random() * undetectedStudents.length);
          const studentToDetect = undetectedStudents[randomIndex];
          
          // Update the student as detected
          const updatedStudents = classData.students.map(student => 
            student.id === studentToDetect.id ? { ...student, detected: true } : student
          );
          
          setClassData(prevData => ({
            ...prevData,
            students: updatedStudents
          }));
          
          // Add to detected students for the radar display
          setDetectedStudents(prev => [...prev, studentToDetect]);
        }
      }
      
      // End the scan
      if (currentUpdate >= totalUpdates) {
        clearInterval(progressTimer);
        setIsScanning(false);
        setScanComplete(true);
      }
    }, updateInterval);
  };
  
  // Complete attendance and navigate to manual attendance page with scanned data
// In AutoAttendancePage.jsx

// Complete attendance and navigate to manual attendance page with scanned data
// In AutoAttendancePage.jsx

// Complete attendance and navigate to manual attendance page with scanned data
const completeAttendance = () => {
  // Get IDs of detected students to pass to manual attendance
  const detectedIds = detectedStudents.map(student => student.id);
  
  // Save detected student IDs in localStorage for persistence
  localStorage.setItem(`class_${id}_scannedStudents`, JSON.stringify(detectedIds));
  
  // Set flag that we've performed a scan for this class
  localStorage.setItem(`class_${id}_autoScanned`, 'true');
  
  // Navigate to manual attendance with scanned data
  navigate(`/class/${id}/manual-attendance`, { 
    state: { 
      scannedStudentIds: detectedIds,
      fromAutoScan: true 
    } 
  });
};
  
  // Restart scan
  const restartScan = () => {
    setIsScanning(false);
    setScanComplete(false);
    startScan();
  };
  
  // Cancel and go back
  const cancelScan = () => {
    navigate(`/class/${id}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={cancelScan}
            className="mr-3 text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Auto Attendance</h1>
        </div>
        <div className="text-sm text-gray-500">{classData.subject}</div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-4">
        {step === 'code' ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mt-8"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Enter Code</h2>
              <p className="text-gray-500 mt-1">Enter the 6-digit class code to begin attendance</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Class Code</label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-4 py-3 text-center text-xl tracking-widest border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <p className="mt-2 text-xs text-gray-500 text-center">For demo, use code: 123456</p>
              </div>
              
              <button
                onClick={verifyCode}
                disabled={code.length !== 6}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  code.length === 6 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Start Scanning
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center">
            {/* Radar screen */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mt-4 mb-8"
            >
              <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-blue-200 bg-blue-50 flex items-center justify-center relative">
                {/* Radar scanning animation */}
                {isScanning && (
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0">
                      <div className="radar-scanner"></div>
                    </div>
                  </div>
                )}
                
                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 z-10"></div>
                
                {/* Concentric circles */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 rounded-full border border-blue-300"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 rounded-full border border-blue-300"></div>
                
                {/* Detected students on radar */}
                {detectedStudents.map((student, index) => {
                  const angle = (index * 36) % 360;
                  const distance = 10 + (index % 3) * 20;
                  const x = Math.cos(angle * Math.PI / 180) * distance;
                  const y = Math.sin(angle * Math.PI / 180) * distance;
                  
                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute w-10 h-10 rounded-full bg-green-100 border-2 border-green-400 flex items-center justify-center z-20"
                      style={{ 
                        top: `calc(50% + ${y}%)`, 
                        left: `calc(50% + ${x}%)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <span className="text-xs font-bold text-green-800">{student.name.charAt(0)}</span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
            
            {/* Status and controls */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isScanning ? 'Scanning Bluetooth Devices...' : 'Scan Complete'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {isScanning 
                    ? `Detected ${detectedStudents.length} of ${classData.students.length} students` 
                    : `Found ${detectedStudents.length} students in attendance`
                  }
                </p>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              {/* Recently detected students */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recently Detected:</h4>
                <div className="flex flex-wrap gap-2">
                  {detectedStudents.slice(-5).reverse().map(student => (
                    <div 
                      key={student.id}
                      className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200"
                    >
                      {student.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelScan}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                {scanComplete ? (
                  <>
                    <button
                      onClick={restartScan}
                      className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium"
                    >
                      Rescan
                    </button>
                    <button
                      onClick={completeAttendance}
                      className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <button
                    disabled={isScanning}
                    className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                      isScanning ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isScanning ? 'Scanning...' : 'Save Attendance'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Custom CSS for radar scanner animation */}
      <style jsx="true">{`
        .radar-scanner {
          width: 0;
          height: 0;
          border-left: 40vw solid transparent;
          border-bottom: 40vw solid rgba(59, 130, 246, 0.15);
          position: absolute;
          animation: radarSpin 4s infinite linear;
          transform-origin: 0 0;
        }
        
        @keyframes radarSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default AutoAttendancePage;