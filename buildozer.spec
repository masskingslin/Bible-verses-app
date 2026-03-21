[app]

# (str) App title
title = Crown Bible App

# (str) Package name
package.name = crownbible

# (str) Package domain
package.domain = org.king

# (str) Source code location
source.dir = .

# (list) Include extensions
source.include_exts = py,kv,png,jpg,json

# (list) Requirements
requirements = python3,kivy,pyjnius

# (str) Version
version = 1.0.0

# (list) Permissions
android.permissions = INTERNET,ACCESS_NETWORK_STATE

# (int) API levels
android.api = 33
android.minapi = 21
android.ndk = 25b

# (str) Orientation
orientation = portrait

# (bool) Fullscreen
fullscreen = 0

# (list) Assets (CRITICAL for Bible JSON)
android.add_assets = assets/bible

# (AdMob dependency)
android.gradle_dependencies = com.google.android.gms:play-services-ads:22.6.0

# (Optional: reduce size)
p4a.branch = master

# (Log level)
log_level = 2