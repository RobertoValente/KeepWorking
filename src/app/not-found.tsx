import Link from 'next/link'
import { SparklesText } from "@/components/magicui/sparkles-text";

export const metadata = {
    title: 'Not Found | Boilerplate - Roberto',
    description: 'Page not found',
}

export default function Home() {
    return (
        <div className='text-center mt-6'>
            <SparklesText className="text-4xl">404 Not Found</SparklesText>
            <br /><Link href="/" className='underline underline-offset-4'>Back Home</Link>
        </div>
    )
}