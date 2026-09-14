import { Tabs } from "expo-router";
import { usePathname } from "expo-router";
import Animated, {FadeIn, FadeOut, SlideInRight, SlideOutLeft} from "react-native-reanimated";


export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            animation: 'shift'
        }}>
            <Tabs.Screen name="index" options={{title: 'Home'}}/>
            <Tabs.Screen name="schedule" options={{title: 'Schedule'}}/>

        </Tabs>
    );
}