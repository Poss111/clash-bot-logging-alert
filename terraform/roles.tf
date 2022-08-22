resource "aws_iam_policy" "cloudwatch_iam_policy" {
  name = "clash-bot-cloudwatch-lambda-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = var.cloudwatch_iam_policies,
        Resource = ["*"]
      }
    ]
  })
}

resource "aws_iam_policy" "network_iam_policy" {
  name = "clash-bot-cloudwatch-lambda-policy"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = var.network_iam_policies,
        Resource = ["*"]
      }
    ]
  })
}

resource "aws_lambda_permission" "log_event_trigger_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.clash_bot_notification_lambda.function_name
  principal     = "logs.${var.region}.amazonaws.com"
  source_arn    = "arn:aws:logs:${var.region}:${data.aws_caller_identity.current.account_id}:log-group:/clash-bot-*"
}

resource "aws_iam_role" "clash-bot-obs-lambda-role" {
  name = "clash-bot-obs-lambda-role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cloudwatch-policy-attachment" {
  role       = aws_iam_role.clash-bot-obs-lambda-role.name
  policy_arn = aws_iam_policy.cloudwatch_iam_policy.arn
}

resource "aws_iam_role_policy_attachment" "network-policy-attachment" {
  role       = aws_iam_role.clash-bot-obs-lambda-role.name
  policy_arn = aws_iam_policy.network_iam_policy.arn
}