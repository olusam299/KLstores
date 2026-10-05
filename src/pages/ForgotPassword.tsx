import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components";
import { supabase } from "../lib/supabase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email");
      return;
    }

    setSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSending(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full mx-auto flex flex-col gap-5 max-sm:gap-3 items-center justify-center px-5"
      >
        <h2 className="text-5xl text-center mb-5 font-thin max-md:text-4xl max-sm:text-3xl max-[450px]:text-2xl max-[450px]:font-normal">
          Forgot your password?
        </h2>

        {sent ? (
          <p className="text-center text-lg">
            If an account exists for <strong>{email.trim()}</strong>, we've sent
            a link to reset your password. Check your inbox and your spam
            folder.
          </p>
        ) : (
          <>
            <p className="text-center text-gray-600">
              Enter the email you registered with and we'll send you a link to
              choose a new password.
            </p>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="email">Your email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
                placeholder="Enter email address"
              />
            </div>
            <Button
              type="submit"
              text={sending ? "Sending..." : "Send reset link"}
              mode="brown"
              disabled={sending}
            />
          </>
        )}

        <Link to="/login" className="text-xl max-md:text-lg max-[450px]:text-sm">
          Back to <span className="text-brand">Login</span>
        </Link>
      </form>
    </div>
  );
};
export default ForgotPassword;
