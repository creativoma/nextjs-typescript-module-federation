import * as React from "react";
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";

const FormSignIn = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn("credentials", {
      email: event.currentTarget.email.value,
      callbackUrl: "/dashboard",
    });
  };

  const router = useRouter();
  const errorType = router.query.error as string | undefined;

  let error = "";
  if (errorType === "CredentialsSignin") {
    error =
      "The email don't is correct, try again with DEMO email: example@correo.com";
  }

  return (
    <Card className="max-w-[100%] m-auto lg:max-w-[450px]">
      <CardHeader>
        <CardTitle className="mb-3">Sign in</CardTitle>
        <CardDescription>
          Please use one of the two ways to log in and enter the dashboard
          panel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Your email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue="example@correo.com"
                required
              />
              {error && <small className="text-red-500 pb-2">{error}</small>}
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardContent>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <Button
          type="button"
          className="w-full flex gap-2"
          onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        >
          <FaGithub className="w-6 h-6" />
          Github
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CardDescription>
          By clicking continue, you agree to our Terms of Service and Privacy
          Policy.
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default FormSignIn;
export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
