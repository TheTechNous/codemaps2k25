import { Link, useLocation } from 'react-router-dom';
import { links } from '@/constants/links';

const Nav = () => {
  const location = useLocation();

  return (
    <nav className="flex gap-8 group">
      {links.map((link, index) => {
        const path = link.path === 'hero' ? '/safereturn' : `/safereturn/${link.path}`;
        const isActive = location.pathname === path;
        
        return (
          <Link 
            key={index} 
            to={path}
            className={`uppercase text-sm font-medium transition-all duration-400 cursor-pointer
              ${isActive 
                ? 'text-accent-primary font-semibold border-b-2 border-accent-primary' 
                : 'text-slate-700 group-hover:opacity-60 hover:text-accent-primary'
              }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
