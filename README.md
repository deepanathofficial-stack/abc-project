# ABC Consultant — Website

A consulting-firm website with an enquiry form (Name, Phone Number, Email ID).

- **Frontend:** HTML/CSS/JavaScript — `frontend/`
- **Backend:** Python (Flask) — `backend/`
- **Database:** MySQL, created via MySQL Workbench — `database/schema.sql`

## 1. Set up the database

1. Open **MySQL Workbench** and connect to your local MySQL server.
2. Open `database/schema.sql` and run it (the lightning-bolt icon).
   This creates the `abc_consultant` database and the `enquiries` table.

## 2. Run the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Open `app.py` and set your MySQL password in `DB_CONFIG`:

```python
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "your_mysql_password",   # <-- change this
    "database": "abc_consultant",
}
```

Then start the API:

```bash
python app.py
```

It runs at `http://localhost:5000`.

## 3. Run the frontend

Any static server works — simplest option:

```bash
cd frontend
python -m http.server 8000
```

Open `http://localhost:8000` in your browser.

> If you serve the frontend from a different host/port, update `API_BASE`
> at the top of `frontend/script.js` to match your backend's address.

## What's included

- A hero, services, and process section for ABC Consultant.
- An **Enquiry** section with a tabbed form (Name / Phone Number / Email ID)
  that validates input client-side and server-side, then saves it to MySQL.
- `GET /api/enquiries` — lists all saved enquiries (handy for an admin view).
- `GET /api/health` — simple health check.

## Folder structure

```
abc-consultant/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── app.py
│   └── requirements.txt
├── database/
│   └── schema.sql
└── README.md
```
