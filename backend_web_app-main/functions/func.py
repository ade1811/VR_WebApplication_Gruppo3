import mysql.connector as mc
from datetime import datetime, timedelta, date, time

def MySQL_to_JSON(query: str, params: tuple, engine: mc.connection.MySQLConnection) -> dict:
    # Funzione di conversione per oggetti non serializzabili
    def default_serializer(obj):
        if isinstance(obj, timedelta):
            return str(obj)  # Converte il timedelta in una stringa
        elif isinstance(obj, datetime):
            return obj.isoformat()  # Converte il datetime in formato ISO 8601
        elif isinstance(obj, date):
            return obj.isoformat()  # Converte la data in formato ISO 8601
        elif isinstance(obj, time):
            return obj.isoformat()  # Converte il time in formato ISO 8601
        raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

    cursor = engine.cursor()
    
    cursor.execute(query, params)
    
    columns = [col[0] for col in cursor.description]
    rows = cursor.fetchall()
    
    # Serializzare ogni riga e gestire eventuali tipi non serializzabili
    data = []
    for row in rows:
        row_dict = dict(zip(columns, row))
        # Applica la serializzazione ai valori
        row_dict = {key: default_serializer(value) if isinstance(value, (timedelta, datetime, date, time)) else value for key, value in row_dict.items()}
        data.append(row_dict)

    return {"data": data}

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

def send_email(oggetto, body, to_email, path = " "):
    '''
        to_email prende anche liste di stringhe
        se path non la passi non inserisce allegati, se passi il percorso inserice qualisasi allegato
        PER ORA MANDA SOLO PDF se ti serve altro ma non credo modifica il codice

        All paramentro body puoi passare anche html modifica l'attributo plain a riga 27 con html
    '''
    # Configurazione SMTP per Gmail
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "adasd.99wdw@gmail.com"
    smtp_password = ""   

    # Componi il messaggio
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = oggetto

    # Corpo del messaggio (può essere plain text o HTML)
    msg.attach(MIMEText(body, 'plain'))  # Puoi usare 'html' per inviare email in formato HTML

    if path != " ":
        with open(path, 'rb') as pdf_file:
            pdf_attachment = MIMEApplication(pdf_file.read(), _subtype='pdf')
            pdf_attachment.add_header('Content-Disposition', 'attachment', filename='documento.pdf')  # Nome del file allegato
            msg.attach(pdf_attachment) 

    try:
        # Connessione al server SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Avvia la connessione TLS (sicura)
        server.login(smtp_user, smtp_password)

        # Invio dell'email
        server.sendmail(smtp_user, to_email, msg.as_string())

        # Termina la connessione
        server.quit()
        return True

    except Exception as e:
        print(f"Errore durante l'invio dell'email: {e}")
        return False

import os

def change_name_if_exist(file):
    # Genera un nuovo nome file univoco con un suffisso
    base, ext = os.path.splitext(file.filename)
    counter = 1
    new_filename = f"{base}_{counter}{ext}"
    new_save_path = os.path.join("C:\\Users\\ade59\\Documents\\webapp\\ImmaginiDB", new_filename)
    
    # Continua ad incrementare finché non trovi un nome non esistente
    while os.path.exists(new_save_path):
        counter += 1
        new_filename = f"{base}_{counter}{ext}"
        new_save_path = os.path.join("C:\\Users\\ade59\\Documents\\webapp\\ImmaginiDB", new_filename)
    
    save_path = new_save_path  # Aggiorna il percorso di salvataggio
    filename = new_filename
    print(f"File esistente, nuovo file salvato come: {new_filename}")

    return filename, save_path

import requests

#usiamo api di openstreetmap per ottenere l'indirizzo e la regione
def get_indirizzo(latitude: float = 41.62, longitude: float = 15.9) -> str:
    url = f"https://nominatim.openstreetmap.org/reverse?lat={latitude}&lon={longitude}&format=json"
    
    try:
        response = requests.get(url, headers={'User-Agent': 'LocationLookup/1.0'})
        response.raise_for_status()
        data = response.json()
        if data['address'].get('town'):
            indirizzo = data['address']['road'] + ", " + data['address']['town']
        else:
            indirizzo = data['address']['road'] + ", " + data['address']['city']
        
        return indirizzo
    
    except (requests.RequestException, KeyError) as e:
        print(f"Error fetching location data: {e}")
        return None


def get_regione(latitude: float = 41.62, longitude: float = 15.9) -> str:
    url = f"https://nominatim.openstreetmap.org/reverse?lat={latitude}&lon={longitude}&format=json"
    
    try:
        response = requests.get(url, headers={'User-Agent': 'LocationLookup/1.0'})
        response.raise_for_status()
        data = response.json()
        regione = data['address']["state"]
        
        return regione.lower()
    
    except (requests.RequestException, KeyError) as e:
        print(f"Error fetching location data: {e}")
        return None
    
def get_popolazione(regione: str) -> int:
    username = "ade1811"
    base_url = "http://api.geonames.org/searchJSON"

    params = {
        "q": regione,
        "maxRows": 1,
        "country": "IT",
        "featureClass": "A",  # Classificazione geografica (amministrativo)
        "username": username,
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()

        if data.get("totalResultsCount", 0) > 0:
            region = data["geonames"][0]
            return region.get("population", None)
        else:
            print(f"Regione '{regione}' non trovata.")
            return None

    except requests.RequestException as e:
        print(f"Errore nella richiesta API: {e}")
        return None

import string
import random
 
def genera_matricola(lunghezza=8):
    
    lettere = string.ascii_uppercase  # Lettere maiuscole A-Z
    numeri = string.digits  # Numeri 0-9
    caratteri = lettere + numeri  # Combina lettere e numeri
    matricola = ''.join(random.choices(caratteri, k=lunghezza))  # Genera stringa casuale
    return matricola

import stripe
from dotenv import load_dotenv
def pagamenti(data):
    stripe.api_key = "sk_test_51Qf1O4RoyX8vEHoY3NqI7PBxgEAdqF7kMeDzdxF3GaNDZqBaoIZwXCgp2nnv7AuVBwoEtDJ6SVeMJbuMBSoiO6L9009wnKKUDu"
    try:
        line_items = []
        for pacchetto in data:
            prezzo = (int(float(pacchetto['prezzo']) * 100))
            line_items.append({  
                'price_data': {
                    'currency': 'eur',
                    'product_data': {'name': pacchetto["titolo"]},
                    'unit_amount': prezzo, 
                },
                'quantity': pacchetto['quantita'],
            })

        # Crea la sessione di pagamento
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url='http://localhost:3000/success',
            cancel_url='http://localhost:3000/cancel',
        )
        return session.id
    except Exception as e:
        print(e)
        return {'error': str(e)}, 400
