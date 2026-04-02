import requests
from datetime import date, timedelta
from config import API_KEY, TELEGRAM_TOKEN, CHAT_ID

ATHLETE_ID = "0"


def get_intervals_data():
    hoy = date.today().isoformat()
    hace_7_dias = (date.today() - timedelta(days=7)).isoformat()

    url = f"https://intervals.icu/api/v1/athlete/{ATHLETE_ID}/wellness"
    params = {"oldest": hace_7_dias, "newest": hoy}

    try:
        response = requests.get(url, params=params, auth=("API_KEY", API_KEY), timeout=10)

        if response.status_code == 200:
            data = response.json()
            if not data:
                print("Respuesta vacía.")
                return None

            for entry in reversed(data):
                ctl = entry.get("ctl")
                atl = entry.get("atl")
                if ctl is not None and atl is not None:
                    tsb = ctl - atl
                    return ctl, atl, tsb

            print("No se encontraron registros con CTL/ATL.")
            return None

        elif response.status_code == 401:
            print("Error 401: API Key incorrecta.")
            return None
        else:
            print(f"Error {response.status_code}: {response.text}")
            return None

    except requests.exceptions.ConnectionError:
        print("Error: no se pudo conectar con Intervals.icu")
        return None
    except requests.exceptions.Timeout:
        print("Error: tiempo de espera agotado")
        return None
    except Exception as e:
        print(f"Error inesperado: {e}")
        return None


def interpretar_forma(tsb):
    if tsb > 10:
        return "✅ Buena forma — listo para competir"
    elif tsb >= 0:
        return "⚡ Forma neutra — entrenamiento productivo"
    elif tsb >= -10:
        return "🔄 Ligera fatiga — sigue con el plan"
    elif tsb >= -30:
        return "⚠️ Fatiga acumulada — considera bajar carga"
    else:
        return "🛑 Muy fatigado — necesitas descanso"


def escapar_markdown(valor):
    texto = str(round(valor, 1))
    for char in [".", "-", "+", "(", ")", "!", ">", "#", "*", "_", "[", "]"]:
        texto = texto.replace(char, f"\\{char}")
    return texto


def send_telegram(message):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": message, "parse_mode": "MarkdownV2"}

    try:
        response = requests.post(url, data=payload, timeout=10)
        if response.status_code == 200:
            print("✅ Mensaje enviado con éxito a Telegram")
        else:
            print(f"Error Telegram {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Error enviando a Telegram: {e}")


if __name__ == "__main__":
    print("🔄 Obteniendo datos de Intervals.icu...")
    datos = get_intervals_data()

    if datos:
        ctl, atl, tsb = datos
        forma = interpretar_forma(tsb)

        mensaje = (
            "📊 *ESTADO INTERVALS\\.ICU*\n\n"
            f"🔥 *CTL \\(Aptitud\\):* {escapar_markdown(ctl)}\n"
            f"🚀 *ATL \\(Fatiga\\):* {escapar_markdown(atl)}\n"
            f"⚖️ *TSB \\(Forma\\):* {escapar_markdown(tsb)}\n\n"
            f"{forma}"
        )

        send_telegram(mensaje)
    else:
        print("❌ No se han podido recuperar los datos.")
