import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { EnrollmentWizard } from "./EnrollmentWizard";
import type { EnrollmentWizardProps } from "@/types/pages";

const meta: Meta<typeof EnrollmentWizard> = {
  title: "Compositions/EnrollmentWizard",
  component: EnrollmentWizard,
};
export default meta;
type Story = StoryObj<typeof EnrollmentWizard>;

const fleetGroups = [
  { id: "default", name: "default", nodeCount: 3 },
  { id: "europe", name: "europe", nodeCount: 12 },
  { id: "us-east", name: "us-east", nodeCount: 6 },
];

const panelUrl = "https://panel.example.com";

function InteractiveWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nodeName, setNodeName] = useState("");
  const [fleetGroup, setFleetGroup] = useState("default");
  const [ttl, setTtl] = useState(3600);
  const [advOpts, setAdvOpts] = useState({ telemtUrl: "http://127.0.0.1:9091", telemtAuth: "" });

  const token = "enr_a7f3b2c8d9e0f123";
  const installCmd = `curl -fsSL https://github.com/panvex/panvex/releases/latest/download/install-agent.sh | \\
  sudo sh -s -- \\
    --panel-url ${panelUrl} \\
    --enrollment-token ${token} \\
    --node-name ${nodeName || "my-node"}`;

  const props: EnrollmentWizardProps = {
    step,
    fleetGroups,
    nodeName,
    selectedFleetGroup: fleetGroup,
    tokenTtl: ttl,
    onNodeNameChange: setNodeName,
    onFleetGroupChange: setFleetGroup,
    onTokenTtlChange: setTtl,
    onGenerateToken: () => setStep(2),
    installCommand: installCmd,
    tokenValue: token,
    tokenExpiresInSecs: 3240,
    advancedOptions: advOpts,
    onAdvancedOptionsChange: setAdvOpts,
    onInstallConfirm: () => setStep(3),
    onBack: () => setStep((s) => Math.max(1, s - 1) as 1 | 2 | 3),
    connectionStatus: { bootstrap: "done", grpcConnect: "waiting", firstData: "pending" },
    onViewDetails: () => alert("Navigate to server detail"),
    onCancel: () => setStep(1),
  };

  return (
    <div className="max-w-[480px] mx-auto p-6 bg-bg rounded-xs border border-border">
      <EnrollmentWizard {...props} />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveWizard />,
};

export const Step1Configure: Story = {
  args: {
    step: 1,
    fleetGroups,
    nodeName: "",
    selectedFleetGroup: "default",
    tokenTtl: 3600,
    onNodeNameChange: () => {},
    onFleetGroupChange: () => {},
    onTokenTtlChange: () => {},
    onGenerateToken: () => {},
    installCommand: "",
    tokenValue: "",
    tokenExpiresInSecs: 0,
    onInstallConfirm: () => {},
    onBack: () => {},
    connectionStatus: { bootstrap: "pending", grpcConnect: "pending", firstData: "pending" },
    onViewDetails: () => {},
    onCancel: () => {},
  },
};

export const Step2Install: Story = {
  args: {
    step: 2,
    fleetGroups,
    nodeName: "prod-eu-west-1",
    selectedFleetGroup: "europe",
    tokenTtl: 3600,
    onNodeNameChange: () => {},
    onFleetGroupChange: () => {},
    onTokenTtlChange: () => {},
    onGenerateToken: () => {},
    installCommand: `curl -fsSL https://github.com/panvex/panvex/releases/latest/download/install-agent.sh | \\
  sudo sh -s -- \\
    --panel-url ${panelUrl} \\
    --enrollment-token enr_a7f3b2c8d9e0f123 \\
    --node-name prod-eu-west-1`,
    tokenValue: "enr_a7f3b2c8d9e0f123",
    tokenExpiresInSecs: 3240,
    advancedOptions: { telemtUrl: "http://127.0.0.1:9091", telemtAuth: "" },
    onAdvancedOptionsChange: () => {},
    onInstallConfirm: () => {},
    onBack: () => {},
    connectionStatus: { bootstrap: "pending", grpcConnect: "pending", firstData: "pending" },
    onViewDetails: () => {},
    onCancel: () => {},
  },
};

export const Step3Waiting: Story = {
  args: {
    step: 3,
    fleetGroups,
    nodeName: "prod-eu-west-1",
    selectedFleetGroup: "europe",
    tokenTtl: 3600,
    onNodeNameChange: () => {},
    onFleetGroupChange: () => {},
    onTokenTtlChange: () => {},
    onGenerateToken: () => {},
    installCommand: "",
    tokenValue: "enr_a7f3b2c8d9e0f123",
    tokenExpiresInSecs: 2100,
    onInstallConfirm: () => {},
    onBack: () => {},
    connectionStatus: { bootstrap: "done", grpcConnect: "waiting", firstData: "pending" },
    onViewDetails: () => {},
    onCancel: () => {},
  },
};

export const Step3Connected: Story = {
  args: {
    step: 3,
    fleetGroups,
    nodeName: "prod-eu-west-1",
    selectedFleetGroup: "europe",
    tokenTtl: 3600,
    onNodeNameChange: () => {},
    onFleetGroupChange: () => {},
    onTokenTtlChange: () => {},
    onGenerateToken: () => {},
    installCommand: "",
    tokenValue: "enr_a7f3b2c8d9e0f123",
    tokenExpiresInSecs: 1800,
    onInstallConfirm: () => {},
    onBack: () => {},
    connectionStatus: { bootstrap: "done", grpcConnect: "done", firstData: "done" },
    connectedAgent: { id: "agent-7", version: "v1.2.3", fleetGroup: "europe", certExpiresAt: "May 3, 2026" },
    onViewDetails: () => {},
    onCancel: () => {},
  },
};
