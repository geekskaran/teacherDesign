import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today');
  
  // Update the time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Mock data for today's classes
  const todaysClasses = [
    {
      id: 1,
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
      topics: ['Tree Traversal', 'Binary Heaps', 'Priority Queues'],
      nextAssignment: 'Heap Implementation Due: Friday'
    },
    {
      id: 2,
      subject: 'Computer Networks',
      code: 'CS302',
      group: 'CS-3B',
      startTime: '11:00 AM',
      endTime: '12:30 PM',
      room: 'LH-405',
      building: 'Engineering Block C',
      floor: '4th Floor',
      totalStudents: 28,
      attendedPrevious: 25,
      topics: ['TCP/IP Protocol', 'Network Security', 'Subnetting'],
      nextAssignment: 'Network Design Project Due: Monday'
    },
    {
      id: 3,
      subject: 'Machine Learning',
      code: 'CS405',
      group: 'CS-4A',
      startTime: '02:00 PM',
      endTime: '03:30 PM',
      room: 'LH-203',
      building: 'AI Research Center',
      floor: '2nd Floor',
      totalStudents: 22,
      attendedPrevious: 20,
      topics: ['Neural Networks', 'Backpropagation', 'TensorFlow'],
      nextAssignment: 'Neural Network Lab Due: Wednesday'
    }
  ];
  
  // Get upcoming classes for next 3 days
  const upcomingClasses = [
    {
      id: 4,
      day: 'Tomorrow',
      classes: [
        {
          id: 5,
          subject: 'Database Systems',
          code: 'CS304',
          group: 'CS-3A',
          startTime: '10:00 AM',
          endTime: '11:30 AM',
          room: 'LH-202'
        },
        {
          id: 6,
          subject: 'Software Engineering',
          code: 'CS401',
          group: 'CS-4B',
          startTime: '01:00 PM',
          endTime: '02:30 PM',
          room: 'LH-309'
        }
      ]
    },
    {
      id: 7,
      day: day(2),
      classes: [
        {
          id: 8,
          subject: 'Operating Systems',
          code: 'CS303',
          group: 'CS-3C',
          startTime: '09:30 AM',
          endTime: '11:00 AM',
          room: 'LH-401'
        }
      ]
    }
  ];
  
  // Format the current date
  const formattedDate = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Format the current time
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  // Function to get day name for upcoming days
  function day(daysAhead) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const nextDate = new Date();
    nextDate.setDate(date.getDate() + daysAhead);
    return days[nextDate.getDay()];
  }
  
  // Function to determine if a class is current, upcoming, or past
  const getClassStatus = (startTime, endTime) => {
    const currentTime = date.getHours() * 60 + date.getMinutes();
    
    // Convert start time to minutes
    const [startHour, startMinuteStr, startPeriod] = startTime.match(/(\d+):(\d+) (\w+)/).slice(1);
    let startHourNum = parseInt(startHour);
    if (startPeriod === 'PM' && startHourNum !== 12) startHourNum += 12;
    if (startPeriod === 'AM' && startHourNum === 12) startHourNum = 0;
    const startTimeMinutes = startHourNum * 60 + parseInt(startMinuteStr);
    
    // Convert end time to minutes
    const [endHour, endMinuteStr, endPeriod] = endTime.match(/(\d+):(\d+) (\w+)/).slice(1);
    let endHourNum = parseInt(endHour);
    if (endPeriod === 'PM' && endHourNum !== 12) endHourNum += 12;
    if (endPeriod === 'AM' && endHourNum === 12) endHourNum = 0;
    const endTimeMinutes = endHourNum * 60 + parseInt(endMinuteStr);
    
    if (currentTime >= startTimeMinutes && currentTime < endTimeMinutes) {
      return 'current';
    } else if (currentTime < startTimeMinutes) {
      return 'upcoming';
    } else {
      return 'past';
    }
  };

  // Function to navigate to class detail page
  const navigateToClassDetail = (classId) => {
    navigate(`/class/${classId}`);
  };
  
  // Function to calculate the time remaining or elapsed for a class
  const getTimeText = (classItem) => {
    const status = getClassStatus(classItem.startTime, classItem.endTime);
    const now = date.getHours() * 60 + date.getMinutes();
    
    // Convert time strings to minutes
    const [startHour, startMinute, startPeriod] = classItem.startTime.match(/(\d+):(\d+) (\w+)/).slice(1);
    let startHourNum = parseInt(startHour);
    if (startPeriod === 'PM' && startHourNum !== 12) startHourNum += 12;
    if (startPeriod === 'AM' && startHourNum === 12) startHourNum = 0;
    const startTimeMinutes = startHourNum * 60 + parseInt(startMinute);
    
    const [endHour, endMinute, endPeriod] = classItem.endTime.match(/(\d+):(\d+) (\w+)/).slice(1);
    let endHourNum = parseInt(endHour);
    if (endPeriod === 'PM' && endHourNum !== 12) endHourNum += 12;
    if (endPeriod === 'AM' && endHourNum === 12) endHourNum = 0;
    const endTimeMinutes = endHourNum * 60 + parseInt(endMinute);
    
    if (status === 'current') {
      const minutesLeft = endTimeMinutes - now;
      return `${minutesLeft} minutes remaining`;
    } else if (status === 'upcoming') {
      const minutesToStart = startTimeMinutes - now;
      if (minutesToStart < 60) {
        return `Starts in ${minutesToStart} minutes`;
      } else {
        const hoursToStart = Math.floor(minutesToStart / 60);
        const remainingMinutes = minutesToStart % 60;
        return `Starts in ${hoursToStart}h ${remainingMinutes}m`;
      }
    } else {
      return `Ended ${classItem.endTime}`;
    }
  };

  return (
    <Layout currentPage="Home">
      <div className="space-y-6">
        {/* Header with date, time and welcome message */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome, Dr. Smith</h2>
            <p className="text-gray-500">{formattedDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-blue-600">{formattedTime}</p>
            <p className="text-sm text-gray-500">Campus Network</p>
          </div>
        </motion.div>
        
        {/* Stats overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-medium text-blue-700 mb-1">Today's Classes</p>
            <p className="text-2xl font-bold text-blue-800">{todaysClasses.length}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="text-xs font-medium text-green-700 mb-1">Total Students</p>
            <p className="text-2xl font-bold text-green-800">
              {todaysClasses.reduce((total, cls) => total + cls.totalStudents, 0)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-xs font-medium text-purple-700 mb-1">Avg. Attendance</p>
            <p className="text-2xl font-bold text-purple-800">
              {Math.round((todaysClasses.reduce((total, cls) => total + cls.attendedPrevious, 0) / 
                todaysClasses.reduce((total, cls) => total + cls.totalStudents, 0)) * 100)}%
            </p>
          </div>
        </motion.div>
        
        {/* Tab navigation for Today/Upcoming */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('today')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'today'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Today's Schedule
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming Classes
            </button>
          </nav>
        </div>
        
        {/* Today's classes tab */}
        {activeTab === 'today' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Today's Classes
            </h3>
            
            {/* Timeline view for today's classes */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute h-full w-0.5 bg-gray-200 left-7 top-0"></div>
              
              {todaysClasses.map((classItem, index) => {
                const status = getClassStatus(classItem.startTime, classItem.endTime);
                const timeText = getTimeText(classItem);
                
                return (
                  <motion.div
                    key={classItem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="relative pb-8"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-7 -ml-3 h-6 w-6 rounded-full border-2 border-white shadow flex items-center justify-center ${
                      status === 'current' ? 'bg-green-500' : 
                      status === 'upcoming' ? 'bg-blue-500' : 
                      'bg-gray-400'
                    }`}>
                      {status === 'current' && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      )}
                      {status === 'current' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      ) : status === 'upcoming' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Class card */}
                    <div className="ml-14">
                      <div 
                        className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:shadow-lg hover:-translate-y-1 ${
                          status === 'current' ? 'border-l-4 border-green-500' : 
                          status === 'upcoming' ? 'border-l-4 border-blue-500' : 
                          'border-l-4 border-gray-300'
                        }`}
                        onClick={() => navigateToClassDetail(classItem.id)}
                      >
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">{classItem.subject}</h4>
                              <p className="text-sm text-gray-500">{classItem.code} • {classItem.group}</p>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              status === 'current' ? 'bg-green-100 text-green-800' : 
                              status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {status === 'current' ? 'Ongoing' : status === 'upcoming' ? 'Completed' : 'Upcoming'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600">{classItem.startTime} - {classItem.endTime}</span>
                            </div>
                            <div className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600">Room {classItem.room}</span>
                            </div>
                            <div className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                              </svg>
                              <span className="text-gray-600">{classItem.totalStudents} Students</span>
                            </div>
                            <div className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600">{classItem.building}</span>
                            </div>
                          </div>
                          
                          {/* Topics & Progress */}
                          <div className="mt-3 flex justify-between items-center">
                            <div className="flex-1">
                              <div className="text-xs text-gray-500 mb-1">Topics to Cover:</div>
                              <div className="flex flex-wrap gap-1">
                                {classItem.topics.map((topic, i) => (
                                  <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-medium text-gray-500">{timeText}</div>
                              {/* Only show progress for current classes */}
                              {status === 'current' && (
                                <div className="mt-1 w-24 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-green-500 h-2 rounded-full"
                                    style={{ 
                                      width: `${calculateProgressPercent(classItem.startTime, classItem.endTime, date)}%`
                                    }}
                                  ></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
        
        {/* Upcoming classes tab */}
        {activeTab === 'upcoming' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {upcomingClasses.map((daySchedule) => (
              <div key={daySchedule.id} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700">{daySchedule.day}</h3>
                
                <div className="space-y-3">
                  {daySchedule.classes.map((classItem, index) => (
                    <motion.div
                      key={classItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <div 
                        className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-400"
                        onClick={() => navigateToClassDetail(classItem.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{classItem.subject}</h4>
                            <p className="text-sm text-gray-500">{classItem.code} • {classItem.group}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{classItem.startTime} - {classItem.endTime}</p>
                            <p className="text-xs text-gray-500">Room {classItem.room}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

// Helper function to calculate class progress percentage
function calculateProgressPercent(startTime, endTime, currentDate) {
  // Convert times to minutes since start of day
  const [startHour, startMinute, startPeriod] = startTime.match(/(\d+):(\d+) (\w+)/).slice(1);
  let startHourNum = parseInt(startHour);
  if (startPeriod === 'PM' && startHourNum !== 12) startHourNum += 12;
  if (startPeriod === 'AM' && startHourNum === 12) startHourNum = 0;
  const startMinutes = startHourNum * 60 + parseInt(startMinute);
  
  const [endHour, endMinute, endPeriod] = endTime.match(/(\d+):(\d+) (\w+)/).slice(1);
  let endHourNum = parseInt(endHour);
  if (endPeriod === 'PM' && endHourNum !== 12) endHourNum += 12;
  if (endPeriod === 'AM' && endHourNum === 12) endHourNum = 0;
  const endMinutes = endHourNum * 60 + parseInt(endMinute);
  
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  
  // Calculate percentage
  const totalDuration = endMinutes - startMinutes;
  const elapsed = currentMinutes - startMinutes;
  const percentage = Math.min(Math.max(Math.round((elapsed / totalDuration) * 100), 0), 100);
  
  return percentage;
}

export default HomePage;