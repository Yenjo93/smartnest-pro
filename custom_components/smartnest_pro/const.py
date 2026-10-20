"""Constants for SmartNest (smartnest_pro)."""
from __future__ import annotations

from pathlib import Path

DOMAIN = "smartnest_pro"

PANEL_URL_PATH = "smartnest-pro"
PANEL_COMPONENT = "smartnest-pro-panel"
PANEL_TITLE = "SmartNest"
PANEL_ICON = "mdi:home-modern"

FRONTEND_DIR = Path(__file__).parent / "frontend"
STATIC_URL = "/smartnest_pro_static"

# Uploaded house images live in <config>/smartnest_pro/ and are served from here.
FILES_DIR = "smartnest_pro"
FILES_URL = "/smartnest_pro_files"

STORAGE_KEY = "smartnest_pro.dashboard"
STORAGE_VERSION = 1

SIGNAL_CONFIG_UPDATED = "smartnest_pro_config_updated"

MAX_UPLOAD_BYTES = 15 * 1024 * 1024
MAX_CONFIG_BYTES = 1024 * 1024
