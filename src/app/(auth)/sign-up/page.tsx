import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { SignUpForm } from "./_components/sign-up-form";

export default function SignUp() {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="text-lg tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription>
          Enter your email and password to create an account. <br />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <SignUpForm />
      </CardContent>

      <CardFooter className="justify-center text-sm mt-2">
        Already have an account?&nbsp;
        <Link
          href="/sign-in"
          className="hover:text-primary underline underline-offset-4"
        >
          Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
