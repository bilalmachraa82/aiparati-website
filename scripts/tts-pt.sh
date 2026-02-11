#!/bin/bash
# TTS Português de Portugal - Azure (via edge-tts)
# Uso: tts-pt.sh "texto" [duarte|raquel] [output.mp3]

TEXT="$1"
VOICE="${2:-duarte}"
OUTPUT="${3:-/tmp/tts-pt-output.mp3}"

case "$VOICE" in
  raquel|feminino|f)
    AZURE_VOICE="pt-PT-RaquelNeural"
    ;;
  duarte|masculino|m|*)
    AZURE_VOICE="pt-PT-DuarteNeural"
    ;;
esac

edge-tts --voice "$AZURE_VOICE" --text "$TEXT" --write-media "$OUTPUT" 2>/dev/null
echo "$OUTPUT"
