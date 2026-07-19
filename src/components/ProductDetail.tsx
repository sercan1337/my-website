'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  Star, Truck, Shield, RotateCcw, Plus, Minus,
  ShoppingBag, Heart, Check, Package, Clock,
  ChevronRight, ChevronDown, X, ChevronLeft,
  Sparkles, Leaf, Award, MessageCircle,
  ChevronUp, Eye, Share2,
} from 'lucide-react'

type ColorSwatch = { name: string; hex: string }
type SizeOption = { label: string; available: boolean }
type GalleryImage = { id: number; gradient: string; label: string }

const swatches: ColorSwatch[] = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'Tan', hex: '#c4a882' },
  { name: 'Olive', hex: '#6b7c65' },
  { name: 'Navy', hex: '#2c3e5c' },
]

const sizes: SizeOption[] = [
  { label: 'XS', available: true },
  { label: 'S', available: true },
  { label: 'M', available: true },
  { label: 'L', available: true },
  { label: 'XL', available: false },
]

const galleryImages: GalleryImage[] = [
  { id: 1, gradient: 'from-stone-900 via-stone-700 to-stone-500', label: 'Front view' },
  { id: 2, gradient: 'from-stone-800 via-amber-900/40 to-stone-700', label: 'Side view' },
  { id: 3, gradient: 'from-stone-900 via-stone-600 to-amber-800/30', label: 'Detail view' },
  { id: 4, gradient: 'from-stone-800 via-stone-500 to-stone-700', label: 'Back view' },
  { id: 5, gradient: 'from-amber-900/20 via-stone-800 to-stone-600', label: 'Interior' },
]

const reviews = [
  { id: 1, name: 'Alex M.', rating: 5, date: '2 weeks ago', text: 'Exceptional craftsmanship. The leather has developed a beautiful patina over just a few weeks of daily use. Worth every penny.', variant: 'Tan' },
  { id: 2, name: 'Jordan K.', rating: 5, date: '1 month ago', text: 'Minimalist perfection. Fits my 15" laptop with room to spare. The organization pockets are thoughtfully placed.', variant: 'Black' },
  { id: 3, name: 'Sam T.', rating: 4, date: '3 weeks ago', text: 'Beautifully designed and incredibly functional. Only wish the shoulder strap had a bit more padding for heavy loads.', variant: 'Olive' },
  { id: 4, name: 'Riley P.', rating: 5, date: '2 months ago', text: 'This is my third SÜE piece. The attention to detail is unmatched. The brass hardware develops a lovely aged look.', variant: 'Navy' },
]

const faqs = [
  { q: 'What materials is this made from?', a: 'Crafted from full-grain Italian leather sourced from certified tanneries in Tuscany. Hardware is solid brass with a brushed nickel finish. Lining is 100% organic cotton twill.' },
  { q: 'How should I care for the leather?', a: 'Wipe with a soft, dry cloth. For deeper cleaning, use a dedicated leather conditioner. Avoid prolonged exposure to direct sunlight or rain. The leather will develop a natural patina over time.' },
  { q: 'What fits inside?', a: 'Designed to fit laptops up to 15", tablets, notebooks, water bottles, and daily essentials. The main compartment measures 28×38×12 cm with two internal organizer pockets and a zippered security pocket.' },
  { q: 'Do you offer gift wrapping?', a: 'Yes, every SÜE order comes in a premium dust bag and recyclable gift box. Add a handwritten note at checkout.' },
  { q: 'What is the return policy?', a: 'Free returns within 30 days of delivery. Items must be unused with tags attached. We cover return shipping for first-time exchanges.' },
]

const specs = [
  { label: 'Material', value: 'Full-grain Italian leather' },
  { label: 'Hardware', value: 'Solid brass, brushed nickel' },
  { label: 'Lining', value: 'Organic cotton twill' },
  { label: 'Dimensions', value: '28 × 38 × 12 cm' },
  { label: 'Weight', value: '1.2 kg' },
  { label: 'Strap drop', value: '28 cm (adjustable to 50 cm)' },
  { label: 'Capacity', value: '15 L' },
  { label: 'Origin', value: 'Handmade in Florence, Italy' },
]

