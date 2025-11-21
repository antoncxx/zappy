"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { Schema } from "./schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await signIn("credentials", {
            redirect: false,
            email: values.email,
            password: values.password,
          });
          if (!res?.error) router.push("/");
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-3">
            <Field
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
            <Field
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border p-2 rounded"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Sign In
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-4 text-sm">
        Don't have an account?{" "}
        <a href="/auth/signup" className="text-blue-600 hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
}
