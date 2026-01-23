resource "aws_vpc" "uet_vpc" {
  cidr_block = var.vpc_cidr
  tags = {
    Name = "uet-vpc"
  }
}