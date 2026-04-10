import type { Meta, StoryObj } from "@storybook/react";
import type { ServerDetailPageProps } from "@/types/pages";
import { ServerActionsDropdown } from "./ServerActionsDropdown";
import { DcTable } from "./DcTable";
import { ConnectionsTab } from "./tabs/ConnectionsTab";
import { MePoolTab } from "./tabs/MePoolTab";
import { UpstreamsTab } from "./tabs/UpstreamsTab";
import { DiagnosticsTab } from "./tabs/DiagnosticsTab";
import { EventsTab } from "./tabs/EventsTab";

// ─── Shared mock ────────────────────────────────────────────────────────────

const now = Math.floor(Date.now() / 1000);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- story mock data, partial types are fine
const mockServer: any = {
  id: "srv-eu-fra-01",
  name: "node-eu-fra-01",
  ip: "192.168.1.1",
  status: "ok",

  systemInfo: {
    version: "v3.2.1",
    targetArch: "x86_64",
    targetOs: "linux",
    buildProfile: "release",
    gitCommit: "abc1234f8e9b",
    buildTimeUtc: "2026-03-15 14:23 UTC",
    uptimeSeconds: 14 * 86400 + 7 * 3600,
    configHash: "abc1234f",
    configPath: "/etc/telemt/config.toml",
    configReloadCount: 3,
    lastConfigReloadEpochSecs: now - 7200,
  },

  gates: {
    acceptingNewConnections: true,
    meRuntimeReady: true,
    useMiddleProxy: true,
    me2dcFallbackEnabled: true,
    rerouteActive: false,
    startupStatus: "ready",
    startupProgressPct: 100,
    degraded: false,
    readOnly: false,
  },

  dcs: Array.from({ length: 5 }, (_, i) => {
    const dc = i + 1;
    const isBad = i === 2;
    return {
      dc,
      endpoints: [`91.108.${dc}.1:8888`, `91.108.${dc}.2:8888`],
      endpointWriters: [
        { endpoint: `91.108.${dc}.1:8888`, activeWriters: isBad ? 0 : 2 },
        { endpoint: `91.108.${dc}.2:8888`, activeWriters: isBad ? 1 : 2 },
      ],
      aliveWriters: isBad ? 1 : 4,
      requiredWriters: 4,
      availableEndpoints: isBad ? 1 : 2,
      availablePct: isBad ? 50 : 100,
      coveragePct: isBad ? 25 : 100,
      freshAlivePct: isBad ? 25 : 100,
      rttMs: 20 + dc * 15,
      load: dc * 12,
      floorMin: 2,
      floorTarget: 4,
      floorMax: 8,
      floorCapped: false,
    };
  }),

  connections: {
    current: 12500,
    currentMe: 9800,
    currentDirect: 2700,
    activeUsers: 340,
    staleCacheUsed: false,
    topByConnections: [
      { username: "premium", connections: 4200, octets: 5e9 },
      { username: "free-tier", connections: 3100, octets: 2e9 },
    ],
    topByThroughput: [
      { username: "premium", connections: 4200, octets: 5e9 },
      { username: "enterprise", connections: 800, octets: 4e9 },
    ],
  },

  summary: {
    connectionsTotal: 980000,
    connectionsBadTotal: 1200,
    handshakeTimeoutsTotal: 85,
    configuredUsers: 12,
  },

  mePool: {
    enabled: true,
    summary: {
      aliveWriters: 48,
      availableEndpoints: 24,
      availablePct: 100,
      configuredDcGroups: 5,
      configuredEndpoints: 24,
      coveragePct: 100,
      freshAliveWriters: 46,
      freshCoveragePct: 96,
      requiredWriters: 48,
    },
    generations: { active: 3, warm: 1, pendingHardswap: 0, drainingGenerations: [] },
    hardswap: { enabled: true, pending: false },
    contour: { active: 5, warm: 2, draining: 0 },
    writersHealth: { healthy: 46, degraded: 2, draining: 0 },
    refill: { inflightEndpoints: 0, inflightDcs: 0, byDc: [] },
    writersList: [
      {
        writerId: 1,
        dc: 1,
        endpoint: "91.108.1.1:8888",
        state: "active",
        degraded: false,
        draining: false,
        rttEmaMs: 12.3,
        boundClients: 45,
        idleForSecs: undefined,
      },
      {
        writerId: 2,
        dc: 1,
        endpoint: "91.108.1.2:8888",
        state: "active",
        degraded: true,
        draining: false,
        rttEmaMs: 85.1,
        boundClients: 12,
        idleForSecs: 5,
      },
      {
        writerId: 3,
        dc: 2,
        endpoint: "91.108.2.1:8888",
        state: "active",
        degraded: false,
        draining: false,
        rttEmaMs: 22.0,
        boundClients: 38,
        idleForSecs: undefined,
      },
    ],
  },

  upstreams: [
    {
      upstreamId: 0,
      routeKind: "direct",
      address: "0.0.0.0:443",
      weight: 1,
      dc: 1,
      healthy: true,
      fails: 0,
      effectiveLatencyMs: 0,
      lastCheckAgeSecs: 5,
    },
    {
      upstreamId: 1,
      routeKind: "direct",
      address: "0.0.0.0:8443",
      weight: 1,
      dc: 1,
      healthy: true,
      fails: 0,
      effectiveLatencyMs: 1,
      lastCheckAgeSecs: 3,
    },
    {
      upstreamId: 2,
      routeKind: "socks5",
      address: "proxy.example.com:1080",
      weight: 1,
      dc: 2,
      healthy: false,
      fails: 3,
      effectiveLatencyMs: 450,
      lastCheckAgeSecs: 120,
    },
  ],
  upstreamSummary: {
    configuredTotal: 3,
    healthyTotal: 2,
    unhealthyTotal: 1,
    directTotal: 2,
    socks5Total: 1,
    socks4Total: 0,
    shadowsocksTotal: 0,
  },
  upstreamZeroCounters: {
    connectAttemptTotal: 50000,
    connectSuccessTotal: 49500,
    connectFailTotal: 500,
    connectFailfastHardErrorTotal: 12,
    connectDurationSuccessBucketLe100ms: 40000,
    connectDurationSuccessBucket101_500ms: 8000,
    connectDurationSuccessBucket501_1000ms: 1200,
    connectDurationSuccessBucketGt1000ms: 300,
    connectDurationFailBucketLe100ms: 100,
    connectDurationFailBucket101_500ms: 200,
    connectDurationFailBucket501_1000ms: 150,
    connectDurationFailBucketGt1000ms: 50,
    connectAttemptsBucket1: 45000,
    connectAttemptsBucket2: 4000,
    connectAttemptsBucket3_4: 800,
    connectAttemptsBucketGt4: 200,
  },

  selftest: {
    enabled: true,
    kdf: { state: "ok", ewmaErrorsPerMin: 0.01, thresholdErrorsPerMin: 1.0, errorsTotal: 0 },
    timeskew: {
      state: "ok",
      maxSkewSecs15m: 0.3,
      samples15m: 15,
      lastSkewSecs: 0.1,
      lastSource: "NTP",
    },
    ip: {
      v4: { state: "ok", addr: "185.76.10.42" },
      v6: { state: "ok", addr: "2a0d:8480:1::42" },
    },
    pid: { state: "one", pid: 1234 },
    bnd: { addrState: "ok", lastAddr: "0.0.0.0:443" },
  },

  meQuality: {
    enabled: true,
    counters: {
      kdfDriftTotal: 0,
      kdfPortOnlyDriftTotal: 0,
      routeDropNoConn: 2,
      routeDropChannelClosed: 0,
      routeDropQueueFull: 0,
      reconnectAttemptTotal: 15,
      reconnectSuccessTotal: 14,
    },
    dcRtt: [],
  },

  natStun: {
    enabled: true,
    natProbeEnabled: true,
    liveStunTotal: 3,
    configuredStunTotal: 4,
    reflectionV4: { addr: "185.76.10.42", ageSecs: 120 },
    reflectionV6: { addr: "2a0d:8480:1::42", ageSecs: 180 },
    configuredServers: [
      "stun.l.google.com:19302",
      "stun1.l.google.com:19302",
      "stun2.l.google.com:19302",
    ],
  },

  events: [
    {
      seq: 1,
      tsEpochSecs: now - 60,
      eventType: "config_reload",
      context: "Config reloaded successfully",
    },
    {
      seq: 2,
      tsEpochSecs: now - 300,
      eventType: "writer_degraded",
      context: "Writer 2 DC1 high RTT",
    },
    {
      seq: 3,
      tsEpochSecs: now - 900,
      eventType: "upstream_fail",
      context: "proxy.example.com:1080 health check failed",
    },
    { seq: 4, tsEpochSecs: now - 3600, eventType: "startup", context: "Server started v3.2.1" },
  ],
  eventsDroppedTotal: 0,

  networkPath: Array.from({ length: 5 }, (_, i) => ({
    dc: i + 1,
    ipPreference: "v4",
    selectedAddrV4: `91.108.${i + 1}.1`,
    selectedAddrV6: i < 3 ? `2a0d:8480:${i + 1}::1` : undefined,
  })),
};

