title = Bible App
package.name = bibleapp
package.domain = org.bible

source.include_exts = py,kv,json,ttf,mp3

requirements = python3,kivy,pyjnius

android.api = 34
android.minapi = 24

android.permissions = INTERNET,RECEIVE_BOOT_COMPLETED,POST_NOTIFICATIONS

android.extra_manifest_xml = """
<receiver android:name="org.bible.app.DailyReceiver"/>
<receiver android:name="org.bible.app.BootReceiver">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED"/>
    </intent-filter>
</receiver>
"""