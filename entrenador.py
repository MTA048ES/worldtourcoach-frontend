import requests

# DATOS DEFINITIVOS Y SEGUROS
TOKEN = "8240108371:AAGkSgqM9ElmyLjRhSsIK01o-JlvgpvyQhM"
CHAT_ID = "939585578"
ID_ATLETA = "26693"
API_KEY = "5zufcjnbw04dziglsc36rcuq1" # <--- Tu nueva clave recién generada

def enviar(texto):
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    try:
        r = requests.post(url, json={"chat_id": CHAT_ID, "text": texto, "parse_mode": "Markdown"})
    except Exception as e:
        print(f"Error Telegram: {e}")

def ejecutar():
    # Conectamos a los datos de rendimiento (Wellness)
    url = f"https://intervals.icu/api/v1/athlete/{ID_ATLETA}/wellness"
    
    try:
        r = requests.get(url, auth=('athlete', API_KEY))
        
        if r.status_code == 200:
            datos = r.json()
            u = datos[-1] if isinstance(datos, list) else datos
            
            res = "🦾 *PARTE DE GUERRA (Bermeo)*\n\n"
            res += f"🔥 *Fatiga (ATL):* {u.get('atl', 0):.1f}\n"
            res += f"💪 *Fitness (CTL):* {u.get('ctl', 0):.1f}\n"
            res += f"⚖️ *Estado (Forma):* {u.get('tsb', 0):.1f}\n\n"
            res += "¡A tope hoy, Manu! 🚴‍♂️💨"
            enviar(res)
        elif r.status_code == 403:
            enviar("❌ Intervals dice: 'Perfil Privado'. Mañana ponlo en 'Público' en Ajustes.")
        else:
            enviar(f"❌ Error {r.status_code}. Revisa que la API KEY esté bien pegada.")
            
    except Exception as e:
        enviar(f"⚠️ Error técnico: {str(e)}")

if __name__ == "__main__":
    ejecutar()
