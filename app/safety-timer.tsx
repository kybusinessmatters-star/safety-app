import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { Screen } from '@/components/Screen';
import { scheduleSafetyTimer } from '@/lib/notifications';
import { useAppLanguage } from '@/lib/useAppLanguage';
import { useAppTheme } from '@/lib/theme';
export default function Timer(){const{t}=useAppLanguage();const{theme}=useAppTheme();const[m,setM]=useState('20');async function start(){const n=Math.max(1,Number(m)||20);await scheduleSafetyTimer(n);Alert.alert(t.timerStarted)} return <Screen><Text style={[s.h1,{color:theme.text}]}>{t.safetyTimer}</Text><Text style={[s.label,{color:theme.text}]}>{t.timerMinutes}</Text><TextInput style={[s.input,{backgroundColor:theme.surface,borderColor:theme.border,color:theme.text}]} placeholderTextColor={theme.secondaryText} keyboardType="number-pad" value={m} onChangeText={setM}/><Pressable style={[s.button,{backgroundColor:theme.accent}]} onPress={start}><Text style={[s.text,{color:theme.accentText}]}>{t.start}</Text></Pressable><Text style={[s.note,{color:theme.secondaryText}]}>MVP behavior: the phone reminds you to check in. Automatic remote escalation requires an SMS/push provider on the backend.</Text></Screen>}
const s=StyleSheet.create({h1:{fontSize:28,fontWeight:'800',marginBottom:24},label:{fontWeight:'700',marginBottom:8},input:{borderWidth:1,padding:14,borderRadius:12},button:{padding:15,borderRadius:12,alignItems:'center',marginTop:12},text:{fontWeight:'800'},note:{marginTop:15,lineHeight:20}})
