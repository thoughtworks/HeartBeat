#!/bin/bash
set -euo pipefail

display_help() {
  echo "Usage: $0 {shell|security|frontend|backend|backend-license|frontend-license|e2e|buildkite-status}" >&2
  echo
  echo "   shell                    run shell check for the whole project"
  echo "   security                 run security check for the whole project"
  echo "   frontend                 run check for the frontend"
  echo "   frontned-type-check      run typescript check for the frontend"
  echo "   px                       run css px check for the frontend"
  echo "   backend                  run check for the backend"
  echo "   dot-star                 run .* check for the backend"
  echo "   rgba                     run css rgba check to deny it"
  echo "   hex                      run css hex check to deny it"
  echo "   backend-license          check license for the backend"
  echo "   frontend-license         check license for the frontend"
  echo "   e2e                      run e2e for the frontend"
  echo "   e2e-container            run e2e for the frontend in container"
  echo "   buildkite-status         run status check for the buildkite"
  echo "   buildkite-e2e-deployed   check whether the the app has been deployed into e2e env successfully"
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

frontend_check() {
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
    --exclude-dir='node_modules' \
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

buildkite_e2e_deployed_check() {
  #!/bin/bash

  MAX_ATTEMPTS=20
  SLEEP_DURATION_SECONDS=30
  BRANCH="main"
  attempt_count=0

  echo "The git commit id is $COMMIT_SHA"

  while [ $attempt_count -lt $MAX_ATTEMPTS ]; do
    ((attempt_count += 1))
    echo "Start to get deployment status, attempt count is $attempt_count"

    response=$(curl -H "Authorization: Bearer $BUILDKITE_TOKEN" -X GET "https://api.buildkite.com/v2/organizations/heartbeat-backup/pipelines/heartbeat/builds?branch=$BRANCH&commit=$COMMIT_SHA&state=passed")
    echo "The current build response: $response"
    is_empty=$(echo "$response" | jq 'length == 0')
    if [ "$is_empty" == "true" ]; then
      echo "The current BuildKite build has not deployed into e2e env"
      sleep $SLEEP_DURATION_SECONDS
      continue
    fi

    value=$(echo "$response" | jq '.[0].jobs[] | select(.name == ":rocket: Deploy e2e" and .state == "passed") | . != null')

    if [ "$value" == "true" ]; then
      echo "Successfully deploy to E2E"
      break
    else
      echo "WIP..."
      sleep $SLEEP_DURATION_SECONDS
    fi
  done

  if [ $attempt_count -eq $MAX_ATTEMPTS ]; then
    echo "❌ Failed to wait for E2E deployment with Maximum attempts reached. Exiting..."
    exit 1
  fi
}

hex_check() {
  cd frontend
  local result
  result=$(grep -rinE \
    --exclude-dir='node_modules' \
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

  set +e
  local result
  docker run \
    --name hb_e2e_runner \
    -e "APP_ORIGIN=${APP_HTTP_SCHEDULE:-}://${AWS_EC2_IP_E2E:-}:${AWS_EC2_IP_E2E_PORT:-}" \
    -e "E2E_TOKEN_JIRA=${E2E_TOKEN_JIRA:-}" \
    -e "E2E_TOKEN_BUILD_KITE=${E2E_TOKEN_BUILD_KITE:-}" \
    -e "E2E_TOKEN_GITHUB=${E2E_TOKEN_GITHUB:-}" \
    -e "E2E_TOKEN_FLAG_AS_BLOCK_JIRA=${E2E_TOKEN_FLAG_AS_BLOCK_JIRA:-}" \
    -e "CI=${CI:-}" \
    heartbeat_e2e:latest \
    pnpm run e2e:major-ci
  result=$?
  set -e

  docker cp hb_e2e_runner:/app/e2e/reports ./e2e-reports
  docker rm hb_e2e_runner
  tar -zcvf ./e2e-reports.tar.gz ./e2e-reports
  exit $result
}

e2e_check() {
  echo "start to run e2e"
  export TZ=Asia/Shanghai
  npm install -g pnpm
  cd frontend
  pnpm install --no-frozen-lockfile
  pnpm exec playwright install
  pnpm exec playwright install msedge
  pnpm exec playwright install chrome
  pnpm run e2e:ci
}

buildkite_status_check() {
  if [[ "$EVENT_NAME" == "pull_request" && "$CURRENT_BRANCH_NAME" != "refs/heads/main" ]]; then
    if echo "$PULL_REQUEST_TITLE" | grep -iq "revert"; then
      echo "PR contains revert. Skipping the action."
    else
      echo "Start to check the latest BuildKite build status"
      buildkite_status=$(curl -H "Authorization: Bearer $BUILDKITE_TOKEN" "https://api.buildkite.com/v2/organizations/heartbeat-backup/pipelines/heartbeat/builds?branch=main"| jq -r '.[0].state')
      if [ "$buildkite_status" != "passed" ]; then
        latest_commiter=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$GITHUB_REPOSITORY/commits?per_page=1" | jq -r '.[0].author.login')
        echo "The latest commit author is $latest_commiter, the current author is $CURRENT_ACTOR"
        if [ "$CURRENT_ACTOR" != "$latest_commiter" ]; then
          echo "❌ BuildKite build failed. Cannot merge this PR."
          echo "And the committer does not match"
          echo "The last commit was made by: $latest_commiter, not you."
          exit 1
        else
          echo "🎉 The last build of BuildKite is failed."
          echo "But the committer is matched, So let go"
          echo "Both actions were performed by: $CURRENT_ACTOR"
        fi
      else
        echo "🎉 The latest build of BuildKite is passed, feel free to merge."
      fi
    fi
  else
    echo "🎉 Not a pull request or not in a non-main branch. Skipping the action."
  fi
}

if [[ "$#" -le 0 ]]; then
  display_help
fi

while [[ "$#" -gt 0 ]]; do
  case $1 in
  -h | --help) display_help ;;
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
  "buildkite-status") buildkite_status_check ;;
  "buildkite-e2e-deployed") buildkite_e2e_deployed_check ;;
  *) echo "Unknown parameter passed: $1" ;;
  esac
  shift
done
