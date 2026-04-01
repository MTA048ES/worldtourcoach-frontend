import os
import requests
import datetime

# --- DATOS CONFIRMADOS ---
TELEGRAM_TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
ID_ATLETA = "26693"
API_KEY = "6wvb9yo79hz2ldumgdmhn1j60"

def enviar_telegram(mensaje):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": mensaje, "parse_mode": "Markdown"})

def ejecutar():
    # Pedimos los datos generales del atleta
    url = f"https://intervals.icu/api/v1/athlete/{ID_ATLETA}"
    
    # Intentamos conectar
    r = requests.get(url, auth=('athlete', API_KEY))
    
    if r.status_code == 200:
        data = r.json()
        # Sacamos los datos de la parte de 'wellness' o directamente del perfil
        atl = data.get('atl', 0)
        ctl = data.get('ctl', 0)
        tsb = data.get('ctl', 0) - data.get('atl', 0) # Calculamos la forma
        
        mensaje = f"--- 🦾 PARTE DE GUERRA ---\n\n"
        mensaje += f"🔥 *Fatiga (ATL):* {atl if atl else 0:.1f}\n"
        mensaje += f"💪 *Fitness (CTL):* {ctl if ctl else 0:.1f}\n"
        mensaje += f"⚖️ *Estado (Forma):* {tsb if tsb else 0:.1f}\n\n"
        mensaje += "¡A tope hoy, Manu! 🚴‍♂️💨"
        enviar_telegram(mensaje)
    else:
        enviar_telegram(f"❌ Error {r.status_code}: La clave o el ID fallan. Entra en Intervals -> Settings -> API Key y dale a 'Reset' si hace falta.")

if __name__ == "__main__":
    ejecutar()
