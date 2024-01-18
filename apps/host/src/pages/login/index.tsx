import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getCsrfToken } from "next-auth/react";
import { signIn } from "next-auth/react";

const SignIn = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn("credentials", {
      email: event.currentTarget.name,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <form onSubmit={onSubmit}>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <input name="email" type="email" defaultValue="correo@example.com" />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
