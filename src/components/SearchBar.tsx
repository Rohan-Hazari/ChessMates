'use client'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { Community, Prisma } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from 'cmdk'
import debounce from 'lodash.debounce'
import { Users } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Command } from './ui/Command'
import { Input } from './ui/Input'

interface SearchBarProps {

}

const SearchBar: FC<SearchBarProps> = ({ }) => {
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()
    const commandRef = useRef<HTMLDivElement>(null)


    const { data: queryResults = [], refetch, isFetched, isFetching } = useQuery({
        queryFn: async () => {
            if (!input) return []
            const { data } = await axios.get(`/api/search?q=${input}`)
            return data as (Community & {
                _count: Prisma.CommunityCountOutputType
            })[]
        },
        queryKey: ['search-query'],
        enabled: false,
    })

    useOnClickOutside(commandRef, () => {
        setInput('')
    })


    const request = debounce(() => {
        refetch()
    }, 500)

    const debounceRequest = useCallback(() => {
        request()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setInput('')
    }, [pathname])


    return (
        <Command
            ref={commandRef}
            className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
            <Input
                onChange={(e) => {
                    setInput(e.target.value)
                    debounceRequest()
                }}
                value={input}
                className='p-2 rounded-sm '
                placeholder='Search communities...'
            />

            {input.length > 0 ? (
                <CommandList className='absolute bg-white top-full inset-x-0 shadow rounded-b-md'>
                    {isFetched && queryResults.length === 0 && <CommandEmpty className='m-4 text-center' >No results found.</CommandEmpty>}
                    {queryResults && queryResults.length > 0 ? (
                        <CommandGroup className='my-2 mx-4 flex-col gap-2 ' heading='Communities'>
                            {queryResults?.map((community) => (
                                <CommandItem
                                    className='flex items-center pt-2 rounded-sm pl-2 bg-slate-200'
                                    onSelect={(e) => {
                                        router.push(`/c/${e}`)
                                        router.refresh()
                                    }}
                                    key={community.id}
                                    value={community.name}>
                                    <Users className='mr-2 h-4 w-4' />
                                    <a href={`/c/${community.name}`}>{community.name}</a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            ) : null}
        </Command>
    )
}

export default SearchBar