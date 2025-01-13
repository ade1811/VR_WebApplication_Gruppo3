import json
from flask import Flask, request, jsonify, send_file
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
from flask_cors import CORS
from classes.User import User
from classes.Promoter import Promoter
from classes.Ticket import Ticket
from classes.Bouncer import Bouncer
from classes.Recommender import Recommender
import os
from dotenv import load_dotenv
import mysql.connector as mc
from functions.func import send_email, change_name_if_exist, get_popolazione, pagamenti
from datetime import timedelta
import time
import json


load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("APP_SECRET_KEY")
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
jwt = JWTManager(app)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

'''try:
    engine = mc.connect(username = os.getenv("USERNAME_MYSQL"), password = os.getenv("PASS_MYSQL"),
                    database = os.getenv("DB_NAME_MYSQL"), host = os.getenv("HOST_MYSQL"), 
                    ssl_disabled=True )
    cursor = engine.cursor()
    print("Connessione al database avvenuta con successo")
except Exception as e:
    print(f"Errore di connessione al database: {e}")
    engine = None'''   

db_config = {
    "user": os.getenv("USERNAME_MYSQL"),
    "password": os.getenv("PASS_MYSQL"),
    "host": os.getenv("HOST_MYSQL"),
    "database": os.getenv("DB_NAME_MYSQL"),
    "ssl_disabled": True
} 

#it works :)
@app.before_request
def check_token_expiration():
    if request.endpoint!= 'login' and request.endpoint != 'signin':
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
                token = decode_token(token)
                exp_timestamp = token["exp"]
                current_timestamp = int(time.time())
                
                #Se scade tra meno di 5 min
                if  exp_timestamp - current_timestamp < 300:
                    identity = get_jwt_identity()
                    new_token = create_access_token(identity=identity)
                    # Add new token to response headers
                    response = app.make_response({"new_token": new_token})
                    return response
        except Exception as e:
            pass

@app.route("/", methods=["GET"])
def c():
    return {"message": "Api pronte"}

@app.route("/api/login", methods=["POST"])
def login():
    try:
        email = request.json.get("email")
        password = request.json.get("password")
        role = request.json.get("userType")

        u = User(db_config, email, password)
        ok, message = u.logIn(role)

        if ok:
            # Unifica l'identity in una stringa
            access_token = create_access_token(identity=f"{message['token']}_{message['isPromoter']}")
            if role == "bouncer":
                access_token = create_access_token(identity=f"{message['token']}_bouncer")
                return {"token": access_token}
            return {"token": access_token, "anagrafica": message["anagrafica"], "immagine": message["immagine"]}, 200
        else:
            return message, 400

    except Exception as e:
        return {"message": str(e)}, 500

@app.route("/api/signin", methods=["POST"])
def signin():
    try:
        nome = request.json.get("nome")
        cognome = request.json.get("cognome")
        email = request.json.get("email") 
        ddn = request.json.get("ddn") #formato dd/mm/yyyy
        password = request.json.get("password")
        role = request.json.get("userType")

        u = User(db_config, email, password, nome, cognome, ddn)
        ok, message = u.signIn(role)

        if ok:
            access_token = create_access_token(identity=f"{message['token']}_{message['isPromoter']}")
            return {"token": access_token, "role": role, "anagrafica": message["anagrafica"]}, 200
        else:
            return message, 400
    except Exception as e:
        return {"message": str(e)}, 500
 
@app.route("/api/dashboard", methods = ["GET"])
@jwt_required()
def dashboard():
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    status = 401
    
    if isPromoter == "True":
        promoter = Promoter(db_config, id)
        data, status = promoter.dashboard()        
    else:
        data = {
            "prm": isPromoter,
            "id": id
        }
    
    return data, status

@app.route('/api/image/<file>')
def get_image(file):
    try:
        img_path = f"C:\\Users\\ade59\\Documents\\webapp\\ImmaginiDB\\{file}"
        if file != "undefined":
            return send_file(img_path)
        else:
            return {"message": "mo te la mando"}
    except FileExistsError as fee:
        print("Errore: " + fee)
        return {"message": fee}

@app.route("/api/getEvents", methods = ["GET"])
@jwt_required()
def getEvents():
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')

    if isPromoter == "True":
        promoter = Promoter(db_config, id)
        return promoter.getEvents()
    
