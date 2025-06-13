const Login = () => {
  return (
    <main className="bg-peach-tint-300 font-quicksand flex h-screen items-center justify-center text-sm">
      <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-lg shadow-2xl md:h-auto md:flex-row">
        <div className="md:bg-peach-tint-500 bg-peach-tint-300 flex flex-1 items-center justify-center p-8 text-center">
          <div className="bg-peach-tint-400 flex h-full max-h-44 flex-col items-center justify-center rounded-md p-8 px-4 py-8 shadow-lg">
            <div className="mb-4 text-xl font-semibold">Life, Unfiltered.</div>
            <p>
              Life isn’t always easy, but it always teaches. Every struggle has
              something to say if you’re willing to listen.
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center gap-4 rounded-t-3xl bg-white p-8 md:rounded-none">
          <div>
            <p className="text-base">Welcome Back, Time to vent again?</p>
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
            <a className="self-end underline" href="">
              Forgot Password?
            </a>
            <input
              className="bg-accent cursor-pointer p-2 text-white"
              type="submit"
              value="Sign in"
            />
          </form>
          <p className="text-center">or</p>
          <p className="text-center">Sign in with Google</p>
          <div className="flex justify-center gap-2">
            <p>Ready to vent?</p>
            <a className="underline" href="">
              Create an Account
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Login;
