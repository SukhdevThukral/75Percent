#  💯 75Percent
> still figuring out react native — but this one actually lwk works lol

_i built a mobile app built with **Expo + React Native** that lets you upload your college timetable, parses it with AI, and shows your classes as swipeable cards + a calendar view. Started this to learn RN properly, not just follow tutorials_

 


https://github.com/user-attachments/assets/dc2a03ea-b63b-41f6-a99b-b495723dad94





## what it does

- **Onboarding** where you enter your name, upload a photo of your timetable
- **AI parsing** sends the image to Gemini, gets back structured class data (subject, time, room)
- **Swipe cards**, swipe right = present, left = absent. tinder but for attendance :(
- **Calendar screen**, a simple week strip + time axis view of all your classes for the day
- **Custom nav bar**, designed from scratch, not the default expo tabs thing


## screens

| screen | what's happening |
|---|---|
| `onboarding` | name input + image upload => Gemini API call |
| `home` | swipeable class cards with present/absent tracking |
| `schedule` | calendar view with colored time blocks per class |


## tech stack

- [Expo](https://expo.dev) + Expo Router (file-based routing)
- React Native
- `react-native-deck-swiper` for the card swiping
- `react-native-reanimated` for animations
- `twrnc` (tailwind for react native) for styling
- Google Gemini API for timetable image parsing
- AsyncStorage to persist timetable data


## running locally

```bash
git clone https://github.com/SukhdevThukral/75Percent
cd 75Percent
npm install
```

add a `.env` file:
```
EXPO_PUBLIC_GEMINI_KEY=your_gemini_api_key_here
```

then run:
```bash
npx expo start
```

scan the QR with Expo Go on your phone and you're good.


## folder structure

```
app/
├── (screens)/
│   ├── index.tsx        # home / swipe cards
│   └── schedule.tsx     # calendar view
├── index.tsx            # redirect to home
components/
└── NavBar.tsx           # custom bottom nav
```


## what i learned (since ts was my first time)

- how expo router actually works with file-based navigation
- using `react-native-reanimated` for spring animations
- calling a multimodal AI API (Gemini) with base64 image data
- building a custom nav bar instead of relying on expo's default tabs
- why you can't call hooks inside a `.map()` (the hard way)


## what's still rough

- timetable data is hardcoded in some places, needs to pull from AsyncStorage properly
- attendance tracking resets on app reload
- no real backend, everything is local for now
- UI is only tested on iOS


## why i built this

college timetable is a mess and i wanted smthg that actually looks good on my phone. also wanted a real project to learn react native with since hate tutorials.


## LICENSE
MIT
