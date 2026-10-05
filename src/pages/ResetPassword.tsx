import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../components";
import { supabase } from "../lib/supabase";

const MIN_LENGTH = 8;

// The emailed link brings the user here with a temporary recovery session.
const ResetPassword = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    // If nothing arrives, the link was opened without a valid token.
    const timer = setTimeout(() => setExpired(true), 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < MIN_LENGTH) {
      toast.error(`Password must be at least ${MIN_LENGTH} characters`);
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    navigate("/user-profile");
  };

  if (!ready) {
    return (
      <div className="max-w-screen-2xl mx-auto pt-24 px-5 text-center">
        {expired ? (
          <>
            <p className="text-lg mb-4">
              This reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password" className="text-brand underline text-lg">
              Request a new link
            </Link>
          </>
        ) : (
          <p>Checking your reset link...</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto pt-24 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full mx-auto flex flex-col gap-5 max-sm:gap-3 items-center justify-center px-5"
      >
        <h2 className="text-5xl text-center mb-5 font-thin max-md:text-4xl max-sm:text-3xl max-[450px]:text-2xl max-[450px]:font-normal">
          Choose a new password
        </h2>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="password">New password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder={`At least ${MIN_LENGTH} characters`}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="confirm">Confirm new password</label>
          <input
            type="password"
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base"
            placeholder="Repeat the new password"
          />
        </div>
        <Button
          type="submit"
          text={saving ? "Saving..." : "Update password"}
          mode="brown"
          disabled={saving}
        />
      </form>
    </div>
  );
};
export default ResetPassword;
