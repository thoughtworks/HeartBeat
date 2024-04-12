#!/bin/bash
set -euo pipefail

import_file_name='./e2e/fixtures/input-files/hb-e2e-for-importing-file.json'
echo "Start to generate ${import_file_name}"
cat ./e2e/fixtures/input-files/hb-e2e-for-importing-file.template.json > "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_JIRA>/${E2E_TOKEN_JIRA}/g" "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_BUILD_KITE>/${E2E_TOKEN_BUILD_KITE}/g" "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_GITHUB>/${E2E_TOKEN_GITHUB}/g" "${import_file_name}"
echo "Successfully generate ${import_file_name}"

import_file_name='./e2e/fixtures/input-files/multiple-done-config-file.json'
echo "Start to generate ${import_file_name}"
cat ./e2e/fixtures/input-files/multiple-done-config-file.template.json > "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_JIRA>/${E2E_TOKEN_JIRA}/g" "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_BUILD_KITE>/${E2E_TOKEN_BUILD_KITE}/g" "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_GITHUB>/${E2E_TOKEN_GITHUB}/g" "${import_file_name}"
echo "Successfully generate ${import_file_name}"

import_file_name='./e2e/fixtures/input-files/cycle-time-by-status-config-file.json'
echo "Start to generate ${import_file_name}"
cat ./e2e/fixtures/input-files/cycle-time-by-status-config-file.template.json > "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_JIRA>/${E2E_TOKEN_JIRA}/g" "${import_file_name}"
echo "Successfully generate ${import_file_name}"

import_file_name='./e2e/fixtures/input-files/add-flag-as-block-config-file.json'
echo "Start to generate ${import_file_name}"
cat ./e2e/fixtures/input-files/add-flag-as-block-config-file.template.json > "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_JIRA>/${E2E_TOKEN_JIRA}/g" "${import_file_name}"
echo "Successfully generate ${import_file_name}"

import_file_name='./e2e/fixtures/input-files/pipeline-no-org-config-file.json'
echo "Start to generate ${import_file_name}"
cat ./e2e/fixtures/input-files/pipeline-no-org-config-file.template.json > "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_JIRA>/${E2E_TOKEN_JIRA}/g" "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_PIPELINE_NO_ORG_CONFIG_BUILDKITE>/${E2E_TOKEN_PIPELINE_NO_ORG_CONFIG_BUILDKITE}/g" "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_GITHUB>/${E2E_TOKEN_GITHUB}/g" "${import_file_name}"
echo "Successfully generate ${import_file_name}"

import_file_name='./e2e/fixtures/input-files/unhappy-path-config-file.json'
echo "Start to generate ${import_file_name}"
cat ./e2e/fixtures/input-files/unhappy-path-config-file.template.json > "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_JIRA>/${E2E_TOKEN_JIRA/%????/1234}/g" "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_BUILD_KITE>/${E2E_TOKEN_BUILD_KITE/%????/1234}/g" "${import_file_name}"
sed -i -e "s/<E2E_TOKEN_GITHUB>/${E2E_TOKEN_GITHUB/%????/1234}/g" "${import_file_name}"
echo "Successfully generate ${import_file_name}"
