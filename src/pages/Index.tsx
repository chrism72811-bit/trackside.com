import { useEffect, useState } from "react";
import HomeDashboard from "@/components/HomeDashboard";
import { Flag, Sparkles, Trophy, Send, Menu, LayoutGrid, ScanLine, CarFront, CalendarDays, Check, ExternalLink, ChevronRight } from "lucide-react";
import "../App.css";

type Series = "NASCAR" | "F1";
type Driver = { name: string; clue: string; series: Series };
type ChatMessage = { role: "user" | "assistant"; content: string };
const scheduleUrl = "https://dd12fans.com/schedule";
const drivers: Driver[] = [
  {name:"Dale Earnhardt",clue:"Seven-time Cup champion known as The Intimidator.",series:"NASCAR"},{name:"Jeff Gordon",clue:"Four-time champion who made the No. 24 famous.",series:"NASCAR"},{name:"Jimmie Johnson",clue:"Seven-time champion who won five titles in a row.",series:"NASCAR"},{name:"Richard Petty",clue:"The King: 200 career Cup wins and seven championships.",series:"NASCAR"},{name:"Tony Stewart",clue:"Three-time Cup champion and standout open-wheel racer.",series:"NASCAR"},{name:"Danica Patrick",clue:"A trailblazing driver who won an IndyCar race and raced in NASCAR.",series:"NASCAR"},{name:"Kyle Busch",clue:"A two-time Cup champion nicknamed Rowdy.",series:"NASCAR"},{name:"Bubba Wallace",clue:"A modern Cup driver who races the No. 23 Toyota.",series:"NASCAR"},{name:"Chase Elliott",clue:"The 2020 Cup champion, known to fans as NAPA Chase.",series:"NASCAR"},{name:"Joey Logano",clue:"Three-time Cup champion known as Sliced Bread early in his career.",series:"NASCAR"},{name:"Martin Truex Jr.",clue:"2017 Cup champion and road-course standout.",series:"NASCAR"},{name:"Kevin Harvick",clue:"2014 Cup champion who took over the No. 3 after Dale Earnhardt.",series:"NASCAR"},{name:"Denny Hamlin",clue:"A multiple-time Daytona 500 winner and long-time No. 11 driver.",series:"NASCAR"},{name:"Ryan Blaney",clue:"2023 Cup champion and driver of the No. 12.",series:"NASCAR"},{name:"William Byron",clue:"2024 Cup champion who drives the No. 24 for Hendrick Motorsports.",series:"NASCAR"},{name:"Kyle Larson",clue:"A versatile champion known for success on dirt and pavement.",series:"NASCAR"},{name:"Brad Keselowski",clue:"2012 Cup champion and co-owner of RFK Racing.",series:"NASCAR"},{name:"Rusty Wallace",clue:"1989 Cup champion and one of the sport's memorable voices.",series:"NASCAR"},{name:"Bobby Allison",clue:"Three-time champion and member of the Alabama Gang.",series:"NASCAR"},{name:"Cale Yarborough",clue:"The first driver to win three consecutive Cup championships.",series:"NASCAR"},{name:"Darrell Waltrip",clue:"Three-time champion famous for his colorful commentary.",series:"NASCAR"},{name:"David Pearson",clue:"A three-time champion with one of the best win percentages ever.",series:"NASCAR"},{name:"Bill Elliott",clue:"1988 champion once known as Million Dollar Bill.",series:"NASCAR"},{name:"Mark Martin",clue:"A legendary five-time runner-up in Cup championship standings.",series:"NASCAR"},
  {name:"Ayrton Senna",clue:"Three-time Brazilian world champion celebrated for wet-weather skill.",series:"F1"},{name:"Lewis Hamilton",clue:"Seven-time world champion and record-setting British driver.",series:"F1"},{name:"Michael Schumacher",clue:"German seven-time champion who dominated with Ferrari.",series:"F1"},{name:"Max Verstappen",clue:"Dutch world champion known for aggressive precision.",series:"F1"},{name:"Fernando Alonso",clue:"Two-time Spanish world champion with remarkable longevity.",series:"F1"},{name:"Sebastian Vettel",clue:"German four-time champion who won titles with Red Bull.",series:"F1"},{name:"Charles Leclerc",clue:"Monégasque Ferrari driver who grew up racing in Monaco.",series:"F1"},{name:"Lando Norris",clue:"British McLaren driver known for speed and a playful personality.",series:"F1"},{name:"Jackie Stewart",clue:"Three-time Scottish champion and influential safety advocate.",series:"F1"},{name:"Alain Prost",clue:"Four-time French champion nicknamed The Professor.",series:"F1"},
];
const tabs = [{name:"Overview",view:"Home",icon:LayoutGrid},{name:"Ask Trackside",view:"Trackside AI",icon:Sparkles},{name:"Driver garage",view:"Garage",icon:CarFront},{name:"Photo challenge",view:"Photo challenge",icon:ScanLine},{name:"Race hub",view:"Schedule",icon:CalendarDays}];
const chooseDriver = (series: Series, previous?: string) => { const pool=drivers.filter((item)=>item.series===series&&item.name!==previous); return pool[Math.floor(Math.random()*pool.length)]; };

