import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import tw from 'twrnc'

const CLASSES = [
    {subject: 'Mathematics', time: '9:00 AM', end:'10:300 AM', room: 'B-204', teacher: 'Mr. Sharma', color: '#7C3AED'},
    {subject: 'Physics', time: '10:30 AM', end: '12:00 PM', room: 'A-101', teacher: 'Ms. Verma', color: '#DB2777'},
    {subject: 'English', time: '12:00 PM', end: '1:30 PM', room: 'C-301', teacher: 'Mr. Singh', color: '#059669'},
    {subject: 'Chemistry', time: '2:00 PM', end: '3:30 PM', room: 'Lab-1', teacher: 'Dr. Gupta', color: '#D97706'},
]

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM",  "03:00 PM"]

const WEEK = ['18\nMon', '19\nTue', '20\nWed', '21\nThu', '22\nFri', '23\nSat', '24\nSun']

function getClassForTime(time: string) {
    return CLASSES.find(c => c.time === time || (
        toMinutes(time) >= toMinutes(c.time) && toMinutes(time) < toMinutes(c.end)
    ))
}

function toMinutes(t: string) {
    const [hm, period] = t.split(' ')
    let [h,m] = hm.split(':').map(Number)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h =0
    return h * 60 + m
}

export default function Schedule(){
    const [activeDay, setActiveDay] = useState(3)

    return (
        <SafeAreaView style={tw`flex-1 bg-[#0f0f0f]`}>
            <View style={tw`px-6 pt-4 flex-row items-center justify-between mb-2`}>
                <TouchableOpacity style={tw`w-9 h-9 rounded-full bg-[#1C1C1E] items-center justify-center`}>
                    <Text style={tw`text-white text-base`}>‹</Text>
                </TouchableOpacity>
                <Text style={tw`text-white text-lg font-bold`}>Schedule</Text>
                <TouchableOpacity style={tw`w- h-9 rounded-full bg-[#1C1C1E] items-center justify-center`}>
                    <Text style={tw`text-white text-base`}>⋮</Text>
                </TouchableOpacity>
            </View>

            <Text style={tw`text-[#ffffff60] text-sm text-center mb-4`}>August</Text>

            <View style={tw`flex-row justify-between px-4 mb-6`}>
                {WEEK.map((day, i) => {
                    const [num, label] = day.split('\n')
                    const isActive = i === activeDay
                    return (
                        <TouchableOpacity key={i} onPress={() => setActiveDay(i)} style={[tw`items-center py-2 px-1 rounded-2xl`, {minWidth: 40}, isActive && { backgroundColor: '#7C3AED', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 12}
                        ]}>
                            <Text style={[tw`text-base font-bold`, {color: isActive?'#fff' : '#fff'}]}>{num}</Text>
                            <Text style={[tw`text-xs mt-1`, {color: isActive ? '#ffffff90' : '#ffffff40'}]}>{label}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            <ScrollView style={tw`flex-1 px-4`} showsVerticalScrollIndicator={false}>
                {TIME_SLOTS.map((slot, i) => {
                    const cls = getClassForTime(slot)
                    const isClassStart = cls && cls.time === slot

                    return (
                        <View key={slot} style={tw`flex-row mb-2`}>
                            <View style={{width: 72}}>
                                <Text style={tw`text-[#ffffff40] text-xs pt-1`}>{slot}</Text>
                            </View>

                            <View style={tw`flex-1`}>
                                {isClassStart && cls ? (
                                    <View style={[tw`rounded-2xl p-4 mb-1`, {backgroundColor: cls.color + '22', borderLeftWidth: 4, borderLeftColor: cls.color}]}>
                                        <Text style={[tw`text-base font-bold`, {color: cls.color}]}>{cls.subject}</Text>
                                        <View style={tw`flex-row items-center gap-1 mt-1`}>
                                            <Text style={tw`text-[#ffffff60] text-xs`}>⏰ {cls.time} - {cls.end}</Text>
                                        </View>
                                        <View style={tw`flex-row items-center gap-2 mt-2`}>
                                            <View style={[tw`w-6 h-6 rounded-full items-center justify-center`, {backgroundColor: cls.color}]}>
                                                <Text style={tw`text-white text-xs font-bold`}>{cls.teacher.split(' ').pop()![0]}</Text>
                                            </View>
                                            <Text style={tw`text-[#ffffff80] text-xs`}>{cls.teacher}</Text>
                                    </View>
                            </View>
                            ) : (
                                <View style={[tw`border-t`, { borderColor: '#2a2a2a', marginTop: 8}]}/>
                            )}
                            </View>
                        </View>
                    )
                })}
                <View style={{height: 20}}/>
            </ScrollView>
        </SafeAreaView>
    )
}
