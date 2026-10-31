#!/usr/bin/env python3
"""Pin the owner's HTTPS service in the integration before distribution."""
import argparse
from pathlib import Path
import runpy

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('url', help='Public HTTPS origin of your deployed license service')
args = parser.parse_args()
policy = runpy.run_path(str(root / 'custom_components/smartnest_pro/licensing.py'))
try:
    url = policy['normalize_url'](args.url)
except ValueError:
    parser.error('Use a valid HTTPS URL without credentials, query or fragment')
target = root / 'custom_components/smartnest_pro/license_server.py'
target.write_text('"""Owner-controlled endpoint. Set before distributing the integration."""\nLICENSE_SERVICE_URL = ' + repr(url) + '\n')
print('License service configured. Distribute the updated integration and restart Home Assistant.')
