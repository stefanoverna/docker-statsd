(function () {
  console.log(process.env);

  const redisUrl =
    process.env.REDIS_URL || "redis://host.docker.internal:6379/0";

  return {
    port: parseInt(process.env.STATSD_PORT) || 8125,
    backends: [
      "./backends/console",
      "./backends/cloudwatch",
      "./backends/redisHash",
      "./backends/redisSortedSet",
    ],
    debug: process.env.STATSD_DEBUG == "true",
    flushInterval: parseInt(process.env.STATSD_FLUSH_INTERVAL) || 60000,
    deleteIdleStats: true,
    cloudwatch: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "key_id",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "secret",
      region: process.env.AWS_REGION || "EU_WEST_1",
      namespace: process.env.CLOUDWATCH_NAMESPACE,
      processKeyForNamespace:
        process.env.CLOUDWATCH_PROCESS_KEY_FOR_NAMESPACE !== "false",
      whitelist:
        process.env.CLOUDWATCH_WHITELIST ||
        [
          "cda-response_time",
          "rails-status_error",
          "rails-status_success",
        ].join(","),
    },
    redisHash: {
      connectUrl: redisUrl,
      redisKeyPrefix: process.env.REDIS_KEY_PREFIX || "site_usages:",
      prefixWhitelist:
        process.env.REDIS_HASH_PREFIX_WHITELIST ||
        [
          "cma_api_calls",
          "cda_api_calls",
          "cda_bandwidth",
          "cma_bandwidth",
          "assets_bandwidth",
        ].join(","),
    },
    redisSortedSet: {
      connectUrl: redisUrl,
      redisKeyPrefix: process.env.REDIS_KEY_PREFIX || "site_usages:",
      prefixWhitelist:
        process.env.REDIS_SORTED_SET_PREFIX_WHITELIST ||
        [
          "assets_referrer_bytes",
          "assets_ip_bytes",
          "assets_path_bytes",

          "cda_referrer_requests",
          "cda_referrer_bytes",

          "cda_ip_requests",
          "cda_ip_bytes",

          "cda_access_token_id_requests",
          "cda_access_token_id_bytes",

          "cma_ip_requests",
          "cma_ip_bytes",

          "cma_endpoint_requests",
          "cma_endpoint_bytes",

          "cma_user_requests",
          "cma_user_bytes",
        ].join(","),
      keepTop: parseInt(process.env.REDIS_SORTED_SET_KEEP_TOP) || 100,
      pruneFrequency:
        parseInt(process.env.REDIS_SORTED_SET_PRUNE_FREQUENCY) || 1000 * 60 * 60 * 4,
    },
  };
})();
