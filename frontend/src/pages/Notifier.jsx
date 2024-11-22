import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Send, Check } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Notifier() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    userId: '' // Empty for all users
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/notifications');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/notifications/send', notification);
      toast.success('Notification sent successfully');
      setNotification({ title: '', body: '', userId: '' });
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to send notification');
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`http://localhost:5000/api/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {user?.role === 'developer' && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <Bell className="mr-2" /> Send Notifications
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={notification.title}
                onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                value={notification.body}
                onChange={(e) => setNotification({ ...notification, body: e.target.value })}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                User ID (Leave empty to send to all users)
              </label>
              <input
                type="text"
                value={notification.userId}
                onChange={(e) => setNotification({ ...notification, userId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Send className="mr-2 h-4 w-4" /> Send Notification
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Bell className="mr-2" /> Notifications
        </h2>

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">No notifications yet</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`p-4 rounded-lg border ${
                  notif.read.includes(user?.id)
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-white border-indigo-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notif.title}</h3>
                    <p className="text-gray-600 mt-1">{notif.body}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      From: {notif.sender.name} • {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!notif.read.includes(user?.id) && (
                    <button
                      onClick={() => markAsRead(notif._id)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Notifier;