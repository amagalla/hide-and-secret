## Deploy to Dockerhub

Make sure you have production build ready

docker login (if not logged in)

``` sh
    docker build -f Dockerfile.prod -t hide-and-secret-server .
    docker tag hide-and-secret-server amagalla24/hide-and-secret-server:latest
    docker push amagalla24/hide-and-secret-server:latest
```

To test image

``` sh
    docker pull amagalla24/hide-and-secret-server:latest 
    docker run -d -p 3000:3000 amagalla24/hide-and-secret-server:latest
    docker ps
    docker stop <container_id>
```

## Create Knex Migrations

1. Be sure to be on server directory

2. Replace file_name to custom table name then run command below

```
    npx knex migrate:make file_name -x ts

```