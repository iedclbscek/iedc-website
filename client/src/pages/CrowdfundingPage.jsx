import { useState, useEffect } from 'react'

export default function CrowdfundingPage() {
  const [step, setStep] = useState(0)
  const [donorType, setDonorType] = useState('')
  const [amount, setAmount] = useState('')
  const [showCompliance, setShowCompliance] = useState(false)
  const [donors, setDonors] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Event date: 22/12/2025, Funding closes: 19/12/2025 (3 days before)
  const fundingCloseDate = new Date('2025-12-19')
  const today = new Date()
  const isFundingClosed = today >= fundingCloseDate
  
  // Calculate days remaining
  const daysRemaining = Math.ceil((fundingCloseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // Fetch verified donors and testimonials on mount
  useEffect(() => {
    fetchDonors()
    fetchTestimonials()
  }, [])

  const fetchDonors = async () => {
    try {
      const res = await fetch('/api/donations')
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        setDonors(data.data.map((d) => ({
          name: d.name,
          batch: d.batch || 'Alumni',
          amount: `₹${Number(d.amount).toLocaleString()}`,
          time: new Date(d.created_at).toLocaleDateString()
        })))
      } else {
        setDonors([
          { name: 'Be the first!', amount: '₹0', time: 'Waiting for donations' },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch donors:', error)
      setDonors([
        { name: 'Be the first!', amount: '₹0', time: 'Waiting for donations' },
      ])
    }
  }

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials')
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append('amount', amount)
      formData.append('donor_type', donorType)

      const res = await fetch('/api/donations', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        setStep(5)
        fetchDonors() // Refresh donor list
      } else {
        alert('Failed to submit donation. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚀</span>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-sm md:text-base">IEDC Crowdfunding Campaign</span>
                <span className="text-xs text-gray-500 hidden sm:block">SUMMIT 2025</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#impact" className="text-gray-600 hover:text-gray-900 transition">Impact</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Stories</a>
              <a href="#donors" className="text-gray-600 hover:text-gray-900 transition">Donors</a>
              {!isFundingClosed ? (
                <button onClick={() => setStep(1)} className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
                  Donate Now
                </button>
              ) : (
                <span className="text-red-600 font-semibold">Funding Closed</span>
              )}
            </div>
            {!isFundingClosed ? (
              <button onClick={() => setStep(1)} className="md:hidden bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition">
                Donate
              </button>
            ) : (
              <span className="md:hidden text-red-600 font-semibold text-sm">Closed</span>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white border-b pt-24">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Alumni, Support IEDC SUMMIT 2025
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Dear LBSCEK Alumni, help us make IEDC SUMMIT 2025 the biggest celebration of student innovation and entrepreneurship at our alma mater.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Your contribution directly funds the summit's events, competitions, workshops, and resources for the next generation of student entrepreneurs.
            </p>
            
            {/* Countdown/Status */}
            {!isFundingClosed ? (
              <div className="mb-8">
                <div className="inline-block bg-orange-50 border border-orange-200 rounded-lg px-6 py-3">
                  <p className="text-orange-800 font-semibold">
                    ⏰ Funding closes in {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} (19th Dec 2025)
                  </p>
                  <p className="text-orange-600 text-sm mt-1">Event Date: 22nd December 2025</p>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="inline-block bg-red-50 border border-red-200 rounded-lg px-6 py-3">
                  <p className="text-red-800 font-semibold">
                    🔒 Crowdfunding has closed
                  </p>
                  <p className="text-red-600 text-sm mt-1">Thank you to all our alumni contributors!</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isFundingClosed ? (
                <button onClick={() => setStep(1)} className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition">
                  Donate Now
                </button>
              ) : (
                <button disabled className="bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold cursor-not-allowed">
                  Funding Closed
                </button>
              )}
              <a href="#impact" className="border-2 border-black px-8 py-4 rounded-lg font-semibold hover:bg-black hover:text-white transition">
                See Our Impact
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            IEDC SUMMIT 2025 - Where Your Contribution Goes
          </h2>
          <p className="text-gray-600">Building Kerala's premier student innovation summit</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 border rounded-lg">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Summit Events</h3>
            <p className="text-gray-600 text-sm">Keynote speakers, panel discussions, and networking sessions</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💡</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Workshops & Bootcamps</h3>
            <p className="text-gray-600 text-sm">Hands-on training in entrepreneurship and innovation</p>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Competitions & Prizes</h3>
            <p className="text-gray-600 text-sm">Pitch competitions, hackathons, and awards for innovators</p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="bg-white py-16 border-t">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Alumni Support IEDC SUMMIT 2025</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 rounded-lg border">
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <span className="font-bold text-gray-900">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">IEDC Alumni</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white p-8 rounded-lg border">
                  <p className="text-gray-700 mb-4 italic">
                    "IEDC gave me the platform to experiment, fail, and learn. Now I want to ensure current students have even better resources to chase their startup dreams."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <span className="font-bold text-gray-900">AK</span>
                    </div>
                    <div>
                      <p className="font-semibold">Anand Kumar</p>
                      <p className="text-sm text-gray-500">Batch 2012-2016 • Founder, TechStartup</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-lg border">
                  <p className="text-gray-700 mb-4 italic">
                    "The hackathons and projects I worked on through IEDC shaped my career. Giving back means more students get to experience that same growth."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <span className="font-bold text-gray-900">SM</span>
                    </div>
                    <div>
                      <p className="font-semibold">Sneha Menon</p>
                      <p className="text-sm text-gray-500">Batch 2014-2018 • Product Manager, Amazon</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Donor Wall */}
      <section id="donors" className="max-w-5xl mx-auto px-6 py-16 bg-white border-t">
        <h2 className="text-3xl font-bold text-center mb-12">Thank You, LBSCEK Alumni! 🙏</h2>
        <div className="bg-white rounded-lg border p-8">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {donors.map((donor, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-bold mr-4">
                    {donor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{donor.name}</p>
                    <p className="text-sm text-gray-500">{donor.batch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{donor.amount}</p>
                  <p className="text-xs text-gray-400">{donor.time}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            🙏 Thank you to all our contributors
          </p>
        </div>
      </section>

      {/* Modal 1: Geo Selection */}
      {step === 1 && !isFundingClosed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-6 text-center">Where are you donating from?</h3>
            <div className="space-y-4">
              <button 
                onClick={() => { setDonorType('india'); setStep(2); }}
                className="w-full bg-white border-2 border-gray-300 hover:border-black py-4 rounded-lg font-semibold text-lg transition"
              >
                🇮🇳 I'm donating from India
              </button>
              <button 
                onClick={() => { setDonorType('international'); setStep(2); }}
                className="w-full bg-white border-2 border-gray-300 hover:border-black py-4 rounded-lg font-semibold text-lg transition"
              >
                🌍 I'm donating from Outside India
              </button>
            </div>
            <button onClick={() => setStep(0)} className="w-full mt-6 text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {/* Modal 2: Amount Input */}
      {step === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-6">Enter Contribution Amount</h3>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount in INR"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg mb-6 focus:border-black outline-none"
            />
            <button 
              onClick={() => {
                if (donorType === 'international' && parseInt(amount) > 10000) {
                  setShowCompliance(true);
                }
                setStep(3);
              }}
              disabled={!amount || parseInt(amount) <= 0}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue
            </button>
            <button onClick={() => setStep(1)} className="w-full mt-4 text-gray-500 hover:text-gray-700">Back</button>
          </div>
        </div>
      )}

      {/* Modal 3: Payment Method */}
      {step === 3 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-md w-full my-8">
            <h3 className="text-2xl font-semibold mb-6">Payment Details</h3>
            
            {/* India - Less than 10K */}
            {donorType === 'india' && parseInt(amount) < 10000 && (
              <div>
                <div className="bg-gray-50 border p-6 rounded-lg mb-4 text-center">
                  <img src="/qr1.jpg" alt="UPI QR Code" className="w-48 h-48 mx-auto mb-3 object-contain" />
                  <p className="text-sm text-gray-600 mb-2">Scan to pay via UPI</p>
                  <p className="font-mono text-base text-gray-900 mb-2">78707501@ubinb</p>
                  <p className="text-xs text-gray-500">Fast-track UPI flow, typically under 30 seconds</p>
                </div>
                <button onClick={() => setStep(4)} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                  I have paid — Upload Screenshot
                </button>
              </div>
            )}

            {/* India - 10K or more */}
            {donorType === 'india' && parseInt(amount) >= 10000 && (
              <div>
                <div className="bg-gray-50 border p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-3">UPI Payment</p>
                  <img src="/qr1.jpg" alt="UPI QR Code" className="w-40 h-40 mx-auto mb-2 object-contain" />
                  <p className="text-sm text-gray-600 text-center mb-1">Scan to pay via UPI</p>
                  <p className="font-mono text-sm text-gray-900 text-center">78707501@ubinb</p>
                </div>
                <div className="bg-gray-50 border p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-3">Bank Transfer</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Name:</span>
                      <span className="font-medium">IEDC LBS COLLEGE OF ENGINEERING</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-medium">Union Bank of India</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account No:</span>
                      <span className="font-mono">016922010002158</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IFSC:</span>
                      <span className="font-mono">UBIN0901695</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch:</span>
                      <span className="font-medium">BOVIKAN</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button onClick={() => setStep(4)} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                    Paid via UPI — Upload Screenshot
                  </button>
                  <button onClick={() => setStep(4)} className="w-full border-2 border-black py-3 rounded-lg hover:bg-black hover:text-white">
                    Paid via Bank Transfer — Upload Proof
                  </button>
                </div>
              </div>
            )}

            {/* International */}
            {donorType === 'international' && (
              <div>
                <div className="bg-gray-50 border p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-3">Bank Account Details</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Name:</span>
                      <span className="font-medium">IEDC LBS COLLEGE OF ENGINEERING</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bank:</span>
                      <span className="font-medium">Union Bank of India</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account No:</span>
                      <span className="font-mono">016922010002158</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IFSC:</span>
                      <span className="font-mono">UBIN0901695</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch:</span>
                      <span className="font-medium">BOVIKAN</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SWIFT Code:</span>
                      <span className="font-mono">UBININBB</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(4)} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
                  I've made the transfer
                </button>
              </div>
            )}

            <button onClick={() => setStep(2)} className="w-full mt-4 text-gray-500 hover:text-gray-700">Back</button>
          </div>
        </div>
      )}

      {/* Compliance Popup */}
      {showCompliance && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h4 className="font-semibold text-lg mb-3">Important Notice</h4>
            <p className="text-sm text-gray-700 mb-4">
              Due to cross-border compliance, contributions above ₹10K INR are collected only via direct bank transfer.
            </p>
            <button onClick={() => setShowCompliance(false)} className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800">
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Modal 4: Upload Proof */}
      {step === 4 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-md w-full my-8">
            <h3 className="text-2xl font-semibold mb-6">Upload Payment Proof</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Screenshot/Proof</label>
                <input name="payment_proof" type="file" accept="image/*,.pdf" className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <input name="name" type="text" placeholder="Your Name" className="w-full border rounded-lg px-3 py-2" required />
              <input name="batch" type="text" placeholder="Batch (e.g., 2015-2019)" className="w-full border rounded-lg px-3 py-2" />
              <input name="email" type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2" required />
              <input name="phone" type="tel" placeholder="Phone" className="w-full border rounded-lg px-3 py-2" required />
              {donorType === 'india' && parseInt(amount) >= 10000 && (
                <input name="pan" type="text" placeholder="PAN (Optional)" className="w-full border rounded-lg px-3 py-2" />
              )}
              
              {/* Anonymous Option */}
              <div className="border-t pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input name="show_on_wall" type="checkbox" className="w-4 h-4" defaultChecked value="true" />
                  <span className="text-sm">Show my name on the donor wall</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">Uncheck to remain anonymous</p>
              </div>

              {/* Testimonial */}
              <div>
                <label className="block text-sm font-medium mb-2">Share your IEDC LBSCEK story (Optional)</label>
                <textarea 
                  name="testimonial"
                  placeholder="Tell us how IEDC impacted your journey..."
                  className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Your testimonial may be featured on our website</p>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400">
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" onClick={() => setStep(3)} className="w-full text-gray-500 hover:text-gray-700">
                Back
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Success */}
      {step === 5 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-2xl font-semibold mb-3">Thank you for powering the mission!</h3>
            <p className="text-gray-600 mb-4">Your contribution has been recorded.</p>
            <p className="text-sm text-gray-500 mb-6">Transaction Reference: #{Math.random().toString(36).substring(2, 11).toUpperCase()}</p>
            <p className="text-sm text-gray-600 mb-6">You'll receive a confirmation email shortly.</p>
            <button onClick={() => { setStep(0); setAmount(''); setDonorType(''); }} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transparency Section */}
      <section className="bg-white py-16 border-t">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Complete Transparency</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Every rupee contributed by our alumni is accounted for. A detailed financial breakdown will be published after IEDC SUMMIT 2025, showing exactly how your contributions made the event successful.
          </p>
          <div className="inline-block bg-gray-50 border px-6 py-3 rounded-lg">
            <p className="font-semibold">Alumni contributions go directly to IEDC LBSCEK's official account</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-lg mb-2 text-gray-900">IEDC SUMMIT 2025</p>
          <p className="text-sm text-gray-600 mb-4">Alumni Crowdfunding Campaign</p>
          <p className="text-xs text-gray-500">Innovation & Entrepreneurship Development Cell, LBSCEK</p>
          <p className="text-xs text-gray-500 mt-2">© 2025 IEDC LBSCEK. All rights reserved</p>
        </div>
      </footer>
    </main>
  )
}
