import React from "react";
import Link from "next/link";
import Image from "next/image";
import imgLogo from "@/assets/images/logo.png";
import FormSignIn from "./components/form-sign-in";
import FormAuthenticated from "./components/form-authenticated";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const { data: session } = useSession();

  return (
    <motion.main
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-col-1 lg:grid-cols-2 gap-4 lg:gap-10 min-h-[100vh] max-w-[1440px] m-auto overflow-hidden"
    >
      <section className="px-10 pt-10 pb-4 lg:p-10 flex justify-center flex-col">
        <Link href="/">
          <Image
            src={imgLogo}
            width={80}
            height={80}
            alt="Logo"
            className="mb-6 transition ease-in-out duration-300 hover:transform hover:scale-105 cursor-pointer"
            quality={100}
          />
        </Link>
        <h1 className="text-4xl font-bold">
          Technical Test for React.js Developer
        </h1>
        <h2 className="text-2xl font-bold mt-2 mb-10">
          Using Next.js + Typescript + TailwindCSS
        </h2>
        <p className="mb-2">
          This project is a technical test for a React Developer position. It is
          a dashboard application built with Next.js and TailwindCSS.
        </p>
        <p className="mb-10">
          The application is a micro-frontend architecture with Module
          Federation. The application is a dashboard that displays data from a
          mock API. The dashboard is a dynamic dashboard with charts and graphs.
        </p>
        <p>
          By{" "}
          <Link
            href="https://github.com/creativoma"
            className="underline"
            target="_blank"
          >
            Mariano Álvarez
          </Link>
        </p>
      </section>
      <section className="px-10 pt-10 pb-4 lg:p-10 flex justify-center flex-col bg-slate-200 dark:bg-slate-900">
        {session ? <FormAuthenticated /> : <FormSignIn csrfToken="i8t$_e118" />}
      </section>
    </motion.main>
  );
};

export default Home;
