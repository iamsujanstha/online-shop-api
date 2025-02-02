## System Requirements

Ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/install/) (latest version)
- [Docker Compose](https://docs.docker.com/compose/install/) (latest version)

## How to Run

Follow these steps to set up and run the application:

1. **Clone the repository:**

   ```sh
   git clone git@github.com:sappChak/nestjs-ecommerce-monolith.git
   cd nestjs-ecommerce-monolith
   ```

2. **Build and start the services using Docker Compose:**

   ```sh
   docker compose -f docker-compose.dev.yml up --build
   ```

3. **Access the API Gateway:**

   Once the services are up, the API Gateway will be listening on [http://localhost:3001](http://localhost:3001).

## API Documentation

To explore and test the API, head to the Swagger UI running at [http://localhost:3001/api/docs](http://localhost:3001/api/docs).
