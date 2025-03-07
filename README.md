# Hide&Secret

This is the official Hide&Secret source code. Thank you all for contributing to this fun project 🙏 Now go and Hide & Secret!

## Ask Admin for .env
1. Ask the admin for .env files to run applications

## Application Layout

1. Frontend and Backend files are in the `App` directory:

- Frontend: `client` directory
- Mobile: `mobile` directory
- Backend: `server` directory

## Run Mobile application

1. Run mobile either on android or ios emulater (Make sure react native tools are installed)

```sh
    npm run android
    npm run ios
```

## Run React and Node server through docker-compose

```sh
    npm run serve
```

## Use MySQL Terminal

1. Run the server

2. Use password found in .env

```
    npm run mysql
```

## Swagger UI Docs

1. Swagger UI Docs are found on http://localhost:3000/admin/swagger/

2. Username is Admin username and password is found in server/.env