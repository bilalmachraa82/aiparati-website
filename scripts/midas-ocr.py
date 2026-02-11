#!/usr/bin/env python3
"""
MIDAS OCR - Processa recibos com Gemini Vision
Uso: python3 midas-ocr.py <image_path>
"""

import sys
import os
import json
import google.generativeai as genai

def process_receipt(image_path: str) -> dict:
    """Processa imagem de recibo e extrai dados estruturados."""
    
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        # Tentar ler do ficheiro
        secrets_path = os.path.expanduser("~/clawd/.env.secrets")
        if os.path.exists(secrets_path):
            with open(secrets_path) as f:
                for line in f:
                    if line.startswith("GEMINI_API_KEY="):
                        api_key = line.split("=", 1)[1].strip()
                        break
    
    if not api_key:
        return {"error": "GEMINI_API_KEY não encontrada"}
    
    genai.configure(api_key=api_key)
    
    prompt = """Analisa este recibo/fatura e extrai os dados em JSON:

{
  "merchant": "nome do comerciante/loja",
  "date": "YYYY-MM-DD",
  "time": "HH:MM ou null",
  "total": número em EUR,
  "items": [{"name": "...", "qty": 1, "price": 0.00}] ou [],
  "payment_method": "cartão/dinheiro/mbway/multibanco/outro",
  "nif": "NIF do comerciante ou null",
  "category_suggestion": "categoria provável",
  "confidence": 0.0 a 1.0
}

Se não conseguires ler algum campo, usa null.
Responde APENAS com o JSON, sem markdown."""

    try:
        # Upload da imagem
        uploaded_file = genai.upload_file(image_path)
        
        # Processar com Gemini
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content([prompt, uploaded_file])
        
        # Parse JSON
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        
        data = json.loads(text)
        data["source"] = "receipt_ocr"
        data["image_path"] = image_path
        
        return data
        
    except json.JSONDecodeError as e:
        return {"error": f"Erro a fazer parse do JSON: {e}", "raw": response.text}
    except Exception as e:
        return {"error": str(e)}


def main():
    if len(sys.argv) < 2:
        print("Uso: python3 midas-ocr.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(json.dumps({"error": f"Ficheiro não encontrado: {image_path}"}))
        sys.exit(1)
    
    result = process_receipt(image_path)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
