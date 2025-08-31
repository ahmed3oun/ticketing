#!/bin/bash

minikube stop

minikube delete

# Start Minikube with NGINX Ingress and storage-provisioner enabled
minikube start  --addons=ingress --addons=storage-provisioner


kubectl create secret generic jwt-key --from-literal=JWT_KEY=$(openssl rand --hex 32)


# Apply the NGINX Ingress Controller manifest application manifests

# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.0/deploy/static/provider/cloud/deploy.yaml
kubectl apply -f ./infra/k8s/
# Get the status of the Minikube cluster
minikube status

# Get the list of services to verify the setup
kubectl get services --all-namespaces


# k3d cluster create ticketing-app --servers-memory 6144m -p 8080:80
# kubectl apply ./infra/k8s/deployments/
# kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.13.0/deploy/static/provider/kind/deploy.yaml

