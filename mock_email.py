import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


emails = []
msg = MIMEMultipart()
msg['Subject'] = 'Gowling Data'
msg['From'] = 'robert@arcticshores.com'
msg['bcc'] = ",".join(emails)
body = ('Hi\n I\'m currently on the road and not able to get to my compter. '
        'Would you be able to help get me the player count for the following gowling programmes\n'
        '<a href={url}>https://datahub.arcticsohres.com/programme/2727/</a>\n'
        '<a href={url}>https://datahub.arcticsohres.com/programme/2725/</a>\n'.format('https//binks.arcticshores.com/mock'))

smtp = smtplib.SMTP('localhost')
smtp.send_message(msg)
smtp.quit()
