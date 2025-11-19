import { LogOut } from 'lucide-react';

export default function Logout({ onLogout }: { onLogout: () => void }) {
  return (
    <button
      onClick={onLogout}
      style={{ backgroundColor: '#2de0ae' }}
      className="px-4 py-2 rounded-md text-white font-semibold transition text-sm hover:brightness-90 flex items-center"
    >
      <LogOut size={16} className="mr-2" />
      <span>Sign Out</span>
    </button>
  );
}
