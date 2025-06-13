import { LockClosedIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const Reset = () => {
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
            <p className="font-semibold">Enter your New Password </p>
            <p className="mt-1 text-xs text-gray-600">
              Please create a new password and confirm it below.
            </p>
          </div>
          <form className="flex flex-col gap-4" action="">
            <div className="flex flex-col gap-3">
              {/* New Password */}
              <label
                htmlFor="new-password"
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-gray-300 p-1"
              >
                <div className="ml-2 flex items-center">
                  <LockClosedIcon className="text-accent h-5 w-5" />
                </div>
                <div className="relative w-full">
                  <input
                    id="new-password"
                    type="text"
                    required
                    placeholder=" "
                    className="peer ml-1 w-full border-none bg-white pt-6 pb-1 text-sm font-semibold text-black placeholder-transparent focus:outline-none"
                  />
                  <span className="absolute top-1 left-1 text-xs text-black transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-black">
                    New Password
                  </span>
                </div>
              </label>

              {/* Confirm New Password */}
              <label
                htmlFor="confirm-password"
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-gray-300 p-1"
              >
                <div className="ml-2 flex items-center">
                  <LockClosedIcon className="text-accent h-5 w-5" />
                </div>
                <div className="relative w-full">
                  <input
                    id="confirm-password"
                    type="text"
                    required
                    placeholder=" "
                    className="peer ml-1 w-full border-none bg-white pt-6 pb-1 text-sm font-semibold text-black placeholder-transparent focus:outline-none"
                  />
                  <span className="absolute top-1 left-1 text-xs text-black transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-black">
                    Confirm New Password
                  </span>
                </div>
              </label>
            </div>
            {/* Button for Save New Password */}
            <input
              className="bg-accent cursor-pointer rounded p-2 text-white"
              type="submit"
              value="Save New Password"
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
export default Reset;
