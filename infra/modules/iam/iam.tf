# Create IAM Role for EKS Cluster
resource "aws_iam_role" "eks_cluster_role" {
  name = "${var.eks_cluster_role_name}-${var.env}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}
# Attach EKS Cluster Policy
resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  depends_on = [aws_iam_role.eks_cluster_role]
}
# Attach EKS Service Policy
resource "aws_iam_role_policy_attachment" "eks_service_policy" {
  role       = aws_iam_role.eks_cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
  depends_on = [aws_iam_role.eks_cluster_role]
}

# Create IAM Role for EKS Node Group
resource "aws_iam_role" "eks_node_role" {
  name = "${var.eks_node_role_name}-${var.env}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
  depends_on = [aws_iam_role.eks_cluster_role]
}

# Attach EKS Node Group Policies
resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  depends_on = [aws_iam_role.eks_node_role]
}

# Attach EKS CNI Policy
resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  role       = aws_iam_role.eks_node_role.name                # IAM role for the EKS node group
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy" # Attach EKS CNI Policy
  depends_on = [aws_iam_role.eks_node_role]
}

# Attach ECR Read Only Policy
resource "aws_iam_role_policy_attachment" "ec2_container_registry_read_only" {
  role       = aws_iam_role.eks_node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly" # Attach ECR Read Only Policy
  depends_on = [aws_iam_role.eks_node_role]
}


