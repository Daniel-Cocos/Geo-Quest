Go to the Google Cloud Console. (https://console.cloud.google.com/apis)

- Enable the Maps Static API:
    - In the left sidebar, click Enabled APIs and Services.
    - Click + Enable APIs and Services
    - Search for "Street View Static API"
    - Click enable

- In the left sidebar, click Credentials.
- Click + create credentials > API key.
- Copy the generated API key to .env file as in .env.example

- make sure billing is enabled:
    - https://console.cloud.google.com/project/_/billing/enable
