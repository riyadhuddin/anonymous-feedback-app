export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Anonymous Feedback App. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="/privacy" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
              Terms of Service
            </a>
            <a href="/contact" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
