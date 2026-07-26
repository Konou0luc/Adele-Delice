'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { defaultCountries, FlagImage, usePhoneInput } from 'react-international-phone'
import type { CountryData, CountryIso2 } from 'react-international-phone'
import { FaChevronDown, FaMagnifyingGlass } from 'react-icons/fa6'

type InternationalPhoneFieldProps = {
  value: string
  onChange: (value: string) => void
  defaultCountry?: CountryIso2
  placeholder?: string
  className?: string
}

type CountryOption = {
  name: string
  iso2: CountryIso2
  dialCode: string
}

const countries = defaultCountries as CountryData[]
const togoleseCountries = countries.filter((country) => country[1] === 'tg')

function toCountryOption(country: CountryData): CountryOption {
  return {
    name: country[0],
    iso2: country[1],
    dialCode: country[2],
  }
}

export default function InternationalPhoneField({
  value,
  onChange,
  defaultCountry = 'tg',
  placeholder = '90000000',
  className = '',
}: InternationalPhoneFieldProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  const resolvedCountry = togoleseCountries.some((country) => country[1] === defaultCountry)
    ? defaultCountry
    : 'tg'

  const { inputValue, handlePhoneValueChange, country, setCountry } = usePhoneInput({
    defaultCountry: resolvedCountry,
    value,
    countries: togoleseCountries,
    preferredCountries: ['tg'],
    forceDialCode: true,
    onChange: ({ phone }) => onChange(phone),
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', onClickOutside)
    window.addEventListener('keydown', onEscape)

    return () => {
      window.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('keydown', onEscape)
    }
  }, [])

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return togoleseCountries
        .map(toCountryOption)
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    return togoleseCountries
      .map(toCountryOption)
      .filter((entry) => {
        return (
          entry.name.toLowerCase().includes(query) ||
          entry.dialCode.includes(query) ||
          entry.iso2.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [search])

  const selectedDialCode = country?.dialCode ? `+${country.dialCode}` : '+'

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="flex items-stretch overflow-hidden rounded-[14px] border border-[#EAEAEA] bg-white">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="flex min-w-[110px] items-center gap-2 border-r border-[#EAEAEA] bg-[#FBFBFA] px-3 py-3 text-left text-[#111111]"
        >
          <span className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-[#EAEAEA] bg-white">
            <FlagImage iso2={country?.iso2} size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] uppercase tracking-[0.22em] text-[#787774]">Pays</span>
            <span className="block text-sm font-semibold leading-4 text-[#111111]">{selectedDialCode}</span>
          </span>
          <FaChevronDown className="h-3.5 w-3.5 text-[#787774]" />
        </button>

        <input
          type="tel"
          value={inputValue}
          onChange={handlePhoneValueChange}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-white px-4 py-3 text-[#111111] placeholder:text-[#A8A29E] focus:outline-none"
        />
      </div>

      {isOpen ? (
        <div
          className="absolute left-0 top-[calc(100%+0.5rem)] z-30 w-full overflow-hidden rounded-[18px] border border-[#EAEAEA] bg-white shadow-[0_12px_30px_rgba(17,17,17,0.08)]"
        >
          <div className="flex items-center gap-3 border-b border-[#EAEAEA] px-4 py-3">
            <FaMagnifyingGlass className="h-4 w-4 text-[#787774]" />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un pays"
              className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#A8A29E] focus:outline-none"
            />
          </div>

          <div className="max-h-72 overflow-y-auto p-2">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((entry) => {
                const isSelected = country?.iso2 === entry.iso2

                return (
                  <button
                    key={entry.iso2}
                    type="button"
                    onClick={() => {
                      setCountry(entry.iso2, { focusOnInput: true })
                      setIsOpen(false)
                      setSearch('')
                    }}
                    className={`flex w-full items-center gap-3 rounded-[14px] px-3 py-2 text-left transition-colors ${
                      isSelected ? 'bg-[#111111] text-white' : 'hover:bg-[#FBFBFA] text-[#111111]'
                    }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border ${
                      isSelected ? 'border-white/20 bg-white/10' : 'border-[#EAEAEA] bg-white'
                    }`}>
                      <FlagImage iso2={entry.iso2} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{entry.name}</span>
                      <span className={`block text-xs ${isSelected ? 'text-white/75' : 'text-[#787774]'}`}>
                        +{entry.dialCode}
                      </span>
                    </span>
                  </button>
                )
              })
            ) : (
              <div className="px-3 py-8 text-center text-sm text-[#787774]">Aucun pays trouvé</div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
