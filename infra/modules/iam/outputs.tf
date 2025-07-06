output "iam_cluster_role_arn" {
  value = aws_iam_role.eks_cluster_role.arn
  description = "value of the IAM role ARN for the EKS cluster"
}

output "iam_node_role_arn" {
  value = aws_iam_role.eks_node_role.arn
  description = "value of the IAM role ARN for the EKS node group"
}