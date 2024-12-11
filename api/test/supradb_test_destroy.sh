#!/bin/bash

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <database_name> <container_name>"
    exit 1
fi

DB_NAME="$1"
CONTAINER_NAME="$2"

docker exec -it $CONTAINER_NAME psql -U postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "Database $DB_NAME deleted from container $CONTAINER_NAME successfully."