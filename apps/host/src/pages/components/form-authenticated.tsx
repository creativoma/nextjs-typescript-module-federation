import * as React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FormAuthenticated = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <Card className="max-w-[100%] m-auto lg:max-w-[450px]">
      <CardHeader>
        <CardTitle className="mb-3">Welcome {session?.user?.name}</CardTitle>
        <CardDescription>
          You are now signed in. You can go to the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          type="button"
          className="w-full "
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </Button>
      </CardContent>
      <CardContent>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or Sign Out
            </span>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <Button
          type="button"
          className="w-full "
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Sign Out
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

export default FormAuthenticated;
