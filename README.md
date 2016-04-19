# sysdig-to-slack
How to get a Sysdig Cloud SNS notification to Slack using a Lambda function

Sysdig alerts come in the following format. I left out a lot of SNS related fields, showingony the actual message.

````
event = {
"Records":[
 {
   "Sns": {
     "Message": "the follow event fired\n\nName: my alarm name\nSeverity: critical (2)\nScope: agent.tag.stack = clientname., host.hostNAme = masos (12:23:23:34)\nNotification URL: http://mysite"
   }
 }
 ]
}
````

Sysdig does not provide a way to select the SNS Topic to use per Alert but all alerts are send to all emailaddresses and Topics given. But I'd like to use 2 channels in Slack where one simply shows all the alerts and another where only the critical production alerts are sent to.

All our hosts have a tag called `stack` and `environment` so we can add a bit of routing logic in our Lambda.
