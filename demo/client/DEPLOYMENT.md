# Deployment

## Configuration

You should copy `./public/data/config.template.json` to `./public/data/config.dev.json` and modify it to point the `apiEndpoint` to wherever you have deployed the `api` package.

```js
{
    "nodes": [                                      /* List of node to load balance across */  
        {
            "provider": "https://MYNODE/",          /* A node to perform Tangle operations */
            "depth": 3,                             /* Depth to use for attaches */
            "mwm": 9                                /* MWM to use for attaches */
        }
    ],
    "apiEndpoint": "API-ENDPOINT",                  /* URL of the demo API */
    "mamExplorer": "https://mam-explorer.firebaseapp.com/?root=:root&provider=:provider&mode=:mode&key=:sideKey",
     "tangleExplorer": {
        "transactions": "https://thetangle.org/transaction/:transactionHash",
        "bundles": "https://thetangle.org/bundle/:bundleHash"
    },
    "googleAnalyticsId": "GOOGLE-ANALYTICS-ID"      /* Optional, google analytics id */
}
```

## Build

```shell
npm run build
```

## Deploy

The app is configured to use zeit/now for hosting, you can configure `./now.json` to suit your own setup.

If you want to use a different name for the config file you can specify an environment variable of CONFIG_ID, e.g. set CONFIG_ID to `dev` will load `config.dev.json` instead.

After modifying the configuration files you can deploy using the folllowing commands:

```shell
now
```
