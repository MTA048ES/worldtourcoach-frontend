def get_intervals_data():
    hoy = date.today().isoformat()
    hace_7_dias = (date.today() - timedelta(days=7)).isoformat()

    # ID "0" es el comodín para tu propia cuenta
    url = f"https://intervals.icu/api/v1/athlete/0/wellness"
    params = {"oldest": hace_7_dias, "newest": hoy}

    # ESTO ES LO QUE SALTA EL BLOQUEO DE PERFIL PRIVADO
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://intervals.icu/settings'
    }

    try:
        # Hacemos la petición con el "disfraz" de navegador
        response = requests.get(
            url, 
            params=params, 
            auth=("API_KEY", API_KEY), 
            headers=headers, 
            timeout=15
        )

        if response.status_code == 200:
            data = response.json()
            if not data: return None
            
            # Buscamos de hoy hacia atrás el último CTL/ATL
            for entry in reversed(data):
                ctl = entry.get("ctl")
                atl = entry.get("atl")
                if ctl is not None and atl is not None:
                    return ctl, atl, (ctl - atl)
            return None
        else:
            # Esto nos dirá exactamente por qué falla en el log de GitHub
            print(f"DEBUG: Error {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"DEBUG: Error de conexión: {e}")
        return None
