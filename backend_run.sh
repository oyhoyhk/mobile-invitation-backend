docker build -t mysql .
docker run -d -p 3306:3306 --name mysql mysql