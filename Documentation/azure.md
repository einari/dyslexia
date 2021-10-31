# Azure

## GitHub Actions

To create or update a container instance we need credentials to Azure for doing so.

Based on [this article](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-github-action) and
specifically using `az` (Azure CLI) to perform the create/update from [this article](https://docs.microsoft.com/en-us/azure/container-instances/container-instances-update).

We need to create a service principal:

```shell
$ groupId=$(az group show --name instances --subscription {subscription id} --query id --output tsv)
$ az ad sp create-for-rbac --scope $groupId --role Contributor --sdk-auth
````

From this you'll get:

```json
{
  "clientId": "{some id}",
  "clientSecret": "{some secret",
  "subscriptionId": "{subscription id}",
  "tenantId": "{tenant id}",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

We register this as a secret in the GitHub repo settings as `AZURE_CREDENTIALS` and use this in the publish workflow to login:

```yml
      - name: Login via Az module
        uses: azure/login@v1.1
        with:
          creds: ${{  secrets.AZURE_CREDENTIALS }}
```

Then we add a step in the flow that talks to Azure to get it to deploy the version:

```yml
      - name: Create / Update Azure Container instance with new image
        run: |
          az container create -g instances --name dyslexia --dns-name-label dyslexia --image einari/dyslexia:${{ steps.release.outputs.version }} --restart-policy OnFailure
````

> Note: If the `--restart-policy OnFailure` is omitted, it gives the following error:
> The updates on container group 'dyslexia' are invalid. If you are going to update the os type, restart policy, network profile, CPU, memory or GPU resources for a container group, you must delete it first and then create a new one.
> As also observed by others: https://github.com/MicrosoftFeedback/aci-issues/issues/26#issuecomment-638127446
