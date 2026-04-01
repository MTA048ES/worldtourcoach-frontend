import os
import requests
import datetime

# --- DATOS DIRECTOS (Para probar) ---
TELEGRAM_TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
INTERVALS_ID = "26693"
INTERVALS_API_KEY = "4xczbq7hl20qsve9d7cz96mr1"

def enviar_telegram(mensaje):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    try:
        r = requests.post(url, json={"chat_id": CHAT_ID, "text": mensaje, "parse_mode": "Markdown"})
        print(f"Respuesta Telegram: {r.status_code}")
    except Exception as e:
        print(f"Error Telegram: {e}")

def obtener_intervals():
    # Probamos la conexión con Intervals
    url = f"https://intervals.icu/api/v1/athlete/{INTERVALS_ID}/wellness"
    try:
        r = requests.get(url, auth=('athlete', INTERVALS_API_KEY))
        if r.status_code == 200:
            datos = r.json()
            # Cogemos el último dato de la lista
            return datos[-1] if isinstance(datos, list) else datos
        else:
            print(f"Error Intervals: Código {r.status_code}")
            return None
    except Exception as e:
        print(f"Error de red: {e}")
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
        enviar_telegram("❌ Error crítico: No puedo leer tus datos de Intervals.icu. Revisa la API Key en la web.")

if __name__ == "__main__":
    ejecutar()
