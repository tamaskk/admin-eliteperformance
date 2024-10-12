import {
  Gif as GiftIcon,
  Help as HelpIcon,
  Home as HomeIcon,
  LocationOn as LocationOnIcon,
  Mail as MailIcon,
  ReportProblem as ReportProblemIcon,
  ShoppingCart as ShoppingCartIcon,
  SportsEsports as SportsEsportsIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import BookIcon from "@mui/icons-material/Book";
import RestoreIcon from "@mui/icons-material/Restore";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import EmailIcon from "@mui/icons-material/Email";

const Nav = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const firstLetterCapital = (word: string | null | undefined) => {
    return word && word.charAt(0).toUpperCase() + word.slice(1);
  };

  const menus = [
    {
      name: "Blog posztok",
      icon: <BookIcon />,
      link: "/blog-posts",
    },
    {
      name: "Hírlevél",
      icon: <EmailIcon />,
      link: "/newsletter",
    },
  ];

  const isActive = (menuLink: string) => {
    if (menuLink === "/") {
      return router.pathname === menuLink;
    }
    return router.pathname.includes(menuLink);
  };

  return (
    <>
      <MenuIcon
        onClick={() => setOpen(!open)}
        className="sm:hidden fixed top-4 right-4 text-white bg-gray-800 p-2 rounded-md"
      />
      <div
        className={`w-64 max-w-64 max-sm:fixed max-sm:top-0 max-sm:left-0 ${
          open ? "max-sm:translate-x-0" : "max-sm:-translate-x-[1000px]"
        } transition-all duration-300 bg-gray-800 text-white flex flex-col h-screen`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">ElitePerformance</h1>
          <h2 className="text-lg mb-2">Admin felület</h2>
          <p className="text-sm">
            {/* {firstLetterCapital(session?.user?.name)} */}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-4">
            {menus.map((menu, index) => (
              <li key={index}>
                <Link href={menu.link}>
                  <p
                    className={`flex items-center p-3 rounded-md text-sm font-medium transition-colors duration-300 ${
                      isActive(menu.link)
                        ? "bg-gray-700 text-yellow-400"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-3">{menu.icon}</span>
                    {menu.name}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4">
          <button
            onClick={() => signOut()}
            className="w-full text-red-400 hover:bg-gray-700 py-2 rounded-md text-center"
          >
            Kijelentkezés
          </button>
        </div>
      </div>
    </>
  );
};

export default Nav;
