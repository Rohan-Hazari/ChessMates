'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { buttonVariants } from './Button'; // Adjust import path as needed

interface DynamicLinkProps {
    slug: string;
    className: string;
    children: string
}

const DynamicLink = ({ slug, className, children }: DynamicLinkProps) => {
    const pathname = usePathname();

    const getCorrectUrl = () => {
        const pathSegments = pathname.split('/').filter(Boolean);

        // Find the index of the slug in the current path
        const slugIndex = pathSegments.indexOf(slug);

        if (slugIndex !== -1) {
            // If slug is found in the path, construct URL up to that point
            const basePath = pathSegments.slice(0, slugIndex + 1).join('/');
            return `/${basePath}/submit`;
        } else {
            // If slug is not in the path, use it directly
            return `/${slug}/submit`;
        }
    };

    return (
        <Link
            href={getCorrectUrl()}
            className={buttonVariants({
                variant: "outline",
                className: `w-full mb-6 ${className || ''}`,
            })}
        >
            {children}
        </Link>
    );
};

export default DynamicLink;