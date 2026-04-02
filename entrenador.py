def get_intervals_data():
    hoy = date.today().isoformat()
    hace_7_dias = (date.today() - timedelta(days=7)).isoformat()

    # Usamos el ID 0 que es el que mejor funciona
    url = f"https://intervals.icu/api/v1/athlete/0/wellness"
    params = {"oldest": hace_7_dias, "newest": hoy}

    # ESTE ES EL DISFRAZ DEFINITIVO
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://intervals.icu/settings',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    }

    try:
        # Añadimos un pequeño retraso de cortesía para que el servidor no se asuste
        import time
        time.sleep(2) 

        response = requests.get(
            url, 
            params=params, 
            auth=("API_KEY", API_KEY), 
            headers=headers, 
            timeout=20
        )

        if response.status_code == 200:
            data = response.json()
            if not data: return None
            
            for entry in reversed(data):
                ctl = entry.get("ctl")
                atl = entry.get("atl")
                if ctl is not None and atl is not None:
                    # Calculamos el TSB nosotros mismos para asegurar el dato
                    return ctl, atl, (ctl - atl)
            return None
        
        # Si da error, que no te mande el mensaje feo de "Perfil Privado" a Telegram
        print(f"Error del servidor: {response.status_code}")
        return None
            
    except Exception as e:
        print(f"Error de conexión: {e}")
        return None
