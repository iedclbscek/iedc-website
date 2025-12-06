import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function KsdCrowdfundingPage() {
  const [step, setStep] = useState(0)
  const [donorType, setDonorType] = useState('')
  const [amount, setAmount] = useState('')
  const [showCompliance, setShowCompliance] = useState(false)
  const [donors, setDonors] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentProofUrl, setPaymentProofUrl] = useState(null)
  const [isUploadingProof, setIsUploadingProof] = useState(false)
  
  // Event date: 22/12/2025, Funding closes: 19/12/2025 (3 days before)
  const fundingCloseDate = new Date('2025-12-19')
  const today = new Date()
  const isFundingClosed = today >= fundingCloseDate

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Fetch verified donors and testimonials on mount
  useEffect(() => {
    fetchDonors()
    fetchTestimonials()
  }, [])

  const fetchDonors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/donations`)
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
      const res = await fetch(`${API_BASE_URL}/api/testimonials`)
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        setTestimonials(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (client-side check)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large. Maximum size is 5MB.')
      e.target.value = ''
      return
    }

    setIsUploadingProof(true)
    const formData = new FormData()
    formData.append('payment_proof', file)

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload/donation-proof`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      
    //   console.log('Upload response:', data) // Debug log

      if (data.success) {
        if (!data.url) {
          console.error('Upload successful but URL is missing:', data)
          toast.error('Upload failed: No URL returned')
          return
        }
        setPaymentProofUrl(data.url)
        toast.success('Proof uploaded successfully!')
      } else {
        toast.error(data.message || 'Upload failed')
        e.target.value = ''
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.')
      e.target.value = ''
    } finally {
      setIsUploadingProof(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isUploadingProof) {
      toast.error('Please wait for the proof to finish uploading.')
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      formData.append('amount', amount)
      formData.append('donor_type', donorType)
      
      // Ensure payment_proof_url is appended correctly
      if (paymentProofUrl) {
        formData.append('payment_proof_url', paymentProofUrl)
      } else {
        toast.error('Please upload the payment proof.')
        setIsSubmitting(false)
        return
      }

      // Log formData entries for debugging
    //   for (let [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    //   }

      const res = await fetch(`${API_BASE_URL}/api/donations`, {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        setStep(5)
        fetchDonors() // Refresh donor list
      } else {
        toast.error(data.error || 'Failed to submit donation. Please try again.')
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative bg-white border-b pt-24">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
              Kasaragod Community,<br/>Support IEDC SUMMIT 2025
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Dear Kasaragod Community & Alumni, help us make IEDC SUMMIT 2025 the biggest celebration of student innovation and entrepreneurship in our region.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Your contribution directly funds the summit's events, competitions, workshops, and resources for the next generation of student entrepreneurs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isFundingClosed ? (
                <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
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

      {/* Impact Section with Embedded Website */}
      <section id="impact" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Where Your Contribution Goes
          </h2>
          <p className="text-gray-600 mb-8">Explore the official IEDC Summit 2025 website to see what we are building.</p>
          
          <div className="relative w-full h-[600px] border-2 border-gray-200 rounded-xl overflow-hidden shadow-2xl group">
            {/* Overlay for click-to-visit behavior */}
            <a 
              href="https://iedcsummit.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all z-10 flex items-center justify-center"
              title="Click to visit iedcsummit.in"
            >
              <div className="bg-white px-6 py-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-semibold flex items-center gap-2">
                Visit iedcsummit.in <span className="text-xl">↗</span>
              </div>
            </a>
            
            <iframe 
              src="https://iedcsummit.in" 
              title="IEDC Summit 2025 Website"
              className="w-full h-full border-0"
              loading="lazy"
            ></iframe>
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="https://iedcsummit.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-black font-semibold hover:underline"
            >
              Open iedcsummit.in in a new tab ↗
            </a>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="bg-white py-16 border-t">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Community Supports Us</h2>
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
                      <p className="text-sm text-gray-500">IEDC Supporter</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 italic">
                No testimonials yet. Be the first to share your support!
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Donor Wall */}
      <section id="donors" className="max-w-5xl mx-auto px-6 py-16 bg-white border-t">
        <h2 className="text-3xl font-bold text-center mb-12">Thank You, Kasaragod! 🙏</h2>
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
                      <span className="font-medium">IEDC LBSCEK</span>
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
                <input 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="w-full border rounded-lg px-3 py-2" 
                  required={!paymentProofUrl}
                  onChange={handleFileUpload}
                  disabled={isUploadingProof}
                />
                {isUploadingProof && <p className="text-xs text-blue-600 mt-1">Uploading...</p>}
                {paymentProofUrl && <p className="text-xs text-green-600 mt-1">Proof uploaded successfully!</p>}
              </div>
              <input name="name" type="text" placeholder="Your Name" className="w-full border rounded-lg px-3 py-2" required />
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
                <label className="block text-sm font-medium mb-2">Share your message (Optional)</label>
                <textarea 
                  name="testimonial"
                  placeholder="Tell us why you support IEDC..."
                  className="w-full border rounded-lg px-3 py-2 h-24 resize-none"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">Your message may be featured on our website</p>
              </div>

              {isSubmitting ? (
                <div className="space-y-3">
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-3"></div>
                    <p className="font-medium text-gray-900">Uploading Payment Proof...</p>
                    <p className="text-xs text-gray-500 mt-1">Please do not close this window</p>
                  </div>
                </div>
              ) : (
                <>
                  <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    Submit Donation
                  </button>
                  <button type="button" onClick={() => setStep(3)} className="w-full text-gray-500 hover:text-gray-700 transition-colors">
                    Back
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Success */}
      {step === 5 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your donation has been submitted for verification. You will receive a confirmation email shortly.
            </p>
            <button onClick={() => setStep(0)} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
              Close
            </button>
          </div>
        </div>
      )}

    </main>
  )
}