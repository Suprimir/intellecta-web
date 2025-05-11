// working on the validations - Luis MPP

"use client";

import { LogIn } from "@/actions/auth";

export default function RegisterPage() {
  const handleSubmit = (formData: FormData) => {
    LogIn(formData);
  };

  return (
    <div className="min-h-[calc(100vh-6.6vh)] bg-gradient-to-br from-[#FFBD00] to-[#ffeaaf] flex items-center justify-center">
      <form
        action={handleSubmit}
        className="w-full mx-4 md:w-1/3 bg-white rounded-2xl p-8"
      >
        <h1 className="font-bold text-slate-300 text-4xl mb-4 text-center">
          Log In
        </h1>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="text-black mb-2 text-xl font-extrabold ms-2 block"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="p-3 rounded bg-[#DFDCDC] text-slate-300 w-full"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="text-black mb-2 text-xl font-extrabold ms-2 block"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="p-3 rounded bg-[#DFDCDC] text-slate-300 w-full"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 cursor-pointer text-white p-3 my-4 w-full rounded-lg font-bold hover:bg-blue-600 transition-colors"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
