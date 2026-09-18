import { Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { ActionCard } from '@/components/ActionCard';
import { getSafetyContact } from '@/lib/storage';
import { openSms } from '@/lib/messages';
import { useAppLanguage } from '@/lib/useAppLanguage';

export default function More(){ const {t}=useAppLanguage(); async function sms(body:string){const c=await getSafetyContact();if(!c)return Alert.alert(t.noContact);await openSms(c,body)}
return <Screen>
<ActionCard icon="🕒" title={t.safetyTimer} onPress={()=>router.push('/safety-timer')}/>
<ActionCard icon="📳" title={t.checkIn} onPress={()=>sms("I'm okay. Just checking in.")}/>
<ActionCard icon="🔊" title={t.alarm} onPress={()=>router.push('/alarm')}/>
<ActionCard icon="🚪" title={t.meetOutside} onPress={()=>sms("I'm almost there. Please come outside to meet me.")}/>
<ActionCard icon="💬" title={t.quickMessages} onPress={()=>router.push('/quick-messages')}/>
<ActionCard icon="🫥" title={t.discreet} onPress={()=>router.push('/settings')}/>
</Screen> }
