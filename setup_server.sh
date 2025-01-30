#!/bin/bash

source .env

OUTPUTS=$(aws cloudformation describe-stacks --stack-name $BASE_STACK_NAME --query "Stacks[0].Outputs" --output json)

START_URL=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey == "StartURL") | .OutputValue')
ACS_URL=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey == "ACSURL") | .OutputValue')
ENTITY_ID=$(echo $OUTPUTS | jq -r '.[] | select(.OutputKey == "ENTITYID") | .OutputValue')

echo "START_URL: $START_URL"
echo "ACS_URL: $ACS_URL"
echo "ENTITY_ID: $ENTITY_ID"

DOTENV_FILENAME=".env.dynamic"
rm -f $DOTENV_FILENAME
echo "START_URL=$START_URL" > $DOTENV_FILENAME
echo "ACS_URL=$ACS_URL" >> $DOTENV_FILENAME
echo "ENTITY_ID=$ENTITY_ID" >> $DOTENV_FILENAME
