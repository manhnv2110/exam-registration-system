module "vpc" {
  source   = "./modules/vpc"
  vpc_cidr = var.vpc_cidr
  region   = var.region
}

module "subnet" {
  source                 = "./modules/subnet"
  vpc_id                 = module.vpc.vpc_id
  region                 = var.region
  public_subnet_1_cidr   = var.public_subnet_1_cidr
  public_subnet_2_cidr   = var.public_subnet_2_cidr
  private_subnet_1_cidr  = var.private_subnet_1_cidr
  private_subnet_2_cidr  = var.private_subnet_2_cidr
  private_subnet_3_cidr  = var.private_subnet_3_cidr
  private_subnet_4_cidr  = var.private_subnet_4_cidr
}

module "security_group" {
  source = "./modules/security-group"
  vpc_id = module.vpc.vpc_id
}
