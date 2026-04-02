// Page data contract types for panvex-web integration

// --- Shared ---

export type Severity = "ok" | "warn" | "error";

export interface KpiItem {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export interface TrendItem {
  label: string;
  data: number[];
  color: string;
  current: string;
}

export interface TimelineEventData {
  status: Severity | "info";
  time: string;
  message: string;
}

export interface AlertData {
  severity: "warn" | "crit";
  message: string;
  source: string;
  timestamp: string;
}

// --- Dashboard ---

export interface DashboardOverviewData {
  kpis: KpiItem[];
  trends: TrendItem[];
  alerts: AlertData[];
  attentionNodes: DashboardNodeData[];
  healthyNodes: DashboardNodeData[];
}

export interface DashboardNodeData {
  id: string;
  name: string;
  status: Severity;
  connections: number;
  trafficBytes: number;
  cpuPct: number;
  memPct: number;
  dcs: import("../components/NodeSummaryCard").NodeDcInfo[];
}

export interface DashboardTimelineData {
  events: TimelineEventData[];
}

export interface DashboardPageProps {
  overview: DashboardOverviewData;
  timeline: DashboardTimelineData;
  onNodeClick?: (nodeId: string) => void;
  onNodeLinkClick?: (nodeId: string) => void;
}

// --- Servers ---

export interface ServerListItem {
  id: string;
  name: string;
  status: Severity;
  ip?: string;
  connections: number;
  usersOnline?: number;
  usersTotal?: number;
  trafficBytes: number;
  cpuPct: number;
  memPct: number;
  dcCoveragePct: number;
  uptimeSeconds: number;
  fleetGroupId: string;
  dcs?: import("../components/NodeSummaryCard").NodeDcInfo[];
}

export type ViewMode = "cards" | "list";

export interface ServersPageProps {
  servers: ServerListItem[];
  viewMode?: ViewMode;
  autoThreshold?: number;
  onViewModeChange?: (mode: ViewMode) => void;
  onServerClick?: (serverId: string) => void;
  onServerLinkClick?: (serverId: string) => void;
}

// --- Server Detail ---

// /v1/stats/dcs → dcs[]
export interface ServerDcData {
  dc: number;
  // endpoints
  endpoints: string[];
  endpointWriters: Array<{ endpoint: string; activeWriters: number }>;
  availableEndpoints: number;
  availablePct: number;
  // writers
  requiredWriters: number;
  aliveWriters: number;
  coveragePct: number;
  freshAlivePct?: number;       // fresh_coverage_pct
  // floor policy
  floorMin: number;
  floorTarget: number;
  floorMax: number;
  floorCapped: boolean;
  // perf
  rttMs?: number;
  load: number;
}

// /v1/stats/upstreams → upstreams[]
export interface ServerUpstreamData {
  upstreamId: number;
  routeKind: string;            // direct | socks4 | socks5 | shadowsocks
  address: string;
  weight: number;
  healthy: boolean;
  fails: number;
  lastCheckAgeSecs: number;
  effectiveLatencyMs?: number;
  dc: Array<{ dc: number; latencyEmaMs?: number; ipPreference: string }>;
}

// /v1/runtime/connections/summary
export interface ServerConnectionsData {
  current: number;
  currentMe: number;
  currentDirect: number;
  activeUsers: number;
  staleCacheUsed: boolean;
  topByConnections: Array<{ username: string; connections: number; octets: number }>;
  topByThroughput: Array<{ username: string; connections: number; octets: number }>;
}

// /v1/stats/summary
export interface ServerSummaryData {
  connectionsTotal: number;
  connectionsBadTotal: number;
  handshakeTimeoutsTotal: number;
  configuredUsers: number;
}

// /v1/system/info
export interface ServerSystemInfoData {
  version: string;
  targetArch: string;
  targetOs: string;
  buildProfile: string;
  gitCommit?: string;
  buildTimeUtc?: string;
  uptimeSeconds: number;
  configHash: string;
  configPath: string;
  configReloadCount: number;
  lastConfigReloadEpochSecs?: number;
}

// /v1/runtime/gates + /v1/health
export interface ServerGatesData {
  acceptingNewConnections: boolean;
  meRuntimeReady: boolean;
  useMiddleProxy: boolean;
  me2dcFallbackEnabled: boolean;
  rerouteActive: boolean;
  rerouteReason?: string;
  startupStatus: string;          // pending | initializing | ready | failed | skipped
  startupProgressPct: number;
  degraded: boolean;              // from /v1/runtime/initialization
  readOnly: boolean;              // from /v1/health
}

// /v1/stats/me-writers → writers[]
export interface ServerMeWriterData {
  writerId: number;
  dc?: number;
  endpoint: string;
  state: string;                  // warm | active | draining
  draining: boolean;
  degraded: boolean;
  boundClients: number;
  idleForSecs?: number;
  rttEmaMs?: number;
}

// /v1/stats/me-writers aggregate
export interface ServerMePoolData {
  enabled: boolean;
  // /v1/stats/me-writers → summary (9 fields)
  summary: {
    aliveWriters: number;
    availableEndpoints: number;
    availablePct: number;
    configuredDcGroups: number;
    configuredEndpoints: number;
    coveragePct: number;
    freshAliveWriters: number;
    freshCoveragePct: number;
    requiredWriters: number;
  };
  // /v1/runtime/me_pool_state → generations
  generations: {
    active: number;
    warm: number;
    pendingHardswap: number;
    pendingHardswapAgeSecs?: number;
    drainingGenerations: number[];
  };
  hardswap: {
    enabled: boolean;
    pending: boolean;
  };
  // /v1/runtime/me_pool_state → contour
  contour: {
    active: number;
    warm: number;
    draining: number;
  };
  // /v1/runtime/me_pool_state → writers health
  writersHealth: {
    healthy: number;
    degraded: number;
    draining: number;
  };
  refill: {
    inflightEndpoints: number;
    inflightDcs: number;
    byDc: Array<{ dc: number; family: string; inflight: number }>;
  };
  writersList: ServerMeWriterData[];
}

// /v1/runtime/me_quality
export interface ServerMeQualityData {
  enabled: boolean;
  counters: {
    idleCloseByPeerTotal: number;
    readerEofTotal: number;
    kdfDriftTotal: number;
    kdfPortOnlyDriftTotal: number;
    routeDropNoConn: number;
    routeDropChannelClosed: number;
    routeDropQueueFull: number;
    routeDropQueueFullBase: number;
    routeDropQueueFullHigh: number;
    reconnectAttemptTotal: number;
    reconnectSuccessTotal: number;
  };
  dcRtt: Array<{
    dc: number;
    rttEmaMs?: number;
    aliveWriters: number;
    requiredWriters: number;
    coveragePct: number;
  }>;
}

// /v1/runtime/me-selftest
export interface ServerSelftestData {
  enabled: boolean;
  kdf: {
    state: string;                // ok | error
    ewmaErrorsPerMin: number;
    thresholdErrorsPerMin: number;
    errorsTotal: number;
  };
  timeskew: {
    state: string;                // ok | error
    maxSkewSecs15m?: number;
    samples15m?: number;
    lastSkewSecs?: number;
    lastSource?: string;
  };
  ip: {
    v4?: { addr: string; state: string };   // good | bogon | loopback
    v6?: { addr: string; state: string };
  };
  pid: {
    pid: number;
    state: string;                // one | non-one
  };
  bnd: {
    addrState: string;            // ok | bogon | error
    portState: string;            // ok | zero | error
    lastAddr?: string;
    lastSeenAgeSecs?: number;
  };
}

// /v1/runtime/nat_stun
export interface ServerNatStunData {
  enabled: boolean;
  natProbeEnabled: boolean;
  natProbeDisabledRuntime: boolean;
  liveStunTotal: number;
  configuredStunTotal: number;
  configuredServers: string[];      // list of stun server addresses
  reflectionV4?: { addr: string; ageSecs: number };
  reflectionV6?: { addr: string; ageSecs: number };
  stunBackoffRemainingMs?: number;
}

// /v1/runtime/events/recent → events[]
export interface ServerEventData {
  seq: number;
  tsEpochSecs: number;
  eventType: string;
  context: string;
}

// /v1/stats/upstreams → zero counters
export interface ServerUpstreamZeroCounters {
  connectAttemptTotal: number;
  connectSuccessTotal: number;
  connectFailTotal: number;
  connectFailfastHardErrorTotal: number;
  connectAttemptsBucket1: number;
  connectAttemptsBucket2: number;
  connectAttemptsBucket3_4: number;
  connectAttemptsBucketGt4: number;
  connectDurationSuccessBucketLe100ms: number;
  connectDurationSuccessBucket101_500ms: number;
  connectDurationSuccessBucket501_1000ms: number;
  connectDurationSuccessBucketGt1000ms: number;
  connectDurationFailBucketLe100ms: number;
  connectDurationFailBucket101_500ms: number;
  connectDurationFailBucket501_1000ms: number;
  connectDurationFailBucketGt1000ms: number;
}

// /v1/stats/minimal/all → network_path[]
export interface ServerNetworkPathData {
  dc: number;
  ipPreference?: string;
  selectedAddrV4?: string;
  selectedAddrV6?: string;
}

// /v1/stats/upstreams → summary
export interface ServerUpstreamSummaryData {
  configuredTotal: number;
  healthyTotal: number;
  unhealthyTotal: number;
  directTotal: number;
  socks4Total: number;
  socks5Total: number;
  shadowsocksTotal: number;
}

export interface ServerDetailPageProps {
  server: {
    id: string;
    name: string;
    ip?: string;
    status: Severity;

    // /v1/system/info
    systemInfo: ServerSystemInfoData;

    // /v1/runtime/gates + /v1/health + /v1/runtime/initialization
    gates: ServerGatesData;

    // /v1/stats/dcs
    dcs: ServerDcData[];

    // /v1/runtime/connections/summary
    connections: ServerConnectionsData;

    // /v1/stats/summary
    summary: ServerSummaryData;

    // /v1/stats/me-writers + /v1/runtime/me_pool_state
    mePool?: ServerMePoolData;

    // /v1/stats/upstreams
    upstreams: ServerUpstreamData[];
    upstreamSummary?: ServerUpstreamSummaryData;
    upstreamZeroCounters?: ServerUpstreamZeroCounters;

    // /v1/runtime/me_quality
    meQuality?: ServerMeQualityData;

    // /v1/runtime/me-selftest
    selftest?: ServerSelftestData;

    // /v1/runtime/nat_stun
    natStun?: ServerNatStunData;

    // /v1/runtime/events/recent
    events: ServerEventData[];
    eventsDroppedTotal: number;

    // /v1/stats/minimal/all → network_path
    networkPath?: ServerNetworkPathData[];
  };
  onBack?: () => void;
  onReload?: () => void;
}

// --- Clients ---

export interface ClientListItem {
  id: string;
  name: string;
  enabled: boolean;
  assignedNodesCount: number;
  expirationRfc3339: string;
  trafficUsedBytes: number;
  uniqueIpsUsed: number;
  activeTcpConns: number;
  dataQuotaBytes: number;
  lastDeployStatus: string;
}

export interface ClientsPageProps {
  clients: ClientListItem[];
  viewMode: ViewMode;
  autoThreshold: number;
  onViewModeChange?: (mode: ViewMode) => void;
  onClientClick?: (clientId: string) => void;
  onClientLinkClick?: (clientId: string) => void;
}

export interface ClientDeploymentData {
  agentId: string;
  desiredOperation: string;
  status: string;
  lastError: string;
  connectionLink: string;
  lastAppliedAtUnix: number;
}

export interface ClientDetailPageProps {
  client: {
    id: string;
    name: string;
    enabled: boolean;
    secret: string;
    userAdTag: string;
    trafficUsedBytes: number;
    uniqueIpsUsed: number;
    activeTcpConns: number;
    maxTcpConns: number;
    maxUniqueIps: number;
    dataQuotaBytes: number;
    expirationRfc3339: string;
    fleetGroupIds: string[];
    deployments: ClientDeploymentData[];
  };
  onBack?: () => void;
}

// --- Settings ---

export interface SettingsPageProps {
  panelSettings: {
    httpPublicUrl: string;
    grpcPublicEndpoint: string;
  };
  appearanceSettings: {
    theme: "system" | "light" | "dark";
    density: "comfortable" | "compact";
    helpMode: "off" | "basic" | "full";
    swipeNavigation: boolean;
  };
  onPanelSettingsChange?: (settings: SettingsPageProps["panelSettings"]) => void;
  onAppearanceChange?: (settings: SettingsPageProps["appearanceSettings"]) => void;
  onRestart?: () => void;
}

// --- Profile ---

export interface ProfilePageProps {
  user: {
    id: string;
    username: string;
    role: string;
    totpEnabled: boolean;
  };
  appearance: SettingsPageProps["appearanceSettings"];
  onAppearanceChange?: (settings: SettingsPageProps["appearanceSettings"]) => void;
}

// --- Login ---

export interface LoginPageProps {
  onLogin: (username: string, password: string, totpCode?: string) => Promise<void>;
  error?: string;
  loading?: boolean;
}

