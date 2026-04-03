import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { LoginPage } from "./LoginPage";
import type { LoginPageProps } from "@/types/pages";

const meta = {
  title: "Pages/LoginPage",
  component: LoginPage,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Interactive wrapper (simulates parent auth state machine) ────────────────

function InteractiveLogin(props: Partial<LoginPageProps>) {
  const [stage, setStage] = useState<"credentials" | "totp">("credentials");
  const [error, setError] = useState<string | undefined>(props.error);
  const [loading, setLoading] = useState(false);

  async function handleCredentials(username: string, password: string) {
    setLoading(true);
    setError(undefined);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    // Simulate: server requires TOTP (in real app this comes from API response)
    if (username === "admin" && password === "secret") {
      setStage("totp");
    } else if (username && password) {
      // No TOTP required — login succeeds
      console.log("Login success:", { username, password });
      alert("Logged in (no 2FA required)!");
    } else {
      setError("Invalid credentials");
    }
  }

  async function handleTotp(totpCode: string) {
    setLoading(true);
    setError(undefined);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    if (totpCode === "123456") {
      console.log("TOTP verified:", totpCode);
      alert("Logged in with 2FA!");
    } else {
      setError("Invalid 2FA code");
    }
  }

  function handleBack() {
    setStage("credentials");
    setError(undefined);
  }

  return (
    <LoginPage
      stage={stage}
      error={error}
      loading={loading}
      onCredentials={handleCredentials}
      onTotp={handleTotp}
      onBack={handleBack}
      {...props}
    />
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Interactive two-stage flow.
 * - Enter any username + any password → logs in (no 2FA)
 * - Enter username=admin + password=secret → proceeds to TOTP stage
 * - On TOTP stage: enter 123456 → logs in; anything else → error
 */
export const Default: Story = {
  render: () => <InteractiveLogin />,
  args: {} as LoginPageProps,
};

/** Stage 1 with an error shown */
export const CredentialsError: Story = {
  args: {
    stage: "credentials",
    error: "Invalid username or password",
    onCredentials: async () => {},
    onTotp: async () => {},
    onBack: () => {},
  },
};

/** Stage 2 — TOTP input */
export const TotpStage: Story = {
  args: {
    stage: "totp",
    onCredentials: async () => {},
    onTotp: async () => {},
    onBack: () => {},
  },
};

/** Stage 2 with wrong-code error */
export const TotpError: Story = {
  args: {
    stage: "totp",
    error: "Invalid 2FA code. Please try again.",
    onCredentials: async () => {},
    onTotp: async () => {},
    onBack: () => {},
  },
};

/** Loading state on stage 1 */
export const CredentialsLoading: Story = {
  args: {
    stage: "credentials",
    loading: true,
    onCredentials: async () => {},
    onTotp: async () => {},
    onBack: () => {},
  },
};

/** Loading state on stage 2 */
export const TotpLoading: Story = {
  args: {
    stage: "totp",
    loading: true,
    onCredentials: async () => {},
    onTotp: async () => {},
    onBack: () => {},
  },
};