@app.route("/api/getAllEvents", methods = ["GET"])
def getAllEvents():
    try:
        user = User(db_config)
        return user.getAllEvents()
    except Exception as e:
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/getEvent/<eventoID>", methods=["GET"])
def getEvent(eventoID):
    try:
        user = User(db_config)
        return user.getEvent(eventoID)
    except Exception as e:
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/getEventP/<eventoID>", methods=["GET"])
@jwt_required()
def getEventP(eventoID):
    try:
        identity = get_jwt_identity()
        id, isPromoter = identity.split('_')
        return Promoter(db_config, id).getEvent(eventoID)
    except Exception as e:
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/modifyEvent", methods = ["POST"])
@jwt_required()
def modifyEvent():
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')

    if isPromoter == "True":
        try:
            eventoID = request.json.get("eventoID", None)
            titolo = request.json.get("titolo", None)
            nroPosti = request.json.get("nroPosti", None)
            luogo = request.json.get("luogo", None)
            data = request.json.get("data")
            descrizione = request.json.get("descrizione", None)
            genere = request.json.get("genere", None)
            ora = request.json.get("ora", None)
        except Exception as e:
            return {"message": str(e)}, 500

        promoter = Promoter(db_config, id)
        promoter.modifyEvent(eventoID=eventoID, titolo=titolo, descrizione=descrizione,
                             luogo=luogo, data=data, ora=ora)
        print(eventoID, titolo, descrizione, luogo, data, ora)
        return {"message": "ok"}, 200

@app.route("/api/addPacchetto/<eventoID>", methods = ["POST"])
@jwt_required()
def addPacchetto(eventoID):
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    
    if isPromoter == "True":
        jsonData = request.get_json("jsonOutput")
        pacchetti = jsonData["tiers"]

        promoter = Promoter(db_config, id) 

        for pacchetto in pacchetti:
            print(pacchetto["title"], pacchetto["price"], pacchetto["description"])
            promoter.setPacchetti(eventoID, pacchetto["title"], pacchetto["price"], pacchetto["description"])

        return {"message": "ok"}, 200
    else:
        return {"message": "Non sei un promoter"}, 401

@app.route("/api/addEvento", methods = ["POST"])
@jwt_required()
def addEvento():
    try:
        identity = get_jwt_identity()
        id, isPromoter = identity.split('_')

        print(id, isPromoter)
        # Recupera i dati dal form
        form_data = request.form.to_dict()
        print("Form data:", json.dumps(form_data, indent=4))

        promoter = Promoter(db_config, id)

        # Recupera i file caricati
        if "file" in request.files:
            file = request.files["file"]
            filename = file.filename
            # Stampa dettagli del file
            print("File name:", file.filename)
            print("File content type:", file.content_type)

            # Definisci il percorso di salvataggio
            save_path = os.path.join("C:\\Users\\ade59\\Documents\\webapp\\ImmaginiDB", filename)

            # Controlla se un file con lo stesso nome esiste già
            if os.path.exists(save_path):
                filename, save_path = change_name_if_exist(file)

            # Salva il file
            file.save(save_path) 
            print(f"File salvato in: {save_path}")
            ok, id = promoter.createEvent(form_data, filename)

        else:
            print(request.get_json())

        # Restituisce una risposta di successo
        return {"message": "Dati ricevuti con successo", "id": id}, 200

    except Exception as e:
        # Gestione errori
        print("Errore:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/api/profile", methods = ["GET"])
@jwt_required()
def profile():
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    user = User(db_config)
    return user.getProfile(id, isPromoter), 200

@app.route("/api/recuperaPassword", methods = ["POST"])
def recuperaPassword():
    email = request.json.get("email")
    role = request.json.get("userType")
    print(email, role)
    id = User(db_config).getID(email, role)
    
    token = create_access_token(identity=f"{id}_{role}", expires_delta=timedelta(minutes=5) )

    sended = send_email("Recupero password", 
    f"Clicca sul link per resettare la password http://localhost:3000/resetPassword/{token}", "ade593401@gmail.com")

    if sended:
        return {"message": "controlla la mail", "passToken": token}, 200
    else:
        return {"message": "Operazione non andata a buonfine"}, 500

@app.route("/api/passwordReset/<token>", methods = ["POST"])
def verify(token):
    password = request.json.get("password")
    token = decode_token(token)
    sub = token.get("sub")
    id, role = sub.split("_")

    User(db_config).resetPassword(id, role, password)

    return {"message": "Tutto ok"}, 200

@app.route("/api/modifyProfile", methods = ["POST"])
@jwt_required()
def modifyProfile():
    try:
        nome = request.json.get("nome", None)
        cognome = request.json.get("cognome", None)
        email = request.json.get("email", None)

        identity = get_jwt_identity()
        id, isPromoter = identity.split('_')
    except Exception as e:
        return {"message": str(e)}, 500

    return User(db_config).modifyProfile(id, isPromoter, nome, cognome, email)

