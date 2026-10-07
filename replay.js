const stations = [
  {id:"RW-01",device:"AMR-01",name:"เชียงใหม่",region:"เหนือ",lat:18.7883,lon:98.9853,x:300,y:58,base:5.2,delay:18,signal:"4G",quality:"ดี",battery:86,rates:[0,0,0,.6,1.2,2.4,4.8,7.2,6,4.2,2.4,1.2,.6]},
  {id:"RW-02",device:"AMR-02",name:"เชียงราย",region:"เหนือ",lat:19.9105,lon:99.8406,x:326,y:45,base:2.1,delay:42,signal:"4G",quality:"ดี",battery:91,rates:[0,0,0,0,.6,1.2,1.8,2.4,2.4,1.8,1.2,.6,0]},
  {id:"RW-03",device:"AMR-03",name:"ขอนแก่น",region:"ตะวันออกเฉียงเหนือ",lat:16.4419,lon:102.835,x:373,y:127,base:3.8,delay:27,signal:"4G",quality:"ดี",battery:73,rates:[0,0,.6,1.2,2.4,4.8,9.6,16.8,20.4,18,14.4,9.6,6]},
  {id:"RW-04",device:"AMR-04",name:"นครราชสีมา",region:"ตะวันออกเฉียงเหนือ",lat:14.9799,lon:102.097,x:358,y:156,base:4.3,delay:9,signal:"Wi-Fi",quality:"ดี",battery:67,rates:[0,0,0,.6,1.2,1.8,3,4.8,6,7.2,6,4.2,3]},
  {id:"RW-05",device:"AMR-05",name:"กรุงเทพฯ",region:"กลาง",lat:13.7563,lon:100.5018,x:298,y:212,base:8.5,delay:33,signal:"4G",quality:"ดี",battery:82,rates:[0,0,0,0,.6,1.2,2.4,4.8,8.4,12,14.4,10.8,7.2]},
  {id:"RW-06",device:"AMR-06",name:"กาญจนบุรี",region:"กลาง",lat:14.0228,lon:99.5328,x:269,y:202,base:2.7,delay:54,signal:"4G",quality:"ปานกลาง",battery:54,rates:[0,0,0,.6,1.2,1.2,1.8,2.4,3.6,4.8,4.2,3,1.8]},
  {id:"RW-07",device:"AMR-07",name:"ระยอง",region:"ตะวันออก",lat:12.6814,lon:101.2816,x:340,y:239,base:6.4,delay:12,signal:"4G",quality:"ดี",battery:78,rates:[0,0,1.2,3,6,10.8,16.8,21.6,20.4,16.8,12,8.4,6]},
  {id:"RW-08",device:"AMR-08",name:"สุราษฎร์ธานี",region:"ใต้",lat:9.1382,lon:99.3217,x:250,y:282,base:7.6,delay:38,signal:"4G",quality:"ดี",battery:88,rates:[0,0,0,.6,1.2,1.8,3,4.2,4.8,4.2,3.6,2.4,1.8]},
  {id:"RW-09",device:"AMR-09",name:"สงขลา",region:"ใต้",lat:7.1898,lon:100.5954,x:261,y:321,base:1.9,delay:21,signal:"4G",quality:"ดี",battery:62,rates:[0,0,0,0,.6,1.2,1.8,3,4.8,6,7.2,6,4.2]}
];
const $ = id => document.getElementById(id);
const fmt = n => Number(n).toFixed(1);
const stepMs = 10 * 60 * 1000;
const totalSteps = 12;
const playbackStart = new Date(Date.now() - totalSteps * stepMs);
let selected = "RW-07", step = totalSteps, speed = 10, playing = false, timer = null;
const statusText = {normal:"ปกติ",watch:"เฝ้าระวัง",high:"ระดับสูง"};
const color = {normal:"#21a67a",watch:"#efaa3c",high:"#ed6660"};
const status = s => s.mm >= 25 ? "high" : s.mm >= 10 ? "watch" : "normal";
const stamp = (i,s) => new Date(playbackStart.getTime() + i*stepMs - s.delay*1000);
const timeText = d => new Intl.DateTimeFormat("th-TH",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(d);
const rainAt = (s,i) => Number((s.base + s.rates.slice(0,i+1).reduce((a,b)=>a+b/6,0)).toFixed(1));
function currentRows(){return stations.map(s=>({...s,mm:rainAt(s,step),rate:s.rates[step],timestamp:stamp(step,s)}));}
function renderSelectors(){$("stationSelect").innerHTML=stations.map(s=>`<option value="${s.id}" ${s.id===selected?"selected":""}>${s.device} · ${s.name}</option>`).join("");}
function renderMap(rows){const region=$("regionFilter").value;$("stationLayer").innerHTML=rows.filter(s=>region==="all"||s.region===region).map(s=>{const st=status(s);return `<g class="station ${s.id===selected?"selected":""}" data-id="${s.id}" transform="translate(${s.x} ${s.y})" tabindex="0" role="button" aria-label="${s.device} ${s.name} ฝนสะสม ${fmt(s.mm)} มิลลิเมตร สถานะ${statusText[st]}"><circle class="outer" r="11"/><circle class="inner" r="6" fill="${color[st]}"/><text x="10" y="3">${s.name}</text></g>`}).join("");document.querySelectorAll(".station").forEach(el=>{const select=()=>selectStation(el.dataset.id);el.addEventListener("click",select);el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();select();}});});}
function renderRows(rows){$("stationRows").innerHTML=rows.map(s=>{const st=status(s);return `<tr><td class="station-name"><button data-select="${s.id}" style="border:0;background:none;padding:0;color:inherit;font-weight:inherit;cursor:pointer">${s.device}<br><small>${s.name}</small></button></td><td>${s.region}</td><td>${fmt(s.mm)} มม.</td><td>${fmt(s.rate)} มม./ชม.</td><td><span class="status ${st}">${statusText[st]}</span></td><td>${timeText(s.timestamp)}</td></tr>`;}).join("");document.querySelectorAll("[data-select]").forEach(el=>el.addEventListener("click",()=>selectStation(el.dataset.select)));}
function renderSummary(rows){const avg=rows.reduce((a,s)=>a+s.mm,0)/rows.length,flagged=rows.filter(s=>status(s)!=="normal").length,max=[...rows].sort((a,b)=>b.mm-a.mm)[0];$("avgRain").innerHTML=fmt(avg)+"<span>มม.</span>";$("stationCount").innerHTML=rows.length+"<span>สถานี</span>";$("watchCount").innerHTML=flagged+"<span>จุด</span>";$("maxRain").innerHTML=fmt(max.mm)+"<span>มม.</span>";$("maxPlace").textContent=`${max.name} · ${statusText[status(max)]}`;const ranked=[...rows].sort((a,b)=>b.mm-a.mm).slice(0,3);$("alertList").innerHTML=ranked.map(s=>{const st=status(s),ico=st==="high"?"!":st==="watch"?"△":"i";return `<div class="alert-row"><span class="alert-icon ${st==="high"?"red":st==="watch"?"amber":"blue"}">${ico}</span><div><b>${s.device} · ${s.name} · ${fmt(s.mm)} มม.</b><small>อัตราฝน ${fmt(s.rate)} มม./ชม. · สถานะตัวอย่าง ${statusText[st]}</small></div></div>`;}).join("");}
function renderPacket(rows){const s=rows.find(x=>x.id===selected);$("deviceId").textContent=s.device;$("deviceTime").textContent=timeText(s.timestamp);$("deviceCoords").textContent=`${s.lat.toFixed(4)}, ${s.lon.toFixed(4)}`;$("deviceSignal").textContent=`${s.signal} · แบต ${s.battery}%`;$("qualityBadge").textContent=`สัญญาณ${s.quality}`;$("deviceRain").textContent=`${fmt(s.mm)} มม.`;$("deviceRate").textContent=`${fmt(s.rate)} มม./ชม.`;}
function drawChart(){const c=$("rainChart"),dpr=window.devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;c.width=w*dpr;c.height=h*dpr;const ctx=c.getContext("2d");ctx.scale(dpr,dpr);ctx.clearRect(0,0,w,h);const left=34,right=8,top=9,bottom=27,pw=w-left-right,ph=h-top-bottom,s=stations.find(x=>x.id===selected),from=Math.max(0,step-7),indices=Array.from({length:step-from+1},(_,i)=>from+i),series=indices.map(i=>rainAt(s,i)),ceiling=Math.max(10,Math.ceil(Math.max(...series)/10)*10);ctx.font="10px Tahoma, sans-serif";ctx.textAlign="right";ctx.textBaseline="middle";for(let i=0;i<=4;i++){const val=ceiling*i/4,y=top+ph-ph*i/4;ctx.strokeStyle="#e9eff4";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(w-right,y);ctx.stroke();ctx.fillStyle="#91a0ae";ctx.fillText(Math.round(val),left-7,y);}const gap=pw/(series.length*1.45),barW=Math.min(26,gap*.68);series.forEach((v,j)=>{const x=left+gap*j+gap*.25,bh=Math.max(2,v/ceiling*ph),y=top+ph-bh;ctx.fillStyle=j===series.length-1?"#1677ce":"#b9ddf6";ctx.beginPath();ctx.roundRect(x,y,barW,bh,[4,4,0,0]);ctx.fill();ctx.fillStyle="#8293a2";ctx.textAlign="center";ctx.textBaseline="top";if(j===0||j===series.length-1||j%2===0)ctx.fillText(timeText(stamp(indices[j],s)).slice(0,5),x+barW/2,top+ph+8);});}
function updatePlaybackUI(){const time=new Date(playbackStart.getTime()+step*stepMs);$("timeSlider").value=step;$("playbackTime").textContent=timeText(time);$("timeStart").textContent=timeText(playbackStart).slice(0,5);$("timeEnd").textContent=timeText(new Date(playbackStart.getTime()+totalSteps*stepMs)).slice(0,5);$("chartTime").textContent=timeText(time);$("playBtn").textContent=playing?"❚❚ หยุด":"▶ เล่น";}
function render(){const rows=currentRows();renderSelectors();renderMap(rows);renderRows(rows);renderSummary(rows);renderPacket(rows);drawChart();updatePlaybackUI();}
function selectStation(id){selected=id;render();}
function stop(){playing=false;if(timer)clearInterval(timer);timer=null;updatePlaybackUI();}
function start(){if(step>=totalSteps)step=0;playing=true;updatePlaybackUI();if(timer)clearInterval(timer);timer=setInterval(()=>{step=Math.min(totalSteps,step+1);render();if(step>=totalSteps)stop();},Math.max(80,1200/speed));}
$("stationSelect").addEventListener("change",e=>selectStation(e.target.value));
$("regionFilter").addEventListener("change",()=>renderMap(currentRows()));
$("timeSlider").addEventListener("input",e=>{step=Number(e.target.value);render();});
$("speedSelect").addEventListener("change",e=>{speed=Number(e.target.value);if(playing)start();});
$("playBtn").addEventListener("click",()=>playing?stop():start());
$("latestBtn").addEventListener("click",()=>{stop();step=totalSteps;render();});
$("navStations").addEventListener("click",()=>document.querySelector("#stationsPanel").scrollIntoView({behavior:"smooth",block:"start"}));
$("navSimulator").addEventListener("click",()=>document.querySelector("#simPanel").scrollIntoView({behavior:"smooth",block:"start"}));
$("dateText").textContent="ช่วงข้อมูลตัวอย่าง 2 ชั่วโมง · ทุก 10 นาที";
window.addEventListener("resize",drawChart);
render();
