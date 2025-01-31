'use client'

import { Layout } from "@/components/layout";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ErrorBoundaryProps = {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error)
  }, [error])
  
  return (
    <Layout>
      <div>
        <h2 className="text-red-600">Algo deu errado!</h2>
        <p className="text-zinc-500">{error.message}</p>
        <Button
          onClick={() => router.refresh()}
          variant="text"
          color="success"
        >
          Resetar
        </Button>
      </div>
    </Layout>
  )
}