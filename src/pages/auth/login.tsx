import { Link } from "react-router-dom";
import ThemedButton from "../../components/ThemedButton.tsx";
import ThemedInput from "../../components/ThemedInput.tsx";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";

const Login = () => {
  return (
    <main className="bg-peach-tint-300 font-quicksand flex min-h-screen items-center justify-center overflow-auto text-xs">
      <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-lg shadow-2xl md:h-auto md:flex-row">
        <div className="md:bg-peach-tint-500 bg-peach-tint-300 flex flex-1 items-center justify-center p-8 text-center">
          <div className="md:bg-peach-tint-400 flex h-full max-h-44 flex-col items-center justify-center rounded-md bg-transparent p-8 px-4 py-8 shadow-lg">
            <div className="mb-4 text-xl font-semibold">Life, Unfiltered.</div>
            <p>
              Life isn’t always easy, but it always teaches. Every struggle has
              something to say if you’re willing to listen.
            </p>
          </div>
        </div>
        <div className="flex min-h-[450px] flex-1 flex-col justify-center gap-4 rounded-t-3xl bg-white p-6 sm:p-8 md:rounded-none">
          <img
            className="h-16 self-center md:h-20"
            src="/assets/images/rom-logo.png"
            alt="Rant on me logo"
          />
          <div>
            <p className="text-sm font-semibold">
              Welcome Back, Time to vent again?
            </p>
            <p className="text-gray-600">Please enter log in details below</p>
          </div>
          <form className="flex flex-col gap-4" action="">
            <ThemedInput
              label="Email Address"
              type="email"
              id="email"
              autoComplete="email"
              icon={<EnvelopeIcon className="text-accent h-5 w-5" />}
            />
            <ThemedInput
              label="Password"
              type="password"
              id="password"
              icon={<LockClosedIcon className="text-accent h-5 w-5" />}
            />

            <Link
              to="/forgot"
              className="text-accent self-end font-semibold underline"
            >
              Forgot Password?
            </Link>
            <ThemedButton type="submit" value="Sign in" />
          </form>
          <p className="text-center">or</p>
          <p className="text-center">Sign in with Google</p>
          <div className="flex justify-center gap-1">
            <p>Ready to vent?</p>
            <Link
              to="/register"
              className="text-accent font-semibold underline"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
