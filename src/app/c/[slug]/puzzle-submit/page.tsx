import { FC } from 'react'
import CreateChessPuzzlePost from '@/components/chess/CreateChessPuzzlePost'
const page = () => {
    return <div>
        <CreateChessPuzzlePost fen='4k2r/6r1/8/8/8/8/3R4/R3K3' />
    </div>
}

export default page