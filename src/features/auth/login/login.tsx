import ThemedButton from "../../../components/ThemedButton.tsx";
import ThemedInput from "../../../components/ThemedInput.tsx";
import FadeSlideIn from "../../../components/FadeSlideIn.tsx";
import { Link } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/solid";

const Login = () => {
  return (
    <main className="bg-background text-text-primary flex min-h-screen items-center justify-center overflow-auto text-sm">
      <FadeSlideIn className="w-full max-w-3xl">
        <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-lg shadow-2xl md:h-auto md:flex-row">
          <div className="md:bg-surface flex flex-1 items-center justify-center bg-transparent p-8 text-center">
            <div className="bg-peach-200 flex h-full max-h-44 flex-col items-center justify-center rounded-md p-8 shadow-md">
              <div className="mb-4 text-xl font-semibold">
                Life, Unfiltered.
              </div>
              <p className="text-text-secondary">
                Life isn’t always easy, but it always teaches. Every struggle
                has something to say if you’re willing to listen.
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
              <p className="text-text-secondary text-xs">
                Please enter log in details below
              </p>
            </div>

            <form className="flex flex-col gap-4" action="">
              <ThemedInput
                label="Email Address"
                type="email"
                id="email"
                autoComplete="email"
                icon={<EnvelopeIcon className="text-accent size-4" />}
              />
              <ThemedInput
                label="Password"
                type="password"
                id="password"
                icon={<LockClosedIcon className="text-accent size-4" />}
              />

              <Link
                to="/forgot"
                className="text-accent hover:text-accent-hover self-end text-xs font-medium underline"
              >
                Forgot Password?
              </Link>
              <ThemedButton type="submit" value="Sign in" />
            </form>

            <p className="text-text-secondary text-center">or</p>
            <button
              type="button"
              className="group flex items-center justify-center gap-2 rounded-md border border-gray-300 p-2 transition-colors hover:bg-gray-100"
            >
              <img
                src="/assets/icons/google.png"
                alt="Google icon"
                className="size-5"
              />
              <span className="text-text-secondary group-hover:text-accent-hover text-xs">
                Sign in with Google
              </span>
            </button>

            <div className="flex justify-center gap-1 text-xs">
              <p>Ready to vent?</p>
              <Link
                to="/register"
                className="text-accent hover:text-accent-hover self-end text-xs font-medium underline"
              >
                Create an Account
              </Link>
            </div>
          </div>
        </div>
      </FadeSlideIn>
    </main>
  );
};

export default Login;
