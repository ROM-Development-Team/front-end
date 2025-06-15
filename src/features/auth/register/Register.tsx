import { Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import { useRegister } from "./hooks/useRegister.ts";
import FadeSlideIn from "../../../components/FadeSlideIn.tsx";

const Register = () => {
  const { formData, handleChange, handleSubmit, isLoading, error } =
    useRegister();
  return (
    <main className="bg-background font-quicksand text-text-primary flex min-h-screen items-center justify-center overflow-x-auto overflow-y-auto text-sm">
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
      </FadeSlideIn>
    </main>
  );
};

export default Register;
