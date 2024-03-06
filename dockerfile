# Use the official MySQL image from Docker Hub
FROM mysql:latest

# Set environment variables for MySQL root user and password
ENV MYSQL_ROOT_PASSWORD=1234
ENV MYSQL_DATABASE=wedding

# Copy custom SQL scripts to initialize the database
COPY init.sql /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306