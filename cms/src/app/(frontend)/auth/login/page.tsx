import { LoginForm } from "../components/login-form";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default async function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img src="/assets/vds-logo.png" className="w-40"></img>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:flex justify-center items-center">
        <DotLottieReact
          src="https://lottie.host/4100b133-091a-426f-8b15-aba293707841/P2uvLFOGbk.lottie"
          loop
          autoplay
          className="w-full h-full max-w-xl max-h-200"
        />
      </div>
    </div>
  )
}
