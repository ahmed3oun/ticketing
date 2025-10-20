#!/bin/bash

# install kubectl if not already installed
if ! [ -x "$(command -v kubectl)" ]; then
  echo 'Error: kubectl is not installed.' >&2
  echo 'Installing kubectl...'
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  chmod +x ./kubectl
  sudo mv ./kubectl /usr/local/bin/kubectl
fi

# install docker if not already installed
if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: docker is not installed.' >&2
  echo 'Installing docker...'
  sudo apt-get update
  sudo apt-get install -y docker.io
  sudo systemctl start docker
  sudo systemctl enable docker
fi

# install skaffold if not already installed
if ! [ -x "$(command -v skaffold)" ]; then
  echo 'Error: skaffold is not installed.' >&2
  echo 'Installing skaffold...'
  curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64
  chmod +x skaffold
  sudo mv skaffold /usr/local/bin/skaffold
fi

# install kind if not already installed

if ! [ -x "$(command -v kind)" ]; then
  echo 'Error: kind is not installed.' >&2
  echo 'Installing kind...'
  curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
  chmod +x ./kind
  sudo mv ./kind /usr/local/bin/kind
fi

# create kind cluster
kind create cluster --name ticketing-app --config ./infra/k8s/kind-config.yaml
# wait for cluster to be ready
sleep 10
# install ingress-nginx controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.0/deploy/static/provider/kind/deploy.yaml
# wait for ingress-nginx to be ready
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s
echo "Kind cluster 'ticketing-app' created and ingress-nginx installed."
# need to label your node with ingress-ready=true:

# get the first node name of nodes in the kind cluster
kubectl get nodes
NODE_NAME=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
echo "Labeling node $NODE_NAME with ingress-ready=true"
kubectl label nodes $NODE_NAME ingress-ready=true

# verify the ingress-nginx controller is running
kubectl get pods -n ingress-nginx
# apply k8s deployments and services
kubectl apply ./infra/k8s/deployments/

# port-forward ingress-nginx-controller service to localhost:8080
kubectl port-forward --namespace ingress-nginx service/ingress-nginx-controller 8080:80 &
echo "Port forwarding from localhost:8080 to ingress-nginx-controller service" &
echo "You can access the application at http://localhost:8080"

# print all resources in all namespaces
kubectl get all --all-namespaces
# print all ingress resources in all namespaces
kubectl get ingress --all-namespaces
echo "Kind cluster setup complete."
