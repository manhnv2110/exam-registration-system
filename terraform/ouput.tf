output "vpc_id" {
  value = module.vpc.vpc_id
}

output "public_subnet_1_id" {
  value = module.subnet.public_subnet_1_id
}

output "public_subnet_2_id" {
  value = module.subnet.public_subnet_2_id
}

output "private_subnet_1_id" {
  value = module.subnet.private_subnet_1_id
}

output "private_subnet_2_id" {
  value = module.subnet.private_subnet_2_id
}

output "private_subnet_3_id" {
  value = module.subnet.private_subnet_3_id
}

output "private_subnet_4_id" {
  value = module.subnet.private_subnet_4_id
}

output "alb_sg_id" {
  value = module.security_group.alb_sg_id
}

output "ecs_sg_id" {
  value = module.security_group.ecs_sg_id
}

output "db_sg_id" {
  value = module.security_group.db_sg_id
}
