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
            <p>Welcome Back, Time to vent again?</p>
            <p>Please enter log in details below</p>
          </div>
          <form className="flex flex-col gap-4" action="">
            <label htmlFor="">
              <input
                className="w-full border bg-white p-2"
                type="text"
                placeholder="Email Address"
              />
            </label>
            <label htmlFor="">
              <input
                className="w-full border bg-white p-2"
                type="text"
                placeholder="Password"
              />
            </label>
            <Link to="/forgot" className="self-end underline">
              Forgot Password?
            </Link>
            <input
              className="bg-accent cursor-pointer p-2 text-white"
              type="submit"
            />
          </form>
          <p className="text-center">or</p>
          <p className="text-center">Sign in with Google</p>
          <div className="flex justify-center gap-2">
            <p>Ready to vent?</p>
            <Link to="/register">Create an Account</Link>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Login;
