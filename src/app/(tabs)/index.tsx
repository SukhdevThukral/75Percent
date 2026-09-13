import {View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ClassSlot } from '..'
import tw from 'twrnc'

const COLORS = ['#7C3AED', '#DB2777', '#059669', '#D97706', '#2563EB', '#DC2626']

const CLASSES = [
    {subject: 'Mathematics', time: '9:00 AM', room: 'B-204', teacher: 'Mr. Sharma'},
    {subject: 'Physics', time: '10:30 AM', room: 'A-101', teacher: 'Ms. Verma'},
    {subject: 'English', time: '12:00 PM', room: 'C-301', teacher: 'Mr. Singh'},
    {subject: 'Chemistry', time: '2:00 PM', room: 'Lab-1', teacher: 'Dr. Gupta'},
]

type Status = 'present' | 'absent' | null

export default function Home() {
    const [status, setStatus] = useState<Record<string, Status>>({})

    const toggle = (subject: string, val: Status) => {
        setStatus(p=> ({...p,[subject]: p[subject] === val ? null : val}))
    }

    const attended = Object.values(status).filter(v=> v === 'present').length
    const total = CLASSES.length
    const percent = total === 0 ? 75 : Math.round((attended/total)*100)
    const safe = percent >=75

    return(
        <SafeAreaView style={tw`flex-1 bg-[#0f0f0f]`}>
            <ScrollView contentContainerStyle={tw`px-6 pt-3 pb-16`} showsVerticalScrollIndicator={false}>
                <View style={tw`flex-row justify-between itmes-center mb-7`}>
                    <View style={tw`flex-row items-center gap-3`}>
                        <View style={tw`w-11 h-11 rounded-full bg-[#7C3AED] items-center justify-center`}>
                            <Text style={tw`text-white font-extrabold text-lg`}>S</Text>
                        </View>
                        <View>
                            <Text style={tw`text-[#ffffff40] text-xs`}>Good morning!</Text>
                            <Text style={tw`text-white text-base font-bold`}>Sukhdev</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={tw`w-10 h-10 rounded-full bg-[#1a1a1a] items-center justify-center`}>
                        <Text style={tw`text-lg`}>🔔</Text>
                    </TouchableOpacity> 
                </View>

                <Text style={tw`text-white text-[34px] font-extrabold leading-[42px] tracking-tight mb-4`}>
                    You have <Text style={tw`text-[#7C3AED]`}>{total}</Text>{'\n'}classes today
                </Text>

                <View style={tw`mb-7`}>
                    <View style={tw`flex-row items-center gap-2 px-4 py-2 rounded-full self-start ${safe ? 'bg-[#05966922]': 'bg-[#DC262622]'}`}>
                        <View style={tw`w-2 h-2 rounded-full ${safe ? 'bg-[#059669]' : 'bg-[#DC2626]'}`}/>
                        <Text style={tw`text-sm font-semibold ${safe? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                            {safe ? `${percent}% - youre safe` : `${percent}% - danger zone`}
                        </Text>
                    </View>
                </View>

                <Text style={tw`text-[#ffffff50] text-xs font-bold tracking-widest uppercase mb-4`}>Today's Classes</Text>

                {CLASSES.map((cls, i)=>{
                    const color = COLORS[i%COLORS.length]
                    const st = status[cls.subject]

                    return(
                        <View key={cls.subject} style={[tw`rounded-3xl p-5 mb-4`, {backgroundColor: color}]}>
                            <View style={tw`flex-row justify-between items-start`}>
                                <View style={tw`flex-1 gap-1.5`}>
                                    <Text style={tw`text-white text-xl font-extrabold tracking-tight`}>{cls.subject}</Text>
                                    <View style={tw`flex-row gap-3`}>
                                        <Text style={tw`text-[#ffffff90] text-xs font-medium`}>⏰ {cls.time} </Text>
                                        <Text style={tw`text-[#ffffff90] text-xs font-medium`}>📍 {cls.room}</Text>
                                    </View>
                                    <Text style={tw`text-[#ffffff70] text-sm`}>{cls.teacher}</Text>
                                </View>
                                <View style={tw`gap-2`}>
                                    <TouchableOpacity style={tw`w-9 h-9 rounded-full items-center justify-center ${st ==='present'?'bg-white':'bg-[#ffffff22]'}`} onPress={() => toggle(cls.subject, 'present')}>
                                        <Text style={tw`font-extrabold text-sm ${st === 'present' ? 'text-['+color+']' : 'text-white'}`}>✓</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}