locals {
  # cmds to create and select workspaces
  # terraform workspace new dev
  # terraform workspace new prod
  # terraform workspace select dev
  env = terraform.workspace
}
#   public_sg_rules_ingress = {
#     for id, rule in csvdecode(file("./sg_rules.csv")) :
#     id => {
#       protocol    = rule["protocol"]
#       from_port   = tonumber(split("-", rule["port_range"])[0])
#       to_port     = length(split("-", rule["port_range"])) > 1 ? tonumber(split("-", rule["port_range"])[1]) : tonumber(split("-", rule["port_range"])[0])
#       cidr_blocks = rule["dst_cidr"]
#       rule_type   = rule["rule_type"]
#       dst_sg      = rule["dst_sg"]
#     }
#     if rule["sg_name"] == "public_sg" && rule["rule_type"] == "ingress"
#   }

#   private_sg_rules_ingress = {
#     for id, rule in csvdecode(file("./sg_rules.csv")) :
#     id => {
#       protocol    = rule["protocol"]
#       from_port   = tonumber(split("-", rule["port_range"])[0])
#       to_port     = length(split("-", rule["port_range"])) > 1 ? tonumber(split("-", rule["port_range"])[1]) : tonumber(split("-", rule["port_range"])[0])
#       cidr_blocks = rule["dst_cidr"]
#       rule_type   = rule["rule_type"]
#       dst_sg      = rule["dst_sg"]
#     }
#     if rule["sg_name"] == "private_sg" && rule["rule_type"] == "ingress"
#   }
# }

module "network" {
  source = "./modules/network"

  vpc_name   = var.vpc_name
  cidr_block = var.cidr_block

  public_subnets           = var.public_subnets
  private_subnets          = var.private_subnets
  igw_name                 = var.igw_name
  eip_name                 = var.eip_name
  nat_gateway_name         = var.nat_gateway_name
  env                      = local.env
  public_sg_rules_ingress  = local.public_sg_rules_ingress
  private_sg_rules_ingress = local.private_sg_rules_ingress

}

module "iam" {
  source = "./modules/iam"

  eks_cluster_role_name = var.eks_cluster_role_name
  eks_node_role_name    = var.eks_node_role_name
  env                   = local.env
  depends_on            = [module.network]
}

data "aws_iam_group" "admins" {
  group_name = "admins"
}

locals {
  devops_users = data.aws_iam_group.admins.users[*].arn
  eks_access_entries_devops = flatten([
    for user_arn in local.devops_users : {
      cluster_name  = var.cluster_name
      principal_arn = user_arn
    }
  ])
}


module "kubernetes" {
  source                    = "./modules/eks"
  env                       = local.env
  cluster_name              = var.cluster_name
  eks_cluster_role_arn      = module.iam.iam_cluster_role_arn
  eks_access_entries_devops = local.eks_access_entries_devops
  eks_node_role_arn         = module.iam.iam_node_role_arn
  private_subnet_ids        = module.network.private_subnet_ids
  depends_on                = [module.iam, module.network]
}


# # This Terraform configuration sets up an Amazon EKS cluster with a VPC,
# # public and private subnets, and a node group using Spot Instances.
# # It uses the Terraform AWS provider and the Terraform AWS VPC module to create the necessary infrastructure.

# provider "aws" {
#   region  = var.aws_region
#   profile = "default"
# }

# module "vpc" {
#   source  = "terraform-aws-modules/vpc/aws"
#   version = "~> 5.0"

#   name = var.vpc_name
#   cidr = "10.0.0.0/16"                                           # VPC CIDR block
#   azs  = slice(["eu-west-3a", "eu-west-3b", "eu-west-3c"], 0, 3) # Select the first 3 availability zones

#   public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]     # Public subnets for the VPC
#   private_subnets = ["10.0.101.0/24", "10.0.102.0/24"] # Private subnets for the VPC, can be defined later