@app.route("/api/regione/<nomeRegione>", methods=["GET"])
def regione(nomeRegione):
    prom =  Promoter(db_config, 1)
    n, p, gen = prom.regione(nomeRegione)
    popolazione = get_popolazione(nomeRegione)
    tasso_partecipazione = '{:.2e}'.format((p / popolazione) * 100)
    return {"regione": n, "partecipanti": p, "popolazione": popolazione, 
            "tasso": tasso_partecipazione, "generi": gen}, 200  

@app.route("/api/changeVisibility/<eventID>", methods=["POST"])
@jwt_required()     
def changeVisibility(eventID):
    print(eventID)
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    if isPromoter == "True":
        return Promoter(db_config, id).changeVisibility(eventID)
    else:
        return {"message": "Non hai l'autorizzazione"}, 401

@app.route("/api/getTicket/<eventID>", methods=["GET"])    
@jwt_required()
def getTicket(eventID):
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    if isPromoter == "True":
        return Promoter(db_config, id).getTicket(eventID)
    else:
        return {"message": "Non hai l'autorizzazione"}, 401

#GESTISCE ANCHE IL PAGAMENTO CON STRIPE
@app.route("/api/createTicket", methods=["POST"])
@jwt_required()
def createTicket():
    try:
        identity = get_jwt_identity()
        idPromoter, isPromoter = identity.split('_')
        data = request.json
        id = pagamenti(data)
        t = Ticket(db_config)
        t.createTicket(idPromoter, data)

        return {"message": "Controlla le mail", "id": id}, 200         
    except Exception as e:
        print(e)
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/createBouncer", methods=["POST"])
@jwt_required()
def createBouncer():
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    try:
        if isPromoter == "True":
            email = request.json.get("email")
            eventoID = request.json.get("eventoID")
            p = Promoter(db_config, id)
            p.createBouncer(email, eventoID)
        else:
            return {"message": "Non hai l'autorizzazione"}, 401

        return {"message": "Bouncer creato"}, 200
            
    except Exception as e:
        print(e)
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/setBouncer/<eventoID>", methods=["POST"])
@jwt_required()
def setBouncer(eventoID):
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    try:
        if isPromoter == "True":
            bouncerIDs = request.json.get("bouncerID")
            for bouncerID in bouncerIDs:
                p = Promoter(db_config, id)
                p.setBouncer(bouncerID, eventoID)
        else:
            return {"message": "Non hai l'autorizzazione"}, 401

        return {"message": "Bouncer settato"}, 200
            
    except Exception as e:
        print(e)
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/getOldBouncers", methods=["GET"])
@jwt_required()
def getOldBouncers():
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    if isPromoter == "True": 
        try:
            p = Promoter(db_config, id)
            return p.getOldBouncers()
        except Exception as e:
            return {"message": f"Errore: {str(e)}"}, 500
    else:
        return {"message": "Non hai l'autorizzazione"}, 401

@app.route("/api/bouncerLavora/<eventoID>", methods=["GET"])
@jwt_required()
def bouncerLavora(eventoID):
    identity = get_jwt_identity()
    id, isPromoter = identity.split('_')
    if isPromoter == "True":
        return Promoter(db_config, id).bouncerLavora(eventoID)
    else:
        return {"message": "Non hai l'autorizzazione"}, 401
    
@app.route("/api/getEventsBouncer", methods=["GET"])
@jwt_required()
def getEventsBouncer():
    identity = get_jwt_identity()
    id, bouncer = identity.split('_')
    try:
        if bouncer == "bouncer":
            return Bouncer(db_config, id).getEvents()
        else:
            return {"data":[]}, 401
        
    except Exception as e:
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/scan", methods=["POST"])
@jwt_required()
def scan():
    try:
        identity = get_jwt_identity()
        id, bouncer = identity.split('_')
        if bouncer == "bouncer":
            eventoID = request.json.get("eventoID")
            matricola = request.json.get("matricola")
            if eventoID and matricola:
                return Bouncer(db_config, id).scanTicket(matricola, eventoID)
    except Exception as e:
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/calendar", methods=["GET"])
@jwt_required()
def calendar():
    try:
        identity = get_jwt_identity()
        id, isPromoter = identity.split('_')
        if isPromoter == "True":
            return Promoter(db_config, id).calendar(id)
        else:
            return {"message": "Non hai l'autorizzazione"}, 401
    except Exception as e:
        print(e)
        return {"message": f"Errore: {str(e)}"}, 500
    
@app.route("/api/recommender", methods=["GET"])
@jwt_required()
def recommender():
    try:
        identity = get_jwt_identity()
        id, isPromoter = identity.split('_')
        recommender = Recommender(db_config, id)
        eventi = [int(evento) for evento in recommender.generate_recommendations()]
        

        return {"suggeriti": eventi}

    except Exception as e:
        return {"message": f"Errore: {str(e)}"}, 500


    

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5328, debug=True)