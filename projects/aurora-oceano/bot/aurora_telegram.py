#!/usr/bin/env python3
"""
Aurora Oceano - Bot Telegram
Voz Paula PT-PT (ElevenLabs v3) + Dados Reais Moloni
"""

import os
import json
import requests
import tempfile
from datetime import datetime

# Configuração (SECRETS via variáveis de ambiente - NUNCA hardcoded!)
from dotenv import load_dotenv
load_dotenv()

BOT_TOKEN = os.getenv("AURORA_BOT_TOKEN")
MOLONI_TOKEN = os.getenv("MOLONI_ACCESS_TOKEN")
MOLONI_EMPRESA = os.getenv("MOLONI_EMPRESA_ID", "276603")
ELEVENLABS_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_PAULA = os.getenv("ELEVENLABS_VOICE_ID", "fNmw8sukfGuvWVOp33Ge")

# Validar configuração obrigatória
if not all([BOT_TOKEN, MOLONI_TOKEN, ELEVENLABS_KEY]):
    raise ValueError("⚠️ Variáveis de ambiente em falta! Configura BOT_TOKEN, MOLONI_TOKEN e ELEVENLABS_KEY no .env")

TELEGRAM_API = f"https://api.telegram.org/bot{BOT_TOKEN}"
MOLONI_API = "https://api.moloni.pt/v1"

def tts_paula(text: str) -> str:
    """Gera áudio com voz Paula PT-PT (ElevenLabs v3)"""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_PAULA}"
    headers = {"xi-api-key": ELEVENLABS_KEY, "Content-Type": "application/json"}
    payload = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
    }
    
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=30)
        if resp.status_code == 200:
            audio_path = tempfile.mktemp(suffix=".mp3")
            with open(audio_path, "wb") as f:
                f.write(resp.content)
            return audio_path
    except Exception as e:
        print(f"TTS Error: {e}")
    return None

def moloni_get(endpoint: str, params: dict = None) -> dict:
    """Query Moloni API"""
    url = f"{MOLONI_API}/{endpoint}/?access_token={MOLONI_TOKEN}"
    data = {"company_id": MOLONI_EMPRESA}
    if params:
        data.update(params)
    try:
        resp = requests.post(url, data=data, timeout=30)
        return resp.json()
    except:
        return {}

def get_encomendas_hoje() -> str:
    """Obter encomendas de hoje"""
    hoje = datetime.now().strftime("%Y-%m-%d")
    faturas = moloni_get("invoices/getAll", {"date": hoje, "qty": 50})
    
    if isinstance(faturas, list) and len(faturas) > 0:
        total = sum(f.get("net_value", 0) for f in faturas)
        texto = f"Hoje temos {len(faturas)} encomendas, num total de {total:.2f} euros. "
        texto += f"Os maiores pedidos são: "
        top3 = sorted(faturas, key=lambda x: x.get("net_value", 0), reverse=True)[:3]
        for f in top3:
            texto += f"{f.get('entity_name', 'Cliente')[:30]} com {f.get('net_value', 0):.0f} euros, "
        return texto.rstrip(", ") + "."
    return "Ainda não há encomendas registadas hoje."

def get_stock_critico() -> str:
    """Obter produtos com stock crítico"""
    produtos = moloni_get("products/getAll", {"qty": 100})
    if isinstance(produtos, list):
        criticos = [p for p in produtos if p.get("stock", 0) < 0]
        if criticos:
            texto = f"Atenção! Há {len(criticos)} produtos com stock negativo. "
            for p in criticos[:3]:
                texto += f"{p.get('name', 'Produto')[:25]}: {p.get('stock', 0)} unidades. "
            return texto
    return "O stock está controlado, sem alertas críticos."

def get_pagamentos() -> str:
    """Obter pagamentos a fornecedores"""
    compras = moloni_get("supplierInvoices/getAll", {"qty": 10})
    if isinstance(compras, list) and len(compras) > 0:
        total = sum(c.get("net_value", 0) for c in compras)
        texto = f"Tens {len(compras)} facturas de fornecedores pendentes, num total de {total:.2f} euros. "
        proxima = compras[0]
        texto += f"A próxima a vencer é de {proxima.get('entity_name', 'Fornecedor')[:25]} no valor de {proxima.get('net_value', 0):.0f} euros."
        return texto
    return "Não encontrei facturas de fornecedores pendentes."

def process_message(text: str) -> str:
    """Processar mensagem e gerar resposta"""
    text_lower = text.lower()
    
    if any(w in text_lower for w in ["encomenda", "pedido", "hoje", "vendas"]):
        return get_encomendas_hoje()
    elif any(w in text_lower for w in ["stock", "inventário", "produto", "falta"]):
        return get_stock_critico()
    elif any(w in text_lower for w in ["pagar", "fornecedor", "pagamento", "factura"]):
        return get_pagamentos()
    elif any(w in text_lower for w in ["olá", "ola", "bom dia", "boa tarde"]):
        return "Olá! Sou a assistente Aurora Oceano. Posso ajudar com encomendas, stock ou pagamentos. O que precisas?"
    else:
        return "Posso ajudar com: encomendas de hoje, stock crítico, ou pagamentos a fornecedores. O que queres saber?"

def send_message(chat_id: int, text: str):
    """Enviar mensagem de texto"""
    requests.post(f"{TELEGRAM_API}/sendMessage", json={"chat_id": chat_id, "text": text})

def send_voice(chat_id: int, audio_path: str):
    """Enviar mensagem de voz"""
    with open(audio_path, "rb") as audio:
        requests.post(f"{TELEGRAM_API}/sendVoice", data={"chat_id": chat_id}, files={"voice": audio})

def handle_update(update: dict):
    """Processar update do Telegram"""
    msg = update.get("message", {})
    chat_id = msg.get("chat", {}).get("id")
    text = msg.get("text", "")
    
    if not chat_id or not text:
        return
    
    print(f"[{datetime.now()}] Mensagem: {text}")
    
    # Gerar resposta
    resposta = process_message(text)
    
    # Enviar texto
    send_message(chat_id, resposta)
    
    # Enviar voz (Paula PT-PT)
    audio = tts_paula(resposta)
    if audio:
        send_voice(chat_id, audio)
        os.remove(audio)

def main():
    """Loop principal do bot"""
    print("🌊 Aurora Oceano Bot iniciado!")
    print("   Voz: Paula (ElevenLabs v3 PT-PT)")
    print("   Dados: Moloni API")
    
    offset = 0
    while True:
        try:
            resp = requests.get(f"{TELEGRAM_API}/getUpdates", params={"offset": offset, "timeout": 30})
            updates = resp.json().get("result", [])
            
            for update in updates:
                handle_update(update)
                offset = update["update_id"] + 1
                
        except KeyboardInterrupt:
            print("\nBot parado.")
            break
        except Exception as e:
            print(f"Erro: {e}")

if __name__ == "__main__":
    main()
