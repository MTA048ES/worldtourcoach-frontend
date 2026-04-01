import requests

# TUS DATOS
TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
API_KEY = "th7jrwg8e3ak9mjbe6naipue"
ID_ATLETA = "26693"

def enviar(texto):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": texto, "parse_mode": "Markdown"})

def ejecutar():
    # Usamos una URL que suele saltarse los bloqueos de privacidad básicos
    url = f"https://intervals.icu/api/v1/athlete/{ID_ATLETA}/wellness"
    
    try:
        r = requests.get(url, auth=('athlete', API_KEY))
        
        if r.status_code == 200:
            datos = r.json()
            u = datos[-1] if isinstance(datos, list) else datos
            
            res = "🦾 *PARTE DE GUERRA (Bermeo)*\n\n"
            res += f"🔥 *Fatiga:* {u.get('atl', 0):.1f}\n"
            res += f"💪 *Fitness:* {u.get('ctl', 0):.1f}\n"
            res += f"⚖️ *Estado:* {u.get('tsb', 0):.1f}\n\n"
            res += "¡A tope hoy, Manu! 🚴‍♂️💨"
            enviar(res)
        else:
            # Si falla, que nos diga el código exacto de error
            enviar(f"❌ Error {r.status_code}. Intervals dice que el perfil no es público todavía.")
            
    except Exception as e:
        enviar(f"⚠️ Error: {str(e)}")

if __name__ == "__main__":
    ejecutar()
