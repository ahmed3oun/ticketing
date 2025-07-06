variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  validation {
    condition     = length(var.vpc_name) > 2 && length(var.vpc_name) <= 64
    error_message = "VPC name must be between 2 and 64 characters."
  }
  default = "ticketing-vpc"
}

variable "cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
  validation {
    condition     = can(regex("^(\\d{1,3}\\.){3}\\d{1,3}/\\d{1,2}$", var.cidr_block))
    error_message = "CIDR block must be in the format x.x.x.x/x."
  }
}

variable "public_subnets" {
  type = list(object({
    name              = string # Name of the public subnet
    cidr_block        = string # CIDR block for the public subnet  (e.g. "10.0.1.0/24)"
    availability_zone = string # Availability zone for the public subnet (e.g. "eu-west-3a")
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
  description = "Name of the Internet Gateway"
  type        = string
  default     = "ticketing-igw"
}

variable "eip_name" {
  description = "Name of the Elastic IP"
  type        = string
  default     = "ticketing-eip"
}

variable "nat_gateway_name" {
  description = "Name of the NAT Gateway"
  type        = string
  default     = "ticketing-nat-gateway"
}

variable "public_route_table_name" {
  description = "Name of the public route table"
  type        = string
  default     = "ticketing-public-route-table"
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

variable "public_sg_rules_ingress" {
  description = "Ingress rules for the public security group"
  type = map(object({
    # description = string # e.g., "Allow HTTP traffic"
    from_port   = number # e.g., 80 for HTTP, 443 for HTTPS
    to_port     = number # e.g., 80 for HTTP, 443 for HTTPS
    protocol    = string # e.g., "tcp", "udp", "icmp"
    cidr_blocks = string # e.g., "x.x.x.x/32" or "x.x.x.x/24"
    rule_type   = string # e.g., "ingress"
    dst_sg      = string # Destination security group ID (optional, can be empty)
  }))
}

variable "private_sg_rules_ingress" {
  description = "Ingress rules for the private security group"
  type = map(object({
    # description = string # e.g., "Allow traffic from public SG"
    from_port   = number # e.g., 80 for HTTP, 443 for HTTPS
    to_port     = number # e.g., 80 for HTTP, 443 for HTTPS
    protocol    = string # e.g., "tcp", "udp", "icmp"
    cidr_blocks = string # e.g., "x.x.x.x/32" or "x.x.x.x/24"
    rule_type   = string # e.g., "ingress"
    dst_sg      = string # Destination security group ID (optional, can be empty)
  }))
}
