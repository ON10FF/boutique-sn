export default function Settings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Paramètres</h1>
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <p className="text-sm text-gray-500">
          Les paramètres (numéro WhatsApp, Wave, Orange Money) sont configurés dans le fichier <code className="bg-gray-100 px-1.5 py-0.5 rounded text-orange-600">.env.local</code>.
        </p>
        <div className="mt-4 space-y-2 font-mono text-xs bg-gray-50 rounded-xl p-4 text-gray-600">
          <p>VITE_WHATSAPP_NUMBER=221771234567</p>
          <p>VITE_WAVE_MERCHANT_ID=ton_merchant_id</p>
          <p>VITE_ORANGE_MERCHANT_CODE=ton_code</p>
        </div>
      </div>
    </div>
  )
}