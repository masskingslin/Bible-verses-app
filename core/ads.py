from jnius import autoclass

def load_banner():
    PythonActivity = autoclass('org.kivy.android.PythonActivity')
    AdView = autoclass('com.google.android.gms.ads.AdView')
    AdRequest = autoclass('com.google.android.gms.ads.AdRequest$Builder')
    AdSize = autoclass('com.google.android.gms.ads.AdSize')

    activity = PythonActivity.mActivity

    ad = AdView(activity)
    ad.setAdSize(AdSize.BANNER)
    ad.setAdUnitId("ca-app-pub-xxxxxxxx/yyyyyyyy")

    req = AdRequest().build()
    ad.loadAd(req)

    return ad