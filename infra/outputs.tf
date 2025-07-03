# output "configure_kubectl" {
#   description = "Configure kubectl: make sure you're logged in with the correct AWS profile and run the following command to update your kubeconfig"
#   value       = "aws eks --region ${local.region} update-kubeconfig --name ${module.eks.cluster_name}"
# }
# output "eks_cluster_name" {
#   description = "EKS Cluster Name"
#   value       = module.eks.cluster_name
# }
# output "eks_cluster_endpoint" {
#   description = "EKS Cluster Endpoint"
#   value       = module.eks.cluster_endpoint
# }
# output "eks_cluster_oidc_issuer" {
#   description = "EKS Cluster OIDC Issuer URL"
#   value       = module.eks.oidc_provider_arn
# }