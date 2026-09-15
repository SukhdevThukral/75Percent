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



## the rough edges (that im supposed to work on)

- attendace tracking resets on every single app reload
- no actual backend for the app its all local as of now


## LICENSE

[MIT](https://github.com/SukhdevThukral/75Percent/blob/master/LICENSE)

