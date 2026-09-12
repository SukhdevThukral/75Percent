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
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.EXPO_PUBLIC_GEMINI_KEY}`, {
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
      console.log('status:', response.status)
      console.log('gemini', JSON.stringify(data))
      console.log('keyloaded:', process.env.EXPO_PUBLIC_GEMINI_KEY?.slice(0,10))
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
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        <View style={s.topRow}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>S</Text>
          </View>
          <View>
            <Text style={s.greeting}>Good morning</Text>
            <Text style={s.name}>Sukhdev</Text>
          </View>
        </View>

        <Text style={s.hero}>Set up your{'\n'}<Text style={s.heroAccent}>Timetable</Text></Text>
        <Text style={s.sub}>Upload a photo of your timetable and we'lle extract everything automatically :p</Text>

        <TouchableOpacity style={s.uploadCard} onPress={pickImg} disabled={loading} activeOpacity={0.8}>
          {image ? (
            <Image source={{uri: image}} style={s.preview} resizeMode='contain'/>
          ): (
            <View style={s.uploadInner}>
              <View style={s.uploadIconBox}>
                <Text style={s.uploadIconText}>📷</Text>
              </View>
              <Text style={s.uploadTitle}>Upload Timetable</Text>
              <Text style={s.uploadHint}>Photo, screenshot, or PDF</Text>
            </View>
          )}
        </TouchableOpacity>

        {loading && (
          <View style={s.stateBox}>
            <ActivityIndicator color="#6366F1" size="large"/>
            <Text style={s.stateText}>Reading your timetable....</Text>
          </View>
        )}

        {error && !loading && (
          <View style={s.errorCard}>
            <Text style={s.errorTitle}>Couldn't read timetable</Text>
            <Text style={s.errorSub}>{error}</Text>
            <TouchableOpacity style={s.retryBtn} onPress={pickImg}>
              <Text style={s.retryText}>
                Try again
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {parsed && !loading && (
          <View style={s.resultSection}>
            <View style={s.resultHeader}>
              <Text style={s.resultTitle}>Found {parsed.length} classes</Text>
              <View style={s.badge}>
                <Text style={s.badgeText}>✓</Text>
              </View>
            </View>
          

            {parsed.map((slot, i) => {
              const colors = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899']
              const color = colors[i % colors.length]
              return (
                <View key={i} style={[s.slotCard, {borderLeftColor: color}]}>
                  <View style={[s.slotDot, {backgroundColor: color}]}/>
                  <View style={s.slotInfo}>
                    <Text style={s.slotSubject}>{slot.subject}</Text>
                    <Text style={s.slotMeta}>{slot.day} · {slot.time}</Text>
                  </View>
                  <View style={[s.roomBadge, {backgroundColor: color + '22'}]}>
                    <Text style={[s.roomText, {color}]}>{slot.room}</Text>
                  </View>
                </View>
              )
            })}

            <TouchableOpacity style={s.confirmBtn} onPress={confirm} activeOpacity={0.85}>
              <Text style={s.confirmBtn}>Looks good  → </Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.reUploadBtn} onPress={pickImg}>
              <Text style={s.reUploadText}>Upload different</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const s = StyleSheet.create({
  safe: {flex:1, backgroundColor: '#0f0f0f'},
  container: {padding: 24, paddingTop: 20, paddingBottom: 60},

  topRow: {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32},
  avatar: {width: 44, height: 44, borderRadius: 22, backgroundColor: '#6366F1', alignItems: 'center', justifyContent:'center'},
  avatarText: {color: '#fff', fontWeight: '800', fontSize: 18},
  greeting: {color: '#ffffff50', fontSize: 12},
  name: {color: '#fff', fontSize: 16, fontWeight: '700'},
  
  hero: {color: '#fff', fontSize: 36, fontWeight: '800', letterSpacing: -1, lineHeight:44, marginBottom: 12},
  heroAccent: {color: '#6366F1'},
  sub: {color: '#ffffff50', fontSize: 14, lineHeight: 20, marginBottom: 28},

  uploadCard: {
    backgroundColor: '#161616', borderRadius: 24, minHeight: 180,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2a2a2a', marginBottom: 20
  },

  uploadInner: {alignItems: 'center', padding: 32, gap: 10},
  uploadIconBox : {width: 64, height:64, borderRadius: 20, backgroundColor: '#6366F122', alignItems: 'center', justifyContent: 'center', marginBottom: 4},
  uploadIconText: {fontSize:28},
  uploadTitle: {color: '#fff', fontSize: 16, fontWeight: '700'},
  uploadHint: {color: '#ffffff40', fontSize: 16},
  preview: {width: '100%', height: 200, borderRadius: 20},

  stateBox: {alignItems:'center', gap: 12, paddingVertical: 24},
  stateText: {color: '#ffffff60', fontSize: 14},

  errorCard: {backgroundColor: '#1a1010', borderRadius: 16, padding: 20, gap: 6, marginBottom: 16},
  errorTitle: {color: '#EF4444', fontSize: 15, fontWeight: '700'},
  errorSub: {color: '#ffffff50', fontSize: 13},
  retryBtn: {marginTop: 8, backgroundColor: '#EF444422', borderRadius: 10, padding: 12, alignItems: 'center'},
  retryText: {color: '#EF4444', fontWeight: '600', fontSize: 14},

  resultSection: {gap: 10},
  resultHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4},

  resultTitle: {color: '#fff', fontSize: 18, fontWeight: '700'},
  badge: {width: 28, height: 28, borderRadius: 14, backgroundColor: '#6366F1', alignItems:'center', justifyContent:'center'},
  badgeText: {color: '#fff', fontSize: 13, fontWeight:'700'},

  slotCard: {
    backgroundColor: '#161616', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems:'center', gap: 12, borderLeftWidth:3
  },

  slotDot: {width: 8, height: 8, borderRadius: 4},
  slotInfo: {flex:1},
  slotSubject: {color: '#fff', fontSize: 15, fontWeight: '600'},
  slotMeta: {color: '#ffffff50', fontSize: 12, marginTop:2},
  roomBadge: {paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8},
  roomText: {fontSize: 12, fontWeight: '600'},

  confirmBtn: {backgroundColor: '#6366F1', borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 8},
  confirmText: {color: '#fff', fontWeight: '700',  fontSize: 16},
  reUploadBtn: {padding: 14, alignItems: 'center'},
  reUploadText: {color: '#ffffff30', fontSize: 13},
})