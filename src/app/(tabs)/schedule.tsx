import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import tw from 'twrnc'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { loadClasses, ClassSlot } from '@/utils/classes'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']


function toMinutes(t: string) {
    const [hm, period] = t.split(' ')
    let [h,m] = hm.split(':').map(Number)
    if (period === 'PM' && h !== 12) h += 12
    if (period === 'AM' && h === 12) h =0
    return h * 60 + m
}

function getWeekDates(baseDate: Date) {
    const week = []
    const start = new Date(baseDate)
    const day = start.getDay()
    start.setDate(start.getDate() - day) // go to Sunday
    for (let i = 0; i < 7; i++) {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        week.push(d)
    }
    return week
}

export default function Schedule(){
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [classes, setClasses] = useState<ClassSlot[]>([])
    const [weekOffset, setWeekOffset] = useState(0)


    useEffect(() => {
        loadClasses().then(saved => { if (saved) setClasses(saved) })
    }, [])

    const baseDate = new Date()
    baseDate.setDate(baseDate.getDate() + weekOffset * 7)
    const weekDates = getWeekDates(baseDate)
    
    const selectedDay = DAY_NAMES[selectedDate.getDay()]
    const dayClasses = classes
        .filter(c => c.day === selectedDay)
        .sort((a, b) => toMinutes(a.time) - toMinutes(b.time))

    const TIME_SLOTS = dayClasses.length > 0 
        ? [...new Set(dayClasses.map(c => c.time))].sort((a, b) => toMinutes(a) - toMinutes(b))
        : []

    function getClassForTime(time: string) {
        return dayClasses.find(c => c.time === time || (
            toMinutes(time) >= toMinutes(c.time) && toMinutes(time) < toMinutes(c.end)
        ))
    }

    const monthLabel = MONTH_NAMES[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear()

    return (
        <SafeAreaView style={tw`flex-1 bg-[#0f0f0f]`}>
            <View style={tw`px-6 pt-4 flex-row items-center justify-between mb-4 mt-2`}>
                <TouchableOpacity style={tw`w-9 h-9 rounded-full bg-[#1C1C1E] items-center justify-center`} onPress={() => router.back()}>
                    <Text style={tw`text-white text-base`}>◀</Text>
                </TouchableOpacity>
                <Text style={tw`text-white text-2xl font-bold`}>Calender</Text>
                <View style={tw`w-9 h-9`}/>
            </View>
            <View style={tw`flex-row items-center justify-between px-6 mb-4`}>
                <TouchableOpacity onPress={() => setWeekOffset(w=> w -1)}>
                    <Text style={tw`text-[#7C3AED] text-2xl font-bold`}>‹</Text>
                </TouchableOpacity>
                <Text style={tw`text-[#ffffff60] text-sm`}>{monthLabel}</Text>
                <TouchableOpacity onPress={() => setWeekOffset(w => w + 1)}>
                    <Text style={tw`text-[#7C3AED] text-2xl font-bold`}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={tw`flex-row justify-between px-4 mb-6`}>
                {weekDates.map((date, i) => {
                    const isToday  = date.toDateString() === new Date().toDateString()
                    const isActive  = date.toDateString() === selectedDate.toDateString()
                    return (
                        <TouchableOpacity key={i} onPress={() => setSelectedDate(new Date(date))} style={[tw`items-center py-2 px-1`, {minWidth: 40}, isActive && { backgroundColor: '#7C3AED', borderRadius: 20, paddingVertical: 10, paddingHorizontal: 12}
                        ]}>
                            <Text style={[tw`text-base font-bold`, {color:'#fff'}]}>{date.getDate()}</Text>
                            <Text style={[tw`text-xs mt-1`, {color: isActive ? '#ffffff90' : isToday ? '#7C3AED' : '#ffffff40'}]}>{DAY_NAMES[date.getDay()]}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            {TIME_SLOTS.length === 0 && (
                <View style={tw`items-center mt-20`}>
                    <Text style={tw`text-[#ffffff30] text-sm`}>No classes on {selectedDay}</Text>
                </View>
            )}

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
