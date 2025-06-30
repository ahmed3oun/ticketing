variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "eu-west-3"
}

variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  default     = "ticketing-vpc"
}

# variable "jwt_secret" {
#   description = "JWT secret key"
#   type        = string
#   sensitive   = true
# }