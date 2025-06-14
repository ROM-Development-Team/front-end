import { Link } from "react-router-dom";
import ThemedButton from "../../components/ThemedButton.tsx";
import ThemedInput from "../../components/ThemedInput.tsx";
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const Register = () => {
  return (
    <main className="bg-background font-quicksand text-text-primary flex min-h-screen items-center justify-center overflow-x-auto overflow-y-auto text-sm">
      <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-lg shadow-2xl md:h-auto md:flex-row">
        <div className="md:bg-surface flex flex-1 items-center justify-center bg-transparent p-8 text-center">
          <div className="bg-peach-200 flex h-full max-h-44 flex-col items-center justify-center rounded-md p-8 shadow-md">
            <div className="mb-4 text-xl font-semibold">Life, Unfiltered.</div>
            <p className="text-text-secondary">
              Life isn’t always easy, but it always teaches. Every struggle has
              something to say if you’re willing to listen.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4 rounded-t-3xl bg-white p-6 sm:p-8 md:rounded-none">
          <img
            className="h-16 self-center md:h-20"
            src="/assets/images/rom-logo.png"
            alt="Rant on me logo"
          />
          <div>
            <p className="text-sm font-semibold">
              Hey There, Ready to Start Venting?
            </p>
            <p className="text-text-secondary text-xs">
              Create your account and speak your mind
            </p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
              <ThemedInput
                className="w-full sm:flex-1"
                label="First Name"
                type="text"
                id="first-name"
              />
              <ThemedInput
                className="w-full sm:flex-1"
                label="Last Name"
                type="text"
                id="last-name"
              />
            </div>

            <ThemedInput
              label="Username"
              type="text"
              id="username"
              autoComplete="username"
              icon={<UserIcon className="text-accent size-4" />}
            />
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
            <ThemedInput
              label="Confirm Password"
              type="password"
              id="confirm-password"
              icon={<LockClosedIcon className="text-accent size-4" />}
            />
            <ThemedButton type="submit" value="Sign up" />
          </form>

          <div className="mt-2 flex justify-center gap-1 text-xs">
            <p className="text-text-secondary">Been here before?</p>
            <Link
              to="/login"
              className="text-accent hover:text-accent-hover font-medium underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
