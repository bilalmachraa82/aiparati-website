#!/bin/bash
# TTS Multi-língua - Azure (via edge-tts)
# Uso: tts.sh "texto" [lang] [gender] [output.mp3]
# Lang: pt, fr, en (auto-detect se não especificado)
# Gender: m/masculino, f/feminino (default: m)

TEXT="$1"
LANG="${2:-auto}"
GENDER="${3:-m}"
OUTPUT="${4:-/tmp/tts-output-$$.mp3}"

# Auto-detect language if not specified
if [ "$LANG" = "auto" ]; then
    # Simple detection based on common words
    if echo "$TEXT" | grep -qiE "(olá|bom dia|obrigado|português|está|não|sim|como|fazer|quero|preciso|podes)"; then
        LANG="pt"
    elif echo "$TEXT" | grep -qiE "(bonjour|merci|s'il vous|comment|je suis|c'est|faire|pourquoi|oui|non|très)"; then
        LANG="fr"
    else
        LANG="en"
    fi
fi

# Select voice based on language and gender
case "$LANG" in
    pt|pt-pt|portuguese)
        if [ "$GENDER" = "f" ] || [ "$GENDER" = "feminino" ] || [ "$GENDER" = "raquel" ]; then
            VOICE="pt-PT-RaquelNeural"
        else
            VOICE="pt-PT-DuarteNeural"
        fi
        ;;
    fr|french|francais|français)
        if [ "$GENDER" = "f" ] || [ "$GENDER" = "feminino" ] || [ "$GENDER" = "vivienne" ]; then
            VOICE="fr-FR-VivienneMultilingualNeural"
        else
            VOICE="fr-FR-RemyMultilingualNeural"
        fi
        ;;
    en|english|inglês|ingles)
        if [ "$GENDER" = "f" ] || [ "$GENDER" = "feminino" ] || [ "$GENDER" = "ava" ]; then
            VOICE="en-US-AvaMultilingualNeural"
        else
            VOICE="en-US-AndrewMultilingualNeural"
        fi
        ;;
    *)
        # Default to English
        VOICE="en-US-AndrewMultilingualNeural"
        ;;
esac

# Generate audio
edge-tts --voice "$VOICE" --text "$TEXT" --write-media "$OUTPUT" 2>/dev/null

if [ -f "$OUTPUT" ]; then
    echo "$OUTPUT"
else
    echo "ERROR: Failed to generate audio" >&2
    exit 1
fi
