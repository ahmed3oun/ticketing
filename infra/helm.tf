resource "kubernetes_namespace" "ingress_nginx" {
  metadata {
    name = "ingress-nginx"
  }
  depends_on = [module.kubernetes]
}


resource "helm_release" "nginx_ingress" {
  name       = "ingress-nginx"
  namespace  = kubernetes_namespace.ingress_nginx.metadata[0].name
  chart      = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  version    = "4.12.0"

  values     = [file("${path.module}/k8s/helm/ingress-nginx/values.yaml")]
  depends_on = [kubernetes_namespace.ingress_nginx]
}

resource "kubernetes_namespace" "cert_manager" {
  metadata {
    name = "cert-manager"
  }
  depends_on = [module.kubernetes]
}

resource "helm_release" "cert_manager" {
  name       = "cert-manager"
  namespace  = "cert-manager"
  chart      = "cert-manager"
  repository = "https://charts.jetstack.io"
  version    = "v1.12.0"

  values     = [file("${path.module}/k8s/helm/cert-manager/values.yaml")]
  depends_on = [kubernetes_namespace.cert_manager]
}

resource "kubernetes_namespace" "monitoring" {
  metadata {
    name = "monitoring"
  }
  depends_on = [module.kubernetes]
}

resource "helm_release" "kube_prometheus_stack" {
  name       = "kube-prometheus-stack"
  namespace  = kubernetes_namespace.monitoring.metadata[0].name
  chart      = "kube-prometheus-stack"
  repository = "https://prometheus-community.github.io/helm-charts"
  version    = "69.3.2"

  values     = [file("${path.module}/k8s/helm/kube-prometheus-stack/values.yaml")]
  depends_on = [kubernetes_namespace.monitoring]
}

resource "kubernetes_namespace" "keda" {
  metadata {
    name = "keda"
  }
  depends_on = [module.kubernetes]
}

resource "helm_release" "keda" {
  name       = "keda"
  namespace  = kubernetes_namespace.keda.metadata[0].name
  chart      = "keda"
  repository = "https://kedacore.github.io/charts"
  version    = "2.12.0"

  values     = [file("${path.module}/k8s/helm/keda/values.yaml")]
  depends_on = [kubernetes_namespace.keda]
}
