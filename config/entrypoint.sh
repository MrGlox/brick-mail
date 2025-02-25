#!/bin/sh

set -e

echo "Starting entrypoint script..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
MAX_RETRIES=1
RETRY_COUNT=0

while ! nc -z db 5432; do
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "Error: Failed to connect to database after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "Database not ready. Retrying... ($RETRY_COUNT/$MAX_RETRIES)"
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 2
done

echo "Database is ready!"

# Run database setup in production
if [ "$NODE_ENV" = "production" ]; then
    echo "Running in production mode"
    
    # Generate Prisma client if needed
    echo "Generating Prisma client..."
    pnpm db:generate
    
    echo "Running database migrations..."
    pnpm db:migrate:deploy
    
    # Seed admin user only in production
    echo "Seeding admin user..."
    if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
        echo "Using provided admin credentials $ADMIN_EMAIL $ADMIN_PASSWORD"
        ADMIN_EMAIL="$ADMIN_EMAIL" ADMIN_PASSWORD="$ADMIN_PASSWORD" \
        DATABASE_URL="$DATABASE_URL" \
        pnpm db:seed:admin
    else
        echo "Warning: ADMIN_EMAIL and/or ADMIN_PASSWORD not set. Bypassed seeder."
    fi
fi

# Start the application
# echo "Starting the application..."
# echo "Current directory: $(pwd)"
# echo "Checking if start.sh exists: $(ls -la /app/apps/server/start.sh)"
# # cd apps/server
# echo "Directory contents: $(ls -la)"
# exec apps/server/start.sh

cd /app/apps/server && node dist/main.js