chatbot/
├── backend/                        # Python FastAPI
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── chatbots.py         # CRUD chatbots + analyse auto
│   │   │   ├── conversations.py    # Chat IA via Claude
│   │   │   ├── billing.py          # Stripe checkout/webhook/portal
│   │   │   └── users.py            # Profil utilisateur
│   │   ├── core/
│   │   │   ├── config.py           # Settings + limites par plan
│   │   │   └── firebase.py         # Init Firebase Admin
│   │   ├── middleware/auth.py       # Vérification token Firebase
│   │   ├── models/schemas.py       # Pydantic models
│   │   ├── services/
│   │   │   ├── scraper.py          # Analyse automatique de site
│   │   │   └── chat.py             # Génération réponses IA
│   │   └── main.py                 # Point d'entrée FastAPI
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                       # Next.js 15 + TypeScript
│   └── src/
│       ├── app/
│       │   ├── page.tsx            # Landing page
│       │   ├── auth/login/         # Connexion
│       │   ├── auth/register/      # Inscription
│       │   └── dashboard/
│       │       ├── page.tsx        # Liste des chatbots + stats
│       │       ├── chatbots/new/   # Création en 4 étapes
│       │       ├── chatbots/[id]/  # Configuration + preview
│       │       ├── billing/        # Plans + Stripe
│       │       └── settings/       # Profil utilisateur
│       ├── components/
│       │   ├── ui/                 # Button, Card, Input, Badge, Spinner
│       │   ├── chatbot/            # ChatbotPreview
│       │   └── layout/             # DashboardLayout + sidebar
│       ├── lib/                    # Firebase, API client, utils
│       ├── hooks/                  # useAuth
│       └── types/                  # TypeScript types
├── widget/widget.js                # Widget JS intégrable (standalone)
└── firebase/
    ├── firestore.rules             # Règles de sécurité
    ├── firestore.indexes.json      # Index Firestore
    └── storage.rules               # Règles Storage