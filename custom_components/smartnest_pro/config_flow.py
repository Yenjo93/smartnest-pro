"""Activate SmartNest, or change its license without losing the saved layout."""
from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import TextSelector, TextSelectorConfig, TextSelectorType

from .const import DOMAIN
from .license_server import LICENSE_SERVICE_URL
from .licensing import (
    CONF_LICENSE_KEY, LicenseDenied, LicenseUnavailable,
    installation_id, normalize_url, validate,
)


class SmartNestProConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")
        return await self._activation("user", user_input)

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        return await self._activation("reconfigure", user_input)

    async def _activation(self, step: str, user_input: dict[str, Any] | None) -> ConfigFlowResult:
        errors = {}
        entry = self.hass.config_entries.async_get_entry(self.context["entry_id"]) if step == "reconfigure" else None
        if user_input is not None:
            try:
                if not LICENSE_SERVICE_URL:
                    return self.async_show_form(step_id=step, errors={"base": "service_not_configured"}, data_schema=self._schema())
                url = normalize_url(LICENSE_SERVICE_URL)
                key = user_input[CONF_LICENSE_KEY].strip()
                if not 16 <= len(key) <= 256:
                    raise LicenseDenied()
                await validate(async_get_clientsession(self.hass), url, key, await installation_id(self.hass))
            except ValueError:
                errors["base"] = "service_not_configured"
            except LicenseDenied:
                errors["base"] = "invalid_license"
            except LicenseUnavailable:
                errors["base"] = "cannot_connect"
            else:
                data = {CONF_LICENSE_KEY: key}
                if entry is not None:
                    return self.async_update_reload_and_abort(entry, data_updates=data, reason="reconfigure_successful")
                return self.async_create_entry(title="SmartNest", data=data)
        return self.async_show_form(
            step_id=step,
            data_schema=self._schema(),
            errors=errors,
        )

    @staticmethod
    def _schema():
        return vol.Schema({
            vol.Required(CONF_LICENSE_KEY): TextSelector(TextSelectorConfig(type=TextSelectorType.PASSWORD)),
        })
