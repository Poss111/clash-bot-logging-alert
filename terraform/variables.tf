variable "access_key" {
  default   = ""
  type      = string
  sensitive = true
}

variable "secret_key" {
  default   = ""
  type      = string
  sensitive = true
}

variable "region" {
  default = "us-east-1"
  type    = string
}

variable "release_version" {
  default = ""
  type    = string
}

variable "ecs_service_log_group_name" {
  default = ""
  type    = string
}

variable "image_id" {
  default   = ""
  type      = string
  sensitive = true
}

variable "webhook_url" {
  default   = ""
  type      = string
  sensitive = true
}

variable "lambda_port" {
  default   = ""
  sensitive = true
}