/** Telemt API envelope */
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  revision: string;
}

export interface ApiError {
  ok: false;
  error: { code: string; message: string };
  request_id?: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

/** GET /v1/health */
export interface HealthData {
  status: string;
  read_only: boolean;
}

/** GET /v1/system/info */
export interface SystemInfoData {
  version: string;
  target_arch: string;
  target_os: string;
  build_profile: string;
  git_commit: string | null;
  build_time_utc: string | null;
  rustc_version: string | null;
  process_started_at_epoch_secs: number;
  uptime_seconds: number;
  config_path: string;
  config_hash: string;
  config_reload_count: number;
  last_config_reload_epoch_secs: number | null;
}

/** GET /v1/runtime/gates */
export interface RuntimeGatesData {
  accepting_new_connections: boolean;
  conditional_cast_enabled: boolean;
  me_runtime_ready: boolean;
  me2dc_fallback_enabled: boolean;
  use_middle_proxy: boolean;
  startup_status: string;
  startup_stage: string;
  startup_progress_pct: number;
  me2dc_fast_enabled: boolean;
  route_mode: string;
  reroute_active: boolean;
  reroute_to_direct_at_epoch_secs: number | null;
  reroute_reason: string | null;
}

/** GET /v1/stats/summary */
export interface SummaryData {
  uptime_seconds: number;
  connections_total: number;
  connections_bad_total: number;
  handshake_timeouts_total: number;
  configured_users: number;
}

/** GET /v1/stats/dcs */
export interface DcStatusData {
  middle_proxy_enabled: boolean;
  reason: string | null;
  generated_at_epoch_secs: number;
  dcs: DcStatus[];
}

export interface DcStatus {
  dc: number;
  endpoints: string[];
  endpoint_writers: DcEndpointWriters[];
  available_endpoints: number;
  available_pct: number;
  required_writers: number;
  floor_min: number;
  floor_target: number;
  floor_max: number;
  floor_capped: boolean;
  alive_writers: number;
  coverage_pct: number;
  fresh_alive_writers: number;
  fresh_coverage_pct: number;
  rtt_ms: number | null;
  load: number;
}

export interface DcEndpointWriters {
  endpoint: string;
  active_writers: number;
}

/** GET /v1/stats/me-writers */
export interface MeWritersData {
  middle_proxy_enabled: boolean;
  reason: string | null;
  generated_at_epoch_secs: number;
  summary: MeWritersSummary;
  writers: MeWriterStatus[];
}

export interface MeWritersSummary {
  configured_dc_groups: number;
  configured_endpoints: number;
  available_endpoints: number;
  available_pct: number;
  required_writers: number;
  alive_writers: number;
  coverage_pct: number;
  fresh_alive_writers: number;
  fresh_coverage_pct: number;
}

export interface MeWriterStatus {
  writer_id: number;
  dc: number | null;
  endpoint: string;
  generation: number;
  state: "warm" | "active" | "draining";
  draining: boolean;
  degraded: boolean;
  bound_clients: number;
  idle_for_secs: number | null;
  rtt_ema_ms: number | null;
  matches_active_generation: boolean;
  in_desired_map: boolean;
  allow_drain_fallback: boolean;
  drain_started_at_epoch_secs: number | null;
  drain_deadline_epoch_secs: number | null;
  drain_over_ttl: boolean;
}

/** GET /v1/runtime/connections/summary */
export interface ConnectionsSummaryData {
  enabled: boolean;
  reason: string | null;
  generated_at_epoch_secs: number;
  data: ConnectionsSummaryPayload | null;
}

export interface ConnectionsSummaryPayload {
  cache: { ttl_ms: number; served_from_cache: boolean; stale_cache_used: boolean };
  totals: {
    current_connections: number;
    current_connections_me: number;
    current_connections_direct: number;
    active_users: number;
  };
  top: {
    limit: number;
    by_connections: ConnectionUserData[];
    by_throughput: ConnectionUserData[];
  };
  telemetry: { user_enabled: boolean; throughput_is_cumulative: boolean };
}

export interface ConnectionUserData {
  username: string;
  current_connections: number;
  total_octets: number;
}

/** GET /v1/runtime/events/recent */
export interface EventsData {
  enabled: boolean;
  reason: string | null;
  generated_at_epoch_secs: number;
  data: EventsPayload | null;
}

export interface EventsPayload {
  capacity: number;
  dropped_total: number;
  events: ApiEventRecord[];
}

export interface ApiEventRecord {
  seq: number;
  ts_epoch_secs: number;
  event_type: string;
  context: string;
}

/** GET /v1/stats/users and GET /v1/users */
export interface UserInfo {
  username: string;
  user_ad_tag: string | null;
  max_tcp_conns: number | null;
  expiration_rfc3339: string | null;
  data_quota_bytes: number | null;
  max_unique_ips: number | null;
  current_connections: number;
  active_unique_ips: number;
  active_unique_ips_list: string[];
  recent_unique_ips: number;
  recent_unique_ips_list: string[];
  total_octets: number;
  links: UserLinks;
}

export interface UserLinks {
  classic: string[];
  secure: string[];
  tls: string[];
}

/** POST /v1/users */
export interface CreateUserRequest {
  username: string;
  secret?: string;
  user_ad_tag?: string;
  max_tcp_conns?: number;
  expiration_rfc3339?: string;
  data_quota_bytes?: number;
  max_unique_ips?: number;
}

export interface CreateUserResponse {
  user: UserInfo;
  secret: string;
}

/** PATCH /v1/users/{username} */
export interface PatchUserRequest {
  secret?: string;
  user_ad_tag?: string;
  max_tcp_conns?: number;
  expiration_rfc3339?: string;
  data_quota_bytes?: number;
  max_unique_ips?: number;
}

/** GET /v1/runtime/me_quality */
export interface MeQualityData {
  enabled: boolean;
  reason: string | null;
  generated_at_epoch_secs: number;
  data: MeQualityPayload | null;
}

export interface MeQualityPayload {
  counters: {
    idle_close_by_peer_total: number;
    reader_eof_total: number;
    kdf_drift_total: number;
    kdf_port_only_drift_total: number;
    reconnect_attempt_total: number;
    reconnect_success_total: number;
  };
  route_drops: {
    no_conn_total: number;
    channel_closed_total: number;
    queue_full_total: number;
    queue_full_base_total: number;
    queue_full_high_total: number;
  };
  dc_rtt: DcRttEntry[];
}

export interface DcRttEntry {
  dc: number;
  rtt_ema_ms: number | null;
  alive_writers: number;
  required_writers: number;
  coverage_pct: number;
}

/** GET /v1/runtime/me_pool_state */
export interface MePoolStateData {
  enabled: boolean;
  reason: string | null;
  generated_at_epoch_secs: number;
  data: MePoolStatePayload | null;
}

export interface MePoolStatePayload {
  generations: {
    active_generation: number;
    warm_generation: number;
    pending_hardswap_generation: number;
    pending_hardswap_age_secs: number | null;
    draining_generations: number[];
  };
  hardswap: { enabled: boolean; pending: boolean };
  writers: {
    total: number;
    alive_non_draining: number;
    draining: number;
    degraded: number;
    contour: { warm: number; active: number; draining: number };
    health: { healthy: number; degraded: number; draining: number };
  };
  refill: {
    inflight_endpoints_total: number;
    inflight_dc_total: number;
    by_dc: { dc: number; family: string; inflight: number }[];
  };
}

/** GET /v1/stats/upstreams */
export interface UpstreamsData {
  enabled: boolean;
  reason: string | null;
  generated_at_epoch_secs: number;
  summary: UpstreamSummary | null;
  upstreams: UpstreamStatus[] | null;
}

export interface UpstreamSummary {
  configured_total: number;
  healthy_total: number;
  unhealthy_total: number;
  direct_total: number;
  socks4_total: number;
  socks5_total: number;
  shadowsocks_total: number;
}

export interface UpstreamStatus {
  upstream_id: number;
  route_kind: string;
  address: string;
  weight: number;
  scopes: string;
  healthy: boolean;
  fails: number;
  last_check_age_secs: number;
  effective_latency_ms: number | null;
  dc: UpstreamDcStatus[];
}

export interface UpstreamDcStatus {
  dc: number;
  latency_ema_ms: number | null;
  ip_preference: string;
}

/** GET /v1/security/posture */
export interface SecurityPostureData {
  api_read_only: boolean;
  api_whitelist_enabled: boolean;
  api_whitelist_entries: number;
  api_auth_header_enabled: boolean;
  proxy_protocol_enabled: boolean;
  log_level: string;
  telemetry_core_enabled: boolean;
  telemetry_user_enabled: boolean;
  telemetry_me_level: string;
}

/** GET /v1/runtime/me-selftest */
export interface MeSelftestData {
  enabled: boolean;
  reason: string | null;
  generated_at_epoch_secs: number;
  data: MeSelftestPayload | null;
}

export interface MeSelftestPayload {
  kdf: {
    state: string;
    ewma_errors_per_min: number;
    threshold_errors_per_min: number;
    errors_total: number;
  };
  timeskew: {
    state: string;
    max_skew_secs_15m: number | null;
    samples_15m: number;
    last_skew_secs: number | null;
    last_source: string | null;
    last_seen_age_secs: number | null;
  };
  ip: { v4: { addr: string; state: string } | null; v6: { addr: string; state: string } | null };
  pid: { pid: number; state: string };
  bnd: {
    addr_state: string;
    port_state: string;
    last_addr: string | null;
    last_seen_age_secs: number | null;
  };
}

/** GET /v1/runtime/initialization */
export interface RuntimeInitializationData {
  status: string;
  degraded: boolean;
  current_stage: string;
  progress_pct: number;
  started_at_epoch_secs: number;
  ready_at_epoch_secs: number | null;
  total_elapsed_ms: number;
  transport_mode: string;
  me: {
    status: string;
    current_stage: string;
    progress_pct: number;
    init_attempt: number;
    retry_limit: string;
    last_error: string | null;
  };
  components: {
    id: string;
    title: string;
    status: string;
    started_at_epoch_ms: number | null;
    finished_at_epoch_ms: number | null;
    duration_ms: number | null;
    attempts: number;
    details: string | null;
  }[];
}
