import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundError() {
  return (
    <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
      <h1 className="text-[7rem] leading-tight font-bold">404</h1>
      <span className="font-medium">Oops! Page Not Found!</span>
      <p className="text-muted-foreground text-center">
        It seems like the page you're looking for <br />
        does not exist or might have been removed.
      </p>
      <div className="mt-6 flex gap-4">
        <Link href="/" className={buttonVariants()}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
