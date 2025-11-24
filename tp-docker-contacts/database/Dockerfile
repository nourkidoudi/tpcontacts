FROM mysql:8.0

# Variables d'environnement
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=contacts_db

# Copier le script d'initialisation
COPY init.sql /docker-entrypoint-initdb.d/

# Exposer le port MySQL
EXPOSE 3306

