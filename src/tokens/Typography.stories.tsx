import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta = {
  title: "Tokens/Typography",
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj;

export const AllTokens: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-lg">
      <div>
        <span className="text-caption mb-1 block">.text-title</span>
        <h3 className="text-title">Sheet or Wizard Title</h3>
      </div>
      <div>
        <span className="text-caption mb-1 block">.text-section</span>
        <h4 className="text-section">Section Heading</h4>
      </div>
      <div>
        <span className="text-caption mb-1 block">.text-label-upper</span>
        <span className="text-label-upper">Uppercase Label</span>
      </div>
      <div>
        <span className="text-caption mb-1 block">.text-label-compact</span>
        <span className="text-label-compact">Compact Label</span>
      </div>
      <div>
        <span className="text-caption mb-1 block">.text-caption</span>
        <p className="text-caption">Secondary description or hint text</p>
      </div>
      <div>
        <span className="text-caption mb-1 block">.text-muted</span>
        <p className="text-muted">Inline muted body text for secondary info</p>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="rounded-xs bg-bg-card border border-border p-5 max-w-md flex flex-col gap-4">
      <div>
        <h3 className="text-title">New Client</h3>
        <p className="text-muted mt-0.5">Configure a new Telemt client.</p>
      </div>
      <div>
        <span className="text-label-upper block mb-1.5">Client Name *</span>
        <div className="h-9 rounded-xs border border-border bg-bg" />
      </div>
      <div>
        <span className="text-label-upper block mb-1.5">Ad Tag</span>
        <div className="h-9 rounded-xs border border-border bg-bg" />
        <p className="text-caption mt-1">Promotional channel displayed to users</p>
      </div>
      <div>
        <span className="text-section">Limits</span>
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div>
            <span className="text-label-compact block mb-1">Max TCP</span>
            <div className="h-8 rounded-xs border border-border bg-bg" />
          </div>
          <div>
            <span className="text-label-compact block mb-1">Max IPs</span>
            <div className="h-8 rounded-xs border border-border bg-bg" />
          </div>
          <div>
            <span className="text-label-compact block mb-1">Quota</span>
            <div className="h-8 rounded-xs border border-border bg-bg" />
          </div>
        </div>
      </div>
    </div>
  ),
};