const recommendations = [
  { id: 1, name: 'Cardholder Wallet', price: 95, gradient: 'from-stone-700 via-stone-500 to-amber-800/30' },
  { id: 2, name: 'Tote Strap', price: 65, gradient: 'from-stone-800 via-amber-900/20 to-stone-600' },
  { id: 3, name: 'Leather Care Kit', price: 45, gradient: 'from-stone-600 via-stone-400 to-stone-500' },
  { id: 4, name: 'Weekender Duffle', price: 420, gradient: 'from-stone-900 via-stone-700 to-stone-500' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            'transition-colors duration-300',
            i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
          )}
          strokeWidth={1.5}
        />
      ))}
    </div>
  )
}

function ImageGallery({ images, onImageChange }: { images: GalleryImage[]; onImageChange?: (i: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomed, setZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const imgRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imgRef.current) return
    const rect = imgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }, [])

  const selectImage = useCallback((i: number) => {
    setActiveIndex(i)
    onImageChange?.(i)
    setZoomed(false)
  }, [onImageChange])

  const active = images[activeIndex]

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100" style={{ aspectRatio: '4/5' }}>
        <div
          ref={imgRef}
          className="relative h-full w-full cursor-crosshair overflow-hidden rounded-2xl"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
          role="img"
          aria-label={active.label}
        >
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={cn(
              'h-full w-full bg-gradient-to-br transition-transform duration-75',
              active.gradient
            )}
            style={
              zoomed
                ? {
                    transform: `scale(1.8)`,
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }
                : undefined
            }
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
            {active.label}
          </div>
          <button
            onClick={() => setZoomed(!zoomed)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none" role="tablist" aria-label="Product image thumbnails">
        {images.map((img, i) => (
          <button
            key={img.id}
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => selectImage(i)}
            className={cn(
              'relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden transition-all duration-300 ring-1',
              i === activeIndex
                ? 'ring-gray-900 ring-2 scale-105'
                : 'ring-gray-200 hover:ring-gray-400 opacity-70 hover:opacity-100'
            )}
          >
            <div className={cn('h-full w-full bg-gradient-to-br', img.gradient)} />
          </button>
        ))}
      </div>
    </div>
  )
}

function OdometerDigit({ digit, prevDigit }: { digit: number; prevDigit: number }) {
  const goingUp = digit > prevDigit || (prevDigit === 9 && digit === 0)
  const goingDown = digit < prevDigit || (prevDigit === 0 && digit === 9)
  const direction = goingUp ? -1 : goingDown ? 1 : 0

  return (
    <div className="relative w-[0.6em] h-[1em] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={digit}
          initial={{ y: direction * 80 }}
          animate={{ y: 0 }}
          exit={{ y: direction * -80, opacity: 0, filter: 'blur(1px)' }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center tabular-nums"
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

function OdometerCounter({ value }: { value: number }) {
  const [prevValue, setPrevValue] = useState(value)
  const digits = String(value).padStart(2, '0').split('').map(Number)
  const prevDigits = String(prevValue).padStart(2, '0').split('').map(Number)

  useEffect(() => {
    const timer = setTimeout(() => setPrevValue(value), 50)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className="flex items-center justify-center gap-[1px] tabular-nums">
      {digits.map((d, i) => (
        <OdometerDigit key={`${i}-${d}`} digit={d} prevDigit={prevDigits[i]} />
      ))}
    </div>
  )
}

function QuantitySelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="flex items-center justify-center w-11 h-11 border border-gray-300 rounded-l-xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus size={16} strokeWidth={1.5} />
      </button>
      <div className="flex items-center justify-center w-14 h-11 border-t border-b border-gray-300 text-sm font-medium text-gray-900 select-none overflow-hidden">
        <OdometerCounter value={value} />
      </div>
      <button
        onClick={() => onChange(Math.min(99, value + 1))}
        disabled={value >= 99}
        className="flex items-center justify-center w-11 h-11 border border-gray-300 rounded-r-xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <Plus size={16} strokeWidth={1.5} />
      </button>
    </div>
  )
}

function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
        aria-expanded={open}
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} strokeWidth={1.5} className="text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-gray-600">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductCard({
  name, price, gradient, index,
}: {
  name: string
  price: number
  gradient: string
  index: number
}) {
  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 mb-4" style={{ aspectRatio: '4/5' }}>
        <div className={cn('h-full w-full bg-gradient-to-br transition-transform duration-700 group-hover:scale-105', gradient)} />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        <button
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={15} strokeWidth={1.5} />
        </button>
      </div>
      <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-600 transition-colors">{name}</h3>
      <p className="text-sm text-gray-500 mt-0.5">${price}</p>
    </motion.a>
  )
}

