#!/bin/bash

declare -a names=("jwt-secret" "resend-secret" "stripe-secret" "github-secret-register" "github-secret-login")
declare -a keys=("JWT_KEY" "RESEND_KEY" "STRIPE_SECRET_KEY" "GITHUB_KEY_REGISTER" "GITHUB_KEY_LOGIN")
declare -a values=("xl3laZ5Al90OzBv27FgR" "re_izffSm15_B7MRoDVjaxqoYuySRFhV573J" "sk_test_51PdklUDO089tzeAmRUGze6hivnUhhy787kKzLSnfh5gN2SiBYGW3YfcnlyxUstY3qe2PdThFqPGuHScwhVQV1rek00fRsqWaEZ" "569ac54e622361feeb80beca4cc3ec625f03e15f" "2cfc66c5657e44ed27c5d4ca5b7804d71fc628f6")

numSecrets=${#names[@]}

# Create Kubernetes Secrets
for ((i = 0; i < ${numSecrets}; i++));
do
  kubectl create secret generic ${names[$i]} --from-literal ${keys[$i]}=${values[$i]}
done

# Configure Ingress-Nginx Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.2/deploy/static/provider/cloud/deploy.yaml
k delete validatingwebhookconfigurations ingress-nginx-admission

# Install Cert-Manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.15.3/cert-manager.yaml