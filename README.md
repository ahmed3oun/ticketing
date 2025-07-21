# Ticketing Project

This repository contains the source code and infrastructure configuration for the **Ticketing** application, organized into two main folders:

- [`apps/`](./apps): Microservices source code (Node.js, Docker)
- [`infra/`](./infra): Infrastructure as Code (Terraform, Kubernetes)

---

## Table of Contents

- [Ticketing Project](#ticketing-project)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Apps](#apps)
  - [Infrastructure](#infrastructure)
    - [Kubernetes](#kubernetes)
    - [Terraform](#terraform)
  - [Development Workflow](#development-workflow)
  - [Minikube \& Kubernetes](#minikube--kubernetes)
  - [Useful Commands](#useful-commands)
  - [Notes](#notes)

---

## Project Structure

```
.
├── apps/
│   ├── auth/
│   ├── expiration/
│   ├── tickets/
│   ├── client/
│   └── ... (other services)
├── infra/
│   ├── k8s/
│   └── modules/
│       └── network/
└── README.md
```

---

## Apps

The `apps/` directory contains all microservices for the Ticketing platform.  
Each service is a Node.js application with its own `Dockerfile` and dependencies.

- **auth**: Handles authentication and JWT issuance.
- **expiration**: Manages ordering ticket expiration logic.
- **tickets**: Handles tickets and orders creation and management.
- **client**: Handles the ssr ui ticketing management.
- *(Add more services as needed)*

Each service can be built and run using Docker.  
Example for the `expiration` service:

```bash
cd apps/expiration
docker build -t ahmedoun96/expiration:latest .
```

---

## Infrastructure

The `infra/` directory contains all infrastructure code:

- **Kubernetes manifests** (`infra/k8s/`): Deployments, Services, Ingress, etc.
- **Terraform modules** (`infra/modules/`): AWS VPC, networking, etc.

### Kubernetes

- Deployments and services for each app are defined in `infra/k8s/`.
- Ingress is managed via NGINX Ingress Controller (enabled by Minikube addon).

### Terraform

- Infrastructure modules for AWS (VPC, subnets, NAT, etc.) are in `infra/modules/network/`.
- Variables and outputs are managed via `.tf` files.

---

## Development Workflow

1. **Start Minikube with required addons:**

    ```bash
    ./start-minikube.sh
    ```

2. **Build Docker images for each service:**

    ```bash
    cd apps/<service>
    docker build -t <your-dockerhub-username>/<service>:latest .
    ```

3. **Apply Kubernetes manifests:**

    ```bash
    kubectl apply -f infra/k8s/
    ```

4. **Access services via Minikube IP or Ingress.**

---

## Minikube & Kubernetes

- The project is designed for local development with [Minikube](https://minikube.sigs.k8s.io/).
- NGINX Ingress and storage-provisioner are enabled by default.
- Secrets (e.g., JWT keys) are created automatically by the startup script.

---

## Useful Commands

- **Check cluster status:**  
  `minikube status`

- **View all services:**  
  `kubectl get services --all-namespaces`

- **View pods:**  
  `kubectl get pods -A`

- **Enable Minikube addons:**  
  `minikube addons enable ingress`

- **Delete and restart cluster:**  
  `minikube stop && minikube delete && minikube start --addons=ingress --addons=storage-provisioner`

---

## Notes

- Make sure Docker is running before starting Minikube.
- For production, adapt the Terraform modules and Kubernetes manifests as needed.

---

*Feel free to contribute or open issues for improvements!*