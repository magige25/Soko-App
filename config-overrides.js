export function devServer(configFunction) {
  return (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);
    config.historyApiFallback = true;
    return config;
  };
}