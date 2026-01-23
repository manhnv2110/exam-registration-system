variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-1"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_1_cidr" {
  description = "CIDR block for public subnet 1"
  type        = string
  default     = "10.0.1.0/24"
}

variable "public_subnet_2_cidr" {
  description = "CIDR block for public subnet 2"
  type        = string
  default     = "10.0.2.0/24"
}

variable "private_subnet_1_cidr" {
  description = "CIDR block for private subnet app 1"
  type        = string
  default     = "10.0.11.0/24"
}

variable "private_subnet_2_cidr" {
  description = "CIDR block for private subnet app 2"
  type        = string
  default     = "10.0.12.0/24"
}

variable "private_subnet_3_cidr" {
  description = "CIDR block for private subnet db 1"
  type        = string
  default     = "10.0.21.0/24"
}

variable "private_subnet_4_cidr" {
  description = "CIDR block for private subnet db 2"
  type        = string
  default     = "10.0.22.0/24"
}
