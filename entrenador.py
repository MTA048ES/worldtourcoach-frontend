import requests

# DATOS DIRECTOS (Para probar si la puerta de Intervals está abierta)
TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
API_KEY = "th7jrwg8e3ak9mjbe6naipue"
ID_ATLETA = "26693"

def enviar(texto):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    try:
        r = requests.post(url, json={"chat_id": CHAT_ID, "text": texto, "parse_mode": "Markdown"})
        print(f"Respuesta Telegram: {r.status_code}")
    except Exception as e:
        print(f"Error enviando a Telegram: {e}")

def ejecutar():
    # Intentamos entrar a Intervals
    url = f"https://intervals.icu/api/v1/athlete/{ID_ATLETA}/wellness"
    print(f"Conectando a Intervals con ID: {ID_ATLETA}...")
    
    try:
        r = requests.get(url, auth=('athlete', API_KEY))
        print(f"Respuesta Intervals: {r.status_code}")
        
        if r.status_code == 200:
            datos = r.json()
            u = datos[-1] if isinstance(datos, list) else datos
            
            res = "🦾 *PARTE DE GUERRA (Bermeo)*\n\n"
            res += f"🔥 *Fatiga:* {u.get('atl', 0):.1f}\n"
            res += f"💪 *Fitness:* {u.get('ctl', 0):.1f}\n"
            res += f"⚖️ *Estado:* {u.get('tsb', 0):.1f}\n\n"
            res += "¡A tope hoy, Manu! 🚴‍♂️💨"
            enviar(res)
        elif r.status_code == 403:
            enviar(f"❌ Error 403: Intervals sigue en 'Privado'. Cambia la visibilidad a 'Público' en Ajustes.")
        elif r.status_code == 401:
            enviar(f"❌ Error 401: La API KEY no es correcta o el email no está confirmado.")
        else:
            enviar(f"❌ Error {r.status_code}: Algo ha fallado en la conexión.")
            
    except Exception as e:
        print(f"Error técnico: {e}")
        enviar(f"⚠️ Error técnico: {str(e)}")

if __name__ == "__main__":
    ejecutar()
