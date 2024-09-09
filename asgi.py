from pprint import pprint
from urllib.parse import urljoin

import requests

api_token = "dcb1f352c1dce6bbc84ff3dddfd3771bc368c498"  # Update to match your real API token
headers = {"Authorization": f"Token {api_token}"}

username = "melory548"  # update to match your username!

pythonanywhere_host = "www.pythonanywhere.com"  # or "eu.pythonanywhere.com" if your account is hosted on our EU servers
pythonanywhere_domain = "pythonanywhere.com"  # or "eu.pythonanywhere.com"

# make sure you don't use this domain already!
domain_name = f"{username}.{pythonanywhere_domain}"

api_base = f"https://{pythonanywhere_host}/api/v1/user/{username}/"
command = (
    f"/home/{username}/.virtualenvs/my_venv/bin/uvicorn "
    f"--app-dir /home/{username}/GamblingWebBot/backend/GamblingWebBot/backend "
    "--uds $DOMAIN_SOCKET "
    "main:app ")

response = requests.post(
    urljoin(api_base, "websites/"),
    headers=headers,
    json={
        "domain_name": domain_name,
        "enabled": True,
        "webapp": {
            "command": command
        }
    },
)
pprint(response.json())
