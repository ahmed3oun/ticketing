variable "eks_cluster_role_name" {
  description = "Name of the IAM role for the EKS cluster"
  type        = string
}

variable "eks_node_role_name" {
  description = "Name of the IAM role for the EKS node group"
  type        = string
}

variable "env" {
  description = "Environment name (e.g., dev, staging, prod)"
  type        = string
  # validation {
  #   condition     = can(regex("^(dev|staging|prod)$", var.env))
  #   error_message = "Environment must be one of: dev, staging, prod."
  # }
  # default = "dev"
}
