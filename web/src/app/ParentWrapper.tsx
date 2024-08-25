"use client";
import SnackbarProvider from "@/context/snackbar.context";
import React from "react";

export default function ParentProvider({
    children
}: {
    children: React.ReactNode
}) {
  return (
    <SnackbarProvider>
      {children}
    </SnackbarProvider>
  )
}