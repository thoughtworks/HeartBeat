#!/bin/bash
set -euo pipefail

display_help() {
    echo "Usage: $0 {frontend|backend|mockserver}" >&2
    echo
    echo "   frontend     build frontend"
    echo "   backend      build backend"
    echo "   mockserver   build mockserver"
    echo
    exit 1
}

build_backend(){

}

build_mockserver(){

}

build_frontend(){

}



if [[ "$#" -le 0 ]]; then
  display_help
  exit 0
fi

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -h|--help) display_help; shift ;;
        frontend) build_frontend ;;
        backend) build_backend ;;
        mockserver) build_mockserver ;;
        *) echo "Unknown parameter passed: $1" ;;
    esac
    shift
done
