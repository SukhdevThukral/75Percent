import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Image} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type ClassSlot = {
  subject: string
  day: string
  time: string
  room: string
}

export default function Onboarding(){
  
}