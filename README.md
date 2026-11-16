# STRUCTURE – Architecture & Design (React + Django + Claude)

- `src/`      React + Vite + Tailwind website
- `backend/`  Django + Django REST Framework API with Claude integration

## 1. Backend (Django) – terminal 1
Requires Python 3.10+.

    cd backend
    python -m venv venv
    venv\Scripts\activate          (Mac/Linux: source venv/bin/activate)
    pip install -r requirements.txt
    copy .env.example .env         (Mac/Linux: cp .env.example .env)
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py test
    python manage.py runserver

Open http://127.0.0.1:8000/admin to read enquiries.
Put your Claude key in `backend/.env` as ANTHROPIC_API_KEY (https://console.anthropic.com).
Without a key the site still works: enquiries are saved, the chat shows a "call us" message.

## 2. Frontend (React) – terminal 2

    npm install
    npm run dev

Open http://localhost:5173. The contact form and chat widget talk to Django automatically.

## What Claude does
- Chat assistant (bottom-right): answers visitors' questions about the studio. POST /api/chat/
- Enquiry triage: each enquiry gets an AI summary, priority and a drafted reply in the admin.
  POST /api/enquiries/  (admin action "Re-run Claude analysis" retries failed ones)

## Going live
- Frontend: `npm run build`, upload `dist` to Netlify/Vercel. Set VITE_API_URL to your backend URL.
- Backend: host on Render/PythonAnywhere, set DJANGO_DEBUG=False, a real DJANGO_SECRET_KEY,
  DJANGO_ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS (your frontend URL) and ANTHROPIC_API_KEY.
- MySQL: set DB_ENGINE=mysql and the DB_* values, and `pip install mysqlclient`.
