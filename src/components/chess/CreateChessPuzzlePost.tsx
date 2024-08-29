"use client"

import React, { useEffect, useState } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/TextArea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { convertBoardToFEN, convertFENToBoard } from '@/lib/utils'
import { Piece, Board, Position, PieceItem } from '@/types/board'
import axios from 'axios'

const pieceComponents = {
    'K': () => <span className="text-4xl">♔</span>,
    'Q': () => <span className="text-4xl">♕</span>,
    'R': () => <span className="text-4xl">♖</span>,
    'B': () => <span className="text-4xl">♗</span>,
    'N': () => <span className="text-4xl">♘</span>,
    'P': () => <span className="text-4xl">♙</span>,
    'k': () => <span className="text-4xl text-primary">♚</span>,
    'q': () => <span className="text-4xl text-primary">♛</span>,
    'r': () => <span className="text-4xl text-primary">♜</span>,
    'b': () => <span className="text-4xl text-primary">♝</span>,
    'n': () => <span className="text-4xl text-primary">♞</span>,
    'p': () => <span className="text-4xl text-primary">♟</span>,
}



const CreateChessPuzzlePost = ({ fen }: { fen: string }) => {
    const [title, setTitle] = useState('')
    const [preText, setPreText] = useState('')
    const [postText, setPostText] = useState('')
    const givenBoard = convertFENToBoard(fen)
    const [board, setBoard] = useState<Board>(givenBoard ?? [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ])

    const handleDrop = (item: PieceItem, newPosition: Position) => {


        setBoard(prevBoard => {
            const newBoard = prevBoard.map(row => [...row])
            console.log(item);

            // Remove the piece from its original position if it was on the board

            let pieceToMove = item.piece;

            // If the piece is coming from the board, use the current board state
            if (item.position) {
                const [oldRow, oldCol] = item.position;
                pieceToMove = prevBoard[oldRow][oldCol];
                newBoard[oldRow][oldCol] = '';
            }

            // Place the piece in the new position if it's on the board
            if (newPosition) {
                const [newRow, newCol] = newPosition;
                newBoard[newRow][newCol] = pieceToMove;
            }

            return newBoard
        })
    }

    const handleRemovePiece = (item: PieceItem) => {
        if (item.position) {
            setBoard(prevBoard => {
                const newBoard = prevBoard.map(row => [...row])
                const [row, col] = item.position as [number, number]
                newBoard[row][col] = ''
                return newBoard
            })
        }
    }

    const handlePost = async () => {
        console.log('Posting:', { title, preText, board, postText })
        const fen = convertBoardToFEN(board);
        console.log('fen', fen);
        const payload = {}

        const res = await axios.post('/api/chess/puzzle', payload)

        // Here you would typically send this data to your backend
    }
    // useEffect(() => {
    //     console.log("board", board);
    // }, [board])

    return (
        <DndProvider backend={HTML5Backend}>
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Chess Post</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="mt-2">
                        <label className="font-bold" htmlFor='title'>Title</label>
                        <Input
                            placeholder="Example: Find checkmate in 3 moves"
                            value={title}
                            id='title'

                            onChange={(e) => setTitle(e.target.value)}
                        />

                    </div>
                    <div className="mt-2">
                        <Textarea
                            label="Description"
                            htmlFor='Description'
                            placeholder="Give context to puzzle example white to move or provide hints "
                            value={preText}
                            onChange={(e) => setPreText(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row items-start justify-center">
                        <div>
                            <Chessboard board={board} onDrop={handleDrop} />
                            <DropZone onDrop={handleRemovePiece} />
                        </div>
                        <SidePanel />
                    </div>
                    <Textarea
                        required
                        label="Enter Solution"
                        htmlFor='Solution'
                        placeholder="Example: 1.e4 e5 2.Nf3 Nc6 3.Bb5 Qxh7"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePost}>Post</Button>
                </CardFooter>
            </Card>
        </DndProvider>
    )
}



const ChessPiece = ({ piece, position }: { piece: Piece; position: Position }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'piece',
        item: { piece, position } as PieceItem,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    const PieceComponent = pieceComponents[piece as keyof typeof pieceComponents]

    return (
        <div
            ref={drag}
            className="w-full h-full flex items-center justify-center hover:cursor-grab cursor-grabbing"
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <PieceComponent />
        </div>
    )
}

const Square = ({ position, piece, onDrop }: { position: Position; piece: Piece; onDrop: (item: PieceItem, position: Position) => void }) => {
    const [, drop] = useDrop(() => ({
        accept: 'piece',
        drop: (item: PieceItem) => onDrop(item, position),
    }))

    const isBlack = position && (position[0] + position[1]) % 2 === 1

    return (
        <div
            ref={drop}
            className={`w-16 h-16 ${isBlack ? 'bg-[#b58863]' : 'bg-[#f0d9b5]'} flex items-center justify-center`}
        >
            {piece && <ChessPiece piece={piece} position={position} />}
        </div>
    )
}

const Chessboard = ({ board, onDrop }: { board: Board; onDrop: (item: PieceItem, position: Position) => void }) => {
    return (
        <div className="inline-grid grid-cols-8 border-2 border-gray-800">
            {board.map((row, i) =>
                row.map((piece, j) => (
                    <Square
                        key={`${i}-${j}`}
                        position={[i, j]}
                        piece={piece}
                        onDrop={onDrop}
                    />
                ))
            )}
        </div>
    )
}

const SidePanel = () => {
    const pieces: Piece[] = ['K', 'Q', 'R', 'B', 'N', 'P', 'k', 'q', 'r', 'b', 'n', 'p']

    return (
        <div className="grid grid-cols-2 gap-2 ml-4">
            {pieces.map((piece, index) => (
                <div key={index} className="w-12 h-12 bg-secondary rounded-md flex items-center justify-center">
                    <ChessPiece piece={piece} position={null} />
                </div>
            ))}
        </div>
    )
}

const DropZone = ({ onDrop }: { onDrop: (item: PieceItem, position: Position) => void }) => {
    const [, drop] = useDrop(() => ({
        accept: 'piece',
        drop: (item: PieceItem) => onDrop(item, null),
    }))

    return (
        <div ref={drop} className="w-full h-16 bg-secondary mt-4 flex items-center justify-center text-muted-foreground">
            Drop pieces here to remove
        </div>
    )
}

export default CreateChessPuzzlePost