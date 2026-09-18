import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { scheduleFakeCallNotification } from '@/lib/notifications';
import { useAppLanguage } from '@/lib/useAppLanguage';
import { useAppTheme } from '@/lib/theme';

export default function FakeCall(){
  const {language,t}=useAppLanguage(); const {theme}=useAppTheme();
  const [caller,setCaller]=useState(t.callerDad); const [delay,setDelay]=useState(0);
  const callers=[t.callerMom,t.callerDad,t.callerFriend];
  const delays=[{l:t.now,v:0},{l:t.sec30,v:30},{l:t.min2,v:120},{l:t.min5,v:300}];
  async function go(){ if(delay===0) router.push(`/fake-incoming?caller=${encodeURIComponent(caller)}&language=${language}` as any); else { await scheduleFakeCallNotification(delay,caller,language); router.back(); } }
  const pill=(active:boolean)=>({backgroundColor:active?theme.selected:theme.surface,borderColor:active?theme.selectedBorder:theme.border});
  return <Screen><Text style={[s.h1,{color:theme.text}]}>{t.fakeCall}</Text><Text style={[s.label,{color:theme.text}]}>{t.chooseCaller}</Text><View style={s.wrap}>{callers.map(c=><Pressable key={c} onPress={()=>setCaller(c)} style={[s.pill,pill(caller===c)]}><Text style={{color:theme.text}}>{c}</Text></Pressable>)}</View><Text style={[s.label,{color:theme.text}]}>{t.callWhen}</Text><View style={s.wrap}>{delays.map(d=><Pressable key={d.v} onPress={()=>setDelay(d.v)} style={[s.pill,pill(delay===d.v)]}><Text style={{color:theme.text}}>{d.l}</Text></Pressable>)}</View><Pressable style={[s.button,{backgroundColor:theme.accent}]} onPress={go}><Text style={[s.buttonText,{color:theme.accentText}]}>{t.start}</Text></Pressable><Text style={[s.note,{color:theme.secondaryText}]}>Delayed calls use a local notification. Tapping it opens the in-app call screen.</Text></Screen>
}
const s=StyleSheet.create({h1:{fontSize:28,fontWeight:'800',marginBottom:24},label:{fontSize:16,fontWeight:'700',marginTop:8,marginBottom:10},wrap:{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:20},pill:{padding:12,paddingHorizontal:16,borderWidth:1,borderRadius:99},button:{padding:16,borderRadius:14,alignItems:'center',marginTop:10},buttonText:{fontWeight:'800'},note:{marginTop:14,lineHeight:19}})
