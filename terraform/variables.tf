variable "unique_resource_id_prefix" {
  description = "The unique prefix to apply to all resources."
  type        = string
  default     = "mychatbot004" 
}

variable "chatbot_container_name" {
  description = "The unique prefix to apply to all resources."
  type        = string
  default     = "mychatbot004chatbotacr" 
}


variable "chatbot_container_tag_acr" {
  description = "The tag of the chatbot container in ACR"
  type        = string
}