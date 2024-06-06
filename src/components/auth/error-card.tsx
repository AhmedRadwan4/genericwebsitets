import { Card, CardFooter, CardHeader } from "../ui/card";
import { BackButton } from "./back-button";

export const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="w-full flex flex-col gap-y-4 items-center justify-center">
        Oops! Something went wrong
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to Login" href="/auth/login" />
      </CardFooter>
    </Card>
  );
};
