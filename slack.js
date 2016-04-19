var Slack = require('slack-node');

// url where all alerts are send to
webhookUri = "https://hooks.slack.com/services/...";

// webhook url used only for critical production alerts
webhoorkUriSupport = "https://hooks.slack.com/services/...";

exports.myhandler = function(event, context) {
  msg = event.Records[0].Sns.Message;

  var spl = msg.split("\n");
  var obj = {};
  for (var i = 0; i < spl.length; i++) {
    if (spl[i].indexOf(':') > 0) {
      var split = splitOnce(spl[i], ':');
      obj[split[0].trim()] = split[1].trim();
    }
  }
  stacksp = obj.Scope.split("stack =");
  stackname = stacksp[1].split(",",1);

  slmsg = "The following event just fired: *"+obj.Name+"*\n\nSeverity: "+obj.Severity+"\nScope: "+obj.Scope.replace(stackname, "*"+stackname+"*")+"\n\nDescription: "+obj.Description+"\nNotification URL: "+obj['Notification URL']

  slack = new Slack();

  // if critical and for production, also send to support channel
  if (obj.Severity.split(" ",2)[0] == "critical" && stackname == " clientname.") {
    slack.setWebhook(webhoorkUriSupport);
    slack.webhook({
      username: "sysdig",
      text: slmsg
    }, function(err, response) { });
  }

  slack.setWebhook(webhookUri);

  slack.webhook({
    username: "sysdig",
    text: slmsg
  }, function(err, response) {
    //console.log(response);
    context.succeed(event.Subject);
  });
};

var splitOnce = function(str, delim) {
    var components = str.split(delim);
    var result = [components.shift()];
    if(components.length) {
        result.push(components.join(delim));
    }
    return result;
};
