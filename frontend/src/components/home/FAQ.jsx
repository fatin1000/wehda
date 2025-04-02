const FAQ = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center mb-16">
      <h2 className="text-4xl font-semibold tracking-tight text-balance text-primary sm:text-5xl">FAQ</h2>
        <p className="mt-2 text-lg/8 text-gray-600">Frequently Asked Questions</p>
      </div>
        
        <div className="max-w-[90%] mx-auto sm:max-w-[70%] lg:max-w-[60%]">
        <div className="collapse collapse-plus bg-base-100 border border-base-300 mb-4">
        <input type="radio" name="my-accordion-3" defaultChecked />
        <div className="collapse-title font-semibold">How do I create an account?</div>
        <div className="collapse-content text-sm">Click the Sign Up button in the top right corner and follow the registration process.</div>
        </div>
        <div className="collapse collapse-plus bg-base-100 border border-base-300 mb-4">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-semibold">I forgot my password. What should I do?</div>
        <div className="collapse-content text-sm">Click on Forgot Password on the login page and follow the instructions sent to your email.</div>
        </div>
        <div className="collapse collapse-plus bg-base-100 border border-base-300 mb-4">
        <input type="radio" name="my-accordion-3" />
        <div className="collapse-title font-semibold">How do I update my profile information?</div>
        <div className="collapse-content text-sm">Go to My Account settings and select Edit Profile to make changes.</div>
        </div>
        </div>
    </div>
  )
}

export default FAQ
