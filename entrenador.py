import os
import requests
import datetime

# --- DATOS DIRECTOS ---
TELEGRAM_TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
ID_ATLETA = "26693"
API_KEY = "4xczbq7hl20qsve9d7cz96mr1"

def enviar_telegram(mensaje):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": mensaje, "parse_mode": "Markdown"})

def ejecutar():
    hoy = datetime.date.today().isoformat()
    # Pedimos los datos de bienestar (wellness) de hoy
    url = f"https://intervals.icu/api/v1/athlete/{ID_ATLETA}/wellness/{hoy}"
    
    r = requests.get(url, auth=('athlete', API_KEY))
    
    if r.status_code == 200:
        data = r.json()
        atl = data.get('atl', 0)
        ctl = data.get('ctl', 0)
        tsb = data.get('tsb', 0)
        
        mensaje = f"--- 🦾 PARTE DE GUERRA ---\n\n"
        mensaje += f"🔥 *Fatiga (ATL):* {atl if atl else 0:.1f}\n"
        mensaje += f"💪 *Fitness (CTL):* {ctl if ctl else 0:.1f}\n"
        mensaje += f"⚖️ *Estado (Forma):* {tsb if tsb else 0:.1f}\n\n"
        mensaje += "¡A tope hoy, Manu! 🚴‍♂️💨"
        enviar_telegram(mensaje)
    else:
        enviar_telegram(f"❌ Error de conexión: Código {r.status_code}. Revisa tu API Key en Intervals.")

if __name__ == "__main__":
    ejecutar()
