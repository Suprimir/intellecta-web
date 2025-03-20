// working on the validations - Luis MPP

"use client";

import { LogIn } from "@/app/actions/auth";

export default function RegisterPage() {
  const handleSubmit = (formData: FormData) => {
    LogIn(formData);
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form action={handleSubmit} className="w-1/4">
        <h1 className="font-bold text-slate-300 text-4xl mb-4 text-center">
          Log In
        </h1>
        <div>
          <label htmlFor="username" className="text-white mb-2 text-sm ">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            className="p-3 mb-2 rounded bg-slate-900 text-slate-300 w-full"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-white mb-2 text-sm ">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="p-3 mb-2 rounded bg-slate-900 text-slate-300 w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-3 my-4 w-full rounded-lg font-bold"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
