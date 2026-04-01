
import requests

# DATOS MAESTROS
TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
API_KEY = "th7jrwg8e3ak9mjbe6naipue"
ID_ATLETA = "26693"

def enviar(texto):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": texto, "parse_mode": "Markdown"})

def ejecutar():
    # Usamos la ruta 'stats' que a veces salta el bloqueo de privacidad
    url = f"https://intervals.icu/api/v1/athlete/{ID_ATLETA}"
    
    try:
        r = requests.get(url, auth=('athlete', API_KEY))
        
        if r.status_code == 200:
            d = r.json()
            # Sacamos los datos directamente del resumen del atleta
            atl = d.get('atl', 0)
            ctl = d.get('ctl', 0)
            tsb = ctl - atl
            
            res = "🦾 *PARTE DE GUERRA (Bermeo)*\n\n"
            res += f"🔥 *Fatiga (ATL):* {atl:.1f}\n"
            res += f"💪 *Fitness (CTL):* {ctl:.1f}\n"
            res += f"⚖️ *Estado (Forma):* {tsb:.1f}\n\n"
            res += "¡A tope hoy, Manu! 🚴‍♂️💨"
            enviar(res)
        else:
            enviar(f"❌ Error {r.status_code}. Intervals sigue bloqueando el acceso. Prueba a salir de la cuenta y volver a entrar con tu email y la nueva contraseña.")
            
    except Exception as e:
        enviar(f"⚠️ Error: {str(e)}")

if __name__ == "__main__":
    ejecutar()
