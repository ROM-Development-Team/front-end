import ThemedButton from "../../../components/ThemedButton.tsx";
import ThemedInput from "../../../components/ThemedInput.tsx";
import FadeSlideIn from "../../../components/FadeSlideIn.tsx";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const Forgot = () => {
  return (
    <main className="bg-background font-quicksand text-text-primary flex min-h-screen items-center justify-center overflow-auto text-sm">
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

          <div className="flex flex-1 flex-col gap-4 bg-white p-8">
            <img
              className="h-20 self-center"
              src="/assets/images/rom-logo.png"
              alt="Rant on me logo"
            />
            <div>
              <p className="text-sm font-semibold">Forgot Password</p>
              <p className="text-text-secondary text-xs">
                Enter your email and we'll help you get back to venting
              </p>
            </div>
            <form className="flex flex-col gap-4" action="">
              <ThemedInput
                label="Email Address"
                type="email"
                id="email"
                autoComplete="email"
                icon={<EnvelopeIcon className="text-accent h-5 w-5" />}
              />
              <ThemedButton type="submit" value="Send Email" />
            </form>
            <div className="flex justify-center gap-1 text-xs">
              <p className="text-text-secondary">Ready to vent?</p>
              <Link
                to="/register"
                className="text-accent hover:text-accent-hover font-medium underline"
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

export default Forgot;
