import type { Meta, StoryObj } from "@storybook/react";
import { AppShell } from "@/layout/AppShell";
import { ServerDetailPage } from "./ServerDetailPage";
import { navItems } from "./__fixtures__/navItems";

const meta: Meta = {
  title: "Pages/NodeDetail",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const mockServer = {
  id: "srv-eu-fra-01",
  name: "node-eu-fra-01",
  ip: "192.168.1.1",
  status: "ok" as const,

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
    lastConfigReloadEpochSecs: Math.floor(Date.now() / 1000) - 7200,
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

  dcs: Array.from({ length: 12 }, (_, i) => {
    const dc = i + 1;
    const isBad = i === 2;
    // DC4 gets 10 endpoints like the real data screenshot
    const endpointCount = dc === 4 ? 10 : isBad ? 2 : 2;
    const endpoints =
      dc === 4
        ? [
            "91.108.4.131:8888",
            "91.108.4.169:8888",
            "91.108.4.174:8888",
            "91.108.4.177:8888",
            "91.108.4.186:8888",
            "91.108.4.187:8888",
            "91.108.4.188:8888",
            "91.108.4.195:8888",
            "91.108.4.207:8888",
            "91.108.4.224:8888",
          ]
        : [`149.154.16${i}.51:443`, `149.154.16${i}.91:443`];
    const endpointWriters =
      dc === 4
        ? [
            { endpoint: "91.108.4.131:8888", activeWriters: 1 },
            { endpoint: "91.108.4.169:8888", activeWriters: 0 },
            { endpoint: "91.108.4.174:8888", activeWriters: 2 },
            { endpoint: "91.108.4.177:8888", activeWriters: 2 },
            { endpoint: "91.108.4.186:8888", activeWriters: 0 },
            { endpoint: "91.108.4.187:8888", activeWriters: 0 },
            { endpoint: "91.108.4.188:8888", activeWriters: 0 },
            { endpoint: "91.108.4.195:8888", activeWriters: 0 },
            { endpoint: "91.108.4.207:8888", activeWriters: 3 },
            { endpoint: "91.108.4.224:8888", activeWriters: 2 },
          ]
        : [
            { endpoint: endpoints[0], activeWriters: isBad ? 1 : 2 },
            { endpoint: endpoints[1], activeWriters: 1 },
          ];
    return {
      dc,
      endpoints,
      endpointWriters,
      availableEndpoints: dc === 4 ? 5 : isBad ? 1 : 2,
      availablePct: dc === 4 ? 50 : isBad ? 75 : 100,
      requiredWriters: dc === 4 ? 10 : 3,
      aliveWriters: dc === 4 ? 10 : isBad ? 2 : 3,
      coveragePct: dc === 4 ? 100 : isBad ? 68 : 100,
      freshAlivePct: dc === 4 ? 100 : isBad ? 60 : 100,
      rttMs: dc === 4 ? 35.3 : isBad ? 89 : 12 + i * 3,
      load: dc === 4 ? 0 : isBad ? 95 : 150 + i * 20,
      floorMin: 1,
      floorTarget: dc === 4 ? 10 : 3,
      floorMax: dc === 4 ? 12 : 5,
      floorCapped: false,
    };
  }),

  connections: {
    current: 1180,
    currentMe: 780,
    currentDirect: 400,
    activeUsers: 940,
    staleCacheUsed: false,
    topByConnections: [
      { username: "alice", connections: 45, octets: 1_200_000_000 },
      { username: "bob", connections: 23, octets: 800_000_000 },
      { username: "charlie", connections: 18, octets: 500_000_000 },
    ],
    topByThroughput: [
      { username: "charlie", connections: 12, octets: 5_400_000_000 },
      { username: "alice", connections: 45, octets: 1_200_000_000 },
      { username: "dave", connections: 8, octets: 900_000_000 },
    ],
  },

  summary: {
    connectionsTotal: 1240,
    connectionsBadTotal: 12,
    handshakeTimeoutsTotal: 3,
    configuredUsers: 12,
  },

  mePool: {
    enabled: true,
    summary: {
      aliveWriters: 22,
      availableEndpoints: 23,
      availablePct: 96,
      configuredDcGroups: 12,
      configuredEndpoints: 24,
      coveragePct: 94,
      freshAliveWriters: 21,
      freshCoveragePct: 91,
      requiredWriters: 3,
    },
    generations: {
      active: 42,
      warm: 43,
      pendingHardswap: 0,
      drainingGenerations: [40, 41],
    },
    hardswap: { enabled: true, pending: false },
    contour: {
      active: 22,
      warm: 43,
      draining: 1,
    },
    writersHealth: {
      healthy: 21,
      degraded: 1,
      draining: 1,
    },
    refill: {
      inflightEndpoints: 2,
      inflightDcs: 1,
      byDc: [{ dc: 3, family: "V4", inflight: 1 }],
    },
    writersList: [
      {
        writerId: 1024,
        dc: 1,
        endpoint: "149.154.167.51:443",
        state: "active",
        draining: false,
        degraded: false,
        boundClients: 45,
        rttEmaMs: 12,
      },
      {
        writerId: 1025,
        dc: 3,
        endpoint: "149.154.175.50:443",
        state: "active",
        draining: false,
        degraded: true,
        boundClients: 0,
        idleForSecs: 120,
        rttEmaMs: 89,
      },
    ],
  },

  upstreams: [
    {
      upstreamId: 1,
      routeKind: "direct",
      address: "149.154.167.51:443",
      weight: 1,
      healthy: true,
      fails: 0,
      lastCheckAgeSecs: 5,
      effectiveLatencyMs: 12,
      dc: [{ dc: 1, latencyEmaMs: 12, ipPreference: "prefer_v4" }],
    },
    {
      upstreamId: 2,
      routeKind: "direct",
      address: "149.154.175.50:443",
      weight: 1,
      healthy: false,
      fails: 5,
      lastCheckAgeSecs: 2,
      effectiveLatencyMs: 0,
      dc: [],
    },
    {
      upstreamId: 3,
      routeKind: "socks5",
      address: "proxy.example.com:1080",
      weight: 1,
      healthy: true,
      fails: 1,
      lastCheckAgeSecs: 3,
      effectiveLatencyMs: 28,
      dc: [{ dc: 1, latencyEmaMs: 28, ipPreference: "prefer_v4" }],
    },
  ],

  upstreamSummary: {
    configuredTotal: 3,
    healthyTotal: 2,
    unhealthyTotal: 1,
    directTotal: 2,
    socks4Total: 0,
    socks5Total: 1,
    shadowsocksTotal: 0,
  },

  meQuality: {
    enabled: true,
    counters: {
      idleCloseByPeerTotal: 12246,
      readerEofTotal: 12246,
      kdfDriftTotal: 0,
      kdfPortOnlyDriftTotal: 0,
      routeDropNoConn: 5,
      routeDropChannelClosed: 2,
      routeDropQueueFull: 0,
      routeDropQueueFullBase: 0,
      routeDropQueueFullHigh: 0,
      reconnectAttemptTotal: 12,
      reconnectSuccessTotal: 11,
    },
    dcRtt: [
      { dc: 1, rttEmaMs: 12, aliveWriters: 3, requiredWriters: 3, coveragePct: 100 },
      { dc: 3, rttEmaMs: 89, aliveWriters: 2, requiredWriters: 3, coveragePct: 68 },
    ],
  },

  selftest: {
    enabled: true,
    kdf: {
      state: "ok",
      ewmaErrorsPerMin: 0.1,
      thresholdErrorsPerMin: 5,
      errorsTotal: 0,
    },
    timeskew: {
      state: "ok",
      maxSkewSecs15m: 0,
      samples15m: 9,
      lastSkewSecs: 0,
      lastSource: "proxy_secret_date_header",
    },
    ip: {
      v4: { addr: "185.23.145.12", state: "good" },
      v6: { addr: "fe80::1", state: "bogon" },
    },
    pid: { pid: 1, state: "one" },
    bnd: {
      addrState: "ok",
      portState: "ok",
      lastAddr: "149.154.167.51",
    },
  },

  natStun: {
    enabled: true,
    natProbeEnabled: true,
    natProbeDisabledRuntime: false,
    liveStunTotal: 2,
    configuredStunTotal: 3,
    configuredServers: [
      "stun.l.google.com:19302",
      "stun1.l.google.com:19302",
      "stun.cloudflare.com:3478",
    ],
    reflectionV4: { addr: "185.23.145.12", ageSecs: 120 },
  },

  events: [
    {
      seq: 1,
      tsEpochSecs: Math.floor(Date.now() / 1000) - 60,
      eventType: "config_reload",
      context: "Config v2.4.1 applied",
    },
    {
      seq: 2,
      tsEpochSecs: Math.floor(Date.now() / 1000) - 116,
      eventType: "writer_degraded",
      context: "DC3 / 149.154.175.50:443",
    },
    {
      seq: 3,
      tsEpochSecs: Math.floor(Date.now() / 1000) - 2100,
      eventType: "pool_hardswap",
      context: "gen 41→42, 24 writers",
    },
    {
      seq: 4,
      tsEpochSecs: Math.floor(Date.now() / 1000) - 7200,
      eventType: "startup_complete",
      context: "Server ready",
    },
  ],
  eventsDroppedTotal: 0,

  networkPath: [
    {
      dc: 1,
      ipPreference: "prefer_v4",
      selectedAddrV4: "149.154.175.50:443",
      selectedAddrV6: "[2001:b28:f23d:f001::a]:443",
    },
    {
      dc: 2,
      ipPreference: "prefer_v4",
      selectedAddrV4: "149.154.167.51:443",
      selectedAddrV6: "[2001:67c:4e8:f002::a]:443",
    },
    {
      dc: 3,
      ipPreference: "prefer_v4",
      selectedAddrV4: "149.154.175.100:443",
      selectedAddrV6: "[2001:b28:f23d:f003::a]:443",
    },
    {
      dc: 4,
      ipPreference: "prefer_v4",
      selectedAddrV4: "149.154.167.91:443",
      selectedAddrV6: "[2001:67c:4e8:f004::a]:443",
    },
    {
      dc: 5,
      ipPreference: "prefer_v4",
      selectedAddrV4: "149.154.171.5:443",
      selectedAddrV6: "[2001:b28:f23f:f005::a]:443",
    },
  ],

  upstreamZeroCounters: {
    connectAttemptTotal: 90238,
    connectSuccessTotal: 89323,
    connectFailTotal: 817,
    connectFailfastHardErrorTotal: 0,
    connectAttemptsBucket1: 90140,
    connectAttemptsBucket2: 0,
    connectAttemptsBucket3_4: 0,
    connectAttemptsBucketGt4: 0,
    connectDurationSuccessBucketLe100ms: 40236,
    connectDurationSuccessBucket101_500ms: 48868,
    connectDurationSuccessBucket501_1000ms: 0,
    connectDurationSuccessBucketGt1000ms: 219,
    connectDurationFailBucketLe100ms: 0,
    connectDurationFailBucket101_500ms: 0,
    connectDurationFailBucket501_1000ms: 0,
    connectDurationFailBucketGt1000ms: 817,
  },
};

export const WithComponent: Story = {
  render: () => (
    <AppShell navItems={navItems} activeId="nodes" brand="PVX">
      <ServerDetailPage server={mockServer} onBack={() => {}} onReload={() => {}} />
    </AppShell>
  ),
};
