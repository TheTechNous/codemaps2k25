import { Link as RouterLink, useLocation } from 'react-router-dom';
import { links } from "@/constants/links";
import { Button } from "@/components/ui/button";
import { IoLogOutOutline } from "react-icons/io5";

const SideNav = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1a1b1e] shadow-shadow-1 p-6 flex flex-col overflow-hidden">
  
      <div className="mb-12">
        <RouterLink to="/safereturn" className="cursor-pointer">
          <h1 className="text-4xl font-semibold font-cookie text-accent-primary">
            SafeReturn<span className="text-5xl">.</span>
          </h1>
        </RouterLink>
      </div>

      <nav className="flex-1">
        <ul className="space-y-4">
          {links.map((link, index) => {
            
            if (link.path === 'hero') return null;
            
            const isActive = currentPath === link.path;
            
            return (
              <li key={index}>
                <RouterLink 
                  to={`/safereturn/${link.path}`}
                  className={`flex items-center gap-4 px-4 py-3 text-white transition-all duration-300 relative ${
                    isActive 
                      ? 'bg-accent-primary/10 text-accent-primary' 
                      : 'hover:bg-accent-primary/5 hover:text-accent-primary'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-accent-primary"></div>
                  )}
                  <span className="text-lg">{link.name}</span>
                </RouterLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto">
        <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 text-white hover:bg-accent-primary hover:text-white border-white/20"
        onClick={() => {
            console.log('Logout clicked');
            window.location.href = 'http://localhost:8000/logout';
        }}
        >
        <IoLogOutOutline className="text-xl" />
        <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default SideNav; 
