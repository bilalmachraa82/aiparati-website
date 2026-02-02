#!/usr/bin/env python3
"""
Aurora Oceano - TTS com voz PAULA (ElevenLabs v3 PT-PT)
Português de Portugal, natural e profissional.
"""

import os
import requests
import tempfile
from pathlib import Path

# Configuração ElevenLabs v3
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "sk_ee7d79a3f4ed1ee5f2764e90c8664ea9896caba27405b20f")
VOICE_PAULA = "fNmw8sukfGuvWVOp33Ge"  # Voz Paula PT-PT

# Configurações de voz
VOICE_SETTINGS = {
    "stability": 0.5,       # Natural, não robótico
    "similarity_boost": 0.75,
    "style": 0.0,           # Neutro
    "use_speaker_boost": True
}


def text_to_speech(text: str, output_path: str = None) -> str:
    """
    Converte texto para áudio usando ElevenLabs v3 com voz Paula.
    
    Args:
        text: Texto em Português de Portugal
        output_path: Caminho para guardar o ficheiro (opcional)
    
    Returns:
        Caminho do ficheiro de áudio gerado
    """
    if not output_path:
        output_path = tempfile.mktemp(suffix=".mp3", prefix="aurora_")
    
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_PAULA}"
    
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",  # Melhor para PT-PT
        "voice_settings": VOICE_SETTINGS
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        
        with open(output_path, "wb") as f:
            f.write(response.content)
        
        return output_path
        
    except requests.exceptions.RequestException as e:
        print(f"Erro TTS: {e}")
        return None


def speak_response(text: str) -> str:
    """
    Gera resposta de voz para o bot Aurora.
    Limpa o texto de markdown antes de falar.
    """
    # Limpar markdown para fala natural
    clean_text = text.replace("**", "").replace("_", "").replace("*", "")
    clean_text = clean_text.replace("#", "").replace("`", "")
    clean_text = clean_text.replace("€", " euros")
    clean_text = clean_text.replace("%", " por cento")
    
    # Limitar tamanho (ElevenLabs tem limite)
    if len(clean_text) > 2500:
        clean_text = clean_text[:2500] + "... e mais detalhes em texto."
    
    return text_to_speech(clean_text)


# Respostas pré-definidas em PT-PT natural
RESPOSTAS_VOZ = {
    "bom_dia": "Bom dia! Sou a assistente Aurora Oceano. Em que posso ajudar?",
    "boa_tarde": "Boa tarde! Aqui é a Aurora Oceano. Como posso ser útil?",
    "encomendas": "Vou verificar as encomendas pendentes. Um momento.",
    "precos": "A consultar o histórico de preços desse cliente.",
    "pagamentos": "Deixe-me ver os pagamentos programados para os próximos dias.",
    "stock_alerta": "Atenção! Há produtos com stock crítico que precisam de atenção.",
    "confirmacao": "Perfeito, já está registado.",
    "erro": "Desculpe, não consegui processar esse pedido. Pode repetir?",
    "despedida": "Obrigada! Se precisar de mais alguma coisa, é só dizer.",
}


def get_saudacao() -> tuple[str, str]:
    """Retorna saudação apropriada com texto e áudio."""
    from datetime import datetime
    hora = datetime.now().hour
    
    if hora < 12:
        key = "bom_dia"
    elif hora < 19:
        key = "boa_tarde"
    else:
        key = "boa_tarde"  # Boa noite seria outro
    
    texto = RESPOSTAS_VOZ[key]
    audio = text_to_speech(texto)
    return texto, audio


if __name__ == "__main__":
    # Teste
    print("A testar TTS Aurora com voz Paula...")
    audio = text_to_speech("Olá! Sou a assistente da Aurora Oceano. Como posso ajudar hoje?")
    if audio:
        print(f"Áudio gerado: {audio}")
    else:
        print("Erro ao gerar áudio")
