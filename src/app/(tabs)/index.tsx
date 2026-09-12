import {View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ClassSlot } from '..'

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


    return(
        <SafeAreaView style={s.safe}>
            <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>
                <View style={s.header}>
                    <View style={s.avatar}>
                        <Text style={s.avatarText}>S</Text>
                    </View>
                    <View style={s.headerMid}>
                        <Text style={s.greeting}>Good morning!!</Text>
                        <Text style={s.name}>Sukhdev</Text>
                    </View>
                    <View style={s.dateBadge}>
                        <Text style={s.dateText}>{today}</Text>
                    </View>                    
                </View>

                <View style={s.heroCard}>
                    <View style={s.heroTop}>
                        <View>
                            <Text style={s.heroLabel}>🚨 BUNK-O-METER</Text>
                            <Text style={s.heroTitle}>Overall{'\n'}Attendance</Text>
                        </View>
                        <View style={[s.circleBox, {borderColor: accentColor}]}>
                            <Text style={[s.circleNum, {color: accentColor}]}>{overall}%</Text>
                        </View>
                    </View>
                    <View style={s.progressTrack}>
                        <View style={[s.progressFill, {width: `${overall}%` as any, backgroundColor: accentColor}]}/>
                    </View>
                    <Text style={s.heroSub}>
                        {overall >= 75 ? <Text>You're safe ✓</Text> : <Text style={{color: '#EF4444'}}>⚠ Below 75% — don't bunk!</Text>}
                    </Text>
                </View>

                <Text style={s.sectionTitle}>Today · {today}</Text>

                {todaysClasses.length === 0 ? (
                    <View style={s.emptyBox}>
                        <Text style={s.emptyText}>No classes today 🎉</Text>
                    </View>
                ) : (
                    todaysClasses.map((cls, i) =>{
                        const key = `${cls.subject}-${cls.day}-${cls.time}`
                        const status = attendance[key]
                        return(
                            <View key={i} style={s.classCard}>
                                <View style={s.classInfo}>
                                    <Text style={s.className}>{cls.subject}</Text>
                                    <Text style={s.classMeta}>{cls.time} · {cls.room}</Text>
                                </View>
                                <View style={s.actions}>
                                    <TouchableOpacity style={[s.btn, status==='present' && s.btnPresent]}
                                        onPress={()=> mark(key, 'present')}
                                    >
                                        <Text style={[s.btnText, status==='present' && s.btnTextActive]}>P</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[s.btn, status==='absent' && s.btnAbsent]} onPress={()=> mark(key, 'absent')}>
                                        <Text style={[s.btnText, status==='absent' && s.btnTextActive]}>A</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

const s = StyleSheet.create({
    safe: {flex: 1, backgroundColor: '#0F0F0F'},
    container: {padding: 20, paddingBottom: 40},

    header: {flexDirection: 'row', alignItems: 'center', marginBottom: 20},
    avatar: {width: 40, height: 40, borderRadius: 20, backgroundColor: '#6366F1', alignItems: 'center', justifyContent: 'center', marginRight: 10},
    avatarText: {color: '#fff', fontWeight: '700', fontSize: 16},
    headerMid: {flex: 1},
    greeting: {color: '#fff', fontSize:18},
    name: {color: '#fff', fontSize: 18, fontWeight: '700'},
    dateBadge: {backgroundColor: '#1A1A1A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20},
    dateText: {color: '#ffffff60', fontSize: 12},


    heroCard: {backgroundColor: '#161616', borderRadius: 20, padding: 22, marginBottom:24},
    heroTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems:'flex-start', marginBottom: 16},
    heroLabel: {color: '#ffffff60', fontSize: 11, letterSpacing: 1.2, marginBottom: 6},
    heroTitle: {color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 28},
    circleBox: {width: 72, height: 72, borderRadius: 36, borderWidth:3, alignItems:'center', justifyContent:'center'},
    circleNum: {fontSize: 18, fontWeight: '800'},
    progressTrack: {height: 4, backgroundColor: '#2a2a2a', borderRadius: 2, marginBottom: 10},
    progressFill: {height: 4, borderRadius:2},
    heroSub: {color:'#ffffff60', fontSize: 13},

    sectionTitle: {color:'#fff', fontSize: 17, fontWeight: '600', marginBottom: 12},

    emptyBox: {backgroundColor: '#161616', borderRadius: 16, padding: 32, alignItems: 'center'},
    emptyText: {color: '#ffffff50', fontSize: 15},

    classCard: {backgroundColor: '#161616', borderRadius:16, padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10},
    classInfo: {flex: 1},
    className: {color: '#fff', fontSize: 15, fontWeight: '600'},
    classMeta: {color: '#ffffff50', fontSize: 12, marginTop: 3},
    actions: {flexDirection: 'row', gap: 8},
    btn: {width: 36, height:36, borderRadius: 10, backgroundColor: '#222', alignItems:'center', justifyContent: 'center'},
    btnPresent: {backgroundColor: '#6366F1'},
    btnAbsent: {backgroundColor: '#EF4444'},
    btnText: {color: '#ffffff60', fontWeight: '700', fontSize: 13},
    btnTextActive: { color: '#fff' }
})