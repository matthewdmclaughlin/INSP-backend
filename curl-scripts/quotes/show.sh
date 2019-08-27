#!/bin/bash

API="http://localhost:4741"
URL_PATH="/quotes/:id"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request GET \
  --header "Authorization: Bearer ${TOKEN}"

echo
