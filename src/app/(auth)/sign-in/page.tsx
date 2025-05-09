import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { UserAuthForm } from "./_components/user-auth-form";

export default function SignIn() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-xl tracking-tight">Login</CardTitle>
        <CardDescription>
          Enter your email and password below to <br />
          log into your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <UserAuthForm />
      </CardContent>

      <CardFooter className="justify-center text-sm">
        Don&apos;t have an account?&nbsp;
        <Link
          href="/sign-up"
          className="hover:text-primary underline underline-offset-4"
        >
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
}
