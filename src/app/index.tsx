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
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [parsed, setParsed] = useState<ClassSlot[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const pickImg = async()=>{
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted){
      alert('Permission needed to access photos')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      base64: true,
      quality: 0.8,
      allowsEditing: false,
    })
    
    if (!result.canceled  && result.assets[0].base64) {
      setImage(result.assets[0].uri)
      await parseTT(result.assets[0].base64)
    }
  }

  const parseTT = async (base64: string) => {
    setLoading(true)
    setError(null)

    try{
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_GEMINI_KEY`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: 
                {
                  mime_type: 'image/jpeg',
                  data: base64
                }
              },
              {
                text: `Extract the timetable from this image. Return ONLY a JSON array, no markdown, no explanation. Each object must have: subject (string), day (string, e.g. "Monday"), time (string, e.g. "9:00 AM"), room (string, use "N/A" if not visible). Example: [{"subject":"Maths","day":"Monday","time":"9:00 AM","room":"B-204"}]`
              }
            ]
          }]
        })
      })

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!text) throw new Error('No response from Gemini')
      const clean = text.replace(/```json|```/g, '').trim()
      const slots: ClassSlot[] = JSON.parse(clean)
      setParsed(slots)
    } catch (e) {
      setError('Could not parse your timetable. Try a clearer photo.')
    } finally {
      setLoading(false)
    }
  }

  const confirm = async()=> {
    if (!parsed) return
    await AsyncStorage.setItem('timetable', JSON.stringify(parsed))
    router.replace('/(tabs)' as any)
  }

  return(
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.container} showsHorizontalScrollIndicator={false}>
        <Text style={s.title}>75%</Text>
        <Text style={s.sub}>Upload your timetable and we'll handle the rest for you</Text>
        <TouchableOpacity style={s.uploadBox} onPress={pickImg} disabled={loading}>
          {image ? (
            <Image source={{uri: image}} style={s.preview} resizeMode="contain"/>
          ) : (
            <>
              <Text style={s.uploadText}>📷</Text>
              <Text style={s.uploadText}>Tap to upload timetable photo</Text>
              <Text style={s.uploadHint}>Works with photos, screenshots, and PDFs.</Text>
            </>
          )}
        </TouchableOpacity>

        {loading && (
          <View style={s.loadingBox}>
            <ActivityIndicator color='#6366F1' size="large"/>
            <Text style={s.loadingText}>Parsing your timetable...</Text>
          </View>
        )}

        {error && (
          <View style={s.errorBox}>
            <Text style={s.errorText}>{error}</Text>
            <TouchableOpacity onPress={pickImg}>
              <Text style={s.retryText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        { parsed && !loading && (
          <View style={s.resultBox}>
            <Text style={s.resultTitle}>Found {parsed.length} classes ✓</Text>
            {parsed.map((slot, i) => (
              <View key={i} style={s.slowRow}>
                <View style={s.slotLeft}>
                  <Text style={s.slotSubject}>{slot.subject}</Text>
                  <Text style={s.slotMeta}>{slot.day} · {slot.time} · {slot.room}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity style={s.confirmBtn} onPress={confirm}>
              <Text style={s.confirmText}>Looks good, lets go →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.retryBtn} onPress={pickImg}>
              <Text style={s.retrynBtnText}>Upload different photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: {flex:1, backgroundColor: '#0f0f0f'},
  container: {padding: 24, paddingTop: 60, paddingBottom: 40},

  title: {color:'#fff', fontSize: 48, fontWeight: '800', letterSpacing: -2, marginBottom: 8},
  sub : {color: '#ffffff60', fontSize: 16, marginBottom: 32, lineHeight: 22},

  uploadBox: {
    borderWidth: 1.5, borderColor: '#2a2a2a', borderStyle: 'dashed',
    borderRadius: 20, padding: 32, alignItems: 'center', justifyContent: 'center',
    minHeight: 180, marginBottom: 24, backgroundColor: '#161616'
  },

  uploadIcon : {fontSize: 36, marginBottom: 12},
  uploadText: {color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 6},
  uploadHint: {color: '#ffffff40', fontSize: 12},
  preview: {width: '100%', height: 200, borderRadius: 12},

  loadingBox: {alignItems: 'center', padding: 24, gap: 12},
  loadingText: {color: '#ffffff60', fontSize: 14},

  errorBox: {backgroundColor: '#2a1a1a', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8},
  errorText: {color: '#EF4444', fontSize: 14, fontWeight: '700', marginBottom:12, letterSpacing: 0.5},
  retryText: {color: '#6366F1', fontSize: 14, fontWeight: '600'},

  resultBox: {backgroundColor: '#2a1a1a', borderRadius: 12, padding: 16, alignItems: 'center', gap: 8},
  resultTitle: {color: '#6366F1', fontSize: 14, fontWeight: '700', marginBottom: 12, letterSpacing: 0.5},
  slowRow: {paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a2a'},
  slotLeft: {gap: 3},
  slotSubject: {color: '#fff'},
  slotMeta: {color: '#ffffff50', fontSize: 12},

  confirmBtn: {backgroundColor: '#6366F1', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20},
  confirmText: {color: '#fff', fontWeight: '700',  fontSize: 15},
  retryBtn: {padding: 12, alignItems: 'center'},
  retrynBtnText: {color: '#ffffff40', fontSize: 13},
})