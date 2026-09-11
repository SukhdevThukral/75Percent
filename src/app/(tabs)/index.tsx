import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from 'react-native'
import { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ClassSlot } from '..'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

type Status = 'present' | 'absent' | null

export default function HomeScreen() {
    const [timetable, setTimetable] = useState<ClassSlot[]>([])
    const [attendance, setAttendance] = useState<Record<string, Status>>({})
    
}

const CLASSES = [
    {id: '1', subject: 'Mathematics', time: '9:00 AM', room: 'B-204'},
    {id: '2', subject: 'Physics', time: '10'
    }
]