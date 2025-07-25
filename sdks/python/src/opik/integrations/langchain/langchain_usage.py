from typing import Optional, Dict, Any

import pydantic


class InputTokenDetails(pydantic.BaseModel):
    model_config = pydantic.ConfigDict(extra="allow")

    cache_read: int
    """Number of tokens read from the cache."""


class OutputTokenDetails(pydantic.BaseModel):
    model_config = pydantic.ConfigDict(extra="allow")

    reasoning: int
    """Number of tokens generated by the model for reasoning."""


class LangChainUsage(pydantic.BaseModel):
    input_tokens: int
    """Number of tokens in the prompt."""

    output_tokens: int
    """Number of tokens in the response(s)."""

    total_tokens: int
    """Total token count for prompt, response candidates, and reasoning."""

    input_token_details: Optional[InputTokenDetails]
    """Breakdown of tokens used in the prompt."""

    output_token_details: Optional[OutputTokenDetails]
    """Breakdown of tokens used in a response."""

    @classmethod
    def from_original_usage_dict(cls, usage: Dict[str, Any]) -> "LangChainUsage":
        usage_dict = {**usage}
        input_token_details_raw = usage_dict.pop("input_token_details", None)
        output_token_details_raw = usage_dict.pop("output_token_details", None)

        input_token_details = (
            InputTokenDetails(**input_token_details_raw)
            if isinstance(input_token_details_raw, dict)
            else None
        )

        output_token_details = (
            OutputTokenDetails(**output_token_details_raw)
            if isinstance(output_token_details_raw, dict)
            else None
        )

        return cls(
            **usage_dict,
            input_token_details=input_token_details,
            output_token_details=output_token_details,
        )

    def map_to_google_gemini_usage(self) -> Dict[str, Any]:
        google_usage = {
            "prompt_token_count": self.input_tokens,
            "candidates_token_count": self.output_tokens,
            "total_token_count": self.total_tokens,
        }
        if self.input_token_details is not None:
            google_usage["cached_content_token_count"] = (
                self.input_token_details.cache_read
            )

        if self.output_token_details is not None:
            google_usage["thoughts_token_count"] = self.output_token_details.reasoning

        return google_usage
