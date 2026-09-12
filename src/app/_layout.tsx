import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
    return(
        <>
            <StatusBar barStyle="light-content" backgroundColor="#0f0f0f"/>
            <Stack screenOptions={{headerShown:false}}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="(tabs)"/>
            </Stack>
        </>
    )
}