function spamFilter() {
  var threads = GmailApp.search("newer_than:1h in:inbox");
  for (var i = 0; i < threads.length; i++) {
    if ((threads[i].getMessages()[0].getCc() == "<YOUR-EMAIL@gmail.com>" || threads[i].getFirstMessageSubject().search("onfirmation") != -1)
     && threads[i].getMessageCount() == 1){
      var content = threads[i].getMessages()[0].getRawContent().split("\r\n");
      const regex = /d=NETORG\d{8}\.onmicrosoft\.com/;
      var foundSigned = false
      for (var k=0;k<content.length && !foundSigned;k++)
      {
        const found = content[k].match(regex);
        if (found){
          Logger.log(threads[i].getFirstMessageSubject())
          
          var message = Utilities.newBlob(threads[i].getMessages()[0].getRawContent(), "message/rfc822", "Subject");
          // Optional steps - I'm sick of it anyway...
          GmailApp.sendEmail("stop-spoofing@amazon.com", "Spoofing email", "See link to AWS URL in the attachment", {
            attachments: [message]
          });
          GmailApp.sendEmail("abuse@hotmail.com", "Spoofing email", "See phishing spam originated from onmicrosoft.com in the attachment", {
            attachments: [message]
          });
          threads[i].moveToSpam()
          foundSigned = true
        }
      }
    }
  }
}