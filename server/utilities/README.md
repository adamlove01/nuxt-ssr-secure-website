# Utilities

## sendConfirmationEmail.js

This function sends an email confirmation link to users when they register on the site.

It uses Nodemailer to send the email to an **email delivery provider**. You can use any email delivery provider. Here is a list of well-known email delivery providers that can be easily configured in Nodemailer:

[Nodemailer - Well-known Delivery Providers ](https://nodemailer.com/smtp/well-known/)

You can also set up your own SMTP server [like this](https://www.linuxbabe.com/redhat/run-your-own-email-server-centos-postfix-smtp-server). Setting up your own SMTP server is complicated and you must monitor and maintain it, which is why an email delivery provider is the more common choice, even though they are paid services.

## Amazon SES

This project is currently configured to use Amazon SES as the delivery provider.

To use this option, see the SES Email Setup link below, and set up your email address in SES. You can use an existing email such as gmail.com, or set up an email address on your server, such as admin@myDomain.com, and use that. Using your own domain email is a better option because there is better deliverability (fewer emails may go to the user's spam folder) if your email address matches the sending domain.

In your `.env` file, you need to configure these keys:

```
...
AWS_SMTP_PORT=465
AWS_SMTP_REGION='email-smtp.us-east-1.amazonaws.com'
AWS_SMTP_USERNAME='mySmtpUsername'
AWS_SMTP_PASSWORD='mySmtpPassword'
ADMIN_EMAIL='admin@myDomain.com'
...
```

The AWS_SMTP_REGION depends on which region you choose when setting up SES. us-east-1 is a default for USA.

Note that we are NOT using the Nodemailer [SES Transport example](https://nodemailer.com/transports/ses/) on the Nodemailer website. Instead, we are using [this example setup](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/examples-send-using-smtp.html) from the Amazon website, which uses an smtpEndpoint, smtpUsername and smtpPassword. These are different from your AWS_ACCESS_KEY_ID and password. So be sure to [generate your SMTP keys](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-set-up.html) in SES and use those.

## More Info

[Nodemailer - Send Email from NodeJS](https://nodemailer.com/about/)

[docs.aws.amazon.com - SES Email Setup](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-set-up.html)

[docs.aws.amazon.com - SMTP Credentials](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/smtp-credentials.html)


