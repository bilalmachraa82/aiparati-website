#!/bin/bash
# Universal Edge TTS script with per-voice support
# Usage: tts-edge.sh "text" [voice] [output_path]
# Voices: duarte (default), francisca, raquel, remy, vivienne, andrew, ava

TEXT="${1:?Usage: tts-edge.sh \"text\" [voice] [output_path]}"
VOICE="${2:-duarte}"
OUTPUT="${3:-/tmp/tts-$(date +%s%N).mp3}"

# Strip markdown/emoji for clean TTS
CLEAN_TEXT=$(echo "$TEXT" | sed 's/\*//g; s/_//g; s/`//g; s/#//g; s/~//g')

# Voice map
case "$VOICE" in
  duarte|pt-pt-m)    EDGE_VOICE="pt-PT-DuarteNeural" ;;
  raquel|pt-pt-f)    EDGE_VOICE="pt-PT-RaquelNeural" ;;
  francisca|pt-br-f) EDGE_VOICE="pt-BR-FranciscaNeural" ;;
  thalita|pt-br-f2)  EDGE_VOICE="pt-BR-ThalitaNeural" ;;
  antonio|pt-br-m)   EDGE_VOICE="pt-BR-AntonioNeural" ;;
  remy|fr-m)         EDGE_VOICE="fr-FR-RemyMultilingualNeural" ;;
  vivienne|fr-f)     EDGE_VOICE="fr-FR-VivienneMultilingualNeural" ;;
  andrew|en-m)       EDGE_VOICE="en-US-AndrewMultilingualNeural" ;;
  ava|en-f)          EDGE_VOICE="en-US-AvaMultilingualNeural" ;;
  *)                 EDGE_VOICE="$VOICE" ;;
esac

edge-tts --voice "$EDGE_VOICE" --text "$CLEAN_TEXT" --write-media "$OUTPUT" 2>/dev/null

if [ -f "$OUTPUT" ] && [ -s "$OUTPUT" ]; then
  echo "$OUTPUT"
else
  echo "ERROR: TTS failed" >&2
  exit 1
fi
