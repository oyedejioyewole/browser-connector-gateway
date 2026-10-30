(async () =>
  fetch("http://localhost:3000/health")
    .then((response) => process.exit(response.ok ? 0 : 1))
    .catch(() => process.exit(1)))();
