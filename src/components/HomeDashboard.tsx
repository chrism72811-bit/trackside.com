import { Check, ChevronRight, Flag, Send, Sparkles } from "lucide-react";

type Series = "NASCAR" | "F1";
type Driver = { name: string; clue: string; series: Series };
type Message = { role: "user" | "assistant"; content: string };

type Props = {
  series: Series;
  driver: Driver;
  photo: string;
  guess: string;
  answer: string;
  collectedCount: number;
  attemptsLeft: number;
  cooldownSeconds: number;
  messages: Message[];
  chat: string;
  onGuessChange: (value: string) => void;
  onSubmitGuess: (event: React.FormEvent) => void;
  onChatChange: (value: string) => void;
  onSendMessage: (event: React.FormEvent) => void;
};

const countdown = (seconds: number) => `${Math.floor(seconds / 3600).toString().padStart(2, "0")}:${Math.floor((seconds % 3600) / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

const HomeDashboard = ({ series, driver, photo, guess, answer, collectedCount, attemptsLeft, cooldownSeconds, messages, chat, onGuessChange, onSubmitGuess, onChatChange, onSendMessage }: Props) => (
  <div className="page-content tab-page home-page">
    <div className="welcome-row">
      <div>
        <div className="eyebrow"><span/> {series === "NASCAR" ? "NASCAR PADDOCK" : "FORMULA 1 PADDOCK"}</div>
        <h1>Welcome to the fast lane.</h1>
        <p>Guess a driver or chat with your {series === "NASCAR" ? "NASCAR" : "Formula 1"} racing co-pilot.</p>
      </div>
    </div>
    <div className="home-feature-grid">
      <section className="quiz-card home-quiz">
        <div className="quiz-top">
          <div><div className="eyebrow"><Sparkles size={14}/> PHOTO CHALLENGE · {series}</div><h2>Who is this <em>driver?</em></h2></div>
          <span className="attempt-count">{cooldownSeconds > 0 ? `NEXT IN ${countdown(cooldownSeconds)}` : `${attemptsLeft} TRIES LEFT`}</span>
        </div>
        <div className={photo ? "driver-photo has-photo" : "driver-photo"} style={photo ? { backgroundImage: `linear-gradient(0deg,rgba(18,20,23,.82),transparent 65%),url("${photo}")` } : undefined}>
          {photo ? <span className="photo-credit">REAL DRIVER PHOTO</span> : <div className="photo-loading"><Flag size={35}/><span>Loading a real {series} driver photo…</span></div>}
          <div className="photo-clue"><span>HINT</span><p>{driver.clue}</p></div>
        </div>
        <form className="guess-form" onSubmit={onSubmitGuess}>
          <input value={guess} onChange={(event) => onGuessChange(event.target.value)} placeholder={cooldownSeconds > 0 ? "Challenge locked for one hour" : "Type the driver's full name..."} aria-label="Type the driver's full name" disabled={cooldownSeconds > 0}/>
          <button type="submit" disabled={cooldownSeconds > 0 || !guess.trim()}>SUBMIT GUESS <ChevronRight size={16}/></button>
        </form>
        {answer && <div className={`answer-note ${answer.startsWith("Correct") ? "correct" : ""}`}>{answer.startsWith("Correct") && <Check size={15}/>} {answer}</div>}
        <div className="quiz-foot"><span>Correct guesses go in your {series} garage</span><span>{collectedCount} COLLECTED</span></div>
      </section>
      <section className="ai-card home-ai">
        <div className="ai-heading">
          <div className="ai-icon"><Sparkles size={18}/></div>
          <div><div className="eyebrow">{series === "NASCAR" ? "NASCAR RACING ASSISTANT" : "FORMULA 1 RACING ASSISTANT"}</div><h3>Trackside {series === "NASCAR" ? "NASCAR" : "F1"} AI</h3></div>
          <span className="online-status">READY</span>
        </div>
        <p>Your {series === "NASCAR" ? "NASCAR" : "Formula 1"} co-pilot. Say hi or ask a racing question.</p>
        <div className="full-chat-thread">
          {messages.length === 0 ? <div className="starter-message">Hi! I'm Trackside {series === "NASCAR" ? "NASCAR" : "F1"} AI. Ask me about {series === "NASCAR" ? "stock-car racing" : "Formula 1"}.</div> : messages.slice(-6).map((message, index) => <div className={message.role === "user" ? "chat-line user" : "chat-line assistant"} key={`${index}-${message.role}`}><span>{message.role === "user" ? "YOU" : "TRACKSIDE"}</span><p>{message.content}</p></div>)}
        </div>
        <form className="chat-form full-chat-form" onSubmit={onSendMessage}>
          <input value={chat} onChange={(event) => onChatChange(event.target.value)} placeholder={`Ask Trackside ${series === "NASCAR" ? "NASCAR" : "F1"} AI...`}/>
          <button aria-label="Send message" disabled={!chat.trim()}><Send size={17}/></button>
        </form>
        <div className="ai-disclaimer">Built-in racing chat works without an API key.</div>
      </section>
    </div>
  </div>
);

export default HomeDashboard;
