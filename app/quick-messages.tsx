import { Alert } from 'react-native';
import { Screen } from '@/components/Screen';
import { ActionCard } from '@/components/ActionCard';
import { getSafetyContact } from '@/lib/storage';
import { openSms } from '@/lib/messages';
import { useAppLanguage } from '@/lib/useAppLanguage';
export default function Quick(){const{t}=useAppLanguage();async function send(body:string){const c=await getSafetyContact();if(!c)return Alert.alert(t.noContact);await openSms(c,body)} return <Screen><ActionCard icon="📲" title={t.callMe} onPress={()=>send('Please call me now.')}/><ActionCard icon="📍" title={t.trackMe} onPress={()=>send('Please keep an eye on my location.')}/><ActionCard icon="🚪" title={t.comeOutside} onPress={()=>send("I'm arriving soon. Please come outside.")}/><ActionCard icon="🆘" title={t.needHelp} danger onPress={()=>send('I need help. Please call me and check my location.')}/><ActionCard icon="✅" title={t.imOkay} onPress={()=>send("I'm okay.")}/></Screen>}
