#ALB SG
resource "aws_security_group" "alb_sg" {
  name = "alb_sg"
  vpc_id = var.vpc_id

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
    ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "alb_sg"
  }
}

resource "aws_security_group" "ecs_sg" {
  name = "ecs_sg"
  vpc_id = var.vpc_id
  ingress {
    from_port = 8080
    to_port = 8080
    protocol = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }
  tags = {
    Name = "ecs_sg"
  }
}

resource "aws_security_group" "db_sg" {
  name = "db_sg"
  vpc_id = var.vpc_id
  ingress {
    from_port = 3306
    to_port = 3306
    protocol = "tcp"
    security_groups = [aws_security_group.ecs_sg.id]
  }
  tags = {
    "Name" = "db_sg"
  }
}