/* ================================================================
   TAMIL_SONGS.js — Tamil Christian Songs with Categories
   Based on screenshot: Hymns, Worship, Praise, Choruses, Christmas
================================================================ */
var TAMIL_SONGS = {
  categories: [
    {
      id:"hymns1", icon:"🎵",
      title_ta:"பாமாலைகள்", title_en:"Worship Hymns - 1",
      color:"#1a3a6a",
      songs:[
        {no:1, title_ta:"தேவன் தந்த அன்பை பாருங்கள்", title_en:"See the Love God Has Given",
         lyrics_ta:"தேவன் தந்த அன்பை பாருங்கள்\nஒப்பற்ற இரட்சகரை\nபாவ சாபத்தில் அழிவதற்கு\nகுமாரன் மரித்தார்\n\nக்ரஃபை: ஆம் தேவன் என்னை நேசித்தார்\nநித்திய அன்புடனே\nயேசு இரத்தம் சிந்தினார்\nபாவம் மன்னிக்க"},
        {no:2, title_ta:"எல்லாம் வல்ல தேவா", title_en:"Almighty God",
         lyrics_ta:"எல்லாம் வல்ல தேவா\nமகிமைமிக்க ஆண்டவா\nஸ்தோத்திரம் உமக்கே\nதோத்திரம் உமக்கே\n\nக்ரஃபை: கர்த்தா கர்த்தா\nமேன்மை உமக்கே\nஒப்பில்லாத நாமம்\nயேசு நாமம்"},
        {no:3, title_ta:"ஆண்டவரைப் போற்றுவோம்", title_en:"Let Us Praise the Lord",
         lyrics_ta:"ஆண்டவரைப் போற்றுவோம்\nஆர்ப்பரித்து பாடுவோம்\nமாண்பு மிகு நாமத்தை\nவாழ்த்தி நாம் பாடுவோம்"},
        {no:4, title_ta:"நன்றி சொல்வோம் நன்றி சொல்வோம்", title_en:"Let Us Give Thanks",
         lyrics_ta:"நன்றி சொல்வோம் நன்றி சொல்வோம்\nதேவ தந்தைக்கு நன்றி சொல்வோம்\nயேசு கிறிஸ்துவுக்கு நன்றி சொல்வோம்\nபரிசுத்த ஆவிக்கு நன்றி சொல்வோம்"},
        {no:5, title_ta:"கர்த்தர் என் மேய்ப்பர்", title_en:"The Lord is My Shepherd",
         lyrics_ta:"கர்த்தர் என் மேய்ப்பர்\nஒன்றும் குறைவில்லை\nபசும் வெளி இடங்களில்\nபடுக்க வைக்கிறார்"},
        {no:6, title_ta:"தேவனுடைய அன்பு", title_en:"The Love of God",
         lyrics_ta:"தேவனுடைய அன்பு\nவியப்பானது மிகவும்\nகுமாரனை தந்த அன்பு\nமாறாத அன்பு"},
        {no:7, title_ta:"என் ஆண்டவர் வாழ்கிறார்", title_en:"My Lord Lives",
         lyrics_ta:"என் ஆண்டவர் வாழ்கிறார்\nமரணத்தை வென்றார்\nமூன்றாம் நாள் உயிர்த்தெழுந்தார்\nஆல்லேலூயா"},
        {no:8, title_ta:"பரிசுத்தர் பரிசுத்தர்", title_en:"Holy Holy Holy",
         lyrics_ta:"பரிசுத்தர் பரிசுத்தர்\nசர்வ வல்லவர் கர்த்தர்\nவிடியற்காலை ஸ்தோத்திரம்\nமகிமை வல்லவர் உமக்கே"}
      ]
    },
    {
      id:"worship1", icon:"🙌",
      title_ta:"கீர்த்தனைகள்", title_en:"Worship Songs - 1",
      color:"#1a5276",
      songs:[
        {no:1, title_ta:"இயேசு நாமம் மதுரமான நாமம்", title_en:"Jesus Name — Sweet Name",
         lyrics_ta:"இயேசு நாமம் மதுரமான நாமம்\nகேட்கவே இனிக்கும்\nஒளி அது மருகலாகும்\nவலியை குணமாக்கும்\n\nக்ரஃபை: இயேசு இயேசு\nநேசமே என் ஆண்டவர்\nமேலான நாமம் இல்லை\nமண்ணிலே வானிலே"},
        {no:2, title_ta:"என் இயேசு என் ஜீவன்", title_en:"My Jesus My Life",
         lyrics_ta:"என் இயேசு என் ஜீவன்\nநீரே என் நம்பிக்கை\nகஷ்டத்தில் என் அன்பர்\nசுகத்தில் என் சந்தோஷம்"},
        {no:3, title_ta:"யேசு ஒருவரே வழி", title_en:"Jesus Alone is the Way",
         lyrics_ta:"யேசு ஒருவரே வழி\nசத்தியம் ஜீவன் நீரே\nபிதாவினிடம் போக\nவேறு வழி இல்லை"},
        {no:4, title_ta:"உம் நாமம் உயர்ந்தது", title_en:"Your Name is Exalted",
         lyrics_ta:"உம் நாமம் உயர்ந்தது\nவான் மண்ணிற்கும் மேலே\nயேசுவின் நாமத்தில்\nஒவ்வொரு முழங்கால் மடங்கும்"},
        {no:5, title_ta:"தேவனே என்னை பார்", title_en:"God Look Upon Me",
         lyrics_ta:"தேவனே என்னை பார்\nஏழை நான் ஏழை\nகிருபை செய் கிருபை செய்\nமன்னிப்பு தேடி வந்தேன்"},
        {no:6, title_ta:"ஆவியினால் ஆராதிப்போம்", title_en:"Let Us Worship in Spirit",
         lyrics_ta:"ஆவியினால் ஆராதிப்போம்\nசத்தியத்தில் வணங்குவோம்\nதேவனே நீர் தேடுகிறீர்\nஆராதகரை"},
        {no:7, title_ta:"மகிமை கர்த்தருக்கே", title_en:"Glory to the Lord",
         lyrics_ta:"மகிமை கர்த்தருக்கே\nமகிமை யேசுவுக்கே\nமகிமை பரிசுத்த ஆவிக்கே\nஆமென் ஆல்லேலூயா"}
      ]
    },
    {
      id:"worship2", icon:"🙏",
      title_ta:"கீர்த்தனைகள்", title_en:"Worship Songs - 2",
      color:"#1a5c3a",
      songs:[
        {no:1, title_ta:"என்னை ஆட்கொண்டவர்", title_en:"He Who Has Claimed Me",
         lyrics_ta:"என்னை ஆட்கொண்டவர் யேசு\nமாளாத அன்பினால்\nகுரங்கான என்னை மாற்றி\nசொந்தமாக்கினார்"},
        {no:2, title_ta:"கர்த்தர் மேல் நம்பிக்கை", title_en:"Trust in the Lord",
         lyrics_ta:"கர்த்தர் மேல் நம்பிக்கை வை\nசொந்த விவேகம் சாயாதே\nவழிகள் எல்லாவற்றிலும்\nஅவரை நினைத்துக்கொள்"},
        {no:3, title_ta:"இயேசு கூட இருக்கிறார்", title_en:"Jesus is Present",
         lyrics_ta:"இயேசு கூட இருக்கிறார்\nஒரு நாளும் தனி இல்லை\nகடினங்கள் தாண்டிடவும்\nகூட வருகிறார்"},
        {no:4, title_ta:"உம் கரம் பிடித்தால்", title_en:"If Your Hand Holds Mine",
         lyrics_ta:"உம் கரம் பிடித்தால் போதும்\nவேறு என்ன வேண்டும்\nசோர்வு வந்தாலும் கலங்கேன்\nதேவா நீர் என்னோடு"},
        {no:5, title_ta:"தேவா தேவா என் தேவா", title_en:"God God My God",
         lyrics_ta:"தேவா தேவா என் தேவா\nநீரல்லாமல் யாருக்கு போவேன்\nஜீவ ஜலம் தரும் ஆறு\nஜீவனின் வார்த்தைகள் உம்மிடம்"},
        {no:6, title_ta:"கர்த்தர் என் வெளிச்சம்", title_en:"The Lord is My Light",
         lyrics_ta:"கர்த்தர் என் வெளிச்சம்\nயாருக்கு அஞ்சுவேன்\nஆண்டவர் என் ஜீவன்\nயாரை நடுங்குவேன்"},
        {no:7, title_ta:"தாயைவிட நேசிப்பவர்", title_en:"Who Loves More Than a Mother",
         lyrics_ta:"தாயைவிட நேசிப்பவர்\nதந்தையைவிட காப்பவர்\nயேசு என்னை நேசிக்கிறார்\nமாறாத அன்பினால்"}
      ]
    },
    {
      id:"praise1", icon:"🎺",
      title_ta:"துதிப் பாடல்கள்", title_en:"Songs of Praise - 1",
      color:"#5c2e00",
      songs:[
        {no:1, title_ta:"ஆல்லேலூயா ஆல்லேலூயா", title_en:"Hallelujah Hallelujah",
         lyrics_ta:"ஆல்லேலூயா ஆல்லேலூயா\nகர்த்தரை துதியுங்கள்\nஆல்லேலூயா ஆல்லேலூயா\nதேவனை வாழ்த்துங்கள்"},
        {no:2, title_ta:"துதி துதி கர்த்தரை", title_en:"Praise Praise the Lord",
         lyrics_ta:"துதி துதி கர்த்தரை\nஸ்தோத்திரியுங்கள் அவரை\nஒரு நாளும் மறவாதே\nதேவனின் கிருபையை"},
        {no:3, title_ta:"மகத்துவமே மகத்துவமே", title_en:"Greatness Greatness",
         lyrics_ta:"மகத்துவமே மகத்துவமே\nகர்த்தர் மகத்துவமே\nபூமி முழுதும் நிரம்பியது\nஆண்டவரின் மகிமை"},
        {no:4, title_ta:"யேசு வெற்றி வேந்தர்", title_en:"Jesus King of Victory",
         lyrics_ta:"யேசு வெற்றி வேந்தர்\nமரணத்தை வென்றார்\nஆல்லேலூயா ஆல்லேலூயா\nகல்லறை வெற்றிடமாயிற்று"},
        {no:5, title_ta:"என்றும் துதிப்பேன்", title_en:"I Will Praise Forever",
         lyrics_ta:"என்றும் துதிப்பேன் கர்த்தரை\nவாழும்வரை வாழ்த்துவேன்\nவாய் திறக்கும் வேளையில்\nகர்த்தர் நாமம் பாடுவேன்"},
        {no:6, title_ta:"ஜீவனுள்ள தேவன்", title_en:"The Living God",
         lyrics_ta:"ஜீவனுள்ள தேவன் கர்த்தர்\nவல்லமையுள்ள இரட்சகர்\nமகிமை மகிமை உமக்கே\nஆல்லேலூயா கர்த்தா"}
      ]
    },
    {
      id:"praise2", icon:"🥁",
      title_ta:"துதிப் பாடல்கள்", title_en:"Songs of Praise - 2",
      color:"#4a1060",
      songs:[
        {no:1, title_ta:"வெற்றி நமக்கு வெற்றி", title_en:"Victory Belongs to Us",
         lyrics_ta:"வெற்றி நமக்கு வெற்றி\nயேசு நாமத்தில்\nசாத்தான் மேல் வெற்றி\nஆல்லேலூயா"},
        {no:2, title_ta:"மாட்சிமையே மாட்சிமையே", title_en:"Majesty Majesty",
         lyrics_ta:"மாட்சிமையே மாட்சிமையே\nதேவனுக்கு மாட்சிமை\nவணக்கமே வணக்கமே\nயேசுவுக்கு வணக்கம்"},
        {no:3, title_ta:"என் ஆத்துமா துதி", title_en:"My Soul Praise",
         lyrics_ta:"என் ஆத்துமா துதி\nதேவனை துதி\nபரலோகத்திலும் பூமியிலும்\nதேவன் நாமம் உயர்ந்தது"},
        {no:4, title_ta:"கீர்த்தனம் பாடுவேன்", title_en:"I Will Sing Praises",
         lyrics_ta:"கீர்த்தனம் பாடுவேன்\nஆண்டவரை வாழ்த்துவேன்\nயேசுவின் நாமத்தை\nமகிமைப்படுத்துவேன்"},
        {no:5, title_ta:"தேவன் நல்லவர்", title_en:"God is Good",
         lyrics_ta:"தேவன் நல்லவர் நல்லவர்\nதேவன் நல்லவர் என்றும்\nகிருபை உள்ளவர் என்றும்\nஸ்தோத்திரம் அவருக்கே"}
      ]
    },
    {
      id:"praise3", icon:"🎸",
      title_ta:"துதிப் பாடல்கள்", title_en:"Songs of Praise - 3",
      color:"#006060",
      songs:[
        {no:1, title_ta:"எழுந்து நில் என் ஆத்துமா", title_en:"Rise Up My Soul",
         lyrics_ta:"எழுந்து நில் என் ஆத்துமா\nதேவனை துதி\nவாயினால் கர்த்தரை\nஸ்தோத்திரி"},
        {no:2, title_ta:"ஸ்தோத்திரம் ஸ்தோத்திரம்", title_en:"Thanksgiving Thanksgiving",
         lyrics_ta:"ஸ்தோத்திரம் ஸ்தோத்திரம்\nஆண்டவருக்கு ஸ்தோத்திரம்\nஸ்தோத்திரம் ஸ்தோத்திரம்\nயேசுவுக்கு ஸ்தோத்திரம்"},
        {no:3, title_ta:"யேசு வல்லமையுள்ளவர்", title_en:"Jesus is Powerful",
         lyrics_ta:"யேசு வல்லமையுள்ளவர்\nயேசு மகத்துவமுள்ளவர்\nவானமும் பூமியும்\nயேசுக்கு மண்டியிடும்"},
        {no:4, title_ta:"அவர் நாமம் உயர்ந்தது", title_en:"His Name is Exalted",
         lyrics_ta:"அவர் நாமம் உயர்ந்தது\nவேறு நாமம் இல்லை\nயேசு நாமத்தில் மட்டுமே\nஇரட்சிப்பு உண்டு"}
      ]
    },
    {
      id:"new_praise", icon:"✨",
      title_ta:"புதிய பாடல்கள்", title_en:"Praise and Worship Songs - NEW",
      color:"#1a1a5c",
      songs:[
        {no:1, title_ta:"நீரே என் வல்லமை", title_en:"You Are My Strength",
         lyrics_ta:"நீரே என் வல்லமை\nநீரே என் நம்பிக்கை\nதேவா தேவா என்னை\nகைவிடாதே"},
        {no:2, title_ta:"இயேசு அரசர்", title_en:"Jesus is King",
         lyrics_ta:"இயேசு அரசர் இயேசு அரசர்\nவான் பூமி ஆண்டவர்\nமகிமை மகிமை\nஆல்லேலூயா"},
        {no:3, title_ta:"தேவா உம்மை தேடுகிறேன்", title_en:"God I Seek You",
         lyrics_ta:"தேவா உம்மை தேடுகிறேன்\nகாலையில் கண்விழிக்கிறேன்\nஆவியும் ஆத்துமாவும்\nதாகமாயிருக்கிறது"},
        {no:4, title_ta:"என்னிலும் கர்த்தர் பெரியவர்", title_en:"The Lord Greater Than Me",
         lyrics_ta:"என்னிலும் கர்த்தர் பெரியவர்\nகஷ்டங்களிலும் பெரியவர்\nஒரு தேவன் ஒரு இயேசு\nஒரு பரிசுத்த ஆவி"},
        {no:5, title_ta:"ஆவியே வாரும்", title_en:"Come Holy Spirit",
         lyrics_ta:"ஆவியே வாரும் ஆவியே வாரும்\nதேவ ஆவியே வாரும்\nதீபமே வாரும் ஜீவமே வாரும்\nபரிசுத்த ஆவியே வாரும்"},
        {no:6, title_ta:"கடவுள் நல்லவர்", title_en:"God is Good (New)",
         lyrics_ta:"கடவுள் நல்லவர் கடவுள் நல்லவர்\nகடவுள் நல்லவர் என்றும்\nகஷ்டத்தில் நல்லவர் கஷ்டத்தில் நல்லவர்\nவாழ்க்கை முழுவதும் நல்லவர்"}
      ]
    },
    {
      id:"choruses", icon:"🎶",
      title_ta:"சரணங்கள்", title_en:"Choruses",
      color:"#3d1a00",
      songs:[
        {no:1, title_ta:"கர்த்தர் என்னோடே", title_en:"The Lord is With Me",
         lyrics_ta:"கர்த்தர் என்னோடே\nகர்த்தர் என்னோடே\nஒருபோதும் தனியில்லை\nகர்த்தர் என்னோடே"},
        {no:2, title_ta:"யேசு என்னை நேசிக்கிறார்", title_en:"Jesus Loves Me",
         lyrics_ta:"யேசு என்னை நேசிக்கிறார்\nவேதம் சொல்கிறது\nசிறியோரும் பலவீனரும்\nவல்லவராவோம்\n\nக்ரஃபை: ஆம் யேசு நேசிக்கிறார்\nஆம் யேசு நேசிக்கிறார்\nஆம் யேசு நேசிக்கிறார்\nவேதம் சொல்கிறது"},
        {no:3, title_ta:"நல்லவர் நல்லவர்", title_en:"Good Good",
         lyrics_ta:"நல்லவர் நல்லவர் கர்த்தர் நல்லவர்\nகிருபை உள்ளவர் என்றும்\nஆல்லேலூயா ஆல்லேலூயா\nகர்த்தர் நல்லவர்"},
        {no:4, title_ta:"தேவன் நம்மை நேசிக்கிறார்", title_en:"God Loves Us",
         lyrics_ta:"தேவன் நம்மை நேசிக்கிறார்\nஆம் ஆம் நேசிக்கிறார்\nகுமாரன் தந்த அன்பினால்\nஆம் ஆம் நேசிக்கிறார்"},
        {no:5, title_ta:"மகிழ்ச்சியாயிருங்கள்", title_en:"Rejoice Always",
         lyrics_ta:"மகிழ்ச்சியாயிருங்கள்\nகர்த்தரில் மகிழுங்கள்\nவாழ்க்கை கஷ்டமாயிருந்தாலும்\nகர்த்தரில் மகிழுங்கள்"},
        {no:6, title_ta:"கர்த்தர் தாமே போராடுவார்", title_en:"The Lord Will Fight",
         lyrics_ta:"கர்த்தர் தாமே போராடுவார்\nநீங்கள் சும்மாயிருங்கள்\nயேகோவா ஜீரே கர்த்தர்\nவழி செய்வார்"},
        {no:7, title_ta:"மன்னிக்கும் தேவன்", title_en:"God Who Forgives",
         lyrics_ta:"மன்னிக்கும் தேவன் கர்த்தர்\nதூய்மைப்படுத்தும் இரட்சகர்\nமனம் திரும்பு மனம் திரும்பு\nகர்த்தர் காத்திருக்கிறார்"}
      ]
    },
    {
      id:"christmas", icon:"⭐",
      title_ta:"கிறிஸ்து பிறப்பு பாடல்கள்", title_en:"Christmas Songs",
      color:"#8b0000",
      songs:[
        {no:1, title_ta:"பெத்தலேம் ஊரில்", title_en:"In the Town of Bethlehem",
         lyrics_ta:"பெத்தலேம் ஊரில் பிறந்தார் கிறிஸ்து\nதாழ்மையான தொழுவத்தில்\nதேவகுமாரன் மனிதனாய் வந்தார்\nபாவிகளை காக்க\n\nக்ரஃபை: ஆல்லேலூயா ஆல்லேலூயா\nகிறிஸ்து பிறந்தார்\nஆல்லேலூயா ஆல்லேலூயா\nமகிழ்ச்சியாயிருங்கள்"},
        {no:2, title_ta:"பரலோக தூதர் பாடினார்", title_en:"The Heavenly Angel Sang",
         lyrics_ta:"பரலோக தூதர் பாடினார்\nபூமியில் சமாதானம் என்று\nமேய்ப்பர்கள் கேட்டனர் பயந்தனர்\nஆண்டவரை வணங்கினர்"},
        {no:3, title_ta:"மேய்ப்பர்களே மேய்ப்பர்களே", title_en:"Shepherds O Shepherds",
         lyrics_ta:"மேய்ப்பர்களே மேய்ப்பர்களே\nவாருங்கள் வாருங்கள்\nதொழுவத்தில் குழந்தை\nதேவகுமாரன் பிறந்தார்"},
        {no:4, title_ta:"கிழக்கிலிருந்து ஞானிகள்", title_en:"Wise Men From the East",
         lyrics_ta:"கிழக்கிலிருந்து ஞானிகள் வந்தனர்\nவானத்தில் நட்சத்திரம் பின்தொடர்ந்தனர்\nரசாயனங்கள் கொண்டுவந்தனர்\nகுழந்தை யேசுவை வணங்கினர்"},
        {no:5, title_ta:"இயேசு பிறந்தார் மகிழுங்கள்", title_en:"Jesus is Born Rejoice",
         lyrics_ta:"இயேசு பிறந்தார் மகிழுங்கள்\nபூமியெங்கும் மகிழுங்கள்\nதேவகுமாரன் நம்மிடையே\nவாழ்க்கை வெளிச்சம் வந்தார்"},
        {no:6, title_ta:"ஒரு சிறு மழலை யேசு", title_en:"A Little Baby Jesus",
         lyrics_ta:"ஒரு சிறு மழலை யேசு\nதொட்டிலில் படுத்திருந்தார்\nதேவகுமாரன் என்ன ஆச்சரியம்\nமனிதனாய் வந்தார்"}
      ]
    }
  ]
};

// Flatten all songs for search
TAMIL_SONGS.allSongs = [];
TAMIL_SONGS.categories.forEach(function(cat){
  cat.songs.forEach(function(song){
    TAMIL_SONGS.allSongs.push(Object.assign({}, song, {
      catId: cat.id,
      catTitle_ta: cat.title_ta,
      catTitle_en: cat.title_en,
      catColor: cat.color
    }));
  });
});
