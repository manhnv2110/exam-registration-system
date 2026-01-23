variable "vpc_id" {
  type = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "public_subnet_1_cidr" {
  description = "CIDR block for public subnet 1"
  type        = string
}

variable "public_subnet_2_cidr" {
  description = "CIDR block for public subnet 2"
  type        = string
}

variable "private_subnet_1_cidr" {
  description = "CIDR block for private subnet app 1"
  type        = string
}

variable "private_subnet_2_cidr" {
  description = "CIDR block for private subnet app 2"
  type        = string
}

variable "private_subnet_3_cidr" {
  description = "CIDR block for private subnet db 1"
  type        = string
}

variable "private_subnet_4_cidr" {
  description = "CIDR block for private subnet db 2"
  type        = string
}