import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components";
import { checkLoginFormData } from "../utils/checkLoginFormData";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useAppSelector } from "../hooks";

const Login = () => {
  const navigate = useNavigate();
  const { loginStatus } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      email: string;
      password: string;
    };
    if (!checkLoginFormData(data)) return;

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("You logged in successfully");
    navigate("/user-profile");
  };

  useEffect(() => {
    if (loginStatus) {
      toast.success("You are already logged in");
      navigate("/user-profile");
    }
  }, [loginStatus, navigate]);

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="max-w-5xl mx-auto flex flex-col gap-5 max-sm:gap-3 items-center justify-center max-sm:px-5"
      >
        <h2 className="text-5xl text-center mb-5 font-thin max-md:text-4xl max-sm:text-3xl max-[450px]:text-xl max-[450px]:font-normal">
          Welcome Back! Login here:
        </h2>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Your email</label>
            <input
              type="email"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter email address"
              name="email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Your password</label>
            <input
              type="password"
              className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
              placeholder="Enter password"
              name="password"
            />
          </div>
        </div>
        <Button type="submit" text="Login" mode="brown" />
        <Link
          to="/forgot-password"
          className="text-lg max-md:text-base max-[450px]:text-sm text-brand"
        >
          Forgot your password?
        </Link>
        <Link
          to="/register"
          className="text-xl max-md:text-lg max-[450px]:text-sm"
        >
          Don't have an account?{" "}
          <span className="text-brand">Register now</span>.
        </Link>
      </form>
    </div>
  );
};
export default Login;
