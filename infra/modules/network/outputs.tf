output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main2.id
}

output "private_subnet_ids" {
  description = "The IDs of the private subnets"
  value       = aws_subnet.private.*.id
}

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.public.*.id
}

output "public_sg_id" {
  description = "The ID of the public security group"
  value       = aws_security_group.public_sg.id
}

output "private_sg_id" {
  description = "The ID of the private security group"
  value       = aws_security_group.private_sg.id
}
