import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Receive Anonymous Feedback
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Create your profile, share your link, and get honest feedback from anyone. No sign-up required for feedback providers.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link 
                  href="/auth/signup" 
                  className="btn btn-primary inline-flex h-10 items-center justify-center"
                >
                  Get Started
                </Link>
                <Link 
                  href="/auth/login" 
                  className="btn btn-secondary inline-flex h-10 items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm lg:max-w-none">
              <div className="aspect-video overflow-hidden rounded-xl">
                <Image
                  src="/hero-image.png"
                  width={600}
                  height={400}
                  alt="App screenshot"
                  className="object-cover w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Simple, private, and secure anonymous feedback
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">1. Create Your Profile</h3>
              <p className="text-gray-500 dark:text-gray-400">Sign up and customize your public profile page.</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">2. Share Your Link</h3>
              <p className="text-gray-500 dark:text-gray-400">Share your unique profile URL with anyone you want feedback from.</p>
            </div>
            <div className="grid gap-1">
              <h3 className="text-xl font-bold">3. Respond & Share</h3>
              <p className="text-gray-500 dark:text-gray-400">Reply to feedback and share your responses on social media.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
