import {View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-deck-swiper'
import NavBar from '@/components/NavBar'
import tw, { style } from 'twrnc'
import { router } from 'expo-router'
import { loadClasses, hasOnboarded, ClassSlot, loadName } from '@/utils/classes'

const COLORS = ['#7C3AED', '#DB2777', '#059669', '#D97706', '#2563EB', '#DC2626']

export default function Home() {
    const [results, setResults] = useState<Record<string, 'present' | 'absent' | 'cancelled'>>({})
    const [cardIndex, setCardIndex] = useState(0)
    const [done, setDone] = useState(false)
    const swiperRef = useRef<any>(null)
    const [classes, setClasses] = useState<ClassSlot[]>([])
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState('')
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const todayDay = DAYS[new Date().getDay()]
    const todaysClasses = classes.filter(c => c.day === todayDay)

    useEffect(() => {
        async function init() {
            const onboarded = await hasOnboarded()
            if (!onboarded) { router.replace('/onboarding'); return }
            const saved = await loadClasses()
            if (saved) setClasses(saved)
            const name = await loadName()
            if (name) setUserName(name)
            setLoading(false)
        }
        init()
    }, [])
    
    if (loading) return (
        <SafeAreaView style={tw`flex-1 bg-[#0f0f0f] items-center justify-center`}>
            <ActivityIndicator size='large' color='#7C3AED' />
        </SafeAreaView>
    )

    const onSwipedRight = (i: number) => {
        setResults(p=> ({...p, [todaysClasses[i].subject]: 'present'}))
    }

    const onSwipedLeft = (i: number)=> {
        setResults(p=> ({...p, [todaysClasses[i].subject]: 'absent'}))
    }

    const onSwipedBottom = (i: number) => {
        setResults(p => ({...p, [todaysClasses[i].subject]: 'cancelled'}))
    }

    const attended = Object.values(results).filter(v=> v === 'present').length
    const total = todaysClasses.length
    const percent = total === 0 ? 75 : Math.round((attended/total)*100)
    const cancelled = Object.values(results).filter(v=> v === 'cancelled').length
    const safe = percent >=75

    return(
        <SafeAreaView style={tw`flex-1 bg-[#0f0f0f]`}>
            <View style={tw`px-6 pt-3 flex-1`}>
                <View style={tw`flex-row justify-between items-center mb-7`}>
                    <View style={tw`flex-row items-center gap-3`}>
                        <View style={tw`w-13 h-13 mt-2 rounded-full bg-[#7C3AED] items-center justify-center`}>
                            <Text style={tw`text-white font-extrabold text-lg`}>{userName[0]?.toUpperCase()}</Text>
                        </View>
                        <View>
                            <Text style={tw`text-[#ffffff40] mt-2 ml-2 text-lg`}>Good Morning !</Text>
                            <Text style={tw`text-white text-lg font-bold ml-2 tracking-wide`}>{userName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={tw`w-10 h-10 rounded-full bg-[#1A1A1A] items-center justify-center`}>
                        <Text style={tw`text-lg`}>🔔</Text>
                    </TouchableOpacity>
                </View>

                <Text style={tw`text-white text-[34px] leading-[42px] tracking-wider mb-8 mt-5`}>
                    You have <Text style={tw`text-[#7C3AED]`}>{total}</Text>
                    <Text style={tw`font-extrabold`}> {'\n'}classes today</Text>
                </Text>

                {!done && (
                    <View style={tw`flex-row justify-between px-2 mb-18`}>
                        <Text style={tw`text-[#DC2626] text-xs font-bold`}>← Absent</Text>
                        <View style={tw`items-center gap-1`}>
                            <Text style={tw`text-[#ffffff30] text-xs`}>swipe to mark</Text> 
                            <Text style={tw`text-[#F59E0B] text-xs mt-5 -ml-2 font-bold`}> ↓ Cancelled</Text>
                        </View>
                        <Text style={tw`text-[#059669] text-xs font-bold`}>Present →</Text>                        
                    </View>
                )}

                {!done ? (
                    <View style={[{height: 280, width: '100%', position:'relative'}]} pointerEvents='box-none'>
                        {todaysClasses.slice(cardIndex+1, cardIndex+3).map((cls, ri)=> {
                            const i = ri + 1
                            const color = COLORS[(cardIndex+i) % COLORS.length]
                            return(
                                <View key={cls.subject} style={[
                                    tw`rounded-3xl h-64`,
                                    {
                                        backgroundColor: color,
                                        position: 'absolute',
                                        top: i *10,
                                        left: i*10,
                                        right: (i*10),
                                        bottom: 0,
                                        zIndex: -i
                                    }
                                ]}/>
                            )
                        })}

                        <View style={{position: 'absolute', top:0, left:0, right: 0, height: 256}} pointerEvents='box-none'>
                            <Swiper ref={swiperRef} containerStyle={{height: 256}} cards={todaysClasses} cardIndex={cardIndex} onSwipedRight={onSwipedRight} onSwipedLeft={onSwipedLeft} onSwipedBottom={onSwipedBottom} verticalSwipe={true} onSwipedAll={() => setDone(true)} onSwiped={(i) => setCardIndex(i + 1)} stackSize={3} cardStyle={{top: 0, left:0, right:0, bottom:0}} animateOverlayLabelsOpacity overlayLabels={{
                                left: {
                                    title: 'ABSENT',
                                    style: {
                                        label: {color: '#b309099c', fontSize: 28, fontWeight: '900', borderColor: '#b309099c', borderWidth: 3, borderRadius: 8, padding: 6, transform: [{rotate: '15deg'}]},
                                        wrapper: {flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop:20, marginLeft: 20}
                                    }
                                },
                                right: {
                                    title: 'PRESENT',
                                    style: {
                                        label: {color: '#09ff1d', fontSize: 28, fontWeight: '900', borderColor: '#09ff1d', borderWidth:3, borderRadius: 8, padding: 6, transform: [{rotate: '-15deg'}]},
                                        wrapper: {flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 5, marginLeft: 2}
                                    }
                                }, 
                                bottom: {
                                    title: 'CANCELLED',
                                    style: {
                                        label: {color: '#F59E0B', fontSize: 28, fontWeight: '900', borderColor: '#F59E0B', borderWidth: 3, borderRadius: 8, padding: 6},
                                        wrapper: {flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: -10}
                                    }
                                }
                            }}
                            backgroundColor='transparent' cardVerticalMargin={0} renderCard={(cls, i) => {
                                const color = COLORS[i% COLORS.length]
                                return (
                                    <View style={[tw`rounded-3xl p-8 h-64 justify-between`, {backgroundColor: color}]}>
                                        <Text style={tw`text-white text-3xl font-extrabold tracking-tight`}>{cls.subject}</Text>
                                        <View style={tw`gap-2`}>
                                            <Text style={tw`text-[#ffffff90] text-base font-semibold`}>⏰ {cls.time}</Text>
                                            <Text style={tw`text-[#ffffff90] text-base font-semibold`}>📍 {cls.room} </Text>
                                        </View>
                                    </View>
                                )
                            }}/>
                        </View>
                    </View>
                ) : (
                    <View style={tw`flex-1 items-center justify-center gap-4`}>
                        <Text style={tw`text-white text-2xl font-extrabold`}>All marked ✔️</Text>
                        <Text style={tw`text-[#ffffff50] text-sm`}>
                            {attended} present · {total-attended - cancelled} absent
                        </Text>
                        <TouchableOpacity style={tw`mt-4 bg-[#7C3AED] px-8 py-4 rounded-2xl`} onPress={() => {setDone(false); setCardIndex(0); setResults({})}}>
                            <Text style={tw`text-white font-bold text-base`}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 9999, elevation: 9999}}>
                <NavBar/>
            </View>
        </SafeAreaView>
    )
}