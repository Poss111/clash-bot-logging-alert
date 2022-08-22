resource "aws_security_group" "clash-bot-lambda-sg" {
  name   = "clash-bot-obs-lambda-sg"
  vpc_id = data.tfe_outputs.clash-bot-discord-bot.values.vpc_id

  ingress {
    protocol  = "tcp"
    from_port = var.lambda_port
    to_port   = var.lambda_port
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}