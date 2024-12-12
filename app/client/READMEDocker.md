## Deploy to Dockerhub

Make sure you have production build ready

docker login (if not logged in)

For Client

``` sh
     docker build -f Dockerfile.prod -t hide-and-secret-client .
     docker tag hide-and-secret-client amagalla24/hide-and-secret-client:latest
     docker push amagalla24/hide-and-secret-client:latest
```
To test image

``` sh
    docker pull amagalla24/hide-and-secret-client:latest
    docker run -d -p 8080:80 amagalla24/hide-and-secret-client:latest
    docker ps
    docker stop <container_id>
```