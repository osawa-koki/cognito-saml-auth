#!/bin/bash

source .env

OUTPUTS=$(aws cloudformation describe-stacks --stack-name $BASE_STACK_NAME --query "Stacks[0].Outputs" --output json)

START_URL=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey == "StartURL") | .OutputValue')
TOKEN_ENDPOINT=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey == "TokenEndpoint") | .OutputValue')
CLIENT_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey == "ClientID") | .OutputValue')

echo "START_URL: $START_URL"
echo "TOKEN_ENDPOINT: $TOKEN_ENDPOINT"
echo "CLIENT_ID: $CLIENT_ID"

DOTENV_FILENAME=".env.dynamic"
rm -f $DOTENV_FILENAME
echo "START_URL=$START_URL" > $DOTENV_FILENAME
echo "TOKEN_ENDPOINT=$TOKEN_ENDPOINT" >> $DOTENV_FILENAME
echo "CLIENT_ID=$CLIENT_ID" >> $DOTENV_FILENAME

