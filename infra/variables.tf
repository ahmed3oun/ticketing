variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "eu-west-3"
}

variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  validation {
    condition     = length(var.vpc_name) > 3
    error_message = "vpc_name length must be more then 3 caracteres"
  }
  default = "ticketing-vpc"
}

variable "cluster_name" {
  description = "Name of the EKS Cluster"
  type        = string
  default     = "ticketing-eks"
}

variable "cidr_block" {
  type = string
}

variable "public_subnets" {
  type = list(object({
    name              = string # Subnet name tag
    cidr_block        = string # e.g. "10.0.1.0/24"
    availability_zone = string # e.g. "us-east-1a"
  }))


}
variable "private_subnets" {
  type = list(object({
    name              = string # e.g. "private-subnet-1"
    cidr_block        = string # e.g. "10.0.3.0/24"
    availability_zone = string # e.g. "us-east-1a"
  }))
}
variable "igw_name" {
  type = string

}
variable "eip_name" {
  type = string
}

variable "nat_gateway_name" {
  type = string
}

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
  default = "dev"
}