#   enable_nat_gateway   = true # Enable NAT Gateway for private subnets
#   single_nat_gateway   = true # Use a single NAT Gateway for cost efficiency
#   enable_dns_hostnames = true # Enable DNS hostnames in the VPC

#   public_subnet_tags = {
#     "kubernetes.io/role/elb" = 1 # Tag for public subnets to be used by ELB
#   }

#   private_subnet_tags = {
#     "kubernetes.io/role/internal-elb" = 1 # Tag for private subnets to be used by internal ELB
#   }
# }

# # --- EKS CLUSTER (CONTROL PLANE) ---
# resource "aws_eks_cluster" "main" {
#   name     = var.cluster_name
#   role_arn = aws_iam_role.eks_cluster_role.arn # IAM role for the EKS cluster

#   vpc_config {
#     subnet_ids             = module.vpc.private_subnets # Use private subnets for the EKS cluster
#     endpoint_public_access = true                       # Allow public access to the EKS API endpoint
#   }
#   access_config {
#     authentication_mode = "API_AND_CONFIG_MAP" # Authentication mode for the EKS cluster
#   }


#   depends_on = [aws_iam_role_policy_attachment.eks_cluster_policy]
#   version    = "1.32" # EKS cluster version
# }
# # --- IAM ROLE FOR EKS CLUSTER ---
# resource "aws_iam_role" "eks_cluster_role" {
#   name               = "${var.cluster_name}-cluster-role"
#   assume_role_policy = data.aws_iam_policy_document.eks_cluster_assume_role_policy.json
# }

# data "aws_iam_policy_document" "eks_cluster_assume_role_policy" {
#   statement {
#     actions = ["sts:AssumeRole"]
#     principals {
#       type        = "Service"
#       identifiers = ["eks.amazonaws.com"]
#     }
#   }
# }

# # --- EKS NODE GROUP (WORKERS) ---
# resource "aws_eks_node_group" "spot_workers" {
#   cluster_name    = aws_eks_cluster.main.name
#   node_group_name = "${var.cluster_name}-spot-workers"
#   node_role_arn   = aws_iam_role.eks_node_role.arn # IAM role for the EKS node group

#   subnet_ids = module.vpc.private_subnets # Use private subnets for the EKS node group

#   scaling_config {
#     desired_size = 1 # Desired number of worker nodes
#     max_size     = 3 # Maximum number of worker nodes
#     min_size     = 1 # Minimum number of worker nodes
#   }

#   instance_types = ["t3.large", "t2.large"] # Instance type for the worker nodes

#   capacity_type = "SPOT" # Use Spot Instances for cost efficiency
#   disk_size     = 20     # Disk size for the worker nodes
#   tags = {
#     Name = "${var.cluster_name}-spot-workers" # Tag for the worker nodes
#   }
#   depends_on = [aws_eks_cluster.main] # Ensure the EKS cluster is created before the node group
# }

# resource "aws_iam_role" "eks_node_role" {
#   name               = "${var.cluster_name}-node-group-role"
#   assume_role_policy = data.aws_iam_policy_document.eks_node_assume_role_policy.json
# }

# data "aws_iam_policy_document" "eks_node_assume_role_policy" {
#   statement {
#     actions = ["sts:AssumeRole"]
#     principals {
#       type        = "Service"
#       identifiers = ["ec2.amazonaws.com"] # EC2 service for worker nodes
#     }
#   }
# }

# # --- Attach required policies to node group role ---

# resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
#   role       = aws_iam_role.eks_node_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy" # Attach EKS Worker Node Policy
# }
# resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
#   role       = aws_iam_role.eks_node_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy" # Attach EKS CNI Policy
# }
# resource "aws_iam_role_policy_attachment" "eks_registry_policy" {
#   role       = aws_iam_role.eks_node_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly" # Attach ECR Read Only Policy
# }
# resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
#   role       = aws_iam_role.eks_node_role.name
#   policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy" # Attach EKS Cluster Policy
# }

