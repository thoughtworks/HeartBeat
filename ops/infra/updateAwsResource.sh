#!/bin/bash

AwsHost=${AWSHost:?}
AwsAccountId=${AWSAccountId:?}
AwsRegion=${AWSRegion:?}
SshPublicKey=${SSHPublicKey:?}
BuildKiteToken=${BuildKiteToken:?}
SshPrivateKey=${SSHPrivateKey:?}

OUTPUT=$(aws cloudformation update-stack --stack-name Heartbeat \
    --template-body file://ops/infra/cloudformation.yml \
    --parameters ParameterKey=AwsRegion,ParameterValue="${AwsRegion}" \
    ParameterKey=GitHubOrg,ParameterValue=au-heartbeat \
    ParameterKey=RepositoryName,ParameterValue=Heartbeat \
    ParameterKey=AwsHost,ParameterValue="${AwsHost}" \
    ParameterKey=AwsAccountId,ParameterValue="${AwsAccountId}" \
    ParameterKey=SSHPublicKey,ParameterValue="${SshPublicKey}" \
    ParameterKey=BuildKiteToken,ParameterValue="${BuildKiteToken}" \
    ParameterKey=SSHPrivateKey,ParameterValue="${SshPrivateKey}" \
    --capabilities CAPABILITY_NAMED_IAM \
    2>&1)
RETURN_CODE=$?
if [[ $OUTPUT == *"No updates are to be performed"* ]]; then
    echo "No updates are to be performed. Exiting gracefully."
else
    echo "$OUTPUT"
    exit $RETURN_CODE
fi
