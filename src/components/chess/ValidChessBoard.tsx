import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import { Board, Piece, PieceItem, Position } from '@/types/board'
import { convertFENToBoard } from '@/lib/utils'

type Player = 'white' | 'black'

const initialBoard: Piece[][] = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
]


export default function ValidChessBoard({ fen }: { fen: string | null }) {
    const boardFEN = fen ?? ''
    const givenBoard = convertFENToBoard(boardFEN)
    const [board, setBoard] = useState<Piece[][]>(givenBoard ?? initialBoard)
    const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null)
    const [currentPlayer, setCurrentPlayer] = useState<Player>('white')

    const audioContext = useRef<AudioContext | null>(null)

    useEffect(() => {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        return () => {
            if (audioContext.current) {
                audioContext.current.close()
            }
        }
    }, [])

    const playSound = useCallback((frequency: number, duration: number) => {
        if (audioContext.current) {
            const oscillator = audioContext.current.createOscillator()
            const gainNode = audioContext.current.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.current.destination)

            oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime)
            gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime)

            oscillator.start()
            oscillator.stop(audioContext.current.currentTime + duration)
        }
    }, [])

    const playMoveSound = useCallback(() => playSound(330, 0.1), [playSound])
    const playCaptureSound = useCallback(() => playSound(440, 0.15), [playSound])


    const isValidMove = (start: [number, number], end: [number, number]): boolean => {
        const [startRow, startCol] = start
        const [endRow, endCol] = end
        const piece = board[startRow][startCol]
        const endPiece = board[endRow][endCol]

        if (!piece) return false

        const isWhitePiece = piece === piece.toUpperCase()
        const isWhiteMove = currentPlayer === 'white'

        if (isWhitePiece !== isWhiteMove) return false
        if (endPiece && (endPiece === endPiece.toUpperCase()) === isWhitePiece) return false

        const rowDiff = endRow - startRow
        const colDiff = endCol - startCol

        switch (piece.toLowerCase()) {
            case 'p':
                const direction = isWhitePiece ? -1 : 1
                const startRow = isWhitePiece ? 6 : 1
                if (colDiff === 0 && !endPiece) {
                    if (rowDiff === direction) return true
                    if (rowDiff === 2 * direction && start[0] === startRow && !board[startRow + direction][startCol]) return true
                }
                if (Math.abs(colDiff) === 1 && rowDiff === direction && endPiece) return true
                return false
            case 'r':
                return (rowDiff === 0 || colDiff === 0) && !hasObstacles(start, end)
            case 'n':
                return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)
            case 'b':
                return Math.abs(rowDiff) === Math.abs(colDiff) && !hasObstacles(start, end)
            case 'q':
                return ((rowDiff === 0 || colDiff === 0) || (Math.abs(rowDiff) === Math.abs(colDiff))) && !hasObstacles(start, end)
            case 'k':
                return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1
            default:
                return false
        }
    }

    const hasObstacles = (start: [number, number], end: [number, number]): boolean => {
        const [startRow, startCol] = start
        const [endRow, endCol] = end
        const rowStep = Math.sign(endRow - startRow)
        const colStep = Math.sign(endCol - startCol)

        let currentRow = startRow + rowStep
        let currentCol = startCol + colStep

        while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== null) {
                return true
            }
            currentRow += rowStep
            currentCol += colStep
        }

        return false
    }

    const handleClick = (row: number, col: number) => {

        if (selectedPiece) {
            const [selectedRow, selectedCol] = selectedPiece
            console.log('selected piece');

            if (isValidMove(selectedPiece, [row, col])) {
                const newBoard = board.map(row => [...row])
                const capturedPiece = newBoard[row][col]
                newBoard[row][col] = newBoard[selectedRow][selectedCol]
                newBoard[selectedRow][selectedCol] = ''
                setBoard(newBoard)
                setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white')

                if (capturedPiece) {
                    playCaptureSound()
                } else {
                    playMoveSound()
                }
            }
            setSelectedPiece(null)
        } else {
            const piece = board[row][col]
            if (piece && ((piece === piece.toUpperCase() && currentPlayer === 'white') ||
                (piece === piece.toLowerCase() && currentPlayer === 'black'))) {
                setSelectedPiece([row, col])
            }
        }
    }

    const getPieceSymbol = (piece: Piece): string => {
        const symbols: { [key in Piece]: string } = {
            'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
            'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔',
            '': ''
        }
        return symbols[piece] || ''
    }
    const resetGame = () => {
        setBoard(givenBoard)
        setSelectedPiece(null)
        setCurrentPlayer('white')

    }

    return (
        <div className="flex flex-col items-start min-h-screen bg-[#f0d9b5]">
            <div className="grid grid-cols-8 gap-0 border-8 border-[#8b4513] rounded-lg shadow-lg">
                {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                        <Button
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-12 h-12 flex items-center justify-center text-3xl ${(rowIndex + colIndex) % 2 === 0 ? 'bg-[#f0d9b5]' : 'bg-[#d18b47]'}
                                    ${selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex ? 'ring-2 ring-[#ffff00]' : ''}
                                    ${piece && piece.toLowerCase() === piece ? 'text-black' : 'text-white'} hover:opacity-80 transition-opacity duration-200`}
                            variant="ghost"
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                            {getPieceSymbol(piece)}
                        </Button>
                    ))
                )}
            </div>
            <Button onClick={resetGame} className="mt-6 bg-[#8b4513] text-white hover:bg-[#a0522d]">
                Reset Game
            </Button>
        </div>
    )
}