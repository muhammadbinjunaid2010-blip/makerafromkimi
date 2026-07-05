import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";
import { LOGIN_PATH } from "@/const";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [message, setMessage] = useState("");

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: (data) => {
      setStatus("success");
      setMessage(data.message);
    },
    onError: (err) => {
      setStatus("error");
      setMessage(err.message);
    },
  });

  useEffect(() => {
    if (token) {
      verifyMutation.mutate({ token });
    } else {
      setStatus("error");
      setMessage("No verification token provided.");
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-md">
        <Card className="border shadow-sm">
          <CardContent className="text-center py-12">
            {status === "verifying" && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight mb-2">
                  Verifying your email
                </h2>
                <p className="text-sm text-muted-foreground">
                  Please wait while we verify your email address...
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold tracking-tight mb-2">
                  Email verified!
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {message}
                </p>
                <Button asChild>
                  <Link to={LOGIN_PATH}>Sign in</Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold tracking-tight mb-2">
                  Verification failed
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {message}
                </p>
                <div className="flex flex-col gap-2 items-center">
                  <Button asChild variant="outline">
                    <Link to="/">Go to home</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
