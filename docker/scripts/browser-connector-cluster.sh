#!/bin/sh
set -eu

if [ ! -d "$TRAWL_MITM_CA_DIR" ]; then
    echo "Saving TRAWL certificates from ${TRAWL_MITM_CA_URL} to ${TRAWL_MITM_CA_DIR}"
	curl -fsSL --create-dirs --output-dir "${TRAWL_MITM_CA_DIR}" -O "${TRAWL_MITM_CA_URL}"
fi

update-ca-certificates

echo ""

exec /app/scripts/docker-entrypoint.sh "$@"