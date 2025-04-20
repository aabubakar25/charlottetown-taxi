/**
 * Handles phone calls with fallback for desktop devices
 * @param phoneNumber The phone number to call
 */
export function handlePhoneCall(phoneNumber: string): void {
  // Format the phone number by removing any non-digit characters
  const formattedNumber = phoneNumber.replace(/\D/g, "")

  // Try to initiate the call
  window.location.href = `tel:${formattedNumber}`

  // For desktop devices where tel: protocol might not work
  setTimeout(() => {
    // Check if the page is still active (call didn't initiate)
    if (document.hasFocus()) {
      // Show a message with the number
      alert(`Please call us at ${phoneNumber}. This number has been copied to your clipboard.`)

      // Copy the number to clipboard
      try {
        navigator.clipboard.writeText(phoneNumber)
      } catch (error) {
        console.error("Failed to copy number to clipboard", error)
      }
    }
  }, 300)
}

