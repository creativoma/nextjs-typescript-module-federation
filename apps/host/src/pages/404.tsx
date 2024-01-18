import React from "react";
import Link from "next/link";
import Image from "next/image";
import imgLogo from "@/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import winterPhoto from "@/assets/images/winter-photo.webp";
import { useRouter } from "next/navigation";

const Error404: React.FC = () => {
  const router = useRouter();

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
            priority={false}
          />
        </Link>
        <h1 className="text-4xl font-bold">Error 404</h1>
        <h2 className="text-2xl font-bold mt-2 mb-10">
          Page not found or you don&apos;t have access.
        </h2>
        <p className="mb-10">
          lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
        </p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go to Home
        </Button>
      </section>
      <section className="flex justify-center flex-col bg-slate-200 dark:bg-slate-900 overflow-hidden">
        <Image
          src={winterPhoto.src}
          width={500}
          height={500}
          alt="Winter photo"
          className="object-cover aspect-w-9 aspect-h-16 h-[100vh] w-[100vw]"
          quality={100}
        />
      </section>
    </motion.main>
  );
};

export default Error404;
