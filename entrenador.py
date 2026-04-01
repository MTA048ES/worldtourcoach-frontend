import requests

# TUS DATOS (Verificados en tus capturas)
TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
API_KEY = "th7jrwg8e3ak9mjbe6naipue"
ID_ATLETA = "26693"

def enviar(texto):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": texto, "parse_mode": "Markdown"})

def ejecutar():
    # Usamos la ruta de 'wellness' que es la más directa para tus vatios y fitness
    url = f"https://intervals.icu/api/v1/athlete/{ID_ATLETA}/wellness"
    
    try:
        # Aquí es donde ocurre la magia: nos identificamos como el dueño (athlete)
        r = requests.get(url, auth=('athlete', API_KEY))
        
        if r.status_code == 200:
            datos = r.json()
            # Cogemos el dato más nuevo de la lista
            u = datos[-1] if isinstance(datos, list) else datos
            
            # Sacamos los números (Fatiga, Fitness y Forma)
            atl = u.get('atl', 0)
            ctl = u.get('ctl', 0)
            tsb = u.get('tsb', 0)
            
            res = "🦾 *PARTE DE GUERRA (Bermeo)*\n\n"
            res += f"🔥 *Fatiga (ATL):* {atl:.1f}\n"
            res += f"💪 *Fitness (CTL):* {ctl:.1f}\n"
            res += f"⚖️ *Estado (Forma):* {tsb:.1f}\n\n"
            res += "¡A tope hoy, Manu! 🚴‍♂️💨"
            enviar(res)
        else:
            enviar(f"❌ Error {r.status_code}: Intervals dice que la llave (API Key) no es válida.")
            
    except Exception as e:
        enviar(f"⚠️ Error técnico: {str(e)}")

if __name__ == "__main__":
    ejecutar()
