#!/bin/bash
set -euo pipefail

display_help() {
    echo "Usage: $0 {infra|e2e|stub|prod}" >&2
    echo
    echo "   infra    deploy infra file"
    echo "   stub     deploy stub"
    echo "   e2e      deploy application to the e2e env"
    echo "   prod     deploy application to the prod env"
    echo
    exit 1
}
deploy_infra(){

}

deploy_e2e(){

}

deploy_stub(){

}

deploy_prod(){

}

if [[ "$#" -le 0 ]]; then
  display_help
  exit 0
fi

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -h|--help) display_help; shift ;;
        infra) deploy_infra ;;
        e2e) deploy_e2e ;;
        stub) deploy_stub ;;
        prod) deploy_prod ;;
        *) echo "Unknown parameter passed: $1" ;;
    esac
    shift
done
