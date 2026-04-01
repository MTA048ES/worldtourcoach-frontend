import os
import requests
import datetime

# --- CONFIGURACIÓN DESDE LA CAJA FUERTE ---
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")
CHAT_ID = os.getenv("CHAT_ID")
INTERVALS_ID = "26693"  
INTERVALS_API_KEY = os.getenv("INTERVALS_API_KEY")

def enviar_telegram(mensaje):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": mensaje, "parse_mode": "Markdown"})

def obtener_intervals():
    # Pedimos los datos de fatiga y forma a Intervals.icu
    url = f"https://intervals.icu/api/v1/athlete/{INTERVALS_ID}/wellness"
    r = requests.get(url, auth=('athlete', INTERVALS_API_KEY))
    if r.status_code == 200:
        datos = r.json()
        return datos[-1] if isinstance(datos, list) else datos
    return None

def ejecutar():
    data = obtener_intervals()
    if data:
        fecha = datetime.date.today().strftime("%d/%m/%Y")
        atl = data.get('atl', 0)
        tsb = data.get('tsb', 0)
        ctl = data.get('ctl', 0)
        
        mensaje = f"--- 🦾 PARTE DE GUERRA ({fecha}) ---\n\n"
        mensaje += f"🔥 *Fatiga (ATL):* {atl:.1f}\n"
        mensaje += f"💪 *Fitness (CTL):* {ctl:.1f}\n"
        mensaje += f"⚖️ *Estado (Forma):* {tsb:.1f}\n\n"
        mensaje += "¡A tope hoy, Manu! 🚴‍♂️💨"
        
        enviar_telegram(mensaje)
    else:
        enviar_telegram("❌ Error al conectar con Intervals.icu")

if __name__ == "__main__":
    ejecutar()
