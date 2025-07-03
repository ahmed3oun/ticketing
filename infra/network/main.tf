resource "aws_vpc" "main2" {
  cidr_block           = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "${var.vpc_name}-${var.env}"
  }
}

# 2.create public subnets
resource "aws_subnet" "public" {
  count                   = length(var.public_subnets)
  vpc_id                  = aws_vpc.main2.id
  cidr_block              = var.cidr_block[count.index].cidr_block
  availability_zone       = var.cidr_block[count.index].availability_zone
  map_public_ip_on_launch = true # Enable public IP assignment

  tags = {
    "Name" = "${var.public_subnets[count.index].name}-${var.env}"
  }
  depends_on = [aws_vpc.main2]
}

# 3.create private subnets
resource "aws_subnet" "private" {
  count             = length(var.private_subnets)
  vpc_id            = aws_vpc.main2.id
  cidr_block        = var.private_subnets[count.index].cidr_block
  availability_zone = var.private_subnets[count.index].availability_zone

  tags = {
    "Name" = "${var.private_subnets[count.index].name}-${var.env}"
  }
  depends_on = [aws_vpc.main2]
}

# 4.create internet gateway (for public subnets)
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main2.id

  tags = {
    "Name" = "${var.igw_name}-${var.env}"
  }
  depends_on = [aws_vpc.main2]
}

# 5.create elastic IP for NAT Gateway
resource "aws_eip" "nat_eip" {
  count  = length(var.public_subnets)
  domain = "vpc"
  tags = {
    "Name" = "${var.eip_name}-${var.env}"
  }
  depends_on = [aws_internet_gateway.igw]
}

# 6.create NAT Gateway in 1st public subnet
resource "aws_nat_gateway" "nat" {
  count         = length(var.public_subnets)
  allocation_id = aws_eip.nat_eip[count.index].id
  subnet_id     = aws_subnet.public[count.index].id # Use the first public subnet for NAT Gateway

  tags = {
    "Name" = "${var.nat_gateway_name}-${var.env}"
  }
  depends_on = [aws_internet_gateway.igw, aws_subnet.public] # Ensure public subnets are created before NAT Gateway
}

# 7.create public route table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main2.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
  tags = {
    "Name" = "${var.public_route_table_name}-${var.env}"
  }
  depends_on = [aws_internet_gateway.igw, aws_subnet.public] # Ensure public subnets are created before route table
}

# 8. create private route table
# Note: All private subnets will use the same NAT Gateway, so we only need one
# route table for all private subnets.
resource "aws_route_table" "private" {
  count  = length(var.private_subnets)
  vpc_id = aws_vpc.main2.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat[count.index].id # Use the first NAT Gateway for all private subnets
  }

  tags = {
    "Name" = "${var.private_subnets[count.index].name}-${var.env}-private-route-table"
  }
  depends_on = [aws_nat_gateway.nat, aws_subnet.private] # Ensure NAT Gateway and private subnets are created before the route table
}

# 9.create route table association for public subnets
resource "aws_route_table_association" "public" {
  count          = length(var.public_subnets)
  subnet_id      = element(aws_subnet.public[*].id, count.index)
  route_table_id = element(aws_route_table.public[*].id, count.index)

  depends_on = [aws_route_table.public, aws_subnet.public]
}

# 10.create route table association for private subnets
resource "aws_route_table_association" "private" {
  count          = length(var.private_subnets)
  subnet_id      = element(aws_subnet.private[*].id, count.index)
  route_table_id = element(aws_route_table.private[*].id, count.index)
  depends_on     = [aws_route_table.private, aws_subnet.private]
}

# 11.create public security group
resource "aws_security_group" "public_sg" {
  name        = "public-sg"
  vpc_id      = aws_vpc.main2.id
  description = "Allow HTTP and SSH"
  tags = {
    Name = "public-sg-${var.env}"
  }

  depends_on = [aws_subnet.public]
}

# 12.create private security group
resource "aws_security_group" "private_sg" {
  name        = "private-sg"
  vpc_id      = aws_vpc.main2.id
  description = "Allow traffic from public SG"
  tags = {
    Name = "private-sg-${var.env}"
  }
  depends_on = [aws_subnet.private]
}

# 13.create public security group rules
resource "aws_security_group_rule" "public_sg_rule" {
  for_each = var.public_sg_rules_ingress

  security_group_id = aws_security_group.public_sg.id
  description       = each.value.description
  type              = each.value.rule_type
  from_port         = each.value.from_port
  to_port           = each.value.to_port
  protocol          = each.value.protocol
  cidr_blocks       = [each.value.cidr_blocks] != "" ? [each.value.cidr_blocks] : null
  depends_on        = [aws_security_group.public_sg]
}

# 14.create private security group rules
resource "aws_security_group_rule" "private_sg_rule" {
  for_each                 = var.private_sg_rules_ingress
  security_group_id        = aws_security_group.private_sg.id
  description              = each.value.description
  type                     = each.value.rule_type
  from_port                = each.value.from_port
  to_port                  = each.value.to_port
  protocol                 = each.value.protocol
  cidr_blocks              = [each.value.cidr_blocks] != "" ? [each.value.cidr_blocks] : null
  source_security_group_id = each.value.dst_sg != "" ? aws_security_group.public_sg.id : null
  depends_on               = [aws_security_group.private_sg]
}


