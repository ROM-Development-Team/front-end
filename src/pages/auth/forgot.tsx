import { EnvelopeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <main className="bg-peach-tint-300 font-quicksand flex h-screen items-center justify-center text-sm">
      <div className="mx-auto flex w-full max-w-4xl overflow-hidden rounded-lg shadow-2xl">
        <div className="bg-peach-tint-500 flex flex-1 items-center justify-center p-8 text-center">
          <div className="bg-peach-tint-400 rounded-md px-4 py-8 shadow-lg">
            <div className="mb-4 text-xl font-semibold">Life, Unfiltered.</div>
            <p>
              Life isn’t always easy, but it always teaches. Every struggle has
              something to say if you’re willing to listen.
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
            <p>Forgot Password</p>
            <p>Enter your email and we'll help you get back to venting</p>
          </div>
          <form className="flex flex-col gap-4" action="">
            <label htmlFor="">
              <div className="flex items-center gap-2 rounded-sm border-1 border-gray-300 p-1">
                <div className="ml-2">
                  <EnvelopeIcon className="text-accent size-5"></EnvelopeIcon>
                </div>

                <div className="flex w-full flex-col">
                  <label className="mb-1 text-sm font-medium text-black">
                    Email Address
                  </label>
                  <input
                    className="w-full border-none bg-white text-sm font-semibold text-black focus:outline-none"
                    type="text"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </label>
            <input
              className="bg-accent cursor-pointer p-2 text-white"
              type="submit"
              value="Send Email"
            />
          </form>

          <div className="flex justify-center gap-2">
            <p>Ready to vent?</p>
            <Link to="/register" className="underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Login;
