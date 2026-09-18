#  💯 75Percent
> still tryna figure out react native :(

_made this app to manage college classes' timetable since the traditional ones are ugly and thought it would make a good first project :p_


DEMO: 

https://github.com/user-attachments/assets/dc2a03ea-b63b-41f6-a99b-b495723dad94




## how ts was made 

this project was made using [Expo](https://expo.dev) + React Native, and I used Expo Router for file-based routing, AsyncStorage to persist the timetable data, and finally the Gemini API for AI to parse the uploaded image of the timetable 


## how to run this locally

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

then just scan the QR with your Expo Go and app youre good to go!! or you can just run it on your android device from the releases' [page](https://github.com/SukhdevThukral/75Percent/releases/tag/v1.0.0)


## ai usage

i used ai assitance to the minimal (Claude) during development for help w react native specifics this was my first react native project so i leaned on them similarly to how id use docs or even stack overflow. for ex, adding the name collection step in onboarding, wiring up `saveName​`/`loadName`​ with AsyncStorage adn making the home screen dyamniclly pull the user's name instead of having it hardcoded.

## desg ref
i used a desg [reference](https://dribbble.com/shots/26992050-Task-Management-Mobile-App-UI-Smart-Productivity-Experience) from [Dribbble](dribbble.com), i tried to completely copy it but obvi couldnt since its just so complex w tailwind

but regardless of the fact tht i was trying to imitate the desg ref ive coded the whole UI by myself

<img width="752" height="564" alt="dea6b6674a71e354f1e8bd2cbfe9c99e" src="https://github.com/user-attachments/assets/d05d518c-8647-40b1-990c-a78df8ab3418" />





## the rough edges (that im supposed to work on)

- attendace tracking resets on every single app reload
- no actual backend for the app its absolutely local as of now


## LICENSE

[MIT](https://github.com/SukhdevThukral/75Percent/blob/master/LICENSE)

