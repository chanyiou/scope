#! /bin/bash
PORT=$1

docker build -t scope-integration-test ../docker/ && docker -d run scope-integration-test
