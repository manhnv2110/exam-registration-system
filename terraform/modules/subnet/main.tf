resource "aws_internet_gateway" "igw" {
  vpc_id = var.vpc_id
  tags = {
    "Name" = "uet-igw"
  }
}

resource "aws_subnet" "public_subnet_1" {
  vpc_id = var.vpc_id
  cidr_block = var.public_subnet_1_cidr
  availability_zone = "${var.region}a"
  map_public_ip_on_launch = true
  tags = {
    Name = "Public Subnet 1"
  }
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id = var.vpc_id
  cidr_block = var.public_subnet_2_cidr
  availability_zone = "${var.region}b"
  map_public_ip_on_launch = true
  tags = {
    Name = "Public Subnet 2"
  }
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id = var.vpc_id
  cidr_block = var.private_subnet_1_cidr
  availability_zone = "${var.region}a"
  tags = {
    Name = "Private Subnet 1"
  }
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id = var.vpc_id
  cidr_block = var.private_subnet_2_cidr
  availability_zone = "${var.region}b"
  tags = {
    Name = "Private Subnet 2"
  }
}

resource "aws_subnet" "private_subnet_3" {
  vpc_id = var.vpc_id
  cidr_block = var.private_subnet_3_cidr
  availability_zone = "${var.region}a"
  tags = {
    Name = "Private Subnet 3"
  }
}

resource "aws_subnet" "private_subnet_4" {
  vpc_id = var.vpc_id
  cidr_block = var.private_subnet_4_cidr
  availability_zone = "${var.region}b"
  tags = {
    Name = "Private Subnet 4"
  }
}