// ─── Actions Dropdown ───────────────────────────────────────────────────────

const actionsMeta: Meta<typeof ServerActionsDropdown> = {
  title: "Pages/ServerDetail/ActionsDropdown",
  component: ServerActionsDropdown,
  parameters: { layout: "centered" },
};
export default actionsMeta;

type ActionsStory = StoryObj<typeof ServerActionsDropdown>;

export const Dropdown: ActionsStory = {
  args: {
    onReload: () => console.log("reload"),
    onBoostDetail: () => console.log("boost"),
    onRename: () => console.log("rename"),
    onDeregister: () => console.log("deregister"),
  },
};

// ─── DcTable ────────────────────────────────────────────────────────────────

export const DataCenterTable: StoryObj<typeof DcTable> = {
  render: (args) => (
    <div className="max-w-4xl">
      <DcTable {...args} />
    </div>
  ),
  args: {
    dcs: mockServer.dcs,
  },
};

// ─── Tabs ───────────────────────────────────────────────────────────────────

export const Connections: StoryObj<typeof ConnectionsTab> = {
  render: (args) => (
    <div className="max-w-3xl">
      <ConnectionsTab {...args} />
    </div>
  ),
  args: {
    server: mockServer,
  },
};

export const MePool: StoryObj<typeof MePoolTab> = {
  render: (args) => (
    <div className="max-w-4xl">
      <MePoolTab {...args} />
    </div>
  ),
  args: {
    server: mockServer,
  },
};

export const Upstreams: StoryObj<typeof UpstreamsTab> = {
  render: (args) => (
    <div className="max-w-4xl">
      <UpstreamsTab {...args} />
    </div>
  ),
  args: {
    server: mockServer,
  },
};

export const Diagnostics: StoryObj<typeof DiagnosticsTab> = {
  render: (args) => (
    <div className="max-w-3xl">
      <DiagnosticsTab {...args} />
    </div>
  ),
  args: {
    server: mockServer,
  },
};

export const Events: StoryObj<typeof EventsTab> = {
  render: (args) => (
    <div className="max-w-3xl">
      <EventsTab {...args} />
    </div>
  ),
  args: {
    server: mockServer,
  },
};
