import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CiMenuFries } from "react-icons/ci";
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { links } from "@/constants/links";

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] stroke-2 text-accent-primary" />
      </SheetTrigger>
      <SheetContent className="flex flex-col text-white">
        <div className="my-24 text-center text-2xl">
          <RouterLink to="/" className="cursor-pointer">
            <h1 className="text-5xl font-semibold font-cookie">
              safereturn<span className="text-5xl text-accent-primary">.</span>
            </h1>
          </RouterLink>
        </div>

        {/* nav */}
        <nav className="flex flex-col justify-center items-center gap-8 group">
          {links.map((link, index) => {
            return (
              <ScrollLink 
                  key={index} 
                  to={link.path} 
                  smooth={true}
                  duration={500}
                  spy={true}
                  className="uppercase text-sm opacity-100 font-medium text-inactive group-hover:opacity-50 hover:text-accent-primary hover:!opacity-100 transition-all duration-400 cursor-pointer"
                  activeClass="!text-accent-primary !opacity-100 underline underline-offset-4 decoration-wavy"
                  >
                  {link.name}
                </ScrollLink>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
