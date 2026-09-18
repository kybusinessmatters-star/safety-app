import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { StaticScreen } from '@/components/Screen';
import { useAppLanguage } from '@/lib/useAppLanguage';
import { useAppTheme } from '@/lib/theme';
const source=require('@/assets/alarm.wav');
export default function Alarm(){const{t}=useAppLanguage();const{theme}=useAppTheme();const player=createAudioPlayer(source);useEffect(()=>{setAudioModeAsync({playsInSilentMode:true,interruptionMode:'doNotMix'}).then(()=>{player.loop=true;player.volume=1;player.play()});return()=>player.release()},[]);return <StaticScreen><Text style={[s.h1,{color:theme.text}]}>{t.alarm}</Text><Text style={[s.note,{color:theme.secondaryText}]}>A loud alarm is playing.</Text><Pressable style={[s.stop,{backgroundColor:theme.accent}]} onPress={()=>player.pause()}><Text style={[s.stopText,{color:theme.accentText}]}>{t.stop}</Text></Pressable></StaticScreen>}
const s=StyleSheet.create({h1:{fontSize:32,fontWeight:'800',textAlign:'center',marginTop:80},note:{textAlign:'center',marginTop:12},stop:{marginTop:'auto',padding:18,borderRadius:16,alignItems:'center',marginBottom:40},stopText:{fontSize:18,fontWeight:'800'}})
