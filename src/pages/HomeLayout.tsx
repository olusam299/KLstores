import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ScrollToTop, AuthListener, BackButton } from "../components";

const HomeLayout = () => {
  return (
    <>
      <AuthListener />
      <ScrollToTop />
      <Header />
      <BackButton />
      <Outlet />
      <Footer />
    </>
  );
};
export default HomeLayout;
