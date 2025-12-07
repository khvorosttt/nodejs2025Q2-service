# Home Library Service

REST API service for managing your home music library. Built with NestJS, this service allows you to manage artists, albums, tracks, and favorites.

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker Desktop - [Download & Install Docker Desktop](https://www.docker.com/products/docker-desktop/).

## Downloading

```
git clone {repository URL}
```

## Switch to development branch
```
git checkout home-library-service-part-2
```

## Installing NPM modules

```
npm install
```

## If you encounter peer dependency conflicts, install with

```
npm install --legacy-peer-deps
```

## Configure environment variables
```
cp .env.example .env
```

## Start with Docker Compose (recommended)
```
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

## Apply database migrations
```
# In a new terminal, run migrations
docker-compose exec app npx prisma migrate deploy

# Or for development
docker-compose exec app npx prisma db push
```

## Generate Prisma Client
```
# Generate TypeScript client for database access
docker-compose run --rm app npx prisma generate
```

## Local Development with Docker Database (Recommended for Dev)
```
# 1. Start only the PostgreSQL database in Docker
docker-compose up postgres -d

# 2. Configure environment for local development
cp .env.example .env
# Edit .env and set:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/home_library

# 3. Install dependencies
npm install

# 4. Generate Prisma Client
npx prisma generate

# 5. Apply database migrations
npx prisma migrate deploy

# 6. Start the application locally
npm run start:dev

# 7. Test application
npm run test
```

## Running application

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

## API Specification

**Details:**

  * `Users` (`/user` route)
    * `GET /user` - get all users
      - Server should answer with `status code` **200** and all users records
    * `GET /user/:id` - get single user by id
      - Server should answer with `status code` **200** and and record with `id === userId` if it exists
      - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    * `POST /user` - create user (following DTO should be used)
      `CreateUserDto`
      ```typescript
          interface CreateUserDto {
            login: string;
            password: string;
          }
      ```
        - Server should answer with `status code` **201** and newly created record if request is valid
        - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    * `PUT /user/:id` - update user's password
      `UpdatePasswordDto` (with attributes):
      ```typescript
      interface UpdatePasswordDto {
        oldPassword: string; // previous password
        newPassword: string; // new password
      }
      ```
      - Server should answer with` status code` **200** and updated record if request is valid
      - Server should answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
      - Server should answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
      - Server should answer with` status code` **403** and corresponding message if `oldPassword` is wrong
    * `DELETE /user/:id` - delete user
      - Server should answer with `status code` **204** if the record is found and deleted
      - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist

  * `Tracks` (`/track` route)
    * `GET /track` - get all tracks
      - Server should answer with `status code` **200** and all tracks records
    * `GET /track/:id` - get single track by id
      - Server should answer with `status code` **200** and and record with `id === trackId` if it exists
      - Server should answer with `status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === trackId` doesn't exist
    * `POST /track` - create new track
      - Server should answer with `status code` **201** and newly created record if request is valid
      - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    * `PUT /track/:id` - update track info
      - Server should answer with` status code` **200** and updated record if request is valid
      - Server should answer with` status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
      - Server should answer with` status code` **404** and corresponding message if record with `id === trackId` doesn't exist
    * `DELETE /track/:id` - delete track
      - Server should answer with `status code` **204** if the record is found and deleted
      - Server should answer with `status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === trackId` doesn't exist

  * `Artists` (`/artist` route)
    * `GET /artist` - get all artists
      - Server should answer with `status code` **200** and all artists records
    * `GET /artist/:id` - get single artist by id
      - Server should answer with `status code` **200** and and record with `id === artistId` if it exists
      - Server should answer with `status code` **400** and corresponding message if `artistId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === artistId` doesn't exist
    * `POST /artist` - create new artist
      - Server should answer with `status code` **201** and newly created record if request is valid
      - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    * `PUT /artist/:id` - update artist info
      - Server should answer with` status code` **200** and updated record if request is valid
      - Server should answer with` status code` **400** and corresponding message if `artist` is invalid (not `uuid`)
      - Server should answer with` status code` **404** and corresponding message if record with `id === artistId` doesn't exist
    * `DELETE /artist/:id` - delete album
      - Server should answer with `status code` **204** if the record is found and deleted
      - Server should answer with `status code` **400** and corresponding message if `artistId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === artistId` doesn't exist

  * `Albums` (`/album` route)
    * `GET /album` - get all albums
      - Server should answer with `status code` **200** and all albums records
    * `GET /album/:id` - get single album by id
      - Server should answer with `status code` **200** and and record with `id === albumId` if it exists
      - Server should answer with `status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === albumId` doesn't exist
    * `POST /album` - create new album
      - Server should answer with `status code` **201** and newly created record if request is valid
      - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    * `PUT /album/:id` - update album info
      - Server should answer with` status code` **200** and updated record if request is valid
      - Server should answer with` status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
      - Server should answer with` status code` **404** and corresponding message if record with `id === albumId` doesn't exist
    * `DELETE /album/:id` - delete album
      - Server should answer with `status code` **204** if the record is found and deleted
      - Server should answer with `status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if record with `id === albumId` doesn't exist

  * `Favorites`
    * `GET /favs` - get all favorites
      - Server should answer with `status code` **200** and all favorite records (**not their ids**), split by entity type:
      ```typescript
      interface FavoritesResponse{
        artists: Artist[];
        albums: Album[];
        tracks: Track[];
      }
      ```
    * `POST /favs/track/:id` - add track to the favorites
      - Server should answer with `status code` **201** and corresponding message if track with `id === trackId` exists
      - Server should answer with `status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
      - Server should answer with `status code` **422** and corresponding message if track with `id === trackId` doesn't exist
    * `DELETE /favs/track/:id` - delete track from favorites
      - Server should answer with `status code` **204** if the track was in favorites and now it's deleted id is found and deleted
      - Server should answer with `status code` **400** and corresponding message if `trackId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if corresponding track is not favorite
    * `POST /favs/album/:id` - add album to the favorites
      - Server should answer with `status code` **201** and corresponding message if album with `id === albumId` exists
      - Server should answer with `status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
      - Server should answer with `status code` **422** and corresponding message if album with `id === albumId` doesn't exist
    * `DELETE /favs/album/:id` - delete album from favorites
      - Server should answer with `status code` **204** if the album was in favorites and now it's deleted id is found and deleted
      - Server should answer with `status code` **400** and corresponding message if `albumId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if corresponding album is not favorite
    * `POST /favs/artist/:id` - add artist to the favorites
      - Server should answer with `status code` **201** and corresponding message if artist with `id === artistId` exists
      - Server should answer with `status code` **400** and corresponding message if `artistId` is invalid (not `uuid`)
      - Server should answer with `status code` **422** and corresponding message if artist with `id === artistId` doesn't exist
    * `DELETE /favs/artist/:id` - delete artist from favorites
      - Server should answer with `status code` **204** if the artist was in favorites and now it's deleted id is found and deleted
      - Server should answer with `status code` **400** and corresponding message if `artistId` is invalid (not `uuid`)
      - Server should answer with `status code` **404** and corresponding message if corresponding artist is not favorite

**Note:** The API uses `application/json` format for all requests and responses.
