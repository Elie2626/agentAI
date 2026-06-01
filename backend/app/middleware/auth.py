from fastapi import Request, HTTPException
from firebase_admin import auth


async def verify_firebase_token(request: Request) -> dict:
    authorization = request.headers.get("Authorization")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token manquant")

    token = authorization.split("Bearer ")[1]
    try:
        decoded = auth.verify_id_token(token)
        return decoded
    except auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
    except auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except Exception:
        raise HTTPException(status_code=401, detail="Authentification échouée")
