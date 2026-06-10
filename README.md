# Real Time Leaderboard

## descripcion

El proyecto Real-Time Leaderboard es un servicio backend diseñado para gestionar y mostrar tablas de posiciones en tiempo real para varios juegos. Proporciona un conjunto completo de características para la autenticación de usuarios, la gestión de juegos y el seguimiento de puntuaciones. Los usuarios pueden registrarse, iniciar sesión y enviar sus puntuaciones, que luego se utilizan para generar tablas de posiciones dinámicas. El servicio incluye mecanismos robustos de autenticación y autorización, lo que garantiza un acceso seguro a las rutas protegidas. Aprovecha tecnologías como TypeScript, NestJS, TypeORM, PostgreSQL y Redis para ofrecer un alto rendimiento y escalabilidad.

## Features

- Autenticación y autorización

  - Autenticación basada JWT con tokens de acceso y refresco
  - Hash seguro de contraseñas con bcrypt
  - Mecanismo de refresco de token

- Gestión de usuarios

  - Creación y consulta de usuarios

- Gestión de juegos

  - Operaciones CRUD para juegos
  - Descripción y metadatos de juegos

- Sistema de puntuaciones

  - Envío y validación de puntuaciones
  - Registro histórico de puntuaciones
  - Marcas de tiempo en puntuaciones
  - Filtrado de puntuaciones por rango de fechas
  - Reporte de mejores jugadores

- Sistema de leaderboards

  - Leaderboards globales para todos los juegos
  - Leaderboards específicas por juego
  - Cálculo de ranking por usuario
  - Reporte de mejores jugadores por juego
  - Consultas de leaderboard optimizadas con Valkey

- Gestión de datos

  - Base de datos PostgreSQL para almacenamiento persistente
  - Caché con Valkey para mayor rendimiento
  - TypeORM para operaciones de base de datos
  - Gestión de relaciones entre entidades

- Seguridad de la API

  - Manejo de errores y logging
  - Manejo personalizado de excepciones
  - Respuestas de error estandarizadas

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/
   ```
2. Navigate to the project directory:
   ```bash
   cd Real-Time-Leader
   ```
3. Setting Up a `.env` File

Para configurar las variables de entorno del proyecto, crea un archivo `.env` con los siguientes parámetros:

```env
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name

JWT_SECRET=your_jwt_secret
ACCESSTOKEN_LIFETIME=access_token_lifetime_in_seconds
REFRESHTOKEN_LIFETIME=refresh_token_lifetime_in_seconds

VALKEY_PASSWORD=your_valkey_password
VALKEY_HOST=your_valkey_host
VALKEY_PORT=your_valkey_port
```

Make sure to replace the placeholders with your actual credentials and values for the environment variables.

3. Install the dependencies:
   ```bash
   pnpm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm run start:dev
   ```
2. The application will be running at `http://localhost:3000`.

## Technology

- **TypeScript**
- **Node.js**
- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Valkey**
- **JWT**

## API Endpoints

### Auth

- **POST /auth/signup**
  - Description: Crea una nueva cuenta de usuario.
  - Body: `UserCreateDTO` (`name`, `correo`, `password`)

- **POST /auth/login**
  - Description: Inicia sesión del usuario y establece cookies de acceso y refresco.
  - Body: `UserLoginDTO` (`correo`, `password`)

- **POST /auth/refresh**
  - Description: Refresca el tiempo de la sesión utilizando la cookie `refresh_token`.
  - Headers: Cookie `refresh_token`

- **POST /auth/logout**
  - Description: Finaliza la sesión del usuario limpiando las cookies.
  - Headers: Cookie `access_token`

### User

- **GET /User/userRankings**
  - Description: Obtiene los rankings del usuario autenticado para todos los juegos.
  - Headers: Cookie `access_token`

- **GET /User/userRankings/:id**
  - Description: Obtiene el ranking del usuario autenticado para un juego específico por su ID.
  - Headers: Cookie `access_token`
  - Params: `id` (ID del juego)

- **GET /User/me**
  - Description: Obtiene la información del usuario actualmente autenticado.
  - Headers: Cookie `access_token`

