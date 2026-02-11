#!/bin/bash
# docker-run.sh — Execute Docker commands bypassing OpenClaw's seccomp/NoNewPrivs
# Uses systemd-run --user + sg docker to get proper group access
# Usage: docker-run.sh "docker compose up -d" [workdir]

CMD="${1:?Usage: docker-run.sh \"command\" [workdir]}"
WORKDIR="${2:-$(pwd)}"
OUTFILE=$(mktemp /tmp/docker-run.XXXXXX)

systemd-run --user --wait --collect \
  --working-directory="$WORKDIR" \
  /bin/bash -c "sg docker -c '$CMD' > $OUTFILE 2>&1"
EXIT_CODE=$?

cat "$OUTFILE"
rm -f "$OUTFILE"
exit $EXIT_CODE
