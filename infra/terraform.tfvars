
vpc_name   = "ticketing-vpc"
cidr_block = "10.0.0.0/16"


public_subnets = [
  {
    name              = "public-subnet-1"
    cidr_block        = "10.0.1.0/24"
    availability_zone = "eu-west-3a"
  },
  {
    name              = "public-subnet-2"
    cidr_block        = "10.0.2.0/24"
    availability_zone = "eu-west-3b"
  }
]

private_subnets = [
  {
    name              = "private-subnet-1"
    cidr_block        = "10.0.3.0/24"
    availability_zone = "eu-west-3a"
  },
  {
    name              = "private-subnet-2"
    cidr_block        = "10.0.4.0/24"
    availability_zone = "eu-west-3b"
  }
]

igw_name         = "ticketing-igw"
eip_name         = "ticketing-eip"
nat_gateway_name = "ticketing-nat-gateway"
aws_region       = "eu-west-3"
cluster_name     = "ticketing-eks"

eks_cluster_role_name = "ticketing-eks-cluster-role"
eks_node_role_name    = "ticketing-eks-node-role"