- **GET /User/**
  - Description: Busca un usuario por su correo electrónico.
  - Query: `correo`

### Score

- **POST /score**
  - Description: Envía una puntuación para un juego.
  - Body: `SubmitScoreDTO` (`userId`, `gameId`, `points`)
  - Headers: Cookie `access_token`

- **GET /score/topPlayers**
  - Description: Obtiene un reporte de los mejores jugadores en un rango de fechas.
  - Query: `id`, `initDate`, `endDate`
  - Headers: Cookie `access_token`

- **GET /score**
  - Description: Obtiene la puntuación más alta para un juego específico.
  - Query: `idgame`
  - Headers: Cookie `access_token`

### Game

- **POST /game**
  - Description: Crea una nueva actividad o juego.
  - Body: `CreateGameDTO` (`name`, `description`)
  - Headers: Cookie `access_token`

- **GET /game/**
  - Description: Busca actividades por nombre.
  - Query: `name`
  - Headers: Cookie `access_token`

- **GET /game/:id**
  - Description: Busca una actividad por su ID.
  - Params: `id`
  - Headers: Cookie `access_token`

- **PATCH /game/:id**
  - Description: Actualiza una actividad existente por su ID.
  - Params: `id`
  - Body: `UpdateGameDto` (`name?`, `description?`)
  - Headers: Cookie `access_token`

- **DELETE /game/:id**
  - Description: Elimina una actividad por su ID.
  - Params: `id`
  - Headers: Cookie `access_token`

### Leaderboard

- **GET /leaderboard/**
  - Description: Obtiene todos los leaderboards disponibles.
  - Headers: Cookie `access_token`

- **GET /leaderboard/:idGame**
  - Description: Obtiene el leaderboard para un juego específico por su ID.
  - Params: `idGame`
  - Headers: Cookie `access_token`

- **POST /auth/refreshToken**

  - Description: Refresh the authentication token.
  - Body: `{ "refreshToken": "string" }`

- **POST /auth/logout**
  - Description: Log out the current user.
  - Headers: Cookie `access_token`

### User

- **GET /user**

  - Description: Find a user by email.
  - Query: `email`
  - Headers: Cookie `access_token`

- **PATCH /user/:id**

  - Description: Update a user by ID.
  - Params: `id`
  - Body: `UpdateUserDto`
  - Headers: Cookie `access_token`

- **DELETE /user/:id**

  - Description: Delete a user by ID.
  - Params: `id`
  - Headers: Cookie `access_token`

- **GET /user/me**

  - Description: Get the current logged-in user.
  - Headers: Cookie `access_token`

- **GET /user/ranking**

  - Description: Get the ranking of the current user for a specific game.
  - Query: `gameName`
  - Headers: Cookie `access_token`

- **GET /user/ranking/:gameName**
  - Description: Get the top players for a specific game.
  - Params: `gameName`
  - Headers: Cookie `access_token`

### Score

- **POST /score**

  - Description: Submit a score for a game.
  - Body: `CreateScoreDto`
  - Query: `gameName`
  - Headers: Cookie `access_token`

- **GET /score**

  - Description: Get the highest scores for a game.
  - Query: `gameName`
  - Headers: Cookie `access_token`

- **GET /score/top-players**
  - Description: Get a report of the top players for a game within a date range.
  - Query: `gameId`, `startDate`, `endDate`, `limit`
  - Headers: Cookie `access_token`

### Game

- **POST /game**

  - Description: Create a new game.
  - Body: `CreateGameDto`

- **GET /game/:id**

  - Description: Find a game by ID.
  - Params: `id`

- **GET /game**

  - Description: Find a game by name.
  - Query: `name`

- **PATCH /game/:id**

  - Description: Update a game by ID.
  - Params: `id`
  - Body: `UpdateGameDto`

- **DELETE /game/:id**
  - Description: Delete a game by ID.
  - Params: `id`

### Leaderboard

- **GET /leaderboard**

  - Description: Get the highest scores.
  - Headers: Cookie `access_token`

- **GET /leaderboard/game**
  - Description: Get the leaderboard for a specific game.
  - Query: `gameName`
  - Headers: Cookie `access_token`

## Project URL

https://roadmap.sh/projects/realtime-leaderboard-system
