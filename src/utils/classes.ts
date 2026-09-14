import AsyncStorage from '@react-native-async-storage/async-storage'


export type ClassSlot = {
    subject: string
    time: string
    end: string
    room: string
    teacher: string
    color: string
    day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
}

const COLORS = ['#7C3AED', '#DB2777', '#059669', '#D97706', '#2563EB', '#DC2626']
const KEY = 'user_classes'
const ONBOARDED_KEY= 'has_onboarded'

export async function saveClasses(classes: ClassSlot[]) {
    await AsyncStorage.setItem(KEY, JSON.stringify(classes))
}

export async function loadClasses(): Promise<ClassSlot[] | null> {
    const raw = await AsyncStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
}

export async function hasOnboarded() : Promise<boolean> {
    const val = await AsyncStorage.getItem(ONBOARDED_KEY)
    return val === 'true'
}

export async function setOnboarded() {
    await AsyncStorage.setItem(ONBOARDED_KEY, 'true')
}

export function assignColors(classes:Omit<ClassSlot, 'color'>[]): ClassSlot[] {
    return classes.map((c, i) => ({...c, color: COLORS[i%COLORS.length]}))
}
