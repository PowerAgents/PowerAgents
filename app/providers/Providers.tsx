"use client";

import { CrossmintProvider, CrossmintAuthProvider } from "@crossmint/client-sdk-react-ui";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CrossmintProvider apiKey="sk_production_34C3coDFWMABQDGPVVnvb18Xx6uKe3coMpd2LzCD1MhzYE9rUAvjhvwN1V4yryGNBETLFGZLNCAg7G8MtpRUTkC2xmMJny2hKnC3wFBBzuxPD4dxtUrzvbx3EJCp4QYwk21PFGou7tiqHA34m9NzMzWb4eDbsTzFXqYpkySFVBrbrPTziy5Y9fCQrSN6uJydGsaMhDHrkdW7E2MDGKCYv1x">
      <CrossmintAuthProvider
        loginMethods={["email", "google", "farcaster"]} // Only show email, Google, and Farcaster login methods
      >
        {children}
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
