
import CreateChessPuzzlePost from '@/components/chess/CreateChessPuzzlePost'
// import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';
import { notFound } from 'next/navigation';

interface pageProps {
    params: {
        slug: string;
    };
}

const page = async ({ params }: pageProps) => {

    const session = await getSessionFromRequest()
    const community = await db.community.findUnique({
        where: {
            name: params.slug
        }
    })

    if (!community) return notFound()

    const subscription = session?.user ? await db.subscription.findFirst({
        where: {
            community: {
                name: params.slug
            },
            user: {
                id: session.user.id
            }
        }
    }) : undefined

    const isSubscribed = !(!!subscription)


    return <div>
        <CreateChessPuzzlePost fen='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' isSubscribed={isSubscribed} communityId={community.id} />
    </div>
}

export default page