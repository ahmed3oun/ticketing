# This Terraform configuration sets up an EKS cluster with a VPC, subnets, and an AWS Load Balancer Controller.

# terraform {
#   required_version = "~> 1.12.0"
#   required_providers {
#     aws = {
#       source  = "hashicorp/aws"
#       version = "~> 5.0"
#     }
#     kubernetes = {
#       source  = "hashicorp/kubernetes"
#       version = "~> 2.23"
#     }
#     helm = {
#       source  = "hashicorp/helm"
#       version = "~> 2.11"
#     }
#     random = {
#       source  = "hashicorp/random"
#       version = "~> 3.5"
#     }
#   }
# }

provider "aws" {
  region     = var.aws_region
  profile    = "default"
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = var.vpc_name
  cidr = "10.0.0.0/16"                                            # VPC CIDR block 
  azs  = slice(["eu-west-3a","eu-west-3b","eu-west-3c"], 0, 3) # Select the first 3 availability zones

  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]     # Public subnets for the VPC
  private_subnets = ["10.0.101.0/24", "10.0.102.0/24"] # Private subnets for the VPC, can be defined later

  enable_nat_gateway   = true # Enable NAT Gateway for private subnets
  single_nat_gateway   = true # Use a single NAT Gateway for cost efficiency
  enable_dns_hostnames = true # Enable DNS hostnames in the VPC

  public_subnet_tags = {
    "kubernetes.io/role/elb" = 1 # Tag for public subnets to be used by ELB
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = 1 # Tag for private subnets to be used by internal ELB
  }
}

# module "eks" {
#   source  = "terraform-aws-modules/eks/aws"
#   version = "~> 20.11"

#   cluster_name    = "ticketing-cluster" # Name of the EKS cluster
#   cluster_version = "1.30"              # EKS cluster version

#   vpc_id     = module.vpc.vpc_id          # VPC ID where the EKS cluster will be created
#   subnet_ids = module.vpc.private_subnets # Subnets for the EKS cluster

#   eks_managed_node_groups = {
#     default = {
#       instance_types = ["t2.micro", "t3.medium"] # Instance type for the default node group
#       min_size       = 1                         # Minimum number of nodes in the node group
#       max_size       = 3                         # Maximum number of nodes in the node group
#       desired_size   = 1                         # Desired number of nodes in the node group
#     }
#   }
# }

# AWS Load Balancer Controller IAM Policy
# resource "aws_iam_policy" "alb_controller" {
#   name        = "AWSLoadBalancerController"
#   description = "Permissions for AWS Load Balancer Controller"
#   policy      = file("${path.module}/iam_policy.json") # Get from AWS docs
# }

# Attach policy to node group
# resource "aws_iam_role_policy_attachment" "alb_controller" {
#   policy_arn = aws_iam_policy.alb_controller.arn
#   role       = module.eks.eks_managed_node_groups["default"].iam_role_name
# }



# # terraform {
# #   required_providers {
# #     aws = {
# #       source  = "hashicorp/aws"
# #       version = "~> 5.0"
# #     }
# #   }
# # }

# provider "aws" {
#   region     = var.aws_region
#   access_key = var.aws_access_key
#   secret_key = var.aws_secret_key
#   profile    = "default"
# }

# provider "helm" {
#   kubernetes {
#     host                   = module.eks.cluster_endpoint
#     cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)

#     exec {
#       api_version = "client.authentication.k8s.io/v1beta1"
#       command     = "aws"
#       # This requires the awscli to be installed locally where Terraform is executed
#       args = ["eks", "get-token", "--cluster-name", module.eks.cluster_name]
#     }
#   }
# }

# data "aws_availability_zones" "available" {
#   # Do not include local zones
#   filter {
#     name   = "opt-in-status"
#     values = ["opt-in-not-required"]
#   }
# }

# locals {
#   name   = basename(path.cwd)
#   region = var.aws_region

#   vpc_cidr = "10.0.0.0/16"
#   azs      = slice(data.aws_availability_zones.available.names, 0, 3)

#   gameserver_minport = 7000
#   gameserver_maxport = 8000

#   tags = {
#     Blueprint  = local.name
#     GithubRepo = "github.com/aws-ia/terraform-aws-eks-blueprints"
#   }
# }

# ################################################################################
# # Cluster
# ################################################################################

