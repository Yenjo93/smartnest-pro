#!/usr/bin/env python3
"""Owner commands using the local private secret file; never distribute that file."""
import json
import os
from pathlib import Path
import runpy
import sys

if len(sys.argv) < 2 or sys.argv[1] not in {"create", "list", "revoke", "reset"}:
    raise SystemExit("Usage: python3 license-service/manage.py create [--days DAYS] | list | revoke ID | reset ID")

root = Path(__file__).resolve().parent
secret_file = root / '.owner-secrets.json'
if not os.environ.get('SMARTNEST_ADMIN_TOKEN'):
    try:
        secret = json.loads(secret_file.read_text())['SMARTNEST_ADMIN_TOKEN']
    except (OSError, ValueError, KeyError):
        raise SystemExit('Set SMARTNEST_ADMIN_TOKEN or restore the private .owner-secrets.json file.')
    os.environ['SMARTNEST_ADMIN_TOKEN'] = secret
os.environ.setdefault('SMARTNEST_SERVICE_URL', 'https://licenses.smartnest.pro')
runpy.run_path(str(root / 'server.py'), run_name='__main__')
