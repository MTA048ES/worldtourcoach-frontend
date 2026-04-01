import requests

# DATOS (Verificados)
TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
API_KEY = "th7jrwg8e3ak9mjbe6naipue"
ID_ATLETA = "26693"

def enviar(texto):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": texto, "parse_mode": "Markdown"}
    requests.post(url, json=payload)

def ejecutar():
    # Probamos con la ruta de Wellness, que es la que tiene tus números
    url = f"https://intervals.icu/api/v1/athlete/{ID_ATLETA}/wellness"
    
    # Nuevo método de cabecera (más seguro)
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    
    try:
        # Intentamos entrar con la API Key como 'Bearer'
        r = requests.get(url, auth=('athlete', API_KEY))
        
        # Si falla el anterior, probamos el plan B en el mismo momento
        if r.status_code != 200:
            r = requests.get(url, headers=headers)

        if r.status_code == 200:
            datos = r.json()
            # Cogemos el último dato de la lista (el más reciente)
            u = datos[-1] if isinstance(datos, list) else datos
            
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
            enviar(f"❌ Error {r.status_code}. Manu, entra en Intervals y comprueba que la API KEY sea exactamente: th7jrwg8e3ak9mjbe6naipue")
            
    except Exception as e:
        enviar(f"⚠️ Error técnico: {str(e)}")

if __name__ == "__main__":
    ejecutar()
