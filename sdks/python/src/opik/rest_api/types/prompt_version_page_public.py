# This file was auto-generated by Fern from our API Definition.

from ..core.pydantic_utilities import UniversalBaseModel
import typing
from .prompt_version_public import PromptVersionPublic
from ..core.pydantic_utilities import IS_PYDANTIC_V2
import pydantic


class PromptVersionPagePublic(UniversalBaseModel):
    page: typing.Optional[int] = None
    size: typing.Optional[int] = None
    total: typing.Optional[int] = None
    content: typing.Optional[typing.List[PromptVersionPublic]] = None

    if IS_PYDANTIC_V2:
        model_config: typing.ClassVar[pydantic.ConfigDict] = pydantic.ConfigDict(
            extra="allow", frozen=True
        )  # type: ignore # Pydantic v2
    else:

        class Config:
            frozen = True
            smart_union = True
            extra = pydantic.Extra.allow
