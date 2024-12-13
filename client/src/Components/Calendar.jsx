import React, {useState} from "react";
import EventModal from "./EventModal";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
} from "date-fns";
import {useLocalStorage} from "../Hook/useLocalStorage";
const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useLocalStorage("events", {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="px-4 py-2 bg-green-100 rounded"
      >
        Previous
      </button>
      <h2 className="text-lg font-bold text-white">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="px-4 py-2 bg-green-100 rounded"
      >
        Next
      </button>
    </div>
  );

  const renderDaysHeader = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="grid grid-cols-7 text-center font-semibold mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="py-2 m-1 bg-lime-200 text-gray-800 border rounded"
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCurrentDay = isToday(day);
          const isSelectedDay = isSameDay(day, selectedDate);
          const isSameMonthDay = day.getMonth() === currentMonth.getMonth();

          return (
            <div
              key={index}
              className={`p-4 border text-center rounded border-cyan-300 box shadow-2xl cursor-pointer ${
                isSameMonthDay ? "text-black" : "text-gray-400"
              } ${isCurrentDay ? "bg-green-300" : ""} ${
                isSelectedDay ? "bg-green-400 text-white" : ""
              }`}
              onClick={() => setSelectedDate(day)}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    );
  };

  const renderEvents = () => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const dayEvents = events[dateKey] || [];

    return (
      <>
        <div className="mt-4">
          <h3 className="font-bold mb-2">
            Events on {format(selectedDate, "MMMM d, yyyy")}:
          </h3>
          {dayEvents.length ? (
            dayEvents.map((event, index) => (
              <div key={index} className="p-2 border mb-2 rounded-lg">
                <h4 className="font-bold">{event.name}</h4>
                <p>
                  {event.startTime} - {event.endTime}
                </p>
                <p>{event.description}</p>
                <button
                  onClick={() => {
                    setModalData({
                      ...event,
                      date: selectedDate,
                    });
                    setIsModalOpen(true);
                  }}
                  className="mt-2 bg-green-400 text-white px-4 py-2 rounded ml-auto block"
                >
                  Edit Event
                </button>
              </div>
            ))
          ) : (
            <p>No events for this day.</p>
          )}
          <button
            className="mt-4 bg-green-400 text-white px-4 py-2 rounded"
            onClick={() => {
              setModalData({
                date: selectedDate,
                name: "",
                startTime: "",
                endTime: "",
                description: "",
              });
              setIsModalOpen(true);
            }}
          >
            Add Event
          </button>
        </div>
      </>
    );
  };

  const handleDeleteEvent = (eventToDelete) => {
    const dateKey = format(eventToDelete.date, "yyyy-MM-dd");
    const updatedEvents = events[dateKey].filter(
      (event) => event.name !== eventToDelete.name
    );
    setEvents((prevEvents) => ({
      ...prevEvents,
      [dateKey]: updatedEvents,
    }));
  };
  const handleSaveEvent = (eventData) => {
    const dateKey = format(eventData.date, "yyyy-MM-dd");

    if (eventData.id) {
      const updatedEvents = events[dateKey].map((event) =>
        event.id === eventData.id ? {...event, ...eventData} : event
      );
      setEvents((prev) => ({
        ...prev,
        [dateKey]: updatedEvents,
      }));
    } else {
      setEvents((prev) => ({
        ...prev,
        [dateKey]: [
          ...(prev[dateKey] || []),
          {...eventData, id: new Date().getTime()}, // Assign a new unique ID
        ],
      }));
    }
    setIsModalOpen(false); // Close the modal after saving
  };

  return (
    <>
      <div className="p-4 max-w-3xl mx-auto ">
        {renderHeader()}
        {renderDaysHeader()}
        {renderDays()}
        {renderEvents()}
        {isModalOpen && (
          <EventModal
            data={modalData}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </>
  );
};
export default Calendar;
