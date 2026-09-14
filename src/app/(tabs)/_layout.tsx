// import { Tabs } from "expo-router";
// import { Pressable } from "react-native";
// import Animated, {useSharedValue, useAnimatedStyle, withSpring} from "react-native-reanimated";

// function AnimatedTabIcon({children, onPress, onLongPress, style}: any) {
//     const scale = useSharedValue(1);

//     const animStyle = useAnimatedStyle(() => ({
//         transform: [{scale: scale.value}],
//     }));

//     return(
//         <Pressable onPress={() => {
//             scale.value = withSpring(0.8, {}, () => {
//                 scale.value = withSpring(1);
//             })
//             onPress?.();
//         }}
//         onLongPress={onLongPress}
//         style={style} >
//             <Animated.View style={animStyle}>{children}</Animated.View>
//         </Pressable>
//     );
// }

// export default function TabLayout() {
//     return (
//         <Tabs screenOptions={{
//             animation: 'shift',
//             headerShown: false,
//             tabBarStyle: {
//                 backgroundColor: '#0f0f0f',
//                 borderTopColor: '#2a2a2a',
//             },
//             tabBarActiveTintColor: '#6366F1',
//             tabBarInactiveTintColor: '#ffffff40',
//             tabBarButton: AnimatedTabIcon,
//         }}>
//             <Tabs.Screen name="index" options={{title: 'Home'}}/>
//         </Tabs>
//     )
// }