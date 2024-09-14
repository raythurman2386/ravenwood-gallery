import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <meta
                        name="description"
                        content="Experience the craze that is AI generated art! Browse and share to your hearts content. Join and create with us!"
                    />
                    <meta
                        property="og:site_name"
                        content="ravenwood-gallery.vercel.app"
                    />
                    <meta
                        property="og:description"
                        content="Experience the craze that is AI generated art! Browse and share to your hearts content. Join and create with us!"
                    />
                    <meta property="og:title" content="Ravenwood AI Gallery" />
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Ravenwood AI Gallery" />
                    <meta
                        name="twitter:description"
                        content="Experience the craze that is AI generated art! Browse and share to your hearts content. Join and create with us!"
                    />
                </Head>
                <body className="bg-black antialiased">
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
