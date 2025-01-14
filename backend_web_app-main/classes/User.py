from dotenv import load_dotenv
import bcrypt
import mysql.connector as mc
from functions.func import MySQL_to_JSON, get_indirizzo

# Carica le variabili d'ambiente dal file .env
load_dotenv()

class User:
    def __init__(self, db_config, email=None,
                 password=None, nome=None, cognome=None, ddn=None):
        self.nome = nome
        self.cognome = cognome
        self.email = email
        self.password = password
        self.ddn = ddn
        self.engine = None
        self.cursor = None
        
        try:
            self.engine = mc.connect(**db_config)
            self.cursor = self.engine.cursor()
        except Exception as e:
            raise ConnectionError(f"Errore nell'inizializzazione della connessione al database: {str(e)}")

    def _ensure_connection(self):
        """Verifica che la connessione al database sia attiva"""
        try:
            if not self.engine or not self.engine.is_connected():
                raise ConnectionError("Connessione al database persa")
        except Exception as e:
            raise ConnectionError(f"Errore di connessione al database: {str(e)}")

    def __getUser(self, role, id):
        try:
            self._ensure_connection()
            query = f"SELECT nome, cognome FROM {role} WHERE {role}ID = %s"
            self.cursor.execute(query, (id,))
            data = self.cursor.fetchall()
            
            if data:
                return {"nome": data[0][0], "cognome": data[0][1]}
            return None
        except Exception as e:
            raise Exception(f"Errore nel recupero dei dati utente: {str(e)}")

    def __getProfileImage(self, role, id):
        try:
            self._ensure_connection()
            query = f"SELECT imgProfilo FROM {role} WHERE {role}ID = %s"
            self.cursor.execute(query, (id,))
            data = self.cursor.fetchall()
            
            if data and data[0]:
                return data[0][0]
            return None
        except Exception as e:
            raise Exception(f"Errore nel recupero dell'immagine del profilo: {str(e)}")

    def signIn(self, role):
        try:
            self._ensure_connection()
            isPromoter = (role == "promoter")

            # Cripta la password
            encryptedPassword = bcrypt.hashpw(
                self.password.encode('utf-8'), 
                bcrypt.gensalt()
            ).decode('utf-8')

            # Controlla se l'email esiste già
            self.cursor.execute(
                f"SELECT COUNT(*) FROM {role} WHERE email = %s", 
                (self.email,)
            )
            if self.cursor.fetchone()[0] > 0:
                return False, {"message": "Email già registrata"}

            # Inserisci il nuovo utente
            query = f"""INSERT INTO {role}(nome, cognome, nascita, email, password) 
                     VALUES (%s, %s, %s, %s, %s)"""
            values = (self.nome, self.cognome, self.ddn, self.email, encryptedPassword)
            
            self.cursor.execute(query, values)
            self.engine.commit()
            
            # Ottieni l'ID utente
            self.cursor.execute(
                f"SELECT {role}ID FROM {role} WHERE email = %s",
                (self.email,)
            )
            id = self.cursor.fetchone()[0]
            
            return True, {
                "token": id,
                "isPromoter": isPromoter,
                "anagrafica": self.__getUser(role, id),
                "immagine": self.__getProfileImage(role, id)
            }
            
        except Exception as e:
            self.engine.rollback()
            return False, {"message": f"Errore durante la registrazione: {str(e)}"}

    def logIn(self, role: str):
        try:
            role = role.lower()
            self._ensure_connection()
            isPromoter = (role == "promoter")

            # Ottieni i dati utente
            query = f"SELECT password, {role}ID FROM {role} WHERE email = %s"
            self.cursor.execute(query, (self.email,))
            result = self.cursor.fetchone()

            if not result:
                return False, {"message": "Utente non trovato"}

            stored_password, id = result

            # Controlla la password
            if bcrypt.checkpw(self.password.encode('utf-8'),stored_password.encode('utf-8')):
                if role != "bouncer":
                    return True, {
                        "token": id,
                        "isPromoter": isPromoter,
                        "anagrafica": self.__getUser(role, id),
                        "immagine": self.__getProfileImage(role, id)
                    }
                else:
                    return True, {"token": id, "isPromoter": isPromoter}
            
            return False, {"message": "Credenziali non corrette"}
            
        except Exception as e:
            return False, {"message": f"Errore durante il login: {str(e)}"}

    def getProfile(self, id, isPromoter):
        try:
            self._ensure_connection()
            
            if isPromoter == "True":
                self.cursor.execute(
                    "SELECT COUNT(eventoID) FROM evento WHERE promoterID = %s",
                    (id,)
                )
                num_events = self.cursor.fetchone()[0]
                userType = "promoter"
            else:
                self.cursor.execute(
                    "SELECT COUNT(*) FROM user natural join ticket where userID = %s",
                    (id,)
                )
                num_events = self.cursor.fetchone()[0]
                userType = "user"

            return {"id": id, "numEventi" : num_events, "userType": userType, 
                    "anagrafica": self.__getUser(userType, id)}
            
        except Exception as e:
            return {"error": f"Errore nel recupero del profilo: {str(e)}"}

    def getID(self, email, role):
        try:
            self._ensure_connection()
            
            self.cursor.execute(
                f"SELECT {role}ID FROM {role} WHERE email = %s",
                (email,)
            )
            result = self.cursor.fetchone()
            
            if not result:
                return {"message": "Utente non trovato"}
                
            return result[0]
            
        except Exception as e:
            return {"error": f"Errore nel recupero dell'ID: {str(e)}"}

    def resetPassword(self, id, role, password):
        try:
            self._ensure_connection()
            
            encryptedPassword = bcrypt.hashpw(
                password.encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')
            
            self.cursor.execute(
                f"UPDATE {role} SET password = %s WHERE {role}ID = %s",
                (encryptedPassword, id)
            )
            self.engine.commit()
            
            return {"message": "Password aggiornata con successo"}
            
        except Exception as e:
            self.engine.rollback()
            return {"error": f"Errore nell'aggiornamento della password: {str(e)}"}

    def modifyProfile(self, id, isPromoter, nome, cognome, email):
        try:
            self._ensure_connection()
            
            userType = "promoter" if isPromoter == "True" else "user"
            updates = []
            values = []
            
            if nome:
                updates.append("nome = %s")
                values.append(nome)
                
            if cognome:
                updates.append("cognome = %s")
                values.append(cognome)
                
            if email:
                updates.append("email = %s")
                values.append(email)
                
            if not updates:
                return {"message": "Nessun dato da aggiornare"}
                
            query = f"UPDATE {userType} SET {', '.join(updates)} WHERE {userType}ID = %s"
            values.append(id)
            
            self.cursor.execute(query, tuple(values))
            self.engine.commit()
            
            return {"message": "Profilo modificato con successo"}
            
        except Exception as e:
            self.engine.rollback()
            return {"error": f"Errore nella modifica del profilo: {str(e)}"}

    def getEvent(self, id):
        try:
            self._ensure_connection()
            
            # Ottieni i dati dell'evento
            result_evento = MySQL_to_JSON(
                query="SELECT * FROM evento WHERE eventoID = %s",
                params=(id,),
                engine=self.engine
            )
            
            if not result_evento['data']:
                return {"message": "Evento non trovato"}, 404
                
            evento = result_evento['data'][0]
            
            # Converte la posizione
            try:
                lat, lon = map(str.strip, evento["luogo"].split(","))
                evento["luogo"] = get_indirizzo(lat, lon)
            except ValueError:
                return {"message": "Coordinate non valide"}, 400
                
            # Ottieni i pacchetti
            result_pacchetti = MySQL_to_JSON(
                query="SELECT * FROM pacchetto WHERE eventoID = %s",
                params=(id,),
                engine=self.engine
            )
            
            pacchetti = result_pacchetti.get('data', []) if result_pacchetti else []
            
            if not evento["isVisible"]:
                return {"message": "Evento non trovato"}, 404
                
            return {
                "data": {
                    "evento": evento,
                    "pacchetti": pacchetti
                }
            }, 200
            
        except Exception as e:
            return {"error": f"Errore nel recupero dell'evento: {str(e)}"}, 500
        
    def getAllEvents(self):
        try:
            self._ensure_connection()
            
            # Ottieni tutti gli eventi
            result = MySQL_to_JSON(query="SELECT * FROM evento WHERE isVisible", engine=self.engine, params=())
            
            if not result['data']:
                return {"message": "Nessun evento trovato"}, 404
            
                
            return {"data": result['data']}, 200
            
        except Exception as e:
            return {"error": f"Errore nel recupero degli eventi: {str(e)}"}, 500