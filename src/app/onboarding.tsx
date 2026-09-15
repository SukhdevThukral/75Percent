import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import tw from 'twrnc'
import { saveClasses, setOnboarded, assignColors } from '@/utils/classes'

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY

export default function Onboarding() {
    const [image, setImage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const pickImg = async ()=> {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            base64: true,
            quality: 0.8,
        })
        if (!result.canceled) {
            setImage(result.assets[0].uri)
            await geminiUse(result.assets[0].base64!)
        }
    }

    const geminiUse = async (base64: string) => {
        setLoading(true)
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            {
                                text: `Extract ALL classes from this weekly timetable image and return ONLY a JSON array, no explanation, no markdown. Each class must have: subject (string - full subject name not abbreviation), day (string: exactly one of "Mon","Tue","Wed","Thu","Fri","Sat","Sun"), time (string in format "09:00 AM"), end (string in format "10:00 AM"), room (string), teacher (string). If room or teacher missing use "TBD". One object per class per day — if a subject appears on multiple days, create a separate object for each day. Example: [{"subject":"Physics","day":"Mon","time":"09:00 AM","end":"10:00 AM","room":"A-101","teacher":"Dr. Sharma"}]`
                            }, 
                            {
                                inline_data : {mime_type: 'image/jpeg', data: base64}
                            }
                        ]
                    }]
                })
            }
        )
        const data = await response.json()
        console.log('gemini response:', JSON.stringify(data))  // ADD THIS
        console.log('key:', process.env.EXPO_PUBLIC_GEMINI_API_KEY)

        const text = data.candidates[0].content.parts[0].text
        const clean = text.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(clean)
        const withColors = assignColors(parsed)
        await saveClasses(withColors)
        await setOnboarded()
        router.replace('/')
        } catch (e) {
            Alert.alert('Could not parse timetable', 'Try a clearer image')
            setImage(null)            
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-[#0f0f0f]`}>
            <View style={tw`flex-1 px-6 justify-center items-center gap-6`}>
                <Text style={tw`text-white text-4xl font-extrabold tracking-tight text-center`}>
                    Upload your{'\n'}<Text style={tw`text-[#7C3AED]`}>timetable</Text>
                </Text>
                <Text style={tw`text-[#ffffff50] text-sm text-center`}>
                    Upload an image of your college class schedule and we'll do the rest!
                </Text>
                {image && (
                    <Image source={{ uri: image }} style={tw`w-full h-48 rounded-2xl`} resizeMode='cover' />
                )}

                {loading ? (
                    <View style={tw`items-center gap-3`}>
                        <ActivityIndicator size='large' color='#7C3AED' />
                        <Text style={tw`text-[#ffffff50] text-sm`}>Reading your timetable...</Text>
                    </View>
                ) : (
                    <TouchableOpacity onPress={pickImg} style={tw`w-full bg-[#7C3AED] py-4 rounded-2xl items-center`}>
                        <Text style={tw`text-white font-bold text-base`}>🖼️ Choose from Gallery</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    )
}