# Everhour Integration with Google Calendar and Slack   
 This repository provides integration between Everhour, Google Calendar, and Slack to streamline time-off management and reporting. The integration allows users to enable or disable various features to enhance their time-off tracking experience.
## Features
The integration offers the following features, all of which are enabled by default. However, you have the flexibility to disable specific features by configuring the environment variables:

1. **Send Time-Off Report to Slack Channel**: Enable this feature to automatically send time-off reports to a specified Slack channel. This ensures that team members are aware of each other's time-off schedules and can plan their work accordingly.

2. **Daily Time-Off Report**: By enabling this feature, you can receive a daily report summarizing all time-off requests for the day. This report helps managers and team members stay up-to-date with the current time-off schedule.

3. **Weekly Time-Off Report**: This feature enables the generation of a weekly report that provides an overview of all time-off requests submitted during the week. It helps team leads and HR personnel analyze time-off trends and plan resources accordingly.

4. **Sync with Calendar**: Enable this feature to synchronize time-off requests with your Google Calendar. When a time-off request is approved or updated in Everhour, it will automatically reflect in your calendar, ensuring that your schedule remains accurate and up-to-date.
## Scheduled Functions
The integration includes three scheduled Lambda functions that automate the generation and delivery of reports. These functions are configured in the serverless.yml file and are triggered at specific intervals using AWS CloudWatch Events.

1. **cronHandler**:

* **Handler**: index.run  
* **Event**: Invoke Lambda function every 30 minutes  
The cronHandler function is responsible for continuously monitoring and processing time-off events. It ensures that the integration stays up-to-date with any changes in time-off requests or settings.

2. **dailyReportHandler**:

* **Handler**: daily-report.run
* **Event**: Invoke Lambda function at 05:00 AM (UTC+0) every day  
The dailyReportHandler function generates a daily report summarizing all time-off requests for the day. It runs once a day at a specified time and sends the report to the configured recipients.

3. **weeklyReportHandler**:

* **Handler**: weekly-report.run
* **Event**: Invoke Lambda function at 04:30 AM (UTC+0) every Sunday  
The weeklyReportHandler function generates a weekly report that provides an overview of all time-off requests submitted during the week. It runs once a week on Sunday at a specified time and sends the report to the configured recipients.

These scheduled functions ensure that the time-off reports are generated and delivered automatically without manual intervention. You can modify the schedule timings by updating the corresponding cron expressions in the `serverless.yml` file to suit your specific needs.



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
     * **EVER_HOUR_API**: The base URL for the Everhour API (https://api.everhour.com). This variable specifies the endpoint where the integration will communicate with Everhour to retrieve time-off events and make any 
      necessary updates.

      * **EVER_HOUR_TOKEN**: Your Everhour API token. This token serves as an authentication credential, allowing the integration to access your Everhour account and perform actions on your behalf.

      * **TIME_ZONE**: The time zone to be used for the integration. This variable determines the time zone in which the time-off events and reports will be generated and synced.

      * **SLACK_BOT_TOKEN**: Your Slack bot token. If Slack integration is enabled, this token is used to authenticate the integration with your Slack workspace, allowing it to send notifications and reports to Slack channels.

      * **REPORT_CHANNEL_ID**: The ID of the Slack channel where time-off reports will be posted. This variable specifies the destination channel for the integration to share daily and weekly time-off reports.

      * **CALENDAR_NAME**: The name of the Google Calendar that will be synced with Everhour. This variable specifies the target calendar where time-off events will be added or updated.

      * **ENABLE_SYNC_TIME_OFF_WITH_CALENDAR**: A boolean value (true or false) indicating whether the integration should synchronize time-off events with the specified Google Calendar. If set to true, time-off events will 
         be synced; if set to false, no synchronization will occur.

      * **ENABLE_SLACK_TIME_OFF_REPORT_CHANNEL**: A boolean value indicating whether the integration should post time-off reports to the designated Slack channel. If set to true, reports will be shared; if set to false, no 
        reports will be sent to Slack.

      * **ENABLE_DAILY_TIME_OFF_REPORT**: A boolean value indicating whether the integration should generate and share a daily time-off report. If set to true, a daily report will be generated; if set to false, no daily 
        the report will be created.

       * **ENABLE_WEEKLY_TIME_OFF_REPORT**: A boolean value indicating whether the integration should generate and share a weekly time-off report. A weekly report will be generated; if set to false, no weekly report will be created.
  6. Deploy the project  by running: `serverless deploy`
    
 ## How to run the services and the project?
  It's required to follow the steps below, to run the services and the project:
  1. Install node modules using `npm i` command.
  2. Set the environment variables on `serverless.yml`  based on `serverless.example.yml` file.
  3. In order to test out your functions locally, you can invoke them with the following command:`serverless invoke local --function cronHandler`
## Contributing
  Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.
## License
This project is licensed under the MIT License. Feel free to use, modify, and distribute the code for both commercial and non-commercial purposes.
    
