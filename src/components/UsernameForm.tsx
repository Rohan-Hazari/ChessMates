'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/Button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { UsernameValidator } from '@/lib/validators/username'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, 'id' | 'name'>
}

type FormData = z.infer<typeof UsernameValidator>

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
    const router = useRouter()
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(UsernameValidator),
        defaultValues: {
            name: user?.name || '',
        },
    })

    const { mutate: updateUsername, isLoading } = useMutation({
        mutationFn: async ({ name }: FormData) => {
            const payload: FormData = { name }

            const { data } = await axios.patch(`/api/username`, payload)
            return data
        },
        onError: (err) => {

            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'Username already taken.',
                        description: 'Please choose another username.',
                        variant: 'destructive',
                    })
                }
                if (err.response?.status === 400) {
                    return toast({
                        title: 'Input was invalid.',
                        description: 'Check your input and try again.',
                        variant: 'destructive',
                    })
                }
            }
            reset({ name: user?.name || '' })
            return toast({
                title: 'Something went wrong.',
                description: 'Your username was not updated. Please try again.',
                variant: 'destructive',
            })

        },
        onSuccess: () => {
            toast({
                description: 'Your username has been updated.',
                variant: 'success'
            })
            router.refresh()
        },
    })

    return (
        <form
            className={cn(className)}
            onSubmit={handleSubmit((e) => updateUsername(e))}
            {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Your username</CardTitle>
                    <CardDescription>
                        Please enter a display name you are comfortable with.
                    </CardDescription>
                    <p className='px-1 text-xs text-orange-600'>Make sure there are no spaces</p>
                </CardHeader>
                <CardContent>
                    <div className='relative grid gap-1'>
                        <div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
                            <span className='text-sm text-zinc-400'>u/</span>
                        </div>
                        <Label className='sr-only' htmlFor='name'>
                            Name
                        </Label>
                        <Input
                            id='name'
                            className='max-w-[400px] pl-6'
                            size={32}
                            {...register('name')}
                        />
                        {errors?.name && (
                            <p className='px-1 text-xs text-red-600'>{errors.name.message} input</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button isLoading={isLoading}>Change name</Button>
                </CardFooter>
            </Card>
        </form>
    )
}