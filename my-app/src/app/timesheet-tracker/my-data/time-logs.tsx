'use client';

import { useState, useRef, useEffect } from 'react';
import { FaCalendarAlt, FaChevronDown, FaBell, FaClock, FaEllipsisH, FaChevronLeft, FaChevronRight, FaList, FaCopy, FaPlus } from 'react-icons/fa';
import { IoFilterOutline, IoClose } from 'react-icons/io5';
import { format, startOfWeek, endOfWeek, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, subDays, addDays, isSameMonth, isToday } from 'date-fns';
// import Calendar from '../../components/Calendar';



const LogTimeModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Log Time</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>

        <form className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start gap-8">
              <label className="w-32 text-gray-600 pt-2">Project Name</label>
              <div className="flex-1">
                <div className="flex gap-2">
                  <select className="w-full p-2 border rounded">
                    <option>Select</option>
                  </select>
                  <button className="p-2 border rounded">+</button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <label className="w-32 text-gray-600 pt-2">Job Name <span className="text-red-500">*</span></label>
              <div className="flex-1">
                <div className="flex gap-2">
                  <select className="w-full p-2 border rounded">
                    <option>Select</option>
                  </select>
                  <button className="p-2 border rounded">+</button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <label className="w-32 text-gray-600 pt-2">Work Item</label>
              <div className="flex-1">
                <input type="text" className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="flex items-start gap-8">
              <label className="w-32 text-gray-600 pt-2">Date <span className="text-red-500">*</span></label>
              <div className="flex-1">
                <input type="date" className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="flex items-start gap-8">
              <label className="w-32 text-gray-600 pt-2">Description</label>
              <div className="flex-1">
                <textarea className="w-full p-2 border rounded" rows={3}></textarea>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <label className="w-32 text-gray-600 pt-2">Hours <span className="text-red-500">*</span></label>
              <div className="flex-1">
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="hours" defaultChecked />
                    <span>Total hours</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="hours" />
                    <span>Start and end time</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="hours" />
                    <span>Timer</span>
                  </label>
                </div>
                <input type="text" defaultValue="00:00" className="w-32 p-2 border rounded" />
              </div>
            </div>

            <div className="flex items-start gap-8">
              <label className="w-32 text-gray-600 pt-2">Billable Status <span className="text-red-500">*</span></label>
              <div className="flex-1">
                <select className="w-full p-2 border rounded">
                  <option>Billable</option>
                  <option>Non-billable</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DailyLogModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [rows, setRows] = useState([1, 2, 3, 4, 5]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  if (!isOpen) return null;

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="hover:bg-gray-100 p-1 rounded">
              <FaChevronLeft size={14} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <span className="text-gray-700">DRO027 - Vitchco Raj T</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded px-2 py-1">
              <button className="p-1" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
                <FaChevronLeft size={12} />
              </button>
              <div className="relative mx-1">
                <button 
                  className="p-1.5 hover:bg-gray-50 rounded"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <FaCalendarAlt className="text-gray-600" />
                </button>
                {isCalendarOpen && (
                  <Calendar 
                    value={selectedDate} 
                    onChange={(date) => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }} 
                  />
                )}
              </div>
              <button className="p-1" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
                <FaChevronRight size={12} />
              </button>
              <span className="ml-2 text-sm">{format(selectedDate, 'dd-MM-yyyy')}</span>
            </div>

            <select className="border rounded px-3 py-1.5 text-gray-700">
              <option>Daily Log</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-1.5 rounded">
              Clone
            </button>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
              <IoClose size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-3 text-left font-medium text-gray-600">S.No</th>
              <th className="border p-3 text-left font-medium text-gray-600">Project Name</th>
              <th className="border p-3 text-left font-medium text-gray-600">Job Name</th>
              <th className="border p-3 text-left font-medium text-gray-600">Work Item</th>
              <th className="border p-3 text-left font-medium text-gray-600">Billable Status</th>
              <th className="border p-3 text-left font-medium text-gray-600">Description</th>
              <th className="border p-3 text-left font-medium text-gray-600">Hour(s)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((num) => (
              <tr key={num} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-gray-600">{num}</td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Select Project</option>
                  </select>
                </td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Select Job</option>
                  </select>
                </td>
                <td className="border p-2">
                  <input type="text" className="w-full px-3 py-1.5 border rounded" />
                </td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Billable</option>
                    <option>Non-billable</option>
                  </select>
                </td>
                <td className="border p-2">
                  <input 
                    type="text" 
                    placeholder="Enter Description" 
                    className="w-full px-3 py-1.5 border rounded" 
                  />
                </td>
                <td className="border p-2">
                  <input 
                    type="text" 
                    defaultValue="00:00" 
                    className="w-full px-3 py-1.5 border rounded text-center" 
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="border p-2">
                <button 
                  className="text-blue-500 hover:underline"
                  onClick={addRow}
                >
                  Add Row
                </button>
                <span className="float-right font-medium">Total</span>
              </td>
              <td className="border p-2 text-center">00:00</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Reset</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={onClose}>Cancel</button>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-red-500">| Unpaid Leave</span>
            <span className="text-purple-500">| Absent</span>
            <span className="text-orange-500">| Paid Leave</span>
            <span className="text-yellow-500">| Weekend</span>
            <span className="text-indigo-500">| On Duty</span>
            <span className="text-blue-500">| Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Calendar = ({ value, onChange }: { value: Date; onChange: (date: Date) => void }) => {
  const getDaysArray = () => {
    const firstDayOfMonth = startOfMonth(value);
    const lastDayOfMonth = endOfMonth(value);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const allDays = getDaysArray();
  const weeks = allDays.reduce((acc: Date[][], day, index) => {
    const weekIndex = Math.floor(index / 7);
    if (!acc[weekIndex]) {
      acc[weekIndex] = [];
    }
    acc[weekIndex].push(day);
    return acc;
  }, []);

  return (
    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg p-4 z-50 w-[300px]">
      <div className="flex justify-between items-center mb-4">
        <button className="p-1" onClick={() => onChange(subMonths(value, 1))}><FaChevronLeft /></button>
        <span className="font-medium">{format(value, 'MMMM yyyy')}</span>
        <button className="p-1" onClick={() => onChange(addMonths(value, 1))}><FaChevronRight /></button>
      </div>

      <div className="grid gap-1">
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm text-gray-500 py-1">{day}</div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="grid grid-cols-7 hover:bg-blue-50 transition-colors rounded-lg"
          >
            {week.map((day, dayIndex) => {
              const isCurrentMonth = format(value, 'M') === format(day, 'M');
              const isSunday = getDay(day) === 0;
              const isSaturday = getDay(day) === 6;
              
              return (
                <div key={dayIndex} className="py-1">
                  <button
                    className={`w-full text-center ${
                      !isCurrentMonth ? 'text-gray-400' : 
                      (isSunday || isSaturday) ? 'text-red-500' : 
                      'text-gray-700'
                    }`}
                    onClick={() => {
                      onChange(day);
                    }}
                  >
                    {format(day, 'd')}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const WeeklyLogModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [rows, setRows] = useState([1, 2, 3, 4, 5]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeek, setCurrentWeek] = useState({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  });

  // Add these functions to handle week navigation
  const handlePrevWeek = () => {
    setCurrentWeek(prev => ({
      start: subDays(prev.start, 7),
      end: subDays(prev.end, 7)
    }));
    setSelectedDate(subDays(selectedDate, 7));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => ({
      start: addDays(prev.start, 7),
      end: addDays(prev.end, 7)
    }));
    setSelectedDate(addDays(selectedDate, 7));
  };

  if (!isOpen) return null;

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  const weekDays = eachDayOfInterval({
    start: currentWeek.start,
    end: currentWeek.end
  });

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="hover:bg-gray-100 p-1 rounded">
              <FaChevronLeft size={14} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <span className="text-gray-700">DRO027 - Vitchco Raj T</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={handlePrevWeek}
              >
                <FaChevronLeft size={12} />
              </button>
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-2"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <span>{format(currentWeek.start, 'dd-MM-yyyy')} - {format(currentWeek.end, 'dd-MM-yyyy')}</span>
                  <FaCalendarAlt className="text-gray-500" />
                </button>
                
                {isCalendarOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg z-50">
                    <Calendar 
                      value={selectedDate}
                      onChange={(date: Date) => {
                        setSelectedDate(date);
                        setCurrentWeek({
                          start: startOfWeek(date),
                          end: endOfWeek(date)
                        });
                        setIsCalendarOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={handleNextWeek}
              >
                <FaChevronRight size={12} />
              </button>
            </div>
            <select className="border rounded px-3 py-1.5 text-gray-700">
              <option>Weekly Log</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-1.5 rounded">
              Clone
            </button>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
              <IoClose size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-3 text-left font-medium text-gray-600">S.No</th>
              <th className="border p-3 text-left font-medium text-gray-600">Project Name</th>
              <th className="border p-3 text-left font-medium text-gray-600">Job Name</th>
              <th className="border p-3 text-left font-medium text-gray-600">Work Item</th>
              <th className="border p-3 text-left font-medium text-gray-600">Billable Status</th>
              {weekDays.map((day) => (
                <th key={format(day, 'yyyy-MM-dd')} className="border p-3 text-center font-medium text-gray-600">
                  <div>{format(day, 'MMM dd')}</div>
                  <div className="text-sm">{format(day, 'EEE')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((num) => (
              <tr key={num} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-gray-600">{num}</td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Select Project</option>
                  </select>
                </td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Select Job</option>
                  </select>
                </td>
                <td className="border p-2">
                  <input type="text" className="w-full px-3 py-1.5 border rounded" />
                </td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Billable</option>
                    <option>Non-billable</option>
                  </select>
                </td>
                {weekDays.map((day) => (
                  <td key={format(day, 'yyyy-MM-dd')} className="border p-2">
                    <input
                      type="text"
                      defaultValue="00:00"
                      className="w-full px-3 py-1.5 border rounded text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="border p-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={addRow}
                >
                  Add Row
                </button>
                <span className="float-right font-medium">Total</span>
              </td>
              {weekDays.map((day) => (
                <td key={format(day, 'yyyy-MM-dd')} className="border p-2 text-center">
                  00:00
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Reset</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={onClose}>Cancel</button>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-red-500">| Unpaid Leave</span>
            <span className="text-purple-500">| Absent</span>
            <span className="text-orange-500">| Paid Leave</span>
            <span className="text-yellow-500">| Weekend</span>
            <span className="text-indigo-500">| On Duty</span>
            <span className="text-blue-500">| Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MonthlyLogModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [rows, setRows] = useState([1, 2, 3, 4, 5]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Add these functions to handle month navigation
  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  if (!isOpen) return null;

  const addRow = () => {
    setRows([...rows, rows.length + 1]);
  };

  // Get all days in the selected month
  const monthDays = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="hover:bg-gray-100 p-1 rounded">
              <FaChevronLeft size={14} className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <span className="text-gray-700">DRO027 - Vitchco Raj T</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={handlePrevMonth}
              >
                <FaChevronLeft size={12} />
              </button>
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-2"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                >
                  <span>{format(currentMonth, 'MMM yyyy')}</span>
                  <FaCalendarAlt className="text-gray-500" />
                </button>
                
                {isCalendarOpen && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-50 p-4 w-64">
                    <div className="text-center mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                          <FaChevronLeft />
                        </button>
                        <span className="font-medium">{format(currentMonth, 'yyyy')}</span>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                          <FaChevronRight />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        {Array.from({ length: 12 }, (_, i) => {
                          const date = new Date(currentMonth.getFullYear(), i);
                          return (
                            <button
                              key={i}
                              className={`p-2 rounded-full ${
                                currentMonth.getMonth() === i ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                              }`}
                              onClick={() => {
                                setCurrentMonth(date);
                                setIsCalendarOpen(false);
                              }}
                            >
                              {format(date, 'MMM')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="p-1 hover:bg-gray-100 rounded"
                onClick={handleNextMonth}
              >
                <FaChevronRight size={12} />
              </button>
            </div>
            <select className="border rounded px-3 py-1.5 text-gray-700">
              <option>Monthly Log</option>
            </select>
            <button className="bg-blue-500 text-white px-4 py-1.5 rounded">
              Clone
            </button>
            <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded">
              <IoClose size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-3 text-left font-medium text-gray-600">S.No</th>
              <th className="border p-3 text-left font-medium text-gray-600">Project Name</th>
              <th className="border p-3 text-left font-medium text-gray-600">Job Name</th>
              <th className="border p-3 text-left font-medium text-gray-600">Work Item</th>
              <th className="border p-3 text-left font-medium text-gray-600">Billable Status</th>
              {monthDays.map((day) => (
                <th key={format(day, 'yyyy-MM-dd')} className="border p-3 text-center font-medium text-gray-600">
                  <div>{format(day, 'MMM dd')}</div>
                  <div className="text-sm">{format(day, 'EEE')}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((num) => (
              <tr key={num} className="hover:bg-gray-50">
                <td className="border px-3 py-2 text-gray-600">{num}</td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Select Project</option>
                  </select>
                </td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Select Job</option>
                  </select>
                </td>
                <td className="border p-2">
                  <input type="text" className="w-full px-3 py-1.5 border rounded" />
                </td>
                <td className="border p-2">
                  <select className="w-full px-3 py-1.5 border rounded text-gray-700">
                    <option>Billable</option>
                    <option>Non-billable</option>
                  </select>
                </td>
                {monthDays.map((day) => (
                  <td key={format(day, 'yyyy-MM-dd')} className="border p-2">
                    <input
                      type="text"
                      defaultValue="00:00"
                      className="w-full px-3 py-1.5 border rounded text-center"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className="border p-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={addRow}
                >
                  Add Row
                </button>
                <span className="float-right font-medium">Total</span>
              </td>
              {monthDays.map((day) => (
                <td key={format(day, 'yyyy-MM-dd')} className="border p-2 text-center">
                  00:00
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Reset</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={onClose}>Cancel</button>
          </div>
          <div className="flex gap-4 text-sm">
            <span className="text-red-500">| Unpaid Leave</span>
            <span className="text-purple-500">| Absent</span>
            <span className="text-orange-500">| Paid Leave</span>
            <span className="text-yellow-500">| Weekend</span>
            <span className="text-indigo-500">| On Duty</span>
            <span className="text-blue-500">| Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddProjectModal = ({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (projectName: string) => void;
}) => {
  const [projectName, setProjectName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(projectName);
    setProjectName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Add Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-lg mb-4">Project Configuration Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-2">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([
    { id: 1, name: 'Cloud Migration' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'E-commerce Platform' }
  ]);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProject = (projectName: string) => {
    setProjects(prev => [...prev, { id: prev.length + 1, name: projectName }]);
  };

  return (
    <div className="relative flex-1 max-w-[200px]">
      <button
        className="w-full p-2 border rounded flex justify-between items-center bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedProject || 'Select Project'}</span>
        <FaChevronDown className="text-gray-400" size={12} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredProjects.map(project => (
              <button
                key={project.id}
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
                onClick={() => {
                  setSelectedProject(project.name);
                  setIsOpen(false);
                }}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const TimesheetTracker = () => {
  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('Time Logs');
  const [dateRange, setDateRange] = useState('06-10-2024 - 12-10-2024');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedJob, setSelectedJob] = useState('');
  const [isLogTimeOpen, setIsLogTimeOpen] = useState(false);
  const [isBillableOpen, setIsBillableOpen] = useState(false);
  const [selectedBillable, setSelectedBillable] = useState('Billable');
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const billableDropdownRef = useRef<HTMLDivElement | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showDailyLogModal, setShowDailyLogModal] = useState(false);
  const [showWeeklyLogModal, setShowWeeklyLogModal] = useState(false);
  const [showMonthlyLogModal, setShowMonthlyLogModal] = useState(false);
  const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
  const [selectedView, setSelectedView] = useState<'month' | 'week' | 'day'>('month');
  const [projects, setProjects] = useState([
    { id: 1, name: 'Cloud Migration' },
    { id: 2, name: 'Mobile App Development' },
    { id: 3, name: 'E-commerce Platform' }
  ]);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);

  const getCalendarDays = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const startDate = startOfWeek(firstDayOfMonth);
    const endDate = endOfWeek(lastDayOfMonth);

    return eachDayOfInterval({ start: startDate, end: endDate });
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const timeLogs = [
    {
      date: new Date(2024, 10, 15),
      hours: 8,
      project: 'Project A',
      description: 'Development work'
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as Node).contains(event.target as Node)) {
        setIsLogTimeOpen(false);
      }
      if (billableDropdownRef.current && !(billableDropdownRef.current as Node).contains(event.target as Node)) {
        setIsBillableOpen(false);
      }
      if (calendarRef.current && !(calendarRef.current as Node).contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const LogTimeDropdown = () => (
    <div className="relative" ref={dropdownRef}>
      <button
        className="bg-[#0084FF] text-white px-6 py-2 rounded flex items-center gap-2"
        onClick={() => setIsLogTimeOpen(!isLogTimeOpen)}
      >
        Log Time
        <FaChevronDown size={12} />
      </button>
      
      {isLogTimeOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
          <button 
            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
            onClick={() => {
              setShowLogTimeModal(true);
              setIsLogTimeOpen(false);
            }}
          >
            Log Time
          </button>
          <button 
            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
            onClick={() => {
              setShowDailyLogModal(true);
              setIsLogTimeOpen(false);
            }}
          >
            Daily Log
          </button>
          <button 
            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
            onClick={() => {
              setShowWeeklyLogModal(true);
              setIsLogTimeOpen(false);
            }}
          >
            Weekly Log
          </button>
          <button 
            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-gray-700"
            onClick={() => {
              setShowMonthlyLogModal(true);
              setIsLogTimeOpen(false);
            }}
          >
            Monthly Log
          </button>
        </div>
      )}
      {showLogTimeModal && (
        <LogTimeModal 
          isOpen={showLogTimeModal} 
          onClose={() => setShowLogTimeModal(false)} 
        />
      )}
    </div>
  );

  const BillableDropdown = () => (
    <div className="relative" ref={billableDropdownRef}>
      <button
        className="p-2 border rounded w-32 flex items-center justify-between"
        onClick={() => setIsBillableOpen(!isBillableOpen)}
      >
        {selectedBillable}
        <FaChevronDown size={12} className="text-gray-500" />
      </button>
      
      {isBillableOpen && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          {['Billable', 'Non-billable'].map((option) => (
            <button
              key={option}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
              onClick={() => {
                setSelectedBillable(option);
                setIsBillableOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {!isCalendarViewOpen && (
            <div className="relative">
              <button 
                className="px-4 py-2 bg-white rounded border flex items-center gap-2"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              >
                <span>{dateRange}</span>
                <FaCalendarAlt className="text-gray-500" />
              </button>
              {isCalendarOpen && <Calendar value={selectedDate} onChange={setSelectedDate} />}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LogTimeDropdown />
          <button 
            className={`p-2 border rounded ${!isCalendarViewOpen ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setIsCalendarViewOpen(false)}
          >
            <FaList />
          </button>
          <button 
            className={`p-2 border rounded ${isCalendarViewOpen ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setIsCalendarViewOpen(true)}
          >
            <FaCalendarAlt />
          </button>
          <button className="p-2 bg-white border rounded">
            <IoFilterOutline />
          </button>
          <button className="p-2 bg-white border rounded">
            <FaEllipsisH />
          </button>
        </div>
      </div>

      {isCalendarViewOpen ? (
        <div className="p-4">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex justify-center items-center">
                <button 
                  className="p-2 hover:bg-gray-100 rounded"
                  onClick={handlePrevMonth}
                >
                  <FaChevronLeft className="text-gray-600" />
                </button>
                <h2 className="text-xl font-medium mx-4">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <button 
                  className="p-2 hover:bg-gray-100 rounded"
                  onClick={handleNextMonth}
                >
                  <FaChevronRight className="text-gray-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-7 gap-px bg-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="bg-white p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
                
                {getCalendarDays().map((date, index) => {
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  const dayIsToday = isToday(date);
                  const dayLogs = timeLogs.filter(log => isSameDay(log.date, date));

                  return (
                    <div 
                      key={index} 
                      className={`
                        bg-white p-2 min-h-[120px] border-t relative
                        ${!isCurrentMonth ? 'text-gray-400' : ''}
                        ${dayIsToday ? 'bg-blue-50' : ''}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`
                          text-sm rounded-full w-6 h-6 flex items-center justify-center
                          ${dayIsToday ? 'bg-blue-500 text-white' : ''}
                        `}>
                          {format(date, 'd')}
                        </span>
                        {dayLogs.length > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                            {dayLogs.reduce((acc, log) => acc + log.hours, 0)}h
                          </span>
                        )}
                      </div>

                      <div className="mt-1 space-y-1">
                        {dayLogs.map((log, logIndex) => (
                          <div 
                            key={logIndex}
                            className="text-xs p-1 bg-gray-50 rounded truncate"
                            title={log.description}
                          >
                            {log.project} - {log.hours}h
                          </div>
                        ))}
                      </div>

                      <button 
                        className="absolute bottom-1 right-1 p-1 text-gray-400 hover:text-gray-600"
                        onClick={() => {/* Handle add time log */}}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="mx-4 p-4 bg-white rounded-lg shadow-sm flex items-center gap-4">
            <ProjectSelect />

            <div className="relative flex-1 max-w-[200px]">
              <select 
                className="w-full p-2 border rounded appearance-none bg-white pr-8"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="">Select Job</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <FaChevronDown className="text-gray-400" size={12} />
              </div>
            </div>

            <input 
              type="text"
              placeholder="What are you working on?"
              className="p-2 border rounded flex-1"
            />

            <BillableDropdown />

            <button className="p-2 border rounded">
              <FaCopy className="w-5 h-5" />
            </button>

            <button className="bg-[#00E096] text-white px-4 py-2 rounded flex items-center gap-2">
              <span>00:00:00</span>
              <FaClock />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <FaClock className="w-24 h-24 text-gray-300" />
            
            <p className="mt-4 text-gray-600">
              No time logs added currently. To add new time logs, click Log Time
            </p>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 right-0 bg-white p-4 border-t w-full flex justify-end gap-6">
        <div className="text-[#0084FF]">00:00 Hrs Total</div>
        <div className="text-[#00E096]">00:00 Hrs Submitted</div>
        <div className="text-[#FFB547]">00:00 Hrs Not Submitted</div>
        <button className="bg-gray-100 px-2 rounded">
          <FaChevronRight />
        </button>
      </div>

      {showDailyLogModal && (
        <DailyLogModal 
          isOpen={showDailyLogModal} 
          onClose={() => setShowDailyLogModal(false)} 
        />
      )}

      {showWeeklyLogModal && (
        <WeeklyLogModal 
          isOpen={showWeeklyLogModal} 
          onClose={() => setShowWeeklyLogModal(false)} 
        />
      )}

      {showMonthlyLogModal && (
        <MonthlyLogModal 
          isOpen={showMonthlyLogModal} 
          onClose={() => setShowMonthlyLogModal(false)} 
        />
      )}
    </div>
  );
};

export default TimesheetTracker;
