import { useState } from "react";
import { registerUser } from "../services/authService";
import register from "../assets/register.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event) {
    event.preventDefault();

    if (password !== comfirmPassword) {
      setError("Password not match");
      return;
    } else {
      try {
        const { token, user } = await registerUser({ username, email, password });
        login(user, token);
        navigate("/home")
      } catch (err) {
        setError(
          err.fieldErrors
          ? Object.entries(err.fieldErrors)
              .map(([field, message]) => `${field} : ${message}`)
              .join(",")
          : err.message,
        );
      }
    }
  }

  return (
    <main className="relative">
      <div
        className="absolute inset-0 hidden bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${register})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-0 flex min-h-screen justify-between items-center px-5 py-5 md:px-16">
        <div className="md:w-full h-full"></div>
        <div className="w-full md:h-[85vh] h-[88vh] rounded max-w-2xl border border-white/10 bg-[#171a22]/95 p-8 backdrop-blur">
          <p className="mb-4 text-xs font-bold uppercase text-lime-400 tracking-[0.25em]">
            Join GameHub
          </p>
          <h1 className="text-2xl font-bold text-white">Create Your Account</h1>
          <form onSubmit={handleSubmit} className=" mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="username" className="mb-1 block text-gray-400">
                Enter username
              </label>
              <input
                id="username"
                className="w-full rounded-lg border border-white/10 bg-[#0c0e13] px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-lime-400"
                type="text"
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-gray-400">
                Enter email
              </label>
              <input
                id="email"
                className="w-full rounded-lg border border-white/10 bg-[#0c0e13] px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-lime-400"
                type="email"
                value={email}
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-gray-400">
                Enter password
              </label>
              <input
                id="password"
                className="w-full rounded-lg border border-white/10 bg-[#0c0e13] px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-lime-400"
                type="password"
                value={password}
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                className="mb-1 block text-gray-400"
                htmlFor="comfirmPassword"
              >
                Comfirm Password
              </label>
              <input
                id="comfirmPassword"
                className="w-full rounded-lg border border-white/10 bg-[#0c0e13] px-3 py-2 text-white placeholder-gray-500 outline-none focus:border-lime-400"
                type="password"
                value={comfirmPassword}
                placeholder="comfirm password"
                onChange={(e) => setComfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className=" w-full rounded-lg border border-white/10 py-2.5 bg-lime-400 text-black px-2 font-bold hover:bg-lime-300"
              >
                Submit
              </button>

              <Link to={"/home"} className="w-full">
                <button
                  className="w-full rounded-lg border border-white/10 py-2.5 font-bold text-gray-300 hover:border-white/30"
                  type="button"
                >
                  Cancel
                </button>
              </Link>
            </div>

            <span className="flex justify-center gap-1">
              Already have an account?
              <Link to={"/login"} className="text-lime-400 hover:text-lime-300">
                Login
              </Link>
            </span>
            {error && (
              <p className="text-red-400 flex justify-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;
