#!/bin/bash
set -euo pipefail

# shellcheck source=/dev/null
source ./ops/base.sh

display_help() {
  echo "Usage: $0 {frontend|backend|stub|e2e-runner}" >&2
  echo
  echo "   frontend     build frontend"
  echo "   backend      build backend"
  echo "   stub         build stub"
  echo "   e2e-runner   build e2e-runner"
  echo
  exit 1
}

if [[ "$#" -le 0 ]]; then
  display_help
fi

while [[ "$#" -gt 0 ]]; do
  case $1 in
  -h | --help) display_help ;;
  frontend) build_and_push_image frontend ;;
  backend) build_and_push_image backend ;;
  stub) build_and_push_image stub ;;
  e2e-runner) build_and_push_image e2e-runner ;;
  *) echo "Unknown parameter passed: $1" ;;
  esac
  shift
done
