import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import Bridge from '../components/Icons/Bridge'
import Logo from '../components/Icons/Logo'
import Modal from '../components/Modal'
import cloudinary from '../utils/cloudinary'
import getBase64ImageUrl from '../utils/generateBlurPlaceholder'
import type { ImageProps } from '../utils/types'
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto'
import { CldImage } from 'next-cloudinary'

const Home: NextPage = ({
    images,
    totalImages,
    currentPage,
    imagesPerPage
}: {
    images: ImageProps[]
    totalImages: number
    currentPage: number
    imagesPerPage: number
}) => {
    const router = useRouter()
    const { photoId } = router.query
    const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
    const currentYear = new Date().getFullYear()
    const totalPages = Math.ceil(totalImages / imagesPerPage)

    const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
        if (lastViewedPhoto && !photoId) {
            lastViewedPhotoRef.current?.scrollIntoView({ block: 'center' })
            setLastViewedPhoto(null)
        }
    }, [photoId, lastViewedPhoto, setLastViewedPhoto])

    const handlePageChange = (newPage: number) => {
        router.push(`/?page=${newPage}`)
    }

    return (
        <>
            <Head>
                <title>Ravenwood AI Gallery</title>
                <meta
                    property="og:image"
                    content="https://ravenwood-gallery.vercel.app/og-image.png"
                />
                <meta
                    name="twitter:image"
                    content="https://ravenwood-gallery.vercel.app/og-image.png"
                />
            </Head>
            <main className={`mx-auto max-w-[1960px] p-4`}>
                {photoId && (
                    <Modal
                        images={images}
                        onClose={() => {
                            setLastViewedPhoto(photoId)
                        }}
                    />
                )}
                <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
                    <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                            <span className="flex max-h-full max-w-full items-center justify-center">
                                <Bridge />
                            </span>
                            <span className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
                        </div>
                        <Logo />
                        <h1 className="mb-4 mt-8 text-base font-bold uppercase tracking-widest">
                            Dall E 3 Artificial Intelligence
                        </h1>
                        <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
                            Experience the craze that is AI generated art!
                            Browse and share to your hearts content. Join and
                            create with us!
                        </p>
                        <Link
                            className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
                            href="https://ravenwood-creations.printify.me/products"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Visit Store
                        </Link>
                    </div>
                    {images.map(({ id, public_id, format, blurDataUrl }) => (
                        <Link
                            key={id}
                            href={`/?photoId=${id}`}
                            as={`/p/${id}`}
                            ref={
                                id === Number(lastViewedPhoto)
                                    ? lastViewedPhotoRef
                                    : null
                            }
                            shallow
                            className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                        >
                            <CldImage
                                alt="Dall E 3 AI Generated Image"
                                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                                style={{ transform: 'translate3d(0, 0, 0)' }}
                                placeholder="blur"
                                blurDataURL={blurDataUrl}
                                width={720}
                                height={480}
                                src={`${public_id}.${format}`}
                                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
                            />
                        </Link>
                    ))}
                </div>
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="mr-2 rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="px-4 py-2 text-white/80">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-2 rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </main>
            <footer className="p-6 text-center text-white/80 sm:p-12">
                Thank you to for your support!
                <p className="text-gray-500">
                    Copyright &copy; {currentYear}{' '}
                    <span className="font-medium text-gray-800 underline transition-colors">
                        Ravenwood Creations
                    </span>
                </p>
            </footer>
        </>
    )
}

export default Home

export async function getServerSideProps({ query }) {
    const page = parseInt(query.page as string) || 1
    const imagesPerPage = 20 // Adjust this number as needed

    let results
    let nextCursor = null

    if (page === 1) {
        results = await cloudinary.v2.search
            .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
            .sort_by('public_id', 'desc')
            .max_results(imagesPerPage)
            .execute()
    } else {
        const prevPageResults = await cloudinary.v2.search
            .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
            .sort_by('public_id', 'desc')
            .max_results(imagesPerPage * (page - 1))
            .execute()

        nextCursor = prevPageResults.next_cursor

        results = await cloudinary.v2.search
            .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
            .sort_by('public_id', 'desc')
            .max_results(imagesPerPage)
            .next_cursor(nextCursor)
            .execute()
    }

    let reducedResults: ImageProps[] = []

    let i = 0
    for (let result of results.resources) {
        reducedResults.push({
            id: i,
            height: result.height,
            width: result.width,
            public_id: result.public_id,
            format: result.format
        })
        i++
    }

    const blurImagePromises = results.resources.map((image: ImageProps) => {
        return getBase64ImageUrl(image)
    })
    const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

    for (let i = 0; i < reducedResults.length; i++) {
        reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
    }

    return {
        props: {
            images: reducedResults,
            totalImages: results.total_count,
            currentPage: page,
            imagesPerPage,
            nextCursor: results.next_cursor || null
        }
    }
}
