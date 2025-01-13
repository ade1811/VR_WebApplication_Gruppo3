from functions.func import MySQL_to_JSON, get_regione, get_indirizzo, send_email
import mysql.connector as mc
from datetime import datetime
import secrets
import string
import bcrypt

class Promoter():
    def __init__(self, db_config, id) -> None:
        self.id = id


        try:
            self.engine = mc.connect(**db_config)
            self.cursor = self.engine.cursor()
        except Exception as e:
            raise ConnectionError(f"Errore nell'inizializzazione della connessione al database: {str(e)}")

    def _ensure_connection(self) -> None:
        """Verifica che la connessione al database sia attiva"""
        try:
            if not self.engine or not self.engine.is_connected():
                raise ConnectionError("Connessione al database persa")
        except Exception as e:
            raise ConnectionError(f"Errore di connessione al database: {str(e)}")

    def dashboard(self) -> tuple:
        # riempimento: persone che hanno comprato il biglietto / posti_totali
        riempimento_amount: float = 0
        profit_amount: float = 0
        num_amount: int = 0
        total_amount: int = 0

        # num
        query = "SELECT COUNT(eventoID) from evento where promoterID = %s"
        self.cursor.execute(query, (self.id,))
        num_amount = self.cursor.fetchall()[0][0]

        # DATA
        if not num_amount:
            num_amount = 0

        if num_amount > 0:

            # riempimento
            query = """
                SELECT AVG(nro_ticket * 1.0 / nro_posti) AS media_rapporto
                FROM (
                    SELECT e.nroPosti AS nro_posti, COUNT(t.ticketID) AS nro_ticket
                    FROM evento e
                    LEFT JOIN pacchetto p ON e.eventoID = p.eventoID
                    LEFT JOIN ticket t ON p.pacchettoID = t.pacchettoID
                    WHERE e.promoterID = %s
                    GROUP BY e.eventoID, e.nroPosti
                ) AS riempimento_subquery;
                """
            self.cursor.execute(query, (self.id,))

            riempimento_amount = float(self.cursor.fetchall()[0][0])

            # profit
            query = """SELECT SUM(p.prezzo) AS guadagno_totale FROM ticket t JOIN 
            pacchetto p ON t.pacchettoID = p.pacchettoID JOIN evento e ON p.eventoID = e.eventoID
            WHERE e.promoterID = %s AND e.data = (SELECT MAX(data) FROM evento WHERE promoterID = %s);"""
            self.cursor.execute(query, (self.id, self.id))

            profit_amount = self.cursor.fetchall()[0][0]

            # total
            query = """SELECT SUM(t.prezzo) AS guadagno_totale FROM ticket t JOIN pacchetto p ON 
            t.pacchettoID = p.pacchettoID JOIN evento e ON p.eventoID = e.eventoID
            WHERE e.promoterID = %s;"""
            self.cursor.execute(query, (self.id,))

            total_amount = self.cursor.fetchall()[0][0]

        # GRAFICI
        query = """SELECT e.titolo, SUM(t.prezzo) AS guadagno_evento FROM 
        evento e JOIN pacchetto p ON e.eventoID = p.eventoID JOIN ticket t ON p.pacchettoID = t.pacchettoID 
        WHERE e.promoterID = %s GROUP BY e.eventoID, e.titolo;"""
        self.cursor.execute(query, (self.id,))
        grafico = self.cursor.fetchall()

        # Preparazione dati per i grafici
        chart_series = {"name": "Andamento eventi", "data": [float(guadagno[1]) for guadagno in grafico]}

        data = {
            "data": {
                "riempimento": {
                    "title": "Tasso di Riempimento",
                    "amount": f"{riempimento_amount}%",
                    "percentage": "+6.3%"
                },
                "profit": {
                    "title": "Ricavo dell'ultimo evento",
                    "amount": f"{profit_amount}$",
                    "percentage": "+73% dal penultimo evento"
                },
                "num": {
                    "title": "Num Eventi",
                    "amount": f"{num_amount}",
                },
                "total": {
                    "title": "Ricavo totale eventi",
                    "amount": f"{total_amount}$",
                    "percentage": "-6.8%"
                }
            },
            "grafici": chart_series
        }
        return data, 200

    
    def getEvents(self) -> tuple:
        query = "SELECT * FROM evento WHERE promoterID = %s"
        data = MySQL_to_JSON(query = query, params = (self.id,),engine = self.engine)

        if data is None:
            return {"message": "Errore nel DB"}, 500
        else:
            return data, 200      
        
    def createEvent(self, evento, file_name)-> dict:
        titolo = evento["title"]
        nroPosti = evento["n_posti"]
        luogo = evento["location"]
        data = evento["date"]
        descrizione = evento["description"]
        genere = evento["genere"]
        ora = evento["time"]
        isEcologic = evento["isEcologic"]
        #image = evento["image"] if evento["image"] is not None else ''

        print(self.id)
        query = """INSERT INTO evento (titolo, nroPosti, luogo, data, descrizione, genere, ora, promoterID, copertina, isEcologic) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
        self.cursor.execute(query, (titolo, nroPosti, luogo, data, descrizione, genere, ora, self.id, file_name, isEcologic))
        self.engine.commit()
        eventoID = self.cursor.lastrowid
        self.engine.close()
        

        return True, eventoID

    def setPacchetti(self,eventoID, titolo: str, prezzo: float, descrizione: str):
        query = "INSERT INTO pacchetto (titolo, prezzo, descrizione, eventoID) VALUES (%s, %s, %s, %s)"
        self.cursor.execute(query, (titolo, prezzo, descrizione, eventoID))
        self.engine.commit()
        self.engine.close()

        return True
    
    def modifyEvent(self, eventoID: int, titolo: str  = None, nroPosti: int = None, luogo: str = None, 
                    data: str = None, descrizione: str = None, genere: str = None, ora: str = None) -> tuple:
        query_parts = []
        values = ()

        if eventoID:
            if titolo is not None and titolo != "":
                query_parts.append("titolo = %s")
                values += (titolo,)
            
            if nroPosti is not None and nroPosti != "":
                query_parts.append("nroPosti = %s")
                values += (nroPosti,)
            
            if luogo is not None and luogo != "":
                query_parts.append("luogo = %s")
                values += (luogo,)
            
            if data is not None and data != "":
                query_parts.append("data = %s")
                values += (data,)
            
            if descrizione is not None and descrizione != "":
                query_parts.append("descrizione = %s")
                values += (descrizione,)
            
            if genere is not None and genere != "":
                query_parts.append("genere = %s")
                values += (genere,)
            
            if ora is not None and ora != "":
                query_parts.append("ora = %s")
                values += (ora,)
        
        else:
            return {"message": "Errore nella ricezione dei dati"}, 500

        #fai il join degi parametri aggiungendo la virgola dove serve
        query_set = ", ".join(query_parts)

        try:
            values += (eventoID,)
            query = f"UPDATE evento SET {query_set} WHERE eventoID = %s"
            self.cursor.execute(query, values)
            self.engine.commit()
            print(query, values)
            self.engine.close()
            return {"message": "Profilo modificato con successo"}
        except mc.Error as e:
            print(f"Errore database o nella ricezione dei dati: {e}")
            return {"message": "Errore database o nella ricezione dei dati" + str(e)}
        
    def regione(self, regione: str):
        regione = regione.lower()
        eventi_regione: int = 0
        partecipanti: int = 0
        data_corrente = datetime.now()

        # Ottieni i generi unici dal database
        self.cursor.execute("SELECT DISTINCT genere FROM evento")
        generi = [row[0] for row in self.cursor.fetchall()]
        genere_valore = {genere: 0 for genere in generi}
        
        # Query per ottenere i luoghi
        query = f"""SELECT DISTINCT luogo, eventoID, genere FROM evento WHERE MONTH(data) = {data_corrente.month} 
        AND YEAR(data) = {data_corrente.year}"""
        self.cursor.execute(query)
        datas = self.cursor.fetchall()

        for dato in datas:
            pos, id, genere = dato
            lat, lon = pos.split(",")
            lat = lat.strip()
            lon = lon.strip()
            
            if get_regione(lat, lon) == regione:
                eventi_regione += 1
                query = """SELECT COUNT(t.ticketID) FROM ticket t 
                    JOIN pacchetto p ON t.pacchettoID = p.pacchettoID
                    WHERE p.eventoID = %s"""
                self.cursor.execute(query, (id,))
                partecipanti += self.cursor.fetchall()[0][0]
                genere_valore[genere] += 1
            
            gen = sorted(genere_valore.items(), key=lambda x:x[1], reverse=True)
            gen_labels = [item[0] for item in gen]
        
        return eventi_regione, partecipanti, gen_labels
    
    def changeVisibility(self, eventID: int) -> tuple:
        query = "SELECT isVisible FROM evento WHERE eventoID = %s"
        self.cursor.execute(query, (eventID,))  
        isVisible = self.cursor.fetchall()[0][0]
        isVisible = 0 if isVisible else 1

        query = "UPDATE evento SET isVisible = %s WHERE eventoID = %s"
        self.cursor.execute(query, (isVisible, eventID,))
        self.engine.commit()
        self.engine.close()
        return {"message": "Visibilità cambiata con successo"}, True
    
    def getEvent(self, id):
        try:
            # Get evento
            query_evento = "SELECT * FROM evento WHERE eventoID = %s AND promoterID = %s"
            result_evento = MySQL_to_JSON(query=query_evento, params=(id, self.id), engine=self.engine)

            if not result_evento['data']:
                return {"message": "Evento non trovato"}, 404
                
            evento = result_evento['data'][0]
            
            # Converti cordinate in indirizzo
            try:
                lat, lon = evento["luogo"].split(",")
                evento["luogo"] = get_indirizzo(lat.strip(), lon.strip())
            except ValueError:
                return {"message": "Coordinate non valide"}, 400
                
            # Get pacchetti
            query_pacchetti = "SELECT * FROM pacchetto WHERE eventoID = %s"
            result_pacchetti = MySQL_to_JSON(query=query_pacchetti, params=(id,), engine=self.engine)
            pacchetti = result_pacchetti['data'] if result_pacchetti['data'] else []
            
            data = {
                "evento": evento,
                "pacchetti": pacchetti
            }

            return {"data": data}, 200
            
        except Exception as e:
                print(f"Error: {str(e)}")
                return {"message": "Errore nel recupero dei dati"}, 500
        
    def getTicket(self, id):
        query = """SELECT ticketID, isScanned, u.nome, u.cognome, t.data, t.prezzo, p.titolo FROM 
        ticket t join pacchetto p on p.pacchettoID = t.pacchettoID join user u on u.userID = t.userID
        join evento e on p.eventoID = e.eventoID join 
        promoter pr on e.promoterID = pr.promoterID and pr.promoterID = %s where e.eventoID = %s"""
        data = MySQL_to_JSON(query=query, params=(self.id, id), engine=self.engine)
        
        return data, 200

    def createBouncer(self, email: str, eventID: int):
        self._ensure_connection()
        try:
            length = 8
            alphabet = string.ascii_letters + string.digits + string.punctuation
            password = ''.join(secrets.choice(alphabet) for _ in range(length))
            
            encryptedPassword = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

            query = "SELECT COUNT(*) FROM bouncer WHERE email = %s"
            self.cursor.execute(query, (email,))
            if self.cursor.fetchone()[0] == 0:
                query = "INSERT INTO bouncer (email, password) VALUES (%s, %s)"
                self.cursor.execute(query, (email, encryptedPassword))    

            query = "INSERT INTO bouncer_lavorare_evento (bouncerID, eventoID) VALUES (%s, %s)"
            self.cursor.execute(query, (self.cursor.lastrowid, eventID))
            

            send_email(oggetto= "Da oggi sei un bouncer", body= f"La tua password è: {password}", to_email= email)
        except Exception as e:
            self.engine.rollback()
        finally:
            self.engine.commit()
            self.engine.close()
        
        return {"message": "Bouncer creato"}, 200
    
    def getOldBouncers(self):
        try:
            self._ensure_connection()
            query = """SELECT DISTINCT b.bouncerID, email FROM bouncer_lavorare_evento ble JOIN evento e ON ble.eventoID = e.eventoID JOIN
                        bouncer b ON b.bouncerID = ble.bouncerID WHERE e.promoterID = %s"""
            data = MySQL_to_JSON(query=query, params=(self.id,), engine=self.engine)
            return data, 200
        except Exception as e:
            self.engine.rollback()
            print(f"Error: {str(e)}")
            return {"message": "Errore nel recupero dei dati"}, 500
        
    def setBouncer(self, bouncerID:int, eventoID:int):
        try:
            self._ensure_connection()
            query = "INSERT INTO bouncer_lavorare_evento (bouncerID, eventoID) VALUES (%s, %s)"
            self.cursor.execute(query, (bouncerID, eventoID))
            self.engine.commit()
            self.engine.close()
            return {"message": "Bouncer aggiunti"}, 200
        except Exception as e: 
            self.engine.rollback()
            print(f"Error: {str(e)}")
            return {"message": "Errore nel recupero dei dati"}, 500
    
    def bouncerLavora(self, eventoID):
        try:
            self._ensure_connection()
            query = """SELECT bouncerID FROM bouncer_lavorare_evento WHERE eventoID = %s"""
            data = MySQL_to_JSON(query=query, params=(eventoID,), engine=self.engine)
            return data, 200
        except Exception as e:
            self.engine.rollback()
            print(f"Error: {str(e)}")
            return {"message": "Errore nel recupero dei dati"}, 500
        
    def calendar(self, id):
        query = "SELECT * FROM evento WHERE  promoterID = %s "
        data = MySQL_to_JSON(query=query, params=(id,), engine=self.engine)
        if not data['data']:
            return {"message": "Evento non trovato"}, 404
                
        for evento in data["data"]:
            try:
                lat, lon = evento["luogo"].split(",")
                evento["luogo"] = get_indirizzo(lat.strip(), lon.strip())
            except ValueError:
                return {"message": "Coordinate non valide"}, 400
            
        query = "SELECT COUNT(*)as num, data FROM evento WHERE MONTH(data) = %s AND YEAR(data) = %s GROUP BY data"
        eventi_data = MySQL_to_JSON(query, (datetime.now().month, datetime.now().year), self.engine)

        data = {"eventi": data["data"], "eventi_data": eventi_data["data"]}
        
        return data, 200