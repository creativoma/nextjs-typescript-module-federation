import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TbLogout } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const DashboardLayout = ({
  title,
  children,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  if (sessionStatus === "unauthenticated") {
    router.push("/");
    return null;
  }

  const name = session?.user?.name;
  const nameInitials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
    : "";

  if (sessionStatus === "authenticated") {
    return (
      <motion.main
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-[100vh] max-w-[1440px] m-auto lg:flex"
      >
        <aside className="min-w-[300px] p-4 flex flex-col gap-4 lg:sticky top-4 h-fit">
          <div className="flex items-center gap-2">
            <Avatar className="w-16 h-16">
              <AvatarImage src={session?.user?.image || ""} alt="Avatar" />
              <AvatarFallback>{nameInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>{session?.user?.name}</p>
              <small>{session?.user?.email}</small>
            </div>
          </div>
          <Separator />
          <Button variant="outline" onClick={() => router.push("/")}>
            Home
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/website-analytics")}
          >
            Website Analytics
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/clients")}
          >
            Clients
          </Button>
          <Separator />
          <Button onClick={() => signOut()}>
            Sign out <TbLogout className="ml-2" />
          </Button>
        </aside>
        <section className="px-4 pb-4 pt-6 w-full">
          <h1 className="text-3xl font-bold">{title}</h1>
          <Separator className="my-4" />
          {children}
          <Separator className="mt-6 mb-4" />
          <small className="text-gray-500 dark:text-gray-400 pb-10">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
            voluptatibus, quibusdam, voluptatum, doloribus magni voluptas
            consequatur natus quod quos dolorum doloremque ipsa. Quisquam
            voluptate, quae quas voluptatibus autem quos.
          </small>
        </section>
      </motion.main>
    );
  }
};

export default DashboardLayout;
