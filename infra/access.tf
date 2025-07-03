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



resource "aws_eks_access_entry" "devops_access" {
  for_each = { for id, entry in local.eks_access_entries_devops : id => entry }

  cluster_name  = var.cluster_name
  principal_arn = each.value.principal_arn

  depends_on = [aws_eks_node_group.spot_workers, data.aws_iam_group.admins]

}

resource "aws_eks_access_policy_association" "devops" {
  for_each = { for id, entry in local.eks_access_entries_devops : id => entry }

  cluster_name  = each.value.cluster_name
  principal_arn = each.value.principal_arn
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
  access_scope {
    type = "cluster"
  }
  depends_on = [aws_eks_access_entry.devops_access]

}
