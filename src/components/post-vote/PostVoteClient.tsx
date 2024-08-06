"use client"

import { useState, useEffect } from 'react'
import { useCustomToast } from '@/hooks/use-custom-toast'
import { VoteType } from '@prisma/client'
import { FC } from 'react'
import { usePrevious } from '@mantine/hooks'
import { Button } from '../ui/Button'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { PostVoteRequest } from '@/lib/validators/vote'
import axios, { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'

interface PostVoteClientProps {
    postId: string,
    initialVotesAmt: number,
    initialVote?: VoteType | null

}

const PostVoteClient: FC<PostVoteClientProps> = ({
    postId,
    initialVotesAmt,
    initialVote,
}) => {
    const { loginToast } = useCustomToast()
    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
    const [currentVote, setCurrentVote] = useState(initialVote)
    const previousVote = usePrevious(currentVote)

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])

    const { mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: PostVoteRequest = {
                postId,
                voteType
            }

            await axios.patch('/api/community/post/vote', payload)
        },
        onError: (err, voteType) => {
            if (voteType === 'UP') {
                setVotesAmt((prev) => prev - 1)
            }
            else setVotesAmt((prev) => prev + 1)

            setCurrentVote(previousVote)

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Something went wrong',
                description: ' Your vote was not submitted, please try again',
                variant: 'warning'
            })
        },
        // Optimistic updates , before request is resolved do this
        onMutate: (type: VoteType) => {
            // if the user is pressing on the same vote button , remove it
            if (currentVote === type) {
                setCurrentVote(undefined)
                if (type === 'UP') setVotesAmt((prev) => prev - 1)
                else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
            }
            else {
                setCurrentVote(type)
                if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
                else if (type === 'DOWN') setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
            }

        }


    })


    return <div className='flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0 '>
        <Button size='sm' variant='ghost' aria-label='upvote' onClick={() => vote('UP')}>
            <ArrowBigUp className={cn('h-5 w-5 text-zinc-700', { 'text-emerald-500 fill-emerald-500': currentVote === 'UP', })} />
        </Button>

        <p className='text-center grow-0 py-2 font-medium text-sm text-zinc-900'>{votesAmt ?? 10}</p>
        <Button size='sm' variant='ghost' aria-label='downvote' onClick={() => vote('DOWN')}>
            <ArrowBigDown className={cn('h-5 w-5 text-zinc-700', { 'text-red-500 fill-red-500': currentVote === 'DOWN', })} />
        </Button>
    </div>
}

export default PostVoteClient