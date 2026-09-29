import { HiArrowLeft } from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <div className="max-w-screen-2xl mx-auto px-5 max-[400px]:px-3 pt-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-black/70 hover:text-brand transition-colors text-sm"
      >
        <HiArrowLeft className="text-lg" />
        Back
      </button>
    </div>
  );
};

export default BackButton;
