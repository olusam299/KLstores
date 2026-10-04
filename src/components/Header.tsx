import {
  HiBars3,
  HiOutlineUser,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";
import { useState } from "react";
import { useAppSelector } from "../hooks";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

const navLinkClass =
  "text-base tracking-wide hover:text-brand transition-colors";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { loginStatus, isAdmin } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    toast.error("Logged out successfully");
    navigate("/login");
  };

  return (
    <>
      <header className="max-w-screen-2xl mx-auto flex items-center justify-between py-4 px-5 text-black max-sm:px-5 max-[400px]:px-3">
        {/* Mobile: hamburger opens the sidebar. Hidden from lg up, where
            the full nav below takes over instead. */}
        <HiBars3
          className="text-2xl max-sm:text-xl cursor-pointer lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />

        <Link
          to="/"
          className="text-4xl font-light tracking-[1.08px] max-sm:text-3xl max-[400px]:text-2xl text-brand"
        >
          KLstores
        </Link>

        {/* Desktop nav: everything that lives in the mobile sidebar,
            laid out inline instead. Hidden below lg. */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link to="/" className={navLinkClass}>
            Home
          </Link>
          <Link to="/shop" className={navLinkClass}>
            Shop
          </Link>
          {loginStatus && (
            <Link to="/order-history" className={navLinkClass}>
              Order History
            </Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin/products" className={navLinkClass}>
                Admin
              </Link>
              <Link to="/admin/orders" className={navLinkClass}>
                Orders
              </Link>
            </>
          )}
        </nav>

        <div className="flex gap-4 items-center max-sm:gap-2">
          <Link to="/search">
            <HiOutlineMagnifyingGlass className="text-2xl max-sm:text-xl" />
          </Link>

          {loginStatus ? (
            <>
              <Link to="/user-profile">
                <HiOutlineUser className="text-2xl max-sm:text-xl" />
              </Link>
              <button
                onClick={logout}
                className="hidden lg:block text-base tracking-wide hover:text-brand transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <HiOutlineUser className="text-2xl max-sm:text-xl" />
            </Link>
          )}

          <Link to="/cart">
            <HiOutlineShoppingBag className="text-2xl max-sm:text-xl" />
          </Link>
        </div>
      </header>
      {/* Sidebar itself is only ever opened from the mobile hamburger,
          but keep the component mounted so it can still close smoothly. */}
      <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </>
  );
};
export default Header;
