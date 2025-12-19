import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'

export default function SponsorPage() {
  const [step, setStep] = useState(0)
  const [studentCount, setStudentCount] = useState(1)
  const [donors, setDonors] = useState([])
  const [groupedDonors, setGroupedDonors] = useState({})
  const [totalRaised, setTotalRaised] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentProofUrl, setPaymentProofUrl] = useState(null)
  const [isUploadingProof, setIsUploadingProof] = useState(false)
  
  // Event date: 22/12/2025, Funding closes: 19/12/2025 (3 days before)
  const fundingCloseDate = new Date('2025-12-30')
  const today = new Date()
  const isFundingClosed = today >= fundingCloseDate

  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  // Fetch verified donors on mount
  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/donations`)
      const data = await res.json()
      if (data.success && data.data && data.data.length > 0) {
        // Helper to normalize batch names
        const normalizeBatch = (batch) => {
          if (!batch) return 'Sponsor'
          return batch
        }

        // Group by batch
        const groups = {}
        let total = 0
        data.data.forEach(donor => {
          // Only show sponsors
          if (donor.batch !== 'Sponsor') return

          const batch = normalizeBatch(donor.batch)
          if (!groups[batch]) {
            groups[batch] = {
              totalAmount: 0,
              donors: []
            }
          }
          const amount = Number(donor.amount)
          groups[batch].totalAmount += amount
          total += amount
          groups[batch].donors.push({
            name: donor.name,
            amount: `₹${amount.toLocaleString()}`,
            time: new Date(donor.created_at).toLocaleDateString()
          })
        })
        setGroupedDonors(groups)
        setTotalRaised(total)

        setDonors(data.data
          .filter(d => d.batch === 'Sponsor')
          .map((d) => ({
            name: d.name,
            batch: normalizeBatch(d.batch),
            amount: `₹${Number(d.amount).toLocaleString()}`,
            time: new Date(d.created_at).toLocaleDateString()
          }))
        )
      } else {
        setGroupedDonors({})
        setTotalRaised(0)
        setDonors([
          { name: 'Be the first!', amount: '₹0', time: 'Waiting for donations' },
        ])
      }
    } catch (error) {
      console.error('Failed to fetch donors:', error)
      setGroupedDonors({})
      setTotalRaised(0)
      setDonors([
        { name: 'Be the first!', amount: '₹0', time: 'Waiting for donations' },
      ])
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
      
      if (data.success) {
        if (!data.url) {
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
      const amount = studentCount * 1000
      formData.append('amount', amount)
      formData.append('donor_type', 'sponsor')
      formData.append('batch', 'Sponsor') // Force batch to Sponsor
      
      if (paymentProofUrl) {
        formData.append('payment_proof_url', paymentProofUrl)
      } else {
        toast.error('Please upload the payment proof.')
        setIsSubmitting(false)
        return
      }

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
              പ്രിയ സുഹൃത്തേ
            </h1>
            <div className="text-lg md:text-xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed space-y-4 text-left md:text-center">
              <p>
                കാസർഗോഡ് LBS എൻജിനീയറിംഗ് കോളേജിൽ വെച്ച് 2025 ഡിസംബർ 22ന് IEDC സമ്മിറ്റിന്റെ പത്താം പതിപ്പ് നടക്കുകയാണ്.
                ഏഷ്യയിലെ തന്നെ ഏറ്റവും വലിയ നവസംരംഭകത്വ സമ്മേളനമാണ് ഇവിടെ നടക്കുന്നത്.
              </p>
              <p>
                എല്ലാ മേഖലകളിലുമുള്ള ഉന്നത വിദ്യാഭ്യാസ രംഗത്ത് പഠനം നടത്തുന്ന വിദ്യാർത്ഥികൾക്ക് അവരുടെ ആശയങ്ങൾ വ്യവസായ രംഗത്തെ പ്രമുഖർ, സംരംഭകർ എന്നിവർക്ക് മുന്നിൽ അവതരിപ്പിക്കുവാനും ചർച്ചകളിൽ പങ്കെടുക്കുവാനും ഉള്ള അവസരങ്ങൾ ലഭിക്കുന്നു.
              </p>
              <p>
                രജിസ്ട്രേഷൻ വഴിയാണ് പരിപാടിയിലേക്ക് പ്രവേശനം ലഭിക്കുക. 1000 രൂപയാണ് ഒരു വിദ്യാർത്ഥിക്ക് രജിസ്ട്രേഷൻ ഫീസ്.
              </p>
              <p>
                സാമ്പത്തികമായി പിന്നോക്കം നിൽക്കുന്ന കഴിവുള്ള അർഹതപ്പെട്ട വിദ്യാർത്ഥികൾക്ക് രജിസ്ട്രേഷൻ ചെയ്യാൻ പറ്റാത്ത സ്ഥിതി ഉണ്ടാവരുത് എന്നുള്ളതുകൊണ്ടാണ് ഇത്തരമൊരു അഭ്യർത്ഥന നിങ്ങൾക്ക് മുന്നിൽ അവതരിപ്പിക്കുന്നത്.
              </p>
              <p>
                പ്രസ്തുത വിദ്യാർത്ഥികളെ പരിപാടിയിലേക്ക് പങ്കെടുപ്പിക്കുവാൻ നിങ്ങൾക്ക് താല്പര്യമുണ്ടെങ്കിൽ, അതത് കോളേജുകളിൽ നിന്ന് അർഹരായവരെ നമുക്ക് തിരഞ്ഞെടുക്കാം.
                അവർ പഠനം നടത്തുന്ന കോളേജുകളിലെ പ്രിൻസിപ്പൽമാർ അർഹരായ വിദ്യാർത്ഥികളെ തിരഞ്ഞെടുത്ത് ലിസ്റ്റ് നമുക്ക് തരുന്നതാണ്.
              </p>
              <p className="font-semibold">
                ഇത്തരമൊരു ഉദ്യമത്തിന് താങ്കളുടെയും താങ്കളുടെ സ്ഥാപനത്തിന്റെയും സഹകരണങ്ങൾ പ്രതീക്ഷിക്കുകയാണ്.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl mb-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Sponsorship Details</h3>
              <p className="text-blue-800">
                Funds are being sponsored for students facing financial difficulties. Each student is being sponsored with <span className="font-bold">₹1,000</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isFundingClosed ? (
                <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Sponsor Students
                </button>
              ) : (
                <button disabled className="bg-gray-400 text-white px-8 py-4 rounded-lg font-semibold cursor-not-allowed">
                  Sponsorship Closed
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal 1: Select Number of Students */}
      {step === 1 && !isFundingClosed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-2xl font-semibold mb-6 text-center">Select number of students you want to sponsor</h3>
            
            <div className="mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <button 
                  onClick={() => setStudentCount(Math.max(1, studentCount - 1))}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-2xl font-bold hover:bg-gray-100"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={studentCount}
                  onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center text-3xl font-bold border-b-2 border-black outline-none"
                />
                <button 
                  onClick={() => setStudentCount(studentCount + 1)}
                  className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-2xl font-bold hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <p className="text-center text-xl text-gray-600">
                Total Amount: <span className="font-bold text-black">₹{(studentCount * 1000).toLocaleString()}</span>
              </p>
              <p className="text-center text-sm text-gray-500 mt-2">
                ({studentCount} student{studentCount > 1 ? 's' : ''} × ₹1,000)
              </p>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 font-semibold"
            >
              Continue to Payment
            </button>
            <button onClick={() => setStep(0)} className="w-full mt-4 text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {/* Modal 2: Payment Details */}
      {step === 2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-md w-full my-8">
            <h3 className="text-2xl font-semibold mb-6">Payment Details</h3>
            
            <div className="bg-gray-50 border p-6 rounded-lg mb-6 text-center">
              <img src="/qr1.jpg" alt="UPI QR Code" className="w-48 h-48 mx-auto mb-3 object-contain" />
              <p className="text-sm text-gray-600 mb-2">Scan to pay via UPI</p>
              <p className="font-mono text-base text-gray-900 mb-2">78707501@ubin</p>
              <div className="mt-4 p-3 bg-white rounded border">
                <p className="text-sm text-gray-500">Amount to Pay</p>
                <p className="text-2xl font-bold text-black">₹{(studentCount * 1000).toLocaleString()}</p>
              </div>
            </div>

            <button onClick={() => setStep(3)} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
              I have paid — Upload Screenshot
            </button>
            <button onClick={() => setStep(1)} className="w-full mt-4 text-gray-500 hover:text-gray-700">Back</button>
          </div>
        </div>
      )}

      {/* Modal 3: Upload Proof */}
      {step === 3 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-md w-full my-8">
            <h3 className="text-2xl font-semibold mb-6">Sponsor Details</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-2">Upload Payment Screenshot</label>
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
              
              {/* Anonymous Option */}
              <div className="border-t pt-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input name="show_on_wall" type="checkbox" className="w-4 h-4" defaultChecked value="true" />
                  <span className="text-sm">Show my name on the sponsor wall</span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">Uncheck to remain anonymous</p>
              </div>

              {isSubmitting ? (
                <div className="space-y-3">
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full mb-3"></div>
                    <p className="font-medium text-gray-900">Processing Sponsorship...</p>
                    <p className="text-xs text-gray-500 mt-1">Please do not close this window</p>
                  </div>
                </div>
              ) : (
                <>
                  <button type="submit" className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    Confirm Sponsorship
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="w-full text-gray-500 hover:text-gray-700 transition-colors">
                    Back
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Success */}
      {step === 5 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h3 className="text-2xl font-semibold mb-3">Thank You!</h3>
            <p className="text-xl font-medium text-gray-900 mb-2">
              You have sponsored {studentCount} student{studentCount > 1 ? 's' : ''}!
            </p>
            <p className="text-gray-600 mb-6">Thank you for providing value for future.</p>
            <button onClick={() => { setStep(0); setStudentCount(1); }} className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Donor Wall */}
      <section id="donors" className="max-w-5xl mx-auto px-6 py-16 bg-white border-t">
        <h2 className="text-3xl font-bold text-center mb-4">Our Contributors 🙏</h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-12 mb-12">
          <p className="text-center text-xl text-gray-600">
            Total Students Sponsored: <span className="font-bold text-blue-600">{Math.floor(totalRaised / 1000)}</span>
          </p>
          <div className="hidden md:block w-px h-8 bg-gray-300"></div>
          <p className="text-center text-xl text-gray-600">
            Grand Total Raised: <span className="font-bold text-green-600">₹{totalRaised.toLocaleString()}</span>
          </p>
        </div>
        <div className="bg-white rounded-lg border p-8">
          <div className="space-y-8 max-h-[800px] overflow-y-auto">
            {Object.keys(groupedDonors).length > 0 ? (
              Object.entries(groupedDonors)
                .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
                .map(([batch, group]) => (
                <div key={batch} className="mb-8 last:mb-0">
                  <div className="flex justify-between items-center mb-4 bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900">{batch}</h3>
                    <span className="text-blue-600 font-bold">Total: ₹{group.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="space-y-4 pl-4 border-l-2 border-gray-100">
                    {group.donors.map((donor, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-900 font-bold mr-4">
                            {donor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold">{donor.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{donor.amount}</p>
                          <p className="text-xs text-gray-400">{donor.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              donors.map((donor, idx) => (
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
              ))
            )}
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            🙏 Thank you to all our sponsors
          </p>
        </div>
      </section>
    </main>
  )
}