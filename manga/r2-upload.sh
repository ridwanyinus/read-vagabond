#!/bin/bash
set -e

source ./.env

sync_volume() {
    local v=$1
    local volume="volume-$v"

    [ -d "$volume" ] || return

    aws s3 sync "$volume" "s3://vagabond-manga-hq/$volume" \
        --endpoint-url "https://"$ACCOUNT_ID".r2.cloudflarestorage.com" \
        --size-only \
        --no-progress
}

export -f sync_volume

# Run multiple volumes in parallel (adjust -j for CPU / network)
seq -w 01 37 | xargs -n1 -P4 -I{} bash -c 'sync_volume "$@"' _ {}
