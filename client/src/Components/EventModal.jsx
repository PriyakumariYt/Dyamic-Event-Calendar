import {useState} from "react";
const EventModal = ({data, onSave, onDelete, onClose}) => {
  const [eventData, setEventData] = useState(data);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setEventData({...eventData, [name]: value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving event:", eventData);
    onSave(eventData);
  };

  const handleDelete = () => {
    console.log("Deleting event:", eventData);
    onDelete(eventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-green-300 p-6 rounded-lg w-96">
        <h3 className="font-bold mb-4">
          {data.name ? "Edit Event" : "Add Event"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold mb-2">Event Name</label>
            <input
              type="text"
              name="name"
              value={eventData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">End Time</label>
            <input
              type="time"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2">Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded"
            >
              Cancel
            </button>
            {data.name && (
              <button
                type="button"
                onClick={handleDelete}
                className="mr-2 px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