type QuizProgress = { driverName: string; wrongGuesses: number; availableAt: number };
const quizStorageKey = (series: Series) => `trackside-quiz-${series}`;
const loadQuizProgress = (series: Series): QuizProgress => {
  try {
    const saved = localStorage.getItem(quizStorageKey(series));
    if (saved) {
      const progress = JSON.parse(saved) as QuizProgress;
      if (drivers.some((driver) => driver.name === progress.driverName && driver.series === series) && Number.isInteger(progress.wrongGuesses) && progress.wrongGuesses >= 0 && progress.wrongGuesses <= 3 && Number.isFinite(progress.availableAt)) return progress;
    }
  } catch {}
  return { driverName: chooseDriver(series).name, wrongGuesses: 0, availableAt: 0 };
};
const formatCooldown = (seconds: number) => `${Math.floor(seconds / 3600).toString().padStart(2, "0")}:${Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

const localReply = (text: string, series: Series) => {
  const question = text.toLowerCase().trim();
  if (/^(hi|hey|hello|hiya|yo|sup)\b/.test(question)) return series === "NASCAR" ? "Hey! I'm Trackside NASCAR AI. Want to talk Cup, O'Reilly, Trucks, or a driver?" : "Hey! I'm Trackside F1 AI. Want to talk drivers, teams, Grand Prix, or strategy?";
  if (/\b(idk|i don't know|i dont know|not sure|no idea)\b/.test(question)) return "No problem! Pick one: want to hear about a legendary driver, understand a race rule, or learn how pit strategy works?";
  if (/\b(thanks|thank you|thx)\b/.test(question)) return "You're welcome! Keep the questions coming — racing always has another story.";
  const mentioned = drivers.find((driver) => driver.series === series && question.includes(driver.name.toLowerCase()));
  if (mentioned) return `${mentioned.name}: ${mentioned.clue} Want to know about their career, biggest wins, or rivals?`;
  if (/\b(pit|stop|tire|tyre)\b/.test(question)) return series === "NASCAR" ? "NASCAR pit stops usually involve changing four tires and adding fuel. Timing a stop around a caution can matter as much as the crew's speed." : "In Formula 1, crews change all four tires in seconds. Teams consider tire wear, traffic, and safety-car timing.";
  if (/\b(flag|yellow|caution|red flag|safety car)\b/.test(question)) return series === "NASCAR" ? "A yellow flag means a caution: the field slows and bunches up. A red flag stops the race for safety or weather." : "In F1, yellow flags warn of danger and require drivers to slow down; a red flag suspends the session. A safety car controls the field while the track is cleared.";
  if (/\b(point|champion|championship|standings|winner|result)\b/.test(question)) return "For current results, check Overview — Trackside gets results from official series pages when available.";
  if (/\b(rule|stage|playoff|drs|overtake|ers)\b/.test(question)) return series === "NASCAR" ? "NASCAR uses stage breaks and a playoff format. Rules can change by season; name a specific rule and I'll explain it." : "F1 awards points across Grand Prix weekends. DRS can help with overtaking in designated zones when race conditions allow.";
  if (/\b(who|driver|favorite|best|legend)\b/.test(question)) return series === "NASCAR" ? "NASCAR legends include Richard Petty, Dale Earnhardt, and Jeff Gordon. Ask me about a driver by name for a quick bio." : "F1 legends include Ayrton Senna, Alain Prost, and Michael Schumacher. Ask me about a driver by name for a quick bio.";
  return `I can help with ${series} drivers, rules, tracks, race craft, and history. What part are you curious about?`;
};

const Index = () => {
  const [active,setActive]=useState("Overview");
  const [menuOpen,setMenuOpen]=useState(false);
  const [series,setSeries]=useState<Series>("NASCAR");
  const [quizProgress,setQuizProgress]=useState<Record<Series,QuizProgress>>(()=>({NASCAR:loadQuizProgress("NASCAR"),F1:loadQuizProgress("F1")}));
  const [now,setNow]=useState(Date.now());
  const challenge=quizProgress[series];
  const driver=drivers.find((item)=>item.name===challenge.driverName)!;
  const attemptsLeft=3-challenge.wrongGuesses;
  const cooldownSeconds=Math.max(0,Math.ceil((challenge.availableAt-now)/1000));
  const [photo,setPhoto]=useState("");
  const [guess,setGuess]=useState("");
  const [result,setResult]=useState("");
  const [garage,setGarage]=useState<string[]>(()=>JSON.parse(localStorage.getItem("trackside-garage")||"[]"));
  const [conversations,setConversations]=useState<Record<Series,ChatMessage[]>>({NASCAR:[],F1:[]});
  const [chatDrafts,setChatDrafts]=useState<Record<Series,string>>({NASCAR:"",F1:""});
  const messages=conversations[series];
  const chat=chatDrafts[series];
  const setChat=(value:string)=>setChatDrafts((current)=>({...current,[series]:value}));


  useEffect(()=>{
    const timer=window.setInterval(()=>setNow(Date.now()),1000);
    return ()=>window.clearInterval(timer);
  },[]);

  useEffect(()=>{
    if(!challenge.availableAt||now<challenge.availableAt)return;
    const next={driverName:chooseDriver(series,challenge.driverName).name,wrongGuesses:0,availableAt:0};
    setQuizProgress((current)=>({...current,[series]:next}));
    localStorage.setItem(quizStorageKey(series),JSON.stringify(next));
    setGuess("");
    setResult("Your next driver challenge is ready!");
  },[series,challenge.availableAt,challenge.driverName,now]);

  useEffect(()=>{
    let cancelled=false;
    setPhoto("");
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(driver.name)}`)
      .then((response)=>response.ok?response.json():Promise.reject())
      .then((data:{thumbnail?:{source?:string}})=>{if(!cancelled)setPhoto(data.thumbnail?.source||"");})
      .catch(()=>{if(!cancelled)setPhoto("");});
    return ()=>{cancelled=true;};
  },[driver]);

  const changeSeries=(next:Series)=>{setSeries(next);setResult("");setGuess("");};
  const saveQuizProgress=(progress:QuizProgress)=>{
    setQuizProgress((current)=>({...current,[series]:progress}));
    localStorage.setItem(quizStorageKey(series),JSON.stringify(progress));
  };
  const submitGuess=(event:React.FormEvent)=>{
    event.preventDefault();
    if(!guess.trim()||challenge.availableAt>now)return;
    if(guess.trim().toLowerCase()===driver.name.toLowerCase()){
      const updated=[...new Set([...garage,driver.name])];
      setGarage(updated);localStorage.setItem("trackside-garage",JSON.stringify(updated));
      saveQuizProgress({...challenge,availableAt:Date.now()+60*60*1000});
      setResult(`Correct! ${driver.name} is in your garage. Your next challenge unlocks in one hour.`);
    }else{
      const wrongGuesses=challenge.wrongGuesses+1;
      if(wrongGuesses>=3){
        saveQuizProgress({...challenge,wrongGuesses,availableAt:Date.now()+60*60*1000});
        setResult(`That was your third try. The answer was ${driver.name}. A new challenge unlocks in one hour.`);
      }else{
        saveQuizProgress({...challenge,wrongGuesses});
        setResult(`Not quite — ${3-wrongGuesses} ${3-wrongGuesses===1?"try":"tries"} left. Type the driver's full name.`);
      }
    }
    setGuess("");
  };
  const sendMessage=(event:React.FormEvent)=>{
    event.preventDefault();
    const content=chat.trim();
    if(!content)return;
    setConversations((current)=>({...current,[series]:[...current[series],{role:"user",content},{role:"assistant",content:localReply(content,series)}]}));
    setChat("");
  };
  const navigate=(tab:string)=>{setActive(tab);setMenuOpen(false);};
  const garageForSeries=garage.filter((name)=>drivers.some((driver)=>driver.name===name&&driver.series===series));

  return <div className="apex-app">
    <aside className={`sidebar ${menuOpen?"menu-open":""}`}>
      <a className="brand" href="#home" onClick={(event)=>{event.preventDefault();navigate("Home");}}><span className="brand-mark"><Flag size={23}/></span><span>TRACK<span className="brand-light">SIDE</span><small>THE RACING CLUBHOUSE</small></span></a>
      <div className="side-label">YOUR PADDOCK</div>
      {tabs.map(({name,view,icon:Icon})=><button key={name} className={`nav-item ${active===view?"selected":""}`} onClick={()=>navigate(view)}><Icon size={19}/>{name}{name==="Driver garage"&&<span className="nav-count">{garage.length}</span>}</button>)}
      <div className="sidebar-bottom"><div className="member-card"><div className="member-icon"><Sparkles size={19}/></div><b>Your racing co-pilot.</b><span>Every driver. Every story.</span></div><div className="profile"><div className="profile-avatar">R</div><div><b>Racing fan</b><span>{garage.length} drivers collected</span></div></div></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><button className="mobile-menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen((open)=>!open)}><Menu/></button><div className="top-intro">Your all-access pass to motorsport</div><div className="series-toggle" role="tablist" aria-label="Choose racing series"><button role="tab" aria-selected={series==="NASCAR"} className={series==="NASCAR"?"active":""} onClick={()=>changeSeries("NASCAR")}>▰ &nbsp; NASCAR</button><button role="tab" aria-selected={series==="F1"} className={series==="F1"?"active":""} onClick={()=>changeSeries("F1")}>F1 &nbsp; FORMULA 1</button></div></header>
      {active==="Home"&&<HomeDashboard series={series} driver={driver} photo={photo} guess={guess} answer={result} collectedCount={garageForSeries.length} attemptsLeft={attemptsLeft} cooldownSeconds={cooldownSeconds} messages={messages} chat={chat} onGuessChange={setGuess} onSubmitGuess={submitGuess} onChatChange={setChat} onSendMessage={sendMessage}/> }
      {active==="Photo challenge"&&<div className="page-content tab-page"><div className="welcome-row"><div><div className="eyebrow"><span/> {series} PADDOCK</div><h1>Photo challenge</h1><p>Recognize the driver. Type their name to collect them.</p></div></div><section className="quiz-card standalone-card"><div className="quiz-top"><div><div className="eyebrow"><Sparkles size={14}/> DRIVER CHALLENGE · {series}</div><h2>Who is this <em>driver?</em></h2></div><span className="attempt-count">{cooldownSeconds > 0 ? `NEXT IN ${formatCooldown(cooldownSeconds)}` : `${attemptsLeft} TRIES LEFT`}</span></div><div className={`driver-photo ${photo?"has-photo":""}`} style={photo?{backgroundImage:`linear-gradient(0deg,rgba(18,20,23,.82),transparent 65%),url("${photo}")`}:undefined}>{photo?<span className="photo-credit">REAL DRIVER PHOTO · WIKIPEDIA</span>:<div className="photo-loading"><Flag size={35}/><span>Loading a real {series} driver photo…</span><small>If images are blocked, try the next driver.</small></div>}<div className="photo-clue"><span>HINT</span><p>{driver.clue}</p></div></div><form className="guess-form" onSubmit={submitGuess}><input value={guess} onChange={(event)=>setGuess(event.target.value)} placeholder={cooldownSeconds>0?"Challenge locked for one hour":"Type the driver's full name..."} aria-label="Type the driver's full name" disabled={cooldownSeconds>0}/><button type="submit" disabled={cooldownSeconds>0||!guess.trim()}>SUBMIT GUESS <ChevronRight size={16}/></button></form>{result&&<div className={`answer-note ${result.startsWith("Correct")?"correct":""}`}>{result.startsWith("Correct")&&<Check size={15}/>} {result}</div>}<div className="quiz-foot"><span>Correct guesses are added to your Garage</span><span>{garageForSeries.length} COLLECTED</span></div></section></div>}
      {active==="Garage"&&<div className="page-content tab-page"><div className="welcome-row"><div><div className="eyebrow"><span/> YOUR {series} COLLECTION</div><h1>{series} garage</h1><p>Your correctly guessed {series} drivers, saved on this device.</p></div></div>{garageForSeries.length?<div className="collection-grid">{garageForSeries.map((name)=><article className="collection-card" key={name}><div className="driver-initial">{name.split(" ").map((part)=>part[0]).join("")}</div><div><b>{name}</b><span>{drivers.find((item)=>item.name===name)?.series||"MOTORSPORT"} · COLLECTED</span></div><Trophy size={18}/></article>)}</div>:<div className="empty-state"><CarFront size={36}/><h2>Your {series} garage is waiting</h2><p>Guess a {series} driver in Photo Challenge to collect them here.</p><button className="watch-button" onClick={()=>navigate("Photo challenge")}>GO TO PHOTO CHALLENGE</button></div>}</div>}
      {active==="Schedule"&&<div className="page-content tab-page"><div className="welcome-row"><div><div className="eyebrow"><span/> RACE CALENDAR</div><h1>Race schedule</h1><p>Schedule provided by DD12 Fans.</p></div><a className="watch-button schedule-link" href={scheduleUrl} target="_blank" rel="noreferrer">OPEN SCHEDULE <ExternalLink size={15}/></a></div><section className="schedule-frame-wrap"><iframe className="schedule-frame" src={scheduleUrl} title="DD12 Fans race schedule" loading="lazy"/><div className="frame-fallback">If the schedule doesn't load inside the app, <a href={scheduleUrl} target="_blank" rel="noreferrer">open it in a new tab <ExternalLink size={13}/></a>.</div></section></div>}
      {active==="Trackside AI"&&<div className="page-content tab-page chat-page"><div className="welcome-row"><div><div className="eyebrow"><span/> YOUR RACING INTELLIGENCE</div><h1>Chat with <em>Trackside {series === "NASCAR" ? "NASCAR" : "F1"} AI.</em></h1><p>Your {series === "NASCAR" ? "NASCAR" : "Formula 1"}-focused racing co-pilot.</p></div></div><section className="ai-card full-chat"><div className="ai-heading"><div className="ai-icon"><Sparkles size={18}/></div><div><div className="eyebrow">{series === "NASCAR" ? "NASCAR RACING ASSISTANT" : "FORMULA 1 RACING ASSISTANT"}</div><h3>Trackside {series === "NASCAR" ? "NASCAR" : "F1"} AI</h3></div><span className="online-status">READY TO CHAT</span></div><div className="full-chat-thread">{messages.length===0&&<div className="starter-message">Hi! I'm Trackside {series === "NASCAR" ? "NASCAR" : "F1"} AI. Ask me about {series === "NASCAR" ? "stock-car racing" : "Formula 1"} and I'll help you figure it out.</div>}{messages.map((message,index)=><div className={`chat-line ${message.role}`} key={`${index}-${message.role}`}><span>{message.role==="user"?"YOU":"TRACKSIDE"}</span><p>{message.content}</p></div>)}</div><form className="chat-form full-chat-form" onSubmit={sendMessage}><input value={chat} onChange={(event)=>setChat(event.target.value)} placeholder={`Message Trackside ${series === "NASCAR" ? "NASCAR" : "F1"} AI...`}/><button aria-label="Send message" disabled={!chat.trim()}><Send size={17}/></button></form><div className="ai-disclaimer">Trackside uses built-in racing knowledge and works without an API key.</div></section></div>}
    </main>
  </div>;
};
export default Index;
