#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://localhost:3000/health}"

echo "Vérification de la santé sur : $URL"

HTTP_CODE=$(curl -s -o /tmp/health_response.json -w "%{http_code}" "$URL" || echo "000")

if [ "$HTTP_CODE" -ne 200 ]; then
  echo "ECHEC : Code HTTP reçu = $HTTP_CODE (attendu : 200)"
  exit 1
fi

if grep -q '"status":"UP"' /tmp/health_response.json; then
  echo "SUCCES : L'application et la base de données sont UP (HTTP 200)."
  exit 0
else
  echo "ECHEC : Réponse inattendue :"
  cat /tmp/health_response.json
  exit 1
fi
