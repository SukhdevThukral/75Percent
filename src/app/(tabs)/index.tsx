import {View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native'
import { useState, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-deck-swiper'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { ClassSlot } from '..'
import tw, { style } from 'twrnc'

const COLORS = ['#7C3AED', '#DB2777', '#059669', '#D97706', '#2563EB', '#DC2626']

const CLASSES = [
    {subject: 'Mathematics', time: '9:00 AM', room: 'B-204', teacher: 'Mr. Sharma'},
    {subject: 'Physics', time: '10:30 AM', room: 'A-101', teacher: 'Ms. Verma'},
    {subject: 'English', time: '12:00 PM', room: 'C-301', teacher: 'Mr. Singh'},
    {subject: 'Chemistry', time: '2:00 PM', room: 'Lab-1', teacher: 'Dr. Gupta'},
]

type Status = 'present' | 'absent' | null

export default function Home() {
    const [results, setResults] = useState<Record<string, 'present' | 'absent'>>({})
    const [cardIndex, setCardIndex] = useState(0)
    const [done, setDone] = useState(false)
    const swiperRef = useRef<any>(null)

    const onSwipedRight = (i: number) => {
        setResults(p=> ({...p, [CLASSES[i].subject]: 'present'}))
    }

    const onSwipedLeft = (i: number)=> {
        setResults(p=> ({...p, [CLASSES[i].subject]: 'absent'}))
    }

    const attended = Object.values(results).filter(v=> v === 'present').length
    const total = CLASSES.length
    const percent = total === 0 ? 75 : Math.round((attended/total)*100)
    const safe = percent >=75

    return(
        <SafeAreaView style={tw`flex-1 bg-[#0f0f0f]`}>
            <View style={tw`px-6 pt-3 flex-1`}>
                <View style={tw`flex-row justify-between items-center mb-7`}>
                    <View style={tw`flex-row items-center gap-3`}>
                        <View style={tw`w-13 h-13 mt-2 rounded-full bg-[#7C3AED] items-center justify-center`}>
                            <Text style={tw`text-white font-extrabold text-lg`}>S</Text>
                        </View>
                        <View>
                            <Text style={tw`text-[#ffffff40] mt-2 ml-2 text-lg`}>Good Morning !</Text>
                            <Text style={tw`text-white text-lg font-bold ml-2 tracking-wide`}>Sukhdev Thukral</Text>
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
                        <Text style={tw`text-[#ffffff30] text-xs`}>swipe to mark</Text>
                        <Text style={tw`text-[#059669] text-xs font-bold`}>Present →</Text>                        
                    </View>
                )}

                {!done ? (
                    <View style={[{height: 280, width: '100%', position:'relative'}, tw`-ml-3`]}>
                        {CLASSES.slice(cardIndex+1, cardIndex+3).map((cls, ri)=> {
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
                                        right: -(i*10),
                                        bottom: 0,
                                    }
                                ]}/>
                            )
                        })}

                        <View style={{position: 'absolute', top:0, left:0, right: 0, height: 256}}>
                            <Swiper ref={swiperRef} cards={CLASSES} cardIndex={cardIndex} onSwipedRight={onSwipedRight} onSwipedLeft={onSwipedLeft} onSwipedAll={() => setDone(true)} onSwiped={(i) => setCardIndex(i + 1)} stackSize={3} stackScale={6} stackSeparation={18} inputRotationRange={[-20, 0, 20]} outputRotationRange={['-3deg', '0deg', '3deg']} cardStyle={{top: 0, left:0, right:0, bottom:0}} horizontalSwipe={true} verticalSwipe={false} stackAnimationFriction={1} stackAnimationTension={40} animateOverlayLabelsOpacity overlayLabels={{
                                left: {
                                    title: 'ABSENT',
                                    style: {
                                        label: {color: '#DC2626', fontSize: 28, fontWeight: '900', borderColor: '#DC2626', borderWidth: 3, borderRadius: 12, padding: 8},
                                        wrapper: {flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-start', marginTop:20, marginLeft: 20}
                                    }
                                },
                                right: {
                                    title: 'PRESENT',
                                    style: {
                                        label: {color: '#059669', fontSize: 28, fontWeight: '900', borderColor: '#059669', borderRadius: 12, padding: 8},
                                        wrapper: {flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 20, marginLeft: 20}
                                    }
                                }
                            }}
                            backgroundColor='transparent' cardVerticalMargin={0} renderCard={(cls, i) => {
                                const color = COLORS[i% COLORS.length]
                                const offset = i * 8
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
                            {attended} present · {total-attended} absent
                        </Text>
                        <TouchableOpacity style={tw`mt-4 bg-[#7C3AED] px-8 py-4 rounded-2xl`} onPress={() => {setDone(false); setCardIndex(0); setResults({})}}>
                            <Text style={tw`text-white font-bold text-base`}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {!done && (
                    <View style={tw`flex-row justify-center gap-6 pb-8 mt-4`}>
                        <TouchableOpacity style={tw`w-16 h-16 rounded-full bg-[#DC262622] border-2 border-[#DC262622]`} onPress={() => swiperRef.current?.swipeLeft()}>
                            <Text style={tw`text-[#059669] text-2xl font-bold`}>✔️</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    )
}