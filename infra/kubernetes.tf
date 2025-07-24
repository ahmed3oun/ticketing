resource "kubectl_manifest" "cluster_issuer" {
  yaml_body  = file("${path.root}/k8s/manifests/certificates/cluster-issuer.yaml")
  depends_on = [helm_release.cert_manager]
}


resource "kubectl_manifest" "certificate_prometheus" {
  yaml_body  = file("${path.root}/k8s/manifests/certificates/certificate-prometheus.yaml")
  depends_on = [kubectl_manifest.cluster_issuer, helm_release.kube_prometheus_stack]
}

resource "kubectl_manifest" "certificate_grafana" {
  yaml_body  = file("${path.root}/k8s/manifests/certificates/certificate-grafana.yaml")
  depends_on = [kubectl_manifest.cluster_issuer, helm_release.kube_prometheus_stack]
}


resource "kubectl_manifest" "nginx_deployment" {
  yaml_body  = file("${path.root}/k8s/manifests/nginx-deployment-keda.yaml")
  depends_on = [helm_release.keda]
}
resource "kubectl_manifest" "nginx_keda" {
  yaml_body  = file("${path.root}/k8s/manifests/nginx-keda.yaml")
  depends_on = [kubectl_manifest.nginx_deployment]
}