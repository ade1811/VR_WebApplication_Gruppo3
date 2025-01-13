import mysql.connector as mc
from datetime import datetime
from functions.func import genera_matricola, send_email
import qrcode as qc
from PIL import Image, ImageDraw, ImageFont
import os

class Ticket:
    def __init__(self, db_config) -> None:
        """Inizializza la classe Ticket con la connessione al database e il cursore"""
        self.output_folder = "C:\\Users\\ade59\\Documents\\webapp\\tickets"
        os.makedirs(self.output_folder, exist_ok=True)
        self.engine = None
        self.cursor = None
        
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

    def __checkMatricola(self, matricola: str) -> bool:
        """Controlla se una matricola esiste già nel database"""
        try:
            self._ensure_connection()
            query = "SELECT COUNT(*) FROM Ticket WHERE matricolaQr = %s"
            self.cursor.execute(query, (matricola,))
            return self.cursor.fetchone()[0] > 0
        except Exception as e:
            raise Exception(f"Errore durante il controllo della matricola: {str(e)}")

    def __genQR(self, matricole: list, pacchetti: list) -> None:
        """Genera codici QR e un PDF contenente i biglietti"""
        qr_images = []
        
        try:
            for i, matricola in enumerate(matricole):
                # Crea il codice QR
                qr = qc.QRCode(
                    version=2,
                    error_correction=qc.constants.ERROR_CORRECT_L,
                    box_size=10,
                    border=4
                )
                qr.add_data(matricola)
                qr.make(fit=True)
                
                # Crea l'immagine del QR
                qr_img = qr.make_image(fill_color="black", back_color="white").convert('RGB')
                qr_width, qr_height = qr_img.size
                
                # Crea uno sfondo con padding
                padding = 20
                title_height = 40
                total_height = qr_height + title_height + (padding * 2)
                total_width = qr_width + (padding * 2)
                background = Image.new('RGB', (total_width, total_height), 'white')
                
                # Posiziona il codice QR
                background.paste(qr_img, (padding, title_height + padding))
                
                # Aggiungi il testo
                draw = ImageDraw.Draw(background)
                try:
                    font = ImageFont.truetype("arial.ttf", 20)
                except:
                    font = ImageFont.load_default()
                
                # Centra il testo
                text = pacchetti[i]
                text_w = draw.textlength(text, font=font)
                text_x = (total_width - text_w) // 2
                draw.text((text_x, padding), text, font=font, fill='black')
                
                # Salva l'immagine temporanea
                img_path = os.path.join(self.output_folder, f"ticket_{matricola}.jpg")
                background.save(img_path, quality=95)
                qr_images.append(Image.open(img_path))
            
            # Crea un PDF con tutte le immagini
            if qr_images:
                pdf_path = os.path.join(self.output_folder, "tickets.pdf")
                qr_images[0].save(
                    pdf_path,
                    "PDF",
                    save_all=True,
                    append_images=qr_images[1:],
                    resolution=300
                )
                
        except Exception as e:
            raise Exception(f"Errore durante la generazione dei codici QR: {str(e)}")
        finally:
            # Elimina le immagini temporanee
            for img in qr_images:
                img.close()
            for matricola in matricole:
                try:
                    os.remove(os.path.join(self.output_folder, f"ticket_{matricola}.jpg"))
                except:
                    pass

    def createTicket(self, userID: int, data) -> None:
        """Crea biglietti per un utente"""
        matricole = []
        pacchetto = []
        
        try:
            self._ensure_connection()
            
            for dato in data:
                for _ in range(dato["quantita"]):
                    # Genera una matricola unica
                    matricola = genera_matricola()
                    while self.__checkMatricola(matricola):
                        matricola = genera_matricola()
                    
                    matricole.append(matricola)
                    pacchetto.append(dato["titolo"])
                    
                    # Inserisce il biglietto nel database
                    current_date = datetime.now().strftime('%Y-%m-%d')
                    query = """
                        INSERT INTO Ticket (matricolaQr, userID, pacchettoID, prezzo, data) 
                        VALUES (%s, %s, %s, %s, %s)
                    """
                    values = (matricola, userID, dato["pacchettoID"], dato["prezzo"], current_date)
                    self.cursor.execute(query, values)
                    self.engine.commit()

            # Genera i codici QR e il PDF
            self.__genQR(matricole, pacchetto)
            
            # Invia l'email con i biglietti
            email_path = os.path.join(self.output_folder, "tickets.pdf")
            if os.path.exists(email_path):
                send_email(
                    "Ticket acquistati :)", 
                    "I tuoi ticket sono stati acquistati con successo",
                    "ade593401@gmail.com",
                    email_path
                )
            else:
                raise Exception("File PDF dei biglietti non generato")
                
        except Exception as e:
            self.engine.rollback()
            raise Exception(f"Errore durante la creazione dei biglietti: {str(e)}")