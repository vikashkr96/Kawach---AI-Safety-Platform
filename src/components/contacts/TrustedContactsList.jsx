import React, { useState } from 'react';
import { UserPlus, Trash2, Phone, Mail, MapPin, Shield, Star, ExternalLink } from 'lucide-react';
import { useSafety } from '../../context/SafetyContext';

export default function TrustedContactsList() {
  const { contacts, addContact, removeContact } = useSafety();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Friend / Roommate');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addContact({
      name: name.trim(),
      relationship,
      phone: phone.trim(),
      email: email.trim() || 'contact@example.com',
      city: 'Bengaluru, India',
      distanceKm: 1.2,
      isPrimary: contacts.length === 0
    });

    setName('');
    setPhone('+91 ');
    setEmail('');
    setShowAddModal(false);
  };

  const cleanPhoneForDial = (ph) => {
    return ph.replace(/[^+\d]/g, '');
  };

  return (
    <div className="glass-card rounded-3xl p-5 space-y-4 shadow-xl border border-slate-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Trusted Safety Circle ({contacts.length}/5)</span>
          </h3>
          <p className="text-xs text-slate-400">Notified instantly via live feed, SMS & native call triggers</p>
        </div>

        {contacts.length < 5 && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {/* Contacts List */}
      <div className="space-y-2.5">
        {contacts.map((contact, idx) => (
          <div
            key={contact.id}
            className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 flex items-center justify-between glass-card-hover"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 font-extrabold text-xs shadow-inner">
                #{idx + 1}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-extrabold text-white">{contact.name}</h4>
                  {contact.isPrimary && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-cyan-400" /> Primary
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">{contact.relationship}</p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <a
                    href={`tel:${cleanPhoneForDial(contact.phone)}`}
                    className="flex items-center gap-1 text-cyan-400 hover:underline font-mono font-bold bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-800/40"
                    title="Click to dial phone number"
                  >
                    <Phone className="w-3 h-3" /> {contact.phone}
                  </a>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-1 text-slate-300 hover:underline bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800"
                      title="Click to send email"
                    >
                      <Mail className="w-3 h-3 text-slate-400" /> {contact.email}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {contacts.length > 1 && (
              <button
                onClick={() => removeContact(contact.id)}
                className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-slate-900 transition-colors"
                title="Remove contact"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-700/60">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Trusted Contact</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Relationship</label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="e.g. Sister, Parent, Roommate"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (Indian / Int'l)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
