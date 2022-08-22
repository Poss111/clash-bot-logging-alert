terraform {
  cloud {
    organization = "ClashBot"

    workspaces {
      name = "ClashBot-Obs"
    }
  }
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.21.0"
    }
  }
}

provider "aws" {
  access_key = var.access_key
  secret_key = var.secret_key
  region     = var.region

  default_tags {
    tags = {
      Application = "Clash-Bot-Webapp"
      Type        = "Observability"
    }
  }
}

data "tfe_outputs" "clash-bot-discord-bot" {
  organization = "ClashBot"
  workspace    = "ClashBot"
}

data "aws_caller_identity" "current" {}

resource "aws_cloudwatch_log_subscription_filter" "clash_bot_error_cloudwatch_filter" {
  depends_on      = [aws_lambda_permission.log_event_trigger_permission]
  name            = "error_event_service"
  log_group_name  = var.ecs_service_log_group_name
  filter_pattern  = "{$.level = 50}"
  destination_arn = aws_lambda_function.clash_bot_notification_lambda.arn
  distribution    = "ByLogStream"
}

resource "aws_lambda_alias" "clash_bot_notification_lambda_alias" {
  name             = "Clash_Bot_Notification_Alias"
  description      = "A version of the Clash Bot Notification Lambda."
  function_name    = aws_lambda_function.clash_bot_notification_lambda.arn
  function_version = var.release_version
}

resource "aws_lambda_function_event_invoke_config" "clash_bot_func_event_config" {
  function_name          = aws_lambda_alias.clash_bot_notification_lambda_alias.function_name
  maximum_retry_attempts = 2
}

resource "aws_lambda_function" "clash_bot_notification_lambda" {
  depends_on    = [aws_iam_role_policy_attachment.cloudwatch-policy-attachment, aws_iam_policy.network_iam_policy]
  function_name = "clash-bot-obs-function"
  role          = aws_iam_role.clash-bot-obs-lambda-role.arn
  image_uri     = var.image_id
  package_type  = "Image"
  architectures = ["x86_64"]
  description   = "Used to publish error logs to the LoL-ClashBotSupport Discord server."

  timeout = 30

  vpc_config {
    security_group_ids = [aws_security_group.clash-bot-lambda-sg.id]
    subnet_ids         = data.tfe_outputs.clash-bot-discord-bot.values.private_subnet_ids
  }

  environment {
    variables = {
      DISCORD_WEBHOOK_URL = var.webhook_url
    }
  }
}
