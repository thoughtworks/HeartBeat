#!/bin/bash
set -euo pipefail

AWS_ECR_HOST="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"

init_aws() {
  aws ecr get-login-password --region "$AWS_REGION" | docker login --username AWS --password-stdin "${AWS_ECR_HOST}"
}

build_and_push_image() {
  local app_name="$1" # like, backend, frontend, stub

  docker build -t "${AWS_ECR_HOST}/heartbeat_${app_name}:latest" ./ -f ./ops/infra/Dockerfile."${app_name}"
  docker tag "${AWS_ECR_HOST}/heartbeat_${app_name}:latest" "${AWS_ECR_HOST}/heartbeat_${app_name}:hb${BUILDKITE_BUILD_NUMBER}"

#  docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
#    -v "$(pwd)"/.trivyignore:/.trivyignore \
#    aquasec/trivy image \
#    --severity HIGH,CRITICAL \
#    --exit-code 1 \
#    --ignore-unfixed \
#    --format table \
#    --ignorefile /.trivyignore \
#    "${AWS_ECR_HOST}/heartbeat_${app_name}:latest"

  docker push "${AWS_ECR_HOST}/heartbeat_${app_name}:latest"
  docker push "${AWS_ECR_HOST}/heartbeat_${app_name}:hb${BUILDKITE_BUILD_NUMBER}"

  docker rmi "${AWS_ECR_HOST}/heartbeat_${app_name}:latest"
  docker rmi "${AWS_ECR_HOST}/heartbeat_${app_name}:hb${BUILDKITE_BUILD_NUMBER}"
}

init_aws
