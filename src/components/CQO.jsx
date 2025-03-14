import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CQO = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [remarks, setRemarks] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
        const { data } = await axios.get('http://localhost:5000/api/events', {
            headers: { Authorization: localStorage.getItem('token') },
          });
          
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleEventSelect = async (eventId) => {
    setSelectedEvent(eventId);
    const { data } = await axios.get(`http://localhost:5000/api/feedback/${eventId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });      
    setFeedbacks(data);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post(
            'http://localhost:5000/api/feedback',
            { eventId: selectedEvent, feedback, remarks },
            { headers: { Authorization: localStorage.getItem('token') } }
          );
          
      setFeedbacks([...feedbacks, data]);
      setFeedback('');
      setRemarks('');
    } catch (error) {
      alert('Error submitting feedback');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">CQO Dashboard</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => handleEventSelect(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
        {selectedEvent && (
          <>
            <form onSubmit={handleFeedbackSubmit} className="mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Feedback
              </button>
            </form>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl mt-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Feedback Records</h2>
              <ul>
                {feedbacks.map((fb) => (
                  <li key={fb._id} className="mb-4">
                    <h3 className="text-xl font-bold">{fb.feedback}</h3>
                    <p>{fb.remarks}</p>
                    <p>{new Date(fb.date).toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CQO;
