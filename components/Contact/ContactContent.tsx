'use client'

import { useState } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'

const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add form submission logic (connect to backend or EmailJS)
    console.log('Form submitted:', formData)
    alert('Merci pour votre message ! Nous vous répondrons bientôt.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left: Contact Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center text-white">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-xl font-bold text-[#111111]">Adresse</h3>
            </div>
            <p className="text-[#787774]">
              123 Rue des Délices,<br />
              Dakar, Sénégal
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center text-white">
                <FaPhone />
              </div>
              <h3 className="text-xl font-bold text-[#111111]">Téléphone</h3>
            </div>
            <p className="text-[#787774]">
              <a href="tel:+22112345678" className="hover:text-[#111111] transition-colors">+221 12 345 6789</a>
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center text-white">
                <FaEnvelope />
              </div>
              <h3 className="text-xl font-bold text-[#111111]">Email</h3>
            </div>
            <p className="text-[#787774]">
              <a href="mailto:contact@adeledelice.com" className="hover:text-[#111111] transition-colors">contact@adeledelice.com</a>
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#EAEAEA] p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center text-white">
                <FaClock />
              </div>
              <h3 className="text-xl font-bold text-[#111111]">Horaires</h3>
            </div>
            <ul className="text-[#787774] space-y-2">
              <li className="flex justify-between"><span>Lundi - Vendredi:</span> <span>11h00 - 22h00</span></li>
              <li className="flex justify-between"><span>Samedi:</span> <span>10h00 - 23h00</span></li>
              <li className="flex justify-between"><span>Dimanche:</span> <span>10h00 - 21h00</span></li>
            </ul>
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#EAEAEA] p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-3xl font-bold text-[#111111] mb-8">Envoyez-nous un message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#111111] mb-2">Nom complet</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#111111] mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                    placeholder="john@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-[#111111] mb-2">Sujet</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="reservation">Réservation</option>
                  <option value="feedback">Commentaire</option>
                  <option value="question">Question</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-[#111111] mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-[#EAEAEA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111111]/20 resize-vertical"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-[#111111] text-white text-lg font-semibold rounded-lg hover:bg-[#333333] transition-colors"
              >
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl border border-[#EAEAEA] overflow-hidden hover:shadow-lg transition-shadow">
        <iframe
          title="Localisation Adèle Délice"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-17.4677%2C14.6928%2C-17.4277%2C14.7128&layer=mapnik&marker=14.7028%2C-17.4477"
          width="100%"
          height="400"
          className="border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  )
}

export default ContactContent
