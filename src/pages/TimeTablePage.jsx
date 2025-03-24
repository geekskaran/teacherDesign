import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

const TimeTablePage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [showLectureDetail, setShowLectureDetail] = useState(false);

  // Mock data for teacher's lectures
  const mockLectures = [
    {
      id: 1,
      subject: 'Mathematics',
      group: 'Group A',
      room: 'Room 101',
      startTime: '09:00',
      endTime: '10:30',
      day: 1, // Monday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      students: [
        { id: 1, name: 'John Doe', present: true },
        { id: 2, name: 'Jane Smith', present: false },
        { id: 3, name: 'Mike Johnson', present: true },
        { id: 4, name: 'Emily Davis', present: true },
      ]
    },
    {
      id: 2,
      subject: 'Physics',
      group: 'Group B',
      room: 'Room 102',
      startTime: '11:00',
      endTime: '12:30',
      day: 1, // Monday
      students: [
        { id: 5, name: 'Sarah Wilson', present: true },
        { id: 6, name: 'David Brown', present: true },
        { id: 7, name: 'Emma Taylor', present: false },
        { id: 8, name: 'Michael Clark', present: true },
      ]
    },
    {
      id: 3,
      subject: 'Chemistry',
      group: 'Group C',
      room: 'Lab 201',
      startTime: '09:00',
      endTime: '10:30',
      day: 2, // Tuesday
      students: [
        { id: 9, name: 'Robert Miller', present: true },
        { id: 10, name: 'Linda Anderson', present: true },
        { id: 11, name: 'Thomas White', present: false },
        { id: 12, name: 'Patricia Moore', present: true },
      ]
    },
    {
      id: 4,
      subject: 'Biology',
      group: 'Group A',
      room: 'Lab 202',
      startTime: '13:00',
      endTime: '14:30',
      day: 3, // Wednesday
      students: [
        { id: 13, name: 'James Wilson', present: false },
        { id: 14, name: 'Jennifer Martin', present: true },
        { id: 15, name: 'Daniel Johnson', present: true },
        { id: 16, name: 'Barbara Lee', present: true },
      ]
    },
    {
      id: 5,
      subject: 'English',
      group: 'Group B',
      room: 'Room 103',
      startTime: '15:00',
      endTime: '16:30',
      day: 4, // Thursday
      students: [
        { id: 17, name: 'Mark Harris', present: true },
        { id: 18, name: 'Elizabeth Young', present: true },
        { id: 19, name: 'Christopher Allen', present: false },
        { id: 20, name: 'Susan Walker', present: true },
      ]
    },
    {
      id: 6,
      subject: 'History',
      group: 'Group C',
      room: 'Room 104',
      startTime: '09:00',
      endTime: '10:30',
      day: 5, // Friday
      students: [
        { id: 21, name: 'Joseph King', present: true },
        { id: 22, name: 'Mary Scott', present: false },
        { id: 23, name: 'Andrew Baker', present: true },
        { id: 24, name: 'Karen Green', present: true },
      ]
    }
  ];

  // Generate calendar days for the current month
  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  // Filter lectures for the selected date
  useEffect(() => {
    const dayOfWeek = selectedDate.getDay();
    const filteredLectures = mockLectures.filter(lecture => lecture.day === dayOfWeek);
    setLectures(filteredLectures);
  }, [selectedDate]);

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Calendar array to hold all days
    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        date: null,
        isCurrentMonth: false,
        hasLecture: false,
      });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay();
      const hasLecture = mockLectures.some(lecture => lecture.day === dayOfWeek);
      
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isToday: isSameDay(currentDate, new Date()),
        hasLecture,
      });
    }
    
    // Fill remaining slots in the last week if needed
    const remainingSlots = 7 - (days.length % 7);
    if (remainingSlots < 7) {
      for (let i = 0; i < remainingSlots; i++) {
        days.push({
          date: null,
          isCurrentMonth: false,
          hasLecture: false,
        });
      }
    }
    
    setCalendarDays(days);
  };

  const isSameDay = (date1, date2) => {
    // Return false if either date is null or undefined
    if (!date1 || !date2) return false;
    
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    if (day.date) {
      setSelectedDate(day.date);
    }
  };

  const handleLectureClick = (lecture) => {
    // Navigate to ClassDetailPage with lecture ID and date information
    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    navigate(`/lecture/${lecture.id}?date=${formattedDate}`);
  };

  const handleBackToLectures = () => {
    setShowLectureDetail(false);
    setSelectedLecture(null);
  };

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAttendanceRate = (students) => {
    const presentStudents = students.filter(student => student.present).length;
    return Math.round((presentStudents / students.length) * 100);
  };

  return (
    <Layout currentPage="Timetable">
      <div className="flex flex-col h-full p-4 pb-20">
        {!showLectureDetail ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            {/* Calendar Header */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold">{formatMonth(currentDate)}</h2>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
              
              {calendarDays.map((day, index) => (
                <motion.div
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    aspect-square flex items-center justify-center rounded-full cursor-pointer
                    ${day.date ? 'hover:bg-blue-50' : ''}
                    ${day.isToday ? 'bg-blue-100 text-blue-800 font-semibold' : ''}
                    ${day.isCurrentMonth && day.date ? 'text-gray-800' : 'text-gray-300'}
                    ${day.hasLecture ? 'border-2 border-blue-400' : ''}
                    ${isSameDay(day.date, selectedDate) ? 'bg-blue-500 text-white' : ''}
                  `}
                  onClick={() => day.date && handleDateClick(day)}
                >
                  {day.date ? day.date.getDate() : ''}
                </motion.div>
              ))}
            </div>

            {/* Selected Date */}
            <div className="my-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {formatDate(selectedDate)}
              </h3>
            </div>

            {/* Lectures for Selected Date */}
            <div className="flex flex-col space-y-3">
              {lectures.length > 0 ? (
                lectures.map((lecture) => (
                  <motion.div
                    key={lecture.id}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white rounded-lg shadow-md p-4 cursor-pointer"
                    onClick={() => handleLectureClick(lecture)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{lecture.subject}</h4>
                        <p className="text-sm text-gray-500">{lecture.group} - {lecture.room}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">{lecture.startTime} - {lecture.endTime}</p>
                        <div className="mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {getAttendanceRate(lecture.students)}% Present
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No lectures scheduled for this day
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            {/* Lecture Detail Header */}
            <div className="flex items-center mb-4">
              <button
                onClick={handleBackToLectures}
                className="p-2 mr-2 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold">Lecture Details</h2>
            </div>

            {selectedLecture && (
              <div className="flex flex-col">
                {/* Lecture Info */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {selectedLecture.subject}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Group</p>
                      <p className="text-md font-medium">{selectedLecture.group}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Room</p>
                      <p className="text-md font-medium">{selectedLecture.room}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="text-md font-medium">
                        {selectedLecture.startTime} - {selectedLecture.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-md font-medium">
                        {formatDate(selectedDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold text-gray-800">Attendance</h4>
                    <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {getAttendanceRate(selectedLecture.students)}% Present
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${getAttendanceRate(selectedLecture.students)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Student List */}
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Students</h4>
                  <div className="space-y-2">
                    {selectedLecture.students.map((student) => (
                      <div
                        key={student.id}
                        className="flex justify-between items-center p-2 border-b last:border-0"
                      >
                        <span className="font-medium">{student.name}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.present
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {student.present ? 'Present' : 'Absent'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default TimeTablePage;