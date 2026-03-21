from jnius import autoclass
from datetime import datetime, timedelta

PythonActivity = autoclass('org.kivy.android.PythonActivity')
Intent = autoclass('android.content.Intent')
PendingIntent = autoclass('android.app.PendingIntent')
AlarmManager = autoclass('android.app.AlarmManager')


def schedule_daily(verse, hour, minute):
    activity = PythonActivity.mActivity
    context = activity.getApplicationContext()

    intent = Intent(context, autoclass('org.bible.app.DailyReceiver'))
    intent.putExtra("verse", verse)

    pending = PendingIntent.getBroadcast(
        context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT
    )

    alarm = context.getSystemService(context.ALARM_SERVICE)

    now = datetime.now()
    trigger = now.replace(hour=hour, minute=minute, second=0)

    if trigger < now:
        trigger += timedelta(days=1)

    alarm.setRepeating(
        AlarmManager.RTC_WAKEUP,
        int(trigger.timestamp() * 1000),
        AlarmManager.INTERVAL_DAY,
        pending
    )