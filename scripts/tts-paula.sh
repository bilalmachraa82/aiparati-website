#!/bin/bash
# TTS com voz PAULA (ElevenLabs v3 Premium PT-PT)
TEXT="$1"
OUTPUT="${2:-/tmp/tts_paula_$(date +%s).mp3}"

VOICE_ID="fNmw8sukfGuvWVOp33Ge"
API_KEY="sk_ee7d79a3f4ed1ee5f2764e90c8664ea9896caba27405b20f"

curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}" \
  -H "xi-api-key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"text\": \"${TEXT}\",
    \"model_id\": \"eleven_v3\",
    \"voice_settings\": {
      \"stability\": 0.5,
      \"similarity_boost\": 0.75
    }
  }" --output "$OUTPUT"

echo "$OUTPUT"
