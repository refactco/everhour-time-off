# Everhour and Google Calendar Integration
 This repository provides integration between Everhour and Google Calendar. The integration  sync time-off events from Everhour to Google Calendar.
 ## How to configure?
Here are the steps you should follow to get started on this project:
### Google Calendar API
 1. Go to [Google developer console](https://developers.google.com/workspace/guides/create-project).
 2. In the Google Cloud console, go to Menu **menu > IAM & Admin > Create a Project**.
 3. In the **Project Name** field, enter a descriptive name for your project.
 4. In the **Location** field, click **Browse** to display potential locations for your project. Then, click **Select**.
 5. Click **Create**. The console navigates to the Dashboard page and your project is created within a few minutes.
 6. In the Google Cloud console, enable the Google Calendar API.
 7. In the Google Cloud console, go to Menu **menu > APIs & Services > Credentials**.
 8. Click **Create Credentials > OAuth client ID**.
 9. Click **Application type > Desktop app**.
 10. In the **Name** field, type a name for the credential. This name is only shown in the Google Cloud console.
 11. Click **Create**. The OAuth client created screen appears, showing your new Client ID and Client secret.
 12. Click **OK**. The newly created credential appears under **OAuth 2.0 Client IDs**.
 13. Save the downloaded JSON file as `credentials.json`, and move the file to your working directory.
### Slack
 1. Create a new slack workspace or use an existing one.
 2. Go to [api.slack.com](https://api.slack.com/) and click on `Create New App` button.
 3. Choose `From scratch` option.
 4. Choose a name for your app and the workspace you want to create your slack app on.
 5. On the `left-side panel`, click on `OAuth & Permissions`.
 6. In the `Scopes` section, click on `Add an OAuth scope` of `Bot Token Scopes` and add the following scopes:
    * channels:history
    * channels:read
    * chat:write
    * im:history
    * im: read
    * incoming-webhook
    * users:read
    * users:read.email
  7. On the `left-side panel`, click on `OAuth & Permissions` and copy `Bot User OAuth Token`.
  8. Add Bot  in the channel you want to send the report.
### Everhour
 1. Go to [app.everhour.com](https://app.everhour.com/#/account/profile).
 2. On the `left-side panel`, click on `Setting`.
 3. On the `My profile` tab scroll down to `Application Access` and create a new `API Token`.
 ## Requirements for project deployment
  These are the requirements for project deployment:
  1. Install `serverless` module via NPM: `npm install -g serverless`.
  2. Configure your [AWS credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/).
  3. Clone the `main` branch of this repository.
  4. Install node modules using `npm i` command.
  5. Set the environment variables on `serverless.yml`  based on `serverless.example.yml` file.
  6. Deploy the project  by running: `serverless deploy`
    
 ## How to run the services and the project?
  It's required to follow the steps below, to run the services and the project:
  1. Install node modules using `npm i` command.
  2. Set the environment variables on `serverless.yml`  based on `serverless.example.yml` file.
  3. In order to test out your functions locally, you can invoke them with the following command:`serverless invoke local --function cronHandler`
    
    