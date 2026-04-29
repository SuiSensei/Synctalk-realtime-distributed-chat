import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <>
      <h1>Login Page</h1>
      <p>
        This is the login page. Please enter your credentials to access your
        account.
      </p>
      <Input placeholder="Username" />
      <Input placeholder="Password" type="password" />
      <Button>Login </Button>
    </>
  );
}
