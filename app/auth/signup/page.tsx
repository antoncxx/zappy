"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Schema } from "./schema";

export default function SignUpPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

      <Formik
        initialValues={{ email: "", password: "", confirmPassword: "" }}
        validationSchema={Schema}
        onSubmit={async (values, { setSubmitting, setFieldError }) => {
          if (values.password !== values.confirmPassword) {
            return setFieldError("password", "Passwords do not match");
          }

          try {
            const res = await fetch("/api/auth/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: values.email,
                password: values.password,
              }),
            });

            const data = await res.json();

            if (!res.ok) {
              setFieldError("email", data.message || "Signup failed");
            } else {
              router.push("/auth/signin");
            }
          } catch (err) {
            console.error(err);
            setFieldError("email", "Internal server error");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-3">
            <div>
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
            </div>

            <div>
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
            </div>

            <div>
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border p-2 rounded"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Sign Up
            </button>
          </Form>
        )}
      </Formik>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <a href="/auth/signin" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}
