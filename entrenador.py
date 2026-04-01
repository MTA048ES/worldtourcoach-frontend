import requests
import datetime

# --- DATOS CONFIRMADOS ---
TELEGRAM_TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
API_KEY = "th7jrwg8e3ak9mjbe6naipue"

def enviar_telegram(mensaje):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": mensaje, "parse_mode": "Markdown"})

def ejecutar():
    # PASO 1: Preguntar a Intervals quién soy yo con esta clave
    url_me = "https://intervals.icu/api/v1/me"
    r_me = requests.get(url_me, auth=('athlete', API_KEY))
    
    if r_me.status_code == 200:
        atleta = r_me.json()
        id_real = atleta.get('id')
        nombre = atleta.get('name', 'Manu')
        
        # PASO 2: Con el ID real, pedir los datos de entrenamiento
        url_datos = f"https://intervals.icu/api/v1/athlete/{id_real}/wellness"
        r_datos = requests.get(url_datos, auth=('athlete', API_KEY))
        
        if r_datos.status_code == 200:
            datos = r_datos.json()
            ultimo = datos[-1] if isinstance(datos, list) else datos
            atl = ultimo.get('atl', 0)
            ctl = ultimo.get('ctl', 0)
            tsb = ultimo.get('tsb', 0)
            
            mensaje = f"--- 🦾 PARTE DE GUERRA ({nombre}) ---\n\n"
            mensaje += f"🔥 *Fatiga (ATL):* {atl:.1f}\n"
            mensaje += f"💪 *Fitness (CTL):* {ctl:.1f}\n"
            mensaje += f"⚖️ *Estado (Forma):* {tsb:.1f}\n\n"
            mensaje += "¡A tope hoy! 🚴‍♂️💨"
            enviar_telegram(mensaje)
        else:
            enviar_telegram(f"❌ Error datos: {r_datos.status_code}. El ID {id_real} no responde.")
    else:
        enviar_telegram(f"❌ Error clave: {r_me.status_code}. La clave nueva tampoco abre la puerta.")

if __name__ == "__main__":
    ejecutar()
