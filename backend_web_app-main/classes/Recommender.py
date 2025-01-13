import mysql.connector as mc
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
from surprise import accuracy
import os
from dotenv import load_dotenv

load_dotenv()

class Recommender:
    def __init__(self, db_config, id):
        self.id = id
        
        try:
            self.engine = mc.connect(**db_config)
            self.cursor = self.engine.cursor()
        except Exception as e:
            raise ConnectionError(f"Errore nell'inizializzazione della connessione al database: {str(e)}")
        self.df = None
        self.model = None
        self.all_items = None
        self.trainset = None
        self.testset = None
        self._load_data()
        self._train_model()

    def _load_data(self):
        # Connessione al database MySQL
        query = """
        SELECT u.userID, e.eventoID, COUNT(t.ticketID) AS interaction_score FROM
        user u JOIN ticket t ON u.userID = t.userID JOIN pacchetto p ON t.pacchettoID = p.pacchettoID
        JOIN evento e ON p.eventoID = e.eventoID GROUP BY u.userID, e.eventoID;"""
        cursor = self.engine.cursor(dictionary=True)
        cursor.execute(query)
        data = cursor.fetchall()
        self.df = pd.DataFrame(data)
        cursor.close()
        self.engine.close()

        # Crea il formato per Surprise
        reader = Reader(rating_scale=(1, self.df['interaction_score'].max()))
        data = Dataset.load_from_df(self.df[['userID', 'eventoID', 'interaction_score']], reader)

        # Dividi i dati in training e test
        self.trainset, self.testset = train_test_split(data, test_size=0.2)

        # Lista di tutti gli eventi
        self.all_items = self.df['eventoID'].unique()

    def _train_model(self):
        # Crea e addestra il modello SVD
        self.model = SVD()
        self.model.fit(self.trainset)

    def evaluate_model(self):
        # Valutazione del modello
        predictions = self.model.test(self.testset)
        rmse = accuracy.rmse(predictions)
        return rmse

    def generate_recommendations(self, top_n=10):
        # Trova gli eventi non ancora interagiti dall'utente
        user_interactions = self.df[self.df['userID'] == self.id]['eventoID'].values
        unseen_items = [item for item in self.all_items if item not in user_interactions]

        # Prevedi i punteggi per gli eventi non ancora interagiti
        recommendations = []
        for item_id in unseen_items:
            pred = self.model.predict(self.id, item_id)
            recommendations.append((item_id, pred.est))

        # Ordina le raccomandazioni per punteggio
        recommendations.sort(key=lambda x: x[1], reverse=True)

        # Ritorna le top-N raccomandazioni
        return [item_id for item_id, _ in recommendations[:top_n]]
    