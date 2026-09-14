import {View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native'
import {router, usePathname} from 'expo-router'
import Animated, {useSharedValue, useAnimatedStyle, withSpring} from 'react-native-reanimated'

const nav_items = [
    {icon: '⌂', label: 'home', href: '/(tabs)'},
    {icon: '📅', label: 'schedule', href: '/(tabs)/schedule'},
    {icon: '📋', label: 'attendance', href: '/(tabs)/attendance'},
    {icon: '👤', label: 'profile', href: '/(tabs)/profile'},
]

function NavItem({item, isActive}: {item: typeof nav_items[0], isActive: boolean}){
    const scale = useSharedValue(1)
    const animStyle = useAnimatedStyle(() => ({ transform: [{scale: scale.value}]}))

    return (
        <TouchableOpacity onPress={() => {
            scale.value = withSpring(0.7, {}, () => {
                scale.value = withSpring(1, {damping: 6, stiffness: 200})
            })
            router.push(item.href as any)
        }}
        style={{
            width: 52, height: 52, borderRadius: 26, backgroundColor: isActive?'#7C3AED':'transparent',
            alignItems: 'center', justifyContent: 'center'
        }}>
            <Animated.Text style={[{fontSize: 20}, animStyle]}>{item.icon}</Animated.Text>
        </TouchableOpacity>
    )
}

export default function NavBar(){
    const pathname = usePathname()

    return (
        <View style={{alignItems: 'center', paddingBottom: 24, paddingTop: 12}}>
            <View style={{flexDirection: 'row', backgroundColor: '#1C1C1E', borderRadius:40, paddingVertical: 8, paddingHorizontal: 10, gap: 8,}}>
                {nav_items.map((item) => (
                <NavItem
                    key={item.label}
                    item={item}
                    isActive={pathname === item.href || (item.href === '/(tabs)' && pathname === '/')}
                />
                ))}
            </View>
        </View>
    )
}