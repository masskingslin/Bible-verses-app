from kivy.app import App
from kivy.lang import Builder
from kivy.clock import Clock
from kivy.uix.screenmanager import ScreenManager, Screen
from threading import Thread

from core.bible_service import BibleService
from core.notifications import schedule_daily
from core.daily import get_daily_verse

bible_service = BibleService()


class Splash(Screen):
    def on_enter(self):
        Thread(target=self.load, daemon=True).start()
        Clock.schedule_interval(self.check, 0.5)

    def load(self):
        bible_service.load()

    def check(self, dt):
        if bible_service.data:
            App.get_running_app().setup_daily()
            self.manager.current = "home"


class Home(Screen):
    def on_enter(self):
        self.load_verse()

    def load_verse(self):
        v = bible_service.get("Genesis", 1, 1)
        self.ids.ta.text = v["ta"]
        self.ids.en.text = v["en"]

    def play_audio(self):
        from kivy.core.audio import SoundLoader
        s = SoundLoader.load("assets/audio/genesis_1_1.mp3")
        if s:
            s.play()


class Root(ScreenManager):
    pass


class BibleApp(App):
    def build(self):
        return Builder.load_file("bible.kv")

    def setup_daily(self):
        verse = get_daily_verse(bible_service.data)
        schedule_daily(verse, 7, 0)


BibleApp().run()