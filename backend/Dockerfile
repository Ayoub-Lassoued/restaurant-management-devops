# Image légère Node.js 22
FROM node:22-alpine

# Répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers de dépendances pour profiter du cache Docker
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# Copier le reste du code source avec les droits pour l'utilisateur non-root "node"
COPY --chown=node:node . .

# Passer à l'utilisateur non-root (sécurité)
USER node

# Port exposé par l'API
EXPOSE 3000

# Vérification de santé intégrée (HEALTHCHECK)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

# Démarrer le serveur
CMD ["node", "server.js"]
