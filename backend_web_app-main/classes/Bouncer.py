import mysql.connector as mc
from functions.func import MySQL_to_JSON

class Bouncer():
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
        
    def getEvents(self):
        try:
            self._ensure_connection()
            query = """SELECT * FROM bouncer_lavorare_evento ble JOIN evento e ON ble.eventoID  = e.eventoID
            WHERE bouncerID = %s"""
            data = MySQL_to_JSON(query, (self.id,), self.engine)
            return data, 200
        except Exception as e:
            raise Exception(f"Errore durante il recupero degli eventi: {str(e)}")
        
    def scanTicket(self, matricola: str, eventoID: int) -> tuple:
        """Controlla se un biglietto è già stato scansionato"""
        try:
            self._ensure_connection()
            query = """SELECT isScanned FROM Ticket NATURAL JOIN Pacchetto 
            WHERE matricolaQr = %s AND pacchetto.eventoID = %s """
            self.cursor.execute(query, (matricola, eventoID))
            result = self.cursor.fetchone()[0]

            if result == 0:
                query = "UPDATE Ticket SET isScanned = 1 WHERE matricolaQr = %s"
                self.cursor.execute(query, (matricola,))
                return {"message": "Può entrare"}, 200
            elif result is None:
                return {{"message": "Riprova"}}, 404  # Biglietto non trovato
            else:
                return {"message": "Biglietto già scansionato"}, 403
            
        except Exception as e:
            print(e)
            self.engine.rollback()
            return  {"message": "Il biglietto non esiste"}, 500  # Errore del server
        finally:
            self.engine.commit()
            self.engine.close()