# module "eks" {
#   source  = "terraform-aws-modules/eks/aws"
#   version = "~> 20.11"

#   cluster_name                   = local.name
#   cluster_version                = "1.30"
#   cluster_endpoint_public_access = true

#   # Give the Terraform identity admin access to the cluster
#   # which will allow resources to be deployed into the cluster
#   enable_cluster_creator_admin_permissions = true

#   vpc_id                   = module.vpc.vpc_id
#   control_plane_subnet_ids = module.vpc.private_subnets
#   subnet_ids               = module.vpc.public_subnets

#   eks_managed_node_groups = {
#     default = {
#       instance_types = ["m5.large"]
#       min_size       = 1
#       max_size       = 5
#       desired_size   = 2
#     }

#     agones_system = {
#       instance_types = ["m5.large"]
#       labels = {
#         "agones.dev/agones-system" = true
#       }
#       taint = {
#         dedicated = {
#           key    = "agones.dev/agones-system"
#           value  = true
#           effect = "NO_EXECUTE"
#         }
#       }
#       min_size     = 1
#       max_size     = 1
#       desired_size = 1
#     }

#     agones_metrics = {
#       instance_types = ["m5.large"]
#       labels = {
#         "agones.dev/agones-metrics" = true
#       }
#       taints = {
#         dedicated = {
#           key    = "agones.dev/agones-metrics"
#           value  = true
#           effect = "NO_EXECUTE"
#         }
#       }
#       min_size     = 1
#       max_size     = 1
#       desired_size = 1
#     }
#   }

#   node_security_group_additional_rules = {
#     ingress_gameserver_udp = {
#       description      = "Agones Game Server Ports"
#       protocol         = "udp"
#       from_port        = local.gameserver_minport
#       to_port          = local.gameserver_maxport
#       type             = "ingress"
#       cidr_blocks      = ["0.0.0.0/0"]
#       ipv6_cidr_blocks = ["::/0"]
#     },
#     ingress_gameserver_webhook = {
#       description                   = "Cluster API to node 8081/tcp agones webhook"
#       protocol                      = "tcp"
#       from_port                     = 8081
#       to_port                       = 8081
#       type                          = "ingress"
#       source_cluster_security_group = true
#     }
#   }

#   tags = local.tags
# }

# ################################################################################
# # EKS Blueprints Addons
# ################################################################################

# module "eks_blueprints_addons" {
#   source  = "aws-ia/eks-blueprints-addons/aws"
#   version = "~> 1.16"

#   cluster_name      = module.eks.cluster_name
#   cluster_endpoint  = module.eks.cluster_endpoint
#   cluster_version   = module.eks.cluster_version
#   oidc_provider_arn = module.eks.oidc_provider_arn

#   # EKS Add-Ons
#   eks_addons = {
#     coredns    = {}
#     vpc-cni    = {}
#     kube-proxy = {}
#   }

#   # Add-ons
#   enable_metrics_server     = true
#   enable_cluster_autoscaler = true

#   helm_releases = {
#     agones = {
#       description      = "A Helm chart for Agones game server"
#       namespace        = "agones-system"
#       create_namespace = true
#       chart            = "agones"
#       chart_version    = "1.32.0"
#       repository       = "https://agones.dev/chart/stable"
#       values = [
#         templatefile("${path.module}/helm_values/agones-values.yaml", {
#           expose_udp         = true
#           gameserver_minport = local.gameserver_minport
#           gameserver_maxport = local.gameserver_maxport
#         })
#       ]
#     }
#   }

#   tags = local.tags
# }

# ################################################################################
# # Supporting Resources
# ################################################################################

# module "vpc" {
#   source  = "terraform-aws-modules/vpc/aws"
#   version = "~> 5.0"

#   name = local.name
#   cidr = local.vpc_cidr

#   azs             = local.azs
#   private_subnets = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 4, k)]
#   public_subnets  = [for k, v in local.azs : cidrsubnet(local.vpc_cidr, 8, k + 48)]
#   # NOTE: Agones requires a Node group in Public Subnets and enable Public IP
#   map_public_ip_on_launch = true

#   enable_nat_gateway = true
#   single_nat_gateway = true

#   public_subnet_tags = {
#     "kubernetes.io/role/elb" = 1
#   }

#   private_subnet_tags = {
#     "kubernetes.io/role/internal-elb" = 1
#   }

#   tags = local.tags
# }
