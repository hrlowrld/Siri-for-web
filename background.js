const DEFAULTS={muted:false,notes:[],reminders:[],fitbitToken:""};
chrome.runtime.onInstalled.addListener(async()=>{const v=await chrome.storage.local.get(DEFAULTS);await chrome.storage.local.set(v);});
chrome.action.onClicked.addListener(async tab=>{if(tab.id)chrome.tabs.sendMessage(tab.id,{type:"SIRI27_TOGGLE"}).catch(()=>{});});
chrome.runtime.onMessage.addListener((m,s,reply)=>{
  (async()=>{
    if(m.type==="SIRI27_ALARM"){await chrome.alarms.create("siri27:"+m.id,{when:Date.now()+Math.max(1,m.delay)*1000});reply({ok:true});}
    else if(m.type==="SIRI27_CANCEL_ALARM"){await chrome.alarms.clear("siri27:"+m.id);reply({ok:true});}
    else if(m.type==="SIRI27_NOTIFY"){await chrome.notifications.create("siri27:"+Date.now(),{type:"basic",iconUrl:chrome.runtime.getURL("icon.svg"),title:m.title||"Siri27",message:m.message||""});reply({ok:true});}
    else if(m.type==="SIRI27_WEATHER"){const q=encodeURIComponent(m.city||"");const g=await fetch("https://geocoding-api.open-meteo.com/v1/search?name="+q+"&count=1&language=en&format=json");const gj=await g.json();if(!gj.results?.length)throw Error("Location not found");const p=gj.results[0];const w=await fetch("https://api.open-meteo.com/v1/forecast?latitude="+p.latitude+"&longitude="+p.longitude+"&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m");const j=await w.json();reply({ok:true,place:p.name,weather:j.current});}
    else if(m.type==="SIRI27_FITBIT"){const {fitbitToken=""}=await chrome.storage.local.get("fitbitToken");if(!fitbitToken)throw Error("Add your Fitbit access token in Siri27 Settings first.");const r=await fetch("https://api.fitbit.com/1/user/-/activities/date/today.json",{headers:{Authorization:"Bearer "+fitbitToken}});if(!r.ok)throw Error("Fitbit request failed ("+r.status+")");reply({ok:true,data:await r.json()});}
  })().catch(e=>reply({ok:false,error:e.message}));
  return true;
});
chrome.alarms.onAlarm.addListener(async a=>{if(!a.name.startsWith("siri27:"))return;const id=a.name.slice(7);const {reminders=[]}=await chrome.storage.local.get("reminders");const item=reminders.find(x=>x.id===id);await chrome.notifications.create("siri27:"+id,{type:"basic",iconUrl:chrome.runtime.getURL("icon.svg"),title:item?.title||"Siri27 Timer",message:item?.text||"Your timer is finished."});});
