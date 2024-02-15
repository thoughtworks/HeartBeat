#!/bin/bash
set -euo pipefail

display_help() {
  echo "Usage: $0 {shell|security|frontend|backend|backend-license|frontend-license|e2e}" >&2
  echo
  echo "   shell                run shell check for the whole project"
  echo "   security             run security check for the whole project"
  echo "   frontend             run check for the frontend"
  echo "   frontned-type-check  run typescript check for the frontend"
  echo "   px                   run css px check for the frontend"
  echo "   backend              run check for the backend"
  echo "   dot-star             run .* check for the backend"
  echo "   rgba                 run css rgba check to deny it"
  echo "   hex                  run css hex check to deny it"
  echo "   backend-license      check license for the backend"
  echo "   frontend-license     check license for the frontend"
  echo "   e2e                  run e2e for the frontend"
  echo "   e2e-container        run e2e for the frontend in container"
  echo
  exit 1
}

check_shell() {
  docker run --rm -v "$PWD:/mnt" koalaman/shellcheck:stable ./ops/*.sh
}

security_check() {
  docker run --rm -it \
    -v "$PWD:/pwd" \
    trufflesecurity/trufflehog:latest \
    git file:///pwd --since-commit HEAD \
    --fail

  docker run --rm -it \
    -v "${PWD}:/path" \
    ghcr.io/gitleaks/gitleaks:latest \
    detect \
    --source="/path" \
    -v --redact
}

backend_license_check() {
  cd backend
  ./gradlew clean checkLicense
}

frontend_license_check() {
  cd frontend
  npm install --force
  npm run license-compliance
}

backend_check() {
  cd backend
  ./gradlew clean check
  bash <(curl -Ls https://coverage.codacy.com/get.sh) report -r ./build/reports/jacoco/test/jacocoTestReport.xml
  ./gradlew clean build -x test
}

frontend_check(){
  cd frontend
  pnpm dlx audit-ci@^6 --config ./audit-ci.jsonc
  pnpm install --no-frozen-lockfile
  pnpm lint
  pnpm coverage:silent
  bash <(curl -Ls https://coverage.codacy.com/get.sh) report -r ./coverage/clover.xml
  pnpm build
}

px_check() {
  cd frontend
  local result
  result=$(grep -rin \
    --exclude='*.svg' \
    --exclude='*.png' \
    --exclude='*.yaml' \
    --exclude-dir='node_modules' \
    --exclude-dir='coverage' \
    '[0-9]\+px' \
    ./ || true)
  if [ -n "$result" ]; then
    echo "Error: Found files with [0-9]+px pattern:"
    echo "$result"
    exit 1
  else
    echo "No matching files found."
  fi
}

frontned_type_check() {
  cd frontend
  pnpm run type-check
}

rgba_check() {
  cd frontend
  local result
  result=$(grep -rinE \
   --exclude-dir='node_modules'\
   --exclude-dir='coverage' \
   --exclude='*.html' \
   --exclude='*.svg' \
   --exclude='*.xml' \
   --exclude='*.test.tsx' \
   --exclude='theme.ts' \
   --exclude='*.webmanifest' \
   'rgb[a]?\(' \
  ./ || true)
  if [ -n "$result" ]; then
    echo "Error: Found files with Hex color:"
    echo "$result"
    exit 1
  else
    echo "No matching files found."
  fi
}

hex_check() {
  cd frontend
  local result
  result=$(grep -rinE \
   --exclude-dir='node_modules'\
   --exclude-dir='coverage' \
   --exclude='*.html' \
   --exclude='*.svg' \
   --exclude='*.xml' \
   --exclude='*.test.tsx' \
   --exclude='theme.ts' \
   --exclude='fixtures.ts' \
   --exclude='vite.config.ts' \
   --exclude='*.webmanifest' \
   '#[0-9a-fA-F]{6}|#[0-9a-fA-F]{8}' \
  ./ || true)
  if [ -n "$result" ]; then
    echo "Error: Found files with Hex color:"
    echo "$result"
    exit 1
  else
    echo "No matching files found."
  fi
}

dot_star_check() {
  cd backend
  local result
  result=$(grep -rin --exclude='*.svg' --exclude='*.png' --exclude='*.yaml' --exclude-dir='node_modules' '\.\*;' ./ || true)
  if [ -n "$result" ]; then
    echo "Error: Found files with [0-9]+px pattern:"
    echo "$result"
    exit 1
  else
    echo "No matching files found."
  fi
}

e2e_container_check() {
  docker build -t "heartbeat_e2e:latest" ./ -f ./ops/infra/Dockerfile.e2e

  docker run --rm \
    -e "APP_ORIGIN=${APP_HTTP_SCHEDULE:-}://${AWS_EC2_IP_E2E:-}:${AWS_EC2_IP_E2E_PORT:-}" \
    -e "E2E_TOKEN_JIRA=${E2E_TOKEN_JIRA:-}" \
    -e "E2E_TOKEN_BUILD_KITE=${E2E_TOKEN_BUILD_KITE:-}" \
    -e "E2E_TOKEN_GITHUB=${E2E_TOKEN_GITHUB:-}" \
    -e "CI='true'" \
    heartbeat_e2e:latest \
    pnpm run e2e
}

e2e_check(){
  echo "start to run e2e"
  export TZ=Asia/Shanghai
  npm install -g pnpm
  cd frontend
  pnpm install --no-frozen-lockfile
  pnpm exec playwright install
  pnpm exec playwright install msedge
  pnpm exec playwright install chrome
  pnpm run e2e
}

if [[ "$#" -le 0 ]]; then
  display_help
fi

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -h|--help) display_help ;;
    shell) check_shell ;;
    security) security_check ;;
    frontend) frontend_check ;;
    "frontend-type") frontned_type_check ;;
    px) px_check ;;
    backend) backend_check ;;
    "dot-star") dot_star_check ;;
    hex) hex_check ;;
    rgba) rgba_check ;;
    e2e) e2e_check ;;
    "e2e-container") e2e_container_check ;;
    "backend-license") backend_license_check ;;
    "frontend-license") frontend_license_check ;;
    *) echo "Unknown parameter passed: $1" ;;
  esac
  shift
done
