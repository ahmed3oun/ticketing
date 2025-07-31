terraform {
  backend "s3" {
    bucket       = "ticketing-tf-state-bucket"
    key          = "infra/terraform.tfstate"
    region       = "eu-west-3"
    encrypt      = true
    use_lockfile = true
  }
}