export default function ProductDetail() {
  const [selectedColor, setSelectedColor] = useState(swatches[0])
  const [selectedSize, setSelectedSize] = useState(sizes[1])
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'faq'>('details')
  const [isStickyVisible, setIsStickyVisible] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStickyVisible(!entry.isIntersecting)
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    )
    const el = ctaRef.current
    if (el) observer.observe(el)
    return () => { if (el) observer.unobserve(el) }
  }, [])

  const handleAddToCart = () => {
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="font-['-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,Helvetica,Arial,sans-serif']">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8"
        aria-label="Breadcrumb"
      >
        <a href="#" className="hover:text-gray-600 transition-colors">Home</a>
        <ChevronRight size={12} strokeWidth={1.5} />
        <a href="#" className="hover:text-gray-600 transition-colors">Bags</a>
        <ChevronRight size={12} strokeWidth={1.5} />
        <span className="text-gray-700">The Minimalist Carry</span>
      </motion.nav>

      {/* Hero section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 mb-16 sm:mb-20 lg:mb-28"
      >
        {/* Gallery */}
        <motion.div variants={itemVariants} className="lg:col-span-7">
          <ImageGallery images={galleryImages} />
        </motion.div>

        {/* Product info */}
        <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col">
          <div ref={ctaRef} />

          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-widest uppercase text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              <Sparkles size={12} strokeWidth={1.5} />
              New Arrival
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium tracking-widest uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              <Leaf size={12} strokeWidth={1.5} />
              Sustainable
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 leading-[1.08] mb-3">
            The Minimalist Carry
          </h1>

          {/* Rating row */}
          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={4.8} />
            <span className="text-sm text-gray-500">
              4.8 <span className="text-gray-300 mx-1">·</span> 128 reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">$285</span>
            <span className="text-sm text-gray-400 line-through">$325</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">12% off</span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base leading-relaxed text-gray-600 mb-8 max-w-lg">
            Crafted from full-grain Italian leather with precision-machined brass hardware. A refined carry solution designed for the modern minimalist — spacious enough for daily essentials, elegant enough for any setting.
          </p>

          {/* Color swatches */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Color</span>
              <span className="text-sm text-gray-900">{selectedColor.name}</span>
            </div>
            <div className="flex gap-3" role="radiogroup" aria-label="Color selection">
              {swatches.map((swatch) => (
                <button
                  key={swatch.name}
                  role="radio"
                  aria-checked={selectedColor.name === swatch.name}
                  onClick={() => setSelectedColor(swatch)}
                  className={cn(
                    'relative w-9 h-9 rounded-full ring-1 transition-all duration-300',
                    selectedColor.name === swatch.name
                      ? 'ring-2 ring-offset-2 ring-gray-900 scale-110'
                      : 'ring-gray-300 hover:ring-gray-500 hover:scale-105'
                  )}
                  style={{ backgroundColor: swatch.hex }}
                  aria-label={swatch.name}
                >
                  {selectedColor.name === swatch.name && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check size={14} className={swatch.name === 'Tan' ? 'text-gray-900' : 'text-white'} strokeWidth={2.5} />
                    </motion.span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Size</span>
              <button className="text-xs text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors">
                Size Guide
              </button>
            </div>
            <div className="flex gap-2" role="radiogroup" aria-label="Size selection">
              {sizes.map((size) => (
                <button
                  key={size.label}
                  role="radio"
                  aria-checked={selectedSize.label === size.label}
                  aria-disabled={!size.available}
                  disabled={!size.available}
                  onClick={() => size.available && setSelectedSize(size)}
                  className={cn(
                    'flex items-center justify-center min-w-[3rem] h-11 px-4 rounded-xl text-sm font-medium transition-all duration-300',
                    !size.available && 'opacity-30 cursor-not-allowed line-through text-gray-400 border border-gray-200',
                    size.available && selectedSize.label === size.label && 'bg-gray-900 text-white border border-gray-900',
                    size.available && selectedSize.label !== size.label && 'bg-white text-gray-700 border border-gray-300 hover:border-gray-900 hover:text-gray-900'
                  )}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Actions */}
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-4">
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={cn(
                  'flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-300',
                  wishlisted
                    ? 'border-red-200 bg-red-50 text-red-500'
                    : 'border-gray-300 text-gray-500 hover:border-gray-900 hover:text-gray-900'
                )}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={17} strokeWidth={1.5} className={wishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>
          </div>

          {/* Add to Cart + Buy Now */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              className={cn(
                'flex-1 h-14 rounded-xl font-medium text-sm tracking-wide transition-all duration-300 relative overflow-hidden',
                addedToCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
              )}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <Check size={18} strokeWidth={2.5} />
                    Added to Cart
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} strokeWidth={1.5} />
                    Add to Cart — ${(285 * quantity).toLocaleString()}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button className="flex-1 sm:flex-none sm:px-8 h-14 rounded-xl font-medium text-sm tracking-wide border border-gray-300 text-gray-800 hover:bg-gray-50 hover:border-gray-900 active:scale-[0.98] transition-all duration-300">
              Buy Now
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, label: 'Free shipping', sub: 'On orders over $200' },
              { icon: Shield, label: 'Secure checkout', sub: 'SSL encrypted' },
              { icon: RotateCcw, label: 'Free returns', sub: 'Within 30 days' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-2.5 bg-gray-50 rounded-xl p-3">
                <Icon size={16} strokeWidth={1.5} className="text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-700">{label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping info */}
          <div className="rounded-xl border border-gray-200 divide-y divide-gray-100">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Package size={16} strokeWidth={1.5} className="text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">Free shipping on orders over $200</p>
                <p className="text-xs text-gray-400 mt-0.5">Estimated delivery: 3–7 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Clock size={16} strokeWidth={1.5} className="text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">Order within the next <span className="font-medium text-gray-900">4 hours</span> for dispatch today</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Sticky mobile purchase bar */}
      <AnimatePresence>
        {isStickyVisible && (
          <motion.div
            ref={stickyRef}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-3 sm:py-4 shadow-lg lg:hidden"
          >
            <div className="flex items-center gap-4 max-w-7xl mx-auto">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">The Minimalist Carry</p>
                <p className="text-sm text-gray-500">$285</p>
              </div>
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <button
                onClick={handleAddToCart}
                className="h-11 px-6 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 whitespace-nowrap"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Below the fold - Details, Specs, FAQs */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="mb-16 sm:mb-20 lg:mb-28"
      >
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left - Tabs */}
          <div className="lg:col-span-7">
            {/* Tab buttons */}
            <div className="flex gap-8 border-b border-gray-200 mb-8" role="tablist">
              {(['details', 'specs', 'faq'] as const).map((tab) => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'pb-3 text-sm font-medium transition-all duration-300 relative',
                    activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  {tab === 'details' ? 'Product Details' : tab === 'specs' ? 'Specifications' : 'FAQs'}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="prose-sm max-w-none text-gray-600 leading-relaxed space-y-4"
                >
                  <p className="text-gray-600">
                    Every detail of The Minimalist Carry is intentional. The full-grain Italian leather develops a rich patina that tells your story. Brass hardware ages gracefully, shifting from brushed nickel to a warm, lived-in character.
                  </p>
                  <p className="text-gray-600">
                    The main compartment opens wide for easy access, with a padded laptop sleeve, two slip pockets for documents, and a zippered security pocket. The exterior features a magnetic snap pocket for quick-access items like your phone or wallet.
                  </p>
                  <p className="text-gray-600">
                    Hand-stitched in Florence, Italy, by artisans with decades of experience. Each piece is individually numbered and arrives with a certificate of authenticity.
                  </p>
                  <ul className="space-y-2 pl-0 list-none mt-6">
                    {[
                      'Padded laptop compartment fits up to 15"',
                      'Magnetic snap exterior pocket',
                      'Internal organizer with 6 card slots',
                      'Detachable adjustable shoulder strap',
                      'YKK zippers with custom leather pulls',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                        <Check size={14} strokeWidth={2.5} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <dl className="divide-y divide-gray-100">
                    {specs.map((spec) => (
                      <div key={spec.label} className="flex items-baseline gap-4 py-3.5">
                        <dt className="text-sm text-gray-400 w-28 shrink-0">{spec.label}</dt>
                        <dd className="text-sm text-gray-900">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              )}

              {activeTab === 'faq' && (
                <motion.div
                  key="faq"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {faqs.map((faq) => (
                    <AccordionItem key={faq.q} title={faq.q}>
                      {faq.a}
                    </AccordionItem>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right - Sticky summary card */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <motion.div variants={scaleIn} className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Why choose SÜE?</h3>
                <div className="space-y-4">
                  {[
                    { icon: Award, title: 'Artisan Crafted', desc: 'Handmade in Florence by master leatherworkers' },
                    { icon: Leaf, title: 'Sustainably Sourced', desc: 'Full-grain leather from Gold-rated tanneries' },
                    { icon: RotateCcw, title: '30-Day Trial', desc: 'Not in love? Free returns, no questions asked' },
                    { icon: Shield, title: '2-Year Warranty', desc: 'Covers manufacturing defects and hardware' },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <Icon size={16} strokeWidth={1.5} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Customer Reviews */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="mb-16 sm:mb-20 lg:mb-28"
      >
        <motion.div variants={itemVariants} className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-2">Customer Reviews</h2>
            <div className="flex items-center gap-3">
              <StarRating rating={4.8} size={20} />
              <span className="text-sm text-gray-500">4.8 average from 128 reviews</span>
            </div>
          </div>
          <button className="hidden sm:inline-flex h-11 px-6 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-900 transition-all duration-300 items-center gap-2">
            Write a Review
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-sm transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                </div>
                <StarRating rating={review.rating} size={14} />
              </div>
              <p className="text-sm leading-relaxed text-gray-600 mb-2">{review.text}</p>
              <span className="text-xs text-gray-400">Color: {review.variant}</span>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="mt-6 text-center sm:hidden">
          <button className="h-11 px-6 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Write a Review
          </button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            View all 128 reviews
            <ChevronRight size={15} strokeWidth={1.5} />
          </button>
        </motion.div>
      </motion.section>

      {/* You May Also Like */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={containerVariants}
        className="mb-16 sm:mb-20 lg:mb-28"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-2">You May Also Like</h2>
          <p className="text-sm text-gray-500 mb-8">Complete your everyday carry collection</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {recommendations.map((product, i) => (
            <ProductCard key={product.id} {...product} index={i} />
          ))}
        </div>
      </motion.section>

      {/* Newsletter / Footer CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl bg-gray-50 border border-gray-200 p-8 sm:p-12 lg:p-16 text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight mb-3">
          Join the SÜE Community
        </h2>
        <p className="text-sm sm:text-base text-gray-500 mb-6 max-w-md mx-auto">
          Be the first to know about new arrivals, limited editions, and exclusive offers.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 h-12 px-5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all"
            required
            aria-label="Email for newsletter"
          />
          <button
            type="submit"
            className="h-12 px-8 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all duration-300 whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </motion.section>
    </div>
  )
}
