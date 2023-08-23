'use client'

import { useState } from "react"
import { PlayingCard } from "../components/playingCard"
import { Card } from "../lib/cards"
import { ChimeConfig, createAttendee } from "../lib/chime"
import { ChimeProvider } from "../lib/chimeUtils"
import { getGame, gameState, nextCards, resetCards } from "../lib/game"
import { Player } from "../lib/player"

export function Game() {
  const [gameId, setGameId] = useState<string>()
  const [chimeConfig, setChimeConfig] = useState<ChimeConfig>()
  const [meetingSession, setMeetingSession] = useState<ChimeProvider>()
  const [communityCards, setCommunityCards] = useState<Card[]>([])

  async function joinGame(){
    const input = document.getElementById('game-id-input') as HTMLInputElement
    setGameId(input?.value)

    const game = await getGame(input?.value)
    if (!game){
      return
    }
    game.players = game.players.concat(new Player('test'))
    renderGame(game)
  }

  async function renderGame(game: gameState){
    console.log('game', game)
    const attendee = await createAttendee(game.chimeConfig)

    if(!attendee){
      alert('Unable to create attendee')
      return
    }

    const meeting = new ChimeProvider(game.chimeConfig, attendee)

    if(meeting) {
      setGameId(game.id)
      setChimeConfig(game.chimeConfig)
      setMeetingSession(meeting)
    } else {
      alert('Unable to create call session')
    }
  }

  async function nextAction() {
    if(!gameId){return}
    
    const cards = await nextCards(gameId)
    console.log(cards)

    if(cards){
      setCommunityCards(cards)
    }
  }

  async function nextRound() {
    if(!gameId){return}
    
    await resetCards(gameId)

    setCommunityCards([])
  }

  return (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
  <audio id="chime-audio" />
  <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
    <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
      Chime Poker
    </p>
    <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
      <a
        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        By{' '}
        Adam Snow
      </a>
    </div>
  </div>


    <>
      <div>You are in game: {gameId}</div><div>
      <form action={nextAction}><button>Next</button></form>
      <form action={nextRound}><button>Redeal</button></form></div>
      <div className="community-cards">
        {communityCards.map((item, i) =>
            <PlayingCard key={i}value={item.value} suit={item.suit}></PlayingCard>
        )}
      </div>
    </>
  <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:text-left font-mono">
    A multi-player, single-page poker game with video chat. Next,js, React, AWS Chime
  </div>
</main>
  )

}