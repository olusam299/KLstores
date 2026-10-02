import { useEffect, useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";

type ProfileForm = {
  name: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
};

const inputClass =
  "bg-white border border-black text-xl py-2 px-3 w-full outline-none max-[450px]:text-base";

const UserProfile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm | null>(null);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.error("Logged out successfully");
    navigate("/login");
  };

  useEffect(() => {
    const load = async () => {
      // Ask Supabase directly (not Redux) so we don't bounce a logged-in user
      // to /login before AuthListener has finished restoring the session.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.error("Please login to view this page");
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("id", session.user.id)
        .maybeSingle();

      const fullName = (profile?.full_name ?? "").trim();
      const [first = "", ...rest] = fullName.split(" ");

      setUserId(session.user.id);
      setForm({
        name: first,
        lastname: rest.join(" "),
        email: session.user.email ?? "",
        phone: profile?.phone ?? "",
        address: profile?.address ?? "",
      });
    };
    load();
  }, [navigate]);

  const updateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) return;
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;

    if (!data.name?.trim() || !data.lastname?.trim()) {
      toast.error("Please enter your first and last name");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: `${data.name.trim()} ${data.lastname.trim()}`,
        phone: data.phone?.trim() || null,
        address: data.address?.trim() || null,
      })
      .eq("id", userId);

    if (error) {
      toast.error("Profile update failed");
      return;
    }

    if (data.password) {
      const { error: pwError } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (pwError) {
        toast.error(pwError.message);
        return;
      }
    }

    toast.success("Profile updated successfully");
  };

  if (!form) {
    return <div className="max-w-screen-lg mx-auto mt-24 px-5">Loading...</div>;
  }

  return (
    <div className="max-w-screen-lg mx-auto mt-24 px-5">
      <h1 className="text-3xl font-bold mb-8">User Profile</h1>
      <form className="flex flex-col gap-6" onSubmit={updateUser}>
        <div className="flex flex-col gap-1">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter first name"
            id="firstname"
            name="name"
            defaultValue={form.name}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter last name"
            id="lastname"
            name="lastname"
            defaultValue={form.lastname}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className={`${inputClass} bg-gray-100`}
            id="email"
            name="email"
            defaultValue={form.email}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            className={inputClass}
            placeholder="Enter phone number"
            id="phone"
            name="phone"
            defaultValue={form.phone}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="address">Delivery address</label>
          <input
            type="text"
            className={inputClass}
            placeholder="Enter delivery address"
            id="address"
            name="address"
            defaultValue={form.address}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">New password (leave blank to keep current)</label>
          <input
            type="password"
            className={inputClass}
            placeholder="Enter new password"
            id="password"
            name="password"
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" text="Update Profile" mode="brown" />
        <Link
          to="/order-history"
          className="bg-white text-black text-center text-xl border border-gray-400 font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center max-md:text-base"
        >
          Order History
        </Link>
        <Button onClick={logout} text="Logout" mode="white" />
      </form>
    </div>
  );
};

export default UserProfile;
