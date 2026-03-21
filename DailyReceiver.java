package org.bible.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationCompat;
import android.app.NotificationManager;

public class DailyReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {

        String verse = intent.getStringExtra("verse");

        NotificationCompat.Builder builder =
            new NotificationCompat.Builder(context, "daily")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("✝ Daily Verse")
                .setContentText(verse);

        NotificationManager m =
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        m.notify(1, builder.build());
    }
}