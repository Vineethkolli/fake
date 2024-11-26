import { Link, useLocation } from 'react-router-dom';
import { Home, User, Users, Download, Bell, CreditCard, Settings, IndianRupee, Trash2, CheckSquare, BarChart2, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, onNavigate }) {
  const location = useLocation();
  const { user } = useAuth();

  const links = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/stats', icon: BarChart2, label: 'Stats' },
    { to: '/income', icon: IndianRupee, label: 'Income' },
    { to: '/expense', icon: IndianRupee, label: 'Expense' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/pay-online', icon: CreditCard, label: 'Pay Online' },
    { to: '/notifier', icon: Bell, label: 'Notifications' },
    { to: '/settings', icon: Settings, label: 'Settings' },
    // Show Users only for developers
    ...(user?.role === 'developer' ? [
      { to: '/users', icon: Users, label: 'Users' },
      { to: '/developer-options', icon: Terminal, label: 'Developer Options' }
    ] : []),
    // Show Verification for developers and financiers
    ...(user?.role === 'developer' || user?.role === 'financier' ? [
      { to: '/verification', icon: CheckSquare, label: 'Verification' }
    ] : []),
    // Show Recycle Bin for both developers and financiers
    ...(user?.role === 'developer' || user?.role === 'financier' ? [
      { to: '/recycle-bin', icon: Trash2, label: 'Recycle Bin' }
    ] : [])
  ];

  const handleClick = () => {
    if (window.innerWidth < 768) {
      onNavigate();
    }
  };

  return (
    <div className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 z-10`}>
      <div className="w-60 h-full flex flex-col">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleClick}
                className={`${
                  location.pathname === link.to
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <Icon className="mr-3 h-6 w-6" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;