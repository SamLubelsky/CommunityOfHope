#! /bin/bash

echo "Starting Cloud SQL Proxy..."
echo "Instance: fl24-community-of-hope:us-central1:coh-postgres"
echo "Port: 5432"

./cloud-sql-proxy --credentials-file fl24-community-of-hope-f9acca652673.json \
--port 5432 \
fl24-community-of-hope:us-central1:coh-postgres &

echo "Cloud SQL Proxy started in background. PID: $!"
echo "You can now start your application." 