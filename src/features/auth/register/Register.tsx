import { Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister.ts";

const Register = () => {
  const { formData, handleChange, handleSubmit, isLoading, error } =
    useRegister();
  return (
    <main className="bg-peach-tint-300 font-quicksand flex h-screen items-center justify-center text-xs">
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
          <img
            className="h-20 self-center"
            src="/assets/images/rom-logo.png"
            alt="Rant on me logo"
          />
          <div>
            <p className="text-sm font-semibold">
              Hey There, Ready to Start Venting?
            </p>
            <p className="text-gray-600">
              Create your account and speak your mind
            </p>
          </div>
          <RegisterForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
          <div className="flex justify-center gap-1">
            <p>Been here before?</p>
            <Link to="/login" className="text-accent font-semibold underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Register;
