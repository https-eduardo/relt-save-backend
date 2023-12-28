# Relt Save Backend

[Relt Save](https://github.com/ReltSave) is an mobile application that manages user's finances, generating reports based on his transactions.
In this repository, you can see the code of the API (backend).

This application was developed as a Final Work as a partial requirement for approval in the course of computer technician at IFPR (Federal Institute of Paraná).

### 👩‍💻 Technologies used

- Nest.js
- PrismaORM
- PostgresSQL
- Passport (for OAuth 2.0 and JWT authentication)

### ⏳ Future plans

- Add endpoints documentation by using Swagger
- Global code refactor
- Implement rate limiter
- Add unit tests and finish adding E2E tests

### 🚀 How to run

First, ensure your node version is the same as the inside `.nvmrc`. You'll also need to set the enviroment variables at `.env`, following the `.env.example`.

After that, you can install the necessary modules using the command:

```bash
yarn install
```

Now, you can run the app in any mode:

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

You also can run the tests (E2E only, for now):

```bash
# e2e tests
$ yarn run test:e2e
```
