# Marketing Lead Assistant

CRM personale leggero per lead AppStream / marketing, con Google Sheets come archivio e OpenAI per generare messaggi commerciali.

## Funzioni
- Login semplice con password
- Dashboard tema scuro
- Inserimento lead
- Lettura/scrittura su Google Sheet
- Generazione WhatsApp, email, script chiamata, follow-up e risposta obiezione
- Salvataggio storico messaggi generati

## Google Sheet richiesto
Crea un file Google Sheet con due tab:

### Leads
ID | Data inserimento | Nome attività | Settore | Città | Sito web | Telefono | Email | Referente | Servizio da proporre | Stato lead | Note | Ultimo contatto | Prossimo follow-up | Firmato da

### Storico
ID | Data | Lead ID | Nome attività | Tipo messaggio | Servizio proposto | Testo generato | Firmato da

## Variabili ambiente Vercel
Copia `.env.example` e configura:

- APP_PASSWORD
- OPENAI_API_KEY
- GOOGLE_SHEET_ID
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PRIVATE_KEY

## Nota Google Sheet
Condividi il Google Sheet con l'email del service account Google, dando permesso Editor.
