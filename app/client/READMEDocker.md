## Deploy to Dockerhub

Make sure you have production build ready

docker login (if not logged in)

For Client

To Test Locally

``` sh
    docker build -f Dockerfile.prod --build-arg VITE_API=http://localhost:3000/api/ -t hide-and-secret-client .
    docker run -d -p 80:80 hide-and-secret-client
```

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

To check inside image

``` sh
    docker run -it hide-and-secret-client sh
```